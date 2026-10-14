// Background Service Worker for TypeBridge

let sidePanelPort = null;

const emptySession = () => ({
  sections: [],
  sessionStartedAt: null,
  appliedCount: 0,
  skippedCount: 0,
  totalCount: 0
});

// In-memory copies. The service worker can be terminated at any time, so both
// are mirrored to chrome.storage.session and reloaded lazily.
let sessionState = emptySession();
// The tab + frame where the user last focused an editable field
let focusTarget = null;
let stateLoaded = null;

function loadState() {
  if (!stateLoaded) {
    stateLoaded = chrome.storage.session.get(['sessionState', 'focusTarget']).then((stored) => {
      if (stored.sessionState) sessionState = stored.sessionState;
      if (stored.focusTarget) focusTarget = stored.focusTarget;
    }).catch(() => {});
  }
  return stateLoaded;
}

function saveSession() {
  chrome.storage.session.set({ sessionState }).catch(() => {});
}

function countStatuses(sections) {
  return {
    appliedCount: sections.filter(s => s.status === 'applied').length,
    skippedCount: sections.filter(s => s.status === 'skipped').length,
    totalCount: sections.length
  };
}

// Open the side panel when the toolbar icon is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((e) => console.error('TypeBridge: Failed to set panel behavior:', e));

// Listen for connection from side panel
chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name !== 'sidepanel') return;
  sidePanelPort = port;
  console.log('TypeBridge: Side panel connected');

  port.onDisconnect.addListener(() => {
    if (sidePanelPort === port) sidePanelPort = null;
    console.log('TypeBridge: Side panel disconnected');
  });

  await loadState();
  // Send current session state to newly connected panel
  try {
    port.postMessage({ type: 'SESSION_RESTORE', payload: sessionState });
  } catch (e) {}
});

function forwardToPanel(message) {
  if (!sidePanelPort) return;
  try {
    sidePanelPort.postMessage(message);
  } catch (e) {
    console.warn('TypeBridge: Failed to forward to side panel port', e);
  }
}

async function ensureContentScript(tabId) {
  try {
    // ping first — if content script already injected it will respond
    await chrome.tabs.sendMessage(tabId, { type: 'PING' });
  } catch {
    // not injected yet (e.g. tab was open before the extension loaded) — inject now
    console.log('TypeBridge: Injecting content script into tab:', tabId);
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ['src/content.js']
    });
  }
}

async function getActiveTab() {
  // Prefer the tab where the user last focused a field, if it's still the visible tab in its window
  if (focusTarget) {
    try {
      const tab = await chrome.tabs.get(focusTarget.tabId);
      if (tab?.active) return tab;
    } catch (e) {
      focusTarget = null; // tab was closed
    }
  }
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
}

// Runs in the builder page's MAIN world (serialized by chrome.scripting, so it must be self-contained).
// Writes the copy through the builder's own data model so it is saved when the user publishes.
function applyThroughBuilderApi(adapter, text) {
  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const blocks = text.split(/\n\s*\n/).map(b => escapeHtml(b.trim()).replace(/\n/g, '<br>')).filter(Boolean);

  try {
    if (adapter.type === 'elementor') {
      const editor = window.elementor;
      const commands = window.$e;
      if (!editor?.getContainer || !commands?.run) return { ok: false, reason: 'Elementor editor API not found.' };

      let container = editor.getContainer(adapter.elementId);
      if (!container) return { ok: false, reason: 'Elementor element not found.' };

      const defaultKeys = { 'text-editor': 'editor', heading: 'title', button: 'text' };
      let key = adapter.settingKey || defaultKeys[container.model?.get('widgetType')];
      if (!key) return { ok: false, reason: 'This Elementor widget has no editable text field.' };

      // Repeater fields look like "tabs.0.tab_title" (same resolution Elementor's inline editing uses)
      const parts = key.split('.');
      if (parts.length === 3) {
        container = container.repeaters?.[parts[0]]?.children?.[parts[1]];
        key = parts[2];
        if (!container) return { ok: false, reason: 'Elementor repeater item not found.' };
      }

      const controlType = (container.controls || container.settings?.controls || {})[key]?.type;
      const value = controlType === 'wysiwyg'
        ? blocks.map(b => `<p>${b}</p>`).join('')
        : controlType === 'text'
          ? text.replace(/\s*\n+\s*/g, ' ').trim()
          : text;

      commands.run('document/elements/settings', {
        container,
        settings: { [key]: value },
        options: { external: true }
      });

      // Read the value back from Elementor's model — this is what gets saved on Update/Publish
      const saved = container.settings?.get?.(key);
      return {
        ok: true,
        confirmed: saved === value,
        // While inline editing is active Elementor pauses rendering; the open editor must be written too
        domWriteNeeded: container.view?.allowRender === false
      };
    }

    if (adapter.type === 'gutenberg') {
      const data = window.wp?.data;
      if (!data) return { ok: false, reason: 'WordPress block editor API not found.' };
      const block = data.select('core/block-editor').getBlock(adapter.clientId);
      if (!block) return { ok: false, reason: 'Block not found.' };

      const attributeFor = {
        'core/paragraph': 'content',
        'core/heading': 'content',
        'core/button': 'text',
        'core/preformatted': 'content',
        'core/verse': 'content',
        'core/list-item': 'content'
      };
      const attribute = attributeFor[block.name];
      if (!attribute) return { ok: false, reason: `Unsupported block type: ${block.name}` };

      const html = blocks.join('<br><br>');
      data.dispatch('core/block-editor').updateBlockAttributes(adapter.clientId, { [attribute]: html });

      const saved = data.select('core/block-editor').getBlockAttributes(adapter.clientId)?.[attribute];
      const plain = (h) => new DOMParser().parseFromString(String(h ?? ''), 'text/html').body.textContent.replace(/\s+/g, ' ').trim();
      return { ok: true, confirmed: plain(saved) === plain(html) };
    }
  } catch (e) {
    return { ok: false, reason: e?.message || String(e) };
  }
  return { ok: false, reason: 'Unknown builder.' };
}

async function runBuilderAdapter(tabId, adapter, text) {
  // The builder's editor globals (elementor/$e, wp.data) live in the top frame
  const [injection] = await chrome.scripting.executeScript({
    target: { tabId, frameIds: [0] },
    world: 'MAIN',
    func: applyThroughBuilderApi,
    args: [adapter, text]
  });
  return injection?.result || { ok: false, reason: 'Builder adapter did not run.' };
}

async function sendToFocusedFrame(tabId, message) {
  // Only the frame that owns the focused field should apply the copy.
  const frameId = focusTarget && focusTarget.tabId === tabId ? focusTarget.frameId : 0;
  try {
    return await chrome.tabs.sendMessage(tabId, message, { frameId });
  } catch (e) {
    // The focused frame may have navigated away; fall back to the top frame
    if (frameId === 0) throw e;
    return await chrome.tabs.sendMessage(tabId, message, { frameId: 0 });
  }
}

async function applyCopy(payload) {
  await loadState();
  const tab = await getActiveTab();
  if (!tab) throw new Error('No active tab found.');

  await ensureContentScript(tab.id);

  let result = await sendToFocusedFrame(tab.id, { type: 'APPLY_COPY', payload });

  if (result?.needsAdapter) {
    const adapter = result.needsAdapter;
    const { originalText, selector } = result;
    const runAdapter = async () => {
      try {
        return await runBuilderAdapter(tab.id, adapter, payload.newText);
      } catch (e) {
        return { ok: false, reason: e.message };
      }
    };

    let adapterResult = await runAdapter();
    console.log('TypeBridge: builder adapter', adapter.type, adapterResult);

    if (adapterResult.ok && adapterResult.domWriteNeeded) {
      // Inline editing is open: put the text in the open editor so it doesn't overwrite
      // the model with the old copy later, then set the model value again.
      await sendToFocusedFrame(tab.id, { type: 'APPLY_COPY', payload: { ...payload, adapter, forceGeneric: true, skipVerify: true } });
      adapterResult = await runAdapter();
    }

    // The builder's own model holds the new copy, so it will render and be saved on publish
    if (adapterResult.ok && adapterResult.confirmed) return { ok: true, originalText, selector };

    // API route unavailable: write the DOM directly and verify it sticks
    result = await sendToFocusedFrame(tab.id, { type: 'APPLY_COPY', payload: { ...payload, adapter, forceGeneric: true } });
  }

  if (!result || !result.ok) {
    throw new Error(result?.reason || 'Click into a text field in your builder, then try again.');
  }
  return result;
}

// Main Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_SESSION') {
    const sections = message.payload.sections;
    sessionState = {
      ...emptySession(),
      sections,
      sessionStartedAt: Date.now(),
      ...countStatuses(sections)
    };
    saveSession();
    return false;
  }

  if (message.type === 'SESSION_UPDATE') {
    loadState().then(() => {
      const sections = message.payload.sections;
      sessionState = { ...sessionState, sections, ...countStatuses(sections) };
      saveSession();
    });
    return false;
  }

  if (message.type === 'RESET_SESSION') {
    sessionState = emptySession();
    chrome.storage.session.remove('sessionState').catch(() => {});
    return false;
  }

  if (message.type === 'APPLY_COPY') {
    applyCopy(message.payload)
      .then((result) => {
        forwardToPanel({
          type: 'APPLY_SUCCESS',
          payload: {
            sectionId: message.payload.sectionId,
            part: message.payload.part,
            appliedAt: Date.now(),
            originalText: result.originalText ?? null,
            targetSelector: result.selector ?? null
          }
        });
      })
      .catch((e) => {
        console.error('TypeBridge: Apply failed', e);
        forwardToPanel({
          type: 'APPLY_ERROR',
          payload: { sectionId: message.payload.sectionId, reason: friendlyError(e) }
        });
      });
    return false;
  }

  if (message.type === 'FOCUS_DETECTED') {
    if (sender.tab) {
      focusTarget = { tabId: sender.tab.id, frameId: sender.frameId ?? 0 };
      chrome.storage.session.set({ focusTarget }).catch(() => {});
    }
    forwardToPanel(message);
    return false;
  }

  if (message.type === 'FORCE_INJECT') {
    loadState().then(getActiveTab)
      .then((tab) => tab && ensureContentScript(tab.id))
      .catch((e) => forwardToPanel({ type: 'APPLY_ERROR', payload: { reason: friendlyError(e) } }));
    return false;
  }

  return false;
});

function friendlyError(e) {
  const msg = e?.message || String(e);
  if (/cannot be scripted|chrome:\/\/|Cannot access|extensions gallery/i.test(msg)) {
    return 'TypeBridge cannot run on this page.';
  }
  if (/Receiving end does not exist|Could not establish connection/i.test(msg)) {
    return 'Lost connection to the page. Reload the builder tab and try again.';
  }
  return msg;
}

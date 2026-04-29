/**
 * background.js
 * Chrome Service Worker
 */

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id });
});

async function ensureContentScript(tabId) {
  try {
    // ping first — if content script already injected it will respond
    await chrome.tabs.sendMessage(tabId, { type: 'PING' });
  } catch {
    // not injected yet — inject now
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['src/content.js'] // vite-plugin-web-extension handles path resolution in dev/build
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // From panel -> content
  if (message.type === 'APPLY_COPY') {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('https://chrome.google.com/webstore')) {
            chrome.runtime.sendMessage({
              type: 'APPLY_ERROR',
              payload: { sectionId: message.payload.sectionId, reason: 'Cannot inject copy here. Chrome restricts extensions on this specific page. Try on a real website or page builder.' }
            }).catch(() => {});
            return;
          }
          await ensureContentScript(tab.id);
          chrome.tabs.sendMessage(tab.id, message);
        }
      } catch (e) {
        console.error('Failed to inject/send APPLY_COPY', e);
        chrome.runtime.sendMessage({
          type: 'APPLY_ERROR',
          payload: { sectionId: message.payload.sectionId, reason: 'Cannot inject copy here. Chrome restricts extensions on this specific page. Try on a real website or page builder.' }
        }).catch(() => {});
      }
    })();
    return true; // async
  }
  
  if (message.type === 'EXIT_SELECT_MODE') {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          chrome.tabs.sendMessage(tab.id, message).catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    })();
    return true;
  }

  if (message.type === 'RESET_SESSION') {
    chrome.storage.session.remove('sessionData', () => {
      sendResponse({ status: 'ok' });
    });
    return true; // Keep channel open for sendResponse
  }

  // From content -> panel (and storage updates)
  if (message.type === 'FOCUS_DETECTED') {
    // Forward to side panel
    chrome.runtime.sendMessage(message).catch(() => {});
    return false;
  }

  if (message.type === 'APPLY_SUCCESS') {
    (async () => {
      try {
        const { sessionData } = await chrome.storage.session.get('sessionData');
        if (sessionData && sessionData.sections) {
          const section = sessionData.sections.find(s => s.id === message.payload.sectionId);
          if (section) {
            // Update stats
            if (section.status !== 'applied') {
              sessionData.appliedCount = (sessionData.appliedCount || 0) + 1;
            }
            
            // Update section
            section.status = 'applied';
            section.appliedAt = Date.now();
            section.originalText = message.payload.originalText;
            section.targetSelector = message.payload.targetSelector;
            
            await chrome.storage.session.set({ sessionData });
            
            // Forward updated section back to panel
            chrome.runtime.sendMessage({
              type: 'APPLY_SUCCESS',
              payload: { section }
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.error('Error updating session data', err);
      }
    })();
    return true;
  }

  if (message.type === 'APPLY_ERROR') {
    chrome.runtime.sendMessage(message).catch(() => {});
    return false;
  }
});

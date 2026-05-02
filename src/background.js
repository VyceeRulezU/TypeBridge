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
      target: { tabId, allFrames: true },
      files: ['src/content.js']
    });
  }
}

const pendingApplies = new Set();
let sidePanelPort = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    sidePanelPort = port;
    port.onDisconnect.addListener(() => {
      sidePanelPort = null;
    });
  }
});

function forwardToPanel(message) {
  if (sidePanelPort) {
    try {
      sidePanelPort.postMessage(message);
      return;
    } catch (e) {
      sidePanelPort = null;
    }
  }
  chrome.runtime.sendMessage(message).catch(() => {});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // From panel -> content
  if (message.type === 'APPLY_COPY') {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('https://chrome.google.com/webstore')) {
            forwardToPanel({
              type: 'APPLY_ERROR',
              payload: { sectionId: message.payload.sectionId, reason: 'Cannot inject copy here. Chrome restricts extensions on this specific page. Try on a real website or page builder.' }
            });
            return;
          }
          await ensureContentScript(tab.id);
          
          const sectionId = message.payload.sectionId;
          pendingApplies.add(sectionId);

          // Broadcast to ALL frames using executeScript
          chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: (payload) => {
              window.dispatchEvent(new CustomEvent('TYPEBRIDGE_APPLY_BROADCAST', { detail: payload }));
            },
            args: [message.payload]
          });

          // Timeout if no success reported
          setTimeout(() => {
            if (pendingApplies.has(sectionId)) {
              pendingApplies.delete(sectionId);
              forwardToPanel({
                type: 'APPLY_ERROR',
                payload: { sectionId, reason: 'No active element found. Click a text field in Webflow first.' }
              });
            }
          }, 1000);
        }
      } catch (e) {
        console.error('Failed to broadcast APPLY_COPY', e);
        forwardToPanel({
          type: 'APPLY_ERROR',
          payload: { sectionId: message.payload.sectionId, reason: 'Failed to reach page elements. Try refreshing.' }
        });
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
    forwardToPanel(message);
    return false;
  }

  if (message.type === 'APPLY_SUCCESS') {
    // Clear pending timeout
    pendingApplies.delete(message.payload.sectionId);

    (async () => {
      try {
        const { sessionData } = await chrome.storage.session.get('sessionData');
        if (sessionData && sessionData.sections) {
          const sectionId = message.payload.sectionId;
          const section = sessionData.sections.find(s => s.id === sectionId);
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
            forwardToPanel({
              type: 'APPLY_SUCCESS',
              payload: { section }
            });
          }
        }
      } catch (err) {
        console.error('Error updating session data', err);
      }
    })();
    return true;
  }

  if (message.type === 'HEARTBEAT') {
    forwardToPanel({ type: 'FOCUS_DETECTED', payload: { previewText: null } });
    return false;
  }

  if (message.type === 'APPLY_ERROR') {
    forwardToPanel(message);
    return false;
  }
});

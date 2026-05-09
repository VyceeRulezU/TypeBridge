// Background Service Worker for TypeBridge

let sidePanelPort = null;

// Track the active session state
let sessionState = {
  sections: [],
  sessionStartedAt: null,
  appliedCount: 0,
  skippedCount: 0,
  totalCount: 0
};

// Listen for connection from side panel
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    sidePanelPort = port;
    console.log('TypeBridge: Side panel connected');
    
    // Send current session state to newly connected panel
    port.postMessage({ type: 'SESSION_RESTORE', payload: sessionState });

    port.onDisconnect.addListener(() => {
      sidePanelPort = null;
      console.log('TypeBridge: Side panel disconnected');
    });
  }
});

// Helper to forward messages to the side panel port
function forwardToPanel(message) {
  if (sidePanelPort) {
    try {
      sidePanelPort.postMessage(message);
    } catch (e) {
      console.warn('TypeBridge: Failed to forward to side panel port', e);
      // Fallback to broadcast
      chrome.runtime.sendMessage(message).catch(() => {});
    }
  } else {
    // Fallback broadcast
    chrome.runtime.sendMessage(message).catch(() => {});
  }
}

// User's requested ensureContentScript
async function ensureContentScript(tabId) {
  try {
    // ping first — if content script already injected it will respond
    await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    console.log('TypeBridge: Content script already present in tab:', tabId);
  } catch {
    // not injected yet — inject now
    console.log('TypeBridge: Injecting content script into tab:', tabId);
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ['src/content.js']
    });
  }
}

// Open side panel on icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (e) {
    console.error('TypeBridge: Failed to open side panel:', e);
  }
});

// Main Message Listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('TypeBridge Background: Received', message.type, 'from', sender.tab ? 'tab' : 'panel');

  if (message.type === 'START_SESSION') {
    sessionState = {
      sections: message.payload.sections,
      sessionStartedAt: Date.now(),
      appliedCount: 0,
      skippedCount: 0,
      totalCount: message.payload.sections.length
    };
    chrome.storage.session.set({ sessionState });
    return false;
  }

  if (message.type === 'APPLY_COPY') {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          await ensureContentScript(tab.id);
          
          // Use user's requested logic: forward to content script
          chrome.tabs.sendMessage(tab.id, message);
          
          // Also broadcast to all frames as a fallback for complex iframes
          chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: (payload) => {
              window.dispatchEvent(new CustomEvent('TYPEBRIDGE_APPLY_BROADCAST', { detail: payload }));
            },
            args: [message.payload]
          });
        }
      } catch (e) {
        console.error('TypeBridge: Apply failed', e);
        forwardToPanel({ type: 'APPLY_ERROR', payload: { reason: e.message } });
      }
    })();
    return true;
  }

  if (message.type === 'EXIT_SELECT_MODE') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    });
    return false;
  }

  if (message.type === 'FOCUS_DETECTED') {
    forwardToPanel(message);
    return false;
  }

  if (message.type === 'APPLY_SUCCESS') {
    // User requested logic: Update session state in storage
    sessionState.appliedCount++;
    chrome.storage.session.set({ sessionState });
    forwardToPanel(message);
    return false;
  }

  if (message.type === 'APPLY_ERROR') {
    forwardToPanel(message);
    return false;
  }

  if (message.type === 'RESET_SESSION') {
    sessionState = { sections: [], appliedCount: 0, skippedCount: 0, totalCount: 0 };
    chrome.storage.session.remove('sessionState');
    return false;
  }

  if (message.type === 'FORCE_INJECT') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) ensureContentScript(tab.id);
    });
    return false;
  }
});

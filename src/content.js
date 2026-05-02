/**
 * content.js
 * Injected into active tab
 */
import { getSelector } from './utils/selectorEngine.js';

let lastFocusedElement = null;
let isActive = true;

// Listen on document for focusin and click
// Listen on document for focusin, click, and mousedown
document.addEventListener('focusin', handleFocus, true);
document.addEventListener('click', handleFocus, true);
document.addEventListener('mousedown', (e) => {
  if (!isActive) return;
  chrome.runtime.sendMessage({ type: 'HEARTBEAT' });
  handleFocus(e);
}, true);

document.addEventListener('selectionchange', () => {
  if (!isActive) return;
  const el = getDeepActiveElement();
  if (el && el !== document.body && (el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
    handleFocus({ target: el, type: 'selection' });
  }
});

function getTargetElement(e) {
  if (e.composedPath) {
    const path = e.composedPath();
    return path[0];
  }
  return e.target;
}

function handleFocus(e) {
  if (!isActive) return;
  
  let el = getTargetElement(e);
  if (!el) return;

  // Search for the first editable element in the hierarchy if we didn't land on one
  let target = el;
  while (target && target !== document.body) {
    if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      el = target;
      break;
    }
    target = target.parentElement;
  }

  // If still not editable, use elementsFromPoint on click
  if (e.type === 'click' && !(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
    const elementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
    for (const cand of elementsAtPoint) {
      if (cand.tagName === 'INPUT' || cand.tagName === 'TEXTAREA' || cand.isContentEditable) {
        el = cand;
        break;
      }
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN'].includes(cand.tagName)) {
        el = cand;
        break;
      }
    }
  }
  
  const isEditable =
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.isContentEditable;
    
  if (!isEditable && (e.type === 'click' || e.type === 'mousedown')) {
    if (el.tagName === 'BODY' || el.tagName === 'HTML' || el.tagName === 'DIV' && el.children.length > 5) return;
    lastFocusedElement = el;
    
    chrome.runtime.sendMessage({
      type: 'FOCUS_DETECTED',
      payload: { 
        tagName: el.tagName.toLowerCase(), 
        isContentEditable: false,
        previewText: getPreviewText(el),
        selector: getSelector(el)
      }
    });
    return;
  }

  if (!isEditable) return;
  if (lastFocusedElement === el && (e.type === 'poll' || e.type === 'selection')) return; 
  
  lastFocusedElement = el;

  const payload = {
    tagName: el.tagName.toLowerCase(),
    isContentEditable: el.isContentEditable,
    previewText: getPreviewText(el),
    selector: getSelector(el)
  };

  chrome.runtime.sendMessage({
    type: 'FOCUS_DETECTED',
    payload
  });
}

function getDeepActiveElement() {
  let el = document.activeElement;
  while (el && el.shadowRoot && el.shadowRoot.activeElement) {
    el = el.shadowRoot.activeElement;
  }
  return el;
}

// Polling for focus (fallback for builders that intercept all events)
setInterval(() => {
  if (!isActive) return;
  const el = getDeepActiveElement();
  if (el && el !== document.body && el !== lastFocusedElement && (el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
    handleFocus({ target: el, type: 'poll' });
  }
}, 500);

function getPreviewText(el) {
  if (!el) return '';
  let text = '';
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    text = el.value || '';
  } else {
    text = el.innerText || el.textContent || '';
  }
  return text.trim().substring(0, 150); // Increased limit for better matching
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'APPLY_COPY') {
    handleApply(message.payload);
  } else if (message.type === 'EXIT_SELECT_MODE') {
    cleanup();
  } else if (message.type === 'PING') {
    sendResponse({ status: 'ok' });
  }
});

// Listen for broadcasted events from background script (handles all frames)
window.addEventListener('TYPEBRIDGE_APPLY_BROADCAST', (e) => {
  handleApply(e.detail);
});

function handleApply(payload) {
  // Fallback to activeElement if lastFocusedElement isn't set
  const deepActive = getDeepActiveElement();
  if (!lastFocusedElement && deepActive && deepActive !== document.body) {
    lastFocusedElement = deepActive;
  }

  if (!lastFocusedElement) {
    return;
  }

  try {
    const element = lastFocusedElement;
    const newText = payload.newText;
    const originalText = getPreviewText(element);
    const targetSelector = getSelector(element);

    if (element.tagName === 'INPUT') {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      ).set;
      nativeInputValueSetter.call(element, newText);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (element.tagName === 'TEXTAREA') {
      const nativeTextareaSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      ).set;
      nativeTextareaSetter.call(element, newText);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (element.isContentEditable) {
      element.focus();
      element.innerText = newText;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: newText }));
    } else {
      // Fallback for elements tracked via click that might not be strictly editable yet
      element.innerText = newText;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    chrome.runtime.sendMessage({
      type: 'APPLY_SUCCESS',
      payload: { 
        sectionId: payload.sectionId, 
        originalText, 
        targetSelector 
      }
    });
  } catch (error) {
    chrome.runtime.sendMessage({
      type: 'APPLY_ERROR',
      payload: { sectionId: payload.sectionId, reason: error.message || 'UNKNOWN_ERROR' }
    });
  }
}

function cleanup() {
  isActive = false;
  document.removeEventListener('focusin', handleFocus);
}

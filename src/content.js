/**
 * content.js
 * Injected into active tab
 */
import { getSelector } from './utils/selectorEngine.js';

let lastFocusedElement = null;
let isActive = true;

// Listen on document for focusin (bubbles, unlike focus)
document.addEventListener('focusin', handleFocus);

function handleFocus(e) {
  if (!isActive) return;
  
  const el = e.target;
  const isEditable =
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.isContentEditable;
    
  if (!isEditable) return;
  
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

function getPreviewText(el) {
  let text = '';
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    text = el.value || '';
  } else if (el.isContentEditable) {
    text = el.innerText || '';
  }
  return text.substring(0, 80);
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

function handleApply(payload) {
  if (!lastFocusedElement) {
    chrome.runtime.sendMessage({
      type: 'APPLY_ERROR',
      payload: { sectionId: payload.sectionId, reason: 'NO_ACTIVE_ELEMENT' }
    });
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

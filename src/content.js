// ZERO-DEPENDENCY CONTENT SCRIPT FOR TYPEBRIDGE
// This avoids large bundle sizes (4MB+) that block injection.

(function() {
  console.log('TypeBridge: Content script ACTIVE in:', window.location.href);

  // --- MINIMAL SELECTOR ENGINE ---
  function getSelector(element) {
    if (!element) return '';
    if (element === document.body) return 'body';
    if (element.id) {
      try {
        const idSelector = `#${CSS.escape(element.id)}`;
        if (document.querySelector(idSelector) === element) return idSelector;
      } catch (e) {}
    }
    const dataAttrs = ['data-block-id', 'data-id', 'data-type', 'data-block'];
    for (const attr of dataAttrs) {
      if (element.hasAttribute && element.hasAttribute(attr)) {
        try {
          const val = CSS.escape(element.getAttribute(attr));
          const attrSelector = `[${attr}="${val}"]`;
          if (document.querySelector(attrSelector) === element) return attrSelector;
        } catch (e) {}
      }
    }
    // Fallback to simple path
    let path = [];
    let current = element;
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body && path.length < 5) {
      let selector = current.nodeName.toLowerCase();
      const parent = current.parentNode;
      if (parent && parent.nodeType === Node.ELEMENT_NODE) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
      path.unshift(selector);
      current = current.parentNode;
    }
    if (current === document.body) path.unshift('body');
    return path.join(' > ');
  }

  let lastFocusedElement = null;
  let lastFocusedSelector = null;
  let isActive = true;

  function getPreviewText(el) {
    if (!el) return '';
    let text = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? el.value : el.innerText;
    return (text || '').trim().substring(0, 150);
  }

  function handleFocus(e) {
    if (!isActive) return;
    let el = e.target;
    if (el && el.nodeType === Node.TEXT_NODE) el = el.parentElement;
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

    const isEditable = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable || 
                       el.closest('[contenteditable="true"]') || el.closest('.elementor-inline-editing');

    if (!isEditable) return;

    lastFocusedElement = el;
    lastFocusedSelector = getSelector(el);
    
    try {
      chrome.runtime.sendMessage({
        type: 'FOCUS_DETECTED',
        payload: {
          tagName: el.tagName.toLowerCase(),
          isContentEditable: !!el.isContentEditable,
          previewText: getPreviewText(el),
          selector: lastFocusedSelector
        }
      });
    } catch (err) {}
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'APPLY_COPY') {
      handleApply(message.payload);
    } else if (message.type === 'PING') {
      sendResponse({ status: 'ok' });
    }
  });

  // BROADCAST LISTENER (essential for complex iframes)
  window.addEventListener('TYPEBRIDGE_APPLY_BROADCAST', (e) => {
    console.log('TypeBridge: Received broadcast apply');
    if (e.detail) handleApply(e.detail);
  });

  function handleApply(payload) {
    const newText = payload.newText;
    let element = lastFocusedElement;
    
    // Recovery logic
    if (!element && lastFocusedSelector) element = document.querySelector(lastFocusedSelector);
    if (!element) element = document.activeElement;
    if (!element || element === document.body) {
      console.warn('TypeBridge: No valid target element found for apply.');
      return;
    }

    console.log('TypeBridge: Applying to', element.tagName);

    try {
      if (element.tagName === 'INPUT') {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (setter) setter.call(element, newText);
        else element.value = newText;
      } else if (element.tagName === 'TEXTAREA') {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (setter) setter.call(element, newText);
        else element.value = newText;
      } else {
        element.focus();
        // Method 1: execCommand
        document.execCommand('selectAll', false, null);
        const success = document.execCommand('insertText', false, newText);
        
        // Method 2: innerHTML (brute force)
        if (!success) {
          element.innerHTML = newText;
        }
      }
      
      // Dispatch events to notify frameworks
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      
      chrome.runtime.sendMessage({ type: 'APPLY_SUCCESS', payload: { sectionId: payload.sectionId } });
    } catch (err) {
      console.error('TypeBridge Apply Error:', err);
    }
  }

  // Use capture to get ahead of visual builders
  document.addEventListener('focusin', handleFocus, true);
  document.addEventListener('click', handleFocus, true);
  document.addEventListener('mousedown', handleFocus, true);

})();

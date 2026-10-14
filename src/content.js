// ZERO-DEPENDENCY CONTENT SCRIPT FOR TYPEBRIDGE
// This avoids large bundle sizes (4MB+) that block injection.

(function() {
  function extensionAlive() {
    try {
      return !!chrome.runtime?.id;
    } catch (e) {
      return false;
    }
  }

  // The script can be injected both by the manifest and by scripting.executeScript.
  // Only run once per frame, unless the previous copy belongs to a reloaded (dead) extension.
  if (window.__typebridge && window.__typebridge.alive()) return;
  if (window.__typebridge) window.__typebridge.teardown();

  // --- MINIMAL SELECTOR ENGINE ---
  function cssEscape(value) {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function getSelector(element) {
    if (!element) return '';
    if (element === document.body) return 'body';
    if (element.id) {
      try {
        const idSelector = `#${cssEscape(element.id)}`;
        if (document.querySelector(idSelector) === element) return idSelector;
      } catch (e) {}
    }
    const dataAttrs = ['data-block-id', 'data-widget-id', 'data-node-id', 'data-id', 'data-type', 'data-block'];
    for (const attr of dataAttrs) {
      if (element.hasAttribute && element.hasAttribute(attr)) {
        try {
          const val = cssEscape(element.getAttribute(attr));
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

  const TEXT_INPUT_TYPES = ['text', 'search', 'url', 'email', 'tel', ''];

  // Returns the element that should actually receive the text, or null if not editable
  function resolveEditable(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
    if (el.tagName === 'TEXTAREA') return el;
    if (el.tagName === 'INPUT') {
      return TEXT_INPUT_TYPES.includes((el.getAttribute('type') || '').toLowerCase()) ? el : null;
    }
    if (el.isContentEditable) {
      // Use the nearest editing host so we replace the whole field, not a nested span
      return el.closest('[contenteditable]:not([contenteditable="false"])') || el;
    }
    const inlineEditor = el.closest('.elementor-inline-editing');
    if (inlineEditor) return inlineEditor;
    return null;
  }

  let lastFocusedElement = null;
  let lastFocusedSelector = null;
  let lastReported = null;

  function getPreviewText(el) {
    if (!el) return '';
    const text = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? el.value : el.innerText;
    return (text || '').trim().substring(0, 150);
  }

  function handleFocus(e) {
    if (!extensionAlive()) {
      teardown();
      return;
    }
    let target = e.target;
    if (target && target.nodeType === Node.TEXT_NODE) target = target.parentElement;
    const el = resolveEditable(target);
    if (!el) return;

    lastFocusedElement = el;
    lastFocusedSelector = getSelector(el);

    const payload = {
      tagName: el.tagName.toLowerCase(),
      isContentEditable: !!el.isContentEditable,
      previewText: getPreviewText(el),
      selector: lastFocusedSelector
    };

    // mousedown, click and focusin all fire for one click — report each change only once
    const key = payload.selector + '|' + payload.previewText;
    if (key === lastReported) return;
    lastReported = key;

    try {
      chrome.runtime.sendMessage({ type: 'FOCUS_DETECTED', payload }).catch(() => {});
    } catch (err) {}
  }

  function onMessage(message, sender, sendResponse) {
    if (message.type === 'APPLY_COPY') {
      handleApply(message.payload).then(sendResponse);
      return true; // async response
    }
    if (message.type === 'VERIFY_APPLY') {
      verifyApplied(message.payload).then(sendResponse);
      return true;
    }
    if (message.type === 'PING') {
      sendResponse({ status: 'ok' });
    }
    return false;
  }

  // --- BUILDER ADAPTERS ---
  // Some builders keep copy in their own data model and re-render the DOM from it,
  // so direct DOM edits are silently reverted. For those, the background applies the
  // text through the builder's own API (in the page's main world) instead.
  function detectAdapter(element) {
    // Elementor: the canvas is a preview iframe whose body has .elementor-editor-active
    if (document.body?.classList.contains('elementor-editor-active')) {
      const widget = element.closest('.elementor-element[data-id]');
      if (widget) {
        const keyEl = element.closest('[data-elementor-setting-key]');
        return {
          type: 'elementor',
          elementId: widget.getAttribute('data-id'),
          settingKey: keyEl ? keyEl.getAttribute('data-elementor-setting-key') : null
        };
      }
    }
    // Gutenberg: every block wrapper carries its clientId in data-block
    const block = element.closest('[data-block]');
    if (block && block.closest('.is-root-container, .block-editor-block-list__layout, .editor-styles-wrapper')) {
      return { type: 'gutenberg', clientId: block.getAttribute('data-block') };
    }
    return null;
  }

  function adapterElement(adapter) {
    try {
      if (adapter?.type === 'elementor') return document.querySelector(`.elementor-element[data-id="${cssEscape(adapter.elementId)}"]`);
      if (adapter?.type === 'gutenberg') return document.querySelector(`[data-block="${cssEscape(adapter.clientId)}"]`);
    } catch (e) {}
    return null;
  }

  function safeQuery(selector) {
    try {
      return selector ? document.querySelector(selector) : null;
    } catch (e) {
      return null;
    }
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim();

  function hasText(element, newText) {
    if (!element || !element.isConnected) return false;
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      return normalize(element.value) === normalize(newText);
    }
    return normalize(element.innerText).includes(normalize(newText));
  }

  // Builders may revert a change a moment later (re-render from their model),
  // so only report success if the text is still there after a short wait.
  async function textSticks(getElement, newText) {
    for (const delay of [400, 500]) {
      await sleep(delay);
      if (!hasText(getElement(), newText)) return false;
    }
    return true;
  }

  async function verifyApplied(payload) {
    const getElement = () => adapterElement(payload.adapter) ||
      safeQuery(payload.selector);
    return { ok: await textSticks(getElement, payload.newText ?? '') };
  }

  function findTarget() {
    let element = lastFocusedElement;
    // Builders often re-render nodes; recover via selector if ours was detached
    if (element && !element.isConnected) element = null;
    if (!element && lastFocusedSelector) {
      try {
        element = resolveEditable(document.querySelector(lastFocusedSelector));
      } catch (e) {}
    }
    if (!element) element = resolveEditable(document.activeElement);
    return element;
  }

  function setNativeValue(element, value) {
    const proto = element.tagName === 'INPUT' ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(element, value);
    else element.value = value;
  }

  function replaceEditableText(element, newText) {
    element.focus();

    // Select the field's full contents explicitly (selectAll can escape the field
    // when the page's window is not focused, e.g. while the side panel is in use)
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);

    // insertText goes through the editor's own input pipeline, so builders pick it up
    let success = false;
    try {
      success = document.execCommand('insertText', false, newText);
    } catch (e) {}

    if (!success || normalize(element.innerText) !== normalize(newText)) {
      // Fallback: write plain text nodes (never innerHTML — the copy is untrusted text)
      element.textContent = '';
      newText.split('\n').forEach((line, i) => {
        if (i > 0) element.appendChild(document.createElement('br'));
        element.appendChild(document.createTextNode(line));
      });
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: newText }));
    }
  }

  async function handleApply(payload) {
    const newText = payload?.newText ?? '';
    const element = findTarget();
    if (!element) {
      return { ok: false, reason: 'No text field selected. Click into a text field in your builder first.' };
    }

    const originalText = getPreviewText(element);
    const selector = getSelector(element);

    if (!payload.forceGeneric) {
      const adapter = detectAdapter(element);
      if (adapter) return { ok: false, needsAdapter: adapter, originalText, selector };
    }

    try {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.focus();
        setNativeValue(element, newText);
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        replaceEditableText(element, newText);
      }

      // Notify frameworks that commit on change/blur
      element.dispatchEvent(new Event('change', { bubbles: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));

      lastReported = null;
    } catch (err) {
      console.error('TypeBridge Apply Error:', err);
      return { ok: false, reason: err?.message || 'Failed to apply text.' };
    }

    const getElement = () => (element.isConnected ? element : safeQuery(selector));
    if (!(await textSticks(getElement, newText))) {
      return { ok: false, reason: 'The builder undid the change. Double-click the text so its cursor is blinking, then apply again.' };
    }
    return { ok: true, originalText, selector };
  }

  function teardown() {
    document.removeEventListener('focusin', handleFocus, true);
    document.removeEventListener('click', handleFocus, true);
    document.removeEventListener('mousedown', handleFocus, true);
    try {
      chrome.runtime.onMessage.removeListener(onMessage);
    } catch (e) {}
  }

  chrome.runtime.onMessage.addListener(onMessage);

  // Use capture to get ahead of visual builders
  document.addEventListener('focusin', handleFocus, true);
  document.addEventListener('click', handleFocus, true);
  document.addEventListener('mousedown', handleFocus, true);

  window.__typebridge = { alive: extensionAlive, teardown };
})();

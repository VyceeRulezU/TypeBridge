/**
 * Generates the most stable unique CSS selector for a DOM element
 * Priority: id > data-attribute > nth-child path
 * @param {HTMLElement|null|undefined} element
 * @returns {string} CSS selector string
 */
export function getSelector(element) {
  if (!element) {
    console.warn('getSelector triggered with null or undefined element');
    return '';
  }

  if (element === document.body) {
    return 'body';
  }

  // 1. Unique ID
  if (element.id) {
    const escapedId = CSS.escape(element.id);
    const idSelector = `#${escapedId}`;
    if (verifySelector(idSelector) && document.querySelector(idSelector) === element) {
      return idSelector;
    }
  }

  // 2. Data attributes
  const targetDataAttrs = ['data-block-id', 'data-widget-id', 'data-node-id', 'data-id', 'data-type', 'data-name', 'data-block'];
  for (const attr of targetDataAttrs) {
    if (element.hasAttribute(attr)) {
      // Escape the value to prevent selector breaking
      const val = CSS.escape(element.getAttribute(attr));
      const attrSelector = `[${attr}="${val}"]`;
      if (verifySelector(attrSelector) && document.querySelector(attrSelector) === element) {
        return attrSelector;
      }
    }
  }

  // 3. Unique class combination
  let className = element.className;
  if (typeof className !== 'string' && className && typeof className.baseVal === 'string') {
    className = className.baseVal; // Handle SVGAnimatedString
  }

  if (className && typeof className === 'string') {
    const classes = className.trim().split(/\s+/).filter(Boolean);
    if (classes.length > 0) {
      const classSelector = '.' + classes.map(CSS.escape).join('.');
      if (verifySelector(classSelector) && document.querySelector(classSelector) === element) {
        return classSelector;
      }
    }
  }

  // 4. Fall back to nth-child path (capped at 5 levels)
  let path = [];
  let current = element;

  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body && path.length < 5) {
    let selector = current.nodeName.toLowerCase();
    const parent = current.parentNode;

    if (parent && parent.nodeType === Node.ELEMENT_NODE) {
      const siblings = Array.from(parent.children);
      const sameTagSiblings = siblings.filter(s => s.nodeName === current.nodeName);
      
      if (sameTagSiblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-child(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentNode;
  }

  // Try to prepend body if we reached it
  if (current === document.body) {
    path.unshift('body');
  }

  const finalSelector = path.join(' > ');
  
  if (verifySelector(finalSelector) && document.querySelector(finalSelector) === element) {
    return finalSelector;
  }

  // Return best effort even if not perfectly unique or verifiable (e.g. capped out)
  return finalSelector;
}

/**
 * Verifies a selector still resolves to exactly one element on the page
 * @param {string} selector
 * @returns {boolean}
 */
export function verifySelector(selector) {
  if (!selector) return false;
  try {
    const elements = document.querySelectorAll(selector);
    return elements.length === 1;
  } catch (e) {
    return false; // Invalid selector syntax
  }
}

/**
 * Given a selector, returns the element or null if not found
 * @param {string} selector
 * @returns {HTMLElement|null}
 */
export function findElement(selector) {
  if (!selector) return null;
  try {
    return document.querySelector(selector) || null;
  } catch (e) {
    return null;
  }
}

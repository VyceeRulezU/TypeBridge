# Web Builder Support Strategy

TypeBridge interfaces with complex visual web builders. Each builder has unique DOM structures and event requirements.

## Supported Builders

| Builder | Detection Strategy | Injection Target |
|---------|--------------------|------------------|
| **Gutenberg** | Check for `.is-root-container` or `wp` object. | Block editor rich text components. |
| **Elementor** | Check for `elementorFrontend` or `.elementor-editor-active`. | Elementor text widgets (TinyMCE or basic inputs). |
| **Webflow** | Check for `.w-editor` or `wf` data attributes. | Designer canvas text elements. |
| **Framer** | Check for `.framer-design-canvas` or specific Framer classes. | Interactive text nodes. |
| **Squarespace** | Check for `sqs-layout` or `.sqs-edit-mode-active`. | Blocks within the layout engine. |

## Injection Strategy

1. **Active Field Detection**: Listen for `focusin` events in the content script.
2. **React Synthetic Events (Gutenberg/Wix v2)**: 
   - Direct DOM manipulation is often ignored by React-based builders.
   - Strategy: Update the `value` property, then dispatch `input`, `change`, and `blur` events with `bubbles: true`.
   - For Gutenberg specifically, we may need to trigger the internal block editor state update.
3. **Draft.js / Slate / Quill**:
   - Detect if the target is a controlled rich-text component.
   - Fallback: Use `document.execCommand('insertText', false, text)`.

## Known Edge Cases

- **Iframe Isolation**: Some builders (Elementor, Squarespace) load the canvas in an iframe. The content script must inject into these iframes.
- **Wix v2**: Uses strict hydration. Manual DOM changes may cause a crash. Requires careful event dispatching.
- **Shadow DOM**: Some Framer components might use Shadow DOM, requiring deep traversal.

## Event Dispatching Requirements

```javascript
const el = document.activeElement;
el.value = newContent;
el.dispatchEvent(new Event('input', { bubbles: true }));
el.dispatchEvent(new Event('change', { bubbles: true }));
```

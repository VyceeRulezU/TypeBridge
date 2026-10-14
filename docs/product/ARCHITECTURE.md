# System Architecture: TypeBridge

## Component Overview

TypeBridge is a Chrome Extension built with Manifest V3, utilizing a React side panel and a vanilla JS content script.

### 1. Extension Side Panel (React 18 + Vite)
- **Responsibility**: User interface, document parsing, section management.
- **Location**: `/src/sidepanel`
- **Tech**: React, Vanilla CSS (CSS Modules), Vite.

### 2. Content Script (Vanilla JS)
- **Responsibility**: Interacting with the DOM of visual web builders, injecting text, detecting active fields.
- **Location**: `/src/content.js`
- **Injection**: Injected into every page to detect builder signatures.

### 3. Background Service Worker (Vanilla JS)
- **Responsibility**: Managing extension state, handling cross-tab communication, Chrome API orchestrator.
- **Location**: `/src/background.js`

### 4. Doc Parser
- **Responsibility**: Converting raw pasted text into a structured JSON array of sections.
- **Location**: `/src/parser/docParser.js`

### 5. Selector Engine
- **Responsibility**: Generating stable CSS selectors for target fields. (The content script carries its own minimal copy to stay dependency-free.)
- **Location**: `/src/utils/selectorEngine.js`

## Data Model

### Section Object
```json
{
  "id": "uuid",
  "level": "h1 | h2 | h3 | body",
  "heading": "Section heading (\"Document\" for text before the first heading)",
  "body": "Section body text",
  "status": "pending | applied | skipped",
  "appliedAt": 1715000000000,
  "originalText": "Field text that was replaced",
  "targetSelector": "CSS selector of the field written to"
}
```

## Message Flow

1. **User pastes text** in the Side Panel -> `docParser.js` -> `START_SESSION` to Background.
2. **User clicks into a field** in the builder -> Content Script sends `FOCUS_DETECTED`.
   Background records the tab + frame (`focusTarget`) and forwards it to the panel over the `sidepanel` port.
3. **User clicks "Apply"** (or "Apply Heading") -> Panel sends `APPLY_COPY { sectionId, part, newText }`.
4. **Background** injects the content script if missing, then sends `APPLY_COPY` to the focused frame only.
5. **Content Script** writes the text (native value setter for inputs, `insertText` for contenteditable),
   dispatches `input` / `change` / `blur`, and responds `{ ok, originalText, selector }` or `{ ok: false, reason }`.
   For Elementor and Gutenberg fields it instead responds `{ needsAdapter }`; the Background then writes the copy
   through the builder's API in the page's MAIN world (`$e.run('document/elements/settings')` /
   `wp.data updateBlockAttributes`) and confirms it by reading the saved value back. Direct DOM writes are only
   reported as applied once the text is still present after the builder re-renders (up to ~3s).
6. **Background** forwards `APPLY_SUCCESS` or `APPLY_ERROR` to the panel.
7. **Panel** sends `SESSION_UPDATE` whenever section statuses change, so the session can be restored (`SESSION_RESTORE`).

## Storage Strategy
- **chrome.storage.session**: Current session (sections + statuses) and the last focused tab/frame.
  Survives service-worker restarts and side panel reloads; cleared when the browser closes.
- **React state** in the side panel for UI responsiveness.

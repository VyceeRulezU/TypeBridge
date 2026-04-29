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
- **Responsibility**: Maintaining a registry of CSS selectors and event dispatch strategies for different builders.
- **Location**: `/src/utils/selectorEngine.js`

## Data Model

### Section Object
```json
{
  "id": "uuid",
  "type": "heading-1 | heading-2 | paragraph | cta",
  "content": "Raw string content",
  "applied": false,
  "timestamp": 123456789
}
```

## Message Flow Diagram

1. **User pastes text** in Side Panel.
2. **Side Panel** calls `docParser.js` -> updates local state.
3. **User clicks "Apply"** on a SectionCard.
4. **Side Panel** sends message to Background: `{ action: 'APPLY_SECTION', payload: section }`.
5. **Background** forwards message to Content Script in active tab.
6. **Content Script** identifies active field via `selectorEngine.js`.
7. **Content Script** injects content and dispatches necessary events (input, change, blur).
8. **Content Script** sends ACK to Background -> forwards to Side Panel to mark as "applied".

## Storage Strategy
- **chrome.storage.local**: Used for persisting the current session (last pasted doc, application progress).
- **Session State**: React state in the side panel for UI responsiveness.

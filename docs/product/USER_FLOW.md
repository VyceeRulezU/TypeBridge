# User Flow & State Transitions

## Core Loop

1. **First Setup**:
   - User installs extension.
   - User opens the Side Panel (via Action icon).
   - Prompt: "Paste your copy document here."

2. **Parsing Phase**:
   - User pastes text into `PasteArea`.
   - `docParser` runs immediately.
   - UI transitions from Empty State to `SessionSummary` and list of `SectionCard`s.

3. **Application Phase**:
   - User navigates to their visual builder tab.
   - User clicks into a text field in the builder.
   - User selects a section in the Side Panel and clicks "Apply".
   - `DiffPreview` shows the change (if possible).
   - Injection occurs.
   - `SectionCard` updates state to `applied: true`.
   - `ProgressBar` increments.

4. **Session Completion**:
   - Once all sections are applied, show "Session Complete" summary.
   - Option to clear and start a new document.

## Message Types & Payloads

### Side Panel -> Background
- `GET_CURRENT_TAB`: Request information about the active tab.
- `APPLY_SECTION`: `{ id: 'uuid', content: '...' }`
- `UPDATE_PROGRESS`: Persist progress to `chrome.storage.local`.

### Background -> Content Script
- `PING_BUILDER`: Check if the current page is a supported builder.
- `INJECT_CONTENT`: `{ selector: '...', content: '...', mode: 'replace' }`

### Content Script -> Background
- `BUILDER_DETECTED`: `{ type: 'elementor', version: '3.0' }`
- `FIELD_FOCUSED`: `{ selector: '...', currentContent: '...' }`
- `INJECTION_SUCCESS`: Confirmation of application.

## State Transitions

- **Idle**: No document pasted.
- **Parsing**: Processing large paste.
- **Ready**: Document structured, no sections applied.
- **Active**: Sections being applied.
- **Completed**: All sections applied or session manually closed.

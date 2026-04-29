# Chrome Web Store Submission Checklist

## Permission Justifications

- **`sidePanel`**: Required to host the primary user interface (pasted document view and section cards) directly within the browser's side panel.
- **`activeTab`**: Required to allow the extension to interact with the visual web builder in the user's current tab. This is only active when the user interacts with the extension.
- **`scripting`**: Required to inject the text into the active builder's input fields. This permission allows the extension to execute code that triggers input events on the page.
- **`storage`**: Required to persist the user's current paste session locally so that they don't lose progress when closing the side panel or browser.

## Submission Checklist

- [ ] **Icons**: Provide 16x16, 48x48, and 128x128 PNGs.
- [ ] **Screenshots**: At least 3 high-quality screenshots (1280x800 or 640x400).
- [ ] **Promotional Video**: 30-second demo of applying sections.
- [ ] **Description**: Clear explanation of how it helps copywriters.
- [ ] **Privacy Policy**: Explicitly state that no data leaves the user's browser (Local-First).
- [ ] **Review Tips**: Mention that the extension is intended for use with visual builders.

## Privacy Requirements

- **Data Collection**: No personal data is collected.
- **Data Usage**: Text pasted by the user is stored locally in `chrome.storage` and used only for injection into their own sites.
- **Permissions**: Following the principle of least privilege.

## Manual Review Triggers

- Use of `scripting` API. Ensure injected code is clean.
- Use of `activeTab` to interact with diverse domains.

# Typebridge

Typebridge lets you deploy copy from a document directly into any visual web builder without switching tabs.

## The Problem
Copywriters and designers waste hours manually moving text from documents into web builders like Gutenberg, Elementor, and Webflow. This constant tab-switching and manual copy-pasting is slow and prone to errors. Typebridge solves this by providing a side panel where you can load your document once and apply sections directly to active text fields with one click.

## Features

- **Bring your copy in any way**: paste text, upload a `.docx`, `.pdf` or `.txt` file, or paste a **Google Docs link**.
  - Google Docs import uses the Google account signed in to your browser, so private docs you can open work too. Docs shared as "Anyone with the link" and "Publish to the web" links also work.
  - Headings in Google Docs and Word files become sections automatically.
- **Automatic sections**: Markdown headings (`#`, `##`, `###`) are detected. For plain text without headings, ALL CAPS lines, numbered headings and short title lines are used instead.
- **One-click apply**: click a text field in your builder, then click **Apply** (body text) or **Apply Heading** on a section.
- **Verified results**: a section is only marked applied once the builder has actually kept the change. If a builder reverts it, you get an error instead of a false success.
- **Progress tracking**: progress bar, skip / undo skip, inline editing of section text, and an exportable JSON log of the session.
- **Session persistence**: your sections and progress survive closing and reopening the side panel.

## Supported Builders

| Builder | Support Status | How copy is applied |
|---------|----------------|---------------------|
| Elementor | ✅ v1 (MVP) | Through Elementor's editor API, so changes are saved on Update/Publish |
| Gutenberg | ✅ v1 (MVP) | Through the block editor API (paragraph, heading, button, list item, preformatted, verse) |
| Webflow | ✅ v1 (MVP) | Direct field editing |
| Framer | ✅ v1 (MVP) | Direct field editing |
| Squarespace | ✅ v1 (MVP) | Direct field editing |
| Wix | 📅 v2 (Planned) | — |

Direct field editing works in any text input, textarea, or rich-text (contenteditable) field, including fields inside builder iframes.

## Using Typebridge

1. Click the Typebridge icon in the Chrome toolbar to open the side panel.
2. Paste your document, upload a file, or import a Google Docs link, then click **Parse Document**.
3. In your builder, click (or double-click) the text you want to replace so its cursor is blinking. The panel shows **Target Connected**.
4. Click **Apply** on a section to insert its body text, or **Apply Heading** to insert its heading.
5. Save or publish in your builder as usual.

## Getting Started (Development)

1. Clone the repository:
   ```bash
   git clone https://github.com/VyceeRulezU/TypeBridge.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load it in Chrome: open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the `dist` folder.
5. After rebuilding, click the reload icon on the Typebridge card in `chrome://extensions` and refresh any open builder tabs.

`npm run dev` starts a watch build that launches a browser with the extension loaded.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the extension into `dist/` |
| `npm run dev` | Watch build with auto-reload |
| `npm test` | Run Vitest unit tests |
| `npm run lint` | Lint `src/` |

## Project Structure

- `/src`: Extension source
  - `background.js`: service worker. Routes messages and applies copy through builder APIs (Elementor, Gutenberg).
  - `content.js`: runs in builder pages. Detects the focused field and writes copy into it.
  - `sidepanel/`: React side panel UI.
  - `parser/`: document parser and importers (Google Docs, DOCX HTML).
- `/manifest.json`: Chrome extension manifest (Manifest V3)
- `/web`: Marketing landing page
- `/app`: Pro web app workspace (Planned)
- `/docs`: Mintlify documentation and product docs (`docs/product`)
- `/tests`: Vitest unit tests

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 |
| Build Tool | Vite |
| Styling | Vanilla CSS + CSS Modules |
| Extension Tooling | vite-plugin-web-extension |
| File Parsing | mammoth (DOCX), pdf.js (PDF) |
| Testing | Vitest |

## Documentation
For deep-dives into our architecture and design system, see the [docs/product](./docs/product/README.md) directory.

## Installation
Visit the [Typebridge website](https://typebridge.vercel.app).

## Contributing
We welcome contributions. Please read our contributing guidelines in the docs.

## License
MIT License. See [LICENSE](./LICENSE) for details.

## Contact
Questions? Feedback? Reach out at [typebridgeapp@gmail.com](mailto:typebridgeapp@gmail.com)

# Typebridge

Typebridge lets you deploy copy from a document directly into any visual web builder without switching tabs.

## The Problem
Copywriters and designers waste hours manually moving text from documents into web builders like Gutenberg, Elementor, and Webflow. This constant tab-switching and manual copy-pasting is slow and prone to errors. Typebridge solves this by providing a side panel where you can paste your document once and apply sections directly to active text fields with one click.

## Supported Builders

| Builder | Support Status |
|---------|----------------|
| Gutenberg | ✅ v1 (MVP) |
| Elementor | ✅ v1 (MVP) |
| Webflow | ✅ v1 (MVP) |
| Framer | ✅ v1 (MVP) |
| Squarespace | ✅ v1 (MVP) |
| Wix | 📅 v2 (Planned) |

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/typebridge.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the extension in development mode:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src`: Extension source (React Side Panel, Content Scripts, Background Worker)
- `/web`: Marketing landing page
- `/app`: Pro web app workspace (Planned)
- `/docs`: Mintlify documentation
- `/tests`: Playwright E2E and Vitest unit tests
- `/.product`: Product strategy and design system documentation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 |
| Build Tool | Vite |
| Styling | Vanilla CSS + CSS Modules |
| Extension Tooling | vite-plugin-web-extension |
| Testing | Playwright, Vitest |

## Documentation
For deep-dives into our architecture and design system, see the [/.product](./.product/README.md) directory.

## Installation
[Add Chrome Web Store Link Here]

## Contributing
We welcome contributions. Please read our contributing guidelines in the docs.

## License
MIT

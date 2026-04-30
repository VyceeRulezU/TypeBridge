# TypeBridge Roadmap

## V1: MVP (Current Focus)
- [x] Scaffold project structure.
- [ ] Document parsing engine.
- [ ] Support for 5 major builders (Gutenberg, Elementor, Webflow, Framer, Squarespace).
- [ ] Session persistence via `chrome.storage`.
- [ ] Basic UI for side panel.

## V2: Pro & Optimization
- [ ] **Supabase Integration**: Sync documents across devices.
- [ ] **Google Docs / Notion Sync**: Pull content directly without pasting.
- [ ] **Multi-Section Apply**: Apply an entire block of sections at once.
- [ ] **History & Archiving**: Save previous sessions for reference.
- [ ] **Custom Schemas**: Support for custom document structures.

## V3: Intelligent Automation
- [ ] **AI-Assisted Matching**: Automatically suggest where sections should go based on page context.
- [ ] **Tone adjustment**: Small AI-powered edits before injection.
- [ ] **Collaboration**: Shared workspaces for teams.

## Known Limitations
- Rich text formatting (bold, italics) injection may vary by builder.
- Iframe-heavy builders may require additional permissions or specific injection logic.
- No support for "Code Blocks" or custom HTML widgets in V1.

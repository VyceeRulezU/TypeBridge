# Product Overview: TypeBridge

TypeBridge is a Chrome Extension designed to streamline the workflow for copywriters and web developers using visual web builders.

## Problem Statement

Users often have structured copy documents (Google Docs, Notion, etc.) that they need to manually transfer to visual web builders like Gutenberg, Elementor, or Webflow. This involves constant tab-switching, copy-pasting individual sections, and manually formatting.

## Solution

TypeBridge provides a side panel that allows users to paste their entire structured copy document. The extension parses the document into sections and enables users to "apply" these sections directly into active text fields in the builder without leaving the tab.

## Target Users

- **Copywriters**: Who need to see their copy in the final layout.
- **Web Designers/Developers**: Who want to quickly populate designs with final content.
- **Content Managers**: Managing high-volume site updates across builders.

## V1 Scope (MVP)

- **Input**: Paste area for structured text.
- **Parsing**: Basic section detection (Headings, Paragraphs).
- **Side Panel**: React-based UI to browse sections.
- **Injection**: Support for Gutenberg, Elementor, Webflow, Framer, Squarespace.
- **Context**: Detect active tab and builder type.
- **Feedback**: Diff preview (showing what will be replaced) and progress tracking.

## Out of Scope (V2+)

- **Direct Integration**: Google Docs/Notion API sync.
- **AI Enhancement**: Rewriting or tone adjustment.
- **Team Collaboration**: Shared copy decks.
- **Image Injection**: Automating asset placement.
- **Pro Features**: Custom schemas, bulk application, analytics.

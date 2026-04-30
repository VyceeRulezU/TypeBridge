# Architectural Decisions Log (ADR)

## ADR 001: Use React 18 in Extension Side Panel
- **Context**: Need a complex, stateful UI for document parsing and section management.
- **Decision**: Use React 18.
- **Rationale**: component-based architecture simplifies the "Apply" workflow and state synchronization.

## ADR 002: Vanilla CSS + CSS Modules for Styling
- **Context**: Need to avoid style leakage in the extension side panel and keep bundle sizes small.
- **Decision**: Use Vanilla CSS with CSS Modules.
- **Rationale**: No build-time overhead of Tailwind, 100% scoped to components, uses native CSS features.

## ADR 003: No Backend in V1 (Local-First)
- **Context**: Speed to market and privacy.
- **Decision**: Use `chrome.storage.local` and keep everything in-browser.
- **Rationale**: Users don't need to sign up to use the tool. Reduces infrastructure cost and complexity.

## ADR 004: Vanilla JS Content Script
- **Context**: Content scripts run in the context of external sites (builders).
- **Decision**: Avoid React or heavy frameworks for injection.
- **Rationale**: Minimize performance impact on the user's builder page. Reduces risk of conflicts with the host site's React/Vue/etc. versions.

## ADR 005: Use `vite-plugin-web-extension`
- **Context**: Modern development workflow for Manifest V3.
- **Decision**: Use `vite-plugin-web-extension` over `crxjs`.
- **Rationale**: High reliability with Side Panel API and cleaner configuration for multiple entry points (sidepanel, background, content).

# Design System: TypeBridge

TypeBridge follows a strict "No-Leak" CSS architecture using CSS Modules and a centralized token system.

## Tokens (`/src/styles/tokens.css`)

All styles MUST reference these tokens. Do not use raw hex values or pixel values in component styles.

### Core Tokens
- **Primary**: `--color-primary: #6C3BAA;`
- **Surface**: `--color-surface: #FFFFFF;`
- **Text**: `--color-text-900` (Dark), `--color-text-500` (Muted).
- **Radius**: `--radius-sm` (6px), `--radius-md` (10px).
- **Shadow**: `--shadow-md` (Purple-tinted).

## CSS Modules Usage

1. Create a `[ComponentName].module.css` file alongside your `.jsx`.
2. Every module must have a `.root` class.
3. Use CamelCase for class names (e.g., `.cardHeader`).

### Example

```javascript
// SectionCard.jsx
import styles from './SectionCard.module.css';

export const SectionCard = () => (
  <div className={styles.root}>
    <h3 className={styles.cardTitle}>...</h3>
  </div>
);
```

```css
/* SectionCard.module.css */
.root {
  background: var(--color-surface);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.cardTitle {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}
```

## Component Patterns

- **Atomic Components**: Button, Input, Toast.
- **Molecules**: SectionCard, DiffPreview.
- **Organisms**: PasteArea, SessionSummary.

## Naming Conventions

- **Files**: PascalCase for React components, camelCase for JS utilities.
- **CSS**: kebab-case is allowed, but CamelCase is preferred for CSS Modules consistency.

## Do / Don't

- **DO** use `var(--space-x)` for margins and paddings.
- **DO** keep components focused and reusable.
- **DON'T** use global selectors in `.module.css`.
- **DON'T** use Tailwind or any CSS-in-JS library.

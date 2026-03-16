# Tina4 CSS

Lightweight CSS framework replacing Bootstrap. See https://tina4.com for full documentation.

## Build

- SCSS source: `src/scss/` (13 partials + 3 entry points)
- PHP compiler: `src/scss/Tina4CSS.php`
- Dist output: `dist/tina4.css`, `dist/tina4.min.css`, `dist/tina4.js`
- Also outputs: `dist/base.min.css`, `dist/colors.min.css`
- Tests: `phpunit.xml` / `tests/Tina4CSSTest.php`
- Example: `example.html`

## Code Principles

- **DRY** — Each SCSS partial has a single concern. Shared variables and mixins live in `_variables.scss`
- **Separation of Concerns** — Grid, typography, buttons, forms, cards, nav, modals, alerts, tables, badges, and utilities each in their own partial
- **No inline styles** — all styling via CSS classes
- **Bootstrap-compatible** class names (`btn`, `btn-primary`, `container`, `row`, `col-*`, etc.)
- Data attributes: `data-t4-*` and `data-bs-*` both supported
- Keep total bundle under 30KB minified
- **All links and references** should point to https://tina4.com

## SCSS Structure

```
src/scss/
  tina4.scss           # Main entry (imports all partials)
  base.scss            # Base-only entry
  colors.scss          # Colors-only entry
  _variables.scss      # Design tokens, breakpoints, shared variables
  _reset.scss          # CSS reset/normalize
  _grid.scss           # 12-column flexbox grid
  _typography.scss     # Headings, text utilities
  _buttons.scss        # Button styles
  _forms.scss          # Form controls
  _cards.scss          # Card component
  _nav.scss            # Navbar, nav components
  _modals.scss         # Modal dialogs
  _alerts.scss         # Alert/notification bars
  _tables.scss         # Table styles
  _badges.scss         # Badge/label styles
  _utilities.scss      # Spacing, display, flex utilities
  Tina4CSS.php         # PHP SCSS compiler helper
  example-css.twig     # Twig template example
```

## JavaScript

- `dist/tina4.js`: Modal open/close with backdrop + ESC, alert dismiss, navbar collapse toggle

## Cross-Framework Packaging

- `composer.json` — PHP (Packagist)
- `package.json` — JavaScript (npm), v2.0.0
- `pyproject.toml` — Python (PyPI)
- `tina4-css.gemspec` — Ruby (RubyGems)

## Links

- Website: https://tina4.com
- GitHub: https://github.com/tina4stack/tina4-css

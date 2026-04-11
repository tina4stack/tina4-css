# Tina4 CSS

Lightweight CSS framework + Frond JS helper. See https://tina4.com for full documentation.

## Build

```bash
npm install                # Install esbuild
npm run build:frond        # Build frond.min.js → dist/
npm run build:frond:dev    # Build frond.js + sourcemap → dist/
```

- SCSS source: `src/scss/` (13 partials + 3 entry points)
- Frond source: `src/js/frond.ts` (TypeScript)
- PHP compiler: `src/scss/Tina4CSS.php`
- Dist output: `dist/tina4.css`, `dist/tina4.min.css`, `dist/tina4.js`, `dist/frond.min.js`
- Also outputs: `dist/base.min.css`, `dist/colors.min.css`
- Tests: `phpunit.xml` / `tests/Tina4CSSTest.php`
- Example: `example.html`

## Code Principles

- **DRY** — Each SCSS partial has a single concern. Shared variables and mixins live in `_variables.scss`
- **Separation of Concerns** — Grid, typography, buttons, forms, cards, nav, modals, alerts, tables, badges, and utilities each in their own partial
- **No inline styles** — all styling via CSS classes
- **Bootstrap-compatible** class names (`btn`, `btn-primary`, `container`, `row`, `col-*`, etc.)
- Data attributes: `data-t4-*` and `data-bs-*` both supported
- Keep total CSS bundle under 30KB minified
- **All links and references** should point to https://tina4.com
- **Frond is pure native JS** — no jQuery, no signals, no dependencies. Uses XMLHttpRequest, EventSource, WebSocket.

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

- `dist/tina4.js`: Modal open/close with backdrop + ESC, alert dismiss, navbar collapse toggle (~3KB)
- `dist/frond.min.js`: Client-side DOM helper — AJAX, forms, WebSocket, SSE, cookies (~3KB gzipped)

## Frond API (window.frond)

| Method | What |
|--------|------|
| `frond.request(url, options?)` | Core XHR with Bearer token rotation |
| `frond.load(url, target?, cb?)` | GET + inject HTML into element |
| `frond.post(url, data, target?, cb?)` | POST + inject HTML into element |
| `frond.inject(html, target)` | Parse HTML + execute scripts |
| `frond.form.collect(formId)` | Collect FormData from form |
| `frond.form.submit(formId, url, target?, cb?)` | Collect + POST form |
| `frond.form.show(action, url, target?, cb?)` | Load form by action |
| `frond.ws(url, options?)` | WebSocket with auto-reconnect |
| `frond.sse(url, options?)` | SSE EventSource with auto-reconnect |
| `frond.cookie.set/get/remove` | Cookie helpers |
| `frond.message(text, type?)` | Show alert in #message |
| `frond.popup(url, title, w, h)` | Centred popup |
| `frond.report(url)` | Open PDF in new window |
| `frond.graphql(query, variables?, url?)` | Execute GraphQL query/mutation |
| `frond.token` | Bearer token (read/write) |

## Cross-Framework Packaging

- `composer.json` — PHP (Packagist)
- `package.json` — JavaScript (npm), v2.1.0
- `pyproject.toml` — Python (PyPI)
- `tina4-css.gemspec` — Ruby (RubyGems)

## Links

- Website: https://tina4.com
- GitHub: https://github.com/tina4stack/tina4-css

# Tina4 CSS

A lightweight, responsive CSS framework built with SCSS — comparable to Bootstrap but much smaller (~24KB minified). Works with **any** web framework: PHP, Python, Ruby, JavaScript, or plain HTML.

## Features

- **12-column flexbox grid** with responsive breakpoints (`sm`, `md`, `lg`, `xl`, `xxl`)
- **Buttons** — solid, outline, sizes (sm, lg, block)
- **Forms** — inputs, selects, textareas, checkboxes, radios, validation states, input groups
- **Cards** — header, body, footer, image top
- **Navigation** — navbar (light/dark), nav links, breadcrumbs, responsive toggler
- **Modals** — dialog, header/body/footer, backdrop, sizes (sm, lg)
- **Alerts** — all theme colors, dismissible
- **Tables** — bordered, striped, hover, compact, responsive
- **Badges** — all theme colors, pill shape
- **Typography** — headings, lead, blockquote, code, kbd, lists
- **Utilities** — display, flex, spacing (margin/padding 0-5), text, background colors, borders, shadows, width/height, position, visibility
- **Fully themeable** — override all colors in a single file
- **CSS Custom Properties** — runtime access to all design tokens via `--t4-*` variables

## Installing

Choose your package manager:

```bash
# PHP (Composer)
composer require tina4stack/tina4css

# JavaScript / Node.js (npm)
npm install tina4-css

# Python (pip / uv)
pip install tina4-css

# Ruby (gem)
gem install tina4-css

# Or just grab the CSS file — no build tools needed
curl -o tina4.min.css https://raw.githubusercontent.com/tina4stack/tina4-css/main/dist/tina4.min.css
```

## Quick Start

### Plain HTML (zero dependencies)

Download `dist/tina4.min.css` and link it:

```html
<link rel="stylesheet" href="tina4.min.css">
```

### PHP (Tina4 or any framework)

```php
use Tina4\Tina4CSS;

$css = new Tina4CSS('./public/css');
$css->compile(__DIR__ . '/vendor/tina4stack/tina4css/src/scss', 'tina4css');
```

### Python (Tina4 or any framework)

Tina4 Python auto-compiles SCSS from `src/scss/`. Copy the SCSS files there, or use the pre-compiled CSS:

```python
# Option 1: Use pre-compiled CSS (copy to your static folder)
from tina4_css import css_path
print(css_path())  # "/path/to/tina4_css/dist/tina4.min.css"

# Option 2: Copy SCSS to src/scss/ for theming
from tina4_css import scss_path
print(scss_path())  # "/path/to/tina4_css/scss/"
```

Or simply copy `dist/tina4.min.css` into `src/public/css/`:

```bash
cp $(python -c "from tina4_css import css_path; print(css_path())") src/public/css/tina4.min.css
```

### Ruby (Tina4 or any framework)

```ruby
require "tina4-css"

# Get path to pre-compiled CSS
Tina4CSS.css_path          # => "/path/to/tina4.min.css"
Tina4CSS.scss_path         # => "/path/to/scss/"
```

### JavaScript / Node.js

```javascript
// Import the CSS path
const path = require("path");
const cssPath = path.join(require.resolve("tina4-css"), "..", "dist", "tina4.min.css");

// Or import in your bundler (Vite, Webpack, etc.)
import "tina4-css/dist/tina4.min.css";
```

## Theming

Create a `theme.scss` file in your project. Define your colors **before** importing the framework — all variables use `!default` so yours take priority:

```scss
// theme.scss — Your custom theme

// Override any of these colors
$primary:   #e74c3c;
$secondary: #2c3e50;
$success:   #27ae60;
$danger:    #c0392b;
$warning:   #f39c12;
$info:      #3498db;
$light:     #ecf0f1;
$dark:      #2c3e50;

// Override typography
$font-family-base: 'Inter', sans-serif;
$border-radius: 0.5rem;
$spacer: 1rem;

// Import the framework — your variables cascade through everything
@import 'tina4';
```

### All Themeable Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `$primary` | `#4a90d9` | Primary brand color |
| `$secondary` | `#6c757d` | Secondary color |
| `$success` | `#28a745` | Success/positive color |
| `$danger` | `#dc3545` | Danger/error color |
| `$warning` | `#ffc107` | Warning color |
| `$info` | `#17a2b8` | Info color |
| `$light` | `#f8f9fa` | Light background |
| `$dark` | `#212529` | Dark color |
| `$body-bg` | `#fff` | Page background |
| `$body-color` | `$dark` | Default text color |
| `$font-family-base` | system-ui stack | Base font family |
| `$font-size-base` | `1rem` | Base font size |
| `$spacer` | `1rem` | Base spacing unit |
| `$border-radius` | `0.25rem` | Default border radius |
| `$grid-columns` | `12` | Grid column count |
| `$grid-gutter` | `1.5rem` | Grid gutter width |

## Components

### Grid

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">Responsive column</div>
    <div class="col-12 col-md-6 col-lg-4">Responsive column</div>
    <div class="col-12 col-md-6 col-lg-4">Responsive column</div>
  </div>
</div>
```

### Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline-danger">Outline Danger</button>
<button class="btn btn-success btn-lg">Large Success</button>
<button class="btn btn-dark btn-block">Full Width</button>
```

### Forms

```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-control" placeholder="you@example.com">
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="remember">
  <label class="form-check-label" for="remember">Remember me</label>
</div>
```

### Cards

```html
<div class="card">
  <div class="card-header">Featured</div>
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Content goes here.</p>
    <a href="#" class="btn btn-primary">Action</a>
  </div>
  <div class="card-footer text-muted">Updated 3 mins ago</div>
</div>
```

### Alerts

```html
<div class="alert alert-success">Operation successful!</div>
<div class="alert alert-danger alert-dismissible">
  Error occurred. <button class="btn-close">&times;</button>
</div>
```

### Tables

```html
<table class="table table-striped table-hover">
  <thead><tr><th>Name</th><th>Email</th></tr></thead>
  <tbody><tr><td>Andre</td><td>andre@example.com</td></tr></tbody>
</table>
```

### Navigation

```html
<nav class="navbar navbar-dark">
  <a class="navbar-brand" href="#">My App</a>
  <ul class="navbar-nav">
    <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
    <li class="nav-item"><a class="nav-link" href="#">About</a></li>
  </ul>
</nav>
```

### Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-danger">5</span>
```

### Modals

```html
<div class="modal show">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Title</h5></div>
      <div class="modal-body"><p>Modal content.</p></div>
      <div class="modal-footer">
        <button class="btn btn-secondary">Close</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
```

## Utility Classes

| Category | Classes |
|----------|---------|
| **Display** | `.d-none`, `.d-block`, `.d-flex`, `.d-inline`, `.d-inline-block`, `.d-grid` |
| **Flex** | `.flex-row`, `.flex-column`, `.flex-wrap`, `.justify-content-*`, `.align-items-*` |
| **Spacing** | `.m-{0-5}`, `.p-{0-5}`, `.mt-*`, `.mb-*`, `.ms-*`, `.me-*`, `.mx-auto` |
| **Text** | `.text-start`, `.text-center`, `.text-end`, `.text-uppercase`, `.fw-bold`, `.fs-{1-6}` |
| **Colors** | `.text-primary`, `.text-danger`, `.bg-success`, `.bg-warning`, etc. |
| **Borders** | `.border`, `.border-0`, `.rounded`, `.rounded-pill`, `.rounded-circle` |
| **Shadows** | `.shadow-sm`, `.shadow`, `.shadow-lg`, `.shadow-none` |
| **Size** | `.w-25`, `.w-50`, `.w-75`, `.w-100`, `.h-*`, `.mw-100` |
| **Position** | `.position-relative`, `.position-absolute`, `.position-fixed`, `.position-sticky` |
| **Responsive** | `.d-md-none`, `.d-lg-flex`, `.col-sm-6`, `.col-md-4`, `.col-lg-3` |

## CSS Custom Properties

All design tokens are exposed as CSS custom properties for runtime use:

```css
:root {
  --t4-primary: #4a90d9;
  --t4-secondary: #6c757d;
  --t4-font-family: system-ui, ...;
  --t4-border-radius: 0.25rem;
  --t4-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
  /* ...and more */
}
```

## Example

See [example.html](example.html) for a complete showcase of all components.

## File Structure

```
tina4-css/
├── dist/                          # Pre-compiled CSS (ready to use)
│   ├── tina4.css                  # Expanded (~30KB)
│   ├── tina4.min.css              # Minified (~24KB)
│   ├── base.min.css               # Base only (no colors)
│   └── colors.min.css             # CSS custom properties only
├── src/
│   ├── app/
│   │   └── Tina4CSS.php           # PHP SCSS compiler class
│   └── scss/
│       ├── _variables.scss        # Design tokens (all !default)
│       ├── _reset.scss            # Modern CSS reset
│       ├── _typography.scss       # Headings, lists, code, kbd
│       ├── _grid.scss             # 12-column flexbox grid
│       ├── _buttons.scss          # Solid + outline buttons
│       ├── _forms.scss            # Inputs, selects, checkboxes, validation
│       ├── _cards.scss            # Card components
│       ├── _nav.scss              # Navbar, nav links, breadcrumbs
│       ├── _modals.scss           # Modal dialogs
│       ├── _alerts.scss           # Alert messages
│       ├── _tables.scss           # Table styles
│       ├── _badges.scss           # Badge labels
│       ├── _utilities.scss        # Utility classes
│       ├── tina4.scss             # Main entry (imports all)
│       ├── base.scss              # Base entry
│       └── colors.scss            # CSS custom properties
├── tina4_css/                     # Python package
│   └── __init__.py                # css_path(), scss_path() helpers
├── composer.json                  # PHP package
├── package.json                   # npm package
├── pyproject.toml                 # Python package
├── tina4-css.gemspec              # Ruby gem
└── example.html                   # Full component showcase
```

## Framework Integration

### Tina4 PHP

```php
// Auto-loaded when installed via composer
$tina4css = new \Tina4\Tina4CSS();
$tina4css->compile(__DIR__ . '/src/scss', 'tina4css');
```

### Tina4 Python

The framework auto-compiles any SCSS in `src/scss/`. To use tina4-css with custom theming:

1. Copy the SCSS files to `src/scss/`
2. Create your `theme.scss` with overrides
3. The framework compiles everything on startup

Or just use the pre-compiled CSS — copy `dist/tina4.min.css` to `src/public/css/`.

### Tina4 Ruby

```ruby
# In your app, copy the CSS to your public folder or
# configure your asset pipeline to include the gem's dist/ path
require "tina4-css"
```

### Tina4 JS

```javascript
// In your entry point or HTML
import "tina4-css/dist/tina4.min.css";
```

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Our Sponsors

**Sponsored with love by Code Infinity**

[<img src="https://codeinfinity.co.za/wp-content/uploads/2025/09/c8e-logo-github.png" alt="Code Infinity" width="100">](https://codeinfinity.co.za/about-open-source-policy?utm_source=github&utm_medium=website&utm_campaign=opensource_campaign&utm_id=opensource)

*Supporting open source communities - Innovate - Code - Empower*

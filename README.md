<p align="center">
  <img src="https://tina4.com/logo.svg" alt="Tina4" width="200">
</p>

<h1 align="center">Tina4 CSS</h1>
<h3 align="center">The Intelligent Native Application 4ramework</h3>

<p align="center">
  Lightweight CSS framework + Frond JS helper. Zero dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tina4-css"><img src="https://img.shields.io/npm/v/tina4-css?color=7b1fa2&label=npm" alt="npm"></a>
  <a href="https://pypi.org/project/tina4-css/"><img src="https://img.shields.io/pypi/v/tina4-css?color=7b1fa2&label=PyPI" alt="PyPI"></a>
  <img src="https://img.shields.io/badge/CSS-~24KB-blue" alt="CSS Size">
  <img src="https://img.shields.io/badge/Frond_JS-~4KB-blue" alt="Frond Size">
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="Zero Deps">
  <a href="https://tina4.com"><img src="https://img.shields.io/badge/docs-tina4.com-7b1fa2" alt="Docs"></a>
</p>

<p align="center">
  <a href="https://tina4.com">Documentation</a> &bull;
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#css-components">CSS Components</a> &bull;
  <a href="#frond---client-side-helper">Frond JS</a> &bull;
  <a href="https://tina4.com">tina4.com</a>
</p>

---

## What's Inside

Tina4 CSS ships **two things** that every Tina4 app needs:

| File | What | Size |
|------|------|------|
| `tina4.min.css` | Responsive CSS framework (grid, buttons, forms, cards, nav, modals, alerts, tables, badges, utilities) | ~24KB |
| `tina4.js` | Tiny component JS (modals, alert dismiss, navbar toggler) | ~3KB |
| `frond.min.js` | Client-side DOM helper for SSR apps (AJAX, forms, WebSocket, SSE, cookies) | ~4KB |

## Installing

```bash
# PHP (Composer)
composer require tina4stack/tina4css

# JavaScript / Node.js (npm)
npm install tina4-css

# Python (pip / uv)
pip install tina4-css

# Ruby (gem)
gem install tina4-css

# Or just grab the files
curl -o tina4.min.css https://raw.githubusercontent.com/tina4stack/tina4-css/main/dist/tina4.min.css
curl -o frond.min.js https://raw.githubusercontent.com/tina4stack/tina4-css/main/dist/frond.min.js
```

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="tina4.min.css">
</head>
<body>
  <div class="container">
    <h1>Hello Tina4</h1>
    <div id="content">Loading...</div>
  </div>

  <script src="tina4.js"></script>
  <script src="frond.min.js"></script>
  <script>
    // Load a page fragment via AJAX
    frond.load("/api/dashboard", "content");
  </script>
</body>
</html>
```

---

## CSS Components

### Grid

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">Column 1</div>
    <div class="col-12 col-md-6 col-lg-4">Column 2</div>
    <div class="col-12 col-md-6 col-lg-4">Column 3</div>
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
  Error occurred.
  <button class="btn-close" data-t4-dismiss="alert">&times;</button>
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
  <button class="navbar-toggler" data-t4-toggle="collapse" data-t4-target="#nav">&#9776;</button>
  <div class="navbar-collapse collapse" id="nav">
    <ul class="navbar-nav">
      <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="#">About</a></li>
    </ul>
  </div>
</nav>
```

### Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-danger badge-pill">5</span>
```

### Modals

```html
<button class="btn btn-primary" data-t4-toggle="modal" data-t4-target="#myModal">Open</button>

<div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Title</h5>
        <button class="btn-close" data-t4-dismiss="modal">&times;</button>
      </div>
      <div class="modal-body"><p>Modal content.</p></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-t4-dismiss="modal">Close</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
```

### Utility Classes

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

---

## Frond — Client-Side Helper

Frond is the JavaScript companion for server-rendered Tina4 apps. It handles AJAX page loads, form submission, real-time connections (WebSocket + SSE), and cookie management. Pure native JS, zero dependencies.

```html
<script src="frond.min.js"></script>
<script>
  // Everything is on window.frond
  frond.load("/dashboard", "content");
</script>
```

### frond.request(url, options?)

Core HTTP request with auto Bearer token management.

```javascript
// Simple GET with callback
frond.request("/api/users", function(data, status) {
  console.log(data);
});

// POST with options
frond.request("/api/users", {
  method: "POST",
  body: { name: "Alice", email: "alice@example.com" },
  onSuccess: function(data, status) {
    console.log("Created:", data);
  },
  onError: function(status) {
    console.log("Error:", status);
  }
});

// PUT with custom headers
frond.request("/api/users/1", {
  method: "PUT",
  body: { name: "Bob" },
  headers: { "X-Custom": "value" },
  onSuccess: function(data) { console.log(data); }
});
```

### frond.load(url, target?, callback?)

GET a URL and inject the HTML response into a DOM element. Executes embedded `<script>` tags.

```javascript
// Load into #content (default target)
frond.load("/pages/dashboard");

// Load into a specific element
frond.load("/pages/sidebar", "sidebar");

// With callback
frond.load("/pages/users", "content", function(html, rawData) {
  console.log("Page loaded");
});
```

### frond.post(url, data, target?, callback?)

POST data and inject the response HTML.

```javascript
frond.post("/api/search", { query: "widgets" }, "results");

frond.post("/api/process", { id: 42 }, "output", function(html, raw) {
  console.log("Done:", raw);
});
```

### frond.inject(html, target)

Parse an HTML string, inject it into a target element, and execute any embedded `<script>` tags.

```javascript
// Inject into an element
frond.inject('<h1>Hello</h1><script>console.log("loaded")</script>', "content");

// Get processed HTML without injecting (pass null)
var html = frond.inject('<div>Test</div>', null);
```

### frond.form.collect(formId)

Collect all form fields into a FormData object. Handles text inputs, selects, textareas, file uploads (multi-file), checkboxes, and radio buttons.

```javascript
var data = frond.form.collect("myForm");
// Returns FormData with all field values
```

### frond.form.submit(formId, url, target?, callback?)

Collect form data and POST it. Inject the response into a target element.

```javascript
// Submit form and show result in #message
frond.form.submit("userForm", "/api/users/save");

// With custom target and callback
frond.form.submit("productForm", "/api/products", "result", function(html, raw) {
  if (raw.success) frond.message("Saved!", "success");
});
```

### frond.form.show(action, url, target?, callback?)

Load a form via a friendly action name. "create" and "edit" map to GET, "delete" maps to DELETE.

```javascript
// Load a create form
frond.form.show("create", "/admin/products/new", "formArea");

// Load an edit form
frond.form.show("edit", "/admin/products/42/edit", "formArea");

// Delete
frond.form.show("delete", "/api/products/42", "formArea", function(data) {
  frond.message("Deleted", "warning");
});
```

### frond.ws(url, options?)

WebSocket with auto-reconnect and exponential backoff.

```javascript
var socket = frond.ws("/ws/chat/room1", {
  reconnect: true,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000,
  onOpen: function() { console.log("Connected"); },
  onClose: function(code, reason) { console.log("Closed:", code); },
  onError: function(err) { console.log("Error:", err); }
});

// Listen for messages (auto-parses JSON)
socket.on("message", function(data) {
  console.log("Received:", data);
  // data is already parsed if JSON
});

// Send data (objects auto-stringify)
socket.send({ type: "message", text: "Hello!" });
socket.send("plain text");

// Check status
console.log(socket.status); // "connecting" | "open" | "closed" | "reconnecting"

// Close (stops reconnect)
socket.close();
```

### frond.sse(url, options?)

Server-Sent Events with auto-reconnect and JSON parsing.

```javascript
var stream = frond.sse("/api/events/sales", {
  reconnect: true,
  json: true,
  events: ["order", "stock"],  // named SSE events
  onOpen: function() { console.log("SSE connected"); },
  onClose: function() { console.log("SSE closed"); }
});

// Listen for all messages
stream.on("message", function(data, eventName) {
  console.log(eventName || "message", data);
  // data is auto-parsed JSON
});

// Check status
console.log(stream.status); // "connecting" | "open" | "closed" | "reconnecting"

// Close (stops reconnect)
stream.close();
```

### frond.cookie

```javascript
// Set a cookie (expires in 30 days)
frond.cookie.set("theme", "dark", 30);

// Get a cookie
var theme = frond.cookie.get("theme"); // "dark"

// Remove a cookie
frond.cookie.remove("theme");
```

### frond.message(text, type?)

Display a tina4-css dismissible alert in the `#message` element.

```javascript
frond.message("Saved successfully!", "success");
frond.message("Something went wrong", "danger");
frond.message("Please check your input", "warning");
frond.message("FYI: maintenance tonight", "info");
```

### frond.popup(url, title, w, h)

Open a centred popup window.

```javascript
frond.popup("/print/invoice/42", "Invoice", 800, 600);
```

### frond.report(url)

Open a PDF report in a new window.

```javascript
frond.report("/api/reports/sales.pdf");
```

### frond.token

Read or set the Bearer token used for all requests.

```javascript
// Set token after login
frond.token = "eyJhbGciOiJIUzI1NiIs...";

// Read current token
console.log(frond.token);

// Token auto-rotates from FreshToken response header
```

---

## Theming

Override any variable before importing the framework:

```scss
$primary:   #e74c3c;
$secondary: #2c3e50;
$font-family-base: 'Inter', sans-serif;

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

## CSS Custom Properties

All design tokens available at runtime:

```css
:root {
  --t4-primary: #4a90d9;
  --t4-secondary: #6c757d;
  --t4-font-family: system-ui, ...;
  --t4-border-radius: 0.25rem;
  --t4-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
}
```

---

## File Structure

```
tina4-css/
├── dist/                          # Pre-compiled (ready to use)
│   ├── tina4.css                  # Expanded CSS (~30KB)
│   ├── tina4.min.css              # Minified CSS (~24KB)
│   ├── base.min.css               # Base only (no colors)
│   ├── colors.min.css             # CSS custom properties only
│   ├── tina4.js                   # Component JS (modals, alerts, navbar)
│   └── frond.min.js               # Frond client-side helper
├── src/
│   ├── app/
│   │   └── Tina4CSS.php           # PHP SCSS compiler class
│   ├── js/
│   │   └── frond.ts               # Frond TypeScript source
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
├── composer.json                  # PHP package
├── package.json                   # npm package
├── pyproject.toml                 # Python package
├── tina4-css.gemspec              # Ruby gem
└── example.html                   # Full component showcase
```

## Building Frond

```bash
npm install                        # Install esbuild
npm run build:frond                # Build frond.min.js from TypeScript source
```

## Framework Integration

Every Tina4 backend framework ships with tina4-css pre-installed:

```bash
tina4 init    # Creates project with tina4.min.css + tina4.js + frond.min.js
```

### PHP

```php
$tina4css = new \Tina4\Tina4CSS();
$tina4css->compile(__DIR__ . '/src/scss', 'tina4css');
```

### Python

```python
from tina4_css import css_path, scss_path
# Auto-compiles SCSS from src/scss/ in dev mode
```

### Ruby

```ruby
require "tina4-css"
Tina4CSS.css_path   # => "/path/to/tina4.min.css"
```

### Node.js

```javascript
import "tina4-css/dist/tina4.min.css";
```

## Example

See [example.html](example.html) for a complete showcase of all CSS components.

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Our Sponsors

**Sponsored with :blue_heart: by Code Infinity**

[<img src="https://codeinfinity.co.za/wp-content/uploads/2025/09/c8e-logo-github.png" alt="Code Infinity" width="100">](https://codeinfinity.co.za/about-open-source-policy?utm_source=github&utm_medium=website&utm_campaign=opensource_campaign&utm_id=opensource)

*Supporting open source communities . Innovate . Code . Empower*

"""Tina4 CSS — Lightweight responsive CSS framework.

Provides helper functions to locate the pre-compiled CSS and SCSS source
files shipped with this package, so any Python web framework can serve them.

Usage::

    from tina4_css import css_path, scss_path

    # Pre-compiled CSS (ready to serve)
    css_path()   # → "/path/to/tina4_css/dist/tina4.min.css"

    # SCSS sources (for custom compilation / theming)
    scss_path()  # → "/path/to/tina4_css/scss/"
"""

__version__ = "2.0.0"

import os as _os

_PKG_DIR = _os.path.dirname(_os.path.abspath(__file__))


def css_path(minified=True):
    """Return the path to the pre-compiled CSS file.

    Args:
        minified: If True (default), returns the minified version.

    Returns:
        Absolute path to the CSS file.
    """
    name = "tina4.min.css" if minified else "tina4.css"
    return _os.path.join(_PKG_DIR, "dist", name)


def scss_path():
    """Return the path to the SCSS source directory.

    Use this when you want to compile with custom theme variables.

    Returns:
        Absolute path to the scss/ directory.
    """
    return _os.path.join(_PKG_DIR, "scss")


def css_content(minified=True):
    """Return the CSS content as a string.

    Args:
        minified: If True (default), returns the minified version.

    Returns:
        The CSS file contents as a string.
    """
    with open(css_path(minified), "r", encoding="utf-8") as f:
        return f.read()

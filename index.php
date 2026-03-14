<?php

/**
 * Tina4 - This is not a 4ramework.
 * Copy-right 2007 - current Tina4
 * License: MIT https://opensource.org/licenses/MIT
 *
 * Tina4CSS module bootstrap - compiles SCSS to CSS on load.
 */

use Tina4\Tina4CSS;

$tina4css = new Tina4CSS();

// Compile framework SCSS if output is missing or files have changed
$frameworkScssPath = __DIR__ . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'scss';

if ($tina4css->needsCompile('tina4css') || $tina4css->hasChanges($frameworkScssPath)) {
    $tina4css->compile($frameworkScssPath, 'tina4css');
}

// Compile project-level SCSS if it exists
$projectScssPath = '.' . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'scss';

if (is_dir($projectScssPath) && ($tina4css->needsCompile('default') || $tina4css->hasChanges($projectScssPath))) {
    $tina4css->compile($projectScssPath, 'default');
}

// Register as a Tina4 module if the framework is available
if (class_exists('\Tina4\Module')) {
    \Tina4\Module::addModule("Tina4CSS", "2.0.0", "Tina4CSS - Lightweight Responsive CSS Framework");
}

<?php

/**
 * Tina4 - This is not a 4ramework.
 * Copy-right 2007 - current Tina4
 * License: MIT https://opensource.org/licenses/MIT
 *
 * Tina4CSS - A lightweight responsive CSS framework compiler
 * Uses scssphp to compile SCSS source files into CSS output.
 */

namespace Tina4;

use ScssPhp\ScssPhp\Compiler;
use ScssPhp\ScssPhp\OutputStyle;

class Tina4CSS
{
    /**
     * @var Compiler The scssphp compiler instance
     */
    private Compiler $compiler;

    /**
     * @var string Path to the output CSS directory
     */
    private string $outputPath;

    /**
     * @var array<string, int> Cache of file modification times for watch mode
     */
    private array $fileModTimes = [];

    /**
     * Constructor - initializes the SCSS compiler.
     *
     * @param string $outputPath Directory where compiled CSS files are written
     */
    public function __construct(string $outputPath = './src/assets/css')
    {
        $this->compiler = new Compiler();
        $this->outputPath = $outputPath;
        $this->ensureOutputDirectory();
    }

    /**
     * Compile all SCSS files in the given directory.
     *
     * Resolves @import paths so that partials are found correctly.
     * Non-partial SCSS files (those not prefixed with _) are compiled
     * and written to the output directory with the given prefix.
     *
     * @param string $scssPath Path to the SCSS source directory
     * @param string $prefix   Filename prefix for the output CSS file
     * @return string The compiled CSS content
     */
    public function compile(string $scssPath, string $prefix = 'tina4'): string
    {
        if (!is_dir($scssPath)) {
            return '';
        }

        $this->compiler->setImportPaths([$scssPath]);

        try {
            $this->compiler->setOutputStyle(OutputStyle::COMPRESSED);
        } catch (\Throwable $e) {
            // Fallback for older scssphp versions
        }

        $cssContent = '';
        $files = scandir($scssPath);

        if ($files === false) {
            return '';
        }

        foreach ($files as $file) {
            // Skip dot files and partials (files starting with _)
            if ($file === '.' || $file === '..') {
                continue;
            }

            if (!str_ends_with($file, '.scss')) {
                continue;
            }

            // Skip partials - they are imported by main files
            if (str_starts_with($file, '_')) {
                continue;
            }

            $scssCode = file_get_contents($scssPath . DIRECTORY_SEPARATOR . $file);
            if ($scssCode === false) {
                continue;
            }

            try {
                $result = $this->compiler->compileString($scssCode);
                $compiled = $result->getCss();
                $cssContent .= $compiled;

                // Write individual file output
                $cssFilename = str_replace('.scss', '.css', $file);
                file_put_contents(
                    $this->outputPath . DIRECTORY_SEPARATOR . $prefix . '-' . $cssFilename,
                    $compiled
                );
            } catch (\Throwable $e) {
                error_log("Tina4CSS compile error in {$file}: " . $e->getMessage());
            }
        }

        // Also write a combined file
        if (!empty($cssContent)) {
            file_put_contents(
                $this->outputPath . DIRECTORY_SEPARATOR . $prefix . '.css',
                $cssContent
            );
        }

        return $cssContent;
    }

    /**
     * Compile a single SCSS file.
     *
     * @param string $filePath  Absolute or relative path to the SCSS file
     * @param string|null $importPath Optional import path for resolving @import directives
     * @return string The compiled CSS
     */
    public function compileFile(string $filePath, ?string $importPath = null): string
    {
        if (!file_exists($filePath)) {
            return '';
        }

        if ($importPath !== null) {
            $this->compiler->setImportPaths([$importPath]);
        } else {
            $this->compiler->setImportPaths([dirname($filePath)]);
        }

        $scssCode = file_get_contents($filePath);
        if ($scssCode === false) {
            return '';
        }

        try {
            $result = $this->compiler->compileString($scssCode);
            return $result->getCss();
        } catch (\Throwable $e) {
            error_log("Tina4CSS compile error: " . $e->getMessage());
            return '';
        }
    }

    /**
     * Get compiled CSS from an SCSS string.
     *
     * @param string $scssCode   The SCSS source code
     * @param string|null $importPath Optional import path for resolving @import directives
     * @return string The compiled CSS
     */
    public function getCompiledCSS(string $scssCode, ?string $importPath = null): string
    {
        if ($importPath !== null) {
            $this->compiler->setImportPaths([$importPath]);
        }

        try {
            $result = $this->compiler->compileString($scssCode);
            return $result->getCss();
        } catch (\Throwable $e) {
            error_log("Tina4CSS compile error: " . $e->getMessage());
            return '';
        }
    }

    /**
     * Check if any SCSS files have been modified since last compilation.
     *
     * Used for watch mode - compares file modification times to detect changes.
     *
     * @param string $scssPath Path to the SCSS source directory
     * @return bool True if files have changed and recompilation is needed
     */
    public function hasChanges(string $scssPath): bool
    {
        if (!is_dir($scssPath)) {
            return false;
        }

        $files = scandir($scssPath);
        if ($files === false) {
            return false;
        }

        $changed = false;
        foreach ($files as $file) {
            if ($file === '.' || $file === '..' || !str_ends_with($file, '.scss')) {
                continue;
            }

            $fullPath = $scssPath . DIRECTORY_SEPARATOR . $file;
            $mtime = filemtime($fullPath);

            if ($mtime === false) {
                continue;
            }

            if (!isset($this->fileModTimes[$fullPath]) || $this->fileModTimes[$fullPath] !== $mtime) {
                $this->fileModTimes[$fullPath] = $mtime;
                $changed = true;
            }
        }

        return $changed;
    }

    /**
     * Check if compilation is needed (output CSS files are missing).
     *
     * @param string $prefix The output file prefix to check for
     * @return bool True if compilation is needed
     */
    public function needsCompile(string $prefix = 'tina4'): bool
    {
        return !file_exists($this->outputPath . DIRECTORY_SEPARATOR . $prefix . '.css');
    }

    /**
     * Get the scssphp Compiler instance for advanced configuration.
     *
     * @return Compiler
     */
    public function getCompiler(): Compiler
    {
        return $this->compiler;
    }

    /**
     * Set the output style for the compiler.
     *
     * @param OutputStyle $style The output style (EXPANDED or COMPRESSED)
     * @return self
     */
    public function setOutputStyle(OutputStyle $style): self
    {
        $this->compiler->setOutputStyle($style);
        return $this;
    }

    /**
     * Ensure the output directory exists.
     *
     * @return void
     */
    private function ensureOutputDirectory(): void
    {
        if (!file_exists($this->outputPath)) {
            if (!mkdir($this->outputPath, 0777, true) && !is_dir($this->outputPath)) {
                throw new \RuntimeException(
                    sprintf('Directory "%s" could not be created', $this->outputPath)
                );
            }
        }
    }
}

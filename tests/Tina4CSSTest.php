<?php

/**
 * Tina4 CSS Framework - Unit Tests
 */

namespace Tina4\Tests;

use PHPUnit\Framework\TestCase;
use Tina4\Tina4CSS;

class Tina4CSSTest extends TestCase
{
    private string $scssPath;
    private string $outputPath;

    protected function setUp(): void
    {
        $this->scssPath = __DIR__ . '/../src/scss';
        $this->outputPath = sys_get_temp_dir() . '/tina4css-test-' . uniqid();
        mkdir($this->outputPath, 0777, true);
    }

    protected function tearDown(): void
    {
        // Clean up temp output
        if (is_dir($this->outputPath)) {
            $files = glob($this->outputPath . '/*');
            if ($files) {
                foreach ($files as $file) {
                    unlink($file);
                }
            }
            rmdir($this->outputPath);
        }
    }

    /**
     * Test that all expected SCSS component files exist.
     */
    public function testAllComponentFilesExist(): void
    {
        $expectedFiles = [
            '_variables.scss',
            '_reset.scss',
            '_typography.scss',
            '_grid.scss',
            '_buttons.scss',
            '_forms.scss',
            '_cards.scss',
            '_nav.scss',
            '_modals.scss',
            '_alerts.scss',
            '_tables.scss',
            '_badges.scss',
            '_utilities.scss',
            'tina4.scss',
            'base.scss',
            'colors.scss',
        ];

        foreach ($expectedFiles as $file) {
            $this->assertFileExists(
                $this->scssPath . DIRECTORY_SEPARATOR . $file,
                "SCSS component file {$file} is missing"
            );
        }
    }

    /**
     * Test that SCSS compiles without errors.
     */
    public function testScssCompilesWithoutErrors(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertNotEmpty($css, 'Compiled CSS should not be empty');
        $this->assertFileExists($this->outputPath . '/test.css', 'Combined CSS file should be created');
    }

    /**
     * Test that compiled CSS contains container class.
     */
    public function testOutputContainsContainer(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('.container', $css, 'CSS should contain .container class');
        $this->assertStringContainsString('.container-fluid', $css, 'CSS should contain .container-fluid class');
    }

    /**
     * Test that compiled CSS contains button classes.
     */
    public function testOutputContainsButtons(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('.btn', $css, 'CSS should contain .btn class');
        $this->assertStringContainsString('.btn-primary', $css, 'CSS should contain .btn-primary class');
        $this->assertStringContainsString('.btn-outline-', $css, 'CSS should contain .btn-outline-* classes');
    }

    /**
     * Test that compiled CSS contains grid column classes.
     */
    public function testOutputContainsGridColumns(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('.col-', $css, 'CSS should contain .col-* classes');
        $this->assertStringContainsString('.col-1', $css, 'CSS should contain .col-1 class');
        $this->assertStringContainsString('.col-12', $css, 'CSS should contain .col-12 class');
        $this->assertStringContainsString('.row', $css, 'CSS should contain .row class');
    }

    /**
     * Test that compiled CSS contains card classes.
     */
    public function testOutputContainsCards(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('.card', $css, 'CSS should contain .card class');
        $this->assertStringContainsString('.card-body', $css, 'CSS should contain .card-body class');
        $this->assertStringContainsString('.card-header', $css, 'CSS should contain .card-header class');
    }

    /**
     * Test that responsive breakpoints are generated.
     */
    public function testResponsiveBreakpointsGenerated(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('@media', $css, 'CSS should contain @media queries');
        $this->assertStringContainsString('576px', $css, 'CSS should contain sm breakpoint (576px)');
        $this->assertStringContainsString('768px', $css, 'CSS should contain md breakpoint (768px)');
        $this->assertStringContainsString('992px', $css, 'CSS should contain lg breakpoint (992px)');
        $this->assertStringContainsString('1200px', $css, 'CSS should contain xl breakpoint (1200px)');
    }

    /**
     * Test that compiled CSS contains utility classes.
     */
    public function testOutputContainsUtilities(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('.d-none', $css, 'CSS should contain .d-none utility');
        $this->assertStringContainsString('.d-flex', $css, 'CSS should contain .d-flex utility');
        $this->assertStringContainsString('.m-0', $css, 'CSS should contain .m-0 spacing utility');
        $this->assertStringContainsString('.text-center', $css, 'CSS should contain .text-center utility');
        $this->assertStringContainsString('.bg-primary', $css, 'CSS should contain .bg-primary utility');
    }

    /**
     * Test that compiled CSS contains navigation components.
     */
    public function testOutputContainsNavigation(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('.navbar', $css, 'CSS should contain .navbar class');
        $this->assertStringContainsString('.nav-link', $css, 'CSS should contain .nav-link class');
        $this->assertStringContainsString('.breadcrumb', $css, 'CSS should contain .breadcrumb class');
    }

    /**
     * Test that compiled CSS contains table classes.
     */
    public function testOutputContainsTables(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile($this->scssPath, 'test');

        $this->assertStringContainsString('.table', $css, 'CSS should contain .table class');
        $this->assertStringContainsString('.table-striped', $css, 'CSS should contain .table-striped class');
        $this->assertStringContainsString('.table-responsive', $css, 'CSS should contain .table-responsive class');
    }

    /**
     * Test single file compilation.
     */
    public function testCompileFile(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compileFile($this->scssPath . '/tina4.scss');

        $this->assertNotEmpty($css, 'compileFile should return compiled CSS');
        $this->assertStringContainsString('.container', $css);
    }

    /**
     * Test getCompiledCSS from string input.
     */
    public function testGetCompiledCSS(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $scss = '@import "variables"; .test { color: $primary; }';
        $css = $tina4css->getCompiledCSS($scss, $this->scssPath);

        $this->assertNotEmpty($css, 'getCompiledCSS should return compiled CSS');
        $this->assertStringContainsString('.test', $css);
        $this->assertStringContainsString('#4a90d9', $css);
    }

    /**
     * Test that hasChanges works properly.
     */
    public function testHasChangesDetectsInitialState(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);

        // First call should always report changes (no cached times)
        $this->assertTrue($tina4css->hasChanges($this->scssPath), 'First check should report changes');

        // Second call with no file changes should report no changes
        $this->assertFalse($tina4css->hasChanges($this->scssPath), 'Second check should report no changes');
    }

    /**
     * Test that needsCompile returns true when no output exists.
     */
    public function testNeedsCompile(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);

        $this->assertTrue($tina4css->needsCompile('nonexistent'), 'Should need compile when output is missing');

        $tina4css->compile($this->scssPath, 'test');
        $this->assertFalse($tina4css->needsCompile('test'), 'Should not need compile after compilation');
    }

    /**
     * Test that the main framework CSS stays lightweight (under 30KB compressed).
     */
    public function testCompiledCSSIsLightweight(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compileFile($this->scssPath . '/tina4.scss');

        $sizeKB = strlen($css) / 1024;
        $this->assertLessThan(
            60,
            $sizeKB,
            "Compiled tina4.scss should be under 60KB minified, got {$sizeKB}KB"
        );
    }

    /**
     * Test compiling a non-existent directory returns empty string.
     */
    public function testCompileNonExistentPath(): void
    {
        $tina4css = new Tina4CSS($this->outputPath);
        $css = $tina4css->compile('/nonexistent/path');

        $this->assertEmpty($css, 'Compiling non-existent path should return empty string');
    }
}

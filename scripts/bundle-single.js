// Bundles the Vite build output into a single self-contained HTML file
// that can be opened directly from the filesystem in Chrome.
//
// Usage: node scripts/bundle-single.js
//        (run `npm run build` first)

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distDir = join(import.meta.dirname, '..', 'dist');
const assetsDir = join(distDir, 'assets');

// Find built assets
const assets = readdirSync(assetsDir);
const jsFile = assets.find(f => f.endsWith('.js'));
const cssFile = assets.find(f => f.endsWith('.css'));

if (!jsFile) {
  console.error('Could not find built JS asset. Run `npm run build` first.');
  process.exit(1);
}

const js = readFileSync(join(assetsDir, jsFile), 'utf-8');

// Escape any literal </script> sequences inside the JS so the HTML parser
// doesn't terminate the inline script tag prematurely.
// This turns </script> into <\/script> which is harmless in JS strings.
const safeJs = js.replace(/<\/script>/gi, '<\\/script>');

// Read CSS if it was emitted as a separate file (Tailwind may be inlined
// into the JS bundle instead, in which case cssFile is undefined).
const css = cssFile ? readFileSync(join(assetsDir, cssFile), 'utf-8') : '';

// Build the final HTML from scratch rather than doing fragile regex
// replacements on Vite's output. This guarantees:
//   1. <div id="root"> exists BEFORE the script runs
//   2. No type="module" attribute (blocked by file:// protocol)
//   3. No external resource references
//   4. Correct DOCTYPE and charset
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="theme-color" content="#0a0806" />
  <meta name="description" content="Master chess openings through interactive practice with Okami-style sumi-e graphics" />
  <title>Chess Opening Trainer</title>
  <style>
    html, body, #root {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #0a0806;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    body {
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
      overscroll-behavior: none;
    }
    html { position: fixed; width: 100%; }
  </style>
${css ? `  <style>${css}</style>\n` : ''}</head>
<body>
  <div id="root"></div>
  <script>${safeJs}</script>
</body>
</html>
`;

// Write the single file to project root
const outPath = join(import.meta.dirname, '..', 'chess-trainer.html');
writeFileSync(outPath, html, 'utf-8');

// Verification: check for issues in the output
let warnings = 0;

// Check 1: No stray </script> inside the inline script
// Split on </script> - a correct file has exactly 2 parts (before and after the one closing tag)
const scriptParts = html.split(/<\/script>/gi);
if (scriptParts.length !== 2) {
  console.error(`WARNING: Found ${scriptParts.length - 1} </script> occurrences (expected exactly 1)`);
  warnings++;
}

// Check 2: The #root div appears before the script
const rootPos = html.indexOf('<div id="root">');
const scriptPos = html.indexOf('<script>');
if (rootPos === -1 || scriptPos === -1 || rootPos > scriptPos) {
  console.error('WARNING: <div id="root"> must appear before <script> in the HTML');
  warnings++;
}

// Check 3: No type="module" on script tags
if (html.includes('<script type="module"')) {
  console.error('WARNING: Found type="module" script tag (blocked by file:// protocol)');
  warnings++;
}

// Check 4: No external src references on script tags
if (/<script[^>]+src=/.test(html)) {
  console.error('WARNING: Found script tag with external src attribute');
  warnings++;
}

const sizeMB = (html.length / (1024 * 1024)).toFixed(1);
if (warnings > 0) {
  console.error(`\nBundled with ${warnings} warning(s) - please investigate!`);
} else {
  console.log(`\nBundled into chess-trainer.html (${sizeMB} MB) - all checks passed`);
  console.log('Open this file directly in Google Chrome to play!\n');
}

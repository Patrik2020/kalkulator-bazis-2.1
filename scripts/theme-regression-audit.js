const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const visualPath = path.join(root, 'css/pages/visual-refresh-2026.css');
const hardeningPath = path.join(root, 'css/pages/dark-mode-hardening.css');
const stylePath = path.join(root, 'css/style.css');

const visual = fs.readFileSync(visualPath, 'utf8');
const hardening = fs.readFileSync(hardeningPath, 'utf8');
const style = fs.readFileSync(stylePath, 'utf8');

const errors = [];

function blockFor(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  return match ? match[1] : '';
}

function customProperties(block) {
  return new Set([...block.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]));
}

const lightBody = blockFor(visual, 'body');
const darkVisualBody = blockFor(visual, 'html[data-theme="dark"] body');
const darkHardeningBody = blockFor(hardening, 'html[data-theme="dark"] body');

if (!lightBody || !darkVisualBody || !darkHardeningBody) {
  errors.push('Nem található valamelyik elvárt light/dark body változóblokk.');
}

const lightVars = customProperties(lightBody);
const darkVars = new Set([...customProperties(darkVisualBody), ...customProperties(darkHardeningBody)]);

for (const variable of lightVars) {
  if (!variable.startsWith('--surface-')) continue;
  if (!darkVars.has(variable)) {
    errors.push(`A ${variable} light body-változónak nincs dark body párja.`);
  }
}

const requiredAliases = ['--card-bg', '--input-bg', '--surface-color', '--border-color', '--text-secondary'];
for (const variable of requiredAliases) {
  if (!darkVars.has(variable)) errors.push(`Hiányzó dark kompatibilitási alias: ${variable}`);
}

const requiredDarkSelectors = [
  'html[data-theme="dark"] body .notice-box',
  'html[data-theme="dark"] body .category-note',
  'html[data-theme="dark"] body .kb-page-nav a',
];
for (const selector of requiredDarkSelectors) {
  if (!hardening.includes(selector)) errors.push(`Hiányzó dark kontrasztvédő szabály: ${selector}`);
}

if (!style.includes("@import url('./pages/dark-mode-hardening.css?v=20260817-1');")) {
  errors.push('A dark-mode-hardening.css nincs betöltve a globális style.css-ben.');
}

function cssFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(absolute);
    return entry.isFile() && entry.name.endsWith('.css') ? [absolute] : [];
  });
}

const fallbackPattern = /var\(--(?:card-bg|input-bg|surface-color|surface-warning|surface-pink)\s*,/g;
const fallbackFiles = cssFiles(path.join(root, 'css')).filter((file) => fallbackPattern.test(fs.readFileSync(file, 'utf8')));

console.log(`Theme regression audit: ${lightVars.size} light body változó, ${darkVars.size} dark változó.`);
console.log(`Kompatibilitási fallbackot használó CSS fájlok: ${fallbackFiles.length}.`);

if (errors.length) {
  console.error('\nDark mode regressziós hibák:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Dark mode kontraszt- és változóaudit: rendben.');

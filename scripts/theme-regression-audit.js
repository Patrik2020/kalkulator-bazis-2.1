const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const visualPath = path.join(root, 'css/pages/visual-refresh-2026.css');
const hardeningPath = path.join(root, 'css/pages/dark-mode-hardening.css');
const stylePath = path.join(root, 'css/style.css');
const seasonalCssPath = path.join(root, 'css/seasonal-theme.css');
const seasonalScriptPath = path.join(root, 'js/seasonal-theme.js');
const themeScriptPath = path.join(root, 'js/theme.js');

const visual = fs.readFileSync(visualPath, 'utf8');
const hardening = fs.readFileSync(hardeningPath, 'utf8');
const style = fs.readFileSync(stylePath, 'utf8');
const seasonalCss = fs.readFileSync(seasonalCssPath, 'utf8');
const seasonalScript = fs.readFileSync(seasonalScriptPath, 'utf8');
const themeScript = fs.readFileSync(themeScriptPath, 'utf8');

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

const requiredAliases = [
  '--card-bg',
  '--input-bg',
  '--surface-color',
  '--border-color',
  '--text-secondary',
  '--soft-bg',
  '--muted-text',
  '--primary-color',
];
for (const variable of requiredAliases) {
  if (!darkVars.has(variable)) errors.push(`Hiányzó dark kompatibilitási alias: ${variable}`);
}

const requiredDarkSelectors = [
  'html[data-theme="dark"] body .notice-box',
  'html[data-theme="dark"] body .category-note',
  'html[data-theme="dark"] body .kb-page-nav a',
  'html[data-theme="dark"] body .ac-result',
  'html[data-theme="dark"] body .everyday-result',
  'html[data-theme="dark"] body .priority-result',
  'html[data-theme="dark"] body .priority-note',
  'html[data-theme="dark"] body .priority-warning',
  'html[data-theme="dark"] body .priority-source',
];
for (const selector of requiredDarkSelectors) {
  if (!hardening.includes(selector)) errors.push(`Hiányzó dark kontrasztvédő szabály: ${selector}`);
}

if (!style.includes("@import url('./pages/dark-mode-hardening.css?v=20260823-1');")) {
  errors.push('A dark-mode-hardening.css friss verziója nincs betöltve a globális style.css-ben.');
}

const seasons = ['spring', 'summer', 'autumn', 'winter'];
const events = ['halloween', 'christmas', 'newyear', 'easter'];

for (const season of seasons) {
  if (!seasonalCss.includes(`html[data-season="${season}"]`)) {
    errors.push(`Hiányzó szezonális CSS skin: ${season}.`);
  }
}

for (const event of events) {
  if (!seasonalCss.includes(`html[data-event="${event}"]`)) {
    errors.push(`Hiányzó ünnepi CSS skin: ${event}.`);
  }
}

if (!seasonalCss.includes('html[data-theme="dark"][data-season]')) {
  errors.push('A szezonális réteghez nincs dark-mode kontrasztvédelem.');
}
if (!seasonalCss.includes('@media (prefers-reduced-motion: reduce)')) {
  errors.push('A szezonális animációhoz nincs reduced-motion védelem.');
}
if (!themeScript.includes('css/seasonal-theme.css') || !themeScript.includes('js/seasonal-theme.js')) {
  errors.push('A globális theme.js nem tölti be a szezonális CSS/JS réteget.');
}
if (!seasonalScript.includes('timeZone: "Europe/Budapest"')) {
  errors.push('A szezonális motor nem Europe/Budapest dátumlogikát használ.');
}

function runSeasonal(search) {
  const dataset = {};
  const classNames = new Set();
  const context = {
    window: {
      location: { search },
    },
    document: {
      documentElement: {
        dataset,
        classList: { add: (...names) => names.forEach((name) => classNames.add(name)) },
      },
      dispatchEvent: () => {},
    },
    CustomEvent: class CustomEvent {
      constructor(type, init) {
        this.type = type;
        this.detail = init?.detail;
      }
    },
    URLSearchParams,
    Intl,
    Date,
    Math,
    Object,
    Set,
  };
  vm.runInNewContext(seasonalScript, context, { filename: 'seasonal-theme.js' });
  return { dataset, state: context.window.KB_SEASONAL_THEME, classNames };
}

for (const season of seasons) {
  const result = runSeasonal(`?kbSeason=${season}&kbEvent=none`);
  if (result.dataset.season !== season || result.dataset.event !== undefined) {
    errors.push(`A kbSeason=${season} teszt override hibás.`);
  }
  if (!result.classNames.has('kb-seasonal-ready')) {
    errors.push(`A kbSeason=${season} futás nem jelzi a kész állapotot.`);
  }
}

for (const event of events) {
  const result = runSeasonal(`?kbSeason=autumn&kbEvent=${event}`);
  if (result.dataset.season !== 'autumn' || result.dataset.event !== event) {
    errors.push(`A kbEvent=${event} teszt override hibás.`);
  }
}

function cssFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(absolute);
    return entry.isFile() && entry.name.endsWith('.css') ? [absolute] : [];
  });
}

const fallbackPattern = /var\(--(?:card-bg|input-bg|surface-color|surface-warning|surface-pink|soft-bg|muted-text|primary-color)\s*,/g;
const fallbackFiles = cssFiles(path.join(root, 'css')).filter((file) => fallbackPattern.test(fs.readFileSync(file, 'utf8')));

console.log(`Theme regression audit: ${lightVars.size} light body változó, ${darkVars.size} dark változó.`);
console.log(`Kompatibilitási fallbackot használó CSS fájlok: ${fallbackFiles.length}.`);
console.log(`Szezonális skin-ek: ${seasons.length} évszak + ${events.length} ünnepi felülírás.`);

if (errors.length) {
  console.error('\nTéma regressziós hibák:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Dark mode + szezonális téma audit: rendben.');

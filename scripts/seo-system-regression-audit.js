const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { groupByCalculator } = require("./category-taxonomy-config");
const { suites } = require("./reference-test-manifest");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const check = (label, callback) => {
  callback();
  checks.push(label);
};

const legacyRedirects = new Map(
  read("_redirects")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/))
    .map(([source, target, status]) => [source, { target, status }])
);

check("a négy régi Wise URL egy lépésben a mai jogi oldalakra irányít", () => {
  const expected = {
    "/landing-pages/wise/cookie-tajekoztato": "/cookie",
    "/landing-pages/wise/cookie-tajekoztato.html": "/cookie",
    "/landing-pages/wise/kapcsolat": "/kapcsolat",
    "/landing-pages/wise/kapcsolat.html": "/kapcsolat",
  };
  for (const [source, target] of Object.entries(expected)) {
    assert.deepStrictEqual(legacyRedirects.get(source), { target, status: "301" }, `${source}: hibás vagy hiányzó redirect`);
  }
});

check("a redirectcélok indexelhető, self-canonical oldalak", () => {
  for (const [file, canonical] of [
    ["cookie.html", "https://kalkulatorbazis.hu/cookie"],
    ["kapcsolat.html", "https://kalkulatorbazis.hu/kapcsolat"],
  ]) {
    const html = read(file);
    const canonicalTag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || "";
    const canonicalHref = canonicalTag.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
    assert.strictEqual(canonicalHref, canonical, `${file}: canonical eltérés`);
    assert.doesNotMatch(html, /<meta\b[^>]*name=["']robots["'][^>]*noindex/i, `${file}: nem lehet noindex`);
  }
});

check("a régi Wise URL-ek nincsenek a sitemapben", () => {
  const sitemap = read("sitemap.xml");
  assert.doesNotMatch(sitemap, /landing-pages\/wise\/(?:cookie-tajekoztato|kapcsolat)(?:\.html)?/);
});

const dataSource = read("js/site-data.js");
const sandbox = { window: {} };
vm.runInNewContext(dataSource, sandbox, { filename: "site-data.js" });
const scientificUrl = "kalkulatorok/multifunkcios-szamologep.html";
const scientificEntries = sandbox.window.KB_DATA.calculators.filter((item) => item.url === scientificUrl);

check("a tudományos számológép a központi registry része", () => {
  assert.strictEqual(scientificEntries.length, 1, "A tudományos számológép registry-bejegyzése nem egyedi.");
  assert.strictEqual(scientificEntries[0].category, "mindennapi");
  assert.strictEqual(scientificEntries[0].group, "matematika");
  assert.notStrictEqual(scientificEntries[0].hidden, true);
  assert.strictEqual(groupByCalculator[scientificUrl], "matematika");
});

check("a tudományos számológép minden központi felületen megjelenik", () => {
  for (const file of ["kalkulatorok.html", "mindennapi.html"]) {
    const matches = read(file).match(/href=["']kalkulatorok\/multifunkcios-szamologep["']/g) || [];
    assert.strictEqual(matches.length, 1, `${file}: a katalóguskártya hiányzik vagy duplikált`);
  }
  assert.match(read("sitemap.xml"), /<loc>https:\/\/kalkulatorbazis\.hu\/kalkulatorok\/multifunkcios-szamologep<\/loc>/);
  const manifestEntries = Object.values(suites).flat().filter((item) => item === scientificUrl);
  assert.strictEqual(manifestEntries.length, 1, "A tudományos számológép tesztmanifest-bejegyzése nem egyedi.");
  assert.doesNotMatch(read("scripts/final-fullsite-audit.js"), /supplementalCalculatorPages/);
});

const index = read("index.html");
check("a jelenlegi főoldali design már a statikus HTML elsődleges shellje", () => {
  const bodyTag = index.match(/<body\b[^>]*>/i)?.[0] || "";
  assert.match(bodyTag, /\bclass=["'][^"']*\bhome-redesign-v17\b/);
  assert.match(bodyTag, /\bdata-home-redesign-static=["']17["']/);
  const redesignLink = index.match(/<link\b[^>]*data-home-redesign-v17[^>]*>/i)?.[0] || "";
  assert.match(redesignLink, /\bhref=["'][^"']*home-redesign-v17\.css/);
  assert.match(index, /KB_HOME_SHELL:header:START/);
  assert.match(index, /KB_HOME_SHELL:main:START/);
  assert.match(index, /KB_HOME_SHELL:footer:START/);
  assert.match(index, /<main\s+id=["']main-content["'][^>]*>[\s\S]*class=["']hero["'][^>]*id=["']top["']/i);
  assert.doesNotMatch(index, /class=["'][^"']*\bhome-hero\b/);
  assert.ok(index.indexOf("data-home-redesign-v17") < index.indexOf("static-first-fallbacks.js"), "A redesign CSS túl későn töltődik.");
});

const fallback = read("js/static-first-fallbacks.js");
const theme = read("js/theme.js");
const homeIa = read("js/home-ia.js");
const homeCurrent = read("js/home-current.js");
const globalHead = read("js/global-head.js");

check("a főoldali redesignnak egyetlen bootstrap útvonala maradt", () => {
  assert.doesNotMatch(fallback, /home-ia\.js/);
  assert.match(theme, /script\[data-kb-home-ia\]/);
  assert.match(homeIa, /KB_HOME_IA_LOADED/);
  assert.match(homeIa, /data-kb-home-current|kbHomeCurrent/);
  assert.match(homeCurrent, /KB_HOME_CURRENT_LOADING/);
});

check("a statikus shellt a runtime hidratálja és nem cseréli le", () => {
  assert.match(homeCurrent, /hasStaticShell/);
  assert.match(homeCurrent, /dataset\.homeRedesignStatic\s*===\s*["']17["']/);
  assert.match(homeCurrent, /if\s*\(!hasStaticShell\(\)\)/);
  assert.match(homeCurrent, /findScriptByPath/);
  assert.match(homeCurrent, /loadOnce/);
});

check("a főoldal nem tölti a már nem használt gyorsszámológép-csomagot", () => {
  assert.doesNotMatch(globalHead, /calculator-suite\.(?:css|js)/);
});

check("a globális erőforrásbetöltő útvonal alapján deduplikál", () => {
  assert.match(globalHead, /targetPath/);
  assert.match(globalHead, /querySelectorAll\(`\$\{tagName\}\[\$\{resourceAttribute\}\]`\)/);
  assert.doesNotMatch(globalHead, /\?v=[^"'`\s]*\?v=/);
});

console.log(`SEO és rendszerlogika regressziós audit OK: ${checks.length}/${checks.length} ellenőrzés.`);
checks.forEach((label, indexValue) => console.log(`${indexValue + 1}. ${label}`));

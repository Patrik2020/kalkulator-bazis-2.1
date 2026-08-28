const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { suites } = require("./reference-test-manifest");
const { publicUrlForSource } = require("./url-paths");

const root = path.resolve(__dirname, "..");
const calculatorDir = path.join(root, "kalkulatorok");

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b, "hu"));
}

function diff(expected, actual) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  return {
    missing: sorted([...expectedSet].filter((value) => !actualSet.has(value))),
    extra: sorted([...actualSet].filter((value) => !expectedSet.has(value))),
  };
}

function assertSameSet(label, expected, actual) {
  const { missing, extra } = diff(expected, actual);
  assert.deepStrictEqual(
    { missing, extra },
    { missing: [], extra: [] },
    `${label} eltérés. Hiányzik: ${missing.join(", ") || "–"}; extra: ${extra.join(", ") || "–"}`
  );
}

const siteDataSource = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(siteDataSource, sandbox, { filename: "site-data.js" });

const siteData = sandbox.window.KB_DATA;
assert.ok(siteData && Array.isArray(siteData.calculators), "A site-data kalkulátorregistry nem tölthető be.");
assert.ok(Array.isArray(siteData.categories), "A site-data kategóriaregistry nem tölthető be.");

const registryEntries = [...siteData.calculators];
for (let batch = 1; batch <= 5; batch += 1) {
  registryEntries.push(...require(`../js/expansion-batch-0${batch}-data.js`));
}

assert.strictEqual(registryEntries.length, 100, `Pontosan 100 kalkulátor-bejegyzés szükséges, jelenleg ${registryEntries.length}.`);

const registryUrls = registryEntries.map((entry) => entry.url);
const uniqueRegistryUrls = new Set(registryUrls);
assert.strictEqual(uniqueRegistryUrls.size, 100, "Duplikált kalkulátor URL van a registryben.");

const knownCategories = new Set(siteData.categories.map((category) => category.id));
for (const entry of registryEntries) {
  assert.ok(entry && typeof entry === "object", "Érvénytelen kalkulátor-bejegyzés.");
  assert.ok(typeof entry.title === "string" && entry.title.trim(), `${entry.url || "ismeretlen"}: hiányzó cím.`);
  assert.match(entry.url || "", /^kalkulatorok\/[a-z0-9-]+\.html$/, `${entry.title}: hibás kalkulátor URL-formátum.`);
  if (entry.category) {
    assert.ok(knownCategories.has(entry.category), `${entry.url}: ismeretlen kategória: ${entry.category}`);
  }
}

const calculatorHtml = fs
  .readdirSync(calculatorDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => `kalkulatorok/${entry.name}`);
assert.strictEqual(calculatorHtml.length, 100, `Pontosan 100 kalkulátor HTML-fájl szükséges, jelenleg ${calculatorHtml.length}.`);
assertSameSet("Registry ↔ kalkulátor HTML", registryUrls, calculatorHtml);

const manifestPages = Object.values(suites).flat();
assert.strictEqual(new Set(manifestPages).size, 100, "A tesztmanifest nem pontosan 100 egyedi kalkulátort fed le.");
assertSameSet("Registry ↔ tesztmanifest", registryUrls, manifestPages);

const sitemapXml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
const sitemapCalculatorUrls = sitemapUrls.filter((value) => {
  try {
    return new URL(value).pathname.startsWith("/kalkulatorok/");
  } catch {
    return false;
  }
});
const expectedPublicUrls = registryUrls.map((sourceFile) => publicUrlForSource(sourceFile));
assert.strictEqual(new Set(sitemapCalculatorUrls).size, sitemapCalculatorUrls.length, "Duplikált kalkulátor URL van a sitemapban.");
assertSameSet("Registry ↔ sitemap kalkulátorok", expectedPublicUrls, sitemapCalculatorUrls);

for (const sourceFile of registryUrls) {
  const absolute = path.join(root, sourceFile);
  const html = fs.readFileSync(absolute, "utf8");
  const expectedCanonical = publicUrlForSource(sourceFile);
  const canonicalMatches = [...html.matchAll(/<link\b[^>]*\brel\s*=\s*(["'])canonical\1[^>]*>/gi)];
  assert.strictEqual(canonicalMatches.length, 1, `${sourceFile}: pontosan egy canonical link szükséges.`);
  const href = canonicalMatches[0][0].match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
  assert.strictEqual(href, expectedCanonical, `${sourceFile}: canonical eltérés (${href || "hiányzik"} != ${expectedCanonical}).`);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
assert.ok(packageJson.scripts["test:final:fullsite"], "Hiányzik a test:final:fullsite npm script.");
assert.match(packageJson.scripts.quality || "", /test:final:fullsite/, "A final full-site audit nincs a kötelező quality láncban.");

const qualityWorkflow = fs.readFileSync(path.join(root, ".github", "workflows", "quality.yml"), "utf8");
assert.match(qualityWorkflow, /npm run quality/, "A Site quality workflow nem futtatja a kötelező quality láncot.");
const materializeWorkflow = fs.readFileSync(path.join(root, ".github", "workflows", "materialize-static.yml"), "utf8");
assert.match(materializeWorkflow, /npm run quality/, "A Materialize workflow nem futtatja a kötelező quality láncot.");

console.log(
  `Final full-site audit OK: 100 registry = 100 HTML = 100 tesztelt oldal = 100 sitemap kalkulátor, egyező canonical URL-ekkel.`
);

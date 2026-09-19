const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { suites } = require("./reference-test-manifest");
const { publicUrlForSource, publicPathToSourceFile } = require("./url-paths");

const root = path.resolve(__dirname, "..");
const calculatorDir = path.join(root, "kalkulatorok");
const supplementalCalculatorPages = ["kalkulatorok/multifunkcios-szamologep.html"];

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

const expectedRegistryCount = 101;
assert.strictEqual(
  registryEntries.length,
  expectedRegistryCount,
  `101 forrás-registry bejegyzés szükséges a Phase 2 átmenetben, jelenleg ${registryEntries.length}.`
);

const registryUrls = registryEntries.map((entry) => entry.url);
const uniqueRegistryUrls = new Set(registryUrls);
assert.strictEqual(uniqueRegistryUrls.size, registryEntries.length, "Duplikált kalkulátor URL van a registryben.");

const retiredEntries = registryEntries.filter((entry) => entry.hidden === true);
const publicRegistryEntries = registryEntries.filter((entry) => entry.hidden !== true);
const retiredRegistryUrls = new Set(retiredEntries.map((entry) => entry.url));
const publicRegistryUrls = publicRegistryEntries.map((entry) => entry.url);
assert.strictEqual(retiredEntries.length, 13, `Pontosan 13 kivezetett Phase 2 kalkulátor szükséges Batch 2 után, jelenleg ${retiredEntries.length}.`);
assert.strictEqual(publicRegistryEntries.length, 88, `Pontosan 88 nyilvános registry-kalkulátor szükséges Batch 2 után, jelenleg ${publicRegistryEntries.length}.`);

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

assert.strictEqual(
  calculatorHtml.length,
  registryEntries.length + supplementalCalculatorPages.length,
  `${registryEntries.length} registry-oldal + ${supplementalCalculatorPages.length} standalone oldal szükséges, jelenleg ${calculatorHtml.length} HTML-fájl van.`
);
const inventoryDiff = diff(registryUrls, calculatorHtml);
assert.deepStrictEqual(inventoryDiff.missing, [], `Registryből hiányzó HTML: ${inventoryDiff.missing.join(", ")}`);
assertSameSet("Ismert standalone kalkulátoroldalak", supplementalCalculatorPages, inventoryDiff.extra);

const manifestPages = Object.values(suites).flat();
assert.strictEqual(
  new Set(manifestPages).size,
  registryEntries.length,
  `A tesztmanifestnek mind a ${registryEntries.length} forrás-registry kalkulátort le kell fednie.`
);
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
const expectedPublicUrls = [...publicRegistryUrls, ...supplementalCalculatorPages].map((sourceFile) => publicUrlForSource(sourceFile));
assert.strictEqual(new Set(sitemapCalculatorUrls).size, sitemapCalculatorUrls.length, "Duplikált kalkulátor URL van a sitemapban.");
assertSameSet("Nyilvános kalkulátoroldalak ↔ sitemap", expectedPublicUrls, sitemapCalculatorUrls);

for (const sourceFile of calculatorHtml) {
  const absolute = path.join(root, sourceFile);
  const html = fs.readFileSync(absolute, "utf8");
  const canonicalMatches = [...html.matchAll(/<link\b[^>]*\brel\s*=\s*(["'])canonical\1[^>]*>/gi)];
  assert.strictEqual(canonicalMatches.length, 1, `${sourceFile}: pontosan egy canonical link szükséges.`);
  const href = canonicalMatches[0][0].match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];

  if (retiredRegistryUrls.has(sourceFile)) {
    assert.match(html, /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex/i, `${sourceFile}: a kivezetett oldalnak noindexnek kell lennie.`);
    assert.ok(href && href !== publicUrlForSource(sourceFile), `${sourceFile}: a kivezetett oldal canonicalja nem mutathat saját magára.`);
    const targetSource = publicPathToSourceFile(new URL(href).pathname);
    assert.ok(fs.existsSync(path.join(root, targetSource)), `${sourceFile}: a canonical céloldal nem létezik (${targetSource}).`);
    assert.ok(!retiredRegistryUrls.has(targetSource), `${sourceFile}: a canonical céloldal maga is kivezetett (${targetSource}).`);
  } else {
    const expectedCanonical = publicUrlForSource(sourceFile);
    assert.strictEqual(href, expectedCanonical, `${sourceFile}: canonical eltérés (${href || "hiányzik"} != ${expectedCanonical}).`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
assert.match(
  packageJson.scripts?.["test:calculator-suite"] || "",
  /calculator-suite-audit\.js/,
  "A standalone multifunkciós számológép saját logikai auditja hiányzik."
);
assert.match(
  packageJson.scripts?.quality || "",
  /test:calculator-suite/,
  "A standalone multifunkciós számológép auditja nincs a kötelező quality láncban."
);

const qualityWorkflow = fs.readFileSync(path.join(root, ".github", "workflows", "quality.yml"), "utf8");
assert.match(qualityWorkflow, /node scripts\/final-fullsite-audit\.js/, "A final full-site gate nincs bekötve a Site quality workflow-ba.");
const materializeWorkflow = fs.readFileSync(path.join(root, ".github", "workflows", "materialize-static-first.yml"), "utf8");
assert.match(materializeWorkflow, /node scripts\/final-fullsite-audit\.js/, "A final full-site gate nincs bekötve a Materialize workflow-ba.");

console.log(`Final full-site audit OK: ${registryEntries.length} forrás-registry kalkulátor, ebből ${publicRegistryEntries.length} nyilvános + ${retiredEntries.length} kivezetett, valamint ${supplementalCalculatorPages.length} standalone oldal; registry/HTML/teszt/sitemap/canonical konzisztens.`);

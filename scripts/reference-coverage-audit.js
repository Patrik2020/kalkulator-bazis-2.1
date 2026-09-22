const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { suites } = require("./reference-test-manifest");

const root = path.resolve(__dirname, "..");
const siteDataSource = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(siteDataSource, sandbox, { filename: "site-data.js" });

const calculators = [...sandbox.window.KB_DATA.calculators];
for (let batch = 1; batch <= 5; batch += 1) {
  calculators.push(...require(`../js/expansion-batch-0${batch}-data.js`));
}

const registry = new Set(calculators.map((calculator) => calculator.url));
const publicCalculators = calculators.filter((calculator) => calculator.hidden !== true);
const retiredCalculators = calculators.filter((calculator) => calculator.hidden === true);

assert.strictEqual(
  registry.size,
  calculators.length,
  "A referenciaaudit duplikált kalkulátor-URL-t talált a registryben."
);
assert.strictEqual(registry.size, 102, "A referenciaaudit pontosan 102 registry-kalkulátort vár.");
assert.strictEqual(publicCalculators.length, 89, "A referenciaaudit pontosan 89 nyilvános kalkulátort vár.");
assert.strictEqual(retiredCalculators.length, 13, "A referenciaaudit pontosan 13 kivezetett kalkulátort vár Phase 2 Batch 2 után.");

const seen = new Map();
for (const [suite, pages] of Object.entries(suites)) {
  pages.forEach((page) => {
    assert.ok(registry.has(page), `${suite}: nem katalogizált URL a tesztmanifestben: ${page}`);
    assert.ok(!seen.has(page), `${page}: több referenciasuite-ban is szerepel (${seen.get(page)}, ${suite})`);
    seen.set(page, suite);
  });
}

const missing = [...registry].filter((page) => !seen.has(page)).sort();
const extra = [...seen].filter(([page]) => !registry.has(page)).map(([page]) => page).sort();
assert.deepStrictEqual(missing, [], `Teszt nélküli kalkulátorok: ${missing.join(", ")}`);
assert.deepStrictEqual(extra, [], `Ismeretlen tesztmanifest URL-ek: ${extra.join(", ")}`);

const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
assert.match(packageJson.scripts.quality, /test:reference:coverage/, "A lefedettségi audit nincs a kötelező quality scriptben.");
assert.ok(packageJson.scripts["test:reference:browser"], "Hiányzik a böngészős referencia npm script.");
const qualityWorkflow = fs.readFileSync(path.join(root, ".github", "workflows", "quality.yml"), "utf8");
assert.match(
  qualityWorkflow,
  /npm run test:reference:browser/,
  "A böngészős referenciaaudit nincs bekötve a GitHub Actions quality workflow-ba."
);

console.log(
  `Referencia-lefedettségi audit OK: ${seen.size}/${registry.size} registry-kalkulátor (${publicCalculators.length} nyilvános + ${retiredCalculators.length} kivezetett), ${Object.keys(suites).length} kötelező suite.`
);

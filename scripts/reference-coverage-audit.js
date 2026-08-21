const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { suites } = require("./reference-test-manifest");

const root = path.resolve(__dirname, "..");
const siteDataSource = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(siteDataSource, sandbox, { filename: "site-data.js" });

const registry = new Set(sandbox.window.KB_DATA.calculators.map((calculator) => calculator.url));
for (let batch = 1; batch <= 5; batch += 1) {
  require(`../js/expansion-batch-0${batch}-data.js`).forEach((calculator) => registry.add(calculator.url));
}

assert.strictEqual(registry.size, 100, "A referenciaaudit pontosan 100 katalogizált kalkulátort vár.");

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
  `Referencia-lefedettségi audit OK: ${seen.size}/100 katalogizált kalkulátor, ${Object.keys(suites).length} kötelező suite.`
);

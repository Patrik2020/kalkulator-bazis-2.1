"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { addAttributeToOpeningTag, mergeRenderedPage } = require("./materialize-static-first");
const { materializationPages, sitePageRoutes } = require("./site-page-inventory");
const { pipeline, runPipeline, verifyIdempotence } = require("./static-build-pipeline");

const root = path.resolve(__dirname, "..");
const flatSteps = pipeline.flatMap((phase) => phase.steps);

test("the canonical build has one render and no repeated repair step", () => {
  assert.equal(new Set(flatSteps).size, flatSteps.length);
  assert.equal(flatSteps.filter((step) => step === "materialize-static-first.js").length, 1);
  assert.equal(flatSteps.at(-2), "cache-bust-assets.js");
  assert.equal(flatSteps.at(-1), "generate-sitemap.js");
  assert.ok(flatSteps.indexOf("materialize-static-first.js") < flatSteps.indexOf("normalize-static-html.js"));
});

test("already-integrated AdSense audit policy is maintained in its canonical source, not re-patched by the build", () => {
  const adsenseAudit = fs.readFileSync(path.join(root, "scripts/adsense-quality-v2-audit.js"), "utf8");
  const adsenseWorkflow = fs.readFileSync(path.join(root, ".github/workflows/adsense-quality-v2.yml"), "utf8");
  assert.doesNotMatch(adsenseWorkflow, /node scripts\/apply-adsense-audit-policy-v2\.js/);
  assert.match(adsenseWorkflow, /node scripts\/adsense-quality-v2-audit\.js --report --gate/);
  assert.ok(!flatSteps.includes("apply-adsense-audit-policy-v2.js"),
    "The build must not rewrite its own AdSense quality audit source");
  assert.match(adsenseAudit, /KB_ADSENSE_AUDIT_POLICY_V2/);
  assert.match(adsenseAudit, /const editorialHtml = mainHtml/);
  assert.match(adsenseAudit, /KB_ADSENSE:ymyl-trust:START/);
  assert.match(adsenseAudit, /KB_STATIC:reliability:START/);
  assert.match(adsenseAudit, /const benignSharedPatterns = \[/);
  assert.match(adsenseAudit, /az eredmények tájékoztató becslések/);
});

test("average hub guard is authored in runtime, never re-patched by a build step", () => {
  const runtime = fs.readFileSync(path.join(root, "js/everyday-upgrades.js"), "utf8");
  const page = fs.readFileSync(path.join(root, "kalkulatorok/atlag-kalkulator.html"), "utf8");

  const materializeWorkflow = fs.readFileSync(path.join(root, ".github/workflows/materialize-static-first.yml"), "utf8");
  assert.ok(materializeWorkflow.includes('      - "js/everyday-upgrades.js"'),
    "Average hub runtime changes must trigger the full static materialization contract");
  assert.ok(!flatSteps.includes("apply-average-hub-runtime-guard.js"),
    "Obsolete source rewriter must stay out of the canonical build");
  assert.match(runtime, /KB_PHASE2_BATCH2_AVERAGE_HUB_GUARD/);
  assert.match(runtime, /if \(slug === "atlag-kalkulator" && document\.querySelector\('\[data-average-hub="true"\]'\)\) return;/);
  assert.match(page, /<main\b[^>]*data-average-hub="true"/);
  assert.ok(!fs.existsSync(path.join(root, "scripts/apply-average-hub-runtime-guard.js")),
    "Superseded patch script must not be restored");
});

test("insulation package guidance is authored and checked without a build-time patch", () => {
  const construction = fs.readFileSync(path.join(root, "js/construction-upgrades.js"), "utf8");
  const packageScripts = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).scripts;
  const audit = fs.readFileSync(path.join(root, "scripts/insulation-package-guidance-audit.js"), "utf8");

  assert.ok(!flatSteps.includes("apply-insulation-package-guidance.js"));
  assert.ok(!fs.existsSync(path.join(root, "scripts/apply-insulation-package-guidance.js")));
  assert.equal((construction.match(/KB_CONSTRUCTION:insulation-package-guidance:START/g) || []).length, 1);
  assert.match(construction, /Konkrét termék csomagfedése \(m²\/csomag\)/);
  assert.match(construction, /lapvastagságból önmagában nem talál ki csomagméretet/);
  assert.equal(packageScripts["quality:insulation-package"], "node scripts/insulation-package-guidance-audit.js");
  assert.equal(packageScripts["test:construction:insulation-package"], "node scripts/insulation-package-guidance-audit.js");
  assert.equal(packageScripts["insulation:package:apply"], undefined);
  assert.doesNotMatch(audit, /apply-insulation-package-guidance/);
  for (const scriptName of fs.readdirSync(path.join(root, "scripts")).filter((name) => name.endsWith(".js"))) {
    if (scriptName === "static-build-pipeline.test.js") continue;
    const script = fs.readFileSync(path.join(root, "scripts", scriptName), "utf8");
    assert.doesNotMatch(script, /require\(["']\.\/apply-insulation-package-guidance\.js["']\)/,
      scriptName + " must not import the deleted source patch");
  }
});

test("construction confirmation UX is guarded by canonical source and read-only tests", () => {
  const code = fs.readFileSync(path.join(root, "js/construction-upgrades.js"), "utf8");
  const audit = fs.readFileSync(path.join(root, "scripts/construction-confirmation-ux-audit.js"), "utf8");
  const scripts = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).scripts;
  assert.ok(!flatSteps.includes("apply-construction-confirmation-ux.js"));
  assert.ok(!fs.existsSync(path.join(root, "scripts/apply-construction-confirmation-ux.js")));
  assert.equal((code.match(/const confirmationNames = \["manufacturerConfirmed", "systemConfirmed"\]/g) || []).length, 1);
  assert.match(code, /if \(pendingConfirmation\)/);
  assert.match(code, /Addig nem készítünk rendelési mennyiséget/);
  assert.equal(scripts["quality:construction-confirmation-ux"],
    "node scripts/construction-confirmation-ux-audit.js");
  assert.equal(scripts["test:construction:confirmation-ux"],
    "node scripts/construction-confirmation-ux-audit.js");
  assert.equal(scripts["construction:confirmation-ux:apply"], undefined);
  assert.doesNotMatch(audit, /require\(["']\.\/apply-construction-confirmation-ux\.js["']\)/);
  for (const name of fs.readdirSync(path.join(root, "scripts")).filter((item) => item.endsWith(".js"))) {
    if (name === "static-build-pipeline.test.js") continue;
    const source = fs.readFileSync(path.join(root, "scripts", name), "utf8");
    assert.doesNotMatch(source, /require\(["']\.\/apply-construction-confirmation-ux\.js["']\)/,
      name + " must not depend on the removed source patch");
  }
});

test("drywall system guidance is authored and tested without a legacy source patch", () => {
  const runtime = fs.readFileSync(path.join(root, "js/construction-upgrades.js"), "utf8");
  const audit = fs.readFileSync(path.join(root, "scripts/drywall-system-guidance-audit.js"), "utf8");
  const materializeWorkflow = fs.readFileSync(path.join(root, ".github/workflows/materialize-static-first.yml"), "utf8");
  const scripts = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).scripts;

  assert.ok(!flatSteps.includes("apply-drywall-system-guidance.js"));
  assert.ok(!fs.existsSync(path.join(root, "scripts/apply-drywall-system-guidance.js")));
  assert.equal((runtime.match(/KB_CONSTRUCTION:drywall-system-guidance:START/g) || []).length, 1);
  assert.equal((runtime.match(/KB_CONSTRUCTION:drywall-system-guidance:END/g) || []).length, 1);
  assert.match(runtime, /Gipszkarton rendszer adatai ellenőrizve/);
  assert.match(runtime, /values\.systemConfirmed !== "yes"/);
  assert.match(materializeWorkflow, /- "js\/construction-upgrades\.js"/);
  assert.equal(scripts["quality:drywall-guidance"], "node scripts/drywall-system-guidance-audit.js");
  assert.equal(scripts["test:construction:drywall"], "node scripts/drywall-system-guidance-audit.js");
  assert.equal(scripts["drywall:guidance:apply"], undefined);
  assert.doesNotMatch(audit, /require\(["']\.\/apply-drywall-system-guidance\.js["']\)/);
  for (const name of fs.readdirSync(path.join(root, "scripts")).filter((value) => value.endsWith(".js"))) {
    if (name === "static-build-pipeline.test.js") continue;
    const source = fs.readFileSync(path.join(root, "scripts", name), "utf8");
    assert.doesNotMatch(source, /require\(["']\.\/apply-drywall-system-guidance\.js["']\)/,
      name + " must not import the retired patcher");
  }
});

test("every canonical build step is an existing, phase-appropriate script", () => {
  const phaseById = Object.fromEntries(pipeline.map((phase) => [phase.id, phase.steps]));
  assert.deepEqual(Object.keys(phaseById), ["source", "render", "finalize"]);
  assert.deepEqual(phaseById.render, ["materialize-static-first.js"]);
  for (const [index, phase] of pipeline.entries()) {
    assert.ok(phase.steps.length > 0, `empty build phase ${phase.id}`);
    for (const step of phase.steps) {
      assert.match(step, /^[a-z0-9-]+[.]js$/);
      const file = path.join(root, "scripts", step);
      assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), `missing build step: ${step}`);
      if (index === 0) assert.match(step, /^apply-/, `unexpected source-phase step: ${step}`);
      if (index === 2) assert.doesNotMatch(step, /^apply-/, `source transform placed after render: ${step}`);
    }
  }
});

test("the sitemap and browser renderer share one page inventory", () => {
  const routes = sitePageRoutes(root);
  const pages = materializationPages(root);
  assert.equal(new Set(routes).size, routes.length);
  assert.equal(new Set(pages).size, pages.length);
  assert.equal(pages.length, routes.length + 1);
  assert.ok(pages.includes("index.html"));
  assert.ok(pages.includes("404.html"));
  assert.ok(!routes.includes("404.html"));
});

test("runPipeline executes every declared step once and in order", () => {
  const calls = [];
  runPipeline({ root, runStep: (step) => calls.push(step) });
  assert.deepEqual(calls, flatSteps);
});

test("idempotence verification compares state around one validation build", () => {
  let runs = 0;
  const states = ["stable", "stable"];
  verifyIdempotence({
    root,
    capture: () => states.shift(),
    run: () => { runs += 1; },
  });
  assert.equal(runs, 1);

  assert.throws(
    () => verifyIdempotence({
      root,
      capture: (() => {
        const drift = ["before", "after"];
        return () => drift.shift();
      })(),
      run: () => {},
    }),
    /nem idempotens/
  );
});

test("materialization preserves canonical schema and the authored average hub", () => {
  const source = `<!doctype html><html><head>
<script id="kb-structured-data" type="application/ld+json">{"source":true}</script>
</head><body><main data-average-hub="true">
<section class="card-calculator"><p>authored card</p></section>
<!-- KB_STATIC:quality-lifestyle:START --><section data-static-quality-version="2026-09">authored quality</section><!-- KB_STATIC:quality-lifestyle:END -->
</main></body></html>`;
  const rendered = `<!doctype html><html><head>
<script id="kb-structured-data" type="application/ld+json">{"rendered":true}</script>
</head><body><main data-average-hub="true">
<section class="card-calculator"><p>runtime result</p></section>
<div data-render="related-calculators"><section class="related-section">runtime related</section></div>
<section data-lifestyle-quality="2026-08">runtime quality</section>
</main></body></html>`;
  const merged = mergeRenderedPage("kalkulatorok/atlag-kalkulator.html", source, rendered);
  assert.match(merged, /"source":true/);
  assert.doesNotMatch(merged, /"rendered":true/);
  assert.match(merged, /authored card/);
  assert.doesNotMatch(merged, /runtime result|runtime related|runtime quality/);
  assert.match(merged, /authored quality/);
});

test("materialization never duplicates an existing fallback attribute", () => {
  const fragment = '<section data-static-runtime-fallback="everyday-method">content</section>';
  assert.equal(
    addAttributeToOpeningTag(fragment, "data-static-runtime-fallback", "everyday-method"),
    fragment
  );
});

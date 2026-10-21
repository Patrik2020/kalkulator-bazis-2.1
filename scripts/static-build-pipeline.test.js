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

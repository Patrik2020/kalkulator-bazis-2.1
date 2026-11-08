"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { localAsset, cssReview, activeHomeSelectorHints, featureOverlap } = require("./js-css-maintainability-audit");

test("CSS assets resolve against repository paths and strip cache hashes", () => {
  assert.equal(localAsset("/images/redesign/atlas.avif?v=12", "css/pages/home.css"), "images/redesign/atlas.avif");
  assert.equal(localAsset("../theme.css?v=x", "css/pages/home.css"), "css/theme.css");
  assert.equal(localAsset("data:image/png;base64,a", "css/pages/home.css"), null);
  assert.equal(localAsset("https://example.com/font.woff2", "css/pages/home.css"), null);
});

test("Missing CSS references are review leads, not deletion decisions", () => {
  const css = ".foo{background:url('/images/redesign/missing.avif')!important}.foo{color:#fff}";
  const result = cssReview("css/home.css", css, new Set(["css/home.css"]));
  assert.equal(result.important, 1);
  assert.equal(result.repeatedSelectorCandidates, 1);
  assert.deepEqual(result.missingLocalAssetRefs, [
    { source: "css/home.css", line: 1, target: "images/redesign/missing.avif" },
  ]);
});

test("Old home selectors unmatched in static HTML are only hints", () => {
  const result = activeHomeSelectorHints('<div class="home-redesign-v17 hero"></div>', ".hero{color:red}.home-hero{color:blue}");
  assert.equal(result.cssClassTokens, 2);
  assert.equal(result.notInStaticHtml, 1);
  assert.ok(result.sampleUnmatched.includes("home-hero"));
  assert.match(result.warning, /not proven unused/);
  const noUrlClass = activeHomeSelectorHints('<div class="hero"></div>', ".hero{background:url(\'/images/photo.avif\')}");
  assert.equal(noUrlClass.cssClassTokens, 1);
  assert.equal(noUrlClass.notInStaticHtml, 0);
});

test("Detect overlapping declared feature families conservatively", () => {
  const config = [
    'slugFeature("priority", ["credit-kalkulator", "foo"], ["a.css"], ["a.js"])',
    'slugFeature("quality", ["credit-kalkulator"], ["b.css"], ["b.js"])',
  ].join(",");
  const result = featureOverlap(config);
  assert.equal(result.featureFamilies, 2);
  assert.equal(result.distinctConfiguredSlugs, 2);
  assert.equal(result.slugsWithMultipleFeatureFamilies, 1);
  assert.equal(result.examples[0].slug, "credit-kalkulator");
});

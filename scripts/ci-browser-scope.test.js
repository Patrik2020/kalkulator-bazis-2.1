"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { isEditorialOnly, requiresBrowser } = require("./ci-browser-scope");

test("documentation, images, sitemaps and editorial articles do not need Chrome", () => {
  const files = ["docs/ci.md", "images/chart.webp", "favicon/logo.svg", "README.md",
    "aktualis/friss-hir.html", "sitemap.xml", "sitemap-aktualis.xml", "robots.txt", "ads.txt"];
  assert.ok(files.every(isEditorialOnly));
  assert.equal(requiresBrowser(files), false);
});

test("shared runtime, calculators, HTML, scripts, security and workflows need Chrome", () => {
  const files = ["js/cookie.js", "js/publisher-ads.js", "css/style.css",
    "kalkulatorok/netto-brutto-kalkulator.html", "index.html", "penzugyi.html",
    "scripts/browser-qa.js", "scripts/ci-browser-scope.js",
    ".github/workflows/browser-quality.yml", ".github/workflows/quality.yml",
    "components/site-header.html", "package-lock.json", "sw.js",
    "landing-pages/wise/index.html"];
  assert.ok(files.every((file) => !isEditorialOnly(file)));
  assert.ok(files.every((file) => requiresBrowser([file])));
});

test("runtime changes amid editorial changes and unknown paths cannot slip through", () => {
  assert.equal(requiresBrowser(["docs/notes.md", "js/site-ui.js"]), true);
  assert.equal(requiresBrowser(["aktualis/article.html", "js/home-current.js"]), true);
  assert.equal(requiresBrowser(["unrecognized-new-file.xyz"]), true);
  assert.equal(requiresBrowser([]), true);
});

test("nested interactive article assets and root category pages remain protected", () => {
  assert.equal(isEditorialOnly("aktualis/article.js"), false);
  assert.equal(isEditorialOnly("aktualis/nested/template.html"), false);
  assert.equal(isEditorialOnly("auto.html"), false);
});

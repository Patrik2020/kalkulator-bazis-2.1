"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { inventory } = require("./localization-inventory");
const { detailPages } = require("./localization-manifest");
const { checkLocalizationCoverage, requiresTranslation } = require("./localization-coverage-browser-checks");
const glossary = require("../data/localization-glossary.json");

test("reviewed pages exist, load their locale module, and use valid dictionary keys", () => {
  const pages = inventory();
  assert.equal(new Set(detailPages.map(p => p.path)).size, detailPages.length);
  for (const page of detailPages) {
    assert.ok(pages.some(p => p.path === page.path && !p.retired), page.path);
    const html = fs.readFileSync(path.join(__dirname, "..", page.path), "utf8");
    assert.ok(html.includes(`src="../${page.module}?v=`), `${page.path}: missing locale script`);
    const api = require("../" + page.module);
    assert.ok(Object.hasOwn(api.dictionaries, page.key), `${page.path}: invalid dictionary key`);
  }
});

test("common calculator terminology agrees with the shared glossary", () => {
  for (const page of detailPages) {
    const api = require("../" + page.module);
    for (const [source, pair] of Object.entries(glossary)) {
      for (const [index, language] of ["en", "de"].entries()) {
        const actual = api.translate(page.key, source, language);
        if (actual !== null) assert.equal(actual, pair[index], `${page.path}: ${source}/${language}`);
      }
    }
  }
});

test("coverage gate rejects untranslated ASCII copy, not only Hungarian accents", async () => {
  assert.equal(requiresTranslation("100 HUF = 0,27 EUR"), false);
  assert.equal(requiresTranslation("100 HUF = 0.27 EUR"), false);
  assert.equal(requiresTranslation("Árfolyamok betöltése..."), true);
  await assert.rejects(checkLocalizationCoverage({
    navigate: async () => {}, setViewport: async () => {},
    evaluate: async expression => expression.startsWith("(function collectMainCopy") ?
      ["Kalkulátor Bázis", ...Array.from({ length: 11 }, (_, i) => `Magyar szoveg ${i}`)] : undefined
  }), /Untranslated main-content text/);
});

test("coverage gate rejects empty content instead of passing an empty page", async () => {
  await assert.rejects(checkLocalizationCoverage({
    navigate: async () => {}, setViewport: async () => {}, evaluate: async () => []
  }), /empty source copy/);
});

"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const api = require("../js/epitoipari/paving-locale");
const { requiresTranslation } = require("./localization-coverage-browser-checks");
const page = "terkovezes-kalkulator";
const html = fs.readFileSync(require.resolve("../kalkulatorok/terkovezes-kalkulator.html"), "utf8");
const main = html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode = text => text.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'");
const modelSource = fs.readFileSync(require.resolve("../js/construction-upgrades.js"), "utf8");
const modelMarker = "  const config = configs[slug]; if (!config) return;";
assert.ok(modelSource.includes(modelMarker));
const sandbox = { window: { location: { pathname: "/kalkulatorok/terkovezes-kalkulator" } }, document: { querySelector: () => ({}) }, Intl };
vm.runInNewContext(modelSource.replace(modelMarker, "  window.paving = configs[slug]; return;"), sandbox);
const model = sandbox.window.paving;
const defaults = Object.fromEntries(model.fields.map(field => [field.id, field.value]));

test("all paving copy, accessible attributes and structured-data text have EN/DE translations", () => {
  const values = [...main.matchAll(/>([^<>]+)</gu)].map(match => decode(match[1]).replace(/\s+/gu, " ").trim());
  values.push(...[...main.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/gu)].map(match => decode(match[1])));
  const collect = value => {
    if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) {
      if (["name", "description", "text", "about", "inLanguage"].includes(key)) values.push(item);
      else if (item && typeof item === "object") collect(item);
    }
  };
  collect(JSON.parse(html.match(/id="kb-structured-data"[^>]*>(.*?)<\/script>/u)[1]));
  for (const source of new Set(values)) {
    if (!requiresTranslation(source)) continue;
    for (const language of ["en", "de"]) assert.notEqual(api.translate(page, source, language), null, `${language}: ${source}`);
  }
});

test("the current planner and the corrected guide example agree on quantities and rounding", () => {
  const rows = model.compute({ ...defaults, length: 6, width: 4, waste: 5 });
  assert.deepEqual(Array.from(rows, row => Array.from(row)), [["Nettó burkolandó felület","24 m²"],["Térkőigény ráhagyással","25,2 m²"],["Raklap/csomag","3 db"],["Ágyazóanyag térfogata","1,1 m³"],["Szegélyhossz","20 m"],["Szegélykő","20 db"]]);
  assert.ok(main.includes("10 m²-es csomagfedéssel ez 3 csomag"));
  assert.ok(!main.includes("36 db/m²"));
  assert.equal(api.translate(page, rows[1][1], "en"), "25.2 m²");
  assert.equal(api.translate(page, "1,24 m³", "en"), "1.24 m³");
  assert.equal(api.translate(page, "38 db", "de"), "38 Stk.");
  assert.equal(api.translate(page, "7,5 m-en 18 cm esés", "en"), "18 cm drop over 7.5 m");
});

test("all planner validation branches have translated errors", () => {
  for (const field of model.fields) {
    const value = ["length","width","packCoverage","beddingThickness","edgePiece"].includes(field.id) ? 0 : -1;
    assert.throws(() => model.compute({ ...defaults, [field.id]: value }), error => {
      for (const language of ["en", "de"]) assert.ok(api.translate(page, error.message, language), `${language}: ${error.message}`);
      return true;
    });
  }
  for (const extra of [{ excludeArea: 100 }, { openEdge: 100 }]) assert.throws(() => model.compute({ ...defaults, ...extra }), error => {
    for (const language of ["en", "de"]) assert.ok(api.translate(page, error.message, language));
    return true;
  });
});

test("metadata, reports, retention feedback, scoping and Hungarian restoration are complete", () => {
  assert.equal(api.translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(api.translate(page, "hu-HU", "en"), "en-GB");
  assert.equal(api.translate(page, "Paving Calculator", "hu"), "Térkövezés kalkulátor");
  assert.equal(api.translate("another-page", "Térkövezés kalkulátor", "en"), null);
  assert.equal(api.translate(page, "Hirdetés", "en"), "Advertisement");
  assert.ok(api.translate(page, "Kövesd az útmutatót a könyvjelző mentéséhez.", "de"));
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s";
  for (const language of ["en", "de"]) {
    const url = new URL(api.reportHref(source, language));
    assert.equal(url.pathname, "kalkulatorbazis@gmail.com");
    assert.ok(url.searchParams.get("subject").includes(language === "en" ? "Paving Calculator" : "Pflaster-Rechner"));
    assert.ok(url.searchParams.get("body").includes("/terkovezes-kalkulator"));
  }
  assert.equal(api.reportHref(source, "hu"), source);
  for (const pair of Object.values(api.dictionary)) assert.ok(pair.length === 2 && pair.every(value => value.trim()));
});

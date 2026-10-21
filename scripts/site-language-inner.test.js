"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/site-language-inner");

test("HU/EN/DE text conversion uses exact reviewed strings, not guesswork", () => {
  assert.deepEqual(api.supported, ["hu", "en", "de"]);
  assert.equal(api.translate("Főoldal", "en"), "Home");
  assert.equal(api.translate("Főoldal", "de"), "Startseite");
  assert.equal(api.translate("Nettó–bruttó kalkulátor 2026", "en"), "Net–gross salary calculator 2026");
  assert.equal(api.translate("Nettó fizetés:", "de"), "Nettogehalt:");
  assert.equal(api.translate("Számítás", "hu"), null);
  assert.equal(api.translate("Unknown text", "en"), null);
  assert.equal(api.translate("Magyar pénzügyi és adójogi magyarázat", "de"), null);
});

test("every translated pair is nonempty and does not create fake translations", () => {
  for (const [source, pair] of Object.entries(api.dictionary)) {
    assert.ok(source.trim().length > 0);
    assert.equal(pair.length, 2);
    assert.ok(pair.every((value) => typeof value === "string" && value.trim().length > 0), source);
    assert.equal(api.translate(source, "en"), pair[0]);
    assert.equal(api.translate(source, "de"), pair[1]);
  }
});

test("incomplete translation has an explicit notice in both languages", () => {
  assert.match(api.fallback.en, /still in Hungarian/);
  assert.match(api.fallback.en, /Hungarian rules/);
  assert.match(api.fallback.de, /bleiben auf Ungarisch/);
  assert.match(api.fallback.de, /ungarischen Regeln/);
});

test("module is safe in Node without a browser document", () => {
  assert.equal(typeof api.translate, "function");
  assert.equal(Object.keys(api.dictionary).length >= 50, true);
});


test("all six category landing pages and group descriptions are translated explicitly", () => {
  const fs = require("node:fs");
  const vm = require("node:vm");
  const path = require("node:path");
  const siteData = fs.readFileSync(path.join(__dirname, "../js/site-data.js"), "utf8");
  const context = { window: {} };
  vm.runInNewContext(siteData, context, { filename: "site-data.js", timeout: 4000 });
  const categories = context.window.KB_DATA?.categories || [];
  assert.equal(categories.length, 6);
  for (const category of categories) {
    const fields = [category.title, category.description, category.seo];
    for (const group of category.groups) fields.push(group.title, group.description);
    for (const text of fields) {
      const en = api.translate(text, "en");
      const de = api.translate(text, "de");
      assert.ok(en && de, category.id + ": untranslated field " + text);
      assert.notEqual(en, text);
      assert.notEqual(de, text);
    }
    assert.ok(api.translate(category.title + " egy helyen", "en"));
    assert.ok(api.translate(category.title + " egy helyen", "de"));
  }
});

test("category translation remains exact and never overrides dynamic numeric results", () => {
  assert.equal(api.translate("123 456 Ft", "en"), null);
  assert.equal(api.translate("A felhasználó bevitele egyedi", "de"), null);
  assert.equal(api.translate("Pénzügyi kalkulátorok", "en"), "Financial calculators");
  assert.equal(api.translate("Szerkezet és szigetelés", "de"), "Konstruktion und Dämmung");
});

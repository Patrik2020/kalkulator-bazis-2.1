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

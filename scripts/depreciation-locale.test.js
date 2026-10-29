"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/autos/depreciation-locale");

test("depreciation calculator copy is available in English and German", () => {
  const page = "auto-ertekvesztes-kalkulator";
  assert.equal(api.translate(page, "Jelenlegi érték (Ft)", "en"), "Current value (HUF)");
  assert.equal(api.translate(page, "Jelenlegi érték (Ft)", "de"), "Aktueller Wert (HUF)");
  assert.equal(api.translate(page, "Gyakori kérdések", "en"), "Frequently asked questions");
  assert.equal(api.translate(page, "Autó értékvesztés kalkulátor", "de"), "Autowertverlust-Rechner");
  assert.equal(api.translate(page, "Jelenlegi érték (Ft)", "hu"), null);
  assert.equal(api.translate(page, "Unmapped text", "en"), null);
});

test("scenario result labels translate while preserving numeric values", () => {
  const page = "auto-ertekvesztes-kalkulator";
  assert.equal(api.translate(page, "Óvatos nominális érték", "en"), "Conservative nominal value");
  assert.equal(api.translate(page, "Közép mai vásárlóértéken", "de"), "Mittlerer Wert in heutiger Kaufkraft");
  assert.equal(api.translate(page, "5 760 000 Ft", "en"), "5 760 000 HUF");
  assert.equal(api.translate(page, "5 760 000 Ft", "de"), "5 760 000 HUF");
  assert.equal(api.translate(page, "5 760 000 Ft", "hu"), null);
});

test("guide, error, and metadata strings are translated", () => {
  const page = "auto-ertekvesztes-kalkulator";
  assert.match(api.translate(page, "A valós használtpiac ennél sokkal összetettebb: márka, típus, hajtáslánc, futásteljesítmény, állapot, sérülések, szervizmúlt, felszereltség, piaci kereslet és a gazdasági környezet is módosíthatja az árat.", "en"), /^The used-car market is more complex/u);
  assert.equal(api.translate(page, "Az értékvesztési ráták 0 és 100% között legyenek.", "de"), "Die Wertverlustraten müssen zwischen 0 % und 100 % liegen.");
  assert.equal(api.translate(page, "Autó értékvesztés kalkulátor | Maradványérték becslése", "en"), "Car Depreciation Calculator | Estimate Residual Value");
});

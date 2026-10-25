"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/everyday-locale");

test("date, age and date difference calculators translate labels and calendar values", () => {
  const datePage = "datum-hozzaadas-kivonas-kalkulator";
  const agePage = "eletkor-kalkulator";
  const diffPage = "datum-kulonbseg-kalkulator";
  assert.equal(api.translate(datePage, "2026. szeptember 20.", "en"), "20 September 2026");
  assert.equal(api.translate(datePage, "2026. szeptember 20.", "de"), "20. September 2026");
  assert.equal(api.translate(datePage, "vasárnap", "en"), "Sunday");
  assert.equal(api.translate(datePage, "vasárnap", "de"), "Sonntag");
  assert.equal(api.translate(agePage, "20 év 0 hónap 0 nap", "en"), "20 years 0 months 0 days");
  assert.equal(api.translate(agePage, "20 év 0 hónap 0 nap", "de"), "20 Jahre 0 Monate 0 Tage");
  assert.equal(api.translate(agePage, "1 év 1 hónap 1 nap", "en"), "1 year 1 month 1 day");
  assert.equal(api.translate(agePage, "1 év 1 hónap 1 nap", "de"), "1 Jahr 1 Monat 1 Tag");
  assert.equal(api.translate(agePage, "2026. 10. 06.", "en"), "06/10/2026");
  assert.equal(api.translate(diffPage, "7 nap a választott számítás szerint.", "en"), "7 days using the selected counting method.");
  assert.equal(api.translate(diffPage, "1 nap a választott számítás szerint.", "de"), "1 Tag nach der gewählten Zählweise.");
  assert.equal(api.translate(diffPage, "A záródátum korábbi a kezdőnapnál (7 nap eltérés).", "de"),
    "Das Enddatum liegt vor dem Startdatum (Abstand: 7 Tage).");
  assert.equal(api.translate(diffPage, "Különbség", "en"), "Difference");
});

"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/everyday-locale");

test("hourly wage, shared costs and recipe labels translate without changing amounts or user data", () => {
  assert.equal(api.translate("oraber-kalkulator", "Bruttó alapórabér", "en"), "Gross regular hourly wage");
  assert.equal(api.translate("oraber-kalkulator", "2 976 Ft/óra", "de"), "2 976 Ft/Stunde");
  assert.equal(api.translate("oraber-kalkulator", "2026. augusztus 8.", "en"), "8 August 2026");
  assert.equal(api.translate("oraber-kalkulator", "Fizetett órára vetítve", "de"), "Je bezahlter Stunde");
  assert.equal(api.translate("rezsi-megosztas-kalkulator", "C része", "en"), "Person C share");
  assert.equal(api.translate("rezsi-megosztas-kalkulator", "A személy lakónapjai", "de"), "Aufenthaltstage Person A");
  assert.equal(api.translate("rezsi-megosztas-kalkulator", "Ellenőrző összeg", "en"), "Check total");
  assert.equal(api.translate("recept-adag-kalkulator", "Átszámítási szorzó:", "de"), "Umrechnungsfaktor:");
  assert.equal(api.translate("recept-adag-kalkulator", "Liszt", "en"), null);
  assert.equal(api.translate("recept-adag-kalkulator", "Pálinka mennyisége: az érték legyen nagyobb nullánál.", "en"), "Pálinka: the amount must be greater than zero.");
  assert.equal(api.translate("recept-adag-kalkulator", "A(z) 3. sor formátuma hibás.", "en"), "Line 3 has an invalid format.");
});

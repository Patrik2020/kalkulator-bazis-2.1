"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/everyday-locale");

test("working-hours, working-days and overtime copy and dynamic units are translated", () => {
  assert.equal(api.translate("munkaido-kalkulator", "8 óra 30 perc", "en"), "8 hours 30 minutes");
  assert.equal(api.translate("munkaido-kalkulator", "8 óra 30 perc", "de"), "8 Stunden 30 Minuten");
  assert.equal(api.translate("munkaido-kalkulator", "1 óra 1 perc", "en"), "1 hour 1 minute");
  assert.equal(api.translate("munkaido-kalkulator", "37,5 óra", "en"), "37,5 hours");
  assert.equal(api.translate("munkaido-kalkulator", "2026. augusztus 8.", "de"), "8. August 2026");
  assert.equal(api.translate("munkaido-kalkulator", "igen", "en"), "yes");
  assert.equal(api.translate("munkanap-kalkulator", "Számított munkanapok:", "de"), "Berechnete Arbeitstage:");
  assert.equal(api.translate("munkanap-kalkulator", "A záró dátum nem lehet korábbi a kezdő dátumnál.", "en"), "The end date cannot be earlier than the start date.");
  assert.equal(api.translate("tulora-kalkulator", "Túlóra óradíja:", "en"), "Overtime hourly rate:");
  assert.equal(api.translate("tulora-kalkulator", "4 500 Ft/óra", "en"), "4 500 Ft/hour");
  assert.equal(api.translate("tulora-kalkulator", "4 500 Ft/óra", "de"), "4 500 Ft/Stunde");
  assert.equal(api.translate("tulora-kalkulator", "4500 Ft/óra", "en"), "4500 Ft/hour");
  assert.equal(api.translate("tulora-kalkulator", "4500 Ft/óra", "de"), "4500 Ft/Stunde");
  assert.equal(api.translate("tulora-kalkulator", "Elszámolási szorzó: az érték legyen nagyobb nullánál.", "de"), "Der Abrechnungsfaktor muss größer als null sein.");
});

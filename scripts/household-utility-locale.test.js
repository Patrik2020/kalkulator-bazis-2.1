"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/everyday-locale");

test("electricity and water cost calculators translate copy while preserving units and amounts", () => {
  assert.equal(api.translate("villanyfogyasztas-koltseg-kalkulator", "Készülék teljesítménye (W)", "en"), "Appliance power (W)");
  assert.equal(api.translate("villanyfogyasztas-koltseg-kalkulator", "Időszak becsült költsége:", "de"), "Geschätzte Kosten im Zeitraum:");
  assert.equal(api.translate("villanyfogyasztas-koltseg-kalkulator", "2026. augusztus 21.", "en"), "21 August 2026");
  assert.equal(api.translate("villanyfogyasztas-koltseg-kalkulator", "Névleges teljesítmény és valós fogyasztás", "de"), "Nennleistung und tatsächlicher Verbrauch");
  assert.equal(api.translate("vizfogyasztas-koltseg-kalkulator", "Saját díj (Ft/m³)", "en"), "Your price (HUF/m³)");
  assert.equal(api.translate("vizfogyasztas-koltseg-kalkulator", "Becsült összes költség:", "de"), "Geschätzte Gesamtkosten:");
  assert.equal(api.translate("vizfogyasztas-koltseg-kalkulator", "1000 liter tényleg 1 m³?", "en"), "Are 1,000 litres really 1 m³?");
  assert.equal(api.translate("villanyfogyasztas-koltseg-kalkulator", "90 kWh", "de"), "90 kWh");
  assert.equal(api.translate("vizfogyasztas-koltseg-kalkulator", "9000 liter", "en"), "9000 litres");
  assert.equal(api.translate("vizfogyasztas-koltseg-kalkulator", "9000 liter", "de"), "9000 Liter");
  assert.equal(api.translate("vizfogyasztas-koltseg-kalkulator", "9 m³", "en"), "9 m³");
});

"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/everyday-locale");

test("savings goal calculator translates form, result and planning copy", () => {
  const page = "megtakaritasi-cel-kalkulator";
  assert.equal(api.translate(page, "Megtakarítási cél kalkulátor", "en"), "Savings goal calculator");
  assert.equal(api.translate(page, "Célösszeg (Ft)", "de"), "Zielbetrag (HUF)");
  assert.equal(api.translate(page, "Feltételezett éves hozam (%)", "en"), "Assumed annual return (%)");
  assert.equal(api.translate(page, "Becsült idő:", "de"), "Geschätzte Dauer:");
  assert.equal(api.translate(page, "15 hónap", "en"), "15 months");
  assert.equal(api.translate(page, "15 hónap", "de"), "15 Monate");
  assert.equal(api.translate(page, "2 074 986 Ft", "en"), null);
  assert.equal(api.translate(page, "2026. augusztus 21.", "en"), "21 August 2026");
  assert.match(api.translate(page, "Miért csak becslés?", "en"), /only an estimate/);
});

test("emergency fund calculator translates labels and dynamic states without changing amounts", () => {
  const page = "vesztartalek-kalkulator";
  assert.equal(api.translate(page, "Vésztartalék kalkulátor", "de"), "Notgroschen-Rechner");
  assert.equal(api.translate(page, "Szükséges havi alapkiadás (Ft)", "en"), "Essential monthly expenses (HUF)");
  assert.equal(api.translate(page, "Becsült idő a célhoz", "de"), "Geschätzte Zeit bis zum Ziel");
  assert.equal(api.translate(page, "16 hónap", "en"), "16 months");
  assert.equal(api.translate(page, "16 hónap", "de"), "16 Monate");
  assert.equal(api.translate(page, "A megadott havi megtakarítással nem számolható", "en"), "Cannot be estimated with the monthly savings entered");
  assert.equal(api.translate(page, "A megadott havi megtakarítással nem számolható", "de"), "Mit dem eingegebenen monatlichen Sparbetrag nicht berechenbar");
  assert.equal(api.translate(page, "2 100 000 Ft", "en"), null);
});

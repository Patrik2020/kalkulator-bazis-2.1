"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, localizeReportHref } = require("../js/egeszseg/running-pace-locale.js");
const page = "futotempo-kalkulator";

test("running pace form, guide, FAQ and metadata are translated", () => {
  assert.equal(translate(page, "Távolság (km)", "en"), "Distance (km)");
  assert.equal(translate(page, "Versenyidőt jósol a kalkulátor?", "de"), "Prognostiziert der Rechner eine Wettkampfzeit?");
  assert.equal(translate(page, "Futótempó kalkulátor | Perc/km, km/h és részidők", "en"), "Running Pace Calculator | Min/km, km/h and Split Times");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Futótempó kalkulátor", "hu"), null);
});

test("dynamic pace labels and every validation branch retain their meaning", () => {
  assert.equal(translate(page, "Átlagtempó", "en"), "Average pace");
  assert.equal(translate(page, "10 km azonos tempóval", "de"), "10 km bei gleichem Tempo");
  assert.equal(translate(page, "Távolság: adj meg érvényes számot.", "en"), "Distance: enter a valid number.");
  assert.equal(translate(page, "Óra: az érték nem lehet negatív.", "de"), "Stunden: Der Wert darf nicht negativ sein.");
  assert.equal(translate(page, "A perc és másodperc mező 0–59 közötti legyen.", "en"), "Minutes and seconds must be between 0 and 59.");
  const en = new URL(localizeReportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "en"));
  assert.equal(en.searchParams.get("subject"), "Error report – Running Pace Calculator");
});

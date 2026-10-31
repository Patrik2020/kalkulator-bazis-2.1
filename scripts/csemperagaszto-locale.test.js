"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/epitoipari/csemperagaszto-locale.js");
const page = "csemperagaszto-kalkulator";

test("adhesive inputs, guide, FAQ and metadata are translated", () => {
  assert.equal(translate(page, "Gyártói anyagfelhasználás (kg/m²)", "en"), "Manufacturer's consumption rate (kg/m²)");
  assert.equal(translate(page, "A kalkulátor figyelembe veszi a kétoldali kenést?", "de"), "Berücksichtigt der Rechner das beidseitige Auftragen?");
  assert.equal(translate(page, "Csemperagasztó kalkulátor | Kg és zsákszám", "en"), "Tile Adhesive Calculator | Kilograms and Bags");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Csemperagasztó kalkulátor", "hu"), null);
});

test("dynamic quantities and every adhesive validation branch retain their meaning", () => {
  assert.equal(translate(page, "80 kg", "en"), "80 kg");
  assert.equal(translate(page, "88,5 kg", "de"), "88,5 kg");
  assert.equal(translate(page, "4 db", "en"), "4 bags");
  assert.equal(translate(page, "1 db", "de"), "1 Sack");
  for (const [source, expected] of [
    ["Burkolandó felület: adj meg érvényes számot.", "Area to tile: enter a valid number."],
    ["Burkolandó felület: az érték legyen nagyobb nullánál.", "Area to tile: enter a value greater than zero."],
    ["Anyagfelhasználás: adj meg érvényes számot.", "Consumption rate: enter a valid number."],
    ["Anyagfelhasználás: az érték legyen nagyobb nullánál.", "Consumption rate: enter a value greater than zero."],
    ["Ráhagyás: adj meg érvényes számot.", "Allowance: enter a valid number."],
    ["Ráhagyás: az érték nem lehet negatív.", "Allowance cannot be negative."],
    ["Zsákméret: adj meg érvényes számot.", "Bag size: enter a valid number."],
    ["Zsákméret: az érték legyen nagyobb nullánál.", "Bag size: enter a value greater than zero."],
    ["A ráhagyás legfeljebb 100% legyen.", "Allowance must not exceed 100%."]
  ]) assert.equal(translate(page, source, "en"), expected, source);
  const de = new URL(reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Fliesenkleber-Rechner");
});

"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/discount-unit-average-locale");

test("all three calculators translate form labels without changing input and prices", () => {
  assert.deepEqual(api.pages, ["ar-kedvezmeny-kalkulator", "egysegar-kalkulator", "atlag-kalkulator"]);
  assert.equal(api.translate("ar-kedvezmeny-kalkulator", "Első kedvezmény (%)", "en"), "First discount (%)");
  assert.equal(api.translate("ar-kedvezmeny-kalkulator", "Végső ár", "de"), "Endpreis");
  assert.equal(api.translate("egysegar-kalkulator", "Egységre vetítés", "en"), "Comparison quantity");
  assert.equal(api.translate("atlag-kalkulator", "Számtani átlag:", "de"), "Arithmetisches Mittel:");
  assert.equal(api.translate("atlag-kalkulator", "Súlyok összege:", "en"), "Sum of weights:");
});

test("dynamic product rankings preserve prices, amounts and units", () => {
  assert.equal(api.translate("egysegar-kalkulator", "1. termék", "en"), "1. product");
  assert.equal(api.translate("egysegar-kalkulator", "2. termék", "de"), "2. Produkt");
  assert.equal(api.translate("egysegar-kalkulator", ": 6 798 Ft / megadott egység – legjobb ár", "en"),
    ": 6 798 Ft / selected quantity – best price");
  assert.equal(api.translate("egysegar-kalkulator", ": 7 196 Ft / megadott egység", "de"),
    ": 7 196 Ft / Vergleichsmenge");
  assert.equal(api.translate("egysegar-kalkulator", ": 6 798 Ft / megadott egység", "hu"), null);
  assert.equal(api.translate("egysegar-kalkulator", "7999 Ft", "en"), null);
});

test("average calculator errors translate and values stay source-formatted", () => {
  assert.match(api.translate("atlag-kalkulator", "Adj meg érvényes értékeket a súlyozott átlaghoz.", "en"), /weighted mean/);
  assert.equal(api.translate("atlag-kalkulator", "A súlyok összege legyen nagyobb nullánál.", "de"),
    "Die Summe der Gewichte muss größer als null sein.");
  assert.equal(api.translate("atlag-kalkulator", "1,05; 0,98; 1,12", "en"), null);
});

test("dictionary entries are reviewed pairs and unknown text falls back to Hungarian", () => {
  for (const dictionary of [api.shared, api.content, ...Object.values(api.dictionaries)]) {
    for (const [source, pair] of Object.entries(dictionary)) {
      assert.ok(source.trim());
      assert.equal(pair.length, 2, source);
      assert.ok(pair.every(s => typeof s === "string" && s.trim()), source);
    }
  }
  assert.equal(api.translate("atlag-kalkulator", "Részletes jogi szöveg", "de"), null);
  assert.equal(api.translate("not-a-calculator", "Számítás", "en"), null);
});

// Explanations and dynamic auxiliary units must follow repeated language changes.
test("content lookup tolerates layout whitespace while preserving numbers", () => {
  assert.equal(api.translate("atlag-kalkulator", "Példák", "en"), "Examples");
  assert.equal(api.translate("atlag-kalkulator", "Példák", "de"), "Beispiele");
  const source = Object.keys(api.content).find(s => s.startsWith("Tedd el"));
  assert.equal(api.translate("atlag-kalkulator", source.replace(/ /g, "\n  "), "en"), api.content[source][0]);
  assert.equal(api.translate("egysegar-kalkulator", "3,75 Ft/egység", "de"), "3,75 HUF/Einheit");
  assert.equal(api.translate("egysegar-kalkulator", "3,75 Ft/egység", "en"), "3,75 HUF/unit");
  assert.equal(api.translate("egysegar-kalkulator", "3,75 Ft/egység", "hu"), null);
});

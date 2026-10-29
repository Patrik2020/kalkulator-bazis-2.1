"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate } = require("../js/autos/floor-level-locale.js");
const page = "aljzatkiegyenlito-kalkulator";

test("floor level calculator labels and guidance are available in English and German", () => {
  assert.equal(translate(page, "Felület (m²)", "en"), "Area (m²)");
  assert.equal(translate(page, "Átlagos rétegvastagság (mm)", "de"), "Durchschnittliche Schichtdicke (mm)");
  assert.equal(translate(page, "Miért kell ráhagyás?", "en"), "Why include an allowance?");
  assert.equal(translate(page, "A kalkulátor megmondja a megfelelő rétegvastagságot?", "de"), "Gibt der Rechner die passende Schichtdicke vor?");
});

test("dynamic bag quantities translate without changing the number", () => {
  assert.equal(translate(page, "5 db", "en"), "5 bags");
  assert.equal(translate(page, "5 db", "de"), "5 Säcke");
  assert.equal(translate(page, "105,6 kg", "en"), null);
});

test("Hungarian and unsupported languages leave source copy unchanged", () => {
  assert.equal(translate(page, "Felület (m²)", "hu"), null);
  assert.equal(translate(page, "Felület (m²)", "fr"), null);
});

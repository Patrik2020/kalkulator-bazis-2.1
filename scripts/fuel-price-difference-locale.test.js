"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/autos/fuel-price-difference-locale");
const page = "uzemanyagar-kulonbseg-kalkulator";

test("fuel price guidance, FAQ and metadata translate", () => {
  for (const source of ["Üzemanyagár-különbség kalkulátor", "Mire jó az üzemanyagár-különbség kalkulátor?",
    "A kitérő költségét számolja?",
    "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Fuel Price Comparison Calculator", "hu"), "Üzemanyagár-különbség kalkulátor");
});

test("dynamic HUF figures, litre amount and validation preserve calculations", () => {
  for (const source of ["Szükséges üzemanyag", "Költség A árral", "Költség B árral", "Különbség",
    "Távolság: az érték legyen nagyobb nullánál.", "Fogyasztás: adj meg érvényes számot.",
    "Üzemanyagár A: az érték nem lehet negatív.", "Üzemanyagár B: adj meg érvényes számot."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "32,5 l", "en"), "32.5 l");
  assert.equal(translate(page, "19\u00a0500 Ft", "en"), "19,500 HUF");
  assert.equal(translate(page, "20\u00a0150 Ft", "de"), "20.150 HUF");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Kraftstoffpreisvergleich");
  assert.ok(new URL(reportHref(original, "en")).searchParams.get("body").includes("Fuel Price Comparison Calculator"));
  assert.equal(reportHref(original, "hu"), original);
});

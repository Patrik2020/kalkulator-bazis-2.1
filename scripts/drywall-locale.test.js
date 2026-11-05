"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, localizeReportHref } = require("../js/epitoipari/drywall-locale.js");
const page = "gipszkarton-kalkulator";

test("drywall form, guide, FAQ, quality copy and metadata are translated", () => {
  assert.equal(translate(page, "Példa CW profil tengelytáv (m)", "en"), "Example CW stud spacing (m)");
  assert.equal(translate(page, "Mikor kell két réteg?", "de"), "Wann sind zwei Lagen erforderlich?");
  assert.equal(translate(page, "Gipszkarton kalkulátor | Lapmennyiség és ráhagyás", "en"), "Drywall Calculator | Board Quantity and Allowance");
  assert.equal(translate(page, "Nedves helyiség", "de"), "Feuchtraum");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Gipszkarton kalkulátor", "hu"), null);
});

test("dynamic drywall results and validation retain their meaning", () => {
  assert.equal(translate(page, "22,46 m²", "en"), "22.46 m²");
  assert.equal(translate(page, "22,46 m²", "de"), "22,46 m²");
  assert.equal(translate(page, "8 db", "en"), "8 pcs");
  assert.equal(translate(page, "8 db / 20,8 folyóméter", "de"), "8 Stk. / 20,8 Laufmeter");
  assert.equal(translate(page, "Fal szélessége: adj meg nullánál nagyobb értéket.", "en"), "Wall width: enter a value greater than zero.");
  assert.equal(translate(page, "A kivont felület nem lehet nagyobb a fal teljes felületénél.", "de"), "Die abgezogene Fläche darf nicht größer als die gesamte Wandfläche sein.");
  const de = new URL(localizeReportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Trockenbau-Rechner");
});

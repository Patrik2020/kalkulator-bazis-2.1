"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, localizeReportHref } = require("../js/epitoipari/fuga-locale.js");
const page = "fuga-kalkulator";

test("grout form, guide, FAQ and metadata are translated", () => {
  assert.equal(translate(page, "Fugázóanyag sűrűségi tényezője", "en"), "Grout density factor");
  assert.equal(translate(page, "A szilikon is benne van?", "de"), "Ist Silikon enthalten?");
  assert.equal(translate(page, "Fugakalkulátor – fugázóanyag mennyiség és szükséglet", "en"), "Grout Calculator – Quantity and Material Requirement");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Fuga kalkulátor", "hu"), null);
});

test("dynamic grout results and validation retain their meaning", () => {
  assert.equal(translate(page, "4,32 kg", "en"), "4.32 kg");
  assert.equal(translate(page, "4,67 kg", "de"), "4,67 kg");
  assert.equal(translate(page, "1 db", "en"), "1 pack");
  assert.equal(translate(page, "2 db", "de"), "2 Packungen");
  assert.equal(translate(page, "Felület: adj meg nullánál nagyobb értéket.", "en"), "Area: enter a value greater than zero.");
  assert.equal(translate(page, "Anyagveszteség: adj meg nulla vagy pozitív értéket.", "de"), "Materialzuschlag: Gib null oder einen positiven Wert ein.");
  assert.equal(translate(page, "A fugamélység aránya legfeljebb 100% lehet.", "en"), "The joint depth ratio must not exceed 100%.");
  const de = new URL(localizeReportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Fugenmörtel-Rechner");
});

"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/epitoipari/mulch-locale");
const page = "mulcs-kalkulator";

test("mulch page, guide, FAQ and metadata translate and restore", () => {
  assert.equal(translate(page, "Mulcs kalkulátor", "en"), "Mulch Calculator");
  assert.equal(translate(page, "Miért kell ráhagyás?", "de"), "Warum ist ein Zuschlag sinnvoll?");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Mulch Calculator", "hu"), "Mulcs kalkulátor");
});

test("mulch dynamic values, labels, validation classes and report link translate", () => {
  assert.equal(translate(page, "Szükséges mennyiség:", "en"), "Required quantity:");
  assert.equal(translate(page, "1,65 m³", "en"), "1.65 m³");
  assert.equal(translate(page, "1650 liter", "en"), "1,650 litres");
  assert.equal(translate(page, "33 db", "de"), "33 Säcke");
  assert.equal(translate(page, "A ráhagyás legfeljebb 100% legyen.", "de"), "Der Zuschlag darf höchstens 100 % betragen.");
  assert.equal(translate(page, "Felület: az érték legyen nagyobb nullánál.", "en"), "Area: the value must be greater than zero.");
  assert.equal(translate(page, "Rétegvastagság: adj meg érvényes számot.", "de"), "Schichtdicke: Gib eine gültige Zahl ein.");
  assert.equal(translate(page, "Ráhagyás: az érték nem lehet negatív.", "en"), "Allowance: the value cannot be negative.");
  assert.equal(translate(page, "Zsák mérete: az érték legyen nagyobb nullánál.", "de"), "Sackgröße: Der Wert muss größer als null sein.");
  const en = new URL(reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "en"));
  assert.equal(en.searchParams.get("subject"), "Error report – Mulch Calculator");
});

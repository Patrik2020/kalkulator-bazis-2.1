"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/autos/braking-distance-locale");
const page = "fektav-kalkulator";

test("braking distance content, FAQ and metadata translate in both languages", () => {
  for (const source of ["Féktáv kalkulátor", "Mit becsül a féktáv kalkulátor?",
    "Miért csak becslés?", "Biztonsági értelmezés", "Mit jelent a μ érték?",
    "Ez megadja a biztonságos követési távolságot?"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Hirdetés", "en"), "Advertisement");
  assert.equal(translate(page, "Braking Distance Calculator", "hu"), "Féktáv kalkulátor");
});

test("dynamic result, validation and report link translate without changing values", () => {
  for (const source of ["Reakcióút", "Elméleti fékút", "Teljes megállási távolság",
    "Sebesség: az érték nem lehet negatív.", "Reakcióidő: adj meg érvényes számot.",
    "Tapadási tényező: az érték legyen nagyobb nullánál.",
    "A tapadási tényező legfeljebb 1,5 legyen."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "13,9 m", "en"), "13.9 m");
  assert.equal(translate(page, "13,9 m", "de"), "13,9 m");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Bremswegrechner");
  assert.equal(reportHref(original, "hu"), original);
});

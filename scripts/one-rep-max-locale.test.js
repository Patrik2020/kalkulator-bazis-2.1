"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/one-rep-max-locale");
const page = "egyszeri-max-1rm-kalkulator";

test("one-rep max guide, FAQ, metadata and structured language", () => {
  assert.equal(translate(page, "1RM kalkulátor", "en"), "One-Rep Max Calculator");
  assert.equal(translate(page, "Milyen ismétléstartományban érdemes használni?", "de"), "Für welchen Wiederholungsbereich eignet sich die Schätzung?");
  assert.ok(translate(page, "Az 1RM, vagyis egyismétléses maximum annak a terhelésnek a becslése, amelyből ideális körülmények között egy szabályos ismétlés végezhető. A kalkulátor nem kér valódi maximális próbát: egy többismétléses sorozatból készít matematikai közelítést.", "en").includes("maximal lift"));
  assert.equal(translate(page, "Muszáj kipróbálnom a kiszámolt maximumot?", "de"), "Muss ich das geschätzte Maximum tatsächlich heben?");
  assert.equal(translate(page, "hu-HU", "en"), "en-GB");
  assert.equal(translate(page, "Főoldal", "hu"), null);
  assert.equal(translate(page, "One-Rep Max Calculator", "hu"), "1RM kalkulátor");
});

test("dynamic results, validation and mail subject are localized", () => {
  for (const source of ["Epley becslés:", "Brzycki becslés:", "Átlagos becslés:", "80% terhelés:",
    "Súly: adj meg érvényes számot.", "Súly: az érték legyen nagyobb nullánál.",
    "Ismétlésszám: adj meg érvényes számot.", "Ismétlésszám: az érték legyen nagyobb nullánál.",
    "Az ismétlésszám 1 és 12 közötti egész szám legyen.", "Adj meg érvényes adatokat."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "93,3 kg", "en"), "93.3 kg");
  assert.equal(translate(page, "1 234,5 kg", "en"), "1234.5 kg");
  assert.equal(translate(page, "93,3 kg", "de"), null);
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s";
  assert.equal(new URL(reportHref(source, "de")).searchParams.get("subject"), "Fehlermeldung – 1RM-Rechner");
  assert.equal(reportHref(source, "hu"), source);
});

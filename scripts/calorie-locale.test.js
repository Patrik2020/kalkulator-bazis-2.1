"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/calorie-locale");
const page = "kaloria-kalkulator";
test("calorie guidance, health boundaries, FAQ and metadata translate", () => {
  for (const source of ["Kalória kalkulátor", "Mit jelent a napi kalóriaszükséglet?", "Fogyásnál mi fontosabb, mint a tökéletes szám?", "Pontosan megmondja, mennyit ehetek?", "Kalóriabecslés bizonytalansági térképe", "Bontsd le a napi energiakeretet használható tervre", "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source); assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Calorie Calculator", "hu"), "Kalória kalkulátor");
});
test("dynamic calories, scenarios, validation and report link translate", () => {
  assert.equal(translate(page, "2494 kcal", "en"), "2,494 kcal");
  assert.equal(translate(page, "Példa a fenntartó értékhez képest: -400 kcal → 2094 kcal | +400 kcal → 2894 kcal", "de"), "Beispiel gegenüber dem Erhaltungswert: −400 kcal → 2.094 kcal | +400 kcal → 2.894 kcal");
  assert.ok(translate(page, "A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk.", "en").includes("18"));
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Kalorienrechner");
  assert.equal(reportHref(original, "hu"), original);
});

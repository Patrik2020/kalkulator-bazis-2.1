"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/heart-rate-locale");
const page = "pulzus-zona-kalkulator";

test("heart-rate guidance, safety boundaries, FAQ and metadata translate", () => {
  for (const source of ["Pulzus zóna kalkulátor", "Edzési pulzustartományok becslése",
    "Mikor ne hagyatkozz kalkulátorra?", "Mit tegyek szédülés vagy mellkasi fájdalom esetén?",
    "Edzésintenzitás keresztellenőrző", "Pulzuszónák több maximálispulzus-becsléssel",
    "220 − életkor", "CDC – What Counts as Physical Activity for Adults",
    "American Heart Association – Target Heart Rates", "HHS – Physical Activity Guidelines: relative intensity",
    "Tanaka és mtsai. – életkor alapján becsült maximális pulzus", "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Heart Rate Zone Calculator", "hu"), "Pulzus zóna kalkulátor");
});

test("dynamic ranges, validation and report link preserve the calculation", () => {
  assert.equal(translate(page, "108–131 bpm", "en"), "108–131 bpm");
  assert.equal(translate(page, "135–165 bpm", "de"), "135–165 bpm");
  for (const source of ["Becsült max pulzus", "Közepes relatív intenzitás – 40–59% pulzustartalék",
    "Intenzív relatív intenzitás – 60–84% pulzustartalék", "Becsült max pulzus:",
    "Közepes relatív intenzitás – 40–59% pulzustartalék:",
    "Intenzív relatív intenzitás – 60–84% pulzustartalék:", "Becsült maximális pulzus",
    "A felnőtt tervezőhöz 18+ életkort és a becsült maximumnál alacsonyabb pozitív nyugalmi pulzust adj meg.",
    "Ezt a pulzustartalékos tervezőt felnőtteknek (18+) használjuk",
    "A nyugalmi pulzus legyen kisebb a becsült maximális pulzusnál"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Herzfrequenzzonen-Rechner");
  assert.ok(new URL(reportHref(original, "en")).searchParams.get("body").includes("Heart Rate Zone Calculator"));
  assert.equal(reportHref(original, "hu"), original);
});

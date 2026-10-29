"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate } = require("../js/egeszseg/bmi-locale.js");
const page = "bmi-kalkulator";

test("BMI calculator copy preserves its non-diagnostic and age-specific caveats", () => {
  assert.equal(translate(page, "BMI kalkulátor", "en"), "BMI Calculator");
  assert.equal(translate(page, "Testsúly (kg)", "de"), "Gewicht (kg)");
  assert.equal(translate(page, "A BMI diagnózis?", "en"), "Is BMI a diagnosis?");
  assert.equal(translate(page, "Nem. Tájékoztató jellegű mutató, nem helyettesít orvosi vizsgálatot.", "de"), "Nein. Er ist ein Richtwert und ersetzt keine ärztliche Untersuchung.");
  assert.equal(translate(page, "Gyermekek:", "en"), "Children:");
});

test("live BMI categories translate without changing numerical scores", () => {
  assert.equal(translate(page, "22.9", "en"), null);
  assert.equal(translate(page, "Normál testsúly", "en"), "Healthy weight");
  assert.equal(translate(page, "Túlsúly", "de"), "Übergewicht");
  assert.equal(translate(page, "Sovány", "de"), "Untergewicht");
});

test("adult BMI sources and calculation guidance have English and German versions", () => {
  assert.equal(translate(page, "BMI kalkulátor felnőtteknek: testtömegindex számítás testsúly és magasság alapján, kategóriák, képlet, példaszámítás és értelmezési korlátok.", "en").startsWith("Adult BMI calculator:"), true);
  assert.equal(translate(page, "A BMI népességszintű szűrőmutató, nem közvetlen testzsírmérés és nem önálló diagnózis.", "de"), "Der BMI ist ein bevölkerungsbezogener Screeningwert, keine direkte Messung des Körperfetts und keine eigenständige Diagnose.");
});

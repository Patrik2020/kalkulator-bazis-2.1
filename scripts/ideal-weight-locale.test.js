"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/ideal-weight-locale");
const page = "idealis-testsuly-kalkulator";

test("ideal weight guidance, FAQ, limits and metadata translate", () => {
  for (const source of ["Tájékoztató testsúlytartomány-kalkulátor", "Miért nem egyetlen ideális testsúlyt mutatunk?", "A történeti becslés korlátai", "A tartomány fogyási cél?", "„Ideális testsúly” értelmezési korlát", "Tájékoztató tartomány", "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Informative Weight Range Calculator", "hu"), "Tájékoztató testsúlytartomány-kalkulátor");
});

test("dynamic weights, validation and report link preserve the model", () => {
  assert.equal(translate(page, "72,6 kg", "en"), "72.6 kg");
  assert.equal(translate(page, "52,8–71,1 kg", "de"), "52,8–71,1 kg");
  assert.equal(translate(page, "A Devine-képlet 152,4 cm alatt nem ad megbízható becslést", "en"), "The Devine formula does not provide a reliable estimate below 152.4 cm.");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Gewichtsbereichsrechner");
  assert.ok(new URL(reportHref(original, "en")).searchParams.get("body").includes("Weight Range Calculator"));
  assert.equal(reportHref(original, "hu"), original);
});

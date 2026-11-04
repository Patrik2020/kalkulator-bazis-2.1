"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/protein-needs-locale");
const page = "feherje-szukseglet-kalkulator";

test("protein guidance, health boundaries, FAQ and metadata translate", () => {
  for (const source of ["Fehérje szükséglet kalkulátor", "Mit számol a fehérjeszükséglet kalkulátor?",
    "Fehérjeigény – kontextuskapu", "Fehérjeszükséglet – tartomány és egészségügyi korlátok",
    "Vesebetegség, májbetegség vagy speciális diéta mellett a fehérjecél nem állítható be általános kalkulátorból.",
    "Miért nem ad automatikusan egyetlen szorzót?", "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Protein Needs Calculator", "hu"), "Fehérje szükséglet kalkulátor");
});

test("dynamic grams, validation and report link preserve the model", () => {
  assert.equal(translate(page, "128 g", "en"), "128 g");
  assert.equal(translate(page, "32 g", "de"), "32 g");
  assert.equal(translate(page, "Az értékek legyenek nagyobbak nullánál", "en"), "Values must be greater than zero.");
  for (const source of ["Napi fehérje a választott szorzóval", "Példa: 4 egyenlő részre osztva",
    "Napi fehérje a választott szorzóval:", "Példa: 4 egyenlő részre osztva:"]) {
    assert.ok(translate(page, source, "en"));
    assert.ok(translate(page, source, "de"));
  }
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Proteinbedarfsrechner");
  assert.ok(new URL(reportHref(original, "en")).searchParams.get("body").includes("Protein Needs Calculator"));
  assert.equal(reportHref(original, "hu"), original);
});

#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { transforms: baseTransforms } = require("./apply-construction-model-upgrades.js");
const { transformConstruction } = require("./apply-construction-manufacturer-guards.js");
const { transform: plasterModeTransform } = require("./apply-plaster-consumption-mode.js");

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const advancedPath = "js/construction-upgrades.js";

let source = baseTransforms[advancedPath](read(advancedPath));
source = transformConstruction(source);
source = plasterModeTransform(source);
source = source.replace(
  "  const config = configs[slug]; if (!config) return;",
  "  globalThis.__CONFIGS__ = configs;\n  return;\n  const config = configs[slug]; if (!config) return;"
);

const sandbox = {
  console,
  Intl,
  Math,
  Number,
  String,
  Object,
  window: { location: { pathname: "/kalkulatorok/vakolat-kalkulator" } },
  document: { querySelector: () => ({}) },
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: advancedPath });
const plaster = sandbox.__CONFIGS__["vakolat-kalkulator"];
assert.ok(plaster, "Vakolat konfiguráció hiányzik");
const rows = (result) => Object.fromEntries(Array.from(result, ([key, value]) => [String(key), String(value)]));

// Hivatalos gyártói példák igazolják, hogy két eltérő adatlap-formátumot kell kezelni:
// Baumit FinoGrosso: kb. 1,2 kg/m²/mm.
// https://baumit.hu/files/hu/pdf_fajlok/pds_finogrosso_bhu_hu_25013.pdf
// Cemix Edelputz Extra 2: kb. 3,5–4 kg/m² simított/glettelt alapfelületen,
// nem kg/m²/mm formában.
// https://archive2024.cemix.hu/Termekek/Szinezovakolatokfestekek/Szinezovakolatok/Edelputz_Extra_2
assert.ok(plaster.fields.some((f) => f.id === "consumptionMode" && f.value === "per-mm"), "Vakolat fogyási mód választó hiányzik");
assert.ok(plaster.fields.some((f) => f.id === "thickness" && /Csak a kg\/m²\/mm/.test(f.help || "")), "Rétegvastagság módmagyarázata hiányzik");

const common = {
  grossArea: 40,
  doorArea: 3,
  windowArea: 2,
  otherArea: 0,
  thickness: 10,
  bagSize: 25,
  waste: 8,
  manufacturerConfirmed: "yes",
};

const perMm = rows(plaster.compute({
  ...common,
  consumptionMode: "per-mm",
  minConsumption: 1.2,
  maxConsumption: 1.5,
}));
assert.equal(perMm["Fogyási mód"], "kg/m²/mm × rétegvastagság");
assert.equal(perMm["Nettó vakolandó felület"], "35 m²");
assert.equal(perMm["Nettó anyagigény"], "420–525 kg");
assert.equal(perMm["Vásárolandó anyag"], "453,6–567 kg");
assert.equal(perMm["Szükséges zsák"], "19–23 db");

const perArea = rows(plaster.compute({
  ...common,
  consumptionMode: "per-area",
  minConsumption: 3.5,
  maxConsumption: 4,
}));
assert.equal(perArea["Fogyási mód"], "kg/m² – közvetlen gyártói érték");
assert.equal(perArea["Nettó anyagigény"], "122,5–140 kg");
assert.equal(perArea["Vásárolandó anyag"], "132,3–151,2 kg");
assert.equal(perArea["Szükséges zsák"], "6–7 db");

// Regresszióvédelem: a közvetlen 3,5 kg/m² adatot tilos még egyszer 10 mm-rel megszorozni.
assert.notEqual(perArea["Nettó anyagigény"], "1225–1400 kg");
assert.throws(() => plaster.compute({
  ...common,
  consumptionMode: "unknown",
  minConsumption: 1.2,
  maxConsumption: 1.5,
}), /Ismeretlen vakolat-anyagszükséglet egység/);

console.log("Plaster consumption mode audit OK: kg/m²/mm és közvetlen kg/m² mód külön, gyártói megerősítés megtartva.");

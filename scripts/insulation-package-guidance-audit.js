#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { transforms: baseTransforms } = require("./apply-construction-model-upgrades.js");
const { transformConstruction } = require("./apply-construction-manufacturer-guards.js");
const { transform: plasterModeTransform } = require("./apply-plaster-consumption-mode.js");
const { transform: roofModeTransform } = require("./apply-roof-purchase-mode.js");
const { transform: insulationGuidanceTransform } = require("./apply-insulation-package-guidance.js");

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const advancedPath = "js/construction-upgrades.js";
let source = baseTransforms[advancedPath](read(advancedPath));
source = transformConstruction(source);
source = plasterModeTransform(source);
source = roofModeTransform(source);
source = insulationGuidanceTransform(source);
source = source.replace(
  "  const config = configs[slug]; if (!config) return;",
  "  globalThis.__CONFIGS__ = configs;\n  return;\n  const config = configs[slug]; if (!config) return;"
);

const sandbox = {
  console, Intl, Math, Number, String, Object,
  window: { location: { pathname: "/kalkulatorok/hoszigeteles-kalkulator" } },
  document: { querySelector: () => ({}) },
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: advancedPath });
const insulation = sandbox.__CONFIGS__["hoszigeteles-kalkulator"];
assert.ok(insulation, "Hőszigetelés konfiguráció hiányzik");
const packField = insulation.fields.find((f) => f.id === "packCoverage");
assert.ok(packField, "Hőszigetelés csomagfedés mező hiányzik");
assert.equal(packField.label, "Konkrét termék csomagfedése (m²/csomag)");
assert.match(packField.help, /lapvastagsággal/);
assert.match(packField.help, /5 m² csak példa/);
assert.match(insulation.intro, /lapvastagságból önmagában nem talál ki csomagméretet/);

// Hivatalos gyártói példa: Austrotherm EPS AT-H80 csomagfedés vastagság szerint
// 20 mm: 12,0 m²/csomag; 50 mm: 5,0; 100 mm: 2,5; 260 mm: 0,5.
// https://www.austrotherm.hu/termekek/austrotherm-eps/austrotherm-eps-at-h80-homlokzati-hoszigetelo-lemez/
const officialExampleCoverage = { 20: 12, 50: 5, 100: 2.5, 260: 0.5 };
assert.equal(Math.max(...Object.values(officialExampleCoverage)) / Math.min(...Object.values(officialExampleCoverage)), 24, "A csomagfedés vastagságfüggő szórása nem elhanyagolható");

const common = {
  grossArea: 100,
  doorArea: 10,
  windowArea: 8,
  otherArea: 0,
  waste: 8,
  adhesiveMin: 4,
  adhesiveMax: 6,
  adhesiveBag: 25,
  dowelsMin: 6,
  dowelsMax: 8,
  systemConfirmed: "yes",
};
const rows = (result) => Object.fromEntries(Array.from(result, ([key, value]) => [String(key), String(value)]));

const at50 = rows(insulation.compute({ ...common, packCoverage: 5 }));
const at100 = rows(insulation.compute({ ...common, packCoverage: 2.5 }));
const at260 = rows(insulation.compute({ ...common, packCoverage: 0.5 }));
assert.equal(at50["Szigetelőanyag-csomag"], "18 db");
assert.equal(at100["Szigetelőanyag-csomag"], "36 db");
assert.equal(at260["Szigetelőanyag-csomag"], "178 db");

// Ugyanaz a 88,56 m² lapigény; csak a gyártói csomagfedés változik.
assert.equal(at50["Lapigény ráhagyással"], "88,56 m²");
assert.equal(at100["Lapigény ráhagyással"], "88,56 m²");
assert.equal(at260["Lapigény ráhagyással"], "88,56 m²");

console.log("Insulation package guidance audit OK: a csomagfedés konkrét termék/vastagság adat, nem univerzális 5 m².");

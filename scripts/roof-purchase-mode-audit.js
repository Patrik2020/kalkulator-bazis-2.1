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

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const advancedPath = "js/construction-upgrades.js";
let source = baseTransforms[advancedPath](read(advancedPath));
source = transformConstruction(source);
source = plasterModeTransform(source);
source = roofModeTransform(source);
source = source.replace(
  "  const config = configs[slug]; if (!config) return;",
  "  globalThis.__CONFIGS__ = configs;\n  return;\n  const config = configs[slug]; if (!config) return;"
);

const sandbox = {
  console, Intl, Math, Number, String, Object,
  window: { location: { pathname: "/kalkulatorok/tetocserep-kalkulator" } },
  document: { querySelector: () => ({}) },
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: advancedPath });
const roof = sandbox.__CONFIGS__["tetocserep-kalkulator"];
assert.ok(roof, "Tetőcserép konfiguráció hiányzik");
const rows = (result) => Object.fromEntries(Array.from(result, ([key, value]) => [String(key), String(value)]));

assert.ok(roof.fields.some((f) => f.id === "purchaseMode" && f.value === "pieces"), "A tetőcserép alapértelmezett rendelési módja ne legyen teljes raklap");
assert.ok(/Raklapra csak akkor/.test(roof.intro), "A raklapra kerekítés feltétele nincs elmagyarázva");

const common = {
  roofArea: 120,
  openings: 3,
  tilesMin: 9.2,
  tilesMax: 10,
  waste: 8,
  packSize: 192,
  manufacturerConfirmed: "yes",
};

const pieces = rows(roof.compute({ ...common, purchaseMode: "pieces" }));
assert.equal(pieces["Rendelési mód"], "Darabonként rendelhető");
assert.equal(pieces["Cserépigény ráhagyással"], "1163–1264 db");
assert.ok(!("Vásárolandó teljes csomag/raklap" in pieces), "Darabonkénti módban tilos teljes raklapra kerekített vásárlást előírni");
assert.match(pieces["Raklap-egyenérték (csak tájékoztató)"], /^6,06–6,58$/, "Tájékoztató raklap-egyenérték eltért");

const whole = rows(roof.compute({ ...common, purchaseMode: "whole-pack" }));
assert.equal(whole["Rendelési mód"], "Csak teljes csomag/raklap");
assert.equal(whole["Vásárolandó teljes csomag/raklap"], "7–7 db");
assert.equal(whole["Raklapra kerekített darabszám"], "1344–1344 db");

// A teljes-raklap mód ennél a példánál 80–181 darabbal több cserepet jelenthet;
// ez csak akkor elfogadható ajánlás, ha a kereskedő tényleg teljes raklapra korlátoz.
assert.equal(1344 - 1264, 80);
assert.equal(1344 - 1163, 181);
assert.throws(() => roof.compute({ ...common, purchaseMode: "mystery" }), /Ismeretlen tetőcserép rendelési mód/);
assert.throws(() => roof.compute({ ...common, purchaseMode: "pieces", packSize: 192.5 }), /pozitív egész szám/);

console.log("Roof purchase mode audit OK: darabos rendelés nincs raklapra kerekítve; teljes csomag mód explicit és külön tesztelt.");

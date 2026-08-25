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
const { transform: drywallGuidanceTransform } = require("./apply-drywall-system-guidance.js");

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const advancedPath = "js/construction-upgrades.js";
let source = baseTransforms[advancedPath](read(advancedPath));
source = transformConstruction(source);
source = plasterModeTransform(source);
source = roofModeTransform(source);
source = insulationGuidanceTransform(source);
source = drywallGuidanceTransform(source);
source = source.replace(
  "  const config = configs[slug]; if (!config) return;",
  "  globalThis.__CONFIGS__ = configs;\n  return;\n  const config = configs[slug]; if (!config) return;"
);

const sandbox = {
  console, Intl, Math, Number, String, Object,
  window: { location: { pathname: "/kalkulatorok/gipszkarton-kalkulator" } },
  document: { querySelector: () => ({}) },
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: advancedPath });
const drywall = sandbox.__CONFIGS__["gipszkarton-kalkulator"];
assert.ok(drywall, "Gipszkarton konfiguráció hiányzik");
const rows = (result) => Object.fromEntries(Array.from(result, ([key, value]) => [String(key), String(value)]));

// Rigips 2026 tervezői könyvben 600 és 625 mm profilkiosztás, valamint 3 réteg/oldalas rendszerek is szerepelnek;
// ENERGOBOARD rendszerpéldában 300 és 600 mm kiosztás is létezik.
// https://www.rigips.hu/dokumentumok/tervezoi-konyv/rigips-vlaszfalak-fejezet-szimpla-profilvz-v8-260203.pdf
// https://www.rigips.hu/hirek/minositett-rigipsr-energoboard-valaszfalak
// Knauf G-K Start: hézagoló anyagigény 1 réteg 0,3; 2 réteg 0,5; 4 réteg 1 kg/m²,
// tehát a kiegészítő anyagigény nem kezelhető univerzális, lineáris konstansként.
// https://knauf.hu/wp-content/uploads/2023/03/K469_G-Kstart-hu-2303.pdf

const layers = drywall.fields.find((f) => f.id === "layers");
assert.ok(layers, "Rétegválasztó hiányzik");
assert.deepEqual(Array.from(layers.options, (pair) => String(pair[0])), ["1", "2", "3"], "3 réteg/oldal támogatás hiányzik");

const stud = drywall.fields.find((f) => f.id === "studSpacing");
const screws = drywall.fields.find((f) => f.id === "screwsPerM2");
const tape = drywall.fields.find((f) => f.id === "tapePerM2");
const compound = drywall.fields.find((f) => f.id === "compoundPerM2");
for (const field of [stud, screws, tape, compound]) assert.ok(field && /Példa/.test(field.label), `Rendszerfüggő mező nincs példaértékként jelölve: ${field?.id || "hiányzik"}`);
assert.match(stud.help, /0,30 \/ 0,60 \/ 0,625/);
assert.match(compound.help, /teljes rendszerre/);
assert.ok(drywall.fields.some((f) => f.id === "systemConfirmed" && f.value === "no"), "Gipszkarton rendszermegerősítés alapból nem tiltott");

const common = {
  wallWidth: 4,
  wallHeight: 2.6,
  doorArea: 1.9,
  windowArea: 0,
  otherArea: 0,
  sides: 2,
  layers: 1,
  boardWidth: 1.2,
  boardHeight: 2.5,
  waste: 8,
  studSpacing: 0.6,
  screwsPerM2: 20,
  tapePerM2: 1.4,
  compoundPerM2: 0.35,
};
assert.throws(() => drywall.compute({ ...common, systemConfirmed: "no" }), /ellenőrizd.*gipszkarton rendszer/i);
const one = rows(drywall.compute({ ...common, systemConfirmed: "yes" }));
assert.equal(one["Nettó felület egy oldalon"], "8,5 m²");
assert.equal(one["Teljes burkolandó felület"], "17 m²");
assert.equal(one["Gipszkarton lap"], "7 db");
assert.equal(one["CW állóprofil"], "8 db / 20,8 folyóméter");

const three = rows(drywall.compute({ ...common, layers: 3, systemConfirmed: "yes" }));
assert.equal(three["Teljes burkolandó felület"], "51 m²");
assert.equal(three["Gipszkarton lap"], "19 db");
// A váz nem triplázódik a laprétegek számával.
assert.equal(three["CW állóprofil"], one["CW állóprofil"]);
assert.equal(three["UW vezetőprofil"], one["UW vezetőprofil"]);

console.log("Drywall system guidance audit OK: 1–3 réteg, rendszerfüggő profil/kiegészítő adatok és explicit megerősítés.");

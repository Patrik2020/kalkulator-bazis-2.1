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
const { transform: insulationPackageTransform } = require("./apply-insulation-package-guidance.js");

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const advancedPath = "js/construction-upgrades.js";

// A tényleges build sorrendjével azonos végállapotot vizsgáljuk, fájlírás nélkül.
// Ez azért fontos, mert a gyártói guard után további, ugyanazokat a mezőket
// pontosító transzformok futnak (vakolat egységmód, tető rendelési mód,
// hőszigetelés csomagfedés-guidance).
let source = baseTransforms[advancedPath](read(advancedPath));
source = transformConstruction(source);
source = plasterModeTransform(source);
source = roofModeTransform(source);
source = insulationPackageTransform(source);

// A konfigurációkat kinyerjük anélkül, hogy a DOM-felület felépülne.
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
const configs = sandbox.__CONFIGS__;
assert.ok(configs, "A construction konfigurációk nem nyerhetők ki");
const rows = (result) => Object.fromEntries(Array.from(result, ([key, value]) => [String(key), String(value)]));

// Miért nem lehet univerzális alapértékként kezelni ezeket?
// Hivatalos példák (2026-08 audit):
// - Baumit FinoGrosso: kb. 1,2 kg/m²/mm, 20 kg/zsák.
//   https://baumit.hu/files/hu/pdf_fajlok/pds_finogrosso_bhu_hu_25013.pdf
// - Cemix Premium Plus: kb. 1,5 kg/m²/mm, 40 kg/zsák.
//   https://www.cemix.hu/hu/p/4200-Belteri-alapvakolatok/4250-PREMIUM-PLUS
// - Baumit Star ásványi rendszer: ragasztó kb. 5 kg/m²; felületi dübel min. 6 db/m²,
//   éleken min. 8 db/m². A teljes rendszer anyagigénye ettől eltérhet.
//   https://baumit.hu/files/hu/brochure/pdf/baumit-star-homlokzati-hoszigetelo-rendszer-asvanyi_%281%29.pdf
// - Tondach Planoton 9: kb. 9,2–10,0 db/m², míg Tondach hódfarkú fedésnél
//   a minimális szükséglet 30,2 db/m² is lehet.
//   https://shop.wienerberger.hu/tondach/1273/tondach-inspira-fusioncolor-terrakotta-tetocserep
//   https://www.wienerberger.hu/content/dam/wienerberger/hungary/marketing/documents-magazines/brochures/Tondach_%C3%A1rjegyz%C3%A9k_202502031.pdf
assert.ok(30.2 / 9.2 > 3, "A tetőcserép termékfüggő szórása nem elhanyagolható");

const plaster = configs["vakolat-kalkulator"];
assert.ok(plaster.fields.some((f) => f.id === "manufacturerConfirmed" && f.value === "no"), "Vakolat gyártói megerősítés alapból nem tiltott");
assert.ok(plaster.fields.some((f) => f.id === "minConsumption" && /Példa/.test(f.label) && /adatlap/.test(f.help)), "Vakolat anyagszükséglet nincs példaértékként és adatlapfüggőként jelölve");
assert.throws(() => plaster.compute({
  grossArea: 40, doorArea: 3, windowArea: 2, otherArea: 0, thickness: 10,
  minConsumption: 1.2, maxConsumption: 1.5, bagSize: 25, waste: 8,
  consumptionMode: "per-mm", manufacturerConfirmed: "no",
}), /ellenőrizd.*gyártói|gyártói.*ellenőrizd/i);
const plasterOk = rows(plaster.compute({
  grossArea: 40, doorArea: 3, windowArea: 2, otherArea: 0, thickness: 10,
  minConsumption: 1.2, maxConsumption: 1.5, bagSize: 25, waste: 8,
  consumptionMode: "per-mm", manufacturerConfirmed: "yes",
}));
assert.equal(plasterOk["Fogyási mód"], "kg/m²/mm × rétegvastagság");
assert.equal(plasterOk["Nettó vakolandó felület"], "35 m²");
assert.equal(plasterOk["Nettó anyagigény"], "420–525 kg");
assert.equal(plasterOk["Vásárolandó anyag"], "453,6–567 kg");
assert.equal(plasterOk["Szükséges zsák"], "19–23 db");

const insulation = configs["hoszigeteles-kalkulator"];
assert.ok(insulation.fields.some((f) => f.id === "systemConfirmed" && f.value === "no"), "Hőszigetelés rendszermegerősítés alapból nem tiltott");
assert.ok(insulation.fields.some((f) => f.id === "packCoverage" && /Konkrét termék/.test(f.label) && /vastagság/.test(f.help) && /példa/.test(f.help)), "Hőszigetelés csomagfedés nincs konkrét termék/vastagság adatként jelölve");
assert.throws(() => insulation.compute({
  grossArea: 100, doorArea: 10, windowArea: 8, otherArea: 0, packCoverage: 5, waste: 8,
  adhesiveMin: 4, adhesiveMax: 6, adhesiveBag: 25, dowelsMin: 6, dowelsMax: 8,
  systemConfirmed: "no",
}), /rendszer.*ellenőrizd|ellenőrizd.*rendszer/i);
const insulationOk = rows(insulation.compute({
  grossArea: 100, doorArea: 10, windowArea: 8, otherArea: 0, packCoverage: 5, waste: 8,
  adhesiveMin: 4, adhesiveMax: 6, adhesiveBag: 25, dowelsMin: 6, dowelsMax: 8,
  systemConfirmed: "yes",
}));
assert.equal(insulationOk["Nettó szigetelendő felület"], "82 m²");
assert.equal(insulationOk["Lapigény ráhagyással"], "88,56 m²");
assert.equal(insulationOk["Szigetelőanyag-csomag"], "18 db");
assert.equal(insulationOk["Ragasztóanyag"], "328–492 kg");
assert.equal(insulationOk["Ragasztózsák"], "14–20 db");
assert.equal(insulationOk["Dübel"], "492–656 db");

const roof = configs["tetocserep-kalkulator"];
assert.ok(roof.fields.some((f) => f.id === "manufacturerConfirmed" && f.value === "no"), "Tetőcserép gyártói megerősítés alapból nem tiltott");
assert.ok(roof.fields.some((f) => f.id === "tilesMin" && /Példa/.test(f.label) && /gyártói/.test(f.help)), "Tetőcserép db/m² nincs termékfüggőként jelölve");
assert.throws(() => roof.compute({
  roofArea: 120, openings: 3, tilesMin: 9.2, tilesMax: 10, waste: 8, packSize: 192,
  purchaseMode: "pieces", manufacturerConfirmed: "no",
}), /ellenőrizd.*tetőcserép|tetőcserép.*ellenőrizd/i);
const roofOk = rows(roof.compute({
  roofArea: 120, openings: 3, tilesMin: 9.2, tilesMax: 10, waste: 8, packSize: 192,
  purchaseMode: "pieces", manufacturerConfirmed: "yes",
}));
assert.equal(roofOk["Rendelési mód"], "Darabonként rendelhető");
assert.equal(roofOk["Nettó fedendő tetőfelület"], "117 m²");
assert.equal(roofOk["Cserépigény ráhagyással"], "1163–1264 db");
assert.ok(!("Vásárolandó teljes csomag/raklap" in roofOk), "Darabos módban a gyártói guard teszt sem írhat elő teljes raklapot");

console.log("Construction manufacturer guard audit OK: a végleges build-sorrendben a vakolat, hőszigetelés és tetőcserép csak explicit gyártói/rendszeradat-megerősítéssel ad rendelési becslést.");

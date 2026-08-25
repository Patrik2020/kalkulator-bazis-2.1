#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { transforms } = require("./apply-construction-model-upgrades.js");

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function huNumber(value) {
  const match = String(value).replace(/\u00a0/g, " ").match(/-?[0-9][0-9 .]*(?:,[0-9]+)?/);
  if (!match) return NaN;
  return Number(match[0].replace(/[ .]/g, "").replace(",", "."));
}

function close(actual, expected, tolerance = 1e-9, label = "érték") {
  assert.ok(Number.isFinite(actual), `${label}: nem véges`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
}

// A build-upgrade várható állapotát memóriában teszteljük: a teszt nem ír fájlt.
const simplePath = "js/simple-calculators.js";
const simpleSource = transforms[simplePath](read(simplePath));
const sandbox = { console, Intl, Math, Date, window: {}, document: { addEventListener() {} } };
vm.createContext(sandbox);
vm.runInContext(`${simpleSource}\nglobalThis.__CALCS__ = SIMPLE_CALCULATORS;`, sandbox, { filename: simplePath });
const calcs = sandbox.__CALCS__;
const run = (id, values) => Object.fromEntries(calcs[id].compute(values));

// Geometriai és csomagolási fallback modellek.
assert.equal(run("padlo-burkolat-kalkulator", { length: 5, width: 4, waste: 10, pack: 2.2 })["Szükséges csomag"], "10 csomag");
assert.equal(run("gipszkarton-kalkulator", { area: 20, layers: 2, waste: 10, board: 3 })["Szükséges lap"], "15 db");
assert.throws(() => run("gipszkarton-kalkulator", { area: 20, layers: 1.5, waste: 10, board: 3 }), /egész szám/);
assert.equal(run("tapeta-kalkulator", { perimeter: 10, height: 2.5, rollWidth: 0.5, rollLength: 10 })["Szükséges tekercs"], "5 db");
assert.throws(() => run("tapeta-kalkulator", { perimeter: 10, height: 3, rollWidth: 0.53, rollLength: 2.5 }), /rövidebb/);
assert.equal(run("vakolat-kalkulator", { area: 10, thickness: 10, consumption: 1.4, bag: 25 })["Szükséges zsák"], "6 zsák");
assert.equal(run("hoszigeteles-kalkulator", { area: 20, waste: 5, pack: 5 })["Szükséges csomag"], "5 csomag");
assert.equal(run("terkovezes-kalkulator", { length: 5, width: 4, pieces: 36, waste: 5 })["Szükséges térkő"], "756 db");
assert.equal(run("tetocserep-kalkulator", { area: 100, pieces: 10, waste: 8 })["Szükséges cserép"], "1080 db");

// Fugázóanyag: Mapei által publikált általános alak:
// (A+B)/(A*B) * C * D * K = kg/m². K termékfüggő, ezért szerkeszthető.
// https://www.mapei.com/docs/librariesprovider26/products-documents/1_2801_ultracolorplus__gb_f3ca3cd73f6341819d68bd1c6526a116.pdf
const grout16 = run("fuga-kalkulator", {
  area: 10, tileLength: 300, tileWidth: 300, joint: 3, depth: 10, densityFactor: 1.6, bag: 5,
});
close(huNumber(grout16["Becsült fugázóanyag"]), 3.2, 0.051, "fuga K=1.6");
assert.equal(grout16["Szükséges zsák"], "1 zsák");
const grout15 = run("fuga-kalkulator", {
  area: 10, tileLength: 300, tileWidth: 300, joint: 3, depth: 10, densityFactor: 1.5, bag: 2,
});
close(huNumber(grout15["Becsült fugázóanyag"]), 3.0, 0.051, "fuga K=1.5");
assert.equal(grout15["Szükséges zsák"], "2 zsák");

// A tényleges felhasználói, részletes construction-upgrade réteg külön védelme.
const advancedPath = "js/construction-upgrades.js";
const advanced = transforms[advancedPath](read(advancedPath));
assert.ok(advanced.includes('{ id: "layers", label: "Rétegek száma oldalanként", value: "1", options: [["1", "1 réteg"], ["2", "2 réteg"]] }'), "Advanced gipszkarton rétegválasztó eltért");
assert.ok(advanced.includes('if (netOneSide <= 0) throw new Error("A kivont felület nem lehet nagyobb a fal teljes felületénél.")'), "Advanced gipszkarton nyílászáró-védelem hiányzik");
assert.ok(advanced.includes('if (repeat > 0) cutLength = Math.ceil(cutLength / repeat) * repeat'), "Tapéta mintaismétlés-kerekítés eltért");
assert.ok(advanced.includes('if (stripsPerRoll < 1) throw new Error("A tekercs hossza nem elegendő egy teljes csíkhoz.")'), "Tapéta rövid tekercs védelme hiányzik");
assert.ok(advanced.includes('stripsWithWaste = ceil(strips * (1 + nonNegative(v.waste, "Ráhagyás") / 100)), rolls = ceil(stripsWithWaste / stripsPerRoll)'), "Tapéta ráhagyást a tekercsre kerekítés előtt kell alkalmazni");
// 3 szükséges csík, 4 csík/tekercs, 8% ráhagyás: ceil(3*1.08)=4 csík, továbbra is 1 tekercs.
assert.equal(Math.ceil(Math.ceil(3 * 1.08) / 4), 1, "Tapéta ráhagyási referencia");
assert.ok(advanced.includes('if (minC > maxC) throw new Error("A minimum kiadósság nem lehet nagyobb a maximumnál.")'), "Vakolat min/max védelem hiányzik");
assert.ok(advanced.includes('if (amin > amax || dmin > dmax) throw new Error("A minimum érték nem lehet nagyobb a maximumnál.")'), "Hőszigetelés min/max védelem hiányzik");
assert.ok(advanced.includes('if (openEdge > fullEdge) throw new Error("A nem szegélyezett oldalhossz nem lehet nagyobb a teljes kerületnél.")'), "Térkő lehetetlen nyitottél-védelem hiányzik");
assert.ok(advanced.includes('if (min > max) throw new Error("A minimum cserépigény nem lehet nagyobb a maximumnál.")'), "Tetőcserép min/max védelem hiányzik");
assert.ok(advanced.includes('if (!Number.isInteger(pack)) throw new Error("A csomag/raklap darabszáma egész szám legyen.")'), "Tetőcserép egész csomagdarabszám-védelem hiányzik");
assert.ok(advanced.includes('{ id: "density", label: "Fugázóanyag sűrűségi tényezője", value: 1.6, min: 0.1 }'), "Advanced fuga K/sűrűség mező hiányzik");
assert.ok(advanced.includes('{ id: "packSize", label: "Csomag mérete (kg)", value: 5, min: 0.1 }'), "Advanced fuga csomagméret mező hiányzik");
assert.ok(advanced.includes('if (fillRatio > 100) throw new Error("A fugamélység aránya legfeljebb 100% lehet.")'), "Advanced fuga 100%-os mélységi plafon hiányzik");
assert.ok(advanced.includes('const netKg = area * ((l + w) / (l * w)) * positive(v.jointWidth, "Fugaszélesség") * depth * positive(v.density, "Sűrűségi tényező")'), "Advanced fuga képlet eltért");
assert.ok(advanced.includes('if (skirtingExclude > fullPerimeter) throw new Error("A nem szegélyezett falszakasz nem lehet hosszabb a helyiség teljes kerületénél.")'), "Padló lehetetlen szegélykivonás-védelem hiányzik");
assert.ok(advanced.includes("Gyártói adatlap az elsődleges"), "Advanced építőipari módszertanból hiányzik a gyártói adat elsődlegessége");

// Festék: a kijelzett egész literes vásárlási ajánlás és a költség ugyanarra a mennyiségre épüljön.
const paintSource = read("js/epitoipari/festek-kalkulator.js");
assert.ok(paintSource.includes("!Number.isInteger(layers)"), "Festékréteg egész-szám validáció hiányzik");
assert.ok(paintSource.includes("if (openingsArea > wallArea)"), "Nyílászáró > falfelület validáció hiányzik");
assert.ok(paintSource.includes("const recommendedPaint =\n        Math.ceil(recommendedPaintRaw);"), "Javasolt festék egész literre kerekítése eltért");
assert.ok(paintSource.includes("recommendedPaint * paintPrice"), "Festékköltség nem a kijelzett vásárlási mennyiségből készül");

// Csempe: ajtófelület levonása és darabszám-felfelé kerekítés regresszióvédelme.
const tileSource = read("js/epitoipari/csempe.js");
assert.ok(tileSource.includes("const grossArea = 2 * (length + width) * height"), "Csempe falfelület képlet eltért");
assert.ok(tileSource.includes("const tileCount = Math.ceil(purchaseArea / tileArea)"), "Csempe darabszám kerekítés eltért");
assert.ok(tileSource.includes("doorArea >= grossArea"), "Csempe ajtófelület határvédelem hiányzik");

console.log("Construction domain audit OK: fallback + advanced geometria, tapéta/fuga, festék konzisztencia, csempe és gyártói feltételek.");

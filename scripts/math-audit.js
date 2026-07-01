#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "js", "simple-calculators.js");
const source = `${fs.readFileSync(sourcePath, "utf8")}\nglobalThis.__CALCS__ = SIMPLE_CALCULATORS;`;
const sandbox = {
  console,
  Intl,
  Math,
  Date,
  window: {},
  document: { addEventListener() {} },
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: sourcePath });
const calcs = sandbox.__CALCS__;

const results = [];
function run(id, values) {
  const rows = calcs[id].compute(values);
  return Object.fromEntries(rows);
}
function pass(id, fn) {
  try {
    fn();
    results.push({ id, status: "PASS" });
  } catch (error) {
    results.push({ id, status: "FAIL", error: error.message });
  }
}
function huNumber(value) {
  const match = String(value).replace(/\u00a0/g, " ").match(/-?[0-9][0-9 .]*(?:,[0-9]+)?/);
  if (!match) return NaN;
  return Number(match[0].replace(/[ .]/g, "").replace(",", "."));
}
function approx(actual, expected, tolerance = 1e-6) {
  assert.ok(Number.isFinite(actual), `Nem véges szám: ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

pass("padlo-burkolat-kalkulator", () => {
  const r = run("padlo-burkolat-kalkulator", { length: 5, width: 4, waste: 10, pack: 2.2 });
  assert.equal(r["Szükséges csomag"], "10 csomag");
});
pass("gipszkarton-kalkulator", () => assert.equal(run("gipszkarton-kalkulator", { area: 20, layers: 2, waste: 10, board: 3 })["Szükséges lap"], "15 db"));
pass("tapeta-kalkulator", () => assert.equal(run("tapeta-kalkulator", { perimeter: 10, height: 2.5, rollWidth: 0.5, rollLength: 10 })["Szükséges tekercs"], "5 db"));
pass("vakolat-kalkulator", () => assert.equal(run("vakolat-kalkulator", { area: 10, thickness: 10, consumption: 1.4, bag: 25 })["Szükséges zsák"], "6 zsák"));
pass("hoszigeteles-kalkulator", () => assert.equal(run("hoszigeteles-kalkulator", { area: 20, waste: 5, pack: 5 })["Szükséges csomag"], "5 csomag"));
pass("terkovezes-kalkulator", () => assert.equal(run("terkovezes-kalkulator", { length: 5, width: 4, pieces: 36, waste: 5 })["Szükséges térkő"], "756 db"));
pass("tetocserep-kalkulator", () => assert.equal(run("tetocserep-kalkulator", { area: 100, pieces: 10, waste: 8 })["Szükséges cserép"], "1080 db"));
pass("fuga-kalkulator", () => approx(huNumber(run("fuga-kalkulator", { area: 10, tileLength: 300, tileWidth: 300, joint: 3, depth: 8 })["Becsült fugázóanyag"]), 2.6, 0.06));
pass("vizfogyasztas-kalkulator", () => approx(huNumber(run("vizfogyasztas-kalkulator", { weight: 70, activity: 500 })["Becsült napi folyadék"]), 2.95, 0.001));
pass("pulzus-zona-kalkulator", () => assert.equal(run("pulzus-zona-kalkulator", { age: 40, rest: 60 })["60–70%-os Karvonen-zóna"], "132–144 bpm"));
pass("terhessegi-kalkulator", () => assert.match(run("terhessegi-kalkulator", { lmpDate: "2026-01-01", cycleLength: 28 })["Várható szülési dátum"], /2026.*10.*8/));
pass("idealis-testsuly-kalkulator", () => approx(huNumber(run("idealis-testsuly-kalkulator", { height: 177.4, gender: 2 })["Devine-képlet szerinti becslés"]), 72.6, 0.05));
pass("testzsir-kalkulator", () => {
  const value = huNumber(run("testzsir-kalkulator", { gender: 2, waist: 90, neck: 40, hip: 0, height: 180 })["Becsült testzsír"]);
  assert.ok(value > 15 && value < 22);
});
pass("makro-kalkulator", () => assert.equal(run("makro-kalkulator", { calories: 2000, protein: 30, fat: 25 })["Szénhidrát"], "225 g"));
pass("alvasciklus-kalkulator", () => assert.match(run("alvasciklus-kalkulator", { wakeHour: 7, wakeMinute: 0 })["6 ciklus lefekvés"], /21:45/));
// A megnevezés szándékosan részletesebb lett; a numerikus eredményt ellenőrizzük.
pass("bmr-kalkulator-numeric", () => approx(huNumber(run("bmr-kalkulator", { gender: 2, weight: 80, height: 180, age: 40 })["Becsült nyugalmi energiaigény"]), 1730, 0.1));
pass("derek-csipo-kalkulator", () => approx(huNumber(run("derek-csipo-kalkulator", { gender: 2, waist: 90, hip: 100 })["Derék-csípő arány"]), 0.9, 0.001));
pass("feherje-szukseglet-kalkulator", () => assert.equal(run("feherje-szukseglet-kalkulator", { weight: 80, factor: 1.6 })["Napi fehérjeigény"], "128 g"));
pass("ar-kedvezmeny-kalkulator", () => assert.equal(huNumber(run("ar-kedvezmeny-kalkulator", { price: 10000, discount: 20 })["Akciós ár"]), 8000));
pass("borravalo-kalkulator", () => assert.equal(huNumber(run("borravalo-kalkulator", { bill: 10000, tip: 10, people: 2 })["Egy főre"]), 5500));
pass("munkaido-kalkulator", () => approx(huNumber(run("munkaido-kalkulator", { days: 5, hours: 8, weeks: 4.33 })["Havi becsült munkaidő"]), 173.2, 0.01));
pass("eletkor-kalkulator", () => {
  const today = new Date();
  const birth = `${today.getFullYear() - 20}-01-01`;
  assert.match(run("eletkor-kalkulator", { birthDate: birth })["Pontos életkor"], /^20 év|^19 év/);
});
pass("datum-kulonbseg-kalkulator", () => {
  const r = run("datum-kulonbseg-kalkulator", { startDate: "2026-01-01", endDate: "2026-01-11", multiplier: 2.5 });
  assert.equal(r["Dátumok közötti különbség"], "10 nap");
  approx(huNumber(r["Napi értékkel szorozva"]), 25, 0.001);
});
pass("atlag-kalkulator", () => approx(huNumber(run("atlag-kalkulator", { sum: 10, count: 4 }).Átlag), 2.5, 0.001));
pass("egysegar-kalkulator", () => assert.equal(huNumber(run("egysegar-kalkulator", { price: 1500, quantity: 3, unit: 1 }).Egységár), 500));
pass("rezsi-megosztas-kalkulator", () => assert.equal(huNumber(run("rezsi-megosztas-kalkulator", { total: 30000, people: 3, extra: 2000 })["Saját fizetendő"]), 12000));
pass("oraber-kalkulator", () => assert.equal(huNumber(run("oraber-kalkulator", { salary: 348000, hours: 174 }).Órabér), 2000));
pass("arany-kalkulator", () => approx(huNumber(run("arany-kalkulator", { part: 1, whole: 4 }).Arány), 25, 0.001));
pass("uzemanyag-koltseg-kalkulator", () => assert.equal(huNumber(run("uzemanyag-koltseg-kalkulator", { distance: 100, consumption: 7, price: 600 })["Várható költség"]), 4200));
pass("auto-fogyasztas-kalkulator", () => approx(huNumber(run("auto-fogyasztas-kalkulator", { liters: 35, distance: 500 }).Átlagfogyasztás), 7, 0.001));
pass("hatotav-kalkulator", () => assert.equal(huNumber(run("hatotav-kalkulator", { fuel: 42, consumption: 7 })["Becsült hatótáv"]), 600));
pass("eves-auto-koltseg-kalkulator", () => assert.equal(huNumber(run("eves-auto-koltseg-kalkulator", { fuel: 600000, insurance: 100000, service: 120000, tax: 30000, other: 50000 })["Éves költség"]), 900000));
pass("auto-ertekvesztes-kalkulator", () => assert.equal(huNumber(run("auto-ertekvesztes-kalkulator", { price: 1000000, rate: 10, years: 2 })["Becsült érték"]), 810000));
pass("kilometerdij-kalkulator", () => assert.equal(huNumber(run("kilometerdij-kalkulator", { monthly: 100000, km: 1000 })["Költség kilométerenként"]), 100));
pass("co2-kibocsatas-kalkulator", () => approx(huNumber(run("co2-kibocsatas-kalkulator", { distance: 100, consumption: 7, factor: 2.31 })["Becsült CO2"]), 16.17, 0.001));
pass("tankolas-kalkulator", () => approx(huNumber(run("tankolas-kalkulator", { budget: 12000, price: 600 })["Tankolható mennyiség"]), 20, 0.001));
pass("gumi-meret-kalkulator", () => approx(huNumber(run("gumi-meret-kalkulator", { w1: 205, p1: 55, r1: 16, w2: 225, p2: 45, r2: 17 }).Eltérés), 0.38, 0.02));
pass("autopalyadij-kalkulator", () => assert.equal(huNumber(run("autopalyadij-kalkulator", { fee: 6400, people: 4 })["Egy főre jutó díj"]), 1600));
pass("utazasi-ido-kalkulator", () => assert.equal(run("utazasi-ido-kalkulator", { distance: 149, speed: 90, breaks: 0 })["Várható menetidő"], "1 óra 39 perc"));
pass("energia-atvalto-kalkulator", () => approx(huNumber(run("energia-atvalto-kalkulator", { value: 1, from: 4 }).Joule), 3600000, 0.1));
pass("nyomas-atvalto-kalkulator", () => approx(huNumber(run("nyomas-atvalto-kalkulator", { value: 1, from: 2 }).Pascal), 100000, 0.1));
pass("teljesitmeny-atvalto-kalkulator", () => approx(huNumber(run("teljesitmeny-atvalto-kalkulator", { value: 1, from: 3 }).Watt), 735.49875, 0.01));

// Regressziós határesetek
pass("regression-tapeta-too-short", () => assert.throws(() => run("tapeta-kalkulator", { perimeter: 10, height: 3, rollWidth: 0.53, rollLength: 2.5 })));
pass("regression-zero-divisions", () => {
  assert.throws(() => run("atlag-kalkulator", { sum: 10, count: 0 }));
  assert.throws(() => run("oraber-kalkulator", { salary: 100000, hours: 0 }));
  assert.throws(() => run("tankolas-kalkulator", { budget: 10000, price: 0 }));
});
pass("regression-macro-over-100", () => assert.throws(() => run("makro-kalkulator", { calories: 2000, protein: 80, fat: 30 })));
pass("regression-negative-unit-price", () => assert.throws(() => run("egysegar-kalkulator", { price: -1500, quantity: 3, unit: 1 })));
pass("regression-devine-min-height", () => assert.throws(() => run("idealis-testsuly-kalkulator", { height: 152.3, gender: 2 })));
pass("regression-travel-minute-normalization", () => assert.equal(run("utazasi-ido-kalkulator", { distance: 119.9, speed: 120, breaks: 0 })["Várható menetidő"], "1 óra 0 perc"));

const failed = results.filter((item) => item.status === "FAIL");
fs.writeFileSync(
  path.join(__dirname, "math-audit-results.json"),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    passed: results.length - failed.length,
    failed: failed.length,
    total: results.length,
    results,
  }, null, 2),
  "utf8"
);
console.log(`Simple calculator tests: ${results.length - failed.length}/${results.length} passed`);
for (const item of failed) console.error(`FAIL ${item.id}: ${item.error}`);
if (failed.length) process.exit(1);

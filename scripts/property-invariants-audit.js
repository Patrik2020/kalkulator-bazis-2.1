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
  assert.ok(calcs[id], `Hiányzó kalkulátor: ${id}`);
  return Object.fromEntries(calcs[id].compute(values));
}

function numberFrom(value) {
  const match = String(value ?? "")
    .replace(/\u00a0/g, " ")
    .match(/-?[0-9][0-9 .]*(?:,[0-9]+)?/);
  if (!match) return NaN;
  return Number(match[0].replace(/[ .]/g, "").replace(",", "."));
}

function numericRow(id, values, label) {
  const value = numberFrom(run(id, values)[label]);
  assert.ok(Number.isFinite(value), `${id}/${label}: nem numerikus eredmény`);
  return value;
}

function approx(actual, expected, tolerance = 1e-6) {
  assert.ok(Number.isFinite(actual), `Nem véges szám: ${actual}`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
}

function invariant(id, fn) {
  try {
    fn();
    results.push({ id, status: "PASS" });
  } catch (error) {
    results.push({ id, status: "FAIL", error: error.message });
  }
}

function durationMinutes(value) {
  const text = String(value ?? "");
  const hours = Number((text.match(/(\d+)\s*óra/) || [0, 0])[1]);
  const minutes = Number((text.match(/(\d+)\s*perc/) || [0, 0])[1]);
  return hours * 60 + minutes;
}

// Építőipar: lineáris skálázás és monotonitás.
invariant("floor-area-scales-linearly", () => {
  const a = numericRow("padlo-burkolat-kalkulator", { length: 5, width: 2, waste: 10, pack: 2.2 }, "Szükséges mennyiség ráhagyással");
  const b = numericRow("padlo-burkolat-kalkulator", { length: 10, width: 2, waste: 10, pack: 2.2 }, "Szükséges mennyiség ráhagyással");
  approx(b, a * 2, 0.01);
});

invariant("drywall-area-scales-linearly", () => {
  const a = numericRow("gipszkarton-kalkulator", { area: 10, layers: 2, waste: 10, board: 3 }, "Teljes számolt felület");
  const b = numericRow("gipszkarton-kalkulator", { area: 20, layers: 2, waste: 10, board: 3 }, "Teljes számolt felület");
  approx(b, a * 2, 0.01);
});

invariant("plaster-area-scales-linearly", () => {
  const a = numericRow("vakolat-kalkulator", { area: 10, thickness: 10, consumption: 1.4, bag: 25 }, "Szükséges anyag");
  const b = numericRow("vakolat-kalkulator", { area: 20, thickness: 10, consumption: 1.4, bag: 25 }, "Szükséges anyag");
  approx(b, a * 2, 0.01);
});

invariant("insulation-waste-is-monotonic", () => {
  const low = numericRow("hoszigeteles-kalkulator", { area: 30, waste: 0, pack: 5 }, "Szükséges szigetelés");
  const high = numericRow("hoszigeteles-kalkulator", { area: 30, waste: 15, pack: 5 }, "Szükséges szigetelés");
  assert.ok(high > low, `${high} nem nagyobb mint ${low}`);
});

invariant("paving-area-increase-never-reduces-pieces", () => {
  const a = numericRow("terkovezes-kalkulator", { length: 5, width: 4, pieces: 36, waste: 5 }, "Szükséges térkő");
  const b = numericRow("terkovezes-kalkulator", { length: 6, width: 4, pieces: 36, waste: 5 }, "Szükséges térkő");
  assert.ok(b > a, `${b} nem nagyobb mint ${a}`);
});

invariant("roof-area-scales-linearly", () => {
  const a = numericRow("tetocserep-kalkulator", { area: 50, pieces: 10, waste: 0 }, "Szükséges cserép");
  const b = numericRow("tetocserep-kalkulator", { area: 100, pieces: 10, waste: 0 }, "Szükséges cserép");
  assert.equal(b, a * 2);
});

invariant("grout-area-scales-linearly", () => {
  const a = numericRow("fuga-kalkulator", { area: 10, tileLength: 300, tileWidth: 300, joint: 3, depth: 8 }, "Becsült fugázóanyag");
  const b = numericRow("fuga-kalkulator", { area: 20, tileLength: 300, tileWidth: 300, joint: 3, depth: 8 }, "Becsült fugázóanyag");
  approx(b, a * 2, 0.11);
});

// Egészség/sport: ismert képletek iránya és skálázása.
invariant("water-weight-adds-35ml-per-kg", () => {
  const a = numericRow("vizfogyasztas-kalkulator", { weight: 70, activity: 0 }, "Becsült napi folyadék");
  const b = numericRow("vizfogyasztas-kalkulator", { weight: 80, activity: 0 }, "Becsült napi folyadék");
  approx(b - a, 0.35, 0.001);
});

invariant("karvonen-max-heart-rate-decreases-with-age", () => {
  const younger = numericRow("pulzus-zona-kalkulator", { age: 30, rest: 60 }, "Becsült max pulzus");
  const older = numericRow("pulzus-zona-kalkulator", { age: 40, rest: 60 }, "Becsült max pulzus");
  assert.equal(younger - older, 10);
});

invariant("devine-one-inch-adds-2_3kg", () => {
  const a = numericRow("idealis-testsuly-kalkulator", { height: 177.8, gender: 2 }, "Devine-képlet szerinti becslés");
  const b = numericRow("idealis-testsuly-kalkulator", { height: 180.34, gender: 2 }, "Devine-képlet szerinti becslés");
  approx(b - a, 2.3, 0.11);
});

invariant("body-fat-increases-with-waist-all-else-equal", () => {
  const a = numericRow("testzsir-kalkulator", { gender: 2, waist: 85, neck: 40, hip: 0, height: 180 }, "Becsült testzsír");
  const b = numericRow("testzsir-kalkulator", { gender: 2, waist: 95, neck: 40, hip: 0, height: 180 }, "Becsült testzsír");
  assert.ok(b > a, `${b} nem nagyobb mint ${a}`);
});

invariant("macro-grams-scale-with-calories", () => {
  const a = numericRow("makro-kalkulator", { calories: 2000, protein: 30, fat: 25 }, "Szénhidrát");
  const b = numericRow("makro-kalkulator", { calories: 4000, protein: 30, fat: 25 }, "Szénhidrát");
  assert.equal(b, a * 2);
});

invariant("bmr-increases-with-body-weight", () => {
  const a = numericRow("bmr-kalkulator", { gender: 2, weight: 70, height: 180, age: 40 }, "Becsült nyugalmi energiaigény");
  const b = numericRow("bmr-kalkulator", { gender: 2, weight: 80, height: 180, age: 40 }, "Becsült nyugalmi energiaigény");
  assert.ok(b > a, `${b} nem nagyobb mint ${a}`);
});

invariant("waist-hip-ratio-increases-with-waist", () => {
  const a = numericRow("derek-csipo-kalkulator", { gender: 2, waist: 80, hip: 100 }, "Derék-csípő arány");
  const b = numericRow("derek-csipo-kalkulator", { gender: 2, waist: 90, hip: 100 }, "Derék-csípő arány");
  assert.ok(b > a, `${b} nem nagyobb mint ${a}`);
});

invariant("protein-scales-with-weight", () => {
  const a = numericRow("feherje-szukseglet-kalkulator", { weight: 50, factor: 1.6 }, "Napi fehérjeigény");
  const b = numericRow("feherje-szukseglet-kalkulator", { weight: 100, factor: 1.6 }, "Napi fehérjeigény");
  assert.equal(b, a * 2);
});

// Mindennapi/pénzügyi alapszámítások.
invariant("discount-boundaries", () => {
  const original = numericRow("ar-kedvezmeny-kalkulator", { price: 10000, discount: 0 }, "Akciós ár");
  const free = numericRow("ar-kedvezmeny-kalkulator", { price: 10000, discount: 100 }, "Akciós ár");
  assert.equal(original, 10000);
  assert.equal(free, 0);
});

invariant("tip-increases-total-per-person", () => {
  const noTip = numericRow("borravalo-kalkulator", { bill: 12000, tip: 0, people: 3 }, "Egy főre");
  const tip = numericRow("borravalo-kalkulator", { bill: 12000, tip: 15, people: 3 }, "Egy főre");
  assert.ok(tip > noTip, `${tip} nem nagyobb mint ${noTip}`);
});

invariant("average-is-linear-in-sum", () => {
  const a = numericRow("atlag-kalkulator", { sum: 10, count: 4 }, "Átlag");
  const b = numericRow("atlag-kalkulator", { sum: 20, count: 4 }, "Átlag");
  approx(b, a * 2, 0.001);
});

invariant("unit-price-is-linear-in-price", () => {
  const a = numericRow("egysegar-kalkulator", { price: 1500, quantity: 3, unit: 1 }, "Egységár");
  const b = numericRow("egysegar-kalkulator", { price: 3000, quantity: 3, unit: 1 }, "Egységár");
  assert.equal(b, a * 2);
});

invariant("hourly-wage-is-linear-in-salary", () => {
  const a = numericRow("oraber-kalkulator", { salary: 300000, hours: 150 }, "Órabér");
  const b = numericRow("oraber-kalkulator", { salary: 600000, hours: 150 }, "Órabér");
  assert.equal(b, a * 2);
});

invariant("ratio-is-linear-in-part", () => {
  const a = numericRow("arany-kalkulator", { part: 1, whole: 4 }, "Arány");
  const b = numericRow("arany-kalkulator", { part: 2, whole: 4 }, "Arány");
  approx(b, a * 2, 0.001);
});

// Autó: arányok, monotonitás és fizikai összefüggések.
invariant("fuel-cost-scales-with-distance", () => {
  const a = numericRow("uzemanyag-koltseg-kalkulator", { distance: 100, consumption: 7, price: 600 }, "Várható költség");
  const b = numericRow("uzemanyag-koltseg-kalkulator", { distance: 200, consumption: 7, price: 600 }, "Várható költség");
  assert.equal(b, a * 2);
});

invariant("consumption-ratio-is-scale-invariant", () => {
  const a = numericRow("auto-fogyasztas-kalkulator", { liters: 35, distance: 500 }, "Átlagfogyasztás");
  const b = numericRow("auto-fogyasztas-kalkulator", { liters: 70, distance: 1000 }, "Átlagfogyasztás");
  approx(b, a, 0.001);
});

invariant("range-doubles-with-fuel", () => {
  const a = numericRow("hatotav-kalkulator", { fuel: 35, consumption: 7 }, "Becsült hatótáv");
  const b = numericRow("hatotav-kalkulator", { fuel: 70, consumption: 7 }, "Becsült hatótáv");
  assert.equal(b, a * 2);
});

invariant("range-halves-with-double-consumption", () => {
  const a = numericRow("hatotav-kalkulator", { fuel: 42, consumption: 7 }, "Becsült hatótáv");
  const b = numericRow("hatotav-kalkulator", { fuel: 42, consumption: 14 }, "Becsült hatótáv");
  approx(b, a / 2, 0.01);
});

invariant("annual-car-cost-is-additive", () => {
  const base = numericRow("eves-auto-koltseg-kalkulator", { fuel: 0, insurance: 0, service: 0, tax: 0, other: 0 }, "Éves költség");
  const withService = numericRow("eves-auto-koltseg-kalkulator", { fuel: 0, insurance: 0, service: 120000, tax: 0, other: 0 }, "Éves költség");
  assert.equal(base, 0);
  assert.equal(withService, 120000);
});

invariant("depreciation-never-increases-with-years", () => {
  const year1 = numericRow("auto-ertekvesztes-kalkulator", { price: 5000000, rate: 10, years: 1 }, "Becsült érték");
  const year5 = numericRow("auto-ertekvesztes-kalkulator", { price: 5000000, rate: 10, years: 5 }, "Becsült érték");
  assert.ok(year5 < year1, `${year5} nem kisebb mint ${year1}`);
});

invariant("km-cost-is-linear-in-monthly-cost", () => {
  const a = numericRow("kilometerdij-kalkulator", { monthly: 100000, km: 1000 }, "Költség kilométerenként");
  const b = numericRow("kilometerdij-kalkulator", { monthly: 200000, km: 1000 }, "Költség kilométerenként");
  assert.equal(b, a * 2);
});

invariant("co2-scales-with-distance", () => {
  const a = numericRow("co2-kibocsatas-kalkulator", { distance: 100, consumption: 7, factor: 2.31 }, "Becsült CO2");
  const b = numericRow("co2-kibocsatas-kalkulator", { distance: 200, consumption: 7, factor: 2.31 }, "Becsült CO2");
  approx(b, a * 2, 0.01);
});

invariant("refuel-volume-scales-with-budget", () => {
  const a = numericRow("tankolas-kalkulator", { budget: 12000, price: 600 }, "Tankolható mennyiség");
  const b = numericRow("tankolas-kalkulator", { budget: 24000, price: 600 }, "Tankolható mennyiség");
  approx(b, a * 2, 0.001);
});

invariant("same-tire-size-has-zero-difference", () => {
  const result = numericRow("gumi-meret-kalkulator", { w1: 205, p1: 55, r1: 16, w2: 205, p2: 55, r2: 16 }, "Eltérés");
  approx(result, 0, 0.001);
});

invariant("motorway-fee-per-person-halves-when-people-double", () => {
  const a = numericRow("autopalyadij-kalkulator", { fee: 6400, people: 2 }, "Egy főre jutó díj");
  const b = numericRow("autopalyadij-kalkulator", { fee: 6400, people: 4 }, "Egy főre jutó díj");
  assert.equal(b, a / 2);
});

invariant("travel-time-decreases-with-speed", () => {
  const slow = durationMinutes(run("utazasi-ido-kalkulator", { distance: 180, speed: 60, breaks: 0 })["Várható menetidő"]);
  const fast = durationMinutes(run("utazasi-ido-kalkulator", { distance: 180, speed: 90, breaks: 0 })["Várható menetidő"]);
  assert.ok(fast < slow, `${fast} perc nem kisebb mint ${slow} perc`);
});

// Átváltók: lineáris skálázás. Ezek az SI-konverziók nem tartalmaznak offsetet.
for (const [id, from, label] of [
  ["energia-atvalto-kalkulator", 4, "Joule"],
  ["nyomas-atvalto-kalkulator", 2, "Pascal"],
  ["teljesitmeny-atvalto-kalkulator", 3, "Watt"],
]) {
  invariant(`${id}-linear-scaling`, () => {
    const a = numericRow(id, { value: 1, from }, label);
    const b = numericRow(id, { value: 2, from }, label);
    approx(b, a * 2, Math.max(0.01, Math.abs(a) * 1e-6));
  });
}

// Invalid tartományok: a compute ne csendben adjon értelmetlen számot.
invariant("invalid-zero-denominators-throw", () => {
  assert.throws(() => run("atlag-kalkulator", { sum: 10, count: 0 }));
  assert.throws(() => run("oraber-kalkulator", { salary: 300000, hours: 0 }));
  assert.throws(() => run("auto-fogyasztas-kalkulator", { liters: 30, distance: 0 }));
  assert.throws(() => run("hatotav-kalkulator", { fuel: 40, consumption: 0 }));
  assert.throws(() => run("tankolas-kalkulator", { budget: 10000, price: 0 }));
});

invariant("invalid-negative-physical-values-throw", () => {
  assert.throws(() => run("uzemanyag-koltseg-kalkulator", { distance: -100, consumption: 7, price: 600 }));
  assert.throws(() => run("vizfogyasztas-kalkulator", { weight: -70, activity: 0 }));
  assert.throws(() => run("feherje-szukseglet-kalkulator", { weight: -80, factor: 1.6 }));
  assert.throws(() => run("padlo-burkolat-kalkulator", { length: -5, width: 4, waste: 10, pack: 2.2 }));
});

const failed = results.filter((item) => item.status === "FAIL");
console.log(`Property/invariant tests: ${results.length - failed.length}/${results.length} passed`);
for (const item of failed) console.error(`FAIL ${item.id}: ${item.error}`);
if (failed.length) process.exit(1);

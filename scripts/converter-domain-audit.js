#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function close(actual, expected, tolerance = 1e-10, label = "érték") {
  assert.ok(Number.isFinite(actual), `${label}: nem véges (${actual})`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
}

function extractFactors(relativePath) {
  const source = read(relativePath);
  const match = source.match(/const\s+factors\s*=\s*\{([\s\S]*?)\};/);
  assert.ok(match, `${relativePath}: factors objektum nem található`);
  const sandbox = {};
  vm.createContext(sandbox);
  return vm.runInContext(`({${match[1]}})`, sandbox, { filename: relativePath });
}

function verifyFactorSet(relativePath, expected) {
  const actual = extractFactors(relativePath);
  assert.deepStrictEqual(Object.keys(actual).sort(), Object.keys(expected).sort(), `${relativePath}: egységkészlet eltért`);
  for (const [unit, factor] of Object.entries(expected)) {
    close(actual[unit], factor, Math.max(1e-12, Math.abs(factor) * 1e-12), `${relativePath}:${unit}`);
  }

  const values = [0, 1e-9, 0.125, 1, 123.456, 1e6];
  for (const [from, fromFactor] of Object.entries(actual)) {
    for (const [to, toFactor] of Object.entries(actual)) {
      for (const value of values) {
        const converted = value * fromFactor / toFactor;
        const roundTrip = converted * toFactor / fromFactor;
        close(roundTrip, value, Math.max(1e-10, Math.abs(value) * 1e-12), `${relativePath}:${from}->${to}->${from}`);
      }
    }
  }
}

verifyFactorSet("js/atvaltok/hosszusag.js", {
  mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
});
verifyFactorSet("js/atvaltok/tomeg.js", {
  mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.028349523125, lb: 0.45359237,
});
verifyFactorSet("js/atvaltok/terulet.js", {
  mm2: 0.000001, cm2: 0.0001, m2: 1, a: 100, ha: 10000, km2: 1000000, ft2: 0.09290304, in2: 0.00064516,
});
verifyFactorSet("js/atvaltok/terfogat.js", {
  ml: 0.001, cl: 0.01, dl: 0.1, l: 1, m3: 1000, gal: 3.785411784,
});
verifyFactorSet("js/atvaltok/ido.js", {
  sec: 1, min: 60, hour: 3600, day: 86400, week: 604800, month: 2629746, year: 31556952,
});
verifyFactorSet("js/atvaltok/sebesseg.js", {
  ms: 1, kmh: 1 / 3.6, mph: 0.44704, knot: 1852 / 3600,
});

// Kiemelt referenciaazonosságok.
close(1 * 1609.344 / 1000, 1.609344, 1e-12, "1 mile -> km");
close(1 * 0.45359237, 0.45359237, 1e-12, "1 lb -> kg");
close(1 * 10000, 10000, 1e-12, "1 ha -> m²");
close(1 * 3.785411784, 3.785411784, 1e-12, "1 US gal -> l");
close((100 * (1 / 3.6)), 27.77777777777778, 1e-12, "100 km/h -> m/s");
close(31556952 / 86400, 365.2425, 1e-12, "átlagos év napokban");
close(2629746 / 86400, 30.436875, 1e-12, "átlagos hónap napokban");

class FakeElement {
  constructor(value = "") { this.value = value; this.textContent = ""; this.listeners = {}; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  dispatch(type) { for (const fn of this.listeners[type] || []) fn({ target: this }); }
}

function temperatureHarness() {
  const ids = ["cfInput","cfResult","cfDirection","swapCF","ckInput","ckResult","ckDirection","swapCK","fkInput","fkResult","fkDirection","swapFK"];
  const elements = Object.fromEntries(ids.map((id) => [id, new FakeElement()]));
  const sandbox = { document: { getElementById: (id) => elements[id] }, Number, parseFloat, console };
  vm.createContext(sandbox);
  vm.runInContext(read("js/atvaltok/homerseklet.js"), sandbox, { filename: "homerseklet.js" });
  return elements;
}

const temp = temperatureHarness();
temp.cfInput.value = "0"; temp.cfInput.dispatch("input"); assert.match(temp.cfResult.textContent, /0\.00 °F|32\.00 °F/);
assert.match(temp.cfResult.textContent, /32\.00 °F/, "0 °C = 32 °F");
temp.cfInput.value = "100"; temp.cfInput.dispatch("input"); assert.match(temp.cfResult.textContent, /212\.00 °F/, "100 °C = 212 °F");
temp.swapCF.dispatch("click"); temp.cfInput.value = "32"; temp.cfInput.dispatch("input"); assert.match(temp.cfResult.textContent, /0\.00 °C/, "32 °F = 0 °C");
temp.cfInput.value = "-500"; temp.cfInput.dispatch("input"); assert.match(temp.cfResult.textContent, /abszolút nulla/, "abszolút nulla alatti Fahrenheit tiltás");

temp.ckInput.value = "-273.15"; temp.ckInput.dispatch("input"); assert.match(temp.ckResult.textContent, /0\.00 K/, "-273.15 °C = 0 K");
temp.ckInput.value = "-273.16"; temp.ckInput.dispatch("input"); assert.match(temp.ckResult.textContent, /abszolút nulla/, "abszolút nulla alatti Celsius tiltás");
temp.swapCK.dispatch("click"); temp.ckInput.value = "0"; temp.ckInput.dispatch("input"); assert.match(temp.ckResult.textContent, /-273\.15 °C/, "0 K = -273.15 °C");

temp.fkInput.value = "-459.67"; temp.fkInput.dispatch("input"); assert.match(temp.fkResult.textContent, /0\.00 K/, "-459.67 °F ≈ 0 K");
temp.fkInput.value = "-459.68"; temp.fkInput.dispatch("input"); assert.match(temp.fkResult.textContent, /abszolút nulla/, "abszolút nulla alatti F tiltás");

// Az új adatméret-kártyán a decimális és bináris prefixek külön vannak választva.
const autoSource = read("js/auto-converter-upgrades.js");
for (const token of ["KB (1000)", "MB (1000²)", "GB (1000³)", "KiB (1024)", "MiB (1024²)", "GiB (1024³)"]) {
  assert.ok(autoSource.includes(token), `Adatméret prefix elkülönítés hiányzik: ${token}`);
}
assert.ok(autoSource.includes("const m={KB:1e3,MB:1e6,GB:1e9,KiB:1024,MiB:1048576,GiB:1073741824}"), "Adatméret faktorok eltértek");
assert.ok(autoSource.includes("const m={J:1,kJ:1000,cal:4.184,kcal:4184,kWh:3600000}"), "Energia faktorok eltértek");
assert.ok(autoSource.includes("PS:735.49875,hp:745.699872"), "PS/hp teljesítményfaktorok eltértek");

console.log("Converter domain audit OK: faktorok, round-trip párok, hőmérséklet-határok és decimális/bináris egységek.");

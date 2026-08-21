const fs = require("fs");
const path = require("path");
const assert = require("assert");
const metadata = require("../js/expansion-batch-02-data.js");
const calculators = require("../js/expansion-batch-02-calculators.js");
const root = path.resolve(__dirname, "..");
const expected = [
  "kalkulatorok/mertani-atlag-kalkulator.html",
  "kalkulatorok/datum-hozzaadas-kivonas-kalkulator.html",
  "kalkulatorok/aljzatkiegyenlito-kalkulator.html",
  "kalkulatorok/fektav-kalkulator.html",
  "kalkulatorok/egyszeri-max-1rm-kalkulator.html"
];
assert.strictEqual(metadata.length, 5);
assert.deepStrictEqual(metadata.map((item) => item.url), expected);
for (const item of metadata) { const file = path.join(root, item.url); assert.ok(fs.existsSync(file), "Hiányzó kalkulátoroldal: " + item.url); const html = fs.readFileSync(file, "utf8"); assert.ok(html.includes("class=\"card card-calculator"), item.url + ": hiányzó statikus kalkulátorkártya"); assert.ok(html.includes("data-quality-upgrade=\"2026-08-21\""), item.url + ": hiányzó minőségi tartalomjelölő"); assert.ok(html.includes("expansion-batch-02-calculators.js"), item.url + ": hiányzó számítási modul"); }
const geo = calculators.mertaniAtlag([1,4]); assert.ok(Math.abs(geo.mean - 2) < 1e-12); assert.throws(() => calculators.mertaniAtlag([1,0]), /nagyobb nullánál|pozitív/);
const date = calculators.datumMuvelet("2026-08-21", 30, "add"); assert.strictEqual(date.iso, "2026-09-20"); assert.strictEqual(calculators.datumMuvelet("2026-08-21", 30, "subtract").iso, "2026-07-22");
const level = calculators.aljzatkiegyenlito(20,3,1.6,10,25); assert.ok(Math.abs(level.totalKg - 105.6) < 1e-9); assert.strictEqual(level.bags, 5);
const brake = calculators.fektav(50,1,0.7); assert.ok(Math.abs(brake.reactionDistance - 13.8888888889) < 1e-6); assert.ok(brake.totalDistance > brake.reactionDistance);
const rm = calculators.egyRm(80,5); assert.ok(Math.abs(rm.epley - 93.3333333333) < 1e-6); assert.ok(Math.abs(rm.brzycki - 90) < 1e-9); assert.throws(() => calculators.egyRm(80,13), /1 és 12/);
console.log("Expansion batch 02 audit OK: 5 új kalkulátor, fájlok és referencia-számítások ellenőrizve.");

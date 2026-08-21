const fs = require("fs");
const path = require("path");
const assert = require("assert");
const metadata = require("../js/expansion-batch-03-data.js");
const calculators = require("../js/expansion-batch-03-calculators.js");
const root = path.resolve(__dirname, "..");
const expected = [
  "kalkulatorok/sulyozott-atlag-kalkulator.html",
  "kalkulatorok/megtakaritasi-cel-kalkulator.html",
  "kalkulatorok/kerites-oszlop-kalkulator.html",
  "kalkulatorok/uzemanyagar-kulonbseg-kalkulator.html",
  "kalkulatorok/villanyfogyasztas-koltseg-kalkulator.html"
];
assert.strictEqual(metadata.length, 5);
assert.deepStrictEqual(metadata.map((item) => item.url), expected);
for (const item of metadata) { const file = path.join(root, item.url); assert.ok(fs.existsSync(file), "Hiányzó kalkulátoroldal: " + item.url); const html = fs.readFileSync(file, "utf8"); assert.ok(html.includes("class=\"card card-calculator"), item.url + ": hiányzó statikus kalkulátorkártya"); assert.ok(html.includes("data-quality-upgrade=\"2026-08-21\""), item.url + ": hiányzó minőségi tartalomjelölő"); assert.ok(html.includes("expansion-batch-03-calculators.js"), item.url + ": hiányzó számítási modul"); }
const weighted = calculators.sulyozottAtlag([80,95,70],[2,3,1]); assert.ok(Math.abs(weighted.mean - 515/6) < 1e-12); assert.strictEqual(weighted.weightSum, 6); assert.throws(() => calculators.sulyozottAtlag([1,2],[1]), /elemszáma/);
const goal = calculators.megtakaritasiCel(2000000,500000,100000,5); assert.strictEqual(goal.months, 15); assert.ok(Math.abs(goal.balance - 2074985.7678677074) < 0.01); assert.strictEqual(goal.contributions, 2000000);
const fence = calculators.keritesOszlop(20,2.5); assert.deepStrictEqual(fence, { bays: 8, posts: 9, actualSpacing: 2.5 });
const fuel = calculators.uzemanyagarKulonbseg(500,6.5,600,620); assert.ok(Math.abs(fuel.liters - 32.5) < 1e-12); assert.ok(Math.abs(fuel.difference - 650) < 1e-12);
const electric = calculators.villanyKoltseg(1500,2,30,70); assert.ok(Math.abs(electric.totalKwh - 90) < 1e-12); assert.ok(Math.abs(electric.totalCost - 6300) < 1e-12); assert.throws(() => calculators.villanyKoltseg(1000,25,30,70), /24 óra/);
console.log("Expansion batch 03 audit OK: 5 új kalkulátor, fájlok és referencia-számítások ellenőrizve.");

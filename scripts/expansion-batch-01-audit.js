const fs = require("fs");
const path = require("path");
const assert = require("assert");
const metadata = require("../js/expansion-batch-01-data.js");
const calculators = require("../js/expansion-batch-01-calculators.js");

const root = path.resolve(__dirname, "..");
const expectedUrls = [
  "kalkulatorok/harmasszabaly-kalkulator.html",
  "kalkulatorok/szazalekos-valtozas-kalkulator.html",
  "kalkulatorok/csemperagaszto-kalkulator.html",
  "kalkulatorok/ev-toltesi-koltseg-kalkulator.html",
  "kalkulatorok/futotempo-kalkulator.html",
];

assert.strictEqual(metadata.length, 5, "Az első bővítési csomag pontosan 5 kalkulátort tartalmazzon.");
assert.deepStrictEqual(metadata.map((item) => item.url), expectedUrls, "A csomag URL-listája eltér a várttól.");

for (const item of metadata) {
  const file = path.join(root, item.url);
  assert.ok(fs.existsSync(file), `Hiányzó kalkulátoroldal: ${item.url}`);
  const html = fs.readFileSync(file, "utf8");
  assert.ok(html.includes("class=\"card card-calculator"), `${item.url}: hiányzik a statikus kalkulátorkártya.`);
  assert.ok(html.includes("data-quality-upgrade=\"2026-08-21\""), `${item.url}: hiányzik az egyedi minőségi tartalomjelölő.`);
  assert.ok(html.includes("expansion-batch-01-calculators.js"), `${item.url}: hiányzik a számítási modul.`);
}

const rule = calculators.harmasszabaly(2, 5, 8);
assert.strictEqual(rule.x, 20);
assert.strictEqual(rule.multiplier, 4);
assert.throws(() => calculators.harmasszabaly(0, 5, 8), /nem lehet nulla/);

const increase = calculators.szazalekosValtozas(100, 125);
assert.strictEqual(increase.difference, 25);
assert.strictEqual(increase.percent, 25);
assert.strictEqual(increase.direction, "növekedés");
const decrease = calculators.szazalekosValtozas(100, 75);
assert.strictEqual(decrease.percent, -25);
assert.strictEqual(decrease.direction, "csökkenés");
assert.throws(() => calculators.szazalekosValtozas(0, 10), /nagyobb nullánál/);

const adhesive = calculators.csemperagaszto(20, 4, 10, 25);
assert.strictEqual(adhesive.baseKg, 80);
assert.ok(Math.abs(adhesive.totalKg - 88) < 1e-9);
assert.strictEqual(adhesive.bags, 4);

const ev = calculators.evToltesiKoltseg(100, 18, 70, 10);
assert.strictEqual(ev.vehicleKwh, 18);
assert.ok(Math.abs(ev.gridKwh - 20) < 1e-9);
assert.ok(Math.abs(ev.totalCost - 1400) < 1e-9);
assert.ok(Math.abs(ev.costPer100Km - 1400) < 1e-9);
assert.throws(() => calculators.evToltesiKoltseg(100, 18, 70, 100), /100%-nál kisebb/);

const pace = calculators.futotempo(10, 0, 50, 0);
assert.strictEqual(pace.paceSecondsPerKm, 300);
assert.strictEqual(pace.speedKmh, 12);
assert.strictEqual(calculators.formatPace(pace.paceSecondsPerKm), "5:00");
assert.strictEqual(calculators.formatDuration(pace.fiveKmSeconds), "25:00");
assert.strictEqual(calculators.formatDuration(pace.tenKmSeconds), "50:00");
assert.throws(() => calculators.futotempo(10, 0, 60, 0), /0–59/);

console.log("Expansion batch 01 audit OK: 5 új kalkulátor, fájlok és referencia-számítások ellenőrizve.");

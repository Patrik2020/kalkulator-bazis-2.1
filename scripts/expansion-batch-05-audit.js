const fs = require("fs");
const path = require("path");
const assert = require("assert");
const metadata = require("../js/expansion-batch-05-data.js");
const calculators = require("../js/expansion-batch-05-calculators.js");
const root = path.resolve(__dirname, "..");
const expected = [
  "kalkulatorok/munkanap-kalkulator.html",
  "kalkulatorok/tulora-kalkulator.html",
  "kalkulatorok/recept-adag-kalkulator.html",
  "kalkulatorok/vesztartalek-kalkulator.html",
  "kalkulatorok/fedezeti-pont-kalkulator.html",
  "kalkulatorok/zuzottko-kalkulator.html",
  "kalkulatorok/szegolec-kalkulator.html",
  "kalkulatorok/vizfogyasztas-koltseg-kalkulator.html"
];
assert.strictEqual(metadata.length, 8);
assert.deepStrictEqual(metadata.map((item) => item.url), expected);
for (const item of metadata) { const file = path.join(root, item.url); assert.ok(fs.existsSync(file), "Hiányzó kalkulátoroldal: " + item.url); const html = fs.readFileSync(file, "utf8"); assert.ok(html.includes("class=\"card card-calculator"), item.url + ": hiányzó statikus kalkulátorkártya"); assert.ok(html.includes("data-quality-upgrade=\"2026-08-21\""), item.url + ": hiányzó minőségi tartalomjelölő"); assert.ok(html.includes("expansion-batch-05-calculators.js"), item.url + ": hiányzó számítási modul"); }
const work=calculators.munkanapok("2026-08-24","2026-08-28",[]); assert.deepStrictEqual(work,{calendarDays:5,weekdays:5,excludedWeekdays:0,workdays:5}); assert.strictEqual(calculators.munkanapok("2026-08-24","2026-08-28",["2026-08-26"]).workdays,4);
const ot=calculators.tulora(3000,8,1.5); assert.strictEqual(ot.overtimeHourly,4500); assert.strictEqual(ot.totalPay,36000); assert.strictEqual(ot.premiumPart,12000);
const recipe=calculators.recept(4,6,"Liszt;500;g\nTej;300;ml\nTojás;2;db"); assert.strictEqual(recipe.factor,1.5); assert.strictEqual(recipe.ingredients[0].amount,750); assert.strictEqual(recipe.ingredients[2].amount,3);
const reserve=calculators.vesztartalek(350000,6,500000,100000); assert.strictEqual(reserve.target,2100000); assert.strictEqual(reserve.gap,1600000); assert.strictEqual(reserve.monthsNeeded,16);
const be=calculators.fedezetiPont(1000000,10000,6000); assert.strictEqual(be.contribution,4000); assert.strictEqual(be.units,250); assert.strictEqual(be.revenue,2500000); assert.throws(()=>calculators.fedezetiPont(1000,100,100),/nagyobb/);
const stone=calculators.zuzottko(40,8,1.6,10); assert.ok(Math.abs(stone.baseM3-3.2)<1e-12); assert.ok(Math.abs(stone.totalM3-3.52)<1e-12); assert.ok(Math.abs(stone.tons-5.632)<1e-12);
const skirt=calculators.szegolec(20,1,2.4,10); assert.ok(Math.abs(skirt.requiredLength-20.9)<1e-12); assert.strictEqual(skirt.pieces,9); assert.ok(Math.abs(skirt.purchasedLength-21.6)<1e-12);
const water=calculators.vizKoltseg(300,30,800,0); assert.strictEqual(water.liters,9000); assert.strictEqual(water.m3,9); assert.strictEqual(water.totalCost,7200);
console.log("Expansion batch 05 audit OK: 8 új kalkulátor, fájlok és referencia-számítások ellenőrizve. A katalogizált készlet eléri a 100-at.");

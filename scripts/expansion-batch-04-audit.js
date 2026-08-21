const fs=require("fs");
const path=require("path");
const assert=require("assert");
const metadata=require("../js/expansion-batch-04-data.js");
const calculators=require("../js/expansion-batch-04-calculators.js");
const root=path.resolve(__dirname,"..");
const expected=[
  "kalkulatorok/arres-kalkulator.html",
  "kalkulatorok/haszonkulcs-kalkulator.html",
  "kalkulatorok/hitel-elotorlesztes-kalkulator.html",
  "kalkulatorok/mulcs-kalkulator.html",
  "kalkulatorok/lepesszam-tavolsag-kalkulator.html"
];
assert.strictEqual(metadata.length,5);
assert.deepStrictEqual(metadata.map(i=>i.url),expected);
for(const item of metadata){const file=path.join(root,item.url);assert.ok(fs.existsSync(file),"Hiányzó kalkulátoroldal: "+item.url);const html=fs.readFileSync(file,"utf8");assert.ok(html.includes("class=\"card card-calculator"),item.url+": hiányzó statikus kalkulátorkártya");assert.ok(html.includes("data-quality-upgrade=\"2026-08-21\""),item.url+": hiányzó minőségi tartalomjelölő");assert.ok(html.includes("expansion-batch-04-calculators.js"),item.url+": hiányzó számítási modul");}
const m=calculators.arres(8000,10000);assert.strictEqual(m.margin,2000);assert.ok(Math.abs(m.marginPercent-20)<1e-12);assert.ok(Math.abs(m.markupPercent-25)<1e-12);
const h=calculators.haszonkulcs(8000,25);assert.ok(Math.abs(h.sellPrice-10000)<1e-12);assert.ok(Math.abs(h.marginPercent-20)<1e-12);
const p=calculators.elotorlesztes(10000000,6.5,120,2000000,1);assert.ok(Math.abs(p.oldPayment-113547.97722002666)<0.01);assert.ok(Math.abs(p.newPayment-90838.38177602131)<0.01);assert.ok(Math.abs(p.netSavings-705151.4532806408)<0.01);
const mu=calculators.mulcs(30,5,10,50);assert.ok(Math.abs(mu.totalLiters-1650)<1e-9);assert.strictEqual(mu.bags,33);
const s=calculators.lepestav(10000,75,110);assert.ok(Math.abs(s.distanceKm-7.5)<1e-12);assert.ok(Math.abs(s.minutes-90.9090909091)<1e-6);assert.ok(Math.abs(s.speedKmh-4.95)<1e-12);
console.log("Expansion batch 04 audit OK: 5 új kalkulátor, fájlok és referencia-számítások ellenőrizve.");

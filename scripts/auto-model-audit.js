const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { apply } = require("./apply-auto-model-upgrades");
const batch02 = require("../js/expansion-batch-02-calculators.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js", "auto-converter-upgrades.js"), "utf8");
const expected = apply(source);

function close(actual, wanted, tolerance = 1e-9, label = "érték") {
  assert.ok(Number.isFinite(actual), `${label}: nem véges eredmény`);
  assert.ok(Math.abs(actual - wanted) <= tolerance, `${label}: ${actual} != ${wanted}`);
}

// A dinamikus autós formok ne engedjenek nullával osztó vagy fizikailag értelmetlen alapmezőket.
assert.ok(expected.includes('{id:"km",label:"Éves futás (km)",value:15000,min:1}'), "Éves futás minimuma hiányzik");
assert.ok(expected.includes('{id:"passengers",label:"Fizető utasok száma",value:1,min:1,step:"1"}'), "Fizető utas minimuma hiányzik");
assert.ok(expected.includes('{id:"km",label:"Távolság (km)",value:100,min:0.01}'), "CO₂ távolság pozitív minimuma hiányzik");
assert.ok(expected.includes('{id:"electricShare",label:"PHEV elektromos használati arány (%)",value:50,min:0,max:100}'), "PHEV arány 0–100% korlátja hiányzik");
assert.ok(expected.includes('{id:"chargingLoss",label:"Töltési veszteség (%)",value:10,min:0,max:100}'), "Töltési veszteség 0–100% korlátja hiányzik");
assert.ok(expected.includes('if(s.max!==undefined)i.max=s.max'), "HTML max attribútum támogatás hiányzik");
assert.ok(expected.includes('/(?:NaN|Infinity)/.test(String(value))'), "Nem véges eredmény runtime védelme hiányzik");

// Üzemanyag- és költségalgebra.
const distance = 500;
const consumption = 6.5;
const price = 620;
const liters = distance * consumption / 100;
close(liters, 32.5, 1e-12, "500 km / 6,5 l/100km üzemanyag");
close(liters * price, 20_150, 1e-9, "500 km út üzemanyagköltsége");

// Gumiméret: átmérő és sebességarány.
function tyreDiameter(width, aspect, rimInch) {
  return 2 * width * aspect / 100 + rimInch * 25.4;
}
const oldDia = tyreDiameter(185, 60, 15);
const newDia = tyreDiameter(195, 55, 15);
close(oldDia, 603, 1e-12, "185/60 R15 átmérő");
close(newDia, 595.5, 1e-12, "195/55 R15 átmérő");
close((newDia / oldDia - 1) * 100, -1.243781094527363, 1e-12, "gumiméret százalékos eltérés");
close(100 * newDia / oldDia, 98.75621890547264, 1e-12, "100 km/h műszer mellett arányos sebesség");

// CO₂ modell: benzin és EV példa ugyanazzal a dokumentált rendszerhatárral.
const petrolQty = 100 * 6.5 / 100;
const petrolDirect = petrolQty * 2.31;
const petrolLifecycle = petrolDirect + petrolQty * 0.55;
close(petrolDirect, 15.015, 1e-12, "benzines közvetlen CO₂");
close(petrolLifecycle, 18.59, 1e-12, "benzines használati életciklus-becslés");
const evKwh = 100 * 18 / 100;
const evLifecycle = evKwh * 1.1 * 0.25;
close(evLifecycle, 4.95, 1e-12, "EV árammix + töltési veszteség");

// Féktáv: v²/(2μg), reakcióút v*t. Kétszeres sebességnél az elméleti fékút négyszereződik.
const brake50 = batch02.fektav(50, 1, 0.7);
const brake100 = batch02.fektav(100, 1, 0.7);
close(brake50.reactionDistance, 13.88888888888889, 1e-9, "50 km/h reakcióút");
close(brake100.reactionDistance, brake50.reactionDistance * 2, 1e-9, "reakcióút sebességarány");
close(brake100.brakingDistance, brake50.brakingDistance * 4, 1e-9, "fékút négyzetes sebességarány");
assert.ok(fs.readFileSync(path.join(root, "kalkulatorok", "fektav-kalkulator.html"), "utf8").includes("elméleti fékút"), "Féktáv nincs elméleti becslésként címkézve");

// Egyszerű runtime kalkulátorok alapképleteinek forrásőrei.
const simple = fs.readFileSync(path.join(root, "js", "simple-calculators.js"), "utf8");
assert.ok(simple.includes("v.liters/v.distance*100"), "Átlagfogyasztás képlete eltért");
assert.ok(simple.includes("v.fuel/v.consumption*100"), "Hatótáv képlete eltért");
assert.ok(simple.includes("v.distance*v.consumption/100*v.factor"), "Egyszerű CO₂ képlet eltért");

console.log("Auto model audit OK: üzemanyag, gumiméret, CO₂, féktáv és nullával-osztás edge-case védelem.");

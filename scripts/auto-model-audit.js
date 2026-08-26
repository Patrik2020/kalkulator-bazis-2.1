const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { apply, applyCo2Content } = require("./apply-auto-model-upgrades");
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
assert.ok(expected.includes('{id:"electricCons",label:"PHEV elektromos fogyasztás (kWh/100 km)",value:18,min:0'), "PHEV külön elektromos fogyasztási mező hiányzik");
assert.ok(expected.includes('label:"Hálózati többletfogyasztás töltés miatt (%)"'), "Töltési 10% szemantikája nincs egyértelműsítve");
assert.ok(expected.includes('if(s.max!==undefined)i.max=s.max'), "HTML max attribútum támogatás hiányzik");
assert.ok(expected.includes('/(?:NaN|Infinity)/.test(String(value))'), "Nem véges eredmény runtime védelme hiányzik");

// Üzemanyag- és költségalgebra.
const distance = 500;
const consumption = 6.5;
const price = 620;
const liters = distance * consumption / 100;
close(liters, 32.5, 1e-12, "500 km / 6,5 l/100km üzemanyag");
close(liters * price, 20_150, 1e-9, "500 km út üzemanyagköltsége");

// Gumiméret: tiszta geometriai arány, nem homologizációs vagy tényleges gördülési garancia.
function tyreDiameter(width, aspect, rimInch) {
  return 2 * width * aspect / 100 + rimInch * 25.4;
}
const oldDia = tyreDiameter(185, 60, 15);
const newDia = tyreDiameter(195, 55, 15);
close(oldDia, 603, 1e-12, "185/60 R15 átmérő");
close(newDia, 595.5, 1e-12, "195/55 R15 átmérő");
close((newDia / oldDia - 1) * 100, -1.243781094527363, 1e-12, "gumiméret százalékos eltérés");
close(100 * newDia / oldDia, 98.75621890547264, 1e-12, "100 km/h műszer mellett geometriai arány");
assert.ok(expected.includes('"Elméleti sebesség a geometriai arány alapján"'), "Gumiméret eredmény túl erős 'valós sebesség' állítást használ");
assert.ok(expected.includes('"Méreteltérés jelzés"'), "Gumiméret 2,5%-os határ ajánlásként van kommunikálva");

// CO₂ modell: benzines és EV példa ugyanazzal a dokumentált rendszerhatárral.
const petrolQty = 100 * 6.5 / 100;
const petrolDirect = petrolQty * 2.31;
const petrolSupply = petrolDirect + petrolQty * 0.55;
close(petrolDirect, 15.015, 1e-12, "benzines közvetlen CO₂");
close(petrolSupply, 18.59, 1e-12, "benzines közvetlen + energiaellátási becslés");
const evKwh = 100 * 18 / 100;
const evSupply = evKwh * 1.1 * 0.25;
close(evSupply, 4.95, 1e-12, "EV árammix + 10% hálózati többlet");

// PHEV: liter/100 km és kWh/100 km nem ugyanaz a mennyiség, ezért külön ág kell.
const phevKm = 100;
const electricShare = 0.5;
const phevFuelCons = 5;
const phevElectricCons = 18;
const phevFuelLiters = phevKm * (1 - electricShare) * phevFuelCons / 100;
const phevElectricKwh = phevKm * electricShare * phevElectricCons / 100;
close(phevFuelLiters, 2.5, 1e-12, "PHEV üzemanyag ág");
close(phevElectricKwh, 9, 1e-12, "PHEV elektromos ág");
const phevDirect = phevFuelLiters * 2.31;
const phevSupply = phevDirect + phevFuelLiters * 0.55 + phevElectricKwh * 1.1 * 0.25;
close(phevDirect, 5.775, 1e-12, "PHEV közvetlen CO₂");
close(phevSupply, 9.625, 1e-12, "PHEV külön liter+kWh energiaellátási becslés");
assert.ok(expected.includes('fuelLiters=km*(1-es)*cons/100,electricKwh=km*es*electricCons/100'), "PHEV runtime nem külön liter és kWh fogyasztást használ");
assert.ok(!expected.includes('qty*es*(1+n(v.chargingLoss)/100)*n(v.grid)'), "Régi dimenzióhibás PHEV formula bent maradt");

// A CO₂-oldal szövege és FAQ-ja ne mondjon ellent az EV/PHEV runtime-nak.
const co2Source = fs.readFileSync(path.join(root, "kalkulatorok", "co2-kibocsatas-kalkulator.html"), "utf8");
const co2Expected = applyCo2Content(co2Source);
assert.ok(co2Expected.includes("külön PHEV- és elektromos számítási ággal"), "CO₂ hero nem jelzi az új ágakat");
assert.ok(co2Expected.includes("PHEV-nél az elektromosan és belső égésű motorral megtett útrészt külön választjuk szét"), "CO₂ módszertan nem dokumentálja a PHEV két fogyasztását");
assert.ok(!co2Expected.includes("ezt ez a kalkulátor nem végzi el"), "CO₂ FAQ még azt állítja, hogy EV-t nem számol");
assert.ok(co2Expected.includes('datetime="2026-08-26"'), "CO₂ felülvizsgálati dátum nem frissült");

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

console.log("Auto model audit OK: üzemanyag, gumiméret, CO₂/PHEV, EV, féktáv és nullával-osztás edge-case védelem.");

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { transforms } = require("./apply-finance-deep-upgrades");

const root = path.resolve(__dirname, "..");
function transformed(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const transform = transforms[relativePath];
  return transform ? transform(source) : source;
}

const salaryClient = transformed("js/penzugyi/netto-brutto-shadow.js");
assert.ok(salaryClient.includes("Number.isInteger(value) && value >= 0 && value <= 20"), "A bérkalkulátor nem egész számként validálja az eltartottakat.");
assert.ok(salaryClient.includes("Az eltartottak száma 0 és 20 közötti egész szám legyen."), "A tört eltartottszámhoz nincs érthető validációs hiba.");
assert.ok(!salaryClient.includes("Number.parseInt(document.getElementById(id)?.value, 10)"), "A bérkalkulátor még csendben levágja a tört eltartottszámot.");

const salaryHtml = transformed("kalkulatorok/netto-brutto-kalkulator.html");
assert.ok(salaryHtml.includes('id="family-dependants" min="0" max="20" value="0" inputmode="numeric" step="1"'), "Eltartottak mező step=1 hiányzik.");
assert.ok(salaryHtml.includes('id="family-eligible" min="0" max="20" value="0" inputmode="numeric" step="1"'), "Kedvezményezett eltartottak mező step=1 hiányzik.");

const compound = transformed("js/penzugyi/kamatos-kamat.js");
assert.ok(compound.includes("yearValue > 100"), "Kamatos kamat 100 éves teljesítményvédelme hiányzik.");
assert.ok(compound.includes("months > 1200"), "Kamatos kamat havi iterációs korlátja hiányzik.");
const compoundHtml = transformed("kalkulatorok/kamatos-kamat-kalkulator.html");
assert.ok(compoundHtml.includes('id="years" placeholder="pl. 20" step="any" min="0.083333" max="100"'), "Kamatos kamat UI időtáv-korlát hiányzik.");

const affordability = transformed("kalkulatorok/hitelkepesseg-kalkulator.html");
assert.ok(affordability.includes("2026-os JTM háttér"), "2026-os JTM magyarázat hiányzik.");
assert.ok(affordability.includes("800 000 Ft/hó"), "2026-os 800 000 Ft-os JTM küszöb nincs dokumentálva.");
assert.ok(affordability.includes("50%" ) && affordability.includes("60%"), "A legalább 10 évre fixált HUF jelzáloghitel 50/60%-os főszabálya nincs dokumentálva.");
assert.ok(affordability.includes("Ez a kalkulátor ezeket nem számítja automatikusan."), "A 40%-os tervezési arány és a hivatalos JTM nincs elválasztva.");

const downPayment = transformed("kalkulatorok/lakas-hitel-onero-kalkulator.html");
assert.ok(downPayment.includes("Elsőlakás-vásárlói 90%-os HFM"), "Elsőlakásos HFM eligibility guidance hiányzik.");
assert.ok(downPayment.includes("korábban sem lehetett legalább 50%-os lakástulajdona"), "Az elsőlakás-vásárlói 50%-os tulajdoni feltétel nincs dokumentálva.");
assert.ok(downPayment.includes("több adósnál ezt mindegyiküknek teljesítenie kell"), "Több adós elsőlakás-feltétele hiányzik.");
assert.ok(downPayment.includes("már nincs életkori korlátja"), "Az eltörölt elsőlakás-vásárlói életkori korlát nincs tisztázva.");
assert.ok(downPayment.includes("nem automatikus banki finanszírozási ígéret"), "A 90%-os HFM szabályozói maximum jellege nincs tisztázva.");

console.log("Finance deep audit OK: bér inputok, kamatos kamat teljesítményguard, 2026 JTM és HFM guidance.");

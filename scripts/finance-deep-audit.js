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
assert.ok(compound.includes("if (!Number.isFinite(total))"), "Kamatos kamat nem véges eredmény guard hiányzik.");
assert.ok(compound.includes("A megadott adatokból nem számítható véges eredmény."), "Kamatos kamat véges eredmény hibaüzenet hiányzik.");
const compoundHtml = transformed("kalkulatorok/kamatos-kamat-kalkulator.html");
assert.ok(compoundHtml.includes('id="years" placeholder="pl. 20" step="any" min="0.083333" max="100"'), "Kamatos kamat UI időtáv-korlát hiányzik.");

const inflation = transformed("js/penzugyi/inflacio.js");
assert.ok(inflation.includes("if (!Number.isFinite(futurePurchasingPower))"), "Inflációs kalkulátor nem véges vásárlóerő guard hiányzik.");
assert.ok(inflation.includes("nem számítható véges vásárlóerő"), "Inflációs kalkulátor véges eredmény hibaüzenet hiányzik.");

const affordability = transformed("kalkulatorok/hitelkepesseg-kalkulator.html");
assert.ok(affordability.includes("2026-os JTM háttér"), "2026-os JTM magyarázat hiányzik.");
assert.ok(affordability.includes("800 000 Ft/hó"), "2026-os 800 000 Ft-os JTM küszöb nincs dokumentálva.");
assert.ok(affordability.includes("50%") && affordability.includes("60%"), "A legalább 10 évre fixált HUF jelzáloghitel 50/60%-os főszabálya nincs dokumentálva.");
assert.ok(affordability.includes("Ez a kalkulátor ezeket nem számítja automatikusan."), "A 40%-os tervezési arány és a hivatalos JTM nincs elválasztva.");

const downPayment = transformed("kalkulatorok/lakas-hitel-onero-kalkulator.html");
assert.ok(downPayment.includes("Elsőlakás-vásárlói 90%-os HFM"), "Elsőlakásos HFM eligibility guidance hiányzik.");
assert.ok(downPayment.includes("korábban sem lehetett legalább 50%-os lakástulajdona"), "Az elsőlakás-vásárlói 50%-os tulajdoni feltétel nincs dokumentálva.");
assert.ok(downPayment.includes("több adósnál ezt mindegyiküknek teljesítenie kell"), "Több adós elsőlakás-feltétele hiányzik.");
assert.ok(downPayment.includes("már nincs életkori korlátja"), "Az eltörölt elsőlakás-vásárlói életkori korlát nincs tisztázva.");
assert.ok(downPayment.includes("nem automatikus banki finanszírozási ígéret"), "A 90%-os HFM szabályozói maximum jellege nincs tisztázva.");

const financeQualityPath = path.join(root, "js/finance-quality-upgrades.js");
const rawFinanceQuality = fs.readFileSync(financeQualityPath, "utf8");
const financeQuality = transformed("js/finance-quality-upgrades.js");
assert.ok(financeQuality.includes('data-q="regulatory-loan"'), "A HFM fedezeti plafon nincs külön megjelenítve.");
assert.ok(financeQuality.includes("const regulatoryCap = estimated * hfm;"), "A HFM szabályozói plafon nincs a banki forgalmi értékből számolva.");
assert.ok(financeQuality.includes("const usableLoan = Math.min(price, regulatoryCap);"), "A vásárlási HFM widget vételár fölötti hitelt mutathat.");
assert.ok(financeQuality.includes("const cash = Math.max(0, price - usableLoan);"), "Az önerő nem a vételárhoz felhasználható hitelből számolódik.");
assert.ok(rawFinanceQuality.includes("const usableLoan = Math.min(price, regulatoryCap);"), "A HFM vételár-cap nincs fizikailag materializálva a runtime forrásba.");
const price = 50_000_000;
const regulatoryCap = 60_000_000 * 0.90;
const usableLoan = Math.min(price, regulatoryCap);
assert.equal(regulatoryCap, 54_000_000);
assert.equal(usableLoan, 50_000_000);
assert.equal(Math.max(0, price - usableLoan), 0);

const browserReferencePath = path.join(root, "scripts/reference-browser-audit.js");
const rawBrowserReference = fs.readFileSync(browserReferencePath, "utf8");
const browserReference = transformed("scripts/reference-browser-audit.js");
assert.ok(browserReference.includes("set('age', 18); const boundary = number('#result-calories') === 2208;"), "A kalória browser referencia nem a 18+ modell felnőtt alsó határát teszteli.");
assert.ok(browserReference.includes("set('age', 17); const invalid = text('#result-calories') === '–'"), "A kalória browser referencia nem utasítja el a 18 év alatti bemenetet.");
assert.ok(!browserReference.includes("set('age', 1); const boundary = number('#result-calories') === 2310;"), "A régi, gyerekre számoló kalória referencia bent maradt.");
assert.ok(rawBrowserReference.includes("set('age', 18); const boundary = number('#result-calories') === 2208;"), "A 18+ kalória referencia nincs fizikailag materializálva a browser audit forrásába.");

console.log("Finance deep audit OK: bér inputok, véges egyszerű pénzügyi eredmények, 2026 JTM/HFM, materializált HFM vételár-cap és 18+ kalória referencia.");

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { transforms } = require("./apply-auto-content-consistency");

const root = path.resolve(__dirname, "..");
function transformed(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  return transforms[relativePath](source);
}

const depreciation = transformed("kalkulatorok/auto-ertekvesztes-kalkulator.html");
assert.ok(depreciation.includes("külön rátát adhatsz meg az első vizsgált évre és a további évekre"), "Értékvesztés cikk nem írja le a két rátát");
assert.ok(depreciation.includes("mai vásárlóértéken"), "Értékvesztés cikk nem írja le a reálérték eredményt");
assert.ok(depreciation.includes("Igen. A szerkeszthető infláció/defláció mezőből"), "Értékvesztés FAQ még tagadja az inflációs számítást");
assert.ok(!depreciation.includes("Nem, azt külön kell figyelembe venni."), "Régi infláció FAQ-válasz bent maradt");
assert.ok(!depreciation.includes("A kalkulátor nominális forintértéket mutat."), "Régi csak-nominális állítás bent maradt");
assert.ok(depreciation.includes('datetime="2026-08-26"'), "Értékvesztés felülvizsgálati dátuma nem frissült");

const annual = transformed("kalkulatorok/eves-auto-koltseg-kalkulator.html");
assert.ok(annual.includes("külön mezőkből hozzáadja a biztosítás, adó és matrica, szerviz és javítás, gumi, parkolás és értékvesztés"), "Éves autóköltség cikk mezőlistája nem követi a runtime-ot");
assert.ok(annual.includes("gazdasági havi átlag"), "Éves autóköltség havi eredmény nincs gazdasági átlagként tisztázva");
assert.ok(annual.includes("nem azonos a tényleges havi cashflow-val"), "Éves autóköltség cashflow-korlát hiányzik");
assert.ok(!annual.includes("Az „egyéb” mezőbe kerülhet"), "Nem létező egyéb mezőre hivatkozó szöveg bent maradt");
assert.ok(annual.includes('datetime="2026-08-26"'), "Éves autóköltség felülvizsgálati dátuma nem frissült");

const kilometer = transformed("kalkulatorok/kilometerdij-kalkulator.html");
assert.ok(kilometer.includes("éves teljes autóköltség és az éves futás alapján"), "Kilométerdíj hero még havi modellt ír le");
assert.ok(kilometer.includes("Kilométerenkénti költség = éves teljes autóköltség ÷ éves futás."), "Kilométerdíj képletleírás nem követi az éves runtime-ot");
assert.ok(kilometer.includes("1 200 000 ÷ 15 000 = 80 Ft/km"), "Kilométerdíj példa nem az éves bemeneteket használja");
assert.ok(kilometer.includes("két fizető utasnál ez 8 000 Ft/fő"), "Kilométerdíj cikk nem tükrözi az utasszám eredményt");
assert.ok(kilometer.includes("Az éves becsült értékvesztést add hozzá az éves teljes autóköltséghez."), "Kilométerdíj FAQ még havi értékvesztés-kezelést ír");
assert.ok(!kilometer.includes("havi autóköltség ÷ havi megtett kilométer"), "Régi havi kilométerdíj-képlet bent maradt");
assert.ok(!kilometer.includes("Az éves becsült értékvesztést oszd tizenkettővel"), "Régi havi értékvesztés FAQ bent maradt");
assert.ok(kilometer.includes('datetime="2026-08-26"'), "Kilométerdíj felülvizsgálati dátuma nem frissült");

console.log("Auto content consistency audit OK: értékvesztés, éves autóköltség és kilométerdíj szövege követi a tényleges runtime-modellt.");
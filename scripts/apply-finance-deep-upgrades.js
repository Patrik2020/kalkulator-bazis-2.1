const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található pénzügyi deep-audit cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`Nem egyedi pénzügyi deep-audit cél: ${label}`);
  return source.replace(oldText, newText);
}

const transforms = {
  "js/penzugyi/netto-brutto-shadow.js": (source) => {
    let out = source;
    out = replaceExact(out,
      `  function parseCount(id) {\n    const value = Number.parseInt(document.getElementById(id)?.value, 10);\n    return Number.isFinite(value) ? Math.max(0, Math.min(20, value)) : 0;\n  }`,
      `  function parseCount(id) {\n    const raw = document.getElementById(id)?.value;\n    if (raw === undefined || raw === null || raw === "") return 0;\n    const value = Number(raw);\n    return Number.isInteger(value) && value >= 0 && value <= 20 ? value : null;\n  }`,
      "bérkalkulátor eltartottszám egész számként");
    out = replaceExact(out,
      `    const dependants = parseCount("family-dependants");\n    const eligibleDependants = parseCount("family-eligible");\n\n    if (eligibleDependants > dependants) {`,
      `    const dependants = parseCount("family-dependants");\n    const eligibleDependants = parseCount("family-eligible");\n\n    if (dependants === null || eligibleDependants === null) {\n      return { validationError: "Az eltartottak száma 0 és 20 közötti egész szám legyen." };\n    }\n\n    if (eligibleDependants > dependants) {`,
      "bérkalkulátor tört eltartott elutasítása");
    return out;
  },

  "kalkulatorok/netto-brutto-kalkulator.html": (source) => {
    let out = source;
    out = replaceExact(out,
      `<input type="number" id="family-dependants" min="0" max="20" value="0" inputmode="numeric" step="any">`,
      `<input type="number" id="family-dependants" min="0" max="20" value="0" inputmode="numeric" step="1">`,
      "eltartottak input step");
    out = replaceExact(out,
      `<input type="number" id="family-eligible" min="0" max="20" value="0" inputmode="numeric" step="any">`,
      `<input type="number" id="family-eligible" min="0" max="20" value="0" inputmode="numeric" step="1">`,
      "kedvezményezett eltartottak input step");
    return out;
  },

  "js/penzugyi/kamatos-kamat.js": (source) => replaceExact(source,
    `  if (principal < 0 || contribution < 0 || annualRate <= -100 || yearValue <= 0 || months <= 0 || (principal === 0 && contribution === 0)) {`,
    `  if (principal < 0 || contribution < 0 || annualRate <= -100 || yearValue <= 0 || yearValue > 100 || months <= 0 || months > 1200 || (principal === 0 && contribution === 0)) {`,
    "kamatos kamat időtáv teljesítményvédelme"),

  "kalkulatorok/kamatos-kamat-kalkulator.html": (source) => replaceExact(source,
    `<input type="number" id="years" placeholder="pl. 20" step="any" inputmode="decimal">`,
    `<input type="number" id="years" placeholder="pl. 20" step="any" min="0.083333" max="100" inputmode="decimal">`,
    "kamatos kamat időtáv UI-korlát"),

  "kalkulatorok/hitelkepesseg-kalkulator.html": (source) => replaceExact(source,
    `      <div class="info-box">\n        <strong>Fontos:</strong> Az eszköz egységes, 40%-os tervezési aránnyal számol. Ez nem azonos a mindenkor hatályos JTM-korláttal vagy egy bank hitelbírálatával.\n      </div>`,
    `      <div class="info-box">\n        <strong>Fontos:</strong> Az eszköz egységes, 40%-os tervezési aránnyal számol. Ez nem azonos a mindenkor hatályos JTM-korláttal vagy egy bank hitelbírálatával.\n      </div>\n\n      <div class="info-box">\n        <strong>2026-os JTM háttér:</strong> az MNB jövedelmi küszöbe 800 000 Ft/hó. A tényleges JTM-limit nem egyetlen százalék: függ a hitel típusától, kamatperiódusától és egyes zöld feltételektől. Például legalább 10 évre fixált vagy végig fix forint jelzáloghitelnél a főszabály szerinti korlát 800 000 Ft alatti jövedelemnél 50%, ettől a küszöbtől 60%; rövidebb kamatperiódusnál alacsonyabb limitek is alkalmazandók. Ez a kalkulátor ezeket nem számítja automatikusan. <a href="https://www.mnb.hu/penzugyi-stabilitas/makroprudencialis-politika/makroprudencialis-eszkoztar/adossagfek-szabalyok-hfm-jtm" target="_blank" rel="noopener noreferrer">MNB – HFM/JTM szabályok</a>.\n      </div>`,
    "2026 JTM tájékoztatás"),

  "kalkulatorok/lakas-hitel-onero-kalkulator.html": (source) => replaceExact(source,
    `      <p class="quality-sources">Forrás: <a href="https://www.mnb.hu/penzugyi-stabilitas/makroprudencialis-politika/makroprudencialis-eszkoztar/adossagfek-szabalyok-hfm-jtm" target="_blank" rel="noopener noreferrer">MNB – HFM/JTM szabályok</a>.</p>`,
    `      <div class="quality-note"><strong>Elsőlakás-vásárlói 90%-os HFM:</strong> a jelenlegi MNB-feltétel szerint az érintett adósnak jelenleg nem lehet, és korábban sem lehetett legalább 50%-os lakástulajdona; több adósnál ezt mindegyiküknek teljesítenie kell. A jogszabályon alapuló haszonélvezeti joggal terhelt korábbi vagy jelenlegi tulajdonra külön kivétel vonatkozhat. A kedvezménynek már nincs életkori korlátja. A 90% szabályozói maximum, nem automatikus banki finanszírozási ígéret.</div>\n      <p class="quality-sources">Forrás: <a href="https://www.mnb.hu/penzugyi-stabilitas/makroprudencialis-politika/makroprudencialis-eszkoztar/adossagfek-szabalyok-hfm-jtm" target="_blank" rel="noopener noreferrer">MNB – HFM/JTM szabályok</a>.</p>`,
    "elsőlakás HFM jogosultsági guidance"),
};

function applyFile(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = transform(source);
  if (transform(expected) !== expected) throw new Error(`Nem idempotens pénzügyi deep-upgrade: ${relativePath}`);
  if (!checkOnly && expected !== source) fs.writeFileSync(filePath, expected, "utf8");
  return expected !== source;
}

function run() {
  let changed = 0;
  for (const [relativePath, transform] of Object.entries(transforms)) {
    if (applyFile(relativePath, transform)) changed += 1;
  }
  console.log(checkOnly
    ? `Pénzügyi deep-audit transform OK: ${Object.keys(transforms).length} fájl, idempotens.`
    : `Pénzügyi deep-upgrade alkalmazva: ${changed}/${Object.keys(transforms).length} fájl.`);
}

if (require.main === module) run();
module.exports = { transforms, run };

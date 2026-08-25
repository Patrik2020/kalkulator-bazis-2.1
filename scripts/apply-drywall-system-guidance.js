const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const marker = "  const config = configs[slug]; if (!config) return;";

const upgrade = `  // KB_CONSTRUCTION:drywall-system-guidance:START
  const drywallConfig = configs["gipszkarton-kalkulator"];
  if (drywallConfig) {
    const layers = drywallConfig.fields.find((item) => item.id === "layers");
    if (layers) {
      layers.options = [["1", "1 réteg"], ["2", "2 réteg"], ["3", "3 réteg"]];
      layers.help = "A rétegrendet mindig a választott minősített rendszer szerint add meg.";
    }
    const stud = drywallConfig.fields.find((item) => item.id === "studSpacing");
    if (stud) {
      stud.label = "Példa CW profil tengelytáv (m)";
      stud.help = "A profilkiosztás rendszer-, lap- és terhelésfüggő; például 0,30 / 0,60 / 0,625 m is előfordulhat.";
    }
    const screws = drywallConfig.fields.find((item) => item.id === "screwsPerM2");
    if (screws) {
      screws.label = "Példa csavarigény (db/m²/réteg)";
      screws.help = "A tényleges csavartávolság és a rétegenkénti rögzítés a rendszerleírásból jön; a 20 db/m²/réteg csak kiinduló példa.";
    }
    const tape = drywallConfig.fields.find((item) => item.id === "tapePerM2");
    if (tape) {
      tape.label = "Példa hézagerősítő szalag (m/m²/réteg)";
      tape.help = "Nem minden belső réteg hézagolása és szalagozása azonos; ellenőrizd a rendszer előírását.";
    }
    const compound = drywallConfig.fields.find((item) => item.id === "compoundPerM2");
    if (compound) {
      compound.label = "Példa hézagoló/glett (kg/m²/réteg)";
      compound.help = "A gyártói anyagszükséglet lehet teljes rendszerre megadott kg/m² is; csak azonos vetítési alapú értéket használj itt.";
    }
    if (!drywallConfig.fields.some((item) => item.id === "systemConfirmed")) {
      drywallConfig.fields.push({
        id: "systemConfirmed",
        label: "Gipszkarton rendszer adatai ellenőrizve?",
        value: "no",
        options: [["no", "Nem – előbb ellenőrzöm a rendszerleírást"], ["yes", "Igen – a választott rendszer alapján"]],
      });
    }
    const baseCompute = drywallConfig.compute;
    drywallConfig.compute = (values) => {
      if (values.systemConfirmed !== "yes") throw new Error("A részletes anyagbecslés előtt ellenőrizd és erősítsd meg a választott gipszkarton rendszer rétegrendjét, profilkiosztását és fajlagos kiegészítőanyag-adatait.");
      return baseCompute(values);
    };
    drywallConfig.intro = "A lapgeometriát kiszámítja, a profil-, csavar-, szalag- és hézagolóanyag mennyiségét pedig csak a választott minősített rendszer ellenőrzött fajlagos adataival tekintsd rendelési becslésnek.";
  }
  // KB_CONSTRUCTION:drywall-system-guidance:END
`;

function transform(source) {
  if (source.includes("// KB_CONSTRUCTION:drywall-system-guidance:START")) return source;
  const index = source.indexOf(marker);
  if (index === -1) throw new Error("Nem található a gipszkarton rendszer-guidance beszúrási pontja.");
  if (source.indexOf(marker, index + marker.length) !== -1) throw new Error("Nem egyedi a gipszkarton rendszer-guidance beszúrási pontja.");
  return source.replace(marker, `${upgrade}\n${marker}`);
}

function run() {
  const relativePath = "js/construction-upgrades.js";
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = transform(source);
  if (transform(expected) !== expected) throw new Error("Nem idempotens gipszkarton rendszer-guidance.");
  if (!checkOnly && expected !== source) fs.writeFileSync(filePath, expected, "utf8");
  console.log(checkOnly ? "Gipszkarton rendszer-guidance audit OK: idempotens." : `Gipszkarton rendszer-guidance alkalmazva: ${expected === source ? 0 : 1}/1 fájl módosult.`);
}

if (require.main === module) run();
module.exports = { transform, run };

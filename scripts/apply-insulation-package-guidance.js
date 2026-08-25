const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const marker = "  const config = configs[slug]; if (!config) return;";

const upgrade = `  // KB_CONSTRUCTION:insulation-package-guidance:START
  const insulationConfig = configs["hoszigeteles-kalkulator"];
  if (insulationConfig) {
    const packField = insulationConfig.fields.find((item) => item.id === "packCoverage");
    if (packField) {
      packField.label = "Konkrét termék csomagfedése (m²/csomag)";
      packField.help = "A csomagfedés ugyanazon termékcsaládon belül is erősen változhat a lapvastagsággal. Másold be a kiválasztott vastagság csomagolási adatát; az 5 m² csak példa.";
    }
    insulationConfig.intro = "A nettó homlokzati felületből a konkrét termék csomagfedése és a választott hőszigetelő rendszer ragasztó-/dübeladatai alapján készít becslést. A lapvastagságból önmagában nem talál ki csomagméretet.";
  }
  // KB_CONSTRUCTION:insulation-package-guidance:END
`;

function transform(source) {
  if (source.includes("// KB_CONSTRUCTION:insulation-package-guidance:START")) return source;
  const index = source.indexOf(marker);
  if (index === -1) throw new Error("Nem található a hőszigetelés csomagfedés beszúrási pontja.");
  if (source.indexOf(marker, index + marker.length) !== -1) throw new Error("Nem egyedi a hőszigetelés csomagfedés beszúrási pontja.");
  return source.replace(marker, `${upgrade}\n${marker}`);
}

function run() {
  const relativePath = "js/construction-upgrades.js";
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = transform(source);
  if (transform(expected) !== expected) throw new Error("Nem idempotens hőszigetelés csomagfedés guidance.");
  if (!checkOnly && expected !== source) fs.writeFileSync(filePath, expected, "utf8");
  console.log(checkOnly ? "Hőszigetelés csomagfedés audit OK: idempotens." : `Hőszigetelés csomagfedés guidance alkalmazva: ${expected === source ? 0 : 1}/1 fájl módosult.`);
}

if (require.main === module) run();
module.exports = { transform, run };

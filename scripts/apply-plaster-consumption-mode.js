const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

const marker = "  const config = configs[slug]; if (!config) return;";
const upgrade = `  // KB_CONSTRUCTION:plaster-consumption-mode:START
  const plasterConfig = configs["vakolat-kalkulator"];
  if (plasterConfig) {
    const thicknessIndex = plasterConfig.fields.findIndex((item) => item.id === "thickness");
    if (thicknessIndex >= 0 && !plasterConfig.fields.some((item) => item.id === "consumptionMode")) {
      plasterConfig.fields.splice(thicknessIndex + 1, 0, {
        id: "consumptionMode",
        label: "Gyártói anyagszükséglet egysége",
        value: "per-mm",
        options: [
          ["per-mm", "kg/m²/mm – rétegvastagsággal szorzandó"],
          ["per-area", "kg/m² – közvetlen gyártói érték"],
        ],
      });
    }
    const minField = plasterConfig.fields.find((item) => item.id === "minConsumption");
    const maxField = plasterConfig.fields.find((item) => item.id === "maxConsumption");
    const thicknessField = plasterConfig.fields.find((item) => item.id === "thickness");
    if (minField) {
      minField.label = "Példa minimum anyagszükséglet";
      minField.help = "A számérték egységét a fenti mód határozza meg; írd át a kiválasztott termék adatlapja szerint.";
    }
    if (maxField) {
      maxField.label = "Példa maximum anyagszükséglet";
      maxField.help = "Ha az adatlap egyetlen értéket ad meg, a minimum és maximum legyen azonos.";
    }
    if (thicknessField) {
      thicknessField.help = "Csak a kg/m²/mm módban vesz részt az anyagigény számításában.";
    }
    const baseCompute = plasterConfig.compute;
    plasterConfig.compute = (values) => {
      const mode = values.consumptionMode || "per-mm";
      if (mode !== "per-mm" && mode !== "per-area") throw new Error("Ismeretlen vakolat-anyagszükséglet egység.");
      const rows = baseCompute(mode === "per-area" ? { ...values, thickness: 1 } : values);
      return [["Fogyási mód", mode === "per-area" ? "kg/m² – közvetlen gyártói érték" : "kg/m²/mm × rétegvastagság"], ...rows];
    };
    plasterConfig.intro = "A kalkulátor kezeli a kg/m²/mm és a közvetlen kg/m² gyártói adatokat is. Előbb válaszd ki az adatlap egységét, majd ellenőrizd a termék kiadósságát és kiszerelését.";
    plasterConfig.examples = [
      "Alap- vagy gipszvakolatnál gyakori a kg/m²/mm adat: ilyenkor a kalkulátor a megadott rétegvastagsággal is szoroz.",
      "Dekor- és vékonyvakolatnál gyakori a közvetlen kg/m² adat: ebben a módban a rétegvastagságot nem szorozzuk rá még egyszer.",
    ];
  }
  // KB_CONSTRUCTION:plaster-consumption-mode:END
`;

function transform(source) {
  if (source.includes("// KB_CONSTRUCTION:plaster-consumption-mode:START")) return source;
  const index = source.indexOf(marker);
  if (index === -1) throw new Error("Nem található a vakolat fogyási mód beszúrási pontja.");
  if (source.indexOf(marker, index + marker.length) !== -1) throw new Error("Nem egyedi a vakolat fogyási mód beszúrási pontja.");
  return source.replace(marker, `${upgrade}\n${marker}`);
}

function run() {
  const relativePath = "js/construction-upgrades.js";
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = transform(source);
  if (transform(expected) !== expected) throw new Error("Nem idempotens vakolat fogyási mód upgrade.");
  if (!checkOnly && expected !== source) fs.writeFileSync(filePath, expected, "utf8");
  console.log(checkOnly ? "Vakolat fogyási mód audit OK: idempotens." : `Vakolat fogyási mód alkalmazva: ${expected === source ? 0 : 1}/1 fájl módosult.`);
}

if (require.main === module) run();
module.exports = { transform, run };

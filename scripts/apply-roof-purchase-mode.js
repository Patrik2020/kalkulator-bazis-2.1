const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const marker = "  const config = configs[slug]; if (!config) return;";

const upgrade = `  // KB_CONSTRUCTION:roof-purchase-mode:START
  const roofConfig = configs["tetocserep-kalkulator"];
  if (roofConfig) {
    const packIndex = roofConfig.fields.findIndex((item) => item.id === "packSize");
    if (packIndex >= 0 && !roofConfig.fields.some((item) => item.id === "purchaseMode")) {
      roofConfig.fields.splice(packIndex + 1, 0, {
        id: "purchaseMode",
        label: "Értékesítési / rendelési egység",
        value: "pieces",
        options: [
          ["pieces", "Darabonként rendelhető – ne kerekíts raklapra"],
          ["whole-pack", "Csak teljes csomag/raklap – kerekíts felfelé"],
        ],
      });
    }
    const packField = roofConfig.fields.find((item) => item.id === "packSize");
    if (packField) {
      packField.label = "Példa csomag/raklap darabszáma";
      packField.help = "Darabonkénti rendelésnél opcionális, csak logisztikai tájékoztató; teljes csomag/raklap módban kötelező pozitív egész szám.";
    }
    const baseCompute = roofConfig.compute;
    roofConfig.compute = (values) => {
      const mode = values.purchaseMode || "pieces";
      if (mode !== "pieces" && mode !== "whole-pack") throw new Error("Ismeretlen tetőcserép rendelési mód.");

      const rawPack = String(values.packSize ?? "").trim().replace(",", ".");
      const pack = Number(rawPack);
      const packIsValid = rawPack !== "" && Number.isFinite(pack) && pack > 0 && Number.isInteger(pack);
      if (mode === "whole-pack" && !packIsValid) throw new Error("A teljes csomag/raklap módhoz a csomag darabszáma pozitív egész szám legyen.");

      // A régi számítási mag a csomagméretet akkor is validálja, amikor csak a cserépdarabszám kell.
      // Darabos módban ezért semleges 1-es belső értékkel futtatjuk; a Csomag/raklap sort alább eltávolítjuk.
      const rows = baseCompute({ ...values, packSize: packIsValid ? pack : 1 });
      const pieceRow = rows.find(([label]) => label === "Cserépigény ráhagyással");
      const match = String(pieceRow?.[1] || "").match(/([0-9]+)[^0-9]+([0-9]+)/);
      if (!match) return rows;
      const minPieces = Number(match[1]);
      const maxPieces = Number(match[2]);
      const withoutOldPack = rows.filter(([label]) => label !== "Csomag/raklap");

      if (mode === "whole-pack") {
        const minPacks = Math.ceil(minPieces / pack);
        const maxPacks = Math.ceil(maxPieces / pack);
        return [["Rendelési mód", "Csak teljes csomag/raklap"], ...withoutOldPack, ["Vásárolandó teljes csomag/raklap", \`\${minPacks}–\${maxPacks} db\`], ["Raklapra kerekített darabszám", \`\${minPacks * pack}–\${maxPacks * pack} db\`]];
      }

      const result = [["Rendelési mód", "Darabonként rendelhető"], ...withoutOldPack];
      if (packIsValid) {
        const minEq = minPieces / pack;
        const maxEq = maxPieces / pack;
        result.push(["Raklap-egyenérték (csak tájékoztató)", \`\${minEq.toLocaleString("hu-HU", { maximumFractionDigits: 2 })}–\${maxEq.toLocaleString("hu-HU", { maximumFractionDigits: 2 })}\`]);
      }
      return result;
    };
    roofConfig.intro = "A gyártói db/m² adatból darabszámot számol. Raklapra csak akkor kerekít felfelé, ha a kereskedő ténylegesen kizárólag teljes csomagban vagy raklapon értékesít.";
  }
  // KB_CONSTRUCTION:roof-purchase-mode:END
`;

function transform(source) {
  if (source.includes("// KB_CONSTRUCTION:roof-purchase-mode:START")) return source;
  const index = source.indexOf(marker);
  if (index === -1) throw new Error("Nem található a tetőcserép rendelési mód beszúrási pontja.");
  if (source.indexOf(marker, index + marker.length) !== -1) throw new Error("Nem egyedi a tetőcserép rendelési mód beszúrási pontja.");
  return source.replace(marker, `${upgrade}\n${marker}`);
}

function run() {
  const relativePath = "js/construction-upgrades.js";
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = transform(source);
  if (transform(expected) !== expected) throw new Error("Nem idempotens tetőcserép rendelési mód upgrade.");
  if (!checkOnly && expected !== source) fs.writeFileSync(filePath, expected, "utf8");
  console.log(checkOnly ? "Tetőcserép rendelési mód audit OK: idempotens." : `Tetőcserép rendelési mód alkalmazva: ${expected === source ? 0 : 1}/1 fájl módosult.`);
}

if (require.main === module) run();
module.exports = { transform, run };

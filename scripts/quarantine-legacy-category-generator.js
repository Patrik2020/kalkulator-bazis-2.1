const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const target = path.join(root, "scripts", "add-category-calculators.js");
const checkOnly = process.argv.includes("--check");

const anchor = 'const root = path.resolve(__dirname, "..");\n';
const guard = `\n// LEGACY GENERATOR: a jelenlegi kalkulátor-runtime azóta több szakmai és validációs\n// javítást kapott. Véletlen futtatása ezért visszaírhatna régi képleteket vagy mezőket.\n// Csak tudatos rekonstrukcióhoz engedélyezhető explicit környezeti változóval.\nif (process.env.KB_ALLOW_LEGACY_CATEGORY_GENERATOR !== "1") {\n  throw new Error(\n    "A régi kategória-kalkulátor generátor karanténban van. " +\n      "A jelenlegi js/simple-calculators.js az igazságforrás. " +\n      "Tudatos rekonstrukcióhoz állítsd a KB_ALLOW_LEGACY_CATEGORY_GENERATOR=1 változót."\n  );\n}\n`;

function apply(source) {
  if (source.includes("KB_ALLOW_LEGACY_CATEGORY_GENERATOR")) return source;
  if (!source.includes(anchor)) throw new Error("Nem található a legacy generátor beszúrási pontja.");
  return source.replace(anchor, anchor + guard);
}

const source = fs.readFileSync(target, "utf8");
const expected = apply(source);
if (apply(expected) !== expected) throw new Error("A legacy generátor karantén nem idempotens.");

if (!checkOnly && expected !== source) fs.writeFileSync(target, expected, "utf8");

console.log(
  checkOnly
    ? "Legacy category generator audit OK: karantén-transzformáció idempotens."
    : expected === source
      ? "Legacy category generator már karanténban van."
      : "Legacy category generator karantén alkalmazva."
);

module.exports = { apply };

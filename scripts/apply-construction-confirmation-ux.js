const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

const oldText = '  const collect = () => Object.fromEntries(new FormData(form).entries());\n  const run = () => { message.textContent = ""; try { renderResults(config.compute(collect()), result); } catch (error) { message.textContent = error instanceof Error ? error.message : "A számítás nem végezhető el."; } };';
const newText = '  const collect = () => Object.fromEntries(new FormData(form).entries());\n  const run = () => {\n    message.textContent = "";\n    const values = collect();\n    const confirmationNames = ["manufacturerConfirmed", "systemConfirmed"];\n    const pendingConfirmation = confirmationNames.some((name) => Object.prototype.hasOwnProperty.call(values, name) && values[name] !== "yes");\n    if (pendingConfirmation) {\n      result.innerHTML = "<p><strong>Gyártói/rendszeradat ellenőrzése szükséges.</strong><br>Írd át a példaértékeket a kiválasztott termék vagy rendszer adatai szerint, majd állítsd az ellenőrző mezőt Igenre. Addig nem készítünk rendelési mennyiséget.</p>";\n      return;\n    }\n    try { renderResults(config.compute(values), result); } catch (error) { message.textContent = error instanceof Error ? error.message : "A számítás nem végezhető el."; }\n  };';

function transform(source) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error("Nem található a construction confirmation UX célja.");
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error("Nem egyedi a construction confirmation UX célja.");
  return source.replace(oldText, newText);
}

function run() {
  const relativePath = "js/construction-upgrades.js";
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = transform(source);
  if (transform(expected) !== expected) throw new Error("Nem idempotens construction confirmation UX upgrade.");
  if (!checkOnly && expected !== source) fs.writeFileSync(filePath, expected, "utf8");
  console.log(checkOnly ? "Construction confirmation UX audit OK: idempotens." : `Construction confirmation UX alkalmazva: ${expected === source ? 0 : 1}/1 fájl módosult.`);
}

if (require.main === module) run();
module.exports = { transform, run };

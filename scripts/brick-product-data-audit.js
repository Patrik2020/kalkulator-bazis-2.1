const assert = require("assert");
const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(
  path.resolve(__dirname, "../js/epitoipari/tegla-kalkulator.js"),
  "utf8"
);

function productBlock(key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escaped}:\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, "m"));
  assert(match, `Hiányzó téglatípus: ${key}`);
  return match[1];
}

function materialNeed(key) {
  const block = productBlock(key);
  const match = block.match(/bricksPerM2:\s*([0-9.]+)/);
  assert(match, `Hiányzó bricksPerM2: ${key}`);
  return Number(match[1]);
}

// Gyártói műszaki adatok alapján rögzített fajlagos szükségletek.
// Forrásellenőrzés: Wienerberger Porotherm termékadatok / termékkatalógus, 2026-os audit.
assert.strictEqual(materialNeed("porotherm10"), 8, "Porotherm 10 N+F: 8 db/m² várt.");
assert.strictEqual(materialNeed("porotherm20"), 8, "Porotherm 20 N+F: 8 db/m² várt.");
assert.strictEqual(materialNeed("porotherm30"), 16, "Porotherm 30 N+F: 16 db/m² várt.");
assert.strictEqual(materialNeed("porotherm38"), 16, "Porotherm 38 N+F: 16 db/m² várt.");

const p20 = productBlock("porotherm20");
assert(/usage:\s*"20 cm vastag válaszfalak"/.test(p20), "Porotherm 20 N+F felhasználási leírása eltért a gyártói besorolástól.");

console.log("Tégla gyártói adat audit OK: 4 Porotherm fajlagos szükséglet + Porotherm 20 felhasználás.");

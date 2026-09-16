const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "js", "construction-upgrades.js");
const principle = "Gyártói adatlap az elsődleges.";

let source = fs.readFileSync(sourcePath, "utf8");
if (!source.includes(principle)) {
  const anchor = '<div class="notice-box"><strong>Ellenőrzési alap:</strong>';
  if (!source.includes(anchor)) {
    throw new Error("Az építőipari runtime ellenőrzési alap blokkja nem található.");
  }
  source = source.replace(
    anchor,
    `<div class="notice-box"><strong>${principle}</strong> <strong>Ellenőrzési alap:</strong>`
  );
  fs.writeFileSync(sourcePath, source, "utf8");
}

const slugs = [
  "gipszkarton-kalkulator",
  "tapeta-kalkulator",
  "vakolat-kalkulator",
  "hoszigeteles-kalkulator",
  "terkovezes-kalkulator",
  "tetocserep-kalkulator",
  "fuga-kalkulator",
  "padlo-burkolat-kalkulator",
];

let pagesUpdated = 0;
for (const slug of slugs) {
  const file = path.join(root, "kalkulatorok", `${slug}.html`);
  if (!fs.existsSync(file)) throw new Error(`Hiányzó építőipari oldal: ${slug}`);
  let html = fs.readFileSync(file, "utf8");
  const start = "<!-- KB_STATIC:construction-methodology:START -->";
  const end = "<!-- KB_STATIC:construction-methodology:END -->";
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end, startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Hiányzó construction-methodology marker: ${slug}`);
  }
  const blockEnd = endIndex + end.length;
  const before = html.slice(0, startIndex);
  let block = html.slice(startIndex, blockEnd);
  const after = html.slice(blockEnd);

  if (!block.includes(principle)) {
    const anchor = '<div class="notice-box"><strong>Ellenőrzési alap:</strong>';
    if (!block.includes(anchor)) {
      throw new Error(`Hiányzó ellenőrzési alap blokk: ${slug}`);
    }
    block = block.replace(
      anchor,
      `<div class="notice-box"><strong>${principle}</strong> <strong>Ellenőrzési alap:</strong>`
    );
    html = before + block + after;
    fs.writeFileSync(file, html, "utf8");
    pagesUpdated += 1;
  }
}

console.log(`Construction manufacturer-first safety rule applied; HTML pages updated: ${pagesUpdated}.`);

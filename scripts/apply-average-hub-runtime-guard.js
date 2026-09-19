const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "..", "js", "everyday-upgrades.js");
let source = fs.readFileSync(file, "utf8");

const marker = "// KB_PHASE2_BATCH2_AVERAGE_HUB_GUARD";
if (!source.includes(marker)) {
  const anchor = '  if (!supported.has(slug)) return;';
  if (!source.includes(anchor)) throw new Error("Nem található az everyday-upgrades támogatási kapuja.");
  source = source.replace(
    anchor,
    `${anchor}\n\n  ${marker}\n  if (slug === "atlag-kalkulator" && document.querySelector('[data-average-hub="true"]')) return;`
  );
}

fs.writeFileSync(file, source, "utf8");
console.log("Average hub runtime guard applied.");

"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const { detailPages } = require("./localization-manifest");
const root = path.resolve(__dirname, "..");

function inventory() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "js/site-data.js"), "utf8"), context);
  const entries = [...context.window.KB_DATA.calculators];
  for (let n = 1; n <= 5; n++) entries.push(...require(`../js/expansion-batch-0${n}-data`));
  const registry = new Map(entries.map(entry => [entry.url, entry]));
  const details = new Set(detailPages.map(page => page.path));
  return execFileSync("git", ["ls-files", "-z", "*.html"], { cwd: root, encoding: "utf8" })
    .split("\0").filter(file => file && !file.startsWith("components/") && !file.startsWith("docs/"))
    .sort().map(file => {
      const entry = registry.get(file);
      const calculator = file.startsWith("kalkulatorok/");
      const retired = entry?.hidden === true;
      const status = retired ? "retired-review" : details.has(file) ? "detail-reviewed" :
        file === "kalkulatorok/netto-brutto-kalkulator.html" ? "partial" : "content-review";
      return { path: file, category: entry?.category || (calculator ? "standalone" : "other"),
        type: calculator ? "calculator" : "other", retired, status };
    });
}

function report(pages) {
  const active = pages.filter(p => p.type === "calculator" && !p.retired);
  const reviewed = active.filter(p => p.status === "detail-reviewed");
  return "# Fordítási nyilvántartás\n\n" +
    "Generált lista: `node scripts/localization-inventory.js --write`. A CI ellenőrzi, hogy naprakész-e.\n\n" +
    `Aktív kalkulátor: **${active.length}**; részletes fordításon átesett: **${reviewed.length}**; hátralévő: **${active.length - reviewed.length}**.\n\n` +
    `Kivezetett kalkulátor: **${pages.filter(p => p.retired).length}**; egyéb oldal: **${pages.filter(p => p.type === "other").length}**.\n\n` +
    "A `detail-reviewed` a fő tartalom korábbi HU/EN/DE ellenőrzését jelöli. Nem jelent teljes SEO-fordítást vagy minden lehetséges interakció lefedését. A `partial` részleges fordítást, a `content-review` további tartalmi felmérést és fordítást jelent. A kivezetett oldalakhoz előbb tartalmi döntés szükséges.\n\n" +
    "| Oldal | Kategória | Állapot |\n| --- | --- | --- |\n" +
    pages.map(p => `| ${p.path} | ${p.category} | ${p.status} |`).join("\n") + "\n";
}

if (require.main === module) {
  const output = report(inventory());
  const target = path.join(root, "docs/localization-progress.md");
  if (process.argv.includes("--write")) fs.writeFileSync(target, output);
  else if (process.argv.includes("--check")) {
    if (!fs.existsSync(target) || fs.readFileSync(target, "utf8") !== output) {
      console.error("Stale localization inventory: run node scripts/localization-inventory.js --write");
      process.exitCode = 1;
    } else console.log("Localization inventory matches tracked pages and reviewed modules.");
  } else console.log(output);
}
module.exports = { inventory, report };

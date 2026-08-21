const fs = require("fs");
const path = require("path");

const file = path.resolve(__dirname, "apply-category-taxonomy.js");
let source = fs.readFileSync(file, "utf8");

const from = "    '<p class=\"home-hero-lead\">Több mint ${Math.floor(data.calculators.length / 10) * 10} magyar nyelvű kalkulátor mindennapi, pénzügyi, otthoni, autós, egészség- és mértékegység-számításokhoz, érthető magyarázatokkal.</p>'";
const to = "    `<p class=\"home-hero-lead\">Több mint ${Math.floor(data.calculators.length / 10) * 10} magyar nyelvű kalkulátor mindennapi, pénzügyi, otthoni, autós, egészség- és mértékegység-számításokhoz, érthető magyarázatokkal.</p>`";

if (source.includes(from)) {
  source = source.replace(from, to);
  fs.writeFileSync(file, source, "utf8");
}

console.log("A főoldali kalkulátorszám dinamikus megjelenítése rendben.");

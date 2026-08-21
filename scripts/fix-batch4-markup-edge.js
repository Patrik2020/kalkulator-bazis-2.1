const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function patch(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) return;
  let source = fs.readFileSync(target, "utf8");
  source = source
    .replace('if (rate < -100) throw new Error("A haszonkulcs nem lehet -100% alatt.");', 'if (rate <= -100) throw new Error("A haszonkulcs legyen nagyobb -100%-nál.");')
    .replace('például leárazás vagy veszteséges értékesítés modellezésére, de -100% alatt az eladási ár már negatív lenne, ezért azt nem engedjük.', 'például leárazás vagy veszteséges értékesítés modellezésére, de -100%-nál az eladási ár nulla lenne, alatta pedig negatív, ezért ezeket nem engedjük.')
    .replace('bags:Math.ceil(totalLiters / bagLiters)', 'bags:Math.ceil((totalLiters - 1e-9) / bagLiters)');
  fs.writeFileSync(target, source, "utf8");
}

patch("scripts/add-calculator-expansion-batch4.js");
patch("js/expansion-batch-04-calculators.js");
patch("kalkulatorok/haszonkulcs-kalkulator.html");

console.log("Batch 4 szélsőérték- és kerekítéskezelése javítva.");

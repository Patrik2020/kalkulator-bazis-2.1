const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function patch(file, replacements) {
  const target = path.join(root, file);
  let source = fs.readFileSync(target, "utf8");
  for (const [from, to] of replacements) source = source.split(from).join(to);
  fs.writeFileSync(target, source, "utf8");
}

const valueFixes = [
  ['["Brzycki becslés", "90,7 kg"]', '["Brzycki becslés", "90 kg"]'],
  ['["Átlagos becslés", "92 kg"]', '["Átlagos becslés", "91,7 kg"]'],
  ['["80% terhelés", "73,6 kg"]', '["80% terhelés", "73,3 kg"]'],
  ['a Brzycki képlet kb. 90,7 kg 1RM-et becsül. A kettő átlaga kb. 92 kg, ennek 80%-a körülbelül 73,6 kg.', 'a Brzycki képlet pontosan 90 kg 1RM-et becsül. A kettő átlaga kb. 91,7 kg, ennek 80%-a körülbelül 73,3 kg.'],
  ['assert.ok(rm.brzycki > 90 && rm.brzycki < 91);', 'assert.ok(Math.abs(rm.brzycki - 90) < 1e-9);'],
];

patch("scripts/add-calculator-expansion-batch2.js", valueFixes);
if (fs.existsSync(path.join(root, "kalkulatorok/egyszeri-max-1rm-kalkulator.html"))) {
  patch("kalkulatorok/egyszeri-max-1rm-kalkulator.html", valueFixes);
}
if (fs.existsSync(path.join(root, "scripts/expansion-batch-02-audit.js"))) {
  patch("scripts/expansion-batch-02-audit.js", valueFixes);
}

console.log("Batch 02 1RM referenciaértékek javítva.");

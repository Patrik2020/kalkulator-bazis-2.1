const fs = require("fs");
const path = require("path");

const target = path.resolve(__dirname, "add-calculator-expansion-final100.js");
let source = fs.readFileSync(target, "utf8");

source = source
  .replace(
    'throw new Error(`A(z) ${index+1}. sor formátuma hibás.`);',
    'throw new Error("A(z) " + (index + 1) + ". sor formátuma hibás.");'
  )
  .replace(
    'positive(amount, `${parts[0]} mennyisége`);',
    'positive(amount, parts[0] + " mennyisége");'
  );

fs.writeFileSync(target, source, "utf8");
console.log("Final 100 generator nested template literals javítva.");

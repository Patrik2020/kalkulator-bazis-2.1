const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található egészség-upgrade cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) {
    throw new Error(`Nem egyedi egészség-upgrade cél: ${label}`);
  }
  return source.replace(oldText, newText);
}

const transforms = {
  "js/simple-calculators.js": (source) => replaceExact(
    source,
    "compute(v) { requirePositive(v.weight, v.height, v.age); const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); if (bmr <= 0) throw new Error('A megadott adatokból nem adható életszerű becslés'); return [['Becsült nyugalmi energiaigény', Math.round(bmr)+' kcal/nap'], ['1,375-ös aktivitási szorzóval', Math.round(bmr*1.375)+' kcal/nap']]; }",
    "compute(v) { requirePositive(v.weight, v.height, v.age); if (v.age < 18) throw new Error('A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk'); const bmr=10*v.weight+6.25*v.height-5*v.age+(v.gender>=2?5:-161); if (bmr <= 0) throw new Error('A megadott adatokból nem adható életszerű becslés'); return [['Becsült nyugalmi energiaigény', Math.round(bmr)+' kcal/nap'], ['1,375-ös aktivitási szorzóval', Math.round(bmr*1.375)+' kcal/nap']]; }",
    "BMR felnőtt korhatár"
  ),
  "js/egeszseg/kaloria.js": (source) => {
    let output = replaceExact(
      source,
      "  if (\n    !Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(a) ||\n    !Number.isFinite(act) || w <= 0 || h <= 0 || a <= 0 || act <= 0\n  ) {\n    resultCalories.textContent = \"–\";\n    resultGoal.textContent = \"\";\n    return;\n  }",
      "  if (\n    !Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(a) ||\n    !Number.isFinite(act) || w <= 0 || h <= 0 || a <= 0 || act <= 0\n  ) {\n    resultCalories.textContent = \"–\";\n    resultGoal.textContent = \"\";\n    return;\n  }\n\n  if (a < 18) {\n    resultCalories.textContent = \"–\";\n    resultGoal.textContent = \"A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk.\";\n    return;\n  }",
      "kalória felnőtt korhatár"
    );

    output = replaceExact(
      output,
      "  resultGoal.textContent =\n    \"Fogyás: \" + Math.round(maintenance - 400) +\n    \" kcal | Tömegnövelés: \" + Math.round(maintenance + 400) + \" kcal\";",
      "  const lowerScenario = maintenance - 400;\n  const upperScenario = maintenance + 400;\n  resultGoal.textContent = lowerScenario > 0\n    ? \"Példa a fenntartó értékhez képest: -400 kcal → \" + Math.round(lowerScenario) +\n      \" kcal | +400 kcal → \" + Math.round(upperScenario) + \" kcal\"\n    : \"A -400 kcal-os példaforgatókönyv ennél a becslésnél nem értelmezhető. +400 kcal → \" +\n      Math.round(upperScenario) + \" kcal.\";",
      "kalória ±400 példaforgatókönyv"
    );
    return output;
  },
  "kalkulatorok/bmr-kalkulator.html": (source) => {
    let output = replaceExact(
      source,
      "BMR kalkulátor az alapanyagcsere becsléséhez életkor, nem, testsúly és magasság alapján. Az eredmény tájékoztató energiaszükséglet.",
      "BMR kalkulátor felnőtteknek az alapanyagcsere becsléséhez életkor, nem, testsúly és magasság alapján. Az eredmény tájékoztató energiaszükséglet.",
      "BMR meta leírás"
    );
    output = replaceExact(
      output,
      "<section class=\"hero\"><h1>BMR kalkulátor</h1><p>Számold ki az alapanyagcserédet Mifflin-St Jeor képlettel.</p></section>",
      "<section class=\"hero\"><h1>BMR kalkulátor</h1><p>Felnőtteknek készült becslés a Mifflin–St Jeor képlettel, testsúly, magasság, életkor és nem alapján.</p></section>",
      "BMR hero scope"
    );
    return output;
  },
  "kalkulatorok/kaloria-kalkulator.html": (source) => {
    let output = replaceExact(
      source,
      "Kalória kalkulátor napi energiaigény becsléséhez fogyáshoz, szintentartáshoz vagy tömegnöveléshez, módszertani magyarázattal és gyakorlati útmutatóval.",
      "Kalória kalkulátor felnőttek napi energiaigényének becsléséhez, szintentartási és szemléltető ±400 kcal forgatókönyvekkel, módszertani magyarázattal.",
      "kalória meta leírás"
    );
    output = replaceExact(
      output,
      "<section class=\"hero\"><h1>Kalória kalkulátor</h1><p>Számold ki a becsült napi energiaigényedet, és értsd meg, hogyan használd az eredményt.</p></section>",
      "<section class=\"hero\"><h1>Kalória kalkulátor</h1><p>Felnőtteknek készült becslés a napi energiaigényhez; a ±400 kcal értékek szemléltető forgatókönyvek, nem személyre szabott célok.</p></section>",
      "kalória hero scope"
    );
    output = replaceExact(
      output,
      "<input type=\"number\" id=\"age\" placeholder=\"pl. 30\" step=\"any\" inputmode=\"decimal\">",
      "<input type=\"number\" id=\"age\" placeholder=\"pl. 30\" min=\"18\" step=\"1\" inputmode=\"numeric\">",
      "kalória életkor input"
    );
    return output;
  },
};

let changed = 0;
for (const [relativePath, transform] of Object.entries(transforms)) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Hiányzó egészség-upgrade fájl: ${relativePath}`);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = transform(source);
  const secondPass = transform(expected);
  if (secondPass !== expected) throw new Error(`Nem idempotens egészség-upgrade: ${relativePath}`);

  if (checkOnly) continue;
  if (source !== expected) {
    fs.writeFileSync(filePath, expected);
    changed += 1;
  }
}

console.log(
  checkOnly
    ? `Egészség modell-upgrade audit OK: ${Object.keys(transforms).length} fájl, idempotens.`
    : `Egészség modell-upgrade alkalmazva: ${changed}/${Object.keys(transforms).length} fájl módosult.`
);

module.exports = { transforms };

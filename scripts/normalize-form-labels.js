const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });

const files = walk(root).filter((file) => {
  const name = path.relative(root, file).replace(/\\/g, "/");
  return name.endsWith(".html") && !name.startsWith("components/") && !name.startsWith("docs/");
});

const labelBeforeControl =
  /<label(?![^>]*\bfor=)([^>]*)>([^<]*)<\/label>(\s*)<((?:input|select|textarea)\b[^>]*\bid=["']([^"']+)["'][^>]*>)/gi;

const explicitLabels = {
  "adatmeret-atvalto-kalkulator.html": {
    inputValue: "Átváltandó adatmennyiség",
    fromUnit: "Kiinduló adatmértékegység",
    toUnit: "Cél adatmértékegység"
  },
  "deviza-atvalto-kalkulator.html": {
    inputValue: "Átváltandó összeg",
    fromCurrency: "Kiinduló pénznem",
    toCurrency: "Cél pénznem"
  },
  "homerseklet-atvalto-kalkulator.html": {
    cfInput: "Celsius érték Fahrenheit átváltáshoz",
    ckInput: "Celsius érték Kelvin átváltáshoz",
    fkInput: "Fahrenheit érték Kelvin átváltáshoz"
  },
  "hosszusag-atvalto-kalkulator.html": {
    inputValue: "Átváltandó hosszúság",
    fromUnit: "Kiinduló hosszúságegység",
    toUnit: "Cél hosszúságegység"
  },
  "ido-atvalto-kalkulator.html": {
    inputValue: "Átváltandó időtartam",
    fromUnit: "Kiinduló időegység",
    toUnit: "Cél időegység"
  },
  "sebesseg-atvalto-kalkulator.html": {
    inputValue: "Átváltandó sebesség",
    fromUnit: "Kiinduló sebességegység",
    toUnit: "Cél sebességegység"
  },
  "szazalek-kalkulator.html": {
    a: "Alapérték, amelynek a százalékát keresed",
    b: "Keresett százalék",
    c: "Részérték",
    d: "Teljes érték",
    e: "Eredeti érték",
    f: "Új érték"
  },
  "terfogat-atvalto-kalkulator.html": {
    inputValue: "Átváltandó térfogat",
    fromUnit: "Kiinduló térfogategység",
    toUnit: "Cél térfogategység"
  },
  "terulet-atvalto-kalkulator.html": {
    inputValue: "Átváltandó terület",
    fromUnit: "Kiinduló területegység",
    toUnit: "Cél területegység"
  },
  "tomeg-atvalto-kalkulator.html": {
    inputValue: "Átváltandó tömeg",
    fromUnit: "Kiinduló tömegegység",
    toUnit: "Cél tömegegység"
  }
};

const changedFiles = [];
let labelsConnected = 0;

files.forEach((file) => {
  const original = fs.readFileSync(file, "utf8");
  let updated = original.replace(
    labelBeforeControl,
    (match, attributes, labelText, whitespace, control, id) => {
      labelsConnected += 1;
      return `<label${attributes} for="${id}">${labelText}</label>${whitespace}<${control}`;
    }
  );

  const labelsForFile = explicitLabels[path.basename(file)] || {};
  Object.entries(labelsForFile).forEach(([id, label]) => {
    if (new RegExp(`<label\\b[^>]*\\bfor=["']${id}["']`, "i").test(updated)) return;
    const controlPattern = new RegExp(
      `(\\s*)(<(?:(?:input|select|textarea))\\b[^>]*\\bid=["']${id}["'][^>]*>)`,
      "i"
    );
    updated = updated.replace(
      controlPattern,
      `$1<label class="visually-hidden" for="${id}">${label}</label>$1$2`
    );
    labelsConnected += 1;
  });

  if (updated !== original) {
    fs.writeFileSync(file, updated, "utf8");
    changedFiles.push(path.relative(root, file).replace(/\\/g, "/"));
  }
});

console.log(JSON.stringify({ labelsConnected, changedFiles }, null, 2));

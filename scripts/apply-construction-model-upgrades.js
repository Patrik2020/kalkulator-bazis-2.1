const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található építőipari upgrade cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`Nem egyedi építőipari upgrade cél: ${label}`);
  return source.replace(oldText, newText);
}

const transforms = {
  "js/simple-calculators.js": (source) => {
    let out = replaceExact(
      source,
      "compute(v) { requirePositive(v.area, v.layers, v.board); requireNonNegative(v.waste); const total=v.area*v.layers*(1+v.waste/100); return [['Teljes számolt felület', m2(total)], ['Szükséges lap', Math.ceil(total/v.board)+' db']]; }",
      "compute(v) { requirePositive(v.area, v.layers, v.board); requireNonNegative(v.waste); if (!Number.isInteger(v.layers)) throw new Error('A rétegek száma egész szám legyen'); const total=v.area*v.layers*(1+v.waste/100); return [['Teljes számolt felület', m2(total)], ['Szükséges lap', Math.ceil(total/v.board)+' db']]; }",
      "gipszkarton egész rétegszám"
    );

    out = replaceExact(
      out,
      "    {\n        \"id\": \"depth\",\n        \"label\": \"Fugamélység (mm)\",\n        \"value\": 8\n    }\n],\n    compute(v) { requirePositive(v.area, v.tileLength, v.tileWidth, v.joint, v.depth); const kg=v.area*((v.tileLength+v.tileWidth)/(v.tileLength*v.tileWidth))*v.joint*v.depth*1.6; return [['Becsült fugázóanyag', kg.toFixed(1).replace('.', ',')+' kg'], ['5 kg-os zsák', Math.ceil(kg/5)+' zsák']]; }",
      "    {\n        \"id\": \"depth\",\n        \"label\": \"Fugamélység (mm)\",\n        \"value\": 8\n    },\n    {\n        \"id\": \"densityFactor\",\n        \"label\": \"K / sűrűségi tényező\",\n        \"value\": 1.6\n    },\n    {\n        \"id\": \"bag\",\n        \"label\": \"Zsák mérete (kg)\",\n        \"value\": 5\n    }\n],\n    compute(v) { const densityFactor=v.densityFactor==null?1.6:v.densityFactor, bag=v.bag==null?5:v.bag; requirePositive(v.area, v.tileLength, v.tileWidth, v.joint, v.depth, densityFactor, bag); const kg=v.area*((v.tileLength+v.tileWidth)/(v.tileLength*v.tileWidth))*v.joint*v.depth*densityFactor; return [['Becsült fugázóanyag', kg.toFixed(1).replace('.', ',')+' kg'], ['Szükséges zsák', Math.ceil(kg/bag)+' zsák']]; }",
      "fuga K-tényező és zsákméret"
    );
    return out;
  },

  "js/construction-upgrades.js": (source) => {
    let out = replaceExact(
      source,
      '        const strips = ceil((net / height) / rollWidth), stripsPerRoll = Math.floor(rollLength / cutLength); if (stripsPerRoll < 1) throw new Error("A tekercs hossza nem elegendő egy teljes csíkhoz.");\n        const baseRolls = ceil(strips / stripsPerRoll), rolls = ceil(baseRolls * (1 + nonNegative(v.waste, "Ráhagyás") / 100));',
      '        const strips = ceil((net / height) / rollWidth), stripsPerRoll = Math.floor(rollLength / cutLength); if (stripsPerRoll < 1) throw new Error("A tekercs hossza nem elegendő egy teljes csíkhoz.");\n        const baseRolls = ceil(strips / stripsPerRoll), stripsWithWaste = ceil(strips * (1 + nonNegative(v.waste, "Ráhagyás") / 100)), rolls = ceil(stripsWithWaste / stripsPerRoll);',
      "tapéta ráhagyás kerekítési sorrend"
    );

    out = replaceExact(
      out,
      '        const bedding = net * (positive(v.beddingThickness, "Ágyazóréteg") / 100) * (1 + nonNegative(v.beddingLoss, "Tömörödési tartalék") / 100), edge = Math.max(0, 2 * (length + width) - nonNegative(v.openEdge, "Nyitott él"));\n        return [["Nettó burkolandó felület", `${fmt(net)} m²`], ["Térkőigény ráhagyással", `${fmt(purchase)} m²`], ["Raklap/csomag", `${packs} db`], ["Ágyazóanyag térfogata", `${fmt(bedding)} m³`], ["Szegélyhossz", `${fmt(edge, 1)} m`], ["Szegélykő", `${ceil(edge / positive(v.edgePiece, "Szegélykő hossza"))} db`]];',
      '        const bedding = net * (positive(v.beddingThickness, "Ágyazóréteg") / 100) * (1 + nonNegative(v.beddingLoss, "Tömörödési tartalék") / 100), fullEdge = 2 * (length + width), openEdge = nonNegative(v.openEdge, "Nyitott él"); if (openEdge > fullEdge) throw new Error("A nem szegélyezett oldalhossz nem lehet nagyobb a teljes kerületnél."); const edge = fullEdge - openEdge;\n        return [["Nettó burkolandó felület", `${fmt(net)} m²`], ["Térkőigény ráhagyással", `${fmt(purchase)} m²`], ["Raklap/csomag", `${packs} db`], ["Ágyazóanyag térfogata", `${fmt(bedding)} m³`], ["Szegélyhossz", `${fmt(edge, 1)} m`], ["Szegélykő", `${ceil(edge / positive(v.edgePiece, "Szegélykő hossza"))} db`]];',
      "térkő lehetetlen nyitott él"
    );

    out = replaceExact(
      out,
      '        const factor = 1 + nonNegative(v.waste, "Ráhagyás") / 100, minPieces = ceil(net * min * factor), maxPieces = ceil(net * max * factor), pack = positive(v.packSize, "Csomagméret");\n        return [["Nettó fedendő tetőfelület", `${fmt(net)} m²`], ["Cserépigény ráhagyással", `${minPieces}–${maxPieces} db`], ["Csomag/raklap", `${ceil(minPieces / pack)}–${ceil(maxPieces / pack)} db`]];',
      '        const factor = 1 + nonNegative(v.waste, "Ráhagyás") / 100, minPieces = ceil(net * min * factor), maxPieces = ceil(net * max * factor), pack = positive(v.packSize, "Csomagméret"); if (!Number.isInteger(pack)) throw new Error("A csomag/raklap darabszáma egész szám legyen.");\n        return [["Nettó fedendő tetőfelület", `${fmt(net)} m²`], ["Cserépigény ráhagyással", `${minPieces}–${maxPieces} db`], ["Csomag/raklap", `${ceil(minPieces / pack)}–${ceil(maxPieces / pack)} db`]];',
      "tetőcserép egész csomagdarabszám"
    );

    out = replaceExact(
      out,
      '        const area = positive(v.area, "Felület"), l = positive(v.tileLength, "Laphossz"), w = positive(v.tileWidth, "Lapszélesség"), depth = positive(v.tileThickness, "Lapvastagság") * positive(v.fillRatio, "Fugamélység aránya") / 100;\n        const netKg = area * ((l + w) / (l * w)) * positive(v.jointWidth, "Fugaszélesség") * depth * positive(v.density, "Sűrűségi tényező"), purchaseKg = netKg * (1 + nonNegative(v.waste, "Anyagveszteség") / 100), pack = positive(v.packSize, "Csomagméret");',
      '        const area = positive(v.area, "Felület"), l = positive(v.tileLength, "Laphossz"), w = positive(v.tileWidth, "Lapszélesség"), fillRatio = positive(v.fillRatio, "Fugamélység aránya"); if (fillRatio > 100) throw new Error("A fugamélység aránya legfeljebb 100% lehet."); const depth = positive(v.tileThickness, "Lapvastagság") * fillRatio / 100;\n        const netKg = area * ((l + w) / (l * w)) * positive(v.jointWidth, "Fugaszélesség") * depth * positive(v.density, "Sűrűségi tényező"), purchaseKg = netKg * (1 + nonNegative(v.waste, "Anyagveszteség") / 100), pack = positive(v.packSize, "Csomagméret");',
      "fuga 100%-os mélységi plafon"
    );

    out = replaceExact(
      out,
      '        const perimeter = Math.max(0, 2 * (length + width) - nonNegative(v.skirtingExclude, "Nem szegélyezett falszakasz"));\n        return [["Bruttó alapterület", `${fmt(gross)} m²`], ["Nettó burkolandó felület", `${fmt(net)} m²`], ["5 / 8 / 12%-os forgatókönyv", `${fmt(net * 1.05)} / ${fmt(net * 1.08)} / ${fmt(net * 1.12)} m²`], ["Vásárolandó burkolat", `${fmt(purchase)} m²`], ["Burkolatcsomag", `${packs} db`], ["Alátétcsomag", underlayCoverage > 0 ? `${ceil(net * 1.05 / underlayCoverage)} db` : "nincs számolva"], ["Szegélyléc", `${fmt(perimeter, 1)} m / ${ceil(perimeter / positive(v.skirtingPiece, "Szegélyléc hossza"))} db`]];',
      '        const fullPerimeter = 2 * (length + width), skirtingExclude = nonNegative(v.skirtingExclude, "Nem szegélyezett falszakasz"); if (skirtingExclude > fullPerimeter) throw new Error("A nem szegélyezett falszakasz nem lehet hosszabb a helyiség teljes kerületénél."); const perimeter = fullPerimeter - skirtingExclude;\n        return [["Bruttó alapterület", `${fmt(gross)} m²`], ["Nettó burkolandó felület", `${fmt(net)} m²`], ["5 / 8 / 12%-os forgatókönyv", `${fmt(net * 1.05)} / ${fmt(net * 1.08)} / ${fmt(net * 1.12)} m²`], ["Vásárolandó burkolat", `${fmt(purchase)} m²`], ["Burkolatcsomag", `${packs} db`], ["Alátétcsomag", underlayCoverage > 0 ? `${ceil(net * 1.05 / underlayCoverage)} db` : "nincs számolva"], ["Szegélyléc", `${fmt(perimeter, 1)} m / ${ceil(perimeter / positive(v.skirtingPiece, "Szegélyléc hossza"))} db`]];',
      "padló lehetetlen szegélykivonás"
    );
    return out;
  },

  "kalkulatorok/festek-kalkulator.html": (source) => {
    let out = replaceExact(source,
      '<input type="number" id="roomLength" step="0.1" placeholder="pl. 5" inputmode="decimal">',
      '<input type="number" id="roomLength" step="0.1" min="0.1" placeholder="pl. 5" inputmode="decimal">',
      "festék hossz minimum"
    );
    out = replaceExact(out,
      '<input type="number" id="roomWidth" step="0.1" placeholder="pl. 4" inputmode="decimal">',
      '<input type="number" id="roomWidth" step="0.1" min="0.1" placeholder="pl. 4" inputmode="decimal">',
      "festék szélesség minimum"
    );
    out = replaceExact(out,
      '<input type="number" id="roomHeight" step="0.1" placeholder="pl. 2.7" inputmode="decimal">',
      '<input type="number" id="roomHeight" step="0.1" min="0.1" placeholder="pl. 2.7" inputmode="decimal">',
      "festék magasság minimum"
    );
    out = replaceExact(out,
      '<input type="number" id="layers" value="2" step="any" inputmode="decimal">',
      '<input type="number" id="layers" value="2" min="1" step="1" inputmode="numeric">',
      "festék egész rétegszám input"
    );
    out = replaceExact(out,
      '<input type="number" id="coverage" value="10" step="any" inputmode="decimal">',
      '<input type="number" id="coverage" value="10" min="0.01" step="any" inputmode="decimal">',
      "festék kiadósság minimum"
    );
    return out;
  },
};

function run() {
  let changed = 0;
  for (const [relativePath, transform] of Object.entries(transforms)) {
    const filePath = path.join(root, relativePath);
    const source = fs.readFileSync(filePath, "utf8");
    const expected = transform(source);
    const secondPass = transform(expected);
    if (secondPass !== expected) throw new Error(`Nem idempotens építőipari upgrade: ${relativePath}`);
    if (!checkOnly && expected !== source) {
      fs.writeFileSync(filePath, expected, "utf8");
      changed += 1;
    }
  }
  console.log(checkOnly
    ? `Építőipari modell-upgrade audit OK: ${Object.keys(transforms).length} fájl, idempotens.`
    : `Építőipari modell-upgrade alkalmazva: ${changed}/${Object.keys(transforms).length} fájl módosult.`);
}

if (require.main === module) run();
module.exports = { transforms, run };

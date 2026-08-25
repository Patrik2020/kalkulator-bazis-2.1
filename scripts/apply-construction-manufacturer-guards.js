const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

function replaceExact(source, oldText, newText, label) {
  if (source.includes(newText)) return source;
  const first = source.indexOf(oldText);
  if (first === -1) throw new Error(`Nem található gyártói-adat guard cél: ${label}`);
  if (source.indexOf(oldText, first + oldText.length) !== -1) throw new Error(`Nem egyedi gyártói-adat guard cél: ${label}`);
  return source.replace(oldText, newText);
}

function transformConstruction(source) {
  let out = replaceExact(
    source,
    '      title: "Vakolat- és glettanyag-tervező", intro: "Minimum–maximum gyártói kiadóssággal, rétegvastagsággal, nyílászáró-kivonással és zsákszámmal számol.",\n      fields: [{ id: "grossArea", label: "Teljes falfelület (m²)", value: 40, min: 0.1 }, ...commonOpenings, { id: "thickness", label: "Átlagos rétegvastagság (mm)", value: 10, min: 0.1 }, { id: "minConsumption", label: "Minimum kiadósság (kg/m²/mm)", value: 1.2, min: 0.01 }, { id: "maxConsumption", label: "Maximum kiadósság (kg/m²/mm)", value: 1.5, min: 0.01 }, { id: "bagSize", label: "Zsák mérete (kg)", value: 25, min: 0.1 }, { id: "waste", label: "Anyagveszteség", value: "8", options: wasteOptions }],',
    '      title: "Vakolat- és glettanyag-tervező", intro: "A számítás a választott termék műszaki adatlapjának kiadósságával és kiszerelésével pontosítható. A megjelenő számok példaértékek, nem univerzális vakolatadatok.",\n      fields: [{ id: "grossArea", label: "Teljes falfelület (m²)", value: 40, min: 0.1 }, ...commonOpenings, { id: "thickness", label: "Átlagos rétegvastagság (mm)", value: 10, min: 0.1 }, { id: "minConsumption", label: "Példa minimum kiadósság (kg/m²/mm)", value: 1.2, min: 0.01, help: "Írd át a kiválasztott termék műszaki adatlapja szerint." }, { id: "maxConsumption", label: "Példa maximum kiadósság (kg/m²/mm)", value: 1.5, min: 0.01, help: "Ha az adatlap egyetlen értéket ad meg, a minimum és maximum legyen azonos." }, { id: "bagSize", label: "Példa zsákméret (kg)", value: 25, min: 0.1, help: "A kiszerelés termékenként eltérhet." }, { id: "waste", label: "Anyagveszteség", value: "8", options: wasteOptions }, { id: "manufacturerConfirmed", label: "Gyártói adatok ellenőrizve?", value: "no", options: [["no", "Nem – előbb ellenőrzöm az adatlapot"], ["yes", "Igen – a választott termék adatlapja alapján"]] }],',
    "vakolat gyártói példaértékek"
  );
  out = replaceExact(
    out,
    '      compute(v) {\n        const gross = positive(v.grossArea, "Falfelület"), net = gross - nonNegative(v.doorArea, "Ajtó") - nonNegative(v.windowArea, "Ablak") - nonNegative(v.otherArea, "Egyéb kivonás"); if (net <= 0) throw new Error("A nettó felületnek pozitívnak kell maradnia.");',
    '      compute(v) {\n        if (v.manufacturerConfirmed !== "yes") throw new Error("A rendelési becslés előtt ellenőrizd és erősítsd meg a választott vakolat gyártói kiadósságát és kiszerelését.");\n        const gross = positive(v.grossArea, "Falfelület"), net = gross - nonNegative(v.doorArea, "Ajtó") - nonNegative(v.windowArea, "Ablak") - nonNegative(v.otherArea, "Egyéb kivonás"); if (net <= 0) throw new Error("A nettó felületnek pozitívnak kell maradnia.");',
    "vakolat gyártói megerősítés"
  );
  out = replaceExact(
    out,
    '      }, examples: ["35 m² nettó fal, 10 mm réteg és 1,2–1,5 kg/m²/mm kiadósság mellett a becslés tartományt ad.", "Hullámos falnál a tényleges átlagvastagság nagyobb lehet, ezért a maximum kiadósság és magasabb ráhagyás biztonságosabb."],',
    '      }, examples: ["Ha a kiválasztott termék adatlapja 1,2–1,5 kg/m²/mm tartományt ad, 35 m² nettó fal és 10 mm réteg mellett ebből készül a becslés.", "Hullámos falnál a tényleges átlagvastagság nagyobb lehet, ezért a gyártói adat és a helyszíni próba fontosabb az alapértéknél."],',
    "vakolat példa szöveg"
  );

  out = replaceExact(
    out,
    '      title: "Hőszigetelő lap-, ragasztó- és dübeltervező", intro: "A nettó homlokzati felületből csomagszámot, ragasztó- és dübeltartományt készít.",\n      fields: [{ id: "grossArea", label: "Teljes szigetelendő felület (m²)", value: 100, min: 0.1 }, ...commonOpenings, { id: "packCoverage", label: "Egy csomag fedése (m²)", value: 5, min: 0.01 }, { id: "waste", label: "Vágási ráhagyás", value: "8", options: wasteOptions }, { id: "adhesiveMin", label: "Ragasztó minimum (kg/m²)", value: 4, min: 0 }, { id: "adhesiveMax", label: "Ragasztó maximum (kg/m²)", value: 6, min: 0 }, { id: "adhesiveBag", label: "Ragasztózsák mérete (kg)", value: 25, min: 0.1 }, { id: "dowelsMin", label: "Dübel minimum (db/m²)", value: 6, min: 0 }, { id: "dowelsMax", label: "Dübel maximum (db/m²)", value: 8, min: 0 }],',
    '      title: "Hőszigetelő lap-, ragasztó- és dübeltervező", intro: "A nettó homlokzati felületből rendszeradatok alapján készít csomag-, ragasztó- és dübelbecslést. A megadott alapértékek csak példák.",\n      fields: [{ id: "grossArea", label: "Teljes szigetelendő felület (m²)", value: 100, min: 0.1 }, ...commonOpenings, { id: "packCoverage", label: "Példa csomagfedés (m²)", value: 5, min: 0.01, help: "A szigetelőlap vastagságától és kiszerelésétől is függ; írd át a csomag adata szerint." }, { id: "waste", label: "Vágási ráhagyás", value: "8", options: wasteOptions }, { id: "adhesiveMin", label: "Példa ragasztó minimum (kg/m²)", value: 4, min: 0, help: "A választott hőszigetelő rendszer műszaki előírása az elsődleges." }, { id: "adhesiveMax", label: "Példa ragasztó maximum (kg/m²)", value: 6, min: 0, help: "Ne keverd össze a csak ragasztási és a ragasztó+tapasz rendszerösszesítést." }, { id: "adhesiveBag", label: "Példa ragasztózsák (kg)", value: 25, min: 0.1, help: "A kiszerelést a konkrét termék szerint add meg." }, { id: "dowelsMin", label: "Példa dübel minimum (db/m²)", value: 6, min: 0, help: "A rögzítési kiosztást a rendszerterv, aljzat, magasság és szélterhelés határozza meg." }, { id: "dowelsMax", label: "Példa dübel maximum (db/m²)", value: 8, min: 0 }, { id: "systemConfirmed", label: "Rendszeradatok ellenőrizve?", value: "no", options: [["no", "Nem – előbb ellenőrzöm a rendszertervet"], ["yes", "Igen – a választott rendszer előírása alapján"]] }],',
    "hőszigetelés rendszerfüggő példaértékek"
  );
  out = replaceExact(
    out,
    '      compute(v) {\n        const gross = positive(v.grossArea, "Teljes felület"), net = gross - nonNegative(v.doorArea, "Ajtó") - nonNegative(v.windowArea, "Ablak") - nonNegative(v.otherArea, "Egyéb kivonás"); if (net <= 0) throw new Error("A nettó szigetelendő felületnek pozitívnak kell maradnia.");',
    '      compute(v) {\n        if (v.systemConfirmed !== "yes") throw new Error("A rendelési becslés előtt ellenőrizd és erősítsd meg a választott hőszigetelő rendszer csomag-, ragasztó- és dübeladatait.");\n        const gross = positive(v.grossArea, "Teljes felület"), net = gross - nonNegative(v.doorArea, "Ajtó") - nonNegative(v.windowArea, "Ablak") - nonNegative(v.otherArea, "Egyéb kivonás"); if (net <= 0) throw new Error("A nettó szigetelendő felületnek pozitívnak kell maradnia.");',
    "hőszigetelés rendszeradat megerősítés"
  );

  out = replaceExact(
    out,
    '      title: "Tetőcserép- és csomagtervező", intro: "Minimum–maximum darabszámmal, áttörésekkel, vágási ráhagyással és csomagmérettel számol.",\n      fields: [{ id: "roofArea", label: "Teljes tetőfelület (m²)", value: 120, min: 0.1 }, { id: "openings", label: "Tetőablakok és áttörések (m²)", value: 3, min: 0 }, { id: "tilesMin", label: "Minimum cserépigény (db/m²)", value: 9.5, min: 0.1 }, { id: "tilesMax", label: "Maximum cserépigény (db/m²)", value: 11, min: 0.1 }, { id: "waste", label: "Vágási/törési ráhagyás", value: "8", options: wasteOptions }, { id: "packSize", label: "Csomag/raklap darabszáma", value: 240, min: 1 }],',
    '      title: "Tetőcserép- és csomagtervező", intro: "A cserépigény erősen termék- és fedésfüggő. A kalkulátor csak a kiválasztott cserép adatlapjának ellenőrzése után ad rendelési becslést.",\n      fields: [{ id: "roofArea", label: "Teljes tetőfelület (m²)", value: 120, min: 0.1 }, { id: "openings", label: "Tetőablakok és áttörések (m²)", value: 3, min: 0 }, { id: "tilesMin", label: "Példa minimum cserépigény (db/m²)", value: 9.5, min: 0.1, help: "Írd át a kiválasztott cserép gyártói szükségletére; a fedési hossz és típus jelentősen módosíthatja." }, { id: "tilesMax", label: "Példa maximum cserépigény (db/m²)", value: 11, min: 0.1, help: "Ha az adatlap egyetlen értéket ad, a minimum és maximum legyen azonos." }, { id: "waste", label: "Vágási/törési ráhagyás", value: "8", options: wasteOptions }, { id: "packSize", label: "Példa csomag/raklap darabszáma", value: 240, min: 1, help: "A raklap- és kötegméret termékcsaládonként eltér." }, { id: "manufacturerConfirmed", label: "Cserép adatlapja ellenőrizve?", value: "no", options: [["no", "Nem – előbb ellenőrzöm az adatlapot"], ["yes", "Igen – a kiválasztott cserép adatai alapján"]] }],',
    "tetőcserép termékfüggő példaértékek"
  );
  out = replaceExact(
    out,
    '      compute(v) {\n        const gross = positive(v.roofArea, "Tetőfelület"), net = gross - nonNegative(v.openings, "Áttörések"); if (net <= 0) throw new Error("A nettó tetőfelületnek pozitívnak kell maradnia.");',
    '      compute(v) {\n        if (v.manufacturerConfirmed !== "yes") throw new Error("A rendelési becslés előtt ellenőrizd és erősítsd meg a kiválasztott tetőcserép gyártói db/m² és csomag/raklap adatait.");\n        const gross = positive(v.roofArea, "Tetőfelület"), net = gross - nonNegative(v.openings, "Áttörések"); if (net <= 0) throw new Error("A nettó tetőfelületnek pozitívnak kell maradnia.");',
    "tetőcserép gyártói megerősítés"
  );
  out = replaceExact(
    out,
    '      }, examples: ["120 m² tetőből 3 m² tetőablakot levonva a gyártó 9,5–11 db/m² értéke alapján darabtartomány készül.", "Kontyolt, vápás vagy sok áttöréses tetőnél a 12–15%-os ráhagyás indokoltabb lehet, de a fedési terv az elsődleges."],',
    '      }, examples: ["Ha a kiválasztott cserép adatlapja 9,5–11 db/m² tartományt ad, 120 m² tetőből 3 m² áttörést levonva ezzel készül a becslés.", "Más cseréptípus szükséglete többszöröse is lehet ennek, ezért kontyolt, vápás vagy sok áttöréses tetőnél a gyártói fedési terv az elsődleges."],',
    "tetőcserép példa szöveg"
  );

  return out;
}

const transforms = {
  "js/construction-upgrades.js": transformConstruction,
};

function run() {
  let changed = 0;
  for (const [relativePath, transform] of Object.entries(transforms)) {
    const filePath = path.join(root, relativePath);
    const source = fs.readFileSync(filePath, "utf8");
    const expected = transform(source);
    const secondPass = transform(expected);
    if (secondPass !== expected) throw new Error(`Nem idempotens gyártói-adat guard: ${relativePath}`);
    if (!checkOnly && expected !== source) {
      fs.writeFileSync(filePath, expected, "utf8");
      changed += 1;
    }
  }
  console.log(checkOnly
    ? `Gyártói-adat guard audit OK: ${Object.keys(transforms).length} fájl, idempotens.`
    : `Gyártói-adat guard alkalmazva: ${changed}/${Object.keys(transforms).length} fájl módosult.`);
}

if (require.main === module) run();
module.exports = { transforms, run, transformConstruction };

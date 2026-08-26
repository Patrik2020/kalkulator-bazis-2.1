(() => {
  "use strict";

  const slug = window.location.pathname.split("/").pop()?.replace(/\.html$/, "") || "";
  const supported = new Set([
    "gipszkarton-kalkulator", "tapeta-kalkulator", "vakolat-kalkulator",
    "hoszigeteles-kalkulator", "terkovezes-kalkulator", "tetocserep-kalkulator",
    "fuga-kalkulator", "padlo-burkolat-kalkulator",
  ]);
  if (!supported.has(slug)) return;

  const n = (value, fallback = 0) => {
    const parsed = Number(String(value ?? "").replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const positive = (value, label) => {
    const parsed = n(value, NaN);
    if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${label}: adj meg nullánál nagyobb értéket.`);
    return parsed;
  };
  const nonNegative = (value, label) => {
    const parsed = n(value, NaN);
    if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${label}: adj meg nulla vagy pozitív értéket.`);
    return parsed;
  };
  const fmt = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value);
  const ceil = (value) => Math.ceil(value - 1e-10);
  const wasteOptions = [["5", "5% – egyszerű, kevés vágás"], ["8", "8% – általános"], ["12", "12% – sok vágás / mintázat"], ["15", "15% – bonyolult felület"]];
  const commonOpenings = [
    { id: "doorArea", label: "Ajtók összes felülete (m²)", value: 0, min: 0, step: 0.01 },
    { id: "windowArea", label: "Ablakok összes felülete (m²)", value: 0, min: 0, step: 0.01 },
    { id: "otherArea", label: "Egyéb kivonható felület (m²)", value: 0, min: 0, step: 0.01 },
  ];

  const field = (spec) => {
    const wrapper = document.createElement("label");
    wrapper.className = "construction-field";
    const caption = document.createElement("span");
    caption.textContent = spec.label;
    wrapper.appendChild(caption);
    let input;
    if (spec.options) {
      input = document.createElement("select");
      spec.options.forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value; option.textContent = label;
        if (String(spec.value) === String(value)) option.selected = true;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = spec.type || "number"; input.value = spec.value ?? "";
      input.step = spec.step ?? "any";
      if (spec.min !== undefined) input.min = spec.min;
      if (spec.max !== undefined) input.max = spec.max;
      input.inputMode = "decimal";
    }
    input.name = spec.id; input.id = `construction-${spec.id}`;
    wrapper.appendChild(input);
    if (spec.help) { const help = document.createElement("small"); help.textContent = spec.help; wrapper.appendChild(help); }
    return wrapper;
  };

  const card = document.querySelector(".card-calculator");
  if (!card) return;

  const configs = {
    "gipszkarton-kalkulator": {
      title: "Gipszkarton fal- és anyagtervező",
      intro: "A lapok mellett opcionálisan profil-, csavar-, hézagerősítő szalag- és glettigényt is becsül.",
      fields: [
        { id: "wallWidth", label: "Fal teljes szélessége (m)", value: 4, min: 0.1 }, { id: "wallHeight", label: "Fal magassága (m)", value: 2.6, min: 0.1 }, ...commonOpenings,
        { id: "sides", label: "Burkolt oldalak száma", value: "2", options: [["1", "1 oldal"], ["2", "2 oldal"]] },
        { id: "layers", label: "Rétegek száma oldalanként", value: "1", options: [["1", "1 réteg"], ["2", "2 réteg"]] },
        { id: "boardWidth", label: "Lap szélessége (m)", value: 1.2, min: 0.1 }, { id: "boardHeight", label: "Lap hossza (m)", value: 2.5, min: 0.1 },
        { id: "waste", label: "Vágási ráhagyás", value: "8", options: wasteOptions }, { id: "studSpacing", label: "CW profil tengelytáv (m)", value: 0.6, min: 0.2 },
        { id: "screwsPerM2", label: "Csavarigény (db/m²/réteg)", value: 20, min: 1 }, { id: "tapePerM2", label: "Hézagerősítő szalag (m/m²)", value: 1.4, min: 0 },
        { id: "compoundPerM2", label: "Glettanyag (kg/m²)", value: 0.35, min: 0 },
      ],
      compute(v) {
        const width = positive(v.wallWidth, "Fal szélessége"), height = positive(v.wallHeight, "Fal magassága"), gross = width * height;
        const openings = nonNegative(v.doorArea, "Ajtó") + nonNegative(v.windowArea, "Ablak") + nonNegative(v.otherArea, "Egyéb kivonás");
        const netOneSide = gross - openings; if (netOneSide <= 0) throw new Error("A kivont felület nem lehet nagyobb a fal teljes felületénél.");
        const sides = positive(v.sides, "Oldalak"), layers = positive(v.layers, "Rétegek"), waste = nonNegative(v.waste, "Ráhagyás") / 100;
        const boardArea = positive(v.boardWidth, "Lapszélesség") * positive(v.boardHeight, "Laphossz"), covered = netOneSide * sides * layers, purchaseArea = covered * (1 + waste);
        const studs = ceil(width / positive(v.studSpacing, "Profil tengelytáv")) + 1;
        return [["Bruttó falfelület", `${fmt(gross)} m²`], ["Nettó felület egy oldalon", `${fmt(netOneSide)} m²`], ["Teljes burkolandó felület", `${fmt(covered)} m²`], ["Vásárolandó lapfelület", `${fmt(purchaseArea)} m²`], ["Gipszkarton lap", `${ceil(purchaseArea / boardArea)} db`], ["UW vezetőprofil", `${fmt(width * 2, 1)} m`], ["CW állóprofil", `${studs} db / ${fmt(studs * height, 1)} folyóméter`], ["Csavar", `${ceil(covered * positive(v.screwsPerM2, "Csavarigény"))} db`], ["Hézagerősítő szalag", `${fmt(covered * nonNegative(v.tapePerM2, "Szalagigény"), 1)} m`], ["Glettanyag", `${fmt(covered * nonNegative(v.compoundPerM2, "Glettigény"), 1)} kg`]];
      },
      examples: ["4 × 2,6 m-es, kétoldalt egy rétegben burkolt falnál egy 1,9 m²-es ajtó levonása után a lap- és profilanyag külön jelenik meg.", "Ugyanez két rétegben közel kétszeres lap- és csavarigényt ad, miközben az UW/CW váz mennyisége nem duplázódik."],
    },
    "tapeta-kalkulator": {
      title: "Tapétatekercs- és mintaismétlés-tervező", intro: "A mintaismétlést, vágási tartalékot, nyílászárókat és a tényleges tekercsméretet is figyelembe veszi.",
      fields: [{ id: "perimeter", label: "Tapétázandó falak kerülete (m)", value: 12, min: 0.1 }, { id: "height", label: "Belmagasság (m)", value: 2.6, min: 0.1 }, ...commonOpenings, { id: "rollWidth", label: "Tekercs szélessége (m)", value: 0.53, min: 0.1 }, { id: "rollLength", label: "Tekercs hossza (m)", value: 10.05, min: 0.1 }, { id: "patternRepeat", label: "Mintaismétlés (cm, 0 = nincs)", value: 0, min: 0 }, { id: "trim", label: "Vágási tartalék csíkonként (cm)", value: 10, min: 0 }, { id: "waste", label: "További ráhagyás", value: "8", options: wasteOptions }],
      compute(v) {
        const perimeter = positive(v.perimeter, "Kerület"), height = positive(v.height, "Belmagasság"), gross = perimeter * height;
        const net = gross - nonNegative(v.doorArea, "Ajtó") - nonNegative(v.windowArea, "Ablak") - nonNegative(v.otherArea, "Egyéb kivonás"); if (net <= 0) throw new Error("A nettó falterületnek pozitívnak kell maradnia.");
        const rollWidth = positive(v.rollWidth, "Tekercsszélesség"), rollLength = positive(v.rollLength, "Tekercshossz"), repeat = nonNegative(v.patternRepeat, "Mintaismétlés") / 100;
        let cutLength = height + nonNegative(v.trim, "Vágási tartalék") / 100; if (repeat > 0) cutLength = Math.ceil(cutLength / repeat) * repeat;
        const strips = ceil((net / height) / rollWidth), stripsPerRoll = Math.floor(rollLength / cutLength); if (stripsPerRoll < 1) throw new Error("A tekercs hossza nem elegendő egy teljes csíkhoz.");
        const baseRolls = ceil(strips / stripsPerRoll), stripsWithWaste = ceil(strips * (1 + nonNegative(v.waste, "Ráhagyás") / 100)), rolls = ceil(stripsWithWaste / stripsPerRoll);
        return [["Bruttó falterület", `${fmt(gross)} m²`], ["Nettó tapétázandó felület", `${fmt(net)} m²`], ["Egy csík vágási hossza", `${fmt(cutLength)} m`], ["Szükséges csík", `${strips} db`], ["Egy tekercsből vágható", `${stripsPerRoll} csík`], ["Alap tekercsigény", `${baseRolls} db`], ["Vásárolandó tekercs", `${rolls} db`]];
      }, examples: ["12 m kerület és 2,6 m belmagasság mellett a 64 cm-es mintaismétlés több hulladékot okozhat, mint a minta nélküli tapéta.", "Nagy ajtó- és ablakfelület csökkenti a nettó területet, de mintás tapétánál a levágott darabok nem mindig használhatók fel teljesen."],
    },
    "vakolat-kalkulator": {
      title: "Vakolat- és glettanyag-tervező", intro: "A számítás a választott termék műszaki adatlapjának kiadósságával és kiszerelésével pontosítható. A megjelenő számok példaértékek, nem univerzális vakolatadatok.",
      fields: [{ id: "grossArea", label: "Teljes falfelület (m²)", value: 40, min: 0.1 }, ...commonOpenings, { id: "thickness", label: "Átlagos rétegvastagság (mm)", value: 10, min: 0.1 }, { id: "minConsumption", label: "Példa minimum kiadósság (kg/m²/mm)", value: 1.2, min: 0.01, help: "Írd át a kiválasztott termék műszaki adatlapja szerint." }, { id: "maxConsumption", label: "Példa maximum kiadósság (kg/m²/mm)", value: 1.5, min: 0.01, help: "Ha az adatlap egyetlen értéket ad meg, a minimum és maximum legyen azonos." }, { id: "bagSize", label: "Példa zsákméret (kg)", value: 25, min: 0.1, help: "A kiszerelés termékenként eltérhet." }, { id: "waste", label: "Anyagveszteség", value: "8", options: wasteOptions }, { id: "manufacturerConfirmed", label: "Gyártói adatok ellenőrizve?", value: "no", options: [["no", "Nem – előbb ellenőrzöm az adatlapot"], ["yes", "Igen – a választott termék adatlapja alapján"]] }],
      compute(v) {
        if (v.manufacturerConfirmed !== "yes") throw new Error("A rendelési becslés előtt ellenőrizd és erősítsd meg a választott vakolat gyártói kiadósságát és kiszerelését.");
        const gross = positive(v.grossArea, "Falfelület"), net = gross - nonNegative(v.doorArea, "Ajtó") - nonNegative(v.windowArea, "Ablak") - nonNegative(v.otherArea, "Egyéb kivonás"); if (net <= 0) throw new Error("A nettó felületnek pozitívnak kell maradnia.");
        const thickness = positive(v.thickness, "Rétegvastagság"), minC = positive(v.minConsumption, "Minimum kiadósság"), maxC = positive(v.maxConsumption, "Maximum kiadósság"); if (minC > maxC) throw new Error("A minimum kiadósság nem lehet nagyobb a maximumnál.");
        const factor = 1 + nonNegative(v.waste, "Anyagveszteség") / 100, minKg = net * thickness * minC * factor, maxKg = net * thickness * maxC * factor, bag = positive(v.bagSize, "Zsákméret");
        return [["Nettó vakolandó felület", `${fmt(net)} m²`], ["Nettó anyagigény", `${fmt(net * thickness * minC, 1)}–${fmt(net * thickness * maxC, 1)} kg`], ["Vásárolandó anyag", `${fmt(minKg, 1)}–${fmt(maxKg, 1)} kg`], ["Szükséges zsák", `${ceil(minKg / bag)}–${ceil(maxKg / bag)} db`]];
      }, examples: ["Ha a kiválasztott termék adatlapja 1,2–1,5 kg/m²/mm tartományt ad, 35 m² nettó fal és 10 mm réteg mellett ebből készül a becslés.", "Hullámos falnál a tényleges átlagvastagság nagyobb lehet, ezért a gyártói adat és a helyszíni próba fontosabb az alapértéknél."],
    },
    "hoszigeteles-kalkulator": {
      title: "Hőszigetelő lap-, ragasztó- és dübeltervező", intro: "A nettó homlokzati felületből rendszeradatok alapján készít csomag-, ragasztó- és dübelbecslést. A megadott alapértékek csak példák.",
      fields: [{ id: "grossArea", label: "Teljes szigetelendő felület (m²)", value: 100, min: 0.1 }, ...commonOpenings, { id: "packCoverage", label: "Példa csomagfedés (m²)", value: 5, min: 0.01, help: "A szigetelőlap vastagságától és kiszerelésétől is függ; írd át a csomag adata szerint." }, { id: "waste", label: "Vágási ráhagyás", value: "8", options: wasteOptions }, { id: "adhesiveMin", label: "Példa ragasztó minimum (kg/m²)", value: 4, min: 0, help: "A választott hőszigetelő rendszer műszaki előírása az elsődleges." }, { id: "adhesiveMax", label: "Példa ragasztó maximum (kg/m²)", value: 6, min: 0, help: "Ne keverd össze a csak ragasztási és a ragasztó+tapasz rendszerösszesítést." }, { id: "adhesiveBag", label: "Példa ragasztózsák (kg)", value: 25, min: 0.1, help: "A kiszerelést a konkrét termék szerint add meg." }, { id: "dowelsMin", label: "Példa dübel minimum (db/m²)", value: 6, min: 0, help: "A rögzítési kiosztást a rendszerterv, aljzat, magasság és szélterhelés határozza meg." }, { id: "dowelsMax", label: "Példa dübel maximum (db/m²)", value: 8, min: 0 }, { id: "systemConfirmed", label: "Rendszeradatok ellenőrizve?", value: "no", options: [["no", "Nem – előbb ellenőrzöm a rendszertervet"], ["yes", "Igen – a választott rendszer előírása alapján"]] }],
      compute(v) {
        if (v.systemConfirmed !== "yes") throw new Error("A rendelési becslés előtt ellenőrizd és erősítsd meg a választott hőszigetelő rendszer csomag-, ragasztó- és dübeladatait.");
        const gross = positive(v.grossArea, "Teljes felület"), net = gross - nonNegative(v.doorArea, "Ajtó") - nonNegative(v.windowArea, "Ablak") - nonNegative(v.otherArea, "Egyéb kivonás"); if (net <= 0) throw new Error("A nettó szigetelendő felületnek pozitívnak kell maradnia.");
        const purchase = net * (1 + nonNegative(v.waste, "Ráhagyás") / 100), packs = ceil(purchase / positive(v.packCoverage, "Csomagfedés"));
        const amin = nonNegative(v.adhesiveMin, "Ragasztó minimum"), amax = nonNegative(v.adhesiveMax, "Ragasztó maximum"), dmin = nonNegative(v.dowelsMin, "Dübel minimum"), dmax = nonNegative(v.dowelsMax, "Dübel maximum"); if (amin > amax || dmin > dmax) throw new Error("A minimum érték nem lehet nagyobb a maximumnál.");
        const bag = positive(v.adhesiveBag, "Ragasztózsák"), minKg = net * amin, maxKg = net * amax;
        return [["Nettó szigetelendő felület", `${fmt(net)} m²`], ["Lapigény ráhagyással", `${fmt(purchase)} m²`], ["Szigetelőanyag-csomag", `${packs} db`], ["Ragasztóanyag", `${fmt(minKg, 1)}–${fmt(maxKg, 1)} kg`], ["Ragasztózsák", `${ceil(minKg / bag)}–${ceil(maxKg / bag)} db`], ["Dübel", `${ceil(net * dmin)}–${ceil(net * dmax)} db`]];
      }, examples: ["100 m² homlokzatból 18 m² nyílászárót levonva 82 m² nettó felület marad; külön számolódik a lapráhagyás és a ragasztó.", "Szeles, magas vagy kedvezőtlen aljzatú homlokzatnál a dübelszámot a rendszerterv és a gyártói előírás határozza meg."],
    },
    "terkovezes-kalkulator": {
      title: "Térkő-, ágyazóanyag- és szegélytervező", intro: "A térkő csomagolásán túl ágyazóréteget és szegélyhosszt is becsül.",
      fields: [{ id: "length", label: "Burkolandó terület hossza (m)", value: 8, min: 0.1 }, { id: "width", label: "Burkolandó terület szélessége (m)", value: 4, min: 0.1 }, { id: "excludeArea", label: "Kivonható terület (m²)", value: 0, min: 0 }, { id: "packCoverage", label: "Raklap/csomag fedése (m²)", value: 10, min: 0.01 }, { id: "waste", label: "Vágási ráhagyás", value: "8", options: wasteOptions }, { id: "beddingThickness", label: "Ágyazóréteg vastagsága tömörítve (cm)", value: 4, min: 0.1 }, { id: "beddingLoss", label: "Ágyazóanyag tömörödési tartalék (%)", value: 15, min: 0 }, { id: "openEdge", label: "Nem szegélyezett oldalhossz (m)", value: 0, min: 0 }, { id: "edgePiece", label: "Egy szegélykő hossza (m)", value: 1, min: 0.01 }],
      compute(v) {
        const length = positive(v.length, "Hossz"), width = positive(v.width, "Szélesség"), gross = length * width, net = gross - nonNegative(v.excludeArea, "Kivonható terület"); if (net <= 0) throw new Error("A nettó burkolandó területnek pozitívnak kell maradnia.");
        const purchase = net * (1 + nonNegative(v.waste, "Ráhagyás") / 100), packs = ceil(purchase / positive(v.packCoverage, "Csomagfedés"));
        const bedding = net * (positive(v.beddingThickness, "Ágyazóréteg") / 100) * (1 + nonNegative(v.beddingLoss, "Tömörödési tartalék") / 100), fullEdge = 2 * (length + width), openEdge = nonNegative(v.openEdge, "Nyitott él"); if (openEdge > fullEdge) throw new Error("A nem szegélyezett oldalhossz nem lehet nagyobb a teljes kerületnél."); const edge = fullEdge - openEdge;
        return [["Nettó burkolandó felület", `${fmt(net)} m²`], ["Térkőigény ráhagyással", `${fmt(purchase)} m²`], ["Raklap/csomag", `${packs} db`], ["Ágyazóanyag térfogata", `${fmt(bedding)} m³`], ["Szegélyhossz", `${fmt(edge, 1)} m`], ["Szegélykő", `${ceil(edge / positive(v.edgePiece, "Szegélykő hossza"))} db`]];
      }, examples: ["8 × 4 m-es téglalapnál 32 m² a bruttó felület; egy 2 m²-es akna vagy növényágyás levonható.", "Ha a kapubejárat egyik oldala nem kap szegélyt, annak hosszát a nem szegélyezett oldalhossznál lehet levonni."],
    },
    "tetocserep-kalkulator": {
      title: "Tetőcserép- és csomagtervező", intro: "A cserépigény erősen termék- és fedésfüggő. A kalkulátor csak a kiválasztott cserép adatlapjának ellenőrzése után ad rendelési becslést.",
      fields: [{ id: "roofArea", label: "Teljes tetőfelület (m²)", value: 120, min: 0.1 }, { id: "openings", label: "Tetőablakok és áttörések (m²)", value: 3, min: 0 }, { id: "tilesMin", label: "Példa minimum cserépigény (db/m²)", value: 9.5, min: 0.1, help: "Írd át a kiválasztott cserép gyártói szükségletére; a fedési hossz és típus jelentősen módosíthatja." }, { id: "tilesMax", label: "Példa maximum cserépigény (db/m²)", value: 11, min: 0.1, help: "Ha az adatlap egyetlen értéket ad, a minimum és maximum legyen azonos." }, { id: "waste", label: "Vágási/törési ráhagyás", value: "8", options: wasteOptions }, { id: "packSize", label: "Példa csomag/raklap darabszáma", value: 240, min: 1, help: "A raklap- és kötegméret termékcsaládonként eltér." }, { id: "manufacturerConfirmed", label: "Cserép adatlapja ellenőrizve?", value: "no", options: [["no", "Nem – előbb ellenőrzöm az adatlapot"], ["yes", "Igen – a kiválasztott cserép adatai alapján"]] }],
      compute(v) {
        if (v.manufacturerConfirmed !== "yes") throw new Error("A rendelési becslés előtt ellenőrizd és erősítsd meg a kiválasztott tetőcserép gyártói db/m² és csomag/raklap adatait.");
        const gross = positive(v.roofArea, "Tetőfelület"), net = gross - nonNegative(v.openings, "Áttörések"); if (net <= 0) throw new Error("A nettó tetőfelületnek pozitívnak kell maradnia.");
        const min = positive(v.tilesMin, "Minimum cserépigény"), max = positive(v.tilesMax, "Maximum cserépigény"); if (min > max) throw new Error("A minimum cserépigény nem lehet nagyobb a maximumnál.");
        const factor = 1 + nonNegative(v.waste, "Ráhagyás") / 100, minPieces = ceil(net * min * factor), maxPieces = ceil(net * max * factor), pack = positive(v.packSize, "Csomagméret"); if (!Number.isInteger(pack)) throw new Error("A csomag/raklap darabszáma egész szám legyen.");
        return [["Nettó fedendő tetőfelület", `${fmt(net)} m²`], ["Cserépigény ráhagyással", `${minPieces}–${maxPieces} db`], ["Csomag/raklap", `${ceil(minPieces / pack)}–${ceil(maxPieces / pack)} db`]];
      }, examples: ["Ha a kiválasztott cserép adatlapja 9,5–11 db/m² tartományt ad, 120 m² tetőből 3 m² áttörést levonva ezzel készül a becslés.", "Más cseréptípus szükséglete többszöröse is lehet ennek, ezért kontyolt, vápás vagy sok áttöréses tetőnél a gyártói fedési terv az elsődleges."],
    },
    "fuga-kalkulator": {
      title: "Fugázóanyag-tervező lapvastagsággal", intro: "A lapméret, fugaszélesség, fugamélység, anyagsűrűség, csomagméret és ráhagyás alapján számol.",
      fields: [{ id: "area", label: "Burkolt felület (m²)", value: 20, min: 0.1 }, { id: "tileLength", label: "Lap hossza (mm)", value: 600, min: 1 }, { id: "tileWidth", label: "Lap szélessége (mm)", value: 300, min: 1 }, { id: "tileThickness", label: "Lap vastagsága (mm)", value: 9, min: 0.1 }, { id: "jointWidth", label: "Fugaszélesség (mm)", value: 3, min: 0.1 }, { id: "fillRatio", label: "Fugamélység a lapvastagság %-ában", value: 100, min: 1, max: 100 }, { id: "density", label: "Fugázóanyag sűrűségi tényezője", value: 1.6, min: 0.1 }, { id: "packSize", label: "Csomag mérete (kg)", value: 5, min: 0.1 }, { id: "waste", label: "Anyagveszteség", value: "8", options: wasteOptions }],
      compute(v) {
        const area = positive(v.area, "Felület"), l = positive(v.tileLength, "Laphossz"), w = positive(v.tileWidth, "Lapszélesség"), fillRatio = positive(v.fillRatio, "Fugamélység aránya"); if (fillRatio > 100) throw new Error("A fugamélység aránya legfeljebb 100% lehet."); const depth = positive(v.tileThickness, "Lapvastagság") * fillRatio / 100;
        const netKg = area * ((l + w) / (l * w)) * positive(v.jointWidth, "Fugaszélesség") * depth * positive(v.density, "Sűrűségi tényező"), purchaseKg = netKg * (1 + nonNegative(v.waste, "Anyagveszteség") / 100), pack = positive(v.packSize, "Csomagméret");
        return [["Számított fugamélység", `${fmt(depth, 1)} mm`], ["Nettó fugázóanyag", `${fmt(netKg)} kg`], ["Vásárolandó mennyiség", `${fmt(purchaseKg)} kg`], ["Szükséges csomag", `${ceil(purchaseKg / pack)} db`]];
      }, examples: ["20 m² felület, 60 × 30 cm-es lap, 3 mm fuga és 9 mm mélység mellett a fogyás jóval kisebb, mint apró mozaiklapnál.", "Ha a fugát nem töltik ki a teljes lapvastagságig, a mélységi százalék csökkenthető, de a gyártói képletet kell követni."],
    },
    "padlo-burkolat-kalkulator": {
      title: "Padlóburkolat- és csomagtervező", intro: "A nettó alapterületből több ráhagyási forgatókönyvet és vásárolandó csomagszámot készít.",
      fields: [{ id: "length", label: "Helyiség hossza (m)", value: 5, min: 0.1 }, { id: "width", label: "Helyiség szélessége (m)", value: 4, min: 0.1 }, { id: "excludeArea", label: "Nem burkolandó fix felület (m²)", value: 0, min: 0 }, { id: "packCoverage", label: "Egy csomag fedése (m²)", value: 2.2, min: 0.01 }, { id: "waste", label: "Vágási ráhagyás", value: "8", options: wasteOptions }, { id: "underlayPack", label: "Alátét csomagfedése (m², 0 = nincs)", value: 10, min: 0 }, { id: "skirtingExclude", label: "Nem szegélyezett falszakasz (m)", value: 1, min: 0 }, { id: "skirtingPiece", label: "Egy szegélyléc hossza (m)", value: 2.4, min: 0.01 }],
      compute(v) {
        const length = positive(v.length, "Hossz"), width = positive(v.width, "Szélesség"), gross = length * width, net = gross - nonNegative(v.excludeArea, "Kivonható felület"); if (net <= 0) throw new Error("A nettó alapterületnek pozitívnak kell maradnia.");
        const purchase = net * (1 + nonNegative(v.waste, "Ráhagyás") / 100), packs = ceil(purchase / positive(v.packCoverage, "Csomagfedés")), underlayCoverage = nonNegative(v.underlayPack, "Alátét csomagfedés");
        const fullPerimeter = 2 * (length + width), skirtingExclude = nonNegative(v.skirtingExclude, "Nem szegélyezett falszakasz"); if (skirtingExclude > fullPerimeter) throw new Error("A nem szegélyezett falszakasz nem lehet hosszabb a helyiség teljes kerületénél."); const perimeter = fullPerimeter - skirtingExclude;
        return [["Bruttó alapterület", `${fmt(gross)} m²`], ["Nettó burkolandó felület", `${fmt(net)} m²`], ["5 / 8 / 12%-os forgatókönyv", `${fmt(net * 1.05)} / ${fmt(net * 1.08)} / ${fmt(net * 1.12)} m²`], ["Vásárolandó burkolat", `${fmt(purchase)} m²`], ["Burkolatcsomag", `${packs} db`], ["Alátétcsomag", underlayCoverage > 0 ? `${ceil(net * 1.05 / underlayCoverage)} db` : "nincs számolva"], ["Szegélyléc", `${fmt(perimeter, 1)} m / ${ceil(perimeter / positive(v.skirtingPiece, "Szegélyléc hossza"))} db`]];
      }, examples: ["5 × 4 m-es szobánál 20 m² az alapterület; egy 1,5 m²-es beépített dobogó levonható, ha tényleg nem kerül alá burkolat.", "Átlós fektetésnél vagy sok ajtónyílásnál a 12%-os forgatókönyv reálisabb lehet, mint az alap 5–8%."],
    },
  };

  // KB_CONSTRUCTION:plaster-consumption-mode:START
  const plasterConfig = configs["vakolat-kalkulator"];
  if (plasterConfig) {
    const thicknessIndex = plasterConfig.fields.findIndex((item) => item.id === "thickness");
    if (thicknessIndex >= 0 && !plasterConfig.fields.some((item) => item.id === "consumptionMode")) {
      plasterConfig.fields.splice(thicknessIndex + 1, 0, {
        id: "consumptionMode",
        label: "Gyártói anyagszükséglet egysége",
        value: "per-mm",
        options: [
          ["per-mm", "kg/m²/mm – rétegvastagsággal szorzandó"],
          ["per-area", "kg/m² – közvetlen gyártói érték"],
        ],
      });
    }
    const minField = plasterConfig.fields.find((item) => item.id === "minConsumption");
    const maxField = plasterConfig.fields.find((item) => item.id === "maxConsumption");
    const thicknessField = plasterConfig.fields.find((item) => item.id === "thickness");
    if (minField) {
      minField.label = "Példa minimum anyagszükséglet";
      minField.help = "A számérték egységét a fenti mód határozza meg; írd át a kiválasztott termék adatlapja szerint.";
    }
    if (maxField) {
      maxField.label = "Példa maximum anyagszükséglet";
      maxField.help = "Ha az adatlap egyetlen értéket ad meg, a minimum és maximum legyen azonos.";
    }
    if (thicknessField) {
      thicknessField.help = "Csak a kg/m²/mm módban vesz részt az anyagigény számításában.";
    }
    const baseCompute = plasterConfig.compute;
    plasterConfig.compute = (values) => {
      const mode = values.consumptionMode || "per-mm";
      if (mode !== "per-mm" && mode !== "per-area") throw new Error("Ismeretlen vakolat-anyagszükséglet egység.");
      const rows = baseCompute(mode === "per-area" ? { ...values, thickness: 1 } : values);
      return [["Fogyási mód", mode === "per-area" ? "kg/m² – közvetlen gyártói érték" : "kg/m²/mm × rétegvastagság"], ...rows];
    };
    plasterConfig.intro = "A kalkulátor kezeli a kg/m²/mm és a közvetlen kg/m² gyártói adatokat is. Előbb válaszd ki az adatlap egységét, majd ellenőrizd a termék kiadósságát és kiszerelését.";
    plasterConfig.examples = [
      "Alap- vagy gipszvakolatnál gyakori a kg/m²/mm adat: ilyenkor a kalkulátor a megadott rétegvastagsággal is szoroz.",
      "Dekor- és vékonyvakolatnál gyakori a közvetlen kg/m² adat: ebben a módban a rétegvastagságot nem szorozzuk rá még egyszer.",
    ];
  }
  // KB_CONSTRUCTION:plaster-consumption-mode:END

  // KB_CONSTRUCTION:roof-purchase-mode:START
  const roofConfig = configs["tetocserep-kalkulator"];
  if (roofConfig) {
    const packIndex = roofConfig.fields.findIndex((item) => item.id === "packSize");
    if (packIndex >= 0 && !roofConfig.fields.some((item) => item.id === "purchaseMode")) {
      roofConfig.fields.splice(packIndex + 1, 0, {
        id: "purchaseMode",
        label: "Értékesítési / rendelési egység",
        value: "pieces",
        options: [
          ["pieces", "Darabonként rendelhető – ne kerekíts raklapra"],
          ["whole-pack", "Csak teljes csomag/raklap – kerekíts felfelé"],
        ],
      });
    }
    const packField = roofConfig.fields.find((item) => item.id === "packSize");
    if (packField) {
      packField.label = "Példa csomag/raklap darabszáma";
      packField.help = "Darabonkénti rendelésnél opcionális, csak logisztikai tájékoztató; teljes csomag/raklap módban kötelező pozitív egész szám.";
    }
    const baseCompute = roofConfig.compute;
    roofConfig.compute = (values) => {
      const mode = values.purchaseMode || "pieces";
      if (mode !== "pieces" && mode !== "whole-pack") throw new Error("Ismeretlen tetőcserép rendelési mód.");

      const rawPack = String(values.packSize ?? "").trim().replace(",", ".");
      const pack = Number(rawPack);
      const packIsValid = rawPack !== "" && Number.isFinite(pack) && pack > 0 && Number.isInteger(pack);
      if (mode === "whole-pack" && !packIsValid) throw new Error("A teljes csomag/raklap módhoz a csomag darabszáma pozitív egész szám legyen.");

      // A régi számítási mag a csomagméretet akkor is validálja, amikor csak a cserépdarabszám kell.
      // Darabos módban ezért semleges 1-es belső értékkel futtatjuk; a Csomag/raklap sort alább eltávolítjuk.
      const rows = baseCompute({ ...values, packSize: packIsValid ? pack : 1 });
      const pieceRow = rows.find(([label]) => label === "Cserépigény ráhagyással");
      const match = String(pieceRow?.[1] || "").match(/([0-9]+)[^0-9]+([0-9]+)/);
      if (!match) return rows;
      const minPieces = Number(match[1]);
      const maxPieces = Number(match[2]);
      const withoutOldPack = rows.filter(([label]) => label !== "Csomag/raklap");

      if (mode === "whole-pack") {
        const minPacks = Math.ceil(minPieces / pack);
        const maxPacks = Math.ceil(maxPieces / pack);
        return [["Rendelési mód", "Csak teljes csomag/raklap"], ...withoutOldPack, ["Vásárolandó teljes csomag/raklap", `${minPacks}–${maxPacks} db`], ["Raklapra kerekített darabszám", `${minPacks * pack}–${maxPacks * pack} db`]];
      }

      const result = [["Rendelési mód", "Darabonként rendelhető"], ...withoutOldPack];
      if (packIsValid) {
        const minEq = minPieces / pack;
        const maxEq = maxPieces / pack;
        result.push(["Raklap-egyenérték (csak tájékoztató)", `${minEq.toLocaleString("hu-HU", { maximumFractionDigits: 2 })}–${maxEq.toLocaleString("hu-HU", { maximumFractionDigits: 2 })}`]);
      }
      return result;
    };
    roofConfig.intro = "A gyártói db/m² adatból darabszámot számol. Raklapra csak akkor kerekít felfelé, ha a kereskedő ténylegesen kizárólag teljes csomagban vagy raklapon értékesít.";
  }
  // KB_CONSTRUCTION:roof-purchase-mode:END

  // KB_CONSTRUCTION:insulation-package-guidance:START
  const insulationConfig = configs["hoszigeteles-kalkulator"];
  if (insulationConfig) {
    const packField = insulationConfig.fields.find((item) => item.id === "packCoverage");
    if (packField) {
      packField.label = "Konkrét termék csomagfedése (m²/csomag)";
      packField.help = "A csomagfedés ugyanazon termékcsaládon belül is erősen változhat a lapvastagsággal. Másold be a kiválasztott vastagság csomagolási adatát; az 5 m² csak példa.";
    }
    insulationConfig.intro = "A nettó homlokzati felületből a konkrét termék csomagfedése és a választott hőszigetelő rendszer ragasztó-/dübeladatai alapján készít becslést. A lapvastagságból önmagában nem talál ki csomagméretet.";
  }
  // KB_CONSTRUCTION:insulation-package-guidance:END

  // KB_CONSTRUCTION:drywall-system-guidance:START
  const drywallConfig = configs["gipszkarton-kalkulator"];
  if (drywallConfig) {
    const layers = drywallConfig.fields.find((item) => item.id === "layers");
    if (layers) {
      layers.options = [["1", "1 réteg"], ["2", "2 réteg"], ["3", "3 réteg"]];
      layers.help = "A rétegrendet mindig a választott minősített rendszer szerint add meg.";
    }
    const stud = drywallConfig.fields.find((item) => item.id === "studSpacing");
    if (stud) {
      stud.label = "Példa CW profil tengelytáv (m)";
      stud.help = "A profilkiosztás rendszer-, lap- és terhelésfüggő; például 0,30 / 0,60 / 0,625 m is előfordulhat.";
    }
    const screws = drywallConfig.fields.find((item) => item.id === "screwsPerM2");
    if (screws) {
      screws.label = "Példa csavarigény (db/m²/réteg)";
      screws.help = "A tényleges csavartávolság és a rétegenkénti rögzítés a rendszerleírásból jön; a 20 db/m²/réteg csak kiinduló példa.";
    }
    const tape = drywallConfig.fields.find((item) => item.id === "tapePerM2");
    if (tape) {
      tape.label = "Példa hézagerősítő szalag (m/m²/réteg)";
      tape.help = "Nem minden belső réteg hézagolása és szalagozása azonos; ellenőrizd a rendszer előírását.";
    }
    const compound = drywallConfig.fields.find((item) => item.id === "compoundPerM2");
    if (compound) {
      compound.label = "Példa hézagoló/glett (kg/m²/réteg)";
      compound.help = "A gyártói anyagszükséglet lehet teljes rendszerre megadott kg/m² is; csak azonos vetítési alapú értéket használj itt.";
    }
    if (!drywallConfig.fields.some((item) => item.id === "systemConfirmed")) {
      drywallConfig.fields.push({
        id: "systemConfirmed",
        label: "Gipszkarton rendszer adatai ellenőrizve?",
        value: "no",
        options: [["no", "Nem – előbb ellenőrzöm a rendszerleírást"], ["yes", "Igen – a választott rendszer alapján"]],
      });
    }
    const baseCompute = drywallConfig.compute;
    drywallConfig.compute = (values) => {
      if (values.systemConfirmed !== "yes") throw new Error("A részletes anyagbecslés előtt ellenőrizd és erősítsd meg a választott gipszkarton rendszer rétegrendjét, profilkiosztását és fajlagos kiegészítőanyag-adatait.");
      return baseCompute(values);
    };
    drywallConfig.intro = "A lapgeometriát kiszámítja, a profil-, csavar-, szalag- és hézagolóanyag mennyiségét pedig csak a választott minősített rendszer ellenőrzött fajlagos adataival tekintsd rendelési becslésnek.";
  }
  // KB_CONSTRUCTION:drywall-system-guidance:END

  const config = configs[slug]; if (!config) return;
  const renderResults = (rows, target) => {
    target.innerHTML = ""; const grid = document.createElement("dl"); grid.className = "construction-results-grid";
    rows.forEach(([label, value]) => { const item = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = label; dd.textContent = value; item.append(dt, dd); grid.appendChild(item); });
    target.appendChild(grid);
  };
  const form = document.createElement("form"); form.className = "construction-planner"; form.noValidate = true;
  const heading = document.createElement("div"); heading.className = "construction-heading"; heading.innerHTML = `<p class="eyebrow">Részletes anyagtervező</p><h2>${config.title}</h2><p>${config.intro}</p>`;
  const grid = document.createElement("div"); grid.className = "construction-fields"; config.fields.forEach((spec) => grid.appendChild(field(spec)));
  const actions = document.createElement("div"); actions.className = "construction-actions";
  const calculate = document.createElement("button"); calculate.type = "submit"; calculate.textContent = "Anyagigény kiszámítása";
  const reset = document.createElement("button"); reset.type = "reset"; reset.className = "secondary-btn"; reset.textContent = "Alapértékek visszaállítása"; actions.append(calculate, reset);
  const message = document.createElement("p"); message.className = "construction-error"; message.setAttribute("role", "alert");
  const result = document.createElement("div"); result.className = "result-box construction-results"; result.innerHTML = "<p>Az eredmény a számítás után jelenik meg.</p>";
  form.append(heading, grid, actions, message, result); card.replaceChildren(form);
  const collect = () => Object.fromEntries(new FormData(form).entries());
  const run = () => {
    message.textContent = "";
    const values = collect();
    const confirmationNames = ["manufacturerConfirmed", "systemConfirmed"];
    const pendingConfirmation = confirmationNames.some((name) => Object.prototype.hasOwnProperty.call(values, name) && values[name] !== "yes");
    if (pendingConfirmation) {
      result.innerHTML = "<p><strong>Gyártói/rendszeradat ellenőrzése szükséges.</strong><br>Írd át a példaértékeket a kiválasztott termék vagy rendszer adatai szerint, majd állítsd az ellenőrző mezőt Igenre. Addig nem készítünk rendelési mennyiséget.</p>";
      return;
    }
    try { renderResults(config.compute(values), result); } catch (error) { message.textContent = error instanceof Error ? error.message : "A számítás nem végezhető el."; }
  };
  form.addEventListener("submit", (event) => { event.preventDefault(); run(); }); form.addEventListener("input", run); form.addEventListener("reset", () => setTimeout(run, 0)); run();

  const guide = document.createElement("section"); guide.className = "article construction-methodology";
  guide.innerHTML = `<h2>Mitől pontosabb ez a tervező?</h2><p>A nettó felületet, a kivonható részeket, a választott termék csomagméretét vagy kiadósságát és a kivitelezési ráhagyást külön kezeli. Az eredmény szétválasztja a matematikai nettó anyagigényt és a ténylegesen megvásárolandó, egész csomagokra kerekített mennyiséget.</p><div class="construction-scenarios"><div><strong>5%</strong><span>egyszerű, kevés vágás</span></div><div><strong>8%</strong><span>általános kiindulás</span></div><div><strong>12%</strong><span>sok vágás vagy minta</span></div><div><strong>15%</strong><span>összetett felület</span></div></div><div class="notice-box"><strong>Gyártói adatlap az elsődleges:</strong> a csomagfedés, kiadósság, sűrűség, rögzítési kiosztás és rétegvastagság termékenként eltér. Vásárlás előtt írd át az alapértékeket a kiválasztott termék műszaki adatlapja és a kivitelezési rendszerterv szerint.</div><h2>Két példaszámítás</h2><div class="construction-example-grid"><article><h3>1. példa</h3><p>${config.examples[0]}</p></article><article><h3>2. példa</h3><p>${config.examples[1]}</p></article></div><h2>A kalkulátor korlátai</h2><ul><li>Nem készít statikai, páratechnikai, rétegrendi vagy kivitelezési tervet.</li><li>Nem ismeri a felület síkpontosságát, a helyszíni vágásokat, töréseket és selejtet.</li><li>A kiegészítő anyagok mennyisége rendszer- és gyártófüggő lehet.</li><li>Rendelés előtt a kivitelezővel és a kereskedővel is érdemes ellenőrizni a mennyiséget.</li></ul><p class="last-reviewed">Módszertani frissítés: <time datetime="2026-07-15">2026. július 15.</time>. A kalkulátor tájékoztató becslést készít; rendelés előtt ellenőrizd a gyártói adatlapot, és szükség esetén egyeztess szakemberrel.</p>`;
  const existingGuide = card.nextElementSibling; if (existingGuide) existingGuide.before(guide); else card.after(guide);
})();

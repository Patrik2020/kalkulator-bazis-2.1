(function (root, factory) {
  const calculators = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = calculators;
  if (!root) return;
  root.KB_EXPANSION_BATCH_03 = calculators;
  let merged = false;
  const mergeIntoSiteData = () => {
    const data = root.KB_DATA;
    if (!data || !Array.isArray(data.calculators)) return false;
    const known = new Set(data.calculators.map((calculator) => calculator.url));
    calculators.forEach((calculator) => { if (!known.has(calculator.url)) { data.calculators.push({ ...calculator }); known.add(calculator.url); } });
    merged = true;
    return true;
  };
  if (typeof document !== "undefined") {
    document.addEventListener("kb:site-data-loaded", () => { mergeIntoSiteData(); });
    if (mergeIntoSiteData()) queueMicrotask(() => document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "03" } })));
    window.setTimeout(() => { if (!merged && mergeIntoSiteData()) document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "03" } })); }, 0);
  }
})(typeof window !== "undefined" ? window : null, function () { return [
  {
    "title": "Súlyozott átlag kalkulátor",
    "url": "kalkulatorok/sulyozott-atlag-kalkulator.html",
    "category": "mindennapi",
    "group": "matematika",
    "description": "Súlyozott átlag számítása értékekből és hozzájuk tartozó súlyokból, például jegyek, árak vagy mérési eredmények összesítéséhez.",
    "keywords": "súlyozott átlag jegy átlag súly kredit pontszám matematika",
    "related": [
      "kalkulatorok/atlag-kalkulator.html",
      "kalkulatorok/mertani-atlag-kalkulator.html",
      "kalkulatorok/szazalek-kalkulator.html"
    ]
  },
  {
    "title": "Megtakarítási cél kalkulátor",
    "url": "kalkulatorok/megtakaritasi-cel-kalkulator.html",
    "category": "penzugyi",
    "group": "megtakaritas-befektetes",
    "description": "Becsüld meg, hány hónap alatt érhető el egy megtakarítási cél induló összeggel, havi befizetéssel és feltételezett éves hozammal.",
    "keywords": "megtakarítás célösszeg havi befizetés hozam pénzügyi cél idő",
    "related": [
      "kalkulatorok/kamatos-kamat-kalkulator.html",
      "kalkulatorok/milliomos-kalkulator.html",
      "kalkulatorok/havi-koltsegvetes-kalkulator.html"
    ]
  },
  {
    "title": "Kerítés oszlop kalkulátor",
    "url": "kalkulatorok/kerites-oszlop-kalkulator.html",
    "category": "epitoipari",
    "group": "szerkezet-szigeteles",
    "description": "Becsüld meg egy egyenes, kapu nélküli kerítésszakaszhoz szükséges mezők és oszlopok számát a teljes hossz és a legnagyobb oszloptávolság alapján.",
    "keywords": "kerítés oszlop távolság mező panel építés anyagszükséglet",
    "related": [
      "kalkulatorok/beton-kalkulator.html",
      "kalkulatorok/tegla-kalkulator.html",
      "kalkulatorok/terkovezes-kalkulator.html"
    ]
  },
  {
    "title": "Üzemanyagár-különbség kalkulátor",
    "url": "kalkulatorok/uzemanyagar-kulonbseg-kalkulator.html",
    "category": "auto",
    "group": "utazas-uzemanyag",
    "description": "Hasonlíts össze két üzemanyagárat ugyanarra az útra, és számold ki a teljes költségkülönbséget a távolság és fogyasztás alapján.",
    "keywords": "üzemanyagár különbség benzin dízel költség út fogyasztás megtakarítás",
    "related": [
      "kalkulatorok/uzemanyag-koltseg-kalkulator.html",
      "kalkulatorok/auto-fogyasztas-kalkulator.html",
      "kalkulatorok/tankolas-kalkulator.html"
    ]
  },
  {
    "title": "Villanyfogyasztás költség kalkulátor",
    "url": "kalkulatorok/villanyfogyasztas-koltseg-kalkulator.html",
    "category": "mindennapi",
    "group": "vasarlas-haztartas",
    "description": "Becsüld meg egy elektromos készülék energiafogyasztását és költségét teljesítmény, napi használati idő, időszak és kWh-ár alapján.",
    "keywords": "villanyfogyasztás áram költség watt kwh készülék rezsi energia",
    "related": [
      "kalkulatorok/rezsi-megosztas-kalkulator.html",
      "kalkulatorok/teljesitmeny-atvalto-kalkulator.html",
      "kalkulatorok/energia-atvalto-kalkulator.html"
    ]
  }
]; });

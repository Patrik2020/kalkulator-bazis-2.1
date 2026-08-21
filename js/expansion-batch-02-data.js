(function (root, factory) {
  const calculators = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = calculators;
  if (!root) return;
  root.KB_EXPANSION_BATCH_02 = calculators;
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
    if (mergeIntoSiteData()) queueMicrotask(() => document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "02" } })));
    window.setTimeout(() => { if (!merged && mergeIntoSiteData()) document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "02" } })); }, 0);
  }
})(typeof window !== "undefined" ? window : null, function () { return [
  {
    "title": "Mértani átlag kalkulátor",
    "url": "kalkulatorok/mertani-atlag-kalkulator.html",
    "category": "mindennapi",
    "group": "matematika",
    "description": "Pozitív értékek mértani átlagának kiszámítása, különösen egymásra épülő szorzók és növekedési tényezők összevetéséhez.",
    "keywords": "mértani átlag geometriai közép hozam növekedés szorzó matematika",
    "related": [
      "kalkulatorok/atlag-kalkulator.html",
      "kalkulatorok/szazalekos-valtozas-kalkulator.html",
      "kalkulatorok/kamatos-kamat-kalkulator.html"
    ]
  },
  {
    "title": "Dátum hozzáadás és kivonás kalkulátor",
    "url": "kalkulatorok/datum-hozzaadas-kivonas-kalkulator.html",
    "category": "mindennapi",
    "group": "ido-datum",
    "description": "Napok hozzáadása egy dátumhoz vagy kivonása belőle, a cél dátum és a hét napjának megjelenítésével.",
    "keywords": "dátum hozzáadás kivonás napok határidő naptár mikor lesz",
    "related": [
      "kalkulatorok/datum-kulonbseg-kalkulator.html",
      "kalkulatorok/eletkor-kalkulator.html",
      "kalkulatorok/fizetesi-hatarido-kalkulator.html"
    ]
  },
  {
    "title": "Aljzatkiegyenlítő kalkulátor",
    "url": "kalkulatorok/aljzatkiegyenlito-kalkulator.html",
    "category": "epitoipari",
    "group": "burkolas-feluletek",
    "description": "Aljzatkiegyenlítő anyagszükséglet és zsákszám becslése felület, átlagos rétegvastagság, fajlagos fogyás és ráhagyás alapján.",
    "keywords": "aljzatkiegyenlítő önterülő aljzat kg zsák rétegvastagság burkolás felújítás",
    "related": [
      "kalkulatorok/padlo-burkolat-kalkulator.html",
      "kalkulatorok/csemperagaszto-kalkulator.html",
      "kalkulatorok/csempe-kalkulator.html"
    ]
  },
  {
    "title": "Féktáv kalkulátor",
    "url": "kalkulatorok/fektav-kalkulator.html",
    "category": "auto",
    "group": "muszaki-kornyezet",
    "description": "Elméleti reakcióút, fékút és teljes megállási távolság becslése sebesség, reakcióidő és tapadási tényező alapján.",
    "keywords": "féktáv fékút reakcióút sebesség tapadás autó megállási távolság",
    "related": [
      "kalkulatorok/utazasi-ido-kalkulator.html",
      "kalkulatorok/gumi-meret-kalkulator.html",
      "kalkulatorok/auto-kalkulator.html"
    ]
  },
  {
    "title": "1RM kalkulátor",
    "url": "kalkulatorok/egyszeri-max-1rm-kalkulator.html",
    "category": "egeszseg",
    "group": "edzes-regeneracio",
    "description": "Becsült egyismétléses maximum számítása Epley- és Brzycki-képlettel a használt súly és az ismétlésszám alapján.",
    "keywords": "1rm egyismétléses maximum erő edzés súly ismétlés epley brzycki",
    "related": [
      "kalkulatorok/feherje-szukseglet-kalkulator.html",
      "kalkulatorok/pulzus-zona-kalkulator.html",
      "kalkulatorok/kaloria-kalkulator.html"
    ]
  }
]; });

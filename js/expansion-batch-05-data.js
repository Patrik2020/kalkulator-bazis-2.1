(function (root, factory) {
  const calculators = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = calculators;
  if (!root) return;
  root.KB_EXPANSION_BATCH_05 = calculators;
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
    if (mergeIntoSiteData()) queueMicrotask(() => document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "05" } })));
    window.setTimeout(() => { if (!merged && mergeIntoSiteData()) document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "05" } })); }, 0);
  }
})(typeof window !== "undefined" ? window : null, function () { return [
  {
    "title": "Munkanap kalkulátor",
    "url": "kalkulatorok/munkanap-kalkulator.html",
    "category": "mindennapi",
    "group": "ido-datum",
    "description": "Számold ki két dátum között a hétfőtől péntekig eső napokat, és adj meg külön kihagyandó dátumokat is.",
    "keywords": "munkanap kalkulátor hétköznap napok dátum hétvége határidő",
    "related": [
      "kalkulatorok/datum-kulonbseg-kalkulator.html",
      "kalkulatorok/datum-hozzaadas-kivonas-kalkulator.html",
      "kalkulatorok/fizetesi-hatarido-kalkulator.html"
    ]
  },
  {
    "title": "Túlóra díj kalkulátor",
    "url": "kalkulatorok/tulora-kalkulator.html",
    "category": "mindennapi",
    "group": "munka-jovedelem",
    "description": "Túlóra óradíj, teljes túlóradíj és a normál órabér feletti többlet kiszámítása saját szorzóval.",
    "keywords": "túlóra díj órabér szorzó pótlék munka fizetés kalkulátor",
    "related": [
      "kalkulatorok/oraber-kalkulator.html",
      "kalkulatorok/munkaido-kalkulator.html",
      "kalkulatorok/netto-brutto-kalkulator.html"
    ]
  },
  {
    "title": "Recept adag átszámító kalkulátor",
    "url": "kalkulatorok/recept-adag-kalkulator.html",
    "category": "mindennapi",
    "group": "vasarlas-haztartas",
    "description": "Recept hozzávalóinak átszámítása más adagszámra, több hozzávaló egyszerre történő skálázásával.",
    "keywords": "recept adag átszámítás hozzávaló mennyiség főzés sütés kalkulátor",
    "related": [
      "kalkulatorok/egysegar-kalkulator.html",
      "kalkulatorok/terfogat-atvalto-kalkulator.html",
      "kalkulatorok/tomeg-atvalto-kalkulator.html"
    ]
  },
  {
    "title": "Vésztartalék kalkulátor",
    "url": "kalkulatorok/vesztartalek-kalkulator.html",
    "category": "penzugyi",
    "group": "jovedelem-koltsegvetes",
    "description": "Vésztartalék célösszeg, jelenlegi fedezet, hiányzó összeg és megtakarítási idő becslése havi alapkiadásokból.",
    "keywords": "vésztartalék pénzügyi tartalék havi kiadás megtakarítás biztonsági alap",
    "related": [
      "kalkulatorok/havi-koltsegvetes-kalkulator.html",
      "kalkulatorok/megtakaritasi-cel-kalkulator.html",
      "kalkulatorok/kamatos-kamat-kalkulator.html"
    ]
  },
  {
    "title": "Fedezeti pont kalkulátor",
    "url": "kalkulatorok/fedezeti-pont-kalkulator.html",
    "category": "mindennapi",
    "group": "munka-jovedelem",
    "description": "Fedezeti darabszám és árbevétel becslése fix költségből, egységárból és egységnyi változó költségből.",
    "keywords": "fedezeti pont break even fix költség változó költség árbevétel vállalkozás",
    "related": [
      "kalkulatorok/arres-kalkulator.html",
      "kalkulatorok/haszonkulcs-kalkulator.html",
      "kalkulatorok/afa-kalkulator.html"
    ]
  },
  {
    "title": "Zúzottkő kalkulátor",
    "url": "kalkulatorok/zuzottko-kalkulator.html",
    "category": "epitoipari",
    "group": "szerkezet-szigeteles",
    "description": "Zúzottkő térfogat és tömeg becslése felület, rétegvastagság, anyagsűrűség és ráhagyás alapján.",
    "keywords": "zúzottkő kavics murva köbméter tonna rétegvastagság anyagszükséglet",
    "related": [
      "kalkulatorok/terkovezes-kalkulator.html",
      "kalkulatorok/beton-kalkulator.html",
      "kalkulatorok/terfogat-atvalto-kalkulator.html"
    ]
  },
  {
    "title": "Szegőléc kalkulátor",
    "url": "kalkulatorok/szegolec-kalkulator.html",
    "category": "epitoipari",
    "group": "burkolas-feluletek",
    "description": "Szegőléc szükséges hosszának és darabszámának becslése kerületből, nyílásokból, szálhosszból és ráhagyásból.",
    "keywords": "szegőléc kalkulátor méter darab szál padló burkolat kerület ráhagyás",
    "related": [
      "kalkulatorok/padlo-burkolat-kalkulator.html",
      "kalkulatorok/csempe-kalkulator.html",
      "kalkulatorok/festek-kalkulator.html"
    ]
  },
  {
    "title": "Vízfogyasztás költség kalkulátor",
    "url": "kalkulatorok/vizfogyasztas-koltseg-kalkulator.html",
    "category": "mindennapi",
    "group": "vasarlas-haztartas",
    "description": "Vízfogyasztás köbméterben és becsült költség számítása napi literből, időszakból és saját m³-árral.",
    "keywords": "vízfogyasztás vízdíj költség liter köbméter rezsi kalkulátor",
    "related": [
      "kalkulatorok/rezsi-megosztas-kalkulator.html",
      "kalkulatorok/villanyfogyasztas-koltseg-kalkulator.html",
      "kalkulatorok/terfogat-atvalto-kalkulator.html"
    ]
  }
]; });

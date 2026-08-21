(function (root, factory) {
  const calculators = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = calculators;
  if (!root) return;
  root.KB_EXPANSION_BATCH_04 = calculators;
  let merged = false;
  const mergeIntoSiteData = () => { const data = root.KB_DATA; if (!data || !Array.isArray(data.calculators)) return false; const known = new Set(data.calculators.map((calculator) => calculator.url)); calculators.forEach((calculator) => { if (!known.has(calculator.url)) { data.calculators.push({ ...calculator }); known.add(calculator.url); } }); merged = true; return true; };
  if (typeof document !== "undefined") { document.addEventListener("kb:site-data-loaded", () => { mergeIntoSiteData(); }); if (mergeIntoSiteData()) queueMicrotask(() => document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "04" } }))); window.setTimeout(() => { if (!merged && mergeIntoSiteData()) document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "04" } })); }, 0); }
})(typeof window !== "undefined" ? window : null, function () { return [
  {
    "title": "Árrés kalkulátor",
    "url": "kalkulatorok/arres-kalkulator.html",
    "category": "mindennapi",
    "group": "munka-jovedelem",
    "description": "Árrés összeg, árrésszázalék és haszonkulcs kiszámítása beszerzési és eladási árból.",
    "keywords": "árrés árrésszázalék haszonkulcs beszerzési ár eladási ár vállalkozás",
    "related": [
      "kalkulatorok/haszonkulcs-kalkulator.html",
      "kalkulatorok/afa-kalkulator.html",
      "kalkulatorok/egysegar-kalkulator.html"
    ]
  },
  {
    "title": "Haszonkulcs kalkulátor",
    "url": "kalkulatorok/haszonkulcs-kalkulator.html",
    "category": "mindennapi",
    "group": "munka-jovedelem",
    "description": "Eladási ár és árrés becslése beszerzési árból és megadott haszonkulcsból.",
    "keywords": "haszonkulcs eladási ár árrés beszerzési ár kalkulátor vállalkozás",
    "related": [
      "kalkulatorok/arres-kalkulator.html",
      "kalkulatorok/afa-kalkulator.html",
      "kalkulatorok/szazalek-kalkulator.html"
    ]
  },
  {
    "title": "Hitel előtörlesztés kalkulátor",
    "url": "kalkulatorok/hitel-elotorlesztes-kalkulator.html",
    "category": "penzugyi",
    "group": "hitelek-ingatlan",
    "description": "Becsüld meg, mennyivel csökkenhet a havi törlesztő és a teljes kamatteher részleges előtörlesztés után változatlan futamidő mellett.",
    "keywords": "hitel előtörlesztés törlesztő kamat megtakarítás futamidő bank",
    "related": [
      "kalkulatorok/hitel-torleszto-kalkulator.html",
      "kalkulatorok/hitelkepesseg-kalkulator.html",
      "kalkulatorok/lakas-hitel-onero-kalkulator.html"
    ]
  },
  {
    "title": "Mulcs kalkulátor",
    "url": "kalkulatorok/mulcs-kalkulator.html",
    "category": "epitoipari",
    "group": "burkolas-feluletek",
    "description": "Mulcs térfogat és zsákszám becslése felület, kívánt rétegvastagság, ráhagyás és kiszerelés alapján.",
    "keywords": "mulcs kéregmulcs liter köbméter zsák kert felület rétegvastagság",
    "related": [
      "kalkulatorok/terkovezes-kalkulator.html",
      "kalkulatorok/padlo-burkolat-kalkulator.html",
      "kalkulatorok/terfogat-atvalto-kalkulator.html"
    ]
  },
  {
    "title": "Lépésszám–távolság kalkulátor",
    "url": "kalkulatorok/lepesszam-tavolsag-kalkulator.html",
    "category": "egeszseg",
    "group": "edzes-regeneracio",
    "description": "Becsült megtett távolság és gyaloglási idő kiszámítása lépésszámból, átlagos lépéshosszból és lépésszámból percenként.",
    "keywords": "lépésszám távolság séta gyaloglás lépéshossz 10000 lépés km",
    "related": [
      "kalkulatorok/futotempo-kalkulator.html",
      "kalkulatorok/kaloria-kalkulator.html",
      "kalkulatorok/pulzus-zona-kalkulator.html"
    ]
  }
]; });

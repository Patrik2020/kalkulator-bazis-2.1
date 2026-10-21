/* global module */
(function (global, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!global?.document || new URLSearchParams(global.location.search).has("__kb_static_export")) return;

  const document = global.document;
  function ready() {
    const main = document.querySelector("main[data-category-page]");
    if (!main) return;
    let language = "hu";
    const entries = new WeakMap();
    const langAttrs = new WeakMap();

    function render() {
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script,style,textarea,pre,code,[contenteditable]")) continue;
        const current = node.nodeValue;
        const last = entries.get(node);
        const original = last && last.shown === current ? last.original : current;
        const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(original);
        if (!match || !match[2]) continue;
        const translated = api.translate(match[2], language);
        const shown = match[1] + (translated === null ? match[2] : translated) + match[3];
        if (shown !== current) node.nodeValue = shown;
        if (translated !== null || last) {
          entries.set(node, { original, shown });
          if (!langAttrs.has(parent)) langAttrs.set(parent, parent.getAttribute("lang"));
          if (language !== "hu" && translated !== null) parent.setAttribute("lang", language);
          else {
            const previous = langAttrs.get(parent);
            if (previous === null) parent.removeAttribute("lang");
            else parent.setAttribute("lang", previous);
          }
        }
      }
    }

    document.addEventListener("kb:language-changed", (event) => {
      const next = event.detail?.language || "hu";
      language = api.supported.includes(next) ? next : "hu";
      render();
    });
    language = global.KB_SITE_LANGUAGE?.get() || "hu";
    render();
    const observer = new MutationObserver((changes) => {
      if (changes.some((change) => change.type === "characterData" || change.type === "childList")) render();
    });
    observer.observe(main, { childList: true, characterData: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const phrases = Object.freeze({
    "Pénzügyi kalkulátorok": ["Financial calculators", "Finanzrechner"],
    "Jövedelem, háztartási keret, hitelek, megtakarítás és befektetés átlátható témacsoportokban.": [
      "Salary, household budget, loans, savings and investments, organised by topic.",
      "Gehalt, Haushaltsbudget, Kredite, Sparen und Geldanlage – übersichtlich nach Themen geordnet."
    ],
    "PÉNZÜGYI ESZKÖZTÁR": ["FINANCIAL TOOLS", "FINANZWERKZEUGE"],
    "A fizetéstől a befektetésekig: válassz élethelyzetet, és indulhat a számolás.": [
      "From paychecks to investments: choose a situation and start calculating.",
      "Vom Gehalt bis zur Geldanlage: Wähle deine Situation und beginne zu rechnen."
    ],
    "Jövedelem és költségvetés": ["Income and budget", "Einkommen und Budget"],
    "Bér és háztartási pénzügyek áttekintéséhez.": ["Plan salaries and household finances.", "Für die Planung von Gehalt und Haushaltsfinanzen."],
    "Hitelek és ingatlan": ["Loans and property", "Kredite und Immobilien"],
    "Törlesztés, hitelképesség és önerő tervezéséhez.": ["Plan repayments, borrowing capacity and down payments.", "Für Tilgung, Kreditwürdigkeit und Eigenkapitalplanung."],
    "Megtakarítás és befektetés": ["Savings and investments", "Sparen und Geldanlage"],
    "Hosszú távú vagyonépítés, hozam és vásárlóerő modellezéséhez.": ["Model long-term savings, returns and purchasing power.", "Für langfristigen Vermögensaufbau, Rendite und Kaufkraft."],
    "Számlázás és határidők": ["Invoicing and deadlines", "Rechnungen und Fristen"],
    "Számlák teljesítési és fizetési dátumainak gyors ellenőrzéséhez.": ["Check invoice supply and payment dates.", "Leistungs- und Zahlungsdaten von Rechnungen prüfen."],
    "Kezdd ezekkel": ["Start here", "Hier starten"],
    "Kalkulátor megnyitása →": ["Open calculator →", "Rechner öffnen →"],
    "Nettó–bruttó": ["Net–gross salary", "Netto–Brutto"],
    "Számold ki a fizetésed": ["Calculate take-home pay", "Dein Nettogehalt berechnen"],
    "ETF-tervező": ["ETF planner", "ETF-Planer"],
    "Tervezd meg a befektetésed": ["Plan your investment", "Geldanlage planen"],
    "Fizetési határidő": ["Payment deadline", "Zahlungsfrist"],
    "Számlázáshoz és szerződésekhez": ["For invoices and contracts", "Für Rechnungen und Verträge"],

    "Otthon és felújítás kalkulátorok": ["Construction and renovation calculators", "Bau- und Renovierungsrechner"],
    "Anyagigény, burkolás, felületképzés és szerkezeti becslések felújításhoz vagy építkezéshez.": [
      "Estimate materials, flooring, surface finishes and structural work for renovations or construction.",
      "Materialbedarf, Bodenbeläge, Oberflächen und Bauteile für Renovierung oder Bau schätzen."
    ],
    "OTTHON ÉS FELÚJÍTÁS": ["HOME AND RENOVATION", "HAUS UND RENOVIERUNG"],
    "Tervezd meg az anyagigényt még vásárlás előtt. Válassz munkafolyamatot, és számolj egyszerűen.": [
      "Estimate materials before buying. Choose a project and calculate with ease.",
      "Plane deinen Materialbedarf vor dem Einkauf. Wähle einen Arbeitsschritt und berechne ihn."
    ],
    "Szerkezet és szigetelés": ["Structures and insulation", "Konstruktion und Dämmung"],
    "Falakhoz, födémhez, tetőhöz és szerkezeti anyagokhoz.": ["For walls, ceilings, roofs and structural materials.", "Für Wände, Decken, Dächer und Baumaterialien."],
    "Burkolás és felületek": ["Flooring and finishes", "Beläge und Oberflächen"],
    "Csempéhez, padlóhoz, festéshez, tapétához és térkövezéshez.": ["For tiling, flooring, painting, wallpaper and paving.", "Für Fliesen, Böden, Streichen, Tapeten und Pflasterarbeiten."],
    "Beton": ["Concrete", "Beton"],
    "Mennyi betonra lesz szükség?": ["How much concrete will you need?", "Wie viel Beton wird benötigt?"],
    "Tégla": ["Bricks", "Ziegel"],
    "Falazás anyagszükséglete": ["Estimate masonry materials", "Materialbedarf fürs Mauern"],
    "Festék": ["Paint", "Farbe"],
    "Tervezd meg a festékmennyiséget": ["Estimate how much paint you need", "Benötigte Farbmenge planen"],

    "Autó és közlekedés kalkulátorok": ["Car and transport calculators", "Auto- und Verkehrsrechner"],
    "Utazás, üzemanyag, fenntartási költség, műszaki összehasonlítás és környezeti becslések.": [
      "Travel, fuel, running costs, technical comparisons and environmental estimates.",
      "Reisen, Kraftstoff, Unterhaltskosten, technische Vergleiche und Umweltschätzungen."
    ],
    "Utazás és üzemanyag": ["Travel and fuel", "Reisen und Kraftstoff"],
    "Fogyasztás, tankolás, hatótáv, menetidő és útköltség tervezéséhez.": [
      "Plan fuel consumption, refuelling, range, travel time and trip costs.",
      "Für Verbrauch, Tanken, Reichweite, Fahrzeit und Reisekosten."
    ],
    "Fenntartás és költség": ["Ownership and running costs", "Unterhalt und Kosten"],
    "Éves költség, értékvesztés és kilométerenkénti ráfordítás becsléséhez.": [
      "Estimate annual costs, depreciation and cost per kilometre.",
      "Jährliche Kosten, Wertverlust und Kosten pro Kilometer schätzen."
    ],
    "Műszaki és környezeti adatok": ["Technical and environmental data", "Technik und Umwelt"],
    "Gumiméret-összehasonlításhoz és CO₂-kibocsátási becsléshez.": [
      "Compare tyre sizes and estimate CO₂ emissions.",
      "Reifengrößen vergleichen und CO₂-Ausstoß schätzen."
    ],

    "Egészség és sport kalkulátorok": ["Health and fitness calculators", "Gesundheits- und Fitnessrechner"],
    "Testösszetétel, táplálkozás, energiaigény, edzés és regeneráció óvatos értelmezéssel.": [
      "Body composition, nutrition, energy needs, training and recovery — with careful interpretation.",
      "Körperzusammensetzung, Ernährung, Energiebedarf, Training und Erholung – vorsichtig interpretiert."
    ],
    "Testsúly és testösszetétel": ["Weight and body composition", "Gewicht und Körperzusammensetzung"],
    "Testsúly, BMI, testzsír és testarányok tájékozódó becsléséhez.": [
      "Indicative estimates of weight, BMI, body fat and body ratios.",
      "Grobe Orientierung zu Gewicht, BMI, Körperfett und Körpermaßen."
    ],
    "Táplálkozás és energia": ["Nutrition and energy", "Ernährung und Energie"],
    "Kalória-, makró-, fehérje- és folyadékigény becsléséhez.": [
      "Estimate calories, macronutrients, protein and fluid needs.",
      "Kalorien-, Makronährstoff-, Protein- und Flüssigkeitsbedarf schätzen."
    ],
    "Edzés és regeneráció": ["Training and recovery", "Training und Erholung"],
    "Pulzustartományok és alvási időzítés tervezéséhez.": [
      "Plan heart-rate zones and sleep schedules.",
      "Herzfrequenzbereiche und Schlafrhythmus planen."
    ],
    "Család": ["Family", "Familie"],
    "Családi élethelyzethez kapcsolódó tájékozódó számításokhoz.": [
      "Indicative calculations for family-related situations.",
      "Orientierende Berechnungen für Familiensituationen."
    ],

    "Mindennapi kalkulátorok": ["Everyday calculators", "Alltagsrechner"],
    "Vásárlás, közös költségek, egyszerű matematika, munka és dátumok jól elkülönített csoportokban.": [
      "Shopping, shared costs, everyday maths, work and dates — grouped by topic.",
      "Einkaufen, gemeinsame Kosten, Alltagsmathematik, Arbeit und Termine – nach Themen geordnet."
    ],
    "Vásárlás és háztartás": ["Shopping and household", "Einkaufen und Haushalt"],
    "Árak, kedvezmények, egységárak és közös kiadások gyors ellenőrzéséhez.": [
      "Quickly compare prices, discounts, unit prices and shared expenses.",
      "Preise, Rabatte, Grundpreise und gemeinsame Ausgaben schnell prüfen."
    ],
    "Munka és jövedelem": ["Work and income", "Arbeit und Einkommen"],
    "Munkaidő és órabér egyszerű, gyors ellenőrzéséhez.": [
      "Quick estimates of working time and hourly pay.",
      "Arbeitszeit und Stundenlohn schnell prüfen."
    ],
    "Matematika": ["Mathematics", "Mathematik"],
    "Százalék, arány és átlag a hétköznapi számolásokhoz.": [
      "Percentages, ratios and averages for daily calculations.",
      "Prozentwerte, Verhältnisse und Mittelwerte für den Alltag."
    ],
    "Idő és dátum": ["Time and dates", "Zeit und Datum"],
    "Életkor és két dátum közötti időtartam kiszámításához.": [
      "Calculate age and intervals between dates.",
      "Alter und Zeitspannen zwischen zwei Daten berechnen."
    ],

    "Átváltók és mértékegységek": ["Converters and units", "Umrechner und Maßeinheiten"],
    "Egy közös mértékegység-átváltó 11 kategóriához, plusz külön élő devizaeszköz.": [
      "One unit converter with 11 categories, plus a live currency converter.",
      "Ein Einheitenumrechner mit elf Kategorien sowie ein separater Live-Währungsrechner."
    ],
    "Mértékegység átváltó központ": ["Unit conversion hub", "Einheiten-Umrechnungszentrale"],
    "11 kategória egyetlen eszközben: hétköznapi, műszaki és digitális egységekhez.": [
      "11 categories in one tool: everyday, technical and digital units.",
      "Elf Kategorien in einem Tool: Alltags-, technische und digitale Einheiten."
    ],
    "Deviza": ["Currency", "Währungen"],
    "Pénznemek közötti tájékozódó átváltáshoz.": ["Indicative currency conversions.", "Ungefähre Währungsumrechnungen."],
    "Keresés kalkulátorok között": ["Search calculators", "Rechner durchsuchen"],
    "Írd meg, mire lenne szükséged. A jó ötleteket felvesszük a fejlesztési listára.": [
      "Tell us what you need. We'll consider useful suggestions for future development.",
      "Sag uns, was du brauchst. Gute Vorschläge nehmen wir in unsere Entwicklungsplanung auf."
    ]
  });
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(text, lang) {
    if (lang === "hu" || !supported.includes(lang)) return null;
    const match = /^(\d+)\s+kalkulátor$/u.exec(text);
    if (match) return lang === "en"
      ? match[1] + (match[1] === "1" ? " calculator" : " calculators")
      : match[1] + " Rechner";
    const value = Object.prototype.hasOwnProperty.call(phrases, text) ? phrases[text] : null;
    return value ? value[lang === "en" ? 0 : 1] : null;
  }
  return { translate, phrases, supported };
});

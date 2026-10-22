/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const document = root.document;
  const main = document.querySelector("main[data-simple-calc]");
  if (!main) return;
  const page = main.dataset.simpleCalc;
  if (!api.pages.includes(page)) return;

  const record = new WeakMap();
  const langRecords = new WeakMap();
  let selected = "hu";
  let rendering = false;

  function updateNode(node) {
    // Preserve option values used by the calculator. Options without an explicit
    // value derive it from their label and must not be translated here.
    if (node.parentElement?.tagName === "OPTION" && !node.parentElement.hasAttribute("value")) return;
    const value = node.nodeValue;
    const last = record.get(node);
    const source = last && last.rendered === value ? last.original : value;
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(source);
    if (!match || !match[2]) return;
    const translated = api.translate(page, match[2], selected);
    const target = match[1] + (translated === null ? match[2] : translated) + match[3];
    if (target !== value) node.nodeValue = target;
    if (translated !== null || last) {
      record.set(node, { original: source, rendered: target });
      const parent = node.parentElement;
      if (!langRecords.has(parent)) langRecords.set(parent, parent.getAttribute("lang"));
      if (translated !== null && selected !== "hu") parent.setAttribute("lang", selected);
      else {
        const originalLang = langRecords.get(parent);
        if (originalLang === null) parent.removeAttribute("lang");
        else if (originalLang !== undefined) parent.setAttribute("lang", originalLang);
      }
    }
  }

  function render() {
    if (rendering) return;
    rendering = true;
    try {
      // Product names are user data, even if they happen to match a UI phrase.
      if (page === "egysegar-kalkulator") {
        main.querySelectorAll("#kalkulator .everyday-result li strong").forEach((name) => name.setAttribute("translate", "no"));
      }
      const nodes = [];
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        if (!node.parentElement?.closest('script,style,textarea,pre,code,[contenteditable],[translate="no"]')) updateNode(node);
      });
    } finally {
      rendering = false;
    }
  }

  function setLanguage(next) {
    selected = api.supported.includes(next) ? next : "hu";
    render();
  }
  document.addEventListener("kb:language-changed", (e) => setLanguage(e.detail?.language || "hu"));
  setLanguage(root.KB_SITE_LANGUAGE?.get() || "hu");
  const observer = new MutationObserver((list) => {
    if (!rendering && list.some((item) => item.type === "childList" || item.type === "characterData")) render();
  });
  observer.observe(main, { subtree: true, childList: true, characterData: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const shared = Object.freeze({
    "Számítás": ["Calculate", "Berechnen"],
    "Összehasonlítás": ["Compare", "Vergleichen"],
    "Példa": ["Example", "Beispiel"],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Árkedvezmény kalkulátor": ["Discount calculator", "Rabattrechner"],
    "Egységár kalkulátor": ["Unit price calculator", "Grundpreisrechner"],
    "Átlag kalkulátor": ["Average calculator", "Durchschnittsrechner"],
    "Százalék kalkulátor": ["Percentage calculator", "Prozentrechner"],
    "ÁFA kalkulátor": ["VAT calculator", "Mehrwertsteuer-Rechner"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"]
  });
  const discount = Object.freeze({
    "Számold ki az akciós árat, kedvezményt és megtakarítást.": [
      "Calculate the sale price, discount and amount saved.",
      "Berechne den Angebotspreis, den Rabatt und die Ersparnis."
    ],
    "Többlépcsős kedvezmény- és kuponkalkulátor": [
      "Stacked discount and coupon calculator", "Rechner für aufeinanderfolgende Rabatte und Gutscheine"
    ],
    "Egymás utáni százalékos kedvezményt, fix kupont és maximális kedvezményi korlátot kezel.": [
      "Apply consecutive percentage discounts, a fixed coupon and an optional cap on the total discount.",
      "Berücksichtigt aufeinanderfolgende prozentuale Rabatte, einen festen Gutschein und eine optionale Obergrenze für die Gesamtermäßigung."
    ],
    "Eredeti ár (Ft)": ["Original price (HUF)", "Ursprünglicher Preis (HUF)"],
    "Első kedvezmény (%)": ["First discount (%)", "Erster Rabatt (%)"],
    "Második kedvezmény (%)": ["Second discount (%)", "Zweiter Rabatt (%)"],
    "Fix kupon (Ft)": ["Fixed coupon (HUF)", "Fester Gutschein (HUF)"],
    "Maximum összes kedvezmény (Ft, 0 = nincs)": [
      "Maximum total discount (HUF, 0 = no limit)", "Maximaler Gesamtrabatt (HUF, 0 = unbegrenzt)"
    ],
    "Végső ár": ["Final price", "Endpreis"],
    "Teljes megtakarítás": ["Total savings", "Gesamtersparnis"],
    "Tényleges kedvezmény": ["Effective discount", "Effektiver Rabatt"],
    "Akciós ár és megtakarítás kiszámítása": [
      "Calculate sale prices and savings", "Angebotspreis und Ersparnis berechnen"
    ],
    "A képlet": ["The formula", "Die Formel"],
    "Egymás utáni kedvezmények": [
      "Consecutive discounts", "Aufeinanderfolgende Rabatte"
    ],
    "Miért nem egyszerűen összeadódnak a kedvezmények?": [
      "Why aren't consecutive discounts simply added together?",
      "Warum werden aufeinanderfolgende Rabatte nicht einfach addiert?"
    ],
    "100% kedvezménynél mi történik?": [
      "What happens with a 100% discount?", "Was passiert bei 100 % Rabatt?"
    ],
    "Áremelést is számol?": [
      "Does it calculate price increases too?", "Berechnet der Rechner auch Preiserhöhungen?"
    ],
    "Kuponnal együtt hogyan számoljak?": [
      "How do I combine it with a coupon?", "Wie rechne ich mit einem zusätzlichen Gutschein?"
    ],
    "ÁFÁ-t figyelembe veszi?": [
      "Does it account for VAT?", "Wird die Mehrwertsteuer berücksichtigt?"
    ],
    "Két kedvezmény nem egyszerűen összeadódik": [
      "Two discounts do not simply add up", "Zwei Rabatte werden nicht einfach addiert"
    ],
    "Kedvezményhalmozás teszt": [
      "Stacked discount test", "Test für kombinierte Rabatte"
    ],
    "Tényleges összkedvezmény": [
      "Effective total discount", "Tatsächlicher Gesamtrabatt"
    ]
  });
  const unit = Object.freeze({
    "Hasonlítsd össze termékek egységárát kiszerelés alapján.": [
      "Compare unit prices for products sold in different pack sizes.",
      "Vergleiche Grundpreise von Produkten mit unterschiedlichen Packungsgrößen."
    ],
    "Egységár-összehasonlító 5 termékhez": [
      "Unit price comparison for up to 5 products", "Grundpreisvergleich für bis zu 5 Produkte"
    ],
    "Különböző kiszereléseket közös egységre vetít, majd rangsorolja az ajánlatokat.": [
      "Converts pack sizes to a shared unit, then ranks the offers by unit price.",
      "Rechnet unterschiedliche Packungsgrößen auf eine gemeinsame Einheit um und ordnet die Angebote nach Grundpreis."
    ],
    "Megnevezés": ["Product name", "Produktname"],
    "Ár (Ft)": ["Price (HUF)", "Preis (HUF)"],
    "Mennyiség": ["Quantity", "Menge"],
    "Egységre vetítés": ["Comparison quantity", "Vergleichsmenge"],
    "Adj meg legalább egy használható terméket.": [
      "Enter at least one product with a valid price and quantity.",
      "Gib mindestens ein Produkt mit gültigem Preis und gültiger Menge ein."
    ],
    "Hasonlítsd össze a különböző kiszereléseket": [
      "Compare different pack sizes", "Vergleiche unterschiedliche Packungsgrößen"
    ],
    "Hogyan számol?": ["How is it calculated?", "Wie wird gerechnet?"],
    "Példa: két kávé összehasonlítása": [
      "Example: comparing two packs of coffee", "Beispiel: zwei Kaffeepackungen vergleichen"
    ],
    "Az olcsóbb egységár nem mindig jobb vétel": [
      "A lower unit price is not always better value",
      "Ein niedrigerer Grundpreis ist nicht immer der bessere Kauf"
    ],
    "Hogyan lesz összehasonlítható az eltérő kiszerelés?": [
      "How can different pack sizes be compared?",
      "Wie lassen sich unterschiedliche Packungsgrößen vergleichen?"
    ]
  });
  const average = Object.freeze({
    "Három átlagfajta, egy helyen": [
      "Three types of averages in one place", "Drei Mittelwerte an einem Ort"
    ],
    "Átlag kalkulátor – számtani, súlyozott és mértani átlag": [
      "Average calculator – arithmetic, weighted and geometric means",
      "Durchschnittsrechner – arithmetisches, gewichtetes und geometrisches Mittel"
    ],
    "Válaszd ki, milyen átlagot szeretnél számolni. Az eszköz az egyszerű számlistát, az eltérő súlyokat és a pozitív növekedési tényezőket külön kezeli.": [
      "Choose which type of average you want. The calculator handles number lists, weighted values and positive growth factors separately.",
      "Wähle die Art des Mittelwerts. Der Rechner verarbeitet Zahlenlisten, gewichtete Werte und positive Wachstumsfaktoren getrennt."
    ],
    "Átlagszámítás": ["Average calculation", "Mittelwertberechnung"],
    "A számokat pontosvesszővel, szóközzel vagy sortöréssel válaszd el. Tizedesvessző használható.": [
      "Separate numbers with semicolons, spaces or newlines. Decimal commas are supported.",
      "Trenne Zahlen mit Semikolon, Leerzeichen oder Zeilenumbruch. Dezimalkommas werden unterstützt."
    ],
    "Számítási mód": ["Calculation mode", "Berechnungsart"],
    "Számtani átlag + medián": ["Arithmetic mean + median", "Arithmetisches Mittel + Median"],
    "Súlyozott átlag": ["Weighted mean", "Gewichtetes Mittel"],
    "Mértani átlag": ["Geometric mean", "Geometrisches Mittel"],
    "Értékek": ["Values", "Werte"],
    "Súlyok": ["Weights", "Gewichte"],
    "Pozitív értékek vagy növekedési tényezők": [
      "Positive values or growth factors", "Positive Werte oder Wachstumsfaktoren"
    ],
    "Azonos jelentőségű értékekhez. Az eredmény mellett mediánt, összeget és elemszámot is mutatunk.": [
      "For equally important values. The result also includes the median, sum and count.",
      "Für gleich gewichtete Werte. Das Ergebnis enthält außerdem Median, Summe und Anzahl."
    ],
    "Minden értékhez ugyanazon a pozíción egy nem negatív súly tartozzon.": [
      "Give each value a nonnegative weight in the same position.",
      "Jeder Wert benötigt ein nichtnegatives Gewicht an derselben Position."
    ],
    "A mértani átlaghoz minden értéknek pozitívnak kell lennie. +5% például 1,05, −3% pedig 0,97.": [
      "All values must be positive for the geometric mean. For example, +5% is 1.05 and −3% is 0.97.",
      "Für das geometrische Mittel müssen alle Werte positiv sein. Beispielsweise entspricht +5 % dem Faktor 1,05 und −3 % dem Faktor 0,97."
    ],
    "Megbízhatósági megjegyzés:": [
      "Reliability note:", "Hinweis zur Zuverlässigkeit:"
    ],
    "Számtani átlag:": ["Arithmetic mean:", "Arithmetisches Mittel:"],
    "Súlyozott átlag:": ["Weighted mean:", "Gewichtetes Mittel:"],
    "Mértani átlag:": ["Geometric mean:", "Geometrisches Mittel:"],
    "Medián:": ["Median:", "Median:"],
    "Összeg:": ["Sum:", "Summe:"],
    "Elemszám:": ["Count:", "Anzahl:"],
    "Súlyok összege:": ["Sum of weights:", "Summe der Gewichte:"],
    "Adj meg legalább egy érvényes számot. Az értékeket pontosvesszővel, szóközzel vagy sortöréssel válaszd el.": [
      "Enter at least one valid number. Separate values with semicolons, spaces or newlines.",
      "Gib mindestens eine gültige Zahl ein. Trenne die Werte mit Semikolon, Leerzeichen oder Zeilenumbruch."
    ],
    "Adj meg érvényes értékeket a súlyozott átlaghoz.": [
      "Enter valid values for the weighted mean.",
      "Gib gültige Werte für das gewichtete Mittel ein."
    ],
    "Minden értékhez pontosan egy nem negatív súly tartozzon.": [
      "Each value must have exactly one nonnegative weight.",
      "Jeder Wert muss genau ein nichtnegatives Gewicht haben."
    ],
    "A súlyok összege legyen nagyobb nullánál.": [
      "The sum of weights must be greater than zero.",
      "Die Summe der Gewichte muss größer als null sein."
    ],
    "A mértani átlaghoz minden megadott értéknek pozitív számnak kell lennie.": [
      "All values must be positive numbers for the geometric mean.",
      "Für das geometrische Mittel müssen alle Werte positive Zahlen sein."
    ],
    "Három különböző átlag, három különböző kérdés": [
      "Three types of averages, three different questions",
      "Drei Mittelwerte, drei unterschiedliche Fragestellungen"
    ],
    "Mikor félrevezető az egyszerű átlag?": [
      "When can the simple mean be misleading?",
      "Wann kann der einfache Durchschnitt irreführend sein?"
    ],
    "Mikor használjak számtani átlagot?": [
      "When should I use the arithmetic mean?",
      "Wann sollte ich das arithmetische Mittel verwenden?"
    ],
    "Mikor kell súlyozott átlag?": [
      "When do I need a weighted mean?",
      "Wann brauche ich ein gewichtetes Mittel?"
    ],
    "Mikor jobb a mértani átlag?": [
      "When is a geometric mean better?",
      "Wann ist das geometrische Mittel geeigneter?"
    ],
    "Miért mutat mediánt is a számtani mód?": [
      "Why does arithmetic mode also show the median?",
      "Warum wird im arithmetischen Modus auch der Median angezeigt?"
    ]
  });
  const dictionaries = Object.freeze({
    "ar-kedvezmeny-kalkulator": discount,
    "egysegar-kalkulator": unit,
    "atlag-kalkulator": average
  });
  const pages = Object.freeze(Object.keys(dictionaries));
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(page, value, lang) {
    if (!["en", "de"].includes(lang) || !dictionaries[page]) return null;
    const index = lang === "en" ? 0 : 1;
    const dict = dictionaries[page];
    if (Object.prototype.hasOwnProperty.call(dict, value)) return dict[value][index];
    if (Object.prototype.hasOwnProperty.call(shared, value)) return shared[value][index];
    if (page === "egysegar-kalkulator") {
      const match = /^(\d+)\. termék$/u.exec(value);
      if (match) return match[1] + (lang === "en" ? ". product" : ". Produkt");
      const priced = /^(:\s*[\d\s.,]+\s*Ft)(\s*\/ megadott egység)(\s*– legjobb ár)?$/u.exec(value);
      if (priced) return priced[1] + (lang === "en" ? " / selected quantity" : " / Vergleichsmenge") +
        (priced[3] ? (lang === "en" ? " – best price" : " – günstigster Preis") : "");
    }
    return null;
  }
  return { translate, pages, supported, dictionaries, shared };
});

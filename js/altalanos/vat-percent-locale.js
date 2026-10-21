/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;

  const doc = root.document;
  const main = doc.querySelector("main.page-afa, main.page-szazalek");
  if (!main) return;
  const page = main.classList.contains("page-afa") ? "vat" : "percent";
  const records = new WeakMap();
  const attrRecords = new WeakMap();
  const elementLanguages = new WeakMap();
  let active = "hu";
  let rendering = false;

  function translateNode(node) {
    const current = node.nodeValue;
    const previous = records.get(node);
    const source = previous && previous.rendered === current ? previous.original : current;
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(source);
    if (!match || !match[2]) return;
    const translated = api.translate(page, match[2], active);
    const newText = match[1] + (translated === null ? match[2] : translated) + match[3];
    if (newText !== current) node.nodeValue = newText;
    if (translated !== null || previous) {
      records.set(node, { original: source, rendered: newText });
      const parent = node.parentElement;
      if (!elementLanguages.has(parent)) elementLanguages.set(parent, parent.getAttribute("lang"));
      if (translated !== null && active !== "hu") parent.setAttribute("lang", active);
      else {
        const originalLang = elementLanguages.get(parent);
        if (originalLang == null) parent.removeAttribute("lang");
        else parent.setAttribute("lang", originalLang);
      }
    }
  }

  function translateAttributes() {
    main.querySelectorAll("input[placeholder], textarea[placeholder], [aria-label]").forEach((element) => {
      for (const name of ["placeholder", "aria-label"]) {
        if (!element.hasAttribute(name)) continue;
        const current = element.getAttribute(name);
        let values = attrRecords.get(element);
        if (!values) { values = new Map(); attrRecords.set(element, values); }
        const previous = values.get(name);
        const original = previous && previous.rendered === current ? previous.original : current;
        const translated = api.translate(page, original, active);
        const rendered = translated === null ? original : translated;
        if (current !== rendered) element.setAttribute(name, rendered);
        values.set(name, { original, rendered });
      }
    });
  }

  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        if (!node.parentElement?.closest("script,style,textarea,pre,code,option,[contenteditable]")) translateNode(node);
      });
      translateAttributes();
    } finally {
      rendering = false;
    }
  }

  function setLanguage(lang) {
    active = api.supported.includes(lang) ? lang : "hu";
    render();
  }
  doc.addEventListener("kb:language-changed", (event) => setLanguage(event.detail?.language || "hu"));
  setLanguage(root.KB_SITE_LANGUAGE?.get() || "hu");
  const observer = new MutationObserver((changes) => {
    if (!rendering && changes.some((change) => change.type === "childList" || change.type === "characterData")) render();
  });
  observer.observe(main, { subtree: true, childList: true, characterData: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const shared = Object.freeze({
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Konkrét példaszámítás": ["Worked example", "Rechenbeispiel"],
    "Konkrét példák": ["Worked examples", "Rechenbeispiele"],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Mikor hasznos ez a kalkulátor?": ["When is this calculator useful?", "Wann ist dieser Rechner hilfreich?"],
    "Fontos tudni:": ["Important:", "Wichtig:"],
    "Százalék kalkulátor": ["Percentage calculator", "Prozentrechner"],
    "ÁFA kalkulátor": ["VAT calculator", "Mehrwertsteuer-Rechner"],
    "Árkedvezmény kalkulátor": ["Discount calculator", "Rabattrechner"],
    "Egységár kalkulátor": ["Unit price calculator", "Grundpreisrechner"],
    "Nettó–bruttó kalkulátor": ["Net–gross calculator", "Netto-Brutto-Rechner"],
    "Kamatos kamat kalkulátor": ["Compound interest calculator", "Zinseszinsrechner"],
    "Arány kalkulátor": ["Ratio calculator", "Verhältnisrechner"],
    "Százalékos változás kalkulátor": ["Percentage change calculator", "Rechner für prozentuale Änderung"],
    "Hogyan működik a számítás?": ["How does the calculation work?", "Wie funktioniert die Berechnung?"],
    "Hitelesség és számítási korlátok": ["Reliability and limitations", "Verlässlichkeit und Grenzen"],
    "Források és tájékoztatás:": ["Sources and information:", "Quellen und Hinweise:"]
  });
  const vat = Object.freeze({
    "ÁFA kalkulátor": ["VAT calculator", "Mehrwertsteuer-Rechner"],
    "Számold ki nettó árból a bruttót, bruttóból a nettót, valamint az ÁFA összegét.": [
      "Calculate the gross price from net, the net price from gross, and the VAT amount.",
      "Berechne den Bruttopreis aus dem Nettopreis, den Nettopreis aus dem Bruttopreis und den Mehrwertsteuerbetrag."
    ],
    "Összeg (Ft)": ["Amount (HUF)", "Betrag (HUF)"],
    "ÁFA (%)": ["VAT (%)", "MwSt. (%)"],
    "Nettóból → Bruttó": ["Net → Gross", "Netto → Brutto"],
    "Bruttóból → Nettó": ["Gross → Net", "Brutto → Netto"],
    "Nettó": ["Net", "Netto"],
    "Bruttó": ["Gross", "Brutto"],
    "Kérjük, adjon meg egy érvényes összeget.": [
      "Please enter a valid amount.", "Bitte einen gültigen Betrag eingeben."
    ],
    "Kérjük, adjon meg egy érvényes ÁFA kulcsot.": [
      "Please enter a valid VAT rate.", "Bitte einen gültigen Mehrwertsteuersatz eingeben."
    ],
    "Alanyi adómentesség 2027-ben": [
      "Small-business VAT exemption in 2027", "Kleinunternehmerbefreiung von der Umsatzsteuer 2027"
    ],
    "2027. január 1-jétől az alanyi adómentesség éves bevételi értékhatára 22 millió Ft (2026-ban 20 millió Ft). Ez a bevételi értékhatár nem azonos az itt számított áfakulccsal, ezért a nettó–bruttó számítás változatlan. Jogalap: 2025. évi LXXXIV. törvény.": [
      "From 1 January 2027, the annual turnover threshold for Hungary’s small-business VAT exemption is HUF 22 million (HUF 20 million in 2026). This turnover threshold is not a VAT rate, so it does not change the net-to-gross calculation here. Legal basis: Act LXXXIV of 2025 (Hungary).",
      "Ab 1. Januar 2027 beträgt die jährliche Umsatzgrenze für die ungarische Kleinunternehmerbefreiung von der Umsatzsteuer 22 Mio. HUF (2026: 20 Mio. HUF). Diese Umsatzgrenze ist kein Mehrwertsteuersatz; die Netto-Brutto-Berechnung bleibt unverändert. Rechtsgrundlage: ungarisches Gesetz LXXXIV von 2025."
    ],
    "Új lakóingatlan – 2027-es ÁFA-forgatókönyv (választható)": [
      "New residential property – optional 2027 VAT scenario",
      "Neue Wohnimmobilie – optionales Mehrwertsteuer-Szenario 2027"
    ],
    "Általános ÁFA-számítás (kézzel választott kulcs)": [
      "General VAT calculation (manually selected rate)",
      "Allgemeine Mehrwertsteuerberechnung (manuell gewählter Satz)"
    ],
    "Új lakóingatlan – 27%-os számítás": [
      "New residential property – 27% calculation", "Neue Wohnimmobilie – Berechnung mit 27 %"
    ],
    "Új lakóingatlan – átmeneti feltételekkel 5%-os számítás": [
      "New residential property – 5% calculation subject to transitional conditions",
      "Neue Wohnimmobilie – Berechnung mit 5 % bei erfüllten Übergangsbedingungen"
    ],
    "Jogosult rozsdaövezeti új lakás – 5%-os számítás": [
      "Eligible new home in a designated brownfield zone – 5% calculation",
      "Berechtigte neue Wohnung in einer ausgewiesenen Entwicklungszone – Berechnung mit 5 %"
    ],
    "A kiválasztott lehetőség számítási forgatókönyv, nem automatikus jogosultságvizsgálat. Az alkalmazandó kulcsot a konkrét ügylet és a hatályos jogszabály alapján ellenőrizni kell.": [
      "The selected option is a calculation scenario, not an automatic eligibility assessment. Verify the applicable VAT rate for the specific transaction under current law.",
      "Die gewählte Option ist ein Berechnungsszenario, keine automatische Prüfung der Anspruchsvoraussetzungen. Der geltende Steuersatz muss anhand des konkreten Vorgangs und der aktuellen Rechtslage geprüft werden."
    ],
    "27%-os számítás: amikor az adott ügyletre nem alkalmazható az 5%-os kedvezmény.": [
      "Calculation at 27% when the transaction does not qualify for the 5% reduced rate.",
      "Berechnung mit 27 %, wenn für den Vorgang der ermäßigte Satz von 5 % nicht gilt."
    ],
    "5%-os átmeneti számítás: csak akkor válaszd, ha az adott ügylet a jogszabályi átmeneti feltételeknek megfelel.": [
      "Transitional 5% calculation: select only if the transaction meets the statutory transitional conditions.",
      "Übergangsberechnung mit 5 %: nur wählen, wenn der Vorgang die gesetzlichen Übergangsbedingungen erfüllt."
    ],
    "5%-os rozsdaövezeti számítás: csak jogszabály szerint jogosult, kijelölt területet és ügyletet érintő esetben.": [
      "Brownfield-zone 5% calculation: only for legally eligible transactions in designated areas.",
      "Berechnung mit 5 % in Entwicklungszonen: nur für gesetzlich begünstigte Vorgänge in ausgewiesenen Gebieten."
    ],
    "ÁFA számítás nettó, bruttó és adótartalom alapján": [
      "VAT calculations: net, gross and tax amount", "Mehrwertsteuerberechnung: Netto, Brutto und Steuerbetrag"
    ],
    "ÁFA hozzáadása vagy levonása nettó és bruttó értékből.": [
      "Add or remove VAT from net and gross amounts.", "Mehrwertsteuer zu Netto- und Bruttobeträgen addieren oder herausrechnen."
    ],
    "Hogyan működik a számítás?": ["How does it work?", "Wie funktioniert die Berechnung?"],
    "Gyakori hibák ÁFA-számításnál": ["Common VAT calculation mistakes", "Häufige Fehler bei der Mehrwertsteuerberechnung"],
    "Mi a különbség nettó és bruttó ár között?": [
      "What is the difference between net and gross prices?", "Was ist der Unterschied zwischen Netto- und Bruttopreisen?"
    ],
    "Mi az adótartalom?": ["What is the tax amount?", "Was ist der Steueranteil?"],
    "Használható 5% vagy 18% ÁFA kulccsal is?": [
      "Can I also use a 5% or 18% VAT rate?", "Kann ich auch 5 % oder 18 % Mehrwertsteuer verwenden?"
    ],
    "Miért fontos számlázás előtt ellenőrizni?": [
      "Why check the calculation before invoicing?", "Warum ist die Prüfung vor der Rechnungsstellung wichtig?"
    ],
    "Adótanácsadásnak számít az eredmény?": [
      "Does the result constitute tax advice?", "Stellt das Ergebnis eine Steuerberatung dar?"
    ],
    "Az ÁFA kulcs terméktől, szolgáltatástól és jogszabályi környezettől függhet. A kalkulátor matematikai átszámítást végez, nem ad adótanácsot.": [
      "The applicable VAT rate depends on the product, service and legal circumstances. This calculator performs arithmetic conversion; it does not provide tax advice.",
      "Der anzuwendende Mehrwertsteuersatz hängt von Produkt, Dienstleistung und Rechtslage ab. Dieser Rechner führt eine mathematische Umrechnung durch und bietet keine Steuerberatung."
    ]
  });
  const percent = Object.freeze({
    "Százalék kalkulátor": ["Percentage calculator", "Prozentrechner"],
    "Számold ki egy érték adott százalékát, két szám arányát, illetve a százalékos növekedést vagy csökkenést.": [
      "Calculate a percentage of a value, the ratio of two numbers, or a percentage increase or decrease.",
      "Berechne den Prozentanteil eines Werts, das Verhältnis zweier Zahlen oder eine prozentuale Zu- oder Abnahme."
    ],
    "Egy érték adott százaléka": ["Percentage of a value", "Prozentanteil eines Werts"],
    "Alapérték, amelynek a százalékát keresed": ["Base value", "Grundwert"],
    "Keresett százalék": ["Percentage to calculate", "Gesuchter Prozentsatz"],
    "Az egyik szám hány százaléka a másiknak?": [
      "What percentage is one number of another?", "Wie viel Prozent ist eine Zahl von einer anderen?"
    ],
    "Részérték": ["Partial value", "Teilwert"],
    "Teljes érték": ["Whole value", "Gesamtwert"],
    "Százalékos növekedés vagy csökkenés": [
      "Percentage increase or decrease", "Prozentuale Zu- oder Abnahme"
    ],
    "Eredeti érték": ["Original value", "Ausgangswert"],
    "Új érték": ["New value", "Neuer Wert"],
    "eredeti érték": ["original value", "Ausgangswert"],
    "új érték": ["new value", "neuer Wert"],
    "Nullával nem lehet osztani.": ["Cannot divide by zero.", "Division durch null ist nicht möglich."],
    "A kezdőérték nem lehet nulla.": [
      "The starting value cannot be zero.", "Der Ausgangswert darf nicht null sein."
    ],
    "Százalékszámítás gyorsan és érthetően": [
      "Fast, clear percentage calculations", "Prozentrechnung – schnell und verständlich"
    ],
    "Hogyan működik a százalékszámítás?": [
      "How does percentage calculation work?", "Wie funktioniert die Prozentrechnung?"
    ],
    "Mi a leggyakoribb hiba?": [
      "What is the most common mistake?", "Was ist der häufigste Fehler?"
    ],
    "Pénzügyi számításokhoz elég?": [
      "Is it enough for financial calculations?", "Reicht das für Finanzberechnungen?"
    ],
    "Kedvezményhez is használható?": [
      "Can I use it for discounts?", "Kann ich damit Rabatte berechnen?"
    ],
    "Mit jelent az, hogy valaminek a 20%-a?": [
      "What does 20% of something mean?", "Was bedeutet 20 % von etwas?"
    ],
    "Miért nem ugyanaz a százalékpont és a százalék?": [
      "Why is a percentage point not the same as a percent?", "Warum ist ein Prozentpunkt nicht dasselbe wie ein Prozent?"
    ],
    "Százalékos változásoknál mindig figyelj az alapértékre. Egy 20%-os csökkenést nem ugyanakkora 20%-os növekedés hoz vissza az eredeti szintre.": [
      "For percentage changes, always check the base value. A 20% decrease cannot be reversed by a 20% increase.",
      "Bei prozentualen Veränderungen ist der Grundwert entscheidend. Ein Rückgang um 20 % lässt sich nicht durch eine Erhöhung um 20 % ausgleichen."
    ]
  });
  const supported = Object.freeze(["hu", "en", "de"]);
  const collections = Object.freeze({ vat, percent });
  function translate(page, value, lang) {
    if (!["en", "de"].includes(lang) || !collections[page]) return null;
    const index = lang === "en" ? 0 : 1;
    const dictionary = collections[page];
    if (Object.prototype.hasOwnProperty.call(dictionary, value)) return dictionary[value][index];
    if (Object.prototype.hasOwnProperty.call(shared, value)) return shared[value][index];
    // Preserve the numeric amount, HUF currency, formatting and VAT percentage.
    if (page === "vat") {
      const match = /^(Nettó|Bruttó|ÁFA \((\d+(?:[.,]\d+)?)%\)):\s*(.+)$/u.exec(value);
      if (match) {
        const prefix = match[1] === "Nettó"
          ? (lang === "en" ? "Net" : "Netto")
          : match[1] === "Bruttó"
            ? (lang === "en" ? "Gross" : "Brutto")
            : (lang === "en" ? "VAT" : "MwSt.") + " (" + match[2] + "%)";
        return prefix + ": " + match[3];
      }
    }
    return null;
  }
  return { supported, translate, dictionaries: collections, shared };
});

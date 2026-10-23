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
    // An option without a value uses its label as the calculation value.
    if (node.parentElement?.tagName === "OPTION" && !node.parentElement.hasAttribute("value")) return;
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
      if (element.closest('[translate="no"],[contenteditable]')) return;
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
        if (!node.parentElement?.closest('script,style,textarea,pre,code,[contenteditable],[translate="no"]')) translateNode(node);
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
    "pl. 10 (%)": ["e.g. 10 (%)", "z. B. 10 (%)"],
    "pl. 200": ["e.g. 200", "z. B. 200"],
    "pl. 50": ["e.g. 50", "z. B. 50"],
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
  // Reviewed explanatory copy for the VAT and percentage pages.
  const content = Object.freeze({
    "Hasznos volt ez a kalkulátor?": [
        "Was this calculator useful?",
        "War dieser Rechner hilfreich?"
    ],
    "Ne keresd újra. Mentsd le. Használd.": [
        "Save it. Find it quickly. Use it again.",
        "Speichern. Schnell wiederfinden. Erneut nutzen."
    ],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": [
        "Save Kalkulátor Bázis to return to this calculation in one step, or share it with someone who may find it useful.",
        "Speichere Kalkulátor Bázis, um diesen Rechner schnell wiederzufinden, oder teile ihn mit jemandem, dem er helfen könnte."
    ],
    "Könyvjelzőzöm": [
        "Bookmark",
        "Als Lesezeichen speichern"
    ],
    "Telepítem": [
        "Install",
        "Installieren"
    ],
    "Megosztom": [
        "Share",
        "Teilen"
    ],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": [
        "Open your browser menu and look for Bookmarks, Favourites or Save.",
        "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."
    ],
    "Másold ki ezt a hivatkozást, és küldd tovább.": [
        "Copy this link and share it.",
        "Kopiere diesen Link und teile ihn."
    ],
    "Az eredmény a megadott adatok és az oldalon bemutatott számítási logika alapján készül.": [
        "The result is based on your inputs and the calculation method described on this page.",
        "Das Ergebnis basiert auf deinen Eingaben und dem auf dieser Seite beschriebenen Rechenverfahren."
    ],
    "A számítások módszertana és minőségbiztosítása": [
        "Calculation methods and quality assurance",
        "Berechnungsmethoden und Qualitätssicherung"
    ],
    "Hibát találtál? Jelezd nekünk.": [
        "Found a mistake? Let us know.",
        "Fehler gefunden? Sag uns Bescheid."
    ],
    "Az ÁFA kalkulátor a mindennapi árképzés, számlázás és vásárlási ellenőrzés egyik legegyszerűbb segédeszköze. Megmutatja, hogyan alakul egy nettó ár bruttóvá, illetve bruttó összegből mekkora lehet a nettó rész és az adótartalom.": [
        "The VAT calculator is a simple tool for everyday pricing, invoicing checks and purchases. It shows how a net price becomes a gross price, or how a gross amount breaks down into a net amount and VAT.",
        "Der Mehrwertsteuer-Rechner hilft bei der alltäglichen Preisbildung, Rechnungskontrolle und beim Einkauf. Er zeigt, wie aus einem Nettopreis ein Bruttopreis wird oder wie sich ein Bruttobetrag in Nettobetrag und Mehrwertsteuer aufteilt."
    ],
    "Vállalkozóknak ajánlatadásnál, számlaellenőrzésnél és gyors árképzésnél hasznos, magánszemélyként pedig akkor, ha szeretnéd megérteni, mennyi adó van egy fogyasztói árban.": [
        "Businesses can use it for quotations, invoice checks and quick pricing. As a consumer, it helps you understand how much VAT is included in a retail price.",
        "Unternehmen können ihn für Angebote, Rechnungskontrollen und schnelle Preiskalkulationen nutzen. Verbrauchern hilft er zu verstehen, wie viel Mehrwertsteuer in einem Endpreis steckt."
    ],
    "Nettóból bruttó számításnál a nettó összeget megszorozzuk az ÁFA kulccsal növelt szorzóval. Bruttóból nettó irányban a bruttó összeget osztjuk vissza ugyanezzel a szorzóval. A kalkulátorban kézzel is megadható az ÁFA százalék, ezért nem csak a leggyakoribb kulcsokkal használható.": [
        "To calculate gross from net, multiply the net amount by one plus the VAT rate as a decimal. To calculate net from gross, divide the gross amount by the same factor. You can enter the VAT percentage manually, so the calculator is not limited to the most common rates.",
        "Für die Berechnung von Netto zu Brutto wird der Nettobetrag mit eins plus dem Mehrwertsteuersatz als Dezimalzahl multipliziert. Um von Brutto zu Netto zu rechnen, wird durch denselben Faktor geteilt. Der Mehrwertsteuersatz lässt sich manuell eingeben; der Rechner ist daher nicht auf die häufigsten Sätze beschränkt."
    ],
    "A számítás menete képlettel:": [
        "Calculation formulas:",
        "Berechnungsformeln:"
    ],
    "bruttó = nettó × (1 + áfakulcs / 100)": [
        "gross = net × (1 + VAT rate / 100)",
        "Brutto = Netto × (1 + Mehrwertsteuersatz / 100)"
    ],
    ", illetve": [
        ", and",
        "beziehungsweise"
    ],
    "nettó = bruttó / (1 + áfakulcs / 100)": [
        "net = gross / (1 + VAT rate / 100)",
        "Netto = Brutto / (1 + Mehrwertsteuersatz / 100)"
    ],
    ". Az adótartalom a bruttó és a nettó összeg különbsége.": [
        ". VAT is the difference between the gross and net amounts.",
        ". Der Steuerbetrag ist die Differenz zwischen Brutto- und Nettobetrag."
    ],
    "Ha egy termék nettó ára 10 000 Ft és az ÁFA kulcs 27%, akkor az ÁFA összege 2 700 Ft, a bruttó ár pedig 12 700 Ft. Ha fordítva, 12 700 Ft bruttó árból számolsz vissza 27%-kal, a nettó érték 10 000 Ft, az adótartalom pedig 2 700 Ft.": [
        "If a product's net price is HUF 10 000 and the VAT rate is 27%, the VAT is HUF 2700 and the gross price is HUF 12 700. Working backwards from HUF 12 700 gross at 27% gives HUF 10 000 net and HUF 2700 VAT.",
        "Bei einem Nettopreis von 10 000 HUF und 27 % Mehrwertsteuer beträgt die Steuer 2700 HUF und der Bruttopreis 12 700 HUF. Die Rückrechnung aus 12 700 HUF brutto mit 27 % ergibt 10 000 HUF netto und 2700 HUF Mehrwertsteuer."
    ],
    "árajánlat készítésekor": [
        "preparing quotations",
        "beim Erstellen von Angeboten"
    ],
    "számla ellenőrzésekor": [
        "checking invoices",
        "bei der Rechnungskontrolle"
    ],
    "nettó és bruttó árak összehasonlításakor": [
        "comparing net and gross prices",
        "beim Vergleich von Netto- und Bruttopreisen"
    ],
    "webshopos vagy vállalkozói árképzésnél": [
        "pricing products for an online shop or business",
        "bei der Preisbildung für einen Onlineshop oder ein Unternehmen"
    ],
    "A bruttó összegből egyszerűen levonják a százalékot, pedig visszaosztás kell.": [
        "Simply subtracting the percentage from the gross amount instead of dividing by the correct factor.",
        "Den Prozentsatz einfach vom Bruttobetrag abziehen, statt durch den richtigen Faktor zu teilen."
    ],
    "Nem ellenőrzik, hogy az adott termékhez vagy szolgáltatáshoz melyik kulcs tartozik.": [
        "Not checking which VAT rate applies to the product or service.",
        "Nicht prüfen, welcher Mehrwertsteuersatz für das Produkt oder die Dienstleistung gilt."
    ],
    "A 0%-os adómértéket összekeverik az alanyi vagy tárgyi adómentességgel.": [
        "Confusing a 0% VAT rate with Hungary's small-business or activity-based VAT exemptions.",
        "Einen Mehrwertsteuersatz von 0 % mit der ungarischen Kleinunternehmerbefreiung oder einer tätigkeitsbezogenen Steuerbefreiung verwechseln."
    ],
    "Árajánlatban nem jelölik egyértelműen, hogy nettó vagy bruttó összegről van szó.": [
        "Not clearly indicating whether a quotation shows net or gross amounts.",
        "In einem Angebot nicht eindeutig angeben, ob die Beträge netto oder brutto sind."
    ],
    "A nettó ár az adó nélküli érték, a bruttó ár pedig az ÁFÁ-val növelt fogyasztói ár.": [
        "The net price excludes VAT; the gross price includes VAT.",
        "Der Nettopreis enthält keine Mehrwertsteuer; im Bruttopreis ist sie enthalten."
    ],
    "Az a rész, amely a bruttó összegből ÁFA-ként jelenik meg.": [
        "The part of the gross amount attributable to VAT.",
        "Der Teil des Bruttobetrags, der auf die Mehrwertsteuer entfällt."
    ],
    "Igen, ha ezt az értéket választod vagy kézzel megadod.": [
        "Yes, by selecting or manually entering that rate.",
        "Ja, indem du diesen Satz auswählst oder manuell eingibst."
    ],
    "Mert egy rosszul megadott nettó vagy bruttó összeg hibás ajánlathoz vagy számlához vezethet.": [
        "Because an incorrect net or gross amount can lead to an incorrect quotation or invoice.",
        "Weil ein falsch eingegebener Netto- oder Bruttobetrag zu einem fehlerhaften Angebot oder einer fehlerhaften Rechnung führen kann."
    ],
    "Nem, az eredmény tájékoztató jellegű matematikai számítás.": [
        "No. The result is an indicative mathematical calculation.",
        "Nein. Das Ergebnis ist eine mathematische Berechnung zur Orientierung."
    ],
    "az ÁFA-kulcsok és adózási feltételek termékenként, szolgáltatásonként és időszakonként eltérhetnek. A kalkulátor tájékoztató jellegű matematikai átszámítást végez, nem minősül adótanácsadásnak.": [
        "VAT rates and tax conditions can vary by product, service and period. The calculator provides an indicative mathematical conversion and does not constitute tax advice.",
        "Mehrwertsteuersätze und steuerliche Bedingungen können je nach Produkt, Dienstleistung und Zeitraum variieren. Der Rechner führt eine mathematische Umrechnung zur Orientierung durch und bietet keine Steuerberatung."
    ],
    "NAV ÁFA-kulcsok és adómentes tevékenységek": [
        "Hungarian tax authority (NAV): VAT rates and exempt activities",
        "Ungarische Steuerbehörde (NAV): Mehrwertsteuersätze und steuerfreie Tätigkeiten"
    ],
    "NAV adókulcsok és járulékmértékek": [
        "Hungarian tax authority (NAV): tax and contribution rates",
        "Ungarische Steuerbehörde (NAV): Steuer- und Beitragssätze"
    ],
    "ÁFA – irányellenőrző": [
        "VAT – checking the calculation direction",
        "Mehrwertsteuer – Rechenrichtung prüfen"
    ],
    "Nettó → bruttó és bruttó → nettó nem ugyanaz a százalékművelet": [
        "Net to gross and gross to net require different percentage operations",
        "Netto zu Brutto und Brutto zu Netto erfordern unterschiedliche Prozentrechnungen"
    ],
    "Nettóból bruttó": [
        "Net to gross",
        "Von Netto zu Brutto"
    ],
    "A nettó az adó alapja; ehhez adódik hozzá a megadott áfamérték.": [
        "The net amount is the tax base; VAT at the specified rate is added to it.",
        "Der Nettobetrag bildet die Steuerbasis; die Mehrwertsteuer wird mit dem angegebenen Satz hinzugerechnet."
    ],
    "Bruttóból nettó": [
        "Gross to net",
        "Von Brutto zu Netto"
    ],
    "A bruttó már tartalmazza az adót, ezért nem helyes egyszerűen ugyanannyi százalékot levonni belőle.": [
        "The gross amount already includes VAT, so simply subtracting the same percentage is incorrect.",
        "Der Bruttobetrag enthält die Steuer bereits. Deshalb ist es falsch, einfach denselben Prozentsatz davon abzuziehen."
    ],
    "Mérték kiválasztása": [
        "Choosing a VAT rate",
        "Mehrwertsteuersatz wählen"
    ],
    "A kalkulátor matematikája csak akkor jó, ha az ügylethez valóban a megfelelő áfamértéket választottad.": [
        "The calculation is appropriate only if you select the correct VAT rate for the transaction.",
        "Die Berechnung passt nur dann zum Vorgang, wenn du den richtigen Mehrwertsteuersatz wählst."
    ],
    "Hivatalos használatnál:": [
        "For official purposes:",
        "Für die offizielle Verwendung:"
    ],
    "termék, szolgáltatás, teljesítési hely, mentesség vagy speciális adózási szabály módosíthatja az áfakezelést. A kalkulátor nem adójogi minősítő.": [
        "the product, service, place of supply, exemptions or special tax rules may affect VAT treatment. The calculator does not determine the legal tax classification.",
        "Produkt, Dienstleistung, Leistungsort, Befreiungen oder besondere Steuervorschriften können die umsatzsteuerliche Behandlung beeinflussen. Der Rechner nimmt keine steuerrechtliche Einordnung vor."
    ],
    "Forrás és ellenőrzési alap": [
        "Source and basis for checking",
        "Quelle und Prüfgrundlage"
    ],
    "NAV – Általános forgalmi adó": [
        "Hungarian tax authority (NAV) – VAT",
        "Ungarische Steuerbehörde (NAV) – Mehrwertsteuer"
    ],
    "Adózási döntéshez az aktuális NAV-tájékoztatás és szükség esetén könyvelő/adószakértő az irányadó.": [
        "For tax decisions, consult current NAV guidance and, if needed, an accountant or tax adviser.",
        "Nutze für steuerliche Entscheidungen die aktuellen Informationen der ungarischen Steuerbehörde NAV und bei Bedarf die Beratung einer Buchhaltungs- oder Steuerfachkraft."
    ],
    "ÁFA-kulcsok, nettó–bruttó és adómentes jelölések": [
        "VAT rates, net and gross prices, and exemption labels",
        "Mehrwertsteuersätze, Netto- und Bruttopreise sowie Befreiungshinweise"
    ],
    "Összeg": [
        "Amount",
        "Betrag"
    ],
    "Kiinduló összeg": [
        "Starting amount",
        "Ausgangsbetrag"
    ],
    "ÁFA-kulcs": [
        "VAT rate",
        "Mehrwertsteuersatz"
    ],
    "Nettó összeg": [
        "Net amount",
        "Nettobetrag"
    ],
    "ÁFA összege": [
        "VAT amount",
        "Mehrwertsteuerbetrag"
    ],
    "Bruttó összeg": [
        "Gross amount",
        "Bruttobetrag"
    ],
    "Kulcs": [
        "Rate",
        "Steuersatz"
    ],
    "0% nem ugyanaz, mint az alanyi adómentesség.": [
        "A 0% rate is not the same as Hungary's small-business VAT exemption.",
        "Ein Satz von 0 % ist nicht dasselbe wie die ungarische Kleinunternehmerbefreiung."
    ],
    "A 0%-os adómérték, a tárgyi mentesség, az alanyi mentesség és a területi hatályon kívüli ügylet eltérő jogcím és számlajelölés lehet. A kalkulátor csak matematikai bontást végez.": [
        "A 0% VAT rate, activity-based exemption, small-business exemption and a transaction outside the territorial scope may have different legal grounds and invoice labels. The calculator only performs the mathematical breakdown.",
        "Ein Steuersatz von 0 %, eine tätigkeitsbezogene Befreiung, die Kleinunternehmerbefreiung und ein Vorgang außerhalb des territorialen Geltungsbereichs können unterschiedliche Rechtsgrundlagen und Rechnungsangaben erfordern. Der Rechner führt nur die mathematische Aufteilung durch."
    ],
    "Források és módszertani ellenőrzés": [
        "Sources and methodology review",
        "Quellen und Prüfung der Methodik"
    ],
    "NAV – általános forgalmi adó": [
        "Hungarian tax authority (NAV) – VAT",
        "Ungarische Steuerbehörde (NAV) – Mehrwertsteuer"
    ],
    "NAV – áfakulcsok és tárgyi adómentes tevékenységek": [
        "NAV – VAT rates and activity-based exemptions",
        "NAV – Mehrwertsteuersätze und tätigkeitsbezogene Steuerbefreiungen"
    ],
    "Nemzeti Jogszabálytár – Áfa tv.": [
        "Hungarian National Legislation Database – VAT Act",
        "Ungarische nationale Rechtsdatenbank – Umsatzsteuergesetz"
    ],
    "Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.": [
        "This page provides an indicative calculation; individual decisions require information from a professional or the relevant authority.",
        "Diese Seite bietet eine Berechnung zur Orientierung. Für individuelle Entscheidungen sind Informationen einer Fachkraft oder der zuständigen Behörde erforderlich."
    ],
    "Módszertani frissítés:": [
        "Methodology updated:",
        "Methodik aktualisiert:"
    ],
    "2026. július 15.": [
        "15 July 2026",
        "15. Juli 2026"
    ],
    "A százalék kalkulátor az egyik legsokoldalúbb eszköz: akciós áraknál, fizetésemelésnél, költségnövekedésnél, ÁFA-számításnál, kamatoknál, statisztikáknál és hétköznapi összehasonlításoknál is használható.": [
        "The percentage calculator is a versatile tool for sale prices, pay rises, rising costs, VAT, interest, statistics and everyday comparisons.",
        "Der Prozentrechner ist vielseitig einsetzbar: für Angebotspreise, Gehaltserhöhungen, steigende Kosten, Mehrwertsteuer, Zinsen, Statistiken und alltägliche Vergleiche."
    ],
    "A százalékos adatok könnyen félrevezetők lehetnek, különösen akkor, ha növekedést és csökkenést hasonlítasz össze. A kalkulátor segít gyorsan ellenőrizni az eredményt és az alapértéket.": [
        "Percentages can be misleading, particularly when comparing increases and decreases. The calculator helps you quickly check the result and the base value.",
        "Prozentangaben können irreführend sein, besonders beim Vergleich von Zu- und Abnahmen. Der Rechner hilft dir, Ergebnis und Grundwert schnell zu prüfen."
    ],
    "A számítás attól függ, mit keresel: egy összeg adott százalékát, két érték arányát, vagy egy régi és új érték közötti százalékos változást. Mindhárom esetben más képletet kell használni, ezért fontos, hogy a megfelelő mezőket töltsd ki.": [
        "The formula depends on what you need: a percentage of an amount, the ratio of two values, or the percentage change between an old and a new value. Each uses a different formula, so make sure you fill in the appropriate fields.",
        "Die Formel hängt von der Fragestellung ab: Gesucht sein kann ein Prozentanteil eines Betrags, das Verhältnis zweier Werte oder die prozentuale Änderung zwischen einem alten und einem neuen Wert. Dafür gelten unterschiedliche Formeln. Fülle deshalb die passenden Felder aus."
    ],
    "Ha egy 30 000 Ft-os termékre 15% kedvezményt kapsz, a kedvezmény összege 4 500 Ft, a fizetendő ár pedig 25 500 Ft. Ha egy 120 000 Ft-os kiadás 8%-kal nő, az új összeg 129 600 Ft lesz.": [
        "A 15% discount on a product costing HUF 30 000 saves HUF 4500, leaving HUF 25 500 to pay. If an expense of HUF 120 000 rises by 8%, the new amount is HUF 129 600.",
        "Bei 15 % Rabatt auf ein Produkt für 30 000 HUF sparst du 4500 HUF und zahlst 25 500 HUF. Steigt eine Ausgabe von 120 000 HUF um 8 %, beträgt der neue Betrag 129 600 HUF."
    ],
    "akciós árak és kedvezmények ellenőrzésekor": [
        "checking sale prices and discounts",
        "beim Prüfen von Angebotspreisen und Rabatten"
    ],
    "bérnövekedés vagy költségnövekedés számításánál": [
        "calculating pay rises or cost increases",
        "beim Berechnen von Gehalts- oder Kostensteigerungen"
    ],
    "ÁFA és adótartalom értelmezésekor": [
        "understanding VAT and the tax amount",
        "beim Nachvollziehen von Mehrwertsteuer und Steueranteil"
    ],
    "arányok és statisztikai adatok összehasonlításakor": [
        "comparing proportions and statistics",
        "beim Vergleich von Anteilen und statistischen Angaben"
    ],
    "Azt, hogy az egész érték ötödét keressük. 10 000 Ft 20%-a például 2 000 Ft.": [
        "It means finding one fifth of the whole value. For example, 20% of HUF 10 000 is HUF 2000.",
        "Das bedeutet, ein Fünftel des Gesamtwerts zu bestimmen. Beispielsweise sind 20 % von 10 000 HUF gleich 2000 HUF."
    ],
    "A százalékpont két százalékérték különbségét jelöli, például 5%-ról 7%-ra emelkedés 2 százalékpont.": [
        "A percentage point is the difference between two percentage rates: a rise from 5% to 7% is 2 percentage points.",
        "Prozentpunkte bezeichnen die Differenz zwischen zwei Prozentangaben: Ein Anstieg von 5 % auf 7 % beträgt 2 Prozentpunkte."
    ],
    "Igen. Először kiszámolható a kedvezmény összege, majd az eredeti árból levonva megkapod a végső árat.": [
        "Yes. First calculate the amount saved, then subtract it from the original price to get the final price.",
        "Ja. Berechne zuerst die Ersparnis und ziehe sie dann vom ursprünglichen Preis ab, um den Endpreis zu erhalten."
    ],
    "Egyszerű ellenőrzésre igen, összetettebb pénzügyi döntéshez azonban több adat és más kalkulátor is szükséges lehet.": [
        "Yes, for simple checks. More complex financial decisions may require additional information and other calculators.",
        "Ja, für einfache Prüfungen. Komplexere finanzielle Entscheidungen können zusätzliche Informationen und weitere Rechner erfordern."
    ],
    "Az alapérték összekeverése, például hogy a kedvezmény előtti vagy utáni összegből számolsz.": [
        "Mixing up the base value, for example calculating from the price before or after the discount.",
        "Den Grundwert verwechseln, etwa indem du mit dem Betrag vor statt nach dem Rabatt rechnest oder umgekehrt."
    ],
    "Százalék – alapellenőrző": [
        "Percentages – checking the basics",
        "Prozentrechnung – Grundlagen prüfen"
    ],
    "Három hasonló kérdés, három külön művelet": [
        "Three similar questions, three different operations",
        "Drei ähnliche Fragen, drei unterschiedliche Rechenoperationen"
    ],
    "Mennyi X%-a Y-nak?": [
        "What is X% of Y?",
        "Wie viel sind X % von Y?"
    ],
    "A százalékot az alapértékre alkalmazod: Y × X / 100.": [
        "Apply the percentage to the base value: Y × X / 100.",
        "Wende den Prozentsatz auf den Grundwert an: Y × X / 100."
    ],
    "Hány százalékkal változott?": [
        "What is the percentage change?",
        "Wie groß ist die prozentuale Änderung?"
    ],
    "A különbséget a kiinduló értékhez viszonyítod, nem a végsőhöz.": [
        "Compare the difference with the starting value, not the final value.",
        "Beziehe die Differenz auf den Ausgangswert, nicht auf den Endwert."
    ],
    "Mi volt az eredeti érték?": [
        "What was the original value?",
        "Wie hoch war der ursprüngliche Wert?"
    ],
    "Fordított százalékszámításnál nem egyszerűen levonod a százalékot a végső értékből.": [
        "For reverse percentage calculations, you cannot simply subtract the percentage from the final value.",
        "Bei der umgekehrten Prozentrechnung kannst du den Prozentsatz nicht einfach vom Endwert abziehen."
    ],
    "Százalékpont ≠ százalék:": [
        "Percentage points ≠ percent:",
        "Prozentpunkte ≠ Prozent:"
    ],
    "20%-ról 25%-ra emelkedés +5 százalékpont, miközben relatíve 25%-os növekedés.": [
        "An increase from 20% to 25% is +5 percentage points, but a relative increase of 25%.",
        "Ein Anstieg von 20 % auf 25 % entspricht +5 Prozentpunkten, aber einer relativen Zunahme von 25 %."
    ],
    "Hirdetés": [
        "Advertisement",
        "Werbung"
    ],
    "Gyors százalékszámítás hétköznapi helyzetekhez.": [
        "Quick percentage calculations for everyday situations.",
        "Schnelle Prozentberechnungen für Alltagssituationen."
    ],
    "Számold ki egy rész arányát az egészhez képest.": [
        "Calculate a part as a proportion of the whole.",
        "Berechne den Anteil eines Teils am Ganzen."
    ],
    "Számold ki az akciós árat, kedvezményt és megtakarítást.": [
        "Calculate the sale price, discount and amount saved.",
        "Berechne den Angebotspreis, den Rabatt und die Ersparnis."
    ],
    "Nyisd meg a Megosztás menüt, majd válaszd a Hozzáadás a Kedvencekhez lehetőséget.": [
        "Open the Share menu, then choose Add to Favourites.",
        "Öffne das Teilen-Menü und wähle Zu Favoriten hinzufügen."
    ],
    "Nyomd meg a ⌘ + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.": [
        "Press ⌘ + D, then save the page to your bookmarks.",
        "Drücke ⌘ + D und speichere die Seite als Lesezeichen."
    ],
    "Nyisd meg a böngésző menüjét, majd válaszd a Könyvjelző hozzáadása vagy a csillag ikont.": [
        "Open the browser menu, then choose Add bookmark or the star icon.",
        "Öffne das Browsermenü und wähle Lesezeichen hinzufügen oder das Sternsymbol."
    ],
    "Nyomd meg a Ctrl + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.": [
        "Press Ctrl + D, then save the page to your bookmarks.",
        "Drücke Strg + D und speichere die Seite als Lesezeichen."
    ],
    "Hozzáadás a Főképernyőhöz": [
        "Add to Home Screen",
        "Zum Home-Bildschirm hinzufügen"
    ],
    "Nyisd meg a Safari Megosztás menüjét, válaszd a Hozzáadás a Főképernyőhöz lehetőséget, majd koppints a Hozzáadás gombra.": [
        "Open Safari's Share menu, choose Add to Home Screen, then tap Add.",
        "Öffne in Safari das Teilen-Menü, wähle Zum Home-Bildschirm und tippe auf Hinzufügen."
    ],
    "A Főképernyőhöz adás iPhone-on és iPaden Safariból végezhető el a legegyértelműbben. Nyisd meg ott az oldalt, majd használd a Megosztás menüt.": [
        "On iPhone and iPad, the simplest way to add this page to the Home Screen is through Safari. Open it there and use the Share menu.",
        "Auf iPhone und iPad lässt sich die Seite am einfachsten über Safari zum Home-Bildschirm hinzufügen. Öffne sie dort und nutze das Teilen-Menü."
    ],
    "Kövesd az útmutatót a könyvjelző mentéséhez.": [
        "Follow the instructions to save a bookmark.",
        "Folge der Anleitung, um ein Lesezeichen zu speichern."
    ],
    "Telepítési lehetőség megnyitása...": [
        "Opening the installation prompt…",
        "Installationsdialog wird geöffnet…"
    ],
    "A telepítés elindult.": [
        "Installation has started.",
        "Die Installation wurde gestartet."
    ],
    "A telepítést most nem indítottad el.": [
        "You did not start the installation this time.",
        "Du hast die Installation diesmal nicht gestartet."
    ],
    "A telepítési lehetőség jelenleg nem érhető el.": [
        "Installation is currently unavailable.",
        "Die Installation ist derzeit nicht verfügbar."
    ],
    "Kövesd az útmutatót a főképernyős hozzáadáshoz.": [
        "Follow the instructions to add this page to your Home Screen.",
        "Folge der Anleitung, um die Seite zum Home-Bildschirm hinzuzufügen."
    ],
    "Megosztási felület megnyitva.": [
        "Share dialog opened.",
        "Teilen-Dialog geöffnet."
    ],
    "A megosztást megszakítottad.": [
        "You cancelled sharing.",
        "Du hast das Teilen abgebrochen."
    ],
    "A natív megosztás nem sikerült, megpróbáljuk a linket másolni.": [
        "Sharing failed; trying to copy the link instead.",
        "Das Teilen ist fehlgeschlagen; der Link wird stattdessen kopiert."
    ],
    "A linket a vágólapra másoltuk.": [
        "Link copied to clipboard.",
        "Link in die Zwischenablage kopiert."
    ],
    "Mentési, telepítési és megosztási műveletek": [
        "Save, install and share actions",
        "Aktionen zum Speichern, Installieren und Teilen"
    ],
    "2027-es alanyi adómentességi változás": [
        "Hungarian small-business VAT exemption change in 2027",
        "Änderung der ungarischen Kleinunternehmerbefreiung 2027"
    ],
    "Számtani, súlyozott és mértani átlag egy közös eszközben, mediánnal és ellenőrző adatokkal.": [
        "Arithmetic, weighted and geometric means in one tool, with median and supporting figures.",
        "Arithmetisches, gewichtetes und geometrisches Mittel in einem Rechner, mit Median und ergänzenden Kennwerten."
    ],
    "Átlag kalkulátor": [
        "Average calculator",
        "Durchschnittsrechner"
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
    const normalized = value.replace(/\s+/gu, " ").trim();
    if (Object.prototype.hasOwnProperty.call(content, normalized)) return content[normalized][index];
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
  return { supported, translate, dictionaries: collections, shared, content };
});

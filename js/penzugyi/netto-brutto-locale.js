/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document) return;

  const document = root.document;
  const main = document.querySelector("main.page-netto");
  if (!main || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const textState = new WeakMap();
  const langState = new WeakMap();
  const attributeState = new WeakMap();
  let language = "hu";

  function annotate(parent, translated) {
    if (!parent) return;
    if (!attributeState.has(parent)) attributeState.set(parent, parent.getAttribute("lang"));
    if (translated) parent.setAttribute("lang", language);
    else {
      const previous = attributeState.get(parent);
      if (previous == null) parent.removeAttribute("lang");
      else parent.setAttribute("lang", previous);
    }
  }

  function updateText(node) {
    const current = node.nodeValue;
    const last = textState.get(node);
    const canonical = last && current === last.displayed ? last.canonical : current;
    if (!canonical || !canonical.trim()) return;
    const ws = /^(\s*)([\s\S]*?)(\s*)$/.exec(canonical);
    if (!ws) return;
    const replacement = api.translate(ws[2], language);
    const desired = ws[1] + (replacement === null ? ws[2] : replacement) + ws[3];
    if (desired !== current) node.nodeValue = desired;
    if (replacement !== null || last) {
      textState.set(node, { canonical, displayed: desired });
      annotate(node.parentElement, language !== "hu" && replacement !== null);
    }
  }

  function walkText() {
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement?.closest("script, style, textarea, pre, code, [contenteditable]")) continue;
      updateText(node);
    }
  }

  function walkAttributes() {
    main.querySelectorAll("input[placeholder], textarea[placeholder], [aria-label]").forEach((el) => {
      for (const name of ["placeholder", "aria-label"]) {
        if (!el.hasAttribute(name)) continue;
        let state = langState.get(el);
        if (!state) {
          state = new Map();
          langState.set(el, state);
        }
        const value = el.getAttribute(name);
        const previous = state.get(name);
        const canonical = previous && value === previous.displayed ? previous.canonical : value;
        const translated = api.translate(canonical, language);
        const desired = translated === null ? canonical : translated;
        if (value !== desired) el.setAttribute(name, desired);
        state.set(name, { canonical, displayed: desired });
      }
    });
  }

  function refresh() {
    walkText();
    walkAttributes();
  }

  function choose(value) {
    language = api.supported.includes(value) ? value : "hu";
    refresh();
  }

  document.addEventListener("kb:language-changed", (event) => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get() || "hu");
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((change) => change.type === "childList" || change.type === "characterData")) refresh();
  });
  observer.observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  const exact = Object.freeze({
    "Új állásajánlatot kaptál, vagy fizetésemelésre készülsz? Add meg a havi bruttó béredet, és nézd meg a becsült nettót. Ha a kézhez kapott összegből indulnál ki, válaszd a Nettóból bruttó módot.": [
      "Received a job offer or expecting a raise? Enter your monthly gross salary to estimate your take-home pay. To start with a desired net salary, select Net to gross.",
      "Du hast ein Stellenangebot oder erwartest eine Gehaltserhöhung? Gib dein monatliches Bruttogehalt ein und sieh dir das geschätzte Nettogehalt an. Für einen gewünschten Nettobetrag wähle Netto zu Brutto."
    ],
    "Bruttóból nettó": ["Gross to net", "Brutto zu Netto"],
    "Nettóból bruttó": ["Net to gross", "Netto zu Brutto"],
    "Bruttó fizetés (Ft)": ["Gross salary (HUF)", "Bruttogehalt (HUF)"],
    "Nettó fizetés (Ft)": ["Net salary (HUF)", "Nettogehalt (HUF)"],
    "SZJA-kulcs": ["Income tax rate", "Einkommensteuersatz"],
    "15% – 2026-os szabály": ["15% – 2026 rate", "15 % – Steuersatz 2026"],
    "9% – összehasonlítás": ["9% – comparison only", "9 % – nur zum Vergleich"],
    "A 9%-os opció összehasonlító számítás. Nem a 2026-os hatályos SZJA-kulcs, és nem a végleges 2027-es szabálymodell.": [
      "The 9% option is for comparison only. It is not the applicable Hungarian income-tax rate for 2026 or a confirmed 2027 tax framework.",
      "Die 9-%-Option dient nur zum Vergleich. Sie ist weder der geltende ungarische Einkommensteuersatz für 2026 noch ein bestätigtes Regelwerk für 2027."
    ],
    "25 év alatti SZJA kedvezmény": ["Income tax relief for under-25s", "Einkommensteuervergünstigung für unter 25-Jährige"],
    "Első házas kedvezmény": ["First-married-couple tax relief", "Steuervergünstigung für frisch Verheiratete"],
    "Családi kedvezmény": ["Family tax relief", "Familiensteuervergünstigung"],
    "Eltartottak száma": ["Number of dependants", "Anzahl der Unterhaltsberechtigten"],
    "Kedvezményezett eltartottak száma": ["Number of eligible dependants", "Anzahl der begünstigten Angehörigen"],
    "Az eltartottak teljes száma, ez határozza meg az egy főre jutó kedvezmény mértékét.": [
      "The total number of dependants determines the per-person tax allowance.",
      "Die Gesamtzahl der Unterhaltsberechtigten bestimmt die Höhe der Steuervergünstigung pro Person."
    ],
    "Azok száma, akik után a családi kedvezmény ténylegesen érvényesíthető.": [
      "How many dependants actually qualify for the family tax relief.",
      "Anzahl der Angehörigen, für die die Familiensteuervergünstigung tatsächlich beansprucht werden kann."
    ],
    "A 2026-os alapértelmezett számítás 15% SZJA-, 18,5% TB-járulék- és 13% munkáltatói szocho-kulccsal dolgozik. A választható 9%-os SZJA külön összehasonlító forgatókönyv.": [
      "The default 2026 scenario uses 15% Hungarian personal income tax, 18.5% employee social security contributions and 13% employer social contribution tax. The optional 9% income tax is a separate comparison scenario.",
      "Die Standardberechnung 2026 verwendet 15 % ungarische Einkommensteuer, 18,5 % Sozialversicherungsbeiträge und 13 % Arbeitgeber-Sozialbeitragsteuer. Die optionale Einkommensteuer von 9 % ist ein gesondertes Vergleichsszenario."
    ],
    "Számítás…": ["Calculating…", "Berechnung läuft…"],
    "Ellenőrizd a beállításokat": ["Check your inputs", "Bitte Eingaben überprüfen"],
    "Most nem sikerült a számítás": ["Calculation unavailable", "Berechnung derzeit nicht möglich"],
    "Nettó fizetés:": ["Net salary:", "Nettogehalt:"],
    "Bruttó fizetés:": ["Gross salary:", "Bruttogehalt:"],
    "pl. 500 000": ["e.g. 500,000", "z. B. 500.000"],
    "pl. 332 500": ["e.g. 332,500", "z. B. 332.500"],
    "Az eltartottak száma 0 és 20 közötti egész szám legyen.": [
      "The number of dependants must be a whole number between 0 and 20.",
      "Die Zahl der Unterhaltsberechtigten muss eine ganze Zahl zwischen 0 und 20 sein."
    ],
    "A megadott adatok egyik kombinációját nem tudjuk kiszámolni. Nézd át a mezőket, majd próbáld újra.": [
      "This combination of inputs cannot be calculated. Review the fields and try again.",
      "Diese Eingabekombination kann nicht berechnet werden. Bitte Eingaben prüfen und erneut versuchen."
    ],
    "Most sok számítás érkezik egyszerre. Várj néhány másodpercet, majd próbáld újra.": [
      "Too many calculation requests at the moment. Wait a few seconds and try again.",
      "Derzeit gehen zu viele Berechnungsanfragen ein. Bitte einige Sekunden warten und erneut versuchen."
    ],
    "A számítás most átmenetileg nem sikerült. Próbáld újra néhány másodperc múlva.": [
      "The calculation is temporarily unavailable. Try again in a few seconds.",
      "Die Berechnung ist vorübergehend nicht verfügbar. Bitte in wenigen Sekunden erneut versuchen."
    ],
    "A számítás eredményét most nem tudtuk megjeleníteni. Próbáld újra néhány másodperc múlva.": [
      "We could not display the calculation result. Please try again shortly.",
      "Das Berechnungsergebnis konnte nicht angezeigt werden. Bitte bald erneut versuchen."
    ],
    "A számítás a szokásosnál tovább tartott. Próbáld újra néhány másodperc múlva.": [
      "The calculation took longer than expected. Please try again shortly.",
      "Die Berechnung hat länger als erwartet gedauert. Bitte bald erneut versuchen."
    ],
    "Most nem sikerült kapcsolódni a számításhoz. Ellenőrizd az internetkapcsolatot, majd próbáld újra.": [
      "Could not connect to the calculation service. Check your internet connection and try again.",
      "Verbindung zum Berechnungsdienst fehlgeschlagen. Bitte Internetverbindung prüfen und erneut versuchen."
    ],
    "Mennyi marad az ajánlott bruttó fizetésből?": ["How much of the offered gross salary will you take home?", "Wie viel bleibt vom angebotenen Bruttogehalt?"],
    "Mekkora bruttót kérj a kívánt nettóhoz?": ["What gross salary matches your target net pay?", "Welches Bruttogehalt entspricht deinem gewünschten Nettogehalt?"],
    "Konkrét példaszámítás": ["Worked example", "Konkretes Rechenbeispiel"],
    "Mit állíts be a kedvezményeknél?": ["How should you set the tax allowances?", "Wie stellst du Steuervergünstigungen ein?"],
    "Fontos tudni:": ["Important:", "Wichtig:"],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Havi költségvetés kalkulátor": ["Monthly budget calculator", "Monatsbudget-Rechner"],
    "Hitelképesség kalkulátor": ["Loan eligibility calculator", "Kreditwürdigkeitsrechner"],
    "Infláció kalkulátor": ["Inflation calculator", "Inflationsrechner"],
    "Órabér kalkulátor": ["Hourly wage calculator", "Stundenlohn-Rechner"],
    "Források és tájékoztatás:": ["Sources and information:", "Quellen und Hinweise:"]
  });
  const prefixes = Object.freeze({
    "Bruttó fizetés:": ["Gross salary:", "Bruttogehalt:"],
    "Becsült nettó:": ["Estimated net salary:", "Geschätztes Nettogehalt:"],
    "Fizetendő TB-járulék:": ["Employee social security contributions:", "Arbeitnehmer-Sozialversicherungsbeiträge:"],
    "Ezen a kereseten érvényesített családi kedvezmény:": ["Family tax relief applied to this salary:", "Auf dieses Gehalt angewandte Familiensteuervergünstigung:"],
    "Felhasznált első házas kedvezmény:": ["First-married tax relief used:", "Genutzte Steuervergünstigung für frisch Verheiratete:"],
    "25 év alatti kedvezményből felhasználva:": ["Under-25 tax relief used:", "Genutzte Steuervergünstigung für unter 25-Jährige:"],
    "Becsült teljes munkáltatói költség:": ["Estimated total employer cost:", "Geschätzte gesamte Arbeitgeberkosten:"]
  });
  const dynamic = [
    [/^Fizetendő SZJA \((\d+(?:[.,]\d+)?%)\):(.*)$/u,
      (lang, match) => (lang === "en" ? "Income tax payable" : "Zu zahlende Einkommensteuer") +
        " (" + match[1] + "):" + match[2]],
    [/^Becsült nettó:(.*)\(cél:(.*)\)$/u,
      (lang, match) => (lang === "en" ? "Estimated net pay:" : "Geschätztes Nettogehalt:") +
        match[1] + "(" + (lang === "en" ? "target:" : "Ziel:") + match[2] + ")"]
  ];
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(value, lang) {
    if (!supported.includes(lang) || lang === "hu") return null;
    const index = lang === "en" ? 0 : 1;
    if (Object.prototype.hasOwnProperty.call(exact, value)) return exact[value][index];
    for (const [pattern, builder] of dynamic) {
      const match = value.match(pattern);
      if (match) return builder(lang, match);
    }
    for (const [source, texts] of Object.entries(prefixes)) {
      if (value.startsWith(source) && /\s/.test(value.charAt(source.length))) {
        return texts[index] + value.slice(source.length);
      }
    }
    return null;
  }
  return { translate, supported, exact, prefixes };
});

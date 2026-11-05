/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.KB_RULE_OF_THREE_LOCALE = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "harmasszabaly-kalkulator", main = doc.querySelector('main[data-batch01-calc="harmasszabaly-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        const current = node.nodeValue, old = textState.get(node), source = old?.rendered === current ? old.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
        if (!parts?.[2]) continue;
        const translated = api.translate(page, parts[2], language), value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element); if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name), source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.has("errorHref") ? originals.get("errorHref") : errorLink.getAttribute("href");
        originals.set("errorHref", source); errorLink.setAttribute("href", api.localizeReportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ }
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.has(selector) ? originals.get(selector) : (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source); const value = api.translate(page, source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; api.setLanguage(language); render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "harmasszabaly-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Hármasszabály kalkulátor | Egyenes arányosság", "Rule of Three Calculator | Direct Proportion", "Dreisatz-Rechner | Direkte Proportionalität"],
    ["Hármasszabály kalkulátor egyenes arányossági feladatokhoz. Adj meg három ismert értéket, és számold ki a negyediket képlettel, példával és magyarázattal.", "Rule of three calculator for direct-proportion problems. Enter three known values and calculate the fourth with a formula, example and explanation.", "Dreisatz-Rechner für Aufgaben mit direkter Proportionalität. Gib drei bekannte Werte ein und berechne den vierten mit Formel, Beispiel und Erklärung."],
    ["Három ismert értékből számold ki a negyediket egyenes arányosságnál.", "Calculate the fourth value from three known values in a direct proportion.", "Berechne bei direkter Proportionalität den vierten Wert aus drei bekannten Werten."],
    ["Hármasszabály kalkulátor", "Rule of Three Calculator", "Dreisatz-Rechner"],
    ["Oldj meg egyenes arányossági feladatot három ismert értékből.", "Solve a direct-proportion problem using three known values.", "Löse eine Aufgabe zur direkten Proportionalität mit drei bekannten Werten."],
    ["Mindennapi kalkulátorok", "Everyday calculators", "Alltagsrechner"],
    ["Főoldal", "Home", "Startseite"], ["Mindennapok", "Everyday", "Alltag"], ["Morzsamenü", "Breadcrumb", "Brotkrümelnavigation"],
    ["Három ismert értékből számold ki a negyediket, ha a két mennyiség egyenesen arányos.", "Calculate the fourth value from three known values when two quantities are directly proportional.", "Berechne den vierten Wert aus drei bekannten Werten, wenn zwei Größen direkt proportional sind."],
    ["A érték", "Value A", "Wert A"], ["B érték", "Value B", "Wert B"], ["C érték", "Value C", "Wert C"], ["Eredmény:", "Result:", "Ergebnis:"],
    ["X értéke", "Value of X", "Wert von X"], ["Szorzótényező A → C", "Scale factor A → C", "Skalierungsfaktor A → C"],
    ["A nem lehet nulla, mert osztóként szerepel a képletben.", "A cannot be zero because it is the divisor in the formula.", "A darf nicht null sein, da es in der Formel als Divisor verwendet wird."],
    ["Adj meg érvényes adatokat a számításhoz.", "Enter valid values to calculate.", "Gib gültige Werte für die Berechnung ein."],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"], ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"], ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."], ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Mire való a hármasszabály?", "What is the rule of three used for?", "Wofür wird der Dreisatz verwendet?"],
    ["A hármasszabály olyan hétköznapi arányossági feladatok gyors megoldására használható, amelyekben három értéket ismersz, a negyediket pedig ugyanazon arány megtartásával szeretnéd meghatározni. Tipikus példa a recept átméretezése, az egységárból több darab árának kiszámítása, anyagszükséglet skálázása vagy egy teljesítmény arányos átszámítása.", "The rule of three quickly solves everyday proportion problems where three values are known and the fourth must preserve the same ratio. Typical uses include scaling a recipe, calculating the price of several items from a unit price, adjusting material quantities or converting a performance figure proportionally.", "Mit dem Dreisatz lassen sich alltägliche Verhältnisaufgaben schnell lösen, bei denen drei Werte bekannt sind und der vierte dasselbe Verhältnis beibehalten soll. Typische Anwendungen sind das Anpassen eines Rezepts, die Berechnung des Preises mehrerer Stücke aus dem Stückpreis, die Skalierung des Materialbedarfs oder die proportionale Umrechnung eines Leistungswerts."],
    ["Ez a kalkulátor", "This calculator assumes", "Dieser Rechner setzt"], ["egyenes arányosságot", "direct proportionality", "direkte Proportionalität"],
    ["feltételez. Vagyis ha az egyik mennyiség kétszeresére nő, a másik is kétszeresére változik. Ha a kapcsolat fordított arányosságú – például több dolgozó mellett ugyanaz a munka kevesebb időt vesz igénybe –, ezt a képletet nem szabad automatikusan használni.", ". In other words, if one quantity doubles, the other doubles too. If the relationship is inversely proportional—for example, when more workers complete the same job in less time—this formula must not be used automatically.", "voraus. Verdoppelt sich eine Größe, verdoppelt sich also auch die andere. Bei umgekehrter Proportionalität – wenn beispielsweise mehr Arbeitskräfte dieselbe Arbeit in kürzerer Zeit erledigen – darf diese Formel nicht automatisch verwendet werden."],
    ["A képlet", "The formula", "Die Formel"], ["Az összefüggés:", "The relationship is:", "Es gilt:"], [", ebből", ", therefore", ", daraus folgt"],
    [". Az A érték nem lehet nulla, mert a számításban osztóként szerepel.", ". A cannot be zero because it is the divisor in the calculation.", ". A darf nicht null sein, da es in der Berechnung als Divisor verwendet wird."],
    ["Példa", "Example", "Beispiel"], ["Ha 2 kg alapanyag 5 adaghoz elegendő, akkor 8 kg ugyanilyen arány mellett 20 adaghoz elég: 5 × 8 / 2 = 20.", "If 2 kg of an ingredient is enough for 5 servings, then 8 kg is enough for 20 servings at the same ratio: 5 × 8 / 2 = 20.", "Wenn 2 kg einer Zutat für 5 Portionen reichen, reichen 8 kg bei gleichem Verhältnis für 20 Portionen: 5 × 8 / 2 = 20."],
    ["Mikor lehet félrevezető?", "When can it be misleading?", "Wann kann das Ergebnis irreführend sein?"],
    ["A valóságban sok kapcsolat csak egy bizonyos tartományban arányos. Egy építőanyag fogyása például függhet a felület állapotától, egy jármű fogyasztása pedig nem nő pontosan a sebességgel arányosan. A hármasszabály matematikailag helyes eredményt ad a megadott arányra, de azt neked kell eldöntened, hogy az adott élethelyzet valóban egyenes arányossággal modellezhető-e.", "In real life, many relationships are proportional only within a certain range. The consumption of a building material may depend on the condition of the surface, for example, while a vehicle's fuel use does not increase in exact proportion to speed. The rule of three gives a mathematically correct result for the stated ratio, but you must decide whether direct proportionality really models the situation.", "In der Praxis sind viele Zusammenhänge nur innerhalb eines bestimmten Bereichs proportional. Der Verbrauch eines Baustoffs kann zum Beispiel vom Zustand der Oberfläche abhängen, und der Kraftstoffverbrauch eines Fahrzeugs steigt nicht exakt proportional zur Geschwindigkeit. Der Dreisatz liefert für das angegebene Verhältnis ein mathematisch korrektes Ergebnis; du musst jedoch beurteilen, ob sich die konkrete Situation tatsächlich durch direkte Proportionalität abbilden lässt."],
    ["Gyakori hibák", "Common mistakes", "Häufige Fehler"], ["Nem az összetartozó mennyiségeket teszik egymás alá.", "Placing quantities that do not correspond to each other in the same column.", "Größen, die nicht zusammengehören, werden einander zugeordnet."], ["Fordított arányosságot egyenes arányosságként kezelnek.", "Treating an inverse proportion as a direct proportion.", "Umgekehrte Proportionalität wird wie direkte Proportionalität behandelt."], ["Különböző mértékegységeket előzetes átváltás nélkül kevernek.", "Mixing different units without converting them first.", "Unterschiedliche Einheiten werden ohne vorherige Umrechnung vermischt."], ["Nullát adnak meg az A értéknél.", "Entering zero for A.", "Für A wird null eingegeben."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"], ["Használhatok tizedes számokat?", "Can I use decimal numbers?", "Kann ich Dezimalzahlen verwenden?"], ["Igen. Ponttal vagy vesszővel megadott tizedes értékekkel is számolhatsz.", "Yes. You can enter decimal values using either a point or a comma.", "Ja. Dezimalwerte können sowohl mit Punkt als auch mit Komma eingegeben werden."], ["Lehet az eredmény negatív?", "Can the result be negative?", "Kann das Ergebnis negativ sein?"], ["Matematikailag igen, ha a bemeneti előjelek ezt adják, de hétköznapi mennyiségeknél gondold át, van-e értelme negatív értéknek.", "Mathematically, yes, if the signs of the inputs produce one. For everyday quantities, however, consider whether a negative value is meaningful.", "Mathematisch ja, wenn sich dies aus den Vorzeichen der Eingaben ergibt. Bei alltäglichen Größen solltest du jedoch prüfen, ob ein negativer Wert sinnvoll ist."], ["Miben más ez, mint az arány kalkulátor?", "How is this different from the ratio calculator?", "Wie unterscheidet sich dieser Rechner vom Verhältnisrechner?"], ["Az arány kalkulátor két érték kapcsolatát mutatja meg, ez az eszköz pedig egy ismert arányból számolja ki a hiányzó negyedik értéket.", "The ratio calculator shows the relationship between two values, while this tool calculates a missing fourth value from a known proportion.", "Der Verhältnisrechner zeigt die Beziehung zwischen zwei Werten; dieses Werkzeug berechnet dagegen aus einem bekannten Verhältnis den fehlenden vierten Wert."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"], ["Arány kalkulátor", "Ratio calculator", "Verhältnisrechner"], ["Százalék kalkulátor", "Percentage calculator", "Prozentrechner"], ["Átlag kalkulátor", "Average calculator", "Durchschnittsrechner"], ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"], ["2026. augusztus 21.", "21 August 2026", "21. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"], ["A kalkulátor az egyenes arányosság alapképletét alkalmazza. Az eredmény csak akkor írja le jól a valós helyzetet, ha a vizsgált mennyiségek között valóban ilyen kapcsolat áll fenn.", "The calculator applies the basic formula for direct proportionality. The result describes the real situation accurately only when the quantities are genuinely related in this way.", "Der Rechner verwendet die Grundformel der direkten Proportionalität. Das Ergebnis bildet die reale Situation nur dann korrekt ab, wenn zwischen den betrachteten Größen tatsächlich ein solcher Zusammenhang besteht."], ["Számítási módszertan", "Calculation methodology", "Berechnungsmethodik"], ["Hibát találtál? Jelezd.", "Found an error? Let us know.", "Fehler gefunden? Gib uns Bescheid."], ["Hirdetés", "Advertisement", "Anzeige"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  let activeLanguage = "hu";
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    const match = /^([ABC]): adj meg érvényes számot\.$/u.exec(normalized);
    if (match) return `${match[1]}: ${language === "en" ? "enter a valid number." : "Gib eine gültige Zahl ein."}`;
    return null;
  }
  function language() { return activeLanguage; }
  function setLanguage(next) { activeLanguage = supported.includes(next) ? next : "hu"; }
  function formatNumber(value, languageCode = language(), maximumFractionDigits = 4) {
    const locale = languageCode === "en" ? "en-GB" : languageCode === "de" ? "de-DE" : "hu-HU";
    return new Intl.NumberFormat(locale, { maximumFractionDigits, minimumFractionDigits: 0 }).format(value);
  }
  function localizeReportHref(sourceHref, languageCode) {
    if (languageCode === "hu" || !supported.includes(languageCode)) return sourceHref;
    const url = new URL(sourceHref);
    url.searchParams.set("subject", languageCode === "en" ? "Error report – Rule of Three Calculator" : "Fehlermeldung – Dreisatz-Rechner");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, language, setLanguage, formatNumber, localizeReportHref };
});

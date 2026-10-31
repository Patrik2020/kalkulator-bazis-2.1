/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "egyszeri-max-1rm-kalkulator";
  const main = doc.querySelector('main[data-batch02-calc="egyszeri-max-1rm-kalkulator"]');
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
        const translated = api.translate(page, parts[2], language);
        const value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element);
        if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name);
          const source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.has("errorHref") ? originals.get("errorHref") : errorLink.getAttribute("href");
        originals.set("errorHref", source);
        errorLink.setAttribute("href", api.reportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Retain source data. */ }
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.has(selector) ? originals.get(selector) : (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source;
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
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "egyszeri-max-1rm-kalkulator";
  const dictionary = Object.freeze({
    "hu-HU": ["en-GB", "de-DE"],
    "1RM kalkulátor | Kalkulátor Bázis": ["One-Rep Max Calculator | Kalkulátor Bázis", "1RM-Rechner | Kalkulátor Bázis"],
    "1RM kalkulátor": ["One-Rep Max Calculator", "1RM-Rechner"],
    "1RM": ["1RM", "1RM"], "Epley": ["Epley", "Epley"], "Brzycki": ["Brzycki", "Brzycki"],
    "Becsült egyismétléses maximum számítása Epley- és Brzycki-képlettel a használt súly és az ismétlésszám alapján.": ["Estimate your one-rep max with the Epley and Brzycki formulas using the weight lifted and number of repetitions.", "Schätze dein Einerwiederholungsmaximum mit den Formeln von Epley und Brzycki anhand des Gewichts und der Wiederholungen."],
    "Egészség és sport kalkulátorok": ["Health and fitness calculators", "Rechner für Gesundheit und Sport"],
    "Főoldal": ["Home", "Startseite"], "Egészség & sport": ["Health & fitness", "Gesundheit & Sport"],
    "Használt súly (kg)": ["Weight lifted (kg)", "Verwendetes Gewicht (kg)"],
    "Szabályos ismétlések": ["Repetitions with good form", "Sauber ausgeführte Wiederholungen"],
    "Eredmény:": ["Result:", "Ergebnis:"], "Hirdetés": ["Advertisement", "Anzeige"],
    "Epley becslés:": ["Epley estimate:", "Schätzung nach Epley:"],
    "Brzycki becslés:": ["Brzycki estimate:", "Schätzung nach Brzycki:"],
    "Átlagos becslés:": ["Average estimate:", "Durchschnittliche Schätzung:"],
    "80% terhelés:": ["Load at 80%:", "Belastung bei 80 %:"],
    "Súly: adj meg érvényes számot.": ["Weight: enter a valid number.", "Gewicht: Gib eine gültige Zahl ein."],
    "Súly: az érték legyen nagyobb nullánál.": ["Weight must be greater than zero.", "Das Gewicht muss größer als null sein."],
    "Ismétlésszám: adj meg érvényes számot.": ["Repetitions: enter a valid number.", "Wiederholungen: Gib eine gültige Zahl ein."],
    "Ismétlésszám: az érték legyen nagyobb nullánál.": ["Repetitions must be greater than zero.", "Die Wiederholungszahl muss größer als null sein."],
    "Az ismétlésszám 1 és 12 közötti egész szám legyen.": ["Enter a whole number of repetitions from 1 to 12.", "Gib eine ganze Wiederholungszahl zwischen 1 und 12 ein."],
    "Adj meg érvényes adatokat.": ["Enter valid values.", "Gib gültige Werte ein."],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek": ["Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Mi az 1RM?": ["What is a one-rep max?", "Was ist das Einerwiederholungsmaximum?"],
    "Az 1RM, vagyis egyismétléses maximum annak a terhelésnek a becslése, amelyből ideális körülmények között egy szabályos ismétlés végezhető. A kalkulátor nem kér valódi maximális próbát: egy többismétléses sorozatból készít matematikai közelítést.": ["Your one-rep max (1RM) is an estimate of the weight you could lift once with good form under ideal conditions. This calculator uses a set of several repetitions to estimate it, without requiring an actual maximal lift.", "Das Einerwiederholungsmaximum (1RM) ist eine Schätzung des Gewichts, das du unter idealen Bedingungen einmal sauber bewegen könntest. Der Rechner leitet es aus einem Satz mit mehreren Wiederholungen ab; ein tatsächlicher Maximalversuch ist nicht nötig."],
    "Két gyakori képletet használ: az": ["It uses two common formulas: the", "Er verwendet zwei gängige Formeln: die"],
    "képletet (súly × (1 + ismétlés/30)) és a": ["formula (weight × (1 + repetitions/30)) and the", "Formel (Gewicht × (1 + Wiederholungen/30)) und die"],
    "képletet (súly × 36 / (37 − ismétlés)). A két eredmény átlagát is megmutatja, mert egyik képlet sem pontos minden embernél és minden gyakorlatnál.": ["formula (weight × 36 / (37 − repetitions)). It also shows the average because neither formula is accurate for every person or exercise.", "Formel (Gewicht × 36 / (37 − Wiederholungen)). Der Rechner zeigt auch den Mittelwert an, da keine der Formeln für jede Person und jede Übung genau ist."],
    "Milyen ismétléstartományban érdemes használni?": ["Which repetition range works best?", "Für welchen Wiederholungsbereich eignet sich die Schätzung?"],
    "A becslés általában alacsony-közepes ismétlésszámnál használható a legértelmesebben. Ezért a kalkulátor 1–12 szabályos ismétlést enged. Nagyon magas ismétlésszámnál az állóképesség, a technika és a fáradás egyre jobban torzíthatja az 1RM-közelítést.": ["The estimate is usually most useful with a low to moderate number of repetitions, so the calculator accepts 1–12 repetitions performed with good form. At higher rep counts, endurance, technique and fatigue can increasingly skew the estimate.", "Die Schätzung ist meist bei niedrigen bis mittleren Wiederholungszahlen am sinnvollsten. Deshalb erlaubt der Rechner 1–12 sauber ausgeführte Wiederholungen. Bei höheren Wiederholungszahlen können Ausdauer, Technik und Ermüdung das Ergebnis zunehmend verzerren."],
    "Példa": ["Example", "Beispiel"],
    "80 kg-ból 5 szabályos ismétlés esetén az Epley képlet kb. 93,3 kg, a Brzycki képlet pontosan 90 kg 1RM-et becsül. A kettő átlaga kb. 91,7 kg, ennek 80%-a körülbelül 73,3 kg.": ["For 5 repetitions with good form at 80 kg, Epley estimates about 93.3 kg and Brzycki exactly 90 kg. Their average is about 91.7 kg; 80% of that is around 73.3 kg.", "Bei 5 sauber ausgeführten Wiederholungen mit 80 kg schätzt Epley etwa 93,3 kg und Brzycki genau 90 kg. Der Mittelwert liegt bei etwa 91,7 kg; 80 % davon sind rund 73,3 kg."],
    "Biztonságos használat": ["Using the estimate safely", "Die Schätzung sicher nutzen"],
    "A becsült 1RM nem kötelező célterhelés, és nem jelenti azt, hogy tényleges maximális próbát kell végezni. Technikailag összetett gyakorlatnál, fájdalom, sérülés vagy bizonytalanság esetén a terhelés megválasztását érdemes képzett szakemberrel egyeztetni.": ["The estimated 1RM is not a required training load and does not mean you need to attempt a maximal lift. For technically demanding exercises, pain, injury or uncertainty, discuss your choice of load with a qualified professional.", "Das geschätzte 1RM ist keine verbindliche Trainingslast und erfordert keinen Maximalversuch. Bei technisch anspruchsvollen Übungen, Schmerzen, Verletzungen oder Unsicherheit solltest du die Wahl des Gewichts mit einer qualifizierten Fachperson besprechen."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Pontos az 1RM becslés?": ["Is the 1RM estimate accurate?", "Wie genau ist die 1RM-Schätzung?"],
    "Nem teljesen. Képletalapú közelítés, amely egyénenként, gyakorlatonként és edzettségi szintenként eltérhet a tényleges maximumtól.": ["Not exactly. It is a formula-based estimate that can differ from your actual maximum depending on the person, exercise and training level.", "Nicht vollständig. Die formelbasierte Schätzung kann je nach Person, Übung und Trainingsstand vom tatsächlichen Maximum abweichen."],
    "Miért két képletet mutat?": ["Why does it show two formulas?", "Warum zeigt der Rechner zwei Formeln?"],
    "Az Epley és Brzycki eltérően közelít, ezért a különbség jól jelzi, hogy a szám nem laborpontosságú.": ["Epley and Brzycki estimate the maximum differently. The difference is a useful reminder that neither result is exact.", "Epley und Brzycki schätzen den Höchstwert unterschiedlich. Die Abweichung zeigt, dass kein Ergebnis auf das Kilogramm genau ist."],
    "Muszáj kipróbálnom a kiszámolt maximumot?": ["Do I need to try lifting the estimated maximum?", "Muss ich das geschätzte Maximum tatsächlich heben?"],
    "Nem. A becslés főleg edzéstervezési viszonyítási pont; maximális próbát nem szükséges végezni.": ["No. The estimate is mainly a reference point for planning your training; a maximal attempt is unnecessary.", "Nein. Die Schätzung dient vor allem als Orientierung für die Trainingsplanung; ein Maximalversuch ist nicht nötig."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Ähnliche Rechner"],
    "feherje szukseglet": ["Protein needs", "Proteinbedarf"], "pulzus zona": ["Heart rate zones", "Herzfrequenzzonen"], "kaloria": ["Calories", "Kalorien"],
    "Utolsó tartalmi frissítés:": ["Content last reviewed:", "Inhalt zuletzt geprüft:"],
    "2026. augusztus 21.": ["21 August 2026", "21. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    "Edzéstervezési becslés, nem teljesítménygarancia. A tényleges 1RM függ a technikától, fáradtságtól, gyakorlattól és egyéni adottságoktól.": ["An estimate for planning training, not a guarantee of performance. Your actual 1RM depends on technique, fatigue, the exercise and individual factors.", "Eine Schätzung für die Trainingsplanung, keine Leistungsgarantie. Das tatsächliche 1RM hängt von Technik, Ermüdung, Übung und individuellen Faktoren ab."],
    "Számítási módszertan": ["Calculation methodology", "Berechnungsmethodik"],
    "Hibát találtál? Jelezd.": ["Found an error? Let us know.", "Fehler gefunden? Melde ihn."]
  });
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) {
    if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    if (language === "en" && /^\d[\d\s\u00a0]*(?:,\d+)? kg$/u.test(normalized))
      return normalized.slice(0, -3).replace(/[\s\u00a0]/gu, "").replace(",", ".") + " kg";
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – One-Rep Max Calculator" : "Fehlermeldung – 1RM-Rechner");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

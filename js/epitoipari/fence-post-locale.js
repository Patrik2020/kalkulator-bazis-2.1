/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "kerites-oszlop-kalkulator", main = doc.querySelector('main[data-batch03-calc="kerites-oszlop-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();
  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  }
  function render() {
    if (rendering) return; rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        const current = node.nodeValue, old = textState.get(node), source = old?.rendered === current ? old.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source); if (!parts?.[2]) continue;
        const translated = api.translate(page, parts[2], language), value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element); if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name), source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source; if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) { const source = originals.get("errorHref") || errorLink.getAttribute("href"); originals.set("errorHref", source); errorLink.setAttribute("href", api.reportHref(source, language)); }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) { if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent); try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ } }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content); originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source; if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "kerites-oszlop-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Kerítés oszlop kalkulátor | Kalkulátor Bázis", "Fence Post Calculator | Kalkulátor Bázis", "Zaunpfosten-Rechner | Kalkulátor Bázis"],
    ["Becsüld meg egy egyenes, kapu nélküli kerítésszakaszhoz szükséges mezők és oszlopok számát a teljes hossz és a legnagyobb oszloptávolság alapján.", "Estimate the number of bays and posts required for a straight fence section without a gate, based on its total length and maximum post spacing.", "Schätze die Anzahl der Felder und Pfosten für einen geraden Zaunabschnitt ohne Tor anhand der Gesamtlänge und des maximalen Pfostenabstands."],
    ["Kerítés oszlop kalkulátor", "Fence Post Calculator", "Zaunpfosten-Rechner"], ["Kerítés oszlop", "Fence posts", "Zaunpfosten"],
    ["Otthon és felújítás kalkulátorok", "Home and renovation calculators", "Rechner für Haus und Renovierung"], ["Főoldal", "Home", "Startseite"], ["Otthon & felújítás", "Home & renovation", "Haus & Renovierung"],
    ["Egyenes kerítésszakasz hossza (m)", "Length of straight fence section (m)", "Länge des geraden Zaunabschnitts (m)"], ["Legnagyobb oszloptávolság (m)", "Maximum post spacing (m)", "Maximaler Pfostenabstand (m)"],
    ["Eredmény:", "Result:", "Ergebnis:"], ["Kerítésmezők száma", "Number of fence bays", "Anzahl der Zaunfelder"], ["Oszlopok száma", "Number of posts", "Anzahl der Pfosten"], ["Tényleges átlagos osztás", "Actual average spacing", "Tatsächlicher mittlerer Abstand"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"], ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."], ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"], ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"], ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."], ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Hogyan becsüli az oszlopok számát?", "How does the calculator estimate the number of posts?", "Wie schätzt der Rechner die Anzahl der Pfosten?"], ["A kalkulátor egyetlen egyenes, két végponttal rendelkező kerítésszakaszt feltételez. A teljes hosszt elosztja a megadott legnagyobb oszloptávolsággal, a szükséges mezők számát felfelé kerekíti, majd ehhez egy záró oszlopot ad. Így az elkészült átlagos osztás nem lesz nagyobb a megadott határnál.", "The calculator assumes one straight fence section with two endpoints. It divides the total length by the maximum post spacing, rounds the required number of bays up, then adds one end post. This ensures that the resulting average spacing does not exceed the specified limit.", "Der Rechner geht von einem geraden Zaunabschnitt mit zwei Endpunkten aus. Er teilt die Gesamtlänge durch den maximalen Pfostenabstand, rundet die erforderliche Zahl der Felder auf und addiert einen Endpfosten. Dadurch überschreitet der resultierende mittlere Abstand den angegebenen Grenzwert nicht."],
    ["Például 20 méteres szakasznál és legfeljebb 2,5 méteres osztásnál 8 mező és 9 oszlop szükséges, az átlagos oszloptávolság pontosan 2,5 méter.", "For example, a 20-metre section with a maximum spacing of 2.5 metres requires 8 bays and 9 posts, giving an average post spacing of exactly 2.5 metres.", "Ein 20 Meter langer Abschnitt mit höchstens 2,5 Metern Abstand benötigt beispielsweise 8 Felder und 9 Pfosten; der mittlere Pfostenabstand beträgt genau 2,5 Meter."],
    ["Mire nem alkalmas ez a gyors becslés?", "What is this quick estimate not suitable for?", "Wofür eignet sich diese schnelle Schätzung nicht?"], ["Sarkok, kapuk, különálló szakaszok, lejtős terep vagy eltérő mezőszélességek esetén további oszlopokra lehet szükség. A szerkezeti méretezést, az alapozást és az oszloptávolság megengedett maximumát a választott kerítésrendszer gyártói előírása és a helyi körülmények alapján kell meghatározni.", "Corners, gates, separate sections, sloping ground or varying bay widths may require additional posts. Structural design, foundations and the permitted maximum post spacing must be determined from the chosen fence system's manufacturer instructions and local conditions.", "Bei Ecken, Toren, getrennten Abschnitten, Gefälle oder unterschiedlichen Feldbreiten können zusätzliche Pfosten erforderlich sein. Statik, Fundamente und der zulässige maximale Pfostenabstand sind nach den Herstellervorgaben des gewählten Zaunsystems und den örtlichen Bedingungen festzulegen."],
    ["Példa", "Example", "Beispiel"], ["Ha 17 méter hosszú kerítést legfeljebb 2,5 méteres osztással építesz, 17 / 2,5 = 6,8, tehát 7 mező szükséges. Egy folyamatos egyenes szakaszon ehhez 8 oszlop tartozik, az átlagos osztás kb. 2,43 méter.", "For a 17-metre fence with a maximum spacing of 2.5 metres, 17 / 2.5 = 6.8, so 7 bays are required. A continuous straight section therefore needs 8 posts, with an average spacing of about 2.43 metres.", "Bei einem 17 Meter langen Zaun mit höchstens 2,5 Metern Abstand ergibt 17 / 2,5 = 6,8; daher sind 7 Felder erforderlich. Ein durchgehender gerader Abschnitt benötigt somit 8 Pfosten, bei einem mittleren Abstand von etwa 2,43 Metern."],
    ["Anyagtervezési tipp", "Material planning tip", "Tipp zur Materialplanung"], ["A darabszám után külön számold ki az oszlopok alapjához szükséges betont, valamint a választott panel, deszka vagy háló tényleges modulméreteit. A névleges és szerelési méret eltérhet.", "After calculating the quantities, work out the concrete required for the post foundations separately and check the actual module dimensions of the selected panels, boards or mesh. Nominal and installation dimensions may differ.", "Berechne anschließend den Betonbedarf für die Pfostenfundamente separat und prüfe die tatsächlichen Modulmaße der gewählten Paneele, Bretter oder des Gitters. Nenn- und Montagemaße können voneinander abweichen."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"], ["A kapuoszlopokat beleszámolja?", "Are gate posts included?", "Werden Torpfosten mitgerechnet?"], ["Nem. A modell kapu nélküli, egyenes szakaszt feltételez. Kapunál a rendszer kialakításától függően külön oszlopok szükségesek.", "No. The model assumes a straight section without a gate. A gate requires separate posts depending on the system design.", "Nein. Das Modell setzt einen geraden Abschnitt ohne Tor voraus. Je nach Ausführung des Systems sind am Tor separate Pfosten erforderlich."], ["Miért kerekít felfelé?", "Why does it round up?", "Warum wird aufgerundet?"], ["Azért, hogy a tényleges átlagos oszloptávolság ne lépje túl a megadott maximumot.", "So that the actual average post spacing does not exceed the specified maximum.", "Damit der tatsächliche mittlere Pfostenabstand den angegebenen Höchstwert nicht überschreitet."], ["Saroknál ugyanígy számolhatok?", "Can I calculate a corner in the same way?", "Kann ich eine Ecke genauso berechnen?"], ["A külön irányba forduló szakaszokat célszerű külön-külön kiszámolni, majd a közös sarokoszlopot csak egyszer számolni.", "Calculate sections that change direction separately, then count the shared corner post only once.", "Abschnitte mit unterschiedlicher Richtung sollten getrennt berechnet werden; der gemeinsame Eckpfosten wird anschließend nur einmal gezählt."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"], ["beton", "concrete", "Beton"], ["tegla", "brick", "Ziegel"], ["terkovezes", "paving", "Pflasterung"], ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"], ["2026. augusztus 21.", "21 August 2026", "21. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"], ["Gyors darabszám-becslés egyenes, kapu nélküli kerítésszakaszra. A végleges kiosztást és szerkezeti méretezést a konkrét rendszer előírásaihoz kell igazítani.", "A quick quantity estimate for a straight fence section without a gate. The final layout and structural design must follow the requirements of the specific system.", "Eine schnelle Mengenschätzung für einen geraden Zaunabschnitt ohne Tor. Die endgültige Einteilung und statische Auslegung müssen den Vorgaben des konkreten Systems entsprechen."], ["Számítási módszertan", "Calculation methodology", "Berechnungsmethodik"], ["Hibát találtál? Jelezd.", "Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."], ["Hirdetés", "Advertisement", "Anzeige"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const locale = language => language === "en" ? "en-GB" : "de-DE";
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)]; if (pair) return pair[language === "en" ? 0 : 1];
    let match = /^(\d+) db$/u.exec(normalized);
    if (match) return `${match[1]} ${language === "en" ? "pcs" : "Stk."}`;
    match = /^(\d[\d\s]*)(?:,([0-9]+))? m$/u.exec(normalized);
    if (match) { const number = Number(`${match[1].replace(/\s/gu, "")}.${match[2] || "0"}`); return `${new Intl.NumberFormat(locale(language), { maximumFractionDigits: 2 }).format(number)} m`; }
    match = /^(Kerítéshossz|Oszloptávolság): (adj meg érvényes számot\.|az érték legyen nagyobb nullánál\.)$/u.exec(normalized);
    if (match) {
      const label = match[1] === "Kerítéshossz" ? (language === "en" ? "Fence length" : "Zaunlänge") : (language === "en" ? "Post spacing" : "Pfostenabstand");
      const error = match[2].startsWith("adj") ? (language === "en" ? "enter a valid number." : "Gib eine gültige Zahl ein.") : (language === "en" ? "the value must be greater than zero." : "Der Wert muss größer als null sein.");
      return `${label}: ${error}`;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source); url.searchParams.set("subject", language === "en" ? "Error report – Fence Post Calculator" : "Fehlermeldung – Zaunpfosten-Rechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Fence Post Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/kerites-oszlop-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Zaunpfosten-Rechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/kerites-oszlop-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n"); return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

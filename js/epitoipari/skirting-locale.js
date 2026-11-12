/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "szegolec-kalkulator";
  const main = doc.querySelector('main[data-batch05-calc="szegolec-kalkulator"]');
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
        let state = attrState.get(element);
        if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name), source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.get("errorHref") || errorLink.getAttribute("href");
        originals.set("errorHref", source);
        errorLink.setAttribute("href", api.reportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ }
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "szegolec-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Szegőléc kalkulátor | Kalkulátor Bázis", "Skirting Board Calculator | Kalkulátor Bázis", "Sockelleisten-Rechner | Kalkulátor Bázis"],
    ["Szegőléc szükséges hosszának és darabszámának becslése kerületből, nyílásokból, szálhosszból és ráhagyásból.", "Estimate the required length and number of skirting boards from the perimeter, openings, board length and cutting allowance.", "Schätze die benötigte Länge und Anzahl der Sockelleisten anhand von Umfang, Öffnungen, Leistenlänge und Verschnitt."],
    ["Szegőléc kalkulátor", "Skirting Board Calculator", "Sockelleisten-Rechner"], ["Szegőléc", "Skirting boards", "Sockelleisten"],
    ["Otthon és felújítás kalkulátorok", "Home and renovation calculators", "Rechner für Haus und Renovierung"],
    ["Főoldal", "Home", "Startseite"], ["Otthon & felújítás", "Home & renovation", "Haus & Renovierung"], ["Morzsamenü", "Breadcrumb", "Brotkrümelnavigation"],
    ["Burkolandó kerület (m)", "Perimeter to cover (m)", "Zu verkleidender Umfang (m)"],
    ["Kihagyandó nyílások összesen (m)", "Total openings to exclude (m)", "Öffnungen ohne Sockelleiste insgesamt (m)"],
    ["Egy szál hossza (m)", "Length per board (m)", "Länge je Leiste (m)"], ["Ráhagyás (%)", "Cutting allowance (%)", "Verschnitt (%)"],
    ["Eredmény:", "Result:", "Ergebnis:"], ["Nettó kerület", "Net perimeter", "Nettoumfang"], ["Ráhagyással szükséges", "Required including allowance", "Bedarf einschließlich Verschnitt"], ["Szükséges szál", "Boards required", "Benötigte Leisten"], ["Megvásárolt hossz", "Purchased length", "Gekaufte Länge"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"], ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"], ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favourites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."], ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Hogyan számol a szegőléc kalkulátor?", "How does the skirting board calculator work?", "Wie rechnet der Sockelleisten-Rechner?"],
    ["A kiindulás a helyiség vagy helyiségek burkolandó falkerülete. Ebből levonhatod azokat a nyílásokat, ahol biztosan nem kerül szegőléc, például egy ajtó szélességét. A maradó hosszra ráhagyást alkalmazunk, majd elosztjuk a megvásárolható szál hosszával.", "Start with the wall perimeter to be fitted in one or more rooms. Subtract openings where no skirting board will be installed, such as the width of a doorway. The allowance is added to the remaining length, which is then divided by the length of one available board.", "Ausgangspunkt ist der Wandumfang, an dem in einem oder mehreren Räumen Sockelleisten angebracht werden. Ziehe Öffnungen ab, an denen sicher keine Sockelleiste verläuft, beispielsweise die Breite einer Tür. Auf die verbleibende Länge wird der Verschnitt aufgeschlagen und das Ergebnis durch die verfügbare Leistenlänge geteilt."],
    ["A darabszámot mindig felfelé kerekítjük, mert tört szálat nem lehet megvásárolni. Emiatt a ténylegesen megvett hossz általában valamivel nagyobb lesz a számított szükségletnél.", "The number of boards is always rounded up because boards must be purchased as whole pieces. The total length purchased will therefore usually be slightly greater than the calculated requirement.", "Die Anzahl der Leisten wird immer aufgerundet, da nur ganze Leisten gekauft werden können. Die tatsächlich gekaufte Gesamtlänge ist daher meist etwas größer als der berechnete Bedarf."],
    ["Példa", "Example", "Beispiel"], ["20 m kerületből 1 m nyílást levonva 19 m nettó hossz marad. 10% ráhagyással 20,9 m szükséges. 2,4 m-es szálból 9 darab kell, ami összesen 21,6 m vásárolt hosszt jelent.", "From a 20 m perimeter, subtracting 1 m of openings leaves a net length of 19 m. With a 10% allowance, 20.9 m is required. Nine 2.4 m boards are needed, giving a total purchased length of 21.6 m.", "Von einem Umfang von 20 m bleiben nach Abzug von 1 m Öffnungen 19 m Nettolänge. Mit 10 % Verschnitt werden 20,9 m benötigt. Dafür sind neun Leisten à 2,4 m erforderlich, also insgesamt 21,6 m gekaufte Länge."],
    ["Miért kell ráhagyás?", "Why include an allowance?", "Warum ist Verschnitt nötig?"], ["A sarkok, gérvágások, hibás vágások, mintázat és a szálak optimális kiosztása miatt a tiszta geometriai hossz ritkán azonos a tényleges beszerzéssel. Bonyolult alaprajznál több tartalék indokolt lehet.", "Corners, mitre cuts, cutting errors, patterns and efficient board layout mean that the geometric length rarely matches the actual purchase quantity. A more complex floor plan may require a larger allowance.", "Durch Ecken, Gehrungsschnitte, Fehlzuschnitte, Muster und eine sinnvolle Einteilung der Leisten entspricht die reine geometrische Länge selten der tatsächlichen Einkaufsmenge. Bei einem komplexen Grundriss kann ein größerer Verschnitt sinnvoll sein."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"], ["Az ajtókat mindig le kell vonni?", "Should doorways always be subtracted?", "Müssen Türöffnungen immer abgezogen werden?"], ["Csak ott vond le a nyílást, ahol valóban nem fut végig szegőléc vagy más lezáró elem.", "Subtract an opening only where no skirting board or other finishing element will actually run.", "Ziehe eine Öffnung nur dort ab, wo tatsächlich keine Sockelleiste oder ein anderes Abschlusselement verläuft."],
    ["Miért felfelé kerekít a darabszám?", "Why is the number of boards rounded up?", "Warum wird die Leistenanzahl aufgerundet?"], ["Mert a szálakat egész darabban kell megvenni.", "Because boards must be purchased as whole pieces.", "Weil Leisten als ganze Stücke gekauft werden müssen."],
    ["Több helyiségre is jó?", "Can I use it for several rooms?", "Kann ich mehrere Räume berechnen?"], ["Igen. Add össze a burkolandó kerületeket és a levonandó nyílások hosszát, vagy számold a helyiségeket külön a pontosabb vágási tervhez.", "Yes. Add the perimeters to be fitted and the lengths of the openings to subtract, or calculate each room separately for a more accurate cutting plan.", "Ja. Addiere die zu verkleidenden Umfänge und die abzuziehenden Öffnungslängen oder berechne die Räume für einen genaueren Zuschnittplan getrennt."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"], ["padlo burkolat", "flooring", "Bodenbelag"], ["csempe", "tiles", "Fliesen"], ["festek", "paint", "Farbe"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"], ["2026. augusztus 21.", "21 August 2026", "21. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"], ["Beszerzési becslés. A tényleges darabszámot a vágási kiosztás, sarokkialakítás, profil és helyszíni méretek módosíthatják.", "A purchasing estimate. The actual number of boards may vary with the cutting layout, corner details, profile and on-site measurements.", "Eine Einkaufsschätzung. Die tatsächliche Leistenanzahl kann je nach Zuschnitt, Eckausbildung, Profil und Aufmaß vor Ort abweichen."], ["Számítási módszertan", "Calculation methodology", "Berechnungsmethodik"], ["Hibát találtál? Jelezd.", "Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."],
    ["Adj meg érvényes adatokat.", "Enter valid values.", "Gib gültige Werte ein."], ["A nyílások hossza nem lehet nagyobb a kerületnél.", "The total length of the openings cannot exceed the perimeter.", "Die Gesamtlänge der Öffnungen darf nicht größer als der Umfang sein."], ["A ráhagyás legfeljebb 100% legyen.", "The allowance must not exceed 100%.", "Der Verschnitt darf höchstens 100 % betragen."],
    ["Kövesd az útmutatót a könyvjelző mentéséhez.", "Follow the instructions to save the bookmark.", "Folge der Anleitung, um das Lesezeichen zu speichern."], ["Megosztási felület megnyitva.", "Sharing options opened.", "Freigabeoptionen geöffnet."], ["A megosztást megszakítottad.", "Sharing was cancelled.", "Das Teilen wurde abgebrochen."], ["A linket a vágólapra másoltuk.", "The link was copied to the clipboard.", "Der Link wurde in die Zwischenablage kopiert."], ["Hirdetés", "Advertisement", "Anzeige"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const validationLabels = { "Kerület": ["Perimeter", "Umfang"], "Nyílások": ["Openings", "Öffnungen"], "Szálhossz": ["Board length", "Leistenlänge"], "Ráhagyás": ["Allowance", "Verschnitt"] };
  const validationMessages = { "adj meg érvényes számot.": ["enter a valid number.", "Gib eine gültige Zahl ein."], "az érték legyen nagyobb nullánál.": ["the value must be greater than zero.", "Der Wert muss größer als null sein."], "az érték nem lehet negatív.": ["the value cannot be negative.", "Der Wert darf nicht negativ sein."] };
  function number(raw, language) {
    const value = Number(raw.replace(/\s/gu, "").replace(",", "."));
    return Number.isFinite(value) ? new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 2 }).format(value) : raw;
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    if (normalized.endsWith(":")) {
      const base = normalized.slice(0, -1), basePair = dictionary[base] || dictionary[reverse.get(base)];
      if (basePair) return `${basePair[language === "en" ? 0 : 1]}:`;
    }
    let match = /^(\d[\d\s]*(?:,[0-9]+)?) m$/u.exec(normalized);
    if (match) return `${number(match[1], language)} m`;
    match = /^(\d[\d\s]*) db$/u.exec(normalized);
    if (match) return `${number(match[1], language)} ${language === "en" ? "pcs" : "Stk."}`;
    match = /^(Kerület|Nyílások|Szálhossz|Ráhagyás): (adj meg érvényes számot\.|az érték legyen nagyobb nullánál\.|az érték nem lehet negatív\.)$/u.exec(normalized);
    if (match) {
      const index = language === "en" ? 0 : 1;
      return `${validationLabels[match[1]][index]}: ${validationMessages[match[2]][index]}`;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Skirting Board Calculator" : "Fehlermeldung – Sockelleisten-Rechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Skirting Board Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/szegolec-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Sockelleisten-Rechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/szegolec-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

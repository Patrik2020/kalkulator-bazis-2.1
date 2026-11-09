/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "mulcs-kalkulator", main = doc.querySelector('main[data-batch04-calc="mulcs-kalkulator"]');
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
  const page = "mulcs-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Mulcs kalkulátor | Kalkulátor Bázis", "Mulch Calculator | Kalkulátor Bázis", "Mulchrechner | Kalkulátor Bázis"],
    ["Mulcs térfogat és zsákszám becslése felület, kívánt rétegvastagság, ráhagyás és kiszerelés alapján.", "Estimate mulch volume and the number of bags from the area, desired layer depth, allowance and bag size.", "Schätze Mulchvolumen und Sackanzahl anhand von Fläche, gewünschter Schichtdicke, Zuschlag und Gebindegröße."],
    ["Mulcs kalkulátor", "Mulch Calculator", "Mulchrechner"], ["Mulcs", "Mulch", "Mulch"], ["Otthon és felújítás kalkulátorok", "Home and renovation calculators", "Rechner für Haus und Renovierung"], ["Főoldal", "Home", "Startseite"], ["Otthon & felújítás", "Home & renovation", "Haus & Renovierung"],
    ["Felület (m²)", "Area (m²)", "Fläche (m²)"], ["Rétegvastagság (cm)", "Layer depth (cm)", "Schichtdicke (cm)"], ["Ráhagyás (%)", "Allowance (%)", "Zuschlag (%)"], ["Zsák mérete (liter)", "Bag size (litres)", "Sackgröße (Liter)"],
    ["Eredmény:", "Result:", "Ergebnis:"], ["Alap térfogat", "Base volume", "Grundvolumen"], ["Ráhagyással", "With allowance", "Mit Zuschlag"], ["Szükséges mennyiség", "Required quantity", "Benötigte Menge"], ["Szükséges zsák", "Bags required", "Benötigte Säcke"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"], ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."], ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"], ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"], ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."], ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Hogyan számolható ki a mulcs mennyisége?", "How do you calculate the amount of mulch?", "Wie berechnet man die Mulchmenge?"], ["A felületet megszorozzuk a méterben megadott rétegvastagsággal. Így kapjuk meg a köbmétert, majd ezt literre váltjuk. A ráhagyás segít fedezni a talaj egyenetlenségét, tömörödést és kisebb veszteségeket.", "Multiply the area by the layer depth expressed in metres. This gives the volume in cubic metres, which is then converted to litres. The allowance helps cover uneven ground, settling and minor losses.", "Multipliziere die Fläche mit der in Metern angegebenen Schichtdicke. Das ergibt das Volumen in Kubikmetern, das anschließend in Liter umgerechnet wird. Der Zuschlag berücksichtigt Bodenunebenheiten, Setzung und kleinere Verluste."],
    ["Példa", "Example", "Beispiel"], ["30 m² felületre 5 cm vastag réteg 1,5 m³, vagyis 1 500 liter mulcsot jelent. 10% ráhagyással 1 650 literre van szükség, ami 50 literes kiszerelésből 33 zsák.", "A 5 cm layer over 30 m² requires 1.5 m³, or 1,500 litres, of mulch. With a 10% allowance, 1,650 litres are needed, which is 33 bags of 50 litres each.", "Eine 5 cm dicke Schicht auf 30 m² benötigt 1,5 m³ beziehungsweise 1.500 Liter Mulch. Mit 10 % Zuschlag werden 1.650 Liter benötigt, also 33 Säcke mit je 50 Litern."],
    ["Mekkora rétegvastagságot válassz?", "What layer depth should you choose?", "Welche Schichtdicke solltest du wählen?"], ["A megfelelő vastagság függ a mulcs típusától, szemcseméretétől és a felhasználás céljától. A gyártói vagy kertészeti ajánlás legyen az elsődleges; a kalkulátor csak a megadott vastagságból számol mennyiséget.", "The right depth depends on the type and particle size of the mulch and its intended use. Follow the manufacturer's or a gardening expert's recommendation; the calculator only derives the quantity from the depth you enter.", "Die passende Schichtdicke hängt von Mulchart, Körnung und Verwendungszweck ab. Maßgeblich sind die Empfehlungen des Herstellers oder des Gartenbaus; der Rechner ermittelt die Menge lediglich aus der eingegebenen Dicke."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"], ["Literben vagy köbméterben érdemes számolni?", "Should I calculate in litres or cubic metres?", "Sollte ich in Litern oder Kubikmetern rechnen?"], ["Nagyobb mennyiségnél a köbméter, zsákos terméknél a liter praktikusabb. A kalkulátor mindkettőt megadja.", "Cubic metres are more practical for larger quantities, while litres are useful for bagged products. The calculator shows both.", "Bei größeren Mengen sind Kubikmeter praktischer, bei Sackware Liter. Der Rechner gibt beides an."], ["Miért kell ráhagyás?", "Why include an allowance?", "Warum ist ein Zuschlag sinnvoll?"], ["A talaj egyenetlensége, tömörödés és szórási veszteség miatt némi tartalék hasznos lehet.", "A small reserve can be useful because of uneven ground, settling and spreading losses.", "Wegen Bodenunebenheiten, Setzung und Streuverlusten kann eine kleine Reserve sinnvoll sein."], ["A zsákszámot kerekíti?", "Is the number of bags rounded?", "Wird die Sackanzahl gerundet?"], ["Igen, mindig felfelé egész zsákra kerekít, mert tört zsákot általában nem lehet megvásárolni.", "Yes. It always rounds up to a whole bag because partial bags usually cannot be purchased.", "Ja. Es wird immer auf einen ganzen Sack aufgerundet, da Teilsäcke in der Regel nicht gekauft werden können."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"], ["terkovezes", "paving", "Pflasterarbeiten"], ["padlo burkolat", "flooring", "Bodenbelag"], ["terfogat atvalto", "volume converter", "Volumenrechner"], ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"], ["2026. augusztus 21.", "21 August 2026", "21. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"], ["Anyagszükséglet-becslés. A tényleges fogyást a talaj, a mulcs típusa, tömörödése és a kívánt fedettség módosíthatja.", "This is a material requirement estimate. Actual usage can vary with the ground, mulch type, settling and desired coverage.", "Dies ist eine Materialbedarfsschätzung. Der tatsächliche Verbrauch kann je nach Boden, Mulchart, Setzung und gewünschter Deckung abweichen."], ["Számítási módszertan", "Calculation methodology", "Berechnungsmethodik"], ["Hibát találtál? Jelezd.", "Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."], ["Hirdetés", "Advertisement", "Anzeige"],
    ["A ráhagyás legfeljebb 100% legyen.", "The allowance must not exceed 100%.", "Der Zuschlag darf höchstens 100 % betragen."], ["Adj meg érvényes adatokat.", "Enter valid values.", "Gib gültige Werte ein."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)]; if (pair) return pair[language === "en" ? 0 : 1];
    if (normalized.endsWith(":")) {
      const base = normalized.slice(0, -1), basePair = dictionary[base] || dictionary[reverse.get(base)];
      if (basePair) return `${basePair[language === "en" ? 0 : 1]}:`;
    }
    let match = /^(\d[\d\s]*)(?:,([0-9]+))? (m³|liter|db)$/u.exec(normalized);
    if (match) {
      const number = Number(`${match[1].replace(/\s/gu, "")}.${match[2] || "0"}`), unit = match[3];
      const formatted = new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 3 }).format(number);
      if (unit === "liter") return `${formatted} ${language === "en" ? "litres" : "Liter"}`;
      if (unit === "db") return `${formatted} ${language === "en" ? "bags" : "Säcke"}`;
      return `${formatted} m³`;
    }
    match = /^(Felület|Rétegvastagság|Ráhagyás|Zsák mérete): (adj meg érvényes számot\.|az érték nem lehet negatív\.|az érték legyen nagyobb nullánál\.)$/u.exec(normalized);
    if (match) {
      const labels = { "Felület": ["Area", "Fläche"], "Rétegvastagság": ["Layer depth", "Schichtdicke"], "Ráhagyás": ["Allowance", "Zuschlag"], "Zsák mérete": ["Bag size", "Sackgröße"] };
      const errors = { "adj meg érvényes számot.": ["enter a valid number.", "Gib eine gültige Zahl ein."], "az érték nem lehet negatív.": ["the value cannot be negative.", "Der Wert darf nicht negativ sein."], "az érték legyen nagyobb nullánál.": ["the value must be greater than zero.", "Der Wert muss größer als null sein."] };
      const index = language === "en" ? 0 : 1;
      return `${labels[match[1]][index]}: ${errors[match[2]][index]}`;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source); url.searchParams.set("subject", language === "en" ? "Error report – Mulch Calculator" : "Fehlermeldung – Mulchrechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Mulch Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/mulcs-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Mulchrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/mulcs-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

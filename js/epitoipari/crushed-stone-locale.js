/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "zuzottko-kalkulator", main = doc.querySelector('main[data-batch05-calc="zuzottko-kalkulator"]');
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
  const page = "zuzottko-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Otthon és felújítás kalkulátorok", "Home and renovation calculators", "Rechner für Haus und Renovierung"],
    ["Főoldal", "Home", "Startseite"],
    ["Otthon & felújítás", "Home & renovation", "Haus & Renovierung"],
    ["Felület (m²)", "Area (m²)", "Fläche (m²)"],
    ["Rétegvastagság (cm)", "Layer depth (cm)", "Schichtdicke (cm)"],
    ["Ráhagyás (%)", "Allowance (%)", "Zuschlag (%)"],
    ["Eredmény:", "Result:", "Ergebnis:"],
    ["Alap térfogat", "Base volume", "Grundvolumen"],
    ["Ráhagyással", "With allowance", "Mit Zuschlag"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"],
    ["Telepítem", "Install", "Installieren"],
    ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Példa", "Example", "Beispiel"],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["terkovezes", "paving", "Pflasterarbeiten"],
    ["terfogat atvalto", "volume converter", "Volumenrechner"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"],
    ["2026. augusztus 21.", "21 August 2026", "21. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"],
    ["Számítási módszertan", "Calculation methodology", "Berechnungsmethodik"],
    ["Hibát találtál? Jelezd.", "Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."],
    ["Hirdetés", "Advertisement", "Anzeige"],
    ["A ráhagyás legfeljebb 100% legyen.", "The allowance must not exceed 100%.", "Der Zuschlag darf höchstens 100 % betragen."],
    ["Adj meg érvényes adatokat.", "Enter valid values.", "Gib gültige Werte ein."],
    ["Hozzáadás a Főképernyőhöz", "Add to Home Screen", "Zum Startbildschirm hinzufügen"],
    ["Nyisd meg a Safari Megosztás menüjét, válaszd a Hozzáadás a Főképernyőhöz lehetőséget, majd koppints a Hozzáadás gombra.", "Open Safari’s Share menu, choose Add to Home Screen, then tap Add.", "Öffne das Teilen-Menü von Safari, wähle Zum Startbildschirm hinzufügen und tippe anschließend auf Hinzufügen."],
    ["A Főképernyőhöz adás iPhone-on és iPaden Safariból végezhető el a legegyértelműbben. Nyisd meg ott az oldalt, majd használd a Megosztás menüt.", "On iPhone and iPad, the clearest way to add this page to your Home Screen is through Safari. Open the page in Safari and use the Share menu.", "Auf iPhone und iPad lässt sich die Seite am einfachsten über Safari zum Startbildschirm hinzufügen. Öffne die Seite in Safari und verwende das Teilen-Menü."],
    ["A natív megosztás nem sikerült, megpróbáljuk a linket másolni.", "Native sharing failed, so we’ll try copying the link instead.", "Das Teilen über die Systemfunktion ist fehlgeschlagen. Wir versuchen stattdessen, den Link zu kopieren."],
    ["A telepítési művelet nem sikerült.", "The installation action failed.", "Die Installation konnte nicht ausgeführt werden."],
    ["Ezt a kalkulátort a Kalkulátor Bázison találtam.", "I found this calculator on Kalkulátor Bázis.", "Ich habe diesen Rechner auf Kalkulátor Bázis gefunden."],
    ["A megtartó CTA komponens nem tölthető be.", "The save-and-share panel could not be loaded.", "Das Speichern-und-Teilen-Element konnte nicht geladen werden."],
    ["Kövesd az útmutatót a könyvjelző mentéséhez.", "Follow the instructions to save this page as a bookmark.", "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern."],
    ["Nyisd meg a Megosztás menüt, majd válaszd a Hozzáadás a Kedvencekhez lehetőséget.", "Open the Share menu, then choose Add to Favourites.", "Öffne das Teilen-Menü und wähle Zu Favoriten hinzufügen."],
    ["Nyomd meg a ⌘ + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.", "Press ⌘ + D, then save the page to your bookmarks.", "Drücke ⌘ + D und speichere die Seite als Lesezeichen."],
    ["Nyisd meg a böngésző menüjét, majd válaszd a Könyvjelző hozzáadása vagy a csillag ikont.", "Open your browser menu and choose Add bookmark or the star icon.", "Öffne das Browsermenü und wähle Lesezeichen hinzufügen oder das Sternsymbol."],
    ["Nyomd meg a Ctrl + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.", "Press Ctrl + D, then save the page to your bookmarks.", "Drücke Ctrl + D und speichere die Seite als Lesezeichen."],
    ["Kövesd az útmutatót a főképernyős hozzáadáshoz.", "Follow the instructions to add the page to your home screen.", "Folge der Anleitung, um die Seite zum Startbildschirm hinzuzufügen."],
    ["Telepítési lehetőség megnyitása...", "Opening installation options...", "Installationsoptionen werden geöffnet..."],
    ["A telepítés elindult.", "Installation has started.", "Die Installation wurde gestartet."],
    ["A telepítést most nem indítottad el.", "You chose not to start the installation.", "Du hast die Installation nicht gestartet."],
    ["A telepítési lehetőség jelenleg nem érhető el.", "The installation option is currently unavailable.", "Die Installationsoption ist derzeit nicht verfügbar."],
    ["Megosztási felület megnyitva.", "Share options opened.", "Freigabeoptionen geöffnet."],
    ["A megosztást megszakítottad.", "You cancelled sharing.", "Du hast das Teilen abgebrochen."],
    ["A linket a vágólapra másoltuk.", "The link has been copied to the clipboard.", "Der Link wurde in die Zwischenablage kopiert."],
    ["Zúzottkő kalkulátor | Kalkulátor Bázis", "Crushed Stone Calculator | Kalkulátor Bázis", "Schotterrechner | Kalkulátor Bázis"],
    ["Zúzottkő kalkulátor", "Crushed Stone Calculator", "Schotterrechner"],
    ["Zúzottkő", "Crushed stone", "Schotter"],
    ["Zúzottkő térfogat és tömeg becslése felület, rétegvastagság, anyagsűrűség és ráhagyás alapján.", "Estimate crushed stone volume and mass from the area, layer depth, bulk density and allowance.", "Schätze Volumen und Masse von Schotter anhand von Fläche, Schichtdicke, Schüttdichte und Zuschlag."],
    ["Sűrűség (t/m³)", "Bulk density (t/m³)", "Schüttdichte (t/m³)"],
    ["Becsült tömeg", "Estimated mass", "Geschätzte Masse"],
    ["Hogyan becsülhető a zúzottkő mennyisége?", "How do you estimate the amount of crushed stone?", "Wie lässt sich der Schotterbedarf schätzen?"],
    ["A felületet megszorozzuk a méterben kifejezett rétegvastagsággal, így megkapjuk a geometriai térfogatot köbméterben. Erre kerül a választott ráhagyás, majd a megadott tonna/köbméter sűrűséggel becsülhető a tömeg.", "Multiply the area by the layer depth expressed in metres to obtain the geometric volume in cubic metres. Apply the selected allowance, then estimate the mass using the bulk density entered in tonnes per cubic metre.", "Multipliziere die Fläche mit der in Metern angegebenen Schichtdicke, um das geometrische Volumen in Kubikmetern zu erhalten. Berücksichtige anschließend den gewählten Zuschlag und berechne die geschätzte Masse anhand der eingegebenen Schüttdichte in Tonnen pro Kubikmeter."],
    ["A sűrűség erősen függ az anyag szemcseméretétől, nedvességétől és tömörségétől. A példában szereplő 1,6 t/m³ csak kiinduló érték; rendelésnél a beszállító adatát érdemes használni.", "Bulk density depends strongly on particle size, moisture and compaction. The example value of 1.6 t/m³ is only a starting point; use your supplier’s figure when ordering.", "Die Schüttdichte hängt stark von Körnung, Feuchtigkeit und Verdichtung ab. Der Beispielwert von 1,6 t/m³ dient nur als Ausgangspunkt; verwende bei der Bestellung die Angaben des Lieferanten."],
    ["40 m² felület és 8 cm rétegvastagság 3,2 m³ alap térfogatot ad. 10% ráhagyással 3,52 m³ szükséges, ami 1,6 t/m³ sűrűséggel körülbelül 5,63 tonna.", "An area of 40 m² with an 8 cm layer gives a base volume of 3.2 m³. With a 10% allowance, 3.52 m³ is required, corresponding to approximately 5.63 tonnes at a bulk density of 1.6 t/m³.", "Eine Fläche von 40 m² mit einer 8 cm dicken Schicht ergibt ein Grundvolumen von 3,2 m³. Mit 10 % Zuschlag werden 3,52 m³ benötigt, was bei einer Schüttdichte von 1,6 t/m³ etwa 5,63 Tonnen entspricht."],
    ["Laza vagy tömörített réteggel számol?", "Does the calculation use a loose or compacted layer?", "Wird mit einer losen oder verdichteten Schicht gerechnet?"],
    ["A geometriai méret jellemzően a kész rétegre vonatkozik, miközben a szállított laza anyag tömörítés után kisebb térfogatot foglalhat el. A ráhagyás segíthet, de komoly alaprétegnél a kívánt tömörséget és a beszállító váltószámait külön is figyelembe kell venni.", "The dimensions generally describe the finished layer, while delivered loose material may occupy a smaller volume after compaction. An allowance can help, but for substantial base layers you should also account for the required compaction and your supplier’s conversion factors.", "Die geometrischen Maße beziehen sich in der Regel auf die fertige Schicht. Das lose angelieferte Material kann nach der Verdichtung ein kleineres Volumen einnehmen. Ein Zuschlag kann helfen; bei größeren Tragschichten müssen jedoch auch der erforderliche Verdichtungsgrad und die Umrechnungsfaktoren des Lieferanten berücksichtigt werden."],
    ["Milyen sűrűséget használjak?", "Which bulk density should I use?", "Welche Schüttdichte sollte ich verwenden?"],
    ["A választott anyagra vonatkozó beszállítói vagy gyártói t/m³ adatot, lehetőleg a szállítási állapothoz igazítva.", "Use the supplier’s or manufacturer’s value in t/m³ for your chosen material, preferably matching its condition on delivery.", "Verwende die Angabe des Lieferanten oder Herstellers in t/m³ für das gewählte Material, möglichst passend zum Lieferzustand."],
    ["A ráhagyás kötelező?", "Is an allowance mandatory?", "Ist ein Zuschlag erforderlich?"],
    ["Nem, de egyenetlen aljzat, tömörödés és kivitelezési veszteség miatt gyakran indokolt.", "No, but uneven ground, compaction and installation losses often make an allowance advisable.", "Nein, wegen eines unebenen Untergrunds, Verdichtung und Einbauverlusten ist ein Zuschlag jedoch häufig sinnvoll."],
    ["Kavicsra is használható?", "Can I use it for gravel too?", "Kann ich den Rechner auch für Kies verwenden?"],
    ["Igen, ha a megfelelő sűrűséget adod meg, de az anyagfajtának megfelelő kivitelezési szabályokat külön ellenőrizd.", "Yes, provided you enter the appropriate bulk density. Check the installation requirements for the specific material separately.", "Ja, wenn du die passende Schüttdichte eingibst. Prüfe die Einbauvorgaben für die jeweilige Materialart gesondert."],
    ["Anyagszükséglet-becslés. A tényleges tömeg a szemcsemérettől, nedvességtől, laza/tömör állapottól és beszállítói adatoktól függ.", "This is a material requirement estimate. Actual mass depends on particle size, moisture, whether the material is loose or compacted, and the supplier’s data.", "Dies ist eine Materialbedarfsschätzung. Die tatsächliche Masse hängt von Körnung, Feuchtigkeit, losem oder verdichtetem Zustand und den Lieferantenangaben ab."],
    ["beton", "concrete", "Beton"],
    ["Morzsamenü", "Breadcrumb navigation", "Brotkrümelnavigation"]
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
    let match = /^(\d[\d\s]*)(?:,([0-9]+))? (m³|t)$/u.exec(normalized);
    if (match) {
      const number = Number(`${match[1].replace(/\s/gu, "")}.${match[2] || "0"}`), unit = match[3];
      const formatted = new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 3 }).format(number);
      return `${formatted} ${unit}`;
    }
    match = /^(Felület|Rétegvastagság|Ráhagyás|Sűrűség): (adj meg érvényes számot\.|az érték nem lehet negatív\.|az érték legyen nagyobb nullánál\.)$/u.exec(normalized);
    if (match) {
      const labels = { "Felület": ["Area", "Fläche"], "Rétegvastagság": ["Layer depth", "Schichtdicke"], "Ráhagyás": ["Allowance", "Zuschlag"], "Sűrűség": ["Bulk density", "Schüttdichte"] };
      const errors = { "adj meg érvényes számot.": ["enter a valid number.", "Gib eine gültige Zahl ein."], "az érték nem lehet negatív.": ["the value cannot be negative.", "Der Wert darf nicht negativ sein."], "az érték legyen nagyobb nullánál.": ["the value must be greater than zero.", "Der Wert muss größer als null sein."] };
      const index = language === "en" ? 0 : 1;
      return `${labels[match[1]][index]}: ${errors[match[2]][index]}`;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source); url.searchParams.set("subject", language === "en" ? "Error report – Crushed Stone Calculator" : "Fehlermeldung – Schotterrechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Crushed Stone Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/zuzottko-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Schotterrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/zuzottko-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

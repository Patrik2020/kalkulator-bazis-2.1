/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "festek-kalkulator", main = doc.querySelector("main.page-festek");
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
        const source = originals.has("errorReportHref") ? originals.get("errorReportHref") : errorLink.getAttribute("href");
        originals.set("errorReportHref", source);
        errorLink.setAttribute("href", api.localizeReportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ }
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
  const page = "festek-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Festék kalkulátor | Falfelület és festékmennyiség becslése","Paint Calculator | Estimate Wall Area and Paint Quantity","Farbrechner | Wandfläche und Farbmenge schätzen"],
    ["Festék kalkulátor: számold ki mennyi falfesték szükséges egy helyiség vagy fal lefestéséhez. Gyors és egyszerű festék mennyiség számítás.","Paint calculator: estimate how much wall paint you need for a room or wall. A quick and simple paint quantity calculation.","Farbrechner: Schätze, wie viel Wandfarbe du für einen Raum oder eine Wand benötigst. Schnell und einfach die Farbmenge berechnen."],
    ["Festék kalkulátor","Paint Calculator","Farbrechner"],
    ["Festékmennyiség becslése falakhoz és felületekhez.","Estimate paint quantities for walls and other surfaces.","Farbmengen für Wände und andere Flächen schätzen."],
    ["Otthon és felújítás kalkulátorok","Home and renovation calculators","Rechner für Haus und Renovierung"],
    ["Főoldal","Home","Startseite"],["Otthon & felújítás","Home & renovation","Haus & Renovierung"],
    ["Számold ki gyorsan, mennyi festékre lesz szükséged a festéshez.","Quickly estimate how much paint you will need for your project.","Schätze schnell, wie viel Farbe du für dein Projekt benötigst."],
    ["Festék mennyiség kalkulátor","Paint quantity calculator","Farbmengenrechner"],
    ["Szoba hossza (m)","Room length (m)","Raumlänge (m)"],["pl. 5","e.g. 5","z. B. 5"],
    ["Szoba szélessége (m)","Room width (m)","Raumbreite (m)"],["pl. 4","e.g. 4","z. B. 4"],
    ["Belmagasság (m)","Ceiling height (m)","Raumhöhe (m)"],["pl. 2.7","e.g. 2.7","z. B. 2,7"],
    ["Ablakok összes területe (m²)","Total window area (m²)","Gesamtfläche der Fenster (m²)"],
    ["Add meg az összes ablak együttes területét.","Enter the combined area of all windows.","Gib die Gesamtfläche aller Fenster ein."],
    ["Ajtók összes területe (m²)","Total door area (m²)","Gesamtfläche der Türen (m²)"],
    ["Add meg az összes ajtó együttes területét.","Enter the combined area of all doors.","Gib die Gesamtfläche aller Türen ein."],
    ["Festékrétegek száma","Number of coats","Anzahl der Anstriche"],["Festék kiadóssága (m²/liter)","Paint coverage (m²/litre)","Ergiebigkeit der Farbe (m²/Liter)"],
    ["Festék ára (Ft/liter)","Paint price (HUF/litre)","Farbpreis (HUF/Liter)"],
    ["Ha nem tudod, hagyd üresen. A költségszámítás opcionális.","Leave this blank if unknown. The cost estimate is optional.","Lass das Feld leer, wenn der Preis unbekannt ist. Die Kostenschätzung ist optional."],["pl. 2500","e.g. 2500","z. B. 2500"],
    ["Mennyezet festése is","Include the ceiling","Decke mitstreichen"],["Eredmények","Results","Ergebnisse"],
    ["Falak felülete:","Wall area:","Wandfläche:"],["Mennyezet felülete:","Ceiling area:","Deckenfläche:"],["Nyílászárók területe:","Window and door area:","Fenster- und Türfläche:"],
    ["Festendő összfelület:","Total area to paint:","Gesamtfläche zum Streichen:"],["Szükséges festék:","Paint required:","Benötigte Farbmenge:"],
    ["Javasolt vásárlás:","Recommended purchase quantity:","Empfohlene Kaufmenge:"],["Várható költség:","Estimated cost:","Geschätzte Kosten:"],
    ["Add meg az adatokat a számításhoz.","Enter the details to calculate.","Gib die Daten für die Berechnung ein."],
    ["A nyílászárók összes területe nem lehet nagyobb a négy fal teljes felületénél.","The total window and door area cannot exceed the area of the four walls.","Die Gesamtfläche von Fenstern und Türen darf nicht größer sein als die Fläche der vier Wände."],
    ["Nincs számolva","Not included","Nicht berücksichtigt"],["Nincs megadva","Not provided","Nicht angegeben"],
    ["Festési összesítő","Painting summary","Anstrichübersicht"],
    ["Az Ön által megadott adatok alapján a festendő felület","Based on the details entered, the area to paint is","Anhand deiner Angaben beträgt die zu streichende Fläche"],
    ["A mennyezet festése is beleszámításra került.","The ceiling is included.","Die Decke ist eingerechnet."],["A mennyezet festése nincs beleszámítva.","The ceiling is not included.","Die Decke ist nicht eingerechnet."],
    ["réteg festéssel számolva várhatóan","coats will require approximately","Anstriche benötigen voraussichtlich"],["festékre lesz szüksége.","of paint.","Farbe."],
    ["A 10%-os ráhagyást is figyelembe véve legalább","Including a 10% allowance, we recommend buying at least","Mit einem Zuschlag von 10 % empfehlen wir, mindestens"],
    ["festék vásárlását javasoljuk.","of paint.","Farbe zu kaufen."],
    ["A megadott literár és a javasolt egész literes vásárlási mennyiség alapján a festék várható költsége","Based on the entered price per litre and the recommended whole-litre purchase quantity, the estimated paint cost is","Aus dem eingegebenen Literpreis und der empfohlenen, auf ganze Liter gerundeten Kaufmenge ergeben sich geschätzte Farbkosten von"],
    ["Festékmennyiség számítása felújítás előtt","Estimating paint quantity before renovation","Farbmenge vor der Renovierung berechnen"],
    ["A festék kalkulátor segít megbecsülni, hány liter festékre lehet szükség egy szoba, lakásrész vagy falfelület festéséhez. A cél az, hogy ne vásárolj túl keveset, de feleslegesen sok festék se maradjon a munka végén.","The paint calculator estimates how many litres may be needed for a room, part of a home or a wall. It helps you avoid buying too little without leaving an unnecessarily large surplus.","Der Farbrechner schätzt, wie viele Liter du für einen Raum, einen Wohnbereich oder eine Wand benötigst. So kaufst du weder zu wenig noch unnötig viel Farbe."],
    ["Festésnél a felület mérete mellett számít a rétegek száma, a festék kiadóssága, az alapfelület állapota és az is, hogy a mennyezetet is fested-e.","Paint quantity depends not only on the area, but also on the number of coats, the stated coverage, the condition of the surface and whether the ceiling is included.","Die benötigte Farbmenge hängt nicht nur von der Fläche ab, sondern auch von der Anzahl der Anstriche, der angegebenen Ergiebigkeit, dem Untergrund und davon, ob die Decke mitgestrichen wird."],
    ["Hogyan működik a számítás?","How does the calculation work?","Wie funktioniert die Berechnung?"],
    ["A kalkulátor a falak és opcionálisan a mennyezet felületéből indul ki. Ezt osztja a festék kiadósságával, majd figyelembe veszi a rétegszámot. Erősen szívó, sötét vagy javított felületnél ráhagyás is indokolt lehet.","The calculator starts with the wall area and, optionally, the ceiling area. It divides this by the paint coverage and applies the number of coats. An allowance may be appropriate for highly absorbent, dark or repaired surfaces.","Der Rechner beginnt mit der Wandfläche und optional der Deckenfläche. Diese wird durch die Ergiebigkeit der Farbe geteilt und mit der Anzahl der Anstriche berücksichtigt. Bei stark saugenden, dunklen oder ausgebesserten Flächen kann ein Zuschlag sinnvoll sein."],
    ["Konkrét példaszámítás","Worked example","Konkretes Rechenbeispiel"],
    ["Egy 4 × 5 méteres, 2,7 méter magas szoba falainak felülete nagyjából 48,6 m², a mennyezettel együtt 68,6 m². Ha a festék 10 m²/liter kiadósságú, két réteghez körülbelül 13,8 liter kell, erre érdemes még ráhagyást tervezni.","A 4 × 5 metre room with a ceiling height of 2.7 metres has about 48.6 m² of wall area, or 68.6 m² including the ceiling. At a coverage of 10 m² per litre, two coats require about 13.8 litres, before adding an allowance.","Ein 4 × 5 Meter großer Raum mit 2,7 Meter Höhe hat etwa 48,6 m² Wandfläche beziehungsweise 68,6 m² einschließlich Decke. Bei einer Ergiebigkeit von 10 m² pro Liter werden für zwei Anstriche rund 13,8 Liter benötigt, zuzüglich einer Reserve."],
    ["Mikor hasznos ez a kalkulátor?","When is this calculator useful?","Wann ist dieser Rechner nützlich?"],
    ["szobafestés anyagtervezésénél","planning materials for painting a room","bei der Materialplanung für einen Zimmeranstrich"],["festék vásárlás előtt","before buying paint","vor dem Kauf von Farbe"],
    ["költségbecsléshez","for estimating costs","für eine Kostenschätzung"],["mennyezet és fal külön számításakor","when calculating walls and ceiling separately","wenn Wände und Decke getrennt berechnet werden sollen"],
    ["Fontos tudni:","Important:","Wichtig:"],["A festék tényleges fogyása függ az alapfelülettől, hengertől, hígítástól, színtől és gyártói kiadósságtól. Mindig nézd meg a termék adatlapját.","Actual paint consumption depends on the surface, roller, dilution, colour and the manufacturer's coverage figure. Always check the product data sheet.","Der tatsächliche Farbverbrauch hängt vom Untergrund, der Rolle, der Verdünnung, der Farbe und den Herstellerangaben zur Ergiebigkeit ab. Prüfe immer das Produktdatenblatt."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],["Mennyi ráhagyással számoljak?","How much extra should I allow?","Welchen Zuschlag sollte ich einplanen?"],
    ["Általában 5-15% ráhagyás életszerű lehet, de rossz felületnél több is kellhet.","An allowance of 5–15% is often reasonable, although a poor surface may require more.","Ein Zuschlag von 5–15 % ist häufig realistisch; bei einem schlechten Untergrund kann mehr nötig sein."],
    ["A nyílászárókat le kell vonni?","Should windows and doors be deducted?","Sollte ich Fenster und Türen abziehen?"],["Nagyobb ablakok és ajtók esetén érdemes, kis felületeknél a ráhagyás gyakran kiegyenlíti.","It is worth deducting larger windows and doors; for small openings, the allowance often balances them out.","Größere Fenster und Türen solltest du abziehen; bei kleinen Öffnungen gleicht der Zuschlag die Fläche oft aus."],
    ["Egy vagy két réteggel számoljak?","Should I allow for one or two coats?","Sollte ich mit einem oder zwei Anstrichen rechnen?"],["A legtöbb esetben két réteg ad szebb fedést, de jó állapotú hasonló színű falnál egy réteg is elég lehet.","Two coats usually provide better coverage, although one may be enough on a sound wall in a similar colour.","Zwei Anstriche decken meist besser; auf einer intakten Wand mit ähnlicher Farbe kann jedoch ein Anstrich genügen."],
    ["Mennyezetet külön számoljam?","Should I calculate the ceiling separately?","Sollte ich die Decke separat berechnen?"],["Igen, mert jelentős plusz felületet adhat.","Yes. It can add a substantial area.","Ja. Sie kann die zu streichende Fläche deutlich vergrößern."],
    ["Miért térhet el a valós fogyás?","Why can actual consumption differ?","Warum kann der tatsächliche Verbrauch abweichen?"],["A fal szívóképessége, glettelés, alapozás és festékminőség miatt.","Because of the wall's absorbency, filling, priming and paint quality.","Wegen der Saugfähigkeit der Wand, der Spachtelung, Grundierung und Farbqualität."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],["Tapéta kalkulátor","Wallpaper Calculator","Tapetenrechner"],["Vakolat kalkulátor","Plaster Calculator","Putzrechner"],["Gipszkarton kalkulátor","Drywall Calculator","Trockenbaurechner"],["Csempe kalkulátor","Tile Calculator","Fliesenrechner"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],["Az eredmény a megadott méretek és anyagjellemzők alapján készült becslés. Beszerzés előtt ellenőrizd a gyártói kiadósságot, a helyszíni adottságokat és a szükséges ráhagyást.","The result is an estimate based on the entered dimensions and material properties. Before buying, check the manufacturer's coverage figure, site conditions and the allowance required.","Das Ergebnis ist eine Schätzung anhand der eingegebenen Maße und Materialeigenschaften. Prüfe vor dem Kauf die Herstellerangaben zur Ergiebigkeit, die Bedingungen vor Ort und den benötigten Zuschlag."],
    ["A számítások módszertana és minőségbiztosítása","Calculation methodology and quality assurance","Berechnungsmethodik und Qualitätssicherung"],["Hibát találtál? Jelezd nekünk.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."],
    ["Fedőképesség-valóságteszt","Coverage reality check","Deckkraft-Praxischeck"],["A címkén szereplő m²/liter nem minden falon teljesül ugyanúgy","The m²-per-litre figure on the label is not achieved equally on every wall","Die m²-pro-Liter-Angabe auf dem Etikett wird nicht auf jeder Wand gleich erreicht"],
    ["Új glett, erősen szívó javítás, nagy színváltás vagy foltos alapfelület növelheti a tényleges festékigényt. Ez a panel a fő kalkulátorhoz külön felületi korrekciót és vödörkerekítést ad.","Fresh filler, highly absorbent repairs, a major colour change or a patchy surface can increase actual paint demand. This panel adds a surface adjustment and rounds the quantity to whole containers.","Neue Spachtelmasse, stark saugende Ausbesserungen, ein großer Farbwechsel oder ein fleckiger Untergrund können den tatsächlichen Farbbedarf erhöhen. Dieses Feld ergänzt eine Untergrundkorrektur und rundet auf ganze Gebinde."],
    ["Felület állapota","Surface condition","Zustand des Untergrunds"],["Egyenletes, alapozott","Even and primed","Gleichmäßig und grundiert"],["Átlagos felújítás (+10%)","Typical renovation (+10%)","Übliche Renovierung (+10 %)"],["Erősen szívó / nagy színváltás (+25%)","Highly absorbent / major colour change (+25%)","Stark saugend / großer Farbwechsel (+25 %)"],
    ["Vödör kiszerelése (liter)","Container size (litres)","Gebindegröße (Liter)"],["Elméleti festékigény","Theoretical paint requirement","Theoretischer Farbbedarf"],["Korrigált festékigény","Adjusted paint requirement","Korrigierter Farbbedarf"],["Egész vödörre kerekítve","Rounded to whole containers","Auf ganze Gebinde gerundet"],
    ["Alapozó nem festékpótlék.","Primer is not a substitute for paint.","Grundierung ersetzt keine Farbe."],["A megfelelő alapozás célja az aljzat egységesítése és tapadásának előkészítése; mindig a választott festékrendszer gyártói előírása az elsődleges.","Correct priming evens out the substrate and prepares it for adhesion; always follow the paint system manufacturer's instructions.","Eine geeignete Grundierung vereinheitlicht den Untergrund und bereitet die Haftung vor; maßgeblich sind immer die Herstellerangaben des gewählten Farbsystems."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Hirdetés","Advertisement","Anzeige"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const locale = language => language === "en" ? "en-GB" : "de-DE";
  const parseHu = value => Number(value.replace(/[\s\u00a0]/gu, "").replace(/\./gu, "").replace(/,/gu, "."));
  const format = (value, language, minimum = 0, maximum = 2) => new Intl.NumberFormat(locale(language), { minimumFractionDigits: minimum, maximumFractionDigits: maximum }).format(value);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    let match = /^(\d[\d.,\s]*) m²$/u.exec(normalized);
    if (match) return `${format(parseHu(match[1]), language, 2, 2)} m²`;
    match = /^(\d[\d.,\s]*) liter$/u.exec(normalized);
    if (match) return `${format(parseHu(match[1]), language, Number.isInteger(parseHu(match[1])) ? 0 : 2, 2)} ${language === "en" ? "litres" : "Liter"}`;
    match = /^(\d[\d.,\s]*) Ft$/u.exec(normalized);
    if (match) return `${format(parseHu(match[1]), language, 0, 0)} HUF`;
    match = /^(\d[\d.,\s]*) l$/u.exec(normalized);
    if (match) return `${format(parseHu(match[1]), language)} l`;
    match = /^(\d+) × (\d[\d.,\s]*) l$/u.exec(normalized);
    if (match) return `${match[1]} × ${format(parseHu(match[2]), language)} l`;
    return null;
  }
  function localizeReportHref(sourceHref, language) {
    if (language === "hu" || !supported.includes(language)) return sourceHref;
    const url = new URL(sourceHref);
    const copy = language === "en" ? {
      subject: "Error report – Paint Calculator",
      body: "Calculator: Paint Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/festek-kalkulator.html\n\nBriefly describe the issue:\n"
    } : {
      subject: "Fehlermeldung – Farbrechner",
      body: "Rechner: Farbrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/festek-kalkulator.html\n\nBeschreibe den Fehler kurz:\n"
    };
    url.searchParams.set("subject", copy.subject); url.searchParams.set("body", copy.body);
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, localizeReportHref };
});

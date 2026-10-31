/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "csemperagaszto-kalkulator";
  const main = doc.querySelector('main[data-batch01-calc="csemperagaszto-kalkulator"]');
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
  const page = "csemperagaszto-kalkulator";
  const dictionary = Object.freeze({
    "hu-HU": ["en-US", "de-DE"],
    "Csemperagasztó kalkulátor | Kg és zsákszám": ["Tile Adhesive Calculator | Kilograms and Bags", "Fliesenkleber-Rechner | Kilogramm und Säcke"],
    "Csemperagasztó kalkulátor burkoláshoz. Becsüld meg a szükséges ragasztó kilogrammját és zsákszámát felület, gyártói fogyás, ráhagyás és kiszerelés alapján.": ["Estimate tile adhesive in kilograms and bags from the area, manufacturer's coverage rate, allowance and bag size.", "Schätze den Fliesenkleberbedarf in Kilogramm und Säcken anhand von Fläche, Herstellerverbrauch, Zuschlag und Sackgröße."],
    "Becsüld meg a csemperagasztó anyagszükségletet burkolandó felület alapján.": ["Estimate how much tile adhesive you need for the area to be tiled.", "Schätze den Fliesenkleberbedarf für die zu fliesende Fläche."],
    "Csemperagasztó kalkulátor": ["Tile Adhesive Calculator", "Fliesenkleber-Rechner"],
    "Becsüld meg a szükséges csemperagasztó tömegét és zsákszámát.": ["Estimate the weight of tile adhesive and the number of bags needed.", "Schätze die benötigte Menge Fliesenkleber und die Anzahl der Säcke."],
    "Otthon és felújítás kalkulátorok": ["Home and renovation calculators", "Rechner für Haus und Renovierung"],
    "Főoldal": ["Home", "Startseite"], "Otthon & felújítás": ["Home & renovation", "Haus & Renovierung"], "Csemperagasztó": ["Tile adhesive", "Fliesenkleber"],
    "Becsüld meg, hány kilogramm és hány zsák ragasztóra lehet szükséged a burkoláshoz.": ["Estimate how many kilograms and bags of adhesive your tiling project may need.", "Schätze, wie viele Kilogramm und Säcke Kleber du für dein Fliesenprojekt brauchst."],
    "Burkolandó felület (m²)": ["Area to tile (m²)", "Zu fliesende Fläche (m²)"], "Gyártói anyagfelhasználás (kg/m²)": ["Manufacturer's consumption rate (kg/m²)", "Herstellerverbrauch (kg/m²)"],
    "Ráhagyás (%)": ["Allowance (%)", "Zuschlag (%)"], "Egy zsák tömege (kg)": ["Bag size (kg)", "Sackgröße (kg)"],
    "Eredmény:": ["Result:", "Ergebnis:"], "Alap anyagigény:": ["Base adhesive requirement:", "Grundbedarf an Kleber:"], "Ráhagyással számolt mennyiség:": ["Amount including allowance:", "Menge inklusive Zuschlag:"], "Szükséges zsák:": ["Bags needed:", "Benötigte Säcke:"],
    "Alap anyagigény": ["Base adhesive requirement", "Grundbedarf an Kleber"], "Ráhagyással számolt mennyiség": ["Amount including allowance", "Menge inklusive Zuschlag"], "Szükséges zsák": ["Bags needed", "Benötigte Säcke"],
    "Burkolandó felület: adj meg érvényes számot.": ["Area to tile: enter a valid number.", "Zu fliesende Fläche: Gib eine gültige Zahl ein."],
    "Burkolandó felület: az érték legyen nagyobb nullánál.": ["Area to tile: enter a value greater than zero.", "Zu fliesende Fläche: Gib einen Wert größer als null ein."],
    "Anyagfelhasználás: adj meg érvényes számot.": ["Consumption rate: enter a valid number.", "Verbrauch: Gib eine gültige Zahl ein."],
    "Anyagfelhasználás: az érték legyen nagyobb nullánál.": ["Consumption rate: enter a value greater than zero.", "Verbrauch: Gib einen Wert größer als null ein."],
    "Ráhagyás: adj meg érvényes számot.": ["Allowance: enter a valid number.", "Zuschlag: Gib eine gültige Zahl ein."],
    "Ráhagyás: az érték nem lehet negatív.": ["Allowance cannot be negative.", "Der Zuschlag darf nicht negativ sein."],
    "Zsákméret: adj meg érvényes számot.": ["Bag size: enter a valid number.", "Sackgröße: Gib eine gültige Zahl ein."],
    "Zsákméret: az érték legyen nagyobb nullánál.": ["Bag size: enter a value greater than zero.", "Sackgröße: Gib einen Wert größer als null ein."],
    "A ráhagyás legfeljebb 100% legyen.": ["Allowance must not exceed 100%.", "Der Zuschlag darf höchstens 100 % betragen."],
    "Adj meg érvényes adatokat a számításhoz.": ["Enter valid values to calculate.", "Gib gültige Werte für die Berechnung ein."],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"], "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Hirdetés": ["Advertisement", "Anzeige"],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj": ["Save Kalkulátor Bázis to return to this calculation in one click", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren"],
    "ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["— or share it with someone who might find it useful.", "– oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek": ["Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Hogyan becsüli a kalkulátor a ragasztó mennyiségét?": ["How does the calculator estimate adhesive?", "Wie schätzt der Rechner die Klebermenge?"],
    "A számítás a burkolandó felületet megszorozza az általad megadott, négyzetméterre jutó anyagfelhasználással, majd hozzáadja a választott ráhagyást. Végül a teljes kilogrammot elosztja a zsák tömegével, és egész zsákra felfelé kerekít.": ["The area to tile is multiplied by the consumption rate you enter per square metre, then the selected allowance is added. The total weight is divided by the bag size and rounded up to whole bags.", "Die zu fliesende Fläche wird mit dem eingegebenen Verbrauch pro Quadratmeter multipliziert und um den gewählten Zuschlag erhöht. Die Gesamtmenge wird durch die Sackgröße geteilt und auf ganze Säcke aufgerundet."],
    "A legfontosabb adat a": ["The most important input is the", "Die wichtigste Angabe ist der"], "gyártói anyagfelhasználás": ["manufacturer's consumption rate", "Herstellerverbrauch"],
    ". Nincs minden burkolási helyzetre érvényes univerzális kg/m² érték: a fogazott glettvas mérete, a lap mérete, a hátoldali fedettség, az aljzat síkpontossága és a választott ragasztó tulajdonságai is befolyásolják a tényleges fogyást. Ezért a termék adatlapján szereplő értéket érdemes megadni.": [". No single kg/m² rate fits every tiling job: trowel notch size, tile size, coverage on the back, substrate flatness and the adhesive itself all affect actual consumption. Use the rate given in the product's technical data sheet.", ". Es gibt keinen für jede Verlegung gültigen kg/m²-Wert: Zahnkellengröße, Fliesenformat, rückseitige Benetzung, Ebenheit des Untergrunds und der Kleber selbst beeinflussen den tatsächlichen Verbrauch. Verwende den Wert aus dem technischen Datenblatt des Produkts."],
    "A képlet": ["The formula", "Die Formel"], "Alap mennyiség = felület × kg/m²": ["Base amount = area × kg/m²", "Grundmenge = Fläche × kg/m²"],
    ", majd": [", then", ", danach"], "teljes mennyiség = alap mennyiség × (1 + ráhagyás / 100)": ["total amount = base amount × (1 + allowance / 100)", "Gesamtmenge = Grundmenge × (1 + Zuschlag / 100)"],
    ". A zsákszám a teljes mennyiség és a kiszerelés hányadosának felfelé kerekített értéke.": [". Divide the total amount by the bag size and round up to find the number of bags.", ". Teile die Gesamtmenge durch die Sackgröße und runde auf, um die Anzahl der Säcke zu erhalten."],
    "Példa": ["Example", "Beispiel"], "20 m² felület, 4 kg/m² fogyás és 10% ráhagyás mellett az alapigény 80 kg, a tervezett mennyiség 88 kg. 25 kg-os zsákból ez 4 zsákot jelent.": ["For 20 m² at 4 kg/m² with a 10% allowance, the base need is 80 kg and the planned amount is 88 kg. With 25 kg bags, you need 4 bags.", "Bei 20 m², 4 kg/m² Verbrauch und 10 % Zuschlag beträgt der Grundbedarf 80 kg und die geplante Menge 88 kg. Bei 25-kg-Säcken brauchst du 4 Säcke."],
    "Miért kell ráhagyás?": ["Why allow extra?", "Warum einen Zuschlag einplanen?"], "A számított elméleti mennyiséghez képest veszteséget okozhat a keverőedényben maradó anyag, az aljzat kisebb egyenetlensége, a munkaközbeni selejt vagy a helyenként vastagabb ágyazás. A megfelelő ráhagyás helyzetfüggő; túl nagy tartalék fölösleges vásárlást, túl kicsi pedig munka közbeni anyaghiányt okozhat.": ["Material left in the mixing bucket, minor unevenness in the substrate, waste during application or thicker adhesive beds can increase usage beyond the theoretical amount. The right allowance depends on the job: too much means buying unnecessarily, while too little can leave you short during the work.", "Reste im Mischeimer, kleine Unebenheiten des Untergrunds, Materialverlust beim Arbeiten oder stellenweise dickere Kleberbetten können den Verbrauch über den theoretischen Wert erhöhen. Der passende Zuschlag hängt vom Projekt ab: Zu viel führt zu unnötigen Käufen, zu wenig kann während der Arbeit zu Materialmangel führen."],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "A csempe teljes felülete helyett csak a helyiség alapterületével számolnak, pedig falat is burkolnak.": ["Using only the room's floor area even though walls will also be tiled.", "Nur die Bodenfläche des Raums ansetzen, obwohl auch Wände gefliest werden."],
    "Más termék fogyási adatát használják.": ["Using the consumption rate for a different product.", "Den Verbrauchswert eines anderen Produkts verwenden."],
    "A gyártó által megadott kg/m² értéket összekeverik a zsák kiadósságával.": ["Confusing the manufacturer's kg/m² rate with the area covered by one bag.", "Den kg/m²-Wert des Herstellers mit der Reichweite eines Sacks verwechseln."],
    "Nem veszik figyelembe az aljzat egyenetlenségét és a szükséges technológiát.": ["Ignoring substrate unevenness and the required installation method.", "Unebenheiten des Untergrunds und die nötige Verlegetechnik nicht berücksichtigen."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Milyen kg/m² értéket írjak be?": ["Which kg/m² value should I enter?", "Welchen kg/m²-Wert soll ich eingeben?"],
    "Elsősorban a konkrét ragasztó műszaki adatlapján, a választott fogazáshoz vagy felhasználáshoz megadott fogyási értéket.": ["Use the consumption rate in the specific adhesive's technical data sheet for your chosen trowel notch or application.", "Verwende den Verbrauchswert aus dem technischen Datenblatt des konkreten Klebers für die gewählte Zahnung oder Anwendung."],
    "A kalkulátor figyelembe veszi a kétoldali kenést?": ["Does the calculator account for applying adhesive to both surfaces?", "Berücksichtigt der Rechner das beidseitige Auftragen?"],
    "Külön nem. Ha a technológia nagyobb anyagfelhasználást igényel, azt a kg/m² mezőben kell érvényesíteni.": ["Not separately. If your method needs more adhesive, reflect that in the kg/m² input.", "Nicht gesondert. Wenn die Verlegetechnik mehr Kleber erfordert, gib den höheren Wert im kg/m²-Feld ein."],
    "Megvehetem pontosan a számolt zsákszámot?": ["Can I buy exactly the calculated number of bags?", "Kann ich genau die berechnete Anzahl Säcke kaufen?"],
    "A számítás beszerzési becslés. Nagyobb vagy kritikus munkánál érdemes a kivitelezési körülményeket és a gyártói ajánlást is ellenőrizni.": ["This is a purchasing estimate. For larger or critical jobs, check the site conditions and the manufacturer's guidance as well.", "Das ist eine Einkaufsschätzung. Prüfe bei größeren oder anspruchsvollen Arbeiten auch die Bedingungen vor Ort und die Herstellerempfehlung."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"], "Csempe kalkulátor": ["Tile Calculator", "Fliesenrechner"], "Fuga kalkulátor": ["Grout Calculator", "Fugenmörtel-Rechner"], "Padlóburkolat kalkulátor": ["Flooring Calculator", "Bodenbelag-Rechner"],
    "Utolsó tartalmi frissítés:": ["Last content update:", "Letzte inhaltliche Aktualisierung:"], "2026. augusztus 21.": ["21 August 2026", "21. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    "A kalkulátor beszerzési becslést ad a megadott fogyási értékből. A konkrét termék műszaki adatlapja, a burkolási technológia és a helyszíni adottságok elsőbbséget élveznek.": ["The calculator gives a purchasing estimate from the consumption rate entered. The product's technical data sheet, installation method and conditions on site take precedence.", "Der Rechner liefert eine Einkaufsschätzung anhand des eingegebenen Verbrauchswerts. Maßgeblich sind das technische Datenblatt des Produkts, die Verlegetechnik und die Bedingungen vor Ort."],
    "Számítási módszertan": ["Calculation methodology", "Berechnungsmethodik"], "Hibát találtál? Jelezd.": ["Found an error? Let us know.", "Fehler gefunden? Gib uns Bescheid."]
  });
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];
    let match = /^([\d\s.,]+) kg$/u.exec(normalized);
    if (match) return `${formatHu(match[1], language)} kg`;
    match = /^(\d+) db$/u.exec(normalized);
    if (match) return `${new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE").format(Number(match[1]))} ${language === "en" ? (match[1] === "1" ? "bag" : "bags") : (match[1] === "1" ? "Sack" : "Säcke")}`;
    return null;
  }
  function formatHu(value, language) {
    const number = Number(value.replace(/\s/gu, "").replace(/\./gu, "").replace(/,/gu, "."));
    return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 1 }).format(number);
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Tile Adhesive Calculator" : "Fehlermeldung – Fliesenkleber-Rechner");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

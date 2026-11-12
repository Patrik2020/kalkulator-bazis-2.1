/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "uzemanyagar-kulonbseg-kalkulator";
  const main = doc.querySelector('main[data-batch03-calc="uzemanyagar-kulonbseg-kalkulator"]');
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
  const page = "uzemanyagar-kulonbseg-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Üzemanyagár-különbség kalkulátor | Kalkulátor Bázis","Fuel Price Comparison Calculator | Kalkulátor Bázis","Kraftstoffpreisvergleich | Kalkulátor Bázis"],
    ["Üzemanyagár-különbség kalkulátor","Fuel Price Comparison Calculator","Kraftstoffpreisvergleich"],
    ["Üzemanyagár-különbség","Fuel price difference","Kraftstoffpreisunterschied"],
    ["Hasonlíts össze két üzemanyagárat ugyanarra az útra, és számold ki a teljes költségkülönbséget a távolság és fogyasztás alapján.","Compare two fuel prices for the same trip and calculate the total cost difference from distance and fuel consumption.","Vergleiche zwei Kraftstoffpreise für dieselbe Fahrt und berechne den Gesamtkostenunterschied aus Strecke und Verbrauch."],
    ["Autó és közlekedés kalkulátorok","Car and transport calculators","Rechner für Auto und Verkehr"],
    ["Főoldal","Home","Startseite"],["Autó & közlekedés","Cars & transport","Auto & Verkehr"],["Morzsamenü","Breadcrumb","Brotkrumennavigation"],
    ["Távolság (km)","Distance (km)","Strecke (km)"],
    ["Átlagfogyasztás (l/100 km)","Average fuel consumption (l/100 km)","Durchschnittsverbrauch (l/100 km)"],
    ["Üzemanyagár A (Ft/l)","Fuel price A (HUF/l)","Kraftstoffpreis A (HUF/l)"],
    ["Üzemanyagár B (Ft/l)","Fuel price B (HUF/l)","Kraftstoffpreis B (HUF/l)"],
    ["Eredmény:","Result:","Ergebnis:"],
    ["Szükséges üzemanyag:","Fuel needed:","Benötigter Kraftstoff:"],
    ["Költség A árral:","Cost at price A:","Kosten bei Preis A:"],
    ["Költség B árral:","Cost at price B:","Kosten bei Preis B:"],
    ["Különbség:","Difference:","Unterschied:"],
    ["Szükséges üzemanyag","Fuel needed","Benötigter Kraftstoff"],
    ["Költség A árral","Cost at price A","Kosten bei Preis A"],
    ["Költség B árral","Cost at price B","Kosten bei Preis B"],
    ["Különbség","Difference","Unterschied"],
    ["Távolság: adj meg érvényes számot.","Distance: enter a valid number.","Strecke: Gib eine gültige Zahl ein."],
    ["Távolság: az érték legyen nagyobb nullánál.","Distance: the value must be greater than zero.","Strecke: Der Wert muss größer als null sein."],
    ["Fogyasztás: adj meg érvényes számot.","Fuel consumption: enter a valid number.","Verbrauch: Gib eine gültige Zahl ein."],
    ["Fogyasztás: az érték legyen nagyobb nullánál.","Fuel consumption: the value must be greater than zero.","Verbrauch: Der Wert muss größer als null sein."],
    ["Üzemanyagár A: adj meg érvényes számot.","Fuel price A: enter a valid number.","Kraftstoffpreis A: Gib eine gültige Zahl ein."],
    ["Üzemanyagár A: az érték nem lehet negatív.","Fuel price A: the value cannot be negative.","Kraftstoffpreis A: Der Wert darf nicht negativ sein."],
    ["Üzemanyagár B: adj meg érvényes számot.","Fuel price B: enter a valid number.","Kraftstoffpreis B: Gib eine gültige Zahl ein."],
    ["Üzemanyagár B: az érték nem lehet negatív.","Fuel price B: the value cannot be negative.","Kraftstoffpreis B: Der Wert darf nicht negativ sein."],
    ["Adj meg érvényes adatokat.","Enter valid values.","Gib gültige Werte ein."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Mire jó az üzemanyagár-különbség kalkulátor?","What is the fuel price comparison calculator for?","Wozu dient der Kraftstoffpreisvergleich?"],
    ["Az eszköz megmutatja, hogy ugyanazon távolság és fogyasztás mellett mekkora forintkülönbséget okoz két eltérő literenkénti üzemanyagár. Így gyorsan eldönthető, hogy egy olcsóbb töltőállomás vagy egy másik útvonal árkülönbsége pénzben mennyit jelent.","See how much two different fuel prices per litre change the cost of the same trip at the same distance and fuel consumption. This helps put a cheaper filling station's price difference into perspective.","Der Rechner zeigt, wie stark zwei verschiedene Literpreise die Kosten derselben Fahrt bei gleicher Strecke und gleichem Verbrauch verändern. So lässt sich der Preisvorteil einer günstigeren Tankstelle in Geld ausdrücken."],
    ["Először kiszámolja a szükséges üzemanyag mennyiségét:","First, it calculates the fuel needed:","Zuerst berechnet der Rechner die benötigte Kraftstoffmenge:"],
    ["távolság × fogyasztás / 100","distance × fuel consumption / 100","Strecke × Verbrauch / 100"],
    [". Ezt megszorozza mindkét literárral, majd a két teljes költség abszolút különbségét is megadja.",". It multiplies this by each price per litre and shows the absolute difference between the two total costs.",". Diese Menge wird mit jedem Literpreis multipliziert; anschließend wird die absolute Differenz der Gesamtkosten angezeigt."],
    ["Miért lehet kisebb a különbség, mint gondolnád?","Why might the difference be smaller than expected?","Warum kann der Unterschied kleiner sein als gedacht?"],
    ["A táblán látott literenkénti eltérés önmagában nem mondja meg az út teljes hatását. Például 20 Ft/l árkülönbség 32,5 liter felhasználásnál 650 Ft eltérést jelent. Ha az olcsóbb kút eléréséhez jelentős kitérőt kell tenni, annak külön üzemanyag- és időigénye lehet.","The price difference on the sign does not tell you the total effect on your trip. A 20 HUF/l difference over 32.5 litres amounts to 650 HUF. A significant detour to reach the cheaper station can cost additional fuel and time.","Der Preisunterschied auf dem Schild sagt allein wenig über die gesamten Fahrtkosten aus. Bei 32,5 Litern ergeben 20 HUF/l Unterschied insgesamt 650 HUF. Ein größerer Umweg zur günstigeren Tankstelle kostet zusätzlich Kraftstoff und Zeit."],
    ["Példa","Example","Beispiel"],
    ["500 km, 6,5 l/100 km fogyasztás esetén 32,5 liter szükséges. 600 Ft/l árral ez 19 500 Ft, 620 Ft/l árral 20 150 Ft, vagyis a különbség 650 Ft.","For 500 km at 6.5 l/100 km, you need 32.5 litres. At 600 HUF/l, the trip costs 19,500 HUF; at 620 HUF/l, 20,150 HUF. The difference is 650 HUF.","Für 500 km bei 6,5 l/100 km benötigst du 32,5 Liter. Bei 600 HUF/l kostet die Fahrt 19.500 HUF, bei 620 HUF/l 20.150 HUF. Die Differenz beträgt 650 HUF."],
    ["Mit nem vesz figyelembe?","What does it leave out?","Was berücksichtigt der Rechner nicht?"],
    ["A számítás állandó átlagfogyasztást feltételez. A forgalom, sebesség, időjárás, terhelés és vezetési stílus miatt a valós fogyasztás eltérhet, ezért az eredmény tájékozódó becslés.","The calculation assumes constant average fuel consumption. Actual consumption can vary with traffic, speed, weather, load and driving style, so the result is an estimate.","Die Berechnung setzt einen konstanten Durchschnittsverbrauch voraus. Verkehr, Geschwindigkeit, Wetter, Beladung und Fahrweise können den tatsächlichen Verbrauch verändern; das Ergebnis ist daher eine Schätzung."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],
    ["Melyik ár az olcsóbb?","Which price is cheaper?","Welcher Preis ist günstiger?"],
    ["A kalkulátor mindkét teljes költséget kiírja, így közvetlenül látható, melyik ár mellett alacsonyabb az út költsége.","The calculator shows both total costs, so you can see directly which price makes the trip cheaper.","Der Rechner zeigt beide Gesamtkosten. So erkennst du direkt, welcher Preis die Fahrt günstiger macht."],
    ["A kitérő költségét számolja?","Does it include the cost of a detour?","Berücksichtigt der Rechner einen Umweg?"],
    ["Nem automatikusan. Ha az egyik kúthoz plusz kilométert kell menni, azt külön érdemes hozzáadni a távolsághoz.","No, not automatically. If reaching one station adds kilometres, include that extra distance separately.","Nicht automatisch. Wenn die Fahrt zu einer Tankstelle zusätzliche Kilometer erfordert, solltest du diese Strecke gesondert berücksichtigen."],
    ["Elektromos autónál használható?","Can I use it for an electric car?","Ist der Rechner für Elektroautos geeignet?"],
    ["Nem. Ehhez a külön EV töltési költség kalkulátor való, amely kWh-alapú fogyasztással számol.","No. Use the separate EV charging cost calculator, which works with consumption in kWh.","Nein. Dafür gibt es den separaten Rechner für Ladekosten, der mit einem Verbrauch in kWh arbeitet."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],
    ["uzemanyag koltseg","fuel cost","Kraftstoffkosten"],["auto fogyasztas","fuel consumption","Kraftstoffverbrauch"],["tankolas","refuelling","Tanken"],
    ["Utolsó tartalmi frissítés:","Content last reviewed:","Inhalt zuletzt geprüft:"],
    ["2026. augusztus 21.","21 August 2026","21. August 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],
    ["Állandó átlagfogyasztással készült összehasonlító becslés. A valós üzemanyagköltséget a tényleges fogyasztás és a megtett út határozza meg.","A comparison based on constant average fuel consumption. Actual fuel cost depends on the amount used and distance travelled.","Ein Vergleich auf Basis eines konstanten Durchschnittsverbrauchs. Die tatsächlichen Kraftstoffkosten hängen vom realen Verbrauch und der gefahrenen Strecke ab."],
    ["Számítási módszertan","Calculation methods","Berechnungsmethodik"],
    ["Hibát találtál? Jelezd.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."],
    ["Hirdetés","Advertisement","Anzeige"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    const match = /^(-?\d[\d\s\u00a0]*(?:,\d+)?)\s?(l|Ft)$/u.exec(normalized);
    if (match) {
      const number = Number(match[1].replace(/[\s\u00a0]/gu, "").replace(",", "."));
      const formatted = new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 2 }).format(number);
      return match[2] === "Ft" ? formatted + " HUF" : formatted + " l";
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Fuel Price Comparison Calculator" : "Fehlermeldung – Kraftstoffpreisvergleich");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Fuel Price Comparison Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/uzemanyagar-kulonbseg-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Kraftstoffpreisvergleich\nSeite: https://kalkulatorbazis.hu/kalkulatorok/uzemanyagar-kulonbseg-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "utazasi-ido-kalkulator";
  const main = doc.querySelector('main[data-batch02-calc="utazasi-ido-kalkulator"]');
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
  const page = "utazasi-ido-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Utazási idő kalkulátor | Távolság és átlagsebesség","Travel Time Calculator | Distance and Average Speed","Fahrzeitrechner | Strecke und Durchschnittsgeschwindigkeit"],
    ["Utazási idő kalkulátor","Travel Time Calculator","Fahrzeitrechner"],
    ["Utazási idő kalkulátor távolság és átlagsebesség alapján. Becsüld meg a menetidőt, majd tervezz külön tartalékot a megállásokra.","Estimate travel time from distance and average speed, then allow extra time for stops.","Schätze die Fahrzeit anhand von Strecke und Durchschnittsgeschwindigkeit und plane zusätzliche Zeit für Pausen ein."],
    ["Számold ki a várható menetidőt távolság és átlagsebesség alapján.","Calculate an estimated journey time from distance and average speed.","Berechne die voraussichtliche Fahrzeit aus Strecke und Durchschnittsgeschwindigkeit."],
    ["Autó és közlekedés kalkulátorok","Car and transport calculators","Rechner für Auto und Verkehr"],
    ["Főoldal","Home","Startseite"],["Autó & közlekedés","Cars & transport","Auto & Verkehr"],
    ["Távolság (km)","Distance (km)","Strecke (km)"],["Átlagsebesség (km/h)","Average speed (km/h)","Durchschnittsgeschwindigkeit (km/h)"],
    ["Pihenőidő (perc)","Break time (minutes)","Pausenzeit (Minuten)"],
    ["Eredmény:","Result:","Ergebnis:"],["Várható menetidő:","Estimated travel time:","Voraussichtliche Fahrzeit:"],
    ["Várható menetidő","Estimated travel time","Voraussichtliche Fahrzeit"],
    ["Minden mezőben érvényes szám szerepeljen","Enter a valid number in every field.","Gib in jedem Feld eine gültige Zahl ein."],
    ["Az értékek legyenek nagyobbak nullánál","Values must be greater than zero.","Die Werte müssen größer als null sein."],
    ["Az értékek nem lehetnek negatívak","Values cannot be negative.","Die Werte dürfen nicht negativ sein."],
    ["Adj meg érvényes adatokat a számításhoz.","Enter valid values for the calculation.","Gib gültige Werte für die Berechnung ein."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Menetidő becslése távolságból","Estimating travel time from distance","Fahrzeit aus der Strecke schätzen"],
    ["Az utazási idő kalkulátor a távolság, a teljes útra becsült átlagsebesség és a tervezett pihenők alapján számít várható menetidőt. Használható autós kirándulás, kerékpározás vagy más, közel állandó átlagsebességgel leírható út előzetes tervezéséhez.","The calculator estimates travel time from distance, the average speed expected over the whole journey and planned breaks. Use it to plan a car trip, bike ride or another journey that can be described by an approximate overall average speed.","Der Rechner schätzt die Fahrzeit anhand der Strecke, der für die gesamte Reise angenommenen Durchschnittsgeschwindigkeit und geplanter Pausen. Er hilft bei der Planung von Autofahrten, Radtouren und anderen Wegen mit ungefähr abschätzbarem Gesamtdurchschnitt."],
    ["Az átlagsebesség nem azonos a megengedett legnagyobb sebességgel vagy azzal, amit az út egy részén mutat a sebességmérő. Városi szakaszok, forgalom, lehajtók, lassítások és megállások miatt a teljes út átlaga mindig alacsonyabb lehet.","Average speed is neither the speed limit nor a speedometer reading from one part of the route. Urban sections, traffic, junctions, slowing down and stops can make the overall average much lower.","Die Durchschnittsgeschwindigkeit ist weder die zulässige Höchstgeschwindigkeit noch ein Tachowert auf einem Teil der Strecke. Ortsdurchfahrten, Verkehr, Abfahrten, Bremsen und Stopps können den Gesamtdurchschnitt deutlich senken."],
    ["A képlet","The formula","Die Formel"],
    ["Az alap menetidő:","Driving time before breaks:","Fahrzeit ohne Pausen:"],
    ["távolság / átlagsebesség","distance / average speed","Strecke / Durchschnittsgeschwindigkeit"],
    [". A kalkulátor ezt óráról percre váltja, majd hozzáadja a külön megadott pihenőidőt. A váratlan torlódást, határátlépést vagy időjárási késést nem tudja előre jelezni.",". The calculator converts this to minutes and adds the entered break time. It cannot predict unexpected congestion, border delays or weather disruptions.",". Der Rechner wandelt das Ergebnis in Minuten um und addiert die eingegebene Pausenzeit. Unerwartete Staus, Wartezeiten an Grenzen oder wetterbedingte Verzögerungen kann er nicht vorhersagen."],
    ["Példa: 360 km-es út","Example: a 360 km trip","Beispiel: eine Fahrt über 360 km"],
    ["360 km távolság 90 km/h teljes útra vetített átlaggal 4 óra tiszta menetidőt jelent. Ha két, egyenként 20 perces pihenőt tervezel, a várható teljes idő 4 óra 40 perc.","At an overall average of 90 km/h, 360 km takes four hours of driving. With two planned 20-minute breaks, the estimated total is 4 hours 40 minutes.","Für 360 km bei einer Durchschnittsgeschwindigkeit von 90 km/h beträgt die reine Fahrzeit vier Stunden. Mit zwei geplanten Pausen von je 20 Minuten ergibt sich eine geschätzte Gesamtdauer von 4 Stunden 40 Minuten."],
    ["Hogyan válassz reális átlagsebességet?","How do you choose a realistic average speed?","Wie wählst du eine realistische Durchschnittsgeschwindigkeit?"],
    ["Autópályán sem célszerű automatikusan 130 km/h átlaggal számolni. Egy vegyes, városi és országúti szakaszokat is tartalmazó útnál az átlag akár jóval alacsonyabb lehet. Korábbi hasonló utak navigációs adata vagy egy útvonaltervező által becsült tiszta menetidő jó támpont.","Even on a motorway, do not automatically assume an average of 130 km/h. A route with urban and rural sections may have a much lower average. Navigation data from similar trips or a route planner's driving-time estimate can provide a useful starting point.","Auch auf der Autobahn solltest du nicht automatisch mit 130 km/h im Durchschnitt rechnen. Auf einer gemischten Strecke mit Stadt- und Landstraßen kann der Schnitt deutlich niedriger sein. Navigationsdaten ähnlicher Fahrten oder die reine Fahrzeitschätzung eines Routenplaners sind gute Anhaltspunkte."],
    ["Gyakori hibák","Common mistakes","Häufige Fehler"],
    ["A maximális sebességet átlagsebességként adják meg.","Entering the maximum speed as the average speed.","Die Höchstgeschwindigkeit als Durchschnitt einzugeben."],
    ["Csak az egyirányú távolságot írják be, de oda-vissza eredményt várnak.","Entering a one-way distance but expecting a round-trip result.","Nur die einfache Strecke einzugeben, aber ein Ergebnis für Hin- und Rückfahrt zu erwarten."],
    ["A pihenőt órában adják meg, miközben a mező percet kér.","Entering breaks in hours although the field asks for minutes.","Pausen in Stunden einzugeben, obwohl das Feld Minuten verlangt."],
    ["A parkolókeresést, tankolást vagy határátlépést nem tervezik bele.","Leaving out time for parking, refuelling or border crossings.","Zeit für Parkplatzsuche, Tanken oder Grenzübertritte nicht einzuplanen."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],
    ["Oda-vissza útra mit adjak meg?","What should I enter for a round trip?","Was gebe ich für Hin- und Rückfahrt ein?"],
    ["A teljes oda-vissza távolságot írd be, és a mindkét irányra tervezett pihenőt add hozzá.","Enter the total distance in both directions and add all planned breaks.","Gib die Gesamtstrecke für Hin- und Rückfahrt sowie alle geplanten Pausen ein."],
    ["A dugót figyelembe veszi?","Does it account for traffic jams?","Berücksichtigt der Rechner Staus?"],
    ["Nem. A forgalom hatását csak úgy tudod közelíteni, ha alacsonyabb átlagsebességet használsz.","No. You can approximate traffic delays by using a lower average speed.","Nein. Verkehrsbedingte Verzögerungen kannst du nur näherungsweise durch eine niedrigere Durchschnittsgeschwindigkeit berücksichtigen."],
    ["Miért hosszabb a valós út, mint a számítás?","Why can the actual journey take longer?","Warum kann die tatsächliche Fahrt länger dauern?"],
    ["A tényleges forgalom, terelések, megállások és a változó sebesség növelhetik az időt.","Traffic, diversions, stops and changing speeds can increase journey time.","Verkehr, Umleitungen, Stopps und wechselnde Geschwindigkeiten können die Fahrzeit verlängern."],
    ["Kerékpáros útra is használható?","Can I use it for a bike ride?","Kann ich den Rechner auch für eine Radtour nutzen?"],
    ["Igen, ha reális kerékpáros átlagsebességet és a pihenőket adod meg.","Yes, if you enter a realistic cycling average speed and the planned breaks.","Ja, wenn du eine realistische Durchschnittsgeschwindigkeit fürs Radfahren und die Pausen eingibst."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],
    ["Üzemanyagköltség","Fuel cost","Kraftstoffkosten"],["Sebesség átváltó","Speed converter","Geschwindigkeitsumrechner"],["Autópályadíj megosztó","Motorway toll split","Aufteilung der Autobahnmaut"],
    ["Utolsó tartalmi frissítés:","Content last reviewed:","Inhalt zuletzt geprüft:"],
    ["2026. július 1.","1 July 2026","1. Juli 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],
    ["Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.","This is an estimate based on distance, average speed and planned breaks. Actual traffic and unplanned delays can change the travel time.","Dies ist eine Schätzung anhand von Strecke, Durchschnittsgeschwindigkeit und geplanten Pausen. Verkehr und ungeplante Verzögerungen können die tatsächliche Fahrzeit verändern."],
    ["A számítások módszertana és minőségbiztosítása","Calculation methods and quality assurance","Berechnungsmethoden und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."],
    ["Sebesség és időnyereség","Speed and time savings","Geschwindigkeit und Zeitgewinn"],
    ["A +10 km/h nem mindig ugyanannyi percet nyer","An extra 10 km/h does not always save the same number of minutes","10 km/h mehr sparen nicht immer gleich viele Minuten"],
    ["Alap átlagsebesség (km/h)","Baseline average speed (km/h)","Bisherige Durchschnittsgeschwindigkeit (km/h)"],
    ["Gyorsabb átlag (km/h)","Faster average speed (km/h)","Höhere Durchschnittsgeschwindigkeit (km/h)"],
    ["Megállások összesen (perc)","Total stops (minutes)","Stopps insgesamt (Minuten)"],
    ["Alap teljes idő","Baseline total time","Bisherige Gesamtdauer"],
    ["Gyorsabb forgatókönyv","Faster scenario","Schnelleres Szenario"],
    ["Időnyereség","Time saved","Zeitgewinn"],
    ["Átlagsebesség, nem tempomat","Average speed, not cruise-control speed","Durchschnitt, nicht Tempomatgeschwindigkeit"],
    ["Település, forgalom, pihenő, torlódás és útviszony miatt az egész útra vonatkozó átlagsebesség jóval alacsonyabb lehet a pillanatnyi haladási sebességnél.","Towns, traffic, breaks, congestion and road conditions can make the average speed over the whole journey much lower than the speed while moving.","Ortsdurchfahrten, Verkehr, Pausen, Staus und Straßenverhältnisse können den Durchschnitt über die gesamte Fahrt deutlich unter die momentane Fahrgeschwindigkeit senken."],
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
    const hours = /^(\d+) óra (\d+) perc$/u.exec(normalized);
    if (hours) return language === "en" ? hours[1] + " h " + hours[2] + " min" : hours[1] + " Std. " + hours[2] + " Min.";
    const compact = /^(\d+) ó (\d+) p$/u.exec(normalized);
    if (compact) return language === "en" ? compact[1] + " h " + compact[2] + " min" : compact[1] + " Std. " + compact[2] + " Min.";
    const minutes = /^(\d+) perc$/u.exec(normalized);
    if (minutes) return language === "en" ? minutes[1] + " min" : minutes[1] + " Min.";
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Travel Time Calculator" : "Fehlermeldung – Fahrzeitrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Travel Time Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/utazasi-ido-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Fahrzeitrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/utazasi-ido-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

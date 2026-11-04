/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "futotempo-kalkulator", main = doc.querySelector('main[data-batch01-calc="futotempo-kalkulator"]');
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
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "futotempo-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Futótempó kalkulátor | Perc/km, km/h és részidők","Running Pace Calculator | Min/km, km/h and Split Times","Lauftempo-Rechner | Min/km, km/h und Zwischenzeiten"],
    ["Futótempó kalkulátor távolság és idő alapján. Számold ki a perc/km tempót, az átlagsebességet, valamint azonos tempóval az 5 és 10 km-es részidőt.","Running pace calculator based on distance and time. Calculate pace in min/km, average speed and 5 km and 10 km times at the same pace.","Lauftempo-Rechner anhand von Distanz und Zeit. Berechne das Tempo in min/km, die Durchschnittsgeschwindigkeit sowie die 5- und 10-km-Zeit bei gleichem Tempo."],
    ["Futótempó kalkulátor | Perc/km és km/h","Running Pace Calculator | Min/km and km/h","Lauftempo-Rechner | Min/km und km/h"],["Számold ki a futótempót távolság és teljes idő alapján.","Calculate running pace from distance and total time.","Berechne dein Lauftempo anhand von Distanz und Gesamtzeit."],
    ["Futótempó kalkulátor","Running Pace Calculator","Lauftempo-Rechner"],["Számold ki a perc/km tempót, az átlagsebességet és az azonos tempójú részidőket.","Calculate pace in min/km, average speed and split times at the same pace.","Berechne das Tempo in min/km, die Durchschnittsgeschwindigkeit und Zwischenzeiten bei gleichem Tempo."],["Egészség és sport kalkulátorok","Health and sport calculators","Gesundheits- und Sportrechner"],["Főoldal","Home","Startseite"],["Egészség & sport","Health & sport","Gesundheit & Sport"],["Futótempó","Running pace","Lauftempo"],["Morzsamenü","Breadcrumb","Brotkrümelnavigation"],
    ["Távolságból és teljes időből számold ki a perc/km tempót, az átlagsebességet és azonos tempójú részidőket.","Use distance and total time to calculate pace in min/km, average speed and split times at the same pace.","Berechne aus Distanz und Gesamtzeit das Tempo in min/km, die Durchschnittsgeschwindigkeit und Zwischenzeiten bei gleichem Tempo."],
    ["Távolság (km)","Distance (km)","Distanz (km)"],["Óra","Hours","Stunden"],["Perc (0–59)","Minutes (0–59)","Minuten (0–59)"],["Másodperc (0–59)","Seconds (0–59)","Sekunden (0–59)"],["Eredmény:","Result:","Ergebnis:"],
    ["Átlagtempó:","Average pace:","Durchschnittstempo:"],["Átlagsebesség:","Average speed:","Durchschnittsgeschwindigkeit:"],["5 km azonos tempóval:","5 km at the same pace:","5 km bei gleichem Tempo:"],["10 km azonos tempóval:","10 km at the same pace:","10 km bei gleichem Tempo:"],
    ["Átlagtempó","Average pace","Durchschnittstempo"],["Átlagsebesség","Average speed","Durchschnittsgeschwindigkeit"],["5 km azonos tempóval","5 km at the same pace","5 km bei gleichem Tempo"],["10 km azonos tempóval","10 km at the same pace","10 km bei gleichem Tempo"],
    ["A perc és másodperc mező 0–59 közötti legyen.","Minutes and seconds must be between 0 and 59.","Minuten und Sekunden müssen zwischen 0 und 59 liegen."],["A teljes futóidő legyen nagyobb nullánál.","Total running time must be greater than zero.","Die gesamte Laufzeit muss größer als null sein."],["Adj meg érvényes adatokat a számításhoz.","Enter valid values to calculate.","Gib gültige Werte für die Berechnung ein."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.","Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Mi a futótempó?","What is running pace?","Was ist Lauftempo?"],["A futótempó azt mutatja meg, hogy átlagosan mennyi idő alatt teszel meg egy kilométert. Magyarországon és Európa nagy részén jellemzően","Running pace shows the average time needed to cover one kilometre. In Hungary and most of Europe it is usually expressed in","Das Lauftempo zeigt, wie viel Zeit du durchschnittlich für einen Kilometer benötigst. In Ungarn und weiten Teilen Europas wird es üblicherweise in"],["perc/km","min/km","min/km"],["formában használjuk. Például az 5:00/km azt jelenti, hogy egy kilométer megtételéhez átlagosan öt percre van szükség.",". For example, 5:00/km means that each kilometre takes five minutes on average.","angegeben. 5:00/km bedeutet zum Beispiel, dass du für einen Kilometer durchschnittlich fünf Minuten benötigst."],
    ["A kalkulátor ugyanabból a távolság–idő párosból az átlagsebességet is meghatározza km/h-ban. A két adat ugyanazt a teljesítményt más szemszögből fejezi ki: futásnál a tempó általában kényelmesebb, közlekedésnél a sebesség megszokottabb.","The calculator also derives average speed in km/h from the same distance and time. Both figures describe the same performance from different perspectives: pace is usually more useful for running, while speed is more familiar for travel.","Der Rechner ermittelt aus derselben Distanz und Zeit auch die Durchschnittsgeschwindigkeit in km/h. Beide Werte beschreiben dieselbe Leistung aus unterschiedlichen Blickwinkeln: Beim Laufen ist das Tempo meist praktischer, im Verkehr die Geschwindigkeit vertrauter."],
    ["A számítás","The calculation","Die Berechnung"],["Tempó = teljes idő / távolság.","Pace = total time / distance.","Tempo = Gesamtzeit / Distanz."],["A kalkulátor a megadott órát, percet és másodpercet először másodpercre váltja, majd elosztja a kilométerek számával. Az átlagsebesség képlete","The calculator first converts the entered hours, minutes and seconds to seconds, then divides by the number of kilometres. The formula for average speed is","Der Rechner wandelt die eingegebenen Stunden, Minuten und Sekunden zunächst in Sekunden um und teilt durch die Kilometerzahl. Die Formel für die Durchschnittsgeschwindigkeit lautet"],["távolság / idő órában","distance / time in hours","Distanz / Zeit in Stunden"],[".",".","."],
    ["Példa","Example","Beispiel"],["Ha 10 km-t 50 perc alatt futsz le, az átlagtempód 5:00/km, az átlagsebességed pedig 12 km/h. Ugyanezt a tempót tartva 5 km 25 perc lenne.","If you run 10 km in 50 minutes, your average pace is 5:00/km and your average speed is 12 km/h. At the same pace, 5 km would take 25 minutes.","Wenn du 10 km in 50 Minuten läufst, beträgt dein Durchschnittstempo 5:00/km und deine Durchschnittsgeschwindigkeit 12 km/h. Bei gleichem Tempo würdest du für 5 km 25 Minuten benötigen."],
    ["Mit jelentenek az 5 és 10 km-es részidők?","What do the 5 km and 10 km split times mean?","Was bedeuten die 5- und 10-km-Zwischenzeiten?"],["Ezek nem versenyjóslatok. Egyszerűen azt mutatják meg, mennyi idő lenne szükséges 5 vagy 10 kilométerhez,","These are not race predictions. They simply show the time required for 5 or 10 kilometres","Das sind keine Wettkampfprognosen. Sie zeigen lediglich, wie viel Zeit du für 5 oder 10 Kilometer benötigen würdest,"],["ha pontosan ugyanazt az átlagtempót tartanád","if you maintained exactly the same average pace","wenn du genau dasselbe Durchschnittstempo beibehalten würdest"],[". A valós versenyteljesítmény nem lineáris: hosszabb távon a fáradás, rövidebb távon a nagyobb intenzitás miatt más tempó lehet fenntartható.",". Actual race performance is not linear: fatigue over longer distances and greater intensity over shorter ones mean that a different pace may be sustainable.",". Die tatsächliche Wettkampfleistung ist nicht linear: Auf längeren Strecken können Ermüdung und auf kürzeren Strecken höhere Intensität zu einem anderen haltbaren Tempo führen."],
    ["Átlagtempó és pillanatnyi tempó","Average pace and current pace","Durchschnittstempo und momentanes Tempo"],["A kalkulátor a teljes szakasz átlagát számolja. Egy GPS-óra pillanatnyi tempója futás közben folyamatosan ingadozhat, és a GPS pontatlansága is módosíthatja. Edzéstervezésnél ezért gyakran hasznosabb hosszabb körök vagy teljes szakaszok átlagát figyelni.","The calculator uses the average for the whole segment. A GPS watch's current pace can fluctuate continuously while running, and GPS inaccuracy can affect it. For training, it is often more useful to monitor averages over longer laps or complete segments.","Der Rechner verwendet den Durchschnitt des gesamten Abschnitts. Das momentane Tempo einer GPS-Uhr kann beim Laufen ständig schwanken und durch GPS-Ungenauigkeit beeinflusst werden. Für die Trainingsplanung sind Durchschnittswerte längerer Runden oder vollständiger Abschnitte oft hilfreicher."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],["Beírhatok 5 km-nél rövidebb távot?","Can I enter a distance shorter than 5 km?","Kann ich eine kürzere Distanz als 5 km eingeben?"],["Igen, tizedes kilométer is megadható, például 0,4 km egy 400 méteres pályakörhöz.","Yes. Decimal kilometres are accepted, for example 0.4 km for one 400-metre track lap.","Ja. Du kannst Dezimalkilometer eingeben, zum Beispiel 0,4 km für eine 400-Meter-Bahn-Runde."],["A 4:30/km gyorsabb, mint az 5:00/km?","Is 4:30/km faster than 5:00/km?","Ist 4:30/km schneller als 5:00/km?"],["Igen. Tempónál a kisebb perc/km érték jelent nagyobb sebességet.","Yes. For pace, a lower min/km value means a higher speed.","Ja. Beim Tempo bedeutet ein niedrigerer min/km-Wert eine höhere Geschwindigkeit."],["Versenyidőt jósol a kalkulátor?","Does the calculator predict race time?","Prognostiziert der Rechner eine Wettkampfzeit?"],["Nem. Az 5 és 10 km-es érték kizárólag azonos tempóval történő matematikai átszámítás.","No. The 5 km and 10 km values are only mathematical conversions at the same pace.","Nein. Die Werte für 5 und 10 km sind lediglich mathematische Umrechnungen bei gleichem Tempo."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],["Pulzus zóna","Heart-rate zones","Herzfrequenzzonen"],["Kalória kalkulátor","Calorie Calculator","Kalorienrechner"],["Alvásciklus kalkulátor","Sleep Cycle Calculator","Schlafzyklus-Rechner"],["Utolsó tartalmi frissítés:","Last content update:","Letzte inhaltliche Aktualisierung:"],["2026. augusztus 21.","21 August 2026","21. August 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],["Az eszköz matematikai tempó- és sebességátváltást végez. Nem egészségügyi vizsgálat, edzésterv vagy versenyteljesítmény-előrejelzés.","This tool performs a mathematical conversion between pace and speed. It is not a medical assessment, training plan or race-performance prediction.","Dieses Werkzeug führt eine mathematische Umrechnung von Tempo und Geschwindigkeit durch. Es ist weder eine medizinische Untersuchung noch ein Trainingsplan oder eine Wettkampfprognose."],["Számítási módszertan","Calculation methodology","Berechnungsmethodik"],["Hibát találtál? Jelezd.","Found an error? Let us know.","Fehler gefunden? Gib uns Bescheid."],["Hirdetés","Advertisement","Anzeige"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const labels = { "Távolság": ["Distance", "Distanz"], "Óra": ["Hours", "Stunden"], "Perc": ["Minutes", "Minuten"], "Másodperc": ["Seconds", "Sekunden"] };
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    let match = /^(.+): adj meg érvényes számot\.$/u.exec(normalized);
    if (match && labels[match[1]]) return `${labels[match[1]][language === "en" ? 0 : 1]}: ${language === "en" ? "enter a valid number." : "Gib eine gültige Zahl ein."}`;
    match = /^(.+): az érték legyen nagyobb nullánál\.$/u.exec(normalized);
    if (match && labels[match[1]]) return `${labels[match[1]][language === "en" ? 0 : 1]}: ${language === "en" ? "enter a value greater than zero." : "Gib einen Wert größer als null ein."}`;
    match = /^(.+): az érték nem lehet negatív\.$/u.exec(normalized);
    if (match && labels[match[1]]) return `${labels[match[1]][language === "en" ? 0 : 1]}: ${language === "en" ? "the value cannot be negative." : "Der Wert darf nicht negativ sein."}`;
    return null;
  }
  function localizeReportHref(sourceHref, language) {
    if (language === "hu" || !supported.includes(language)) return sourceHref;
    const url = new URL(sourceHref);
    url.searchParams.set("subject", language === "en" ? "Error report – Running Pace Calculator" : "Fehlermeldung – Lauftempo-Rechner");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, localizeReportHref };
});

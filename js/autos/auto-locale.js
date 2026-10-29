/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document;
  const pageKey = "auto-kalkulator";
  const main = doc.querySelector("main.page-auto");
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attributeState = new WeakMap(), originals = new Map();
  function renderText(node) {
    const current = node.nodeValue, previous = textState.get(node);
    const source = previous && previous.rendered === current ? previous.source : current;
    const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
    if (!parts || !parts[2]) return;
    const translated = api.translate(pageKey, parts[2], language);
    const result = parts[1] + (translated ?? parts[2]) + parts[3];
    if (result !== current) node.nodeValue = result;
    if (translated !== null || previous) textState.set(node, { source, rendered: result });
  }
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        renderText(node);
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        if (element.closest("[contenteditable],[translate='no']")) return;
        let state = attributeState.get(element);
        if (!state) { state = new Map(); attributeState.set(element, state); }
        for (const name of ["aria-label","placeholder","title"]) {
          if (!element.hasAttribute(name)) continue;
          const current = element.getAttribute(name), previous = state.get(name);
          const source = previous && previous.rendered === current ? previous.source : current;
          const value = api.translate(pageKey, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      for (const selector of ["title",'meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector);
        if (!element) continue;
        const key = selector === "title" ? "title" : selector + ":" + (element.getAttribute("name") || element.getAttribute("property") || "");
        if (!originals.has(key)) originals.set(key, selector === "title" ? element.textContent : element.getAttribute("content"));
        const source = originals.get(key), value = api.translate(pageKey, source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.setAttribute("content", value);
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => {
    if (changes.some(change => change.type === "childList" || change.type === "characterData")) render();
  }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const pageKey = "auto-kalkulator";
  const dictionary = Object.freeze({
    "Utazási költség kalkulátor – fogyasztás és hatótáv":["Trip Cost Calculator – Fuel Consumption and Range","Fahrtkosten-Rechner – Verbrauch und Reichweite"],
    "Utazási költség kalkulátor autóhoz: számold ki az üzemanyagköltséget távolság, fogyasztás és literár alapján, valamint a fogyasztást és becsült hatótávot.":["Calculate your car's fuel cost based on distance, consumption and price per litre, as well as fuel consumption and estimated range.","Berechne Kraftstoffkosten anhand von Strecke, Verbrauch und Literpreis sowie den Verbrauch und die geschätzte Reichweite."],
    "Utazási költség, fogyasztás és hatótáv kalkulátor":["Trip Cost, Fuel Consumption and Range Calculator","Rechner für Fahrtkosten, Verbrauch und Reichweite"],
    "Számold ki egy út üzemanyagköltségét, az autó fogyasztását és a becsült hatótávot egy helyen.":["Calculate trip fuel costs, your car's fuel consumption and its estimated range in one place.","Berechne an einem Ort die Kraftstoffkosten einer Fahrt, den Verbrauch deines Autos und die geschätzte Reichweite."],
    "Fogyasztás kalkulátor":["Fuel Consumption Calculator","Verbrauchsrechner"],
    "Megtett távolság (km)":["Distance travelled (km)","Zurückgelegte Strecke (km)"],
    "Elhasznált üzemanyag (liter)":["Fuel used (litres)","Verbrauchter Kraftstoff (Liter)"],
    "Fogyasztás:":["Fuel consumption:","Verbrauch:"],
    "Hasznos volt ez a kalkulátor?":["Was this calculator useful?","War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.":["Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.":["Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek":["Bookmark, install and sharing options","Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm":["Bookmark","Lesezeichen"],
    "Telepítem":["Install","Installieren"],
    "Megosztom":["Share","Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.":["Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.":["Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    "Utazási költség kalkulátor":["Trip Cost Calculator","Fahrtkosten-Rechner"],
    "Távolság (km)":["Distance (km)","Strecke (km)"],
    "Fogyasztás (l/100km)":["Consumption (L/100 km)","Verbrauch (l/100 km)"],
    "Üzemanyag ár (Ft/l)":["Fuel price (HUF/L)","Kraftstoffpreis (HUF/l)"],
    "Költség:":["Cost:","Kosten:"],
    "Hatótáv kalkulátor":["Range Calculator","Reichweiten-Rechner"],
    "Tank mérete (liter)":["Tank capacity (litres)","Tankvolumen (Liter)"],
    "Hatótáv:":["Range:","Reichweite:"],
    "Három autós számítás egy oldalon":["Three Car Calculations on One Page","Drei Autoberechnungen auf einer Seite"],
    "Az összetett autós kalkulátor három külön kérdésre ad választ: mennyi volt a tényleges átlagfogyasztás egy megtett szakaszon, mennyibe kerülhet egy tervezett út, illetve mekkora elméleti hatótáv tartozik a tankban lévő üzemanyaghoz. A három eredmény összefügg, de más bemeneti adatokat igényel.":["This combined car calculator answers three different questions: the actual average fuel consumption over a completed journey, the estimated fuel cost of a planned trip, and the theoretical range from the fuel in the tank. The results are related, but each requires different inputs.","Dieser kombinierte Autorechner beantwortet drei unterschiedliche Fragen: den tatsächlichen Durchschnittsverbrauch auf einer gefahrenen Strecke, die geschätzten Kraftstoffkosten einer geplanten Fahrt und die theoretische Reichweite mit dem Kraftstoff im Tank. Die Ergebnisse hängen zusammen, benötigen aber unterschiedliche Eingaben."],
    "1. Tényleges átlagfogyasztás":["1. Actual Average Fuel Consumption","1. Tatsächlicher Durchschnittsverbrauch"],
    "A fogyasztás képlete:":["Fuel consumption formula:","Formel für den Verbrauch:"],
    "elhasznált liter / megtett kilométer × 100":["litres used / kilometres travelled × 100","verbrauchte Liter / gefahrene Kilometer × 100"],
    ". A legjobb összehasonlításhoz teletankolástól teletankolásig mért adatot használj, lehetőleg több tankolás átlagából.":[". For the best comparison, measure from one full tank to the next, ideally using an average across several refuels.",". Für einen guten Vergleich misst du am besten von Volltankung zu Volltankung und verwendest möglichst den Durchschnitt mehrerer Tankvorgänge."],
    "Példa fogyasztásra":["Fuel consumption example","Verbrauchsbeispiel"],
    "Ha 620 km alatt 39,5 liter fogyott, az átlag 39,5 / 620 × 100 = 6,37 l/100 km.":["If you used 39.5 litres over 620 km, the average is 39.5 / 620 × 100 = 6.37 L/100 km.","Bei 620 km und 39,5 Litern Verbrauch beträgt der Durchschnitt 39,5 / 620 × 100 = 6,37 l/100 km."],
    "2. Egy út várható üzemanyagköltsége":["2. Estimated Fuel Cost for a Trip","2. Geschätzte Kraftstoffkosten einer Fahrt"],
    "A szükséges üzemanyag a távolság és fogyasztás szorzata 100-zal osztva. Ezt szorozza a kalkulátor a literárral. Oda-vissza útnál a teljes távolságot add meg, és számolj az autópályadíjjal, parkolással, valamint egyéb költségekkel is.":["Fuel needed is the distance multiplied by the consumption, divided by 100. The calculator then multiplies that amount by the price per litre. For a return trip, enter the total distance and also allow for tolls, parking and other costs.","Der benötigte Kraftstoff ergibt sich aus Strecke mal Verbrauch, geteilt durch 100. Diesen Wert multipliziert der Rechner mit dem Literpreis. Gib für eine Hin- und Rückfahrt die Gesamtstrecke ein und berücksichtige auch Maut, Parkgebühren und weitere Kosten."],
    "Példa útiköltségre":["Trip cost example","Fahrtkosten-Beispiel"],
    "240 km, 6,5 l/100 km és 640 Ft/l esetén 15,6 liter, azaz körülbelül 9 984 Ft üzemanyagköltség adódik.":["At 240 km, 6.5 L/100 km and HUF 640/L, the trip uses 15.6 litres and costs about HUF 9,984 in fuel.","Bei 240 km, 6,5 l/100 km und 640 HUF/l werden 15,6 Liter benötigt. Das entspricht etwa 9.984 HUF Kraftstoffkosten."],
    "3. Elméleti hatótáv":["3. Theoretical Range","3. Theoretische Reichweite"],
    "A hatótáv képlete:":["Range formula:","Formel für die Reichweite:"],
    "üzemanyag liter / fogyasztás × 100":["fuel in litres / consumption × 100","Kraftstoff in Litern / Verbrauch × 100"],
    ". A tank méretének megadásakor ne feledd, hogy a névleges kapacitás nem feltétlenül azonos a pillanatnyilag felhasználható mennyiséggel. Mindig hagyj biztonsági tartalékot.":[". When entering tank capacity, remember that the stated capacity may not equal the amount currently available to use. Always leave a safety reserve.",". Beachte bei der Tankgröße, dass das Nennvolumen nicht unbedingt der aktuell nutzbaren Kraftstoffmenge entspricht. Lass immer eine Sicherheitsreserve."],
    "Miért térhet el a valós eredmény?":["Why Can the Real Result Differ?","Warum kann das tatsächliche Ergebnis abweichen?"],
    "városi forgalom, hidegindítás és rövid utak;":["city traffic, cold starts and short trips;","Stadtverkehr, Kaltstarts und Kurzstrecken;"],
    "sebesség, emelkedők és erős szél;":["speed, hills and strong headwinds;","Geschwindigkeit, Steigungen und starker Wind;"],
    "klíma, fűtés, terhelés és tetőcsomagtartó;":["air conditioning, heating, load and roof racks;","Klimaanlage, Heizung, Beladung und Dachträger;"],
    "guminyomás, gumiabroncs és műszaki állapot;":["tyre pressure, tyres and vehicle condition;","Reifendruck, Reifen und Fahrzeugzustand;"],
    "a fedélzeti számítógép és a tankolás mérési hibája.":["on-board computer estimates and refuelling measurement errors.","Schätzwerte des Bordcomputers und Messfehler beim Tanken."],
    "Gyakori kérdések":["Frequently asked questions","Häufige Fragen"],
    "Melyik fogyasztási adatot használjam úttervezéshez?":["Which fuel consumption figure should I use for trip planning?","Welchen Verbrauchswert sollte ich für die Fahrtplanung verwenden?"],
    "Az adott út jellegéhez hasonló korábbi utak átlagát. Autópályára ne feltétlenül a városi értéket add meg.":["Use the average from previous trips with similar conditions. For motorway driving, don't automatically use your city figure.","Verwende den Durchschnitt ähnlicher früherer Fahrten. Für Autobahnfahrten solltest du nicht unbedingt den Stadtverbrauch ansetzen."],
    "Miért más a fedélzeti számítógép?":["Why does the on-board computer show a different figure?","Warum zeigt der Bordcomputer einen anderen Wert?"],
    "A jármű becsült befecskendezési és távolságadatai eltérhetnek a tankolásból számolt értéktől.":["The vehicle's estimated fuel injection and distance data may differ from a figure calculated from refuelling.","Die geschätzten Einspritz- und Streckendaten des Fahrzeugs können von einem aus Tankvorgängen berechneten Wert abweichen."],
    "Elektromos autóra használható?":["Can I use it for an electric car?","Kann ich den Rechner für ein Elektroauto verwenden?"],
    "Nem közvetlenül; ott kWh/100 km, akkukapacitás és áramár szükséges.":["Not directly; an electric car requires kWh/100 km, battery capacity and electricity price.","Nicht direkt. Dafür brauchst du kWh/100 km, die Akkukapazität und den Strompreis."],
    "A teljes autóköltséget mutatja?":["Does it show the total cost of owning a car?","Zeigt der Rechner die gesamten Autokosten?"],
    "Nem. Az értékvesztés, biztosítás, szerviz, adók és kopás külön számolandó.":["No. Depreciation, insurance, servicing, taxes and wear need to be calculated separately.","Nein. Wertverlust, Versicherung, Wartung, Steuern und Verschleiß müssen separat berechnet werden."],
    "Kapcsolódó kalkulátorok":["Related calculators","Verwandte Rechner"],
    "Autófogyasztás":["Car Fuel Consumption","Autoverbrauch"],
    "Üzemanyagköltség":["Fuel Cost","Kraftstoffkosten"],
    "Éves autóköltség":["Annual Car Costs","Jährliche Autokosten"],
    "Gumiméret-váltó":["Tyre Size Converter","Reifengrößen-Umrechner"],
    "EV töltési költség kalkulátor":["EV Charging Cost Calculator","Rechner für Ladekosten von Elektroautos"],
    "Utolsó tartalmi frissítés:":["Last content update:","Letzte inhaltliche Aktualisierung:"],
    "2026. július 1.":["1 July 2026","1. Juli 2026"],
    "Kapcsolódó friss adat":["Related current data","Passende aktuelle Daten"],
    "NAV üzemanyag-elszámolási árak: 2026. szeptember":["NAV fuel accounting prices: September 2026","NAV-Kraftstoffabrechnungspreise: September 2026"],
    "– hivatalos forrásból feldolgozott aktuális adat és gyakorlati értelmezés.":["– current data from an official source, with practical context.","– aktuelle Daten aus einer offiziellen Quelle mit praktischer Einordnung."],
    "Hitelesség és számítási korlátok":["Reliability and calculation limits","Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.":["This is an estimate based on the consumption, price and trip details you enter. Driving conditions, vehicle condition and changing fees may affect the actual amount.","Das Ergebnis ist eine Schätzung auf Grundlage der eingegebenen Verbrauchs-, Preis- und Streckendaten. Fahrbedingungen, Fahrzeugzustand und geänderte Gebühren können den tatsächlichen Wert beeinflussen."],
    "A számítások módszertana és minőségbiztosítása":["Calculation methodology and quality assurance","Berechnungsmethodik und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.":["Found an issue? Let us know.","Einen Fehler gefunden? Sag uns Bescheid."],
    "Marginalis vagy teljes autóköltség?":["Marginal or total car cost?","Zusätzliche oder gesamte Autokosten?"],
    "Ugyanaz az út kétféleképpen is árazható":["The same trip can be costed in two ways","Dieselbe Fahrt lässt sich auf zwei Arten berechnen"],
    "Ha azt kérdezed, mennyivel kerül többe, hogy ma elindulsz, a változó költség a fontos. Ha azt kérdezed, mennyibe kerül neked valójában az autózás, a fix és évesített költségeket is fel kell osztani a megtett kilométerekre.":["If you want to know how much extra it costs to make this trip, variable costs matter. If you want the true cost of driving, fixed and annual costs also need to be allocated across the kilometres driven.","Wenn du wissen möchtest, wie viel eine zusätzliche Fahrt kostet, sind die variablen Kosten entscheidend. Wenn du die tatsächlichen Autokosten wissen willst, müssen auch fixe und jährliche Kosten auf die gefahrenen Kilometer umgelegt werden."],
    "Út hossza (km)":["Trip distance (km)","Streckenlänge (km)"],
    "Fogyasztás (l/100 km)":["Fuel consumption (L/100 km)","Verbrauch (l/100 km)"],
    "Üzemanyagár (Ft/l)":["Fuel price (HUF/L)","Kraftstoffpreis (HUF/l)"],
    "Éves nem üzemanyagköltség (Ft)":["Annual non-fuel costs (HUF)","Jährliche Kosten ohne Kraftstoff (HUF)"],
    "Éves futás (km)":["Annual distance driven (km)","Jährliche Fahrleistung (km)"],
    "Csak üzemanyag":["Fuel only","Nur Kraftstoff"],
    "Fix költség ráosztva":["Allocated fixed costs","Umlage der Fixkosten"],
    "Teljes útiköltség":["Total trip cost","Gesamte Fahrtkosten"],
    "Teljes Ft/km":["Total HUF/km","Gesamt HUF/km"],
    "Mire jó ez?":["What is this useful for?","Wozu ist das nützlich?"],
    "Utastársak közti elszámolásnál előre tisztázzátok, csak a plusz útiköltséget osztjátok-e, vagy a teljes autóhasználatból is szeretnétek részt számolni.":["When sharing costs with passengers, agree in advance whether you are splitting only the extra trip cost or also a share of the car's full running costs.","Kläre bei der Kostenaufteilung mit Mitfahrenden vorher, ob ihr nur die zusätzlichen Fahrtkosten oder auch einen Anteil der gesamten Autokosten teilen wollt."],
    "A teljes Ft/km":["Total HUF/km","Gesamt HUF/km"],
    "Bevitel":["Input","Eingabe"],
    "Súgó":["Help","Hilfe"],
    "Forrás: NAV":["Source: NAV","Quelle: NAV"],
    "Számítási mód":["Calculation method","Berechnungsmethode"],
    "Autós út- és hatótáv kalkulátor":["Auto Trip and Range Calculator","Auto-Fahrt- und Reichweitenrechner"],
    "Az eredmény után":["What to do after the result","Was kommt nach dem Ergebnis?"],
    "Az út költségétől lépj tovább a teljes autóköltség felé":["Go from trip costs to the full cost of car ownership","Von den Fahrtkosten zu den gesamten Autokosten"],
    "Az üzemanyag csak egy része az autózás költségének. Érdemes külön megnézni a valós fogyasztást és az éves fenntartási terhet is.":["Fuel is only part of the cost of driving. Check your actual fuel consumption and annual running costs separately, too.","Kraftstoff ist nur ein Teil der Autokosten. Prüfe auch den tatsächlichen Verbrauch und die jährlichen Unterhaltskosten."],
    "Becsüld meg az autó teljes éves fenntartását.":["Estimate your car's total annual running costs.","Schätze die jährlichen Gesamtkosten für dein Auto."],
    "Hirdetés":["Advertisement","Anzeige"],
    "Tankolási adatokból ellenőrizd a tényleges fogyasztást.":["Check actual fuel consumption using refuelling data.","Prüfe den tatsächlichen Verbrauch anhand von Tankdaten."],
    "Valós fogyasztás":["Actual fuel consumption","Tatsächlicher Verbrauch"]
  });
  const supported = Object.freeze(["hu","en","de"]);
  function translate(page, value, language) {
    if (page !== pageKey || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];
    const perKilometre = normalized.match(/^([\d\s.,]+)\s*Ft\/km$/u);
    if (perKilometre) return `${perKilometre[1].trim()} HUF/km`;
    return null;
  }
  const dictionaries = Object.freeze({ [pageKey]: dictionary });
  return { pages: Object.freeze([pageKey]), dictionaries, dictionary, supported, translate };
});

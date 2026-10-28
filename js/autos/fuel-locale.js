/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const document = root.document;
  const main = document.querySelector("main[data-simple-calc]");
  if (!main) return;
  const page = main.dataset.simpleCalc;
  if (!api.pages.includes(page)) return;
  const textState = new WeakMap(), attributeState = new WeakMap(), langState = new WeakMap();
  let language = "hu", rendering = false;
  function renderText(node) {
    const current = node.nodeValue, previous = textState.get(node);
    const source = previous && previous.rendered === current ? previous.source : current;
    const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
    if (!parts || !parts[2]) return;
    const translated = api.translate(page, parts[2], language);
    const result = parts[1] + (translated ?? parts[2]) + parts[3];
    if (result !== current) node.nodeValue = result;
    if (translated !== null || previous) {
      textState.set(node, { source, rendered: result });
      const parent = node.parentElement;
      if (parent && !langState.has(parent)) langState.set(parent, parent.getAttribute("lang"));
      if (parent && translated !== null && language !== "hu") parent.setAttribute("lang", language);
      else if (parent && langState.has(parent)) {
        const old = langState.get(parent);
        if (old === null) parent.removeAttribute("lang"); else parent.setAttribute("lang", old);
      }
    }
  }
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        // Options without a value use their label as a calculation value.
        if (node.parentElement?.tagName === "OPTION" && !node.parentElement.hasAttribute("value")) continue;
        renderText(node);
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach((element) => {
        if (element.closest("[contenteditable],[translate='no']")) return;
        let state = attributeState.get(element);
        if (!state) { state = new Map(); attributeState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) {
          if (!element.hasAttribute(name)) continue;
          const value = element.getAttribute(name), last = state.get(name);
          const source = last && last.rendered === value ? last.source : value;
          const translated = api.translate(page, source, language);
          const result = translated ?? source;
          if (result !== value) element.setAttribute(name, result);
          state.set(name, { source, rendered: result });
        }
      });
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  document.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get() || "hu");
  const observer = new MutationObserver(changes => {
    if (changes.some(change => change.type === "childList" || change.type === "characterData")) render();
  });
  observer.observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const shared = Object.freeze({
    "Kapcsolódó friss hírek": ["Related news", "Passende aktuelle Meldungen"],
    "FRISS HÍREK": ["LATEST NEWS", "AKTUELLE MELDUNGEN"],
    "Autózás és üzemanyag": ["Driving and fuel", "Autofahren und Kraftstoff"],
    "NAV: októberi üzemanyagárak": ["NAV: October fuel prices", "NAV: Kraftstoffpreise im Oktober"],
    "NAV: szeptemberi üzemanyagárak": ["NAV: September fuel prices", "NAV: Kraftstoffpreise im September"],
    "Összes friss hír →": ["All latest news →", "Alle aktuellen Meldungen →"],
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Az értékek legyenek nagyobbak nullánál": ["Values must be greater than zero", "Die Werte müssen größer als null sein"],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": [
      "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.",
      "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren, oder teile sie mit jemandem, für den sie nützlich sein könnte."
    ],
    "Mentési, telepítési és megosztási műveletek": ["Bookmark, install and sharing options", "Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.": [
      "The result is an estimate based on the fuel consumption, price and trip details you enter. Driving conditions, vehicle condition and changing charges may affect the actual amount.",
      "Das Ergebnis ist eine Schätzung anhand deiner Angaben zu Verbrauch, Preis und Strecke. Fahrbedingungen, Fahrzeugzustand und geänderte Gebühren können den tatsächlichen Betrag beeinflussen."
    ],
    "A számítások módszertana és minőségbiztosítása": ["Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.": ["Found an issue? Let us know.", "Einen Fehler gefunden? Sag uns Bescheid."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Utolsó tartalmi frissítés:": ["Last content update:", "Letzte inhaltliche Aktualisierung:"],
    "Hirdetés": ["Advertisement", "Anzeige"],
    "Autó fogyasztás": ["Car fuel consumption", "Kraftstoffverbrauch"],
    "Éves autóköltség": ["Annual car costs", "Jährliche Autokosten"],
    "Üzemanyag költség kalkulátor": ["Fuel cost calculator", "Kraftstoffkosten-Rechner"],
    "Az eredmény után": ["After your result", "Nach deinem Ergebnis"],
    "Az egy útra jutó üzemanyagköltség után hasznos lehet a valós fogyasztás és az éves fenntartási költség ellenőrzése.": [
      "After estimating fuel costs for one trip, it can help to check real-world consumption and annual ownership costs.",
      "Nach der Schätzung der Kraftstoffkosten für eine Fahrt lohnt es sich, den tatsächlichen Verbrauch und die jährlichen Unterhaltskosten zu prüfen."
    ],
    "Külföldi utazáshoz": ["For travel abroad", "Für Auslandsreisen"],
    "Lásd a biztosítás, szerviz és egyéb tételek hatását is.": [
      "See how insurance, servicing and other costs affect the total.",
      "Sieh dir an, wie Versicherung, Wartung und weitere Posten die Gesamtkosten beeinflussen."
    ],
    "Nézd meg a Wise kártyás fizetéshez, pénzváltáshoz és külföldi költéshez kapcsolódó aktuális feltételeit.": [
      "Check Wise's current terms for card payments, currency exchange and spending abroad.",
      "Informiere dich über die aktuellen Bedingungen von Wise für Kartenzahlungen, Währungsumtausch und Ausgaben im Ausland."
    ],
    "Nézd meg, mit jelent az út a teljes autóhasználatban": [
      "See what the trip means for your overall car costs",
      "Sieh dir an, welchen Einfluss die Fahrt auf deine gesamten Autokosten hat"
    ],
    "Partnerlink. Az aktuális díjakat és feltételeket a Wise oldalán ellenőrizd.": [
      "Partner link. Check current fees and terms on Wise's website.",
      "Partnerlink. Prüfe die aktuellen Gebühren und Bedingungen auf der Wise-Website."
    ],
    "Számold ki tankolási adatokból a tényleges fogyasztást.": [
      "Calculate real-world fuel consumption from refuelling data.",
      "Berechne den tatsächlichen Verbrauch anhand deiner Tankdaten."
    ],
    "Utazást tervezel és devizában fizetnél?": [
      "Planning a trip and paying in a foreign currency?",
      "Planst du eine Reise und möchtest in einer Fremdwährung bezahlen?"
    ],
    "Wise utazáshoz →": ["Wise for travel →", "Wise für Reisen →"],
    "Üzemanyagköltség kalkulátor": ["Fuel cost calculator", "Kraftstoffkosten-Rechner"],
    "Autó fogyasztás kalkulátor": ["Car fuel consumption calculator", "Kraftstoffverbrauchsrechner fürs Auto"],
    "Hatótáv kalkulátor": ["Driving range calculator", "Reichweiten-Rechner"],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Autófogyasztás": ["Car fuel consumption", "Kraftstoffverbrauch"],
    "Tankolás": ["Refuelling", "Tanken"],
    "Üzemanyagköltség": ["Fuel costs", "Kraftstoffkosten"],
    "Éves autóköltség kalkulátor": ["Annual car cost calculator", "Jährliche Autokosten"],
    "Kilométerdíj kalkulátor": ["Cost per kilometre calculator", "Kilometerkosten-Rechner"],
    "Autópályadíj kalkulátor": ["Motorway toll calculator", "Autobahnmaut-Rechner"],
    "Utazási idő kalkulátor": ["Travel time calculator", "Fahrzeit-Rechner"],
    "Kapcsolódó friss adat": ["Related current data", "Passende aktuelle Daten"],
    "Friss KSH-üzemanyagár összefoglaló: 2026. augusztus": ["Latest KSH fuel price summary: August 2026", "Aktuelle KSH-Übersicht der Kraftstoffpreise: August 2026"],
    "– hivatalos forrásból feldolgozott aktuális adat és gyakorlati értelmezés.": ["– current data from an official source, with practical context.", "– aktuelle Daten aus offizieller Quelle mit praktischer Einordnung."],
    "A kalkulátorok az aktuális szabályok és körülmények mellett adnak tájékoztató becslést.": ["The calculators provide an informational estimate based on current rules and conditions.", "Die Rechner liefern eine unverbindliche Schätzung auf Grundlage der aktuellen Regeln und Bedingungen."]
  });
  const consumption = Object.freeze({
    "Átlagfogyasztás és autó fogyasztás kalkulátor": ["Average car fuel consumption calculator", "Rechner für den durchschnittlichen Kraftstoffverbrauch"],
    "Számold ki a valós átlagfogyasztást tankolt üzemanyag és megtett kilométer alapján.": ["Calculate real-world average fuel consumption from the fuel added and distance travelled.", "Berechne den tatsächlichen Durchschnittsverbrauch anhand der getankten Kraftstoffmenge und der gefahrenen Strecke."],
    "Tankolt mennyiség (l)": ["Fuel added (L)", "Getankte Menge (l)"],
    "Megtett távolság (km)": ["Distance travelled (km)", "Gefahrene Strecke (km)"],
    "Átlagfogyasztás": ["Average fuel consumption", "Durchschnittsverbrauch"],
    "1330 km": ["1330 km", "1330 km"],
    "87 l": ["87 l", "87 l"],
    "6,54 l/100 km": ["6,54 l/100 km", "6,54 l/100 km"],
    "Valós fogyasztás számítása tankolás alapján": ["Calculate real-world fuel consumption from refuelling", "Tatsächlichen Verbrauch anhand des Tankvorgangs berechnen"],
    "Az autó fogyasztás kalkulátor akkor hasznos, ha nem a fedélzeti komputer becslésére, hanem tankolásból számolt értékre vagy kíváncsi. Így pontosabb képet kaphatsz arról, mennyit fogyaszt az autó a saját használatod mellett.": [
      "This calculator is useful when you want to measure fuel use from refuelling rather than rely on the car's onboard estimate. It gives you a clearer picture of your car's consumption in your own driving conditions.",
      "Dieser Rechner ist hilfreich, wenn du den Verbrauch anhand von Tankvorgängen statt über die Schätzung des Bordcomputers ermitteln möchtest. So erhältst du ein genaueres Bild für deine eigene Fahrweise."
    ],
    "A valós fogyasztás segít költséget tervezni, műszaki változást észrevenni, vagy összehasonlítani a városi, országúti és autópályás használatot.": [
      "Real-world consumption can help you plan costs, spot a mechanical change or compare city, rural-road and motorway driving.",
      "Der tatsächliche Verbrauch hilft bei der Kostenplanung, beim Erkennen technischer Veränderungen und beim Vergleich von Stadt-, Landstraßen- und Autobahnfahrten."
    ],
    "Átlagfogyasztás kiszámítása: képlet és gyors példák": ["Average fuel consumption: formula and quick examples", "Durchschnittsverbrauch: Formel und Beispiele"],
    "Az autó átlagfogyasztásának kiszámításához két adat kell: a tankolt üzemanyag literben és az ugyanazzal az üzemanyaggal megtett távolság kilométerben. Az üzemanyag-fogyasztás kalkulátor ugyanezt a számítást végzi el automatikusan.": [
      "To calculate average fuel consumption, you need two figures: the fuel added in litres and the distance travelled on it in kilometres. This calculator performs the same calculation for you.",
      "Für die Berechnung des Durchschnittsverbrauchs brauchst du zwei Angaben: die getankte Kraftstoffmenge in Litern und die damit gefahrene Strecke in Kilometern. Der Rechner übernimmt die Berechnung automatisch."
    ],
    "Átlagfogyasztás = tankolt liter ÷ megtett kilométer × 100.": ["Average consumption = litres added ÷ kilometres travelled × 100.", "Durchschnittsverbrauch = getankte Liter ÷ gefahrene Kilometer × 100."],
    "A pontosabb méréshez nullázd a napi kilométer-számlálót, majd lehetőleg tele tanktól tele tankig mérj.": ["For a more accurate reading, reset the trip odometer and measure from a full tank to the next full tank where possible.", "Für eine genauere Messung setze den Tageskilometerzähler zurück und miss möglichst von einer vollen Tankfüllung bis zur nächsten."],
    "Gyors példák": ["Quick examples", "Kurze Beispiele"],
    "35 liter és 500 km esetén 7,00 l/100 km; 42 liter és 650 km esetén 6,46 l/100 km; 50 liter és 800 km esetén 6,25 l/100 km az átlagfogyasztás.": ["With 35 litres over 500 km, consumption is 7.00 L/100 km; with 42 litres over 650 km, 6.46 L/100 km; and with 50 litres over 800 km, 6.25 L/100 km.", "Bei 35 Litern auf 500 km beträgt der Verbrauch 7,00 l/100 km; bei 42 Litern auf 650 km 6,46 l/100 km; und bei 50 Litern auf 800 km 6,25 l/100 km."],
    "Mikor hasznos?": ["When is it useful?", "Wann ist es hilfreich?"],
    "valós fogyasztás ellenőrzésénél": ["checking real-world consumption", "beim Prüfen des tatsächlichen Verbrauchs"],
    "autóvásárlás utáni megfigyelésnél": ["monitoring a car after purchase", "beim Beobachten des Verbrauchs nach dem Autokauf"],
    "szervizprobléma gyanújánál": ["when you suspect a maintenance issue", "bei Verdacht auf ein technisches Problem"],
    "üzemanyagköltség tervezésekor": ["planning fuel costs", "bei der Planung der Kraftstoffkosten"],
    "Fontos tudni:": ["Good to know:", "Gut zu wissen:"],
    "Egyetlen tankolásból ne vonj le végleges következtetést. Több, lehetőleg 3–5 tankolás átlaga megbízhatóbb képet ad.": ["Don't draw a firm conclusion from a single fill-up. The average across several, ideally 3–5, fill-ups gives a more reliable picture.", "Ziehe aus einer einzelnen Tankfüllung keine endgültigen Schlüsse. Der Durchschnitt aus mehreren, möglichst 3 bis 5 Tankvorgängen ist aussagekräftiger."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Miért más, mint a fedélzeti komputer?": ["Why is it different from the onboard computer?", "Warum weicht der Wert vom Bordcomputer ab?"],
    "A fedélzeti komputer becslést ad, a tankolás alapú mérés közvetlenebb, bár itt is lehet kisebb eltérés.": ["The onboard computer provides an estimate. Measuring from fill-ups is more direct, though small differences are still possible.", "Der Bordcomputer liefert eine Schätzung. Die Messung anhand von Tankvorgängen ist direkter, kann aber ebenfalls leicht abweichen."],
    "Tele tank kell hozzá?": ["Do I need to fill the tank completely?", "Muss ich den Tank ganz füllen?"],
    "A legjobb tele tanktól tele tankig mérni.": ["For the best result, measure from one full tank to the next.", "Am genauesten misst du von einer vollen Tankfüllung bis zur nächsten."],
    "Mit jelent a liter/100 km?": ["What does litres per 100 km mean?", "Was bedeutet Liter pro 100 km?"],
    "Azt mutatja meg, hogy az autó átlagosan hány liter üzemanyagot használ 100 kilométer megtételéhez.": ["It shows how many litres of fuel the car uses on average to travel 100 kilometres.", "Die Angabe zeigt, wie viele Liter Kraftstoff das Auto durchschnittlich auf 100 Kilometern verbraucht."],
    "Mennyi mérésből érdemes átlagolni?": ["How many readings should I average?", "Wie viele Messungen sollte ich mitteln?"],
    "Legalább 3–5 tankolás jobb képet adhat, mint egyetlen mérés.": ["At least 3–5 fill-ups can give a clearer picture than a single reading.", "Mindestens 3 bis 5 Tankvorgänge ergeben ein aussagekräftigeres Bild als eine einzelne Messung."],
    "Mi növelheti a fogyasztást?": ["What can increase fuel consumption?", "Was kann den Kraftstoffverbrauch erhöhen?"],
    "Gyors tempó, hideg motor, rövid utak, klíma, tetőcsomagtartó, alacsony guminyomás és nagy terhelés.": ["High speeds, a cold engine, short trips, air conditioning, a roof rack, low tyre pressure and heavy loads.", "Hohe Geschwindigkeit, ein kalter Motor, kurze Fahrten, Klimaanlage, Dachträger, niedriger Reifendruck und hohe Beladung."],
    "Hogyan számolom ki az autó átlagfogyasztását?": ["How do I calculate my car's average fuel consumption?", "Wie berechne ich den Durchschnittsverbrauch meines Autos?"],
    "Oszd el a tankolt litert a megtett kilométerrel, majd szorozd meg százzal. Például 42 liter és 650 km esetén 6,46 l/100 km az átlagfogyasztás.": ["Divide the litres added by the kilometres travelled, then multiply by 100. For example, 42 litres over 650 km gives 6.46 L/100 km.", "Teile die getankten Liter durch die gefahrenen Kilometer und multipliziere das Ergebnis mit 100. Beispiel: 42 Liter auf 650 km ergeben 6,46 l/100 km."],
    "Mennyi üzemanyagot fogyaszt az autó 100 km-en?": ["How much fuel does the car use per 100 km?", "Wie viel Kraftstoff verbraucht das Auto auf 100 km?"],
    "A l/100 km eredmény közvetlenül ezt mutatja meg. Például 6,5 l/100 km azt jelenti, hogy az autó átlagosan 6,5 liter üzemanyagot használ 100 kilométeren.": ["The L/100 km result shows this directly. For example, 6.5 L/100 km means the car uses an average of 6.5 litres of fuel per 100 kilometres.", "Das Ergebnis in l/100 km zeigt den Wert direkt. 6,5 l/100 km bedeuten zum Beispiel, dass das Auto durchschnittlich 6,5 Liter Kraftstoff auf 100 Kilometer verbraucht."],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Zuverlässigkeit und Grenzen der Berechnung"],
    "Több tankolásos átlag": ["Average across multiple fill-ups", "Durchschnitt aus mehreren Tankvorgängen"],
    "A fogyasztási átlagot ne a százalékok átlagából számold": ["Don't calculate average fuel consumption by averaging percentages", "Berechne den Durchschnittsverbrauch nicht über den Mittelwert einzelner Prozentangaben"],
    "Különböző hosszúságú etapoknál a helyes összesített fogyasztás az összes elhasznált liter és az összes megtett kilométer arányából jön ki.": ["For trips of different lengths, the correct combined consumption comes from total litres used divided by total kilometres travelled.", "Bei unterschiedlich langen Strecken ergibt sich der korrekte Gesamtverbrauch aus den insgesamt verbrauchten Litern geteilt durch die insgesamt gefahrenen Kilometer."],
    "1. etap km": ["Leg 1 distance (km)", "Strecke 1 (km)"], "1. etap liter": ["Leg 1 fuel (L)", "Strecke 1 Kraftstoff (l)"],
    "2. etap km": ["Leg 2 distance (km)", "Strecke 2 (km)"], "2. etap liter": ["Leg 2 fuel (L)", "Strecke 2 Kraftstoff (l)"],
    "3. etap km": ["Leg 3 distance (km)", "Strecke 3 (km)"], "3. etap liter": ["Leg 3 fuel (L)", "Strecke 3 Kraftstoff (l)"],
    "Összes út": ["Total distance", "Gesamtstrecke"], "Összes üzemanyag": ["Total fuel", "Gesamter Kraftstoff"],
    "Súlyozott átlagfogyasztás": ["Weighted average fuel consumption", "Gewichteter Durchschnittsverbrauch"],
    "Miért jobb?": ["Why is this better?", "Warum ist das besser?"],
    "A hosszabb etap automatikusan nagyobb súlyt kap. Így egy rövid, városi tankolás nem torzítja ugyanannyira az átlagot, mint egy több száz kilométeres szakasz.": ["Longer legs automatically carry more weight. A short city fill-up therefore has less influence than a journey of several hundred kilometres.", "Längere Streckenabschnitte werden automatisch stärker gewichtet. So beeinflusst eine kurze Tankfüllung im Stadtverkehr den Durchschnitt weniger als eine Fahrt über mehrere hundert Kilometer."]
  });
  const fuelCost = Object.freeze({
    "Üzemanyagköltség kalkulátor": ["Fuel cost calculator", "Kraftstoffkosten-Rechner"],
    "Számold ki egy út várható benzinköltségét vagy dízelköltségét távolság, fogyasztás és literár alapján.": ["Estimate the petrol or diesel cost of a trip from its distance, fuel consumption and price per litre.", "Schätze die Benzin- oder Dieselkosten einer Fahrt anhand von Strecke, Verbrauch und Literpreis."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "17 127 Ft": ["17 127 Ft", "17 127 Ft"],
    "20 150 Ft": ["20 150 Ft", "20 150 Ft"],
    "23 173 Ft": ["23 173 Ft", "23 173 Ft"],
    "6045 Ft": ["6045 Ft", "6045 Ft"],
    "2026. szeptember 16.": ["September 16, 2026", "16. September 2026"],
    "Útiköltség- és érzékenységkalkulátor": ["Trip cost and sensitivity calculator", "Fahrtkosten- und Sensitivitätsrechner"],
    "A mezők tájékoztató tervezésre valók; hivatalos, gyártói vagy szolgáltatói adat esetén mindig azt használd.": ["These fields are for planning estimates. Use official, manufacturer or service-provider figures when available.", "Die Felder dienen der unverbindlichen Planung. Wenn offizielle Angaben oder Werte des Herstellers beziehungsweise Anbieters vorliegen, verwende diese."],
    "Távolság (km)": ["Distance (km)", "Strecke (km)"], "Fogyasztás (l/100 km)": ["Fuel consumption (L/100 km)", "Verbrauch (l/100 km)"],
    "Üzemanyagár (Ft/l)": ["Fuel price (HUF/L)", "Kraftstoffpreis (HUF/l)"], "Útdíj és parkolás": ["Tolls and parking", "Maut und Parken"],
    "Utasok száma": ["Number of passengers", "Anzahl der Mitfahrenden"], "Árváltozás teszt (%)": ["Price change scenario (%)", "Preisszenario (%)"],
    "-100% esetén a tesztelt üzemanyagár 0 Ft/l; ennél kisebb érték nem értelmezhető.": ["At -100%, the scenario fuel price is HUF 0/L; lower values are not meaningful.", "Bei -100 % beträgt der Kraftstoffpreis im Szenario 0 HUF/l; niedrigere Werte sind nicht sinnvoll."],
    "Számítás": ["Calculate", "Berechnen"], "Ellenőrizd a kötelező mezőket és az értékhatárokat.": ["Check the required fields and value limits.", "Prüfe die Pflichtfelder und Wertebereiche."],
    "Üzemanyagköltség számítás utazás előtt": ["Estimate fuel costs before you travel", "Kraftstoffkosten vor der Fahrt berechnen"],
    "Az üzemanyagköltség kalkulátor segít megbecsülni, mennyibe kerülhet egy autós út. Hasznos családi utazás, munkába járás, telekocsi, nyaralás vagy céges út előzetes tervezésekor.": ["This calculator estimates what a car trip may cost in fuel. It can help you plan a family trip, commute, carpool, holiday or business journey.", "Dieser Rechner schätzt die Kraftstoffkosten einer Autofahrt. Er hilft bei der Planung von Familienausflügen, Arbeitswegen, Fahrgemeinschaften, Urlauben oder Dienstfahrten."],
    "A tankolás nem az autózás egyetlen költsége, de rövid távú útitervezésnél ez a leggyorsabban kiszámítható tétel. Az eredményhez külön hozzáadható az autópályadíj, parkolás vagy komp költsége.": ["Fuel is not the only cost of driving, but it is one of the quickest to estimate for a trip. You can add motorway tolls, parking or ferry charges separately.", "Kraftstoff ist nicht der einzige Kostenfaktor beim Autofahren, lässt sich bei der Fahrtplanung aber schnell berechnen. Maut, Park- oder Fährgebühren kannst du zusätzlich angeben."],
    "Hogyan működik a számítás?": ["How does the calculation work?", "Wie funktioniert die Berechnung?"],
    "A képlet: távolság ÷ 100 × átlagfogyasztás × üzemanyagár. A szükséges üzemanyag mennyisége a távolság és a liter/100 km fogyasztás alapján adódik.": ["Formula: distance ÷ 100 × average fuel consumption × fuel price. The distance and consumption in litres per 100 km determine the amount of fuel needed.", "Formel: Strecke ÷ 100 × Durchschnittsverbrauch × Kraftstoffpreis. Aus Strecke und Verbrauch in Litern pro 100 km ergibt sich die benötigte Kraftstoffmenge."],
    "Konkrét példaszámítás": ["Worked example", "Konkretes Rechenbeispiel"],
    "Egy 240 km-es útnál, 6,5 liter/100 km fogyasztással és 640 Ft/liter üzemanyagárral a becsült fogyasztás 15,6 liter, a költség pedig körülbelül 9 984 Ft. Oda-vissza 480 km-rel érdemes számolni.": ["For a 240 km trip at 6.5 L/100 km and HUF 640 per litre, estimated fuel use is 15.6 litres and the cost is about HUF 9,984. For a return trip, use 480 km.", "Bei 240 km Strecke, 6,5 l/100 km Verbrauch und 640 HUF pro Liter werden schätzungsweise 15,6 Liter benötigt. Die Kosten betragen etwa 9.984 HUF. Für Hin- und Rückfahrt solltest du 480 km ansetzen."],
    "Mikor hasznos?": ["When is it useful?", "Wann ist es hilfreich?"],
    "nyaralás vagy hétvégi út előtt": ["before a holiday or weekend trip", "vor dem Urlaub oder einem Wochenendausflug"],
    "telekocsi-költség megosztásánál": ["splitting carpool costs", "beim Aufteilen der Kosten einer Fahrgemeinschaft"],
    "munkába járás havi költségének becslésénél": ["estimating monthly commuting costs", "bei der Schätzung der monatlichen Pendelkosten"],
    "két autó fogyasztásának összehasonlításakor": ["comparing the fuel consumption of two cars", "beim Vergleich des Verbrauchs zweier Autos"],
    "Fontos tudni:": ["Good to know:", "Gut zu wissen:"],
    "A valós fogyasztást a forgalom, sebesség, klíma, terhelés, guminyomás és vezetési stílus is befolyásolja.": ["Real-world consumption is also affected by traffic, speed, air conditioning, load, tyre pressure and driving style.", "Der tatsächliche Verbrauch hängt auch von Verkehr, Geschwindigkeit, Klimaanlage, Beladung, Reifendruck und Fahrstil ab."],
    "Miért térhet el a valós költség?": ["Why might the actual cost differ?", "Warum können die tatsächlichen Kosten abweichen?"],
    "Mert az átlagfogyasztás és az üzemanyagár változhat, az útviszonyok pedig módosítják a fogyasztást.": ["Average consumption and fuel prices can change, and road conditions can affect consumption.", "Durchschnittsverbrauch und Kraftstoffpreise können sich ändern; auch die Straßenverhältnisse beeinflussen den Verbrauch."],
    "Autópályára is használható?": ["Can I use it for motorway trips?", "Kann ich den Rechner für Autobahnfahrten nutzen?"],
    "Igen, de az autópályadíjat külön kell hozzáadni.": ["Yes, but add the motorway toll separately.", "Ja, aber die Autobahnmaut musst du separat hinzufügen."],
    "Oda-vissza útra hogyan számoljak?": ["How should I calculate a return trip?", "Wie berechne ich eine Hin- und Rückfahrt?"],
    "Duplázd meg a távolságot, vagy az egyirányú eredményt.": ["Double the distance or the one-way result.", "Verdopple die Strecke oder das Ergebnis für eine Richtung."],
    "Telekocsinál mire figyeljek?": ["What should I consider when carpooling?", "Was sollte ich bei einer Fahrgemeinschaft beachten?"],
    "Az üzemanyag mellett autópályadíj, parkolás és más közös költség is megosztható.": ["In addition to fuel, you can split motorway tolls, parking and other shared costs.", "Neben den Kraftstoffkosten lassen sich auch Maut, Parkgebühren und andere gemeinsame Kosten aufteilen."],
    "Elektromos autóra használható?": ["Can I use it for an electric car?", "Kann ich den Rechner für ein Elektroauto verwenden?"],
    "Nem közvetlenül; ahhoz kWh/100 km fogyasztás és áramár alapján működő számítás szükséges.": ["Not directly. That requires a calculation based on kWh/100 km consumption and the electricity price.", "Nicht direkt. Dafür ist eine Berechnung anhand des Verbrauchs in kWh/100 km und des Strompreises nötig."],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Zuverlässigkeit und Grenzen der Berechnung"],
    "Fogyasztási bizonytalanság": ["Fuel consumption uncertainty", "Unsicherheit beim Kraftstoffverbrauch"],
    "Mennyit változik az út ára, ha a valós fogyasztás eltér a tervtől?": ["How does the trip cost change if actual consumption differs from your plan?", "Wie ändern sich die Fahrtkosten, wenn der tatsächliche Verbrauch von der Planung abweicht?"],
    "Autópálya, város, tetőbox, klíma, terhelés és forgalom miatt a tényleges fogyasztás eltérhet a megszokott átlagtól. Itt egy alsó–közép–felső forgatókönyvet látsz ugyanarra az útra.": ["Motorways, city driving, a roof box, air conditioning, load and traffic can make actual consumption differ from your usual average. Compare low, mid and high scenarios for the same trip here.", "Autobahn, Stadtverkehr, Dachbox, Klimaanlage, Beladung und Verkehr können dazu führen, dass der tatsächliche Verbrauch von deinem Durchschnitt abweicht. Hier siehst du niedrige, mittlere und hohe Szenarien für dieselbe Fahrt."],
    "Tervezett fogyasztás": ["Planned consumption", "Geplanter Verbrauch"], "Eltérés ± (%)": ["Variation ± (%)", "Abweichung ± (%)"],
    "Kedvező forgatókönyv": ["Low-cost scenario", "Günstiges Szenario"], "Alapforgatókönyv": ["Base scenario", "Basisszenario"],
    "Kedvezőtlen forgatókönyv": ["High-cost scenario", "Ungünstiges Szenario"], "Sáv szélessége": ["Scenario range", "Spannweite der Szenarien"],
    "Miből áll össze az út üzemanyagköltsége?": ["How are trip fuel costs calculated?", "Wie setzen sich die Kraftstoffkosten der Fahrt zusammen?"],
    "A távolság és a l/100 km fogyasztás alapján kiszámolja a szükséges üzemanyagmennyiséget, majd ezt megszorozza a megadott literárral. Az eredmény ezért közvetlenül a saját út-, fogyasztás- és áradataidra reagál, nem országos átlagból becsül.": ["It calculates the fuel needed from the distance and consumption in L/100 km, then multiplies it by the price per litre you entered. The result reflects your trip, consumption and price rather than a national average.", "Der Rechner ermittelt anhand der Strecke und des Verbrauchs in l/100 km die benötigte Kraftstoffmenge und multipliziert sie mit deinem Literpreis. Das Ergebnis basiert also auf deinen Angaben und nicht auf einem landesweiten Durchschnitt."],
    "Ellenőrzési alap:": ["How to verify:", "Prüfgrundlage:"],
    "A tényleges fogyasztást befolyásolja a forgalom, hőmérséklet, terhelés és vezetési mód. Aktuális költséghez a tényleges tankolási árat, elszámolási célra pedig az adott szabály szerint alkalmazható hivatalos értéket használd.": ["Actual consumption is affected by traffic, temperature, load and driving style. For current costs, use the price you actually pay at the pump; for reimbursements, use the official rate allowed by the applicable rules.", "Der tatsächliche Verbrauch wird von Verkehr, Temperatur, Beladung und Fahrweise beeinflusst. Verwende für aktuelle Kosten den tatsächlich gezahlten Tankstellenpreis und für Abrechnungen den nach den geltenden Regeln zulässigen offiziellen Wert."],
    "Utolsó módszertani ellenőrzés:": ["Last methodology review:", "Letzte methodische Prüfung:"],
    "Miből áll össze az útiköltség?": ["What makes up the trip cost?", "Wie setzen sich die Fahrtkosten zusammen?"],
    "A távolság és fogyasztás alapján számolt üzemanyagköltséghez hozzáadhatod az útdíjat és a parkolást is.": ["You can add tolls and parking to the fuel cost calculated from distance and consumption.", "Zu den anhand von Strecke und Verbrauch berechneten Kraftstoffkosten kannst du Maut und Parkgebühren hinzufügen."],
    "Egy főre jutó költség": ["Cost per person", "Kosten pro Person"],
    "Árváltozási forgatókönyv": ["Fuel price scenario", "Kraftstoffpreisszenario"],
    "A tesztelt ár nem előrejelzés, csak egy feltételezett változás hatását mutatja.": ["The scenario price is not a forecast; it only shows the effect of an assumed price change.", "Der Szenariopreis ist keine Prognose, sondern zeigt nur die Wirkung einer angenommenen Preisänderung."]
  });
  const range = Object.freeze({
    "Hatótáv kalkulátor": ["Driving range calculator", "Reichweiten-Rechner"],
    "Becsüld meg, hány kilométert tehetsz meg a tankban lévő üzemanyaggal.": ["Estimate how many kilometres you can travel with the fuel in your tank.", "Schätze, wie viele Kilometer du mit dem Kraftstoff im Tank fahren kannst."],
    "Üzemanyag a tankban (l)": ["Fuel in tank (L)", "Kraftstoff im Tank (l)"],
    "Fogyasztás (l/100 km)": ["Fuel consumption (L/100 km)", "Verbrauch (l/100 km)"],
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Az értékek legyenek nagyobbak nullánál": ["Enter values greater than zero", "Gib Werte größer als null ein"],
    "Elméleti hatótáv üzemanyagból és fogyasztásból": ["Theoretical range based on fuel and consumption", "Theoretische Reichweite anhand von Kraftstoffmenge und Verbrauch"],
    "A kalkulátor azt becsüli meg, hány kilométer tehető meg a megadott üzemanyag-mennyiséggel és átlagfogyasztással. Útvonaltervezéshez, tankolási döntéshez vagy több jármű fogyasztásának összehasonlításához ad gyors támpontot.": [
      "This calculator estimates how many kilometres you can travel with the fuel amount and average consumption you enter. It can help with route planning, deciding when to refuel or comparing the consumption of different vehicles.",
      "Dieser Rechner schätzt, wie viele Kilometer du mit der angegebenen Kraftstoffmenge und dem Durchschnittsverbrauch fahren kannst. Er bietet eine schnelle Orientierung für die Routenplanung, die Entscheidung zum Tanken oder den Vergleich verschiedener Fahrzeuge."
    ],
    "Az eredmény elméleti érték. Nem azt jelenti, hogy biztonságosan ennyit kell autóznod tankolás nélkül. A tényleges hatótávot a forgalom, útvonal, időjárás, terhelés, guminyomás, klímahasználat és vezetési stílus is befolyásolja.": [
      "The result is theoretical. It does not mean you should safely drive this far without refuelling. Actual range also depends on traffic, route, weather, load, tyre pressure, air-conditioning use and driving style.",
      "Das Ergebnis ist ein theoretischer Wert. Es bedeutet nicht, dass du diese Strecke sicher ohne Tanken fahren solltest. Die tatsächliche Reichweite hängt auch von Verkehr, Strecke, Wetter, Beladung, Reifendruck, Klimaanlage und Fahrstil ab."
    ],
    "A képlet": ["Formula", "Formel"],
    "Hatótáv = üzemanyag liter / fogyasztás liter/100 km × 100.": ["Range = fuel in litres ÷ consumption in litres per 100 km × 100.", "Reichweite = Kraftstoff in Litern ÷ Verbrauch in Litern pro 100 km × 100."],
    "Példa": ["Example", "Beispiel"],
    "32 liter üzemanyag és 6,4 l/100 km fogyasztás mellett az elméleti hatótáv 500 km. Ha 10% biztonsági tartalékot hagysz, tervezéshez inkább körülbelül 450 km-rel érdemes számolni.": [
      "With 32 litres of fuel and consumption of 6.4 L/100 km, the theoretical range is 500 km. If you keep a 10% safety reserve, plan for about 450 km instead.",
      "Bei 32 Litern Kraftstoff und einem Verbrauch von 6,4 l/100 km beträgt die theoretische Reichweite 500 km. Mit einer Sicherheitsreserve von 10 % solltest du eher mit rund 450 km planen."
    ],
    "Miért térhet el a valós hatótáv?": ["Why can actual range differ?", "Warum kann die tatsächliche Reichweite abweichen?"],
    "városi araszolás és sok hidegindítás növelheti a fogyasztást;": ["Stop-and-go city traffic and frequent cold starts can increase consumption;", "Stop-and-go-Verkehr in der Stadt und häufige Kaltstarts können den Verbrauch erhöhen;"],
    "autópályán a nagyobb sebesség emelheti a légellenállást;": ["Higher motorway speeds can increase aerodynamic drag;", "Höhere Geschwindigkeiten auf der Autobahn können den Luftwiderstand erhöhen;"],
    "téli idő, rövid utak és fűtés növelheti az energiaigényt;": ["Cold weather, short trips and heating can increase energy use;", "Kälte, kurze Fahrten und Heizung können den Energiebedarf erhöhen;"],
    "tetőbox, utánfutó vagy nagy terhelés rontja a fogyasztást;": ["A roof box, trailer or heavy load can worsen fuel consumption;", "Dachbox, Anhänger oder hohe Beladung können den Verbrauch erhöhen;"],
    "alacsony guminyomás szintén kedvezőtlen lehet.": ["Low tyre pressure can also have a negative effect.", "Auch ein zu niedriger Reifendruck kann sich negativ auswirken."],
    "Milyen fogyasztási adatot érdemes megadni?": ["Which consumption figure should I enter?", "Welchen Verbrauchswert sollte ich eingeben?"],
    "A legjobb kiindulás több tankolásból számolt valós átlag, különösen akkor, ha az út jellege hasonló a következő utazáshoz. A fedélzeti számítógép hasznos, de nem feltétlenül teljesen pontos. Pillanatnyi fogyasztásból hosszú távú hatótávot becsülni félrevezető lehet.": [
      "A real-world average based on several fill-ups is the best starting point, especially if the next trip is similar. The onboard computer can help, but may not be fully accurate. Using instantaneous consumption to estimate long-distance range can be misleading.",
      "Ein tatsächlicher Durchschnitt aus mehreren Tankvorgängen ist der beste Ausgangspunkt, besonders wenn die nächste Fahrt ähnlich ist. Der Bordcomputer kann hilfreich sein, ist aber nicht unbedingt ganz genau. Aus dem Momentanverbrauch die Reichweite für eine lange Strecke abzuleiten, kann irreführend sein."
    ],
    "Névleges tankméret és tényleges üzemanyag": ["Tank capacity and fuel actually available", "Tankvolumen und tatsächlich verfügbarer Kraftstoff"],
    "A gyári tankkapacitás nem ugyanaz, mint az aktuálisan rendelkezésre álló üzemanyag. Ha a tartály 45 literes, de nincs tele, a kalkulátorban ne a 45 litert add meg. A szintjelző maga is becslés, ezért a maradék mennyiség bizonytalansága nőhet alacsony üzemanyagszintnél.": [
      "The manufacturer's tank capacity is not the same as the fuel currently available. If the tank holds 45 litres but is not full, do not enter 45 litres in the calculator. The fuel gauge is also an estimate, so the remaining amount may be less certain when the level is low.",
      "Das vom Hersteller angegebene Tankvolumen entspricht nicht der aktuell verfügbaren Kraftstoffmenge. Wenn der Tank 45 Liter fasst, aber nicht voll ist, gib im Rechner nicht 45 Liter ein. Auch die Tankanzeige ist nur ein Schätzwert; bei niedrigem Füllstand ist die Restmenge daher unsicherer."
    ],
    "Miért érdemes tartalékot hagyni?": ["Why should I keep a reserve?", "Warum sollte ich eine Reserve einplanen?"],
    "Az elméleti nulla közelében már egy kisebb fogyasztási eltérés is problémát okozhat. Hosszabb úton, ritka benzinkutaknál vagy ismeretlen útvonalon különösen érdemes korábban tankolni.": [
      "Near the theoretical limit, even a small change in consumption can cause problems. Refuelling earlier is especially sensible on long trips, where fuel stations are sparse or the route is unfamiliar.",
      "Nahe der theoretischen Grenze kann bereits eine geringe Verbrauchsänderung zum Problem werden. Auf langen Strecken, bei wenigen Tankstellen oder auf unbekannten Routen solltest du besonders frühzeitig tanken."
    ],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "A tank névleges űrtartalmát adják meg a tényleges mennyiség helyett.": ["Entering the tank's rated capacity instead of the amount of fuel actually available.", "Das angegebene Tankvolumen statt der tatsächlich verfügbaren Kraftstoffmenge einzugeben."],
    "Pillanatnyi fogyasztást használnak hosszú távú átlagként.": ["Using instantaneous consumption as a long-term average.", "Den Momentanverbrauch als langfristigen Durchschnitt zu verwenden."],
    "Nem hagynak biztonsági tartalékot.": ["Not keeping a safety reserve.", "Keine Sicherheitsreserve einzuplanen."],
    "Liter/100 km helyett km/l értéket írnak be.": ["Entering km/L instead of L/100 km.", "km/l statt l/100 km einzugeben."],
    "A fedélzeti kijelző értékét abszolút pontosnak tekintik.": ["Treating the onboard display as completely accurate.", "Die Anzeige des Bordcomputers für absolut genau zu halten."],
    "Miért mutat mást az autó?": ["Why does my car show a different figure?", "Warum zeigt mein Auto einen anderen Wert an?"],
    "A fedélzeti rendszer saját fogyasztási és üzemanyagszint-adatokból számol, amelyek eltérhetnek a kézzel megadott értékektől.": ["The onboard system calculates using its own consumption and fuel-level data, which may differ from the values you enter manually.", "Das Bordcomputer-System rechnet mit eigenen Verbrauchs- und Tankstandsdaten, die von den manuell eingegebenen Werten abweichen können."],
    "A tartalék lámpa után használható?": ["Can I use it after the low-fuel warning comes on?", "Kann ich nach Aufleuchten der Reserveleuchte noch fahren?"],
    "Számolni lehet, de ilyenkor a maradék mennyiség bizonytalanabb. Tankolj mielőbb.": ["You can calculate it, but the remaining amount is less certain. Refuel as soon as possible.", "Eine Berechnung ist möglich, aber die verbleibende Menge ist dann unsicherer. Tanke möglichst bald."],
    "Oda-vissza útra hogyan tervezzek?": ["How should I plan a round trip?", "Wie plane ich eine Hin- und Rückfahrt?"],
    "Add össze a teljes távot, és hasonlítsd a biztonsági tartalékkal csökkentett hatótávhoz.": ["Add the outbound and return distances, then compare the total with the range after subtracting your safety reserve.", "Addiere Hin- und Rückweg und vergleiche die Gesamtstrecke mit der Reichweite abzüglich deiner Sicherheitsreserve."],
    "Elektromos autóra használható?": ["Can I use it for an electric car?", "Kann ich den Rechner für ein Elektroauto verwenden?"],
    "Nem közvetlenül. Ott akkukapacitás és kWh/100 km fogyasztás alapján kell számolni.": ["Not directly. For an electric car, calculate using battery capacity and consumption in kWh/100 km.", "Nicht direkt. Bei einem Elektroauto solltest du anhand der Batteriekapazität und des Verbrauchs in kWh/100 km rechnen."],
    "Miért nőhet meg télen a fogyasztás?": ["Why can consumption increase in winter?", "Warum kann der Verbrauch im Winter steigen?"],
    "Hideg motor, rövid utak, sűrűbb levegő, téli gumi és egyéb körülmények is növelhetik az energiafelhasználást.": ["A cold engine, short trips, denser air, winter tyres and other conditions can increase energy use.", "Ein kalter Motor, kurze Fahrten, dichtere Luft, Winterreifen und weitere Faktoren können den Energieverbrauch erhöhen."],
    "Hatótáv-tartalék": ["Range reserve", "Reichweitenreserve"],
    "A matematikai maximum nem célállomás": ["The mathematical maximum is not a destination", "Das mathematische Maximum ist kein Ziel"],
    "A kijelzett vagy számolt hatótáv optimális becslés. Tervezéshez érdemes külön tartalékot hagyni forgalomra, kerülőre, hidegre vagy váratlan fogyasztásnövekedésre.": [
      "The displayed or calculated range is an optimistic estimate. When planning, keep a reserve for traffic, detours, cold weather or an unexpected increase in consumption.",
      "Die angezeigte oder berechnete Reichweite ist eine optimistische Schätzung. Plane eine Reserve für Verkehr, Umwege, Kälte oder einen unerwarteten Mehrverbrauch ein."
    ],
    "Felhasználható üzemanyag (l)": ["Usable fuel (L)", "Verfügbarer Kraftstoff (l)"],
    "Várható fogyasztás (l/100 km)": ["Expected consumption (L/100 km)", "Erwarteter Verbrauch (l/100 km)"],
    "Biztonsági tartalék (%)": ["Safety reserve (%)", "Sicherheitsreserve (%)"],
    "Matematikai maximum": ["Mathematical maximum", "Mathematisches Maximum"],
    "Tervezhető hatótáv": ["Plannable range", "Planbare Reichweite"],
    "Meghagyott tartalék": ["Remaining reserve", "Verbleibende Reserve"],
    "2026. augusztus 8.": ["8 August 2026", "8. August 2026"],
    "538 km": ["538 km", "538 km"],
    "458 km": ["458 km", "458 km"],
    "81 km": ["81 km", "81 km"]
  });
  const fueling = Object.freeze({
    "Tankolás kalkulátor": ["Refuelling budget calculator", "Tankbudget-Rechner"],
    "Számold ki, hány liter üzemanyagot kapsz a megadott tankolási keretből.": ["Calculate how many litres of fuel you can buy with your refuelling budget.", "Berechne, wie viele Liter Kraftstoff du für dein Tankbudget bekommst."],
    "Tankolási keret (Ft)": ["Refuelling budget (HUF)", "Tankbudget (HUF)"],
    "Üzemanyagár (Ft/l)": ["Fuel price (HUF/L)", "Kraftstoffpreis (HUF/l)"],
    "Tankolható mennyiség:": ["Fuel you can buy:", "Kaufbare Kraftstoffmenge:"],
    "Mire jó a tankolás kalkulátor?": ["What is the refuelling calculator for?", "Wofür ist der Tankbudget-Rechner gedacht?"],
    "Ez az oldal azt mutatja meg, hogy egy megadott tankolási keretből hány liter üzemanyagot tudsz vásárolni az aktuális literenkénti ár mellett. Akkor hasznos, ha indulás előtt szeretnéd látni, mire elég például 10 000, 20 000 vagy 30 000 Ft, vagy ha össze szeretnéd vetni két különböző üzemanyagár hatását.": [
      "This page shows how many litres of fuel you can buy with a given budget at the current price per litre. It is useful before setting off if you want to see what, for example, HUF 10,000, 20,000 or 30,000 will buy, or compare the effect of two different fuel prices.",
      "Diese Seite zeigt, wie viele Liter Kraftstoff du mit einem bestimmten Tankbudget zum aktuellen Literpreis kaufen kannst. Sie ist hilfreich, wenn du vor der Fahrt wissen möchtest, wie viel du zum Beispiel für 10.000, 20.000 oder 30.000 HUF bekommst, oder zwei Kraftstoffpreise vergleichen willst."
    ],
    "A kalkulátor nem a két tankolás közötti fogyasztást méri. Ahhoz a megtett kilométer és az utántöltött liter szükséges; erre az autó fogyasztás kalkulátor való. Itt a bemenet a tankolásra szánt összeg és a kútoszlopon látott Ft/l ár.": [
      "This calculator does not measure fuel consumption between fill-ups. That requires the distance travelled and the litres added; use the car fuel consumption calculator for that. Here, enter your fuel budget and the HUF-per-litre price shown at the pump.",
      "Dieser Rechner misst nicht den Verbrauch zwischen zwei Tankvorgängen. Dafür brauchst du die gefahrene Strecke und die nachgetankten Liter; verwende dafür den Rechner für den Kraftstoffverbrauch. Hier gibst du dein Tankbudget und den an der Zapfsäule angezeigten Preis in HUF pro Liter ein."
    ],
    "Hogyan működik a számítás?": ["How does the calculation work?", "Wie funktioniert die Berechnung?"],
    "A képlet egyszerű:": ["The formula is simple:", "Die Formel ist einfach:"],
    "tankolható liter = tankolási keret / literenkénti üzemanyagár": ["litres you can buy = refuelling budget ÷ fuel price per litre", "kaufbare Liter = Tankbudget ÷ Kraftstoffpreis pro Liter"],
    "Ha 20 000 Ft-ot szánsz tankolásra, és az üzemanyag ára 640 Ft/l, akkor 20 000 / 640 = 31,25 liter jön ki. A megjelenített eredmény egy tizedesre kerekítve 31,3 liter.": [
      "If you set aside HUF 20,000 and fuel costs HUF 640/L, the result is 20,000 ÷ 640 = 31.25 litres. The displayed result is rounded to one decimal place: 31.3 litres.",
      "Wenn du 20.000 HUF zum Tanken einplanst und der Kraftstoff 640 HUF/l kostet, ergibt sich 20.000 ÷ 640 = 31,25 Liter. Das angezeigte Ergebnis wird auf eine Dezimalstelle gerundet: 31,3 Liter."
    ],
    ". Ha 20 000 Ft-ot szánsz tankolásra, és az üzemanyag ára 640 Ft/l, akkor 20 000 / 640 = 31,25 liter jön ki. A megjelenített eredmény egy tizedesre kerekítve 31,3 liter.": [
      ". If you set aside HUF 20,000 and fuel costs HUF 640/L, the result is 20,000 ÷ 640 = 31.25 litres. The displayed result is rounded to one decimal place: 31.3 litres.",
      ". Wenn du 20.000 HUF zum Tanken einplanst und der Kraftstoff 640 HUF/l kostet, ergibt sich 20.000 ÷ 640 = 31,25 Liter. Das angezeigte Ergebnis wird auf eine Dezimalstelle gerundet: 31,3 Liter."
    ],
    "A számítás forinttal és literrel dolgozik. A tizedesvessző és a tizedespont közötti különbségre érdemes figyelni, mert egy rosszul beírt üzemanyagár teljesen más eredményt adhat. A kalkulátor a kedvezményeket, pontgyűjtő jóváírást, bankkártyás visszatérítést vagy több üzemanyagtípus keverését nem kezeli külön.": [
      "The calculation uses forints and litres. Check whether you enter a decimal comma or point correctly: a mistyped fuel price can change the result substantially. The calculator does not separately account for discounts, loyalty points, card cashback or mixing different fuel types.",
      "Die Berechnung erfolgt in Forint und Litern. Achte auf Dezimalkomma oder Dezimalpunkt: Ein falsch eingegebener Kraftstoffpreis kann das Ergebnis deutlich verändern. Rabatte, Treuepunkte, Kreditkarten-Cashback oder eine Mischung verschiedener Kraftstoffarten berücksichtigt der Rechner nicht gesondert."
    ],
    "Konkrét példa": ["Example", "Konkretes Beispiel"],
    "Ha a tankolási keret 15 000 Ft, a benzin ára pedig 625 Ft/l, akkor a számítás: 15 000 / 625 = 24 liter. Ez azt jelenti, hogy ekkora keretből nagyjából 24 liter üzemanyagot tankolhatsz. Ha az autó átlagfogyasztása 6,5 l/100 km, ez a mennyiség körülbelül 369 km elméleti útra lehet elég, de ezt már külön hatótáv- vagy üzemanyagköltség-számítással érdemes ellenőrizni.": [
      "If your budget is HUF 15,000 and petrol costs HUF 625/L, the calculation is 15,000 ÷ 625 = 24 litres. That budget buys about 24 litres of fuel. At an average consumption of 6.5 L/100 km, this could theoretically cover about 369 km, but check that separately with a range or fuel-cost calculator.",
      "Bei einem Tankbudget von 15.000 HUF und einem Benzinpreis von 625 HUF/l lautet die Rechnung: 15.000 ÷ 625 = 24 Liter. Für dieses Budget bekommst du also etwa 24 Liter Kraftstoff. Bei einem Durchschnittsverbrauch von 6,5 l/100 km könnte das theoretisch für rund 369 km reichen. Prüfe dies aber separat mit einem Reichweiten- oder Kraftstoffkosten-Rechner."
    ],
    "Az eredmény értelmezése": ["How to interpret the result", "So ist das Ergebnis zu verstehen"],
    "Az eredmény a megadott keretből vásárolható üzemanyag mennyisége. A valódi kútoszlopos érték néhány tized literrel eltérhet a kerekítés, a pontos literár, a fizetés módja vagy a tankolás megszakítása miatt. Ha teljes útköltséget tervezel, a liter mennyisége önmagában kevés: szükség lesz a fogyasztásra, a távolságra, esetleges autópályadíjra, parkolásra és egyéb útiköltségre is.": [
      "The result is the amount of fuel you can buy within your budget. The pump reading may differ by a few tenths of a litre due to rounding, the exact price, payment method or when you stop fuelling. For a full trip-cost estimate, litres alone are not enough: you also need consumption, distance, any tolls, parking and other travel costs.",
      "Das Ergebnis zeigt die Kraftstoffmenge, die du für dein Budget kaufen kannst. Die Zapfsäule kann wegen Rundung, genauem Literpreis, Zahlungsart oder dem Zeitpunkt des Tankstopps um einige Zehntelliter abweichen. Für die gesamten Fahrtkosten reichen die Liter allein nicht: Du brauchst auch Verbrauch, Strecke, mögliche Maut, Parkgebühren und weitere Reisekosten."
    ],
    "Korlátok és gyakori hibák": ["Limitations and common mistakes", "Grenzen und häufige Fehler"],
    "Ne keverd össze a literenkénti árat a teljes tankolási összeggel.": ["Do not confuse the price per litre with the total amount spent on fuel.", "Verwechsle den Preis pro Liter nicht mit dem Gesamtbetrag für das Tanken."],
    "Mindig Ft/l árat adj meg, ne eurós vagy más devizás értéket.": ["Enter the price in HUF/L, not in euros or another currency.", "Gib den Preis in HUF/l an, nicht in Euro oder einer anderen Währung."],
    "Kupon, flottakedvezmény vagy pontbeváltás esetén a tényleges fizetendő ár eltérhet.": ["With a coupon, fleet discount or redeemed points, the amount you actually pay may differ.", "Bei Gutscheinen, Flottenrabatten oder eingelösten Punkten kann der tatsächlich zu zahlende Preis abweichen."],
    "A kalkulátor nem mondja meg, hány kilométerre elég az üzemanyag; ehhez fogyasztási adat is kell.": ["The calculator does not show how many kilometres the fuel will cover; you also need a consumption figure for that.", "Der Rechner zeigt nicht, für wie viele Kilometer der Kraftstoff reicht; dafür brauchst du zusätzlich einen Verbrauchswert."],
    "Mit írjak a tankolási keret mezőbe?": ["What should I enter as my refuelling budget?", "Was trage ich als Tankbudget ein?"],
    "Azt az összeget forintban, amelyet tankolásra szánsz. Ha pontosan 20 000 Ft-ért szeretnél tankolni, akkor 20000 legyen a bemenet.": ["Enter the amount in forints that you plan to spend on fuel. If you want to spend exactly HUF 20,000, enter 20000.", "Gib den Betrag in Forint ein, den du fürs Tanken einplanst. Wenn du genau 20.000 HUF ausgeben möchtest, gib 20000 ein."],
    "A kalkulátor kiszámolja az út teljes költségét?": ["Does the calculator work out the full cost of a trip?", "Berechnet der Rechner die gesamten Fahrtkosten?"],
    "Nem. Ez az oldal a keretből vásárolható litert számolja. Teljes útiköltséghez használd az üzemanyag költség kalkulátort, ahol távolságot és fogyasztást is megadhatsz.": ["No. This page calculates how many litres your budget will buy. For full trip costs, use the fuel cost calculator, where you can also enter distance and consumption.", "Nein. Diese Seite berechnet, wie viele Liter du für dein Budget bekommst. Für die gesamten Fahrtkosten verwende den Kraftstoffkosten-Rechner und gib auch Strecke und Verbrauch ein."],
    "Miért térhet el a kútoszlopon látható érték?": ["Why might the pump show a different amount?", "Warum kann die Zapfsäule einen anderen Wert anzeigen?"],
    "A kút pontos literára, a kerekítés, a fizetési kedvezmény, illetve az, hogy mikor állítod le a tankolást, kisebb eltérést okozhat.": ["The exact price per litre, rounding, a payment discount and when you stop fuelling can cause small differences.", "Der genaue Literpreis, Rundungen, ein Zahlungsrabatt und der Zeitpunkt, an dem du den Tankvorgang beendest, können kleine Abweichungen verursachen."],
    "Használható benzinhez és dízelhez is?": ["Can I use it for petrol and diesel?", "Kann ich den Rechner für Benzin und Diesel verwenden?"],
    "Igen. A képlet üzemanyagtípustól független, csak a megfelelő literenkénti árat kell megadni.": ["Yes. The formula works for any fuel type; just enter the correct price per litre.", "Ja. Die Formel ist unabhängig von der Kraftstoffart. Gib einfach den passenden Literpreis ein."],
    "2026. július 1.": ["1 July 2026", "1. Juli 2026"],
    "Éves autóköltség kalkulátor": ["Annual car cost calculator", "Jährliche Autokosten"],
    "Becsüld meg az autó éves fenntartási költségét.": ["Estimate your car's annual running costs.", "Schätze die jährlichen Unterhaltskosten deines Autos."],
    "Kilométerdíj kalkulátor": ["Cost per kilometre calculator", "Kilometerkosten-Rechner"],
    "Számold ki, mennyibe kerül egy kilométer az autóddal.": ["Calculate how much each kilometre costs you.", "Berechne, wie viel dich jeder Kilometer mit deinem Auto kostet."],
    "Autó értékvesztés kalkulátor": ["Car depreciation calculator", "Wertverlust-Rechner fürs Auto"],
    "Számold ki, mennyit veszíthet az autó az értékéből évente.": ["Estimate how much value your car may lose each year.", "Schätze, wie viel Wert dein Auto pro Jahr verlieren kann."],
    "Tankolási keret": ["Refuelling budget", "Tankbudget"],
    "Árengedmény literenként: mennyit számít a teljes tankolásnál?": ["Discount per litre: how much does it save on a full refuel?", "Rabatt pro Liter: Wie viel macht das beim Tanken aus?"],
    "Listaár (Ft/l)": ["Regular price (HUF/L)", "Listenpreis (HUF/l)"],
    "Kedvezmény (Ft/l)": ["Discount (HUF/L)", "Rabatt (HUF/l)"],
    "Liter kedvezmény nélkül": ["Litres without discount", "Liter ohne Rabatt"],
    "Liter kedvezménnyel": ["Litres with discount", "Liter mit Rabatt"],
    "Plusz üzemanyag": ["Additional fuel", "Zusätzlicher Kraftstoff"],
    "Megtakarítás azonos liternél": ["Saving for the same number of litres", "Ersparnis bei gleicher Literzahl"],
    "Ne csak a literárat nézd": ["Look beyond the price per litre", "Achte nicht nur auf den Literpreis"],
    "Ha a kedvezményért kerülőt teszel, a plusz kilométer üzemanyag- és időigénye csökkentheti vagy el is viheti az előnyt.": ["If you drive out of your way for a discount, the extra fuel and time may reduce or even cancel the savings.", "Wenn du für einen Rabatt einen Umweg fährst, können zusätzlicher Kraftstoff und Zeit den Vorteil verringern oder ganz aufheben."]
  });
  const toll = Object.freeze({
    "Oszd el az autópályadíjat vagy útdíjat az utasok között.": ["Split motorway tolls or other road charges among the passengers.", "Teile Autobahnmaut oder andere Straßengebühren unter den Mitfahrenden auf."],
    "Autópályadíj (Ft)": ["Road toll (HUF)", "Mautgebühr (HUF)"],
    "Utasok száma": ["Number of passengers", "Anzahl der Mitfahrenden"],
    "Egy főre jutó díj:": ["Cost per person:", "Kosten pro Person:"],
    "0 Ft": ["HUF 0", "0 HUF"],
    "Mire való az autópályadíj megosztó?": ["What is the toll-sharing calculator for?", "Wofür ist der Mautkosten-Rechner gedacht?"],
    "A kalkulátor egy közös utazásnál megmutatja, mennyi autópályadíj vagy útdíj jut egy résztvevőre, ha a teljes költséget egyenlően osztjátok el. Ez praktikus telekocsinál, nyaralásnál, többnapos kirándulásnál vagy munkatársakkal közös utazásnál.": [
      "For a shared trip, this calculator shows each person's share of motorway tolls or other road charges when you split the total equally. It can help with carpooling, holidays, multi-day trips or journeys with colleagues.",
      "Bei einer gemeinsamen Fahrt zeigt dieser Rechner, welcher Anteil der Autobahnmaut oder anderer Straßengebühren auf jede Person entfällt, wenn ihr die Gesamtkosten gleichmäßig teilt. Das ist beim Carsharing, im Urlaub, auf mehrtägigen Ausflügen oder bei Fahrten mit Kollegen hilfreich."
    ],
    "Fontos, hogy ez": ["Please note: this is", "Wichtig: Dies ist"],
    "nem hivatalos matricaár-kalkulátor": ["not an official vignette-price calculator", "kein offizieller Vignettenpreis-Rechner"],
    "és nem választja ki automatikusan a megfelelő magyar vagy külföldi úthasználati jogosultságot. A megadott teljes összeget osztja el a résztvevők között.": ["and it does not automatically select the right Hungarian or foreign road-use permit. It simply divides the total amount you enter among the passengers.", "und er wählt nicht automatisch die passende ungarische oder ausländische Straßennutzungsberechtigung aus. Er teilt lediglich den eingegebenen Gesamtbetrag unter den Mitfahrenden auf."],
    "A számítás": ["Calculation", "Berechnung"],
    "Egy főre jutó díj = teljes autópályadíj / fizetők száma.": ["Cost per person = total tolls ÷ number of people paying.", "Kosten pro Person = Gesamtmaut ÷ Anzahl der zahlenden Personen."],
    "Ha a sofőr is ugyanúgy részt vesz a költségekben, őt is számítsd bele. Ha a sofőrt a többiek mentesítik a díjból, csak a ténylegesen fizetők számát add meg.": ["Include the driver if they are sharing the cost equally. If the passengers agree to cover the driver's share, enter only the number of people who will actually pay.", "Zähle den Fahrer mit, wenn er sich gleichmäßig an den Kosten beteiligt. Wenn die Mitfahrenden den Anteil des Fahrers übernehmen, gib nur die tatsächliche Zahl der Zahlenden ein."],
    "Példa": ["Example", "Beispiel"],
    "Ha az utazáshoz 6 620 Ft összes útdíj tartozik és négyen egyenlően fizettek, akkor fejenként 1 655 Ft jut.": ["If the trip has total road charges of HUF 6,620 and four people split them equally, each person pays HUF 1,655.", "Betragen die gesamten Straßengebühren für die Fahrt 6.620 HUF und teilen vier Personen sie gleichmäßig, zahlt jede Person 1.655 HUF."],
    "1 655 Ft": ["HUF 1,655", "1.655 HUF"],
    "Mi minden tartozhat az útdíjhoz?": ["What can be included in road charges?", "Was kann zu den Straßengebühren zählen?"],
    "Egy hosszabb utazásnál több külön tétel is felmerülhet: magyar e-matrica, külföldi matrica, kapus útdíj, híd- vagy alagútdíj, komp és egyéb speciális szakaszdíj. Ha ezeket együtt akarjátok megosztani, előbb add össze őket, majd a teljes összeget írd be.": ["A longer trip may involve several charges: a Hungarian e-vignette, foreign vignettes, toll booths, bridge or tunnel tolls, ferries and other section fees. If you want to share them all, add them together first and enter the total.", "Auf längeren Fahrten können verschiedene Gebühren anfallen: eine ungarische E-Vignette, ausländische Vignetten, Mautstellen, Brücken- oder Tunnelgebühren, Fähren und weitere Streckengebühren. Wenn ihr alles teilen möchtet, addiert die Beträge zuerst und gebt die Gesamtsumme ein."],
    "Mikor igazságos az egyenlő megosztás?": ["When is an equal split fair?", "Wann ist eine gleichmäßige Aufteilung fair?"],
    "Akkor működik jól, ha minden résztvevő ugyanazon az útvonalon és ugyanannyi ideig utazik. Ha valaki csak az út egy részén vesz részt, vagy valamelyik matrica később csak az autó tulajdonosának jelent további értéket, érdemes arányosabb megoldást választani.": ["An equal split works best when everyone travels the same route for the same length of time. If someone joins for only part of the trip, or a vignette will provide later value only to the car's owner, consider a more proportional arrangement.", "Eine gleichmäßige Aufteilung ist sinnvoll, wenn alle dieselbe Strecke und gleich lange mitfahren. Wenn jemand nur einen Teil der Strecke mitfährt oder eine Vignette später nur dem Fahrzeughalter weiteren Nutzen bringt, ist eine anteilige Aufteilung möglicherweise fairer."],
    "Éves vagy hosszabb érvényességű matrica kezelése": ["How to handle annual or long-validity vignettes", "Jahres- oder länger gültige Vignetten berücksichtigen"],
    "Egy éves matrica teljes árát általában nem életszerű egyetlen közös útra terhelni, ha a tulajdonos később is használja. Ilyenkor megállapodhattok csak az adott út ésszerű részarányában, vagy úgy, hogy a többiek csak az alternatív rövidebb jogosultság becsült költségéhez járulnak hozzá.": ["It is usually not reasonable to charge the full price of an annual vignette to one shared trip if the owner will use it later. You could agree to split a reasonable share of its cost, or have the others contribute only up to the estimated cost of a shorter alternative.", "Es ist meist nicht sinnvoll, den vollen Preis einer Jahresvignette einer einzigen gemeinsamen Fahrt zuzurechnen, wenn der Besitzer sie später weiter nutzt. Ihr könnt euch darauf einigen, nur einen angemessenen Anteil für diese Fahrt aufzuteilen oder höchstens die geschätzten Kosten einer kürzer gültigen Alternative anzusetzen."],
    "Mi nincs benne?": ["What is not included?", "Was ist nicht enthalten?"],
    "üzemanyag;": ["fuel;", "Kraftstoff;"],
    "parkolás;": ["parking;", "Parkgebühren;"],
    "autó amortizációja és szervizköltsége;": ["vehicle depreciation and servicing;", "Wertverlust und Wartung des Fahrzeugs;"],
    "biztosítás;": ["insurance;", "Versicherung;"],
    "sofőr munkája vagy ideje;": ["the driver's time or work;", "Arbeitsleistung oder Zeit des Fahrers;"],
    "árfolyam- és bankkártyaköltség külföldi fizetésnél.": ["currency-conversion and card fees for payments abroad.", "Wechselkurs- und Kartengebühren bei Zahlungen im Ausland."],
    "Teljes útiköltséghez mit érdemes még számolni?": ["What else should I include in total trip costs?", "Was sollte ich für die gesamten Fahrtkosten zusätzlich berechnen?"],
    "Ha nem csak az autópályadíjat szeretnétek megosztani, számoljátok ki külön az üzemanyagköltséget, parkolást és egyéb útdíjakat is. Így jóval átláthatóbb lesz, mennyibe került valójában az utazás egy főre.": ["If you want to share more than tolls, calculate fuel, parking and other road charges separately too. This gives you a clearer picture of the actual cost per person.", "Wenn ihr mehr als die Maut teilen möchtet, berechnet Kraftstoff, Parkgebühren und weitere Straßengebühren ebenfalls separat. So wird klarer, was die Fahrt tatsächlich pro Person kostet."],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "kihagyják a visszaúthoz vásárolt külön jogosultságot;": ["forgetting a separate permit bought for the return trip;", "eine separate Berechtigung für die Rückfahrt zu vergessen;"],
    "a sofőrt tévesen kihagyják vagy kétszer számolják;": ["incorrectly leaving out the driver or counting them twice;", "den Fahrer fälschlicherweise nicht oder doppelt zu zählen;"],
    "az éves matrica teljes árát egyetlen útra terhelik;": ["charging the full annual-vignette price to a single trip;", "den vollen Preis einer Jahresvignette einer einzigen Fahrt zuzurechnen;"],
    "különböző pénznemű díjakat átváltás nélkül adnak össze;": ["adding charges in different currencies without converting them;", "Gebühren in verschiedenen Währungen ohne Umrechnung zu addieren;"],
    "az útdíjat összekeverik a teljes utazási költséggel.": ["confusing tolls with the total cost of the trip.", "Mautgebühren mit den gesamten Fahrtkosten zu verwechseln."],
    "A sofőr is egy főnek számít?": ["Does the driver count as one person?", "Zählt der Fahrer als eine Person?"],
    "Igen, ha ő is azonos arányban fizet. Ettől természetesen közös megegyezéssel el lehet térni.": ["Yes, if the driver pays an equal share. You can of course agree on a different arrangement.", "Ja, wenn der Fahrer den gleichen Anteil zahlt. Ihr könnt natürlich gemeinsam eine andere Aufteilung vereinbaren."],
    "Az üzemanyag benne van?": ["Is fuel included?", "Ist Kraftstoff enthalten?"],
    "Nem. Ez az oldal csak a megadott útdíj vagy matricaköltség megosztását végzi.": ["No. This page only splits the road toll or vignette costs you enter.", "Nein. Diese Seite teilt nur die eingegebenen Maut- oder Vignettenkosten auf."],
    "Külföldi útdíjat is megoszthatok?": ["Can I split foreign road charges too?", "Kann ich auch ausländische Straßengebühren aufteilen?"],
    "Igen. Előbb váltsd egységes pénznemre a tételeket, majd add össze őket.": ["Yes. Convert the amounts to one currency first, then add them together.", "Ja. Rechne die Beträge zuerst in eine gemeinsame Währung um und addiere sie dann."],
    "Mi legyen, ha valaki csak félúton csatlakozik?": ["What if someone joins only halfway through?", "Was ist, wenn jemand erst unterwegs dazukommt?"],
    "Ilyenkor az egyenlő osztás helyett érdemes az útvonal vagy a ténylegesen használt díjköteles szakasz alapján külön megállapodni.": ["In that case, agree on a different split based on the route or the toll-paying sections each person actually uses.", "In diesem Fall solltet ihr statt einer gleichmäßigen Aufteilung eine Vereinbarung anhand der Strecke oder der tatsächlich genutzten mautpflichtigen Abschnitte treffen."],
    "Ez megmondja, milyen matricát kell vennem?": ["Does this tell me which vignette to buy?", "Sagt mir der Rechner, welche Vignette ich kaufen muss?"],
    "Nem. A jogosultság típusát és aktuális árát mindig az adott ország hivatalos útdíj-szolgáltatójánál ellenőrizd.": ["No. Always check the permit type and current price with the official toll provider in the country concerned.", "Nein. Prüfe die Art der Berechtigung und den aktuellen Preis immer beim offiziellen Mautanbieter des jeweiligen Landes."],
    "Üzemanyagköltség": ["Fuel costs", "Kraftstoffkosten"],
    "Utazási idő": ["Travel time", "Fahrzeit"],
    "Költségmegosztás": ["Cost sharing", "Kostenaufteilung"],
    "Kilométerdíj": ["Cost per kilometre", "Kilometerkosten"],
    "2026. augusztus 8.": ["8 August 2026", "8. August 2026"],
    "Matricaválasztás nullszaldó": ["Vignette break-even comparison", "Vignetten-Break-even-Vergleich"],
    "Hány útnál éri meg a drágább jogosultság?": ["How many trips make the more expensive permit worthwhile?", "Ab wie vielen Fahrten lohnt sich die teurere Berechtigung?"],
    "Aktuális díjat nem építünk be fixen. Írd be a most érvényes árakat, így a kalkulátor nem avul el egy díjváltozásnál.": ["Current prices are not hard-coded. Enter the prices that apply now so the calculator stays useful when fees change.", "Aktuelle Preise sind nicht fest hinterlegt. Gib die derzeit gültigen Preise ein, damit der Rechner bei Gebührenänderungen aktuell bleibt."],
    "Rövid időtartamú matrica ára (Ft)": ["Short-validity vignette price (HUF)", "Preis der kurz gültigen Vignette (HUF)"],
    "Hosszabb matrica ára (Ft)": ["Longer-validity vignette price (HUF)", "Preis der länger gültigen Vignette (HUF)"],
    "Egy rövid matrica által lefedett utak száma": ["Number of trips covered by one short-validity vignette", "Anzahl der Fahrten, die eine kurz gültige Vignette abdeckt"],
    "Nullszaldós rövid matrica darabszám": ["Break-even number of short-validity vignettes", "Break-even-Anzahl kurz gültiger Vignetten"],
    "2 db rövid jogosultság": ["2 short-validity permits", "2 kurz gültige Berechtigungen"],
    "E fölött a hosszabb lehet olcsóbb": ["Above this, the longer-validity option may cost less", "Darüber kann die länger gültige Option günstiger sein"],
    "2 lefedett út környékén már érdemes újraszámolni": ["Recheck the comparison at around 2 covered trips", "Bei etwa 2 abgedeckten Fahrten lohnt sich ein neuer Vergleich"],
    "Ellenőrizd az érvényességet": ["Check the validity", "Gültigkeit prüfen"],
    "A területi hatály, járműkategória, érvényességi idő és vásárlási szabályok mindig az aktuális hivatalos útdíj-tájékoztató szerint értelmezendők.": ["Territorial coverage, vehicle class, validity period and purchase rules should always be checked against the current official toll information.", "Geltungsbereich, Fahrzeugklasse, Gültigkeitszeitraum und Kaufregeln sind immer anhand der aktuellen offiziellen Mautinformationen zu prüfen."]
  });
  const dictionaries = Object.freeze({ "auto-fogyasztas-kalkulator": consumption, "uzemanyag-koltseg-kalkulator": fuelCost, "hatotav-kalkulator": range, "tankolas-kalkulator": fueling, "autopalyadij-kalkulator": toll });
  const pages = Object.freeze(Object.keys(dictionaries)), supported = Object.freeze(["hu", "en", "de"]);
  const dynamic = Object.freeze({
    "Átlagfogyasztás:": ["Average fuel consumption:", "Durchschnittsverbrauch:"],
    "Szükséges üzemanyag:": ["Fuel required:", "Benötigter Kraftstoff:"],
    "Várható költség:": ["Estimated cost:", "Voraussichtliche Kosten:"],
    "Teljes útiköltség:": ["Total trip cost:", "Gesamte Fahrtkosten:"],
    "Egy főre:": ["Per person:", "Pro Person:"],
    "Tankolható mennyiség:": ["Fuel you can buy:", "Kaufbare Kraftstoffmenge:"],
    "Stresszelt költség:": ["Scenario cost:", "Kosten im Szenario:"],
    "Fogyasztási teszt:": ["Consumption scenario:", "Verbrauchsszenario:"],
    "Üzemanyag:": ["Fuel:", "Kraftstoff:"],
    "Átlagfogyasztás: ": ["Average fuel consumption: ", "Durchschnittsverbrauch: "]
  });
  function translate(page, value, language) {
    if (!supported.includes(language) || language === "hu" || typeof value !== "string") return null;
    const normalized = value.replace(/\s+/gu, " ").trim();
    const exact = dictionaries[page];
    if (!exact) return null;
    const index = language === "en" ? 0 : 1;
    if (Object.prototype.hasOwnProperty.call(exact, normalized)) return exact[normalized][index];
    if (Object.prototype.hasOwnProperty.call(shared, normalized)) return shared[normalized][index];
    for (const [prefix, translations] of Object.entries(dynamic)) {
      if (normalized.startsWith(prefix) && /\s/u.test(normalized.charAt(prefix.length))) return translations[index] + normalized.slice(prefix.length);
    }
    return null;
  }
  return { pages, dictionaries, shared, translate, supported };
});

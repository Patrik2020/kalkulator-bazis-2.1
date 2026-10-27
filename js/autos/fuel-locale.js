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
  const dictionaries = Object.freeze({ "auto-fogyasztas-kalkulator": consumption, "uzemanyag-koltseg-kalkulator": fuelCost });
  const pages = Object.freeze(Object.keys(dictionaries)), supported = Object.freeze(["hu", "en", "de"]);
  const dynamic = Object.freeze({
    "Átlagfogyasztás:": ["Average fuel consumption:", "Durchschnittsverbrauch:"],
    "Szükséges üzemanyag:": ["Fuel required:", "Benötigter Kraftstoff:"],
    "Várható költség:": ["Estimated cost:", "Voraussichtliche Kosten:"],
    "Teljes útiköltség:": ["Total trip cost:", "Gesamte Fahrtkosten:"],
    "Egy főre:": ["Per person:", "Pro Person:"],
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

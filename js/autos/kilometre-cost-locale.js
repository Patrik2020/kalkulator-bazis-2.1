/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "kilometerdij-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="kilometerdij-kalkulator"]');
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
  const page = "kilometerdij-kalkulator";
  const dictionary = Object.freeze({
    "hu-HU": ["en-GB", "de-DE"],
    "Kilométerdíj kalkulátor | Autóköltség Ft/km": ["Cost per Kilometre Calculator | Car Cost per km", "Kilometerkostenrechner | Autokosten pro km"],
    "Kilométerdíj kalkulátor a teljes autóköltség kilométerenkénti becsléséhez. Számolj üzemanyaggal, biztosítással, szervizzel és értékvesztéssel.": ["Estimate your car's full cost per kilometre, including fuel, insurance, servicing and depreciation.", "Schätze die gesamten Autokosten pro Kilometer einschließlich Kraftstoff, Versicherung, Wartung und Wertverlust."],
    "Kilométerdíj kalkulátor": ["Cost per Kilometre Calculator", "Kilometerkostenrechner"],
    "Számold ki, mennyibe kerül egy kilométer az autóddal.": ["Calculate how much each kilometre costs in your car.", "Berechne, wie viel ein Kilometer mit deinem Auto kostet."],
    "Autó és közlekedés kalkulátorok": ["Car and transport calculators", "Rechner für Auto und Verkehr"],
    "Főoldal": ["Home", "Startseite"], "Autó & közlekedés": ["Cars & transport", "Auto & Verkehr"], "Hirdetés": ["Advertisement", "Anzeige"],
    "Számold ki, mennyibe kerül egy kilométer a saját autóddal az éves teljes autóköltség és az éves futás alapján.": ["Calculate the cost of each kilometre in your car from its total annual cost and annual mileage.", "Berechne anhand der gesamten Jahreskosten und der jährlichen Fahrleistung, wie viel ein Kilometer mit deinem Auto kostet."],
    "Teljes kilométerköltség-kalkulátor": ["Full cost per kilometre calculator", "Rechner für vollständige Kilometerkosten"],
    "A mezők tájékoztató tervezésre valók; hivatalos, gyártói vagy szolgáltatói adat esetén mindig azt használd.": ["These fields are for planning estimates. Use official, manufacturer or provider figures when available.", "Diese Eingaben dienen der Planung. Nutze verfügbare offizielle Angaben sowie Daten des Herstellers oder Anbieters."],
    "Éves teljes autóköltség (Ft)": ["Total annual car cost (HUF)", "Gesamte jährliche Autokosten (HUF)"],
    "Éves futás (km)": ["Annual mileage (km)", "Jährliche Fahrleistung (km)"],
    "Vizsgált út (km)": ["Trip distance (km)", "Strecke (km)"],
    "Fizető utasok száma": ["Number of paying passengers", "Anzahl zahlender Mitfahrer"],
    "Számítás": ["Calculate", "Berechnen"], "Add meg az adatokat.": ["Enter the values.", "Gib die Werte ein."],
    "Ellenőrizd a kötelező mezőket és az értékhatárokat.": ["Check the required fields and allowed ranges.", "Prüfe die Pflichtfelder und zulässigen Wertebereiche."],
    "A költség és a távolság adatai nem lehetnek negatívak; az éves futás legyen pozitív.": ["Costs and distances cannot be negative, and annual mileage must be greater than zero.", "Kosten und Entfernungen dürfen nicht negativ sein; die jährliche Fahrleistung muss größer als null sein."],
    "Az utasok száma pozitív egész szám legyen.": ["The number of passengers must be a positive whole number.", "Die Anzahl der Mitfahrer muss eine positive ganze Zahl sein."],
    "A megadott adatokból nem számítható véges eredmény.": ["These values do not produce a finite result.", "Aus diesen Werten lässt sich kein endliches Ergebnis berechnen."],
    "Hibás adat.": ["Invalid input.", "Ungültige Eingabe."],
    "Teljes költség": ["Full cost per kilometre", "Gesamtkosten pro Kilometer"],
    "Vizsgált út költsége": ["Trip cost", "Kosten der Strecke"], "Egy főre": ["Per paying passenger", "Pro zahlendem Mitfahrer"],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek": ["Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Mennyibe kerül valójában egy kilométer autózás?": ["What does a kilometre of driving really cost?", "Was kostet ein gefahrener Kilometer wirklich?"],
    "A kilométerdíj kalkulátor az éves teljes autóköltséget osztja el az éves futással. Így nemcsak a tankolást, hanem biztosítást, szervizt, adókat, parkolást, értékvesztést és más tételeket is egyetlen Ft/km értékben lehet összefoglalni.": ["The calculator divides your car's total annual cost by its annual mileage. This combines fuel, insurance, servicing, taxes, parking, depreciation and other items into one cost per kilometre.", "Der Rechner teilt die gesamten jährlichen Autokosten durch die jährliche Fahrleistung. So werden Kraftstoff, Versicherung, Wartung, Steuern, Parken, Wertverlust und weitere Posten zu einem Kilometerpreis zusammengefasst."],
    "Az eredmény annál pontosabb, minél teljesebb és azonos időszakra vonatkozó az éves költség- és futásadat. A kalkulátor a kapott Ft/km értékből egy választott út teljes költségét és a fizető utasokra jutó összeget is megbecsüli.": ["The estimate improves when the annual cost and mileage figures are complete and cover the same period. The calculator also uses the cost per kilometre to estimate a selected trip and each paying passenger's share.", "Die Schätzung wird genauer, wenn Kosten und Fahrleistung vollständig sind und denselben Zeitraum abdecken. Aus den Kilometerkosten schätzt der Rechner außerdem die Kosten einer gewählten Strecke und den Anteil je zahlendem Mitfahrer."],
    "A képlet": ["The formula", "Die Formel"],
    "Kilométerenkénti költség = éves teljes autóköltség ÷ éves futás.": ["Cost per kilometre = total annual car cost ÷ annual mileage.", "Kosten pro Kilometer = gesamte jährliche Autokosten ÷ jährliche Fahrleistung."],
    "Ha az éves futás alacsony, a fix és gazdasági költségek miatt az egy kilométerre jutó összeg magas lesz.": ["With low annual mileage, fixed and economic costs make the cost per kilometre higher.", "Bei geringer jährlicher Fahrleistung erhöhen fixe und wirtschaftliche Kosten den Kilometerpreis."],
    "Példa": ["Example", "Beispiel"],
    "Ha az autó teljes éves költsége 1 200 000 Ft, és évente 15 000 km-t teszel meg, akkor 1 200 000 ÷ 15 000 = 80 Ft/km. Egy 200 km-es út így körülbelül 16 000 Ft teljes autóköltséget képvisel; két fizető utasnál ez 8 000 Ft/fő.": ["If the car costs HUF 1,200,000 a year and covers 15,000 km, then 1,200,000 ÷ 15,000 = 80 HUF/km. A 200 km trip therefore represents about HUF 16,000 in total car costs, or HUF 8,000 for each of two paying passengers.", "Bei jährlichen Autokosten von 1.200.000 HUF und 15.000 km Fahrleistung gilt: 1.200.000 ÷ 15.000 = 80 HUF/km. Eine 200-km-Strecke verursacht damit etwa 16.000 HUF Gesamtkosten; bei zwei zahlenden Mitfahrern sind es jeweils 8.000 HUF."],
    "Milyen költségeket érdemes beleszámolni?": ["Which costs should you include?", "Welche Kosten solltest du einbeziehen?"],
    "Üzemanyag vagy áram, kötelező és casco biztosítás, gépjárműadó, szerviz, gumi, műszaki vizsga, parkolás, autópályadíj, finanszírozás és értékvesztés. Összehasonlításhoz minden autónál ugyanazokat a tételeket használd.": ["Include fuel or electricity, compulsory and comprehensive insurance, vehicle tax, servicing, tyres, inspections, parking, tolls, financing and depreciation. Use the same cost categories when comparing cars.", "Berücksichtige Kraftstoff oder Strom, Haftpflicht- und Kaskoversicherung, Kfz-Steuer, Wartung, Reifen, Hauptuntersuchung, Parken, Maut, Finanzierung und Wertverlust. Nutze beim Fahrzeugvergleich dieselben Kostenarten."],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "Csak az üzemanyagot számítják költségnek.": ["Counting fuel as the only cost.", "Nur Kraftstoff als Kosten anzusetzen."],
    "Nem azonos időszakból származó költséget és futást osztanak el egymással.": ["Dividing costs and mileage from different periods.", "Kosten und Fahrleistung aus unterschiedlichen Zeiträumen miteinander zu verrechnen."],
    "A ritka javításokat és gumicserét kihagyják.": ["Leaving out occasional repairs and tyre replacement.", "Seltene Reparaturen und Reifenwechsel auszulassen."],
    "Az értékvesztést nem veszik figyelembe.": ["Ignoring depreciation.", "Den Wertverlust nicht zu berücksichtigen."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Céges elszámolásra használható?": ["Can I use this for company expense claims?", "Kann ich das Ergebnis für betriebliche Abrechnungen verwenden?"],
    "Tájékoztató számításhoz igen, hivatalos költségtérítéshez mindig az aktuális szabályokat kell követni.": ["Yes, for an informal estimate. Official mileage reimbursement must follow the current rules.", "Ja, für eine unverbindliche Schätzung. Für eine offizielle Kostenerstattung gelten immer die aktuellen Vorschriften."],
    "Az értékvesztést hogyan adjam hozzá?": ["How should I include depreciation?", "Wie berücksichtige ich den Wertverlust?"],
    "Az éves becsült értékvesztést add hozzá az éves teljes autóköltséghez. Ez gazdasági költség, nem feltétlenül ugyanabban az évben kifizetett készpénz.": ["Add the estimated annual depreciation to the total annual car cost. It is an economic cost, though it may not be cash paid during that year.", "Addiere den geschätzten jährlichen Wertverlust zu den gesamten jährlichen Autokosten. Er ist ein wirtschaftlicher Kostenfaktor, aber nicht zwingend eine Zahlung in demselben Jahr."],
    "Miért magas kevés használatnál?": ["Why is it high when I drive very little?", "Warum ist der Wert bei geringer Nutzung so hoch?"],
    "A biztosítás és más fix költségek akkor is jelentkeznek, ha kevés kilométert mész.": ["Insurance and other fixed costs still apply when you drive only a few kilometres.", "Versicherung und andere Fixkosten fallen auch bei geringer Fahrleistung an."],
    "Elektromos autóhoz is jó?": ["Does it work for an electric car?", "Funktioniert der Rechner auch für ein Elektroauto?"],
    "Igen, ha az áramköltséget és a többi fenntartási tételt adod meg.": ["Yes. Include electricity and the other ownership costs in the annual total.", "Ja. Nimm Strom und die übrigen Unterhaltskosten in die Jahressumme auf."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Éves autóköltség kalkulátor": ["Annual Car Cost Calculator", "Rechner für jährliche Autokosten"],
    "Üzemanyagköltség kalkulátor": ["Fuel Cost Calculator", "Kraftstoffkostenrechner"],
    "Autó fogyasztás kalkulátor": ["Fuel Consumption Calculator", "Kraftstoffverbrauchsrechner"],
    "Autó értékvesztés kalkulátor": ["Car Depreciation Calculator", "Autowertverlust-Rechner"],
    "Utolsó tartalmi frissítés:": ["Content last reviewed:", "Inhalt zuletzt geprüft:"], "2026. augusztus 26.": ["26 August 2026", "26. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    "Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.": ["The result is an estimate based on the consumption, price and trip details entered. Driving conditions, vehicle condition and changing charges can affect the actual cost.", "Das Ergebnis ist eine Schätzung anhand der eingegebenen Verbrauchs-, Preis- und Streckendaten. Fahrbedingungen, Fahrzeugzustand und geänderte Gebühren können die tatsächlichen Kosten beeinflussen."],
    "A számítások módszertana és minőségbiztosítása": ["Calculation methods and quality assurance", "Berechnungsmethoden und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.": ["Found an error? Let us know.", "Fehler gefunden? Melde ihn uns."],
    "Ft/km háromféleképpen": ["Three ways to view cost per kilometre", "Drei Arten von Kilometerkosten"],
    "Nem mindegy, mit nevezel kilométerköltségnek": ["Define what you mean by cost per kilometre", "Entscheidend ist, was du als Kilometerkosten bezeichnest"],
    "Üzemanyag Ft/km": ["Fuel cost per kilometre", "Kraftstoffkosten pro Kilometer"],
    "Csak a megtett út közvetlen üzemanyagköltsége. Rövid döntéshez hasznos, teljes költségnek kevés.": ["This covers only the direct fuel cost of the distance driven. It can help with a quick decision but is not a full cost figure.", "Das sind nur die direkten Kraftstoffkosten der gefahrenen Strecke. Für eine schnelle Entscheidung hilfreich, als Gesamtkosten jedoch unvollständig."],
    "Változó Ft/km": ["Variable cost per kilometre", "Variable Kosten pro Kilometer"],
    "Üzemanyag mellett kopó alkatrész, gumi és futással arányos szerviz is ide sorolható.": ["Alongside fuel, this may include wear parts, tyres and servicing that varies with mileage.", "Neben Kraftstoff können Verschleißteile, Reifen und fahrleistungsabhängige Wartung dazugehören."],
    "Teljes Ft/km": ["Full cost per kilometre", "Gesamtkosten pro Kilometer"],
    "Az éves fix költség és értékvesztés is ráosztódik a futásra. Kevés kilométernél ezért meglepően magas lehet.": ["Annual fixed costs and depreciation are also spread over the mileage, so the figure can be surprisingly high when you drive little.", "Jährliche Fixkosten und Wertverlust werden ebenfalls auf die Fahrleistung verteilt. Bei wenigen Kilometern kann der Wert daher überraschend hoch sein."],
    "Határköltség": ["Marginal cost", "Grenzkosten"],
    "Ha az autó már amúgy is megvan, egy plusz út döntésénél nem biztos, hogy minden éves fix tételt újra figyelembe akarsz venni.": ["If you already own the car, deciding on one additional trip may not require allocating every annual fixed cost again.", "Wenn du das Auto ohnehin besitzt, musst du bei der Entscheidung über eine zusätzliche Fahrt möglicherweise nicht alle jährlichen Fixkosten erneut ansetzen."],
    "Mit jelent a teljes Ft/km érték?": ["What does the full cost per kilometre mean?", "Was bedeuten die vollständigen Kilometerkosten?"],
    "Az éves teljes autóköltséget osztja az éves futással, majd ebből becsüli egy választott út és a fizető utasokra jutó rész költségét. Ez a megközelítés a tankoláson túl a fix, időszakos és gazdasági költségeket is egy közös kilométerértékbe rendezi.": ["The calculator divides total annual car costs by annual mileage, then estimates a selected trip and each paying passenger's share. This combines fixed, occasional and economic costs with fuel in one cost-per-kilometre figure.", "Der Rechner teilt die gesamten jährlichen Autokosten durch die jährliche Fahrleistung und schätzt daraus die Kosten einer gewählten Strecke sowie den Anteil je zahlendem Mitfahrer. So werden neben Kraftstoff auch fixe, unregelmäßige und wirtschaftliche Kosten in einem Kilometerwert zusammengefasst."],
    "Ellenőrzési alap:": ["Check your figures:", "Datengrundlage prüfen:"],
    "Csak azonos időszakból származó éves költséget és futást hasonlíts össze. Céges vagy adózási kilométer-elszámoláshoz ne ezt az eredményt tekintsd hivatalos díjnak; ott az aktuális jogszabály és NAV-szabály az irányadó.": ["Compare annual costs and mileage from the same period. Do not treat this result as an official rate for company or tax mileage claims; use the current legislation and NAV rules.", "Vergleiche nur Jahreskosten und Fahrleistung aus demselben Zeitraum. Nutze dieses Ergebnis nicht als offiziellen Satz für betriebliche oder steuerliche Kilometerabrechnungen; maßgeblich sind die aktuellen Rechts- und NAV-Vorschriften."],
    "Utolsó módszertani ellenőrzés:": ["Methodology last reviewed:", "Methodik zuletzt geprüft:"], "2026. szeptember 16.": ["16 September 2026", "16. September 2026"]
  });
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) {
    if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    const amount = /^(\d[\d\s\u00a0]*(?:,\d+)?) (Ft(?:\/km|\/fő)?)$/u.exec(normalized);
    if (amount) {
      const number = Number(amount[1].replace(/[\s\u00a0]/gu, "").replace(",", "."));
      const unit = amount[2] === "Ft/km" ? "HUF/km" : amount[2] === "Ft/fő" ? (language === "en" ? "HUF/person" : "HUF/Person") : "HUF";
      return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 1 }).format(number) + " " + unit;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Cost per Kilometre Calculator" : "Fehlermeldung – Kilometerkostenrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Cost per Kilometre Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/kilometerdij-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Kilometerkostenrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/kilometerdij-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

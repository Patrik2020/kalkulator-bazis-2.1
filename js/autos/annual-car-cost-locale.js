/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "eves-auto-koltseg-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="eves-auto-koltseg-kalkulator"]');
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
  const page = "eves-auto-koltseg-kalkulator";
  const dictionary = Object.freeze({
    "hu-HU": ["en-GB", "de-DE"],
    "Éves autóköltség kalkulátor | Havi és éves fenntartás": ["Annual Car Cost Calculator | Monthly and Yearly Costs", "Autokostenrechner | Monatliche und jährliche Kosten"],
    "Éves autóköltség kalkulátor üzemanyag, biztosítás, szerviz, adók, parkolás és értékvesztés összesítéséhez. Számold ki a havi és éves fenntartást.": ["Add up fuel, insurance, servicing, taxes, parking and depreciation to estimate your car's monthly and annual costs.", "Addiere Kraftstoff, Versicherung, Wartung, Steuern, Parken und Wertverlust, um die monatlichen und jährlichen Autokosten zu schätzen."],
    "Éves autóköltség kalkulátor": ["Annual Car Cost Calculator", "Rechner für jährliche Autokosten"],
    "Becsüld meg az autó éves fenntartási költségét.": ["Estimate the annual cost of owning a car.", "Schätze die jährlichen Kosten für dein Auto."],
    "Autó és közlekedés kalkulátorok": ["Car and transport calculators", "Rechner für Auto und Verkehr"],
    "Főoldal": ["Home", "Startseite"], "Autó & közlekedés": ["Cars & transport", "Auto & Verkehr"],
    "Hirdetés": ["Advertisement", "Anzeige"],
    "Számold ki az autótartás teljes éves költségét és a havi átlagos fenntartási terhet.": ["Calculate the total annual cost of owning your car and the average monthly cost.", "Berechne die gesamten jährlichen Autokosten und den monatlichen Durchschnitt."],
    "Éves autóköltség-tervező": ["Annual car cost planner", "Planer für jährliche Autokosten"],
    "A mezők tájékoztató tervezésre valók; hivatalos, gyártói vagy szolgáltatói adat esetén mindig azt használd.": ["These fields are for planning estimates. Use official, manufacturer or provider figures when available.", "Diese Eingaben dienen der Planung. Nutze verfügbare offizielle Angaben sowie Daten des Herstellers oder Anbieters."],
    "Éves futás (km)": ["Annual mileage (km)", "Jährliche Fahrleistung (km)"],
    "Fogyasztás (l/100 km)": ["Fuel consumption (L/100 km)", "Verbrauch (l/100 km)"],
    "Üzemanyagár (Ft/l)": ["Fuel price (HUF/L)", "Kraftstoffpreis (HUF/l)"],
    "Biztosítás évente": ["Annual insurance", "Versicherung pro Jahr"], "Adó és matrica": ["Tax and road toll pass", "Steuern und Vignette"],
    "Szerviz és javítás": ["Servicing and repairs", "Wartung und Reparaturen"],
    "Gumi évesített költsége": ["Annualised tyre cost", "Jährliche Reifenkosten"],
    "Parkolás évente": ["Annual parking", "Parken pro Jahr"], "Értékvesztés évente": ["Annual depreciation", "Wertverlust pro Jahr"],
    "Gazdasági költség: nem feltétlenül jelent éves készpénzkiadást.": ["An economic cost that may not be a cash expense this year.", "Ein wirtschaftlicher Kostenfaktor, der nicht unbedingt in diesem Jahr bezahlt wird."],
    "Számítás": ["Calculate", "Berechnen"],
    "Ellenőrizd a kötelező mezőket és az értékhatárokat.": ["Check the required fields and allowed ranges.", "Prüfe die Pflichtfelder und zulässigen Wertebereiche."],
    "Add meg az adatokat.": ["Enter the values.", "Gib die Werte ein."],
    "Az éves futás legyen nagyobb nullánál.": ["Annual mileage must be greater than zero.", "Die jährliche Fahrleistung muss größer als null sein."],
    "A fogyasztás és a költségek nem lehetnek negatívak.": ["Consumption and costs cannot be negative.", "Verbrauch und Kosten dürfen nicht negativ sein."],
    "A megadott adatokból nem számítható véges eredmény.": ["These values do not produce a finite result.", "Aus diesen Werten lässt sich kein endliches Ergebnis berechnen."],
    "Hibás adat.": ["Invalid input.", "Ungültige Eingabe."],
    "Üzemanyag": ["Fuel", "Kraftstoff"],
    "Egyéb éves költség + értékvesztés": ["Other annual costs + depreciation", "Weitere Jahreskosten + Wertverlust"],
    "Éves teljes gazdasági költség": ["Total annual economic cost", "Jährliche Gesamtkosten einschließlich Wertverlust"],
    "Havi átlag": ["Monthly average", "Monatlicher Durchschnitt"],
    "Teljes költség kilométerenként": ["Total cost per kilometre", "Gesamtkosten je Kilometer"],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek": ["Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Az autótartás teljes éves költségének összesítése": ["Adding up the full annual cost of owning a car", "Die gesamten jährlichen Autokosten erfassen"],
    "A kalkulátor az éves futásból, fogyasztásból és üzemanyagárból kiszámolja az éves üzemanyagköltséget, majd ehhez külön mezőkből hozzáadja a biztosítás, adó és matrica, szerviz és javítás, gumi, parkolás és értékvesztés becslését.": ["The calculator estimates annual fuel costs from mileage, consumption and fuel price. It then adds your estimates for insurance, tax and toll pass, servicing and repairs, tyres, parking and depreciation.", "Aus Fahrleistung, Verbrauch und Kraftstoffpreis schätzt der Rechner zunächst die jährlichen Kraftstoffkosten. Dazu kommen die eingegebenen Beträge für Versicherung, Steuern und Vignette, Wartung und Reparaturen, Reifen, Parken und Wertverlust."],
    "Összehasonlításnál minden autónál azonos költségkört használj. Az értékvesztés gazdasági költség, de nem feltétlenül az adott évben kifizetett készpénz; finanszírozási kamatot vagy más, külön nem szereplő tételt csak akkor hasonlíts össze, ha mindkét autónál ugyanúgy kezeled.": ["Use the same cost categories when comparing cars. Depreciation is an economic cost, though it may not involve cash paid this year. Include interest or other costs outside the form only if you treat both cars consistently.", "Vergleiche Autos mit denselben Kostenkategorien. Wertverlust ist ein wirtschaftlicher Kostenfaktor, aber keine Zahlung, die zwingend in diesem Jahr anfällt. Berücksichtige Zinsen oder weitere, hier nicht erfasste Posten nur dann, wenn du sie bei beiden Autos gleich behandelst."],
    "A számítás": ["The calculation", "Die Berechnung"],
    "A program összeadja az üzemanyag- és egyéb éves tételeket, majd tizenkettővel osztja az összeget. A kapott havi szám": ["The calculator adds the fuel and other annual costs, then divides the total by twelve. The monthly figure is an", "Der Rechner addiert Kraftstoff- und weitere Jahreskosten und teilt die Summe durch zwölf. Der Monatswert ist ein"],
    "gazdasági havi átlag": ["average monthly economic cost", "monatlicher wirtschaftlicher Durchschnitt"],
    ": ha értékvesztést is megadsz, nem azonos a tényleges havi cashflow-val vagy a bankszámláról félreteendő összeggel.": [". If you include depreciation, it differs from actual monthly cash flow or the amount you need to set aside.", ". Wenn du Wertverlust angibst, entspricht er weder dem tatsächlichen monatlichen Zahlungsfluss noch dem Betrag, den du zurücklegen musst."],
    "Példa": ["Example", "Beispiel"],
    "Ha az éves üzemanyag 600 000 Ft, a biztosítás 100 000 Ft, a szerviz 180 000 Ft, az adó és matrica 50 000 Ft, a gumi és parkolás együtt 120 000 Ft, az értékvesztés pedig 300 000 Ft, akkor a teljes gazdasági költség 1 350 000 Ft/év, azaz 112 500 Ft/hó. Ebből 300 000 Ft nem közvetlen éves készpénzkiadás, hanem becsült vagyonvesztés.": ["If annual fuel costs are HUF 600,000, insurance HUF 100,000, servicing HUF 180,000, tax and toll pass HUF 50,000, tyres and parking HUF 120,000 combined, and depreciation HUF 300,000, the total economic cost is HUF 1,350,000 a year, or HUF 112,500 a month. Of that, HUF 300,000 is estimated loss of value rather than a direct cash payment this year.", "Bei jährlichen Kraftstoffkosten von 600.000 HUF, 100.000 HUF Versicherung, 180.000 HUF Wartung, 50.000 HUF Steuern und Vignette, 120.000 HUF für Reifen und Parken zusammen sowie 300.000 HUF Wertverlust ergeben sich wirtschaftliche Gesamtkosten von 1.350.000 HUF pro Jahr bzw. 112.500 HUF pro Monat. Davon sind 300.000 HUF geschätzter Wertverlust und keine unmittelbare Zahlung in diesem Jahr."],
    "Miért fontos az értékvesztés?": ["Why does depreciation matter?", "Warum ist der Wertverlust wichtig?"],
    "Az autó piaci értékének csökkenése nem azonnali számla, mégis valós vagyonvesztés. Újabb vagy drágább autónál ez lehet az egyik legnagyobb tétel.": ["A fall in your car's market value does not generate an immediate bill, but it reduces your wealth. For a newer or more expensive car, this can be one of the largest costs.", "Ein sinkender Marktwert erzeugt keine sofortige Rechnung, verringert aber dein Vermögen. Bei einem neueren oder teureren Auto kann das einer der größten Kostenfaktoren sein."],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "Csak a tankolást számolják.": ["Counting fuel alone.", "Nur das Tanken berücksichtigen."],
    "A többéves gumit egyáltalán nem vagy teljes egészében egy évre számolják.": ["Leaving out tyres that last several years, or charging their full cost to one year.", "Mehrjährig genutzte Reifen auslassen oder ihre gesamten Kosten einem einzigen Jahr zurechnen."],
    "Váratlan javításokra nincs tartalék.": ["Not budgeting for unexpected repairs.", "Keine Rücklage für unerwartete Reparaturen bilden."],
    "Az értékvesztést és finanszírozást kihagyják.": ["Leaving out depreciation and financing costs.", "Wertverlust und Finanzierungskosten auslassen."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Havi adatokból hogyan számoljak?": ["How do I use monthly amounts?", "Wie rechne ich mit monatlichen Beträgen?"],
    "Szorozd meg a rendszeres havi tételt tizenkettővel.": ["Multiply each recurring monthly amount by twelve.", "Multipliziere jeden regelmäßigen Monatsbetrag mit zwölf."],
    "A hiteltörlesztő teljes összege költség?": ["Is the whole loan payment a cost?", "Ist die gesamte Kreditrate ein Kostenfaktor?"],
    "A tőkerész vagyonátrendezés is lehet; pénzügyi elemzésnél a kamatot és értékvesztést érdemes külön kezelni.": ["Repaying principal also builds equity in the car. For financial analysis, treat interest and depreciation separately.", "Die Tilgung baut zugleich einen Vermögenswert im Auto auf. Für eine wirtschaftliche Betrachtung solltest du Zinsen und Wertverlust getrennt behandeln."],
    "Céges autóra használható?": ["Can I use this for a company car?", "Eignet sich das für einen Firmenwagen?"],
    "Belső becslésre igen, adózási elszámoláshoz könyvelői szabályok szükségesek.": ["Yes, for internal estimates. Tax accounting requires the applicable accounting rules.", "Ja, für interne Schätzungen. Für die steuerliche Abrechnung gelten gesonderte Buchführungsregeln."],
    "Hogyan hasonlítsak két autót?": ["How should I compare two cars?", "Wie vergleiche ich zwei Autos?"],
    "Azonos éves futással és azonos költségkategóriákkal számolj.": ["Use the same annual mileage and cost categories for both cars.", "Rechne bei beiden Autos mit derselben jährlichen Fahrleistung und denselben Kostenkategorien."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Kilométerdíj kalkulátor": ["Cost per Kilometre Calculator", "Kilometerkostenrechner"],
    "Autó értékvesztés kalkulátor": ["Car Depreciation Calculator", "Autowertverlust-Rechner"],
    "Üzemanyagköltség kalkulátor": ["Fuel Cost Calculator", "Kraftstoffkostenrechner"],
    "Autó fogyasztás kalkulátor": ["Fuel Consumption Calculator", "Kraftstoffverbrauchsrechner"],
    "Utolsó tartalmi frissítés:": ["Content last reviewed:", "Inhalt zuletzt geprüft:"], "2026. augusztus 26.": ["26 August 2026", "26. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    "Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.": ["This estimate uses your consumption, price and mileage figures. Driving conditions, vehicle condition and changing rates can affect actual costs.", "Diese Schätzung beruht auf Verbrauchs-, Preis- und Fahrleistungsdaten. Fahrbedingungen, Fahrzeugzustand und geänderte Tarife können die tatsächlichen Kosten beeinflussen."],
    "A számítások módszertana és minőségbiztosítása": ["Calculation methods and quality assurance", "Berechnungsmethoden und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.": ["Found an error? Let us know.", "Fehler gefunden? Melde ihn uns."],
    "Cashflow kontra gazdasági költség": ["Cash flow versus economic cost", "Zahlungsfluss und wirtschaftliche Kosten"],
    "Az éves autóköltségben nem minden tétel ugyanúgy „fáj” a bankszámlán": ["Not every annual car cost affects your bank balance in the same way", "Nicht alle jährlichen Autokosten belasten dein Konto auf dieselbe Weise"],
    "Azonnali cashflow": ["Cash expenses this year", "Zahlungen in diesem Jahr"],
    "Tankolás, parkolás, biztosítás és szerviz tényleges pénzkiadás az adott évben.": ["Fuel, parking, insurance and servicing are cash expenses during the year.", "Tanken, Parken, Versicherung und Wartung verursachen in diesem Jahr tatsächliche Ausgaben."],
    "Időszakos nagy kiadás": ["Occasional large expenses", "Unregelmäßige größere Ausgaben"],
    "Gumi, nagy szerviz vagy műszaki vizsga ritkán jelentkezik, ezért érdemes havi céltartalékot képezni rá.": ["Tyres, major servicing and inspections are infrequent, so consider setting aside money for them each month.", "Reifen, große Wartungen und Hauptuntersuchungen fallen unregelmäßig an. Dafür lohnt es sich, monatlich Geld zurückzulegen."],
    "Nem cashflow, mégis költség": ["A cost without a cash payment", "Kosten ohne unmittelbare Zahlung"],
    "Az értékvesztés nem számla, de az autó vagyonértékének csökkenése miatt a teljes birtoklási költség része.": ["Depreciation is not a bill, but a decline in the car's value and part of the full cost of ownership.", "Wertverlust ist keine Rechnung, mindert aber den Wert des Autos und gehört damit zu den gesamten Besitzkosten."],
    "Finanszírozás": ["Financing", "Finanzierung"],
    "Hitel vagy lízing esetén a kamat és egyéb díjak külön költségréteget jelentenek.": ["With a loan or lease, interest and other charges add another layer of costs.", "Bei Kredit oder Leasing kommen Zinsen und weitere Gebühren als Kosten hinzu."],
    "Használati tipp": ["Practical tip", "Praxistipp"],
    "Készíts két nézetet: „mennyi pénzt kell félretennem idén?” és „mennyibe kerül nekem gazdaságilag egy év autózás?”. A két szám nem feltétlenül azonos.": ["Keep two figures: how much cash do I need this year, and what is a year of driving worth in total economic costs? They will not necessarily match.", "Betrachte zwei Zahlen: Wie viel Geld muss ich dieses Jahr zurücklegen, und was kostet mich ein Jahr Autofahren wirtschaftlich? Die Werte müssen nicht übereinstimmen."],
    "Mit tartalmaz az éves autóköltség-becslés?": ["What does the annual car cost estimate include?", "Was umfasst die Schätzung der jährlichen Autokosten?"],
    "Az éves futásból, fogyasztásból és literárból külön számolja az üzemanyagot, majd hozzáadja a biztosítás, adók és matrica, szerviz, gumi, parkolás és értékvesztés megadott éves összegét. Az értékvesztés gazdasági költség, ezért a havi átlag nem feltétlenül azonos a tényleges havi készpénzkiadással.": ["It calculates fuel costs from annual mileage, consumption and price per litre, then adds the annual amounts you enter for insurance, tax and toll pass, servicing, tyres, parking and depreciation. Because depreciation is an economic cost, the monthly average may differ from actual monthly cash outgoings.", "Aus Fahrleistung, Verbrauch und Literpreis berechnet der Rechner die Kraftstoffkosten und addiert Versicherung, Steuern und Vignette, Wartung, Reifen, Parken und Wertverlust. Da der Wertverlust ein wirtschaftlicher Kostenfaktor ist, muss der monatliche Durchschnitt nicht den tatsächlichen monatlichen Ausgaben entsprechen."],
    "Ellenőrzési alap:": ["Check your figures:", "Datengrundlage prüfen:"],
    "A saját autódhoz biztosítói, szerviz-, adó-, útdíj- és üzemanyagadataidat használd. Az alapértékek csak szerkeszthető példák; az aktuális költségeket a szolgáltatói és hivatalos díjtáblák alapján ellenőrizd.": ["Use your own insurance, servicing, tax, toll and fuel figures. Default values are editable examples; check current costs against provider and official rates.", "Nutze für dein Auto die eigenen Daten zu Versicherung, Wartung, Steuern, Maut und Kraftstoff. Die Standardwerte sind bearbeitbare Beispiele; prüfe aktuelle Kosten anhand der Tarife von Anbietern und Behörden."],
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
    const amount = /^(\d[\d\s\u00a0]*(?:,\d+)?) (Ft(?:\/km)?)$/u.exec(normalized);
    if (amount) {
      const number = Number(amount[1].replace(/[\s\u00a0]/gu, "").replace(",", "."));
      const unit = amount[2] === "Ft/km" ? "HUF/km" : "HUF";
      return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 1 }).format(number) + " " + unit;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Annual Car Cost Calculator" : "Fehlermeldung – Rechner für jährliche Autokosten");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Annual Car Cost Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/eves-auto-koltseg-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Jährliche Autokosten\nSeite: https://kalkulatorbazis.hu/kalkulatorok/eves-auto-koltseg-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

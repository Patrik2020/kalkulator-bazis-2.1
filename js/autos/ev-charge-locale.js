/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "ev-toltesi-koltseg-kalkulator";
  const main = doc.querySelector('main[data-batch01-calc="ev-toltesi-koltseg-kalkulator"]');
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
  const page = "ev-toltesi-koltseg-kalkulator";
  const dictionary = Object.freeze({
    "hu-HU": ["en-GB", "de-DE"],
    "Elektromos autó töltési költség kalkulátor | EV kWh és Ft": ["EV Charging Cost Calculator | kWh and HUF", "Ladekostenrechner für Elektroautos | kWh und HUF"],
    "Elektromos autó töltési költség kalkulátor": ["EV Charging Cost Calculator", "Ladekostenrechner für Elektroautos"],
    "Elektromos autó töltési költség kalkulátor. Számold ki egy út járműoldali energiaigényét, a töltési veszteséggel növelt hálózati kWh-t és a várható villamosenergia-költséget.": ["Estimate the energy your EV uses on a trip, the electricity drawn from the grid after charging losses, and the charging cost.", "Schätze den Energiebedarf deines Elektroautos für eine Fahrt, den Netzbezug einschließlich Ladeverlusten und die Stromkosten."],
    "Útköltség becslése EV-fogyasztásból, energiaárból és töltési veszteségből.": ["Estimate trip charging costs from EV consumption, electricity price and charging losses.", "Schätze die Ladekosten einer Fahrt anhand von Stromverbrauch, Preis und Ladeverlusten."],
    "Számold ki egy elektromos autó energiaigényét és töltési költségét egy útra.": ["Estimate an electric car's energy use and charging cost for a trip.", "Schätze Energiebedarf und Ladekosten eines Elektroautos für eine Fahrt."],
    "Autó és közlekedés kalkulátorok": ["Car and transport calculators", "Rechner für Auto und Verkehr"],
    "Főoldal": ["Home", "Startseite"], "Autó & közlekedés": ["Cars & transport", "Auto & Verkehr"],
    "EV töltési költség": ["EV charging cost", "Ladekosten für Elektroautos"],
    "Számold ki, mennyi villamos energiát kell a hálózatból felvenni egy úthoz, és ez várhatóan mennyibe kerül.": ["Estimate how much electricity a trip requires from the grid and what charging it may cost.", "Schätze, wie viel Strom für eine Fahrt aus dem Netz bezogen werden muss und was das Laden voraussichtlich kostet."],
    "Távolság (km)": ["Distance (km)", "Strecke (km)"],
    "Jármű fogyasztása (kWh/100 km)": ["Vehicle consumption (kWh/100 km)", "Fahrzeugverbrauch (kWh/100 km)"],
    "Villamosenergia-ár (Ft/kWh)": ["Electricity price (HUF/kWh)", "Strompreis (HUF/kWh)"],
    "Töltési veszteség (%)": ["Charging loss (%)", "Ladeverlust (%)"],
    "Eredmény:": ["Result:", "Ergebnis:"], "Hirdetés": ["Advertisement", "Anzeige"],
    "Jármű energiaigénye:": ["Energy used by the vehicle:", "Energiebedarf des Fahrzeugs:"],
    "Hálózatból felvett energia:": ["Electricity drawn from the grid:", "Strombezug aus dem Netz:"],
    "Becsült töltési költség:": ["Estimated charging cost:", "Geschätzte Ladekosten:"],
    "Energiaköltség 100 km-re:": ["Electricity cost per 100 km:", "Stromkosten je 100 km:"],
    "Távolság: adj meg érvényes számot.": ["Distance: enter a valid number.", "Strecke: Gib eine gültige Zahl ein."],
    "Távolság: az érték legyen nagyobb nullánál.": ["Distance must be greater than zero.", "Die Strecke muss größer als null sein."],
    "Fogyasztás: adj meg érvényes számot.": ["Consumption: enter a valid number.", "Verbrauch: Gib eine gültige Zahl ein."],
    "Fogyasztás: az érték legyen nagyobb nullánál.": ["Consumption must be greater than zero.", "Der Verbrauch muss größer als null sein."],
    "Villamosenergia-ár: adj meg érvényes számot.": ["Electricity price: enter a valid number.", "Strompreis: Gib eine gültige Zahl ein."],
    "Villamosenergia-ár: az érték nem lehet negatív.": ["Electricity price cannot be negative.", "Der Strompreis darf nicht negativ sein."],
    "Töltési veszteség: adj meg érvényes számot.": ["Charging loss: enter a valid number.", "Ladeverlust: Gib eine gültige Zahl ein."],
    "Töltési veszteség: az érték nem lehet negatív.": ["Charging loss cannot be negative.", "Der Ladeverlust darf nicht negativ sein."],
    "A töltési veszteség 100%-nál kisebb legyen.": ["Charging loss must be below 100%.", "Der Ladeverlust muss unter 100 % liegen."],
    "Adj meg érvényes adatokat a számításhoz.": ["Enter valid values to calculate.", "Gib gültige Werte für die Berechnung ein."],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek": ["Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Mit számol az EV töltési költség kalkulátor?": ["What does the EV charging cost calculator estimate?", "Was berechnet der Ladekostenrechner für Elektroautos?"],
    "Az elektromos autóknál érdemes különválasztani a jármű által felhasznált energiát és azt az energiát, amelyet a töltő a hálózatból felvesz. A fedélzeti fogyasztás jellemzően kWh/100 km formában jelenik meg, a villanyszámlán vagy nyilvános töltőn viszont a hálózatból átadott energia után fizetsz. A kettő között töltési veszteség lehet.": ["For an EV, it helps to distinguish energy used by the vehicle from electricity drawn from the grid during charging. The dashboard usually shows consumption in kWh/100 km, while your electricity bill or charging tariff reflects energy supplied during charging. Charging losses can account for the difference.", "Bei Elektroautos ist zwischen der im Fahrzeug genutzten Energie und dem beim Laden aus dem Netz bezogenen Strom zu unterscheiden. Der Bordcomputer zeigt den Verbrauch meist in kWh/100 km; die Stromrechnung oder der Ladetarif bezieht sich dagegen auf die beim Laden gelieferte Energie. Dazwischen können Ladeverluste entstehen."],
    "A kalkulátor a megadott távolság és fogyasztás alapján kiszámolja a jármű energiaigényét, majd a veszteségi százalékból meghatározza a szükséges hálózati energiát. Ezt szorozza meg a megadott Ft/kWh árral.": ["The calculator uses distance and consumption to estimate the vehicle's energy use, then accounts for the charging loss percentage to find the electricity needed from the grid. It multiplies that figure by the entered price per kWh in HUF.", "Aus Strecke und Verbrauch schätzt der Rechner zunächst den Energiebedarf des Fahrzeugs. Anhand des Ladeverlusts ermittelt er den nötigen Netzbezug und multipliziert ihn mit dem eingegebenen Strompreis in HUF/kWh."],
    "A számítás menete": ["How the calculation works", "So wird gerechnet"],
    "Jármű energiaigénye = távolság × fogyasztás / 100.": ["Vehicle energy use = distance × consumption / 100.", "Energiebedarf des Fahrzeugs = Strecke × Verbrauch / 100."],
    "Ha a töltési veszteség például 10%, akkor a hálózati energia nem egyszerűen 10%-kal több: a járműbe jutó energia a felvett energia 90%-a, ezért": ["If charging loss is 10%, grid electricity is not merely 10% higher: 90% of the electricity drawn reaches the vehicle. Therefore", "Bei 10 % Ladeverlust ist der Netzbezug nicht einfach um 10 % höher: 90 % des bezogenen Stroms kommen im Fahrzeug an. Daher gilt"],
    "hálózati energia = járműenergia / 0,90": ["grid electricity = vehicle energy / 0.90", "Netzbezug = Fahrzeugenergie / 0,90"],
    "Példa": ["Example", "Beispiel"],
    "100 km-en 18 kWh/100 km fogyasztással a jármű 18 kWh-t használ. 10% töltési veszteség mellett ehhez 20 kWh hálózati energia kell. 70 Ft/kWh árral a becsült költség 1 400 Ft.": ["Over 100 km at 18 kWh/100 km, the vehicle uses 18 kWh. With a 10% charging loss, that requires 20 kWh from the grid. At HUF 70/kWh, the estimated cost is HUF 1,400.", "Auf 100 km verbraucht das Fahrzeug bei 18 kWh/100 km insgesamt 18 kWh. Bei 10 % Ladeverlust werden dafür 20 kWh aus dem Netz benötigt. Bei 70 HUF/kWh liegen die geschätzten Kosten bei 1.400 HUF."],
    "Mi befolyásolja a valós költséget?": ["What affects the actual cost?", "Was beeinflusst die tatsächlichen Kosten?"],
    "A tényleges fogyasztást módosíthatja a sebesség, hőmérséklet, fűtés vagy klíma, szél, domborzat, gumiabroncs, terhelés és vezetési stílus. A töltési veszteség függhet a töltési teljesítménytől, akkumulátor-hőmérséklettől és az autó töltőrendszerétől. A nyilvános töltők díjazása pedig szolgáltatónként eltérhet, és nem mindenhol kizárólag kWh-alapú.": ["Actual consumption can change with speed, temperature, heating or air conditioning, wind, terrain, tyres, load and driving style. Charging losses depend on charging power, battery temperature and the vehicle's charging system. Public charging tariffs vary by provider and are not always based solely on kWh.", "Der tatsächliche Verbrauch hängt unter anderem von Tempo, Temperatur, Heizung oder Klimaanlage, Wind, Gelände, Reifen, Beladung und Fahrweise ab. Ladeverluste können je nach Ladeleistung, Batterietemperatur und Ladesystem variieren. Die Tarife öffentlicher Ladepunkte unterscheiden sich je nach Anbieter und werden nicht immer allein nach kWh berechnet."],
    "Otthoni és nyilvános töltés": ["Home and public charging", "Laden zu Hause und unterwegs"],
    "Otthoni töltésnél azt a tényleges egységárat érdemes megadni, amely a saját tarifád mellett az adott fogyasztásra vonatkozik. Nyilvános töltésnél az aktuális szolgáltatói kWh-díj használható, de ha indítási, percdíjas vagy egyéb tétel is van, azt a kalkulátor jelenlegi egyszerű modellje nem adja hozzá.": ["For home charging, enter the effective unit price that applies to your usage under your tariff. For public charging, use the provider's current kWh rate. This simple model does not add session fees, per-minute charges or other extras.", "Beim Laden zu Hause gib den tatsächlich geltenden Arbeitspreis deines Tarifs für diesen Verbrauch ein. Beim öffentlichen Laden kannst du den aktuellen kWh-Preis des Anbieters verwenden. Start-, Minuten- und andere Zusatzgebühren berücksichtigt dieses einfache Modell nicht."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "A fedélzeti kijelző fogyasztását írjam be?": ["Should I enter the consumption shown on the dashboard?", "Soll ich den Verbrauch aus dem Bordcomputer eingeben?"],
    "Igen, ha kWh/100 km formában adja meg a jármű átlagfogyasztását. A töltési veszteséget külön mezőben kezeli az eszköz.": ["Yes, if it shows the vehicle's average consumption in kWh/100 km. Enter charging losses separately.", "Ja, wenn der Bordcomputer den durchschnittlichen Verbrauch des Fahrzeugs in kWh/100 km angibt. Die Ladeverluste gibst du separat ein."],
    "Miért nagyobb a hálózati kWh a jármű energiaigényénél?": ["Why is grid electricity higher than vehicle energy use?", "Warum ist der Netzbezug höher als der Energiebedarf des Fahrzeugs?"],
    "Mert a töltési folyamat során az energia egy része veszteségként jelentkezik.": ["Because some energy is lost during charging.", "Weil beim Laden ein Teil der Energie als Verlust anfällt."],
    "Összehasonlíthatom benzines autóval?": ["Can I compare this with a petrol car?", "Kann ich das mit einem Benzinauto vergleichen?"],
    "Igen, a 100 km-re jutó energiaköltséget összevetheted az üzemanyag-költség kalkulátor eredményével, de a teljes fenntartási költség ennél több tételből áll.": ["Yes. You can compare the electricity cost per 100 km with the fuel cost calculator's result, but total running costs include more than energy or fuel.", "Ja. Du kannst die Stromkosten je 100 km mit dem Ergebnis des Kraftstoffkostenrechners vergleichen. Die gesamten Betriebskosten umfassen jedoch weitere Posten."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Üzemanyag költség": ["Fuel cost", "Kraftstoffkosten"], "Kilométerdíj": ["Cost per kilometre", "Kilometerkosten"], "Hatótáv kalkulátor": ["Range calculator", "Reichweitenrechner"],
    "Utolsó tartalmi frissítés:": ["Content last reviewed:", "Inhalt zuletzt geprüft:"], "2026. augusztus 21.": ["21 August 2026", "21. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    "Az eredmény becslés a megadott fogyasztásból, energiaárból és veszteségből. A tényleges töltőszámla és járműfogyasztás eltérhet, különösen nyilvános, idő- vagy eseménydíjas töltésnél.": ["This estimate uses the consumption, electricity price and charging loss you enter. Actual charging charges and vehicle consumption may differ, especially at public chargers with time-based or session fees.", "Die Schätzung beruht auf dem eingegebenen Verbrauch, Strompreis und Ladeverlust. Die tatsächlichen Ladekosten und der Fahrzeugverbrauch können abweichen, besonders bei öffentlichen Ladepunkten mit Zeit- oder Startgebühren."],
    "Számítási módszertan": ["Calculation methodology", "Berechnungsmethodik"], "Hibát találtál? Jelezd.": ["Found an error? Let us know.", "Fehler gefunden? Melde ihn."]
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
    const amount = /^(\d[\d\s\u00a0]*(?:,\d+)?) (kWh|Ft)$/u.exec(normalized);
    if (amount) {
      const unit = amount[2] === "Ft" ? "HUF" : "kWh";
      const number = Number(amount[1].replace(/[\s\u00a0]/gu, "").replace(",", "."));
      return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 2 }).format(number) + " " + unit;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – EV Charging Cost Calculator" : "Fehlermeldung – Ladekostenrechner für Elektroautos");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

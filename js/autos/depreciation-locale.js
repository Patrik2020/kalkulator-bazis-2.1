/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, main = doc.querySelector('main[data-simple-calc="auto-ertekvesztes-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const states = new WeakMap(), attributeStates = new WeakMap(), originals = new Map();
  function translateNode(node) {
    const current = node.nodeValue, state = states.get(node);
    const source = state && state.rendered === current ? state.source : current;
    const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
    if (!parts || !parts[2]) return;
    const result = parts[1] + (api.translate("auto-ertekvesztes-kalkulator", parts[2], language) ?? parts[2]) + parts[3];
    if (result !== current) node.nodeValue = result;
    if (result !== source || state) states.set(node, { source, rendered: result });
  }
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        if (node.parentElement?.tagName === "OPTION" && !node.parentElement.hasAttribute("value")) continue;
        translateNode(node);
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        if (element.closest("[contenteditable],[translate='no']")) return;
        let state = attributeStates.get(element);
        if (!state) { state = new Map(); attributeStates.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) {
          if (!element.hasAttribute(name)) continue;
          const current = element.getAttribute(name), previous = state.get(name);
          const source = previous && previous.rendered === current ? previous.source : current;
          const result = api.translate("auto-ertekvesztes-kalkulator", source, language) ?? source;
          if (result !== current) element.setAttribute(name, result);
          state.set(name, { source, rendered: result });
        }
      });
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector);
        if (!element) continue;
        const key = selector === "title" ? "title" : `${selector}:${element.getAttribute("name") || element.getAttribute("property") || ""}`;
        if (!originals.has(key)) originals.set(key, selector === "title" ? element.textContent : element.getAttribute("content"));
        const source = originals.get(key), value = api.translate("auto-ertekvesztes-kalkulator", source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.setAttribute("content", value);
      }
    } finally { rendering = false; }
  }
  document.addEventListener("kb:language-changed", event => { language = api.supported.includes(event.detail?.language) ? event.detail.language : "hu"; render(); });
  language = api.supported.includes(root.KB_SITE_LANGUAGE?.get?.()) ? root.KB_SITE_LANGUAGE.get() : "hu";
  render();
  new MutationObserver(changes => { if (changes.some(c => c.type === "childList" || c.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const dictionary = Object.freeze({
    "Autó értékvesztés kalkulátor": ["Car Depreciation Calculator", "Autowertverlust-Rechner"],
    "Becsüld meg, hogyan változhat az autó értéke az évek során.": ["Estimate how your car's value may change over time.", "Schätze, wie sich der Wert deines Autos im Laufe der Jahre verändern könnte."],
    "Autóérték-vesztési forgatókönyvek": ["Car depreciation scenarios", "Szenarien zum Wertverlust des Autos"],
    "A mezők tájékoztató tervezésre valók; hivatalos, gyártói vagy szolgáltatói adat esetén mindig azt használd.": ["These fields are for planning estimates. Use official, manufacturer or provider data whenever available.", "Diese Felder dienen der unverbindlichen Planung. Verwende stets offizielle Angaben des Herstellers oder Anbieters, sofern verfügbar."],
    "Jelenlegi érték (Ft)": ["Current value (HUF)", "Aktueller Wert (HUF)"], "Időtáv (év)": ["Time horizon (years)", "Zeitraum (Jahre)"],
    "Példa – óvatos: 1. vizsgált év (%)": ["Example — conservative: first year (%)", "Beispiel – vorsichtig: erstes betrachtetes Jahr (%)"],
    "Példa – óvatos: további évek (%)": ["Example — conservative: following years (%)", "Beispiel – vorsichtig: weitere Jahre (%)"],
    "Példa – közép: 1. vizsgált év (%)": ["Example — moderate: first year (%)", "Beispiel – mittel: erstes betrachtetes Jahr (%)"],
    "Példa – közép: további évek (%)": ["Example — moderate: following years (%)", "Beispiel – mittel: weitere Jahre (%)"],
    "Példa – erős: 1. vizsgált év (%)": ["Example — high: first year (%)", "Beispiel – stark: erstes betrachtetes Jahr (%)"],
    "Példa – erős: további évek (%)": ["Example — high: following years (%)", "Beispiel – stark: weitere Jahre (%)"],
    "Infláció / defláció (%)": ["Inflation / deflation (%)", "Inflation / Deflation (%)"],
    "A mai vásárlóérték számításához; -100% nem értelmezhető.": ["Used to estimate today's purchasing power; −100% is not meaningful.", "Zur Berechnung der heutigen Kaufkraft; −100 % ist nicht sinnvoll."],
    "Számítás": ["Calculate", "Berechnen"], "Ellenőrizd a kötelező mezőket és az értékhatárokat.": ["Check the required fields and value limits.", "Prüfe die Pflichtfelder und zulässigen Werte."],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Hirdetés": ["Advertisement", "Anzeige"], "Mentési, telepítési és megosztási műveletek": ["Bookmark, install and sharing options", "Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Mi az autó értékvesztése?": ["What is car depreciation?", "Was bedeutet Wertverlust beim Auto?"],
    "Az értékvesztés azt mutatja, mennyivel lehet kevesebbet érni egy autónak a jelenlegi értékéhez képest egy választott időtáv végén. A kalkulátor három szerkeszthető forgatókönyvet kezel: külön rátát adhatsz meg az első vizsgált évre és a további évekre, majd az infláció vagy defláció feltételezésével mai vásárlóértéket is becsül.": ["Depreciation estimates how much less a car may be worth than it is today at the end of a chosen period. The calculator compares three editable scenarios. You can enter a separate rate for the first year and for later years, then estimate today's purchasing-power equivalent using an inflation or deflation assumption.", "Der Wertverlust schätzt, wie viel weniger ein Auto am Ende eines gewählten Zeitraums im Vergleich zu seinem heutigen Wert wert sein könnte. Der Rechner vergleicht drei anpassbare Szenarien. Du kannst für das erste betrachtete Jahr und die Folgejahre unterschiedliche Raten eingeben und anhand einer Inflations- oder Deflationsannahme zusätzlich die heutige Kaufkraft schätzen."],
    "A valós használtpiac ennél sokkal összetettebb: márka, típus, hajtáslánc, futásteljesítmény, állapot, sérülések, szervizmúlt, felszereltség, piaci kereslet és a gazdasági környezet is módosíthatja az árat.": ["The used-car market is more complex: make, model, powertrain, mileage, condition, damage, service history, equipment, demand and economic conditions can all affect the price.", "Der Gebrauchtwagenmarkt ist deutlich komplexer: Marke, Modell, Antrieb, Kilometerstand, Zustand, Schäden, Wartungshistorie, Ausstattung, Nachfrage und wirtschaftliche Rahmenbedingungen beeinflussen den Preis."],
    "Hogyan számol?": ["How does it calculate?", "Wie wird gerechnet?"],
    "A számítás évről évre az aktuális, már csökkent értékre alkalmazza a rátát. Az első vizsgált évhez az első éves ráta tartozik, a további évekhez pedig a későbbi éves ráta. Ha a két ráta azonos, a modell a szokásos": ["Each year, the rate is applied to the current value after previous depreciation. The first rate applies to the first year in the period, and the later-year rate applies thereafter. If both rates are the same, the model reduces to the usual", "Die Rate wird jedes Jahr auf den bereits gesunkenen aktuellen Wert angewendet. Für das erste Jahr des Zeitraums gilt die erste Rate, für die Folgejahre die spätere Jahresrate. Sind beide Raten gleich, vereinfacht sich das Modell zur üblichen"],
    "jelenlegi érték × (1 − ráta)": ["current value × (1 − rate)", "aktueller Wert × (1 − Rate)"],
    "képletre egyszerűsödik.": ["formula.", "Formel."],
    "évek": ["years", "Jahre"], "Példa": ["Example", "Beispiel"],
    "8 000 000 Ft jelenlegi érték, 15% első vizsgált éves és 8% további éves értékvesztés mellett 3 év után a nominális becslés körülbelül 5,76 millió Ft. Ha 3,5% éves inflációval számolsz, a kalkulátor ennek mai vásárlóértékét is külön megmutatja.": ["With a current value of HUF 8,000,000, a 15% depreciation rate in the first year and 8% in subsequent years, the estimated nominal value after three years is about HUF 5.76 million. At 3.5% annual inflation, the calculator also shows its equivalent in today's purchasing power.", "Bei einem aktuellen Wert von 8.000.000 HUF, 15 % Wertverlust im ersten Jahr und 8 % in den Folgejahren beträgt der geschätzte nominale Wert nach drei Jahren etwa 5,76 Millionen HUF. Bei 3,5 % jährlicher Inflation zeigt der Rechner zusätzlich den entsprechenden Wert in heutiger Kaufkraft."],
    "Miért nem érdemes egyetlen rátához ragaszkodni?": ["Why compare more than one rate?", "Warum sollte man mehrere Raten vergleichen?"],
    "Az első években egy új autó gyakran gyorsabban veszít az értékéből, később az ütem lassulhat. Érdemes ezért több forgatókönyvet kipróbálni, például 8%, 12% és 18% éves rátával. Így nem egyetlen hamis pontosságú számot kapsz, hanem egy lehetséges tartományt.": ["A new car often loses value faster in its first years, with depreciation slowing later. Try several scenarios, such as annual rates of 8%, 12% and 18%. This gives you a possible range instead of one falsely precise figure.", "Ein Neuwagen verliert in den ersten Jahren oft schneller an Wert; später kann sich der Wertverlust verlangsamen. Vergleiche deshalb mehrere Szenarien, etwa mit jährlichen Raten von 8 %, 12 % und 18 %. So erhältst du eine mögliche Spanne statt einer scheinbar präzisen Einzelzahl."],
    "Mely tényezők tarthatják jobban az értéket?": ["Which factors may help a car retain its value?", "Welche Faktoren können den Wert eines Autos erhalten?"],
    "keresett márka és modell;": ["a sought-after make and model;", "eine gefragte Marke und ein gefragtes Modell;"], "igazolható szervizmúlt;": ["documented service history;", "nachweisbare Wartungshistorie;"], "alacsonyabb futásteljesítmény;": ["lower mileage;", "niedrigerer Kilometerstand;"], "jó műszaki és esztétikai állapot;": ["good mechanical and cosmetic condition;", "guter technischer und optischer Zustand;"], "népszerű motor- és felszereltségkombináció;": ["a popular engine and equipment combination;", "eine gefragte Motor- und Ausstattungskombination;"], "szélesebb használtpiaci kereslet.": ["broader demand on the used-car market.", "breite Nachfrage auf dem Gebrauchtwagenmarkt."],
    "Mi gyorsíthatja az értékvesztést?": ["What can accelerate depreciation?", "Was kann den Wertverlust beschleunigen?"], "baleseti előélet vagy rozsdásodás;": ["accident history or rust;", "Unfallschäden oder Rost;"], "ritka, nehezen javítható kivitel;": ["a rare version that is difficult to repair;", "eine seltene, schwer zu reparierende Ausführung;"], "magas futásteljesítmény;": ["high mileage;", "hoher Kilometerstand;"], "dráguló fenntartás vagy gyenge alkatrészellátás;": ["rising ownership costs or poor parts availability;", "steigende Unterhaltskosten oder schlechte Ersatzteilversorgung;"], "gyors technológiai változás;": ["rapid technological change;", "schneller technologischer Wandel;"], "piaci túlkínálat.": ["oversupply in the market.", "ein Überangebot auf dem Markt."],
    "Nominális és reálérték": ["Nominal value and purchasing power", "Nominalwert und Kaufkraft"],
    "A kalkulátor a nominális becslés mellett a megadott infláció vagy defláció alapján": ["Alongside the nominal estimate, the calculator uses your inflation or deflation assumption to show the scenario in", "Zusätzlich zum nominalen Schätzwert zeigt der Rechner anhand deiner Inflations- oder Deflationsannahme das Szenario in"],
    "mai vásárlóértéken": ["today's purchasing power", "heutiger Kaufkraft"],
    "is megmutatja a forgatókönyvet. Ez nem autópiaci előrejelzés: az inflációs mező csak a pénz vásárlóerejének változását választja külön a jármű feltételezett piaci értékvesztésétől.": [" as well. This is not a forecast of car prices: the inflation field separates changes in money's purchasing power from the vehicle's assumed market depreciation.", " ebenfalls. Dies ist keine Prognose für Fahrzeugpreise: Das Inflationsfeld trennt die Veränderung der Kaufkraft des Geldes vom angenommenen Wertverlust des Fahrzeugs."],
    "Értékvesztés vagy teljes autóköltség?": ["Depreciation or total car ownership cost?", "Wertverlust oder gesamte Autokosten?"],
    "Az értékvesztés csak egy költsége az autózásnak. A teljes birtoklási költséghez üzemanyag, biztosítás, adók, szerviz, gumik, parkolás, finanszírozás és váratlan javítások is hozzátartoznak.": ["Depreciation is only one cost of owning a car. Total ownership costs also include fuel, insurance, taxes, servicing, tyres, parking, financing and unexpected repairs.", "Der Wertverlust ist nur ein Teil der Autokosten. Zu den Gesamtkosten gehören auch Kraftstoff, Versicherung, Steuern, Wartung, Reifen, Parken, Finanzierung und unerwartete Reparaturen."],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"], "lineáris levonást várnak a százalékos csökkenés helyett;": ["expecting a fixed amount to be deducted instead of a percentage decline;", "einen linearen Abzug statt eines prozentualen Rückgangs anzunehmen;"], "egyetlen optimista rátából biztos jövőbeli árat következtetnek;": ["treating one optimistic rate as a certain future price;", "aus einer einzigen optimistischen Rate einen sicheren Zukunftspreis abzuleiten;"], "a nagy javítás teljes költségét automatikusan hozzáadják az eladási árhoz;": ["automatically adding the full cost of a major repair to the sale price;", "die vollen Kosten einer größeren Reparatur automatisch zum Verkaufspreis hinzuzurechnen;"], "figyelmen kívül hagyják a futásteljesítményt és az állapotot;": ["ignoring mileage and condition;", "Kilometerstand und Zustand zu ignorieren;"], "veterán vagy különleges autóra ugyanazt a modellt használják.": ["using the same model for a classic or unusual car.", "dasselbe Modell für Oldtimer oder außergewöhnliche Fahrzeuge zu verwenden."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Miért nem ugyanannyit von le minden évben?": ["Why isn't the same amount deducted each year?", "Warum wird nicht jedes Jahr derselbe Betrag abgezogen?"], "Mert százalékos módszernél az éves csökkenés mindig az aktuális értékből számolódik.": ["With a percentage-based method, each year's reduction is calculated from the current value.", "Bei einer prozentualen Methode wird der jährliche Rückgang immer vom aktuellen Wert berechnet."],
    "Új autónál ugyanaz a ráta minden évben?": ["Does a new car depreciate at the same rate every year?", "Gilt bei einem Neuwagen jedes Jahr dieselbe Rate?"], "A valóságban nem feltétlenül. Az első években gyakran gyorsabb a csökkenés, ezért több forgatókönyv jobb képet ad.": ["Not necessarily. Depreciation is often faster in the first few years, so comparing scenarios gives a more useful picture.", "Nicht unbedingt. In den ersten Jahren ist der Wertverlust oft höher. Mehrere Szenarien ergeben daher ein aussagekräftigeres Bild."],
    "Veterán autóra használható?": ["Can I use it for a classic car?", "Kann ich den Rechner für einen Oldtimer verwenden?"], "Csak nagyon korlátozottan, mert ritka autóknál az érték stabilizálódhat vagy akár emelkedhet is.": ["Only with great caution. The value of a rare car may stabilise or even rise.", "Nur sehr eingeschränkt, denn der Wert seltener Fahrzeuge kann sich stabilisieren oder sogar steigen."],
    "Lízingnél ez lesz a szerződéses maradványérték?": ["Is this the contractual residual value for a lease?", "Ist das der vertragliche Restwert beim Leasing?"], "Nem. A szerződéses maradványértéket a finanszírozó határozza meg; a kalkulátor csak saját becslésre való.": ["No. The finance provider sets the contractual residual value; this calculator is for your own estimate only.", "Nein. Der Finanzierer legt den vertraglichen Restwert fest. Dieser Rechner dient nur deiner eigenen Schätzung."],
    "Az infláció benne van?": ["Does it account for inflation?", "Wird die Inflation berücksichtigt?"], "Igen. A szerkeszthető infláció/defláció mezőből a nominális becslés mai vásárlóértékét is kiszámolja; ez külön feltételezés, nem autópiaci árgarancia.": ["Yes. The editable inflation/deflation field converts the nominal estimate into today's purchasing power. This is a separate assumption, not a guarantee of car prices.", "Ja. Das anpassbare Inflations-/Deflationsfeld rechnet den nominalen Schätzwert in heutige Kaufkraft um. Das ist eine separate Annahme und keine Garantie für Fahrzeugpreise."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"], "Éves autóköltség": ["Annual car costs", "Jährliche Autokosten"], "Kilométerdíj": ["Cost per kilometre", "Kosten pro Kilometer"], "Hitel törlesztő": ["Loan repayment", "Kreditrate"], "Üzemanyagköltség": ["Fuel costs", "Kraftstoffkosten"],
    "Utolsó tartalmi frissítés:": ["Last content update:", "Letzte inhaltliche Aktualisierung:"], "2026. augusztus 26.": ["26 August 2026", "26. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.": ["The result is an estimate based on the fuel consumption, price and trip details you enter. Driving conditions, vehicle condition and changing charges may affect the actual amount.", "Das Ergebnis ist eine Schätzung anhand deiner Angaben zu Verbrauch, Preis und Strecke. Fahrbedingungen, Fahrzeugzustand und geänderte Gebühren können den tatsächlichen Betrag beeinflussen."],
    "A számítások módszertana és minőségbiztosítása": ["Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"], "Hibát találtál? Jelezd nekünk.": ["Found an issue? Let us know.", "Einen Fehler gefunden? Sag uns Bescheid."],
    "Értékvesztés értelmezése": ["Understanding depreciation", "Wertverlust richtig einordnen"], "A százalék nem lineáris forintveszteség": ["A percentage is not a fixed yearly loss", "Ein Prozentsatz ist kein gleichbleibender Geldverlust"],
    "Csökkenő bázis": ["A declining base", "Sinkende Berechnungsbasis"], "Évi 10% értékvesztésnél minden évben az aktuális, már alacsonyabb érték 10%-a vész el.": ["At 10% annual depreciation, 10% of the current, already lower value is lost each year.", "Bei 10 % Wertverlust pro Jahr gehen jährlich 10 % des jeweils aktuellen, bereits gesunkenen Werts verloren."],
    "Piaci ugrások": ["Market shifts", "Marktveränderungen"], "Modellfrissítés, kereslet, sérülés, futásteljesítmény és szerviztörténet miatt a valós ár nem sima görbe.": ["Model updates, demand, damage, mileage and service history mean real prices do not follow a smooth curve.", "Modellwechsel, Nachfrage, Schäden, Kilometerstand und Wartungshistorie sorgen dafür, dass sich reale Preise nicht gleichmäßig entwickeln."],
    "Nominális kontra reálérték": ["Nominal value versus purchasing power", "Nominalwert und reale Kaufkraft"], "Az eladási ár forintban akár stabilnak is tűnhet, miközben az infláció miatt a vásárlóereje csökken.": ["The sale price in forints may appear stable even as inflation reduces its purchasing power.", "Der Verkaufspreis in Forint kann stabil wirken, während die Inflation seine Kaufkraft mindert."],
    "Eladási költség": ["Selling costs", "Verkaufskosten"], "Kereskedői beszámítás, hirdetés, javítás vagy felkészítés tovább csökkentheti a ténylegesen realizált összeget.": ["A dealer trade-in, listing, repairs or preparation can further reduce the amount you actually receive.", "Inzahlungnahme, Inserat, Reparaturen oder Aufbereitung können den tatsächlich erzielten Erlös weiter mindern."],
    "Hogyan modellezi az autó értékvesztését?": ["How does the calculator model car depreciation?", "Wie modelliert der Rechner den Wertverlust?"], "A modell az első vizsgált évre és a további évekre külön százalékos értékvesztési rátát enged meg, ezért nem feltételezi, hogy minden év azonos. A nominális maradványérték mellett a megadott infláció vagy defláció alapján mai vásárlóértéket is számol.": ["The model allows separate percentage depreciation rates for the first year in the period and for later years, rather than assuming the rate stays constant. Alongside the nominal residual value, it also estimates today's purchasing-power equivalent using your inflation or deflation assumption.", "Das Modell erlaubt unterschiedliche prozentuale Wertverlustraten für das erste betrachtete Jahr und die Folgejahre. Es unterstellt also keine gleichbleibende Rate. Zusätzlich zum nominalen Restwert berechnet es anhand deiner Inflations- oder Deflationsannahme einen Wert in heutiger Kaufkraft."],
    "Ellenőrzési alap:": ["Basis for the estimate:", "Grundlage der Schätzung:"], "A jövőbeli használtpiaci ár nem előrejelezhető biztosan. A rátákat saját piaci összehasonlításból vagy megbízható értékbecslési adatokból add meg; a kalkulátor a felhasználói feltételezést számolja tovább.": ["Future used-car prices cannot be predicted with certainty. Enter rates based on your own market comparisons or reliable valuation data; the calculator projects the assumptions you provide.", "Zukünftige Gebrauchtwagenpreise lassen sich nicht sicher vorhersagen. Gib Raten anhand eigener Marktvergleiche oder verlässlicher Bewertungsdaten ein; der Rechner führt deine Annahmen fort."],
    "Utolsó módszertani ellenőrzés:": ["Last methodology review:", "Letzte methodische Prüfung:"], "2026. szeptember 16.": ["16 September 2026", "16. September 2026"],
    "Add meg az adatokat.": ["Enter the values.", "Gib die Werte ein."], "Hibás adat.": ["Invalid value.", "Ungültige Eingabe."],
    "A megadott adatokból nem számítható véges eredmény.": ["A finite result cannot be calculated from the values entered.", "Aus den eingegebenen Werten lässt sich kein endliches Ergebnis berechnen."],
    "A jelenlegi érték nem lehet negatív.": ["The current value cannot be negative.", "Der aktuelle Wert darf nicht negativ sein."],
    "Az időtáv 1 és 80 év közötti egész szám legyen.": ["The time horizon must be a whole number from 1 to 80 years.", "Der Zeitraum muss eine ganze Zahl zwischen 1 und 80 Jahren sein."],
    "Az értékvesztési ráták 0 és 100% között legyenek.": ["Depreciation rates must be between 0% and 100%.", "Die Wertverlustraten müssen zwischen 0 % und 100 % liegen."],
    "Az infláció/defláció értéke legyen nagyobb -100%-nál.": ["Inflation/deflation must be greater than −100%.", "Die Inflation/Deflation muss größer als −100 % sein."],
    "Autó értékvesztés kalkulátor | Maradványérték becslése": ["Car Depreciation Calculator | Estimate Residual Value", "Autowertverlust-Rechner | Restwert schätzen"],
    "Autó értékvesztés kalkulátor vételár, éves értékcsökkenés és használati idő alapján. Készíts több forgatókönyvet a várható maradványértékre.": ["Estimate a car's residual value from its current price, annual depreciation and time in use. Compare several scenarios for its potential future value.", "Schätze den Restwert eines Autos anhand des aktuellen Preises, des jährlichen Wertverlusts und der Nutzungsdauer. Vergleiche mehrere Szenarien für den möglichen künftigen Wert."],
    "Nem.": ["No.", "Nein."], "Igen.": ["Yes.", "Ja."], "Ha a két ráta azonos, a modell a szokásos": ["If both rates are the same, the model reduces to the usual", "Sind beide Raten gleich, vereinfacht sich das Modell zur üblichen"]
  });
  const resultPrefixes = Object.freeze({
    "Óvatos nominális érték": ["Conservative nominal value", "Vorsichtiger Nominalwert"],
    "Óvatos mai vásárlóértéken": ["Conservative value in today's purchasing power", "Vorsichtiger Wert in heutiger Kaufkraft"],
    "Közép nominális érték": ["Moderate nominal value", "Mittlerer Nominalwert"],
    "Közép mai vásárlóértéken": ["Moderate value in today's purchasing power", "Mittlerer Wert in heutiger Kaufkraft"],
    "Erős nominális érték": ["High nominal value", "Starker Nominalwert"],
    "Erős mai vásárlóértéken": ["High value in today's purchasing power", "Starker Wert in heutiger Kaufkraft"]
  });
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(page, value, language) {
    if (page !== "auto-ertekvesztes-kalkulator") return null;
    if (!supported.includes(language) || language === "hu" || typeof value !== "string") return null;
    const original = value.trim(), normalized = original.replace(/\s+/gu, " "), index = language === "en" ? 0 : 1;
    if (dictionary[normalized]) return dictionary[normalized][index];
    for (const [prefix, texts] of Object.entries(resultPrefixes)) if (normalized.startsWith(prefix)) return `${texts[index]}${normalized.slice(prefix.length)}`;
    if (/^\d[\d\s.,]* Ft$/u.test(normalized)) return original.replace(/ Ft$/u, " HUF");
    return null;
  }
  const dictionaries = Object.freeze({ "auto-ertekvesztes-kalkulator": dictionary });
  return { pages: Object.freeze(Object.keys(dictionaries)), dictionaries, resultPrefixes, supported, translate };
});

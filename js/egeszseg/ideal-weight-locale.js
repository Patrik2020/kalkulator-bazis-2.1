/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "idealis-testsuly-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="idealis-testsuly-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();
  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  }
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
        const source = originals.get("errorHref") || errorLink.getAttribute("href"); originals.set("errorHref", source);
        errorLink.setAttribute("href", api.reportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ }
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content); originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "idealis-testsuly-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Tájékoztató testsúlytartomány-kalkulátor","Informative Weight Range Calculator","Orientierender Gewichtsbereichsrechner"],
    ["Tájékoztató testsúlytartomány-kalkulátor magasság alapján. BMI-tartomány és történeti magasságalapú becslés, fontos korlátokkal.","Informative weight range calculator based on height, with a BMI range, a historical height-based estimate and important limitations.","Orientierender Gewichtsbereichsrechner anhand der Körpergröße – mit BMI-Bereich, historischer größenbasierter Schätzung und wichtigen Einschränkungen."],
    ["Ideális testsúly kalkulátor","Ideal Weight Calculator","Idealgewichtsrechner"],
    ["Becsüld meg az ideális testsúlyt magasság és nem alapján.","Estimate a historical ideal-weight value from height and sex.","Schätze einen historischen Idealgewichtswert anhand von Körpergröße und Geschlecht."],
    ["Egészség és sport kalkulátorok","Health and sport calculators","Rechner für Gesundheit und Sport"],["Főoldal","Home","Startseite"],["Egészség & sport","Health & sport","Gesundheit & Sport"],
    ["Nézz meg több tájékozódási pontot magasság alapján, egyetlen kötelező „ideális” célérték helyett.","Use several height-based reference points instead of treating one ‘ideal’ figure as a mandatory target.","Nutze mehrere größenbasierte Orientierungswerte, statt einen einzigen „idealen“ Wert als verbindliches Ziel anzusehen."],
    ["Magasság (cm)","Height (cm)","Körpergröße (cm)"],["Nem","Sex","Geschlecht"],["Nő","Female","Weiblich"],["Férfi","Male","Männlich"],
    ["Történeti magasságalapú becslés:","Historical height-based estimate:","Historische größenbasierte Schätzung:"],["Történeti Devine-becslés","Historical Devine estimate","Historische Devine-Schätzung"],
    ["Az értékek legyenek nagyobbak nullánál","Values must be greater than zero.","Die Werte müssen größer als null sein."],["A Devine-képlet 152,4 cm alatt nem ad megbízható becslést","The Devine formula does not provide a reliable estimate below 152.4 cm.","Die Devine-Formel liefert unter 152,4 cm keine verlässliche Schätzung."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Miért nem egyetlen ideális testsúlyt mutatunk?","Why do we not show a single ideal weight?","Warum zeigen wir nicht ein einziges Idealgewicht?"],
    ["A testsúlyt nem lehet egyetlen, mindenkire kötelező számmal leírni. Az egészségi állapotot, a testösszetételt, az izomtömeget, a derékkörfogatot, az életkort és a hosszabb távú változást együtt érdemes értékelni.","Body weight cannot be reduced to one mandatory number for everyone. Health, body composition, muscle mass, waist circumference, age and long-term trends should be considered together.","Das Körpergewicht lässt sich nicht auf eine für alle verbindliche Zahl reduzieren. Gesundheit, Körperzusammensetzung, Muskelmasse, Taillenumfang, Alter und langfristige Entwicklung sollten gemeinsam betrachtet werden."],
    ["A felső kalkulátor a Devine-féle történeti magasságalapú becslést mutatja szemléltetésként. Az oldal alján megjelenő továbbfejlesztett tervező ehelyett a felnőtt BMI 18,5–24,9 tartományához tartozó testsúlysávot is kiszámítja.","The calculator above shows the historical height-based Devine estimate for illustration. The enhanced planner further down also calculates the weight range corresponding to an adult BMI of 18.5–24.9.","Der Rechner oben zeigt zur Veranschaulichung die historische, größenbasierte Devine-Schätzung. Der erweiterte Planer weiter unten berechnet zusätzlich den Gewichtsbereich für einen Erwachsenen-BMI von 18,5 bis 24,9."],
    ["A történeti becslés korlátai","Limitations of the historical estimate","Grenzen der historischen Schätzung"],["A Devine-képlet eredetileg nem személyre szabott fogyási cél meghatározására készült. Nem méri az izomtömeget, csontozatot, testzsírt vagy a zsigeri zsírt.","The Devine formula was not originally designed to set a personalised weight-loss target. It does not measure muscle mass, bone structure, body fat or visceral fat.","Die Devine-Formel wurde ursprünglich nicht zur Festlegung eines persönlichen Abnehmziels entwickelt. Sie misst weder Muskelmasse und Knochenbau noch Körper- oder Viszeralfett."],
    ["Példa","Example","Beispiel"],["Ugyanazon magasság mellett két ember egészséges és jól működő testsúlya eltérhet a testalkat, izomtömeg és életkor miatt.","Two people of the same height can have different healthy, functional weights because of build, muscle mass and age.","Zwei gleich große Menschen können aufgrund von Körperbau, Muskelmasse und Alter unterschiedliche gesunde und alltagstaugliche Gewichte haben."],
    ["Kinek nem megfelelő a felnőtt testsúlysáv?","Who is the adult weight range not suitable for?","Für wen ist der Gewichtsbereich für Erwachsene nicht geeignet?"],["gyermekeknek és serdülőknek","children and adolescents","Kinder und Jugendliche"],["várandósság alatt","during pregnancy","während der Schwangerschaft"],["nagy izomtömegű sportolóknak","athletes with high muscle mass","Sportler mit hoher Muskelmasse"],["jelentős ödéma vagy speciális egészségi állapot mellett","people with substantial oedema or specific medical conditions","bei ausgeprägten Ödemen oder besonderen gesundheitlichen Umständen"],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],["A tartomány fogyási cél?","Is the range a weight-loss target?","Ist der Bereich ein Abnehmziel?"],["Nem automatikusan. Személyes célhoz az egészségi állapotot, előzményeket és fenntarthatóságot is figyelembe kell venni.","Not automatically. A personal target also needs to account for health, medical history and whether it is sustainable.","Nicht automatisch. Für ein persönliches Ziel müssen auch Gesundheit, Vorgeschichte und langfristige Umsetzbarkeit berücksichtigt werden."],
    ["Az izomtömeget figyelembe veszi?","Does it account for muscle mass?","Berücksichtigt der Rechner die Muskelmasse?"],["Nem, ezért sportolóknál a testsúly és a BMI is félrevezető lehet.","No. This is why both weight and BMI can be misleading for athletes.","Nein. Deshalb können sowohl Gewicht als auch BMI bei Sportlern irreführend sein."],["Gyermekeknél használható?","Can it be used for children?","Kann er für Kinder verwendet werden?"],["Nem. Gyermekeknél életkor- és nemspecifikus növekedési görbéket kell használni.","No. Age- and sex-specific growth charts should be used for children.","Nein. Bei Kindern müssen alters- und geschlechtsspezifische Wachstumskurven verwendet werden."],["Mikor forduljak szakemberhez?","When should I consult a professional?","Wann sollte ich fachlichen Rat einholen?"],["Jelentős vagy nem szándékos testsúlyváltozás, evészavar, tartós panasz vagy krónikus betegség esetén.","If you have a substantial or unintentional weight change, an eating disorder, persistent symptoms or a chronic illness.","Bei deutlicher oder unbeabsichtigter Gewichtsveränderung, Essstörung, anhaltenden Beschwerden oder einer chronischen Erkrankung."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],["BMI kalkulátor","BMI Calculator","BMI-Rechner"],["Testzsír kalkulátor","Body Fat Calculator","Körperfettrechner"],["Derék–csípő arány","Waist-to-Hip Ratio","Taille-Hüft-Verhältnis"],["Utolsó tartalmi frissítés:","Content last reviewed:","Inhalt zuletzt geprüft:"],["2026. július 15.","15 July 2026","15. Juli 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],["Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.","The result provides general information. It is not a diagnosis and does not replace a medical assessment or personalised treatment advice.","Das Ergebnis dient der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],["A számítások módszertana és minőségbiztosítása","Calculation methods and quality assurance","Berechnungsmethoden und Qualitätssicherung"],["Hibát találtál? Jelezd nekünk.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."],
    ["„Ideális testsúly” értelmezési korlát","Limitations of the term ‘ideal weight’","Grenzen des Begriffs „Idealgewicht“"],["A képlet eredménye ne váljon automatikusan célsúllyá","Do not automatically turn the formula result into a target weight","Das Formelergebnis sollte nicht automatisch zum Zielgewicht werden"],["Történeti képletek","Historical formulas","Historische Formeln"],["Az ideális testsúly képletek egyszerű testmagasság-alapú becslések; nem mérik az izomtömeget vagy a testzsíreloszlást.","Ideal-weight formulas are simple height-based estimates; they do not measure muscle mass or body-fat distribution.","Idealgewichtsformeln sind einfache, größenbasierte Schätzungen; sie messen weder Muskelmasse noch Körperfettverteilung."],["Egészség ≠ egyetlen kilogramm","Health ≠ one number on the scale","Gesundheit ≠ eine einzige Kilogrammzahl"],["Két azonos magasságú ember egészséges testösszetétele és testsúlya eltérhet.","Two people of the same height can have different healthy body compositions and weights.","Zwei gleich große Menschen können unterschiedliche gesunde Körperzusammensetzungen und Gewichte haben."],["Jobb használat","A better way to use it","Sinnvollere Nutzung"],["Tájékozódási sávként nézd, majd vesd össze BMI-vel, derékkörfogattal, trenddel és – ha kell – szakmai értékeléssel.","Treat it as an indicative range, then compare it with BMI, waist circumference, trends and, if needed, a professional assessment.","Betrachte ihn als Orientierungsbereich und gleiche ihn anschließend mit BMI, Taillenumfang, Verlauf und bei Bedarf einer fachlichen Beurteilung ab."],
    ["Forrás és ellenőrzési alap","Source and basis for review","Quelle und Prüfgrundlage"],["CDC – BMI as a screening measure","CDC – BMI as a screening measure","CDC – BMI als Screening-Maß"],["A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.","The calculator is an informational aid and does not replace individual medical or legal advice.","Der Rechner ist eine Orientierungshilfe und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    ["Az egyetlen „ideális testsúly” helyett a felnőtt BMI 18,5–24,9 tartományához tartozó testsúlysávot mutatjuk. Ez sem alkalmas minden testalkatra.","Instead of one ‘ideal weight’, we show the weight range corresponding to an adult BMI of 18.5–24.9. This range is not suitable for every body type either.","Statt eines einzigen „Idealgewichts“ zeigen wir den Gewichtsbereich für einen Erwachsenen-BMI von 18,5 bis 24,9. Auch dieser Bereich ist nicht für jeden Körperbau geeignet."],["BMI 18,5-höz tartozó testsúly","Weight at BMI 18.5","Gewicht bei BMI 18,5"],["BMI 24,9-hez tartozó testsúly","Weight at BMI 24.9","Gewicht bei BMI 24,9"],["Tájékoztató tartomány","Indicative range","Orientierungsbereich"],["Sportolóknál, nagy izomtömegnél, várandósságban, gyermekeknél és idősebb korban a BMI-alapú testsúlysáv félrevezető lehet.","A BMI-based weight range can be misleading for athletes, people with high muscle mass, during pregnancy, for children and in older age.","Ein BMI-basierter Gewichtsbereich kann bei Sportlern, hoher Muskelmasse, in der Schwangerschaft, bei Kindern und im höheren Alter irreführend sein."],
    ["Források és módszertani ellenőrzés","Sources and methodology review","Quellen und methodische Prüfung"],["WHO – BMI classification","WHO – BMI classification","WHO – BMI-Klassifikation"],["CDC – About Adult BMI","CDC – About Adult BMI","CDC – Informationen zum BMI bei Erwachsenen"],["Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.","This page is an informational calculator. Individual decisions require guidance from a professional or an official body.","Diese Seite ist ein Informationsrechner. Für individuelle Entscheidungen sind Angaben von Fachpersonal oder einer offiziellen Stelle erforderlich."],["Módszertani frissítés:","Methodology updated:","Methodik aktualisiert:"],["Hirdetés","Advertisement","Anzeige"]
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
    const weight = /^(\d+(?:[,.]\d+)?) kg$/u.exec(normalized), range = /^(\d+(?:[,.]\d+)?)[–-](\d+(?:[,.]\d+)?) kg$/u.exec(normalized);
    const locale = language === "en" ? "en-GB" : "de-DE", format = raw => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Number(raw.replace(",", ".")));
    if (weight) return format(weight[1]) + " kg";
    if (range) return format(range[1]) + "–" + format(range[2]) + " kg";
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Weight Range Calculator" : "Fehlermeldung – Gewichtsbereichsrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en" ? "Calculator: Weight Range Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/idealis-testsuly-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Gewichtsbereichsrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/idealis-testsuly-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "derek-csipo-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="derek-csipo-kalkulator"]');
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
  const page = "derek-csipo-kalkulator";
  const dictionary = Object.freeze({
    "hu-HU": ["en-US", "de-DE"],
    "Derék–csípő arány kalkulátor | WHR értelmezéssel": ["Waist-to-Hip Ratio Calculator | WHR Explained", "Taille-Hüfte-Verhältnis-Rechner | WHR erklärt"],
    "Derék–csípő arány kalkulátor WHR becsléshez, mérési útmutatóval, korlátokkal és gyakorlati értelmezéssel.": ["Calculate your waist-to-hip ratio (WHR) with measurement guidance, limitations and practical interpretation.", "Berechne dein Taille-Hüfte-Verhältnis (WHR) mit Messanleitung, Grenzen und praktischer Einordnung."],
    "Derék–csípő arány kalkulátor WHR becsléshez, mérési útmutatóval és gyakorlati értelmezéssel.": ["Calculate your waist-to-hip ratio (WHR) with measurement guidance and practical interpretation.", "Berechne dein Taille-Hüfte-Verhältnis (WHR) mit Messanleitung und praktischer Einordnung."],
    "Derék-csípő arány kalkulátor": ["Waist-to-Hip Ratio Calculator", "Taille-Hüfte-Verhältnis-Rechner"],
    "Számold ki a derék-csípő arányt, egy egyszerű egészségi mutatót.": ["Calculate the waist-to-hip ratio, a simple measure of body proportions.", "Berechne das Taille-Hüfte-Verhältnis, ein einfaches Maß für Körperproportionen."],
    "Egészség és sport kalkulátorok": ["Health and fitness calculators", "Rechner für Gesundheit und Sport"],
    "Főoldal": ["Home", "Startseite"], "Egészség & sport": ["Health & fitness", "Gesundheit & Sport"],
    "Számold ki a WHR értéket, és nézd meg, hogyan érdemes értelmezni.": ["Calculate your WHR and learn how to interpret it.", "Berechne deinen WHR-Wert und erfahre, wie du ihn einordnen kannst."],
    "Nem": ["Sex", "Geschlecht"], "Nő": ["Woman", "Frau"], "Férfi": ["Man", "Mann"],
    "Derékbőség (cm)": ["Waist circumference (cm)", "Taillenumfang (cm)"], "Csípőbőség (cm)": ["Hip circumference (cm)", "Hüftumfang (cm)"],
    "Eredmény:": ["Result:", "Ergebnis:"], "Hirdetés": ["Advertisement", "Anzeige"],
    "Minden mezőben érvényes szám szerepeljen": ["Enter a valid number in every field.", "Gib in jedem Feld eine gültige Zahl ein."],
    "Az értékek legyenek nagyobbak nullánál": ["Values must be greater than zero.", "Die Werte müssen größer als null sein."],
    "Adj meg érvényes adatokat a számításhoz.": ["Enter valid values to calculate.", "Gib gültige Werte für die Berechnung ein."],
    "Derék-csípő arány": ["Waist-to-hip ratio", "Taille-Hüfte-Verhältnis"],
    "WHO általános küszöbéhez viszonyítva": ["Compared with the general WHO threshold", "Vergleich mit dem allgemeinen WHO-Schwellenwert"],
    "a küszöb felett": ["above the threshold", "über dem Schwellenwert"],
    "a küszöbön vagy alatta": ["at or below the threshold", "am oder unter dem Schwellenwert"],
    "Használt tájékoztató küszöb": ["Indicative threshold used", "Verwendeter Orientierungswert"],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek": ["Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Mi a derék–csípő arány?": ["What is the waist-to-hip ratio?", "Was ist das Taille-Hüfte-Verhältnis?"],
    "A WHR a derékbőség és a csípőbőség hányadosa. Egyszerű módon közelíti a testzsír eloszlását: magasabb arány általában nagyobb hasi dominanciát jelez. A mutató azonban nem diagnózis, és nem képes önmagában megmondani valakinek az egészségi állapotát.": ["WHR is waist circumference divided by hip circumference. It offers a simple indication of body fat distribution: a higher ratio generally suggests more weight around the abdomen. It is not a diagnosis and cannot determine a person's health on its own.", "Der WHR ist der Taillenumfang geteilt durch den Hüftumfang. Er gibt einen einfachen Hinweis auf die Fettverteilung: Ein höherer Wert deutet meist auf mehr Fett im Bauchbereich hin. Der Wert ist keine Diagnose und sagt allein nichts Verlässliches über den Gesundheitszustand aus."],
    "A kalkulátor nem alapján tájékoztató küszöbhöz viszonyíthatja az eredményt. Ezek csoportszintű irányszámok, amelyeket nem szabad személyre szabott kockázati ítéletként kezelni.": ["The calculator can compare the result with an indicative threshold by sex. These are group-level reference points, not a personal risk assessment.", "Der Rechner kann das Ergebnis mit einem Orientierungswert nach Geschlecht vergleichen. Diese Gruppenwerte sind keine individuelle Risikobewertung."],
    "A képlet": ["The formula", "Die Formel"],
    "Derék–csípő arány = derékbőség / csípőbőség": ["Waist-to-hip ratio = waist circumference / hip circumference", "Taille-Hüfte-Verhältnis = Taillenumfang / Hüftumfang"],
    ". Mindkét körfogatot ugyanabban az egységben kell megadni.": [". Enter both circumferences in the same unit.", ". Gib beide Umfänge in derselben Einheit an."],
    "Példa": ["Example", "Beispiel"],
    "82 cm-es derék és 100 cm-es csípő esetén a WHR 0,82. Ha ugyanennél a személynél a derék 88 cm-re nő, miközben a csípő változatlan marad, az arány 0,88 lesz.": ["With a waist of 82 cm and hips of 100 cm, WHR is 0.82. If the waist increases to 88 cm while the hips remain the same, the ratio becomes 0.88.", "Bei 82 cm Taillenumfang und 100 cm Hüftumfang beträgt der WHR 0,82. Steigt der Taillenumfang auf 88 cm und bleibt der Hüftumfang gleich, steigt der Wert auf 0,88."],
    "Hogyan mérd helyesen?": ["How should you measure?", "Wie misst du richtig?"],
    "A mérőszalag legyen vízszintes, ne csavarodjon meg.": ["Keep the tape level and untwisted.", "Halte das Maßband waagerecht und achte darauf, dass es nicht verdreht ist."],
    "A derekat nyugodt kilégzés után mérd, ne behúzott hassal.": ["Measure your waist after a relaxed exhale, without pulling in your stomach.", "Miss die Taille nach ruhigem Ausatmen, ohne den Bauch einzuziehen."],
    "A csípőt a legszélesebb ponton mérd.": ["Measure your hips at their widest point.", "Miss die Hüfte an der breitesten Stelle."],
    "A szalag simuljon a testhez, de ne vágjon be.": ["The tape should lie against the body without digging in.", "Das Maßband soll am Körper anliegen, aber nicht einschneiden."],
    "Trendkövetéshez mindig hasonló napszakban és hasonló körülmények között mérj.": ["For tracking changes, measure at a similar time of day and under similar conditions.", "Miss für die Verlaufskontrolle möglichst zur gleichen Tageszeit und unter ähnlichen Bedingungen."],
    "WHR, derékkörfogat és BMI – nem ugyanaz": ["WHR, waist circumference and BMI measure different things", "WHR, Taillenumfang und BMI messen Unterschiedliches"],
    "A BMI a testsúlyt viszonyítja a magassághoz, a derékkörfogat közvetlenül a hasi méretet mutatja, a WHR pedig a derekat a csípőhöz hasonlítja. Ugyanannál az embernél ezek eltérő képet adhatnak, ezért inkább kiegészítik, mint helyettesítik egymást.": ["BMI relates weight to height, waist circumference measures abdominal size directly, and WHR compares the waist with the hips. They can tell different stories about the same person and work best as complementary measures.", "Der BMI setzt Gewicht und Größe ins Verhältnis, der Taillenumfang misst direkt den Bauchumfang und der WHR vergleicht Taille und Hüfte. Bei derselben Person können diese Werte unterschiedliche Aspekte zeigen und ergänzen einander."],
    "Mikor lehet félrevezető?": ["When can it be misleading?", "Wann kann der Wert irreführend sein?"],
    "Terhesség, jelentős ödéma, nagyon izmos testalkat, nagy testsúlyváltozás vagy szokatlan testarányok esetén a WHR kevésbé jól értelmezhető. Az életkor, az etnikai háttér, a vérnyomás, a laboreredmények és az életmód szintén fontos részei az egészségi kockázatnak.": ["WHR may be harder to interpret during pregnancy or with substantial swelling, a very muscular build, major weight changes or unusual body proportions. Age, ethnicity, blood pressure, laboratory results and lifestyle also matter when considering health risk.", "Bei Schwangerschaft, starken Wassereinlagerungen, sehr muskulösem Körperbau, großen Gewichtsveränderungen oder ungewöhnlichen Körperproportionen ist der WHR schwerer einzuordnen. Auch Alter, ethnischer Hintergrund, Blutdruck, Laborwerte und Lebensstil sind für das Gesundheitsrisiko relevant."],
    "Miért hasznos trendként nézni?": ["Why look at the trend?", "Warum ist der Verlauf hilfreich?"],
    "Egyetlen mérésnél fontosabb lehet a változás iránya. Ha azonos körülmények között hónapokon át csökken a derékbőség és ezzel együtt a WHR, az jobban használható visszajelzés, mint egyetlen, esetleg pontatlan adat.": ["The direction of change may matter more than one measurement. If waist circumference and WHR decrease over months under comparable measurement conditions, that can be more informative than a single potentially inaccurate result.", "Die Entwicklung kann aussagekräftiger sein als eine einzelne Messung. Wenn Taillenumfang und WHR unter vergleichbaren Messbedingungen über Monate sinken, ist das hilfreicher als ein einzelner, möglicherweise ungenauer Wert."],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "Nadrágméretből próbálják meghatározni a derékkörfogatot.": ["Estimating waist circumference from trouser size.", "Den Taillenumfang aus der Hosengröße ableiten."],
    "Eltérő mérési pontot használnak minden alkalommal.": ["Measuring at a different point each time.", "Jedes Mal an einer anderen Stelle messen."],
    "A szalag ferdén fut vagy túl szoros.": ["Holding the tape at an angle or too tightly.", "Das Maßband schräg oder zu eng anlegen."],
    "A küszöbértéket diagnózisként kezelik.": ["Treating the threshold as a diagnosis.", "Den Schwellenwert als Diagnose verstehen."],
    "A változást néhány milliméteres mérési hibából következtetik.": ["Interpreting a few millimetres of measurement error as a real change.", "Wenige Millimeter Messfehler als echte Veränderung deuten."],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Jobb a WHR a BMI-nél?": ["Is WHR better than BMI?", "Ist der WHR besser als der BMI?"],
    "Nem általánosan jobb, hanem más információt ad. A kettő együtt több kontextust adhat.": ["Neither is universally better; they provide different information. Together they can add context.", "Keiner ist grundsätzlich besser; beide liefern unterschiedliche Informationen. Zusammen können sie mehr Kontext bieten."],
    "Ruhán keresztül mérjek?": ["Should I measure over clothing?", "Soll ich über der Kleidung messen?"],
    "Lehetőleg közvetlenül a testen vagy nagyon vékony ruhán.": ["Preferably directly on the body or over very thin clothing.", "Möglichst direkt am Körper oder über sehr dünner Kleidung."],
    "Milyen gyakran érdemes mérni?": ["How often should I measure?", "Wie oft sollte ich messen?"],
    "Trendkövetéshez általában néhány hetente bőven elegendő; a napi változás inkább mérési zaj lehet.": ["Every few weeks is usually enough to track a trend; day-to-day changes may be measurement noise.", "Für die Verlaufskontrolle reicht meist eine Messung alle paar Wochen; tägliche Unterschiede können Messrauschen sein."],
    "Terhesség alatt használható?": ["Can I use it during pregnancy?", "Kann ich den Rechner in der Schwangerschaft nutzen?"],
    "A megszokott WHR-értelmezés ilyenkor nem megfelelő.": ["The usual WHR interpretation does not apply during pregnancy.", "Die übliche WHR-Einordnung ist während der Schwangerschaft nicht geeignet."],
    "Sportolóknál is értelmezhető?": ["Is it useful for athletes?", "Ist der Wert auch bei Sportlern aussagekräftig?"],
    "Igen, de a testalkat és izomtömeg miatt az egyszerű küszöbértékeket óvatosan kell kezelni.": ["Yes, but body shape and muscle mass mean simple thresholds should be used with caution.", "Ja, aber wegen Körperbau und Muskelmasse sollten einfache Schwellenwerte vorsichtig interpretiert werden."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "BMI kalkulátor": ["BMI Calculator", "BMI-Rechner"], "Testzsír kalkulátor": ["Body Fat Calculator", "Körperfett-Rechner"],
    "Testsúlytartomány kalkulátor": ["Weight Range Calculator", "Gewichtsbereich-Rechner"],
    "Utolsó tartalmi frissítés:": ["Last content update:", "Letzte inhaltliche Aktualisierung:"],
    "2026. augusztus 8.": ["8 August 2026", "8. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    "Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.": ["The result provides general guidance. It is not a diagnosis and does not replace a medical examination or personalised treatment advice.", "Das Ergebnis dient der allgemeinen Orientierung. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    "A számítások módszertana és minőségbiztosítása": ["Calculation methods and quality assurance", "Berechnungsmethoden und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.": ["Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."],
    "Derék–csípő mérési protokoll": ["Waist-to-hip measurement protocol", "Messprotokoll für Taille und Hüfte"],
    "Az arányszám csak akkor összehasonlítható, ha a mérés is az": ["Compare the ratio only when measurements are comparable", "Vergleiche den Wert nur bei vergleichbarer Messung"],
    "Derék": ["Waist", "Taille"], "Csípő": ["Hips", "Hüfte"], "Trend": ["Trend", "Verlauf"],
    "A mérési pontot következetesen ugyanott válaszd meg, és a szalag ne vágjon a bőrbe.": ["Measure consistently at the same point and keep the tape from digging into the skin.", "Miss stets an derselben Stelle und achte darauf, dass das Maßband nicht in die Haut einschneidet."],
    "A csípőkörfogat legnagyobb részén végzett mérésnél tartsd a szalagot vízszintesen.": ["Keep the tape level around the widest part of your hips.", "Halte das Maßband an der breitesten Stelle der Hüfte waagerecht."],
    "Az azonos protokollal ismételt mérés többet mond a változásról, mint két eltérő technikával kapott érték.": ["Repeated measurements using the same method reveal more about change than two readings taken differently.", "Wiederholte Messungen nach derselben Methode zeigen Veränderungen besser als zwei unterschiedlich erhobene Werte."],
    "A WHO külön szakértői konzultációban foglalkozik a derékkörfogat és derék–csípő arány mérési módszerével, valamint azzal, hogy az értelmezés nem független a nemtől, kortól és etnikai háttértől.": ["A dedicated WHO expert consultation discusses how to measure waist circumference and WHR and how interpretation varies with sex, age and ethnicity.", "Eine eigene WHO-Fachkonsultation behandelt die Messung von Taillenumfang und WHR sowie Unterschiede bei der Einordnung nach Geschlecht, Alter und ethnischem Hintergrund."],
    "Forrás és ellenőrzési alap": ["Source and evidence", "Quelle und Prüfgrundlage"],
    "WHO – Waist circumference and waist-hip ratio": ["WHO – Waist circumference and waist-hip ratio", "WHO – Taillenumfang und Taille-Hüfte-Verhältnis"],
    "WHO – Waist circumference and waist–hip ratio report": ["WHO – Waist circumference and waist–hip ratio report", "WHO – Bericht zu Taillenumfang und Taille-Hüfte-Verhältnis"],
    "A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.": ["This calculator is for general guidance and does not replace an individual medical or legal decision.", "Dieser Rechner dient der Orientierung und ersetzt keine individuelle medizinische oder rechtliche Entscheidung."],
    "Derék–csípő arány nemenkénti értelmezése": ["Interpreting waist-to-hip ratio by sex", "Einordnung des Taille-Hüfte-Verhältnisses nach Geschlecht"],
    "A WHO általános kockázati küszöbei tájékozódási pontok; nem diagnózisok, és etnikai, életkori, testalkati eltérések lehetnek.": ["General WHO risk thresholds are reference points, not diagnoses; ethnicity, age and body shape can affect interpretation.", "Allgemeine WHO-Risikogrenzen dienen der Orientierung und sind keine Diagnose; ethnischer Hintergrund, Alter und Körperbau können die Einordnung beeinflussen."],
    "Értelmezés": ["Interpretation", "Einordnung"], "Nők": ["Women", "Frauen"], "Férfiak": ["Men", "Männer"],
    "WHO általános magasabb kockázati küszöb": ["General WHO threshold for higher risk", "Allgemeiner WHO-Schwellenwert für erhöhtes Risiko"],
    "0,85 felett": ["above 0.85", "über 0,85"], "0,90 felett": ["above 0.90", "über 0,90"],
    "A derekat a bordaív és csípőlapát közötti középponton mérd.": ["Measure the waist midway between the lower rib and the top of the hip bone.", "Miss die Taille in der Mitte zwischen unterem Rippenbogen und oberem Rand des Beckenkamms."],
    "Ne húzd be a hasad, és ne szorítsd meg a szalagot.": ["Do not pull in your stomach or tighten the tape.", "Zieh den Bauch nicht ein und zieh das Maßband nicht zu fest."],
    "Források és módszertani ellenőrzés": ["Sources and methodology review", "Quellen und methodische Prüfung"],
    "Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.": ["This calculator offers general guidance; individual decisions call for professional advice or official information.", "Dieser Rechner bietet allgemeine Orientierung; für individuelle Entscheidungen sind fachlicher Rat oder amtliche Angaben nötig."],
    "Módszertani frissítés:": ["Methodology updated:", "Methodik aktualisiert:"],
    "2026. július 15.": ["15 July 2026", "15. Juli 2026"]
  });
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];
    if (/^0,\d{2}$/u.test(normalized) && language === "en") return normalized.replace(",", ".");
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Waist-to-Hip Ratio Calculator" : "Fehlermeldung – Taille-Hüfte-Rechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Waist-to-Hip Ratio Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/derek-csipo-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Taille-Hüfte-Verhältnis-Rechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/derek-csipo-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

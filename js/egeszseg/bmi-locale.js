/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, pageKey = "bmi-kalkulator";
  const main = doc.querySelector("main.page-bmi");
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
  const pageKey = "bmi-kalkulator";
  const dictionary = Object.freeze({
    "BMI kalkulátor – számítás testsúly és magasság alapján":["BMI Calculator – Calculate from Weight and Height","BMI-Rechner – Berechnung anhand von Gewicht und Größe"],
    "BMI kalkulátor":["BMI Calculator","BMI-Rechner"],
    "Számold ki a testtömegindexedet testsúly és magasság alapján, majd olvasd el, hogyan érdemes értelmezni az eredményt.":["Calculate your body mass index (BMI) from your weight and height, then learn how to interpret the result.","Berechne deinen Body-Mass-Index (BMI) anhand von Gewicht und Größe und erfahre, wie du das Ergebnis einordnen kannst."],
    "Testsúly (kg)":["Weight (kg)","Gewicht (kg)"],
    "Magasság (cm)":["Height (cm)","Größe (cm)"],
    "pl. 75":["e.g. 75","z. B. 75"],
    "pl. 175":["e.g. 175","z. B. 175"],
    "BMI érték:":["BMI value:","BMI-Wert:"],
    "Sovány":["Underweight","Untergewicht"],
    "Normál testsúly":["Healthy weight","Normalgewicht"],
    "Túlsúly":["Overweight","Übergewicht"],
    "Elhízás":["Obesity","Adipositas"],
    "Hasznos volt ez a kalkulátor?":["Was this calculator useful?","War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.":["Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.":["Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehrst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek":["Bookmark, install and sharing options","Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm":["Bookmark","Lesezeichen"],
    "Telepítem":["Install","Installieren"],
    "Megosztom":["Share","Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.":["Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.":["Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    "Fontos:":["Important:","Wichtig:"],
    "A BMI általános iránymutatás. Nem veszi figyelembe az izomtömeget, a testzsírszázalékot vagy az egyéni egészségi állapotot.":["BMI is a general guide. It does not account for muscle mass, body-fat percentage or individual health status.","Der BMI ist ein allgemeiner Richtwert. Muskelmasse, Körperfettanteil und der individuelle Gesundheitszustand werden nicht berücksichtigt."],
    "Mi az a BMI?":["What is BMI?","Was ist der BMI?"],
    "A BMI (Body Mass Index, testtömegindex) egy egyszerű mutató, amely a testsúly és a magasság arányából becsüli meg, hogy a testsúly milyen tartományba esik.":["BMI (body mass index) is a simple measure that uses the relationship between weight and height to estimate a weight range.","Der BMI (Body-Mass-Index) ist eine einfache Kennzahl. Anhand des Verhältnisses von Gewicht zu Körpergröße wird ein Gewichtsbereich geschätzt."],
    "BMI képlet":["BMI formula","BMI-Formel"],
    "BMI = testsúly (kg) / magasság² (m)":["BMI = weight (kg) / height² (m)","BMI = Gewicht (kg) / Körpergröße² (m)"],
    "BMI kategóriák felnőtteknél":["BMI categories for adults","BMI-Kategorien für Erwachsene"],
    "18,5 alatt – sovány":["Below 18.5 – underweight","Unter 18,5 – Untergewicht"],
    "18,5–24,9 – normál testsúly":["18.5–24.9 – healthy weight","18,5–24,9 – Normalgewicht"],
    "25–29,9 – túlsúly":["25–29.9 – overweight","25–29,9 – Übergewicht"],
    "30 felett – elhízás":["Above 30 – obesity","Über 30 – Adipositas"],
    "Miért lehet hasznos a BMI?":["Why can BMI be useful?","Wofür kann der BMI hilfreich sein?"],
    "A BMI gyors kiindulópontot adhat testsúlyváltozás, életmódváltás vagy általános egészségi állapot áttekintésekor. Az eredményt azonban mindig más adatokkal együtt érdemes vizsgálni.":["BMI can be a quick starting point when tracking weight changes, considering lifestyle changes or reviewing general health. Interpret the result alongside other information.","Der BMI kann ein schneller Ausgangspunkt sein, um Gewichtsveränderungen, eine Lebensstiländerung oder den allgemeinen Gesundheitszustand zu betrachten. Das Ergebnis sollte jedoch immer zusammen mit anderen Angaben bewertet werden."],
    "Mire nem alkalmas a BMI?":["What is BMI not suitable for?","Wofür ist der BMI nicht geeignet?"],
    "Nem különbözteti meg az izmot és a zsírt, ezért sportolóknál, várandósság alatt, gyermekeknél és egyes egészségi állapotoknál félrevezető lehet.":["It does not distinguish muscle from fat, so it can be misleading for athletes, during pregnancy, for children and in some health conditions.","Er unterscheidet nicht zwischen Muskeln und Fett und kann daher bei Sportlern, während der Schwangerschaft, bei Kindern und bei manchen Erkrankungen irreführend sein."],
    "BMI számítás: gyors jelzés, nem diagnózis":["BMI calculation: a quick indicator, not a diagnosis","BMI-Berechnung: ein schneller Hinweis, keine Diagnose"],
    "A BMI kalkulátor a testtömegindexet számítja ki testsúly és magasság alapján. Ez egy egyszerű, gyors mutató, amely segíthet első képet kapni arról, hogy a testsúly a magassághoz képest milyen tartományba esik.":["The BMI calculator uses your weight and height to calculate body mass index. This simple, quick measure can give an initial indication of how your weight relates to your height.","Der BMI-Rechner berechnet anhand von Gewicht und Größe den Body-Mass-Index. Diese einfache, schnelle Kennzahl kann einen ersten Eindruck davon vermitteln, in welchem Verhältnis das Gewicht zur Körpergröße steht."],
    "A BMI előnye az egyszerűség, de pont ez a korlátja is. Nem látja az izomtömeget, testzsírszázalékot, életkort, nemet, egészségi állapotot vagy sportmúltat, ezért önmagában nem alkalmas diagnózisra.":["BMI is useful because it is simple, but that is also its limitation. It does not account for muscle mass, body-fat percentage, age, sex, health status or athletic history, so it cannot be used on its own to make a diagnosis.","Der Vorteil des BMI ist seine Einfachheit, die zugleich seine Grenze darstellt. Muskelmasse, Körperfettanteil, Alter, Geschlecht, Gesundheitszustand und sportliche Vorgeschichte werden nicht berücksichtigt. Allein ist er daher nicht zur Diagnose geeignet."],
    "Hogyan működik a számítás?":["How does the calculation work?","Wie funktioniert die Berechnung?"],
    "A képlet a testsúlyt kilogrammban elosztja a magasság méterben vett négyzetével. A kapott érték egy tájékoztató index, amelyet érdemes derékbőséggel, testzsírszázalékkal és életmódbeli adatokkal együtt értelmezni.":["The formula divides weight in kilograms by height in metres squared. The result is an indicative index that should be considered alongside waist circumference, body-fat percentage and lifestyle information.","Die Formel teilt das Gewicht in Kilogramm durch die Körpergröße in Metern zum Quadrat. Der Wert ist ein Richtindex und sollte zusammen mit Taillenumfang, Körperfettanteil und Lebensstil betrachtet werden."],
    "Konkrét példaszámítás":["Worked example","Konkretes Rechenbeispiel"],
    "Ha valaki 82 kg és 1,78 m magas, akkor a BMI értéke 82 / 1,78² = körülbelül 25,9. Ez önmagában csak egy jelzés, amit nem szabad orvosi következtetésként kezelni.":["For a person who weighs 82 kg and is 1.78 m tall, BMI is 82 / 1.78² = about 25.9. This is only an indicator and should not be treated as a medical conclusion.","Bei einem Gewicht von 82 kg und einer Körpergröße von 1,78 m beträgt der BMI 82 / 1,78² = etwa 25,9. Dies ist nur ein Hinweis und darf nicht als medizinische Schlussfolgerung verstanden werden."],
    "Mikor hasznos ez a kalkulátor?":["When is this calculator useful?","Wann ist dieser Rechner hilfreich?"],
    "testsúlyváltozás követésének kiindulópontjaként":["as a starting point for tracking weight changes","als Ausgangspunkt zur Beobachtung von Gewichtsveränderungen"],
    "életmódváltás előtti tájékozódáshoz":["to get an initial overview before changing your lifestyle","zur ersten Orientierung vor einer Lebensstiländerung"],
    "általános egészségi mutatóként":["as a general health indicator","als allgemeine Gesundheitskennzahl"],
    "más testösszetételi kalkulátorokkal együtt használva":["when used alongside other body-composition calculators","in Verbindung mit anderen Rechnern zur Körperzusammensetzung"],
    "Fontos tudni:":["Important to know:","Wichtig zu wissen:"],
    "Sportolóknál, várandósság alatt, gyermekeknél vagy speciális egészségügyi állapotban különösen óvatos értelmezés szükséges.":["Interpret BMI with particular caution for athletes, during pregnancy, for children or in specific health conditions.","Bei Sportlern, während der Schwangerschaft, bei Kindern oder bei besonderen gesundheitlichen Umständen ist der BMI besonders vorsichtig zu interpretieren."],
    "Gyakori kérdések":["Frequently asked questions","Häufige Fragen"],
    "A BMI diagnózis?":["Is BMI a diagnosis?","Ist der BMI eine Diagnose?"],
    "Nem. Tájékoztató jellegű mutató, nem helyettesít orvosi vizsgálatot.":["No. It is an indicative measure and does not replace a medical examination.","Nein. Er ist ein Richtwert und ersetzt keine ärztliche Untersuchung."],
    "Miért lehet félrevezető sportolóknál?":["Why can it be misleading for athletes?","Warum kann der BMI bei Sportlern irreführend sein?"],
    "Mert a nagyobb izomtömeg magasabb testsúlyt okozhat, miközben a testzsír nem feltétlenül magas.":["Because greater muscle mass can increase weight even when body fat is not necessarily high.","Weil mehr Muskelmasse das Gewicht erhöhen kann, ohne dass der Körperfettanteil unbedingt hoch ist."],
    "Milyen gyakran érdemes számolni?":["How often should I calculate it?","Wie oft sollte ich den BMI berechnen?"],
    "Életmódváltásnál havi vagy néhány heti követés hasznosabb lehet, mint a napi ingadozás figyelése.":["When changing your lifestyle, monthly or every-few-weeks tracking may be more useful than watching daily fluctuations.","Bei einer Lebensstiländerung kann eine monatliche oder mehrwöchentliche Beobachtung hilfreicher sein als tägliche Schwankungen."],
    "Gyerekeknél használható?":["Can it be used for children?","Kann der BMI bei Kindern verwendet werden?"],
    "Gyermekeknél életkor- és nemspecifikus értelmezés kell, ezért szakmai forrás vagy orvosi segítség javasolt.":["For children, interpretation must account for age and sex, so consult a professional source or a healthcare professional.","Bei Kindern muss die Interpretation Alter und Geschlecht berücksichtigen. Daher wird eine fachliche Quelle oder ärztliche Beratung empfohlen."],
    "Mivel érdemes kiegészíteni?":["What should I consider alongside it?","Womit sollte ich ihn ergänzen?"],
    "Derék-csípő aránnyal, testzsírszázalékkal, aktivitási adatokkal és az egészségi állapot figyelembevételével.":["Consider waist-to-hip ratio, body-fat percentage, activity data and overall health status as well.","Ergänze ihn um Taille-Hüft-Verhältnis, Körperfettanteil, Aktivitätsdaten und den allgemeinen Gesundheitszustand."],
    "Kapcsolódó kalkulátorok":["Related calculators","Verwandte Rechner"],
    "Kalória kalkulátor":["Calorie Calculator","Kalorienrechner"],
    "BMR kalkulátor":["BMR Calculator","Grundumsatz-Rechner"],
    "Testzsír százalék kalkulátor":["Body Fat Percentage Calculator","Körperfettanteil-Rechner"],
    "Derék-csípő arány kalkulátor":["Waist-to-Hip Ratio Calculator","Taille-Hüft-Verhältnis-Rechner"],
    "Hitelesség és számítási korlátok":["Reliability and calculation limits","Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.":["The result is for general information only. It is not a diagnosis and does not replace a medical examination or personalised treatment advice.","Das Ergebnis dient nur der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    "A számítások módszertana és minőségbiztosítása":["Calculation methodology and quality assurance","Berechnungsmethodik und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.":["Found an issue? Let us know.","Einen Fehler gefunden? Sag uns Bescheid."],
    "BMI értelmezési ellenőrző":["BMI interpretation guide","BMI-Einordnungshilfe"],
    "A BMI szűrőmutató, nem testösszetétel-vizsgálat":["BMI is a screening measure, not a body-composition assessment","Der BMI ist ein Screeningwert, keine Untersuchung der Körperzusammensetzung"],
    "Mit tud?":["What can it tell you?","Was sagt er aus?"],
    "Testsúlyt viszonyít a magasság négyzetéhez, ezért gyors népességi és felnőtt szűrőmutató.":["It relates weight to height squared, making it a quick population-level and adult screening measure.","Er setzt das Gewicht ins Verhältnis zur Körpergröße im Quadrat und ist damit ein schneller Screeningwert für Bevölkerungsgruppen und Erwachsene."],
    "Mit nem tud?":["What can't it tell you?","Was sagt er nicht aus?"],
    "Nem különíti el az izmot és a zsírt, és nem mondja meg, hol helyezkedik el a testzsír.":["It cannot distinguish muscle from fat or show where body fat is distributed.","Er unterscheidet nicht zwischen Muskeln und Fett und zeigt nicht, wo sich Körperfett befindet."],
    "Mivel egészítsd ki?":["What else should you consider?","Womit solltest du ihn ergänzen?"],
    "Trenddel, derékkörfogattal, testösszetétel-adattal és az egyéni egészségi háttérrel.":["Consider trends, waist circumference, body-composition data and individual health context.","Berücksichtige Trends, Taillenumfang, Angaben zur Körperzusammensetzung und den individuellen Gesundheitszustand."],
    "Különösen fontos:":["Especially important:","Besonders wichtig:"],
    "a felnőtt BMI-kategóriákat gyermekekre nem szabad ugyanúgy alkalmazni; életkor-specifikus értelmezés kell.":["Adult BMI categories must not be applied to children in the same way; age-specific interpretation is required.","BMI-Kategorien für Erwachsene dürfen nicht unverändert auf Kinder angewandt werden; es ist eine altersgerechte Einordnung erforderlich."],
    "Forrás és ellenőrzési alap":["Sources and review basis","Quellen und Prüfgrundlage"],
    "WHO – Obesity and overweight":["WHO – Obesity and overweight","WHO – Adipositas und Übergewicht"],
    "CDC – Adult BMI Calculator":["CDC – Adult BMI Calculator","CDC – BMI-Rechner für Erwachsene"],
    "A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.":["This calculator is an informational aid; it does not replace individual health or legal advice.","Dieser Rechner dient der Information und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    "A BMI fontos korlátai":["Important limitations of BMI","Wichtige Grenzen des BMI"],
    "A BMI népességszintű szűrőmutató, nem közvetlen testzsírmérés és nem önálló diagnózis.":["BMI is a population-level screening measure, not a direct body-fat measurement or a diagnosis on its own.","Der BMI ist ein bevölkerungsbezogener Screeningwert, keine direkte Messung des Körperfetts und keine eigenständige Diagnose."],
    "Gyermekek:":["Children:","Kinder:"],
    "életkor- és nemspecifikus percentilis szükséges.":["age- and sex-specific percentiles are needed.","alters- und geschlechtsspezifische Perzentile sind erforderlich."],
    "Sportolók:":["Athletes:","Sportler:"],
    "a nagy izomtömeg magas BMI-t okozhat.":["high muscle mass can result in a high BMI.","viel Muskelmasse kann zu einem hohen BMI führen."],
    "Várandósság:":["Pregnancy:","Schwangerschaft:"],
    "a felnőtt BMI-kategóriák nem használhatók a terhességi súlygyarapodás értékelésére.":["adult BMI categories should not be used to assess weight gain during pregnancy.","BMI-Kategorien für Erwachsene eignen sich nicht zur Beurteilung der Gewichtszunahme während der Schwangerschaft."],
    "Idősebb kor:":["Older age:","Höheres Alter:"],
    "az izomtömeg csökkenése miatt a BMI önmagában kevés.":["because muscle mass can decrease, BMI alone provides limited information.","Da die Muskelmasse abnehmen kann, ist der BMI allein nur begrenzt aussagekräftig."],
    "Érdemes a derékkörfogatot, vérnyomást, laborértékeket, fizikai állapotot és a hosszabb távú trendet együtt nézni.":["Consider waist circumference, blood pressure, laboratory results, physical condition and longer-term trends together.","Betrachte Taillenumfang, Blutdruck, Laborwerte, körperliche Verfassung und längerfristige Trends gemeinsam."],
    "Források és módszertani ellenőrzés":["Sources and methodology review","Quellen und methodische Prüfung"],
    "WHO – BMI classification":["WHO – BMI classification","WHO – BMI-Klassifikation"],
    "CDC – About Adult BMI":["CDC – About Adult BMI","CDC – Über den BMI bei Erwachsenen"],
    "Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.":["This is an informational calculator; consult a professional or official source for individual decisions.","Dieser Rechner dient der Information. Für individuelle Entscheidungen sind Fachleute oder offizielle Stellen heranzuziehen."],
    "Módszertani frissítés:":["Methodology updated:","Methodisch aktualisiert:"],
    "2026. július 15.":["15 July 2026","15. Juli 2026"],
    "Hirdetés":["Advertisement","Anzeige"]
  });
  const supported = Object.freeze(["hu","en","de"]);
  function translate(page, value, language) {
    if (page !== pageKey || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    return pair ? pair[language === "en" ? 0 : 1] : null;
  }
  const dictionaries = Object.freeze({ [pageKey]: dictionary });
  return { pages: Object.freeze([pageKey]), dictionaries, dictionary, supported, translate };
});

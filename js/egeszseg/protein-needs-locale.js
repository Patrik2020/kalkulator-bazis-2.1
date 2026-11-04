/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "feherje-szukseglet-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="feherje-szukseglet-kalkulator"]');
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
  const page = "feherje-szukseglet-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Fehérjeszükséglet kalkulátor | Napi gramm becslése","Protein Needs Calculator | Daily Grams Estimate","Proteinbedarfsrechner | Tägliche Grammmenge schätzen"],
    ["Fehérjeszükséglet kalkulátor testsúly és aktivitási cél alapján. Becsüld meg a napi fehérjebevitelt tájékoztató jelleggel.","Estimate daily protein intake from body weight and your activity goal. The result is for general guidance.","Schätze deine tägliche Proteinzufuhr anhand von Körpergewicht und Aktivitätsziel. Das Ergebnis dient der allgemeinen Orientierung."],
    ["Fehérje szükséglet kalkulátor","Protein Needs Calculator","Proteinbedarfsrechner"],
    ["Becsüld meg a napi fehérjeigényt testsúly és cél alapján.","Estimate daily protein needs from body weight and your chosen target.","Schätze den täglichen Proteinbedarf anhand von Körpergewicht und gewähltem Zielwert."],
    ["Egészség és sport kalkulátorok","Health and sport calculators","Rechner für Gesundheit und Sport"],
    ["Főoldal","Home","Startseite"],["Egészség & sport","Health & sport","Gesundheit & Sport"],
    ["Testsúly (kg)","Body weight (kg)","Körpergewicht (kg)"],["Cél szorzó (g/kg)","Target factor (g/kg)","Zielwert (g/kg)"],
    ["Eredmény:","Result:","Ergebnis:"],
    ["Napi fehérje a választott szorzóval","Daily protein at the selected factor","Tägliches Protein mit dem gewählten Faktor"],
    ["Napi fehérje a választott szorzóval:","Daily protein at the selected factor:","Tägliches Protein mit dem gewählten Faktor:"],
    ["Példa: 4 egyenlő részre osztva","Example: divided into 4 equal portions","Beispiel: auf 4 gleiche Portionen verteilt"],
    ["Példa: 4 egyenlő részre osztva:","Example: divided into 4 equal portions:","Beispiel: auf 4 gleiche Portionen verteilt:"],
    ["Az értékek legyenek nagyobbak nullánál","Values must be greater than zero.","Die Werte müssen größer als null sein."],
    ["Minden mezőben érvényes szám szerepeljen","Enter a valid number in every field.","Gib in jedem Feld eine gültige Zahl ein."],
    ["Adj meg érvényes adatokat a számításhoz.","Enter valid values for the calculation.","Gib gültige Werte für die Berechnung ein."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Mit számol a fehérjeszükséglet kalkulátor?","What does the protein needs calculator estimate?","Was schätzt der Proteinbedarfsrechner?"],
    ["A kalkulátor a testsúlyt megszorozza a választott gramm/testsúlykilogramm értékkel, így napi fehérjecélt becsül. Az eredményt négy étkezésre elosztva is megmutatja, de ez csak szemléltetés, nem kötelező étkezési ritmus.","The calculator multiplies body weight by the selected grams-per-kilogram value to estimate a daily protein target. It also shows an example split across four meals; this is an illustration, not a required eating pattern.","Der Rechner multipliziert das Körpergewicht mit dem gewählten Gramm-pro-Kilogramm-Wert und schätzt so ein tägliches Proteinziel. Zusätzlich zeigt er beispielhaft eine Verteilung auf vier Mahlzeiten; dies ist keine vorgeschriebene Essensfrequenz."],
    ["A megfelelő fehérjebevitel nem egyetlen mindenkire érvényes szám. Függhet az aktivitástól, életkortól, energia-beviteltől, edzéscéltól és egészségi állapottól.","Appropriate protein intake is not one number that suits everyone. It can depend on activity, age, energy intake, training goals and health.","Eine angemessene Proteinzufuhr ist kein einheitlicher Wert für alle. Sie kann von Aktivität, Alter, Energiezufuhr, Trainingsziel und Gesundheit abhängen."],
    ["Hogyan működik a számítás?","How does the calculation work?","Wie funktioniert die Berechnung?"],
    ["Testsúly × választott g/kg szorzó = napi fehérje gramm.","Body weight × selected g/kg factor = grams of protein per day.","Körpergewicht × gewählter g/kg-Faktor = Gramm Protein pro Tag."],
    ["Például 75 kg és 1,6 g/kg mellett 120 gramm napi cél adódik.","For example, 75 kg at 1.6 g/kg gives a daily target of 120 grams.","Bei 75 kg und 1,6 g/kg ergibt sich zum Beispiel ein Tagesziel von 120 Gramm."],
    ["Példa 75 kg testsúlynál","Example at a body weight of 75 kg","Beispiel bei 75 kg Körpergewicht"],
    ["75 kg és 1,6 g/kg mellett a napi cél 120 gramm. Négy nagyobb étkezésre egyenlően osztva ez körülbelül 30 gramm fehérje étkezésenként.","At 75 kg and 1.6 g/kg, the daily target is 120 grams. Split evenly across four main meals, this is about 30 grams of protein per meal.","Bei 75 kg und 1,6 g/kg liegt das Tagesziel bei 120 Gramm. Gleichmäßig auf vier größere Mahlzeiten verteilt sind das etwa 30 Gramm Protein pro Mahlzeit."],
    ["Miért g/testsúlykilogrammban számolunk?","Why calculate in grams per kilogram of body weight?","Warum wird in Gramm pro Kilogramm Körpergewicht gerechnet?"],
    ["A testsúlyarányos megközelítés könnyen személyre szabható, ezért gyakran használják tájékozódási pontként. Ettől még a testsúly önmagában nem írja le teljesen az igényt: testösszetétel, terhelés és energiamérleg is számít.","A body-weight-based approach is easy to adapt and is often used as a starting point. Body weight alone does not fully describe individual needs: body composition, training load and energy balance also matter.","Ein körpergewichtsbezogener Ansatz lässt sich leicht anpassen und wird häufig als Ausgangspunkt genutzt. Das Körpergewicht allein beschreibt den Bedarf jedoch nicht vollständig; auch Körperzusammensetzung, Belastung und Energiebilanz spielen eine Rolle."],
    ["Fehérje és különböző célok","Protein for different goals","Protein bei unterschiedlichen Zielen"],
    ["Általános étrend:","General diet:","Allgemeine Ernährung:"],["a fehérje az étrend egyik alapvető tápanyaga.","protein is an essential nutrient in the diet.","Protein ist ein grundlegender Nährstoff der Ernährung."],
    ["Erő- és izomépítő edzés:","Strength and muscle-building training:","Kraft- und Muskelaufbautraining:"],["a megfelelő napi bevitel és az összesített energia-bevitel együtt fontos.","both adequate daily protein and total energy intake matter.","Eine angemessene tägliche Protein- und Gesamtenergiezufuhr sind gemeinsam wichtig."],
    ["Fogyás:","Weight loss:","Gewichtsabnahme:"],["a fehérje segíthet az étrend tervezésében, de a teljes energiamérleg továbbra is meghatározó.","protein can help with diet planning, while overall energy balance remains decisive.","Protein kann bei der Ernährungsplanung helfen; die gesamte Energiebilanz bleibt jedoch entscheidend."],
    ["Állóképességi terhelés:","Endurance exercise:","Ausdauerbelastung:"],["az igény eltérhet az ülő életmódhoz képest.","needs may differ from those of a sedentary lifestyle.","Der Bedarf kann sich von dem bei überwiegend sitzender Lebensweise unterscheiden."],
    ["Nem csak a gramm számít","The total grams are not the only consideration","Nicht nur die Grammzahl zählt"],
    ["A napi összmennyiség mellett az étrend változatossága, az étkezések elosztása, a teljes kalória- és mikrotápanyag-bevitel is fontos. Állati és növényi források is beilleszthetők kiegyensúlyozott étrendbe.","Alongside the daily total, dietary variety, meal distribution and overall calorie and micronutrient intake matter. Both animal and plant sources can be part of a balanced diet.","Neben der Tagesmenge sind Vielfalt, Verteilung auf Mahlzeiten sowie die gesamte Kalorien- und Mikronährstoffzufuhr wichtig. Tierische und pflanzliche Quellen können Teil einer ausgewogenen Ernährung sein."],
    ["Mire nem alkalmas?","What is it not suitable for?","Wofür ist der Rechner nicht geeignet?"],
    ["Nem ír elő terápiás étrendet. Vesebetegség, májbetegség, várandósság, gyermekkor vagy más speciális állapot esetén a fehérjebevitelt egészségügyi szakemberrel célszerű egyeztetni.","It does not prescribe a therapeutic diet. If you have kidney or liver disease, are pregnant, are a child, or have another special condition, discuss protein intake with a healthcare professional.","Der Rechner verordnet keine therapeutische Ernährung. Bei Nieren- oder Lebererkrankungen, Schwangerschaft, im Kindesalter oder bei anderen besonderen Umständen sollte die Proteinzufuhr mit medizinischem Fachpersonal abgestimmt werden."],
    ["Gyakori hibák","Common mistakes","Häufige Fehler"],
    ["A testsúlyt fontban adják meg kilogramm helyett.","Entering body weight in pounds instead of kilograms.","Das Körpergewicht in Pfund statt Kilogramm einzugeben."],
    ["A magasabb szorzót automatikusan jobbnak tekintik.","Assuming a higher factor is automatically better.","Einen höheren Faktor automatisch für besser zu halten."],
    ["A napi célt egyetlen étkezésbe próbálják besűríteni.","Trying to fit the whole daily target into one meal.","Das gesamte Tagesziel in einer Mahlzeit unterbringen zu wollen."],
    ["Nem számolják bele a tejtermékekben, köretekben és egyéb élelmiszerekben lévő fehérjét.","Not counting protein from dairy products, side dishes and other foods.","Protein aus Milchprodukten, Beilagen und anderen Lebensmitteln nicht mitzuzählen."],
    ["A kalkulált értéket orvosi előírásként kezelik.","Treating the calculated value as medical advice.","Den berechneten Wert als medizinische Vorgabe zu behandeln."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],
    ["Fogyásnál is számít a fehérje?","Does protein matter during weight loss?","Spielt Protein beim Abnehmen eine Rolle?"],
    ["Igen, de a teljes kalóriabevitel és az étrend fenntarthatósága is lényeges.","Yes, but total calorie intake and whether the diet is sustainable also matter.","Ja, aber auch die gesamte Kalorienzufuhr und die langfristige Umsetzbarkeit der Ernährung sind wichtig."],
    ["Csak sportolóknak való?","Is this only for athletes?","Ist der Rechner nur für Sportler gedacht?"],
    ["Nem. Mindenkinek szüksége van fehérjére, de a célérték eltérhet.","No. Everyone needs protein, but the target can vary.","Nein. Jeder Mensch benötigt Protein, der Zielwert kann jedoch unterschiedlich sein."],
    ["Fehérjepor kötelező?","Is protein powder necessary?","Ist Proteinpulver notwendig?"],
    ["Nem. A napi mennyiség hagyományos élelmiszerekből is fedezhető.","No. The daily amount can also be met with ordinary foods.","Nein. Die tägliche Menge kann auch mit gewöhnlichen Lebensmitteln erreicht werden."],
    ["Miért négy étkezésre oszt?","Why does it divide the result across four meals?","Warum wird das Ergebnis auf vier Mahlzeiten verteilt?"],
    ["Ez csak szemléltetés; a napi célt más étkezési ritmusban is el lehet osztani.","This is only an illustration; the daily target can be distributed using a different meal pattern.","Das ist nur ein Beispiel; das Tagesziel kann auch auf einen anderen Mahlzeitenrhythmus verteilt werden."],
    ["Miért nem ad automatikusan egyetlen szorzót?","Why does it not select one factor automatically?","Warum wird nicht automatisch ein einzelner Faktor gewählt?"],
    ["Mert az ideális cél egyéni, és az aktivitás, életkor, testösszetétel, valamint egészségi állapot is befolyásolja.","Because an appropriate target is individual and is influenced by activity, age, body composition and health.","Weil ein passender Zielwert individuell ist und von Aktivität, Alter, Körperzusammensetzung und Gesundheit beeinflusst wird."],
    ["Módszertan","Methodology","Methodik"],
    ["A kalkulátor testsúlyarányos matematikai becslést ad. A választott g/kg érték a felhasználó bemenete, ezért az eredmény nem minősül személyre szabott táplálkozási előírásnak.","The calculator gives a mathematical estimate based on body weight. The user selects the g/kg value, so the result is not personalised nutritional advice.","Der Rechner liefert eine mathematische Schätzung auf Basis des Körpergewichts. Der g/kg-Wert wird vom Nutzer gewählt; das Ergebnis ist daher keine individuelle Ernährungsempfehlung."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],["Makró kalkulátor","Macro Calculator","Makrorechner"],["Kalória kalkulátor","Calorie Calculator","Kalorienrechner"],["BMR kalkulátor","BMR Calculator","BMR-Rechner"],
    ["Utolsó tartalmi frissítés:","Content last reviewed:","Inhalt zuletzt geprüft:"],["2026. augusztus 8.","8 August 2026","8. August 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],
    ["Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.","The result provides general information. It is not a diagnosis and does not replace a medical assessment or personalised treatment advice.","Das Ergebnis dient der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    ["A számítások módszertana és minőségbiztosítása","Calculation methods and quality assurance","Berechnungsmethoden und Qualitätssicherung"],["Hibát találtál? Jelezd nekünk.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."],
    ["Fehérjeigény – kontextuskapu","Protein needs – context check","Proteinbedarf – Kontextprüfung"],
    ["A g/kg érték előtt négy dolgot ellenőrizz","Check four things before choosing a g/kg value","Prüfe vier Punkte, bevor du einen g/kg-Wert wählst"],
    ["Milyen testsúllyal számolsz?","Which body weight are you using?","Mit welchem Körpergewicht rechnest du?"],
    ["A képlet a megadott testsúlyt használja; szélsőséges testösszetételnél egy egyszerű testsúlyszorzó félrevezetőbb lehet.","The formula uses the entered body weight. With an unusual body composition, a simple body-weight factor may be less representative.","Die Formel nutzt das eingegebene Körpergewicht. Bei ungewöhnlicher Körperzusammensetzung kann ein einfacher Gewichtsfaktor weniger aussagekräftig sein."],
    ["Mi a cél?","What is the goal?","Was ist das Ziel?"],["Általános táplálkozás, állóképesség, erősport és energiahiány nem ugyanaz a helyzet.","General nutrition, endurance exercise, strength sports and an energy deficit are different situations.","Allgemeine Ernährung, Ausdauer, Kraftsport und ein Energiedefizit sind unterschiedliche Situationen."],
    ["Mennyi a teljes energia?","What is the total energy intake?","Wie hoch ist die gesamte Energiezufuhr?"],["A fehérje nem külön életet él: az elégtelen teljes energia és a teljes étrend minősége is számít.","Protein cannot be considered in isolation: insufficient total energy and overall diet quality also matter.","Protein ist nicht isoliert zu betrachten: Auch eine unzureichende Energiezufuhr und die Qualität der gesamten Ernährung spielen eine Rolle."],
    ["Van egészségügyi korlát?","Are there health considerations?","Gibt es gesundheitliche Einschränkungen?"],["Vesebetegség, egyes anyagcsere-állapotok, terhesség vagy más speciális helyzet esetén személyre szabott tanács kellhet.","Kidney disease, some metabolic conditions, pregnancy or other special circumstances may require personalised advice.","Bei Nierenerkrankungen, bestimmten Stoffwechsellagen, Schwangerschaft oder anderen besonderen Umständen kann individuelle Beratung nötig sein."],
    ["Egészségügyi határ:","Health boundary:","Gesundheitlicher Hinweis:"],["A kalkulátor sport- és táplálkozástervezési becslés. Betegség vagy terápiás étrend esetén ne önállóan emeld a fehérjebevitelt egy kalkulált célérték alapján.","The calculator is an estimate for sport and nutrition planning. If you have an illness or follow a therapeutic diet, do not increase protein intake on your own based on a calculated target.","Der Rechner dient der Sport- und Ernährungsplanung. Bei Erkrankungen oder einer therapeutischen Ernährung solltest du die Proteinzufuhr nicht eigenständig aufgrund eines berechneten Zielwerts erhöhen."],
    ["Forrás és ellenőrzési alap","Source and basis for review","Quelle und Prüfgrundlage"],["National Academies – Dietary Reference Intakes","National Academies – Dietary Reference Intakes","National Academies – Dietary Reference Intakes"],
    ["A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.","The calculator is an informational aid and does not replace individual medical or legal advice.","Der Rechner ist eine Orientierungshilfe und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    ["Fehérjeszükséglet – tartomány és egészségügyi korlátok","Protein needs – range and health limitations","Proteinbedarf – Bereich und gesundheitliche Grenzen"],
    ["A számítás kiindulópont, nem személyre szabott étrend. A tényleges energia- és tápanyagigény az aktivitás, testösszetétel, cél, egészségi állapot és gyógyszerek miatt eltérhet.","The calculation is a starting point, not a personalised diet. Actual energy and nutrient needs can vary with activity, body composition, goals, health and medication.","Die Berechnung ist ein Ausgangspunkt und kein persönlicher Ernährungsplan. Der tatsächliche Energie- und Nährstoffbedarf kann je nach Aktivität, Körperzusammensetzung, Ziel, Gesundheit und Medikamenten abweichen."],
    ["Aktivitási leírás","Activity description","Aktivitätsbeschreibung"],["Gyakori tervezési szorzó","Common planning factor","Häufig verwendeter Planungsfaktor"],
    ["Ülő életmód, kevés mozgás","Sedentary lifestyle, little exercise","Überwiegend sitzende Lebensweise, wenig Bewegung"],["Könnyű aktivitás heti 1–3 alkalom","Light activity 1–3 times a week","Leichte Aktivität 1–3-mal pro Woche"],["Közepes aktivitás heti 3–5 alkalom","Moderate activity 3–5 times a week","Mittlere Aktivität 3–5-mal pro Woche"],["Nagy aktivitás heti 6–7 alkalom","High activity 6–7 times a week","Hohe Aktivität 6–7-mal pro Woche"],
    ["Gyermekek, várandósság és szoptatás külön szakmai megközelítést igényel.","Children, pregnancy and breastfeeding require a separate professional assessment.","Kinder, Schwangerschaft und Stillzeit erfordern eine gesonderte fachliche Beurteilung."],
    ["Evészavar, gyors fogyás, krónikus betegség vagy jelentős túlsúly esetén szakember bevonása indokolt.","Professional guidance is appropriate with an eating disorder, rapid weight loss, chronic illness or substantial excess weight.","Bei Essstörungen, schnellem Gewichtsverlust, chronischen Erkrankungen oder erheblichem Übergewicht ist fachliche Begleitung sinnvoll."],
    ["Vesebetegség, májbetegség vagy speciális diéta mellett a fehérjecél nem állítható be általános kalkulátorból.","With kidney or liver disease or a special diet, a protein target should not be set using a general calculator.","Bei Nieren- oder Lebererkrankungen oder einer speziellen Diät sollte das Proteinziel nicht mit einem allgemeinen Rechner festgelegt werden."],
    ["A túl nagy kalóriadeficit ronthatja a teljesítményt, regenerációt és tápanyagellátást.","An excessive calorie deficit can impair performance, recovery and nutrient intake.","Ein zu großes Kaloriendefizit kann Leistung, Regeneration und Nährstoffversorgung beeinträchtigen."],
    ["A kalkulátor szándékosan nem ad mindenkire érvényes „biztonságos minimumkalóriát”. Ilyen alsó határ egyéni adatok és egészségi állapot nélkül félrevezető lehet.","The calculator deliberately does not provide a universal “safe minimum calorie intake”. Such a threshold can be misleading without individual data and health context.","Der Rechner nennt bewusst keine allgemein gültige „sichere Mindestkalorienzufuhr“. Eine solche Grenze kann ohne individuelle Daten und Gesundheitskontext irreführend sein."],
    ["Források és módszertani ellenőrzés","Sources and methodology review","Quellen und methodische Prüfung"],
    ["Mifflin–St Jeor equation – original publication","Mifflin–St Jeor equation – original publication","Mifflin–St Jeor equation – original publication"],["EFSA – Dietary Reference Values","EFSA – Dietary Reference Values","EFSA – Dietary Reference Values"],["WHO – Healthy diet","WHO – Healthy diet","WHO – Healthy diet"],
    ["Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.","This page is an informational calculator. Individual decisions require guidance from a professional or an official body.","Diese Seite ist ein Informationsrechner. Für individuelle Entscheidungen sind Angaben von Fachpersonal oder einer offiziellen Stelle erforderlich."],
    ["Módszertani frissítés:","Methodology updated:","Methodik aktualisiert:"],["2026. július 15.","15 July 2026","15. Juli 2026"],
    ["Hirdetés","Advertisement","Anzeige"]
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
    const grams = /^(\d[\d\s\u00a0]*) g$/u.exec(normalized);
    if (grams) {
      const number = Number(grams[1].replace(/[\s\u00a0]/gu, ""));
      return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE").format(number) + " g";
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Protein Needs Calculator" : "Fehlermeldung – Proteinbedarfsrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Protein Needs Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/feherje-szukseglet-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Proteinbedarfsrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/feherje-szukseglet-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

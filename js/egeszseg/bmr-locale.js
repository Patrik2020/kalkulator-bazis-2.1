/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, pageKey = "bmr-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="bmr-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attributeState = new WeakMap(), originals = new Map();
  const structuredData = doc.querySelector("#kb-structured-data");
  const structuredSource = structuredData?.textContent || "";
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
      if (structuredData && structuredSource) {
        const localize = value => {
          if (typeof value === "string") return api.translate(pageKey, value, language) ?? value;
          if (Array.isArray(value)) return value.map(localize);
          if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
          return value;
        };
        try { structuredData.textContent = JSON.stringify(localize(JSON.parse(structuredSource))); } catch { /* Keep invalid source intact. */ }
      }
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
  const pageKey = "bmr-kalkulator";
  const dictionary = Object.freeze({
    "BMR kalkulátor | Alapanyagcsere becslése":["BMR Calculator | Basal Metabolic Rate Estimate","BMR-Rechner | Schätzung des Grundumsatzes"],
    "BMR kalkulátor felnőtteknek az alapanyagcsere becsléséhez életkor, nem, testsúly és magasság alapján. Az eredmény tájékoztató energiaszükséglet.":["Adult BMR calculator to estimate basal metabolic rate from age, sex, weight and height. The result is an informational estimate of energy needs.","BMR-Rechner für Erwachsene zur Schätzung des Grundumsatzes anhand von Alter, Geschlecht, Gewicht und Körpergröße. Das Ergebnis ist ein Richtwert für den Energiebedarf."],
    "BMR kalkulátor":["BMR Calculator","BMR-Rechner"],
    "hu-HU":["en-US","de-DE"],
    "Főoldal":["Home","Startseite"], "Egészség & sport":["Health & fitness","Gesundheit & Fitness"],
    "Egészség és sport kalkulátorok":["Health and fitness calculators","Rechner für Gesundheit und Fitness"],
    "Számold ki az alapanyagcserédet Mifflin-St Jeor képlettel.":["Estimate your basal metabolic rate with the Mifflin–St Jeor equation.","Schätze deinen Grundumsatz mit der Mifflin–St-Jeor-Formel."],
    "BMR-kalkulátor felnőtteknek: alapanyagcsere-becslés Mifflin–St Jeor képlettel, testsúly, magasság, életkor és nem alapján.":["Adult BMR calculator: estimate basal metabolic rate with the Mifflin–St Jeor equation using weight, height, age and sex.","BMR-Rechner für Erwachsene: Schätzung des Grundumsatzes mit der Mifflin–St-Jeor-Formel anhand von Gewicht, Größe, Alter und Geschlecht."],
    "Felnőtteknek készült becslés a Mifflin–St Jeor képlettel, testsúly, magasság, életkor és nem alapján.":["An estimate for adults using the Mifflin–St Jeor equation, based on weight, height, age and sex.","Eine Schätzung für Erwachsene nach der Mifflin–St-Jeor-Formel auf Grundlage von Gewicht, Größe, Alter und Geschlecht."],
    "Nem":["Sex","Geschlecht"], "Nő":["Female","Weiblich"], "Férfi":["Male","Männlich"],
    "Testsúly (kg)":["Weight (kg)","Gewicht (kg)"], "Magasság (cm)":["Height (cm)","Größe (cm)"], "Életkor":["Age","Alter"],
    "Eredmény:":["Result:","Ergebnis:"], "Az értékek legyenek nagyobbak nullánál":["All values must be greater than zero.","Alle Werte müssen größer als null sein."],
    "A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk":["This page uses the Mifflin–St Jeor estimate for adults (18+).","Auf dieser Seite wird die Mifflin–St-Jeor-Schätzung für Erwachsene (ab 18 Jahren) verwendet."],
    "A megadott adatokból nem adható életszerű becslés":["The entered values do not produce a plausible estimate.","Mit den eingegebenen Werten ist keine plausible Schätzung möglich."],
    "Becsült nyugalmi energiaigény":["Estimated resting energy expenditure","Geschätzter Ruheenergieverbrauch"],
    "Példa: 1,375-ös aktivitási szorzóval":["Example using an activity multiplier of 1.375","Beispiel mit einem Aktivitätsfaktor von 1,375"],
    "Hasznos volt ez a kalkulátor?":["Was this calculator useful?","War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.":["Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.":["Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehrst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek":["Bookmark, install and sharing options","Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm":["Bookmark","Lesezeichen"], "Telepítem":["Install","Installieren"], "Megosztom":["Share","Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.":["Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.":["Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    "Mi az a BMR?":["What is BMR?","Was ist der BMR?"],
    "A BMR, vagyis alapanyagcsere azt a napi energiamennyiséget közelíti, amelyet a szervezet teljes nyugalomban az alapvető életműködések fenntartására használ fel. Ide tartozik többek között a légzés, a keringés és a testhőmérséklet fenntartása.":["BMR, or basal metabolic rate, estimates the amount of energy your body uses each day at complete rest to maintain essential functions, including breathing, circulation and body temperature.","Der BMR (Grundumsatz) schätzt die Energiemenge, die der Körper täglich in völliger Ruhe zur Aufrechterhaltung lebenswichtiger Funktionen verbraucht, etwa für Atmung, Kreislauf und Körpertemperatur."],
    "A BMR nem azonos a tényleges napi kalóriaszükséglettel. A járás, munka, sport, emésztés és minden más aktivitás további energiát igényel, ezért a teljes napi energiafelhasználás jellemzően magasabb.":["BMR is not the same as your actual daily calorie requirement. Walking, work, exercise, digestion and other activity all use additional energy, so total daily energy expenditure is usually higher.","Der BMR entspricht nicht dem tatsächlichen täglichen Kalorienbedarf. Gehen, Arbeit, Sport, Verdauung und andere Aktivitäten verbrauchen zusätzliche Energie; daher liegt der gesamte tägliche Energieverbrauch meist höher."],
    "Milyen képletet használunk?":["Which equation do we use?","Welche Formel verwenden wir?"],
    "A kalkulátor a Mifflin–St Jeor képletet használja, amely a testsúly, magasság, életkor és nem alapján készít becslést. A képlet népességi átlagokon alapul, ezért egyéni szinten eltérés természetes.":["The calculator uses the Mifflin–St Jeor equation to estimate BMR from weight, height, age and sex. It is based on population averages, so individual results can vary.","Der Rechner verwendet die Mifflin–St-Jeor-Formel und schätzt den BMR anhand von Gewicht, Größe, Alter und Geschlecht. Die Formel basiert auf Bevölkerungsdurchschnitten; individuelle Abweichungen sind daher normal."],
    "Példa":["Example","Beispiel"],
    "Egy 35 éves, 75 kg-os, 175 cm magas férfi becsült BMR-je körülbelül 1 674 kcal/nap. Ez nem azt jelenti, hogy ennyit „kell ennie”, hanem azt, hogy a nyugalmi energiafelhasználás becslése ekörül lehet.":["For a 35-year-old man who weighs 75 kg and is 175 cm tall, estimated BMR is about 1,674 kcal/day. This does not mean he “should eat” that amount; it is an estimate of energy use at rest.","Bei einem 35-jährigen Mann mit 75 kg Körpergewicht und 175 cm Körpergröße liegt der geschätzte BMR bei etwa 1.674 kcal/Tag. Das bedeutet nicht, dass er „so viel essen sollte“; es ist eine Schätzung des Energieverbrauchs in Ruhe."],
    "BMR és TDEE: mi a különbség?":["BMR and TDEE: what is the difference?","BMR und TDEE: worin liegt der Unterschied?"],
    "A BMR a nyugalmi alapérték. A TDEE a teljes napi energiafelhasználás becslése, amely már az aktivitást is figyelembe veszi. Két azonos BMR-rel rendelkező ember napi energiaszükséglete jelentősen eltérhet, ha egyikük ülőmunkát végez, a másik pedig fizikailag aktív.":["BMR is the baseline at rest. TDEE estimates total daily energy expenditure, including activity. Two people with the same BMR can have very different daily energy needs if one has a desk job and the other is physically active.","Der BMR ist der Ruhewert. Der TDEE schätzt den gesamten täglichen Energieverbrauch einschließlich Aktivität. Zwei Personen mit gleichem BMR können einen sehr unterschiedlichen Tagesbedarf haben, wenn eine überwiegend sitzt und die andere körperlich aktiv ist."],
    "Mi befolyásolhatja a valós értéket?":["What can affect the actual value?","Was kann den tatsächlichen Wert beeinflussen?"],
    "testösszetétel és izomtömeg;":["body composition and muscle mass;","Körperzusammensetzung und Muskelmasse;"], "életkor és nem;":["age and sex;","Alter und Geschlecht;"],
    "hormonális és egészségi állapot;":["hormonal and health status;","Hormonhaushalt und Gesundheitszustand;"],
    "hosszabb távú energiahiány vagy testsúlyváltozás;":["long-term energy deficit or weight change;","längerfristiges Energiedefizit oder Gewichtsveränderungen;"],
    "egyéni anyagcsere-különbségek.":["individual metabolic differences.","individuelle Stoffwechselunterschiede."],
    "Hogyan használd értelmesen?":["How should you use the estimate?","Wie solltest du die Schätzung sinnvoll nutzen?"],
    "A BMR jó kiindulópont lehet kalória- és testsúlytervezéshez, de nem érdemes egyetlen számként kezelni. Hasznosabb, ha a becslést több héten át összeveted a tényleges testsúlyváltozással és aktivitással.":["BMR can be a useful starting point for calorie and weight planning, but it should not be treated as a definitive number. Compare the estimate with your actual weight trends and activity over several weeks.","Der BMR kann ein sinnvoller Ausgangspunkt für die Kalorien- und Gewichtsplanung sein, sollte aber nicht als feste Zahl verstanden werden. Aussagekräftiger ist es, die Schätzung über mehrere Wochen mit der tatsächlichen Gewichtsentwicklung und Aktivität zu vergleichen."],
    "Mire nem alkalmas?":["What is it not suitable for?","Wofür ist die Schätzung nicht geeignet?"],
    "Nem diagnosztikai eszköz, nem alkalmas gyermekek, várandósság vagy speciális egészségi állapotok személyre szabott energiaigényének meghatározására. Jelentős fogyás, hízás vagy betegség esetén szakember bevonása célszerű.":["This is not a diagnostic tool and should not be used to determine individual energy needs for children, pregnancy or specific health conditions. Consult a qualified professional about significant weight loss or gain, or illness.","Dies ist kein Diagnoseinstrument und eignet sich nicht zur Bestimmung des individuellen Energiebedarfs von Kindern, während der Schwangerschaft oder bei besonderen Gesundheitszuständen. Bei erheblicher Gewichtsabnahme oder -zunahme sowie bei Krankheit sollte fachlicher Rat eingeholt werden."],
    "Gyakori hibák":["Common mistakes","Häufige Fehler"],
    "A BMR-t közvetlen fogyási célkalóriának tekintik.":["Treating BMR as a direct calorie target for weight loss.","Den BMR direkt als Kalorienziel zum Abnehmen zu verwenden."],
    "Túl magas aktivitási szorzóval számolnak.":["Using an activity multiplier that is too high.","Mit einem zu hohen Aktivitätsfaktor zu rechnen."],
    "Rövid távú testsúlyingadozásból következtetnek.":["Drawing conclusions from short-term weight fluctuations.","Aus kurzfristigen Gewichtsschwankungen Schlüsse zu ziehen."],
    "A képletet pontos mérésnek, nem becslésnek tekintik.":["Treating the equation as an exact measurement rather than an estimate.","Die Formel als genaue Messung statt als Schätzung zu betrachten."],
    "Gyermekre vagy várandósságra felnőtt képletet alkalmaznak.":["Applying an adult equation to a child or pregnancy.","Eine Formel für Erwachsene auf Kinder oder eine Schwangerschaft anzuwenden."],
    "Gyakori kérdések":["Frequently asked questions","Häufige Fragen"],
    "A BMR alatt kell ennem fogyáshoz?":["Should I eat below my BMR to lose weight?","Muss ich zum Abnehmen weniger als meinen BMR essen?"],
    "Nem ez az általános cél. A fenntartható energiamérleg egyéni, a BMR pedig csak nyugalmi becslés.":["That is not a general goal. A sustainable energy balance is individual, and BMR is only an estimate at rest.","Das ist kein allgemeines Ziel. Eine nachhaltige Energiebilanz ist individuell; der BMR ist lediglich eine Schätzung des Ruheverbrauchs."],
    "Miért más az okosórám értéke?":["Why is my smartwatch's figure different?","Warum weicht der Wert meiner Smartwatch ab?"],
    "Más képletet, aktivitási adatot, pulzust vagy saját algoritmust használhat.":["It may use a different equation, activity data, heart rate or proprietary algorithm.","Sie kann eine andere Formel, Aktivitätsdaten, die Herzfrequenz oder einen eigenen Algorithmus verwenden."],
    "Izomtömeget figyelembe vesz?":["Does it account for muscle mass?","Wird die Muskelmasse berücksichtigt?"],
    "Közvetlenül nem, ezért nagyon izmos testalkatnál nagyobb eltérés lehet.":["Not directly, so estimates may be less accurate for people with very high muscle mass.","Nicht direkt. Bei sehr hoher Muskelmasse kann die Schätzung daher stärker abweichen."],
    "Milyen gyakran számoljam újra?":["How often should I recalculate it?","Wie oft sollte ich neu rechnen?"],
    "Jelentősebb testsúlyváltozáskor érdemes frissíteni.":["Update it after a significant change in weight.","Bei einer deutlichen Gewichtsveränderung sollte die Schätzung aktualisiert werden."],
    "Miért csak becslés?":["Why is it only an estimate?","Warum ist es nur eine Schätzung?"],
    "Mert a valódi energiafelhasználást egyéni élettani tényezők is befolyásolják, amelyeket egy egyszerű képlet nem mér.":["Because actual energy expenditure is affected by individual physiological factors that a simple equation cannot measure.","Der tatsächliche Energieverbrauch wird auch von individuellen physiologischen Faktoren beeinflusst, die eine einfache Formel nicht erfasst."],
    "Módszertan":["Methodology","Methodik"],
    "A kalkulátor a széles körben használt Mifflin–St Jeor egyenletet alkalmazza. Az eredményt tájékoztató becslésként kezeld, nem orvosi vagy dietetikai előírásként.":["The calculator uses the widely used Mifflin–St Jeor equation. Treat the result as an informational estimate, not medical or dietary advice.","Der Rechner verwendet die weit verbreitete Mifflin–St-Jeor-Formel. Das Ergebnis ist ein Richtwert und keine medizinische oder ernährungsfachliche Vorgabe."],
    "Kapcsolódó kalkulátorok":["Related calculators","Verwandte Rechner"],
    "Kalória kalkulátor":["Calorie Calculator","Kalorienrechner"], "Makró kalkulátor":["Macro Calculator","Makro-Rechner"], "Fehérjeigény":["Protein Needs","Proteinbedarf"],
    "Utolsó tartalmi frissítés:":["Last content update:","Letzte inhaltliche Aktualisierung:"], "2026. augusztus 8.":["8 August 2026","8. August 2026"],
    "Hitelesség és számítási korlátok":["Accuracy and calculation limitations","Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.":["The result is for general information only. It is not a diagnosis and does not replace a medical examination or personalised treatment advice.","Das Ergebnis dient der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    "A számítások módszertana és minőségbiztosítása":["Calculation methodology and quality assurance","Berechnungsmethodik und Qualitätssicherung"], "Hibát találtál? Jelezd nekünk.":["Found an issue? Let us know.","Einen Fehler gefunden? Sag uns Bescheid."],
    "BMR → napi energia létra":["BMR → daily energy ladder","BMR → tägliche Energie im Überblick"],
    "Az alapanyagcsere nem a napi „ehető kalóriád”":["Basal metabolism is not your daily “calorie allowance”","Der Grundumsatz ist nicht deine tägliche „Kalorienmenge zum Essen“"],
    "Nyugalmi energiaigény matematikai becslése.":["A mathematical estimate of energy needs at rest.","Mathematische Schätzung des Energiebedarfs in Ruhe."],
    "+ napi mozgás":["+ daily movement","+ tägliche Bewegung"], "Munka, séta, házimunka és spontán aktivitás.":["Work, walking, household tasks and incidental activity.","Arbeit, Spazierengehen, Haushalt und spontane Aktivität."],
    "+ edzés":["+ exercise","+ Training"], "Tervezett fizikai aktivitás, amely naponta eltérhet.":["Planned physical activity, which can vary from day to day.","Geplante körperliche Aktivität, die täglich variieren kann."],
    "= napi energiafelhasználás becslése":["= estimated daily energy expenditure","= geschätzter täglicher Energieverbrauch"], "Ez is változó tartomány, nem állandó laborérték.":["This is also a variable range, not a fixed laboratory value.","Auch dies ist eine variable Spanne und kein fester Laborwert."],
    "Ne keverd össze:":["Keep these separate:","Nicht verwechseln:"],
    "BMR, RMR és TDEE rokon, de nem azonos fogalmak. A fő kalkulátor BMR-t becsül; napi étrendhez további feltételezések kellenek.":["BMR, RMR and TDEE are related but distinct concepts. The main calculator estimates BMR; planning a daily diet requires additional assumptions.","BMR, RMR und TDEE sind verwandte, aber unterschiedliche Begriffe. Der Rechner schätzt den BMR; für die tägliche Ernährung sind weitere Annahmen nötig."],
    "Forrás és ellenőrzési alap":["Sources and review basis","Quellen und Prüfgrundlage"],
    "A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.":["This calculator is an informational aid; it does not replace individual health or legal advice.","Dieser Rechner dient der Information und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    "BMR – Mifflin–St Jeor képlet és aktivitási szorzók":["BMR – Mifflin–St Jeor equation and activity multipliers","BMR – Mifflin–St-Jeor-Formel und Aktivitätsfaktoren"],
    "A számítás kiindulópont, nem személyre szabott étrend. A tényleges energia- és tápanyagigény az aktivitás, testösszetétel, cél, egészségi állapot és gyógyszerek miatt eltérhet.":["This calculation is a starting point, not a personalised diet. Actual energy and nutrient needs vary with activity, body composition, goals, health and medication.","Die Berechnung ist ein Ausgangspunkt und kein individueller Ernährungsplan. Der tatsächliche Energie- und Nährstoffbedarf hängt unter anderem von Aktivität, Körperzusammensetzung, Zielen, Gesundheit und Medikamenten ab."],
    "Aktivitási leírás":["Activity level","Aktivitätsbeschreibung"], "Gyakori tervezési szorzó":["Common planning multiplier","Üblicher Planungsfaktor"],
    "Ülő életmód, kevés mozgás":["Sedentary, little activity","Überwiegend sitzend, wenig Bewegung"], "Könnyű aktivitás heti 1–3 alkalom":["Light activity 1–3 times per week","Leichte Aktivität 1–3-mal pro Woche"],
    "Közepes aktivitás heti 3–5 alkalom":["Moderate activity 3–5 times per week","Mittlere Aktivität 3–5-mal pro Woche"], "Nagy aktivitás heti 6–7 alkalom":["High activity 6–7 times per week","Hohe Aktivität 6–7-mal pro Woche"],
    "Gyermekek, várandósság és szoptatás külön szakmai megközelítést igényel.":["Children, pregnancy and breastfeeding require a separate professional approach.","Für Kinder, Schwangerschaft und Stillzeit ist eine gesonderte fachliche Einschätzung erforderlich."],
    "Evészavar, gyors fogyás, krónikus betegség vagy jelentős túlsúly esetén szakember bevonása indokolt.":["Seek professional support for an eating disorder, rapid weight loss, chronic illness or significant overweight.","Bei Essstörungen, schnellem Gewichtsverlust, chronischen Erkrankungen oder starkem Übergewicht ist fachliche Unterstützung sinnvoll."],
    "Vesebetegség, májbetegség vagy speciális diéta mellett a fehérjecél nem állítható be általános kalkulátorból.":["A general calculator cannot set protein targets for kidney or liver disease or a specialised diet.","Bei Nieren- oder Lebererkrankungen sowie bei speziellen Ernährungsformen lässt sich ein Proteinziel nicht mit einem allgemeinen Rechner festlegen."],
    "A túl nagy kalóriadeficit ronthatja a teljesítményt, regenerációt és tápanyagellátást.":["An excessive calorie deficit can impair performance, recovery and nutrient intake.","Ein zu großes Kaloriendefizit kann Leistungsfähigkeit, Regeneration und Nährstoffversorgung beeinträchtigen."],
    "A kalkulátor szándékosan nem ad mindenkire érvényes „biztonságos minimumkalóriát”. Ilyen alsó határ egyéni adatok és egészségi állapot nélkül félrevezető lehet.":["The calculator deliberately does not give a one-size-fits-all “safe minimum calorie” target. Without individual data and health context, such a threshold could be misleading.","Der Rechner nennt bewusst keinen allgemein gültigen „sicheren Mindestkalorienwert“. Ohne individuelle Angaben und Kenntnis des Gesundheitszustands könnte ein solcher Grenzwert irreführend sein."],
    "Források és módszertani ellenőrzés":["Sources and methodology review","Quellen und methodische Prüfung"],
    "Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.":["This is an informational calculator; consult a professional or official source for individual decisions.","Dieser Rechner dient der Information. Für individuelle Entscheidungen sind Fachleute oder offizielle Stellen heranzuziehen."],
    "Módszertani frissítés:":["Methodology updated:","Methodisch aktualisiert:"], "2026. július 15.":["15 July 2026","15. Juli 2026"]
  });
  const supported = Object.freeze(["hu","en","de"]);
  function translate(page, value, language) {
    if (page !== pageKey || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];
    const energy = /^([\d.,\s]+) kcal\/nap$/u.exec(normalized);
    if (energy) return `${energy[1]} ${language === "en" ? "kcal/day" : "kcal/Tag"}`;
    return null;
  }
  return { pages: Object.freeze([pageKey]), dictionaries: Object.freeze({ [pageKey]: dictionary }), dictionary, supported, translate };
});

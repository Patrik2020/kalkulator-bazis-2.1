/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "pulzus-zona-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="pulzus-zona-kalkulator"]');
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
  const page = "pulzus-zona-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Pulzuszóna kalkulátor | Edzési tartományok becslése","Heart Rate Zone Calculator | Estimate Training Zones","Herzfrequenzzonen-Rechner | Trainingsbereiche schätzen"],
    ["Pulzuszóna kalkulátor felnőtteknek életkor és nyugalmi pulzus alapján. Becsüld meg a relatív edzési pulzustartományokat és értsd meg a módszer korlátait.","Estimate relative training heart-rate ranges for adults from age and resting heart rate, and understand the method's limitations.","Schätze relative Trainingspulsbereiche für Erwachsene anhand von Alter und Ruhepuls und lerne die Grenzen der Methode kennen."],
    ["Pulzuszóna kalkulátor életkor és nyugalmi pulzus alapján. Becsüld meg az edzési pulzustartományokat és értsd meg a zónák gyakorlati használatát.","Estimate training heart-rate ranges from age and resting heart rate, and learn how to use the zones in practice.","Schätze Trainingspulsbereiche anhand von Alter und Ruhepuls und erfahre, wie sich die Zonen praktisch nutzen lassen."],
    ["Pulzus zóna kalkulátor","Heart Rate Zone Calculator","Herzfrequenzzonen-Rechner"],
    ["Számold ki az edzéshez használható pulzustartományokat.","Estimate heart-rate ranges for training.","Schätze Herzfrequenzbereiche für das Training."],
    ["Egészség és sport kalkulátorok","Health and sport calculators","Rechner für Gesundheit und Sport"],
    ["Főoldal","Home","Startseite"],["Egészség & sport","Health & sport","Gesundheit & Sport"],
    ["Felnőtteknek készült tájékoztató pulzustartalékos intenzitásbecslés életkor és nyugalmi pulzus alapján.","An indicative heart-rate-reserve intensity estimate for adults, based on age and resting heart rate.","Eine orientierende Intensitätsschätzung nach der Herzfrequenzreserve für Erwachsene, basierend auf Alter und Ruhepuls."],
    ["Életkor","Age","Alter"],["Nyugalmi pulzus","Resting heart rate","Ruhepuls"],["Eredmény:","Result:","Ergebnis:"],
    ["Az értékek legyenek nagyobbak nullánál","Values must be greater than zero.","Die Werte müssen größer als null sein."],
    ["Minden mezőben érvényes szám szerepeljen","Enter a valid number in every field.","Gib in jedem Feld eine gültige Zahl ein."],
    ["Adj meg érvényes adatokat a számításhoz.","Enter valid values for the calculation.","Gib gültige Werte für die Berechnung ein."],
    ["Ezt a pulzustartalékos tervezőt felnőtteknek (18+) használjuk","This heart-rate-reserve planner is intended for adults aged 18 and over.","Dieser Planer nach der Herzfrequenzreserve ist für Erwachsene ab 18 Jahren vorgesehen."],
    ["A nyugalmi pulzus legyen kisebb a becsült maximális pulzusnál","Resting heart rate must be lower than the estimated maximum heart rate.","Der Ruhepuls muss niedriger als die geschätzte maximale Herzfrequenz sein."],
    ["Becsült max pulzus","Estimated maximum heart rate","Geschätzte maximale Herzfrequenz"],
    ["Becsült max pulzus:","Estimated maximum heart rate:","Geschätzte maximale Herzfrequenz:"],
    ["Közepes relatív intenzitás – 40–59% pulzustartalék","Moderate relative intensity – 40–59% HRR","Mittlere relative Intensität – 40–59 % Herzfrequenzreserve"],
    ["Közepes relatív intenzitás – 40–59% pulzustartalék:","Moderate relative intensity – 40–59% HRR:","Mittlere relative Intensität – 40–59 % Herzfrequenzreserve:"],
    ["Intenzív relatív intenzitás – 60–84% pulzustartalék","Vigorous relative intensity – 60–84% HRR","Hohe relative Intensität – 60–84 % Herzfrequenzreserve"],
    ["Intenzív relatív intenzitás – 60–84% pulzustartalék:","Vigorous relative intensity – 60–84% HRR:","Hohe relative Intensität – 60–84 % Herzfrequenzreserve:"],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favourites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Edzési pulzustartományok becslése","Estimating training heart-rate ranges","Trainingspulsbereiche schätzen"],
    ["A pulzuszóna kalkulátor életkor és nyugalmi pulzus alapján ad tájékoztató edzési tartományokat. A cél nem az, hogy egyetlen „jó” pulzusszámot mondjon, hanem hogy megmutassa: ugyanaz a percenkénti pulzus két embernél eltérő relatív terhelést jelenthet.","The heart rate zone calculator provides indicative training ranges based on age and resting heart rate. It does not prescribe one ‘correct’ heart rate; it shows that the same beats-per-minute value can represent a different relative workload for two people.","Der Herzfrequenzzonen-Rechner liefert anhand von Alter und Ruhepuls orientierende Trainingsbereiche. Er gibt nicht den einen „richtigen“ Puls vor, sondern zeigt, dass derselbe Wert in Schlägen pro Minute für zwei Menschen eine unterschiedliche relative Belastung bedeuten kann."],
    ["A pulzus hasznos intenzitási jelző, de nem egyenlő az edzettséggel. Befolyásolja többek között a hőmérséklet, a folyadékállapot, a koffein, a stressz, az alváshiány, a gyógyszerek és az, hogy mennyire pihent állapotból kezded az edzést.","Heart rate is a useful indicator of intensity, but it is not the same as fitness. It is affected by temperature, hydration, caffeine, stress, lack of sleep, medication and how well rested you are when training begins.","Die Herzfrequenz ist ein nützlicher Intensitätsindikator, aber nicht mit Fitness gleichzusetzen. Sie wird unter anderem von Temperatur, Flüssigkeitshaushalt, Koffein, Stress, Schlafmangel, Medikamenten und dem Erholungszustand zu Trainingsbeginn beeinflusst."],
    ["A számítás módszere","How the calculation works","So funktioniert die Berechnung"],
    ["A kalkulátor a becsült maximális pulzust a","The calculator estimates maximum heart rate using","Der Rechner schätzt die maximale Herzfrequenz mit der Formel"],
    ["220 − életkor","220 − age","220 − Alter"],
    ["képlettel számolja, majd a Karvonen-féle pulzustartalékos módszert használja. A pulzustartalék a becsült maximális és a nyugalmi pulzus különbsége. A zónahatár képlete:","and then applies the Karvonen heart-rate-reserve method. Heart rate reserve is the difference between estimated maximum and resting heart rate. The zone boundary is calculated as:","und wendet anschließend die Karvonen-Methode mit der Herzfrequenzreserve an. Die Herzfrequenzreserve ist die Differenz zwischen geschätzter maximaler Herzfrequenz und Ruhepuls. Die Zonengrenze lautet:"],
    ["nyugalmi pulzus + pulzustartalék × intenzitás","resting heart rate + heart rate reserve × intensity","Ruhepuls + Herzfrequenzreserve × Intensität"],
    ["Példa 35 éves felnőttnél","Example for a 35-year-old adult","Beispiel für eine 35-jährige Person"],
    ["35 éves korban a 220 − életkor képlet szerinti maximum 185 bpm. Ha a nyugalmi pulzus 65 bpm, a pulzustartalék 120. A HHS relatív intenzitási sávjai alapján a 40–59%-os közepes tartomány körülbelül 113–136 bpm, a 60–84%-os intenzív tartomány pedig 137–166 bpm.","At age 35, the 220 − age formula gives a maximum of 185 bpm. With a resting heart rate of 65 bpm, the heart rate reserve is 120. Using the HHS relative-intensity ranges, the moderate 40–59% range is about 113–136 bpm and the vigorous 60–84% range is about 137–166 bpm.","Mit 35 Jahren ergibt die Formel 220 − Alter eine maximale Herzfrequenz von 185 bpm. Bei einem Ruhepuls von 65 bpm beträgt die Herzfrequenzreserve 120. Nach den relativen Intensitätsbereichen der HHS liegt der mittlere Bereich von 40–59 % ungefähr bei 113–136 bpm und der hohe Bereich von 60–84 % ungefähr bei 137–166 bpm."],
    ["Mit jelentenek a zónák a gyakorlatban?","What do the zones mean in practice?","Was bedeuten die Zonen in der Praxis?"],
    ["Közepes relatív intenzitás (40–59% pulzustartalék):","Moderate relative intensity (40–59% HRR):","Mittlere relative Intensität (40–59 % Herzfrequenzreserve):"],
    ["tájékoztató tartomány; a beszédteszt és a saját terhelésérzet is fontos kontroll.","an indicative range; the talk test and your perceived exertion are also important checks.","ein Orientierungsbereich; auch der Sprechtest und das eigene Belastungsempfinden sind wichtige Kontrollen."],
    ["Intenzív relatív intenzitás (60–84% pulzustartalék):","Vigorous relative intensity (60–84% HRR):","Hohe relative Intensität (60–84 % Herzfrequenzreserve):"],
    ["nagyobb terhelés; kezdőként, gyógyszer vagy ismert szív-érrendszeri betegség mellett nem önmagában a kalkulált pulzusszám alapján érdemes célozni.","a higher workload; beginners and people taking medication or living with known cardiovascular disease should not set targets from the calculated heart rate alone.","eine höhere Belastung; Anfänger sowie Menschen, die Medikamente einnehmen oder an einer bekannten Herz-Kreislauf-Erkrankung leiden, sollten Ziele nicht allein anhand der berechneten Herzfrequenz festlegen."],
    ["A „zsírégető zóna” elnevezés félrevezető lehet. Alacsonyabb intenzitásnál az energia nagyobb része származhat zsírból, de a testzsír csökkenését hosszabb távon a teljes energiaegyensúly, az étrend és a teljes aktivitás befolyásolja.","The term ‘fat-burning zone’ can be misleading. At lower intensity, a larger share of energy may come from fat, but long-term changes in body fat depend on overall energy balance, diet and total activity.","Der Begriff „Fettverbrennungszone“ kann irreführend sein. Bei geringerer Intensität kann ein größerer Energieanteil aus Fett stammen; langfristig wird der Körperfettabbau jedoch von der gesamten Energiebilanz, der Ernährung und der Gesamtaktivität beeinflusst."],
    ["Miért lehet más az okosórád eredménye?","Why might your smartwatch give a different result?","Warum kann deine Smartwatch ein anderes Ergebnis anzeigen?"],
    ["Az órák és sportalkalmazások eltérő maximálispulzus-képletet, saját mért maximumot, laboreredményt vagy egyéni zónabeállítást használhatnak. Emiatt ugyanaz az edzés más zónába kerülhet két külön rendszerben. Ez nem feltétlen hiba, inkább eltérő módszertan.","Watches and sports apps may use a different maximum-heart-rate formula, a measured personal maximum, laboratory results or custom zone settings. The same workout can therefore fall into a different zone in two systems. This is not necessarily an error; it may reflect a different method.","Uhren und Sport-Apps können eine andere Formel für die maximale Herzfrequenz, einen selbst gemessenen Maximalwert, Laborergebnisse oder individuelle Zoneneinstellungen verwenden. Deshalb kann dasselbe Training in zwei Systemen unterschiedlichen Zonen zugeordnet werden. Das ist nicht zwingend ein Fehler, sondern kann an der unterschiedlichen Methodik liegen."],
    ["Mikor érdemes a nyugalmi pulzust mérni?","When should resting heart rate be measured?","Wann sollte der Ruhepuls gemessen werden?"],
    ["A legjobb kiindulás több nyugodt reggeli mérés átlaga, ébredés után, még jelentős fizikai aktivitás és koffein előtt. Egyetlen mérés torzíthat stressz, betegség, rossz alvás vagy előző napi kemény edzés miatt.","A good starting point is the average of several calm morning measurements taken after waking and before substantial physical activity or caffeine. A single reading may be distorted by stress, illness, poor sleep or a hard workout the day before.","Ein guter Ausgangspunkt ist der Durchschnitt mehrerer ruhiger Messungen morgens nach dem Aufwachen und vor größerer körperlicher Aktivität oder Koffein. Ein einzelner Messwert kann durch Stress, Krankheit, schlechten Schlaf oder ein hartes Training am Vortag verzerrt sein."],
    ["Korlátok és mérési hibák","Limitations and measurement errors","Grenzen und Messfehler"],
    ["A 220 − életkor képlet egyéni szinten jelentősen tévedhet.","The 220 − age formula can be substantially inaccurate for an individual.","Die Formel 220 − Alter kann im Einzelfall deutlich ungenau sein."],
    ["A csuklós optikai szenzor gyors intenzitásváltásnál késhet vagy pontatlan lehet.","A wrist-based optical sensor may lag or be inaccurate during rapid changes in intensity.","Ein optischer Sensor am Handgelenk kann bei schnellen Intensitätswechseln verzögert oder ungenau reagieren."],
    ["A koffein, stressz, hőség, folyadékhiány és gyógyszerek módosíthatják a pulzust.","Caffeine, stress, heat, dehydration and medication can alter heart rate.","Koffein, Stress, Hitze, Flüssigkeitsmangel und Medikamente können die Herzfrequenz verändern."],
    ["A becsült zóna nem helyettesít terheléses vizsgálatot vagy teljesítménydiagnosztikát.","An estimated zone does not replace an exercise stress test or performance assessment.","Eine geschätzte Zone ersetzt weder eine Belastungsuntersuchung noch eine Leistungsdiagnostik."],
    ["Mikor ne hagyatkozz kalkulátorra?","When should you not rely on a calculator?","Wann solltest du dich nicht auf einen Rechner verlassen?"],
    ["Szív- és érrendszeri betegség, ismert ritmuszavar, terhesség, béta-blokkoló vagy más pulzust befolyásoló gyógyszer szedése, hosszabb kihagyás vagy jelentős panasz esetén az edzési intenzitást érdemes szakemberrel egyeztetni. Mellkasi fájdalom, ájulásérzés, szokatlan nehézlégzés vagy erős szédülés esetén az edzést meg kell szakítani.","If you have cardiovascular disease, a known arrhythmia, are pregnant, take beta blockers or other medication that affects heart rate, are returning after a long break or have significant symptoms, discuss training intensity with a qualified professional. Stop exercising if you experience chest pain, feel faint, have unusual shortness of breath or severe dizziness.","Bei Herz-Kreislauf-Erkrankungen, bekannten Herzrhythmusstörungen, Schwangerschaft, der Einnahme von Betablockern oder anderen herzfrequenzbeeinflussenden Medikamenten, nach längerer Pause oder bei deutlichen Beschwerden sollte die Trainingsintensität mit Fachpersonal abgestimmt werden. Bei Brustschmerzen, Ohnmachtsgefühl, ungewöhnlicher Atemnot oder starkem Schwindel muss das Training abgebrochen werden."],
    ["Gyakori hibák","Common mistakes","Häufige Fehler"],
    ["A becsült maximális pulzust biztos egyéni maximumnak tekintik.","Treating the estimated maximum heart rate as a confirmed personal maximum.","Die geschätzte maximale Herzfrequenz als gesicherten persönlichen Maximalwert ansehen."],
    ["Minden edzést a lehető legmagasabb zónában akarnak végezni.","Trying to do every workout in the highest possible zone.","Jedes Training in der höchstmöglichen Zone absolvieren wollen."],
    ["Az órán látott pillanatnyi kiugrást automatikusan valós értéknek veszik.","Automatically treating a momentary spike on a watch as a genuine value.","Einen kurzzeitigen Ausschlag auf der Uhr automatisch als echten Wert ansehen."],
    ["A nyugalmi pulzust közvetlenül kávé, lépcsőzés vagy kapkodás után mérik.","Measuring resting heart rate immediately after coffee, climbing stairs or rushing around.","Den Ruhepuls direkt nach Kaffee, Treppensteigen oder Hektik messen."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],
    ["Mi számít nyugalmi pulzusnak?","What counts as resting heart rate?","Was gilt als Ruhepuls?"],
    ["A teljes nyugalomban, lehetőleg ébredés után mért pulzus jó kiindulás. Több nap átlaga megbízhatóbb, mint egyetlen érték.","Heart rate measured at complete rest, preferably after waking, is a useful starting point. An average over several days is more reliable than a single value.","Die Herzfrequenz in völliger Ruhe, möglichst nach dem Aufwachen gemessen, ist ein guter Ausgangspunkt. Der Durchschnitt mehrerer Tage ist verlässlicher als ein einzelner Wert."],
    ["Miért más az órám által mutatott zóna?","Why does my watch show a different zone?","Warum zeigt meine Uhr eine andere Zone an?"],
    ["Az eszköz más maximálispulzus-képletet, saját mért maximumot vagy eltérő zónahatárokat használhat.","The device may use a different maximum-heart-rate formula, a measured personal maximum or different zone boundaries.","Das Gerät kann eine andere Formel für die maximale Herzfrequenz, einen selbst gemessenen Maximalwert oder andere Zonengrenzen verwenden."],
    ["Jobb a mellkaspánt, mint a csuklós mérés?","Is a chest strap better than a wrist-based monitor?","Ist ein Brustgurt besser als die Messung am Handgelenk?"],
    ["Sport közbeni gyors pulzusváltozásoknál a mellkaspánt általában közvetlenebb és stabilabb jelet adhat, de egyik eszköz sem helyettesít orvosi mérést.","During rapid heart-rate changes in sport, a chest strap can generally provide a more direct and stable signal, but neither device replaces a medical measurement.","Bei schnellen Herzfrequenzänderungen im Sport kann ein Brustgurt in der Regel ein direkteres und stabileres Signal liefern; keines der Geräte ersetzt jedoch eine medizinische Messung."],
    ["Kezdőként a magasabb zónát célozzam?","Should a beginner aim for the higher zone?","Sollte ich als Anfänger die höhere Zone anstreben?"],
    ["Nem feltétlenül. Kezdéskor a fokozatosság, a könnyen kontrollálható terhelés és a rendszeresség általában fontosabb.","Not necessarily. When starting out, gradual progression, an easily controlled workload and consistency are generally more important.","Nicht unbedingt. Zu Beginn sind ein schrittweiser Aufbau, eine gut kontrollierbare Belastung und Regelmäßigkeit in der Regel wichtiger."],
    ["Mit tegyek szédülés vagy mellkasi fájdalom esetén?","What should I do if I feel dizzy or have chest pain?","Was soll ich bei Schwindel oder Brustschmerzen tun?"],
    ["Az edzést szakítsd meg, és a panasz súlyosságának megfelelően kérj egészségügyi segítséget.","Stop exercising and seek medical help appropriate to the severity of the symptoms.","Brich das Training ab und nimm je nach Schwere der Beschwerden medizinische Hilfe in Anspruch."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],["Kalória kalkulátor","Calorie Calculator","Kalorienrechner"],["BMR kalkulátor","BMR Calculator","BMR-Rechner"],["Folyadékigény kalkulátor","Hydration Needs Calculator","Flüssigkeitsbedarfsrechner"],
    ["Utolsó tartalmi frissítés:","Content last reviewed:","Inhalt zuletzt geprüft:"],["2026. augusztus 8.","8 August 2026","8. August 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],
    ["Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.","The result provides general information. It is not a diagnosis and does not replace a medical assessment or personalised treatment advice.","Das Ergebnis dient der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    ["A számítások módszertana és minőségbiztosítása","Calculation methods and quality assurance","Berechnungsmethoden und Qualitätssicherung"],["Hibát találtál? Jelezd nekünk.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."],
    ["Edzésintenzitás keresztellenőrző","Training-intensity cross-check","Plausibilitätsprüfung der Trainingsintensität"],
    ["A pulzusszám mellé tedd oda a terhelésérzetet is","Consider perceived exertion alongside heart rate","Berücksichtige neben der Herzfrequenz auch das Belastungsempfinden"],
    ["Képlet","Formula","Formel"],["A becsült maximális pulzusból számolt zónák egyszerű, általános támpontok.","Zones calculated from estimated maximum heart rate are simple, general reference points.","Zonen, die aus der geschätzten maximalen Herzfrequenz berechnet werden, sind einfache allgemeine Richtwerte."],
    ["Beszédteszt","Talk test","Sprechtest"],["Mérsékelt intenzitásnál általában még lehet beszélni, de énekelni már nehezebb; erős intenzitásnál csak néhány szó fér bele megállás nélkül.","At moderate intensity, you can usually still talk but singing is harder; at vigorous intensity, you can say only a few words without pausing.","Bei mittlerer Intensität kann man meist noch sprechen, aber schwerer singen; bei hoher Intensität sind ohne Pause nur wenige Worte möglich."],
    ["Egyéni eltérés","Individual variation","Individuelle Abweichung"],["Edzettség, gyógyszerek és keringési állapot miatt ugyanaz a képlet nem mindenkinél írja le jól a terhelést.","Fitness, medication and cardiovascular status mean that the same formula does not describe workload accurately for everyone.","Aufgrund von Trainingszustand, Medikamenten und Kreislaufsituation beschreibt dieselbe Formel die Belastung nicht bei allen Menschen zuverlässig."],
    ["Egészségügyi határ:","Health boundary:","Gesundheitlicher Hinweis:"],["Mellkasi fájdalom, ájulásérzés, szokatlan légszomj vagy ismert szív-érrendszeri betegség esetén ne a kalkulátor alapján emeld a terhelést.","If you have chest pain, feel faint, experience unusual shortness of breath or have known cardiovascular disease, do not increase exertion based on the calculator.","Bei Brustschmerzen, Ohnmachtsgefühl, ungewöhnlicher Atemnot oder bekannter Herz-Kreislauf-Erkrankung solltest du die Belastung nicht anhand des Rechners erhöhen."],
    ["Forrás és ellenőrzési alap","Source and basis for review","Quelle und Prüfgrundlage"],["A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.","The calculator is an informational aid and does not replace individual medical or legal advice.","Der Rechner ist eine Orientierungshilfe und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    ["CDC – What Counts as Physical Activity for Adults","CDC – What Counts as Physical Activity for Adults","CDC – Was für Erwachsene als körperliche Aktivität zählt"],
    ["Pulzuszónák több maximálispulzus-becsléssel","Heart rate zones using multiple maximum-heart-rate estimates","Herzfrequenzzonen mit mehreren Schätzformeln für die maximale Herzfrequenz"],
    ["A 220 − életkor és a Tanaka-képlet eltérő becslést adhat. A Karvonen-mód a nyugalmi pulzust is figyelembe veszi.","The 220 − age and Tanaka formulas may give different estimates. The Karvonen method also takes resting heart rate into account.","Die Formeln 220 − Alter und Tanaka können unterschiedliche Schätzwerte ergeben. Die Karvonen-Methode berücksichtigt zusätzlich den Ruhepuls."],
    ["Maximális pulzus képlete","Maximum-heart-rate formula","Formel für die maximale Herzfrequenz"],["Tanaka: 208 − 0,7 × életkor","Tanaka: 208 − 0.7 × age","Tanaka: 208 − 0,7 × Alter"],["Klasszikus: 220 − életkor","Classic: 220 − age","Klassisch: 220 − Alter"],
    ["A felnőtt tervezőhöz 18+ életkort és a becsült maximumnál alacsonyabb pozitív nyugalmi pulzust adj meg.","For the adult planner, enter an age of 18 or over and a positive resting heart rate below the estimated maximum.","Gib für den Erwachsenen-Planer ein Alter ab 18 Jahren und einen positiven Ruhepuls unterhalb der geschätzten maximalen Herzfrequenz ein."],
    ["Becsült maximális pulzus","Estimated maximum heart rate","Geschätzte maximale Herzfrequenz"],["Közepes relatív intenzitás – HRR 40–59%","Moderate relative intensity – HRR 40–59%","Mittlere relative Intensität – Herzfrequenzreserve 40–59 %"],["Intenzív relatív intenzitás – HRR 60–84%","Vigorous relative intensity – HRR 60–84%","Hohe relative Intensität – Herzfrequenzreserve 60–84 %"],
    ["220 − életkor kontroll","220 − age comparison","Vergleichswert 220 − Alter"],["Tanaka kontroll","Tanaka comparison","Tanaka-Vergleichswert"],
    ["Béta-blokkoló, szív- és érrendszeri betegség, mellkasi fájdalom, szédülés vagy szokatlan légszomj esetén a pulzuscélokat orvossal kell egyeztetni.","If you take beta blockers, have cardiovascular disease, chest pain, dizziness or unusual shortness of breath, discuss heart-rate targets with a doctor.","Bei Betablockern, Herz-Kreislauf-Erkrankungen, Brustschmerzen, Schwindel oder ungewöhnlicher Atemnot müssen die Herzfrequenzziele ärztlich abgestimmt werden."],
    ["Források és módszertani ellenőrzés","Sources and methodology review","Quellen und methodische Prüfung"],
    ["American Heart Association – Target Heart Rates","American Heart Association – Target Heart Rates","American Heart Association – Zielherzfrequenzen"],
    ["HHS – Physical Activity Guidelines: relative intensity","HHS – Physical Activity Guidelines: relative intensity","HHS – Leitlinien für körperliche Aktivität: relative Intensität"],
    ["Tanaka és mtsai. – életkor alapján becsült maximális pulzus","Tanaka et al. – age-predicted maximum heart rate","Tanaka et al. – altersbasiert geschätzte maximale Herzfrequenz"],
    ["Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.","This page is an informational calculator. Individual decisions require guidance from a professional or an official body.","Diese Seite ist ein Informationsrechner. Für individuelle Entscheidungen sind Angaben von Fachpersonal oder einer offiziellen Stelle erforderlich."],
    ["Módszertani frissítés:","Methodology updated:","Methodik aktualisiert:"],["2026. július 15.","15 July 2026","15. Juli 2026"],["Hirdetés","Advertisement","Anzeige"]
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
    if (/^\d+(?:[–-]\d+)? bpm$/u.test(normalized)) return normalized;
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Heart Rate Zone Calculator" : "Fehlermeldung – Herzfrequenzzonen-Rechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Heart Rate Zone Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/pulzus-zona-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Herzfrequenzzonen-Rechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/pulzus-zona-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

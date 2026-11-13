/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "terhessegi-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="terhessegi-kalkulator"]');
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
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source); if (!parts?.[2]) continue;
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
      if (errorLink) { const source = originals.get("errorHref") || errorLink.getAttribute("href"); originals.set("errorHref", source); errorLink.setAttribute("href", api.reportHref(source, language)); }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) { if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent); try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ } }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content); originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source; if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "terhessegi-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Terhességi kalkulátor","Pregnancy Due Date Calculator","Schwangerschaftsrechner"],
    ["Terhességi kalkulátor | Várható szülési idő becslése","Pregnancy Due Date Calculator | Estimate Your Due Date","Schwangerschaftsrechner | Geburtstermin schätzen"],
    ["Terhességi kalkulátor az utolsó menstruáció első napja és ciklushossz alapján. Becsüld meg a terhességi kort, a várható szülési dátumot és ismerd meg a számítás korlátait.","Estimate gestational age and the due date from the first day of the last menstrual period and average cycle length, and learn about the calculation's limitations.","Schätze Schwangerschaftsalter und Geburtstermin anhand des ersten Tages der letzten Periode und der durchschnittlichen Zykluslänge und informiere dich über die Grenzen der Berechnung."],
    ["Terhességi kor és várható szülési dátum becslése, a módszer korlátaival és gyakorlati magyarázattal.","Estimate gestational age and the due date, with practical explanations and the method's limitations.","Schätzung von Schwangerschaftsalter und Geburtstermin mit praktischen Erläuterungen und den Grenzen der Methode."],
    ["Becsüld meg a terhességi kort és a várható szülési dátumot.","Estimate gestational age and the expected due date.","Schätze das Schwangerschaftsalter und den voraussichtlichen Geburtstermin."],
    ["Számold ki a várható szülési dátumot az utolsó menstruáció alapján.","Estimate the due date from the last menstrual period.","Schätze den Geburtstermin anhand der letzten Periode."],
    ["Egészség és sport kalkulátorok","Health and fitness calculators","Rechner für Gesundheit und Fitness"],
    ["Főoldal","Home","Startseite"],["Egészség & sport","Health & fitness","Gesundheit & Fitness"],
    ["Az utolsó menstruáció első napja","First day of the last menstrual period","Erster Tag der letzten Periode"],
    ["Átlagos ciklushossz (nap)","Average cycle length (days)","Durchschnittliche Zykluslänge (Tage)"],
    ["Eredmény:","Result:","Ergebnis:"],["Becsült terhességi hét:","Estimated week of pregnancy:","Geschätzte Schwangerschaftswoche:"],
    ["Becsült terhességi hét","Estimated week of pregnancy","Geschätzte Schwangerschaftswoche"],
    ["Adj meg egy dátumot","Enter a date","Gib ein Datum ein"],["Várható szülési dátum:","Estimated due date:","Voraussichtlicher Geburtstermin:"],
    ["Várható szülési dátum","Estimated due date","Voraussichtlicher Geburtstermin"],
    ["Érvénytelen dátum","Invalid date","Ungültiges Datum"],
    ["A ciklushossz 21 és 45 nap között legyen","Cycle length must be between 21 and 45 days.","Die Zykluslänge muss zwischen 21 und 45 Tagen liegen."],
    ["Az utolsó menstruáció dátuma nem lehet jövőbeli","The last menstrual period date cannot be in the future.","Das Datum der letzten Periode darf nicht in der Zukunft liegen."],
    ["A megadott dátum alapján több mint 42 hét telt el. Ellenőrizd az utolsó menstruáció dátumát és a klinikai datálást.","More than 42 weeks have passed based on the date entered. Check the last menstrual period date and the clinical dating.","Nach dem eingegebenen Datum sind mehr als 42 Wochen vergangen. Prüfe das Datum der letzten Periode und die klinische Datierung."],
    ["Becsült terhességi kor","Estimated gestational age","Geschätztes Schwangerschaftsalter"],
    ["Ciklushossz kerekítése","Cycle length rounded","Zykluslänge gerundet"],["42 hetes modellhatár","42-week model limit","42-Wochen-Modellgrenze"],
    ["A naptári becslés elérte a 42 hetet; a klinikai datálás az irányadó.","The calendar estimate has reached 42 weeks; clinical dating should be followed.","Die Kalenderschätzung hat 42 Wochen erreicht; maßgeblich ist die klinische Datierung."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.","Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favourites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Mit számol a terhességi kalkulátor?","What does the pregnancy calculator estimate?","Was berechnet der Schwangerschaftsrechner?"],
    ["A kalkulátor az utolsó menstruáció első napjából és az átlagos ciklushosszból becsüli a terhességi kort és a várható szülési dátumot. Ez a klasszikus naptári becslés egy kiindulópont, nem pedig a fogamzás tényleges napjának meghatározása.","The calculator estimates gestational age and the due date from the first day of the last menstrual period and the average cycle length. This conventional calendar estimate is a starting point, not a way to determine the actual day of conception.","Der Rechner schätzt Schwangerschaftsalter und Geburtstermin anhand des ersten Tages der letzten Periode und der durchschnittlichen Zykluslänge. Diese klassische Kalenderschätzung ist ein Ausgangspunkt und bestimmt nicht den tatsächlichen Tag der Empfängnis."],
    ["A terhességi kort hagyományosan az utolsó menstruáció első napjától számítják, ezért a számított terhességi kor általában nagyjából két héttel korábban kezdődik, mint a feltételezett fogamzás időpontja.","Gestational age is conventionally counted from the first day of the last menstrual period, so it usually starts about two weeks before the presumed date of conception.","Das Schwangerschaftsalter wird üblicherweise ab dem ersten Tag der letzten Periode gerechnet und beginnt daher meist etwa zwei Wochen vor dem vermuteten Zeitpunkt der Empfängnis."],
    ["A számítás logikája","How the calculation works","So funktioniert die Berechnung"],
    ["28 napos ciklusnál a becsült terminus az utolsó menstruáció első napjától számított","For a 28-day cycle, the estimated due date is","Bei einem 28-Tage-Zyklus liegt der geschätzte Geburtstermin"],
    ["280 nap","280 days","280 Tage"],[". Ha az átlagos ciklus ettől eltér, a kalkulátor egyszerű korrekciót alkalmaz a különbség alapján.","after the first day of the last menstrual period. If the average cycle is shorter or longer, the calculator adjusts the estimate by the difference.","nach dem ersten Tag der letzten Periode. Weicht die durchschnittliche Zykluslänge davon ab, korrigiert der Rechner die Schätzung um die Differenz."],
    ["Példa","Example","Beispiel"],["Ha az utolsó menstruáció első napja január 1., és a ciklus átlagosan 28 napos, a becsült terminus körülbelül 40 héttel későbbre esik. A kalkulátor a konkrét naptári dátumot automatikusan megadja.","If the first day of the last menstrual period is 1 January and the average cycle is 28 days, the estimated due date is about 40 weeks later. The calculator provides the calendar date automatically.","Ist der erste Tag der letzten Periode der 1. Januar und dauert der Zyklus durchschnittlich 28 Tage, liegt der geschätzte Geburtstermin etwa 40 Wochen später. Der Rechner gibt das konkrete Kalenderdatum automatisch aus."],
    ["Mit jelent például a 12. hét 3. nap?","What does 12 weeks and 3 days mean?","Was bedeutet zum Beispiel 12 Wochen und 3 Tage?"],
    ["Ez 12 teljesen eltelt hetet és további 3 napot jelent. A hétmegjelölés nem a magzat pontos fejlődési „korát” jelenti, hanem a terhesség egységesen használt időszámítását.","It means that 12 full weeks and a further 3 days have elapsed. This notation is the standard way of dating a pregnancy, not the fetus's exact developmental ‘age’.","Das bedeutet, dass 12 volle Wochen und weitere 3 Tage vergangen sind. Diese Angabe bezeichnet die einheitlich verwendete Schwangerschaftsdatierung und nicht das genaue Entwicklungsalter des Fötus."],
    ["Miért térhet el az ultrahang szerinti kor?","Why can ultrasound dating differ?","Warum kann die Datierung per Ultraschall abweichen?"],
    ["A naptári becslést befolyásolhatja a szabálytalan ciklus, a későbbi vagy korábbi ovuláció, a szoptatás, hormonális kezelés, nem pontosan felidézett menstruációs dátum vagy más egyéni tényező. Emiatt az egészségügyi datálás során az ultrahang és a klinikai adatok fontosabbak lehetnek, mint az otthoni kalkuláció.","Calendar dating can be affected by irregular cycles, earlier or later ovulation, breastfeeding, hormone treatment, an uncertain menstrual date and other individual factors. Ultrasound findings and clinical information may therefore be more important than a home calculation when dating a pregnancy.","Die Kalenderschätzung kann durch unregelmäßige Zyklen, frühere oder spätere Ovulation, Stillzeit, Hormonbehandlung, ein ungenau erinnertes Periodendatum und andere individuelle Faktoren beeinflusst werden. Für die medizinische Datierung können Ultraschall und klinische Angaben daher wichtiger sein als eine Berechnung zu Hause."],
    ["Mikor kevésbé megbízható a naptári módszer?","When is calendar dating less reliable?","Wann ist die Kalendermethode weniger zuverlässig?"],
    ["rendszertelen vagy nagyon változó ciklusoknál","with irregular or highly variable cycles","bei unregelmäßigen oder stark schwankenden Zyklen"],
    ["nemrég abbahagyott hormonális fogamzásgátlás után","after recently stopping hormonal contraception","nach kürzlich abgesetzter hormoneller Verhütung"],
    ["szoptatás mellett visszatérő ciklusoknál","when cycles return during breastfeeding","bei wiederkehrenden Zyklen während der Stillzeit"],
    ["asszisztált reprodukciós eljárásoknál, ahol más dátumok állnak rendelkezésre","after assisted reproduction, where more precise treatment dates are available","bei assistierter Reproduktion, wenn genauere Behandlungsdaten vorliegen"],
    ["ha az utolsó menstruáció kezdőnapja bizonytalan","if the first day of the last menstrual period is uncertain","wenn der Beginn der letzten Periode unsicher ist"],
    ["A kiírt nap nem biztos szülési nap","The due date is not a guaranteed delivery date","Der errechnete Termin ist kein garantiertes Geburtsdatum"],
    ["A terminus egy becsült középnap. A normál terhesség és a szülés időzítése egyénenként eltérhet, ezért a dátumot érdemes tervezési támpontként kezelni, nem pontos előrejelzésként.","The due date is an estimated midpoint. The length of a normal pregnancy and the timing of birth vary, so use the date as a planning guide rather than an exact prediction.","Der Geburtstermin ist ein geschätzter Mittelwert. Dauer einer normalen Schwangerschaft und Zeitpunkt der Geburt sind individuell verschieden; nutze das Datum daher als Planungshilfe, nicht als genaue Vorhersage."],
    ["Mire használható jól?","What is the estimate useful for?","Wofür ist die Schätzung geeignet?"],
    ["a terhességi hét hozzávetőleges meghatározására","estimating the current week of pregnancy","zur ungefähren Bestimmung der Schwangerschaftswoche"],
    ["orvosi időpontok előzetes tervezésére","preliminary planning of medical appointments","zur vorläufigen Planung medizinischer Termine"],
    ["a várható időszak naptári áttekintésére","viewing the expected period on a calendar","für einen Kalenderüberblick über den erwarteten Zeitraum"],
    ["annak megértésére, hogyan számolják a terhességi heteket","understanding how pregnancy weeks are counted","zum Verständnis der Zählweise von Schwangerschaftswochen"],
    ["Gyakori hibák","Common mistakes","Häufige Fehler"],
    ["Az utolsó vérzés utolsó napját adják meg az első helyett.","Entering the last day of the last period instead of the first.","Den letzten statt des ersten Tages der letzten Periode eingeben."],
    ["A ciklushosszt összekeverik a vérzéses napok számával.","Confusing cycle length with the number of bleeding days.","Die Zykluslänge mit der Anzahl der Blutungstage verwechseln."],
    ["A becsült terminust biztos szülési napnak tekintik.","Treating the estimated due date as a guaranteed delivery date.","Den geschätzten Termin als garantiertes Geburtsdatum ansehen."],
    ["Szabálytalan ciklusnál túl pontosnak gondolják az eredményt.","Assuming the result is precise despite irregular cycles.","Das Ergebnis trotz unregelmäßiger Zyklen für zu genau halten."],
    ["Panasz esetén a kalkulátort egészségügyi vizsgálat helyett használják.","Using the calculator instead of seeking medical assessment for symptoms.","Bei Beschwerden den Rechner anstelle einer medizinischen Untersuchung nutzen."],
    ["Mikor ne csak kalkulátorra hagyatkozz?","When should you not rely on a calculator alone?","Wann solltest du dich nicht allein auf einen Rechner verlassen?"],
    ["Erős vagy egyoldali fájdalom, jelentős vérzés, ájulás, nehézlégzés, láz vagy más aggasztó panasz esetén ne a kalkuláció alapján dönts, hanem kérj megfelelő egészségügyi segítséget.","If you have severe or one-sided pain, heavy bleeding, fainting, shortness of breath, fever or other worrying symptoms, do not make decisions from this calculation; seek appropriate medical care.","Bei starken oder einseitigen Schmerzen, erheblicher Blutung, Ohnmacht, Atemnot, Fieber oder anderen besorgniserregenden Beschwerden solltest du nicht nach dieser Berechnung entscheiden, sondern angemessene medizinische Hilfe suchen."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],
    ["Pontosan a kiírt napon születik a baba?","Will the baby be born exactly on the due date?","Kommt das Baby genau am errechneten Termin zur Welt?"],
    ["Nem feltétlenül. A terminus becslés, nem garantált szülési dátum.","Not necessarily. The due date is an estimate, not a guaranteed delivery date.","Nicht unbedingt. Der Geburtstermin ist eine Schätzung und kein garantiertes Geburtsdatum."],
    ["Szabálytalan ciklusnál használható?","Can I use it with irregular cycles?","Kann ich den Rechner bei unregelmäßigen Zyklen verwenden?"],
    ["Igen, de csak durva becslésként; ilyenkor a klinikai datálás megbízhatóbb lehet.","Yes, but only as a rough estimate; clinical dating may be more reliable in this situation.","Ja, aber nur als grobe Schätzung; in diesem Fall kann die klinische Datierung zuverlässiger sein."],
    ["IVF esetén megfelelő?","Is it suitable after IVF?","Ist der Rechner nach einer IVF geeignet?"],
    ["Nem ez a legjobb módszer, mert ott a kezeléshez és embriótranszferhez kapcsolódó dátumok pontosabb kiindulást adhatnak.","It is not the preferred method because treatment and embryo-transfer dates can provide a more accurate starting point.","Dies ist nicht die bevorzugte Methode, da Behandlungs- und Embryotransferdaten einen genaueren Ausgangspunkt liefern können."],
    ["Miért számít a kalkulátor már a fogamzás előtti időből?","Why does the calculator count time before conception?","Warum zählt der Rechner bereits die Zeit vor der Empfängnis?"],
    ["Mert a terhességi kort egységesen az utolsó menstruáció első napjától számítják.","Because gestational age is conventionally counted from the first day of the last menstrual period.","Weil das Schwangerschaftsalter einheitlich ab dem ersten Tag der letzten Periode gezählt wird."],
    ["Mikor kérjek sürgős segítséget?","When should I seek urgent help?","Wann sollte ich dringend Hilfe suchen?"],
    ["Erős fájdalom, jelentős vérzés, ájulás, nehézlégzés vagy más súlyos panasz esetén mielőbb kérj egészségügyi ellátást.","Seek medical care promptly for severe pain, heavy bleeding, fainting, shortness of breath or other serious symptoms.","Suche bei starken Schmerzen, erheblicher Blutung, Ohnmacht, Atemnot oder anderen schweren Beschwerden umgehend medizinische Hilfe."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],["Dátumkülönbség","Date difference","Datumsdifferenz"],["Életkor kalkulátor","Age Calculator","Altersrechner"],["Folyadékigény","Fluid needs","Flüssigkeitsbedarf"],
    ["Utolsó tartalmi frissítés:","Last content update:","Letzte inhaltliche Aktualisierung:"],["2026. augusztus 8.","8 August 2026","8. August 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limitations","Verlässlichkeit und Berechnungsgrenzen"],
    ["Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.","The result is for general information only. It is not a diagnosis and does not replace a medical assessment or personalised treatment advice.","Das Ergebnis dient nur der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    ["A számítások módszertana és minőségbiztosítása","Calculation methodology and quality assurance","Berechnungsmethodik und Qualitätssicherung"],["Hibát találtál? Jelezd nekünk.","Found an issue? Let us know.","Einen Fehler gefunden? Sag uns Bescheid."],
    ["Terhességi dátumozás – forráshierarchia","Pregnancy dating — hierarchy of evidence","Schwangerschaftsdatierung – Rangfolge der Grundlagen"],
    ["A menstruáció alapján számolt dátum csak az első becslés","Dating from the last period is only the first estimate","Die Datierung anhand der Periode ist nur eine erste Schätzung"],
    ["Utolsó menstruáció","Last menstrual period","Letzte Periode"],["Gyors kiindulópont, ha a ciklus és a dátum ismert.","A quick starting point when the cycle and date are known.","Ein schneller Ausgangspunkt, wenn Zyklus und Datum bekannt sind."],
    ["Korai ultrahang","Early ultrasound","Früher Ultraschall"],["Az első trimeszteri ultrahang fontos a terhességi kor megerősítéséhez vagy pontosításához.","A first-trimester ultrasound is important for confirming or refining gestational age.","Ein Ultraschall im ersten Trimester ist wichtig, um das Schwangerschaftsalter zu bestätigen oder genauer zu bestimmen."],
    ["Asszisztált reprodukció","Assisted reproduction","Assistierte Reproduktion"],["ART/IVF esetén a beavatkozásból származó terhességi kor alapján határozzák meg a várható időpontot.","After ART/IVF, the due date is determined using gestational age derived from the procedure.","Bei ART/IVF wird der Geburtstermin anhand des aus der Behandlung abgeleiteten Schwangerschaftsalters bestimmt."],
    ["Egészségügyi határ:","Medical safety note:","Medizinischer Sicherheitshinweis:"],["A kalkulátor nem terhesgondozási eszköz. Vérzés, erős fájdalom, rosszullét vagy bármilyen aggasztó tünet esetén egészségügyi ellátás szükséges, nem újraszámolás.","This calculator is not a prenatal-care tool. Bleeding, severe pain, feeling unwell or any worrying symptom requires medical care, not another calculation.","Dieser Rechner ist kein Instrument der Schwangerschaftsvorsorge. Bei Blutungen, starken Schmerzen, Unwohlsein oder anderen besorgniserregenden Symptomen ist medizinische Versorgung erforderlich, keine erneute Berechnung."],
    ["Forrás és ellenőrzési alap","Sources and review basis","Quellen und Prüfgrundlage"],["ACOG – Methods for Estimating the Due Date","ACOG – Methods for Estimating the Due Date","ACOG – Methoden zur Bestimmung des Geburtstermins"],["A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.","This calculator is an informational aid; it does not replace individual medical or legal advice.","Dieser Rechner dient der Information und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    ["Terhességi datálás: ciklus és IVF külön","Pregnancy dating: cycles and IVF require different inputs","Schwangerschaftsdatierung: Zyklus und IVF getrennt betrachten"],
    ["A menstruációból számított terminus becslés. IVF esetén az embriótranszfer dátuma és az embrió életkora alkalmasabb kiindulópont.","A due date calculated from the last period is an estimate. After IVF, the embryo-transfer date and embryo age provide a better starting point.","Ein aus der letzten Periode berechneter Termin ist eine Schätzung. Nach IVF sind das Datum des Embryotransfers und das Alter des Embryos der bessere Ausgangspunkt."],
    ["Számítás módja","Calculation method","Berechnungsmethode"],["Utolsó menstruáció","Last menstrual period","Letzte Periode"],["IVF embriótranszfer","IVF embryo transfer","IVF-Embryotransfer"],
    ["Utolsó menstruáció első napja","First day of the last menstrual period","Erster Tag der letzten Periode"],["Átlagos ciklushossz","Average cycle length","Durchschnittliche Zykluslänge"],
    ["Embriótranszfer dátuma","Embryo-transfer date","Datum des Embryotransfers"],["Embrió életkora a transzferkor","Embryo age at transfer","Alter des Embryos beim Transfer"],
    ["5 napos blastocysta","5-day blastocyst","5 Tage alte Blastozyste"],["3 napos embrió","3-day embryo","3 Tage alter Embryo"],
    ["Becsült terminus","Estimated due date","Geschätzter Geburtstermin"],["Az oldal megnyitásakor frissül","Updates when the page opens","Wird beim Öffnen der Seite aktualisiert"],
    ["Számítás alapja","Basis of calculation","Berechnungsgrundlage"],["28 napos átlagos ciklusból","From a 28-day average cycle","Aus einem durchschnittlichen 28-Tage-Zyklus"],
    ["Bizonytalanság","Uncertainty","Unsicherheit"],["orvosi datálás felülírhatja","clinical dating may supersede this estimate","die klinische Datierung kann diese Schätzung ersetzen"],
    ["Sürgős ellátás:","Urgent care:","Dringende Hilfe:"],["erős vagy egyoldali alhasi fájdalom, jelentős vérzés, ájulás, nehézlégzés vagy súlyos rosszullét esetén ne kalkulátorra várj, hanem kérj azonnal egészségügyi segítséget.","if you have severe or one-sided lower abdominal pain, heavy bleeding, fainting, shortness of breath or feel seriously unwell, do not wait for a calculator; seek medical help immediately.","Warte bei starken oder einseitigen Unterbauchschmerzen, erheblicher Blutung, Ohnmacht, Atemnot oder schwerem Unwohlsein nicht auf einen Rechner, sondern suche sofort medizinische Hilfe."],
    ["Források és módszertani ellenőrzés","Sources and methodology review","Quellen und methodische Prüfung"],["NHS – Due date calculator and pregnancy guidance","NHS – Due date calculator and pregnancy guidance","NHS – Geburtsterminrechner und Hinweise zur Schwangerschaft"],["Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.","This is an informational calculator; individual decisions require advice from a professional or official source.","Dieser Rechner dient der Information. Für individuelle Entscheidungen sind Fachleute oder offizielle Stellen heranzuziehen."],
    ["Módszertani frissítés:","Methodology updated:","Methodisch aktualisiert:"],["2026. július 15.","15 July 2026","15. Juli 2026"],["Hirdetés","Advertisement","Anzeige"],
    ["Kövesd az útmutatót a könyvjelző mentéséhez.","Follow the instructions to save this page as a bookmark.","Folge der Anleitung, um diese Seite als Lesezeichen zu speichern."],
    ["Hozzáadás a Főképernyőhöz","Add to Home Screen","Zum Startbildschirm hinzufügen"],
    ["Ezt a kalkulátort a Kalkulátor Bázison találtam.","I found this calculator on Kalkulátor Bázis.","Ich habe diesen Rechner auf Kalkulátor Bázis gefunden."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const months = { január:0, február:1, március:2, április:3, május:4, június:5, július:6, augusztus:7, szeptember:8, október:9, november:10, december:11 };
  function dynamic(value, language) {
    let match = /^(\d+)\. hét (\d+)\. nap$/u.exec(value);
    if (match) return language === "en" ? `${match[1]} weeks ${match[2]} days` : `${match[1]} Wochen ${match[2]} Tage`;
    match = /^(\d+(?:,\d+)?) → (\d+) nap$/u.exec(value);
    if (match) return `${language === "en" ? match[1].replace(",", ".") : match[1]} → ${match[2]} ${language === "en" ? "days" : "Tage"}`;
    match = /^(\d+) napos átlagos ciklusból$/u.exec(value);
    if (match) return language === "en" ? `From a ${match[1]}-day average cycle` : `Aus einem durchschnittlichen ${match[1]}-Tage-Zyklus`;
    match = /^(\d+) napos embrió transzferéből$/u.exec(value);
    if (match) return language === "en" ? `From the transfer of a ${match[1]}-day embryo` : `Aus dem Transfer eines ${match[1]} Tage alten Embryos`;
    match = /^(\d{4})\. ([a-záéíóöőúüű]+) (\d{1,2})\.$/u.exec(value);
    if (match && Object.hasOwn(months, match[2])) {
      const date = new Date(Date.UTC(Number(match[1]), months[match[2]], Number(match[3])));
      return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "de-DE", { year:"numeric", month:"long", day:"numeric", timeZone:"UTC" }).format(date);
    }
    return null;
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    return pair ? pair[language === "en" ? 0 : 1] : dynamic(normalized, language);
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source), heading = language === "en" ? "Pregnancy Due Date Calculator" : "Schwangerschaftsrechner";
    url.searchParams.set("subject", `${language === "en" ? "Error report" : "Fehlermeldung"} – ${heading}`);
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Pregnancy Due Date Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/terhessegi-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Schwangerschaftsrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/terhessegi-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages:Object.freeze([page]), dictionaries:Object.freeze({ [page]:dictionary }), dictionary, supported, translate, reportHref };
});

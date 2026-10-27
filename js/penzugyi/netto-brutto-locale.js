/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document) return;

  const document = root.document;
  const main = document.querySelector("main.page-netto");
  if (!main || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const textState = new WeakMap();
  const langState = new WeakMap();
  const attributeState = new WeakMap();
  let language = "hu";

  function annotate(parent, translated) {
    if (!parent) return;
    if (!attributeState.has(parent)) attributeState.set(parent, parent.getAttribute("lang"));
    if (translated) parent.setAttribute("lang", language);
    else {
      const previous = attributeState.get(parent);
      if (previous == null) parent.removeAttribute("lang");
      else parent.setAttribute("lang", previous);
    }
  }

  function updateText(node) {
    const current = node.nodeValue;
    const last = textState.get(node);
    const canonical = last && current === last.displayed ? last.canonical : current;
    if (!canonical || !canonical.trim()) return;
    const ws = /^(\s*)([\s\S]*?)(\s*)$/.exec(canonical);
    if (!ws) return;
    const replacement = api.translate(ws[2], language);
    const desired = ws[1] + (replacement === null ? ws[2] : replacement) + ws[3];
    if (desired !== current) node.nodeValue = desired;
    if (replacement !== null || last) {
      textState.set(node, { canonical, displayed: desired });
      annotate(node.parentElement, language !== "hu" && replacement !== null);
    }
  }

  function walkText() {
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.parentElement?.closest("script, style, textarea, pre, code, [contenteditable]")) continue;
      updateText(node);
    }
  }

  function walkAttributes() {
    main.querySelectorAll("input[placeholder], textarea[placeholder], [aria-label]").forEach((el) => {
      for (const name of ["placeholder", "aria-label"]) {
        if (!el.hasAttribute(name)) continue;
        let state = langState.get(el);
        if (!state) {
          state = new Map();
          langState.set(el, state);
        }
        const value = el.getAttribute(name);
        const previous = state.get(name);
        const canonical = previous && value === previous.displayed ? previous.canonical : value;
        const translated = api.translate(canonical, language);
        const desired = translated === null ? canonical : translated;
        if (value !== desired) el.setAttribute(name, desired);
        state.set(name, { canonical, displayed: desired });
      }
    });
  }

  function refresh() {
    walkText();
    walkAttributes();
  }

  function choose(value) {
    language = api.supported.includes(value) ? value : "hu";
    refresh();
  }

  document.addEventListener("kb:language-changed", (event) => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get() || "hu");
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((change) => change.type === "childList" || change.type === "characterData")) refresh();
  });
  observer.observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  const exact = Object.freeze({
    "Új állásajánlatot kaptál, vagy fizetésemelésre készülsz? Add meg a havi bruttó béredet, és nézd meg a becsült nettót. Ha a kézhez kapott összegből indulnál ki, válaszd a Nettóból bruttó módot.": [
      "Received a job offer or expecting a raise? Enter your monthly gross salary to estimate your take-home pay. To start with a desired net salary, select Net to gross.",
      "Du hast ein Stellenangebot oder erwartest eine Gehaltserhöhung? Gib dein monatliches Bruttogehalt ein und sieh dir das geschätzte Nettogehalt an. Für einen gewünschten Nettobetrag wähle Netto zu Brutto."
    ],
    "Bruttóból nettó": ["Gross to net", "Brutto zu Netto"],
    "Nettóból bruttó": ["Net to gross", "Netto zu Brutto"],
    "Bruttó fizetés (Ft)": ["Gross salary (HUF)", "Bruttogehalt (HUF)"],
    "Nettó fizetés (Ft)": ["Net salary (HUF)", "Nettogehalt (HUF)"],
    "SZJA-kulcs": ["Income tax rate", "Einkommensteuersatz"],
    "15% – 2026-os szabály": ["15% – 2026 rate", "15 % – Steuersatz 2026"],
    "9% – összehasonlítás": ["9% – comparison only", "9 % – nur zum Vergleich"],
    "A 9%-os opció összehasonlító számítás. Nem a 2026-os hatályos SZJA-kulcs, és nem a végleges 2027-es szabálymodell.": [
      "The 9% option is for comparison only. It is not the applicable Hungarian income-tax rate for 2026 or a confirmed 2027 tax framework.",
      "Die 9-%-Option dient nur zum Vergleich. Sie ist weder der geltende ungarische Einkommensteuersatz für 2026 noch ein bestätigtes Regelwerk für 2027."
    ],
    "25 év alatti SZJA kedvezmény": ["Income tax relief for under-25s", "Einkommensteuervergünstigung für unter 25-Jährige"],
    "Első házas kedvezmény": ["First-married-couple tax relief", "Steuervergünstigung für frisch Verheiratete"],
    "Családi kedvezmény": ["Family tax relief", "Familiensteuervergünstigung"],
    "Eltartottak száma": ["Number of dependants", "Anzahl der Unterhaltsberechtigten"],
    "Kedvezményezett eltartottak száma": ["Number of eligible dependants", "Anzahl der begünstigten Angehörigen"],
    "Az eltartottak teljes száma, ez határozza meg az egy főre jutó kedvezmény mértékét.": [
      "The total number of dependants determines the per-person tax allowance.",
      "Die Gesamtzahl der Unterhaltsberechtigten bestimmt die Höhe der Steuervergünstigung pro Person."
    ],
    "Azok száma, akik után a családi kedvezmény ténylegesen érvényesíthető.": [
      "How many dependants actually qualify for the family tax relief.",
      "Anzahl der Angehörigen, für die die Familiensteuervergünstigung tatsächlich beansprucht werden kann."
    ],
    "A 2026-os alapértelmezett számítás 15% SZJA-, 18,5% TB-járulék- és 13% munkáltatói szocho-kulccsal dolgozik. A választható 9%-os SZJA külön összehasonlító forgatókönyv.": [
      "The default 2026 scenario uses 15% Hungarian personal income tax, 18.5% employee social security contributions and 13% employer social contribution tax. The optional 9% income tax is a separate comparison scenario.",
      "Die Standardberechnung 2026 verwendet 15 % ungarische Einkommensteuer, 18,5 % Sozialversicherungsbeiträge und 13 % Arbeitgeber-Sozialbeitragsteuer. Die optionale Einkommensteuer von 9 % ist ein gesondertes Vergleichsszenario."
    ],
    "Számítás…": ["Calculating…", "Berechnung läuft…"],
    "Ellenőrizd a beállításokat": ["Check your inputs", "Bitte Eingaben überprüfen"],
    "Most nem sikerült a számítás": ["Calculation unavailable", "Berechnung derzeit nicht möglich"],
    "Nettó fizetés:": ["Net salary:", "Nettogehalt:"],
    "Bruttó fizetés:": ["Gross salary:", "Bruttogehalt:"],
    "pl. 500 000": ["e.g. 500,000", "z. B. 500.000"],
    "pl. 332 500": ["e.g. 332,500", "z. B. 332.500"],
    "Az eltartottak száma 0 és 20 közötti egész szám legyen.": [
      "The number of dependants must be a whole number between 0 and 20.",
      "Die Zahl der Unterhaltsberechtigten muss eine ganze Zahl zwischen 0 und 20 sein."
    ],
    "A megadott adatok egyik kombinációját nem tudjuk kiszámolni. Nézd át a mezőket, majd próbáld újra.": [
      "This combination of inputs cannot be calculated. Review the fields and try again.",
      "Diese Eingabekombination kann nicht berechnet werden. Bitte Eingaben prüfen und erneut versuchen."
    ],
    "Most sok számítás érkezik egyszerre. Várj néhány másodpercet, majd próbáld újra.": [
      "Too many calculation requests at the moment. Wait a few seconds and try again.",
      "Derzeit gehen zu viele Berechnungsanfragen ein. Bitte einige Sekunden warten und erneut versuchen."
    ],
    "A számítás most átmenetileg nem sikerült. Próbáld újra néhány másodperc múlva.": [
      "The calculation is temporarily unavailable. Try again in a few seconds.",
      "Die Berechnung ist vorübergehend nicht verfügbar. Bitte in wenigen Sekunden erneut versuchen."
    ],
    "A számítás eredményét most nem tudtuk megjeleníteni. Próbáld újra néhány másodperc múlva.": [
      "We could not display the calculation result. Please try again shortly.",
      "Das Berechnungsergebnis konnte nicht angezeigt werden. Bitte bald erneut versuchen."
    ],
    "A számítás a szokásosnál tovább tartott. Próbáld újra néhány másodperc múlva.": [
      "The calculation took longer than expected. Please try again shortly.",
      "Die Berechnung hat länger als erwartet gedauert. Bitte bald erneut versuchen."
    ],
    "Most nem sikerült kapcsolódni a számításhoz. Ellenőrizd az internetkapcsolatot, majd próbáld újra.": [
      "Could not connect to the calculation service. Check your internet connection and try again.",
      "Verbindung zum Berechnungsdienst fehlgeschlagen. Bitte Internetverbindung prüfen und erneut versuchen."
    ],
    "Mennyi marad az ajánlott bruttó fizetésből?": ["How much of the offered gross salary will you take home?", "Wie viel bleibt vom angebotenen Bruttogehalt?"],
    "Mekkora bruttót kérj a kívánt nettóhoz?": ["What gross salary matches your target net pay?", "Welches Bruttogehalt entspricht deinem gewünschten Nettogehalt?"],
    "Konkrét példaszámítás": ["Worked example", "Konkretes Rechenbeispiel"],
    "Mit állíts be a kedvezményeknél?": ["How should you set the tax allowances?", "Wie stellst du Steuervergünstigungen ein?"],
    "Fontos tudni:": ["Important:", "Wichtig:"],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Havi költségvetés kalkulátor": ["Monthly budget calculator", "Monatsbudget-Rechner"],
    "Hitelképesség kalkulátor": ["Loan eligibility calculator", "Kreditwürdigkeitsrechner"],
    "Infláció kalkulátor": ["Inflation calculator", "Inflationsrechner"],
    "Órabér kalkulátor": ["Hourly wage calculator", "Stundenlohn-Rechner"],
    "Források és tájékoztatás:": ["Sources and information:", "Quellen und Hinweise:"],
    "FRISS HÍREK": ["LATEST NEWS", "AKTUELLE MELDUNGEN"],
    "Bérek és pénzügyek": ["Pay and personal finance", "Gehalt und Finanzen"],
    "Szeptemberi infláció: 1,6%": ["September inflation: 1.6%", "Inflation im September: 1,6 %"],
    "Jegybanki alapkamat: 5,50%": ["Central bank base rate: 5.50%", "Leitzins: 5,50 %"],
    "Összes friss hír →": ["All latest news →", "Alle aktuellen Meldungen →"],
    "Nettó–bruttó kalkulátor 2026": ["Gross to net salary calculator 2026", "Brutto-Netto-Rechner 2026"],
    "Újdonság: a Kalkulátor Bázis már ChatGPT-bővítményként is elérhető.": ["New: Calculator Base is now also available as a ChatGPT app.", "Neu: Kalkulator Bázis ist jetzt auch als ChatGPT-App verfügbar."],
    "A 2026-os nettó–bruttó számításokat a saját Kalkulátor Bázis Salary API végzi, így ugyanez a számítás közvetlenül ChatGPT-ből is használható.": ["The 2026 gross-to-net calculations run through the Kalkulátor Bázis Salary API, so you can also use the same calculation directly in ChatGPT.", "Die Brutto-Netto-Berechnungen für 2026 laufen über die Kalkulátor Bázis Salary API. Damit kannst du dieselbe Berechnung auch direkt in ChatGPT nutzen."],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Bookmark Calculator Base to return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulator Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Állást váltanál, de az ajánlatban csak a bruttó bér szerepel? Írd be az összeget a kalkulátorba. Az eredmény mellett külön látod az SZJA-t, a TB-járulékot és a becsült teljes munkáltatói költséget, így követhető, hogyan jutottunk el a nettóig.": ["Changing jobs, but the offer lists only gross pay? Enter it in the calculator. You will see personal income tax, employee social security contributions and estimated total employer cost separately, so you can follow how the net figure is calculated.", "Du wechselst den Job, aber im Angebot steht nur das Bruttogehalt? Gib den Betrag in den Rechner ein. Einkommensteuer, Sozialversicherungsbeiträge und geschätzte Arbeitgebergesamtkosten werden getrennt ausgewiesen, sodass der Weg zum Nettogehalt nachvollziehbar ist."],
    "Válaszd a Nettóból bruttó módot, majd add meg a havonta kézhez kapni kívánt összeget. A kedvezményeket ebben az irányban is állítsd be: ezek befolyásolják, mekkora bruttó bér kell ugyanahhoz a nettóhoz.": ["Select Net to gross and enter the amount you want to take home each month. Set your tax allowances in this mode too: they affect the gross salary needed to reach the same net pay.", "Wähle Netto zu Brutto und gib den gewünschten monatlichen Auszahlungsbetrag ein. Stelle auch in diesem Modus deine Steuervergünstigungen ein: Sie beeinflussen, welches Bruttogehalt für dasselbe Nettogehalt nötig ist."],
    "Például 600 000 Ft bruttó bérnél, kedvezmények nélkül 90 000 Ft SZJA és 111 000 Ft TB-járulék adódik, így a becsült nettó 399 000 Ft. Nettóból bruttó módban a program ugyanennek a számítási modellnek a visszafelé megoldását keresi, nem egyszerű osztással becsül.": ["For example, a gross salary of HUF 600,000 with no allowances results in HUF 90,000 income tax and HUF 111,000 in employee social security contributions, leaving estimated net pay of HUF 399,000. Net-to-gross mode solves the same model in reverse rather than using a simple division.", "Bei einem Bruttogehalt von 600.000 HUF ergeben sich ohne Vergünstigungen beispielsweise 90.000 HUF Einkommensteuer und 111.000 HUF Sozialversicherungsbeiträge. Das geschätzte Nettogehalt beträgt damit 399.000 HUF. Im Modus Netto zu Brutto löst der Rechner dasselbe Modell rückwärts, statt einfach durch einen Faktor zu teilen."],
    "Jelöld a rád érvényes, itt választható kedvezményeket. Családi kedvezménynél két mezőt találsz: az eltartottak száma határozza meg a kedvezmény mértékét, a kedvezményezett eltartottaké pedig azt, hány fő után veszi figyelembe a számítás.": ["Select the allowances that apply to you from those available here. Family tax relief has two fields: the total number of dependants determines the allowance, while the number of eligible dependants determines how many people the calculation applies it to.", "Wähle die hier verfügbaren Vergünstigungen aus, die auf dich zutreffen. Bei der Familienvergünstigung gibt es zwei Felder: Die Gesamtzahl der Unterhaltsberechtigten bestimmt die Höhe, die Zahl der begünstigten Angehörigen, für wie viele Personen sie in der Berechnung berücksichtigt wird."],
    "Ha a családi kedvezményt megosztjátok, egyeztessétek, ki mekkora részt érvényesít. A kalkulátor nem kér be megosztási arányt; az eredményt ehhez külön ellenőrizni kell.": ["If you share the family tax allowance, agree on how much each person claims. The calculator does not ask for a split, so check the result separately to account for it.", "Wenn ihr die Familienvergünstigung aufteilt, solltet ihr abstimmen, wer welchen Anteil geltend macht. Der Rechner fragt nicht nach der Aufteilung; prüfe das Ergebnis deshalb zusätzlich."],
    "A bérszámítás jogszabályi környezete és a kedvezmények rendszere változhat. Az eredmény tájékoztató jellegű, munkaszerződés, bérpapír vagy hivatalos döntés előtt ellenőrizd a munkáltatói/bérszámfejtési adatokat.": ["Salary rules and tax allowances may change. This estimate is for information only. Before relying on it for an employment contract, payslip or official decision, check with your employer or payroll provider.", "Rechtslage und Steuervergünstigungen können sich ändern. Das Ergebnis dient nur zur Orientierung. Prüfe vor einem Arbeitsvertrag, einer Gehaltsabrechnung oder einer behördlichen Entscheidung die Angaben des Arbeitgebers oder der Lohnbuchhaltung."],
    "A 25 év alatti kedvezménynél a kalkulátor a 2026-os havi 715 765 Ft-os adóalap-korlátot is figyelembe veszi. A családi kedvezményt először a fennmaradó SZJA-ból, majd a rendelkezésre álló TB-járulékból vonja le, ezért a nettó összeg nem nőhet a bruttó fölé.": ["For the under-25 tax relief, the calculator also applies the 2026 monthly tax-base cap of HUF 715,765. Family tax relief is deducted first from remaining income tax and then from available social security contributions, so net pay cannot exceed gross pay.", "Bei der Steuervergünstigung für unter 25-Jährige berücksichtigt der Rechner auch die monatliche Bemessungsgrundlage von 715.765 HUF für 2026. Die Familienvergünstigung wird zuerst von der verbleibenden Einkommensteuer und danach von den verfügbaren Sozialversicherungsbeiträgen abgezogen. Das Nettogehalt kann daher nicht höher als das Bruttogehalt sein."],
    "A modell nem kezeli többek között a 30 év alatti anyák, a két-, három-, illetve négy vagy több gyermeket nevelő anyák külön SZJA-mentességét, a személyi kedvezményt, a pótlékokat, letiltásokat, cafeteriát és egyedi bérszámfejtési tételeket.": ["The model does not cover, among other things, separate income-tax exemptions for mothers under 30 or mothers raising two, three, or four or more children, the personal tax allowance, premiums, garnishments, fringe benefits or individual payroll items.", "Das Modell berücksichtigt unter anderem nicht die gesonderten Einkommensteuerbefreiungen für Mütter unter 30 oder Mütter mit zwei, drei beziehungsweise mindestens vier Kindern, den persönlichen Steuerfreibetrag, Zulagen, Pfändungen, Sachleistungen oder individuelle Lohnabrechnungspositionen."],
    "Miért térhet el a kalkulátor eredménye a bérpapíromtól?": ["Why might the calculator result differ from my payslip?", "Warum kann das Rechnerergebnis von meiner Gehaltsabrechnung abweichen?"],
    "Ellenőrizd, ugyanazt a havi bruttó összeget és ugyanazokat a kedvezményeket adtad-e meg. A bérpapíron külön levonás, cafeteria vagy itt nem kezelt mentesség is szerepelhet. Ezeket a kalkulátor nem tudja a megadott bérből kitalálni.": ["Check that you entered the same monthly gross salary and tax allowances. Your payslip may include other deductions, fringe benefits or exemptions not covered here; the calculator cannot infer these from your salary.", "Prüfe, ob du dasselbe monatliche Bruttogehalt und dieselben Vergünstigungen eingegeben hast. Auf der Gehaltsabrechnung können weitere Abzüge, Sachleistungen oder hier nicht berücksichtigte Befreiungen stehen, die der Rechner aus dem Gehalt nicht ableiten kann."],
    "Bruttó vagy nettó bért érdemes megadni állásinterjún?": ["Should I discuss gross or net salary in a job interview?", "Sollte ich im Vorstellungsgespräch über Brutto- oder Nettogehalt sprechen?"],
    "A munkáltatók jellemzően bruttó bérben gondolkodnak, de neked a nettó mozgástér is fontos. Érdemes mindkettőt átszámolni.": ["Employers usually discuss gross salary, but your take-home pay matters too. It is useful to calculate both.", "Arbeitgeber sprechen üblicherweise über das Bruttogehalt, aber auch dein verfügbares Nettogehalt ist wichtig. Es lohnt sich, beides umzurechnen."],
    "Mit jelent a nettóból bruttó számítás?": ["What does a net-to-gross calculation mean?", "Was bedeutet die Berechnung von Netto zu Brutto?"],
    "Azt, hogy egy kívánt kézhez kapott összeghez becsüli meg a szükséges bruttó bért.": ["It estimates the gross salary needed to reach a desired take-home amount.", "Sie schätzt das nötige Bruttogehalt für einen gewünschten Auszahlungsbetrag."],
    "Kedvezményekkel is lehet számolni?": ["Can I include tax allowances?", "Kann ich Steuervergünstigungen berücksichtigen?"],
    "Igen: a 25 év alattiak kedvezményét, az első házasok kedvezményét és a családi kedvezményt állíthatod be. Az egyéb mentességeket és kedvezményeket ez a kalkulátor nem kezeli.": ["Yes. You can select the under-25 tax relief, the first-married-couple tax relief and the family tax relief. This calculator does not cover other exemptions or allowances.", "Ja. Du kannst die Vergünstigung für unter 25-Jährige, die Vergünstigung für frisch Verheiratete und die Familienvergünstigung auswählen. Andere Befreiungen oder Vergünstigungen berücksichtigt dieser Rechner nicht."],
    "Hivatalos bérszámfejtésre alkalmas?": ["Is this suitable for official payroll calculations?", "Eignet sich der Rechner für eine offizielle Lohnabrechnung?"],
    "Nem. Gyors tájékozódásra készült, hivatalos számításhoz bérszámfejtői vagy munkáltatói adat szükséges.": ["No. It is intended for a quick estimate; an official calculation requires payroll or employer data.", "Nein. Der Rechner dient der schnellen Orientierung. Für eine offizielle Berechnung sind Angaben der Lohnbuchhaltung oder des Arbeitgebers nötig."],
    "a kalkulátor a közzétett NAV és hivatalos adózási információk alapján készült. Az eredmény tájékoztató jellegű, nem minősül adó- vagy bérszámfejtési tanácsadásnak.": ["The calculator is based on published NAV and official tax information. The result is for guidance only and is not tax or payroll advice.", "Der Rechner basiert auf veröffentlichten NAV- und offiziellen Steuerinformationen. Das Ergebnis dient nur zur Orientierung und ist keine Steuer- oder Lohnabrechnungsberatung."],
    "NAV személyi jövedelemadó információk": ["NAV personal income tax information", "NAV-Informationen zur Einkommensteuer"],
    "NAV adókulcsok és járulékmértékek": ["NAV tax and contribution rates", "NAV-Steuer- und Beitragssätze"],
    "NAV 25 év alattiak kedvezménye": ["NAV tax relief for under-25s", "NAV-Steuervergünstigung für unter 25-Jährige"],
    "NAV első házasok kedvezménye": ["NAV tax relief for newlyweds", "NAV-Steuervergünstigung für frisch Verheiratete"],
    "NAV családi adókedvezmény-kalkulátor": ["NAV family tax relief calculator", "NAV-Rechner für Familiensteuervergünstigungen"],
    "A beépített 2026-os adóparamétereket hivatalos források alapján ellenőriztük:": ["The built-in 2026 tax parameters were checked against official sources:", "Die integrierten Steuerparameter für 2026 wurden anhand offizieller Quellen geprüft:"],
    "2026. augusztus 7.": ["August 7, 2026", "7. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény tájékoztató becslés, nem pénzügyi, befektetési vagy adótanács, hitelajánlat vagy garantált eredmény. Döntés előtt ellenőrizd az aktuális feltételeket és szükség esetén kérj szakértői segítséget.": ["The result is an informational estimate, not financial, investment or tax advice, a loan offer or a guaranteed outcome. Check current terms before deciding and seek professional help if needed.", "Das Ergebnis ist eine unverbindliche Schätzung, keine Finanz-, Anlage- oder Steuerberatung, kein Kreditangebot und kein garantiertes Ergebnis. Prüfe vor einer Entscheidung die aktuellen Bedingungen und hole bei Bedarf fachkundigen Rat ein."],
    "A számítások módszertana és minőségbiztosítása": ["Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.": ["Found an issue? Let us know.", "Einen Fehler gefunden? Sag uns Bescheid."],
    "Bérdöntési ellenőrző": ["Salary decision checklist", "Checkliste für Gehaltsentscheidungen"],
    "Mit ellenőrizz, mielőtt a nettó eredményre támaszkodsz?": ["What to check before relying on the net salary estimate", "Was du prüfen solltest, bevor du dich auf die Nettoschätzung verlässt"],
    "Jogosultság": ["Eligibility", "Anspruchsberechtigung"],
    "A kedvezmény nem csak életkor vagy gyermekszám kérdése: a jogosultság kezdete, sorrendje és megosztása is számíthat.": ["Eligibility for an allowance may depend on more than age or the number of children; when it starts, its priority and whether it is shared can also matter.", "Ob du Anspruch auf eine Vergünstigung hast, hängt nicht nur von Alter oder Kinderzahl ab. Auch Beginn, Reihenfolge und Aufteilung können eine Rolle spielen."],
    "Bérösszetevők": ["Pay components", "Gehaltsbestandteile"],
    "Pótlék, bónusz, jutalom, cafeteria, letiltás vagy több jogviszony miatt a bérpapír eltérhet egy alapbérre készült becsléstől.": ["Allowances, bonuses, rewards, fringe benefits, garnishments or multiple jobs can make a payslip differ from an estimate based on base salary.", "Zulagen, Boni, Prämien, Sachleistungen, Pfändungen oder mehrere Beschäftigungsverhältnisse können dazu führen, dass die Gehaltsabrechnung von einer Schätzung auf Basis des Grundgehalts abweicht."],
    "Visszafelé nem egyszerű osztás történik: kedvezmények és korlátok miatt a szükséges bruttó összeg lépcsősen is változhat.": ["The reverse calculation is not a simple division: allowances and caps can make the required gross amount change in steps.", "Die Rückrechnung ist keine einfache Division: Durch Vergünstigungen und Obergrenzen kann sich das erforderliche Bruttogehalt stufenweise ändern."],
    "2026-os ellenőrzési pont": ["2026 check", "Prüfpunkt für 2026"],
    "A 25 év alattiak kedvezményének havi adóalap-korláta 2026-ban 715 765 Ft. A kalkulátor ezt a korlátot kezeli, de nem modellez minden létező személyi jövedelemadó-kedvezményt.": ["The monthly tax-base cap for the under-25 tax relief is HUF 715,765 in 2026. The calculator applies this cap but does not model every personal income tax allowance.", "Die monatliche Bemessungsgrundlagen-Obergrenze für die Steuervergünstigung unter 25-Jähriger beträgt 2026 715.765 HUF. Der Rechner berücksichtigt diese Grenze, aber nicht alle Einkommensteuervergünstigungen."],
    "Elsődleges forrás:": ["Primary sources:", "Primärquellen:"],
    "NAV – 25 év alattiak kedvezménye": ["NAV – tax relief for under-25s", "NAV – Steuervergünstigung für unter 25-Jährige"],
    "NAV – adókulcsok és járulékmértékek": ["NAV – tax and contribution rates", "NAV – Steuer- und Beitragssätze"],
    "Mikor ne ezt használd?": ["When should you not rely on this calculator?", "Wann solltest du dich nicht auf diesen Rechner verlassen?"],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ha több speciális kedvezmény, több munkáltató, külföldi adózás, egyéni vállalkozói jogviszony vagy összetett bérszámfejtés érintett, a kalkuláció legyen csak előzetes kontroll.": ["If several special allowances, multiple employers, foreign taxation, self-employment or complex payroll rules apply, use this calculation only as an initial cross-check.", "Bei mehreren Sondervergünstigungen, mehreren Arbeitgebern, ausländischer Besteuerung, selbstständiger Tätigkeit oder komplexer Lohnabrechnung sollte diese Berechnung nur eine erste Orientierung sein."]
,
    "Az eredmény után": ["After your result", "Nach deinem Ergebnis"],
    "Becsüld meg, mekkora törlesztés férhet bele a jövedelmedbe.": [
      "Estimate what monthly loan payment could fit your income.",
      "Schätze ein, welche monatliche Kreditrate zu deinem Einkommen passen könnte."
    ],
    "Ellenőrizd a Wise aktuális díjait, feltételeit és elérhető funkcióit.": [
      "Check Wise's current fees, terms and available features.",
      "Prüfe die aktuellen Gebühren, Bedingungen und Funktionen von Wise."
    ],
    "Havi költségvetés": ["Monthly budget", "Monatsbudget"],
    "Hirdetés": ["Advertisement", "Anzeige"],
    "Hitelképesség": ["Loan eligibility", "Kreditwürdigkeit"],
    "Kalkulátor Bázis ChatGPT-bővítmény": ["Kalkulátor Bázis ChatGPT app", "Kalkulátor Bázis ChatGPT-App"],
    "Kapcsolódó friss hírek": ["Related news", "Passende aktuelle Meldungen"],
    "Külföldről kapsz fizetést vagy több pénznemben kezelnéd a pénzed?": [
      "Paid from abroad or managing money in several currencies?",
      "Wirst du aus dem Ausland bezahlt oder verwaltest du Geld in mehreren Währungen?"
    ],
    "Mennyi marad a fizetésedből hó végére?": [
      "How much of your salary is left at the end of the month?",
      "Wie viel von deinem Gehalt bleibt am Monatsende übrig?"
    ],
    "Mentési, telepítési és megosztási műveletek": [
      "Bookmark, install and sharing options",
      "Optionen zum Speichern, Installieren und Teilen"
    ],
    "Nettó - bruttó kalkulátor": ["Net-to-gross salary calculator", "Netto-Brutto-Rechner"],
    "Nézd meg, mennyi maradhat kiadások és megtakarítás után.": [
      "See how much may remain after expenses and savings.",
      "Sieh nach, wie viel nach Ausgaben und Ersparnissen übrig bleiben könnte."
    ],
    "Partnerlink. Az aktuális díjakat és feltételeket a Wise oldalán ellenőrizd.": [
      "Partner link. Check Wise's website for current fees and terms.",
      "Partnerlink. Die aktuellen Gebühren und Bedingungen findest du auf der Wise-Website."
    ],
    "Pénzügyi tervezéshez": ["For financial planning", "Für deine Finanzplanung"],
    "Wise feltételek →": ["Wise terms →", "Wise-Bedingungen →"],
    "Írd össze a havi kiadásaidat a költségvetés-kalkulátorban. Ha hitelt tervezel, a becsült törlesztési keretet is megnézheted.": [
      "List your monthly expenses in the budget calculator. If you are planning to borrow, you can also check an estimated affordable payment.",
      "Erfasse deine monatlichen Ausgaben im Budgetrechner. Wenn du einen Kredit planst, kannst du auch eine geschätzte tragbare Rate prüfen."
    ]
  });
  const page = "netto-brutto-kalkulator";
  const prefixes = Object.freeze({
    "Bruttó fizetés:": ["Gross salary:", "Bruttogehalt:"],
    "Becsült nettó:": ["Estimated net salary:", "Geschätztes Nettogehalt:"],
    "Fizetendő TB-járulék:": ["Employee social security contributions:", "Arbeitnehmer-Sozialversicherungsbeiträge:"],
    "Ezen a kereseten érvényesített családi kedvezmény:": ["Family tax relief applied to this salary:", "Auf dieses Gehalt angewandte Familiensteuervergünstigung:"],
    "Felhasznált első házas kedvezmény:": ["First-married tax relief used:", "Genutzte Steuervergünstigung für frisch Verheiratete:"],
    "25 év alatti kedvezményből felhasználva:": ["Under-25 tax relief used:", "Genutzte Steuervergünstigung für unter 25-Jährige:"],
    "Becsült teljes munkáltatói költség:": ["Estimated total employer cost:", "Geschätzte gesamte Arbeitgeberkosten:"]
  });
  const dynamic = [
    [/^Fizetendő SZJA \((\d+(?:[.,]\d+)?%)\):(.*)$/u,
      (lang, match) => (lang === "en" ? "Income tax payable" : "Zu zahlende Einkommensteuer") +
        " (" + match[1] + "):" + match[2]],
    [/^Becsült nettó:(.*)\(cél:(.*)\)$/u,
      (lang, match) => (lang === "en" ? "Estimated net pay:" : "Geschätztes Nettogehalt:") +
        match[1] + "(" + (lang === "en" ? "target:" : "Ziel:") + match[2] + ")"]
  ];
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(pageOrValue, valueOrLanguage, requestedLanguage) {
    const scoped = requestedLanguage !== undefined;
    if (scoped && pageOrValue !== page) return null;
    const value = scoped ? valueOrLanguage : pageOrValue;
    const lang = scoped ? requestedLanguage : valueOrLanguage;
    if (!supported.includes(lang) || lang === "hu") return null;
    const index = lang === "en" ? 0 : 1;
    if (Object.prototype.hasOwnProperty.call(exact, value)) return exact[value][index];
    for (const [pattern, builder] of dynamic) {
      const match = value.match(pattern);
      if (match) return builder(lang, match);
    }
    for (const [source, texts] of Object.entries(prefixes)) {
      if (value.startsWith(source) && /\s/.test(value.charAt(source.length))) {
        return texts[index] + value.slice(source.length);
      }
    }
    return null;
  }
  return { pages: [page], dictionaries: Object.freeze({ [page]: exact }), translate, supported, exact, prefixes };
});
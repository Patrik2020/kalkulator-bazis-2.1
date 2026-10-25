/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const document = root.document;
  const main = document.querySelector("main.page-koltsegvetes");
  if (!main) return;
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  let language = root.KB_SITE_LANGUAGE?.get() || "hu";
  let observer;
  const blocked = 'script,style,textarea,pre,code,input,select,[contenteditable],[translate="no"]';
  function render() {
    observer?.disconnect();
    try {
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest(blocked)) continue;
        const previous = textRecords.get(node);
        const source = previous?.rendered === node.nodeValue ? previous.source : node.nodeValue;
        const match = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
        if (!match || !match[2]) continue;
        const translated = api.translate(match[2], language);
        const rendered = match[1] + (translated === null ? match[2] : translated) + match[3];
        if (node.nodeValue !== rendered) node.nodeValue = rendered;
        textRecords.set(node, { source, rendered });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach((element) => {
        if (element.closest('script,style,textarea,pre,code,[contenteditable],[translate="no"]')) return;
        let records = attributeRecords.get(element);
        if (!records) { records = new Map(); attributeRecords.set(element, records); }
        for (const name of ["aria-label", "placeholder", "title"]) {
          if (!element.hasAttribute(name)) continue;
          const current = element.getAttribute(name);
          const previous = records.get(name);
          const source = previous?.rendered === current ? previous.source : current;
          const translated = api.translate(source, language);
          const rendered = translated ?? source;
          if (current !== rendered) element.setAttribute(name, rendered);
          records.set(name, { source, rendered });
        }
      });
    } finally {
      observer?.observe(main, { subtree: true, childList: true, characterData: true });
    }
  }

  root.KB_BUDGET_LOCALE = Object.freeze({
    translateText: value => api.translate(String(value), language),
    getLanguage: () => language
  });
  document.addEventListener("kb:language-changed", (event) => {
    language = api.supported.includes(event.detail?.language) ? event.detail.language : "hu";
    render();
  });
  const ready = () => {
    observer = new MutationObserver(() => render());
    render();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const dictionary = Object.freeze({
    "Havi költségvetés kalkulátor": ["Monthly budget calculator", "Monatsbudget-Rechner"],
    "ETF kalkulátor": ["ETF calculator", "ETF-Rechner"], "Hitelképesség": ["Borrowing capacity", "Kreditfähigkeit"],
    "Az eredmény után": ["After your result", "Nach deinem Ergebnis"],
    "Használd fel a havi maradványt tudatosan": ["Put your monthly remainder to work", "Nutze deinen monatlichen Überschuss bewusst"],
    "Ha marad szabad összeg, érdemes megnézni, milyen hosszú távú célt tud támogatni. Ha szűk a keret, a hitelteher ellenőrzése lehet fontosabb.": ["If money remains, see which long-term goal it could support. If your budget is tight, checking your debt burden may be more useful.", "Wenn Geld übrig bleibt, prüfe, welches langfristige Ziel du damit unterstützen kannst. Bei knappem Budget kann es wichtiger sein, die Kreditbelastung zu überprüfen."],
    "Nézd meg, mit jelenthet hosszú távon a rendszeres megtakarítás.": ["See what regular savings could mean over the long term.", "Sieh dir an, was regelmäßiges Sparen langfristig bewirken kann."],
    "Ellenőrizd, mekkora hitelteher férhet bele biztonságosabban.": ["Check what level of debt may fit more safely.", "Prüfe, welche Kreditbelastung sich sicherer tragen lässt."],
    "Pénzügyi tervezéshez": ["For financial planning", "Für die Finanzplanung"],
    "Külföldről kapsz fizetést vagy több pénznemben kezelnéd a pénzed?": ["Receive income from abroad or manage money in several currencies?", "Erhältst du Einkommen aus dem Ausland oder verwaltest du Geld in mehreren Währungen?"],
    "Ellenőrizd a Wise aktuális díjait, feltételeit és elérhető funkcióit.": ["Check Wise's current fees, terms and available features.", "Prüfe die aktuellen Gebühren, Bedingungen und Funktionen von Wise."],
    "Wise feltételek": ["Wise terms", "Wise-Bedingungen"], "Wise feltételek →": ["Wise terms →", "Wise-Bedingungen →"],
    "Partnerlink. Az aktuális díjakat és feltételeket a Wise oldalán ellenőrizd.": ["Partner link. Check current fees and terms on the Wise website.", "Partnerlink. Prüfe die aktuellen Gebühren und Bedingungen auf der Wise-Website."],
    "Hirdetés": ["Advertisement", "Anzeige"],
    "Wise partnerajánlat megnyitása": ["Open Wise partner offer", "Wise-Partnerangebot öffnen"],
    "Nemzetközi pénzügyekhez Wise": ["Wise for international finances", "Wise für internationale Finanzen"],
    "Deviza, utalás és külföldi pénzkezelés egyszerűbben.": ["Manage currency exchange, transfers and money abroad more easily.", "Währungen, Überweisungen und Geld im Ausland einfacher verwalten."],
    "Tervezd meg a havi bevételeidet, kiadásaidat és megtakarítási arányodat.": ["Plan your monthly income, expenses and savings rate.", "Plane deine monatlichen Einnahmen, Ausgaben und Sparquote."],
    "Havi nettó bevétel (Ft)": ["Monthly net income (HUF)", "Monatliches Nettoeinkommen (HUF)"],
    "Lakhatás (Ft)": ["Housing (HUF)", "Wohnen (HUF)"], "Rezsi és előfizetések (Ft)": ["Utilities and subscriptions (HUF)", "Nebenkosten und Abonnements (HUF)"],
    "Élelmiszer (Ft)": ["Food (HUF)", "Lebensmittel (HUF)"], "Közlekedés (Ft)": ["Transport (HUF)", "Verkehr (HUF)"],
    "Hitel / tartozás (Ft)": ["Loan / debt (HUF)", "Kredit / Schulden (HUF)"], "Egyéb kiadások (Ft)": ["Other expenses (HUF)", "Sonstige Ausgaben (HUF)"],
    "Tervezett megtakarítás (Ft)": ["Planned savings (HUF)", "Geplante Ersparnis (HUF)"], "Havi egyenleg:": ["Monthly balance:", "Monatlicher Saldo:"],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Mentési, telepítési és megosztási műveletek": ["Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": ["Bookmark Calculator Base to return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulator Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"], "Telepítem": ["Install", "Installieren"], "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": ["Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Tipp:": ["Tip:", "Tipp:"], "Ha a havi egyenleged negatív, először a rendszeres, automatikusan ismétlődő kiadásokat érdemes átnézni.": ["If your monthly balance is negative, start by reviewing regular, recurring expenses.", "Wenn dein monatlicher Saldo negativ ist, überprüfe zuerst regelmäßige, wiederkehrende Ausgaben."],
    "Miért hasznos a havi költségvetés?": ["Why is a monthly budget useful?", "Warum ist ein Monatsbudget hilfreich?"],
    "A havi költségvetés segít átlátni, hogy a bevételeidből mennyi megy el lakhatásra, rezsire, élelmiszerre, közlekedésre, hitelekre és egyéb kiadásokra.": ["A monthly budget helps you see how much of your income goes to housing, utilities, food, transport, loans and other expenses.", "Ein Monatsbudget zeigt, wie viel deines Einkommens für Wohnen, Nebenkosten, Lebensmittel, Verkehr, Kredite und sonstige Ausgaben verwendet wird."],
    "Ha pontosan látod a havi egyenlegedet, könnyebb eldönteni, hogy mennyit tudsz félretenni, hol lehet csökkenteni a kiadásokat, és mennyire fenntartható a jelenlegi életmódod.": ["Once you know your monthly balance, it is easier to decide how much you can save, where you could reduce spending and whether your current lifestyle is sustainable.", "Mit einem klaren Überblick über deinen monatlichen Saldo lässt sich leichter entscheiden, wie viel du sparen kannst, wo Ausgaben sinken könnten und ob dein Lebensstil nachhaltig ist."],
    "Mit mutat meg a kalkulátor?": ["What does the calculator show?", "Was zeigt der Rechner?"],
    "az összes havi kiadást,": ["total monthly expenses,", "die gesamten monatlichen Ausgaben,"], "a bevételhez viszonyított megtakarítási arányt,": ["the savings rate relative to income,", "die Sparquote im Verhältnis zum Einkommen,"],
    "a hónap végén várható egyenleget,": ["the expected balance at the end of the month,", "den voraussichtlichen Saldo am Monatsende,"], "és egy rövid értékelést arról, hogy stabil-e a költségvetésed.": ["and a brief assessment of whether your budget appears stable.", "sowie eine kurze Einschätzung, ob dein Budget stabil wirkt."],
    "A számítás menete": ["How the calculation works", "So funktioniert die Berechnung"],
    "A kalkulátor először összeadja a megadott kiadási kategóriákat: lakhatás, rezsi, élelmiszer, közlekedés, hitel vagy tartozás, egyéb kiadás és a tervezett megtakarítás. A havi egyenleg képlete:": ["The calculator first adds the expense categories you enter: housing, utilities, food, transport, loans or debt, other expenses and planned savings. The monthly balance is calculated as:", "Der Rechner addiert zunächst die eingegebenen Ausgabenkategorien: Wohnen, Nebenkosten, Lebensmittel, Verkehr, Kredit oder Schulden, sonstige Ausgaben und geplante Ersparnisse. Der monatliche Saldo wird so berechnet:"],
    "nettó bevétel - összes kiadás - tervezett megtakarítás": ["net income - total expenses - planned savings", "Nettoeinkommen - Gesamtausgaben - geplante Ersparnisse"],
    "A megtakarítási arány a tervezett megtakarítás és a nettó bevétel arányából készül. Ha a tervezett megtakarítást is kiadásként kezeled, a maradvány azt mutatja meg, hogy a hónap végén marad-e mozgástér váratlan tételekre.": ["The savings rate is planned savings divided by net income. When you count planned savings as an expense, the remaining balance shows whether you have room for unexpected costs at the end of the month.", "Die Sparquote entspricht den geplanten Ersparnissen geteilt durch das Nettoeinkommen. Wenn du geplante Ersparnisse als Ausgabe behandelst, zeigt der verbleibende Betrag, ob am Monatsende Spielraum für unerwartete Kosten bleibt."],
    "Gyakori hibák költségvetés készítésekor": ["Common budgeting mistakes", "Häufige Fehler bei der Budgetplanung"],
    "Az éves vagy negyedéves kiadásokat nem bontják havi átlagra.": ["Annual or quarterly expenses are not converted to a monthly average.", "Jährliche oder vierteljährliche Ausgaben werden nicht auf einen Monatsdurchschnitt umgelegt."],
    "A hitelkártyás költést csak a visszafizetés hónapjában számolják el.": ["Credit card spending is recorded only in the month it is repaid.", "Kreditkartenausgaben werden erst im Monat der Rückzahlung erfasst."],
    "A megtakarítást maradékként kezelik, nem előre tervezett tételként.": ["Savings are treated as whatever is left, rather than planned in advance.", "Ersparnisse werden als Restbetrag behandelt, statt sie vorab einzuplanen."],
    "Nem hagynak külön sort javításra, egészségügyi kiadásra vagy kisebb vészhelyzetre.": ["No separate amount is set aside for repairs, healthcare or minor emergencies.", "Für Reparaturen, Gesundheitskosten oder kleinere Notfälle wird kein eigener Betrag vorgesehen."],
    "Források és módszertani alap:": ["Sources and methodology:", "Quellen und methodische Grundlagen:"],
    "a háztartási költségvetés pénzügyi tervezési segédlet, nem hivatalos minősítés. A módszertani ellenőrzéshez az": ["a household budget is a financial planning aid, not an official assessment. For methodology checks, consult the", "Ein Haushaltsbudget ist eine Finanzplanungshilfe und keine amtliche Bewertung. Zur methodischen Prüfung empfiehlt sich der Vergleich mit dem"],
    "MNB háztartási költségvetés útmutatóját": ["MNB household budget guide", "MNB-Leitfaden zum Haushaltsbudget"], "MNB Háztartásiköltségvetés-számítóját": ["MNB household budget calculator", "MNB-Haushaltsbudget-Rechner"],
    "és az": ["and the", "sowie den"], "érdemes összevetési pontként használni.": ["as reference points.", "als Vergleichsgrundlage."],
    "A hónap végi maradvány legyen tervezett, ne véletlen": ["Plan the amount left at month end instead of leaving it to chance", "Plane den Betrag am Monatsende, statt ihn dem Zufall zu überlassen"],
    "A bevétel és a fő kiadási csoportok egy helyen megmutatják, mekkora összeg marad megtakarításra vagy váratlan tételekre. A legjobb bemenetet bankszámlakivonatból és több hónap átlagából kapod.": ["Income and major expense groups show how much remains for savings or unexpected costs. Bank statements and an average across several months provide a useful starting point.", "Einnahmen und Hauptausgaben zeigen gemeinsam, welcher Betrag zum Sparen oder für unerwartete Kosten bleibt. Kontoauszüge und der Durchschnitt mehrerer Monate sind eine gute Datengrundlage."],
    "A ritka kiadásokat alakítsd havi tétellé": ["Turn occasional expenses into monthly amounts", "Lege seltene Ausgaben auf den Monat um"],
    "Biztosítás, éves előfizetés, iskolakezdés vagy autószerviz akkor is része a költségvetésnek, ha nem minden hónapban jelentkezik. Ha az eredmény tartósan negatív, előbb a fix kötelezettségeket és a nagy változó kategóriákat vizsgáld meg.": ["Insurance, annual subscriptions, back-to-school costs and car servicing belong in your budget even when they do not occur every month. If the result stays negative, review fixed commitments and the largest variable categories first.", "Versicherungen, Jahresabos, Schulbeginn und Autowerkstatt gehören auch dann ins Budget, wenn sie nicht jeden Monat anfallen. Bei dauerhaft negativem Ergebnis solltest du zuerst feste Verpflichtungen und die größten variablen Kategorien prüfen."],
    "Költségvetési döntések": ["Budgeting decisions", "Budgetentscheidungen"],
    "A hitelkártyás vásárlást mikor számoljam el?": ["When should I record a credit card purchase?", "Wann sollte ich einen Kreditkartenkauf erfassen?"],
    "A költés hónapjában, különben a következő havi visszafizetés hamis képet adhat a fogyasztás időpontjáról.": ["In the month you make the purchase; otherwise, the repayment next month can distort when the spending occurred.", "Im Monat des Kaufs, sonst kann die Rückzahlung im Folgemonat den Zeitpunkt des Verbrauchs verzerren."],
    "Mekkora megtakarítási arány a jó?": ["What is a good savings rate?", "Welche Sparquote ist gut?"],
    "Nincs mindenkire érvényes százalék; a stabil, fenntartható és célhoz kötött összeg fontosabb.": ["There is no percentage that works for everyone; a stable, sustainable amount tied to your goals matters more.", "Es gibt keinen Prozentsatz, der für alle passt. Wichtiger ist ein stabiler, tragbarer und zielorientierter Betrag."],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Nettó-bruttó kalkulátor": ["Net-to-gross salary calculator", "Netto-Brutto-Rechner"], "Hitelképesség kalkulátor": ["Borrowing capacity calculator", "Kreditfähigkeits-Rechner"],
    "Hitel törlesztő kalkulátor": ["Loan repayment calculator", "Kreditraten-Rechner"], "Infláció kalkulátor": ["Inflation calculator", "Inflationsrechner"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"],
    "Az eredmény tájékoztató becslés, nem pénzügyi, befektetési vagy adótanács, hitelajánlat vagy garantált eredmény. Döntés előtt ellenőrizd az aktuális feltételeket és szükség esetén kérj szakértői segítséget.": ["The result is an informational estimate, not financial, investment or tax advice, a loan offer or a guaranteed outcome. Check current terms before deciding and seek professional help if needed.", "Das Ergebnis ist eine unverbindliche Schätzung, keine Finanz-, Anlage- oder Steuerberatung, kein Kreditangebot und kein garantiertes Ergebnis. Prüfe vor einer Entscheidung die aktuellen Bedingungen und hole bei Bedarf fachkundigen Rat ein."],
    "A számítások módszertana és minőségbiztosítása": ["Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"], "Hibát találtál? Jelezd nekünk.": ["Found an issue? Let us know.", "Einen Fehler gefunden? Sag uns Bescheid."],
    "Éves kiadások és vésztartalék": ["Annual expenses and emergency fund", "Jahresausgaben und Notgroschen"],
    "A havi költségvetésből gyakran pont a ritka tételek hiányoznak": ["Monthly budgets often miss occasional expenses", "Im Monatsbudget fehlen häufig gerade die seltenen Ausgaben"],
    "Biztosítás, szerviz, iskolakezdés, fogászat vagy éves előfizetés nem minden hónapban jelenik meg. Itt éves összegből havi céltartalékot, valamint az alapvető kiadásokból vésztartalék-célt számolhatsz.": ["Insurance, servicing, back-to-school costs, dental care and annual subscriptions do not appear every month. Use this panel to estimate a monthly reserve from annual costs and an emergency fund target from essential expenses.", "Versicherungen, Werkstatt, Schulbeginn, Zahnarzt und Jahresabos fallen nicht jeden Monat an. Hier kannst du aus Jahreskosten eine monatliche Rücklage und aus Grundausgaben einen Notgroschen-Zielbetrag berechnen."],
    "Éves ritka / időszakos kiadások összesen (Ft)": ["Total annual occasional expenses (HUF)", "Jährliche seltene / unregelmäßige Ausgaben insgesamt (HUF)"],
    "Vésztartalék cél (hónap)": ["Emergency fund target (months)", "Notgroschen-Ziel (Monate)"], "Havi céltartalék ritka kiadásokra": ["Monthly reserve for occasional expenses", "Monatliche Rücklage für seltene Ausgaben"],
    "Becsült alapvető havi kiadás": ["Estimated essential monthly expenses", "Geschätzte monatliche Grundausgaben"], "Vésztartalék-cél": ["Emergency fund target", "Notgroschen-Ziel"],
    "Az „alapvető” kiadás itt lakhatás + rezsi + élelmiszer + közlekedés + hitel. A saját helyzetedben más tétel is lehet nélkülözhetetlen.": ["Here, “essential” expenses mean housing + utilities + food + transport + loans. Other items may be essential in your situation.", "„Grundausgaben“ umfassen hier Wohnen + Nebenkosten + Lebensmittel + Verkehr + Kredite. In deiner Situation können weitere Posten unverzichtbar sein."],
    "Részletes havi költségvetés és vésztartalék": ["Detailed monthly budget and emergency fund", "Detailliertes Monatsbudget und Notgroschen"], "Háztartás nettó bevétele": ["Household net income", "Nettoeinkommen des Haushalts"],
    "Lakhatás": ["Housing", "Wohnen"], "Élelmiszer": ["Food", "Lebensmittel"], "Közlekedés": ["Transport", "Verkehr"], "Hitelek": ["Loans", "Kredite"],
    "Gyermek és család": ["Children and family", "Kinder und Familie"], "Egészség": ["Health", "Gesundheit"], "Szórakozás": ["Leisure", "Freizeit"], "Egyéb": ["Other", "Sonstiges"],
    "Jelenlegi vésztartalék": ["Current emergency fund", "Aktueller Notgroschen"], "Célzott tartalék (hónap)": ["Target reserve (months)", "Angestrebter Puffer (Monate)"],
    "Összes kiadás": ["Total expenses", "Gesamtausgaben"], "Összes kiadás:": ["Total expenses:", "Gesamtausgaben:"],
    "Havi maradvány": ["Monthly remainder", "Monatlicher Überschuss"], "Havi maradvány:": ["Monthly remainder:", "Monatlicher Überschuss:"],
    "Megtakarítási ráta": ["Savings rate", "Sparquote"], "Megtakarítási ráta:": ["Savings rate:", "Sparquote:"],
    "Alapvető havi kiadás": ["Essential monthly expenses", "Monatliche Grundausgaben"], "Alapvető havi kiadás:": ["Essential monthly expenses:", "Monatliche Grundausgaben:"],
    "Vésztartalék cél": ["Emergency fund target", "Notgroschen-Ziel"], "Vésztartalék cél:": ["Emergency fund target:", "Notgroschen-Ziel:"],
    "Tartalékhiány / többlet": ["Reserve shortfall / surplus", "Fehlbetrag / Überschuss der Rücklage"], "Tartalékhiány / többlet:": ["Reserve shortfall / surplus:", "Fehlbetrag / Überschuss der Rücklage:"],
    "Összesítő letöltése CSV-ben": ["Download summary as CSV", "Zusammenfassung als CSV herunterladen"],
    "Források és módszertani ellenőrzés": ["Sources and methodology check", "Quellen und methodische Prüfung"], "MNB – háztartási költségvetés és pénzügyi tervezés": ["MNB – household budgeting and financial planning", "MNB – Haushaltsbudget und Finanzplanung"],
    "Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.": ["This page provides an informational calculator; individual decisions may require advice from a professional or information from an official body.", "Diese Seite bietet einen Informationsrechner. Für individuelle Entscheidungen können fachkundige Beratung oder Angaben einer Behörde erforderlich sein."],
    "Módszertani frissítés:": ["Methodology updated:", "Methodik aktualisiert:"], "2026. július 15.": ["15 July 2026", "15. Juli 2026"],
    "Összes kiadás megtakarítással együtt": ["Total expenses including savings", "Gesamtausgaben einschließlich Ersparnis"], "Megtakarítási arány": ["Savings rate", "Sparquote"],
    "A költségvetés negatív, érdemes csökkenteni valamelyik kiadási kategóriát.": ["Your budget is negative; consider reducing one of the expense categories.", "Dein Budget ist negativ. Prüfe, ob sich eine Ausgabenkategorie reduzieren lässt."],
    "Erős megtakarítási arány, a költségvetésed stabilnak tűnik.": ["Your savings rate is strong and your budget appears stable.", "Deine Sparquote ist hoch und dein Budget wirkt stabil."],
    "Egészséges irány, de még van tér a megtakarítás növelésére.": ["This is a healthy direction, with room to increase savings further.", "Das ist eine gute Entwicklung, mit weiterem Spielraum für höhere Ersparnisse."],
    "Alacsony megtakarítási arány, érdemes tartalékot építeni.": ["Your savings rate is low; consider building a reserve.", "Deine Sparquote ist niedrig. Der Aufbau einer Rücklage kann sinnvoll sein."],
    "Nincs mindenkire érvényes százalék": ["There is no percentage that works for everyone", "Es gibt keinen Prozentsatz, der für alle passt"],
    "Kategória": ["Category", "Kategorie"], "Havi összeg": ["Monthly amount", "Monatsbetrag"], "Bevétel": ["Income", "Einnahmen"],
    "Rezsi": ["Utilities", "Nebenkosten"], "Hitel": ["Loan", "Kredit"], "Ritka kiadások": ["Occasional expenses", "Seltene Ausgaben"],
    "Éves kiadások összesen": ["Total annual expenses", "Jährliche Gesamtausgaben"], "Havi céltartalék": ["Monthly reserve", "Monatliche Rücklage"],
    "Háztartási költségvetés": ["Household budget", "Haushaltsbudget"], "Megtakarítás": ["Savings", "Ersparnisse"], "Hitel / tartozás": ["Loan / debt", "Kredit / Schulden"],
    "Egyéb kiadások": ["Other expenses", "Sonstige Ausgaben"], "Célzott hónapok": ["Target months", "Zielmonate"],
    "pl. 550 000": ["e.g. 550,000", "z. B. 550.000"], "pl. 180 000": ["e.g. 180,000", "z. B. 180.000"], "pl. 65 000": ["e.g. 65,000", "z. B. 65.000"],
    "pl. 120 000": ["e.g. 120,000", "z. B. 120.000"], "pl. 35 000": ["e.g. 35,000", "z. B. 35.000"], "pl. 60 000": ["e.g. 60,000", "z. B. 60.000"],
    "pl. 70 000": ["e.g. 70,000", "z. B. 70.000"], "pl. 50 000": ["e.g. 50,000", "z. B. 50.000"], "pl. 600 000": ["e.g. 600,000", "z. B. 600.000"]
  });
  const supported = Object.freeze(["hu", "en", "de"]);
  const amount = (value) => value.replace(/\s*Ft$/u, " HUF");
  const page = "havi-koltsegvetes-kalkulator";
  function translate(pageOrValue, valueOrLanguage, requestedLanguage) {
    const value = requestedLanguage ? valueOrLanguage : pageOrValue;
    const language = requestedLanguage || valueOrLanguage;
    if (!supported.includes(language) || language === "hu") return null;
    const normalized = String(value).replace(/\s+/gu, " ").trim();
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];
    let match = /^Összes kiadás megtakarítással együtt:\s*(.+)$/u.exec(normalized);
    if (match) return `${language === "en" ? "Total expenses including savings:" : "Gesamtausgaben einschließlich Ersparnis:"} ${amount(match[1])}`;
    match = /^Megtakarítási arány:\s*(.+)$/u.exec(normalized);
    if (match) return `${language === "en" ? "Savings rate:" : "Sparquote:"} ${match[1]}`;
    match = /^([\d\s.,−–-]+)\s*Ft$/u.exec(normalized);
    if (match) return amount(normalized);
    return null;
  }
  return { translate, dictionary, supported, pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }) };
});

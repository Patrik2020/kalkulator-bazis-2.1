/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document;
  const main = doc.querySelector("main.page-hatarido, main.page-szamla");
  if (!main) return;

  const page = main.classList.contains("page-hatarido")
    ? "fizetesi-hatarido-kalkulator"
    : "szamla-teljesites-kalkulator";
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  let language = root.KB_SITE_LANGUAGE?.get() || "hu";
  let observer;
  const excluded = 'script,style,textarea,pre,code,input,[contenteditable],[translate="no"]';

  function render() {
    observer?.disconnect();
    try {
      const walker = doc.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest(excluded)) continue;
        const previous = textRecords.get(node);
        const source = previous?.rendered === node.nodeValue ? previous.source : node.nodeValue;
        const match = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
        if (!match?.[2]) continue;
        const parentOption = node.parentElement?.closest("option:not([value])");
        if (parentOption && !parentOption.hasAttribute("data-kb-locale-value")) {
          parentOption.value = parentOption.textContent.trim();
          parentOption.setAttribute("data-kb-locale-value", "true");
        }
        const translated = api.translate(page, match[2], language);
        const rendered = match[1] + (translated ?? match[2]) + match[3];
        if (node.nodeValue !== rendered) node.nodeValue = rendered;
        textRecords.set(node, { source, rendered });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach((element) => {
        if (element.closest('select,textarea,pre,code,[contenteditable],[translate="no"]')) return;
        for (const name of ["aria-label", "placeholder", "title"]) {
          if (!element.hasAttribute(name)) continue;
          let records = attributeRecords.get(element);
          if (!records) { records = new Map(); attributeRecords.set(element, records); }
          const current = element.getAttribute(name);
          const previous = records.get(name);
          const source = previous?.rendered === current ? previous.source : current;
          const translated = api.translate(page, source, language);
          const rendered = translated ?? source;
          if (current !== rendered) element.setAttribute(name, rendered);
          records.set(name, { source, rendered });
        }
      });
    } finally {
      observer?.observe(main, { subtree: true, childList: true, characterData: true });
    }
  }

  root.KB_INVOICE_DATE_LOCALE = Object.freeze({
    translateText: value => api.translate(page, String(value), language),
    getLanguage: () => language
  });
  doc.addEventListener("kb:language-changed", event => {
    language = api.supported.includes(event.detail?.language) ? event.detail.language : "hu";
    render();
  });
  const ready = () => {
    observer = new MutationObserver(() => render());
    render();
  };
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const rows = [
    ["FRISS HÍREK", "LATEST NEWS", "AKTUELLE NACHRICHTEN"],
    ["Pénzügyi változások", "Financial updates", "Finanzielle Entwicklungen"],
    ["Pénzügyi aktualitások", "Financial news", "Finanznachrichten"],
    ["Kapcsolódó friss hírek", "Related latest news", "Passende aktuelle Nachrichten"],
    ["Hirdetés", "Advertisement", "Anzeige"],
    ["Jegybanki alapkamat: 5,50%", "Central bank base rate: 5.50%", "Leitzins der Zentralbank: 5,50 %"],
    ["Állampapír-kamatok 2026-ban", "Government bond yields in 2026", "Staatsanleiherenditen 2026"],
    ["Szeptemberi infláció: 1,6%", "September inflation: 1.6%", "Inflation im September: 1,6 %"],
    ["Összes friss hír →", "All the latest news →", "Alle aktuellen Nachrichten →"],
    ["Fizetési határidő kalkulátor 2026", "Payment deadline calculator 2026", "Zahlungsfrist-Rechner 2026"],
    ["Fizetési határidő kalkulátor", "Payment deadline calculator", "Zahlungsfrist-Rechner"],
    ["Számold ki számla vagy szerződés fizetési határidejét naptári vagy munkanapokkal a 2026-os magyar munkarend szerint.", "Calculate an invoice or contract payment deadline in calendar or working days using Hungary's 2026 work calendar.", "Berechne eine Zahlungsfrist für Rechnung oder Vertrag in Kalender- oder Arbeitstagen nach dem ungarischen Arbeitskalender 2026."],
    ["Számla kiállítás dátuma", "Invoice issue date", "Rechnungsdatum"],
    ["Fizetési határidő (nap)", "Payment term (days)", "Zahlungsfrist (Tage)"],
    ["pl. 8 vagy 30", "e.g. 8 or 30", "z. B. 8 oder 30"],
    ["Naptári napok", "Calendar days", "Kalendertage"], ["Munkanapok", "Working days", "Arbeitstage"],
    ["Fizetési határidő:", "Payment deadline:", "Zahlungsfrist:"],
    ["Fizetési határidő", "Payment deadline", "Zahlungsfrist"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Calculator Base so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulator Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren oder sie mit jemandem teilen kannst, für den sie nützlich sein könnte."],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Az eredmény után", "After your result", "Nach deinem Ergebnis"],
    ["A határidő mellé ellenőrizd a teljesítési dátumot is", "Check the tax point alongside the payment deadline", "Prüfe neben der Zahlungsfrist auch das Leistungsdatum"],
    ["Számlázásnál a fizetési határidő és a teljesítési időpont két külön adat. A következő lépésben érdemes a másikat is kiszámolni.", "For invoicing, the payment deadline and tax point are separate details. Calculate the other date as your next step.", "Bei der Rechnungsstellung sind Zahlungsfrist und Leistungszeitpunkt zwei verschiedene Angaben. Berechne als Nächstes auch das jeweils andere Datum."],
    ["Ellenőrizd a teljesítési időpont logikáját is.", "Check the tax-point rules too.", "Prüfe auch die Regeln zum Leistungszeitpunkt."],
    ["Számold át a nettó, ÁFA és bruttó összegeket.", "Calculate the net, VAT and gross amounts.", "Berechne Netto-, Umsatzsteuer- und Bruttobeträge."],
    ["Egészítsd ki a számlázási dátumokat", "Complete the invoice dates", "Ergänze die Rechnungsdaten"],
    ["A teljesítési időpont mellett a fizetési határidő és az összeg nettó–bruttó bontása is gyakran szükséges a számla ellenőrzéséhez.", "Alongside the tax point, the payment deadline and net-to-gross amount breakdown are often needed to check an invoice.", "Neben dem Leistungszeitpunkt werden zur Rechnungsprüfung häufig auch die Zahlungsfrist und die Netto-Brutto-Aufschlüsselung benötigt."],
    ["Számold ki a kapcsolódó esedékességi dátumot.", "Calculate the related due date.", "Berechne das zugehörige Fälligkeitsdatum."],
    ["Ellenőrizd a nettó, ÁFA és bruttó összeget.", "Check the net, VAT and gross amounts.", "Prüfe die Netto-, Umsatzsteuer- und Bruttobeträge."],
    ["Számla teljesítés kalkulátor", "Invoice tax point calculator", "Rechner für das Leistungsdatum der Rechnung"],
    ["ÁFA kalkulátor", "VAT calculator", "Mehrwertsteuer-Rechner"],
    ["Mit számol a fizetési határidő kalkulátor?", "What does the payment deadline calculator calculate?", "Was berechnet der Zahlungsfrist-Rechner?"],
    ["A kalkulátor a megadott kezdődátumhoz hozzáadja a választott napok számát. Naptári nap módban minden nap számít; munkanap módban a program a támogatott naptári év szabályai szerint zárja ki a nem munkanapokat.", "The calculator adds the selected number of days to the start date you enter. Calendar-day mode counts every day; working-day mode excludes non-working days according to the supported calendar year's rules.", "Der Rechner addiert die gewählte Anzahl von Tagen zum eingegebenen Startdatum. Im Kalendertage-Modus zählt jeder Tag; im Arbeitstage-Modus werden arbeitsfreie Tage gemäß den Regeln des unterstützten Kalenderjahres ausgeschlossen."],
    ["Ez egyszerű dátumszámítás. A szerződés, az általános szerződési feltételek, külön jogszabály vagy az adott ügylet jellege meghatározhatja, hogy valójában melyik dátumtól és milyen szabály szerint kell számolni.", "This is a basic date calculation. The contract, its general terms, specific legislation or the nature of the transaction may determine the actual starting date and counting rule.", "Dies ist eine einfache Datumsberechnung. Vertrag, Allgemeine Geschäftsbedingungen, besondere Rechtsvorschriften oder die Art des Geschäfts können bestimmen, ab welchem Datum und nach welcher Regel tatsächlich gerechnet wird."],
    ["Naptári nap és munkanap között nagy lehet a különbség", "Calendar days and working days can differ significantly", "Zwischen Kalender- und Arbeitstagen kann es große Unterschiede geben"],
    ["Egy 8 napos naptári határidő hétvégén is tovább fut. Nyolc munkanap viszont a kieső hétvégék és munkaszüneti napok miatt hosszabb naptári időtartamot jelenthet. Emiatt mindig azt a módszert válaszd, amelyet a szerződés vagy az alkalmazandó szabály használ.", "An 8-calendar-day deadline continues through weekends. Eight working days may span a longer calendar period because weekends and public holidays are excluded. Always use the method specified by the contract or applicable rule.", "Eine Frist von 8 Kalendertagen läuft auch am Wochenende weiter. Acht Arbeitstage können wegen Wochenenden und Feiertagen einen längeren Kalenderzeitraum umfassen. Verwende stets die im Vertrag oder in der maßgeblichen Vorschrift festgelegte Methode."],
    ["Példa", "Example", "Beispiel"],
    ["Ha egy dokumentum kiinduló dátuma hétfő és 8 naptári nappal számolsz, az eredmény a következő hét keddje. Nyolc munkanap esetén a közbeeső hétvége miatt későbbi dátum adódik.", "If a document starts on a Monday, adding 8 calendar days gives the following Tuesday. Eight working days produce a later date because the intervening weekend is excluded.", "Wenn das Ausgangsdatum eines Dokuments ein Montag ist, ergibt die Addition von 8 Kalendertagen den Dienstag der folgenden Woche. Bei acht Arbeitstagen liegt das Datum wegen des dazwischenliegenden Wochenendes später."],
    ["A kezdődátumot is ellenőrizni kell", "Check the start date too", "Auch das Startdatum muss geprüft werden"],
    ["Nem minden fizetési határidő indul automatikusan a számla kiállításának napjától. A szerződés más kiindulópontot is meghatározhat, ezért a kalkulátorban szereplő „kiállítás dátuma” csak akkor megfelelő alap, ha az adott ügyletben valóban ettől kell számolni.", "Not every payment deadline automatically starts on the invoice issue date. A contract may specify another starting point, so use the calculator's “invoice issue date” only when that is the correct date for the transaction.", "Nicht jede Zahlungsfrist beginnt automatisch mit dem Rechnungsdatum. Ein Vertrag kann einen anderen Ausgangspunkt festlegen. Verwende das im Rechner angegebene „Rechnungsdatum“ daher nur, wenn ab diesem Datum gerechnet werden soll."],
    ["Fizetési határidő és teljesítési dátum nem ugyanaz", "The payment deadline and tax point are different dates", "Zahlungsfrist und Leistungsdatum sind nicht dasselbe"],
    ["A teljesítési dátum az adózási és számlázási szabályok szempontjából külön fogalom. A fizetési határidő azt jelzi, meddig kell rendezni az ellenértéket. A két dátum sok ügyletnél eltér egymástól.", "The tax point is a separate concept under tax and invoicing rules. The payment deadline indicates when the amount due must be paid. The two dates differ in many transactions.", "Das Leistungsdatum ist nach Steuer- und Rechnungslegungsvorschriften ein eigener Begriff. Die Zahlungsfrist gibt an, bis wann der Rechnungsbetrag zu begleichen ist. Bei vielen Geschäften unterscheiden sich diese Daten."],
    ["Mi történik késedelemnél?", "What happens if payment is late?", "Was geschieht bei Zahlungsverzug?"],
    ["A késedelem jogkövetkezménye nem pusztán dátumkérdés: kamat, behajtási költségátalány vagy szerződéses következmény is felmerülhet. Ilyen helyzetben a szerződés és az aktuális szabályozás ellenőrzése fontosabb, mint az egyszerű kalkuláció.", "The consequences of late payment are not just a matter of dates: interest, a fixed recovery cost or contractual consequences may apply. In such cases, checking the contract and current rules matters more than a basic calculation.", "Die Folgen eines Zahlungsverzugs sind nicht nur eine Datumsfrage: Zinsen, eine pauschale Beitreibungsgebühr oder vertragliche Folgen können entstehen. In diesem Fall sind Vertrag und aktuelle Vorschriften wichtiger als eine einfache Berechnung."],
    ["Gyakori hibák", "Common mistakes", "Häufige Fehler"],
    ["Automatikusan a számla kiállítását tekintik kezdődátumnak.", "Automatically using the invoice issue date as the start date.", "Das Rechnungsdatum automatisch als Fristbeginn ansetzen."],
    ["Naptári nap helyett munkanappal vagy fordítva számolnak.", "Counting working days instead of calendar days, or vice versa.", "Arbeitstage statt Kalendertage zählen oder umgekehrt."],
    ["A hétvégi vagy ünnepnapi lejárat kezelését feltételezésből döntik el.", "Assuming how a deadline falling on a weekend or holiday should be handled.", "Annehmen, wie eine Frist an einem Wochenende oder Feiertag behandelt wird."],
    ["A fizetési határidőt összekeverik a teljesítési dátummal.", "Confusing the payment deadline with the tax point.", "Die Zahlungsfrist mit dem Leistungsdatum verwechseln."],
    ["A fizetési határidőt összekeverik a teljesítés napjával.", "Confusing the payment deadline with the date of supply.", "Die Zahlungsfrist mit dem Tag der Leistung verwechseln."],
    ["A banki teljesítés idejét és a szerződés szerinti esedékességet ugyanannak tekintik.", "Treating bank transfer processing time as the contractual due date.", "Die Banklaufzeit mit der vertraglichen Fälligkeit gleichsetzen."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["A kiállítás napja az első nap?", "Does the issue date count as day one?", "Ist das Ausstellungsdatum der erste Tag?"],
    ["Nem feltétlenül. A határidő kezdőpontját a szerződés vagy az alkalmazandó szabály alapján kell meghatározni.", "Not necessarily. The contract or applicable rule determines when the deadline starts.", "Nicht unbedingt. Der Vertrag oder die maßgebliche Vorschrift bestimmt den Fristbeginn."],
    ["A munkanap mód figyeli az ünnepnapokat?", "Does working-day mode account for public holidays?", "Berücksichtigt der Arbeitstage-Modus Feiertage?"],
    ["A támogatott 2026-os naptárnál igen, a beépített munkarend szerint. Más évnél a kalkulátor működését külön ellenőrizd.", "Yes, for the supported 2026 calendar, using its built-in work schedule. Check the calculator separately for other years.", "Ja, für den unterstützten Kalender 2026 gemäß dem hinterlegten Arbeitszeitplan. Prüfe den Rechner für andere Jahre gesondert."],
    ["Mi van, ha a határidő hétvégére esik?", "What if the deadline falls on a weekend?", "Was ist, wenn die Frist auf ein Wochenende fällt?"],
    ["Az, hogy a teljesítés ilyenkor mikor minősül határidőben megtörténtnek, az alkalmazandó jogi vagy szerződéses szabálytól függhet.", "Whether payment is considered timely in that situation may depend on the applicable legal or contractual rule.", "Ob die Zahlung in diesem Fall als fristgerecht gilt, kann von der maßgeblichen gesetzlichen oder vertraglichen Regel abhängen."],
    ["Számla teljesítési dátumát is számolja?", "Does it also calculate the invoice tax point?", "Berechnet er auch das Leistungsdatum der Rechnung?"],
    ["Nem. Ehhez használd a számla teljesítés kalkulátort.", "No. Use the invoice tax point calculator for that.", "Nein. Verwende dafür den Rechner für das Leistungsdatum der Rechnung."],
    ["Behajtás előtt elég ezt az eredményt nézni?", "Is this result enough before debt collection?", "Reicht dieses Ergebnis vor einem Inkasso aus?"],
    ["Nem. Követeléskezelés vagy jogvita előtt a szerződést és az aktuális szabályokat érdemes szakemberrel ellenőrizni.", "No. Before pursuing a claim or entering a dispute, have a professional check the contract and current rules.", "Nein. Vor der Forderungsbeitreibung oder einem Rechtsstreit sollten Vertrag und aktuelle Vorschriften fachkundig geprüft werden."],
    ["Forrás a 2026-os munkarendhez:", "Source for the 2026 work schedule:", "Quelle für den Arbeitszeitplan 2026:"],
    ["10/2025. (IV. 30.) NGM rendelet", "Decree 10/2025 (30 April) of the Ministry for National Economy", "Verordnung 10/2025 (30. April) des Ministeriums für Volkswirtschaft"],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["Számla teljesítés", "Invoice tax point", "Leistungsdatum der Rechnung"], ["Dátumkülönbség", "Date difference", "Datumsdifferenz"],
    ["Munkaidő", "Working time", "Arbeitszeit"], ["Munkanap kalkulátor", "Working days calculator", "Arbeitstage-Rechner"],
    ["Általános határidő számítás", "General deadline calculation", "Allgemeine Fristberechnung"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Zuverlässigkeit und Berechnungsgrenzen"],
    ["Az eredmény tájékoztató becslés, nem pénzügyi, befektetési vagy adótanács, hitelajánlat vagy garantált eredmény. Döntés előtt ellenőrizd az aktuális feltételeket és szükség esetén kérj szakértői segítséget.", "The result is an informational estimate, not financial, investment or tax advice, a loan offer or a guaranteed outcome. Check current terms before deciding and seek professional help if needed.", "Das Ergebnis dient nur der Orientierung. Es ist keine Finanz-, Anlage- oder Steuerberatung, kein Kreditangebot und kein garantiertes Ergebnis. Prüfe vor einer Entscheidung die aktuellen Bedingungen und hole bei Bedarf fachlichen Rat ein."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.", "Found an error? Let us know.", "Einen Fehler gefunden? Teile ihn uns mit."],
    ["2026-os munkarend-ellenőrző", "2026 work-schedule checker", "Arbeitszeitplan-Prüfung 2026"],
    ["A munkanap nem egyszerűen hétfőtől péntekig tart", "A working day is not simply Monday to Friday", "Ein Arbeitstag ist nicht einfach Montag bis Freitag"],
    ["2026-ban három szombat általános munkarend szerinti munkanap, és három kapcsolódó hétköznap pihenőnap. Ezért a munkanapos számításnál egy sima „hétvégék kihagyása” algoritmus hibás eredményt adhat.", "In 2026, three Saturdays are regular working days and three corresponding weekdays are rest days. A simple “skip weekends” algorithm can therefore produce the wrong result.", "2026 sind drei Samstage reguläre Arbeitstage und drei zugehörige Wochentage Ruhetage. Ein einfaches Verfahren, das nur Wochenenden überspringt, kann daher ein falsches Ergebnis liefern."],
    ["jan. 10., szombat", "Jan 10, Saturday", "10. Jan., Samstag"], ["munkanap", "working day", "Arbeitstag"],
    ["jan. 2., péntek pihenőnap", "Jan 2, Friday — rest day", "2. Jan., Freitag — Ruhetag"],
    ["aug. 8., szombat", "Aug 8, Saturday", "8. Aug., Samstag"], ["aug. 21., péntek pihenőnap", "Aug 21, Friday — rest day", "21. Aug., Freitag — Ruhetag"],
    ["dec. 12., szombat", "Dec 12, Saturday", "12. Dec, Saturday"], ["dec. 24., csütörtök pihenőnap", "Dec 24, Thursday — rest day", "24. Dez., Donnerstag — Ruhetag"],
    ["Jogszabályi alap:", "Legal basis:", "Rechtsgrundlage:"], ["Fontos különbség:", "Important distinction:", "Wichtiger Unterschied:"],
    ["a munkanap-számítás technikai naptárkérdés; hogy egy szerződéses esedékesség hétvégén vagy munkaszüneti napon hogyan tolódik, külön jogi kérdés lehet.", "working-day counting is a calendar calculation; how a contractual due date shifts when it falls on a weekend or public holiday may be a separate legal question.", "Die Berechnung von Arbeitstagen ist eine Kalenderfrage. Wie sich eine vertragliche Fälligkeit an einem Wochenende oder Feiertag verschiebt, kann eine gesonderte Rechtsfrage sein."],
    ["Naptári vagy munkanapos fizetési határidő", "Payment deadline in calendar or working days", "Zahlungsfrist in Kalender- oder Arbeitstagen"],
    ["Kiinduló dátum", "Start date", "Ausgangsdatum"], ["Határidő hossza", "Length of deadline", "Fristdauer"], ["Számítás módja", "Counting method", "Berechnungsmethode"],
    ["Naptári nap", "Calendar day", "Kalendertag"], ["Munkanap", "Working day", "Arbeitstag"],
    ["Szerződéses korrekció (nap)", "Contractual adjustment (days)", "Vertragliche Anpassung (Tage)"],
    ["Számított határnap", "Calculated due date", "Berechneter Fälligkeitstag"], ["Az oldal megnyitásakor frissül", "Updated when the page opens", "Wird beim Öffnen der Seite aktualisiert"],
    ["Számítás típusa", "Calculation type", "Berechnungsart"], ["naptári nap", "calendar day", "Kalendertag"],
    ["Szerződéses korrekció", "Contractual adjustment", "Vertragliche Anpassung"], ["0 nap", "0 days", "0 Tage"],
    ["A szerződés, ágazati szabály és jogszabály módosíthatja a határidőt. A munkanapos mód a 2026-os magyar munkaszüneti napokat, áthelyezett pihenőnapokat és munkaszombatokat kezeli; más évben csak a hétvégéket zárja ki.", "A contract, sector-specific rule or legislation may change the deadline. Working-day mode accounts for Hungarian public holidays, moved rest days and working Saturdays in 2026; in other years, it excludes weekends only.", "Vertrag, Branchenregelung und Gesetz können die Frist ändern. Der Arbeitstage-Modus berücksichtigt 2026 ungarische Feiertage, verlegte Ruhetage und Arbeitssamstage; in anderen Jahren werden nur Wochenenden ausgeschlossen."],
    ["Források és módszertani ellenőrzés", "Sources and methodology review", "Quellen und methodische Prüfung"],
    ["NJT – 2026. évi áthelyezett munkarend", "Hungarian National Legislation Repository — 2026 adjusted work schedule", "Ungarisches Rechtsnormenverzeichnis — geänderter Arbeitszeitplan 2026"],
    ["Nemzeti Jogszabálytár – Polgári Törvénykönyv", "Hungarian National Legislation Repository — Civil Code", "Ungarisches Rechtsnormenverzeichnis — Zivilgesetzbuch"],
    ["NAV – számlázási tájékoztatók", "Hungarian Tax Authority — invoicing guidance", "Ungarische Steuerbehörde — Hinweise zur Rechnungsstellung"],
    ["Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.", "This calculator is for information only. Individual decisions require advice from a professional or information from an official authority.", "Dieser Rechner dient nur der Information. Für individuelle Entscheidungen sind fachlicher Rat oder Angaben einer Behörde erforderlich."],
    ["Módszertani frissítés:", "Methodology updated:", "Methodische Aktualisierung:"],
    ["Teljesítési dátum és folyamatos teljesítés kalkulátor", "Tax point and continuous-supply calculator", "Rechner für Leistungsdatum und Dauerleistung"],
    ["Tekintsd át a számla teljesítési dátumát, és számold ki a folyamatos vagy időszakos elszámolás tipikus Áfa tv. 58. § szerinti esetét.", "Review the invoice tax point and calculate a typical case under Section 58 of Hungary's VAT Act for continuous or periodic settlement.", "Prüfe das Leistungsdatum der Rechnung und berechne einen typischen Fall nach § 58 des ungarischen Umsatzsteuergesetzes für Dauer- oder Periodenabrechnungen."],
    ["Teljesítés dátuma", "Tax point date", "Leistungsdatum"],
    ["Folyamatos teljesítés kalkulátor – időszakos elszámolás, Áfa tv. 58. §", "Continuous-supply calculator — periodic settlement, Section 58 of the VAT Act", "Rechner für Dauerleistungen — periodische Abrechnung, § 58 des Umsatzsteuergesetzes"],
    ["Add meg az elszámolási időszak utolsó napját, a számla kibocsátását és a fizetési esedékességet. A kalkulátor a tipikus, Áfa tv. 58. § (1) és (1a) szerinti belföldi eset teljesítési időpontját számolja.", "Enter the end of the settlement period, the invoice issue date and the payment due date. The calculator estimates the tax point for a typical domestic case under Section 58(1) and (1a) of Hungary's VAT Act.", "Gib das Ende des Abrechnungszeitraums, das Rechnungsdatum und die Zahlungsfälligkeit ein. Der Rechner ermittelt den Leistungszeitpunkt für einen typischen inländischen Fall nach § 58 Abs. 1 und 1a des ungarischen Umsatzsteuergesetzes."],
    ["Elszámolási időszak utolsó napja", "Last day of settlement period", "Letzter Tag des Abrechnungszeitraums"],
    ["Számla kibocsátásának napja", "Invoice issue date", "Tag der Rechnungsausstellung"], ["Fizetési esedékesség napja", "Payment due date", "Zahlungsfälligkeit"],
    ["Áfa szerinti teljesítési időpont:", "VAT tax point:", "Umsatzsteuerlicher Leistungszeitpunkt:"], ["Korlát:", "Limitation:", "Einschränkung:"],
    ["ez a rész a tipikus 58. § (1)–(1a) szerinti esetet modellezi. Nem helyettesíti a különleges, hosszú elszámolási időszakokra, Közösségen belüli ügyletekre, fordított adózásra, előlegre, részteljesítésre vagy módosító számlára vonatkozó szabályok vizsgálatát.", "this section models a typical case under Section 58(1)–(1a). It does not replace review of rules for special or lengthy settlement periods, intra-Community transactions, reverse-charge transactions, advances, partial performance or amended invoices.", "Dieser Abschnitt bildet einen typischen Fall nach § 58 Abs. 1–1a ab. Er ersetzt nicht die Prüfung der Vorschriften für besondere oder lange Abrechnungszeiträume, innergemeinschaftliche Umsätze, Reverse-Charge-Umsätze, Anzahlungen, Teilleistungen oder Rechnungsberichtigungen."],
    ["A teljesítési dátum több mint adminisztráció", "The tax point is more than an administrative detail", "Das Leistungsdatum ist mehr als eine Formalität"],
    ["A számlán szereplő kiállítási dátum, teljesítési dátum és fizetési határidő három külön fogalom. A kiállítás azt mutatja, mikor készült a bizonylat, a teljesítés az ügylet adózási szempontból releváns időpontjához kapcsolódik, a fizetési határidő pedig az ellenérték esedékességét jelzi.", "The invoice issue date, tax point and payment deadline are three distinct concepts. The issue date shows when the document was created; the tax point is the transaction date relevant for tax purposes; and the payment deadline indicates when the amount is due.", "Rechnungsdatum, Leistungsdatum und Zahlungsfrist sind drei verschiedene Begriffe. Das Rechnungsdatum zeigt, wann der Beleg erstellt wurde; das Leistungsdatum ist der steuerlich maßgebliche Zeitpunkt des Geschäfts; die Zahlungsfrist gibt an, wann der Betrag fällig ist."],
    ["A kalkulátor ezek áttekintésében segít, de nem dönti el helyetted, hogy egy konkrét ügyletnél mi a jogszerű teljesítési időpont. Ehhez előbb az ügylet típusát kell helyesen azonosítani.", "This calculator helps you review these dates, but it cannot determine the legally correct tax point for a specific transaction. First, identify the transaction type correctly.", "Dieser Rechner hilft dabei, diese Daten zu überblicken. Er entscheidet jedoch nicht, welcher Leistungszeitpunkt für ein konkretes Geschäft rechtlich maßgeblich ist. Dafür muss zunächst die Art des Geschäfts richtig bestimmt werden."],
    ["Miért különösen fontos az áfa szempontjából?", "Why does this matter for VAT?", "Warum ist das für die Umsatzsteuer besonders wichtig?"],
    ["Az Áfa tv. főszabály szerint a teljesítéshez köti a fizetendő adó megállapítását, de több különös szabály létezik. Időszakos elszámolás vagy meghatározott időszakra megállapított ellenérték esetén például az Áfa tv. 58. §-a külön teljesítési időpontokat határozhat meg.", "As a general rule, Hungary's VAT Act links the tax due to the time of supply, but several special rules apply. For periodic settlement or consideration set for a specified period, Section 58 may establish a separate tax point.", "Grundsätzlich knüpft das ungarische Umsatzsteuergesetz die Steuerfestsetzung an den Leistungszeitpunkt; es gelten jedoch verschiedene Sonderregeln. Bei periodischer Abrechnung oder einem für einen bestimmten Zeitraum vereinbarten Entgelt kann § 58 einen eigenen Leistungszeitpunkt festlegen."],
    ["Egyszerű példa", "Simple example", "Einfaches Beispiel"],
    ["Ha egy egyszeri szolgáltatás ténylegesen augusztus 8-án teljesül, a számla augusztus 10-én készül és 15 napos fizetési határidő tartozik hozzá, a három dátum eltérhet egymástól. A kalkulátor segít ezeket időrendben látni, de a teljesítés helyessége továbbra is az ügylet szabályaitól függ.", "If a one-off service is actually supplied on 8 August, the invoice is issued on 10 August and payment is due within 15 days, the three dates may differ. The calculator helps you view them in sequence, but the correct tax point still depends on the rules for the transaction.", "Wird eine einmalige Dienstleistung tatsächlich am 8. August erbracht, die Rechnung am 10. August ausgestellt und eine Zahlungsfrist von 15 Tagen vereinbart, können die drei Daten voneinander abweichen. Der Rechner hilft, sie zeitlich einzuordnen; der richtige Leistungszeitpunkt hängt weiterhin von den Regeln für das Geschäft ab."],
    ["Időszakos elszámolásnál különösen óvatosan", "Take particular care with periodic settlement", "Bei periodischer Abrechnung ist besondere Vorsicht geboten"],
    ["Havi könyvelési díj, bérleti díj vagy más időszakos elszámolás esetén nem biztos, hogy a tényleges munkavégzés egyetlen napja lesz a teljesítési dátum. Az Áfa tv. 58. § szerint a teljesítési időpont az elszámolási időszak, a számlakibocsátás és az esedékesség viszonyától is függhet, ezért ezt az egyszerű kalkulátor nem tudja automatikusan eldönteni.", "For a monthly bookkeeping fee, rent or another periodic settlement, the tax point may not be a single day of actual work. Under Section 58 it can also depend on the settlement period, invoice date and due date, so this basic calculator cannot determine it automatically.", "Bei monatlichen Buchführungsgebühren, Miete oder einer anderen periodischen Abrechnung muss der Leistungszeitpunkt nicht mit einem einzelnen tatsächlichen Arbeitstag zusammenfallen. Nach § 58 kann er auch vom Abrechnungszeitraum, Rechnungsdatum und der Fälligkeit abhängen; dieser einfache Rechner kann das nicht automatisch entscheiden."],
    ["Előleg, részteljesítés és módosító számla", "Advances, partial performance and amended invoices", "Anzahlungen, Teilleistungen und Rechnungsberichtigungen"],
    ["Ezek szintén külön szabályozást igényelhetnek. Előlegnél már a pénz jóváírása vagy kézhezvétele is adózási jelentőséggel bírhat, részteljesítésnél pedig az egyes teljesítési szakaszok külön kezelendők lehetnek. Módosító vagy sztornó számlánál a korábbi bizonylat és az ügylet körülményei is számítanak.", "These may also be subject to separate rules. For an advance, receipt or crediting of the money may already matter for tax purposes; partial performance may require each stage to be handled separately. For an amended or cancelled invoice, the original document and circumstances also matter.", "Auch hierfür können Sonderregeln gelten. Bei einer Anzahlung kann bereits der Zahlungseingang steuerlich relevant sein; bei Teilleistungen müssen einzelne Leistungsabschnitte gegebenenfalls getrennt behandelt werden. Bei einer berichtigten oder stornierten Rechnung sind auch der ursprüngliche Beleg und die Umstände maßgeblich."],
    ["A számla kiállításának napját automatikusan teljesítési dátumnak tekintik.", "Automatically treating the invoice issue date as the tax point.", "Das Rechnungsdatum automatisch als Leistungsdatum ansehen."],
    ["Időszakos elszámolást egyszeri ügyletként kezelnek.", "Treating periodic settlement as a one-off transaction.", "Eine periodische Abrechnung wie ein einmaliges Geschäft behandeln."],
    ["Előlegnél vagy részteljesítésnél ugyanazt az egyszerű logikát használják.", "Applying the same basic logic to advances or partial performance.", "Bei Anzahlungen oder Teilleistungen dieselbe einfache Logik anwenden."],
    ["A kalkulátor eredményét könyvelői ellenőrzés nélkül alkalmazzák összetett ügyletre.", "Applying the calculator result to a complex transaction without an accountant's review.", "Das Rechnerergebnis ohne Prüfung durch die Buchhaltung auf einen komplexen Fall anwenden."],
    ["A fizetés napja mindig a teljesítés napja?", "Is the payment date always the tax point?", "Ist der Zahlungstag immer auch der Leistungszeitpunkt?"],
    ["Nem. A teljesítési időpontot az ügylet típusa és az alkalmazandó áfaszabály határozza meg.", "No. The transaction type and applicable VAT rules determine the tax point.", "Nein. Die Art des Geschäfts und die geltenden Umsatzsteuerregeln bestimmen den Leistungszeitpunkt."],
    ["Folyamatos vagy időszakos szolgáltatásnál használható?", "Can it be used for continuous or periodic services?", "Kann er für Dauer- oder periodische Leistungen verwendet werden?"],
    ["Csak tájékozódásra. Az Áfa tv. 58. § külön szabályai miatt a teljesítési időpontot külön kell meghatározni.", "For guidance only. Section 58 has special rules, so the tax point must be determined separately.", "Nur zur Orientierung. Wegen der Sonderregeln in § 58 muss der Leistungszeitpunkt gesondert bestimmt werden."],
    ["Előleg esetén megfelelő?", "Is it suitable for an advance payment?", "Ist er für Anzahlungen geeignet?"],
    ["Nem önmagában. Az előlegnek külön áfaszabályai vannak.", "Not on its own. Separate VAT rules apply to advances.", "Nicht allein. Für Anzahlungen gelten eigene Umsatzsteuerregeln."],
    ["A fizetési határidőt honnan számolja?", "What date does it use to calculate the payment deadline?", "Von welchem Datum berechnet er die Zahlungsfrist?"],
    ["A kalkulátor a megadott adatokból egyszerű dátumszámítást végez. A szerződés szerinti helyes kezdőpontot neked kell megadnod.", "The calculator performs a basic date calculation using the information you enter. You must provide the correct start date under the contract.", "Der Rechner führt anhand deiner Eingaben eine einfache Datumsberechnung durch. Den vertraglich maßgeblichen Startzeitpunkt musst du selbst angeben."],
    ["Mikor kérdezzek könyvelőt?", "When should I ask an accountant?", "Wann sollte ich eine Steuerberatung fragen?"],
    ["Időszakos elszámolás, előleg, részteljesítés, külföldi ügylet, módosító számla vagy bármilyen bizonytalan áfakezelés esetén.", "For periodic settlement, advances, partial performance, cross-border transactions, amended invoices or any uncertain VAT treatment.", "Bei periodischer Abrechnung, Anzahlungen, Teilleistungen, grenzüberschreitenden Geschäften, Rechnungsberichtigungen oder unklarer Umsatzsteuerbehandlung."],
    ["2007. évi CXXVII. törvény az általános forgalmi adóról", "Act CXXVII of 2007 on Value Added Tax", "Gesetz CXXVII von 2007 über die Umsatzsteuer"],
    ["2007. évi CXXVII. törvény 58. §", "Section 58 of Act CXXVII of 2007", "§ 58 des Gesetzes CXXVII von 2007"],
    ["Jogszabályi háttér:", "Legislation:", "Rechtlicher Hintergrund:"],
    [", különösen az 56–59. §.", ", especially sections 56–59.", ", insbesondere §§ 56–59."],
    ["ÁFA kalkulátor", "VAT calculator", "Mehrwertsteuer-Rechner"],
    ["Ügylettípus-ellenőrző", "Transaction type checker", "Prüfung der Geschäftsart"],
    ["Mielőtt dátumot számolsz, azonosítsd az ügyletet", "Identify the transaction before calculating a date", "Bestimme die Art des Geschäfts, bevor du ein Datum berechnest"],
    ["A teljesítési időpont hibája gyakran nem számolási, hanem besorolási hiba. Válaszd ki a helyzethez legközelebbi típust; a panel azt mutatja meg, melyik szabályt kell külön ellenőrizni.", "An incorrect tax point is often a classification problem rather than a calculation error. Choose the closest matching situation; the panel shows which rule needs separate review.", "Ein falscher Leistungszeitpunkt beruht oft auf einer falschen Einordnung und nicht auf einem Rechenfehler. Wähle die ähnlichste Situation; das Feld zeigt, welche Regel gesondert geprüft werden sollte."],
    ["Ügylet típusa", "Transaction type", "Art des Geschäfts"],
    ["Egyszeri termékértékesítés vagy szolgáltatás", "One-off supply of goods or services", "Einmalige Lieferung oder Dienstleistung"],
    ["Időszakos elszámolás / meghatározott időszak", "Periodic settlement / specified period", "Periodische Abrechnung / bestimmter Zeitraum"],
    ["Előleg érkezik a teljesítés előtt", "Advance received before supply", "Anzahlung vor der Leistung"],
    ["Részteljesítés", "Partial performance", "Teilleistung"],
    ["Külföldi / fordított adózású ügylet", "Cross-border / reverse-charge transaction", "Grenzüberschreitendes Geschäft / Reverse Charge"],
    ["Egyszeri ügylet:", "One-off transaction:", "Einmaliges Geschäft:"],
    ["főszabály szerint a tényleges teljesítéshez kötődik az adózási időpont. A számla kiállítása és a fizetési határidő ettől eltérhet.", "as a general rule, the tax point is linked to the actual supply. The invoice issue date and payment deadline may differ.", "Grundsätzlich ist der Leistungszeitpunkt an die tatsächliche Leistung geknüpft. Rechnungsdatum und Zahlungsfrist können davon abweichen."],
    ["2007. évi CXXVII. törvény (Áfa tv.)", "Act CXXVII of 2007 (Hungarian VAT Act)", "Gesetz CXXVII von 2007 (ungarisches UStG)"],
    ["– különösen az 56–59. §.", "— especially sections 56–59.", "— insbesondere §§ 56–59."],
    ["Teljesítési időpont – gyakori számlázási helyzetek", "Tax points — common invoicing situations", "Leistungszeitpunkte — häufige Rechnungssituationen"],
    ["Egyszeri teljesítés", "One-off supply", "Einmalige Leistung"], ["Időszakos elszámolás", "Periodic settlement", "Periodische Abrechnung"], ["Előleg", "Advance payment", "Anzahlung"],
    ["Tényleges teljesítés / időszak vége", "Actual supply / period end", "Tatsächliche Leistung / Periodenende"],
    ["Számla kelte", "Invoice date", "Rechnungsdatum"], ["Fizetési határidő", "Payment deadline", "Zahlungsfrist"], ["Előleg jóváírása", "Advance credited", "Gutschrift der Anzahlung"],
    ["Becsült teljesítési időpont", "Estimated tax point", "Geschätzter Leistungszeitpunkt"],
    ["Az oldal megnyitásakor frissül", "Updated when the page opens", "Wird beim Öffnen der Seite aktualisiert"], ["egyszeri", "one-off", "einmalig"],
    ["Egyszeri ügyletnél főszabály szerint a tényleges teljesítés időpontja a kiindulópont.", "For a one-off transaction, the actual supply date is generally the starting point.", "Bei einem einmaligen Geschäft ist grundsätzlich der Zeitpunkt der tatsächlichen Leistung maßgeblich."],
    ["Jogi korlát:", "Legal limitation:", "Rechtliche Einschränkung:"],
    ["az időszakos elszámolás szabályai több dátumtól és kivételtől függnek. A kalkulátor gyakori alapesetet modellez, könyvelési vagy adótanácsadási döntést nem helyettesít.", "the rules for periodic settlement depend on several dates and exceptions. This calculator models a common basic case and does not replace accounting or tax advice.", "Die Regeln zur periodischen Abrechnung hängen von mehreren Daten und Ausnahmen ab. Der Rechner bildet einen häufigen Grundfall ab und ersetzt keine Buchhaltungs- oder Steuerberatung."],
    ["NAV – általános forgalmi adó és számlázás", "Hungarian Tax Authority — VAT and invoicing", "Ungarische Steuerbehörde — Umsatzsteuer und Rechnungsstellung"],
    ["Nemzeti Jogszabálytár – 2007. évi CXXVII. törvény az áfáról", "Hungarian National Legislation Repository — Act CXXVII of 2007 on VAT", "Ungarisches Rechtsnormenverzeichnis — Gesetz CXXVII von 2007 zur Umsatzsteuer"],
    ["A teljesítés és a kiállítás dátuma eltér.", "The tax point and invoice issue date are different.", "Leistungsdatum und Rechnungsdatum weichen voneinander ab."],
    ["A számla kibocsátása és a fizetési esedékesség is megelőzi az időszak végét, ezért a teljesítés a számla kibocsátásának napja.", "Both the invoice issue date and payment due date fall before the end of the period, so the tax point is the invoice issue date.", "Sowohl Rechnungsdatum als auch Zahlungsfälligkeit liegen vor dem Ende des Zeitraums. Daher ist das Rechnungsdatum der Leistungszeitpunkt."],
    ["A fizetési esedékesség az időszak végét több mint 60 nappal követi, ezért a teljesítés az időszak végét követő 60. nap.", "The payment due date is more than 60 days after the end of the period, so the tax point is the 60th day after the period ends.", "Die Zahlungsfälligkeit liegt mehr als 60 Tage nach dem Periodenende. Daher ist der Leistungszeitpunkt der 60. Tag nach Periodenende."],
    ["A fizetési esedékesség az időszak vége utánra, de 60 napon belülre esik, ezért a teljesítés a fizetési esedékesség napja.", "The payment due date falls after the end of the period but within 60 days, so the tax point is the payment due date.", "Die Zahlungsfälligkeit liegt nach dem Periodenende, aber innerhalb von 60 Tagen. Daher ist der Fälligkeitstag der Leistungszeitpunkt."],
    ["A különös korábbi számlázási vagy későbbi esedékességi szabály nem alkalmazandó, ezért a teljesítés az elszámolási időszak utolsó napja.", "Neither the special earlier-invoicing nor later-due-date rule applies, so the tax point is the last day of the settlement period.", "Weder die Sonderregel zur früheren Rechnungsstellung noch die zur späteren Fälligkeit greift. Daher ist der letzte Tag des Abrechnungszeitraums der Leistungszeitpunkt."],
    ["A számla kibocsátása és a fizetési esedékesség is megelőzi az időszak végét, ezért a teljesítés a számla kibocsátásának napja.", "Both the invoice issue date and payment due date fall before the end of the period, so the tax point is the invoice issue date.", "Sowohl Rechnungsdatum als auch Zahlungsfälligkeit liegen vor dem Ende des Zeitraums. Daher ist das Rechnungsdatum der Leistungszeitpunkt."],
    ["A fizetési esedékesség az időszak végét több mint 60 nappal követi, ezért a teljesítés az időszak végét követő 60. nap.", "The payment due date is more than 60 days after the end of the period, so the tax point is the 60th day after the period ends.", "Die Zahlungsfälligkeit liegt mehr als 60 Tage nach dem Periodenende. Daher ist der Leistungszeitpunkt der 60. Tag nach Periodenende."],
    ["A fizetési esedékesség az időszak vége utánra, de 60 napon belülre esik, ezért a teljesítés a fizetési esedékesség napja.", "The payment due date falls after the end of the period but within 60 days, so the tax point is the payment due date.", "Die Zahlungsfälligkeit liegt nach dem Periodenende, aber innerhalb von 60 Tagen. Daher ist der Fälligkeitstag der Leistungszeitpunkt."],
    ["A különös korábbi számlázási vagy későbbi esedékességi szabály nem alkalmazandó, ezért a teljesítés az elszámolási időszak utolsó napja.", "Neither the special earlier-invoicing nor later-due-date rule applies, so the tax point is the last day of the settlement period.", "Weder die Sonderregel zur früheren Rechnungsstellung noch die zur späteren Fälligkeit greift. Daher ist der letzte Tag des Abrechnungszeitraums der Leistungszeitpunkt."]
  ];

  const dictionary = Object.freeze(Object.fromEntries(rows.map(([hu, en, de]) => [hu, [en, de]])));
  const pages = Object.freeze(["fizetesi-hatarido-kalkulator", "szamla-teljesites-kalkulator"]);
  const supported = Object.freeze(["hu", "en", "de"]);
  const months = Object.freeze({ "január": 0, "február": 1, "március": 2, "április": 3, "május": 4, "június": 5, "július": 6, "augusztus": 7, "szeptember": 8, "október": 9, "november": 10, "december": 11 });
  function translate(page, value, lang) {
    if (!pages.includes(page) || !supported.includes(lang) || lang === "hu") return null;
    const normalized = String(value).replace(/\s+/gu, " ").trim();
    if (Object.hasOwn(dictionary, normalized)) return dictionary[normalized][lang === "en" ? 0 : 1];
    let match = /^(\d{4})\.\s*([\p{L}]+)\s+(\d{1,2})\.,\s*([\p{L}]+)$/u.exec(normalized);
    if (match && Object.hasOwn(months, match[2].toLocaleLowerCase("hu-HU"))) {
      const date = new Date(Date.UTC(+match[1], months[match[2].toLocaleLowerCase("hu-HU")], +match[3]));
      return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
    }
    match = /^(\d{4})\.\s*([\p{L}]+)\s+(\d{1,2})\.?$/u.exec(normalized);
    if (match && Object.hasOwn(months, match[2].toLocaleLowerCase("hu-HU"))) {
      const date = new Date(Date.UTC(+match[1], months[match[2].toLocaleLowerCase("hu-HU")], +match[3]));
      return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(date);
    }
    match = /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?$/u.exec(normalized);
    if (match) {
      const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
      return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(date);
    }
    match = /^(\d[\d\s.,]*)\s+nap$/u.exec(normalized);
    if (match) {
      const singular = new Intl.PluralRules(lang).select(Number(match[1].replace(/[\s,.]/gu, ""))) === "one";
      return `${match[1]} ${lang === "en" ? singular ? "day" : "days" : singular ? "Tag" : "Tage"}`;
    }
    return null;
  }
  return { translate, dictionary, pages, supported, dictionaries: Object.freeze({ [pages[0]]: dictionary, [pages[1]]: dictionary }) };
});

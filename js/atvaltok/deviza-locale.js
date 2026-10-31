/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "deviza-atvalto-kalkulator";
  const main = doc.querySelector("main.page-deviza");
  if (!main) return;
  root.KB_CURRENCY_LOCALE = api;
  let rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();

  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, api.language()) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    }
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
        const current = node.nodeValue, old = textState.get(node);
        const source = old?.rendered === current ? old.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
        if (!parts?.[2]) continue;
        const translated = api.translate(page, parts[2], api.language());
        const value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach((element) => {
        let state = attrState.get(element);
        if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name);
          const source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, api.language()) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.get("errorHref") || errorLink.getAttribute("href");
        originals.set("errorHref", source);
        errorLink.setAttribute("href", api.reportHref(source, api.language()));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source JSON-LD. */ }
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector);
        if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source);
        const value = api.translate(page, source, api.language()) ?? source;
        if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }

  function choose(next) {
    api.setLanguage(next);
    render();
  }
  doc.addEventListener("kb:language-changed", (event) => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver((changes) => {
    if (changes.some((change) => change.type === "childList" || change.type === "characterData")) render();
  }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "deviza-atvalto-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Deviza átváltó kalkulátor | Forint, euró, dollár és árfolyam", "Currency Converter | Forint, Euro, Dollar and Exchange Rates", "Währungsrechner | Forint, Euro, Dollar und Wechselkurse"],
    ["Deviza átváltó kalkulátor aktuális árfolyamokkal. Euró, dollár, font, svájci frank, forint és további devizák közötti gyors online átváltás.", "Currency converter using current reference rates. Quickly convert between euros, US dollars, pounds sterling, Swiss francs, Hungarian forints and other currencies.", "Währungsrechner mit aktuellen Referenzkursen. Rechne schnell zwischen Euro, US-Dollar, britischem Pfund, Schweizer Franken, ungarischem Forint und weiteren Währungen um."],
    ["Deviza átváltó", "Currency converter", "Währungsrechner"],
    ["Forint, euró, dollár, font és más pénznemek átváltása.", "Convert forints, euros, dollars, pounds and other currencies.", "Rechne Forint, Euro, Dollar, Pfund und weitere Währungen um."],
    ["Főoldal", "Home", "Startseite"], ["Átváltók", "Converters", "Umrechner"],
    ["Deviza átváltó kalkulátor", "Currency Converter", "Währungsrechner"],
    ["Aktuális árfolyamok alapján történő deviza átváltás euró, amerikai dollár, angol font, svájci frank, magyar forint és további pénznemek között.", "Convert euros, US dollars, pounds sterling, Swiss francs, Hungarian forints and other currencies using current reference rates.", "Rechne Euro, US-Dollar, britische Pfund, Schweizer Franken, ungarische Forint und weitere Währungen anhand aktueller Referenzkurse um."],
    ["Átváltandó összeg", "Amount to convert", "Umzurechnender Betrag"], ["Adj meg egy összeget", "Enter an amount", "Betrag eingeben"],
    ["Kiinduló pénznem", "Source currency", "Ausgangswährung"], ["Cél pénznem", "Target currency", "Zielwährung"],
    ["Magyar forint (HUF)", "Hungarian forint (HUF)", "Ungarischer Forint (HUF)"], ["Euró (EUR)", "Euro (EUR)", "Euro (EUR)"],
    ["Amerikai dollár (USD)", "US dollar (USD)", "US-Dollar (USD)"], ["Angol font (GBP)", "Pound sterling (GBP)", "Britisches Pfund (GBP)"],
    ["Svájci frank (CHF)", "Swiss franc (CHF)", "Schweizer Franken (CHF)"], ["Lengyel zloty (PLN)", "Polish zloty (PLN)", "Polnischer Złoty (PLN)"],
    ["Cseh korona (CZK)", "Czech koruna (CZK)", "Tschechische Krone (CZK)"], ["Román lej (RON)", "Romanian leu (RON)", "Rumänischer Leu (RON)"],
    ["Svéd korona (SEK)", "Swedish krona (SEK)", "Schwedische Krone (SEK)"], ["Norvég korona (NOK)", "Norwegian krone (NOK)", "Norwegische Krone (NOK)"],
    ["Dán korona (DKK)", "Danish krone (DKK)", "Dänische Krone (DKK)"], ["Japán jen (JPY)", "Japanese yen (JPY)", "Japanischer Yen (JPY)"],
    ["Kanadai dollár (CAD)", "Canadian dollar (CAD)", "Kanadischer Dollar (CAD)"], ["Ausztrál dollár (AUD)", "Australian dollar (AUD)", "Australischer Dollar (AUD)"],
    ["Kínai jüan (CNY)", "Chinese yuan (CNY)", "Chinesischer Yuan (CNY)"],
    ["Példaérték: 100 HUF ≈ 0,27 EUR", "Example: 100 HUF ≈ 0.27 EUR", "Beispiel: 100 HUF ≈ 0,27 EUR"],
    ["Árfolyamok újratöltése", "Reload exchange rates", "Wechselkurse neu laden"], ["Újratöltés…", "Reloading…", "Wird neu geladen…"],
    ["Figyelem:", "Please note:", "Hinweis:"],
    ["A naponta frissülő referenciaárfolyamok tájékoztató jellegűek és külső árfolyam-szolgáltatótól származnak. A kalkulátor nem minősül pénzügyi vagy befektetési tanácsadásnak.", "The reference rates are updated daily and supplied for information by an external exchange-rate provider. This calculator does not provide financial or investment advice.", "Die täglich aktualisierten Referenzkurse dienen zur Information und stammen von einem externen Kursanbieter. Der Rechner stellt keine Finanz- oder Anlageberatung dar."],
    ["Árfolyam dátuma:", "Rate date:", "Kursdatum:"], ["A böngészőben frissül", "Updates in your browser", "Wird im Browser aktualisiert"], ["Forrás:", "Source:", "Quelle:"],
    ["Frankfurter / Európai Központi Bank", "Frankfurter / European Central Bank", "Frankfurter / Europäische Zentralbank"],
    ["Kalkulátor Bázis API", "Kalkulátor Bázis API", "Kalkulátor-Bázis-API"], ["Európai Központi Bank", "European Central Bank", "Europäische Zentralbank"],
    ["Külső árfolyam-szolgáltató", "External exchange-rate provider", "Externer Kursanbieter"], ["Tartalék árfolyamforrás", "Backup exchange-rate source", "Ersatzquelle für Wechselkurse"],
    [" (mentett adat)", " (saved data)", " (gespeicherte Daten)"], [" (mentett adat, a frissítés most nem sikerült)", " (saved data; refresh failed)", " (gespeicherte Daten; Aktualisierung fehlgeschlagen)"],
    ["Árfolyamok betöltése...", "Loading exchange rates…", "Wechselkurse werden geladen…"], ["Betöltés...", "Loading…", "Wird geladen…"],
    ["Nem sikerült betölteni az árfolyamokat. Próbáld meg újra.", "Exchange rates could not be loaded. Please try again.", "Die Wechselkurse konnten nicht geladen werden. Versuche es erneut."],
    ["Az árfolyamok betöltéséhez internetkapcsolat szükséges.", "An internet connection is required to load exchange rates.", "Zum Laden der Wechselkurse ist eine Internetverbindung erforderlich."],
    ["Nincs elérhető adat", "No data available", "Keine Daten verfügbar"], ["Nem elérhető", "Unavailable", "Nicht verfügbar"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis to return to this conversion in one click — or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Umrechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Mennyibe kerül forintban az eurós ár?", "How much does a euro price cost in forints?", "Wie viel kostet ein Europreis in Forint?"],
    ["Szállást foglalsz, külföldről rendelsz, vagy egy euróban megadott összeget hasonlítanál a fizetésedhez? Add meg az összeget és a két pénznemet. Az átváltó referenciaárfolyammal számol; a bankod vagy a pénzváltód ettől eltérő árat alkalmazhat.", "Booking accommodation, ordering from abroad or comparing a euro price with your salary? Enter the amount and the two currencies. The converter uses a reference rate; your bank or exchange office may apply a different rate.", "Buchst du eine Unterkunft, bestellst im Ausland oder möchtest einen Eurobetrag mit deinem Einkommen vergleichen? Gib den Betrag und die beiden Währungen ein. Der Rechner verwendet einen Referenzkurs; deine Bank oder Wechselstube kann einen anderen Kurs anwenden."],
    ["Így olvasd az eredményt", "How to read the result", "So liest du das Ergebnis"],
    ["Az összeg alatt megtalálod az árfolyam dátumát és forrását. Ez az adat időpontját jelzi, nem azt, hogy te mikor nyitottad meg az oldalt. A kalkulátor nem másodpercenként frissülő piaci jegyzést mutat.", "The rate date and source appear below the converted amount. The date shows when the data applies, not when you opened the page. The calculator does not display a market quote updated every second.", "Unter dem umgerechneten Betrag findest du Kursdatum und Quelle. Das Datum bezeichnet den Stand der Daten, nicht den Zeitpunkt, zu dem du die Seite geöffnet hast. Der Rechner zeigt keinen sekündlich aktualisierten Marktkurs."],
    ["Ugyanaz az 1 000 euró, más forintösszeg", "The same EUR 1,000, a different forint amount", "Dieselben 1.000 Euro, ein anderer Forintbetrag"],
    ["390 Ft/EUR árfolyamnál 1 000 euró 390 000 Ft, 400 Ft/EUR mellett 400 000 Ft. A 10 000 Ft különbséghez még szolgáltatói díj is társulhat. Ezek szemléltető árfolyamok, nem az aktuális jegyzés.", "At a rate of HUF 390 per euro, EUR 1,000 is HUF 390,000; at HUF 400 per euro, it is HUF 400,000. Provider fees may add to the HUF 10,000 difference. These rates are examples, not current quotes.", "Bei 390 HUF je Euro entsprechen 1.000 Euro 390.000 HUF, bei 400 HUF je Euro sind es 400.000 HUF. Zur Differenz von 10.000 HUF können noch Anbietergebühren kommen. Diese Kurse dienen nur als Beispiel und sind keine aktuellen Notierungen."],
    ["Miért mutat mást a banki alkalmazás?", "Why does my banking app show a different amount?", "Warum zeigt meine Banking-App einen anderen Betrag?"],
    ["A bank saját vételi vagy eladási árfolyamot használhat, és külön díjat is felszámíthat. Kártyás vásárlásnál az elszámolás időpontja is számíthat. Jóváhagyás előtt a szolgáltatónál megjelenő végösszeget ellenőrizd.", "A bank may use its own buy or sell rate and charge a separate fee. For card purchases, the settlement date may also matter. Check the final amount shown by the provider before approving the transaction.", "Eine Bank kann eigene An- oder Verkaufskurse verwenden und zusätzliche Gebühren berechnen. Bei Kartenzahlungen kann auch der Abrechnungszeitpunkt eine Rolle spielen. Prüfe vor der Bestätigung den endgültigen Betrag beim Anbieter."],
    ["Az oldal alján a felár és a fix díj hatását is kipróbálhatod. Így látható, mennyivel térne el egy euróvásárlás forintköltsége a referenciaárfolyamos összegtől.", "At the bottom of the page, you can also test the effect of a markup and a fixed fee. This shows how much the forint cost of buying euros could differ from the reference-rate amount.", "Unten auf der Seite kannst du auch die Wirkung eines Aufschlags und einer festen Gebühr prüfen. So siehst du, wie stark die Forintkosten eines Eurokaufs vom Betrag zum Referenzkurs abweichen könnten."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["A kalkulátor valós idejű árfolyamot ad?", "Does the calculator use a real-time exchange rate?", "Verwendet der Rechner einen Echtzeitkurs?"],
    ["Nem. A legfrissebb elérhető referenciaárfolyamot kéri le; az adat dátumát és forrását az eredmény alatt látod. Ez nem valós idejű piaci jegyzés vagy váltható banki ajánlat.", "No. It retrieves the latest available reference rate; the date and source appear below the result. This is neither a real-time market quote nor an executable bank offer.", "Nein. Er ruft den neuesten verfügbaren Referenzkurs ab; Datum und Quelle siehst du unter dem Ergebnis. Das ist weder ein Echtzeit-Marktkurs noch ein verbindliches Bankangebot."],
    ["Miért lehet korábbi az árfolyam dátuma?", "Why can the rate date be earlier?", "Warum kann das Kursdatum älter sein?"],
    ["A referenciaadatok nem minden naptári napon frissülnek. Hétvégén vagy ünnepnapon a legutóbbi közzétett adat lehet az elérhető. Mindig az eredmény alatt feltüntetett dátumot vedd alapul.", "Reference data is not updated on every calendar day. On weekends or public holidays, the latest published data may be the only data available. Always use the date shown below the result.", "Referenzdaten werden nicht an jedem Kalendertag aktualisiert. An Wochenenden oder Feiertagen kann nur der zuletzt veröffentlichte Stand verfügbar sein. Maßgeblich ist immer das unter dem Ergebnis angezeigte Datum."],
    ["A banki díjakat is tartalmazza az eredmény?", "Does the result include bank fees?", "Enthält das Ergebnis auch Bankgebühren?"],
    ["Nem. A fő átváltó az összeget számolja át referenciaárfolyamon. A saját bankod díjait és felárát az alábbi külön számításban adhatod meg, ha ismered őket.", "No. The main converter calculates the amount at a reference rate. If you know your bank's fee and markup, enter them in the separate calculation below.", "Nein. Der Hauptrechner rechnet den Betrag zum Referenzkurs um. Wenn du Gebühren und Aufschlag deiner Bank kennst, kannst du sie unten in der separaten Rechnung eingeben."],
    ["Mi a különbség deviza és valuta között?", "What is the difference between account currency and foreign cash?", "Was ist der Unterschied zwischen Devisen und Sorten?"],
    ["A valuta külföldi készpénz, a deviza jellemzően számlapénz. Készpénzváltásnál a pénzváltó valutaárfolyamát és kezelési költségét nézd meg.", "In Hungarian financial usage, valuta means foreign cash, while deviza usually means funds held in an account. For cash exchange, check the exchange office's cash rate and service fee.", "Im ungarischen Finanzgebrauch bezeichnet „valuta“ ausländisches Bargeld, „deviza“ meist Buchgeld. Beim Bargeldwechsel solltest du den Sortenkurs und die Bearbeitungsgebühr der Wechselstube prüfen."],
    ["Melyik pénznemeket válthatom át?", "Which currencies can I convert?", "Welche Währungen kann ich umrechnen?"],
    ["A két pénznemválasztóban látod a támogatott devizákat. A forint mellett például euróval, amerikai dollárral, angol fonttal és svájci frankkal is számolhatsz.", "The two currency selectors show all supported currencies. Besides the forint, you can calculate with euros, US dollars, pounds sterling and Swiss francs, for example.", "In den beiden Währungsfeldern siehst du alle unterstützten Währungen. Neben Forint kannst du zum Beispiel mit Euro, US-Dollar, britischem Pfund und Schweizer Franken rechnen."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"], ["Wise bemutató – partnerinformáció", "Wise overview – partner information", "Wise-Überblick – Partnerinformationen"],
    ["Infláció kalkulátor", "Inflation Calculator", "Inflationsrechner"], ["ETF kalkulátor", "ETF Calculator", "ETF-Rechner"], ["Százalék kalkulátor", "Percentage calculator", "Prozentrechner"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    ["Az eredmény a megadott összegből és a jelzett dátumú referenciaárfolyamból készül. A banki felárat, kezelési költséget és készpénzváltási díjat a fő átváltó nem tartalmazza.", "The result uses the amount you enter and the reference rate for the displayed date. The main converter does not include bank markups, service charges or cash-exchange fees.", "Das Ergebnis basiert auf deinem Betrag und dem Referenzkurs des angezeigten Datums. Bankaufschläge, Bearbeitungs- und Bargeldwechselgebühren sind im Hauptrechner nicht enthalten."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methods and quality assurance", "Berechnungsmethoden und Qualitätssicherung"], ["Hibát találtál? Jelezd nekünk.", "Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."],
    ["Árfolyam kontra tényleges terhelés", "Reference rate versus actual charge", "Referenzkurs gegenüber tatsächlicher Belastung"],
    ["Mekkora különbséget okoz a spread vagy szolgáltatói felár?", "How much difference can a spread or provider markup make?", "Wie groß ist der Unterschied durch Spread oder Anbieteraufschlag?"],
    ["Középárfolyam", "Mid-market rate", "Mittelkurs"], ["Felár / spread (%)", "Markup / spread (%)", "Aufschlag / Spread (%)"], ["Fix díj (Ft)", "Fixed fee (HUF)", "Feste Gebühr (HUF)"],
    ["Elméleti középárfolyamos összeg", "Theoretical amount at the mid-market rate", "Theoretischer Betrag zum Mittelkurs"], ["Felárral és díjjal", "With markup and fee", "Mit Aufschlag und Gebühr"], ["Különbség", "Difference", "Differenz"],
    ["Miért fontos?", "Why does this matter?", "Warum ist das wichtig?"],
    ["A devizaátváltó referenciaárfolyama nem feltétlenül azonos azzal az árfolyammal, amelyet bank, kártyatársaság vagy szolgáltató ténylegesen alkalmaz.", "The converter's reference rate may differ from the rate actually used by a bank, card network or service provider.", "Der Referenzkurs des Rechners kann vom Kurs abweichen, den eine Bank, ein Kartennetzwerk oder ein Dienstleister tatsächlich anwendet."]
  ];
  const normalize = (value) => value.trim().replace(/\s+/gu, " ");
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([hu, en, de]) => [normalize(hu), [en, de]])));
  const reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) {
    for (const localized of pair) {
      const key = normalize(localized);
      if (key !== source && !reverse.has(key)) reverse.set(key, source);
    }
  }
  const supported = Object.freeze(["hu", "en", "de"]);
  let activeLanguage = "hu";
  function setLanguage(next) { activeLanguage = supported.includes(next) ? next : "hu"; }
  function language() { return activeLanguage; }
  function translate(scope, value, target) {
    if (scope !== page || typeof value !== "string" || !supported.includes(target)) return null;
    const normalized = normalize(value);
    if (target === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    return pair ? pair[target === "en" ? 0 : 1] : null;
  }
  function reportHref(source, target) {
    if (target === "hu" || !supported.includes(target)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", target === "en" ? "Error report – Currency Converter" : "Fehlermeldung – Währungsrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", target === "en"
      ? "Calculator: Currency Converter\nPage: https://kalkulatorbazis.hu/kalkulatorok/deviza-atvalto-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Währungsrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/deviza-atvalto-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionary, dictionaries: Object.freeze({ [page]: dictionary }), supported, translate, reportHref, setLanguage, language };
});

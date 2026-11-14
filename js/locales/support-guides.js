/* global module */
(function (root, factory) {
  "use strict";
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  if (!root?.document) return;
  const previous = root.KB_SUPPORT_PAGE_LOCALE || { pages: [], dictionary: {} };
  root.KB_SUPPORT_PAGE_LOCALE = {
    pages: [...new Set([...previous.pages, ...data.pages])],
    dictionary: { ...previous.dictionary, ...data.dictionary }
  };
  root.document.dispatchEvent(new root.CustomEvent("kb:locale-data-ready"));
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  return {
    pages: ["landing-pages/elethelyzetek/autofenntartas.html", "landing-pages/elethelyzetek/befektetes-kezdoknek.html", "landing-pages/elethelyzetek/csaladi-koltsegvetes.html", "landing-pages/elethelyzetek/felujitas-tervezese.html", "landing-pages/elethelyzetek/fizetes-munkaber.html", "landing-pages/elethelyzetek/lakasvasarlas.html", "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html", "landing-pages/wise/wise.html"],
    dictionary: {
  "Főoldal": [
    "Home",
    "Startseite"
  ],
  "Élethelyzetek": [
    "Life situations",
    "Lebenssituationen"
  ],
  "Üzemanyag": [
    "Fuel",
    "Kraftstoff"
  ],
  "Éves autóköltség": [
    "Annual Car Costs",
    "Jährliche Autokosten"
  ],
  "Üzemanyagköltség": [
    "Fuel cost",
    "Kraftstoffkosten"
  ],
  "Kilométerdíj": [
    "Cost per kilometre",
    "Kilometerkosten"
  ],
  "Gyakori kérdések": [
    "Frequently asked questions",
    "Häufige Fragen"
  ],
  "2026. augusztus 21.": [
    "21 August 2026",
    "21. August 2026"
  ],
  "Számítási módszertan": [
    "Calculation methodology",
    "Berechnungsmethodik"
  ],
  "Adatvédelem": [
    "Privacy",
    "Datenschutz"
  ],
  "Hibabejelentés": [
    "Bug reporting",
    "Fehlermeldung"
  ],
  "Infláció": [
    "Inflation",
    "Inflation"
  ],
  "ETF kalkulátor": [
    "ETF calculator",
    "ETF-Rechner"
  ],
  "Kamatos kamat": [
    "Compound interest",
    "Zinseszins"
  ],
  "Havi költségvetés": [
    "Monthly budget",
    "Monatsbudget"
  ],
  "Jogi nyilatkozat": [
    "Legal notice",
    "Rechtlicher Hinweis"
  ],
  "Hozam": [
    "Return",
    "Rendite"
  ],
  "Költség": [
    "Cost",
    "Kosten"
  ],
  "Megtakarítás": [
    "Savings",
    "Ersparnisse"
  ],
  "Nettó–bruttó": [
    "Net–gross salary",
    "Netto–Brutto"
  ],
  "Hitel törlesztő": [
    "Loan repayment",
    "Kreditrate"
  ],
  "és a": [
    "and the",
    "und dem"
  ],
  "Ráhagyás": [
    "Waste allowance",
    "Verschnittzuschlag"
  ],
  "Festék": [
    "Paint",
    "Farbe"
  ],
  "Beton": [
    "Concrete",
    "Beton"
  ],
  "Gipszkarton": [
    "Plasterboard",
    "Gipskarton"
  ],
  "Padlóburkolat": [
    "Flooring",
    "Bodenbelag"
  ],
  "Miért kell ráhagyás?": [
    "Why include an allowance?",
    "Warum ist Verschnitt nötig?"
  ],
  "Veszteség": [
    "Loss",
    "Verlust"
  ],
  "Javítótartalék": [
    "Repair reserve",
    "Reparaturreserve"
  ],
  "Nettó": [
    "Net",
    "Netto"
  ],
  "Idő": [
    "Time",
    "Zeit"
  ],
  "Élethelyzet": [
    "Life stage",
    "Lebensphase"
  ],
  "Munkaidő": [
    "Working time",
    "Arbeitszeit"
  ],
  "Hitelképesség": [
    "Loan eligibility",
    "Kreditwürdigkeit"
  ],
  "Bruttó": [
    "Gross",
    "Brutto"
  ],
  "Hitel": [
    "Loan",
    "Kredit"
  ],
  "Finanszírozás": [
    "Financing",
    "Finanzierung"
  ],
  "Lakáshitel önerő": [
    "Mortgage down payment",
    "Eigenkapital für eine Immobilie"
  ],
  "Morzsamenü": [
    "Breadcrumb navigation",
    "Brotkrümelnavigation"
  ],
  "Pénzügyi kalkulátorok": [
    "Financial calculators",
    "Finanzrechner"
  ],
  "Pénzügyi tudatosság": [
    "Financial awareness",
    "Finanzwissen"
  ],
  "Fontos:": [
    "Important:",
    "Wichtig:"
  ],
  "Vésztartalék": [
    "Emergency fund",
    "Notgroschen"
  ],
  "Háztartási költségvetés": [
    "Household budget",
    "Haushaltsbudget"
  ],
  "Havi költségvetés kalkulátor": [
    "Monthly budget calculator",
    "Monatsbudget-Rechner"
  ],
  "Infláció kalkulátor": [
    "Inflation calculator",
    "Inflationsrechner"
  ],
  "Kamatos kamat kalkulátor": [
    "Compound interest calculator",
    "Zinseszins-Rechner"
  ],
  "Osztalék kalkulátor": [
    "Dividend calculator",
    "Dividendenrechner"
  ],
  "Mikor leszek milliomos?": [
    "When will I become a millionaire?",
    "Wann werde ich Millionär?"
  ],
  "Hitel törlesztő kalkulátor": [
    "Loan repayment calculator",
    "Kreditratenrechner"
  ],
  "Nettó - bruttó kalkulátor": [
    "Net-to-gross salary calculator",
    "Netto-Brutto-Rechner"
  ],
  "GYIK": [
    "FAQ",
    "FAQ"
  ],
  "Vissza a főoldalra": [
    "Back to the homepage",
    "Zurück zur Startseite"
  ],
  "Wise bemutató": [
    "Wise information",
    "Wise-Informationen"
  ],
  ".": [
    ".",
    "."
  ],
  "Deviza": [
    "Currency",
    "Währungen"
  ],
  "Deviza átváltó kalkulátor": [
    "Currency Converter",
    "Währungsrechner"
  ],
  "Kiinduló összeg": [
    "Starting amount",
    "Ausgangsbetrag"
  ],
  "Döntések": [
    "Decisions",
    "Entscheidungen"
  ],
  "Ingatlan ára (Ft)": [
    "Property price (HUF)",
    "Immobilienpreis (HUF)"
  ],
  "Éves kamat (%)": [
    "Annual interest rate (%)",
    "Jährlicher Zinssatz (%)"
  ],
  "Futamidő (év)": [
    "Loan term (years)",
    "Laufzeit (Jahre)"
  ],
  "Éves futás (km)": [
    "Annual mileage (km)",
    "Jährliche Fahrleistung (km)"
  ],
  "Fogyasztás (l/100 km)": [
    "Fuel consumption (L/100 km)",
    "Verbrauch (l/100 km)"
  ],
  "Üzemanyagár (Ft/l)": [
    "Fuel price (HUF/L)",
    "Kraftstoffpreis (HUF/l)"
  ],
  "Kezdőtőke (Ft)": [
    "Starting capital (HUF)",
    "Startkapital (HUF)"
  ],
  "Havi befizetés (Ft)": [
    "Monthly contribution (HUF)",
    "Monatliche Einzahlung (HUF)"
  ],
  "Időtáv (év)": [
    "Time period (years)",
    "Anlagezeitraum (Jahre)"
  ],
  "Fogyasztás": [
    "Consumption",
    "Verbrauch"
  ],
  "Hatótáv": [
    "Driving Range",
    "Reichweite"
  ],
  "Megtakarítási cél": [
    "Savings goal",
    "Sparziel"
  ],
  "Hőszigetelés": [
    "Insulation",
    "Wärmedämmung"
  ],
  "Összehasonlítás": [
    "Comparison",
    "Vergleich"
  ],
  "Átláthatóság és minőség": [
    "Transparency & quality",
    "Transparenz & Qualität"
  ],
  "A": [
    "A",
    "A"
  ],
  "Forgatókönyv": [
    "Scenario",
    "Szenario"
  ],
  "B": [
    "B",
    "B"
  ],
  "Mit szeretnél kiszámolni?": [
    "What would you like to calculate?",
    "Was möchtest du berechnen?"
  ],
  "SZJA-kulcs": [
    "Income tax rate",
    "Einkommensteuersatz"
  ],
  "15% – 2026-os szabály": [
    "15% – 2026 rate",
    "15 % – Steuersatz 2026"
  ],
  "9% – összehasonlítás": [
    "9% – comparison only",
    "9 % – nur zum Vergleich"
  ],
  "Bemenet": [
    "Input",
    "Eingabe"
  ],
  "Eredmény": [
    "Result",
    "Ergebnis"
  ],
  "Tankolás, éves fenntartás, értékvesztés, kilométerköltség és gumiméret: tervezd meg az autózás teljes költségét.": [
    "Fuel, annual running costs, depreciation, cost per kilometre and tyres: plan the full cost of driving.",
    "Tanken, Jahresunterhalt, Wertverlust, Kilometerkosten und Reifen: Plane die gesamten Autokosten."
  ],
  "Autófenntartás valódi költségei": [
    "The real cost of owning a car",
    "Die tatsächlichen Kosten der Autohaltung"
  ],
  "ETF, kamatos kamat, infláció, osztalék és célösszeg kalkulátorok egy kezdő befektetési útvonalban.": [
    "ETFs, compound interest, inflation, dividends and target amounts in a beginner’s investment pathway.",
    "ETFs, Zinseszins, Inflation, Dividenden und Zielbeträge in einem Anlageleitfaden für Einsteiger."
  ],
  "Befektetés kezdőknek": [
    "Investing for beginners",
    "Anlegen für Einsteiger"
  ],
  "Bevétel, rezsi, hitel, megtakarítás és célok: építs áttekinthető családi havi költségvetést kalkulátorokkal.": [
    "Income, utilities, loans, saving and goals: build a clear monthly family budget with calculators.",
    "Einnahmen, Nebenkosten, Kredit, Sparen und Ziele: Erstelle mit Rechnern ein übersichtliches Monatsbudget für die Familie."
  ],
  "Családi költségvetés": [
    "Family budget",
    "Familienbudget"
  ],
  "Festék, csempe, beton, gipszkarton, padló és tapéta: becsüld meg az anyagszükségletet felújítás előtt.": [
    "Paint, tiles, concrete, plasterboard, flooring and wallpaper: estimate material needs before renovating.",
    "Farbe, Fliesen, Beton, Gipskarton, Boden und Tapeten: Schätze den Materialbedarf vor der Renovierung."
  ],
  "Felújítás tervezése anyagkalkulátorokkal": [
    "Plan renovations with material calculators",
    "Renovierungen mit Materialrechnern planen"
  ],
  "Bruttó-nettó, órabér, munkaidő, havi költségvetés és hitelképesség egy élethelyzetben összekötve.": [
    "Gross–net pay, hourly wages, working time, monthly budgets and borrowing capacity connected for one life situation.",
    "Brutto-Netto, Stundenlohn, Arbeitszeit, Monatsbudget und Kreditwürdigkeit für eine Lebenssituation verbunden."
  ],
  "Fizetés és munkabér tervezése": [
    "Salary and wage planning",
    "Gehalt und Arbeitslohn planen"
  ],
  "Lakásvásárlás előtt számold végig az önerőt, a hitelt, a törlesztőt és a havi mozgásteredet egy helyen.": [
    "Before buying, calculate deposits, loans, repayments and monthly flexibility together.",
    "Berechne vor dem Wohnungskauf Eigenkapital, Kredit, Rate und monatlichen Spielraum gemeinsam."
  ],
  "Lakásvásárlás tervezése kalkulátorokkal": [
    "Plan buying a home with calculators",
    "Wohnungskauf mit Rechnern planen"
  ],
  "Pénzügyi tudatosság kezdőknek: költségvetés, vésztartalék, hitelek, célok, kockázat és befektetési alapok érthetően, a befektetés előtti felkészüléshez.": [
    "Financial awareness for beginners: budgeting, emergency reserves, loans, goals, risk and investment basics explained before investing.",
    "Finanzbewusstsein für Einsteiger: Budget, Notfallreserve, Kredite, Ziele, Risiko und Anlagegrundlagen verständlich zur Vorbereitung auf das Anlegen."
  ],
  "Pénzügyi tudatosság alapjai - befektetés előtt": [
    "Financial Awareness Basics – Before Investing",
    "Grundlagen des Finanzbewusstseins – Vor dem Anlegen"
  ],
  "Kalkulátor Bázis főoldal": [
    "Kalkulátor Bázis home",
    "Kalkulátor Bázis Startseite"
  ],
  "Önellenőrzés": [
    "Self-check",
    "Selbstprüfung"
  ],
  "Kalkulátorok": [
    "Calculators",
    "Rechner"
  ],
  "Pénzügyi alapozó térkép": [
    "Financial foundations map",
    "Übersicht der finanziellen Grundlagen"
  ],
  "A befektetés előtti három kérdés": [
    "Three questions before investing",
    "Drei Fragen vor dem Anlegen"
  ],
  "kalkulatorbazis@gmail.com": [
    "kalkulatorbazis@gmail.com",
    "kalkulatorbazis@gmail.com"
  ],
  "Információ": [
    "Information",
    "Informationen"
  ],
  "Felhasználási feltételek": [
    "Terms of use",
    "Nutzungsbedingungen"
  ],
  "Sütikezelési tájékoztató": [
    "Cookie notice",
    "Cookie-Hinweise"
  ],
  "Sütibeállítások": [
    "Cookie settings",
    "Cookie-Einstellungen"
  ],
  "Kapcsolat": [
    "Contact",
    "Kontakt"
  ],
  "Független Wise bemutató magyarul: nemzetközi pénzküldés, többdevizás számla, kártyás költés, biztonság, gyakori kérdések és hasznos Kalkulátor Bázis eszközök.": [
    "Independent Wise overview: international transfers, multi-currency accounts, card spending, security, FAQ and useful Kalkulátor Bázis tools.",
    "Unabhängiger Wise-Überblick: internationale Überweisungen, Mehrwährungskonto, Kartenausgaben, Sicherheit, häufige Fragen und hilfreiche Werkzeuge von Kalkulátor Bázis."
  ],
  "Wise bemutató magyarul - pénzküldés, deviza és kártya": [
    "Wise Overview – Transfers, Currencies and Cards",
    "Wise-Überblick – Überweisungen, Währungen und Karte"
  ],
  "Fő navigáció": [
    "Main navigation",
    "Hauptnavigation"
  ],
  "Wise megnyitása": [
    "Open Wise",
    "Wise öffnen"
  ],
  "Wise rövid áttekintés": [
    "Wise at a glance",
    "Wise im Überblick"
  ],
  "Wise partner banner megnyitása": [
    "Open Wise affiliate banner",
    "Wise-Partnerbanner öffnen"
  ],
  "Wise főbb jellemzők": [
    "Key Wise features",
    "Wichtige Wise-Merkmale"
  ],
  "Süti tájékoztató": [
    "Cookie notice",
    "Cookie-Hinweise"
  ],
  "Deviza átváltó": [
    "Currency converter",
    "Währungsrechner"
  ],
  "Mire használható a Wise?": [
    "What can Wise be used for?",
    "Wofür lässt sich Wise nutzen?"
  ],
  "Kalkulátor Bázis": [
    "Kalkulátor Bázis",
    "Kalkulátor Bázis"
  ],
  "A számítások becslések; a tényleges autóköltségek használattól és járműtől függnek.": [
    "Calculations are estimates; actual car costs depend on use and the vehicle.",
    "Die Berechnungen sind Schätzungen. Tatsächliche Autokosten hängen von Nutzung und Fahrzeug ab."
  ],
  "A kalkulátorok nem minősülnek befektetési tanácsadásnak.": [
    "Calculators do not constitute investment advice.",
    "Die Rechner stellen keine Anlageberatung dar."
  ],
  "A cél az átlátható tervezés, nem a tökéletes előrejelzés.": [
    "The aim is transparent planning, not a perfect forecast.",
    "Ziel ist eine transparente Planung, keine perfekte Vorhersage."
  ],
  "Nagyobb munka előtt ellenőrizd a gyártói adatokat és a kivitelezői felmérést.": [
    "Before larger jobs, check manufacturer data and the contractor’s survey.",
    "Prüfe vor größeren Arbeiten Herstellerangaben und das Aufmaß des Ausführenden."
  ],
  "A munkabérrel kapcsolatos számítások tájékoztató jellegű becslések.": [
    "Salary calculations are indicative estimates.",
    "Gehaltsberechnungen sind unverbindliche Schätzungen."
  ],
  "Tájékoztató tervezést segítő oldal, nem banki ajánlat.": [
    "A page for indicative planning, not a bank offer.",
    "Eine Seite zur unverbindlichen Planung, kein Bankangebot."
  ],
  "Pénzügyi tudatosság oldalon belüli navigáció": [
    "Financial awareness page navigation",
    "Seitennavigation zum Finanzbewusstsein"
  ],
  "Alapok": [
    "Foundations",
    "Grundlagen"
  ],
  "Lépések": [
    "Steps",
    "Schritte"
  ],
  "Mobil menü megnyitása": [
    "Open mobile menu",
    "Mobiles Menü öffnen"
  ],
  "Egyszerű számítások tudatosabb döntésekhez, közérthető magyarázatokkal és gyakorlati pénzügyi alapozással.": [
    "Simple calculations for more informed decisions, with clear explanations and practical financial foundations.",
    "Einfache Berechnungen für bewusstere Entscheidungen mit verständlichen Erklärungen und praktischen Finanzgrundlagen."
  ],
  "Pénzügyi tudatosság információk": [
    "Financial awareness information",
    "Informationen zum Finanzbewusstsein"
  ],
  "Adatkezelési tájékoztató": [
    "Privacy notice",
    "Datenschutzhinweise"
  ],
  "Pénzügyi tudatosság lábléc-navigáció": [
    "Financial awareness footer navigation",
    "Footer-Navigation zum Finanzbewusstsein"
  ],
  "Navigáció": [
    "Navigation",
    "Navigation"
  ],
  "Kapcsolódó kalkulátorok": [
    "Related calculators",
    "Verwandte Rechner"
  ],
  "Ha hibát találsz a pénzügyi alapozóban vagy valamelyik kapcsolódó kalkulátorban, írd meg, és javítjuk.": [
    "Report errors in the financial guide or related calculators so we can correct them.",
    "Melde Fehler im Finanzleitfaden oder zugehörigen Rechnern, damit wir sie korrigieren können."
  ],
  "© 2026 Kalkulátor Bázis": [
    "© 2026 Kalkulátor Bázis",
    "© 2026 Kalkulátor Bázis"
  ],
  "Az oktatási tartalom nem személyre szabott pénzügyi tanácsadás.": [
    "Educational content is not personalised financial advice.",
    "Die Bildungsinhalte sind keine individuelle Finanzberatung."
  ],
  "Gyakorlati útmutató a költségvetés, vésztartalék, adósságok, célok és befektetés előtti felkészülés megértéséhez.": [
    "A practical guide to budgets, emergency reserves, debts, goals and preparation before investing.",
    "Praktischer Leitfaden für Budget, Notfallreserve, Schulden, Ziele und die Vorbereitung vor dem Anlegen."
  ],
  "hu": [
    "en",
    "de"
  ],
  "Pénzügyi tudatosság alapjai": [
    "Financial awareness foundations",
    "Grundlagen des Finanzbewusstseins"
  ],
  "Wise bemutató kezdőlap": [
    "Wise overview homepage",
    "Startseite des Wise-Überblicks"
  ],
  "W": [
    "W",
    "W"
  ],
  "Előnyök": [
    "Benefits",
    "Vorteile"
  ],
  "Kinek jó?": [
    "Who is it for?",
    "Für wen ist es geeignet?"
  ],
  "Wise partner ajánlat": [
    "Wise affiliate offer",
    "Wise-Partnerangebot"
  ],
  "A Wise bemutató a Kalkulátor Bázis tájékoztató, partnerlinket is tartalmazó oldala. A díjakat és feltételeket mindig a Wise hivatalos felületén ellenőrizd.": [
    "This Wise overview is a Kalkulátor Bázis information page with affiliate links. Always check fees and terms on Wise’s official website.",
    "Dieser Wise-Überblick ist eine Informationsseite von Kalkulátor Bázis mit Partnerlinks. Prüfe Gebühren und Bedingungen stets auf der offiziellen Wise-Website."
  ],
  "Wise információk": [
    "Wise information",
    "Wise-Informationen"
  ],
  "Wise navigáció": [
    "Wise navigation",
    "Wise-Navigation"
  ],
  "Hibajelzés, partneri kérdés vagy adatkezelési megkeresés esetén ezen az e-mail címen tudsz írni.": [
    "Use this email address for bug reports, partnership questions or privacy enquiries.",
    "Nutze diese E-Mail-Adresse für Fehlermeldungen, Partnerfragen oder Datenschutzanfragen."
  ],
  "Az oldalon affiliate linkek is előfordulhatnak, ez neked nem jelent automatikusan plusz költséget.": [
    "This page may contain affiliate links, which do not automatically add costs for you.",
    "Diese Seite kann Partnerlinks enthalten, die für dich nicht automatisch Mehrkosten verursachen."
  ],
  "A Wise többek között nemzetközi pénzküldésre, devizák közötti váltásra, többdevizás pénzkezelésre, pénzfogadásra és külföldi kártyás költésre használható.": [
    "Wise can be used for international transfers, currency exchange, multi-currency management, receiving money and card spending abroad.",
    "Wise lässt sich unter anderem für internationale Überweisungen, Währungswechsel, Mehrwährungsverwaltung, Geldempfang und Kartenausgaben im Ausland nutzen."
  ],
  "Van plusz költsége annak, ha erről az oldalról kattintok?": [
    "Does clicking through from this page add a cost?",
    "Entstehen Mehrkosten, wenn ich von dieser Seite weiterklicke?"
  ],
  "Az oldalon található Wise hivatkozások ajánlói linkek lehetnek. Ez neked nem jelent automatikusan plusz költséget, de az aktuális díjakat és feltételeket mindig a Wise hivatalos oldalán kell ellenőrizni.": [
    "Wise links here may be affiliate links. They do not automatically add costs, but always check current fees and terms on Wise’s official website.",
    "Wise-Verweise können Partnerlinks sein. Das verursacht nicht automatisch Mehrkosten. Aktuelle Gebühren und Bedingungen sind aber stets auf der offiziellen Wise-Website zu prüfen."
  ],
  "Helyettesíti ez az oldal a Wise hivatalos díjait?": [
    "Does this page replace Wise’s official fee information?",
    "Ersetzt diese Seite die offiziellen Wise-Gebührenangaben?"
  ],
  "Nem. Ez egy független, tájékoztató jellegű bemutató. A díjak, elérhető szolgáltatások, limitek és feltételek változhatnak, ezért döntés előtt mindig a Wise hivatalos felületén látható információ az irányadó.": [
    "No. This is an independent informational overview. Fees, services, limits and terms can change, so Wise’s official information is authoritative before any decision.",
    "Nein. Dies ist ein unabhängiger Informationsüberblick. Gebühren, Dienste, Limits und Bedingungen können sich ändern. Vor Entscheidungen sind daher stets die offiziellen Wise-Angaben maßgeblich."
  ],
  "Külföldi utalás": [
    "International transfer",
    "Auslandsüberweisung"
  ],
  "Nemzetközi pénzküldésnél az összköltséget nézd.": [
    "Compare the total cost of sending money internationally.",
    "Betrachte bei internationalen Überweisungen die Gesamtkosten."
  ],
  "Hasonlítsd össze az árfolyamot, az utalási díjat és a címzetthez ténylegesen megérkező összeget.": [
    "Compare exchange rates, transfer fees and the amount actually received.",
    "Vergleiche Wechselkurs, Überweisungsgebühr und den tatsächlich empfangenen Betrag."
  ],
  "Wise utalási feltételek": [
    "Wise transfer terms",
    "Wise-Überweisungsbedingungen"
  ],
  "Utazás": [
    "Travel",
    "Reisen"
  ],
  "Külföldi költésnél a kártyadíj és a limitek is számítanak.": [
    "Card fees and limits also matter when spending abroad.",
    "Bei Ausgaben im Ausland zählen auch Kartengebühren und Limits."
  ],
  "Ellenőrizd a kártyás fizetés, készpénzfelvétel és devizaváltás aktuális feltételeit.": [
    "Check current terms for card payments, cash withdrawals and currency exchange.",
    "Prüfe die aktuellen Bedingungen für Kartenzahlungen, Bargeldabhebungen und Währungswechsel."
  ],
  "Wise utazási feltételek": [
    "Wise travel terms",
    "Wise-Reisebedingungen"
  ],
  "Külföldi pénzfogadás": [
    "Receiving money internationally",
    "Geld aus dem Ausland empfangen"
  ],
  "Külföldi bevételnél a pénzfogadás módja is fontos.": [
    "How you receive international income matters too.",
    "Bei Auslandseinnahmen zählt auch die Art des Geldempfangs."
  ],
  "Nézd meg, milyen pénznemben kapsz számlaadatot, és mennyibe kerül később átváltani vagy továbbutalni.": [
    "Check available account-detail currencies and later exchange or onward-transfer costs.",
    "Prüfe verfügbare Kontodatenwährungen und spätere Kosten für Wechsel oder Weiterüberweisung."
  ],
  "Wise pénzfogadási lehetőségek": [
    "Wise receiving options",
    "Wise-Möglichkeiten für den Geldempfang"
  ],
  "Több pénznem kezelése": [
    "Managing several currencies",
    "Mehrere Währungen verwalten"
  ],
  "Több devizánál az átlátható elkülönítés lehet a fő előny.": [
    "Clear separation can be a key advantage with several currencies.",
    "Bei mehreren Währungen kann übersichtliche Trennung der Hauptvorteil sein."
  ],
  "Ellenőrizd, mely pénznemek támogatottak, milyen díjjal válthatsz, és milyen limitek vonatkoznak rád.": [
    "Check supported currencies, exchange fees and your applicable limits.",
    "Prüfe unterstützte Währungen, Wechselgebühren und geltende Limits."
  ],
  "Wise devizás lehetőségek": [
    "Wise currency options",
    "Wise-Währungsmöglichkeiten"
  ],
  "Gyors irányválasztó": [
    "Quick choice guide",
    "Schnelle Auswahlhilfe"
  ],
  "Mire használnád a Wise-t?": [
    "What would you use Wise for?",
    "Wofür würdest du Wise nutzen?"
  ],
  "Válaszd ki a helyzetedet, és megmutatjuk, mit érdemes ellenőrizned.": [
    "Choose your situation to see what to check.",
    "Wähle deine Situation und sieh, was du prüfen solltest."
  ],
  "Wise használati cél kiválasztása": [
    "Choose a Wise use case",
    "Wise-Nutzungszweck auswählen"
  ],
  "Wise utalási feltételek →": [
    "Wise transfer terms →",
    "Wise-Überweisungsbedingungen →"
  ],
  "Wise utazási feltételek →": [
    "Wise travel terms →",
    "Wise-Reisebedingungen →"
  ],
  "Wise pénzfogadási lehetőségek →": [
    "Wise receiving options →",
    "Wise-Möglichkeiten für den Geldempfang →"
  ],
  "Wise devizás lehetőségek →": [
    "Wise currency options →",
    "Wise-Währungsmöglichkeiten →"
  ],
  "/ Autófenntartás": [
    "/ Car ownership",
    "/ Autohaltung"
  ],
  "Élethelyzet útmutató": [
    "Life situation guide",
    "Leitfaden für Lebenssituationen"
  ],
  "Az üzemanyag csak az autózás egyik költsége. Ha reálisan akarsz tervezni, érdemes együtt nézni a tankolást, az értékvesztést, a szervizre félretett összeget és az egy kilométerre jutó teljes terhet.": [
    "Fuel is only one cost of driving. For realistic planning, consider refuelling, depreciation, maintenance reserves and the total cost per kilometre together.",
    "Kraftstoff ist nur ein Teil der Autokosten. Betrachte für eine realistische Planung Tanken, Wertverlust, Wartungsrücklagen und die gesamten Kilometerkosten gemeinsam."
  ],
  "Éves költség": [
    "Annual cost",
    "Jährliche Kosten"
  ],
  "Értékvesztés": [
    "Depreciation",
    "Wertverlust"
  ],
  "Így indulj el": [
    "Getting started",
    "So beginnst du"
  ],
  "Használat": [
    "Usage",
    "Nutzung"
  ],
  "Becsüld meg az éves futást és az átlagfogyasztást.": [
    "Estimate annual mileage and average consumption.",
    "Schätze jährliche Fahrleistung und Durchschnittsverbrauch."
  ],
  "Fix költségek": [
    "Fixed costs",
    "Fixkosten"
  ],
  "Vedd számba a biztosítást, adókat, szervizt és más rendszeres tételeket.": [
    "Include insurance, taxes, servicing and other regular expenses.",
    "Berücksichtige Versicherung, Steuern, Wartung und weitere regelmäßige Ausgaben."
  ],
  "Teljes kép": [
    "The full picture",
    "Das Gesamtbild"
  ],
  "Számold ki az éves és kilométerenkénti költséget is.": [
    "Calculate both annual and per-kilometre costs.",
    "Berechne sowohl Jahres- als auch Kilometerkosten."
  ],
  "Kalkulátorok ehhez az élethelyzethez": [
    "Calculators for this situation",
    "Rechner für diese Lebenssituation"
  ],
  "Lásd egyben a teljes éves fenntartási terhet.": [
    "See the full annual ownership cost together.",
    "Betrachte die gesamten jährlichen Fahrzeugkosten auf einen Blick."
  ],
  "Számold ki egy út vagy időszak üzemanyagköltségét.": [
    "Calculate fuel costs for a trip or period.",
    "Berechne die Kraftstoffkosten einer Fahrt oder eines Zeitraums."
  ],
  "Becsüld meg az egy kilométerre jutó költséget.": [
    "Estimate cost per kilometre.",
    "Schätze die Kosten je Kilometer."
  ],
  "Autó értékvesztés": [
    "Car depreciation",
    "Wertverlust des Autos"
  ],
  "Tervezd be az értékcsökkenést is.": [
    "Include depreciation in your plan.",
    "Plane den Wertverlust ebenfalls ein."
  ],
  "Gumiméret": [
    "Tyre size",
    "Reifengröße"
  ],
  "Hasonlíts össze alternatív gumiméreteket.": [
    "Compare alternative tyre sizes.",
    "Vergleiche alternative Reifengrößen."
  ],
  "Mire figyelj a számok mögött?": [
    "What lies behind the numbers?",
    "Worauf kommt es hinter den Zahlen an?"
  ],
  "Az olcsó tankolás nem egyenlő az olcsó autózással": [
    "Cheap fuel does not mean cheap driving",
    "Günstiges Tanken bedeutet nicht günstiges Autofahren"
  ],
  "Egy keveset fogyasztó autó is lehet drága, ha magas az értékvesztése, a biztosítása vagy a javítási igénye.": [
    "Even a fuel-efficient car can be expensive if depreciation, insurance or repair needs are high.",
    "Auch ein sparsames Auto kann teuer sein, wenn Wertverlust, Versicherung oder Reparaturbedarf hoch sind."
  ],
  "Éves keretet érdemes képezni": [
    "Set an annual budget",
    "Bilde einen jährlichen Kostenrahmen"
  ],
  "A ritkábban jelentkező szerviz- és gumikiadást havi félretett összegre bontva sokkal könnyebb kezelni.": [
    "Infrequent servicing and tyre bills are easier to manage when broken down into monthly savings.",
    "Seltenere Wartungs- und Reifenrechnungen lassen sich durch monatliches Zurücklegen leichter bewältigen."
  ],
  "Melyik adat torzíthatja legjobban a számítást?": [
    "Which inputs can distort the calculation most?",
    "Welche Angaben können die Berechnung am stärksten verzerren?"
  ],
  "Az éves futásteljesítmény és a valós átlagfogyasztás. Ezeket érdemes saját adatokból becsülni.": [
    "Annual mileage and actual average consumption. Estimate these from your own records where possible.",
    "Jährliche Fahrleistung und tatsächlicher Durchschnittsverbrauch. Schätze diese möglichst anhand eigener Daten."
  ],
  "Az értékvesztés valódi kiadás?": [
    "Is depreciation a real expense?",
    "Ist Wertverlust eine tatsächliche Ausgabe?"
  ],
  "Nem havi számla, de gazdasági költség: az autó eladásakor kevesebbet érhet.": [
    "It is not a monthly bill, but it is an economic cost: the car may be worth less when sold.",
    "Er ist keine monatliche Rechnung, aber ein wirtschaftlicher Kostenfaktor: Beim Verkauf kann das Auto weniger wert sein."
  ],
  "Miért jó kilométerköltséget számolni?": [
    "Why calculate cost per kilometre?",
    "Warum Kilometerkosten berechnen?"
  ],
  "Segít összehasonlítani az autózást más közlekedési módokkal vagy céges térítéssel.": [
    "It helps compare driving with other transport options or employer reimbursement.",
    "Es hilft, Autofahren mit anderen Verkehrsmitteln oder betrieblicher Kostenerstattung zu vergleichen."
  ],
  "Más élethelyzetek": [
    "Other life situations",
    "Andere Lebenssituationen"
  ],
  "Lakásvásárlás": [
    "Buying a home",
    "Wohnungskauf"
  ],
  "Gyakorlati példa: mennyibe kerül valójában egy év autózás?": [
    "Practical example: what does a year of driving really cost?",
    "Praxisbeispiel: Was kostet ein Jahr Autofahren tatsächlich?"
  ],
  "Tegyük fel, hogy egy autó évente 15 000 kilométert fut, átlagosan 6,5 litert fogyaszt 100 kilométeren, az üzemanyag pedig 620 Ft literenként. Az éves fogyasztás így 975 liter, az üzemanyag becsült költsége 604 500 Ft. Ez még nem a teljes autóköltség, csak a használattal közvetlenül változó rész.": [
    "Suppose a car travels 15,000 km a year, averages 6.5 litres per 100 km and fuel costs HUF 620 per litre. Annual consumption is 975 litres, with estimated fuel costs of HUF 604,500. This is only the part directly varying with use, not total car costs.",
    "Angenommen, ein Auto fährt jährlich 15.000 km, verbraucht durchschnittlich 6,5 Liter je 100 km und Kraftstoff kostet 620 HUF je Liter. Das ergibt 975 Liter und geschätzte Kraftstoffkosten von 604.500 HUF pro Jahr. Das sind nur die unmittelbar nutzungsabhängigen Kosten, nicht die gesamten Fahrzeugkosten."
  ],
  "Ha a példában a biztosítás 90 000 Ft, az adók és matricák 80 000 Ft, a szervizkeret 220 000 Ft, a gumik évesített költsége 70 000 Ft, a parkolás 180 000 Ft, az értékvesztés pedig 350 000 Ft, akkor a többi éves tétel 990 000 Ft. Az üzemanyaggal együtt ez 1 594 500 Ft, vagyis havi átlagban körülbelül 132 875 Ft és kilométerenként mintegy 106 Ft.": [
    "With insurance of HUF 90,000, taxes and vignettes of HUF 80,000, servicing of HUF 220,000, annualised tyres of HUF 70,000, parking of HUF 180,000 and depreciation of HUF 350,000, other annual costs total HUF 990,000. Including fuel, the total is HUF 1,594,500, averaging about HUF 132,875 monthly or HUF 106 per kilometre.",
    "Bei 90.000 HUF Versicherung, 80.000 HUF Steuern und Vignetten, 220.000 HUF Wartung, 70.000 HUF anteiligen Reifenkosten, 180.000 HUF Parken und 350.000 HUF Wertverlust betragen die übrigen Jahreskosten 990.000 HUF. Mit Kraftstoff sind es 1.594.500 HUF, im Monatsdurchschnitt etwa 132.875 HUF oder rund 106 HUF je Kilometer."
  ],
  "Készíts három külön keretet": [
    "Create three separate budgets",
    "Bilde drei getrennte Kostenrahmen"
  ],
  "A rendszeres számlákat, a kilométerrel változó költségeket és a ritka, de várható kiadásokat külön kezeld. A szervizt, gumit és biztosítást oszd vissza havi összegre. Így egy nagyobb éves számla nem váratlan eseményként jelenik meg a családi költségvetésben.": [
    "Separate regular bills, mileage-related costs and infrequent but expected expenses. Convert servicing, tyres and insurance to monthly amounts so large annual bills are not surprises in the family budget.",
    "Trenne regelmäßige Rechnungen, kilometerabhängige Kosten und seltene, aber erwartbare Ausgaben. Rechne Wartung, Reifen und Versicherung auf Monatsbeträge um, damit große Jahresrechnungen im Familienbudget nicht überraschen."
  ],
  "Csak egy feltételezést változtass egyszerre": [
    "Change only one assumption at a time",
    "Ändere nur eine Annahme auf einmal"
  ],
  "Próbáld ki, mi történik 10%-kal magasabb üzemanyagárnál, 20%-kal több futásnál vagy nagyobb szervizkeretnél. Így láthatóvá válik, melyik adat mozgatja legjobban a végeredményt. Saját fogyasztási átlaghoz több tankolás kilométer- és litervadata ad jobb alapot, mint egyetlen út.": [
    "Try fuel prices 10% higher, mileage 20% higher or a larger service budget. This reveals which input most affects the total. For your actual consumption average, mileage and litres across several fill-ups provide a better basis than a single trip.",
    "Prüfe 10 % höhere Kraftstoffpreise, 20 % mehr Fahrleistung oder ein größeres Wartungsbudget. So erkennst du, welche Eingabe das Ergebnis am stärksten beeinflusst. Für den tatsächlichen Durchschnittsverbrauch bieten Kilometer- und Literdaten mehrerer Tankfüllungen eine bessere Basis als eine einzelne Fahrt."
  ],
  "Forrás, ellenőrzés és korlát": [
    "Sources, checks and limitations",
    "Quellen, Prüfung und Grenzen"
  ],
  "Az aktuális árakhoz és költségtrendekhez használj saját számlát, biztosítói ajánlatot, gyártói karbantartási tervet, valamint a": [
    "For current prices and cost trends, use your own bills, insurance quotes, manufacturer maintenance plans and",
    "Nutze für aktuelle Preise und Kostentrends eigene Rechnungen, Versicherungsangebote, Hersteller-Wartungspläne und die"
  ],
  "KSH árstatisztikáit": [
    "KSH price statistics",
    "Preisstatistiken des KSH"
  ],
  ". A kalkulátor nem becsüli meg automatikusan a baleseti kockázatot, a finanszírozási kamatot vagy minden típus egyedi szervizigényét. Vásárlási döntés előtt kérj konkrét biztosítási és szervizajánlatot is.": [
    ". The calculator does not automatically estimate accident risk, financing interest or every model’s particular maintenance needs. Obtain specific insurance and servicing quotes before buying.",
    ". Der Rechner schätzt Unfallrisiko, Finanzierungszinsen und den individuellen Wartungsbedarf jedes Modells nicht automatisch. Hole vor dem Kauf konkrete Versicherungs- und Wartungsangebote ein."
  ],
  "Üzemeltető:": [
    "Operator:",
    "Betreiber:"
  ],
  "Kalkulátor Bázis. Utolsó szerkesztési, számolási és linkellenőrzés:": [
    "Kalkulátor Bázis. Last editorial, calculation and link check:",
    "Kalkulátor Bázis. Letzte redaktionelle, rechnerische und Linkprüfung:"
  ],
  "Átláthatóság": [
    "Transparency",
    "Transparenz"
  ],
  "Autótartási költségtérkép": [
    "Car ownership cost map",
    "Kostenübersicht zur Autohaltung"
  ],
  "A tankolás a legláthatóbb költség, de nem feltétlenül a legnagyobb": [
    "Fuel is the most visible cost, but not necessarily the largest",
    "Tanken ist der sichtbarste Kostenpunkt, aber nicht unbedingt der größte"
  ],
  "Használattal nő": [
    "Increases with use",
    "Steigt mit der Nutzung"
  ],
  "Üzemanyag, útdíj, parkolás és a futással arányos kopás.": [
    "Fuel, tolls, parking and mileage-related wear.",
    "Kraftstoff, Maut, Parken und laufleistungsabhängiger Verschleiß."
  ],
  "Idővel jelentkezik": [
    "Occurs over time",
    "Fällt mit der Zeit an"
  ],
  "Biztosítás, adók, műszaki vizsga, időszakos szerviz és gumi.": [
    "Insurance, taxes, roadworthiness tests, scheduled servicing and tyres.",
    "Versicherung, Steuern, technische Prüfungen, regelmäßige Wartung und Reifen."
  ],
  "Nem havi számla": [
    "Not a monthly bill",
    "Keine monatliche Rechnung"
  ],
  "Értékvesztés: pénzügyi költség akkor is, ha nem minden hónapban fizeted ki.": [
    "Depreciation is a financial cost even when it is not paid monthly.",
    "Wertverlust ist ein finanzieller Kostenfaktor, auch wenn du ihn nicht monatlich bezahlst."
  ],
  "Váratlan": [
    "Unexpected",
    "Unerwartet"
  ],
  "Javítás és meghibásodás: ezért érdemes külön autós céltartalékot kezelni.": [
    "Repairs and breakdowns: keep a separate car reserve.",
    "Reparaturen und Defekte: Halte deshalb eine eigene Fahrzeugrücklage vor."
  ],
  "Egy út döntéséhez a marginális költség lehet elég; autó birtoklásának összehasonlításához viszont a teljes éves költség a relevánsabb.": [
    "Marginal costs may suffice for a single-trip decision; comparing car ownership calls for total annual costs.",
    "Für die Entscheidung über eine einzelne Fahrt können Grenzkosten reichen. Beim Vergleich des Autobesitzes sind dagegen die gesamten Jahreskosten aussagekräftiger."
  ],
  "Autófenntartás valódi költségei | Kalkulátor Bázis": [
    "The Real Cost of Car Ownership · Kalkulátor Bázis",
    "Tatsächliche Kosten der Autohaltung · Kalkulátor Bázis"
  ],
  "/ Befektetés kezdőknek": [
    "/ Investing for beginners",
    "/ Anlegen für Einsteiger"
  ],
  "Befektetés kezdőknek: számolj, mielőtt döntesz": [
    "Investing for beginners: calculate before deciding",
    "Anlegen für Einsteiger: Erst rechnen, dann entscheiden"
  ],
  "Befektetésnél nem az a legfontosabb, hogy megtaláld a „legjobb” terméket, hanem hogy értsd az időtáv, a hozam, a kockázat, az infláció és a rendszeres megtakarítás kapcsolatát.": [
    "Investing is less about finding the “best” product than understanding time horizons, returns, risk, inflation and regular saving together.",
    "Beim Anlegen geht es weniger darum, das „beste“ Produkt zu finden, als den Zusammenhang zwischen Zeit, Rendite, Risiko, Inflation und regelmäßigem Sparen zu verstehen."
  ],
  "Időtáv": [
    "Time horizon",
    "Zeithorizont"
  ],
  "Hozam-forgatókönyvek": [
    "Return scenarios",
    "Renditeszenarien"
  ],
  "Cél": [
    "Goal",
    "Ziel"
  ],
  "Határozd meg, mire és mikorra szeretnél tőkét építeni.": [
    "Decide what you want to build capital for and by when.",
    "Lege fest, wofür und bis wann du Kapital aufbauen möchtest."
  ],
  "Nézd meg több hozam- és időtáv-forgatókönyvvel az eredményt.": [
    "Explore results under several return and time-horizon scenarios.",
    "Betrachte Ergebnisse mit mehreren Rendite- und Zeitszenarien."
  ],
  "Kockázat": [
    "Risk",
    "Risiko"
  ],
  "Ne kezeld garantáltként a kalkulátorban megadott hozamot.": [
    "Do not treat the return entered in a calculator as guaranteed.",
    "Behandle die eingegebene Rendite nicht als Garantie."
  ],
  "Becsüld meg rendszeres befektetés várható növekedését.": [
    "Estimate the potential growth of regular investments.",
    "Schätze das mögliche Wachstum regelmäßiger Anlagen."
  ],
  "Lásd, hogyan épül egymásra a tőke és a hozam.": [
    "See how capital and returns build on each other.",
    "Sieh, wie Kapital und Erträge aufeinander aufbauen."
  ],
  "Számolj a pénz vásárlóerejének változásával.": [
    "Account for changes in purchasing power.",
    "Berücksichtige Veränderungen der Kaufkraft."
  ],
  "Osztalék": [
    "Dividends",
    "Dividenden"
  ],
  "Becsüld meg az osztalékjövedelmet és szükséges tőkét.": [
    "Estimate dividend income and the capital required.",
    "Schätze Dividendeneinkommen und benötigtes Kapital."
  ],
  "Milliomos kalkulátor": [
    "Millionaire Goal Calculator",
    "Millionär-Zielrechner"
  ],
  "Nézd meg, milyen ütem kell egy célösszeghez.": [
    "See the saving pace needed to reach a target amount.",
    "Prüfe, welches Spartempo für einen Zielbetrag nötig ist."
  ],
  "Derítsd ki, mennyit tudsz rendszeresen félretenni.": [
    "Find how much you can regularly set aside.",
    "Ermittle, wie viel du regelmäßig zurücklegen kannst."
  ],
  "A hozam feltételezés, nem ígéret": [
    "Returns are assumptions, not promises",
    "Renditen sind Annahmen, keine Versprechen"
  ],
  "Ugyanaz a hosszú távú átlaghozam nagyon eltérő éves eredményekből állhat össze. Mindig próbálj több forgatókönyvet.": [
    "The same long-term average return can arise from very different annual results. Always try several scenarios.",
    "Derselbe langfristige Durchschnittsertrag kann aus sehr unterschiedlichen Jahresergebnissen entstehen. Prüfe stets mehrere Szenarien."
  ],
  "Előbb legyen stabil havi keret": [
    "Build a stable monthly budget first",
    "Schaffe zuerst einen stabilen Monatsrahmen"
  ],
  "A rendszeres befektetés akkor fenntartható, ha nem a vésztartalék vagy rövid távú kiadások rovására történik.": [
    "Regular investing is sustainable only when it does not use up emergency reserves or money for short-term expenses.",
    "Regelmäßiges Anlegen ist nur nachhaltig, wenn es nicht zulasten der Notfallreserve oder kurzfristiger Ausgaben geht."
  ],
  "Mekkora hozammal számoljak?": [
    "What return should I assume?",
    "Mit welcher Rendite sollte ich rechnen?"
  ],
  "Érdemes óvatos, közepes és optimista forgatókönyvet is megnézni, nem egyetlen számhoz ragaszkodni.": [
    "Explore cautious, moderate and optimistic scenarios instead of relying on one figure.",
    "Betrachte vorsichtige, mittlere und optimistische Szenarien statt einer einzigen Zahl."
  ],
  "Az ETF kalkulátor befektetési tanácsot ad?": [
    "Does the ETF calculator give investment advice?",
    "Gibt der ETF-Rechner Anlageberatung?"
  ],
  "Nem. Matematikai forgatókönyveket mutat megadott feltételezések alapján.": [
    "No. It shows mathematical scenarios based on the assumptions entered.",
    "Nein. Er zeigt mathematische Szenarien anhand der eingegebenen Annahmen."
  ],
  "Miért kell inflációval is számolni?": [
    "Why account for inflation too?",
    "Warum auch Inflation berücksichtigen?"
  ],
  "Mert a jövőbeli nominális összeg vásárlóereje eltérhet a mai értékétől.": [
    "A future nominal amount may have different purchasing power from today’s money.",
    "Ein künftiger Nominalbetrag kann eine andere Kaufkraft haben als heutiges Geld."
  ],
  "Fizetés és munkabér": [
    "Salary and wages",
    "Gehalt und Arbeitslohn"
  ],
  "Gyakorlati példa: ugyanaz a megtakarítás három forgatókönyvben": [
    "Practical example: the same savings in three scenarios",
    "Praxisbeispiel: Dasselbe Sparen in drei Szenarien"
  ],
  "Indulj például 500 000 Ft kezdőtőkével és havi 30 000 Ft befizetéssel, majd nézz meg 20 éves időtávot. Először állíts be óvatos, közepes és kedvezőbb éves hozamfeltételezést, például 3%, 6% és 9% értéket. Ezek nem előrejelzések: azt mutatják meg, mennyire érzékeny a végeredmény az általad megadott hozamra.": [
    "Start, for example, with HUF 500,000 and monthly contributions of HUF 30,000 over 20 years. Try cautious, moderate and more favourable annual return assumptions, such as 3%, 6% and 9%. These are not forecasts: they show sensitivity to your assumed return.",
    "Beginne beispielsweise mit 500.000 HUF Startkapital und monatlich 30.000 HUF über 20 Jahre. Prüfe vorsichtige, mittlere und günstigere jährliche Renditeannahmen, etwa 3 %, 6 % und 9 %. Das sind keine Prognosen, sondern zeigen, wie empfindlich das Ergebnis auf die eingegebene Rendite reagiert."
  ],
  "Ezután tartsd változatlanul a hozamot, és módosítsd a havi befizetést vagy az időtávot. A rendszeres megtakarítás növelése biztosan a saját döntésedhez kötődik, a piaci hozam viszont nem. Emiatt tervezéskor különösen hasznos megfigyelni, mennyit tesz hozzá az idő, a befizetés és a feltételezett hozam. Végül nézd meg a nominális végösszeg mai vásárlóértékét is egy külön inflációs forgatókönyvvel.": [
    "Then keep returns unchanged and vary monthly contributions or duration. Increasing regular savings is within your control; market returns are not. Observe how time, contributions and assumed returns each affect the result. Finally, use a separate inflation scenario to express the nominal total in today’s purchasing power.",
    "Halte danach die Rendite konstant und ändere Monatsbeitrag oder Laufzeit. Höheres regelmäßiges Sparen liegt in deiner Hand, die Marktrendite nicht. Beobachte, was Zeit, Einzahlungen und angenommene Rendite jeweils beitragen. Betrachte den nominalen Endbetrag zuletzt mit einem eigenen Inflationsszenario in heutiger Kaufkraft."
  ],
  "Előbb likvid tartalék, utána hosszú időtáv": [
    "Liquid reserves before long-term investing",
    "Erst liquide Rücklagen, dann langfristig anlegen"
  ],
  "A néhány hónapon belül szükséges pénzt ne kezeld ugyanúgy, mint a tíz–húsz éves célt. Írd fel külön a vésztartalékot, a rövid távú nagy kiadásokat és a valóban hosszú távon nélkülözhető összeget. A kalkulátor nem tudja felmérni, hogy egy piaci visszaesés idején szükséged lesz-e a befektetett pénzre.": [
    "Money needed within months should not be treated like a ten- or twenty-year goal. List emergency reserves, major short-term costs and genuinely long-term available funds separately. The calculator cannot assess whether you will need the invested money during a market downturn.",
    "Behandle Geld, das du in wenigen Monaten brauchst, nicht wie ein Zehn- oder Zwanzigjahresziel. Trenne Notfallreserve, große kurzfristige Ausgaben und wirklich langfristig verfügbares Geld. Der Rechner kann nicht beurteilen, ob du das angelegte Geld bei einem Marktrückgang benötigst."
  ],
  "A költség és az adózás is számít": [
    "Costs and taxes matter too",
    "Kosten und Steuern zählen ebenfalls"
  ],
  "Az alapkezelési díj, tranzakciós költség, devizaváltás és az adott számlatípus adózása csökkentheti a felhasználható eredményt. Hasonlíts össze azonos időtávú, azonos befizetésű forgatókönyveket, és ne következtess egyetlen múltbeli hozamból a jövőre.": [
    "Fund charges, transaction fees, currency conversion and the account’s tax treatment can reduce usable returns. Compare equal-duration scenarios with equal contributions and do not infer future returns from a single historical result.",
    "Fondskosten, Transaktionsgebühren, Währungswechsel und die Besteuerung des Kontotyps können das verfügbare Ergebnis verringern. Vergleiche Szenarien mit gleicher Laufzeit und gleichen Einzahlungen. Leite die Zukunft nicht aus einem einzelnen vergangenen Ertrag ab."
  ],
  "A pénzügyi termékek kockázatairól és a megtakarítási formákról az": [
    "For current information on financial product risks and savings options, check the",
    "Aktuelle Informationen zu Risiken von Finanzprodukten und Sparformen findest du auf den"
  ],
  "MNB fogyasztóvédelmi oldalain": [
    "MNB consumer-protection pages",
    "Verbraucherschutzseiten der MNB"
  ],
  "ellenőrizz aktuális információt. A Kalkulátor Bázis matematikai forgatókönyvet készít, nem vizsgál konkrét értékpapírt, szolgáltatót, adóilletőséget vagy alkalmasságot, és nem ad vételi vagy eladási ajánlást.": [
    ". Kalkulátor Bázis models mathematics, not individual securities, providers, tax residency or suitability, and gives no buy or sell recommendations.",
    ". Kalkulátor Bázis erstellt mathematische Szenarien, prüft keine konkreten Wertpapiere, Anbieter, Steueransässigkeit oder Eignung und gibt keine Kauf- oder Verkaufsempfehlungen."
  ],
  "Befektetési feltételezés-létra": [
    "Investment assumption ladder",
    "Stufen der Anlageannahmen"
  ],
  "A hozam nem bemeneti igazság, hanem forgatókönyv": [
    "A return is a scenario, not an input fact",
    "Eine Rendite ist ein Szenario, keine feststehende Eingabe"
  ],
  "Mikor kellhet a pénz, és mennyire fér bele közben az árfolyam-ingadozás?": [
    "When might you need the money, and how much market fluctuation can you tolerate meanwhile?",
    "Wann könntest du das Geld benötigen und wie viel Kursschwankung kannst du bis dahin verkraften?"
  ],
  "Befizetés": [
    "Contributions",
    "Einzahlungen"
  ],
  "Egyszeri összeg, rendszeres megtakarítás vagy mindkettő?": [
    "A lump sum, regular savings or both?",
    "Einmalbetrag, regelmäßiges Sparen oder beides?"
  ],
  "Ne egyetlen optimista százalékból indulj; használj alacsonyabb és magasabb forgatókönyvet is.": [
    "Use lower and higher return scenarios, not one optimistic percentage.",
    "Verwende niedrigere und höhere Renditeszenarien statt eines einzigen optimistischen Prozentsatzes."
  ],
  "Alapkezelési, szolgáltatói, tranzakciós és devizaköltség csökkentheti a végeredményt.": [
    "Fund, provider, transaction and currency costs can reduce the final result.",
    "Fonds-, Anbieter-, Transaktions- und Währungskosten können den Endbetrag verringern."
  ],
  "A nominális jövőérték és a mai vásárlóerő nem ugyanaz.": [
    "Nominal future value and today’s purchasing power are different.",
    "Nominaler Zukunftswert und heutige Kaufkraft sind nicht dasselbe."
  ],
  "Adó": [
    "Tax",
    "Steuer"
  ],
  "Az adózási környezet és számlatípus a nettó eredményt módosíthatja.": [
    "The tax environment and account type can change the net outcome.",
    "Steuerumfeld und Kontotyp können das Nettoergebnis verändern."
  ],
  "A kalkulátorok nem árfolyam-előrejelzések; a cél a feltételezések következményének láthatóvá tétele.": [
    "Calculators are not market forecasts; they make the consequences of assumptions visible.",
    "Rechner sind keine Kursprognosen. Sie machen die Folgen von Annahmen sichtbar."
  ],
  "Befektetés kezdőknek: számolj, mielőtt döntesz | Kalkulátor Bázis": [
    "Investing for Beginners: Calculate Before Deciding · Kalkulátor Bázis",
    "Anlegen für Einsteiger: Erst rechnen, dann entscheiden · Kalkulátor Bázis"
  ],
  "/ Családi költségvetés": [
    "/ Family budget",
    "/ Familienbudget"
  ],
  "Családi költségvetés: lásd egyben a havi pénzügyeket": [
    "Family budget: see monthly finances together",
    "Familienbudget: Die Monatsfinanzen im Überblick"
  ],
  "A családi költségvetés akkor használható igazán, ha nem csak a hónap végén derül ki, mennyi maradt. Előre érdemes szétválasztani a rendszeres kiadásokat, változó költségeket, megtakarítást és a ritkábban jelentkező nagyobb tételeket.": [
    "A family budget is most useful when you know what remains before month-end. Separate regular spending, variable costs, savings and less frequent larger expenses in advance.",
    "Ein Familienbudget ist besonders hilfreich, wenn nicht erst am Monatsende klar wird, was übrig bleibt. Trenne regelmäßige Ausgaben, variable Kosten, Sparen und seltenere größere Posten im Voraus."
  ],
  "Bevételek": [
    "Income",
    "Einnahmen"
  ],
  "Kiadások": [
    "Expenses",
    "Ausgaben"
  ],
  "Gyűjtsd össze minden rendszeres és várható családi bevételt.": [
    "List all regular and expected household income.",
    "Erfasse alle regelmäßigen und erwarteten Familieneinnahmen."
  ],
  "Válaszd szét a fix, változó és éves vagy ritka költségeket.": [
    "Separate fixed, variable, annual and occasional costs.",
    "Trenne feste, variable sowie jährliche oder seltene Kosten."
  ],
  "Célok": [
    "Goals",
    "Ziele"
  ],
  "A megtakarítást kezeld tervezett tételként, ne csak hónap végi maradékként.": [
    "Treat saving as planned spending, not just a month-end leftover.",
    "Behandle Sparen als geplanten Posten statt nur als Monatsrest."
  ],
  "Készíts gyors havi pénzügyi képet.": [
    "Build a quick monthly financial overview.",
    "Erstelle einen schnellen Überblick über die Monatsfinanzen."
  ],
  "Becsüld meg a munkabérből érkező nettó összeget.": [
    "Estimate take-home pay from your salary.",
    "Schätze den Nettobetrag aus deinem Arbeitslohn."
  ],
  "Rezsi megosztás": [
    "Utility cost sharing",
    "Nebenkosten aufteilen"
  ],
  "Oszd el átláthatóan a közös költségeket.": [
    "Split shared costs transparently.",
    "Teile gemeinsame Kosten transparent auf."
  ],
  "Tervezd be a havi hitelterhet.": [
    "Plan monthly loan repayments.",
    "Plane die monatliche Kreditbelastung ein."
  ],
  "Nézd meg, mit érhet a rendszeres megtakarítás hosszabb távon.": [
    "Explore the longer-term value of regular savings.",
    "Prüfe, was regelmäßiges Sparen langfristig wert sein könnte."
  ],
  "Vizsgáld meg, hogyan változhat a pénz vásárlóereje.": [
    "Explore changes in purchasing power.",
    "Betrachte mögliche Kaufkraftveränderungen."
  ],
  "Az éves kiadásokat oszd vissza havi összegre": [
    "Convert annual expenses to monthly amounts",
    "Rechne Jahresausgaben auf Monatsbeträge um"
  ],
  "Biztosítás, szerviz, iskolakezdés vagy ünnepek akkor nem borítják fel a hónapot, ha előre képzel nekik havi keretet.": [
    "Insurance, servicing, school-start costs and holidays need not disrupt a month if you budget for them monthly in advance.",
    "Versicherung, Wartung, Schulbeginn oder Feiertage bringen den Monat nicht durcheinander, wenn du vorher monatlich dafür vorsorgst."
  ],
  "A költségvetés nem tiltólista": [
    "A budget is not a list of prohibitions",
    "Ein Budget ist keine Verbotsliste"
  ],
  "A cél az, hogy tudd, mire mennyi mehet úgy, hogy közben a kötelező tételek és a pénzügyi célok is teljesülnek.": [
    "The aim is to know how much can go where while meeting commitments and financial goals.",
    "Ziel ist zu wissen, wofür wie viel möglich ist, während Pflichtposten und finanzielle Ziele erfüllt werden."
  ],
  "Milyen gyakran érdemes frissíteni?": [
    "How often should I update it?",
    "Wie oft sollte ich es aktualisieren?"
  ],
  "Legalább havonta, illetve jelentősebb jövedelmi vagy kiadási változáskor.": [
    "At least monthly and whenever income or spending changes significantly.",
    "Mindestens monatlich und bei wesentlichen Einkommens- oder Ausgabenänderungen."
  ],
  "A megtakarítás kiadásnak számít?": [
    "Does saving count as an expense?",
    "Zählt Sparen als Ausgabe?"
  ],
  "Tervezési szempontból érdemes külön kötelező tételként kezelni.": [
    "For planning, treat it as a separate required item.",
    "Behandle es bei der Planung als eigenen verbindlichen Posten."
  ],
  "Hogyan kezeljem a ritka nagy kiadásokat?": [
    "How should I handle infrequent large expenses?",
    "Wie behandle ich seltene große Ausgaben?"
  ],
  "Becsüld meg az éves összeget, oszd 12 hónapra, és képezz rá külön keretet.": [
    "Estimate their annual total, divide by 12 and set aside a separate budget.",
    "Schätze die Jahressumme, teile sie durch zwölf und bilde einen eigenen Kostenrahmen."
  ],
  "Gyakorlati példa: a hónap elején adj feladatot minden forintnak": [
    "Practical example: assign every forint a job at the start of the month",
    "Praxisbeispiel: Gib jedem Forint am Monatsanfang eine Aufgabe"
  ],
  "Tegyük fel, hogy a háztartás biztos havi nettó bevétele 800 000 Ft. A lakhatás, rezsi, hitel és más fix tételek együtt 400 000 Ft-ot tesznek ki, az élelmiszerre, közlekedésre és egyéb változó kiadásokra 180 000 Ft-os keretet terveztek. Az évente vagy ritkábban jelentkező költségekre havi 60 000 Ft-ot, megtakarításra pedig 100 000 Ft-ot különítetek el. Így 60 000 Ft szabad mozgástér marad.": [
    "Suppose reliable monthly household net income is HUF 800,000. Housing, utilities, loans and other fixed costs total HUF 400,000, with HUF 180,000 for food, transport and other variable spending. Set aside HUF 60,000 for annual or occasional costs and HUF 100,000 for savings. This leaves HUF 60,000 of flexibility.",
    "Angenommen, die sicheren monatlichen Nettohaushaltseinnahmen betragen 800.000 HUF. Wohnen, Nebenkosten, Kredit und andere Fixposten summieren sich auf 400.000 HUF, für Lebensmittel, Verkehr und variable Ausgaben sind 180.000 HUF geplant. Für jährliche oder seltene Kosten werden 60.000 HUF und zum Sparen 100.000 HUF zurückgelegt. Es bleiben 60.000 HUF Spielraum."
  ],
  "A példa akkor használható, ha a 60 000 Ft nem „elkölthető jutalomként”, hanem eltéréskezelő keretként jelenik meg. Ha az élelmiszer vagy energia drágább lett, először ebből fedezhető a különbség. Ha több hónapon át megmarad, átvezethető vésztartalékba vagy célmegtakarításba. A bizonytalan bónuszt és alkalmi bevételt ne építsd be a biztos alapkeretbe addig, amíg ténylegesen meg nem érkezik.": [
    "Treat that HUF 60,000 as a buffer, not a spending reward. It can cover higher food or energy costs. If it remains for several months, move it to emergency or goal savings. Do not include uncertain bonuses or occasional income in the reliable base budget until received.",
    "Behandle diese 60.000 HUF als Ausgleichspuffer statt als Belohnung zum Ausgeben. Daraus lassen sich höhere Lebensmittel- oder Energiekosten decken. Bleibt der Betrag mehrere Monate übrig, kann er in Notfall- oder Zielsparen fließen. Unsichere Boni oder gelegentliche Einnahmen gehören erst nach Eingang in den sicheren Grundrahmen."
  ],
  "A ritka kiadás is havi költség": [
    "Infrequent expenses are monthly costs too",
    "Seltene Ausgaben sind ebenfalls Monatskosten"
  ],
  "Írd össze egy év várható nagyobb tételeit: biztosítás, iskolakezdés, ünnepek, szerviz, előfizetés vagy egészségügyi kiadás. Az éves összeget oszd tizenkettővel, és minden hónapban tedd félre. Így a havi költségvetés nem csak a gyakori számlákat mutatja.": [
    "List expected major annual expenses: insurance, school-start costs, holidays, servicing, subscriptions and healthcare. Divide the annual total by twelve and save monthly. This makes the budget cover more than frequent bills.",
    "Erfasse erwartete größere Jahresposten: Versicherung, Schulbeginn, Feiertage, Wartung, Abonnements oder Gesundheitskosten. Teile die Jahressumme durch zwölf und lege monatlich zurück. So zeigt das Budget mehr als häufige Rechnungen."
  ],
  "Hetente rögzíts, havonta értékelj": [
    "Record weekly, review monthly",
    "Wöchentlich erfassen, monatlich auswerten"
  ],
  "A napi tökéletesség helyett legyen fenntartható ritmus. Hetente ellenőrizd a változó kategóriákat, hónap végén pedig hasonlítsd össze a tervet és a tényadatot. Ha ugyanaz a kategória három hónapig túllépi a keretet, valószínűleg a tervet kell módosítani, nem újra és újra „rendkívüli” kiadásnak nevezni.": [
    "Use a sustainable routine instead of daily perfection. Check variable categories weekly and compare planned and actual spending at month-end. If one category exceeds its limit for three months, revise the plan rather than repeatedly calling it exceptional.",
    "Nutze einen nachhaltigen Rhythmus statt täglicher Perfektion. Prüfe variable Kategorien wöchentlich und vergleiche Plan und Ist am Monatsende. Überzieht dieselbe Kategorie drei Monate lang, muss wahrscheinlich der Plan geändert werden, statt die Ausgabe jedes Mal als Ausnahme zu bezeichnen."
  ],
  "A saját bankszámlakivonat és számlák adják a legjobb kiindulópontot. A fogyasztási csoportok és árak tágabb összevetéséhez használható a": [
    "Your bank statements and bills are the best starting point. For broader comparisons of spending groups and prices, use the",
    "Eigene Kontoauszüge und Rechnungen sind der beste Ausgangspunkt. Für umfassendere Vergleiche von Verbrauchsgruppen und Preisen helfen die"
  ],
  "KSH háztartási fogyasztási tájékoztatója": [
    "KSH household consumption information",
    "KSH-Informationen zum Haushaltsverbrauch"
  ],
  "KSH árstatisztikája": [
    "KSH price statistics",
    "KSH-Preisstatistiken"
  ],
  ". A kalkulátor nem ismeri a család jogosultságait, szerződéseit vagy váratlan eseményeit; a kategóriákat ezért a saját helyzetedhez igazítsd.": [
    ". The calculator does not know your household’s entitlements, contracts or unexpected events; adapt categories to your circumstances.",
    ". Der Rechner kennt Ansprüche, Verträge oder unerwartete Ereignisse deiner Familie nicht. Passe die Kategorien deshalb deiner Situation an."
  ],
  "Háztartási pénzáramlás": [
    "Household cash flow",
    "Geldfluss im Haushalt"
  ],
  "A „havi kiadás” három külön időritmust takarhat": [
    "Monthly spending may cover three different rhythms",
    "Monatsausgaben können drei verschiedene Zeitrhythmen umfassen"
  ],
  "Minden hónap": [
    "Every month",
    "Jeden Monat"
  ],
  "Lakhatás, törlesztő, biztosítás, előfizetések és rendszeres megtakarítás.": [
    "Housing, loan repayments, insurance, subscriptions and regular saving.",
    "Wohnen, Kreditrate, Versicherung, Abonnements und regelmäßiges Sparen."
  ],
  "Változó": [
    "Variable",
    "Variabel"
  ],
  "Élelmiszer, közlekedés, szabadidő és olyan tételek, amelyek hónapról hónapra mozognak.": [
    "Food, transport, leisure and other items that change monthly.",
    "Lebensmittel, Verkehr, Freizeit und andere monatlich schwankende Posten."
  ],
  "Ritka, de biztos": [
    "Infrequent but predictable",
    "Selten, aber vorhersehbar"
  ],
  "Éves díjak, iskolakezdés, karbantartás, ajándékok vagy szezonális kiadások – havi céltartalékkal simíthatók.": [
    "Annual fees, school-start costs, maintenance, gifts and seasonal spending can be smoothed by monthly reserves.",
    "Jahresgebühren, Schulbeginn, Wartung, Geschenke und saisonale Ausgaben lassen sich durch monatliche Rücklagen glätten."
  ],
  "Vésztartalékból kezelhető események, amelyekre nincs pontos dátum vagy összeg.": [
    "Events without an exact date or amount that can be covered by emergency reserves.",
    "Ereignisse ohne genaues Datum oder feste Summe, die aus der Notfallreserve gedeckt werden können."
  ],
  "A költségvetés akkor használható döntésre, ha a megtakarítást nem a hónap végén „maradó pénzként”, hanem előre tervezett tételként is képes kezelni.": [
    "A budget supports decisions when savings are planned in advance rather than treated only as money left at month-end.",
    "Ein Budget unterstützt Entscheidungen, wenn Sparen vorab geplant wird statt nur als Geldrest am Monatsende zu gelten."
  ],
  "Családi költségvetés tervezése | Kalkulátor Bázis": [
    "Family Budget Planning · Kalkulátor Bázis",
    "Familienbudget planen · Kalkulátor Bázis"
  ],
  "/ Felújítás": [
    "/ Renovation",
    "/ Renovierung"
  ],
  "Felújításnál a legtöbb kellemetlen meglepetés a mennyiségek alul- vagy túlbecsléséből jön. A cél nem a milliméterpontos rendelés, hanem egy követhető alapmennyiség és ésszerű ráhagyás meghatározása.": [
    "Most unpleasant renovation surprises come from over- or underestimating quantities. The aim is a traceable baseline and reasonable allowance, not an order accurate to the millimetre.",
    "Die meisten unangenehmen Überraschungen bei Renovierungen entstehen durch zu hoch oder zu niedrig geschätzte Mengen. Ziel sind eine nachvollziehbare Grundmenge und ein sinnvoller Zuschlag, keine millimetergenaue Bestellung."
  ],
  "Felületmérés": [
    "Surface measurement",
    "Flächenmessung"
  ],
  "Anyagszükséglet": [
    "Material requirement",
    "Materialbedarf"
  ],
  "Mérés": [
    "Measurement",
    "Messung"
  ],
  "Mérd fel a felületeket, nyílásokat és helyiségeket.": [
    "Measure surfaces, openings and rooms.",
    "Miss Flächen, Öffnungen und Räume aus."
  ],
  "Számold ki az alapmennyiséget a megfelelő kalkulátorral.": [
    "Calculate the baseline quantity with the appropriate tool.",
    "Berechne die Grundmenge mit dem passenden Rechner."
  ],
  "Adj hozzá vágási, törési vagy javítási tartalékot az anyag típusától függően.": [
    "Add cutting, breakage or repair reserves according to the material.",
    "Ergänze je nach Material Reserven für Zuschnitt, Bruch oder Reparaturen."
  ],
  "Becsüld meg a szükséges festékmennyiséget.": [
    "Estimate how much paint is needed.",
    "Schätze die benötigte Farbmenge."
  ],
  "Csempe": [
    "Tiles",
    "Fliesen"
  ],
  "Számold ki a burkolandó felülethez szükséges mennyiséget.": [
    "Calculate the quantity needed for the surface to be covered.",
    "Berechne die benötigte Menge für die zu belegende Fläche."
  ],
  "Becsüld meg a szükséges beton térfogatát.": [
    "Estimate the required concrete volume.",
    "Schätze das benötigte Betonvolumen."
  ],
  "Tervezd meg a lap- és anyagszükségletet.": [
    "Plan board and material quantities.",
    "Plane Platten- und Materialmengen."
  ],
  "Számolj burkolattal és ráhagyással.": [
    "Include flooring and an allowance.",
    "Plane Belag und Zuschlag ein."
  ],
  "Tapéta": [
    "Wallpaper",
    "Tapete"
  ],
  "Becsüld meg a szükséges tekercsek számát.": [
    "Estimate the number of rolls needed.",
    "Schätze die benötigte Rollenanzahl."
  ],
  "A ráhagyás anyagonként eltér": [
    "Allowances vary by material",
    "Zuschläge unterscheiden sich je nach Material"
  ],
  "Csempénél és padlónál a kiosztás és vágás, tapétánál a mintaillesztés, festéknél pedig a felület szívóképessége is módosíthatja a tényleges igényt.": [
    "Tile and flooring layout and cuts, wallpaper pattern matching and paint absorbency can all change actual requirements.",
    "Verlegung und Zuschnitt bei Fliesen und Böden, Musteranschluss bei Tapeten und Saugfähigkeit beim Anstrich können den tatsächlichen Bedarf verändern."
  ],
  "A kalkulátor jó beszerzési kiindulópont": [
    "The calculator is a useful purchasing starting point",
    "Der Rechner ist eine gute Grundlage für den Einkauf"
  ],
  "Nagyobb projektnél a gyártói adatlapot, kivitelezői javaslatot és csomagolási egységeket is ellenőrizd rendelés előtt.": [
    "For larger projects, check product data sheets, contractor recommendations and pack sizes before ordering.",
    "Prüfe bei größeren Projekten vor der Bestellung Datenblätter, Empfehlungen der Ausführenden und Verpackungseinheiten."
  ],
  "Mert vágás, törés, hibás darab vagy későbbi javítás miatt az elméleti minimum ritkán elég pontosan.": [
    "Cuts, breakages, defective pieces and later repairs mean the theoretical minimum is rarely sufficient.",
    "Wegen Zuschnitt, Bruch, fehlerhafter Teile oder späterer Reparaturen reicht das theoretische Minimum selten aus."
  ],
  "Levonjam az ajtókat és ablakokat?": [
    "Should I subtract doors and windows?",
    "Soll ich Türen und Fenster abziehen?"
  ],
  "Nagyobb nyílásoknál igen, de kisebb felületeknél a ráhagyás és a kivitelezési veszteség ezt részben ellensúlyozhatja.": [
    "For larger openings, yes, but for smaller areas allowances and application losses can partly offset this.",
    "Bei größeren Öffnungen ja. Bei kleinen Flächen können Zuschlag und Verarbeitungsverluste dies teilweise ausgleichen."
  ],
  "A kalkulátor kiváltja a kivitelezői felmérést?": [
    "Does the calculator replace a contractor’s survey?",
    "Ersetzt der Rechner das Aufmaß eines Handwerkers?"
  ],
  "Nem. Költség- és anyagtervezési kiindulópont.": [
    "No. It is a starting point for cost and material planning.",
    "Nein. Er ist ein Ausgangspunkt für Kosten- und Materialplanung."
  ],
  "Gyakorlati példa: mérésből rendelési mennyiség": [
    "Practical example: from measurements to order quantities",
    "Praxisbeispiel: Von der Messung zur Bestellmenge"
  ],
  "Egy 5 × 4 méteres, 2,7 méter magas szoba négy falának bruttó felülete 48,6 m². Ha az ajtók és ablakok együtt 4,5 m²-t tesznek ki, a nettó falfelület 44,1 m². Két réteg festés és 10 m²/liter gyártói kiadósság mellett az elméleti igény 8,82 liter. Tíz százalék tartalékkal körülbelül 9,7 liter adódik, ezért a tényleges rendelést a kapható vödörmérethez kell felfelé igazítani.": [
    "A 5 × 4 m room with a height of 2.7 m has 48.6 m² of gross wall area. Subtracting 4.5 m² of doors and windows leaves 44.1 m². Two coats at a manufacturer coverage of 10 m²/litre require 8.82 litres in theory. A 10% reserve gives about 9.7 litres, so round the order up to available bucket sizes.",
    "Ein 5 × 4 m großer, 2,7 m hoher Raum hat 48,6 m² Bruttowandfläche. Nach Abzug von 4,5 m² Türen und Fenstern bleiben 44,1 m². Zwei Anstriche bei 10 m²/Liter Herstellerreichweite benötigen theoretisch 8,82 Liter. Mit 10 % Reserve ergeben sich rund 9,7 Liter; die Bestellung muss auf verfügbare Eimergrößen aufgerundet werden."
  ],
  "Ugyanezt a logikát alkalmazd más anyagnál is: előbb nettó geometriai mennyiség, utána rétegszám vagy fajlagos fogyás, végül ráhagyás és csomagolási egység. A ráhagyást ne automatikusan másold át egyik munkafázisból a másikba. Egyenes kiosztású burkolatnál és sok vágást igénylő mintánál eltérő tartalék lehet indokolt; tapétánál a mintaillesztés, vakolatnál a tényleges rétegvastagság módosíthatja az igényt.": [
    "Use the same sequence for other materials: net geometry, then coats or specific consumption, then allowance and pack size. Do not copy allowances blindly between tasks. Straight layouts and patterns with many cuts need different reserves; wallpaper repeats and actual plaster thickness can also change quantities.",
    "Verwende bei anderen Materialien dieselbe Reihenfolge: Nettogeometrie, dann Schichten oder spezifischer Verbrauch, zuletzt Zuschlag und Verpackung. Übertrage Zuschläge nicht automatisch zwischen Arbeitsschritten. Gerade Verlegung und Muster mit vielen Zuschnitten brauchen unterschiedliche Reserven; auch Tapetenrapport und tatsächliche Putzdicke verändern den Bedarf."
  ],
  "Készíts mérési jegyzéket": [
    "Create a measurement record",
    "Erstelle ein Aufmaßprotokoll"
  ],
  "Helyiségenként rögzítsd a hosszakat, magasságokat, nyílásokat és azt is, hogy melyik felület milyen anyagot kap. A mértékegységet minden adat mellett tüntesd fel. A centiméterben megadott vastagság és a méterben mért oldalhossz keverése nagyságrendi hibát okozhat.": [
    "Record lengths, heights, openings and the material for each surface by room. Label every value with its unit. Mixing thickness in centimetres with lengths in metres can cause errors of several orders of magnitude.",
    "Erfasse je Raum Längen, Höhen, Öffnungen und das Material jeder Fläche. Gib zu jedem Wert die Einheit an. Vermischte Dicken in Zentimetern und Seitenlängen in Metern können Größenordnungsfehler verursachen."
  ],
  "Rendelés előtt ellenőrizd a teljes rendszert": [
    "Check the whole system before ordering",
    "Prüfe vor der Bestellung das gesamte System"
  ],
  "Ne csak a fedőanyagot számold: ragasztó, alapozó, fuga, profil, rögzítő és veszteség is tartozhat a munkához. Ellenőrizd a termék kompatibilitását, tárolhatóságát és az azonos gyártási tétel szükségességét. Nagyobb vagy szerkezeti munka esetén a kalkulátor nem helyettesíti a tervezői és kivitelezői felmérést.": [
    "Count more than the finish material: adhesive, primer, grout, profiles, fixings and losses may also be needed. Check compatibility, storage life and whether one production batch is required. For large or structural jobs, the calculator does not replace designers’ or contractors’ surveys.",
    "Berechne nicht nur das Oberflächenmaterial: Kleber, Grundierung, Fugenmasse, Profile, Befestigungen und Verluste können dazugehören. Prüfe Kompatibilität, Lagerfähigkeit und die Notwendigkeit derselben Charge. Bei größeren oder tragenden Arbeiten ersetzt der Rechner kein planerisches oder handwerkliches Aufmaß."
  ],
  "A fajlagos fogyást, rétegvastagságot, kötési időt és alkalmazási feltételeket mindig a kiválasztott termék aktuális gyártói adatlapjából vedd át. Engedélyhez, bejelentéshez vagy szabályozott munkához az": [
    "Always take specific consumption, layer thickness, curing time and application conditions from the selected product’s current data sheet. For work requiring permits, notification or regulatory compliance, the",
    "Übernimm spezifischen Verbrauch, Schichtdicke, Abbindezeit und Verarbeitungsbedingungen stets aus dem aktuellen Datenblatt des gewählten Produkts. Bei genehmigungs-, anzeige- oder regelungspflichtigen Arbeiten bieten das"
  ],
  "Építésügyi portál": [
    "Hungarian Construction Portal",
    "Ungarische Bauportal"
  ],
  "és az illetékes szakember adhat aktuális tájékoztatást. Az oldalon szereplő példa tervezési minta, nem anyaggyártói előírás.": [
    "and the appropriate professional provide current information. The example here is a planning illustration, not a manufacturer specification.",
    "und die zuständigen Fachleute aktuelle Informationen. Das Beispiel ist eine Planungshilfe, keine Herstellervorgabe."
  ],
  "Felújítási mennyiséglánc": [
    "Renovation quantity chain",
    "Mengenkette für Renovierungen"
  ],
  "A geometriai mennyiség és a megvásárolandó mennyiség ritkán ugyanaz": [
    "Geometric quantities and purchase quantities are rarely identical",
    "Geometrische Menge und Einkaufsmenge sind selten gleich"
  ],
  "Felmérés": [
    "Survey",
    "Aufmaß"
  ],
  "Mérd meg a tényleges felületet és külön kezeld a nyílásokat, sarkokat, áttöréseket.": [
    "Measure actual surfaces and handle openings, corners and penetrations separately.",
    "Miss die tatsächliche Fläche und behandle Öffnungen, Ecken und Durchdringungen getrennt."
  ],
  "Nettó mennyiség": [
    "Net quantity",
    "Nettomenge"
  ],
  "Számold ki a tiszta felületet vagy térfogatot.": [
    "Calculate net surface area or volume.",
    "Berechne die reine Fläche oder das Volumen."
  ],
  "Vágás, törés, mintaismétlés vagy egyenetlen alap miatt tervezz indokolt ráhagyást.": [
    "Allow for cuts, breakage, pattern repeats and uneven substrates with a justified reserve.",
    "Plane für Zuschnitt, Bruch, Rapport oder unebenen Untergrund einen begründeten Zuschlag ein."
  ],
  "Csomagolás": [
    "Packaging",
    "Verpackung"
  ],
  "Lap, zsák, tekercs, doboz vagy raklap miatt a vásárlás felfelé kerekít.": [
    "Boards, bags, rolls, boxes and pallets can require rounding purchases up.",
    "Platten, Säcke, Rollen, Kartons oder Paletten erfordern ein Aufrunden der Einkaufsmenge."
  ],
  "A későbbi pótlás külön kérdés a kivitelezési veszteségtől.": [
    "Later replacements are separate from application losses.",
    "Späterer Ersatz ist eine andere Frage als Verarbeitungsverluste."
  ],
  "Szerkezeti, vízszigetelési, tűzvédelmi vagy statikai döntést ne csak mennyiségi kalkulátorból hozz.": [
    "Do not make structural, waterproofing, fire-safety or load-bearing decisions from quantity calculators alone.",
    "Triff konstruktive, Abdichtungs-, Brandschutz- oder statische Entscheidungen nicht allein anhand von Mengenrechnern."
  ],
  "Felújítás tervezése anyagkalkulátorokkal | Kalkulátor Bázis": [
    "Plan Renovations with Material Calculators · Kalkulátor Bázis",
    "Renovierungen mit Materialrechnern planen · Kalkulátor Bázis"
  ],
  "/ Fizetés és munkabér": [
    "/ Salary and wages",
    "/ Gehalt und Arbeitslohn"
  ],
  "Egy fizetési ajánlatot nem érdemes csak bruttó vagy nettó összegként nézni. Fontos, hogy mennyi az órád értéke, milyen munkaidőért kapod, és mit jelent a háztartásod havi mozgásterében.": [
    "A job offer is more than a gross or net monthly figure. Consider hourly value, working time and its effect on the household’s monthly flexibility.",
    "Ein Gehaltsangebot ist mehr als ein monatlicher Brutto- oder Nettobetrag. Wichtig sind Stundenwert, Arbeitszeit und die Auswirkungen auf den monatlichen Haushaltsspielraum."
  ],
  "Órabér": [
    "Hourly pay",
    "Stundenlohn"
  ],
  "Havi keret": [
    "Monthly budget",
    "Monatsrahmen"
  ],
  "Számold ki, mennyi pénz maradhat ténylegesen kézhez.": [
    "Estimate actual take-home pay.",
    "Schätze den tatsächlich ausgezahlten Betrag."
  ],
  "Nézd meg, hány óráért kapod a fizetést és mennyi az órabéred.": [
    "Check working hours and hourly pay.",
    "Prüfe Arbeitszeit und Stundenlohn."
  ],
  "Tedd bele a nettó összeget a havi költségvetésedbe.": [
    "Add net pay to your monthly budget.",
    "Trage das Nettogehalt in dein Monatsbudget ein."
  ],
  "Becsüld meg a bruttó és nettó bér kapcsolatát.": [
    "Estimate the relationship between gross and net salary.",
    "Schätze den Zusammenhang zwischen Brutto- und Nettogehalt."
  ],
  "Számold ki a munkád egy órára jutó értékét.": [
    "Calculate the value of an hour’s work.",
    "Berechne den Wert einer Arbeitsstunde."
  ],
  "Összesítsd a ledolgozott időt.": [
    "Total your working time.",
    "Summiere die geleistete Arbeitszeit."
  ],
  "Nézd meg, mit jelent a fizetés a havi pénzügyekben.": [
    "See what the salary means for monthly finances.",
    "Prüfe, was das Gehalt für die Monatsfinanzen bedeutet."
  ],
  "Becsüld meg, mekkora törlesztés férhet bele.": [
    "Estimate affordable monthly repayments.",
    "Schätze die tragbare monatliche Kreditrate."
  ],
  "Ajánlatokat azonos alapon hasonlíts össze": [
    "Compare offers on the same basis",
    "Vergleiche Angebote auf derselben Grundlage"
  ],
  "A magasabb nettó nem feltétlenül jobb, ha jóval több órát, ingázást vagy kiszámíthatatlanabb beosztást jelent.": [
    "Higher take-home pay is not necessarily better if it requires many more hours, commuting or less predictable shifts.",
    "Mehr Nettogehalt ist nicht unbedingt besser, wenn dafür erheblich mehr Arbeitszeit, Pendeln oder unplanbarere Dienste nötig sind."
  ],
  "A fizetésemelés hatását a költségvetésben nézd": [
    "Assess a pay rise through your budget",
    "Bewerte eine Gehaltserhöhung im Budget"
  ],
  "A plusz jövedelem valódi értéke attól függ, mennyit tudsz belőle megtakarítani vagy célokra fordítani.": [
    "The real value of extra income depends on how much can be saved or used for goals.",
    "Der tatsächliche Wert zusätzlichen Einkommens hängt davon ab, wie viel du sparen oder für Ziele verwenden kannst."
  ],
  "Bruttó vagy nettó bért érdemes összehasonlítani?": [
    "Should I compare gross or net pay?",
    "Soll ich Brutto- oder Nettogehälter vergleichen?"
  ],
  "Mindkettőt. A bruttó a munkáltatói ajánlatoknál hasznos, a nettó a saját havi tervezésednél.": [
    "Both. Gross is useful for employer offers; net matters for your monthly planning.",
    "Beides. Brutto hilft beim Vergleich von Arbeitgeberangeboten, netto bei deiner Monatsplanung."
  ],
  "Miért számoljak órabért is?": [
    "Why calculate hourly pay too?",
    "Warum auch den Stundenlohn berechnen?"
  ],
  "Mert két hasonló havi fizetés mögött nagyon eltérő munkaidő állhat.": [
    "Two similar monthly salaries can involve very different working hours.",
    "Hinter ähnlichen Monatsgehältern können sehr unterschiedliche Arbeitszeiten stehen."
  ],
  "A kalkulátor helyettesíti a bérszámfejtést?": [
    "Does the calculator replace payroll processing?",
    "Ersetzt der Rechner die Lohnabrechnung?"
  ],
  "Nem, tervezési becslésre szolgál.": [
    "No. It provides a planning estimate.",
    "Nein. Er liefert eine Planungsschätzung."
  ],
  "Gyakorlati példa: két ajánlatot azonos alapon hasonlíts össze": [
    "Practical example: compare two offers on the same basis",
    "Praxisbeispiel: Zwei Angebote auf derselben Grundlage vergleichen"
  ],
  "Az A ajánlat havi bruttó 600 000 Ft-ot ad 160 munkaóráért, a B ajánlat 650 000 Ft-ot 184 óráért. A bruttó órabér az elsőnél 3 750 Ft, a másodiknál körülbelül 3 533 Ft. Ez önmagában nem dönti el, melyik ajánlat jobb, de láthatóvá teszi, hogy a magasabb havi összeghez több munkaidő társul.": [
    "Offer A pays HUF 600,000 gross for 160 hours per month; offer B pays HUF 650,000 for 184 hours. Gross hourly pay is HUF 3,750 for A and about HUF 3,533 for B. This alone does not decide which is better, but shows the extra time behind the higher monthly figure.",
    "Angebot A zahlt monatlich 600.000 HUF brutto für 160 Stunden, Angebot B 650.000 HUF für 184 Stunden. Der Bruttostundenlohn beträgt bei A 3.750 HUF und bei B rund 3.533 HUF. Das entscheidet nicht allein, welches Angebot besser ist, zeigt aber die zusätzliche Arbeitszeit hinter dem höheren Monatsbetrag."
  ],
  "Ezután számold ki mindkét ajánlat becsült nettóját ugyanazzal a kedvezmény- és jogosultsági beállítással. Vond le az ingázás, étkezés, gyermekfelügyelet vagy más munkához kötődő rendszeres kiadás különbségét, és írd mellé a szabadságot, a túlóra rendezését, a bónusz feltételeit és a juttatások értékét. A változó bónuszt külön sorban kezeld, ne biztos havi bevételként.": [
    "Estimate net pay for both offers with identical allowance and eligibility settings. Subtract differences in commuting, meals, childcare and other regular work costs. Note leave, overtime arrangements, bonus conditions and benefits. Keep variable bonuses separate from reliable monthly income.",
    "Schätze beide Nettogehälter mit denselben Vergünstigungs- und Anspruchseinstellungen. Ziehe Unterschiede bei Pendeln, Essen, Kinderbetreuung und anderen regelmäßigen Arbeitskosten ab. Notiere Urlaub, Überstundenregelung, Bonusbedingungen und Zusatzleistungen. Variable Boni gehören in eine eigene Zeile statt zum sicheren Monatseinkommen."
  ],
  "Nézd meg a nettó órára jutó értéket is": [
    "Compare net hourly value too",
    "Vergleiche auch den Nettostundenwert"
  ],
  "A havi nettót oszd el a ténylegesen munkával és kötelező jelenléttel töltött órákkal. Ha az ingázás jelentősen eltér, készíthetsz egy második összevetést is, amely a rendszeres utazási időt és költséget is figyelembe veszi. Ez nem jogi bérszámítás, hanem személyes döntési segédlet.": [
    "Divide monthly take-home pay by hours actually spent working and in required attendance. If commuting differs substantially, make a second comparison including regular travel time and costs. This supports personal decisions, not legal payroll calculation.",
    "Teile das Monatsnetto durch die tatsächlich mit Arbeit und Pflichtanwesenheit verbrachten Stunden. Bei stark unterschiedlichem Pendeln kannst du zusätzlich regelmäßige Fahrzeit und Kosten einbeziehen. Das ist eine persönliche Entscheidungshilfe, keine rechtliche Lohnabrechnung."
  ],
  "Teszteld a háztartási hatást": [
    "Test the household impact",
    "Prüfe die Auswirkungen auf den Haushalt"
  ],
  "A két nettó összeget külön-külön vezesd be a havi költségvetésbe. Nézd meg, mennyi marad fix kiadások, hitel és tervezett megtakarítás után. Próbaidő, műszakpótlék vagy változó óraszám esetén készíts gyengébb hónapot is, és csak olyan kötelezettséget vállalj, amely mellett marad tartalék.": [
    "Enter each net figure separately in your monthly budget. Check what remains after fixed expenses, debt payments and planned savings. For probation, shift allowances or variable hours, also model a weaker month and take on commitments only while retaining a reserve.",
    "Trage beide Nettobeträge getrennt in das Monatsbudget ein. Prüfe, was nach Fixkosten, Kredit und geplantem Sparen bleibt. Modelliere bei Probezeit, Schichtzuschlägen oder variablen Stunden auch einen schwächeren Monat und gehe nur Verpflichtungen ein, bei denen eine Reserve bleibt."
  ],
  "Az adó- és kedvezményszabályok változhatnak, ezért a jogosultságot és az aktuális feltételeket a": [
    "Tax and allowance rules can change. Check eligibility and current terms on the",
    "Steuer- und Vergünstigungsregeln können sich ändern. Prüfe Ansprüche und aktuelle Voraussetzungen auf der"
  ],
  "NAV szja-kedvezmények oldalán": [
    "NAV income-tax allowances page",
    "NAV-Seite zu Einkommensteuervergünstigungen"
  ],
  ", a munkaszerződés részleteit pedig a munkáltatói dokumentumokban ellenőrizd. A nettó–bruttó eszköz tájékoztató becslés; a tényleges bérlapot a bérszámfejtés adja.": [
    ", and employment-contract details in employer documents. The net–gross tool provides an estimate; payroll supplies the actual payslip.",
    "und Vertragsdetails in den Arbeitgeberunterlagen. Der Netto-Brutto-Rechner schätzt; die tatsächliche Gehaltsabrechnung erstellt die Lohnbuchhaltung."
  ],
  "Munkabér értelmezési lánc": [
    "Understanding salary",
    "Arbeitslohn einordnen"
  ],
  "A havi nettó és a munka valódi időértéke két külön kérdés": [
    "Monthly take-home pay and the real value of your time are different questions",
    "Monatsnetto und tatsächlicher Zeitwert der Arbeit sind unterschiedliche Fragen"
  ],
  "A szerződéses bér és a bérösszetevők kiindulópontja.": [
    "The starting point for contractual salary and pay components.",
    "Ausgangspunkt für Vertragsgehalt und Lohnbestandteile."
  ],
  "A levonások és kedvezmények után ténylegesen kifizetett összeg becslése.": [
    "An estimate of pay received after deductions and allowances.",
    "Schätzung der tatsächlichen Auszahlung nach Abzügen und Vergünstigungen."
  ],
  "Fizetett idő": [
    "Paid time",
    "Bezahlte Zeit"
  ],
  "A bérhez kapcsolódó elszámolt munkaórák.": [
    "Working hours accounted for in pay.",
    "Die dem Lohn zugeordneten abgerechneten Arbeitsstunden."
  ],
  "Teljes idő": [
    "Total time",
    "Gesamte Zeit"
  ],
  "Utazás, előkészület vagy nem fizetett idő hozzáadásával más effektív óradíj adódhat.": [
    "Adding travel, preparation or unpaid time can change effective hourly pay.",
    "Fahrten, Vorbereitung oder unbezahlte Zeit können den effektiven Stundenlohn verändern."
  ],
  "Háztartási érték": [
    "Household value",
    "Wert für den Haushalt"
  ],
  "Végül az számít, mennyi marad a fix és változó havi kiadások után.": [
    "What ultimately matters is the amount left after fixed and variable monthly spending.",
    "Letztlich zählt, was nach festen und variablen Monatsausgaben übrig bleibt."
  ],
  "Adó- és bérszámításnál az aktuális szabály és a tényleges bérjegyzék az irányadó; a kalkulátor ellenőrző és tervező eszköz.": [
    "Current rules and the actual payslip govern tax and salary calculations; the calculator is a checking and planning tool.",
    "Bei Steuer- und Lohnberechnungen sind aktuelle Regeln und die tatsächliche Abrechnung maßgeblich. Der Rechner dient Prüfung und Planung."
  ],
  "Fizetés és munkabér tervezése | Kalkulátor Bázis": [
    "Salary and Wage Planning · Kalkulátor Bázis",
    "Gehalt und Arbeitslohn planen · Kalkulátor Bázis"
  ],
  "/ Lakásvásárlás": [
    "/ Buying a home",
    "/ Wohnungskauf"
  ],
  "A lakás ára csak az első szám. A valódi döntéshez együtt kell látni az önerőt, a hitel várható terhét, a jövedelmi mozgásteredet és azt, hogy marad-e biztonsági tartalékod a vásárlás után.": [
    "The property price is only the first figure. Consider the deposit, expected loan burden, income flexibility and reserves remaining after purchase together.",
    "Der Kaufpreis ist nur die erste Zahl. Für eine echte Entscheidung gehören Eigenkapital, Kreditbelastung, Einkommensspielraum und verbleibende Rücklagen zusammen."
  ],
  "Önerő": [
    "Deposit",
    "Eigenkapital"
  ],
  "Havi mozgástér": [
    "Monthly flexibility",
    "Monatlicher Spielraum"
  ],
  "Keret": [
    "Budget",
    "Rahmen"
  ],
  "Határozd meg, mekkora havi kiadás fér bele úgy, hogy maradjon tartalékod is.": [
    "Set a monthly spending limit that still leaves reserves.",
    "Lege eine monatliche Belastungsgrenze fest, bei der Rücklagen bleiben."
  ],
  "Nézd meg az önerőt, a hitelképességet és a várható törlesztőrészletet.": [
    "Check the deposit, borrowing capacity and expected instalment.",
    "Prüfe Eigenkapital, Kreditwürdigkeit und erwartete Rate."
  ],
  "Biztonság": [
    "Safety",
    "Sicherheit"
  ],
  "Teszteld a költségvetést magasabb kiadással vagy gyengébb hónappal is.": [
    "Test your budget with higher expenses or a weaker month.",
    "Prüfe das Budget auch mit höheren Ausgaben oder einem schwächeren Monat."
  ],
  "Mekkora saját forrásra lehet szükséged?": [
    "How much of your own money might you need?",
    "Wie viel eigenes Geld könntest du benötigen?"
  ],
  "Becsüld meg a havi törlesztőrészletet.": [
    "Estimate monthly repayments.",
    "Schätze die monatliche Kreditrate."
  ],
  "Nézd meg, mekkora törlesztés férhet bele a jövedelmedbe.": [
    "Check what repayments your income might support.",
    "Prüfe, welche Rate dein Einkommen tragen könnte."
  ],
  "Vizsgáld meg a vásárlás utáni havi mozgásteredet.": [
    "Examine monthly flexibility after the purchase.",
    "Untersuche den monatlichen Spielraum nach dem Kauf."
  ],
  "Lásd, hogyan változik a pénz vásárlóereje hosszabb távon.": [
    "See how purchasing power changes over time.",
    "Betrachte langfristige Kaufkraftveränderungen."
  ],
  "Ne csak a vételárat nézd": [
    "Look beyond the purchase price",
    "Betrachte mehr als den Kaufpreis"
  ],
  "Számolj ügyvédi, költözési, felújítási és berendezési kiadásokkal is. Egy papíron vállalható hitel attól még lehet túl feszes a hétköznapokban.": [
    "Include legal fees, moving, renovation and furnishings. A loan that fits on paper can still stretch everyday finances too far.",
    "Plane Anwaltskosten, Umzug, Renovierung und Einrichtung ein. Ein auf dem Papier tragbarer Kredit kann im Alltag trotzdem zu knapp sein."
  ],
  "Próbálj ki rosszabb forgatókönyvet is": [
    "Try a worse scenario too",
    "Prüfe auch ein schlechteres Szenario"
  ],
  "Érdemes megnézni, mi történik akkor, ha pár hónapig kevesebb a bevétel vagy magasabbak a rendszeres kiadások.": [
    "Explore what happens with a few months of lower income or higher regular expenses.",
    "Prüfe, was bei einigen Monaten mit niedrigeren Einnahmen oder höheren laufenden Ausgaben passiert."
  ],
  "Melyik kalkulátorral kezdjek?": [
    "Which calculator should I start with?",
    "Mit welchem Rechner sollte ich beginnen?"
  ],
  "A havi költségvetéssel és a hitelképességgel. Ezek mutatják meg először, milyen keret lehet reális.": [
    "Start with monthly budgeting and borrowing capacity; these show a realistic budget first.",
    "Beginne mit Monatsbudget und Kreditwürdigkeit. Sie zeigen zuerst, welcher Rahmen realistisch sein könnte."
  ],
  "Az önerő kalkulátor hivatalos banki ajánlatot ad?": [
    "Does the deposit calculator give an official bank offer?",
    "Gibt der Eigenkapitalrechner ein verbindliches Bankangebot?"
  ],
  "Nem. Tervezési becslést ad; a banki feltételek és az ingatlan értékelése eltérhetnek.": [
    "No. It estimates for planning; bank terms and the property valuation can differ.",
    "Nein. Er liefert eine Planungsschätzung. Bankbedingungen und Immobilienbewertung können abweichen."
  ],
  "Miért fontos a tartalék lakásvásárlás után is?": [
    "Why keep reserves after buying a home?",
    "Warum auch nach dem Wohnungskauf Rücklagen behalten?"
  ],
  "Mert a költözés és az első hónapok gyakran váratlan kiadásokat hoznak, miközben a hitel már fut.": [
    "Moving and the first months often bring unexpected costs while loan repayments have already started.",
    "Umzug und erste Monate bringen oft unerwartete Ausgaben, während der Kredit bereits läuft."
  ],
  "Felújítás tervezése": [
    "Renovation planning",
    "Renovierungsplanung"
  ],
  "Gyakorlati példa: a vételárból készíts teljes finanszírozási képet": [
    "Practical example: turn a purchase price into a full financing picture",
    "Praxisbeispiel: Vom Kaufpreis zum vollständigen Finanzierungsbild"
  ],
  "Egy 50 millió forintos ingatlannál a 20%-os tervezési önerő 10 millió Ft, a fennmaradó finanszírozandó összeg 40 millió Ft. Ez még nem jelenti azt, hogy a bank ugyanekkora hitelt ajánl, és azt sem, hogy a vásárláshoz elég pontosan 10 millió Ft készpénz. A banki értékbecslés, a jövedelemvizsgálat és a termék feltételei módosíthatják a lehetőségeket.": [
    "For a HUF 50 million property, an assumed 20% deposit is HUF 10 million, leaving HUF 40 million to finance. This does not mean the bank will lend that amount or that exactly HUF 10 million cash is enough. Valuation, income assessment and product terms can change the options.",
    "Bei einer Immobilie für 50 Mio. HUF ergeben angenommene 20 % Eigenkapital 10 Mio. HUF; 40 Mio. HUF bleiben zu finanzieren. Das bedeutet weder, dass die Bank diese Summe finanziert, noch dass genau 10 Mio. HUF Bargeld reichen. Bewertung, Einkommensprüfung und Produktbedingungen können die Möglichkeiten verändern."
  ],
  "Készíts külön sort az ügyvédi, értékbecslési, költözési, berendezési és azonnali javítási kiadásoknak, valamint az esetleges illetéknek. Ezekre ne automatikusan a teljes megtakarítás utolsó forintját használd fel. A vétel után is maradjon olyan likvid tartalék, amelyből a háztartás több hónapnyi alapkiadása és egy váratlan ingatlanhiba kezelhető.": [
    "List legal, valuation, moving, furnishing, immediate repair costs and any transfer duty separately. Do not automatically spend the last forint of savings on them. Keep liquid reserves after purchase for several months of basic household spending and an unexpected property defect.",
    "Führe Anwalts-, Bewertungs-, Umzugs-, Einrichtungs- und Sofortreparaturkosten sowie mögliche Erwerbsabgaben getrennt auf. Verwende dafür nicht automatisch den letzten Forint deiner Ersparnisse. Behalte nach dem Kauf liquide Rücklagen für mehrere Monate Haushaltsgrundkosten und einen unerwarteten Immobilienschaden."
  ],
  "Előbb havi plafon, utána maximális hitel": [
    "Set a monthly ceiling before a maximum loan",
    "Erst Monatsobergrenze, dann Maximalkredit"
  ],
  "A költségvetésből indulj ki: mennyi törlesztő fér bele lakhatási költséggel, biztosítással és fenntartással együtt? A hitelképességi becslés jogszabályi vagy banki maximuma nem azonos a számodra kényelmes havi összeggel. Számolj gyengébb bevételi hónappal és magasabb rendszeres kiadással is.": [
    "Start from your budget: what repayment fits alongside housing costs, insurance and maintenance? Legal or bank borrowing limits are not the same as a comfortable monthly amount. Include weaker-income months and higher regular expenses.",
    "Gehe vom Budget aus: Welche Rate passt neben Wohnkosten, Versicherung und Unterhalt? Rechtliche oder bankseitige Höchstgrenzen entsprechen nicht deinem angenehmen Monatsbetrag. Rechne auch mit schwächeren Einnahmemonaten und höheren regelmäßigen Ausgaben."
  ],
  "Hasonlíts össze azonos feltételeket": [
    "Compare like-for-like terms",
    "Vergleiche gleiche Bedingungen"
  ],
  "Két hitelforgatókönyvnél ugyanazt a hitelösszeget, futamidőt és kamatértelmezést használd. Ne csak a havi részletet nézd: írd mellé a teljes visszafizetést, a kamatkockázatot, az előtörlesztés feltételeit és a járulékos díjakat. A kalkulált THM-alapú részlet csak közelítés lehet, ha a díjak időzítése nem ismert.": [
    "Use the same loan amount, term and interest interpretation for both scenarios. Consider total repayment, interest risk, early-repayment terms and fees as well as monthly instalments. An APR-based instalment may be approximate if fee timing is unknown.",
    "Verwende bei beiden Kreditszenarien dieselbe Summe, Laufzeit und Zinsinterpretation. Beachte neben der Monatsrate Gesamtrückzahlung, Zinsrisiko, Sondertilgungsbedingungen und Gebühren. Eine anhand des effektiven Jahreszinses berechnete Rate ist möglicherweise nur eine Näherung, wenn Gebührenzeitpunkte unbekannt sind."
  ],
  "A lakáshitelek típusairól, kockázatairól és fogyasztóvédelmi szempontjairól az": [
    "For current guidance on mortgage types, risks and consumer protection, use the",
    "Aktuelle Orientierung zu Immobilienkreditarten, Risiken und Verbraucherschutz bietet die"
  ],
  "MNB hitel- és lízingtájékoztatója": [
    "MNB loan and leasing guide",
    "MNB-Information zu Krediten und Leasing"
  ],
  "ad aktuális kiindulópontot. Konkrét döntéshez kérj több, azonos adatokra készült banki ajánlatot, és ellenőrizd a szerződés, az értékbecslés és az ingatlan jogi dokumentumait is.": [
    ". Before deciding, request several bank offers based on the same data and check the contract, valuation and property legal documents.",
    ". Hole für eine konkrete Entscheidung mehrere Bankangebote mit denselben Angaben ein und prüfe Vertrag, Bewertung und rechtliche Immobilienunterlagen."
  ],
  "Lakásvásárlási döntési kapu": [
    "Home-buying decision checkpoint",
    "Entscheidungspunkt beim Wohnungskauf"
  ],
  "Az önerő nem azonos a teljes induló készpénzigénnyel": [
    "The deposit is not the total upfront cash requirement",
    "Eigenkapital ist nicht der gesamte anfängliche Geldbedarf"
  ],
  "A vásárlás előtt külön soron kezeld a saját forrást, a tranzakcióhoz kapcsolódó kiadásokat, az azonnali felújítást vagy költözést és azt a tartalékot, amelynek a vásárlás után is meg kell maradnia.": [
    "Before buying, separate your deposit, transaction costs, immediate renovation or moving, and the reserve that must remain afterwards.",
    "Trenne vor dem Kauf Eigenkapital, Transaktionskosten, sofortige Renovierung oder Umzug und die danach erforderliche Reserve."
  ],
  "A vételárhoz képest nézd meg a saját forrás és a finanszírozás arányát.": [
    "Compare your own funds and financing with the purchase price.",
    "Betrachte das Verhältnis von eigenen Mitteln und Finanzierung zum Kaufpreis."
  ],
  "Különítsd el a hitelhez, szerződéshez, költözéshez és induló javításokhoz kötődő költségeket.": [
    "Separate costs for the loan, contract, moving and initial repairs.",
    "Trenne Kosten für Kredit, Vertrag, Umzug und erste Reparaturen."
  ],
  "A havi törlesztőt ne csak a mai kiadások mellett, hanem rosszabb hónappal is teszteld.": [
    "Test repayments against a worse month, not just today’s expenses.",
    "Prüfe die Rate auch mit einem schlechteren Monat statt nur mit heutigen Ausgaben."
  ],
  "A banki maximumot ne kezeld automatikusan kényelmes háztartási maximumnak.": [
    "Do not automatically treat the bank’s maximum as a comfortable household maximum.",
    "Behandle das Bankmaximum nicht automatisch als angenehme Haushaltsgrenze."
  ],
  "Kapcsolódó módszertan:": [
    "Related methodology:",
    "Verwandte Methodik:"
  ],
  "önerő": [
    "deposit",
    "Eigenkapital"
  ],
  "törlesztő": [
    "repayment",
    "Kreditrate"
  ],
  "havi mozgástér": [
    "monthly flexibility",
    "Monatlicher Spielraum"
  ],
  "Lakásvásárlás tervezése kalkulátorokkal | Kalkulátor Bázis": [
    "Plan Buying a Home with Calculators · Kalkulátor Bázis",
    "Wohnungskauf mit Rechnern planen · Kalkulátor Bázis"
  ],
  "Pénzügyi alapozó kezdőknek": [
    "Financial foundations for beginners",
    "Finanzielle Grundlagen für Einsteiger"
  ],
  "Ne befektetéssel kezdj. Előbb építs pénzügyi talajt magad alá.": [
    "Build your financial foundations before investing.",
    "Schaffe finanzielle Grundlagen, bevor du anlegst."
  ],
  "A befektetés nem az első lépés, hanem következmény. Akkor kezd igazán értelmet nyerni, amikor már látod, mennyi pénzed jön be, hová folyik el, mennyi tartalékod van, milyen adósságot cipelsz, és milyen cél miatt szeretnél kockázatot vállalni.": [
    "Investing is not the first step. It becomes meaningful once you understand income, spending, reserves, debts and the goal for which you are willing to take risk.",
    "Anlegen ist nicht der erste Schritt. Es wird sinnvoll, wenn du Einnahmen, Ausgaben, Rücklagen, Schulden und das Ziel kennst, für das du Risiko eingehen möchtest."
  ],
  "Ez az oldal az alapoktól indul. Nem konkrét terméket ajánl, hanem azt mutatja meg, milyen pénzügyi rendet érdemes kialakítani ahhoz, hogy később ne félelemből, kapkodásból vagy divatból dönts.": [
    "This page starts with the basics. It recommends no specific product, but explains how to organise finances so later decisions are not driven by fear, haste or fashion.",
    "Diese Seite beginnt bei den Grundlagen. Sie empfiehlt kein konkretes Produkt, sondern zeigt eine finanzielle Ordnung, damit spätere Entscheidungen nicht aus Angst, Eile oder Mode entstehen."
  ],
  "ez oktatási célú tartalom, nem személyre szabott pénzügyi tanácsadás. Befektetési döntés előtt mindig vizsgáld meg a saját helyzetedet, és szükség esetén kérj független szakmai segítséget.": [
    "this is educational content, not personalised financial advice. Review your own circumstances before investing and seek independent professional help where needed.",
    "Dies sind Bildungsinhalte, keine individuelle Finanzberatung. Prüfe vor Anlageentscheidungen deine Situation und hole bei Bedarf unabhängige fachliche Hilfe ein."
  ],
  "Megnézem, hol tartok": [
    "Check where I stand",
    "Meinen Stand prüfen"
  ],
  "Alapok áttekintése": [
    "Review the basics",
    "Grundlagen ansehen"
  ],
  "0-tól befektetésig": [
    "From the beginning to investing",
    "Vom Anfang bis zur Geldanlage"
  ],
  "Bevételek és kiadások": [
    "Income and spending",
    "Einnahmen und Ausgaben"
  ],
  "Tudd, pontosan miből gazdálkodsz.": [
    "Know exactly what money you can work with.",
    "Wisse genau, mit welchem Geld du wirtschaftest."
  ],
  "Legyen pénzed váratlan helyzetekre.": [
    "Keep money available for unexpected events.",
    "Halte Geld für unerwartete Situationen bereit."
  ],
  "Adósságok kezelése": [
    "Managing debt",
    "Schulden bewältigen"
  ],
  "A drága hitelek gyakran előrébb valók.": [
    "Expensive loans often take priority.",
    "Teure Kredite haben häufig Vorrang."
  ],
  "Cél, időtáv, kockázat": [
    "Goals, time and risk",
    "Ziel, Zeit und Risiko"
  ],
  "Ne terméket válassz először, hanem célt.": [
    "Choose a goal before a product.",
    "Wähle zuerst ein Ziel, dann ein Produkt."
  ],
  "Befektetési terv": [
    "Investment plan",
    "Anlageplan"
  ],
  "Csak azt a pénzt kockáztasd, amit erre szántál.": [
    "Risk only money allocated for that purpose.",
    "Riskiere nur das dafür vorgesehene Geld."
  ],
  "Van pénzügyi mozgástered?": [
    "Do you have financial room to manoeuvre?",
    "Hast du finanziellen Spielraum?"
  ],
  "Nem csak az számít, mennyit keresel, hanem mennyi marad.": [
    "What remains matters as well as what you earn.",
    "Nicht nur dein Einkommen zählt, sondern auch, was übrig bleibt."
  ],
  "Van tartalékod?": [
    "Do you have reserves?",
    "Hast du Rücklagen?"
  ],
  "A befektetést ne vészhelyzeti pénzből kezdd.": [
    "Do not start investing with emergency funds.",
    "Beginne das Anlegen nicht mit deiner Notfallreserve."
  ],
  "Érted a kockázatot?": [
    "Do you understand the risk?",
    "Verstehst du das Risiko?"
  ],
  "A magasabb hozam reménye általában nagyobb kockázattal jár.": [
    "The prospect of higher returns generally involves more risk.",
    "Die Aussicht auf höhere Rendite ist meist mit mehr Risiko verbunden."
  ],
  "Miért ez a sorrend?": [
    "Why this order?",
    "Warum diese Reihenfolge?"
  ],
  "A pénzügyi tudatosság nem a tőzsdén kezdődik.": [
    "Financial awareness does not start on the stock exchange.",
    "Finanzbewusstsein beginnt nicht an der Börse."
  ],
  "Sok ember ott rontja el, hogy befektetést keres, miközben a saját pénzügyi rendszerét még nem látja át. Ilyenkor egy átmeneti árfolyam esés, egy váratlan számla vagy egy rossz hónap máris pánikdöntéshez vezethet.": [
    "Many people seek investments before understanding their own finances. A temporary market fall, unexpected bill or difficult month can then trigger panic decisions.",
    "Viele suchen Anlagen, bevor sie ihre eigenen Finanzen verstehen. Ein vorübergehender Kursrückgang, eine unerwartete Rechnung oder ein schlechter Monat kann dann zu Panikentscheidungen führen."
  ],
  "Rend": [
    "Organisation",
    "Ordnung"
  ],
  "Előbb legyen átlátható a pénzed mozgása": [
    "Understand your cash flow first",
    "Verstehe zuerst deinen Geldfluss"
  ],
  "Írd össze a rendszeres bevételeket, fix kiadásokat, változó költéseket és évente visszatérő nagyobb tételeket. Ha nem tudod, mennyi marad havonta, azt sem tudod, mennyit tudsz biztonsággal félretenni.": [
    "List regular income, fixed expenses, variable spending and major annual items. Without knowing your monthly surplus, you cannot know how much you can safely set aside.",
    "Erfasse regelmäßige Einnahmen, Fixkosten, variable Ausgaben und große Jahresposten. Ohne Kenntnis des Monatsüberschusses weißt du nicht, wie viel du sicher zurücklegen kannst."
  ],
  "Tartalék": [
    "Reserves",
    "Rücklagen"
  ],
  "Válaszd szét a biztonsági pénzt a befektetési pénztől": [
    "Separate emergency money from investment money",
    "Trenne Sicherheitsgeld von Anlagegeld"
  ],
  "A vésztartalék nem a hozamvadászatról szól. Az a szerepe, hogy ne kényszerből kelljen eladnod valamit, ha elromlik az autó, kiesik egy bevétel vagy jön egy váratlan családi kiadás.": [
    "Emergency reserves are not about chasing returns. They help avoid forced sales when the car breaks down, income stops or a family expense arises.",
    "Eine Notfallreserve dient nicht der Renditejagd. Sie soll verhindern, dass du bei Autodefekt, Einkommensausfall oder unerwarteten Familienausgaben etwas zwangsweise verkaufen musst."
  ],
  "Terv": [
    "Plan",
    "Plan"
  ],
  "A cél és az időtáv dönti el, mekkora kockázat fér bele": [
    "Goals and time horizons determine tolerable risk",
    "Ziel und Zeithorizont bestimmen das tragbare Risiko"
  ],
  "Más pénzügyi eszköz való rövid távú lakáscélra, gyermekjövőre, nyugdíjcélra vagy egyszerű értékmegőrzésre. Ha a cél homályos, a termékválasztás is könnyen véletlenszerű lesz.": [
    "Short-term housing goals, a child’s future, retirement and preserving value require different tools. An unclear goal can make product choices arbitrary.",
    "Kurzfristige Wohnziele, die Zukunft eines Kindes, Altersvorsorge und Werterhalt benötigen unterschiedliche Werkzeuge. Ist das Ziel unklar, wird die Produktwahl leicht beliebig."
  ],
  "A hét alap": [
    "Seven foundations",
    "Sieben Grundlagen"
  ],
  "Amit érdemes rendbe tenni, mielőtt befektetési termékeket nézel.": [
    "What to organise before looking at investment products.",
    "Was du ordnen solltest, bevor du Anlageprodukte ansiehst."
  ],
  "Ez nem merev szabályrendszer, inkább gondolkodási keret. A sorrend azért fontos, mert a befektetés akkor működik jól, ha nem az utolsó mentőöv, hanem egy tudatos pénzügyi terv része.": [
    "This is a framework rather than rigid rules. The order matters because investing works best as part of a conscious financial plan, not a last lifeline.",
    "Dies ist ein Denkrahmen statt starrer Regeln. Die Reihenfolge zählt, weil Anlegen als Teil eines bewussten Finanzplans besser funktioniert als als letzter Rettungsanker."
  ],
  "Legalább 2-3 hónapig kövesd, mire megy el a pénzed. A fix kiadások mellett külön figyeld az apró, ismétlődő költéseket: ezek sokszor több pénzt visznek el, mint gondolnád.": [
    "Track spending for at least 2–3 months. Alongside fixed bills, watch small recurring purchases: they often cost more than expected.",
    "Verfolge Ausgaben mindestens 2–3 Monate. Beachte neben Fixkosten kleine wiederkehrende Käufe: Sie kosten häufig mehr als gedacht."
  ],
  "Pozitív havi pénzáram": [
    "Positive monthly cash flow",
    "Positiver monatlicher Geldfluss"
  ],
  "Befektetni abból lehet, ami tartósan megmarad. Ha hónapról hónapra nullára jössz ki, először a kiadási szerkezeten, bevételi oldalon vagy adósságokon érdemes dolgozni.": [
    "Invest from a sustainable surplus. If you break even every month, work on spending, income or debts first.",
    "Anlegen setzt einen dauerhaften Überschuss voraus. Wenn du jeden Monat bei null landest, arbeite zuerst an Ausgaben, Einnahmen oder Schulden."
  ],
  "Sok ember számára a 3-6 havi megélhetési költség jó kiindulási gondolkodási keret, de a pontos összeg élethelyzettől függ: más kell alkalmazottként, vállalkozóként vagy eltartott családdal.": [
    "For many people, 3–6 months of living costs is a useful starting framework, but the right amount depends on circumstances: employees, business owners and households with dependants have different needs.",
    "Für viele sind 3–6 Monatsausgaben ein sinnvoller Ausgangsrahmen. Die genaue Summe hängt aber von der Situation ab: Angestellte, Selbstständige und Haushalte mit Angehörigen benötigen unterschiedliche Rücklagen."
  ],
  "Drága adósságok rendezése": [
    "Deal with expensive debt",
    "Teure Schulden ordnen"
  ],
  "Ha magas kamatozású fogyasztási hiteled, hitelkártya-tartozásod vagy rendszeres folyószámlahitel-használatod van, ezek költsége sokszor erősebb ellenfél, mint bármilyen reális hozamvárakozás.": [
    "High-interest consumer loans, credit-card debt and regular overdrafts often cost more than realistic investment returns could offset.",
    "Hoch verzinste Konsumkredite, Kreditkartenschulden oder regelmäßige Überziehungen kosten oft mehr, als realistische Anlageerträge ausgleichen könnten."
  ],
  "Alapvető védelem": [
    "Basic protection",
    "Grundlegende Absicherung"
  ],
  "Gondold át, milyen esemény borítaná fel a pénzügyeidet: betegség, baleset, munkakiesés, lakáskár, családi felelősség. A védelem nem izgalmas, de sokszor ez óvja meg a hosszú távú tervet.": [
    "Consider what could disrupt your finances: illness, accidents, lost work, home damage or family responsibilities. Protection is not exciting, but often safeguards long-term plans.",
    "Überlege, was deine Finanzen erschüttern könnte: Krankheit, Unfall, Arbeitsausfall, Wohnschaden oder Familienverantwortung. Absicherung ist nicht spannend, schützt aber häufig den langfristigen Plan."
  ],
  "Célok és időtávok": [
    "Goals and time horizons",
    "Ziele und Zeithorizonte"
  ],
  "Ne egyetlen nagy kupac pénzben gondolkodj. Legyen külön rövid távú, középtávú és hosszú távú célod. Ami 1-2 éven belül kellhet, az más bánásmódot igényel, mint a nyugdíjcélú pénz.": [
    "Do not treat all money as one pool. Separate short-, medium- and long-term goals. Money needed within 1–2 years requires different treatment from retirement funds.",
    "Betrachte Geld nicht als einen einzigen Topf. Trenne kurz-, mittel- und langfristige Ziele. Geld, das in 1–2 Jahren benötigt wird, braucht eine andere Behandlung als Altersvorsorgegeld."
  ],
  "A terv mondja meg, mennyit fektetsz be, milyen rendszerességgel, milyen időtávra, milyen költségek mellett, és mit csinálsz akkor, ha a piac nem úgy viselkedik, ahogy szeretnéd.": [
    "A plan should state how much and how often you invest, for how long, at what costs and what you will do if markets behave differently from your wishes.",
    "Der Plan sollte festlegen, wie viel und wie regelmäßig du anlegst, für welchen Zeitraum, mit welchen Kosten und wie du handelst, wenn sich der Markt anders als gewünscht entwickelt."
  ],
  "Nem biztos, hogy befektetésre vagy kész. De ezt gyorsan felmérheted.": [
    "You may not be ready to invest yet. Check quickly.",
    "Vielleicht bist du noch nicht bereit zum Anlegen. Prüfe es kurz."
  ],
  "Pipáld ki, ami már igaz rád. Ez nem hivatalos teszt, csak egy gyakorlati tükör: segít eldönteni, hogy inkább alapozni, tanulni vagy már konkrét számításokat végezni érdemes.": [
    "Tick what already applies to you. This is not an official test, but a practical reflection to help decide whether to build foundations, learn or start detailed calculations.",
    "Kreuze an, was bereits auf dich zutrifft. Das ist kein offizieller Test, sondern eine praktische Standortbestimmung: Grundlagen schaffen, lernen oder konkrete Berechnungen beginnen?"
  ],
  "Először térképezz.": [
    "Start by mapping your finances.",
    "Erfasse zuerst deine Finanzen."
  ],
  "Kezdd a bevételek, kiadások és adósságok áttekintésével.": [
    "Review income, expenses and debts first.",
    "Beginne mit Einnahmen, Ausgaben und Schulden."
  ],
  "Befektetés előtti önellenőrző lista": [
    "Pre-investment self-checklist",
    "Selbstcheck vor dem Anlegen"
  ],
  "Tudom, mennyi a havi nettó bevételem és átlagos kiadásom.": [
    "I know my monthly net income and average expenses.",
    "Ich kenne meine monatlichen Nettoeinnahmen und durchschnittlichen Ausgaben."
  ],
  "Legalább néhány hónapja követem a pénzmozgásaimat.": [
    "I have tracked cash flows for at least a few months.",
    "Ich verfolge meine Geldbewegungen seit mindestens einigen Monaten."
  ],
  "Van elkülönített vésztartalékom váratlan helyzetekre.": [
    "I have a separate emergency reserve.",
    "Ich habe eine getrennte Notfallreserve."
  ],
  "Nincs kezeletlen, magas kamatozású tartozásom.": [
    "I have no unmanaged high-interest debt.",
    "Ich habe keine ungeregelten hoch verzinsten Schulden."
  ],
  "Tudom, milyen célra és milyen időtávra tennék félre.": [
    "I know my savings goal and time horizon.",
    "Ich kenne Sparziel und Zeithorizont."
  ],
  "El tudom viselni, ha a befektetésem értéke átmenetileg csökken.": [
    "I can cope with a temporary fall in investment value.",
    "Ich kann vorübergehende Wertverluste meiner Anlage verkraften."
  ],
  "Értem a hozam, kockázat és likviditás közötti kapcsolatot.": [
    "I understand the relationship between return, risk and liquidity.",
    "Ich verstehe den Zusammenhang zwischen Rendite, Risiko und Liquidität."
  ],
  "Meg tudom nézni egy termék díjait és költségeit.": [
    "I can check a product’s charges and costs.",
    "Ich kann Gebühren und Kosten eines Produkts prüfen."
  ],
  "Nem egyetlen termékbe tenném az összes megtakarításomat.": [
    "I would not put all savings into one product.",
    "Ich würde nicht alle Ersparnisse in ein Produkt stecken."
  ],
  "Nem ígéret, reklám vagy félelem alapján döntenék.": [
    "I would not decide from promises, advertising or fear.",
    "Ich würde nicht aufgrund von Versprechen, Werbung oder Angst entscheiden."
  ],
  "Gyakorlati útiterv": [
    "Practical roadmap",
    "Praktischer Fahrplan"
  ],
  "Mit csinálj az első 90 napban, ha most kezded?": [
    "What should beginners do in their first 90 days?",
    "Was sollten Einsteiger in den ersten 90 Tagen tun?"
  ],
  "Nem kell mindent egyszerre megoldani. A pénzügyi tudatosság akkor marad fenntartható, ha kis, ismételhető lépésekből épül.": [
    "You do not need to solve everything at once. Financial awareness is sustainable when built from small, repeatable steps.",
    "Du musst nicht alles auf einmal lösen. Finanzbewusstsein bleibt nachhaltig, wenn es aus kleinen wiederholbaren Schritten entsteht."
  ],
  "1-30. nap": [
    "Days 1–30",
    "Tage 1–30"
  ],
  "Térképezés": [
    "Mapping",
    "Bestandsaufnahme"
  ],
  "Nézd át a számlatörténetet, csoportosítsd a kiadásokat, számold ki az átlagos havi mozgásteredet, és írd össze az összes tartozást.": [
    "Review account history, group expenses, calculate average monthly flexibility and list all debts.",
    "Prüfe Kontoauszüge, gruppiere Ausgaben, berechne den durchschnittlichen Monatsspielraum und erfasse alle Schulden."
  ],
  "31-60. nap": [
    "Days 31–60",
    "Tage 31–60"
  ],
  "Stabilizálás": [
    "Stabilising",
    "Stabilisieren"
  ],
  "Állíts be automatikus félretételt, kezdd el építeni a tartalékot, és keress pénzszivárgásokat: előfizetések, impulzusvásárlások, indokolatlan banki költségek.": [
    "Set up automatic saving, start reserves and look for financial leaks: subscriptions, impulse purchases and unnecessary bank charges.",
    "Richte automatisches Sparen ein, beginne Rücklagen zu bilden und suche Geldlecks: Abonnements, Impulskäufe und unnötige Bankkosten."
  ],
  "61-90. nap": [
    "Days 61–90",
    "Tage 61–90"
  ],
  "Tanulás és terv": [
    "Learning and planning",
    "Lernen und planen"
  ],
  "Ismerd meg az alapfogalmakat: kamat, infláció, költség, kockázat, likviditás, diverzifikáció. Ezután írj egy egyszerű, saját befektetési tervvázlatot.": [
    "Learn interest, inflation, costs, risk, liquidity and diversification. Then outline a simple investment plan of your own.",
    "Lerne Zins, Inflation, Kosten, Risiko, Liquidität und Streuung kennen. Entwirf danach einen einfachen eigenen Anlageplan."
  ],
  "A háromszög": [
    "The triangle",
    "Das Dreieck"
  ],
  "Hozam, biztonság, likviditás: egyszerre mindhárom ritkán erős.": [
    "Return, safety and liquidity are rarely all strong at once.",
    "Rendite, Sicherheit und Liquidität sind selten gleichzeitig stark ausgeprägt."
  ],
  "A befektetéseknél mindig kompromisszumot kötsz. Ami könnyen hozzáférhető és biztonságosabb, az gyakran alacsonyabb hozammal jár. Ami magasabb hozammal kecsegtet, ott általában nagyobb a kockázat, hosszabb időtáv vagy erősebb árfolyamingadozás is megjelenhet.": [
    "Investing always involves trade-offs. Accessible, safer options often have lower returns. Higher potential returns generally come with more risk, longer horizons or stronger market fluctuations.",
    "Anlegen erfordert immer Kompromisse. Gut verfügbare und sicherere Möglichkeiten bieten häufig geringere Renditen. Höhere Ertragschancen gehen meist mit größerem Risiko, längeren Zeiträumen oder stärkeren Kursschwankungen einher."
  ],
  "Mit remélsz nyerni?": [
    "What return do you hope for?",
    "Welche Rendite erhoffst du dir?"
  ],
  "Mekkora veszteség fér bele?": [
    "What loss can you tolerate?",
    "Welchen Verlust kannst du verkraften?"
  ],
  "Likviditás": [
    "Liquidity",
    "Liquidität"
  ],
  "Mikor kellhet a pénz?": [
    "When might you need the money?",
    "Wann könntest du das Geld brauchen?"
  ],
  "Számolj hozzá": [
    "Do the calculations",
    "Rechne es durch"
  ],
  "A jó pénzügyi döntéshez kell néhány egyszerű szám.": [
    "Good financial decisions need a few simple numbers.",
    "Für gute Finanzentscheidungen braucht es einige einfache Zahlen."
  ],
  "Az alábbi kalkulátorok segítenek a pénzügyi alapok számszerűsítésében: megnézheted, mennyi marad havonta, hogyan hat az infláció a pénzedre, mit jelent a kamatos kamat, vagy mennyibe kerülhet egy hitel hosszabb távon.": [
    "These calculators quantify financial foundations: monthly surplus, inflation’s effect, compound interest and the longer-term cost of borrowing.",
    "Diese Rechner machen finanzielle Grundlagen messbar: Monatsüberschuss, Inflationseffekt, Zinseszins und langfristige Kreditkosten."
  ],
  "Költségvetés": [
    "Budgeting",
    "Budgetplanung"
  ],
  "Nézd meg, mennyi marad a bevételeidből a kiadások után.": [
    "See what remains after spending.",
    "Prüfe, was nach den Ausgaben bleibt."
  ],
  "Értékmegőrzés": [
    "Preserving value",
    "Werterhalt"
  ],
  "Becsüld meg, hogyan változhat a pénzed vásárlóereje.": [
    "Estimate changes in purchasing power.",
    "Schätze Veränderungen der Kaufkraft."
  ],
  "Lásd, mit jelent a rendszeres megtakarítás hosszabb távon.": [
    "See the long-term effect of regular saving.",
    "Betrachte die langfristige Wirkung regelmäßigen Sparens."
  ],
  "Befektetés": [
    "Investing",
    "Anlegen"
  ],
  "Vizsgáld meg több hozam- és költségfeltételezés hosszú távú hatását.": [
    "Explore the long-term effects of several return and cost assumptions.",
    "Prüfe die langfristigen Folgen mehrerer Rendite- und Kostenannahmen."
  ],
  "Jövedelem": [
    "Income",
    "Einkommen"
  ],
  "Becsüld meg a hozam alapján várható bruttó és nettó osztalékot.": [
    "Estimate gross and net dividends from an assumed yield.",
    "Schätze Brutto- und Nettodividenden anhand einer angenommenen Rendite."
  ],
  "Számolj célösszeggel, induló pénzzel és havi félretétellel.": [
    "Calculate using a target amount, starting capital and monthly saving.",
    "Rechne mit Zielbetrag, Startkapital und monatlichem Sparen."
  ],
  "Adósság": [
    "Debt",
    "Schulden"
  ],
  "Értsd meg, mennyibe kerülhet egy hitel havi és teljes szinten.": [
    "Understand monthly and total borrowing costs.",
    "Verstehe monatliche und gesamte Kreditkosten."
  ],
  "Tervezés előtt tisztázd, mekkora bevétellel számolhatsz.": [
    "Clarify expected income before planning.",
    "Kläre vor der Planung das erwartbare Einkommen."
  ],
  "Vészjelzések": [
    "Warning signs",
    "Warnsignale"
  ],
  "Ha ezt látod, lassíts.": [
    "If you see these, slow down.",
    "Wenn du das siehst, werde langsamer."
  ],
  "A pénzügyi tudatosság része, hogy nemet tudsz mondani. Nem minden ajánlat rossz, ami lelkes, de a túl erős nyomás, a garantált magas hozam és a homályos költségstruktúra mindig megér egy második ellenőrzést.": [
    "Financial awareness includes being able to say no. Enthusiasm alone does not make an offer bad, but pressure, guaranteed high returns and unclear costs warrant a second check.",
    "Zum Finanzbewusstsein gehört, Nein sagen zu können. Begeisterung macht ein Angebot nicht automatisch schlecht. Starker Druck, garantierte hohe Renditen und unklare Kosten rechtfertigen aber eine zweite Prüfung."
  ],
  "Garantált, kiemelkedő hozamot ígérnek kockázat nélkül.": [
    "Promises of exceptional guaranteed returns without risk.",
    "Versprechen außergewöhnlicher garantierter Renditen ohne Risiko."
  ],
  "Sürgetnek, hogy azonnal dönts, különben “lemaradsz”.": [
    "Pressure to decide immediately or “miss out”.",
    "Druck, sofort zu entscheiden, um nichts zu „verpassen“."
  ],
  "Nem világosak a díjak, költségek, kiszállási feltételek.": [
    "Unclear fees, costs or exit conditions.",
    "Unklare Gebühren, Kosten oder Ausstiegsbedingungen."
  ],
  "Nem érted pontosan, miből származna a hozam.": [
    "You do not understand where returns would come from.",
    "Du verstehst nicht genau, woher der Ertrag kommen soll."
  ],
  "Hitelt vennél fel azért, hogy befektess.": [
    "You would borrow money to invest.",
    "Du würdest zum Anlegen einen Kredit aufnehmen."
  ],
  "Az összes pénzedet egyetlen termékbe tennéd.": [
    "You would put all your money into one product.",
    "Du würdest dein gesamtes Geld in ein Produkt stecken."
  ],
  "Gyakori kérdések a befektetés előtti alapozásról.": [
    "Common questions about foundations before investing.",
    "Häufige Fragen zu den Grundlagen vor dem Anlegen."
  ],
  "Mennyi pénzzel érdemes elkezdeni?": [
    "How much money should I start with?",
    "Mit wie viel Geld sollte ich beginnen?"
  ],
  "Nem az összeg az első kérdés, hanem a rendszer. Ha már van követhető költségvetésed, tartalékod és célod, kisebb összegekkel is lehet tanulni. Ha ezek hiányoznak, nagyobb pénzzel is könnyű rossz döntést hozni.": [
    "The first question is your system, not the amount. With a clear budget, reserves and goals, you can learn with small sums. Without them, even larger sums can lead to poor decisions.",
    "Zuerst zählt das System, nicht die Summe. Mit nachvollziehbarem Budget, Rücklagen und Zielen kannst du mit kleinen Beträgen lernen. Fehlen diese Grundlagen, sind auch mit viel Geld Fehlentscheidungen leicht möglich."
  ],
  "Elég, ha csak félreteszek havonta?": [
    "Is saving monthly enough?",
    "Reicht monatliches Zurücklegen?"
  ],
  "A rendszeres félretétel nagyon erős alap. A következő lépés az, hogy elkülöníted: mi megy vésztartalékba, mi rövid távú célra, és mi az, ami hosszabb távon befektethető lehet.": [
    "Regular saving is a strong foundation. Next separate emergency funds, short-term goals and money potentially available for long-term investing.",
    "Regelmäßiges Sparen ist eine starke Grundlage. Trenne danach Notfallreserve, kurzfristige Ziele und möglicherweise langfristig anlegbares Geld."
  ],
  "Miért nem jó ötlet minden pénzt befektetni?": [
    "Why not invest all my money?",
    "Warum nicht alles Geld anlegen?"
  ],
  "Mert a befektetések értéke ingadozhat, és nem mindig akkor ideális kiszállni, amikor neked pénzre van szükséged. Ezért kell külön tartani a mindennapi pénzt, a vésztartalékot és a hosszabb távú befektetési pénzt.": [
    "Investment values fluctuate and a good selling time may not coincide with when you need cash. Keep everyday money, emergency reserves and long-term investments separate.",
    "Anlagewerte schwanken, und ein guter Verkaufszeitpunkt fällt nicht immer mit deinem Geldbedarf zusammen. Trenne Alltagsgeld, Notfallreserve und langfristige Anlagen."
  ],
  "Mi az első befektetési fogalom, amit érdemes megérteni?": [
    "Which investment concept should I understand first?",
    "Welchen Anlagebegriff sollte ich zuerst verstehen?"
  ],
  "A kockázat. Nem csak azt jelenti, hogy “veszíthetsz”, hanem azt is, hogy mekkora ingadozást bírsz érzelmileg, mennyi ideig tudod nélkülözni a pénzt, és mit teszel, ha a piac átmenetileg ellened megy.": [
    "Risk. It means more than possible losses: consider tolerable fluctuations, how long you can do without the money and how you would react to a market downturn.",
    "Risiko. Es bedeutet mehr als mögliche Verluste: Beachte erträgliche Schwankungen, wie lange du das Geld entbehren kannst und wie du auf einen Marktrückgang reagieren würdest."
  ],
  "Kell szakértő, vagy elég egyedül tanulni?": [
    "Do I need an expert, or can I learn independently?",
    "Brauche ich Fachleute oder reicht eigenes Lernen?"
  ],
  "Az alapfogalmakat érdemes önállóan is megtanulni, mert így jobb kérdéseket tudsz feltenni. Nagyobb döntéseknél, adózási vagy összetettebb befektetési helyzeteknél viszont hasznos lehet független szakmai segítség.": [
    "Learning basic concepts yourself helps you ask better questions. Independent professional help may be useful for large decisions, taxes or complex investments.",
    "Grundbegriffe selbst zu lernen hilft, bessere Fragen zu stellen. Bei großen Entscheidungen, Steuern oder komplexen Anlagen kann unabhängige fachliche Hilfe sinnvoll sein."
  ],
  "Mikor mondjam azt, hogy még nem fektetek be?": [
    "When should I decide not to invest yet?",
    "Wann sollte ich noch nicht anlegen?"
  ],
  "Ha nincs tartalékod, nem érted a terméket, hitelből fektetnél be, vagy egy váratlan kiadás miatt bármikor szükséged lehet a pénzre, akkor sokszor jobb előbb alapozni.": [
    "If you have no reserves, do not understand the product, would borrow to invest or might need the money at any time for unexpected expenses, it is often better to build foundations first.",
    "Ohne Rücklagen, bei unverstandenem Produkt, kreditfinanzierter Anlage oder jederzeit möglichem Geldbedarf für unerwartete Ausgaben ist es oft besser, zuerst Grundlagen zu schaffen."
  ],
  "További megbízható tájékozódás": [
    "Further reliable information",
    "Weitere verlässliche Informationen"
  ],
  "Érdemes hivatalos, oktatási forrásokat is olvasni.": [
    "Read official educational sources too.",
    "Lies auch amtliche Bildungsquellen."
  ],
  "MNB Pénzügyi Navigátor": [
    "MNB Financial Navigator",
    "MNB-Finanznavigator"
  ],
  "MNB: Tervezze meg kiadásait": [
    "MNB: Plan your spending",
    "MNB: Ausgaben planen"
  ],
  "MNB: Befektetések tájékoztató": [
    "MNB: Investment information",
    "MNB: Informationen zu Anlagen"
  ],
  "Pénziránytű Alapítvány": [
    "Pénziránytű Foundation",
    "Pénziránytű-Stiftung"
  ],
  "Következő lépés": [
    "Next step",
    "Nächster Schritt"
  ],
  "Előbb számolj. Utána dönts.": [
    "Calculate first, then decide.",
    "Erst rechnen, dann entscheiden."
  ],
  "Ha az alapok már rendben vannak, a kalkulátorok segítenek számszerűsíteni a célokat: mennyi marad havonta, mennyit ér a pénz infláció mellett, és mit jelent a kamatos kamat hosszabb távon.": [
    "Once foundations are in place, calculators quantify goals: monthly surplus, money’s value under inflation and long-term compounding.",
    "Wenn die Grundlagen stehen, machen Rechner Ziele messbar: Monatsüberschuss, Geldwert bei Inflation und langfristiger Zinseszins."
  ],
  "Pénzügyi sorrend": [
    "Financial priorities",
    "Finanzielle Reihenfolge"
  ],
  "Nem mindig a legmagasabb várható hozam a következő jó lépés": [
    "The highest expected return is not always the next sensible step",
    "Die höchste erwartete Rendite ist nicht immer der nächste sinnvolle Schritt"
  ],
  "Előbb lásd a havi pénzáramlást és a rövid távú tartalékot.": [
    "First understand monthly cash flow and short-term reserves.",
    "Verstehe zuerst den monatlichen Geldfluss und kurzfristige Rücklagen."
  ],
  "Drága teher": [
    "Expensive commitments",
    "Teure Belastungen"
  ],
  "Hitel és kötelező kiadások mellett mérd fel, mi viszi el a legtöbb biztos pénzt.": [
    "With debts and essential expenses, identify what consumes the most reliable income.",
    "Prüfe bei Krediten und Pflichtausgaben, was den größten sicheren Geldbetrag verbraucht."
  ],
  "Különítsd el a rövid, közép- és hosszú távú pénzügyi célokat.": [
    "Separate short-, medium- and long-term goals.",
    "Trenne kurz-, mittel- und langfristige Finanzziele."
  ],
  "A hozamfeltételezéshez rendelj időtávot, költséget, kockázatot és inflációt.": [
    "Link return assumptions to duration, costs, risk and inflation.",
    "Verbinde Renditeannahmen mit Zeit, Kosten, Risiko und Inflation."
  ],
  "Visszamérés": [
    "Reviewing progress",
    "Erfolgskontrolle"
  ],
  "Időnként a tervet a tényleges bevételhez, kiadáshoz és megtakarításhoz igazítsd.": [
    "Adjust plans periodically to actual income, spending and savings.",
    "Passe den Plan gelegentlich den tatsächlichen Einnahmen, Ausgaben und Ersparnissen an."
  ],
  "Ez az oldal oktatási és tervezési keret, nem egyedi befektetési ajánlás.": [
    "This page is an educational and planning framework, not an individual investment recommendation.",
    "Diese Seite ist ein Bildungs- und Planungsrahmen, keine individuelle Anlageempfehlung."
  ],
  "Független Wise bemutató magyarul": [
    "Independent Wise overview",
    "Unabhängiger Wise-Überblick"
  ],
  "Wise: nemzetközi pénzügyek, devizák és utazós költések": [
    "Wise: international finances, currencies and travel spending",
    "Wise: internationale Finanzen, Währungen und Reiseausgaben"
  ],
  "érthetőbben": [
    "made clearer",
    "verständlich erklärt"
  ],
  "Ha külföldre utalsz, devizában fizetsz, online ügyfelektől kapsz pénzt, vagy utazás előtt szeretnéd átlátni a költségeket, a Wise egy olyan digitális pénzügyi szolgáltatás, amit érdemes megismerni.": [
    "If you transfer abroad, pay in foreign currencies, receive online client payments or want to understand travel costs, Wise is a digital financial service worth exploring.",
    "Wenn du ins Ausland überweist, in Fremdwährung zahlst, Online-Kundenzahlungen erhältst oder Reisekosten verstehen möchtest, ist Wise ein digitaler Finanzdienst, den du kennenlernen kannst."
  ],
  "Ez az oldal nem banki tanácsadás és nem hivatalos Wise ügyfélszolgálat: egy gyakorlati, Kalkulátor Bázis-szemléletű összefoglaló arról, mikor lehet hasznos, mire figyelj, és milyen számításokat érdemes elvégezni előtte.": [
    "This is not banking advice or official Wise customer support. It is an independent, practical Kalkulátor Bázis overview of possible uses, considerations and calculations to make first.",
    "Dies ist keine Bankberatung und kein offizieller Wise-Kundendienst. Es ist ein praktischer Überblick aus Sicht von Kalkulátor Bázis über mögliche Einsätze, wichtige Punkte und vorher sinnvolle Berechnungen."
  ],
  "Átlátható ajánlói jelölés:": [
    "Transparent affiliate disclosure:",
    "Transparenter Partnerhinweis:"
  ],
  "a Wise gombok ajánlói linkek. Neked ez nem jelent automatikusan plusz költséget, de a díjakat mindig a Wise hivatalos oldalán ellenőrizd.": [
    "Wise buttons are affiliate links. They do not automatically add costs for you, but always check fees on Wise’s official website.",
    "Wise-Buttons sind Partnerlinks. Sie verursachen nicht automatisch Mehrkosten für dich; prüfe Gebühren aber stets auf der offiziellen Wise-Website."
  ],
  "Wise hivatalos oldal megnyitása": [
    "Open the official Wise website",
    "Offizielle Wise-Website öffnen"
  ],
  "Deviza kalkulátor": [
    "Currency Calculator",
    "Währungsrechner"
  ],
  "Gyors áttekintés": [
    "Quick overview",
    "Kurzüberblick"
  ],
  "Mire figyelj első körben?": [
    "What should you check first?",
    "Was solltest du zuerst prüfen?"
  ],
  "milyen devizában küldesz vagy fogadsz pénzt,": [
    "the currency you send or receive,",
    "Die Währung beim Senden oder Empfangen,"
  ],
  "mekkora az átváltás és az utalás teljes költsége,": [
    "the full exchange and transfer cost,",
    "Die gesamten Wechsel- und Überweisungskosten,"
  ],
  "kell-e kártya vagy helyi számlaadat,": [
    "whether you need a card or local account details,",
    "Ob du eine Karte oder lokale Kontodaten benötigst,"
  ],
  "milyen limitek és feltételek vonatkoznak rád.": [
    "the limits and terms applicable to you.",
    "Die für dich geltenden Limits und Bedingungen."
  ],
  "40 pénznem": [
    "40 currencies",
    "40 Währungen"
  ],
  "a Wise hivatalos tájékoztatása szerint": [
    "according to official Wise information",
    "Laut offiziellen Wise-Informationen"
  ],
  "160 ország és terület": [
    "160 countries and territories",
    "160 Länder und Gebiete"
  ],
  "nemzetközi használati fókusz": [
    "focus on international use",
    "Fokus auf internationale Nutzung"
  ],
  "2 lépcsős védelem": [
    "Two-step protection",
    "Zweistufiger Schutz"
  ],
  "fiókbiztonsági funkciók": [
    "account security features",
    "Funktionen zur Kontosicherheit"
  ],
  "EEA szabályozás": [
    "EEA regulation",
    "EWR-Regulierung"
  ],
  "Belgiumi Nemzeti Bank felügyelete alatt": [
    "supervised by the National Bank of Belgium",
    "Unter Aufsicht der Belgischen Nationalbank"
  ],
  "A lényeg röviden": [
    "The essentials",
    "Das Wesentliche"
  ],
  "Nem csak egy “külföldre utalok” típusú szolgáltatás.": [
    "More than a service for sending money abroad.",
    "Mehr als ein Dienst für Auslandsüberweisungen."
  ],
  "A Wise akkor érdekes igazán, amikor a pénzed több ország, több pénznem vagy több online platform között mozog. Ilyenkor nem csak az utalás díja számít, hanem az árfolyam, az átláthatóság és az, hogy mennyire egyszerű visszakövetni a tranzakciókat.": [
    "Wise is particularly relevant when money moves between countries, currencies or online platforms. Transfer fees, exchange rates, transparency and traceability all matter.",
    "Wise ist besonders relevant, wenn Geld zwischen Ländern, Währungen oder Online-Plattformen fließt. Dabei zählen Überweisungsgebühren, Wechselkurs, Transparenz und Nachvollziehbarkeit der Transaktionen."
  ],
  "FX": [
    "FX",
    "FX"
  ],
  "Devizaváltás érthetőbben": [
    "Currency exchange made clearer",
    "Währungswechsel verständlicher erklärt"
  ],
  "A Wise kommunikációjában fontos elem a középárfolyam és az előre látható díj. Ez segíthet abban, hogy ne csak a kapott végösszeget nézd, hanem azt is, miből áll össze a költség.": [
    "Wise highlights mid-market exchange rates and upfront fees. This can help you assess the cost breakdown as well as the final amount received.",
    "Wise betont Devisenmittelkurse und vorab sichtbare Gebühren. Das kann helfen, neben dem Empfangsbetrag auch die Kostenbestandteile zu beurteilen."
  ],
  "IBAN": [
    "IBAN",
    "IBAN"
  ],
  "Pénzfogadás külföldről": [
    "Receiving money internationally",
    "Geld aus dem Ausland empfangen"
  ],
  "Nemzetközi ügyfelek, platformok vagy családi utalások esetén hasznos lehet, ha több pénznemhez kapcsolódó számlaadatokat is tudsz kezelni.": [
    "For international clients, platforms or family transfers, managing account details in several currencies can be useful.",
    "Bei internationalen Kunden, Plattformen oder Familienüberweisungen können Kontodaten für mehrere Währungen hilfreich sein."
  ],
  "CARD": [
    "CARD",
    "KARTE"
  ],
  "Kártyás költés utazáskor": [
    "Card spending while travelling",
    "Kartenausgaben auf Reisen"
  ],
  "Külföldi vásárlásnál nem mindegy, milyen árfolyamon és milyen költségekkel fizetsz. A Wise kártya azoknak lehet érdekes, akik gyakran költenek más pénznemben.": [
    "Exchange rates and fees matter when shopping abroad. The Wise card may interest people who often spend in other currencies.",
    "Bei Auslandseinkäufen zählen Wechselkurs und Gebühren. Die Wise-Karte kann für häufige Ausgaben in anderen Währungen interessant sein."
  ],
  "APP": [
    "APP",
    "APP"
  ],
  "Mobilos pénzkezelés": [
    "Managing money on mobile",
    "Geld mobil verwalten"
  ],
  "A digitális felület erőssége, hogy az utalások, váltások, értesítések és kártyabeállítások egy helyen kezelhetők.": [
    "The digital interface brings transfers, exchanges, notifications and card settings together.",
    "Die digitale Oberfläche bündelt Überweisungen, Währungswechsel, Mitteilungen und Karteneinstellungen."
  ],
  "BIZ": [
    "BIZ",
    "BIZ"
  ],
  "Freelancer és vállalkozói helyzetek": [
    "Freelance and business uses",
    "Einsatz für Freiberufler und Unternehmen"
  ],
  "Ha nemzetközi ügyfelekkel dolgozol, különösen fontos lehet, hogy a pénzfogadás, devizakezelés és költségáttekintés ne vigyen el felesleges időt.": [
    "For international client work, receiving money, handling currencies and tracking costs should not take unnecessary time.",
    "Bei internationalen Kunden sollten Geldempfang, Währungsverwaltung und Kostenübersicht nicht unnötig Zeit beanspruchen."
  ],
  "SEC": [
    "SEC",
    "SEC"
  ],
  "Biztonsági fókusz": [
    "Focus on security",
    "Fokus auf Sicherheit"
  ],
  "A kétlépcsős azonosítás, a tranzakciókövetés és a fiókvédelem fontos része annak, hogy egy pénzügyi app hosszú távon is használható legyen.": [
    "Two-step verification, transaction tracking and account protection are important for a financial app’s long-term usability.",
    "Zweistufige Anmeldung, Transaktionsverfolgung und Kontoschutz sind wichtig für die langfristige Nutzbarkeit einer Finanz-App."
  ],
  "Használati helyzetek": [
    "Use cases",
    "Nutzungssituationen"
  ],
  "Mikor lehet hasznos a Wise?": [
    "When might Wise be useful?",
    "Wann kann Wise hilfreich sein?"
  ],
  "Nem minden pénzügyi helyzetre a Wise a válasz. Akkor érdemes ránézni, ha devizával, külföldi utalással vagy nemzetközi online fizetéssel találkozol, és szeretnéd a saját bankod díjaival, árfolyamával és feltételeivel összehasonlítani.": [
    "Wise is not the answer to every financial situation. Consider it for foreign currencies, international transfers or online payments when comparing with your bank’s fees, rates and terms.",
    "Wise passt nicht zu jeder Finanzsituation. Prüfe es bei Fremdwährungen, Auslandsüberweisungen oder internationalen Online-Zahlungen im Vergleich zu Gebühren, Kursen und Bedingungen deiner Bank."
  ],
  "Wise feltételek ellenőrzése": [
    "Check Wise terms",
    "Wise-Bedingungen prüfen"
  ],
  "Külföldre utalsz pénzt": [
    "Sending money abroad",
    "Geld ins Ausland senden"
  ],
  "Családnak, szolgáltatónak, albérletre, tanulmányokra vagy más személyes célra szeretnél pénzt küldeni.": [
    "Send money to family, providers, rent, study or other personal purposes.",
    "Sende Geld an Familie oder Anbieter, für Miete, Studium oder andere persönliche Zwecke."
  ],
  "Több pénznemben kapsz vagy költesz": [
    "Receiving or spending several currencies",
    "Mehrere Währungen empfangen oder ausgeben"
  ],
  "Például euróban érkezik bevételed, dollárban fizetsz szolgáltatást, vagy több devizát kezelsz párhuzamosan.": [
    "For example, receiving income in euros, paying for services in dollars or managing multiple currencies.",
    "Etwa Einnahmen in Euro, Dienstleistungszahlungen in Dollar oder die parallele Verwaltung mehrerer Währungen."
  ],
  "Utazáskor külön kezelnéd a pénzed": [
    "Keeping travel money separate",
    "Reisegeld getrennt verwalten"
  ],
  "Külföldi kártyás költésnél, készpénzfelvételnél és devizaváltásnál is számíthat az árfolyam és a díj.": [
    "Exchange rates and fees matter for card spending, cash withdrawals and currency exchange abroad.",
    "Bei Kartenzahlungen, Bargeldabhebungen und Währungswechsel im Ausland zählen Kurse und Gebühren."
  ],
  "Nemzetközi ügyfelekkel dolgozol": [
    "Working with international clients",
    "Mit internationalen Kunden arbeiten"
  ],
  "Online vállalkozásban vagy szabadúszóként hasznos lehet, ha átláthatóbb a pénzfogadás és a devizakezelés.": [
    "Online businesses and freelancers may benefit from clearer receipt and currency management.",
    "Online-Unternehmen und Freiberufler können von übersichtlicherem Geldempfang und Währungsmanagement profitieren."
  ],
  "Előre látnád a díjakat": [
    "Knowing fees upfront",
    "Gebühren vorher kennen"
  ],
  "Utalás vagy váltás előtt fontos lehet, hogy lásd az alkalmazott árfolyamot, a várható díjat és a kézhez érkező összeget.": [
    "Before transferring or exchanging, check the rate, expected fee and amount received.",
    "Prüfe vor Überweisung oder Wechsel den Kurs, die voraussichtliche Gebühr und den Empfangsbetrag."
  ],
  "Fontos összehasonlítani:": [
    "Compare carefully:",
    "Wichtig ist der Vergleich:"
  ],
  "A Wise nem minden helyzetben a legolcsóbb vagy legjobb megoldás. Utalás vagy devizaváltás előtt mindig ellenőrizd az aktuális díjakat, árfolyamot és feltételeket a Wise saját oldalán.": [
    "Wise is not always the cheapest or best option. Before transferring or exchanging, check current fees, rates and terms on Wise’s own website.",
    "Wise ist nicht immer die günstigste oder beste Lösung. Prüfe vor Überweisung oder Währungswechsel aktuelle Gebühren, Kurse und Bedingungen auf der Wise-Website."
  ],
  "Számolj előtte": [
    "Calculate beforehand",
    "Vorher rechnen"
  ],
  "A jó döntéshez nem elég az érzés. Kell pár gyors szám.": [
    "Good decisions need more than intuition: a few quick figures help.",
    "Für gute Entscheidungen reicht das Gefühl nicht. Einige schnelle Zahlen helfen."
  ],
  "A Kalkulátor Bázis lényege pont ez: mielőtt szolgáltatást választasz, tudd nagyjából, milyen árfolyam, infláció, jövedelem vagy hozam mellett gondolkodsz.": [
    "Before choosing a service, Kalkulátor Bázis helps you understand the exchange rates, inflation, income or returns behind your assumptions.",
    "Kalkulátor Bázis hilft dir vor der Dienstwahl, Wechselkurse, Inflation, Einkommen oder Renditen deiner Annahmen einzuordnen."
  ],
  "Gyors árfolyam-alapú átváltás különböző pénznemek között.": [
    "Quick exchange-rate-based currency conversion.",
    "Schnelle kursbasierte Umrechnung zwischen Währungen."
  ],
  "Nézd meg, mennyit változhat a pénzed vásárlóereje.": [
    "Explore how purchasing power may change.",
    "Prüfe mögliche Kaufkraftveränderungen."
  ],
  "Fizetés": [
    "Salary",
    "Gehalt"
  ],
  "Hasznos, ha külföldi és hazai bevételi döntéseket hasonlítasz.": [
    "Useful when comparing foreign and domestic income decisions.",
    "Hilfreich beim Vergleich ausländischer und inländischer Einkommensentscheidungen."
  ],
  "Hosszabb távú megtakarításnál a kis különbségek is számítanak.": [
    "Small differences matter in long-term saving.",
    "Beim langfristigen Sparen zählen auch kleine Unterschiede."
  ],
  "Őszinte rész": [
    "An honest assessment",
    "Eine ehrliche Einordnung"
  ],
  "Mikor nem biztos, hogy neked való?": [
    "When might it not suit you?",
    "Wann passt es möglicherweise nicht zu dir?"
  ],
  "Egy jó landing nem csak lelkesít, hanem segít kiszűrni a rossz illeszkedést is. A Wise hasznos lehet, de nem minden helyzetben ez a legfontosabb pénzügyi eszköz.": [
    "A useful overview helps identify poor fits as well as benefits. Wise may help, but it is not the most important tool in every financial situation.",
    "Ein guter Überblick zeigt neben Vorteilen auch unpassende Einsätze. Wise kann helfen, ist aber nicht in jeder Situation das wichtigste Finanzwerkzeug."
  ],
  "Ha csak forintban mozog a pénzed": [
    "If all your money is in forints",
    "Wenn dein Geld nur in Forint bewegt wird"
  ],
  "és nincs külföldi fizetésed, utalásod vagy devizás vásárlásod, lehet, hogy ritkán használnád.": [
    "and you have no foreign payments, transfers or currency purchases, you may rarely use it.",
    "Und du keine Auslandszahlungen, Überweisungen oder Fremdwährungskäufe hast, würdest du es möglicherweise selten nutzen."
  ],
  "Ha bankfióki ügyintézést szeretnél": [
    "If you want branch-based service",
    "Wenn du persönliche Filialbetreuung möchtest"
  ],
  "a Wise digitális szolgáltatás, ezért más élményt ad, mint egy személyes banki tanácsadás.": [
    "Wise is digital, so the experience differs from face-to-face bank advice.",
    "Wise ist digital und bietet daher ein anderes Erlebnis als eine persönliche Bankberatung."
  ],
  "Ha befektetési döntést hoznál": [
    "If you are making investment decisions",
    "Wenn du Anlageentscheidungen treffen möchtest"
  ],
  "önmagában egy devizás szolgáltatás nem helyettesít pénzügyi tervet, kockázatértékelést vagy szakmai tanácsadást.": [
    "a currency service alone does not replace financial planning, risk assessment or professional advice.",
    "Ein Währungsdienst allein ersetzt weder Finanzplanung noch Risikobewertung oder fachliche Beratung."
  ],
  "Biztonság és realitás": [
    "Security and realism",
    "Sicherheit und Realismus"
  ],
  "A pénzügyi appoknál a bizalom nem dísz, hanem alapfeltétel.": [
    "Trust is essential for financial apps, not decoration.",
    "Bei Finanz-Apps ist Vertrauen eine Voraussetzung, kein Schmuck."
  ],
  "A Wise hivatalos tájékoztatása szerint az EEA területén a Belgiumi Nemzeti Bank felügyelete alatt működik, és többek között kétlépcsős azonosítást, csalásmegelőzési folyamatokat és tranzakciókövetést alkalmaz.": [
    "According to Wise’s official information, its EEA operations are supervised by the National Bank of Belgium and use measures including two-step verification, fraud prevention and transaction tracking.",
    "Laut offiziellen Wise-Informationen steht der EWR-Betrieb unter Aufsicht der Belgischen Nationalbank und nutzt unter anderem zweistufige Anmeldung, Betrugsprävention und Transaktionsverfolgung."
  ],
  "Mit ellenőrizz indulás előtt?": [
    "What should you check before starting?",
    "Was solltest du vor dem Start prüfen?"
  ],
  "a konkrét pénznempár díját és árfolyamát,": [
    "fees and rates for your currency pair,",
    "Gebühren und Kurs für dein Währungspaar,"
  ],
  "a kártya, készpénzfelvétel és utalás feltételeit,": [
    "card, cash withdrawal and transfer terms,",
    "Bedingungen für Karte, Bargeldabhebung und Überweisung,"
  ],
  "a saját országodra vonatkozó limiteket,": [
    "country-specific limits,",
    "Die für dein Land geltenden Limits,"
  ],
  "az ügyfél-azonosítási folyamatot.": [
    "the identity-verification process.",
    "Das Verfahren zur Identitätsprüfung."
  ],
  "Mit tehetsz te?": [
    "What can you do?",
    "Was kannst du selbst tun?"
  ],
  "használj erős, egyedi jelszót,": [
    "use a strong, unique password,",
    "Nutze ein starkes, einzigartiges Passwort,"
  ],
  "kapcsold be a kétlépcsős azonosítást,": [
    "enable two-step verification,",
    "Aktiviere die zweistufige Anmeldung,"
  ],
  "nézd át rendszeresen az értesítéseket,": [
    "review notifications regularly,",
    "Prüfe regelmäßig Mitteilungen,"
  ],
  "ismeretlen linkről ne jelentkezz be.": [
    "do not sign in through unknown links.",
    "Melde dich nicht über unbekannte Links an."
  ],
  "Rövid válaszok, mielőtt továbbkattintasz.": [
    "Quick answers before you continue.",
    "Kurze Antworten vor dem Weiterklicken."
  ],
  "Nemzetközi pénzküldésre, többdevizás pénzkezelésre, pénzfogadásra, devizaváltásra és külföldi kártyás költésre is használható. A pontos elérhetőség országonként és szolgáltatásonként eltérhet.": [
    "International transfers, multi-currency money management, receiving money, currency exchange and card spending abroad. Availability varies by country and service.",
    "Für internationale Überweisungen, Mehrwährungsverwaltung, Geldempfang, Währungswechsel und Kartenausgaben im Ausland. Die Verfügbarkeit kann je nach Land und Dienst variieren."
  ],
  "Ez hivatalos Wise oldal?": [
    "Is this an official Wise website?",
    "Ist dies eine offizielle Wise-Seite?"
  ],
  "Nem. Ez a Kalkulátor Bázis független tájékoztató oldala. A hivatalos feltételeket, díjakat és szerződéses információkat mindig a Wise saját oldalán találod meg.": [
    "No. It is an independent Kalkulátor Bázis information page. Official terms, fees and contractual information are always on Wise’s own website.",
    "Nein. Dies ist eine unabhängige Informationsseite von Kalkulátor Bázis. Offizielle Bedingungen, Gebühren und Vertragsinformationen stehen auf der Wise-Website."
  ],
  "Van plusz költsége az ajánlói linknek?": [
    "Does the affiliate link add a charge?",
    "Verursacht der Partnerlink Mehrkosten?"
  ],
  "Az ajánlói link használata neked nem jelent automatikusan plusz költséget. Az aktuális díjakat és esetleges promóciós feltételeket viszont mindig a Wise oldalán kell ellenőrizni.": [
    "Using an affiliate link does not automatically add costs. Always check current fees and any promotion terms on Wise’s website.",
    "Ein Partnerlink verursacht nicht automatisch Mehrkosten. Prüfe aktuelle Gebühren und mögliche Aktionsbedingungen stets auf der Wise-Website."
  ],
  "Utazáshoz miért lehet érdekes?": [
    "Why consider it for travel?",
    "Warum kann es für Reisen interessant sein?"
  ],
  "Mert külföldön a kártyás költésnél, készpénzfelvételnél és devizaváltásnál is számíthat az árfolyam és a díjstruktúra. Indulás előtt érdemes összehasonlítani a saját bankoddal.": [
    "Rates and fee structures matter for card payments, cash withdrawals and exchanges abroad. Compare with your bank before travelling.",
    "Bei Kartenzahlungen, Bargeldabhebungen und Währungswechsel im Ausland zählen Kurs und Gebühren. Vergleiche vor der Reise mit deiner Bank."
  ],
  "Vállalkozóknak is hasznos lehet?": [
    "Can businesses use it too?",
    "Kann es auch Unternehmen helfen?"
  ],
  "Igen, főleg akkor, ha külföldi ügyfelektől kapsz pénzt, több pénznemben számlázol, vagy nemzetközi szolgáltatásokat fizetsz. A vállalkozói használat feltételeit külön ellenőrizd.": [
    "Yes, especially when receiving foreign client payments, invoicing in multiple currencies or paying international services. Check business-use terms separately.",
    "Ja, besonders bei Zahlungen ausländischer Kunden, Rechnungen in mehreren Währungen oder internationalen Dienstleistungszahlungen. Prüfe die Bedingungen für geschäftliche Nutzung gesondert."
  ],
  "Milyen kalkulátorral érdemes kezdeni?": [
    "Which calculator should I start with?",
    "Mit welchem Rechner sollte ich beginnen?"
  ],
  "Devizás helyzetben a deviza átváltóval, hosszabb távú pénzügyi döntésnél az inflációs vagy kamatos kamat kalkulátorral. Így nem csak érzésre, hanem számok alapján döntesz.": [
    "For currency needs, start with the currency converter; for long-term decisions, inflation or compound-interest calculators. This supports decisions with numbers rather than intuition alone.",
    "Beginne bei Währungen mit dem Währungsrechner, bei langfristigen Entscheidungen mit Inflations- oder Zinseszinsrechnern. So entscheidest du anhand von Zahlen statt nur nach Gefühl."
  ],
  "Nézd meg a Wise aktuális feltételeit, aztán számolj rá.": [
    "Check current Wise terms, then do the calculations.",
    "Prüfe die aktuellen Wise-Bedingungen und rechne danach nach."
  ],
  "Ha a Wise illik a helyzetedhez, a hivatalos oldalon látod az aktuális díjakat, limiteket és elérhető funkciókat. Utána a Kalkulátor Bázis eszközeivel gyorsan ellenőrizheted, mit jelentenek ezek a saját számaidra.": [
    "If Wise suits your situation, its official website provides current fees, limits and features. Kalkulátor Bázis tools can then show what these mean for your own figures.",
    "Wenn Wise zu deiner Situation passt, findest du auf der offiziellen Website aktuelle Gebühren, Limits und Funktionen. Mit Kalkulátor Bázis kannst du danach prüfen, was diese für deine eigenen Zahlen bedeuten."
  ],
  "Devizás döntés": [
    "Currency decision",
    "Währungsentscheidung"
  ],
  "Árfolyam helyett a ténylegesen elküldött és megérkező összeget hasonlítsd": [
    "Compare amounts actually debited and received, not just rates",
    "Vergleiche tatsächlichen Abgang und Empfang statt nur Wechselkurse"
  ],
  "Mennyit terhelnek a számládra vagy kártyádra?": [
    "How much is debited from your account or card?",
    "Wie viel wird deinem Konto oder deiner Karte belastet?"
  ],
  "Átváltási árfolyam": [
    "Conversion rate",
    "Umrechnungskurs"
  ],
  "Milyen referencia vagy szolgáltatói árfolyam alapján történik az átváltás?": [
    "Which reference or provider rate is used?",
    "Welcher Referenz- oder Anbieterkurs wird verwendet?"
  ],
  "Díjak": [
    "Fees",
    "Gebühren"
  ],
  "Fix és százalékos díj, kártyás felár vagy más költség külön jelenik-e meg?": [
    "Are fixed, percentage, card or other fees shown separately?",
    "Werden feste, prozentuale, Karten- oder andere Gebühren getrennt ausgewiesen?"
  ],
  "Címzett kap": [
    "Recipient receives",
    "Empfänger erhält"
  ],
  "A végső összehasonlításnál ez az egyik legfontosabb érték.": [
    "This is a key figure in the final comparison.",
    "Das ist eine der wichtigsten Größen beim abschließenden Vergleich."
  ],
  "A becsült teljesítési idő és sürgősség is része lehet a döntésnek.": [
    "Estimated delivery time and urgency may also affect the decision.",
    "Geschätzte Ausführungszeit und Dringlichkeit können ebenfalls relevant sein."
  ],
  "Partneri átláthatóság:": [
    "Affiliate transparency:",
    "Partnertransparenz:"
  ],
  "ha az oldalon partnerlink szerepel, azt elkülönítve kezeld a saját összehasonlításodtól. A szolgáltató aktuális díja és feltétele a végleges.": [
    "keep affiliate links separate from your own comparison. Current provider fees and terms are definitive.",
    "Trenne Partnerlinks von deinem eigenen Vergleich. Maßgeblich sind die aktuellen Gebühren und Bedingungen des Anbieters."
  ],
  "hu-HU": [
    "en-GB",
    "de-DE"
  ],
  "Jó úton jársz.": [
    "You are making progress.",
    "Du bist auf einem guten Weg."
  ],
  "Már vannak alapok, de a tartalék, cél vagy kockázati kép még erősíthető.": [
    "You have foundations, but reserves, goals or understanding of risk could be stronger.",
    "Grundlagen sind vorhanden, aber Rücklagen, Ziele oder das Risikoverständnis können noch gestärkt werden."
  ],
  "Érdemes mélyebben tanulni.": [
    "Explore the details further.",
    "Vertiefe dein Wissen."
  ],
  "Közel vagy ahhoz, hogy konkrétabb számításokkal és termékismerettel továbbmenj.": [
    "You are close to progressing with more detailed calculations and product knowledge.",
    "Du bist nahe daran, mit konkreteren Berechnungen und Produktkenntnissen weiterzugehen."
  ],
  "Erős alapozás.": [
    "Strong foundations.",
    "Starke Grundlagen."
  ],
  "A fő kérdésekre már van válaszod. Innen a részletek, költségek és kockázatok ellenőrzése jön.": [
    "You have answered the main questions. Next check the details, costs and risks.",
    "Die Hauptfragen sind beantwortet. Als Nächstes prüfe Einzelheiten, Kosten und Risiken."
  ]
}
  };
});

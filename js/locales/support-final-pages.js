/* global module */
(function(root,factory){
 "use strict";
 const data=factory();
 if(typeof module==="object"&&module.exports)module.exports=data;
 if(!root?.document)return;
 root.KB_FINAL_PAGE_LOCALE=data;
 const previous=root.KB_SUPPORT_PAGE_LOCALE||{pages:[],dictionary:{}};
 root.KB_SUPPORT_PAGE_LOCALE={pages:[...new Set([...previous.pages,...data.pages])],dictionary:{...previous.dictionary,...data.dictionary},translate:data.translate};
 root.document.dispatchEvent(new root.CustomEvent("kb:locale-data-ready"));
})(typeof window==="undefined"?null:window,function(){
 "use strict";
 const pages=["dontesek.html", "elethelyzetek.html", "osszehasonlitas.html", "index.html"];
 const dictionary={
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
    "Borrowing capacity",
    "Kredittragfähigkeit"
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
  "Éves költség": [
    "Annual cost",
    "Jährliche Kosten"
  ],
  "Értékvesztés": [
    "Depreciation",
    "Wertverlust"
  ],
  "Lakásvásárlás": [
    "Buying a home",
    "Wohnungskauf"
  ],
  "Üzemeltető:": [
    "Operator:",
    "Betreiber:"
  ],
  "Fizetés és munkabér": [
    "Salary and wages",
    "Gehalt und Arbeitslohn"
  ],
  "Csempe": [
    "Tiles",
    "Fliesen"
  ],
  "Órabér": [
    "Hourly pay",
    "Stundenlohn"
  ],
  "Havi keret": [
    "Monthly budget",
    "Monatsrahmen"
  ],
  "Önerő": [
    "Deposit",
    "Eigenkapital"
  ],
  "Felújítás tervezése": [
    "Renovation planning",
    "Renovierungsplanung"
  ],
  "Befektetés": [
    "Investing",
    "Anlegen"
  ],
  "Fizetés": [
    "Salary",
    "Gehalt"
  ],
  "Döntési mód · v2": [
    "Decision mode · v2",
    "Entscheidungsmodus · v2"
  ],
  "Ne kalkulátorral kezdd. A kérdéssel.": [
    "Start with the question.",
    "Beginne mit deiner Frage."
  ],
  "A lakásvásárlási útvonal már teljes döntési képet ad: havi teher, maradó keret, tartalék, stresszteszt és kritikus változók. Az autós és megtakarítási gyorskép továbbra is egy kattintással elérhető.": [
    "The home-buying guide now provides a complete decision overview: monthly payments, remaining budget, reserves, stress tests and critical variables. Car and savings summaries are still one click away.",
    "Der Weg zum Wohnungskauf bietet jetzt einen vollständigen Entscheidungsüberblick: monatliche Belastung, verbleibendes Budget, Rücklagen, Stresstests und kritische Einflussgrößen. Kurzüberblicke zu Auto und Sparen sind weiterhin mit einem Klick erreichbar."
  ],
  "Fő feladattípusok": [
    "Main task types",
    "Wichtigste Aufgabentypen"
  ],
  "Számolni": [
    "Calculate",
    "Berechnen"
  ],
  "Dönteni": [
    "Decide",
    "Entscheiden"
  ],
  "A/B": [
    "A/B",
    "A/B"
  ],
  "Összehasonlítani": [
    "Compare",
    "Vergleichen"
  ],
  "Döntési műhely": [
    "Decision workshop",
    "Entscheidungswerkstatt"
  ],
  "Egy kérdés, több összefüggő szám": [
    "One question, several connected figures",
    "Eine Frage, mehrere zusammenhängende Zahlen"
  ],
  "A cél nem banki vagy szakmai döntést helyettesíteni, hanem láthatóvá tenni a havi mozgásteredet és azt, melyik feltételezés változtatja meg legjobban az eredményt.": [
    "The aim is to show your monthly financial flexibility and which assumption changes the result most. It does not replace a bank's assessment or professional advice.",
    "Ziel ist, deinen monatlichen Spielraum und die Annahme mit dem größten Einfluss sichtbar zu machen. Dies ersetzt keine Bankprüfung oder fachliche Beratung."
  ],
  "Döntési téma választása": [
    "Choose a decision topic",
    "Entscheidungsthema auswählen"
  ],
  "🏠 Lakásvásárlás v2": [
    "🏠 Buying a home v2",
    "🏠 Wohnungskauf v2"
  ],
  "🚗 Autó költségképe": [
    "🚗 Car cost overview",
    "🚗 Autokosten im Überblick"
  ],
  "📈 Megtakarítás": [
    "📈 Savings",
    "📈 Sparen"
  ],
  "1. Ingatlan és saját pénz": [
    "1. Property and own funds",
    "1. Immobilie und Eigenmittel"
  ],
  "Külön kezeld az összes megtakarítást, a ténylegesen önerőre szánt összeget és a vásárlás egyéb egyszeri költségeit.": [
    "Keep total savings, the amount actually allocated to the purchase price and other one-off purchase costs separate.",
    "Trenne gesamte Ersparnisse, den tatsächlich für den Kaufpreis vorgesehenen Eigenanteil und weitere einmalige Kaufkosten."
  ],
  "Összes megtakarítás (Ft)": [
    "Total savings (HUF)",
    "Gesamte Ersparnisse (HUF)"
  ],
  "A vásárlás előtt rendelkezésre álló likvid keret.": [
    "Liquid funds available before the purchase.",
    "Vor dem Kauf verfügbare liquide Mittel."
  ],
  "Vásárlásra szánt saját forrás (Ft)": [
    "Own funds allocated to the purchase (HUF)",
    "Für den Kauf vorgesehene Eigenmittel (HUF)"
  ],
  "Az ingatlan árából saját pénzből fizetett rész.": [
    "The part of the property price paid from your own funds.",
    "Der aus eigenen Mitteln bezahlte Anteil am Immobilienpreis."
  ],
  "Egyéb egyszeri költségek (Ft)": [
    "Other one-off costs (HUF)",
    "Weitere einmalige Kosten (HUF)"
  ],
  "Saját becslés: ügyvéd, költözés, illeték, induló felújítás stb.": [
    "Your estimate: solicitor, moving, transfer tax, initial renovation, etc.",
    "Eigene Schätzung: Anwalt, Umzug, Erwerbssteuer, anfängliche Renovierung usw."
  ],
  "2. Havi háztartási keret": [
    "2. Monthly household budget",
    "2. Monatliches Haushaltsbudget"
  ],
  "A nettó háztartási jövedelemből levonjuk a meglévő hiteltörlesztést, a hitelen kívüli megélhetési kiadásokat és az új lakáshitel becsült törlesztőjét.": [
    "We subtract existing loan repayments, living costs excluding loans and the estimated new mortgage payment from net household income.",
    "Vom Nettohaushaltseinkommen ziehen wir bestehende Kreditraten, Lebenshaltungskosten ohne Kredite und die geschätzte neue Immobilienkreditrate ab."
  ],
  "Havi nettó háztartási jövedelem (Ft)": [
    "Monthly net household income (HUF)",
    "Monatliches Nettohaushaltseinkommen (HUF)"
  ],
  "Meglévő havi hiteltörlesztések (Ft)": [
    "Existing monthly loan repayments (HUF)",
    "Bestehende monatliche Kreditraten (HUF)"
  ],
  "Havi megélhetési kiadás hitelen kívül (Ft)": [
    "Monthly living costs excluding loans (HUF)",
    "Monatliche Lebenshaltungskosten ohne Kredite (HUF)"
  ],
  "3. Hitel feltételezése": [
    "3. Loan assumptions",
    "3. Kreditannahmen"
  ],
  "Egyszerű annuitásos becsléssel számolunk. A tényleges banki THM, díjak, kamatperiódus és jogosultsági feltételek eltérhetnek.": [
    "We use a simple annuity estimate. The bank's actual APR, fees, interest fixation period and eligibility criteria may differ.",
    "Wir verwenden eine einfache Annuitätenschätzung. Tatsächlicher effektiver Jahreszins, Gebühren, Zinsbindung und Voraussetzungen der Bank können abweichen."
  ],
  "A minősítés tervezési heurisztika. Nem vizsgál banki JTM/HFM jogosultságot és nem minősül hitelajánlatnak.": [
    "The rating is a planning heuristic. It does not assess eligibility under Hungarian JTM/HFM rules and is not a loan offer.",
    "Die Einstufung ist eine Planungsheuristik. Sie prüft keine Zulässigkeit nach ungarischen JTM/HFM-Regeln und ist kein Kreditangebot."
  ],
  "Lakásvásárlási döntési kép készítése": [
    "Create a home-buying decision overview",
    "Entscheidungsüberblick zum Wohnungskauf erstellen"
  ],
  "Egyéb éves fix költség (Ft)": [
    "Other annual fixed costs (HUF)",
    "Weitere jährliche Fixkosten (HUF)"
  ],
  "Éves értékvesztés (Ft)": [
    "Annual depreciation (HUF)",
    "Jährlicher Wertverlust (HUF)"
  ],
  "Autós gyorskép készítése": [
    "Create a car cost summary",
    "Autokosten-Kurzüberblick erstellen"
  ],
  "Feltételezett hozam (%/év)": [
    "Assumed return (%/year)",
    "Angenommene Rendite (%/Jahr)"
  ],
  "Feltételezett infláció (%/év)": [
    "Assumed inflation (%/year)",
    "Angenommene Inflation (%/Jahr)"
  ],
  "Megtakarítási gyorskép készítése": [
    "Create a savings summary",
    "Spar-Kurzüberblick erstellen"
  ],
  "Részletes útvonalak": [
    "Detailed guides",
    "Ausführliche Wegweiser"
  ],
  "Ha mélyebbre mennél": [
    "Explore in more detail",
    "Weiter ins Detail"
  ],
  "A döntési kép után ezekkel a kalkulátorokkal tudod külön-külön ellenőrizni azokat a tényezőket, amelyek a döntésedet leginkább befolyásolják.": [
    "After the decision overview, use these calculators to check the factors that affect your decision most, one at a time.",
    "Nach dem Entscheidungsüberblick kannst du mit diesen Rechnern die wichtigsten Einflussgrößen einzeln prüfen."
  ],
  "Lakásvásárlás és hitel": [
    "Buying a home and borrowing",
    "Wohnungskauf und Kredit"
  ],
  "A v2 egyben mutatja az önerőt, hitelteher-arányt, törlesztőt, havi maradékot, tartalékot és stresszteszteket.": [
    "Version 2 shows own funds, debt-to-income ratio, repayments, monthly surplus, reserves and stress tests together.",
    "Version 2 zeigt Eigenmittel, Kreditbelastungsquote, Rate, monatlichen Restbetrag, Rücklagen und Stresstests gemeinsam."
  ],
  "Törlesztő": [
    "Repayment",
    "Kreditrate"
  ],
  "Lakásdöntés v2": [
    "Home-buying decision v2",
    "Wohnungsentscheidung v2"
  ],
  "Autócsere és fenntartás": [
    "Changing and running a car",
    "Autowechsel und Unterhalt"
  ],
  "Fogyasztás, éves költség, értékvesztés és használati mód együtt.": [
    "Fuel consumption, annual costs, depreciation and usage together.",
    "Verbrauch, Jahreskosten, Wertverlust und Nutzung zusammen."
  ],
  "Részletes számítás": [
    "Detailed calculation",
    "Ausführliche Berechnung"
  ],
  "Ft": [
    "HUF",
    "HUF"
  ],
  "Fizetés és munka": [
    "Salary and work",
    "Gehalt und Arbeit"
  ],
  "Nettó, órabér, munkaidő és túlóra — a puszta bruttón túl.": [
    "Net pay, hourly pay, working hours and overtime — beyond gross salary alone.",
    "Netto, Stundenlohn, Arbeitszeit und Überstunden — über das Bruttogehalt hinaus."
  ],
  "Túlóra": [
    "Overtime",
    "Überstunden"
  ],
  "Fizetési számítások": [
    "Pay calculations",
    "Gehaltsberechnungen"
  ],
  "Megtakarítás és hosszú távú cél": [
    "Savings and long-term goals",
    "Sparen und langfristige Ziele"
  ],
  "Havi befizetés, időtáv, hozam és infláció együttes hatása.": [
    "The combined effects of monthly contributions, time, returns and inflation.",
    "Die gemeinsame Wirkung von monatlicher Einzahlung, Laufzeit, Rendite und Inflation."
  ],
  "ETF": [
    "ETF",
    "ETF"
  ],
  "Felújítás és anyagtervezés": [
    "Renovation and material planning",
    "Renovierung und Materialplanung"
  ],
  "Festék, burkolat, gipszkarton és szigetelés anyagigénye.": [
    "Material requirements for paint, flooring, plasterboard and insulation.",
    "Materialbedarf für Farbe, Bodenbeläge, Gipskarton und Dämmung."
  ],
  "Felújítási kalkulátorok": [
    "Renovation calculators",
    "Renovierungsrechner"
  ],
  "Két lehetőség között vacillálsz?": [
    "Choosing between two options?",
    "Schwankst du zwischen zwei Möglichkeiten?"
  ],
  "A döntési kép után tedd egymás mellé a két forgatókönyvet az A/B módban.": [
    "After the decision overview, compare the two scenarios side by side in A/B mode.",
    "Vergleiche nach dem Entscheidungsüberblick zwei Szenarien nebeneinander im A/B-Modus."
  ],
  "Autó": [
    "Car",
    "Auto"
  ],
  "Állásajánlat": [
    "Job offer",
    "Stellenangebot"
  ],
  "Helyi mentések": [
    "Local saves",
    "Lokale Speicherung"
  ],
  "Korábbi összefoglalóid": [
    "Your previous summaries",
    "Deine bisherigen Zusammenfassungen"
  ],
  "A mentések csak ezen a böngészőn és ezen az eszközön tárolódnak. Nem küldjük őket szerverre.": [
    "Saved summaries stay in this browser on this device. We do not send them to a server.",
    "Gespeicherte Zusammenfassungen bleiben in diesem Browser auf diesem Gerät. Wir senden sie nicht an einen Server."
  ],
  "Döntéstámogatás v2": [
    "Decision support v2",
    "Entscheidungshilfe v2"
  ],
  "A lakásvásárlás már valódi döntési folyamat": [
    "Buying a home now has a complete decision process",
    "Der Wohnungskauf hat jetzt einen vollständigen Entscheidungsablauf"
  ],
  "A részletes kalkulátorok továbbra is a háttérben maradnak, de a felhasználó először egy egységes képet kap a havi teherről, tartalékról és érzékeny feltételezésekről.": [
    "Detailed calculators remain available in the background, while the user first gets a unified picture of monthly commitments, reserves and sensitive assumptions.",
    "Ausführliche Rechner bleiben im Hintergrund verfügbar. Zuerst erhältst du ein gemeinsames Bild von monatlicher Belastung, Rücklagen und empfindlichen Annahmen."
  ],
  "havi mozgástér és vásárlás utáni tartalék;": [
    "monthly flexibility and reserves after purchase;",
    "monatlicher Spielraum und Rücklagen nach dem Kauf;"
  ],
  "három „mi történik, ha?” stresszteszt;": [
    "three “what if?” stress tests;",
    "drei „Was wäre, wenn?“-Stresstests;"
  ],
  "kritikus változók hatás szerinti sorrendje;": [
    "critical variables ranked by impact;",
    "kritische Einflussgrößen nach Wirkung geordnet;"
  ],
  "mentés, megosztás és átjárás a részletes kalkulátorokhoz.": [
    "saving, sharing and links to detailed calculators.",
    "Speichern, Teilen und Wechsel zu ausführlichen Rechnern."
  ],
  "Döntések | Kalkulátor Bázis": [
    "Decisions – Kalkulátor Bázis",
    "Entscheidungen – Kalkulátor Bázis"
  ],
  "Döntési mód a Kalkulátor Bázison: részletes lakásvásárlási döntési kép, autó- és megtakarítási gyorskép, menthető eredmények és kapcsolódó kalkulátorok.": [
    "Decision mode on Kalkulátor Bázis: a detailed home-buying overview, car and savings summaries, saved results and related calculators.",
    "Entscheidungsmodus auf Kalkulátor Bázis: ausführlicher Überblick zum Wohnungskauf, Kurzüberblicke zu Auto und Sparen, speicherbare Ergebnisse und passende Rechner."
  ],
  "Ne kalkulátorral kezdd, hanem a kérdéssel. Lakásvásárlási döntési mód v2, autós és megtakarítási döntési gyorskép.": [
    "Start with the question. Home-buying decision mode v2 plus car and savings summaries.",
    "Beginne mit deiner Frage. Entscheidungsmodus v2 zum Wohnungskauf sowie Kurzüberblicke zu Auto und Sparen."
  ],
  "Kalkulátorok összekötve": [
    "Connected calculators",
    "Verknüpfte Rechner"
  ],
  "Ne csak számolj. Indulj ki abból, amit meg szeretnél oldani.": [
    "Start with what you want to solve.",
    "Beginne mit dem, was du lösen möchtest."
  ],
  "Az élethelyzet-oldalak több kapcsolódó kalkulátort rendeznek egy logikus útvonalba. Így nem egyetlen eredményt kapsz, hanem könnyebben látod, milyen további számításokat érdemes elvégezni ugyanahhoz a döntéshez.": [
    "Life-situation pages arrange related calculators into a logical sequence. Instead of a single result, you can see which other calculations may help with the same decision.",
    "Die Lebenssituationsseiten ordnen passende Rechner in einer logischen Reihenfolge. So siehst du neben einem einzelnen Ergebnis auch, welche weiteren Berechnungen bei derselben Entscheidung helfen können."
  ],
  "6 gyakori élethelyzet": [
    "6 common life situations",
    "6 häufige Lebenssituationen"
  ],
  "30+ kapcsolódó kalkulátor": [
    "30+ related calculators",
    "Über 30 passende Rechner"
  ],
  "Gyakorlati sorrend": [
    "Practical order",
    "Praktische Reihenfolge"
  ],
  "Válassz élethelyzetet": [
    "Choose a life situation",
    "Lebenssituation auswählen"
  ],
  "A kategóriák helyett itt a valódi célod alapján indulhatsz el.": [
    "Start with your actual goal rather than a category.",
    "Beginne hier mit deinem tatsächlichen Ziel statt mit einer Kategorie."
  ],
  "Önerő, hitelképesség, törlesztő és havi mozgástér egy útvonalban.": [
    "Own funds, borrowing capacity, repayments and monthly flexibility in one guide.",
    "Eigenmittel, Kredittragfähigkeit, Rate und monatlicher Spielraum in einem Wegweiser."
  ],
  "Autófenntartás": [
    "Running a car",
    "Autounterhalt"
  ],
  "Tankolás, éves költség, kilométerköltség és értékvesztés együtt.": [
    "Fuel, annual costs, cost per kilometre and depreciation together.",
    "Tanken, Jahreskosten, Kilometerkosten und Wertverlust zusammen."
  ],
  "Nettó, bruttó, órabér, munkaidő és a fizetés valódi havi értéke.": [
    "Net and gross pay, hourly pay, working time and the real monthly value of your salary.",
    "Netto, Brutto, Stundenlohn, Arbeitszeit und der tatsächliche monatliche Wert deines Gehalts."
  ],
  "ETF, kamatos kamat, infláció és célösszeg több forgatókönyvvel.": [
    "ETFs, compound interest, inflation and target amounts across several scenarios.",
    "ETF, Zinseszins, Inflation und Zielbetrag mit mehreren Szenarien."
  ],
  "Anyagszükséglet, ráhagyás és beszerzési kiindulópont felújításhoz.": [
    "Material requirements, allowances and a starting point for renovation purchases.",
    "Materialbedarf, Zuschlag und Ausgangspunkt für Renovierungseinkäufe."
  ],
  "Bevételek, rezsi, hitel, megtakarítás és ritkább kiadások tervezése.": [
    "Planning income, utilities, loans, savings and occasional expenses.",
    "Einnahmen, Nebenkosten, Kredite, Sparen und seltenere Ausgaben planen."
  ],
  "Hogyan használd az élethelyzet-útvonalakat?": [
    "How to use the life-situation guides",
    "So nutzt du die Lebenssituations-Wegweiser"
  ],
  "1. Először a döntési keretet tisztázd": [
    "1. First clarify your decision framework",
    "1. Kläre zuerst deinen Entscheidungsrahmen"
  ],
  "Ne egy tetszőleges kalkulátorral kezdd, hanem írd le, milyen döntést szeretnél meghozni és mely adatokat ismered biztosan. Lakásvásárlásnál például a havi mozgástér és a rendelkezésre álló saját forrás fontosabb kezdőadat, mint egy kiszemelt ingatlan teljes ára. Felújításnál előbb a mérhető felületeket és nyílásokat rögzítsd, csak utána számolj csomagszámot.": [
    "Start by writing down the decision you want to make and the figures you know reliably. When buying a home, monthly flexibility and available own funds are more useful starting points than a property's full price. For renovation, record measurable surfaces and openings before calculating packs.",
    "Schreibe zuerst auf, welche Entscheidung du treffen möchtest und welche Angaben du sicher kennst. Beim Wohnungskauf sind monatlicher Spielraum und verfügbare Eigenmittel wichtigere Ausgangsdaten als der volle Preis einer Immobilie. Erfasse bei Renovierungen zuerst messbare Flächen und Öffnungen, bevor du Packungen berechnest."
  ],
  "2. Ugyanazt a helyzetet több oldalról ellenőrizd": [
    "2. Check the same situation from several angles",
    "2. Prüfe dieselbe Situation aus mehreren Blickwinkeln"
  ],
  "Egyetlen eredmény ritkán ad teljes képet. Az autó éves költségét érdemes kilométerenkénti értékre is visszaosztani; a befektetés nominális végösszegét inflációval is összevetni; a munkabért pedig havi összeg és órabér alapján is megnézni. Az útvonalak ezért kapcsolnak össze több, külön célt szolgáló eszközt.": [
    "One result rarely gives the full picture. Divide annual car costs by kilometres too; compare nominal investment values with inflation; look at pay both monthly and per hour. That is why these guides connect tools serving different purposes.",
    "Ein Ergebnis zeigt selten das ganze Bild. Rechne jährliche Autokosten auch auf Kilometer um, vergleiche den nominalen Anlageendwert mit der Inflation und betrachte Gehalt monatlich sowie pro Stunde. Deshalb verbinden die Wegweiser Werkzeuge mit verschiedenen Aufgaben."
  ],
  "3. Készíts alap-, óvatos és terhelt forgatókönyvet": [
    "3. Create base, cautious and stressed scenarios",
    "3. Erstelle ein Basis-, ein vorsichtiges und ein Belastungsszenario"
  ],
  "Először számolj a legvalószínűbb adataiddal, majd változtass meg egy bizonytalan tényezőt. Ilyen lehet magasabb üzemanyagár, kisebb havi megtakarítás, nagyobb anyagráhagyás vagy kedvezőtlenebb hitelkamat. A három eredmény közötti különbség többet mond a döntés kockázatáról, mint egyetlen „pontosnak” tűnő szám.": [
    "Calculate with your most likely figures first, then change one uncertain factor: a higher fuel price, lower monthly savings, a larger material allowance or a less favourable borrowing rate. Differences between three results reveal more about risk than a single seemingly precise number.",
    "Rechne zuerst mit deinen wahrscheinlichsten Angaben und ändere dann einen unsicheren Faktor: höheren Kraftstoffpreis, niedrigere Sparrate, größeren Materialzuschlag oder ungünstigeren Kreditzins. Der Unterschied zwischen drei Ergebnissen sagt mehr über Risiken als eine einzelne scheinbar genaue Zahl."
  ],
  "Az oldal szerepe:": [
    "The role of this page:",
    "Aufgabe dieser Seite:"
  ],
  "az élethelyzetek szerkesztett navigációs útvonalak, nem személyre szabott pénzügyi, jogi vagy műszaki tanácsok. A számításoknál mindig az adott kalkulátor feltételezései és korlátai az irányadók.": [
    "life-situation guides are curated navigation paths, not personalised financial, legal or technical advice. Each calculator's assumptions and limitations apply.",
    "Die Lebenssituationen sind redaktionell geordnete Wegweiser, keine persönliche Finanz-, Rechts- oder technische Beratung. Es gelten die Annahmen und Grenzen des jeweiligen Rechners."
  ],
  "Kalkulátor Bázis. Utolsó szerkesztési és linkellenőrzés:": [
    "Kalkulátor Bázis. Last editorial and link review:",
    "Kalkulátor Bázis. Letzte redaktionelle und Linkprüfung:"
  ],
  "Összekapcsolt döntések": [
    "Connected decisions",
    "Zusammenhängende Entscheidungen"
  ],
  "Mikor kevés egyetlen kalkulátor?": [
    "When is one calculator not enough?",
    "Wann reicht ein Rechner nicht aus?"
  ],
  "Amikor az egyik eredmény a következő számítás bemenete. Lakásvásárlásnál például a havi mozgástér befolyásolja a vállalható törlesztőt; felújításnál a nettó felület után jön a ráhagyás és a csomagolás; autózásnál a fogyasztás csak egy része a teljes költségnek.": [
    "When one result becomes the next calculation's input. For home buying, monthly flexibility affects affordable repayments; for renovation, net area comes before allowances and packs; for driving, fuel consumption is only part of the total cost.",
    "Wenn ein Ergebnis zur Eingabe der nächsten Berechnung wird. Beim Wohnungskauf beeinflusst der monatliche Spielraum die tragbare Rate, bei Renovierungen folgen auf die Nettofläche Zuschläge und Packungen, beim Auto ist Verbrauch nur ein Teil der Gesamtkosten."
  ],
  "Lakás": [
    "Home",
    "Wohnung"
  ],
  "keret → önerő → hitel → törlesztő → tartalék": [
    "budget → own funds → loan → repayment → reserves",
    "Budget → Eigenmittel → Kredit → Rate → Rücklagen"
  ],
  "fogyasztás → útiköltség → éves költség → Ft/km → értékvesztés": [
    "consumption → trip cost → annual cost → HUF/km → depreciation",
    "Verbrauch → Fahrtkosten → Jahreskosten → HUF/km → Wertverlust"
  ],
  "bruttó/nettó → munkaidő → órabér → havi költségvetés": [
    "gross/net pay → working time → hourly pay → monthly budget",
    "Brutto/Netto → Arbeitszeit → Stundenlohn → Monatsbudget"
  ],
  "cél → időtáv → hozamfeltételezés → költség → infláció": [
    "goal → time → return assumption → costs → inflation",
    "Ziel → Laufzeit → Renditeannahme → Kosten → Inflation"
  ],
  "Felújítás": [
    "Renovation",
    "Renovierung"
  ],
  "méret → nettó felület → veszteség → csomagolás → kivitelezési sorrend": [
    "dimensions → net area → waste → packs → work sequence",
    "Maße → Nettofläche → Verschnitt → Packungen → Ausführungsreihenfolge"
  ],
  "Családi pénz": [
    "Family finances",
    "Familienfinanzen"
  ],
  "bevétel → fix kiadás → változó kiadás → ritka kiadás → tartalék": [
    "income → fixed costs → variable costs → occasional costs → reserves",
    "Einnahmen → fixe Ausgaben → variable Ausgaben → seltene Ausgaben → Rücklagen"
  ],
  "Élethelyzetek | Kalkulátorok valódi döntésekhez": [
    "Life situations – calculators for real decisions",
    "Lebenssituationen – Rechner für echte Entscheidungen"
  ],
  "Lakásvásárlás, autófenntartás, fizetés, befektetés, felújítás és családi költségvetés: kapcsolódó kalkulátorok és útmutatók egy helyen.": [
    "Home buying, running a car, salary, investment, renovation and family budgets: related calculators and guides in one place.",
    "Wohnungskauf, Autounterhalt, Gehalt, Geldanlage, Renovierung und Familienbudget: passende Rechner und Wegweiser an einem Ort."
  ],
  "Ne csak kalkulátort keress: indulj ki abból, amit éppen meg szeretnél oldani.": [
    "Start with what you want to solve, then find the calculator.",
    "Beginne mit dem, was du lösen möchtest, und finde dann den Rechner."
  ],
  "Összehasonlítás · működő A/B mód": [
    "Comparison · working A/B mode",
    "Vergleich · nutzbarer A/B-Modus"
  ],
  "Két forgatókönyv. Egy döntés.": [
    "Two scenarios. One decision.",
    "Zwei Szenarien. Eine Entscheidung."
  ],
  "Írd be ugyanannak a döntésnek az A és B változatát. A rendszer egymás mellé teszi a fő eredményeket, kiemeli az eltérést, majd az összefoglalót el is mentheted vagy megoszthatod.": [
    "Enter versions A and B of the same decision. The system displays the main results side by side and highlights the difference. You can then save or share the summary.",
    "Gib die Varianten A und B derselben Entscheidung ein. Das System stellt die wichtigsten Ergebnisse nebeneinander und hebt Unterschiede hervor. Anschließend kannst du die Zusammenfassung speichern oder teilen."
  ],
  "A/B gyors összevetés": [
    "Quick A/B comparison",
    "Schneller A/B-Vergleich"
  ],
  "Ugyanaz a kérdés, két válasz": [
    "The same question, two answers",
    "Dieselbe Frage, zwei Antworten"
  ],
  "A gyors mód a legfontosabb közös mutatókat teszi egymás mellé. A részletes kalkulátorok továbbra is elérhetők az eredményből.": [
    "Quick mode compares the most important common indicators. Detailed calculators remain accessible from the result.",
    "Der Kurzmodus vergleicht die wichtigsten gemeinsamen Kennzahlen. Ausführliche Rechner bleiben über das Ergebnis erreichbar."
  ],
  "Összehasonlítási téma választása": [
    "Choose a comparison topic",
    "Vergleichsthema auswählen"
  ],
  "🏦 Hitel": [
    "🏦 Loan",
    "🏦 Kredit"
  ],
  "🚗 Autó": [
    "🚗 Car",
    "🚗 Auto"
  ],
  "💼 Állásajánlat": [
    "💼 Job offer",
    "💼 Stellenangebot"
  ],
  "Hitelösszeg (Ft)": [
    "Loan amount (HUF)",
    "Kreditbetrag (HUF)"
  ],
  "Hitelek összehasonlítása": [
    "Compare loans",
    "Kredite vergleichen"
  ],
  "Jelenlegi / első autó": [
    "Current / first car",
    "Aktuelles / erstes Auto"
  ],
  "Egyéb éves költség (Ft)": [
    "Other annual costs (HUF)",
    "Weitere Jahreskosten (HUF)"
  ],
  "Másik autó": [
    "Other car",
    "Anderes Auto"
  ],
  "Autók összehasonlítása": [
    "Compare cars",
    "Autos vergleichen"
  ],
  "Első ajánlat": [
    "First offer",
    "Erstes Angebot"
  ],
  "Havi nettó (Ft)": [
    "Monthly net pay (HUF)",
    "Monatliches Netto (HUF)"
  ],
  "Heti munkaidő (óra)": [
    "Weekly working time (hours)",
    "Wöchentliche Arbeitszeit (Stunden)"
  ],
  "Havi rendszeres plusz (Ft)": [
    "Regular monthly extras (HUF)",
    "Regelmäßige monatliche Extras (HUF)"
  ],
  "Második ajánlat": [
    "Second offer",
    "Zweites Angebot"
  ],
  "Állásajánlatok összehasonlítása": [
    "Compare job offers",
    "Stellenangebote vergleichen"
  ],
  "Első megtakarítási út": [
    "First savings plan",
    "Erster Sparplan"
  ],
  "Második megtakarítási út": [
    "Second savings plan",
    "Zweiter Sparplan"
  ],
  "Megtakarítások összehasonlítása": [
    "Compare savings plans",
    "Sparpläne vergleichen"
  ],
  "Mire jó az A/B mód?": [
    "What is A/B mode for?",
    "Wofür eignet sich der A/B-Modus?"
  ],
  "Ne csak egy számot nézz": [
    "Look beyond a single figure",
    "Betrachte mehr als eine Zahl"
  ],
  "A két oszlop ugyanazt a logikát használja, így az eltérés láthatóvá válik anélkül, hogy kétszer külön végig kellene számolnod mindent.": [
    "Both columns use the same logic, making differences visible without running everything twice separately.",
    "Beide Spalten verwenden dieselbe Logik. So werden Unterschiede sichtbar, ohne alles zweimal getrennt zu berechnen."
  ],
  "Két hitel vagy futamidő": [
    "Two loans or repayment periods",
    "Zwei Kredite oder Laufzeiten"
  ],
  "Havi törlesztő és teljes visszafizetés különbsége egy helyen.": [
    "Monthly repayment and total repayment differences in one place.",
    "Unterschiede bei Monatsrate und Gesamtrückzahlung an einem Ort."
  ],
  "Előtörlesztés": [
    "Early repayment",
    "Sondertilgung"
  ],
  "Részletes hitelszámítás": [
    "Detailed loan calculation",
    "Ausführliche Kreditberechnung"
  ],
  "Jelenlegi autó vagy másik autó": [
    "Current car or another car",
    "Aktuelles oder anderes Auto"
  ],
  "Üzemanyag, fix költség és értékvesztés együtt — nem csak fogyasztás.": [
    "Fuel, fixed costs and depreciation together — beyond consumption alone.",
    "Kraftstoff, Fixkosten und Wertverlust zusammen — über den Verbrauch hinaus."
  ],
  "Részletes autós számítás": [
    "Detailed car calculation",
    "Ausführliche Autoberechnung"
  ],
  "Két állásajánlat": [
    "Two job offers",
    "Zwei Stellenangebote"
  ],
  "Éves nettó és effektív órabér alapján a magasabb havi fizetés nem mindig jobb.": [
    "Annual net pay and effective hourly pay can show why the higher monthly salary is not always better.",
    "Jahresnetto und effektiver Stundenlohn zeigen, warum ein höheres Monatsgehalt nicht immer besser ist."
  ],
  "Részletes bérszámítás": [
    "Detailed pay calculation",
    "Ausführliche Gehaltsberechnung"
  ],
  "Két megtakarítási út": [
    "Two savings plans",
    "Zwei Sparpläne"
  ],
  "Havi befizetés, hozam és időtáv hatását egyszerre hasonlíthatod össze.": [
    "Compare the effects of monthly contributions, returns and time together.",
    "Vergleiche die Wirkung von Sparrate, Rendite und Laufzeit gemeinsam."
  ],
  "Részletes megtakarítás": [
    "Detailed savings calculation",
    "Ausführliche Sparberechnung"
  ],
  "Mentett összehasonlítások és döntések": [
    "Saved comparisons and decisions",
    "Gespeicherte Vergleiche und Entscheidungen"
  ],
  "A Döntések oldalon mentett összefoglalók is itt jelennek meg. Az adatok kizárólag a böngésződ helyi tárhelyén maradnak.": [
    "Summaries saved on the Decisions page also appear here. Data stays exclusively in your browser's local storage.",
    "Auch Zusammenfassungen der Entscheidungsseite erscheinen hier. Die Daten bleiben ausschließlich im lokalen Browserspeicher."
  ],
  "A/B mód v1": [
    "A/B mode v1",
    "A/B-Modus v1"
  ],
  "Különbség, nem adattenger": [
    "Differences without information overload",
    "Unterschiede ohne Datenflut"
  ],
  "A gyors összehasonlító mód direkt csak a döntés szempontjából fontos különbséget emeli ki. Ha több részlet kell, az eredményből a kapcsolódó kalkulátorhoz léphetsz.": [
    "Quick comparison deliberately highlights differences relevant to the decision. For more detail, follow the result's link to the related calculator.",
    "Der Schnellvergleich hebt gezielt entscheidungsrelevante Unterschiede hervor. Für weitere Details kannst du vom Ergebnis zum passenden Rechner wechseln."
  ],
  "négy működő A/B forgatókönyv;": [
    "four working A/B scenarios;",
    "vier nutzbare A/B-Szenarien;"
  ],
  "különbség automatikus kiemelése;": [
    "differences highlighted automatically;",
    "automatische Hervorhebung der Unterschiede;"
  ],
  "helyi mentés és megosztás;": [
    "local saving and sharing;",
    "lokales Speichern und Teilen;"
  ],
  "mobilon is egymás alá rendezett A/B nézet.": [
    "A/B columns stack vertically on mobile.",
    "untereinander angeordnete A/B-Spalten auf Mobilgeräten."
  ],
  "Összehasonlítás | Kalkulátor Bázis": [
    "Comparison – Kalkulátor Bázis",
    "Vergleich – Kalkulátor Bázis"
  ],
  "Működő A/B összehasonlító mód hitelekhez, autókhoz, állásajánlatokhoz és megtakarítási forgatókönyvekhez a Kalkulátor Bázison.": [
    "A/B comparison for loans, cars, job offers and savings scenarios on Kalkulátor Bázis.",
    "A/B-Vergleich für Kredite, Autos, Stellenangebote und Sparszenarien auf Kalkulátor Bázis."
  ],
  "Két forgatókönyv. Egy döntés. Hitel, autó, munka és megtakarítás A/B módban.": [
    "Two scenarios. One decision. Loans, cars, jobs and savings in A/B mode.",
    "Zwei Szenarien. Eine Entscheidung. Kredit, Auto, Arbeit und Sparen im A/B-Modus."
  ],
  "BMI": [
    "BMI",
    "BMI"
  ],
  "Salary API": [
    "Salary API",
    "Salary API"
  ],
  "Számítás iránya": [
    "Calculation direction",
    "Berechnungsrichtung"
  ],
  "A 9% csak összehasonlító számítás, nem hatályos 2026-os adókulcs.": [
    "The 9% rate is only a comparison scenario, not an applicable Hungarian income tax rate for 2026.",
    "9 % dienen nur als Vergleichsszenario und sind kein geltender ungarischer Einkommensteuersatz für 2026."
  ],
  "Bal oldali hirdetés": [
    "Left-hand advertisement",
    "Linke Werbeanzeige"
  ],
  "Kövess minket Facebookon": [
    "Follow us on Facebook",
    "Folge uns auf Facebook"
  ],
  "Közösségünk": [
    "Our community",
    "Unsere Community"
  ],
  "Kalkulátor Bázis a Facebookon": [
    "Kalkulátor Bázis on Facebook",
    "Kalkulátor Bázis auf Facebook"
  ],
  "Megjelent egy új kalkulátor? Változott egy számítás? Kövesd a Facebook-oldalt, ha ezekről ott szeretnél értesülni.": [
    "A new calculator or a change to a calculation? Follow our Facebook page if you would like to hear about it there.",
    "Ein neuer Rechner oder eine geänderte Berechnung? Folge unserer Facebook-Seite, wenn du dort darüber informiert werden möchtest."
  ],
  "Kalkulátor Bázis Facebook-oldalának megnyitása és követése": [
    "Open and follow Kalkulátor Bázis on Facebook",
    "Kalkulátor Bázis auf Facebook öffnen und folgen"
  ],
  "AI": [
    "AI",
    "KI"
  ],
  "Jobb oldali hirdetés": [
    "Right-hand advertisement",
    "Rechte Werbeanzeige"
  ],
  "Kalkulátor Bázis Salary API": [
    "Kalkulátor Bázis Salary API",
    "Kalkulátor Bázis Salary API"
  ],
  "Hogyan használd az oldalt?": [
    "How to use this site",
    "So nutzt du die Website"
  ],
  "Egy adat változik? Számold újra.": [
    "One input changes? Recalculate.",
    "Eine Angabe ändert sich? Rechne neu."
  ],
  "Egy magasabb üzemanyagár vagy egy másik bruttó bér rögtön más eredményt ad. Próbálj ki több értéket, és nézd meg, mekkora különbséget jelent a saját tervedben.": [
    "A higher fuel price or a different gross salary immediately changes the result. Try several values and see how much they change your plan.",
    "Ein höherer Kraftstoffpreis oder ein anderes Bruttogehalt verändert das Ergebnis sofort. Probiere mehrere Werte aus und prüfe den Unterschied für deinen Plan."
  ],
  "Kérdés": [
    "Question",
    "Frage"
  ],
  "Válaszd ki, mire keresel választ: fizetésre, útiköltségre, anyagigényre vagy más összegre.": [
    "Choose the question you need answered: salary, trip cost, materials or another amount.",
    "Wähle, worauf du eine Antwort suchst: Gehalt, Fahrtkosten, Materialbedarf oder einen anderen Betrag."
  ],
  "Használd a saját adataidat. A liter, a kilométer és az időszak is számít.": [
    "Use your own figures. Litres, kilometres and the period all matter.",
    "Nutze deine eigenen Angaben. Liter, Kilometer und Zeitraum sind wichtig."
  ],
  "Olvasd el az eredmény melletti megjegyzést: ebből derül ki, milyen tételekkel számoltunk.": [
    "Read the note beside the result to see which items were included.",
    "Lies den Hinweis am Ergebnis: Dort steht, welche Posten berücksichtigt wurden."
  ],
  "Döntés": [
    "Decision",
    "Entscheidung"
  ],
  "Nagy összegnél, egészségügyi, jogi vagy műszaki kockázatnál ellenőrizd hivatalos vagy szakmai forrásból is.": [
    "For large sums or health, legal or technical risks, also check official or professional sources.",
    "Prüfe bei hohen Beträgen sowie gesundheitlichen, rechtlichen oder technischen Risiken auch amtliche oder fachliche Quellen."
  ],
  "A számítások háttere:": [
    "Background to the calculations:",
    "Hintergrund der Berechnungen:"
  ],
  "bizalmi elvek": [
    "trust principles",
    "Vertrauensgrundsätze"
  ],
  "számítási módszertan": [
    "calculation methodology",
    "Berechnungsmethodik"
  ],
  "élethelyzetek": [
    "life situations",
    "Lebenssituationen"
  ],
  "Kalkulátor Bázis | Ingyenes online kalkulátorportál magyarul": [
    "Kalkulátor Bázis – free online calculators",
    "Kalkulátor Bázis – kostenlose Online-Rechner"
  ],
  "Ingyenes magyar online kalkulátorportál pénzügyi, autós, építőipari, egészség, átváltó és mindennapi számításokhoz, magyarázatokkal és GYIK-kel.": [
    "Free online calculators originating in Hungarian for finance, cars, building, health, conversions and everyday calculations, with explanations and FAQs.",
    "Kostenlose Online-Rechner mit ungarischer Ausgangssprache für Finanzen, Auto, Bauen, Gesundheit, Umrechnungen und Alltag, mit Erklärungen und häufigen Fragen."
  ],
  "Kalkulátor Bázis – tájékoztató becslés": [
    "Kalkulátor Bázis – estimate for guidance",
    "Kalkulátor Bázis – orientierende Schätzung"
  ],
  "Megosztási felület megnyitva.": [
    "Sharing interface opened.",
    "Teilen-Dialog geöffnet."
  ],
  "Az összefoglalót a vágólapra másoltuk.": [
    "Summary copied to the clipboard.",
    "Zusammenfassung in die Zwischenablage kopiert."
  ],
  "A megosztás nem érhető el ebben a böngészőben.": [
    "Sharing is unavailable in this browser.",
    "Teilen ist in diesem Browser nicht verfügbar."
  ],
  "Összefoglaló elmentve ezen az eszközön.": [
    "Summary saved on this device.",
    "Zusammenfassung auf diesem Gerät gespeichert."
  ],
  "A böngésző nem engedte a helyi mentést.": [
    "The browser did not allow local saving.",
    "Der Browser hat das lokale Speichern nicht zugelassen."
  ],
  "Mentett eredmény": [
    "Saved result",
    "Gespeichertes Ergebnis"
  ],
  "Becsült végösszeg": [
    "Estimated final value",
    "Geschätzter Endwert"
  ],
  "Saját befizetés": [
    "Your contributions",
    "Eigene Einzahlungen"
  ],
  "Becsült hozamrész": [
    "Estimated investment gain",
    "Geschätzter Ertragsanteil"
  ],
  "Mai pénzen": [
    "In today's money",
    "In heutiger Kaufkraft"
  ],
  "A hosszú időtáv miatt a feltételezett hozam már a végeredmény jelentős részét adja. A hozamfeltételezés kis változása is nagy eltérést okozhat.": [
    "Over this long period, assumed returns make up a significant part of the final value. Even a small change in assumed returns can make a large difference.",
    "Über diesen langen Zeitraum macht die angenommene Rendite einen erheblichen Teil des Endwerts aus. Schon eine kleine Änderung der Renditeannahme kann große Unterschiede verursachen."
  ],
  "Ebben az időtávban még főleg a saját befizetésed mozgatja a végeredményt; a havi összeg emelése erős hatású változó.": [
    "Over this period, your own contributions still drive most of the result; increasing the monthly amount has a strong effect.",
    "In diesem Zeitraum bestimmen vor allem eigene Einzahlungen das Ergebnis. Eine höhere monatliche Rate wirkt sich stark aus."
  ],
  "Ez nem hozamígéret. A számítás állandó éves hozammal és inflációval készült, költségek és adózás nélkül.": [
    "This is not a promise of returns. The calculation assumes constant annual returns and inflation, excluding costs and taxes.",
    "Dies ist kein Renditeversprechen. Die Berechnung nimmt konstante jährliche Rendite und Inflation an, ohne Kosten und Steuern."
  ],
  "Részletes ETF kalkulátor →": [
    "Detailed ETF calculator →",
    "Ausführlicher ETF-Rechner →"
  ],
  "Autó éves valós költségképe": [
    "Annual car cost overview",
    "Jährliche Autokosten im Überblick"
  ],
  "Üzemanyag / év": [
    "Fuel / year",
    "Kraftstoff / Jahr"
  ],
  "Teljes éves költség": [
    "Total annual cost",
    "Gesamte Jahreskosten"
  ],
  "Havi átlag": [
    "Monthly average",
    "Monatlicher Durchschnitt"
  ],
  "Költség kilométerenként": [
    "Cost per kilometre",
    "Kosten pro Kilometer"
  ],
  "A megadott adatok alapján az értékvesztés nagyobb tétel, mint az éves üzemanyag. Autócserénél ezért a fogyasztáskülönbség önmagában félrevezető lehet.": [
    "With these inputs, depreciation exceeds annual fuel costs. Comparing fuel consumption alone can therefore mislead when changing cars.",
    "Mit diesen Angaben übersteigt der Wertverlust die jährlichen Kraftstoffkosten. Beim Autowechsel kann der reine Verbrauchsvergleich deshalb irreführen."
  ],
  "A megadott használat mellett az üzemanyag az egyik legerősebb költségtényező; fogyasztás- vagy üzemanyagár-változás érezhetően módosítja az éves összeget.": [
    "For this usage, fuel is a major cost factor; changes in consumption or fuel prices noticeably affect the annual total.",
    "Bei dieser Nutzung gehört Kraftstoff zu den stärksten Kostentreibern. Änderungen bei Verbrauch oder Kraftstoffpreis beeinflussen die Jahressumme deutlich."
  ],
  "A becslés csak a megadott költségekkel számol; finanszírozás, parkolás, váratlan javítás és egyéb egyedi tételek külön kezelendők.": [
    "The estimate includes only the costs entered. Financing, parking, unexpected repairs and other individual costs need separate treatment.",
    "Die Schätzung berücksichtigt nur eingegebene Kosten. Finanzierung, Parken, unerwartete Reparaturen und weitere individuelle Posten sind getrennt zu behandeln."
  ],
  "Részletes autóköltség kalkulátor →": [
    "Detailed car cost calculator →",
    "Ausführlicher Autokostenrechner →"
  ],
  "Adj meg nettó havi jövedelmet is, hogy a törlesztő arányát meg tudjuk mutatni.": [
    "Enter monthly net income too so we can show the repayment-to-income ratio.",
    "Gib auch das monatliche Nettoeinkommen an, damit wir das Verhältnis der Rate zum Einkommen zeigen können."
  ],
  "Lakásvásárlási gyorskép": [
    "Home-buying summary",
    "Kurzüberblick zum Wohnungskauf"
  ],
  "Szükséges hitel": [
    "Loan required",
    "Benötigter Kredit"
  ],
  "Becsült havi törlesztő": [
    "Estimated monthly repayment",
    "Geschätzte Monatsrate"
  ],
  "Saját forrás aránya": [
    "Own-funds share",
    "Eigenmittelanteil"
  ],
  "Becsült teljes visszafizetés": [
    "Estimated total repayment",
    "Geschätzte Gesamtrückzahlung"
  ],
  "Ez tervezési becslés, nem banki hitelbírálat vagy JTM/önerő-jogszabályi megfelelőségi vizsgálat. A konkrét ajánlat díjakat és eltérő feltételeket is tartalmazhat.": [
    "This is a planning estimate, not a bank credit assessment or a check of Hungarian JTM/own-funds legal compliance. An actual offer may include fees and different conditions.",
    "Dies ist eine Planungsschätzung, keine Bankprüfung oder Prüfung ungarischer JTM-/Eigenmittelvorschriften. Ein konkretes Angebot kann Gebühren und andere Bedingungen enthalten."
  ],
  "Részletes hitelkalkulátor →": [
    "Detailed loan calculator →",
    "Ausführlicher Kreditrechner →"
  ],
  "Hitel A/B összehasonlítás": [
    "Loan A/B comparison",
    "Kreditvergleich A/B"
  ],
  "A havi törlesztő": [
    "A monthly repayment",
    "A Monatsrate"
  ],
  "B havi törlesztő": [
    "B monthly repayment",
    "B Monatsrate"
  ],
  "Havi eltérés": [
    "Monthly difference",
    "Monatlicher Unterschied"
  ],
  "Teljes visszafizetés eltérése": [
    "Difference in total repayment",
    "Unterschied der Gesamtrückzahlung"
  ],
  "A két hitel teljes visszafizetése a megadott feltételekkel azonos.": [
    "Both loans have the same total repayment under these assumptions.",
    "Unter diesen Annahmen haben beide Kredite dieselbe Gesamtrückzahlung."
  ],
  "Egyszerű annuitásos becslés, díjak, biztosítások és egyéb banki költségek nélkül.": [
    "Simple annuity estimate, excluding fees, insurance and other bank costs.",
    "Einfache Annuitätenschätzung ohne Gebühren, Versicherungen und andere Bankkosten."
  ],
  "Megtakarítás A/B összehasonlítás": [
    "Savings A/B comparison",
    "Sparvergleich A/B"
  ],
  "A becsült végösszeg": [
    "A estimated final value",
    "A geschätzter Endwert"
  ],
  "B becsült végösszeg": [
    "B estimated final value",
    "B geschätzter Endwert"
  ],
  "Végösszeg eltérése": [
    "Difference in final value",
    "Unterschied im Endwert"
  ],
  "Saját befizetés eltérése": [
    "Difference in contributions",
    "Unterschied der Einzahlungen"
  ],
  "A számítás állandó éves hozammal dolgozik, nem hozamígéret; költségeket és adózást nem modellez.": [
    "The calculation assumes constant annual returns. It is not a return promise and does not model costs or taxes.",
    "Die Berechnung verwendet eine konstante Jahresrendite. Sie ist kein Renditeversprechen und bildet Kosten und Steuern nicht ab."
  ],
  "Autó A/B összehasonlítás": [
    "Car A/B comparison",
    "Autovergleich A/B"
  ],
  "A éves költség": [
    "A annual cost",
    "A Jahreskosten"
  ],
  "B éves költség": [
    "B annual cost",
    "B Jahreskosten"
  ],
  "Éves eltérés": [
    "Annual difference",
    "Jährlicher Unterschied"
  ],
  "A két autó becsült éves költsége azonos.": [
    "The estimated annual costs of both cars are the same.",
    "Die geschätzten Jahreskosten beider Autos sind gleich."
  ],
  "A modell csak a megadott üzemanyag-, fix és értékvesztési költségeket hasonlítja össze.": [
    "The model compares only the fuel, fixed and depreciation costs entered.",
    "Das Modell vergleicht nur die eingegebenen Kraftstoff-, Fix- und Wertverlustkosten."
  ],
  "Állásajánlat A/B összehasonlítás": [
    "Job offer A/B comparison",
    "Stellenangebotsvergleich A/B"
  ],
  "A éves nettó": [
    "A annual net pay",
    "A Jahresnetto"
  ],
  "B éves nettó": [
    "B annual net pay",
    "B Jahresnetto"
  ],
  "Éves nettó eltérés": [
    "Difference in annual net pay",
    "Unterschied im Jahresnetto"
  ],
  "Effektív órabér eltérése": [
    "Difference in effective hourly pay",
    "Unterschied im effektiven Stundenlohn"
  ],
  "A két ajánlat effektív nettó órabére a megadott adatokkal azonos.": [
    "Both offers have the same effective net hourly pay with these inputs.",
    "Mit diesen Angaben haben beide Angebote denselben effektiven Nettostundenlohn."
  ],
  "Itt már nettó havi összegeket hasonlítunk, ezért adó- és kedvezményszabályokat ez a gyors A/B mód nem számol újra.": [
    "This quick A/B mode compares monthly net amounts, so it does not recalculate tax or allowance rules.",
    "Dieser A/B-Kurzmodus vergleicht monatliche Nettobeträge und berechnet daher Steuern und Freibeträge nicht erneut."
  ],
  "Nettó–bruttó kalkulátor →": [
    "Net–gross calculator →",
    "Netto-Brutto-Rechner →"
  ],
  "Kockázatosabb": [
    "Higher risk",
    "Riskanter"
  ],
  "A megadott keretek között kevés a havi vagy készpénzes mozgástér. A vásárlás előtt érdemes az önerőt, a vételárat vagy a havi terheket újratervezni.": [
    "These inputs leave little monthly or cash flexibility. Reconsider own funds, purchase price or monthly commitments before buying.",
    "Diese Angaben lassen wenig monatlichen oder liquiden Spielraum. Plane Eigenmittel, Kaufpreis oder monatliche Belastungen vor dem Kauf neu."
  ],
  "Kényelmesebb": [
    "More comfortable",
    "Entspannter"
  ],
  "A megadott adatok alapján marad havi mozgástér és érdemi tartalék is. A kamatstressz mellett is kezelhetőbbnek látszik a terv.": [
    "These inputs leave monthly flexibility and meaningful reserves. The plan also appears more manageable under the interest-rate stress test.",
    "Diese Angaben lassen monatlichen Spielraum und nennenswerte Rücklagen. Auch unter Zinsstress erscheint der Plan besser tragbar."
  ],
  "Feszes": [
    "Tight",
    "Knapp"
  ],
  "A terv működhet, de a havi keret vagy a tartalék már érzékenyebb. Érdemes külön megnézni a magasabb kamat és a nagyobb önerő hatását.": [
    "The plan may work, but the monthly budget or reserves are more sensitive. Examine higher interest rates and more own funds separately.",
    "Der Plan kann funktionieren, aber Monatsbudget oder Rücklagen sind empfindlicher. Prüfe höhere Zinsen und mehr Eigenmittel gesondert."
  ],
  "Kamat +2 százalékpont": [
    "Interest +2 percentage points",
    "Zins +2 Prozentpunkte"
  ],
  "Rövidebb futamidő": [
    "Shorter term",
    "Kürzere Laufzeit"
  ],
  "Több önerő": [
    "More own funds",
    "Mehr Eigenmittel"
  ],
  "A megadott megtakarításból most nincs plusz önerőre szabad tartalék.": [
    "The savings entered leave no free reserve for additional own funds.",
    "Die eingegebenen Ersparnisse lassen keine freien Rücklagen für zusätzliche Eigenmittel."
  ],
  "Adj meg pozitív ingatlanárat.": [
    "Enter a positive property price.",
    "Gib einen positiven Immobilienpreis an."
  ],
  "Adj meg pozitív havi nettó háztartási jövedelmet.": [
    "Enter positive monthly net household income.",
    "Gib ein positives monatliches Nettohaushaltseinkommen an."
  ],
  "A futamidő 1 és 40 év közé essen.": [
    "The term must be between 1 and 40 years.",
    "Die Laufzeit muss zwischen 1 und 40 Jahren liegen."
  ],
  "A vásárlásra szánt saját forrás nem lehet nagyobb az ingatlan áránál.": [
    "Own funds allocated to the purchase cannot exceed the property price.",
    "Für den Kauf vorgesehene Eigenmittel dürfen den Immobilienpreis nicht übersteigen."
  ],
  "A vásárlásra szánt saját forrás nem lehet nagyobb az összes rendelkezésre álló megtakarításnál.": [
    "Own funds allocated to the purchase cannot exceed total available savings.",
    "Für den Kauf vorgesehene Eigenmittel dürfen die gesamten verfügbaren Ersparnisse nicht übersteigen."
  ],
  "Az önerő + egyszeri költségek meghaladják a megadott megtakarítást.": [
    "Own funds plus one-off costs exceed the savings entered.",
    "Eigenmittel und einmalige Kosten übersteigen die eingegebenen Ersparnisse."
  ],
  "megélhetés + meglévő hitelek + új törlesztő után": [
    "after living costs, existing loans and the new repayment",
    "nach Lebenshaltung, bestehenden Krediten und neuer Rate"
  ],
  "Teljes havi hitelteher aránya": [
    "Total monthly debt-to-income ratio",
    "Gesamte monatliche Kreditbelastungsquote"
  ],
  "meglévő + új hiteltörlesztés / nettó jövedelem": [
    "existing plus new repayments / net income",
    "bestehende und neue Kreditraten / Nettoeinkommen"
  ],
  "Vásárlás után maradó tartalék": [
    "Reserves after purchase",
    "Rücklagen nach dem Kauf"
  ],
  "Becsült finanszírozási többlet": [
    "Estimated financing cost above principal",
    "Geschätzte Finanzierungskosten über dem Kapital"
  ],
  "tőke feletti összeg, egyszerű annuitásos becsléssel": [
    "amount above principal, using a simple annuity estimate",
    "Betrag über dem Kapital nach einfacher Annuitätenschätzung"
  ],
  "+2 százalékpont": [
    "+2 percentage points",
    "+2 Prozentpunkte"
  ],
  "nincs rövidíthető 5 év": [
    "cannot shorten by 5 years",
    "keine Kürzung um 5 Jahre möglich"
  ],
  "−5 év": [
    "−5 years",
    "−5 Jahre"
  ],
  "nincs szabad plusz tartalék": [
    "no additional free reserves",
    "keine zusätzlichen freien Rücklagen"
  ],
  "Lakásvásárlási döntési mód v2": [
    "Home-buying decision mode v2",
    "Entscheidungsmodus Wohnungskauf v2"
  ],
  "Havi törlesztő": [
    "Monthly repayment",
    "Monatsrate"
  ],
  "A lakásvásárlási összefoglalót elmentettük ezen az eszközön.": [
    "Home-buying summary saved on this device.",
    "Zusammenfassung zum Wohnungskauf auf diesem Gerät gespeichert."
  ],
  "Kalkulátor Bázis – tájékoztató tervezési becslés": [
    "Kalkulátor Bázis – planning estimate for guidance",
    "Kalkulátor Bázis – orientierende Planungsschätzung"
  ],
  "Még nincs elmentett döntési vagy összehasonlítási eredmény ezen az eszközön.": [
    "No decision or comparison results have been saved on this device yet.",
    "Auf diesem Gerät sind noch keine Entscheidungs- oder Vergleichsergebnisse gespeichert."
  ],
  "Törlés": [
    "Delete",
    "Löschen"
  ],
  "Döntési összefoglaló": [
    "Decision summary",
    "Entscheidungszusammenfassung"
  ],
  "Mentés ezen az eszközön": [
    "Save on this device",
    "Auf diesem Gerät speichern"
  ],
  "Megosztás": [
    "Share",
    "Teilen"
  ],
  "Munka": [
    "Work",
    "Arbeit"
  ],
  "Megengedhetem magamnak ezt a lakást?": [
    "Can I afford this home?",
    "Kann ich mir diese Wohnung leisten?"
  ],
  "Mi történik, ha…?": [
    "What happens if…?",
    "Was passiert, wenn …?"
  ],
  "Három gyors stresszteszt": [
    "Three quick stress tests",
    "Drei schnelle Stresstests"
  ],
  "Ugyanazt a helyzetet módosítjuk egyetlen változóval, hogy lásd, mi érzékeny a legjobban.": [
    "We change one variable in the same situation to show which has the greatest impact.",
    "Wir ändern eine Variable derselben Situation, damit du die größte Empfindlichkeit erkennst."
  ],
  "Havi szabad keret": [
    "Monthly free budget",
    "Monatlich freies Budget"
  ],
  "Hitelteher": [
    "Loan burden",
    "Kreditbelastung"
  ],
  "Teljes visszafizetés": [
    "Total repayment",
    "Gesamtrückzahlung"
  ],
  "Alaphelyzet": [
    "Base case",
    "Ausgangslage"
  ],
  "Kritikus változók": [
    "Critical variables",
    "Kritische Einflussgrößen"
  ],
  "Mi mozgatja legjobban a havi keretedet?": [
    "What affects your monthly budget most?",
    "Was beeinflusst dein Monatsbudget am stärksten?"
  ],
  "A „kényelmesebb / feszes / kockázatosabb” jelzés belső tervezési heurisztika, nem banki hitelbírálat, nem JTM- vagy HFM-megfelelőségi döntés. A járulékos költségeket te becsülöd meg, a konkrét banki ajánlat díjai és feltételei eltérhetnek.": [
    "The “more comfortable / tight / higher risk” rating is an internal planning heuristic, not a bank credit assessment or a Hungarian JTM/HFM compliance decision. You estimate additional costs; actual bank fees and conditions may differ.",
    "Die Einstufung „entspannter / knapp / riskanter“ ist eine interne Planungsheuristik, keine Bankprüfung oder Entscheidung über ungarische JTM/HFM-Vorgaben. Nebenkosten schätzt du selbst; Bankgebühren und Bedingungen können abweichen."
  ],
  "Önerő kalkulátor": [
    "Own-funds calculator",
    "Eigenmittelrechner"
  ],
  "Részletes törlesztő": [
    "Detailed repayment calculator",
    "Ausführlicher Ratenrechner"
  ],
  "A döntési képhez még javítani kell néhány adatot:": [
    "Some inputs need correcting before we can show the decision overview:",
    "Für den Entscheidungsüberblick müssen noch einige Angaben korrigiert werden:"
  ],
  "Nincs találat. Próbálj másik kifejezést.": [
    "No results. Try another phrase.",
    "Keine Treffer. Versuche einen anderen Suchbegriff."
  ],
  "Σ": [
    "Σ",
    "Σ"
  ],
  "ChatGPT / API": [
    "ChatGPT / API",
    "ChatGPT / API"
  ],
  "Aa": [
    "Aa",
    "Aa"
  ],
  "HU": [
    "HU",
    "HU"
  ],
  "Menü": [
    "Menu",
    "Menü"
  ],
  "Sütibeállítások megnyitása": [
    "Open cookie settings",
    "Cookie-Einstellungen öffnen"
  ],
  "Interaktív döntési útvonalak több kapcsolódó Kalkulátor Bázis eszközzel.": [
    "Interactive decision guides connecting several Kalkulátor Bázis tools.",
    "Interaktive Entscheidungswege mit mehreren verknüpften Werkzeugen von Kalkulátor Bázis."
  ],
  "Kalkulátor Bázis – ingyenes online kalkulátorok érthető összefüggésekben.": [
    "Kalkulátor Bázis – free online calculators with clear connections.",
    "Kalkulátor Bázis – kostenlose Online-Rechner mit verständlichen Zusammenhängen."
  ],
  "Élethelyzetek – Kalkulátor Bázis": [
    "Life situations – Kalkulátor Bázis",
    "Lebenssituationen – Kalkulátor Bázis"
  ],
  "Kalkulátorok és útmutatók gyakori élethelyzetekhez.": [
    "Calculators and guides for common life situations.",
    "Rechner und Wegweiser für häufige Lebenssituationen."
  ],
  "Interaktív A/B összehasonlítás több döntési forgatókönyvhöz.": [
    "Interactive A/B comparison for several decision scenarios.",
    "Interaktiver A/B-Vergleich für mehrere Entscheidungsszenarien."
  ],
  "Élethelyzetek | Kalkulátor Bázis": [
    "Life situations – Kalkulátor Bázis",
    "Lebenssituationen – Kalkulátor Bázis"
  ],
  "Hirdetés": [
    "Advertisement",
    "Anzeige"
  ],
  "hu-HU": [
    "en-GB",
    "de-DE"
  ]
};
 // Explicit templates emitted by decision-tools/home-decision-v2. Captures are
 // restricted to their numeric readouts or A/B identifiers, never user prose.
 const templates=[
 ['{0} Ft/km','{0} HUF/km','{0} HUF/km'],
 ['{0} éves megtakarítási terv','{0}-year savings plan','Sparplan über {0} Jahre'],
 ['{0} éves inflációs feltételezéssel','assuming {0} annual inflation','bei angenommener jährlicher Inflation von {0}'],
 ['{0} Ft/óra','{0} HUF/hour','{0} HUF/Stunde'],
 ['{0} és {1} a megadott fő mutató alapján gyakorlatilag azonos.','{0} and {1} are effectively equal on the main indicator entered.','{0} und {1} sind nach der eingegebenen Hauptkennzahl praktisch gleich.'],
 ['{0} előnye a fő mutatóban {1} a másik forgatókönyvhöz képest.','{0} has an advantage of {1} on the main indicator over the other scenario.','{0} hat bei der Hauptkennzahl einen Vorteil von {1} gegenüber dem anderen Szenario.'],
 ['{0} forgatókönyv becsült teljes visszafizetése alacsonyabb {1} összeggel.','Scenario {0} has an estimated total repayment lower by {1}.','Bei Szenario {0} ist die geschätzte Gesamtrückzahlung um {1} niedriger.'],
 ['{0} forgatókönyv becsült éves költsége alacsonyabb {1} összeggel.','Scenario {0} has estimated annual costs lower by {1}.','Bei Szenario {0} sind die geschätzten Jahreskosten um {1} niedriger.'],
 ['{0} ajánlat effektív nettó órabére magasabb {1} Ft/órával.','Offer {0} has effective net hourly pay higher by {1} HUF/hour.','Angebot {0} hat einen um {1} HUF/Stunde höheren effektiven Nettostundenlohn.'],
 ['{0} havi változás','{0} monthly change','{0} monatliche Änderung'],
 ['{0} éves futamidő','{0}-year term','{0} Jahre Laufzeit'],
 ['Önerő +{0}','Own funds +{0}','Eigenmittel +{0}'],
 ['Hiány: {0}','Shortfall: {0}','Fehlbetrag: {0}'],
 ['{0} hónapnyi teljes havi kiadás','{0} months of total monthly expenses','{0} Monate gesamter monatlicher Ausgaben'],
 ['Kamat {0}%','Interest {0}%','Zins {0}%'],
 ['A becsült törlesztő a megadott nettó jövedelem kb. {0}-a. Tervezési szinten ez több mozgásteret hagyhat más kiadásoknak.','The estimated repayment is about {0} of the net income entered. For planning, this may leave more flexibility for other expenses.','Die geschätzte Rate beträgt etwa {0} des eingegebenen Nettoeinkommens. Für die Planung kann dies mehr Spielraum für andere Ausgaben lassen.'],
 ['A becsült törlesztő a megadott nettó jövedelem kb. {0}-a. Ez már feszesebb havi keretet jelezhet, ezért érdemes vésztartalékkal is számolni.','The estimated repayment is about {0} of the net income entered. This may indicate a tighter monthly budget, so allow for an emergency reserve.','Die geschätzte Rate beträgt etwa {0} des eingegebenen Nettoeinkommens. Dies kann ein knapperes Monatsbudget bedeuten; plane daher auch Notfallrücklagen ein.'],
 ['A becsült törlesztő a megadott nettó jövedelem kb. {0}-a. Ez magas arány, ezért különösen fontos a teljes háztartási költségvetés vizsgálata.','The estimated repayment is about {0} of the net income entered. This is a high share, making a full household budget review especially important.','Die geschätzte Rate beträgt etwa {0} des eingegebenen Nettoeinkommens. Dieser hohe Anteil macht die Prüfung des gesamten Haushaltsbudgets besonders wichtig.']
 ];
 const escapePattern=s=>s.replace(/[.*+?^${}()|[\]\\]/gu,'\\$&');
 const capture='([AB]|[+−-]?[0-9][0-9\\s.,]*(?: ?(?:Ft|HUF|%))?)';
 const compiled=templates.map(([hu,en,de])=>({regex:new RegExp('^'+hu.split(/\{\d+\}/u).map(escapePattern).join(capture)+'$','u'),pair:[en,de]}));
 const normalize=s=>s.replace(/\s+/gu,' ').trim();
 function translate(value,language){
  if(typeof value!=='string'||!['en','de'].includes(language))return null;
  const text=normalize(value),index=language==='en'?0:1;
  if(Object.hasOwn(dictionary,text))return dictionary[text][index];
  for(const {regex,pair}of compiled){const match=regex.exec(text);if(match)return pair[index].replace(/\{(\d+)\}/gu,(_,i)=>match[Number(i)+1]);}
  for(const grade of ['Kockázatosabb','Kényelmesebb','Feszes']){
   if(text.startsWith(grade+': ')){const detail=text.slice(grade.length+2);if(Object.hasOwn(dictionary,detail))return dictionary[grade][index]+': '+dictionary[detail][index];}
  }
  return null;
 }

 return {pages,dictionary,translate,templates};
});

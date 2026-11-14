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
    pages: ["404.html", "adatvedelem.html", "cookie.html", "felhasznalasi-feltetelek.html", "impresszum.html", "jogi-nyilatkozat.html", "plugin-adatvedelem.html", "plugin-felhasznalasi-feltetelek.html", "atlathatosag-es-minoseg.html", "miert-bizhatsz-bennunk.html", "rolunk.html", "szamitasi-modszertan.html", "kapcsolat.html"],
    dictionary: {
  "Keresés kalkulátorok között": [
    "Search calculators",
    "Rechner durchsuchen"
  ],
  "Keresés kalkulátorok között...": [
    "Search calculators...",
    "Rechner suchen..."
  ],
  ".": [
    ".",
    "."
  ],
  "Kapcsolat": [
    "Contact",
    "Kontakt"
  ],
  "Felhasználási feltételek": [
    "Terms of use",
    "Nutzungsbedingungen"
  ],
  "Impresszum": [
    "Legal information",
    "Impressum"
  ],
  "és a": [
    "and the",
    "und dem"
  ],
  "Jogi nyilatkozat": [
    "Legal notice",
    "Rechtlicher Hinweis"
  ],
  "Morzsamenü": [
    "Breadcrumb navigation",
    "Brotkrümelnavigation"
  ],
  "Főoldal": [
    "Home",
    "Startseite"
  ],
  "Számítási módszertan": [
    "Calculation methodology",
    "Berechnungsmethodik"
  ],
  "Utolsó tartalmi frissítés:": [
    "Last content update:",
    "Letzte inhaltliche Aktualisierung:"
  ],
  "2026. július 1.": [
    "1 July 2026",
    "1. Juli 2026"
  ],
  "Egészség": [
    "Health",
    "Gesundheit"
  ],
  "Adatkezelés": [
    "Privacy",
    "Datenschutz"
  ],
  "Átláthatóság és minőség": [
    "Transparency & quality",
    "Transparenz & Qualität"
  ],
  "Pénzügyi kalkulátorok": [
    "Financial calculators",
    "Finanzrechner"
  ],
  "Miért bízhatsz bennünk?": [
    "Why trust us?",
    "Warum uns vertrauen?"
  ],
  "Gyakori kérdések": [
    "Frequently asked questions",
    "Häufige Fragen"
  ],
  "2026. július 15.": [
    "15 July 2026",
    "15. Juli 2026"
  ],
  "Rólunk": [
    "About us",
    "Über uns"
  ],
  "Fontos": [
    "Important",
    "Wichtig"
  ],
  "Képlet": [
    "Formula",
    "Formel"
  ],
  "Jogi nyilatkozat a Kalkulátor Bázis kalkulátorainak és tájékoztató tartalmainak használatához.": [
    "Legal notice for using Kalkulátor Bázis calculators and information.",
    "Rechtliche Hinweise zur Nutzung der Rechner und Informationen von Kalkulátor Bázis."
  ],
  "Ismerd meg a Kalkulátor Bázis célját, üzemeltetőjét és azt, hogyan segít az oldal közérthető, ingyenes online kalkulátorokkal.": [
    "Learn about Kalkulátor Bázis, its operator and its free, understandable online calculators.",
    "Lerne Ziel und Betreiber von Kalkulátor Bázis kennen und erfahre, wie kostenlose, verständliche Online-Rechner helfen."
  ],
  "Hogyan készülnek a Kalkulátor Bázis kalkulátorai? Képletek, források, tesztelés, frissítések, kerekítés és hibabejelentés.": [
    "How Kalkulátor Bázis calculators are built: formulas, sources, testing, updates, rounding and bug reporting.",
    "Wie die Rechner von Kalkulátor Bázis entstehen: Formeln, Quellen, Tests, Aktualisierungen, Rundung und Fehlermeldungen."
  ],
  "Kapcsolat a Kalkulátor Bázis oldalhoz: hibabejelentés, észrevétel, adatkezelési kérdés vagy partneri megkeresés.": [
    "Contact Kalkulátor Bázis for bug reports, feedback, privacy questions or partnership enquiries.",
    "Kontaktiere Kalkulátor Bázis für Fehlermeldungen, Hinweise, Datenschutzfragen oder Partneranfragen."
  ],
  "404 - Az oldal nem található": [
    "404 – Page not found",
    "404 – Seite nicht gefunden"
  ],
  "Lehet, hogy az oldal elköltözött, törölve lett, vagy hibás linkre kattintottál. Keress rá a kalkulátorra, vagy válassz egy kategóriát.": [
    "The page may have moved, been removed, or the link may be incorrect. Search for a calculator or choose a category.",
    "Die Seite wurde möglicherweise verschoben oder entfernt, oder der Link ist fehlerhaft. Suche nach einem Rechner oder wähle eine Kategorie."
  ],
  "Kalkulátor kategóriák": [
    "Calculator categories",
    "Rechnerkategorien"
  ],
  "Merre tovább?": [
    "Where next?",
    "Wie geht es weiter?"
  ],
  "A főoldalon megtalálod az összes pénzügyi, építőipari, egészségügyi, autós, mindennapi és átváltó kalkulátort.": [
    "The homepage brings together financial, construction, health, car, everyday and unit-conversion calculators.",
    "Auf der Startseite findest du alle Finanz-, Bau-, Gesundheits-, Auto-, Alltags- und Einheitenrechner."
  ],
  "Vissza a főoldalra": [
    "Back to the homepage",
    "Zurück zur Startseite"
  ],
  "404 - Az oldal nem található | Kalkulátor Bázis": [
    "404 – Page Not Found · Kalkulátor Bázis",
    "404 – Seite nicht gefunden · Kalkulátor Bázis"
  ],
  "A keresett oldal nem található. Keress kalkulátort vagy térj vissza a Kalkulátor Bázis főoldalára.": [
    "The requested page was not found. Search for a calculator or return to the Kalkulátor Bázis homepage.",
    "Die gesuchte Seite wurde nicht gefunden. Suche nach einem Rechner oder kehre zur Startseite von Kalkulátor Bázis zurück."
  ],
  "Adatvédelmi tájékoztató": [
    "Privacy notice",
    "Datenschutzhinweise"
  ],
  "A Kalkulátor Bázis elkötelezett a személyes adatok védelme mellett. Az oldalon található kalkulátorok és pénzügyi tartalmak használata során kiemelten fontos számunkra az átláthatóság és a biztonság. Ez a tájékoztató összefoglalja, milyen adatokat, milyen célból és meddig kezelünk.": [
    "Kalkulátor Bázis is committed to protecting personal data. Transparency and security are particularly important when using our calculators and financial content. This notice explains what data we process, for what purposes and for how long.",
    "Kalkulátor Bázis setzt sich für den Schutz personenbezogener Daten ein. Bei der Nutzung unserer Rechner und Finanzinhalte sind Transparenz und Sicherheit besonders wichtig. Diese Hinweise erläutern, welche Daten wir zu welchen Zwecken und wie lange verarbeiten."
  ],
  "Adatkezelő adatai": [
    "Controller details",
    "Angaben zum Verantwortlichen"
  ],
  "Név: Kovács Patrik": [
    "Name: Kovács Patrik",
    "Name: Kovács Patrik"
  ],
  "Email:": [
    "Email:",
    "E-Mail:"
  ],
  "kalkulatorbazis@gmail.com": [
    "kalkulatorbazis@gmail.com",
    "kalkulatorbazis@gmail.com"
  ],
  "Ország: Magyarország": [
    "Country: Hungary",
    "Land: Ungarn"
  ],
  "Milyen adatokat kezelünk?": [
    "What data do we process?",
    "Welche Daten verarbeiten wir?"
  ],
  "A kalkulátorok többsége a megadott értékeket kizárólag a látogató böngészőjében dolgozza fel. Egyes, kifejezetten API-t használó funkcióknál a számításhoz szükséges értékek HTTPS-kapcsolaton keresztül a Kalkulátor Bázis API-jához is továbbításra kerülhetnek.": [
    "Most calculators process input values exclusively in the visitor’s browser. Certain features specifically using an API may also transmit the values needed for calculation to the Kalkulátor Bázis API over HTTPS.",
    "Die meisten Rechner verarbeiten Eingaben ausschließlich im Browser des Besuchers. Bei bestimmten ausdrücklich API-gestützten Funktionen können die für die Berechnung nötigen Werte auch per HTTPS an die Kalkulátor-Bázis-API übermittelt werden."
  ],
  "a helyben működő kalkulátorok mezőértékei nem hagyják el a böngészőt": [
    "input values in locally running calculators do not leave the browser",
    "Eingaben in lokal ausgeführten Rechnern verlassen den Browser nicht"
  ],
  "API-hívásnál csak a számításhoz szükséges adatokat továbbítjuk": [
    "API requests transmit only the data needed for the calculation",
    "API-Anfragen übertragen nur die für die Berechnung nötigen Daten"
  ],
  "a Kalkulátor Bázis API alkalmazásnaplói szándékosan nem rögzítik a kalkulátor request body-k tartalmát": [
    "Kalkulátor Bázis API application logs deliberately do not record calculator request-body contents",
    "Die Anwendungsprotokolle der Kalkulátor-Bázis-API erfassen bewusst keine Inhalte der Rechner-Anfragekörper"
  ],
  "a kalkulátoradatokat nem használjuk profilalkotásra vagy hirdetési célra": [
    "calculator data are not used for profiling or advertising",
    "Rechnerdaten werden nicht für Profilbildung oder Werbung verwendet"
  ],
  "A nettó–bruttó kalkulátor a böngészőben futó azonnali számítás mellett a Kalkulátor Bázis API-ját is használja. A megadott bérösszeg, a számítás iránya, valamint a kalkulátorban kiválasztott kedvezményparaméterek a számítás elvégzéséhez HTTPS-kapcsolaton keresztül az API-hoz kerülnek. Ha az API nem érhető el vagy nem válaszol időben, a böngészőben futó tartalék számítás marad látható.": [
    "Alongside its immediate browser-based calculation, the net–gross salary calculator also uses the Kalkulátor Bázis API. The entered salary, calculation direction and selected allowance parameters are sent to the API over HTTPS to perform the calculation. If the API is unavailable or does not respond in time, the browser-based fallback calculation remains visible.",
    "Der Netto-Brutto-Rechner nutzt neben der sofortigen Browserberechnung auch die Kalkulátor-Bázis-API. Der eingegebene Lohn, die Berechnungsrichtung und die ausgewählten Freibetragsparameter werden zur Berechnung per HTTPS an die API gesendet. Ist die API nicht erreichbar oder antwortet sie nicht rechtzeitig, bleibt die Ersatzberechnung im Browser sichtbar."
  ],
  "A tárhely kiszolgálásakor a szolgáltató technikailag szükséges kapcsolati adatokat (például IP-címet, időpontot és böngészőazonosítót) kezelhet a biztonságos működés és a visszaélések megelőzése érdekében.": [
    "When serving the website, the hosting provider may process technically necessary connection data, such as IP address, time and browser identifier, to ensure secure operation and prevent abuse.",
    "Bei der Bereitstellung der Website kann der Hostinganbieter technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt und Browserkennung verarbeiten, um einen sicheren Betrieb zu gewährleisten und Missbrauch zu verhindern."
  ],
  "Kalkulátor API és technikai naplók": [
    "Calculator API and technical logs",
    "Rechner-API und technische Protokolle"
  ],
  "Az API-infrastruktúrát a Render Services, Inc. biztosítja. Az API használatakor a szolgáltató a kapcsolat kiszolgálásához szükséges technikai adatokat, például IP-címet, időpontot, kért útvonalat, HTTP-metódust és válaszkódot kezelhet. A Kalkulátor Bázis API nem hoz létre felhasználói profilt, és a kalkulátorok request body-ját nem naplózzuk alkalmazásszinten.": [
    "Render Services, Inc. provides the API infrastructure. When the API is used, the provider may process connection-related technical data such as IP address, time, requested path, HTTP method and response code. The Kalkulátor Bázis API does not create user profiles, and we do not log calculator request bodies at application level.",
    "Render Services, Inc. stellt die API-Infrastruktur bereit. Bei API-Nutzung kann der Anbieter technische Verbindungsdaten wie IP-Adresse, Zeitpunkt, angeforderten Pfad, HTTP-Methode und Antwortcode verarbeiten. Die Kalkulátor-Bázis-API erstellt keine Nutzerprofile; Rechner-Anfragekörper werden auf Anwendungsebene nicht protokolliert."
  ],
  "A Render technikai logjainak megőrzése a használt csomagtól függ; a jelenlegi Hobby munkaterületen a szolgáltató dokumentációja szerint a naplók legfeljebb 7 napig érhetők el. A szolgáltató adatfeldolgozási feltételei és nemzetközi adattovábbítási garanciái a Render saját adatvédelmi dokumentumaiban találhatók.": [
    "Retention of Render’s technical logs depends on the plan. According to the provider’s documentation, logs on the current Hobby workspace are available for up to 7 days. Render’s processing terms and safeguards for international transfers are set out in its own privacy documentation.",
    "Die Aufbewahrung technischer Render-Protokolle hängt vom Tarif ab. Laut Anbieterdokumentation sind Protokolle im derzeitigen Hobby-Arbeitsbereich bis zu 7 Tage verfügbar. Auftragsverarbeitungsbedingungen und Garantien für internationale Übermittlungen stehen in den eigenen Datenschutzunterlagen von Render."
  ],
  "A Google Analytics és Google Ads mérési címkéit csak a saját sütibeállításokban adott megfelelő hozzájárulás után töltjük be. Az AdSense-kód az erre kijelölt oldalakon a Google hozzájárulási üzenetének megjelenítéséhez már a döntés előtt betöltődhet; a hirdetési kérések a Google hozzájárulási állapotának rendezéséig szünetelnek. Az Európai Gazdasági Térségben, az Egyesült Királyságban és Svájcban az AdSense-hirdetésekhez tartozó választásokat a Google által tanúsított hozzájárulás-kezelő felület kezeli.": [
    "Google Analytics and Google Ads measurement tags load only after the relevant consent is given in our cookie settings. On designated pages, AdSense code may load before a decision to display Google’s consent message; ad requests remain paused until Google’s consent state is resolved. In the EEA, the UK and Switzerland, a Google-certified consent interface manages choices relating to AdSense ads.",
    "Mess-Tags von Google Analytics und Google Ads werden erst nach der entsprechenden Einwilligung in unseren Cookie-Einstellungen geladen. Auf vorgesehenen Seiten kann AdSense-Code schon vor der Entscheidung laden, um Googles Einwilligungsnachricht anzuzeigen; Anzeigenanfragen bleiben bis zur Klärung des Google-Einwilligungsstatus pausiert. Im EWR, Vereinigten Königreich und in der Schweiz verwaltet eine Google-zertifizierte Oberfläche die Entscheidungen zu AdSense-Anzeigen."
  ],
  "Analitikai hozzájárulás esetén a weboldal látogatása során technikai jellegű, statisztikai célú adatok kerülhetnek rögzítésre:": [
    "With analytics consent, technical data for statistical purposes may be recorded during visits:",
    "Bei erteilter Analyse-Einwilligung können beim Besuch technische Daten zu statistischen Zwecken erfasst werden:"
  ],
  "eszköz- és böngészőadatok": [
    "device and browser information",
    "Geräte- und Browserdaten"
  ],
  "megtekintett oldalak és események": [
    "pages viewed and events",
    "aufgerufene Seiten und Ereignisse"
  ],
  "hozzávetőleges földrajzi és kapcsolati adatok": [
    "approximate location and connection data",
    "ungefähre Standort- und Verbindungsdaten"
  ],
  "Adatkezelés célja": [
    "Purposes of processing",
    "Zwecke der Verarbeitung"
  ],
  "a weboldal működésének biztosítása": [
    "providing website functionality",
    "Bereitstellung der Website-Funktionen"
  ],
  "a kalkulátorok és az API-alapú számítások működtetése és minőségbiztosítása": [
    "operating and assuring the quality of calculators and API-based calculations",
    "Betrieb und Qualitätssicherung der Rechner und API-gestützten Berechnungen"
  ],
  "a felhasználói élmény javítása": [
    "improving the user experience",
    "Verbesserung der Nutzererfahrung"
  ],
  "látogatottsági statisztikák készítése": [
    "compiling visitor statistics",
    "Erstellung von Besuchsstatistiken"
  ],
  "hirdetések megjelenítése és teljesítményük mérése a látogató választásai szerint": [
    "displaying ads and measuring their performance according to visitors’ choices",
    "Anzeige von Werbung und Leistungsmessung entsprechend den Entscheidungen der Besucher"
  ],
  "hirdetési és partneri konverziók mérése a hozzájárulási állapot szerint": [
    "measuring advertising and affiliate conversions according to consent status",
    "Messung von Werbe- und Partner-Conversions entsprechend dem Einwilligungsstatus"
  ],
  "kérdések és hibabejelentések megválaszolása, kivizsgálása": [
    "answering and investigating questions and bug reports",
    "Beantwortung und Untersuchung von Fragen und Fehlermeldungen"
  ],
  "Adatkezelés jogalapja": [
    "Legal bases for processing",
    "Rechtsgrundlagen der Verarbeitung"
  ],
  "Szükséges technikai működés és biztonság:": [
    "Necessary technical operation and security:",
    "Notwendiger technischer Betrieb und Sicherheit:"
  ],
  "az adatkezelő jogos érdeke a szolgáltatás biztonságos és megbízható működtetése (GDPR 6. cikk (1) f)).": [
    "the controller’s legitimate interest in operating a secure and reliable service (GDPR Article 6(1)(f)).",
    "Das berechtigte Interesse des Verantwortlichen am sicheren und zuverlässigen Betrieb des Dienstes (Art. 6 Abs. 1 Buchst. f DSGVO)."
  ],
  "API-alapú kalkuláció és minőségbiztosítás:": [
    "API-based calculations and quality assurance:",
    "API-gestützte Berechnungen und Qualitätssicherung:"
  ],
  "az adatkezelő jogos érdeke a kalkulátor-szolgáltatás működtetése, valamint a számítások pontosságának és megbízhatóságának biztosítása; ezt adatminimalizálással és profilalkotás nélkül végezzük (GDPR 6. cikk (1) f)).": [
    "the controller’s legitimate interest in providing the calculator service and ensuring accurate, reliable calculations, with data minimisation and without profiling (GDPR Article 6(1)(f)).",
    "Das berechtigte Interesse des Verantwortlichen am Betrieb des Rechnerdienstes sowie an genauen und zuverlässigen Berechnungen, unter Datenminimierung und ohne Profilbildung (Art. 6 Abs. 1 Buchst. f DSGVO)."
  ],
  "Analitika, hirdetés és marketing:": [
    "Analytics, advertising and marketing:",
    "Analyse, Werbung und Marketing:"
  ],
  "a hozzájáruláshoz kötött analitikai és marketingcélú adatkezelés jogalapja a látogató hozzájárulása (GDPR 6. cikk (1) a)). A saját mérési és partneri eszközökről a webhely sütibeállításaiban, az AdSense hirdetési célú adatkezeléséről a Google hozzájárulási felületén lehet dönteni.": [
    "consent-based analytics and marketing processing relies on the visitor’s consent (GDPR Article 6(1)(a)). Website cookie settings govern our measurement and affiliate tools; Google’s consent interface governs AdSense advertising processing.",
    "Einwilligungspflichtige Analyse- und Marketingverarbeitung beruht auf der Einwilligung des Besuchers (Art. 6 Abs. 1 Buchst. a DSGVO). Über unsere Mess- und Partnerwerkzeuge wird in den Cookie-Einstellungen entschieden; über die Werbeverarbeitung von AdSense in Googles Einwilligungsoberfläche."
  ],
  "Segítség- és hibabejelentés:": [
    "Help and bug reports:",
    "Hilfe- und Fehlermeldungen:"
  ],
  "a beküldés előtt adott hozzájárulás (GDPR 6. cikk (1) a)).": [
    "consent given before submission (GDPR Article 6(1)(a)).",
    "Die vor dem Absenden erteilte Einwilligung (Art. 6 Abs. 1 Buchst. a DSGVO)."
  ],
  "A jogos érdeken alapuló adatkezelés ellen a látogató a lent megadott elérhetőségen tiltakozhat. Az adatkezelő az ilyen adatkezeléseknél a cél szükségességét, az érintetti hatást és az alkalmazott garanciákat rendszeresen felülvizsgálja.": [
    "Visitors may object to processing based on legitimate interests using the contact details below. For such processing, the controller regularly reviews the necessity of the purpose, impact on individuals and safeguards applied.",
    "Besucher können der Verarbeitung aufgrund berechtigter Interessen über die unten genannte Kontaktadresse widersprechen. Der Verantwortliche prüft dabei regelmäßig die Erforderlichkeit des Zwecks, Auswirkungen auf Betroffene und angewandte Schutzmaßnahmen."
  ],
  "Cookie-k (sütik)": [
    "Cookies",
    "Cookies"
  ],
  "A weboldal a működéshez helyi böngészőtárolást használ. A saját analitikai és marketingcímkék alapértelmezés szerint tiltottak, és csak a megfelelő hozzájárulás után töltődnek be. Az AdSense külön Google-üzenetet használ: a kód a hozzájárulási felület indításához betöltődhet, miközben a hirdetési kérések a döntés rendezéséig szünetelnek.": [
    "The website uses local browser storage for its operation. Our analytics and marketing tags are blocked by default and load only after the relevant consent. AdSense uses a separate Google message: its code may load to open the consent interface while ad requests remain paused until the decision is resolved.",
    "Die Website verwendet lokalen Browserspeicher für ihren Betrieb. Unsere Analyse- und Marketing-Tags sind standardmäßig gesperrt und werden erst nach entsprechender Einwilligung geladen. AdSense verwendet eine separate Google-Nachricht: Der Code kann die Einwilligungsoberfläche laden, während Anzeigenanfragen bis zur Klärung der Entscheidung pausieren."
  ],
  ": verziózott hozzájárulási döntés, legfeljebb 180 napig": [
    ": versioned consent decision, for up to 180 days",
    ": versionierte Einwilligungsentscheidung, höchstens 180 Tage"
  ],
  ": világos vagy sötét téma beállítása, a módosításig vagy a helyi tárhely törléséig": [
    ": light or dark theme preference, until changed or local storage is cleared",
    ": Einstellung für helles oder dunkles Design, bis zur Änderung oder Löschung des lokalen Speichers"
  ],
  "Google Analytics: analitikai sütik és teljes mérés csak analitikai hozzájárulás után": [
    "Google Analytics: analytics cookies and full measurement only after analytics consent",
    "Google Analytics: Analyse-Cookies und vollständige Messung erst nach Analyse-Einwilligung"
  ],
  "Google Ads mérési címke és partneri kreatívok: csak a saját marketing-hozzájárulás után": [
    "Google Ads measurement tag and affiliate creatives: only after our marketing consent",
    "Google-Ads-Mess-Tag und Partner-Werbemittel: erst nach unserer Marketing-Einwilligung"
  ],
  "Google AdSense: a Google külön hozzájárulási felülete alapján, az arra kijelölt oldalakon": [
    "Google AdSense: on designated pages, based on Google’s separate consent interface",
    "Google AdSense: auf vorgesehenen Seiten gemäß Googles separater Einwilligungsoberfläche"
  ],
  "A saját analitikai és marketingválasztások a láblécben található Sütibeállítások gombbal bármikor módosíthatók vagy visszavonhatók. Az AdSense-választás a hirdetést megjelenítő oldalakon a Google által biztosított Adatvédelmi és sütibeállítások hivatkozással nyitható meg újra. Részletek a": [
    "Our analytics and marketing choices can be changed or withdrawn at any time using Cookie settings in the footer. On pages displaying ads, AdSense choices can be reopened using Google’s Privacy and cookie settings link. Details are in the",
    "Unsere Analyse- und Marketingentscheidungen können jederzeit über Cookie-Einstellungen im Footer geändert oder widerrufen werden. Auf Seiten mit Anzeigen lassen sich AdSense-Entscheidungen über Googles Link Datenschutz- und Cookie-Einstellungen erneut öffnen. Einzelheiten stehen in den"
  ],
  "süti tájékoztatóban": [
    "cookie notice",
    "Cookie-Hinweisen"
  ],
  "Harmadik fél szolgáltatások": [
    "Third-party services",
    "Dienste Dritter"
  ],
  "Cloudflare, Inc. / Cloudflare Pages (a weboldal tárhelyszolgáltatása és hálózati kiszolgálása)": [
    "Cloudflare, Inc. / Cloudflare Pages (website hosting and network delivery)",
    "Cloudflare, Inc. / Cloudflare Pages (Website-Hosting und Netzwerkauslieferung)"
  ],
  "Render Services, Inc. (a Kalkulátor Bázis API infrastruktúrája)": [
    "Render Services, Inc. (Kalkulátor Bázis API infrastructure)",
    "Render Services, Inc. (Infrastruktur der Kalkulátor-Bázis-API)"
  ],
  "Google Analytics (látogatottság mérés)": [
    "Google Analytics (visitor measurement)",
    "Google Analytics (Besuchsmessung)"
  ],
  "Google AdSense (hirdetésmegjelenítés)": [
    "Google AdSense (ad display)",
    "Google AdSense (Anzeigenauslieferung)"
  ],
  "Google Ads (konverziómérés)": [
    "Google Ads (conversion measurement)",
    "Google Ads (Conversion-Messung)"
  ],
  "Formspree (segítség- és hibabejelentések továbbítása)": [
    "Formspree (forwarding help and bug reports)",
    "Formspree (Weiterleitung von Hilfe- und Fehlermeldungen)"
  ],
  "Wise partnerlinkek és partneri kreatívok": [
    "Wise affiliate links and affiliate creatives",
    "Wise-Partnerlinks und Partner-Werbemittel"
  ],
  "A Google és más, a Google hozzájárulási felületén felsorolt hirdetési partnerek sütiket vagy más azonosítókat használhatnak hirdetések megjelenítésére és mérésére, illetve a látogató választásától függően korábbi látogatások alapján történő személyre szabásra. A nem személyre szabott hirdetések is használhatnak sütiket például gyakoriságkorlátozásra és összesített jelentésekhez. Arról, hogy a Google hogyan kezeli a partneroldalakon gyűjtött adatokat,": [
    "Google and other advertising partners listed in its consent interface may use cookies or other identifiers to display and measure ads and, depending on the visitor’s choice, personalise them based on previous visits. Non-personalised ads may also use cookies, for example for frequency capping and aggregate reporting. To learn how Google handles data collected on partner sites, see",
    "Google und weitere in der Einwilligungsoberfläche aufgeführte Werbepartner können Cookies oder andere Kennungen zur Anzeige und Messung von Werbung sowie je nach Besucherentscheidung zur Personalisierung anhand früherer Besuche einsetzen. Auch nicht personalisierte Anzeigen können Cookies nutzen, etwa zur Häufigkeitsbegrenzung und für zusammengefasste Berichte. Wie Google auf Partnerseiten erfasste Daten verarbeitet, erläutern die"
  ],
  "a Google tájékoztatójában": [
    "Google’s information",
    "Informationen von Google"
  ],
  "olvashatsz. A személyre szabott Google-hirdetéseket a": [
    ". You can also control personalised Google ads in",
    ". Personalisierte Google-Werbung kannst du auch im"
  ],
  "Google Hirdetésközpontban": [
    "Google My Ad Center",
    "Google My Ad Center"
  ],
  "is szabályozhatod.": [
    ".",
    "steuern."
  ],
  "Egyes szolgáltatók az Európai Gazdasági Térségen kívül is kezelhetnek adatokat. Ilyenkor a szolgáltató által alkalmazott, jogszabályban elfogadott adattovábbítási garanciák irányadók. További részletek a szolgáltatók saját adatvédelmi tájékoztatóiban olvashatók.": [
    "Some providers may process data outside the EEA. In such cases, legally recognised transfer safeguards used by the provider apply. Further details are in providers’ own privacy notices.",
    "Einige Anbieter können Daten außerhalb des EWR verarbeiten. In diesem Fall gelten die vom Anbieter verwendeten gesetzlich anerkannten Übermittlungsgarantien. Weitere Einzelheiten stehen in den Datenschutzhinweisen der Anbieter."
  ],
  "Ajánlói (affiliate) linkek": [
    "Affiliate links",
    "Partnerlinks (Affiliate-Links)"
  ],
  "Az oldalon található egyes hivatkozások ajánlói (affiliate) linkek lehetnek.": [
    "Some links on the website may be affiliate links.",
    "Einige Links auf der Website können Partnerlinks (Affiliate-Links) sein."
  ],
  "Ez azt jelenti, hogy ha a felhasználó ilyen linken keresztül regisztrál vagy szolgáltatást vesz igénybe, az oldal üzemeltetője jutalékban részesülhet.": [
    "If a user registers or uses a service through such a link, the website operator may receive a commission.",
    "Wenn ein Nutzer sich über einen solchen Link registriert oder einen Dienst nutzt, kann der Websitebetreiber eine Provision erhalten."
  ],
  "Ez a felhasználó számára nem jelent többletköltséget.": [
    "This does not add any cost for the user.",
    "Für den Nutzer entstehen dadurch keine zusätzlichen Kosten."
  ],
  "Segítség- és hibabejelentő rendszer": [
    "Help and bug-reporting system",
    "Hilfe- und Fehlermeldesystem"
  ],
  "A jobb alsó sarokban elérhető segítség- és hibabejelentő felület használatakor a felhasználó által megadott leírás, az elvárt működés és megadott adatok leírása, az opcionális e-mail-cím, valamint az aktuális oldal címe és URL-je, a hivatkozó oldal, az IP-cím, a böngésző és eszköz alapvető technikai adatai, a nyelv, a képernyő- és nézetméret, a beküldés időpontja és az oldalon eltelt idő továbbításra kerülhet.": [
    "When using the help and bug-report interface in the bottom-right corner, the submitted description, description of expected behaviour and input data, optional email address, current page title and URL, referring page, IP address, basic browser and device data, language, screen and viewport size, submission time and time spent on the page may be transmitted.",
    "Bei Nutzung der Hilfe- und Fehleroberfläche rechts unten können die eingegebene Beschreibung, die Beschreibung des erwarteten Verhaltens und der Eingaben, die optionale E-Mail-Adresse sowie Seitentitel und URL, verweisende Seite, IP-Adresse, grundlegende Browser- und Gerätedaten, Sprache, Bildschirm- und Ansichtsgröße, Absendezeit und Aufenthaltsdauer übermittelt werden."
  ],
  "Az adatkezelés célja a kérdések megválaszolása, a hibák kivizsgálása és a weboldal fejlesztése. A beküldés a Formspree szolgáltatáson keresztül történik, amely a bejelentést továbbítja az adatkezelő részére. Az adatkezelés jogalapja a beküldés előtt adott, bármikor visszavonható hozzájárulás. Kérjük, a bejelentésben ne adj meg érzékeny személyes, egészségügyi, banki vagy belépési adatot. A Formspree saját tájékoztatója a": [
    "Processing is for answering questions, investigating faults and improving the website. Reports are submitted through Formspree, which forwards them to the controller. Processing relies on consent given before submission, which can be withdrawn at any time. Please do not include sensitive personal, health, banking or login data. Formspree’s own notice is available on its",
    "Die Verarbeitung dient der Beantwortung von Fragen, Untersuchung von Fehlern und Verbesserung der Website. Meldungen werden über Formspree an den Verantwortlichen weitergeleitet. Rechtsgrundlage ist die vor dem Absenden erteilte, jederzeit widerrufliche Einwilligung. Bitte übermittle keine sensiblen persönlichen Daten, Gesundheits-, Bank- oder Zugangsdaten. Die eigenen Hinweise von Formspree stehen auf der"
  ],
  "Formspree adatvédelmi oldalán": [
    "Formspree privacy page",
    "Datenschutzseite von Formspree"
  ],
  "érhető el.": [
    ".",
    "zur Verfügung."
  ],
  "A megadott adatokat a bejelentés lezárásáig, de legfeljebb a beküldéstől számított 12 hónapig kezeljük, kivéve, ha jogi igény érvényesítése indokolja a hosszabb megőrzést. A hozzájárulás visszavonása és törlési kérés a": [
    "We process submitted data until the report is closed, for no more than 12 months after submission, unless legal claims justify longer retention. Consent withdrawal and deletion requests can be sent to",
    "Wir verarbeiten die Angaben bis zum Abschluss der Meldung, höchstens jedoch 12 Monate ab Eingang, sofern Rechtsansprüche keine längere Aufbewahrung rechtfertigen. Widerrufs- und Löschanfragen können an"
  ],
  "címen küldhető. A hozzájárulás visszavonása nem érinti a korábbi adatkezelés jogszerűségét.": [
    ". Withdrawing consent does not affect the lawfulness of earlier processing.",
    "gesendet werden. Der Widerruf berührt nicht die Rechtmäßigkeit früherer Verarbeitung."
  ],
  "Felhasználói jogok": [
    "User rights",
    "Betroffenenrechte"
  ],
  "hozzáférés és tájékoztatás kérése a kezelt adatokról": [
    "request access to and information about processed data",
    "Auskunft und Informationen über verarbeitete Daten verlangen"
  ],
  "a pontatlan adatok helyesbítésének kérése": [
    "request correction of inaccurate data",
    "Berichtigung unrichtiger Daten verlangen"
  ],
  "az adatok törlésének vagy kezelésük korlátozásának kérése": [
    "request erasure or restriction of processing",
    "Löschung oder Einschränkung der Verarbeitung verlangen"
  ],
  "hozzájárulás visszavonása": [
    "withdraw consent",
    "Einwilligung widerrufen"
  ],
  "adathordozhatóság kérése, ha annak jogszabályi feltételei fennállnak": [
    "request data portability where legal requirements are met",
    "Datenübertragbarkeit verlangen, sofern die gesetzlichen Voraussetzungen erfüllt sind"
  ],
  "tiltakozás a jogos érdeken alapuló adatkezelés ellen": [
    "object to processing based on legitimate interests",
    "Der Verarbeitung aufgrund berechtigter Interessen widersprechen"
  ],
  "A kérelmeket indokolatlan késedelem nélkül, főszabály szerint egy hónapon belül megválaszoljuk. Jogorvoslatért bírósághoz, illetve a": [
    "We respond without undue delay, normally within one month. For remedies, you may contact a court or the",
    "Wir antworten unverzüglich, grundsätzlich innerhalb eines Monats. Für Rechtsbehelfe kannst du dich an ein Gericht oder die"
  ],
  "Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH)": [
    "Hungarian National Authority for Data Protection and Freedom of Information (NAIH)",
    "Ungarische Nationale Behörde für Datenschutz und Informationsfreiheit (NAIH)"
  ],
  "lehet fordulni.": [
    ".",
    "wenden."
  ],
  "Amennyiben kérdésed van az adatkezeléssel kapcsolatban, az alábbi e-mail címen veheted fel a kapcsolatot:": [
    "For questions about data processing, contact us at the following email address:",
    "Bei Fragen zur Datenverarbeitung erreichst du uns unter folgender E-Mail-Adresse:"
  ],
  "Utolsó frissítés: 2026.10.17.": [
    "Last updated: 17 October 2026.",
    "Zuletzt aktualisiert: 17. Oktober 2026."
  ],
  "Adatvédelmi olvasási térkép": [
    "Privacy reading guide",
    "Lesehilfe zum Datenschutz"
  ],
  "Három kérdésből gyorsabban megtalálod, melyik rész vonatkozik rád": [
    "Find the relevant section more quickly with three questions",
    "Finde den passenden Abschnitt schneller anhand von drei Fragen"
  ],
  "Mit adok meg?": [
    "What am I providing?",
    "Was gebe ich an?"
  ],
  "Kalkulátormező, kapcsolatfelvételi adat, sütibe kerülő technikai információ vagy analitikai esemény?": [
    "Calculator inputs, contact details, technical cookie information or an analytics event?",
    "Rechnereingaben, Kontaktdaten, technische Cookie-Informationen oder ein Analyseereignis?"
  ],
  "Hol történik?": [
    "Where does it happen?",
    "Wo geschieht es?"
  ],
  "A böngészőben helyben, a webhely kiszolgálásakor vagy külső szolgáltatás bevonásával?": [
    "Locally in the browser, while serving the website, or through an external service?",
    "Lokal im Browser, beim Bereitstellen der Website oder unter Einbeziehung eines externen Dienstes?"
  ],
  "Miért szükséges?": [
    "Why is it needed?",
    "Wozu ist es nötig?"
  ],
  "Alapműködés, biztonság, mérés, hozzájáruláshoz kötött funkció vagy kapcsolatfelvétel?": [
    "Basic operation, security, measurement, consent-based features or contacting us?",
    "Grundbetrieb, Sicherheit, Messung, einwilligungspflichtige Funktionen oder Kontaktaufnahme?"
  ],
  "Meddig és hogyan?": [
    "For how long and how?",
    "Wie lange und auf welche Weise?"
  ],
  "A részletes megőrzési, hozzájárulási és érintetti szabályt a tájékoztató megfelelő pontja tartalmazza.": [
    "The relevant section of the notice provides the detailed retention, consent and data-subject rules.",
    "Die Einzelheiten zu Aufbewahrung, Einwilligung und Betroffenenrechten stehen im jeweiligen Abschnitt dieser Hinweise."
  ],
  "Ez a blokk navigációs segítség; jogi tartalmat nem ír felül. A részletes adatkezelési feltételek mindig ezen oldal fő szövegében irányadók.": [
    "This block aids navigation and does not override legal content. The detailed processing terms in the main text of this page remain authoritative.",
    "Dieser Block dient der Orientierung und überschreibt keine rechtlichen Inhalte. Maßgeblich bleiben die ausführlichen Verarbeitungsbedingungen im Haupttext dieser Seite."
  ],
  "A Kalkulátor Bázis adatkezelési tájékoztatója a kezelt adatokról, sütikről, külső szolgáltatókról és látogatói jogokról.": [
    "Kalkulátor Bázis privacy notice covering processed data, cookies, external providers and visitor rights.",
    "Datenschutzhinweise von Kalkulátor Bázis zu verarbeiteten Daten, Cookies, externen Anbietern und Besucherrechten."
  ],
  "Süti (Cookie) tájékoztató": [
    "Cookie notice",
    "Cookie-Hinweise"
  ],
  "A Kalkulátor Bázis a weboldal működéséhez helyi böngészőtárolást használ. A saját sütibeállítások a Google Analytics és Google Ads mérési címkéit, valamint a partneri tartalmakat kezelik. A Google AdSense hirdetési hozzájárulását az érintett régiókban külön, Google által tanúsított hozzájárulási felület kezeli.": [
    "Kalkulátor Bázis uses local browser storage for website operation. Our cookie settings manage Google Analytics and Google Ads measurement tags and affiliate content. In relevant regions, a separate Google-certified consent interface manages Google AdSense advertising consent.",
    "Kalkulátor Bázis verwendet lokalen Browserspeicher für den Websitebetrieb. Unsere Cookie-Einstellungen verwalten Mess-Tags von Google Analytics und Google Ads sowie Partnerinhalte. Die Werbeeinwilligung für Google AdSense wird in den betroffenen Regionen über eine separate Google-zertifizierte Oberfläche verwaltet."
  ],
  "Mik azok a sütik?": [
    "What are cookies?",
    "Was sind Cookies?"
  ],
  "A sütik (cookie-k) és a helyi tárolási megoldások olyan böngészőben tárolt adatok, amelyekkel egy weboldal megjegyezhet bizonyos beállításokat. Ezen az oldalon a hozzájárulási döntés a": [
    "Cookies and local storage store data in the browser so websites can remember settings. On this website, the consent decision is stored under the",
    "Cookies und lokale Speicherlösungen speichern Daten im Browser, damit Websites Einstellungen merken können. Auf dieser Website wird die Einwilligungsentscheidung unter dem"
  ],
  "localStorage kulcs alatt tárolódik.": [
    "localStorage key.",
    "localStorage-Schlüssel gespeichert."
  ],
  "Milyen sütiket használunk?": [
    "Which cookies do we use?",
    "Welche Cookies verwenden wir?"
  ],
  "Szükséges működés:": [
    "Necessary operation:",
    "Notwendiger Betrieb:"
  ],
  "a weboldal alapműködéséhez szükséges helyi tárolás, például a téma- és hozzájárulási döntés megjegyzéséhez.": [
    "local storage necessary for basic website operation, such as remembering theme and consent choices.",
    "Für den Grundbetrieb erforderlicher lokaler Speicher, etwa zum Merken von Design- und Einwilligungsentscheidungen."
  ],
  "Analitika:": [
    "Analytics:",
    "Analyse:"
  ],
  "a Google Analytics külső címkéje csak analitikai hozzájárulás után töltődik be és kezd mérést.": [
    "the external Google Analytics tag loads and starts measurement only after analytics consent.",
    "Das externe Google-Analytics-Tag wird erst nach Analyse-Einwilligung geladen und beginnt dann mit der Messung."
  ],
  "Partneri tartalom és marketing:": [
    "Affiliate content and marketing:",
    "Partnerinhalte und Marketing:"
  ],
  "a Google Ads mérési címkéje és a partneri külső kreatívok csak a webhely saját marketing-hozzájárulása után töltődnek be. Az AdSense-kód az arra kijelölt oldalakon a Google hozzájárulási üzenetéhez már korábban betöltődhet, a hirdetési kérések azonban a Google hozzájárulási állapotának rendezéséig szünetelnek. A Google a látogató választásától függően személyre szabott, nem személyre szabott vagy korlátozott hirdetéseket jeleníthet meg. A nem személyre szabott hirdetések is használhatnak sütiket vagy azonosítókat például gyakoriságkorlátozáshoz és összesített jelentésekhez.": [
    "the Google Ads measurement tag and external affiliate creatives load only after website marketing consent. AdSense code may load earlier on designated pages to show Google’s consent message, while ad requests remain paused until Google’s consent state is resolved. Depending on the visitor’s choices, Google may show personalised, non-personalised or limited ads. Non-personalised ads may also use cookies or identifiers, for example for frequency capping and aggregate reporting.",
    "Das Google-Ads-Mess-Tag und externe Partner-Werbemittel werden erst nach der Marketing-Einwilligung der Website geladen. AdSense-Code kann auf vorgesehenen Seiten schon früher laden, um Googles Einwilligungsnachricht anzuzeigen; Anzeigenanfragen bleiben bis zur Klärung des Google-Status pausiert. Je nach Besucherentscheidung kann Google personalisierte, nicht personalisierte oder eingeschränkte Anzeigen ausliefern. Auch nicht personalisierte Anzeigen können Cookies oder Kennungen nutzen, etwa zur Häufigkeitsbegrenzung und für zusammengefasste Berichte."
  ],
  "A saját analitikai és marketingcímkék a megfelelő hozzájárulásig nem töltődnek be. Az AdSense-ről hozott döntést a Google külön kezeli; a webhely saját „Sütibeállítások” gombja ezt a választást nem módosítja.": [
    "Our analytics and marketing tags do not load before the relevant consent. Google manages AdSense choices separately; the website’s own Cookie settings button does not change them.",
    "Unsere Analyse- und Marketing-Tags laden nicht vor der entsprechenden Einwilligung. Google verwaltet AdSense-Entscheidungen separat; der eigene Button Cookie-Einstellungen der Website verändert diese nicht."
  ],
  "A weboldal az alábbi szolgáltatásokat használhatja:": [
    "The website may use the following services:",
    "Die Website kann folgende Dienste verwenden:"
  ],
  "Google Analytics": [
    "Google Analytics",
    "Google Analytics"
  ],
  "Google AdSense": [
    "Google AdSense",
    "Google AdSense"
  ],
  "Google Ads konverziómérés": [
    "Google Ads conversion measurement",
    "Google-Ads-Conversion-Messung"
  ],
  "Wise partneri kreatívok és partnerlinkek": [
    "Wise affiliate creatives and links",
    "Wise-Partner-Werbemittel und Partnerlinks"
  ],
  "Ezek a szolgáltatók saját sütiket vagy technikai azonosítókat helyezhetnek el a felhasználó eszközén, a vonatkozó hozzájárulási választások szerint. A Google adatfelhasználásáról": [
    "These providers may place their own cookies or technical identifiers on the user’s device according to the applicable consent choices. Details of Google’s data use are in",
    "Diese Anbieter können entsprechend den jeweiligen Einwilligungsentscheidungen eigene Cookies oder technische Kennungen auf dem Gerät ablegen. Einzelheiten zur Google-Datennutzung erläutern die"
  ],
  "a Google partneroldalakról szóló tájékoztatója": [
    "Google’s partner-site information",
    "Google-Informationen zu Partnerseiten"
  ],
  "ad részleteket; a Google-hirdetések személyre szabását a": [
    "; personalised Google advertising can also be managed in",
    "; die Personalisierung von Google-Werbung lässt sich auch im"
  ],
  "Hirdetésközpontban": [
    "My Ad Center",
    "My Ad Center"
  ],
  "is kezelheted.": [
    ".",
    "verwalten."
  ],
  "Sütik kezelése": [
    "Managing cookies",
    "Cookies verwalten"
  ],
  "A felhasználó a weboldal láblécében található Sütibeállítások gombbal bármikor módosíthatja vagy visszavonhatja a saját analitikai és marketing- hozzájárulását. Ezt a választást a böngésző legfeljebb 180 napig tárolja; a mentés tartalmazza a kategóriákat, a hozzájárulási verziót, a döntés időpontját és a lejáratot. Hibás, lejárt vagy ismeretlen verziójú rekord esetén ezek a címkék tiltottak maradnak. Az AdSense-hirdetésekre vonatkozó döntés a hirdetést megjelenítő oldalakon a Google által biztosított Adatvédelmi és sütibeállítások hivatkozással módosítható vagy vonható vissza.": [
    "Users can change or withdraw their analytics and marketing consent at any time through Cookie settings in the footer. The browser stores this choice for up to 180 days, including categories, consent version, decision time and expiry. Invalid, expired or unknown-version records leave these tags blocked. AdSense choices can be changed or withdrawn on pages showing ads through Google’s Privacy and cookie settings link.",
    "Nutzer können ihre Analyse- und Marketing-Einwilligung jederzeit über Cookie-Einstellungen im Footer ändern oder widerrufen. Der Browser speichert diese Entscheidung höchstens 180 Tage, einschließlich Kategorien, Einwilligungsversion, Entscheidungszeit und Ablauf. Bei ungültigen, abgelaufenen oder unbekannten Versionen bleiben diese Tags gesperrt. AdSense-Entscheidungen können auf Seiten mit Anzeigen über Googles Link Datenschutz- und Cookie-Einstellungen geändert oder widerrufen werden."
  ],
  "Hozzájárulási logika": [
    "How consent works",
    "Funktionsweise der Einwilligung"
  ],
  "Nem minden süti ugyanazért létezik": [
    "Not every cookie serves the same purpose",
    "Nicht jedes Cookie dient demselben Zweck"
  ],
  "Szükséges": [
    "Necessary",
    "Notwendig"
  ],
  "A webhely alapműködéséhez vagy biztonságához kapcsolódó technikai funkció.": [
    "Technical functionality related to basic website operation or security.",
    "Technische Funktion für den Grundbetrieb oder die Sicherheit der Website."
  ],
  "Funkcionális": [
    "Functional",
    "Funktional"
  ],
  "Felhasználói kényelmet vagy beállítást támogató funkció, ha ilyet a tájékoztató megnevez.": [
    "A convenience or preference feature, where specified in the notice.",
    "Eine Komfort- oder Einstellungsfunktion, sofern sie in den Hinweisen genannt ist."
  ],
  "Analitikai": [
    "Analytics",
    "Analyse"
  ],
  "Használati mérés; a tényleges működést a hozzájárulási beállítás és a tájékoztató határozza meg.": [
    "Usage measurement; consent settings and the notice determine its actual operation.",
    "Nutzungsmessung; Einwilligungseinstellungen und Hinweise bestimmen den tatsächlichen Betrieb."
  ],
  "Hirdetési": [
    "Advertising",
    "Werbung"
  ],
  "Hirdetéshez kapcsolódó tárolás vagy jelzés csak az alkalmazott hozzájárulási rendszer szabályai szerint.": [
    "Advertising-related storage or signals only according to the rules of the consent system used.",
    "Werbebezogene Speicherung oder Signale nur nach den Regeln des verwendeten Einwilligungssystems."
  ],
  "A kategóriák célja az érthetőség. A pontos szolgáltató, süti, tárolási idő és jogalap a részletes táblázat vagy szöveg szerint értelmezendő.": [
    "These categories aid understanding. The detailed table or text specifies providers, cookies, retention periods and legal bases.",
    "Diese Kategorien dienen der Verständlichkeit. Die genaue Bedeutung von Anbieter, Cookie, Speicherdauer und Rechtsgrundlage ergibt sich aus der ausführlichen Tabelle oder dem Text."
  ],
  "Süti tájékoztató": [
    "Cookie notice",
    "Cookie-Hinweise"
  ],
  "Tájékoztató a Kalkulátor Bázis működéséhez, méréséhez és hirdetéseihez kapcsolódó sütikről és választási lehetőségekről.": [
    "Information about cookies and choices relating to Kalkulátor Bázis operation, measurement and advertising.",
    "Informationen über Cookies und Auswahlmöglichkeiten für Betrieb, Messung und Werbung bei Kalkulátor Bázis."
  ],
  "A Kalkulátor Bázis weboldal használatával Ön elfogadja az alábbi feltételeket.": [
    "By using the Kalkulátor Bázis website, you accept the following terms.",
    "Mit der Nutzung der Website Kalkulátor Bázis akzeptieren Sie die folgenden Bedingungen."
  ],
  "Szolgáltatás": [
    "Service",
    "Dienstleistung"
  ],
  "A weboldalon található kalkulátorok tájékoztató jellegű számításokat végeznek. A számítás a funkciótól függően a böngészőben vagy a Kalkulátor Bázis kapcsolódó API-szolgáltatásával történhet. A mezőkbe írt értékeket az oldal nem tekinti hivatalos ajánlatkérésnek; az adatkezelés részleteit az Adatvédelmi tájékoztató ismerteti.": [
    "Website calculators perform indicative calculations. Depending on the feature, calculation takes place in the browser or through the associated Kalkulátor Bázis API service. Inputs are not treated as formal requests for offers. The Privacy notice explains data processing.",
    "Die Rechner der Website führen unverbindliche Berechnungen durch. Je nach Funktion geschieht dies im Browser oder über den verbundenen API-Dienst von Kalkulátor Bázis. Eingaben gelten nicht als förmliche Angebotsanfragen. Einzelheiten zur Datenverarbeitung stehen in den Datenschutzhinweisen."
  ],
  "Jogi nyilatkozat és felelősség kizárása": [
    "Legal notice and disclaimer",
    "Rechtlicher Hinweis und Haftungsausschluss"
  ],
  "Az üzemeltető nem vállal felelősséget a számítások pontosságáért vagy azok felhasználásából eredő károkért.": [
    "The operator accepts no liability for calculation accuracy or damage arising from use of the calculations.",
    "Der Betreiber übernimmt keine Haftung für die Genauigkeit der Berechnungen oder für Schäden aus ihrer Verwendung."
  ],
  "Pontosság": [
    "Accuracy",
    "Genauigkeit"
  ],
  "A kalkulátorok által adott eredmények tájékoztató jellegűek, és nem minősülnek pénzügyi, jogi vagy adótanácsadásnak.": [
    "Calculator results are indicative and do not constitute financial, legal or tax advice.",
    "Rechenergebnisse dienen der Orientierung und stellen keine Finanz-, Rechts- oder Steuerberatung dar."
  ],
  "Tiltott felhasználás": [
    "Prohibited use",
    "Unzulässige Nutzung"
  ],
  "jogellenes használat": [
    "unlawful use",
    "Rechtswidrige Nutzung"
  ],
  "rendszer túlterhelése": [
    "overloading the system",
    "Überlastung des Systems"
  ],
  "automatikus lekérdezések (botok)": [
    "automated queries (bots)",
    "Automatisierte Anfragen (Bots)"
  ],
  "Szerzői jog": [
    "Copyright",
    "Urheberrecht"
  ],
  "A weboldal tartalma szerzői jogi védelem alatt áll.": [
    "Website content is protected by copyright.",
    "Die Inhalte der Website sind urheberrechtlich geschützt."
  ],
  "Módosítás": [
    "Changes",
    "Änderungen"
  ],
  "Az üzemeltető fenntartja a jogot a feltételek módosítására.": [
    "The operator reserves the right to change these terms.",
    "Der Betreiber behält sich vor, diese Bedingungen zu ändern."
  ],
  "Utolsó frissítés: 2026.08.12.": [
    "Last updated: 12 August 2026.",
    "Zuletzt aktualisiert: 12. August 2026."
  ],
  "Használati határ": [
    "Limits of use",
    "Nutzungsgrenzen"
  ],
  "Mire jó egy kalkulátoreredmény jogi értelemben?": [
    "What is a calculator result useful for in legal terms?",
    "Wozu ist ein Rechenergebnis rechtlich nutzbar?"
  ],
  "Gyors ellenőrzés": [
    "Quick checks",
    "Schnelle Prüfung"
  ],
  "Igen: saját tervezéshez, összehasonlításhoz és nagyságrendi becsléshez.": [
    "Yes: personal planning, comparisons and approximate estimates.",
    "Ja: für eigene Planung, Vergleiche und grobe Schätzungen."
  ],
  "Hivatalos igazolás": [
    "Official evidence",
    "Offizieller Nachweis"
  ],
  "Nem automatikusan: szerződés, hatóság, bank, munkáltató vagy szakértő saját számítása lehet irányadó.": [
    "Not automatically: a contract, authority, bank, employer or professional may require its own calculation.",
    "Nicht automatisch: Maßgeblich kann die eigene Berechnung eines Vertrags, einer Behörde, Bank, eines Arbeitgebers oder Fachkundigen sein."
  ],
  "Személyre szabott tanács": [
    "Personalised advice",
    "Individuelle Beratung"
  ],
  "Nem: a kalkulátor nem ismeri az összes egyedi körülményt.": [
    "No: the calculator does not know every individual circumstance.",
    "Nein: Der Rechner kennt nicht alle individuellen Umstände."
  ],
  "Végleges döntés": [
    "Final decisions",
    "Endgültige Entscheidung"
  ],
  "A döntés kockázatához mérten ellenőrizd a bemenetet, forrást és a szükséges szakmai feltételeket.": [
    "Check inputs, sources and necessary professional requirements in proportion to the decision’s risk.",
    "Prüfe Eingaben, Quellen und nötige fachliche Voraussetzungen entsprechend dem Risiko der Entscheidung."
  ],
  "A Kalkulátor Bázis használati feltételei, a kalkulált eredmények korlátai, a felelősségi szabályok és a tartalom felhasználása.": [
    "Kalkulátor Bázis terms of use, result limitations, liability rules and use of content.",
    "Nutzungsbedingungen von Kalkulátor Bázis, Ergebnisgrenzen, Haftungsregeln und Inhaltsnutzung."
  ],
  "Az alábbi adatok a Kalkulátor Bázis weboldal üzemeltetőjének és a weboldal tárhelyszolgáltatójának azonosítását és közvetlen elérhetőségét szolgálják.": [
    "The following information identifies the Kalkulátor Bázis website operator and hosting provider and provides direct contact details.",
    "Die folgenden Angaben dienen der Identifizierung und direkten Erreichbarkeit des Websitebetreibers und Hostinganbieters von Kalkulátor Bázis."
  ],
  "Szolgáltató / üzemeltető adatai": [
    "Service provider / operator details",
    "Angaben zum Diensteanbieter / Betreiber"
  ],
  "Név:": [
    "Name:",
    "Name:"
  ],
  "Kovács Patrik": [
    "Kovács Patrik",
    "Kovács Patrik"
  ],
  "Cím:": [
    "Address:",
    "Anschrift:"
  ],
  "1181 Budapest, Havanna utca 73.": [
    "1181 Budapest, Havanna utca 73.",
    "1181 Budapest, Havanna utca 73."
  ],
  "E-mail:": [
    "Email:",
    "E-Mail:"
  ],
  "Weboldal:": [
    "Website:",
    "Website:"
  ],
  "https://kalkulatorbazis.hu/": [
    "https://kalkulatorbazis.hu/",
    "https://kalkulatorbazis.hu/"
  ],
  "A weboldal jelenleg ingyenesen használható online kalkulátorokat és kapcsolódó tájékoztató tartalmakat biztosít. A kalkulátorok eredményei tájékoztató jellegűek; a részletes felhasználási és felelősségi szabályokat a": [
    "The website currently provides free online calculators and related information. Results are indicative; the detailed usage and liability rules are set out in the",
    "Die Website bietet derzeit kostenlose Online-Rechner und zugehörige Informationen. Die Ergebnisse dienen der Orientierung; die ausführlichen Nutzungs- und Haftungsregeln stehen in den"
  ],
  "tartalmazza.": [
    ".",
    "."
  ],
  "Tárhelyszolgáltató": [
    "Hosting provider",
    "Hostinganbieter"
  ],
  "Szolgáltató:": [
    "Provider:",
    "Anbieter:"
  ],
  "Cloudflare, Inc.": [
    "Cloudflare, Inc.",
    "Cloudflare, Inc."
  ],
  "Székhely:": [
    "Registered office:",
    "Sitz:"
  ],
  "101 Townsend St., San Francisco, CA 94107, United States": [
    "101 Townsend St., San Francisco, CA 94107, United States",
    "101 Townsend St., San Francisco, CA 94107, United States"
  ],
  "Elektronikus elérhetőség:": [
    "Electronic contact:",
    "Elektronischer Kontakt:"
  ],
  "Cloudflare Support": [
    "Cloudflare Support",
    "Cloudflare Support"
  ],
  "https://www.cloudflare.com/": [
    "https://www.cloudflare.com/",
    "https://www.cloudflare.com/"
  ],
  "A Kalkulátor Bázis statikus weboldalát a Cloudflare Pages szolgáltatás teszi elérhetővé. A hálózati kiszolgálást, HTTPS-kapcsolatot és kapcsolódó infrastruktúrát a Cloudflare szolgáltatásai biztosítják; a részletes adatkezelési feltételeket a Cloudflare saját dokumentációja és adatvédelmi tájékoztatója tartalmazza.": [
    "Cloudflare Pages serves the static Kalkulátor Bázis website. Cloudflare services provide network delivery, HTTPS and associated infrastructure; its own documentation and privacy notice contain detailed processing terms.",
    "Cloudflare Pages stellt die statische Website Kalkulátor Bázis bereit. Cloudflare-Dienste liefern Netzwerkauslieferung, HTTPS und zugehörige Infrastruktur. Einzelheiten zur Datenverarbeitung stehen in der eigenen Dokumentation und den Datenschutzhinweisen von Cloudflare."
  ],
  "A weboldallal, tartalommal, jogi tájékoztatással vagy hibabejelentéssel kapcsolatos megkeresések a": [
    "Enquiries about the website, content, legal information or bugs can be sent to",
    "Anfragen zur Website, zu Inhalten, rechtlichen Informationen oder Fehlern können an"
  ],
  "címen küldhetők.": [
    ".",
    "gesendet werden."
  ],
  "Utolsó frissítés: 2026.08.13.": [
    "Last updated: 13 August 2026.",
    "Zuletzt aktualisiert: 13. August 2026."
  ],
  "Üzemeltetői adatok": [
    "Operator information",
    "Betreiberangaben"
  ],
  "Mit érdemes ezen az oldalon keresni?": [
    "What can you find on this page?",
    "Was findest du auf dieser Seite?"
  ],
  "Ki üzemelteti vagy felel a webhelyért?": [
    "Who operates or is responsible for the website?",
    "Wer betreibt die Website oder ist dafür verantwortlich?"
  ],
  "Milyen közvetlen kapcsolatfelvételi lehetőség áll rendelkezésre?": [
    "Which direct contact options are available?",
    "Welche direkten Kontaktmöglichkeiten gibt es?"
  ],
  "Hol érhetők el az adatvédelmi, felhasználási és jogi feltételek?": [
    "Where are privacy, usage and legal terms available?",
    "Wo stehen Datenschutz-, Nutzungs- und rechtliche Bedingungen?"
  ],
  "Hogyan lehet hibát, jogi vagy tartalmi észrevételt jelezni?": [
    "How can errors or legal and content concerns be reported?",
    "Wie lassen sich Fehler oder rechtliche und inhaltliche Anmerkungen melden?"
  ],
  "Az impresszum az üzemeltetői azonosíthatóságot szolgálja; a számítási módszertant és minőségbiztosítást külön oldalak részletezik.": [
    "The imprint identifies the operator. Separate pages explain calculation methods and quality assurance.",
    "Das Impressum dient der Identifizierbarkeit des Betreibers. Berechnungsmethoden und Qualitätssicherung erläutern separate Seiten."
  ],
  "Impresszum | Kalkulátor Bázis": [
    "Imprint · Kalkulátor Bázis",
    "Impressum · Kalkulátor Bázis"
  ],
  "A Kalkulátor Bázis impresszuma és szolgáltatói adatai, valamint a tárhelyszolgáltató elérhetőségei.": [
    "Kalkulátor Bázis imprint and provider details, including hosting-provider contacts.",
    "Impressum und Anbieterangaben von Kalkulátor Bázis sowie Kontaktdaten des Hostinganbieters."
  ],
  "A Kalkulátor Bázis szolgáltatói és tárhelyszolgáltatói adatai.": [
    "Kalkulátor Bázis service-provider and hosting-provider details.",
    "Angaben zum Diensteanbieter und Hostinganbieter von Kalkulátor Bázis."
  ],
  "Felelősségi tájékoztatás": [
    "Liability information",
    "Haftungsinformationen"
  ],
  "A Kalkulátor Bázis oldalain található kalkulátorok és magyarázó tartalmak általános tájékoztatást és becslést adnak. Az eredmények nem helyettesítik a hivatalos számítást, szakértői tanácsot vagy egyedi ügyre vonatkozó döntést.": [
    "Calculators and explanations on Kalkulátor Bázis provide general information and estimates. Results do not replace official calculations, professional advice or individual case decisions.",
    "Die Rechner und Erklärungen von Kalkulátor Bázis bieten allgemeine Informationen und Schätzungen. Ergebnisse ersetzen keine amtliche Berechnung, fachliche Beratung oder Einzelfallentscheidung."
  ],
  "Kalkulátorok és eredmények": [
    "Calculators and results",
    "Rechner und Ergebnisse"
  ],
  "A kalkulátorok a felhasználó által megadott adatokból dolgoznak. Hibás, hiányos, elavult vagy nem megfelelő mértékegységben megadott bemenet esetén az eredmény is hibás vagy félrevezető lehet.": [
    "Calculators use user-provided data. Incorrect, incomplete, outdated or wrongly unit-labelled inputs can produce incorrect or misleading results.",
    "Die Rechner arbeiten mit Nutzereingaben. Falsche, unvollständige, veraltete oder in ungeeigneten Einheiten angegebene Eingaben können falsche oder irreführende Ergebnisse erzeugen."
  ],
  "A webhely törekszik az érthető képletek, frissíthető adatok és használható magyarázatok megjelenítésére, de a pontosságra, teljességre és minden élethelyzetre való alkalmazhatóságra nem vállalható garancia.": [
    "The website aims to present understandable formulas, updateable data and useful explanations, but cannot guarantee accuracy, completeness or applicability to every situation.",
    "Die Website bemüht sich um verständliche Formeln, aktualisierbare Daten und hilfreiche Erklärungen. Genauigkeit, Vollständigkeit und Anwendbarkeit auf jede Lebenssituation können jedoch nicht garantiert werden."
  ],
  "Nem minősül tanácsadásnak": [
    "Not professional advice",
    "Keine Beratung"
  ],
  "A pénzügyi, befektetési, hitel-, adózási, jogi és egészségügyi kalkulátorok eredményei nem minősülnek személyre szabott tanácsadásnak, ajánlatnak, diagnózisnak vagy hivatalos állásfoglalásnak.": [
    "Financial, investment, loan, tax, legal and health calculator results are not personalised advice, offers, diagnoses or official interpretations.",
    "Ergebnisse von Finanz-, Anlage-, Kredit-, Steuer-, Rechts- und Gesundheitsrechnern sind keine individuelle Beratung, Angebote, Diagnosen oder amtlichen Stellungnahmen."
  ],
  "Fontos döntés előtt ellenőrizd az aktuális hivatalos adatokat, és szükség esetén fordulj bankhoz, könyvelőhöz, adótanácsadóhoz, jogászhoz, orvoshoz vagy más megfelelő szakemberhez.": [
    "Before important decisions, check current official information and, where needed, consult a bank, accountant, tax adviser, lawyer, doctor or other appropriate professional.",
    "Prüfe vor wichtigen Entscheidungen aktuelle amtliche Angaben und wende dich bei Bedarf an eine Bank, Buchhaltungs-, Steuer- oder Rechtsberatung, einen Arzt oder andere geeignete Fachleute."
  ],
  "Külső hivatkozások és partneri tartalom": [
    "External links and affiliate content",
    "Externe Links und Partnerinhalte"
  ],
  "Az oldalon külső hivatkozások és partneri linkek is megjelenhetnek. A partneri kapcsolat azt jelentheti, hogy a webhely jutalékot kap, ha a látogató az adott linken keresztül szolgáltatást vesz igénybe. Ez a látogató számára jellemzően nem jelent többletköltséget.": [
    "The website may include external and affiliate links. An affiliate relationship may mean the website receives a commission when a visitor uses a service through that link. This generally adds no cost for the visitor.",
    "Die Website kann externe Links und Partnerlinks enthalten. Eine Partnerschaft kann bedeuten, dass die Website eine Provision erhält, wenn ein Besucher über den Link einen Dienst nutzt. Für den Besucher entstehen dadurch normalerweise keine Mehrkosten."
  ],
  "Külső webhelyek tartalmáért, díjaiért, feltételeiért és adatkezeléséért az adott szolgáltató felel.": [
    "External providers are responsible for their websites’ content, fees, terms and data processing.",
    "Für Inhalte, Gebühren, Bedingungen und Datenverarbeitung externer Websites ist der jeweilige Anbieter verantwortlich."
  ],
  "Kapcsolódó oldalak": [
    "Related pages",
    "Verwandte Seiten"
  ],
  "Átlátható használat": [
    "Transparent use",
    "Transparente Nutzung"
  ],
  "Kockázati döntési mátrix": [
    "Risk decision matrix",
    "Risikomatrix für Entscheidungen"
  ],
  "Minél nagyobb a következmény, annál több ellenőrzés kell": [
    "The greater the consequences, the more checking is needed",
    "Je größer die Folgen, desto mehr Prüfung ist nötig"
  ],
  "Alacsony kockázat": [
    "Low risk",
    "Geringes Risiko"
  ],
  "Hétköznapi százalék, mértékegység vagy becslés: általában elég a bemenet és a képlet ellenőrzése.": [
    "Everyday percentages, unit conversions or estimates: checking inputs and formulas is usually sufficient.",
    "Alltägliche Prozentrechnung, Einheiten oder Schätzungen: Meist reicht eine Prüfung von Eingaben und Formel."
  ],
  "Pénzügyi / adó": [
    "Finance / tax",
    "Finanzen / Steuern"
  ],
  "Nagyobb összeg vagy jogszabályi következmény esetén aktuális hivatalos forrás és szükség esetén szakember.": [
    "For larger sums or legal consequences, use current official sources and professional advice where needed.",
    "Bei größeren Beträgen oder rechtlichen Folgen sind aktuelle amtliche Quellen und bei Bedarf Fachleute nötig."
  ],
  "A képletes becslés nem diagnózis; tünet, betegség, gyógyszer vagy speciális élethelyzet külön szakmai értékelést igényelhet.": [
    "A formula-based estimate is not a diagnosis. Symptoms, illness, medication or special circumstances may need individual professional assessment.",
    "Eine Formelschätzung ist keine Diagnose. Beschwerden, Erkrankungen, Medikamente oder besondere Lebenssituationen können eine eigene fachliche Beurteilung erfordern."
  ],
  "Műszaki / kivitelezés": [
    "Technical / construction",
    "Technik / Bauausführung"
  ],
  "Mennyiségi kalkuláció nem helyettesít statikai, tűzvédelmi, villamos vagy más szakági tervezést.": [
    "Quantity calculations do not replace structural, fire-safety, electrical or other specialist design.",
    "Mengenberechnungen ersetzen keine Tragwerks-, Brandschutz-, Elektro- oder andere Fachplanung."
  ],
  "Jogi és felelősségi nyilatkozat | Kalkulátor Bázis": [
    "Legal Notice and Disclaimer · Kalkulátor Bázis",
    "Rechtliche Hinweise und Haftung · Kalkulátor Bázis"
  ],
  "← Kalkulátor Bázis": [
    "← Kalkulátor Bázis",
    "← Kalkulátor Bázis"
  ],
  "Kalkulátor Bázis plugin – adatvédelmi tájékoztató": [
    "Kalkulátor Bázis plugin – privacy notice",
    "Kalkulátor-Bázis-Plugin – Datenschutzhinweise"
  ],
  "Ez a tájékoztató kifejezetten a Kalkulátor Bázis ChatGPT- és Codex-kompatibilis, MCP-alapú pluginjának adatkezelését ismerteti. A weboldal általános adatkezelési tájékoztatója külön oldalon érhető el.": [
    "This notice specifically explains data processing by the MCP-based Kalkulátor Bázis plugin compatible with ChatGPT and Codex. The website’s general privacy notice is available separately.",
    "Diese Hinweise erläutern speziell die Datenverarbeitung durch das MCP-basierte, mit ChatGPT und Codex kompatible Plugin von Kalkulátor Bázis. Die allgemeinen Datenschutzhinweise der Website stehen auf einer separaten Seite."
  ],
  "Adatkezelő": [
    "Controller",
    "Verantwortlicher"
  ],
  "A plugin működése": [
    "How the plugin works",
    "Funktionsweise des Plugins"
  ],
  "A plugin nyilvános MCP-végpontja a": [
    "The plugin’s public MCP endpoint is",
    "Der öffentliche MCP-Endpunkt des Plugins ist"
  ],
  ". Amikor a felhasználó a ChatGPT-ben vagy más támogatott OpenAI-felületen a Kalkulátor Bázis egyik számítási eszközét használja, az OpenAI rendszere a számításhoz szükséges tool-bemenetet továbbítja ehhez az MCP-végponthoz. Az MCP Worker a számítási kérést a Kalkulátor Bázis production Salary API-jának adja át.": [
    ". When a user uses a Kalkulátor Bázis calculation tool in ChatGPT or another supported OpenAI interface, OpenAI sends the required tool input to this MCP endpoint. The MCP Worker forwards the calculation request to the production Kalkulátor Bázis Salary API.",
    ". Nutzt ein Anwender in ChatGPT oder einer anderen unterstützten OpenAI-Oberfläche ein Kalkulátor-Bázis-Werkzeug, übermittelt OpenAI die für die Berechnung nötige Werkzeugeingabe an diesen MCP-Endpunkt. Der MCP Worker leitet die Anfrage an die produktive Salary API von Kalkulátor Bázis weiter."
  ],
  "Milyen adatokat kaphat a plugin?": [
    "What data can the plugin receive?",
    "Welche Daten kann das Plugin erhalten?"
  ],
  "A jelenlegi, 2026-os bérszámítási eszközök kizárólag a számításhoz szükséges paramétereket fogadják. Ezek például:": [
    "The current 2026 salary tools accept only calculation-related parameters, for example:",
    "Die aktuellen Gehaltswerkzeuge für 2026 nehmen nur berechnungsrelevante Parameter entgegen, zum Beispiel:"
  ],
  "bruttó munkabér vagy kívánt nettó összeg;": [
    "gross salary or desired net amount;",
    "Bruttogehalt oder gewünschter Nettobetrag;"
  ],
  "a támogatott adóév;": [
    "the supported tax year;",
    "Das unterstützte Steuerjahr;"
  ],
  "a felhasználó által kifejezetten megadott kedvezménykapcsolók;": [
    "allowance switches explicitly provided by the user;",
    "Vom Nutzer ausdrücklich angegebene Schalter für Vergünstigungen;"
  ],
  "családi kedvezményhez szükséges darabszámok és érvényesítési arány.": [
    "counts and claim proportions needed for family tax allowances.",
    "Für Familienvergünstigungen nötige Anzahlen und Anteile der Inanspruchnahme."
  ],
  "A plugin nem kér nevet, e-mail-címet, címet, telefonszámot, bankszámlaadatot, jelszót, személyazonosító okmányt, egészségügyi dokumentumot vagy más, a számításhoz szükségtelen azonosító adatot. Kérjük, ilyen adatot ne adj meg a plugin számára.": [
    "The plugin does not request names, email or postal addresses, telephone numbers, bank details, passwords, identity documents, health records or other identifiers unnecessary for the calculation. Please do not provide such data.",
    "Das Plugin fragt nicht nach Namen, E-Mail- oder Postadressen, Telefonnummern, Bankdaten, Passwörtern, Ausweisen, Gesundheitsunterlagen oder anderen für die Berechnung unnötigen Identifikationsdaten. Bitte gib solche Daten nicht an."
  ],
  "Mire használjuk a tool-bemenetet?": [
    "How do we use tool inputs?",
    "Wofür verwenden wir Werkzeugeingaben?"
  ],
  "A továbbított értékeket kizárólag a kért kalkuláció elvégzésére, a szolgáltatás biztonságos működtetésére és technikai hibák elhárítására használjuk. A plugin bemeneteit nem használjuk hirdetési célra, profilalkotásra vagy felhasználók közötti összekapcsolásra.": [
    "Transmitted values are used solely for the requested calculation, secure service operation and troubleshooting. Plugin inputs are not used for advertising, profiling or linking users to each other.",
    "Übermittelte Werte werden ausschließlich für die angeforderte Berechnung, den sicheren Betrieb und die Fehlerbehebung verwendet. Plugin-Eingaben dienen nicht der Werbung, Profilbildung oder Verknüpfung von Nutzern."
  ],
  "Tárolás és technikai naplók": [
    "Storage and technical logs",
    "Speicherung und technische Protokolle"
  ],
  "A Kalkulátor Bázis MCP Worker és Salary API alkalmazáskódja nem hoz létre felhasználói profilt, és szándékosan nem tárolja tartósan a kalkulátor toolok request body-ját. A szolgáltatást kiszolgáló infrastruktúra technikai naplókat kezelhet, például időpontot, IP-címet, kért útvonalat, HTTP-metódust és válaszkódot a biztonság, hibakeresés és visszaélés-megelőzés érdekében.": [
    "The application code of the Kalkulátor Bázis MCP Worker and Salary API does not create user profiles and deliberately does not persist calculator-tool request bodies. Service infrastructure may keep technical logs such as time, IP address, requested path, HTTP method and response code for security, debugging and abuse prevention.",
    "Der Anwendungscode des Kalkulátor-Bázis-MCP-Workers und der Salary API erstellt keine Nutzerprofile und speichert bewusst keine Anfragekörper der Rechnerwerkzeuge dauerhaft. Die Infrastruktur kann für Sicherheit, Fehlersuche und Missbrauchsprävention technische Protokolle mit Zeitpunkt, IP-Adresse, Pfad, HTTP-Methode und Antwortcode führen."
  ],
  "Közreműködő szolgáltatók": [
    "Service providers involved",
    "Beteiligte Dienstleister"
  ],
  "Cloudflare:": [
    "Cloudflare:",
    "Cloudflare:"
  ],
  "az MCP Worker és a kapcsolódó hálózati kiszolgálás.": [
    "the MCP Worker and associated network delivery.",
    "Der MCP Worker und die zugehörige Netzwerkauslieferung."
  ],
  "Render:": [
    "Render:",
    "Render:"
  ],
  "a Kalkulátor Bázis Salary API infrastruktúrájának kiszolgálása.": [
    "hosting the Kalkulátor Bázis Salary API infrastructure.",
    "Bereitstellung der Infrastruktur der Kalkulátor-Bázis-Salary-API."
  ],
  "OpenAI:": [
    "OpenAI:",
    "OpenAI:"
  ],
  "a ChatGPT/Codex felület, a beszélgetés és a tool-hívás továbbítása az MCP szerver felé.": [
    "the ChatGPT/Codex interface, conversation handling and forwarding tool calls to the MCP server.",
    "Die ChatGPT-/Codex-Oberfläche, die Unterhaltung und die Weiterleitung von Werkzeugaufrufen an den MCP-Server."
  ],
  "Az OpenAI a saját szolgáltatásának használata során az OpenAI saját adatvédelmi és szolgáltatási feltételei szerint kezelhet adatokat. A Kalkulátor Bázis nem szabályozza a felhasználó ChatGPT-fiókjának beszélgetési előzményeit, megőrzési beállításait vagy az OpenAI által végzett, saját szolgáltatásához kapcsolódó adatkezelést.": [
    "OpenAI may process data under its own privacy and service terms when its services are used. Kalkulátor Bázis does not control the user’s ChatGPT conversation history, retention settings or OpenAI’s processing for its own services.",
    "OpenAI kann bei Nutzung seiner Dienste Daten nach eigenen Datenschutz- und Nutzungsbedingungen verarbeiten. Kalkulátor Bázis kontrolliert weder den ChatGPT-Unterhaltungsverlauf und dessen Aufbewahrungseinstellungen noch die Datenverarbeitung von OpenAI für eigene Dienste."
  ],
  "Adatkezelési cél és jogalap": [
    "Processing purposes and legal basis",
    "Verarbeitungszwecke und Rechtsgrundlage"
  ],
  "A Kalkulátor Bázis oldalán a technikailag szükséges adatkezelés célja a kért számítás teljesítése, a szolgáltatás biztonságos működtetése, a hibakeresés és a visszaélések megelőzése. A technikai működéshez szükséges adatkezelést az adatkezelő jogos érdekére alapozzuk (GDPR 6. cikk (1) f)). A plugin használata nem igényel regisztrációt a Kalkulátor Bázisnál.": [
    "On the Kalkulátor Bázis side, technically necessary processing serves the requested calculation, secure operation, debugging and abuse prevention. Such processing relies on the controller’s legitimate interests (GDPR Article 6(1)(f)). Plugin use does not require registration with Kalkulátor Bázis.",
    "Bei Kalkulátor Bázis dient die technisch notwendige Verarbeitung der angeforderten Berechnung, dem sicheren Betrieb, der Fehlersuche und Missbrauchsprävention. Sie beruht auf berechtigten Interessen des Verantwortlichen (Art. 6 Abs. 1 Buchst. f DSGVO). Eine Registrierung bei Kalkulátor Bázis ist für das Plugin nicht erforderlich."
  ],
  "Kedvezmény-jogosultság": [
    "Eligibility for allowances",
    "Anspruch auf Vergünstigungen"
  ],
  "A plugin nem állapítja meg automatikusan, hogy a felhasználó jogilag jogosult-e valamely adó- vagy családi kedvezményre. A számítás csak a felhasználó által kifejezetten megadott vagy megerősített paraméterekből indul ki.": [
    "The plugin does not automatically determine whether the user legally qualifies for a tax or family allowance. Calculations use only parameters explicitly provided or confirmed by the user.",
    "Das Plugin stellt nicht automatisch fest, ob der Nutzer rechtlich Anspruch auf Steuer- oder Familienvergünstigungen hat. Es berechnet ausschließlich anhand der ausdrücklich angegebenen oder bestätigten Parameter."
  ],
  "Érintetti jogok és kapcsolat": [
    "Data-subject rights and contact",
    "Betroffenenrechte und Kontakt"
  ],
  "Adatvédelmi kérdés, hozzáférési, törlési, korlátozási vagy tiltakozási kérelem esetén írj a": [
    "For privacy questions or access, erasure, restriction or objection requests, write to",
    "Bei Datenschutzfragen sowie Auskunfts-, Löschungs-, Einschränkungs- oder Widerspruchsanfragen schreibe an"
  ],
  "címre. Ha a kérés az OpenAI saját szolgáltatásában tárolt beszélgetési adatra vonatkozik, azt az OpenAI saját adatvédelmi felületein kell kezelni.": [
    ". Requests about conversation data stored by OpenAI’s own services must be handled through OpenAI’s privacy interfaces.",
    ". Anfragen zu Unterhaltungsdaten in OpenAI-Diensten sind über die Datenschutzoberflächen von OpenAI abzuwickeln."
  ],
  "További információ": [
    "Further information",
    "Weitere Informationen"
  ],
  "Általános adatvédelmi tájékoztató:": [
    "General privacy notice:",
    "Allgemeine Datenschutzhinweise:"
  ],
  "kalkulatorbazis.hu/adatvedelem": [
    "kalkulatorbazis.hu/adatvedelem",
    "kalkulatorbazis.hu/adatvedelem"
  ],
  "Kapcsolat:": [
    "Contact:",
    "Kontakt:"
  ],
  "kalkulatorbazis.hu/kapcsolat": [
    "kalkulatorbazis.hu/kapcsolat",
    "kalkulatorbazis.hu/kapcsolat"
  ],
  "Plugin használati feltételek:": [
    "Plugin terms of use:",
    "Plugin-Nutzungsbedingungen:"
  ],
  "kalkulatorbazis.hu/plugin-felhasznalasi-feltetelek": [
    "kalkulatorbazis.hu/plugin-felhasznalasi-feltetelek",
    "kalkulatorbazis.hu/plugin-felhasznalasi-feltetelek"
  ],
  "Utolsó frissítés: 2026. szeptember 6.": [
    "Last updated: 6 September 2026.",
    "Zuletzt aktualisiert: 6. September 2026."
  ],
  "Plugin adatvédelmi tájékoztató | Kalkulátor Bázis": [
    "Plugin Privacy Notice · Kalkulátor Bázis",
    "Plugin-Datenschutzhinweise · Kalkulátor Bázis"
  ],
  "A Kalkulátor Bázis ChatGPT és Codex plugin adatvédelmi tájékoztatója.": [
    "Privacy notice for the Kalkulátor Bázis ChatGPT and Codex plugin.",
    "Datenschutzhinweise für das ChatGPT- und Codex-Plugin von Kalkulátor Bázis."
  ],
  "Kalkulátor Bázis plugin – felhasználási feltételek": [
    "Kalkulátor Bázis plugin – terms of use",
    "Kalkulátor-Bázis-Plugin – Nutzungsbedingungen"
  ],
  "Ezek a feltételek a Kalkulátor Bázis ChatGPT- és Codex-kompatibilis, MCP-alapú pluginjának használatára vonatkoznak.": [
    "These terms apply to use of the MCP-based Kalkulátor Bázis plugin compatible with ChatGPT and Codex.",
    "Diese Bedingungen gelten für die Nutzung des MCP-basierten, mit ChatGPT und Codex kompatiblen Plugins von Kalkulátor Bázis."
  ],
  "A plugin jelenleg 2026-os magyar havi munkabérhez kapcsolódó tájékoztató számításokat biztosít: a támogatott szabályrendszer lekérését, bruttó bérből nettó becslést, valamint kívánt nettó összeghez szükséges bruttó becslést.": [
    "The plugin currently provides indicative calculations for Hungarian monthly salary in 2026: retrieving the supported rules, estimating net pay from gross salary and estimating gross salary needed for a desired net amount.",
    "Das Plugin bietet derzeit unverbindliche Berechnungen für ungarische Monatsgehälter im Jahr 2026: Abruf der unterstützten Regeln, Nettoschätzung aus Bruttogehalt und Schätzung des für einen gewünschten Nettobetrag nötigen Bruttogehalts."
  ],
  "Tájékoztató jelleg": [
    "For information only",
    "Unverbindliche Orientierung"
  ],
  "A plugin eredményei tájékoztató becslések. Nem minősülnek hivatalos bérszámfejtésnek, adótanácsadásnak, jogi tanácsadásnak, hatósági állásfoglalásnak vagy munkáltatói igazolásnak. Fontos pénzügyi vagy adózási döntés előtt ellenőrizd az aktuális hivatalos szabályokat vagy kérj megfelelő szakmai segítséget.": [
    "Plugin results are indicative estimates. They are not official payroll calculations, tax or legal advice, official interpretations or employer certificates. Before important financial or tax decisions, check current official rules or seek suitable professional help.",
    "Die Plugin-Ergebnisse sind unverbindliche Schätzungen. Sie sind keine offizielle Lohnabrechnung, Steuer- oder Rechtsberatung, behördliche Stellungnahme oder Arbeitgeberbescheinigung. Prüfe vor wichtigen Finanz- oder Steuerentscheidungen die aktuellen amtlichen Regeln oder hole geeignete fachliche Hilfe ein."
  ],
  "Jogosultságok megadása": [
    "Specifying eligibility",
    "Angabe von Anspruchsvoraussetzungen"
  ],
  "A plugin nem állapítja meg automatikusan, hogy a felhasználó jogosult-e valamely kedvezményre. A kedvezményeket kizárólag akkor veszi figyelembe, ha a felhasználó azokat kifejezetten megadja vagy megerősíti. A jogosultság valós fennállásának ellenőrzése a felhasználó felelőssége.": [
    "The plugin does not automatically establish entitlement to an allowance. It takes allowances into account only when explicitly provided or confirmed by the user. Verifying actual entitlement is the user’s responsibility.",
    "Das Plugin stellt Ansprüche auf Vergünstigungen nicht automatisch fest. Es berücksichtigt sie nur bei ausdrücklicher Angabe oder Bestätigung durch den Nutzer. Die Prüfung des tatsächlichen Anspruchs liegt in der Verantwortung des Nutzers."
  ],
  "Támogatott hatókör": [
    "Supported scope",
    "Unterstützter Anwendungsbereich"
  ],
  "A jelenlegi verzió kizárólag a plugin által deklarált 2026-os magyar munkabér-modellt támogatja. A plugin nem használható úgy, mintha más adóévre, más országra, nyugdíjas munkavállalóra, CSED/GYED ellátásra, egyedi bérszámfejtési tételre vagy más, a tool metadata szerint nem támogatott helyzetre adna hivatalos eredményt.": [
    "The current version supports only the plugin’s declared 2026 Hungarian salary model. It must not be treated as providing official results for other tax years, countries, retired employees, CSED/GYED benefits, individual payroll items or situations unsupported by the tool metadata.",
    "Die aktuelle Version unterstützt ausschließlich das vom Plugin ausgewiesene ungarische Gehaltsmodell für 2026. Sie darf nicht als Quelle offizieller Ergebnisse für andere Steuerjahre, Länder, Beschäftigte im Ruhestand, CSED-/GYED-Leistungen, individuelle Abrechnungsposten oder laut Werkzeug-Metadaten nicht unterstützte Situationen verwendet werden."
  ],
  "Automatikus használat": [
    "Automated use",
    "Automatisierte Nutzung"
  ],
  "A Kalkulátor Bázis által közzétett és jóváhagyott MCP/plugin integrációkon keresztüli automatikus tool-hívások engedélyezett használatnak minősülnek. Tilos ugyanakkor a szolgáltatás túlterhelése, a rate limit megkerülése, a visszaélésszerű scraping, a biztonsági korlátozások kijátszása vagy a szolgáltatás működésének szándékos zavarása.": [
    "Automated tool calls through MCP/plugin integrations published and approved by Kalkulátor Bázis are permitted. Overloading the service, bypassing rate limits, abusive scraping, evading security restrictions or deliberately disrupting the service is prohibited.",
    "Automatisierte Werkzeugaufrufe über von Kalkulátor Bázis veröffentlichte und genehmigte MCP-/Plugin-Integrationen sind zulässig. Verboten sind Überlastung, Umgehen von Ratenbegrenzungen, missbräuchliches Scraping, Aushebeln von Sicherheitsbeschränkungen und absichtliche Betriebsstörungen."
  ],
  "A plugin adatkezelését a külön": [
    "The plugin’s data processing is explained in the separate",
    "Die Datenverarbeitung des Plugins erläutern die separaten"
  ],
  "plugin adatvédelmi tájékoztató": [
    "plugin privacy notice",
    "Plugin-Datenschutzhinweise"
  ],
  "ismerteti. A plugin használatához a Kalkulátor Bázisnál nem szükséges regisztráció.": [
    ". Using the plugin does not require registration with Kalkulátor Bázis.",
    ". Eine Registrierung bei Kalkulátor Bázis ist für die Nutzung des Plugins nicht erforderlich."
  ],
  "Felelősség korlátozása": [
    "Limitation of liability",
    "Haftungsbeschränkung"
  ],
  "A Kalkulátor Bázis törekszik a számítási szabályok és a szolgáltatás pontosságára, de nem vállal garanciát arra, hogy az eredmény minden egyedi élethelyzetet, jogszabály-értelmezést, munkáltatói gyakorlatot vagy későbbi változást lefed. A felhasználó a számítás eredményét saját felelősségére használja.": [
    "Kalkulátor Bázis aims for accurate calculation rules and service operation, but does not guarantee coverage of every individual circumstance, legal interpretation, employer practice or later change. Users rely on results at their own risk.",
    "Kalkulátor Bázis bemüht sich um genaue Berechnungsregeln und einen zuverlässigen Dienst, garantiert jedoch nicht, dass Ergebnisse jeden Einzelfall, jede Rechtsauslegung, Arbeitgeberpraxis oder spätere Änderung abdecken. Die Nutzung der Ergebnisse erfolgt auf eigene Verantwortung."
  ],
  "Szellemi tulajdon": [
    "Intellectual property",
    "Geistiges Eigentum"
  ],
  "A Kalkulátor Bázis neve, saját tartalmai, számítási implementációja és kapcsolódó anyagai szerzői jogi és egyéb vonatkozó védelem alatt állhatnak. A plugin használata nem ad jogot a szolgáltatás vagy a márka megtévesztő másolására vagy OpenAI által támogatottként való jogosulatlan feltüntetésére.": [
    "The Kalkulátor Bázis name, original content, calculation implementation and related material may be protected by copyright and other applicable rights. Plugin use does not grant permission to misleadingly copy the service or brand or to falsely present it as endorsed by OpenAI.",
    "Der Name Kalkulátor Bázis, eigene Inhalte, Berechnungsimplementierungen und zugehörige Materialien können urheberrechtlich und anderweitig geschützt sein. Die Plugin-Nutzung berechtigt nicht zur irreführenden Nachahmung von Dienst oder Marke oder zur unberechtigten Darstellung als von OpenAI unterstützt."
  ],
  "Módosítás és elérhetőség": [
    "Changes and availability",
    "Änderungen und Verfügbarkeit"
  ],
  "A plugin funkciói, támogatott szabályai és jelen feltételek a szolgáltatás fejlődésével módosulhatnak. Jelentős változás esetén a közzétett dokumentum frissül.": [
    "Plugin features, supported rules and these terms may change as the service develops. The published document is updated for significant changes.",
    "Funktionen, unterstützte Regeln und diese Bedingungen können sich mit der Weiterentwicklung des Dienstes ändern. Bei wesentlichen Änderungen wird das veröffentlichte Dokument aktualisiert."
  ],
  "Kapcsolati oldal:": [
    "Contact page:",
    "Kontaktseite:"
  ],
  "Plugin felhasználási feltételek | Kalkulátor Bázis": [
    "Plugin Terms of Use · Kalkulátor Bázis",
    "Plugin-Nutzungsbedingungen · Kalkulátor Bázis"
  ],
  "A Kalkulátor Bázis ChatGPT és Codex plugin használati feltételei.": [
    "Terms of use for the Kalkulátor Bázis ChatGPT and Codex plugin.",
    "Nutzungsbedingungen für das ChatGPT- und Codex-Plugin von Kalkulátor Bázis."
  ],
  "Működés, források és korlátok": [
    "Operation, sources and limitations",
    "Betrieb, Quellen und Grenzen"
  ],
  "A Kalkulátor Bázis célja, hogy ingyenesen használható, közérthető és átlátható online kalkulátorokat biztosítson pénzügyi, egészségügyi, autós, építőipari és hétköznapi számításokhoz.": [
    "Kalkulátor Bázis aims to provide free, understandable and transparent online calculators for financial, health, car, construction and everyday calculations.",
    "Kalkulátor Bázis möchte kostenlose, verständliche und transparente Online-Rechner für Finanz-, Gesundheits-, Auto-, Bau- und Alltagsberechnungen bereitstellen."
  ],
  "Fontos számunkra, hogy a látogatók ne csak egy eredményt kapjanak, hanem megértsék azt is, hogyan készült a számítás, milyen adatokon alapul, és milyen korlátai lehetnek.": [
    "We want visitors not only to receive a result, but also to understand how it was calculated, what data it uses and what limitations may apply.",
    "Besucher sollen nicht nur ein Ergebnis erhalten, sondern auch verstehen, wie es berechnet wurde, auf welchen Daten es beruht und welche Grenzen gelten können."
  ],
  "Biztonságos kapcsolat": [
    "Secure connection",
    "Sichere Verbindung"
  ],
  "A nyilvános weboldal HTTPS-kapcsolaton keresztül érhető el, ezért a böngésző és a webhely közötti adatforgalom titkosított csatornán halad. Ez a kapcsolat védelmét segíti, de önmagában nem igazolja egy számítás szakmai pontosságát.": [
    "The public website uses HTTPS, so browser-to-site traffic travels through an encrypted channel. This protects the connection but does not itself verify the professional accuracy of calculations.",
    "Die öffentliche Website verwendet HTTPS; der Datenverkehr zwischen Browser und Website läuft daher verschlüsselt. Dies schützt die Verbindung, bestätigt aber nicht die fachliche Genauigkeit einer Berechnung."
  ],
  "Egy külső biztonsági vagy bizalmi jelvény pillanatnyi technikai jelzés lehet. Nem jelenti azt, hogy a jelvény szolgáltatója a kalkulátorok képleteit, szakmai tartalmát vagy eredményeit hitelesítette.": [
    "An external security or trust badge may indicate technical status at a moment in time. It does not mean its provider has certified calculator formulas, professional content or results.",
    "Ein externes Sicherheits- oder Vertrauenssiegel kann den momentanen technischen Zustand anzeigen. Es bedeutet nicht, dass der Anbieter Formeln, fachliche Inhalte oder Rechenergebnisse zertifiziert hat."
  ],
  "A kalkulátorok működése": [
    "How calculators work",
    "Funktionsweise der Rechner"
  ],
  "A kalkulátorok képletek, számítási szabályok és nyilvánosan elérhető adatok alapján működnek. Ahol a téma indokolja, az oldalon megjelenhet a képlet, a számítási logika, az eredmény értelmezése és a módszer korlátja.": [
    "Calculators use formulas, calculation rules and publicly available data. Where relevant, a page may explain the formula, calculation logic, interpretation and limitations.",
    "Die Rechner verwenden Formeln, Berechnungsregeln und öffentlich verfügbare Daten. Wo es zum Thema passt, erläutert die Seite Formel, Berechnungslogik, Ergebnisdeutung und Methodengrenzen."
  ],
  "Az eredmény a felhasználó által megadott adatokból készül. Hibás, hiányos vagy nem megfelelő mértékegységben megadott érték eltérő eredményhez vezethet. A jogszabályhoz, adókulcshoz vagy más időben változó adathoz kötött kalkulátorok rendszeres felülvizsgálatot igényelnek.": [
    "Results use the data supplied by the user. Incorrect, incomplete or wrongly unit-labelled values can lead to different results. Calculators tied to legislation, tax rates or other changing data require regular review.",
    "Ergebnisse beruhen auf den Nutzereingaben. Falsche, unvollständige oder in ungeeigneten Einheiten angegebene Werte können zu abweichenden Ergebnissen führen. Rechner zu Rechtsvorschriften, Steuersätzen oder anderen veränderlichen Daten müssen regelmäßig geprüft werden."
  ],
  "A részletes bizalmi és minőségbiztosítási alapelveket külön oldalon is összefoglaltuk:": [
    "We also explain our trust and quality-assurance principles on a separate page:",
    "Unsere Vertrauens- und Qualitätssicherungsgrundsätze erläutern wir auch auf einer eigenen Seite:"
  ],
  "miért bízhatsz a Kalkulátor Bázisban?": [
    "why trust Kalkulátor Bázis?",
    "Warum Kalkulátor Bázis vertrauen?"
  ],
  "Frissítések és ellenőrzések": [
    "Updates and checks",
    "Aktualisierungen und Prüfungen"
  ],
  "A kalkulátorok és magyarázó tartalmak folyamatos fejlesztés alatt állnak. Törekszünk a technikai hibák, pontatlan adatok, hibás linkek és félreérthető szövegek javítására.": [
    "Calculators and explanatory content are continuously developed. We work to correct technical faults, inaccurate data, broken links and ambiguous wording.",
    "Rechner und Erläuterungen werden laufend weiterentwickelt. Wir bemühen uns, technische Fehler, ungenaue Daten, defekte Links und missverständliche Formulierungen zu korrigieren."
  ],
  "Időszakosan változó szabályoknál az alkalmazott év, a számítás alapjául szolgáló szabály vagy forrás, valamint valódi tartalmi ellenőrzés után annak dátuma is megjelenhet. Nem használunk automatikusan minden oldalon azonos frissítési dátumot.": [
    "For rules that change periodically, pages may show the year used, the underlying rule or source, and a review date after an actual content check. We do not automatically apply the same update date to every page.",
    "Bei regelmäßig veränderlichen Regeln können das verwendete Jahr, die zugrunde liegende Regel oder Quelle und nach einer tatsächlichen Inhaltsprüfung deren Datum erscheinen. Wir setzen nicht automatisch auf allen Seiten dasselbe Aktualisierungsdatum."
  ],
  "Adatvédelem és sütikezelés": [
    "Privacy and cookie handling",
    "Datenschutz und Cookie-Verwaltung"
  ],
  "A kalkulátorok alapvetően regisztráció nélkül használhatók. A webhely működéséhez, méréséhez és hirdetéseihez kapcsolódó adatkezelés részleteit a külön tájékoztatók tartalmazzák.": [
    "Calculators generally require no registration. Separate notices explain data processing relating to operation, measurement and advertising.",
    "Die Rechner sind grundsätzlich ohne Registrierung nutzbar. Separate Hinweise erläutern die Datenverarbeitung für Betrieb, Messung und Werbung."
  ],
  "Sütikezelési tájékoztató": [
    "Cookie notice",
    "Cookie-Hinweise"
  ],
  "Szakmai korlátok": [
    "Professional limitations",
    "Fachliche Grenzen"
  ],
  "A pénzügyi eredmények tájékoztató jellegű becslések. Nem minősülnek személyre szabott pénzügyi vagy befektetési tanácsadásnak, hitelajánlatnak, adótanácsadásnak vagy garantált pénzügyi eredménynek.": [
    "Financial results are indicative estimates. They are not personalised financial or investment advice, loan offers, tax advice or guaranteed financial outcomes.",
    "Finanzergebnisse sind unverbindliche Schätzungen. Sie sind keine individuelle Finanz- oder Anlageberatung, Kreditangebote, Steuerberatung oder garantierten finanziellen Ergebnisse."
  ],
  "Tényleges döntés előtt banki, könyvelői, adótanácsadói vagy más megfelelő szakértői ellenőrzésre lehet szükség.": [
    "Before an actual decision, checks by banking, accounting, tax or other appropriate professionals may be needed.",
    "Vor einer tatsächlichen Entscheidung kann eine Prüfung durch Bank-, Buchhaltungs-, Steuer- oder andere geeignete Fachleute erforderlich sein."
  ],
  "Egészségügyi kalkulátorok": [
    "Health calculators",
    "Gesundheitsrechner"
  ],
  "Az egészségügyi kalkulátorok általános tájékoztatást adnak. Az eredmény nem diagnózis, nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot, és sürgős helyzet megítélésére nem alkalmas.": [
    "Health calculators provide general information. Results are not diagnoses, do not replace medical examinations or individual treatment recommendations, and cannot assess emergencies.",
    "Gesundheitsrechner liefern allgemeine Informationen. Ergebnisse sind keine Diagnosen, ersetzen weder ärztliche Untersuchungen noch individuelle Behandlungsempfehlungen und eignen sich nicht zur Beurteilung von Notfällen."
  ],
  "Panasz vagy bizonytalanság esetén kérj segítséget megfelelő egészségügyi szakembertől.": [
    "For symptoms or uncertainty, seek help from an appropriate healthcare professional.",
    "Suche bei Beschwerden oder Unsicherheit Hilfe bei geeigneten medizinischen Fachleuten."
  ],
  "Függetlenség és partneri tartalmak": [
    "Independence and affiliate content",
    "Unabhängigkeit und Partnerinhalte"
  ],
  "A weboldalon partneri vagy affiliate hivatkozások jelenhetnek meg. Ha egy látogató ilyen hivatkozáson keresztül regisztrál vagy szolgáltatást vesz igénybe, a Kalkulátor Bázis jutalékot kaphat. Ez a látogató számára jellemzően nem jelent magasabb árat.": [
    "The website may display partner or affiliate links. If a visitor registers or uses a service through one, Kalkulátor Bázis may receive a commission. This generally does not increase the visitor’s price.",
    "Die Website kann Partner- oder Affiliate-Links anzeigen. Registriert sich ein Besucher darüber oder nutzt einen Dienst, kann Kalkulátor Bázis eine Provision erhalten. Der Preis erhöht sich dadurch normalerweise nicht."
  ],
  "A partneri ajánlásokat egyértelműen jelöljük. A partneri kapcsolat önmagában nem jelenti azt, hogy az adott szolgáltatás minden látogató helyzetéhez vagy céljához megfelelő.": [
    "We clearly label affiliate recommendations. An affiliate relationship alone does not mean a service is suitable for every visitor’s situation or goals.",
    "Partnerempfehlungen werden eindeutig gekennzeichnet. Eine Partnerschaft allein bedeutet nicht, dass ein Dienst für die Situation oder Ziele jedes Besuchers geeignet ist."
  ],
  "Technikai minőség": [
    "Technical quality",
    "Technische Qualität"
  ],
  "A fejlesztés során törekszünk mobilbarát működésre, gyors betöltésre, szabványos HTML- és CSS-kódra, akadálymentesebb használhatóságra, érthető űrlapokra, jól látható visszajelzésekre és hibamentes belső linkekre.": [
    "Development aims for mobile-friendly operation, fast loading, standards-compliant HTML and CSS, improved accessibility, understandable forms, visible feedback and working internal links.",
    "Bei der Entwicklung streben wir mobile Nutzbarkeit, schnelle Ladezeiten, standardkonformes HTML und CSS, bessere Barrierefreiheit, verständliche Formulare, sichtbare Rückmeldungen und funktionierende interne Links an."
  ],
  "A keresőmotorok számára átlátható oldalszerkezetet, egyedi metaadatokat és helyes canonical hivatkozásokat tartunk fenn. Külső ellenőrző eszközök eredményei mindig egy adott pillanat állapotát mutatják, és nem jelentenek teljes körű szakmai vagy jogi tanúsítást.": [
    "We maintain clear page structure, unique metadata and correct canonical links for search engines. External checking tools show a snapshot and do not constitute comprehensive professional or legal certification.",
    "Für Suchmaschinen pflegen wir eine klare Seitenstruktur, individuelle Metadaten und korrekte Canonical-Links. Externe Prüfwerkzeuge zeigen eine Momentaufnahme und sind keine umfassende fachliche oder rechtliche Zertifizierung."
  ],
  "Visszajelzés": [
    "Feedback",
    "Rückmeldung"
  ],
  "Hibabejelentés, észrevétel és panasz": [
    "Bug reports, comments and complaints",
    "Fehlermeldungen, Hinweise und Beschwerden"
  ],
  "A gondos ellenőrzés ellenére előfordulhat technikai hiba, pontatlan adat vagy félreérthető megfogalmazás.": [
    "Despite careful checks, technical faults, inaccurate data and ambiguous wording may occur.",
    "Trotz sorgfältiger Prüfung können technische Fehler, ungenaue Daten oder missverständliche Formulierungen vorkommen."
  ],
  "Írj nekünk, ha egy kalkulátor nem működik, az eredmény hibásnak tűnik, elavult adatot, nem egyértelmű szöveget vagy hibás linket találsz, illetve észrevételed vagy panaszod van.": [
    "Write to us if a calculator fails, a result appears wrong, data are outdated, wording is unclear, a link is broken, or you have comments or complaints.",
    "Schreibe uns, wenn ein Rechner nicht funktioniert, ein Ergebnis falsch erscheint, Daten veraltet, Texte unklar oder Links defekt sind oder du Hinweise oder Beschwerden hast."
  ],
  "Segít, ha megadod": [
    "It helps if you provide",
    "Hilfreich sind"
  ],
  "az érintett kalkulátor nevét;": [
    "the calculator’s name;",
    "Der Name des betroffenen Rechners;"
  ],
  "az oldal URL-jét;": [
    "the page URL;",
    "Die Seiten-URL;"
  ],
  "a megadott adatokat és a kapott eredményt;": [
    "the inputs and result;",
    "Die Eingaben und das Ergebnis;"
  ],
  "a feltételezett hiba rövid leírását;": [
    "a short description of the suspected problem;",
    "Eine kurze Beschreibung des vermuteten Fehlers;"
  ],
  "lehetőség szerint képernyőképet.": [
    "a screenshot if possible.",
    "Wenn möglich ein Bildschirmfoto."
  ],
  "E-mail küldése": [
    "Send email",
    "E-Mail senden"
  ],
  "Az oldal utolsó frissítése:": [
    "Page last updated:",
    "Seite zuletzt aktualisiert:"
  ],
  "2026. június 23.": [
    "23 June 2026.",
    "23. Juni 2026."
  ],
  "Mit érdemes ellenőrizni az eredménynél?": [
    "What should you check about a result?",
    "Was solltest du beim Ergebnis prüfen?"
  ],
  "A kalkulátor eredménye akkor értelmezhető jól, ha a bemenetek, a feltételezések és az esetleges korlátok is egyértelműek.": [
    "A calculator result is easier to interpret when inputs, assumptions and limitations are clear.",
    "Ein Rechenergebnis lässt sich gut einordnen, wenn Eingaben, Annahmen und mögliche Grenzen klar sind."
  ],
  "Ellenőrizd a megadott értékeket és mértékegységeket.": [
    "Check the values and units entered.",
    "Prüfe die eingegebenen Werte und Einheiten."
  ],
  "Szabály- vagy adatfüggő számításnál nézd meg az évszámot és a hivatkozott forrást.": [
    "For rule- or data-dependent calculations, check the year and cited source.",
    "Prüfe bei regel- oder datenabhängigen Berechnungen das Jahr und die angegebene Quelle."
  ],
  "Vedd figyelembe, ha az eredmény kerekített érték vagy becslés.": [
    "Allow for rounding or estimation in the result.",
    "Beachte, ob das Ergebnis gerundet oder geschätzt ist."
  ],
  "Egyedi élethelyzetnél nézd meg, mely körülményeket nem kezeli a kalkulátor.": [
    "For individual circumstances, check what the calculator does not account for.",
    "Prüfe bei besonderen Lebenssituationen, welche Umstände der Rechner nicht berücksichtigt."
  ],
  "A konkrét képletet, forrást és korlátokat az adott kalkulátor oldalán találod.": [
    "The relevant calculator page provides its formula, sources and limitations.",
    "Die konkrete Formel, Quellen und Grenzen stehen auf der jeweiligen Rechnerseite."
  ],
  "Minőségi kontroll": [
    "Quality control",
    "Qualitätskontrolle"
  ],
  "Nem minden oldal ugyanazt a minőségi ellenőrzést igényli": [
    "Different pages need different quality checks",
    "Nicht jede Seite benötigt dieselbe Qualitätsprüfung"
  ],
  "Egyszerű matematika": [
    "Basic mathematics",
    "Einfache Mathematik"
  ],
  "Pontosság, mértékegység, kerekítés, hibás bemenet és érthető példa.": [
    "Accuracy, units, rounding, invalid inputs and an understandable example.",
    "Genauigkeit, Einheiten, Rundung, fehlerhafte Eingaben und ein verständliches Beispiel."
  ],
  "Pénzügy / adó": [
    "Finance / tax",
    "Finanzen / Steuern"
  ],
  "Forrás, évszám, szabályváltozás, feltételezés és felelősségi korlát.": [
    "Sources, year, rule changes, assumptions and liability limits.",
    "Quellen, Jahr, Regeländerungen, Annahmen und Haftungsgrenzen."
  ],
  "Módszer eredeti célja, populáció, bizonytalanság és világos nem-diagnosztikai keret.": [
    "The method’s original purpose, population, uncertainty and a clear non-diagnostic framework.",
    "Ursprünglicher Methodenzweck, Zielpopulation, Unsicherheit und eine klare Abgrenzung zur Diagnose."
  ],
  "Építés / autó": [
    "Construction / cars",
    "Bau / Auto"
  ],
  "Gyártói vagy járműspecifikus eltérés, ráhagyás, kompatibilitás és kivitelezési biztonsági határ.": [
    "Manufacturer or vehicle differences, allowances, compatibility and construction safety limits.",
    "Hersteller- oder fahrzeugspezifische Abweichungen, Zuschläge, Kompatibilität und Sicherheitsgrenzen der Ausführung."
  ],
  "Átváltó": [
    "Converter",
    "Umrechner"
  ],
  "Egységdefiníció, lineáris/eltolt skála, pontosság és fogalmi félreértés.": [
    "Unit definitions, linear or offset scales, precision and conceptual misunderstandings.",
    "Einheitendefinitionen, lineare oder verschobene Skalen, Genauigkeit und begriffliche Missverständnisse."
  ],
  "Landing / útmutató": [
    "Landing page / guide",
    "Themenseite / Leitfaden"
  ],
  "Ne ismételje a kalkulátorokat; rendezze őket valódi döntési sorrendbe.": [
    "Do not repeat calculators; arrange them in a practical decision sequence.",
    "Rechner nicht wiederholen, sondern in eine echte Entscheidungsreihenfolge bringen."
  ],
  "Átláthatóság és minőség | Kalkulátor Bázis": [
    "Transparency and Quality · Kalkulátor Bázis",
    "Transparenz und Qualität · Kalkulátor Bázis"
  ],
  "Ismerd meg, hogyan készülnek a Kalkulátor Bázis kalkulátorai, hogyan kezeljük a frissítéseket, a biztonságot, a hibabejelentéseket és a partneri tartalmakat.": [
    "Learn how Kalkulátor Bázis calculators are built and how we handle updates, security, bug reports and affiliate content.",
    "Erfahre, wie die Rechner von Kalkulátor Bázis entstehen und wie wir Aktualisierungen, Sicherheit, Fehlermeldungen und Partnerinhalte handhaben."
  ],
  "Bizalom és módszertan": [
    "Trust and methodology",
    "Vertrauen und Methodik"
  ],
  "Miért bízhatsz a Kalkulátor Bázisban?": [
    "Why trust Kalkulátor Bázis?",
    "Warum Kalkulátor Bázis vertrauen?"
  ],
  "A Kalkulátor Bázis célja, hogy a számítás ne egy fekete doboz legyen. Az oldalak nem csak eredményt adnak, hanem segítenek megérteni a bemeneti adatokat, a képlet logikáját, a kerekítést és azokat a helyzeteket is, amikor az eredmény csak óvatosan használható.": [
    "Kalkulátor Bázis aims to make calculations understandable rather than a black box. Pages explain inputs, formula logic, rounding and situations where results need caution, as well as displaying results.",
    "Kalkulátor Bázis möchte Berechnungen nachvollziehbar statt undurchsichtig machen. Die Seiten zeigen nicht nur Ergebnisse, sondern erklären Eingaben, Formellogik, Rundungen und Situationen, in denen Ergebnisse vorsichtig zu verwenden sind."
  ],
  "A bizalom nálunk nem jelvény vagy marketingígéret, hanem követhető működés: átlátható módszertan, elsődleges forrásokra törekvő hivatkozás, hibabejelentési lehetőség, adatvédelmi tájékoztatás és folyamatos javítás.": [
    "Trust here means traceable operation, not a badge or marketing promise: transparent methods, references aiming at primary sources, bug reporting, privacy information and ongoing improvements.",
    "Vertrauen bedeutet hier nachvollziehbaren Betrieb statt Siegel oder Werbeversprechen: transparente Methodik, möglichst primäre Quellen, Fehlermeldungen, Datenschutzhinweise und laufende Verbesserungen."
  ],
  "Hogyan készülnek a kalkulátorok?": [
    "How are calculators created?",
    "Wie entstehen die Rechner?"
  ],
  "Minden új vagy átdolgozott kalkulátornál először azt tisztázzuk, milyen döntési helyzetben használja majd a látogató. Egy hiteloldalnál például a havi teherbírás, egy építőipari oldalon az anyagveszteség, egy egészségügyi oldalon pedig a módszer korlátja lehet a legfontosabb.": [
    "For every new or revised calculator, we first identify the visitor’s decision. Monthly affordability may be central for a loan page, material waste for construction, or method limitations for health topics.",
    "Bei jedem neuen oder überarbeiteten Rechner klären wir zuerst die Entscheidungssituation. Bei Krediten kann die monatliche Tragfähigkeit entscheidend sein, beim Bauen der Materialverlust und bei Gesundheitsthemen die Methodengrenze."
  ],
  "A fejlesztés során a működő számítási logikát külön kezeljük a magyarázó tartalomtól. Ha egy képlet már jól működik, nem cseréljük le csak azért, mert másképp is meg lehetne írni. A cél a megbízható, érthető és mobilon is kényelmes használat.": [
    "Development separates calculation logic from explanatory content. A working formula is not replaced merely because it could be written differently. The aim is reliable, understandable and comfortable mobile use.",
    "Die Entwicklung trennt Berechnungslogik von erklärenden Inhalten. Eine funktionierende Formel wird nicht nur deshalb ersetzt, weil man sie anders schreiben könnte. Ziel ist eine zuverlässige, verständliche und auch mobil bequeme Nutzung."
  ],
  "Hogyan ellenőrizzük?": [
    "How do we check them?",
    "Wie prüfen wir sie?"
  ],
  "A módosítások után statikus auditot, belső linkellenőrzést, strukturáltadat-ellenőrzést és böngészős működési tesztet végzünk. Kiemelten figyeljük, hogy ne sérüljön a canonical URL, a sitemap, a mobilos használhatóság, a konzolhibák száma és a számítási eredmény.": [
    "After changes, we perform static audits, internal-link and structured-data checks, and browser functionality tests. We particularly monitor canonical URLs, sitemaps, mobile usability, console errors and calculation results.",
    "Nach Änderungen erfolgen statische Audits, Prüfungen interner Links und strukturierter Daten sowie Browser-Funktionstests. Besonders beachten wir Canonical-URLs, Sitemap, mobile Nutzbarkeit, Konsolenfehler und Rechenergebnisse."
  ],
  "Ahol jogszabály, árfolyam, adókulcs, egészségügyi határérték vagy gyártói adat változhat, az oldalon különösen fontos a frissítési dátum és a forrás. Nem használunk minden oldalon automatikusan ugyanazt az ellenőrzési dátumot, mert az hamis bizalmat keltene.": [
    "For changing laws, exchange rates, tax rates, health thresholds or manufacturer data, dates and sources are particularly important. We do not automatically give every page the same review date, as that would create false confidence.",
    "Bei veränderlichen Gesetzen, Wechselkursen, Steuersätzen, Gesundheitsgrenzen oder Herstellerdaten sind Datum und Quelle besonders wichtig. Wir vergeben nicht automatisch auf allen Seiten dasselbe Prüfdatum, da dies falsches Vertrauen schaffen würde."
  ],
  "Források és módszertan": [
    "Sources and methodology",
    "Quellen und Methodik"
  ],
  "A forrás nem lehet pusztán „internet” vagy „Google”. Pénzügyi témáknál hivatalos intézményi információkra, például NAV-, MNB- vagy KSH-adatokra törekszünk. Egészségügyi témáknál a WHO, NIH, Mayo Clinic vagy hazai szakmai/hivatali forrás lehet releváns. Építőipari kalkulátoroknál a gyártói adatlap és a kivitelezési veszteség sokszor fontosabb, mint egy általános képlet.": [
    "A source cannot simply be “the internet” or “Google”. For finance, we seek official institutional information such as NAV, MNB or KSH data. For health, WHO, NIH, Mayo Clinic or Hungarian professional and official sources may be relevant. For construction, manufacturer data sheets and application losses often matter more than a general formula.",
    "Eine Quelle kann nicht einfach „Internet“ oder „Google“ heißen. Bei Finanzthemen suchen wir amtliche Angaben wie NAV-, MNB- oder KSH-Daten. Bei Gesundheit können WHO, NIH, Mayo Clinic oder ungarische Fach- und Behördenquellen relevant sein. Beim Bauen sind Herstellerdatenblatt und Verarbeitungsverluste oft wichtiger als eine allgemeine Formel."
  ],
  "A források használata nem jelenti azt, hogy az adott intézmény vagy gyártó hitelesítette a Kalkulátor Bázist. A hivatkozás célja az ellenőrizhetőség és a felhasználó tájékoztatása.": [
    "Using these sources does not mean an institution or manufacturer has certified Kalkulátor Bázis. References support verification and inform users.",
    "Die Nutzung dieser Quellen bedeutet keine Zertifizierung von Kalkulátor Bázis durch die jeweilige Institution oder den Hersteller. Verweise dienen der Nachprüfbarkeit und Nutzerinformation."
  ],
  "Minőségi alapelvek": [
    "Quality principles",
    "Qualitätsgrundsätze"
  ],
  "Experience": [
    "Experience",
    "Erfahrung"
  ],
  "Valós használati helyzetekből indulunk ki: havi költségvetés, felújítás, utazás, vásárlás, testtömeg vagy időtervezés.": [
    "We start from real uses: monthly budgets, renovation, travel, shopping, body weight and time planning.",
    "Wir gehen von echten Nutzungssituationen aus: Monatsbudget, Renovierung, Reisen, Einkauf, Körpergewicht und Zeitplanung."
  ],
  "Expertise": [
    "Expertise",
    "Fachwissen"
  ],
  "A képleteket, kerekítéseket és korlátokat külön magyarázzuk, hogy az eredmény ne önmagában álló szám legyen.": [
    "We separately explain formulas, rounding and limitations so results are more than isolated numbers.",
    "Wir erklären Formeln, Rundungen und Grenzen gesondert, damit Ergebnisse nicht bloß isolierte Zahlen sind."
  ],
  "Authoritativeness": [
    "Authoritativeness",
    "Fachliche Autorität"
  ],
  "Elsődleges, hivatalos vagy szakmailag megbízható forrásokat keresünk, és kerülünk minden túlzó pontossági ígéretet.": [
    "We seek primary, official or professionally reliable sources and avoid exaggerated promises of accuracy.",
    "Wir suchen primäre, amtliche oder fachlich zuverlässige Quellen und vermeiden überzogene Genauigkeitsversprechen."
  ],
  "Trustworthiness": [
    "Trustworthiness",
    "Vertrauenswürdigkeit"
  ],
  "Nyílt kapcsolatot, hibabejelentést, adatvédelmi tájékoztatást, valamint egyértelmű jogi és felhasználási kereteket biztosítunk.": [
    "We provide open contact, bug reporting, privacy information and clear legal and usage frameworks.",
    "Wir ermöglichen direkten Kontakt, Fehlermeldungen, Datenschutzinformationen und klare rechtliche sowie nutzungsbezogene Rahmenbedingungen."
  ],
  "Mikor lehet hibás vagy félrevezető az eredmény?": [
    "When can a result be wrong or misleading?",
    "Wann kann ein Ergebnis falsch oder irreführend sein?"
  ],
  "A kalkulátor eredménye a megadott bemeneti adatokból készül. Ha rossz mértékegység, elavult adat, hibás ár, eltérő szerződéses feltétel vagy különleges élethelyzet szerepel a háttérben, a számítás eltérhet a valóságtól.": [
    "Results depend on inputs. Wrong units, outdated data, incorrect prices, different contract terms or special circumstances can make the calculation differ from reality.",
    "Ergebnisse beruhen auf Eingaben. Falsche Einheiten, veraltete Daten, fehlerhafte Preise, abweichende Vertragsbedingungen oder besondere Umstände können zu Abweichungen von der Realität führen."
  ],
  "Pénzügyi, adózási, jogi, orvosi vagy kivitelezési döntésnél ezért az eredmény kiindulópont, nem végleges döntés. Ahol nagy összeg, egészségügyi kockázat vagy jogi következmény merül fel, érdemes hivatalos forrást vagy szakembert bevonni.": [
    "For financial, tax, legal, medical or construction decisions, results are therefore starting points, not final decisions. Where large sums, health risks or legal consequences are involved, consult official sources or professionals.",
    "Bei Finanz-, Steuer-, Rechts-, Medizin- oder Bauentscheidungen sind Ergebnisse daher Ausgangspunkte, keine endgültigen Entscheidungen. Bei großen Beträgen, Gesundheitsrisiken oder rechtlichen Folgen sollten amtliche Quellen oder Fachleute einbezogen werden."
  ],
  "Adatvédelem és ingyenesség": [
    "Privacy and free access",
    "Datenschutz und kostenlose Nutzung"
  ],
  "A kalkulátorok regisztráció nélkül használhatók. A számítások többsége a böngészőben történik, a mezőkbe írt adatokat nem kérjük el fiókregisztrációval. A sütik, mérési eszközök és hirdetési hozzájárulások működését külön tájékoztatók írják le.": [
    "Calculators need no registration. Most calculations run in the browser; we do not collect inputs through account registration. Separate notices explain cookies, measurement tools and advertising consent.",
    "Die Rechner benötigen keine Registrierung. Die meisten Berechnungen laufen im Browser; wir erheben Eingaben nicht über eine Kontoregistrierung. Separate Hinweise erläutern Cookies, Messwerkzeuge und Werbeeinwilligungen."
  ],
  "A Kalkulátor Bázis eredményei hivatalos állásfoglalásnak számítanak?": [
    "Are Kalkulátor Bázis results official interpretations?",
    "Sind die Ergebnisse von Kalkulátor Bázis amtliche Stellungnahmen?"
  ],
  "Nem. Az eredmények tájékoztató becslések, és nem helyettesítik a banki, könyvelői, jogi, orvosi vagy más szakértői ellenőrzést.": [
    "No. Results are indicative estimates and do not replace checks by banking, accounting, legal, medical or other professionals.",
    "Nein. Ergebnisse sind unverbindliche Schätzungen und ersetzen keine Prüfung durch Bank-, Buchhaltungs-, Rechts-, Medizin- oder andere Fachleute."
  ],
  "Milyen forrásokra támaszkodnak a kalkulátorok?": [
    "What sources do the calculators use?",
    "Auf welche Quellen stützen sich die Rechner?"
  ],
  "Ahol a téma indokolja, elsődleges vagy szakmailag megbízható forrásokat használunk, például hivatalos hatósági, szakmai vagy gyártói adatokat.": [
    "Where relevant, we use primary or professionally reliable sources, such as official authority, professional or manufacturer data.",
    "Wo es zum Thema passt, verwenden wir primäre oder fachlich zuverlässige Quellen, etwa amtliche Behörden-, Fach- oder Herstellerangaben."
  ],
  "Mit tehetek, ha hibát találok?": [
    "What can I do if I find a fault?",
    "Was kann ich bei einem Fehler tun?"
  ],
  "Írj a kalkulatorbazis@gmail.com címre az érintett oldal URL-jével, a megadott adatokkal és a kapott eredménnyel.": [
    "Email kalkulatorbazis@gmail.com with the page URL, input data and result.",
    "Schreibe an kalkulatorbazis@gmail.com und nenne Seiten-URL, Eingaben und Ergebnis."
  ],
  "Hibajavítás": [
    "Fixing faults",
    "Fehlerkorrektur"
  ],
  "Segíts pontosítani": [
    "Help improve accuracy",
    "Hilf, die Genauigkeit zu verbessern"
  ],
  "Ha pontatlan eredményt, elavult adatot, törött linket vagy félreérthető magyarázatot találsz, jelezd nekünk. A visszajelzések alapján javítjuk és frissítjük az oldalakat.": [
    "Tell us about inaccurate results, outdated data, broken links or unclear explanations. We use feedback to correct and update pages.",
    "Melde ungenaue Ergebnisse, veraltete Daten, defekte Links oder unklare Erklärungen. Auf Grundlage der Rückmeldungen korrigieren und aktualisieren wir die Seiten."
  ],
  "Hasznos, ha elküldöd": [
    "It is useful to include",
    "Hilfreich sind"
  ],
  "az érintett oldal URL-jét;": [
    "the page URL;",
    "Die URL der betroffenen Seite;"
  ],
  "a megadott bemeneti értékeket;": [
    "the inputs entered;",
    "Die eingegebenen Werte;"
  ],
  "a kapott eredményt;": [
    "the result obtained;",
    "Das erhaltene Ergebnis;"
  ],
  "rövid leírást arról, mi tűnik hibásnak.": [
    "a brief description of what seems wrong.",
    "Eine kurze Beschreibung dessen, was falsch erscheint."
  ],
  "Ellenőrizhető bizalmi lánc": [
    "A verifiable chain of trust",
    "Eine überprüfbare Vertrauenskette"
  ],
  "A „bízz bennünk” helyett legyen ellenőrizhető, miből jött az eredmény": [
    "Instead of “trust us”, show where a result came from",
    "Statt „Vertrau uns“ nachvollziehbar machen, woher das Ergebnis kommt"
  ],
  "Forrás": [
    "Source",
    "Quelle"
  ],
  "Milyen képletből, szabályból, szabványból vagy gyártói adatból indul a számítás?": [
    "Which formula, rule, standard or manufacturer data underlies the calculation?",
    "Auf welcher Formel, Regel, Norm oder Herstellerangabe beruht die Berechnung?"
  ],
  "Implementáció": [
    "Implementation",
    "Implementierung"
  ],
  "A programkód ugyanazt a logikát hajtja-e végre, amit az oldal leír?": [
    "Does the code apply the same logic the page describes?",
    "Führt der Code dieselbe Logik aus, die die Seite beschreibt?"
  ],
  "Teszt": [
    "Test",
    "Test"
  ],
  "Ismert példák, szélsőértékek és hibás bemenetek mellett is érthetően működik-e?": [
    "Does it behave understandably for reference examples, extreme values and invalid inputs?",
    "Funktioniert es auch bei bekannten Beispielen, Extremwerten und ungültigen Eingaben nachvollziehbar?"
  ],
  "Korlát": [
    "Limitation",
    "Grenze"
  ],
  "Látható-e, mikor nem elég a kalkulátor és mikor kell más forrás vagy szakember?": [
    "Is it clear when the calculator is insufficient and other sources or professionals are needed?",
    "Ist erkennbar, wann der Rechner nicht ausreicht und andere Quellen oder Fachleute nötig sind?"
  ],
  "Frissítés": [
    "Update",
    "Aktualisierung"
  ],
  "Időérzékeny adat változásakor a képlet, szöveg és dátum együtt frissül-e?": [
    "When time-sensitive data change, are the formula, wording and date updated together?",
    "Werden bei Änderungen zeitabhängiger Daten Formel, Text und Datum gemeinsam aktualisiert?"
  ],
  "Miért bízhatsz bennünk? | Kalkulátor Bázis": [
    "Why Trust Us? · Kalkulátor Bázis",
    "Warum uns vertrauen? · Kalkulátor Bázis"
  ],
  "Ismerd meg, miért bízhatsz a Kalkulátor Bázisban: számítási módszertan, források, ellenőrzés, frissítések, adatvédelem és hibabejelentés.": [
    "Learn about trust at Kalkulátor Bázis: methods, sources, checks, updates, privacy and bug reporting.",
    "Erfahre mehr über Vertrauen bei Kalkulátor Bázis: Berechnungsmethoden, Quellen, Prüfungen, Aktualisierungen, Datenschutz und Fehlermeldungen."
  ],
  "Bemutatkozás": [
    "Introduction",
    "Vorstellung"
  ],
  "A Kalkulátor Bázis célja, hogy magyar nyelvű, ingyenesen használható online kalkulátorokat adjon hétköznapi, pénzügyi, autós, építőipari, egészségügyi és mértékegység-átváltási kérdésekhez.": [
    "Kalkulátor Bázis aims to provide free online calculators in Hungarian for everyday, financial, car, construction, health and unit-conversion questions.",
    "Kalkulátor Bázis möchte kostenlose Online-Rechner auf Ungarisch für Alltags-, Finanz-, Auto-, Bau-, Gesundheits- und Einheitenfragen anbieten."
  ],
  "Az oldal nem csak számokat szeretne mutatni: a fontosabb kalkulátoroknál rövid magyarázat, értelmezés, korlát és hibabejelentési lehetőség is segíti a használatot.": [
    "The website aims to offer more than numbers. Key calculators include short explanations, interpretation, limitations and bug-reporting options.",
    "Die Website möchte mehr als Zahlen bieten. Bei wichtigen Rechnern helfen kurze Erklärungen, Einordnungen, Grenzen und Fehlermeldemöglichkeiten."
  ],
  "Ki készíti az oldalt?": [
    "Who makes the website?",
    "Wer erstellt die Website?"
  ],
  "A Kalkulátor Bázist Kovács Patrik hozta létre és fejleszti. A cél egy áttekinthető kalkulátorportál építése, ahol a látogatók gyorsan elérik a gyakori számításokat, és közben azt is látják, mire jó és mire nem jó az adott eredmény.": [
    "Kalkulátor Bázis was created and is developed by Kovács Patrik. The aim is a clear calculator portal where visitors can quickly find common calculations and understand what each result can and cannot be used for.",
    "Kalkulátor Bázis wurde von Kovács Patrik gegründet und wird von ihm entwickelt. Ziel ist ein übersichtliches Rechnerportal, auf dem Besucher gängige Berechnungen schnell finden und erkennen, wofür das jeweilige Ergebnis geeignet ist und wofür nicht."
  ],
  "Nem állítjuk, hogy minden kalkulátort orvos, könyvelő, ügyvéd vagy pénzügyi tanácsadó ellenőrzött. A számítások nyilvánosan elérhető képleteken, hivatalos adatokon, szakmai forrásokon vagy egyszerű matematikai összefüggéseken alapulnak, a témától függően.": [
    "We do not claim every calculator has been reviewed by a doctor, accountant, lawyer or financial adviser. Depending on the topic, calculations use public formulas, official data, professional sources or simple mathematical relationships.",
    "Wir behaupten nicht, dass jeder Rechner von Ärzten, Buchhaltern, Anwälten oder Finanzberatern geprüft wurde. Je nach Thema beruhen Berechnungen auf öffentlich verfügbaren Formeln, amtlichen Daten, Fachquellen oder einfachen mathematischen Zusammenhängen."
  ],
  "Miben szeretnénk segíteni?": [
    "How do we aim to help?",
    "Wobei möchten wir helfen?"
  ],
  "Az oldal olyan helyzetekhez készült, amikor gyors ellenőrzésre vagy nagyságrendi becslésre van szükség: például mennyi festék kell egy szobához, hogyan változik egy ár százalékosan, mennyi lehet egy út üzemanyagköltsége, vagy mit jelent egy befektetési forgatókönyv hosszabb távon.": [
    "The website is designed for quick checks and approximate estimates, such as paint needed for a room, percentage price changes, a trip’s fuel cost or long-term investment scenarios.",
    "Die Website dient schnellen Prüfungen und groben Schätzungen, etwa zur Farbmenge für ein Zimmer, prozentualen Preisänderungen, Kraftstoffkosten einer Fahrt oder langfristigen Anlageszenarien."
  ],
  "A kalkulátorok eredményei tájékoztató jellegűek. Fontos döntésnél, egészségügyi kérdésnél, adózási vagy jogi ügyben, hitelfelvétel előtt, illetve nagyobb pénzügyi döntésnél mindig érdemes hivatalos forrást vagy megfelelő szakembert bevonni.": [
    "Calculator results are for information only. For important decisions, health, tax or legal matters, before borrowing or making larger financial decisions, consult official sources or appropriate professionals.",
    "Rechenergebnisse dienen der Orientierung. Bei wichtigen Entscheidungen, Gesundheits-, Steuer- oder Rechtsfragen, vor Krediten und größeren Finanzentscheidungen sollten amtliche Quellen oder geeignete Fachleute einbezogen werden."
  ],
  "Hogyan fejlődik a webhely?": [
    "How is the website developing?",
    "Wie entwickelt sich die Website weiter?"
  ],
  "A kalkulátorok és a magyarázó tartalmak folyamatosan bővülnek. A fejlesztés során külön figyelmet kap a mobilos használhatóság, az érthető űrlapfelépítés, az egyedi tartalom, a források feltüntetése és az, hogy a számítás korlátai ne maradjanak rejtve.": [
    "Calculators and explanations are continually expanded. Development focuses on mobile usability, clear forms, original content, source references and making calculation limitations visible.",
    "Rechner und Erklärungen werden laufend ergänzt. Im Mittelpunkt stehen mobile Nutzbarkeit, verständliche Formulare, eigenständige Inhalte, Quellenangaben und sichtbare Berechnungsgrenzen."
  ],
  "Hibát, pontatlan adatot, elavult szöveget vagy hiányzó magyarázatot a": [
    "Report faults, inaccurate data, outdated text or missing explanations to",
    "Melde Fehler, ungenaue Daten, veraltete Texte oder fehlende Erklärungen an"
  ],
  "címen lehet jelezni.": [
    ".",
    "."
  ],
  "Észrevételt küldenél?": [
    "Want to send feedback?",
    "Möchtest du einen Hinweis senden?"
  ],
  "Ha egy kalkulátor hibásan működik, félreérthető a szöveg, vagy új ötleted van, írd meg röviden.": [
    "Briefly describe a malfunction, confusing wording or new idea.",
    "Beschreibe kurz eine Fehlfunktion, einen unklaren Text oder eine neue Idee."
  ],
  "Kapcsolatfelvétel": [
    "Get in touch",
    "Kontakt aufnehmen"
  ],
  "Projektidentitás": [
    "Project identity",
    "Projektidentität"
  ],
  "Mit vállal a Kalkulátor Bázis – és mit nem?": [
    "What does Kalkulátor Bázis commit to, and what does it not claim?",
    "Wozu verpflichtet sich Kalkulátor Bázis und was behauptet es nicht?"
  ],
  "Vállaljuk": [
    "Our commitments",
    "Unser Anspruch"
  ],
  "érthető számítás, látható feltételezések, javítható hibák, forrásjelzés ahol szükséges, mobilos használhatóság": [
    "understandable calculations, visible assumptions, fixable faults, sources where needed and mobile usability",
    "Verständliche Berechnungen, sichtbare Annahmen, korrigierbare Fehler, nötige Quellenangaben und mobile Nutzbarkeit"
  ],
  "Nem állítjuk": [
    "We do not claim",
    "Wir behaupten nicht"
  ],
  "hogy minden eredmény hivatalos, személyre szabott vagy szakértő által tanúsított": [
    "that every result is official, personalised or professionally certified",
    "Dass jedes Ergebnis amtlich, individuell zugeschnitten oder fachlich zertifiziert ist"
  ],
  "Fejlesztési elv": [
    "Development principle",
    "Entwicklungsgrundsatz"
  ],
  "a kalkulátor funkciója és a magyarázó tartalom ugyanahhoz a valós felhasználói kérdéshez igazodjon": [
    "calculation functionality and explanations should answer the same real user question",
    "Rechnerfunktion und Erklärung sollen dieselbe tatsächliche Nutzerfrage beantworten"
  ],
  "Visszacsatolás": [
    "Feedback loop",
    "Rückkopplung"
  ],
  "hibát és félreérthető eredményt konkrét bemenettel és URL-lel lehessen jelezni": [
    "faults and confusing results should be reportable with specific inputs and a URL",
    "Fehler und unklare Ergebnisse sollen mit konkreten Eingaben und URL meldbar sein"
  ],
  "A projekt működésének részletei a": [
    "Details of how the project operates can be found on the",
    "Einzelheiten zum Projektbetrieb stehen auf der"
  ],
  "bizalmi oldalon": [
    "trust page",
    "Vertrauensseite"
  ],
  "módszertani oldalon": [
    "methodology page",
    "Methodikseite"
  ],
  "követhetők.": [
    ".",
    "."
  ],
  "Rólunk | Kalkulátor Bázis": [
    "About Us · Kalkulátor Bázis",
    "Über uns · Kalkulátor Bázis"
  ],
  "Ez az oldal összefoglalja, hogyan választjuk ki a képleteket, hogyan kezeljük a változó adatokat, milyen ellenőrzéseket végzünk, és miért kell a kalkulátorok eredményét tájékoztató jellegű becslésként kezelni.": [
    "This page explains formula selection, changing data, checks and why calculator results should be treated as indicative estimates.",
    "Diese Seite erläutert Formelauswahl, veränderliche Daten, Prüfungen und warum Rechenergebnisse als unverbindliche Schätzungen zu behandeln sind."
  ],
  "Képletek és bemeneti adatok": [
    "Formulas and inputs",
    "Formeln und Eingaben"
  ],
  "A kalkulátoroknál először azt határozzuk meg, milyen kérdésre kell választ adnia az oldalnak. Ezután a számításhoz szükséges bemeneti mezőket, mértékegységeket és képletet választjuk ki. Egyszerű matematikai számításoknál a képlet közvetlenül az összefüggésből adódik, például arány, százalék, terület vagy fogyasztás esetén.": [
    "First we decide what question a calculator must answer, then choose its inputs, units and formula. For simple mathematics, the formula follows directly from the relationship, such as ratios, percentages, area or consumption.",
    "Zuerst bestimmen wir die Frage, die ein Rechner beantworten soll, dann Eingaben, Einheiten und Formel. Bei einfacher Mathematik folgt die Formel direkt aus dem Zusammenhang, etwa bei Verhältnis, Prozent, Fläche oder Verbrauch."
  ],
  "Jogszabályhoz, adókulcshoz, devizaadathoz vagy szakmai irányelvhez kötött témáknál hivatalos vagy szakmailag elfogadott forrásra kell támaszkodni. Ilyen lehet például a NAV, a Magyar Nemzeti Bank, a KSH, jogszabályi szöveg, gyártói műszaki adatlap vagy egészségügyi szakmai ajánlás.": [
    "Topics tied to laws, tax rates, currency data or professional guidelines need official or professionally accepted sources. Examples include NAV, the Hungarian National Bank, KSH, legal texts, manufacturer data sheets and medical guidelines.",
    "Themen mit Bezug zu Gesetzen, Steuersätzen, Währungsdaten oder Fachleitlinien benötigen amtliche oder fachlich anerkannte Quellen. Beispiele sind NAV, die Ungarische Nationalbank, KSH, Gesetzestexte, technische Herstellerdatenblätter oder medizinische Empfehlungen."
  ],
  "Ellenőrzés és tesztelés": [
    "Checks and testing",
    "Prüfung und Tests"
  ],
  "A fejlesztés során kézi próbaszámításokkal, ismert példákkal és szélsőértékekkel ellenőrizzük, hogy az űrlap a várt eredményt adja-e. Fontos ellenőrzési pont a nulla, az üres mező, a tizedesvessző, a mértékegység, a túl nagy vagy túl kicsi bemenet és az eredmény olvasható megjelenítése.": [
    "During development we check expected results using manual calculations, reference examples and extreme values. Important cases include zero, empty fields, decimal commas, units, very large or small inputs and readable output.",
    "Bei der Entwicklung prüfen wir erwartete Ergebnisse durch manuelle Berechnungen, bekannte Beispiele und Extremwerte. Wichtig sind null, leere Felder, Dezimalkomma, Einheiten, sehr große oder kleine Eingaben und lesbare Ausgabe."
  ],
  "Az ellenőrzés nem jelent teljes körű szakértői tanúsítást. Ha egy kalkulátor pénzügyi, adózási, jogi vagy egészségügyi döntést érint, az eredmény csak kiindulópont, nem hivatalos állásfoglalás vagy személyre szabott tanács.": [
    "Checks do not amount to comprehensive professional certification. For financial, tax, legal or health decisions, a result is only a starting point, not an official interpretation or personalised advice.",
    "Prüfungen bedeuten keine umfassende fachliche Zertifizierung. Bei Finanz-, Steuer-, Rechts- oder Gesundheitsentscheidungen ist ein Ergebnis nur Ausgangspunkt, keine amtliche Stellungnahme oder individuelle Beratung."
  ],
  "Frissítések és változó adatok": [
    "Updates and changing data",
    "Aktualisierungen und veränderliche Daten"
  ],
  "Az időben változó adatoknál különösen fontos, hogy a kalkulátor oldalán látható legyen, milyen évre vagy milyen szabályrendszerre épül a számítás. A frissítési dátumot nem automatikusan cseréljük minden napra: csak akkor indokolt módosítani, ha az adott oldal tartalma, képlete vagy alapadata ténylegesen frissült.": [
    "For changing data, pages should clearly state the year or rules used. We do not automatically replace update dates every day; dates should change only when a page’s content, formula or underlying data actually changes.",
    "Bei veränderlichen Daten soll die Rechnerseite das verwendete Jahr oder Regelwerk erkennen lassen. Wir ersetzen Aktualisierungsdaten nicht automatisch täglich, sondern nur bei tatsächlichen Änderungen an Inhalt, Formel oder Grunddaten."
  ],
  "Ha egy régi érték hibás vagy elavult, a javításnál törekedni kell arra, hogy a magyarázó szöveg is kövesse a képletet. Egy helyes képlet önmagában kevés, ha a felhasználó nem érti, mit jelent az eredmény.": [
    "When correcting wrong or outdated values, explanatory text should follow the formula. A correct formula alone is insufficient if users cannot interpret the result.",
    "Bei der Korrektur falscher oder veralteter Werte sollte auch die Erklärung zur Formel passen. Eine richtige Formel allein reicht nicht, wenn Nutzer das Ergebnis nicht verstehen."
  ],
  "Kerekítés és eredményértelmezés": [
    "Rounding and interpreting results",
    "Rundung und Ergebnisdeutung"
  ],
  "A legtöbb kalkulátor olvasható formában jeleníti meg az eredményt, ezért forintnál gyakori az egész értékre kerekítés, liter vagy százalék esetén pedig egy-két tizedesjegy. A kerekítés célja az érthetőség, de kisebb eltérést okozhat a kézi vagy másik kalkulátorral kapott eredményhez képest.": [
    "Most calculators display results readably, often rounding forints to integers and litres or percentages to one or two decimals. Rounding improves readability but may cause small differences from manual calculations or other calculators.",
    "Die meisten Rechner zeigen Ergebnisse lesbar an, Forintbeträge oft ganzzahlig und Liter oder Prozente mit ein bis zwei Dezimalstellen. Rundung verbessert die Verständlichkeit, kann aber kleine Abweichungen zu Handrechnungen oder anderen Rechnern verursachen."
  ],
  "A számított érték mellé lehetőség szerint értelmezés is kerül: mire használható, milyen feltételezésekkel készült, és milyen helyzetben kell hivatalos forrást vagy szakembert bevonni.": [
    "Where possible, results include interpretation: intended uses, assumptions and situations requiring official sources or professional advice.",
    "Ergebnisse enthalten möglichst eine Einordnung: Verwendung, Annahmen und Situationen, die amtliche Quellen oder Fachleute erfordern."
  ],
  "Hibabejelentés": [
    "Bug reporting",
    "Fehlermeldung"
  ],
  "Ha hibás képletet, pontatlan leírást, elavult adatot, törött linket vagy félreérthető eredményt találsz, küldd el az érintett oldal URL-jét, a megadott bemeneteket és a kapott eredményt a": [
    "If you find a wrong formula, inaccurate explanation, outdated data, broken link or confusing result, send the page URL, inputs and result to",
    "Sende bei falscher Formel, ungenauer Erklärung, veralteten Daten, defektem Link oder unklarem Ergebnis die Seiten-URL, Eingaben und das Ergebnis an"
  ],
  "címre.": [
    ".",
    "."
  ],
  "A kalkulátorok nem helyettesítik a hivatalos számítást, szakmai tanácsadást, orvosi vizsgálatot, banki ajánlatot, könyvelői vagy jogi állásfoglalást.": [
    "Calculators do not replace official calculations, professional advice, medical examinations, bank offers or accounting or legal opinions.",
    "Die Rechner ersetzen keine amtlichen Berechnungen, fachliche Beratung, ärztliche Untersuchung, Bankangebote oder buchhalterischen beziehungsweise rechtlichen Stellungnahmen."
  ],
  "Számítás életciklusa": [
    "Calculation lifecycle",
    "Lebenszyklus einer Berechnung"
  ],
  "Egy kalkulátor frissítése öt külön dolgot jelenthet": [
    "Updating a calculator can mean five different things",
    "Eine Rechneraktualisierung kann fünf verschiedene Dinge bedeuten"
  ],
  "A matematikai vagy szabályalapú összefüggés változik.": [
    "The mathematical relationship or rule changes.",
    "Der mathematische oder regelbasierte Zusammenhang ändert sich."
  ],
  "Bemenet": [
    "Input",
    "Eingabe"
  ],
  "Új mező, új mértékegység vagy más alapértelmezett feltételezés szükséges.": [
    "A new field, unit or default assumption is needed.",
    "Ein neues Feld, eine neue Einheit oder eine andere Standardannahme wird benötigt."
  ],
  "Adat": [
    "Data",
    "Daten"
  ],
  "Árfolyam, adókulcs, határérték vagy más időérzékeny adat frissül.": [
    "Exchange rates, tax rates, thresholds or other time-sensitive data change.",
    "Wechselkurse, Steuersätze, Grenzwerte oder andere zeitabhängige Daten werden aktualisiert."
  ],
  "Magyarázat": [
    "Explanation",
    "Erklärung"
  ],
  "A képlet változatlan, de a felhasználói értelmezés vagy korlát pontosításra szorul.": [
    "The formula stays the same, but interpretation or limitations need clarification.",
    "Die Formel bleibt unverändert, aber Einordnung oder Grenzen müssen präzisiert werden."
  ],
  "Új szélsőérték vagy korábbi hiba miatt a regressziós ellenőrzést bővíteni kell.": [
    "Regression checks need expanding because of a new boundary case or earlier fault.",
    "Wegen eines neuen Grenzfalls oder früheren Fehlers muss die Regressionsprüfung erweitert werden."
  ],
  "Ezért az „utolsó frissítés” dátuma csak akkor értékes, ha tényleges tartalmi vagy technikai ellenőrzést jelez, nem automatikus dátumcserét.": [
    "A last-updated date is therefore useful only when it reflects actual content or technical checks, not automatic date replacement.",
    "Ein Aktualisierungsdatum ist daher nur aussagekräftig, wenn es eine tatsächliche inhaltliche oder technische Prüfung und keinen automatischen Datumswechsel anzeigt."
  ],
  "Számítási módszertan | Kalkulátor Bázis": [
    "Calculation Methodology · Kalkulátor Bázis",
    "Berechnungsmethodik · Kalkulátor Bázis"
  ],
  "Elérhetőség": [
    "Contact details",
    "Erreichbarkeit"
  ],
  "Hibát találtál, pontatlan a szöveg, nem egyértelmű az eredmény, javaslatod van, vagy új kalkulátort szeretnél? A Kalkulátor Bázissal az alábbi e-mail címen veheted fel a kapcsolatot.": [
    "Found a fault, inaccurate wording, an unclear result, have a suggestion or want a new calculator? Contact Kalkulátor Bázis at the email address below.",
    "Fehler gefunden, ungenauer Text, unklares Ergebnis, ein Vorschlag oder Wunsch nach einem neuen Rechner? Kontaktiere Kalkulátor Bázis unter der folgenden E-Mail-Adresse."
  ],
  "A beérkező üzeneteket általában 24-48 órán belül átnézzük. Összetettebb számítási vagy forrásellenőrzési kérdésnél a tényleges javítás ennél hosszabb időt vehet igénybe.": [
    "We usually review incoming messages within 24–48 hours. Complex calculations or source checks may take longer to resolve.",
    "Eingehende Nachrichten prüfen wir in der Regel innerhalb von 24–48 Stunden. Bei komplexeren Berechnungen oder Quellenprüfungen kann die tatsächliche Korrektur länger dauern."
  ],
  "E-mail": [
    "Email",
    "E-Mail"
  ],
  "A gyorsabb ellenőrzéshez írd meg az érintett oldal URL-jét, a megadott adatokat, a kapott eredményt és röviden azt, mi tűnik hibásnak vagy félreérthetőnek.": [
    "To speed up checks, provide the page URL, inputs, result and a short description of what seems wrong or confusing.",
    "Nenne für eine schnellere Prüfung die Seiten-URL, Eingaben, Ergebnis und eine kurze Beschreibung dessen, was falsch oder unklar erscheint."
  ],
  "Milyen ügyben érdemes írni?": [
    "What can you contact us about?",
    "Wozu kannst du uns schreiben?"
  ],
  "hibás vagy pontatlannak tűnő kalkulátoreredmény;": [
    "incorrect or seemingly inaccurate results;",
    "Fehlerhafte oder ungenau erscheinende Rechenergebnisse;"
  ],
  "elavult adat, forrás vagy jogszabályi hivatkozás;": [
    "outdated data, sources or legal references;",
    "Veraltete Daten, Quellen oder Rechtsverweise;"
  ],
  "törött belső vagy külső link;": [
    "broken internal or external links;",
    "Defekte interne oder externe Links;"
  ],
  "félreérthető tartalom vagy hiányzó magyarázat;": [
    "confusing content or missing explanations;",
    "Missverständliche Inhalte oder fehlende Erklärungen;"
  ],
  "új kalkulátorjavaslat vagy hiányzó témakör;": [
    "new calculator suggestions or missing topics;",
    "Vorschläge für neue Rechner oder fehlende Themen;"
  ],
  "adatvédelmi, sütikezelési vagy jogi kérdés;": [
    "privacy, cookie or legal questions;",
    "Datenschutz-, Cookie- oder Rechtsfragen;"
  ],
  "partneri vagy együttműködési megkeresés.": [
    "affiliate or collaboration enquiries.",
    "Partner- oder Kooperationsanfragen."
  ],
  "Fontos tudni": [
    "Important information",
    "Wichtige Hinweise"
  ],
  "A kapcsolatfelvétel nem minősül hivatalos tanácsadásnak, ajánlatkérésnek vagy szakértői konzultációnak. Pénzügyi, adózási, jogi vagy egészségügyi döntés előtt hivatalos forrás vagy megfelelő szakember segítsége lehet szükséges.": [
    "Contacting us is not official advice, a request for an offer or an expert consultation. Financial, tax, legal or health decisions may require official sources or appropriate professionals.",
    "Die Kontaktaufnahme ist keine offizielle Beratung, Angebotsanfrage oder Fachkonsultation. Bei Finanz-, Steuer-, Rechts- oder Gesundheitsentscheidungen können amtliche Quellen oder geeignete Fachleute nötig sein."
  ],
  "Hasznos adatok": [
    "Useful details",
    "Hilfreiche Angaben"
  ],
  "oldal címe vagy URL-je;": [
    "page title or URL;",
    "Seitentitel oder URL;"
  ],
  "bemeneti értékek;": [
    "input values;",
    "Eingabewerte;"
  ],
  "kapott eredmény;": [
    "result obtained;",
    "Erhaltenes Ergebnis;"
  ],
  "rövid leírás a problémáról.": [
    "a brief description of the problem.",
    "Kurze Problembeschreibung."
  ],
  "Gyorsabb hibajavítás": [
    "Faster bug fixes",
    "Schnellere Fehlerkorrektur"
  ],
  "Mit írj bele egy jó hibabejelentésbe?": [
    "What makes a useful bug report?",
    "Was gehört in eine gute Fehlermeldung?"
  ],
  "Az érintett oldal pontos URL-je vagy kalkulátorneve.": [
    "The exact page URL or calculator name.",
    "Die genaue Seiten-URL oder der Rechnername."
  ],
  "A megadott bemeneti értékek és mértékegységek.": [
    "The input values and units.",
    "Die eingegebenen Werte und Einheiten."
  ],
  "A kapott eredmény és az, hogy miért tűnik hibásnak vagy félreérthetőnek.": [
    "The result and why it seems wrong or unclear.",
    "Das Ergebnis und warum es falsch oder unklar erscheint."
  ],
  "Ha van összehasonlítási alap, annak forrása vagy kézi számítása.": [
    "A reference source or manual calculation, if available.",
    "Wenn vorhanden eine Vergleichsquelle oder Handrechnung."
  ],
  "Eszköz/böngésző megnevezése, ha megjelenítési vagy működési hibáról van szó.": [
    "The device and browser for display or functional problems.",
    "Gerät und Browser bei Darstellungs- oder Funktionsfehlern."
  ],
  "Személyes vagy érzékeny adatot ne küldj csak azért, hogy egy számítási hibát reprodukálni lehessen; a legtöbb hiba anonim példaadatokkal is leírható.": [
    "Do not send personal or sensitive data merely to reproduce a calculation fault; most issues can be described with anonymous example data.",
    "Sende keine persönlichen oder sensiblen Daten nur zur Reproduktion eines Rechenfehlers. Die meisten Probleme lassen sich mit anonymen Beispieldaten beschreiben."
  ],
  "Kapcsolat és hibabejelentés | Kalkulátor Bázis": [
    "Contact and Bug Reports · Kalkulátor Bázis",
    "Kontakt und Fehlermeldungen · Kalkulátor Bázis"
  ],
  "hu-HU": [
    "en-GB",
    "de-DE"
  ]
}
  };
});

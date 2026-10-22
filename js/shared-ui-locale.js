/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const document = root.document;
  // Only shared UI belongs here. Page content and calculation results have their
  // own translators; input values and Google-controlled consent UI are untouched.
  const common = '#header,#footer,body>header,body>footer,#cookie-banner,#cookieConsentToast,.skip-link,.kb-skip-link,.kb-page-meta,.kb-return-calculator,.kb-page-nav__label,.kb-page-nav__primary';
  const attributeOnly = '.breadcrumb,.kb-breadcrumb,.kb-page-nav';
  const blocked = 'script,style,textarea,input,select,code,pre,[contenteditable],[translate="no"],[data-i18n]';
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  const languageRecords = new WeakMap();
  let language = root.KB_SITE_LANGUAGE?.get() || "hu";
  let observer;
  const scopes = () => common + (document.getElementById("langPop")
    ? ',.kb-help-links,.kb-help-honeypot'
    : ',.kb-help-launcher,#kbHelpPanel,.theme-toggle-floating');
  const resolve = (value, previous) => {
    const source = previous?.rendered === value ? previous.source : value;
    const translated = api.translate(source, language);
    return { source, rendered: translated ?? source };
  };
  function markLanguage(element, translated) {
    if (translated) {
      if (!languageRecords.has(element)) languageRecords.set(element, element.getAttribute("lang"));
      element.setAttribute("lang", language);
    } else if (languageRecords.has(element)) {
      const original = languageRecords.get(element);
      if (original === null) element.removeAttribute("lang");
      else element.setAttribute("lang", original);
      languageRecords.delete(element);
    }
  }
  function render() {
    observer?.disconnect();
    try {
      const elements = new Set();
      document.querySelectorAll(scopes()).forEach((scope) => {
        elements.add(scope);
        scope.querySelectorAll("*").forEach((element) => elements.add(element));
      });
      document.querySelectorAll(attributeOnly).forEach((element) => elements.add(element));
      for (const element of elements) {
        if (element.closest(blocked)) continue;
        let translated = false;
        for (const node of element.childNodes) {
          if (element.matches(attributeOnly)) continue;
          if (node.nodeType !== 3) continue;
          const next = resolve(node.nodeValue, textRecords.get(node));
          textRecords.set(node, next);
          if (node.nodeValue !== next.rendered) node.nodeValue = next.rendered;
          translated ||= next.source !== next.rendered;
        }
        const records = attributeRecords.get(element) || {};
        for (const attribute of ["aria-label", "title", "placeholder"]) {
          if (!element.hasAttribute(attribute) || element.hasAttribute("data-i18n-" + (attribute === "aria-label" ? "aria" : attribute))) continue;
          const value = element.getAttribute(attribute);
          const next = resolve(value, records[attribute]);
          records[attribute] = next;
          if (value !== next.rendered) element.setAttribute(attribute, next.rendered);
          translated ||= next.source !== next.rendered;
        }
        attributeRecords.set(element, records);
        if (!element.matches(attributeOnly)) markLanguage(element, translated);
      }
    } finally {
      observer?.observe(document.body, { subtree: true, childList: true, characterData: true,
        attributes: true, attributeFilter: ["aria-label", "title", "placeholder"] });
    }
  }
  function ready() {
    observer = new MutationObserver((changes) => {
      const selector = scopes() + ',' + attributeOnly;
      if (changes.some((change) => {
        const element = change.target.nodeType === 1 ? change.target : change.target.parentElement;
        return element?.closest(selector) || [...change.addedNodes].some((node) =>
          node.nodeType === 1 && (node.matches(selector) || node.querySelector(selector)));
      })) render();
    });
    render();
  }
  document.addEventListener("kb:language-changed", (event) => {
    language = api.supported.includes(event.detail?.language) ? event.detail.language : "hu";
    if (document.body) render();
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const dictionary = {
    "Morzsamenü": ["Breadcrumb navigation", "Brotkrümelnavigation"],
    "Ugrás az oldal részeihez": ["Jump to page sections", "Zu den Seitenabschnitten springen"],
    "Főoldal": [
      "Home",
      "Startseite"
    ],
    "Kalkulátorok": [
      "Calculators",
      "Rechner"
    ],
    "Összes kalkulátor": [
      "All calculators",
      "Alle Rechner"
    ],
    "Pénzügy": [
      "Finance",
      "Finanzen"
    ],
    "Pénzügyi kalkulátorok": [
      "Financial calculators",
      "Finanzrechner"
    ],
    "Otthon & felújítás": [
      "Home & renovation",
      "Haus & Renovierung"
    ],
    "Autó & közlekedés": [
      "Cars & transport",
      "Auto & Verkehr"
    ],
    "Egészség & sport": [
      "Health & fitness",
      "Gesundheit & Sport"
    ],
    "Mindennapok": [
      "Everyday life",
      "Alltag"
    ],
    "Átváltók": [
      "Converters",
      "Umrechner"
    ],
    "Tudományos számológép": [
      "Scientific calculator",
      "Wissenschaftlicher Taschenrechner"
    ],
    "Döntések": [
      "Decisions",
      "Entscheidungen"
    ],
    "Összehasonlítás": [
      "Comparison",
      "Vergleich"
    ],
    "Tudástár": [
      "Knowledge base",
      "Wissensbereich"
    ],
    "Aktuális változások": [
      "Latest updates",
      "Aktuelle Änderungen"
    ],
    "Élethelyzetek": [
      "Life situations",
      "Lebenssituationen"
    ],
    "Pénzügyi tudatosság": [
      "Financial awareness",
      "Finanzwissen"
    ],
    "Számítási módszertan": [
      "Calculation methodology",
      "Berechnungsmethodik"
    ],
    "Miért bízhatsz bennünk?": [
      "Why trust us?",
      "Warum uns vertrauen?"
    ],
    "Átláthatóság és minőség": [
      "Transparency & quality",
      "Transparenz & Qualität"
    ],
    "Rólunk": [
      "About us",
      "Über uns"
    ],
    "Kapcsolat": [
      "Contact",
      "Kontakt"
    ],
    "Kalkulátor keresése": [
      "Find a calculator",
      "Rechner suchen"
    ],
    "Ugrás a tartalomhoz": [
      "Skip to content",
      "Zum Inhalt springen"
    ],
    "Kalkulátorkategóriák": [
      "Calculator categories",
      "Rechnerkategorien"
    ],
    "Ötletet küldök": [
      "Send an idea",
      "Idee senden"
    ],
    "Segíts fejleszteni a Kalkulátor Bázist": [
      "Help improve Kalkulátor Bázis",
      "Hilf mit, Kalkulátor Bázis zu verbessern"
    ],
    "Nem találtad meg a keresett számítást vagy döntési helyzetet?": [
      "Didn't find the calculation or decision aid you need?",
      "Du hast den passenden Rechner oder die richtige Entscheidungshilfe nicht gefunden?"
    ],
    "Sütibeállítások": [
      "Cookie settings",
      "Cookie-Einstellungen"
    ],
    "Felhasználási feltételek": [
      "Terms of use",
      "Nutzungsbedingungen"
    ],
    "Jogi nyilatkozat": [
      "Legal notice",
      "Rechtlicher Hinweis"
    ],
    "Impresszum": [
      "Legal information",
      "Impressum"
    ],
    "Fő navigáció": [
      "Main navigation",
      "Hauptnavigation"
    ],
    "Kalkulátor Bázis főoldal": [
      "Kalkulátor Bázis home",
      "Kalkulátor Bázis Startseite"
    ],
    "Menü megnyitása": [
      "Open menu",
      "Menü öffnen"
    ],
    "Menü bezárása": [
      "Close menu",
      "Menü schließen"
    ],
    "Váltás sötét módra": [
      "Switch to dark mode",
      "Zum dunklen Modus wechseln"
    ],
    "Váltás világos módra": [
      "Switch to light mode",
      "Zum hellen Modus wechseln"
    ],
    "Sötét": [
      "Dark",
      "Dunkel"
    ],
    "Világos": [
      "Light",
      "Hell"
    ],
    "Írd meg, mire lenne szükséged. A jó ötleteket felvesszük a fejlesztési listára.": [
      "Tell us what you need. Useful ideas go on our development list.",
      "Sag uns, was du brauchst. Gute Ideen nehmen wir in unsere Entwicklungsliste auf."
    ],
    "Ingyenes, magyar nyelvű online kalkulátorok és rendezett döntési útvonalak pénzügyi, egészségügyi, építőipari, autós és mindennapi helyzetekhez.": [
      "Free online calculators originally in Hungarian, with structured guides for financial, health, building, motoring and everyday decisions.",
      "Kostenlose Online-Rechner mit ungarischer Ausgangssprache und übersichtlichen Entscheidungshilfen für Finanzen, Gesundheit, Bauen, Auto und Alltag."
    ],
    "A szolgáltatás előnyei": [
      "Service benefits",
      "Vorteile des Angebots"
    ],
    "Regisztráció nélkül használható": [
      "No registration required",
      "Ohne Registrierung nutzbar"
    ],
    "Közérthető módszertan és források": [
      "Clear methods and sources",
      "Verständliche Methoden und Quellen"
    ],
    "Mobilon is kényelmesen működik": [
      "Easy to use on mobile",
      "Auch auf dem Handy bequem nutzbar"
    ],
    "Kalkulátor Bázis Facebook-oldala (új lapon nyílik)": [
      "Kalkulátor Bázis on Facebook (opens in a new tab)",
      "Kalkulátor Bázis auf Facebook (öffnet einen neuen Tab)"
    ],
    "Pénzügyi": [
      "Finance",
      "Finanzen"
    ],
    "Egészség": [
      "Health",
      "Gesundheit"
    ],
    "Döntési és tudástári útvonalak": [
      "Decision guides and knowledge",
      "Entscheidungshilfen und Wissen"
    ],
    "Útvonalak": [
      "Guides",
      "Wegweiser"
    ],
    "Információ és bizalom": [
      "Information and trust",
      "Informationen und Vertrauen"
    ],
    "Információ": [
      "Information",
      "Informationen"
    ],
    "Kapcsolat és hibabejelentés": [
      "Contact and bug reports",
      "Kontakt und Fehlermeldungen"
    ],
    "Jogi hivatkozások": [
      "Legal links",
      "Rechtliche Informationen"
    ],
    "Adatkezelés": [
      "Privacy",
      "Datenschutz"
    ],
    "Sütik": [
      "Cookies",
      "Cookies"
    ],
    "Partnerinformáció": [
      "Partner information",
      "Partnerinformationen"
    ],
    "Az eredmények tájékoztató becslések; fontos döntés előtt ellenőrizd az aktuális hivatalos vagy szakmai forrást.": [
      "Results are estimates for guidance; check current official or professional sources before an important decision.",
      "Die Ergebnisse dienen als Orientierung; prüfe vor wichtigen Entscheidungen aktuelle amtliche oder fachliche Quellen."
    ],
    "Az oldal megbízhatósági információi": [
      "Page reliability information",
      "Informationen zur Verlässlichkeit der Seite"
    ],
    "Adatminimalizált számítás": [
      "Data-minimising calculations",
      "Datensparsame Berechnungen"
    ],
    "A legtöbb kalkulátor helyben fut; API esetén csak a számításhoz szükséges mezők továbbítódnak": [
      "Most calculators run locally; API requests send only the fields needed for the calculation.",
      "Die meisten Rechner laufen lokal; bei API-Anfragen werden nur die für die Berechnung nötigen Felder übermittelt."
    ],
    "Független magyar oldal": [
      "Independent Hungarian website",
      "Unabhängige ungarische Website"
    ],
    "Közérthető, praktikus online kalkulátorok": [
      "Clear, practical online calculators",
      "Verständliche, praktische Online-Rechner"
    ],
    "Folyamatos ellenőrzés": [
      "Ongoing checks",
      "Laufende Prüfungen"
    ],
    "Automatikus minőségtesztek, forrásellenőrzés és hibajelzés": [
      "Automated quality tests, source checks and error reporting",
      "Automatische Qualitätstests, Quellenprüfung und Fehlermeldungen"
    ],
    "Helyben számol": [
      "Calculates locally",
      "Berechnet lokal"
    ],
    "A bevitt kalkulátoradatok a böngészőben maradnak": [
      "Calculator inputs stay in your browser",
      "Eingegebene Rechnerdaten bleiben im Browser"
    ],
    "Automatikusan ellenőrzött": [
      "Automatically checked",
      "Automatisch geprüft"
    ],
    "HTML-, számítási és böngészős minőségkapuk": [
      "HTML, calculation and browser checks",
      "HTML-, Berechnungs- und Browsertests"
    ],
    "Módszertan": [
      "Methodology",
      "Methodik"
    ],
    "Hibát jelzek": [
      "Report a problem",
      "Problem melden"
    ],
    "Az oldalon": [
      "On this page",
      "Auf dieser Seite"
    ],
    "Kalkulátor": [
      "Calculator",
      "Rechner"
    ],
    "Vissza a kalkulátorhoz": [
      "Back to the calculator",
      "Zurück zum Rechner"
    ],
    "Szükséges működés": [
      "Essential functionality",
      "Notwendige Funktionen"
    ],
    "Mindig aktív": [
      "Always active",
      "Immer aktiv"
    ],
    "Analitika": [
      "Analytics",
      "Analyse"
    ],
    "Engedélyezés": [
      "Allow",
      "Erlauben"
    ],
    "Partneri tartalom és marketing": [
      "Partner content and marketing",
      "Partnerinhalte und Marketing"
    ],
    "Beállítások": [
      "Settings",
      "Einstellungen"
    ],
    "Mindet elfogadom": [
      "Accept all",
      "Alle akzeptieren"
    ],
    "Csak szükséges sütik": [
      "Necessary cookies only",
      "Nur notwendige Cookies"
    ],
    "Beállítások mentése": [
      "Save settings",
      "Einstellungen speichern"
    ],
    "Opcionális elemek elutasítása": [
      "Reject optional items",
      "Optionale Elemente ablehnen"
    ],
    "Gyors sütiválasztás": [
      "Quick cookie choices",
      "Schnelle Cookie-Auswahl"
    ],
    "A Kalkulátor Bázis a weboldal megfelelő működéséhez szükséges helyi tárolást használ. Az analitikát és a partneri külső tartalmakat csak a hozzájárulásod alapján kapcsoljuk be. A Google AdSense európai hozzájárulását külön, Google-minősített TCF üzenet kezeli, ahol ez szükséges.": [
      "Kalkulátor Bázis uses local storage needed for the website to function. Analytics and external partner content are enabled only with your consent. Where required in Europe, a separate Google-certified TCF message manages consent for Google AdSense.",
      "Kalkulátor Bázis nutzt lokalen Speicher für die notwendigen Website-Funktionen. Analyse und externe Partnerinhalte werden nur mit deiner Einwilligung aktiviert. Wo in Europa erforderlich, wird die Einwilligung für Google AdSense über eine separate Google-zertifizierte TCF-Meldung verwaltet."
    ],
    "Részletes információt a": [
      "Read more in our",
      "Weitere Informationen findest du in unseren"
    ],
    "Sütikezelési tájékoztatóban": [
      "cookie policy",
      "Cookie-Hinweisen"
    ],
    "találsz.": [
      ".",
      "."
    ],
    "Ezek biztosítják az alapvető működést, például a hozzájárulási döntés és a téma beállításának megjegyzését a böngésződben.": [
      "These support essential functions, such as remembering your consent choice and theme in your browser.",
      "Diese ermöglichen grundlegende Funktionen, etwa das Speichern deiner Einwilligung und deines Designs im Browser."
    ],
    "A Google Analytics segítségével anonim látogatottsági képet kapunk arról, mely oldalak és kalkulátorok hasznosak.": [
      "Google Analytics provides an anonymous view of visits to help us understand which pages and calculators are useful.",
      "Google Analytics gibt uns einen anonymen Überblick über die Nutzung und zeigt, welche Seiten und Rechner hilfreich sind."
    ],
    "Ez a beállítás a partneri bannerek és más külső marketingtartalmak betöltését kezeli. A Google AdSense hozzájárulását az arra jogosult régiókban a Google TCF/CMP üzenete kezeli.": [
      "This setting controls partner banners and other external marketing content. In applicable regions, consent for Google AdSense is managed by Google's TCF/CMP message.",
      "Diese Einstellung steuert das Laden von Partnerbannern und anderen externen Marketinginhalten. In den entsprechenden Regionen wird die Einwilligung für Google AdSense über die TCF/CMP-Meldung von Google verwaltet."
    ],
    "Minden opcionális kategória engedélyezve.": [
      "All optional categories are enabled.",
      "Alle optionalen Kategorien sind aktiviert."
    ],
    "Csak a szükséges működés marad aktív.": [
      "Only essential functionality remains active.",
      "Nur notwendige Funktionen bleiben aktiv."
    ],
    "A sütibeállítások mentve.": [
      "Cookie settings saved.",
      "Cookie-Einstellungen gespeichert."
    ],
    "Az opcionális elemek elutasítva.": [
      "Optional items rejected.",
      "Optionale Elemente abgelehnt."
    ],
    "A böngésző nem engedte a választás tartós mentését, de ezen az oldalon a döntésed szerint működünk.": [
      "Your browser could not save this choice permanently, but it applies on this page.",
      "Dein Browser konnte die Auswahl nicht dauerhaft speichern. Auf dieser Seite gilt sie dennoch."
    ],
    "Segítség": [
      "Help",
      "Hilfe"
    ],
    "Segítség megnyitása": [
      "Open help",
      "Hilfe öffnen"
    ],
    "Bezárás": [
      "Close",
      "Schließen"
    ],
    "Miben segíthetünk?": [
      "How can we help?",
      "Wie können wir helfen?"
    ],
    "Gyors segítség, hibabejelentés vagy javaslatküldés.": [
      "Quick help, bug reports or suggestions.",
      "Schnelle Hilfe, Fehlermeldungen oder Vorschläge."
    ],
    "🔎 Kalkulátort keresek": [
      "🔎 Find a calculator",
      "🔎 Rechner finden"
    ],
    "💬 Kérdésem van a működésről": [
      "💬 I have a question",
      "💬 Ich habe eine Frage"
    ],
    "🐞 Hibát találtam": [
      "🐞 Report a bug",
      "🐞 Fehler melden"
    ],
    "💡 Javaslatot küldenék": [
      "💡 Send a suggestion",
      "💡 Vorschlag senden"
    ],
    "← Vissza": [
      "← Back",
      "← Zurück"
    ],
    "Összes kalkulátor megnyitása": [
      "Browse all calculators",
      "Alle Rechner öffnen"
    ],
    "Autós kalkulátorok": [
      "Car calculators",
      "Autorechner"
    ],
    "Egészség kalkulátorok": [
      "Health calculators",
      "Gesundheitsrechner"
    ],
    "Építőipari kalkulátorok": [
      "Building calculators",
      "Baurechner"
    ],
    "Az első verzió még nem AI-chat. A működéssel kapcsolatos kérdésedet elküldheted, és e-mailben válaszolunk.": [
      "This is not an AI chat. Send us your question about the site and we will reply by email.",
      "Dies ist kein KI-Chat. Sende uns deine Frage zur Website, und wir antworten per E-Mail."
    ],
    "Kérdés elküldése": [
      "Send a question",
      "Frage senden"
    ],
    "Írd le a kérdésed": [
      "Describe your question",
      "Beschreibe deine Frage"
    ],
    "Mi történt?": [
      "What happened?",
      "Was ist passiert?"
    ],
    "Mit vártál helyette?": [
      "What did you expect instead?",
      "Was hast du stattdessen erwartet?"
    ],
    "Milyen adatokat adtál meg?": [
      "What data did you enter?",
      "Welche Daten hast du eingegeben?"
    ],
    "Ne írj be érzékeny személyes vagy pénzügyi adatot.": [
      "Do not include sensitive personal or financial data.",
      "Gib keine sensiblen persönlichen oder finanziellen Daten ein."
    ],
    "Mit változtatnál vagy milyen kalkulátort látnál szívesen?": [
      "What would you change or what calculator would you like to see?",
      "Was würdest du ändern oder welchen Rechner wünschst du dir?"
    ],
    "E-mail-cím a válaszhoz (nem kötelező)": [
      "Email for a reply (optional)",
      "E-Mail-Adresse für eine Antwort (optional)"
    ],
    "Weboldal": [
      "Website",
      "Website"
    ],
    "Hozzájárulok, hogy a bejelentés adatait a kivizsgálás és válaszadás céljából kezeljék.": [
      "I consent to the processing of the report data for investigation and response.",
      "Ich willige ein, dass die Daten meiner Meldung zur Prüfung und Beantwortung verarbeitet werden."
    ],
    "A beküldéshez automatikusan csatoljuk az oldal címét, URL-jét, az eszköz és böngésző alapvető technikai adatait. Részletek az": [
      "The report automatically includes the page title, URL and basic device and browser details. See our",
      "Die Meldung enthält automatisch den Seitentitel, die URL und grundlegende Geräte- und Browserdaten. Einzelheiten findest du in der"
    ],
    "adatvédelmi tájékoztatóban": [
      "privacy notice",
      "Datenschutzerklärung"
    ],
    "Beküldés": [
      "Send",
      "Senden"
    ],
    "Küldés folyamatban…": [
      "Sending…",
      "Wird gesendet…"
    ],
    "Köszönjük! Az üzenet sikeresen megérkezett.": [
      "Thank you! Your message has been received.",
      "Vielen Dank! Deine Nachricht ist angekommen."
    ],
    "Nem sikerült elküldeni. Írj nekünk közvetlenül:": [
      "Could not send the message. Email us directly:",
      "Die Nachricht konnte nicht gesendet werden. Schreib uns direkt:"
    ]
  };
  const normalize = (text) => text.replace(/\s+/g, " ").trim();
  function translate(text, language) {
    if (language !== "en" && language !== "de") return null;
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
    const pair = dictionary[normalize(match[2])];
    return pair ? match[1] + pair[language === "en" ? 0 : 1] + match[3] : null;
  }
  return { dictionary, translate, supported: ["hu", "en", "de"] };
});

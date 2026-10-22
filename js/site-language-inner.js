/* global module */
/* Language support for internal pages. This deliberately translates only covered
   text: the Hungarian source remains the canonical language for untranslated
   calculator logic, tax explanations and dynamic results. */
(function (global, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!global || !global.document) return;
  const document = global.document;
  const homePath = global.location?.pathname?.replace(/\/(?:index(?:\.html)?)?\/?$/, "/") || "/";
  if (document.getElementById("langPop") || (homePath === "/" && document.getElementById("langBtn"))) return;
  if (new URLSearchParams(global.location.search).has("__kb_static_export")) return;

  function ready() {
    const header = document.querySelector(".header-actions");
    if (!header || document.getElementById("kbInternalLanguage")) return;
    const control = document.createElement("label");
    control.className = "kb-inner-language";
    control.setAttribute("for", "kbInternalLanguage");
    const label = document.createElement("span");
    label.className = "kb-inner-language-caption";
    label.textContent = "Nyelv";
    const select = document.createElement("select");
    select.id = "kbInternalLanguage";
    select.setAttribute("aria-label", "Nyelv / Language / Sprache");
    ["hu", "en", "de"].forEach((code) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = code.toUpperCase();
      select.appendChild(opt);
    });
    control.append(label, select);
    const nav = document.getElementById("menu");
    const positionControl = () => {
      if (global.matchMedia("(max-width: 690px)").matches && nav) {
        nav.insertBefore(control, nav.firstChild);
      } else {
        header.insertBefore(control, header.querySelector(".theme-toggle") || header.querySelector(".menu-toggle"));
      }
    };
    positionControl();
    global.addEventListener("resize", positionControl);
    const notice = document.createElement("div");
    notice.id = "kbInnerLanguageNotice";
    notice.setAttribute("role", "status");
    notice.className = "kb-inner-language-notice";
    notice.hidden = true;
    const main = document.querySelector("main");
    main?.parentNode?.insertBefore(notice, main);
    const style = document.createElement("style");
    style.textContent = [
      ".kb-inner-language{display:inline-flex;align-items:center;gap:5px;white-space:nowrap;font:inherit;flex-shrink:0}",
      ".kb-inner-language-caption{font-size:.78rem}",
      ".kb-inner-language select{max-width:67px;padding:7px 4px;border-radius:8px;border:1px solid currentColor;background:var(--surface,#fff);color:inherit;font:inherit;cursor:pointer}",
      ".kb-inner-language select:focus-visible{outline:3px solid #3985ef;outline-offset:2px}",
      ".kb-inner-language-notice{box-sizing:border-box;width:min(100% - 32px,1100px);margin:14px auto;padding:12px 15px;border:1px solid #8b94a8;border-radius:9px;font-size:.9rem;line-height:1.55}",
      ".kb-inner-language-notice[hidden]{display:none!important}",
      "@media(max-width:690px){#menu>.kb-inner-language{display:flex;width:100%;box-sizing:border-box;padding:10px 16px}.kb-inner-language select{max-width:67px;padding:6px 3px}}"
    ].join("");
    document.head.appendChild(style);

    const originalNodes = new WeakMap();
    const translatedNodes = new Set();
    const originalAttributes = new WeakMap();
    const selectors = "header#header, #header, #footer, main";
    const blocked = 'script,style,textarea,code,pre,option,[contenteditable],[translate="no"],.kb-inner-language,.kb-inner-language-notice';
    const knownNodes = () => document.querySelectorAll(selectors);

    function restore() {
      translatedNodes.forEach((node) => {
        if (node.isConnected && originalNodes.has(node)) node.nodeValue = originalNodes.get(node);
      });
      translatedNodes.clear();
      knownNodes().forEach((container) => {
        container.querySelectorAll("[data-kb-i18n-lang]").forEach((element) => {
          element.removeAttribute("data-kb-i18n-lang");
          const previous = originalAttributes.get(element);
          if (previous === null) element.removeAttribute("lang");
          else if (previous !== undefined) element.setAttribute("lang", previous);
        });
      });
    }

    function apply(lang, persist) {
      const next = api.supported.includes(lang) ? lang : "hu";
      if (persist && !global.KB_SITE_LANGUAGE?.set(next)) return;
      restore();
      select.value = next;
      const caption = { hu: "Nyelv", en: "Language", de: "Sprache" };
      label.textContent = caption[next];
      document.documentElement.dataset.kbPreferredLanguage = next;

      if (next !== "hu") {
        for (const container of knownNodes()) {
          const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
          const nodes = [];
          while (walker.nextNode()) nodes.push(walker.currentNode);
          for (const node of nodes) {
            const parent = node.parentElement;
            if (!parent || parent.closest(blocked)) continue;
            // Critical calculation outputs are dynamic; never change displayed
            // numbers, legal warnings or free-form calculation results.
            if (parent.closest('[role="status"],[aria-live],.result-box,.priority-results,[data-results]')) continue;
            const oldText = node.nodeValue;
            const whitespace = /^(\s*)([\s\S]*?)(\s*)$/.exec(oldText);
            if (!whitespace) continue;
            const translated = api.translate(whitespace[2], next);
            if (translated === null) continue;
            originalNodes.set(node, oldText);
            translatedNodes.add(node);
            node.nodeValue = whitespace[1] + translated + whitespace[3];
            if (!parent.hasAttribute("data-kb-i18n-lang")) {
              originalAttributes.set(parent, parent.getAttribute("lang"));
              parent.dataset.kbI18nLang = next;
              parent.lang = next;
            }
          }
        }
        if (notice) {
          notice.hidden = false;
          notice.lang = next;
          notice.textContent = api.fallback[next];
        }
      } else if (notice) {
        notice.hidden = true;
        notice.textContent = "";
      }
      // Keep html lang=hu: not all page body copy and dynamic calculators are
      // translated. A preference is NOT proof of complete language coverage.
      document.documentElement.lang = "hu";
      document.dispatchEvent(new CustomEvent("kb:language-changed", { detail: { language: next, partial: next !== "hu" } }));
    }

    select.addEventListener("change", () => apply(select.value, true));
    document.addEventListener("kb:page-ui-rendered", () => apply(select.value, false));
    apply(global.KB_SITE_LANGUAGE?.get() || "hu", false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready, { once: true });
  else ready();
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";
  const dictionary = {
    "Főoldal": ["Home", "Startseite"],
    "Kalkulátorok": ["Calculators", "Rechner"],
    "Összes kalkulátor": ["All calculators", "Alle Rechner"],
    "Pénzügy": ["Finance", "Finanzen"],
    "Pénzügyi kalkulátorok": ["Financial calculators", "Finanzrechner"],
    "Otthon & felújítás": ["Home & renovation", "Haus & Renovierung"],
    "Otthon és felújítás": ["Home & renovation", "Haus & Renovierung"],
    "Autó & közlekedés": ["Cars & transport", "Auto & Verkehr"],
    "Egészség & sport": ["Health & fitness", "Gesundheit & Sport"],
    "Mindennapok": ["Everyday life", "Alltag"],
    "Átváltók": ["Converters", "Umrechner"],
    "Tudományos számológép": ["Scientific calculator", "Wissenschaftlicher Taschenrechner"],
    "Döntések": ["Decisions", "Entscheidungen"],
    "Összehasonlítás": ["Comparison", "Vergleich"],
    "Tudástár": ["Knowledge base", "Wissensbereich"],
    "Aktuális változások": ["Latest updates", "Aktuelle Änderungen"],
    "Aktuális": ["Latest", "Aktuelles"],
    "Élethelyzetek": ["Life situations", "Lebenssituationen"],
    "Pénzügyi tudatosság": ["Financial awareness", "Finanzwissen"],
    "Számítási módszertan": ["Calculation methodology", "Berechnungsmethodik"],
    "Miért bízhatsz bennünk?": ["Why trust us?", "Warum uns vertrauen?"],
    "Átláthatóság és minőség": ["Transparency & quality", "Transparenz & Qualität"],
    "Rólunk": ["About us", "Über uns"],
    "Kapcsolat": ["Contact", "Kontakt"],
    "Kalkulátor keresése": ["Find a calculator", "Rechner suchen"],
    "Ugrás a tartalomhoz": ["Skip to content", "Zum Inhalt springen"],
    "Kategóriák": ["Categories", "Kategorien"],
    "Kalkulátorkategóriák": ["Calculator categories", "Rechnerkategorien"],
    "Keresés": ["Search", "Suche"],
    "Keresés kalkulátorok között...": ["Search calculators...", "Rechner suchen..."],
    "Minden kalkulátor": ["All calculators", "Alle Rechner"],
    "Nettó–bruttó kalkulátor 2026": ["Net–gross salary calculator 2026", "Netto-Brutto-Rechner 2026"],
    "Nettó–bruttó kalkulátor": ["Net–gross salary calculator", "Netto-Brutto-Rechner"],
    "Nettó fizetés": ["Net salary", "Nettogehalt"],
    "Nettó fizetés (Ft)": ["Net salary (HUF)", "Nettogehalt (HUF)"],
    "Bruttó fizetés": ["Gross salary", "Bruttogehalt"],
    "Bruttó fizetés (Ft)": ["Gross salary (HUF)", "Bruttogehalt (HUF)"],
    "Nettó fizetés:": ["Net salary:", "Nettogehalt:"],
    "Bruttó → Nettó": ["Gross → Net", "Brutto → Netto"],
    "Nettó → Bruttó": ["Net → Gross", "Netto → Brutto"],
    "Számítás": ["Calculate", "Berechnen"],
    "Számolás": ["Calculate", "Berechnen"],
    "Eredmény": ["Result", "Ergebnis"],
    "Eredmények": ["Results", "Ergebnisse"],
    "Új számítás": ["New calculation", "Neue Berechnung"],
    "Vissza": ["Back", "Zurück"],
    "Tovább": ["Continue", "Weiter"],
    "Ötletet küldök": ["Send an idea", "Idee senden"],
    "Segíts fejleszteni a Kalkulátor Bázist": ["Help improve Kalkulátor Bázis", "Hilf mit, Kalkulátor Bázis zu verbessern"],
    "Nem találtad meg a keresett számítást vagy döntési helyzetet?": [
      "Didn't find the calculation or decision aid you need?",
      "Du hast den passenden Rechner oder die richtige Entscheidungshilfe nicht gefunden?"
    ],
    "Adatvédelem": ["Privacy", "Datenschutz"],
    "Sütibeállítások": ["Cookie settings", "Cookie-Einstellungen"],
    "Felhasználási feltételek": ["Terms of use", "Nutzungsbedingungen"],
    "Jogi nyilatkozat": ["Legal notice", "Rechtlicher Hinweis"],
    "Impresszum": ["Legal information", "Impressum"],
    "Tudj meg többet": ["Learn more", "Mehr erfahren"],
    "Források": ["Sources", "Quellen"],
    "Magyar fejlesztés": ["Developed in Hungary", "In Ungarn entwickelt"],
    "Ingyenes": ["Free", "Kostenlos"],
    "Fizetési határidő kalkulátor": ["Payment deadline calculator", "Zahlungsfrist-Rechner"],
    "ÁFA kalkulátor": ["VAT calculator", "Mehrwertsteuer-Rechner"],
    "Százalék kalkulátor": ["Percentage calculator", "Prozentrechner"],
    "Terhességi kalkulátor": ["Pregnancy calculator", "Schwangerschaftsrechner"],
    "Számlateljesítés kalkulátor": ["Invoice performance date calculator", "Rechner für den Leistungszeitpunkt"]
  };
  // Reviewed EN/DE wording for the six category landing pages and all topic groups.
  // Exact Hungarian source matches only: calculator computation text remains unchanged.
  Object.assign(dictionary, {
    "Mindennapi kalkulátorok": ["Everyday calculators","Alltagsrechner"],
    "Vásárlás, közös költségek, egyszerű matematika, munka és dátumok jól elkülönített csoportokban.": ["Shopping, shared expenses, basic maths, work and dates in clear groups.","Einkäufe, gemeinsame Kosten, einfache Mathematik, Arbeit und Datumsberechnungen – übersichtlich gruppiert."],
    "A mindennapi eszközök a vásárlási, háztartási, munkával kapcsolatos, matematikai és dátumszámításokat külön témacsoportokban teszik gyorsan elérhetővé.": ["Everyday tools make shopping, household, work-related, maths and date calculations easy to find in separate categories.","Alltagsrechner erleichtern den Zugang zu Berechnungen für Einkäufe, Haushalt, Arbeit, Mathematik und Termine in eigenen Themenbereichen."],
    "Vásárlás és háztartás": ["Shopping and household","Einkaufen und Haushalt"],
    "Árak, kedvezmények, egységárak és közös kiadások gyors ellenőrzéséhez.": ["For quick comparisons of prices, discounts, unit prices and shared expenses.","Zum schnellen Prüfen von Preisen, Rabatten, Grundpreisen und gemeinsamen Ausgaben."],
    "Munka és jövedelem": ["Work and income","Arbeit und Einkommen"],
    "Munkaidő és órabér egyszerű, gyors ellenőrzéséhez.": ["For quick, simple checks of working hours and hourly pay.","Zur einfachen und schnellen Prüfung von Arbeitszeiten und Stundenlohn."],
    "Matematika": ["Mathematics","Mathematik"],
    "Százalék, arány és átlag a hétköznapi számolásokhoz.": ["Percentages, ratios and averages for everyday calculations.","Prozente, Verhältnisse und Durchschnittswerte für den Alltag."],
    "Idő és dátum": ["Time and dates","Zeit und Datum"],
    "Életkor és két dátum közötti időtartam kiszámításához.": ["To calculate age and the duration between two dates.","Zur Berechnung des Alters und der Dauer zwischen zwei Daten."],
    "Jövedelem, háztartási keret, hitelek, megtakarítás és befektetés átlátható témacsoportokban.": ["Income, household budgets, loans, savings and investments in clear topic groups.","Einkommen, Haushaltsbudget, Kredite, Sparen und Investitionen in übersichtlichen Themenbereichen."],
    "A pénzügyi eszközök a jövedelem tisztázásától a hitel teherbírásán át a megtakarítás és befektetés forgatókönyveiig támogatják a döntés előkészítését.": ["Financial tools help you explore your income, loan affordability, savings and investment scenarios before making a decision.","Finanzrechner helfen, Einkommen, Kredittragbarkeit sowie Spar- und Anlageszenarien vor einer Entscheidung zu bewerten."],
    "Jövedelem és költségvetés": ["Income and budgeting","Einkommen und Budget"],
    "Bér és háztartási pénzügyek áttekintéséhez.": ["For an overview of wages and household finances.","Für den Überblick über Lohn und Haushaltsfinanzen."],
    "Hitelek és ingatlan": ["Loans and property","Kredite und Immobilien"],
    "Törlesztés, hitelképesség és önerő tervezéséhez.": ["For planning repayments, borrowing capacity and down payments.","Zur Planung von Kreditraten, Kreditfähigkeit und Eigenkapital."],
    "Megtakarítás és befektetés": ["Savings and investments","Sparen und Investieren"],
    "Hosszú távú vagyonépítés, hozam és vásárlóerő modellezéséhez.": ["To model long-term wealth building, returns and purchasing power.","Zur Modellierung von langfristigem Vermögensaufbau, Renditen und Kaufkraft."],
    "Számlázás és határidők": ["Invoicing and deadlines","Rechnungsstellung und Fristen"],
    "Számlák teljesítési és fizetési dátumainak gyors ellenőrzéséhez.": ["For quick checks of invoice performance and payment dates.","Zur schnellen Prüfung von Leistungs- und Zahlungsdaten auf Rechnungen."],
    "Otthon és felújítás kalkulátorok": ["Home and renovation calculators","Haus- und Renovierungsrechner"],
    "Anyagigény, burkolás, felületképzés és szerkezeti becslések felújításhoz vagy építkezéshez.": ["Material quantities, tiling, surface finishing and structural estimates for renovation or construction.","Materialbedarf, Fliesen, Oberflächen und konstruktive Schätzungen für Sanierung oder Neubau."],
    "Az otthon és felújítás eszközei a helyszíni méretekből, anyagjellemzőkből és ráhagyásból készítenek átlátható beszerzési becslést.": ["Home and renovation tools provide transparent purchase estimates based on measurements, material properties and allowances.","Haus- und Renovierungsrechner erstellen nachvollziehbare Einkaufsabschätzungen aus Maßen, Materialeigenschaften und Zuschlägen."],
    "Szerkezet és szigetelés": ["Structure and insulation","Konstruktion und Dämmung"],
    "Falakhoz, födémhez, tetőhöz és szerkezeti anyagokhoz.": ["For walls, ceilings, roofing and structural materials.","Für Wände, Decken, Dächer und Baumaterialien."],
    "Burkolás és felületek": ["Tiling and surfaces","Fliesen und Oberflächen"],
    "Csempéhez, padlóhoz, festéshez, tapétához és térkövezéshez.": ["For tiles, floors, painting, wallpaper and paving.","Für Fliesen, Böden, Anstriche, Tapeten und Pflasterarbeiten."],
    "Autó és közlekedés kalkulátorok": ["Cars and transport calculators","Auto- und Verkehrsrechner"],
    "Utazás, üzemanyag, fenntartási költség, műszaki összehasonlítás és környezeti becslések.": ["Trips, fuel, ownership costs, technical comparisons and environmental estimates.","Reisen, Kraftstoff, Unterhaltskosten, technische Vergleiche und Umweltabschätzungen."],
    "Az autó és közlekedés eszközei külön kezelik az út tervezését, a mért fogyasztást, a fenntartási költségeket és a jármű műszaki összehasonlítását.": ["Car and transport tools separately cover journey planning, measured fuel use, ownership costs and vehicle specifications.","Auto- und Verkehrsrechner behandeln Routenplanung, gemessenen Verbrauch, Unterhaltskosten und Fahrzeugdaten getrennt."],
    "Utazás és üzemanyag": ["Travel and fuel","Reisen und Kraftstoff"],
    "Fogyasztás, tankolás, hatótáv, menetidő és útköltség tervezéséhez.": ["For planning fuel use, refuelling, range, journey times and travel costs.","Zur Planung von Verbrauch, Tanken, Reichweite, Fahrzeit und Reisekosten."],
    "Fenntartás és költség": ["Ownership and costs","Unterhalt und Kosten"],
    "Éves költség, értékvesztés és kilométerenkénti ráfordítás becsléséhez.": ["For estimating annual costs, depreciation and cost per kilometre.","Zur Schätzung von Jahreskosten, Wertverlust und Kosten pro Kilometer."],
    "Műszaki és környezeti adatok": ["Technical and environmental data","Technische und Umweltdaten"],
    "Gumiméret-összehasonlításhoz és CO₂-kibocsátási becsléshez.": ["For comparing tyre sizes and estimating CO₂ emissions.","Zum Vergleich von Reifengrößen und zur Abschätzung des CO₂-Ausstoßes."],
    "Egészség és sport kalkulátorok": ["Health and fitness calculators","Gesundheits- und Sportrechner"],
    "Testösszetétel, táplálkozás, energiaigény, edzés és regeneráció óvatos értelmezéssel.": ["Body composition, nutrition, energy needs, training and recovery, with cautious interpretation.","Körperzusammensetzung, Ernährung, Energiebedarf, Training und Erholung – mit vorsichtiger Interpretation."],
    "Az egészség és sport kalkulátorok a mérhető trendek követését segítik, de nem helyettesítik a diagnózist vagy a személyre szabott szakmai tanácsot.": ["Health and fitness calculators help track measurable trends but do not replace diagnosis or individual professional advice.","Gesundheits- und Sportrechner helfen bei der Beobachtung messbarer Trends, ersetzen jedoch keine Diagnose oder individuelle Fachberatung."],
    "Testsúly és testösszetétel": ["Weight and body composition","Gewicht und Körperzusammensetzung"],
    "Testsúly, BMI, testzsír és testarányok tájékozódó becsléséhez.": ["For indicative estimates of weight, BMI, body fat and body proportions.","Für orientierende Schätzungen zu Gewicht, BMI, Körperfett und Körperproportionen."],
    "Táplálkozás és energia": ["Nutrition and energy","Ernährung und Energie"],
    "Kalória-, makró-, fehérje- és folyadékigény becsléséhez.": ["For estimates of calories, macronutrients, protein and fluid needs.","Zur Schätzung des Kalorien-, Makronährstoff-, Protein- und Flüssigkeitsbedarfs."],
    "Edzés és regeneráció": ["Training and recovery","Training und Regeneration"],
    "Pulzustartományok és alvási időzítés tervezéséhez.": ["For planning heart-rate zones and sleep timing.","Zur Planung von Pulsbereichen und Schlafzeiten."],
    "Család": ["Family","Familie"],
    "Családi élethelyzethez kapcsolódó tájékozódó számításokhoz.": ["For indicative calculations relating to family life.","Für orientierende Berechnungen zu familiären Lebenssituationen."],
    "Átváltók és mértékegységek": ["Unit converters and measurements","Einheiten und Umrechner"],
    "Egy közös mértékegység-átváltó 11 kategóriához, plusz külön élő devizaeszköz.": ["One unit converter covering 11 categories, plus a separate live currency tool.","Ein Umrechner für 11 Einheitenkategorien und ein eigener Währungsrechner mit Live-Kursen."],
    "A mértékegység-átváltó egyetlen felületen kezeli a hétköznapi, műszaki és digitális egységeket; a változó árfolyamú deviza külön eszköz marad.": ["The unit converter brings everyday, technical and digital units together; currencies with changing exchange rates remain a separate tool.","Der Einheitenrechner vereint Alltags-, technische und digitale Einheiten; Währungen mit schwankenden Kursen bleiben ein separates Werkzeug."],
    "Mértékegység átváltó központ": ["Unit converter hub","Einheitenrechner-Zentrale"],
    "11 kategória egyetlen eszközben: hétköznapi, műszaki és digitális egységekhez.": ["11 categories in one tool for everyday, technical and digital units.","11 Kategorien in einem Werkzeug für Alltags-, technische und digitale Einheiten."],
    "Hétköznapi fizikai egységek": ["Everyday physical units","Physikalische Alltagseinheiten"],
    "Tömeg, hőmérséklet, idő és sebesség átváltásához.": ["For converting mass, temperature, time and speed.","Zur Umrechnung von Masse, Temperatur, Zeit und Geschwindigkeit."],
    "Műszaki és digitális egységek": ["Technical and digital units","Technische und digitale Einheiten"],
    "Energia, nyomás, teljesítmény és adatméret átváltásához.": ["For converting energy, pressure, power and data sizes.","Zur Umrechnung von Energie, Druck, Leistung und Datengrößen."],
    "Deviza": ["Currency","Währungen"],
    "Pénznemek közötti tájékozódó átváltáshoz.": ["For indicative conversions between currencies.","Zur orientierenden Umrechnung zwischen Währungen."],
    "A kalkulátorok mobilon is gyorsan használhatók, a számításokhoz csak a legfontosabb adatokat kell megadnod.": ["The calculators are quick to use on mobile, and you only need to enter the essential information.","Die Rechner lassen sich auch mobil schnell bedienen; du musst nur die wichtigsten Angaben eingeben."],
  });
  dictionary["Mindennapi kalkulátorok egy helyen"] = ["Everyday calculators in one place","Alltagsrechner an einem Ort"];
  dictionary["Pénzügyi kalkulátorok egy helyen"] = ["Calculators in one place","Rechner an einem Ort"];
  dictionary["Otthon és felújítás kalkulátorok egy helyen"] = ["Home and renovation calculators in one place","Haus- und Renovierungsrechner an einem Ort"];
  dictionary["Autó és közlekedés kalkulátorok egy helyen"] = ["Cars and transport calculators in one place","Auto- und Verkehrsrechner an einem Ort"];
  dictionary["Egészség és sport kalkulátorok egy helyen"] = ["Health and fitness calculators in one place","Gesundheits- und Sportrechner an einem Ort"];
  dictionary["Átváltók és mértékegységek egy helyen"] = ["Unit converters and measurements in one place","Einheiten und Umrechner an einem Ort"];
  const fallback = {
    en: "Language preference: English. Navigation and selected interface labels are translated. Calculator explanations, legal details and some results are still in Hungarian and follow Hungarian rules.",
    de: "Spracheinstellung: Deutsch. Navigation und ausgewählte Bedienelemente sind übersetzt. Rechnererklärungen, rechtliche Hinweise und einige Ergebnisse bleiben auf Ungarisch und folgen ungarischen Regeln."
  };
  function translate(text, lang) {
    if (!["en", "de"].includes(lang)) return null;
    const entry = Object.prototype.hasOwnProperty.call(dictionary, text) ? dictionary[text] : null;
    return entry ? entry[lang === "en" ? 0 : 1] : null;
  }
  return { supported: ["hu", "en", "de"], translate, fallback, dictionary };
});

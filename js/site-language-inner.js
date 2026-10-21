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
    const blocked = "script,style,textarea,code,pre,option,[contenteditable],.kb-inner-language,.kb-inner-language-notice";
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

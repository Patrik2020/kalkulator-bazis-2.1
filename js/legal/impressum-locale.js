/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "impresszum", main = doc.getElementById("main-content");
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), originals = new Map();
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        const current = node.nodeValue, old = textState.get(node), source = old?.rendered === current ? old.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
        if (!parts?.[2]) continue;
        const translated = api.translate(page, parts[2], language), value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector);
        if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source;
        if (selector === "title") element.textContent = value;
        else element.content = value;
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => {
    if (changes.some(change => change.type === "childList" || change.type === "characterData")) render();
  }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "impresszum";
  const entries = [
    ["Impresszum", "Legal notice", "Impressum"],
    ["Legal information", "Legal notice", "Impressum"],
    ["Az alábbi adatok a Kalkulátor Bázis weboldal üzemeltetőjének és a weboldal tárhelyszolgáltatójának azonosítását és közvetlen elérhetőségét szolgálják.", "The following details identify the operator and hosting provider of the Kalkulátor Bázis website and provide ways to contact them directly.", "Die folgenden Angaben dienen der Identifizierung und direkten Kontaktaufnahme mit dem Betreiber und Hostinganbieter der Website Kalkulátor Bázis."],
    ["Szolgáltató / üzemeltető adatai", "Service provider / website operator", "Angaben zum Diensteanbieter / Betreiber"],
    ["Név:", "Name:", "Name:"],
    ["Kovács Patrik", "Kovács Patrik", "Kovács Patrik"],
    ["Cím:", "Address:", "Anschrift:"],
    ["1181 Budapest, Havanna utca 73.", "1181 Budapest, Havanna utca 73.", "1181 Budapest, Havanna utca 73."],
    ["E-mail:", "Email:", "E-Mail:"],
    ["kalkulatorbazis@gmail.com", "kalkulatorbazis@gmail.com", "kalkulatorbazis@gmail.com"],
    ["Weboldal:", "Website:", "Website:"],
    ["https://kalkulatorbazis.hu/", "https://kalkulatorbazis.hu/", "https://kalkulatorbazis.hu/"],
    ["A weboldal jelenleg ingyenesen használható online kalkulátorokat és kapcsolódó tájékoztató tartalmakat biztosít. A kalkulátorok eredményei tájékoztató jellegűek; a részletes felhasználási és felelősségi szabályokat a", "The website currently provides free online calculators and related information. Calculator results are for general information only; detailed terms of use and liability provisions can be found on the", "Die Website stellt derzeit kostenlos nutzbare Online-Rechner und dazugehörige Informationsinhalte bereit. Die Ergebnisse der Rechner dienen nur zur Orientierung; die ausführlichen Nutzungs- und Haftungsbestimmungen sind in den"],
    ["Felhasználási feltételek", "Terms of Use", "Nutzungsbedingungen"],
    ["és a", "and the", "und im"],
    ["Jogi nyilatkozat", "Disclaimer", "Haftungsausschluss"],
    ["oldalakon olvashatók.", "pages.", "zu finden."],
    ["Tárhelyszolgáltató", "Hosting provider", "Hostinganbieter"],
    ["Szolgáltató:", "Provider:", "Anbieter:"],
    ["Cloudflare, Inc.", "Cloudflare, Inc.", "Cloudflare, Inc."],
    ["Székhely:", "Registered office:", "Sitz:"],
    ["101 Townsend St., San Francisco, CA 94107, United States", "101 Townsend St., San Francisco, CA 94107, United States", "101 Townsend St., San Francisco, CA 94107, Vereinigte Staaten"],
    ["Elektronikus elérhetőség:", "Online support:", "Elektronischer Kontakt:"],
    ["Cloudflare Support", "Cloudflare Support", "Cloudflare Support"],
    ["https://www.cloudflare.com/", "https://www.cloudflare.com/", "https://www.cloudflare.com/"],
    ["A Kalkulátor Bázis statikus weboldalát a Cloudflare Pages szolgáltatás teszi elérhetővé. A hálózati kiszolgálást, HTTPS-kapcsolatot és kapcsolódó infrastruktúrát a Cloudflare szolgáltatásai biztosítják; a részletes adatkezelési feltételeket a Cloudflare saját dokumentációja és adatvédelmi tájékoztatója tartalmazza.", "The static Kalkulátor Bázis website is hosted on Cloudflare Pages. Cloudflare services provide network delivery, the HTTPS connection and related infrastructure; details of data processing are available in Cloudflare's own documentation and privacy policy.", "Die statische Website Kalkulátor Bázis wird über Cloudflare Pages bereitgestellt. Cloudflare-Dienste übernehmen die Netzwerkauslieferung, die HTTPS-Verbindung und die zugehörige Infrastruktur; Einzelheiten zur Datenverarbeitung finden sich in der Dokumentation und Datenschutzerklärung von Cloudflare."],
    ["Kapcsolat", "Contact", "Kontakt"],
    ["A weboldallal, tartalommal, jogi tájékoztatással vagy hibabejelentéssel kapcsolatos megkeresések a", "Enquiries about the website, its content, legal information or error reports can be sent to", "Anfragen zur Website, zu ihren Inhalten, rechtlichen Informationen oder Fehlermeldungen können an"],
    ["e-mail-címre küldhetők.", "email address.", "gesendet werden."],
    ["Utolsó frissítés: 2026.08.13.", "Last updated: 13 August 2026", "Zuletzt aktualisiert: 13. August 2026"],
    ["Üzemeltetői adatok", "Operator details", "Betreiberangaben"],
    ["Mit érdemes ezen az oldalon keresni?", "What information can you find on this page?", "Welche Informationen findest du auf dieser Seite?"],
    ["Ki üzemelteti vagy felel a webhelyért?", "Who operates or is responsible for the website?", "Wer betreibt die Website oder ist für sie verantwortlich?"],
    ["Milyen közvetlen kapcsolatfelvételi lehetőség áll rendelkezésre?", "How can the operator be contacted directly?", "Wie kann der Betreiber direkt kontaktiert werden?"],
    ["Hol érhetők el az adatvédelmi, felhasználási és jogi feltételek?", "Where can you find the privacy, terms of use and legal information?", "Wo sind die Datenschutz-, Nutzungs- und Rechtshinweise zu finden?"],
    ["Hogyan lehet hibát, jogi vagy tartalmi észrevételt jelezni?", "How can you report an error or submit legal or content-related feedback?", "Wie können Fehler sowie rechtliche oder inhaltliche Hinweise gemeldet werden?"],
    ["Az impresszum az üzemeltetői azonosíthatóságot szolgálja; a számítási módszertant és minőségbiztosítást külön oldalak részletezik.", "This legal notice identifies the website operator; calculation methods and quality assurance are covered on separate pages.", "Das Impressum dient der Identifizierung des Websitebetreibers; Berechnungsmethoden und Qualitätssicherung werden auf gesonderten Seiten erläutert."],
    ["Impresszum | Kalkulátor Bázis", "Legal Notice | Kalkulátor Bázis", "Impressum | Kalkulátor Bázis"],
    ["A Kalkulátor Bázis impresszuma és szolgáltatói adatai, valamint a tárhelyszolgáltató elérhetőségei.", "Legal notice for Kalkulátor Bázis, including website operator details and contact information for the hosting provider.", "Impressum von Kalkulátor Bázis mit Angaben zum Websitebetreiber und Kontaktinformationen des Hostinganbieters."],
    ["A Kalkulátor Bázis szolgáltatói és tárhelyszolgáltatói adatai.", "Website operator and hosting provider details for Kalkulátor Bázis.", "Angaben zum Websitebetreiber und Hostinganbieter von Kalkulátor Bázis."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) {
    if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    return pair ? pair[language === "en" ? 0 : 1] : null;
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate };
});

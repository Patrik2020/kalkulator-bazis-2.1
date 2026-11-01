/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "fektav-kalkulator";
  const main = doc.querySelector('main[data-batch02-calc="fektav-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();
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
        const translated = api.translate(page, parts[2], language);
        const value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element);
        if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name);
          const source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.has("errorHref") ? originals.get("errorHref") : errorLink.getAttribute("href");
        originals.set("errorHref", source);
        errorLink.setAttribute("href", api.reportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Retain source data. */ }
      }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.has(selector) ? originals.get(selector) : (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "fektav-kalkulator";
  const entries = [
    ["hu-HU","en-GB","de-DE"],
    ["Féktáv kalkulátor | Kalkulátor Bázis","Braking Distance Calculator | Kalkulátor Bázis","Bremswegrechner | Kalkulátor Bázis"],
    ["Féktáv kalkulátor","Braking Distance Calculator","Bremswegrechner"],
    ["Féktáv","Braking distance","Bremsweg"],
    ["Elméleti reakcióút, fékút és teljes megállási távolság becslése sebesség, reakcióidő és tapadási tényező alapján.","Estimate reaction distance, theoretical braking distance and total stopping distance from speed, reaction time and grip coefficient.","Schätze Reaktionsweg, theoretischen Bremsweg und gesamten Anhalteweg anhand von Geschwindigkeit, Reaktionszeit und Reibwert."],
    ["Autó és közlekedés kalkulátorok","Car and transport calculators","Rechner für Auto und Verkehr"],
    ["Főoldal","Home","Startseite"],["Autó & közlekedés","Cars & transport","Auto & Verkehr"],["Morzsamenü","Breadcrumb","Brotkrumennavigation"],["Hirdetés","Advertisement","Anzeige"],
    ["Sebesség (km/h)","Speed (km/h)","Geschwindigkeit (km/h)"],
    ["Reakcióidő (s)","Reaction time (s)","Reaktionszeit (s)"],
    ["Tapadási tényező (μ)","Grip coefficient (μ)","Reibwert (μ)"],
    ["Eredmény:","Result:","Ergebnis:"],
    ["Reakcióút:","Reaction distance:","Reaktionsweg:"],
    ["Elméleti fékút:","Theoretical braking distance:","Theoretischer Bremsweg:"],
    ["Teljes megállási távolság:","Total stopping distance:","Gesamter Anhalteweg:"],
    ["Reakcióút","Reaction distance","Reaktionsweg"],
    ["Elméleti fékút","Theoretical braking distance","Theoretischer Bremsweg"],
    ["Teljes megállási távolság","Total stopping distance","Gesamter Anhalteweg"],
    ["Sebesség: adj meg érvényes számot.","Speed: enter a valid number.","Geschwindigkeit: Gib eine gültige Zahl ein."],
    ["Sebesség: az érték nem lehet negatív.","Speed: the value cannot be negative.","Geschwindigkeit: Der Wert darf nicht negativ sein."],
    ["Reakcióidő: adj meg érvényes számot.","Reaction time: enter a valid number.","Reaktionszeit: Gib eine gültige Zahl ein."],
    ["Reakcióidő: az érték nem lehet negatív.","Reaction time: the value cannot be negative.","Reaktionszeit: Der Wert darf nicht negativ sein."],
    ["Tapadási tényező: adj meg érvényes számot.","Grip coefficient: enter a valid number.","Reibwert: Gib eine gültige Zahl ein."],
    ["Tapadási tényező: az érték legyen nagyobb nullánál.","Grip coefficient: the value must be greater than zero.","Reibwert: Der Wert muss größer als null sein."],
    ["A tapadási tényező legfeljebb 1,5 legyen.","The grip coefficient must not exceed 1.5.","Der Reibwert darf höchstens 1,5 betragen."],
    ["Adj meg érvényes adatokat.","Enter valid values.","Gib gültige Werte ein."],
    ["Hasznos volt ez a kalkulátor?","Was this calculator useful?","War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.","Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.","Save Kalkulátor Bázis to return to this calculation in one click — or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren – oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek","Bookmarking, installation and sharing actions","Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm","Bookmark","Lesezeichen"],["Telepítem","Install","Installieren"],["Megosztom","Share","Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.","Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.","Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    ["Mit becsül a féktáv kalkulátor?","What does the braking distance calculator estimate?","Was schätzt der Bremswegrechner?"],
    ["A teljes megállási távolság két részből áll: a vezető reakcióideje alatt megtett","Total stopping distance has two parts: the distance travelled during the driver's reaction time, called","Der gesamte Anhalteweg besteht aus zwei Teilen: dem während der Reaktionszeit zurückgelegten"],
    ["reakcióútból","reaction distance","Reaktionsweg"],
    ["és a tényleges lassítás alatt megtett","and the distance travelled while braking, called","und dem während des Bremsens zurückgelegten"],
    ["fékútból","braking distance","Bremsweg"],
    [". A kalkulátor ezeket külön is megmutatja, hogy látható legyen, miért nő gyorsan a szükséges távolság a sebesség emelkedésével.",". The calculator shows them separately to illustrate why the required distance rises rapidly with speed.",". Der Rechner zeigt beide getrennt, damit erkennbar wird, warum die benötigte Strecke mit steigender Geschwindigkeit rasch wächst."],
    ["A reakcióút a sebesség és a reakcióidő szorzata. Az elméleti fékút sík úton a v²/(2·μ·g) képlettel készül, ahol μ a megadott tapadási tényező, g pedig 9,80665 m/s².","Reaction distance equals speed multiplied by reaction time. On a level road, theoretical braking distance uses v²/(2·μ·g), where μ is the entered grip coefficient and g is 9.80665 m/s².","Der Reaktionsweg ist Geschwindigkeit mal Reaktionszeit. Auf ebener Straße ergibt sich der theoretische Bremsweg aus v²/(2·μ·g), wobei μ der eingegebene Reibwert und g = 9,80665 m/s² ist."],
    ["Miért csak becslés?","Why is this only an estimate?","Warum ist das nur eine Schätzung?"],
    ["A valós fékút függ a gumiabroncs állapotától és hőmérsékletétől, az útfelülettől, a lejtéstől, a jármű fékrendszerétől, terhelésétől, az ABS működésétől és számos más körülménytől. A tapadási tényező nem egy fix „útminőség” szám, hanem erősen helyzetfüggő közelítés.","Actual braking distance depends on tyre condition and temperature, road surface, gradient, brakes, vehicle load, ABS behaviour and many other factors. The grip coefficient is an estimate that varies with conditions, not a fixed measure of road quality.","Der tatsächliche Bremsweg hängt unter anderem von Zustand und Temperatur der Reifen, Fahrbahn, Gefälle, Bremsanlage, Beladung und ABS ab. Der Reibwert ist kein fester Wert für die Straßenqualität, sondern eine stark situationsabhängige Näherung."],
    ["Példa","Example","Beispiel"],
    ["50 km/h, 1 másodperces reakcióidő és μ=0,7 mellett a reakcióút kb. 13,9 m, az elméleti fékút kb. 14,0 m, így a teljes becsült megállási távolság közel 27,9 m.","At 50 km/h, a reaction time of 1 second and μ = 0.7, reaction distance is about 13.9 m and theoretical braking distance about 14.0 m, for a total estimated stopping distance near 27.9 m.","Bei 50 km/h, einer Reaktionszeit von 1 Sekunde und μ = 0,7 beträgt der Reaktionsweg etwa 13,9 m und der theoretische Bremsweg etwa 14,0 m. Der geschätzte gesamte Anhalteweg liegt damit bei rund 27,9 m."],
    ["Biztonsági értelmezés","Interpreting the result safely","Sichere Einordnung des Ergebnisses"],
    ["A kalkulátor eredménye nem használható arra, hogy minimális követési távolságot vagy „biztonságos” sebességet igazoljon. Közúton mindig az aktuális látási, időjárási és forgalmi viszonyokhoz kell igazítani a sebességet és a követési távolságot.","The result cannot establish a minimum following distance or a “safe” speed. On public roads, adjust speed and following distance to the current visibility, weather and traffic conditions.","Das Ergebnis kann weder einen Mindestabstand noch eine „sichere“ Geschwindigkeit belegen. Passe Geschwindigkeit und Abstand im Straßenverkehr stets an Sicht, Wetter und Verkehr an."],
    ["Gyakori kérdések","Frequently asked questions","Häufige Fragen"],
    ["Mit jelent a μ érték?","What does μ mean?","Was bedeutet der Wert μ?"],
    ["Egy egyszerű tapadási közelítés a gumi és az út kapcsolatára. A valós érték sok tényezőtől függ és menet közben is változhat.","It is a simplified estimate of grip between tyre and road. The actual value depends on many factors and can change while driving.","Er ist eine vereinfachte Näherung für die Haftung zwischen Reifen und Fahrbahn. Der tatsächliche Wert hängt von vielen Faktoren ab und kann sich während der Fahrt ändern."],
    ["Miért nő ennyire gyorsan a fékút?","Why does braking distance rise so quickly?","Warum wächst der Bremsweg so schnell?"],
    ["Az elméleti fékút a sebesség négyzetével arányos, ezért kétszeres sebesség ideális esetben is körülbelül négyszeres fékutat jelent.","Theoretical braking distance is proportional to the square of speed. Doubling speed therefore means roughly four times the braking distance even under ideal conditions.","Der theoretische Bremsweg wächst mit dem Quadrat der Geschwindigkeit. Bei doppeltem Tempo ist er selbst unter idealen Bedingungen ungefähr viermal so lang."],
    ["Ez megadja a biztonságos követési távolságot?","Does this give a safe following distance?","Ergibt sich daraus ein sicherer Abstand?"],
    ["Nem. A követési távolságnál további bizonytalanságokkal és a forgalmi környezettel is számolni kell.","No. Following distance must also account for further uncertainties and the traffic situation.","Nein. Beim Sicherheitsabstand müssen weitere Unsicherheiten und die Verkehrssituation berücksichtigt werden."],
    ["Kapcsolódó kalkulátorok","Related calculators","Verwandte Rechner"],
    ["utazasi ido","travel time","Fahrzeit"],["gumi meret","tyre size","Reifengröße"],["auto","car","Auto"],
    ["Utolsó tartalmi frissítés:","Content last reviewed:","Inhalt zuletzt geprüft:"],
    ["2026. augusztus 21.","21 August 2026","21. August 2026"],
    ["Hitelesség és számítási korlátok","Reliability and calculation limits","Verlässlichkeit und Grenzen der Berechnung"],
    ["Elméleti fizikai becslés sík útra. Valós közúti fékút és biztonságos követési távolság meghatározására önmagában nem alkalmas.","A theoretical estimate for a level road. On its own, it cannot determine actual road braking distance or a safe following distance.","Eine theoretische Schätzung für ebene Fahrbahn. Für die Bestimmung des tatsächlichen Bremswegs oder eines sicheren Abstands im Straßenverkehr reicht sie allein nicht aus."],
    ["Számítási módszertan","Calculation methods","Berechnungsmethodik"],
    ["Hibát találtál? Jelezd.","Found an error? Let us know.","Fehler gefunden? Melde ihn uns."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    const match = /^(-?\d[\d\s\u00a0]*(?:,\d+)?)\s?(m)$/u.exec(normalized);
    if (match) {
      const number = Number(match[1].replace(/[\s\u00a0]/gu, "").replace(",", "."));
      const formatted = new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 2 }).format(number);
      return formatted + " " + match[2];
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Braking Distance Calculator" : "Fehlermeldung – Bremswegrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en"
      ? "Calculator: Braking Distance Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/fektav-kalkulator.html\n\nBrief description of the issue:\n"
      : "Rechner: Bremswegrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/fektav-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

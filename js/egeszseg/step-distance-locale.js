/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "lepesszam-tavolsag-kalkulator", main = doc.querySelector('main[data-batch04-calc="lepesszam-tavolsag-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attrState = new WeakMap(), originals = new Map();
  function localize(value) {
    if (typeof value === "string") return api.translate(page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    return value;
  }
  function render() {
    if (rendering) return; rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        const current = node.nodeValue, old = textState.get(node), source = old?.rendered === current ? old.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source); if (!parts?.[2]) continue;
        const translated = api.translate(page, parts[2], language), value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || old) textState.set(node, { source, rendered: value });
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element); if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name), source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source; if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) { const source = originals.get("errorHref") || errorLink.getAttribute("href"); originals.set("errorHref", source); errorLink.setAttribute("href", api.reportHref(source, language)); }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) { if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent); try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep source data. */ } }
      for (const selector of ["title", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector); if (!element) continue;
        const source = originals.get(selector) || (selector === "title" ? element.textContent : element.content); originals.set(selector, source);
        const value = api.translate(page, source, language) ?? source; if (selector === "title") element.textContent = value; else element.content = value;
      }
    } finally { rendering = false; }
  }
  function choose(next) { language = api.supported.includes(next) ? next : "hu"; render(); }
  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => { if (changes.some(change => change.type === "childList" || change.type === "characterData")) render(); }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "lepesszam-tavolsag-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Lépésszám–távolság kalkulátor | Kalkulátor Bázis", "Steps to Distance Calculator | Kalkulátor Bázis", "Schritte-in-Entfernung-Rechner | Kalkulátor Bázis"],
    ["Becsült megtett távolság és gyaloglási idő kiszámítása lépésszámból, átlagos lépéshosszból és lépésszámból percenként.", "Estimate walking distance and time from your step count, average step length and steps per minute.", "Schätze Gehstrecke und Gehzeit anhand der Schrittzahl, der durchschnittlichen Schrittlänge und der Schritte pro Minute."],
    ["Lépésszám–távolság kalkulátor", "Steps to Distance Calculator", "Schritte-in-Entfernung-Rechner"], ["Lépésszám–távolság", "Steps to distance", "Schritte in Entfernung"],
    ["Egészség és sport kalkulátorok", "Health and sport calculators", "Rechner für Gesundheit und Sport"], ["Főoldal", "Home", "Startseite"], ["Egészség & sport", "Health & sport", "Gesundheit & Sport"],
    ["Lépések száma", "Number of steps", "Anzahl der Schritte"], ["Átlagos lépéshossz (cm)", "Average step length (cm)", "Durchschnittliche Schrittlänge (cm)"], ["Lépésszám percenként", "Steps per minute", "Schritte pro Minute"],
    ["Eredmény:", "Result:", "Ergebnis:"], ["Becsült távolság", "Estimated distance", "Geschätzte Entfernung"], ["Becsült idő", "Estimated time", "Geschätzte Gehzeit"], ["Átlagsebesség", "Average speed", "Durchschnittsgeschwindigkeit"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"], ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."], ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"], ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"], ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."], ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Hogyan lesz a lépésszámból kilométer?", "How do you convert steps to kilometres?", "Wie werden aus Schritten Kilometer?"], ["A kalkulátor a lépések számát megszorozza az átlagos lépéshosszal. A centiméterben kapott teljes távolságot kilométerre váltja. A megadott percenkénti lépésszámból megbecsüli a szükséges időt és az átlagsebességet is.", "The calculator multiplies the number of steps by the average step length, then converts the distance from centimetres to kilometres. It also uses your steps per minute to estimate walking time and average speed.", "Der Rechner multipliziert die Schrittzahl mit der durchschnittlichen Schrittlänge und rechnet die Strecke von Zentimetern in Kilometer um. Aus den Schritten pro Minute schätzt er außerdem die Gehzeit und die Durchschnittsgeschwindigkeit."],
    ["Példa", "Example", "Beispiel"], ["10 000 lépés és 75 cm átlagos lépéshossz körülbelül 7,5 km. 110 lépés/perc átlagos ritmus mellett ez kb. 90,9 perc, ami kb. 4,95 km/h átlagsebességnek felel meg.", "10,000 steps at an average step length of 75 cm cover about 7.5 km. At 110 steps per minute, that takes about 90.9 minutes, equivalent to an average speed of about 4.95 km/h.", "10.000 Schritte mit einer durchschnittlichen Schrittlänge von 75 cm ergeben etwa 7,5 km. Bei 110 Schritten pro Minute dauert das rund 90,9 Minuten; das entspricht einer Durchschnittsgeschwindigkeit von etwa 4,95 km/h."],
    ["Miért csak becslés?", "Why is this only an estimate?", "Warum ist das nur eine Schätzung?"], ["A lépéshossz tempótól, tereptől, fáradtságtól és egyéni járásmintától is változik. Telefon vagy okosóra lépésszáma szintén tartalmazhat mérési hibát, ezért az eredmény nem GPS-pontosságú távolságmérés.", "Step length varies with pace, terrain, fatigue and individual walking style. A phone or smartwatch may also count steps inaccurately, so the result is not as precise as a GPS distance measurement.", "Die Schrittlänge verändert sich je nach Tempo, Gelände, Ermüdung und persönlichem Gangbild. Auch die Schrittzählung eines Smartphones oder einer Smartwatch kann fehlerhaft sein. Das Ergebnis ist daher keine GPS-genaue Streckenmessung."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"], ["Honnan tudom a lépéshosszamat?", "How can I find my step length?", "Wie ermittle ich meine Schrittlänge?"], ["Mérj le például 20–30 normál lépést egy ismert távolságon, majd oszd el a távolságot a lépések számával.", "Walk 20–30 normal steps over a measured distance, for example, then divide that distance by the number of steps.", "Gehe beispielsweise 20 bis 30 normale Schritte auf einer abgemessenen Strecke und teile die Strecke durch die Anzahl der Schritte."],
    ["10 000 lépés mindenkinek ugyanannyi kilométer?", "Do 10,000 steps cover the same distance for everyone?", "Sind 10.000 Schritte für alle gleich viele Kilometer?"], ["Nem. A távolság a lépéshossztól függ, ezért két ember azonos lépésszámmal eltérő távot tehet meg.", "No. Distance depends on step length, so two people taking the same number of steps may cover different distances.", "Nein. Die Entfernung hängt von der Schrittlänge ab. Zwei Personen können mit der gleichen Schrittzahl unterschiedliche Strecken zurücklegen."],
    ["Futáshoz is használható?", "Can I use it for running?", "Kann ich ihn auch zum Laufen verwenden?"], ["Közelítésként igen, de futásnál a lépéshossz és ritmus jobban változhat; pontosabb távhoz GPS-adat előnyösebb.", "Yes, as a rough estimate. Step length and cadence can vary more when running; GPS data is preferable for a more accurate distance.", "Ja, als grobe Schätzung. Beim Laufen können Schrittlänge und Schrittfrequenz stärker schwanken; für eine genauere Strecke sind GPS-Daten besser geeignet."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"], ["futotempo", "running pace", "Lauftempo"], ["kaloria", "calories", "Kalorien"], ["pulzus zona", "heart rate zones", "Pulszonen"], ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"], ["2026. augusztus 21.", "21 August 2026", "21. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"], ["Mozgási becslés, nem orvosi mérés. A valós távolság és tempó a lépéshossz változása és az eszköz lépésszámlálási hibája miatt eltérhet.", "An estimate of movement, not a medical measurement. Actual distance and pace may differ because step length changes and devices can miscount steps.", "Eine Schätzung der Bewegung, keine medizinische Messung. Die tatsächliche Strecke und das Tempo können wegen veränderlicher Schrittlänge und Zählfehlern des Geräts abweichen."], ["Számítási módszertan", "Calculation methodology", "Berechnungsmethodik"], ["Hibát találtál? Jelezd.", "Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."], ["Hirdetés", "Advertisement", "Anzeige"],
    ["Adj meg érvényes adatokat.", "Enter valid values.", "Gib gültige Werte ein."], ["A lépésszám egész szám legyen.", "The step count must be a whole number.", "Die Schrittzahl muss eine ganze Zahl sein."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)]; if (pair) return pair[language === "en" ? 0 : 1];
    if (normalized.endsWith(":")) {
      const base = normalized.slice(0, -1), basePair = dictionary[base] || dictionary[reverse.get(base)];
      if (basePair) return `${basePair[language === "en" ? 0 : 1]}:`;
    }
    let match = /^(\d[\d\s]*)(?:,([0-9]+))? (km\/h|km|perc)$/u.exec(normalized);
    if (match) {
      const number = Number(`${match[1].replace(/\s/gu, "")}.${match[2] || "0"}`);
      return `${new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 2 }).format(number)} ${match[3] === "perc" ? "min" : match[3]}`;
    }
    match = /^(Lépésszám|Lépéshossz|Lépésszám percenként): (adj meg érvényes számot\.|az érték nem lehet negatív\.|az érték legyen nagyobb nullánál\.)$/u.exec(normalized);
    if (match) {
      const labels = { "Lépésszám": ["Step count", "Schrittzahl"], "Lépéshossz": ["Step length", "Schrittlänge"], "Lépésszám percenként": ["Steps per minute", "Schritte pro Minute"] };
      const errors = { "adj meg érvényes számot.": ["enter a valid number.", "Gib eine gültige Zahl ein."], "az érték nem lehet negatív.": ["the value cannot be negative.", "Der Wert darf nicht negativ sein."], "az érték legyen nagyobb nullánál.": ["the value must be greater than zero.", "Der Wert muss größer als null sein."] };
      const index = language === "en" ? 0 : 1;
      return `${labels[match[1]][index]}: ${errors[match[2]][index]}`;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source); url.searchParams.set("subject", language === "en" ? "Error report – Steps to Distance Calculator" : "Fehlermeldung – Schritte-in-Entfernung-Rechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Steps to Distance Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/lepesszam-tavolsag-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Schritte-in-Entfernung-Rechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/lepesszam-tavolsag-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

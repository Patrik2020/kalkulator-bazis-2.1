/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document;
  const main = doc.querySelector('main[data-batch02-calc="aljzatkiegyenlito-kalkulator"]');
  if (!main) return;
  let language = "hu", rendering = false;
  const nodeStates = new WeakMap(), attributeStates = new WeakMap(), originals = new Map();
  function translateNode(node) {
    const current = node.nodeValue, state = nodeStates.get(node);
    const source = state && state.rendered === current ? state.source : current;
    const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
    if (!parts || !parts[2]) return;
    const result = parts[1] + (api.translate("aljzatkiegyenlito-kalkulator", parts[2], language) ?? parts[2]) + parts[3];
    if (result !== current) node.nodeValue = result;
    if (result !== source || state) nodeStates.set(node, { source, rendered: result });
  }
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        translateNode(node);
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        if (element.closest("[contenteditable],[translate='no']")) return;
        let state = attributeStates.get(element);
        if (!state) { state = new Map(); attributeStates.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) {
          if (!element.hasAttribute(name)) continue;
          const current = element.getAttribute(name), previous = state.get(name);
          const source = previous && previous.rendered === current ? previous.source : current;
          const result = api.translate("aljzatkiegyenlito-kalkulator", source, language) ?? source;
          if (result !== current) element.setAttribute(name, result);
          state.set(name, { source, rendered: result });
        }
      });
      for (const selector of ["title",'meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector);
        if (!element) continue;
        const key = selector === "title" ? "title" : selector + ":" + (element.getAttribute("name") || element.getAttribute("property") || "");
        if (!originals.has(key)) originals.set(key, selector === "title" ? element.textContent : element.getAttribute("content"));
        const source = originals.get(key), value = api.translate(source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.setAttribute("content", value);
      }
    } finally { rendering = false; }
  }
  doc.addEventListener("kb:language-changed", event => {
    language = api.supported.includes(event.detail?.language) ? event.detail.language : "hu";
    render();
  });
  language = api.supported.includes(root.KB_SITE_LANGUAGE?.get?.()) ? root.KB_SITE_LANGUAGE.get() : "hu";
  render();
  new root.MutationObserver(changes => {
    if (changes.some(change => change.type === "childList" || change.type === "characterData")) render();
  }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const dictionary = Object.freeze({
    "Főoldal": ["Home", "Startseite"],
    "Hirdetés": ["Advertisement", "Anzeige"],
    "Otthon & felújítás": ["Home & renovation", "Wohnen & Renovierung"],
    "Aljzatkiegyenlítő": ["Floor levelling compound", "Bodenausgleichsmasse"],
    "Aljzatkiegyenlítő kalkulátor": ["Floor Levelling Compound Calculator", "Bodenausgleich-Rechner"],
    "Aljzatkiegyenlítő anyagszükséglet és zsákszám becslése felület, átlagos rétegvastagság, fajlagos fogyás és ráhagyás alapján.": [
      "Estimate the amount of floor levelling compound and number of bags from the area, average layer thickness, product consumption rate and allowance.",
      "Schätze den Materialbedarf und die Anzahl der Säcke anhand der Fläche, der durchschnittlichen Schichtdicke, des Verbrauchs und des Zuschlags."
    ],
    "Felület (m²)": ["Area (m²)", "Fläche (m²)"],
    "Átlagos rétegvastagság (mm)": ["Average layer thickness (mm)", "Durchschnittliche Schichtdicke (mm)"],
    "Fajlagos fogyás (kg/m²/mm)": ["Product consumption (kg/m²/mm)", "Verbrauch (kg/m²/mm)"],
    "Ráhagyás (%)": ["Allowance (%)", "Zuschlag (%)"],
    "Zsák tömege (kg)": ["Bag weight (kg)", "Sackgewicht (kg)"],
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Alap anyagigény": ["Base material required", "Grundbedarf"],
    "Alap anyagigény:": ["Base material required:", "Grundbedarf:"],
    "Ráhagyással": ["Including allowance", "Mit Zuschlag"],
    "Ráhagyással:": ["Including allowance:", "Mit Zuschlag:"],
    "Szükséges zsák": ["Bags required", "Benötigte Säcke"],
    "Szükséges zsák:": ["Bags required:", "Benötigte Säcke:"],
    "Hasznos volt ez a kalkulátor?": ["Was this calculator useful?", "War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.": ["Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": [
      "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.",
      "Speichere Kalkulátor Bázis, um mit einem Klick zu dieser Berechnung zurückzukehren, oder teile sie mit jemandem, für den sie nützlich sein könnte."
    ],
    "Mentési, telepítési és megosztási műveletek": ["Bookmark, install and sharing options", "Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm": ["Bookmark", "Lesezeichen"],
    "Telepítem": ["Install", "Installieren"],
    "Megosztom": ["Share", "Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": [
      "Open your browser menu and look for Bookmark, Favorites or Save.",
      "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."
    ],
    "Másold ki ezt a hivatkozást, és küldd tovább.": ["Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    "Hogyan számolja az anyagszükségletet?": ["How does it calculate the material needed?", "Wie berechnet der Rechner den Materialbedarf?"],
    "A kalkulátor a felületet megszorozza az átlagos rétegvastagsággal és a termék fajlagos fogyásával, majd hozzáadja a választott ráhagyást. A végeredményt a zsák tömegével elosztva és felfelé kerekítve megkapod a becsült egész zsákszámot.": [
      "The calculator multiplies the area by the average layer thickness and the product's consumption rate, then adds your chosen allowance. Dividing the total by the bag weight and rounding up gives an estimate of the number of whole bags needed.",
      "Der Rechner multipliziert die Fläche mit der durchschnittlichen Schichtdicke und dem Verbrauch des Produkts und addiert anschließend den gewählten Zuschlag. Teilt man die Gesamtmenge durch das Sackgewicht und rundet auf, ergibt sich die geschätzte Anzahl ganzer Säcke."
    ],
    "A legfontosabb bemenet a gyártói": ["The most important input is the manufacturer's", "Die wichtigste Eingabe ist der vom Hersteller angegebene"],
    "fajlagos fogyás": ["product consumption rate", "Verbrauch"],
    ", amelyet általában kg/m²/mm formában adnak meg. A termék adatlapja mindig elsőbbséget élvez az itt szereplő példabeállítással szemben.": [
      ", usually stated in kg/m²/mm. Always follow the product data sheet rather than the example value shown here.",
      ", der meist in kg/m²/mm angegeben wird. Die Angaben im Produktdatenblatt haben stets Vorrang vor dem Beispielwert in diesem Rechner."
    ],
    "Miért csak átlagos vastagsággal számol?": ["Why does it use an average thickness?", "Warum wird mit einer durchschnittlichen Schichtdicke gerechnet?"],
    "A valós aljzat ritkán teljesen egyenletes. Ha egy helyen 2 mm, máshol 5 mm kiegyenlítés szükséges, akkor az átlagos rétegvastagság csak becslés. Nagy szintkülönbségnél érdemes több mérési pontból átlagot képezni, és ellenőrizni a termék minimális és maximális rétegvastagságát.": [
      "Real floors are rarely perfectly level. If one area needs 2 mm of compound and another needs 5 mm, the average layer thickness is only an estimate. Where level differences are substantial, measure several points, calculate an average and check the product's minimum and maximum layer thickness.",
      "Ein Untergrund ist selten vollkommen eben. Wenn an einer Stelle 2 mm und an einer anderen 5 mm ausgeglichen werden müssen, ist die durchschnittliche Schichtdicke nur ein Näherungswert. Bei größeren Höhenunterschieden solltest du an mehreren Stellen messen, einen Durchschnitt bilden und die zulässige Mindest- und Höchstschichtdicke des Produkts prüfen."
    ],
    "Példa": ["Example", "Beispiel"],
    "20 m² felület × 3 mm × 1,6 kg/m²/mm = 96 kg alapigény. 10% ráhagyással 105,6 kg adódik, ami 25 kg-os kiszerelésből 5 zsák beszerzését jelenti.": [
      "For a 20 m² area, 3 mm thickness and a consumption rate of 1.6 kg/m²/mm, the base amount is 96 kg. With a 10% allowance, the total is 105.6 kg, which means buying five 25 kg bags.",
      "Bei 20 m² Fläche, 3 mm Schichtdicke und einem Verbrauch von 1,6 kg/m²/mm beträgt der Grundbedarf 96 kg. Mit 10 % Zuschlag sind es 105,6 kg; bei 25-kg-Säcken werden fünf Säcke benötigt."
    ],
    "Mire figyelj kivitelezés előtt?": ["What should you check before installation?", "Worauf solltest du vor der Verarbeitung achten?"],
    "Az alapozás, az aljzat szilárdsága, nedvessége, a dilatációk és a termék feldolgozási ideje ugyanolyan fontos, mint a mennyiség. A kalkulátor beszerzési becslést ad, nem helyettesíti a gyártói technológiai előírást.": [
      "Priming, substrate strength and moisture, expansion joints and the product's working time matter just as much as the quantity. This calculator estimates how much to buy; it does not replace the manufacturer's installation instructions.",
      "Grundierung, Festigkeit und Feuchtigkeit des Untergrunds, Dehnungsfugen und Verarbeitungszeit sind ebenso wichtig wie die Menge. Dieser Rechner schätzt den Einkaufsbedarf und ersetzt nicht die Verarbeitungshinweise des Herstellers."
    ],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Milyen fajlagos fogyást adjak meg?": ["What consumption rate should I enter?", "Welchen Verbrauch soll ich eingeben?"],
    "A választott aljzatkiegyenlítő műszaki adatlapján szereplő kg/m²/mm értéket használd.": [
      "Use the kg/m²/mm value listed in the technical data sheet for the floor levelling compound you chose.",
      "Verwende den kg/m²/mm-Wert aus dem technischen Datenblatt der gewählten Bodenausgleichsmasse."
    ],
    "Miért kell ráhagyás?": ["Why include an allowance?", "Warum sollte ich einen Zuschlag einplanen?"],
    "Az aljzat egyenetlensége, a keverési és felhordási veszteség miatt érdemes némi tartalékot tervezni.": [
      "Uneven floors and material lost during mixing and application make it sensible to allow for a little extra.",
      "Unebenheiten des Untergrunds sowie Verluste beim Anmischen und Auftragen machen einen kleinen Zuschlag sinnvoll."
    ],
    "A kalkulátor megmondja a megfelelő rétegvastagságot?": ["Does the calculator tell me the right layer thickness?", "Gibt der Rechner die passende Schichtdicke vor?"],
    "Nem. A szükséges vastagságot helyszíni szintmérés és a kiválasztott termék megengedett rétegtartománya alapján kell meghatározni.": [
      "No. Determine the required thickness by measuring the floor on site and checking the permitted layer range for the product you selected.",
      "Nein. Die erforderliche Dicke muss vor Ort ausgemessen und mit dem zulässigen Schichtdickenbereich des gewählten Produkts abgeglichen werden."
    ],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "padlo burkolat": ["Flooring", "Bodenbelag"],
    "csemperagaszto": ["Tile adhesive", "Fliesenkleber"],
    "csempe": ["Tiles", "Fliesen"],
    "Utolsó tartalmi frissítés:": ["Last content update:", "Letzte inhaltliche Aktualisierung:"],
    "2026. augusztus 21.": ["21 August 2026", "21. August 2026"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limits", "Zuverlässigkeit und Grenzen der Berechnung"],
    "A mennyiség becslés; a konkrét termék gyártói fogyási adata, rétegvastagság-tartománya és feldolgozási előírása az irányadó.": [
      "The quantity is an estimate; the manufacturer's consumption data, permitted layer thickness and working instructions for the specific product take precedence.",
      "Die Menge ist eine Schätzung. Maßgeblich sind die Verbrauchsangaben, der zulässige Schichtdickenbereich und die Verarbeitungshinweise des jeweiligen Herstellers."
    ],
    "Számítási módszertan": ["Calculation methodology", "Berechnungsmethodik"],
    "Hibát találtál? Jelezd.": ["Found an issue? Let us know.", "Einen Fehler gefunden? Sag uns Bescheid."],
    "Aljzatkiegyenlítő kalkulátor | Kalkulátor Bázis": ["Floor Levelling Compound Calculator | Kalkulátor Bázis", "Bodenausgleich-Rechner | Kalkulátor Bázis"],
    "Ellenőrzés": ["Review", "Prüfen"],
    "Reggel": ["Morning", "Morgen"],
    "db": ["bags", "Säcke"],
    "Adj meg érvényes adatokat.": ["Enter valid values.", "Gib gültige Werte ein."]
  });
  const supported = Object.freeze(["hu", "en", "de"]);
  const pageKey = "aljzatkiegyenlito-kalkulator";
  function translate(page, value, language) {
    if (page !== pageKey || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const original = value.trim(), normalized = original.replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];
    const bags = /^(\d+(?:[.,]\d+)?)\s+db$/u.exec(normalized);
    if (bags) return `${bags[1]} ${language === "en" ? "bags" : "Säcke"}`;
    return null;
  }
  const dictionaries = Object.freeze({ [pageKey]: dictionary });
  return { pages: Object.freeze([pageKey]), dictionaries, dictionary, supported, translate };
});

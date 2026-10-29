/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, pageKey = "beton-kalkulator";
  const main = doc.querySelector("main.page-beton");
  if (!main) return;
  let language = "hu", rendering = false;
  const textState = new WeakMap(), attributeState = new WeakMap(), originals = new Map();
  function renderText(node) {
    const current = node.nodeValue, previous = textState.get(node);
    const source = previous && previous.rendered === current ? previous.source : current;
    const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
    if (!parts || !parts[2]) return;
    const translated = api.translate(pageKey, parts[2], language);
    const result = parts[1] + (translated ?? parts[2]) + parts[3];
    if (result !== current) node.nodeValue = result;
    if (translated !== null || previous) textState.set(node, { source, rendered: result });
  }
  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT), nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        renderText(node);
      }
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        if (element.closest("[contenteditable],[translate='no']")) return;
        let state = attributeState.get(element);
        if (!state) { state = new Map(); attributeState.set(element, state); }
        for (const name of ["aria-label","placeholder","title"]) {
          if (!element.hasAttribute(name)) continue;
          const current = element.getAttribute(name), previous = state.get(name);
          const source = previous && previous.rendered === current ? previous.source : current;
          const value = api.translate(pageKey, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      for (const selector of ["title",'meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]','meta[name="twitter:title"]','meta[name="twitter:description"]']) {
        const element = doc.querySelector(selector);
        if (!element) continue;
        const key = selector === "title" ? "title" : selector + ":" + (element.getAttribute("name") || element.getAttribute("property") || "");
        if (!originals.has(key)) originals.set(key, selector === "title" ? element.textContent : element.getAttribute("content"));
        const source = originals.get(key), value = api.translate(pageKey, source, language) ?? source;
        if (selector === "title") element.textContent = value; else element.setAttribute("content", value);
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
  const pageKey = "beton-kalkulator";
  const dictionary = Object.freeze({
    "Beton kalkulátor – köbméter (m³) és anyagszükséglet számítás":["Concrete Calculator – Cubic Metres (m³) and Material Estimate","Betonrechner – Kubikmeter (m³) und Materialbedarf"],
    "Beton kalkulátor m³-ben: add meg a méreteket, és számold ki a szükséges beton köbméterét alaphoz, födémhez vagy járdához, ráhagyással.":["Concrete calculator in m³: enter the dimensions to estimate how much concrete you need for a foundation, slab or path, including an allowance.","Betonrechner in m³: Gib die Maße ein, um die benötigte Betonmenge für Fundament, Decke oder Weg einschließlich Zuschlag zu berechnen."],
    "Beton kalkulátor":["Concrete Calculator","Betonrechner"],
    "Főoldal":["Home","Startseite"],
    "Otthon & felújítás":["Home & renovation","Bauen & Renovieren"],
    "Beton kalkulátor – köbméter és anyagszükséglet számítás":["Concrete Calculator – Volume and Material Estimate","Betonrechner – Volumen und Materialbedarf"],
    "Számold ki gyorsan, hány köbméter beton szükséges a megadott méretekhez.":["Quickly calculate how many cubic metres of concrete you need for the dimensions entered.","Berechne schnell, wie viele Kubikmeter Beton du für die eingegebenen Maße benötigst."],
    "Hossz (m)":["Length (m)","Länge (m)"],
    "Szélesség (m)":["Width (m)","Breite (m)"],
    "Vastagság (cm)":["Depth (cm)","Dicke (cm)"],
    "pl. 10":["e.g. 10","z. B. 10"],
    "pl. 5":["e.g. 5","z. B. 5"],
    "pl. 20":["e.g. 20","z. B. 20"],
    "Szükséges beton:":["Concrete required:","Benötigter Beton:"],
    "Hasznos volt ez a kalkulátor?":["Was this calculator useful?","War dieser Rechner hilfreich?"],
    "Ne keresd újra. Mentsd le. Használd.":["Don't search again. Save it. Use it.","Nicht erneut suchen. Speichern. Wiederverwenden."],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.":["Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.","Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehrst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    "Mentési, telepítési és megosztási műveletek":["Bookmark, install and sharing options","Optionen zum Speichern, Installieren und Teilen"],
    "Könyvjelzőzöm":["Bookmark","Lesezeichen"],
    "Telepítem":["Install","Installieren"],
    "Megosztom":["Share","Teilen"],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.":["Open your browser menu and look for Bookmark, Favorites or Save.","Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    "Másold ki ezt a hivatkozást, és küldd tovább.":["Copy this link and share it.","Kopiere diesen Link und teile ihn."],
    "Tipp:":["Tip:","Tipp:"],
    "Mindig számolj legalább 5–10% ráhagyással a beton rendelésnél.":["Always allow at least 5–10% extra when ordering concrete.","Plane bei einer Betonbestellung immer mindestens 5–10 % Zuschlag ein."],
    "Mennyi beton kell? Betonmennyiség számítása m³-ben":["How much concrete do you need? Calculating concrete volume in m³","Wie viel Beton wird benötigt? Betonmenge in m³ berechnen"],
    "A szükséges beton mennyiség kiszámításához három adat szükséges: hossz, szélesség és vastagság. A kalkulátor ez alapján automatikusan kiszámolja a szükséges térfogatot köbméterben (m³).":["To calculate the amount of concrete needed, enter three measurements: length, width and depth. The calculator uses them to work out the required volume in cubic metres (m³).","Für die Berechnung der benötigten Betonmenge brauchst du drei Angaben: Länge, Breite und Dicke. Daraus berechnet der Rechner das erforderliche Volumen in Kubikmetern (m³)."],
    "Köbméter számítás 1 m² felülethez":["Calculating cubic metres for a 1 m² area","Kubikmeter für eine Fläche von 1 m² berechnen"],
    "A beton köbméterének kiszámításához a felületet meg kell szorozni a méterben megadott vastagsággal. Egy 1 m²-es felületnél ezért 10 cm vastagság 0,10 m³, 15 cm vastagság 0,15 m³, 20 cm vastagság pedig 0,20 m³ betont jelent ráhagyás nélkül.":["To calculate concrete volume in cubic metres, multiply the surface area by the depth in metres. For an area of 1 m², a depth of 10 cm requires 0.10 m³, 15 cm requires 0.15 m³, and 20 cm requires 0.20 m³, before any allowance.","Für die Berechnung des Betonvolumens in Kubikmetern multiplizierst du die Fläche mit der in Metern angegebenen Dicke. Bei 1 m² Fläche entsprechen 10 cm Dicke 0,10 m³, 15 cm 0,15 m³ und 20 cm 0,20 m³ Beton, jeweils ohne Zuschlag."],
    "Gyors m² → m³ példák":["Quick m² → m³ examples","Schnelle Beispiele für m² → m³"],
    "1 m² × 10 cm:":["1 m² × 10 cm:","1 m² × 10 cm:"],
    "0,10 m³ beton":["0.10 m³ of concrete","0,10 m³ Beton"],
    "1 m² × 15 cm:":["1 m² × 15 cm:","1 m² × 15 cm:"],
    "0,15 m³ beton":["0.15 m³ of concrete","0,15 m³ Beton"],
    "1 m² × 20 cm:":["1 m² × 20 cm:","1 m² × 20 cm:"],
    "0,20 m³ beton":["0.20 m³ of concrete","0,20 m³ Beton"],
    "10 m² × 10 cm:":["10 m² × 10 cm:","10 m² × 10 cm:"],
    "1,00 m³ beton":["1.00 m³ of concrete","1,00 m³ Beton"],
    "Nagyobb felületnél ugyanaz a köbméter-számítás használható:":["For a larger area, use the same volume calculation:","Für größere Flächen gilt dieselbe Volumenberechnung:"],
    "m³ = felület (m²) × vastagság (m)":["m³ = area (m²) × depth (m)","m³ = Fläche (m²) × Dicke (m)"],
    "A rendelési mennyiségnél a geometriai eredményre külön ráhagyás lehet indokolt a zsaluzat, az aljzat egyenetlensége és a kivitelezési veszteség miatt.":["When ordering, consider adding an allowance to the geometric result for formwork, uneven ground and construction losses.","Bei der Bestellung kann ein Zuschlag auf das geometrische Ergebnis sinnvoll sein, etwa wegen der Schalung, unebenen Untergrunds und Verlusten bei der Ausführung."],
    "Köbméter számítás betonhoz – képlet és példa":["Concrete volume calculation – formula and example","Betonvolumen berechnen – Formel und Beispiel"],
    "m³ = hossz × szélesség × (vastagság / 100)":["m³ = length × width × (depth / 100)","m³ = Länge × Breite × (Dicke / 100)"],
    "Például egy 10 méter hosszú, 5 méter széles és 20 cm vastag beton alap esetén:":["For example, for a concrete foundation 10 metres long, 5 metres wide and 20 cm deep:","Beispiel: ein Betonfundament mit 10 Metern Länge, 5 Metern Breite und 20 cm Dicke:"],
    "10 × 5 × 0.2 = 10 m³ beton szükséges":["10 × 5 × 0.2 = 10 m³ of concrete required","10 × 5 × 0,2 = 10 m³ Beton erforderlich"],
    "Hol használható a beton kalkulátor?":["Where can you use the concrete calculator?","Wofür eignet sich der Betonrechner?"],
    "alapozás (ház alap, sávalap)":["foundations (house or strip foundations)","Fundamente (Haus- oder Streifenfundament)"],
    "beton járda vagy kocsibeálló":["concrete path or driveway","Betonweg oder Einfahrt"],
    "födém vagy aljzatbeton":["floor slab or concrete subfloor","Decke oder Estrichbeton"],
    "terasz vagy lépcső készítés":["building a patio or steps","Bau einer Terrasse oder Treppe"],
    "Miért fontos a pontos számítás?":["Why is an accurate calculation important?","Warum ist eine genaue Berechnung wichtig?"],
    "Ha túl kevés betont rendelsz, meg kell szakítani a munkát. Ha túl sokat, felesleges költséged keletkezik. Ezért érdemes előre pontosan kiszámolni a szükséges mennyiséget.":["If you order too little concrete, work may have to stop. Ordering too much creates unnecessary expense. That's why it pays to calculate the required amount in advance.","Wenn du zu wenig Beton bestellst, muss die Arbeit unterbrochen werden. Zu viel verursacht unnötige Kosten. Deshalb solltest du die benötigte Menge vorher möglichst genau berechnen."],
    "Ráhagyás beton rendelésnél":["Allowing extra when ordering concrete","Zuschlag bei der Betonbestellung"],
    "A gyakorlatban mindig ajánlott legalább 5–10% ráhagyással számolni, mivel veszteség, szivárgás vagy egyenetlen felület miatt több betonra lehet szükség.":["In practice, an allowance of at least 5–10% is usually recommended because losses, leakage or uneven surfaces can increase the amount needed.","In der Praxis empfiehlt sich meist ein Zuschlag von mindestens 5–10 %, da Verluste, Undichtigkeiten oder unebene Flächen mehr Beton erfordern können."],
    "Hogyan számoljuk ki?":["How is it calculated?","Wie wird es berechnet?"],
    "A beton térfogata: hossz × szélesség × vastagság.":["Concrete volume: length × width × depth.","Betonvolumen: Länge × Breite × Dicke."],
    "Képlet:":["Formula:","Formel:"],
    "Betonmennyiség számítása köbméterben":["Calculating concrete volume in cubic metres","Betonmenge in Kubikmetern berechnen"],
    "A beton kalkulátor segít megbecsülni, mennyi betonra lehet szükség alap, járda, terasz, kocsibeálló vagy kisebb szerkezeti elem készítéséhez. A beton rendelésénél a köbméter pontos becslése különösen fontos, mert a túl kevés és a túl sok beton is problémát okozhat.":["The concrete calculator helps estimate how much concrete may be needed for a foundation, path, patio, driveway or small structural element. An accurate volume estimate is especially important when ordering, as both too little and too much concrete can cause problems.","Der Betonrechner hilft dir einzuschätzen, wie viel Beton für ein Fundament, einen Weg, eine Terrasse, eine Einfahrt oder ein kleines Bauteil benötigt wird. Eine genaue Mengenschätzung ist bei der Bestellung wichtig, da sowohl zu wenig als auch zu viel Beton Probleme verursachen kann."],
    "A számítás egyszerű térfogatból indul, de a valóságban a talaj egyenetlensége, zsaluzat, tömörítés és kivitelezési veszteség miatt ráhagyásra is szükség lehet.":["The calculation starts with a simple volume, but uneven ground, formwork, compaction and construction losses may make an allowance necessary in practice.","Die Berechnung beginnt mit einem einfachen Volumen. In der Praxis kann wegen unebenen Bodens, Schalung, Verdichtung und Ausführungsverlusten ein Zuschlag nötig sein."],
    "Hogyan működik a számítás?":["How does the calculation work?","Wie funktioniert die Berechnung?"],
    "A képlet: hossz × szélesség × vastagság. Minden adatot méterben érdemes megadni, így az eredmény köbméter lesz. Ha több különálló részt betonozol, azokat külön is kiszámolhatod, majd összeadhatod.":["The formula is length × width × depth. Enter each measurement in metres to get the result in cubic metres. If you are concreting several separate areas, calculate each one and add the results together.","Die Formel lautet Länge × Breite × Dicke. Gib alle Maße in Metern ein, damit das Ergebnis in Kubikmetern ausgegeben wird. Mehrere getrennte Flächen kannst du einzeln berechnen und anschließend addieren."],
    "Konkrét példaszámítás":["Worked example","Konkretes Rechenbeispiel"],
    "Egy 4 méter hosszú, 3 méter széles és 12 cm vastag betonlemez térfogata 4 × 3 × 0,12 = 1,44 m³. Ha 10% ráhagyással számolsz, akkor körülbelül 1,58 m³ betonra lehet szükség.":["A concrete slab 4 metres long, 3 metres wide and 12 cm deep has a volume of 4 × 3 × 0.12 = 1.44 m³. With a 10% allowance, you may need about 1.58 m³ of concrete.","Eine Betonplatte mit 4 Metern Länge, 3 Metern Breite und 12 cm Dicke hat ein Volumen von 4 × 3 × 0,12 = 1,44 m³. Mit 10 % Zuschlag werden etwa 1,58 m³ Beton benötigt."],
    "Mikor hasznos ez a kalkulátor?":["When is this calculator useful?","Wann ist dieser Rechner hilfreich?"],
    "alap vagy lemez betonozása előtt":["before pouring a foundation or slab","vor dem Betonieren eines Fundaments oder einer Platte"],
    "járda és terasz tervezésekor":["when planning a path or patio","bei der Planung eines Weges oder einer Terrasse"],
    "betonrendelés előkészítésénél":["when preparing a concrete order","bei der Vorbereitung einer Betonbestellung"],
    "anyagköltség becsléséhez":["to estimate material costs","zur Schätzung der Materialkosten"],
    "Fontos tudni:":["Important:","Wichtig:"],
    "Szerkezeti betonozásnál a vastagság, vasalás, betonminőség és kivitelezés szakmai kérdés. A kalkulátor mennyiségi becslésre való, nem statikai tervezésre.":["For structural concrete work, depth, reinforcement, concrete grade and construction methods require professional judgment. This calculator estimates quantities; it is not for structural design.","Bei tragenden Betonarbeiten sind Dicke, Bewehrung, Betongüte und Ausführung fachlich zu beurteilen. Dieser Rechner schätzt Mengen und ersetzt keine statische Planung."],
    "Gyakori kérdések":["Frequently asked questions","Häufige Fragen"],
    "Centiméterben megadott vastagságot hogyan használjak?":["How do I use a depth entered in centimetres?","Wie verwende ich eine in Zentimetern angegebene Dicke?"],
    "Váltsd méterre: 12 cm például 0,12 m.":["Convert it to metres: for example, 12 cm is 0.12 m.","Rechne sie in Meter um: 12 cm entsprechen zum Beispiel 0,12 m."],
    "Kell ráhagyás?":["Should I allow extra?","Sollte ich einen Zuschlag einplanen?"],
    "Igen, kisebb egyenetlenségek és veszteség miatt gyakran érdemes ráhagyással számolni.":["Yes. An allowance is often sensible to account for small irregularities and losses.","Ja. Wegen kleiner Unebenheiten und möglicher Verluste ist ein Zuschlag oft sinnvoll."],
    "Készbeton rendeléshez elég?":["Is this enough to order ready-mix concrete?","Reicht das für eine Bestellung von Transportbeton?"],
    "Első becslésnek igen, de rendelés előtt egyeztess a kivitelezővel vagy betonüzemmel.":["It is suitable for an initial estimate, but check with your contractor or concrete supplier before ordering.","Für eine erste Schätzung ja, aber kläre die Menge vor der Bestellung mit dem Bauunternehmen oder Betonwerk ab."],
    "Több részt hogyan számoljak?":["How do I calculate several sections?","Wie berechne ich mehrere Teilflächen?"],
    "Számold ki külön a térfogatokat, majd add össze őket.":["Calculate each volume separately, then add them together.","Berechne die Volumen einzeln und addiere sie anschließend."],
    "Mitől térhet el a valós mennyiség?":["Why might the actual amount differ?","Warum kann die tatsächliche Menge abweichen?"],
    "A talaj, zsaluzat pontossága, tömörítés és kivitelezési eltérések miatt.":["Because of the ground, formwork accuracy, compaction and construction variations.","Wegen des Bodens, der Genauigkeit der Schalung, der Verdichtung und Abweichungen bei der Ausführung."],
    "Kapcsolódó kalkulátorok":["Related calculators","Verwandte Rechner"],
    "Tégla kalkulátor":["Brick Calculator","Ziegelrechner"],
    "Térkövezés kalkulátor":["Paving Calculator","Pflasterrechner"],
    "Vakolat kalkulátor":["Plaster Calculator","Putzrechner"],
    "Padlóburkolat kalkulátor":["Flooring Calculator","Bodenbelagsrechner"],
    "Hitelesség és számítási korlátok":["Reliability and calculation limits","Zuverlässigkeit und Grenzen der Berechnung"],
    "Az eredmény a megadott méretek és anyagjellemzők alapján készült becslés. Beszerzés előtt ellenőrizd a gyártói kiadósságot, a helyszíni adottságokat és a szükséges ráhagyást.":["The result is an estimate based on the dimensions and material properties entered. Before purchasing, check the manufacturer's stated yield, site conditions and required allowance.","Das Ergebnis ist eine Schätzung anhand der eingegebenen Maße und Materialeigenschaften. Prüfe vor dem Kauf die Herstellerangaben zur Ergiebigkeit, die Gegebenheiten vor Ort und den erforderlichen Zuschlag."],
    "A számítások módszertana és minőségbiztosítása":["Calculation methodology and quality assurance","Berechnungsmethodik und Qualitätssicherung"],
    "Hibát találtál? Jelezd nekünk.":["Found an issue? Let us know.","Einen Fehler gefunden? Sag uns Bescheid."],
    "Beton rendelési tervező":["Concrete Order Planner","Betonbestellplaner"],
    "A nettó köbméter és a rendelendő mennyiség nem ugyanaz":["Calculated volume and order quantity are not the same","Berechnetes Volumen und Bestellmenge sind nicht dasselbe"],
    "A geometriai térfogat csak a kiindulópont. Egyenetlen altalaj, zsaluhiba, szivárgás és kiszolgálási maradék miatt a rendelési mennyiséghez célszerű külön tartalékot kezelni.":["Geometric volume is only a starting point. Uneven subsoil, formwork issues, leakage and leftover concrete mean it is sensible to include a separate allowance in the order quantity.","Das geometrische Volumen ist nur ein Ausgangspunkt. Wegen unebenem Untergrund, Schalungsfehlern, Undichtigkeiten und Restmengen sollte die Bestellmenge einen zusätzlichen Puffer enthalten."],
    "Rendelési tartalék":["Ordering allowance","Bestellzuschlag"],
    "Egy mixer hasznos kapacitása (m³)":["Usable capacity of one mixer truck (m³)","Nutzbare Kapazität eines Fahrmischers (m³)"],
    "Geometriai térfogat":["Geometric volume","Geometrisches Volumen"],
    "Rendelendő mennyiség tartalékkal":["Order quantity including allowance","Bestellmenge einschließlich Zuschlag"],
    "Teljes mixerfordulók":["Full mixer truckloads","Volle Fahrmischer-Ladungen"],
    "Utolsó forduló becsült mennyisége":["Estimated amount in the final load","Geschätzte Menge der letzten Ladung"],
    "Szerkezeti beton esetén a betonminőség, vasalás, bedolgozás, tömörítés és utókezelés nem mennyiségi kalkulátor kérdése.":["For structural concrete, concrete grade, reinforcement, placement, compaction and curing cannot be determined by a quantity calculator.","Bei tragendem Beton lassen sich Betongüte, Bewehrung, Einbau, Verdichtung und Nachbehandlung nicht mit einem Mengenrechner festlegen."],
    "FRISS HÍREK":["LATEST NEWS","NEUESTE NACHRICHTEN"],
    "Friss gazdasági hírek":["Latest economic news","Aktuelle Wirtschaftsnachrichten"],
    "Szeptemberi infláció: 1,6%":["September inflation: 1.6%","Inflation im September: 1,6 %"],
    "Jegybanki alapkamat: 5,50%":["Central bank base rate: 5.50%","Leitzins der Zentralbank: 5,50 %"],
    "Összes friss hír →":["All latest news →","Alle aktuellen Nachrichten →"]
  });
  const supported = Object.freeze(["hu","en","de"]);
  function translate(page, value, language) {
    if (page !== pageKey || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];
    const volume = normalized.match(/^([\d\s.,]+)\s*m³(?:\s*\(([\d\s.,]+)\s*liter\))?$/u);
    if (volume) return volume[2]
      ? language === "en" ? `${volume[1].trim()} m³ (${volume[2].trim()} litres)` : `${volume[1].trim()} m³ (${volume[2].trim()} Liter)`
      : `${volume[1].trim()} m³`;
    return null;
  }
  const dictionaries = Object.freeze({ [pageKey]: dictionary });
  return { pages: Object.freeze([pageKey]), dictionaries, dictionary, supported, translate };
});

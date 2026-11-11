/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "padlo-burkolat-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="padlo-burkolat-kalkulator"]');
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
      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element);
        if (!state) { state = new Map(); attrState.set(element, state); }
        for (const name of ["aria-label", "placeholder", "title"]) if (element.hasAttribute(name)) {
          const current = element.getAttribute(name), old = state.get(name), source = old?.rendered === current ? old.source : current;
          const value = api.translate(page, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });
      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.get("errorHref") || errorLink.getAttribute("href");
        originals.set("errorHref", source);
        errorLink.setAttribute("href", api.reportHref(source, language));
      }
      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try { structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld")))); } catch { /* Keep the valid source schema. */ }
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
  const page = "padlo-burkolat-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Padlóburkolat kalkulátor | Csomagszám és ráhagyás", "Flooring Calculator | Packs and Cutting Allowance", "Bodenbelagsrechner | Pakete und Verschnitt"],
    ["Padlóburkolat kalkulátor helyiségméret, csomagonkénti fedés és ráhagyás alapján. Becsüld meg a megvásárolandó csomagok számát.", "Calculate flooring requirements from room dimensions, pack coverage and cutting allowance. Estimate how many full packs to buy.", "Berechne den Bodenbelagsbedarf anhand von Raummaßen, Paketinhalt und Verschnitt. Ermittle die Anzahl der zu kaufenden Pakete."],
    ["Padlóburkolat kalkulátor", "Flooring Calculator", "Bodenbelagsrechner"],
    ["Számold ki a szükséges laminált padló, parketta vagy burkolat mennyiségét.", "Calculate the amount of laminate, parquet or other flooring required.", "Berechne die benötigte Menge an Laminat, Parkett oder anderem Bodenbelag."],
    ["Otthon és felújítás kalkulátorok", "Home and renovation calculators", "Rechner für Haus und Renovierung"],
    ["Főoldal", "Home", "Startseite"], ["Otthon & felújítás", "Home & renovation", "Haus & Renovierung"],
    ["Részletes anyagtervező", "Detailed material planner", "Detaillierter Materialplaner"],
    ["Padlóburkolat- és csomagtervező", "Flooring and pack planner", "Bodenbelags- und Paketplaner"],
    ["A nettó alapterületből több ráhagyási forgatókönyvet és vásárolandó csomagszámot készít.", "Compares several cutting-allowance scenarios and calculates the number of packs to buy from the net floor area.", "Vergleicht mehrere Verschnittszenarien und berechnet aus der Nettofläche die Anzahl der zu kaufenden Pakete."],
    ["Helyiség hossza (m)", "Room length (m)", "Raumlänge (m)"], ["Helyiség szélessége (m)", "Room width (m)", "Raumbreite (m)"],
    ["Nem burkolandó fix felület (m²)", "Fixed area not to be covered (m²)", "Nicht zu belegende feste Fläche (m²)"], ["Egy csomag fedése (m²)", "Coverage per pack (m²)", "Deckfläche je Paket (m²)"],
    ["Vágási ráhagyás", "Cutting allowance", "Verschnittzuschlag"], ["5% – egyszerű, kevés vágás", "5% – simple layout, few cuts", "5 % – einfache Verlegung, wenige Zuschnitte"], ["8% – általános", "8% – standard", "8 % – Standard"], ["12% – sok vágás / mintázat", "12% – many cuts / pattern", "12 % – viele Zuschnitte / Muster"], ["15% – bonyolult felület", "15% – complex area", "15 % – komplexe Fläche"],
    ["Alátét csomagfedése (m², 0 = nincs)", "Underlay coverage per pack (m², 0 = none)", "Deckfläche der Unterlage je Paket (m², 0 = keine)"], ["Nem szegélyezett falszakasz (m)", "Wall length without skirting (m)", "Wandlänge ohne Sockelleiste (m)"], ["Egy szegélyléc hossza (m)", "Length of one skirting board (m)", "Länge einer Sockelleiste (m)"],
    ["Anyagigény kiszámítása", "Calculate materials", "Materialbedarf berechnen"], ["Alapértékek visszaállítása", "Reset defaults", "Standardwerte wiederherstellen"],
    ["Bruttó alapterület", "Gross floor area", "Bruttogrundfläche"], ["Nettó burkolandó felület", "Net area to cover", "Nettofläche für den Bodenbelag"], ["5 / 8 / 12%-os forgatókönyv", "5 / 8 / 12% scenarios", "Szenarien mit 5 / 8 / 12 %"], ["Vásárolandó burkolat", "Flooring to purchase", "Zu kaufender Bodenbelag"], ["Burkolatcsomag", "Flooring packs", "Bodenbelagspakete"], ["Alátétcsomag", "Underlay packs", "Unterlagenpakete"], ["Szegélyléc", "Skirting boards", "Sockelleisten"], ["nincs számolva", "not calculated", "nicht berechnet"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"], ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"], ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"], ["Telepítem", "Install", "Installieren"], ["Megosztom", "Share", "Teilen"], ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."], ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Padlóburkolat mennyiségének kiszámítása", "Calculating the amount of flooring", "Bodenbelagsmenge berechnen"],
    ["A kalkulátor laminált padló, parketta, vinyl vagy más csomagolt padlóburkolat előzetes mennyiségbecsléséhez készült. A helyiség hosszából és szélességéből kiszámolja az alapterületet, hozzáadja a megadott vágási ráhagyást, majd a csomag fedése alapján megadja a szükséges egész csomagok számát.", "This calculator provides a preliminary quantity estimate for laminate, parquet, vinyl and other packaged flooring. It calculates the floor area from the room length and width, adds the selected cutting allowance, and uses the pack coverage to determine the number of full packs required.", "Dieser Rechner liefert eine vorläufige Mengenschätzung für Laminat, Parkett, Vinyl und andere paketierte Bodenbeläge. Aus Raumlänge und -breite berechnet er die Grundfläche, addiert den gewählten Verschnitt und ermittelt anhand der Deckfläche je Paket die benötigte Anzahl ganzer Pakete."],
    ["Szabálytalan alakú helyiségnél oszd fel a területet téglalapokra, számold ki őket külön, majd add össze az eredményeket. A beugrókat, küszöböket és fixen beépített elemeket a tényleges burkolási terv szerint kezeld.", "For an irregular room, divide the area into rectangles, calculate each one separately and add the results. Treat recesses, thresholds and permanently fitted elements according to the actual installation plan.", "Teile einen unregelmäßig geformten Raum in Rechtecke, berechne diese einzeln und addiere die Ergebnisse. Berücksichtige Nischen, Schwellen und fest eingebaute Elemente entsprechend dem tatsächlichen Verlegeplan."],
    ["A számítás lépései", "Calculation steps", "Berechnungsschritte"], ["Az alapterület képlete", "The floor-area formula is", "Die Formel für die Grundfläche lautet"], ["hossz × szélesség", "length × width", "Länge × Breite"], [". A ráhagyással növelt mennyiség:", ". The quantity including allowance is:", ". Die Menge einschließlich Verschnitt lautet:"], ["alapterület × (1 + ráhagyás / 100)", "floor area × (1 + allowance / 100)", "Grundfläche × (1 + Verschnitt / 100)"], [". A csomagszám a növelt mennyiség és az egy csomag által lefedett terület hányadosa, mindig felfelé kerekítve.", ". Divide this quantity by the coverage per pack and always round up to obtain the number of packs.", ". Teile diese Menge durch die Deckfläche je Paket und runde stets auf, um die Paketanzahl zu erhalten."],
    ["Példa: 4,2 × 3,6 méteres szoba", "Example: a 4.2 × 3.6 metre room", "Beispiel: ein Raum mit 4,2 × 3,6 Metern"], ["Az alapterület 15,12 m². 8% ráhagyással 16,33 m²-re van szükség. Ha egy csomag 2,20 m² burkolatot tartalmaz, 16,33 / 2,20 = 7,42, vagyis 8 teljes csomagot kell vásárolni.", "The floor area is 15.12 m². With an 8% allowance, 16.33 m² is required. If one pack covers 2.20 m², 16.33 / 2.20 = 7.42, so 8 full packs must be purchased.", "Die Grundfläche beträgt 15,12 m². Mit 8 % Verschnitt werden 16,33 m² benötigt. Deckt ein Paket 2,20 m² ab, ergibt 16,33 / 2,20 = 7,42; es müssen also 8 ganze Pakete gekauft werden."],
    ["Mekkora ráhagyás indokolt?", "How much allowance should you include?", "Wie viel Verschnitt ist sinnvoll?"], ["Egyenes, párhuzamos fektetésnél gyakran 5–8% elegendő. Átlós, halszálkás vagy sok vágást igénylő mintánál 10–15% vagy még nagyobb tartalék is szükséges lehet. A gyártási széria és színárnyalat miatt célszerű ugyanabból a tételből beszerezni a pótlást.", "A 5–8% allowance is often sufficient for straight, parallel installation. Diagonal, herringbone or cut-intensive patterns may require 10–15% or more. Buy any reserve from the same production batch where possible to avoid differences in shade.", "Bei gerader, paralleler Verlegung reichen häufig 5–8 % Verschnitt. Diagonale Verlegung, Fischgrätmuster oder viele Zuschnitte können 10–15 % oder mehr erfordern. Kaufe die Reserve möglichst aus derselben Produktionscharge, um Farbabweichungen zu vermeiden."],
    ["A kalkulátor nem tartalmazza", "What the calculator does not include", "Was der Rechner nicht berücksichtigt"], ["az alátétfólia, párazárás és szegélyléc mennyiségét;", "the quantity of underlay, vapour barrier and skirting boards;", "die Menge an Unterlage, Dampfsperre und Sockelleisten;"], ["a dilatációs hézagok és küszöbprofilok tervezését;", "the design of expansion gaps and threshold profiles;", "die Planung von Dehnungsfugen und Übergangsprofilen;"], ["a hibás vagy sérült lapok számát;", "the number of defective or damaged boards;", "die Anzahl fehlerhafter oder beschädigter Elemente;"], ["a kivitelezési mintából eredő különleges veszteséget.", "special losses caused by the installation pattern.", "besondere Verluste durch das Verlegemuster."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"], ["A gardrób alatti részt is számoljam?", "Should I include the area under a wardrobe?", "Soll ich die Fläche unter einem Schrank einrechnen?"], ["Attól függ, a burkolat a bútor alatt is folytatódik-e. Beépített konyhabútornál a gyártói és kivitelezői előírás számít.", "It depends on whether the flooring will continue under the furniture. For fitted kitchen units, follow the flooring manufacturer's and installer's instructions.", "Das hängt davon ab, ob der Bodenbelag unter dem Möbel fortgeführt wird. Bei fest eingebauten Küchenmöbeln sind die Vorgaben des Bodenbelagsherstellers und des Verlegers maßgeblich."], ["Mi van, ha több helyiséget burkolok?", "What if I am flooring several rooms?", "Was ist bei mehreren Räumen zu beachten?"], ["Számold ki külön a helyiségeket, majd a ráhagyással együtt add össze. Azonos burkolatnál a bontott csomagok maradéka felhasználható lehet.", "Calculate each room separately and then add the quantities including allowance. When using the same flooring, material left from opened packs may be reusable.", "Berechne jeden Raum getrennt und addiere anschließend die Mengen einschließlich Verschnitt. Bei demselben Bodenbelag lassen sich Reste aus geöffneten Paketen möglicherweise weiterverwenden."], ["Miért nem a pontos négyzetmétert kell megvenni?", "Why do I need more than the exact floor area?", "Warum muss ich mehr als die genaue Quadratmeterzahl kaufen?"], ["A vágások, illesztések és a teljes csomagra kerekítés miatt a rendelési mennyiség nagyobb az alapterületnél.", "Cuts, joints and rounding up to full packs make the order quantity greater than the floor area.", "Durch Zuschnitte, Anschlüsse und das Aufrunden auf ganze Pakete ist die Bestellmenge größer als die Grundfläche."], ["Hol találom a csomag fedését?", "Where can I find the coverage per pack?", "Wo finde ich die Deckfläche je Paket?"], ["A termék dobozán vagy műszaki adatlapján általában m²/csomag formában szerepel.", "It is usually stated on the packaging or technical data sheet as m² per pack.", "Sie steht normalerweise auf der Verpackung oder im technischen Datenblatt in m² pro Paket."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"], ["Csempe kalkulátor", "Tile calculator", "Fliesenrechner"], ["Fuga kalkulátor", "Grout calculator", "Fugenmörtelrechner"], ["Festék kalkulátor", "Paint calculator", "Farbrechner"], ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"], ["2026. július 1.", "1 July 2026", "1. Juli 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"], ["Az eredmény a megadott méretek és anyagjellemzők alapján készült becslés. Beszerzés előtt ellenőrizd a gyártói kiadósságot, a helyszíni adottságokat és a szükséges ráhagyást.", "The result is an estimate based on the dimensions and material data entered. Before purchasing, check the manufacturer's coverage, site conditions and the allowance required.", "Das Ergebnis ist eine Schätzung auf Grundlage der eingegebenen Maße und Materialdaten. Prüfe vor dem Kauf die Herstellerangaben zur Deckfläche, die Gegebenheiten vor Ort und den erforderlichen Verschnitt."], ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"], ["Hibát találtál? Jelezd nekünk.", "Found an error? Let us know.", "Fehler gefunden? Sag uns Bescheid."],
    ["Csomagolási és javítótartalék-tervező", "Pack and repair-reserve planner", "Paket- und Reparaturreserveplaner"], ["A kivitelezés végén ne csak fél négyzetméter maradjon véletlenül", "Plan a useful reserve instead of being left with a random half square metre", "Plane eine sinnvolle Reserve statt eines zufälligen halben Quadratmeters"], ["Laminált padló, vinyl vagy parketta vásárlásánál egész csomagra kell kerekíteni. A maradék egy része későbbi javításnál hasznosabb lehet, mint visszaváltva.", "Laminate, vinyl and parquet must be purchased in full packs. Keeping some leftover material can be more useful for later repairs than returning it.", "Laminat, Vinyl und Parkett müssen in ganzen Paketen gekauft werden. Ein Teil des Restmaterials kann für spätere Reparaturen nützlicher sein als eine Rückgabe."], ["Burkolandó nettó felület (m²)", "Net area to cover (m²)", "Zu belegende Nettofläche (m²)"], ["Vágási ráhagyás (%)", "Cutting allowance (%)", "Verschnittzuschlag (%)"], ["Elméleti vásárlási felület", "Theoretical purchase area", "Theoretische Einkaufsfläche"], ["Szükséges csomag", "Packs required", "Benötigte Pakete"], ["Csomagkerekítés után marad", "Left after rounding to full packs", "Rest nach Aufrundung auf ganze Pakete"], ["Kiosztás:", "Layout:", "Verlegung:"], ["keskeny utolsó sor, ferde falak, ajtótokok és mintairány növelhetik a veszteséget. A csomagolási kerekítés ezért nem ugyanaz, mint a vágási ráhagyás.", "a narrow final row, angled walls, door frames and pattern direction can increase waste. Rounding to full packs is therefore not the same as the cutting allowance.", "Eine schmale letzte Reihe, schräge Wände, Türzargen und die Musterrichtung können den Verschnitt erhöhen. Das Aufrunden auf ganze Pakete ist daher nicht dasselbe wie der Verschnittzuschlag."],
    ["Hogyan lesz a nettó padlófelületből vásárolandó csomagszám?", "How is the number of packs derived from the net floor area?", "Wie wird aus der Nettofläche die Anzahl der zu kaufenden Pakete?"], ["A helyiség nettó burkolandó felületéhez a választott vágási ráhagyást adja, majd a csomagonkénti fedés alapján egész csomagra kerekít. Ez különösen fontos laminált, vinyl és más csomagolt burkolatoknál.", "The selected cutting allowance is added to the room's net area, then the result is rounded up to full packs using the coverage per pack. This is particularly important for laminate, vinyl and other packaged flooring.", "Zur Nettofläche des Raums wird der gewählte Verschnitt addiert; anschließend wird anhand der Deckfläche je Paket auf ganze Pakete aufgerundet. Das ist besonders bei Laminat, Vinyl und anderen paketierten Bodenbelägen wichtig."], ["egyszerű, kevés vágás", "simple layout, few cuts", "einfache Verlegung, wenige Zuschnitte"], ["általános kiindulás", "standard starting point", "üblicher Ausgangswert"], ["sok vágás vagy minta", "many cuts or a pattern", "viele Zuschnitte oder Muster"], ["összetett felület", "complex area", "komplexe Fläche"], ["Gyártói adatlap az elsődleges.", "The manufacturer's data sheet takes precedence.", "Das Herstellerdatenblatt ist maßgeblich."], ["Ellenőrzési alap:", "Check against:", "Prüfgrundlage:"], ["A csomagfedést, fektetési mintát, dilatációt és aljzati követelményeket a kiválasztott burkolat gyártói dokumentációjából ellenőrizd. Mintás vagy átlós fektetéshez nagyobb ráhagyás lehet indokolt.", "Check pack coverage, installation pattern, expansion requirements and subfloor specifications in the selected flooring manufacturer's documentation. Patterned or diagonal installation may require a larger allowance.", "Prüfe Paketinhalt, Verlegemuster, Dehnungsanforderungen und Untergrundvorgaben in der Dokumentation des gewählten Bodenbelags. Bei gemusterter oder diagonaler Verlegung kann ein größerer Verschnitt erforderlich sein."], ["Két példaszámítás", "Two worked examples", "Zwei Rechenbeispiele"], ["1. példa", "Example 1", "Beispiel 1"], ["5 × 4 m-es szobánál 20 m² az alapterület; egy 1,5 m²-es beépített dobogó levonható, ha tényleg nem kerül alá burkolat.", "A 5 × 4 m room has a floor area of 20 m²; a 1.5 m² fixed platform can be deducted if no flooring will actually be installed beneath it.", "Ein 5 × 4 m großer Raum hat 20 m² Grundfläche; ein fest eingebautes Podest von 1,5 m² kann abgezogen werden, wenn darunter tatsächlich kein Bodenbelag verlegt wird."], ["2. példa", "Example 2", "Beispiel 2"], ["Átlós fektetésnél vagy sok ajtónyílásnál a 12%-os forgatókönyv reálisabb lehet, mint az alap 5–8%.", "For diagonal installation or many door openings, the 12% scenario may be more realistic than the basic 5–8% allowance.", "Bei diagonaler Verlegung oder vielen Türöffnungen kann das 12-%-Szenario realistischer sein als der übliche Verschnitt von 5–8 %."], ["A kalkulátor korlátai", "Calculator limitations", "Grenzen des Rechners"], ["Nem optimalizálja automatikusan a szabási kiosztást helyiségenként.", "It does not automatically optimise the cutting layout for each room.", "Er optimiert den Zuschnitt nicht automatisch für jeden Raum."], ["Nem számolja az alátét, párazáró vagy ragasztó mennyiségét, ha az nincs külön modellezve.", "It does not calculate underlay, vapour barrier or adhesive unless these are modelled separately.", "Unterlage, Dampfsperre oder Klebstoff werden nicht berechnet, sofern sie nicht separat modelliert sind."], ["Több helyiség eltérő irányú fektetését célszerű külön számolni.", "Rooms with different installation directions should be calculated separately.", "Räume mit unterschiedlichen Verlegerichtungen sollten getrennt berechnet werden."], ["Módszertani ellenőrzés:", "Methodology reviewed:", "Methodisch geprüft:"], ["2026. szeptember 16.", "16 September 2026", "16. September 2026"],
    ["Hirdetés", "Advertisement", "Anzeige"],
    ["A nettó alapterületnek pozitívnak kell maradnia.", "The net floor area must remain positive.", "Die Nettogrundfläche muss positiv bleiben."], ["A nem szegélyezett falszakasz nem lehet hosszabb a helyiség teljes kerületénél.", "The wall length without skirting cannot exceed the room's total perimeter.", "Die Wandlänge ohne Sockelleiste darf den gesamten Raumumfang nicht überschreiten."],
    ["Kövesd az útmutatót a könyvjelző mentéséhez.", "Follow the instructions to save the bookmark.", "Folge der Anleitung, um das Lesezeichen zu speichern."], ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."], ["Megosztási felület megnyitva.", "Sharing options opened.", "Freigabeoptionen geöffnet."], ["A megosztást megszakítottad.", "Sharing was cancelled.", "Das Teilen wurde abgebrochen."], ["A linket a vágólapra másoltuk.", "The link was copied to the clipboard.", "Der Link wurde in die Zwischenablage kopiert."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const labels = {
    "Hossz": ["Length", "Länge"], "Szélesség": ["Width", "Breite"], "Kivonható felület": ["Excluded area", "Abzuziehende Fläche"], "Ráhagyás": ["Allowance", "Verschnitt"], "Csomagfedés": ["Pack coverage", "Paketdeckfläche"], "Alátét csomagfedés": ["Underlay pack coverage", "Deckfläche des Unterlagenpakets"], "Nem szegélyezett falszakasz": ["Wall length without skirting", "Wandlänge ohne Sockelleiste"], "Szegélyléc hossza": ["Skirting-board length", "Sockelleistenlänge"]
  };
  function number(raw, language) {
    const value = Number(raw.replace(/\s/gu, "").replace(",", "."));
    return Number.isFinite(value) ? new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { maximumFractionDigits: 2 }).format(value) : raw;
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)];
    if (pair) return pair[language === "en" ? 0 : 1];
    const index = language === "en" ? 0 : 1;
    let match = /^(\d[\d\s]*(?:,[0-9]+)?) m²$/u.exec(normalized);
    if (match) return `${number(match[1], language)} m²`;
    match = /^(\d[\d\s]*(?:,[0-9]+)?) db$/u.exec(normalized);
    if (match) return `${number(match[1], language)} ${language === "en" ? "pcs" : "Stk."}`;
    match = /^(\d[\d\s]*(?:,[0-9]+)?) csomag$/u.exec(normalized);
    if (match) return `${number(match[1], language)} ${language === "en" ? "packs" : "Pakete"}`;
    match = /^(\d[\d\s]*(?:,[0-9]+)?) m \/ (\d+) db$/u.exec(normalized);
    if (match) return `${number(match[1], language)} m / ${match[2]} ${language === "en" ? "pcs" : "Stk."}`;
    match = /^(\d[\d\s]*(?:,[0-9]+)?) \/ (\d[\d\s]*(?:,[0-9]+)?) \/ (\d[\d\s]*(?:,[0-9]+)?) m²$/u.exec(normalized);
    if (match) return `${number(match[1], language)} / ${number(match[2], language)} / ${number(match[3], language)} m²`;
    match = /^(.+?): adj meg (nullánál nagyobb|nulla vagy pozitív) értéket\.$/u.exec(normalized);
    if (match && labels[match[1]]) {
      const requirement = match[2] === "nullánál nagyobb" ? ["a value greater than zero", "einen Wert größer als null"] : ["zero or a positive value", "null oder einen positiven Wert"];
      return language === "en" ? `${labels[match[1]][index]}: enter ${requirement[index]}.` : `${labels[match[1]][index]}: Gib ${requirement[index]} ein.`;
    }
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    url.searchParams.set("subject", language === "en" ? "Error report – Flooring Calculator" : "Fehlermeldung – Bodenbelagsrechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Flooring Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/padlo-burkolat-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Bodenbelagsrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/padlo-burkolat-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

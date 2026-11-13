/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "terkovezes-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="terkovezes-kalkulator"]');
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
  const page = "terkovezes-kalkulator";
  const entries = [
    ["Hirdetés", "Advertisement", "Anzeige"],
    ["Az eredmény a számítás után jelenik meg.", "The result will appear after calculation.", "Das Ergebnis erscheint nach der Berechnung."],
    ["Részletes anyagtervező", "Detailed material planner", "Detaillierter Materialplaner"],
    ["Vágási ráhagyás", "Cutting allowance", "Verschnittzuschlag"],
    ["5% – egyszerű, kevés vágás", "5% – simple layout, few cuts", "5 % – einfache Verlegung, wenige Schnitte"],
    ["8% – általános", "8% – typical", "8 % – üblich"],
    ["12% – sok vágás / mintázat", "12% – many cuts / pattern", "12 % – viele Schnitte / Muster"],
    ["15% – bonyolult felület", "15% – complex area", "15 % – komplexe Fläche"],
    ["Anyagigény kiszámítása", "Calculate material requirement", "Materialbedarf berechnen"],
    ["Alapértékek visszaállítása", "Reset defaults", "Standardwerte wiederherstellen"],
    ["Nettó burkolandó felület", "Net area to be paved", "Zu pflasternde Nettofläche"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who might find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehrst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"],
    ["Telepítem", "Install", "Installieren"],
    ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Gyakori hibák", "Common mistakes", "Häufige Fehler"],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["Beton kalkulátor", "Concrete Calculator", "Betonrechner"],
    ["Csempe kalkulátor", "Tile Calculator", "Fliesenrechner"],
    ["Padlóburkolat kalkulátor", "Flooring Calculator", "Bodenbelag-Rechner"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Zuletzt inhaltlich aktualisiert:"],
    ["2026. augusztus 8.", "8 August 2026", "8. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limits", "Verlässlichkeit und Grenzen der Berechnung"],
    ["Az eredmény a megadott méretek és anyagjellemzők alapján készült becslés. Beszerzés előtt ellenőrizd a gyártói kiadósságot, a helyszíni adottságokat és a szükséges ráhagyást.", "The result is an estimate based on the dimensions and material details entered. Before buying, check the manufacturer's coverage, site conditions and the allowance you need.", "Das Ergebnis ist eine Schätzung anhand der eingegebenen Maße und Materialangaben. Prüfe vor dem Kauf die Herstellerangaben zur Reichweite, die Bedingungen vor Ort und den benötigten Zuschlag."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.", "Found an error? Let us know.", "Einen Fehler gefunden? Gib uns Bescheid."],
    ["egyszerű, kevés vágás", "simple, few cuts", "einfach, wenige Schnitte"],
    ["általános kiindulás", "typical starting point", "üblicher Ausgangswert"],
    ["sok vágás vagy minta", "many cuts or a pattern", "viele Schnitte oder Muster"],
    ["összetett felület", "complex area", "komplexe Fläche"],
    ["Gyártói adatlap az elsődleges.", "The manufacturer's data sheet takes priority.", "Das Herstellerdatenblatt ist maßgeblich."],
    ["Ellenőrzési alap:", "Basis for verification:", "Prüfgrundlage:"],
    ["Két példaszámítás", "Two worked examples", "Zwei Rechenbeispiele"],
    ["1. példa", "Example 1", "Beispiel 1"],
    ["2. példa", "Example 2", "Beispiel 2"],
    ["A kalkulátor korlátai", "Calculator limitations", "Grenzen des Rechners"],
    ["Módszertani ellenőrzés:", "Methodology reviewed:", "Methodik geprüft:"],
    ["2026. szeptember 16.", "16 September 2026", "16. September 2026"],
    ["hu-HU", "en-US", "de-DE"],
    ["Számold ki térkő, szegélykő és ráhagyás becsült mennyiségét.", "Estimate how many paving stones and edging stones you need, including an allowance.", "Schätze den Bedarf an Pflaster- und Randsteinen einschließlich Zuschlag."],
    ["Otthon és felújítás kalkulátorok", "Home & renovation calculators", "Rechner für Bauen & Renovieren"],
    ["Főoldal", "Home", "Startseite"],
    ["Otthon & felújítás", "Home & renovation", "Bauen & Renovieren"],
    ["Hozzáadás a Főképernyőhöz", "Add to Home Screen", "Zum Startbildschirm hinzufügen"],
    ["Nyisd meg a Safari Megosztás menüjét, válaszd a Hozzáadás a Főképernyőhöz lehetőséget, majd koppints a Hozzáadás gombra.", "Open Safari’s Share menu, choose Add to Home Screen, then tap Add.", "Öffne das Teilen-Menü von Safari, wähle Zum Startbildschirm hinzufügen und tippe anschließend auf Hinzufügen."],
    ["A Főképernyőhöz adás iPhone-on és iPaden Safariból végezhető el a legegyértelműbben. Nyisd meg ott az oldalt, majd használd a Megosztás menüt.", "On iPhone and iPad, the clearest way to add this page to your Home Screen is through Safari. Open the page in Safari and use the Share menu.", "Auf iPhone und iPad lässt sich die Seite am einfachsten über Safari zum Startbildschirm hinzufügen. Öffne die Seite in Safari und verwende das Teilen-Menü."],
    ["A natív megosztás nem sikerült, megpróbáljuk a linket másolni.", "Native sharing failed, so we’ll try copying the link instead.", "Das Teilen über die Systemfunktion ist fehlgeschlagen. Wir versuchen stattdessen, den Link zu kopieren."],
    ["A telepítési művelet nem sikerült.", "The installation action failed.", "Die Installation konnte nicht ausgeführt werden."],
    ["Ezt a kalkulátort a Kalkulátor Bázison találtam.", "I found this calculator on Kalkulátor Bázis.", "Ich habe diesen Rechner auf Kalkulátor Bázis gefunden."],
    ["A megtartó CTA komponens nem tölthető be.", "The save-and-share panel could not be loaded.", "Das Speichern-und-Teilen-Element konnte nicht geladen werden."],
    ["Kövesd az útmutatót a könyvjelző mentéséhez.", "Follow the instructions to save this page as a bookmark.", "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern."],
    ["Nyisd meg a Megosztás menüt, majd válaszd a Hozzáadás a Kedvencekhez lehetőséget.", "Open the Share menu, then choose Add to Favourites.", "Öffne das Teilen-Menü und wähle Zu Favoriten hinzufügen."],
    ["Nyomd meg a ⌘ + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.", "Press ⌘ + D, then save the page to your bookmarks.", "Drücke ⌘ + D und speichere die Seite als Lesezeichen."],
    ["Nyisd meg a böngésző menüjét, majd válaszd a Könyvjelző hozzáadása vagy a csillag ikont.", "Open your browser menu and choose Add bookmark or the star icon.", "Öffne das Browsermenü und wähle Lesezeichen hinzufügen oder das Sternsymbol."],
    ["Nyomd meg a Ctrl + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.", "Press Ctrl + D, then save the page to your bookmarks.", "Drücke Ctrl + D und speichere die Seite als Lesezeichen."],
    ["Kövesd az útmutatót a főképernyős hozzáadáshoz.", "Follow the instructions to add the page to your home screen.", "Folge der Anleitung, um die Seite zum Startbildschirm hinzuzufügen."],
    ["Telepítési lehetőség megnyitása...", "Opening installation options...", "Installationsoptionen werden geöffnet..."],
    ["A telepítés elindult.", "Installation has started.", "Die Installation wurde gestartet."],
    ["A telepítést most nem indítottad el.", "You chose not to start the installation.", "Du hast die Installation nicht gestartet."],
    ["A telepítési lehetőség jelenleg nem érhető el.", "The installation option is currently unavailable.", "Die Installationsoption ist derzeit nicht verfügbar."],
    ["Megosztási felület megnyitva.", "Share options opened.", "Freigabeoptionen geöffnet."],
    ["A megosztást megszakítottad.", "You cancelled sharing.", "Du hast das Teilen abgebrochen."],
    ["A linket a vágólapra másoltuk.", "The link has been copied to the clipboard.", "Der Link wurde in die Zwischenablage kopiert."],
    ["Térkövezés kalkulátor", "Paving Calculator", "Pflaster-Rechner"],
    ["Térkövezés kalkulátor | Térkő és szegély mennyisége", "Paving Calculator | Paving and Edging Quantities", "Pflaster-Rechner | Pflaster- und Randsteinbedarf"],
    ["Térkövezés kalkulátor felület, térkőigény és ráhagyás alapján. Becsüld meg a darabszámot, szegélyhosszt és ismerd meg az alapréteg, lejtés és vágási veszteség fő szempontjait.", "Estimate paving requirements, pack quantities and edging length, including an allowance. Learn about base layers, gradients and cutting losses.", "Schätze Pflasterbedarf, Paketanzahl und Randlänge einschließlich Zuschlag. Erfahre mehr über Tragschichten, Gefälle und Verschnitt."],
    ["Számold ki térkő, szegély és ráhagyás becsült mennyiségét.", "Estimate paving and edging quantities, including an allowance.", "Schätze den Pflaster- und Randsteinbedarf einschließlich Zuschlag."],
    ["Térkő-, ágyazóanyag- és szegélytervező", "Paving, bedding material and edging planner", "Planer für Pflaster, Bettungsmaterial und Randsteine"],
    ["A térkő csomagolásán túl ágyazóréteget és szegélyhosszt is becsül.", "Estimate bedding material and edging length as well as paving packs.", "Schätzt neben Pflasterpaketen auch Bettungsmaterial und Randlänge."],
    ["Burkolandó terület hossza (m)", "Length of area to be paved (m)", "Länge der zu pflasternden Fläche (m)"],
    ["Burkolandó terület szélessége (m)", "Width of area to be paved (m)", "Breite der zu pflasternden Fläche (m)"],
    ["Kivonható terület (m²)", "Excluded area (m²)", "Abzuziehende Fläche (m²)"],
    ["Raklap/csomag fedése (m²)", "Coverage per pallet/pack (m²)", "Deckfläche je Palette/Paket (m²)"],
    ["Ágyazóréteg vastagsága tömörítve (cm)", "Compacted bedding layer depth (cm)", "Dicke der verdichteten Bettungsschicht (cm)"],
    ["Ágyazóanyag tömörödési tartalék (%)", "Bedding material compaction allowance (%)", "Verdichtungszuschlag für Bettungsmaterial (%)"],
    ["Nem szegélyezett oldalhossz (m)", "Edge length without edging (m)", "Länge ohne Randeinfassung (m)"],
    ["Egy szegélykő hossza (m)", "Length of one edging stone (m)", "Länge eines Randsteins (m)"],
    ["Térkőigény ráhagyással", "Paving required with allowance", "Pflasterbedarf mit Zuschlag"],
    ["Raklap/csomag", "Pallets/packs", "Paletten/Pakete"],
    ["Ágyazóanyag térfogata", "Bedding material volume", "Volumen des Bettungsmaterials"],
    ["Szegélyhossz", "Edging length", "Randlänge"],
    ["Szegélykő", "Edging stones", "Randsteine"],
    ["Térkő-, ágyazóanyag- és szegélyigény becslése", "Estimating paving, bedding material and edging requirements", "Pflaster-, Bettungsmaterial- und Randsteinbedarf schätzen"],
    ["A kalkulátor a hossz és szélesség szorzatából levonja a kivonható területet. A nettó felülethez hozzáadja a vágási ráhagyást, majd a megadott raklap- vagy csomagfedés alapján egész csomagra kerekít. Külön becsüli az ágyazóanyag térfogatát, a szegélyhosszt és a szegélykövek számát.", "The calculator subtracts the excluded area from length multiplied by width. It adds the cutting allowance to the net area, then rounds up to whole packs using the coverage per pallet or pack. Bedding material volume, edging length and the number of edging stones are estimated separately.", "Der Rechner zieht die auszusparende Fläche vom Produkt aus Länge und Breite ab. Zur Nettofläche kommt der Verschnittzuschlag; anhand der Deckfläche je Palette oder Paket wird anschließend auf ganze Pakete aufgerundet. Bettungsmaterialvolumen, Randlänge und Randsteinanzahl werden gesondert geschätzt."],
    ["A számítás", "The calculation", "Die Berechnung"],
    ["Nettó felület:", "Net area:", "Nettofläche:"],
    ["hossz × szélesség − kivonható terület", "length × width − excluded area", "Länge × Breite − abzuziehende Fläche"],
    [". Térkőigény:", ". Paving required:", ". Pflasterbedarf:"],
    ["nettó felület × (1 + ráhagyás / 100)", "net area × (1 + allowance / 100)", "Nettofläche × (1 + Zuschlag / 100)"],
    [". A csomagszám a térkőigény és a csomagfedés hányadosa, felfelé kerekítve. Az ágyazóanyaghoz a nettó felületet a méterben megadott vastagsággal és a tömörödési tartalékkal szorozzuk. Szegélyhossz:", ". Divide the paving required by the coverage per pack and round up to get the pack count. For bedding material, multiply the net area by the depth in metres and apply the compaction allowance. Edging length:", ". Die Paketanzahl ergibt sich aus dem Pflasterbedarf geteilt durch die Paketdeckfläche, aufgerundet. Für das Bettungsmaterial wird die Nettofläche mit der Dicke in Metern multipliziert und der Verdichtungszuschlag berücksichtigt. Randlänge:"],
    ["2 × (hossz + szélesség) − nem szegélyezett oldalhossz", "2 × (length + width) − edge length without edging", "2 × (Länge + Breite) − Länge ohne Randeinfassung"],
    ["; a szegélykövek száma a szegélyhossz és az egy kőre megadott hossz hányadosa, felfelé kerekítve.", "; divide the edging length by the length of one stone and round up to obtain the number of edging stones.", "; die Randsteinanzahl ergibt sich aus der Randlänge geteilt durch die Länge eines Steins, aufgerundet."],
    ["Példa egy 6 × 4 méteres beállóra", "Example for a 6 × 4 metre driveway", "Beispiel für eine 6 × 4 Meter große Einfahrt"],
    ["Kivonható terület nélkül a nettó felület 24 m². 5% ráhagyással 25,2 m² térkő szükséges; 10 m²-es csomagfedéssel ez 3 csomag. 4 cm-es ágyazóréteggel és 15% tömörödési tartalékkal a becsült ágyazóanyag 1,1 m³. Nyitott oldal nélkül a szegélyhossz 20 m, ami 1 m-es szegélykőből 20 darab.", "With no excluded area, the net area is 24 m². A 5% allowance gives 25.2 m² of paving, or 3 packs with 10 m² coverage each. A 4 cm bedding layer with a 15% compaction allowance requires an estimated 1.1 m³ of bedding material. With edging on all sides, the length is 20 m, requiring 20 edging stones of 1 m each.", "Ohne Flächenabzug beträgt die Nettofläche 24 m². Mit 5 % Zuschlag werden 25,2 m² Pflaster benötigt, also 3 Pakete mit je 10 m² Deckfläche. Bei 4 cm Bettungsdicke und 15 % Verdichtungszuschlag werden schätzungsweise 1,1 m³ Bettungsmaterial benötigt. Bei umlaufender Einfassung beträgt die Randlänge 20 m, also 20 Randsteine mit je 1 m Länge."],
    ["Az anyagbecslés nem helyettesíti a teljes rétegrend tervezését", "A material estimate does not replace planning the full pavement structure", "Eine Materialschätzung ersetzt keine Planung des gesamten Schichtaufbaus"],
    ["A tartós térburkolat teljes rétegrendje ennél jóval több. A teherbíró alap, tömörített zúzottkő, ágyazóanyag, esetleges geotextília, szegély, fugázóhomok és megfelelő vízelvezetés mind külön tervezést igényel. Személyautós behajtó és gyalogos járda alaprétege nem feltétlenül azonos.", "A durable paved surface requires much more than the top layer. The load-bearing base, compacted crushed stone, bedding material, any geotextile, edging, jointing sand and drainage all need separate planning. A driveway for cars and a footpath do not necessarily require the same base layer.", "Eine dauerhafte Pflasterfläche besteht aus weit mehr als der Deckschicht. Tragfähiger Unterbau, verdichteter Schotter, Bettungsmaterial, gegebenenfalls Geotextil, Randeinfassung, Fugensand und Entwässerung müssen gesondert geplant werden. Eine Pkw-Einfahrt und ein Gehweg benötigen nicht unbedingt dieselbe Tragschicht."],
    ["Lejtés és vízelvezetés", "Gradient and drainage", "Gefälle und Entwässerung"],
    ["A burkolatot úgy kell kialakítani, hogy a víz ne álljon meg a felületen és ne a fal vagy alap felé vezessen. A kalkulátor geometriai anyagmennyiséget számol, a szükséges lejtést, folyókát vagy vízelvezető rendszert nem méretezi.", "Design the paving so that water does not pool on the surface or flow towards walls or foundations. The calculator estimates material quantities from geometry; it does not size the required gradient, drainage channel or drainage system.", "Die Pflasterfläche muss so gestaltet werden, dass sich kein Wasser staut und es nicht zu Wänden oder Fundamenten abfließt. Der Rechner ermittelt geometrische Materialmengen; er bemisst weder das erforderliche Gefälle noch Entwässerungsrinnen oder Entwässerungssysteme."],
    ["Mikor kell nagyobb ráhagyás?", "When is a larger allowance needed?", "Wann ist ein größerer Zuschlag nötig?"],
    ["Egyenes soros fektetésnél és egyszerű téglalapnál kisebb, íves széleknél, átlós vagy összetett mintánál, sok aknafedélnél és szabálytalan határvonalnál nagyobb vágási veszteség várható.", "Straight rows and simple rectangular areas usually mean less cutting loss. Curved edges, diagonal or complex patterns, numerous access covers and irregular boundaries can increase it.", "Gerade Reihen und einfache Rechtecke verursachen meist weniger Verschnitt. Geschwungene Ränder, diagonale oder komplexe Muster, viele Schachtdeckel und unregelmäßige Begrenzungen können den Verschnitt erhöhen."],
    ["Raklap, m² vagy darab?", "Pallets, square metres or individual stones?", "Paletten, Quadratmeter oder einzelne Steine?"],
    ["A kalkulátor a térkőigényt m²-ben és egész raklapban vagy csomagban adja meg. A csomagfedéshez az adott termék egy rendelési egységre vonatkozó m²-adatát használd. A térkövek egyedi darabszámát nem számolja; a szegélykövek számát viszont a megadott kőhosszból becsüli.", "The calculator gives paving requirements in m² and whole pallets or packs. Enter the coverage in m² for one ordering unit of the specific product. It does not count individual paving stones; it estimates the number of edging stones from the stone length entered.", "Der Rechner gibt den Pflasterbedarf in m² und ganzen Paletten oder Paketen an. Verwende die Deckfläche in m² für eine Bestelleinheit des konkreten Produkts. Einzelne Pflastersteine werden nicht gezählt; die Randsteinanzahl wird dagegen aus der eingegebenen Steinlänge geschätzt."],
    ["A csomagfedéshez nem a választott termék egy rendelési egységre vonatkozó m²-adatát adják meg.", "Entering a pack coverage figure that does not match one ordering unit of the chosen product.", "Als Paketdeckfläche wird nicht die m²-Angabe für eine Bestelleinheit des gewählten Produkts eingegeben."],
    ["A szabálytalan részeket nem bontják külön alakzatokra.", "Failing to split irregular areas into separate shapes.", "Unregelmäßige Flächen werden nicht in einzelne Formen aufgeteilt."],
    ["A szegélyből nem vonják le a nyitott kapubejárót.", "Failing to deduct an open driveway entrance from the edging.", "Eine offene Einfahrt wird nicht von der Randlänge abgezogen."],
    ["Nem számolnak a mintázat miatti vágási veszteséggel.", "Ignoring cutting losses caused by the laying pattern.", "Musterbedingter Verschnitt wird nicht berücksichtigt."],
    ["A kalkulátor eredményéből próbálják az alapréteg vastagságát meghatározni.", "Trying to determine the base layer depth from the calculator’s output.", "Die Dicke der Tragschicht wird aus dem Rechenergebnis abgeleitet."],
    ["Hol találom a raklap vagy csomag fedését?", "Where can I find the coverage per pallet or pack?", "Wo finde ich die Deckfläche je Palette oder Paket?"],
    ["A gyártó termékadatlapján vagy a kereskedő leírásában.", "On the manufacturer’s product data sheet or in the retailer’s description.", "Im Produktdatenblatt des Herstellers oder in der Beschreibung des Händlers."],
    ["A szegélykő darabszámát is megkapom?", "Does it also give the number of edging stones?", "Wird auch die Anzahl der Randsteine berechnet?"],
    ["Igen. A kalkulátor a nem szegélyezett oldalhosszt levonja a kerületből, majd az eredményt a megadott szegélykőhosszal elosztva felfelé kerekít.", "Yes. The calculator deducts the edge length without edging from the perimeter, divides by the edging stone length entered and rounds up.", "Ja. Der Rechner zieht die Länge ohne Randeinfassung vom Umfang ab, teilt das Ergebnis durch die eingegebene Randsteinlänge und rundet auf."],
    ["Az alapozó zúzottkő benne van?", "Is crushed stone for the base included?", "Ist Schotter für die Tragschicht enthalten?"],
    ["Nem. Az alapréteg a terheléstől, talajtól és szerkezeti kialakítástól függ.", "No. The base layer depends on the load, ground conditions and structural design.", "Nein. Die Tragschicht hängt von Belastung, Boden und konstruktivem Aufbau ab."],
    ["Szabálytalan területet hogyan számoljak?", "How should I calculate an irregular area?", "Wie berechne ich eine unregelmäßige Fläche?"],
    ["Bontsd egyszerűbb téglalapokra, háromszögekre vagy más mérhető részekre, majd add össze őket.", "Split it into simpler rectangles, triangles or other measurable sections, then add their areas together.", "Teile sie in einfache Rechtecke, Dreiecke oder andere messbare Teilflächen auf und addiere deren Flächen."],
    ["Miért kell tartalék térkő?", "Why keep spare paving stones?", "Warum sollte ich Pflastersteine als Reserve einplanen?"],
    ["Vágás, törés, színválogatás és későbbi javítás miatt.", "For cutting, breakage, colour selection and future repairs.", "Wegen Zuschnitt, Bruch, Farbauswahl und späterer Reparaturen."],
    ["A térkő mennyisége jó lehet, miközben a pálya még rosszul van megtervezve", "The paving quantity can be right even when the surface is poorly designed", "Die Pflastermenge kann stimmen, obwohl die Fläche falsch geplant ist"],
    ["A felület vízelvezetése külön tervezési kérdés. Ez a mini segédlet megmutatja, mekkora szintkülönbséget jelent egy választott százalékos lejtés a megadott hosszon.", "Surface drainage needs separate planning. This helper shows the height difference produced by a selected percentage gradient over the length entered.", "Die Entwässerung der Fläche muss gesondert geplant werden. Diese Hilfe zeigt den Höhenunterschied, der sich bei einem gewählten prozentualen Gefälle über die eingegebene Länge ergibt."],
    ["Lejtés hossza (m)", "Slope length (m)", "Gefällestrecke (m)"],
    ["Tervezett lejtés (%)", "Planned gradient (%)", "Geplantes Gefälle (%)"],
    ["Szükséges szintkülönbség", "Required height difference", "Erforderlicher Höhenunterschied"],
    ["Értelmezés", "Interpretation", "Einordnung"],
    ["A megfelelő lejtés helyszín- és rétegrendfüggő. A kalkulátor csak geometriai átváltást végez; vízelvezetési tervet nem készít.", "The appropriate gradient depends on the site and pavement structure. The calculator only performs a geometric conversion; it does not produce a drainage design.", "Das geeignete Gefälle hängt vom Standort und Schichtaufbau ab. Der Rechner führt nur eine geometrische Umrechnung durch und erstellt keinen Entwässerungsplan."],
    ["Miből áll össze a térkövezés anyagbecslése?", "What is included in the paving material estimate?", "Was umfasst die Materialschätzung für Pflasterarbeiten?"],
    ["A burkolandó nettó felülethez külön ráhagyást ad, majd a választott térkő csomag- vagy raklapfedése alapján kerekít vásárlási mennyiségre. A felület és a tényleges csomagszám ezért külön eredményként jelenik meg.", "An allowance is added to the net area to be paved, then the purchase quantity is rounded up using the coverage per pack or pallet of the chosen paving product. The area and actual number of packs are therefore shown separately.", "Zur zu pflasternden Nettofläche wird ein Zuschlag addiert. Anschließend wird anhand der Deckfläche je Paket oder Palette des gewählten Pflasters auf die Kaufmenge aufgerundet. Fläche und tatsächliche Paketanzahl werden daher getrennt angezeigt."],
    ["A térkő fedési adatát, rétegrendet, ágyazatot és fugázóanyag-javaslatot a kiválasztott rendszer gyártói/kivitelezési dokumentációjából ellenőrizd.", "Check the paving coverage, pavement structure, bedding and jointing material recommendations in the manufacturer’s or installer’s documentation for the chosen system.", "Prüfe Deckfläche, Schichtaufbau, Bettung und empfohlenes Fugenmaterial anhand der Hersteller- oder Einbaudokumentation des gewählten Systems."],
    ["8 × 4 m-es téglalapnál 32 m² a bruttó felület; egy 2 m²-es akna vagy növényágyás levonható.", "An 8 × 4 m rectangle has a gross area of 32 m²; a 2 m² access opening or planting bed can be deducted.", "Ein 8 × 4 m großes Rechteck hat eine Bruttofläche von 32 m²; eine 2 m² große Schachtöffnung oder ein Pflanzbeet kann abgezogen werden."],
    ["Ha a kapubejárat egyik oldala nem kap szegélyt, annak hosszát a nem szegélyezett oldalhossznál lehet levonni.", "If one side of the driveway entrance has no edging, deduct its length using the edge length without edging field.", "Erhält eine Seite der Einfahrt keine Randeinfassung, kann ihre Länge im Feld für die Länge ohne Randeinfassung abgezogen werden."],
    ["Nem méretezi a teherbíró alapréteget vagy vízelvezetést.", "It does not size the load-bearing base layer or drainage.", "Die tragfähige Tragschicht und Entwässerung werden nicht bemessen."],
    ["Ívek, szegélyek és sok vágás növelheti a veszteséget.", "Curves, edges and extensive cutting can increase waste.", "Kurven, Ränder und viele Zuschnitte können den Verschnitt erhöhen."],
    ["Raklap- és csomagkerekítésnél a kereskedő tényleges kiszerelése az irányadó.", "When rounding to pallets or packs, use the retailer’s actual packaging quantities.", "Beim Aufrunden auf Paletten oder Pakete sind die tatsächlichen Gebindegrößen des Händlers maßgeblich."],
    ["A nettó burkolandó területnek pozitívnak kell maradnia.", "The net area to be paved must remain positive.", "Die zu pflasternde Nettofläche muss positiv bleiben."],
    ["A nem szegélyezett oldalhossz nem lehet nagyobb a teljes kerületnél.", "The edge length without edging cannot exceed the full perimeter.", "Die Länge ohne Randeinfassung darf den gesamten Umfang nicht überschreiten."],
    ["A számítás nem végezhető el.", "The calculation cannot be completed.", "Die Berechnung kann nicht durchgeführt werden."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const labels = {"Hossz": ["Length", "Länge"], "Szélesség": ["Width", "Breite"], "Kivonható terület": ["Excluded area", "Abzuziehende Fläche"], "Ráhagyás": ["Allowance", "Zuschlag"], "Csomagfedés": ["Pack coverage", "Paketdeckfläche"], "Ágyazóréteg": ["Bedding layer", "Bettungsschicht"], "Tömörödési tartalék": ["Compaction allowance", "Verdichtungszuschlag"], "Nyitott él": ["Edge without edging", "Rand ohne Einfassung"], "Szegélykő hossza": ["Edging stone length", "Randsteinlänge"]};
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
    let match = /^(\d[\d\s]*(?:,[0-9]+)?) (m²|m³|m|cm|db)$/u.exec(normalized);
    if (match) return `${number(match[1], language)} ${match[2] === "db" ? (language === "en" ? "pcs" : "Stk.") : match[2]}`;
    match = /^(\d[\d\s]*(?:,[0-9]+)?) m-en (\d[\d\s]*(?:,[0-9]+)?) cm esés$/u.exec(normalized);
    if (match) return language === "en" ? `${number(match[2], language)} cm drop over ${number(match[1], language)} m` : `${number(match[2], language)} cm Gefälle auf ${number(match[1], language)} m`;
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
    url.searchParams.set("subject", language === "en" ? "Error report – Paving Calculator" : "Fehlermeldung – Pflaster-Rechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Paving Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/terkovezes-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Pflaster-Rechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/terkovezes-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

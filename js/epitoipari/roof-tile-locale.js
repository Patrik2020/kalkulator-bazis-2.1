/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "tetocserep-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="tetocserep-kalkulator"]');
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
  const page = "tetocserep-kalkulator";
  const entries = [
    ["Részletes anyagtervező", "Detailed material planner", "Detaillierter Materialplaner"],
    ["5% – egyszerű, kevés vágás", "5% – simple layout, few cuts", "5 % – einfache Verlegung, wenige Schnitte"],
    ["8% – általános", "8% – typical", "8 % – üblich"],
    ["12% – sok vágás / mintázat", "12% – many cuts / pattern", "12 % – viele Schnitte / Muster"],
    ["15% – bonyolult felület", "15% – complex area", "15 % – komplexe Fläche"],
    ["Anyagigény kiszámítása", "Calculate material requirement", "Materialbedarf berechnen"],
    ["Alapértékek visszaállítása", "Reset defaults", "Standardwerte wiederherstellen"],
    ["Gyártói/rendszeradat ellenőrzése szükséges.", "Manufacturer/system data must be verified.", "Hersteller-/Systemdaten müssen geprüft werden."],
    ["Írd át a példaértékeket a kiválasztott termék vagy rendszer adatai szerint, majd állítsd az ellenőrző mezőt Igenre. Addig nem készítünk rendelési mennyiséget.", "Replace the example values with data for the selected product or system, then set the verification field to Yes. No order quantity is calculated until then.", "Ersetze die Beispielwerte durch die Daten des gewählten Produkts oder Systems und stelle das Prüffeld anschließend auf Ja. Bis dahin wird keine Bestellmenge berechnet."],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"],
    ["Telepítem", "Install", "Installieren"],
    ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Példa", "Example", "Beispiel"],
    ["Gyakori hibák", "Common mistakes", "Häufige Fehler"],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["Miért kell ráhagyás?", "Why include an allowance?", "Warum ist Verschnitt nötig?"],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["Tégla kalkulátor", "Brick Calculator", "Ziegelrechner"],
    ["Hőszigetelés", "Insulation", "Wärmedämmung"],
    ["Beton kalkulátor", "Concrete Calculator", "Betonrechner"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"],
    ["2026. augusztus 8.", "8 August 2026", "8. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"],
    ["Az eredmény a megadott méretek és anyagjellemzők alapján készült becslés. Beszerzés előtt ellenőrizd a gyártói kiadósságot, a helyszíni adottságokat és a szükséges ráhagyást.", "The result is an estimate based on the dimensions and material properties entered. Before buying, check the manufacturer's coverage data, site conditions and the allowance required.", "Das Ergebnis ist eine Schätzung anhand der eingegebenen Maße und Materialeigenschaften. Prüfe vor dem Kauf die Herstellerangaben zum Verbrauch, die Bedingungen vor Ort und den benötigten Zuschlag."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.", "Found an error? Let us know.", "Fehler gefunden? Melde ihn uns."],
    ["Javítótartalék", "Repair reserve", "Reparaturreserve"],
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
    ["Otthon és felújítás kalkulátorok", "Home and renovation calculators", "Rechner für Haus und Renovierung"],
    ["Főoldal", "Home", "Startseite"],
    ["Otthon & felújítás", "Home & renovation", "Haus & Renovierung"],
    ["Hirdetés", "Advertisement", "Anzeige"],
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
    ["hu-HU", "en-GB", "de-DE"],
    ["Tetőcserép kalkulátor", "Roof Tile Calculator", "Dachziegelrechner"],
    ["Tetőcserép kalkulátor | Darabszám és ráhagyás", "Roof Tile Calculator | Quantities and Allowance", "Dachziegelrechner | Stückzahl und Zuschlag"],
    ["Tetőcserép kalkulátor tetőfelület, cserépszükséglet és ráhagyás alapján. Becsüld meg a darabszámot, és ellenőrizd a tetőforma, hajlásszög és kiegészítők hatását.", "Estimate roof tile quantities from roof area, tile coverage and allowance. Consider roof shape, pitch and accessories.", "Schätze die Dachziegelanzahl anhand von Dachfläche, Ziegelbedarf und Zuschlag. Berücksichtige Dachform, Neigung und Zubehör."],
    ["Becsüld meg a tetőfedéshez szükséges cserepek számát.", "Estimate how many tiles you need for the roof.", "Schätze die für die Dacheindeckung benötigte Ziegelanzahl."],
    ["Tetőcserép- és csomagtervező", "Roof tile and pack planner", "Dachziegel- und Gebindeplaner"],
    ["A gyártói db/m² adatból darabszámot számol. Raklapra csak akkor kerekít felfelé, ha a kereskedő ténylegesen kizárólag teljes csomagban vagy raklapon értékesít.", "Calculates tile quantities from the manufacturer’s tiles-per-m² figure. It only rounds up to pallets when the retailer actually sells exclusively in whole packs or pallets.", "Berechnet die Ziegelanzahl aus der Herstellerangabe in Stück/m². Auf Paletten wird nur aufgerundet, wenn der Händler tatsächlich ausschließlich ganze Gebinde oder Paletten verkauft."],
    ["Teljes tetőfelület (m²)", "Total roof area (m²)", "Gesamte Dachfläche (m²)"],
    ["Tetőablakok és áttörések (m²)", "Roof windows and openings (m²)", "Dachfenster und Durchdringungen (m²)"],
    ["Példa minimum cserépigény (db/m²)", "Example minimum tile requirement (tiles/m²)", "Beispiel: minimaler Ziegelbedarf (Stück/m²)"],
    ["Írd át a kiválasztott cserép gyártói szükségletére; a fedési hossz és típus jelentősen módosíthatja.", "Replace this with the manufacturer’s requirement for your chosen tile; covering length and tile type can change it substantially.", "Trage den Herstellerbedarf für den gewählten Ziegel ein; Decklänge und Ziegeltyp können ihn erheblich verändern."],
    ["Példa maximum cserépigény (db/m²)", "Example maximum tile requirement (tiles/m²)", "Beispiel: maximaler Ziegelbedarf (Stück/m²)"],
    ["Ha az adatlap egyetlen értéket ad, a minimum és maximum legyen azonos.", "If the data sheet gives one value, enter the same minimum and maximum.", "Nennt das Datenblatt nur einen Wert, gib denselben Wert als Minimum und Maximum ein."],
    ["Vágási/törési ráhagyás", "Cutting/breakage allowance", "Zuschlag für Zuschnitt und Bruch"],
    ["Példa csomag/raklap darabszáma", "Example tiles per pack/pallet", "Beispiel: Stückzahl je Gebinde/Palette"],
    ["Darabonkénti rendelésnél opcionális, csak logisztikai tájékoztató; teljes csomag/raklap módban kötelező pozitív egész szám.", "Optional when ordering individual tiles and used only for logistics information; whole-pack/pallet mode requires a positive integer.", "Bei Einzelbestellung optional und nur zur logistischen Orientierung; im Modus für ganze Gebinde/Paletten ist eine positive ganze Zahl erforderlich."],
    ["Értékesítési / rendelési egység", "Sales / ordering unit", "Verkaufs- / Bestelleinheit"],
    ["Darabonként rendelhető – ne kerekíts raklapra", "Individual tiles – do not round up to pallets", "Einzeln bestellbar – nicht auf Paletten aufrunden"],
    ["Csak teljes csomag/raklap – kerekíts felfelé", "Whole packs/pallets only – round up", "Nur ganze Gebinde/Paletten – aufrunden"],
    ["Cserép adatlapja ellenőrizve?", "Have you checked the tile data sheet?", "Ziegeldatenblatt geprüft?"],
    ["Nem – előbb ellenőrzöm az adatlapot", "No – I will check the data sheet first", "Nein – zuerst prüfe ich das Datenblatt"],
    ["Igen – a kiválasztott cserép adatai alapján", "Yes – using the chosen tile’s data", "Ja – anhand der Daten des gewählten Ziegels"],
    ["Tetőcserép-darabszám becslése", "Estimating the number of roof tiles", "Dachziegelanzahl schätzen"],
    ["A kalkulátor a tető tényleges ferde felületéből, a kiválasztott cserép négyzetméterenkénti igényéből és a ráhagyásból számol darabszámot. Első költségbecsléshez használható, de a tetőfedési tervet és a gyártói kiosztási előírást nem helyettesíti.", "The calculator uses the actual sloping roof area, the chosen tile’s requirement per square metre and an allowance to calculate the quantity. It can support an initial cost estimate, but it does not replace a roofing plan or the manufacturer’s layout requirements.", "Der Rechner ermittelt die Stückzahl aus der tatsächlichen geneigten Dachfläche, dem Quadratmeterbedarf des gewählten Ziegels und einem Zuschlag. Er kann eine erste Kostenschätzung unterstützen, ersetzt aber weder den Dachdeckungsplan noch die Verlegevorgaben des Herstellers."],
    ["A tető vízszintes vetülete nem azonos a ferde tetőfelülettel. Hajlásszög, konty, vápa, tetőkibúvó, kémény és törések mind növelhetik a tényleges felületet és a vágási veszteséget.", "The horizontal projection is not the same as the sloping roof area. Roof pitch, hips, valleys, roof access openings, chimneys and changes in roof geometry can increase the actual area and cutting losses.", "Die waagerechte Projektion ist nicht mit der geneigten Dachfläche identisch. Dachneigung, Walm, Kehlen, Dachausstiege, Schornsteine und Dachknicke können die tatsächliche Fläche und den Verschnitt erhöhen."],
    ["Számítás", "Calculation", "Berechnung"],
    ["Darabszám = tetőfelület × db/m² × (1 + ráhagyás / 100)", "Quantity = roof area × tiles/m² × (1 + allowance / 100)", "Stückzahl = Dachfläche × Stück/m² × (1 + Zuschlag / 100)"],
    [", felfelé kerekítve. A db/m² értéket mindig a konkrét cserép műszaki adatlapjáról vedd.", ", rounded up. Always take the tiles-per-m² value from the technical data sheet for the specific tile.", ", aufgerundet. Entnimm den Wert in Stück/m² immer dem technischen Datenblatt des konkreten Ziegels."],
    ["140 m² tetőfelületnél, 10 db/m² cserépigénnyel és 8% ráhagyással 1 512 darab adódik.", "For a roof area of 140 m², a requirement of 10 tiles/m² and an 8% allowance, the result is 1,512 tiles.", "Bei 140 m² Dachfläche, 10 Ziegeln/m² und 8 % Zuschlag ergeben sich 1.512 Stück."],
    ["Miért változhat a db/m²?", "Why can the tiles-per-m² value vary?", "Warum kann der Bedarf in Stück/m² variieren?"],
    ["Egyes cserepeknél a tényleges fedési hossz és léctávolság tartományban állítható, ezért ugyanannak a típusnak a négyzetméterenkénti igénye sem feltétlenül egyetlen fix szám. A gyártói táblázat és az adott tető hajlásszöge együtt lehet irányadó.", "For some tiles, the covering length and batten spacing can be adjusted within a range, so the requirement per square metre for the same tile type is not necessarily a single fixed figure. Use the manufacturer’s table together with the pitch of the specific roof.", "Bei manchen Ziegeln lassen sich Decklänge und Lattenabstand innerhalb eines Bereichs einstellen. Deshalb ist der Quadratmeterbedarf desselben Ziegeltyps nicht unbedingt ein fester Einzelwert. Maßgeblich können die Herstellertabelle und die Neigung des konkreten Dachs gemeinsam sein."],
    ["A kiegészítő elemeket külön számold", "Calculate accessories separately", "Zubehör gesondert berechnen"],
    ["Gerinccserép, szegélycserép, szellőzőelem, hófogó, kezdőelem, félcserép, fólia, ellenléc, tetőléc, rögzítők és bádogos elemek külön mennyiséget igényelnek. Ezeket normál cserép-darabszámmal nem lehet megbízhatóan helyettesíteni.", "Ridge tiles, verge tiles, ventilation components, snow guards, starter pieces, half tiles, underlay, counter battens, roof battens, fixings and flashings need separate quantities. The standard tile count cannot reliably substitute for these.", "First- und Ortgangziegel, Lüftungselemente, Schneefang, Anfangselemente, Halbziegel, Unterspannbahn, Konterlatten, Dachlatten, Befestigungen und Blechanschlüsse benötigen eigene Mengenansätze. Sie lassen sich nicht zuverlässig durch die Anzahl normaler Dachziegel ersetzen."],
    ["Ráhagyás összetett tetőn", "Allowance for a complex roof", "Zuschlag bei komplexen Dächern"],
    ["Egyszerű nyeregtetőn kisebb, sok vápánál, kontynál és tetőkibúvónál nagyobb tartalék lehet indokolt. Az azonos gyártási tételből félretett néhány darab későbbi javításnál is értékes lehet.", "A simple gable roof may need a smaller reserve, while numerous valleys, hips and roof access openings may justify more. Keeping a few tiles from the same production batch can also be valuable for future repairs.", "Bei einem einfachen Satteldach kann eine kleinere Reserve genügen; viele Kehlen, Walme und Dachausstiege können eine größere rechtfertigen. Einige zurückgelegte Ziegel derselben Produktionscharge können auch für spätere Reparaturen wertvoll sein."],
    ["Az épület alapterületét tetőfelületként használják.", "Using the building footprint as the roof area.", "Die Gebäudegrundfläche wird als Dachfläche verwendet."],
    ["Más cseréptípus db/m² adatát adják meg.", "Entering the tiles-per-m² figure for a different tile type.", "Es wird der Bedarf in Stück/m² eines anderen Ziegeltyps eingegeben."],
    ["A kiegészítő elemeket normál cserépként számolják.", "Counting accessories as standard tiles.", "Zubehör wird als normaler Dachziegel gezählt."],
    ["A hajlásszög és a léctávolság hatását figyelmen kívül hagyják.", "Ignoring the effect of roof pitch and batten spacing.", "Der Einfluss von Dachneigung und Lattenabstand wird ignoriert."],
    ["Túl kevés tartalékot hagynak későbbi javításhoz.", "Keeping too few spare tiles for future repairs.", "Es wird zu wenig Reserve für spätere Reparaturen eingeplant."],
    ["Hol találom a db/m² értéket?", "Where can I find the tiles-per-m² value?", "Wo finde ich den Bedarf in Stück/m²?"],
    ["A gyártó műszaki adatlapján, gyakran a léctávolság függvényében.", "In the manufacturer’s technical data sheet, often depending on batten spacing.", "Im technischen Datenblatt des Herstellers, häufig abhängig vom Lattenabstand."],
    ["Vágás, törés, vápa, konty és későbbi javítás miatt.", "For cutting, breakage, valleys, hips and future repairs.", "Wegen Zuschnitt, Bruch, Kehlen, Walmen und späterer Reparaturen."],
    ["A gerinccserepet is számolja?", "Does it include ridge tiles?", "Werden Firstziegel mitberechnet?"],
    ["Nem, azt a gerinc és élgerinc hossza alapján külön kell számítani.", "No. Calculate these separately from the ridge and hip lengths.", "Nein. Diese müssen anhand der First- und Gratlängen gesondert berechnet werden."],
    ["Elég a tető alapterületét megadni?", "Is the roof’s footprint enough?", "Reicht die Grundfläche des Dachs aus?"],
    ["Nem. A ferde tetőfelület nagyobb a vízszintes vetületnél.", "No. The sloping roof area is larger than its horizontal projection.", "Nein. Die geneigte Dachfläche ist größer als ihre waagerechte Projektion."],
    ["Palára vagy lemezre használható?", "Can it be used for slate or sheet roofing?", "Ist der Rechner für Schiefer oder Blech geeignet?"],
    ["Csak akkor, ha a megfelelő egységigényt adod meg, de az adott fedési rendszer szabályai eltérhetnek.", "Only if you enter the appropriate requirement per unit area; the rules for that roofing system may differ.", "Nur wenn der passende Bedarf je Flächeneinheit eingegeben wird; die Regeln des jeweiligen Dachdeckungssystems können abweichen."],
    ["Tetőfedési kiegészítőlista", "Roofing accessories checklist", "Checkliste für Dachzubehör"],
    ["A mezőcserép darabszáma nem egyenlő a teljes tetőfedési anyaglistával", "The standard tile count is not the complete roofing materials list", "Die Anzahl der Flächenziegel ist nicht die vollständige Materialliste für das Dach"],
    ["A tető geometriája gerincet, élt, vápát, ereszt, oromszegélyt, áttöréseket és szellőzési pontokat is tartalmazhat. Ezekhez speciális kiegészítők és eltérő vágási veszteség tartozhat.", "Roof geometry may include ridges, hips, valleys, eaves, verges, openings and ventilation points. These may require special accessories and different cutting allowances.", "Die Dachgeometrie kann Firste, Grate, Kehlen, Traufen, Ortgänge, Durchdringungen und Lüftungspunkte umfassen. Dafür können besondere Zubehörteile und unterschiedliche Verschnittzuschläge nötig sein."],
    ["Gerinc és él", "Ridges and hips", "First und Grat"],
    ["Külön elemek, rögzítők és szellőző megoldások szükségesek lehetnek.", "Separate components, fixings and ventilation solutions may be required.", "Gesonderte Bauteile, Befestigungen und Lüftungslösungen können erforderlich sein."],
    ["Vápa és áttörés", "Valleys and openings", "Kehlen und Durchdringungen"],
    ["Sok vágást és külön bádogos vagy rendszerkiegészítőt jelenthet.", "These may involve extensive cutting and separate flashings or system accessories.", "Hier können viele Zuschnitte sowie gesonderte Blechanschlüsse oder Systemzubehörteile nötig sein."],
    ["Eresz és orom", "Eaves and verges", "Traufe und Ortgang"],
    ["A kezdés, szegélyezés és rögzítés nem vezethető le pusztán a tető m²-ből.", "Starter details, edge finishing and fixings cannot be derived from roof area alone.", "Anfangsausbildung, Randabschlüsse und Befestigungen lassen sich nicht allein aus der Dachfläche ableiten."],
    ["Néhány azonos típusú cserép későbbi viharkár vagy törés esetére értékes lehet.", "A few spare tiles of the same type can be valuable after future storm damage or breakage.", "Einige Ersatzziegel desselben Typs können bei späteren Sturm- oder Bruchschäden wertvoll sein."],
    ["Tetőfedésnél a hajlásszög, alátéthéjazat, léctávolság és rögzítés gyártói rendszerelőírás és tervezési kérdés. A darabszám-kalkulátor ezt nem helyettesíti.", "Roof pitch, underlay, batten spacing and fixings depend on the manufacturer’s system requirements and roof design. A quantity calculator does not replace that planning.", "Dachneigung, Unterdeckung, Lattenabstand und Befestigung richten sich nach den Systemvorgaben des Herstellers und der Dachplanung. Ein Stückzahlrechner ersetzt diese Planung nicht."],
    ["Miért gyártói adat a tetőcserép fajlagos igénye?", "Why must tile coverage come from the manufacturer?", "Warum muss der spezifische Dachziegelbedarf vom Hersteller stammen?"],
    ["A tetőfelületből és a megadott db/m² cserépigényből számol, majd ráhagyást és csomagolási kerekítést alkalmaz. A fajlagos darabszámot nem vezeti le pusztán a cserép névleges méretéből, mert a fedési hossz és oldalirányú átfedés termékfüggő.", "The calculation uses roof area and the tile requirement entered in tiles/m², then applies an allowance and packaging rounding. It does not derive coverage solely from the tile’s nominal dimensions, because covering length and side overlap depend on the product.", "Die Berechnung verwendet Dachfläche und eingegebenen Bedarf in Stück/m² und berücksichtigt anschließend Zuschlag und Gebinderundung. Der spezifische Stückbedarf wird nicht allein aus den Nennmaßen des Ziegels abgeleitet, da Decklänge und seitliche Überdeckung produktabhängig sind."],
    ["A db/m² értéket, minimális hajlásszöget, léctávolságot és kiegészítő elemeket a konkrét tetőcserép gyártói alkalmazástechnikai útmutatójából add meg.", "Use the specific tile manufacturer’s installation guide for tiles/m², minimum roof pitch, batten spacing and accessories.", "Entnimm Bedarf in Stück/m², Mindestdachneigung, Lattenabstand und Zubehör der Verlegeanleitung des Herstellers für den konkreten Dachziegel."],
    ["Ha a kiválasztott cserép adatlapja 9,5–11 db/m² tartományt ad, 120 m² tetőből 3 m² áttörést levonva ezzel készül a becslés.", "If the chosen tile’s data sheet gives a range of 9.5–11 tiles/m², the estimate uses that range after deducting 3 m² of openings from a 120 m² roof.", "Gibt das Datenblatt des gewählten Ziegels einen Bedarf von 9,5–11 Stück/m² an, wird die Schätzung nach Abzug von 3 m² Durchdringungen von einer 120 m² großen Dachfläche damit berechnet."],
    ["Más cseréptípus szükséglete többszöröse is lehet ennek, ezért kontyolt, vápás vagy sok áttöréses tetőnél a gyártói fedési terv az elsődleges.", "Other tile types may require several times this quantity, so the manufacturer’s roofing plan takes precedence for hipped roofs, valleys or roofs with many openings.", "Andere Ziegeltypen können ein Mehrfaches dieser Menge benötigen. Bei Walm- oder Kehldächern und vielen Durchdringungen ist daher der Deckplan des Herstellers maßgeblich."],
    ["Nem készít tetőszerkezeti vagy statikai tervet.", "It does not produce a roof structure or structural engineering design.", "Es wird keine Dachkonstruktions- oder Tragwerksplanung erstellt."],
    ["Vápa, élgerinc, áttörés és szegély környezetében külön vágási veszteség lehet.", "Additional cutting losses may occur around valleys, hips, openings and edges.", "An Kehlen, Graten, Durchdringungen und Rändern kann zusätzlicher Verschnitt entstehen."],
    ["Kiegészítő cserepek és rögzítők nem vezethetők le megbízhatóan egyetlen db/m² értékből.", "Accessory tiles and fixings cannot be reliably derived from a single tiles-per-m² figure.", "Zubehörziegel und Befestigungen lassen sich nicht zuverlässig aus einem einzelnen Wert in Stück/m² ableiten."],
    ["Rendelési mód", "Ordering mode", "Bestellmodus"],
    ["Csak teljes csomag/raklap", "Whole packs/pallets only", "Nur ganze Gebinde/Paletten"],
    ["Darabonként rendelhető", "Individual tiles", "Einzeln bestellbar"],
    ["Nettó fedendő tetőfelület", "Net roof area to cover", "Netto einzudeckende Dachfläche"],
    ["Cserépigény ráhagyással", "Tiles required with allowance", "Ziegelbedarf mit Zuschlag"],
    ["Vásárolandó teljes csomag/raklap", "Whole packs/pallets to purchase", "Zu kaufende ganze Gebinde/Paletten"],
    ["Raklapra kerekített darabszám", "Tile count rounded up to pallets", "Auf Paletten aufgerundete Stückzahl"],
    ["Raklap-egyenérték (csak tájékoztató)", "Pallet equivalent (for information only)", "Palettenäquivalent (nur zur Orientierung)"],
    ["Ismeretlen tetőcserép rendelési mód.", "Unknown roof tile ordering mode.", "Unbekannter Bestellmodus für Dachziegel."],
    ["A teljes csomag/raklap módhoz a csomag darabszáma pozitív egész szám legyen.", "Whole-pack/pallet mode requires a positive whole number of tiles per pack.", "Für ganze Gebinde/Paletten muss die Stückzahl je Gebinde eine positive ganze Zahl sein."],
    ["A rendelési becslés előtt ellenőrizd és erősítsd meg a kiválasztott tetőcserép gyártói db/m² és csomag/raklap adatait.", "Before estimating an order, check and confirm the chosen tile manufacturer’s tiles-per-m² and pack/pallet data.", "Prüfe und bestätige vor der Bestellschätzung die Herstellerangaben des gewählten Dachziegels zu Stück/m² und Gebinde/Palette."],
    ["A nettó tetőfelületnek pozitívnak kell maradnia.", "The net roof area must remain positive.", "Die Nettodachfläche muss positiv bleiben."],
    ["A minimum cserépigény nem lehet nagyobb a maximumnál.", "The minimum tile requirement must not exceed the maximum.", "Der minimale Ziegelbedarf darf den maximalen nicht überschreiten."],
    ["A csomag/raklap darabszáma egész szám legyen.", "The number of tiles per pack/pallet must be a whole number.", "Die Stückzahl je Gebinde/Palette muss eine ganze Zahl sein."],
    ["Az eredmény a számítás után jelenik meg.", "The result will appear after calculation.", "Das Ergebnis erscheint nach der Berechnung."],
    ["A számítás nem végezhető el.", "The calculation cannot be completed.", "Die Berechnung kann nicht durchgeführt werden."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const labels = {"Tetőfelület": ["Roof area", "Dachfläche"], "Áttörések": ["Openings", "Durchdringungen"], "Minimum cserépigény": ["Minimum tile requirement", "Minimaler Ziegelbedarf"], "Maximum cserépigény": ["Maximum tile requirement", "Maximaler Ziegelbedarf"], "Ráhagyás": ["Allowance", "Zuschlag"], "Csomagméret": ["Pack size", "Gebindegröße"]};
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
    let match = /^(\d[\d\s]*(?:,\d+)?)(?:–(\d[\d\s]*(?:,\d+)?))?(?: (m²|db))?$/u.exec(normalized);
    if (match) {
      const value = number(match[1], language) + (match[2] ? "–" + number(match[2], language) : "");
      return value + (match[3] === "db" ? (language === "en" ? " pcs" : " Stk.") : match[3] ? " " + match[3] : "");
    }
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
    url.searchParams.set("subject", language === "en" ? "Error report – Roof Tile Calculator" : "Fehlermeldung – Dachziegelrechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Roof Tile Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/tetocserep-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Dachziegelrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/tetocserep-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

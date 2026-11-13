/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document;
  const main = doc.querySelector("main.page-tegla");
  if (!main) return;
  let language = "hu";
  let rendering = false;
  const textState = new WeakMap();
  const attrState = new WeakMap();
  const originals = new Map();

  function localize(value) {
    if (typeof value === "string") return api.translate(api.page, value, language) ?? value;
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item)]));
    }
    return value;
  }

  function render() {
    if (rendering) return;
    rendering = true;
    try {
      const walker = doc.createTreeWalker(main, root.NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        if (node.parentElement?.closest("script,style,textarea,pre,code,[contenteditable],[translate='no']")) continue;
        const current = node.nodeValue;
        const previous = textState.get(node);
        const source = previous?.rendered === current ? previous.source : current;
        const parts = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source);
        if (!parts?.[2]) continue;
        const translated = api.translate(api.page, parts[2], language);
        const value = parts[1] + (translated ?? parts[2]) + parts[3];
        if (value !== current) node.nodeValue = value;
        if (translated !== null || previous) textState.set(node, { source, rendered: value });
      }

      main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
        let state = attrState.get(element);
        if (!state) {
          state = new Map();
          attrState.set(element, state);
        }
        for (const name of ["aria-label", "placeholder", "title"]) {
          if (!element.hasAttribute(name)) continue;
          const current = element.getAttribute(name);
          const previous = state.get(name);
          const source = previous?.rendered === current ? previous.source : current;
          const value = api.translate(api.page, source, language) ?? source;
          if (value !== current) element.setAttribute(name, value);
          state.set(name, { source, rendered: value });
        }
      });

      const errorLink = main.querySelector('a[href^="mailto:"][href*="subject="]');
      if (errorLink) {
        const source = originals.has("errorReportHref") ? originals.get("errorReportHref") : errorLink.getAttribute("href");
        originals.set("errorReportHref", source);
        errorLink.setAttribute("href", api.reportHref(source, language));
      }

      const structured = doc.getElementById("kb-structured-data");
      if (structured) {
        if (!originals.has("jsonld")) originals.set("jsonld", structured.textContent);
        try {
          structured.textContent = JSON.stringify(localize(JSON.parse(originals.get("jsonld"))));
        } catch {
          /* Keep the original structured data if it cannot be parsed. */
        }
      }

      for (const selector of [
        "title",
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]'
      ]) {
        const element = doc.querySelector(selector);
        if (!element) continue;
        const source = originals.has(selector)
          ? originals.get(selector)
          : (selector === "title" ? element.textContent : element.content);
        originals.set(selector, source);
        const value = api.translate(api.page, source, language) ?? source;
        if (selector === "title") element.textContent = value;
        else element.content = value;
      }
    } finally {
      rendering = false;
    }
  }

  function choose(next) {
    language = api.supported.includes(next) ? next : "hu";
    render();
  }

  doc.addEventListener("kb:language-changed", event => choose(event.detail?.language || "hu"));
  choose(root.KB_SITE_LANGUAGE?.get?.() || "hu");
  new root.MutationObserver(changes => {
    if (changes.some(change => change.type === "childList" || change.type === "characterData")) render();
  }).observe(main, { childList: true, characterData: true, subtree: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const page = "tegla-kalkulator";
  const entries = [
    ["hu-HU", "en-GB", "de-DE"],
    ["Főoldal", "Home", "Startseite"],
    ["Otthon & felújítás", "Home & renovation", "Haus & Renovierung"],
    ["Otthon és felújítás kalkulátorok", "Home & renovation calculators", "Rechner für Haus und Renovierung"],
    ["Tégla mennyiség kiszámítása falazáshoz.", "Calculating the number of bricks needed for masonry.", "Berechnung des Ziegelbedarfs für Mauerwerk."],
    ["Tégla kalkulátor | Falazat és darabszám becslése", "Brick Calculator | Estimate Masonry and Brick Quantities", "Ziegelrechner | Mauerwerk und Ziegelbedarf schätzen"],
    ["Tégla kalkulátor: számold ki mennyi tégla szükséges falazáshoz, házépítéshez vagy válaszfal készítéséhez. Porotherm és egyedi téglák támogatásával.", "Brick calculator: estimate how many bricks you need for masonry, housebuilding or partition walls. Includes Porotherm products and custom-sized bricks.", "Ziegelrechner: Schätze den Ziegelbedarf für Mauerwerk, Hausbau oder Trennwände. Mit Porotherm-Produkten und Ziegeln in Sondergrößen."],
    ["Tégla kalkulátor", "Brick Calculator", "Ziegelrechner"],
    ["Tégla mennyiség kalkulátor", "Brick Quantity Calculator", "Ziegelmengen-Rechner"],
    ["Számold ki gyorsan és pontosan, hogy mennyi tégla szükséges falazáshoz, válaszfal építéshez vagy akár egy teljes ház kivitelezéséhez.", "Quickly estimate how many bricks you need for masonry, partition walls or even an entire house.", "Berechne schnell und übersichtlich, wie viele Ziegel du für Mauerwerk, Trennwände oder ein ganzes Haus benötigst."],
    ["Fal hossza (m)", "Wall length (m)", "Wandlänge (m)"],
    ["Fal magassága (m)", "Wall height (m)", "Wandhöhe (m)"],
    ["Ablakok összterülete (m²)", "Total window area (m²)", "Gesamtfläche der Fenster (m²)"],
    ["Add meg az összes ablak együttes területét.", "Enter the combined area of all windows.", "Gib die Gesamtfläche aller Fenster an."],
    ["Ajtók összterülete (m²)", "Total door area (m²)", "Gesamtfläche der Türen (m²)"],
    ["Add meg az összes ajtó együttes területét.", "Enter the combined area of all doors.", "Gib die Gesamtfläche aller Türen an."],
    ["Téglatípus", "Brick type", "Ziegeltyp"],
    ["Porotherm 10 N+F", "Porotherm 10 N+F", "Porotherm 10 N+F"],
    ["Porotherm 20 N+F", "Porotherm 20 N+F", "Porotherm 20 N+F"],
    ["Porotherm 30 N+F", "Porotherm 30 N+F", "Porotherm 30 N+F"],
    ["Porotherm 38 N+F", "Porotherm 38 N+F", "Porotherm 38 N+F"],
    ["Kisméretű tömör tégla", "Small-format solid brick", "Kleinformat-Vollziegel"],
    ["Egyedi méretű tégla", "Custom-size brick", "Ziegel in Sondergröße"],
    ["egyedi méretű tégla", "custom-size brick", "Ziegel in Sondergröße"],
    ["Add meg a tégla hosszát és magasságát centiméterben.", "Enter the brick length and height in centimetres.", "Gib die Länge und Höhe des Ziegels in Zentimetern ein."],
    ["Ráhagyás (%)", "Waste allowance (%)", "Verschnittzuschlag (%)"],
    ["Tégla ára (Ft/db)", "Price per brick (HUF)", "Preis pro Ziegel (HUF)"],
    ["Ha nem tudod, hagyd üresen.", "If you do not know the price, leave this field blank.", "Wenn du den Preis nicht kennst, lass das Feld leer."],
    ["Tégla hossza (cm)", "Brick length (cm)", "Ziegellänge (cm)"],
    ["Tégla magassága (cm)", "Brick height (cm)", "Ziegelhöhe (cm)"],
    ["Falvastagság:", "Wall thickness:", "Wandstärke:"],
    ["Átlagos szükséglet:", "Typical requirement:", "Üblicher Bedarf:"],
    ["Ajánlott felhasználás:", "Recommended use:", "Empfohlene Verwendung:"],
    ["válaszfalak", "partition walls", "Trennwände"],
    ["20 cm vastag válaszfalak", "20 cm-thick partition walls", "20 cm starke Trennwände"],
    ["teherhordó külső falak", "load-bearing external walls", "tragende Außenwände"],
    ["kiemelten jó hőszigetelésű külső falak", "external walls with enhanced thermal insulation", "Außenwände mit besonders guter Wärmedämmung"],
    ["felújítás és hagyományos falazás", "renovation and traditional masonry", "Sanierung und traditionelles Mauerwerk"],
    ["Eredmények", "Results", "Ergebnisse"],
    ["Fal teljes felülete:", "Gross wall area:", "Brutto-Wandfläche:"],
    ["Nyílászárók összterülete:", "Total area of doors and windows:", "Gesamtfläche von Türen und Fenstern:"],
    ["Nettó falfelület:", "Net wall area:", "Netto-Wandfläche:"],
    ["Szükséges téglák száma:", "Bricks required:", "Benötigte Ziegel:"],
    ["Ajánlott mennyiség:", "Recommended quantity:", "Empfohlene Menge:"],
    ["Becsült anyagköltség:", "Estimated material cost:", "Geschätzte Materialkosten:"],
    ["Add meg az adatokat a számításhoz.", "Enter the dimensions to calculate.", "Gib die Maße ein, um zu rechnen."],
    ["Adj meg érvényes egyedi téglaméretet a számításhoz.", "Enter valid custom brick dimensions to calculate.", "Gib gültige Maße für den Ziegel in Sondergröße ein, um zu rechnen."],
    ["Tégla összesítő", "Brick summary", "Ziegelübersicht"],
    ["Az Ön által megadott adatok alapján a nettó", "Based on the details you entered, the net wall area is", "Auf Grundlage deiner Angaben beträgt die Netto-Wandfläche"],
    ["Az Ön által megadott adatok alapján a nettó falfelület", "Based on the details you entered, the net wall area is", "Auf Grundlage deiner Angaben beträgt die Netto-Wandfläche"],
    ["A kiválasztott", "Using the selected", "Mit dem ausgewählten"],
    ["használatával várhatóan", "you will need approximately", "benötigst du voraussichtlich"],
    ["tégla szükséges.", "bricks.", "Ziegel."],
    ["tégla beszerzését javasoljuk.", "bricks.", "Ziegel."],
    ["A megadott ár alapján az anyagköltség várhatóan", "At the price entered, the estimated material cost is", "Bei dem angegebenen Preis betragen die geschätzten Materialkosten"],
    ["Nincs megadva", "Not provided", "Nicht angegeben"],
    ["Téglaszükséglet becslése falazás előtt", "Estimate your brick requirements before building", "Ziegelbedarf vor dem Mauern schätzen"],
    ["Falhossz, falmagasság és a választott tégla fajlagos darabigénye alapján már a korai tervezésnél megbecsülhető a rendelés nagyságrendje.", "The wall length, wall height and selected brick's units-per-square-metre rate provide an early estimate of the order size.", "Anhand von Wandlänge, Wandhöhe und dem gewählten Ziegelbedarf pro Quadratmeter lässt sich die Größenordnung der Bestellung bereits früh abschätzen."],
    ["A pontos mennyiség függ a tégla méretétől, falvastagságtól, kötésmódtól, vágásoktól, nyílásoktól és veszteségtől. Ezért a kalkulátor eredményét mindig becslésként érdemes kezelni.", "The actual quantity depends on brick dimensions, wall thickness, the bond pattern, cuts, openings and waste. Treat the calculator's result as an estimate.", "Die tatsächliche Menge hängt von Ziegelmaßen, Wandstärke, Verband, Zuschnitten, Öffnungen und Verschnitt ab. Das Ergebnis des Rechners ist daher immer als Schätzung zu verstehen."],
    ["Hogyan működik a számítás?", "How does the calculation work?", "Wie funktioniert die Berechnung?"],
    ["A számítás a fal hosszából és magasságából felületet képez, majd ezt szorozza az egy négyzetméterre jutó téglaszámmal. A ráhagyás segít kezelni a törést, vágást, selejtet és kisebb mérési eltéréseket.", "The calculation multiplies the wall length by its height to get the area, then applies the selected number of bricks per square metre. The allowance helps cover breakages, cuts, damaged bricks and minor measurement differences.", "Die Berechnung multipliziert die Wandlänge mit der Wandhöhe und erhält so die Fläche. Diese wird mit dem gewählten Ziegelbedarf pro Quadratmeter multipliziert. Der Zuschlag berücksichtigt Bruch, Zuschnitte, Ausschuss und kleinere Messabweichungen."],
    ["Konkrét példaszámítás", "Worked example", "Rechenbeispiel"],
    ["Ha egy fal 10 méter hosszú és 2,8 méter magas, a felület 28 m². Ha 16 tégla kell egy négyzetméterre, az alap mennyiség 448 darab. 10% ráhagyással már nagyjából 493 darabbal érdemes számolni.", "For a wall 10 metres long and 2.8 metres high, the area is 28 m². At 16 bricks per square metre, the base quantity is 448 bricks. With a 10% allowance, plan for approximately 493 bricks.", "Eine 10 Meter lange und 2,8 Meter hohe Wand hat eine Fläche von 28 m². Bei 16 Ziegeln pro Quadratmeter beträgt die Grundmenge 448 Ziegel. Mit 10 % Zuschlag solltest du mit ungefähr 493 Ziegeln rechnen."],
    ["Mikor hasznos ez a kalkulátor?", "When is this calculator useful?", "Wann ist dieser Rechner hilfreich?"],
    ["falazási anyagtervezésnél", "when planning masonry materials", "bei der Materialplanung für Mauerwerk"],
    ["árajánlat előkészítésekor", "when preparing a quote", "bei der Vorbereitung eines Angebots"],
    ["kisebb melléképület vagy válaszfal tervezésénél", "when planning a small outbuilding or partition wall", "bei der Planung eines kleinen Nebengebäudes oder einer Trennwand"],
    ["anyagköltség becsléséhez", "when estimating material costs", "zur Schätzung der Materialkosten"],
    ["Fontos tudni:", "Important:", "Wichtiger Hinweis:"],
    ["A végleges mennyiséget mindig a konkrét tégla típusa, falazási technológia és terv alapján ellenőrizd. Statikai vagy engedélyköteles munkához szakember szükséges.", "Always verify the final quantity against the specific brick type, masonry method and project plans. Structural work or work requiring a permit must be assessed by a qualified professional.", "Prüfe die endgültige Menge immer anhand des konkreten Ziegeltyps, der Mauertechnik und der Bauplanung. Bei statisch relevanten oder genehmigungspflichtigen Arbeiten ist eine Fachkraft erforderlich."],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["Le kell vonni az ablakokat és ajtókat?", "Should windows and doors be deducted?", "Müssen Fenster und Türen abgezogen werden?"],
    ["Nagyobb nyílásoknál igen, de a veszteség és vágás miatt óvatosan számolj.", "Yes, for larger openings. However, allow for waste and cuts when estimating the quantity.", "Bei größeren Öffnungen ja. Berücksichtige bei der Schätzung aber auch Verschnitt und Zuschnitte."],
    ["Mennyi ráhagyás kell?", "How much allowance should I include?", "Wie viel Zuschlag sollte ich einplanen?"],
    ["Gyakran 5-10% kiindulásnak jó, de bonyolult falnál több is lehet.", "A 5–10% allowance is often a reasonable starting point, but complex walls may require more.", "Ein Zuschlag von 5–10 % ist oft ein sinnvoller Ausgangspunkt. Bei komplizierten Wänden kann mehr nötig sein."],
    ["Minden téglatípusra jó?", "Does it work for every type of brick?", "Funktioniert der Rechner für jeden Ziegeltyp?"],
    ["Csak akkor, ha a megfelelő darab/m² értéket adod meg.", "Only if you enter the correct number of bricks per square metre for the product.", "Nur wenn du den passenden Ziegelbedarf pro Quadratmeter für das Produkt eingibst."],
    ["A habarcsot is számolja?", "Does it calculate mortar as well?", "Berechnet der Rechner auch den Mörtelbedarf?"],
    ["Ha nincs külön mező, akkor nem; ehhez külön anyagbecslés kell.", "No. There is no separate mortar input, so mortar must be estimated separately.", "Nein. Es gibt kein eigenes Eingabefeld für Mörtel; der Bedarf muss separat geschätzt werden."],
    ["Elég a kalkulátor rendeléshez?", "Is the calculator sufficient for placing an order?", "Reicht der Rechner für eine Bestellung aus?"],
    ["Előzetes anyagtervhez használható; végleges rendelés előtt egyeztess kivitelezővel vagy kereskedővel.", "It is suitable for preliminary material planning. Before placing a final order, confirm the quantity with your builder or supplier.", "Der Rechner eignet sich für eine erste Materialplanung. Kläre die endgültige Bestellmenge vor dem Kauf mit deinem Bauunternehmen oder Baustoffhändler."],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["Beton kalkulátor", "Concrete Calculator", "Betonrechner"],
    ["Vakolat kalkulátor", "Plaster Calculator", "Putzrechner"],
    ["Hőszigetelés kalkulátor", "Insulation Calculator", "Dämmstoffrechner"],
    ["Gipszkarton kalkulátor", "Drywall Calculator", "Trockenbau-Rechner"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limits", "Verlässlichkeit und Berechnungsgrenzen"],
    ["Az eredmény a megadott méretek és anyagjellemzők alapján készült becslés. Beszerzés előtt ellenőrizd a gyártói kiadósságot, a helyszíni adottságokat és a szükséges ráhagyást.", "The result is an estimate based on the dimensions and material details entered. Before buying, check the manufacturer's stated coverage, site conditions and the allowance required.", "Das Ergebnis ist eine Schätzung anhand der eingegebenen Maße und Materialangaben. Prüfe vor dem Kauf die Herstellerangaben, die Bedingungen vor Ort und den erforderlichen Zuschlag."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.", "Found an error? Let us know.", "Fehler gefunden? Gib uns Bescheid."],
    ["Raklap- és tartaléktervező", "Pallet and reserve planner", "Paletten- und Reserveplaner"],
    ["A darabszám után jön a logisztika", "Once you know the quantity, plan the logistics", "Nach der Stückzahl kommt die Logistik"],
    ["A falazatnál nem csak az számít, hány darab elem kell. A raklapos kiszerelés, törési tartalék, helyszíni tárolás és a későbbi pótlás lehetősége is befolyásolja a rendelést.", "For masonry, the number of units is only part of the decision. Pallet quantities, a breakage reserve, on-site storage and the option to replace damaged bricks later can all affect the order.", "Beim Mauern zählt nicht nur die benötigte Stückzahl. Palettengrößen, Bruchreserve, Lagerung auf der Baustelle und spätere Nachbestellungen beeinflussen ebenfalls die Bestellung."],
    ["Darab egy raklapon", "Bricks per pallet", "Ziegel pro Palette"],
    ["Külön tartalék a fő kalkulátor ráhagyásán felül", "Extra reserve on top of the main calculator's allowance", "Zusätzliche Reserve zum Zuschlag des Hauptrechners"],
    ["Ajánlott darabszám", "Recommended number of bricks", "Empfohlene Ziegelanzahl"],
    ["Raklapra kerekített rendelés", "Order rounded up to full pallets", "Auf volle Paletten aufgerundete Bestellung"],
    ["Raklapos kerekítésből maradó tartalék", "Spare bricks from pallet rounding", "Übrig bleibende Reserve durch Palettenrundung"],
    ["A téglatípus kiválasztása szerkezeti kérdés lehet. Teherhordó falnál a falvastagság és termékválasztás ne a kalkulátor alapján dőljön el.", "Choosing a brick type can be a structural decision. For load-bearing walls, do not decide on wall thickness or product selection based on this calculator alone.", "Die Wahl des Ziegeltyps kann eine statische Frage sein. Bei tragenden Wänden sollten Wandstärke und Produktauswahl nicht allein anhand dieses Rechners festgelegt werden."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren oder sie mit jemandem teilen kannst, für den sie nützlich sein könnte."],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"],
    ["Telepítem", "Install", "Installieren"],
    ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favourites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Hozzáadás a Főképernyőhöz", "Add to Home Screen", "Zum Startbildschirm hinzufügen"],
    ["Nyisd meg a Safari Megosztás menüjét, válaszd a Hozzáadás a Főképernyőhöz lehetőséget, majd koppints a Hozzáadás gombra.", "Open Safari’s Share menu, choose Add to Home Screen, then tap Add.", "Öffne das Teilen-Menü von Safari, wähle Zum Startbildschirm hinzufügen und tippe anschließend auf Hinzufügen."],
    ["A Főképernyőhöz adás iPhone-on és iPaden Safariból végezhető el a legegyértelműbben. Nyisd meg ott az oldalt, majd használd a Megosztás menüt.", "On iPhone and iPad, the clearest way to add this page to your Home Screen is through Safari. Open the page in Safari and use the Share menu.", "Auf iPhone und iPad lässt sich die Seite am einfachsten über Safari zum Startbildschirm hinzufügen. Öffne die Seite in Safari und verwende das Teilen-Menü."],
    ["A natív megosztás nem sikerült, megpróbáljuk a linket másolni.", "Native sharing failed, so we’ll try copying the link instead.", "Das Teilen über die Systemfunktion ist fehlgeschlagen. Wir versuchen stattdessen, den Link zu kopieren."],

    ["A telepítési művelet nem sikerült.", "The installation action failed.", "Die Installation konnte nicht ausgeführt werden."],
    ["Ezt a kalkulátort a Kalkulátor Bázison találtam.", "I found this calculator on Kalkulátor Bázis.", "Ich habe diesen Rechner auf Kalkulátor Bázis gefunden."],
    ["A megtartó CTA komponens nem tölthető be.", "The save-and-share panel could not be loaded.", "Das Speichern-und-Teilen-Element konnte nicht geladen werden."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
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
    ["Kalkulátor Bázis főoldal", "Kalkulátor Bázis home page", "Startseite von Kalkulátor Bázis"],
    ["Nyelv", "Language", "Sprache"],
    ["pl. 5", "e.g. 5", "z. B. 5"],
    ["pl. 2.7", "e.g. 2.7", "z. B. 2,7"],
    ["pl. 900", "e.g. 900", "z. B. 900"],
    ["pl. 30", "e.g. 30", "z. B. 30"],
    ["pl. 25", "e.g. 25", "z. B. 25"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]);
  const parseHu = value => Number(String(value).replace(/\s/gu, "").replace(/\./gu, "").replace(/,/gu, "."));
  const formatHu = (value, language, decimals = 0) => {
    const number = parseHu(value);
    if (!Number.isFinite(number)) return value;
    return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  };

  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language) || language === "hu") return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    const pair = dictionary[normalized];
    if (pair) return pair[language === "en" ? 0 : 1];

    let match = /^Falvastagság: ([\d\s.,]+) cm$/u.exec(normalized);
    if (match) return (language === "en" ? "Wall thickness: " : "Wandstärke: ") + formatHu(match[1], language, 0) + " cm";
    match = /^([\d\s.,]+) m²$/u.exec(normalized);
    if (match) return formatHu(match[1], language, 2) + " m²";
    match = /^([\d\s.,]+) cm$/u.exec(normalized);
    if (match) return formatHu(match[1], language, 0) + " cm";
    match = /^([\d\s.,]+) db\/m²$/u.exec(normalized);
    if (match) return formatHu(match[1], language, 0) + (language === "en" ? " bricks/m²" : " Ziegel/m²");
    match = /^([\d\s.,]+) db$/u.exec(normalized);
    if (match) return formatHu(match[1], language, 0) + (language === "en" ? " bricks" : " Ziegel");
    match = /^([\d\s.,]+) Ft$/u.exec(normalized);
    if (match) return formatHu(match[1], language, 0) + " HUF";
    match = /^([\d\s.,]+) raklap \/ ([\d\s.,]+) db$/u.exec(normalized);
    if (match) {
      return formatHu(match[1], language, 0) + (language === "en" ? " pallets / " : " Paletten / ") +
        formatHu(match[2], language, 0) + (language === "en" ? " bricks" : " Ziegel");
    }
    match = /^([\d\s.,]+)% ráhagyással$/u.exec(normalized);
    if (match) return language === "en"
      ? "With a " + formatHu(match[1], language, 0) + "% allowance, we recommend purchasing"
      : "Mit " + formatHu(match[1], language, 0) + " % Zuschlag empfehlen wir den Kauf von";

    return null;
  }

  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source);
    if (language === "en") {
      url.searchParams.set("subject", "Error report – Brick Calculator");
      url.searchParams.set("body", "Calculator: Brick Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/tegla-kalkulator.html\n\nBriefly describe the issue:\n");
    } else {
      url.searchParams.set("subject", "Fehlermeldung – Ziegelrechner");
      url.searchParams.set("body", "Rechner: Ziegelrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/tegla-kalkulator.html\n\nBeschreibe den Fehler kurz:\n");
    }
    return url.toString();
  }

  return {
    page,
    pages: Object.freeze([page]),
    dictionaries: Object.freeze({ [page]: dictionary }),
    dictionary,
    supported,
    translate,
    reportHref
  };
});

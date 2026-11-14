/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "vakolat-kalkulator";
  const main = doc.querySelector('main[data-simple-calc="vakolat-kalkulator"]');
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
  const page = "vakolat-kalkulator";
  const entries = [
    ["Részletes anyagtervező", "Detailed material planner", "Detaillierter Materialplaner"],
    ["Ajtók összes felülete (m²)", "Total door area (m²)", "Gesamtfläche der Türen (m²)"],
    ["Ablakok összes felülete (m²)", "Total window area (m²)", "Gesamtfläche der Fenster (m²)"],
    ["Egyéb kivonható felület (m²)", "Other area to subtract (m²)", "Sonstige abzuziehende Fläche (m²)"],
    ["Anyagveszteség", "Material allowance", "Materialzuschlag"],
    ["5% – egyszerű, kevés vágás", "5% – simple layout, few cuts", "5 % – einfache Verlegung, wenige Schnitte"],
    ["8% – általános", "8% – typical", "8 % – üblich"],
    ["12% – sok vágás / mintázat", "12% – many cuts / pattern", "12 % – viele Schnitte / Muster"],
    ["15% – bonyolult felület", "15% – complex area", "15 % – komplexe Fläche"],
    ["Nem – előbb ellenőrzöm az adatlapot", "No – I will check the data sheet first", "Nein – zuerst prüfe ich das Datenblatt"],
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
    ["A képlet", "Formula", "Formel"],
    ["Példa", "Example", "Beispiel"],
    ["Gyakori hibák", "Common mistakes", "Häufige Fehler"],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["Miért lehet több a valós fogyás?", "Why might actual consumption be higher?", "Warum kann der tatsächliche Verbrauch höher sein?"],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["Festék kalkulátor", "Paint Calculator", "Farbrechner"],
    ["Hőszigetelés", "Insulation", "Wärmedämmung"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"],
    ["2026. július 1.", "1 July 2026", "1. Juli 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"],
    ["Az eredmény a megadott méretek és anyagjellemzők alapján készült becslés. Beszerzés előtt ellenőrizd a gyártói kiadósságot, a helyszíni adottságokat és a szükséges ráhagyást.", "The result is an estimate based on the dimensions and material properties entered. Before buying, check the manufacturer's coverage data, site conditions and the allowance required.", "Das Ergebnis ist eine Schätzung anhand der eingegebenen Maße und Materialeigenschaften. Prüfe vor dem Kauf die Herstellerangaben zum Verbrauch, die Bedingungen vor Ort und den benötigten Zuschlag."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.", "Found an error? Let us know.", "Fehler gefunden? Melde ihn uns."],
    ["Értelmezés", "Interpretation", "Einordnung"],
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
    ["hu-HU", "en-GB", "de-DE"],
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
    ["Becsüld meg a vakolat vagy glettanyag mennyiségét felület és rétegvastagság alapján.", "Estimate plaster or filler quantities from surface area and layer thickness.", "Schätze die Menge an Putz oder Spachtelmasse anhand von Fläche und Schichtdicke."],
    ["Vakolat- és glettanyag-tervező", "Plaster and filler material planner", "Materialplaner für Putz und Spachtelmasse"],
    ["A kalkulátor kezeli a kg/m²/mm és a közvetlen kg/m² gyártói adatokat is. Előbb válaszd ki az adatlap egységét, majd ellenőrizd a termék kiadósságát és kiszerelését.", "The calculator handles both kg/m²/mm and direct kg/m² manufacturer data. First select the data sheet unit, then verify the product consumption and bag size.", "Der Rechner verarbeitet sowohl Herstellerangaben in kg/m²/mm als auch direkte Werte in kg/m². Wähle zuerst die Einheit des Datenblatts und prüfe anschließend Verbrauch und Gebindegröße des Produkts."],
    ["Teljes falfelület (m²)", "Total wall area (m²)", "Gesamte Wandfläche (m²)"],
    ["Átlagos rétegvastagság (mm)", "Average layer thickness (mm)", "Durchschnittliche Schichtdicke (mm)"],
    ["Csak a kg/m²/mm módban vesz részt az anyagigény számításában.", "Only used to calculate material quantities in kg/m²/mm mode.", "Wird nur im Modus kg/m²/mm zur Berechnung des Materialbedarfs verwendet."],
    ["Gyártói anyagszükséglet egysége", "Manufacturer consumption unit", "Einheit des Herstellerverbrauchs"],
    ["kg/m²/mm – rétegvastagsággal szorzandó", "kg/m²/mm – multiply by layer thickness", "kg/m²/mm – mit Schichtdicke multiplizieren"],
    ["kg/m² – közvetlen gyártói érték", "kg/m² – direct manufacturer value", "kg/m² – direkter Herstellerwert"],
    ["Példa minimum anyagszükséglet", "Example minimum consumption", "Beispiel für den Mindestverbrauch"],
    ["A számérték egységét a fenti mód határozza meg; írd át a kiválasztott termék adatlapja szerint.", "The mode above determines the unit of this value; replace it with the selected product’s data sheet value.", "Der oben gewählte Modus bestimmt die Einheit dieses Werts. Ersetze ihn durch die Angabe im Datenblatt des gewählten Produkts."],
    ["Példa maximum anyagszükséglet", "Example maximum consumption", "Beispiel für den Höchstverbrauch"],
    ["Ha az adatlap egyetlen értéket ad meg, a minimum és maximum legyen azonos.", "If the data sheet gives a single value, enter the same minimum and maximum.", "Gibt das Datenblatt nur einen Wert an, trage denselben Mindest- und Höchstwert ein."],
    ["Példa zsákméret (kg)", "Example bag size (kg)", "Beispiel für den Sackinhalt (kg)"],
    ["A kiszerelés termékenként eltérhet.", "Bag sizes may vary by product.", "Die Gebindegröße kann je nach Produkt variieren."],
    ["Gyártói adatok ellenőrizve?", "Manufacturer data verified?", "Herstellerangaben geprüft?"],
    ["Igen – a választott termék adatlapja alapján", "Yes – based on the selected product’s data sheet", "Ja – anhand des Datenblatts des gewählten Produkts"],
    ["Vakolat- vagy glettanyag mennyiségének becslése", "Estimating plaster or filler quantities", "Menge an Putz oder Spachtelmasse schätzen"],
    ["A kalkulátor a felület, a tervezett rétegvastagság, a gyártó által megadott fajlagos anyagigény és a zsákméret alapján számol kilogrammot és teljes zsákszámot. Kézi vagy gépi vakolat, illetve megfelelő adatokkal más poranyag előzetes tervezésére használható.", "The calculator uses surface area, planned layer thickness, manufacturer consumption data and bag size to calculate kilograms and whole bags. It can help plan hand-applied or machine-applied plaster, or other powdered materials with suitable data.", "Der Rechner ermittelt Kilogramm und ganze Säcke anhand von Fläche, geplanter Schichtdicke, spezifischem Herstellerverbrauch und Sackinhalt. Er eignet sich zur Vorplanung von Hand- oder Maschinenputz sowie mit passenden Daten auch anderer Pulvermaterialien."],
    ["A legfontosabb bemenet a fogyási adat, amely termékenként eltér. Mindig a konkrét termék adatlapjának kg/m²/mm értékét használd.", "The most important input is consumption, which varies by product. Always use the kg/m²/mm value from the specific product’s data sheet.", "Die wichtigste Eingabe ist der produktspezifische Verbrauch. Verwende stets den kg/m²/mm-Wert aus dem Datenblatt des konkreten Produkts."],
    ["Anyag kg = felület × vastagság mm × fogyás kg/m²/mm", "Material kg = area × thickness in mm × consumption in kg/m²/mm", "Material kg = Fläche × Dicke in mm × Verbrauch in kg/m²/mm"],
    [". A zsákszám az össztömeg osztva a zsák tömegével, felfelé kerekítve.", ". Divide the total weight by the bag weight and round up to obtain whole bags.", ". Die Sackzahl ergibt sich aus Gesamtmasse geteilt durch Sackinhalt, auf ganze Säcke aufgerundet."],
    ["30 m² fal, 10 mm átlagvastagság és 1,4 kg/m²/mm fogyás esetén 420 kg anyag szükséges. 25 kg-os kiszerelésből ez 17 zsák.", "A 30 m² wall with an average thickness of 10 mm and consumption of 1.4 kg/m²/mm requires 420 kg of material. With 25 kg bags, this is 17 bags.", "Bei 30 m² Wandfläche, 10 mm durchschnittlicher Dicke und 1,4 kg/m²/mm Verbrauch werden 420 kg Material benötigt. Bei 25-kg-Säcken sind das 17 Säcke."],
    ["Az átlagvastagság szerepe", "Why average thickness matters", "Die Bedeutung der durchschnittlichen Schichtdicke"],
    ["Egyenetlen falnál a névleges 10 mm nem biztos, hogy valódi átlag. Mélyedések, javítások és lehulló anyag növelhetik a felhasználást. Nagyobb munkánál próbaszakasz vagy helyszíni felmérés pontosabb.", "On an uneven wall, a nominal 10 mm may not reflect the true average. Depressions, repairs and dropped material can increase consumption. For larger jobs, a trial area or site survey gives a better estimate.", "Bei unebenen Wänden entsprechen nominelle 10 mm nicht unbedingt dem tatsächlichen Durchschnitt. Vertiefungen, Ausbesserungen und herunterfallendes Material können den Verbrauch erhöhen. Bei größeren Arbeiten liefern eine Probefläche oder ein Aufmaß vor Ort genauere Werte."],
    ["A rétegvastagságot centiméterben adják meg milliméter helyett.", "Entering layer thickness in centimetres instead of millimetres.", "Die Schichtdicke wird in Zentimetern statt Millimetern eingegeben."],
    ["Más termék fogyási adatát használják.", "Using consumption data for a different product.", "Verbrauchsangaben eines anderen Produkts werden verwendet."],
    ["Nem számolnak az aljzat egyenetlenségével és veszteséggel.", "Ignoring uneven substrates and material losses.", "Unebenheiten des Untergrunds und Materialverluste werden nicht berücksichtigt."],
    ["A zsákszámot lefelé kerekítik.", "Rounding the number of bags down.", "Die Sackzahl wird abgerundet."],
    ["Glettre is használható?", "Can it also be used for filler?", "Auch für Spachtelmasse geeignet?"],
    ["Igen, ha a gyártó ugyanilyen egységben megadott fogyási adatát használod.", "Yes, provided you use the manufacturer’s consumption data in the same unit.", "Ja, wenn du die Verbrauchsangabe des Herstellers in derselben Einheit verwendest."],
    ["Ajtót és ablakot levonjak?", "Should I subtract doors and windows?", "Soll ich Türen und Fenster abziehen?"],
    ["Nagy nyílásokat igen, de kávák és javítások miatt maradjon tartalék.", "Subtract large openings, but leave an allowance for reveals and repairs.", "Ziehe große Öffnungen ab, plane aber einen Zuschlag für Laibungen und Ausbesserungen ein."],
    ["A vizet is számolja?", "Does it also calculate water?", "Wird auch das Wasser berechnet?"],
    ["Nem, a keverővíz mennyiségét a gyártó zsákonként adja meg.", "No. The manufacturer specifies mixing water per bag.", "Nein. Der Hersteller gibt die Anmachwassermenge je Sack an."],
    ["Felületi egyenetlenség, vastagabb réteg és kivitelezési veszteség miatt.", "Uneven surfaces, thicker layers and application losses can increase consumption.", "Durch Unebenheiten, größere Schichtdicken und Verluste bei der Verarbeitung."],
    ["Gipszkarton", "Plasterboard", "Gipskarton"],
    ["Rétegvastagság-térkép", "Layer thickness map", "Schichtdickenübersicht"],
    ["Egyetlen falon belül is eltérhet az anyagigény", "Material requirements can vary across a single wall", "Der Materialbedarf kann schon innerhalb einer Wand variieren"],
    ["Vakolatnál és vastagabb kiegyenlítő rétegnél a síkpontatlanság miatt a tényleges átlagvastagság fontosabb lehet, mint egyetlen névleges érték. Mérj több ponton.", "For plaster and thicker levelling layers, unevenness can make the actual average thickness more important than a single nominal value. Measure at several points.", "Bei Putz und dickeren Ausgleichsschichten kann wegen Unebenheiten die tatsächliche Durchschnittsdicke wichtiger sein als ein einzelner Nennwert. Miss an mehreren Stellen."],
    ["1. mérési pont (mm)", "Measurement point 1 (mm)", "Messpunkt 1 (mm)"],
    ["2. mérési pont (mm)", "Measurement point 2 (mm)", "Messpunkt 2 (mm)"],
    ["3. mérési pont (mm)", "Measurement point 3 (mm)", "Messpunkt 3 (mm)"],
    ["Átlagos mért vastagság", "Average measured thickness", "Durchschnittliche gemessene Dicke"],
    ["Legnagyobb eltérés", "Maximum variation", "Größte Abweichung"],
    ["Érdemes több ponton mérni", "Measure at more points", "An weiteren Stellen messen"],
    ["Viszonylag egyenletes minta", "Relatively uniform sample", "Relativ gleichmäßige Stichprobe"],
    ["Nagy eltérés – helyszíni rétegvastagság-terv indokolt", "Large variation – plan layer thicknesses on site", "Große Abweichung – Schichtdicken vor Ort planen"],
    ["A szükséges alapozó, tapadóhíd, élvédő, háló vagy több munkamenet anyagigénye nincs automatikusan benne a vakolat tömegében.", "The plaster weight does not automatically include primer, bonding agents, corner beads, mesh or material needed for additional work stages.", "Die Putzmasse enthält nicht automatisch die benötigten Mengen an Grundierung, Haftbrücke, Eckschutz, Gewebe oder Material für weitere Arbeitsgänge."],
    ["Mitől függ igazán a vakolat anyagigénye?", "What determines plaster consumption?", "Wovon hängt der Putzbedarf ab?"],
    ["A nettó felületet megszorozza a rétegvastagsággal és a megadott kg/m²/mm fogyással, majd külön ráhagyást és zsákméretet alkalmaz. Minimum–maximum fogyási tartományt is tud kezelni, ezért nem kényszerít egyetlen univerzális kiadósságot minden termékre.", "It multiplies net area by layer thickness and the specified kg/m²/mm consumption, then applies an allowance and bag size. It also handles minimum–maximum consumption ranges, rather than assuming one universal consumption value for all products.", "Die Nettofläche wird mit Schichtdicke und angegebenem Verbrauch in kg/m²/mm multipliziert; anschließend werden Zuschlag und Sackinhalt berücksichtigt. Auch Mindest- und Höchstverbrauch lassen sich angeben, sodass nicht für alle Produkte ein einziger universeller Verbrauch angenommen wird."],
    ["A fogyási értéket, megengedett rétegvastagságot és kiszerelést a konkrét vakolat gyártói adatlapjából írd be. Ezek termékenként jelentősen eltérhetnek.", "Enter consumption, permitted layer thickness and bag size from the specific plaster manufacturer’s data sheet. These can differ considerably between products.", "Übernimm Verbrauch, zulässige Schichtdicke und Gebindegröße aus dem Herstellerdatenblatt des konkreten Putzes. Diese Angaben können je nach Produkt erheblich abweichen."],
    ["Alap- vagy gipszvakolatnál gyakori a kg/m²/mm adat: ilyenkor a kalkulátor a megadott rétegvastagsággal is szoroz.", "Base coats and gypsum plasters often specify kg/m²/mm: in this mode, the calculator also multiplies by the layer thickness entered.", "Bei Grund- oder Gipsputz ist kg/m²/mm üblich: In diesem Modus multipliziert der Rechner auch mit der eingegebenen Schichtdicke."],
    ["Dekor- és vékonyvakolatnál gyakori a közvetlen kg/m² adat: ebben a módban a rétegvastagságot nem szorozzuk rá még egyszer.", "Decorative and thin-layer renders often specify kg/m² directly: in this mode, layer thickness is not multiplied again.", "Bei Dekor- und Dünnschichtputzen ist die direkte Angabe in kg/m² üblich: In diesem Modus wird die Schichtdicke nicht nochmals multipliziert."],
    ["Nem méri fel a fal egyenetlenségéből adódó helyi többletvastagságot.", "It does not assess local extra thickness caused by wall unevenness.", "Örtlich erforderliche Mehrdicken durch Wandunebenheiten werden nicht erfasst."],
    ["Nem választ alapozót, hálót vagy rétegrendet.", "It does not select primer, mesh or a layer system.", "Grundierung, Gewebe oder Schichtaufbau werden nicht ausgewählt."],
    ["A rendelési becslés csak ellenőrzött gyártói fajlagos adatokkal értelmezhető.", "The order estimate is meaningful only with verified manufacturer consumption data.", "Die Bestellschätzung ist nur mit geprüften spezifischen Herstellerangaben aussagekräftig."],
    ["Vakolat kalkulátor", "Plaster Calculator", "Putzrechner"],
    ["Fogyási mód", "Consumption mode", "Verbrauchsmodus"],
    ["kg/m²/mm × rétegvastagság", "kg/m²/mm × layer thickness", "kg/m²/mm × Schichtdicke"],
    ["Nettó vakolandó felület", "Net area to plaster", "Nettofläche zum Verputzen"],
    ["Nettó anyagigény", "Net material requirement", "Nettomaterialbedarf"],
    ["Vásárolandó anyag", "Material to purchase", "Zu kaufendes Material"],
    ["Szükséges zsák", "Bags required", "Benötigte Säcke"],
    ["Ismeretlen vakolat-anyagszükséglet egység.", "Unknown plaster consumption unit.", "Unbekannte Einheit für den Putzverbrauch."],
    ["A rendelési becslés előtt ellenőrizd és erősítsd meg a választott vakolat gyártói kiadósságát és kiszerelését.", "Before estimating an order, check and confirm the selected plaster’s manufacturer consumption data and bag size.", "Prüfe und bestätige vor der Bestellschätzung Herstellerverbrauch und Gebindegröße des gewählten Putzes."],
    ["A nettó felületnek pozitívnak kell maradnia.", "The net area must remain positive.", "Die Nettofläche muss positiv bleiben."],
    ["A minimum kiadósság nem lehet nagyobb a maximumnál.", "The minimum consumption must not exceed the maximum.", "Der Mindestverbrauch darf den Höchstverbrauch nicht überschreiten."],
    ["Vakolat kalkulátor | Habarcs- és anyagszükséglet", "Plaster Calculator | Mortar and Material Quantities", "Putzrechner | Mörtel- und Materialbedarf"],
    ["Vakolat kalkulátor falfelület, rétegvastagság és anyagkiadósság alapján. Becsüld meg a szükséges szárazhabarcs mennyiségét ráhagyással.", "Plaster calculator using wall area, layer thickness and consumption data. Estimate dry mortar quantities with an allowance.", "Putzrechner anhand von Wandfläche, Schichtdicke und Verbrauch. Schätze die benötigte Trockenmörtelmenge mit Zuschlag."],
    ["hu-HU", "en-GB", "de-DE"],
    ["Az eredmény a számítás után jelenik meg.", "The result will appear after calculation.", "Das Ergebnis erscheint nach der Berechnung."],
    ["A számítás nem végezhető el.", "The calculation cannot be completed.", "Die Berechnung kann nicht durchgeführt werden."]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  const labels = {"Falfelület": ["Wall area", "Wandfläche"], "Ajtó": ["Doors", "Türen"], "Ablak": ["Windows", "Fenster"], "Egyéb kivonás": ["Other deductions", "Sonstige Abzüge"], "Rétegvastagság": ["Layer thickness", "Schichtdicke"], "Minimum kiadósság": ["Minimum consumption", "Mindestverbrauch"], "Maximum kiadósság": ["Maximum consumption", "Höchstverbrauch"], "Anyagveszteség": ["Material loss", "Materialverlust"], "Zsákméret": ["Bag size", "Sackinhalt"]};
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
    let match = /^(\d[\d\s]*(?:,\d+)?)(?:–(\d[\d\s]*(?:,\d+)?))?(?: (m²|kg|mm|db))?$/u.exec(normalized);
    if (match) {
      const value = number(match[1], language) + (match[2] ? "–" + number(match[2], language) : "");
      return value + (match[3] === "db" ? (language === "en" ? " bags" : " Säcke") : match[3] ? " " + match[3] : "");
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
    url.searchParams.set("subject", language === "en" ? "Error report – Plaster Calculator" : "Fehlermeldung – Putzrechner");
    url.searchParams.set("body", language === "en" ? "Calculator: Plaster Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/vakolat-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Putzrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/vakolat-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const doc = root.document, page = "vizfogyasztas-kalkulator", main = doc.querySelector('main[data-simple-calc="vizfogyasztas-kalkulator"]');
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
  const page = "vizfogyasztas-kalkulator";
  const entries = [
    ["Minden mezőben érvényes szám szerepeljen", "Enter a valid number in every field.", "Gib in jedem Feld eine gültige Zahl ein."],
    ["Az értékek nem lehetnek negatívak", "Values must not be negative.", "Die Werte dürfen nicht negativ sein."],
    ["Testsúly (kg)", "Weight (kg)", "Gewicht (kg)"],
    ["Eredmény:", "Result:", "Ergebnis:"],
    ["Az értékek legyenek nagyobbak nullánál", "All values must be greater than zero.", "Alle Werte müssen größer als null sein."],
    ["Hasznos volt ez a kalkulátor?", "Was this calculator useful?", "War dieser Rechner hilfreich?"],
    ["Ne keresd újra. Mentsd le. Használd.", "Don't search again. Save it. Use it.", "Nicht erneut suchen. Speichern. Wiederverwenden."],
    ["Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "Save Kalkulátor Bázis so you can return to this calculation in one click, or share it with someone who may find it useful.", "Speichere Kalkulátor Bázis, damit du mit einem Klick zu dieser Berechnung zurückkehren kannst, oder teile sie mit jemandem, für den sie nützlich sein könnte."],
    ["Mentési, telepítési és megosztási műveletek", "Bookmarking, installation and sharing actions", "Aktionen zum Speichern, Installieren und Teilen"],
    ["Könyvjelzőzöm", "Bookmark", "Lesezeichen"],
    ["Telepítem", "Install", "Installieren"],
    ["Megosztom", "Share", "Teilen"],
    ["Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.", "Open your browser menu and look for Bookmark, Favorites or Save.", "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."],
    ["Másold ki ezt a hivatkozást, és küldd tovább.", "Copy this link and share it.", "Kopiere diesen Link und teile ihn."],
    ["Gyakori hibák", "Common mistakes", "Häufige Fehler"],
    ["Gyakori kérdések", "Frequently asked questions", "Häufige Fragen"],
    ["Kapcsolódó kalkulátorok", "Related calculators", "Verwandte Rechner"],
    ["Kalória kalkulátor", "Calorie Calculator", "Kalorienrechner"],
    ["BMR kalkulátor", "BMR Calculator", "BMR-Rechner"],
    ["Utolsó tartalmi frissítés:", "Last content update:", "Letzte inhaltliche Aktualisierung:"],
    ["2026. augusztus 8.", "8 August 2026", "8. August 2026"],
    ["Hitelesség és számítási korlátok", "Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"],
    ["Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.", "The result is for general information only. It is not a diagnosis and does not replace a medical examination or personalised treatment advice.", "Das Ergebnis dient der allgemeinen Information. Es ist keine Diagnose und ersetzt weder eine ärztliche Untersuchung noch eine individuelle Behandlungsempfehlung."],
    ["A számítások módszertana és minőségbiztosítása", "Calculation methodology and quality assurance", "Berechnungsmethodik und Qualitätssicherung"],
    ["Hibát találtál? Jelezd nekünk.", "Found an issue? Let us know.", "Einen Fehler gefunden? Sag uns Bescheid."],
    ["Forrás és ellenőrzési alap", "Sources and review basis", "Quellen und Prüfgrundlage"],
    ["A kalkulátor tájékoztató segédlet; egyedi egészségügyi vagy jogi döntést nem helyettesít.", "This calculator is an informational aid; it does not replace individual health or legal advice.", "Dieser Rechner dient der Information und ersetzt keine individuelle medizinische oder rechtliche Beratung."],
    ["Források és módszertani ellenőrzés", "Sources and methodology review", "Quellen und methodische Prüfung"],
    ["Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.", "This is an informational calculator; consult a professional or official source for individual decisions.", "Dieser Rechner dient der Information. Für individuelle Entscheidungen sind Fachleute oder offizielle Stellen heranzuziehen."],
    ["Módszertani frissítés:", "Methodology updated:", "Methodisch aktualisiert:"],
    ["2026. július 15.", "15 July 2026", "15. Juli 2026"],
    ["Egészség és sport kalkulátorok", "Health and fitness calculators", "Rechner für Gesundheit und Fitness"],
    ["Főoldal", "Home", "Startseite"],
    ["Egészség & sport", "Health & fitness", "Gesundheit & Fitness"],
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
    ["Vízfogyasztás kalkulátor", "Water Intake Calculator", "Trinkmengenrechner"],
    ["Vízfogyasztás kalkulátor | Napi folyadékigény becslése", "Water Intake Calculator | Estimate Daily Fluid Needs", "Trinkmengenrechner | Täglichen Flüssigkeitsbedarf schätzen"],
    ["Vízfogyasztás kalkulátor testsúly és aktivitás alapján. Becsüld meg a napi folyadékbevitelt, és ismerd meg, mi módosíthatja a folyadékigényt.", "Estimate daily fluid intake from body weight and activity, and learn which factors can affect your fluid needs.", "Schätze die tägliche Flüssigkeitszufuhr anhand von Körpergewicht und Aktivität und erfahre, welche Faktoren den Flüssigkeitsbedarf beeinflussen können."],
    ["Vízfogyasztás kalkulátor testsúly és aktivitás alapján, gyakorlati útmutatóval és fontos korlátokkal.", "Water intake calculator based on body weight and activity, with practical guidance and important limitations.", "Trinkmengenrechner anhand von Körpergewicht und Aktivität mit praktischen Hinweisen und wichtigen Einschränkungen."],
    ["Becsüld meg a napi ajánlott folyadékbevitelt testsúly és aktivitás alapján.", "Estimate the recommended daily fluid intake from body weight and activity.", "Schätze die empfohlene tägliche Flüssigkeitszufuhr anhand von Körpergewicht und Aktivität."],
    ["Becsüld meg a napi folyadékigényt testsúly és aktivitás alapján.", "Estimate daily fluid needs from body weight and activity.", "Schätze den täglichen Flüssigkeitsbedarf anhand von Körpergewicht und Aktivität."],
    ["Aktivitás pótlás (ml)", "Additional fluid for activity (ml)", "Zusätzliche Flüssigkeit bei Aktivität (ml)"],
    ["Napi folyadékigény: csak kiindulópont", "Daily fluid needs: a starting point only", "Täglicher Flüssigkeitsbedarf: nur ein Ausgangspunkt"],
    ["A kalkulátor testsúly alapján ad egy egyszerű napi becslést, amelyhez aktivitási pótlás adható. Ez segíthet tudatosabban figyelni a folyadékbevitelre, de nem tekinthető személyre szabott egészségügyi előírásnak.", "The calculator gives a simple daily estimate based on body weight, with an optional addition for activity. It can help you pay more attention to fluid intake, but it is not a personalised medical recommendation.", "Der Rechner liefert eine einfache tägliche Schätzung anhand des Körpergewichts, zu der ein Zuschlag für Aktivität addiert werden kann. Das kann helfen, bewusster auf die Flüssigkeitszufuhr zu achten, ist aber keine individuelle medizinische Empfehlung."],
    ["A tényleges szükségletet jelentősen módosíthatja a hőség, fizikai munka, sport, izzadás, láz, hasmenés, hányás, várandósság, szoptatás, étrend, gyógyszerek, valamint egyes szív- és vesebetegségek.", "Actual needs can change considerably with heat, physical work, exercise, sweating, fever, diarrhoea, vomiting, pregnancy, breastfeeding, diet, medication and certain heart or kidney conditions.", "Der tatsächliche Bedarf kann sich durch Hitze, körperliche Arbeit, Sport, Schwitzen, Fieber, Durchfall, Erbrechen, Schwangerschaft, Stillzeit, Ernährung, Medikamente sowie bestimmte Herz- und Nierenerkrankungen erheblich verändern."],
    ["Hogyan számol?", "How does it calculate the estimate?", "Wie wird die Schätzung berechnet?"],
    ["A kalkulátor alapként", "The calculator uses a baseline of", "Der Rechner verwendet als Ausgangswert"],
    ["35 ml × testsúlykilogramm", "35 ml × body weight in kilograms", "35 ml × Körpergewicht in Kilogramm"],
    ["értéket használ, majd hozzáadja az aktivitáshoz megadott millilitert. A „pohár” átváltás 250 ml-es pohárral számol. Ez egy könnyen használható becslés, nem mindenkire érvényes hivatalos norma.", "and then adds the millilitres entered for activity. The glass conversion assumes a 250 ml glass. This is a convenient estimate, not an official standard that applies to everyone.", "und addiert anschließend die für Aktivität eingegebene Menge in Millilitern. Bei der Umrechnung in Gläser wird mit 250 ml pro Glas gerechnet. Dies ist eine einfache Schätzung und keine für alle gültige offizielle Vorgabe."],
    ["Példa 70 kg testsúlynál", "Example for a body weight of 70 kg", "Beispiel bei 70 kg Körpergewicht"],
    ["70 × 35 ml = 2 450 ml. Ha egy aktívabb napra 500 ml pótlást adsz hozzá, az eredmény 2,95 liter, vagyis nagyjából 12 darab 250 ml-es pohár.", "70 × 35 ml = 2,450 ml. Adding 500 ml for a more active day gives 2.95 litres, or approximately 12 glasses of 250 ml each.", "70 × 35 ml = 2.450 ml. Mit einem Zuschlag von 500 ml für einen aktiveren Tag ergeben sich 2,95 Liter, also ungefähr 12 Gläser mit je 250 ml."],
    ["Mi számít bele a folyadékbevitelbe?", "What counts towards fluid intake?", "Was zählt zur Flüssigkeitszufuhr?"],
    ["Nem csak a tiszta víz számít. Tea, kávé, tej, levesek, gyümölcsök és más magas víztartalmú élelmiszerek is hozzájárulhatnak a teljes bevitelhez. Ettől még a napi folyadék nagy részét célszerű egyszerű, alacsony energiatartalmú italokból fedezni.", "Plain water is not the only source. Tea, coffee, milk, soups, fruit and other water-rich foods can also contribute to total intake. Even so, simple, low-calorie drinks are a sensible choice for most of your daily fluid intake.", "Nicht nur reines Wasser zählt. Auch Tee, Kaffee, Milch, Suppen, Obst und andere wasserreiche Lebensmittel können zur gesamten Zufuhr beitragen. Dennoch ist es sinnvoll, den größten Teil der täglichen Trinkmenge durch einfache, energiearme Getränke abzudecken."],
    ["Edzés és meleg idő", "Exercise and hot weather", "Sport und heißes Wetter"],
    ["Sport és hőség alatt a folyadékigény nem csak az időtartamtól, hanem az izzadás mértékétől is függ. Két azonos testsúlyú ember ugyanazon az edzésen is eltérő mennyiséget veszíthet. Hosszabb, intenzív terhelésnél az elektrolitok pótlása is szempont lehet, nem csak a vízmennyiség.", "During exercise and in hot weather, fluid needs depend on sweating as well as duration. Two people of the same body weight can lose different amounts during the same workout. During prolonged, intense activity, electrolyte replacement may also matter, alongside the amount of water.", "Bei Sport und Hitze hängt der Flüssigkeitsbedarf nicht nur von der Dauer, sondern auch vom Ausmaß des Schwitzens ab. Zwei Menschen mit gleichem Körpergewicht können beim selben Training unterschiedliche Mengen verlieren. Bei längerer intensiver Belastung kann neben der Wassermenge auch der Elektrolytersatz eine Rolle spielen."],
    ["Honnan tudhatod, hogy elég-e?", "How can you tell whether it is enough?", "Woran erkennst du, ob es ausreicht?"],
    ["A szomjúság, a közérzet, a vizelet mennyisége és színe együtt adhat durva visszajelzést, de egyik sem tökéletes mérőszám. Vitaminok, gyógyszerek, bizonyos ételek és betegségek is megváltoztathatják a vizelet színét.", "Thirst, how you feel, and urine volume and colour can together provide a rough indication, but none is a perfect measure. Vitamins, medication, certain foods and illnesses can also change urine colour.", "Durst, Wohlbefinden sowie Menge und Farbe des Urins können gemeinsam einen groben Hinweis geben, sind aber keine perfekten Messgrößen. Auch Vitamine, Medikamente, bestimmte Lebensmittel und Erkrankungen können die Urinfarbe verändern."],
    ["A túl sok víz sem feltétlenül jobb", "More water is not necessarily better", "Mehr Wasser ist nicht unbedingt besser"],
    ["Nagy mennyiségű folyadék rövid idő alatt felboríthatja a szervezet só-víz egyensúlyát. Ezért nem cél a kalkulált napi mennyiséget minél gyorsabban elfogyasztani. Orvosi folyadékkorlátozás esetén mindig az egészségügyi utasítás az elsődleges.", "Drinking a large amount in a short time can disrupt the body’s salt and water balance. The aim is therefore not to consume the calculated daily amount as quickly as possible. If you have a medically prescribed fluid restriction, always follow that advice first.", "Große Flüssigkeitsmengen in kurzer Zeit können den Salz- und Wasserhaushalt des Körpers stören. Das Ziel ist daher nicht, die berechnete Tagesmenge möglichst schnell zu trinken. Bei einer ärztlich verordneten Flüssigkeitsbeschränkung haben die medizinischen Anweisungen immer Vorrang."],
    ["Az aktivitási pótlást literben írják be, miközben a mező millilitert kér.", "Entering the activity addition in litres when the field expects millilitres.", "Der Aktivitätszuschlag wird in Litern eingegeben, obwohl das Feld Milliliter verlangt."],
    ["Egyszerre próbálják meginni a teljes napi mennyiséget.", "Trying to drink the entire daily amount at once.", "Die gesamte Tagesmenge wird auf einmal getrunken."],
    ["Forró időben vagy betegség alatt változatlan célt használnak.", "Keeping the same target in hot weather or during illness.", "Bei Hitze oder Krankheit wird ein unveränderter Zielwert verwendet."],
    ["A kávét, teát vagy leveseket teljesen figyelmen kívül hagyják.", "Ignoring coffee, tea or soups entirely.", "Kaffee, Tee oder Suppen werden völlig außer Acht gelassen."],
    ["Orvosi folyadékkorlátozás mellett általános kalkulátort követnek.", "Following a general calculator despite a medically prescribed fluid restriction.", "Trotz ärztlich verordneter Flüssigkeitsbeschränkung wird ein allgemeiner Rechner befolgt."],
    ["Mikor kérj segítséget?", "When should you seek help?", "Wann solltest du Hilfe suchen?"],
    ["Tartós hányás, súlyos hasmenés, zavartság, ájulás, szokatlan gyengeség, nagyon kevés vizelet vagy más aggasztó tünet esetén ne csak kalkulátorra hagyatkozz.", "Do not rely solely on a calculator if you have persistent vomiting, severe diarrhoea, confusion, fainting, unusual weakness, very little urine or other worrying symptoms.", "Verlasse dich bei anhaltendem Erbrechen, schwerem Durchfall, Verwirrtheit, Ohnmacht, ungewöhnlicher Schwäche, sehr wenig Urin oder anderen besorgniserregenden Symptomen nicht allein auf einen Rechner."],
    ["A kávé beleszámít?", "Does coffee count?", "Zählt Kaffee mit?"],
    ["A folyadéktartalma hozzájárulhat a bevitelhez, de a teljes mennyiséget nem érdemes kizárólag koffeintartalmú italokból fedezni.", "Its fluid content can contribute to intake, but it is not advisable to get the entire amount exclusively from caffeinated drinks.", "Der Flüssigkeitsanteil kann zur Zufuhr beitragen; die gesamte Menge sollte jedoch nicht ausschließlich durch koffeinhaltige Getränke gedeckt werden."],
    ["Edzéshez mennyit adjak hozzá?", "How much should I add for exercise?", "Wie viel sollte ich für Sport zusätzlich einplanen?"],
    ["Nincs egyetlen mindenkinél jó szám; az izzadás, a hőmérséklet, a terhelés intenzitása és időtartama számít.", "There is no single amount that suits everyone; sweating, temperature, exercise intensity and duration all matter.", "Es gibt keine einzelne Menge, die für alle passt; Schwitzen, Temperatur sowie Intensität und Dauer der Belastung spielen eine Rolle."],
    ["A vizelet színe jó támpont?", "Is urine colour a useful guide?", "Ist die Urinfarbe ein guter Anhaltspunkt?"],
    ["Durva jelzés lehet, de önmagában nem megbízható mérőeszköz.", "It can provide a rough indication, but it is not a reliable measure on its own.", "Sie kann einen groben Hinweis geben, ist für sich allein aber kein verlässliches Messinstrument."],
    ["Gyermeknél használható?", "Can it be used for children?", "Kann der Rechner für Kinder verwendet werden?"],
    ["Gyermekek folyadékigénye életkor- és állapotfüggő, ezért ehhez külön, életkornak megfelelő útmutató szükséges.", "Children’s fluid needs depend on their age and condition, so separate, age-appropriate guidance is needed.", "Der Flüssigkeitsbedarf von Kindern hängt von Alter und Gesundheitszustand ab; hierfür sind gesonderte, altersgerechte Empfehlungen erforderlich."],
    ["Miért nem mindig ugyanannyi a szükségletem?", "Why do my needs vary?", "Warum ist mein Bedarf nicht immer gleich?"],
    ["Mert a környezet, aktivitás, étrend és egészségi állapot naponta is változhat.", "Because your environment, activity, diet and health can change from day to day.", "Weil sich Umgebung, Aktivität, Ernährung und Gesundheitszustand von Tag zu Tag ändern können."],
    ["Pulzuszóna kalkulátor", "Heart Rate Zone Calculator", "Herzfrequenzzonen-Rechner"],
    ["Folyadékigény kontextusellenőrző", "Fluid needs context check", "Einordnung des Flüssigkeitsbedarfs"],
    ["Ne csak a testsúlyt nézd", "Look beyond body weight", "Betrachte nicht nur das Körpergewicht"],
    ["A napi folyadékigényt nem lehet mindenkinél egyetlen testsúlyszorzóval pontosan meghatározni. Jelöld, mely körülmények növelhetik a folyadékvesztést vagy változtathatják az egyéni igényt.", "A single body-weight multiplier cannot precisely determine everyone’s daily fluid needs. Select any circumstances that may increase fluid loss or change individual needs.", "Ein einzelner Körpergewichtsfaktor kann den täglichen Flüssigkeitsbedarf nicht bei allen Menschen genau bestimmen. Markiere Umstände, die den Flüssigkeitsverlust erhöhen oder den individuellen Bedarf verändern können."],
    ["Meleg környezet / erős izzadás", "Hot environment / heavy sweating", "Warme Umgebung / starkes Schwitzen"],
    ["Hosszabb vagy intenzív fizikai aktivitás", "Prolonged or intense physical activity", "Längere oder intensive körperliche Aktivität"],
    ["Láz, hányás vagy hasmenés", "Fever, vomiting or diarrhoea", "Fieber, Erbrechen oder Durchfall"],
    ["Várandósság vagy szoptatás", "Pregnancy or breastfeeding", "Schwangerschaft oder Stillzeit"],
    ["Olyan betegség/gyógyszer, amely a folyadékháztartást érintheti", "A condition or medication that may affect fluid balance", "Eine Erkrankung oder ein Medikament, die beziehungsweise das den Flüssigkeitshaushalt beeinflussen kann"],
    ["Nem jelöltél külön módosító körülményt. A fő kalkulátor eredménye továbbra is tájékoztató becslés.", "You have not selected any modifying circumstances. The main calculator’s result remains an indicative estimate.", "Du hast keine besonderen Einflussfaktoren ausgewählt. Das Ergebnis des Hauptrechners bleibt eine unverbindliche Schätzung."],
    ["A National Academies „total water” értékei az italokból és ételekből származó vizet együtt értik, és nem minden emberre előírt pontos napi célt jelentenek.", "The National Academies’ “total water” values include water from both drinks and food and are not exact daily targets prescribed for every individual.", "Die „Total Water“-Werte der National Academies umfassen Wasser aus Getränken und Lebensmitteln und sind keine für jede Person vorgeschriebenen exakten Tagesziele."],
    ["Folyadékigény tartományként, nem egyetlen igazságként", "Fluid needs as a range, not a single definitive value", "Flüssigkeitsbedarf als Spanne statt als einzelner verbindlicher Wert"],
    ["A testsúlyalapú eredmény csak tervezési tartomány. Az étellel bevitt víz, hőség, sport, terhesség, szoptatás, betegség és gyógyszerek módosíthatják.", "The body-weight-based result is only a planning range. Water from food, heat, exercise, pregnancy, breastfeeding, illness and medication can change it.", "Das gewichtsbezogene Ergebnis ist nur eine Planungsspanne. Wasser aus Lebensmitteln, Hitze, Sport, Schwangerschaft, Stillzeit, Erkrankungen und Medikamente können sie verändern."],
    ["Testsúly", "Body weight", "Körpergewicht"],
    ["Edzés miatti plusz (ml)", "Exercise addition (ml)", "Zuschlag für Sport (ml)"],
    ["Hőség miatti plusz (ml)", "Heat addition (ml)", "Zuschlag bei Hitze (ml)"],
    ["Élethelyzet", "Life stage", "Lebensphase"],
    ["Általános felnőtt", "General adult", "Erwachsene allgemein"],
    ["Várandósság – tájékoztató plusz", "Pregnancy – indicative addition", "Schwangerschaft – unverbindlicher Zuschlag"],
    ["Szoptatás – tájékoztató plusz", "Breastfeeding – indicative addition", "Stillzeit – unverbindlicher Zuschlag"],
    ["Tájékoztató ital-tartomány", "Indicative fluid intake range", "Unverbindliche Trinkmengenspanne"],
    ["Plusz korrekció", "Additional adjustment", "Zusätzliche Anpassung"],
    ["2,5 dl-es poharak", "250 ml glasses", "Gläser mit 250 ml"],
    ["Szív-, vese- vagy májbetegség, ödéma, vízhajtó kezelés vagy orvos által előírt folyadékkorlátozás esetén ezt a kalkulátort ne használd személyes célérték meghatározására.", "Do not use this calculator to set a personal target if you have heart, kidney or liver disease, oedema, diuretic treatment or a medically prescribed fluid restriction.", "Verwende diesen Rechner bei Herz-, Nieren- oder Lebererkrankungen, Ödemen, einer Behandlung mit Diuretika oder einer ärztlich verordneten Flüssigkeitsbeschränkung nicht zur Festlegung eines persönlichen Zielwerts."],
    ["Általános becslésként kezeld a fő kalkulátor eredményét.", "Treat the main calculator’s result as a general estimate.", "Betrachte das Ergebnis des Hauptrechners als allgemeine Schätzung."],
    ["Itt ne automatikusan emeld a folyadékot: egyes betegségek és gyógyszerek miatt személyre szabott orvosi javaslat lehet szükséges.", "Do not automatically increase fluid intake here: certain conditions and medications may require personalised medical advice.", "Erhöhe die Flüssigkeitszufuhr hier nicht automatisch: Bestimmte Erkrankungen und Medikamente können eine individuelle ärztliche Empfehlung erforderlich machen."],
    ["Becsült napi folyadék", "Estimated daily fluid intake", "Geschätzte tägliche Flüssigkeitszufuhr"],
    ["Ez 2,5 dl-es poharakban", "Equivalent in 250 ml glasses", "Entspricht Gläsern mit 250 ml"],
    ["National Academies – Dietary Reference Intakes for Water", "National Academies – Dietary Reference Intakes for Water", "National Academies – Dietary Reference Intakes for Water"],
    ["EFSA – Dietary Reference Values for water", "EFSA – Dietary Reference Values for water", "EFSA – Dietary Reference Values for water"],
    ["NHS – Water, drinks and hydration", "NHS – Water, drinks and hydration", "NHS – Water, drinks and hydration"]
  ];
  const dictionary = Object.freeze(Object.fromEntries(entries.map(([source, en, de]) => [source, [en, de]])));
  const supported = Object.freeze(["hu", "en", "de"]), reverse = new Map();
  for (const [source, pair] of Object.entries(dictionary)) for (const localized of pair) if (localized !== source && !reverse.has(localized)) reverse.set(localized, source);
  function format(raw, language) {
    const value = Number(raw.replace(/\s/gu, "").replace(",", "."));
    const digits = raw.includes(",") ? raw.split(",")[1].length : 0;
    return new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  }
  function translate(scope, value, language) {
    if (scope !== page || typeof value !== "string" || !supported.includes(language)) return null;
    const normalized = value.trim().replace(/\s+/gu, " ");
    if (language === "hu") return reverse.get(normalized) ?? null;
    const pair = dictionary[normalized] || dictionary[reverse.get(normalized)]; if (pair) return pair[language === "en" ? 0 : 1];
    if (normalized.endsWith(":")) {
      const source = normalized.slice(0, -1);
      const base = dictionary[source] || dictionary[reverse.get(source)];
      if (base) return base[language === "en" ? 0 : 1] + ":";
    }
    let match = /^(\d[\d\s]*(?:,\d+)?)(?:–(\d[\d\s]*(?:,\d+)?))? (liter\/nap|liter|pohár|ml)$/u.exec(normalized);
    if (match) {
      const amount = format(match[1], language) + (match[2] ? "–" + format(match[2], language) : "");
      const units = { "liter/nap": ["litres/day", "Liter/Tag"], "liter": ["litres", "Liter"], "pohár": ["glasses", "Gläser"], "ml": ["ml", "ml"] };
      return `${amount} ${units[match[3]][language === "en" ? 0 : 1]}`;
    }
    match = /^(\d+) olyan körülményt jelöltél, amely miatt a statikus alapbecslés kevésbé lehet pontos\. Figyeld a környezetet, terhelést és egyéni visszajelzéseket\.$/u.exec(normalized);
    if (match) return language === "en"
      ? `You selected ${match[1]} ${match[1] === "1" ? "circumstance" : "circumstances"} that may make the static baseline estimate less accurate. Consider your environment, exertion and individual feedback.`
      : `Du hast ${match[1]} ${match[1] === "1" ? "Umstand" : "Umstände"} ausgewählt, ${match[1] === "1" ? "der" : "die"} die statische Basisschätzung ungenauer machen ${match[1] === "1" ? "kann" : "können"}. Achte auf Umgebung, Belastung und individuelle Rückmeldungen.`;
    return null;
  }
  function reportHref(source, language) {
    if (language === "hu" || !supported.includes(language)) return source;
    const url = new URL(source); url.searchParams.set("subject", language === "en" ? "Error report – Water Intake Calculator" : "Fehlermeldung – Trinkmengenrechner");
    if (url.searchParams.has("body")) url.searchParams.set("body", language === "en" ? "Calculator: Water Intake Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/vizfogyasztas-kalkulator.html\n\nBrief description of the issue:\n" : "Rechner: Trinkmengenrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/vizfogyasztas-kalkulator.html\n\nKurze Beschreibung des Fehlers:\n");
    return url.toString();
  }
  return { pages: Object.freeze([page]), dictionaries: Object.freeze({ [page]: dictionary }), dictionary, supported, translate, reportHref };
});

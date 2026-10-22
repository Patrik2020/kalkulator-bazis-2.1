/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const document = root.document;
  const main = document.querySelector("main[data-simple-calc]");
  if (!main) return;
  const page = main.dataset.simpleCalc;
  if (!api.pages.includes(page)) return;

  const record = new WeakMap();
  const langRecords = new WeakMap();
  let selected = "hu";
  let rendering = false;

  function updateNode(node) {
    // Preserve option values used by the calculator. Options without an explicit
    // value derive it from their label and must not be translated here.
    if (node.parentElement?.tagName === "OPTION" && !node.parentElement.hasAttribute("value")) return;
    const value = node.nodeValue;
    const last = record.get(node);
    const source = last && last.rendered === value ? last.original : value;
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(source);
    if (!match || !match[2]) return;
    const translated = api.translate(page, match[2], selected);
    const target = match[1] + (translated === null ? match[2] : translated) + match[3];
    if (target !== value) node.nodeValue = target;
    if (translated !== null || last) {
      record.set(node, { original: source, rendered: target });
      const parent = node.parentElement;
      if (!langRecords.has(parent)) langRecords.set(parent, parent.getAttribute("lang"));
      if (translated !== null && selected !== "hu") parent.setAttribute("lang", selected);
      else {
        const originalLang = langRecords.get(parent);
        if (originalLang === null) parent.removeAttribute("lang");
        else if (originalLang !== undefined) parent.setAttribute("lang", originalLang);
      }
    }
  }

  function render() {
    if (rendering) return;
    rendering = true;
    try {
      // Product names are user data, even if they happen to match a UI phrase.
      if (page === "egysegar-kalkulator") {
        main.querySelectorAll("#kalkulator .everyday-result li strong").forEach((name) => name.setAttribute("translate", "no"));
      }
      const nodes = [];
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        if (!node.parentElement?.closest('script,style,textarea,pre,code,[contenteditable],[translate="no"]')) updateNode(node);
      });
    } finally {
      rendering = false;
    }
  }

  function setLanguage(next) {
    selected = api.supported.includes(next) ? next : "hu";
    render();
  }
  document.addEventListener("kb:language-changed", (e) => setLanguage(e.detail?.language || "hu"));
  setLanguage(root.KB_SITE_LANGUAGE?.get() || "hu");
  const observer = new MutationObserver((list) => {
    if (!rendering && list.some((item) => item.type === "childList" || item.type === "characterData")) render();
  });
  observer.observe(main, { subtree: true, childList: true, characterData: true });
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const shared = Object.freeze({
    "Számítás": ["Calculate", "Berechnen"],
    "Összehasonlítás": ["Compare", "Vergleichen"],
    "Példa": ["Example", "Beispiel"],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "Gyakori kérdések": ["Frequently asked questions", "Häufige Fragen"],
    "Kapcsolódó kalkulátorok": ["Related calculators", "Verwandte Rechner"],
    "Árkedvezmény kalkulátor": ["Discount calculator", "Rabattrechner"],
    "Egységár kalkulátor": ["Unit price calculator", "Grundpreisrechner"],
    "Átlag kalkulátor": ["Average calculator", "Durchschnittsrechner"],
    "Százalék kalkulátor": ["Percentage calculator", "Prozentrechner"],
    "ÁFA kalkulátor": ["VAT calculator", "Mehrwertsteuer-Rechner"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"]
  });
  const discount = Object.freeze({
    "Számold ki az akciós árat, kedvezményt és megtakarítást.": [
      "Calculate the sale price, discount and amount saved.",
      "Berechne den Angebotspreis, den Rabatt und die Ersparnis."
    ],
    "Többlépcsős kedvezmény- és kuponkalkulátor": [
      "Stacked discount and coupon calculator", "Rechner für aufeinanderfolgende Rabatte und Gutscheine"
    ],
    "Egymás utáni százalékos kedvezményt, fix kupont és maximális kedvezményi korlátot kezel.": [
      "Apply consecutive percentage discounts, a fixed coupon and an optional cap on the total discount.",
      "Berücksichtigt aufeinanderfolgende prozentuale Rabatte, einen festen Gutschein und eine optionale Obergrenze für die Gesamtermäßigung."
    ],
    "Eredeti ár (Ft)": ["Original price (HUF)", "Ursprünglicher Preis (HUF)"],
    "Első kedvezmény (%)": ["First discount (%)", "Erster Rabatt (%)"],
    "Második kedvezmény (%)": ["Second discount (%)", "Zweiter Rabatt (%)"],
    "Fix kupon (Ft)": ["Fixed coupon (HUF)", "Fester Gutschein (HUF)"],
    "Maximum összes kedvezmény (Ft, 0 = nincs)": [
      "Maximum total discount (HUF, 0 = no limit)", "Maximaler Gesamtrabatt (HUF, 0 = unbegrenzt)"
    ],
    "Végső ár": ["Final price", "Endpreis"],
    "Teljes megtakarítás": ["Total savings", "Gesamtersparnis"],
    "Tényleges kedvezmény": ["Effective discount", "Effektiver Rabatt"],
    "Akciós ár és megtakarítás kiszámítása": [
      "Calculate sale prices and savings", "Angebotspreis und Ersparnis berechnen"
    ],
    "A képlet": ["The formula", "Die Formel"],
    "Egymás utáni kedvezmények": [
      "Consecutive discounts", "Aufeinanderfolgende Rabatte"
    ],
    "Miért nem egyszerűen összeadódnak a kedvezmények?": [
      "Why aren't consecutive discounts simply added together?",
      "Warum werden aufeinanderfolgende Rabatte nicht einfach addiert?"
    ],
    "100% kedvezménynél mi történik?": [
      "What happens with a 100% discount?", "Was passiert bei 100 % Rabatt?"
    ],
    "Áremelést is számol?": [
      "Does it calculate price increases too?", "Berechnet der Rechner auch Preiserhöhungen?"
    ],
    "Kuponnal együtt hogyan számoljak?": [
      "How do I combine it with a coupon?", "Wie rechne ich mit einem zusätzlichen Gutschein?"
    ],
    "ÁFÁ-t figyelembe veszi?": [
      "Does it account for VAT?", "Wird die Mehrwertsteuer berücksichtigt?"
    ],
    "Két kedvezmény nem egyszerűen összeadódik": [
      "Two discounts do not simply add up", "Zwei Rabatte werden nicht einfach addiert"
    ],
    "Kedvezményhalmozás teszt": [
      "Stacked discount test", "Test für kombinierte Rabatte"
    ],
    "Tényleges összkedvezmény": [
      "Effective total discount", "Tatsächlicher Gesamtrabatt"
    ]
  });
  const unit = Object.freeze({
    "Hasonlítsd össze termékek egységárát kiszerelés alapján.": [
      "Compare unit prices for products sold in different pack sizes.",
      "Vergleiche Grundpreise von Produkten mit unterschiedlichen Packungsgrößen."
    ],
    "Egységár-összehasonlító 5 termékhez": [
      "Unit price comparison for up to 5 products", "Grundpreisvergleich für bis zu 5 Produkte"
    ],
    "Különböző kiszereléseket közös egységre vetít, majd rangsorolja az ajánlatokat.": [
      "Converts pack sizes to a shared unit, then ranks the offers by unit price.",
      "Rechnet unterschiedliche Packungsgrößen auf eine gemeinsame Einheit um und ordnet die Angebote nach Grundpreis."
    ],
    "Megnevezés": ["Product name", "Produktname"],
    "Ár (Ft)": ["Price (HUF)", "Preis (HUF)"],
    "Mennyiség": ["Quantity", "Menge"],
    "Egységre vetítés": ["Comparison quantity", "Vergleichsmenge"],
    "Adj meg legalább egy használható terméket.": [
      "Enter at least one product with a valid price and quantity.",
      "Gib mindestens ein Produkt mit gültigem Preis und gültiger Menge ein."
    ],
    "Hasonlítsd össze a különböző kiszereléseket": [
      "Compare different pack sizes", "Vergleiche unterschiedliche Packungsgrößen"
    ],
    "Hogyan számol?": ["How is it calculated?", "Wie wird gerechnet?"],
    "Példa: két kávé összehasonlítása": [
      "Example: comparing two packs of coffee", "Beispiel: zwei Kaffeepackungen vergleichen"
    ],
    "Az olcsóbb egységár nem mindig jobb vétel": [
      "A lower unit price is not always better value",
      "Ein niedrigerer Grundpreis ist nicht immer der bessere Kauf"
    ],
    "Hogyan lesz összehasonlítható az eltérő kiszerelés?": [
      "How can different pack sizes be compared?",
      "Wie lassen sich unterschiedliche Packungsgrößen vergleichen?"
    ]
  });
  const average = Object.freeze({
    "Három átlagfajta, egy helyen": [
      "Three types of averages in one place", "Drei Mittelwerte an einem Ort"
    ],
    "Átlag kalkulátor – számtani, súlyozott és mértani átlag": [
      "Average calculator – arithmetic, weighted and geometric means",
      "Durchschnittsrechner – arithmetisches, gewichtetes und geometrisches Mittel"
    ],
    "Válaszd ki, milyen átlagot szeretnél számolni. Az eszköz az egyszerű számlistát, az eltérő súlyokat és a pozitív növekedési tényezőket külön kezeli.": [
      "Choose which type of average you want. The calculator handles number lists, weighted values and positive growth factors separately.",
      "Wähle die Art des Mittelwerts. Der Rechner verarbeitet Zahlenlisten, gewichtete Werte und positive Wachstumsfaktoren getrennt."
    ],
    "Átlagszámítás": ["Average calculation", "Mittelwertberechnung"],
    "A számokat pontosvesszővel, szóközzel vagy sortöréssel válaszd el. Tizedesvessző használható.": [
      "Separate numbers with semicolons, spaces or newlines. Decimal commas are supported.",
      "Trenne Zahlen mit Semikolon, Leerzeichen oder Zeilenumbruch. Dezimalkommas werden unterstützt."
    ],
    "Számítási mód": ["Calculation mode", "Berechnungsart"],
    "Számtani átlag + medián": ["Arithmetic mean + median", "Arithmetisches Mittel + Median"],
    "Súlyozott átlag": ["Weighted mean", "Gewichtetes Mittel"],
    "Mértani átlag": ["Geometric mean", "Geometrisches Mittel"],
    "Értékek": ["Values", "Werte"],
    "Súlyok": ["Weights", "Gewichte"],
    "Pozitív értékek vagy növekedési tényezők": [
      "Positive values or growth factors", "Positive Werte oder Wachstumsfaktoren"
    ],
    "Azonos jelentőségű értékekhez. Az eredmény mellett mediánt, összeget és elemszámot is mutatunk.": [
      "For equally important values. The result also includes the median, sum and count.",
      "Für gleich gewichtete Werte. Das Ergebnis enthält außerdem Median, Summe und Anzahl."
    ],
    "Minden értékhez ugyanazon a pozíción egy nem negatív súly tartozzon.": [
      "Give each value a nonnegative weight in the same position.",
      "Jeder Wert benötigt ein nichtnegatives Gewicht an derselben Position."
    ],
    "A mértani átlaghoz minden értéknek pozitívnak kell lennie. +5% például 1,05, −3% pedig 0,97.": [
      "All values must be positive for the geometric mean. For example, +5% is 1.05 and −3% is 0.97.",
      "Für das geometrische Mittel müssen alle Werte positiv sein. Beispielsweise entspricht +5 % dem Faktor 1,05 und −3 % dem Faktor 0,97."
    ],
    "Megbízhatósági megjegyzés:": [
      "Reliability note:", "Hinweis zur Zuverlässigkeit:"
    ],
    "Számtani átlag:": ["Arithmetic mean:", "Arithmetisches Mittel:"],
    "Súlyozott átlag:": ["Weighted mean:", "Gewichtetes Mittel:"],
    "Mértani átlag:": ["Geometric mean:", "Geometrisches Mittel:"],
    "Medián:": ["Median:", "Median:"],
    "Összeg:": ["Sum:", "Summe:"],
    "Elemszám:": ["Count:", "Anzahl:"],
    "Súlyok összege:": ["Sum of weights:", "Summe der Gewichte:"],
    "Adj meg legalább egy érvényes számot. Az értékeket pontosvesszővel, szóközzel vagy sortöréssel válaszd el.": [
      "Enter at least one valid number. Separate values with semicolons, spaces or newlines.",
      "Gib mindestens eine gültige Zahl ein. Trenne die Werte mit Semikolon, Leerzeichen oder Zeilenumbruch."
    ],
    "Adj meg érvényes értékeket a súlyozott átlaghoz.": [
      "Enter valid values for the weighted mean.",
      "Gib gültige Werte für das gewichtete Mittel ein."
    ],
    "Minden értékhez pontosan egy nem negatív súly tartozzon.": [
      "Each value must have exactly one nonnegative weight.",
      "Jeder Wert muss genau ein nichtnegatives Gewicht haben."
    ],
    "A súlyok összege legyen nagyobb nullánál.": [
      "The sum of weights must be greater than zero.",
      "Die Summe der Gewichte muss größer als null sein."
    ],
    "A mértani átlaghoz minden megadott értéknek pozitív számnak kell lennie.": [
      "All values must be positive numbers for the geometric mean.",
      "Für das geometrische Mittel müssen alle Werte positive Zahlen sein."
    ],
    "Három különböző átlag, három különböző kérdés": [
      "Three types of averages, three different questions",
      "Drei Mittelwerte, drei unterschiedliche Fragestellungen"
    ],
    "Mikor félrevezető az egyszerű átlag?": [
      "When can the simple mean be misleading?",
      "Wann kann der einfache Durchschnitt irreführend sein?"
    ],
    "Mikor használjak számtani átlagot?": [
      "When should I use the arithmetic mean?",
      "Wann sollte ich das arithmetische Mittel verwenden?"
    ],
    "Mikor kell súlyozott átlag?": [
      "When do I need a weighted mean?",
      "Wann brauche ich ein gewichtetes Mittel?"
    ],
    "Mikor jobb a mértani átlag?": [
      "When is a geometric mean better?",
      "Wann ist das geometrische Mittel geeigneter?"
    ],
    "Miért mutat mediánt is a számtani mód?": [
      "Why does arithmetic mode also show the median?",
      "Warum wird im arithmetischen Modus auch der Median angezeigt?"
    ]
  });
  // Reviewed explanatory copy, scoped to the three calculators below.
  const content = Object.freeze({
    "Hasznos volt ez a kalkulátor?": [
        "Was this calculator useful?",
        "War dieser Rechner hilfreich?"
    ],
    "Ne keresd újra. Mentsd le. Használd.": [
        "Save it. Find it quickly. Use it again.",
        "Speichern. Schnell wiederfinden. Erneut nutzen."
    ],
    "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.": [
        "Save Kalkulátor Bázis to return to this calculation in one step, or share it with someone who may find it useful.",
        "Speichere Kalkulátor Bázis, um diesen Rechner schnell wiederzufinden, oder teile ihn mit jemandem, dem er helfen könnte."
    ],
    "Könyvjelzőzöm": [
        "Bookmark",
        "Als Lesezeichen speichern"
    ],
    "Telepítem": [
        "Install",
        "Installieren"
    ],
    "Megosztom": [
        "Share",
        "Teilen"
    ],
    "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.": [
        "Open your browser menu and look for Bookmarks, Favourites or Save.",
        "Öffne das Browsermenü und suche nach Lesezeichen, Favoriten oder Speichern."
    ],
    "Másold ki ezt a hivatkozást, és küldd tovább.": [
        "Copy this link and share it.",
        "Kopiere diesen Link und teile ihn."
    ],
    "Az árkedvezmény kalkulátor az eredeti árból és a megadott kedvezményszázalékból kiszámolja a megtakarítást és a fizetendő akciós árat. Vásárlás közben gyorsan ellenőrizhető vele, mennyit jelent valójában egy százalékos leárazás.": [
        "The discount calculator uses the original price and the percentage discount to calculate your savings and the sale price. While shopping, you can quickly check what a percentage reduction actually means.",
        "Der Rabattrechner berechnet aus dem ursprünglichen Preis und dem prozentualen Rabatt die Ersparnis und den Angebotspreis. So kannst du beim Einkaufen schnell prüfen, was eine Preisermäßigung tatsächlich ausmacht."
    ],
    "A kalkulátor egymás utáni százalékos kedvezményeket, majd fix kupont és opcionális összkedvezményi korlátot alkalmaz. A százalékos kedvezmények nem egyszerűen összeadhatók: a második már a csökkentett árra vonatkozik.": [
        "The calculator applies consecutive percentage discounts, then a fixed coupon and an optional cap on total savings. Percentage discounts cannot simply be added: the second applies to the already reduced price.",
        "Der Rechner berücksichtigt aufeinanderfolgende prozentuale Rabatte, danach einen festen Gutschein und eine optionale Obergrenze für die Gesamtersparnis. Prozentuale Rabatte lassen sich nicht einfach addieren: Der zweite gilt für den bereits reduzierten Preis."
    ],
    "Kedvezmény = eredeti ár × százalék / 100": [
        "Discount = original price × percentage / 100",
        "Rabatt = ursprünglicher Preis × Prozentsatz / 100"
    ],
    ", az akciós ár pedig eredeti ár − kedvezmény.": [
        ", and the sale price is the original price minus the discount.",
        "; der Angebotspreis ist der ursprüngliche Preis abzüglich des Rabatts."
    ],
    "32 000 Ft-os termék 25%-os kedvezménnyel 8 000 Ft-tal lesz olcsóbb, így 24 000 Ft-ot kell fizetni.": [
        "A product costing HUF 32 000 with a 25% discount is HUF 8000 cheaper, so you pay HUF 24 000.",
        "Ein Produkt für 32 000 HUF wird mit 25 % Rabatt um 8000 HUF günstiger. Du zahlst also 24 000 HUF."
    ],
    "Egy 20%-os, majd további 10%-os kedvezmény nem 30%, hanem összesen 28%: 100 egységből előbb 80, majd annak 90%-a, vagyis 72 marad.": [
        "A 20% discount followed by another 10% gives a total discount of 28%, not 30%: 100 units become 80, then 90% of 80 leaves 72.",
        "20 % Rabatt und anschließend weitere 10 % ergeben insgesamt 28 % statt 30 %: Aus 100 Einheiten werden erst 80; davon bleiben 90 %, also 72."
    ],
    "A kedvezmény összegét fizetendő árnak nézik.": [
        "Mistaking the amount saved for the price to pay.",
        "Die Ersparnis mit dem zu zahlenden Preis verwechseln."
    ],
    "20% + 10%-ot automatikusan 30%-nak vesznek.": [
        "Automatically treating 20% + 10% as a 30% discount.",
        "20 % + 10 % automatisch als 30 % Rabatt betrachten."
    ],
    "A kupon minimumköltését vagy felső korlátját figyelmen kívül hagyják.": [
        "Ignoring a coupon's minimum spend or maximum discount.",
        "Den Mindestbestellwert oder die Rabattobergrenze eines Gutscheins übersehen."
    ],
    "Az eredeti árat nem ellenőrzik korábbi piaci árhoz képest.": [
        "Failing to compare the original price with earlier market prices.",
        "Den ursprünglichen Preis nicht mit früheren Marktpreisen vergleichen."
    ],
    "A fizetendő ár nulla.": [
        "The price to pay is zero.",
        "Der zu zahlende Preis beträgt null."
    ],
    "Nem ezen a nézeten; a százalékkalkulátor alkalmas növekedésre.": [
        "Not in this calculator; use the percentage calculator for increases.",
        "Nicht in diesem Rechner; für Erhöhungen eignet sich der Prozentrechner."
    ],
    "Alkalmazd sorban a kedvezményeket a mindenkori csökkentett árra.": [
        "Apply the discounts in order to the price remaining after each reduction.",
        "Wende die Rabatte nacheinander auf den jeweils bereits reduzierten Preis an."
    ],
    "A megadott ár egészére számol, függetlenül attól, hogy nettó vagy bruttó.": [
        "It uses the full price entered, whether net or gross.",
        "Er rechnet mit dem gesamten eingegebenen Preis, unabhängig davon, ob dieser netto oder brutto ist."
    ],
    "Utolsó tartalmi frissítés:": [
        "Content last updated:",
        "Inhalt zuletzt aktualisiert:"
    ],
    "2026. július 1.": [
        "1 July 2026",
        "1. Juli 2026"
    ],
    "Az eredmény a megadott adatok és az oldalon bemutatott számítási logika alapján készül.": [
        "The result is based on your inputs and the calculation method described on this page.",
        "Das Ergebnis basiert auf deinen Eingaben und dem auf dieser Seite beschriebenen Rechenverfahren."
    ],
    "A számítások módszertana és minőségbiztosítása": [
        "Calculation methods and quality assurance",
        "Berechnungsmethoden und Qualitätssicherung"
    ],
    "Hibát találtál? Jelezd nekünk.": [
        "Found a mistake? Let us know.",
        "Fehler gefunden? Sag uns Bescheid."
    ],
    "Egyszerű összeadás tévesen ezt sugallná": [
        "Simply adding the discounts would incorrectly suggest",
        "Ein einfaches Addieren würde fälschlicherweise ergeben"
    ],
    "Az első kedvezmény után a második már a csökkentett árra vonatkozik.": [
        "After the first discount, the second applies to the reduced price.",
        "Nach dem ersten Rabatt gilt der zweite für den bereits reduzierten Preis."
    ],
    "Az egymás utáni százalékos kedvezményeket sorrendben, mindig az előzőleg csökkentett árra alkalmazza, ezért például 20% és 10% nem 30%-os végső kedvezményt jelent. Ezután vonja le a fix kupont, majd – ha megadtál ilyet – érvényesíti a teljes kedvezmény felső korlátját.": [
        "Percentage discounts are applied in sequence to the previously reduced price, so 20% followed by 10% does not produce a 30% final discount. The fixed coupon is deducted next, followed by the cap on total savings if you entered one.",
        "Prozentuale Rabatte werden nacheinander auf den bereits reduzierten Preis angewendet. Deshalb ergeben 20 % und anschließend 10 % keinen Gesamtrabatt von 30 %. Danach wird der feste Gutschein abgezogen und gegebenenfalls die angegebene Obergrenze für die Gesamtersparnis berücksichtigt."
    ],
    "Adatkezelés": [
        "Data processing",
        "Datenverarbeitung"
    ],
    "A beírt értékek a böngésződben kerülnek feldolgozásra; a kalkulátor nem menti el őket saját szerverre.": [
        "Your inputs are processed in your browser; the calculator does not save them on its own server.",
        "Deine Eingaben werden im Browser verarbeitet; der Rechner speichert sie nicht auf einem eigenen Server."
    ],
    "Utolsó módszertani ellenőrzés:": [
        "Method last reviewed:",
        "Methode zuletzt geprüft:"
    ],
    "2026. szeptember 16.": [
        "16 September 2026",
        "16. September 2026"
    ],
    "Az egységár kalkulátor akkor segít, amikor két termék ára önmagában nem hasonlítható össze, mert eltér a tömegük, térfogatuk vagy darabszámuk. Megmutatja, mennyibe kerül ugyanakkora mennyiség: például 1 kilogramm, 1 liter, 100 gramm vagy 1 darab.": [
        "The unit price calculator helps when two prices cannot be compared directly because the products differ in weight, volume or item count. It shows the cost of the same quantity, such as 1 kilogram, 1 litre, 100 grams or 1 item.",
        "Der Grundpreisrechner hilft, wenn sich zwei Preise wegen unterschiedlicher Gewichte, Volumen oder Stückzahlen nicht direkt vergleichen lassen. Er zeigt den Preis für dieselbe Menge, etwa 1 Kilogramm, 1 Liter, 100 Gramm oder 1 Stück."
    ],
    "A mezőkben minden mennyiséget ugyanabban az egységben adj meg. Ha a csomagon gramm szerepel, a csomag mennyisége legyen gramm, az összehasonlítási mennyiség pedig 1000, ha kilogrammonkénti árat szeretnél látni. Literes terméknél általában 1 az összehasonlítási mennyiség.": [
        "Enter all quantities in the same unit. If the package states grams, enter its quantity in grams and use 1000 as the comparison quantity to see the price per kilogram. For quantities in litres, the comparison quantity is usually 1.",
        "Gib alle Mengen in derselben Einheit ein. Steht auf der Packung Gramm, gib die Packungsmenge in Gramm und als Vergleichsmenge 1000 ein, um den Kilopreis zu sehen. Bei Mengen in Litern ist die Vergleichsmenge normalerweise 1."
    ],
    "A képlet:": [
        "Formula:",
        "Formel:"
    ],
    "egységár = csomag ára / csomag mennyisége × összehasonlítási mennyiség": [
        "unit price = package price / package quantity × comparison quantity",
        "Grundpreis = Packungspreis / Packungsmenge × Vergleichsmenge"
    ],
    ". A kalkulátor nem váltja át magától a grammot kilogrammra vagy a millilitert literre, ezért az Egységre vetítés mezővel te határozod meg, milyen mennyiségre kéred az árat.": [
        ". The calculator does not automatically convert grams to kilograms or millilitres to litres. Use the Comparison quantity field to choose the quantity for which you want the price.",
        ". Der Rechner wandelt Gramm nicht automatisch in Kilogramm oder Milliliter in Liter um. Im Feld Vergleichsmenge legst du fest, für welche Menge der Preis berechnet wird."
    ],
    "Az egyik csomag 250 gramm és 1 799 Ft. Az 1 000 grammra számított egységár: 1 799 / 250 × 1 000 = 7 196 Ft/kg. Egy 500 grammos, 3 399 Ft-os csomag egységára 6 798 Ft/kg, tehát a nagyobb kiszerelés ebben a példában olcsóbb kilogrammonként.": [
        "One package contains 250 grams and costs HUF 1799. Its price per 1000 grams is 1799 / 250 × 1000 = HUF 7196/kg. A 500-gram package costing HUF 3399 has a unit price of HUF 6798/kg, so the larger package is cheaper per kilogram in this example.",
        "Eine Packung enthält 250 Gramm und kostet 1799 HUF. Der Preis für 1000 Gramm beträgt 1799 / 250 × 1000 = 7196 HUF/kg. Eine 500-Gramm-Packung für 3399 HUF kostet 6798 HUF/kg. Die größere Packung ist in diesem Beispiel pro Kilogramm günstiger."
    ],
    "Az eredmény a puszta árkülönbséget mutatja. Érdemes figyelembe venni a minőséget, összetételt, lejárati időt, felhasználhatóságot és azt is, hogy a nagyobb csomag valóban elfogy-e. Egy olcsóbb kilogrammonkénti ár pazarlássá válhat, ha a termék egy része megromlik.": [
        "The result shows only the price difference. Also consider quality, ingredients, expiry dates, usability and whether you will actually use the larger package. A lower price per kilogram can lead to waste if part of the product spoils.",
        "Das Ergebnis zeigt nur den Preisunterschied. Berücksichtige auch Qualität, Zusammensetzung, Haltbarkeit, Verwendbarkeit und ob du die größere Packung tatsächlich aufbrauchst. Ein niedrigerer Kilopreis kann zu Verschwendung führen, wenn ein Teil des Produkts verdirbt."
    ],
    "Az egyik terméket grammban, a másikat kilogrammban adják meg átváltás nélkül.": [
        "Entering one product in grams and another in kilograms without conversion.",
        "Ein Produkt in Gramm und ein anderes ohne Umrechnung in Kilogramm eingeben."
    ],
    "Az összehasonlítási mennyiségnél 1-et írnak be, miközben Ft/kg eredményt várnak grammban megadott csomagból.": [
        "Entering 1 as the comparison quantity but expecting HUF/kg when the package quantity is in grams.",
        "Als Vergleichsmenge 1 eingeben, aber bei einer Packungsmenge in Gramm ein Ergebnis in HUF/kg erwarten."
    ],
    "A lecsöpögtetett tömeg helyett a teljes töltőtömeget használják.": [
        "Using the total net weight instead of the drained weight.",
        "Das gesamte Füllgewicht statt des Abtropfgewichts verwenden."
    ],
    "Akciós többdarabos csomagnál nem a ténylegesen fizetett árat adják meg.": [
        "Not entering the price actually paid for a promotional multipack.",
        "Bei einem Aktionsmehrfachpack nicht den tatsächlich gezahlten Preis eingeben."
    ],
    "Hogyan számoljak Ft/kg árat?": [
        "How do I calculate HUF/kg?",
        "Wie berechne ich HUF/kg?"
    ],
    "Add meg a csomag tömegét grammban, majd az összehasonlítási mennyiségnél 1000-et.": [
        "Enter the package weight in grams and set the comparison quantity to 1000.",
        "Gib das Packungsgewicht in Gramm ein und setze die Vergleichsmenge auf 1000."
    ],
    "Hogyan számoljak Ft/100 g árat?": [
        "How do I calculate HUF/100 g?",
        "Wie berechne ich HUF/100 g?"
    ],
    "Ha a csomag tömege grammban van, az összehasonlítási mennyiség legyen 100.": [
        "If the package weight is in grams, set the comparison quantity to 100.",
        "Wenn das Packungsgewicht in Gramm angegeben ist, setze die Vergleichsmenge auf 100."
    ],
    "Darabárra is használható?": [
        "Can I use it for the price per item?",
        "Kann ich damit auch den Stückpreis berechnen?"
    ],
    "Igen. A mennyiséghez írd a darabszámot, az összehasonlítási mennyiséghez pedig 1-et.": [
        "Yes. Enter the number of items as the quantity and 1 as the comparison quantity.",
        "Ja. Gib als Menge die Stückzahl und als Vergleichsmenge 1 ein."
    ],
    "Milliliterből literárat hogyan kapok?": [
        "How do I get the price per litre from millilitres?",
        "Wie erhalte ich aus Millilitern den Literpreis?"
    ],
    "A mennyiséget milliliterben add meg, az összehasonlítási mennyiség legyen 1000.": [
        "Enter the quantity in millilitres and set the comparison quantity to 1000.",
        "Gib die Menge in Millilitern ein und setze die Vergleichsmenge auf 1000."
    ],
    "Havi költségvetés": [
        "Monthly budget",
        "Monatsbudget"
    ],
    "Használható mennyiségre vetített ár": [
        "Price per usable quantity",
        "Preis je nutzbarer Menge"
    ],
    "A legolcsóbb címke-egységár nem mindig a legolcsóbb felhasználás": [
        "The lowest listed unit price does not always mean the lowest cost in use",
        "Der niedrigste angegebene Grundpreis bedeutet nicht immer die günstigste Nutzung"
    ],
    "Termék ára (Ft)": [
        "Product price (HUF)",
        "Produktpreis (HUF)"
    ],
    "Névleges mennyiség": [
        "Nominal quantity",
        "Nennmenge"
    ],
    "Várható veszteség / nem használt rész (%)": [
        "Expected waste / unused portion (%)",
        "Erwarteter Verlust / ungenutzter Anteil (%)"
    ],
    "Névleges egységár": [
        "Nominal unit price",
        "Nomineller Grundpreis"
    ],
    "Használható mennyiség": [
        "Usable quantity",
        "Nutzbare Menge"
    ],
    "Használható egységre jutó ár": [
        "Price per usable unit",
        "Preis je nutzbarer Einheit"
    ],
    "Élelmiszernél, festéknél, tisztítószernél vagy nagy kiszerelésnél a ténylegesen felhasznált mennyiség is számíthat.": [
        "For food, paint, cleaning products or large packages, the quantity actually used can also matter.",
        "Bei Lebensmitteln, Farbe, Reinigungsmitteln oder Großpackungen kann auch die tatsächlich genutzte Menge entscheidend sein."
    ],
    "Legfeljebb öt termék árát és mennyiségét ugyanarra a választott egységre vetíti, majd az így kapott egységár szerint sorba rendezi őket. Az összevetés csak akkor értelmes, ha az egységre vetítés minden terméknél ugyanazt a fizikai mennyiséget jelenti.": [
        "It converts the prices and quantities of up to five products to the same chosen quantity, then ranks them by unit price. The comparison is meaningful only if the comparison quantity represents the same physical amount for every product.",
        "Der Rechner bezieht Preise und Mengen von bis zu fünf Produkten auf dieselbe gewählte Vergleichsmenge und sortiert sie nach dem Grundpreis. Der Vergleich ist nur sinnvoll, wenn die Vergleichsmenge bei allen Produkten dieselbe physikalische Menge bezeichnet."
    ],
    "az átlag típusa legalább olyan fontos, mint maga a képlet. Az eszköz külön választja a számtani, súlyozott és mértani esetet, de nem dönti el helyetted, hogy a konkrét adathalmazhoz melyik statisztikai mutató a megfelelő.": [
        "the type of average matters as much as the formula itself. The calculator separates arithmetic, weighted and geometric means, but choosing the right statistical measure for your dataset remains up to you.",
        "die Art des Mittelwerts ist ebenso wichtig wie die Formel selbst. Der Rechner unterscheidet arithmetisches, gewichtetes und geometrisches Mittel. Welcher statistische Kennwert zu deinen Daten passt, entscheidest du jedoch selbst."
    ],
    "add össze az értékeket, majd oszd el az elemszámmal. Jó alapmutató, ha minden adat azonos jelentőségű.": [
        "add the values and divide by their count. This is a useful basic measure when all values are equally important.",
        "Addiere die Werte und teile durch ihre Anzahl. Dies ist ein nützlicher Grundwert, wenn alle Daten gleich wichtig sind."
    ],
    "minden értéket megszorzunk a hozzá tartozó súllyal, majd a súlyozott összeget elosztjuk a súlyok összegével. Akkor kell, ha nem minden megfigyelés számít ugyanannyit.": [
        "multiply each value by its weight, then divide the weighted sum by the sum of weights. Use this when observations do not all carry the same weight.",
        "Multipliziere jeden Wert mit seinem Gewicht und teile die gewichtete Summe durch die Summe der Gewichte. Das ist sinnvoll, wenn nicht alle Beobachtungen gleich stark zählen."
    ],
    "pozitív értékek szorzatának n-edik gyöke. Különösen egymásra épülő növekedési tényezők, arányok és hozamszorzók esetén hasznos.": [
        "the nth root of the product of n positive values. Particularly useful for successive growth factors, ratios and return factors.",
        "Die n-te Wurzel aus dem Produkt von n positiven Werten. Besonders nützlich für aufeinanderfolgende Wachstumsfaktoren, Verhältnisse und Renditefaktoren."
    ],
    "Ha az adatok eltérő súlyúak, a számtani átlag túl- vagy alulértékelheti a fontosabb elemek hatását. Egymást követő százalékos változásoknál pedig a hatások nem összeadódnak, hanem összeszorzódnak, ezért ott a mértani szemlélet lehet megfelelőbb.": [
        "When data have different weights, the arithmetic mean can overstate or understate the effect of the more important values. Successive percentage changes multiply rather than add, so a geometric approach may be more appropriate.",
        "Bei unterschiedlich gewichteten Daten kann das arithmetische Mittel den Einfluss wichtigerer Werte über- oder unterschätzen. Aufeinanderfolgende prozentuale Änderungen werden multipliziert statt addiert; hier kann das geometrische Mittel geeigneter sein."
    ],
    "A számtani módban ezért a mediánt is megmutatjuk. Ha az átlag és a medián nagyon eltér, érdemes megnézni, nincs-e néhány szélsőséges adat, amely elhúzza az átlagot.": [
        "This is why arithmetic mode also shows the median. If the mean and median differ greatly, check whether a few extreme values are pulling the mean away from the rest.",
        "Deshalb zeigt der arithmetische Modus auch den Median. Weichen Mittelwert und Median stark voneinander ab, prüfe, ob einzelne Extremwerte den Mittelwert verschieben."
    ],
    "Példák": [
        "Examples",
        "Beispiele"
    ],
    "Számtani:": [
        "Arithmetic:",
        "Arithmetisch:"
    ],
    "10, 20 és 30 átlaga 20.": [
        "The mean of 10, 20 and 30 is 20.",
        "Der Mittelwert von 10, 20 und 30 ist 20."
    ],
    "Súlyozott:": [
        "Weighted:",
        "Gewichtet:"
    ],
    "egy kétszeres súlyú eredmény kétszer akkora hatással vesz részt a végeredményben.": [
        "a value with twice the weight contributes twice as much to the result.",
        "Ein Wert mit doppeltem Gewicht beeinflusst das Ergebnis doppelt so stark."
    ],
    "Mértani:": [
        "Geometric:",
        "Geometrisch:"
    ],
    "+5%, −2% és +12% növekedési tényezői 1,05; 0,98; 1,12 formában adhatók meg.": [
        "The growth factors for +5%, −2% and +12% can be entered as 1,05; 0,98; 1,12.",
        "Die Wachstumsfaktoren für +5 %, −2 % und +12 % lassen sich als 1,05; 0,98; 1,12 eingeben."
    ],
    "Korlátok": [
        "Limitations",
        "Grenzen"
    ],
    "Az átlag önmagában nem mutatja meg az adatok szóródását, eloszlását vagy ok-okozati kapcsolatát. Statisztikai, pénzügyi vagy tudományos döntésnél az átlagot mindig az adatok jelentésével és további mutatókkal együtt értelmezd.": [
        "An average alone does not describe the spread, distribution or causal relationships in the data. For statistical, financial or scientific decisions, interpret it alongside the meaning of the data and other measures.",
        "Ein Mittelwert allein beschreibt weder Streuung und Verteilung noch kausale Zusammenhänge. Interpretiere ihn bei statistischen, finanziellen oder wissenschaftlichen Entscheidungen immer im Zusammenhang mit der Bedeutung der Daten und weiteren Kennwerten."
    ],
    "Akkor, ha az értékek azonos jelentőségűek és összeadható mennyiséget átlagolsz, például jegyeket, méréseket vagy havi kiadásokat.": [
        "When the values are equally important and you are averaging quantities that can be added, such as grades, measurements or monthly expenses.",
        "Wenn die Werte gleich wichtig sind und du addierbare Größen wie Noten, Messwerte oder monatliche Ausgaben mittelst."
    ],
    "Akkor, ha egyes értékek nagyobb jelentőségűek. Ilyen lehet eltérő kreditszám, különböző mennyiség vagy eltérő fontosság.": [
        "When some values count more than others, for example because of different course credits, quantities or importance.",
        "Wenn einzelne Werte stärker zählen, etwa aufgrund unterschiedlicher Leistungspunkte, Mengen oder Wichtigkeit."
    ],
    "Egymásra épülő szorzók, hozamtényezők és növekedési arányok összevetésénél, ahol a hatások szorzódnak.": [
        "When comparing successive multipliers, return factors or growth rates whose effects compound.",
        "Beim Vergleich aufeinanderfolgender Multiplikatoren, Renditefaktoren oder Wachstumsraten, deren Wirkungen sich multiplizieren."
    ],
    "A medián kevésbé érzékeny a szélsőséges értékekre, ezért gyors ellenőrzést ad arra, hogy az egyszerű átlag mennyire reprezentatív.": [
        "The median is less sensitive to extreme values, so it provides a quick check of how representative the arithmetic mean is.",
        "Der Median reagiert weniger empfindlich auf Extremwerte und hilft so schnell einzuschätzen, wie repräsentativ das arithmetische Mittel ist."
    ],
    "Átlag és medián ellenőrzése": [
        "Checking the mean and median",
        "Mittelwert und Median prüfen"
    ],
    "Ugyanaz az adatsor többféle középértéket is indokolhat": [
        "The same dataset can call for different measures of central tendency",
        "Für denselben Datensatz können unterschiedliche Lageparameter sinnvoll sein"
    ],
    "Az 10, 11, 12, 13 és 60 értékek számtani átlaga 21,2, miközben a medián 12. A különbség rögtön jelzi, hogy egy szélső érték erősen elhúzza az átlagot.": [
        "The arithmetic mean of 10, 11, 12, 13 and 60 is 21,2, while the median is 12. The difference immediately shows that an extreme value is pulling the mean upwards.",
        "Das arithmetische Mittel von 10, 11, 12, 13 und 60 beträgt 21,2, der Median dagegen 12. Der Unterschied zeigt sofort, dass ein Extremwert den Mittelwert stark nach oben zieht."
    ],
    "Számtani átlag": [
        "Arithmetic mean",
        "Arithmetisches Mittel"
    ],
    "Medián": [
        "Median",
        "Median"
    ],
    "Minimum – maximum": [
        "Minimum – maximum",
        "Minimum – Maximum"
    ],
    "A kalkulátor ezért nem csak eredményt ad: a számtani módban a medián segít gyorsan felismerni, ha a középérték értelmezéséhez több kontextus kell.": [
        "The calculator therefore does more than give a result: in arithmetic mode, the median helps you quickly spot when interpreting the average requires more context.",
        "Der Rechner liefert deshalb mehr als nur ein Ergebnis: Im arithmetischen Modus hilft der Median schnell zu erkennen, wann die Interpretation des Mittelwerts mehr Kontext benötigt."
    ],
    "Melyik átlagot válaszd?": [
        "Which average should you choose?",
        "Welchen Mittelwert solltest du wählen?"
    ],
    "Számtani átlagot": [
        "Use the arithmetic mean",
        "Verwende das arithmetische Mittel"
    ],
    "azonos jelentőségű értékekhez,": [
        "for equally important values,",
        "für gleich wichtige Werte,"
    ],
    "súlyozott átlagot": [
        "the weighted mean",
        "das gewichtete Mittel"
    ],
    "eltérő fontosságú vagy mennyiségű elemekhez,": [
        "for values with different importance or quantities,",
        "für Werte mit unterschiedlicher Wichtigkeit oder Menge,"
    ],
    "mértani átlagot": [
        "and the geometric mean",
        "und das geometrische Mittel"
    ],
    "pedig pozitív, egymásra épülő szorzótényezőkhöz használj.": [
        "for positive, successive multipliers.",
        "für positive, aufeinander aufbauende Multiplikatoren."
    ],
    "A mértani mód logaritmikus számítással dolgozik, ezért nagyobb adatsoroknál sem kell a köztes szorzatot közvetlenül előállítani. Nulla vagy negatív értéket ebben a módban szándékosan nem fogad el.": [
        "Geometric mode calculates using logarithms, so even larger datasets do not require the intermediate product to be formed directly. This mode deliberately rejects zero and negative values.",
        "Der geometrische Modus rechnet mit Logarithmen. Auch bei größeren Datensätzen muss daher das Zwischenprodukt nicht direkt gebildet werden. Null und negative Werte werden in diesem Modus bewusst nicht akzeptiert."
    ],
    "A beírt értékeket ez a kalkulátor a böngésződben dolgozza fel; a számításhoz nem szükséges saját szerverre elküldeni őket.": [
        "This calculator processes your inputs in your browser; no transmission to its own server is needed for the calculation.",
        "Dieser Rechner verarbeitet deine Eingaben im Browser; für die Berechnung müssen sie nicht an einen eigenen Server gesendet werden."
    ],
    "2026. szeptember 19.": [
        "19 September 2026",
        "19. September 2026"
    ],
    "Hirdetés": [
        "Advertisement",
        "Werbung"
    ],
    "Gyors százalékszámítás hétköznapi helyzetekhez.": [
        "Quick percentage calculations for everyday situations.",
        "Schnelle Prozentberechnungen für Alltagssituationen."
    ],
    "Arány kalkulátor": [
        "Ratio calculator",
        "Verhältnisrechner"
    ],
    "Számold ki egy rész arányát az egészhez képest.": [
        "Calculate a part as a proportion of the whole.",
        "Berechne den Anteil eines Teils am Ganzen."
    ],
    "Számtani, súlyozott és mértani átlag egy közös eszközben, mediánnal és ellenőrző adatokkal.": [
        "Arithmetic, weighted and geometric means in one tool, with median and supporting figures.",
        "Arithmetisches, gewichtetes und geometrisches Mittel in einem Rechner, mit Median und ergänzenden Kennwerten."
    ],
    "Számold ki az akciós árat, kedvezményt és megtakarítást.": [
        "Calculate the sale price, discount and amount saved.",
        "Berechne den Angebotspreis, den Rabatt und die Ersparnis."
    ],
    "Nyisd meg a Megosztás menüt, majd válaszd a Hozzáadás a Kedvencekhez lehetőséget.": [
        "Open the Share menu, then choose Add to Favourites.",
        "Öffne das Teilen-Menü und wähle Zu Favoriten hinzufügen."
    ],
    "Nyomd meg a ⌘ + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.": [
        "Press ⌘ + D, then save the page to your bookmarks.",
        "Drücke ⌘ + D und speichere die Seite als Lesezeichen."
    ],
    "Nyisd meg a böngésző menüjét, majd válaszd a Könyvjelző hozzáadása vagy a csillag ikont.": [
        "Open the browser menu, then choose Add bookmark or the star icon.",
        "Öffne das Browsermenü und wähle Lesezeichen hinzufügen oder das Sternsymbol."
    ],
    "Nyomd meg a Ctrl + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.": [
        "Press Ctrl + D, then save the page to your bookmarks.",
        "Drücke Strg + D und speichere die Seite als Lesezeichen."
    ],
    "Hozzáadás a Főképernyőhöz": [
        "Add to Home Screen",
        "Zum Home-Bildschirm hinzufügen"
    ],
    "Nyisd meg a Safari Megosztás menüjét, válaszd a Hozzáadás a Főképernyőhöz lehetőséget, majd koppints a Hozzáadás gombra.": [
        "Open Safari's Share menu, choose Add to Home Screen, then tap Add.",
        "Öffne in Safari das Teilen-Menü, wähle Zum Home-Bildschirm und tippe auf Hinzufügen."
    ],
    "A Főképernyőhöz adás iPhone-on és iPaden Safariból végezhető el a legegyértelműbben. Nyisd meg ott az oldalt, majd használd a Megosztás menüt.": [
        "On iPhone and iPad, the simplest way to add this page to the Home Screen is through Safari. Open it there and use the Share menu.",
        "Auf iPhone und iPad lässt sich die Seite am einfachsten über Safari zum Home-Bildschirm hinzufügen. Öffne sie dort und nutze das Teilen-Menü."
    ],
    "Kövesd az útmutatót a könyvjelző mentéséhez.": [
        "Follow the instructions to save a bookmark.",
        "Folge der Anleitung, um ein Lesezeichen zu speichern."
    ],
    "Telepítési lehetőség megnyitása...": [
        "Opening the installation prompt…",
        "Installationsdialog wird geöffnet…"
    ],
    "A telepítés elindult.": [
        "Installation has started.",
        "Die Installation wurde gestartet."
    ],
    "A telepítést most nem indítottad el.": [
        "You did not start the installation this time.",
        "Du hast die Installation diesmal nicht gestartet."
    ],
    "A telepítési lehetőség jelenleg nem érhető el.": [
        "Installation is currently unavailable.",
        "Die Installation ist derzeit nicht verfügbar."
    ],
    "Kövesd az útmutatót a főképernyős hozzáadáshoz.": [
        "Follow the instructions to add this page to your Home Screen.",
        "Folge der Anleitung, um die Seite zum Home-Bildschirm hinzuzufügen."
    ],
    "Megosztási felület megnyitva.": [
        "Share dialog opened.",
        "Teilen-Dialog geöffnet."
    ],
    "A megosztást megszakítottad.": [
        "You cancelled sharing.",
        "Du hast das Teilen abgebrochen."
    ],
    "A natív megosztás nem sikerült, megpróbáljuk a linket másolni.": [
        "Sharing failed; trying to copy the link instead.",
        "Das Teilen ist fehlgeschlagen; der Link wird stattdessen kopiert."
    ],
    "A linket a vágólapra másoltuk.": [
        "Link copied to clipboard.",
        "Link in die Zwischenablage kopiert."
    ]
});
  const dictionaries = Object.freeze({
    "ar-kedvezmeny-kalkulator": discount,
    "egysegar-kalkulator": unit,
    "atlag-kalkulator": average
  });
  const pages = Object.freeze(Object.keys(dictionaries));
  const supported = Object.freeze(["hu", "en", "de"]);
  function translate(page, value, lang) {
    if (!["en", "de"].includes(lang) || !dictionaries[page]) return null;
    const index = lang === "en" ? 0 : 1;
    const dict = dictionaries[page];
    if (Object.prototype.hasOwnProperty.call(dict, value)) return dict[value][index];
    if (Object.prototype.hasOwnProperty.call(shared, value)) return shared[value][index];
    const normalized = value.replace(/\s+/gu, " ").trim();
    if (Object.prototype.hasOwnProperty.call(content, normalized)) return content[normalized][index];
    if (page === "egysegar-kalkulator") {
      const perUnit = /^([\d\s.,]+) Ft\/egység$/u.exec(value);
      if (perUnit) return perUnit[1] + (lang === "en" ? " HUF/unit" : " HUF/Einheit");
      const match = /^(\d+)\. termék$/u.exec(value);
      if (match) return match[1] + (lang === "en" ? ". product" : ". Produkt");
      const priced = /^(:\s*[\d\s.,]+\s*Ft)(\s*\/ megadott egység)(\s*– legjobb ár)?$/u.exec(value);
      if (priced) return priced[1] + (lang === "en" ? " / selected quantity" : " / Vergleichsmenge") +
        (priced[3] ? (lang === "en" ? " – best price" : " – günstigster Preis") : "");
    }
    return null;
  }
  return { translate, pages, supported, dictionaries, shared, content };
});

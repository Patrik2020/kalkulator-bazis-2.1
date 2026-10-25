/* global module */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root?.document || new URLSearchParams(root.location.search).has("__kb_static_export")) return;
  const document = root.document;
  const main = document.querySelector("main[data-simple-calc], main[data-batch01-calc], main[data-batch02-calc], main[data-batch04-calc], main[data-batch05-calc]");
  if (!main) return;
  const page = main.dataset.simpleCalc || main.dataset.batch01Calc || main.dataset.batch02Calc || main.dataset.batch04Calc || main.dataset.batch05Calc;
  if (!api.pages.includes(page)) return;

  const record = new WeakMap();
  const langRecords = new WeakMap();
  const attributeRecords = new WeakMap();
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
      if (page === "recept-adag-kalkulator") {
        main.querySelectorAll("#recipeResult p:not(:first-child) strong").forEach((name) => name.setAttribute("translate", "no"));
      }
      const nodes = [];
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        if (!node.parentElement?.closest('script,style,textarea,pre,code,[contenteditable],[translate="no"]')) updateNode(node);
      });
      main.querySelectorAll('[aria-label],[placeholder],[title]').forEach((element) => {
        if (element.closest('[contenteditable],[translate="no"]')) return;
        let attributes = attributeRecords.get(element);
        if (!attributes) { attributes = new Map(); attributeRecords.set(element, attributes); }
        for (const name of ['aria-label', 'placeholder', 'title']) {
          if (!element.hasAttribute(name)) continue;
          const value = element.getAttribute(name), last = attributes.get(name);
          const original = last && last.rendered === value ? last.original : value;
          const translated = api.translate(page, original, selected);
          const rendered = translated === null ? original : translated;
          if (value !== rendered) element.setAttribute(name, rendered);
          attributes.set(name, { original, rendered });
        }
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
    "Árrés kalkulátor": ["Margin calculator", "Handelsspannen-Rechner"],
    "Haszonkulcs kalkulátor": ["Markup calculator", "Aufschlagsrechner"],
    "Hitelesség és számítási korlátok": ["Reliability and calculation limitations", "Verlässlichkeit und Berechnungsgrenzen"],
    "Morzsamenü": ["Breadcrumb navigation", "Brotkrümelnavigation"],
    "Főoldal": ["Home", "Startseite"],
    "Mindennapok": ["Everyday life", "Alltag"],
    "Számítási módszertan": ["Calculation methodology", "Berechnungsmethodik"]
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
  // Reviewed explanatory copy, scoped to the supported everyday calculators.
  const content = Object.freeze({
"Arány:": ["Ratio:", "Verhältnis:"],
"Rész / egész:": ["Part / whole:", "Teil / Ganzes:"],
"Rezsi megosztás kalkulátor": ["Utility bill splitting calculator", "Rechner zum Aufteilen von Nebenkosten"],
"Oszd szét a közös költségeket lakótársak vagy családtagok között.": ["Split shared expenses among housemates or family members.", "Teile gemeinsame Kosten unter Mitbewohnern oder Familienmitgliedern auf."],
"Hasonlítsd össze termékek egységárát kiszerelés alapján.": ["Compare product unit prices by package size.", "Vergleiche die Grundpreise von Produkten anhand der Packungsgröße."],
"Havi költségvetés kalkulátor": ["Monthly budget calculator", "Monatlicher Budgetrechner"],
"Tervezd meg a havi bevételeidet, kiadásaidat és megtakarítási arányodat.": ["Plan your monthly income, expenses and savings rate.", "Plane deine monatlichen Einnahmen, Ausgaben und Sparquote."],

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
    ],
    "Rész": [
        "Part",
        "Teil"
    ],
    "Egész": [
        "Whole",
        "Ganzes"
    ],
    "Eredmény:": [
        "Result:",
        "Ergebnis:"
    ],
    "Az értékek legyenek nagyobbak nullánál": [
        "Values must be greater than zero",
        "Die Werte müssen größer als null sein"
    ],
    "Egy rész aránya az egészhez képest": [
        "A part as a proportion of the whole",
        "Anteil eines Teils am Ganzen"
    ],
    "Az arány kalkulátor megmutatja, hogy egy rész az egész hány százaléka. Használható költségvetési tételek, teljesítményadatok, csoportlétszámok vagy bármilyen rész–egész kapcsolat gyors ellenőrzésére.": [
        "The ratio calculator shows what percentage a part represents of the whole. Use it to check budget items, performance figures, group sizes or any other part-to-whole relationship.",
        "Der Verhältnisrechner zeigt, wie viel Prozent ein Teil vom Ganzen ausmacht. Damit lassen sich Budgetposten, Leistungsdaten, Gruppengrößen und andere Teil-Ganzes-Verhältnisse schnell prüfen."
    ],
    "A nevezőként megadott egész legyen nagyobb nullánál. A rész lehet nagyobb az egésznél is; ilyenkor az eredmény 100% feletti, ami növekedést vagy többletet jelezhet.": [
        "The whole used as the denominator must be greater than zero. The part can be larger than the whole; the result then exceeds 100%, which may indicate an increase or excess.",
        "Das Ganze im Nenner muss größer als null sein. Der Teil kann größer als das Ganze sein; dann liegt das Ergebnis über 100 %, was auf eine Zunahme oder einen Überschuss hinweisen kann."
    ],
    "A képlet": [
        "The formula",
        "Die Formel"
    ],
    "Arány százalékban = rész / egész × 100": [
        "Percentage share = part / whole × 100",
        "Prozentanteil = Teil / Ganzes × 100"
    ],
    ". A kalkulátor a tört alakot is megjeleníti, hogy a bemeneti kapcsolat könnyen ellenőrizhető legyen.": [
        ". The calculator also shows the fraction so you can easily check the relationship between the inputs.",
        ". Der Rechner zeigt auch den Bruch an, damit du das Verhältnis der Eingaben leicht prüfen kannst."
    ],
    "Ha egy 40 fős csoportból 14 ember választ egy lehetőséget, az arány 14 / 40 × 100 = 35%.": [
        "If 14 people in a group of 40 choose an option, the proportion is 14 / 40 × 100 = 35%.",
        "Wählen 14 Personen einer Gruppe von 40 eine Option, beträgt der Anteil 14 / 40 × 100 = 35 %."
    ],
    "Arány és százalékpont": [
        "Proportions and percentage points",
        "Anteile und Prozentpunkte"
    ],
    "Ha egy mutató 35%-ról 40%-ra nő, az 5 százalékpontos növekedés, de relatívan körülbelül 14,3%-os emelkedés. A kalkulátor rész–egész arányt számol, nem két százalék különbségét.": [
        "A rise from 35% to 40% is an increase of 5 percentage points, but a relative increase of about 14.3%. This calculator finds a part-to-whole proportion, not the difference between two percentages.",
        "Ein Anstieg von 35 % auf 40 % entspricht 5 Prozentpunkten, relativ jedoch etwa 14,3 %. Dieser Rechner ermittelt den Anteil eines Teils am Ganzen, nicht die Differenz zwischen zwei Prozentangaben."
    ],
    "A részt és az egészet felcserélik.": [
        "Swapping the part and the whole.",
        "Teil und Ganzes vertauschen."
    ],
    "Nullát adnak meg egésznek.": [
        "Entering zero as the whole.",
        "Für das Ganze null eingeben."
    ],
    "A 0,35 értéket 0,35%-nak tekintik 35% helyett.": [
        "Reading 0.35 as 0.35% instead of 35%.",
        "Den Wert 0,35 als 0,35 % statt als 35 % verstehen."
    ],
    "Százalékot és százalékpontot összekevernek.": [
        "Confusing percentages and percentage points.",
        "Prozent und Prozentpunkte verwechseln."
    ],
    "Lehet az eredmény 100% felett?": [
        "Can the result exceed 100%?",
        "Kann das Ergebnis über 100 % liegen?"
    ],
    "Igen, ha a rész nagyobb a megadott egész értékénél.": [
        "Yes, if the part is larger than the whole you entered.",
        "Ja, wenn der Teil größer als das eingegebene Ganze ist."
    ],
    "Fordított arányt hogyan számoljak?": [
        "How do I calculate the inverse ratio?",
        "Wie berechne ich das umgekehrte Verhältnis?"
    ],
    "Cseréld fel a rész és egész mező értékét.": [
        "Swap the values in the Part and Whole fields.",
        "Vertausche die Werte in den Feldern Teil und Ganzes."
    ],
    "Áremelkedésre is jó?": [
        "Can I use it for price increases?",
        "Eignet sich der Rechner für Preiserhöhungen?"
    ],
    "Az új és régi ár arányát megadja, de a változás százalékához a százalékkalkulátor célszerűbb.": [
        "It gives the ratio of the new price to the old price, but the percentage calculator is more suitable for finding the percentage change.",
        "Er zeigt das Verhältnis des neuen zum alten Preis. Für die prozentuale Änderung eignet sich der Prozentrechner besser."
    ],
    "Tizedes számokat elfogad?": [
        "Does it accept decimal numbers?",
        "Akzeptiert der Rechner Dezimalzahlen?"
    ],
    "Igen, ponttal vagy vesszővel is megadhatók.": [
        "Yes, you can use a decimal point or comma.",
        "Ja, du kannst einen Dezimalpunkt oder ein Dezimalkomma verwenden."
    ],
    "Árkedvezmény": [
        "Discount",
        "Rabatt"
    ],
    "Arány skálázása": [
        "Scaling a ratio",
        "Verhältnis skalieren"
    ],
    "Rész–rész arányból készíts új mennyiséget": [
        "Split a new total using a part-to-part ratio",
        "Eine neue Gesamtmenge nach einem Teil-Teil-Verhältnis aufteilen"
    ],
    "A rész": [
        "Part A",
        "Teil A"
    ],
    "B rész": [
        "Part B",
        "Teil B"
    ],
    "Új teljes mennyiség": [
        "New total quantity",
        "Neue Gesamtmenge"
    ],
    "A új mennyisége": [
        "New quantity of A",
        "Neue Menge von A"
    ],
    "B új mennyisége": [
        "New quantity of B",
        "Neue Menge von B"
    ],
    "A részesedése a teljesből": [
        "A's share of the total",
        "Anteil von A an der Gesamtmenge"
    ],
    "A 2:3 arány öt összes részre osztja a teljes mennyiséget. Ez más kérdés, mint az, hogy A hány százaléka B-nek.": [
        "A 2:3 ratio splits the total into five equal parts. This differs from asking what percentage A is of B.",
        "Ein Verhältnis von 2:3 teilt die Gesamtmenge in fünf gleiche Teile. Das ist eine andere Frage als die, wie viel Prozent A von B ausmacht."
    ],
    "Százalékos változás": [
        "Percentage change",
        "Prozentuale Änderung"
    ],
    "Százalékos változás kalkulátor": [
        "Percentage change calculator",
        "Rechner für prozentuale Änderung"
    ],
    "Írd be a régi és az új értéket, és azonnal látod a növekedést vagy csökkenést.": [
        "Enter the old and new values to see the increase or decrease immediately.",
        "Gib den alten und den neuen Wert ein, um die Zu- oder Abnahme sofort zu sehen."
    ],
    "Régi érték": [
        "Old value",
        "Alter Wert"
    ],
    "Új érték": [
        "New value",
        "Neuer Wert"
    ],
    "Abszolút különbség:": [
        "Absolute difference:",
        "Absolute Differenz:"
    ],
    "Százalékos változás:": [
        "Percentage change:",
        "Prozentuale Änderung:"
    ],
    "Irány:": [
        "Direction:",
        "Richtung:"
    ],
    "növekedés": [
        "increase",
        "Zunahme"
    ],
    "Mit jelent a százalékos változás?": [
        "What does percentage change mean?",
        "Was bedeutet prozentuale Änderung?"
    ],
    "A százalékos változás azt mutatja meg, hogy egy új érték a korábbi értékhez képest mekkora relatív növekedést vagy csökkenést jelent. Hasznos árak, fizetések, fogyasztás, mérési eredmények, látogatottsági adatok vagy bármilyen pozitív kiinduló érték összehasonlításánál.": [
        "Percentage change shows the relative increase or decrease of a new value compared with the previous value. It is useful for prices, pay, consumption, measurements, traffic figures and other comparisons with a positive starting value.",
        "Die prozentuale Änderung zeigt die relative Zu- oder Abnahme eines neuen Werts gegenüber dem vorherigen Wert. Sie eignet sich für Preise, Gehälter, Verbrauch, Messwerte, Besucherzahlen und andere Vergleiche mit positivem Ausgangswert."
    ],
    "A kalkulátor külön megmutatja az": [
        "The calculator separately shows the",
        "Der Rechner zeigt getrennt die"
    ],
    "abszolút különbséget": [
        "absolute difference",
        "absolute Differenz"
    ],
    "és a": [
        "and the",
        "und die"
    ],
    "százalékos változást": [
        "percentage change",
        "prozentuale Änderung"
    ],
    ". Ez azért fontos, mert ugyanaz az abszolút eltérés egészen más jelentőségű lehet eltérő kiinduló értékek mellett.": [
        ". The same absolute difference can have very different significance depending on the starting value.",
        ". Dieselbe absolute Differenz kann je nach Ausgangswert eine ganz andere Bedeutung haben."
    ],
    "Százalékos változás = (új érték − régi érték) / régi érték × 100": [
        "Percentage change = (new value − old value) / old value × 100",
        "Prozentuale Änderung = (neuer Wert − alter Wert) / alter Wert × 100"
    ],
    ". A régi értéknek nagyobbnak kell lennie nullánál. Ha az eredmény pozitív, növekedés történt; ha negatív, csökkenés.": [
        ". The old value must be greater than zero. A positive result means an increase; a negative result means a decrease.",
        ". Der alte Wert muss größer als null sein. Ein positives Ergebnis bedeutet eine Zunahme, ein negatives eine Abnahme."
    ],
    "Egy termék ára 20 000 Ft-ról 23 000 Ft-ra nő. A különbség 3 000 Ft, a százalékos változás pedig 3 000 / 20 000 × 100 = 15%.": [
        "A product's price rises from HUF 20 000 to HUF 23 000. The difference is HUF 3000 and the percentage change is 3000 / 20 000 × 100 = 15%.",
        "Der Preis eines Produkts steigt von 20 000 HUF auf 23 000 HUF. Die Differenz beträgt 3000 HUF, die prozentuale Änderung 3000 / 20 000 × 100 = 15 %."
    ],
    "Százalék és százalékpont nem ugyanaz": [
        "Percent and percentage points are different",
        "Prozent und Prozentpunkte sind verschieden"
    ],
    "Ha egy arányszám 20%-ról 25%-ra változik, az 5": [
        "A change from 20% to 25% is a 5",
        "Eine Änderung von 20 % auf 25 % entspricht 5"
    ],
    "százalékpontos": [
        "percentage point",
        "Prozentpunkten"
    ],
    "emelkedés, miközben relatív értelemben 25%-os növekedés. Ez a kalkulátor két számérték relatív változását számolja, nem két százalékos arány százalékpont-különbségét.": [
        "increase, but a relative increase of 25%. This calculator finds the relative change between two numbers, not the percentage-point difference between two proportions.",
        "Zunahme, relativ jedoch 25 %. Dieser Rechner ermittelt die relative Änderung zweier Zahlen, nicht die Differenz zweier Prozentangaben in Prozentpunkten."
    ],
    "Mikor érdemes más eszközt használni?": [
        "When should I use another tool?",
        "Wann sollte ich einen anderen Rechner verwenden?"
    ],
    "Ha azt szeretnéd tudni, hogy egy rész az egésznek hány százaléka, használd az arány- vagy százalékkalkulátort. Ha akciós árat számolnál, az árkedvezmény kalkulátor közvetlenebb. Nulla kiinduló értéknél a relatív százalékos változás nem értelmezhető, mert nullával kellene osztani.": [
        "To find what percentage a part represents of the whole, use the ratio or percentage calculator. For sale prices, the discount calculator is more direct. Relative percentage change is undefined when the starting value is zero, because the formula would divide by zero.",
        "Um den Prozentanteil eines Teils am Ganzen zu bestimmen, nutze den Verhältnis- oder Prozentrechner. Für Angebotspreise ist der Rabattrechner direkter. Bei einem Ausgangswert von null ist die relative prozentuale Änderung nicht definiert, da die Formel durch null teilen würde."
    ],
    "Miért nem lehet a régi érték nulla?": [
        "Why can't the old value be zero?",
        "Warum darf der alte Wert nicht null sein?"
    ],
    "A képlet a régi értékkel oszt. Nulláról induló változásnak nincs véges, hagyományos százalékos növekedési értéke.": [
        "The formula divides by the old value. A change starting from zero has no finite percentage increase under the usual formula.",
        "Die Formel teilt durch den alten Wert. Für eine Änderung ausgehend von null gibt es nach der üblichen Formel keine endliche prozentuale Zunahme."
    ],
    "Csökkenésnél miért negatív a százalék?": [
        "Why is the percentage negative for a decrease?",
        "Warum ist der Prozentsatz bei einer Abnahme negativ?"
    ],
    "Mert az új érték kisebb a réginél, így az új és régi különbsége negatív.": [
        "Because the new value is smaller than the old value, so their difference is negative.",
        "Weil der neue Wert kleiner als der alte ist und ihre Differenz daher negativ ausfällt."
    ],
    "Az új érték lehet nulla?": [
        "Can the new value be zero?",
        "Darf der neue Wert null sein?"
    ],
    "Igen. Pozitív régi értékről nullára csökkenés pontosan −100%.": [
        "Yes. Falling from a positive old value to zero is exactly −100%.",
        "Ja. Ein Rückgang von einem positiven alten Wert auf null beträgt genau −100 %."
    ],
    "2026. augusztus 21.": [
        "21 August 2026",
        "21. August 2026"
    ],
    "A számítás a hagyományos relatív változás képletét használja pozitív kiinduló értékre. Százalékpont-változást külön kell értelmezni.": [
        "The calculation uses the standard relative-change formula with a positive starting value. Changes in percentage points need to be interpreted separately.",
        "Die Berechnung verwendet die übliche Formel für relative Änderungen mit positivem Ausgangswert. Änderungen in Prozentpunkten müssen gesondert betrachtet werden."
    ],
    "Hibát találtál? Jelezd.": [
        "Found a mistake? Let us know.",
        "Fehler gefunden? Sag uns Bescheid."
    ],
    "Borravaló kalkulátor": [
        "Tip calculator",
        "Trinkgeldrechner"
    ],
    "Oszd el a számlát és számold ki a borravalót több főre.": [
        "Split the bill and calculate tips for a group.",
        "Teile die Rechnung auf und berechne das Trinkgeld für eine Gruppe."
    ],
    "Borravaló-, szervizdíj- és számlamegosztó": [
        "Tip, service charge and bill splitter",
        "Rechner für Trinkgeld, Servicegebühr und Rechnungsteilung"
    ],
    "A szervizdíjat külön kezeli, és három személy eltérő fogyasztását is arányosan osztja.": [
        "It treats the service charge separately and splits the total in proportion to three people's individual spending.",
        "Der Rechner berücksichtigt die Servicegebühr getrennt und verteilt den Gesamtbetrag nach dem individuellen Verzehr von drei Personen."
    ],
    "Ételek/italok összege (Ft)": [
        "Food and drink total (HUF)",
        "Speisen und Getränke insgesamt (HUF)"
    ],
    "Szervizdíj (%)": [
        "Service charge (%)",
        "Servicegebühr (%)"
    ],
    "További borravaló (%)": [
        "Additional tip (%)",
        "Zusätzliches Trinkgeld (%)"
    ],
    "1. személy fogyasztása (Ft)": [
        "Person 1's spending (HUF)",
        "Verzehr von Person 1 (HUF)"
    ],
    "2. személy fogyasztása (Ft)": [
        "Person 2's spending (HUF)",
        "Verzehr von Person 2 (HUF)"
    ],
    "3. személy fogyasztása (Ft)": [
        "Person 3's spending (HUF)",
        "Verzehr von Person 3 (HUF)"
    ],
    "Borravaló és fejenkénti fizetendő összeg": [
        "Tip and amount payable per person",
        "Trinkgeld und Zahlbetrag pro Person"
    ],
    "A kalkulátor az étel- és italfogyasztás összegére szervizdíjat számol, majd az így növelt összegből határozza meg a további borravalót. A teljes fizetendőt a három megadott fogyasztási összeg arányában osztja el. Éttermi vagy közös rendelési elszámolásnál használható.": [
        "The calculator adds the service charge to the food and drink total, then calculates the additional tip on that subtotal. It splits the final amount in proportion to the spending entered for three people. It is useful for restaurant bills and shared orders.",
        "Der Rechner addiert die Servicegebühr zum Betrag für Speisen und Getränke und berechnet das zusätzliche Trinkgeld auf diese Zwischensumme. Den Endbetrag verteilt er nach dem angegebenen Verzehr von drei Personen. Das ist für Restaurantrechnungen und gemeinsame Bestellungen hilfreich."
    ],
    "Ellenőrizd, hogy a számla tartalmaz-e már szervizdíjat. A szervizdíj és a borravaló nem feltétlenül ugyanaz, de ha már van kötelező szolgáltatási díj, a további borravaló személyes döntés.": [
        "Check whether the bill already includes a service charge. Service charges and tips are not necessarily the same; an additional tip is a personal choice when a mandatory service charge is already included.",
        "Prüfe, ob die Rechnung bereits eine Servicegebühr enthält. Servicegebühr und Trinkgeld sind nicht zwangsläufig dasselbe. Ist bereits eine verpflichtende Servicegebühr enthalten, bleibt zusätzliches Trinkgeld eine persönliche Entscheidung."
    ],
    "További borravaló = (étel- és italfogyasztás + szervizdíj) × borravaló százaléka / 100": [
        "Additional tip = (food and drink total + service charge) × tip percentage / 100",
        "Zusätzliches Trinkgeld = (Speisen und Getränke + Servicegebühr) × Trinkgeldsatz / 100"
    ],
    ". A teljes fizetendő az étel- és italfogyasztás, a szervizdíj és a további borravaló összege. A fejenkénti rész a megadott fogyasztással arányos; azonos fogyasztási összegek esetén egyenlő.": [
        ". The final total includes food and drinks, the service charge and the additional tip. Each person's share is proportional to their entered spending; equal spending produces equal shares.",
        ". Der Endbetrag umfasst Speisen und Getränke, Servicegebühr und zusätzliches Trinkgeld. Der Anteil jeder Person richtet sich nach ihrem eingegebenen Verzehr; gleiche Beträge ergeben gleiche Anteile."
    ],
    "24 000 Ft étel- és italfogyasztás, 0% szervizdíj, 10% borravaló és három, egyenként 8 000 Ft-ot fogyasztó vendég esetén a borravaló 2 400 Ft, a teljes fizetendő 26 400 Ft, fejenként 8 800 Ft.": [
        "For HUF 24 000 in food and drinks, a 0% service charge, a 10% tip and three people each spending HUF 8000, the tip is HUF 2400. The total is HUF 26 400, or HUF 8800 per person.",
        "Bei 24 000 HUF für Speisen und Getränke, 0 % Servicegebühr, 10 % Trinkgeld und drei Personen mit jeweils 8000 HUF Verzehr beträgt das Trinkgeld 2400 HUF. Insgesamt sind 26 400 HUF zu zahlen, also 8800 HUF pro Person."
    ],
    "Egyenlő vagy fogyasztásarányos megosztás?": [
        "Equal shares or shares based on spending?",
        "Gleichmäßig oder nach Verzehr aufteilen?"
    ],
    "A kalkulátor a három megadott fogyasztási összeg arányában osztja el a teljes fizetendőt. Egyenlő megosztáshoz azonos fogyasztási összegeket adj meg; eltérő fogyasztáshoz személyenként a saját összeget.": [
        "The calculator splits the final total in proportion to the three spending amounts. Enter equal amounts for equal shares, or individual spending amounts for proportional shares.",
        "Der Rechner verteilt den Endbetrag im Verhältnis der drei Verzehrbeträge. Für gleiche Anteile gib gleiche Beträge ein; für eine proportionale Aufteilung den jeweiligen individuellen Verzehr."
    ],
    "A szervizdíjas végösszegre véletlenül még egyszer ugyanazt a százalékot számolják.": [
        "Accidentally adding the same percentage again to a total that already includes a service charge.",
        "Auf einen Betrag mit bereits enthaltener Servicegebühr versehentlich denselben Prozentsatz erneut aufschlagen."
    ],
    "A létszámba nem számítanak bele minden fizetőt.": [
        "Leaving out one of the people who will pay.",
        "Eine zahlende Person bei der Aufteilung vergessen."
    ],
    "A borravaló százalékát tizedesként adják meg, például 0,1-et 10 helyett.": [
        "Entering the tip percentage as a decimal, such as 0.1 instead of 10.",
        "Den Trinkgeldsatz als Dezimalzahl eingeben, etwa 0,1 statt 10."
    ],
    "Kártyás és készpénzes kerekítést nem egyeztetnek.": [
        "Not agreeing on rounding for card and cash payments.",
        "Die Rundung bei Karten- und Barzahlungen nicht abstimmen."
    ],
    "Szervizdíj mellett kell borravaló?": [
        "Should I tip if there is a service charge?",
        "Sollte ich bei einer Servicegebühr Trinkgeld geben?"
    ],
    "Nem kötelező; a helyi gyakorlat és elégedettség alapján dönthető el.": [
        "It is optional; decide based on local practice and your satisfaction.",
        "Es ist freiwillig; orientiere dich an den örtlichen Gepflogenheiten und deiner Zufriedenheit."
    ],
    "Fejenként eltérő összeget számol?": [
        "Can it calculate different amounts per person?",
        "Kann der Rechner unterschiedliche Beträge pro Person berechnen?"
    ],
    "Igen, a három megadott fogyasztási összeg arányában oszt.": [
        "Yes. It splits the total in proportion to the spending entered for the three people.",
        "Ja. Er verteilt den Gesamtbetrag nach dem eingegebenen Verzehr der drei Personen."
    ],
    "Hogyan kerekítsünk?": [
        "How should we round the amounts?",
        "Wie sollten wir die Beträge runden?"
    ],
    "Egyezzetek meg egész száz vagy ezer forintos összegben, a különbséget valaki vállalhatja.": [
        "Agree on amounts rounded to whole hundreds or thousands of forints; one person can cover the difference.",
        "Einigt euch auf auf volle hundert oder tausend Forint gerundete Beträge; eine Person kann die Differenz übernehmen."
    ],
    "Külföldön használható?": [
        "Can I use it abroad?",
        "Kann ich den Rechner im Ausland nutzen?"
    ],
    "Igen, a matematikához a pénznem nem számít, de a helyi borravalószokások eltérnek.": [
        "Yes, the currency does not affect the maths, but local tipping customs vary.",
        "Ja, die Währung beeinflusst die Rechnung nicht. Die örtlichen Trinkgeldgepflogenheiten unterscheiden sich jedoch."
    ],
    "Költségmegosztás": [
        "Cost sharing",
        "Kostenteilung"
    ],
    "Borravaló és szervizdíj": [
        "Tips and service charges",
        "Trinkgeld und Servicegebühren"
    ],
    "Előbb nézd meg, mi van már a számlán": [
        "First check what the bill already includes",
        "Prüfe zuerst, was die Rechnung bereits enthält"
    ],
    "Szervizdíj": [
        "Service charge",
        "Servicegebühr"
    ],
    "Ha a számla már tartalmaz felszolgálási díjat, az nem ugyanaz, mintha a végösszegre még automatikusan ugyanakkora borravalót számolnál.": [
        "If the bill already includes a service charge, that does not mean you should automatically add the same percentage again as a tip.",
        "Enthält die Rechnung bereits eine Servicegebühr, solltest du nicht automatisch denselben Prozentsatz nochmals als Trinkgeld hinzufügen."
    ],
    "Megosztás": [
        "Splitting the bill",
        "Rechnung aufteilen"
    ],
    "Több főnél döntsétek el, egyenlően vagy fogyasztás szerint osztotok. Ez a kalkulátor a három fogyasztási összeg arányában oszt; egyenlő megosztáshoz azonos összegeket adj meg.": [
        "For a group, decide whether to split equally or by individual spending. This calculator splits by the three spending amounts; enter equal amounts for equal shares.",
        "Entscheidet in der Gruppe, ob ihr gleichmäßig oder nach Verzehr aufteilt. Dieser Rechner verwendet die drei Verzehrbeträge; für gleiche Anteile gib gleiche Beträge ein."
    ],
    "Kerekítés": [
        "Rounding",
        "Rundung"
    ],
    "Készpénzes vagy egyszerűbb elszámolásnál a személyenkénti kerekítés miatt néhány forint eltérés keletkezhet.": [
        "Rounding each person's share for cash payments or simpler settlement can create a difference of a few forints.",
        "Beim Runden der einzelnen Anteile für Barzahlungen oder eine einfachere Abrechnung können einige Forint Differenz entstehen."
    ],
    "Gyakorlati sorrend:": [
        "Practical steps:",
        "Praktische Reihenfolge:"
    ],
    "számla ellenőrzése → szervizdíj ellenőrzése → kívánt plusz borravaló → megosztási szabály → kerekítés.": [
        "check the bill → check the service charge → choose the additional tip → choose how to split → round the amounts.",
        "Rechnung prüfen → Servicegebühr prüfen → zusätzliches Trinkgeld wählen → Aufteilung festlegen → Beträge runden."
    ],
    "Hogyan kezeli külön a szervizdíjat és a borravalót?": [
        "How are service charges and tips handled separately?",
        "Wie werden Servicegebühr und Trinkgeld getrennt berücksichtigt?"
    ],
    "A szervizdíjat az étel- és italfogyasztás összegére számolja, a további borravalót pedig a szervizdíjjal növelt összeg százalékaként. A végösszeget a három megadott fogyasztási összeg arányában osztja szét, ezért az eltérő fogyasztású vendégek nem automatikusan ugyanannyit fizetnek.": [
        "The service charge is calculated on the food and drink total. The additional tip is a percentage of the amount including the service charge. The final bill is split in proportion to the three spending amounts, so guests with different spending do not automatically pay the same amount.",
        "Die Servicegebühr wird auf den Betrag für Speisen und Getränke berechnet. Das zusätzliche Trinkgeld ist ein Prozentsatz des Betrags einschließlich Servicegebühr. Die Gesamtrechnung wird nach den drei Verzehrbeträgen aufgeteilt; Gäste mit unterschiedlichem Verzehr zahlen daher nicht automatisch gleich viel."
    ],
    "Arány": [
        "Ratio",
        "Verhältnis"
    ],
    "Rész / egész": [
        "Part / whole",
        "Teil / Ganzes"
    ],
    "Minden mezőben érvényes szám szerepeljen": [
        "Enter a valid number in every field",
        "Gib in jedem Feld eine gültige Zahl ein"
    ],
    "Az értékek nem lehetnek negatívak": [
        "Values must not be negative",
        "Die Werte dürfen nicht negativ sein"
    ],
    "Abszolút különbség": [
        "Absolute difference",
        "Absolute Differenz"
    ],
    "Irány": [
        "Direction",
        "Richtung"
    ],
    "csökkenés": [
        "decrease",
        "Abnahme"
    ],
    "nincs változás": [
        "no change",
        "keine Änderung"
    ],
    "Régi érték: adj meg érvényes számot.": [
        "Old value: enter a valid number.",
        "Alter Wert: Gib eine gültige Zahl ein."
    ],
    "Új érték: adj meg érvényes számot.": [
        "New value: enter a valid number.",
        "Neuer Wert: Gib eine gültige Zahl ein."
    ],
    "Régi érték: az érték legyen nagyobb nullánál.": [
        "Old value: the value must be greater than zero.",
        "Alter Wert: Der Wert muss größer als null sein."
    ],
    "Új érték: az érték nem lehet negatív.": [
        "New value: the value must not be negative.",
        "Neuer Wert: Der Wert darf nicht negativ sein."
    ],
    "Adj meg legalább egy fogyasztási összeget.": [
        "Enter at least one person's spending amount.",
        "Gib für mindestens eine Person einen Verzehrbetrag ein."
    ],
    "További borravaló": [
        "Additional tip",
        "Zusätzliches Trinkgeld"
    ],
    "Fizetendő összesen": [
        "Total to pay",
        "Gesamtbetrag"
    ],
    "1. személy fizet": [
        "Person 1 pays",
        "Person 1 zahlt"
    ],
    "2. személy fizet": [
        "Person 2 pays",
        "Person 2 zahlt"
    ],
    "3. személy fizet": [
        "Person 3 pays",
        "Person 3 zahlt"
    ],
    "Mentési, telepítési és megosztási műveletek": [
        "Save, install and share actions",
        "Aktionen zum Speichern, Installieren und Teilen"
    ]
});
  const margin = Object.freeze({
    "Árrés kalkulátor": ["Profit margin calculator", "Handelsspannen-Rechner"],
    "Árrés összeg, árrésszázalék és haszonkulcs kiszámítása beszerzési és eladási árból.": [
      "Calculate the margin amount, margin percentage and markup from the purchase and selling prices.",
      "Berechne Handelsspanne, Handelsspannen-Prozentsatz und Aufschlag anhand von Einkaufs- und Verkaufspreis."
    ],
    "Beszerzési ár (Ft)": ["Purchase price (HUF)", "Einkaufspreis (HUF)"],
    "Eladási ár (Ft)": ["Selling price (HUF)", "Verkaufspreis (HUF)"],
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Árrés összege:": ["Margin amount:", "Handelsspanne:"],
    "Árrés:": ["Margin:", "Handelsspanne:"],
    "Haszonkulcs:": ["Markup:", "Aufschlag:"],
    "Árrés": ["Margin", "Handelsspanne"],
    "Mi az árrés?": ["What is a profit margin?", "Was ist eine Handelsspanne?"],
    "Az árrés az eladási ár és a beszerzési ár különbsége. Az árrésszázalék azt mutatja meg, hogy az eladási ár mekkora része marad meg a beszerzési ár levonása után, még az egyéb költségek és adók figyelembevétele előtt.": [
      "The margin is the difference between the selling price and the purchase price. The margin percentage shows what share of the selling price remains after subtracting the purchase price, before other costs and taxes.",
      "Die Handelsspanne ist die Differenz zwischen Verkaufs- und Einkaufspreis. Der Prozentsatz zeigt, welcher Anteil des Verkaufspreises nach Abzug des Einkaufspreises vor weiteren Kosten und Steuern verbleibt."
    ],
    "A haszonkulcs más nevezőt használ: az árrést a beszerzési árhoz viszonyítja. Emiatt ugyanarra az ügyletre az árrésszázalék és a haszonkulcs százaléka eltérhet.": [
      "Markup uses a different base: it compares the margin with the purchase price. As a result, the margin percentage and markup percentage can differ for the same transaction.",
      "Der Aufschlag hat eine andere Bezugsgröße: Er setzt die Handelsspanne ins Verhältnis zum Einkaufspreis. Deshalb können Handelsspannen-Prozentsatz und Aufschlagsprozentsatz beim selben Geschäft unterschiedlich sein."
    ],
    "8 000 Ft beszerzési és 10 000 Ft eladási árnál az árrés 2 000 Ft. Ez az eladási ár 20%-a, a beszerzési árhoz viszonyított haszonkulcs pedig 25%.": [
      "With a purchase price of HUF 8,000 and a selling price of HUF 10,000, the margin is HUF 2,000. This is 20% of the selling price; the markup on the purchase price is 25%.",
      "Bei einem Einkaufspreis von 8.000 HUF und einem Verkaufspreis von 10.000 HUF beträgt die Handelsspanne 2.000 HUF. Das sind 20 % des Verkaufspreises; der Aufschlag auf den Einkaufspreis beträgt 25 %."
    ],
    "Mire nem elég az árrés?": ["What does the margin not tell you?", "Was sagt die Handelsspanne nicht aus?"],
    "Az árrés önmagában nem azonos a vállalkozás nyereségével. Abból még lejöhet például szállítás, bér, energia, csomagolás, platformdíj, adó és más működési költség.": [
      "The margin alone is not the same as business profit. It may still need to cover shipping, wages, energy, packaging, platform fees, taxes and other operating costs.",
      "Die Handelsspanne entspricht nicht automatisch dem Unternehmensgewinn. Davon können noch Versand, Löhne, Energie, Verpackung, Plattformgebühren, Steuern und weitere Betriebskosten abgehen."
    ],
    "Árrés és haszonkulcs ugyanaz?": ["Are margin and markup the same?", "Sind Handelsspanne und Aufschlag dasselbe?"],
    "Nem. Az árrés százalékát az eladási árhoz, a haszonkulcsot a beszerzési árhoz viszonyítjuk.": [
      "No. The margin percentage is based on the selling price, while markup is based on the purchase price.",
      "Nein. Der Handelsspannen-Prozentsatz bezieht sich auf den Verkaufspreis, der Aufschlag auf den Einkaufspreis."
    ],
    "Lehet negatív az árrés?": ["Can the margin be negative?", "Kann die Handelsspanne negativ sein?"],
    "Igen, ha az eladási ár alacsonyabb a beszerzési árnál. Ez veszteséges értékesítést jelezhet.": [
      "Yes, when the selling price is lower than the purchase price. This may indicate a loss-making sale.",
      "Ja, wenn der Verkaufspreis unter dem Einkaufspreis liegt. Das kann auf einen Verkauf mit Verlust hindeuten."
    ],
    "Ez nettó vagy bruttó árakkal számol?": ["Does it use net or gross prices?", "Wird mit Netto- oder Bruttopreisen gerechnet?"],
    "Bármelyikkel, de a két bemenet azonos alapon legyen: nettót nettóval vagy bruttót bruttóval hasonlíts össze.": [
      "Either, as long as both inputs use the same basis: compare net with net or gross with gross.",
      "Beides ist möglich, aber beide Eingaben müssen auf derselben Grundlage beruhen: Netto mit Netto oder Brutto mit Brutto vergleichen."
    ],
    "A kalkulátor kereskedelmi arányszámokat számol; nem teljes eredménykimutatás és nem adózási tanács.": [
      "This calculator computes trading ratios; it is not a full profit-and-loss statement or tax advice.",
      "Dieser Rechner ermittelt kaufmännische Kennzahlen; er ersetzt weder eine vollständige Gewinn- und Verlustrechnung noch eine Steuerberatung."
    ],
    "Beszerzési ár: az érték legyen nagyobb nullánál.": ["Purchase price: the value must be greater than zero.", "Einkaufspreis: Der Wert muss größer als null sein."],
    "Eladási ár: az érték legyen nagyobb nullánál.": ["Selling price: the value must be greater than zero.", "Verkaufspreis: Der Wert muss größer als null sein."]
  });
  const markup = Object.freeze({
    "Haszonkulcs kalkulátor": ["Markup calculator", "Aufschlagsrechner"],
    "Eladási ár és árrés becslése beszerzési árból és megadott haszonkulcsból.": [
      "Estimate the selling price and margin from the purchase price and markup entered.",
      "Schätze anhand des Einkaufspreises und des eingegebenen Aufschlags den Verkaufspreis und die Handelsspanne."
    ],
    "Beszerzési ár (Ft)": ["Purchase price (HUF)", "Einkaufspreis (HUF)"],
    "Haszonkulcs (%)": ["Markup (%)", "Aufschlag (%)"],
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Eladási ár:": ["Selling price:", "Verkaufspreis:"],
    "Árrés összege:": ["Margin amount:", "Handelsspanne:"],
    "Árrés:": ["Margin:", "Handelsspanne:"],
    "Haszonkulcs": ["Markup", "Aufschlag"],
    "Mit jelent a haszonkulcs?": ["What does markup mean?", "Was bedeutet der Aufschlag?"],
    "A haszonkulcs azt fejezi ki, hogy a beszerzési árhoz képest mekkora felárat teszel a termékre vagy szolgáltatásra. A kalkulátor a beszerzési árat megszorozza az 1 + haszonkulcs/100 tényezővel.": [
      "Markup expresses the increase over the purchase price added to a product or service. The calculator multiplies the purchase price by 1 + markup/100.",
      "Der Aufschlag gibt an, um wie viel der Einkaufswert für ein Produkt oder eine Dienstleistung erhöht wird. Der Rechner multipliziert den Einkaufspreis mit 1 + Aufschlag/100."
    ],
    "Ezután megmutatja az árrés összegét és azt is, hogy ez az eladási ár hány százaléka.": [
      "It then shows the margin amount and what percentage of the selling price it represents.",
      "Anschließend zeigt er die Handelsspanne als Betrag und ihren Anteil am Verkaufspreis."
    ],
    "8 000 Ft beszerzési ár és 25% haszonkulcs mellett az eladási ár 10 000 Ft, az árrés 2 000 Ft, ami az eladási ár 20%-a.": [
      "With a purchase price of HUF 8,000 and a 25% markup, the selling price is HUF 10,000 and the margin is HUF 2,000, or 20% of the selling price.",
      "Bei einem Einkaufspreis von 8.000 HUF und 25 % Aufschlag beträgt der Verkaufspreis 10.000 HUF. Die Handelsspanne liegt bei 2.000 HUF beziehungsweise 20 % des Verkaufspreises."
    ],
    "Árképzésnél mire figyelj?": ["What should you consider when setting prices?", "Was solltest du bei der Preisgestaltung beachten?"],
    "A haszonkulcs csak egy egyszerű árképzési alap. A tényleges eladási árnál figyelembe kell venni az ÁFÁ-t, egyéb költségeket, piaci árat, kedvezményeket és a kívánt eredményt is.": [
      "Markup is only a simple starting point for pricing. The actual selling price should also account for VAT, other costs, market prices, discounts and the desired outcome.",
      "Der Aufschlag ist nur eine einfache Grundlage für die Preisgestaltung. Beim tatsächlichen Verkaufspreis sollten auch Mehrwertsteuer, weitere Kosten, Marktpreise, Rabatte und das angestrebte Ergebnis berücksichtigt werden."
    ],
    "25% haszonkulcs 25% árrést jelent?": ["Does a 25% markup mean a 25% margin?", "Bedeutet ein Aufschlag von 25 % auch 25 % Handelsspanne?"],
    "Nem. 25% haszonkulcs a beszerzési árra vetül, ezért a példában az árrés az eladási ár 20%-a.": [
      "No. A 25% markup is applied to the purchase price, so in this example the margin is 20% of the selling price.",
      "Nein. Ein Aufschlag von 25 % bezieht sich auf den Einkaufspreis. Im Beispiel beträgt die Handelsspanne daher 20 % des Verkaufspreises."
    ],
    "Lehet negatív haszonkulcsot megadni?": ["Can I enter a negative markup?", "Kann ich einen negativen Aufschlag eingeben?"],
    "Igen, például leárazás vagy veszteséges értékesítés modellezésére, de -100% alatt az eladási ár már negatív lenne, ezért azt nem engedjük.": [
      "Yes, for example to model a markdown or a loss-making sale. Below -100%, the selling price would be negative, so that value is not allowed.",
      "Ja, zum Beispiel um einen Preisnachlass oder einen Verkauf mit Verlust abzubilden. Unter -100 % wäre der Verkaufspreis negativ; solche Werte sind deshalb nicht zulässig."
    ],
    "Az ÁFA benne van?": ["Is VAT included?", "Ist die Mehrwertsteuer enthalten?"],
    "A kalkulátor nem külön kezeli az ÁFÁ-t. Azonos alapon megadott nettó vagy bruttó árakkal számolj.": [
      "The calculator does not handle VAT separately. Use net or gross prices consistently.",
      "Der Rechner berücksichtigt die Mehrwertsteuer nicht gesondert. Verwende durchgehend Netto- oder Bruttopreise."
    ],
    "A haszonkulcs legyen nagyobb -100%-nál.": ["Markup must be greater than -100%.", "Der Aufschlag muss größer als -100 % sein."],
    "Haszonkulcs: adj meg érvényes számot.": ["Markup: enter a valid number.", "Aufschlag: Gib eine gültige Zahl ein."],
    "Egyszerű árképzési számítás; a tényleges nyereséghez minden további költséget és adót is figyelembe kell venni.": [
      "A simple pricing calculation; actual profit also depends on all other costs and taxes.",
      "Eine einfache Preiskalkulation; für den tatsächlichen Gewinn müssen auch alle weiteren Kosten und Steuern berücksichtigt werden."
    ]
  });
  const breakEven = Object.freeze({
    "Fedezeti pont kalkulátor": ["Break-even point calculator", "Break-even-Rechner"],
    "Fedezeti pont": ["Break-even point", "Break-even-Punkt"],
    "Fedezeti darabszám és árbevétel becslése fix költségből, egységárból és egységnyi változó költségből.": [
      "Estimate the break-even quantity and revenue from fixed costs, unit selling price and variable cost per unit.",
      "Schätze die Break-even-Menge und den Umsatz anhand der Fixkosten, des Verkaufspreises und der variablen Kosten je Einheit."
    ],
    "Fix költség (Ft)": ["Fixed costs (HUF)", "Fixkosten (HUF)"],
    "Eladási ár / egység (Ft)": ["Selling price per unit (HUF)", "Verkaufspreis je Einheit (HUF)"],
    "Változó költség / egység (Ft)": ["Variable cost per unit (HUF)", "Variable Kosten je Einheit (HUF)"],
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Egységnyi fedezet:": ["Contribution per unit:", "Deckungsbeitrag je Einheit:"],
    "Fedezeti hányad:": ["Contribution margin ratio:", "Deckungsbeitragsquote:"],
    "Fedezeti mennyiség:": ["Break-even quantity:", "Break-even-Menge:"],
    "Fedezeti árbevétel:": ["Break-even revenue:", "Break-even-Umsatz:"],
    "db": ["units", "Stück"],
    "Mi a fedezeti pont?": ["What is the break-even point?", "Was ist der Break-even-Punkt?"],
    "A fedezeti pont az a mennyiség, amelynél az értékesítésből származó fedezet éppen kitermeli a vizsgált fix költséget. A számítás alapja az egységnyi fedezet: eladási ár mínusz az adott egységhez közvetlenül kapcsolódó változó költség.": [
      "The break-even point is the quantity at which contribution from sales exactly covers the fixed costs being considered. It is based on contribution per unit: selling price minus the variable cost directly associated with each unit.",
      "Der Break-even-Punkt ist die Absatzmenge, bei der der Deckungsbeitrag genau die betrachteten Fixkosten deckt. Grundlage ist der Deckungsbeitrag je Einheit: Verkaufspreis abzüglich der direkt zurechenbaren variablen Kosten je Einheit."
    ],
    "A szükséges darabszám a fix költség és az egységnyi fedezet hányadosa. Mivel a valóságban tört darabot sok terméknél nem lehet értékesíteni, a kalkulátor a szükséges mennyiséget felfelé kerekíti.": [
      "The required quantity is fixed costs divided by contribution per unit. Since many products cannot be sold in fractions, the calculator rounds the required quantity up to the next whole unit.",
      "Die erforderliche Menge ergibt sich aus Fixkosten geteilt durch Deckungsbeitrag je Einheit. Da viele Produkte nicht in Bruchteilen verkauft werden können, rundet der Rechner die erforderliche Menge auf die nächste ganze Einheit auf."
    ],
    "1 000 000 Ft fix költség, 10 000 Ft eladási ár és 6 000 Ft változó költség mellett 4 000 Ft az egységnyi fedezet. A fedezeti pont 250 darab, ami 2,5 millió Ft árbevételnek felel meg.": [
      "With HUF 1,000,000 in fixed costs, a HUF 10,000 selling price and HUF 6,000 variable cost per unit, contribution per unit is HUF 4,000. The break-even point is 250 units, equal to HUF 2.5 million in revenue.",
      "Bei 1.000.000 HUF Fixkosten, 10.000 HUF Verkaufspreis und 6.000 HUF variablen Kosten je Einheit beträgt der Deckungsbeitrag je Einheit 4.000 HUF. Der Break-even-Punkt liegt bei 250 Stück beziehungsweise 2,5 Millionen HUF Umsatz."
    ],
    "Mit hagy ki az egyszerű modell?": ["What does this simple model leave out?", "Was lässt dieses einfache Modell außer Acht?"],
    "Több termék, eltérő árrés, készletveszteség, adók, kapacitáskorlátok, lépcsőzetesen változó fix költségek és szezonális hatások esetén összetettebb üzleti modellre lehet szükség. Ez az eszköz egy termékre vagy homogén egységre ad gyors becslést.": [
      "A more detailed business model may be needed when there are multiple products, different margins, inventory losses, taxes, capacity constraints, step changes in fixed costs or seasonal effects. This tool gives a quick estimate for one product or a uniform unit.",
      "Bei mehreren Produkten, unterschiedlichen Handelsspannen, Lagerverlusten, Steuern, Kapazitätsgrenzen, stufenweise veränderlichen Fixkosten oder saisonalen Effekten kann ein komplexeres Geschäftsmodell erforderlich sein. Dieses Werkzeug liefert eine schnelle Schätzung für ein Produkt oder eine homogene Einheit."
    ],
    "Mi számít fix költségnek?": ["What counts as a fixed cost?", "Was zählt zu den Fixkosten?"],
    "Olyan vizsgált időszaki költség, amelyet a modellben nem kötünk közvetlenül minden egyes eladott egységhez.": [
      "A cost for the period being modelled that is not directly tied to each unit sold.",
      "Kosten im betrachteten Zeitraum, die im Modell nicht unmittelbar jeder verkauften Einheit zugeordnet werden."
    ],
    "Mi történik, ha a változó költség eléri az eladási árat?": ["What if variable cost equals the selling price?", "Was passiert, wenn die variablen Kosten dem Verkaufspreis entsprechen?"],
    "Az ÁFA benne van?": ["Is VAT included?", "Ist die Mehrwertsteuer enthalten?"],
    "Nincs pozitív egységnyi fedezet, ezért ebből az egyszerű modellből nem adható értelmes fedezeti pont.": [
      "There is no positive contribution per unit, so this simple model cannot produce a meaningful break-even point.",
      "Es gibt keinen positiven Deckungsbeitrag je Einheit. Daher kann dieses einfache Modell keinen sinnvollen Break-even-Punkt berechnen."
    ],
    "Az inputokat egységes alapon add meg: nettó árat nettó költséggel vagy bruttót bruttóval hasonlíts össze.": [
      "Use a consistent basis for the inputs: compare a net price with net costs or a gross price with gross costs.",
      "Verwende für die Eingaben dieselbe Grundlage: Vergleiche einen Nettopreis mit Nettokosten oder einen Bruttopreis mit Bruttokosten."
    ],
    "Az eladási ár legyen nagyobb a változó költségnél.": ["Selling price must be greater than variable cost.", "Der Verkaufspreis muss höher als die variablen Kosten sein."],
    "Fix költség: az érték nem lehet negatív.": ["Fixed costs: the value must not be negative.", "Fixkosten: Der Wert darf nicht negativ sein."],
    "Változó költség: az érték nem lehet negatív.": ["Variable cost: the value must not be negative.", "Variable Kosten: Der Wert darf nicht negativ sein."],
    "Egyszerű egytermékes fedezeti modell. Nem helyettesít részletes költségszámítást, könyvelési vagy üzleti tervezési elemzést.": [
      "A simple single-product break-even model. It does not replace detailed cost calculations, accounting or business planning analysis.",
      "Ein einfaches Break-even-Modell für ein einzelnes Produkt. Es ersetzt weder eine detaillierte Kostenrechnung noch Buchhaltung oder Unternehmensplanung."
    ]
  });
  const dateAdd = Object.freeze({
    "Dátum hozzáadás/kivonás": ["Date addition/subtraction", "Datum addieren/subtrahieren"],
    "Dátum különbség kalkulátor": ["Date difference calculator", "Datumsdifferenz-Rechner"],
    "Életkor kalkulátor": ["Age calculator", "Altersrechner"],
    "Határidő számítás – dátum hozzáadás és kivonás": ["Deadline date calculator – add or subtract calendar days", "Fristberechnung – Kalendertage zu einem Datum addieren oder davon abziehen"],
    "Adj hozzá vagy vonj ki naptári napokat egy dátumból, és számold ki gyorsan a cél dátumot.": ["Add or subtract calendar days from a date to quickly find the target date.", "Addiere oder subtrahiere Kalendertage und ermittle schnell das Zieldatum."],
    "Kiinduló dátum": ["Starting date", "Ausgangsdatum"],
    "Napok száma": ["Number of days", "Anzahl der Tage"],
    "Művelet": ["Operation", "Vorgang"],
    "Hozzáadás": ["Add", "Addieren"],
    "Kivonás": ["Subtract", "Subtrahieren"],
    "Fizetési határidő kalkulátor": ["Payment deadline calculator", "Zahlungsfrist-Rechner"],
    "Fizetési határidő kalkulátort": ["payment deadline calculator", "Zahlungsfrist-Rechner"],
    "Eredmény:": ["Result:", "Ergebnis:"],
    "Eredmény dátuma:": ["Resulting date:", "Ergebnisdatum:"],
    "A hét napja:": ["Day of the week:", "Wochentag:"],
    "Mire jó a dátum hozzáadás/kivonás?": ["What is date addition/subtraction useful for?", "Wofür ist das Addieren oder Subtrahieren von Tagen nützlich?"],
    "Az eszköz egy megadott naptári dátumhoz egész napokat ad hozzá, vagy napokat von ki belőle. Hasznos lehet tervezési határidők, próbaidők, utazások, garanciális időpontok vagy egyszerű naptári ellenőrzések során.": [
      "This tool adds whole days to or subtracts them from a calendar date. It can help with planning deadlines, probation periods, trips, warranty dates or simple calendar checks.",
      "Dieses Werkzeug addiert ganze Tage zu einem Kalenderdatum oder zieht sie davon ab. Es kann bei Planungsfristen, Probezeiten, Reisen, Garantieterminen oder einfachen Kalenderprüfungen helfen."
    ],
    "A számítás naptári napokkal dolgozik, tehát a hétvégéket és ünnepnapokat is beleszámítja. Nem munkanap-kalkulátor, és jogszabály szerinti határidő-számításnál külön szabályok vonatkozhatnak a kezdőnapra, a lejárati napra és a munkaszüneti napokra.": [
      "The calculation uses calendar days, including weekends and public holidays. It does not count working days. Statutory deadlines may have separate rules for the start date, due date and non-working days.",
      "Die Berechnung verwendet Kalendertage einschließlich Wochenenden und Feiertagen. Sie zählt keine Arbeitstage. Für gesetzliche Fristen können besondere Regeln zum Anfangs- und Endtag sowie zu arbeitsfreien Tagen gelten."
    ],
    "Hogyan számol?": ["How is it calculated?", "Wie wird gerechnet?"],
    "A dátumot időzónától független naptári értékként kezeli, majd a megadott egész napszámot hozzáadja vagy kivonja. Így az óraátállítás nem okoz egy nappal elcsúszó eredményt.": [
      "The date is treated as a calendar value independent of time zones, then the specified whole number of days is added or subtracted. This prevents daylight-saving time changes from shifting the result by a day.",
      "Das Datum wird als zeitzonenunabhängiger Kalenderwert behandelt. Anschließend werden die angegebenen ganzen Tage addiert oder subtrahiert. So verschiebt die Zeitumstellung das Ergebnis nicht um einen Tag."
    ],
    "2026. augusztus 21-hez 30 napot hozzáadva 2026. szeptember 20. adódik. Ugyanebből a dátumból 30 napot kivonva 2026. július 22. lenne az eredmény.": [
      "Adding 30 days to 21 August 2026 gives 20 September 2026. Subtracting 30 days from the same date gives 22 July 2026.",
      "Werden zum 21. August 2026 30 Tage addiert, ergibt sich der 20. September 2026. Werden vom selben Datum 30 Tage abgezogen, ergibt sich der 22. Juli 2026."
    ],
    "Mikor használj másik kalkulátort?": ["When should you use another calculator?", "Wann solltest du einen anderen Rechner verwenden?"],
    "Ha két dátum közötti eltérést keresel, a Dátum különbség kalkulátor közvetlenebb. Fizetési határidőnél használd a": [
      "For the difference between two dates, use the date difference calculator. For a payment deadline, use the", "Für den Abstand zwischen zwei Daten ist der Datumsdifferenz-Rechner besser geeignet. Bei Zahlungsfristen verwende den"
    ],
    ", mert az naptári és munkanapos számítást is kínál; hivatalos határidőnél pedig mindig ellenőrizd az alkalmazandó jogi szabályt.": [
      ", which supports both calendar-day and working-day calculations. Always check the applicable legal rule for an official deadline.",
      ", der sowohl Kalender- als auch Arbeitstage berechnet. Prüfe bei einer amtlichen Frist stets die geltende Rechtsvorschrift."
    ],
    "A hétvégék beleszámítanak?": ["Are weekends included?", "Werden Wochenenden mitgezählt?"],
    "Igen. A kalkulátor naptári napokkal dolgozik, ezért a szombat, vasárnap és ünnepnap is egy-egy nap.": ["Yes. It uses calendar days, so Saturdays, Sundays and public holidays each count as one day.", "Ja. Der Rechner verwendet Kalendertage; Samstage, Sonntage und Feiertage zählen jeweils als ein Tag."],
    "Lehet negatív napszámot írni?": ["Can I enter a negative number of days?", "Kann ich eine negative Tageszahl eingeben?"],
    "A félreértések elkerülésére pozitív egész napszámot kér, az irányt pedig a Hozzáadás/Kivonás választóval állíthatod be.": [
      "To avoid confusion, enter a positive whole number of days and choose the direction with the Add/Subtract control.",
      "Um Missverständnisse zu vermeiden, gib eine positive ganze Tageszahl ein und wähle die Richtung über die Auswahl Addieren/Subtrahieren."
    ],
    "Hivatalos határidőhöz használható?": ["Can I use it for an official deadline?", "Kann ich ihn für eine amtliche Frist verwenden?"],
    "Tájékozódásra igen, de hivatalos határidőnél az adott szabályozás kezdő- és lejárati napra vonatkozó előírásait külön ellenőrizni kell.": [
      "It can be used for guidance, but for an official deadline you must separately check the rules for its start and due dates.",
      "Zur Orientierung ja. Bei einer amtlichen Frist musst du jedoch die geltenden Vorschriften zum Fristbeginn und Fristende gesondert prüfen."
    ],
    "A kalkulátor naptári napokat ad hozzá vagy von ki; munkanap-, ünnepnap- és jogi határidőszabályokat nem alkalmaz automatikusan.": [
      "The calculator adds or subtracts calendar days; it does not automatically apply working-day, public-holiday or statutory deadline rules.",
      "Der Rechner addiert oder subtrahiert Kalendertage. Regeln zu Arbeitstagen, Feiertagen oder gesetzlichen Fristen werden nicht automatisch berücksichtigt."
    ],
    "Napok száma: az érték nem lehet negatív.": ["Number of days: the value must not be negative.", "Anzahl der Tage: Der Wert darf nicht negativ sein."],
    "A napok száma egész szám legyen.": ["The number of days must be a whole number.", "Die Anzahl der Tage muss eine ganze Zahl sein."]
  });
  const age = Object.freeze({
    "Életkor kalkulátor": ["Age calculator", "Altersrechner"],
    "Idő átváltó": ["Time converter", "Zeitumrechner"],
    "Idő átváltó kalkulátor": ["Time converter", "Zeitumrechner"],
    "Dátum különbség kalkulátor": ["Date difference calculator", "Datumsdifferenz-Rechner"],
    "datum kulonbseg": ["Date difference", "Datumsdifferenz"],
    "eletkor": ["Age", "Alter"],
    "Számold ki az életkort években, hónapokban és napokban.": ["Calculate age in years, months and days.", "Berechne das Alter in Jahren, Monaten und Tagen."],
    "Pontos életkor és következő születésnap": ["Exact age and next birthday", "Genaues Alter und nächster Geburtstag"],
    "Évek, hónapok, napok mellett teljes napot, hetet, hónapot és a következő születésnapig hátralévő időt is mutat.": [
      "Along with years, months and days, it shows total days, weeks and months, plus the time remaining until the next birthday.",
      "Neben Jahren, Monaten und Tagen zeigt der Rechner die Gesamtzahl der Tage, Wochen und Monate sowie die verbleibende Zeit bis zum nächsten Geburtstag."
    ],
    "Születési dátum": ["Date of birth", "Geburtsdatum"],
    "Számítás dátuma": ["As-of date", "Stichtag"],
    "Pontos életkor": ["Exact age", "Genaues Alter"],
    "Eltelt teljes nap": ["Full days elapsed", "Vergangene volle Tage"],
    "Eltelt teljes hét": ["Full weeks elapsed", "Vergangene volle Wochen"],
    "Közelítő teljes hónap": ["Approximate full months", "Ungefähre volle Monate"],
    "Következő születésnap": ["Next birthday", "Nächster Geburtstag"],
    "Hátralévő napok": ["Days remaining", "Verbleibende Tage"],
    "Pontos életkor évben, hónapban és napban": ["Exact age in years, months and days", "Genaues Alter in Jahren, Monaten und Tagen"],
    "Az életkor kalkulátor a megadott születési dátum és a mai nap között eltelt időt számolja ki. Az eredmény teljes években, hónapokban és napokban jelenik meg, emellett az összes eltelt napot is megmutatja.": [
      "The age calculator measures the time between the entered date of birth and the selected date. It shows complete years, months and days, as well as the total number of elapsed days.",
      "Der Altersrechner ermittelt die Zeit zwischen dem eingegebenen Geburtsdatum und dem gewählten Stichtag. Er zeigt volle Jahre, Monate und Tage sowie die Gesamtzahl der vergangenen Tage."
    ],
    "Ez pontosabb, mint egyszerűen kivonni a születési évet az aktuális évből, mert figyelembe veszi, hogy az idei születésnap már elmúlt-e.": [
      "This is more accurate than simply subtracting the birth year from the current year because it checks whether the birthday has already occurred this year.",
      "Das ist genauer, als einfach das Geburtsjahr vom aktuellen Jahr abzuziehen, denn es wird berücksichtigt, ob der Geburtstag in diesem Jahr bereits war."
    ],
    "Hogyan működik?": ["How does it work?", "Wie funktioniert es?"],
    "A program először a teljes éveket, majd a fennmaradó hónapokat és napokat számolja. Az összes nap a két dátum közötti naptári különbségből készül. Szökőévek miatt az eltelt napok száma nem egyszerűen életkor × 365.": [
      "The calculator first counts complete years, then the remaining months and days. Total days come from the calendar difference between the dates. Because of leap years, elapsed days are not simply age × 365.",
      "Der Rechner zählt zuerst die vollen Jahre und anschließend die verbleibenden Monate und Tage. Die Gesamtzahl der Tage ergibt sich aus dem Kalenderabstand zwischen den Daten. Wegen der Schaltjahre entspricht die Anzahl nicht einfach Alter × 365."
    ],
    "Ha valaki 2000. január 15-én született, a pontos életkora mindig az aktuális dátumtól függ. Január 14-én még eggyel kevesebb teljes évet töltött be, mint január 15-én.": [
      "For someone born on 15 January 2000, exact age depends on the selected date. On 14 January, they have completed one fewer year than on 15 January.",
      "Bei einer Geburt am 15. Januar 2000 hängt das genaue Alter vom gewählten Stichtag ab. Am 14. Januar ist ein weiteres Lebensjahr noch nicht vollendet, am 15. Januar schon."
    ],
    "Mire használható?": ["What is it useful for?", "Wofür ist der Rechner geeignet?"],
    "Születésnapig hátralévő idő ellenőrzéséhez, életkori jogosultságok előzetes áttekintéséhez vagy egyszerű kíváncsiságból. Hivatalos ügyben mindig az adott jogszabály vagy intézmény életkorszámítási szabálya az irányadó.": [
      "Use it to check the time until a birthday, get an initial view of age-based eligibility or satisfy your curiosity. For official matters, the applicable law or institution's age-counting rules always apply.",
      "Der Rechner eignet sich, um die Zeit bis zum Geburtstag zu prüfen, altersabhängige Voraussetzungen grob einzuschätzen oder aus Neugier. In amtlichen Angelegenheiten gelten stets die Altersberechnungsregeln des jeweiligen Gesetzes oder der Institution."
    ],
    "Gyakori hibák": ["Common mistakes", "Häufige Fehler"],
    "Jövőbeli dátumot adnak meg.": ["Entering a future date.", "Ein zukünftiges Datum eingeben."],
    "Elírják a hónapot vagy a napot.": ["Mistyping the month or day.", "Monat oder Tag falsch eingeben."],
    "Az összes napot 365-tel osztva várnak pontos éveket.": ["Expecting exact years by dividing total days by 365.", "Ein genaues Alter in Jahren erwarten, indem die Tage durch 365 geteilt werden."],
    "Hivatalos korhatárnál figyelmen kívül hagyják a pontos határnapot.": ["Overlooking the exact cutoff date for an official age limit.", "Den genauen Stichtag einer amtlichen Altersgrenze übersehen."],
    "Szökőnapon születetteknél működik?": ["Does it work for people born on leap day?", "Funktioniert der Rechner bei Geburt am Schalttag?"],
    "Igen, a naptári dátumkezelés figyelembe veszi a szökőéveket.": ["Yes. Calendar date handling accounts for leap years.", "Ja. Die Kalenderberechnung berücksichtigt Schaltjahre."],
    "Miért nem egyforma minden év napjainak száma?": ["Why do years have different numbers of days?", "Warum haben Jahre unterschiedlich viele Tage?"],
    "A szökőévek 366 naposak.": ["Leap years have 366 days.", "Schaltjahre haben 366 Tage."],
    "Hivatalos nyugdíjkorhatárhoz használható?": ["Can I use it to check the official retirement age?", "Kann ich damit das amtliche Rentenalter prüfen?"],
    "Csak tájékoztatásra; hivatalos jogosultságnál a vonatkozó szabályt kell ellenőrizni.": ["For guidance only; check the applicable rules for official eligibility.", "Nur zur Orientierung. Für einen amtlichen Anspruch müssen die geltenden Regeln geprüft werden."],
    "Megmutatja a következő születésnapot?": ["Does it show the next birthday?", "Zeigt der Rechner den nächsten Geburtstag?"],
    "Jelenleg a pontos életkort és az eltelt napokat mutatja.": ["It currently shows exact age and elapsed days.", "Derzeit zeigt er das genaue Alter und die vergangenen Tage an."],
    "Dátumkülönbség": ["Date difference", "Datumsdifferenz"],
    "Terhességi kalkulátor": ["Pregnancy calculator", "Schwangerschaftsrechner"],
    "Életkor – melyik pontosság kell?": ["Age – how precise does it need to be?", "Alter – welche Genauigkeit ist nötig?"],
    "Más kérdés a „hány éves vagy?” és a „betöltötte-e már?”": ["“How old are you?” and “Have you reached that age yet?” are different questions.", "„Wie alt bist du?“ und „Ist das Alter schon erreicht?“ sind unterschiedliche Fragen."],
    "Hétköznapi életkor": ["Age for everyday use", "Alter im Alltag"],
    "Általában a betöltött teljes évek száma elég.": ["Usually, the number of completed years is enough.", "Meist reicht die Zahl der vollendeten Jahre."],
    "Pontos időtartam": ["Exact duration", "Genaue Zeitspanne"],
    "Évek–hónapok–napok bontásnál a hónapok eltérő hossza miatt naptári számítás kell.": ["A calendar-based calculation is needed for years, months and days because months have different lengths.", "Für die Aufteilung in Jahre, Monate und Tage ist wegen der unterschiedlichen Monatslängen eine Kalenderberechnung nötig."],
    "Jogi vagy jogosultsági korhatár": ["Legal or eligibility age limit", "Gesetzliche Altersgrenze oder Anspruchsvoraussetzung"],
    "Itt a konkrét szabály dönti el, melyik nap és milyen időpont számít; a kalkulátor önmagában nem jogi állásfoglalás.": [
      "The specific rule determines which date and time count. The calculator alone is not a legal opinion.",
      "Die konkrete Regel bestimmt, welcher Tag und Zeitpunkt maßgeblich sind. Der Rechner ist selbst keine Rechtsauskunft."
    ],
    "Február 29-i születésnap:": ["Birthday on 29 February:", "Geburtstag am 29. Februar:"],
    "a naptári életkor matematikája és egy adott jogszabály szerinti korhatár-kezelés nem feltétlenül ugyanaz a kérdés.": [
      "the calendar arithmetic for age and the treatment of an age limit under a specific law are not necessarily the same question.",
      "Die kalendarische Altersberechnung und die Behandlung einer Altersgrenze nach einem bestimmten Gesetz sind nicht unbedingt dieselbe Frage."
    ],
    "Mit jelent a pontos életkor ebben a kalkulátorban?": ["What does exact age mean in this calculator?", "Was bedeutet genaues Alter in diesem Rechner?"],
    "A megadott születési dátumtól a választott referencia-dátumig teljes éveket, majd teljes hónapokat és maradék napokat számol. Emellett külön mutatja az eltelt teljes napokat és heteket, valamint a következő születésnap dátumát és a hátralévő napokat; a teljes hónap érték csak közelítés.": [
      "From the date of birth to the selected reference date, it counts complete years, then complete months and remaining days. It also shows elapsed days and weeks, the next birthday and days remaining; the total-month figure is an approximation.",
      "Vom Geburtsdatum bis zum gewählten Stichtag zählt der Rechner volle Jahre, danach volle Monate und verbleibende Tage. Zusätzlich zeigt er vergangene Tage und Wochen, den nächsten Geburtstag und die verbleibenden Tage; die Gesamtmonate sind ein Näherungswert."
    ],
    "A születési dátum nem lehet későbbi.": ["The date of birth cannot be in the future.", "Das Geburtsdatum darf nicht in der Zukunft liegen."]
  });
  const dateDifference = Object.freeze({
    "Dátum különbség kalkulátor": ["Date difference calculator", "Datumsdifferenz-Rechner"],
    "Életkor kalkulátor": ["Age calculator", "Altersrechner"],
    "Számold ki két dátum közötti napok számát egyszerűen.": ["Quickly calculate the number of days between two dates.", "Berechne schnell die Anzahl der Tage zwischen zwei Daten."],
    "Dátumkülönbség-, munkanap- és dátumművelet-kalkulátor": ["Date difference, working-day and date arithmetic calculator", "Rechner für Datumsdifferenz, Arbeitstage und Datumsoperationen"],
    "Két dátum között számol naptári napot, hétvégét és munkanapot, illetve napokat ad hozzá vagy von ki.": [
      "Calculate calendar days, weekends and working days between two dates, or add and subtract days.",
      "Berechnet Kalendertage, Wochenenden und Arbeitstage zwischen zwei Daten sowie das Addieren und Subtrahieren von Tagen."
    ],
    "Kezdő dátum": ["Start date", "Startdatum"],
    "Záró dátum": ["End date", "Enddatum"],
    "Hozzáadandó/levonandó nap": ["Days to add/subtract", "Zu addierende/abzuziehende Tage"],
    "Dátumművelet típusa": ["Date operation type", "Art der Datumsoperation"],
    "Naptári nap": ["Calendar day", "Kalendertag"],
    "Munkanap": ["Working day", "Arbeitstag"],
    "Számítás": ["Calculate", "Berechnen"],
    "Két dátum között eltelt napok kiszámítása": ["Calculate the days between two dates", "Tage zwischen zwei Daten berechnen"],
    "Különbség": ["Difference", "Differenz"],
    "Intervallumba eső munkanap": ["Working days in range", "Arbeitstage im Zeitraum"],
    "Hétvégi nap": ["Weekend days", "Wochenendtage"],
    "Fix ünnepnap hétköznapon": ["Fixed public holidays on weekdays", "Feste Feiertage an Werktagen"],
    "Dátumművelet eredménye": ["Date operation result", "Ergebnis der Datumsoperation"],
    "A dátumkülönbség kalkulátor két kiválasztott naptári nap távolságát adja meg napokban. Az opcionális napi értékkel a napok száma megszorozható, így például napidíj, bérleti díj vagy késedelmi tétel egyszerű előzetes becslése készíthető.": [
      "The date difference calculator gives the number of days between two selected calendar dates. An optional daily amount can be multiplied by the day count for a simple estimate of a per diem, rent or late charge.",
      "Der Datumsdifferenz-Rechner gibt den Abstand zwischen zwei ausgewählten Kalenderdaten in Tagen an. Optional kann die Tagespauschale mit der Tageszahl multipliziert werden, etwa für eine einfache Schätzung von Tagegeld, Miete oder Verzugsgebühren."
    ],
    "A kalkulátor a két dátum abszolút különbségét számolja, ezért a sorrend nem számít. A kezdőnap és zárónap együttes, „mindkét nap beleszámít” típusú elszámolásnál a kapott értékhez adott esetben egy napot hozzá kell adni.": [
      "The calculator returns the absolute difference, so the order of the dates does not matter. If a calculation includes both the start and end date, you may need to add one day.",
      "Der Rechner gibt den absoluten Abstand an; die Reihenfolge der Daten ist daher unerheblich. Wenn sowohl Start- als auch Enddatum mitzählen, muss gegebenenfalls ein Tag addiert werden."
    ],
    "A számítás": ["The calculation", "Die Berechnung"],
    "A program a dátumok közötti eltelt 24 órás naptári egységeket adja meg. A második eredmény:": [
      "The calculator reports elapsed 24-hour calendar units between the dates. The second result is:",
      "Der Rechner gibt die vergangenen 24-Stunden-Kalendertage zwischen den Daten an. Das zweite Ergebnis lautet:"
    ],
    "napkülönbség × napi érték": ["day difference × daily amount", "Tagesdifferenz × Tageswert"],
    "Július 1. és július 11. között 10 nap különbség van. 8 000 Ft napi díj mellett a szorzott érték 80 000 Ft.": [
      "There are 10 days between 1 July and 11 July. At a daily rate of HUF 8,000, the multiplied amount is HUF 80,000.",
      "Zwischen dem 1. und 11. Juli liegen 10 Tage. Bei einem Tagessatz von 8.000 HUF ergibt sich ein multiplizierter Betrag von 80.000 HUF."
    ],
    "Üzleti és jogi határidők": ["Business and legal deadlines", "Geschäftliche und gesetzliche Fristen"],
    "A naptári nap nem azonos a munkanappal. Ünnepnapok, hétvégék, teljesítési vagy kézbesítési szabályok miatt hivatalos határidőnél mindig a vonatkozó jogszabályt vagy szerződést kell követni.": [
      "A calendar day is not the same as a working day. Public holidays, weekends and rules for performance or service can affect official deadlines, so follow the applicable law or contract.",
      "Ein Kalendertag ist kein Arbeitstag. Feiertage, Wochenenden sowie Leistungs- oder Zustellungsregeln können amtliche Fristen beeinflussen. Maßgeblich sind daher das geltende Gesetz oder der Vertrag."
    ],
    "Naptári nap helyett munkanapot várnak.": ["Expecting working days instead of calendar days.", "Arbeitstage statt Kalendertage erwarten."],
    "Mindkét szélső napot automatikusan beleszámítják.": ["Automatically including both boundary dates.", "Beide Grenzdaten automatisch mitzählen."],
    "A napi értéket teljes összegként adják meg.": ["Entering a daily amount as the total amount.", "Einen Tageswert als Gesamtbetrag eingeben."],
    "Időpontokat, órákat is pontosan szeretnének számolni, miközben a kalkulátor napokkal dolgozik.": ["Expecting exact times or hours from a calculator that works in days.", "Genaue Uhrzeiten oder Stunden erwarten, obwohl der Rechner mit Tagen arbeitet."],
    "A kezdőnap beleszámít?": ["Is the start date included?", "Wird der Starttag mitgezählt?"],
    "Az eredmény a dátumok különbsége. Ha mindkét napot elszámolod, gyakran egyet hozzá kell adni.": ["The result is the difference between the dates. If you count both dates, you often need to add one.", "Das Ergebnis ist der Abstand zwischen den Daten. Wenn beide Tage mitgezählt werden, muss oft ein Tag addiert werden."],
    "Munkanapokat számol?": ["Does it count working days?", "Zählt der Rechner Arbeitstage?"],
    "Nem, minden naptári napot figyelembe vesz.": ["No, it counts every calendar day.", "Nein, es werden alle Kalendertage berücksichtigt."],
    "Lehet a záró dátum korábbi?": ["Can the end date be earlier?", "Kann das Enddatum früher liegen?"],
    "Igen, a kalkulátor az abszolút különbséget mutatja.": ["Yes. The calculator shows the absolute difference.", "Ja. Der Rechner zeigt den absoluten Abstand an."],
    "Késedelmi kamatot számol?": ["Does it calculate late interest?", "Berechnet der Rechner Verzugszinsen?"],
    "Nem, csak egy napi értékkel szoroz; kamatszámításhoz külön képlet kell.": ["No. It only multiplies by a daily amount; interest requires a separate formula.", "Nein. Der Rechner multipliziert nur mit einem Tageswert; für Zinsen ist eine eigene Formel erforderlich."],
    "Fizetési határidő": ["Payment deadline", "Zahlungsfrist"],
    "Idő átváltó": ["Time converter", "Zeitumrechner"],
    "Idő átváltó kalkulátor": ["Time converter", "Zeitumrechner"],
    "Dátumtartomány – határnapok": ["Date range – boundary dates", "Datumsbereich – Grenzdaten"],
    "Ugyanaz a két dátum többféle „napok száma” lehet": ["The same two dates can produce different day counts", "Dieselben zwei Daten können zu unterschiedlichen Tageszahlen führen"],
    "Kezdőnap": ["Start date", "Starttag"],
    "Zárónap": ["End date", "Endtag"],
    "Mindkét határnap beleszámít": ["Include both boundary dates", "Beide Grenzdaten mitzählen"],
    "Adj meg két dátumot.": ["Enter two dates.", "Gib zwei Daten ein."],
    "Határidő, szabadság, szállás vagy jogi időszak esetén mindig ellenőrizd, hogy a szabály beleérti-e a kezdő- és zárónapot.": [
      "For deadlines, leave, accommodation or legal periods, always check whether the rule includes the start and end dates.",
      "Prüfe bei Fristen, Urlaub, Übernachtungen oder gesetzlichen Zeiträumen stets, ob Anfangs- und Enddatum mitzählen."
    ],
    "Mit számol a két dátum között?": ["What does it count between the dates?", "Was wird zwischen den Daten gezählt?"],
    "A kalkulátor külön mutatja a naptári napkülönbséget, a hétvégi napokat és a munkanapokat, továbbá napokat tud hozzáadni vagy levonni egy dátumból. A munkanapos mód a beépített fix magyar ünnepnapokat kezeli; az évente változó munkanap-áthelyezéseket és minden speciális munkarendet külön ellenőrizni kell.": [
      "The calculator separately shows the calendar-day difference, weekend days and working days, and can add or subtract days from a date. Working-day mode includes the built-in fixed Hungarian public holidays; annual working-day swaps and special work schedules must be checked separately.",
      "Der Rechner zeigt die Differenz in Kalendertagen, Wochenenden und Arbeitstagen getrennt an und kann Tage zu einem Datum addieren oder davon abziehen. Der Arbeitstagsmodus berücksichtigt die fest eingebauten ungarischen Feiertage; jährliche Arbeitstagsverlegungen und besondere Arbeitszeitmodelle müssen gesondert geprüft werden."
    ],
    "A beírt értékek a böngésződben kerülnek feldolgozásra; a kalkulátor nem menti el őket saját szerverre.": [
      "Your entries are processed in your browser; the calculator does not save them to its own server.",
      "Deine Eingaben werden im Browser verarbeitet und nicht auf einem eigenen Server des Rechners gespeichert."
    ],
    "Utolsó módszertani ellenőrzés:": ["Last methodology review:", "Letzte methodische Prüfung:"],
    "A születési dátum nem lehet későbbi.": ["The date of birth cannot be in the future.", "Das Geburtsdatum darf nicht in der Zukunft liegen."]
  });
  const workTime = Object.freeze({
    "Munkaidő kalkulátor": ["Working hours calculator", "Arbeitszeitrechner"],
    "Számold ki a heti és havi munkaórát napi óraszám alapján.": ["Calculate your weekly and monthly working hours from your daily hours.", "Berechne deine wöchentliche und monatliche Arbeitszeit anhand der täglichen Stunden."],
    "Műszak- és munkaidő-kalkulátor": ["Shift and working hours calculator", "Schicht- und Arbeitszeitrechner"],
    "Kezel éjfélen átnyúló műszakot, szünetet, heti ismétlődést és havi becslést.": ["Handles overnight shifts, breaks, weekly schedules and monthly estimates.", "Berücksichtigt Nachtschichten, Pausen, Wochenpläne und Monatsschätzungen."],
    "Műszakkezdés": ["Shift start", "Schichtbeginn"], "Műszak vége": ["Shift end", "Schichtende"],
    "Levonandó szünet (perc)": ["Break to deduct (minutes)", "Abzuziehende Pause (Minuten)"],
    "Munkanap hetente": ["Working days per week", "Arbeitstage pro Woche"], "Havi szorzó": ["Weeks per month", "Wochen pro Monat"],
    "Nettó műszakidő": ["Net shift duration", "Netto-Schichtdauer"],
    "Éjfélen átnyúló műszak": ["Overnight shift", "Nachtschicht"],
    "Heti munkaidő": ["Weekly working hours", "Wöchentliche Arbeitszeit"], "Havi becslés": ["Monthly estimate", "Monatsschätzung"],
    "A szünet nem lehet hosszabb a műszaknál.": ["The break cannot be longer than the shift.", "Die Pause darf nicht länger als die Schicht sein."],
    "igen": ["yes", "ja"], "nem": ["no", "nein"],
    "Heti és havi munkaóra becslése": ["Estimate weekly and monthly working hours", "Wöchentliche und monatliche Arbeitszeit schätzen"],
    "A kalkulátor a heti munkanapok és a napi óraszám alapján számol heti munkaidőt, majd a választott hetek számával havi becslést készít. Gyorsan összevethető vele például a heti 5×8 órás, 4×10 órás vagy részmunkaidős beosztás.": [
      "The calculator derives weekly hours from working days per week and hours per day, then estimates monthly hours using the selected weeks-per-month factor. It can quickly compare schedules such as 5×8 hours, 4×10 hours or part-time work.",
      "Der Rechner ermittelt die Wochenarbeitszeit aus Arbeitstagen pro Woche und Stunden pro Tag. Mit dem gewählten Wochenfaktor schätzt er anschließend die Monatsarbeitszeit. So lassen sich etwa 5×8-Stunden-, 4×10-Stunden- oder Teilzeitmodelle vergleichen."
    ],
    "A havi eredmény becslés. A hónapok munkanapszáma eltér, és a szabadság, munkaszüneti nap, betegállomány, túlóra, munkaidőkeret vagy egyenlőtlen beosztás miatt a tényleges elszámolt idő más lehet.": [
      "The monthly result is an estimate. The number of working days varies by month, and leave, public holidays, sickness, overtime, working-time accounts or irregular schedules can change the actual hours recorded.",
      "Das Monatsergebnis ist eine Schätzung. Die Zahl der Arbeitstage variiert je nach Monat. Urlaub, Feiertage, Krankheit, Überstunden, Arbeitszeitkonten oder unregelmäßige Pläne können die tatsächlich erfasste Zeit verändern."
    ],
    "A képlet és a 4,33-as havi átlag": ["The formula and the 4.33-week monthly average", "Formel und Monatsdurchschnitt von 4,33 Wochen"],
    "Heti munkaóra = heti munkanapok × napi munkaóra.": ["Weekly hours = working days per week × hours per day.", "Wochenstunden = Arbeitstage pro Woche × Stunden pro Tag."],
    "A havi becslés a heti érték és a megadott heti szorzó szorzata. Az évi 52 hét tizenkét hónapra osztva körülbelül 4,33 hetet ad havonta, ezért ezt gyakran használják átlagos összehasonlításra.": [
      "The monthly estimate is the weekly figure multiplied by the selected factor. Dividing 52 weeks by 12 months gives about 4.33 weeks per month, a common basis for average comparisons.",
      "Die Monatsschätzung ergibt sich aus dem Wochenwert multipliziert mit dem gewählten Faktor. 52 Wochen geteilt durch 12 Monate ergeben etwa 4,33 Wochen pro Monat; dieser Durchschnitt wird häufig für Vergleiche genutzt."
    ],
    "Heti 5 nap × napi 8 óra = 40 óra hetente, ami 4,33-as szorzóval körülbelül 173,2 óra havonta. Heti 4 nap × napi 6 óra = 24 óra hetente, ami ugyanilyen átlaggal körülbelül 103,9 óra.": [
      "Five days × 8 hours per day = 40 hours per week, or about 173.2 hours per month using a 4.33 factor. Four days × 6 hours per day = 24 hours per week, or about 103.9 hours per month using the same average.",
      "Fünf Tage × 8 Stunden pro Tag ergeben 40 Wochenstunden und bei einem Faktor von 4,33 etwa 173,2 Stunden im Monat. Vier Tage × 6 Stunden ergeben 24 Wochenstunden und mit demselben Durchschnitt etwa 103,9 Monatsstunden."
    ],
    "Munkaidő, jelenléti idő és fizetett idő": ["Working time, presence time and paid time", "Arbeitszeit, Anwesenheitszeit und bezahlte Zeit"],
    "A három fogalom nem mindig ugyanaz. A munkaközi szünet egyes helyzetekben nem része a munkaidőnek, miközben a munkahelyen töltött teljes jelenléti idő hosszabb lehet. Bérszámfejtésnél ezért mindig azt az óraszámot használd, amelyet az adott számítás valóban igényel.": [
      "These three concepts are not always the same. In some cases, breaks are excluded from working time, while total time at the workplace can be longer. For payroll, use the hours required by the specific calculation.",
      "Diese drei Begriffe bedeuten nicht immer dasselbe. Pausen zählen je nach Situation nicht zur Arbeitszeit, während die gesamte Anwesenheit am Arbeitsplatz länger sein kann. Verwende für die Lohnabrechnung die Stunden, die für die jeweilige Berechnung maßgeblich sind."
    ],
    "Mikor hasznos a kalkulátor?": ["When is this calculator useful?", "Wann ist dieser Rechner hilfreich?"],
    "teljes és részmunkaidős ajánlatok összehasonlításánál;": ["comparing full-time and part-time offers;", "beim Vergleich von Vollzeit- und Teilzeitangeboten;"],
    "órabér vagy havi bér gyors visszaellenőrzésénél;": ["quickly checking an hourly or monthly wage;", "beim schnellen Prüfen eines Stunden- oder Monatslohns;"],
    "eltérő heti munkarendek tervezésénél;": ["planning different weekly schedules;", "bei der Planung unterschiedlicher Wochenarbeitszeiten;"],
    "munkaidőkeret egyszerű átlagos szemléltetésénél;": ["illustrating an average working-time account;", "bei einer vereinfachten Durchschnittsbetrachtung eines Arbeitszeitkontos;"],
    "munkaidőkeret egyszerű átlagos szemléltetésénél.": ["illustrating an average working-time account.", "bei einer vereinfachten Durchschnittsbetrachtung eines Arbeitszeitkontos."],
    "Mikor nem elég ez az egyszerű számítás?": ["When is this simple calculation not enough?", "Wann reicht diese einfache Berechnung nicht aus?"],
    "Munkaidőkeret, többműszakos vagy megszakítás nélküli beosztás, készenlét, túlóra, munkaszüneti napi munkavégzés és pótlékok esetén a tényleges elszámolás több szabálytól függ. Ilyenkor a kalkulátor tervezési segédlet, nem bérszámfejtési igazolás.": [
      "Actual accounting can depend on many rules for working-time accounts, rotating or continuous shifts, on-call duty, overtime, work on public holidays and premiums. In these cases, the calculator is a planning aid, not a payroll record.",
      "Bei Arbeitszeitkonten, Schicht- oder ununterbrochenem Betrieb, Bereitschaft, Überstunden, Feiertagsarbeit und Zuschlägen hängt die Abrechnung von mehreren Regeln ab. Der Rechner dient dann der Planung und ist kein Lohnnachweis."
    ],
    "A havi 4 hetet minden hónapra pontos értéknek tekintik.": ["Treating four weeks as an exact month.", "Vier Wochen als exakten Monatswert ansehen."],
    "A fizetetlen szünetet automatikusan munkaidőként adják meg.": ["Automatically counting an unpaid break as working time.", "Eine unbezahlte Pause automatisch als Arbeitszeit ansetzen."],
    "A naptári napokat munkanapokkal keverik.": ["Confusing calendar days with working days.", "Kalendertage mit Arbeitstagen verwechseln."],
    "A túlórát és az alapórát egyetlen értékben kezelik.": ["Combining overtime and regular hours into one figure.", "Überstunden und reguläre Stunden zu einem Wert zusammenfassen."],
    "Átlagos havi órát hasonlítanak egy konkrét hónap tényleges óraszámához.": ["Comparing average monthly hours with the actual hours in a specific month.", "Durchschnittliche Monatsstunden mit den tatsächlichen Stunden eines bestimmten Monats vergleichen."],
    "Miért 4,33 hét az átlagos hónap?": ["Why is an average month 4.33 weeks?", "Warum hat ein Durchschnittsmonat 4,33 Wochen?"],
    "Az év 52 hetét tizenkét hónapra osztva körülbelül 4,33 adódik. Ez éves átlag, nem egy adott hónap pontos hossza.": ["Dividing 52 weeks in a year by 12 months gives about 4.33. This is an annual average, not the exact length of a specific month.", "52 Wochen pro Jahr geteilt durch 12 Monate ergeben etwa 4,33. Das ist ein Jahresdurchschnitt, nicht die exakte Länge eines bestimmten Monats."],
    "Részmunkaidőnél is használható?": ["Can I use it for part-time work?", "Kann ich ihn für Teilzeitarbeit verwenden?"],
    "Igen. Add meg a tényleges heti munkanapokat és a napi óraszámot.": ["Yes. Enter your actual working days per week and hours per day.", "Ja. Gib deine tatsächlichen Arbeitstage pro Woche und Stunden pro Tag ein."],
    "Műszakos munkarendnél pontos?": ["Is it accurate for shift work?", "Ist er für Schichtarbeit genau?"],
    "Átlagos becslésre használható, de konkrét elszámoláshoz a tényleges műszakokat és távolléteket kell összesíteni.": ["It can provide an average estimate, but actual shifts and absences must be totalled for a specific payroll calculation.", "Er eignet sich für eine Durchschnittsschätzung. Für eine konkrete Abrechnung müssen tatsächliche Schichten und Abwesenheiten zusammengerechnet werden."],
    "Hogyan kezeli a műszakot és az éjfélt?": ["How does it handle shifts and midnight?", "Wie behandelt der Rechner Schichten und Mitternacht?"],
    "A kezdés és befejezés különbségéből indul ki, az éjfélen átnyúló műszakot automatikusan a következő napra vezeti át, majd levonja a megadott szünetet. A heti és havi érték a megadott munkanapszámból és havi szorzóból készülő becslés; nem munkaügyi nyilvántartás.": [
      "It calculates the time between start and end, moves an overnight shift into the following day, then deducts the entered break. Weekly and monthly figures are estimates based on the entered working days and monthly factor; this is not an employment record.",
      "Der Rechner ermittelt die Zeit zwischen Beginn und Ende, verschiebt eine Nachtschicht automatisch auf den Folgetag und zieht dann die angegebene Pause ab. Wochen- und Monatswerte sind Schätzungen anhand der Arbeitstage und des Monatsfaktors; sie sind kein Arbeitszeitnachweis."
    ],
    "A szünetet levonja?": ["Does it deduct breaks?", "Zieht der Rechner Pausen ab?"],
    "Nem automatikusan. A napi órához azt az időt add meg, amelyet a számításban munkaidőként szeretnél kezelni.": ["Not automatically. Enter the time you want treated as working time in the daily-hours field.", "Nicht automatisch. Gib bei den Tagesstunden die Zeit ein, die in der Berechnung als Arbeitszeit gelten soll."],
    "Órabért is számol?": ["Does it calculate an hourly wage too?", "Berechnet er auch einen Stundenlohn?"],
    "Nem ezen az oldalon. Ehhez használd az órabér kalkulátort.": ["Not on this page. Use the hourly wage calculator for that.", "Nicht auf dieser Seite. Verwende dafür den Stundenlohnrechner."],
    "Órabér kalkulátor": ["Hourly wage calculator", "Stundenlohnrechner"],
    "Nettó–bruttó": ["Net–gross salary", "Netto–Brutto"],
    "Dátumkülönbség": ["Date difference", "Datumsdifferenz"],
    "Jelenléti idő vs. fizetett idő": ["Presence time vs. paid time", "Anwesenheitszeit vs. bezahlte Zeit"],
    "A műszak hossza nem mindig a fizetett óraszám": ["Shift length is not always the number of paid hours", "Die Schichtdauer entspricht nicht immer den bezahlten Stunden"],
    "Kezdés": ["Start", "Beginn"], "Befejezés": ["End", "Ende"],
    "Nem fizetett szünet (perc)": ["Unpaid break (minutes)", "Unbezahlte Pause (Minuten)"],
    "Jelenléti idő": ["Presence time", "Anwesenheitszeit"], "Számolt fizetett idő": ["Calculated paid time", "Berechnete bezahlte Zeit"],
    "Éjfélen átnyúló műszaknál a rendszer következő napi befejezést feltételez. Munkaügyi elszámolásnál a szerződés, kollektív szabály és jogszabály az irányadó.": [
      "For an overnight shift, the calculator assumes the end time falls on the next day. Contracts, collective rules and legislation govern employment accounting.",
      "Bei einer Nachtschicht geht der Rechner davon aus, dass die Endzeit am Folgetag liegt. Für die arbeitsrechtliche Abrechnung gelten Vertrag, Tarifregeln und Gesetz."
    ]
  });
  const workdays = Object.freeze({
    "Munkanap kalkulátor": ["Working days calculator", "Arbeitstage-Rechner"],
    "Számold ki két dátum között a hétfőtől péntekig eső napokat, és adj meg külön kihagyandó dátumokat is.": ["Count weekdays between two dates and optionally enter dates to exclude.", "Zähle die Wochentage zwischen zwei Daten und gib bei Bedarf auszuschließende Tage an."],
    "Kezdő dátum": ["Start date", "Startdatum"], "Záró dátum": ["End date", "Enddatum"],
    "Kihagyandó dátumok (opcionális)": ["Dates to exclude (optional)", "Auszuschließende Daten (optional)"],
    "Pontosvesszővel, vesszővel vagy sortöréssel választhatod el. A kalkulátor nem tölt be automatikus ünnepnaplistát.": ["Separate dates with semicolons, commas or line breaks. The calculator does not load a public-holiday list automatically.", "Trenne die Daten mit Semikolon, Komma oder Zeilenumbruch. Der Rechner lädt keine Feiertagsliste automatisch."],
    "Naptári napok": ["Calendar days", "Kalendertage"], "Naptári napok:": ["Calendar days:", "Kalendertage:"],
    "Hétköznapok": ["Weekdays", "Wochentage"], "Hétköznapok:": ["Weekdays:", "Wochentage:"],
    "Kihagyott hétköznapok": ["Excluded weekdays", "Ausgeschlossene Wochentage"], "Kihagyott hétköznapok:": ["Excluded weekdays:", "Ausgeschlossene Wochentage:"],
    "Számított munkanapok": ["Calculated working days", "Berechnete Arbeitstage"], "Számított munkanapok:": ["Calculated working days:", "Berechnete Arbeitstage:"],
    "Munkanap": ["Working day", "Arbeitstag"],
    "A záró dátum nem lehet korábbi a kezdő dátumnál.": ["The end date cannot be earlier than the start date.", "Das Enddatum darf nicht vor dem Startdatum liegen."],
    "datum hozzaadas kivonas": ["Date addition/subtraction", "Datum addieren/subtrahieren"],
    "Mit számol a munkanap kalkulátor?": ["What does the working days calculator count?", "Was zählt der Arbeitstage-Rechner?"],
    "A kalkulátor a kezdő és záró dátumot is beleszámítja, majd végiglépked az időszak naptári napjain. A szombatot és vasárnapot automatikusan hétvégének tekinti, a hétfőtől péntekig tartó napokat pedig hétköznapként számolja.": [
      "The calculator includes both the start and end dates and checks each calendar day in the range. Saturdays and Sundays count as weekends; Monday through Friday count as weekdays.",
      "Der Rechner zählt Start- und Enddatum mit und prüft jeden Kalendertag im Zeitraum. Samstag und Sonntag gelten als Wochenende, Montag bis Freitag als Wochentage."
    ],
    "Ha van olyan hétköznap, amelyet nem szeretnél munkanapnak számítani, a kihagyandó dátumok mezőben külön megadhatod. Ez lehet például ünnepnap, céges szünnap vagy bármilyen saját kivétel.": [
      "If you do not want a weekday counted as a working day, enter it in the dates-to-exclude field. This could be a public holiday, company day off or any other exception.",
      "Wenn ein Wochentag nicht als Arbeitstag zählen soll, kannst du ihn im Feld für auszuschließende Daten eintragen, etwa einen Feiertag, einen betrieblichen freien Tag oder eine andere Ausnahme."
    ],
    "2026. augusztus 24. és 28. között öt naptári nap van, és mind az öt hétfőtől péntekig esik. Külön kizárás nélkül ezért az eredmény 5 munkanap.": [
      "There are five calendar days from 24 to 28 August 2026, and all five fall Monday through Friday. With no exclusions, the result is five working days.",
      "Vom 24. bis 28. August 2026 gibt es fünf Kalendertage, die alle auf Montag bis Freitag fallen. Ohne Ausschlüsse beträgt das Ergebnis daher fünf Arbeitstage."
    ],
    "Miért nincs automatikus magyar ünnepnaplista?": ["Why is there no automatic Hungarian public-holiday list?", "Warum gibt es keine automatische ungarische Feiertagsliste?"],
    "Az ünnepnapok, áthelyezett munkanapok és egyedi munkarendek évről évre változhatnak. Az eszköz ezért tudatosan általános naptári számítást végez, és a speciális napokat rád bízza. Így régi vagy jövőbeli dátumtartományokra is használható anélkül, hogy elavult naptáradatokra támaszkodna.": [
      "Public holidays, shifted working days and special schedules can change from year to year. The tool therefore uses a general calendar calculation and lets you specify special days, so it can handle past or future ranges without relying on outdated calendar data.",
      "Feiertage, verlegte Arbeitstage und besondere Arbeitszeiten können sich jährlich ändern. Das Werkzeug berechnet deshalb allgemein nach Kalendertagen und überlässt dir die Sondertage. So lassen sich auch vergangene oder zukünftige Zeiträume ohne veraltete Kalenderdaten berechnen."
    ],
    "A kezdő és záró nap beleszámít?": ["Are the start and end dates included?", "Zählen Start- und Enddatum mit?"],
    "Igen. Ha hétköznapra esnek és nincsenek kizárva, mindkettőt beleszámítja.": ["Yes. Both are included if they fall on a weekday and are not excluded.", "Ja. Beide zählen mit, wenn sie auf einen Wochentag fallen und nicht ausgeschlossen sind."],
    "Az ünnepnapokat ismeri?": ["Does it know public holidays?", "Kennt der Rechner Feiertage?"],
    "Nem automatikusan. Az ünnepnapokat vagy más szünnapokat a kihagyandó dátumok mezőben adhatod meg.": ["Not automatically. Enter public holidays or other days off in the dates-to-exclude field.", "Nicht automatisch. Trage Feiertage oder andere freie Tage im Feld für auszuschließende Daten ein."],
    "Mi történik, ha hétvégi dátumot adok meg kizárásként?": ["What if I enter a weekend date as an exclusion?", "Was passiert, wenn ich ein Wochenenddatum ausschließe?"],
    "Nem csökkenti kétszer az eredményt: a hétvége eleve nem számít hétköznapnak.": ["It is not subtracted twice: weekend dates are not counted as weekdays in the first place.", "Das Ergebnis wird nicht doppelt gekürzt: Wochenendtage zählen von vornherein nicht als Wochentage."],
    "datum kulonbseg": ["Date difference", "Datumsdifferenz"],
    "fizetesi hatarido": ["Payment deadline", "Zahlungsfrist"],
    "Általános naptári segédeszköz. Nem alkalmaz automatikusan magyar munkaszüneti napokat, áthelyezett munkanapokat vagy munkajogi szabályokat.": ["A general calendar aid. It does not automatically apply Hungarian public holidays, shifted working days or employment rules.", "Ein allgemeines Kalenderwerkzeug. Es berücksichtigt ungarische Feiertage, verlegte Arbeitstage oder arbeitsrechtliche Regeln nicht automatisch."]
  });
  const overtime = Object.freeze({
    "Túlóra díj": ["Overtime pay", "Überstundenvergütung"],
    "Túlóra díj kalkulátor": ["Overtime pay calculator", "Überstundenrechner"],
    "Túlóra óradíj, teljes túlóradíj és a normál órabér feletti többlet kiszámítása saját szorzóval.": ["Calculate the overtime hourly rate, total overtime pay and premium over regular pay using your own multiplier.", "Berechne mit einem eigenen Faktor den Überstunden-Stundenlohn, die Gesamtvergütung und den Zuschlag gegenüber dem normalen Stundenlohn."],
    "Alap órabér (Ft)": ["Regular hourly wage (HUF)", "Regulärer Stundenlohn (HUF)"], "Túlóra (óra)": ["Overtime hours", "Überstunden"],
    "Elszámolási szorzó": ["Pay multiplier", "Abrechnungsfaktor"],
    "Alap órabér: adj meg érvényes számot.": ["Regular hourly wage: enter a valid number.", "Regulärer Stundenlohn: Gib eine gültige Zahl ein."],
    "Alap órabér: az érték legyen nagyobb nullánál.": ["Regular hourly wage: the value must be greater than zero.", "Regulärer Stundenlohn: Der Wert muss größer als null sein."],
    "Túlóra: adj meg érvényes számot.": ["Overtime hours: enter a valid number.", "Überstunden: Gib eine gültige Zahl ein."],
    "Túlóra: az érték nem lehet negatív.": ["Overtime hours cannot be negative.", "Die Überstunden dürfen nicht negativ sein."],
    "Elszámolási szorzó: adj meg érvényes számot.": ["Pay multiplier: enter a valid number.", "Abrechnungsfaktor: Gib eine gültige Zahl ein."],
    "Elszámolási szorzó: az érték legyen nagyobb nullánál.": ["The pay multiplier must be greater than zero.", "Der Abrechnungsfaktor muss größer als null sein."],
    "Például 1,5 = az alap órabér 150%-a.": ["For example, 1.5 means 150% of the regular hourly wage.", "Zum Beispiel bedeutet 1,5: 150 % des regulären Stundenlohns."],
    "Túlóra óradíja": ["Overtime hourly rate", "Stundenlohn für Überstunden"], "Túlóra óradíja:": ["Overtime hourly rate:", "Stundenlohn für Überstunden:"],
    "Teljes túlóradíj": ["Total overtime pay", "Gesamtvergütung für Überstunden"], "Teljes túlóradíj:": ["Total overtime pay:", "Gesamtvergütung für Überstunden:"],
    "Normál órabér feletti rész": ["Premium over regular pay", "Zuschlag gegenüber dem regulären Stundenlohn"], "Normál órabér feletti rész:": ["Premium over regular pay:", "Zuschlag gegenüber dem regulären Stundenlohn:"],
    "Hogyan működik a túlóra díj kalkulátor?": ["How does the overtime pay calculator work?", "Wie funktioniert der Überstundenrechner?"],
    "Az eszköz nem próbálja kitalálni, hogy egy adott munkaviszonyban milyen pótlék vagy elszámolási szabály jár. Ehelyett te adod meg az alap órabért, a túlórák számát és azt a szorzót, amellyel az órabért számolni szeretnéd.": [
      "The tool does not infer which premium or pay rule applies to a particular employment relationship. You enter the regular hourly wage, overtime hours and the multiplier to use.",
      "Das Werkzeug leitet nicht ab, welcher Zuschlag oder welche Abrechnungsregel für ein bestimmtes Arbeitsverhältnis gilt. Du gibst den regulären Stundenlohn, die Überstunden und den gewünschten Faktor ein."
    ],
    "A teljes túlóradíj képlete egyszerű: alap órabér × túlóra órák × szorzó. Külön megmutatjuk azt is, hogy ebből mennyi a normál órabérhez képest jelentkező többlet.": [
      "The total overtime pay is calculated as regular hourly wage × overtime hours × multiplier. The calculator also shows the premium over the regular hourly wage.",
      "Die Gesamtvergütung für Überstunden berechnet sich aus regulärem Stundenlohn × Überstunden × Faktor. Zusätzlich zeigt der Rechner den Zuschlag gegenüber dem regulären Stundenlohn."
    ],
    "3 000 Ft-os órabér, 8 túlóra és 1,5-ös szorzó esetén a túlóra óradíja 4 500 Ft, a teljes összeg 36 000 Ft. A normál 24 000 Ft-os nyolcórás díjhoz képest a többlet 12 000 Ft.": [
      "With a HUF 3,000 hourly wage, 8 overtime hours and a 1.5 multiplier, the overtime rate is HUF 4,500 and total pay is HUF 36,000. The premium over the regular HUF 24,000 for eight hours is HUF 12,000.",
      "Bei einem Stundenlohn von 3.000 HUF, 8 Überstunden und einem Faktor von 1,5 beträgt der Überstundenlohn 4.500 HUF und die Gesamtvergütung 36.000 HUF. Der Zuschlag gegenüber den regulären 24.000 HUF für acht Stunden beträgt 12.000 HUF."
    ],
    "Miért kell saját szorzót megadni?": ["Why do I need to enter my own multiplier?", "Warum muss ich einen eigenen Faktor angeben?"],
    "A pótlékok és elszámolások függhetnek a munkaszerződéstől, kollektív szerződéstől, a munkarendtől, a túlóra időpontjától és az aktuális szabályoktól. A szabadon megadható szorzó ezért átláthatóbb, mint egy olyan automatikus jogi feltételezés, amely könnyen félrevezető lehet.": [
      "Premiums and pay calculations can depend on the employment contract, collective agreement, schedule, timing of overtime and current rules. An adjustable multiplier is more transparent than an automatic legal assumption that could mislead.",
      "Zuschläge und Abrechnungen können vom Arbeitsvertrag, Tarifvertrag, Arbeitszeitmodell, Zeitpunkt der Überstunden und den geltenden Regeln abhängen. Ein frei wählbarer Faktor ist transparenter als eine automatische rechtliche Annahme, die irreführen könnte."
    ],
    "Mit jelent az 1,5-ös szorzó?": ["What does a 1.5 multiplier mean?", "Was bedeutet ein Faktor von 1,5?"],
    "Azt, hogy az adott túlóra óradíját az alap órabér 150%-ával számolod.": ["It means you calculate the overtime hourly rate at 150% of the regular wage.", "Damit berechnest du den Stundenlohn für Überstunden mit 150 % des regulären Lohns."],
    "Bruttó vagy nettó órabért adjak meg?": ["Should I enter a gross or net hourly wage?", "Soll ich einen Brutto- oder Nettostundenlohn eingeben?"],
    "Bármelyikkel számolhatsz, de az eredmény ugyanazon az alapon lesz. Bruttó bemenetből bruttó összeg, nettóból nettó összeg adódik.": ["Either works, but the result uses the same basis: gross input gives a gross result, and net input gives a net result.", "Beides ist möglich; das Ergebnis bleibt auf derselben Grundlage: Aus einem Bruttowert wird ein Brutto-, aus einem Nettowert ein Nettobetrag."],
    "Megmondja, milyen pótlék jár nekem?": ["Does it tell me which premium I am entitled to?", "Sagt der Rechner, welcher Zuschlag mir zusteht?"],
    "Nem. A kalkulátor a megadott szorzóval számol; a rád vonatkozó elszámolási szabályt külön kell ellenőrizned.": ["No. It uses the multiplier you enter; check the pay rules that apply to you separately.", "Nein. Er rechnet mit dem eingegebenen Faktor. Prüfe die für dich geltenden Abrechnungsregeln gesondert."],
    "Általános bérszámítás saját szorzóval. Nem állapít meg munkajogi jogosultságot, pótlékot vagy kötelező elszámolási módot.": ["A general pay calculation using your own multiplier. It does not determine employment-law entitlements, premiums or mandatory pay rules.", "Eine allgemeine Lohnberechnung mit eigenem Faktor. Sie bestimmt keine arbeitsrechtlichen Ansprüche, Zuschläge oder verbindlichen Abrechnungsregeln."],
    "oraber": ["Hourly wage", "Stundenlohn"], "munkaido": ["Working hours", "Arbeitszeit"], "netto brutto": ["Net–gross salary", "Netto–Brutto"]
  });
  const hourlyWage = Object.freeze({
    "Órabér kalkulátor": ["Hourly wage calculator", "Stundenlohnrechner"],
    "Munkaidő kalkulátor": ["Working hours calculator", "Arbeitszeitrechner"],
    "Nettó–bruttó": ["Net–gross salary", "Netto–Brutto"],
    "Számold ki az órabéred havi bér és munkaóra alapján.": ["Calculate your hourly wage from monthly pay and working hours.", "Berechne deinen Stundenlohn anhand von Monatsgehalt und Arbeitsstunden."],
    "Órabér-, túlóra- és pótlékkalkulátor": ["Hourly wage, overtime and premium calculator", "Rechner für Stundenlohn, Überstunden und Zuschläge"],
    "Nettó vagy bruttó havi bérből becsül alapórabért, túlórát, pótlékot és fizetett távolléti időt.": ["Estimate the regular hourly wage, overtime, premiums and paid leave from gross or net monthly pay.", "Schätze regulären Stundenlohn, Überstunden, Zuschläge und bezahlte Abwesenheit aus einem Brutto- oder Netto-Monatsgehalt."],
    "Megadott bér típusa": ["Pay basis", "Gehaltsart"], "Bruttó": ["Gross", "Brutto"], "Nettó": ["Net", "Netto"],
    "Havi alapbér (Ft)": ["Base monthly pay (HUF)", "Monatliches Grundgehalt (HUF)"], "Havi alapórák": ["Regular hours per month", "Reguläre Stunden pro Monat"],
    "Túlóra (óra)": ["Overtime hours", "Überstunden"], "Túlóra szorzó": ["Overtime multiplier", "Überstundenfaktor"],
    "Pótlékos órák": ["Premium hours", "Zuschlagsstunden"], "Pótlék (%)": ["Premium (%)", "Zuschlag (%)"],
    "Fizetett szabadság/távollét (óra)": ["Paid leave/absence (hours)", "Bezahlter Urlaub/Abwesenheit (Stunden)"],
    "Bruttó alapórabér": ["Gross regular hourly wage", "Brutto-Grundstundenlohn"],
    "Nettó alapórabér": ["Net regular hourly wage", "Netto-Grundstundenlohn"],
    "Túlóra díja": ["Overtime pay", "Überstundenvergütung"], "Pótlék": ["Premium", "Zuschlag"],
    "Fizetett távollét értéke": ["Value of paid absence", "Wert bezahlter Abwesenheit"],
    "Becsült teljes összeg": ["Estimated total", "Geschätzter Gesamtbetrag"],
    "Havi fizetés átszámítása óradíjra": ["Convert monthly pay to an hourly rate", "Monatsgehalt in Stundenlohn umrechnen"],
    "A kalkulátor a megadott havi bért elosztja a havi munkaórák számával, így egy egyszerű, összehasonlítható óradíjat ad. Ez különösen hasznos eltérő óraszámú állásajánlatok, részmunkaidő vagy változó havi munkaidő összevetésénél.": [
      "The calculator divides the entered monthly pay by monthly working hours to produce a simple, comparable hourly rate. This is useful for comparing job offers with different hours, part-time work or varying monthly schedules.",
      "Der Rechner teilt das eingegebene Monatsgehalt durch die monatlichen Arbeitsstunden und ermittelt so einen einfachen, vergleichbaren Stundenlohn. Das hilft beim Vergleich von Stellenangeboten mit unterschiedlichen Stunden, Teilzeit oder wechselnder Monatsarbeitszeit."
    ],
    "A kalkulátor nem dönti el, hogy a megadott összeg bruttó vagy nettó. Ha bruttó havi bért adsz meg, bruttó óradíjat kapsz; nettó bérből nettó óradíj készül.": [
      "The calculator does not determine whether your amount is gross or net. Gross monthly pay produces a gross hourly rate; net pay produces a net hourly rate.",
      "Der Rechner entscheidet nicht, ob der eingegebene Betrag brutto oder netto ist. Aus einem Brutto-Monatsgehalt wird ein Brutto-, aus einem Nettogehalt ein Netto-Stundenlohn."
    ],
    "A képlet": ["The formula", "Die Formel"], "Órabér = havi bér / havi munkaóra.": ["Hourly wage = monthly pay / monthly working hours.", "Stundenlohn = Monatsgehalt / monatliche Arbeitsstunden."],
    "A nyolcórás munkanap egyszerű értéke az órabér nyolcszorosa. Ez nem automatikusan azonos a munkajogi napi bérrel vagy a bérszámfejtés minden esetben használt alapjával.": [
      "The simple value of an eight-hour workday is eight times the hourly wage. This is not automatically the same as a legal daily wage or the basis used in every payroll calculation.",
      "Der einfache Wert eines Achtstundentags entspricht dem Achtfachen des Stundenlohns. Das ist nicht automatisch mit einem gesetzlichen Tageslohn oder der Grundlage jeder Lohnabrechnung gleichzusetzen."
    ],
    "600 000 Ft havi bér és 174 óra mellett az egyszerű óradíj körülbelül 3 448 Ft. Ugyanez 160 órával 3 750 Ft/óra, ezért ugyanaz a havi összeg eltérő munkaidő mellett más óradíjat jelent.": [
      "With monthly pay of HUF 600,000 and 174 hours, the simple hourly rate is about HUF 3,448. At 160 hours, the same pay gives HUF 3,750 per hour, so the same monthly amount means a different hourly rate when working hours change.",
      "Bei einem Monatsgehalt von 600.000 HUF und 174 Stunden beträgt der einfache Stundenlohn etwa 3.448 HUF. Bei 160 Stunden ergeben sich 3.750 HUF pro Stunde. Derselbe Monatsbetrag führt bei anderer Arbeitszeit also zu einem anderen Stundenlohn."
    ],
    "Miért fontos az óraszám?": ["Why do working hours matter?", "Warum sind die Arbeitsstunden wichtig?"],
    "Két azonos havi fizetésű állás nem feltétlenül azonos értékű, ha az egyikhez rendszeresen több munkaóra tartozik. Az óradíj ezért jó összehasonlító mutató, de a műszakpótlék, túlóra, bónusz, cafeteria, utazási idő és egyéb juttatások külön is számítanak.": [
      "Two jobs with the same monthly pay are not necessarily equal in value if one regularly requires more hours. The hourly rate is a useful comparison, but shift premiums, overtime, bonuses, benefits, travel time and other compensation also matter.",
      "Zwei Stellen mit gleichem Monatsgehalt sind nicht unbedingt gleichwertig, wenn eine regelmäßig mehr Arbeitsstunden erfordert. Der Stundenlohn ist ein hilfreicher Vergleichswert; Schichtzuschläge, Überstunden, Boni, Zusatzleistungen, Wegezeit und weitere Vorteile zählen ebenfalls."
    ],
    "Bruttó és nettó órabér": ["Gross and net hourly wages", "Brutto- und Netto-Stundenlohn"],
    "A bruttó órabér a levonások előtti, a nettó órabér a kézhez kapott összegből számított egyszerű arány. Ha két ajánlatot hasonlítasz össze, mindig azonos alapon számolj. Nettó összegek esetén az adókedvezmények miatt két ember eredménye eltérhet még azonos bruttó bér mellett is.": [
      "Gross hourly wage is a simple ratio based on pay before deductions; net hourly wage uses take-home pay. Use the same basis when comparing offers. Tax credits can make net results differ between people even with the same gross pay.",
      "Der Brutto-Stundenlohn basiert auf dem Gehalt vor Abzügen, der Netto-Stundenlohn auf dem Auszahlungsbetrag. Vergleiche Angebote immer auf derselben Grundlage. Wegen Steuervergünstigungen können Nettoergebnisse trotz gleichen Bruttogehalts unterschiedlich sein."
    ],
    "Alkalmazotti és vállalkozói óradíj nem ugyanaz": ["Employee and contractor hourly rates are not the same", "Stundenlohn als Angestellter und als Selbstständiger sind nicht dasselbe"],
    "Vállalkozóként az óradíjnak fedeznie kellhet a nem számlázható időt, adókat, adminisztrációt, eszközöket, szabadságot és üzleti kockázatot is. Emiatt egy alkalmazotti óradíj egyszerű átvétele vállalkozói díjnak félrevezető lehet.": [
      "For a contractor, the rate may also need to cover non-billable time, taxes, administration, equipment, leave and business risk. Simply reusing an employee hourly wage as a contractor rate can therefore be misleading.",
      "Als Selbstständiger muss der Stundensatz möglicherweise auch nicht abrechenbare Zeit, Steuern, Verwaltung, Ausrüstung, Urlaub und Geschäftsrisiken abdecken. Einen Angestellten-Stundenlohn einfach als Honorarsatz zu übernehmen, kann daher irreführend sein."
    ],
    "Bruttó havi bért nettó óradíjként értelmeznek.": ["Treating gross monthly pay as a net hourly rate.", "Brutto-Monatsgehalt als Netto-Stundenlohn verstehen."],
    "Átlagos 174 órát használnak egy konkrét, ettől jelentősen eltérő hónaphoz.": ["Using an average of 174 hours for a specific month that differs substantially.", "Den Durchschnitt von 174 Stunden für einen konkreten Monat verwenden, der deutlich davon abweicht."],
    "A túlórát vagy pótlékot kétszer számolják bele.": ["Counting overtime or a premium twice.", "Überstunden oder Zuschläge doppelt einrechnen."],
    "A teljes munkahelyen töltött időt automatikusan fizetett munkaórának tekintik.": ["Automatically treating all time at work as paid hours.", "Die gesamte Anwesenheitszeit automatisch als bezahlte Arbeitszeit ansehen."],
    "Egyszeri bónuszt állandó havi bérként számolnak.": ["Treating a one-off bonus as regular monthly pay.", "Einen einmaligen Bonus als festes Monatsgehalt ansetzen."],
    "Miért nem egyezik a bérpapírral?": ["Why does it differ from my payslip?", "Warum weicht das Ergebnis von meiner Gehaltsabrechnung ab?"],
    "A bérpapír pótlékokat, távolléteket, adókat, kedvezményeket és egyéb tételeket is tartalmazhat.": ["A payslip can include premiums, absences, taxes, credits and other items.", "Eine Gehaltsabrechnung kann Zuschläge, Abwesenheiten, Steuern, Vergünstigungen und weitere Posten enthalten."],
    "Részmunkaidőnél használható?": ["Can I use it for part-time work?", "Kann ich den Rechner für Teilzeitarbeit nutzen?"],
    "Igen. A tényleges havi bért és a hozzá tartozó tényleges vagy tervezett munkaórát add meg.": ["Yes. Enter the actual monthly pay and the corresponding actual or planned hours.", "Ja. Gib das tatsächliche Monatsgehalt und die dazugehörigen tatsächlichen oder geplanten Arbeitsstunden ein."],
    "Túlóradíjat számol?": ["Does it calculate overtime pay?", "Berechnet der Rechner Überstundenvergütung?"],
    "Nem. Az alapóradíjat mutatja, a túlóra és pótlék külön számítás.": ["No. It shows the base hourly rate; overtime and premiums are calculated separately.", "Nein. Er zeigt den Grundstundenlohn; Überstunden und Zuschläge werden getrennt berechnet."],
    "Melyik havi óraszámot használjam?": ["Which monthly hours should I use?", "Welche monatliche Stundenzahl soll ich verwenden?"],
    "Összehasonlításhoz használhatsz átlagot, konkrét hónaphoz viszont a tényleges elszámolt óraszám a jobb alap.": ["An average works for comparisons, but for a specific month use the actual recorded hours.", "Für Vergleiche kannst du einen Durchschnitt verwenden. Für einen bestimmten Monat sind die tatsächlich erfassten Stunden die bessere Grundlage."],
    "Állásajánlatok összevetésére elég az órabér?": ["Is the hourly rate enough to compare job offers?", "Reicht der Stundenlohn zum Vergleich von Stellenangeboten?"],
    "Nem önmagában. Érdemes figyelembe venni a munkaidőt, pótlékokat, juttatásokat, utazást, szabadságot és a munkarend kiszámíthatóságát is.": ["Not by itself. Also consider working hours, premiums, benefits, commuting, leave and schedule predictability.", "Nicht allein. Berücksichtige auch Arbeitszeit, Zuschläge, Zusatzleistungen, Arbeitsweg, Urlaub und Planbarkeit des Arbeitszeitmodells."],
    "Effektív órabér": ["Effective hourly wage", "Effektiver Stundenlohn"],
    "A fizetett órabér és az idődre vetített órabér eltérhet": ["Hourly pay and pay per hour of your total time can differ", "Stundenlohn und Vergütung je Stunde deines gesamten Zeitaufwands können abweichen"],
    "Havi nettó vagy bruttó bér (Ft)": ["Monthly net or gross pay (HUF)", "Monatliches Netto- oder Bruttogehalt (HUF)"],
    "Fizetett havi órák": ["Paid hours per month", "Bezahlte Stunden pro Monat"],
    "Tényleges jelenléti/utazással együtt vállalt órák": ["Actual hours committed, including presence and travel", "Tatsächlich gebundene Stunden einschließlich Anwesenheit und Arbeitsweg"],
    "Fizetett órára vetítve": ["Per paid hour", "Je bezahlter Stunde"],
    "Teljes időráfordításra vetítve": ["Per hour of total time", "Je Stunde des gesamten Zeitaufwands"], "Különbség": ["Difference", "Differenz"],
    "A „teljes időráfordítás” nem munkajogi bérfogalom; személyes összehasonlításhoz használható, például két állásajánlat között.": [
      "“Total time committed” is not an employment-law pay concept; it can be useful for personal comparisons, such as between two job offers.",
      "„Gesamter Zeitaufwand“ ist kein arbeitsrechtlicher Lohnbegriff. Er kann für persönliche Vergleiche nützlich sein, etwa zwischen zwei Stellenangeboten."
    ],
    "Miből áll össze az órabér-becslés?": ["How is the hourly wage estimate calculated?", "Wie setzt sich die Stundenlohnschätzung zusammen?"],
    "A megadott havi bért a havi alapórák számával osztja, majd a külön megadott túlóra-szorzót, pótlékszázalékot és óraszámokat alkalmazza. A nettó mód a már megadott nettó összegből számol; nem végzi el helyetted az adó- és járulékszámítást, ezért bérszámfejtésre nem használható.": [
      "It divides monthly pay by regular monthly hours, then applies the entered overtime multiplier, premium percentage and hours. Net mode uses the net amount you provide; it does not calculate taxes or contributions and is not a payroll tool.",
      "Der Rechner teilt das Monatsgehalt durch die monatlichen Grundstunden und berücksichtigt anschließend den eingegebenen Überstundenfaktor, Zuschlagsprozentsatz und die jeweiligen Stunden. Im Nettomodus wird der eingegebene Nettobetrag verwendet; Steuern und Beiträge werden nicht berechnet, daher eignet sich das Ergebnis nicht für die Lohnabrechnung."
    ]
  });
  const utilitySplit = Object.freeze({
    "Rezsi megosztás kalkulátor": ["Shared household costs calculator", "Rechner zur Aufteilung gemeinsamer Haushaltskosten"],
    "Oszd szét a közös költségeket lakótársak vagy családtagok között.": ["Split shared expenses among housemates or family members.", "Teile gemeinsame Kosten unter Mitbewohnern oder Familienmitgliedern auf."],
    "Rezsi- és közösköltség-megosztó": ["Utilities and shared costs splitter", "Rechner zur Aufteilung von Nebenkosten und Gemeinschaftskosten"],
    "Egyenlő, naparányos, szobaméret- vagy fogyasztásarányos elszámolás három személyre.": ["Split costs among three people equally or by days, room size or consumption.", "Teile Kosten für drei Personen zu gleichen Teilen oder nach Tagen, Zimmergröße oder Verbrauch auf."],
    "Megosztandó összeg (Ft)": ["Amount to split (HUF)", "Aufzuteilender Betrag (HUF)"], "Megosztás módja": ["Allocation method", "Aufteilungsmethode"],
    "Egyenlő": ["Equal", "Gleich"], "Bent töltött napok": ["Days lived in", "Anzahl der Aufenthaltstage"],
    "Szobaméret": ["Room size", "Zimmergröße"], "Mért fogyasztás": ["Measured consumption", "Gemessener Verbrauch"],
    "A személy lakónapjai": ["Person A days at home", "Aufenthaltstage Person A"],
    "B személy lakónapjai": ["Person B days at home", "Aufenthaltstage Person B"],
    "C személy lakónapjai": ["Person C days at home", "Aufenthaltstage Person C"],
    "Lakónap-alapú költségmegosztás": ["Cost sharing based on days lived in", "Kostenaufteilung nach Aufenthaltstagen"],
    "Ha valaki csak a hónap felében lakott ott, az egyenlő harmadolás torzíthat": ["If someone lived there for only half the month, an equal three-way split can be misleading", "Wenn jemand nur den halben Monat dort gewohnt hat, kann eine gleichmäßige Drittelung verzerren"],
    "Megosztandó költség (Ft)": ["Cost to split (HUF)", "Aufzuteilende Kosten (HUF)"],
    "Ez csak egy lehetséges igazságossági szabály. Fogyasztásmérő, szobaméret vagy fix alapdíj esetén más megosztás lehet indokolt.": ["This is only one possible fairness rule. A different split may make sense when there are meters, different room sizes or a fixed base fee.", "Das ist nur eine mögliche Fairnessregel. Bei Zählern, unterschiedlichen Zimmergrößen oder festen Grundgebühren kann eine andere Aufteilung sinnvoll sein."],
    "1. személy súlya/adata": ["Person 1 weight/value", "Gewicht/Wert für Person 1"],
    "2. személy súlya/adata": ["Person 2 weight/value", "Gewicht/Wert für Person 2"],
    "3. személy súlya/adata": ["Person 3 weight/value", "Gewicht/Wert für Person 3"],
    "1. személy része": ["Person 1 share", "Anteil Person 1"], "2. személy része": ["Person 2 share", "Anteil Person 2"], "3. személy része": ["Person 3 share", "Anteil Person 3"],
    "A része": ["Person A share", "Anteil Person A"], "B része": ["Person B share", "Anteil Person B"], "C része": ["Person C share", "Anteil Person C"],
    "Ellenőrző összeg": ["Check total", "Kontrollsumme"],
    "A megosztási súlyok összege legyen pozitív.": ["The sum of allocation weights must be positive.", "Die Summe der Aufteilungsgewichte muss positiv sein."],
    "Közös háztartási költségek egyszerű elosztása": ["A simple way to split shared household costs", "Gemeinsame Haushaltskosten einfach aufteilen"],
    "A rezsimegosztás kalkulátor a közösen fizetendő teljes költséget egyenlő részekre osztja, majd a saját részedhez hozzá tud adni egy csak rád vonatkozó extra tételt. Albérletben, közös nyaraláson vagy többgenerációs háztartásban gyors kiindulópontot adhat az elszámoláshoz.": [
      "The shared-cost calculator divides the total bill equally, then lets you add an extra item that applies only to you. It can provide a quick starting point for settling expenses in a shared rental, group holiday or multigenerational household.",
      "Der Rechner teilt die gemeinsamen Gesamtkosten gleichmäßig auf und ermöglicht anschließend einen zusätzlichen Posten, der nur dich betrifft. Das bietet einen schnellen Ausgangspunkt für die Abrechnung in einer Wohngemeinschaft, im gemeinsamen Urlaub oder im Mehrgenerationenhaushalt."
    ],
    "Az egyenlő fejenkénti elosztás nem minden helyzetben igazságos. Eltérő szobaméret, külön mérőóra, különböző beköltözési idő, otthoni munkavégzés vagy egyedi fogyasztás esetén más módszer lehet célszerű.": [
      "An equal split is not fair in every situation. Different room sizes, separate meters, different move-in dates, working from home or individual consumption may call for another method.",
      "Eine gleichmäßige Aufteilung ist nicht in jeder Situation gerecht. Unterschiedliche Zimmergrößen, separate Zähler, verschiedene Einzugsdaten, Homeoffice oder individueller Verbrauch können eine andere Methode erfordern."
    ],
    "A számítás menete": ["How the calculation works", "So funktioniert die Berechnung"],
    "Az alap rész képlete:": ["The base share is calculated as:", "Der Grundanteil berechnet sich wie folgt:"],
    "teljes közös költség / résztvevők száma": ["total shared costs / number of participants", "gesamte Gemeinschaftskosten / Anzahl der Beteiligten"],
    ". A saját fizetendő összeg ehhez hozzáadja a „saját extra költség” mező értékét. Az extra tétel nem oszlik meg a többiek között.": [". Your amount due adds the value in the “personal extra cost” field. The extra is not shared with the others.", ". Dein Zahlbetrag erhöht sich um den Wert im Feld „eigene Zusatzkosten“. Dieser Posten wird nicht auf die anderen verteilt."],
    "Példa három lakótárssal": ["Example with three housemates", "Beispiel mit drei Mitbewohnern"],
    "Ha a közös villany-, víz- és internetköltség összesen 72 000 Ft, három embernél az alap rész 24 000 Ft fejenként. Ha az egyik lakóhoz tartozik még 3 500 Ft külön televíziós csomag, az ő fizetendő összege 27 500 Ft.": [
      "If shared electricity, water and internet cost HUF 72,000 in total, the base share for three people is HUF 24,000 each. If one housemate also has a separate HUF 3,500 TV package, their amount due is HUF 27,500.",
      "Betragen gemeinsame Strom-, Wasser- und Internetkosten insgesamt 72.000 HUF, entfallen bei drei Personen 24.000 HUF auf jede Person. Hat eine Person zusätzlich ein eigenes TV-Paket für 3.500 HUF, zahlt sie 27.500 HUF."
    ],
    "Más elosztási módszerek": ["Other allocation methods", "Andere Aufteilungsmethoden"],
    "A kalkulátor az egyszerű fejenkénti módszert használja. Fogyasztásarányos elszámoláshoz almérő, naparányos elszámoláshoz az adott időszakban lakott napok száma, jövedelemarányos megosztáshoz pedig előre rögzített százalékok szükségesek. Ezeket közösen és átláthatóan érdemes meghatározni.": [
      "The calculator uses a simple per-person split. Consumption-based allocation needs sub-meters, day-based allocation needs the number of days lived there, and income-based allocation needs agreed percentages. Decide on these openly together.",
      "Der Rechner teilt einfach nach Personen auf. Für eine verbrauchsabhängige Aufteilung braucht es Zwischenzähler, für eine tageweise Aufteilung die Aufenthaltstage und für eine einkommensabhängige Aufteilung vorher vereinbarte Prozentsätze. Legt diese transparent gemeinsam fest."
    ],
    "Milyen elv alapján osztja szét a közös költséget?": ["How does it allocate shared costs?", "Nach welchem Prinzip teilt der Rechner gemeinsame Kosten auf?"],
    "Egyenlő megosztásnál minden résztvevő azonos súlyt kap; nap-, alapterület- vagy fogyasztásarányos módban a három megadott érték aránya dönti el a részesedést. A kalkulátor a teljes összeget ezekkel a súlyokkal osztja fel, és ellenőrző összeggel segít kiszúrni az eltérést.": [
      "With an equal split, everyone gets the same weight. In day-, floor-area- or consumption-based modes, each person's share follows the ratio of the three entered values. The calculator divides the total using those weights and shows a check total to help spot discrepancies.",
      "Bei gleicher Aufteilung erhält jede Person dasselbe Gewicht. In der tage-, flächen- oder verbrauchsabhängigen Variante richtet sich der Anteil nach dem Verhältnis der drei eingegebenen Werte. Der Rechner teilt den Gesamtbetrag anhand dieser Gewichte auf und zeigt eine Kontrollsumme."
    ],
    "Olyan személyt is beleszámítanak, aki az adott időszakban nem lakott ott.": ["Including someone who did not live there during the period.", "Eine Person einbeziehen, die im betreffenden Zeitraum nicht dort gewohnt hat."],
    "A saját extra költséget véletlenül a teljes közös összegbe és külön is beírják.": ["Accidentally including a personal extra in both the shared total and separately.", "Eigene Zusatzkosten versehentlich in die Gemeinschaftssumme und nochmals separat eintragen."],
    "A jóváírásokat vagy korábbi túlfizetést kihagyják.": ["Leaving out credits or previous overpayments.", "Gutschriften oder frühere Überzahlungen nicht berücksichtigen."],
    "Nincs tisztázva, mely költségek közösek és melyek egyéniek.": ["Not clarifying which costs are shared and which are individual.", "Nicht klären, welche Kosten gemeinsam und welche individuell sind."],
    "Negatív extra költséget is megadhatok?": ["Can I enter a negative extra cost?", "Kann ich negative Zusatzkosten eingeben?"],
    "Technikailag használható jóváírásként, de az elszámolást érdemes külön is dokumentálni.": ["Technically it can be used as a credit, but the settlement should also be documented separately.", "Technisch kann der Wert als Gutschrift dienen; die Abrechnung sollte trotzdem separat dokumentiert werden."],
    "Naparányosan is számol?": ["Can it split costs by days?", "Kann der Rechner tageweise aufteilen?"],
    "Nem. Ehhez előbb külön ki kell számolni az egyes személyek súlyát vagy naparányát.": ["No. First calculate each person's weight or day share separately.", "Nein. Berechne zuerst das Gewicht oder den Tagesanteil jeder Person separat."],
    "A kauciót is osszam itt?": ["Should I split the deposit here too?", "Soll ich die Kaution hier ebenfalls aufteilen?"],
    "A kaució nem havi rezsi, ezért célszerű külön elszámolni.": ["A deposit is not a monthly utility cost, so it is better to settle it separately.", "Eine Kaution ist keine monatliche Nebenkostenposition und sollte daher separat abgerechnet werden."],
    "Mit tegyünk kerekítési különbségnél?": ["What should we do with rounding differences?", "Wie gehen wir mit Rundungsdifferenzen um?"],
    "A néhány forintos eltérést egy ember vállalhatja, vagy a következő hónapban korrigálhatjátok.": ["One person can cover a small difference of a few forints, or you can adjust it next month.", "Eine Person kann eine kleine Differenz von wenigen Forint übernehmen oder ihr gleicht sie im nächsten Monat aus."],
    "Borravaló és számla megosztás": ["Tip and bill splitter", "Trinkgeld- und Rechnungsaufteilung"],
    "Havi költségvetés": ["Monthly budget", "Monatsbudget"], "Százalék kalkulátor": ["Percentage calculator", "Prozentrechner"]
  });
  const recipe = Object.freeze({
    "Recept adag átszámító": ["Recipe serving converter", "Rezeptportionen umrechnen"],
    "Recept adag átszámító kalkulátor": ["Recipe serving conversion calculator", "Rechner zum Umrechnen von Rezeptportionen"],
    "Recept hozzávalóinak átszámítása más adagszámra, több hozzávaló egyszerre történő skálázásával.": ["Scale several recipe ingredients at once for a different number of servings.", "Skaliere mehrere Rezeptzutaten gleichzeitig für eine andere Portionszahl."],
    "Eredeti adagszám": ["Original servings", "Ursprüngliche Portionen"], "Kívánt adagszám": ["Desired servings", "Gewünschte Portionen"],
    "Hozzávalók": ["Ingredients", "Zutaten"],
    "Soronként: név; mennyiség; egység. Például: Liszt;500;g": ["One per line: name; amount; unit. For example: Flour;500;g", "Eine Zutat pro Zeile: Name; Menge; Einheit. Beispiel: Mehl;500;g"],
    "Átszámítási szorzó": ["Scaling factor", "Umrechnungsfaktor"], "Átszámítási szorzó:": ["Scaling factor:", "Umrechnungsfaktor:"],
    "Hogyan skálázza a receptet?": ["How does it scale the recipe?", "Wie skaliert der Rechner das Rezept?"],
    "A kalkulátor először kiszámítja a kívánt és az eredeti adagszám arányát. Ezzel a szorzóval módosítja minden megadott hozzávaló mennyiségét, ezért ugyanazt a receptet kisebb vagy nagyobb társaságra is gyorsan át lehet számítani.": [
      "The calculator first finds the ratio between the desired and original number of servings. It multiplies each ingredient amount by this factor, making it easy to scale the same recipe up or down.",
      "Der Rechner ermittelt zuerst das Verhältnis zwischen gewünschter und ursprünglicher Portionszahl. Mit diesem Faktor passt er jede Zutatenmenge an, sodass sich dasselbe Rezept schnell für mehr oder weniger Personen umrechnen lässt."
    ],
    "A hozzávalókat külön sorokban add meg, három adattal: név, mennyiség és egység. Az egységet nem alakítja át, csak a számszerű mennyiséget skálázza.": [
      "Enter each ingredient on a separate line with three fields: name, amount and unit. The calculator does not convert units; it only scales the numeric amount.",
      "Gib jede Zutat in einer eigenen Zeile mit drei Angaben ein: Name, Menge und Einheit. Der Rechner wandelt Einheiten nicht um, sondern skaliert nur den Zahlenwert."
    ],
    "Egy 4 adagos receptet 6 adagra növelve a szorzó 6/4 = 1,5. Így 500 g lisztből 750 g, 300 ml tejből 450 ml, 2 tojásból pedig matematikailag 3 darab lesz.": [
      "Scaling a recipe from 4 to 6 servings gives a factor of 6/4 = 1.5. That turns 500 g of flour into 750 g, 300 ml of milk into 450 ml and 2 eggs into a mathematical result of 3 pieces.",
      "Wird ein Rezept von 4 auf 6 Portionen erhöht, beträgt der Faktor 6/4 = 1,5. Aus 500 g Mehl werden 750 g, aus 300 ml Milch 450 ml und aus 2 Eiern rechnerisch 3 Stück."
    ],
    "Mennyiségi arányosítás.": ["Quantity scaling.", "Mengenanpassung."],
    "Mikor kell kézzel korrigálni?": ["When should I adjust the result by hand?", "Wann sollte ich das Ergebnis manuell anpassen?"],
    "A sütés-főzés nem mindig lineáris. Fűszereknél, sózásnál, sűrítőanyagoknál vagy tojásnál gyakran érdemes kerekíteni és kóstolással finomhangolni. A tepsi mérete, sütési idő és hőátadás sem feltétlenül skálázódik az adagszámmal.": [
      "Cooking does not always scale linearly. For spices, salt, thickening agents or eggs, rounding and adjusting to taste is often sensible. Pan size, cooking time and heat transfer may not scale with the number of servings either.",
      "Kochen und Backen skalieren nicht immer linear. Bei Gewürzen, Salz, Bindemitteln oder Eiern ist es oft sinnvoll, zu runden und nach Geschmack anzupassen. Blechgröße, Garzeit und Wärmeübertragung lassen sich ebenfalls nicht zwingend proportional zur Portionszahl skalieren."
    ],
    "Tizedes mennyiséget is elfogad?": ["Does it accept decimal amounts?", "Akzeptiert der Rechner Dezimalmengen?"],
    "Igen, ponttal vagy tizedesvesszővel is megadhatsz mennyiséget.": ["Yes. Enter amounts using a decimal point or comma.", "Ja. Mengen können mit Dezimalpunkt oder Dezimalkomma eingegeben werden."],
    "Átváltja a grammot dekagrammra?": ["Does it convert grams to decagrams?", "Rechnet er Gramm in Dekagramm um?"],
    "Nem. A megadott egységet változatlanul hagyja, csak a mennyiséget szorozza fel vagy le.": ["No. It keeps the entered unit and only scales the amount up or down.", "Nein. Die eingegebene Einheit bleibt gleich; nur die Menge wird hoch- oder herunterskaliert."],
    "Mi történik a darabos hozzávalókkal?": ["What happens to ingredients counted in pieces?", "Was passiert bei Zutaten, die stückweise gezählt werden?"],
    "Matematikai eredményt kapsz, amelyet a gyakorlatban szükség esetén egész darabra kell kerekíteni.": ["You get a mathematical result, which may need to be rounded to whole pieces in practice.", "Du erhältst ein mathematisches Ergebnis, das in der Praxis gegebenenfalls auf ganze Stück gerundet werden muss."],
    "Mennyiségi arányosítás. A recept technológiai tulajdonságai, sütési idő és ízesítés nem feltétlenül változik lineárisan az adagszámmal.": [
      "The calculator scales quantities proportionally. A recipe's technical properties, cooking time and seasoning do not necessarily change linearly with the number of servings.",
      "Der Rechner passt Mengen proportional an. Die Eigenschaften des Rezepts, die Garzeit und die Würzung verändern sich nicht zwingend linear mit der Portionszahl."
    ],
    "egysegar": ["Unit price", "Grundpreis"], "terfogat atvalto": ["Volume converter", "Volumenumrechner"], "tomeg atvalto": ["Weight converter", "Gewichtsumrechner"],
    "Adj meg legalább egy hozzávalót.": ["Enter at least one ingredient.", "Gib mindestens eine Zutat ein."],
    "A(z) 1. sor formátuma hibás.": ["Line 1 has an invalid format.", "Zeile 1 hat ein ungültiges Format."]
  });
  const electricityCost = Object.freeze({
    "Villanyfogyasztás költség kalkulátor": ["Electricity consumption cost calculator", "Rechner für Stromverbrauchskosten"],
    "Villanyfogyasztás költség": ["Electricity consumption cost", "Stromverbrauchskosten"],
    "Becsüld meg egy elektromos készülék energiafogyasztását és költségét teljesítmény, napi használati idő, időszak és kWh-ár alapján.": ["Estimate an appliance's energy use and cost from its power, daily usage, period and price per kWh.", "Schätze Stromverbrauch und Kosten eines Geräts anhand von Leistung, täglicher Nutzungsdauer, Zeitraum und Preis pro kWh."],
    "Készülék teljesítménye (W)": ["Appliance power (W)", "Geräteleistung (W)"], "Használat naponta (óra)": ["Daily use (hours)", "Tägliche Nutzung (Stunden)"],
    "Időszak (nap)": ["Period (days)", "Zeitraum (Tage)"], "Villamosenergia ára (Ft/kWh)": ["Electricity price (HUF/kWh)", "Strompreis (HUF/kWh)"],
    "Napi fogyasztás": ["Daily consumption", "Täglicher Verbrauch"], "Napi fogyasztás:": ["Daily consumption:", "Täglicher Verbrauch:"],
    "Időszak fogyasztása": ["Consumption for period", "Verbrauch im Zeitraum"], "Időszak fogyasztása:": ["Consumption for period:", "Verbrauch im Zeitraum:"],
    "Napi becsült költség": ["Estimated daily cost", "Geschätzte Tageskosten"], "Napi becsült költség:": ["Estimated daily cost:", "Geschätzte Tageskosten:"],
    "Időszak becsült költsége": ["Estimated cost for period", "Geschätzte Kosten im Zeitraum"], "Időszak becsült költsége:": ["Estimated cost for period:", "Geschätzte Kosten im Zeitraum:"],
    "Hogyan számolható egy készülék villanyköltsége?": ["How can you estimate an appliance's electricity cost?", "Wie lassen sich die Stromkosten eines Geräts berechnen?"],
    "A névleges teljesítményt wattból kilowattra kell átváltani, majd meg kell szorozni a használati idővel. Egy 1500 W-os készülék 2 órás működés mellett elméletileg 1,5 kW × 2 h = 3 kWh energiát használ naponta. A költséghez ezt kell megszorozni a tényleges Ft/kWh árral.": [
      "Convert the rated power from watts to kilowatts, then multiply it by the usage time. A 1,500 W appliance running for 2 hours theoretically uses 1.5 kW × 2 h = 3 kWh per day. Multiply this by your actual price per kWh to estimate the cost.",
      "Rechne die Nennleistung von Watt in Kilowatt um und multipliziere sie mit der Nutzungsdauer. Ein Gerät mit 1.500 W verbraucht bei zwei Stunden Betrieb theoretisch 1,5 kW × 2 h = 3 kWh pro Tag. Für die Kosten multiplizierst du diesen Wert mit deinem tatsächlichen Preis pro kWh."
    ],
    "A kalkulátor a napi fogyasztást, a teljes időszak fogyasztását, valamint a napi és összes becsült költséget is megmutatja.": ["The calculator shows daily consumption, total consumption for the period, and estimated daily and total costs.", "Der Rechner zeigt den Tagesverbrauch, den Gesamtverbrauch im Zeitraum sowie die geschätzten Tages- und Gesamtkosten."],
    "Névleges teljesítmény és valós fogyasztás": ["Rated power and actual consumption", "Nennleistung und tatsächlicher Verbrauch"],
    "Sok készülék nem folyamatosan működik a névleges teljesítményén. Termosztátos fűtőeszköz, hűtő, klíma vagy szabályozott motor esetén a tényleges átlagfogyasztás alacsonyabb vagy változó lehet. Pontosabb becsléshez konnektoros fogyasztásmérő vagy a készülék mért energiaadata használható.": [
      "Many appliances do not run continuously at their rated power. For a thermostat-controlled heater, refrigerator, air conditioner or regulated motor, actual average consumption may be lower or vary. A plug-in energy meter or measured device data can provide a more accurate estimate.",
      "Viele Geräte laufen nicht dauerhaft mit ihrer Nennleistung. Bei thermostatisch geregelten Heizgeräten, Kühlschränken, Klimaanlagen oder geregelten Motoren kann der tatsächliche Durchschnittsverbrauch niedriger sein oder schwanken. Ein Steckdosen-Energiekostenmessgerät oder gemessene Gerätedaten ermöglichen eine genauere Schätzung."
    ],
    "Példa": ["Example", "Beispiel"],
    "1500 W teljesítmény, napi 2 óra használat és 30 nap esetén az elméleti fogyasztás 90 kWh. 70 Ft/kWh egységárral ez kb. 6300 Ft költséget jelent.": ["At 1,500 W, 2 hours of daily use and 30 days, theoretical consumption is 90 kWh. At HUF 70/kWh, that is an estimated cost of about HUF 6,300.", "Bei 1.500 W, zwei Stunden täglicher Nutzung und 30 Tagen beträgt der theoretische Verbrauch 90 kWh. Bei 70 HUF/kWh ergeben sich geschätzte Kosten von etwa 6.300 HUF."],
    "Milyen árat adj meg?": ["Which price should I enter?", "Welchen Preis soll ich eingeben?"],
    "A számládon vagy szolgáltatói tájékoztatóban szereplő, a saját fogyasztásodra érvényes egységárat használd. A kalkulátor nem ismeri automatikusan a tarifádat, kedvezményes sávodat, rendszerhasználati díjaidat vagy egyéb számlatételeidet.": ["Use the unit price shown on your bill or provider information that applies to your consumption. The calculator does not automatically know your tariff, discounted usage band, network fees or other bill items.", "Verwende den auf deiner Rechnung oder in den Anbieterinformationen genannten Preis, der für deinen Verbrauch gilt. Der Rechner kennt deinen Tarif, vergünstigte Verbrauchsstufen, Netzentgelte oder andere Rechnungspositionen nicht automatisch."],
    "A 1500 W azt jelenti, hogy mindig ennyit fogyaszt?": ["Does 1,500 W mean it always uses that much?", "Bedeutet 1.500 W, dass das Gerät immer so viel verbraucht?"],
    "Nem feltétlenül. Ez jellemzően névleges vagy maximális teljesítmény; szabályozott készülékek átlagos fogyasztása eltérhet.": ["Not necessarily. This is usually rated or maximum power; regulated appliances can have different average consumption.", "Nicht unbedingt. Dabei handelt es sich meist um Nenn- oder Höchstleistung; der Durchschnittsverbrauch geregelter Geräte kann abweichen."],
    "A teljes villanyszámlát megkapom?": ["Will this give me my full electricity bill?", "Erhalte ich damit den Gesamtbetrag meiner Stromrechnung?"],
    "Nem. Ez egy készülék energia-költség becslése, és nem tartalmaz minden fix vagy egyéb számlatételt.": ["No. It estimates the energy cost of one appliance and does not include every fixed or other bill item.", "Nein. Der Rechner schätzt die Energiekosten eines einzelnen Geräts und berücksichtigt nicht alle festen oder sonstigen Rechnungspositionen."],
    "Több készüléket hogyan számoljak?": ["How do I calculate several appliances?", "Wie berechne ich mehrere Geräte?"],
    "Számold ki őket külön, majd add össze az időszakra kapott kWh- és költségértékeket.": ["Calculate each one separately, then add the consumption and cost values for the period.", "Berechne jedes Gerät einzeln und addiere anschließend Verbrauch und Kosten für den Zeitraum."],
    "rezsi megosztas": ["Shared household costs", "Nebenkostenaufteilung"], "teljesitmeny atvalto": ["Power converter", "Leistungsumrechner"], "energia atvalto": ["Energy converter", "Energieumrechner"],
    "A számítás névleges teljesítményből és megadott használati időből készül. A tényleges fogyasztás szabályozott készülékeknél és valós használat mellett eltérhet.": ["The estimate uses rated power and the usage time you enter. Actual consumption can differ for regulated appliances and in real-world use.", "Die Schätzung basiert auf Nennleistung und eingegebener Nutzungsdauer. Bei geregelten Geräten und im tatsächlichen Betrieb kann der Verbrauch abweichen."]
  });
  const waterCost = Object.freeze({
    "Vízfogyasztás költség kalkulátor": ["Water consumption cost calculator", "Rechner für Wasserkosten"],
    "Vízfogyasztás költsége": ["Water consumption cost", "Wasserkosten"],
    "Vízfogyasztás köbméterben és becsült költség számítása napi literből, időszakból és saját m³-árral.": ["Calculate water use in cubic metres and estimate costs from daily litres, a period and your own price per m³.", "Berechne den Wasserverbrauch in Kubikmetern und schätze die Kosten anhand täglicher Liter, eines Zeitraums und deines Preises pro m³."],
    "Napi fogyasztás (liter)": ["Daily consumption (litres)", "Täglicher Verbrauch (Liter)"], "Időszak (nap)": ["Period (days)", "Zeitraum (Tage)"], "Saját díj (Ft/m³)": ["Your price (HUF/m³)", "Eigener Preis (HUF/m³)"], "Fix díj az időszakra (Ft)": ["Fixed charge for period (HUF)", "Feste Gebühr für den Zeitraum (HUF)"],
    "Teljes fogyasztás": ["Total consumption", "Gesamtverbrauch"], "Teljes fogyasztás:": ["Total consumption:", "Gesamtverbrauch:"],
    "Fogyasztás": ["Consumption", "Verbrauch"], "Fogyasztás:": ["Consumption:", "Verbrauch:"],
    "Változó díj": ["Variable charge", "Verbrauchsabhängige Kosten"], "Változó díj:": ["Variable charge:", "Verbrauchsabhängige Kosten:"],
    "Becsült összes költség": ["Estimated total cost", "Geschätzte Gesamtkosten"], "Becsült összes költség:": ["Estimated total cost:", "Geschätzte Gesamtkosten:"],
    "Hogyan számolható a vízfogyasztás költsége?": ["How can water costs be calculated?", "Wie lassen sich Wasserkosten berechnen?"],
    "A napi literfogyasztást megszorozzuk az időszak napjaival, majd ezerrel osztva köbméterre váltjuk. A változó költség a köbméter és az általad megadott Ft/m³ díj szorzata. Ha az adott számlázásban fix díj is van, azt külön mezőben hozzáadhatod.": ["Multiply daily litres by the number of days, then divide by 1,000 to convert to cubic metres. Variable cost is the cubic metres multiplied by your price per m³. If the bill includes a fixed charge, add it in the separate field.", "Multipliziere die täglichen Liter mit der Anzahl der Tage und teile anschließend durch 1.000, um in Kubikmeter umzurechnen. Die variablen Kosten ergeben sich aus Kubikmetern mal deinem Preis pro m³. Eine feste Gebühr kannst du im separaten Feld ergänzen."],
    "Az egységár szándékosan kézzel megadható. A víz- és csatornadíj település, szolgáltató, felhasználási mód és díjstruktúra szerint eltérhet, ezért az aktuális számládról vagy szolgáltatói tájékoztatóból érdemes kiolvasni a saját összevont vagy releváns egységáradat.": ["The price is entered manually because water and sewer charges vary by location, provider, use and tariff structure. Check your current bill or provider information for the combined or relevant unit price.", "Der Preis wird bewusst manuell eingegeben, da Wasser- und Abwassergebühren je nach Ort, Anbieter, Nutzung und Tarifstruktur variieren. Den maßgeblichen Gesamt- oder Einzelpreis findest du auf deiner aktuellen Rechnung oder in den Anbieterinformationen."],
    "Napi 300 liter 30 napon át 9 000 liter, azaz 9 m³. 800 Ft/m³ saját egységárral ez 7 200 Ft változó költséget jelent; fix díj nélkül az összes becslés is 7 200 Ft.": ["At 300 litres per day for 30 days, usage is 9,000 litres, or 9 m³. At your price of HUF 800/m³, the variable cost is HUF 7,200; without a fixed charge, the estimated total is also HUF 7,200.", "Bei 300 Litern täglich über 30 Tage beträgt der Verbrauch 9.000 Liter beziehungsweise 9 m³. Bei einem eigenen Preis von 800 HUF/m³ liegen die variablen Kosten bei 7.200 HUF; ohne feste Gebühr entspricht dies auch den geschätzten Gesamtkosten."],
    "Mire jó a napi literes megközelítés?": ["What is the daily-litre method useful for?", "Wofür eignet sich die Berechnung anhand täglicher Liter?"],
    "Használható háztartási becslésre, egy készülék vagy tevékenység hatásának modellezésére, illetve spórolási forgatókönyvek összehasonlítására. Ha már ismered a mérőóra szerinti köbméterfogyasztást, abból közvetlenebb számítás készíthető.": ["It can estimate household use, model the effect of an appliance or activity, and compare savings scenarios. If you already know cubic-metre usage from a meter, you can calculate more directly from that figure.", "Die Methode eignet sich für Haushaltsschätzungen, zur Modellierung des Einflusses eines Geräts oder einer Tätigkeit und zum Vergleich von Sparszenarien. Wenn du den Zählerverbrauch in Kubikmetern kennst, kannst du direkter damit rechnen."],
    "A csatornadíj benne van?": ["Is the sewer charge included?", "Ist die Abwassergebühr enthalten?"],
    "Csak akkor, ha a saját Ft/m³ mezőben olyan összeget adsz meg, amely ezt is tartalmazza, vagy a fix díjjal kiegészíted a modellt.": ["Only if your HUF/m³ price includes it, or you add it through the fixed-charge field.", "Nur wenn dein Preis pro m³ die Gebühr einschließt oder du sie über das Feld für feste Gebühren ergänzt."],
    "Miért nincs beépített tarifa?": ["Why is there no built-in tariff?", "Warum gibt es keinen hinterlegten Tarif?"],
    "A díjak szolgáltatónként és felhasználónként eltérhetnek és változhatnak, ezért az eszköz a saját aktuális egységároddal számol.": ["Charges vary and can change by provider and user, so the calculator uses your current unit price.", "Gebühren unterscheiden sich je nach Anbieter und Nutzer und können sich ändern. Deshalb rechnet das Tool mit deinem aktuellen Einheitspreis."],
    "1000 liter tényleg 1 m³?": ["Are 1,000 litres really 1 m³?", "Entsprechen 1.000 Liter tatsächlich 1 m³?"],
    "Igen. Egy köbméter térfogat 1000 liternek felel meg.": ["Yes. One cubic metre of volume equals 1,000 litres.", "Ja. Ein Kubikmeter entspricht 1.000 Litern."],
    "rezsi megosztas": ["Shared household costs", "Nebenkostenaufteilung"], "villanyfogyasztas koltseg": ["Electricity consumption cost", "Stromverbrauchskosten"], "terfogat atvalto": ["Volume converter", "Volumenumrechner"],
    "Költségbecslés saját egységárral. Az aktuális szolgáltatói díjszabás, alapdíj, csatornadíj és egyéb tételek eltérhetnek a modellben megadottaktól.": ["Cost estimate using your own unit price. Current provider rates, base charges, sewer fees and other items may differ from the values in the model.", "Kostenschätzung mit eigenem Einheitspreis. Aktuelle Anbietertarife, Grundgebühren, Abwassergebühren und weitere Posten können von den Modellwerten abweichen."]
  });
  const dictionaries = Object.freeze({
    "ar-kedvezmeny-kalkulator": discount,
    "egysegar-kalkulator": unit,
    "atlag-kalkulator": average,
    "arany-kalkulator": Object.freeze({}),
    "szazalekos-valtozas-kalkulator": Object.freeze({}),
    "borravalo-kalkulator": Object.freeze({}),
    "arres-kalkulator": margin,
    "haszonkulcs-kalkulator": markup,
    "fedezeti-pont-kalkulator": breakEven,
    "datum-hozzaadas-kivonas-kalkulator": dateAdd,
    "eletkor-kalkulator": age,
    "datum-kulonbseg-kalkulator": dateDifference,
    "munkaido-kalkulator": workTime,
    "munkanap-kalkulator": workdays,
    "tulora-kalkulator": overtime,
    "oraber-kalkulator": hourlyWage,
    "rezsi-megosztas-kalkulator": utilitySplit,
    "recept-adag-kalkulator": recipe,
    "villanyfogyasztas-koltseg-kalkulator": electricityCost,
    "vizfogyasztas-koltseg-kalkulator": waterCost
  });
  const pages = Object.freeze(Object.keys(dictionaries));
  const supported = Object.freeze(["hu", "en", "de"]);
  const months = Object.freeze({
    "január": 0, "február": 1, "március": 2, "április": 3, "május": 4, "június": 5,
    "július": 6, "augusztus": 7, "szeptember": 8, "október": 9, "november": 10, "december": 11
  });
  const weekdays = Object.freeze(["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"]);
  function localizedDate(year, month, day, lang, options) {
    const date = new Date(Date.UTC(year, month, day));
    return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", { timeZone: "UTC", ...options }).format(date);
  }
  function unitWord(amount, lang, unit) {
    const singular = new Intl.PluralRules(lang).select(Number(amount.replace(/[\s,.]/gu, ""))) === "one";
    const words = {
      en: { day: ["day", "days"], week: ["week", "weeks"], month: ["month", "months"], year: ["year", "years"], hour: ["hour", "hours"], minute: ["minute", "minutes"] },
      de: { day: ["Tag", "Tage"], week: ["Woche", "Wochen"], month: ["Monat", "Monate"], year: ["Jahr", "Jahre"], hour: ["Stunde", "Stunden"], minute: ["Minute", "Minuten"] }
    };
    return words[lang][unit][singular ? 0 : 1];
  }
  function translateDateValue(value, lang) {
    const longDate = /^(\d{4})\.\s*([\p{L}]+)\s+(\d{1,2})\.?$/u.exec(value);
    if (longDate && Object.prototype.hasOwnProperty.call(months, longDate[2].toLocaleLowerCase("hu-HU"))) {
      return localizedDate(Number(longDate[1]), months[longDate[2].toLocaleLowerCase("hu-HU")], Number(longDate[3]), lang,
        { day: "numeric", month: "long", year: "numeric" });
    }
    const numericDate = /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?$/u.exec(value);
    if (numericDate) return localizedDate(Number(numericDate[1]), Number(numericDate[2]) - 1, Number(numericDate[3]), lang,
      { day: "2-digit", month: "2-digit", year: "numeric" });
    const weekdayIndex = weekdays.indexOf(value.toLocaleLowerCase("hu-HU"));
    if (weekdayIndex >= 0) {
      const date = new Date(Date.UTC(2024, 0, 1 + weekdayIndex));
      return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", { weekday: "long", timeZone: "UTC" }).format(date);
    }
    return null;
  }
  function translate(page, value, lang) {
    if (!["en", "de"].includes(lang) || !dictionaries[page]) return null;
    const index = lang === "en" ? 0 : 1;
    const dict = dictionaries[page];
    if (Object.prototype.hasOwnProperty.call(dict, value)) return dict[value][index];
    if (Object.prototype.hasOwnProperty.call(shared, value)) return shared[value][index];
    const normalized = value.replace(/\s+/gu, " ").trim();
    if (Object.prototype.hasOwnProperty.call(content, normalized)) return content[normalized][index];
    if (["datum-hozzaadas-kivonas-kalkulator", "eletkor-kalkulator", "datum-kulonbseg-kalkulator", "munkaido-kalkulator", "munkanap-kalkulator", "tulora-kalkulator", "oraber-kalkulator", "villanyfogyasztas-koltseg-kalkulator", "vizfogyasztas-koltseg-kalkulator"].includes(page)) {
      const date = translateDateValue(normalized, lang);
      if (date) return date;
      let match = /^(\d[\d\s.,]*)\s+nap$/u.exec(normalized);
      if (match) return `${match[1]} ${unitWord(match[1], lang, "day")}`;
      match = /^(\d[\d\s.,]*)\s+hét$/u.exec(normalized);
      if (match) return `${match[1]} ${unitWord(match[1], lang, "week")}`;
      match = /^(\d[\d\s.,]*)\s+hónap$/u.exec(normalized);
      if (match) return `${match[1]} ${unitWord(match[1], lang, "month")}`;
      match = /^(\d+)\s+év\s+(\d+)\s+hónap\s+(\d+)\s+nap$/u.exec(normalized);
      if (match) return `${match[1]} ${unitWord(match[1], lang, "year")} ${match[2]} ${unitWord(match[2], lang, "month")} ${match[3]} ${unitWord(match[3], lang, "day")}`;
      match = /^(\d+) nap a választott számítás szerint\.$/u.exec(normalized);
      if (match) return lang === "en" ? `${match[1]} ${unitWord(match[1], lang, "day")} using the selected counting method.` : `${match[1]} ${unitWord(match[1], lang, "day")} nach der gewählten Zählweise.`;
      match = /^A záródátum korábbi a kezdőnapnál \((\d+) nap eltérés\)\.$/u.exec(normalized);
      if (match) return lang === "en" ? `The end date is earlier than the start date (difference: ${match[1]} ${unitWord(match[1], lang, "day")}).` : `Das Enddatum liegt vor dem Startdatum (Abstand: ${match[1]} ${unitWord(match[1], lang, "day")}).`;
      if (normalized === "Adj meg érvényes dátumot.") return lang === "en" ? "Enter a valid date." : "Gib ein gültiges Datum ein.";
    }
    if (page === "munkaido-kalkulator") {
      const duration = /^(\d[\d\s.,]*)\s+óra\s+(\d+)\s+perc$/u.exec(normalized);
      if (duration) return `${duration[1]} ${unitWord(duration[1], lang, "hour")} ${duration[2]} ${unitWord(duration[2], lang, "minute")}`;
      const hours = /^(\d[\d\s.,]*)\s+óra$/u.exec(normalized);
      if (hours) return `${hours[1]} ${unitWord(hours[1], lang, "hour")}`;
    }
    if (page === "tulora-kalkulator") {
      const hourly = /^(\d[\d\s.,]*\s+Ft)\/óra$/u.exec(normalized);
      if (hourly) return `${hourly[1]}/${lang === "en" ? "hour" : "Stunde"}`;
    }
    if (page === "oraber-kalkulator") {
      const hourly = /^(\d[\d\s.,]*\s+Ft)\/óra$/u.exec(normalized);
      if (hourly) return `${hourly[1]}/${lang === "en" ? "hour" : "Stunde"}`;
    }
    if (page === "recept-adag-kalkulator") {
      let match = /^A\(z\) (\d+)\. sor formátuma hibás\.$/u.exec(normalized);
      if (match) return lang === "en" ? `Line ${match[1]} has an invalid format.` : `Zeile ${match[1]} hat ein ungültiges Format.`;
      match = /^(.+) mennyisége: adj meg érvényes számot\.$/u.exec(normalized);
      if (match) return lang === "en" ? `${match[1]}: enter a valid amount.` : `${match[1]}: Gib eine gültige Menge ein.`;
      match = /^(.+) mennyisége: az érték legyen nagyobb nullánál\.$/u.exec(normalized);
      if (match) return lang === "en" ? `${match[1]}: the amount must be greater than zero.` : `${match[1]}: Die Menge muss größer als null sein.`;
    }
    if (page === "fedezeti-pont-kalkulator") {
      const quantity = /^(\d[\d\s.,]*)\s+db$/u.exec(normalized);
      if (quantity) return quantity[1] + (lang === "en" ? " units" : " Stück");
    }
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

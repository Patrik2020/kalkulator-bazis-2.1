/* global module */
(function (root, factory) {
  "use strict";
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  if (!root?.document) return;
  root.KB_SUPPORT_PAGE_LOCALE = data;
  root.document.dispatchEvent(new root.CustomEvent("kb:locale-data-ready"));
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  return {
    pages: ["atvaltok.html", "auto.html", "egeszseg.html", "epitoipari.html", "mindennapi.html", "penzugyi.html", "kalkulatorok.html"],
    dictionary: {
      "Kiemelt kalkulátorok": ["Featured calculators", "Ausgewählte Rechner"],
      "Írj be legalább két karaktert.": ["Enter at least two characters.", "Gib mindestens zwei Zeichen ein."],
      "Nincs találat. Próbálj másik kifejezést vagy válassz kategóriát.": ["No results. Try another phrase or choose a category.", "Keine Treffer. Versuche einen anderen Suchbegriff oder wähle eine Kategorie."],
  "Morzsamenü": [
    "Breadcrumb navigation",
    "Brotkrümelnavigation"
  ],
  "Főoldal": [
    "Home",
    "Startseite"
  ],
  "Átváltók": [
    "Converters",
    "Umrechner"
  ],
  "Átváltók és mértékegységek": [
    "Unit converters and measurements",
    "Einheiten und Umrechner"
  ],
  "Egy közös mértékegység-átváltó 11 kategóriához, plusz külön élő devizaeszköz.": [
    "One unit converter covering 11 categories, plus a separate live currency tool.",
    "Ein Umrechner für 11 Einheitenkategorien und ein eigener Währungsrechner mit Live-Kursen."
  ],
  "Keresés kalkulátorok között": [
    "Search calculators",
    "Rechner durchsuchen"
  ],
  "Keresés kalkulátorok között...": [
    "Search calculators...",
    "Rechner suchen..."
  ],
  "Mértékegység átváltó központ": [
    "Unit converter hub",
    "Einheitenrechner-Zentrale"
  ],
  "11 kategória egyetlen eszközben: hétköznapi, műszaki és digitális egységekhez.": [
    "11 categories in one tool for everyday, technical and digital units.",
    "11 Kategorien in einem Werkzeug für Alltags-, technische und digitale Einheiten."
  ],
  "Mértékegység átváltó": [
    "Unit Converter",
    "Einheitenrechner"
  ],
  "11 mértékegység-kategória egy közös átváltóban, a hosszúságtól a teljesítményig.": [
    "Eleven measurement categories in one converter, from length to power.",
    "Elf Einheitenkategorien in einem Rechner, von Länge bis Leistung."
  ],
  "Deviza": [
    "Currency",
    "Währungen"
  ],
  "Pénznemek közötti tájékozódó átváltáshoz.": [
    "For indicative conversions between currencies.",
    "Zur orientierenden Umrechnung zwischen Währungen."
  ],
  "Deviza átváltó": [
    "Currency converter",
    "Währungsrechner"
  ],
  "Forint, euró, dollár, font és más pénznemek átváltása.": [
    "Convert forints, euros, dollars, pounds and other currencies.",
    "Forint, Euro, Dollar, Pfund und weitere Währungen umrechnen."
  ],
  "Gyakori kérdések": [
    "Frequently asked questions",
    "Häufige Fragen"
  ],
  "Autó & közlekedés": [
    "Cars & transport",
    "Auto & Verkehr"
  ],
  "Autó és közlekedés kalkulátorok": [
    "Cars and transport calculators",
    "Auto- und Verkehrsrechner"
  ],
  "Utazás, üzemanyag, fenntartási költség, műszaki összehasonlítás és környezeti becslések.": [
    "Trips, fuel, ownership costs, technical comparisons and environmental estimates.",
    "Reisen, Kraftstoff, Unterhaltskosten, technische Vergleiche und Umweltabschätzungen."
  ],
  "Utazás és üzemanyag": [
    "Travel and fuel",
    "Reisen und Kraftstoff"
  ],
  "Fogyasztás, tankolás, hatótáv, menetidő és útköltség tervezéséhez.": [
    "For planning fuel use, refuelling, range, journey times and travel costs.",
    "Zur Planung von Verbrauch, Tanken, Reichweite, Fahrzeit und Reisekosten."
  ],
  "Autós út- és hatótáv kalkulátor": [
    "Auto Trip and Range Calculator",
    "Auto-Fahrt- und Reichweitenrechner"
  ],
  "Üzemanyag költség kalkulátor": [
    "Fuel cost calculator",
    "Kraftstoffkostenrechner"
  ],
  "Számold ki egy út várható üzemanyagköltségét.": [
    "Estimate the fuel cost of a trip.",
    "Berechne die voraussichtlichen Kraftstoffkosten einer Fahrt."
  ],
  "Autó fogyasztás kalkulátor": [
    "Fuel Consumption Calculator",
    "Kraftstoffverbrauchsrechner"
  ],
  "Számold ki a valós fogyasztást tankolás és megtett kilométer alapján.": [
    "Estimate your real-world fuel consumption from fuel added and distance travelled.",
    "Berechne den tatsächlichen Kraftstoffverbrauch anhand der getankten Menge und der gefahrenen Strecke."
  ],
  "Hatótáv kalkulátor": [
    "Driving range calculator",
    "Reichweiten-Rechner"
  ],
  "Becsüld meg, hány kilométert tehetsz meg a tankban lévő üzemanyaggal.": [
    "Estimate how many kilometres you can travel with the fuel in your tank.",
    "Schätze, wie viele Kilometer du mit dem Kraftstoff im Tank fahren kannst."
  ],
  "Tankolás kalkulátor": [
    "Refuelling budget calculator",
    "Tankbudget-Rechner"
  ],
  "Számold ki, hány liter üzemanyagot kapsz a megadott tankolási keretből.": [
    "Calculate how many litres of fuel you can buy with your refuelling budget.",
    "Berechne, wie viele Liter Kraftstoff du für dein Tankbudget bekommst."
  ],
  "Utazási idő kalkulátor": [
    "Travel Time Calculator",
    "Fahrzeitrechner"
  ],
  "Számold ki a várható menetidőt távolság és átlagsebesség alapján.": [
    "Calculate an estimated journey time from distance and average speed.",
    "Berechne die voraussichtliche Fahrzeit aus Strecke und Durchschnittsgeschwindigkeit."
  ],
  "Elektromos autó töltési költség kalkulátor": [
    "EV Charging Cost Calculator",
    "Ladekostenrechner für Elektroautos"
  ],
  "Számold ki egy elektromos autó energiaigényét és töltési költségét egy útra.": [
    "Estimate an electric car's energy use and charging cost for a trip.",
    "Schätze Energiebedarf und Ladekosten eines Elektroautos für eine Fahrt."
  ],
  "Üzemanyagár-különbség kalkulátor": [
    "Fuel Price Comparison Calculator",
    "Kraftstoffpreisvergleich"
  ],
  "Hasonlíts össze két üzemanyagárat ugyanarra az útra, és számold ki a teljes költségkülönbséget a távolság és fogyasztás alapján.": [
    "Compare two fuel prices for the same trip and calculate the total cost difference from distance and fuel consumption.",
    "Vergleiche zwei Kraftstoffpreise für dieselbe Fahrt und berechne den Gesamtkostenunterschied aus Strecke und Verbrauch."
  ],
  "Fenntartás és költség": [
    "Ownership and costs",
    "Unterhalt und Kosten"
  ],
  "Éves költség, értékvesztés és kilométerenkénti ráfordítás becsléséhez.": [
    "For estimating annual costs, depreciation and cost per kilometre.",
    "Zur Schätzung von Jahreskosten, Wertverlust und Kosten pro Kilometer."
  ],
  "Éves autóköltség kalkulátor": [
    "Annual Car Cost Calculator",
    "Rechner für jährliche Autokosten"
  ],
  "Becsüld meg az autó éves fenntartási költségét.": [
    "Estimate your car's annual running costs.",
    "Schätze die jährlichen Unterhaltskosten deines Autos."
  ],
  "Autó értékvesztés kalkulátor": [
    "Car Depreciation Calculator",
    "Autowertverlust-Rechner"
  ],
  "Számold ki, mennyit veszíthet az autó az értékéből évente.": [
    "Estimate how much value your car may lose each year.",
    "Schätze, wie viel Wert dein Auto pro Jahr verlieren kann."
  ],
  "Kilométerdíj kalkulátor": [
    "Cost per Kilometre Calculator",
    "Kilometerkostenrechner"
  ],
  "Számold ki, mennyibe kerül egy kilométer az autóddal.": [
    "Calculate how much each kilometre costs in your car.",
    "Berechne, wie viel ein Kilometer mit deinem Auto kostet."
  ],
  "Műszaki és környezeti adatok": [
    "Technical and environmental data",
    "Technische und Umweltdaten"
  ],
  "Gumiméret-összehasonlításhoz és CO₂-kibocsátási becsléshez.": [
    "For comparing tyre sizes and estimating CO₂ emissions.",
    "Zum Vergleich von Reifengrößen und zur Abschätzung des CO₂-Ausstoßes."
  ],
  "CO2 kibocsátás kalkulátor": [
    "Car CO₂ emissions calculator",
    "CO₂-Rechner fürs Auto"
  ],
  "Becsüld meg az utazás szén-dioxid kibocsátását üzemanyag alapján.": [
    "Estimate a trip's carbon emissions based on fuel use.",
    "Schätze die CO₂-Emissionen einer Fahrt anhand des Kraftstoffverbrauchs."
  ],
  "Gumiméret váltó kalkulátor": [
    "Tyre Size Calculator",
    "Reifengrößenrechner"
  ],
  "Hasonlíts össze két gumiméretet átmérő és eltérés alapján.": [
    "Compare two tyre sizes by diameter and difference.",
    "Vergleiche zwei Reifengrößen anhand von Durchmesser und Abweichung."
  ],
  "Féktáv kalkulátor": [
    "Braking Distance Calculator",
    "Bremswegrechner"
  ],
  "Elméleti reakcióút, fékút és teljes megállási távolság becslése sebesség, reakcióidő és tapadási tényező alapján.": [
    "Estimate reaction distance, theoretical braking distance and total stopping distance from speed, reaction time and grip coefficient.",
    "Schätze Reaktionsweg, theoretischen Bremsweg und gesamten Anhalteweg anhand von Geschwindigkeit, Reaktionszeit und Reibwert."
  ],
  "Céges elszámolásra használható?": [
    "Can I use this for company expense claims?",
    "Kann ich das Ergebnis für betriebliche Abrechnungen verwenden?"
  ],
  "Miért fontos az értékvesztés?": [
    "Why does depreciation matter?",
    "Warum ist der Wertverlust wichtig?"
  ],
  "Egészség & sport": [
    "Health & fitness",
    "Gesundheit & Sport"
  ],
  "Egészség és sport kalkulátorok": [
    "Health and fitness calculators",
    "Gesundheits- und Sportrechner"
  ],
  "Testösszetétel, táplálkozás, energiaigény, edzés és regeneráció óvatos értelmezéssel.": [
    "Body composition, nutrition, energy needs, training and recovery, with cautious interpretation.",
    "Körperzusammensetzung, Ernährung, Energiebedarf, Training und Erholung – mit vorsichtiger Interpretation."
  ],
  "Testsúly és testösszetétel": [
    "Weight and body composition",
    "Gewicht und Körperzusammensetzung"
  ],
  "Testsúly, BMI, testzsír és testarányok tájékozódó becsléséhez.": [
    "For indicative estimates of weight, BMI, body fat and body proportions.",
    "Für orientierende Schätzungen zu Gewicht, BMI, Körperfett und Körperproportionen."
  ],
  "BMI kalkulátor": [
    "BMI Calculator",
    "BMI-Rechner"
  ],
  "Testtömegindex kiszámítása testsúly és magasság alapján.": [
    "Calculate body mass index from weight and height.",
    "Berechne den Body-Mass-Index aus Gewicht und Größe."
  ],
  "Ideális testsúly kalkulátor": [
    "Ideal Weight Calculator",
    "Idealgewichtsrechner"
  ],
  "Becsüld meg az ideális testsúlyt magasság és nem alapján.": [
    "Estimate a historical ideal-weight value from height and sex.",
    "Schätze einen historischen Idealgewichtswert anhand von Körpergröße und Geschlecht."
  ],
  "Testzsír százalék kalkulátor": [
    "Body Fat Percentage Calculator",
    "Körperfettanteil-Rechner"
  ],
  "Becsüld meg a testzsírszázalékot derék, nyak, csípő és magasság alapján.": [
    "Estimate body fat percentage from waist, neck, hip and height measurements.",
    "Schätze den Körperfettanteil anhand von Taillen-, Hals- und Hüftumfang sowie Körpergröße."
  ],
  "Derék-csípő arány kalkulátor": [
    "Waist-to-Hip Ratio Calculator",
    "Taille-Hüfte-Verhältnis-Rechner"
  ],
  "Számold ki a derék-csípő arányt, egy egyszerű egészségi mutatót.": [
    "Calculate the waist-to-hip ratio, a simple measure of body proportions.",
    "Berechne das Taille-Hüfte-Verhältnis, ein einfaches Maß für Körperproportionen."
  ],
  "Táplálkozás és energia": [
    "Nutrition and energy",
    "Ernährung und Energie"
  ],
  "Kalória-, makró-, fehérje- és folyadékigény becsléséhez.": [
    "For estimates of calories, macronutrients, protein and fluid needs.",
    "Zur Schätzung des Kalorien-, Makronährstoff-, Protein- und Flüssigkeitsbedarfs."
  ],
  "Kalória kalkulátor": [
    "Calorie Calculator",
    "Kalorienrechner"
  ],
  "Napi kalóriaszükséglet becslése.": [
    "Estimate daily calorie needs.",
    "Schätzung des täglichen Kalorienbedarfs."
  ],
  "Vízfogyasztás kalkulátor": [
    "Water Intake Calculator",
    "Trinkmengenrechner"
  ],
  "Becsüld meg a napi ajánlott folyadékbevitelt testsúly és aktivitás alapján.": [
    "Estimate the recommended daily fluid intake from body weight and activity.",
    "Schätze die empfohlene tägliche Flüssigkeitszufuhr anhand von Körpergewicht und Aktivität."
  ],
  "Makró kalkulátor": [
    "Macro Calculator",
    "Makrorechner"
  ],
  "Oszd fel a napi kalóriát fehérje, szénhidrát és zsír között.": [
    "Divide your daily calories among protein, carbohydrate and fat.",
    "Verteile deine täglichen Kalorien auf Protein, Kohlenhydrate und Fett."
  ],
  "BMR kalkulátor": [
    "BMR Calculator",
    "BMR-Rechner"
  ],
  "Számold ki az alapanyagcserédet Mifflin-St Jeor képlettel.": [
    "Estimate your basal metabolic rate with the Mifflin–St Jeor equation.",
    "Schätze deinen Grundumsatz mit der Mifflin–St-Jeor-Formel."
  ],
  "Fehérje szükséglet kalkulátor": [
    "Protein Needs Calculator",
    "Proteinbedarfsrechner"
  ],
  "Becsüld meg a napi fehérjeigényt testsúly és cél alapján.": [
    "Estimate daily protein needs from body weight and your chosen target.",
    "Schätze den täglichen Proteinbedarf anhand von Körpergewicht und gewähltem Zielwert."
  ],
  "Edzés és regeneráció": [
    "Training and recovery",
    "Training und Regeneration"
  ],
  "Pulzustartományok és alvási időzítés tervezéséhez.": [
    "For planning heart-rate zones and sleep timing.",
    "Zur Planung von Pulsbereichen und Schlafzeiten."
  ],
  "Pulzus zóna kalkulátor": [
    "Heart Rate Zone Calculator",
    "Herzfrequenzzonen-Rechner"
  ],
  "Számold ki az edzéshez használható pulzustartományokat.": [
    "Estimate heart-rate ranges for training.",
    "Schätze Herzfrequenzbereiche für das Training."
  ],
  "Alvásciklus kalkulátor": [
    "Sleep Cycle Calculator",
    "Schlafzyklus-Rechner"
  ],
  "Futótempó kalkulátor": [
    "Running Pace Calculator",
    "Lauftempo-Rechner"
  ],
  "Számold ki a perc/km tempót, az átlagsebességet és az azonos tempójú részidőket.": [
    "Calculate pace in min/km, average speed and split times at the same pace.",
    "Berechne das Tempo in min/km, die Durchschnittsgeschwindigkeit und Zwischenzeiten bei gleichem Tempo."
  ],
  "1RM kalkulátor": [
    "One-Rep Max Calculator",
    "1RM-Rechner"
  ],
  "Becsült egyismétléses maximum számítása Epley- és Brzycki-képlettel a használt súly és az ismétlésszám alapján.": [
    "Estimate your one-rep max with the Epley and Brzycki formulas using the weight lifted and number of repetitions.",
    "Schätze dein Einerwiederholungsmaximum mit den Formeln von Epley und Brzycki anhand des Gewichts und der Wiederholungen."
  ],
  "Lépésszám–távolság kalkulátor": [
    "Steps to Distance Calculator",
    "Schritte-in-Entfernung-Rechner"
  ],
  "Becsült megtett távolság és gyaloglási idő kiszámítása lépésszámból, átlagos lépéshosszból és lépésszámból percenként.": [
    "Estimate walking distance and time from your step count, average step length and steps per minute.",
    "Schätze Gehstrecke und Gehzeit anhand der Schrittzahl, der durchschnittlichen Schrittlänge und der Schritte pro Minute."
  ],
  "Család": [
    "Family",
    "Familie"
  ],
  "Családi élethelyzethez kapcsolódó tájékozódó számításokhoz.": [
    "For indicative calculations relating to family life.",
    "Für orientierende Berechnungen zu familiären Lebenssituationen."
  ],
  "Terhességi kalkulátor": [
    "Pregnancy calculator",
    "Schwangerschaftsrechner"
  ],
  "Számold ki a várható szülési dátumot az utolsó menstruáció alapján.": [
    "Estimate the due date from the last menstrual period.",
    "Schätze den Geburtstermin anhand der letzten Periode."
  ],
  "Egészségügyi határ:": [
    "Health boundary:",
    "Gesundheitlicher Hinweis:"
  ],
  "Otthon & felújítás": [
    "Home & renovation",
    "Haus & Renovierung"
  ],
  "Otthon és felújítás kalkulátorok": [
    "Home and renovation calculators",
    "Haus- und Renovierungsrechner"
  ],
  "Anyagigény, burkolás, felületképzés és szerkezeti becslések felújításhoz vagy építkezéshez.": [
    "Material quantities, tiling, surface finishing and structural estimates for renovation or construction.",
    "Materialbedarf, Fliesen, Oberflächen und konstruktive Schätzungen für Sanierung oder Neubau."
  ],
  "OTTHON ÉS FELÚJÍTÁS": [
    "HOME AND RENOVATION",
    "HAUS UND RENOVIERUNG"
  ],
  "Tervezd meg az anyagigényt még vásárlás előtt. Válassz munkafolyamatot, és számolj egyszerűen.": [
    "Estimate materials before buying. Choose a project and calculate with ease.",
    "Plane deinen Materialbedarf vor dem Einkauf. Wähle einen Arbeitsschritt und berechne ihn."
  ],
  "Kezdd ezekkel": [
    "Start here",
    "Hier starten"
  ],
  "Beton": [
    "Concrete",
    "Beton"
  ],
  "Mennyi betonra lesz szükség?": [
    "How much concrete will you need?",
    "Wie viel Beton wird benötigt?"
  ],
  "Kalkulátor megnyitása →": [
    "Open calculator →",
    "Rechner öffnen →"
  ],
  "Tégla": [
    "Bricks",
    "Ziegel"
  ],
  "Falazás anyagszükséglete": [
    "Estimate masonry materials",
    "Materialbedarf fürs Mauern"
  ],
  "Festék": [
    "Paint",
    "Farbe"
  ],
  "Tervezd meg a festékmennyiséget": [
    "Estimate how much paint you need",
    "Benötigte Farbmenge planen"
  ],
  "Szerkezet és szigetelés": [
    "Structure and insulation",
    "Konstruktion und Dämmung"
  ],
  "Burkolás és felületek": [
    "Tiling and surfaces",
    "Fliesen und Oberflächen"
  ],
  "Falakhoz, födémhez, tetőhöz és szerkezeti anyagokhoz.": [
    "For walls, ceilings, roofing and structural materials.",
    "Für Wände, Decken, Dächer und Baumaterialien."
  ],
  "Beton kalkulátor": [
    "Concrete Calculator",
    "Betonrechner"
  ],
  "Tégla kalkulátor": [
    "Brick Calculator",
    "Ziegelrechner"
  ],
  "Tégla mennyiség kiszámítása falazáshoz.": [
    "Calculating the number of bricks needed for masonry.",
    "Berechnung des Ziegelbedarfs für Mauerwerk."
  ],
  "Gipszkarton kalkulátor": [
    "Drywall Calculator",
    "Trockenbau-Rechner"
  ],
  "Becsüld meg, hány gipszkarton lapra lesz szükséged falhoz vagy mennyezethez.": [
    "Estimate how many drywall boards you need for a wall or ceiling.",
    "Schätze, wie viele Gipskartonplatten du für eine Wand oder Decke benötigst."
  ],
  "Vakolat kalkulátor": [
    "Plaster calculator",
    "Putzrechner"
  ],
  "Becsüld meg a vakolat vagy glettanyag mennyiségét felület és rétegvastagság alapján.": [
    "Estimate plaster or filler quantities from surface area and layer thickness.",
    "Schätze die Menge an Putz oder Spachtelmasse anhand von Fläche und Schichtdicke."
  ],
  "Hőszigetelés kalkulátor": [
    "Insulation Calculator",
    "Dämmstoffrechner"
  ],
  "Tervezd meg a homlokzati vagy födémszigetelés lapmennyiségét.": [
    "Plan the board quantity for external-wall or ceiling insulation.",
    "Plane die Plattenmenge für eine Fassaden- oder Deckendämmung."
  ],
  "Tetőcserép kalkulátor": [
    "Roof Tile Calculator",
    "Dachziegelrechner"
  ],
  "Becsüld meg a tetőfedéshez szükséges cserepek számát.": [
    "Estimate how many tiles you need for the roof.",
    "Schätze die für die Dacheindeckung benötigte Ziegelanzahl."
  ],
  "Kerítés oszlop kalkulátor": [
    "Fence Post Calculator",
    "Zaunpfosten-Rechner"
  ],
  "Becsüld meg egy egyenes, kapu nélküli kerítésszakaszhoz szükséges mezők és oszlopok számát a teljes hossz és a legnagyobb oszloptávolság alapján.": [
    "Estimate the number of bays and posts required for a straight fence section without a gate, based on its total length and maximum post spacing.",
    "Schätze die Anzahl der Felder und Pfosten für einen geraden Zaunabschnitt ohne Tor anhand der Gesamtlänge und des maximalen Pfostenabstands."
  ],
  "Zúzottkő kalkulátor": [
    "Crushed Stone Calculator",
    "Schotterrechner"
  ],
  "Zúzottkő térfogat és tömeg becslése felület, rétegvastagság, anyagsűrűség és ráhagyás alapján.": [
    "Estimate crushed stone volume and mass from the area, layer depth, bulk density and allowance.",
    "Schätze Volumen und Masse von Schotter anhand von Fläche, Schichtdicke, Schüttdichte und Zuschlag."
  ],
  "Csempéhez, padlóhoz, festéshez, tapétához és térkövezéshez.": [
    "For tiles, floors, painting, wallpaper and paving.",
    "Für Fliesen, Böden, Anstriche, Tapeten und Pflasterarbeiten."
  ],
  "Csempe kalkulátor": [
    "Tile Calculator",
    "Fliesenrechner"
  ],
  "Csempe mennyiség kiszámítása burkoláshoz.": [
    "Estimate how many tiles you need for a tiling project.",
    "Berechne den Fliesenbedarf für dein Projekt."
  ],
  "Festék kalkulátor": [
    "Paint calculator",
    "Farbrechner"
  ],
  "Festékmennyiség becslése falakhoz és felületekhez.": [
    "Estimate paint quantities for walls and other surfaces.",
    "Farbmengen für Wände und andere Flächen schätzen."
  ],
  "Padlóburkolat kalkulátor": [
    "Flooring Calculator",
    "Bodenbelag-Rechner"
  ],
  "Számold ki a szükséges laminált padló, parketta vagy burkolat mennyiségét.": [
    "Calculate the amount of laminate, parquet or other flooring required.",
    "Berechne die benötigte Menge an Laminat, Parkett oder anderem Bodenbelag."
  ],
  "Tapéta kalkulátor": [
    "Wallpaper Calculator",
    "Tapetenrechner"
  ],
  "Számold ki, hány tekercs tapétára lehet szükség egy helyiségben.": [
    "Calculate how many rolls of wallpaper a room may require.",
    "Berechne, wie viele Tapetenrollen für einen Raum benötigt werden könnten."
  ],
  "Térkövezés kalkulátor": [
    "Paving Calculator",
    "Pflaster-Rechner"
  ],
  "Számold ki térkő, szegélykő és ráhagyás becsült mennyiségét.": [
    "Estimate how many paving stones and edging stones you need, including an allowance.",
    "Schätze den Bedarf an Pflaster- und Randsteinen einschließlich Zuschlag."
  ],
  "Fuga kalkulátor": [
    "Grout Calculator",
    "Fugenmörtel-Rechner"
  ],
  "Számold ki a várható fugázóanyag-szükségletet burkoláshoz.": [
    "Estimate the grout required for a tiling project.",
    "Schätze den Fugenmörtelbedarf für dein Fliesenprojekt."
  ],
  "Csemperagasztó kalkulátor": [
    "Tile Adhesive Calculator",
    "Fliesenkleber-Rechner"
  ],
  "Becsüld meg a szükséges csemperagasztó tömegét és zsákszámát.": [
    "Estimate the weight of tile adhesive and the number of bags needed.",
    "Schätze die benötigte Menge Fliesenkleber und die Anzahl der Säcke."
  ],
  "Aljzatkiegyenlítő kalkulátor": [
    "Floor Levelling Compound Calculator",
    "Bodenausgleich-Rechner"
  ],
  "Aljzatkiegyenlítő anyagszükséglet és zsákszám becslése felület, átlagos rétegvastagság, fajlagos fogyás és ráhagyás alapján.": [
    "Estimate the amount of floor levelling compound and number of bags from the area, average layer thickness, product consumption rate and allowance.",
    "Schätze den Materialbedarf und die Anzahl der Säcke anhand der Fläche, der durchschnittlichen Schichtdicke, des Verbrauchs und des Zuschlags."
  ],
  "Mulcs kalkulátor": [
    "Mulch Calculator",
    "Mulchrechner"
  ],
  "Mulcs térfogat és zsákszám becslése felület, kívánt rétegvastagság, ráhagyás és kiszerelés alapján.": [
    "Estimate mulch volume and the number of bags from the area, desired layer depth, allowance and bag size.",
    "Schätze Mulchvolumen und Sackanzahl anhand von Fläche, gewünschter Schichtdicke, Zuschlag und Gebindegröße."
  ],
  "Szegőléc kalkulátor": [
    "Skirting Board Calculator",
    "Sockelleisten-Rechner"
  ],
  "Szegőléc szükséges hosszának és darabszámának becslése kerületből, nyílásokból, szálhosszból és ráhagyásból.": [
    "Estimate the required length and number of skirting boards from the perimeter, openings, board length and cutting allowance.",
    "Schätze die benötigte Länge und Anzahl der Sockelleisten anhand von Umfang, Öffnungen, Leistenlänge und Verschnitt."
  ],
  "A": [
    "A",
    "A"
  ],
  "Mennyi ráhagyással számoljak?": [
    "How much extra should I allow?",
    "Welchen Zuschlag sollte ich einplanen?"
  ],
  "Mindennapok": [
    "Everyday life",
    "Alltag"
  ],
  "Mindennapi kalkulátorok": [
    "Everyday calculators",
    "Alltagsrechner"
  ],
  "Vásárlás, közös költségek, egyszerű matematika, munka és dátumok jól elkülönített csoportokban.": [
    "Shopping, shared expenses, basic maths, work and dates in clear groups.",
    "Einkäufe, gemeinsame Kosten, einfache Mathematik, Arbeit und Datumsberechnungen – übersichtlich gruppiert."
  ],
  "Vásárlás és háztartás": [
    "Shopping and household",
    "Einkaufen und Haushalt"
  ],
  "Árak, kedvezmények, egységárak és közös kiadások gyors ellenőrzéséhez.": [
    "For quick comparisons of prices, discounts, unit prices and shared expenses.",
    "Zum schnellen Prüfen von Preisen, Rabatten, Grundpreisen und gemeinsamen Ausgaben."
  ],
  "ÁFA kalkulátor": [
    "VAT calculator",
    "Mehrwertsteuer-Rechner"
  ],
  "ÁFA hozzáadása vagy levonása nettó és bruttó értékből.": [
    "Add or remove VAT from net and gross amounts.",
    "Mehrwertsteuer zu Netto- und Bruttobeträgen addieren oder herausrechnen."
  ],
  "Számold ki az akciós árat, kedvezményt és megtakarítást.": [
    "Calculate the sale price, discount and amount saved.",
    "Berechne den Angebotspreis, den Rabatt und die Ersparnis."
  ],
  "Hasonlítsd össze termékek egységárát kiszerelés alapján.": [
    "Compare unit prices for products sold in different pack sizes.",
    "Vergleiche Grundpreise von Produkten mit unterschiedlichen Packungsgrößen."
  ],
  "Rezsi megosztás kalkulátor": [
    "Shared household costs calculator",
    "Rechner zur Aufteilung gemeinsamer Haushaltskosten"
  ],
  "Oszd szét a közös költségeket lakótársak vagy családtagok között.": [
    "Split shared expenses among housemates or family members.",
    "Teile gemeinsame Kosten unter Mitbewohnern oder Familienmitgliedern auf."
  ],
  "Villanyfogyasztás költség kalkulátor": [
    "Electricity consumption cost calculator",
    "Rechner für Stromverbrauchskosten"
  ],
  "Becsüld meg egy elektromos készülék energiafogyasztását és költségét teljesítmény, napi használati idő, időszak és kWh-ár alapján.": [
    "Estimate an appliance's energy use and cost from its power, daily usage, period and price per kWh.",
    "Schätze Stromverbrauch und Kosten eines Geräts anhand von Leistung, täglicher Nutzungsdauer, Zeitraum und Preis pro kWh."
  ],
  "Recept adag átszámító kalkulátor": [
    "Recipe serving conversion calculator",
    "Rechner zum Umrechnen von Rezeptportionen"
  ],
  "Recept hozzávalóinak átszámítása más adagszámra, több hozzávaló egyszerre történő skálázásával.": [
    "Scale several recipe ingredients at once for a different number of servings.",
    "Skaliere mehrere Rezeptzutaten gleichzeitig für eine andere Portionszahl."
  ],
  "Vízfogyasztás költség kalkulátor": [
    "Water consumption cost calculator",
    "Rechner für Wasserkosten"
  ],
  "Vízfogyasztás köbméterben és becsült költség számítása napi literből, időszakból és saját m³-árral.": [
    "Calculate water use in cubic metres and estimate costs from daily litres, a period and your own price per m³.",
    "Berechne den Wasserverbrauch in Kubikmetern und schätze die Kosten anhand täglicher Liter, eines Zeitraums und deines Preises pro m³."
  ],
  "Munka és jövedelem": [
    "Work and income",
    "Arbeit und Einkommen"
  ],
  "Munkaidő és órabér egyszerű, gyors ellenőrzéséhez.": [
    "For quick, simple checks of working hours and hourly pay.",
    "Zur einfachen und schnellen Prüfung von Arbeitszeiten und Stundenlohn."
  ],
  "Munkaidő kalkulátor": [
    "Working hours calculator",
    "Arbeitszeitrechner"
  ],
  "Számold ki a heti és havi munkaórát napi óraszám alapján.": [
    "Calculate your weekly and monthly working hours from your daily hours.",
    "Berechne deine wöchentliche und monatliche Arbeitszeit anhand der täglichen Stunden."
  ],
  "Órabér kalkulátor": [
    "Hourly wage calculator",
    "Stundenlohn-Rechner"
  ],
  "Számold ki az órabéred havi bér és munkaóra alapján.": [
    "Calculate your hourly wage from monthly pay and working hours.",
    "Berechne deinen Stundenlohn anhand von Monatsgehalt und Arbeitsstunden."
  ],
  "Árrés kalkulátor": [
    "Profit margin calculator",
    "Handelsspannen-Rechner"
  ],
  "Árrés összeg, árrésszázalék és haszonkulcs kiszámítása beszerzési és eladási árból.": [
    "Calculate the margin amount, margin percentage and markup from the purchase and selling prices.",
    "Berechne Handelsspanne, Handelsspannen-Prozentsatz und Aufschlag anhand von Einkaufs- und Verkaufspreis."
  ],
  "Haszonkulcs kalkulátor": [
    "Markup calculator",
    "Aufschlagsrechner"
  ],
  "Eladási ár és árrés becslése beszerzési árból és megadott haszonkulcsból.": [
    "Estimate the selling price and margin from the purchase price and markup entered.",
    "Schätze anhand des Einkaufspreises und des eingegebenen Aufschlags den Verkaufspreis und die Handelsspanne."
  ],
  "Túlóra díj kalkulátor": [
    "Overtime pay calculator",
    "Überstundenrechner"
  ],
  "Túlóra óradíj, teljes túlóradíj és a normál órabér feletti többlet kiszámítása saját szorzóval.": [
    "Calculate the overtime hourly rate, total overtime pay and premium over regular pay using your own multiplier.",
    "Berechne mit einem eigenen Faktor den Überstunden-Stundenlohn, die Gesamtvergütung und den Zuschlag gegenüber dem normalen Stundenlohn."
  ],
  "Fedezeti pont kalkulátor": [
    "Break-even point calculator",
    "Break-even-Rechner"
  ],
  "Fedezeti darabszám és árbevétel becslése fix költségből, egységárból és egységnyi változó költségből.": [
    "Estimate the break-even quantity and revenue from fixed costs, unit selling price and variable cost per unit.",
    "Schätze die Break-even-Menge und den Umsatz anhand der Fixkosten, des Verkaufspreises und der variablen Kosten je Einheit."
  ],
  "Matematika": [
    "Mathematics",
    "Mathematik"
  ],
  "Százalék, arány és átlag a hétköznapi számolásokhoz.": [
    "Percentages, ratios and averages for everyday calculations.",
    "Prozente, Verhältnisse und Durchschnittswerte für den Alltag."
  ],
  "Százalék kalkulátor": [
    "Percentage calculator",
    "Prozentrechner"
  ],
  "Átlag kalkulátor": [
    "Average calculator",
    "Durchschnittsrechner"
  ],
  "Arány kalkulátor": [
    "Ratio calculator",
    "Verhältnisrechner"
  ],
  "Hármasszabály kalkulátor": [
    "Rule of Three Calculator",
    "Dreisatz-Rechner"
  ],
  "Oldj meg egyenes arányossági feladatot három ismert értékből.": [
    "Solve a direct-proportion problem using three known values.",
    "Löse eine Aufgabe zur direkten Proportionalität mit drei bekannten Werten."
  ],
  "Idő és dátum": [
    "Time and dates",
    "Zeit und Datum"
  ],
  "Életkor és két dátum közötti időtartam kiszámításához.": [
    "To calculate age and the duration between two dates.",
    "Zur Berechnung des Alters und der Dauer zwischen zwei Daten."
  ],
  "Életkor kalkulátor": [
    "Age Calculator",
    "Altersrechner"
  ],
  "Számold ki az életkort években, hónapokban és napokban.": [
    "Calculate age in years, months and days.",
    "Berechne das Alter in Jahren, Monaten und Tagen."
  ],
  "Dátum különbség kalkulátor": [
    "Date difference calculator",
    "Datumsdifferenz-Rechner"
  ],
  "Számold ki két dátum közötti napok számát egyszerűen.": [
    "Quickly calculate the number of days between two dates.",
    "Berechne schnell die Anzahl der Tage zwischen zwei Daten."
  ],
  "Munkanap kalkulátor": [
    "Working days calculator",
    "Arbeitstage-Rechner"
  ],
  "Számold ki két dátum között a hétfőtől péntekig eső napokat, és adj meg külön kihagyandó dátumokat is.": [
    "Count weekdays between two dates and optionally enter dates to exclude.",
    "Zähle die Wochentage zwischen zwei Daten und gib bei Bedarf auszuschließende Tage an."
  ],
  "vagy": [
    "or",
    "oder"
  ],
  "Pénzügy": [
    "Finance",
    "Finanzen"
  ],
  "Pénzügyi kalkulátorok": [
    "Financial calculators",
    "Finanzrechner"
  ],
  "Jövedelem, háztartási keret, hitelek, megtakarítás és befektetés átlátható témacsoportokban.": [
    "Income, household budgets, loans, savings and investments in clear topic groups.",
    "Einkommen, Haushaltsbudget, Kredite, Sparen und Investitionen in übersichtlichen Themenbereichen."
  ],
  "PÉNZÜGYI ESZKÖZTÁR": [
    "FINANCIAL TOOLS",
    "FINANZWERKZEUGE"
  ],
  "A fizetéstől a befektetésekig: válassz élethelyzetet, és indulhat a számolás.": [
    "From paychecks to investments: choose a situation and start calculating.",
    "Vom Gehalt bis zur Geldanlage: Wähle deine Situation und beginne zu rechnen."
  ],
  "Nettó–bruttó": [
    "Net–gross salary",
    "Netto–Brutto"
  ],
  "Számold ki a fizetésed": [
    "Calculate take-home pay",
    "Dein Nettogehalt berechnen"
  ],
  "ETF-tervező": [
    "ETF planner",
    "ETF-Planer"
  ],
  "Tervezd meg a befektetésed": [
    "Plan your investment",
    "Geldanlage planen"
  ],
  "Fizetési határidő": [
    "Payment deadline",
    "Zahlungsfrist"
  ],
  "Számlázáshoz és szerződésekhez": [
    "For invoices and contracts",
    "Für Rechnungen und Verträge"
  ],
  "Jövedelem és költségvetés": [
    "Income and budgeting",
    "Einkommen und Budget"
  ],
  "Hitelek és ingatlan": [
    "Loans and property",
    "Kredite und Immobilien"
  ],
  "Megtakarítás és befektetés": [
    "Savings and investments",
    "Sparen und Investieren"
  ],
  "Számlázás és határidők": [
    "Invoicing and deadlines",
    "Rechnungsstellung und Fristen"
  ],
  "Bér és háztartási pénzügyek áttekintéséhez.": [
    "For an overview of wages and household finances.",
    "Für den Überblick über Lohn und Haushaltsfinanzen."
  ],
  "Nettó - bruttó kalkulátor": [
    "Net-to-gross salary calculator",
    "Netto-Brutto-Rechner"
  ],
  "Fizetés nettó vagy bruttó összegének kiszámítása.": [
    "Calculate net or gross salary.",
    "Netto- oder Bruttogehalt berechnen."
  ],
  "Havi költségvetés kalkulátor": [
    "Monthly budget calculator",
    "Monatsbudget-Rechner"
  ],
  "Tervezd meg a havi bevételeidet, kiadásaidat és megtakarítási arányodat.": [
    "Plan your monthly income, expenses and savings rate.",
    "Plane deine monatlichen Einnahmen, Ausgaben und Sparquote."
  ],
  "Vésztartalék kalkulátor": [
    "Emergency fund calculator",
    "Notgroschen-Rechner"
  ],
  "Vésztartalék célösszeg, jelenlegi fedezet, hiányzó összeg és megtakarítási idő becslése havi alapkiadásokból.": [
    "Estimate an emergency fund target, current coverage, shortfall and savings time from essential monthly expenses.",
    "Schätze anhand monatlicher Grundausgaben den Notgroschen-Zielbetrag, die aktuelle Deckung, die Lücke und die Ansparzeit."
  ],
  "Törlesztés, hitelképesség és önerő tervezéséhez.": [
    "For planning repayments, borrowing capacity and down payments.",
    "Zur Planung von Kreditraten, Kreditfähigkeit und Eigenkapital."
  ],
  "Hitel törlesztő kalkulátor": [
    "Loan repayment calculator",
    "Kreditratenrechner"
  ],
  "Havi törlesztőrészlet számítása hitelösszeg és futamidő alapján.": [
    "Estimate a monthly payment from the loan amount and term.",
    "Monatsrate anhand von Kreditbetrag und Laufzeit schätzen."
  ],
  "Hitelképesség kalkulátor": [
    "Loan eligibility calculator",
    "Kreditwürdigkeitsrechner"
  ],
  "Lakáshitel önerő kalkulátor": [
    "Mortgage down payment calculator",
    "Rechner für das Eigenkapital beim Immobilienkauf"
  ],
  "Szükséges önerő kiszámítása lakásvásárláshoz.": [
    "Estimate the down payment needed to buy a home.",
    "Eigenkapital für den Immobilienkauf schätzen."
  ],
  "Hitel előtörlesztés kalkulátor": [
    "Early loan repayment calculator",
    "Rechner für Sondertilgung"
  ],
  "Becsüld meg, mennyivel csökkenhet a havi törlesztő és a teljes kamatteher részleges előtörlesztés után változatlan futamidő mellett.": [
    "Estimate how a partial early repayment may reduce your monthly payment and total interest while keeping the loan term unchanged.",
    "Schätze, wie eine teilweise Sondertilgung Monatsrate und Gesamtzinsen senken kann, wenn die Laufzeit gleich bleibt."
  ],
  "Hosszú távú vagyonépítés, hozam és vásárlóerő modellezéséhez.": [
    "To model long-term wealth building, returns and purchasing power.",
    "Zur Modellierung von langfristigem Vermögensaufbau, Renditen und Kaufkraft."
  ],
  "Osztalék kalkulátor": [
    "Dividend calculator",
    "Dividendenrechner"
  ],
  "Osztalékbevétel, céljövedelemhez szükséges tőke és hosszú távú újrabefektetés becslése.": [
    "Estimate dividend income, capital needed for a target income and long-term reinvestment.",
    "Schätzung von Dividendenerträgen, erforderlichem Kapital für ein Einkommensziel und langfristiger Wiederanlage."
  ],
  "ETF kalkulátor": [
    "ETF calculator",
    "ETF-Rechner"
  ],
  "ETF befektetés, célösszeg, TER és infláció becslése.": [
    "Estimate ETF growth, investment targets, TER and inflation.",
    "Schätzung von ETF-Wachstum, Anlagezielen, TER und Inflation."
  ],
  "Mikor leszek milliomos?": [
    "When will I become a millionaire?",
    "Wann werde ich Millionär?"
  ],
  "Infláció kalkulátor": [
    "Inflation calculator",
    "Inflationsrechner"
  ],
  "Pénz vásárlóerejének változása infláció mellett.": [
    "How inflation changes the purchasing power of money.",
    "Wie sich die Kaufkraft des Geldes durch Inflation verändert."
  ],
  "Kamatos kamat kalkulátor": [
    "Compound interest calculator",
    "Zinseszins-Rechner"
  ],
  "Befektetés növekedése kamatos kamattal.": [
    "Investment growth with compound interest.",
    "Anlagewachstum mit Zinseszins."
  ],
  "Megtakarítási cél kalkulátor": [
    "Savings goal calculator",
    "Sparziel-Rechner"
  ],
  "Becsüld meg, hány hónap alatt érhető el egy megtakarítási cél induló összeggel, havi befizetéssel és feltételezett éves hozammal.": [
    "Estimate how many months it may take to reach a savings goal using an initial amount, monthly contributions and an assumed annual return.",
    "Schätze, wie viele Monate es dauern kann, ein Sparziel mit Startkapital, monatlichen Einzahlungen und einer angenommenen Jahresrendite zu erreichen."
  ],
  "Számlák teljesítési és fizetési dátumainak gyors ellenőrzéséhez.": [
    "For quick checks of invoice performance and payment dates.",
    "Zur schnellen Prüfung von Leistungs- und Zahlungsdaten auf Rechnungen."
  ],
  "Fizetési határidő kalkulátor": [
    "Payment deadline calculator",
    "Zahlungsfrist-Rechner"
  ],
  "Számla teljesítés kalkulátor": [
    "Invoice tax point calculator",
    "Rechner für das Leistungsdatum der Rechnung"
  ],
  "kamatos kamat": [
    "Compound interest",
    "Zinseszins"
  ],
  ", az": [
    ", the",
    ", der"
  ],
  "és az": [
    "and the",
    "sowie die"
  ],
  "Összes kalkulátor": [
    "All calculators",
    "Alle Rechner"
  ],
  "Mennyiség": [
    "Quantity",
    "Dauer"
  ],
  "Idő": [
    "Time",
    "Zeit"
  ],
  "Forgatókönyv": [
    "Scenario",
    "Szenario"
  ],
  "Élethelyzetek": [
    "Life situations",
    "Lebenssituationen"
  ],
  "1 kalkulátor": [
    "1 calculator",
    "1 Rechner"
  ],
  "Átváltók gyors ellenőrzéshez és pontosabb értelmezéshez": [
    "Converters for quick checks and clearer interpretation",
    "Umrechner für schnelle Prüfungen und ein besseres Verständnis"
  ],
  "Az átváltók akkor hasznosak, amikor ugyanazt a mennyiséget más mértékegységben vagy pénznemben kell értelmezni. A kategóriában hosszúság, tömeg, terület, térfogat, idő, sebesség, adatméret, hőmérséklet, nyomás, energia, teljesítmény és deviza átváltó is található.": [
    "Converters help when you need to express the same quantity in another unit or currency. This category includes length, mass, area, volume, time, speed, data size, temperature, pressure, energy, power and currency conversion.",
    "Umrechner helfen, dieselbe Größe in einer anderen Einheit oder Währung auszudrücken. Diese Kategorie umfasst Länge, Masse, Fläche, Volumen, Zeit, Geschwindigkeit, Datenmenge, Temperatur, Druck, Energie, Leistung und Währungen."
  ],
  "A hétköznapi használatban sok hiba abból adódik, hogy a szám jó, de az egység rossz. Építkezésnél a centiméter és méter, autózásnál km/h és m/s, online tárhelynél MB és GB, devizánál pedig árfolyam és díj keveredhet össze. Az átváltók ezt segítenek gyorsan tisztázni.": [
    "Many everyday mistakes happen because the number is right but the unit is wrong. Centimetres and metres in construction, km/h and m/s when driving, MB and GB for storage, or exchange rates and fees for currencies can be confused. These converters help clarify the differences quickly.",
    "Im Alltag entstehen viele Fehler, weil die Zahl stimmt, aber die Einheit falsch ist. Auf dem Bau werden Zentimeter und Meter verwechselt, beim Fahren km/h und m/s, bei Speicherplatz MB und GB und bei Währungen Kurs und Gebühren. Die Umrechner helfen, diese Unterschiede schnell zu klären."
  ],
  "Devizás helyzetben érdemes a": [
    "For currency conversions, use the",
    "Für Währungsumrechnungen nutze den"
  ],
  "deviza átváltót": [
    "currency converter",
    "Währungsrechner"
  ],
  "használni, de nagyobb összegnél mindig ellenőrizd a tényleges banki vagy szolgáltatói árfolyamot is.": [
    ", but always check the actual bank or provider exchange rate for larger amounts.",
    ", prüfe bei größeren Beträgen aber stets auch den tatsächlichen Kurs deiner Bank oder deines Anbieters."
  ],
  "Méretek és mennyiségek": [
    "Dimensions and quantities",
    "Maße und Mengen"
  ],
  "Hosszúság, tömeg, terület és térfogat tervrajzhoz, recepthez vagy termékadathoz.": [
    "Length, mass, area and volume for plans, recipes or product specifications.",
    "Länge, Masse, Fläche und Volumen für Pläne, Rezepte oder Produktangaben."
  ],
  "Műszaki egységek": [
    "Technical units",
    "Technische Einheiten"
  ],
  "Nyomás, energia és teljesítmény úgy, hogy a gyakran kevert fogalmak külön maradjanak.": [
    "Pressure, energy and power, keeping commonly confused concepts separate.",
    "Druck, Energie und Leistung mit klarer Trennung häufig verwechselter Begriffe."
  ],
  "Mozgás és környezet": [
    "Motion and environment",
    "Bewegung und Umwelt"
  ],
  "Sebesség, idő és hőmérséklet utazási vagy fizikai adatok értelmezéséhez.": [
    "Speed, time and temperature for interpreting travel or physical data.",
    "Geschwindigkeit, Zeit und Temperatur zur Einordnung von Reise- oder physikalischen Daten."
  ],
  "Digitális és pénzügyi értékek": [
    "Digital and financial values",
    "Digitale und finanzielle Werte"
  ],
  "Adatméret a tízes és kettes váltás különbségével, deviza az árfolyam és díj korlátainak jelzésével.": [
    "Data sizes with the difference between decimal and binary units, and currencies with exchange-rate and fee limitations explained.",
    "Datenmengen mit dem Unterschied zwischen dezimalen und binären Einheiten sowie Währungen mit Hinweisen zu Kursen und Gebühren."
  ],
  "Átváltási hibák, amelyeket érdemes elkerülni": [
    "Conversion mistakes to avoid",
    "Umrechnungsfehler vermeiden"
  ],
  "Azonos mennyiséget válts át:": [
    "Convert the same physical quantity:",
    "Rechne dieselbe physikalische Größe um:"
  ],
  "energia és teljesítmény, tömeg és erő, térfogat és tömeg nem ugyanaz.": [
    "energy and power, mass and force, or volume and mass are different quantities.",
    "Energie und Leistung, Masse und Kraft sowie Volumen und Masse sind unterschiedliche Größen."
  ],
  "Figyelj a tizedesvesszőre:": [
    "Check decimal separators:",
    "Achte auf Dezimaltrennzeichen:"
  ],
  "magyar környezetben a vessző és pont felcserélése nagyságrendi hibát okozhat.": [
    "confusing commas and points in Hungarian notation can cause errors of several orders of magnitude.",
    "In ungarischer Schreibweise kann die Verwechslung von Komma und Punkt zu Fehlern um ganze Größenordnungen führen."
  ],
  "Adatméretnél külön világ a GB és GiB:": [
    "GB and GiB are different units:",
    "GB und GiB sind unterschiedliche Einheiten:"
  ],
  "tárhely, memória és adatforgalom eltérő váltási rendszert használhat.": [
    "storage, memory and data traffic may use different unit systems.",
    "Speicherplatz, Arbeitsspeicher und Datenverkehr können unterschiedliche Einheitensysteme verwenden."
  ],
  "Devizánál az árfolyam nem végösszeg:": [
    "An exchange rate is not the final amount:",
    "Der Wechselkurs ist nicht der Endbetrag:"
  ],
  "banki díj, spread és kártyatársasági árfolyam is módosíthatja a fizetendő összeget.": [
    "bank fees, spreads and card-network exchange rates can change the amount payable.",
    "Bankgebühren, Kursspannen und Kurse der Kartengesellschaft können den Zahlbetrag verändern."
  ],
  "Források és szabványok": [
    "Sources and standards",
    "Quellen und Standards"
  ],
  "A mértékegység-átváltásoknál az SI rendszer, az ISO és IEC jellegű szabványos egységértelmezések, valamint a nemzetközileg elfogadott váltószámok adják a módszertani alapot. Devizánál az árfolyam időben változik, ezért nagyobb összegnél mindig a saját bankod vagy szolgáltatód aktuális feltételeit kell ellenőrizni.": [
    "Unit conversions are based on SI units, standardised ISO and IEC unit conventions, and internationally accepted conversion factors. Exchange rates change over time, so always check your own bank’s or provider’s current terms for larger amounts.",
    "Grundlage der Einheitenumrechnung sind das SI-System, standardisierte Einheitenkonventionen von ISO und IEC sowie international anerkannte Umrechnungsfaktoren. Wechselkurse ändern sich; prüfe bei größeren Beträgen deshalb stets die aktuellen Bedingungen deiner Bank oder deines Anbieters."
  ],
  "Kapcsolódó témák": [
    "Related topics",
    "Verwandte Themen"
  ],
  "Az átváltók több kategóriát is összekötnek. Felújításnál az": [
    "Converters connect several categories. For renovation, the",
    "Umrechner verbinden mehrere Kategorien. Bei Renovierungen können die"
  ],
  "építőipari kalkulátorok": [
    "construction calculators",
    "Baurechner"
  ],
  "előtt segíthet a terület vagy térfogat tisztázása, autózásnál az": [
    "can be preceded by checking area or volume; for driving, the",
    "durch eine Prüfung von Fläche oder Volumen ergänzt werden. Beim Fahren helfen die"
  ],
  "autós kalkulátorok": [
    "car calculators",
    "Autorechner"
  ],
  "mellett a sebesség és fogyasztási adatok értelmezése, pénzügyi döntésnél pedig a": [
    "can be used alongside speed and consumption conversions; for financial decisions, the",
    "zusammen mit Umrechnungen von Geschwindigkeit und Verbrauch. Bei Finanzentscheidungen liefern die"
  ],
  "pénzügyi kalkulátorok": [
    "financial calculators",
    "Finanzrechner"
  ],
  "és a devizaeszközök együtt adnak jobb képet. Ha csak gyors hétköznapi számítás kell, indulhatsz a": [
    "and currency tools provide a fuller picture. For quick everyday calculations, start with the",
    "und Währungswerkzeuge gemeinsam ein besseres Bild. Für schnelle Alltagsberechnungen kannst du auch die"
  ],
  "mindennapi kategóriából": [
    "everyday category",
    "Alltagskategorie"
  ],
  "is.": [
    "as well.",
    "nutzen."
  ],
  "Pontosak az átváltók?": [
    "Are the converters accurate?",
    "Sind die Umrechner genau?"
  ],
  "A matematikai átváltások pontos képletekkel működnek, de devizánál az árfolyam és díj szolgáltatónként eltérhet.": [
    "Mathematical conversions use exact formulas, but exchange rates and currency fees may vary by provider.",
    "Mathematische Umrechnungen verwenden exakte Formeln. Wechselkurse und Währungsgebühren können jedoch je nach Anbieter abweichen."
  ],
  "Mire figyeljek mértékegységnél?": [
    "What should I check about units?",
    "Worauf muss ich bei Einheiten achten?"
  ],
  "Mindig ellenőrizd, hogy a bemeneti adat milyen egységben van, mert a rossz kiindulás rossz eredményt ad.": [
    "Always check the input unit: starting with the wrong unit gives the wrong result.",
    "Prüfe stets die Einheit der Eingabe: Eine falsche Ausgangseinheit führt zu einem falschen Ergebnis."
  ],
  "Használhatók mobilon?": [
    "Can I use them on mobile?",
    "Sind sie auf dem Handy nutzbar?"
  ],
  "Igen, az átváltók gyors mobilos ellenőrzésre is készültek.": [
    "Yes. The converters are also designed for quick checks on mobile.",
    "Ja. Die Umrechner sind auch für schnelle Prüfungen auf dem Handy ausgelegt."
  ],
  "Miért tér el a tárhely mérete a gépen?": [
    "Why does my computer show less storage space?",
    "Warum zeigt mein Computer weniger Speicherplatz an?"
  ],
  "A gyártói GB gyakran tízes alapú, az operációs rendszer pedig kettes alapú értelmezést mutathat, ezért ugyanaz a meghajtó kisebbnek látszhat.": [
    "Manufacturers often use decimal GB, while an operating system may display binary units, making the same drive appear smaller.",
    "Hersteller verwenden häufig dezimale GB, während ein Betriebssystem binäre Einheiten anzeigen kann. Dadurch erscheint dasselbe Laufwerk kleiner."
  ],
  "A hőmérséklet átváltás egyszerű szorzás?": [
    "Is temperature conversion just multiplication?",
    "Ist Temperaturumrechnung eine einfache Multiplikation?"
  ],
  "Nem mindig. Celsius és Fahrenheit között eltolás is van, ezért nem elég csak arányt számolni.": [
    "Not always. Celsius and Fahrenheit also have an offset, so a ratio alone is insufficient.",
    "Nicht immer. Zwischen Celsius und Fahrenheit gibt es auch eine Verschiebung des Nullpunkts; ein Verhältnis allein reicht nicht."
  ],
  "Lehet hivatalos méréshez használni?": [
    "Can I use them for official measurements?",
    "Kann ich sie für amtliche Messungen verwenden?"
  ],
  "Ellenőrzésre igen, de tanúsított méréshez, szerződéshez vagy műszaki dokumentációhoz az adott szabvány és mérőeszköz az irányadó.": [
    "They can help with checks, but certified measurements, contracts and technical documents must follow the applicable standard and measuring equipment.",
    "Für Prüfungen können sie helfen. Bei zertifizierten Messungen, Verträgen und technischen Unterlagen sind jedoch die jeweilige Norm und das Messgerät maßgeblich."
  ],
  "Átváltási döntési útvonal": [
    "Conversion decision path",
    "Entscheidungsweg für Umrechnungen"
  ],
  "Előbb azonosítsd a fizikai mennyiséget, csak utána az egységet": [
    "Identify the physical quantity before choosing the unit",
    "Bestimme zuerst die physikalische Größe und erst dann die Einheit"
  ],
  "Lineáris mennyiségek": [
    "Linear quantities",
    "Lineare Größen"
  ],
  "Hosszúság és tömeg: itt általában közvetlen váltószám működik.": [
    "Length and mass generally use a direct conversion factor.",
    "Bei Länge und Masse gilt meist ein direkter Umrechnungsfaktor."
  ],
  "Négyzetes és köbös skála": [
    "Square and cubic scales",
    "Quadratische und kubische Skalen"
  ],
  "Területnél a hosszváltó négyzete, térfogatnál köbe számít. Ez a leggyakoribb nagyságrendi hiba.": [
    "For area, square the length conversion factor; for volume, cube it. This is a common source of order-of-magnitude errors.",
    "Bei Flächen wird der Längenfaktor quadriert, bei Volumen kubiert. Hier entstehen besonders häufig Fehler um ganze Größenordnungen."
  ],
  "Eltolást is tartalmazó skála": [
    "Scales with an offset",
    "Skalen mit verschobenem Nullpunkt"
  ],
  "Hőmérsékletnél Celsius és Fahrenheit között nem elég egy szorzó; a skálák nullpontja is eltér.": [
    "Celsius and Fahrenheit require more than a multiplier because their zero points differ.",
    "Für Celsius und Fahrenheit reicht ein Faktor nicht aus, da ihre Nullpunkte verschieden sind."
  ],
  "Fogalmilag eltérő egységek": [
    "Conceptually different units",
    "Begrifflich unterschiedliche Einheiten"
  ],
  "Energia és teljesítmény, adatméret és adatsebesség, tömeg és erő nem váltható át egymásba plusz információ nélkül.": [
    "Energy and power, data size and data rate, or mass and force cannot be converted into each other without additional information.",
    "Energie und Leistung, Datenmenge und Datenrate sowie Masse und Kraft lassen sich ohne zusätzliche Angaben nicht ineinander umrechnen."
  ],
  "Minőségi elv": [
    "Quality principle",
    "Qualitätsgrundsatz"
  ],
  "Az átváltó oldalakon nem csak a váltószámot adjuk meg: minden oldal azt az egy tipikus félreértést magyarázza, amely az adott mennyiségnél a legkönnyebben hibához vezet.": [
    "Our conversion pages explain more than the factor: each page addresses a typical misunderstanding most likely to cause errors for that quantity.",
    "Unsere Umrechnungsseiten nennen nicht nur den Faktor: Jede Seite erklärt ein typisches Missverständnis, das bei der jeweiligen Größe besonders leicht zu Fehlern führt."
  ],
  "Mértékegység átváltó központ és deviza | Kalkulátor Bázis": [
    "Unit Conversion Hub and Currency Converter · Kalkulátor Bázis",
    "Einheiten- und Währungsumrechner · Kalkulátor Bázis"
  ],
  "Egy közös átváltó 11 mértékegység-kategóriához, valamint külön deviza átváltó élő árfolyamadattal.": [
    "One converter for 11 unit categories, plus a separate currency converter with live exchange-rate data.",
    "Ein gemeinsamer Umrechner für 11 Einheitenkategorien sowie ein separater Währungsrechner mit aktuellen Kursdaten."
  ],
  "9 kalkulátor": [
    "9 calculators",
    "9 Rechner"
  ],
  "Fogyasztás, üzemanyagköltség és becsült hatótáv egy összetett eszközben.": [
    "Fuel consumption, fuel cost and estimated range in one combined tool.",
    "Verbrauch, Kraftstoffkosten und geschätzte Reichweite in einem gemeinsamen Werkzeug."
  ],
  "Autópályadíj kalkulátor": [
    "Motorway Toll Calculator",
    "Autobahnmaut-Rechner"
  ],
  "Oszd el az autópályadíjat utasok között.": [
    "Split motorway tolls between passengers.",
    "Teile Autobahngebühren unter den Mitfahrenden auf."
  ],
  "3 kalkulátor": [
    "3 calculators",
    "3 Rechner"
  ],
  "Autós kalkulátorok valósabb költségtervezéshez": [
    "Car calculators for more realistic cost planning",
    "Autorechner für eine realistischere Kostenplanung"
  ],
  "Az autózás költsége sokkal több, mint egy tankolás ára. A fogyasztás, üzemanyagár, autópályadíj, szerviz, biztosítás, értékvesztés és parkolás együtt adja ki azt, hogy mennyibe kerül valójában egy kilométer vagy egy év autóhasználat.": [
    "Driving costs much more than a tank of fuel. Consumption, fuel price, motorway tolls, servicing, insurance, depreciation and parking together determine the real cost per kilometre or year.",
    "Autofahren kostet viel mehr als eine Tankfüllung. Verbrauch, Kraftstoffpreis, Autobahngebühren, Wartung, Versicherung, Wertverlust und Parken bestimmen gemeinsam die tatsächlichen Kosten je Kilometer oder Nutzungsjahr."
  ],
  "Ebben a kategóriában azokat a kalkulátorokat találod, amelyek gyors becslést adnak utazás, tankolás vagy autófenntartás előtt. Az": [
    "This category contains calculators for quick estimates before a journey, refuelling or planning car ownership costs. The",
    "Diese Kategorie enthält Rechner für schnelle Schätzungen vor einer Fahrt, dem Tanken oder der Planung der Fahrzeugkosten. Der"
  ],
  "üzemanyagköltség kalkulátor": [
    "fuel cost calculator",
    "Kraftstoffkostenrechner"
  ],
  "egy konkrét út árát becsüli, az": [
    "estimates the price of a specific trip, while the",
    "schätzt die Kosten einer konkreten Fahrt, während der"
  ],
  "autó fogyasztás kalkulátor": [
    "fuel consumption calculator",
    "Verbrauchsrechner"
  ],
  "pedig tankolás alapján segít ellenőrizni a valós liter/100 km értéket.": [
    "helps check actual litres per 100 km from refuelling data.",
    "anhand von Tankdaten hilft, den tatsächlichen Verbrauch in Litern je 100 km zu prüfen."
  ],
  "Ha rendszeresen autózol, érdemes továbbmenni: az éves autóköltség, kilométerdíj és értékvesztés kalkulátor megmutatja, hogy a napi használat hosszabb távon milyen pénzügyi terhet jelenthet.": [
    "If you drive regularly, go further: annual car cost, cost-per-kilometre and depreciation calculators show the longer-term financial burden of daily use.",
    "Wenn du regelmäßig fährst, lohnt sich der nächste Schritt: Rechner für jährliche Fahrzeugkosten, Kilometerkosten und Wertverlust zeigen die längerfristige finanzielle Belastung der täglichen Nutzung."
  ],
  "Indulás előtt": [
    "Before setting off",
    "Vor der Abfahrt"
  ],
  "Becsüld meg az üzemanyagot, autópályadíjat, menetidőt és a biztonságos tankolási pontot.": [
    "Estimate fuel, motorway tolls, travel time and a safe refuelling point.",
    "Schätze Kraftstoffbedarf, Autobahngebühren, Fahrzeit und einen sicheren Tankzeitpunkt."
  ],
  "Tankolás után": [
    "After refuelling",
    "Nach dem Tanken"
  ],
  "A ténylegesen betöltött literből és megtett kilométerből ellenőrizd a valós fogyasztást.": [
    "Check actual consumption using the litres filled and kilometres driven.",
    "Prüfe den tatsächlichen Verbrauch anhand der getankten Liter und gefahrenen Kilometer."
  ],
  "Hónap vagy év végén": [
    "At month-end or year-end",
    "Am Monats- oder Jahresende"
  ],
  "Add hozzá a biztosítást, szervizt, gumit, parkolást és értékvesztést is, hogy ne csak a benzinköltséget lásd.": [
    "Include insurance, servicing, tyres, parking and depreciation to see more than fuel costs.",
    "Berücksichtige auch Versicherung, Wartung, Reifen, Parken und Wertverlust, damit du mehr als die Kraftstoffkosten siehst."
  ],
  "Autóválasztáskor": [
    "When choosing a car",
    "Bei der Fahrzeugwahl"
  ],
  "Azonos futást és használatot feltételezve hasonlíts össze több forgatókönyvet.": [
    "Compare scenarios with the same mileage and usage assumptions.",
    "Vergleiche Szenarien mit derselben Fahrleistung und denselben Nutzungsannahmen."
  ],
  "Mire figyelj autós számításnál?": [
    "What should I consider in car calculations?",
    "Worauf sollte ich bei Autoberechnungen achten?"
  ],
  "A leggyakoribb hiba, hogy a felhasználó csak az üzemanyagot számolja. Rövid útnál ez elég lehet első becslésre, de saját autó fenntartásánál a biztosítás, szerviz, gumi, értékvesztés, parkolás, autópályadíj és esetleges hitelteher is része a valós költségnek.": [
    "The most common mistake is counting fuel alone. This may be enough for an initial estimate for a short trip, but owning a car also involves insurance, servicing, tyres, depreciation, parking, motorway tolls and possibly loan costs.",
    "Der häufigste Fehler besteht darin, nur den Kraftstoff zu berücksichtigen. Für eine erste Schätzung bei kurzen Fahrten kann das reichen. Zum eigenen Auto gehören aber auch Versicherung, Wartung, Reifen, Wertverlust, Parken, Autobahngebühren und gegebenenfalls Kreditkosten."
  ],
  "Valós fogyasztást több tankolásból számolj:": [
    "Calculate actual consumption over several fill-ups:",
    "Berechne den tatsächlichen Verbrauch über mehrere Tankfüllungen:"
  ],
  "egyetlen tankolásnál a kút, a pisztoly leoldása és a megtett út is torzíthat.": [
    "a single fill-up can be distorted by the pump, its shut-off point and the route driven.",
    "Bei einer einzelnen Tankfüllung können Zapfsäule, Abschaltpunkt und gefahrene Strecke das Ergebnis verzerren."
  ],
  "Ne tervezz nullára hatótávot:": [
    "Do not plan to use the entire remaining range:",
    "Plane nicht bis zum letzten Kilometer Reichweite:"
  ],
  "forgalom, kerülő, időjárás és terhelés miatt mindig hagyj tartalékot.": [
    "always leave a reserve for traffic, detours, weather and load.",
    "Lass wegen Verkehr, Umwegen, Wetter und Beladung stets eine Reserve."
  ],
  "A CO2-becslés közvetlen kibocsátás:": [
    "The CO2 estimate covers direct emissions:",
    "Die CO2-Schätzung umfasst direkte Emissionen:"
  ],
  "a teljes életciklus, gyártás és üzemanyag-előállítás külön módszertan.": [
    "life-cycle emissions, manufacturing and fuel production require a separate methodology.",
    "Lebenszyklus, Fahrzeugherstellung und Kraftstoffproduktion erfordern eine eigene Methodik."
  ],
  "A gumiméret nem csak geometria:": [
    "Tyre size is more than geometry:",
    "Die Reifengröße ist mehr als Geometrie:"
  ],
  "terhelési index, felni, futómű és gyártói engedély is számít.": [
    "load rating, wheel rim, suspension and manufacturer approval also matter.",
    "Auch Tragfähigkeitsindex, Felge, Fahrwerk und Herstellerfreigabe sind wichtig."
  ],
  "Források és ellenőrzési alapok": [
    "Sources and verification",
    "Quellen und Prüfgrundlagen"
  ],
  "Autós témáknál a módszertani háttérhez gyártói adatok, hivatalos útdíj- és közlekedési tájékoztatók, ACEA, European Environment Agency és EPA jellegű kibocsátási vagy járműipari források adhatnak támpontot. Az aktuális díjak, matricák, árak és járműspecifikus adatok változhatnak, ezért végleges döntés előtt mindig a szolgáltató vagy gyártó aktuális adata az irányadó.": [
    "Car-related methodology can draw on manufacturer data, official toll and transport information, and emissions or automotive sources such as ACEA, the European Environment Agency and EPA. Fees, vignettes, prices and vehicle-specific data can change; always use the provider’s or manufacturer’s current information before a final decision.",
    "Für die Methodik bei Autothemen dienen Herstellerangaben, amtliche Maut- und Verkehrsinformationen sowie Emissions- oder Fahrzeugquellen wie ACEA, die Europäische Umweltagentur und EPA als Orientierung. Gebühren, Vignetten, Preise und fahrzeugspezifische Daten können sich ändern. Für endgültige Entscheidungen sind stets die aktuellen Angaben des Anbieters oder Herstellers maßgeblich."
  ],
  "Autóvásárlás vagy fenntartás előtt a költségszámítást érdemes összekötni a": [
    "Before buying or running a car, combine cost estimates with the",
    "Verbinde Kostenschätzungen vor dem Autokauf oder bei der Nutzung mit den"
  ],
  "pénzügyi kalkulátorokkal": [
    "financial calculators",
    "Finanzrechnern"
  ],
  ", mert hitel, megtakarítás és havi költségvetés nélkül könnyű alábecsülni a terhet. Külföldi útnál az": [
    ", since ignoring loans, savings and monthly budgets can make the burden easy to underestimate. For trips abroad, the",
    ", denn ohne Kredit, Ersparnisse und Monatsbudget lässt sich die Belastung leicht unterschätzen. Bei Auslandsreisen helfen die"
  ],
  "átváltók": [
    "unit converters",
    "Einheitenumrechner"
  ],
  "és devizaeszközök, mindennapi elszámolásnál pedig a": [
    "and currency tools can help, while for everyday settlements the",
    "und Währungswerkzeuge; bei alltäglichen Abrechnungen helfen die"
  ],
  "százalék, rezsi vagy költségmegosztó kalkulátorok": [
    "percentage, utility and cost-sharing calculators",
    "Prozent-, Nebenkosten- und Kostenteilungsrechner"
  ],
  "segíthetnek. Így az útiköltség nem különálló szám, hanem a teljes döntés része.": [
    "can be useful. This makes travel cost part of the whole decision, rather than an isolated figure.",
    ". So werden Reisekosten Teil der gesamten Entscheidung statt einer isolierten Zahl."
  ],
  "Elég az üzemanyagköltséget számolni?": [
    "Is calculating fuel cost enough?",
    "Reicht es, die Kraftstoffkosten zu berechnen?"
  ],
  "Rövid útnál jó kiindulás, de hosszabb távú autóhasználatnál szerviz, biztosítás, gumi, parkolás és értékvesztés is számít.": [
    "It is a useful starting point for a short trip, but longer-term use also involves servicing, insurance, tyres, parking and depreciation.",
    "Für kurze Fahrten ist das ein guter Ausgangspunkt. Bei längerfristiger Nutzung zählen aber auch Wartung, Versicherung, Reifen, Parken und Wertverlust."
  ],
  "Miért térhet el a valós fogyasztás?": [
    "Why can actual consumption differ?",
    "Warum kann der tatsächliche Verbrauch abweichen?"
  ],
  "A vezetési stílus, forgalom, időjárás, guminyomás, terhelés és útvonal is módosíthatja.": [
    "Driving style, traffic, weather, tyre pressure, load and route can all affect it.",
    "Fahrstil, Verkehr, Wetter, Reifendruck, Beladung und Strecke können ihn verändern."
  ],
  "Tájékozódásra igen, hivatalos elszámolásnál a belső szabályzatot és jogszabályi előírásokat is ellenőrizni kell.": [
    "For guidance, yes. For official expense claims, also check internal policies and legal requirements.",
    "Zur Orientierung ja. Bei offiziellen Abrechnungen müssen auch interne Vorgaben und gesetzliche Anforderungen geprüft werden."
  ],
  "Mikor hasznos a kilométerdíj?": [
    "When is cost per kilometre useful?",
    "Wann sind Kilometerkosten hilfreich?"
  ],
  "Akkor, ha több közlekedési módot, autót vagy útvonalat hasonlítasz össze, és nem csak a tankolás árát szeretnéd látni.": [
    "When comparing transport modes, cars or routes and you want to see more than the fuel bill.",
    "Wenn du Verkehrsmittel, Autos oder Strecken vergleichst und mehr als die Tankkosten sehen möchtest."
  ],
  "Mert újabb autónál sokszor ez a legnagyobb költség, mégis gyakran kimarad a havi fenntartási becslésből.": [
    "Because it is often the largest cost for a newer car, yet is frequently omitted from monthly ownership estimates.",
    "Weil er bei neueren Autos häufig der größte Kostenposten ist und trotzdem oft in monatlichen Kostenschätzungen fehlt."
  ],
  "A kalkulátor megmondja, melyik autót vegyem?": [
    "Does the calculator tell me which car to buy?",
    "Sagt mir der Rechner, welches Auto ich kaufen soll?"
  ],
  "Nem. A költségszámítás döntési alap lehet, de műszaki állapot, biztonság, igény és szerviztörténet is számít.": [
    "No. Cost calculations can inform a decision, but condition, safety, needs and service history also matter.",
    "Nein. Kostenberechnungen können eine Entscheidungsgrundlage sein. Zustand, Sicherheit, Bedarf und Wartungshistorie sind aber ebenfalls wichtig."
  ],
  "Autós döntési útvonal": [
    "Car ownership decision path",
    "Entscheidungsweg rund ums Auto"
  ],
  "Ne egyetlen tankolásból próbáld megérteni az autó teljes költségét": [
    "A single fill-up cannot explain the full cost of a car",
    "Eine einzige Tankfüllung erklärt nicht die gesamten Fahrzeugkosten"
  ],
  "Egy út költsége, az éves fenntartás és egy autó birtoklási költsége három külön kérdés. A kategória ezért az út előtti becsléstől a tankolás utáni ellenőrzésen át az éves teljes költségig vezet.": [
    "A trip’s cost, annual running costs and the total cost of owning a car are three different questions. This category guides you from pre-trip estimates through post-refuelling checks to total annual costs.",
    "Fahrtkosten, jährlicher Unterhalt und Gesamtkosten des Autobesitzes sind drei verschiedene Fragen. Diese Kategorie führt von der Schätzung vor der Fahrt über die Prüfung nach dem Tanken bis zu den gesamten Jahreskosten."
  ],
  "Út előtt": [
    "Before a trip",
    "Vor einer Fahrt"
  ],
  "Üzemanyag, hatótáv, útdíj és menetidő: itt az a cél, hogy legyen reális terv és tartalék.": [
    "Fuel, range, tolls and travel time: the aim is a realistic plan with a reserve.",
    "Kraftstoff, Reichweite, Maut und Fahrzeit: Ziel ist eine realistische Planung mit Reserve."
  ],
  "A valós fogyasztást több tankolásból érdemes trendként követni, nem egyetlen mérésből.": [
    "Track actual consumption as a trend over several fill-ups, not from a single measurement.",
    "Verfolge den tatsächlichen Verbrauch als Trend über mehrere Tankfüllungen statt anhand einer einzelnen Messung."
  ],
  "Éves szinten": [
    "Over a year",
    "Auf Jahressicht"
  ],
  "Biztosítás, szerviz, gumi, parkolás és értékvesztés együtt mutatja meg a teljes terhet.": [
    "Insurance, servicing, tyres, parking and depreciation together show the full burden.",
    "Versicherung, Wartung, Reifen, Parken und Wertverlust zeigen gemeinsam die gesamte Belastung."
  ],
  "Két autót azonos futás és azonos költségkör mellett hasonlíts össze, különben félrevezető az eredmény.": [
    "Compare two cars using the same mileage and cost categories, otherwise the result is misleading.",
    "Vergleiche zwei Autos mit derselben Fahrleistung und denselben Kostenarten, sonst ist das Ergebnis irreführend."
  ],
  "Az autós kalkulátorok nem ugyanazt a „km × fogyasztás × ár” képletet ismétlik. Mindegyik más döntési hibát vagy költségréteget tesz láthatóvá.": [
    "These car calculators do not simply repeat the same distance × consumption × price formula. Each reveals a different decision error or cost component.",
    "Diese Autorechner wiederholen nicht einfach dieselbe Formel Kilometer × Verbrauch × Preis. Jeder macht einen anderen Entscheidungsfehler oder Kostenbestandteil sichtbar."
  ],
  "Autó és közlekedés kalkulátorok | Fogyasztás, költség és hatótáv": [
    "Car and Transport Calculators · Consumption, Costs and Range",
    "Auto- und Verkehrsrechner · Verbrauch, Kosten und Reichweite"
  ],
  "Autós kalkulátorok fogyasztáshoz, üzemanyagköltséghez, hatótávhoz, fenntartáshoz, értékvesztéshez, gumimérethez és utazáshoz.": [
    "Car calculators for consumption, fuel costs, range, running costs, depreciation, tyre sizes and travel.",
    "Autorechner für Verbrauch, Kraftstoffkosten, Reichweite, Unterhalt, Wertverlust, Reifengrößen und Reisen."
  ],
  "4 kalkulátor": [
    "4 calculators",
    "4 Rechner"
  ],
  "5 kalkulátor": [
    "5 calculators",
    "5 Rechner"
  ],
  "Tervezd meg, mikor érdemes lefeküdni vagy felkelni 90 perces ciklusokkal.": [
    "Plan when to go to bed or wake up using 90-minute cycles.",
    "Plane Schlafens- oder Aufstehzeiten anhand von 90-Minuten-Zyklen."
  ],
  "Egészség kalkulátorok: gyors tájékozódás, nem diagnózis": [
    "Health calculators: quick guidance, not a diagnosis",
    "Gesundheitsrechner: schnelle Orientierung, keine Diagnose"
  ],
  "Az egészség kalkulátorok segítenek első képet kapni olyan mutatókról, mint a BMI, napi kalóriaszükséglet, BMR, testzsírszázalék, pulzuszóna vagy folyadékbevitel. Ezek a számítások hasznosak lehetnek életmódváltás, sport vagy étrendi tervezés előtt, de nem helyettesítenek orvosi vizsgálatot.": [
    "Health calculators offer an initial picture of measures such as BMI, daily calorie needs, BMR, body fat, heart-rate zones and fluid intake. They can help before lifestyle changes, sport or dietary planning, but do not replace a medical examination.",
    "Gesundheitsrechner geben einen ersten Überblick über Werte wie BMI, täglichen Kalorienbedarf, Grundumsatz, Körperfett, Pulszonen und Flüssigkeitszufuhr. Sie können vor Lebensstiländerungen, Sport oder Ernährungsplanung helfen, ersetzen jedoch keine ärztliche Untersuchung."
  ],
  "Érdemes a kategóriát sorrendben használni: először nézd meg a": [
    "A useful order is to start with the",
    "Eine sinnvolle Reihenfolge beginnt mit dem"
  ],
  "BMI kalkulátort": [
    "BMI calculator",
    "BMI-Rechner"
  ],
  "és a": [
    "and the",
    "und dem"
  ],
  "BMR kalkulátort": [
    "BMR calculator",
    "Grundumsatzrechner"
  ],
  ", majd a": [
    ", then use the",
    ". Nutze anschließend den"
  ],
  "kalória kalkulátorral": [
    "calorie calculator to",
    "Kalorienrechner, um den"
  ],
  "becsüld meg a napi energiaigényt. Sport esetén a pulzuszóna és fehérjeszükséglet kalkulátor adhat további kapaszkodót.": [
    "estimate daily energy needs. For sport, heart-rate zone and protein requirement calculators provide further guidance.",
    "täglichen Energiebedarf zu schätzen. Für Sport können Pulszonen- und Proteinbedarfsrechner weitere Orientierung geben."
  ],
  "Az eredményeket mindig a saját testérzeteddel, egészségi állapotoddal és szükség esetén szakember véleményével együtt értelmezd. Egyetlen szám nem mond el mindent az egészségedről.": [
    "Always interpret results alongside how you feel, your health and, where needed, professional advice. One number cannot describe your overall health.",
    "Ordne Ergebnisse stets zusammen mit deinem Körpergefühl, deinem Gesundheitszustand und bei Bedarf fachlichem Rat ein. Eine einzelne Zahl beschreibt nicht deine gesamte Gesundheit."
  ],
  "Ha egy változást szeretnél követni": [
    "If you want to track a change",
    "Wenn du Veränderungen verfolgen möchtest"
  ],
  "A BMI, testzsír és derék-csípő arány ismételt, azonos körülmények között végzett mérése a trendet teszi láthatóvá. Egyetlen érték nem diagnózis.": [
    "Repeated BMI, body fat and waist-to-hip measurements under the same conditions reveal trends. A single value is not a diagnosis.",
    "Wiederholte Messungen von BMI, Körperfett und Taille-Hüfte-Verhältnis unter gleichen Bedingungen zeigen Trends. Ein Einzelwert ist keine Diagnose."
  ],
  "Ha étrendet vagy edzést tervezel": [
    "If you are planning diet or exercise",
    "Wenn du Ernährung oder Training planst"
  ],
  "A BMR, kalória, makró, fehérje és pulzuszóna becslései kiinduló keretet adnak, amit a valós tapasztalat alapján kell finomítani.": [
    "BMR, calorie, macro, protein and heart-rate estimates provide a starting framework that should be refined using real-world experience.",
    "Schätzungen für Grundumsatz, Kalorien, Makros, Protein und Pulszonen geben einen Ausgangsrahmen, der anhand praktischer Erfahrungen angepasst werden muss."
  ],
  "Mikor ne kalkulátorból dönts?": [
    "When should you avoid deciding from a calculator?",
    "Wann solltest du nicht anhand eines Rechners entscheiden?"
  ],
  "Várandósság, gyermekkor, krónikus betegség, gyógyszerszedés vagy aggasztó tünet esetén kérj orvosi vagy dietetikusi segítséget.": [
    "During pregnancy or childhood, with chronic illness, medication use or concerning symptoms, seek help from a doctor or dietitian.",
    "Hole in Schwangerschaft und Kindheit sowie bei chronischen Erkrankungen, Medikamenteneinnahme oder beunruhigenden Beschwerden ärztlichen oder ernährungsmedizinischen Rat ein."
  ],
  "Gyakori értelmezési hibák": [
    "Common interpretation mistakes",
    "Häufige Fehler bei der Einordnung"
  ],
  "A BMI nem testösszetétel-mérés:": [
    "BMI does not measure body composition:",
    "Der BMI misst nicht die Körperzusammensetzung:"
  ],
  "sportolóknál, időseknél, várandósság alatt vagy gyermekeknél önmagában könnyen félrevezető lehet.": [
    "it can easily mislead on its own for athletes, older adults, pregnant people and children.",
    "Allein betrachtet kann er bei Sportlern, älteren Menschen, Schwangeren und Kindern leicht irreführend sein."
  ],
  "A kalóriabecslés nem személyre szabott étrend:": [
    "Calorie estimates are not personalised meal plans:",
    "Kalorienschätzungen sind keine individuellen Ernährungspläne:"
  ],
  "alvás, stressz, hormonális állapot, betegségek és napi aktivitás is módosíthatja az energiaigényt.": [
    "sleep, stress, hormonal status, illness and daily activity can affect energy needs.",
    "Schlaf, Stress, Hormonstatus, Erkrankungen und tägliche Aktivität können den Energiebedarf beeinflussen."
  ],
  "A pulzuszóna képletből indul:": [
    "Heart-rate zones start from a formula:",
    "Pulszonen beruhen zunächst auf einer Formel:"
  ],
  "a valós terhelhetőséget edzettség, gyógyszerszedés és keringési állapot is befolyásolja.": [
    "actual exercise capacity also depends on fitness, medication and cardiovascular health.",
    "Die tatsächliche Belastbarkeit hängt auch von Trainingszustand, Medikamenten und Herz-Kreislauf-Gesundheit ab."
  ],
  "A folyadékbevitel helyzetfüggő:": [
    "Fluid intake depends on circumstances:",
    "Der Flüssigkeitsbedarf hängt von der Situation ab:"
  ],
  "hőség, sport, láz, várandósság vagy egyes betegségek mellett más lehet az igény.": [
    "needs may change with heat, exercise, fever, pregnancy and certain illnesses.",
    "Bei Hitze, Sport, Fieber, Schwangerschaft oder bestimmten Erkrankungen kann sich der Bedarf ändern."
  ],
  "Források és szakmai keretek": [
    "Sources and professional context",
    "Quellen und fachlicher Rahmen"
  ],
  "Egészségügyi témáknál a kalkulátorok csak általános tájékozódást adnak. A módszertani háttérnél nemzetközi, széles körben hivatkozott forrásokat veszünk alapul, például WHO, NIH és Mayo Clinic anyagokat, illetve az adott témához kapcsolódó hazai szakmai tájékoztatókat, ha relevánsak. A képletek és kategóriák nem helyettesítik az orvosi diagnózist.": [
    "Health calculators provide general guidance only. Our methods draw on widely cited international sources, such as WHO, NIH and Mayo Clinic materials, and relevant Hungarian professional information where applicable. Formulas and categories do not replace a medical diagnosis.",
    "Gesundheitsrechner dienen nur der allgemeinen Orientierung. Die Methodik stützt sich auf international häufig zitierte Quellen wie WHO, NIH und Mayo Clinic sowie gegebenenfalls einschlägige ungarische Fachinformationen. Formeln und Kategorien ersetzen keine ärztliche Diagnose."
  ],
  "Életmódváltásnál az egészségügyi becsléseket érdemes hétköznapi és pénzügyi tervezéssel együtt kezelni. Bevásárlásnál az": [
    "For lifestyle changes, combine health estimates with everyday and financial planning. When shopping, the",
    "Verbinde Gesundheitsschätzungen bei Lebensstiländerungen mit Alltags- und Finanzplanung. Beim Einkauf können die"
  ],
  "egységár és százalék kalkulátorok": [
    "unit-price and percentage calculators",
    "Einheitspreis- und Prozentrechner"
  ],
  ", edzéshez vagy utazáshoz az": [
    ", for exercise or travel the",
    "helfen, bei Training oder Reisen die"
  ],
  ", hosszabb céloknál pedig a": [
    ", and for longer-term goals the",
    "und bei längerfristigen Zielen die"
  ],
  "adhatnak kiegészítő nézőpontot. A cél nem az, hogy egyetlen szám döntsön, hanem hogy több adatból óvatosabb képet kapj.": [
    "can add useful perspectives. The aim is to build a more cautious picture from several data points, rather than let one number decide.",
    "zusätzliche Perspektiven liefern. Ziel ist ein vorsichtigeres Gesamtbild aus mehreren Angaben statt einer Entscheidung anhand einer einzigen Zahl."
  ],
  "Orvosi tanácsnak számítanak az eredmények?": [
    "Do the results count as medical advice?",
    "Gelten die Ergebnisse als medizinischer Rat?"
  ],
  "Nem. A kalkulátorok tájékoztató becslést adnak, diagnózishoz vagy kezeléshez szakember szükséges.": [
    "No. The calculators provide indicative estimates; diagnosis and treatment require a qualified professional.",
    "Nein. Die Rechner liefern unverbindliche Schätzungen. Für Diagnose und Behandlung ist Fachpersonal erforderlich."
  ],
  "Melyik kalkulátorral kezdjem?": [
    "Which calculator should I start with?",
    "Mit welchem Rechner sollte ich beginnen?"
  ],
  "Általában a BMI, BMR és kalória kalkulátor jó első kör, de a célodtól függően más eszköz is fontos lehet.": [
    "BMI, BMR and calorie calculators are usually a useful first step, but other tools may matter depending on your goal.",
    "BMI-, Grundumsatz- und Kalorienrechner sind meist ein sinnvoller Einstieg. Je nach Ziel können andere Werkzeuge ebenfalls wichtig sein."
  ],
  "Miért térhet el a valós energiaigény?": [
    "Why can actual energy needs differ?",
    "Warum kann der tatsächliche Energiebedarf abweichen?"
  ],
  "Anyagcsere, mozgás, alvás, stressz, hormonális állapot és egészségi tényezők is befolyásolják.": [
    "Metabolism, movement, sleep, stress, hormonal status and health factors all affect it.",
    "Stoffwechsel, Bewegung, Schlaf, Stress, Hormonstatus und gesundheitliche Faktoren beeinflussen ihn."
  ],
  "Használható gyermekekre a felnőtt BMI?": [
    "Can adult BMI be used for children?",
    "Kann der Erwachsenen-BMI bei Kindern verwendet werden?"
  ],
  "Nem ugyanúgy. Gyermekeknél életkor- és nemspecifikus percentilisek szükségesek, ezért felnőtt BMI alapján nem érdemes dönteni.": [
    "Not in the same way. Children need age- and sex-specific percentiles, so decisions should not rely on adult BMI categories.",
    "Nicht auf dieselbe Weise. Bei Kindern sind alters- und geschlechtsspezifische Perzentile nötig; Entscheidungen sollten daher nicht auf dem Erwachsenen-BMI beruhen."
  ],
  "Mikor sürgős szakemberhez fordulni?": [
    "When is professional help urgent?",
    "Wann ist fachliche Hilfe dringend nötig?"
  ],
  "Hirtelen romló állapot, mellkasi fájdalom, ájulás, erős légszomj, súlyos kiszáradás vagy aggasztó tünet esetén ne kalkulátort használj, hanem kérj orvosi segítséget.": [
    "For sudden deterioration, chest pain, fainting, severe breathlessness, severe dehydration or concerning symptoms, seek medical help instead of using a calculator.",
    "Bei plötzlicher Verschlechterung, Brustschmerzen, Ohnmacht, starker Atemnot, schwerer Austrocknung oder beunruhigenden Beschwerden solltest du ärztliche Hilfe suchen statt einen Rechner zu verwenden."
  ],
  "Miért fontos a több mérésből álló trend?": [
    "Why is a trend based on several measurements useful?",
    "Warum ist ein Trend aus mehreren Messungen wichtig?"
  ],
  "Mert egyetlen mérés hibás lehet. Azonos körülmények között ismételt adatokból jobban látszik a valódi változás.": [
    "A single measurement can be wrong. Repeated data under the same conditions show genuine changes more clearly.",
    "Eine einzelne Messung kann fehlerhaft sein. Wiederholte Angaben unter gleichen Bedingungen zeigen tatsächliche Veränderungen deutlicher."
  ],
  "Egészségügyi döntési térkép": [
    "Health decision map",
    "Entscheidungshilfe für Gesundheitsthemen"
  ],
  "Egy szám helyett négy kérdés": [
    "Four questions instead of one number",
    "Vier Fragen statt einer einzelnen Zahl"
  ],
  "Az egészség kalkulátorok akkor hasznosak, ha nem diagnózist keresel bennük, hanem egy mérés vagy becslés helyét akarod megérteni. A kategóriát ezért négy külön nézőpontra bontjuk.": [
    "Health calculators are useful for understanding the place of a measurement or estimate, rather than seeking a diagnosis. We therefore divide this category into four perspectives.",
    "Gesundheitsrechner helfen, eine Messung oder Schätzung einzuordnen, statt eine Diagnose zu suchen. Deshalb gliedern wir diese Kategorie in vier Blickwinkel."
  ],
  "Testméret és testösszetétel": [
    "Body size and composition",
    "Körpermaße und Körperzusammensetzung"
  ],
  "BMI, derék–csípő arány és testzsír. Ezek különböző dolgokat mérnek vagy becsülnek, ezért egyik sem helyettesíti a másikat.": [
    "BMI, waist-to-hip ratio and body fat measure or estimate different things. None replaces the others.",
    "BMI, Taille-Hüfte-Verhältnis und Körperfett messen oder schätzen unterschiedliche Dinge. Keiner dieser Werte ersetzt die anderen."
  ],
  "Energia és tápanyag": [
    "Energy and nutrients",
    "Energie und Nährstoffe"
  ],
  "BMR, kalória, makró és fehérje. A képletek kiindulópontok; a valós igény aktivitással, egészségi állapottal és idővel változhat.": [
    "BMR, calories, macros and protein: formulas are starting points. Actual needs can vary with activity, health and time.",
    "Grundumsatz, Kalorien, Makros und Protein: Formeln sind Ausgangspunkte. Der tatsächliche Bedarf kann sich mit Aktivität, Gesundheit und Zeit verändern."
  ],
  "Pulzuszóna és alvás. A képletből számolt zóna mellé terhelésérzetet, az alvásnál pedig mennyiséget és minőséget is érdemes nézni.": [
    "Heart-rate zones and sleep: consider perceived exertion alongside calculated zones, and both sleep quantity and quality.",
    "Pulszonen und Schlaf: Beachte neben berechneten Zonen auch dein Belastungsempfinden und beim Schlaf sowohl Dauer als auch Qualität."
  ],
  "Külön élethelyzet": [
    "Special circumstances",
    "Besondere Lebenssituationen"
  ],
  "Várandósság és folyadékbevitel. Itt a kalkulátor eredménye különösen csak tájékozódási pont, mert az egyéni körülmények nagy súllyal számítanak.": [
    "Pregnancy and fluid intake: here results are especially only a guide, because individual circumstances have considerable influence.",
    "Schwangerschaft und Flüssigkeitszufuhr: Hier sind Ergebnisse besonders nur eine Orientierung, da individuelle Umstände großen Einfluss haben."
  ],
  "Testméretből indulok →": [
    "Start with body measurements →",
    "Mit Körpermaßen beginnen →"
  ],
  "Energiaigényt becsülök →": [
    "Estimate energy needs →",
    "Energiebedarf schätzen →"
  ],
  "Edzést tervezek →": [
    "Plan exercise →",
    "Training planen →"
  ],
  "Alvást tervezek →": [
    "Plan sleep →",
    "Schlaf planen →"
  ],
  "Várandósság, gyermekkor, krónikus betegség, gyógyszerszedés vagy panasz esetén ne egy általános kalkulátorból hozz egészségügyi döntést.": [
    "During pregnancy or childhood, or with chronic illness, medication use or symptoms, do not base health decisions on a general-purpose calculator.",
    "Triff in Schwangerschaft und Kindheit sowie bei chronischen Erkrankungen, Medikamenteneinnahme oder Beschwerden keine Gesundheitsentscheidung allein anhand eines allgemeinen Rechners."
  ],
  "Egészség és sport kalkulátorok | BMI, kalória, makró és pulzus": [
    "Health and Fitness Calculators · BMI, Calories, Macros and Heart Rate",
    "Gesundheits- und Sportrechner · BMI, Kalorien, Makros und Puls"
  ],
  "Egészség- és sportkalkulátorok BMI-hez, testzsírhoz, kalóriához, BMR-hez, makrókhoz, fehérjéhez, pulzushoz és alváshoz.": [
    "Health and fitness calculators for BMI, body fat, calories, BMR, macros, protein, heart rate and sleep.",
    "Gesundheits- und Sportrechner für BMI, Körperfett, Kalorien, Grundumsatz, Makros, Protein, Puls und Schlaf."
  ],
  "Ugrás a témacsoportokhoz": [
    "Jump to topic groups",
    "Zu den Themengruppen springen"
  ],
  "8 kalkulátor": [
    "8 calculators",
    "8 Rechner"
  ],
  "Szükséges beton mennyiségének kiszámítása.": [
    "Calculate the amount of concrete required.",
    "Berechne die benötigte Betonmenge."
  ],
  "10 kalkulátor": [
    "10 calculators",
    "10 Rechner"
  ],
  "Építőipari kalkulátorok anyagmennyiség becsléséhez": [
    "Construction calculators for estimating material quantities",
    "Baurechner zur Schätzung von Materialmengen"
  ],
  "Felújításnál és építkezésnél a pontatlan anyagbecslés gyorsan többletköltséghez, csúszáshoz vagy felesleges maradékhoz vezethet. Az építőipari kalkulátorok célja, hogy már a tervezés elején legyen egy nagyságrendi képed a szükséges mennyiségekről.": [
    "Inaccurate material estimates during renovation or construction can quickly cause extra costs, delays or unnecessary leftovers. These construction calculators provide an early indication of the quantities required.",
    "Ungenaue Materialschätzungen bei Renovierung und Bau führen schnell zu Mehrkosten, Verzögerungen oder unnötigen Resten. Diese Baurechner geben schon zu Beginn der Planung eine grobe Vorstellung von den benötigten Mengen."
  ],
  "festék kalkulátor": [
    "paint calculator",
    "Farbrechner"
  ],
  "falfelülethez és rétegszámhoz, a": [
    "estimates from wall area and coats, the",
    "schätzt anhand von Wandfläche und Anstrichen, der"
  ],
  "beton kalkulátor": [
    "concrete calculator",
    "Betonrechner"
  ],
  "köbméterhez, a": [
    "from cubic metres, and the",
    "anhand von Kubikmetern und der"
  ],
  "tégla kalkulátor": [
    "brick calculator",
    "Ziegelrechner"
  ],
  "falazathoz ad becslést. Burkolás, hőszigetelés, gipszkarton vagy tapéta esetén a megfelelő kalkulátor kiválasztásával gyorsabban készíthető bevásárlólista vagy költségterv.": [
    "for masonry. Choosing the right tool for tiling, insulation, plasterboard or wallpaper makes it quicker to prepare a shopping list or cost plan.",
    "für Mauerwerk. Mit dem passenden Rechner für Beläge, Dämmung, Gipskarton oder Tapeten lassen sich Einkaufsliste und Kostenplan schneller erstellen."
  ],
  "A számításoknál mindig legyen ráhagyás. Vágás, törés, felületi egyenetlenség, hibás mérés vagy kivitelezési veszteség miatt a pontos matematikai mennyiség gyakran kevés.": [
    "Always include an allowance. Cuts, breakages, uneven surfaces, measurement errors and application losses mean the exact mathematical quantity is often insufficient.",
    "Plane immer einen Zuschlag ein. Zuschnitt, Bruch, Unebenheiten, Messfehler und Verarbeitungsverluste führen dazu, dass die exakte mathematische Menge häufig nicht ausreicht."
  ],
  "Mérd fel a kész szerkezetet.": [
    "Measure the finished structure.",
    "Miss die fertige Konstruktion aus."
  ],
  "Hossz, szélesség, magasság és rétegvastagság nélkül nincs jó becslés.": [
    "A sound estimate needs length, width, height and layer thickness.",
    "Eine gute Schätzung benötigt Länge, Breite, Höhe und Schichtdicke."
  ],
  "Azonosítsd a konkrét terméket.": [
    "Identify the specific product.",
    "Bestimme das konkrete Produkt."
  ],
  "A tégla, festék, burkolat vagy beton típusa módosítja a fajlagos mennyiséget.": [
    "The type of brick, paint, covering or concrete changes the specific quantity required.",
    "Die Art von Ziegel, Farbe, Belag oder Beton verändert den spezifischen Mengenbedarf."
  ],
  "Válassz indokolt ráhagyást.": [
    "Choose a justified allowance.",
    "Wähle einen begründeten Zuschlag."
  ],
  "Egyszerű sík felületen kevesebb, sok vágással vagy hibás aljzattal több veszteség várható.": [
    "Simple flat surfaces usually have lower losses; many cuts or an uneven substrate increase them.",
    "Bei einfachen ebenen Flächen sind meist weniger Verluste zu erwarten, bei vielen Zuschnitten oder mangelhaftem Untergrund mehr."
  ],
  "Rendelés előtt ellenőrizz.": [
    "Check before ordering.",
    "Prüfe vor der Bestellung."
  ],
  "Szerkezeti vagy nagy értékű munkánál a helyszíni felmérés és a szakember döntése az elsődleges.": [
    "For structural or high-value work, an on-site survey and professional assessment take priority.",
    "Bei tragenden Konstruktionen oder kostspieligen Arbeiten haben Aufmaß und fachliche Beurteilung vor Ort Vorrang."
  ],
  "Mekkora ráhagyással számolj?": [
    "How much allowance should I include?",
    "Wie viel Zuschlag sollte ich einplanen?"
  ],
  "Nincs minden anyagra érvényes ráhagyási százalék. Festésnél a fedőképesség és a fal állapota, burkolásnál a kiosztás és vágás, téglánál a kötésmód, tetőcserépnél a hajlásszög és fedési mód, hőszigetelésnél pedig a nyílások és sarkok változtatják a mennyiséget. A kalkulátor ezért becslést ad, nem helyszíni felmérést.": [
    "No single allowance percentage suits every material. Paint coverage and wall condition, tiling layout and cuts, brick bonding, roof pitch and tile overlap, and openings and corners in insulation all change quantities. The calculator therefore provides an estimate, not an on-site survey.",
    "Es gibt keinen einheitlichen Zuschlag für alle Materialien. Bei Farbe zählen Deckkraft und Wandzustand, bei Belägen Verlegung und Zuschnitt, bei Ziegeln der Verband, bei Dachziegeln Neigung und Deckart und bei Dämmung Öffnungen und Ecken. Der Rechner liefert deshalb eine Schätzung, kein Aufmaß vor Ort."
  ],
  "Ne csak nettó felületből indulj:": [
    "Do not rely only on net area:",
    "Gehe nicht nur von der Nettofläche aus:"
  ],
  "a sarkok, beugrók, nyílások és javítási tartalék módosíthatják az anyagigényt.": [
    "corners, recesses, openings and repair allowances can affect material quantities.",
    "Ecken, Nischen, Öffnungen und Reparaturreserven können den Materialbedarf verändern."
  ],
  "Mindig konkrét termékadattal ellenőrizz:": [
    "Always check specific product data:",
    "Prüfe stets konkrete Produktangaben:"
  ],
  "két festék, ragasztó, tégla vagy cserép fajlagos értéke eltérhet.": [
    "two paints, adhesives, bricks or roof tiles can have different consumption rates.",
    "Zwei Farben, Kleber, Ziegel oder Dachziegel können unterschiedliche spezifische Verbrauchswerte haben."
  ],
  "A kivitelezési veszteség valós költség:": [
    "Application losses are real costs:",
    "Verarbeitungsverluste sind tatsächliche Kosten:"
  ],
  "vágás, törés, keverési maradék és selejt miatt a matematikai minimum ritkán elég.": [
    "cuts, breakages, mixing residues and rejects mean the mathematical minimum rarely suffices.",
    "Durch Zuschnitt, Bruch, Mischreste und Ausschuss reicht das mathematische Minimum selten aus."
  ],
  "Szerkezeti döntéshez szakember kell:": [
    "Structural decisions need a professional:",
    "Konstruktive Entscheidungen benötigen Fachleute:"
  ],
  "statika, vízszigetelés, tűzvédelem vagy páratechnika nem mennyiségi kalkulátor kérdése.": [
    "structural engineering, waterproofing, fire safety and moisture behaviour cannot be decided by a quantity calculator.",
    "Statik, Abdichtung, Brandschutz und Feuchteverhalten sind keine Fragen für einen Mengenrechner."
  ],
  "Források és gyártói adatok": [
    "Sources and manufacturer data",
    "Quellen und Herstellerangaben"
  ],
  "Építőipari mennyiségeknél a gyártói adatlap az egyik legfontosabb forrás. A Knauf, Rigips, Baumit, Leier, Wienerberger és más gyártók termékadatai, kiadóssági táblái és rendszerleírásai gyakran pontosabbak, mint egy általános képlet. A Kalkulátor Bázis célja, hogy ezekhez a döntésekhez előzetes nagyságrendi becslést adjon.": [
    "Manufacturer data sheets are among the most important sources for construction quantities. Product data, coverage tables and system instructions from Knauf, Rigips, Baumit, Leier, Wienerberger and other manufacturers are often more precise than a general formula. Kalkulátor Bázis provides preliminary estimates to support these decisions.",
    "Herstellerdatenblätter gehören zu den wichtigsten Quellen für Baumengen. Produktdaten, Verbrauchstabellen und Systembeschreibungen von Knauf, Rigips, Baumit, Leier, Wienerberger und anderen Herstellern sind oft genauer als eine allgemeine Formel. Kalkulátor Bázis liefert dafür vorläufige Schätzungen zur Orientierung."
  ],
  "Felújításnál a mennyiségi becslés csak az egyik réteg. Költségkerethez és tartalékhoz használd a": [
    "Material estimates are only one part of renovation planning. For budgets and reserves, use the",
    "Mengenschätzungen sind nur ein Teil der Renovierungsplanung. Für Budget und Reserve nutze die"
  ],
  "pénzügyi kalkulátorokat": [
    "financial calculators",
    "Finanzrechner"
  ],
  ", méretek, terület vagy térfogat ellenőrzéséhez az": [
    ", for dimensions, area or volume checks the",
    ", für Maße, Fläche oder Volumen die"
  ],
  "átváltókat": [
    "unit converters",
    "Einheitenumrechner"
  ],
  ", vásárlásnál pedig a": [
    ", and when buying the",
    "und beim Einkauf die"
  ],
  "kedvezmény és egységár kalkulátorokat": [
    "discount and unit-price calculators",
    "Rabatt- und Einheitspreisrechner"
  ],
  ". A pontos rendeléshez a helyszíni felmérés, a gyártói adatlap és a kivitelező tapasztalata együtt ad biztonságosabb alapot.": [
    ". Accurate orders are best supported by an on-site survey, product data sheets and the contractor’s experience together.",
    ". Eine verlässliche Bestellung stützt sich auf das gemeinsame Zusammenspiel von Aufmaß, Herstellerdatenblatt und Erfahrung des Ausführenden."
  ],
  "Elég a kalkulátor alapján rendelni?": [
    "Can I order based on the calculator alone?",
    "Kann ich allein anhand des Rechners bestellen?"
  ],
  "Kisebb munkánál jó becslés lehet, de végleges rendelés előtt érdemes kivitelezővel vagy kereskedővel egyeztetni.": [
    "It can provide a useful estimate for smaller jobs, but confirm final orders with a contractor or merchant.",
    "Für kleinere Arbeiten kann er eine gute Schätzung liefern. Stimme endgültige Bestellungen jedoch mit einem Ausführenden oder Händler ab."
  ],
  "Anyagtól és munkától függ. Festéknél, burkolatnál, téglánál és betonnál más lehet az életszerű veszteség.": [
    "It depends on the material and job. Realistic losses differ for paint, coverings, bricks and concrete.",
    "Das hängt von Material und Arbeit ab. Realistische Verluste unterscheiden sich bei Farbe, Belägen, Ziegeln und Beton."
  ],
  "Statikai kérdésekre jók ezek az eszközök?": [
    "Can these tools answer structural questions?",
    "Eignen sich diese Werkzeuge für statische Fragen?"
  ],
  "Nem. Mennyiségi becslést adnak, szerkezeti tervezéshez szakember szükséges.": [
    "No. They estimate quantities; structural design requires a qualified professional.",
    "Nein. Sie schätzen Mengen. Für die Tragwerksplanung sind qualifizierte Fachleute nötig."
  ],
  "Levonjam a nyílásokat?": [
    "Should I subtract openings?",
    "Soll ich Öffnungen abziehen?"
  ],
  "Nagy ajtót vagy ablakot sok esetben igen, de kis nyílásnál a levonásnál fontosabb lehet a vágási és javítási tartalék.": [
    "Often yes for large doors or windows. For small openings, cutting and repair allowances may matter more than the deduction.",
    "Große Türen oder Fenster häufig ja. Bei kleinen Öffnungen können Zuschnitt und Reparaturreserve wichtiger sein als der Abzug."
  ],
  "Miért más a gyártói kiadósság?": [
    "Why does manufacturer coverage vary?",
    "Warum unterscheiden sich Hersteller-Verbrauchsangaben?"
  ],
  "Anyagminőség, rétegvastagság, aljzat, keverés és kivitelezési technika miatt ugyanarra a felületre eltérő fogyás adódhat.": [
    "Material quality, thickness, substrate, mixing and application technique can cause different consumption on the same area.",
    "Materialqualität, Schichtdicke, Untergrund, Mischung und Verarbeitung können auf derselben Fläche zu unterschiedlichem Verbrauch führen."
  ],
  "Miért fontos az azonos gyártási tétel?": [
    "Why is the same production batch important?",
    "Warum ist dieselbe Produktionscharge wichtig?"
  ],
  "Burkolatnál, cserépnél vagy látszó anyagoknál a későbbi utánrendelés színben vagy méretben eltérhet.": [
    "For coverings, roof tiles and visible materials, later orders may differ in colour or size.",
    "Bei Belägen, Dachziegeln und sichtbaren Materialien können Nachbestellungen in Farbe oder Maß abweichen."
  ],
  "Felújítási döntési útvonal": [
    "Renovation decision path",
    "Entscheidungsweg für Renovierungen"
  ],
  "Ne anyagot számolj először, hanem rétegrendet és munkafázist": [
    "Start with layer systems and work stages, not material totals",
    "Plane zuerst Schichtaufbau und Arbeitsphasen statt Materialmengen"
  ],
  "Az építőipari kalkulátorok akkor adnak igazán használható eredményt, ha a mérés, az aljzat vagy szerkezet állapota, a konkrét termék és a kivitelezési veszteség külön-külön is tisztázott. Ugyanaz a négyzetméter más anyagigényt jelenthet festésnél, burkolásnál, vakolásnál vagy hőszigetelésnél.": [
    "Construction calculators are most useful when measurements, substrate or structural condition, the specific product and application losses have each been clarified. The same square metre can require different quantities for painting, tiling, plastering or insulation.",
    "Baurechner sind am hilfreichsten, wenn Maße, Untergrund- oder Konstruktionszustand, konkretes Produkt und Verarbeitungsverluste einzeln geklärt sind. Derselbe Quadratmeter kann bei Anstrich, Belag, Putz oder Dämmung unterschiedliche Mengen erfordern."
  ],
  "Méret és geometria": [
    "Dimensions and geometry",
    "Maße und Geometrie"
  ],
  "Terület, térfogat, nyílások és rétegvastagság. Itt dől el a matematikai minimum.": [
    "Area, volume, openings and layer thickness establish the mathematical minimum.",
    "Fläche, Volumen, Öffnungen und Schichtdicke bestimmen das mathematische Minimum."
  ],
  "Térfogatot számolok →": [
    "Calculate volume →",
    "Volumen berechnen →"
  ],
  "Felület és alapállapot": [
    "Surface and substrate condition",
    "Oberfläche und Untergrundzustand"
  ],
  "Festék, vakolat, tapéta és hőszigetelés fogyását az alapfelület is erősen befolyásolja.": [
    "The substrate strongly affects consumption of paint, plaster, wallpaper and insulation.",
    "Der Untergrund beeinflusst den Verbrauch von Farbe, Putz, Tapeten und Dämmung erheblich."
  ],
  "Felületet tervezek →": [
    "Plan surfaces →",
    "Oberflächen planen →"
  ],
  "Kiosztás és vágás": [
    "Layout and cutting",
    "Verlegung und Zuschnitt"
  ],
  "Csempe, padló, térkő és tetőcserép esetén a veszteség nem puszta százalék: a geometria és a minta is számít.": [
    "For tiles, flooring, paving and roof tiles, losses are more than a percentage: geometry and pattern also matter.",
    "Bei Fliesen, Bodenbelägen, Pflaster und Dachziegeln sind Verluste mehr als ein Prozentsatz: Geometrie und Muster zählen ebenfalls."
  ],
  "Burkolatot tervezek →": [
    "Plan coverings →",
    "Beläge planen →"
  ],
  "Rendszerben gondolkodás": [
    "Thinking in systems",
    "In Systemen denken"
  ],
  "Gipszkarton, hőszigetelés és tetőfedés nem egyetlen termékből áll. A kiegészítők és csomópontok is részei a beszerzésnek.": [
    "Plasterboard, insulation and roofing involve more than one product. Accessories and junctions are also part of procurement.",
    "Gipskarton, Dämmung und Dachdeckung bestehen nicht aus einem einzigen Produkt. Zubehör und Anschlüsse gehören ebenfalls zur Beschaffung."
  ],
  "Rendszert tervezek →": [
    "Plan a system →",
    "Ein System planen →"
  ],
  "Minőségi elv:": [
    "Quality principle:",
    "Qualitätsgrundsatz:"
  ],
  "a kalkulátor eredménye rendelési kiindulópont, nem helyszíni felmérés. A végleges mennyiséget a konkrét gyártói adatlap, a kivitelezési terv és szükség esetén szakember ellenőrzése tegye véglegessé.": [
    "the calculator result is a starting point for ordering, not an on-site survey. Final quantities should be confirmed against the specific product data sheet, construction plan and, where needed, professional review.",
    "Das Rechenergebnis ist eine Bestellgrundlage, kein Aufmaß vor Ort. Die endgültige Menge ist anhand des konkreten Datenblatts, des Ausführungsplans und bei Bedarf durch Fachleute zu bestätigen."
  ],
  "Otthon és felújítás kalkulátorok | Anyagszükséglet és burkolás": [
    "Home and Renovation Calculators · Material Quantities and Tiling",
    "Haus- und Renovierungsrechner · Materialbedarf und Beläge"
  ],
  "Felújítási és építőipari kalkulátorok betonhoz, csempéhez, festékhez, gipszkartonhoz, szigeteléshez, burkolathoz és tetőhöz.": [
    "Renovation and construction calculators for concrete, tiles, paint, plasterboard, insulation, flooring and roofing.",
    "Renovierungs- und Baurechner für Beton, Fliesen, Farbe, Gipskarton, Dämmung, Beläge und Dächer."
  ],
  "Árkedvezmény kalkulátor": [
    "Discount Calculator",
    "Rabattrechner"
  ],
  "Borravaló kalkulátor": [
    "Tip Calculator",
    "Trinkgeldrechner"
  ],
  "Oszd el a számlát és számold ki a borravalót több főre.": [
    "Split a bill and calculate tips for several people.",
    "Teile eine Rechnung auf und berechne Trinkgeld für mehrere Personen."
  ],
  "Egységár kalkulátor": [
    "Unit Price Calculator",
    "Einheitspreisrechner"
  ],
  "6 kalkulátor": [
    "6 calculators",
    "6 Rechner"
  ],
  "Gyors százalékszámítás hétköznapi helyzetekhez.": [
    "Quick percentage calculations for everyday situations.",
    "Schnelle Prozentrechnung für Alltagssituationen."
  ],
  "Számtani, súlyozott és mértani átlag egy közös eszközben, mediánnal és ellenőrző adatokkal.": [
    "Arithmetic, weighted and geometric means in one tool, with the median and checking data.",
    "Arithmetischer, gewichteter und geometrischer Mittelwert in einem Werkzeug, mit Median und Prüfdaten."
  ],
  "Számold ki egy rész arányát az egészhez képest.": [
    "Calculate a part’s proportion of the whole.",
    "Berechne den Anteil eines Teils am Ganzen."
  ],
  "Százalékos változás kalkulátor": [
    "Percentage Change Calculator",
    "Prozentänderungsrechner"
  ],
  "Számold ki két érték közötti növekedést vagy csökkenést százalékban.": [
    "Calculate the percentage increase or decrease between two values.",
    "Berechne die prozentuale Zunahme oder Abnahme zwischen zwei Werten."
  ],
  "Dátum hozzáadás és kivonás kalkulátor": [
    "Date Addition and Subtraction Calculator",
    "Datumsrechner zum Addieren und Subtrahieren"
  ],
  "Napok hozzáadása egy dátumhoz vagy kivonása belőle, a cél dátum és a hét napjának megjelenítésével.": [
    "Add days to or subtract days from a date, displaying the resulting date and weekday.",
    "Addiere Tage zu einem Datum oder ziehe sie ab; Zieldatum und Wochentag werden angezeigt."
  ],
  "Mindennapi kalkulátorok gyors, hétköznapi döntésekhez": [
    "Everyday calculators for quick daily decisions",
    "Alltagsrechner für schnelle tägliche Entscheidungen"
  ],
  "A mindennapi kategória azokat az egyszerű, de gyakran előkerülő számításokat gyűjti össze, amelyekhez nem érdemes külön táblázatot nyitni. Százalék, ÁFA, kedvezmény, egységár, borravaló, munkaidő, életkor, dátumkülönbség vagy rezsimegosztás: mind olyan helyzet, ahol egy gyors kalkulátor időt spórol.": [
    "This category brings together simple but frequent calculations that do not need a separate spreadsheet. Percentages, VAT, discounts, unit prices, tips, working hours, age, date differences and shared utilities are all situations where a quick calculator saves time.",
    "Diese Kategorie sammelt einfache, häufige Berechnungen, für die sich keine eigene Tabelle lohnt. Prozent, Umsatzsteuer, Rabatt, Einheitspreis, Trinkgeld, Arbeitszeit, Alter, Datumsdifferenz oder Nebenkostenteilung: Überall spart ein schneller Rechner Zeit."
  ],
  "Vásárláskor kezdd a": [
    "When shopping, start with the",
    "Beginne beim Einkauf mit dem"
  ],
  "kedvezmény": [
    "discount",
    "Rabatt"
  ],
  "egységár": [
    "unit-price",
    "Einheitspreis"
  ],
  "százalék kalkulátorral": [
    "percentage calculator",
    "Prozentrechner"
  ],
  ". Számlázásnál és árértelmezésnél az": [
    ". For invoices and prices, the",
    ". Bei Rechnungen und Preisen hilft der"
  ],
  "segít, közös költségeknél pedig a borravaló vagy rezsimegosztás kalkulátor lehet praktikus.": [
    "helps, while tip and utility-sharing calculators are practical for shared costs.",
    "; bei gemeinsamen Kosten sind Trinkgeld- und Nebenkostenteilungsrechner praktisch."
  ],
  "A cél itt nem bonyolult szakmai modell, hanem gyors ellenőrzés: kevesebb fejben számolás, kevesebb elírás, érthetőbb eredmény.": [
    "The aim is a quick check rather than a complex professional model: less mental arithmetic, fewer typing errors and clearer results.",
    "Ziel ist eine schnelle Prüfung statt eines komplexen Fachmodells: weniger Kopfrechnen, weniger Tippfehler und verständlichere Ergebnisse."
  ],
  "A boltban:": [
    "In the shop:",
    "Im Geschäft:"
  ],
  "kedvezmény, egységár és százalék segít két ajánlatot valóban összevetni.": [
    "discounts, unit prices and percentages help compare two offers properly.",
    "Rabatte, Einheitspreise und Prozente ermöglichen einen echten Vergleich zweier Angebote."
  ],
  "Otthon:": [
    "At home:",
    "Zu Hause:"
  ],
  "rezsi, borravaló és közös kiadás osztható el előre egyeztetett szabály szerint.": [
    "utilities, tips and shared expenses can be split using an agreed rule.",
    "Nebenkosten, Trinkgeld und gemeinsame Ausgaben lassen sich nach einer vorher vereinbarten Regel aufteilen."
  ],
  "Munka közben:": [
    "At work:",
    "Bei der Arbeit:"
  ],
  "órabér, munkaidő és ÁFA ellenőrizhető gyorsan, de a jogi-adózási feltételeket külön kell kezelni.": [
    "hourly pay, working hours and VAT can be checked quickly, but legal and tax conditions must be considered separately.",
    "Stundenlohn, Arbeitszeit und Umsatzsteuer lassen sich schnell prüfen; rechtliche und steuerliche Voraussetzungen sind getrennt zu betrachten."
  ],
  "Határidőnél:": [
    "For dates and deadlines:",
    "Bei Terminen und Fristen:"
  ],
  "életkor és dátumkülönbség számolható anélkül, hogy a hónaphosszakon kellene végiglépkedni.": [
    "calculate age and date differences without stepping through varying month lengths.",
    "Alter und Datumsdifferenzen lassen sich ohne manuelles Durchgehen der Monatslängen berechnen."
  ],
  "Gyakori hétköznapi számítási hibák": [
    "Common everyday calculation mistakes",
    "Häufige Rechenfehler im Alltag"
  ],
  "A legegyszerűbb számításoknál is sok a félreértés. Két egymás utáni kedvezmény nem adódik össze simán, a bruttó és nettó ár nem ugyanaz, a nulla és az üres adat nem azonos, a dátumszámításnál pedig nem mindegy, hogy beleszámítod-e a kezdőnapot.": [
    "Even simple calculations cause misunderstandings. Two successive discounts do not simply add together, gross and net prices differ, zero and an empty input are not the same, and date calculations depend on whether the starting day is included.",
    "Auch einfache Berechnungen führen zu Missverständnissen. Zwei aufeinanderfolgende Rabatte lassen sich nicht einfach addieren. Brutto und netto sind verschieden, null und eine leere Eingabe sind nicht dasselbe, und bei Datumsberechnungen zählt, ob der Anfangstag einbezogen wird."
  ],
  "Vásárlás": [
    "Shopping",
    "Einkauf"
  ],
  "Akciós ár, százalék és egységár együtt mutatja meg, melyik ajánlat éri meg ténylegesen.": [
    "Sale prices, percentages and unit prices together show which offer is truly worthwhile.",
    "Aktionspreis, Prozentsatz und Einheitspreis zeigen gemeinsam, welches Angebot sich tatsächlich lohnt."
  ],
  "Számlázás": [
    "Invoicing",
    "Rechnungsstellung"
  ],
  "ÁFA vagy fizetési határidő esetén a gyors számítás mellett az aktuális szabályt és szerződést is ellenőrizni kell.": [
    "For VAT or payment deadlines, also check the current rules and contract alongside the quick calculation.",
    "Prüfe bei Umsatzsteuer oder Zahlungsfristen neben der schnellen Berechnung auch die aktuellen Regeln und den Vertrag."
  ],
  "Közös költség": [
    "Shared costs",
    "Gemeinsame Kosten"
  ],
  "Rezsi vagy borravaló megosztásánál előre tisztázd, egyenlő vagy fogyasztásarányos osztást szeretnél.": [
    "Before splitting utilities or tips, agree whether to divide equally or by usage.",
    "Kläre vor dem Teilen von Nebenkosten oder Trinkgeld, ob gleichmäßig oder nach Verbrauch aufgeteilt wird."
  ],
  "Idő és munka": [
    "Time and work",
    "Zeit und Arbeit"
  ],
  "Munkaidő, órabér és dátumkülönbség számításnál a munkanap, naptári nap és pihenőnap fogalma eltérhet.": [
    "Working-hours, hourly-pay and date-difference calculations may distinguish working days, calendar days and rest days.",
    "Bei Arbeitszeit, Stundenlohn und Datumsdifferenzen können sich Arbeits-, Kalender- und Ruhetage unterscheiden."
  ],
  "A mindennapi kalkulátorok többsége egyszerű matematikai képletekre épül. ÁFA, számlázási vagy munkával kapcsolatos kérdésnél azonban a NAV tájékoztatói, a hatályos jogszabályok, a szerződés és a munkáltatói szabályzat lehet az irányadó. A Kalkulátor Bázis gyors ellenőrzést ad, nem hivatalos állásfoglalást.": [
    "Most everyday calculators use simple mathematical formulas. For VAT, invoicing and employment questions, however, NAV guidance, current law, contracts and workplace policies may be authoritative. Kalkulátor Bázis provides a quick check, not an official interpretation.",
    "Die meisten Alltagsrechner verwenden einfache mathematische Formeln. Bei Umsatzsteuer, Rechnungsstellung oder Arbeit können jedoch NAV-Informationen, geltendes Recht, Verträge und betriebliche Vorgaben maßgeblich sein. Kalkulátor Bázis bietet eine schnelle Prüfung, keine amtliche Auslegung."
  ],
  "A mindennapi számítások gyakran más döntések előszobái. Nagyobb vásárlás előtt a": [
    "Everyday calculations often lead to other decisions. Before a larger purchase, the",
    "Alltagsberechnungen führen oft zu weiteren Entscheidungen. Vor größeren Käufen helfen die"
  ],
  ", felújításnál az": [
    ", during renovation the",
    ", bei Renovierungen die"
  ],
  "építőipari eszközök": [
    "construction tools",
    "Bauwerkzeuge"
  ],
  ", külföldi ár vagy mértékegység esetén az": [
    ", and for foreign prices or units the",
    "und bei ausländischen Preisen oder Einheiten die"
  ],
  "adnak pontosabb képet. Ha a számítás egészségi vagy életmódbeli döntéshez kapcsolódik, az": [
    "provide a fuller picture. If a calculation relates to health or lifestyle decisions, use the",
    "für ein vollständigeres Bild. Betrifft die Berechnung Gesundheit oder Lebensstil, nutze auch die"
  ],
  "egészség kalkulátorokat": [
    "health calculators",
    "Gesundheitsrechner"
  ],
  "is óvatos, tájékoztató keretben használd.": [
    "as cautious, indicative guidance only.",
    "nur vorsichtig und zur Orientierung."
  ],
  "Melyik a leggyakrabban használt mindennapi kalkulátor?": [
    "Which everyday calculators are most frequently used?",
    "Welche Alltagsrechner werden besonders häufig gebraucht?"
  ],
  "A százalék, ÁFA, kedvezmény és egységár kalkulátor sok hétköznapi döntésnél előkerül.": [
    "Percentage, VAT, discount and unit-price calculators are useful for many everyday decisions.",
    "Prozent-, Umsatzsteuer-, Rabatt- und Einheitspreisrechner helfen bei vielen Alltagsentscheidungen."
  ],
  "Hivatalos számításra valók?": [
    "Are they for official calculations?",
    "Sind sie für offizielle Berechnungen gedacht?"
  ],
  "Gyors ellenőrzésre készültek. Hivatalos vagy szerződéses helyzetben mindig ellenőrizd a pontos adatokat.": [
    "They are designed for quick checks. Always verify exact data in official or contractual situations.",
    "Sie dienen der schnellen Prüfung. Bei amtlichen oder vertraglichen Angelegenheiten sind die genauen Angaben stets zu überprüfen."
  ],
  "Miért hasznos az egységár kalkulátor?": [
    "Why is a unit-price calculator useful?",
    "Warum ist ein Einheitspreisrechner hilfreich?"
  ],
  "Mert a nagyobb kiszerelés nem mindig olcsóbb; az egységár mutatja meg az összehasonlítható árat.": [
    "A larger pack is not always cheaper; unit prices provide a comparable basis.",
    "Eine größere Packung ist nicht immer günstiger. Der Einheitspreis schafft eine vergleichbare Grundlage."
  ],
  "Miért nem mindegy, nettó vagy bruttó összeget adok meg?": [
    "Why does it matter whether I enter a net or gross amount?",
    "Warum ist es wichtig, ob ich netto oder brutto eingebe?"
  ],
  "ÁFA és árképzés esetén a nettó összeg adó nélküli, a bruttó pedig adóval növelt ár. A rossz kiindulás rossz eredményt ad.": [
    "For VAT and pricing, net excludes tax and gross includes it. Starting from the wrong basis produces the wrong result.",
    "Bei Umsatzsteuer und Preisen bedeutet netto ohne Steuer, brutto einschließlich Steuer. Eine falsche Ausgangsbasis ergibt ein falsches Ergebnis."
  ],
  "Hogyan osszak igazságosan közös költséget?": [
    "How can shared costs be split fairly?",
    "Wie lassen sich gemeinsame Kosten fair aufteilen?"
  ],
  "Először döntsétek el, hogy egyenlő részekre vagy fogyasztás alapján osztotok. A kalkulátor csak a kiválasztott szabályt számolja végig.": [
    "First agree whether to split equally or by usage. The calculator only applies your chosen rule.",
    "Vereinbart zuerst, ob gleichmäßig oder nach Verbrauch geteilt wird. Der Rechner wendet nur die gewählte Regel an."
  ],
  "Mikor nem elég a gyors számolás?": [
    "When is a quick calculation insufficient?",
    "Wann reicht eine schnelle Berechnung nicht aus?"
  ],
  "Szerződés, hivatalos határidő, munkajogi vagy adózási kérdés esetén a pontos szabályozás és dokumentum az irányadó.": [
    "For contracts, official deadlines, employment law or taxes, the precise rules and documents are authoritative.",
    "Bei Verträgen, amtlichen Fristen, Arbeitsrecht oder Steuern sind die genauen Vorschriften und Unterlagen maßgeblich."
  ],
  "Hétköznapi döntési térkép": [
    "Everyday decision map",
    "Entscheidungshilfe für den Alltag"
  ],
  "Előbb tisztázd, mit hasonlítasz össze": [
    "Clarify what you are comparing first",
    "Kläre zuerst, was du vergleichst"
  ],
  "A legtöbb hétköznapi számolási hiba nem a műveletnél, hanem a kiindulási alapnál történik: más százalékból indulunk, más időt számolunk, vagy nem ugyanarra az egységre vetítjük az árakat.": [
    "Most everyday calculation errors arise from the starting point, not the operation: using different percentage bases, counting different time periods or comparing prices per different units.",
    "Die meisten Alltagsrechenfehler entstehen nicht beim Rechnen, sondern an der Ausgangsbasis: unterschiedliche Prozentgrundlagen, verschiedene Zeiträume oder Preise je unterschiedlicher Einheit."
  ],
  "Ár és vásárlás": [
    "Prices and shopping",
    "Preise und Einkauf"
  ],
  "Százalék, kedvezmény, ÁFA és egységár. A közös nevező mindig azonos alap vagy azonos egység legyen.": [
    "Percentages, discounts, VAT and unit prices: always use the same basis or unit.",
    "Prozent, Rabatt, Umsatzsteuer und Einheitspreis: Verwende stets dieselbe Bezugsgröße oder Einheit."
  ],
  "Megosztás": [
    "Sharing",
    "Aufteilen"
  ],
  "Borravaló és rezsi. Az egyenlő rész nem mindig ugyanaz, mint az igazságos rész; előbb az osztási szabályt érdemes rögzíteni.": [
    "Tips and utilities: equal shares are not always fair shares. Agree the allocation rule first.",
    "Trinkgeld und Nebenkosten: Ein gleicher Anteil ist nicht immer ein fairer Anteil. Legt zuerst die Verteilungsregel fest."
  ],
  "Munka és idő": [
    "Work and time",
    "Arbeit und Zeit"
  ],
  "Munkaidő, órabér, életkor és dátumkülönbség. Jelenléti idő, fizetett idő, naptári nap és beleértett kezdőnap külön fogalom.": [
    "Working hours, hourly pay, age and date differences: attendance time, paid time, calendar days and inclusion of the starting day are distinct concepts.",
    "Arbeitszeit, Stundenlohn, Alter und Datumsdifferenz: Anwesenheitszeit, bezahlte Zeit, Kalendertage und ein einbezogener Anfangstag sind unterschiedliche Begriffe."
  ],
  "Matematikai alap": [
    "Mathematical foundations",
    "Mathematische Grundlagen"
  ],
  "Átlag és arány. Az átlagot szélső értékek torzíthatják, az aránynál pedig nem mindegy, rész–egész vagy rész–rész viszonyról beszélünk.": [
    "Averages and ratios: extreme values can distort a mean, and part-to-whole and part-to-part ratios are different.",
    "Mittelwert und Verhältnis: Extremwerte können den Mittelwert verzerren. Teil-zu-Ganzem und Teil-zu-Teil sind unterschiedliche Verhältnisse."
  ],
  "ezek az oldalak nem egyforma „képlet + példa” lapok. Mindegyik egy tipikus félreértést vagy következő döntési lépést kezel.": [
    "these pages are not identical formula-and-example templates. Each addresses a typical misunderstanding or next decision step.",
    "Diese Seiten sind keine identischen Vorlagen aus Formel und Beispiel. Jede behandelt ein typisches Missverständnis oder den nächsten Entscheidungsschritt."
  ],
  "Mindennapi kalkulátorok | Vásárlás, matematika, munka és dátum": [
    "Everyday Calculators · Shopping, Maths, Work and Dates",
    "Alltagsrechner · Einkauf, Mathematik, Arbeit und Datum"
  ],
  "Mindennapi kalkulátorok vásárláshoz, közös költségekhez, százalék- és arányszámításhoz, munkaidőhöz és dátumokhoz.": [
    "Everyday calculators for shopping, shared costs, percentages, ratios, working hours and dates.",
    "Alltagsrechner für Einkauf, gemeinsame Kosten, Prozentrechnung, Verhältnisse, Arbeitszeit und Termine."
  ],
  "Becsüld meg, mekkora hitel férhet bele a jövedelmedbe.": [
    "Estimate how much borrowing your income could support.",
    "Schätze, welche Kredithöhe dein Einkommen tragen könnte."
  ],
  "Számold ki, mennyi idő kell a célösszeg eléréséhez.": [
    "Calculate how long it takes to reach a target amount.",
    "Berechne, wie lange es bis zu einem Zielbetrag dauert."
  ],
  "2 kalkulátor": [
    "2 calculators",
    "2 Rechner"
  ],
  "Fizetési határidő kiszámítása számlázáshoz.": [
    "Calculate payment deadlines for invoices.",
    "Berechne Zahlungsfristen für Rechnungen."
  ],
  "Számla teljesítési dátumának kiszámítása.": [
    "Calculate an invoice’s supply or performance date.",
    "Berechne das Leistungsdatum einer Rechnung."
  ],
  "Pénzügyi kalkulátorok tudatos döntésekhez": [
    "Financial calculators for informed decisions",
    "Finanzrechner für bewusste Entscheidungen"
  ],
  "A pénzügyi kategória nem egyszerű linkgyűjtemény: olyan eszközöket gyűjt össze, amelyek a mindennapi pénzdöntések előkészítésében segítenek. Itt találsz bérrel, adóval, hitelekkel, inflációval, megtakarítással, befektetéssel, osztalékkal és devizával kapcsolatos kalkulátorokat.": [
    "This category is more than a link collection: it brings together tools for preparing everyday financial decisions. It covers salary, taxes, borrowing, inflation, saving, investment, dividends and currencies.",
    "Diese Kategorie ist mehr als eine Linksammlung: Sie bündelt Werkzeuge zur Vorbereitung alltäglicher Finanzentscheidungen. Hier findest du Rechner für Lohn, Steuern, Kredite, Inflation, Sparen, Anlagen, Dividenden und Währungen."
  ],
  "Érdemes a számolást mindig a saját helyzetedből indítani. Először nézd meg, mennyi a tényleges nettó jövedelmed, mennyi marad havonta, van-e tartalékod, és csak utána érdemes hitelről vagy befektetésről gondolkodni. A kalkulátorok gyors becslést adnak, de nem helyettesítik a banki, adózási vagy befektetési tanácsadást.": [
    "Start with your own circumstances. First check actual net income, monthly surplus and reserves, then consider borrowing or investing. Calculators provide quick estimates, but do not replace banking, tax or investment advice.",
    "Beginne mit deiner eigenen Situation. Prüfe zuerst tatsächliches Nettoeinkommen, monatlichen Überschuss und Rücklagen und denke erst danach über Kredite oder Anlagen nach. Rechner liefern schnelle Schätzungen, ersetzen aber keine Bank-, Steuer- oder Anlageberatung."
  ],
  "Ha bérrel kapcsolatos kérdésed van, kezdd a": [
    "For salary questions, start with the",
    "Beginne bei Gehaltsfragen mit dem"
  ],
  "nettó - bruttó kalkulátorral": [
    "net–gross salary calculator",
    "Netto-Brutto-Rechner"
  ],
  ". Hitel előtt használd a": [
    ". Before borrowing, use the",
    ". Nutze vor einer Kreditaufnahme den"
  ],
  "hitel törlesztő kalkulátort": [
    "loan repayment calculator",
    "Kreditratenrechner"
  ],
  "hitelképesség kalkulátort": [
    "borrowing capacity calculator",
    "Kreditwürdigkeitsrechner"
  ],
  ". Megtakarításnál a": [
    ". For saving, the",
    ". Beim Sparen kann der"
  ],
  "infláció": [
    "inflation calculator",
    "Inflationsrechner"
  ],
  "adhat kiindulópontot.": [
    "can provide a starting point.",
    "einen Ausgangspunkt bieten."
  ],
  "1. Jövedelem és költségvetés": [
    "1. Income and budgeting",
    "1. Einkommen und Budget"
  ],
  "Először azt érdemes látni, mennyi pénz érkezik be és mennyi marad. Ebben a nettó-bruttó és havi költségvetés kalkulátor segít.": [
    "First establish how much comes in and remains. Net–gross salary and monthly budget calculators help.",
    "Kläre zuerst, wie viel Geld eingeht und übrig bleibt. Dabei helfen Netto-Brutto- und Monatsbudgetrechner."
  ],
  "2. Hitel és teherbírás": [
    "2. Borrowing and affordability",
    "2. Kredit und Tragfähigkeit"
  ],
  "Hitelfelvétel előtt a havi törlesztő és a jövedelem terhelhetősége fontosabb, mint a maximálisan elérhető hitelösszeg.": [
    "Before borrowing, monthly repayments and their burden on income matter more than the largest available loan.",
    "Vor der Kreditaufnahme sind Monatsrate und Einkommensbelastung wichtiger als die maximal verfügbare Kreditsumme."
  ],
  "3. Infláció és megtakarítás": [
    "3. Inflation and saving",
    "3. Inflation und Sparen"
  ],
  "A hosszú távú céloknál nem csak a forintösszeg számít, hanem a vásárlóerő és a kamatos kamat hatása is.": [
    "For long-term goals, purchasing power and compounding matter as well as the nominal forint amount.",
    "Bei langfristigen Zielen zählen neben dem Forintbetrag auch Kaufkraft und Zinseszinseffekt."
  ],
  "4. Befektetés és deviza": [
    "4. Investment and currencies",
    "4. Anlagen und Währungen"
  ],
  "ETF, osztalék vagy devizás helyzet előtt érdemes több forgatókönyvet összehasonlítani, és nem egyetlen optimista hozamból kiindulni.": [
    "For ETFs, dividends or foreign-currency decisions, compare several scenarios rather than relying on one optimistic return.",
    "Vergleiche bei ETFs, Dividenden oder Währungsfragen mehrere Szenarien, statt von einer einzigen optimistischen Rendite auszugehen."
  ],
  "Módszertani sorrend pénzügyi döntés előtt": [
    "A sensible order before financial decisions",
    "Sinnvolle Reihenfolge vor Finanzentscheidungen"
  ],
  "A pénzügyi kalkulátorokat érdemes egymásra építve használni. Először a biztos, havi szinten rendelkezésre álló jövedelmet és kötelező kiadásokat tisztázd, utána jöhet a hitelteher, a megtakarítási arány és a befektetési időtáv. Ha ezt a sorrendet megfordítod, könnyű túl optimista forgatókönyvből kiindulni.": [
    "Use financial calculators in sequence. Start with reliable monthly income and essential spending, then consider debt payments, saving rates and investment horizons. Reversing this order makes over-optimistic assumptions easy.",
    "Nutze Finanzrechner aufeinander aufbauend. Kläre zuerst verlässlich verfügbares Monatseinkommen und notwendige Ausgaben, dann Kreditbelastung, Sparquote und Anlagehorizont. In umgekehrter Reihenfolge entstehen leicht zu optimistische Annahmen."
  ],
  "Ne csak a havi részletet nézd:": [
    "Look beyond the monthly instalment:",
    "Betrachte mehr als die Monatsrate:"
  ],
  "hitelnél a teljes visszafizetés, a kamatváltozás és a vésztartalék is része a döntésnek.": [
    "total repayment, interest-rate changes and emergency reserves also matter when borrowing.",
    "Bei Krediten gehören Gesamtrückzahlung, Zinsänderungen und Notfallrücklagen zur Entscheidung."
  ],
  "Infláció nélkül félrevezető a célösszeg:": [
    "A target amount without inflation can mislead:",
    "Ein Zielbetrag ohne Inflation kann irreführen:"
  ],
  "hosszú távon a vásárlóerő legalább annyira fontos, mint a névleges forintösszeg.": [
    "over the long term, purchasing power matters at least as much as the nominal forint amount.",
    "Langfristig ist die Kaufkraft mindestens so wichtig wie der nominale Forintbetrag."
  ],
  "A hozam nem garancia:": [
    "Returns are not guaranteed:",
    "Renditen sind nicht garantiert:"
  ],
  "ETF, osztalék vagy kamatos kamat becslésnél több óvatos forgatókönyvet érdemes megnézni.": [
    "consider several cautious scenarios for ETF, dividend and compound-interest estimates.",
    "Betrachte bei ETF-, Dividenden- und Zinseszinsschätzungen mehrere vorsichtige Szenarien."
  ],
  "Az adózás változhat:": [
    "Tax rules can change:",
    "Steuerregeln können sich ändern:"
  ],
  "bér, ÁFA, osztalék vagy számlázás esetén mindig az aktuális szabály az irányadó.": [
    "for salary, VAT, dividends or invoices, current rules are always authoritative.",
    "Bei Lohn, Umsatzsteuer, Dividenden oder Rechnungen sind stets die aktuellen Regeln maßgeblich."
  ],
  "Pénzügyi témáknál elsődlegesen hivatalos vagy szakmai forrásokra támaszkodunk: NAV adózási tájékoztatók, MNB fogyasztóvédelmi és pénzügyi stabilitási anyagok, KSH inflációs és gazdasági adatok, valamint banki vagy szolgáltatói feltétellisták. A kalkulátorok eredménye ettől még tájékoztató becslés, nem ajánlat és nem személyre szabott tanács.": [
    "For financial topics we primarily use official or professional sources: NAV tax guidance, MNB consumer-protection and financial-stability material, KSH inflation and economic data, and bank or provider terms. Calculator results remain indicative estimates, not offers or personalised advice.",
    "Bei Finanzthemen stützen wir uns vor allem auf amtliche oder fachliche Quellen: NAV-Steuerinformationen, MNB-Unterlagen zu Verbraucherschutz und Finanzstabilität, KSH-Inflations- und Wirtschaftsdaten sowie Bank- und Anbieterbedingungen. Rechenergebnisse bleiben unverbindliche Schätzungen, keine Angebote oder individuelle Beratung."
  ],
  "Pénzügyi döntés előtt gyakran más kategóriák is segítenek. Vásárlási árak és adótartalom ellenőrzéséhez nézd meg a": [
    "Other categories often help before financial decisions. To check purchase prices and tax content, use the",
    "Vor Finanzentscheidungen helfen oft andere Kategorien. Prüfe Kaufpreise und Steueranteile mit den"
  ],
  "mindennapi kalkulátorokat": [
    "everyday calculators",
    "Alltagsrechnern"
  ],
  ", külföldi fizetéshez vagy devizás költéshez az": [
    ", for foreign payments and currency spending the",
    ", Auslandszahlungen und Währungsausgaben mit den"
  ],
  ", autóvásárlás vagy fenntartás előtt pedig az": [
    ", and before buying or running a car the",
    "und Autokauf oder Unterhalt mit den"
  ],
  "autós kalkulátorokat": [
    "car calculators",
    "Autorechnern"
  ],
  ". Ha a pénzügyi alapokat szeretnéd sorrendben átgondolni, indulhatsz a": [
    ". To think through financial basics in sequence, start with the",
    ". Um finanzielle Grundlagen systematisch zu durchdenken, beginne mit dem"
  ],
  "pénzügyi tudatosság útmutatóból": [
    "financial literacy guide",
    "Leitfaden zur Finanzkompetenz"
  ],
  "Melyik pénzügyi kalkulátorral kezdjem?": [
    "Which financial calculator should I start with?",
    "Mit welchem Finanzrechner sollte ich beginnen?"
  ],
  "Általában a nettó jövedelem és a havi költségvetés tisztázása a legjobb első lépés. Befektetés vagy hitel csak ezután következzen.": [
    "Clarifying net income and monthly budgets is usually the best first step. Consider investing or borrowing afterwards.",
    "Nettoeinkommen und Monatsbudget zu klären ist meist der beste erste Schritt. Anlagen oder Kredite sollten erst danach folgen."
  ],
  "A kalkulátorok hivatalos ajánlatnak számítanak?": [
    "Are calculator results official offers?",
    "Sind die Rechenergebnisse verbindliche Angebote?"
  ],
  "Nem. Az eredmények tájékoztató jellegűek, banki, adózási vagy befektetési döntés előtt ellenőrzés szükséges.": [
    "No. Results are for guidance and need checking before banking, tax or investment decisions.",
    "Nein. Die Ergebnisse dienen der Orientierung und müssen vor Bank-, Steuer- oder Anlageentscheidungen geprüft werden."
  ],
  "Miért fontos az infláció kalkulátor?": [
    "Why is the inflation calculator useful?",
    "Warum ist der Inflationsrechner hilfreich?"
  ],
  "Mert megmutatja, hogy a pénz vásárlóereje idővel változhat, így a névleges összeg önmagában félrevezető lehet.": [
    "It shows how purchasing power can change over time, making a nominal amount alone potentially misleading.",
    "Er zeigt, wie sich die Kaufkraft mit der Zeit ändern kann. Ein nominaler Betrag allein kann deshalb irreführen."
  ],
  "Befektetés előtt mit érdemes kiszámolni?": [
    "What should I calculate before investing?",
    "Was sollte ich vor einer Anlage berechnen?"
  ],
  "A havi félretételt, időtávot, várható költségeket, inflációt és azt, hogy mekkora veszteséget tudnál elviselni.": [
    "Monthly saving, time horizon, expected costs, inflation and the loss you could afford.",
    "Monatliche Sparrate, Zeithorizont, erwartete Kosten, Inflation und den Verlust, den du verkraften könntest."
  ],
  "Mikor kell szakértőt bevonni?": [
    "When should I involve a professional?",
    "Wann sollte ich Fachleute einbeziehen?"
  ],
  "Hitel, adózás, befektetés, vállalkozói számlázás vagy nagy összegű döntés előtt banki, könyvelői, adótanácsadói vagy befektetési szakértő ellenőrzése indokolt lehet.": [
    "Before borrowing, tax, investment, business invoicing or large financial decisions, checks by banking, accounting, tax or investment professionals may be appropriate.",
    "Vor Kredit-, Steuer-, Anlage- und größeren Finanzentscheidungen sowie geschäftlicher Rechnungsstellung kann eine Prüfung durch Bank-, Buchhaltungs-, Steuer- oder Anlagefachleute sinnvoll sein."
  ],
  "Miért nem elég egyetlen optimista forgatókönyv?": [
    "Why is one optimistic scenario insufficient?",
    "Warum reicht ein optimistisches Szenario nicht aus?"
  ],
  "Mert a kamat, infláció, jövedelem, díj és hozam is változhat. A döntés jobb, ha óvatos, közepes és kedvező esetet is összehasonlítasz.": [
    "Interest, inflation, income, fees and returns can all change. Compare cautious, moderate and favourable cases for a better-informed decision.",
    "Zinsen, Inflation, Einkommen, Gebühren und Renditen können sich ändern. Vergleiche vorsichtige, mittlere und günstige Fälle für eine bessere Entscheidungsgrundlage."
  ],
  "Pénzügyi döntési útvonal": [
    "Financial decision path",
    "Entscheidungsweg für Finanzen"
  ],
  "Ne kalkulátort válassz először, hanem kérdést": [
    "Start with a question, not a calculator",
    "Wähle zuerst eine Frage statt eines Rechners"
  ],
  "A pénzügyi oldalak célja nem az, hogy ugyanazt a sablont ismételjék más képlettel. Minden eszköz más döntési helyzetet bont fel: jövedelem, hitelteher, lakásvásárlás, megtakarítás, befektetés vagy számlázás.": [
    "Financial pages are not intended to repeat one template with different formulas. Each tool breaks down a different decision: income, debt burden, buying a home, saving, investing or invoicing.",
    "Die Finanzseiten sollen nicht dieselbe Vorlage mit anderen Formeln wiederholen. Jedes Werkzeug betrachtet eine andere Entscheidung: Einkommen, Kreditbelastung, Wohnungskauf, Sparen, Anlegen oder Rechnungsstellung."
  ],
  "Mennyi pénzből gazdálkodom?": [
    "How much money can I work with?",
    "Wie viel Geld steht mir zur Verfügung?"
  ],
  "Nettó–bruttó és havi költségvetés. Előbb a valós havi mozgásteredet tisztázd.": [
    "Net–gross salary and monthly budgets: clarify your actual monthly room for manoeuvre first.",
    "Netto-Brutto und Monatsbudget: Kläre zuerst deinen tatsächlichen monatlichen Spielraum."
  ],
  "Bérből indulok →": [
    "Start with salary →",
    "Mit dem Gehalt beginnen →"
  ],
  "Mekkora terhet bírok el?": [
    "What financial burden can I afford?",
    "Welche Belastung kann ich tragen?"
  ],
  "Hitelképesség, törlesztő és önerő. A banki maximum nem azonos a kényelmes háztartási limittel.": [
    "Borrowing capacity, repayments and deposits: the bank’s maximum is not the same as a comfortable household limit.",
    "Kreditwürdigkeit, Rate und Eigenkapital: Das Bankmaximum entspricht nicht einer angenehmen Haushaltsgrenze."
  ],
  "Hitelt tervezek →": [
    "Plan borrowing →",
    "Kredit planen →"
  ],
  "Mikor érem el a célomat?": [
    "When will I reach my goal?",
    "Wann erreiche ich mein Ziel?"
  ],
  "Kamatos kamat, célösszeg és infláció. Külön kezeld a nominális forintot és a vásárlóerőt.": [
    "Compound interest, target amounts and inflation: distinguish nominal forints from purchasing power.",
    "Zinseszins, Zielbetrag und Inflation: Trenne nominale Forintbeträge von Kaufkraft."
  ],
  "Célösszeget tervezek →": [
    "Plan a target amount →",
    "Zielbetrag planen →"
  ],
  "Mit jelent a befektetési feltételezés?": [
    "What do investment assumptions mean?",
    "Was bedeuten Anlageannahmen?"
  ],
  "ETF és osztalék. A költség, adó, deviza, hozam és időtáv külön-külön is módosíthatja az eredményt.": [
    "ETFs and dividends: costs, taxes, currencies, returns and time horizons can each affect results.",
    "ETFs und Dividenden: Kosten, Steuern, Währungen, Renditen und Zeithorizont können das Ergebnis jeweils verändern."
  ],
  "Befektetést modellezek →": [
    "Model investments →",
    "Anlagen modellieren →"
  ],
  "Melyik dátum mit jelent?": [
    "What does each date mean?",
    "Was bedeutet welches Datum?"
  ],
  "Fizetési határidő és teljesítési dátum. A kiállítás, teljesítés és esedékesség nem felcserélhető fogalmak.": [
    "Payment deadlines and supply dates: issue, supply and due dates are not interchangeable.",
    "Zahlungsfristen und Leistungsdaten: Ausstellung, Leistung und Fälligkeit sind nicht austauschbar."
  ],
  "Számlázást ellenőrzök →": [
    "Check invoicing →",
    "Rechnungsstellung prüfen →"
  ],
  "minden kalkulátor saját módszertani, értelmezési és korlátblokkot kap. Nem ugyanazt a SEO-szöveget variáljuk.": [
    "each calculator has its own methodology, interpretation and limitations sections. We do not simply vary the same SEO text.",
    "Jeder Rechner hat eigene Abschnitte zu Methodik, Einordnung und Grenzen. Wir variieren nicht einfach denselben SEO-Text."
  ],
  "Pénzügyi kalkulátorok | Bér, hitel, megtakarítás és befektetés": [
    "Financial Calculators · Salary, Loans, Saving and Investment",
    "Finanzrechner · Gehalt, Kredit, Sparen und Anlagen"
  ],
  "Pénzügyi kalkulátorok nettó bérhez, költségvetéshez, hitelekhez, megtakarításhoz, ETF-hez, osztalékhoz és inflációhoz.": [
    "Financial calculators for net salary, budgets, loans, saving, ETFs, dividends and inflation.",
    "Finanzrechner für Nettogehalt, Budget, Kredite, Sparen, ETFs, Dividenden und Inflation."
  ],
  "Válassz kategóriát, vagy keress rá közvetlenül a szükséges kalkulátorra.": [
    "Choose a category or search directly for the calculator you need.",
    "Wähle eine Kategorie oder suche direkt nach dem benötigten Rechner."
  ],
  "Kalkulátorválasztó": [
    "Calculator selector",
    "Rechnerauswahl"
  ],
  "Ugyanaz a téma több külön kérdést is jelenthet": [
    "One topic can involve several different questions",
    "Ein Thema kann mehrere unterschiedliche Fragen umfassen"
  ],
  "A teljes listában nem csak kulcsszó alapján érdemes választani. Előbb döntsd el, hogy mennyiséget, költséget, időt, arányt, jövőbeli forgatókönyvet vagy egy meglévő érték ellenőrzését keresed.": [
    "Do not choose from the full list by keyword alone. First decide whether you need a quantity, cost, time, ratio, future scenario or a check of an existing value.",
    "Wähle aus der Gesamtliste nicht nur nach Stichwort. Kläre zuerst, ob du eine Menge, Kosten, Zeit, ein Verhältnis, ein Zukunftsszenario oder die Prüfung eines vorhandenen Werts suchst."
  ],
  "Építőanyag, folyadék, energia, terület vagy térfogat esetén a mértékegység és a ráhagyás a kritikus pont.": [
    "For construction materials, fluids, energy, area or volume, units and allowances are critical.",
    "Bei Baustoffen, Flüssigkeiten, Energie, Fläche oder Volumen sind Einheit und Zuschlag entscheidend."
  ],
  "Költség": [
    "Cost",
    "Kosten"
  ],
  "Autó, hitel, költségvetés vagy vásárlás esetén válaszd szét az egyszeri, rendszeres és rejtett költségeket.": [
    "For cars, loans, budgets or purchases, distinguish one-off, recurring and hidden costs.",
    "Trenne bei Autos, Krediten, Budget oder Einkäufen einmalige, regelmäßige und versteckte Kosten."
  ],
  "Határidőnél, életkornál vagy menetidőnél tisztázd, naptári vagy időtartam-logikáról van-e szó.": [
    "For deadlines, age and journey duration, clarify whether calendar dates or elapsed time are involved.",
    "Kläre bei Fristen, Alter oder Fahrzeit, ob Kalendertage oder Zeitdauern gemeint sind."
  ],
  "Befektetésnél, hitelnél és inflációnál egyetlen feltételezés helyett több lehetséges kimenetet hasonlíts össze.": [
    "For investments, loans and inflation, compare several outcomes rather than one assumption.",
    "Vergleiche bei Anlagen, Krediten und Inflation mehrere Ergebnisse statt nur einer Annahme."
  ],
  "Ha több kalkulátor együtt ad értelmes képet, indulj az": [
    "If several calculators work better together, start from the",
    "Wenn mehrere Rechner gemeinsam ein sinnvolles Bild geben, beginne auf der Seite"
  ],
  "oldalról.": [
    "page.",
    "."
  ],
  "Összes kalkulátor | Kalkulátor Bázis": [
    "All Calculators · Kalkulátor Bázis",
    "Alle Rechner · Kalkulátor Bázis"
  ],
  "Az összes Kalkulátor Bázis kalkulátor egy helyen, kategóriák szerint rendezve.": [
    "All Kalkulátor Bázis calculators in one place, organised by category.",
    "Alle Rechner von Kalkulátor Bázis an einem Ort, nach Kategorien geordnet."
  ],
  "hu-HU": [
    "en-GB",
    "de-DE"
  ]
}
  };
});

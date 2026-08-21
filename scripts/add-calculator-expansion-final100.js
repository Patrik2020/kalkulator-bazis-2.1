const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
};

const calculators = [
  {
    slug: "munkanap-kalkulator",
    title: "Munkanap kalkulátor",
    shortTitle: "Munkanap",
    category: "mindennapi",
    group: "ido-datum",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Számold ki két dátum között a hétfőtől péntekig eső napokat, és adj meg külön kihagyandó dátumokat is.",
    keywords: "munkanap kalkulátor hétköznap napok dátum hétvége határidő",
    related: ["datum-kulonbseg-kalkulator.html", "datum-hozzaadas-kivonas-kalkulator.html", "fizetesi-hatarido-kalkulator.html"],
    defaultResult: [["Naptári napok", "5"], ["Hétköznapok", "5"], ["Kihagyott hétköznapok", "0"], ["Számított munkanapok", "5"]],
    form: `<div class="calc-grid"><div><label for="workStart">Kezdő dátum</label><input id="workStart" type="date" value="2026-08-24"></div><div><label for="workEnd">Záró dátum</label><input id="workEnd" type="date" value="2026-08-28"></div><div class="calc-grid-full"><label for="workExcluded">Kihagyandó dátumok (opcionális)</label><textarea id="workExcluded" rows="3" placeholder="2026-08-20; 2026-10-23"></textarea><small>Pontosvesszővel, vesszővel vagy sortöréssel választhatod el. A kalkulátor nem tölt be automatikus ünnepnaplistát.</small></div></div>`,
    guide: `<h2>Mit számol a munkanap kalkulátor?</h2><p>A kalkulátor a kezdő és záró dátumot is beleszámítja, majd végiglépked az időszak naptári napjain. A szombatot és vasárnapot automatikusan hétvégének tekinti, a hétfőtől péntekig tartó napokat pedig hétköznapként számolja.</p><p>Ha van olyan hétköznap, amelyet nem szeretnél munkanapnak számítani, a kihagyandó dátumok mezőben külön megadhatod. Ez lehet például ünnepnap, céges szünnap vagy bármilyen saját kivétel.</p><div class="example-box"><h3>Példa</h3><p>2026. augusztus 24. és 28. között öt naptári nap van, és mind az öt hétfőtől péntekig esik. Külön kizárás nélkül ezért az eredmény 5 munkanap.</p></div><h2>Miért nincs automatikus magyar ünnepnaplista?</h2><p>Az ünnepnapok, áthelyezett munkanapok és egyedi munkarendek évről évre változhatnak. Az eszköz ezért tudatosan általános naptári számítást végez, és a speciális napokat rád bízza. Így régi vagy jövőbeli dátumtartományokra is használható anélkül, hogy elavult naptáradatokra támaszkodna.</p>`,
    faq: [["A kezdő és záró nap beleszámít?", "Igen. Ha hétköznapra esnek és nincsenek kizárva, mindkettőt beleszámítja."], ["Az ünnepnapokat ismeri?", "Nem automatikusan. Az ünnepnapokat vagy más szünnapokat a kihagyandó dátumok mezőben adhatod meg."], ["Mi történik, ha hétvégi dátumot adok meg kizárásként?", "Nem csökkenti kétszer az eredményt: a hétvége eleve nem számít hétköznapnak."]],
    reliability: "Általános naptári segédeszköz. Nem alkalmaz automatikusan magyar munkaszüneti napokat, áthelyezett munkanapokat vagy munkajogi szabályokat."
  },
  {
    slug: "tulora-kalkulator",
    title: "Túlóra díj kalkulátor",
    shortTitle: "Túlóra díj",
    category: "mindennapi",
    group: "munka-jovedelem",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Túlóra óradíj, teljes túlóradíj és a normál órabér feletti többlet kiszámítása saját szorzóval.",
    keywords: "túlóra díj órabér szorzó pótlék munka fizetés kalkulátor",
    related: ["oraber-kalkulator.html", "munkaido-kalkulator.html", "netto-brutto-kalkulator.html"],
    defaultResult: [["Túlóra óradíja", "4 500 Ft/óra"], ["Teljes túlóradíj", "36 000 Ft"], ["Normál órabér feletti rész", "12 000 Ft"]],
    form: `<div class="calc-grid"><div><label for="otRate">Alap órabér (Ft)</label><input id="otRate" type="number" value="3000" min="0" step="1"></div><div><label for="otHours">Túlóra (óra)</label><input id="otHours" type="number" value="8" min="0" step="0.25"></div><div><label for="otMultiplier">Elszámolási szorzó</label><input id="otMultiplier" type="number" value="1.5" min="0" step="0.05"><small>Például 1,5 = az alap órabér 150%-a.</small></div></div>`,
    guide: `<h2>Hogyan működik a túlóra díj kalkulátor?</h2><p>Az eszköz nem próbálja kitalálni, hogy egy adott munkaviszonyban milyen pótlék vagy elszámolási szabály jár. Ehelyett te adod meg az alap órabért, a túlórák számát és azt a szorzót, amellyel az órabért számolni szeretnéd.</p><p>A teljes túlóradíj képlete egyszerű: alap órabér × túlóra órák × szorzó. Külön megmutatjuk azt is, hogy ebből mennyi a normál órabérhez képest jelentkező többlet.</p><div class="example-box"><h3>Példa</h3><p>3 000 Ft-os órabér, 8 túlóra és 1,5-ös szorzó esetén a túlóra óradíja 4 500 Ft, a teljes összeg 36 000 Ft. A normál 24 000 Ft-os nyolcórás díjhoz képest a többlet 12 000 Ft.</p></div><h2>Miért kell saját szorzót megadni?</h2><p>A pótlékok és elszámolások függhetnek a munkaszerződéstől, kollektív szerződéstől, a munkarendtől, a túlóra időpontjától és az aktuális szabályoktól. A szabadon megadható szorzó ezért átláthatóbb, mint egy olyan automatikus jogi feltételezés, amely könnyen félrevezető lehet.</p>`,
    faq: [["Mit jelent az 1,5-ös szorzó?", "Azt, hogy az adott túlóra óradíját az alap órabér 150%-ával számolod."], ["Bruttó vagy nettó órabért adjak meg?", "Bármelyikkel számolhatsz, de az eredmény ugyanazon az alapon lesz. Bruttó bemenetből bruttó összeg, nettóból nettó összeg adódik."], ["Megmondja, milyen pótlék jár nekem?", "Nem. A kalkulátor a megadott szorzóval számol; a rád vonatkozó elszámolási szabályt külön kell ellenőrizned."]],
    reliability: "Általános bérszámítás saját szorzóval. Nem állapít meg munkajogi jogosultságot, pótlékot vagy kötelező elszámolási módot."
  },
  {
    slug: "recept-adag-kalkulator",
    title: "Recept adag átszámító kalkulátor",
    shortTitle: "Recept adag átszámító",
    category: "mindennapi",
    group: "vasarlas-haztartas",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Recept hozzávalóinak átszámítása más adagszámra, több hozzávaló egyszerre történő skálázásával.",
    keywords: "recept adag átszámítás hozzávaló mennyiség főzés sütés kalkulátor",
    related: ["egysegar-kalkulator.html", "terfogat-atvalto-kalkulator.html", "tomeg-atvalto-kalkulator.html"],
    defaultResult: [["Átszámítási szorzó", "1,5×"], ["Liszt", "750 g"], ["Tej", "450 ml"], ["Tojás", "3 db"]],
    form: `<div class="calc-grid"><div><label for="recipeOriginal">Eredeti adagszám</label><input id="recipeOriginal" type="number" value="4" min="0" step="1"></div><div><label for="recipeTarget">Kívánt adagszám</label><input id="recipeTarget" type="number" value="6" min="0" step="1"></div><div class="calc-grid-full"><label for="recipeIngredients">Hozzávalók</label><textarea id="recipeIngredients" rows="5">Liszt;500;g\nTej;300;ml\nTojás;2;db</textarea><small>Soronként: név; mennyiség; egység. Például: Liszt;500;g</small></div></div>`,
    guide: `<h2>Hogyan skálázza a receptet?</h2><p>A kalkulátor először kiszámítja a kívánt és az eredeti adagszám arányát. Ezzel a szorzóval módosítja minden megadott hozzávaló mennyiségét, ezért ugyanazt a receptet kisebb vagy nagyobb társaságra is gyorsan át lehet számítani.</p><p>A hozzávalókat külön sorokban add meg, három adattal: név, mennyiség és egység. Az egységet nem alakítja át, csak a számszerű mennyiséget skálázza.</p><div class="example-box"><h3>Példa</h3><p>Egy 4 adagos receptet 6 adagra növelve a szorzó 6/4 = 1,5. Így 500 g lisztből 750 g, 300 ml tejből 450 ml, 2 tojásból pedig matematikailag 3 darab lesz.</p></div><h2>Mikor kell kézzel korrigálni?</h2><p>A sütés-főzés nem mindig lineáris. Fűszereknél, sózásnál, sűrítőanyagoknál vagy tojásnál gyakran érdemes kerekíteni és kóstolással finomhangolni. A tepsi mérete, sütési idő és hőátadás sem feltétlenül skálázódik az adagszámmal.</p>`,
    faq: [["Tizedes mennyiséget is elfogad?", "Igen, ponttal vagy tizedesvesszővel is megadhatsz mennyiséget."], ["Átváltja a grammot dekagrammra?", "Nem. A megadott egységet változatlanul hagyja, csak a mennyiséget szorozza fel vagy le."], ["Mi történik a darabos hozzávalókkal?", "Matematikai eredményt kapsz, amelyet a gyakorlatban szükség esetén egész darabra kell kerekíteni."]],
    reliability: "Mennyiségi arányosítás. A recept technológiai tulajdonságai, sütési idő és ízesítés nem feltétlenül változik lineárisan az adagszámmal."
  },
  {
    slug: "vesztartalek-kalkulator",
    title: "Vésztartalék kalkulátor",
    shortTitle: "Vésztartalék",
    category: "penzugyi",
    group: "jovedelem-koltsegvetes",
    cardClass: "card-finance",
    categoryTitle: "Pénzügy",
    categoryUrl: "../penzugyi.html",
    description: "Vésztartalék célösszeg, jelenlegi fedezet, hiányzó összeg és megtakarítási idő becslése havi alapkiadásokból.",
    keywords: "vésztartalék pénzügyi tartalék havi kiadás megtakarítás biztonsági alap",
    related: ["havi-koltsegvetes-kalkulator.html", "megtakaritasi-cel-kalkulator.html", "kamatos-kamat-kalkulator.html"],
    defaultResult: [["Célösszeg", "2 100 000 Ft"], ["Jelenlegi fedezet", "1,43 hónap"], ["Hiányzó összeg", "1 600 000 Ft"], ["Becsült idő a célhoz", "16 hónap"]],
    form: `<div class="calc-grid"><div><label for="reserveMonthly">Szükséges havi alapkiadás (Ft)</label><input id="reserveMonthly" type="number" value="350000" min="0" step="1000"></div><div><label for="reserveMonths">Célzott tartalék (hónap)</label><input id="reserveMonths" type="number" value="6" min="0" step="0.5"></div><div><label for="reserveCurrent">Jelenlegi vésztartalék (Ft)</label><input id="reserveCurrent" type="number" value="500000" min="0" step="1000"></div><div><label for="reserveSaving">Havi félretehető összeg (Ft)</label><input id="reserveSaving" type="number" value="100000" min="0" step="1000"></div></div>`,
    guide: `<h2>Mit mutat a vésztartalék kalkulátor?</h2><p>A célösszeg a saját, szükséges havi alapkiadásod és az általad választott hónapszám szorzata. Az alapkiadásba jellemzően azokat a tételeket érdemes beleszámítani, amelyeket jövedelemkiesés esetén is fizetni kellene: lakhatás, élelmiszer, közlekedés, biztosítások és kötelező törlesztések.</p><p>A kalkulátor megmutatja, hogy a jelenlegi tartalék hány ilyen hónapot fedez, mennyi hiányzik a célhoz, és változatlan havi megtakarítással nagyjából hány hónap alatt érhető el.</p><div class="example-box"><h3>Példa</h3><p>350 000 Ft alapkiadás és 6 hónapos cél esetén 2,1 millió Ft a célösszeg. 500 000 Ft meglévő tartalék mellett 1,6 millió Ft hiányzik, amely havi 100 000 Ft félretétellel 16 hónap alatt gyűlhet össze.</p></div><h2>Mekkora tartalék az ideális?</h2><p>Nincs mindenki számára egyetlen helyes hónapszám. Stabil, több lábon álló háztartásnál és bizonytalanabb jövedelemnél eltérő biztonsági szint lehet indokolt. A kalkulátor ezért nem ír elő célt, hanem az általad választott hónapszámmal számol.</p>`,
    faq: [["A teljes havi költést írjam be?", "Elsősorban azokat a kiadásokat, amelyeket egy váratlan jövedelemkiesés idején is fenn kellene tartanod."], ["Számol hozammal?", "Nem. A vésztartalék célját egyszerű, hozam nélküli biztonsági keretként kezeli."], ["A havi megtakarítás nulla lehet?", "Igen. Ilyenkor a hiányzó összeget kiszámolja, de nem ad elérési hónapszámot, ha a cél még nincs meg."]],
    reliability: "Tervezési segédeszköz, nem személyre szabott pénzügyi tanács. A megfelelő tartalék mérete a háztartás kockázataitól és pénzügyi helyzetétől függ."
  },
  {
    slug: "fedezeti-pont-kalkulator",
    title: "Fedezeti pont kalkulátor",
    shortTitle: "Fedezeti pont",
    category: "mindennapi",
    group: "munka-jovedelem",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Fedezeti darabszám és árbevétel becslése fix költségből, egységárból és egységnyi változó költségből.",
    keywords: "fedezeti pont break even fix költség változó költség árbevétel vállalkozás",
    related: ["arres-kalkulator.html", "haszonkulcs-kalkulator.html", "afa-kalkulator.html"],
    defaultResult: [["Egységnyi fedezet", "4 000 Ft"], ["Fedezeti hányad", "40%"], ["Fedezeti mennyiség", "250 db"], ["Fedezeti árbevétel", "2 500 000 Ft"]],
    form: `<div class="calc-grid"><div><label for="beFixed">Fix költség (Ft)</label><input id="beFixed" type="number" value="1000000" min="0" step="1000"></div><div><label for="bePrice">Eladási ár / egység (Ft)</label><input id="bePrice" type="number" value="10000" min="0" step="1"></div><div><label for="beVariable">Változó költség / egység (Ft)</label><input id="beVariable" type="number" value="6000" min="0" step="1"></div></div>`,
    guide: `<h2>Mi a fedezeti pont?</h2><p>A fedezeti pont az a mennyiség, amelynél az értékesítésből származó fedezet éppen kitermeli a vizsgált fix költséget. A számítás alapja az egységnyi fedezet: eladási ár mínusz az adott egységhez közvetlenül kapcsolódó változó költség.</p><p>A szükséges darabszám a fix költség és az egységnyi fedezet hányadosa. Mivel a valóságban tört darabot sok terméknél nem lehet értékesíteni, a kalkulátor a szükséges mennyiséget felfelé kerekíti.</p><div class="example-box"><h3>Példa</h3><p>1 000 000 Ft fix költség, 10 000 Ft eladási ár és 6 000 Ft változó költség mellett 4 000 Ft az egységnyi fedezet. A fedezeti pont 250 darab, ami 2,5 millió Ft árbevételnek felel meg.</p></div><h2>Mit hagy ki az egyszerű modell?</h2><p>Több termék, eltérő árrés, készletveszteség, adók, kapacitáskorlátok, lépcsőzetesen változó fix költségek és szezonális hatások esetén összetettebb üzleti modellre lehet szükség. Ez az eszköz egy termékre vagy homogén egységre ad gyors becslést.</p>`,
    faq: [["Mi számít fix költségnek?", "Olyan vizsgált időszaki költség, amelyet a modellben nem kötünk közvetlenül minden egyes eladott egységhez."], ["Mi történik, ha a változó költség eléri az eladási árat?", "Nincs pozitív egységnyi fedezet, ezért ebből az egyszerű modellből nem adható értelmes fedezeti pont."], ["Az ÁFA benne van?", "Az inputokat egységes alapon add meg: nettó árat nettó költséggel vagy bruttót bruttóval hasonlíts össze."]],
    reliability: "Egyszerű egytermékes fedezeti modell. Nem helyettesít részletes költségszámítást, könyvelési vagy üzleti tervezési elemzést."
  },
  {
    slug: "zuzottko-kalkulator",
    title: "Zúzottkő kalkulátor",
    shortTitle: "Zúzottkő",
    category: "epitoipari",
    group: "szerkezet-szigeteles",
    cardClass: "card-building",
    categoryTitle: "Otthon & felújítás",
    categoryUrl: "../epitoipari.html",
    description: "Zúzottkő térfogat és tömeg becslése felület, rétegvastagság, anyagsűrűség és ráhagyás alapján.",
    keywords: "zúzottkő kavics murva köbméter tonna rétegvastagság anyagszükséglet",
    related: ["terkovezes-kalkulator.html", "beton-kalkulator.html", "terfogat-atvalto-kalkulator.html"],
    defaultResult: [["Alap térfogat", "3,2 m³"], ["Ráhagyással", "3,52 m³"], ["Becsült tömeg", "5,63 t"]],
    form: `<div class="calc-grid"><div><label for="stoneArea">Felület (m²)</label><input id="stoneArea" type="number" value="40" min="0" step="0.1"></div><div><label for="stoneDepth">Rétegvastagság (cm)</label><input id="stoneDepth" type="number" value="8" min="0" step="0.5"></div><div><label for="stoneDensity">Sűrűség (t/m³)</label><input id="stoneDensity" type="number" value="1.6" min="0" step="0.01"></div><div><label for="stoneWaste">Ráhagyás (%)</label><input id="stoneWaste" type="number" value="10" min="0" max="100" step="1"></div></div>`,
    guide: `<h2>Hogyan becsülhető a zúzottkő mennyisége?</h2><p>A felületet megszorozzuk a méterben kifejezett rétegvastagsággal, így megkapjuk a geometriai térfogatot köbméterben. Erre kerül a választott ráhagyás, majd a megadott tonna/köbméter sűrűséggel becsülhető a tömeg.</p><p>A sűrűség erősen függ az anyag szemcseméretétől, nedvességétől és tömörségétől. A példában szereplő 1,6 t/m³ csak kiinduló érték; rendelésnél a beszállító adatát érdemes használni.</p><div class="example-box"><h3>Példa</h3><p>40 m² felület és 8 cm rétegvastagság 3,2 m³ alap térfogatot ad. 10% ráhagyással 3,52 m³ szükséges, ami 1,6 t/m³ sűrűséggel körülbelül 5,63 tonna.</p></div><h2>Laza vagy tömörített réteggel számol?</h2><p>A geometriai méret jellemzően a kész rétegre vonatkozik, miközben a szállított laza anyag tömörítés után kisebb térfogatot foglalhat el. A ráhagyás segíthet, de komoly alaprétegnél a kívánt tömörséget és a beszállító váltószámait külön is figyelembe kell venni.</p>`,
    faq: [["Milyen sűrűséget használjak?", "A választott anyagra vonatkozó beszállítói vagy gyártói t/m³ adatot, lehetőleg a szállítási állapothoz igazítva."], ["A ráhagyás kötelező?", "Nem, de egyenetlen aljzat, tömörödés és kivitelezési veszteség miatt gyakran indokolt."], ["Kavicsra is használható?", "Igen, ha a megfelelő sűrűséget adod meg, de az anyagfajtának megfelelő kivitelezési szabályokat külön ellenőrizd."]],
    reliability: "Anyagszükséglet-becslés. A tényleges tömeg a szemcsemérettől, nedvességtől, laza/tömör állapottól és beszállítói adatoktól függ."
  },
  {
    slug: "szegolec-kalkulator",
    title: "Szegőléc kalkulátor",
    shortTitle: "Szegőléc",
    category: "epitoipari",
    group: "burkolas-feluletek",
    cardClass: "card-building",
    categoryTitle: "Otthon & felújítás",
    categoryUrl: "../epitoipari.html",
    description: "Szegőléc szükséges hosszának és darabszámának becslése kerületből, nyílásokból, szálhosszból és ráhagyásból.",
    keywords: "szegőléc kalkulátor méter darab szál padló burkolat kerület ráhagyás",
    related: ["padlo-burkolat-kalkulator.html", "csempe-kalkulator.html", "festek-kalkulator.html"],
    defaultResult: [["Nettó kerület", "19 m"], ["Ráhagyással szükséges", "20,9 m"], ["Szükséges szál", "9 db"], ["Megvásárolt hossz", "21,6 m"]],
    form: `<div class="calc-grid"><div><label for="skirtPerimeter">Burkolandó kerület (m)</label><input id="skirtPerimeter" type="number" value="20" min="0" step="0.1"></div><div><label for="skirtOpenings">Kihagyandó nyílások összesen (m)</label><input id="skirtOpenings" type="number" value="1" min="0" step="0.1"></div><div><label for="skirtPiece">Egy szál hossza (m)</label><input id="skirtPiece" type="number" value="2.4" min="0" step="0.01"></div><div><label for="skirtWaste">Ráhagyás (%)</label><input id="skirtWaste" type="number" value="10" min="0" max="100" step="1"></div></div>`,
    guide: `<h2>Hogyan számol a szegőléc kalkulátor?</h2><p>A kiindulás a helyiség vagy helyiségek burkolandó falkerülete. Ebből levonhatod azokat a nyílásokat, ahol biztosan nem kerül szegőléc, például egy ajtó szélességét. A maradó hosszra ráhagyást alkalmazunk, majd elosztjuk a megvásárolható szál hosszával.</p><p>A darabszámot mindig felfelé kerekítjük, mert tört szálat nem lehet megvásárolni. Emiatt a ténylegesen megvett hossz általában valamivel nagyobb lesz a számított szükségletnél.</p><div class="example-box"><h3>Példa</h3><p>20 m kerületből 1 m nyílást levonva 19 m nettó hossz marad. 10% ráhagyással 20,9 m szükséges. 2,4 m-es szálból 9 darab kell, ami összesen 21,6 m vásárolt hosszt jelent.</p></div><h2>Miért kell ráhagyás?</h2><p>A sarkok, gérvágások, hibás vágások, mintázat és a szálak optimális kiosztása miatt a tiszta geometriai hossz ritkán azonos a tényleges beszerzéssel. Bonyolult alaprajznál több tartalék indokolt lehet.</p>`,
    faq: [["Az ajtókat mindig le kell vonni?", "Csak ott vond le a nyílást, ahol valóban nem fut végig szegőléc vagy más lezáró elem."], ["Miért felfelé kerekít a darabszám?", "Mert a szálakat egész darabban kell megvenni."], ["Több helyiségre is jó?", "Igen. Add össze a burkolandó kerületeket és a levonandó nyílások hosszát, vagy számold a helyiségeket külön a pontosabb vágási tervhez."]],
    reliability: "Beszerzési becslés. A tényleges darabszámot a vágási kiosztás, sarokkialakítás, profil és helyszíni méretek módosíthatják."
  },
  {
    slug: "vizfogyasztas-koltseg-kalkulator",
    title: "Vízfogyasztás költség kalkulátor",
    shortTitle: "Vízfogyasztás költsége",
    category: "mindennapi",
    group: "vasarlas-haztartas",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Vízfogyasztás köbméterben és becsült költség számítása napi literből, időszakból és saját m³-árral.",
    keywords: "vízfogyasztás vízdíj költség liter köbméter rezsi kalkulátor",
    related: ["rezsi-megosztas-kalkulator.html", "villanyfogyasztas-koltseg-kalkulator.html", "terfogat-atvalto-kalkulator.html"],
    defaultResult: [["Teljes fogyasztás", "9 000 liter"], ["Fogyasztás", "9 m³"], ["Változó díj", "7 200 Ft"], ["Becsült összes költség", "7 200 Ft"]],
    form: `<div class="calc-grid"><div><label for="waterDaily">Napi fogyasztás (liter)</label><input id="waterDaily" type="number" value="300" min="0" step="1"></div><div><label for="waterDays">Időszak (nap)</label><input id="waterDays" type="number" value="30" min="0" step="1"></div><div><label for="waterPrice">Saját díj (Ft/m³)</label><input id="waterPrice" type="number" value="800" min="0" step="1"></div><div><label for="waterFixed">Fix díj az időszakra (Ft)</label><input id="waterFixed" type="number" value="0" min="0" step="1"></div></div>`,
    guide: `<h2>Hogyan számolható a vízfogyasztás költsége?</h2><p>A napi literfogyasztást megszorozzuk az időszak napjaival, majd ezerrel osztva köbméterre váltjuk. A változó költség a köbméter és az általad megadott Ft/m³ díj szorzata. Ha az adott számlázásban fix díj is van, azt külön mezőben hozzáadhatod.</p><p>Az egységár szándékosan kézzel megadható. A víz- és csatornadíj település, szolgáltató, felhasználási mód és díjstruktúra szerint eltérhet, ezért az aktuális számládról vagy szolgáltatói tájékoztatóból érdemes kiolvasni a saját összevont vagy releváns egységáradat.</p><div class="example-box"><h3>Példa</h3><p>Napi 300 liter 30 napon át 9 000 liter, azaz 9 m³. 800 Ft/m³ saját egységárral ez 7 200 Ft változó költséget jelent; fix díj nélkül az összes becslés is 7 200 Ft.</p></div><h2>Mire jó a napi literes megközelítés?</h2><p>Használható háztartási becslésre, egy készülék vagy tevékenység hatásának modellezésére, illetve spórolási forgatókönyvek összehasonlítására. Ha már ismered a mérőóra szerinti köbméterfogyasztást, abból közvetlenebb számítás készíthető.</p>`,
    faq: [["A csatornadíj benne van?", "Csak akkor, ha a saját Ft/m³ mezőben olyan összeget adsz meg, amely ezt is tartalmazza, vagy a fix díjjal kiegészíted a modellt."], ["Miért nincs beépített tarifa?", "A díjak szolgáltatónként és felhasználónként eltérhetnek és változhatnak, ezért az eszköz a saját aktuális egységároddal számol."], ["1000 liter tényleg 1 m³?", "Igen. Egy köbméter térfogat 1000 liternek felel meg."]],
    reliability: "Költségbecslés saját egységárral. Az aktuális szolgáltatói díjszabás, alapdíj, csatornadíj és egyéb tételek eltérhetnek a modellben megadottaktól."
  }
];

const resultIds = {
  "munkanap-kalkulator": "workResult",
  "tulora-kalkulator": "otResult",
  "recept-adag-kalkulator": "recipeResult",
  "vesztartalek-kalkulator": "reserveResult",
  "fedezeti-pont-kalkulator": "beResult",
  "zuzottko-kalkulator": "stoneResult",
  "szegolec-kalkulator": "skirtResult",
  "vizfogyasztas-koltseg-kalkulator": "waterResult",
};

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

function dataModule() {
  const data = calculators.map((c) => ({
    title: c.title,
    url: `kalkulatorok/${c.slug}.html`,
    category: c.category,
    group: c.group,
    description: c.description,
    keywords: c.keywords,
    related: c.related.map((url) => `kalkulatorok/${url}`),
  }));
  return `(function (root, factory) {\n  const calculators = factory();\n  if (typeof module !== "undefined" && module.exports) module.exports = calculators;\n  if (!root) return;\n  root.KB_EXPANSION_BATCH_05 = calculators;\n  let merged = false;\n  const mergeIntoSiteData = () => {\n    const data = root.KB_DATA;\n    if (!data || !Array.isArray(data.calculators)) return false;\n    const known = new Set(data.calculators.map((calculator) => calculator.url));\n    calculators.forEach((calculator) => { if (!known.has(calculator.url)) { data.calculators.push({ ...calculator }); known.add(calculator.url); } });\n    merged = true;\n    return true;\n  };\n  if (typeof document !== "undefined") {\n    document.addEventListener("kb:site-data-loaded", () => { mergeIntoSiteData(); });\n    if (mergeIntoSiteData()) queueMicrotask(() => document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "05" } })));\n    window.setTimeout(() => { if (!merged && mergeIntoSiteData()) document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "05" } })); }, 0);\n  }\n})(typeof window !== "undefined" ? window : null, function () { return ${JSON.stringify(data, null, 2)}; });\n`;
}

function calculatorModule() {
  return `(function (root, factory) {\n  const api = factory();\n  if (typeof module !== "undefined" && module.exports) module.exports = api;\n  if (!root || typeof document === "undefined") return;\n  root.KB_EXPANSION_BATCH_05_CALCULATORS = api;\n  const number = (id) => { const el = document.getElementById(id); return el ? Number.parseFloat(String(el.value).replace(/\\s/g, "").replace(",", ".")) : NaN; };\n  const hu = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value);\n  const money = (value) => hu(value, 0) + " Ft";\n  const render = (target, rows) => { target.innerHTML = rows.map(([label, value]) => '<p><strong>' + label + ':</strong> ' + value + '</p>').join(''); };\n  const bindings = {\n    "munkanap-kalkulator": { ids: ["workStart","workEnd","workExcluded"], result: "workResult", calculate() { const r = api.munkanapok(document.getElementById("workStart")?.value || "", document.getElementById("workEnd")?.value || "", api.parseDateList(document.getElementById("workExcluded")?.value || "")); return [["Naptári napok", String(r.calendarDays)], ["Hétköznapok", String(r.weekdays)], ["Kihagyott hétköznapok", String(r.excludedWeekdays)], ["Számított munkanapok", String(r.workdays)]]; } },\n    "tulora-kalkulator": { ids: ["otRate","otHours","otMultiplier"], result: "otResult", calculate() { const r = api.tulora(number("otRate"), number("otHours"), number("otMultiplier")); return [["Túlóra óradíja", money(r.overtimeHourly) + "/óra"], ["Teljes túlóradíj", money(r.totalPay)], ["Normál órabér feletti rész", money(r.premiumPart)]]; } },\n    "recept-adag-kalkulator": { ids: ["recipeOriginal","recipeTarget","recipeIngredients"], result: "recipeResult", calculate() { const r = api.recept(number("recipeOriginal"), number("recipeTarget"), document.getElementById("recipeIngredients")?.value || ""); return [["Átszámítási szorzó", hu(r.factor,3) + "×"], ...r.ingredients.map((item) => [item.name, hu(item.amount,3) + (item.unit ? " " + item.unit : "")])]; } },\n    "vesztartalek-kalkulator": { ids: ["reserveMonthly","reserveMonths","reserveCurrent","reserveSaving"], result: "reserveResult", calculate() { const r = api.vesztartalek(number("reserveMonthly"), number("reserveMonths"), number("reserveCurrent"), number("reserveSaving")); return [["Célösszeg", money(r.target)], ["Jelenlegi fedezet", hu(r.coverageMonths,2) + " hónap"], ["Hiányzó összeg", money(r.gap)], ["Becsült idő a célhoz", r.monthsNeeded === null ? "A megadott havi megtakarítással nem számolható" : r.monthsNeeded + " hónap"]]; } },\n    "fedezeti-pont-kalkulator": { ids: ["beFixed","bePrice","beVariable"], result: "beResult", calculate() { const r = api.fedezetiPont(number("beFixed"), number("bePrice"), number("beVariable")); return [["Egységnyi fedezet", money(r.contribution)], ["Fedezeti hányad", hu(r.contributionMarginPercent,2) + "%"], ["Fedezeti mennyiség", r.units + " db"], ["Fedezeti árbevétel", money(r.revenue)]]; } },\n    "zuzottko-kalkulator": { ids: ["stoneArea","stoneDepth","stoneDensity","stoneWaste"], result: "stoneResult", calculate() { const r = api.zuzottko(number("stoneArea"), number("stoneDepth"), number("stoneDensity"), number("stoneWaste")); return [["Alap térfogat", hu(r.baseM3,3) + " m³"], ["Ráhagyással", hu(r.totalM3,3) + " m³"], ["Becsült tömeg", hu(r.tons,3) + " t"]]; } },\n    "szegolec-kalkulator": { ids: ["skirtPerimeter","skirtOpenings","skirtPiece","skirtWaste"], result: "skirtResult", calculate() { const r = api.szegolec(number("skirtPerimeter"), number("skirtOpenings"), number("skirtPiece"), number("skirtWaste")); return [["Nettó kerület", hu(r.netLength,2) + " m"], ["Ráhagyással szükséges", hu(r.requiredLength,2) + " m"], ["Szükséges szál", r.pieces + " db"], ["Megvásárolt hossz", hu(r.purchasedLength,2) + " m"]]; } },\n    "vizfogyasztas-koltseg-kalkulator": { ids: ["waterDaily","waterDays","waterPrice","waterFixed"], result: "waterResult", calculate() { const r = api.vizKoltseg(number("waterDaily"), number("waterDays"), number("waterPrice"), number("waterFixed")); return [["Teljes fogyasztás", hu(r.liters,0) + " liter"], ["Fogyasztás", hu(r.m3,3) + " m³"], ["Változó díj", money(r.variableCost)], ["Becsült összes költség", money(r.totalCost)]]; } }\n  };\n  const init = () => { const page = document.querySelector("[data-batch05-calc]"); if (!page) return; const binding = bindings[page.dataset.batch05Calc]; if (!binding) return; const target = document.getElementById(binding.result); if (!target) return; let tracked = false; const run = () => { try { render(target, binding.calculate()); } catch (error) { target.textContent = error instanceof Error ? error.message : "Adj meg érvényes adatokat."; } }; binding.ids.forEach((id) => { const input = document.getElementById(id); if (!input) return; const changed = () => { if (!tracked && typeof root.KB_TRACK_EVENT === "function") { tracked = true; root.KB_TRACK_EVENT("calculator_start", { calculator: page.dataset.batch05Calc }); } run(); }; input.addEventListener("input", changed); input.addEventListener("change", changed); }); run(); };\n  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();\n})(typeof window !== "undefined" ? window : null, function () {\n  const finite = (v,l) => { if (!Number.isFinite(v)) throw new Error(l + ": adj meg érvényes számot."); return v; };\n  const positive = (v,l) => { finite(v,l); if (v <= 0) throw new Error(l + ": az érték legyen nagyobb nullánál."); return v; };\n  const nonNegative = (v,l) => { finite(v,l); if (v < 0) throw new Error(l + ": az érték nem lehet negatív."); return v; };\n  const parseIsoDate = (iso) => { if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(iso)) throw new Error("Adj meg érvényes dátumot."); const [y,m,d] = iso.split("-").map(Number); const date = new Date(Date.UTC(y,m-1,d)); if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m-1 || date.getUTCDate() !== d) throw new Error("Adj meg érvényes dátumot."); return date; };\n  const parseDateList = (raw) => { const values = String(raw || "").split(/[;,\\s]+/).map((v) => v.trim()).filter(Boolean); return [...new Set(values.map((iso) => { parseIsoDate(iso); return iso; }))]; };\n  const munkanapok = (startIso,endIso,excluded=[]) => { const start = parseIsoDate(startIso); const end = parseIsoDate(endIso); if (end < start) throw new Error("A záró dátum nem lehet korábbi a kezdő dátumnál."); const excludedSet = new Set(excluded); let calendarDays=0, weekdays=0, excludedWeekdays=0; for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate()+1)) { calendarDays += 1; const day=d.getUTCDay(); if (day !== 0 && day !== 6) { weekdays += 1; const iso=d.toISOString().slice(0,10); if (excludedSet.has(iso)) excludedWeekdays += 1; } } return { calendarDays, weekdays, excludedWeekdays, workdays: weekdays - excludedWeekdays }; };\n  const tulora = (hourlyRate,hours,multiplier) => { positive(hourlyRate,"Alap órabér"); nonNegative(hours,"Túlóra"); positive(multiplier,"Elszámolási szorzó"); const overtimeHourly=hourlyRate*multiplier; const totalPay=overtimeHourly*hours; const normalPart=hourlyRate*hours; return { overtimeHourly,totalPay,premiumPart:totalPay-normalPart }; };\n  const recept = (originalServings,targetServings,raw) => { positive(originalServings,"Eredeti adagszám"); positive(targetServings,"Kívánt adagszám"); const factor=targetServings/originalServings; const lines=String(raw||"").split(/\\r?\\n/).map((line)=>line.trim()).filter(Boolean); if (!lines.length) throw new Error("Adj meg legalább egy hozzávalót."); const ingredients=lines.map((line,index)=>{ const parts=line.split(";").map((p)=>p.trim()); if (parts.length < 2 || !parts[0]) throw new Error("A(z) " + (index + 1) + ". sor formátuma hibás."); const amount=Number.parseFloat(parts[1].replace(",",".")); positive(amount, parts[0] + " mennyisége"); return { name:parts[0], amount:amount*factor, unit:parts.slice(2).join(";").trim() }; }); return { factor,ingredients }; };\n  const vesztartalek = (monthly,months,current,saving) => { positive(monthly,"Havi alapkiadás"); positive(months,"Célzott hónapok"); nonNegative(current,"Jelenlegi tartalék"); nonNegative(saving,"Havi megtakarítás"); const target=monthly*months; const gap=Math.max(0,target-current); const coverageMonths=current/monthly; const monthsNeeded=gap===0 ? 0 : saving>0 ? Math.ceil(gap/saving) : null; return { target,gap,coverageMonths,monthsNeeded }; };\n  const fedezetiPont = (fixed,price,variable) => { nonNegative(fixed,"Fix költség"); positive(price,"Eladási ár"); nonNegative(variable,"Változó költség"); const contribution=price-variable; if (contribution <= 0) throw new Error("Az eladási ár legyen nagyobb a változó költségnél."); const units=fixed===0 ? 0 : Math.ceil((fixed-1e-9)/contribution); return { contribution, contributionMarginPercent:contribution/price*100, units, revenue:units*price }; };\n  const zuzottko = (area,depthCm,density,waste) => { positive(area,"Felület"); positive(depthCm,"Rétegvastagság"); positive(density,"Sűrűség"); nonNegative(waste,"Ráhagyás"); if (waste>100) throw new Error("A ráhagyás legfeljebb 100% legyen."); const baseM3=area*depthCm/100; const totalM3=baseM3*(1+waste/100); return { baseM3,totalM3,tons:totalM3*density }; };\n  const szegolec = (perimeter,openings,pieceLength,waste) => { positive(perimeter,"Kerület"); nonNegative(openings,"Nyílások"); if (openings>perimeter) throw new Error("A nyílások hossza nem lehet nagyobb a kerületnél."); positive(pieceLength,"Szálhossz"); nonNegative(waste,"Ráhagyás"); if (waste>100) throw new Error("A ráhagyás legfeljebb 100% legyen."); const netLength=perimeter-openings; const requiredLength=netLength*(1+waste/100); const pieces=requiredLength===0 ? 0 : Math.ceil((requiredLength-1e-9)/pieceLength); return { netLength,requiredLength,pieces,purchasedLength:pieces*pieceLength }; };\n  const vizKoltseg = (dailyLiters,days,pricePerM3,fixedFee) => { nonNegative(dailyLiters,"Napi fogyasztás"); positive(days,"Időszak"); if (!Number.isInteger(days)) throw new Error("Az időszak egész nap legyen."); nonNegative(pricePerM3,"Egységár"); nonNegative(fixedFee,"Fix díj"); const liters=dailyLiters*days; const m3=liters/1000; const variableCost=m3*pricePerM3; return { liters,m3,variableCost,totalCost:variableCost+fixedFee }; };\n  return { parseDateList,munkanapok,tulora,recept,vesztartalek,fedezetiPont,zuzottko,szegolec,vizKoltseg };\n});\n`;
}

function jsonLd(c) {
  const url = `https://kalkulatorbazis.hu/kalkulatorok/${c.slug}.html`;
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: c.title, description: c.description, inLanguage: "hu-HU", isPartOf: { "@id": "https://kalkulatorbazis.hu/#website" } },
    { "@type": "SoftwareApplication", "@id": `${url}#calculator`, name: c.title, applicationCategory: "CalculatorApplication", operatingSystem: "Web", url, description: c.description, offers: { "@type": "Offer", price: "0", priceCurrency: "HUF" } },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [ { "@type": "ListItem", position: 1, name: "Főoldal", item: "https://kalkulatorbazis.hu/" }, { "@type": "ListItem", position: 2, name: c.categoryTitle, item: `https://kalkulatorbazis.hu/${c.categoryUrl.replace("../", "")}` }, { "@type": "ListItem", position: 3, name: c.title, item: url } ] },
    { "@type": "FAQPage", "@id": `${url}#gyik`, mainEntity: c.faq.map(([q,a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ]});
}

function resultHtml(rows, id) {
  return `<div class="result-box" role="status" aria-live="polite" aria-atomic="true"><p>Eredmény:</p><div id="${id}">${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("")}</div></div>`;
}

function page(c) {
  const faq = c.faq.map(([q,a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join("");
  const related = c.related.map((url) => `<a href="${escapeHtml(url)}">${escapeHtml(url.replace(/-kalkulator\.html$/, "").replace(/-/g, " "))}</a>`).join("");
  return `<!doctype html>\n<html lang="hu">\n<head>\n<meta name="google-adsense-account" content="ca-pub-2639795157074812">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="${escapeHtml(c.description)}">\n<link rel="canonical" href="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}.html">\n<title>${escapeHtml(c.title)} | Kalkulátor Bázis</title>\n<link rel="stylesheet" href="../css/style.css">\n<link rel="stylesheet" href="../css/pages/simple-calculator.css">\n<script src="../js/static-first-fallbacks.js"></script>\n<script src="../js/global-head.js"></script>\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Kalkulátor Bázis">\n<meta property="og:title" content="${escapeHtml(c.title)} | Kalkulátor Bázis">\n<meta property="og:description" content="${escapeHtml(c.description)}">\n<meta property="og:url" content="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}.html">\n<meta property="og:image" content="https://kalkulatorbazis.hu/images/kalkulator-bazis-og.jpg">\n<meta name="twitter:card" content="summary_large_image">\n<script id="kb-structured-data" type="application/ld+json">${jsonLd(c)}</script>\n</head>\n<body>\n<a class="kb-skip-link" href="#main-content">Ugrás a tartalomhoz</a>\n<div id="header"></div>\n<main id="main-content" class="container page-simple-calculator" data-batch05-calc="${c.slug}">\n<nav class="breadcrumb" aria-label="Morzsamenü"><ol><li><a href="../index.html">Főoldal</a></li><li><a href="${c.categoryUrl}">${escapeHtml(c.categoryTitle)}</a></li><li><span aria-current="page">${escapeHtml(c.shortTitle)}</span></li></ol></nav>\n<section class="hero"><h1>${escapeHtml(c.title)}</h1><p>${escapeHtml(c.description)}</p></section>\n<section class="card card-calculator kb-calculator-shell" id="kalkulator">${c.form}${resultHtml(c.defaultResult, resultIds[c.slug])}</section>\n<section class="adsense-content calculator-guide" data-quality-upgrade="2026-08-21">${c.guide}<h2>Gyakori kérdések</h2><div class="faq-list" data-accordion="single">${faq}</div><h3>Kapcsolódó kalkulátorok</h3><div class="related-links">${related}</div><p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-21">2026. augusztus 21.</time></p></section>\n<section class="reliability-note"><div><h2>Hitelesség és számítási korlátok</h2><p>${escapeHtml(c.reliability)}</p></div><div class="reliability-actions"><a href="../szamitasi-modszertan.html">Számítási módszertan</a><a href="mailto:kalkulatorbazis@gmail.com?subject=Hibabejelentés%20–%20${encodeURIComponent(c.title)}">Hibát találtál? Jelezd.</a></div></section>\n</main>\n<div id="footer"></div>\n<script defer src="../js/expansion-batch-05-calculators.js"></script>\n<script src="../js/utils.js"></script>\n<script defer src="../js/help-widget.js"></script>\n</body>\n</html>\n`;
}

function auditScript() {
  const expected = calculators.map((c) => `kalkulatorok/${c.slug}.html`);
  return `const fs = require("fs");\nconst path = require("path");\nconst assert = require("assert");\nconst metadata = require("../js/expansion-batch-05-data.js");\nconst calculators = require("../js/expansion-batch-05-calculators.js");\nconst root = path.resolve(__dirname, "..");\nconst expected = ${JSON.stringify(expected, null, 2)};\nassert.strictEqual(metadata.length, 8);\nassert.deepStrictEqual(metadata.map((item) => item.url), expected);\nfor (const item of metadata) { const file = path.join(root, item.url); assert.ok(fs.existsSync(file), "Hiányzó kalkulátoroldal: " + item.url); const html = fs.readFileSync(file, "utf8"); assert.ok(html.includes("class=\\"card card-calculator"), item.url + ": hiányzó statikus kalkulátorkártya"); assert.ok(html.includes("data-quality-upgrade=\\"2026-08-21\\""), item.url + ": hiányzó minőségi tartalomjelölő"); assert.ok(html.includes("expansion-batch-05-calculators.js"), item.url + ": hiányzó számítási modul"); }\nconst work=calculators.munkanapok("2026-08-24","2026-08-28",[]); assert.deepStrictEqual(work,{calendarDays:5,weekdays:5,excludedWeekdays:0,workdays:5}); assert.strictEqual(calculators.munkanapok("2026-08-24","2026-08-28",["2026-08-26"]).workdays,4);\nconst ot=calculators.tulora(3000,8,1.5); assert.strictEqual(ot.overtimeHourly,4500); assert.strictEqual(ot.totalPay,36000); assert.strictEqual(ot.premiumPart,12000);\nconst recipe=calculators.recept(4,6,"Liszt;500;g\\nTej;300;ml\\nTojás;2;db"); assert.strictEqual(recipe.factor,1.5); assert.strictEqual(recipe.ingredients[0].amount,750); assert.strictEqual(recipe.ingredients[2].amount,3);\nconst reserve=calculators.vesztartalek(350000,6,500000,100000); assert.strictEqual(reserve.target,2100000); assert.strictEqual(reserve.gap,1600000); assert.strictEqual(reserve.monthsNeeded,16);\nconst be=calculators.fedezetiPont(1000000,10000,6000); assert.strictEqual(be.contribution,4000); assert.strictEqual(be.units,250); assert.strictEqual(be.revenue,2500000); assert.throws(()=>calculators.fedezetiPont(1000,100,100),/nagyobb/);\nconst stone=calculators.zuzottko(40,8,1.6,10); assert.ok(Math.abs(stone.baseM3-3.2)<1e-12); assert.ok(Math.abs(stone.totalM3-3.52)<1e-12); assert.ok(Math.abs(stone.tons-5.632)<1e-12);\nconst skirt=calculators.szegolec(20,1,2.4,10); assert.ok(Math.abs(skirt.requiredLength-20.9)<1e-12); assert.strictEqual(skirt.pieces,9); assert.ok(Math.abs(skirt.purchasedLength-21.6)<1e-12);\nconst water=calculators.vizKoltseg(300,30,800,0); assert.strictEqual(water.liters,9000); assert.strictEqual(water.m3,9); assert.strictEqual(water.totalCost,7200);\nconsole.log("Expansion batch 05 audit OK: 8 új kalkulátor, fájlok és referencia-számítások ellenőrizve. A katalogizált készlet eléri a 100-at.");\n`;
}

function replaceOnce(file, needle, replacement) {
  let source = read(file);
  if (source.includes(replacement)) return;
  if (!source.includes(needle)) throw new Error(`${file}: nem található a módosítandó rész.`);
  source = source.replace(needle, replacement);
  write(file, source);
}

function patchShared() {
  const oldCombo = `const expansionCalculators = [\n  ...require("../js/expansion-batch-01-data.js"),\n  ...require("../js/expansion-batch-02-data.js"),\n  ...require("../js/expansion-batch-03-data.js"),\n  ...require("../js/expansion-batch-04-data.js"),\n];`;
  const newCombo = `const expansionCalculators = [\n  ...require("../js/expansion-batch-01-data.js"),\n  ...require("../js/expansion-batch-02-data.js"),\n  ...require("../js/expansion-batch-03-data.js"),\n  ...require("../js/expansion-batch-04-data.js"),\n  ...require("../js/expansion-batch-05-data.js"),\n];`;
  for (const file of ["scripts/apply-category-taxonomy.js", "scripts/category-taxonomy-audit.js", "scripts/generate-sitemap.js"]) replaceOnce(file, oldCombo, newCombo);

  replaceOnce("scripts/quality-3-audit.js", `  "js/expansion-batch-04-calculators.js",\n].map`, `  "js/expansion-batch-04-calculators.js",\n  "js/expansion-batch-05-calculators.js",\n].map`);

  let utils = read("js/utils.js");
  const oldUtils = `        loadScriptOnce(base + "js/expansion-batch-03-data.js", () => {\n          loadScriptOnce(base + "js/expansion-batch-04-data.js", loadUi);\n        });`;
  const newUtils = `        loadScriptOnce(base + "js/expansion-batch-03-data.js", () => {\n          loadScriptOnce(base + "js/expansion-batch-04-data.js", () => {\n            loadScriptOnce(base + "js/expansion-batch-05-data.js", loadUi);\n          });\n        });`;
  if (!utils.includes("expansion-batch-05-data.js")) {
    if (!utils.includes(oldUtils)) throw new Error("js/utils.js: expansion loader blokk nem található.");
    utils = utils.replace(oldUtils, newUtils);
    write("js/utils.js", utils);
  }

  const pkg = JSON.parse(read("package.json"));
  pkg.scripts["test:expansion:05"] = "node scripts/expansion-batch-05-audit.js";
  if (!pkg.scripts.quality.includes("test:expansion:05")) pkg.scripts.quality = pkg.scripts.quality.replace("npm run test:expansion:04", "npm run test:expansion:04 && npm run test:expansion:05");
  write("package.json", JSON.stringify(pkg, null, 2) + "\n");

  let index = read("index.html");
  index = index.replace(/Több mint 90 magyar nyelvű kalkulátor/g, "100+ magyar nyelvű kalkulátor");
  write("index.html", index);
}

function patchAllCalculatorsPage() {
  const headings = { mindennapi: "Mindennapi kalkulátorok", penzugyi: "Pénzügyi kalkulátorok", epitoipari: "Építőipari kalkulátorok" };
  let html = read("kalkulatorok.html");
  for (const c of calculators) {
    const url = `kalkulatorok/${c.slug}.html`;
    if (html.includes(`href="${url}"`)) continue;
    const heading = `<h2 class="section-heading">${headings[c.category]}</h2>`;
    const at = html.indexOf(heading);
    if (at === -1) throw new Error(`kalkulatorok.html: hiányzó kategóriafejléc: ${headings[c.category]}`);
    const grid = html.indexOf('<div class="category-grid">', at);
    const end = html.indexOf("</div>", grid);
    if (grid === -1 || end === -1) throw new Error(`kalkulatorok.html: hiányzó kategóriarács: ${c.category}`);
    const card = `\n      <a class="card card-link calculator-card ${c.cardClass}" href="${url}">\n        <h3>${c.title}</h3>\n        <p>${c.description}</p>\n      </a>\n`;
    html = html.slice(0, end) + card + html.slice(end);
  }
  write("kalkulatorok.html", html);
}

write("js/expansion-batch-05-data.js", dataModule());
write("js/expansion-batch-05-calculators.js", calculatorModule());
write("scripts/expansion-batch-05-audit.js", auditScript());
for (const c of calculators) write(`kalkulatorok/${c.slug}.html`, page(c));
patchShared();
patchAllCalculatorsPage();
console.log(`Final 100 milestone batch prepared: ${calculators.length} calculators.`);

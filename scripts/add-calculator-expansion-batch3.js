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
    slug: "sulyozott-atlag-kalkulator",
    title: "Súlyozott átlag kalkulátor",
    shortTitle: "Súlyozott átlag",
    category: "mindennapi",
    group: "matematika",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Súlyozott átlag számítása értékekből és hozzájuk tartozó súlyokból, például jegyek, árak vagy mérési eredmények összesítéséhez.",
    keywords: "súlyozott átlag jegy átlag súly kredit pontszám matematika",
    related: ["atlag-kalkulator.html", "mertani-atlag-kalkulator.html", "szazalek-kalkulator.html"],
    defaultResult: [["Súlyozott átlag", "85,8333"], ["Súlyok összege", "6"], ["Elemszám", "3"]],
    form: `<div class="calc-grid"><div><label for="weightedValues">Értékek</label><textarea id="weightedValues" rows="4" autocomplete="off">80; 95; 70</textarea><small>Pontosvesszővel vagy új sorral válaszd el az értékeket.</small></div><div><label for="weightedWeights">Súlyok</label><textarea id="weightedWeights" rows="4" autocomplete="off">2; 3; 1</textarea><small>Ugyanannyi súlyt adj meg, mint értéket.</small></div></div>`,
    guide: `<h2>Mit jelent a súlyozott átlag?</h2><p>A súlyozott átlag akkor hasznos, amikor az egyes értékek nem azonos jelentőségűek. Minden értékhez tartozik egy súly, amely megmutatja, mekkora részt képvisel az összesítésben. Ilyen lehet például egy tantárgyi jegy eltérő kredittel, különböző mennyiségben vásárolt termék egységára vagy eltérő fontosságú mérési eredmény.</p><p>A képlet: <strong>Σ(érték × súly) / Σ(súly)</strong>. Emiatt a nagyobb súlyú érték erősebben húzza maga felé a végeredményt.</p><h2>Hogyan add meg az adatokat?</h2><p>Az értékeket és a súlyokat azonos sorrendben írd be, pontosvesszővel vagy új sorral elválasztva. A két listának ugyanannyi elemet kell tartalmaznia. A súly nem lehet negatív, és legalább egy súlynak pozitívnak kell lennie.</p><div class="example-box"><h3>Példa</h3><p>80, 95 és 70 értékhez rendre 2, 3 és 1 súly tartozik. A számláló 80×2 + 95×3 + 70×1 = 515, a súlyok összege 6, ezért a súlyozott átlag 515 / 6 ≈ 85,8333.</p></div><h2>Mikor használj más átlagot?</h2><p>Ha minden adat azonos jelentőségű, a hagyományos számtani átlag egyszerűbb. Egymásra épülő növekedési szorzóknál vagy hozamtényezőknél pedig a mértani átlag lehet megfelelőbb.</p>`,
    faq: [["Lehetnek tört súlyok?", "Igen. A súly lehet például 0,5 vagy 1,25 is, ha ez írja le jól a relatív fontosságot."], ["A súlyoknak 100%-ot kell kiadniuk?", "Nem. Bármilyen pozitív arány használható; a kalkulátor a súlyok összegével normalizál."], ["Mi történik nulla súlynál?", "Az adott érték nem befolyásolja az átlagot. Minden súly nem lehet nulla, mert akkor nincs értelmezhető súlyozott átlag."]],
    reliability: "A kalkulátor matematikai súlyozott átlagot számol. Az eredmény értelmezése attól függ, hogy a választott súlyok valóban megfelelően írják-e le az egyes adatok jelentőségét."
  },
  {
    slug: "megtakaritasi-cel-kalkulator",
    title: "Megtakarítási cél kalkulátor",
    shortTitle: "Megtakarítási cél",
    category: "penzugyi",
    group: "megtakaritas-befektetes",
    cardClass: "card-finance",
    categoryTitle: "Pénzügy",
    categoryUrl: "../penzugyi.html",
    description: "Becsüld meg, hány hónap alatt érhető el egy megtakarítási cél induló összeggel, havi befizetéssel és feltételezett éves hozammal.",
    keywords: "megtakarítás célösszeg havi befizetés hozam pénzügyi cél idő",
    related: ["kamatos-kamat-kalkulator.html", "milliomos-kalkulator.html", "havi-koltsegvetes-kalkulator.html"],
    defaultResult: [["Becsült idő", "15 hónap"], ["Becsült egyenleg", "2 074 986 Ft"], ["Saját befizetés", "2 000 000 Ft"], ["Becsült hozamrész", "74 986 Ft"]],
    form: `<div class="calc-grid"><div><label for="goalTarget">Célösszeg (Ft)</label><input id="goalTarget" type="number" value="2000000" min="0" step="10000"></div><div><label for="goalCurrent">Jelenlegi megtakarítás (Ft)</label><input id="goalCurrent" type="number" value="500000" min="0" step="10000"></div><div><label for="goalMonthly">Havi befizetés (Ft)</label><input id="goalMonthly" type="number" value="100000" min="0" step="1000"></div><div><label for="goalReturn">Feltételezett éves hozam (%)</label><input id="goalReturn" type="number" value="5" min="0" max="100" step="0.1"></div></div>`,
    guide: `<h2>Mire jó a megtakarítási cél kalkulátor?</h2><p>Az eszköz azt becsüli meg, hogy adott induló megtakarítás, rendszeres havi befizetés és feltételezett hozam mellett körülbelül mennyi idő szükséges egy célösszeg eléréséhez. Használható például vésztartalék, nagyobb vásárlás, önerő vagy hosszabb távú pénzügyi cél tervezéséhez.</p><p>A modell havi lépésekben számol. Az éves hozamból effektív havi hozamot képez, először jóváírja az adott havi hozamot, majd a hónap végén hozzáadja a havi befizetést. Ez egy egyszerűsített tervezési modell, nem befektetési előrejelzés.</p><h2>Miért csak becslés?</h2><p>A valós hozam nem egyenletes, a befizetések időzítése változhat, és a költségek, adók vagy infláció is módosíthatják a tényleges eredményt. A kalkulátor ezért a megadott állandó hozammal készít forgatókönyvet.</p><div class="example-box"><h3>Példa</h3><p>500 000 Ft induló összeggel, havi 100 000 Ft befizetéssel és 5%-os feltételezett éves hozammal a 2 000 000 Ft-os cél a modell szerint a 15. hónapban érhető el. A becsült egyenleg ekkor kb. 2,075 millió Ft.</p></div><h2>Hogyan használd tervezéshez?</h2><p>Érdemes több forgatókönyvet kipróbálni: 0%-os hozamot konzervatív alapként, majd mérsékeltebb és optimistább feltételezést. Így jobban látható, mennyit számít maga a rendszeres befizetés, és mennyit a feltételezett hozam.</p>`,
    faq: [["Garantált az elérési idő?", "Nem. A hozam és a befizetési fegyelem változhat, ezért az eredmény csak tervezési becslés."], ["Mi történik 0% hozamnál?", "A cél kizárólag a jelenlegi megtakarításból és a havi befizetésekből épül fel."], ["Az inflációt beleszámolja?", "Nem. A célösszeg nominális forintösszeg; reálértékhez külön inflációs számítást érdemes használni."]],
    reliability: "Egyszerűsített, állandó hozamú megtakarítási modell. Nem tartalmaz befektetési költséget, adót, inflációt vagy hozamingadozást, és nem minősül befektetési tanácsnak."
  },
  {
    slug: "kerites-oszlop-kalkulator",
    title: "Kerítés oszlop kalkulátor",
    shortTitle: "Kerítés oszlop",
    category: "epitoipari",
    group: "szerkezet-szigeteles",
    cardClass: "card-building",
    categoryTitle: "Otthon & felújítás",
    categoryUrl: "../epitoipari.html",
    description: "Becsüld meg egy egyenes, kapu nélküli kerítésszakaszhoz szükséges mezők és oszlopok számát a teljes hossz és a legnagyobb oszloptávolság alapján.",
    keywords: "kerítés oszlop távolság mező panel építés anyagszükséglet",
    related: ["beton-kalkulator.html", "tegla-kalkulator.html", "terkovezes-kalkulator.html"],
    defaultResult: [["Kerítésmezők száma", "8 db"], ["Oszlopok száma", "9 db"], ["Tényleges átlagos osztás", "2,5 m"]],
    form: `<div class="calc-grid"><div><label for="fenceLength">Egyenes kerítésszakasz hossza (m)</label><input id="fenceLength" type="number" value="20" min="0" step="0.1"></div><div><label for="fenceSpacing">Legnagyobb oszloptávolság (m)</label><input id="fenceSpacing" type="number" value="2.5" min="0" step="0.05"></div></div>`,
    guide: `<h2>Hogyan becsüli az oszlopok számát?</h2><p>A kalkulátor egyetlen egyenes, két végponttal rendelkező kerítésszakaszt feltételez. A teljes hosszt elosztja a megadott legnagyobb oszloptávolsággal, a szükséges mezők számát felfelé kerekíti, majd ehhez egy záró oszlopot ad. Így az elkészült átlagos osztás nem lesz nagyobb a megadott határnál.</p><p>Például 20 méteres szakasznál és legfeljebb 2,5 méteres osztásnál 8 mező és 9 oszlop szükséges, az átlagos oszloptávolság pontosan 2,5 méter.</p><h2>Mire nem alkalmas ez a gyors becslés?</h2><p>Sarkok, kapuk, különálló szakaszok, lejtős terep vagy eltérő mezőszélességek esetén további oszlopokra lehet szükség. A szerkezeti méretezést, az alapozást és az oszloptávolság megengedett maximumát a választott kerítésrendszer gyártói előírása és a helyi körülmények alapján kell meghatározni.</p><div class="example-box"><h3>Példa</h3><p>Ha 17 méter hosszú kerítést legfeljebb 2,5 méteres osztással építesz, 17 / 2,5 = 6,8, tehát 7 mező szükséges. Egy folyamatos egyenes szakaszon ehhez 8 oszlop tartozik, az átlagos osztás kb. 2,43 méter.</p></div><h2>Anyagtervezési tipp</h2><p>A darabszám után külön számold ki az oszlopok alapjához szükséges betont, valamint a választott panel, deszka vagy háló tényleges modulméreteit. A névleges és szerelési méret eltérhet.</p>`,
    faq: [["A kapuoszlopokat beleszámolja?", "Nem. A modell kapu nélküli, egyenes szakaszt feltételez. Kapunál a rendszer kialakításától függően külön oszlopok szükségesek."], ["Miért kerekít felfelé?", "Azért, hogy a tényleges átlagos oszloptávolság ne lépje túl a megadott maximumot."], ["Saroknál ugyanígy számolhatok?", "A külön irányba forduló szakaszokat célszerű külön-külön kiszámolni, majd a közös sarokoszlopot csak egyszer számolni."]],
    reliability: "Gyors darabszám-becslés egyenes, kapu nélküli kerítésszakaszra. A végleges kiosztást és szerkezeti méretezést a konkrét rendszer előírásaihoz kell igazítani."
  },
  {
    slug: "uzemanyagar-kulonbseg-kalkulator",
    title: "Üzemanyagár-különbség kalkulátor",
    shortTitle: "Üzemanyagár-különbség",
    category: "auto",
    group: "utazas-uzemanyag",
    cardClass: "card-auto",
    categoryTitle: "Autó & közlekedés",
    categoryUrl: "../auto.html",
    description: "Hasonlíts össze két üzemanyagárat ugyanarra az útra, és számold ki a teljes költségkülönbséget a távolság és fogyasztás alapján.",
    keywords: "üzemanyagár különbség benzin dízel költség út fogyasztás megtakarítás",
    related: ["uzemanyag-koltseg-kalkulator.html", "auto-fogyasztas-kalkulator.html", "tankolas-kalkulator.html"],
    defaultResult: [["Szükséges üzemanyag", "32,5 l"], ["Költség A árral", "19 500 Ft"], ["Költség B árral", "20 150 Ft"], ["Különbség", "650 Ft"]],
    form: `<div class="calc-grid"><div><label for="fuelDiffDistance">Távolság (km)</label><input id="fuelDiffDistance" type="number" value="500" min="0" step="1"></div><div><label for="fuelDiffConsumption">Átlagfogyasztás (l/100 km)</label><input id="fuelDiffConsumption" type="number" value="6.5" min="0" step="0.1"></div><div><label for="fuelDiffPriceA">Üzemanyagár A (Ft/l)</label><input id="fuelDiffPriceA" type="number" value="600" min="0" step="1"></div><div><label for="fuelDiffPriceB">Üzemanyagár B (Ft/l)</label><input id="fuelDiffPriceB" type="number" value="620" min="0" step="1"></div></div>`,
    guide: `<h2>Mire jó az üzemanyagár-különbség kalkulátor?</h2><p>Az eszköz megmutatja, hogy ugyanazon távolság és fogyasztás mellett mekkora forintkülönbséget okoz két eltérő literenkénti üzemanyagár. Így gyorsan eldönthető, hogy egy olcsóbb töltőállomás vagy egy másik útvonal árkülönbsége pénzben mennyit jelent.</p><p>Először kiszámolja a szükséges üzemanyag mennyiségét: <strong>távolság × fogyasztás / 100</strong>. Ezt megszorozza mindkét literárral, majd a két teljes költség abszolút különbségét is megadja.</p><h2>Miért lehet kisebb a különbség, mint gondolnád?</h2><p>A táblán látott literenkénti eltérés önmagában nem mondja meg az út teljes hatását. Például 20 Ft/l árkülönbség 32,5 liter felhasználásnál 650 Ft eltérést jelent. Ha az olcsóbb kút eléréséhez jelentős kitérőt kell tenni, annak külön üzemanyag- és időigénye lehet.</p><div class="example-box"><h3>Példa</h3><p>500 km, 6,5 l/100 km fogyasztás esetén 32,5 liter szükséges. 600 Ft/l árral ez 19 500 Ft, 620 Ft/l árral 20 150 Ft, vagyis a különbség 650 Ft.</p></div><h2>Mit nem vesz figyelembe?</h2><p>A számítás állandó átlagfogyasztást feltételez. A forgalom, sebesség, időjárás, terhelés és vezetési stílus miatt a valós fogyasztás eltérhet, ezért az eredmény tájékozódó becslés.</p>`,
    faq: [["Melyik ár az olcsóbb?", "A kalkulátor mindkét teljes költséget kiírja, így közvetlenül látható, melyik ár mellett alacsonyabb az út költsége."], ["A kitérő költségét számolja?", "Nem automatikusan. Ha az egyik kúthoz plusz kilométert kell menni, azt külön érdemes hozzáadni a távolsághoz."], ["Elektromos autónál használható?", "Nem. Ehhez a külön EV töltési költség kalkulátor való, amely kWh-alapú fogyasztással számol."]],
    reliability: "Állandó átlagfogyasztással készült összehasonlító becslés. A valós üzemanyagköltséget a tényleges fogyasztás és a megtett út határozza meg."
  },
  {
    slug: "villanyfogyasztas-koltseg-kalkulator",
    title: "Villanyfogyasztás költség kalkulátor",
    shortTitle: "Villanyfogyasztás költség",
    category: "mindennapi",
    group: "vasarlas-haztartas",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Becsüld meg egy elektromos készülék energiafogyasztását és költségét teljesítmény, napi használati idő, időszak és kWh-ár alapján.",
    keywords: "villanyfogyasztás áram költség watt kwh készülék rezsi energia",
    related: ["rezsi-megosztas-kalkulator.html", "teljesitmeny-atvalto-kalkulator.html", "energia-atvalto-kalkulator.html"],
    defaultResult: [["Napi fogyasztás", "3 kWh"], ["Időszak fogyasztása", "90 kWh"], ["Napi becsült költség", "210 Ft"], ["Időszak becsült költsége", "6 300 Ft"]],
    form: `<div class="calc-grid"><div><label for="electricPower">Készülék teljesítménye (W)</label><input id="electricPower" type="number" value="1500" min="0" step="1"></div><div><label for="electricHours">Használat naponta (óra)</label><input id="electricHours" type="number" value="2" min="0" max="24" step="0.1"></div><div><label for="electricDays">Időszak (nap)</label><input id="electricDays" type="number" value="30" min="1" max="3660" step="1"></div><div><label for="electricPrice">Villamosenergia ára (Ft/kWh)</label><input id="electricPrice" type="number" value="70" min="0" step="0.1"></div></div>`,
    guide: `<h2>Hogyan számolható egy készülék villanyköltsége?</h2><p>A névleges teljesítményt wattból kilowattra kell átváltani, majd meg kell szorozni a használati idővel. Egy 1500 W-os készülék 2 órás működés mellett elméletileg 1,5 kW × 2 h = 3 kWh energiát használ naponta. A költséghez ezt kell megszorozni a tényleges Ft/kWh árral.</p><p>A kalkulátor a napi fogyasztást, a teljes időszak fogyasztását, valamint a napi és összes becsült költséget is megmutatja.</p><h2>Névleges teljesítmény és valós fogyasztás</h2><p>Sok készülék nem folyamatosan működik a névleges teljesítményén. Termosztátos fűtőeszköz, hűtő, klíma vagy szabályozott motor esetén a tényleges átlagfogyasztás alacsonyabb vagy változó lehet. Pontosabb becsléshez konnektoros fogyasztásmérő vagy a készülék mért energiaadata használható.</p><div class="example-box"><h3>Példa</h3><p>1500 W teljesítmény, napi 2 óra használat és 30 nap esetén az elméleti fogyasztás 90 kWh. 70 Ft/kWh egységárral ez kb. 6300 Ft költséget jelent.</p></div><h2>Milyen árat adj meg?</h2><p>A számládon vagy szolgáltatói tájékoztatóban szereplő, a saját fogyasztásodra érvényes egységárat használd. A kalkulátor nem ismeri automatikusan a tarifádat, kedvezményes sávodat, rendszerhasználati díjaidat vagy egyéb számlatételeidet.</p>`,
    faq: [["A 1500 W azt jelenti, hogy mindig ennyit fogyaszt?", "Nem feltétlenül. Ez jellemzően névleges vagy maximális teljesítmény; szabályozott készülékek átlagos fogyasztása eltérhet."], ["A teljes villanyszámlát megkapom?", "Nem. Ez egy készülék energia-költség becslése, és nem tartalmaz minden fix vagy egyéb számlatételt."], ["Több készüléket hogyan számoljak?", "Számold ki őket külön, majd add össze az időszakra kapott kWh- és költségértékeket."]],
    reliability: "A számítás névleges teljesítményből és megadott használati időből készül. A tényleges fogyasztás szabályozott készülékeknél és valós használat mellett eltérhet."
  }
];

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
  return `(function (root, factory) {\n  const calculators = factory();\n  if (typeof module !== "undefined" && module.exports) module.exports = calculators;\n  if (!root) return;\n  root.KB_EXPANSION_BATCH_03 = calculators;\n  let merged = false;\n  const mergeIntoSiteData = () => {\n    const data = root.KB_DATA;\n    if (!data || !Array.isArray(data.calculators)) return false;\n    const known = new Set(data.calculators.map((calculator) => calculator.url));\n    calculators.forEach((calculator) => { if (!known.has(calculator.url)) { data.calculators.push({ ...calculator }); known.add(calculator.url); } });\n    merged = true;\n    return true;\n  };\n  if (typeof document !== "undefined") {\n    document.addEventListener("kb:site-data-loaded", () => { mergeIntoSiteData(); });\n    if (mergeIntoSiteData()) queueMicrotask(() => document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "03" } })));\n    window.setTimeout(() => { if (!merged && mergeIntoSiteData()) document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "03" } })); }, 0);\n  }\n})(typeof window !== "undefined" ? window : null, function () { return ${JSON.stringify(data, null, 2)}; });\n`;
}

function calculatorModule() {
  return `(function (root, factory) {\n  const api = factory();\n  if (typeof module !== "undefined" && module.exports) module.exports = api;\n  if (!root || typeof document === "undefined") return;\n  root.KB_EXPANSION_BATCH_03_CALCULATORS = api;\n  const num = (id) => { const el = document.getElementById(id); return el ? Number.parseFloat(String(el.value).replace(/\\s/g, "").replace(",", ".")) : NaN; };\n  const hu = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value);\n  const money = (value) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(value) + " Ft";\n  const render = (target, rows) => { target.innerHTML = rows.map(([label, value]) => '<p><strong>' + label + ':</strong> ' + value + '</p>').join(''); };\n  const bindings = {\n    "sulyozott-atlag-kalkulator": { ids: ["weightedValues", "weightedWeights"], result: "weightedResult", calculate() { const values = api.parseList(document.getElementById("weightedValues")?.value || ""); const weights = api.parseList(document.getElementById("weightedWeights")?.value || ""); const r = api.sulyozottAtlag(values, weights); return [["Súlyozott átlag", hu(r.mean, 6)], ["Súlyok összege", hu(r.weightSum, 6)], ["Elemszám", String(r.count)]]; } },\n    "megtakaritasi-cel-kalkulator": { ids: ["goalTarget", "goalCurrent", "goalMonthly", "goalReturn"], result: "goalResult", calculate() { const r = api.megtakaritasiCel(num("goalTarget"), num("goalCurrent"), num("goalMonthly"), num("goalReturn")); return [["Becsült idő", r.months + " hónap"], ["Becsült egyenleg", money(r.balance)], ["Saját befizetés", money(r.contributions)], ["Becsült hozamrész", money(r.growth)]]; } },\n    "kerites-oszlop-kalkulator": { ids: ["fenceLength", "fenceSpacing"], result: "fenceResult", calculate() { const r = api.keritesOszlop(num("fenceLength"), num("fenceSpacing")); return [["Kerítésmezők száma", r.bays + " db"], ["Oszlopok száma", r.posts + " db"], ["Tényleges átlagos osztás", hu(r.actualSpacing, 2) + " m"]]; } },\n    "uzemanyagar-kulonbseg-kalkulator": { ids: ["fuelDiffDistance", "fuelDiffConsumption", "fuelDiffPriceA", "fuelDiffPriceB"], result: "fuelDiffResult", calculate() { const r = api.uzemanyagarKulonbseg(num("fuelDiffDistance"), num("fuelDiffConsumption"), num("fuelDiffPriceA"), num("fuelDiffPriceB")); return [["Szükséges üzemanyag", hu(r.liters, 2) + " l"], ["Költség A árral", money(r.costA)], ["Költség B árral", money(r.costB)], ["Különbség", money(r.difference)]]; } },\n    "villanyfogyasztas-koltseg-kalkulator": { ids: ["electricPower", "electricHours", "electricDays", "electricPrice"], result: "electricResult", calculate() { const r = api.villanyKoltseg(num("electricPower"), num("electricHours"), num("electricDays"), num("electricPrice")); return [["Napi fogyasztás", hu(r.dailyKwh, 3) + " kWh"], ["Időszak fogyasztása", hu(r.totalKwh, 2) + " kWh"], ["Napi becsült költség", money(r.dailyCost)], ["Időszak becsült költsége", money(r.totalCost)]]; } }\n  };\n  const init = () => { const page = document.querySelector("[data-batch03-calc]"); if (!page) return; const binding = bindings[page.dataset.batch03Calc]; if (!binding) return; const target = document.getElementById(binding.result); if (!target) return; let tracked = false; const run = () => { try { render(target, binding.calculate()); } catch (error) { target.textContent = error instanceof Error ? error.message : "Adj meg érvényes adatokat."; } }; binding.ids.forEach((id) => { const input = document.getElementById(id); if (!input) return; const changed = () => { if (!tracked && typeof root.KB_TRACK_EVENT === "function") { tracked = true; root.KB_TRACK_EVENT("calculator_start", { calculator: page.dataset.batch03Calc }); } run(); }; input.addEventListener("input", changed); input.addEventListener("change", changed); }); run(); };\n  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();\n})(typeof window !== "undefined" ? window : null, function () {\n  const finite = (value, label) => { if (!Number.isFinite(value)) throw new Error(label + ": adj meg érvényes számot."); return value; };\n  const positive = (value, label) => { finite(value, label); if (value <= 0) throw new Error(label + ": az érték legyen nagyobb nullánál."); return value; };\n  const nonNegative = (value, label) => { finite(value, label); if (value < 0) throw new Error(label + ": az érték nem lehet negatív."); return value; };\n  const parseList = (raw) => { const normalized = String(raw || "").trim().replace(/(\\d),(\\d)/g, "$1.$2"); const values = normalized.split(/[;\\n]+/).map((v) => v.trim()).filter(Boolean).map(Number); if (!values.length || values.some((v) => !Number.isFinite(v))) throw new Error("Adj meg érvényes számlistát pontosvesszővel vagy új sorral elválasztva."); return values; };\n  const sulyozottAtlag = (values, weights) => { if (!Array.isArray(values) || !Array.isArray(weights) || values.length !== weights.length || !values.length) throw new Error("Az érték- és súlylista elemszáma legyen azonos."); values.forEach((v) => finite(v, "Érték")); weights.forEach((w) => nonNegative(w, "Súly")); const weightSum = weights.reduce((a,b) => a+b, 0); if (weightSum <= 0) throw new Error("Legalább egy súly legyen pozitív."); const mean = values.reduce((sum, value, i) => sum + value * weights[i], 0) / weightSum; return { mean, weightSum, count: values.length }; };\n  const megtakaritasiCel = (target, current, monthly, annualReturn) => { positive(target, "Célösszeg"); nonNegative(current, "Jelenlegi megtakarítás"); nonNegative(monthly, "Havi befizetés"); nonNegative(annualReturn, "Éves hozam"); if (annualReturn > 100) throw new Error("Az éves hozam legfeljebb 100% legyen a tervezési modellben."); if (current >= target) return { months: 0, balance: current, contributions: current, growth: 0 }; if (monthly === 0 && annualReturn === 0) throw new Error("A cél a megadott feltételekkel nem érhető el."); const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1; let balance = current; let months = 0; while (balance < target && months < 1200) { balance *= 1 + monthlyRate; balance += monthly; months += 1; } if (balance < target) throw new Error("A cél 100 éven belül sem érhető el a megadott feltételekkel."); const contributions = current + monthly * months; return { months, balance, contributions, growth: balance - contributions }; };\n  const keritesOszlop = (length, maxSpacing) => { positive(length, "Kerítéshossz"); positive(maxSpacing, "Oszloptávolság"); const bays = Math.ceil(length / maxSpacing); return { bays, posts: bays + 1, actualSpacing: length / bays }; };\n  const uzemanyagarKulonbseg = (distance, consumption, priceA, priceB) => { positive(distance, "Távolság"); positive(consumption, "Fogyasztás"); nonNegative(priceA, "Üzemanyagár A"); nonNegative(priceB, "Üzemanyagár B"); const liters = distance * consumption / 100; const costA = liters * priceA; const costB = liters * priceB; return { liters, costA, costB, difference: Math.abs(costA - costB) }; };\n  const villanyKoltseg = (powerW, hoursPerDay, days, pricePerKwh) => { nonNegative(powerW, "Teljesítmény"); nonNegative(hoursPerDay, "Napi használat"); positive(days, "Napok száma"); nonNegative(pricePerKwh, "Villamosenergia-ár"); if (hoursPerDay > 24) throw new Error("A napi használat legfeljebb 24 óra lehet."); if (!Number.isInteger(days)) throw new Error("A napok száma egész szám legyen."); const dailyKwh = powerW / 1000 * hoursPerDay; const totalKwh = dailyKwh * days; return { dailyKwh, totalKwh, dailyCost: dailyKwh * pricePerKwh, totalCost: totalKwh * pricePerKwh }; };\n  return { parseList, sulyozottAtlag, megtakaritasiCel, keritesOszlop, uzemanyagarKulonbseg, villanyKoltseg };\n});\n`;
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

const resultIds = {
  "sulyozott-atlag-kalkulator": "weightedResult",
  "megtakaritasi-cel-kalkulator": "goalResult",
  "kerites-oszlop-kalkulator": "fenceResult",
  "uzemanyagar-kulonbseg-kalkulator": "fuelDiffResult",
  "villanyfogyasztas-koltseg-kalkulator": "electricResult",
};

function page(c) {
  const faq = c.faq.map(([q,a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join("");
  const related = c.related.map((url) => `<a href="${escapeHtml(url)}">${escapeHtml(url.replace(/-kalkulator\.html$/, "").replace(/-/g, " "))}</a>`).join("");
  const result = c.defaultResult.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("");
  return `<!doctype html>\n<html lang="hu">\n<head>\n<meta name="google-adsense-account" content="ca-pub-2639795157074812">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="${escapeHtml(c.description)}">\n<link rel="canonical" href="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}.html">\n<title>${escapeHtml(c.title)} | Kalkulátor Bázis</title>\n<link rel="stylesheet" href="../css/style.css">\n<link rel="stylesheet" href="../css/pages/simple-calculator.css">\n<script src="../js/static-first-fallbacks.js"></script>\n<script src="../js/global-head.js"></script>\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Kalkulátor Bázis">\n<meta property="og:title" content="${escapeHtml(c.title)} | Kalkulátor Bázis">\n<meta property="og:description" content="${escapeHtml(c.description)}">\n<meta property="og:url" content="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}.html">\n<meta property="og:image" content="https://kalkulatorbazis.hu/images/kalkulator-bazis-og.jpg">\n<meta name="twitter:card" content="summary_large_image">\n<script id="kb-structured-data" type="application/ld+json">${jsonLd(c)}</script>\n</head>\n<body>\n<a class="kb-skip-link" href="#main-content">Ugrás a tartalomhoz</a>\n<div id="header"></div>\n<main id="main-content" class="container page-simple-calculator" data-batch03-calc="${c.slug}">\n<nav class="breadcrumb" aria-label="Morzsamenü"><ol><li><a href="../index.html">Főoldal</a></li><li><a href="${c.categoryUrl}">${escapeHtml(c.categoryTitle)}</a></li><li><span aria-current="page">${escapeHtml(c.shortTitle)}</span></li></ol></nav>\n<section class="hero"><h1>${escapeHtml(c.title)}</h1><p>${escapeHtml(c.description)}</p></section>\n<section class="card card-calculator kb-calculator-shell" id="kalkulator">${c.form}<div class="result-box" role="status" aria-live="polite" aria-atomic="true"><p>Eredmény:</p><div id="${resultIds[c.slug]}">${result}</div></div></section>\n<section class="adsense-content calculator-guide" data-quality-upgrade="2026-08-21">${c.guide}<h2>Gyakori kérdések</h2><div class="faq-list" data-accordion="single">${faq}</div><h3>Kapcsolódó kalkulátorok</h3><div class="related-links">${related}</div><p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-21">2026. augusztus 21.</time></p></section>\n<section class="reliability-note"><div><h2>Hitelesség és számítási korlátok</h2><p>${escapeHtml(c.reliability)}</p></div><div class="reliability-actions"><a href="../szamitasi-modszertan.html">Számítási módszertan</a><a href="mailto:kalkulatorbazis@gmail.com?subject=Hibabejelentés%20–%20${encodeURIComponent(c.title)}">Hibát találtál? Jelezd.</a></div></section>\n</main>\n<div id="footer"></div>\n<script defer src="../js/expansion-batch-03-calculators.js"></script>\n<script src="../js/utils.js"></script>\n<script defer src="../js/help-widget.js"></script>\n</body>\n</html>\n`;
}

function auditScript() {
  const expected = calculators.map((c) => `kalkulatorok/${c.slug}.html`);
  return `const fs = require("fs");\nconst path = require("path");\nconst assert = require("assert");\nconst metadata = require("../js/expansion-batch-03-data.js");\nconst calculators = require("../js/expansion-batch-03-calculators.js");\nconst root = path.resolve(__dirname, "..");\nconst expected = ${JSON.stringify(expected, null, 2)};\nassert.strictEqual(metadata.length, 5);\nassert.deepStrictEqual(metadata.map((item) => item.url), expected);\nfor (const item of metadata) { const file = path.join(root, item.url); assert.ok(fs.existsSync(file), "Hiányzó kalkulátoroldal: " + item.url); const html = fs.readFileSync(file, "utf8"); assert.ok(html.includes("class=\\"card card-calculator"), item.url + ": hiányzó statikus kalkulátorkártya"); assert.ok(html.includes("data-quality-upgrade=\\"2026-08-21\\""), item.url + ": hiányzó minőségi tartalomjelölő"); assert.ok(html.includes("expansion-batch-03-calculators.js"), item.url + ": hiányzó számítási modul"); }\nconst weighted = calculators.sulyozottAtlag([80,95,70],[2,3,1]); assert.ok(Math.abs(weighted.mean - 515/6) < 1e-12); assert.strictEqual(weighted.weightSum, 6); assert.throws(() => calculators.sulyozottAtlag([1,2],[1]), /elemszáma/);\nconst goal = calculators.megtakaritasiCel(2000000,500000,100000,5); assert.strictEqual(goal.months, 15); assert.ok(Math.abs(goal.balance - 2074985.7678677074) < 0.01); assert.strictEqual(goal.contributions, 2000000);\nconst fence = calculators.keritesOszlop(20,2.5); assert.deepStrictEqual(fence, { bays: 8, posts: 9, actualSpacing: 2.5 });\nconst fuel = calculators.uzemanyagarKulonbseg(500,6.5,600,620); assert.ok(Math.abs(fuel.liters - 32.5) < 1e-12); assert.ok(Math.abs(fuel.difference - 650) < 1e-12);\nconst electric = calculators.villanyKoltseg(1500,2,30,70); assert.ok(Math.abs(electric.totalKwh - 90) < 1e-12); assert.ok(Math.abs(electric.totalCost - 6300) < 1e-12); assert.throws(() => calculators.villanyKoltseg(1000,25,30,70), /24 óra/);\nconsole.log("Expansion batch 03 audit OK: 5 új kalkulátor, fájlok és referencia-számítások ellenőrizve.");\n`;
}

function replaceOnce(file, needle, replacement) {
  let source = read(file);
  if (source.includes(replacement)) return;
  if (!source.includes(needle)) throw new Error(`${file}: nem található a módosítandó rész.`);
  source = source.replace(needle, replacement);
  write(file, source);
}

function patchShared() {
  const twoBatches = `const expansionCalculators = [\n  ...require("../js/expansion-batch-01-data.js"),\n  ...require("../js/expansion-batch-02-data.js"),\n];`;
  const threeBatches = `const expansionCalculators = [\n  ...require("../js/expansion-batch-01-data.js"),\n  ...require("../js/expansion-batch-02-data.js"),\n  ...require("../js/expansion-batch-03-data.js"),\n];`;
  for (const file of ["scripts/apply-category-taxonomy.js", "scripts/category-taxonomy-audit.js", "scripts/generate-sitemap.js"]) replaceOnce(file, twoBatches, threeBatches);
  replaceOnce("scripts/quality-3-audit.js", `  "js/expansion-batch-02-calculators.js",\n].map`, `  "js/expansion-batch-02-calculators.js",\n  "js/expansion-batch-03-calculators.js",\n].map`);

  const pkg = JSON.parse(read("package.json"));
  pkg.scripts["test:expansion:03"] = "node scripts/expansion-batch-03-audit.js";
  if (!pkg.scripts.quality.includes("test:expansion:03")) pkg.scripts.quality = pkg.scripts.quality.replace("npm run test:expansion:02", "npm run test:expansion:02 && npm run test:expansion:03");
  write("package.json", JSON.stringify(pkg, null, 2) + "\n");

  let utils = read("js/utils.js");
  if (!utils.includes("expansion-batch-03-data.js")) {
    const old = `  const loadExpansionData = () => {\n    loadScriptOnce(base + "js/expansion-batch-01-data.js", () => {\n      loadScriptOnce(base + "js/expansion-batch-02-data.js", loadUi);\n    });\n  };`;
    const next = `  const loadExpansionData = () => {\n    loadScriptOnce(base + "js/expansion-batch-01-data.js", () => {\n      loadScriptOnce(base + "js/expansion-batch-02-data.js", () => {\n        loadScriptOnce(base + "js/expansion-batch-03-data.js", loadUi);\n      });\n    });\n  };`;
    if (!utils.includes(old)) throw new Error("js/utils.js: expansion loader blokk nem található.");
    utils = utils.replace(old, next);
    write("js/utils.js", utils);
  }

  let taxonomy = read("scripts/apply-category-taxonomy.js");
  taxonomy = taxonomy.replace("function updateHomePage() {", "function updateHomePage(data) {");
  taxonomy = taxonomy.replace("Több mint 70 magyar nyelvű kalkulátor", "Több mint ${Math.floor(data.calculators.length / 10) * 10} magyar nyelvű kalkulátor");
  taxonomy = taxonomy.replace("updateHomePage();", "updateHomePage(data);");
  write("scripts/apply-category-taxonomy.js", taxonomy);
}

function patchAllCalculatorsPage() {
  const headings = { mindennapi: "Mindennapi kalkulátorok", penzugyi: "Pénzügyi kalkulátorok", epitoipari: "Építőipari kalkulátorok", auto: "Autós kalkulátorok" };
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

write("js/expansion-batch-03-data.js", dataModule());
write("js/expansion-batch-03-calculators.js", calculatorModule());
write("scripts/expansion-batch-03-audit.js", auditScript());
for (const c of calculators) write(`kalkulatorok/${c.slug}.html`, page(c));
patchShared();
patchAllCalculatorsPage();

console.log(`Calculator expansion batch 3 prepared: ${calculators.length} calculators.`);

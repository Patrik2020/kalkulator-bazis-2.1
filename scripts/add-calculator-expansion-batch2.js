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
    slug: "mertani-atlag-kalkulator",
    title: "Mértani átlag kalkulátor",
    shortTitle: "Mértani átlag",
    category: "mindennapi",
    group: "matematika",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Pozitív értékek mértani átlagának kiszámítása, különösen egymásra épülő szorzók és növekedési tényezők összevetéséhez.",
    keywords: "mértani átlag geometriai közép hozam növekedés szorzó matematika",
    related: ["atlag-kalkulator.html", "szazalekos-valtozas-kalkulator.html", "kamatos-kamat-kalkulator.html"],
    defaultResult: [["Mértani átlag", "1,0447"], ["Elemszám", "3"]],
    form: `<div class="calc-grid"><div><label for="geoValues">Pozitív számok</label><textarea id="geoValues" rows="4" autocomplete="off">1,05; 0,98; 1,12</textarea><small>Szóköz, pontosvessző vagy sortörés használható. Tizedesvesszőt is elfogad.</small></div></div>`,
    guide: `<h2>Mi a mértani átlag?</h2><p>A mértani átlag több pozitív szám szorzatának n-edik gyöke. Akkor különösen hasznos, amikor az értékek egymásra épülő arányokat, növekedési tényezőket vagy szorzókat jelentenek. Emiatt pénzügyi hozamok, népességváltozás, indexek és más összetett növekedési folyamatok összehasonlításánál gyakran többet mond, mint a számtani átlag.</p><p>A kalkulátor numerikusan stabil módon, logaritmusok segítségével számol. A pozitív értékek logaritmusának átlagát veszi, majd exponenciális visszaalakítással kapja meg a mértani közepet.</p><h2>Mikor ne a számtani átlagot használd?</h2><p>Egymást követő százalékos változásoknál a hatások összeszorzódnak. Például +20% és −20% nem oltja ki egymást: 1,20 × 0,80 = 0,96, vagyis összességében 4%-os csökkenés történik. Ilyen helyzetben a növekedési szorzók mértani átlaga ad értelmesebb periódusonkénti átlagot.</p><div class="example-box"><h3>Példa</h3><p>Az 1,05; 0,98 és 1,12 szorzók mértani átlaga körülbelül 1,0447. Ez nagyjából 4,47%-os összetett átlagos növekedési tényezőnek felel meg periódusonként.</p></div><h2>Korlátok</h2><p>A hagyományos valós mértani átlaghoz minden bemenetnek pozitívnak kell lennie. Nulla vagy negatív szám esetén ez a kalkulátor nem ad eredményt. Százalékos hozamot előbb növekedési szorzóvá kell alakítani: például +5% → 1,05, −3% → 0,97.</p>`,
    faq: [["Miért nem enged nullát?", "A használt logaritmikus módszerhez és a valós mértani átlag hagyományos értelmezéséhez minden értéknek pozitívnak kell lennie."], ["Hozamot hogyan adjak meg?", "Például +5% esetén 1,05, míg −3% esetén 0,97 növekedési szorzót adj meg."], ["Ugyanaz, mint az átlag kalkulátor?", "Nem. A számtani átlag összeadáson, a mértani átlag szorzaton alapul, ezért más típusú problémákhoz való."]],
    reliability: "A mértani átlag pozitív értékek összetett arányainak összehasonlítására alkalmas; önmagában nem hozamígéret vagy pénzügyi előrejelzés."
  },
  {
    slug: "datum-hozzaadas-kivonas-kalkulator",
    title: "Dátum hozzáadás és kivonás kalkulátor",
    shortTitle: "Dátum hozzáadás/kivonás",
    category: "mindennapi",
    group: "ido-datum",
    cardClass: "card-general",
    categoryTitle: "Mindennapok",
    categoryUrl: "../mindennapi.html",
    description: "Napok hozzáadása egy dátumhoz vagy kivonása belőle, a cél dátum és a hét napjának megjelenítésével.",
    keywords: "dátum hozzáadás kivonás napok határidő naptár mikor lesz",
    related: ["datum-kulonbseg-kalkulator.html", "eletkor-kalkulator.html", "fizetesi-hatarido-kalkulator.html"],
    defaultResult: [["Eredmény dátuma", "2026. szeptember 20."], ["A hét napja", "vasárnap"]],
    form: `<div class="calc-grid"><div><label for="dateBase">Kiinduló dátum</label><input id="dateBase" type="date" value="2026-08-21"></div><div><label for="dateDays">Napok száma</label><input id="dateDays" type="number" value="30" step="1"></div><div><label for="dateOperation">Művelet</label><select id="dateOperation"><option value="add">Hozzáadás</option><option value="subtract">Kivonás</option></select></div></div>`,
    guide: `<h2>Mire jó a dátum hozzáadás/kivonás?</h2><p>Az eszköz egy megadott naptári dátumhoz egész napokat ad hozzá, vagy napokat von ki belőle. Hasznos lehet tervezési határidők, próbaidők, utazások, garanciális időpontok vagy egyszerű naptári ellenőrzések során.</p><p>A számítás naptári napokkal dolgozik, tehát a hétvégéket és ünnepnapokat is beleszámítja. Nem munkanap-kalkulátor, és jogszabály szerinti határidő-számításnál külön szabályok vonatkozhatnak a kezdőnapra, a lejárati napra és a munkaszüneti napokra.</p><h2>Hogyan számol?</h2><p>A dátumot időzónától független naptári értékként kezeli, majd a megadott egész napszámot hozzáadja vagy kivonja. Így az óraátállítás nem okoz egy nappal elcsúszó eredményt.</p><div class="example-box"><h3>Példa</h3><p>2026. augusztus 21-hez 30 napot hozzáadva 2026. szeptember 20. adódik. Ugyanebből a dátumból 30 napot kivonva 2026. július 22. lenne az eredmény.</p></div><h2>Mikor használj másik kalkulátort?</h2><p>Ha két dátum közötti eltérést keresel, a Dátum különbség kalkulátor közvetlenebb. Fizetési vagy hivatalos határidőnél pedig mindig ellenőrizd, hogy naptári napot, munkanapot vagy külön jogi szabályt kell-e alkalmazni.</p>`,
    faq: [["A hétvégék beleszámítanak?", "Igen. A kalkulátor naptári napokkal dolgozik, ezért a szombat, vasárnap és ünnepnap is egy-egy nap."], ["Lehet negatív napszámot írni?", "A félreértések elkerülésére pozitív egész napszámot kér, az irányt pedig a Hozzáadás/Kivonás választóval állíthatod be."], ["Hivatalos határidőhöz használható?", "Tájékozódásra igen, de hivatalos határidőnél az adott szabályozás kezdő- és lejárati napra vonatkozó előírásait külön ellenőrizni kell."]],
    reliability: "A kalkulátor naptári napokat ad hozzá vagy von ki; munkanap-, ünnepnap- és jogi határidőszabályokat nem alkalmaz automatikusan."
  },
  {
    slug: "aljzatkiegyenlito-kalkulator",
    title: "Aljzatkiegyenlítő kalkulátor",
    shortTitle: "Aljzatkiegyenlítő",
    category: "epitoipari",
    group: "burkolas-feluletek",
    cardClass: "card-building",
    categoryTitle: "Otthon & felújítás",
    categoryUrl: "../epitoipari.html",
    description: "Aljzatkiegyenlítő anyagszükséglet és zsákszám becslése felület, átlagos rétegvastagság, fajlagos fogyás és ráhagyás alapján.",
    keywords: "aljzatkiegyenlítő önterülő aljzat kg zsák rétegvastagság burkolás felújítás",
    related: ["padlo-burkolat-kalkulator.html", "csemperagaszto-kalkulator.html", "csempe-kalkulator.html"],
    defaultResult: [["Alap anyagigény", "96 kg"], ["Ráhagyással", "105,6 kg"], ["25 kg-os zsák", "5 db"]],
    form: `<div class="calc-grid"><div><label for="levelArea">Felület (m²)</label><input id="levelArea" type="number" value="20" min="0" step="0.1"></div><div><label for="levelThickness">Átlagos rétegvastagság (mm)</label><input id="levelThickness" type="number" value="3" min="0" step="0.1"></div><div><label for="levelConsumption">Fajlagos fogyás (kg/m²/mm)</label><input id="levelConsumption" type="number" value="1.6" min="0" step="0.01"></div><div><label for="levelWaste">Ráhagyás (%)</label><input id="levelWaste" type="number" value="10" min="0" max="100" step="1"></div><div><label for="levelBag">Zsák tömege (kg)</label><input id="levelBag" type="number" value="25" min="0" step="0.1"></div></div>`,
    guide: `<h2>Hogyan számolja az anyagszükségletet?</h2><p>A kalkulátor a felületet megszorozza az átlagos rétegvastagsággal és a termék fajlagos fogyásával, majd hozzáadja a választott ráhagyást. A végeredményt a zsák tömegével elosztva és felfelé kerekítve megkapod a becsült egész zsákszámot.</p><p>A legfontosabb bemenet a gyártói <strong>fajlagos fogyás</strong>, amelyet általában kg/m²/mm formában adnak meg. A termék adatlapja mindig elsőbbséget élvez az itt szereplő példabeállítással szemben.</p><h2>Miért csak átlagos vastagsággal számol?</h2><p>A valós aljzat ritkán teljesen egyenletes. Ha egy helyen 2 mm, máshol 5 mm kiegyenlítés szükséges, akkor az átlagos rétegvastagság csak becslés. Nagy szintkülönbségnél érdemes több mérési pontból átlagot képezni, és ellenőrizni a termék minimális és maximális rétegvastagságát.</p><div class="example-box"><h3>Példa</h3><p>20 m² felület × 3 mm × 1,6 kg/m²/mm = 96 kg alapigény. 10% ráhagyással 105,6 kg adódik, ami 25 kg-os kiszerelésből 5 zsák beszerzését jelenti.</p></div><h2>Mire figyelj kivitelezés előtt?</h2><p>Az alapozás, az aljzat szilárdsága, nedvessége, a dilatációk és a termék feldolgozási ideje ugyanolyan fontos, mint a mennyiség. A kalkulátor beszerzési becslést ad, nem helyettesíti a gyártói technológiai előírást.</p>`,
    faq: [["Milyen fajlagos fogyást adjak meg?", "A választott aljzatkiegyenlítő műszaki adatlapján szereplő kg/m²/mm értéket használd."], ["Miért kell ráhagyás?", "Az aljzat egyenetlensége, a keverési és felhordási veszteség miatt érdemes némi tartalékot tervezni."], ["A kalkulátor megmondja a megfelelő rétegvastagságot?", "Nem. A szükséges vastagságot helyszíni szintmérés és a kiválasztott termék megengedett rétegtartománya alapján kell meghatározni."]],
    reliability: "A mennyiség becslés; a konkrét termék gyártói fogyási adata, rétegvastagság-tartománya és feldolgozási előírása az irányadó."
  },
  {
    slug: "fektav-kalkulator",
    title: "Féktáv kalkulátor",
    shortTitle: "Féktáv",
    category: "auto",
    group: "muszaki-kornyezet",
    cardClass: "card-auto",
    categoryTitle: "Autó & közlekedés",
    categoryUrl: "../auto.html",
    description: "Elméleti reakcióút, fékút és teljes megállási távolság becslése sebesség, reakcióidő és tapadási tényező alapján.",
    keywords: "féktáv fékút reakcióút sebesség tapadás autó megállási távolság",
    related: ["utazasi-ido-kalkulator.html", "gumi-meret-kalkulator.html", "auto-kalkulator.html"],
    defaultResult: [["Reakcióút", "13,9 m"], ["Elméleti fékút", "14 m"], ["Teljes megállási távolság", "27,9 m"]],
    form: `<div class="calc-grid"><div><label for="brakeSpeed">Sebesség (km/h)</label><input id="brakeSpeed" type="number" value="50" min="0" step="1"></div><div><label for="brakeReaction">Reakcióidő (s)</label><input id="brakeReaction" type="number" value="1" min="0" step="0.1"></div><div><label for="brakeMu">Tapadási tényező (μ)</label><input id="brakeMu" type="number" value="0.7" min="0.05" max="1.5" step="0.05"></div></div>`,
    guide: `<h2>Mit becsül a féktáv kalkulátor?</h2><p>A teljes megállási távolság két részből áll: a vezető reakcióideje alatt megtett <strong>reakcióútból</strong> és a tényleges lassítás alatt megtett <strong>fékútból</strong>. A kalkulátor ezeket külön is megmutatja, hogy látható legyen, miért nő gyorsan a szükséges távolság a sebesség emelkedésével.</p><p>A reakcióút a sebesség és a reakcióidő szorzata. Az elméleti fékút sík úton a v²/(2·μ·g) képlettel készül, ahol μ a megadott tapadási tényező, g pedig 9,80665 m/s².</p><h2>Miért csak becslés?</h2><p>A valós fékút függ a gumiabroncs állapotától és hőmérsékletétől, az útfelülettől, a lejtéstől, a jármű fékrendszerétől, terhelésétől, az ABS működésétől és számos más körülménytől. A tapadási tényező nem egy fix „útminőség” szám, hanem erősen helyzetfüggő közelítés.</p><div class="example-box"><h3>Példa</h3><p>50 km/h, 1 másodperces reakcióidő és μ=0,7 mellett a reakcióút kb. 13,9 m, az elméleti fékút kb. 14,0 m, így a teljes becsült megállási távolság közel 27,9 m.</p></div><h2>Biztonsági értelmezés</h2><p>A kalkulátor eredménye nem használható arra, hogy minimális követési távolságot vagy „biztonságos” sebességet igazoljon. Közúton mindig az aktuális látási, időjárási és forgalmi viszonyokhoz kell igazítani a sebességet és a követési távolságot.</p>`,
    faq: [["Mit jelent a μ érték?", "Egy egyszerű tapadási közelítés a gumi és az út kapcsolatára. A valós érték sok tényezőtől függ és menet közben is változhat."], ["Miért nő ennyire gyorsan a fékút?", "Az elméleti fékút a sebesség négyzetével arányos, ezért kétszeres sebesség ideális esetben is körülbelül négyszeres fékutat jelent."], ["Ez megadja a biztonságos követési távolságot?", "Nem. A követési távolságnál további bizonytalanságokkal és a forgalmi környezettel is számolni kell."]],
    reliability: "Elméleti fizikai becslés sík útra. Valós közúti fékút és biztonságos követési távolság meghatározására önmagában nem alkalmas."
  },
  {
    slug: "egyszeri-max-1rm-kalkulator",
    title: "1RM kalkulátor",
    shortTitle: "1RM",
    category: "egeszseg",
    group: "edzes-regeneracio",
    cardClass: "card-health",
    categoryTitle: "Egészség & sport",
    categoryUrl: "../egeszseg.html",
    description: "Becsült egyismétléses maximum számítása Epley- és Brzycki-képlettel a használt súly és az ismétlésszám alapján.",
    keywords: "1rm egyismétléses maximum erő edzés súly ismétlés epley brzycki",
    related: ["feherje-szukseglet-kalkulator.html", "pulzus-zona-kalkulator.html", "kaloria-kalkulator.html"],
    defaultResult: [["Epley becslés", "93,3 kg"], ["Brzycki becslés", "90 kg"], ["Átlagos becslés", "91,7 kg"], ["80% terhelés", "73,3 kg"]],
    form: `<div class="calc-grid"><div><label for="rmWeight">Használt súly (kg)</label><input id="rmWeight" type="number" value="80" min="0" step="0.5"></div><div><label for="rmReps">Szabályos ismétlések</label><input id="rmReps" type="number" value="5" min="1" max="12" step="1"></div></div>`,
    guide: `<h2>Mi az 1RM?</h2><p>Az 1RM, vagyis egyismétléses maximum annak a terhelésnek a becslése, amelyből ideális körülmények között egy szabályos ismétlés végezhető. A kalkulátor nem kér valódi maximális próbát: egy többismétléses sorozatból készít matematikai közelítést.</p><p>Két gyakori képletet használ: az <strong>Epley</strong> képletet (súly × (1 + ismétlés/30)) és a <strong>Brzycki</strong> képletet (súly × 36 / (37 − ismétlés)). A két eredmény átlagát is megmutatja, mert egyik képlet sem pontos minden embernél és minden gyakorlatnál.</p><h2>Milyen ismétléstartományban érdemes használni?</h2><p>A becslés általában alacsony-közepes ismétlésszámnál használható a legértelmesebben. Ezért a kalkulátor 1–12 szabályos ismétlést enged. Nagyon magas ismétlésszámnál az állóképesség, a technika és a fáradás egyre jobban torzíthatja az 1RM-közelítést.</p><div class="example-box"><h3>Példa</h3><p>80 kg-ból 5 szabályos ismétlés esetén az Epley képlet kb. 93,3 kg, a Brzycki képlet pontosan 90 kg 1RM-et becsül. A kettő átlaga kb. 91,7 kg, ennek 80%-a körülbelül 73,3 kg.</p></div><h2>Biztonságos használat</h2><p>A becsült 1RM nem kötelező célterhelés, és nem jelenti azt, hogy tényleges maximális próbát kell végezni. Technikailag összetett gyakorlatnál, fájdalom, sérülés vagy bizonytalanság esetén a terhelés megválasztását érdemes képzett szakemberrel egyeztetni.</p>`,
    faq: [["Pontos az 1RM becslés?", "Nem teljesen. Képletalapú közelítés, amely egyénenként, gyakorlatonként és edzettségi szintenként eltérhet a tényleges maximumtól."], ["Miért két képletet mutat?", "Az Epley és Brzycki eltérően közelít, ezért a különbség jól jelzi, hogy a szám nem laborpontosságú."], ["Muszáj kipróbálnom a kiszámolt maximumot?", "Nem. A becslés főleg edzéstervezési viszonyítási pont; maximális próbát nem szükséges végezni."]],
    reliability: "Edzéstervezési becslés, nem teljesítménygarancia. A tényleges 1RM függ a technikától, fáradtságtól, gyakorlattól és egyéni adottságoktól."
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
  return `(function (root, factory) {\n  const calculators = factory();\n  if (typeof module !== "undefined" && module.exports) module.exports = calculators;\n  if (!root) return;\n  root.KB_EXPANSION_BATCH_02 = calculators;\n  let merged = false;\n  const mergeIntoSiteData = () => {\n    const data = root.KB_DATA;\n    if (!data || !Array.isArray(data.calculators)) return false;\n    const known = new Set(data.calculators.map((calculator) => calculator.url));\n    calculators.forEach((calculator) => { if (!known.has(calculator.url)) { data.calculators.push({ ...calculator }); known.add(calculator.url); } });\n    merged = true;\n    return true;\n  };\n  if (typeof document !== "undefined") {\n    document.addEventListener("kb:site-data-loaded", () => { mergeIntoSiteData(); });\n    if (mergeIntoSiteData()) queueMicrotask(() => document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "02" } })));\n    window.setTimeout(() => { if (!merged && mergeIntoSiteData()) document.dispatchEvent(new CustomEvent("kb:site-data-expanded", { detail: { batch: "02" } })); }, 0);\n  }\n})(typeof window !== "undefined" ? window : null, function () { return ${JSON.stringify(data, null, 2)}; });\n`;
}

function calculatorModule() {
  return `(function (root, factory) {\n  const api = factory();\n  if (typeof module !== "undefined" && module.exports) module.exports = api;\n  if (!root || typeof document === "undefined") return;\n  root.KB_EXPANSION_BATCH_02_CALCULATORS = api;\n\n  const number = (id) => { const el = document.getElementById(id); return el ? Number.parseFloat(String(el.value).replace(/\\s/g, "").replace(",", ".")) : NaN; };\n  const render = (target, rows) => { target.innerHTML = rows.map(([label, value]) => '<p><strong>' + label + ':</strong> ' + value + '</p>').join(''); };\n  const hu = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value);\n  const bindings = {\n    "mertani-atlag-kalkulator": { ids: ["geoValues"], result: "geoResult", calculate() { const values = api.parsePositiveList(document.getElementById("geoValues")?.value || ""); const r = api.mertaniAtlag(values); return [["Mértani átlag", hu(r.mean, 6)], ["Elemszám", String(r.count)]]; } },\n    "datum-hozzaadas-kivonas-kalkulator": { ids: ["dateBase", "dateDays", "dateOperation"], result: "dateResult", calculate() { const r = api.datumMuvelet(document.getElementById("dateBase")?.value || "", number("dateDays"), document.getElementById("dateOperation")?.value || "add"); return [["Eredmény dátuma", api.formatDateHu(r.iso)], ["A hét napja", api.weekdayHu(r.iso)]]; } },\n    "aljzatkiegyenlito-kalkulator": { ids: ["levelArea", "levelThickness", "levelConsumption", "levelWaste", "levelBag"], result: "levelResult", calculate() { const r = api.aljzatkiegyenlito(number("levelArea"), number("levelThickness"), number("levelConsumption"), number("levelWaste"), number("levelBag")); return [["Alap anyagigény", hu(r.baseKg, 1) + " kg"], ["Ráhagyással", hu(r.totalKg, 1) + " kg"], ["Szükséges zsák", r.bags + " db"]]; } },\n    "fektav-kalkulator": { ids: ["brakeSpeed", "brakeReaction", "brakeMu"], result: "brakeResult", calculate() { const r = api.fektav(number("brakeSpeed"), number("brakeReaction"), number("brakeMu")); return [["Reakcióút", hu(r.reactionDistance, 1) + " m"], ["Elméleti fékút", hu(r.brakingDistance, 1) + " m"], ["Teljes megállási távolság", hu(r.totalDistance, 1) + " m"]]; } },\n    "egyszeri-max-1rm-kalkulator": { ids: ["rmWeight", "rmReps"], result: "rmResult", calculate() { const r = api.egyRm(number("rmWeight"), number("rmReps")); return [["Epley becslés", hu(r.epley, 1) + " kg"], ["Brzycki becslés", hu(r.brzycki, 1) + " kg"], ["Átlagos becslés", hu(r.average, 1) + " kg"], ["80% terhelés", hu(r.eightyPercent, 1) + " kg"]]; } }\n  };\n  const init = () => {\n    const page = document.querySelector("[data-batch02-calc]"); if (!page) return;\n    const binding = bindings[page.dataset.batch02Calc]; if (!binding) return;\n    const target = document.getElementById(binding.result); if (!target) return;\n    let tracked = false;\n    const run = () => { try { render(target, binding.calculate()); } catch (error) { target.textContent = error instanceof Error ? error.message : "Adj meg érvényes adatokat."; } };\n    binding.ids.forEach((id) => { const input = document.getElementById(id); if (!input) return; const changed = () => { if (!tracked && typeof root.KB_TRACK_EVENT === "function") { tracked = true; root.KB_TRACK_EVENT("calculator_start", { calculator: page.dataset.batch02Calc }); } run(); }; input.addEventListener("input", changed); input.addEventListener("change", changed); });\n    run();\n  };\n  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();\n})(typeof window !== "undefined" ? window : null, function () {\n  const finite = (value, label) => { if (!Number.isFinite(value)) throw new Error(label + ": adj meg érvényes számot."); return value; };\n  const positive = (value, label) => { finite(value, label); if (value <= 0) throw new Error(label + ": az érték legyen nagyobb nullánál."); return value; };\n  const nonNegative = (value, label) => { finite(value, label); if (value < 0) throw new Error(label + ": az érték nem lehet negatív."); return value; };\n  const parsePositiveList = (raw) => { const normalized = String(raw || "").trim().replace(/(\\d),(\\d)/g, "$1.$2"); const values = normalized.split(/[;\\s]+/).filter(Boolean).map(Number); if (!values.length || values.some((v) => !Number.isFinite(v) || v <= 0)) throw new Error("Csak pozitív, érvényes számokat adj meg."); return values; };\n  const mertaniAtlag = (values) => { if (!Array.isArray(values) || !values.length) throw new Error("Adj meg legalább egy pozitív számot."); values.forEach((v) => positive(v, "Érték")); return { mean: Math.exp(values.reduce((sum, value) => sum + Math.log(value), 0) / values.length), count: values.length }; };\n  const parseIsoDate = (iso) => { if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(iso)) throw new Error("Adj meg érvényes dátumot."); const [y,m,d] = iso.split("-").map(Number); const date = new Date(Date.UTC(y, m - 1, d)); if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) throw new Error("Adj meg érvényes dátumot."); return date; };\n  const datumMuvelet = (iso, days, operation) => { const date = parseIsoDate(iso); nonNegative(days, "Napok száma"); if (!Number.isInteger(days)) throw new Error("A napok száma egész szám legyen."); const direction = operation === "subtract" ? -1 : 1; date.setUTCDate(date.getUTCDate() + direction * days); return { iso: date.toISOString().slice(0,10) }; };\n  const formatDateHu = (iso) => { const d = parseIsoDate(iso); return new Intl.DateTimeFormat("hu-HU", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" }).format(d); };\n  const weekdayHu = (iso) => { const d = parseIsoDate(iso); return new Intl.DateTimeFormat("hu-HU", { timeZone: "UTC", weekday: "long" }).format(d); };\n  const aljzatkiegyenlito = (area, thickness, consumption, waste, bag) => { positive(area, "Felület"); positive(thickness, "Rétegvastagság"); positive(consumption, "Fajlagos fogyás"); nonNegative(waste, "Ráhagyás"); positive(bag, "Zsák tömege"); if (waste > 100) throw new Error("A ráhagyás legfeljebb 100% legyen."); const baseKg = area * thickness * consumption; const totalKg = baseKg * (1 + waste / 100); return { baseKg, totalKg, bags: Math.ceil(totalKg / bag) }; };\n  const fektav = (speedKmh, reactionSeconds, mu) => { nonNegative(speedKmh, "Sebesség"); nonNegative(reactionSeconds, "Reakcióidő"); positive(mu, "Tapadási tényező"); if (mu > 1.5) throw new Error("A tapadási tényező legfeljebb 1,5 legyen."); const v = speedKmh / 3.6; const reactionDistance = v * reactionSeconds; const brakingDistance = speedKmh === 0 ? 0 : (v * v) / (2 * mu * 9.80665); return { reactionDistance, brakingDistance, totalDistance: reactionDistance + brakingDistance }; };\n  const egyRm = (weight, reps) => { positive(weight, "Súly"); positive(reps, "Ismétlésszám"); if (!Number.isInteger(reps) || reps < 1 || reps > 12) throw new Error("Az ismétlésszám 1 és 12 közötti egész szám legyen."); const epley = weight * (1 + reps / 30); const brzycki = weight * 36 / (37 - reps); const average = (epley + brzycki) / 2; return { epley, brzycki, average, eightyPercent: average * 0.8 }; };\n  return { parsePositiveList, mertaniAtlag, datumMuvelet, formatDateHu, weekdayHu, aljzatkiegyenlito, fektav, egyRm };\n});\n`;
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

const resultIds = {
  "mertani-atlag-kalkulator": "geoResult",
  "datum-hozzaadas-kivonas-kalkulator": "dateResult",
  "aljzatkiegyenlito-kalkulator": "levelResult",
  "fektav-kalkulator": "brakeResult",
  "egyszeri-max-1rm-kalkulator": "rmResult",
};

function page(c) {
  const faq = c.faq.map(([q,a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join("");
  const related = c.related.map((url) => `<a href="${escapeHtml(url)}">${escapeHtml(url.replace(/-kalkulator\.html$/, "").replace(/-/g, " "))}</a>`).join("");
  return `<!doctype html>\n<html lang="hu">\n<head>\n<meta name="google-adsense-account" content="ca-pub-2639795157074812">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="description" content="${escapeHtml(c.description)}">\n<link rel="canonical" href="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}.html">\n<title>${escapeHtml(c.title)} | Kalkulátor Bázis</title>\n<link rel="stylesheet" href="../css/style.css">\n<link rel="stylesheet" href="../css/pages/simple-calculator.css">\n<script src="../js/static-first-fallbacks.js"></script>\n<script src="../js/global-head.js"></script>\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Kalkulátor Bázis">\n<meta property="og:title" content="${escapeHtml(c.title)} | Kalkulátor Bázis">\n<meta property="og:description" content="${escapeHtml(c.description)}">\n<meta property="og:url" content="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}.html">\n<meta property="og:image" content="https://kalkulatorbazis.hu/images/kalkulator-bazis-og.jpg">\n<meta name="twitter:card" content="summary_large_image">\n<script id="kb-structured-data" type="application/ld+json">${jsonLd(c)}</script>\n</head>\n<body>\n<a class="kb-skip-link" href="#main-content">Ugrás a tartalomhoz</a>\n<div id="header"></div>\n<main id="main-content" class="container page-simple-calculator" data-batch02-calc="${c.slug}">\n<nav class="breadcrumb" aria-label="Morzsamenü"><ol><li><a href="../index.html">Főoldal</a></li><li><a href="${c.categoryUrl}">${escapeHtml(c.categoryTitle)}</a></li><li><span aria-current="page">${escapeHtml(c.shortTitle)}</span></li></ol></nav>\n<section class="hero"><h1>${escapeHtml(c.title)}</h1><p>${escapeHtml(c.description)}</p></section>\n<section class="card card-calculator kb-calculator-shell" id="kalkulator">${c.form}${resultHtml(c.defaultResult, resultIds[c.slug])}</section>\n<section class="adsense-content calculator-guide" data-quality-upgrade="2026-08-21">${c.guide}<h2>Gyakori kérdések</h2><div class="faq-list" data-accordion="single">${faq}</div><h3>Kapcsolódó kalkulátorok</h3><div class="related-links">${related}</div><p class="last-reviewed">Utolsó tartalmi frissítés: <time datetime="2026-08-21">2026. augusztus 21.</time></p></section>\n<section class="reliability-note"><div><h2>Hitelesség és számítási korlátok</h2><p>${escapeHtml(c.reliability)}</p></div><div class="reliability-actions"><a href="../szamitasi-modszertan.html">Számítási módszertan</a><a href="mailto:kalkulatorbazis@gmail.com?subject=Hibabejelentés%20–%20${encodeURIComponent(c.title)}">Hibát találtál? Jelezd.</a></div></section>\n</main>\n<div id="footer"></div>\n<script defer src="../js/expansion-batch-02-calculators.js"></script>\n<script src="../js/utils.js"></script>\n<script defer src="../js/help-widget.js"></script>\n</body>\n</html>\n`;
}

function auditScript() {
  return `const fs = require("fs");\nconst path = require("path");\nconst assert = require("assert");\nconst metadata = require("../js/expansion-batch-02-data.js");\nconst calculators = require("../js/expansion-batch-02-calculators.js");\nconst root = path.resolve(__dirname, "..");\nconst expected = ${JSON.stringify(calculators.map((c) => `kalkulatorok/${c.slug}.html`), null, 2)};\nassert.strictEqual(metadata.length, 5);\nassert.deepStrictEqual(metadata.map((item) => item.url), expected);\nfor (const item of metadata) { const file = path.join(root, item.url); assert.ok(fs.existsSync(file), "Hiányzó kalkulátoroldal: " + item.url); const html = fs.readFileSync(file, "utf8"); assert.ok(html.includes("class=\\"card card-calculator"), item.url + ": hiányzó statikus kalkulátorkártya"); assert.ok(html.includes("data-quality-upgrade=\\"2026-08-21\\""), item.url + ": hiányzó minőségi tartalomjelölő"); assert.ok(html.includes("expansion-batch-02-calculators.js"), item.url + ": hiányzó számítási modul"); }\nconst geo = calculators.mertaniAtlag([1,4]); assert.ok(Math.abs(geo.mean - 2) < 1e-12); assert.throws(() => calculators.mertaniAtlag([1,0]), /nagyobb nullánál|pozitív/);\nconst date = calculators.datumMuvelet("2026-08-21", 30, "add"); assert.strictEqual(date.iso, "2026-09-20"); assert.strictEqual(calculators.datumMuvelet("2026-08-21", 30, "subtract").iso, "2026-07-22");\nconst level = calculators.aljzatkiegyenlito(20,3,1.6,10,25); assert.ok(Math.abs(level.totalKg - 105.6) < 1e-9); assert.strictEqual(level.bags, 5);\nconst brake = calculators.fektav(50,1,0.7); assert.ok(Math.abs(brake.reactionDistance - 13.8888888889) < 1e-6); assert.ok(brake.totalDistance > brake.reactionDistance);\nconst rm = calculators.egyRm(80,5); assert.ok(Math.abs(rm.epley - 93.3333333333) < 1e-6); assert.ok(Math.abs(rm.brzycki - 90) < 1e-9); assert.throws(() => calculators.egyRm(80,13), /1 és 12/);\nconsole.log("Expansion batch 02 audit OK: 5 új kalkulátor, fájlok és referencia-számítások ellenőrizve.");\n`;
}

function replaceOnce(file, needle, replacement) {
  let source = read(file);
  if (source.includes(replacement)) return;
  if (!source.includes(needle)) throw new Error(`${file}: nem található a módosítandó rész.`);
  source = source.replace(needle, replacement);
  write(file, source);
}

function patchSharedScripts() {
  const combo = `const expansionCalculators = [\n  ...require("../js/expansion-batch-01-data.js"),\n  ...require("../js/expansion-batch-02-data.js"),\n];`;
  for (const file of ["scripts/apply-category-taxonomy.js", "scripts/category-taxonomy-audit.js", "scripts/generate-sitemap.js"]) {
    replaceOnce(file, `const expansionCalculators = require("../js/expansion-batch-01-data.js");`, combo);
  }

  replaceOnce(
    "scripts/quality-3-audit.js",
    `  "js/expansion-batch-01-calculators.js",\n].map`,
    `  "js/expansion-batch-01-calculators.js",\n  "js/expansion-batch-02-calculators.js",\n].map`
  );

  const pkg = JSON.parse(read("package.json"));
  pkg.scripts["test:expansion:02"] = "node scripts/expansion-batch-02-audit.js";
  if (!pkg.scripts.quality.includes("test:expansion:02")) {
    pkg.scripts.quality = pkg.scripts.quality.replace("npm run test:expansion:01", "npm run test:expansion:01 && npm run test:expansion:02");
  }
  write("package.json", JSON.stringify(pkg, null, 2) + "\n");

  let utils = read("js/utils.js");
  if (!utils.includes("expansion-batch-02-data.js")) {
    const old = `function loadSiteScripts(base) {\n  const loadUi = () => {\n    document.dispatchEvent(new CustomEvent("kb:site-data-loaded"));\n    markActiveNavigation(document.getElementById("header"));\n    loadScriptOnce(base + "js/site-ui.js");\n    if (window.location.pathname.toLowerCase().includes("/kalkulatorok/")) {\n      loadScriptOnce(base + "js/retention-cta.js");\n    }\n  };\n\n  if (window.KB_DATA) {\n    loadUi();\n    return;\n  }\n\n  loadScriptOnce(base + "js/site-data.js", loadUi);\n}`;
    const next = `function loadSiteScripts(base) {\n  const loadUi = () => {\n    document.dispatchEvent(new CustomEvent("kb:site-data-loaded"));\n    markActiveNavigation(document.getElementById("header"));\n    loadScriptOnce(base + "js/site-ui.js");\n    if (window.location.pathname.toLowerCase().includes("/kalkulatorok/")) {\n      loadScriptOnce(base + "js/retention-cta.js");\n    }\n  };\n\n  const loadExpansionData = () => {\n    loadScriptOnce(base + "js/expansion-batch-01-data.js", () => {\n      loadScriptOnce(base + "js/expansion-batch-02-data.js", loadUi);\n    });\n  };\n\n  if (window.KB_DATA) {\n    loadExpansionData();\n    return;\n  }\n\n  loadScriptOnce(base + "js/site-data.js", loadExpansionData);\n}`;
    if (!utils.includes(old)) throw new Error("js/utils.js: loadSiteScripts blokk nem található.");
    utils = utils.replace(old, next);
    write("js/utils.js", utils);
  }
}

function patchAllCalculatorsPage() {
  const headings = { mindennapi: "Mindennapi kalkulátorok", epitoipari: "Építőipari kalkulátorok", auto: "Autós kalkulátorok", egeszseg: "Egészség kalkulátorok" };
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

write("js/expansion-batch-02-data.js", dataModule());
write("js/expansion-batch-02-calculators.js", calculatorModule());
write("scripts/expansion-batch-02-audit.js", auditScript());
for (const c of calculators) write(`kalkulatorok/${c.slug}.html`, page(c));
patchSharedScripts();
patchAllCalculatorsPage();

console.log(`Calculator expansion batch 2 prepared: ${calculators.length} calculators.`);

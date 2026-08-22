const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
};

const calculators = [
  {
    slug: 'harmasszabaly-kalkulator',
    title: 'Hármasszabály kalkulátor',
    category: 'mindennapi',
    group: 'matematika',
    cardClass: 'card-general',
    categoryTitle: 'Mindennapok',
    categoryUrl: '../mindennapi.html',
    description: 'Egyenes vagy fordított arányosság ismeretlen értékének kiszámítása három ismert adatból.',
    keywords: 'hármasszabály aránypár egyenes fordított arányosság matematika százalék',
    hero: 'Számold ki az ismeretlen értéket három adatból, egyenes vagy fordított arányossággal.',
    form: `
      <form class="expansion-form" data-expansion-form="harmasszabaly-kalkulator">
        <div class="calc-grid">
          <div><label for="mode">Arányosság típusa</label><select id="mode" name="mode"><option value="direct">Egyenes arányosság</option><option value="inverse">Fordított arányosság</option></select></div>
          <div><label for="a">A érték</label><input id="a" name="a" type="text" inputmode="decimal" autocomplete="off" placeholder="pl. 4"></div>
          <div><label for="b">B érték</label><input id="b" name="b" type="text" inputmode="decimal" autocomplete="off" placeholder="pl. 10"></div>
          <div><label for="c">C érték</label><input id="c" name="c" type="text" inputmode="decimal" autocomplete="off" placeholder="pl. 6"></div>
        </div>
        <button class="btn btn-primary" type="submit">Számítás</button>
      </form>`,
    guide: `
      <h2>Mire jó a hármasszabály?</h2>
      <p>A hármasszabály akkor hasznos, amikor két mennyiség között ismert az arány, és ugyanebből a kapcsolatból egy negyedik értéket szeretnél meghatározni. Tipikus példa az ár és mennyiség, a recept átszámítása, a munkamennyiség és idő, vagy egy térképi arány.</p>
      <p><strong>Egyenes arányosságnál</strong> ha az egyik mennyiség nő, a másik is azonos arányban nő. Ha 4 kg termék 10 000 Ft, akkor 6 kg ára 15 000 Ft. A számítás: x = B × C / A.</p>
      <h2>Mikor kell fordított arányosság?</h2>
      <p>Fordított arányosságnál az egyik érték növekedése a másik csökkenésével jár. Ha 4 azonos teljesítményű gép 6 óra alatt végez el egy munkát, akkor 8 gépnél – ideális, lineáris feltételezés mellett – 3 óra adódik. A kalkulátor ilyenkor x = A × B / C összefüggést használ.</p>
      <div class="example-box"><h3>Példa</h3><p>3 liter festék 24 m²-re elég. Azonos kiadósság mellett 45 m²-hez 3 × 45 / 24 = 5,625 liter szükséges.</p></div>
      <h2>Mire figyelj?</h2>
      <p>A hármasszabály csak akkor ad értelmes eredményt, ha valóban arányos kapcsolat áll fenn. Sok valós folyamatnál vannak minimumdíjak, veszteségek, kapacitáshatárok vagy nem lineáris hatások, ezért az eredményt mindig a konkrét helyzethez kell értelmezni.</p>`,
    faqs: [
      ['Mi a különbség az egyenes és fordított arányosság között?', 'Egyenes arányosságnál a két mennyiség azonos irányban változik, fordítottnál az egyik növekedése a másik csökkenésével jár.'],
      ['Lehet tizedes számokat megadni?', 'Igen. Ponttal és vesszővel megadott tizedes értéket is elfogad.'],
      ['Használható recept átszámításához?', 'Igen, ha az összetevők mennyisége az adagok számával arányosan változik.'],
    ],
  },
  {
    slug: 'mertani-atlag-kalkulator',
    title: 'Mértani átlag kalkulátor',
    category: 'mindennapi',
    group: 'matematika',
    cardClass: 'card-general',
    categoryTitle: 'Mindennapok',
    categoryUrl: '../mindennapi.html',
    description: 'Pozitív értékek mértani közepének kiszámítása, különösen növekedési szorzók és arányok összevetéséhez.',
    keywords: 'mértani átlag geometriai közép hozam növekedés szorzó matematika',
    hero: 'Számold ki pozitív értékek mértani átlagát stabil, logaritmikus módszerrel.',
    form: `
      <form class="expansion-form" data-expansion-form="mertani-atlag-kalkulator">
        <div class="calc-grid calc-grid-single">
          <div><label for="values">Pozitív számok</label><textarea id="values" name="values" rows="5" placeholder="pl. 1,05; 0,98; 1,12"></textarea><small>Szóköz, pontosvessző vagy sortörés használható. Tizedesvesszőt is elfogad.</small></div>
        </div>
        <button class="btn btn-primary" type="submit">Számítás</button>
      </form>`,
    guide: `
      <h2>Mi a mértani átlag?</h2>
      <p>A mértani átlag több pozitív szám szorzatának n-edik gyöke. Akkor különösen hasznos, ha az értékek egymásra épülő arányokat, szorzókat vagy növekedési tényezőket jelentenek. Nem ugyanazt a kérdést válaszolja meg, mint a számtani átlag.</p>
      <p>A kalkulátor a közvetlen szorzás helyett logaritmusokat használ. Ez nagyobb elemszámnál numerikusan stabilabb: a logaritmusok átlagából exponenciális visszaalakítással kapjuk meg a mértani közepet.</p>
      <h2>Mikor jobb, mint a számtani átlag?</h2>
      <p>Egymást követő százalékos változásoknál vagy hozamszorzóknál a mértani átlag gyakran informatívabb. Például +20% és −20% nem semlegesíti egymást: 1,20 × 0,80 = 0,96, vagyis összességében 4%-os csökkenés történik.</p>
      <div class="example-box"><h3>Példa</h3><p>Az 1,10; 1,05 és 0,95 szorzók mértani átlaga megmutatja az egy periódusra jutó összetett átlagos szorzót. Százalékos hozamoknál előbb 1 + hozam alakra kell váltani.</p></div>
      <h2>Korlátok</h2>
      <p>A hagyományos valós mértani átlaghoz minden bemenetnek pozitívnak kell lennie. Nulla vagy negatív érték esetén ez a kalkulátor nem ad eredményt. Pénzügyi hozamoknál a százalékokat nem közvetlenül kell beírni, hanem növekedési szorzóként.</p>`,
    faqs: [
      ['Miért nem enged nullát?', 'A valós számok felett használt logaritmikus mértaniátlag-számításhoz minden értéknek pozitívnak kell lennie.'],
      ['Hozamokat hogyan adjak meg?', 'Például +5% esetén 1,05; −3% esetén 0,97 növekedési szorzót adj meg.'],
      ['Ugyanaz, mint az átlag kalkulátor?', 'Nem. A számtani átlag összeadáson, a mértani átlag szorzaton alapul, ezért más típusú problémákhoz való.'],
    ],
  },
  {
    slug: 'csemperagaszto-kalkulator',
    title: 'Csemperagasztó kalkulátor',
    category: 'epitoipari',
    group: 'burkolas-feluletek',
    cardClass: 'card-building',
    categoryTitle: 'Otthon & felújítás',
    categoryUrl: '../epitoipari.html',
    description: 'Csemperagasztó anyagszükséglet és zsákszám becslése felület, gyártói fajlagos fogyás és ráhagyás alapján.',
    keywords: 'csemperagasztó burkolás ragasztó kg m2 zsák anyagszükséglet felújítás',
    hero: 'Becsüld meg a csemperagasztó mennyiségét a burkolandó felület és a termék fogyási adata alapján.',
    form: `
      <form class="expansion-form" data-expansion-form="csemperagaszto-kalkulator">
        <div class="calc-grid">
          <div><label for="area">Burkolandó felület (m²)</label><input id="area" name="area" type="text" inputmode="decimal" autocomplete="off" placeholder="pl. 24"></div>
          <div><label for="consumption">Fajlagos fogyás (kg/m²)</label><input id="consumption" name="consumption" type="text" inputmode="decimal" value="4" autocomplete="off"></div>
          <div><label for="waste">Ráhagyás (%)</label><input id="waste" name="waste" type="text" inputmode="decimal" value="10" autocomplete="off"></div>
          <div><label for="bag">Zsák tömege (kg)</label><input id="bag" name="bag" type="text" inputmode="decimal" value="25" autocomplete="off"></div>
        </div>
        <button class="btn btn-primary" type="submit">Számítás</button>
      </form>`,
    guide: `
      <h2>Hogyan becsüli a ragasztó mennyiségét?</h2>
      <p>A kalkulátor a burkolandó felületet megszorozza a megadott fajlagos fogyással, majd hozzáadja a választott ráhagyást. Ezután a teljes kilogrammot elosztja a zsák tömegével, és felfelé kerekíti a szükséges egész zsákszámot.</p>
      <p>A legfontosabb adat a <strong>fajlagos fogyás</strong>. Ezt ne általános internetes átlagból vedd, ha már kiválasztottad a terméket: a ragasztó műszaki adatlapján szereplő érték az irányadó.</p>
      <h2>Mi befolyásolja a valós fogyást?</h2>
      <p>A fogazott glettvas mérete, a lap formátuma, az aljzat síkpontossága, a ragasztási technika és az esetleges kétoldali kenés jelentősen változtathatja a tényleges felhasználást. Nagy lapoknál vagy egyenetlen aljzatnál a fogyás magasabb lehet.</p>
      <div class="example-box"><h3>Példa</h3><p>24 m² felület, 4 kg/m² fajlagos fogyás és 10% ráhagyás mellett 105,6 kg ragasztó adódik. 25 kg-os zsákokból ez 5 teljes zsák beszerzését jelenti.</p></div>
      <h2>Tervezési megjegyzés</h2>
      <p>Az eredmény beszerzési becslés, nem gyártói előírás. Kültéri, nagylapos, padlófűtéses vagy különleges aljzatú burkolásnál a megfelelő ragasztótípus és technológia kiválasztása legalább olyan fontos, mint a mennyiség.</p>`,
    faqs: [
      ['Milyen fogyással számoljak?', 'Elsőként a választott ragasztó gyártói adatlapját használd, mert a termék és a glettvas függvényében jelentős eltérés lehet.'],
      ['Miért kell ráhagyás?', 'A maradék, az aljzat egyenetlensége és a kivitelezés közbeni veszteség miatt érdemes tartalékot tervezni.'],
      ['A kalkulátor kiválasztja a megfelelő ragasztót?', 'Nem. Csak mennyiséget becsül; a ragasztó típusát a burkolat, az aljzat és a környezet alapján kell kiválasztani.'],
    ],
  },
  {
    slug: 'elektromos-auto-toltesi-koltseg-kalkulator',
    title: 'Elektromos autó töltési költség kalkulátor',
    category: 'auto',
    group: 'utazas-uzemanyag',
    cardClass: 'card-auto',
    categoryTitle: 'Autó & közlekedés',
    categoryUrl: '../auto.html',
    description: 'EV-töltés hálózati energiaigényének, várható költségének és ideális töltési idejének becslése töltési veszteséggel.',
    keywords: 'elektromos autó ev töltés kWh villany költség akkumulátor soc töltési veszteség',
    hero: 'Számold ki, mennyi hálózati energia és költség kell egy megadott töltöttségi szint eléréséhez.',
    form: `
      <form class="expansion-form" data-expansion-form="elektromos-auto-toltesi-koltseg-kalkulator">
        <div class="calc-grid">
          <div><label for="battery">Hasznos akkukapacitás (kWh)</label><input id="battery" name="battery" type="text" inputmode="decimal" placeholder="pl. 64" autocomplete="off"></div>
          <div><label for="startSoc">Kezdő töltöttség (%)</label><input id="startSoc" name="startSoc" type="text" inputmode="decimal" value="20" autocomplete="off"></div>
          <div><label for="targetSoc">Cél töltöttség (%)</label><input id="targetSoc" name="targetSoc" type="text" inputmode="decimal" value="80" autocomplete="off"></div>
          <div><label for="loss">Töltési veszteség (%)</label><input id="loss" name="loss" type="text" inputmode="decimal" value="10" autocomplete="off"></div>
          <div><label for="price">Villamos energia ára (Ft/kWh)</label><input id="price" name="price" type="text" inputmode="decimal" placeholder="pl. 70" autocomplete="off"></div>
          <div><label for="power">Átlagos töltési teljesítmény (kW)</label><input id="power" name="power" type="text" inputmode="decimal" value="11" autocomplete="off"></div>
        </div>
        <button class="btn btn-primary" type="submit">Számítás</button>
      </form>`,
    guide: `
      <h2>Mit számol az EV-töltési kalkulátor?</h2>
      <p>Először meghatározza, hány kilowattórával kell növelni az akkumulátor energiatartalmát a kezdő és cél töltöttség között. Ezután figyelembe veszi a töltési veszteséget, így a hálózatból felvett energia nagyobb lesz annál, mint ami ténylegesen az akkumulátorba kerül.</p>
      <p>A költség a becsült hálózati energia és a megadott Ft/kWh díj szorzata. Az ideális töltési idő a hálózati energia és az átlagos töltési teljesítmény hányadosa.</p>
      <h2>Miért csak becslés a töltési idő?</h2>
      <p>Az autó nem feltétlenül veszi fel végig ugyanazt a teljesítményt. DC gyorstöltésnél különösen jellemző a töltési görbe visszaesése magasabb töltöttségnél. AC töltésnél az autó fedélzeti töltője, a hálózat és a töltőpont korlátja is számít.</p>
      <div class="example-box"><h3>Példa</h3><p>64 kWh hasznos kapacitásnál 20%-ról 80%-ra 38,4 kWh kerül az akkuba. 10% veszteséggel a hálózatból körülbelül 42,7 kWh szükséges. 70 Ft/kWh árral ez nagyjából 2 987 Ft.</p></div>
      <h2>Otthoni és nyilvános töltés</h2>
      <p>Az energiaár mezőbe azt az egységárat írd, amelyet ténylegesen fizetsz. Nyilvános töltőknél lehet perces, indítási vagy egyéb díj is, amelyet ez az egyszerű energiaalapú modell nem tartalmaz.</p>`,
    faqs: [
      ['Miért számol töltési veszteséggel?', 'Mert a hálózatból felvett energia egy része hővé és egyéb veszteséggé alakul, ezért több energiát fizetsz ki, mint amennyi az akkumulátorban megjelenik.'],
      ['A 11 kW mindig 11 kW töltést jelent?', 'Nem. Az autó fedélzeti töltője, a töltőpont és a hálózat közül a legkisebb korlát határozza meg a tényleges teljesítményt.'],
      ['DC gyorstöltésre is használható?', 'Költségbecslésre igen, de az időbecslés ott kevésbé pontos a változó töltési görbe miatt.'],
    ],
  },
  {
    slug: 'futotempo-kalkulator',
    title: 'Futótempó kalkulátor',
    category: 'egeszseg',
    group: 'edzes-regeneracio',
    cardClass: 'card-health',
    categoryTitle: 'Egészség & sport',
    categoryUrl: '../egeszseg.html',
    description: 'Futótempó, átlagsebesség és becsült célidő számítása távolság és idő vagy megadott perc/km tempó alapján.',
    keywords: 'futótempó pace perc km futás célidő átlagsebesség 5k 10k félmaraton maraton',
    hero: 'Számolj perc/km tempót időből, vagy becsülj célidőt egy választott tempóból.',
    form: `
      <form class="expansion-form" data-expansion-form="futotempo-kalkulator">
        <div class="calc-grid">
          <div><label for="mode">Számítási mód</label><select id="mode" name="mode"><option value="pace">Tempó számítása időből</option><option value="finish">Célidő számítása tempóból</option></select></div>
          <div><label for="distance">Távolság (km)</label><input id="distance" name="distance" type="text" inputmode="decimal" value="5" autocomplete="off"></div>
          <div data-time-field><label for="hours">Óra</label><input id="hours" name="hours" type="number" min="0" step="1" value="0"></div>
          <div data-time-field><label for="minutes">Perc</label><input id="minutes" name="minutes" type="number" min="0" step="1" value="30"></div>
          <div data-time-field><label for="seconds">Másodperc</label><input id="seconds" name="seconds" type="number" min="0" max="59" step="1" value="0"></div>
          <div data-pace-field hidden><label for="paceMinutes">Tempó perc része (perc/km)</label><input id="paceMinutes" name="paceMinutes" type="number" min="0" step="1" value="6"></div>
          <div data-pace-field hidden><label for="paceSeconds">Tempó másodperc része</label><input id="paceSeconds" name="paceSeconds" type="number" min="0" max="59" step="1" value="0"></div>
        </div>
        <button class="btn btn-primary" type="submit">Számítás</button>
      </form>`,
    guide: `
      <h2>Tempó és sebesség nem ugyanaz</h2>
      <p>A futásban a tempót általában perc/kilométer formában adjuk meg: azt mutatja, mennyi idő kell egy kilométer megtételéhez. A sebesség ezzel szemben kilométer/óra. Ugyanazt a teljesítményt írják le, csak más szemszögből.</p>
      <p>Ha ismered a távot és a teljes időt, a kalkulátor a teljes másodpercet elosztja a kilométerek számával. Ha a tempót adod meg, akkor a perc/km értéket megszorozza a távval, így becsült célidőt kapsz.</p>
      <h2>Mire használható?</h2>
      <p>Hasznos lehet edzéstervhez, versenycél becsléséhez vagy két futás összehasonlításához. A számított tempó átlagtempó: emelkedő, lejtő, megállás, időjárás és pulzuscél miatt az egyes kilométerek természetesen eltérhetnek.</p>
      <div class="example-box"><h3>Példa</h3><p>5 km 30 perc alatt pontosan 6:00 perc/km átlagtempó, ami 10 km/h átlagsebességnek felel meg. Ugyanez a tempó 10 km-en 1:00:00 célidőt jelent.</p></div>
      <h2>Ne kezeld teljesítménygaranciaként</h2>
      <p>Az azonos tempó hosszabb távon nem feltétlenül tartható. A kalkulátor matematikai átszámítást végez, nem fiziológiai verseny-előrejelzést. Edzésintenzitásnál a terhelést, regenerációt és egyéni állapotot is figyelembe kell venni.</p>`,
    faqs: [
      ['Mit jelent a 6:00 perc/km?', 'Azt, hogy átlagosan hat perc alatt teszel meg egy kilométert.'],
      ['Átszámolja km/h-ra is?', 'Igen, időből számolt tempónál az átlagsebességet is megmutatja.'],
      ['Megjósolja a maratoni időmet?', 'Nem. A célidő egyszerűen ugyanazzal a tempóval számol, ezért nem veszi figyelembe a hosszabb táv fáradását.'],
    ],
  },
];

const categoryHeadings = {
  mindennapi: 'Mindennapi kalkulátorok',
  epitoipari: 'Építőipari kalkulátorok',
  auto: 'Autós kalkulátorok',
  egeszseg: 'Egészség kalkulátorok',
};

const siteDataEntry = (c) => `    {\n      title: ${JSON.stringify(c.title)},\n      url: ${JSON.stringify(`kalkulatorok/${c.slug}.html`)},\n      category: ${JSON.stringify(c.category)},\n      group: ${JSON.stringify(c.group)},\n      description: ${JSON.stringify(c.description)},\n      keywords: ${JSON.stringify(c.keywords)},\n    },`;

function patchSiteData() {
  const file = 'js/site-data.js';
  let source = read(file);
  const missing = calculators.filter((c) => !source.includes(`kalkulatorok/${c.slug}.html`));
  if (!missing.length) return;
  const marker = '\n  ];\n\n  const relatedGroups = [';
  if (!source.includes(marker)) throw new Error('site-data.js calculators marker not found');
  source = source.replace(marker, `\n${missing.map(siteDataEntry).join('\n')}\n  ];\n\n  const relatedGroups = [`);
  write(file, source);
}

function patchTaxonomyConfig() {
  const file = 'scripts/category-taxonomy-config.js';
  let source = read(file);
  const missing = calculators.filter((c) => !source.includes(`kalkulatorok/${c.slug}.html`));
  if (!missing.length) return;
  const marker = '\n};\n\nmodule.exports = { categories, groupByCalculator };';
  if (!source.includes(marker)) throw new Error('taxonomy config marker not found');
  const lines = missing.map((c) => `  ${JSON.stringify(`kalkulatorok/${c.slug}.html`)}: ${JSON.stringify(c.group)},`).join('\n');
  source = source.replace(marker, `\n${lines}\n};\n\nmodule.exports = { categories, groupByCalculator };`);
  write(file, source);
}

function patchQualityAudit() {
  const file = 'scripts/quality-3-audit.js';
  let source = read(file);
  if (source.includes('js/expansion-quality.js')) return;
  const needle = '  "js/site-quality-final.js",\n';
  if (!source.includes(needle)) throw new Error('quality source marker not found');
  source = source.replace(needle, `${needle}  "js/expansion-quality.js",\n`);
  write(file, source);
}

function patchPackageJson() {
  const file = 'package.json';
  const pkg = JSON.parse(read(file));
  pkg.scripts['test:expansion'] = 'node scripts/expansion-calculators-audit.js';
  if (!pkg.scripts.quality.includes('test:expansion')) pkg.scripts.quality += ' && npm run test:expansion';
  write(file, `${JSON.stringify(pkg, null, 2)}\n`);
}

function renderFaq(faqs) {
  return faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n');
}

function renderJsonLd(c) {
  const url = `https://kalkulatorbazis.hu/kalkulatorok/${c.slug}`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: c.title, description: c.description, inLanguage: 'hu-HU', isPartOf: { '@id': 'https://kalkulatorbazis.hu/#website' } },
      { '@type': 'SoftwareApplication', '@id': `${url}#calculator`, name: c.title, applicationCategory: 'CalculatorApplication', operatingSystem: 'Web', url, description: c.description, offers: { '@type': 'Offer', price: '0', priceCurrency: 'HUF' }, isPartOf: { '@id': 'https://kalkulatorbazis.hu/#website' } },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Főoldal', item: 'https://kalkulatorbazis.hu/' },
        { '@type': 'ListItem', position: 2, name: c.categoryTitle, item: `https://kalkulatorbazis.hu/${c.categoryUrl.replace('../', '').replace(/\.html$/, '')}` },
        { '@type': 'ListItem', position: 3, name: c.title, item: url },
      ] },
      { '@type': 'FAQPage', '@id': `${url}#gyik`, mainEntity: c.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  });
}

function renderPage(c) {
  const related = calculators.filter((x) => x.slug !== c.slug && x.category === c.category).slice(0, 2);
  const fallbackRelated = related.length ? related : calculators.filter((x) => x.slug !== c.slug).slice(0, 2);
  const relatedLinks = fallbackRelated.map((x) => `<li><a href="./${x.slug}">${x.title}</a></li>`).join('\n');
  return `<!DOCTYPE html>
<html lang="hu">
<head>
<meta name="google-adsense-account" content="ca-pub-2639795157074812">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${c.description}">
<link rel="canonical" href="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}">
<title>${c.title} | Kalkulátor Bázis</title>
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/pages/simple-calculator.css">
<link rel="stylesheet" href="../css/pages/expansion-calculators.css?v=20260821-1">
<script src="../js/static-first-fallbacks.js"></script>
<script src="../js/global-head.js"></script>
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kalkulátor Bázis">
<meta property="og:title" content="${c.title} | Kalkulátor Bázis">
<meta property="og:description" content="${c.description}">
<meta property="og:url" content="https://kalkulatorbazis.hu/kalkulatorok/${c.slug}">
<meta property="og:image" content="https://kalkulatorbazis.hu/images/kalkulator-bazis-og.jpg">
<meta name="twitter:card" content="summary_large_image">
<script id="kb-structured-data" type="application/ld+json">${renderJsonLd(c)}</script>
</head>
<body>
<a class="kb-skip-link" href="#main-content">Ugrás a tartalomhoz</a>
<div id="header"></div>
<main id="main-content" class="container page-simple-calculator page-expansion-calculator" data-expansion-calc="${c.slug}">
  <section class="hero">
    <h1>${c.title}</h1>
    <p>${c.hero}</p>
  </section>
  <section class="card card-calculator kb-calculator-shell" id="kalkulator">
    ${c.form}
    <div class="result-box expansion-results" role="status" aria-live="polite" aria-atomic="true">
      <p>Eredmény:</p>
      <div data-expansion-results>Adj meg értékeket, majd indítsd el a számítást.</div>
    </div>
  </section>
  <section class="adsense-content calculator-guide expansion-guide">
    ${c.guide}
    <h2>Gyakori kérdések</h2>
    <div class="faq-list" data-accordion="single">${renderFaq(c.faqs)}</div>
    <h2>Kapcsolódó kalkulátorok</h2>
    <ul>
      ${relatedLinks}
      <li><a href="${c.categoryUrl.replace(/\.html$/, '')}">${c.categoryTitle} kalkulátorok</a></li>
      <li><a href="../kalkulatorok">Összes kalkulátor</a></li>
    </ul>
  </section>
</main>
<div id="footer"></div>
<script src="../js/site-data.js"></script>
<script src="../js/utils.js"></script>
<script src="../js/site-ui.js"></script>
<script src="../js/expansion-calculators-core.js?v=20260821-1"></script>
<script src="../js/expansion-calculators.js?v=20260821-1" defer></script>
<script src="../js/help-widget.js" defer></script>
</body>
</html>
`;
}

function writePages() {
  for (const calculator of calculators) write(`kalkulatorok/${calculator.slug}.html`, renderPage(calculator));
}

function writeExpansionQuality() {
  write('js/expansion-quality.js', `(function () {\n  window.KB_EXPANSION_QUALITY_ROUTES = ${JSON.stringify(calculators.map((c) => c.slug), null, 2)};\n})();\n`);
}

function writeCss() {
  write('css/pages/expansion-calculators.css', `.page-expansion-calculator .expansion-form { display: grid; gap: 1rem; }\n.page-expansion-calculator textarea { width: 100%; resize: vertical; min-height: 8rem; }\n.page-expansion-calculator small { display: block; margin-top: .35rem; color: var(--text-light); line-height: 1.5; }\n.expansion-results dl { margin: .75rem 0 0; display: grid; gap: .65rem; }\n.expansion-results .expansion-result-row { display: flex; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--border); padding-top: .65rem; }\n.expansion-results dt { color: var(--text-light); }\n.expansion-results dd { margin: 0; font-weight: 800; text-align: right; }\n@media (max-width: 560px) { .expansion-results .expansion-result-row { display: grid; gap: .2rem; } .expansion-results dd { text-align: left; } }\n`);
}

function writeCore() {
  write('js/expansion-calculators-core.js', `'use strict';\n(function (root, factory) {\n  const api = factory();\n  if (typeof module === 'object' && module.exports) module.exports = api;\n  else root.KB_EXPANSION_CALCULATORS = api;\n})(typeof globalThis !== 'undefined' ? globalThis : this, function () {\n  const positive = (value, label) => { if (!Number.isFinite(value) || !(value > 0)) throw new Error(label + ' legyen nagyobb nullánál.'); return value; };\n  const nonNegative = (value, label) => { if (!Number.isFinite(value) || value < 0) throw new Error(label + ' nem lehet negatív.'); return value; };\n\n  function ruleOfThree({ mode, a, b, c }) {\n    positive(a, 'Az A érték'); positive(c, 'A C érték');\n    if (!Number.isFinite(b)) throw new Error('A B érték legyen érvényes szám.');\n    return { x: mode === 'inverse' ? (a * b) / c : (b * c) / a, mode: mode === 'inverse' ? 'inverse' : 'direct' };\n  }\n\n  function geometricMean(values) {\n    if (!Array.isArray(values) || !values.length) throw new Error('Adj meg legalább egy pozitív számot.');\n    values.forEach((value) => positive(value, 'Minden érték'));\n    return { mean: Math.exp(values.reduce((sum, value) => sum + Math.log(value), 0) / values.length), count: values.length };\n  }\n\n  function tileAdhesive({ area, consumption, waste, bag }) {\n    positive(area, 'A felület'); positive(consumption, 'A fajlagos fogyás'); nonNegative(waste, 'A ráhagyás'); positive(bag, 'A zsák tömege');\n    const net = area * consumption;\n    const total = net * (1 + waste / 100);\n    return { net, total, bags: Math.ceil(total / bag) };\n  }\n\n  function evCharge({ battery, start, target, loss, price, power }) {\n    positive(battery, 'Az akkukapacitás'); nonNegative(start, 'A kezdő töltöttség'); positive(target, 'A cél töltöttség'); nonNegative(loss, 'A veszteség'); nonNegative(price, 'Az energiaár'); positive(power, 'A töltési teljesítmény');\n    if (start > 100 || target > 100) throw new Error('A töltöttségi szint 0 és 100% között legyen.');\n    if (target <= start) throw new Error('A cél töltöttség legyen nagyobb a kezdő töltöttségnél.');\n    if (loss >= 100) throw new Error('A töltési veszteség legyen 100% alatt.');\n    const batteryEnergy = battery * (target - start) / 100;\n    const gridEnergy = batteryEnergy / (1 - loss / 100);\n    return { batteryEnergy, gridEnergy, cost: gridEnergy * price, hours: gridEnergy / power };\n  }\n\n  function runningPace(input) {\n    positive(input.distance, 'A távolság');\n    if (input.mode === 'finish') {\n      nonNegative(input.paceMinutes, 'A tempó perc része'); nonNegative(input.paceSeconds, 'A tempó másodperc része');\n      if (input.paceSeconds >= 60) throw new Error('A tempó másodperc része 0 és 59 között legyen.');\n      const paceSecondsPerKm = input.paceMinutes * 60 + input.paceSeconds;\n      positive(paceSecondsPerKm, 'A tempó');\n      return { paceSecondsPerKm, totalSeconds: paceSecondsPerKm * input.distance, speedKmh: 3600 / paceSecondsPerKm };\n    }\n    nonNegative(input.hours, 'Az óra'); nonNegative(input.minutes, 'A perc'); nonNegative(input.seconds, 'A másodperc');\n    if (input.seconds >= 60) throw new Error('A másodperc 0 és 59 között legyen.');\n    const totalSeconds = input.hours * 3600 + input.minutes * 60 + input.seconds;\n    positive(totalSeconds, 'A teljes idő');\n    const paceSecondsPerKm = totalSeconds / input.distance;\n    return { paceSecondsPerKm, totalSeconds, speedKmh: input.distance / (totalSeconds / 3600) };\n  }\n\n  return { ruleOfThree, geometricMean, tileAdhesive, evCharge, runningPace };\n});\n`);
}

function writeRuntime() {
  write('js/expansion-calculators.js', `'use strict';\n(function () {\n  const core = window.KB_EXPANSION_CALCULATORS;\n  const main = document.querySelector('[data-expansion-calc]');\n  if (!core || !main) return;\n  const slug = main.dataset.expansionCalc;\n  const form = main.querySelector('[data-expansion-form]');\n  const output = main.querySelector('[data-expansion-results]');\n  if (!form || !output) return;\n\n  const n = (name) => {\n    const raw = String(new FormData(form).get(name) ?? '').trim().replace(/\\s+/g, '').replace(',', '.');\n    const value = Number(raw);\n    if (!Number.isFinite(value)) throw new Error('Minden szükséges mezőben adj meg érvényes számot.');\n    return value;\n  };\n  const hu = (value, digits = 2) => new Intl.NumberFormat('hu-HU', { maximumFractionDigits: digits }).format(value);\n  const money = (value) => new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(value) + ' Ft';\n  const timeText = (seconds) => {\n    const total = Math.max(0, Math.round(seconds));\n    const h = Math.floor(total / 3600);\n    const m = Math.floor((total % 3600) / 60);\n    const s = total % 60;\n    return (h ? h + ':' : '') + String(m).padStart(h ? 2 : 1, '0') + ':' + String(s).padStart(2, '0');\n  };\n  const paceText = (secondsPerKm) => { const total = Math.round(secondsPerKm); return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0') + ' perc/km'; };\n  const parsePositiveList = () => {\n    const raw = String(new FormData(form).get('values') ?? '').trim();\n    if (!raw) throw new Error('Adj meg legalább egy pozitív számot.');\n    const normalized = raw.replace(/(\\d),(\\d)/g, '$1.$2');\n    const values = normalized.split(/[;\\s]+/).filter(Boolean).map(Number);\n    if (!values.length || values.some((value) => !Number.isFinite(value) || value <= 0)) throw new Error('Csak pozitív, érvényes számokat adj meg.');\n    return values;\n  };\n\n  const calculators = {\n    'harmasszabaly-kalkulator': () => {\n      const data = new FormData(form);\n      const result = core.ruleOfThree({ mode: data.get('mode'), a: n('a'), b: n('b'), c: n('c') });\n      return [['Ismeretlen X', hu(result.x, 6)], ['Típus', result.mode === 'inverse' ? 'Fordított arányosság' : 'Egyenes arányosság']];\n    },\n    'mertani-atlag-kalkulator': () => {\n      const result = core.geometricMean(parsePositiveList());\n      return [['Mértani átlag', hu(result.mean, 8)], ['Elemszám', String(result.count)]];\n    },\n    'csemperagaszto-kalkulator': () => {\n      const result = core.tileAdhesive({ area: n('area'), consumption: n('consumption'), waste: n('waste'), bag: n('bag') });\n      return [['Alap anyagigény', hu(result.net, 1) + ' kg'], ['Ráhagyással', hu(result.total, 1) + ' kg'], ['Szükséges zsák', result.bags + ' db']];\n    },\n    'elektromos-auto-toltesi-koltseg-kalkulator': () => {\n      const result = core.evCharge({ battery: n('battery'), start: n('startSoc'), target: n('targetSoc'), loss: n('loss'), price: n('price'), power: n('power') });\n      return [['Akkuba kerülő energia', hu(result.batteryEnergy, 2) + ' kWh'], ['Hálózatból felvett energia', hu(result.gridEnergy, 2) + ' kWh'], ['Becsült töltési költség', money(result.cost)], ['Ideális töltési idő', hu(result.hours, 2) + ' óra']];\n    },\n    'futotempo-kalkulator': () => {\n      const data = new FormData(form);\n      const mode = data.get('mode');\n      const input = { mode, distance: n('distance'), hours: 0, minutes: 0, seconds: 0, paceMinutes: 0, paceSeconds: 0 };\n      if (mode === 'finish') { input.paceMinutes = n('paceMinutes'); input.paceSeconds = n('paceSeconds'); }\n      else { input.hours = n('hours'); input.minutes = n('minutes'); input.seconds = n('seconds'); }\n      const result = core.runningPace(input);\n      return mode === 'finish'\n        ? [['Becsült célidő', timeText(result.totalSeconds)], ['Tempó', paceText(result.paceSecondsPerKm)], ['Átlagsebesség', hu(result.speedKmh, 2) + ' km/h']]\n        : [['Átlagtempó', paceText(result.paceSecondsPerKm)], ['Átlagsebesség', hu(result.speedKmh, 2) + ' km/h'], ['Teljes idő', timeText(result.totalSeconds)]];\n    },\n  };\n\n  const render = (rows) => { output.innerHTML = '<dl>' + rows.map(([label, value]) => '<div class="expansion-result-row"><dt>' + label + '</dt><dd>' + value + '</dd></div>').join('') + '</dl>'; };\n  const run = () => { try { render(calculators[slug]()); } catch (error) { output.textContent = error.message || 'A számítás nem végezhető el a megadott adatokkal.'; } };\n  const togglePaceMode = () => {\n    if (slug !== 'futotempo-kalkulator') return;\n    const finish = form.elements.mode.value === 'finish';\n    form.querySelectorAll('[data-time-field]').forEach((el) => { el.hidden = finish; });\n    form.querySelectorAll('[data-pace-field]').forEach((el) => { el.hidden = !finish; });\n  };\n  form.addEventListener('submit', (event) => { event.preventDefault(); run(); });\n  form.addEventListener('change', togglePaceMode);\n  togglePaceMode();\n})();\n`);
}

function writeAudit() {
  write('scripts/expansion-calculators-audit.js', `const fs = require('fs');\nconst path = require('path');\nconst root = path.resolve(__dirname, '..');\nconst core = require('../js/expansion-calculators-core.js');\nconst expected = ${JSON.stringify(calculators.map((c) => c.slug), null, 2)};\nconst runtime = fs.readFileSync(path.join(root, 'js/expansion-calculators.js'), 'utf8');\nconst data = fs.readFileSync(path.join(root, 'js/site-data.js'), 'utf8');\nconst taxonomy = fs.readFileSync(path.join(root, 'scripts/category-taxonomy-config.js'), 'utf8');\nconst quality = fs.readFileSync(path.join(root, 'js/expansion-quality.js'), 'utf8');\nconst errors = [];\nconst near = (actual, expectedValue, epsilon = 1e-9) => Math.abs(actual - expectedValue) <= epsilon;\nfor (const slug of expected) {\n  const htmlPath = path.join(root, 'kalkulatorok', slug + '.html');\n  if (!fs.existsSync(htmlPath)) { errors.push(slug + ': hiányzó HTML'); continue; }\n  const html = fs.readFileSync(htmlPath, 'utf8');\n  if (!html.includes('data-expansion-calc="' + slug + '"')) errors.push(slug + ': hiányzó kalkulátor azonosító');\n  if (!html.includes('class="card card-calculator')) errors.push(slug + ': hiányzó kalkulátorkártya');\n  if (!html.includes('<link rel="canonical" href="https://kalkulatorbazis.hu/kalkulatorok/' + slug + '">')) errors.push(slug + ': hibás canonical');\n  if (!runtime.includes("'" + slug + "'")) errors.push(slug + ': hiányzó runtime logika');\n  if (!data.includes('kalkulatorok/' + slug + '.html')) errors.push(slug + ': hiányzik site-data.js-ből');\n  if (!taxonomy.includes('kalkulatorok/' + slug + '.html')) errors.push(slug + ': hiányzik a taxonómiából');\n  if (!quality.includes('"' + slug + '"')) errors.push(slug + ': hiányzik a quality registryből');\n}\nconst direct = core.ruleOfThree({ mode: 'direct', a: 4, b: 10, c: 6 });\nif (!near(direct.x, 15)) errors.push('hármasszabály: 4:10 = 6:x referencia hibás');\nconst inverse = core.ruleOfThree({ mode: 'inverse', a: 4, b: 6, c: 8 });\nif (!near(inverse.x, 3)) errors.push('hármasszabály: fordított referencia hibás');\nconst geometric = core.geometricMean([1, 4]);\nif (!near(geometric.mean, 2)) errors.push('mértani átlag: [1,4] referencia hibás');\nconst adhesive = core.tileAdhesive({ area: 24, consumption: 4, waste: 10, bag: 25 });\nif (!near(adhesive.total, 105.6) || adhesive.bags !== 5) errors.push('csemperagasztó: referencia hibás');\nconst ev = core.evCharge({ battery: 64, start: 20, target: 80, loss: 10, price: 70, power: 11 });\nif (!near(ev.batteryEnergy, 38.4) || !near(ev.gridEnergy, 42.666666666666664) || !near(ev.cost, 2986.6666666666665)) errors.push('EV töltés: referencia hibás');\nconst pace = core.runningPace({ mode: 'pace', distance: 5, hours: 0, minutes: 30, seconds: 0, paceMinutes: 0, paceSeconds: 0 });\nif (!near(pace.paceSecondsPerKm, 360) || !near(pace.speedKmh, 10)) errors.push('futótempó: 5 km / 30 perc referencia hibás');\nconst finish = core.runningPace({ mode: 'finish', distance: 10, hours: 0, minutes: 0, seconds: 0, paceMinutes: 6, paceSeconds: 0 });\nif (!near(finish.totalSeconds, 3600)) errors.push('futótempó: 10 km @ 6:00 célidő referencia hibás');\nif (errors.length) { console.error('Expansion kalkulátor audit hibák:'); errors.forEach((e) => console.error('- ' + e)); process.exit(1); }\nconsole.log('Expansion kalkulátor audit OK: ' + expected.length + ' új kalkulátor + referencia számítások ellenőrizve.');\n`);
}

function patchAllCalculatorsPage() {
  const file = 'kalkulatorok.html';
  let html = read(file);
  for (const c of calculators) {
    const sourceUrl = `kalkulatorok/${c.slug}.html`;
    const publicUrl = `kalkulatorok/${c.slug}`;
    if (html.includes(`href="${publicUrl}"`) || html.includes(`href="${sourceUrl}"`)) continue;
    const heading = categoryHeadings[c.category];
    const headingNeedle = `<h2 class="section-heading">${heading}</h2>`;
    const headingIndex = html.indexOf(headingNeedle);
    if (headingIndex === -1) throw new Error(`Category heading not found in kalkulatorok.html: ${heading}`);
    const gridStart = html.indexOf('<div class="category-grid">', headingIndex);
    const gridEnd = html.indexOf('</div>', gridStart);
    if (gridStart === -1 || gridEnd === -1) throw new Error(`Category grid not found for ${heading}`);
    const card = `\n      <a class="card card-link calculator-card ${c.cardClass}" href="${publicUrl}">\n        <h3>${c.title}</h3>\n        <p>${c.description}</p>\n      </a>\n`;
    html = html.slice(0, gridEnd) + card + html.slice(gridEnd);
  }
  write(file, html);
}

patchSiteData();
patchTaxonomyConfig();
patchQualityAudit();
patchPackageJson();
writeExpansionQuality();
writeCss();
writeCore();
writeRuntime();
writeAudit();
writePages();
patchAllCalculatorsPage();

console.log(`Calculator expansion batch 1 prepared: ${calculators.length} calculators.`);

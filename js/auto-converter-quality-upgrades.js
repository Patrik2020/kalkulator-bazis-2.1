(() => {
  'use strict';

  const slug = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/i, '').toLowerCase();
  const root = window.KB_PROJECT_ROOT || '';
  const supported = new Set([
    'auto','atvaltok',
    'auto-kalkulator','uzemanyag-koltseg-kalkulator','auto-fogyasztas-kalkulator','hatotav-kalkulator',
    'eves-auto-koltseg-kalkulator','auto-ertekvesztes-kalkulator','kilometerdij-kalkulator','co2-kibocsatas-kalkulator',
    'tankolas-kalkulator','gumi-meret-kalkulator','autopalyadij-kalkulator','utazasi-ido-kalkulator',
    'homerseklet-atvalto-kalkulator','hosszusag-atvalto-kalkulator','tomeg-atvalto-kalkulator','terulet-atvalto-kalkulator',
    'terfogat-atvalto-kalkulator','ido-atvalto-kalkulator','sebesseg-atvalto-kalkulator','adatmeret-atvalto-kalkulator',
    'deviza-atvalto-kalkulator','energia-atvalto-kalkulator','nyomas-atvalto-kalkulator','teljesitmeny-atvalto-kalkulator'
  ]);
  if (!supported.has(slug)) return;

  const main = document.querySelector('main');
  if (!main || document.querySelector('[data-auto-converter-quality="2026-08"]')) return;

  const nf = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 });
  const df = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 2 });
  const parse = (value) => {
    const parsed = Number(String(value ?? '').replace(/\s/g, '').replace(',', '.').replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const money = (value) => Number.isFinite(value) ? `${nf.format(Math.round(value))} Ft` : '–';
  const number = (value, digits = 2) => Number.isFinite(value)
    ? new Intl.NumberFormat('hu-HU', { maximumFractionDigits: digits }).format(value)
    : '–';
  const link = (href, label) => `<a href="${href}">${label}</a>`;

  const section = (className, html) => {
    const node = document.createElement('section');
    node.className = `auto-converter-quality ${className}`;
    node.dataset.autoConverterQuality = '2026-08';
    node.innerHTML = html;
    main.appendChild(node);
    return node;
  };

  const cards = (items) => `<div class="acq-grid">${items.map(([title, body]) => `<article><h3>${title}</h3><p>${body}</p></article>`).join('')}</div>`;
  const note = (title, body) => `<div class="acq-note"><strong>${title}</strong><p>${body}</p></div>`;
  const metrics = (items) => `<div class="acq-metrics">${items.map(([label, value, key]) => `<div><span>${label}</span><strong${key ? ` data-acq="${key}"` : ''}>${value}</strong></div>`).join('')}</div>`;
  const input = (label, key, value, extra = '') => `<label>${label}<input data-acq-input="${key}" value="${value}" inputmode="decimal" ${extra}></label>`;
  const select = (label, key, options) => `<label>${label}<select data-acq-input="${key}">${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label>`;
  const bind = (node, fn) => {
    node.querySelectorAll('[data-acq-input]').forEach((el) => {
      el.addEventListener('input', fn);
      el.addEventListener('change', fn);
    });
    fn();
  };
  const val = (node, key) => parse(node.querySelector(`[data-acq-input="${key}"]`)?.value);
  const set = (node, key, value) => {
    const target = node.querySelector(`[data-acq="${key}"]`);
    if (target) target.textContent = value;
  };

  const renderAutoHub = () => {
    section('acq-hub', `
      <p class="acq-kicker">Autós döntési útvonal</p>
      <h2>Ne egyetlen tankolásból próbáld megérteni az autó teljes költségét</h2>
      <p>Egy út költsége, az éves fenntartás és egy autó birtoklási költsége három külön kérdés. A kategória ezért az út előtti becsléstől a tankolás utáni ellenőrzésen át az éves teljes költségig vezet.</p>
      ${cards([
        ['Út előtt','Üzemanyag, hatótáv, útdíj és menetidő: itt az a cél, hogy legyen reális terv és tartalék.'],
        ['Tankolás után','A valós fogyasztást több tankolásból érdemes trendként követni, nem egyetlen mérésből.'],
        ['Éves szinten','Biztosítás, szerviz, gumi, parkolás és értékvesztés együtt mutatja meg a teljes terhet.'],
        ['Autóválasztáskor','Két autót azonos futás és azonos költségkör mellett hasonlíts össze, különben félrevezető az eredmény.']
      ])}
      ${note('Minőségi elv','Az autós kalkulátorok nem ugyanazt a „km × fogyasztás × ár” képletet ismétlik. Mindegyik más döntési hibát vagy költségréteget tesz láthatóvá.')}
    `);
  };

  const renderTripCost = () => {
    const node = section('acq-interactive', `
      <p class="acq-kicker">Marginalis vagy teljes autóköltség?</p>
      <h2>Ugyanaz az út kétféleképpen is árazható</h2>
      <p>Ha azt kérdezed, mennyivel kerül többe, hogy ma elindulsz, a változó költség a fontos. Ha azt kérdezed, mennyibe kerül neked valójában az autózás, a fix és évesített költségeket is fel kell osztani a megtett kilométerekre.</p>
      <div class="acq-form">${input('Út hossza (km)','km','200')}${input('Fogyasztás (l/100 km)','cons','6.5')}${input('Üzemanyagár (Ft/l)','fuel','620')}${input('Éves nem üzemanyagköltség (Ft)','fixed','900000')}${input('Éves futás (km)','annual','15000')}</div>
      ${metrics([['Csak üzemanyag','–','fuelcost'],['Fix költség ráosztva','–','allocated'],['Teljes útiköltség','–','full'],['Teljes Ft/km','–','perkm']])}
      ${note('Mire jó ez?','Utastársak közti elszámolásnál előre tisztázzátok, csak a plusz útiköltséget osztjátok-e, vagy a teljes autóhasználatból is szeretnétek részt számolni.')}
    `);
    bind(node, () => {
      const km=val(node,'km'), cons=val(node,'cons'), fuel=val(node,'fuel'), fixed=val(node,'fixed'), annual=val(node,'annual');
      const fuelCost=km*cons/100*fuel;
      const allocated=annual>0 ? fixed/annual*km : 0;
      const full=fuelCost+allocated;
      set(node,'fuelcost',money(fuelCost)); set(node,'allocated',money(allocated)); set(node,'full',money(full)); set(node,'perkm',km>0?`${number(full/km,1)} Ft/km`:'–');
    });
  };

  const renderFuelCost = () => {
    const node = section('acq-interactive', `
      <p class="acq-kicker">Fogyasztási bizonytalanság</p><h2>Mennyit változik az út ára, ha a valós fogyasztás eltér a tervtől?</h2>
      <p>Autópálya, város, tetőbox, klíma, terhelés és forgalom miatt a tényleges fogyasztás eltérhet a megszokott átlagtól. Itt egy alsó–közép–felső forgatókönyvet látsz ugyanarra az útra.</p>
      <div class="acq-form">${input('Távolság (km)','km','500')}${input('Tervezett fogyasztás','cons','6.5')}${input('Eltérés ± (%)','swing','15')}${input('Üzemanyagár (Ft/l)','price','620')}</div>
      ${metrics([['Kedvező forgatókönyv','–','low'],['Alapforgatókönyv','–','mid'],['Kedvezőtlen forgatókönyv','–','high'],['Sáv szélessége','–','range']])}
    `);
    bind(node,()=>{const km=val(node,'km'),c=val(node,'cons'),s=val(node,'swing')/100,p=val(node,'price');const f=(x)=>km*x/100*p;const low=f(c*(1-s)),mid=f(c),high=f(c*(1+s));set(node,'low',money(low));set(node,'mid',money(mid));set(node,'high',money(high));set(node,'range',money(high-low));});
  };

  const renderConsumption = () => {
    const node = section('acq-interactive', `
      <p class="acq-kicker">Több tankolásos átlag</p><h2>A fogyasztási átlagot ne a százalékok átlagából számold</h2>
      <p>Különböző hosszúságú etapoknál a helyes összesített fogyasztás az összes elhasznált liter és az összes megtett kilométer arányából jön ki.</p>
      <div class="acq-form">${input('1. etap km','km1','420')}${input('1. etap liter','l1','28')}${input('2. etap km','km2','610')}${input('2. etap liter','l2','37')}${input('3. etap km','km3','300')}${input('3. etap liter','l3','22')}</div>
      ${metrics([['Összes út','–','km'],['Összes üzemanyag','–','liters'],['Súlyozott átlagfogyasztás','–','avg']])}
      ${note('Miért jobb?','A hosszabb etap automatikusan nagyobb súlyt kap. Így egy rövid, városi tankolás nem torzítja ugyanannyira az átlagot, mint egy több száz kilométeres szakasz.')}
    `);
    bind(node,()=>{const km=val(node,'km1')+val(node,'km2')+val(node,'km3');const liters=val(node,'l1')+val(node,'l2')+val(node,'l3');set(node,'km',`${number(km,0)} km`);set(node,'liters',`${number(liters,1)} l`);set(node,'avg',km>0?`${number(liters/km*100,2)} l/100 km`:'–');});
  };

  const renderRange = () => {
    const node = section('acq-interactive', `
      <p class="acq-kicker">Hatótáv-tartalék</p><h2>A matematikai maximum nem célállomás</h2>
      <p>A kijelzett vagy számolt hatótáv optimális becslés. Tervezéshez érdemes külön tartalékot hagyni forgalomra, kerülőre, hidegre vagy váratlan fogyasztásnövekedésre.</p>
      <div class="acq-form">${input('Felhasználható üzemanyag (l)','liters','35')}${input('Várható fogyasztás (l/100 km)','cons','6.5')}${input('Biztonsági tartalék (%)','reserve','15')}</div>
      ${metrics([['Matematikai maximum','–','max'],['Tervezhető hatótáv','–','safe'],['Meghagyott tartalék','–','buffer']])}
    `);
    bind(node,()=>{const l=val(node,'liters'),c=val(node,'cons'),r=val(node,'reserve')/100;const max=c>0?l/c*100:0;const safe=max*(1-r);set(node,'max',`${number(max,0)} km`);set(node,'safe',`${number(safe,0)} km`);set(node,'buffer',`${number(max-safe,0)} km`);});
  };

  const renderAnnualCost = () => section('acq-static', `
    <p class="acq-kicker">Cashflow kontra gazdasági költség</p><h2>Az éves autóköltségben nem minden tétel ugyanúgy „fáj” a bankszámlán</h2>
    ${cards([
      ['Azonnali cashflow','Tankolás, parkolás, biztosítás és szerviz tényleges pénzkiadás az adott évben.'],
      ['Időszakos nagy kiadás','Gumi, nagy szerviz vagy műszaki vizsga ritkán jelentkezik, ezért érdemes havi céltartalékot képezni rá.'],
      ['Nem cashflow, mégis költség','Az értékvesztés nem számla, de az autó vagyonértékének csökkenése miatt a teljes birtoklási költség része.'],
      ['Finanszírozás','Hitel vagy lízing esetén a kamat és egyéb díjak külön költségréteget jelentenek.']
    ])}
    ${note('Használati tipp','Készíts két nézetet: „mennyi pénzt kell félretennem idén?” és „mennyibe kerül nekem gazdaságilag egy év autózás?”. A két szám nem feltétlenül azonos.')}
  `);

  const renderDepreciation = () => section('acq-static', `
    <p class="acq-kicker">Értékvesztés értelmezése</p><h2>A százalék nem lineáris forintveszteség</h2>
    ${cards([
      ['Csökkenő bázis','Évi 10% értékvesztésnél minden évben az aktuális, már alacsonyabb érték 10%-a vész el.'],
      ['Piaci ugrások','Modellfrissítés, kereslet, sérülés, futásteljesítmény és szerviztörténet miatt a valós ár nem sima görbe.'],
      ['Nominális kontra reálérték','Az eladási ár forintban akár stabilnak is tűnhet, miközben az infláció miatt a vásárlóereje csökken.'],
      ['Eladási költség','Kereskedői beszámítás, hirdetés, javítás vagy felkészítés tovább csökkentheti a ténylegesen realizált összeget.']
    ])}
  `);

  const renderKmCost = () => section('acq-static', `
    <p class="acq-kicker">Ft/km háromféleképpen</p><h2>Nem mindegy, mit nevezel kilométerköltségnek</h2>
    ${cards([
      ['Üzemanyag Ft/km','Csak a megtett út közvetlen üzemanyagköltsége. Rövid döntéshez hasznos, teljes költségnek kevés.'],
      ['Változó Ft/km','Üzemanyag mellett kopó alkatrész, gumi és futással arányos szerviz is ide sorolható.'],
      ['Teljes Ft/km','Az éves fix költség és értékvesztés is ráosztódik a futásra. Kevés kilométernél ezért meglepően magas lehet.'],
      ['Határköltség','Ha az autó már amúgy is megvan, egy plusz út döntésénél nem biztos, hogy minden éves fix tételt újra figyelembe akarsz venni.']
    ])}
  `);

  const renderCO2 = () => section('acq-static', `
    <p class="acq-kicker">Rendszerhatár</p><h2>A CO₂-szám csak akkor összehasonlítható, ha ugyanazt számolod bele</h2>
    ${cards([
      ['Kipufogó / közvetlen','A jármű használata közben közvetlenül kibocsátott CO₂. Elektromos autónál helyben ez nulla.'],
      ['Energia-előállítás','Üzemanyag finomítása vagy villamosenergia-termelés hozzáadható, de az alkalmazott tényező forrás- és évfüggő.'],
      ['Járműgyártás','Karosszéria, akkumulátor és gyártási energia külön életciklus-réteg; a fő útikalkulációban ezt nem szabad véletlenül összekeverni a használati kibocsátással.'],
      ['Funkcionális egység','Autók összevetésénél ugyanarra a kilométerre, azonos utasszámra és azonos rendszerhatárra vetítsd az eredményt.']
    ])}
    ${note('Fontos','Az oldal becslési modell. A szerkeszthető kibocsátási tényezők miatt mindig jegyezd fel, milyen forrást és milyen évet használtál.')}
  `);

  const renderFuelBudget = () => {
    const node = section('acq-interactive', `
      <p class="acq-kicker">Tankolási keret</p><h2>Árengedmény literenként: mennyit számít a teljes tankolásnál?</h2>
      <div class="acq-form">${input('Tankolási keret (Ft)','budget','25000')}${input('Listaár (Ft/l)','price','620')}${input('Kedvezmény (Ft/l)','discount','20')}</div>
      ${metrics([['Liter kedvezmény nélkül','–','base'],['Liter kedvezménnyel','–','discounted'],['Plusz üzemanyag','–','extra'],['Megtakarítás azonos liternél','–','saving']])}
      ${note('Ne csak a literárat nézd','Ha a kedvezményért kerülőt teszel, a plusz kilométer üzemanyag- és időigénye csökkentheti vagy el is viheti az előnyt.')}
    `);
    bind(node,()=>{const b=val(node,'budget'),p=val(node,'price'),d=val(node,'discount');const p2=Math.max(0.01,p-d);const base=b/p,disc=b/p2;set(node,'base',`${number(base,2)} l`);set(node,'discounted',`${number(disc,2)} l`);set(node,'extra',`${number(disc-base,2)} l`);set(node,'saving',`${money(base*d)}`);});
  };

  const renderTyre = () => section('acq-static', `
    <p class="acq-kicker">Geometria után jön a kompatibilitás</p><h2>A hasonló külső átmérő még nem jelenti azt, hogy a kerék megfelelő</h2>
    ${cards([
      ['Felni szélessége és ET','A gumi és kerék helyzete a futóműhöz és sárvédőhöz képest nem derül ki pusztán az átmérőből.'],
      ['Terhelési és sebességindex','A geometriailag hasonló abroncs terhelhetősége vagy sebességbesorolása eltérhet az előírttól.'],
      ['Kerékjárati hely','Kormányelfordításnál, rugózásnál és terhelésnél is maradnia kell megfelelő helynek.'],
      ['Gyártói engedélyezés','A jármű kézikönyve, adattáblája és jóváhagyott méretei elsődlegesek; a kalkulátor csak geometriai összevetést ad.']
    ])}
  `);

  const renderToll = () => {
    const node = section('acq-interactive', `
      <p class="acq-kicker">Matricaválasztás nullszaldó</p><h2>Hány útnál éri meg a drágább jogosultság?</h2>
      <p>Aktuális díjat nem építünk be fixen. Írd be a most érvényes árakat, így a kalkulátor nem avul el egy díjváltozásnál.</p>
      <div class="acq-form">${input('Rövid időtartamú matrica ára (Ft)','short','6600')}${input('Hosszabb matrica ára (Ft)','long','10700')}${input('Egy rövid matrica által lefedett utak száma','covered','1')}</div>
      ${metrics([['Nullszaldós rövid matrica darabszám','–','break'],['E fölött a hosszabb lehet olcsóbb','–','text']])}
      ${note('Ellenőrizd az érvényességet','A területi hatály, járműkategória, érvényességi idő és vásárlási szabályok mindig az aktuális hivatalos útdíj-tájékoztató szerint értelmezendők.')}
    `);
    bind(node,()=>{const s=val(node,'short'),l=val(node,'long'),c=Math.max(1,val(node,'covered'));const n=s>0?Math.ceil(l/s):0;set(node,'break',`${n} db rövid jogosultság`);set(node,'text',`${n*c} lefedett út környékén már érdemes újraszámolni`);});
  };

  const renderTravelTime = () => {
    const node = section('acq-interactive', `
      <p class="acq-kicker">Sebesség és időnyereség</p><h2>A +10 km/h nem mindig ugyanannyi percet nyer</h2>
      <div class="acq-form">${input('Távolság (km)','km','200')}${input('Alap átlagsebesség (km/h)','speed','80')}${input('Gyorsabb átlag (km/h)','fast','90')}${input('Megállások összesen (perc)','stops','20')}</div>
      ${metrics([['Alap teljes idő','–','base'],['Gyorsabb forgatókönyv','–','fasttime'],['Időnyereség','–','saved']])}
      ${note('Átlagsebesség, nem tempomat','Település, forgalom, pihenő, torlódás és útviszony miatt az egész útra vonatkozó átlagsebesség jóval alacsonyabb lehet a pillanatnyi haladási sebességnél.')}
    `);
    const fmtMin=(m)=>`${Math.floor(m/60)} ó ${Math.round(m%60)} p`;
    bind(node,()=>{const km=val(node,'km'),s=val(node,'speed'),f=val(node,'fast'),st=val(node,'stops');const a=s>0?km/s*60+st:0,b=f>0?km/f*60+st:0;set(node,'base',fmtMin(a));set(node,'fasttime',fmtMin(b));set(node,'saved',`${number(Math.max(0,a-b),0)} perc`);});
  };

  const renderConvertersHub = () => section('acq-hub', `
    <p class="acq-kicker">Átváltási döntési útvonal</p><h2>Előbb azonosítsd a fizikai mennyiséget, csak utána az egységet</h2>
    ${cards([
      ['Lineáris mennyiségek','Hosszúság és tömeg: itt általában közvetlen váltószám működik.'],
      ['Négyzetes és köbös skála','Területnél a hosszváltó négyzete, térfogatnál köbe számít. Ez a leggyakoribb nagyságrendi hiba.'],
      ['Eltolást is tartalmazó skála','Hőmérsékletnél Celsius és Fahrenheit között nem elég egy szorzó; a skálák nullpontja is eltér.'],
      ['Fogalmilag eltérő egységek','Energia és teljesítmény, adatméret és adatsebesség, tömeg és erő nem váltható át egymásba plusz információ nélkül.']
    ])}
    ${note('Minőségi elv','Az átváltó oldalakon nem csak a váltószámot adjuk meg: minden oldal azt az egy tipikus félreértést magyarázza, amely az adott mennyiségnél a legkönnyebben hibához vezet.')}
  `);

  const renderTemperature = () => section('acq-static', `
    <p class="acq-kicker">Hőmérséklet kontra hőmérséklet-különbség</p><h2>10 °C változás nem ugyanaz, mint 10 °C abszolút érték</h2>
    ${cards([
      ['Abszolút érték','0 °C = 32 °F, tehát a Celsius–Fahrenheit váltás eltolást is tartalmaz.'],
      ['Különbség','1 °C hőmérséklet-változás 1,8 °F változásnak felel meg; itt nincs +32 eltolás.'],
      ['Kelvin','A Kelvin és Celsius lépésköze azonos, de a nullpont más. 0 K az abszolút nulla.'],
      ['Műszaki számítás','Termodinamikai képleteknél gyakran abszolút hőmérséklet kell, ezért Celsius közvetlen behelyettesítése hibás lehet.']
    ])}
  `);

  const renderLength = () => section('acq-static', `
    <p class="acq-kicker">Pontosság és kerekítés</p><h2>Az átváltó nem teheti pontosabbá a mérésedet</h2>
    ${cards([
      ['Mérési pontosság','Ha 2,3 m-t mértél tizedméteres pontossággal, az átváltott 2300 mm nem jelent valódi milliméteres pontosságot.'],
      ['Tizedesjegy kontra pontosság','A sok kijelzett számjegy matematikai részletesség, nem automatikusan jobb mérés.'],
      ['Belső számítás','Érdemes teljes pontossággal számolni, és csak a végső eredményt kerekíteni.'],
      ['Építési felhasználás','Anyagrendelésnél a mérési tűrés és a kivitelezési ráhagyás külön kérdés a puszta egységváltástól.']
    ])}
  `);

  const renderMass = () => section('acq-static', `
    <p class="acq-kicker">Tömeg nem egyenlő súlyerővel</p><h2>A kilogramm és a newton nem ugyanannak a mennyiségnek két egysége</h2>
    ${cards([
      ['Tömeg','kg, g, lb és oz tömegegységek. A test anyagmennyiségéhez kapcsolódnak.'],
      ['Súlyerő','A newton erőegység. A súlyerő a gravitációs gyorsulástól is függ.'],
      ['Konyhai használat','Recepteknél a „súly” hétköznapi szóként gyakran tömeget jelent, ezért grammra vagy kilogrammra váltunk.'],
      ['Műszaki használat','Terhelésnél ellenőrizd, hogy a dokumentáció tömeget, erőt vagy megengedett terhelést ad-e meg.']
    ])}
  `);

  const renderArea = () => {
    const node=section('acq-interactive',`
      <p class="acq-kicker">Négyzetes skála</p><h2>Miért lesz 1 m = 100 cm mellett 1 m² = 10 000 cm²?</h2>
      <div class="acq-form">${input('Négyzet oldala (m)','side','3')}</div>
      ${metrics([['Oldal centiméterben','–','cm'],['Terület m²-ben','–','m2'],['Terület cm²-ben','–','cm2']])}
      ${note('A lényeg','A hosszváltó kétszer szerepel: 100 × 100 = 10 000. Ezért területnél nem szabad egyszerűen százszoros értékkel számolni.')}
    `);bind(node,()=>{const s=val(node,'side');set(node,'cm',`${number(s*100,0)} cm`);set(node,'m2',`${number(s*s,2)} m²`);set(node,'cm2',`${number(s*s*10000,0)} cm²`);});
  };

  const renderVolume = () => {
    const node=section('acq-interactive',`
      <p class="acq-kicker">Köbös skála</p><h2>Egyetlen tízszeres hosszváltó ezerszeres térfogatot okozhat</h2>
      <div class="acq-form">${input('Kocka éle (m)','side','1')}</div>
      ${metrics([['Él centiméterben','–','cm'],['Térfogat m³-ben','–','m3'],['Térfogat cm³-ben','–','cm3'],['Literben','–','liters']])}
      ${note('Gyakori hiba','1 m³ nem 100 liter, hanem 1000 liter. A térfogat három dimenzió miatt a hosszváltó köbével változik.')}
    `);bind(node,()=>{const s=val(node,'side');const m3=s**3;set(node,'cm',`${number(s*100,0)} cm`);set(node,'m3',`${number(m3,4)} m³`);set(node,'cm3',`${number(m3*1e6,0)} cm³`);set(node,'liters',`${number(m3*1000,2)} l`);});
  };

  const renderTime = () => section('acq-static', `
    <p class="acq-kicker">Időtartam kontra naptári idő</p><h2>30 nap nem automatikusan 1 hónap</h2>
    ${cards([
      ['Időtartam','Másodperc, perc, óra és nap között fix váltószám használható.'],
      ['Naptári hónap','28, 29, 30 vagy 31 napos lehet; ezért pontos dátumszámításhoz nem elég fix napmennyiséget használni.'],
      ['Év','365 vagy szökőévben 366 nap. Hosszú időtávnál a naptár számít.'],
      ['Óraátállítás és időzóna','Két időpont közti valós eltérés helyi órában külön kérdés lehet; a sima időegység-átváltó csak időtartamot vált.']
    ])}
  `);

  const renderSpeed = () => {
    const node=section('acq-interactive',`
      <p class="acq-kicker">Sebesség mint arány</p><h2>Ugyanaz a sebesség másodpercenkénti távolságként</h2>
      <div class="acq-form">${input('Sebesség (km/h)','speed','50')}</div>
      ${metrics([['Méter másodpercenként','–','ms'],['1 másodperc alatt','–','one'],['2 másodperc alatt','–','two']])}
      ${note('Értelmezési plusz','Az m/s nem csak „másik egység”: segít érzékelni, mekkora távolságot tesz meg a jármű egyetlen másodperc alatt. Ez nem fékút-számítás.')}
    `);bind(node,()=>{const s=val(node,'speed')/3.6;set(node,'ms',`${number(s,2)} m/s`);set(node,'one',`${number(s,1)} m`);set(node,'two',`${number(s*2,1)} m`);});
  };

  const renderData = () => section('acq-static', `
    <p class="acq-kicker">Kapacitás kontra adatsebesség</p><h2>GB és Gbit/s nem közvetlenül ugyanaz</h2>
    ${cards([
      ['Byte és bit','1 byte = 8 bit. Fájlméretet gyakran byte-ban, hálózati sebességet bit/s-ban adnak meg.'],
      ['Decimális egységek','kB, MB, GB általában 1000-es lépésekre utalnak.'],
      ['Bináris egységek','KiB, MiB, GiB 1024-es lépések. A jelölés különbsége fontos.'],
      ['Letöltési idő','Fájlméretből és kapcsolatsebességből csak akkor számolható, ha ugyanarra az alapegységre hozod őket, és a hálózati overheadet is tudatosan kezeled.']
    ])}
  `);

  const renderCurrency = () => {
    const node=section('acq-interactive',`
      <p class="acq-kicker">Árfolyam kontra tényleges terhelés</p><h2>Mekkora különbséget okoz a spread vagy szolgáltatói felár?</h2>
      <div class="acq-form">${input('Átváltandó összeg','amount','1000')}${input('Középárfolyam','rate','390')}${input('Felár / spread (%)','spread','1.5')}${input('Fix díj (Ft)','fee','0')}</div>
      ${metrics([['Elméleti középárfolyamos összeg','–','mid'],['Felárral és díjjal','–','real'],['Különbség','–','delta']])}
      ${note('Miért fontos?','A devizaátváltó referenciaárfolyama nem feltétlenül azonos azzal az árfolyammal, amelyet bank, kártyatársaság vagy szolgáltató ténylegesen alkalmaz.')}
    `);bind(node,()=>{const a=val(node,'amount'),r=val(node,'rate'),s=val(node,'spread')/100,f=val(node,'fee');const mid=a*r,real=a*r*(1+s)+f;set(node,'mid',money(mid));set(node,'real',money(real));set(node,'delta',money(real-mid));});
  };

  const renderEnergy = () => section('acq-static', `
    <p class="acq-kicker">Energia nem teljesítmény</p><h2>A kWh mennyiség, a kW ütem</h2>
    ${cards([
      ['Energia (kWh, J)','Azt fejezi ki, összesen mennyi energiáról van szó.'],
      ['Teljesítmény (kW, W)','Azt fejezi ki, milyen gyorsan történik energiaátadás vagy -felhasználás.'],
      ['Kapcsolat','1 kW teljesítmény 1 órán át = 1 kWh energia. Idő nélkül a kettő nem váltható közvetlenül egymásba.'],
      ['Élelmiszerenergia','A címkén szereplő kcal energiaegység; a köznyelvi „Kalória” tipikusan kilokalóriát jelent.']
    ])}
  `);

  const renderPressure = () => section('acq-static', `
    <p class="acq-kicker">Abszolút kontra relatív nyomás</p><h2>Ugyanaz a bar szám nem mindig ugyanahhoz a nullponthoz tartozik</h2>
    ${cards([
      ['Abszolút nyomás','A vákuumhoz képest értelmezett nyomás.'],
      ['Túlnyomás / gauge','A környezeti légnyomáshoz képest mért érték; gumiabroncsnál gyakran ilyen értelmezés jelenik meg.'],
      ['Egységváltás','bar, Pa, kPa és psi matematikailag átváltható, de előbb tudnod kell, hogy az érték abszolút vagy relatív.'],
      ['Műszeradat','A mérőeszköz jelölése és dokumentációja elsődleges; az átváltó a nyomás típusát nem tudja kitalálni a számból.']
    ])}
  `);

  const renderPower = () => section('acq-static', `
    <p class="acq-kicker">Lóerőből is többféle van</p><h2>A „hp” és a metrikus „PS/LE” nem teljesen azonos</h2>
    ${cards([
      ['Watt és kilowatt','SI teljesítményegységek; 1 kW = 1000 W.'],
      ['Metrikus lóerő','A PS/LE definíciója más váltószámot használ, mint a mechanikai horsepower.'],
      ['Mechanikai hp','Angolszász műszaki anyagokban gyakori; kis, de valós eltérés van a metrikus lóerőhöz képest.'],
      ['Motoradat','Keréken mért és főtengelyen megadott teljesítmény szintén eltérő mérési pont lehet, ezt az egyszerű egységváltó nem korrigálja.']
    ])}
  `);

  const renderRatioFallback = () => section('acq-static', `
    <p class="acq-kicker">Átváltási ellenőrző</p><h2>Az egységváltás előtt nevezd meg a mennyiséget</h2>
    <p>Ha két egység nem ugyanahhoz a fizikai mennyiséghez tartozik, közvetlen váltás nincs. Ilyenkor további adat vagy képlet szükséges.</p>
  `);

  const renderers = {
    auto: renderAutoHub,
    atvaltok: renderConvertersHub,
    'auto-kalkulator': renderTripCost,
    'uzemanyag-koltseg-kalkulator': renderFuelCost,
    'auto-fogyasztas-kalkulator': renderConsumption,
    'hatotav-kalkulator': renderRange,
    'eves-auto-koltseg-kalkulator': renderAnnualCost,
    'auto-ertekvesztes-kalkulator': renderDepreciation,
    'kilometerdij-kalkulator': renderKmCost,
    'co2-kibocsatas-kalkulator': renderCO2,
    'tankolas-kalkulator': renderFuelBudget,
    'gumi-meret-kalkulator': renderTyre,
    'autopalyadij-kalkulator': renderToll,
    'utazasi-ido-kalkulator': renderTravelTime,
    'homerseklet-atvalto-kalkulator': renderTemperature,
    'hosszusag-atvalto-kalkulator': renderLength,
    'tomeg-atvalto-kalkulator': renderMass,
    'terulet-atvalto-kalkulator': renderArea,
    'terfogat-atvalto-kalkulator': renderVolume,
    'ido-atvalto-kalkulator': renderTime,
    'sebesseg-atvalto-kalkulator': renderSpeed,
    'adatmeret-atvalto-kalkulator': renderData,
    'deviza-atvalto-kalkulator': renderCurrency,
    'energia-atvalto-kalkulator': renderEnergy,
    'nyomas-atvalto-kalkulator': renderPressure,
    'teljesitmeny-atvalto-kalkulator': renderPower
  };

  (renderers[slug] || renderRatioFallback)();
})();
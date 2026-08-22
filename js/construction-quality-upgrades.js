(() => {
  'use strict';

  const slug = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/i, '').toLowerCase();
  const root = window.KB_PROJECT_ROOT || '';
  const main = document.querySelector('main');
  if (!main || document.querySelector('[data-construction-quality="2026-08"]')) return;

  const parse = (value) => {
    const normalized = String(value ?? '').replace(/\s/g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
    const number = Number.parseFloat(normalized);
    return Number.isFinite(number) ? number : 0;
  };
  const nf = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 2 });
  const whole = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 });
  const fmt = (value, unit = '') => Number.isFinite(value) ? `${nf.format(value)}${unit ? ` ${unit}` : ''}` : '–';
  const ceil = (value) => Math.ceil(value - 1e-10);

  const section = (className, html) => {
    const node = document.createElement('section');
    node.className = `construction-quality ${className}`;
    node.dataset.constructionQuality = '2026-08';
    node.innerHTML = html;
    main.appendChild(node);
    return node;
  };

  const bind = (ids, fn) => {
    ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => {
      el.addEventListener('input', fn);
      el.addEventListener('change', fn);
    });
    fn();
  };

  const renderHub = () => {
    section('construction-hub', `
      <p class="cq-kicker">Felújítási döntési útvonal</p>
      <h2>Ne anyagot számolj először, hanem rétegrendet és munkafázist</h2>
      <p>Az építőipari kalkulátorok akkor adnak igazán használható eredményt, ha a mérés, az aljzat vagy szerkezet állapota, a konkrét termék és a kivitelezési veszteség külön-külön is tisztázott. Ugyanaz a négyzetméter más anyagigényt jelenthet festésnél, burkolásnál, vakolásnál vagy hőszigetelésnél.</p>
      <div class="cq-path">
        <article><span>1</span><h3>Méret és geometria</h3><p>Terület, térfogat, nyílások és rétegvastagság. Itt dől el a matematikai minimum.</p><a href="${root}/kalkulatorok/beton-kalkulator">Térfogatot számolok →</a></article>
        <article><span>2</span><h3>Felület és alapállapot</h3><p>Festék, vakolat, tapéta és hőszigetelés fogyását az alapfelület is erősen befolyásolja.</p><a href="${root}/kalkulatorok/festek-kalkulator">Felületet tervezek →</a></article>
        <article><span>3</span><h3>Kiosztás és vágás</h3><p>Csempe, padló, térkő és tetőcserép esetén a veszteség nem puszta százalék: a geometria és a minta is számít.</p><a href="${root}/kalkulatorok/csempe-kalkulator">Burkolatot tervezek →</a></article>
        <article><span>4</span><h3>Rendszerben gondolkodás</h3><p>Gipszkarton, hőszigetelés és tetőfedés nem egyetlen termékből áll. A kiegészítők és csomópontok is részei a beszerzésnek.</p><a href="${root}/kalkulatorok/gipszkarton-kalkulator">Rendszert tervezek →</a></article>
      </div>
      <div class="cq-note"><strong>Minőségi elv:</strong> a kalkulátor eredménye rendelési kiindulópont, nem helyszíni felmérés. A végleges mennyiséget a konkrét gyártói adatlap, a kivitelezési terv és szükség esetén szakember ellenőrzése tegye véglegessé.</div>
    `);
  };

  const renderConcrete = () => {
    const node = section('concrete-order', `
      <p class="cq-kicker">Beton rendelési tervező</p>
      <h2>A nettó köbméter és a rendelendő mennyiség nem ugyanaz</h2>
      <p>A geometriai térfogat csak a kiindulópont. Egyenetlen altalaj, zsaluhiba, szivárgás és kiszolgálási maradék miatt a rendelési mennyiséghez célszerű külön tartalékot kezelni.</p>
      <div class="cq-form">
        <label>Rendelési tartalék
          <select data-cq="waste"><option value="5">5%</option><option value="8" selected>8%</option><option value="10">10%</option><option value="12">12%</option></select>
        </label>
        <label>Egy mixer hasznos kapacitása (m³)
          <input data-cq="truck" type="number" min="0.1" step="0.1" value="7" />
        </label>
      </div>
      <div class="cq-metrics">
        <div><span>Geometriai térfogat</span><strong data-cq="raw">–</strong></div>
        <div><span>Rendelendő mennyiség tartalékkal</span><strong data-cq="order">–</strong></div>
        <div><span>Teljes mixerfordulók</span><strong data-cq="loads">–</strong></div>
        <div><span>Utolsó forduló becsült mennyisége</span><strong data-cq="last">–</strong></div>
      </div>
      <div class="cq-warning">Szerkezeti beton esetén a betonminőség, vasalás, bedolgozás, tömörítés és utókezelés nem mennyiségi kalkulátor kérdése.</div>
    `);
    const update = () => {
      const l = parse(document.getElementById('length')?.value);
      const w = parse(document.getElementById('width')?.value);
      const d = parse(document.getElementById('depth')?.value) / 100;
      const reserve = parse(node.querySelector('[data-cq="waste"]')?.value) / 100;
      const truck = parse(node.querySelector('[data-cq="truck"]')?.value);
      if (!(l > 0 && w > 0 && d > 0 && truck > 0)) return;
      const raw = l * w * d;
      const order = raw * (1 + reserve);
      const fullLoads = Math.floor(order / truck);
      const remainder = order - fullLoads * truck;
      node.querySelector('[data-cq="raw"]').textContent = fmt(raw, 'm³');
      node.querySelector('[data-cq="order"]').textContent = fmt(order, 'm³');
      node.querySelector('[data-cq="loads"]').textContent = `${ceil(order / truck)} forduló`;
      node.querySelector('[data-cq="last"]').textContent = remainder > 0.01 ? fmt(remainder, 'm³') : fmt(truck, 'm³');
    };
    bind(['length', 'width', 'depth'], update);
    node.querySelectorAll('input,select').forEach((el) => { el.addEventListener('input', update); el.addEventListener('change', update); });
  };

  const renderTile = () => {
    const node = section('tile-box-planner', `
      <p class="cq-kicker">Doboz- és javítótartalék-tervező</p>
      <h2>A négyzetméterből még nem derül ki, hány dobozt vigyél haza</h2>
      <p>A fő kalkulátor a fal és a padló szükségletét külön számolja. A vásárlásnál viszont egész dobozokra kell kerekíteni, és érdemes eldönteni, maradjon-e azonos gyártási tételből néhány lap későbbi javításra.</p>
      <div class="cq-form">
        <label>Falicsempe egy dobozban (m²)<input data-cq="wall-box" type="number" min="0.01" step="0.01" value="1.44" /></label>
        <label>Járólap egy dobozban (m²)<input data-cq="floor-box" type="number" min="0.01" step="0.01" value="1.44" /></label>
        <label>Plusz javítótartalék dobozban<select data-cq="spare"><option value="0">0</option><option value="1" selected>1 doboz</option><option value="2">2 doboz</option></select></label>
      </div>
      <div class="cq-metrics">
        <div><span>Falicsempe doboz</span><strong data-cq="wall-result">–</strong></div>
        <div><span>Járólap doboz</span><strong data-cq="floor-result">–</strong></div>
        <div><span>Megjegyzés</span><strong data-cq="note">Add meg a helyiség adatait</strong></div>
      </div>
      <div class="cq-note"><strong>Gyártási tétel:</strong> színárnyalat és kaliber ugyanazon terméknél is eltérhet. Pótlást lehetőleg a munka elején tegyél félre, ne évekkel később próbáld ugyanazt a tételt megtalálni.</div>
    `);
    const update = () => {
      const L = parse(document.getElementById('roomLength')?.value);
      const W = parse(document.getElementById('roomWidth')?.value);
      const H = parse(document.getElementById('wallHeight')?.value);
      const waste = parse(document.getElementById('wastePercent')?.value) / 100;
      const wallBox = parse(node.querySelector('[data-cq="wall-box"]')?.value);
      const floorBox = parse(node.querySelector('[data-cq="floor-box"]')?.value);
      const spare = parse(node.querySelector('[data-cq="spare"]')?.value);
      if (!(L > 0 && W > 0 && H > 0 && wallBox > 0 && floorBox > 0)) return;
      let wallArea = 2 * (L + W) * H;
      if (document.getElementById('subtractDoor')?.checked) {
        wallArea -= (parse(document.getElementById('doorWidth')?.value) / 100) * (parse(document.getElementById('doorHeight')?.value) / 100) * Math.max(1, parse(document.getElementById('doorCount')?.value));
      }
      const floorArea = L * W;
      const wallBoxes = document.getElementById('calculateWalls')?.checked ? ceil(Math.max(0, wallArea) * (1 + waste) / wallBox) + spare : 0;
      const floorBoxes = document.getElementById('calculateFloor')?.checked ? ceil(floorArea * (1 + waste) / floorBox) + spare : 0;
      node.querySelector('[data-cq="wall-result"]').textContent = `${wallBoxes} doboz`;
      node.querySelector('[data-cq="floor-result"]').textContent = `${floorBoxes} doboz`;
      node.querySelector('[data-cq="note"]').textContent = spare ? `A darabszám már tartalmaz ${spare} külön javítótartalék dobozt.` : 'Nincs külön javítótartalék hozzáadva.';
    };
    bind(['roomLength','roomWidth','wallHeight','wastePercent','calculateWalls','calculateFloor','subtractDoor','doorWidth','doorHeight','doorCount'], update);
    node.querySelectorAll('input,select').forEach((el) => { el.addEventListener('input', update); el.addEventListener('change', update); });
  };

  const renderPaint = () => {
    const node = section('paint-reality-check', `
      <p class="cq-kicker">Fedőképesség-valóságteszt</p>
      <h2>A címkén szereplő m²/liter nem minden falon teljesül ugyanúgy</h2>
      <p>Új glett, erősen szívó javítás, nagy színváltás vagy foltos alapfelület növelheti a tényleges festékigényt. Ez a panel a fő kalkulátorhoz külön felületi korrekciót és vödörkerekítést ad.</p>
      <div class="cq-form">
        <label>Felület állapota<select data-cq="surface"><option value="1">Egyenletes, alapozott</option><option value="1.1" selected>Átlagos felújítás (+10%)</option><option value="1.25">Erősen szívó / nagy színváltás (+25%)</option></select></label>
        <label>Vödör kiszerelése (liter)<input data-cq="bucket" type="number" min="0.1" step="0.1" value="10" /></label>
      </div>
      <div class="cq-metrics">
        <div><span>Elméleti festékigény</span><strong data-cq="base">–</strong></div>
        <div><span>Korrigált festékigény</span><strong data-cq="adjusted">–</strong></div>
        <div><span>Egész vödörre kerekítve</span><strong data-cq="buckets">–</strong></div>
      </div>
      <div class="cq-note"><strong>Alapozó nem festékpótlék.</strong> A megfelelő alapozás célja az aljzat egységesítése és tapadásának előkészítése; mindig a választott festékrendszer gyártói előírása az elsődleges.</div>
    `);
    const update = () => {
      const L = parse(document.getElementById('roomLength')?.value);
      const W = parse(document.getElementById('roomWidth')?.value);
      const H = parse(document.getElementById('roomHeight')?.value);
      const openings = parse(document.getElementById('windowArea')?.value) + parse(document.getElementById('doorArea')?.value);
      const layers = parse(document.getElementById('layers')?.value);
      const coverage = parse(document.getElementById('coverage')?.value);
      const ceiling = document.getElementById('paintCeiling')?.checked ? L * W : 0;
      const factor = parse(node.querySelector('[data-cq="surface"]')?.value);
      const bucket = parse(node.querySelector('[data-cq="bucket"]')?.value);
      if (!(L > 0 && W > 0 && H > 0 && layers > 0 && coverage > 0 && bucket > 0)) return;
      const area = Math.max(0, 2 * (L + W) * H - openings + ceiling);
      const base = area * layers / coverage;
      const adjusted = base * factor;
      node.querySelector('[data-cq="base"]').textContent = fmt(base, 'l');
      node.querySelector('[data-cq="adjusted"]').textContent = fmt(adjusted, 'l');
      node.querySelector('[data-cq="buckets"]').textContent = `${ceil(adjusted / bucket)} × ${nf.format(bucket)} l`;
    };
    bind(['roomLength','roomWidth','roomHeight','windowArea','doorArea','layers','coverage','paintCeiling'], update);
    node.querySelectorAll('input,select').forEach((el) => { el.addEventListener('input', update); el.addEventListener('change', update); });
  };

  const renderBrick = () => {
    const node = section('brick-logistics', `
      <p class="cq-kicker">Raklap- és tartaléktervező</p>
      <h2>A darabszám után jön a logisztika</h2>
      <p>A falazatnál nem csak az számít, hány darab elem kell. A raklapos kiszerelés, törési tartalék, helyszíni tárolás és a későbbi pótlás lehetősége is befolyásolja a rendelést.</p>
      <div class="cq-form">
        <label>Darab egy raklapon<input data-cq="per-pallet" type="number" min="1" step="1" value="60" /></label>
        <label>Külön tartalék a fő kalkulátor ráhagyásán felül<select data-cq="reserve"><option value="0">0%</option><option value="2" selected>2%</option><option value="5">5%</option></select></label>
      </div>
      <div class="cq-metrics">
        <div><span>Ajánlott darabszám</span><strong data-cq="pieces">–</strong></div>
        <div><span>Raklapra kerekített rendelés</span><strong data-cq="pallets">–</strong></div>
        <div><span>Raklapos kerekítésből maradó tartalék</span><strong data-cq="extra">–</strong></div>
      </div>
      <div class="cq-warning">A téglatípus kiválasztása szerkezeti kérdés lehet. Teherhordó falnál a falvastagság és termékválasztás ne a kalkulátor alapján dőljön el.</div>
    `);
    const brickPerM2 = { porotherm10: 8, porotherm20: 16, porotherm30: 16, porotherm38: 16, 'kisméretű': 60 };
    const update = () => {
      const L = parse(document.getElementById('wallLength')?.value);
      const H = parse(document.getElementById('wallHeight')?.value);
      const openings = parse(document.getElementById('windowArea')?.value) + parse(document.getElementById('doorArea')?.value);
      const waste = parse(document.getElementById('wastePercent')?.value) / 100;
      const type = document.getElementById('brickType')?.value;
      const perPallet = parse(node.querySelector('[data-cq="per-pallet"]')?.value);
      const reserve = parse(node.querySelector('[data-cq="reserve"]')?.value) / 100;
      if (!(L > 0 && H > 0 && perPallet > 0)) return;
      const area = Math.max(0, L * H - openings);
      let base;
      if (type === 'custom') {
        const bl = parse(document.getElementById('brickLength')?.value) / 100;
        const bh = parse(document.getElementById('brickHeight')?.value) / 100;
        if (!(bl > 0 && bh > 0)) return;
        base = ceil(area / (bl * bh));
      } else {
        base = ceil(area * (brickPerM2[type] || 0));
      }
      const pieces = ceil(base * (1 + waste) * (1 + reserve));
      const pallets = ceil(pieces / perPallet);
      const rounded = pallets * perPallet;
      node.querySelector('[data-cq="pieces"]').textContent = `${whole.format(pieces)} db`;
      node.querySelector('[data-cq="pallets"]').textContent = `${pallets} raklap / ${whole.format(rounded)} db`;
      node.querySelector('[data-cq="extra"]').textContent = `${whole.format(rounded - pieces)} db`;
    };
    bind(['wallLength','wallHeight','windowArea','doorArea','wastePercent','brickType','brickLength','brickHeight'], update);
    node.querySelectorAll('input,select').forEach((el) => { el.addEventListener('input', update); el.addEventListener('change', update); });
  };

  const renderDrywall = () => {
    const node = section('drywall-system', `
      <p class="cq-kicker">Gipszkarton rendszerkapu</p>
      <h2>Nem minden gipszkarton fal ugyanaz a rendszer</h2>
      <p>A lapdarabszám önmagában kevés. Más rétegrend és kiegészítő lehet indokolt normál szobában, nedves helyiségben, fokozott hangigénynél vagy tűzvédelmi követelménynél.</p>
      <div class="cq-form"><label>Mi a fő követelmény?<select data-cq="goal"><option value="normal">Általános térelválasztás</option><option value="wet">Nedves helyiség</option><option value="sound">Fokozott hanggátlás</option><option value="fire">Tűzvédelmi követelmény</option></select></label></div>
      <div class="cq-note" data-cq="advice"></div>
      <div class="cq-checks">
        <article><h3>Váz</h3><p>Profilméret, tengelytáv, csatlakozások és merevség rendszeradat.</p></article>
        <article><h3>Rétegrend</h3><p>Lap típusa, rétegszám, hézagképzés és csavarozás együtt értelmezendő.</p></article>
        <article><h3>Csatlakozás</h3><p>Padló-, mennyezet- és oldalfali csomópontoknál tömítés és dilatáció is számíthat.</p></article>
      </div>
    `);
    const advice = {
      normal: '<strong>Általános fal:</strong> ellenőrizd a választott gyártói rendszer lap–profil–csavar kombinációját; ne csak a lap vastagságából indulj ki.',
      wet: '<strong>Nedves helyiség:</strong> a nedvességtűrő lap önmagában nem vízszigetelés. A burkolat alatti kent szigetelés és csomópontok külön rendszerfeladatok.',
      sound: '<strong>Hanggátlás:</strong> a rétegszám mellett a váz, üregkitöltés, csatlakozások és légzárás is meghatározza a végeredményt.',
      fire: '<strong>Tűzvédelem:</strong> csak bevizsgált, dokumentált rendszer rétegrendjéből indulj ki; a kalkulátor nem tűzvédelmi méretezés.'
    };
    const select = node.querySelector('[data-cq="goal"]');
    const update = () => { node.querySelector('[data-cq="advice"]').innerHTML = advice[select.value]; };
    select.addEventListener('change', update); update();
  };

  const renderWallpaper = () => {
    section('wallpaper-batch', `
      <p class="cq-kicker">Mintaismétlés és gyártási tétel</p>
      <h2>A tapétánál a hulladék nem csak négyzetméter-veszteség</h2>
      <p>Mintás tapétánál minden következő csík kezdőpontját a minta illesztése határozhatja meg. Emiatt két azonos felületű helyiség tekercsigénye eltérhet, ha más a mintaismétlés vagy a csíkhossz.</p>
      <div class="cq-grid">
        <article><h3>Mintaismétlés</h3><p>Nagy rapportnál több levágás keletkezhet. A tekercs területe önmagában félrevezető lehet.</p></article>
        <article><h3>Gyártási tétel</h3><p>Azonos cikkszám mellett is lehet enyhe árnyalatkülönbség. Egy helyiséghez lehetőleg azonos batchből vásárolj.</p></article>
        <article><h3>Nyílások</h3><p>Ablak és ajtó csökkenti a nettó felületet, de a keskeny maradékok nem biztos, hogy teljes értékű új csíkként felhasználhatók.</p></article>
        <article><h3>Javítótartalék</h3><p>Mintás vagy később nehezen beszerezhető tapétából érdemes bontatlan tartalékot félretenni.</p></article>
      </div>
      <div class="cq-note"><strong>Gyakorlati sorrend:</strong> falmagasság → vágási ráhagyás → mintaismétlés szerinti csíkhossz → csík/tekercs → szükséges tekercsek. Ez pontosabb, mint pusztán m²-rel osztani.</div>
    `);
  };

  const renderPlaster = () => {
    const node = section('plaster-depth-map', `
      <p class="cq-kicker">Rétegvastagság-térkép</p>
      <h2>Egyetlen falon belül is eltérhet az anyagigény</h2>
      <p>Vakolatnál és vastagabb kiegyenlítő rétegnél a síkpontatlanság miatt a tényleges átlagvastagság fontosabb lehet, mint egyetlen névleges érték. Mérj több ponton.</p>
      <div class="cq-form">
        <label>1. mérési pont (mm)<input data-cq="d1" type="number" min="0" step="0.5" value="8" /></label>
        <label>2. mérési pont (mm)<input data-cq="d2" type="number" min="0" step="0.5" value="12" /></label>
        <label>3. mérési pont (mm)<input data-cq="d3" type="number" min="0" step="0.5" value="10" /></label>
      </div>
      <div class="cq-metrics"><div><span>Átlagos mért vastagság</span><strong data-cq="avg">–</strong></div><div><span>Legnagyobb eltérés</span><strong data-cq="spread">–</strong></div><div><span>Értelmezés</span><strong data-cq="status">–</strong></div></div>
      <div class="cq-note">A szükséges alapozó, tapadóhíd, élvédő, háló vagy több munkamenet anyagigénye nincs automatikusan benne a vakolat tömegében.</div>
    `);
    const update = () => {
      const values = ['d1','d2','d3'].map((key) => parse(node.querySelector(`[data-cq="${key}"]`)?.value)).filter((v) => v >= 0);
      if (values.length !== 3) return;
      const avg = values.reduce((a,b) => a+b, 0) / values.length;
      const spread = Math.max(...values) - Math.min(...values);
      node.querySelector('[data-cq="avg"]').textContent = fmt(avg, 'mm');
      node.querySelector('[data-cq="spread"]').textContent = fmt(spread, 'mm');
      node.querySelector('[data-cq="status"]').textContent = spread <= 3 ? 'Viszonylag egyenletes minta' : spread <= 8 ? 'Érdemes több ponton mérni' : 'Nagy eltérés – helyszíni rétegvastagság-terv indokolt';
    };
    node.querySelectorAll('input').forEach((el) => el.addEventListener('input', update)); update();
  };

  const renderInsulation = () => {
    const node = section('insulation-system-check', `
      <p class="cq-kicker">Hőszigetelő rendszer ellenőrző</p>
      <h2>A négyzetméter csak a rendszer első sora</h2>
      <p>Homlokzati hőszigetelésnél a lap mellett ragasztó, mechanikai rögzítés, háló, ágyazó, profilok és fedőréteg is egy rendszer része. A kompatibilitás fontosabb, mint az egyes tételek külön-külön olcsósága.</p>
      <div class="cq-checklist">
        <label><input type="checkbox" /> Az aljzat állapotát és tapadását ellenőriztem.</label>
        <label><input type="checkbox" /> A lap, ragasztó, háló és fedőréteg rendszerkompatibilitását ellenőriztem.</label>
        <label><input type="checkbox" /> Nyílások, sarkok, lábazat és csomópontok külön anyagigényével számoltam.</label>
        <label><input type="checkbox" /> A dübelezést és tűzvédelmi/páratechnikai követelményeket nem általános darabszám alapján döntöm el.</label>
      </div>
      <p><strong data-cq="progress-text">0 / 4 ellenőrzési pont</strong></p><div class="cq-progress"><span data-cq="progress"></span></div>
    `);
    const checks = [...node.querySelectorAll('input[type="checkbox"]')];
    const update = () => {
      const done = checks.filter((c) => c.checked).length;
      node.querySelector('[data-cq="progress-text"]').textContent = `${done} / ${checks.length} ellenőrzési pont`;
      node.querySelector('[data-cq="progress"]').style.width = `${done / checks.length * 100}%`;
    };
    checks.forEach((c) => c.addEventListener('change', update)); update();
  };

  const renderPaving = () => {
    const node = section('paving-slope', `
      <p class="cq-kicker">Lejtés és vízelvezetés</p>
      <h2>A térkő mennyisége jó lehet, miközben a pálya még rosszul van megtervezve</h2>
      <p>A felület vízelvezetése külön tervezési kérdés. Ez a mini segédlet megmutatja, mekkora szintkülönbséget jelent egy választott százalékos lejtés a megadott hosszon.</p>
      <div class="cq-form"><label>Lejtés hossza (m)<input data-cq="length" type="number" min="0.1" step="0.1" value="5" /></label><label>Tervezett lejtés (%)<input data-cq="slope" type="number" min="0" step="0.1" value="2" /></label></div>
      <div class="cq-metrics"><div><span>Szükséges szintkülönbség</span><strong data-cq="drop">–</strong></div><div><span>Értelmezés</span><strong data-cq="meaning">–</strong></div></div>
      <div class="cq-warning">A megfelelő lejtés helyszín- és rétegrendfüggő. A kalkulátor csak geometriai átváltást végez; vízelvezetési tervet nem készít.</div>
    `);
    const update = () => {
      const length = parse(node.querySelector('[data-cq="length"]')?.value);
      const slope = parse(node.querySelector('[data-cq="slope"]')?.value);
      if (!(length > 0 && slope >= 0)) return;
      const dropCm = length * slope;
      node.querySelector('[data-cq="drop"]').textContent = fmt(dropCm, 'cm');
      node.querySelector('[data-cq="meaning"]').textContent = `${nf.format(length)} m-en ${nf.format(dropCm)} cm esés`;
    };
    node.querySelectorAll('input').forEach((el) => el.addEventListener('input', update)); update();
  };

  const renderRoofTile = () => {
    section('roof-accessories', `
      <p class="cq-kicker">Tetőfedési kiegészítőlista</p>
      <h2>A mezőcserép darabszáma nem egyenlő a teljes tetőfedési anyaglistával</h2>
      <p>A tető geometriája gerincet, élt, vápát, ereszt, oromszegélyt, áttöréseket és szellőzési pontokat is tartalmazhat. Ezekhez speciális kiegészítők és eltérő vágási veszteség tartozhat.</p>
      <div class="cq-grid">
        <article><h3>Gerinc és él</h3><p>Külön elemek, rögzítők és szellőző megoldások szükségesek lehetnek.</p></article>
        <article><h3>Vápa és áttörés</h3><p>Sok vágást és külön bádogos vagy rendszerkiegészítőt jelenthet.</p></article>
        <article><h3>Eresz és orom</h3><p>A kezdés, szegélyezés és rögzítés nem vezethető le pusztán a tető m²-ből.</p></article>
        <article><h3>Javítótartalék</h3><p>Néhány azonos típusú cserép későbbi viharkár vagy törés esetére értékes lehet.</p></article>
      </div>
      <div class="cq-warning">Tetőfedésnél a hajlásszög, alátéthéjazat, léctávolság és rögzítés gyártói rendszerelőírás és tervezési kérdés. A darabszám-kalkulátor ezt nem helyettesíti.</div>
    `);
  };

  const renderGrout = () => {
    const node = section('grout-zone', `
      <p class="cq-kicker">Fugázási használati zóna</p>
      <h2>Az anyagmennyiség mellett azt is döntsd el, milyen terhelést kap a fuga</h2>
      <div class="cq-form"><label>Felhasználási hely<select data-cq="zone"><option value="dry">Száraz beltéri fal</option><option value="floor">Beltéri padló</option><option value="wet">Zuhany / vizes zóna</option><option value="outdoor">Kültéri burkolat</option></select></label></div>
      <div class="cq-note" data-cq="advice"></div>
      <p>A fogyást a lapméret mellett a fugaszélesség és a tényleges kitöltési mélység is befolyásolja. Ugyanazon m²-en kis lapból több fugahossz adódik, mint nagy lapból.</p>
    `);
    const messages = {
      dry: '<strong>Száraz beltéri fal:</strong> a szín és tisztíthatóság mellett a gyártói kompatibilitás a fő ellenőrzési pont.',
      floor: '<strong>Beltéri padló:</strong> kopás, takaríthatóság és a burkolat mozgása miatt a megfelelő fugázó- és dilatációs rendszer fontos.',
      wet: '<strong>Vizes zóna:</strong> a fuga nem helyettesíti a burkolat mögötti vízszigetelést; sarkok és csatlakozások külön csomópontok.',
      outdoor: '<strong>Kültér:</strong> fagy, víz, hőmozgás és dilatáció miatt csak a teljes kültéri burkolati rendszerrel együtt értelmezd.'
    };
    const select = node.querySelector('[data-cq="zone"]');
    const update = () => { node.querySelector('[data-cq="advice"]').innerHTML = messages[select.value]; };
    select.addEventListener('change', update); update();
  };

  const renderFlooring = () => {
    const node = section('flooring-package', `
      <p class="cq-kicker">Csomagolási és javítótartalék-tervező</p>
      <h2>A kivitelezés végén ne csak fél négyzetméter maradjon véletlenül</h2>
      <p>Laminált padló, vinyl vagy parketta vásárlásánál egész csomagra kell kerekíteni. A maradék egy része későbbi javításnál hasznosabb lehet, mint visszaváltva.</p>
      <div class="cq-form"><label>Burkolandó nettó felület (m²)<input data-cq="area" type="number" min="0.1" step="0.01" value="20" /></label><label>Egy csomag fedése (m²)<input data-cq="pack" type="number" min="0.01" step="0.01" value="2.2" /></label><label>Vágási ráhagyás (%)<input data-cq="waste" type="number" min="0" step="1" value="8" /></label></div>
      <div class="cq-metrics"><div><span>Elméleti vásárlási felület</span><strong data-cq="purchase">–</strong></div><div><span>Szükséges csomag</span><strong data-cq="packs">–</strong></div><div><span>Csomagkerekítés után marad</span><strong data-cq="leftover">–</strong></div></div>
      <div class="cq-note"><strong>Kiosztás:</strong> keskeny utolsó sor, ferde falak, ajtótokok és mintairány növelhetik a veszteséget. A csomagolási kerekítés ezért nem ugyanaz, mint a vágási ráhagyás.</div>
    `);
    const update = () => {
      const area = parse(node.querySelector('[data-cq="area"]')?.value);
      const pack = parse(node.querySelector('[data-cq="pack"]')?.value);
      const waste = parse(node.querySelector('[data-cq="waste"]')?.value) / 100;
      if (!(area > 0 && pack > 0)) return;
      const purchase = area * (1 + waste);
      const packs = ceil(purchase / pack);
      const rounded = packs * pack;
      node.querySelector('[data-cq="purchase"]').textContent = fmt(purchase, 'm²');
      node.querySelector('[data-cq="packs"]').textContent = `${packs} csomag`;
      node.querySelector('[data-cq="leftover"]').textContent = fmt(rounded - purchase, 'm²');
    };
    node.querySelectorAll('input').forEach((el) => el.addEventListener('input', update)); update();
  };

  const renderers = {
    epitoipari: renderHub,
    'beton-kalkulator': renderConcrete,
    'csempe-kalkulator': renderTile,
    'festek-kalkulator': renderPaint,
    'tegla-kalkulator': renderBrick,
    'gipszkarton-kalkulator': renderDrywall,
    'tapeta-kalkulator': renderWallpaper,
    'vakolat-kalkulator': renderPlaster,
    'hoszigeteles-kalkulator': renderInsulation,
    'terkovezes-kalkulator': renderPaving,
    'tetocserep-kalkulator': renderRoofTile,
    'fuga-kalkulator': renderGrout,
    'padlo-burkolat-kalkulator': renderFlooring,
  };

  renderers[slug]?.();
})();

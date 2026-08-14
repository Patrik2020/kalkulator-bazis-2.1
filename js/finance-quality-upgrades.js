(() => {
  'use strict';

  const slug = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/i, '').toLowerCase();
  const root = window.KB_PROJECT_ROOT || '';
  const nf = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 });
  const pf = new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 2 });
  const money = (value) => Number.isFinite(value) ? `${nf.format(Math.round(value))} Ft` : '–';
  const parse = (value) => {
    const normalized = String(value ?? '').replace(/\s/g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const main = document.querySelector('main');
  if (!main || document.querySelector('[data-finance-quality="2026-08"]')) return;

  const sourceLink = (href, label) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const section = (className, html) => {
    const node = document.createElement('section');
    node.className = `finance-quality ${className}`;
    node.dataset.financeQuality = '2026-08';
    node.innerHTML = html;
    main.appendChild(node);
    return node;
  };

  const bindInputs = (ids, fn) => {
    ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((input) => {
      input.addEventListener('input', fn);
      input.addEventListener('change', fn);
    });
    fn();
  };

  const renderFinanceHub = () => {
    section('finance-hub-lab', `
      <p class="quality-kicker">Pénzügyi döntési útvonal</p>
      <h2>Ne kalkulátort válassz először, hanem kérdést</h2>
      <p>A pénzügyi oldalak célja nem az, hogy ugyanazt a sablont ismételjék más képlettel. Minden eszköz más döntési helyzetet bont fel: jövedelem, hitelteher, lakásvásárlás, megtakarítás, befektetés vagy számlázás.</p>
      <div class="quality-path-grid">
        <article><span>1</span><h3>Mennyi pénzből gazdálkodom?</h3><p>Nettó–bruttó és havi költségvetés. Előbb a valós havi mozgásteredet tisztázd.</p><a href="${root}/kalkulatorok/netto-brutto-kalkulator.html">Bérből indulok →</a></article>
        <article><span>2</span><h3>Mekkora terhet bírok el?</h3><p>Hitelképesség, törlesztő és önerő. A banki maximum nem azonos a kényelmes háztartási limittel.</p><a href="${root}/kalkulatorok/hitelkepesseg-kalkulator.html">Hitelt tervezek →</a></article>
        <article><span>3</span><h3>Mikor érem el a célomat?</h3><p>Kamatos kamat, célösszeg és infláció. Külön kezeld a nominális forintot és a vásárlóerőt.</p><a href="${root}/kalkulatorok/milliomos-kalkulator.html">Célösszeget tervezek →</a></article>
        <article><span>4</span><h3>Mit jelent a befektetési feltételezés?</h3><p>ETF és osztalék. A költség, adó, deviza, hozam és időtáv külön-külön is módosíthatja az eredményt.</p><a href="${root}/kalkulatorok/etf-kalkulator.html">Befektetést modellezek →</a></article>
        <article><span>5</span><h3>Melyik dátum mit jelent?</h3><p>Fizetési határidő és teljesítési dátum. A kiállítás, teljesítés és esedékesség nem felcserélhető fogalmak.</p><a href="${root}/kalkulatorok/szamla-teljesites-kalkulator.html">Számlázást ellenőrzök →</a></article>
      </div>
      <div class="quality-note"><strong>Minőségi elv:</strong> minden kalkulátor saját módszertani, értelmezési és korlátblokkot kap. Nem ugyanazt a SEO-szöveget variáljuk.</div>
    `);
  };

  const renderSalary = () => {
    section('salary-decision-lab', `
      <p class="quality-kicker">Bérdöntési ellenőrző</p>
      <h2>Mit ellenőrizz, mielőtt a nettó eredményre támaszkodsz?</h2>
      <div class="quality-check-grid">
        <article><h3>Jogosultság</h3><p>A kedvezmény nem csak életkor vagy gyermekszám kérdése: a jogosultság kezdete, sorrendje és megosztása is számíthat.</p></article>
        <article><h3>Bérösszetevők</h3><p>Pótlék, bónusz, jutalom, cafeteria, letiltás vagy több jogviszony miatt a bérpapír eltérhet egy alapbérre készült becsléstől.</p></article>
        <article><h3>Nettóból bruttó</h3><p>Visszafelé nem egyszerű osztás történik: kedvezmények és korlátok miatt a szükséges bruttó összeg lépcsősen is változhat.</p></article>
      </div>
      <h3>2026-os ellenőrzési pont</h3>
      <p>A 25 év alattiak kedvezményének havi adóalap-korláta 2026-ban 715 765 Ft. A kalkulátor ezt a korlátot kezeli, de nem modellez minden létező személyi jövedelemadó-kedvezményt.</p>
      <p class="quality-sources">Elsődleges forrás: ${sourceLink('https://nav.gov.hu/print/ado/szja/25-ev-alatti-fiatalok-kedvezmenye', 'NAV – 25 év alattiak kedvezménye')} · ${sourceLink('https://nav.gov.hu/ugyfeliranytu/adokulcsok_jarulekmertekek', 'NAV – adókulcsok és járulékmértékek')}</p>
      <div class="quality-note"><strong>Mikor ne ezt használd?</strong> Ha több speciális kedvezmény, több munkáltató, külföldi adózás, egyéni vállalkozói jogviszony vagy összetett bérszámfejtés érintett, a kalkuláció legyen csak előzetes kontroll.</div>
    `);
  };

  const renderLoanPayment = () => {
    const node = section('loan-stress-lab', `
      <p class="quality-kicker">Törlesztési stresszteszt</p>
      <h2>Mi történik, ha a kamat 2 százalékponttal magasabb?</h2>
      <p>A havi részlet önmagában kevés információ. Ez a kiegészítő panel ugyanarra a hitelösszegre és futamidőre megmutatja a megadott kamat és egy +2 százalékpontos stresszforgatókönyv különbségét.</p>
      <div class="quality-metric-grid">
        <div><span>Alap havi részlet</span><strong data-q="base">–</strong></div>
        <div><span>+2 százalékpont mellett</span><strong data-q="stress">–</strong></div>
        <div><span>Havi különbség</span><strong data-q="delta">–</strong></div>
        <div><span>Teljes többlet a futamidő alatt</span><strong data-q="total-delta">–</strong></div>
      </div>
      <p class="quality-caption">A stresszteszt annuitásos matematikai modell. Nem kamatelőrejelzés, nem THM-számítás, és nem banki ajánlat.</p>
    `);
    const annuity = (principal, annualRate, months) => {
      if (months <= 0) return 0;
      const r = annualRate / 100 / 12;
      if (r === 0) return principal / months;
      return principal * r / (1 - Math.pow(1 + r, -months));
    };
    const update = () => {
      const principal = parse(document.getElementById('amount')?.value);
      const rate = parse(document.getElementById('rate')?.value);
      const years = parse(document.getElementById('years')?.value);
      const months = Math.round(years * 12);
      if (!(principal > 0 && years > 0 && rate >= 0)) return;
      const base = annuity(principal, rate, months);
      const stress = annuity(principal, rate + 2, months);
      node.querySelector('[data-q="base"]').textContent = money(base);
      node.querySelector('[data-q="stress"]').textContent = money(stress);
      node.querySelector('[data-q="delta"]').textContent = money(stress - base);
      node.querySelector('[data-q="total-delta"]').textContent = money((stress - base) * months);
    };
    bindInputs(['amount', 'rate', 'years'], update);
  };

  const renderCreditCapacity = () => {
    const node = section('jtm-lab', `
      <p class="quality-kicker">2026-os JTM összehasonlító</p>
      <h2>A saját 40%-os tervezési keret és a szabályozói plafon nem ugyanaz</h2>
      <p>A fő kalkulátor szándékosan 40%-os háztartási tervezési aránnyal számol. Az alábbi panel külön mutatja, hogy a 2026-os MNB JTM-főszabály szerint milyen felső korlát adódhat a megadott jövedelemre. Ez nem banki előminősítés.</p>
      <div class="quality-form-row">
        <label>Konstrukció / kamatrögzítés
          <select data-q="jtm-type">
            <option value="unsecured">Fedezetlen hitel vagy 5 évnél rövidebb jelzáloghitel</option>
            <option value="lt5">Legalább 5 éves jelzáloghitel, 5 évnél rövidebb kamatperiódus</option>
            <option value="5to10">Legalább 5 éves jelzáloghitel, 5–10 év közötti kamatperiódus</option>
            <option value="10plus">Legalább 10 éves vagy végig fix kamat</option>
            <option value="green">Zöld hitelcél, legalább 10 éves/fix forinthitel</option>
          </select>
        </label>
      </div>
      <div class="quality-metric-grid">
        <div><span>2026-os JTM százalék</span><strong data-q="ratio">–</strong></div>
        <div><span>Elméleti összes havi törlesztési plafon</span><strong data-q="cap">–</strong></div>
        <div><span>Meglévő törlesztés után fennmaradó keret</span><strong data-q="free">–</strong></div>
        <div><span>Oldal saját 40%-os tervezési kerete</span><strong data-q="planning">–</strong></div>
      </div>
      <p class="quality-sources">Forrás: ${sourceLink('https://www.mnb.hu/penzugyi-stabilitas/makroprudencialis-politika/makroprudencialis-eszkoztar/adossagfek-szabalyok-hfm-jtm', 'MNB – Adósságfék-szabályok (HFM, JTM)')}.</p>
      <div class="quality-note"><strong>2026-os változás:</strong> a JTM jövedelmi küszöb 600 000 Ft-ról 800 000 Ft-ra emelkedett. A bank emellett saját, szigorúbb hitelbírálati szabályt is alkalmazhat.</div>
    `);
    const select = node.querySelector('[data-q="jtm-type"]');
    const ratioFor = (income, type) => {
      const high = income >= 800000;
      if (type === 'green') return 0.60;
      if (type === 'unsecured') return high ? 0.60 : 0.50;
      if (type === 'lt5') return high ? 0.30 : 0.25;
      if (type === '5to10') return high ? 0.40 : 0.35;
      return high ? 0.60 : 0.50;
    };
    const update = () => {
      const income = parse(document.getElementById('income')?.value);
      const existing = Math.max(0, parse(document.getElementById('existing')?.value));
      if (income <= 0) return;
      const ratio = ratioFor(income, select.value);
      const cap = income * ratio;
      node.querySelector('[data-q="ratio"]').textContent = `${pf.format(ratio * 100)}%`;
      node.querySelector('[data-q="cap"]').textContent = money(cap);
      node.querySelector('[data-q="free"]').textContent = money(Math.max(0, cap - existing));
      node.querySelector('[data-q="planning"]').textContent = money(Math.max(0, income * 0.40 - existing));
    };
    select.addEventListener('change', update);
    bindInputs(['income', 'existing'], update);
  };

  const renderDownPayment = () => {
    const node = section('hfm-lab', `
      <p class="quality-kicker">Önerő valóságteszt</p>
      <h2>A bank nem feltétlenül a vételárból indul ki</h2>
      <p>A HFM a bank által hitelbírálatkor megállapított forgalmi értékhez kötődik. Ha ez alacsonyabb a vételárnál, a szükséges saját pénz magasabb lehet, mint egy egyszerű 10% vagy 20%-os számítás.</p>
      <div class="quality-form-row">
        <label>Banki forgalmi érték becslése (Ft)
          <input type="text" inputmode="numeric" data-q="valuation" placeholder="pl. 47 000 000">
        </label>
        <label>HFM forgatókönyv
          <select data-q="hfm-type">
            <option value="0.80">Főszabály – legfeljebb 80% finanszírozás</option>
            <option value="0.90">Elsőlakás-vásárló – legfeljebb 90%</option>
            <option value="0.90">Zöld fedezet és hitelcél – legfeljebb 90%</option>
          </select>
        </label>
      </div>
      <div class="quality-metric-grid">
        <div><span>HFM alapján becsült maximális hitel</span><strong data-q="loan">–</strong></div>
        <div><span>Vételárhoz szükséges saját pénz</span><strong data-q="cash">–</strong></div>
        <div><span>Saját pénz aránya a vételárhoz</span><strong data-q="cash-ratio">–</strong></div>
      </div>
      <p class="quality-sources">Forrás: ${sourceLink('https://www.mnb.hu/penzugyi-stabilitas/makroprudencialis-politika/makroprudencialis-eszkoztar/adossagfek-szabalyok-hfm-jtm', 'MNB – HFM/JTM szabályok')}.</p>
      <div class="quality-note"><strong>Ne költsd el az utolsó forintot önerőre.</strong> Ügyvéd, illeték, értékbecslés, költözés, felújítás és vésztartalék külön pénzigény lehet.</div>
    `);
    const valuation = node.querySelector('[data-q="valuation"]');
    const type = node.querySelector('[data-q="hfm-type"]');
    valuation.addEventListener('input', (event) => {
      const raw = String(event.target.value).replace(/\D/g, '');
      event.target.value = raw ? nf.format(Number(raw)) : '';
    });
    const update = () => {
      const price = parse(document.getElementById('price')?.value);
      const estimated = parse(valuation.value) || price;
      const hfm = parse(type.value);
      if (!(price > 0 && estimated > 0 && hfm > 0)) return;
      const maxLoan = estimated * hfm;
      const cash = Math.max(0, price - maxLoan);
      node.querySelector('[data-q="loan"]').textContent = money(maxLoan);
      node.querySelector('[data-q="cash"]').textContent = money(cash);
      node.querySelector('[data-q="cash-ratio"]').textContent = `${pf.format((cash / price) * 100)}%`;
    };
    type.addEventListener('change', update);
    valuation.addEventListener('input', update);
    bindInputs(['price'], update);
  };

  const renderDividend = () => {
    section('dividend-quality-lab', `
      <p class="quality-kicker">Osztalék cashflow-ellenőrző</p>
      <h2>A „havi osztalék” többnyire csak éves átlag</h2>
      <p>A tervezésnél három külön kérdést érdemes szétválasztani: mennyi a vállalat vagy alap által fizetett bruttó osztalék, ebből mennyi marad levonások után, és mikor érkezik ténylegesen a pénz. A negyedéves vagy éves kifizetésből számolt havi átlag nem egyenletes havi fizetés.</p>
      <div class="quality-check-grid">
        <article><h3>Hozamcsapda</h3><p>A kiugró osztalékhozam lehet árfolyamesés vagy várható osztalékvágás következménye is. A magas százalék önmagában nem minőségi jel.</p></article>
        <article><h3>Adó és forrásadó</h3><p>A tényleges nettó kifizetés ország, értékpapír, számlatípus és egyezmények szerint eltérhet. Ezért a kalkulátor a levonást felhasználói feltételezésként kezeli.</p></article>
        <article><h3>Teljes hozam</h3><p>Az osztalék csak az egyik komponens. Árfolyamnyereség, veszteség, deviza és költség együtt adja a befektetés tényleges eredményét.</p></article>
      </div>
      <h3>Használd stressztesztre, ne ígéretre</h3>
      <p>Próbáld ki ugyanazt a portfóliót alacsonyabb osztalékhozammal és 20–30%-os egyszeri osztalékvágással is. Ha a terv csak optimista feltételezéssel működik, az fontosabb információ, mint a legszebb becsült havi összeg.</p>
    `);
  };

  const renderEtf = () => {
    section('etf-selection-lab', `
      <p class="quality-kicker">ETF kiválasztási ellenőrző</p>
      <h2>A TER csak egy sor a döntésben</h2>
      <p>A kalkulátor a hosszú távú matematikát modellezi, de egy konkrét ETF kiválasztásakor a költségnél több tulajdonságot kell ellenőrizni. Két hasonló nevű alap kitettsége és működése is eltérhet.</p>
      <div class="quality-check-grid">
        <article><h3>Mit követ?</h3><p>Index, régió, szektor, eszközosztály és koncentráció. A „világ ETF” elnevezés önmagában nem mondja meg a mögöttes piac pontos összetételét.</p></article>
        <article><h3>Hogyan kezeli a hozamot?</h3><p>Felhalmozó és kifizető alap eltérően kezeli az osztalékot. A befektetési cél és az adózási környezet miatt ez gyakorlati különbség.</p></article>
        <article><h3>Mekkora a tényleges súrlódás?</h3><p>TER mellett vételi/eladási spread, brókerdíj, devizaváltás és követési eltérés is befolyásolhatja az eredményt.</p></article>
        <article><h3>Milyen kockázatot vállalsz?</h3><p>A széles diverzifikáció sem védi ki a teljes részvénypiac esését. A kalkulált sima hozampálya nem mutatja a közbenső visszaeséseket.</p></article>
      </div>
      <div class="quality-note"><strong>Hasznos gyakorlat:</strong> ugyanazt a célt számold végig legalább három hozammal, és nézd meg a mai vásárlóértéket is. Így a kalkulátor nem „jósol”, hanem döntési tartományt mutat.</div>
    `);
  };

  const renderGoal = () => {
    const node = section('goal-milestone-lab', `
      <p class="quality-kicker">Célösszeg mérföldkövek</p>
      <h2>Ne csak a céldátumot nézd: lásd az odavezető utat is</h2>
      <p>A végső cél távolinak tűnhet. A panel ugyanazzal a havi hozammodellel becsüli meg, mikor érheted el a cél 25%, 50%, 75% és 100%-át.</p>
      <div class="quality-metric-grid milestone-grid">
        <div><span>25%</span><strong data-q="m25">–</strong></div>
        <div><span>50%</span><strong data-q="m50">–</strong></div>
        <div><span>75%</span><strong data-q="m75">–</strong></div>
        <div><span>100%</span><strong data-q="m100">–</strong></div>
      </div>
      <p class="quality-caption">A hozam állandó éves effektív feltételezés. Infláció, adó, költség és változó befizetés nincs ebben a mérföldkő-modellben.</p>
    `);
    const monthsToGoal = (initial, monthly, annualRate, goal) => {
      if (initial >= goal) return 0;
      if (monthly <= 0 && annualRate <= 0) return null;
      const r = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
      let balance = initial;
      for (let m = 1; m <= 1200; m += 1) {
        balance *= (1 + r);
        balance += monthly;
        if (balance >= goal) return m;
      }
      return null;
    };
    const formatMonths = (months) => {
      if (months === null) return '100 éven belül nem érhető el';
      if (months === 0) return 'már elérted';
      const years = Math.floor(months / 12);
      const rem = months % 12;
      return [years ? `${years} év` : '', rem ? `${rem} hó` : ''].filter(Boolean).join(' ');
    };
    const update = () => {
      const initial = parse(document.getElementById('initial')?.value);
      const monthly = parse(document.getElementById('monthly')?.value);
      const rate = parse(document.getElementById('rate')?.value);
      const goal = parse(document.getElementById('goal')?.value);
      if (!(goal > 0 && initial >= 0 && monthly >= 0 && rate > -100)) return;
      [25, 50, 75, 100].forEach((pct) => {
        const months = monthsToGoal(initial, monthly, rate, goal * pct / 100);
        node.querySelector(`[data-q="m${pct}"]`).textContent = formatMonths(months);
      });
    };
    bindInputs(['initial', 'monthly', 'rate', 'goal'], update);
  };

  const renderInflation = () => {
    const node = section('inflation-two-way-lab', `
      <p class="quality-kicker">Infláció két irányból</p>
      <h2>Ugyanaz a ráta két külön kérdésre ad választ</h2>
      <p>Az egyik nézőpont: a mai pénz mennyit érhet később vásárlóerőben. A másik: mennyi jövőbeni forint kellhet ahhoz, hogy ugyanazt a mai vásárlóerőt megőrizd.</p>
      <div class="quality-metric-grid">
        <div><span>Mai összeg jövőbeni vásárlóereje</span><strong data-q="real">–</strong></div>
        <div><span>Azonos vásárlóerőhöz szükséges jövőbeni összeg</span><strong data-q="future">–</strong></div>
        <div><span>Vásárlóerő becsült csökkenése</span><strong data-q="loss">–</strong></div>
      </div>
      <p class="quality-caption">A modell állandó éves inflációt feltételez. A hivatalos fogyasztóiár-index egy átlagos kosár változását méri, ezért a saját háztartásod „személyes inflációja” eltérhet.</p>
      <p class="quality-sources">Módszertani háttér: ${sourceLink('https://www.ksh.hu/gyorstajekoztatok/modszertan/farmodsz25.html', 'KSH – fogyasztói árak módszertana')}.</p>
    `);
    const update = () => {
      const amount = parse(document.getElementById('amount')?.value);
      const rate = parse(document.getElementById('rate')?.value) / 100;
      const years = parse(document.getElementById('years')?.value);
      if (!(amount > 0 && years >= 0 && rate > -1)) return;
      const factor = Math.pow(1 + rate, years);
      const real = amount / factor;
      const future = amount * factor;
      node.querySelector('[data-q="real"]').textContent = money(real);
      node.querySelector('[data-q="future"]').textContent = money(future);
      node.querySelector('[data-q="loss"]').textContent = `${pf.format((1 - real / amount) * 100)}%`;
    };
    bindInputs(['amount', 'rate', 'years'], update);
  };

  const renderCompound = () => {
    const node = section('compound-breakdown-lab', `
      <p class="quality-kicker">Befizetés vagy hozam?</p>
      <h2>Lásd külön, miből áll össze a végösszeg</h2>
      <p>A kamatos kamat erejét könnyű túlmisztifikálni. Az első években gyakran a rendszeres saját befizetés adja a növekedés nagyobb részét; az idő előrehaladtával nőhet a hozam szerepe.</p>
      <div class="quality-metric-grid">
        <div><span>Összes saját befizetés</span><strong data-q="contributed">–</strong></div>
        <div><span>Becsült végösszeg</span><strong data-q="final">–</strong></div>
        <div><span>Ebből becsült hozam</span><strong data-q="growth">–</strong></div>
        <div><span>Hozam aránya a végösszegből</span><strong data-q="growth-ratio">–</strong></div>
      </div>
      <div class="quality-note"><strong>Miért más, mint az ETF kalkulátor?</strong> Ez tiszta matematikai kamatoskamat-modell. Az ETF kalkulátor ehhez befektetésspecifikus költség-, infláció- és célösszeg-beállításokat is kapcsol.</div>
    `);
    const update = () => {
      const initial = parse(document.getElementById('initial')?.value);
      const monthly = parse(document.getElementById('monthly')?.value);
      const rate = parse(document.getElementById('rate')?.value);
      const years = parse(document.getElementById('years')?.value);
      if (!(initial >= 0 && monthly >= 0 && years >= 0 && rate > -100)) return;
      const months = Math.round(years * 12);
      const r = Math.pow(1 + rate / 100, 1 / 12) - 1;
      let balance = initial;
      for (let i = 0; i < months; i += 1) {
        balance *= (1 + r);
        balance += monthly;
      }
      const contributed = initial + monthly * months;
      const growth = balance - contributed;
      node.querySelector('[data-q="contributed"]').textContent = money(contributed);
      node.querySelector('[data-q="final"]').textContent = money(balance);
      node.querySelector('[data-q="growth"]').textContent = money(growth);
      node.querySelector('[data-q="growth-ratio"]').textContent = balance > 0 ? `${pf.format(growth / balance * 100)}%` : '–';
    };
    bindInputs(['initial', 'monthly', 'rate', 'years'], update);
  };

  const renderBudget = () => {
    const node = section('budget-reserve-lab', `
      <p class="quality-kicker">Éves kiadások és vésztartalék</p>
      <h2>A havi költségvetésből gyakran pont a ritka tételek hiányoznak</h2>
      <p>Biztosítás, szerviz, iskolakezdés, fogászat vagy éves előfizetés nem minden hónapban jelenik meg. Itt éves összegből havi céltartalékot, valamint az alapvető kiadásokból vésztartalék-célt számolhatsz.</p>
      <div class="quality-form-row">
        <label>Éves ritka / időszakos kiadások összesen (Ft)
          <input type="text" inputmode="numeric" data-q="annual-irregular" placeholder="pl. 600 000">
        </label>
        <label>Vésztartalék cél (hónap)
          <input type="number" min="1" max="24" step="1" data-q="reserve-months" value="6">
        </label>
      </div>
      <div class="quality-metric-grid">
        <div><span>Havi céltartalék ritka kiadásokra</span><strong data-q="monthly-irregular">–</strong></div>
        <div><span>Becsült alapvető havi kiadás</span><strong data-q="essential">–</strong></div>
        <div><span>Vésztartalék-cél</span><strong data-q="reserve">–</strong></div>
      </div>
      <p class="quality-caption">Az „alapvető” kiadás itt lakhatás + rezsi + élelmiszer + közlekedés + hitel. A saját helyzetedben más tétel is lehet nélkülözhetetlen.</p>
    `);
    const annual = node.querySelector('[data-q="annual-irregular"]');
    const months = node.querySelector('[data-q="reserve-months"]');
    annual.addEventListener('input', (event) => {
      const raw = String(event.target.value).replace(/\D/g, '');
      event.target.value = raw ? nf.format(Number(raw)) : '';
    });
    const update = () => {
      const annualCost = parse(annual.value);
      const reserveMonths = Math.max(1, parse(months.value) || 6);
      const essential = ['housing', 'utilities', 'food', 'transport', 'debt']
        .map((id) => parse(document.getElementById(id)?.value))
        .reduce((sum, value) => sum + value, 0);
      node.querySelector('[data-q="monthly-irregular"]').textContent = money(annualCost / 12);
      node.querySelector('[data-q="essential"]').textContent = money(essential);
      node.querySelector('[data-q="reserve"]').textContent = money(essential * reserveMonths);
    };
    annual.addEventListener('input', update);
    months.addEventListener('input', update);
    bindInputs(['housing', 'utilities', 'food', 'transport', 'debt'], update);
  };

  const renderDeadline = () => {
    section('deadline-calendar-lab', `
      <p class="quality-kicker">2026-os munkarend-ellenőrző</p>
      <h2>A munkanap nem egyszerűen hétfőtől péntekig tart</h2>
      <p>2026-ban három szombat általános munkarend szerinti munkanap, és három kapcsolódó hétköznap pihenőnap. Ezért a munkanapos számításnál egy sima „hétvégék kihagyása” algoritmus hibás eredményt adhat.</p>
      <div class="quality-calendar-grid">
        <article><strong>jan. 10., szombat</strong><span>munkanap</span><small>jan. 2., péntek pihenőnap</small></article>
        <article><strong>aug. 8., szombat</strong><span>munkanap</span><small>aug. 21., péntek pihenőnap</small></article>
        <article><strong>dec. 12., szombat</strong><span>munkanap</span><small>dec. 24., csütörtök pihenőnap</small></article>
      </div>
      <p class="quality-sources">Jogszabályi alap: ${sourceLink('https://njt.hu/jogszabaly/2025-10-20-2X', '10/2025. (IV. 30.) NGM rendelet')}.</p>
      <div class="quality-note"><strong>Fontos különbség:</strong> a munkanap-számítás technikai naptárkérdés; hogy egy szerződéses esedékesség hétvégén vagy munkaszüneti napon hogyan tolódik, külön jogi kérdés lehet.</div>
    `);
  };

  const renderInvoice = () => {
    const node = section('invoice-triage-lab', `
      <p class="quality-kicker">Ügylettípus-ellenőrző</p>
      <h2>Mielőtt dátumot számolsz, azonosítsd az ügyletet</h2>
      <p>A teljesítési időpont hibája gyakran nem számolási, hanem besorolási hiba. Válaszd ki a helyzethez legközelebbi típust; a panel azt mutatja meg, melyik szabályt kell külön ellenőrizni.</p>
      <div class="quality-form-row">
        <label>Ügylet típusa
          <select data-q="invoice-type">
            <option value="single">Egyszeri termékértékesítés vagy szolgáltatás</option>
            <option value="periodic">Időszakos elszámolás / meghatározott időszak</option>
            <option value="advance">Előleg érkezik a teljesítés előtt</option>
            <option value="partial">Részteljesítés</option>
            <option value="crossborder">Külföldi / fordított adózású ügylet</option>
          </select>
        </label>
      </div>
      <div class="quality-triage-result" data-q="triage"></div>
      <p class="quality-sources">Jogszabályi alap: ${sourceLink('https://njt.hu/jogszabaly/2007-127-00-00', '2007. évi CXXVII. törvény (Áfa tv.)')} – különösen az 56–59. §.</p>
    `);
    const select = node.querySelector('[data-q="invoice-type"]');
    const out = node.querySelector('[data-q="triage"]');
    const messages = {
      single: '<strong>Egyszeri ügylet:</strong> főszabály szerint a tényleges teljesítéshez kötődik az adózási időpont. A számla kiállítása és a fizetési határidő ettől eltérhet.',
      periodic: '<strong>Időszakos elszámolás:</strong> az Áfa tv. 58. § külön szabályt alkalmaz; az időszak vége, a számlakibocsátás és az esedékesség egymáshoz viszonyított időpontja is számíthat.',
      advance: '<strong>Előleg:</strong> a teljesítést megelőzően kapott, ellenértékbe beszámítható vagyoni előnynek külön adózási időpontja lehet az Áfa tv. 59. § alapján.',
      partial: '<strong>Részteljesítés:</strong> ha az ügylet természetben osztható és a részteljesítésnek nincs akadálya, az egyes részek külön teljesítésnek minősülhetnek.',
      crossborder: '<strong>Külföldi ügylet:</strong> a teljesítés helye, az adófizetésre kötelezett személy, az EU-s vagy harmadik országbeli státusz és a fordított adózás miatt az egyszerű dátumkalkulátor önmagában nem elég.'
    };
    const update = () => { out.innerHTML = messages[select.value] || messages.single; };
    select.addEventListener('change', update);
    update();
  };

  const renderers = {
    penzugyi: renderFinanceHub,
    'netto-brutto-kalkulator': renderSalary,
    'hitel-torleszto-kalkulator': renderLoanPayment,
    'hitelkepesseg-kalkulator': renderCreditCapacity,
    'lakas-hitel-onero-kalkulator': renderDownPayment,
    'osztalek-kalkulator': renderDividend,
    'etf-kalkulator': renderEtf,
    'milliomos-kalkulator': renderGoal,
    'inflacio-kalkulator': renderInflation,
    'kamatos-kamat-kalkulator': renderCompound,
    'havi-koltsegvetes-kalkulator': renderBudget,
    'fizetesi-hatarido-kalkulator': renderDeadline,
    'szamla-teljesites-kalkulator': renderInvoice
  };

  if (renderers[slug]) renderers[slug]();
})();

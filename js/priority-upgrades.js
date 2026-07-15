(() => {
  "use strict";

  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const root = window.KB_PROJECT_ROOT || "";
  const money = (value) => Number.isFinite(value)
    ? new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(Math.round(value)) + " Ft"
    : "–";
  const decimal = (value, digits = 2) => Number.isFinite(value)
    ? new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value)
    : "–";
  const numberValue = (container, id, fallback = 0) => {
    const input = container.querySelector(`#${id}`);
    if (!input) return fallback;
    const normalized = String(input.value).replace(/\s/g, "").replace(",", ".");
    const value = Number(normalized);
    return Number.isFinite(value) ? value : fallback;
  };
  const checkedValue = (container, name, fallback = "") =>
    container.querySelector(`input[name="${name}"]:checked`)?.value || fallback;
  const selectValue = (container, id, fallback = "") => container.querySelector(`#${id}`)?.value || fallback;
  const payment = (principal, annualRate, years) => {
    const months = Math.max(1, Math.round(years * 12));
    const monthlyRate = annualRate / 100 / 12;
    if (!Number.isFinite(principal) || principal <= 0) return 0;
    if (monthlyRate === 0) return principal / months;
    return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  };
  const principalFromPayment = (monthlyPayment, annualRate, years) => {
    const months = Math.max(1, Math.round(years * 12));
    const monthlyRate = annualRate / 100 / 12;
    if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) return 0;
    if (monthlyRate === 0) return monthlyPayment * months;
    return monthlyPayment * (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
  };
  const futureValue = ({ initial = 0, monthly = 0, annual = 0, years = 0, annualIncrease = 0, annualFee = 0 }) => {
    const months = Math.max(0, Math.round(years * 12));
    const netAnnual = (annual - annualFee) / 100;
    const monthlyRate = Math.pow(1 + netAnnual, 1 / 12) - 1;
    let balance = initial;
    let contribution = monthly;
    const rows = [];
    let invested = initial;
    for (let month = 1; month <= months; month += 1) {
      balance *= 1 + monthlyRate;
      balance += contribution;
      invested += contribution;
      if (month % 12 === 0) {
        rows.push({ year: month / 12, balance, invested });
        contribution *= 1 + annualIncrease / 100;
      }
    }
    return { balance, invested, rows };
  };
  const addSection = (html, anchor = document.querySelector("main")) => {
    if (!anchor || document.querySelector("[data-priority-upgrade]")) return null;
    const wrapper = document.createElement("section");
    wrapper.className = "priority-upgrade";
    wrapper.dataset.priorityUpgrade = page;
    wrapper.innerHTML = html;
    anchor.appendChild(wrapper);
    return wrapper;
  };
  const sourceBlock = (items, reviewed = "2026. július 15.") => `
    <div class="priority-source">
      <h3>Források és módszertani ellenőrzés</h3>
      <ul>${items.map((item) => `<li><a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.label}</a></li>`).join("")}</ul>
      <p><strong>Készítette:</strong> Kovács Patrik. <strong>Szakmai lektorálás:</strong> nem történt. Az oldal tájékoztató kalkulátor; egyedi döntéshez szakember vagy hivatalos szerv adata szükséges.</p>
      <p><strong>Utolsó módszertani ellenőrzés:</strong> ${reviewed}</p>
    </div>`;
  const resultCards = (items) => items.map(([label, value]) => `<div class="priority-result"><span>${label}</span><strong>${value}</strong></div>`).join("");
  const error = (container, message) => {
    const target = container.querySelector("[data-error]");
    if (target) target.textContent = message || "";
  };

  function upgradeCreditCapacity() {
    const section = addSection(`
      <h2>JTM-alapú hitelteherbírás és kamatstressz</h2>
      <p class="priority-upgrade__lead">A jogszabályi felső korlát, egy óvatos háztartási limit és a saját beállított limit egymás mellett látható. A hitelkártya- és folyószámlahitel-keret becsült havi terhe külön megadható.</p>
      <div class="priority-grid">
        <div class="priority-field"><label for="pc-income">Igazolt havi nettó jövedelem</label><input id="pc-income" value="600 000" inputmode="decimal"><small>A bank által elfogadható, igazolt nettó jövedelem.</small></div>
        <div class="priority-field"><label for="pc-existing">Meglévő havi törlesztők</label><input id="pc-existing" value="50 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="pc-card">Hitelkártya-keret</label><input id="pc-card" value="0" inputmode="decimal"><small>A banki beszámítás eltérhet; a tervező 5%-os havi teherrel számol.</small></div>
        <div class="priority-field"><label for="pc-overdraft">Folyószámlahitel-keret</label><input id="pc-overdraft" value="0" inputmode="decimal"><small>A tervező 5%-os havi teherrel számol.</small></div>
        <div class="priority-field"><label for="pc-fix">Kamatperiódus / kamatrögzítés</label><select id="pc-fix"><option value="long">Legalább 10 év vagy végig fix</option><option value="medium">5–10 év</option><option value="short">5 évnél rövidebb</option></select></div>
        <div class="priority-field"><label for="pc-rate">Tervezett éves kamat</label><input id="pc-rate" value="7" inputmode="decimal"></div>
        <div class="priority-field"><label for="pc-stress">Stresszteszt kamata</label><input id="pc-stress" value="10" inputmode="decimal"></div>
        <div class="priority-field"><label for="pc-years">Futamidő</label><input id="pc-years" value="20" inputmode="decimal"></div>
        <div class="priority-field"><label for="pc-buffer">Óvatos biztonsági tartalék</label><input id="pc-buffer" value="15" inputmode="decimal"><small>A jogszabályi plafonból levont százalékpont.</small></div>
        <div class="priority-field"><label for="pc-custom">Saját maximális jövedelemarány</label><input id="pc-custom" value="30" inputmode="decimal"></div>
      </div>
      <div class="priority-actions"><button class="priority-button" type="button" data-calculate>Újraszámolás</button></div>
      <p class="priority-error" data-error aria-live="polite"></p>
      <div class="priority-results" data-results></div>
      <h3>Példák azonos feltételekkel</h3>
      <div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Nettó jövedelem</th><th>Jogszabályi plafon</th><th>Óvatos limit</th><th>Becsült hitelösszeg</th><th>Stressztesztelt hitelösszeg</th></tr></thead><tbody data-examples></tbody></table></div>
      <div class="priority-warning"><strong>Fontos:</strong> a JTM jogszabályi maximum, nem hitelígéret. A bank a jövedelem elfogadhatóságát, a keretek beszámítását, a munkaviszonyt és saját belső szabályait is vizsgálja.</div>
      ${sourceBlock([
        { label: "MNB – adósságfék-szabályok és JTM", href: "https://www.mnb.hu/fogyasztovedelem/hitel-lizing/hitel-lizing/adossagfek-szabalyok" },
        { label: "Nemzeti Jogszabálytár – 32/2014. (IX. 10.) MNB rendelet", href: "https://njt.hu/jogszabaly/2014-32-20-2C" },
        { label: "MNB – hitelfelvétel előtti tájékozódás", href: "https://www.mnb.hu/fogyasztovedelem/hitel-lizing" }
      ])}`);
    if (!section) return;

    const legalRatio = (income, fixation) => {
      const highIncome = income >= 800000;
      if (fixation === "short") return highIncome ? 0.30 : 0.25;
      if (fixation === "medium") return highIncome ? 0.40 : 0.35;
      return highIncome ? 0.60 : 0.50;
    };
    const calculate = () => {
      const income = numberValue(section, "pc-income");
      const existing = numberValue(section, "pc-existing");
      const card = numberValue(section, "pc-card");
      const overdraft = numberValue(section, "pc-overdraft");
      const rate = numberValue(section, "pc-rate");
      const stress = numberValue(section, "pc-stress");
      const years = numberValue(section, "pc-years");
      const buffer = numberValue(section, "pc-buffer");
      const custom = numberValue(section, "pc-custom");
      const fixation = selectValue(section, "pc-fix", "long");
      if (income <= 0 || years <= 0 || rate < 0 || stress < 0) return error(section, "Adj meg érvényes, pozitív jövedelmet és futamidőt.");
      error(section, "");
      const assumedLimits = (card + overdraft) * 0.05;
      const obligations = existing + assumedLimits;
      const legal = legalRatio(income, fixation);
      const cautious = Math.max(0.10, legal - buffer / 100);
      const customRatio = Math.min(legal, Math.max(0.05, custom / 100));
      const legalPayment = Math.max(0, income * legal - obligations);
      const cautiousPayment = Math.max(0, income * cautious - obligations);
      const customPayment = Math.max(0, income * customRatio - obligations);
      const baseLoan = principalFromPayment(cautiousPayment, rate, years);
      const stressLoan = principalFromPayment(cautiousPayment, stress, years);
      section.querySelector("[data-results]").innerHTML = resultCards([
        ["JTM szerinti felső arány", decimal(legal * 100, 0) + "%"],
        ["Keretek becsült havi terhe", money(assumedLimits)],
        ["Jogszabályi új részlet-plafon", money(legalPayment)],
        ["Óvatos új részlet", money(cautiousPayment)],
        ["Saját limit szerinti részlet", money(customPayment)],
        ["Óvatos limitből becsült hitel", money(baseLoan)],
        ["Stresszkamat melletti hitel", money(stressLoan)],
        ["Stressz miatti különbség", money(Math.max(0, baseLoan - stressLoan))]
      ]);
      section.querySelector("[data-examples]").innerHTML = [400000, 600000, 800000].map((exampleIncome) => {
        const ratio = legalRatio(exampleIncome, fixation);
        const safeRatio = Math.max(0.10, ratio - buffer / 100);
        const legalP = Math.max(0, exampleIncome * ratio - obligations);
        const safeP = Math.max(0, exampleIncome * safeRatio - obligations);
        return `<tr><td>${money(exampleIncome)}</td><td>${money(legalP)}</td><td>${money(safeP)}</td><td>${money(principalFromPayment(safeP, rate, years))}</td><td>${money(principalFromPayment(safeP, stress, years))}</td></tr>`;
      }).join("");
    };
    section.addEventListener("input", calculate);
    section.querySelector("[data-calculate]").addEventListener("click", calculate);
    calculate();
  }

  function upgradeDownPayment() {
    const section = addSection(`
      <h2>Teljes lakásvásárlási készpénzigény</h2>
      <p class="priority-upgrade__lead">A vételár, a banki értékbecslés és a járulékos költségek külön szerepelnek, így látható, mikor nem elég önmagában a 10 vagy 20 százalékos önerő.</p>
      <div class="priority-grid">
        <div class="priority-field"><label for="dp-price">Vételár</label><input id="dp-price" value="50 000 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="dp-appraisal">Banki forgalmi érték</label><input id="dp-appraisal" value="50 000 000" inputmode="decimal"><small>A bank a hitelfedezeti korlátot jellemzően a saját értékeléséhez igazítja.</small></div>
        <div class="priority-field"><label for="dp-equity">Tervezett önerő</label><select id="dp-equity"><option value="10">10% – csak jogosultság esetén</option><option value="20" selected>20% – általános tervezési alap</option><option value="30">30% – nagyobb biztonsági sáv</option><option value="custom">Egyedi</option></select></div>
        <div class="priority-field"><label for="dp-custom">Egyedi önerő (%)</label><input id="dp-custom" value="25" inputmode="decimal"></div>
        <div class="priority-field"><label for="dp-duty">Vagyonszerzési illeték (%)</label><input id="dp-duty" value="4" inputmode="decimal"><small>Kedvezmény vagy mentesség esetén módosítsd.</small></div>
        <div class="priority-field"><label for="dp-lawyer">Ügyvédi díj</label><input id="dp-lawyer" value="350 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="dp-valuation">Értékbecslés és banki induló díjak</label><input id="dp-valuation" value="80 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="dp-renovation">Azonnali felújítás</label><input id="dp-renovation" value="1 500 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="dp-moving">Költözés és berendezés</label><input id="dp-moving" value="500 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="dp-reserve">Vásárlás után megmaradó tartalék</label><input id="dp-reserve" value="1 000 000" inputmode="decimal"></div>
      </div>
      <div class="priority-results" data-results></div>
      <div class="priority-note" data-interpretation></div>
      <h3>Mikor nem elég a 20%?</h3>
      <ul class="priority-checklist"><li>Ha a bank alacsonyabb forgalmi értéket állapít meg a vételárnál.</li><li>Ha az ingatlan, a jövedelem vagy a bank belső szabálya szigorúbb finanszírozást kíván.</li><li>Ha az illeték, ügyvéd, felújítás és költözés nincs külön félretéve.</li><li>Ha a vásárlás után nem marad vésztartalék.</li></ul>
      ${sourceBlock([
        { label: "MNB – lakáshitelek és hitelfedezeti szabályok", href: "https://www.mnb.hu/fogyasztovedelem/hitel-lizing/lakashitel" },
        { label: "Nemzeti Jogszabálytár – 32/2014. (IX. 10.) MNB rendelet", href: "https://njt.hu/jogszabaly/2014-32-20-2C" },
        { label: "NAV – ingatlan-adásvétel és illeték", href: "https://nav.gov.hu/ado/illetek/ingatlanadasvetel" }
      ])}`);
    if (!section) return;
    const calculate = () => {
      const price = numberValue(section, "dp-price");
      const appraisal = numberValue(section, "dp-appraisal");
      const scenario = selectValue(section, "dp-equity", "20");
      const equityPercent = scenario === "custom" ? numberValue(section, "dp-custom") : Number(scenario);
      const duty = numberValue(section, "dp-duty");
      const extras = ["dp-lawyer", "dp-valuation", "dp-renovation", "dp-moving", "dp-reserve"].reduce((sum, id) => sum + numberValue(section, id), 0);
      if (price <= 0 || appraisal <= 0 || equityPercent < 0 || equityPercent >= 100) return;
      const ltv = 1 - equityPercent / 100;
      const collateralLoan = appraisal * ltv;
      const targetLoan = price * ltv;
      const loan = Math.max(0, Math.min(collateralLoan, targetLoan));
      const appraisalGap = Math.max(0, price - appraisal);
      const ownForPrice = price - loan;
      const dutyAmount = price * duty / 100;
      const totalCash = ownForPrice + dutyAmount + extras;
      section.querySelector("[data-results]").innerHTML = resultCards([
        ["Becsült maximális hitel", money(loan)],
        ["Vételárhoz szükséges saját pénz", money(ownForPrice)],
        ["Értékbecslési rés", money(appraisalGap)],
        ["Becsült illeték", money(dutyAmount)],
        ["Egyéb költségek és tartalék", money(extras)],
        ["Teljes készpénzigény", money(totalCash)]
      ]);
      section.querySelector("[data-interpretation]").innerHTML = appraisal < price
        ? `<strong>Figyelem:</strong> a banki érték ${money(price - appraisal)} összeggel alacsonyabb a vételárnál, ezért ez a különbség is növeli a saját pénz igényét.`
        : `<strong>Tervezési eredmény:</strong> az értékbecslés nem alacsonyabb a vételárnál, de a banki hitelbírálat ettől még csökkentheti a finanszírozást.`;
    };
    section.addEventListener("input", calculate);
    section.addEventListener("change", calculate);
    calculate();
  }

  function amortization(principal, annualRate, years, prepaymentMonth = 0, prepaymentAmount = 0) {
    const months = Math.max(1, Math.round(years * 12));
    const rate = annualRate / 100 / 12;
    let monthly = payment(principal, annualRate, years);
    let balance = principal;
    let interestTotal = 0;
    const annual = [];
    let yearPrincipal = 0;
    let yearInterest = 0;
    let actualMonths = 0;
    for (let month = 1; month <= months && balance > 0.5; month += 1) {
      const interest = balance * rate;
      let principalPart = Math.min(balance, monthly - interest);
      if (principalPart < 0) principalPart = 0;
      balance -= principalPart;
      yearPrincipal += principalPart;
      yearInterest += interest;
      interestTotal += interest;
      actualMonths = month;
      if (month === prepaymentMonth && prepaymentAmount > 0) {
        const extra = Math.min(balance, prepaymentAmount);
        balance -= extra;
        yearPrincipal += extra;
      }
      if (month % 12 === 0 || balance <= 0.5) {
        annual.push({ year: Math.ceil(month / 12), principal: yearPrincipal, interest: yearInterest, balance: Math.max(0, balance) });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }
    return { monthly, interestTotal, total: principal + interestTotal, annual, months: actualMonths };
  }

  function upgradeLoanComparison() {
    const offerFields = (letter, rate, years) => `
      <fieldset class="priority-fieldset"><legend>${letter}. ajánlat</legend><div class="priority-grid">
        <div class="priority-field"><label for="lc-${letter}-rate">Éves kamat (%)</label><input id="lc-${letter}-rate" value="${rate}" inputmode="decimal"></div>
        <div class="priority-field"><label for="lc-${letter}-years">Futamidő (év)</label><input id="lc-${letter}-years" value="${years}" inputmode="decimal"></div>
        <div class="priority-field"><label for="lc-${letter}-fees">Egyszeri díjak</label><input id="lc-${letter}-fees" value="0" inputmode="decimal"></div>
      </div></fieldset>`;
    const section = addSection(`
      <h2>Három hitelajánlat összehasonlítása</h2>
      <div class="priority-grid">
        <div class="priority-field"><label for="lc-amount">Hitelösszeg</label><input id="lc-amount" value="20 000 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="lc-stress">Stresszteszt kamata (%)</label><input id="lc-stress" value="10" inputmode="decimal"></div>
        <div class="priority-field"><label for="lc-pre-month">Előtörlesztés hónapja</label><input id="lc-pre-month" value="60" inputmode="numeric"></div>
        <div class="priority-field"><label for="lc-pre-amount">Előtörlesztés összege</label><input id="lc-pre-amount" value="2 000 000" inputmode="decimal"></div>
      </div>
      ${offerFields("A", 6.5, 20)}${offerFields("B", 7.2, 15)}${offerFields("C", 8, 25)}
      <div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Ajánlat</th><th>Havi részlet</th><th>Teljes kamat</th><th>Díjakkal teljes teher</th><th>Előtörlesztéssel kamat</th><th>Stresszelt havi részlet</th></tr></thead><tbody data-offers></tbody></table></div>
      <h3>A ajánlat éves tőke–kamat bontása</h3>
      <div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Év</th><th>Tőketörlesztés</th><th>Kamat</th><th>Év végi tartozás</th></tr></thead><tbody data-amortization></tbody></table></div>
      <div class="priority-warning"><strong>Előtörlesztés:</strong> a tervező az eredeti havi részlet megtartása mellett rövidíti a futamidőt. A valós szerződés díja és újraszámítási módja eltérhet.</div>
      ${sourceBlock([
        { label: "MNB – hitel- és lízingtermékek", href: "https://www.mnb.hu/fogyasztovedelem/hitel-lizing" },
        { label: "MNB – Minősített Fogyasztóbarát Lakáshitel", href: "https://www.mnb.hu/minositett-fogyasztobarat-lakashitel" },
        { label: "MNB – hitelkalkulátor és összehasonlítás", href: "https://hitelvalaszto.mnb.hu/" }
      ])}`);
    if (!section) return;
    const calculate = () => {
      const amount = numberValue(section, "lc-amount");
      const stress = numberValue(section, "lc-stress");
      const preMonth = Math.round(numberValue(section, "lc-pre-month"));
      const preAmount = numberValue(section, "lc-pre-amount");
      const letters = ["A", "B", "C"];
      const rows = [];
      let first = null;
      letters.forEach((letter) => {
        const rate = numberValue(section, `lc-${letter}-rate`);
        const years = numberValue(section, `lc-${letter}-years`);
        const fees = numberValue(section, `lc-${letter}-fees`);
        const base = amortization(amount, rate, years);
        const prepaid = amortization(amount, rate, years, preMonth, preAmount);
        const stressMonthly = payment(amount, stress, years);
        rows.push(`<tr><td>${letter}</td><td>${money(base.monthly)}</td><td>${money(base.interestTotal)}</td><td>${money(base.total + fees)}</td><td>${money(prepaid.interestTotal)}</td><td>${money(stressMonthly)}</td></tr>`);
        if (letter === "A") first = base;
      });
      section.querySelector("[data-offers]").innerHTML = rows.join("");
      section.querySelector("[data-amortization]").innerHTML = (first?.annual || []).map((row) => `<tr><td>${row.year}.</td><td>${money(row.principal)}</td><td>${money(row.interest)}</td><td>${money(row.balance)}</td></tr>`).join("");
    };
    section.addEventListener("input", calculate);
    calculate();
  }

  function upgradeMillionaire() {
    const section = addSection(`
      <h2>Célösszeg-tervező három hozampályával</h2>
      <div class="priority-grid">
        <div class="priority-field"><label for="mi-target">Célösszeg mai pénzben</label><input id="mi-target" value="100 000 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="mi-initial">Kezdőtőke</label><input id="mi-initial" value="1 000 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="mi-monthly">Havi befizetés</label><input id="mi-monthly" value="100 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="mi-increase">Befizetés éves emelése (%)</label><input id="mi-increase" value="5" inputmode="decimal"></div>
        <div class="priority-field"><label for="mi-inflation">Infláció (%)</label><input id="mi-inflation" value="3" inputmode="decimal"></div>
      </div>
      <div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Forgatókönyv</th><th>Éves hozam</th><th>Cél elérésének éve</th><th>Nominális vagyon</th><th>Mai vásárlóérték</th></tr></thead><tbody data-scenarios></tbody></table></div>
      ${sourceBlock([{ label: "MNB – megtakarítások és befektetések", href: "https://www.mnb.hu/fogyasztovedelem/megtakaritasok-befektetesek" }])}`);
    if (!section) return;
    const calculate = () => {
      const targetReal = numberValue(section, "mi-target");
      const initial = numberValue(section, "mi-initial");
      const monthly = numberValue(section, "mi-monthly");
      const increase = numberValue(section, "mi-increase");
      const inflation = numberValue(section, "mi-inflation");
      const scenarios = [["Óvatos", 3], ["Közép", 6], ["Kedvező", 9]];
      section.querySelector("[data-scenarios]").innerHTML = scenarios.map(([name, rate]) => {
        let reached = null;
        let result = null;
        for (let years = 1; years <= 60; years += 1) {
          result = futureValue({ initial, monthly, annual: rate, years, annualIncrease: increase });
          const real = result.balance / Math.pow(1 + inflation / 100, years);
          if (real >= targetReal) { reached = years; break; }
        }
        const years = reached || 60;
        result = futureValue({ initial, monthly, annual: rate, years, annualIncrease: increase });
        const real = result.balance / Math.pow(1 + inflation / 100, years);
        return `<tr><td>${name}</td><td>${rate}%</td><td>${reached ? reached + " év" : "60 éven túl"}</td><td>${money(result.balance)}</td><td>${money(real)}</td></tr>`;
      }).join("");
    };
    section.addEventListener("input", calculate);
    calculate();
  }

  function upgradeInflation() {
    const section = addSection(`
      <h2>Múltbeli és jövőbeli inflációs mód</h2>
      <div class="priority-tabs" role="tablist"><button type="button" aria-selected="true" data-mode="future">Jövőbeli becslés</button><button type="button" aria-selected="false" data-mode="past">Múltbeli indexek</button></div>
      <div class="priority-grid">
        <div class="priority-field"><label for="in-amount">Kiinduló összeg</label><input id="in-amount" value="1 000 000" inputmode="decimal"></div>
        <div class="priority-field" data-future><label for="in-rate">Éves infláció (%)</label><input id="in-rate" value="3" inputmode="decimal"></div>
        <div class="priority-field" data-future><label for="in-years">Évek száma</label><input id="in-years" value="10" inputmode="numeric"></div>
        <div class="priority-field" data-past hidden><label for="in-start-index">Kezdő fogyasztóiár-index</label><input id="in-start-index" value="100" inputmode="decimal"></div>
        <div class="priority-field" data-past hidden><label for="in-end-index">Záró fogyasztóiár-index</label><input id="in-end-index" value="135" inputmode="decimal"></div>
      </div>
      <div class="priority-results" data-results></div>
      <div class="priority-table-wrap" data-breakdown-wrap><table class="priority-table"><thead><tr><th>Év</th><th>Azonos vásárlóerőhöz szükséges összeg</th><th>Kiinduló összeg reálértéke</th></tr></thead><tbody data-breakdown></tbody></table></div>
      ${sourceBlock([
        { label: "KSH – fogyasztói árak és infláció", href: "https://www.ksh.hu/fogyasztoi_arak" },
        { label: "MNB – inflációs jelentések", href: "https://www.mnb.hu/kiadvanyok/jelentesek/inflacios-jelentes" }
      ])}`);
    if (!section) return;
    let mode = "future";
    section.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
      mode = button.dataset.mode;
      section.querySelectorAll("[data-mode]").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
      section.querySelectorAll("[data-future]").forEach((item) => item.hidden = mode !== "future");
      section.querySelectorAll("[data-past]").forEach((item) => item.hidden = mode !== "past");
      calculate();
    }));
    const calculate = () => {
      const amount = numberValue(section, "in-amount");
      if (mode === "past") {
        const start = numberValue(section, "in-start-index");
        const end = numberValue(section, "in-end-index");
        const factor = start > 0 ? end / start : 0;
        section.querySelector("[data-results]").innerHTML = resultCards([
          ["Árváltozási tényező", decimal(factor, 4)],
          ["Azonos vásárlóerőhöz szükséges összeg", money(amount * factor)],
          ["Kumulált árszintváltozás", decimal((factor - 1) * 100, 2) + "%"]
        ]);
        section.querySelector("[data-breakdown-wrap]").hidden = true;
        return;
      }
      const rate = numberValue(section, "in-rate");
      const years = Math.max(1, Math.round(numberValue(section, "in-years")));
      const needed = amount * Math.pow(1 + rate / 100, years);
      const real = amount / Math.pow(1 + rate / 100, years);
      section.querySelector("[data-results]").innerHTML = resultCards([["Jövőbeni azonos vásárlóerő", money(needed)], ["Kiinduló összeg jövőbeni reálértéke", money(real)], ["Kumulált áremelkedés", decimal((needed / amount - 1) * 100, 2) + "%"]]);
      section.querySelector("[data-breakdown-wrap]").hidden = false;
      section.querySelector("[data-breakdown]").innerHTML = Array.from({ length: years }, (_, index) => {
        const year = index + 1;
        return `<tr><td>${year}.</td><td>${money(amount * Math.pow(1 + rate / 100, year))}</td><td>${money(amount / Math.pow(1 + rate / 100, year))}</td></tr>`;
      }).join("");
    };
    section.addEventListener("input", calculate);
    calculate();
  }

  function upgradeCompound() {
    const section = addSection(`
      <h2>Kamatos kamat költséggel, adóval és inflációval</h2>
      <div class="priority-grid">
        <div class="priority-field"><label for="cc-initial">Kezdőtőke</label><input id="cc-initial" value="500 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="cc-contribution">Rendszeres befizetés</label><input id="cc-contribution" value="50 000" inputmode="decimal"></div>
        <div class="priority-field"><label for="cc-frequency">Befizetés gyakorisága</label><select id="cc-frequency"><option value="monthly">Havi</option><option value="annual">Éves</option></select></div>
        <div class="priority-field"><label for="cc-return">Éves bruttó hozam (%)</label><input id="cc-return" value="7" inputmode="decimal"></div>
        <div class="priority-field"><label for="cc-fee">Éves költség (%)</label><input id="cc-fee" value="0.3" inputmode="decimal"></div>
        <div class="priority-field"><label for="cc-tax">Nyereség becsült adója (%)</label><input id="cc-tax" value="0" inputmode="decimal"></div>
        <div class="priority-field"><label for="cc-inflation">Infláció (%)</label><input id="cc-inflation" value="3" inputmode="decimal"></div>
        <div class="priority-field"><label for="cc-years">Időtáv (év)</label><input id="cc-years" value="20" inputmode="numeric"></div>
      </div>
      <div class="priority-results" data-results></div><div class="priority-chart" data-chart aria-label="Éves portfólióérték"></div>
      ${sourceBlock([{ label: "MNB – megtakarítások és befektetések", href: "https://www.mnb.hu/fogyasztovedelem/megtakaritasok-befektetesek" }])}`);
    if (!section) return;
    const calculate = () => {
      const initial = numberValue(section, "cc-initial");
      const contribution = numberValue(section, "cc-contribution");
      const frequency = selectValue(section, "cc-frequency", "monthly");
      const monthly = frequency === "monthly" ? contribution : contribution / 12;
      const annual = numberValue(section, "cc-return");
      const fee = numberValue(section, "cc-fee");
      const tax = numberValue(section, "cc-tax");
      const inflation = numberValue(section, "cc-inflation");
      const years = Math.max(1, Math.round(numberValue(section, "cc-years")));
      const result = futureValue({ initial, monthly, annual, years, annualFee: fee });
      const grossGain = Math.max(0, result.balance - result.invested);
      const taxAmount = grossGain * tax / 100;
      const afterTax = result.balance - taxAmount;
      const real = afterTax / Math.pow(1 + inflation / 100, years);
      section.querySelector("[data-results]").innerHTML = resultCards([["Saját befizetés", money(result.invested)], ["Adó előtti végösszeg", money(result.balance)], ["Becsült adó", money(taxAmount)], ["Adó utáni végösszeg", money(afterTax)], ["Mai vásárlóértéken", money(real)], ["Költség utáni éves feltételezés", decimal(annual - fee, 2) + "%"]]);
      const max = Math.max(...result.rows.map((row) => row.balance), 1);
      section.querySelector("[data-chart]").innerHTML = result.rows.map((row) => `<div class="priority-chart__bar" style="height:${Math.max(2, row.balance / max * 190)}px" title="${row.year}. év: ${money(row.balance)}"><span>${row.year}.</span></div>`).join("");
    };
    section.addEventListener("input", calculate);
    section.addEventListener("change", calculate);
    calculate();
  }

  function upgradeBudget() {
    const categories = [["Lakhatás", "bu-home", 220000], ["Élelmiszer", "bu-food", 120000], ["Közlekedés", "bu-transport", 60000], ["Hitelek", "bu-loans", 45000], ["Gyermek és család", "bu-family", 60000], ["Egészség", "bu-health", 20000], ["Szórakozás", "bu-leisure", 30000], ["Egyéb", "bu-other", 25000]];
    const section = addSection(`
      <h2>Részletes havi költségvetés és vésztartalék</h2>
      <div class="priority-grid"><div class="priority-field"><label for="bu-income">Háztartás nettó bevétele</label><input id="bu-income" value="850 000" inputmode="decimal"></div>${categories.map(([label, id, value]) => `<div class="priority-field"><label for="${id}">${label}</label><input id="${id}" value="${new Intl.NumberFormat("hu-HU").format(value)}" inputmode="decimal"></div>`).join("")}<div class="priority-field"><label for="bu-current-reserve">Jelenlegi vésztartalék</label><input id="bu-current-reserve" value="1 000 000" inputmode="decimal"></div><div class="priority-field"><label for="bu-target-months">Célzott tartalék (hónap)</label><input id="bu-target-months" value="6" inputmode="numeric"></div></div>
      <div class="priority-results" data-results></div>
      <div class="priority-actions"><button class="priority-button priority-button--secondary" type="button" data-download>Összesítő letöltése CSV-ben</button></div>
      ${sourceBlock([{ label: "MNB – háztartási költségvetés és pénzügyi tervezés", href: "https://www.mnb.hu/fogyasztovedelem/csaladi-penzugyek" }])}`);
    if (!section) return;
    let latest = {};
    const calculate = () => {
      const income = numberValue(section, "bu-income");
      const values = categories.map(([label, id]) => [label, numberValue(section, id)]);
      const expenses = values.reduce((sum, [, value]) => sum + value, 0);
      const savings = income - expenses;
      const rate = income > 0 ? savings / income * 100 : 0;
      const reserve = numberValue(section, "bu-current-reserve");
      const months = Math.max(1, numberValue(section, "bu-target-months"));
      const essential = values.filter(([label]) => !["Szórakozás", "Egyéb"].includes(label)).reduce((sum, [, value]) => sum + value, 0);
      const target = essential * months;
      latest = { income, values, expenses, savings, rate, essential, target, reserve };
      section.querySelector("[data-results]").innerHTML = resultCards([["Összes kiadás", money(expenses)], ["Havi maradvány", money(savings)], ["Megtakarítási ráta", decimal(rate, 1) + "%"], ["Alapvető havi kiadás", money(essential)], ["Vésztartalék cél", money(target)], ["Tartalékhiány / többlet", money(reserve - target)]]);
    };
    section.addEventListener("input", calculate);
    section.querySelector("[data-download]").addEventListener("click", () => {
      const rows = [["Kategória", "Havi összeg"], ["Bevétel", latest.income], ...latest.values, ["Összes kiadás", latest.expenses], ["Havi maradvány", latest.savings], ["Vésztartalék cél", latest.target]];
      const blob = new Blob(["\ufeff" + rows.map((row) => row.join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "havi-koltsegvetes-osszefoglalo.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    });
    calculate();
  }

  const hungarianHolidays2026 = new Set(["2026-01-01", "2026-04-03", "2026-04-06", "2026-05-01", "2026-05-25", "2026-08-20", "2026-10-23", "2026-11-01", "2026-12-25", "2026-12-26"]);
  const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const addBusinessDays = (start, days) => {
    const date = new Date(start);
    let remaining = days;
    while (remaining > 0) {
      date.setDate(date.getDate() + 1);
      const weekend = date.getDay() === 0 || date.getDay() === 6;
      if (!weekend && !hungarianHolidays2026.has(iso(date))) remaining -= 1;
    }
    return date;
  };
  function upgradePaymentDeadline() {
    const section = addSection(`
      <h2>Naptári vagy munkanapos fizetési határidő</h2>
      <div class="priority-grid"><div class="priority-field"><label for="pd-start">Kiinduló dátum</label><input id="pd-start" type="date"></div><div class="priority-field"><label for="pd-days">Határidő hossza</label><input id="pd-days" value="8" inputmode="numeric"></div><div class="priority-field"><label for="pd-mode">Számítás módja</label><select id="pd-mode"><option value="calendar">Naptári nap</option><option value="business">Munkanap</option></select></div><div class="priority-field"><label for="pd-contract">Szerződéses korrekció (nap)</label><input id="pd-contract" value="0" inputmode="numeric"></div></div>
      <div class="priority-results" data-results></div>
      <div class="priority-warning">A szerződés, ágazati szabály, ünnepnapi munkarend és jogszabály módosíthatja a határidőt. A beépített munkaszüneti naplista 2026-ra készült, az áthelyezett munkanapokat külön ellenőrizd.</div>
      ${sourceBlock([{ label: "Nemzeti Jogszabálytár – Polgári Törvénykönyv", href: "https://njt.hu/jogszabaly/2013-5-00-00" }, { label: "NAV – számlázási tájékoztatók", href: "https://nav.gov.hu/ado/afa" }])}`);
    if (!section) return;
    section.querySelector("#pd-start").value = new Date().toISOString().slice(0, 10);
    const calculate = () => {
      const startValue = section.querySelector("#pd-start").value;
      if (!startValue) return;
      const start = new Date(startValue + "T12:00:00");
      const days = Math.max(0, Math.round(numberValue(section, "pd-days")));
      const correction = Math.round(numberValue(section, "pd-contract"));
      const mode = selectValue(section, "pd-mode", "calendar");
      let due;
      if (mode === "business") due = addBusinessDays(start, days);
      else { due = new Date(start); due.setDate(due.getDate() + days); }
      due.setDate(due.getDate() + correction);
      section.querySelector("[data-results]").innerHTML = resultCards([["Számított határnap", due.toLocaleDateString("hu-HU", { weekday: "long", year: "numeric", month: "long", day: "numeric" })], ["Számítás típusa", mode === "business" ? "munkanap" : "naptári nap"], ["Szerződéses korrekció", correction + " nap"]]);
    };
    section.addEventListener("input", calculate);
    section.addEventListener("change", calculate);
    calculate();
  }

  function upgradeInvoicePerformance() {
    const section = addSection(`
      <h2>Teljesítési időpont – gyakori számlázási helyzetek</h2>
      <div class="priority-grid"><div class="priority-field"><label for="iv-type">Ügylet típusa</label><select id="iv-type"><option value="single">Egyszeri teljesítés</option><option value="periodic">Időszakos elszámolás</option><option value="advance">Előleg</option></select></div><div class="priority-field"><label for="iv-physical">Tényleges teljesítés / időszak vége</label><input id="iv-physical" type="date"></div><div class="priority-field"><label for="iv-issue">Számla kelte</label><input id="iv-issue" type="date"></div><div class="priority-field"><label for="iv-due">Fizetési határidő</label><input id="iv-due" type="date"></div><div class="priority-field"><label for="iv-advance">Előleg jóváírása</label><input id="iv-advance" type="date"></div></div>
      <div class="priority-results" data-results></div><div class="priority-note" data-explanation></div>
      <div class="priority-warning"><strong>Jogi korlát:</strong> az időszakos elszámolás szabályai több dátumtól és kivételtől függnek. A kalkulátor gyakori alapesetet modellez, könyvelési vagy adótanácsadási döntést nem helyettesít.</div>
      ${sourceBlock([{ label: "NAV – általános forgalmi adó és számlázás", href: "https://nav.gov.hu/ado/afa" }, { label: "Nemzeti Jogszabálytár – 2007. évi CXXVII. törvény az áfáról", href: "https://njt.hu/jogszabaly/2007-127-00-00" }])}`);
    if (!section) return;
    const today = new Date().toISOString().slice(0, 10);
    ["iv-physical", "iv-issue", "iv-due", "iv-advance"].forEach((id) => section.querySelector(`#${id}`).value = today);
    const dateValue = (id) => new Date(section.querySelector(`#${id}`).value + "T12:00:00");
    const calculate = () => {
      const type = selectValue(section, "iv-type", "single");
      const physical = dateValue("iv-physical");
      const issue = dateValue("iv-issue");
      const due = dateValue("iv-due");
      const advance = dateValue("iv-advance");
      let performance = physical;
      let explanation = "Egyszeri ügyletnél főszabály szerint a tényleges teljesítés időpontja a kiindulópont.";
      if (type === "advance") {
        performance = advance;
        explanation = "Előlegnél az adófizetési pont jellemzően az előleg jóváírásához vagy kézhezvételéhez kapcsolódik, a végszámla külön kezelendő.";
      } else if (type === "periodic") {
        performance = due;
        explanation = "Időszakos elszámolásnál gyakori alapesetben a fizetési határidő a teljesítési időpont, de a számla kelte, az időszak vége, a 60 napos korlát és kivételek módosíthatják.";
        const max = new Date(physical); max.setDate(max.getDate() + 60);
        if (performance > max) { performance = max; explanation += " A megadott határidő miatt a tervező a 60. napot jelölte meg ellenőrzési pontként."; }
        if (issue < physical && due < physical) { performance = issue; explanation += " Mivel a számla kelte és a fizetési határidő is az időszak vége elé esik, a számla kelte lehet meghatározó."; }
      }
      section.querySelector("[data-results]").innerHTML = resultCards([["Becsült teljesítési időpont", performance.toLocaleDateString("hu-HU")], ["Ügylet típusa", type === "single" ? "egyszeri" : type === "periodic" ? "időszakos" : "előleg"]]);
      section.querySelector("[data-explanation]").textContent = explanation;
    };
    section.addEventListener("input", calculate);
    section.addEventListener("change", calculate);
    calculate();
  }

  function upgradeVat() {
    const section = addSection(`
      <h2>ÁFA-kulcsok, nettó–bruttó és adómentes jelölések</h2>
      <div class="priority-grid"><div class="priority-field"><label for="vat-amount">Összeg</label><input id="vat-amount" value="100 000" inputmode="decimal"></div><div class="priority-field"><label for="vat-direction">Kiinduló összeg</label><select id="vat-direction"><option value="net">Nettó</option><option value="gross">Bruttó</option></select></div><div class="priority-field"><label for="vat-rate">ÁFA-kulcs</label><select id="vat-rate"><option value="27">27%</option><option value="18">18%</option><option value="5">5%</option><option value="0">0%</option></select></div></div>
      <div class="priority-results" data-results></div>
      <div class="priority-note"><strong>0% nem ugyanaz, mint az alanyi adómentesség.</strong> A 0%-os adómérték, a tárgyi mentesség, az alanyi mentesség és a területi hatályon kívüli ügylet eltérő jogcím és számlajelölés lehet. A kalkulátor csak matematikai bontást végez.</div>
      ${sourceBlock([{ label: "NAV – általános forgalmi adó", href: "https://nav.gov.hu/ado/afa" }, { label: "NAV – áfakulcsok és tárgyi adómentes tevékenységek", href: "https://nav.gov.hu/ugyfeliranytu/adokulcsok_jarulekmertekek/afakulcsok" }, { label: "Nemzeti Jogszabálytár – Áfa tv.", href: "https://njt.hu/jogszabaly/2007-127-00-00" }])}`);
    if (!section) return;
    const calculate = () => {
      const amount = numberValue(section, "vat-amount");
      const direction = selectValue(section, "vat-direction", "net");
      const rate = Number(selectValue(section, "vat-rate", "27"));
      const factor = 1 + rate / 100;
      const net = direction === "net" ? amount : amount / factor;
      const gross = direction === "gross" ? amount : amount * factor;
      section.querySelector("[data-results]").innerHTML = resultCards([["Nettó összeg", money(net)], ["ÁFA összege", money(gross - net)], ["Bruttó összeg", money(gross)], ["Kulcs", rate + "%"]]);
    };
    section.addEventListener("input", calculate);
    section.addEventListener("change", calculate);
    calculate();
  }

  const healthSources = {
    pregnancy: [
      { label: "ACOG – Methods for Estimating the Due Date", href: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date" },
      { label: "NHS – Due date calculator and pregnancy guidance", href: "https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/" }
    ],
    pulse: [
      { label: "American Heart Association – Target Heart Rates", href: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates" },
      { label: "Tanaka és mtsai. – életkor alapján becsült maximális pulzus", href: "https://pubmed.ncbi.nlm.nih.gov/11153730/" }
    ],
    water: [
      { label: "EFSA – Dietary Reference Values for water", href: "https://www.efsa.europa.eu/en/efsajournal/pub/1459" },
      { label: "NHS – Water, drinks and hydration", href: "https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/" }
    ],
    bodyfat: [
      { label: "U.S. Department of Defense – body composition standards", href: "https://www.esd.whs.mil/Directives/issuances/dodi/" },
      { label: "CDC – Healthy Weight and Growth", href: "https://www.cdc.gov/healthy-weight-growth/" }
    ],
    whr: [{ label: "WHO – Waist circumference and waist–hip ratio report", href: "https://www.who.int/publications/i/item/9789241501491" }],
    sleep: [{ label: "CDC – How Much Sleep Do I Need?", href: "https://www.cdc.gov/sleep/about/index.html" }, { label: "American Academy of Sleep Medicine – sleep duration recommendations", href: "https://aasm.org/resources/pdf/sleepdurationrecommendations.pdf" }],
    bmi: [{ label: "WHO – BMI classification", href: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index" }, { label: "CDC – About Adult BMI", href: "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" }],
    nutrition: [{ label: "Mifflin–St Jeor equation – original publication", href: "https://pubmed.ncbi.nlm.nih.gov/2305711/" }, { label: "EFSA – Dietary Reference Values", href: "https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values" }, { label: "WHO – Healthy diet", href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet" }]
  };

  function healthBase(title, intro, body, sources) {
    return addSection(`<h2>${title}</h2><p class="priority-upgrade__lead">${intro}</p>${body}${sourceBlock(sources)}`);
  }

  function upgradePregnancy() {
    const section = healthBase("Terhességi datálás: ciklus és IVF külön", "A menstruációból számított terminus becslés. IVF esetén az embriótranszfer dátuma és az embrió életkora alkalmasabb kiindulópont.", `
      <div class="priority-grid"><div class="priority-field"><label for="pr-mode">Számítás módja</label><select id="pr-mode"><option value="lmp">Utolsó menstruáció</option><option value="ivf">IVF embriótranszfer</option></select></div><div class="priority-field" data-lmp><label for="pr-lmp">Utolsó menstruáció első napja</label><input id="pr-lmp" type="date"></div><div class="priority-field" data-lmp><label for="pr-cycle">Átlagos ciklushossz</label><input id="pr-cycle" value="28" inputmode="numeric"></div><div class="priority-field" data-ivf hidden><label for="pr-transfer">Embriótranszfer dátuma</label><input id="pr-transfer" type="date"></div><div class="priority-field" data-ivf hidden><label for="pr-age">Embrió életkora a transzferkor</label><select id="pr-age"><option value="5">5 napos blastocysta</option><option value="3">3 napos embrió</option></select></div></div>
      <div class="priority-results" data-results></div>
      <div class="priority-warning"><strong>Sürgős ellátás:</strong> erős vagy egyoldali alhasi fájdalom, jelentős vérzés, ájulás, nehézlégzés vagy súlyos rosszullét esetén ne kalkulátorra várj, hanem kérj azonnal egészségügyi segítséget.</div>`, healthSources.pregnancy);
    if (!section) return;
    const today = new Date();
    const defaultDate = new Date(today); defaultDate.setDate(defaultDate.getDate() - 70);
    section.querySelector("#pr-lmp").value = defaultDate.toISOString().slice(0, 10);
    section.querySelector("#pr-transfer").value = defaultDate.toISOString().slice(0, 10);
    const calculate = () => {
      const mode = selectValue(section, "pr-mode", "lmp");
      section.querySelectorAll("[data-lmp]").forEach((item) => item.hidden = mode !== "lmp");
      section.querySelectorAll("[data-ivf]").forEach((item) => item.hidden = mode !== "ivf");
      let due;
      let basis;
      if (mode === "ivf") {
        const transfer = new Date(section.querySelector("#pr-transfer").value + "T12:00:00");
        const embryoAge = Number(selectValue(section, "pr-age", "5"));
        due = new Date(transfer); due.setDate(due.getDate() + (266 - embryoAge));
        basis = `${embryoAge} napos embrió transzferéből`;
      } else {
        const lmp = new Date(section.querySelector("#pr-lmp").value + "T12:00:00");
        const cycle = numberValue(section, "pr-cycle", 28);
        due = new Date(lmp); due.setDate(due.getDate() + 280 + cycle - 28);
        basis = `${cycle} napos átlagos ciklusból`;
      }
      section.querySelector("[data-results]").innerHTML = resultCards([["Becsült terminus", due.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })], ["Számítás alapja", basis], ["Bizonytalanság", "orvosi datálás felülírhatja"]]);
    };
    section.addEventListener("input", calculate); section.addEventListener("change", calculate); calculate();
  }

  function upgradePulse() {
    const section = healthBase("Pulzuszónák több maximálispulzus-becsléssel", "A 220 − életkor és a Tanaka-képlet eltérő becslést adhat. A Karvonen-mód a nyugalmi pulzust is figyelembe veszi.", `
      <div class="priority-grid"><div class="priority-field"><label for="pu-age">Életkor</label><input id="pu-age" value="33" inputmode="numeric"></div><div class="priority-field"><label for="pu-rest">Nyugalmi pulzus</label><input id="pu-rest" value="60" inputmode="numeric"></div><div class="priority-field"><label for="pu-formula">Maximális pulzus képlete</label><select id="pu-formula"><option value="tanaka">Tanaka: 208 − 0,7 × életkor</option><option value="classic">Klasszikus: 220 − életkor</option></select></div></div><div class="priority-results" data-results></div><div class="priority-warning">Béta-blokkoló, szív- és érrendszeri betegség, mellkasi fájdalom, szédülés vagy szokatlan légszomj esetén a pulzuscélokat orvossal kell egyeztetni.</div>`, healthSources.pulse);
    if (!section) return;
    const calculate = () => {
      const age = numberValue(section, "pu-age"); const rest = numberValue(section, "pu-rest"); const formula = selectValue(section, "pu-formula", "tanaka");
      const max = formula === "classic" ? 220 - age : 208 - 0.7 * age; const reserve = max - rest;
      const zone = (low, high) => `${Math.round(rest + reserve * low)}–${Math.round(rest + reserve * high)} bpm`;
      section.querySelector("[data-results]").innerHTML = resultCards([["Becsült maximális pulzus", Math.round(max) + " bpm"], ["Könnyű 50–60%", zone(.5, .6)], ["Közepes 60–70%", zone(.6, .7)], ["Intenzív 70–85%", zone(.7, .85)], ["220 − életkor kontroll", Math.round(220 - age) + " bpm"], ["Tanaka kontroll", Math.round(208 - .7 * age) + " bpm"]]);
    };
    section.addEventListener("input", calculate); section.addEventListener("change", calculate); calculate();
  }

  function upgradeWater() {
    const section = healthBase("Folyadékigény tartományként, nem egyetlen igazságként", "A testsúlyalapú eredmény csak tervezési tartomány. Az étellel bevitt víz, hőség, sport, terhesség, szoptatás, betegség és gyógyszerek módosíthatják.", `
      <div class="priority-grid"><div class="priority-field"><label for="wa-weight">Testsúly</label><input id="wa-weight" value="70" inputmode="decimal"></div><div class="priority-field"><label for="wa-exercise">Edzés miatti plusz (ml)</label><input id="wa-exercise" value="0" inputmode="decimal"></div><div class="priority-field"><label for="wa-heat">Hőség miatti plusz (ml)</label><input id="wa-heat" value="0" inputmode="decimal"></div><div class="priority-field"><label for="wa-life">Élethelyzet</label><select id="wa-life"><option value="0">Általános felnőtt</option><option value="300">Várandósság – tájékoztató plusz</option><option value="700">Szoptatás – tájékoztató plusz</option></select></div></div><div class="priority-results" data-results></div><div class="priority-warning">Szív-, vese- vagy májbetegség, ödéma, vízhajtó kezelés vagy orvos által előírt folyadékkorlátozás esetén ezt a kalkulátort ne használd személyes célérték meghatározására.</div>`, healthSources.water);
    if (!section) return;
    const calculate = () => { const weight = numberValue(section, "wa-weight"); const extra = numberValue(section, "wa-exercise") + numberValue(section, "wa-heat") + Number(selectValue(section, "wa-life", "0")); const low = weight * 30 + extra; const high = weight * 35 + extra; section.querySelector("[data-results]").innerHTML = resultCards([["Tájékoztató ital-tartomány", `${decimal(low / 1000, 2)}–${decimal(high / 1000, 2)} liter/nap`], ["Plusz korrekció", decimal(extra, 0) + " ml"], ["2,5 dl-es poharak", `${Math.round(low / 250)}–${Math.round(high / 250)} pohár`]]); };
    section.addEventListener("input", calculate); section.addEventListener("change", calculate); calculate();
  }

  function upgradeBodyFat() {
    const figure = `<div class="priority-health-figure"><svg viewBox="0 0 520 240" role="img" aria-label="Mérési pontok sematikus ábrája"><rect x="1" y="1" width="518" height="238" rx="18" fill="none" stroke="currentColor" opacity=".18"/><circle cx="150" cy="45" r="24" fill="none" stroke="currentColor" stroke-width="4"/><path d="M150 69v85M95 102h110M150 154l-38 64M150 154l38 64" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M122 78c18 10 38 10 56 0M108 126c28 12 56 12 84 0M102 151c32 15 64 15 96 0" fill="none" stroke="#2563eb" stroke-width="5"/><text x="250" y="82" font-size="17" fill="currentColor">Nyak: vízszintesen, az ádámcsutka alatt</text><text x="250" y="130" font-size="17" fill="currentColor">Derék: az előírt mérési ponton, nyugodt kilégzésnél</text><text x="250" y="178" font-size="17" fill="currentColor">Csípő: nőknél a legszélesebb ponton</text></svg></div>`;
    healthBase("US Navy testzsírbecslés – mérési pontok és hibahatár", "A körméretes képlet trendkövetésre használható, de mérési hiba és egyéni testalkat miatt több százalékpontos eltérés is előfordulhat.", `${figure}<ul class="priority-checklist"><li>Mindig azonos napszakban és azonos mérési ponton mérj.</li><li>A szalag simuljon, de ne vágjon a bőrbe.</li><li>Az eredményt inkább több mérés trendjeként értelmezd.</li><li>Laboratóriumi vagy klinikai testösszetétel-vizsgálat eltérhet.</li></ul><div class="priority-warning">A kalkulátor nem gyermekek, várandósság vagy speciális testalkat klinikai értékelésére készült.</div>`, healthSources.bodyfat);
  }

  function upgradeWhr() {
    healthBase("Derék–csípő arány nemenkénti értelmezése", "A WHO általános kockázati küszöbei tájékozódási pontok; nem diagnózisok, és etnikai, életkori, testalkati eltérések lehetnek.", `<div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Értelmezés</th><th>Nők</th><th>Férfiak</th></tr></thead><tbody><tr><td>WHO általános magasabb kockázati küszöb</td><td>0,85 felett</td><td>0,90 felett</td></tr></tbody></table></div><ul class="priority-checklist"><li>A derekat a bordaív és csípőlapát közötti középponton mérd.</li><li>A csípőt a legszélesebb ponton mérd.</li><li>Ne húzd be a hasad, és ne szorítsd meg a szalagot.</li></ul>`, healthSources.whr);
  }

  function upgradeSleep() {
    healthBase("Alvásciklus helyett elsőként a megfelelő alvásidő", "A 90 perces ciklus csak átlagos közelítés. A ciklusok hossza egyénenként és ugyanazon éjszakán belül is változik.", `<div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Életkor</th><th>Általános napi ajánlott alvásidő</th></tr></thead><tbody><tr><td>6–12 év</td><td>9–12 óra</td></tr><tr><td>13–18 év</td><td>8–10 óra</td></tr><tr><td>18–60 év</td><td>legalább 7 óra</td></tr><tr><td>61–64 év</td><td>7–9 óra</td></tr><tr><td>65 év felett</td><td>7–8 óra</td></tr></tbody></table></div><div class="priority-warning">Rendszeres hangos horkolás, légzéskimaradás, tartós nappali álmosság vagy elalvás közlekedés közben kivizsgálást igényelhet.</div>`, healthSources.sleep);
  }

  function upgradeWeightRange() {
    const section = healthBase("Tájékoztató testsúlytartomány-kalkulátor", "Az egyetlen „ideális testsúly” helyett a felnőtt BMI 18,5–24,9 tartományához tartozó testsúlysávot mutatjuk. Ez sem alkalmas minden testalkatra.", `<div class="priority-grid"><div class="priority-field"><label for="wr-height">Magasság (cm)</label><input id="wr-height" value="169" inputmode="decimal"></div></div><div class="priority-results" data-results></div><div class="priority-warning">Sportolóknál, nagy izomtömegnél, várandósságban, gyermekeknél és idősebb korban a BMI-alapú testsúlysáv félrevezető lehet.</div>`, healthSources.bmi);
    if (!section) return;
    const heading = document.querySelector("h1"); if (heading) heading.textContent = "Tájékoztató testsúlytartomány-kalkulátor";
    document.title = "Tájékoztató testsúlytartomány-kalkulátor";
    const calculate = () => { const h = numberValue(section, "wr-height") / 100; section.querySelector("[data-results]").innerHTML = resultCards([["BMI 18,5-höz tartozó testsúly", decimal(18.5 * h * h, 1) + " kg"], ["BMI 24,9-hez tartozó testsúly", decimal(24.9 * h * h, 1) + " kg"], ["Tájékoztató tartomány", `${decimal(18.5 * h * h, 1)}–${decimal(24.9 * h * h, 1)} kg`]]); };
    section.addEventListener("input", calculate); calculate();
  }

  function upgradeBmi() {
    healthBase("A BMI fontos korlátai", "A BMI népességszintű szűrőmutató, nem közvetlen testzsírmérés és nem önálló diagnózis.", `<ul class="priority-checklist"><li><strong>Gyermekek:</strong> életkor- és nemspecifikus percentilis szükséges.</li><li><strong>Sportolók:</strong> a nagy izomtömeg magas BMI-t okozhat.</li><li><strong>Várandósság:</strong> a felnőtt BMI-kategóriák nem használhatók a terhességi súlygyarapodás értékelésére.</li><li><strong>Idősebb kor:</strong> az izomtömeg csökkenése miatt a BMI önmagában kevés.</li></ul><div class="priority-note">Érdemes a derékkörfogatot, vérnyomást, laborértékeket, fizikai állapotot és a hosszabb távú trendet együtt nézni.</div>`, healthSources.bmi);
  }

  function upgradeNutrition(kind) {
    const titles = {
      "kaloria-kalkulator.html": "Kalóriaszükséglet – képlet, aktivitás és kizáró okok",
      "bmr-kalkulator.html": "BMR – Mifflin–St Jeor képlet és aktivitási szorzók",
      "makro-kalkulator.html": "Makrotápanyag-tervezés biztonságos keretekkel",
      "feherje-szukseglet-kalkulator.html": "Fehérjeszükséglet – tartomány és egészségügyi korlátok"
    };
    healthBase(titles[kind], "A számítás kiindulópont, nem személyre szabott étrend. A tényleges energia- és tápanyagigény az aktivitás, testösszetétel, cél, egészségi állapot és gyógyszerek miatt eltérhet.", `<div class="priority-table-wrap"><table class="priority-table"><thead><tr><th>Aktivitási leírás</th><th>Gyakori tervezési szorzó</th></tr></thead><tbody><tr><td>Ülő életmód, kevés mozgás</td><td>1,2</td></tr><tr><td>Könnyű aktivitás heti 1–3 alkalom</td><td>1,375</td></tr><tr><td>Közepes aktivitás heti 3–5 alkalom</td><td>1,55</td></tr><tr><td>Nagy aktivitás heti 6–7 alkalom</td><td>1,725</td></tr></tbody></table></div><ul class="priority-checklist"><li>Gyermekek, várandósság és szoptatás külön szakmai megközelítést igényel.</li><li>Evészavar, gyors fogyás, krónikus betegség vagy jelentős túlsúly esetén szakember bevonása indokolt.</li><li>Vesebetegség, májbetegség vagy speciális diéta mellett a fehérjecél nem állítható be általános kalkulátorból.</li><li>A túl nagy kalóriadeficit ronthatja a teljesítményt, regenerációt és tápanyagellátást.</li></ul><div class="priority-warning">A kalkulátor szándékosan nem ad mindenkire érvényes „biztonságos minimumkalóriát”. Ilyen alsó határ egyéni adatok és egészségi állapot nélkül félrevezető lehet.</div>`, healthSources.nutrition);
  }

  const handlers = {
    "hitelkepesseg-kalkulator.html": upgradeCreditCapacity,
    "lakas-hitel-onero-kalkulator.html": upgradeDownPayment,
    "hitel-torleszto-kalkulator.html": upgradeLoanComparison,
    "milliomos-kalkulator.html": upgradeMillionaire,
    "inflacio-kalkulator.html": upgradeInflation,
    "kamatos-kamat-kalkulator.html": upgradeCompound,
    "havi-koltsegvetes-kalkulator.html": upgradeBudget,
    "fizetesi-hatarido-kalkulator.html": upgradePaymentDeadline,
    "szamla-teljesites-kalkulator.html": upgradeInvoicePerformance,
    "afa-kalkulator.html": upgradeVat,
    "terhessegi-kalkulator.html": upgradePregnancy,
    "pulzus-zona-kalkulator.html": upgradePulse,
    "vizfogyasztas-kalkulator.html": upgradeWater,
    "testzsir-kalkulator.html": upgradeBodyFat,
    "derek-csipo-kalkulator.html": upgradeWhr,
    "alvasciklus-kalkulator.html": upgradeSleep,
    "idealis-testsuly-kalkulator.html": upgradeWeightRange,
    "bmi-kalkulator.html": upgradeBmi,
    "kaloria-kalkulator.html": () => upgradeNutrition("kaloria-kalkulator.html"),
    "bmr-kalkulator.html": () => upgradeNutrition("bmr-kalkulator.html"),
    "makro-kalkulator.html": () => upgradeNutrition("makro-kalkulator.html"),
    "feherje-szukseglet-kalkulator.html": () => upgradeNutrition("feherje-szukseglet-kalkulator.html")
  };

  window.addEventListener("load", () => {
    const handler = handlers[page];
    if (handler) handler();
  }, { once: true });
})();

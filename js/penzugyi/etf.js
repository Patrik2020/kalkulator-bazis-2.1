(function () {
  const form = document.getElementById("etfForm");
  if (!form || window.KB_ETF_PRO_LOADED) return;
  window.KB_ETF_PRO_LOADED = true;

  const fields = {
    target: document.getElementById("target"),
    initial: document.getElementById("initial"),
    monthly: document.getElementById("monthly"),
    rate: document.getElementById("rate"),
    years: document.getElementById("years"),
    ter: document.getElementById("ter"),
    inflation: document.getElementById("inflation"),
    increase: document.getElementById("increase"),
  };

  const result = {
    heading: document.getElementById("result-heading"),
    final: document.getElementById("result-final"),
    invested: document.getElementById("result-invested"),
    profit: document.getElementById("result-profit"),
    real: document.getElementById("result-real"),
    cost: document.getElementById("result-cost"),
    interpretation: document.getElementById("result-interpretation"),
    scenarios: document.getElementById("scenarioGrid"),
    chart: document.getElementById("etfChart"),
    chartTooltip: document.getElementById("etfChartTooltip"),
    tableBody: document.getElementById("yearlyTableBody"),
  };

  const modePanels = [...document.querySelectorAll("[data-mode-panel]")];
  const modeInputs = [...document.querySelectorAll('input[name="etfMode"]')];
  const targetTypeInputs = [...document.querySelectorAll('input[name="targetType"]')];
  const advanced = document.getElementById("etfAdvanced");
  const yearlyDetails = document.getElementById("etfYearlyDetails");

  const MAX_AMOUNT = 1_000_000_000_000_000;
  const MAX_MONTHLY_SEARCH = 1_000_000_000_000;
  let lastValidModel = null;
  let advancedTracked = false;
  let yearlyTracked = false;
  let scenarioTracked = false;
  let chartTrackedKey = "";
  let hasUserInteracted = false;
  let pendingCalculationAnalytics = null;
  let pendingCalculationTimer = 0;
  let lastSentCalculationSignature = "";

  const percentBounds = {
    rate: { min: -80, max: 100, label: "Az éves hozam legyen -80% és 100% között." },
    ter: { min: 0, max: 10, label: "A TER legyen 0% és 10% között." },
    inflation: { min: -20, max: 50, label: "Az infláció legyen -20% és 50% között." },
    increase: { min: -50, max: 50, label: "A befizetésemelés legyen -50% és 50% között." },
  };

  const formatFt = (value) =>
    `${new Intl.NumberFormat("hu-HU", {
      maximumFractionDigits: 0,
    }).format(Math.round(Number.isFinite(value) ? value : 0))} Ft`;

  const formatCompactFt = (value) => {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString("hu-HU", { maximumFractionDigits: 1 })} Mrd Ft`;
    if (abs >= 1_000_000) return `${(value / 1_000_000).toLocaleString("hu-HU", { maximumFractionDigits: 1 })} M Ft`;
    if (abs >= 1_000) return `${(value / 1_000).toLocaleString("hu-HU", { maximumFractionDigits: 0 })} e Ft`;
    return formatFt(value);
  };

  const formatPercent = (value) =>
    `${value.toLocaleString("hu-HU", { maximumFractionDigits: 2 })}%`;

  const normalizeNumberString = (value) =>
    (value || "")
      .toString()
      .trim()
      .replace(/\s/g, "")
      .replace(/\u00a0/g, "")
      .replace(",", ".");

  const parseNumber = (value) => {
    const normalized = normalizeNumberString(value);
    if (!normalized) return null;
    if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return NaN;
    return Number(normalized);
  };

  const getMode = () =>
    document.querySelector('input[name="etfMode"]:checked')?.value || "future";

  const getTargetType = () =>
    document.querySelector('input[name="targetType"]:checked')?.value || "nominal";

  const setFieldError = (name, message) => {
    const input = fields[name];
    const error = document.getElementById(`${name}-error`);
    if (!input || !error) return;

    error.textContent = message || "";
    input.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const clearErrors = () => {
    Object.keys(fields).forEach((name) => setFieldError(name, ""));
  };

  const validateAmount = (name, value, { required = true, allowZero = true } = {}) => {
    if (value === null) {
      if (!required) return 0;
      setFieldError(name, "Adj meg egy összeget.");
      return null;
    }

    if (!Number.isFinite(value)) {
      setFieldError(name, "Csak számot adj meg, szóközökkel vagy tizedesvesszővel is írhatod.");
      return null;
    }

    if (value < 0) {
      setFieldError(name, "Az összeg nem lehet negatív.");
      return null;
    }

    if (!allowZero && value === 0) {
      setFieldError(name, "Adj meg 0-nál nagyobb összeget.");
      return null;
    }

    if (value > MAX_AMOUNT) {
      setFieldError(name, "Ez az összeg túl nagy a megbízható becsléshez.");
      return null;
    }

    return value;
  };

  const validatePercent = (name, value, { required = true } = {}) => {
    if (value === null) {
      if (!required) return 0;
      setFieldError(name, "Adj meg egy százalékos értéket.");
      return null;
    }

    if (!Number.isFinite(value)) {
      setFieldError(name, "Csak számot adj meg, például 6 vagy 0,20 formában.");
      return null;
    }

    const bounds = percentBounds[name];
    if (bounds && (value < bounds.min || value > bounds.max)) {
      setFieldError(name, bounds.label);
      return null;
    }

    return value;
  };

  const validateYears = (value) => {
    if (value === null) {
      setFieldError("years", "Add meg az időtávot években.");
      return null;
    }

    if (!Number.isFinite(value)) {
      setFieldError("years", "Az időtáv csak szám lehet.");
      return null;
    }

    if (value <= 0) {
      setFieldError("years", "Az időtáv legyen legalább 1 év.");
      return null;
    }

    if (value > 80) {
      setFieldError("years", "80 évnél hosszabb időtávra a becslés már túl bizonytalan.");
      return null;
    }

    return Math.round(value);
  };

  const collectInputs = () => {
    clearErrors();

    const mode = getMode();
    const initial = validateAmount("initial", parseNumber(fields.initial.value), { required: true });
    const monthly =
      mode === "future"
        ? validateAmount("monthly", parseNumber(fields.monthly.value), { required: true })
        : 0;
    const target =
      mode === "goal"
        ? validateAmount("target", parseNumber(fields.target.value), {
            required: true,
            allowZero: false,
          })
        : 0;
    const rate = validatePercent("rate", parseNumber(fields.rate.value));
    const years = validateYears(parseNumber(fields.years.value));
    const ter = validatePercent("ter", parseNumber(fields.ter.value));
    const inflation = validatePercent("inflation", parseNumber(fields.inflation.value));
    const increase = validatePercent("increase", parseNumber(fields.increase.value));

    const values = { mode, targetType: getTargetType(), target, initial, monthly, rate, years, ter, inflation, increase };
    const hasInvalid = Object.values(values).some((value) => value === null);

    if (!hasInvalid && mode === "future" && initial + monthly <= 0) {
      setFieldError("monthly", "Adj meg kezdőtőkét vagy havi befektetést.");
      return null;
    }

    return hasInvalid ? null : values;
  };

  const inflationFactor = (inflation, years) => Math.pow(1 + inflation / 100, years);

  const simulate = ({ initial, monthly, rate, years, ter, inflation, increase }) => {
    const months = Math.max(0, Math.round(years * 12));
    // A felhasználó éves effektív hozamot ad meg. A TER-t éves arányként,
    // multiplikatívan vonjuk le, majd egyenértékű havi rátát képzünk.
    const grossAnnualFactor = 1 + rate / 100;
    const costAnnualFactor = 1 - ter / 100;
    const netAnnualFactor = grossAnnualFactor * costAnnualFactor;
    if (netAnnualFactor <= 0) throw new Error("A hozam és költség kombinációja nem modellezhető.");
    const monthlyRate = Math.pow(netAnnualFactor, 1 / 12) - 1;
    const annualIncrease = 1 + increase / 100;
    const annualInflation = 1 + inflation / 100;
    let balance = initial;
    let invested = initial;
    let yearlyPaid = 0;
    let yearlyGain = 0;
    const rows = [];

    for (let month = 0; month < months; month += 1) {
      const beforeGrowth = balance;
      const growth = beforeGrowth * monthlyRate;
      balance = beforeGrowth + growth;
      yearlyGain += growth;

      const yearIndex = Math.floor(month / 12);
      const monthlyContribution = monthly * Math.pow(annualIncrease, yearIndex);
      balance += monthlyContribution;
      invested += monthlyContribution;
      yearlyPaid += monthlyContribution;

      const isYearEnd = (month + 1) % 12 === 0 || month === months - 1;
      if (isYearEnd) {
        const year = Math.ceil((month + 1) / 12);
        const realValue =
          annualInflation > 0 ? balance / Math.pow(annualInflation, year) : balance;

        rows.push({
          year,
          yearlyPaid,
          invested,
          yearlyGain,
          balance,
          realValue,
        });

        yearlyPaid = 0;
        yearlyGain = 0;
      }
    }

    const realValue =
      annualInflation > 0 ? balance / Math.pow(annualInflation, years) : balance;

    return {
      final: balance,
      invested,
      profit: balance - invested,
      realValue,
      rows,
      monthlyRate,
    };
  };

  const calculateCostImpact = (values, monthly) => {
    if (values.ter <= 0) return 0;

    const withTer = simulate({ ...values, monthly });
    const withoutTer = simulate({ ...values, monthly, ter: 0 });
    return Math.max(0, withoutTer.final - withTer.final);
  };

  const solveMonthlyForGoal = (values, targetNominal) => {
    const initialOnly = simulate({ ...values, monthly: 0 });
    if (initialOnly.final >= targetNominal) {
      return { monthly: 0, result: initialOnly, reachedByInitial: true };
    }

    let low = 0;
    let high = Math.max(10000, targetNominal / Math.max(1, values.years * 12));
    let highResult = simulate({ ...values, monthly: high });

    while (highResult.final < targetNominal && high < MAX_MONTHLY_SEARCH) {
      high *= 2;
      highResult = simulate({ ...values, monthly: high });
    }

    if (highResult.final < targetNominal) {
      return { error: "A megadott cél ehhez az időtávhoz túl magas. Próbálj hosszabb időtávot vagy alacsonyabb célösszeget." };
    }

    for (let i = 0; i < 80; i += 1) {
      const mid = (low + high) / 2;
      const midResult = simulate({ ...values, monthly: mid });

      if (midResult.final >= targetNominal) high = mid;
      else low = mid;
    }

    const monthly = Math.ceil(high);
    return {
      monthly,
      result: simulate({ ...values, monthly }),
      reachedByInitial: false,
    };
  };

  const buildModel = (values) => {
    const targetNominal =
      values.mode === "goal" && values.targetType === "real"
        ? values.target * inflationFactor(values.inflation, values.years)
        : values.target;
    let requiredMonthly = values.monthly;
    let base;
    let reachedByInitial = false;

    if (values.mode === "goal") {
      const solved = solveMonthlyForGoal(values, targetNominal);
      if (solved.error) return { error: solved.error };
      requiredMonthly = solved.monthly;
      base = solved.result;
      reachedByInitial = solved.reachedByInitial;
    } else {
      base = simulate(values);
    }

    const costImpact = calculateCostImpact(values, requiredMonthly);
    const scenarioInputs = [
      { key: "cautious", name: "Óvatos", rate: values.rate - 2 },
      { key: "base", name: "Alap", rate: values.rate },
      { key: "optimistic", name: "Optimista", rate: values.rate + 2 },
    ];
    const scenarios = scenarioInputs.map((scenario) => ({
      ...scenario,
      result: simulate({ ...values, monthly: requiredMonthly, rate: scenario.rate }),
    }));

    return {
      values,
      base,
      scenarios,
      costImpact,
      requiredMonthly,
      targetNominal,
      reachedByInitial,
    };
  };

  const getTimeCategory = (years) => {
    if (years < 5) return "short";
    if (years < 15) return "medium";
    if (years < 30) return "long";
    return "very_long";
  };

  const sendTrack = (eventName, params = {}) => {
    if (!hasUserInteracted && /^etf_(?:calculate|goal_calculate|mode_change|scenario_view)$/i.test(eventName)) {
      return;
    }

    if (typeof window.KB_TRACK_EVENT !== "function") return;
    window.KB_TRACK_EVENT(eventName, {
      calculator: "etf-kalkulator",
      mode: getMode(),
      ...params,
    });
  };

  const scheduleCalculationTrack = (eventName, params = {}) => {
    if (!hasUserInteracted) return;

    const signature = JSON.stringify({
      eventName,
      mode: getMode(),
      params,
    });

    pendingCalculationAnalytics = { eventName, params, signature };
    window.clearTimeout(pendingCalculationTimer);
    pendingCalculationTimer = window.setTimeout(flushCalculationTrack, 850);
  };

  const flushCalculationTrack = () => {
    if (!pendingCalculationAnalytics) return;

    const pending = pendingCalculationAnalytics;
    pendingCalculationAnalytics = null;
    window.clearTimeout(pendingCalculationTimer);
    pendingCalculationTimer = 0;

    if (pending.signature === lastSentCalculationSignature) return;
    lastSentCalculationSignature = pending.signature;
    sendTrack(pending.eventName, pending.params);
  };

  const track = (eventName, params = {}) => {
    if (eventName === "etf_calculate" || eventName === "etf_goal_calculate") {
      scheduleCalculationTrack(eventName, params);
      return;
    }

    sendTrack(eventName, params);
  };

  const renderInvalidState = (message) => {
    lastValidModel = null;
    result.heading.textContent = "Várható végösszeg";
    result.final.textContent = "–";
    result.invested.textContent = "–";
    result.profit.textContent = "–";
    result.real.textContent = "–";
    result.cost.textContent = "–";
    result.interpretation.textContent =
      message || "Adj meg értelmezhető adatokat, és a kalkulátor megmutatja a becsült eredményt.";
    result.scenarios.innerHTML = "";
    result.chart.innerHTML = "";
    result.chartTooltip.hidden = true;
    result.tableBody.innerHTML = '<tr><td colspan="6">Adj meg adatokat az éves bontáshoz.</td></tr>';
    document.dispatchEvent(
      new CustomEvent("kb:calculation-complete", { detail: { valid: false, source: form } })
    );
  };

  const interpretationFor = (model) => {
    const { values, base, requiredMonthly, targetNominal, reachedByInitial } = model;
    const finalText = formatCompactFt(base.final);
    const investedText = formatCompactFt(base.invested);
    const profitText = formatCompactFt(base.profit);
    const profitLabel = base.profit >= 0 ? "becsült hozam" : "becsült veszteség";

    if (values.mode === "goal") {
      if (reachedByInitial) {
        return `A megadott feltételek alapján a kezdőtőke önmagában is elérheti a ${formatCompactFt(targetNominal)} körüli célösszeget, ezért a szükséges havi befektetés becslés szerint 0 Ft.`;
      }

      return `A megadott feltételek alapján körülbelül ${formatCompactFt(requiredMonthly)} kezdő havi befektetésre lehet szükség ahhoz, hogy ${values.years} év alatt elérd a ${formatCompactFt(targetNominal)} körüli jövőbeni célösszeget.`;
    }

    return `A megadott feltételek alapján ${values.years} év alatt körülbelül ${finalText} gyűlhet össze. Ebből ${investedText} lenne a saját befizetésed, a fennmaradó rész pedig becslés szerint ${profitText} ${profitLabel}.`;
  };

  const renderResults = (model) => {
    const { values, base, costImpact, requiredMonthly, targetNominal } = model;

    if (values.mode === "goal") {
      result.heading.textContent = "Szükséges kezdő havi befektetés";
      result.final.textContent = formatFt(requiredMonthly);
    } else {
      result.heading.textContent = "Várható végösszeg";
      result.final.textContent = formatFt(base.final);
    }

    result.invested.textContent = formatFt(base.invested);
    result.profit.textContent = formatFt(base.profit);
    result.real.textContent = formatFt(base.realValue);
    result.cost.textContent = formatFt(costImpact);
    result.interpretation.textContent = interpretationFor(model);

    if (values.mode === "goal") {
      result.interpretation.insertAdjacentText(
        "beforeend",
        ` A modell várható portfólióértéke a célidőpontban ${formatCompactFt(base.final)}, a nominális cél pedig ${formatCompactFt(targetNominal)}.`
      );
    }
  };

  const renderScenarios = (model) => {
    result.scenarios.innerHTML = model.scenarios
      .map(
        (scenario) => `
          <article class="etf-scenario" data-scenario="${scenario.key}">
            <span>${scenario.name}</span>
            <strong>${formatFt(scenario.result.final)}</strong>
            <small>${formatPercent(scenario.rate)} éves bruttó hozamfeltételezés</small>
          </article>
        `
      )
      .join("");

    if (!scenarioTracked && hasUserInteracted) {
      scenarioTracked = true;
      track("etf_scenario_view", {
        time_category: getTimeCategory(model.values.years),
        ter_used: model.values.ter > 0,
        inflation_used: model.values.inflation !== 0,
      });
    }
  };

  const chartScale = (rows, width, height, padding) => {
    const maxValue = Math.max(
      1,
      ...rows.flatMap((row) => [row.invested, row.balance, row.realValue])
    );
    const x = (index) =>
      rows.length === 1
        ? padding.left
        : padding.left + (index / (rows.length - 1)) * (width - padding.left - padding.right);
    const y = (value) =>
      height - padding.bottom - (value / maxValue) * (height - padding.top - padding.bottom);

    return { x, y, maxValue };
  };

  const pointsFor = (rows, key, scale) =>
    rows.map((row, index) => `${scale.x(index).toFixed(2)},${scale.y(row[key]).toFixed(2)}`).join(" ");

  const renderChart = (model) => {
    const rows = model.base.rows;
    if (!rows.length) {
      result.chart.innerHTML = "";
      return;
    }

    const width = 760;
    const height = 340;
    const padding = { top: 24, right: 28, bottom: 54, left: 72 };
    const scale = chartScale(rows, width, height, padding);
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => scale.maxValue * ratio);
    const labelEvery = Math.max(1, Math.ceil(rows.length / 6));

    result.chart.innerHTML = `
      <g class="etf-chart-grid">
        ${yTicks
          .map((tick) => {
            const y = scale.y(tick);
            return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line><text x="${padding.left - 10}" y="${y + 4}" text-anchor="end">${formatCompactFt(tick)}</text>`;
          })
          .join("")}
      </g>
      <polyline class="line-invested" points="${pointsFor(rows, "invested", scale)}"></polyline>
      <polyline class="line-balance" points="${pointsFor(rows, "balance", scale)}"></polyline>
      <polyline class="line-real" points="${pointsFor(rows, "realValue", scale)}"></polyline>
      <g class="etf-chart-axis">
        <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}"></line>
        ${rows
          .filter((row, index) => index === 0 || index === rows.length - 1 || (index + 1) % labelEvery === 0)
          .map((row, index) => {
            const realIndex = rows.indexOf(row);
            const x = scale.x(realIndex);
            return `<text x="${x}" y="${height - 22}" text-anchor="middle">${row.year}. év</text>`;
          })
          .join("")}
      </g>
      <g class="etf-chart-points">
        ${rows
          .map((row, index) => {
            const x = scale.x(index);
            const y = scale.y(row.balance);
            const label = `${row.year}. év: portfólió ${formatFt(row.balance)}, saját befizetés ${formatFt(row.invested)}`;
            return `<circle tabindex="0" role="button" aria-label="${label}" cx="${x}" cy="${y}" r="6" data-chart-point="${index}"></circle>`;
          })
          .join("")}
      </g>
    `;
  };

  const showChartTooltip = (event) => {
    const point = event.target.closest("[data-chart-point]");
    if (!point || !lastValidModel) return;

    const index = Number(point.dataset.chartPoint);
    const row = lastValidModel.base.rows[index];
    if (!row) return;

    const key = `${row.year}-${lastValidModel.values.mode}`;
    if (chartTrackedKey !== key) {
      chartTrackedKey = key;
      track("etf_chart_interaction", {
        year_bucket: row.year <= 5 ? "1_5" : row.year <= 15 ? "6_15" : row.year <= 30 ? "16_30" : "30_plus",
      });
    }

    result.chartTooltip.innerHTML = `
      <strong>${row.year}. év</strong>
      <span>Portfólió: ${formatFt(row.balance)}</span>
      <span>Saját befizetés: ${formatFt(row.invested)}</span>
      <span>Mai vásárlóérték: ${formatFt(row.realValue)}</span>
    `;
    result.chartTooltip.hidden = false;
  };

  const renderYearlyTable = (model) => {
    result.tableBody.innerHTML = model.base.rows
      .map(
        (row) => `
          <tr>
            <td>${row.year}. év</td>
            <td>${formatFt(row.yearlyPaid)}</td>
            <td>${formatFt(row.invested)}</td>
            <td>${formatFt(row.yearlyGain)}</td>
            <td>${formatFt(row.balance)}</td>
            <td>${formatFt(row.realValue)}</td>
          </tr>
        `
      )
      .join("");
  };

  const renderModel = (model) => {
    lastValidModel = model;
    renderResults(model);
    renderScenarios(model);
    renderChart(model);
    renderYearlyTable(model);

    document.dispatchEvent(
      new CustomEvent("kb:calculation-complete", {
        detail: { valid: true, source: form, calculator: "etf-kalkulator" },
      })
    );

    track(model.values.mode === "goal" ? "etf_goal_calculate" : "etf_calculate", {
      time_category: getTimeCategory(model.values.years),
      ter_used: model.values.ter > 0,
      inflation_used: model.values.inflation !== 0,
      contribution_increase_used: model.values.increase !== 0,
      target_type: model.values.mode === "goal" ? model.values.targetType : undefined,
    });
  };

  const calculate = () => {
    const values = collectInputs();
    if (!values) {
      renderInvalidState();
      return;
    }

    const model = buildModel(values);
    if (model.error) {
      renderInvalidState(model.error);
      return;
    }

    renderModel(model);
  };

  const updateMode = () => {
    const mode = getMode();
    modePanels.forEach((panel) => {
      const isVisible = panel.dataset.modePanel === mode;
      panel.hidden = !isVisible;
      panel.querySelectorAll("input, select, textarea, button").forEach((control) => {
        control.disabled = !isVisible;
      });
    });

    track("etf_mode_change", { selected_mode: mode });
    calculate();
  };

  const formatMoneyInputOnBlur = (input) => {
    const number = parseNumber(input.value);
    if (number === null || !Number.isFinite(number)) return;
    input.value = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(number);
  };

  Object.values(fields).forEach((input) => {
    input?.addEventListener("input", () => {
      hasUserInteracted = true;
      calculate();
    });
  });

  [fields.initial, fields.monthly, fields.target].forEach((input) => {
    input?.addEventListener("blur", () => {
      formatMoneyInputOnBlur(input);
      flushCalculationTrack();
    });
  });

  [fields.rate, fields.years, fields.ter, fields.inflation, fields.increase].forEach((input) => {
    input?.addEventListener("blur", flushCalculationTrack);
    input?.addEventListener("change", flushCalculationTrack);
  });

  modeInputs.forEach((input) =>
    input.addEventListener("change", () => {
      hasUserInteracted = true;
      updateMode();
    })
  );
  targetTypeInputs.forEach((input) =>
    input.addEventListener("change", () => {
      hasUserInteracted = true;
      calculate();
    })
  );

  advanced?.addEventListener("toggle", () => {
    if (advanced.open && !advancedTracked) {
      advancedTracked = true;
      track("etf_advanced_settings_open");
    }
  });

  yearlyDetails?.addEventListener("toggle", () => {
    if (yearlyDetails.open && !yearlyTracked) {
      yearlyTracked = true;
      track("etf_yearly_table_open", {
        time_category: lastValidModel ? getTimeCategory(lastValidModel.values.years) : "unknown",
      });
    }
  });

  result.chart?.addEventListener("pointermove", showChartTooltip);
  result.chart?.addEventListener("focusin", showChartTooltip);
  result.chart?.addEventListener("click", showChartTooltip);
  result.chart?.addEventListener("pointerleave", () => {
    result.chartTooltip.hidden = true;
  });

  modePanels.forEach((panel) => {
    const isVisible = panel.dataset.modePanel === getMode();
    panel.hidden = !isVisible;
    panel.querySelectorAll("input, select, textarea, button").forEach((control) => {
      control.disabled = !isVisible;
    });
  });
  calculate();
})();

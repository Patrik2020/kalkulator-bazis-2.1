(function () {
  const form = document.getElementById("dividendForm");
  if (!form || window.KB_DIVIDEND_PRO_LOADED) return;
  window.KB_DIVIDEND_PRO_LOADED = true;

  const fields = {
    incomeAmount: document.getElementById("incomeAmount"),
    targetIncome: document.getElementById("targetIncome"),
    initialPortfolio: document.getElementById("initialPortfolio"),
    monthlyContribution: document.getElementById("monthlyContribution"),
    dividendYield: document.getElementById("dividendYield"),
    simpleDeduction: document.getElementById("simpleDeduction"),
    payoutFrequency: document.getElementById("payoutFrequency"),
    projectionYears: document.getElementById("projectionYears"),
    withholdingTax: document.getElementById("withholdingTax"),
    extraTax: document.getElementById("extraTax"),
    variableCost: document.getElementById("variableCost"),
    fixedCost: document.getElementById("fixedCost"),
    dividendGrowth: document.getElementById("dividendGrowth"),
    priceGrowth: document.getElementById("priceGrowth"),
    inflation: document.getElementById("inflation"),
    contributionIncrease: document.getElementById("contributionIncrease"),
    stressCut: document.getElementById("stressCut"),
    stressYear: document.getElementById("stressYear"),
  };

  const elements = {
    resultHeading: document.getElementById("result-heading"),
    resultPrimary: document.getElementById("result-primary"),
    resultGrid: document.getElementById("resultGrid"),
    interpretation: document.getElementById("result-interpretation"),
    warning: document.getElementById("result-warning"),
    scenarioGrid: document.getElementById("scenarioGrid"),
    chart: document.getElementById("dividendChart"),
    chartTitle: document.getElementById("dividendChartTitle"),
    chartTooltip: document.getElementById("dividendChartTooltip"),
    chartLegend: document.getElementById("chartLegend"),
    yearlyDetails: document.getElementById("dividendYearlyDetails"),
    yearlyTableBody: document.getElementById("yearlyTableBody"),
    advanced: document.getElementById("dividendAdvanced"),
    stressEnabled: document.getElementById("stressEnabled"),
  };

  const modeInputs = [...document.querySelectorAll('input[name="dividendMode"]')];
  const taxModeInputs = [...document.querySelectorAll('input[name="taxMode"]')];
  const targetPeriodInputs = [...document.querySelectorAll('input[name="targetPeriod"]')];
  const targetBasisInputs = [...document.querySelectorAll('input[name="targetBasis"]')];
  const reinvestInputs = [...document.querySelectorAll('input[name="reinvestDividends"]')];
  const chartModeInputs = [...document.querySelectorAll('input[name="chartMode"]')];

  const MAX_AMOUNT = 1_000_000_000_000_000;
  const SVG_WIDTH = 760;
  const SVG_HEIGHT = 340;
  const CHART_PADDING = { top: 24, right: 30, bottom: 54, left: 78 };

  let lastValidModel = null;
  let lastChartData = null;
  let hasUserInteracted = false;
  let advancedTracked = false;
  let yearlyTracked = false;
  let scenarioTracked = false;
  let stressTracked = false;
  let chartInteractionKey = "";
  let pendingCalculationAnalytics = null;
  let pendingCalculationTimer = 0;
  let lastSentCalculationSignature = "";

  const formatFt = (value) =>
    `${new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(
      Math.round(Number.isFinite(value) ? value : 0)
    )} Ft`;

  const formatCompactFt = (value) => {
    const abs = Math.abs(Number(value) || 0);
    if (abs >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toLocaleString("hu-HU", { maximumFractionDigits: 1 })} Mrd Ft`;
    }
    if (abs >= 1_000_000) {
      return `${(value / 1_000_000).toLocaleString("hu-HU", { maximumFractionDigits: 1 })} M Ft`;
    }
    if (abs >= 1_000) {
      return `${(value / 1_000).toLocaleString("hu-HU", { maximumFractionDigits: 0 })} e Ft`;
    }
    return formatFt(value);
  };

  const formatPercent = (value) =>
    `${(Number(value) || 0).toLocaleString("hu-HU", { maximumFractionDigits: 2 })}%`;

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

  const escapeHtml = (value) =>
    (value || "")
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const getMode = () =>
    document.querySelector('input[name="dividendMode"]:checked')?.value || "income";

  const getTaxMode = () =>
    document.querySelector('input[name="taxMode"]:checked')?.value || "simple";

  const getTargetPeriod = () =>
    document.querySelector('input[name="targetPeriod"]:checked')?.value || "monthly";

  const getTargetBasis = () =>
    document.querySelector('input[name="targetBasis"]:checked')?.value || "net";

  const getReinvestment = () =>
    document.querySelector('input[name="reinvestDividends"]:checked')?.value === "yes";

  const getChartMode = () =>
    document.querySelector('input[name="chartMode"]:checked')?.value || "portfolio";

  const getTimeCategory = (years) => {
    if (years < 5) return "short";
    if (years < 15) return "medium";
    if (years < 30) return "long";
    return "very_long";
  };

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
      setFieldError(name, "Csak számot adj meg, szóközzel vagy tizedesvesszővel is írhatod.");
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

  const validatePercent = (name, value, { min = 0, max = 100, required = true, label } = {}) => {
    if (value === null) {
      if (!required) return 0;
      setFieldError(name, "Adj meg egy százalékos értéket.");
      return null;
    }

    if (!Number.isFinite(value)) {
      setFieldError(name, "Csak számot adj meg, például 4 vagy 0,20 formában.");
      return null;
    }

    if (value < min || value > max) {
      setFieldError(name, label || `Az érték legyen ${min}% és ${max}% között.`);
      return null;
    }

    return value;
  };

  const validateYears = (name, value, { max = 60 } = {}) => {
    if (value === null) {
      setFieldError(name, "Add meg az időtávot években.");
      return null;
    }

    if (!Number.isFinite(value)) {
      setFieldError(name, "Az időtáv csak szám lehet.");
      return null;
    }

    if (value < 1 || value > max) {
      setFieldError(name, `Az időtáv legyen 1 és ${max} év között.`);
      return null;
    }

    return Math.round(value);
  };

  const getDeductionPercent = (values) =>
    values.taxMode === "detailed"
      ? values.withholdingTax + values.extraTax + values.variableCost
      : values.simpleDeduction;

  const setWarning = (message) => {
    elements.warning.textContent = message || "";
    elements.warning.hidden = !message;
  };

  const calculateIncome = (capital, values, yieldOverride = values.dividendYield) => {
    const yieldRate = Math.max(0, yieldOverride) / 100;
    const gross = capital * yieldRate;
    const deductionRate = getDeductionPercent(values) / 100;
    const rawDeductions = gross * deductionRate + values.fixedCost;
    const deductions = Math.min(gross, Math.max(0, rawDeductions));
    const annualNet = Math.max(0, gross - rawDeductions);
    const monthlyNet = annualNet / 12;
    const perPayment = annualNet / values.frequency;
    const netYield = capital > 0 ? (annualNet / capital) * 100 : 0;

    return {
      capital,
      gross,
      annualNet,
      monthlyNet,
      perPayment,
      deductions,
      netYield,
      warning:
        rawDeductions > gross && gross > 0
          ? "A megadott levonások és költségek felemésztik a becsült bruttó osztalékot."
          : "",
    };
  };

  const solveTarget = (values, yieldOverride = values.dividendYield) => {
    const yieldRate = Math.max(0, yieldOverride) / 100;
    const annualTarget =
      values.targetPeriod === "monthly" ? values.targetIncome * 12 : values.targetIncome;

    if (yieldRate <= 0) {
      return {
        error:
          "A megadott osztalékhozam mellett a céljövedelem nem számítható ki. Adj meg 0%-nál magasabb osztalékhozamot.",
      };
    }

    let requiredCapital = 0;
    if (values.targetBasis === "gross") {
      requiredCapital = Math.ceil(annualTarget / yieldRate);
    } else {
      const netYieldRate = yieldRate * (1 - getDeductionPercent(values) / 100);
      if (netYieldRate <= 0) {
        return {
          error:
            "A megadott hozam, levonások és költségek mellett a céljövedelem nem számítható ki. Csökkentsd a levonásokat vagy adj meg magasabb osztalékhozamot.",
        };
      }
      requiredCapital = Math.ceil((annualTarget + values.fixedCost) / netYieldRate);
    }

    if (!Number.isFinite(requiredCapital) || requiredCapital < 0 || requiredCapital > MAX_AMOUNT) {
      return {
        error: "A céljövedelemhez szükséges tőke túl nagy vagy nem számítható megbízhatóan.",
      };
    }

    const income = calculateIncome(requiredCapital, values, yieldOverride);
    return {
      annualTarget,
      requiredCapital,
      income,
      reached:
        values.targetBasis === "gross"
          ? income.gross >= annualTarget
          : income.annualNet >= annualTarget,
    };
  };

  const realValue = (value, inflation, years) => {
    const factor = Math.pow(1 + inflation / 100, years);
    return factor > 0 ? value / factor : value;
  };

  const isPayoutMonth = (monthInYear, frequency) => {
    const interval = 12 / frequency;
    return (monthInYear + 1) % interval === 0;
  };

  const simulateProjection = (values, overrides = {}) => {
    const options = { ...values, ...overrides };
    const months = options.projectionYears * 12;
    const frequency = options.frequency;
    const deductionRate = getDeductionPercent(options) / 100;
    const monthlyPriceRate = Math.pow(1 + options.priceGrowth / 100, 1 / 12) - 1;
    const annualContributionFactor = 1 + options.contributionIncrease / 100;

    let unitPrice = 100;
    let units = options.initialPortfolio / unitPrice;
    let annualDividendPerUnit = unitPrice * (options.dividendYield / 100);
    let invested = options.initialPortfolio;
    let totalGrossDividend = 0;
    let totalNetDividend = 0;
    let reinvestedDividend = 0;
    let withdrawnDividend = 0;
    let boughtUnitsFromDividends = 0;
    let stressApplied = false;
    let yearly = {
      contribution: 0,
      gross: 0,
      deductions: 0,
      net: 0,
      reinvested: 0,
      withdrawn: 0,
    };
    const rows = [];

    for (let month = 0; month < months; month += 1) {
      const yearIndex = Math.floor(month / 12);
      const yearNumber = yearIndex + 1;
      const monthInYear = month % 12;

      if (month > 0 && monthInYear === 0) {
        annualDividendPerUnit = Math.max(
          0,
          annualDividendPerUnit * (1 + options.dividendGrowth / 100)
        );

        if (
          options.stressEnabled &&
          !stressApplied &&
          yearNumber === options.stressYear
        ) {
          annualDividendPerUnit = Math.max(
            0,
            annualDividendPerUnit * (1 - options.stressCut / 100)
          );
          stressApplied = true;
        }
      }

      const monthlyContribution =
        options.monthlyContribution * Math.pow(annualContributionFactor, yearIndex);

      unitPrice *= 1 + monthlyPriceRate;
      unitPrice = Math.max(0.0001, unitPrice);

      if (isPayoutMonth(monthInYear, frequency)) {
        const grossDividend = units * (annualDividendPerUnit / frequency);
        const deductions = grossDividend * deductionRate + options.fixedCost / frequency;
        const netDividend = Math.max(0, grossDividend - deductions);
        const appliedDeductions = Math.min(grossDividend, Math.max(0, deductions));

        totalGrossDividend += grossDividend;
        totalNetDividend += netDividend;
        yearly.gross += grossDividend;
        yearly.deductions += appliedDeductions;
        yearly.net += netDividend;

        if (options.reinvest) {
          const addedUnits = netDividend / unitPrice;
          units += addedUnits;
          boughtUnitsFromDividends += addedUnits;
          reinvestedDividend += netDividend;
          yearly.reinvested += netDividend;
        } else {
          withdrawnDividend += netDividend;
          yearly.withdrawn += netDividend;
        }
      }

      if (monthlyContribution > 0) {
        units += monthlyContribution / unitPrice;
        invested += monthlyContribution;
        yearly.contribution += monthlyContribution;
      }

      if (monthInYear === 11 || month === months - 1) {
        const portfolioValue = units * unitPrice;
        const year = yearIndex + 1;
        const nextYearGrossDividend = units * annualDividendPerUnit;
        const nextYearDeductions = nextYearGrossDividend * deductionRate + options.fixedCost;
        const nextYearNetDividend = Math.max(0, nextYearGrossDividend - nextYearDeductions);

        rows.push({
          year,
          yearlyContribution: yearly.contribution,
          invested,
          portfolioValue,
          annualGrossDividend: yearly.gross,
          annualDeductions: yearly.deductions,
          annualNetDividend: yearly.net,
          reinvestedDividend: yearly.reinvested,
          withdrawnDividend: yearly.withdrawn,
          totalNetDividend,
          nextYearNetDividend,
          realPortfolioValue: realValue(portfolioValue, options.inflation, year),
          realAnnualNetDividend: realValue(yearly.net, options.inflation, year),
        });

        yearly = {
          contribution: 0,
          gross: 0,
          deductions: 0,
          net: 0,
          reinvested: 0,
          withdrawn: 0,
        };
      }
    }

    const last = rows[rows.length - 1] || {
      portfolioValue: options.initialPortfolio,
      nextYearNetDividend: 0,
      realPortfolioValue: options.initialPortfolio,
    };
    const endingAnnualNetDividend = last.nextYearNetDividend;

    return {
      rows,
      finalPortfolio: last.portfolioValue,
      invested,
      totalGrossDividend,
      totalNetDividend,
      reinvestedDividend,
      withdrawnDividend,
      boughtUnitsFromDividends,
      endingAnnualNetDividend,
      endingMonthlyNetAverage: endingAnnualNetDividend / 12,
      realFinalPortfolio: realValue(last.portfolioValue, options.inflation, options.projectionYears),
      realEndingAnnualNetDividend: realValue(
        endingAnnualNetDividend,
        options.inflation,
        options.projectionYears
      ),
      yieldOnCost: invested > 0 ? (endingAnnualNetDividend / invested) * 100 : 0,
      stressApplied,
    };
  };

  const scenarioDefinitions = (mode) => {
    if (mode === "projection") {
      return [
        { key: "lower", name: "Óvatosabb pálya", growthShift: -2, priceShift: -2 },
        { key: "base", name: "Alapfeltételezés", growthShift: 0, priceShift: 0 },
        { key: "higher", name: "Kedvezőbb pálya", growthShift: 2, priceShift: 2 },
      ];
    }

    return [
      { key: "lower", name: "Alacsonyabb hozam", yieldShift: -1 },
      { key: "base", name: "Alapfeltételezés", yieldShift: 0 },
      { key: "higher", name: "Magasabb hozam", yieldShift: 1 },
    ];
  };

  const buildScenarios = (values) =>
    scenarioDefinitions(values.mode).map((scenario) => {
      if (values.mode === "income") {
        const yieldRate = Math.max(0, values.dividendYield + scenario.yieldShift);
        return {
          ...scenario,
          yieldRate,
          result: calculateIncome(values.incomeAmount, values, yieldRate),
        };
      }

      if (values.mode === "target") {
        const yieldRate = Math.max(0, values.dividendYield + scenario.yieldShift);
        return {
          ...scenario,
          yieldRate,
          result: solveTarget(values, yieldRate),
        };
      }

      const projected = simulateProjection(values, {
        dividendGrowth: values.dividendGrowth + scenario.growthShift,
        priceGrowth: Math.max(-99, values.priceGrowth + scenario.priceShift),
      });
      return {
        ...scenario,
        result: projected,
      };
    });

  const buildModel = (values) => {
    if (values.mode === "income") {
      const income = calculateIncome(values.incomeAmount, values);
      return { values, base: income, scenarios: buildScenarios(values), warning: income.warning };
    }

    if (values.mode === "target") {
      const target = solveTarget(values);
      if (target.error) return { error: target.error };
      return { values, base: target, scenarios: buildScenarios(values), warning: target.income.warning };
    }

    const projection = simulateProjection(values);
    const opposite = simulateProjection(values, { reinvest: !values.reinvest });
    const noStress = values.stressEnabled
      ? simulateProjection(values, { stressEnabled: false })
      : null;

    return {
      values,
      base: projection,
      comparison: {
        withReinvest: values.reinvest ? projection : opposite,
        withoutReinvest: values.reinvest ? opposite : projection,
      },
      noStress,
      scenarios: buildScenarios(values),
      warning: "",
    };
  };

  const collectInputs = () => {
    clearErrors();
    const mode = getMode();
    const taxMode = getTaxMode();

    const values = {
      mode,
      taxMode,
      targetPeriod: getTargetPeriod(),
      targetBasis: getTargetBasis(),
      reinvest: getReinvestment(),
      frequency: Number(fields.payoutFrequency.value) || 4,
      incomeAmount: 0,
      targetIncome: 0,
      initialPortfolio: 0,
      monthlyContribution: 0,
      projectionYears: 20,
      dividendYield: validatePercent("dividendYield", parseNumber(fields.dividendYield.value), {
        min: 0,
        max: 100,
        label: "Az osztalékhozam legyen 0% és 100% között.",
      }),
      simpleDeduction: validatePercent("simpleDeduction", parseNumber(fields.simpleDeduction.value), {
        min: 0,
        max: 100,
        label: "A levonás legyen 0% és 100% között.",
      }),
      withholdingTax:
        taxMode === "detailed"
          ? validatePercent("withholdingTax", parseNumber(fields.withholdingTax.value))
          : 0,
      extraTax:
        taxMode === "detailed"
          ? validatePercent("extraTax", parseNumber(fields.extraTax.value))
          : 0,
      variableCost:
        taxMode === "detailed"
          ? validatePercent("variableCost", parseNumber(fields.variableCost.value))
          : 0,
      fixedCost: validateAmount("fixedCost", parseNumber(fields.fixedCost.value), { required: true }),
      dividendGrowth: 4,
      priceGrowth: 5,
      inflation: 3,
      contributionIncrease: 0,
      stressEnabled: elements.stressEnabled.checked,
      stressCut: 0,
      stressYear: 5,
    };

    if (mode === "income") {
      values.incomeAmount = validateAmount("incomeAmount", parseNumber(fields.incomeAmount.value), {
        allowZero: false,
      });
    }

    if (mode === "target") {
      values.targetIncome = validateAmount("targetIncome", parseNumber(fields.targetIncome.value), {
        allowZero: false,
      });
    }

    if (mode === "projection") {
      values.initialPortfolio = validateAmount(
        "initialPortfolio",
        parseNumber(fields.initialPortfolio.value)
      );
      values.monthlyContribution = validateAmount(
        "monthlyContribution",
        parseNumber(fields.monthlyContribution.value)
      );
      values.projectionYears = validateYears("projectionYears", parseNumber(fields.projectionYears.value));
      values.dividendGrowth = validatePercent("dividendGrowth", parseNumber(fields.dividendGrowth.value), {
        min: -100,
        max: 100,
        label: "Az osztaléknövekedés legyen -100% és 100% között.",
      });
      values.priceGrowth = validatePercent("priceGrowth", parseNumber(fields.priceGrowth.value), {
        min: -99,
        max: 100,
        label: "Az árfolyamváltozás legyen nagyobb mint -100% és legfeljebb 100%.",
      });
      values.inflation = validatePercent("inflation", parseNumber(fields.inflation.value), {
        min: -20,
        max: 100,
        label: "Az infláció legyen -20% és 100% között.",
      });
      values.contributionIncrease = validatePercent(
        "contributionIncrease",
        parseNumber(fields.contributionIncrease.value),
        {
          min: -100,
          max: 100,
          label: "A befizetésemelés legyen -100% és 100% között.",
        }
      );

      if (values.stressEnabled) {
        values.stressCut = validatePercent("stressCut", parseNumber(fields.stressCut.value), {
          min: 0,
          max: 100,
          label: "Az osztalékvágás legyen 0% és 100% között.",
        });
        values.stressYear = validateYears("stressYear", parseNumber(fields.stressYear.value), {
          max: Math.max(1, values.projectionYears || 60),
        });
      }

      if (
        values.initialPortfolio !== null &&
        values.monthlyContribution !== null &&
        values.initialPortfolio + values.monthlyContribution <= 0
      ) {
        setFieldError("monthlyContribution", "Adj meg kezdő portfóliót vagy havi befektetést.");
        values.monthlyContribution = null;
      }
    }

    const deductionPercent = getDeductionPercent(values);
    if (Number.isFinite(deductionPercent) && deductionPercent > 100) {
      const targetField = taxMode === "detailed" ? "variableCost" : "simpleDeduction";
      setFieldError(targetField, "A százalékos levonások összege nem haladhatja meg a 100%-ot.");
      values[targetField] = null;
    }

    const hasInvalid = Object.values(values).some((value) => value === null);
    return hasInvalid ? null : values;
  };

  const renderInvalidState = (message) => {
    lastValidModel = null;
    lastChartData = null;
    elements.resultHeading.textContent = "Éves nettó osztalék";
    elements.resultPrimary.textContent = "-";
    elements.resultGrid.innerHTML = "";
    elements.interpretation.textContent =
      message || "Adj meg értelmezhető adatokat, és a kalkulátor megmutatja a becsült eredményt.";
    setWarning("");
    elements.scenarioGrid.innerHTML = "";
    elements.chart.innerHTML = "";
    elements.chartLegend.innerHTML = "";
    elements.chartTooltip.hidden = true;
    elements.yearlyTableBody.innerHTML =
      '<tr><td colspan="12">Adj meg adatokat az éves bontáshoz.</td></tr>';
    document.dispatchEvent(
      new CustomEvent("kb:calculation-complete", {
        detail: { valid: false, source: form, calculator: "osztalek-kalkulator" },
      })
    );
  };

  const renderResultCards = (items) => {
    elements.resultGrid.innerHTML = items
      .map(
        (item) => `
          <div class="dividend-result-card">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </div>
        `
      )
      .join("");
  };

  const targetTypeText = (values) => {
    const period = values.targetPeriod === "monthly" ? "havi" : "éves";
    const basis = values.targetBasis === "net" ? "nettó" : "bruttó";
    return `${period} ${basis}`;
  };

  const renderResults = (model) => {
    const { values, base } = model;
    setWarning(model.warning || "");

    if (values.mode === "income") {
      elements.resultHeading.textContent = "Éves nettó osztalék";
      elements.resultPrimary.textContent = formatFt(base.annualNet);
      renderResultCards([
        { label: "Éves bruttó osztalék", value: formatFt(base.gross) },
        { label: "Havi nettó átlag", value: formatFt(base.monthlyNet) },
        { label: "Egy kifizetés nettó összege", value: formatFt(base.perPayment) },
        { label: "Teljes éves levonás", value: formatFt(base.deductions) },
        { label: "Tényleges nettó osztalékhozam", value: formatPercent(base.netYield) },
      ]);
      elements.interpretation.textContent = `A megadott feltételek alapján a ${formatCompactFt(
        values.incomeAmount
      )} forintos portfólió évente körülbelül ${formatCompactFt(
        base.annualNet
      )} nettó osztalékot termelhet. Ez havi átlagban nagyjából ${formatCompactFt(
        base.monthlyNet
      )}, ${fields.payoutFrequency.selectedOptions[0].textContent.toLowerCase()} fizetés esetén pedig kifizetésenként körülbelül ${formatCompactFt(
        base.perPayment
      )}.`;
      return;
    }

    if (values.mode === "target") {
      elements.resultHeading.textContent = "Szükséges portfólióméret";
      elements.resultPrimary.textContent = formatFt(base.requiredCapital);
      renderResultCards([
        { label: "Éves bruttó osztalék", value: formatFt(base.income.gross) },
        { label: "Éves nettó osztalék", value: formatFt(base.income.annualNet) },
        { label: "Havi nettó átlag", value: formatFt(base.income.monthlyNet) },
        { label: "Teljes éves levonás", value: formatFt(base.income.deductions) },
        { label: "Nettó osztalékhozam", value: formatPercent(base.income.netYield) },
      ]);
      elements.interpretation.textContent = `A megadott feltételek alapján a ${targetTypeText(
        values
      )} céljövedelemhez körülbelül ${formatCompactFt(
        base.requiredCapital
      )} portfólióra lehet szükség. A felfelé kerekített tőkével számolt éves nettó osztalék becslés szerint ${formatCompactFt(
        base.income.annualNet
      )}.`;
      return;
    }

    elements.resultHeading.textContent = "Várható portfólióérték";
    elements.resultPrimary.textContent = formatFt(base.finalPortfolio);
    renderResultCards([
      { label: "Teljes saját befizetés", value: formatFt(base.invested) },
      { label: "Összes nettó osztalék", value: formatFt(base.totalNetDividend) },
      {
        label: values.reinvest ? "Újrabefektetett osztalék" : "Kivett osztalék",
        value: formatFt(values.reinvest ? base.reinvestedDividend : base.withdrawnDividend),
      },
      { label: "Utolsó év becsült éves nettó osztaléka", value: formatFt(base.endingAnnualNetDividend) },
      { label: "Utolsó év havi nettó átlaga", value: formatFt(base.endingMonthlyNetAverage) },
      { label: "Mai vásárlóértékű portfólió", value: formatFt(base.realFinalPortfolio) },
      { label: "Mai vásárlóértékű éves osztalék", value: formatFt(base.realEndingAnnualNetDividend) },
      { label: "Saját befizetésre vetített osztalékhozam", value: formatPercent(base.yieldOnCost) },
    ]);

    const reinvestDelta =
      model.comparison.withReinvest.finalPortfolio - model.comparison.withoutReinvest.finalPortfolio;
    const incomeDelta =
      model.comparison.withReinvest.endingAnnualNetDividend -
      model.comparison.withoutReinvest.endingAnnualNetDividend;
    const stressText =
      model.noStress && values.stressEnabled
        ? ` Stresszteszt nélkül az utolsó év becsült nettó osztaléka ${formatCompactFt(
            model.noStress.endingAnnualNetDividend
          )}, a stressztesztben ${formatCompactFt(base.endingAnnualNetDividend)}.`
        : "";

    elements.interpretation.textContent = `A megadott feltételek alapján ${values.projectionYears} év végére a portfólió körülbelül ${formatCompactFt(
      base.finalPortfolio
    )} értéket érhet el. Újrabefektetéssel a portfólió becsült értéke ${formatCompactFt(
      Math.max(0, reinvestDelta)
    )}, az éves nettó osztalék pedig ${formatCompactFt(
      Math.max(0, incomeDelta)
    )} összeggel lehetne magasabb ugyanilyen feltételek mellett.${stressText}`;
  };

  const renderScenarios = (model) => {
    elements.scenarioGrid.innerHTML = model.scenarios
      .map((scenario) => {
        let value = "";
        let detail = "";

        if (model.values.mode === "income") {
          value = formatFt(scenario.result.annualNet);
          detail = `${formatPercent(scenario.yieldRate)} bruttó osztalékhozam`;
        } else if (model.values.mode === "target") {
          value = scenario.result.error ? "Nem számítható" : formatFt(scenario.result.requiredCapital);
          detail = `${formatPercent(scenario.yieldRate)} bruttó osztalékhozam`;
        } else {
          value = formatFt(scenario.result.finalPortfolio);
          detail = `Éves nettó osztalék: ${formatCompactFt(scenario.result.endingAnnualNetDividend)}`;
        }

        return `
          <article class="dividend-scenario" data-scenario="${escapeHtml(scenario.key)}">
            <span>${escapeHtml(scenario.name)}</span>
            <strong>${escapeHtml(value)}</strong>
            <small>${escapeHtml(detail)}</small>
          </article>
        `;
      })
      .join("");

    if (!scenarioTracked && hasUserInteracted) {
      scenarioTracked = true;
      track("dividend_scenario_view", {
        scenario_name: "all",
        time_category:
          model.values.mode === "projection" ? getTimeCategory(model.values.projectionYears) : "not_applicable",
      });
    }
  };

  const chartScale = (seriesValues) => {
    const maxValue = Math.max(1, ...seriesValues.filter(Number.isFinite));
    const x = (index, length) =>
      length <= 1
        ? CHART_PADDING.left
        : CHART_PADDING.left +
          (index / (length - 1)) * (SVG_WIDTH - CHART_PADDING.left - CHART_PADDING.right);
    const y = (value) =>
      SVG_HEIGHT -
      CHART_PADDING.bottom -
      (value / maxValue) * (SVG_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom);

    return { x, y, maxValue };
  };

  const renderLegend = (items) => {
    elements.chartLegend.innerHTML = items
      .map(
        (item) => `<span><i class="${escapeHtml(item.legendClass)}"></i>${escapeHtml(item.label)}</span>`
      )
      .join("");
  };

  const renderBarChart = (items) => {
    const values = items.map((item) => item.value);
    const scale = chartScale(values);
    const barAreaWidth = SVG_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
    const barWidth = Math.min(120, barAreaWidth / Math.max(1, items.length) - 22);
    const baseY = SVG_HEIGHT - CHART_PADDING.bottom;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => scale.maxValue * ratio);

    lastChartData = { type: "bar", items };
    elements.chart.innerHTML = `
      <g class="dividend-chart-grid">
        ${ticks
          .map((tick) => {
            const y = scale.y(tick);
            return `<line x1="${CHART_PADDING.left}" y1="${y}" x2="${SVG_WIDTH - CHART_PADDING.right}" y2="${y}"></line><text x="${CHART_PADDING.left - 10}" y="${y + 4}" text-anchor="end">${formatCompactFt(tick)}</text>`;
          })
          .join("")}
      </g>
      <g class="dividend-chart-axis">
        <line x1="${CHART_PADDING.left}" y1="${baseY}" x2="${SVG_WIDTH - CHART_PADDING.right}" y2="${baseY}"></line>
      </g>
      <g class="dividend-chart-bars">
        ${items
          .map((item, index) => {
            const slot = barAreaWidth / items.length;
            const x = CHART_PADDING.left + slot * index + (slot - barWidth) / 2;
            const y = scale.y(item.value);
            const height = Math.max(0, baseY - y);
            return `
              <rect tabindex="0" role="button" aria-label="${escapeHtml(item.label)}: ${formatFt(item.value)}" class="dividend-chart-bar ${escapeHtml(item.className)}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${height.toFixed(2)}" data-chart-point="${index}"></rect>
              <text class="dividend-chart-label" x="${(x + barWidth / 2).toFixed(2)}" y="${SVG_HEIGHT - 24}" text-anchor="middle">${escapeHtml(item.shortLabel)}</text>
            `;
          })
          .join("")}
      </g>
    `;
    renderLegend(items.map((item) => ({ label: item.label, legendClass: item.legendClass })));
  };

  const pointsFor = (rows, valueGetter, scale) =>
    rows
      .map((row, index) => `${scale.x(index, rows.length).toFixed(2)},${scale.y(valueGetter(row)).toFixed(2)}`)
      .join(" ");

  const renderLineChart = (rows, series, primaryGetter) => {
    const allValues = rows.flatMap((row) => series.map((item) => item.value(row)));
    const scale = chartScale(allValues);
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => scale.maxValue * ratio);
    const labelEvery = Math.max(1, Math.ceil(rows.length / 6));

    lastChartData = { type: "line", rows, series };
    elements.chart.innerHTML = `
      <g class="dividend-chart-grid">
        ${ticks
          .map((tick) => {
            const y = scale.y(tick);
            return `<line x1="${CHART_PADDING.left}" y1="${y}" x2="${SVG_WIDTH - CHART_PADDING.right}" y2="${y}"></line><text x="${CHART_PADDING.left - 10}" y="${y + 4}" text-anchor="end">${formatCompactFt(tick)}</text>`;
          })
          .join("")}
      </g>
      ${series
        .map(
          (item) =>
            `<polyline class="${escapeHtml(item.className)}" points="${pointsFor(rows, item.value, scale)}"></polyline>`
        )
        .join("")}
      <g class="dividend-chart-axis">
        <line x1="${CHART_PADDING.left}" y1="${SVG_HEIGHT - CHART_PADDING.bottom}" x2="${SVG_WIDTH - CHART_PADDING.right}" y2="${SVG_HEIGHT - CHART_PADDING.bottom}"></line>
        ${rows
          .filter((row, index) => index === 0 || index === rows.length - 1 || (index + 1) % labelEvery === 0)
          .map((row) => {
            const index = rows.indexOf(row);
            const x = scale.x(index, rows.length);
            return `<text x="${x}" y="${SVG_HEIGHT - 22}" text-anchor="middle">${row.year}. év</text>`;
          })
          .join("")}
      </g>
      <g class="dividend-chart-points">
        ${rows
          .map((row, index) => {
            const x = scale.x(index, rows.length);
            const y = scale.y(primaryGetter(row));
            return `<circle tabindex="0" role="button" aria-label="${row.year}. év: ${formatFt(primaryGetter(row))}" cx="${x}" cy="${y}" r="6" data-chart-point="${index}"></circle>`;
          })
          .join("")}
      </g>
    `;
    renderLegend(series.map((item) => ({ label: item.label, legendClass: item.legendClass })));
  };

  const renderChart = (model) => {
    elements.chartTooltip.hidden = true;

    if (model.values.mode === "income") {
      elements.chartTitle.textContent = "Éves bruttó, nettó és levonások";
      renderBarChart([
        { label: "Éves bruttó osztalék", shortLabel: "Bruttó", value: model.base.gross, className: "bar-gross", legendClass: "legend-gross" },
        { label: "Éves nettó osztalék", shortLabel: "Nettó", value: model.base.annualNet, className: "bar-net", legendClass: "legend-net" },
        { label: "Teljes levonás", shortLabel: "Levonás", value: model.base.deductions, className: "bar-deduction", legendClass: "legend-real" },
      ]);
      return;
    }

    if (model.values.mode === "target") {
      elements.chartTitle.textContent = "Szükséges tőke hozamfeltételezések szerint";
      renderBarChart(
        model.scenarios.map((scenario) => ({
          label: scenario.name,
          shortLabel: scenario.name.split(" ")[0],
          value: scenario.result.error ? 0 : scenario.result.requiredCapital,
          className: scenario.key === "base" ? "bar-net" : scenario.key === "lower" ? "bar-deduction" : "bar-gross",
          legendClass: scenario.key === "base" ? "legend-net" : scenario.key === "lower" ? "legend-real" : "legend-gross",
        }))
      );
      return;
    }

    const rows = model.base.rows;
    if (!rows.length) {
      elements.chart.innerHTML = "";
      elements.chartLegend.innerHTML = "";
      return;
    }

    if (getChartMode() === "dividend") {
      elements.chartTitle.textContent = "Osztalékjövedelem alakulása";
      renderLineChart(
        rows,
        [
          { label: "Éves bruttó osztalék", className: "line-gross", legendClass: "legend-gross", value: (row) => row.annualGrossDividend },
          { label: "Éves nettó osztalék", className: "line-net", legendClass: "legend-net", value: (row) => row.annualNetDividend },
          { label: "Mai vásárlóértékű nettó osztalék", className: "line-real", legendClass: "legend-real", value: (row) => row.realAnnualNetDividend },
        ],
        (row) => row.annualNetDividend
      );
      return;
    }

    elements.chartTitle.textContent = "Portfólió alakulása";
    renderLineChart(
      rows,
      [
        { label: "Saját befizetés", className: "line-invested", legendClass: "legend-invested", value: (row) => row.invested },
        { label: "Portfólióérték", className: "line-portfolio", legendClass: "legend-portfolio", value: (row) => row.portfolioValue },
        { label: "Mai vásárlóértékű portfólió", className: "line-real", legendClass: "legend-real", value: (row) => row.realPortfolioValue },
      ],
      (row) => row.portfolioValue
    );
  };

  const showChartTooltip = (event) => {
    const point = event.target.closest("[data-chart-point]");
    if (!point || !lastChartData || !lastValidModel) return;

    const index = Number(point.dataset.chartPoint);
    if (!Number.isInteger(index)) return;

    if (lastChartData.type === "bar") {
      const item = lastChartData.items[index];
      if (!item) return;
      elements.chartTooltip.innerHTML = `<strong>${escapeHtml(item.label)}</strong><span>${formatFt(item.value)}</span>`;
      elements.chartTooltip.hidden = false;
      return;
    }

    const row = lastChartData.rows[index];
    if (!row) return;

    const key = `${lastValidModel.values.mode}-${getChartMode()}-${row.year}`;
    if (chartInteractionKey !== key) {
      chartInteractionKey = key;
      track("dividend_chart_interaction", {
        time_category: getTimeCategory(lastValidModel.values.projectionYears),
      });
    }

    const lines = lastChartData.series
      .map((item) => `<span>${escapeHtml(item.label)}: ${formatFt(item.value(row))}</span>`)
      .join("");
    elements.chartTooltip.innerHTML = `<strong>${row.year}. év</strong>${lines}`;
    elements.chartTooltip.hidden = false;
  };

  const renderYearlyTable = (model) => {
    if (model.values.mode !== "projection") {
      elements.yearlyTableBody.innerHTML =
        '<tr><td colspan="12">Az éves bontás a hosszú távú módban érhető el.</td></tr>';
      return;
    }

    elements.yearlyTableBody.innerHTML = model.base.rows
      .map(
        (row) => `
          <tr>
            <td>${row.year}. év</td>
            <td>${formatFt(row.yearlyContribution)}</td>
            <td>${formatFt(row.invested)}</td>
            <td>${formatFt(row.portfolioValue)}</td>
            <td>${formatFt(row.annualGrossDividend)}</td>
            <td>${formatFt(row.annualDeductions)}</td>
            <td>${formatFt(row.annualNetDividend)}</td>
            <td>${formatFt(row.reinvestedDividend)}</td>
            <td>${formatFt(row.withdrawnDividend)}</td>
            <td>${formatFt(row.totalNetDividend)}</td>
            <td>${formatFt(row.nextYearNetDividend)}</td>
            <td>${formatFt(row.realPortfolioValue)}</td>
          </tr>
        `
      )
      .join("");
  };

  const sendTrack = (eventName, params = {}) => {
    if (
      !hasUserInteracted &&
      /^dividend_(?:income|target|projection)_calculate$/i.test(eventName)
    ) {
      return;
    }

    if (typeof window.KB_TRACK_EVENT !== "function") return;
    window.KB_TRACK_EVENT(eventName, {
      calculator: "osztalek-kalkulator",
      mode: getMode(),
      tax_mode: getTaxMode(),
      payout_frequency: fields.payoutFrequency.value,
      ...params,
    });
  };

  const scheduleCalculationTrack = (eventName, params = {}) => {
    if (!hasUserInteracted) return;

    const signature = JSON.stringify({
      eventName,
      mode: getMode(),
      taxMode: getTaxMode(),
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
    if (
      eventName === "dividend_income_calculate" ||
      eventName === "dividend_target_calculate" ||
      eventName === "dividend_projection_calculate"
    ) {
      scheduleCalculationTrack(eventName, params);
      return;
    }

    sendTrack(eventName, params);
  };

  const calculationEventName = (mode) =>
    mode === "target"
      ? "dividend_target_calculate"
      : mode === "projection"
        ? "dividend_projection_calculate"
        : "dividend_income_calculate";

  const renderModel = (model) => {
    lastValidModel = model;
    renderResults(model);
    renderScenarios(model);
    renderChart(model);
    renderYearlyTable(model);

    document.dispatchEvent(
      new CustomEvent("kb:calculation-complete", {
        detail: { valid: true, source: form, calculator: "osztalek-kalkulator" },
      })
    );

    const values = model.values;
    track(calculationEventName(values.mode), {
      target_type: values.mode === "target" ? values.targetBasis : undefined,
      target_period: values.mode === "target" ? values.targetPeriod : undefined,
      reinvestment: values.mode === "projection" ? values.reinvest : undefined,
      time_category: values.mode === "projection" ? getTimeCategory(values.projectionYears) : "not_applicable",
      stress_test: values.mode === "projection" ? values.stressEnabled : undefined,
    });

    if (values.stressEnabled && !stressTracked && hasUserInteracted) {
      stressTracked = true;
      track("dividend_stress_test_use", {
        time_category: getTimeCategory(values.projectionYears),
      });
    }
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

  const updateVisibility = () => {
    const mode = getMode();
    const taxMode = getTaxMode();
    const stressEnabled = elements.stressEnabled.checked;

    document.querySelectorAll("[data-modes]").forEach((element) => {
      const modes = (element.dataset.modes || "").split(/\s+/).filter(Boolean);
      const visible = modes.includes(mode);
      element.hidden = !visible;
      element.querySelectorAll("input, select, textarea, button").forEach((control) => {
        control.disabled = !visible;
      });
    });

    document.querySelectorAll("[data-tax-panel]").forEach((element) => {
      const visible = taxMode === element.dataset.taxPanel;
      element.hidden = !visible;
      element.querySelectorAll("input, select, textarea, button").forEach((control) => {
        control.disabled = !visible;
      });
    });

    [fields.stressCut, fields.stressYear].forEach((input) => {
      if (input) input.disabled = getMode() !== "projection" || !stressEnabled;
    });
  };

  const formatMoneyInputOnBlur = (input) => {
    const number = parseNumber(input.value);
    if (number === null || !Number.isFinite(number)) return;
    input.value = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(number);
  };

  Object.values(fields).forEach((input) => {
    input?.addEventListener("input", () => {
      hasUserInteracted = true;
      updateVisibility();
      calculate();
    });

    input?.addEventListener("change", () => {
      hasUserInteracted = true;
      updateVisibility();
      calculate();
      flushCalculationTrack();
    });
  });

  [
    fields.incomeAmount,
    fields.targetIncome,
    fields.initialPortfolio,
    fields.monthlyContribution,
    fields.fixedCost,
  ].forEach((input) => {
    input?.addEventListener("blur", () => {
      formatMoneyInputOnBlur(input);
      flushCalculationTrack();
    });
  });

  [
    fields.dividendYield,
    fields.simpleDeduction,
    fields.withholdingTax,
    fields.extraTax,
    fields.variableCost,
    fields.dividendGrowth,
    fields.priceGrowth,
    fields.inflation,
    fields.contributionIncrease,
    fields.stressCut,
    fields.stressYear,
    fields.projectionYears,
  ].forEach((input) => {
    input?.addEventListener("blur", flushCalculationTrack);
  });

  modeInputs.forEach((input) =>
    input.addEventListener("change", () => {
      hasUserInteracted = true;
      scenarioTracked = false;
      chartInteractionKey = "";
      updateVisibility();
      track("dividend_mode_change", { selected_mode: getMode() });
      calculate();
    })
  );

  taxModeInputs.forEach((input) =>
    input.addEventListener("change", () => {
      hasUserInteracted = true;
      updateVisibility();
      track("dividend_tax_mode_change", { selected_tax_mode: getTaxMode() });
      calculate();
    })
  );

  targetPeriodInputs.concat(targetBasisInputs).forEach((input) =>
    input.addEventListener("change", () => {
      hasUserInteracted = true;
      calculate();
    })
  );

  reinvestInputs.forEach((input) =>
    input.addEventListener("change", () => {
      hasUserInteracted = true;
      track("dividend_reinvestment_change", { reinvestment: getReinvestment() });
      calculate();
    })
  );

  chartModeInputs.forEach((input) =>
    input.addEventListener("change", () => {
      hasUserInteracted = true;
      chartInteractionKey = "";
      track("dividend_chart_change", { chart_type: getChartMode() });
      if (lastValidModel) renderChart(lastValidModel);
    })
  );

  elements.stressEnabled?.addEventListener("change", () => {
    hasUserInteracted = true;
    updateVisibility();
    calculate();
  });

  elements.advanced?.addEventListener("toggle", () => {
    if (elements.advanced.open && !advancedTracked) {
      advancedTracked = true;
      track("dividend_advanced_settings_open");
    }
  });

  elements.yearlyDetails?.addEventListener("toggle", () => {
    if (elements.yearlyDetails.open && !yearlyTracked) {
      yearlyTracked = true;
      track("dividend_yearly_table_open", {
        time_category: lastValidModel
          ? getTimeCategory(lastValidModel.values.projectionYears || 0)
          : "unknown",
      });
    }
  });

  elements.chart?.addEventListener("pointermove", showChartTooltip);
  elements.chart?.addEventListener("focusin", showChartTooltip);
  elements.chart?.addEventListener("click", showChartTooltip);
  elements.chart?.addEventListener("pointerleave", () => {
    elements.chartTooltip.hidden = true;
  });

  updateVisibility();
  calculate();
})();

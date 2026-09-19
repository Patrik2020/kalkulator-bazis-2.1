// Quality 3.0 page-specific module: atlag-kalkulator
(() => {
  const root = document.querySelector('[data-average-hub="true"]');
  if (!root) return;

  const mode = root.querySelector('#averageMode');
  const simplePanel = root.querySelector('[data-average-panel="simple"]');
  const weightedPanel = root.querySelector('[data-average-panel="weighted"]');
  const geometricPanel = root.querySelector('[data-average-panel="geometric"]');
  const result = root.querySelector('#averageHubResult');

  const format = (value, digits = 6) => new Intl.NumberFormat('hu-HU', {
    maximumFractionDigits: digits,
    useGrouping: true,
  }).format(value);

  const parseList = (value) => String(value || '')
    .split(/[;\n]+|\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => Number(token.replace(',', '.')));

  const renderError = (message) => {
    result.innerHTML = `<p class="error-message">${message}</p>`;
  };

  const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? sorted[middle]
      : (sorted[middle - 1] + sorted[middle]) / 2;
  };

  const calculateSimple = () => {
    const values = parseList(root.querySelector('#averageValues')?.value);
    if (!values.length || values.some((value) => !Number.isFinite(value))) {
      renderError('Adj meg legalább egy érvényes számot. Az értékeket pontosvesszővel, szóközzel vagy sortöréssel válaszd el.');
      return;
    }
    const sum = values.reduce((total, value) => total + value, 0);
    const average = sum / values.length;
    result.innerHTML = `
      <p><strong>Számtani átlag:</strong> ${format(average)}</p>
      <p><strong>Medián:</strong> ${format(median(values))}</p>
      <p><strong>Összeg:</strong> ${format(sum)}</p>
      <p><strong>Elemszám:</strong> ${values.length}</p>`;
  };

  const calculateWeighted = () => {
    const values = parseList(root.querySelector('#weightedValuesHub')?.value);
    const weights = parseList(root.querySelector('#weightedWeightsHub')?.value);
    if (!values.length || values.some((value) => !Number.isFinite(value))) {
      renderError('Adj meg érvényes értékeket a súlyozott átlaghoz.');
      return;
    }
    if (weights.length !== values.length || weights.some((weight) => !Number.isFinite(weight) || weight < 0)) {
      renderError('Minden értékhez pontosan egy nem negatív súly tartozzon.');
      return;
    }
    const weightSum = weights.reduce((total, weight) => total + weight, 0);
    if (weightSum <= 0) {
      renderError('A súlyok összege legyen nagyobb nullánál.');
      return;
    }
    const weightedSum = values.reduce((total, value, index) => total + value * weights[index], 0);
    result.innerHTML = `
      <p><strong>Súlyozott átlag:</strong> ${format(weightedSum / weightSum)}</p>
      <p><strong>Súlyok összege:</strong> ${format(weightSum)}</p>
      <p><strong>Elemszám:</strong> ${values.length}</p>`;
  };

  const calculateGeometric = () => {
    const values = parseList(root.querySelector('#geometricValuesHub')?.value);
    if (!values.length || values.some((value) => !Number.isFinite(value) || value <= 0)) {
      renderError('A mértani átlaghoz minden megadott értéknek pozitív számnak kell lennie.');
      return;
    }
    const logMean = values.reduce((total, value) => total + Math.log(value), 0) / values.length;
    const geometric = Math.exp(logMean);
    result.innerHTML = `
      <p><strong>Mértani átlag:</strong> ${format(geometric)}</p>
      <p><strong>Elemszám:</strong> ${values.length}</p>`;
  };

  const calculate = () => {
    if (mode.value === 'weighted') calculateWeighted();
    else if (mode.value === 'geometric') calculateGeometric();
    else calculateSimple();
  };

  const syncPanels = () => {
    [simplePanel, weightedPanel, geometricPanel].forEach((panel) => {
      if (!panel) return;
      panel.hidden = panel.dataset.averagePanel !== mode.value;
    });
    calculate();
  };

  mode.addEventListener('change', syncPanels);
  root.querySelectorAll('textarea, input').forEach((input) => input.addEventListener('input', calculate));
  syncPanels();
})();

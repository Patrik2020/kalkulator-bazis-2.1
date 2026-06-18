// ===== SEGÉD =====
function formatNumber(num) {
  return new Intl.NumberFormat("hu-HU").format(num);
}

function isValid(...values) {
  return values.every(v => !isNaN(v) && v > 0);
}


// ===== FOGYASZTÁS =====
const distance = document.getElementById("distance");
const fuelUsed = document.getElementById("fuelUsed");
const resultConsumption = document.getElementById("result-consumption");

function calcConsumption() {
  const d = parseFloat(distance.value);
  const f = parseFloat(fuelUsed.value);

  if (!isValid(d, f)) {
    resultConsumption.textContent = "–";
    return;
  }

  const consumption = (f / d) * 100;
  resultConsumption.textContent = consumption.toFixed(2) + " l/100 km";
}


// ===== KÖLTSÉG =====
const distanceCost = document.getElementById("distance-cost");
const consumptionCost = document.getElementById("consumption-cost");
const fuelPrice = document.getElementById("fuelPrice");
const resultCost = document.getElementById("result-cost");

function calcCost() {
  const d = parseFloat(distanceCost.value);
  const c = parseFloat(consumptionCost.value);
  const p = parseFloat(fuelPrice.value);

  if (!isValid(d, c, p)) {
    resultCost.textContent = "–";
    return;
  }

  const cost = (d * c / 100) * p;
  resultCost.textContent = formatNumber(Math.round(cost)) + " Ft";
}


// ===== HATÓTÁV =====
const tankSize = document.getElementById("tankSize");
const consumptionRange = document.getElementById("consumption-range");
const resultRange = document.getElementById("result-range");

function calcRange() {
  const t = parseFloat(tankSize.value);
  const c = parseFloat(consumptionRange.value);

  if (!isValid(t, c)) {
    resultRange.textContent = "–";
    return;
  }

  const range = (t / c) * 100;
  resultRange.textContent = formatNumber(Math.round(range)) + " km";
}


// ===== AUTOMATA FIGYELÉS =====
function attachAutoCalc(inputs, callback) {
  inputs.forEach(input => {
    input?.addEventListener("input", callback);
    input?.addEventListener("change", callback);
  });
}


// ===== HOOK =====
attachAutoCalc([distance, fuelUsed], calcConsumption);
attachAutoCalc([distanceCost, consumptionCost, fuelPrice], calcCost);
attachAutoCalc([tankSize, consumptionRange], calcRange);


// ===== KEZDŐ FUTTATÁS (ha vannak default értékek) =====
calcConsumption();
calcCost();
calcRange();
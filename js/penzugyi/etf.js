// ===== HELYI SEGÉDEK =====
function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

function parseNumber(value) {
  return parseFloat(value.replace(/\s/g, "")) || 0;
}

function formatInput(input) {
  input.addEventListener("input", (e) => {
    let raw = e.target.value.replace(/\s/g, "").replace(/\D/g, "");

    if (!raw) {
      e.target.value = "";
      return;
    }

    e.target.value = new Intl.NumberFormat("hu-HU").format(raw);
  });
}


// ===== ELEMEK =====
const initial = document.getElementById("initial");
const monthly = document.getElementById("monthly");
const rate = document.getElementById("rate");
const years = document.getElementById("years");

const resultFinal = document.getElementById("result-final");
const resultProfit = document.getElementById("result-profit");


// ===== SZÁMOLÁS =====
function calcETF() {
  const P = parseNumber(initial.value);
  const M = parseNumber(monthly.value);
  const r = (parseFloat(rate.value) || 0) / 100 / 12;
  const n = (parseFloat(years.value) || 0) * 12;

  if (n <= 0) {
    resultFinal.textContent = "–";
    resultProfit.textContent = "";
    return;
  }

  let total = P;

  for (let i = 0; i < n; i++) {
    total = total * (1 + r) + M;
  }

  const invested = P + M * n;
  const profit = total - invested;

  resultFinal.textContent = format(total) + " Ft";
  resultProfit.textContent = "Nyereség: " + format(profit) + " Ft";
}


// ===== INPUT FORMAT =====
formatInput(initial);
formatInput(monthly);


// ===== AUTO =====
[initial, monthly, rate, years].forEach(i => {
  i?.addEventListener("input", calcETF);
});

calcETF();
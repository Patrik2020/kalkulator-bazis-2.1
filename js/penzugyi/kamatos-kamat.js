function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

function parseNumber(value) {
  return parseFloat(value.replace(/\s/g, "")) || 0;
}

function formatInput(input) {
  input.addEventListener("input", (e) => {
    let raw = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
    if (!raw) return e.target.value = "";
    e.target.value = new Intl.NumberFormat("hu-HU").format(raw);
  });
}

const initial = document.getElementById("initial");
const monthly = document.getElementById("monthly");
const rate = document.getElementById("rate");
const years = document.getElementById("years");

const resultFinal = document.getElementById("result-final");
const resultProfit = document.getElementById("result-profit");

function calc() {
  const P = parseNumber(initial.value);
  const M = parseNumber(monthly.value);
  const r = (parseFloat(rate.value) || 0) / 100 / 12;
  const n = (parseFloat(years.value) || 0) * 12;

  if (!n) {
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

formatInput(initial);
formatInput(monthly);

[initial, monthly, rate, years].forEach(i => {
  i?.addEventListener("input", calc);
});

calc();
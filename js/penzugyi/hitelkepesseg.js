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

const income = document.getElementById("income");
const existing = document.getElementById("existing");
const rate = document.getElementById("rate");
const years = document.getElementById("years");

const resultMonthly = document.getElementById("result-monthly");
const resultLoan = document.getElementById("result-loan");

function calc() {
  const inc = parseNumber(income.value);
  const ex = parseNumber(existing.value);

  const r = (parseFloat(rate.value) || 0) / 100 / 12;
  const n = (parseFloat(years.value) || 0) * 12;

  if (!inc || !r || !n) {
    resultMonthly.textContent = "–";
    resultLoan.textContent = "";
    return;
  }

  const maxRatio = 0.4; // 40%
  const maxMonthly = inc * maxRatio - ex;

  if (maxMonthly <= 0) {
    resultMonthly.textContent = "0 Ft";
    resultLoan.textContent = "Nincs hitelképesség";
    return;
  }

  const loan = maxMonthly * (1 - Math.pow(1 + r, -n)) / r;

  resultMonthly.textContent = format(maxMonthly) + " Ft";
  resultLoan.textContent = "Max hitel: " + format(loan) + " Ft";
}

// format
formatInput(income);
formatInput(existing);

// auto
[income, existing, rate, years].forEach(i => {
  i?.addEventListener("input", calc);
});

calc();
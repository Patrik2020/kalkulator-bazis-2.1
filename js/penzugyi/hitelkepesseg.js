function format(num) { return new Intl.NumberFormat("hu-HU").format(Math.round(num)); }
function parseNumber(value) {
  const parsed = Number.parseFloat((value || "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}
function formatInput(input) {
  input?.addEventListener("input", (event) => {
    const raw = event.target.value.replace(/\s/g, "").replace(/\D/g, "");
    event.target.value = raw ? new Intl.NumberFormat("hu-HU").format(raw) : "";
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
  const annualRate = parseNumber(rate.value);
  const yearValue = parseNumber(years.value);
  const months = Math.round(yearValue * 12);

  if (inc <= 0 || ex < 0 || annualRate < 0 || yearValue <= 0 || months <= 0) {
    resultMonthly.textContent = "–";
    resultLoan.textContent = "";
    return;
  }

  const planningRatio = 0.4;
  const maxMonthly = inc * planningRatio - ex;
  if (maxMonthly <= 0) {
    resultMonthly.textContent = "0 Ft";
    resultLoan.textContent = "Nincs becsülhető szabad havi részlet.";
    return;
  }

  const monthlyRate = annualRate / 100 / 12;
  const loan = monthlyRate === 0
    ? maxMonthly * months
    : maxMonthly * (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;

  resultMonthly.textContent = `${format(maxMonthly)} Ft`;
  resultLoan.textContent = `Becsült hitelösszeg: ${format(loan)} Ft`;
}

formatInput(income);
formatInput(existing);
[income, existing, rate, years].forEach((input) => input?.addEventListener("input", calc));
calc();

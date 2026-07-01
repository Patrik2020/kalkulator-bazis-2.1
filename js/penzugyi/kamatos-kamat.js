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

const initial = document.getElementById("initial");
const monthly = document.getElementById("monthly");
const rate = document.getElementById("rate");
const years = document.getElementById("years");
const resultFinal = document.getElementById("result-final");
const resultProfit = document.getElementById("result-profit");

function calc() {
  const principal = parseNumber(initial.value);
  const contribution = parseNumber(monthly.value);
  const annualRate = parseNumber(rate.value);
  const yearValue = parseNumber(years.value);
  const months = Math.round(yearValue * 12);

  if (principal < 0 || contribution < 0 || annualRate <= -100 || yearValue <= 0 || months <= 0 || (principal === 0 && contribution === 0)) {
    resultFinal.textContent = "–";
    resultProfit.textContent = "";
    return;
  }

  // Az éves hozamot effektív éves rátának tekintjük, majd matematikailag
  // egyenértékű havi rátára bontjuk. A havi befizetés hónap végén történik.
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  let total = principal;
  for (let month = 0; month < months; month += 1) {
    total = total * (1 + monthlyRate) + contribution;
  }

  const invested = principal + contribution * months;
  const profit = total - invested;
  resultFinal.textContent = `${format(total)} Ft`;
  resultProfit.textContent = `${profit >= 0 ? "Hozam" : "Veszteség"}: ${format(Math.abs(profit))} Ft · Befizetés: ${format(invested)} Ft`;
}

formatInput(initial);
formatInput(monthly);
[initial, monthly, rate, years].forEach((input) => input?.addEventListener("input", calc));
calc();

function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}
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
function annuityPayment(principal, monthlyRate, months) {
  if (monthlyRate === 0) return principal / months;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}

const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const years = document.getElementById("years");
const useThm = document.getElementById("use-thm");
const thmWrapper = document.getElementById("thm-wrapper");
const thm = document.getElementById("thm");
const resultMonthly = document.getElementById("result-monthly");
const resultTotal = document.getElementById("result-total");
const resultInterest = document.getElementById("result-interest");
const resultThmInfo = document.getElementById("result-thm-info");

formatInput(amount);

useThm?.addEventListener("change", () => {
  thmWrapper.classList.toggle("hidden", !useThm.checked);
  rate.disabled = useThm.checked;
  calcLoan();
});

function clearResults(message = "–") {
  resultMonthly.textContent = message;
  resultTotal.textContent = "";
  resultInterest.textContent = "";
  resultThmInfo.textContent = "";
}

function calcLoan() {
  const principal = parseNumber(amount.value);
  const annualRate = useThm.checked ? parseNumber(thm.value) : parseNumber(rate.value);
  const yearValue = parseNumber(years.value);
  const months = Math.round(yearValue * 12);

  if (principal <= 0 || yearValue <= 0 || months <= 0) return clearResults();
  if (annualRate < 0 || annualRate > 100) return clearResults("Adj meg 0% és 100% közötti éves értéket.");

  // A kamat mezőt nominális éves kamatként kezeljük; THM-nél éves effektív
  // rátából képzünk matematikailag egyenértékű havi rátát. A THM-alapú részlet
  // ettől még csak közelítés, mert a díjak időzítését nem ismerjük.
  const monthlyRate = useThm.checked
    ? Math.pow(1 + annualRate / 100, 1 / 12) - 1
    : annualRate / 100 / 12;

  const monthly = annuityPayment(principal, monthlyRate, months);
  const total = monthly * months;
  const financingCost = total - principal;

  if (![monthly, total, financingCost].every(Number.isFinite)) {
    return clearResults("A megadott adatokból nem számítható eredmény.");
  }

  resultMonthly.textContent = `${format(monthly)} Ft`;
  resultTotal.textContent = `Teljes visszafizetés: ${format(total)} Ft`;
  resultInterest.textContent = `${useThm.checked ? "Becsült teljes finanszírozási költség" : "Kamatteher"}: ${format(financingCost)} Ft`;
  resultThmInfo.textContent = useThm.checked
    ? "THM-ből képzett egyenértékű havi rátával számolt közelítés; a banki díjak időzítése eltérést okozhat."
    : annualRate === 0
      ? "0%-os kamatnál a tőkét egyenlő havi részekre osztja."
      : "Nominális éves kamatból képzett havi kamattal számolva.";
}

[amount, rate, years, thm].forEach((input) => input?.addEventListener("input", calcLoan));
calcLoan();

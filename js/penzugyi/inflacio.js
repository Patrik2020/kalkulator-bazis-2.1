function format(num) { return new Intl.NumberFormat("hu-HU").format(Math.round(num)); }
function parseNumber(value) {
  const parsed = Number.parseFloat((value || "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}
function formatInput(input) {
  input?.addEventListener("input", (event) => {
    const raw = event.target.value.replace(/\s/g, "").replace(/\D/g, "");
    event.target.value = raw ? new Intl.NumberFormat("hu-HU").format(raw) : "";
  });
}

const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const years = document.getElementById("years");
const resultFinal = document.getElementById("result-final");
const resultLoss = document.getElementById("result-loss");

function calcInflation() {
  const initial = parseNumber(amount.value);
  const annualRatePercent = parseNumber(rate.value);
  const yearValue = parseNumber(years.value);
  if (initial === null || initial < 0 || annualRatePercent === null || annualRatePercent <= -100 || yearValue === null || yearValue < 0) {
    resultFinal.textContent = "–";
    resultLoss.textContent = "";
    return;
  }

  const futurePurchasingPower = initial / Math.pow(1 + annualRatePercent / 100, yearValue);
  const change = initial - futurePurchasingPower;
  resultFinal.textContent = `${format(futurePurchasingPower)} Ft`;
  resultLoss.textContent = change >= 0
    ? `Vásárlóerő-csökkenés: ${format(change)} Ft`
    : `Vásárlóerő-növekedés: ${format(Math.abs(change))} Ft`;
}

formatInput(amount);
[amount, rate, years].forEach((input) => input?.addEventListener("input", calcInflation));
calcInflation();

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

const price = document.getElementById("price");
const percent = document.getElementById("percent");
const resultDown = document.getElementById("result-down");
const resultLoan = document.getElementById("result-loan");

function calc() {
  const propertyPrice = parseNumber(price.value);
  const downPaymentPercent = parseNumber(percent.value);
  if (propertyPrice <= 0 || downPaymentPercent < 0 || downPaymentPercent > 100) {
    resultDown.textContent = "–";
    resultLoan.textContent = downPaymentPercent > 100 ? "Az önerő aránya legfeljebb 100% lehet." : "";
    return;
  }
  const downPayment = propertyPrice * downPaymentPercent / 100;
  resultDown.textContent = `${format(downPayment)} Ft`;
  resultLoan.textContent = `Finanszírozandó összeg: ${format(propertyPrice - downPayment)} Ft`;
}

formatInput(price);
[price, percent].forEach((input) => input?.addEventListener("input", calc));
calc();

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

const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const years = document.getElementById("years");

const resultFinal = document.getElementById("result-final");
const resultLoss = document.getElementById("result-loss");

function calcInflation() {
  const A = parseNumber(amount.value);
  const r = (parseFloat(rate.value) || 0) / 100;
  const n = parseFloat(years.value) || 0;

  if (!A || !r || !n) {
    resultFinal.textContent = "–";
    resultLoss.textContent = "";
    return;
  }

  const final = A / Math.pow(1 + r, n);
  const loss = A - final;

  resultFinal.textContent = format(final) + " Ft";
  resultLoss.textContent = "Értékvesztés: " + format(loss) + " Ft";
}

// format
formatInput(amount);

// auto
[amount, rate, years].forEach(i => {
  i?.addEventListener("input", calcInflation);
});

calcInflation();
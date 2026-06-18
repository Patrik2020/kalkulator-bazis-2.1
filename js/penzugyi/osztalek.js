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
const yieldInput = document.getElementById("yield");
const tax = document.getElementById("tax");

const resultGross = document.getElementById("result-gross");
const resultNet = document.getElementById("result-net");
const resultMonthly = document.getElementById("result-monthly");

function calc() {
  const A = parseNumber(amount.value);
  const y = (parseFloat(yieldInput.value) || 0) / 100;
  const t = (parseFloat(tax.value) || 0) / 100;

  if (!A || !y) {
    resultGross.textContent = "–";
    resultNet.textContent = "";
    resultMonthly.textContent = "";
    return;
  }

  const gross = A * y;
  const net = gross * (1 - t);

  resultGross.textContent = format(gross) + " Ft / év";
  resultNet.textContent = "Nettó: " + format(net) + " Ft / év";
  resultMonthly.textContent = "Havi: " + format(net / 12) + " Ft";
}

formatInput(amount);

[amount, yieldInput, tax].forEach(i => {
  i?.addEventListener("input", calc);
});

calc();
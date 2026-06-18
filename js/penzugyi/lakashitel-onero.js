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

const price = document.getElementById("price");
const percent = document.getElementById("percent");

const resultDown = document.getElementById("result-down");
const resultLoan = document.getElementById("result-loan");

function calc() {
  const p = parseNumber(price.value);
  const perc = (parseFloat(percent.value) || 0) / 100;

  if (!p || !perc) {
    resultDown.textContent = "–";
    resultLoan.textContent = "";
    return;
  }

  const down = p * perc;
  const loan = p - down;

  resultDown.textContent = format(down) + " Ft";
  resultLoan.textContent = "Hitel: " + format(loan) + " Ft";
}

formatInput(price);

[price, percent].forEach(i => {
  i?.addEventListener("input", calc);
});

calc();
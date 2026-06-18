function format(num) {
  return new Intl.NumberFormat("hu-HU").format(Math.round(num));
}

function parseNumber(value) {
  return parseFloat(value.replace(/\s/g, "")) || 0;
}

function formatInput(input) {
  input.addEventListener("input", (e) => {
    let raw = e.target.value.replace(/\s/g, "").replace(/\D/g, "");

    if (!raw) {
      e.target.value = "";
      return;
    }

    e.target.value = new Intl.NumberFormat("hu-HU").format(raw);
  });
}

// INPUTOK
const amount = document.getElementById("amount");
const rate = document.getElementById("rate");
const years = document.getElementById("years");

const useThm = document.getElementById("use-thm");
const thmWrapper = document.getElementById("thm-wrapper");
const thm = document.getElementById("thm");

// EREDMÉNYEK
const resultMonthly = document.getElementById("result-monthly");
const resultTotal = document.getElementById("result-total");
const resultInterest = document.getElementById("result-interest");
const resultThmInfo = document.getElementById("result-thm-info");

// INPUT FORMÁZÁS
formatInput(amount);

// THM mező mutatás/elrejtés
useThm?.addEventListener("change", () => {

  if (useThm.checked) {

    thmWrapper.classList.remove("hidden");

    rate.disabled = true;

  } else {

    thmWrapper.classList.add("hidden");

    rate.disabled = false;
  }

  calcLoan();
});

// SZÁMOLÁS
function calcLoan() {

  const P = parseNumber(amount.value);

  const normalRate = parseFloat(rate.value) || 0;

  const thmRate = parseFloat(thm.value) || 0;

  const activeRate = useThm.checked && thmRate
    ? thmRate
    : normalRate;

  const r = activeRate / 100 / 12;

  const n = (parseFloat(years.value) || 0) * 12;

  // VALIDÁCIÓ
  if (!P || !r || !n) {

    resultMonthly.textContent = "–";
    resultTotal.textContent = "";
    resultInterest.textContent = "";
    resultThmInfo.textContent = "";

    return;
  }

  // ANNUITÁSOS TÖRLESZTÉS
  const monthly = P * r / (1 - Math.pow(1 + r, -n));

  const total = monthly * n;

  const interest = total - P;

  // KIÍRÁS
  resultMonthly.textContent =
    format(monthly) + " Ft";

  resultTotal.textContent =
    "Teljes visszafizetés: " +
    format(total) + " Ft";

  resultInterest.textContent =
    "Kamat / teljes hitelköltség: " +
    format(interest) + " Ft";

  resultThmInfo.textContent =
    useThm.checked && thmRate
      ? "THM alapján számolva"
      : "Kamat alapján számolva";
}

// AUTO SZÁMOLÁS
[amount, rate, years, thm].forEach(input => {

  input?.addEventListener("input", calcLoan);

});

// INDÍTÁS
calcLoan();
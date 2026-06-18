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

const initial = document.getElementById("initial");
const monthly = document.getElementById("monthly");
const rate = document.getElementById("rate");
const goal = document.getElementById("goal");

const resultTime = document.getElementById("result-time");
const resultDate = document.getElementById("result-date");

function setGoal(value) {
  goal.value = format(value);
  calc();
}

document.querySelectorAll("[data-goal-value]").forEach((button) => {
  button.addEventListener("click", () => {
    setGoal(Number(button.dataset.goalValue));
  });
});

function calc() {
  const P = parseNumber(initial.value);
  const M = parseNumber(monthly.value);
  const r = (parseFloat(rate.value) || 0) / 100 / 12;
  const G = parseNumber(goal.value);

  if (!G || (!P && !M)) {
    resultTime.textContent = "–";
    resultDate.textContent = "";
    return;
  }

  let total = P;
  let months = 0;

  while (total < G && months < 1000 * 12) {
    total = total * (1 + r) + M;
    months++;
  }

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  resultTime.textContent = `${years} év ${remMonths} hónap`;

  const future = new Date();
  future.setMonth(future.getMonth() + months);

  resultDate.textContent = "Elérés dátuma: " + future.toLocaleDateString("hu-HU");
}

formatInput(initial);
formatInput(monthly);
formatInput(goal);

[initial, monthly, rate, goal].forEach(i => {
  i?.addEventListener("input", calc);
});

calc();

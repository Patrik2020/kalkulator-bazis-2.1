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
const goal = document.getElementById("goal");
const resultTime = document.getElementById("result-time");
const resultDate = document.getElementById("result-date");

function setGoal(value) {
  goal.value = format(value);
  calc();
}
document.querySelectorAll("[data-goal-value]").forEach((button) => {
  button.addEventListener("click", () => setGoal(Number(button.dataset.goalValue)));
});

function calc() {
  const principal = parseNumber(initial.value);
  const contribution = parseNumber(monthly.value);
  const annualRate = parseNumber(rate.value);
  const target = parseNumber(goal.value);

  if (principal < 0 || contribution < 0 || annualRate <= -100 || target <= 0) {
    resultTime.textContent = "–";
    resultDate.textContent = "";
    return;
  }
  if (principal >= target) {
    resultTime.textContent = "A cél már teljesült";
    resultDate.textContent = `Jelenlegi összeg: ${format(principal)} Ft`;
    return;
  }

  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  if (contribution === 0 && monthlyRate <= 0) {
    resultTime.textContent = "A cél ezekkel a feltételekkel nem érhető el.";
    resultDate.textContent = "Növeld a havi megtakarítást vagy adj meg pozitív hozamfeltételezést.";
    return;
  }

  let total = principal;
  let months = 0;
  const maximumMonths = 1_200; // 100 év: ezen túl a becslés már nem életszerű.
  while (total < target && months < maximumMonths) {
    total = total * (1 + monthlyRate) + contribution;
    months += 1;
    if (!Number.isFinite(total) || total < 0) break;
  }

  if (total < target || !Number.isFinite(total)) {
    resultTime.textContent = "A cél 100 éven belül nem érhető el a megadott feltételekkel.";
    resultDate.textContent = "Próbálj magasabb havi megtakarítást vagy más célösszeget.";
    return;
  }

  resultTime.textContent = `${Math.floor(months / 12)} év ${months % 12} hónap`;
  const future = new Date();
  future.setMonth(future.getMonth() + months);
  resultDate.textContent = `Becsült elérési dátum: ${future.toLocaleDateString("hu-HU")}`;
}

formatInput(initial);
formatInput(monthly);
formatInput(goal);
[initial, monthly, rate, goal].forEach((input) => input?.addEventListener("input", calc));
calc();

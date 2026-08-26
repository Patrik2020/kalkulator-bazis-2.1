const weight = document.getElementById("weight");
const height = document.getElementById("height");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const activity = document.getElementById("activity");

const resultCalories = document.getElementById("result-calories");
const resultGoal = document.getElementById("result-goal");

function calcCalories() {
  const w = parseFloat(weight.value);
  const h = parseFloat(height.value);
  const a = parseFloat(age.value);
  const act = parseFloat(activity.value);

  if (
    !Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(a) ||
    !Number.isFinite(act) || w <= 0 || h <= 0 || a <= 0 || act <= 0
  ) {
    resultCalories.textContent = "–";
    resultGoal.textContent = "";
    return;
  }

  if (a < 18) {
    resultCalories.textContent = "–";
    resultGoal.textContent = "A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk.";
    return;
  }

  let bmr;

  if (gender.value === "male") {
    bmr = 10 * w + 6.25 * h - 5 * a + 5;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * a - 161;
  }

  const maintenance = bmr * act;

  if (!Number.isFinite(maintenance) || maintenance <= 0) {
    resultCalories.textContent = "–";
    resultGoal.textContent = "A megadott adatokból nem adható életszerű becslés.";
    return;
  }

  resultCalories.textContent = Math.round(maintenance) + " kcal";

  const lowerScenario = maintenance - 400;
  const upperScenario = maintenance + 400;
  resultGoal.textContent = lowerScenario > 0
    ? "Példa a fenntartó értékhez képest: -400 kcal → " + Math.round(lowerScenario) +
      " kcal | +400 kcal → " + Math.round(upperScenario) + " kcal"
    : "A -400 kcal-os példaforgatókönyv ennél a becslésnél nem értelmezhető. +400 kcal → " +
      Math.round(upperScenario) + " kcal.";
}

[weight, height, age].forEach(i => {
  i?.addEventListener("input", calcCalories);
});

[gender, activity].forEach(i => {
  i?.addEventListener("change", calcCalories);
});

calcCalories();
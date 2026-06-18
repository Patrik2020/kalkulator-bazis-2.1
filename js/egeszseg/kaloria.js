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

  if (!w || !h || !a) {
    resultCalories.textContent = "–";
    resultGoal.textContent = "";
    return;
  }

  let bmr;

  if (gender.value === "male") {
    bmr = 10 * w + 6.25 * h - 5 * a + 5;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * a - 161;
  }

  const maintenance = bmr * act;

  resultCalories.textContent = Math.round(maintenance) + " kcal";

  resultGoal.textContent =
    "Fogyás: " + Math.round(maintenance - 400) +
    " kcal | Tömegnövelés: " + Math.round(maintenance + 400) + " kcal";
}

[weight, height, age].forEach(i => {
  i?.addEventListener("input", calcCalories);
});

[gender, activity].forEach(i => {
  i?.addEventListener("change", calcCalories);
});

calcCalories();
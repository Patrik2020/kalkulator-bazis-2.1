const weight = document.getElementById("weight");
const height = document.getElementById("height");
const resultBMI = document.getElementById("result-bmi");
const resultCategory = document.getElementById("result-category");

function calcBMI() {
  const w = parseFloat(weight.value);
  const h = parseFloat(height.value);

  if (!w || !h) {
    resultBMI.textContent = "–";
    resultCategory.textContent = "";
    return;
  }

  const heightM = h / 100;
  const bmi = w / (heightM * heightM);

  resultBMI.textContent = bmi.toFixed(1);

  if (bmi < 18.5) {
    resultCategory.textContent = "Sovány";
  } else if (bmi < 25) {
    resultCategory.textContent = "Normál testsúly";
  } else if (bmi < 30) {
    resultCategory.textContent = "Túlsúly";
  } else {
    resultCategory.textContent = "Elhízás";
  }
}

[weight, height].forEach(input => {
  input?.addEventListener("input", calcBMI);
});

calcBMI();
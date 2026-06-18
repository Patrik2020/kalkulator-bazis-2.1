// ===== SEGÉD =====
function formatNumber(num) {
  return new Intl.NumberFormat("hu-HU").format(num);
}

function isValid(...values) {
  return values.every(v => !isNaN(v) && v > 0);
}


// ===== ELEMEK =====
const length = document.getElementById("length");
const width = document.getElementById("width");
const depth = document.getElementById("depth");
const result = document.getElementById("result-volume");


// ===== SZÁMOLÁS =====
function calcConcrete() {
  const l = parseFloat(length.value);
  const w = parseFloat(width.value);
  const d = parseFloat(depth.value);

  if (!isValid(l, w, d)) {
    result.textContent = "–";
    return;
  }

  const volume = l * w * (d / 100);
  result.textContent = volume.toFixed(2) + " m³";
}


// ===== AUTO =====
[length, width, depth].forEach(input => {
  input?.addEventListener("input", calcConcrete);
  input?.addEventListener("change", calcConcrete);
});

calcConcrete();
function isValid(...values) {
  return values.every((value) => Number.isFinite(value) && value > 0);
}

function calculateConcreteVolume(lengthMeters, widthMeters, depthCentimeters) {
  if (!isValid(lengthMeters, widthMeters, depthCentimeters)) return null;
  return lengthMeters * widthMeters * (depthCentimeters / 100);
}

function formatConcreteVolume(volume) {
  if (!Number.isFinite(volume) || volume <= 0) return "–";

  const decimals = volume < 0.01 ? 4 : volume < 1 ? 3 : 2;
  const cubicMeters = volume.toLocaleString("hu-HU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (volume < 0.1) {
    const liters = (volume * 1000).toLocaleString("hu-HU", {
      maximumFractionDigits: 2,
    });
    return `${cubicMeters} m³ (${liters} liter)`;
  }

  return `${cubicMeters} m³`;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateConcreteVolume, formatConcreteVolume };
}

if (typeof document !== "undefined") {
  const length = document.getElementById("length");
  const width = document.getElementById("width");
  const depth = document.getElementById("depth");
  const result = document.getElementById("result-volume");

  function calcConcrete() {
    const l = Number.parseFloat(length?.value);
    const w = Number.parseFloat(width?.value);
    const d = Number.parseFloat(depth?.value);
    const volume = calculateConcreteVolume(l, w, d);
    result.textContent = volume === null ? "–" : formatConcreteVolume(volume);
  }

  [length, width, depth].forEach((input) => {
    input?.addEventListener("input", calcConcrete);
    input?.addEventListener("change", calcConcrete);
  });

  calcConcrete();
}

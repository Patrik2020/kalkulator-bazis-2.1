const width = document.getElementById("width");
const height = document.getElementById("height");
const tileWidth = document.getElementById("tileWidth");
const tileHeight = document.getElementById("tileHeight");

const resultTiles = document.getElementById("result-tiles");
const resultArea = document.getElementById("result-area");

function calcTiles() {
  const w = parseFloat(width.value);
  const h = parseFloat(height.value);
  const tw = parseFloat(tileWidth.value);
  const th = parseFloat(tileHeight.value);

  if (!w || !h || !tw || !th) {
    resultTiles.textContent = "–";
    resultArea.textContent = "";
    return;
  }

  const area = w * h;
  const tileArea = (tw / 100) * (th / 100);

  const tilesNeeded = area / tileArea;

  const tilesWithWaste = Math.ceil(tilesNeeded * 1.1);

  resultTiles.textContent = tilesWithWaste + " db";
  resultArea.textContent = "Felület: " + area.toFixed(2) + " m²";
}

[width, height, tileWidth, tileHeight].forEach(input => {
  input?.addEventListener("input", calcTiles);
});

calcTiles();
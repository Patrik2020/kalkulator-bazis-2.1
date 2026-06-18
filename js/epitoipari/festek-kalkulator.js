const inputs = document.querySelectorAll(
    "#roomLength, #roomWidth, #roomHeight, #windowArea, #doorArea, #layers, #coverage, #paintPrice"
);

const paintCeiling = document.getElementById("paintCeiling");

const wallAreaEl = document.getElementById("wallArea");
const ceilingAreaEl = document.getElementById("ceilingArea");
const openingsAreaEl = document.getElementById("openingsArea");
const totalAreaEl = document.getElementById("totalArea");
const paintNeededEl = document.getElementById("paintNeeded");
const recommendedPaintEl = document.getElementById("recommendedPaint");
const paintCostEl = document.getElementById("paintCost");
const summaryTextEl = document.getElementById("summaryText");

function formatNumber(num, decimals = 2) {
    return num.toLocaleString("hu-HU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function calculatePaint() {

    const roomLength = parseFloat(document.getElementById("roomLength").value);
    const roomWidth = parseFloat(document.getElementById("roomWidth").value);
    const roomHeight = parseFloat(document.getElementById("roomHeight").value);

    const windowArea =
        parseFloat(document.getElementById("windowArea").value) || 0;

    const doorArea =
        parseFloat(document.getElementById("doorArea").value) || 0;

    const layers = parseFloat(document.getElementById("layers").value);
    const coverage = parseFloat(document.getElementById("coverage").value);

    const paintPrice =
        parseFloat(document.getElementById("paintPrice").value) || 0;

    if (
        isNaN(roomLength) ||
        isNaN(roomWidth) ||
        isNaN(roomHeight) ||
        isNaN(layers) ||
        isNaN(coverage)
    ) {

        wallAreaEl.textContent = "–";
        ceilingAreaEl.textContent = "–";
        openingsAreaEl.textContent = "–";
        totalAreaEl.textContent = "–";
        paintNeededEl.textContent = "–";
        recommendedPaintEl.textContent = "–";
        paintCostEl.textContent = "–";

        summaryTextEl.textContent =
            "Add meg az adatokat a számításhoz.";

        return;
    }

    // Falak felülete

    const wallArea =
        (2 * roomLength * roomHeight) +
        (2 * roomWidth * roomHeight);

    // Mennyezet

    const ceilingArea =
        roomLength * roomWidth;

    // Nyílászárók

    const openingsArea =
        windowArea + doorArea;

    // Festendő felület

    let totalArea =
        wallArea - openingsArea;

    if (paintCeiling.checked) {
        totalArea += ceilingArea;
    }

    if (totalArea < 0) {
        totalArea = 0;
    }

    // Rétegek figyelembevétele

    const layeredArea =
        totalArea * layers;

    // Liter szükséglet

    const paintNeeded =
        layeredArea / coverage;

    // 10% ráhagyás

    const recommendedPaint =
        paintNeeded * 1.1;

    // Költség

    const paintCost =
        recommendedPaint * paintPrice;

    wallAreaEl.textContent =
        formatNumber(wallArea) + " m²";

    ceilingAreaEl.textContent =
        paintCeiling.checked
            ? formatNumber(ceilingArea) + " m²"
            : "Nincs számolva";

    openingsAreaEl.textContent =
        formatNumber(openingsArea) + " m²";

    totalAreaEl.textContent =
        formatNumber(totalArea) + " m²";

    paintNeededEl.textContent =
        formatNumber(paintNeeded) + " liter";

    recommendedPaintEl.textContent =
        Math.ceil(recommendedPaint) + " liter";

    paintCostEl.textContent =
        paintPrice > 0
            ? Math.round(paintCost).toLocaleString("hu-HU") + " Ft"
            : "Nincs megadva";

    summaryTextEl.innerHTML = `
    <strong>Festési összesítő</strong><br><br>

    Az Ön által megadott adatok alapján a festendő felület
    <strong>${formatNumber(totalArea)} m²</strong>.

    ${paintCeiling.checked
            ? "A mennyezet festése is beleszámításra került."
            : "A mennyezet festése nincs beleszámítva."}

    <br><br>

    <strong>${layers}</strong> réteg festéssel számolva
    várhatóan <strong>${formatNumber(paintNeeded)} liter</strong>
    festékre lesz szüksége.

    <br><br>

    A biztonság kedvéért legalább
    <strong>${Math.ceil(recommendedPaint)} liter</strong>
    festék vásárlását javasoljuk.

    ${paintPrice > 0
            ? `<br><br>
      A megadott ár alapján a festéshez szükséges
      festék várható költsége
      <strong>${Math.round(paintCost).toLocaleString("hu-HU")} Ft</strong>.`
            : ""}
  `;
}

inputs.forEach(input => {
    input.addEventListener("input", calculatePaint);
});

paintCeiling.addEventListener("change", calculatePaint);

calculatePaint();
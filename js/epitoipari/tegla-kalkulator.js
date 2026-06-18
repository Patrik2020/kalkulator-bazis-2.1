const brickType = document.getElementById("brickType");
const customBrickFields = document.getElementById("customBrickFields");
const brickInfo = document.getElementById("brickInfo");

const wallAreaResult = document.getElementById("wallAreaResult");
const openingAreaResult = document.getElementById("openingAreaResult");
const netWallAreaResult = document.getElementById("netWallAreaResult");
const brickCountResult = document.getElementById("brickCountResult");
const recommendedBrickCountResult = document.getElementById("recommendedBrickCountResult");
const costResult = document.getElementById("costResult");
const summaryText = document.getElementById("summaryText");

const brickData = {

    porotherm10: {
        name: "Porotherm 10 N+F",
        thickness: "10 cm",
        bricksPerM2: 8,
        usage: "válaszfalak"
    },

    porotherm20: {
        name: "Porotherm 20 N+F",
        thickness: "20 cm",
        bricksPerM2: 16,
        usage: "belső és kisebb teherhordó falak"
    },

    porotherm30: {
        name: "Porotherm 30 N+F",
        thickness: "30 cm",
        bricksPerM2: 16,
        usage: "teherhordó külső falak"
    },

    porotherm38: {
        name: "Porotherm 38 N+F",
        thickness: "38 cm",
        bricksPerM2: 16,
        usage: "kiemelten jó hőszigetelésű külső falak"
    },

    "kisméretű": {
        name: "Kisméretű tömör tégla",
        thickness: "12 cm",
        bricksPerM2: 60,
        usage: "felújítás és hagyományos falazás"
    }

};

function formatNumber(num, decimals = 2) {
    return num.toLocaleString("hu-HU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

function updateBrickInfo() {

    const type = brickType.value;

    if (type === "custom") {

        customBrickFields.style.display = "block";

        brickInfo.innerHTML = `
            <strong>Egyedi méretű tégla</strong>
            <br><br>
            Add meg a tégla hosszát és magasságát centiméterben.
        `;

        return;
    }

    customBrickFields.style.display = "none";

    const brick = brickData[type];

    brickInfo.innerHTML = `
    <strong>${brick.name}</strong>

    <br><br>

    Falvastagság: ${brick.thickness}

    <br><br>

    Átlagos szükséglet:

    <br>

    ${brick.bricksPerM2} db/m²

    <br><br>

    Ajánlott felhasználás:

    <br>

    ${brick.usage}
`;
}

function calculateBricks() {

    const wallLength =
        parseFloat(document.getElementById("wallLength").value);

    const wallHeight =
        parseFloat(document.getElementById("wallHeight").value);

    const windowArea =
        parseFloat(document.getElementById("windowArea").value) || 0;

    const doorArea =
        parseFloat(document.getElementById("doorArea").value) || 0;

    const wastePercent =
        parseFloat(document.getElementById("wastePercent").value) || 5;

    const brickPrice =
        parseFloat(document.getElementById("brickPrice").value) || 0;

    if (isNaN(wallLength) || isNaN(wallHeight)) {

        wallAreaResult.textContent = "–";
        openingAreaResult.textContent = "–";
        netWallAreaResult.textContent = "–";
        brickCountResult.textContent = "–";
        recommendedBrickCountResult.textContent = "–";
        costResult.textContent = "–";

        summaryText.textContent =
            "Add meg az adatokat a számításhoz.";

        return;
    }

    const wallArea =
        wallLength * wallHeight;

    const openingArea =
        windowArea + doorArea;

    const netWallArea =
        Math.max(0, wallArea - openingArea);

    let brickCount;
    let brickName;

    if (brickType.value === "custom") {

        const brickLength =
            parseFloat(document.getElementById("brickLength").value);

        const brickHeight =
            parseFloat(document.getElementById("brickHeight").value);

        if (
            isNaN(brickLength) ||
            isNaN(brickHeight) ||
            brickLength <= 0 ||
            brickHeight <= 0
        ) {
            return;
        }

        const brickArea =
            (brickLength / 100) *
            (brickHeight / 100);

        brickCount =
            Math.ceil(netWallArea / brickArea);

        brickName =
            "egyedi méretű tégla";

    } else {

        const brick =
            brickData[brickType.value];

        brickCount =
            Math.ceil(
                netWallArea *
                brick.bricksPerM2
            );

        brickName =
            brick.name;
    }

    const recommendedBrickCount =
        Math.ceil(
            brickCount *
            (1 + wastePercent / 100)
        );

    const cost =
        recommendedBrickCount *
        brickPrice;

    wallAreaResult.textContent =
        formatNumber(wallArea) + " m²";

    openingAreaResult.textContent =
        formatNumber(openingArea) + " m²";

    netWallAreaResult.textContent =
        formatNumber(netWallArea) + " m²";

    brickCountResult.textContent =
        brickCount.toLocaleString("hu-HU") + " db";

    recommendedBrickCountResult.textContent =
        recommendedBrickCount.toLocaleString("hu-HU") + " db";

    costResult.textContent =
        brickPrice > 0
            ? Math.round(cost).toLocaleString("hu-HU") + " Ft"
            : "Nincs megadva";

    summaryText.innerHTML = `
        <strong>Tégla összesítő</strong>

        <br><br>

        Az Ön által megadott adatok alapján a nettó
        falfelület

        <strong>${formatNumber(netWallArea)} m²</strong>.

        <br><br>

        A kiválasztott

        <strong>${brickName}</strong>

        használatával várhatóan

        <strong>${brickCount.toLocaleString("hu-HU")} db</strong>

        tégla szükséges.

        <br><br>

        ${wastePercent}% ráhagyással

        <strong>${recommendedBrickCount.toLocaleString("hu-HU")} db</strong>

        tégla beszerzését javasoljuk.

        ${brickPrice > 0
            ? `
            <br><br>

            A megadott ár alapján az anyagköltség várhatóan

            <strong>${Math.round(cost).toLocaleString("hu-HU")} Ft</strong>.
        `
            : ""
        }
    `;
}

brickType.addEventListener("change", () => {
    updateBrickInfo();
    calculateBricks();
});

document.querySelectorAll("input, select").forEach(element => {
    element.addEventListener("input", calculateBricks);
    element.addEventListener("change", calculateBricks);
});

updateBrickInfo();
calculateBricks();

document.querySelectorAll(".faq-item").forEach((item) => {

    item.addEventListener("toggle", () => {

        if (!item.open) {
            return;
        }

        document.querySelectorAll(".faq-item").forEach((otherItem) => {

            if (otherItem !== item) {
                otherItem.removeAttribute("open");
            }

        });

    });

});
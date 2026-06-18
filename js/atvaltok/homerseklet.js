// Celsius ↔ Fahrenheit

let cfMode = "CtoF";

const cfInput = document.getElementById("cfInput");
const cfResult = document.getElementById("cfResult");
const cfDirection = document.getElementById("cfDirection");
const swapCF = document.getElementById("swapCF");

function calculateCF() {
    const value = parseFloat(cfInput.value);

    if (isNaN(value)) {
        cfResult.textContent = "–";
        return;
    }

    if (cfMode === "CtoF") {
        const result = (value * 9) / 5 + 32;

        cfResult.textContent =
            `${value} °C = ${result.toFixed(2)} °F`;
    } else {
        const result = ((value - 32) * 5) / 9;

        cfResult.textContent =
            `${value} °F = ${result.toFixed(2)} °C`;
    }
}

swapCF.addEventListener("click", () => {
    if (cfMode === "CtoF") {
        cfMode = "FtoC";
        cfDirection.textContent = "Fahrenheit → Celsius";
    } else {
        cfMode = "CtoF";
        cfDirection.textContent = "Celsius → Fahrenheit";
    }

    calculateCF();
});

cfInput.addEventListener("input", calculateCF);

// Celsius ↔ Kelvin

let ckMode = "CtoK";

const ckInput = document.getElementById("ckInput");
const ckResult = document.getElementById("ckResult");
const ckDirection = document.getElementById("ckDirection");
const swapCK = document.getElementById("swapCK");

function calculateCK() {
    const value = parseFloat(ckInput.value);

    if (isNaN(value)) {
        ckResult.textContent = "–";
        return;
    }

    if (ckMode === "CtoK") {
        const result = value + 273.15;

        ckResult.textContent =
            `${value} °C = ${result.toFixed(2)} K`;
    } else {
        const result = value - 273.15;

        ckResult.textContent =
            `${value} K = ${result.toFixed(2)} °C`;
    }
}

swapCK.addEventListener("click", () => {
    if (ckMode === "CtoK") {
        ckMode = "KtoC";
        ckDirection.textContent = "Kelvin → Celsius";
    } else {
        ckMode = "CtoK";
        ckDirection.textContent = "Celsius → Kelvin";
    }

    calculateCK();
});

ckInput.addEventListener("input", calculateCK);

// Fahrenheit ↔ Kelvin

let fkMode = "FtoK";

const fkInput = document.getElementById("fkInput");
const fkResult = document.getElementById("fkResult");
const fkDirection = document.getElementById("fkDirection");
const swapFK = document.getElementById("swapFK");

function calculateFK() {
    const value = parseFloat(fkInput.value);

    if (isNaN(value)) {
        fkResult.textContent = "–";
        return;
    }

    if (fkMode === "FtoK") {
        const result = ((value - 32) * 5) / 9 + 273.15;

        fkResult.textContent =
            `${value} °F = ${result.toFixed(2)} K`;
    } else {
        const result = ((value - 273.15) * 9) / 5 + 32;

        fkResult.textContent =
            `${value} K = ${result.toFixed(2)} °F`;
    }
}

swapFK.addEventListener("click", () => {
    if (fkMode === "FtoK") {
        fkMode = "KtoF";
        fkDirection.textContent = "Kelvin → Fahrenheit";
    } else {
        fkMode = "FtoK";
        fkDirection.textContent = "Fahrenheit → Kelvin";
    }

    calculateFK();
});

fkInput.addEventListener("input", calculateFK);
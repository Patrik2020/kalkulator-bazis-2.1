function formatTemperature(value) {
    return Number.isFinite(value) ? value.toFixed(2) : "–";
}

function invalidTemperature(resultElement, message = "A megadott hőmérséklet az abszolút nulla alatt lenne.") {
    resultElement.textContent = message;
}

// Celsius ↔ Fahrenheit
let cfMode = "CtoF";
const cfInput = document.getElementById("cfInput");
const cfResult = document.getElementById("cfResult");
const cfDirection = document.getElementById("cfDirection");
const swapCF = document.getElementById("swapCF");

function calculateCF() {
    const value = parseFloat(cfInput.value);
    if (!Number.isFinite(value)) { cfResult.textContent = "–"; return; }
    const celsius = cfMode === "CtoF" ? value : ((value - 32) * 5) / 9;
    if (celsius < -273.15) { invalidTemperature(cfResult); return; }
    if (cfMode === "CtoF") {
        cfResult.textContent = `${value} °C = ${formatTemperature((value * 9) / 5 + 32)} °F`;
    } else {
        cfResult.textContent = `${value} °F = ${formatTemperature(celsius)} °C`;
    }
}

swapCF.addEventListener("click", () => {
    cfMode = cfMode === "CtoF" ? "FtoC" : "CtoF";
    cfDirection.textContent = cfMode === "CtoF" ? "Celsius → Fahrenheit" : "Fahrenheit → Celsius";
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
    if (!Number.isFinite(value)) { ckResult.textContent = "–"; return; }
    const kelvin = ckMode === "CtoK" ? value + 273.15 : value;
    if (kelvin < 0) { invalidTemperature(ckResult); return; }
    if (ckMode === "CtoK") {
        ckResult.textContent = `${value} °C = ${formatTemperature(kelvin)} K`;
    } else {
        ckResult.textContent = `${value} K = ${formatTemperature(value - 273.15)} °C`;
    }
}

swapCK.addEventListener("click", () => {
    ckMode = ckMode === "CtoK" ? "KtoC" : "CtoK";
    ckDirection.textContent = ckMode === "CtoK" ? "Celsius → Kelvin" : "Kelvin → Celsius";
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
    if (!Number.isFinite(value)) { fkResult.textContent = "–"; return; }
    const kelvin = fkMode === "FtoK" ? ((value - 32) * 5) / 9 + 273.15 : value;
    if (kelvin < 0) { invalidTemperature(fkResult); return; }
    if (fkMode === "FtoK") {
        fkResult.textContent = `${value} °F = ${formatTemperature(kelvin)} K`;
    } else {
        fkResult.textContent = `${value} K = ${formatTemperature(((value - 273.15) * 9) / 5 + 32)} °F`;
    }
}

swapFK.addEventListener("click", () => {
    fkMode = fkMode === "FtoK" ? "KtoF" : "FtoK";
    fkDirection.textContent = fkMode === "FtoK" ? "Fahrenheit → Kelvin" : "Kelvin → Fahrenheit";
    calculateFK();
});
fkInput.addEventListener("input", calculateFK);

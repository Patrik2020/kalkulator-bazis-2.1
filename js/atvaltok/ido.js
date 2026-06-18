const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const factors = {
    sec: 1,
    min: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629746, // 30,436875 nap
    year: 31556952, // 365,2425 nap
};

function convertTime() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInSeconds = value * factors[from];
    const convertedValue = valueInSeconds / factors[to];

    result.textContent =
        `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 10,
        })} ${getUnitLabel(to)}`;
}

function getUnitLabel(unit) {
    const labels = {
        sec: "másodperc",
        min: "perc",
        hour: "óra",
        day: "nap",
        week: "hét",
        month: "hónap",
        year: "év",
    };

    return labels[unit];
}

inputValue.addEventListener("input", convertTime);
fromUnit.addEventListener("change", convertTime);
toUnit.addEventListener("change", convertTime);

// Alapértelmezett példa
inputValue.value = 1;
convertTime();
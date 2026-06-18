const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const factors = {
    ml: 0.001,
    cl: 0.01,
    dl: 0.1,
    l: 1,
    m3: 1000,
    gal: 3.785411784,
};

function convertVolume() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInLiters = value * factors[from];
    const convertedValue = valueInLiters / factors[to];

    result.textContent =
        `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 10,
        })} ${getUnitLabel(to)}`;
}

function getUnitLabel(unit) {
    const labels = {
        ml: "ml",
        cl: "cl",
        dl: "dl",
        l: "l",
        m3: "m³",
        gal: "gallon",
    };

    return labels[unit];
}

inputValue.addEventListener("input", convertVolume);
fromUnit.addEventListener("change", convertVolume);
toUnit.addEventListener("change", convertVolume);

// Alapértelmezett példa
inputValue.value = 1;
convertVolume();
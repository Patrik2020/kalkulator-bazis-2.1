const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const factors = {
    mm2: 0.000001,
    cm2: 0.0001,
    m2: 1,
    a: 100,
    ha: 10000,
    km2: 1000000,
    ft2: 0.09290304,
    in2: 0.00064516,
};

function convertArea() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInSquareMeters = value * factors[from];
    const convertedValue = valueInSquareMeters / factors[to];

    result.textContent =
        `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 10,
        })} ${getUnitLabel(to)}`;
}

function getUnitLabel(unit) {
    const labels = {
        mm2: "mm²",
        cm2: "cm²",
        m2: "m²",
        a: "ár",
        ha: "ha",
        km2: "km²",
        ft2: "ft²",
        in2: "in²",
    };

    return labels[unit];
}

inputValue.addEventListener("input", convertArea);
fromUnit.addEventListener("change", convertArea);
toUnit.addEventListener("change", convertArea);

// Alapértelmezett példa
inputValue.value = 1000;
convertArea();
const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const factors = {
    mg: 0.000001,
    g: 0.001,
    kg: 1,
    t: 1000,
    oz: 0.028349523125,
    lb: 0.45359237,
};

function convertWeight() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInKg = value * factors[from];
    const convertedValue = valueInKg / factors[to];

    result.textContent =
        `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 10,
        })} ${getUnitLabel(to)}`;
}

function getUnitLabel(unit) {
    const labels = {
        mg: "mg",
        g: "g",
        kg: "kg",
        t: "t",
        oz: "uncia",
        lb: "font",
    };

    return labels[unit];
}

inputValue.addEventListener("input", convertWeight);
fromUnit.addEventListener("change", convertWeight);
toUnit.addEventListener("change", convertWeight);

// Alapértelmezett példa
inputValue.value = 1;
convertWeight();
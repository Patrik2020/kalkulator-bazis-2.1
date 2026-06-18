const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const factors = {
    ms: 1,
    kmh: 0.2777777778,
    mph: 0.44704,
    knot: 0.5144444444,
};

function convertSpeed() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInMs = value * factors[from];
    const convertedValue = valueInMs / factors[to];

    result.textContent =
        `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 10,
        })} ${getUnitLabel(to)}`;
}

function getUnitLabel(unit) {
    const labels = {
        kmh: "km/h",
        ms: "m/s",
        mph: "mph",
        knot: "csomó",
    };

    return labels[unit];
}

inputValue.addEventListener("input", convertSpeed);
fromUnit.addEventListener("change", convertSpeed);
toUnit.addEventListener("change", convertSpeed);

// Alapértelmezett példa
inputValue.value = 100;
convertSpeed();
const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const factors = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
};

function convertLength() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInMeters = value * factors[from];
    const convertedValue = valueInMeters / factors[to];

    result.textContent =
        `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 10,
        })} ${getUnitLabel(to)}`;
}

function getUnitLabel(unit) {
    const labels = {
        mm: "mm",
        cm: "cm",
        m: "m",
        km: "km",
        in: "inch",
        ft: "ft",
        yd: "yard",
        mi: "mérföld",
    };

    return labels[unit];
}

inputValue.addEventListener("input", convertLength);
fromUnit.addEventListener("change", convertLength);
toUnit.addEventListener("change", convertLength);

// Alapértelmezett példa
inputValue.value = 100;
convertLength();
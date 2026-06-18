const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const factors = {
    bit: 1 / 8,
    byte: 1,
    kb: 1024,
    mb: 1024 ** 2,
    gb: 1024 ** 3,
    tb: 1024 ** 4,
    pb: 1024 ** 5,
};

function convertDataSize() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;

    const valueInBytes = value * factors[from];
    const convertedValue = valueInBytes / factors[to];

    result.textContent =
        `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 10,
        })} ${getUnitLabel(to)}`;
}

function getUnitLabel(unit) {
    const labels = {
        bit: "bit",
        byte: "byte",
        kb: "KB",
        mb: "MB",
        gb: "GB",
        tb: "TB",
        pb: "PB",
    };

    return labels[unit];
}

inputValue.addEventListener("input", convertDataSize);
fromUnit.addEventListener("change", convertDataSize);
toUnit.addEventListener("change", convertDataSize);

// Alapértelmezett példa
inputValue.value = 1024;
convertDataSize();
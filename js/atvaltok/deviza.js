const inputValue = document.getElementById("inputValue");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");
const lastUpdate = document.getElementById("lastUpdate");

let rates = {};
let baseCurrency = "EUR";

async function loadRates() {
    try {
        result.textContent = "Árfolyamok betöltése...";

        const response = await fetch(
            "https://api.frankfurter.dev/v1/latest"
        );

        const data = await response.json();

        rates = data.rates;
        rates.EUR = 1;

        lastUpdate.textContent = data.date;

        convertCurrency();
    } catch (error) {
        console.error(error);

        result.textContent =
            "Nem sikerült betölteni az árfolyamokat.";
    }
}

function convertCurrency() {
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        result.textContent = "–";
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (!rates[from] || !rates[to]) {
        return;
    }

    const valueInEuro = value / rates[from];
    const convertedValue = valueInEuro * rates[to];

    result.textContent =
        `${value.toLocaleString("hu-HU", {
            maximumFractionDigits: 2,
        })} ${from} = ` +
        `${convertedValue.toLocaleString("hu-HU", {
            maximumFractionDigits: 2,
        })} ${to}`;
}

inputValue.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

inputValue.value = 100;

loadRates();
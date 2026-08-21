(() => {
  const inputValue = document.getElementById("inputValue");
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");
  const result = document.getElementById("result");

  // Az új adatméret-kártyát az auto-converter-upgrades.js kezeli. A régi
  // vezérlők csak korábbi vagy gyorsítótárazott HTML-változatokban lehetnek jelen.
  if (!inputValue || !fromUnit || !toUnit || !result) return;

  const factors = {
    bit: 1 / 8,
    byte: 1,
    kb: 1024,
    mb: 1024 ** 2,
    gb: 1024 ** 3,
    tb: 1024 ** 4,
    pb: 1024 ** 5,
  };

  const getUnitLabel = (unit) => {
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
  };

  const convertDataSize = () => {
    const value = Number.parseFloat(inputValue.value);

    if (Number.isNaN(value)) {
      result.textContent = "–";
      return;
    }

    const from = fromUnit.value;
    const to = toUnit.value;
    const valueInBytes = value * factors[from];
    const convertedValue = valueInBytes / factors[to];

    result.textContent =
      `${value.toLocaleString("hu-HU")} ${getUnitLabel(from)} = ` +
      `${convertedValue.toLocaleString("hu-HU", { maximumFractionDigits: 10 })} ${getUnitLabel(to)}`;
  };

  inputValue.addEventListener("input", convertDataSize);
  fromUnit.addEventListener("change", convertDataSize);
  toUnit.addEventListener("change", convertDataSize);

  inputValue.value = 1024;
  convertDataSize();
})();

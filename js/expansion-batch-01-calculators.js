(function (root, factory) {
  const api = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (!root || typeof document === "undefined") return;
  root.KB_EXPANSION_BATCH_01_CALCULATORS = api;

  const parseInput = (id) => {
    const input = document.getElementById(id);
    if (!input) return NaN;
    return Number.parseFloat(String(input.value).replace(/\s/g, "").replace(",", "."));
  };

  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const render = (target, rows) => {
    target.innerHTML = rows
      .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
      .join("");
  };

  const bindings = {
    "harmasszabaly-kalkulator": {
      inputs: ["ruleA", "ruleB", "ruleC"],
      result: "ruleResult",
      calculate() {
        const result = api.harmasszabaly(parseInput("ruleA"), parseInput("ruleB"), parseInput("ruleC"));
        return [
          ["X értéke", api.formatNumber(result.x, 4)],
          ["Szorzótényező A → C", api.formatNumber(result.multiplier, 4)]
        ];
      }
    },
    "szazalekos-valtozas-kalkulator": {
      inputs: ["changeOld", "changeNew"],
      result: "changeResult",
      calculate() {
        const result = api.szazalekosValtozas(parseInput("changeOld"), parseInput("changeNew"));
        return [
          ["Abszolút különbség", api.formatNumber(result.difference, 4)],
          ["Százalékos változás", `${result.percent >= 0 ? "+" : ""}${api.formatNumber(result.percent, 2)}%`],
          ["Irány", result.direction]
        ];
      }
    },
    "csemperagaszto-kalkulator": {
      inputs: ["adhesiveArea", "adhesiveConsumption", "adhesiveWaste", "adhesiveBag"],
      result: "adhesiveResult",
      calculate() {
        const result = api.csemperagaszto(
          parseInput("adhesiveArea"),
          parseInput("adhesiveConsumption"),
          parseInput("adhesiveWaste"),
          parseInput("adhesiveBag")
        );
        return [
          ["Alap anyagigény", `${api.formatNumber(result.baseKg, 1)} kg`],
          ["Ráhagyással számolt mennyiség", `${api.formatNumber(result.totalKg, 1)} kg`],
          ["Szükséges zsák", `${result.bags} db`]
        ];
      }
    },
    "ev-toltesi-koltseg-kalkulator": {
      inputs: ["evDistance", "evConsumption", "evPrice", "evLoss"],
      result: "evResult",
      calculate() {
        const result = api.evToltesiKoltseg(
          parseInput("evDistance"),
          parseInput("evConsumption"),
          parseInput("evPrice"),
          parseInput("evLoss")
        );
        return [
          ["Jármű energiaigénye", `${api.formatNumber(result.vehicleKwh, 2)} kWh`],
          ["Hálózatból felvett energia", `${api.formatNumber(result.gridKwh, 2)} kWh`],
          ["Becsült töltési költség", `${api.formatNumber(result.totalCost, 0)} Ft`],
          ["Energiaköltség 100 km-re", `${api.formatNumber(result.costPer100Km, 0)} Ft`]
        ];
      }
    },
    "futotempo-kalkulator": {
      inputs: ["runDistance", "runHours", "runMinutes", "runSeconds"],
      result: "runResult",
      calculate() {
        const result = api.futotempo(
          parseInput("runDistance"),
          parseInput("runHours"),
          parseInput("runMinutes"),
          parseInput("runSeconds")
        );
        return [
          ["Átlagtempó", `${api.formatPace(result.paceSecondsPerKm)}/km`],
          ["Átlagsebesség", `${api.formatNumber(result.speedKmh, 2)} km/h`],
          ["5 km azonos tempóval", api.formatDuration(result.fiveKmSeconds)],
          ["10 km azonos tempóval", api.formatDuration(result.tenKmSeconds)]
        ];
      }
    }
  };

  const init = () => {
    const page = document.querySelector("[data-batch01-calc]");
    if (!page) return;

    const binding = bindings[page.dataset.batch01Calc];
    if (!binding) return;

    const result = document.getElementById(binding.result);
    if (!result) return;

    let tracked = false;
    const run = () => {
      try {
        render(result, binding.calculate());
      } catch (error) {
        result.textContent = error instanceof Error ? error.message : "Adj meg érvényes adatokat a számításhoz.";
      }
    };

    binding.inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const changed = () => {
        if (!tracked && typeof root.KB_TRACK_EVENT === "function") {
          tracked = true;
          root.KB_TRACK_EVENT("calculator_start", { calculator: page.dataset.batch01Calc });
        }
        run();
      };
      input.addEventListener("input", changed);
      input.addEventListener("change", changed);
    });

    run();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})(typeof window !== "undefined" ? window : null, function () {
  const finite = (value, label) => {
    if (!Number.isFinite(value)) throw new Error(`${label}: adj meg érvényes számot.`);
    return value;
  };

  const positive = (value, label) => {
    finite(value, label);
    if (value <= 0) throw new Error(`${label}: az érték legyen nagyobb nullánál.`);
    return value;
  };

  const nonNegative = (value, label) => {
    finite(value, label);
    if (value < 0) throw new Error(`${label}: az érték nem lehet negatív.`);
    return value;
  };

  const formatNumber = (value, maximumFractionDigits = 2) => new Intl.NumberFormat("hu-HU", {
    maximumFractionDigits,
    minimumFractionDigits: 0
  }).format(value);

  const harmasszabaly = (a, b, c) => {
    finite(a, "A");
    finite(b, "B");
    finite(c, "C");
    if (a === 0) throw new Error("A nem lehet nulla, mert osztóként szerepel a képletben.");
    return { x: (b * c) / a, multiplier: c / a };
  };

  const szazalekosValtozas = (oldValue, newValue) => {
    positive(oldValue, "Régi érték");
    nonNegative(newValue, "Új érték");
    const difference = newValue - oldValue;
    const percent = difference / oldValue * 100;
    const direction = percent > 0 ? "növekedés" : percent < 0 ? "csökkenés" : "nincs változás";
    return { difference, percent, direction };
  };

  const csemperagaszto = (area, consumption, waste, bagSize) => {
    positive(area, "Burkolandó felület");
    positive(consumption, "Anyagfelhasználás");
    nonNegative(waste, "Ráhagyás");
    positive(bagSize, "Zsákméret");
    if (waste > 100) throw new Error("A ráhagyás legfeljebb 100% legyen.");
    const baseKg = area * consumption;
    const totalKg = baseKg * (1 + waste / 100);
    return { baseKg, totalKg, bags: Math.ceil(totalKg / bagSize) };
  };

  const evToltesiKoltseg = (distance, consumption, price, lossPercent) => {
    positive(distance, "Távolság");
    positive(consumption, "Fogyasztás");
    nonNegative(price, "Villamosenergia-ár");
    nonNegative(lossPercent, "Töltési veszteség");
    if (lossPercent >= 100) throw new Error("A töltési veszteség 100%-nál kisebb legyen.");
    const vehicleKwh = distance * consumption / 100;
    const gridKwh = vehicleKwh / (1 - lossPercent / 100);
    const totalCost = gridKwh * price;
    return { vehicleKwh, gridKwh, totalCost, costPer100Km: totalCost / distance * 100 };
  };

  const futotempo = (distanceKm, hours, minutes, seconds) => {
    positive(distanceKm, "Távolság");
    nonNegative(hours, "Óra");
    nonNegative(minutes, "Perc");
    nonNegative(seconds, "Másodperc");
    if (minutes >= 60 || seconds >= 60) throw new Error("A perc és másodperc mező 0–59 közötti legyen.");
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) throw new Error("A teljes futóidő legyen nagyobb nullánál.");
    const paceSecondsPerKm = totalSeconds / distanceKm;
    const speedKmh = distanceKm / (totalSeconds / 3600);
    return {
      totalSeconds,
      paceSecondsPerKm,
      speedKmh,
      fiveKmSeconds: paceSecondsPerKm * 5,
      tenKmSeconds: paceSecondsPerKm * 10
    };
  };

  const formatPace = (secondsPerKm) => {
    const rounded = Math.round(secondsPerKm);
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const formatDuration = (seconds) => {
    const rounded = Math.round(seconds);
    const hours = Math.floor(rounded / 3600);
    const minutes = Math.floor((rounded % 3600) / 60);
    const secs = rounded % 60;
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  return {
    harmasszabaly,
    szazalekosValtozas,
    csemperagaszto,
    evToltesiKoltseg,
    futotempo,
    formatNumber,
    formatPace,
    formatDuration
  };
});

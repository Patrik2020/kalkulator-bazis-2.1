(() => {
  // Quality 3.0 page module: mertekegyseg-atvalto-kalkulator
  const groups = {
    length: {
      label: "Hosszúság",
      units: {
        mm: ["Milliméter (mm)", 0.001],
        cm: ["Centiméter (cm)", 0.01],
        m: ["Méter (m)", 1],
        km: ["Kilométer (km)", 1000],
        in: ["Inch (in)", 0.0254],
        ft: ["Láb (ft)", 0.3048],
        yd: ["Yard (yd)", 0.9144],
        mi: ["Mérföld (mi)", 1609.344]
      },
      defaults: ["m", "cm"]
    },
    area: {
      label: "Terület",
      units: {
        cm2: ["Négyzetcentiméter (cm²)", 0.0001],
        m2: ["Négyzetméter (m²)", 1],
        ha: ["Hektár (ha)", 10000],
        km2: ["Négyzetkilométer (km²)", 1000000],
        acre: ["Acre", 4046.8564224],
        ft2: ["Négyzetláb (ft²)", 0.09290304]
      },
      defaults: ["m2", "ha"]
    },
    volume: {
      label: "Térfogat",
      units: {
        ml: ["Milliliter (ml)", 0.000001],
        l: ["Liter (l)", 0.001],
        m3: ["Köbméter (m³)", 1],
        usgal: ["US gallon", 0.003785411784],
        ukgal: ["UK gallon", 0.00454609],
        ft3: ["Köbláb (ft³)", 0.028316846592]
      },
      defaults: ["l", "m3"]
    },
    mass: {
      label: "Tömeg",
      units: {
        mg: ["Milligramm (mg)", 0.000001],
        g: ["Gramm (g)", 0.001],
        kg: ["Kilogramm (kg)", 1],
        t: ["Tonna (t)", 1000],
        oz: ["Uncia (oz)", 0.028349523125],
        lb: ["Font (lb)", 0.45359237]
      },
      defaults: ["kg", "lb"]
    },
    temperature: {
      label: "Hőmérséklet",
      units: {
        c: ["Celsius (°C)"],
        f: ["Fahrenheit (°F)"],
        k: ["Kelvin (K)"]
      },
      defaults: ["c", "f"]
    },
    time: {
      label: "Idő",
      units: {
        ms: ["Milliszekundum (ms)", 0.001],
        s: ["Másodperc (s)", 1],
        min: ["Perc", 60],
        h: ["Óra", 3600],
        d: ["Nap", 86400],
        w: ["Hét", 604800]
      },
      defaults: ["h", "min"]
    },
    speed: {
      label: "Sebesség",
      units: {
        ms: ["Méter/másodperc (m/s)", 1],
        kmh: ["Kilométer/óra (km/h)", 1 / 3.6],
        mph: ["Mérföld/óra (mph)", 0.44704],
        knot: ["Csomó (kn)", 0.5144444444444445]
      },
      defaults: ["kmh", "mph"]
    },
    data: {
      label: "Adatméret",
      units: {
        B: ["Byte (B)", 1],
        kB: ["Kilobyte (kB, 10³)", 1000],
        MB: ["Megabyte (MB, 10⁶)", 1000000],
        GB: ["Gigabyte (GB, 10⁹)", 1000000000],
        TB: ["Terabyte (TB, 10¹²)", 1000000000000],
        KiB: ["Kibibyte (KiB, 2¹⁰)", 1024],
        MiB: ["Mebibyte (MiB, 2²⁰)", 1048576],
        GiB: ["Gibibyte (GiB, 2³⁰)", 1073741824],
        TiB: ["Tebibyte (TiB, 2⁴⁰)", 1099511627776]
      },
      defaults: ["GB", "GiB"]
    },
    energy: {
      label: "Energia",
      units: {
        J: ["Joule (J)", 1],
        kJ: ["Kilojoule (kJ)", 1000],
        Wh: ["Wattóra (Wh)", 3600],
        kWh: ["Kilowattóra (kWh)", 3600000],
        cal: ["Kalória (cal)", 4.184],
        kcal: ["Kilokalória (kcal)", 4184]
      },
      defaults: ["kWh", "MJ"]
    },
    pressure: {
      label: "Nyomás",
      units: {
        Pa: ["Pascal (Pa)", 1],
        kPa: ["Kilopascal (kPa)", 1000],
        bar: ["Bar", 100000],
        atm: ["Atmoszféra (atm)", 101325],
        psi: ["PSI", 6894.757293168]
      },
      defaults: ["bar", "psi"]
    },
    power: {
      label: "Teljesítmény",
      units: {
        W: ["Watt (W)", 1],
        kW: ["Kilowatt (kW)", 1000],
        MW: ["Megawatt (MW)", 1000000],
        hpMetric: ["Metrikus lóerő (LE/PS)", 735.49875],
        hpMech: ["Mechanikai horsepower (hp)", 745.6998715822702]
      },
      defaults: ["kW", "hpMetric"]
    }
  };

  groups.energy.units.MJ = ["Megajoule (MJ)", 1000000];

  const els = {
    type: document.getElementById("measurementType"),
    value: document.getElementById("inputValue"),
    from: document.getElementById("fromUnit"),
    to: document.getElementById("toUnit"),
    result: document.getElementById("result")
  };
  if (!Object.values(els).every(Boolean)) return;

  const format = (value) => {
    if (!Number.isFinite(value)) return "—";
    const abs = Math.abs(value);
    if (abs !== 0 && (abs >= 1e12 || abs < 1e-8)) {
      return value.toExponential(8).replace(".", ",");
    }
    return new Intl.NumberFormat("hu-HU", {
      maximumFractionDigits: 10,
      useGrouping: true
    }).format(value);
  };

  const toKelvin = (value, unit) => {
    if (unit === "c") return value + 273.15;
    if (unit === "f") return (value - 32) * 5 / 9 + 273.15;
    return value;
  };

  const fromKelvin = (value, unit) => {
    if (unit === "c") return value - 273.15;
    if (unit === "f") return (value - 273.15) * 9 / 5 + 32;
    return value;
  };

  const populateUnits = () => {
    const group = groups[els.type.value];
    const options = Object.entries(group.units)
      .map(([key, [label]]) => `<option value="${key}">${label}</option>`)
      .join("");
    els.from.innerHTML = options;
    els.to.innerHTML = options;
    const [fromDefault, toDefault] = group.defaults;
    els.from.value = fromDefault;
    els.to.value = toDefault;
    calculate();
  };

  const calculate = () => {
    const rawInput = els.value.value.trim();
    const input = Number(rawInput);
    const group = groups[els.type.value];
    if (!rawInput || !Number.isFinite(input)) {
      els.result.textContent = "Adj meg egy számot.";
      return;
    }

    let output;
    if (els.type.value === "temperature") {
      const kelvin = toKelvin(input, els.from.value);
      if (kelvin < 0) {
        els.result.textContent = "A hőmérséklet nem lehet az abszolút nulla alatt.";
        return;
      }
      output = fromKelvin(kelvin, els.to.value);
    } else {
      const fromFactor = group.units[els.from.value][1];
      const toFactor = group.units[els.to.value][1];
      output = input * fromFactor / toFactor;
    }

    const fromLabel = group.units[els.from.value][0];
    const toLabel = group.units[els.to.value][0];
    els.result.textContent = `${format(input)} ${fromLabel} = ${format(output)} ${toLabel}`;
  };

  els.type.addEventListener("change", populateUnits);
  els.value.addEventListener("input", calculate);
  els.from.addEventListener("change", calculate);
  els.to.addEventListener("change", calculate);
  populateUnits();
})();
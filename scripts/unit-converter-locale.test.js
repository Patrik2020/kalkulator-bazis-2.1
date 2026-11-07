"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate } = require("../js/atvaltok/unit-converter-locale");
const page = "mertekegyseg-atvalto-kalkulator";

test("unit converter metadata, guidance, FAQ and result copy translate and restore", () => {
  assert.equal(translate(page, "Mértékegység átváltó", "en"), "Unit Converter");
  assert.equal(translate(page, "Hogyan számol az átváltó?", "de"), "Wie rechnet der Einheitenrechner?");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Unit Converter", "hu"), "Mértékegység átváltó");
  assert.equal(translate(page, "90 perc = 1,5 óra", "en"), "90 minutes = 1.5 hours");
  assert.equal(translate(page, "90 perc = 1,5 óra", "de"), "90 Minuten = 1,5 Stunden");
  assert.equal(translate(page, "A hőmérséklet nem lehet az abszolút nulla alatt.", "en"), "Temperature cannot be below absolute zero.");
});

test("all dynamically generated unit names have EN and DE locale handling", () => {
  const units = [
    "Milliméter (mm)", "Centiméter (cm)", "Méter (m)", "Kilométer (km)", "Inch (in)", "Láb (ft)", "Yard (yd)", "Mérföld (mi)",
    "Négyzetcentiméter (cm²)", "Négyzetméter (m²)", "Ár (a)", "Hektár (ha)", "Négyzetkilométer (km²)", "Acre", "Négyzetláb (ft²)", "Négyzethüvelyk (in²)",
    "Milliliter (ml)", "Liter (l)", "Köbméter (m³)", "US gallon", "UK gallon", "Köbláb (ft³)",
    "Milligramm (mg)", "Gramm (g)", "Kilogramm (kg)", "Tonna (t)", "Uncia (oz)", "Font (lb)",
    "Celsius (°C)", "Fahrenheit (°F)", "Kelvin (K)", "Milliszekundum (ms)", "Másodperc (s)", "Perc", "Óra", "Nap", "Hét", "Átlagos hónap (30,436875 nap)", "Átlagos év (365,2425 nap)",
    "Méter/másodperc (m/s)", "Kilométer/óra (km/h)", "Mérföld/óra (mph)", "Csomó (kn)",
    "Byte (B)", "Kilobyte (kB, 10³)", "Megabyte (MB, 10⁶)", "Gigabyte (GB, 10⁹)", "Terabyte (TB, 10¹²)", "Kibibyte (KiB, 2¹⁰)", "Mebibyte (MiB, 2²⁰)", "Gibibyte (GiB, 2³⁰)", "Tebibyte (TiB, 2⁴⁰)",
    "Joule (J)", "Kilojoule (kJ)", "Megajoule (MJ)", "Wattóra (Wh)", "Kilowattóra (kWh)", "Kalória (cal)", "Kilokalória (kcal)",
    "Pascal (Pa)", "Kilopascal (kPa)", "Bar", "Atmoszféra (atm)", "PSI", "Watt (W)", "Kilowatt (kW)", "Megawatt (MW)", "Metrikus lóerő (LE/PS)", "Mechanikai horsepower (hp)"
  ];
  for (const unit of units) for (const language of ["en", "de"]) {
    assert.notEqual(translate(page, unit, language), null, `${language}: ${unit}`);
  }
});

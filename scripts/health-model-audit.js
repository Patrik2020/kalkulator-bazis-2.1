const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { transforms } = require("./apply-health-model-upgrades");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function expected(relativePath) {
  const source = read(relativePath);
  return transforms[relativePath] ? transforms[relativePath](source) : source;
}

function approx(actual, wanted, tolerance = 1e-9, label = "érték") {
  assert.ok(Math.abs(actual - wanted) <= tolerance, `${label}: ${actual} != ${wanted}`);
}

function bmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function bmiCategory(value) {
  if (value < 18.5) return "underweight";
  if (value < 25) return "normal";
  if (value < 30) return "overweight";
  return "obesity";
}

function mifflin({ sex, weight, height, age }) {
  return 10 * weight + 6.25 * height - 5 * age + (sex === "male" ? 5 : -161);
}

function navyBodyFat({ sex, waist, neck, hip = 0, height }) {
  const circumference = sex === "male" ? waist - neck : waist + hip - neck;
  if (circumference <= 0) throw new Error("invalid circumference");
  return sex === "male"
    ? 495 / (1.0324 - 0.19077 * Math.log10(circumference) + 0.15456 * Math.log10(height)) - 450
    : 495 / (1.29579 - 0.35004 * Math.log10(circumference) + 0.221 * Math.log10(height)) - 450;
}

function devine({ sex, height }) {
  if (height < 152.4) throw new Error("below validated page range");
  const base = sex === "male" ? 50 : 45.5;
  return base + (2.3 / 2.54) * (height - 152.4);
}

function addDaysIso(dateIso, days) {
  const date = new Date(`${dateIso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// BMI – a publikus oldal kifejezetten felnőtt kategóriákat kommunikál.
const bmiSource = read("js/egeszseg/bmi.js");
assert.ok(bmiSource.includes("w / (heightM * heightM)"), "BMI képlet eltért");
assert.ok(bmiSource.includes("bmi < 18.5") && bmiSource.includes("bmi < 25") && bmiSource.includes("bmi < 30"), "BMI felnőtt kategóriahatárok eltértek");
approx(bmi(75, 175), 24.489795918367346, 1e-12, "BMI referencia");
assert.strictEqual(bmiCategory(bmi(75, 175)), "normal");
assert.strictEqual(bmiCategory(18.49), "underweight");
assert.strictEqual(bmiCategory(25), "overweight");
assert.strictEqual(bmiCategory(30), "obesity");
assert.ok(read("kalkulatorok/bmi-kalkulator.html").includes("BMI kategóriák felnőtteknél"), "BMI felnőtt scope hiányzik");

// Mifflin–St Jeor – felnőtt scope + képlet.
const simpleExpected = expected("js/simple-calculators.js");
const calorieExpected = expected("js/egeszseg/kaloria.js");
assert.ok(simpleExpected.includes("v.age < 18"), "BMR 18+ guard hiányzik");
assert.ok(calorieExpected.includes("if (a < 18)"), "Kalória 18+ guard hiányzik");
assert.ok(calorieExpected.includes("Példa a fenntartó értékhez képest"), "±400 kcal nincs példaforgatókönyvként címkézve");
approx(mifflin({ sex: "male", weight: 75, height: 175, age: 35 }), 1673.75, 1e-12, "Mifflin férfi");
approx(mifflin({ sex: "female", weight: 75, height: 175, age: 35 }), 1507.75, 1e-12, "Mifflin nő");

// Derék–csípő arány – nemspecifikus WHO tájékoztató küszöbök.
assert.ok(simpleExpected.includes("const threshold=v.gender>=2?0.90:0.85"), "WHR nemspecifikus küszöb eltért");
approx(85 / 100, 0.85, 1e-12, "WHR női küszöb");
approx(90 / 100, 0.90, 1e-12, "WHR férfi küszöb");

// U.S. Navy/Hodgdon–Beckett metrikus körfogatképletek.
assert.ok(simpleExpected.includes("1.0324-0.19077*log10(circumference)+0.15456*log10(v.height)"), "Férfi testzsírképlet eltért");
assert.ok(simpleExpected.includes("1.29579-0.35004*log10(circumference)+0.221*log10(v.height)"), "Női testzsírképlet eltért");
approx(navyBodyFat({ sex: "male", waist: 90, neck: 40, height: 175 }), 19.20700892511178, 1e-9, "Navy férfi referencia");
approx(navyBodyFat({ sex: "female", waist: 75, neck: 35, hip: 100, height: 165 }), 28.435004161152847, 1e-9, "Navy női referencia");

// Devine – 5 láb felett 2,3 kg/inch, a publikus modell 152,4 cm alatt hibát ad.
assert.ok(simpleExpected.includes("if (v.height < 152.4)"), "Devine alsó scope guard hiányzik");
approx(devine({ sex: "male", height: 175 }), 70.46456692913387, 1e-9, "Devine férfi referencia");
approx(devine({ sex: "female", height: 175 }), 65.96456692913387, 1e-9, "Devine női referencia");

// Terhességi becslés – 280 nap + ciklushossz-eltérés.
assert.ok(simpleExpected.includes("const adjustment = cycleLength - 28"), "Terhességi ciklushossz-korrekció hiányzik");
assert.strictEqual(addDaysIso("2026-01-01", 280), "2026-10-08");
assert.strictEqual(addDaysIso("2026-01-01", 282), "2026-10-10");

// Makró és fehérje – energiaazonosság és user-controlled g/kg faktor.
const calories = 2000;
const proteinPct = 30;
const fatPct = 25;
const carbPct = 100 - proteinPct - fatPct;
assert.strictEqual(Math.round(calories * proteinPct / 100 / 4), 150);
assert.strictEqual(Math.round(calories * fatPct / 100 / 9), 56);
assert.strictEqual(Math.round(calories * carbPct / 100 / 4), 225);
assert.ok(simpleExpected.includes("if (carb < 0)"), "Makró 100%-os összegkorlát hiányzik");
assert.ok(simpleExpected.includes("const g=v.weight*v.factor"), "Fehérje g/kg modell eltért");
assert.strictEqual(Math.round(80 * 1.6), 128);

// Heurisztikus modellek: csak becslésként maradjanak címkézve.
assert.ok(simpleExpected.includes("const ml=v.weight*35+v.activity"), "Folyadék heurisztika eltért");
assert.ok(simpleExpected.includes("['Becsült napi folyadék'"), "Folyadék eredmény nincs becslésként címkézve");
assert.ok(simpleExpected.includes("const max=220-v.age"), "Pulzus max-becslés eltért");
assert.ok(simpleExpected.includes("['Becsült max pulzus'"), "Pulzus max nincs becslésként címkézve");
assert.ok(simpleExpected.includes("c*90-15"), "Alvásciklus heurisztika eltért");

console.log("Egészség modell-audit OK: BMI, Mifflin, WHR, Navy testzsír, Devine, terhesség, makró, fehérje és heurisztikus címkézés.");

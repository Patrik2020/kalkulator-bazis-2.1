const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

function close(actual, expected, tolerance = 1e-9, label = "érték") {
  assert.ok(Number.isFinite(actual), `${label}: nem véges eredmény`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} != ${expected}`);
}

function effectiveMonthly(annualPercent) {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
}

function compoundFuture({ initial, monthly, annualRate, years }) {
  const months = Math.round(years * 12);
  const monthlyRate = effectiveMonthly(annualRate);
  let total = initial;
  for (let month = 0; month < months; month += 1) {
    total = total * (1 + monthlyRate) + monthly;
  }
  return total;
}

function etfFuture({ initial, monthly, annualRate, ter, years }) {
  const months = Math.round(years * 12);
  const annualFactor = (1 + annualRate / 100) * (1 - ter / 100);
  const monthlyRate = Math.pow(annualFactor, 1 / 12) - 1;
  let total = initial;
  for (let month = 0; month < months; month += 1) {
    total *= 1 + monthlyRate;
    total += monthly;
  }
  return total;
}

function monthsToGoal({ initial, monthly, annualRate, goal, maxMonths = 1200 }) {
  const rate = effectiveMonthly(annualRate);
  let total = initial;
  let months = 0;
  while (total < goal && months < maxMonths) {
    total = total * (1 + rate) + monthly;
    months += 1;
  }
  return total >= goal ? months : null;
}

function dividendIncome({ capital, yieldPercent, deductionPercent, annualFixedCost }) {
  const gross = capital * yieldPercent / 100;
  const deductions = gross * deductionPercent / 100 + annualFixedCost;
  return {
    gross,
    net: Math.max(0, gross - deductions),
  };
}

// Infláció: azonos nominális összeg mai vásárlóereje.
const inflationSource = read("js/penzugyi/inflacio.js");
assert.ok(inflationSource.includes("initial / Math.pow(1 + annualRatePercent / 100, yearValue)"), "Inflációs diszkontálás eltért");
close(1_000_000 / Math.pow(1.05, 10), 613_913.2535407591, 1e-6, "1 M Ft / 5% / 10 év vásárlóerő");
close(1_000_000 / Math.pow(0.98, 5), 1_106_291.6180614623, 1e-6, "2%-os defláció kezelése");

// Kamatos kamat: effektív éves ráta -> havi egyenérték, hónap végi befizetéssel.
const compoundSource = read("js/penzugyi/kamatos-kamat.js");
assert.ok(compoundSource.includes("Math.pow(1 + annualRate / 100, 1 / 12) - 1"), "Kamatos kamat havi ráta eltért");
assert.ok(compoundSource.includes("total = total * (1 + monthlyRate) + contribution"), "Kamatos kamat befizetési időzítés eltért");
close(compoundFuture({ initial: 0, monthly: 50_000, annualRate: 6, years: 20 }), 22_671_931.62745605, 0.01, "50k/hó / 20 év / 6%");
close(compoundFuture({ initial: 1_000_000, monthly: 0, annualRate: 5, years: 10 }), 1_628_894.626777442, 0.01, "1 M kezdőtőke / 10 év / 5%");

// ETF: éves hozam és TER multiplikatív éves faktorából képzett havi ráta, hónap végi befizetés.
const etfSource = read("js/penzugyi/etf.js");
assert.ok(etfSource.includes("const netAnnualFactor = grossAnnualFactor * costAnnualFactor"), "ETF TER éves faktor eltért");
assert.ok(etfSource.includes("const monthlyRate = Math.pow(netAnnualFactor, 1 / 12) - 1"), "ETF havi ráta eltért");
assert.ok(etfSource.includes("balance = beforeGrowth + growth") && etfSource.includes("balance += monthlyContribution"), "ETF hónap végi befizetési sorrend eltért");
close(etfFuture({ initial: 0, monthly: 50_000, annualRate: 6, ter: 0, years: 20 }), 22_671_931.62745605, 0.01, "ETF referencia TER nélkül");
const etfWithTer = etfFuture({ initial: 0, monthly: 50_000, annualRate: 6, ter: 0.2, years: 20 });
assert.ok(etfWithTer < 22_671_931.62745605, "Pozitív TER nem növelheti az ETF végértéket");
close(etfFuture({ initial: 1_000_000, monthly: 0, annualRate: 0, ter: 0, years: 10 }), 1_000_000, 1e-6, "ETF 0% hozam / 0% TER");

// Milliomos: ugyanaz az effektív havi kamatos modell, 100 éves életszerűségi plafonnal.
const millionaireSource = read("js/penzugyi/milliomos.js");
assert.ok(millionaireSource.includes("Math.pow(1 + annualRate / 100, 1 / 12) - 1"), "Milliomos havi ráta eltért");
assert.ok(millionaireSource.includes("const maximumMonths = 1_200"), "Milliomos 100 éves plafon eltért");
assert.strictEqual(monthsToGoal({ initial: 0, monthly: 100_000, annualRate: 0, goal: 1_000_000 }), 10, "1 M cél 100k/hó 0%-nál");
const month5 = monthsToGoal({ initial: 0, monthly: 50_000, annualRate: 5, goal: 10_000_000 });
const month8 = monthsToGoal({ initial: 0, monthly: 50_000, annualRate: 8, goal: 10_000_000 });
assert.ok(month8 < month5, "Magasabb pozitív hozamnak gyorsabban kell elérnie ugyanazt a célt");

// Osztalék: éves bruttó hozam, százalékos levonás és éves fix költség algebra.
const dividendSource = read("js/penzugyi/osztalek.js");
assert.ok(dividendSource.includes("const rawDeductions = gross * deductionRate + values.fixedCost"), "Osztalék éves fix költség modell eltért");
assert.ok(dividendSource.includes("requiredCapital = Math.ceil((annualTarget + values.fixedCost) / netYieldRate)"), "Osztalék nettó cél inverz képlete eltért");
assert.ok(dividendSource.includes("options.fixedCost / frequency"), "Osztalék projekció fix költség időzítése eltért");
const dividendRef = dividendIncome({ capital: 3_000_000, yieldPercent: 4, deductionPercent: 15, annualFixedCost: 12_000 });
close(dividendRef.gross, 120_000, 1e-9, "3 M / 4% bruttó osztalék");
close(dividendRef.net, 90_000, 1e-9, "3 M / 4% / 15% / 12k nettó osztalék");
assert.strictEqual(Math.ceil((1_200_000 + 12_000) / (0.04 * 0.85)), 35_647_059, "100k havi nettó cél tőkeigénye");
assert.ok(read("kalkulatorok/osztalek-kalkulator.html").includes("Éves fix költség (Ft)"), "Osztalék fix költség UI-jelentése eltért");

// Havi költségvetés: megtakarítás tudatosan a havi allokáció része.
const budgetSource = read("js/penzugyi/havi-koltsegvetes.js");
assert.ok(budgetSource.includes("+\n    savings;"), "Havi költségvetésben a megtakarítás nincs az allokált kiadások között");
const income = 500_000;
const savings = 50_000;
const expenses = 150_000 + 50_000 + 80_000 + 30_000 + 20_000 + 20_000 + savings;
assert.strictEqual(expenses, 400_000);
assert.strictEqual(income - expenses, 100_000);
close(savings / income * 100, 10, 1e-12, "10%-os megtakarítási arány");

console.log("Finance model audit OK: infláció, kamatos kamat, ETF, milliomos, osztalék és havi költségvetés referencia/invariánsok.");

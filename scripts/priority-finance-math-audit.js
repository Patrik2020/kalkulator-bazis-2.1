const assert = require("assert");
const {
  annuityPayment,
  monthlyRateFromAnnual,
  principalFromPayment,
  amortization,
} = require("../js/penzugyi/loan-math.js");

function close(actual, expected, tolerance, message) {
  assert(Number.isFinite(actual), `${message}: az eredmény nem véges szám.`);
  assert(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} helyett ${expected} várt.`);
}

// 0%-os hitel: pontosan egyenlő tőkerészek.
close(annuityPayment(1_200_000, 0, 12), 100_000, 1e-9, "0%-os 12 havi hitel");

// 10 M Ft, 6% nominális éves kamat, 10 év.
const tenYear6 = annuityPayment(10_000_000, monthlyRateFromAnnual(6, false), 120);
close(tenYear6, 111_020.5019416512, 0.001, "10 M Ft / 6% / 10 év havi részlet");
close(tenYear6 * 120, 13_322_460.232998144, 0.01, "10 M Ft / 6% / 10 év teljes visszafizetés");

// 20 M Ft, 7% nominális éves kamat, 20 év.
const twentyYear7 = annuityPayment(20_000_000, monthlyRateFromAnnual(7, false), 240);
close(twentyYear7, 155_059.78712377461, 0.001, "20 M Ft / 7% / 20 év havi részlet");

// THM módban éves effektív rátából képzünk egyenértékű havi rátát.
const thmMonthly = monthlyRateFromAnnual(12, true);
close(Math.pow(1 + thmMonthly, 12), 1.12, 1e-12, "12% THM éves effektív visszaellenőrzése");
const thmPayment = annuityPayment(1_000_000, thmMonthly, 12);
close(thmPayment, 88_562.06738944116, 0.001, "1 M Ft / 12% THM / 1 év becsült részlet");

// Invariánsok: nagyobb kamat növeli, hosszabb futamidő csökkenti a havi részletet.
const basePrincipal = 8_000_000;
const payment4 = annuityPayment(basePrincipal, monthlyRateFromAnnual(4, false), 120);
const payment8 = annuityPayment(basePrincipal, monthlyRateFromAnnual(8, false), 120);
assert(payment8 > payment4, "Nagyobb kamat mellett nem csökkenhet a havi részlet azonos tőke/futamidő mellett.");

const payment10Years = annuityPayment(basePrincipal, monthlyRateFromAnnual(6, false), 120);
const payment20Years = annuityPayment(basePrincipal, monthlyRateFromAnnual(6, false), 240);
assert(payment20Years < payment10Years, "Hosszabb futamidőnek csökkentenie kell a havi részletet azonos tőke/kamat mellett.");
assert(payment20Years * 240 > payment10Years * 120, "Hosszabb futamidőnek növelnie kell a teljes kamatterhet pozitív kamat mellett.");

// The shared runtime model must preserve both JTM panels' existing ratios.
const { ratioFor } = require("../js/penzugyi/jtm-rules.js");
for (const [type, below, atOrAbove] of [
  ["lt5", 0.25, 0.30],
  ["5to10", 0.35, 0.40],
  ["10plus", 0.50, 0.60],
  ["unsecured", 0.50, 0.60],
  ["green", 0.60, 0.60],
  ["unknown", 0.50, 0.60],
]) {
  assert.strictEqual(ratioFor(799_999, type), below, type + ": below threshold");
  assert.strictEqual(ratioFor(800_000, type), atOrAbove, type + ": inclusive threshold");
  assert.strictEqual(ratioFor(800_001, type), atOrAbove, type + ": above threshold");
}

// Compare the existing nominal/effective and inverse formulas without changing their arithmetic.
for (const principal of [1, 100_000, 1_200_000, 20_000_000]) {
  for (const annual of [0, 0.0001, 3, 6.5, 12, 100]) {
    for (const months of [1, 12, 120, 240, 360]) {
      for (const effective of [false, true]) {
        const rate = effective ? Math.pow(1 + annual / 100, 1 / 12) - 1 : annual / 100 / 12;
        assert.strictEqual(monthlyRateFromAnnual(annual, effective), rate);
        const expected = rate === 0 ? principal / months : principal * rate / (1 - Math.pow(1 + rate, -months));
        assert.strictEqual(annuityPayment(principal, rate, months), expected);
        const inverse = rate === 0 ? expected * months : expected * (1 - Math.pow(1 + rate, -months)) / rate;
        assert.strictEqual(principalFromPayment(expected, rate, months), inverse);
        close(inverse, principal, Math.max(1e-9, principal * 1e-12), "annuity inverse");
      }
    }
  }
}

// The amortization schedule belongs to the loan model, not the DOM controller.
const zeroSchedule = amortization(1_200_000, 0, 1);
assert.deepStrictEqual(zeroSchedule, { monthly: 100_000, interestTotal: 0, total: 1_200_000,
  annual: [{ year: 1, principal: 1_200_000, interest: 0, balance: 0 }], months: 12 });
const early = amortization(1_200_000, 0, 1, 1, 1_200_000);
assert.strictEqual(early.months, 1);
assert.strictEqual(early.annual[0].balance, 0);
assert.strictEqual(early.annual[0].principal, 1_200_000);
const normal = amortization(10_000_000, 6, 10);
const prepaid = amortization(10_000_000, 6, 10, 12, 1_000_000);
close(normal.monthly, tenYear6, 0.001, "schedule monthly payment");
assert(prepaid.interestTotal < normal.interestTotal && prepaid.months < normal.months);

// Verify browser registration and loader order, not just the Node export.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const context = { window: {} };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
vm.runInNewContext(read("js/penzugyi/loan-math.js"), context);
assert.strictEqual(context.window.KB_LOAN_MATH.amortization(1200, 0, 1).months, 12);
assert.ok(!read("js/priority-upgrades.js").includes("function amortization("));
assert.ok(read("js/priority-upgrades.js").includes("const { amortization } = window.KB_LOAN_MATH;"));
assert.strictEqual(context.window.KB_LOAN_MATH.annuityPayment(1200, 0, 12), 100);
assert.strictEqual(context.window.KB_LOAN_MATH.principalFromPayment(100, 0, 12), 1200);
for (const [page, script] of [
  ["hitel-torleszto-kalkulator", "hitel-torleszto"],
  ["hitelkepesseg-kalkulator", "hitelkepesseg"],
]) {
  const html = read("kalkulatorok/" + page + ".html");
  const modelTag = html.match(/<script src="\.\.\/js\/penzugyi\/loan-math\.js(?:\?[^"]*)?"><\/script>/);
  assert.ok(modelTag, page + ": synchronous model tag");
  assert.ok(modelTag.index < html.indexOf("js/global-head.js"), page + ": before panel loader");
  assert.ok(modelTag.index < html.indexOf("js/penzugyi/" + script + ".js"), page + ": before primary calculator");
}
vm.runInNewContext(read("js/penzugyi/jtm-rules.js"), context);
assert.strictEqual(context.window.KB_JTM_RULES.ratioFor(800_000, "lt5"), 0.30);
vm.runInNewContext(read("js/global-head-config.js"), context);
const features = context.window.KB_GLOBAL_HEAD_CONFIG.features;
const modelIndex = features.findIndex((feature) => feature.id === "jtm-rules");
assert.ok(modelIndex >= 0);
assert.strictEqual(features[modelIndex].pages.join(","), "hitelkepesseg-kalkulator");
assert.match(features[modelIndex].scripts[0], /^js\/penzugyi\/jtm-rules\.js(?:\?|$)/);
for (const id of ["priority-upgrade", "finance-quality"]) {
  const panelIndex = features.findIndex((feature) => feature.id === id);
  assert.ok(panelIndex > modelIndex, id + ": model must load first");
  assert.ok(features[panelIndex].pages.includes("hitelkepesseg-kalkulator"));
}

console.log("Priority finance math audit OK: hiteltörlesztő referenciák és JTM küszöb-, modell- és betöltési ellenőrzések.");

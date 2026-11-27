const assert = require("assert");
const {
  annuityPayment,
  monthlyRateFromAnnual,
} = require("../js/penzugyi/hitel-torleszto.js");

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

// Verify browser registration and loader order, not just the Node export.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const context = { window: {} };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
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

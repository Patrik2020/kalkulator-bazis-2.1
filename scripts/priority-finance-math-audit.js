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

console.log("Priority finance math audit OK: hiteltörlesztő 8 referencia/invariáns ellenőrzés.");

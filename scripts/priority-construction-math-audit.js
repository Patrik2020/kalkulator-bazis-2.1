const assert = require("assert");
const {
  calculateConcreteVolume,
  formatConcreteVolume,
} = require("../js/epitoipari/beton.js");

function close(actual, expected, tolerance, message) {
  assert(Number.isFinite(actual), `${message}: nem véges eredmény.`);
  assert(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} helyett ${expected} várt.`);
}

close(calculateConcreteVolume(10, 5, 20), 10, 1e-12, "10×5 m, 20 cm beton");
close(calculateConcreteVolume(1, 1, 10), 0.1, 1e-12, "1×1 m, 10 cm beton");
close(calculateConcreteVolume(2.4, 1.7, 12), 0.4896, 1e-12, "tizedes méretű beton");

const small = calculateConcreteVolume(1, 1, 0.4);
close(small, 0.004, 1e-12, "kis betonmennyiség");
const smallLabel = formatConcreteVolume(small);
assert(/0,0040\s*m³/.test(smallLabel), `A kis térfogat m³ pontossága elveszett: ${smallLabel}`);
assert(/4\s*liter/.test(smallLabel), `A kis térfogat literes értelmezése hiányzik: ${smallLabel}`);

assert.strictEqual(calculateConcreteVolume(0, 2, 10), null, "0 hossz nem adhat 0,00 m³ látszateredményt.");
assert.strictEqual(calculateConcreteVolume(2, -1, 10), null, "Negatív szélességet el kell utasítani.");
assert.strictEqual(calculateConcreteVolume(2, 1, Number.NaN), null, "Nem szám vastagságot el kell utasítani.");

const base = calculateConcreteVolume(2, 3, 15);
close(calculateConcreteVolume(4, 3, 15), base * 2, 1e-12, "Hossz duplázási invariáns");
close(calculateConcreteVolume(2, 3, 30), base * 2, 1e-12, "Vastagság duplázási invariáns");

console.log("Priority construction math audit OK: beton 9 referencia/határérték/invariáns ellenőrzés.");

const assert = require("assert");
const { evaluate, factorial, format } = require("../js/calculator-suite.js");

const closeTo = (actual, expected, tolerance = 1e-12) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Várt érték: ${expected}, kapott érték: ${actual}`
  );
};

const rejects = (expression, mode = "deg") => {
  assert.throws(() => evaluate(expression, mode), Error, `Hibát vártunk erre: ${expression}`);
};

assert.strictEqual(evaluate("(12 + 8) × 3"), 60);
assert.strictEqual(evaluate("250 × 20 ÷ 100"), 50);
assert.strictEqual(evaluate("2 + 3 * 4"), 14);
assert.strictEqual(evaluate("√(144)"), 12);
assert.strictEqual(evaluate("12^2"), 144);
assert.strictEqual(evaluate("5!"), 120);
assert.strictEqual(evaluate("log(1000)"), 3);
assert.strictEqual(evaluate("abs(-4.5)"), 4.5);
closeTo(evaluate("sin(30)", "deg"), 0.5);
closeTo(evaluate("asin(0.5)", "deg"), 30);
closeTo(evaluate("sin(π / 2)", "rad"), 1);
closeTo(evaluate("ln(e)"), 1);

assert.strictEqual(factorial(0), 1);
assert.strictEqual(factorial(10), 3628800);
assert.match(format(12.5), /12,5/);

rejects("");
rejects("1 / 0");
rejects("√(-1)");
rejects("(-1)!");
rejects("171!");
rejects("5!!");
rejects("alert(1)");
rejects("2 + 2", "grad");

console.log("Multifunkciós számológép audit OK: 22 referencia- és validációs eset.");

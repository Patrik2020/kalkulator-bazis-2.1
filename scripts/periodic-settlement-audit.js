const assert = require("assert");
const {
  parseLocalDate,
  calculatePeriodicPerformance,
} = require("../js/penzugyi/szamlazasi/szamla-teljesites.js");

function iso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function calculate(periodEnd, invoice, due) {
  return calculatePeriodicPerformance(
    parseLocalDate(periodEnd),
    parseLocalDate(invoice),
    parseLocalDate(due)
  );
}

const cases = [
  {
    name: "Főszabály: időszak utolsó napja",
    input: ["2026-01-31", "2026-02-02", "2026-01-31"],
    expectedDate: "2026-01-31",
    expectedRule: "period-end",
  },
  {
    name: "Korai számlázás és korai esedékesség: számla napja",
    input: ["2026-01-31", "2026-01-10", "2026-01-20"],
    expectedDate: "2026-01-10",
    expectedRule: "invoice-before-period-end",
  },
  {
    name: "Esedékesség az időszak után, 60 napon belül",
    input: ["2026-01-31", "2026-01-20", "2026-02-15"],
    expectedDate: "2026-02-15",
    expectedRule: "payment-due-after-period-end",
  },
  {
    name: "60 napos felső korlát",
    input: ["2026-01-31", "2026-02-01", "2026-04-15"],
    expectedDate: "2026-04-01",
    expectedRule: "sixty-day-cap",
  },
  {
    name: "Esedékesség pontosan az időszak végén: főszabály",
    input: ["2026-08-31", "2026-08-20", "2026-08-31"],
    expectedDate: "2026-08-31",
    expectedRule: "period-end",
  },
];

for (const testCase of cases) {
  const result = calculate(...testCase.input);
  assert(result, `${testCase.name}: nincs eredmény.`);
  assert.strictEqual(iso(result.date), testCase.expectedDate, `${testCase.name}: hibás dátum.`);
  assert.strictEqual(result.rule, testCase.expectedRule, `${testCase.name}: hibás szabályág.`);
}

assert.strictEqual(parseLocalDate("2026-02-29"), null, "Érvénytelen naptári dátumot el kell utasítani.");
assert.strictEqual(parseLocalDate("2026-2-1"), null, "Nem ISO formátumú dátumot el kell utasítani.");
assert.strictEqual(
  calculatePeriodicPerformance(parseLocalDate("2026-01-31"), null, parseLocalDate("2026-02-15")),
  null,
  "Hiányos bemenetnél nem lehet jogi dátumot becsülni."
);

console.log(`Időszakos elszámolás audit OK: ${cases.length} szabályág + 3 hibás/hiányos dátumeset.`);

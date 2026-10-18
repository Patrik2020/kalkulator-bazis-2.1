"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const { declaredGlobals, auditRepository } = require("./calculator-scope-audit");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fixtures = [
  { name: "hitel-torleszto", values: { amount: "1 200 000", rate: "1,5", years: "1", thm: "12" }, result: "result-monthly", expected: "100 814 Ft", invalid: { rate: "-1" }, invalidExpected: "Adj meg 0% és 100% közötti éves értéket." },
  { name: "hitelkepesseg", values: { income: "500 000", existing: "50 000", rate: "1,5", years: "1" }, result: "result-loan", expected: "Becsült hitelösszeg: 1 785 460 Ft", invalid: { income: "" }, invalidResult: "result-monthly", invalidExpected: "–" },
  { name: "inflacio", values: { amount: "1 200 000", rate: "1,5", years: "1" }, result: "result-final", expected: "1 182 266 Ft", invalid: { rate: "" }, invalidExpected: "–" },
  { name: "kamatos-kamat", values: { initial: "1 200 000", monthly: "10 000", rate: "1,5", years: "1" }, result: "result-final", expected: "1 338 823 Ft", invalid: { years: "101" }, invalidExpected: "–" },
  { name: "lakashitel-onero", values: { price: "50 000 000", percent: "20,5" }, result: "result-down", expected: "10 250 000 Ft", invalid: { percent: "101" }, invalidExpected: "–" },
  { name: "milliomos", values: { initial: "0", monthly: "100 000", rate: "0", goal: "1 200 000" }, result: "result-time", expected: "1 év 0 hónap", invalid: { rate: "-100" }, invalidExpected: "–" },
];

function browserStub(values = {}) {
  const elements = new Map();
  const document = {
    readyState: "loading",
    addEventListener() {},
    querySelectorAll() { return []; },
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, {
          value: values[id] || "", textContent: "", checked: false,
          classList: { toggle() {} }, events: new Map(),
          addEventListener(type, callback) {
            if (!this.events.has(type)) this.events.set(type, []);
            this.events.get(type).push(callback);
          },
        });
      }
      return elements.get(id);
    },
  };
  const context = { document };
  context.window = context;
  vm.createContext(context);
  return { context, elements };
}

const text = (element) => element.textContent.replace(/\s/g, " ");

for (const fixture of fixtures) {
  for (const order of ["shared-first", "calculator-first"]) {
    test(`${fixture.name}: decimal comma and grouped input survive ${order} and later global replacement`, () => {
      const { context, elements } = browserStub(fixture.values);
      const file = `js/penzugyi/${fixture.name}.js`;
      assert.equal(declaredGlobals(read(file)).size, 0, "Calculator bindings must stay private");
      const sources = order === "shared-first" ? ["js/utils.js", file] : [file, "js/utils.js"];
      for (const source of sources) vm.runInContext(read(source), context, { filename: source });
      assert.equal(text(elements.get(fixture.result)), fixture.expected);

      context.format = () => { throw new Error("Foreign global format used"); };
      context.parseNumber = () => { throw new Error("Foreign global parseNumber used"); };
      context.formatInput = () => { throw new Error("Foreign global formatter used"); };
      // Trigger the real input listeners after replacing the shared globals.
      const input = elements.get(Object.keys(fixture.values)[0]);
      input.events.get("input").forEach((callback) => callback({ target: input }));
      assert.equal(text(elements.get(fixture.result)), fixture.expected);

      for (const [id, value] of Object.entries(fixture.invalid)) elements.get(id).value = value;
      const changed = elements.get(Object.keys(fixture.invalid)[0]);
      changed.events.get("input").forEach((callback) => callback({ target: changed }));
      assert.equal(text(elements.get(fixture.invalidResult || fixture.result)), fixture.invalidExpected);
    });
  }
}

test("simple calculator engine exports for Node without creating browser globals", () => {
  const { context } = browserStub();
  const originalFormat = () => { throw new Error("Foreign global formatter used"); };
  context.format = originalFormat;
  context.module = { exports: {} };
  const source = read("js/simple-calculators.js");
  assert.equal(declaredGlobals(source).size, 0);
  vm.runInContext(source, context);
  const calculators = context.module.exports;
  assert.ok(Object.keys(calculators).length >= 40);
  assert.equal(context.format, originalFormat);
  assert.equal(context.SIMPLE_CALCULATORS, undefined);
  assert.equal(context.parseValue, undefined);
  const result = Object.fromEntries(calculators["padlo-burkolat-kalkulator"].compute({ length: 5, width: 4, waste: 10, pack: 2.2 }));
  assert.equal(result["Szükséges csomag"], "10 csomag");
});

test("actual calculator script graph has no global declaration collisions", () => {
  const result = auditRepository(root);
  assert.ok(result.pages >= 102);
  assert.deepEqual(result.failures, []);
});

test("audit rejects collisions introduced by a directly loaded calculator", () => {
  const file = "js/penzugyi/hitelkepesseg.js";
  const result = auditRepository(root, (name) => read(name) + (name === file ? "\nfunction parseNumber() {}" : ""));
  assert.ok(result.failures.some((failure) => failure.includes("hitelkepesseg-kalkulator.html: parseNumber:")));
});

test("audit follows dynamically configured feature scripts", () => {
  const file = "js/priority-upgrades.js";
  const result = auditRepository(root, (name) => read(name) + (name === file ? "\nfunction format() {}" : ""));
  assert.ok(result.failures.some((failure) => failure.includes("hitelkepesseg-kalkulator.html: format:")));
});

test("audit includes executable inline scripts", () => {
  const page = "kalkulatorok/hitelkepesseg-kalkulator.html";
  const result = auditRepository(root, (name) => name === page ? `${read(name)}<script>const format = () => 0;</script>` : read(name));
  assert.ok(result.failures.some((failure) => failure.includes("hitelkepesseg-kalkulator.html: format:")));
});

test("audit distinguishes private bindings from script-level destructuring and var", () => {
  const source = "const {a, nested: {b}, ...rest} = value; let [c] = list; if (true) { var d; let privateBlock; } (() => { const a = 1; function hidden() {} })();";
  assert.deepEqual([...declaredGlobals(source)].sort(), ["a", "b", "c", "d", "rest"]);
});

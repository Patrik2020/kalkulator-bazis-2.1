#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const page=read("kalkulatorok/netto-brutto-kalkulator.html");
const home=read("index.html");
const fragment=read("fragments/home-redesign-v17-main.inc");
const fullClient=read("js/penzugyi/netto-brutto-shadow.js");
const quickClient=read("js/home-redesign-salary.js");
for(const [label,source,id] of [["Full calculator",page,"salary-tax-rate"],["Homepage",home,"heroSalaryTaxRate"],["Home fragment",fragment,"heroSalaryTaxRate"]]){
 assert.match(source,new RegExp('id="'+id+'"'),label+" missing tax-rate selector");
 assert.match(source,/value="15" selected/);
 assert.match(source,/value="9"/);
}
assert.match(fullClient,/szjaRatePercent: taxYear === 2026 && Number\(document\.getElementById\("salary-tax-rate"\)/);
assert.match(page,/id="salary-tax-year"/);
assert.match(page,/value="2027"/);
assert.match(fullClient,/2027-01-01T00:00:00\+01:00/);
assert.match(fullClient,/data.taxYear !== 2027/);
assert.match(fullClient,/confirmedRate !== 9/);
assert.match(quickClient,/szjaRatePercent:selectedRate/);
assert.match(quickClient,/returnedRate!==9/);
assert.match(quickClient,/if\(selectedRate===9\)/);
console.log("Salary 15%/9% selectors, request payload and API-mismatch guard OK.");

const vm = require("node:vm");
const rollover = Date.parse("2026-12-31T23:00:00Z");
let now = rollover - 1;
let removed = false;
let transitionCallback;
const events = {};
const yearSelect = {
  value: "2026",
  querySelector() { return removed ? null : { remove() { removed = true; } }; },
  addEventListener(type, listener) { events[type] = listener; },
};
const scenarios = {};
const help = {};
const document = {
  getElementById(id) {
    if (id === "salary-tax-year") return yearSelect;
    if (id === "salary-tax-year-help") return help;
    if (id === "salary-rate-scenarios") return scenarios;
    if (id.startsWith("result-")) return {};
    return null;
  },
  querySelector() { return null; },
  querySelectorAll() { return []; },
};
vm.runInNewContext(fullClient, {
  document,
  Date: { parse: Date.parse, now: () => now },
  window: {
    setTimeout(callback) { transitionCallback = callback; },
    clearTimeout() {},
  },
});
assert.equal(yearSelect.value, "2026");
assert.equal(removed, false);
assert.equal(scenarios.hidden, false);
yearSelect.value = "2027";
events.change();
assert.equal(help.hidden, false);
assert.equal(scenarios.hidden, true);
yearSelect.value = "2026";
now = rollover;
transitionCallback();
assert.equal(removed, true);
assert.equal(yearSelect.value, "2027");
assert.equal(scenarios.hidden, true);
console.log("Budapest midnight rollover verified on an already-open page.");

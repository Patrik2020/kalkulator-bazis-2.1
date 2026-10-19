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
assert.match(fullClient,/szjaRatePercent: Number\(document\.getElementById\("salary-tax-rate"\)/);
assert.match(fullClient,/confirmedRate !== 9/);
assert.match(quickClient,/szjaRatePercent:selectedRate/);
assert.match(quickClient,/returnedRate!==9/);
assert.match(quickClient,/if\(selectedRate===9\)/);
console.log("Salary 15%/9% selectors, request payload and API-mismatch guard OK.");

#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

function extractSetDates(source, variableName) {
  const marker = `const ${variableName} = new Set([`;
  const start = source.indexOf(marker);
  assert.notStrictEqual(start, -1, `Hiányzó dátumkészlet: ${variableName}`);
  const end = source.indexOf("]);", start);
  assert.notStrictEqual(end, -1, `Nem zárható le a dátumkészlet: ${variableName}`);
  return [...source.slice(start, end).matchAll(/"(\d{4}-\d{2}-\d{2})"/g)].map((match) => match[1]);
}

const paymentDeadline = read("js/penzugyi/szamlazasi/fizetesi-hatarido.js");
assert.deepStrictEqual(
  extractSetDates(paymentDeadline, "nonWorkingDays2026"),
  [
    "2026-01-01",
    "2026-01-02",
    "2026-04-03",
    "2026-04-06",
    "2026-05-01",
    "2026-05-25",
    "2026-08-20",
    "2026-08-21",
    "2026-10-23",
    "2026-11-01",
    "2026-12-24",
    "2026-12-25",
    "2026-12-26",
  ],
  "A 2026-os munkaszüneti/pihenőnapi készlet eltér az ellenőrzött szabályoktól."
);
assert.deepStrictEqual(
  extractSetDates(paymentDeadline, "workingSaturdays2026"),
  ["2026-01-10", "2026-08-08", "2026-12-12"],
  "A 2026-os áthelyezett munkaszombatok eltérnek a 10/2025. (IV. 30.) NGM rendelettől."
);

const salaryHtml = read("kalkulatorok/netto-brutto-kalkulator.html");
assert.match(salaryHtml, /15% SZJA[^\n]*18,5% TB-járulék[^\n]*13% munkáltatói szocho/);
assert.match(salaryHtml, /715\s*765 Ft-os adóalap-korlát/);
assert.match(salaryHtml, /NAV családi adókedvezmény-kalkulátor/);

const salaryClient = read("js/penzugyi/netto-brutto-shadow.js");
assert.match(salaryClient, /const API_BASE = "https:\/\/api\.kalkulatorbazis\.hu"/);
assert.match(salaryClient, /credentials:\s*"omit"/);
assert.match(salaryClient, /eligibleDependants > dependants/);

const affordabilityJs = read("js/penzugyi/hitelkepesseg.js");
const affordabilityHtml = read("kalkulatorok/hitelkepesseg-kalkulator.html");
assert.match(affordabilityJs, /const planningRatio = 0\.4;/);
assert.match(affordabilityHtml, /40%-os tervezési aránnyal számol/);
assert.match(affordabilityHtml, /nem azonos a mindenkor hatályos JTM-korláttal/i);

const downPaymentHtml = read("kalkulatorok/lakas-hitel-onero-kalkulator.html");
assert.match(downPaymentHtml, /Főszabály[^<]*legfeljebb 80% finanszírozás/);
assert.match(downPaymentHtml, /Elsőlakás-vásárló[^<]*legfeljebb 90%/);
assert.match(downPaymentHtml, /Zöld fedezet és hitelcél[^<]*legfeljebb 90%/);
assert.match(downPaymentHtml, /MNB[^<]*HFM\/JTM szabályok/);

console.log("2026 kritikus szabályaudit OK: munkanapok, bérparaméterek, API-integráció, JTM/HFM kommunikáció.");

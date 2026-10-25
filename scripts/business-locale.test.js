"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const api = require("../js/altalanos/everyday-locale");
const glossary = require("../data/localization-glossary.json");
const calculations04 = require("../js/expansion-batch-04-calculators");
const calculations05 = require("../js/expansion-batch-05-calculators");

test("business calculator copy and calculation errors have reviewed EN/DE translations", () => {
  const checks = [
    ["arres-kalkulator", "Beszerzési ár (Ft)", "Purchase price (HUF)", "Einkaufspreis (HUF)"],
    ["arres-kalkulator", "Árrés és haszonkulcs ugyanaz?", "Are margin and markup the same?", "Sind Handelsspanne und Aufschlag dasselbe?"],
    ["haszonkulcs-kalkulator", "A haszonkulcs legyen nagyobb -100%-nál.", "Markup must be greater than -100%.", "Der Aufschlag muss größer als -100 % sein."],
    ["fedezeti-pont-kalkulator", "Fedezeti mennyiség:", "Break-even quantity:", "Break-even-Menge:"],
    ["fedezeti-pont-kalkulator", "Az eladási ár legyen nagyobb a változó költségnél.", "Selling price must be greater than variable cost.", "Der Verkaufspreis muss höher als die variablen Kosten sein."]
  ];
  for (const [page, source, en, de] of checks) {
    assert.equal(api.translate(page, source, "en"), en);
    assert.equal(api.translate(page, source, "de"), de);
    assert.equal(api.translate(page, source, "hu"), null);
  }
  for (const [source, pair] of Object.entries(glossary)) {
    for (const page of ["arres-kalkulator", "haszonkulcs-kalkulator", "fedezeti-pont-kalkulator"]) {
      const actual = api.translate(page, source, "en");
      if (actual !== null) assert.equal(actual, pair[0], `${page}: ${source}`);
    }
  }
});

test("translation work leaves margin, markup and break-even calculations unchanged", () => {
  const margin = calculations04.arres(8000, 10000);
  assert.deepEqual(margin, { margin: 2000, marginPercent: 20, markupPercent: 25 });
  const markup = calculations04.haszonkulcs(8000, 25);
  assert.equal(markup.sellPrice, 10000);
  assert.equal(markup.margin, 2000);
  assert.equal(markup.marginPercent, 20);
  const breakEven = calculations05.fedezetiPont(1000000, 10000, 6000);
  assert.deepEqual(breakEven, { contribution: 4000, contributionMarginPercent: 40, units: 250, revenue: 2500000 });
});

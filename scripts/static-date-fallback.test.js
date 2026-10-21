"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { stablePriorityDateFallback, dateDependentResults, NEUTRAL_RESULT } = require("./static-date-fallback");

test("live default results from two different days have identical, neutral static content", () => {
  const dayValues = {
    "kalkulatorok/fizetesi-hatarido-kalkulator.html": ["2026. október 27., kedd", "2026. október 29., csütörtök"],
    "kalkulatorok/szamla-teljesites-kalkulator.html": ["2026. 10. 19.", "2026. 10. 21."],
    "kalkulatorok/terhessegi-kalkulator.html": ["2027. május 17.", "2027. május 19."],
  };
  for (const [page, label] of dateDependentResults) {
    const outputs = dayValues[page].map((date) => {
      const input = '<div class="priority-result"><span>' + label + '</span><strong>' + date +
        '</strong></div><input type="date" id="date"><p>Egyéb tartalom</p>';
      return stablePriorityDateFallback(page, input);
    });
    assert.equal(outputs[0], outputs[1], page);
    assert.ok(outputs[0].includes("<strong>" + NEUTRAL_RESULT + "</strong>"));
    assert.ok(outputs[0].includes('<input type="date" id="date">'));
    assert.ok(!outputs[0].includes(dayValues[page][0]));
    assert.ok(!outputs[0].includes(dayValues[page][1]));
  }
});

test("non-date-dependent calculators preserve every rendered result", () => {
  const html = '<span>Számított határnap</span><strong>2026. október 27.</strong>';
  assert.equal(stablePriorityDateFallback("kalkulatorok/atlag-kalkulator.html", html), html);
});

test("stale DOM contracts fail closed, never quietly ship changing fallback dates", () => {
  assert.throws(() => stablePriorityDateFallback("kalkulatorok/terhessegi-kalkulator.html", null), /missing priority fallback/);
  assert.throws(() => stablePriorityDateFallback("kalkulatorok/terhessegi-kalkulator.html", "<main></main>"), /expected one/);
  const doubled = '<span>Becsült terminus</span><strong>A</strong><span>Becsült terminus</span><strong>B</strong>';
  assert.throws(() => stablePriorityDateFallback("kalkulatorok/terhessegi-kalkulator.html", doubled), /got 2/);
});

test("neutral crawler fallback cannot freeze a date from either day or timezone", () => {
  for (const date of ["2026. 10. 20.", "2026. 10. 21.", "2026. 10. 22."]) {
    const output = stablePriorityDateFallback("kalkulatorok/szamla-teljesites-kalkulator.html",
      '<span>Becsült teljesítési időpont</span><strong>' + date + '</strong>');
    assert.equal(output, '<span>Becsült teljesítési időpont</span><strong>' + NEUTRAL_RESULT + '</strong>');
  }
});

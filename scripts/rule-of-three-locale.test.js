"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const locale = require("../js/altalanos/rule-of-three-locale.js");
const { harmasszabaly } = require("../js/expansion-batch-01-calculators.js");
const { requiresTranslation } = require("./localization-coverage-browser-checks.js");
const page = "harmasszabaly-kalkulator";

test("rule of three form, guide, FAQ and metadata are translated", () => {
  assert.equal(locale.translate(page, "Hármasszabály kalkulátor", "en"), "Rule of Three Calculator");
  assert.equal(locale.translate(page, "Mire való a hármasszabály?", "de"), "Wofür wird der Dreisatz verwendet?");
  assert.equal(locale.translate(page, "Használhatok tizedes számokat?", "en"), "Can I use decimal numbers?");
  assert.equal(locale.translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(locale.translate(page, "Hármasszabály kalkulátor", "hu"), null);
});

test("dynamic labels, errors and locale-aware numbers retain their meaning", () => {
  assert.equal(locale.translate(page, "X értéke", "en"), "Value of X");
  assert.equal(locale.translate(page, "Szorzótényező A → C", "de"), "Skalierungsfaktor A → C");
  assert.equal(locale.translate(page, "A: adj meg érvényes számot.", "en"), "A: enter a valid number.");
  assert.equal(locale.translate(page, "A nem lehet nulla, mert osztóként szerepel a képletben.", "de"), "A darf nicht null sein, da es in der Formel als Divisor verwendet wird.");
  assert.equal(locale.formatNumber(7.5, "en"), "7.5");
  assert.equal(locale.formatNumber(7.5, "de"), "7,5");
  assert.equal(locale.formatNumber(7.5, "hu"), "7,5");
});

test("the underlying calculation is unchanged", () => {
  assert.deepEqual(harmasszabaly(2, 5, 8), { x: 20, multiplier: 4 });
  assert.deepEqual(harmasszabaly(4, 3, 10), { x: 7.5, multiplier: 2.5 });
  assert.throws(() => harmasszabaly(0, 5, 8), /A nem lehet nulla/);
  assert.equal(requiresTranslation("7.5"), false);
});

test("report subjects are localized", () => {
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s";
  assert.equal(new URL(locale.localizeReportHref(source, "en")).searchParams.get("subject"), "Error report – Rule of Three Calculator");
  assert.equal(new URL(locale.localizeReportHref(source, "de")).searchParams.get("subject"), "Fehlermeldung – Dreisatz-Rechner");
});

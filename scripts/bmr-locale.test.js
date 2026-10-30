"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate } = require("../js/egeszseg/bmr-locale.js");
const page = "bmr-kalkulator";

test("BMR metadata, inputs, errors and live energy units are localized", () => {
  assert.equal(translate(page, "BMR kalkulátor", "en"), "BMR Calculator");
  assert.equal(translate(page, "BMR kalkulátor", "de"), "BMR-Rechner");
  assert.equal(translate(page, "Testsúly (kg)", "en"), "Weight (kg)");
  assert.equal(translate(page, "A Mifflin–St Jeor becslést ezen az oldalon felnőtteknek (18+) használjuk", "de"), "Auf dieser Seite wird die Mifflin–St-Jeor-Schätzung für Erwachsene (ab 18 Jahren) verwendet.");
  assert.equal(translate(page, "Becsült nyugalmi energiaigény:", "en"), "Estimated resting energy expenditure:");
  assert.equal(translate(page, "1 686 kcal/nap", "en"), "1 686 kcal/day");
  assert.equal(translate(page, "1 686 kcal/nap", "de"), "1 686 kcal/Tag");
  assert.equal(translate(page, "Hirdetés", "en"), "Advertisement");
  assert.equal(translate(page, "EFSA – Dietary Reference Values", "de"), "EFSA – Referenzwerte für die Nährstoffzufuhr");
  assert.equal(translate(page, "BMR", "en"), "BMR");
});

test("BMR explanations, safeguards and FAQs have English and German copy", () => {
  assert.equal(translate(page, "Mi az a BMR?", "en"), "What is BMR?");
  assert.equal(translate(page, "A BMR alatt kell ennem fogyáshoz?", "de"), "Muss ich zum Abnehmen weniger als meinen BMR essen?");
  assert.equal(translate(page, "Nem diagnosztikai eszköz, nem alkalmas gyermekek, várandósság vagy speciális egészségi állapotok személyre szabott energiaigényének meghatározására. Jelentős fogyás, hízás vagy betegség esetén szakember bevonása célszerű.", "en").startsWith("This is not a diagnostic tool"), true);
  assert.equal(translate(page, "Az eredmény általános tájékoztatást ad, nem diagnózis és nem helyettesít orvosi vizsgálatot vagy személyre szabott kezelési javaslatot.", "de").includes("keine Diagnose"), true);
});

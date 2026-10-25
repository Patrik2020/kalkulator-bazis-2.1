"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/penzugyi/investment-inflation-locale");

test("ETF investment assumptions, risk guidance and dynamic chart labels are translated", () => {
  const page = "etf-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "ETF kalkulátor", "en"), "ETF calculator");
  assert.equal(api.translate(page, "Éves infláció (%)", "de"), "Jährliche Inflation (%)");
  assert.match(api.translate(page, "A TER az ETF éves teljes költségmutatója. Ez a költség nem külön számlaként érkezik, hanem az alap teljesítményét csökkenti. Egy 0,20%-os és egy 0,80%-os költség első ránézésre nem tűnik nagy különbségnek, de több évtized alatt látványos eltérést okozhat a végösszegben.", "en"), /annual total expense ratio/u);
  assert.equal(api.translate(page, "20. év", "de"), "20. Jahr");
  assert.equal(api.translate(page, "6% éves bruttó hozamfeltételezés", "en"), "6% assumed gross annual return");
  assert.equal(api.translate(page, "1. év: portfólió 615 755 Ft, saját befizetés 600 000 Ft", "en"), "Year 1: portfolio 615 755 HUF, contributions 600 000 HUF");
  assert.equal(api.translate(page, "A TER legyen 0% és 10% között.", "de"), "Die TER muss zwischen 0 % und 10 % liegen.");
  assert.equal(api.translate(page, "Adj meg egy összeget.", "en"), "Enter an amount.");
  assert.match(api.translate(page, "A megadott feltételek alapján a kezdőtőke önmagában is elérheti a 30 M Ft körüli célösszeget, ezért a szükséges havi befektetés becslés szerint 0 Ft.", "en"), /starting capital alone/u);
});

test("inflation guidance and dynamic result wording are available in English and German", () => {
  const page = "inflacio-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "Infláció kalkulátor", "de"), "Inflationsrechner");
  assert.equal(api.translate(page, "Jövőbeli becslés", "en"), "Future estimate");
  assert.match(api.translate(page, "Az infláció hatása évről évre halmozódik. Ez azt jelenti, hogy nem egyszerűen összeadódik, hanem minden évben az előző év már csökkent értékére hat.", "de"), /kumulativ/u);
  assert.equal(api.translate(page, "Vásárlóerő-csökkenés: 250 000 Ft", "en"), "Decrease in purchasing power: 250 000 HUF");
  assert.equal(api.translate(page, "60. év", "en"), "Year 60");
  assert.equal(api.translate(page, "not a source phrase", "en"), null);
});

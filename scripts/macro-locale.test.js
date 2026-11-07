"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/macro-locale");
const page = "makro-kalkulator";
test("macro form, guidance, FAQ, safety and metadata translate and restore", () => {
  assert.equal(translate(page, "Makró kalkulátor", "en"), "Macro Calculator");
  assert.equal(translate(page, "A rost szénhidrát?", "de"), "Sind Ballaststoffe Kohlenhydrate?");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Macro Calculator", "hu"), "Makró kalkulátor");
  assert.ok(translate(page, "Betegség, terhesség, szoptatás, gyermekkor vagy terápiás étrend esetén a makróelosztás szakember feladata lehet.", "en").includes("qualified professional"));
});
test("macro result labels, gram values and every validation class translate", () => {
  assert.equal(translate(page, "Fehérje:", "en"), "Protein:");
  assert.equal(translate(page, "Zsír:", "de"), "Fett:");
  assert.equal(translate(page, "1 250 g", "en"), "1,250 g");
  assert.equal(translate(page, "1 250 g", "de"), "1.250 g");
  assert.equal(translate(page, "Az értékek legyenek nagyobbak nullánál", "en"), "Values must be greater than zero");
  assert.equal(translate(page, "Az értékek nem lehetnek negatívak", "de"), "Die Werte dürfen nicht negativ sein");
  assert.equal(translate(page, "Minden mezőben érvényes szám szerepeljen", "en"), "Enter a valid number in every field");
  assert.equal(translate(page, "A fehérje és zsír aránya együtt nem lehet 100% felett", "de"), "Protein- und Fettanteil dürfen zusammen 100 % nicht überschreiten");
  const en = new URL(reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor", "en"));
  assert.equal(en.searchParams.get("subject"), "Error report – Macro Calculator");
  assert.ok(en.searchParams.get("body").includes("Brief description"));
});

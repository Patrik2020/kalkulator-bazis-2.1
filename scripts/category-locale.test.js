"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/category-locale");

test("all six category headings have native EN and DE names", () => {
  for (const hu of [
    "Pénzügyi kalkulátorok", "Otthon és felújítás kalkulátorok",
    "Autó és közlekedés kalkulátorok", "Egészség és sport kalkulátorok",
    "Mindennapi kalkulátorok", "Átváltók és mértékegységek"
  ]) {
    const en = api.translate(hu, "en");
    const de = api.translate(hu, "de");
    assert.ok(en && en !== hu, "Missing EN: " + hu);
    assert.ok(de && de !== hu, "Missing DE: " + hu);
  }
});
test("category topics, dynamic counts and 6 topic summaries keep semantics", () => {
  assert.equal(api.translate("Utazás és üzemanyag", "en"), "Travel and fuel");
  assert.equal(api.translate("Testsúly és testösszetétel", "de"), "Gewicht und Körperzusammensetzung");
  assert.equal(api.translate("1 kalkulátor", "en"), "1 calculator");
  assert.equal(api.translate("12 kalkulátor", "en"), "12 calculators");
  assert.equal(api.translate("12 kalkulátor", "de"), "12 Rechner");
  assert.equal(api.translate("12 kalkulátor", "hu"), null);
});
test("unknown descriptions and sensitive explanations stay Hungarian", () => {
  assert.equal(api.translate("Nem lefordított részletes jogi szöveg", "en"), null);
  assert.equal(api.translate("Eredmény: 523 333 Ft", "de"), null);
  assert.equal(api.translate("Átváltók és mértékegységek", "hu"), null);
  for (const [hu, pair] of Object.entries(api.phrases)) {
    assert.ok(hu.length > 2);
    assert.ok(Array.isArray(pair) && pair.length === 2);
    assert.ok(pair.every(x => x.length > 2), hu);
  }
});

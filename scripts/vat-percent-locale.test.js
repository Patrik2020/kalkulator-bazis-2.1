"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/vat-percent-locale");

test("VAT form, 2027 scenario and eligibility caveats have reviewed translations", () => {
  assert.equal(api.translate("vat", "Összeg (Ft)", "en"), "Amount (HUF)");
  assert.equal(api.translate("vat", "ÁFA (%)", "de"), "MwSt. (%)");
  assert.match(api.translate("vat", "A kiválasztott lehetőség számítási forgatókönyv, nem automatikus jogosultságvizsgálat. Az alkalmazandó kulcsot a konkrét ügylet és a hatályos jogszabály alapján ellenőrizni kell.", "en"), /not an automatic eligibility assessment/);
  assert.match(api.translate("vat", "Új lakóingatlan – átmeneti feltételekkel 5%-os számítás", "de"), /Übergangsbedingungen/);
});

test("VAT dynamic lines translate only labels, never amounts or currency", () => {
  for (const [hu, en, de] of [
    ["Nettó: 10 000 Ft", "Net: 10 000 Ft", "Netto: 10 000 Ft"],
    ["Bruttó: 12 700 Ft", "Gross: 12 700 Ft", "Brutto: 12 700 Ft"],
    ["ÁFA (27%): 2 700 Ft", "VAT (27%): 2 700 Ft", "MwSt. (27%): 2 700 Ft"],
    ["ÁFA (18,5%): 1 850,1 Ft", "VAT (18,5%): 1 850,1 Ft", "MwSt. (18,5%): 1 850,1 Ft"],
  ]) {
    assert.equal(api.translate("vat", hu, "en"), en);
    assert.equal(api.translate("vat", hu, "de"), de);
    assert.equal(api.translate("vat", hu, "hu"), null);
  }
  assert.equal(api.translate("vat", "12 700 Ft", "de"), null);
});

test("percentage field labels and validation errors are correctly localized", () => {
  assert.equal(api.translate("percent", "Százalékos növekedés vagy csökkenés", "en"), "Percentage increase or decrease");
  assert.equal(api.translate("percent", "Nullával nem lehet osztani.", "en"), "Cannot divide by zero.");
  assert.equal(api.translate("percent", "A kezdőérték nem lehet nulla.", "de"), "Der Ausgangswert darf nicht null sein.");
  assert.equal(api.translate("percent", "eredeti érték", "de"), "Ausgangswert");
});

test("every translation is a nonblank EN/DE pair and unrelated legal text is not guessed", () => {
  for (const dictionary of [...Object.values(api.dictionaries), api.shared]) {
    for (const [source, pair] of Object.entries(dictionary)) {
      assert.ok(source.length);
      assert.equal(pair.length, 2);
      assert.ok(pair.every(s => s && typeof s === "string"), source);
    }
  }
  assert.equal(api.translate("percent", "Arbitrary Hungarian legal statement", "en"), null);
  assert.equal(api.translate("vat", "Az eredményből számoljon vissza adóigazolást.", "de"), null);
  assert.equal(api.translate("foo", "ÁFA kalkulátor", "en"), null);
});

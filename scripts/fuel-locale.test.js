"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/autos/fuel-locale");

test("fuel calculator pages expose scoped English and German copy", () => {
  assert.deepEqual(api.pages, ["auto-fogyasztas-kalkulator", "uzemanyag-koltseg-kalkulator", "hatotav-kalkulator"]);
  assert.equal(api.translate("auto-fogyasztas-kalkulator", "Tankolt mennyiség (l)", "en"), "Fuel added (L)");
  assert.equal(api.translate("uzemanyag-koltseg-kalkulator", "Fogyasztás (l/100 km)", "de"), "Verbrauch (l/100 km)");
  assert.equal(api.translate("other-page", "Tankolt mennyiség (l)", "en"), null);
  assert.equal(api.translate("auto-fogyasztas-kalkulator", "Tankolt mennyiség (l)", "hu"), null);
});

test("fuel results retain numeric values and units in both languages", () => {
  const cases = [
    ["Átlagfogyasztás: 6,5 l/100 km", "Average fuel consumption: 6,5 l/100 km", "Durchschnittsverbrauch: 6,5 l/100 km"],
    ["Szükséges üzemanyag: 15,6 l", "Fuel required: 15,6 l", "Benötigter Kraftstoff: 15,6 l"],
    ["Várható költség: 9 984 Ft", "Estimated cost: 9 984 Ft", "Voraussichtliche Kosten: 9 984 Ft"]
  ];
  for (const [source, en, de] of cases) {
    assert.equal(api.translate("uzemanyag-koltseg-kalkulator", source, "en"), en);
    assert.equal(api.translate("uzemanyag-koltseg-kalkulator", source, "de"), de);
  }
});

test("multiline copy is normalized and Hungarian content is restored safely", () => {
  assert.match(api.translate("auto-fogyasztas-kalkulator", "Tedd el a Kalkulátor Bázist, hogy legközelebb egy mozdulattal visszatalálj\n ehhez a számításhoz – vagy oszd meg azzal, akinek szintén jól jöhet.", "en"), /^Save Kalkulátor Bázis/u);
  assert.equal(api.translate("auto-fogyasztas-kalkulator", "6,5 l/100 km", "en"), null);
});

test("shared auto and partner copy is translated in both calculator scopes", () => {
  for (const page of api.pages) {
    assert.equal(api.translate(page, "Hirdetés", "en"), "Advertisement");
    assert.equal(api.translate(page, "Utazást tervezel és devizában fizetnél?", "de"), "Planst du eine Reise und möchtest in einer Fremdwährung bezahlen?");
  }
});

test("range calculator translates guidance and keeps the result unit unchanged", () => {
  assert.ok(api.pages.includes("hatotav-kalkulator"));
  assert.equal(api.translate("hatotav-kalkulator", "Üzemanyag a tankban (l)", "en"), "Fuel in tank (L)");
  assert.equal(api.translate("hatotav-kalkulator", "Biztonsági tartalék (%)", "de"), "Sicherheitsreserve (%)");
  assert.match(api.translate("hatotav-kalkulator", "A kijelzett vagy számolt hatótáv optimális becslés.\n      Tervezéshez érdemes külön tartalékot hagyni forgalomra, kerülőre, hidegre vagy váratlan fogyasztásnövekedésre.", "en"), /^The displayed or calculated range is an optimistic estimate/u);
  assert.equal(api.translate("hatotav-kalkulator", "500 km", "en"), null);
});

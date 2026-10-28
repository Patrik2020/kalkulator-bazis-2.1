"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/autos/fuel-locale");

test("fuel calculator pages expose scoped English and German copy", () => {
  assert.deepEqual(api.pages, ["auto-fogyasztas-kalkulator", "uzemanyag-koltseg-kalkulator", "hatotav-kalkulator", "tankolas-kalkulator", "autopalyadij-kalkulator"]);
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
  assert.equal(api.translate("hatotav-kalkulator", "Autófogyasztás", "en"), "Car fuel consumption");
  assert.equal(api.translate("hatotav-kalkulator", "538 km", "de"), "538 km");
  assert.match(api.translate("hatotav-kalkulator", "A kijelzett vagy számolt hatótáv optimális becslés.\n      Tervezéshez érdemes külön tartalékot hagyni forgalomra, kerülőre, hidegre vagy váratlan fogyasztásnövekedésre.", "en"), /^The displayed or calculated range is an optimistic estimate/u);
  assert.equal(api.translate("hatotav-kalkulator", "500 km", "en"), null);
});

test("refuelling budget page translates both calculator panels", () => {
  assert.equal(api.translate("tankolas-kalkulator", "Tankolási keret (Ft)", "en"), "Refuelling budget (HUF)");
  assert.equal(api.translate("tankolas-kalkulator", "Liter kedvezménnyel", "de"), "Liter mit Rabatt");
  assert.equal(api.translate("tankolas-kalkulator", "Tankolható mennyiség:", "en"), "Fuel you can buy:");
  assert.match(api.translate("tankolas-kalkulator", ". Ha 20 000 Ft-ot szánsz tankolásra, és az üzemanyag ára 640 Ft/l, akkor 20 000 / 640 = 31,25 liter jön ki. A megjelenített eredmény egy tizedesre kerekítve 31,3 liter.", "en"), /^\. If you set aside HUF 20,000/u);
  assert.equal(api.translate("tankolas-kalkulator", "10 000 Ft", "en"), null);
});

test("toll-splitting page translates its calculator and vignette comparison", () => {
  assert.equal(api.translate("autopalyadij-kalkulator", "Autópályadíj (Ft)", "en"), "Road toll (HUF)");
  assert.equal(api.translate("autopalyadij-kalkulator", "Egy főre jutó díj:", "de"), "Kosten pro Person:");
  assert.equal(api.translate("autopalyadij-kalkulator", "Matricaválasztás nullszaldó", "en"), "Vignette break-even comparison");
  assert.equal(api.translate("autopalyadij-kalkulator", "1 655 Ft", "en"), "HUF 1,655");
  assert.match(api.translate("autopalyadij-kalkulator", ", és nem választja ki automatikusan a megfelelő magyar vagy külföldi úthasználati jogosultságot. A megadott teljes összeget osztja el a résztvevők között.", "en"), /^, and it does not automatically select/u);
  assert.equal(api.translate("autopalyadij-kalkulator", "6 620 Ft", "en"), null);
});

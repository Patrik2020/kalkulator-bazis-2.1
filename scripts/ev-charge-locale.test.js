"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/autos/ev-charge-locale");
const { evToltesiKoltseg } = require("../js/expansion-batch-01-calculators");
const page = "ev-toltesi-koltseg-kalkulator";

test("EV charging copy keeps terms and formula consistent in both languages", () => {
  assert.equal(translate(page, "Jármű energiaigénye:", "en"), "Energy used by the vehicle:");
  assert.equal(translate(page, "Hálózatból felvett energia:", "de"), "Strombezug aus dem Netz:");
  assert.equal(translate(page, "hálózati energia = járműenergia / 0,90", "en"), "grid electricity = vehicle energy / 0.90");
  assert.ok(translate(page, "Otthoni töltésnél azt a tényleges egységárat érdemes megadni, amely a saját tarifád mellett az adott fogyasztásra vonatkozik. Nyilvános töltésnél az aktuális szolgáltatói kWh-díj használható, de ha indítási, percdíjas vagy egyéb tétel is van, azt a kalkulátor jelenlegi egyszerű modellje nem adja hozzá.", "de").includes("Zusatzgebühren"));
  assert.equal(translate(page, "A fedélzeti kijelző fogyasztását írjam be?", "de"), "Soll ich den Verbrauch aus dem Bordcomputer eingeben?");
  assert.equal(translate(page, "hu-HU", "en"), "en-GB");
  assert.equal(translate(page, "EV Charging Cost Calculator", "hu"), "Elektromos autó töltési költség kalkulátor");
  assert.equal(translate(page, "Gyakori kérdések", "de"), "Häufige Fragen");
});

test("dynamic numbers and every input validation have localized forms", () => {
  assert.deepEqual(evToltesiKoltseg(100, 18, 70, 10), { vehicleKwh: 18, gridKwh: 20, totalCost: 1400, costPer100Km: 1400 });
  for (const source of ["Távolság: adj meg érvényes számot.", "Távolság: az érték legyen nagyobb nullánál.",
    "Fogyasztás: adj meg érvényes számot.", "Fogyasztás: az érték legyen nagyobb nullánál.",
    "Villamosenergia-ár: adj meg érvényes számot.", "Villamosenergia-ár: az érték nem lehet negatív.",
    "Töltési veszteség: adj meg érvényes számot.", "Töltési veszteség: az érték nem lehet negatív.",
    "A töltési veszteség 100%-nál kisebb legyen.", "Adj meg érvényes adatokat a számításhoz."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "1 400 Ft", "en"), "1,400 HUF");
  assert.equal(translate(page, "1 400 Ft", "de"), "1.400 HUF");
  assert.equal(translate(page, "20 kWh", "en"), "20 kWh");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Ladekostenrechner für Elektroautos");
  assert.equal(reportHref(original, "hu"), original);
});

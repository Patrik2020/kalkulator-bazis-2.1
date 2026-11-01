"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/autos/kilometre-cost-locale");
const page = "kilometerdij-kalkulator";

test("cost per kilometre copy distinguishes full, variable and marginal costs", () => {
  assert.equal(translate(page, "Kilométerdíj kalkulátor", "en"), "Cost per Kilometre Calculator");
  assert.equal(translate(page, "Teljes Ft/km", "de"), "Gesamtkosten pro Kilometer");
  assert.ok(translate(page, "Ha az autó már amúgy is megvan, egy plusz út döntésénél nem biztos, hogy minden éves fix tételt újra figyelembe akarsz venni.", "en").includes("additional trip"));
  assert.ok(translate(page, "Csak azonos időszakból származó éves költséget és futást hasonlíts össze. Céges vagy adózási kilométer-elszámoláshoz ne ezt az eredményt tekintsd hivatalos díjnak; ott az aktuális jogszabály és NAV-szabály az irányadó.", "de").includes("NAV"));
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Hirdetés", "en"), "Advertisement");
  assert.equal(translate(page, "Cost per Kilometre Calculator", "hu"), "Kilométerdíj kalkulátor");
});

test("dynamic results, validation, report link and units are localized", () => {
  for (const source of ["Teljes költség", "Vizsgált út költsége", "Egy főre",
    "A költség és a távolság adatai nem lehetnek negatívak; az éves futás legyen pozitív.",
    "Az utasok száma pozitív egész szám legyen.", "Ellenőrizd a kötelező mezőket és az értékhatárokat."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "80 Ft/km", "en"), "80 HUF/km");
  assert.equal(translate(page, "16 000 Ft", "en"), "16,000 HUF");
  assert.equal(translate(page, "16 000 Ft", "de"), "16.000 HUF");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  const de = new URL(reportHref(original, "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Kilometerkostenrechner");
  assert.ok(de.searchParams.get("body").includes("Kurze Beschreibung des Fehlers"));
  assert.equal(reportHref(original, "hu"), original);
});

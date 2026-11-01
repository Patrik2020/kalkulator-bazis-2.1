"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/autos/annual-car-cost-locale");
const page = "eves-auto-koltseg-kalkulator";

test("annual car costs distinguish cash flow, depreciation and financing", () => {
  assert.equal(translate(page, "Éves autóköltség kalkulátor", "en"), "Annual Car Cost Calculator");
  assert.equal(translate(page, "Értékvesztés évente", "de"), "Wertverlust pro Jahr");
  assert.ok(translate(page, "Összehasonlításnál minden autónál azonos költségkört használj. Az értékvesztés gazdasági költség, de nem feltétlenül az adott évben kifizetett készpénz; finanszírozási kamatot vagy más, külön nem szereplő tételt csak akkor hasonlíts össze, ha mindkét autónál ugyanúgy kezeled.", "en").includes("economic cost"));
  assert.ok(translate(page, "Az értékvesztés nem számla, de az autó vagyonértékének csökkenése miatt a teljes birtoklási költség része.", "de").includes("Wertverlust"));
  assert.equal(translate(page, "A hiteltörlesztő teljes összege költség?", "en"), "Is the whole loan payment a cost?");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Gyakori kérdések", "de"), "Häufige Fragen");
  assert.equal(translate(page, "Hirdetés", "en"), "Advertisement");
  assert.equal(translate(page, "Hirdetés", "de"), "Anzeige");
  assert.equal(translate(page, "Annual Car Cost Calculator", "hu"), "Éves autóköltség kalkulátor");
});

test("results, invalid inputs, report link and numeric units", () => {
  for (const source of ["Üzemanyag", "Egyéb éves költség + értékvesztés", "Éves teljes gazdasági költség", "Havi átlag", "Teljes költség kilométerenként", "Az éves futás legyen nagyobb nullánál.", "A fogyasztás és a költségek nem lehetnek negatívak.", "Ellenőrizd a kötelező mezőket és az értékhatárokat."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "1 594 500 Ft", "en"), "1,594,500 HUF");
  assert.equal(translate(page, "106,3 Ft/km", "en"), "106.3 HUF/km");
  assert.equal(translate(page, "106,3 Ft/km", "de"), "106,3 HUF/km");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  const de = new URL(reportHref(original, "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Rechner für jährliche Autokosten");
  assert.ok(de.searchParams.get("body").includes("Kurze Beschreibung des Fehlers"));
  assert.equal(reportHref(original, "hu"), original);
});

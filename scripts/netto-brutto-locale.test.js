"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/penzugyi/netto-brutto-locale");

test("the detailed salary page exposes scoped locale coverage and translates its expanded guidance", () => {
  const page = "netto-brutto-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "Nettó–bruttó kalkulátor 2026", "en"), "Gross to net salary calculator 2026");
  assert.match(api.translate(page, "Állást váltanál, de az ajánlatban csak a bruttó bér szerepel? Írd be az összeget a kalkulátorba. Az eredmény mellett külön látod az SZJA-t, a TB-járulékot és a becsült teljes munkáltatói költséget, így követhető, hogyan jutottunk el a nettóig.", "en"), /Changing jobs, but the offer lists only gross pay/u);
  assert.match(api.translate(page, "Ha a családi kedvezményt megosztjátok, egyeztessétek, ki mekkora részt érvényesít. A kalkulátor nem kér be megosztási arányt; az eredményt ehhez külön ellenőrizni kell.", "de"), /Familienvergünstigung aufteilt/u);
  assert.equal(api.translate(page, "Bruttó fizetés: 500 000 Ft", "en"), "Gross salary: 500 000 Ft");
  assert.equal(api.translate("another-page", "Bruttó fizetés: 500 000 Ft", "en"), null);
});

test("salary form controls and legal comparison disclaimer are accurately translated", () => {
  assert.equal(api.translate("Bruttóból nettó", "en"), "Gross to net");
  assert.equal(api.translate("Nettóból bruttó", "de"), "Netto zu Brutto");
  assert.equal(api.translate("15% – 2026-os szabály", "en"), "15% – 2026 rate");
  assert.match(api.translate("A 9%-os opció összehasonlító számítás. Nem a 2026-os hatályos SZJA-kulcs, és nem a végleges 2027-es szabálymodell.", "de"), /nur zum Vergleich/);
  assert.equal(api.translate("9% – összehasonlítás", "en"), "9% – comparison only");
});

test("result labels translate without altering numbers, units or tax percentages", () => {
  const cases = [
    ["Bruttó fizetés: 500 000 Ft", "Gross salary: 500 000 Ft", "Bruttogehalt: 500 000 Ft"],
    ["Fizetendő TB-járulék: 92 500 Ft", "Employee social security contributions: 92 500 Ft", "Arbeitnehmer-Sozialversicherungsbeiträge: 92 500 Ft"],
    ["Fizetendő SZJA (15%): 75 000 Ft", "Income tax payable (15%): 75 000 Ft", "Zu zahlende Einkommensteuer (15%): 75 000 Ft"],
    ["Becsült nettó: 332 500 Ft (cél: 332 500 Ft)", "Estimated net pay: 332 500 Ft (target: 332 500 Ft)", "Geschätztes Nettogehalt: 332 500 Ft (Ziel: 332 500 Ft)"]
  ];
  for (const [hu, en, de] of cases) {
    assert.equal(api.translate(hu, "en"), en, hu);
    assert.equal(api.translate(hu, "de"), de, hu);
    assert.equal(api.translate(hu, "hu"), null, hu);
  }
});

test("errors translate while unreviewed Hungarian legal warnings remain Hungarian", () => {
  assert.equal(api.translate("Számítás…", "en"), "Calculating…");
  assert.match(api.translate("Most nem sikerült a számítás", "de"), /Berechnung/);
  assert.equal(api.translate("Az adóhatóság hivatalos közleménye.", "en"), null);
  assert.equal(api.translate("9%-os összehasonlító számítás – nem a hatályos 2026-os és nem a végleges 2027-es adószabály.", "de"), null);
  assert.equal(api.translate("199 500 Ft", "en"), null);
});
test("net salary page recommendations, retention controls and contextual notices are translated", () => {
  const page = "netto-brutto-kalkulator";
  const cases = [
    ["Havi költségvetés", "Monthly budget", "Monatsbudget"],
    ["Nettó - bruttó kalkulátor", "Net-to-gross salary calculator", "Netto-Brutto-Rechner"],
    ["Hirdetés", "Advertisement", "Anzeige"],
    ["Az eredmény után", "After your result", "Nach deinem Ergebnis"],
    ["Kapcsolódó friss hírek", "Related news", "Passende aktuelle Meldungen"],
    ["Külföldről kapsz fizetést vagy több pénznemben kezelnéd a pénzed?", "Paid from abroad or managing money in several currencies?", "Wirst du aus dem Ausland bezahlt oder verwaltest du Geld in mehreren Währungen?"],
    ["a kalkulátor a közzétett NAV és hivatalos adózási információk alapján készült. Az eredmény tájékoztató jellegű, nem minősül adó- vagy bérszámfejtési tanácsadásnak.", "The calculator is based on published NAV and official tax information. The result is for guidance only and is not tax or payroll advice.", "Der Rechner basiert auf veröffentlichten NAV- und offiziellen Steuerinformationen. Das Ergebnis dient nur zur Orientierung und ist keine Steuer- oder Lohnabrechnungsberatung."]
  ];
  for (const [hu, en, de] of cases) {
    assert.equal(api.translate(page, hu, "en"), en, hu);
    assert.equal(api.translate(page, hu, "de"), de, hu);
  }
});

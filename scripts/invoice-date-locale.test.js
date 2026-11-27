"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/penzugyi/szamlazasi/invoice-date-locale");

test("payment deadline guidance is available in English and German", () => {
  const page = "fizetesi-hatarido-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(
    api.translate(page, "Fizetési határidő kalkulátor 2026 – naptári és munkanap", "en"),
    "Payment Due Date Calculator 2026 – Calendar and Working Days"
  );
  assert.equal(
    api.translate(page, "Fizetési határidő kalkulátor 2026 számlákhoz és szerződésekhez. Számolj naptári vagy munkanapokkal a magyar munkarend alapján.", "de"),
    "Zahlungsfristrechner für Rechnungen und Verträge im Jahr 2026. Rechne mit Kalender- oder Arbeitstagen anhand des ungarischen Arbeitskalenders."
  );
  assert.equal(
    api.translate(page, "Fizetési határidő kiszámítása számlázáshoz.", "en"),
    "Calculate the payment due date for an invoice."
  );
  assert.equal(api.translate(page, "Naptári napok", "en"), "Calendar days");
  assert.equal(api.translate(page, "Munkanapok", "de"), "Arbeitstage");
  assert.match(api.translate(page, "A támogatott 2026-os naptárnál igen, a beépített munkarend szerint. Más évnél a kalkulátor működését külön ellenőrizd.", "en"), /supported 2026 calendar/);
  assert.match(api.translate(page, "Az, hogy a teljesítés ilyenkor mikor minősül határidőben megtörténtnek, az alkalmazandó jogi vagy szerződéses szabálytól függhet.", "de"), /gesetzlichen oder vertraglichen Regel/);
  assert.equal(api.translate(page, "2026. augusztus 8.", "en"), "8 August 2026");
  assert.equal(api.translate(page, "2026. 01. 10.", "de"), "10. Januar 2026");
  assert.equal(api.translate(page, "2026. november 2., hétfő", "en"), "Monday, 2 November 2026");
  assert.equal(api.translate(page, "8 nap", "en"), "8 days");
});

test("invoice tax point guidance preserves the Hungarian legal scope and calculation wording", () => {
  const page = "szamla-teljesites-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "Áfa szerinti teljesítési időpont:", "en"), "VAT tax point:");
  assert.match(api.translate(page, "ez a rész a tipikus 58. § (1)–(1a) szerinti esetet modellezi. Nem helyettesíti a különleges, hosszú elszámolási időszakokra, Közösségen belüli ügyletekre, fordított adózásra, előlegre, részteljesítésre vagy módosító számlára vonatkozó szabályok vizsgálatát.", "de"), /Reverse-Charge-Umsätze.*Anzahlungen.*Teilleistungen/u);
  assert.equal(api.translate(page, "A teljesítés és a kiállítás dátuma eltér.", "en"), "The tax point and invoice issue date are different.");
  assert.match(api.translate(page, "A fizetési esedékesség az időszak vége utánra, de 60 napon belülre esik, ezért a teljesítés a fizetési esedékesség napja.", "en"), /within 60 days.*payment due date/u);
  assert.equal(api.translate(page, "2026. július 15.", "de"), "15. Juli 2026");
  assert.equal(api.translate(page, "Nem létező mondat", "en"), null);
});

test("invoice tax point metadata and schema descriptions are localized", () => {
  const page = "szamla-teljesites-kalkulator";
  const description = "Teljesítési dátum és folyamatos teljesítés kalkulátor számlákhoz: számold ki az időszakos elszámolás tipikus teljesítési időpontját az Áfa tv. 58. § szerint.";
  assert.match(api.translate(page, description, "en"), /periodic settlement under Section 58/u);
  assert.match(api.translate(page, description, "de"), /periodischen Abrechnung nach § 58/u);
  assert.equal(api.translate(page, "Számla teljesítési dátumának kiszámítása.", "en"), "Calculate the invoice tax point.");
  assert.equal(api.translate(page, "Számla teljesítési dátumának kiszámítása.", "de"), "Berechne das Leistungsdatum der Rechnung.");
  assert.equal(api.translate(page, description, "hu"), null);
});

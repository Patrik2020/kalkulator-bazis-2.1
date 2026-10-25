"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/monthly-budget-locale");

test("monthly budget page translates its headings, guidance and methodology", () => {
  const page = "havi-koltsegvetes-kalkulator";
  assert.deepEqual(api.pages, [page]);
  assert.equal(api.translate(page, "Havi költségvetés kalkulátor", "en"), "Monthly budget calculator");
  assert.equal(api.translate(page, "Havi nettó bevétel (Ft)", "de"), "Monatliches Nettoeinkommen (HUF)");
  assert.equal(api.translate("Havi költségvetés kalkulátor", "en"), "Monthly budget calculator");
  assert.match(api.translate(page, "A számítás menete", "en"), /calculation works/);
  assert.equal(api.translate(page, "A hitelkártyás vásárlást mikor számoljam el?", "de"), "Wann sollte ich einen Kreditkartenkauf erfassen?");
  assert.equal(api.translate(page, "2026. július 15.", "en"), "15 July 2026");
});

test("budget outputs localize labels and currency while preserving amounts", () => {
  const page = "havi-koltsegvetes-kalkulator";
  assert.equal(api.translate(page, "Összes kiadás megtakarítással együtt: 685 000 Ft", "en"), "Total expenses including savings: 685 000 HUF");
  assert.equal(api.translate(page, "Megtakarítási arány: 12,5%", "de"), "Sparquote: 12,5%");
  assert.equal(api.translate(page, "Havi maradvány:", "en"), "Monthly remainder:");
  assert.equal(api.translate(page, "Összes kiadás:", "de"), "Gesamtausgaben:");
  assert.equal(api.translate(page, "270 000 Ft", "en"), "270 000 HUF");
  assert.equal(api.translate(page, "Lakhatás", "en"), "Housing");
  assert.equal(api.translate(page, "pl. 550 000", "de"), "z. B. 550.000");
  assert.equal(api.translate(page, "Részletesebb, ismeretlen szöveg", "en"), null);
});

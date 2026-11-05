"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, localizeReportHref } = require("../js/epitoipari/insulation-locale.js");
const page = "hoszigeteles-kalkulator";

test("insulation form, guide, FAQ, quality copy and metadata are translated", () => {
  assert.equal(translate(page, "Konkrét termék csomagfedése (m²/csomag)", "en"), "Selected product coverage (m²/pack)");
  assert.equal(translate(page, "Megmondja a szükséges vastagságot?", "de"), "Ermittelt er die erforderliche Dicke?");
  assert.equal(translate(page, "Hőszigetelés kalkulátor | Anyagmennyiség és csomagszám", "en"), "Insulation Calculator | Material Quantity and Packs");
  assert.equal(translate(page, "Gyártói adatlap az elsődleges.", "de"), "Das Herstellerdatenblatt ist maßgeblich.");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Hőszigetelés kalkulátor", "hu"), null);
});

test("dynamic insulation results and validation retain their meaning", () => {
  assert.equal(translate(page, "88,56 m²", "en"), "88.56 m²");
  assert.equal(translate(page, "88,56 m²", "de"), "88,56 m²");
  assert.equal(translate(page, "18 db", "en"), "18 pcs");
  assert.equal(translate(page, "328–492 kg", "de"), "328–492 kg");
  assert.equal(translate(page, "Teljes felület: adj meg nullánál nagyobb értéket.", "en"), "Total area: enter a value greater than zero.");
  assert.equal(translate(page, "A nettó szigetelendő felületnek pozitívnak kell maradnia.", "de"), "Die Netto-Dämmfläche muss positiv bleiben.");
  const de = new URL(localizeReportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Dämmstoff-Rechner");
});

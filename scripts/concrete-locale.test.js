"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate } = require("../js/epitoipari/beton-locale.js");
const page = "beton-kalkulator";

test("concrete calculator labels and volume guidance are translated", () => {
  assert.equal(translate(page, "Beton kalkulátor – köbméter és anyagszükséglet számítás", "en"), "Concrete Calculator – Volume and Material Estimate");
  assert.equal(translate(page, "Hossz (m)", "de"), "Länge (m)");
  assert.equal(translate(page, "Köbméter számítás 1 m² felülethez", "en"), "Calculating cubic metres for a 1 m² area");
  assert.equal(translate(page, "Szerkezeti betonozásnál a vastagság, vasalás, betonminőség és kivitelezés szakmai kérdés. A kalkulátor mennyiségi becslésre való, nem statikai tervezésre.", "de"), "Bei tragenden Betonarbeiten sind Dicke, Bewehrung, Betongüte und Ausführung fachlich zu beurteilen. Dieser Rechner schätzt Mengen und ersetzt keine statische Planung.");
});

test("dynamic cubic metre values keep numbers and translate litre units", () => {
  assert.equal(translate(page, "10,00 m³", "en"), "10,00 m³");
  assert.equal(translate(page, "0,050 m³ (50 liter)", "en"), "0,050 m³ (50 litres)");
  assert.equal(translate(page, "0,050 m³ (50 liter)", "de"), "0,050 m³ (50 Liter)");
  assert.equal(translate(page, "10 m³", "hu"), null);
});

test("concrete order guidance, FAQ and related calculators are translated", () => {
  assert.equal(translate(page, "Rendelendő mennyiség tartalékkal", "en"), "Order quantity including allowance");
  assert.equal(translate(page, "Készbeton rendeléshez elég?", "de"), "Reicht das für eine Bestellung von Transportbeton?");
  assert.equal(translate(page, "Kapcsolódó kalkulátorok", "en"), "Related calculators");
});

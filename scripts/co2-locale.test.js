"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/autos/co2-locale");

test("CO2 page copy is available in English and German and scoped", () => {
  assert.deepEqual(api.pages, ["co2-kibocsatas-kalkulator"]);
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "Hajtás", "en"), "Powertrain");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "Hajtás", "de"), "Antrieb");
  assert.equal(api.translate("other-page", "Hajtás", "en"), null);
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "Hajtás", "hu"), null);
});

test("dynamic calculation labels, validation errors and energy lines are translated without changing figures", () => {
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "Közvetlen használati kibocsátás", "en"), "Direct use-phase emissions");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "A távolság legyen nagyobb nullánál.", "de"), "Die Strecke muss größer als null sein.");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "3,25 l üzemanyag + 9,00 kWh akkumulátoroldali energia", "en"), "3,25 L fuel + 9,00 kWh battery energy");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "6,50 l üzemanyag", "de"), "6,50 L Kraftstoff");
});

test("guidance, FAQ and metadata copy have complete translations", () => {
  assert.match(api.translate("co2-kibocsatas-kalkulator", "A kalkulátor a megtett távolságból és a megadott fogyasztási/kibocsátási tényezőkből két külön eredményt készít: közvetlen használati kibocsátást, valamint egy energiaellátási tényezőkkel bővített becslést. Elektromos autónál a helyi közvetlen CO₂ nulla; PHEV-nél a folyékony üzemanyag és az elektromos ág külön fogyasztással számol.", "en"), /two results/u);
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "A klíma hatása benne van?", "de"), "Ist der Einfluss der Klimaanlage enthalten?");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "hu-HU", "de"), "de-DE");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "CO2 kibocsátás kalkulátor", "en"), "Car CO₂ emissions calculator");
});

test("dynamically inserted related calculator cards are localized", () => {
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "Autó fogyasztás kalkulátor", "en"), "Fuel consumption calculator");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "Számold ki egy út várható üzemanyagköltségét.", "de"), "Berechne die voraussichtlichen Kraftstoffkosten einer Fahrt.");
  assert.equal(api.translate("co2-kibocsatas-kalkulator", "Becsüld meg, hány kilométert tehetsz meg a tankban lévő üzemanyaggal.", "en"), "Estimate how far you can travel with the fuel in your tank.");
});

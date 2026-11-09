"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/step-distance-locale");
const page = "lepesszam-tavolsag-kalkulator";
test("steps page, guide, FAQ and metadata translate and restore", () => {
  assert.equal(translate(page, "Lépésszám–távolság kalkulátor", "en"), "Steps to Distance Calculator");
  assert.equal(translate(page, "Futáshoz is használható?", "de"), "Kann ich ihn auch zum Laufen verwenden?");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Steps to Distance Calculator", "hu"), "Lépésszám–távolság kalkulátor");
});
test("dynamic values, result labels, all validation classes and report link", () => {
  assert.equal(translate(page, "Becsült távolság:", "en"), "Estimated distance:");
  assert.equal(translate(page, "7,5 km", "en"), "7.5 km");
  assert.equal(translate(page, "90,9 perc", "de"), "90,9 min");
  assert.equal(translate(page, "4,95 km/h", "en"), "4.95 km/h");
  assert.equal(translate(page, "0 perc", "en"), "0 min");
  assert.equal(translate(page, "A lépésszám egész szám legyen.", "de"), "Die Schrittzahl muss eine ganze Zahl sein.");
  assert.equal(translate(page, "Lépésszám: az érték nem lehet negatív.", "en"), "Step count: the value cannot be negative.");
  assert.equal(translate(page, "Lépéshossz: az érték legyen nagyobb nullánál.", "de"), "Schrittlänge: Der Wert muss größer als null sein.");
  assert.equal(translate(page, "Lépésszám percenként: adj meg érvényes számot.", "en"), "Steps per minute: enter a valid number.");
  const en = new URL(reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "en"));
  assert.equal(en.searchParams.get("subject"), "Error report – Steps to Distance Calculator");
});

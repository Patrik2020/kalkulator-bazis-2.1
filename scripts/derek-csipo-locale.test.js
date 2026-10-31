"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/egeszseg/derek-csipo-locale");
const page = "derek-csipo-kalkulator";

test("WHR inputs, guide, FAQ, metadata and structured language are translated", () => {
  assert.equal(translate(page, "Derékbőség (cm)", "en"), "Waist circumference (cm)");
  assert.equal(translate(page, "Terhesség alatt használható?", "de"), "Kann ich den Rechner in der Schwangerschaft nutzen?");
  assert.equal(translate(page, "Derék–csípő arány kalkulátor | WHR értelmezéssel", "en"), "Waist-to-Hip Ratio Calculator | WHR Explained");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Testzsír százalék kalkulátor", "en"), "Body Fat Percentage Calculator");
  assert.equal(translate(page, "Becsüld meg az ideális testsúlyt magasság és nem alapján.", "de"), "Schätze einen Gewichtsbereich anhand von Größe und Geschlecht.");
  for (const source of [
    "Ideális testsúly kalkulátor", "Testtömegindex kiszámítása testsúly és magasság alapján.",
    "Becsüld meg a testzsírszázalékot derék, nyak, csípő és magasság alapján."
  ]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "Derékbőség (cm)", "hu"), null);
});

test("dynamic WHR results and error messages retain thresholds and meaning", () => {
  for (const [source, english, german] of [
    ["Derék-csípő arány", "Waist-to-hip ratio", "Taille-Hüfte-Verhältnis"],
    ["Derék-csípő arány:", "Waist-to-hip ratio:", "Taille-Hüfte-Verhältnis:"],
    ["WHO általános küszöbéhez viszonyítva", "Compared with the general WHO threshold", "Vergleich mit dem allgemeinen WHO-Schwellenwert"],
    ["WHO általános küszöbéhez viszonyítva:", "Compared with the general WHO threshold:", "Vergleich mit dem allgemeinen WHO-Schwellenwert:"],
    ["Használt tájékoztató küszöb:", "Indicative threshold used:", "Verwendeter Orientierungswert:"],
    ["a küszöb felett", "above the threshold", "über dem Schwellenwert"],
    ["a küszöbön vagy alatta", "at or below the threshold", "am oder unter dem Schwellenwert"],
    ["Az értékek legyenek nagyobbak nullánál", "Values must be greater than zero.", "Die Werte müssen größer als null sein."],
    ["Minden mezőben érvényes szám szerepeljen", "Enter a valid number in every field.", "Gib in jedem Feld eine gültige Zahl ein."]
  ]) {
    assert.equal(translate(page, source, "en"), english);
    assert.equal(translate(page, source, "de"), german);
  }
  assert.equal(translate(page, "0,82", "en"), "0.82");
  assert.equal(translate(page, "0,85", "de"), null);
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hiba&body=Kalkul%C3%A1tor%3A%20WHR";
  const de = new URL(reportHref(original, "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Taille-Hüfte-Rechner");
  assert.ok(de.searchParams.get("body").includes("Kurze Beschreibung des Fehlers"));
  assert.equal(reportHref(original, "hu"), original);
});

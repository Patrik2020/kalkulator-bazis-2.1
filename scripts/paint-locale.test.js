"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, localizeReportHref } = require("../js/epitoipari/festek-locale.js");
const page = "festek-kalkulator";

test("paint inputs, guidance, FAQs, metadata and quality panel translate", () => {
  for (const source of ["Festék kalkulátor", "Festék ára (Ft/liter)", "Festékmennyiség számítása felújítás előtt",
    "Mennyi ráhagyással számoljak?", "Fedőképesség-valóságteszt", "Alapozó nem festékpótlék.", "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "en"), "en-GB");
  assert.equal(translate(page, "Paint Calculator", "hu"), "Festék kalkulátor");
});

test("dynamic areas, paint quantities, cost and errors use locale formatting", () => {
  assert.equal(translate(page, "48,60 m²", "en"), "48.60 m²");
  assert.equal(translate(page, "64,60 m²", "de"), "64,60 m²");
  assert.equal(translate(page, "12,92 liter", "en"), "12.92 litres");
  assert.equal(translate(page, "15 liter", "de"), "15 Liter");
  assert.equal(translate(page, "37\u00a0500 Ft", "en"), "37,500 HUF");
  assert.equal(translate(page, "2 × 10 l", "de"), "2 × 10 l");
  assert.equal(translate(page, "A nyílászárók összes területe nem lehet nagyobb a négy fal teljes felületénél.", "en"), "The total window and door area cannot exceed the area of the four walls.");
});

test("error-report email follows the selected language", () => {
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  assert.equal(new URL(localizeReportHref(source, "en")).searchParams.get("subject"), "Error report – Paint Calculator");
  assert.ok(new URL(localizeReportHref(source, "de")).searchParams.get("body").includes("Rechner: Farbrechner"));
  assert.equal(localizeReportHref(source, "hu"), source);
});

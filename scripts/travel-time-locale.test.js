"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/autos/travel-time-locale");
const page = "utazasi-ido-kalkulator";

test("travel time guidance, FAQ, quality block and metadata translate", () => {
  for (const source of ["Utazási idő kalkulátor", "A képlet", "Oda-vissza útra mit adjak meg?",
    "Kerékpáros útra is használható?", "A +10 km/h nem mindig ugyanannyi percet nyer",
    "Az eredmény a megadott fogyasztási, ár- és útadatokból készülő becslés. A tényleges értéket a vezetési körülmények, a jármű állapota és a díjak változása is módosíthatja.",
    "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Travel Time Calculator", "hu"), "Utazási idő kalkulátor");
});

test("duration and error messages preserve numerical results", () => {
  assert.equal(translate(page, "1 óra 39 perc", "en"), "1 h 39 min");
  assert.equal(translate(page, "1 óra 39 perc", "de"), "1 Std. 39 Min.");
  assert.equal(translate(page, "2 ó 50 p", "en"), "2 h 50 min");
  assert.equal(translate(page, "17 perc", "de"), "17 Min.");
  assert.equal(translate(page, "Minden mezőben érvényes szám szerepeljen", "en"), "Enter a valid number in every field.");
  assert.equal(translate(page, "Az értékek legyenek nagyobbak nullánál", "de"), "Die Werte müssen größer als null sein.");
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Kalkul%C3%A1tor";
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Fahrzeitrechner");
  assert.ok(new URL(reportHref(original, "en")).searchParams.get("body").includes("Travel Time Calculator"));
  assert.equal(reportHref(original, "hu"), original);
});

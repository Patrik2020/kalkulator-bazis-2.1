"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/epitoipari/skirting-locale");
const page = "szegolec-kalkulator";

test("skirting page, guidance, FAQ and metadata translate and restore", () => {
  for (const source of ["Szegőléc kalkulátor", "Hogyan számol a szegőléc kalkulátor?", "Miért kell ráhagyás?",
    "Az ajtókat mindig le kell vonni?", "Beszerzési becslés. A tényleges darabszámot a vágási kiosztás, sarokkialakítás, profil és helyszíni méretek módosíthatják.", "Hirdetés"]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Skirting Board Calculator", "hu"), "Szegőléc kalkulátor");
});

test("dynamic lengths, board counts and every validation branch translate", () => {
  assert.equal(translate(page, "23,52 m", "en"), "23.52 m");
  assert.equal(translate(page, "10 db", "de"), "10 Stk.");
  for (const source of ["Nettó kerület:", "Ráhagyással szükséges:", "Szükséges szál:", "Megvásárolt hossz:",
    "Kerület: adj meg érvényes számot.", "Kerület: az érték legyen nagyobb nullánál.",
    "Nyílások: az érték nem lehet negatív.", "Szálhossz: az érték legyen nagyobb nullánál.",
    "Ráhagyás: az érték nem lehet negatív.", "A nyílások hossza nem lehet nagyobb a kerületnél.",
    "A ráhagyás legfeljebb 100% legyen."]) {
    assert.ok(translate(page, source, "en"), source);
    assert.ok(translate(page, source, "de"), source);
  }
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s";
  assert.equal(new URL(reportHref(original, "en")).searchParams.get("subject"), "Error report – Skirting Board Calculator");
  assert.equal(new URL(reportHref(original, "de")).searchParams.get("subject"), "Fehlermeldung – Sockelleisten-Rechner");
  assert.equal(reportHref(original, "hu"), original);
});

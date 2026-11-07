"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate, reportHref } = require("../js/epitoipari/fence-post-locale");
const page = "kerites-oszlop-kalkulator";
test("fence form, guide, FAQ and metadata translate naturally", () => {
  assert.equal(translate(page, "Kerítés oszlop kalkulátor", "en"), "Fence Post Calculator");
  assert.equal(translate(page, "A kapuoszlopokat beleszámolja?", "de"), "Werden Torpfosten mitgerechnet?");
  assert.equal(translate(page, "hu-HU", "de"), "de-DE");
  assert.equal(translate(page, "Fence Post Calculator", "hu"), "Kerítés oszlop kalkulátor");
});
test("fence results, validation and report link translate", () => {
  assert.equal(translate(page, "8 db", "en"), "8 pcs");
  assert.equal(translate(page, "Kerítésmezők száma:", "en"), "Number of fence bays:");
  assert.equal(translate(page, "2,43 m", "en"), "2.43 m");
  assert.equal(translate(page, "2,43 m", "de"), "2,43 m");
  assert.equal(translate(page, "Kerítéshossz: az érték legyen nagyobb nullánál.", "de"), "Zaunlänge: Der Wert muss größer als null sein.");
  const en = new URL(reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "en"));
  assert.equal(en.searchParams.get("subject"), "Error report – Fence Post Calculator");
});

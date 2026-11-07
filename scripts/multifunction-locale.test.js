"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const api = require("../js/multifunction-locale");
const suite = require("../js/calculator-suite");

const page = "multifunkcios-szamologep";
const html = fs.readFileSync(path.join(__dirname, "..", "kalkulatorok", page + ".html"), "utf8");
const main = html.match(/<main[\s\S]*?<\/main>/iu)?.[0] || "";
const decode = value => value.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&nbsp;/gu, " ");

test("all multifunction calculator main copy and accessible attributes have EN/DE entries", () => {
  const values = [];
  for (const match of main.replace(/<script[\s\S]*?<\/script>/giu, "").matchAll(/>([^<>]+)</gu)) {
    const value = decode(match[1]).replace(/\s+/gu, " ").trim();
    if (value && /\p{L}/u.test(value)) values.push(value);
  }
  for (const match of main.matchAll(/(?:aria-label|placeholder|title)="([^"]+)"/gu)) values.push(decode(match[1]));
  for (const value of new Set(values)) {
    assert.notEqual(api.translate(page, value, "en"), null, "missing EN: " + value);
    assert.notEqual(api.translate(page, value, "de"), null, "missing DE: " + value);
  }
});

test("metadata, guide, FAQ and quality guidance translate naturally", () => {
  assert.equal(api.translate(page, "Multifunkciós számológép online | Tudományos kalkulátor", "en"), "Multi-function Calculator Online | Scientific Calculator");
  assert.equal(api.translate(page, "Multifunkciós számológép", "de"), "Multifunktionsrechner");
  assert.match(api.translate(page, "A multifunkciós számológép akkor hasznos, amikor a négy alapművelet már kevés. Használható hétköznapi ellenőrzésekhez, tanuláshoz, műszaki képletek részszámításaihoz, pénzügyi példák ellenőrzéséhez és olyan feladatokhoz, ahol hatványozásra, gyökvonásra, logaritmusra vagy trigonometriai függvényekre van szükség.", "en"), /intermediate engineering calculations/u);
  assert.match(api.translate(page, "Miért kapok hibaüzenetet?", "de"), /Fehlermeldung/u);
  assert.match(api.translate(page, "Három módon ellenőrizd, hogy nem a bevitel értelmezése okozta az eltérést", "en"), /input interpretation/u);
  assert.equal(api.translate(page, "Multi-function Calculator", "hu"), "Multifunkciós számológép");
});

test("dynamic results, history, status and errors translate", () => {
  assert.equal(api.translate(page, "Eredmény: 1 234,5", "en"), "Result: 1,234.5");
  assert.equal(api.translate(page, "Eredmény: 1 234,5", "de"), "Ergebnis: 1.234,5");
  assert.equal(api.translate(page, "sin(30) = 0,5", "en"), "sin(30) = 0.5");
  assert.equal(api.translate(page, "A kifejezés nem számolható ki. Ellenőrizd a bevitelt és a zárójeleket.", "de"), "Der Ausdruck konnte nicht berechnet werden. Prüfe die Eingabe und die Klammern.");
  assert.equal(api.translate(page, "Hiba", "en"), "Error");
  assert.equal(api.translate(page, "Fok mód kiválasztva.", "de"), "Gradmodus ausgewählt.");
});

test("scientific calculations remain unchanged", () => {
  assert.equal(suite.evaluate("sin(30)+2^3", "deg"), 8.5);
  assert.ok(Math.abs(suite.evaluate("sin(π/2)", "rad") - 1) < 1e-12);
  assert.equal(suite.evaluate("5!", "deg"), 120);
  assert.throws(() => suite.evaluate("1/0", "deg"));
});

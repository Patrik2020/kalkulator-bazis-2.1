"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const api = require("../js/epitoipari/flooring-locale");
const page = "padlo-burkolat-kalkulator";
const html = fs.readFileSync(path.join(__dirname, "..", "kalkulatorok", page + ".html"), "utf8");
const main = html.match(/<main[\s\S]*?<\/main>/iu)?.[0] || "";
const decode = value => value.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&nbsp;/gu, " ");

test("all flooring main copy and accessible attributes have EN/DE translations", () => {
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

test("flooring metadata, guide, FAQ, methodology and report link translate naturally", () => {
  assert.equal(api.translate(page, "Padlóburkolat kalkulátor | Csomagszám és ráhagyás", "en"), "Flooring Calculator | Packs and Cutting Allowance");
  assert.equal(api.translate(page, "Padlóburkolat kalkulátor", "de"), "Bodenbelagsrechner");
  assert.match(api.translate(page, "Mekkora ráhagyás indokolt?", "en"), /allowance/u);
  assert.match(api.translate(page, "A gardrób alatti részt is számoljam?", "de"), /Schrank/u);
  assert.match(api.translate(page, "Gyártói adatlap az elsődleges.", "en"), /takes precedence/u);
  assert.equal(api.translate(page, "Flooring Calculator", "hu"), "Padlóburkolat kalkulátor");
  const de = new URL(api.reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Bodenbelagsrechner");
});

test("flooring dynamic results, pack values, errors and advertisement translate", () => {
  assert.equal(api.translate(page, "21,6 m²", "en"), "21.6 m²");
  assert.equal(api.translate(page, "10 csomag", "de"), "10 Pakete");
  assert.equal(api.translate(page, "17 m / 8 db", "en"), "17 m / 8 pcs");
  assert.equal(api.translate(page, "21 / 21,6 / 22,4 m²", "de"), "21 / 21,6 / 22,4 m²");
  assert.equal(api.translate(page, "Hossz: adj meg nullánál nagyobb értéket.", "en"), "Length: enter a value greater than zero.");
  assert.equal(api.translate(page, "A nettó alapterületnek pozitívnak kell maradnia.", "de"), "Die Nettogrundfläche muss positiv bleiben.");
  assert.equal(api.translate(page, "Hirdetés", "en"), "Advertisement");
});

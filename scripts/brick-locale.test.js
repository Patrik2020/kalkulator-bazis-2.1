"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const api = require("../js/epitoipari/brick-locale");
const page = "tegla-kalkulator";
const html = fs.readFileSync(path.join(__dirname, "..", "kalkulatorok", page + ".html"), "utf8");
const main = html.match(/<main[\s\S]*?<\/main>/iu)?.[0] || "";
const decode = value => value.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&nbsp;/gu, " ");

test("all brick main copy and accessible attributes have EN/DE translations", () => {
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

test("brick metadata, dynamic values, summaries and report link translate", () => {
  assert.equal(api.translate(page, "Tégla kalkulátor | Falazat és darabszám becslése", "en"), "Brick Calculator | Walling and Quantity Estimate");
  assert.equal(api.translate(page, "Tégla kalkulátor", "de"), "Ziegelrechner");
  assert.equal(api.translate(page, "493 db", "en"), "493 pcs");
  assert.equal(api.translate(page, "9 raklap / 540 db", "de"), "9 Paletten / 540 Stk.");
  assert.equal(api.translate(page, "443 700 Ft", "en"), "443,700 HUF");
  assert.equal(api.translate(page, "Brick Calculator", "hu"), "Tégla kalkulátor");
  const de = new URL(api.reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Ziegelrechner");
});

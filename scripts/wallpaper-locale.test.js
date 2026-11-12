"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const api = require("../js/epitoipari/wallpaper-locale");
const page = "tapeta-kalkulator";
const html = fs.readFileSync(path.join(__dirname, "..", "kalkulatorok", page + ".html"), "utf8");
const main = html.match(/<main[\s\S]*?<\/main>/iu)?.[0] || "";
const decode = value => value.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&nbsp;/gu, " ");

test("all wallpaper main copy and accessible attributes have EN/DE translations", () => {
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

test("wallpaper metadata, guide, FAQ, methodology and report link translate naturally", () => {
  assert.equal(api.translate(page, "Tapéta kalkulátor | Tekercsszám falméret alapján", "en"), "Wallpaper Calculator | Rolls from Wall Dimensions");
  assert.equal(api.translate(page, "Tapéta kalkulátor", "de"), "Tapetenrechner");
  assert.match(api.translate(page, "A mintaillesztés sokat változtathat", "en"), /Pattern matching/u);
  assert.match(api.translate(page, "Mit jelent a rapport?", "de"), /Musterrapport/u);
  assert.match(api.translate(page, "Gyártói adatlap az elsődleges.", "en"), /takes precedence/u);
  assert.equal(api.translate(page, "Wallpaper Calculator", "hu"), "Tapéta kalkulátor");
  const de = new URL(api.reportHref("mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s", "de"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Tapetenrechner");
});

test("wallpaper dynamic results, errors and advertisement translate", () => {
  assert.equal(api.translate(page, "37,4 m²", "en"), "37.4 m²");
  assert.equal(api.translate(page, "11 db", "de"), "11 Stk.");
  assert.equal(api.translate(page, "3 csík", "en"), "3 drops");
  assert.equal(api.translate(page, "Tekercshossz: adj meg nullánál nagyobb értéket.", "en"), "Roll length: enter a value greater than zero.");
  assert.equal(api.translate(page, "A tekercs hossza nem elegendő egy teljes csíkhoz.", "de"), "Die Rolle ist für eine vollständige Bahn nicht lang genug.");
  assert.equal(api.translate(page, "Hirdetés", "en"), "Advertisement");
});

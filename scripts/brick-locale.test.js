"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { translate, reportHref, dictionary } = require("../js/epitoipari/tegla-locale");
const { requiresTranslation } = require("./localization-coverage-browser-checks");
const page = "tegla-kalkulator";
const html = fs.readFileSync(path.join(__dirname, "../kalkulatorok/tegla-kalkulator.html"), "utf8");
const main = html.match(/<main\b[\s\S]*?<\/main>/iu)?.[0] || "";
const decode = value => value.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'").replace(/&nbsp;/gu, " ");

test("all brick calculator copy and accessible attributes have reviewed EN/DE translations", () => {
  const values = [];
  for (const match of main.replace(/<script[\s\S]*?<\/script>/giu, "").matchAll(/>([^<>]+)</gu)) {
    const value = decode(match[1]).replace(/\s+/gu, " ").trim();
    if (value && /\p{L}/u.test(value)) values.push(value);
  }
  for (const match of main.matchAll(/(?:aria-label|placeholder|title)="([^"]+)"/gu)) {
    values.push(decode(match[1]).replace(/\s+/gu, " ").trim());
  }
  for (const value of new Set(values)) {
    if (!requiresTranslation(value)) continue;
    assert.notEqual(translate(page, value, "en"), null, "missing EN: " + value);
    assert.notEqual(translate(page, value, "de"), null, "missing DE: " + value);
  }
});

test("page metadata, structured-data copy, guidance and FAQs use natural translations", () => {
  assert.equal(translate(page, "Tégla kalkulátor | Falazat és darabszám becslése", "en"), "Brick Calculator | Estimate Masonry and Brick Quantities");
  assert.equal(translate(page, "Tégla kalkulátor", "de"), "Ziegelrechner");
  assert.equal(translate(page, "hu-HU", "en"), "en-GB");
  assert.equal(translate(page, "Főoldal", "de"), "Startseite");
  assert.equal(translate(page, "Otthon & felújítás", "en"), "Home & renovation");
  assert.equal(translate(page, "Tégla mennyiség kiszámítása falazáshoz.", "de"), "Berechnung des Ziegelbedarfs für Mauerwerk.");
  assert.equal(translate(page, "A habarcsot is számolja?", "de"), "Berechnet der Rechner auch den Mörtelbedarf?");
  assert.equal(translate(page, "A végleges mennyiséget mindig a konkrét tégla típusa, falazási technológia és terv alapján ellenőrizd. Statikai vagy engedélyköteles munkához szakember szükséges.", "en"), "Always verify the final quantity against the specific brick type, masonry method and project plans. Structural work or work requiring a permit must be assessed by a qualified professional.");
  assert.equal(translate(page, "Porotherm 30 N+F", "en"), "Porotherm 30 N+F");
});

test("dynamic areas, brick counts, costs, pallet orders and summary fragments are localized", () => {
  assert.equal(translate(page, "Falvastagság: 30 cm", "en"), "Wall thickness: 30 cm");
  assert.equal(translate(page, "13,50 m²", "en"), "13.50 m²");
  assert.equal(translate(page, "10,50 m²", "de"), "10,50 m²");
  assert.equal(translate(page, "168 db", "en"), "168 bricks");
  assert.equal(translate(page, "16 db/m²", "de"), "16 Ziegel/m²");
  assert.equal(translate(page, "159 300 Ft", "en"), "159,300 HUF");
  assert.equal(translate(page, "3 raklap / 180 db", "de"), "3 Paletten / 180 Ziegel");
  assert.equal(translate(page, "5% ráhagyással", "en"), "With a 5% allowance, we recommend purchasing");
  assert.equal(translate(page, "Adj meg érvényes egyedi téglaméretet a számításhoz.", "de"), "Gib gültige Maße für den Ziegel in Sondergröße ein, um zu rechnen.");
  assert.equal(translate(page, "Nincs megadva", "en"), "Not provided");
  assert.equal(translate(page, "Add meg a tégla hosszát és magasságát centiméterben.", "de"), "Gib die Länge und Höhe des Ziegels in Zentimetern ein.");
});

test("retention CTA guidance and statuses have reviewed EN/DE translations", () => {
  assert.equal(translate(page, "Hozzáadás a Főképernyőhöz", "en"), "Add to Home Screen");
  assert.equal(translate(page, "Nyomd meg a Ctrl + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.", "de"), "Drücke Ctrl + D und speichere die Seite als Lesezeichen.");
  assert.equal(translate(page, "A telepítési művelet nem sikerült.", "en"), "The installation action failed.");
  assert.equal(translate(page, "A natív megosztás nem sikerült, megpróbáljuk a linket másolni.", "de"), "Das Teilen über die Systemfunktion ist fehlgeschlagen. Wir versuchen stattdessen, den Link zu kopieren.");
});

test("the error-report email link follows the selected language without changing its destination", () => {
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s%20%E2%80%93%20T%C3%A9gla%20kalkul%C3%A1tor&body=Kalkul%C3%A1tor%3A%20T%C3%A9gla%20kalkul%C3%A1tor";
  const en = new URL(reportHref(source, "en"));
  const de = new URL(reportHref(source, "de"));
  assert.equal(en.protocol, "mailto:");
  assert.equal(en.pathname, "kalkulatorbazis@gmail.com");
  assert.equal(en.searchParams.get("subject"), "Error report – Brick Calculator");
  assert.ok(en.searchParams.get("body").includes("Briefly describe the issue"));
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Ziegelrechner");
  assert.ok(de.searchParams.get("body").includes("Beschreibe den Fehler kurz"));
  assert.equal(reportHref(source, "hu"), source);
});

test("dictionary entries are complete reviewed HU/EN/DE pairs", () => {
  for (const [source, pair] of Object.entries(dictionary)) {
    assert.ok(source.trim(), "empty source key");
    assert.equal(pair.length, 2, source);
    assert.ok(pair.every(value => typeof value === "string" && value.trim()), source);
    assert.equal(translate(page, source, "en"), pair[0], source);
    assert.equal(translate(page, source, "de"), pair[1], source);
  }
});

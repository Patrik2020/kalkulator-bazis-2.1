"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/altalanos/everyday-locale");

test("supported calculators translate form labels without changing input and prices", () => {
  assert.deepEqual(api.pages, ["ar-kedvezmeny-kalkulator", "egysegar-kalkulator", "atlag-kalkulator", "arany-kalkulator", "szazalekos-valtozas-kalkulator", "borravalo-kalkulator", "arres-kalkulator", "haszonkulcs-kalkulator", "fedezeti-pont-kalkulator", "datum-hozzaadas-kivonas-kalkulator", "eletkor-kalkulator", "datum-kulonbseg-kalkulator", "munkaido-kalkulator", "munkanap-kalkulator", "tulora-kalkulator", "oraber-kalkulator", "rezsi-megosztas-kalkulator", "recept-adag-kalkulator", "villanyfogyasztas-koltseg-kalkulator", "vizfogyasztas-koltseg-kalkulator", "megtakaritasi-cel-kalkulator", "vesztartalek-kalkulator"]);
  assert.equal(api.translate("ar-kedvezmeny-kalkulator", "Első kedvezmény (%)", "en"), "First discount (%)");
  assert.equal(api.translate("ar-kedvezmeny-kalkulator", "Végső ár", "de"), "Endpreis");
  assert.equal(api.translate("egysegar-kalkulator", "Egységre vetítés", "en"), "Comparison quantity");
  assert.equal(api.translate("atlag-kalkulator", "Számtani átlag:", "de"), "Arithmetisches Mittel:");
  assert.equal(api.translate("atlag-kalkulator", "Súlyok összege:", "en"), "Sum of weights:");
});

test("discount metadata and schema copy have natural English and German translations", () => {
  const title = "Árkedvezmény kalkulátor | Akciós ár és megtakarítás";
  const description = "Árkedvezmény kalkulátor akciós árhoz: add meg az eredeti árat és a kedvezmény százalékát, majd lásd a fizetendő összeget és megtakarítást.";
  assert.equal(api.translate("ar-kedvezmeny-kalkulator", title, "en"),
    "Discount Calculator | Sale Price and Savings");
  assert.equal(api.translate("ar-kedvezmeny-kalkulator", title, "de"),
    "Rabattrechner | Angebotspreis und Ersparnis");
  assert.match(api.translate("ar-kedvezmeny-kalkulator", description, "en"), /amount to pay and how much you save/);
  assert.match(api.translate("ar-kedvezmeny-kalkulator", description, "de"), /wie viel du zahlst und sparst/);
  assert.equal(api.translate("ar-kedvezmeny-kalkulator", title, "hu"), null);
});

test("unit price metadata and WebPage schema copy have natural English and German translations", () => {
  const page = "egysegar-kalkulator";
  const title = "Egységár kalkulátor | Kiszerelések összehasonlítása";
  const description = "Egységár kalkulátor eltérő árú és kiszerelésű termékekhez. Hasonlítsd össze, melyik ajánlat kerül kevesebbe kilogrammonként vagy literenként.";
  assert.equal(api.translate(page, title, "en"), "Unit Price Calculator | Compare Pack Sizes");
  assert.equal(api.translate(page, title, "de"), "Grundpreisrechner | Packungsgrößen vergleichen");
  assert.match(api.translate(page, description, "en"), /costs less per kilogram or litre/u);
  assert.match(api.translate(page, description, "de"), /pro Kilogramm oder Liter günstiger/u);
  assert.equal(api.translate(page, title, "hu"), null);
});

test("dynamic product rankings preserve prices, amounts and units", () => {
  assert.equal(api.translate("egysegar-kalkulator", "1. termék", "en"), "1. product");
  assert.equal(api.translate("egysegar-kalkulator", "2. termék", "de"), "2. Produkt");
  assert.equal(api.translate("egysegar-kalkulator", ": 6 798 Ft / megadott egység – legjobb ár", "en"),
    ": 6 798 Ft / selected quantity – best price");
  assert.equal(api.translate("egysegar-kalkulator", ": 7 196 Ft / megadott egység", "de"),
    ": 7 196 Ft / Vergleichsmenge");
  assert.equal(api.translate("egysegar-kalkulator", ": 6 798 Ft / megadott egység", "hu"), null);
  assert.equal(api.translate("egysegar-kalkulator", "7999 Ft", "en"), null);
});

test("average calculator errors translate and values stay source-formatted", () => {
  assert.match(api.translate("atlag-kalkulator", "Adj meg érvényes értékeket a súlyozott átlaghoz.", "en"), /weighted mean/);
  assert.equal(api.translate("atlag-kalkulator", "A súlyok összege legyen nagyobb nullánál.", "de"),
    "Die Summe der Gewichte muss größer als null sein.");
  assert.equal(api.translate("atlag-kalkulator", "1,05; 0,98; 1,12", "en"), null);
});

test("dictionary entries are reviewed pairs and unknown text falls back to Hungarian", () => {
  for (const dictionary of [api.shared, api.content, ...Object.values(api.dictionaries)]) {
    for (const [source, pair] of Object.entries(dictionary)) {
      assert.ok(source.trim());
      assert.equal(pair.length, 2, source);
      assert.ok(pair.every(s => typeof s === "string" && s.trim()), source);
    }
  }
  assert.equal(api.translate("atlag-kalkulator", "Részletes jogi szöveg", "de"), null);
  assert.equal(api.translate("not-a-calculator", "Számítás", "en"), null);
});

// Explanations and dynamic auxiliary units must follow repeated language changes.
test("content lookup tolerates layout whitespace while preserving numbers", () => {
  assert.equal(api.translate("atlag-kalkulator", "Példák", "en"), "Examples");
  assert.equal(api.translate("atlag-kalkulator", "Példák", "de"), "Beispiele");
  const source = Object.keys(api.content).find(s => s.startsWith("Tedd el"));
  assert.equal(api.translate("atlag-kalkulator", source.replace(/ /g, "\n  "), "en"), api.content[source][0]);
  assert.equal(api.translate("egysegar-kalkulator", "3,75 Ft/egység", "de"), "3,75 HUF/Einheit");
  assert.equal(api.translate("egysegar-kalkulator", "3,75 Ft/egység", "en"), "3,75 HUF/unit");
  assert.equal(api.translate("egysegar-kalkulator", "3,75 Ft/egység", "hu"), null);
});

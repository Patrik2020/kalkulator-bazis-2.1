"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate } = require("../js/epitoipari/csempe-locale.js");
const page = "csempe-kalkulator";

test("tile calculator inputs, guidance and FAQs are translated in English and German", () => {
  assert.equal(translate(page, "Csempe és járólap kalkulátor", "en"), "Wall and Floor Tile Calculator");
  assert.equal(translate(page, "Helyiség hossza (m)", "de"), "Raumlänge (m)");
  assert.equal(translate(page, "pl. 1,60", "en"), "e.g. 1.60");
  assert.equal(translate(page, "pl. 60", "de"), "z. B. 60");
  assert.equal(translate(page, "A helyiség kerületét megszorozza a burkolandó falmagassággal. Az ajtó felülete opcionálisan levonható, majd a választott ráhagyás alapján kiszámolja a vásárolandó négyzetmétert és a becsült darabszámot.", "en"), "The room perimeter is multiplied by the height to be tiled. You can optionally deduct the door area; the calculator then applies the selected allowance to estimate the area to buy and the number of tiles.");
  assert.equal(translate(page, "Dobozszámot is számol?", "de"), "Berechnet der Rechner auch die Anzahl der Kartons?");
});

test("dynamic area and tile counts keep the calculated values while using locale formatting", () => {
  assert.equal(translate(page, "33,11 m²", "en"), "33.11 m²");
  assert.equal(translate(page, "36,42 m²", "de"), "36,42 m²");
  assert.equal(translate(page, "203 db", "en"), "203 tiles");
  assert.equal(translate(page, "147 db", "de"), "147 Fliesen");
  assert.equal(translate(page, "1 doboz", "en"), "1 box");
  assert.equal(translate(page, "1 doboz", "de"), "1 Karton");
  assert.match(translate(page, "A négy fal nettó felülete 33,11 m². 10% ráhagyással 36,42 m², vagyis körülbelül 203 darab falicsempe szükséges.", "en"), /33\.11 m².*36\.42 m².*203 wall tiles/u);
  assert.match(translate(page, "A padló felülete 12,00 m². 10% ráhagyással 13,20 m², vagyis körülbelül 147 darab járólap szükséges.", "de"), /12,00 m².*13,20 m².*147 Bodenfliesen/u);
});

test("door validation, box planner and related copy are localized", () => {
  assert.equal(translate(page, "Az ajtók felülete nem lehet nagyobb a falak teljes felületénél.", "en"), "The total door area cannot exceed the gross wall area.");
  assert.equal(translate(page, "A darabszám már tartalmaz 2 külön javítótartalék dobozt.", "de"), "Die Gesamtzahl enthält bereits 2 zusätzliche Kartons als Reparaturreserve.");
  assert.equal(translate(page, "Fuga kalkulátor", "en"), "Grout Calculator");
  assert.equal(translate(page, "Számold ki a várható fugázóanyag-szükségletet burkoláshoz.", "de"), "Schätze, wie viel Fugenmörtel du für dein Fliesenprojekt benötigst.");
  assert.equal(translate(page, "Csempe és járólap kalkulátor", "hu"), null);
});

test("the error-report email subject and template follow the selected language", () => {
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s%20%E2%80%93%20Csempe%20kalkul%C3%A1tor&body=Kalkul%C3%A1tor%3A%20Csempe%20kalkul%C3%A1tor%0AOldal%3A%20https%3A%2F%2Fkalkulatorbazis.hu%2Fkalkulatorok%2Fcsempe-kalkulator.html%0A%0AA%20hiba%20r%C3%B6vid%20le%C3%ADr%C3%A1sa%3A%0A";
  const en = new URL(translateReport(source, "en"));
  const de = new URL(translateReport(source, "de"));
  assert.equal(en.searchParams.get("subject"), "Error report – Tile Calculator");
  assert.equal(en.searchParams.get("body"), "Calculator: Tile Calculator\nPage: https://kalkulatorbazis.hu/kalkulatorok/csempe-kalkulator.html\n\nBriefly describe the issue:\n");
  assert.equal(de.searchParams.get("subject"), "Fehlermeldung – Fliesenrechner");
  assert.equal(de.searchParams.get("body"), "Rechner: Fliesenrechner\nSeite: https://kalkulatorbazis.hu/kalkulatorok/csempe-kalkulator.html\n\nBeschreibe den Fehler kurz:\n");
  assert.equal(translateReport(source, "hu"), source);
});

function translateReport(source, language) {
  return require("../js/epitoipari/csempe-locale.js").localizeReportHref(source, language);
}

"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { translate } = require("../js/epitoipari/csempe-locale.js");
const page = "csempe-kalkulator";

test("tile calculator inputs, guidance and FAQs are translated in English and German", () => {
  assert.equal(translate(page, "Csempe és járólap kalkulátor", "en"), "Wall and Floor Tile Calculator");
  assert.equal(translate(page, "Helyiség hossza (m)", "de"), "Raumlänge (m)");
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

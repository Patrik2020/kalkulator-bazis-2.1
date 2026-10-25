"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/penzugyi/wealth-growth-locale");

test("compound interest page guidance is available in English and German", () => {
  const page = "kamatos-kamat-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "Kamatos kamat kalkulátor", "en"), "Compound interest calculator");
  assert.equal(api.translate(page, "Befizetés gyakorisága", "de"), "Einzahlungshäufigkeit");
  assert.match(api.translate(page, "A képlet feltételezi, hogy a hozam újra befektetésre kerül, és a megadott éves hozam minden időszakban azonos. A valós befektetéseknél a költség, adózás, árfolyammozgás és piaci visszaesés ettől jelentősen eltérő eredményt adhat.", "en"), /fees, taxes, price movements and market downturns/u);
  assert.equal(api.translate(page, "Adó utáni végösszeg", "de"), "Endbetrag nach Steuern");
  assert.equal(api.translate(page, "Hozam: 3 000 Ft · Befizetés: 1 000 Ft", "en"), "Return: 3 000 HUF · Contributions: 1 000 HUF");
  assert.equal(api.translate(page, "Veszteség: 500 Ft · Befizetés: 1 000 Ft", "de"), "Verlust: 500 HUF · Einzahlungen: 1 000 HUF");
  assert.equal(api.translate(page, "1. év: 1 151 709 Ft", "en"), "Year 1: 1 151 709 HUF");
  assert.equal(api.translate(page, "20. év: 26 358 038 Ft", "de"), "20. Jahr: 26 358 038 HUF");
  assert.equal(api.translate(page, "pl. 100 000", "en"), "e.g. 100 000");
  assert.equal(api.translate(page, "pl. 7", "de"), "z. B. 7");
  assert.equal(api.translate(page, "Mentési, telepítési és megosztási műveletek", "en"), "Bookmarking, installation and sharing actions");
  assert.equal(api.translate(page, "Éves portfólióérték", "de"), "Jährlicher Portfoliowert");
});

test("millionaire goal page preserves clear target and model limitations in both languages", () => {
  const page = "milliomos-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "Mikor leszek milliomos?", "en"), "When will I become a millionaire?");
  assert.equal(api.translate(page, "Kedvező", "de"), "Günstig");
  assert.equal(api.translate(page, "2 év 3 hónap", "en"), "2 years 3 months");
  assert.equal(api.translate(page, "60 éven túl", "de"), "Mehr als 60 Jahre");
  assert.match(api.translate(page, "Becsült elérési dátum: 2027. 02. 03.", "en"), /Estimated target date: 3 February 2027/u);
  assert.match(api.translate(page, "A célösszeg elérése függ a valós hozamtól, inflációtól, költségektől és attól is, hogy végig tudod-e tartani a havi megtakarítást. Az eredmény nem garancia.", "en"), /actual returns, inflation, fees/u);
  assert.match(api.translate(page, "A hozam állandó éves effektív feltételezés. Infláció, adó, költség és változó befizetés nincs ebben a mérföldkő-modellben.", "de"), /konstante effektive Jahresrendite/u);
  assert.equal(api.translate(page, "ismeretlen szöveg", "en"), null);
});

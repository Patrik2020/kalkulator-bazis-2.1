"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const locale = require("../js/atvaltok/deviza-locale");
const page = "deviza-atvalto-kalkulator";

test("currency form, guidance, FAQ, metadata and fee comparison are localized", () => {
  for (const [source, english, german] of [
    ["Deviza átváltó kalkulátor", "Currency Converter", "Währungsrechner"],
    ["Átváltandó összeg", "Amount to convert", "Umzurechnender Betrag"],
    ["Magyar forint (HUF)", "Hungarian forint (HUF)", "Ungarischer Forint (HUF)"],
    ["A kalkulátor valós idejű árfolyamot ad?", "Does the calculator use a real-time exchange rate?", "Verwendet der Rechner einen Echtzeitkurs?"],
    ["Mekkora különbséget okoz a spread vagy szolgáltatói felár?", "How much difference can a spread or provider markup make?", "Wie groß ist der Unterschied durch Spread oder Anbieteraufschlag?"],
    ["Külföldi pénzt váltanál vagy utalnál?", "Need to exchange or transfer money internationally?", "Möchtest du Geld ins Ausland überweisen oder eine Währung wechseln?"],
    ["hu-HU", "en-GB", "de-DE"]
  ]) {
    assert.equal(locale.translate(page, source, "en"), english);
    assert.equal(locale.translate(page, source, "de"), german);
  }
  assert.equal(locale.translate(page, "Currency Converter", "hu"), "Deviza átváltó kalkulátor");
  assert.equal(locale.translate(page, "Währungsrechner", "en"), "Currency converter");
});

test("currency loading, fallback and retry states are localized", () => {
  for (const source of [
    "Árfolyamok betöltése...", "Betöltés...", "Nem sikerült betölteni az árfolyamokat. Próbáld meg újra.",
    "Az árfolyamok betöltéséhez internetkapcsolat szükséges.", "Nincs elérhető adat", "Nem elérhető",
    "Árfolyamok újratöltése", "Újratöltés…", "Európai Központi Bank",
    " (mentett adat)", " (mentett adat, a frissítés most nem sikerült)"
  ]) {
    assert.ok(locale.translate(page, source, "en"), `${source}: EN`);
    assert.ok(locale.translate(page, source, "de"), `${source}: DE`);
  }
  const original = "mailto:kalkulatorbazis@gmail.com?subject=Hiba&body=Kalkul%C3%A1tor%3A%20Deviza";
  const german = new URL(locale.reportHref(original, "de"));
  assert.equal(german.searchParams.get("subject"), "Fehlermeldung – Währungsrechner");
  assert.ok(german.searchParams.get("body").includes("Kurze Beschreibung des Fehlers"));
  assert.equal(locale.reportHref(original, "hu"), original);
});

"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const api = require("../js/penzugyi/dividend-locale");

const page = "osztalek-kalkulator";
const root = path.resolve(__dirname, "..");

test("dividend calculator is wired into the reviewed HU EN DE page inventory", () => {
  assert.ok(api.pages.includes(page));
  const html = fs.readFileSync(path.join(root, "kalkulatorok/osztalek-kalkulator.html"), "utf8");
  assert.match(html, /dividend-locale-common\.js\?v=/u);
  assert.match(html, /dividend-locale\.js\?v=/u);
  assert.equal(api.translate(page, "Osztalék kalkulátor", "en"), "Dividend calculator");
  assert.equal(api.translate(page, "Osztalék kalkulátor", "de"), "Dividendenrechner");
});

test("long-form dividend guidance and calculator terminology are translated", () => {
  assert.match(api.translate(page, "A kalkulátor eredménye becslés, nem minősül befektetési, adózási vagy pénzügyi tanácsadásnak. Az osztalék nem garantált, a vállalat csökkentheti vagy megszüntetheti. Az árfolyam, az adózás, a forrásadó, a devizaárfolyam és a költségek miatt a tényleges eredmény eltérhet a számított értéktől.", "en"), /not investment, tax or financial advice/u);
  assert.match(api.translate(page, "A kalkulátor eredménye becslés, nem minősül befektetési, adózási vagy pénzügyi tanácsadásnak. Az osztalék nem garantált, a vállalat csökkentheti vagy megszüntetheti. Az árfolyam, az adózás, a forrásadó, a devizaárfolyam és a költségek miatt a tényleges eredmény eltérhet a számított értéktől.", "de"), /keine Anlage-, Steuer- oder Finanzberatung/u);
  assert.equal(api.translate(page, "3 M Ft", "en"), "HUF 3m");
  assert.equal(api.translate(page, "9 e Ft", "de"), "9 Tsd. HUF");
  assert.equal(api.translate(page, "4% bruttó osztalékhozam", "en"), "4% gross dividend yield");
});

test("income, target and projection output sentences keep dynamic amounts", () => {
  const income = "A megadott feltételek alapján a 5 M Ft forintos portfólió évente körülbelül 170 e Ft nettó osztalékot termelhet. Ez havi átlagban nagyjából 14 e Ft, negyedéves fizetés esetén pedig kifizetésenként körülbelül 42 e Ft.";
  assert.equal(api.translate(page, income, "en"), "Based on your assumptions, a HUF 5m portfolio could generate about HUF 170k in net dividends per year. That averages around HUF 14k per month, or about HUF 42k per quarterly payment.");

  const target = "A megadott feltételek alapján a havi nettó céljövedelemhez körülbelül 28,2 M Ft portfólióra lehet szükség. A felfelé kerekített tőkével számolt éves nettó osztalék becslés szerint 1,2 M Ft.";
  assert.match(api.translate(page, target, "de"), /monatliches Nettoziel/u);
  assert.match(api.translate(page, target, "de"), /28,2 Mio\. HUF/u);

  const projection = "A megadott feltételek alapján 20 év végére a portfólió körülbelül 50 M Ft értéket érhet el. Újrabefektetéssel a portfólió becsült értéke 20 M Ft, az éves nettó osztalék pedig 500 e Ft összeggel lehetne magasabb ugyanilyen feltételek mellett. Stresszteszt nélkül az utolsó év becsült nettó osztaléka 900 e Ft, a stressztesztben 600 e Ft.";
  assert.match(api.translate(page, projection, "en"), /after 20 years/u);
  assert.match(api.translate(page, projection, "en"), /under the stress test/u);
});

test("validation and unknown source strings behave safely", () => {
  assert.equal(api.translate(page, "Az osztalékhozam legyen 0% és 100% között.", "en"), "Dividend yield must be between 0% and 100%.");
  assert.equal(api.translate(page, "Az időtáv legyen 1 és 60 év között.", "de"), "Der Anlagezeitraum muss zwischen 1 und 60 Jahren liegen.");
  assert.equal(api.translate(page, "Nem létező forrásszöveg", "en"), null);
  assert.equal(api.translate("another-page", "Osztalék kalkulátor", "en"), null);
});

test("late-loaded prompts, scenario labels and result cards are translated", () => {
  for (const source of [
    "Alacsonyabb hozam", "Alapfeltételezés", "Az eredmény után", "Bruttó", "Infláció",
    "Levonás", "Magasabb hozam", "Nettó", "Hirdetés",
    "Az éves bontás a hosszú távú módban érhető el.",
    "Ellenőrizd a szükséges tőkét más szemszögből is",
    "Hasonlítsd össze a teljes hozamra épülő megközelítéssel.",
    "Vizsgáld meg a céljövedelem jövőbeli vásárlóerejét.",
    "Az osztalékhozam nem garantált, ezért a céljövedelmet érdemes hosszabb távú növekedési és inflációs forgatókönyvvel is összevetni."
  ]) {
    assert.ok(api.translate(page, source, "en"), `missing EN: ${source}`);
    assert.ok(api.translate(page, source, "de"), `missing DE: ${source}`);
  }
  assert.equal(api.translate(page, "Teljes levonás: 18 000 Ft", "en"), "Total deductions: 18 000 HUF");
  assert.equal(api.translate(page, "Éves bruttó osztalék: 120 000 Ft", "de"), "Jährliche Bruttodividende: 120 000 HUF");
});

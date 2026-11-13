"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const api = require("../js/egeszseg/water-intake-locale");
const model = require("../js/simple-calculators")["vizfogyasztas-kalkulator"];
const { requiresTranslation } = require("./localization-coverage-browser-checks");
const page = "vizfogyasztas-kalkulator";
const html = fs.readFileSync(require.resolve("../kalkulatorok/vizfogyasztas-kalkulator.html"), "utf8");
const main = html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode = text => text.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'");

test("water intake static copy, accessible attributes and structured data have reviewed EN/DE translations", () => {
  const values = [...main.matchAll(/>([^<>]+)</gu)].map(match => decode(match[1]).replace(/\s+/gu, " ").trim());
  values.push(...[...main.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/gu)].map(match => decode(match[1])));
  const collect = value => {
    if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) {
      if (["name", "description", "text", "about", "inLanguage"].includes(key)) values.push(item);
      else if (item && typeof item === "object") collect(item);
    }
  };
  collect(JSON.parse(html.match(/id="kb-structured-data"[^>]*>(.*?)<\/script>/u)[1]));
  for (const source of new Set(values)) {
    if (!requiresTranslation(source)) continue;
    for (const language of ["en", "de"]) assert.notEqual(api.translate(page, source, language), null, `${language}: ${source}`);
  }
});

test("the unchanged water model, displayed precision and range units remain consistent", () => {
  assert.deepEqual(model.compute({ weight: 70, activity: 500 }), [["Becsült napi folyadék", "2,95 liter"], ["Ez 2,5 dl-es poharakban", "12 pohár"]]);
  assert.deepEqual(model.compute({ weight: 80, activity: 0 }), [["Becsült napi folyadék", "2,80 liter"], ["Ez 2,5 dl-es poharakban", "11 pohár"]]);
  assert.equal(api.translate(page, "2,80 liter", "en"), "2.80 litres");
  assert.equal(api.translate(page, "3,4–3,8 liter/nap", "en"), "3.4–3.8 litres/day");
  assert.equal(api.translate(page, "3,4–3,8 liter/nap", "de"), "3,4–3,8 Liter/Tag");
  assert.equal(api.translate(page, "14–15 pohár", "de"), "14–15 Gläser");
  assert.equal(api.translate(page, "1 000 ml", "en"), "1,000 ml");
});

test("all model validation errors and dynamic context messages translate", () => {
  for (const values of [{weight:0,activity:0},{weight:NaN,activity:0},{weight:70,activity:-1},{weight:70,activity:NaN}]) {
    assert.throws(() => model.compute(values), error => {
      for (const language of ["en", "de"]) assert.ok(api.translate(page, error.message, language), `${language}: ${error.message}`);
      return true;
    });
  }
  for (const count of [1,2,4]) {
    const text = `${count} olyan körülményt jelöltél, amely miatt a statikus alapbecslés kevésbé lehet pontos. Figyeld a környezetet, terhelést és egyéni visszajelzéseket.`;
    assert.ok(api.translate(page,text,"en").includes(`${count} ${count===1?"circumstance":"circumstances"}`));
    assert.ok(api.translate(page,text,"de").includes(`${count} ${count===1?"Umstand":"Umstände"}`));
  }
});

test("medical cautions, reports, metadata, retention and Hungarian restoration retain their meaning", () => {
  assert.equal(api.translate(page,"hu-HU","en"),"en-GB");
  assert.equal(api.translate(page,"hu-HU","de"),"de-DE");
  assert.equal(api.translate(page,"Water Intake Calculator","hu"),"Vízfogyasztás kalkulátor");
  const caution = "Szív-, vese- vagy májbetegség, ödéma, vízhajtó kezelés vagy orvos által előírt folyadékkorlátozás esetén ezt a kalkulátort ne használd személyes célérték meghatározására.";
  assert.ok(api.translate(page,caution,"en").startsWith("Do not use this calculator"));
  assert.ok(api.translate(page,caution,"de").includes("nicht zur Festlegung"));
  assert.equal(api.translate(page,"Hirdetés","en"),"Advertisement");
  assert.ok(api.translate(page,"Kövesd az útmutatót a könyvjelző mentéséhez.","de"));
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Eredeti";
  for (const language of ["en","de"]) {
    const url = new URL(api.reportHref(source,language));
    assert.equal(url.pathname,"kalkulatorbazis@gmail.com");
    assert.ok(url.searchParams.get("subject").includes(language==="en"?"Water Intake Calculator":"Trinkmengenrechner"));
    assert.ok(url.searchParams.get("body").includes("/vizfogyasztas-kalkulator"));
  }
  assert.equal(api.reportHref(source,"hu"),source);
  for(const pair of Object.values(api.dictionary)) assert.ok(pair.length===2&&pair.every(value=>value.trim()));
});

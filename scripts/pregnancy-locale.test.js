"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const api = require("../js/egeszseg/pregnancy-locale");
const model = require("../js/simple-calculators")["terhessegi-kalkulator"];
const { requiresTranslation } = require("./localization-coverage-browser-checks");
const page = "terhessegi-kalkulator";
const html = fs.readFileSync(require.resolve("../kalkulatorok/terhessegi-kalkulator.html"), "utf8");
const main = html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode = text => text.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'");

test("pregnancy static copy, accessible attributes and structured data have reviewed EN/DE translations", () => {
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

test("the pregnancy calculation remains unchanged and every model branch translates", () => {
  const originalNow = Date.now;
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : ["2026-11-13T12:00:00Z"])); }
    static now() { return new Date("2026-11-13T12:00:00Z").getTime(); }
  }
  const NativeDate = global.Date;
  global.Date = FixedDate;
  try {
    assert.deepEqual(model.compute({ lmpDate:"2026-08-01", cycleLength:29 }), [
      ["Becsült terhességi kor", "14. hét 6. nap"], ["Várható szülési dátum", "2027. 05. 09."]
    ]);
    assert.equal(api.translate(page, "14. hét 6. nap", "en"), "14 weeks 6 days");
    assert.equal(api.translate(page, "14. hét 6. nap", "de"), "14 Wochen 6 Tage");
    assert.deepEqual(model.compute({ lmpDate:"2026-08-01", cycleLength:28.5 }).at(-1), ["Ciklushossz kerekítése", "28,5 → 29 nap"]);
    assert.equal(api.translate(page, "28,5 → 29 nap", "en"), "28.5 → 29 days");
    assert.deepEqual(model.compute({ lmpDate:"2026-01-23", cycleLength:28 }).at(-1), ["42 hetes modellhatár", "A naptári becslés elérte a 42 hetet; a klinikai datálás az irányadó."]);
  } finally { global.Date = NativeDate; Date.now = originalNow; }
  assert.deepEqual(model.compute({ lmpDate:"", cycleLength:28 }), [["Becsült terhességi hét","Adj meg egy dátumot"],["Várható szülési dátum","–"]]);
  for (const values of [{lmpDate:"invalid",cycleLength:28},{lmpDate:"2026-01-01",cycleLength:20},{lmpDate:"2999-01-01",cycleLength:28},{lmpDate:"2020-01-01",cycleLength:28}]) {
    assert.throws(() => model.compute(values), error => {
      for (const language of ["en","de"]) assert.ok(api.translate(page,error.message,language), `${language}: ${error.message}`);
      return true;
    });
  }
});

test("dynamic dates, IVF/cycle bases, metadata and report links localize naturally", () => {
  assert.equal(api.translate(page,"2027. május 9.","en"),"9 May 2027");
  assert.equal(api.translate(page,"2027. május 9.","de"),"9. Mai 2027");
  assert.equal(api.translate(page,"2027. 05. 09.","en"),"9 May 2027");
  assert.equal(api.translate(page,"2027. 05. 09.","de"),"9. Mai 2027");
  assert.equal(api.translate(page,"5 napos embrió transzferéből","en"),"From the transfer of a 5-day embryo");
  assert.equal(api.translate(page,"31 napos átlagos ciklusból","de"),"Aus einem durchschnittlichen 31-Tage-Zyklus");
  assert.equal(api.translate(page,"hu-HU","en"),"en-GB");
  assert.equal(api.translate(page,"Schwangerschaftsrechner","hu"),"Terhességi kalkulátor");
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Eredeti";
  for (const language of ["en","de"]) {
    const url = new URL(api.reportHref(source,language));
    assert.ok(url.searchParams.get("subject").includes(language === "en" ? "Pregnancy Due Date Calculator" : "Schwangerschaftsrechner"));
    assert.ok(url.searchParams.get("body").includes("/terhessegi-kalkulator"));
  }
  assert.equal(api.reportHref(source,"hu"),source);
  for (const pair of Object.values(api.dictionary)) assert.ok(pair.length === 2 && pair.every(value => value.trim()));
});

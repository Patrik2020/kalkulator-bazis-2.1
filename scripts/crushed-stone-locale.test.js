"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { translate, reportHref, dictionary } = require("../js/epitoipari/crushed-stone-locale");
const model = require("../js/expansion-batch-05-calculators");
const { requiresTranslation } = require("./localization-coverage-browser-checks");
const page = "zuzottko-kalkulator";
const html = fs.readFileSync(require.resolve("../kalkulatorok/zuzottko-kalkulator.html"), "utf8");
const main = html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode = text => text.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'");

test("crushed stone static copy, attributes and structured data have reviewed EN/DE translations", () => {
  const values = [...main.matchAll(/>([^<>]+)</gu)].map(match => decode(match[1]).replace(/\s+/gu, " ").trim());
  values.push(...[...main.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/gu)].map(match => decode(match[1])));
  const collect = value => {
    if (typeof value === "string" && !/^https?:/u.test(value)) values.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) if (["name", "description", "text", "about", "inLanguage", "mainEntity", "acceptedAnswer", "itemListElement", "@graph"].includes(key)) collect(item);
    }
  };
  collect(JSON.parse(html.match(/id="kb-structured-data"[^>]*>(.*?)<\/script>/u)[1]));
  for (const source of new Set(values)) {
    if (!requiresTranslation(source)) continue;
    for (const language of ["en", "de"]) assert.notEqual(translate(page, source, language), null, `${language}: ${source}`);
  }
});

test("crushed stone results keep the model's quantities and use local decimal separators", () => {
  const result = model.zuzottko(42, 6, 1.7, 15);
  assert.ok(Math.abs(result.baseM3 - 2.52) < 1e-12);
  assert.ok(Math.abs(result.totalM3 - 2.898) < 1e-12);
  assert.ok(Math.abs(result.tons - 4.9266) < 1e-12);
  assert.equal(translate(page, " 2,898 m³", "en"), "2.898 m³");
  assert.equal(translate(page, "4,927 t", "en"), "4.927 t");
  assert.equal(translate(page, "12\u00a0345,678 t", "de"), "12.345,678 t");
  assert.equal(translate(page, "Becsült tömeg:", "de"), "Geschätzte Masse:");
});

test("every validation error emitted by the stone model is localized", () => {
  const cases = [[NaN,8,1.6,10],[0,8,1.6,10],[40,0,1.6,10],[40,NaN,1.6,10],[40,8,0,10],[40,8,NaN,10],[40,8,1.6,-1],[40,8,1.6,NaN],[40,8,1.6,101]];
  for (const args of cases) {
    assert.throws(() => model.zuzottko(...args), error => {
      for (const language of ["en", "de"]) assert.ok(translate(page, error.message, language), `${language}: ${error.message}`);
      return true;
    });
  }
  assert.equal(translate(page, "Sűrűség: az érték legyen nagyobb nullánál.", "en"), "Bulk density: the value must be greater than zero.");
});

test("metadata, email reports, retention feedback and Hungarian restoration are supported", () => {
  assert.equal(translate(page, "hu-HU", "en"), "en-GB");
  assert.equal(translate(page, "Schotterrechner", "hu"), "Zúzottkő kalkulátor");
  assert.ok(translate(page, "Kövesd az útmutatót a könyvjelző mentéséhez.", "de").includes("Lesezeichen"));
  assert.equal(translate(page, "Hirdetés", "en"), "Advertisement");
  const source = "mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s";
  for (const language of ["en", "de"]) {
    const url = new URL(reportHref(source, language));
    assert.equal(url.pathname, "kalkulatorbazis@gmail.com");
    assert.ok(url.searchParams.get("subject").includes(language === "en" ? "Crushed Stone Calculator" : "Schotterrechner"));
    assert.ok(url.searchParams.get("body").includes("/zuzottko-kalkulator"));
  }
  assert.equal(reportHref(source, "hu"), source);
  for (const pair of Object.values(dictionary)) assert.ok(pair.length === 2 && pair.every(value => value.trim()));
});

"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const api = require("../js/egeszseg/body-fat-locale");
const model = require("../js/simple-calculators")["testzsir-kalkulator"];
const { requiresTranslation } = require("./localization-coverage-browser-checks");
const page = "testzsir-kalkulator";
const html = fs.readFileSync(require.resolve("../kalkulatorok/testzsir-kalkulator.html"), "utf8");
const main = html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode = text => text.replace(/&amp;/gu,"&").replace(/&quot;/gu,'"').replace(/&#39;/gu,"'");
const male = { gender:2,waist:90,neck:40,hip:0,height:180 };
const female = { gender:1,waist:75,neck:34,hip:100,height:168 };

test("all body fat copy, SVG labels, accessible attributes and structured-data text have EN/DE translations", () => {
  const values = [...main.matchAll(/>([^<>]+)</gu)].map(match=>decode(match[1]).replace(/\s+/gu," ").trim());
  values.push(...[...main.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/gu)].map(match=>decode(match[1])));
  const collect = value => {
    if(Array.isArray(value)) value.forEach(collect);
    else if(value&&typeof value==="object") for(const [key,item] of Object.entries(value)) {
      if(["name","description","text","about","inLanguage"].includes(key)) values.push(item);
      else if(item&&typeof item==="object") collect(item);
    }
  };
  collect(JSON.parse(html.match(/id="kb-structured-data"[^>]*>(.*?)<\/script>/u)[1]));
  for(const source of new Set(values)) {
    if(!requiresTranslation(source)) continue;
    for(const language of ["en","de"]) assert.notEqual(api.translate(page,source,language),null,`${language}: ${source}`);
  }
});

test("female and male model results and displayed precision remain unchanged", () => {
  assert.deepEqual(model.compute(male),[["Becsült testzsír","18,4%"]]);
  assert.deepEqual(model.compute(female),[["Becsült testzsír","28,1%"]]);
  assert.equal(api.translate(page,"18,4%","en"),"18.4%");
  assert.equal(api.translate(page,"28,1%","de"),"28,1%");
  assert.equal(api.translate(page,"20,0%","en"),"20.0%");
  assert.equal(api.translate(page,"Becsült testzsír:","en"),"Estimated body fat:");
});

test("all validation branches have reviewed translations", () => {
  for(const values of [{...male,waist:0},{...male,height:NaN},{...female,hip:0},{...male,waist:40},{...male,waist:41}]) {
    assert.throws(()=>model.compute(values),error=>{
      for(const language of ["en","de"]) assert.ok(api.translate(page,error.message,language),`${language}: ${error.message}`);
      return true;
    });
  }
});

test("medical limitations, metadata, reports, retention and Hungarian restoration preserve meaning", () => {
  assert.equal(api.translate(page,"hu-HU","en"),"en-GB");
  assert.equal(api.translate(page,"hu-HU","de"),"de-DE");
  assert.equal(api.translate(page,"Body Fat Percentage Calculator","hu"),"Testzsír százalék kalkulátor");
  const caution="A kalkulátor klasszikus körfogat-alapú becslést ad; nem a jelenlegi Navy BCA minősítésére szolgál, és nem gyermekek, várandósság vagy speciális testalkat klinikai értékelésére készült.";
  assert.ok(api.translate(page,caution,"en").includes("not intended for current Navy BCA classification"));
  assert.ok(api.translate(page,caution,"de").includes("weder der aktuellen Navy-BCA-Einstufung"));
  assert.equal(api.translate(page,"Hirdetés","en"),"Advertisement");
  assert.ok(api.translate(page,"Kövesd az útmutatót a könyvjelző mentéséhez.","de"));
  const source="mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Eredeti";
  for(const language of ["en","de"]) {
    const url=new URL(api.reportHref(source,language));
    assert.equal(url.pathname,"kalkulatorbazis@gmail.com");
    assert.ok(url.searchParams.get("subject").includes(language==="en"?"Body Fat Percentage Calculator":"Körperfett-Rechner"));
    assert.ok(url.searchParams.get("body").includes("/testzsir-kalkulator"));
  }
  assert.equal(api.reportHref(source,"hu"),source);
  for(const pair of Object.values(api.dictionary)) assert.ok(pair.length===2&&pair.every(value=>value.trim()));
});

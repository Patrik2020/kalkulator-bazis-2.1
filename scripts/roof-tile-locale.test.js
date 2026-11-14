"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const api=require("../js/epitoipari/roof-tile-locale");
const {requiresTranslation}=require("./localization-coverage-browser-checks");
const page="tetocserep-kalkulator";
const html=fs.readFileSync(require.resolve("../kalkulatorok/tetocserep-kalkulator.html"),"utf8");
const main=html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode=text=>text.replace(/&amp;/gu,"&").replace(/&quot;/gu,'"').replace(/&#39;/gu,"'");
const source=fs.readFileSync(require.resolve("../js/construction-upgrades.js"),"utf8");
const marker="  const config = configs[slug]; if (!config) return;";
assert.ok(source.includes(marker));
const sandbox={window:{location:{pathname:"/kalkulatorok/tetocserep-kalkulator"}},document:{querySelector:()=>({})},Intl};
vm.runInNewContext(source.replace(marker,"  window.roof=configs[slug]; return;"),sandbox);
const model=sandbox.window.roof;
const common={roofArea:120,openings:3,tilesMin:9.2,tilesMax:10,waste:8,packSize:192,manufacturerConfirmed:"yes",purchaseMode:"pieces"};
const rows=values=>Object.fromEntries(model.compute({...common,...values}));

test("all roof tile content, accessible attributes and structured data have EN/DE translations",()=>{
  const values=[...main.matchAll(/>([^<>]+)</gu)].map(match=>decode(match[1]).replace(/\s+/gu," ").trim());
  values.push(...[...main.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/gu)].map(match=>decode(match[1])));
  const collect=value=>{
    if(Array.isArray(value)) value.forEach(collect);
    else if(value&&typeof value==="object") for(const [key,item] of Object.entries(value)) {
      if(["name","description","text","about","inLanguage"].includes(key)) values.push(item);
      else if(item&&typeof item==="object") collect(item);
    }
  };
  collect(JSON.parse(html.match(/id="kb-structured-data"[^>]*>(.*?)<\/script>/u)[1]));
  for(const value of new Set(values)) if(requiresTranslation(value)) for(const language of ["en","de"]) assert.notEqual(api.translate(page,value,language),null,`${language}: ${value}`);
});

test("piece and whole-pack reference quantities, optional pack information and rounding are unchanged",()=>{
  const pieces=rows({});
  assert.equal(pieces["Cserépigény ráhagyással"],"1163–1264 db");
  assert.equal(pieces["Raklap-egyenérték (csak tájékoztató)"],"6,06–6,58");
  assert.ok(!Object.hasOwn(pieces,"Vásárolandó teljes csomag/raklap"));
  const whole=rows({purchaseMode:"whole-pack"});
  assert.equal(whole["Vásárolandó teljes csomag/raklap"],"7–7 db");
  assert.equal(whole["Raklapra kerekített darabszám"],"1344–1344 db");
  const noPack=rows({packSize:""});
  assert.equal(noPack["Cserépigény ráhagyással"],"1163–1264 db");
  assert.ok(!Object.hasOwn(noPack,"Raklap-egyenérték (csak tájékoztató)"));
  assert.equal(api.translate(page,"1163–1264 db","en"),"1,163–1,264 pcs");
  assert.equal(api.translate(page,"1344–1344 db","de"),"1.344–1.344 Stk.");
  assert.equal(api.translate(page,"6,06–6,58","en"),"6.06–6.58");
});

test("manufacturer confirmation, ordering modes and every reachable validation branch translate",()=>{
  const invalid=[{manufacturerConfirmed:"no"},{purchaseMode:"invalid"},{purchaseMode:"whole-pack",packSize:0},{purchaseMode:"whole-pack",packSize:1.5},{roofArea:0},{openings:-1},{openings:120},{tilesMin:0},{tilesMax:0},{tilesMin:11,tilesMax:10},{waste:-1}];
  for(const values of invalid) assert.throws(()=>rows(values),error=>{
    for(const language of ["en","de"]) assert.ok(api.translate(page,error.message,language),`${language}: ${error.message}`);
    return true;
  });
});

test("metadata, reports, retention and Hungarian restoration are complete",()=>{
  assert.equal(api.translate(page,"hu-HU","en"),"en-GB");
  assert.equal(api.translate(page,"hu-HU","de"),"de-DE");
  assert.equal(api.translate(page,"Roof Tile Calculator","hu"),"Tetőcserép kalkulátor");
  assert.equal(api.translate(page,"Hirdetés","en"),"Advertisement");
  assert.ok(api.translate(page,"Kövesd az útmutatót a könyvjelző mentéséhez.","de"));
  const original="mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Eredeti";
  for(const language of ["en","de"]) {
    const url=new URL(api.reportHref(original,language));
    assert.equal(url.pathname,"kalkulatorbazis@gmail.com");
    assert.ok(url.searchParams.get("subject").includes(language==="en"?"Roof Tile Calculator":"Dachziegelrechner"));
    assert.ok(url.searchParams.get("body").includes("/tetocserep-kalkulator"));
  }
  assert.equal(api.reportHref(original,"hu"),original);
  for(const pair of Object.values(api.dictionary)) assert.ok(pair.length===2&&pair.every(value=>value.trim()));
});

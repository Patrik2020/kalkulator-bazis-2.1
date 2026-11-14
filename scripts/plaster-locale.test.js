"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const api=require("../js/epitoipari/plaster-locale");
const {requiresTranslation}=require("./localization-coverage-browser-checks");
const page="vakolat-kalkulator";
const html=fs.readFileSync(require.resolve("../kalkulatorok/vakolat-kalkulator.html"),"utf8");
const main=html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode=text=>text.replace(/&amp;/gu,"&").replace(/&quot;/gu,'"').replace(/&#39;/gu,"'");
const source=fs.readFileSync(require.resolve("../js/construction-upgrades.js"),"utf8");
const marker="  const config = configs[slug]; if (!config) return;";
assert.ok(source.includes(marker));
const sandbox={window:{location:{pathname:"/kalkulatorok/vakolat-kalkulator"}},document:{querySelector:()=>({})},Intl};
vm.runInNewContext(source.replace(marker,"  window.plaster=configs[slug]; return;"),sandbox);
const model=sandbox.window.plaster;
const common={grossArea:40,doorArea:2,windowArea:3,otherArea:0,thickness:10,minConsumption:1.2,maxConsumption:1.5,bagSize:25,waste:8,manufacturerConfirmed:"yes",consumptionMode:"per-mm"};
const rows=values=>Object.fromEntries(model.compute({...common,...values}));

test("plaster content, accessible attributes, dynamic field copy and schema translate to EN/DE",()=>{
  const values=[...main.matchAll(/>([^<>]+)</gu)].map(match=>decode(match[1]).replace(/\s+/gu," ").trim());
  values.push(...[...main.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/gu)].map(match=>decode(match[1])));
  for(const field of model.fields) {
    values.push(field.label);if(field.help)values.push(field.help);
    if(field.options)values.push(...field.options.map(option=>option[1]));
  }
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

test("per-mm and direct per-area calculations preserve kilograms, losses and rounded bag counts",()=>{
  const perMm=rows({});
  assert.equal(perMm["Nettó vakolandó felület"],"35 m²");
  assert.equal(perMm["Nettó anyagigény"],"420–525 kg");
  assert.equal(perMm["Vásárolandó anyag"],"453,6–567 kg");
  assert.equal(perMm["Szükséges zsák"],"19–23 db");
  const perArea=rows({consumptionMode:"per-area",minConsumption:2,maxConsumption:3,thickness:99});
  assert.equal(perArea["Nettó anyagigény"],"70–105 kg");
  assert.equal(perArea["Vásárolandó anyag"],"75,6–113,4 kg");
  assert.equal(perArea["Szükséges zsák"],"4–5 db");
  assert.deepEqual(perArea,rows({consumptionMode:"per-area",minConsumption:2,maxConsumption:3,thickness:1}));
  assert.equal(rows({minConsumption:1.4,maxConsumption:1.4,waste:0})["Szükséges zsák"],"20–20 db");
  assert.equal(api.translate(page,"453,6–567 kg","en"),"453.6–567 kg");
  assert.equal(api.translate(page,"19–23 db","de"),"19–23 Säcke");
  assert.equal(api.translate(page,"10,33 mm","en"),"10.33 mm");
});

test("manufacturer guard and all reachable calculator validation branches translate",()=>{
  const invalid=[{manufacturerConfirmed:"no"},{consumptionMode:"invalid"},{grossArea:0},{doorArea:-1},{windowArea:-1},{otherArea:-1},{doorArea:40},{thickness:0},{minConsumption:0},{maxConsumption:0},{minConsumption:2,maxConsumption:1},{waste:-1},{bagSize:0}];
  for(const values of invalid) assert.throws(()=>rows(values),error=>{
    for(const language of ["en","de"]) assert.ok(api.translate(page,error.message,language),`${language}: ${error.message}`);
    return true;
  });
});

test("thickness map statuses, metadata, reports, retention feedback and HU restoration translate",()=>{
  for(const text of ["Viszonylag egyenletes minta","Érdemes több ponton mérni","Nagy eltérés – helyszíni rétegvastagság-terv indokolt"]) for(const language of ["en","de"]) assert.ok(api.translate(page,text,language));
  assert.equal(api.translate(page,"hu-HU","en"),"en-GB");
  assert.equal(api.translate(page,"hu-HU","de"),"de-DE");
  assert.equal(api.translate(page,"Plaster Calculator","hu"),"Vakolat kalkulátor");
  assert.equal(api.translate(page,"Hirdetés","en"),"Advertisement");
  assert.ok(api.translate(page,"Kövesd az útmutatót a könyvjelző mentéséhez.","de"));
  const original="mailto:kalkulatorbazis@gmail.com?subject=Hibabejelent%C3%A9s&body=Eredeti";
  for(const language of ["en","de"]) {
    const url=new URL(api.reportHref(original,language));
    assert.equal(url.pathname,"kalkulatorbazis@gmail.com");
    assert.ok(url.searchParams.get("subject").includes(language==="en"?"Plaster Calculator":"Putzrechner"));
    assert.ok(url.searchParams.get("body").includes("/vakolat-kalkulator"));
  }
  assert.equal(api.reportHref(original,"hu"),original);
  for(const pair of Object.values(api.dictionary)) assert.ok(pair.length===2&&pair.every(value=>value.trim()));
});

"use strict";
const test=require("node:test"), assert=require("node:assert/strict"), fs=require("node:fs"), vm=require("node:vm");
const api=require("../js/site-language-inner"), data=require("../js/locales/support-categories");
const {requiresTranslation}=require("./localization-coverage-browser-checks");
const decode=s=>s.replace(/&amp;/gu,"&").replace(/&quot;/gu,'"').replace(/&#39;/gu,"'").replace(/&nbsp;/gu," ");
const known=s=>!requiresTranslation(s)||Object.hasOwn(data.dictionary,s)||api.translate(s,"en")!==null;
test("all seven category/catalogue pages load reviewed data and translate source copy, accessible labels and metadata",()=>{
  for(const page of data.pages){
    assert.ok(api.isSupportPage('/'+page));
    assert.ok(api.isSupportPage('/preview/'+page.replace(/\.html$/u,'')));
    const html=fs.readFileSync(require.resolve('../'+page),'utf8');
    assert.ok(html.includes('src="js/locales/support-categories.js'));
    const main=html.match(/<main\b[\s\S]*?<\/main>/u)[0];
    const copy=[...main.matchAll(/>([^<>]+)</gu)].map(m=>decode(m[1]).replace(/\s+/gu,' ').trim());
    copy.push(...[...main.matchAll(/(?:aria-label|placeholder|title)="([^"]+)"/gu)].map(m=>decode(m[1])));
    copy.push(decode(html.match(/<title>(.*?)<\/title>/u)[1]));
    for(const text of copy)assert.ok(known(text),page+': '+text);
    const schema=JSON.parse(html.match(/id="kb-structured-data"[^>]*>(.*?)<\/script>/u)[1]);
    const walk=value=>{if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){if(['name','text','description','about','inLanguage'].includes(key))assert.ok(known(item),page+': schema '+item);else if(item&&typeof item==='object')walk(item);}};
    walk(schema);
  }
  assert.equal(api.isSupportPage('/kalkulatorok/vakolat-kalkulator'),false);
});
test("every visible active calculator card can be translated without changing canonical product data",()=>{
  const box={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../js/site-data'),'utf8'),box);
  for(const item of box.window.KB_DATA.calculators.filter(c=>!c.hidden))for(const text of [item.title,item.description]){
    assert.ok(known(text),text);
    for(const lang of ['en','de'])assert.ok(api.translate(text,lang),lang+': '+text);
  }
});
test("search messages and all reviewed pairs have English and German copy",()=>{
  for(const [source,pair] of Object.entries(data.dictionary)){
    assert.ok(source.trim());assert.equal(pair.length,2);assert.ok(pair.every(s=>typeof s==='string'&&s.trim()));
    for(const language of ['en','de'])assert.ok(api.translate(source,language),source);
  }
  assert.equal(api.translate('Nincs találat. Próbálj másik kifejezést vagy válassz kategóriát.','en'),'No results. Try another phrase or choose a category.');
  assert.equal(api.translate('Felhasználó egyedi bevitele: 123,45','en'),null);
});

test("all runtime Wise banner variants and action labels translate after consent changes",()=>{
  const source=fs.readFileSync(require.resolve('../js/wise-banner-enhancer'),'utf8');
  const values=[...source.matchAll(/(?:eyebrow|title|text|action): "([^"]+)"/gu)].map(m=>m[1]);
  values.push(...[...source.matchAll(/action: "([^"]+)"/gu)].map(m=>m[1]+' →'));
  values.push('Partnerlink. Az aktuális díjakat és feltételeket a Wise oldalán ellenőrizd.');
  for(const text of values)for(const language of ['en','de'])assert.ok(api.translate(text,language),language+': '+text);
});

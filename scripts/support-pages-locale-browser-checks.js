"use strict";
const assert=require("node:assert/strict");
const {pages}=require("../js/locales/support-categories");
const api=require("../js/site-language-inner");
async function checkSupportPagesLocale({navigate,evaluate,setViewport,collectMainCopy,requiresTranslation}){
  const choose=language=>evaluate(`(async()=>{const el=document.getElementById('kbInternalLanguage');el.value=${JSON.stringify(language)};el.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const copy=()=>evaluate(`(${collectMainCopy.toString()})()`);
  for(const width of [390,1440])for(const path of pages){
    await setViewport(width,1000);await navigate('/'+path.replace(/\.html$/u,''));
    await evaluate(`(async()=>{for(let i=0;i<300&&(!window.KB_SUPPORT_PAGE_LOCALE||!document.getElementById('kbInternalLanguage'));i++)await new Promise(requestAnimationFrame)})()`);
    await choose('hu');const original=await copy();assert.ok(original.length>10,path);
    const before=JSON.parse(await evaluate(`JSON.stringify({title:document.title,description:document.querySelector('meta[name="description"]').content,schema:document.getElementById('kb-structured-data').textContent})`));
    for(const language of ['en','de']){
      await choose(language);const actual=new Set(await copy());
      const missing=original.filter(text=>requiresTranslation(text)&&actual.has(text)&&api.translate(text,language)!==text);
      assert.deepEqual(missing,[],`${path}/${language}: untranslated source copy`);
      const state=JSON.parse(await evaluate(`JSON.stringify({title:document.title,description:document.querySelector('meta[name="description"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),width:document.documentElement.scrollWidth})`));
      assert.equal(state.title,api.translate(before.title,language));
      assert.equal(state.description,api.translate(before.description,language));
      const pageSchema=state.schema['@graph'].find(node=>['CollectionPage','WebPage'].includes(node['@type']));
      assert.ok(pageSchema,`${path}/${language}: missing page schema`);
      assert.equal(pageSchema.inLanguage,language==='en'?'en-GB':'de-DE',`${path}: page schema language`);
      for(const node of state.schema['@graph'].filter(node=>Object.hasOwn(node,'inLanguage')))assert.equal(node.inLanguage,language==='en'?'en-GB':'de-DE',`${path}: ${node['@type']} language`);
      assert.ok(state.width<=width+1,`${path}/${language}: overflow at ${width}px`);
      const query=language==='en'?'concrete':'Beton';
      await evaluate(`(async()=>{const el=document.getElementById('calculatorSearch');el.value=${JSON.stringify(query)};el.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      const search=JSON.parse(await evaluate(`JSON.stringify({value:document.getElementById('calculatorSearch').value,results:document.getElementById('calculatorSearchResults').textContent})`));
      assert.equal(search.value,query);assert.ok(search.results.includes(language==='en'?'Concrete':'Beton'),path+': localized search index');
      assert.ok(!search.results.includes('Szükséges beton mennyiségének kiszámítása.'),path+': localized search result description');
      await evaluate(`(async()=>{const el=document.getElementById('calculatorSearch');el.value='zzzznincs123';el.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      assert.equal(await evaluate(`document.querySelector('.search-empty').textContent.trim()`),language==='en'?'No results. Try another phrase or choose a category.':'Keine Treffer. Versuche einen anderen Suchbegriff oder wähle eine Kategorie.');
      await evaluate(`document.getElementById('calculatorSearch').value='';document.getElementById('calculatorSearch').dispatchEvent(new Event('input',{bubbles:true}))`);
    }
    await choose('hu');assert.deepEqual(await copy(),original,path+': HU restoration');
    assert.equal(await evaluate('document.title'),before.title);
    assert.deepEqual(JSON.parse(await evaluate(`document.getElementById('kb-structured-data').textContent`)),JSON.parse(before.schema),path+': HU schema restoration');
  }
  console.log('Support pages: 7 category/catalogue pages, EN/DE full copy, localized search, metadata, HU restoration and 390/1440px widths passed.');
}
module.exports={checkSupportPagesLocale};

"use strict";
const assert=require('node:assert/strict');
const {pages}=require('../js/locales/support-information');
const api=require('../js/site-language-inner');
async function checkInformationPagesLocale({navigate,evaluate,setViewport,collectMainCopy,requiresTranslation}){
  const choose=language=>evaluate(`(async()=>{const el=document.getElementById('kbInternalLanguage');if(!el)throw Error('Missing information-page language selector');el.value=${JSON.stringify(language)};el.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const copy=()=>evaluate(`(${collectMainCopy.toString()})()`);
  const snapshot=()=>evaluate(`JSON.stringify({title:document.title,description:document.querySelector('meta[name="description"]').content,schema:document.getElementById('kb-structured-data')?.textContent||null,links:[...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')),width:document.documentElement.scrollWidth})`);
  for(const width of [390,1440])for(const path of pages){
    await setViewport(width,1000);await navigate('/'+path.replace(/\.html$/u,''));
    await evaluate(`(async()=>{for(let i=0;i<300&&(!window.KB_SUPPORT_PAGE_LOCALE||!document.getElementById('kbInternalLanguage'));i++)await new Promise(requestAnimationFrame)})()`);
    await choose('hu');const original=await copy();assert.ok(original.length>10,path);
    const before=JSON.parse(await snapshot());
    for(const language of ['en','de']){
      await choose(language);const actual=new Set(await copy());
      const missing=original.filter(text=>requiresTranslation(text)&&actual.has(text)&&api.translate(text,language)!==text);
      assert.deepEqual(missing,[],`${path}/${language}: untranslated source copy`);
      const state=JSON.parse(await snapshot());
      assert.equal(state.title,api.translate(before.title,language),path+': localized title');
      assert.equal(state.description,api.translate(before.description,language),path+': localized description');
      assert.deepEqual(state.links,before.links,path+': contact and source links must remain unchanged');
      if(state.schema)for(const node of JSON.parse(state.schema)['@graph']||[])if(Object.hasOwn(node,'inLanguage'))assert.equal(node.inLanguage,language==='en'?'en-GB':'de-DE',path+': schema language');
      assert.ok(state.width<=width+1,`${path}/${language}: overflow at ${width}px`);
    }
    await choose('hu');assert.deepEqual(await copy(),original,path+': HU restoration');
    const restored=JSON.parse(await snapshot());
    assert.equal(restored.title,before.title);assert.equal(restored.description,before.description);
    assert.deepEqual(restored.schema?JSON.parse(restored.schema):null,before.schema?JSON.parse(before.schema):null,path+': HU schema restoration');
  }
  console.log('Information pages: 13 privacy/legal/contact/trust pages, EN/DE source coverage, metadata, link preservation, HU restoration and 390/1440px widths passed.');
}
module.exports={checkInformationPagesLocale};

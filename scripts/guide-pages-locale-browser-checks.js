/* global document, NodeFilter */
"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs');
const {pages}=require('../js/locales/support-guides'),api=require('../js/site-language-inner');
function collectGuideCopy(){
 const values=[],skip='script,style,textarea,pre,code,[translate=no],[contenteditable],.kb-inner-language';
 const add=value=>{const text=value.replace(/\s+/gu,' ').trim();if(text)values.push(text);};
 for(const region of document.querySelectorAll('main,body>header,body>footer,#header,#footer')){
  const walker=document.createTreeWalker(region,NodeFilter.SHOW_TEXT);
  while(walker.nextNode())if(!walker.currentNode.parentElement.closest(skip))add(walker.currentNode.nodeValue);
  for(const el of region.querySelectorAll('[aria-label],[placeholder],[title],[alt]'))if(!el.closest(skip))for(const name of ['aria-label','placeholder','title','alt'])if(el.hasAttribute(name))add(el.getAttribute(name));
 }
 return [...new Set(values)].sort();
}
async function checkGuidePagesLocale({navigate,evaluate,setViewport,requiresTranslation}){
 const frame='await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);';
 const choose=language=>evaluate(`(async()=>{const el=document.getElementById('kbInternalLanguage');if(!el)throw Error('Missing guide selector');el.value=${JSON.stringify(language)};el.dispatchEvent(new Event('change',{bubbles:true}));${frame}})()`);
 const copy=()=>evaluate(`(${collectGuideCopy.toString()})()`);
 const snapshot=()=>evaluate(`JSON.stringify({title:document.title,description:document.querySelector('meta[name="description"]').content,schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(el=>JSON.parse(el.textContent)),links:[...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')),width:document.documentElement.scrollWidth})`);
 for(const width of [390,1440])for(const path of pages){
  await setViewport(width,1000);await navigate('/'+path.replace(/\.html$/u,''));
  await evaluate(`(async()=>{for(let i=0;i<300&&(!window.KB_SUPPORT_PAGE_LOCALE||!document.getElementById('kbInternalLanguage')||(${path.includes('/wise/')?'!document.querySelector(".wise-use-selector")':'false'}));i++)await new Promise(requestAnimationFrame)})()`);
  await choose('hu');const original=await copy(),before=JSON.parse(await snapshot());assert.ok(original.length>30,path);
  for(const language of ['en','de']){
   await choose(language);const actual=new Set(await copy());
   assert.deepEqual(original.filter(text=>requiresTranslation(text)&&actual.has(text)&&api.translate(text,language)!==text),[],`${path}/${language}: untranslated source copy including header/footer`);
   const state=JSON.parse(await snapshot());assert.equal(state.title,api.translate(before.title,language),path+': title');assert.equal(state.description,api.translate(before.description,language),path+': description');
   assert.deepEqual(state.links,before.links,path+': links');assert.ok(state.width<=width+1,`${path}/${language}: overflow at ${width}px`);
   const walk=v=>{if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')for(const[k,item]of Object.entries(v)){if(k==='inLanguage')assert.equal(item,language==='en'?'en-GB':'de-DE',path+': schema language');else if(item&&typeof item==='object')walk(item);}};state.schemas.forEach(walk);
   if(path.includes('penzugyi-tudatossag/')){
    const source=fs.readFileSync(require.resolve('../landing-pages/penzugyi-tudatossag/js/penzugyi-tudatossag.js'),'utf8');
    const titles=[...source.matchAll(/title: "([^"]+)"/gu)].map(m=>m[1]);assert.equal(titles.length,4);
    for(const[n,index]of [[0,0],[4,1],[7,2],[10,3]]){
     const result=JSON.parse(await evaluate(`(async()=>{const inputs=[...document.querySelectorAll('#readinessChecklist input[type="checkbox"]')];inputs.forEach((el,i)=>el.checked=i<${n});inputs[0].dispatchEvent(new Event('change',{bubbles:true}));${frame}return JSON.stringify({title:document.getElementById('readinessTitle').textContent,score:document.getElementById('readinessScore').textContent,checked:inputs.filter(el=>el.checked).length})})()`));
     assert.equal(result.title,api.translate(titles[index],language));assert.equal(result.score,n+'/10');assert.equal(result.checked,n);
    }
    await choose(language==='en'?'de':'en');assert.equal(await evaluate(`document.querySelectorAll('#readinessChecklist input:checked').length`),10);await choose(language);
    await evaluate(`(async()=>{const inputs=[...document.querySelectorAll('#readinessChecklist input')];inputs.forEach(el=>el.checked=false);inputs[0].dispatchEvent(new Event('change',{bubbles:true}));${frame}})()`);
   }
   if(path.includes('/wise/')){
    const source=fs.readFileSync(require.resolve('../landing-pages/wise/js/wise.js'),'utf8');
    const titles=[...source.matchAll(/title: "([^"]+)"/gu)].map(m=>m[1]),ctas=[...source.matchAll(/cta: "([^"]+)"/gu)].map(m=>m[1]+' →');
    for(const[index,key]of ['transfer','travel','income','currencies'].entries()){
     const state=JSON.parse(await evaluate(`(async()=>{document.querySelector('button[data-wise-use="${key}"]').click();${frame}return JSON.stringify({title:document.querySelector('[data-wise-result-title]').textContent,cta:document.querySelector('[data-wise-result-link]').textContent,pressed:document.querySelector('button[data-wise-use="${key}"]').getAttribute('aria-pressed')})})()`));
     assert.equal(state.title,api.translate(titles[index],language));assert.equal(state.cta,api.translate(ctas[index],language));assert.equal(state.pressed,'true');
    }
    await evaluate(`(async()=>{document.querySelector('button[data-wise-use="transfer"]').click();${frame}})()`);
    const faq=await evaluate(`(()=>{const b=document.querySelector('.faq-question');b.click();const open=b.getAttribute('aria-expanded');b.click();return open==='true'&&b.getAttribute('aria-expanded')==='false'})()`);assert.equal(faq,true);
   }
  }
  await choose('hu');assert.deepEqual(await copy(),original,path+': HU restoration');const restored=JSON.parse(await snapshot());assert.equal(restored.title,before.title);assert.equal(restored.description,before.description);assert.deepEqual(restored.schemas,before.schemas,path+': HU schemas');assert.deepEqual(restored.links,before.links,path+': interactive links');
 }
 console.log('Guide pages: 8 pages, EN/DE main/header/footer/metadata/schema, Wise four choices, readiness four levels, preserved inputs/links, HU restoration and 390/1440px passed.');
}
module.exports={checkGuidePagesLocale,collectGuideCopy};

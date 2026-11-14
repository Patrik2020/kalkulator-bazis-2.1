"use strict";
const assert=require('node:assert/strict');
const {pages}=require('../js/locales/support-final-pages');
const api=require('../js/site-language-inner');
const {collectGuideCopy}=require('./guide-pages-locale-browser-checks');
async function checkFinalPagesLocale({navigate,evaluate,setViewport,requiresTranslation}){
 const frames='await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);';
 const choose=language=>evaluate(`(async()=>{const el=document.getElementById('kbInternalLanguage');if(el){el.value=${JSON.stringify(language)};el.dispatchEvent(new Event('change',{bubbles:true}));}else{const b=document.querySelector('#langPop [data-lang="${language}"]');if(!b)throw Error('Missing home language option');b.click();}${frames}})()`);
 const copy=()=>evaluate(`(${collectGuideCopy.toString()})()`);
 const unchanged=(original,actual,label,language)=>assert.deepEqual(original.filter(s=>requiresTranslation(s)&&actual.includes(s)&&api.translate(s,language)!==s),[],label);
 const snapshot=()=>evaluate(`JSON.stringify({title:document.title,description:document.querySelector('meta[name="description"]').content,schemas:[...document.querySelectorAll('script[type="application/ld+json"]')].map(el=>JSON.parse(el.textContent)),links:[...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')),inputs:[...document.querySelectorAll('main input,main select')].map(el=>[el.id,el.id==='heroSalaryAmount'?el.value.replace(/[^0-9-]/g,''):el.value,el.checked]),width:document.documentElement.scrollWidth})`);
 const resultCopy=()=>evaluate(`(()=>{const host=document.querySelector('[data-decision-result],[data-comparison-result]');const walker=document.createTreeWalker(host,NodeFilter.SHOW_TEXT),copy=[];while(walker.nextNode()){const s=walker.currentNode.nodeValue.replace(/\\s+/gu,' ').trim();if(s)copy.push(s);}return copy})()`);
 const numbers=()=>evaluate(`JSON.stringify([...document.querySelectorAll('.home-v2-metric strong,.decision-result-metric strong')].map(el=>el.textContent.replace(/[^0-9.,+−-]/g,'')))`);
 for(const width of [390,1440])for(const path of pages){
  await setViewport(width,1100);await navigate('/'+path.replace(/index\.html$/u,'').replace(/\.html$/u,''));
  await evaluate(`(async()=>{for(let i=0;i<300&&(!window.KB_FINAL_PAGE_LOCALE||!document.querySelector('#kbInternalLanguage,#langPop [data-lang]'));i++)await new Promise(requestAnimationFrame);localStorage.removeItem('kb-decision-summaries-v1')})()`);
  await choose('hu');if(path==='index.html')await evaluate(`(async()=>{for(let i=0;i<600&&document.getElementById('heroSalaryWidget')?.classList.contains('is-calculating');i++)await new Promise(requestAnimationFrame)})()`);const original=await copy(),before=JSON.parse(await snapshot());assert.ok(original.length>20,path);
  for(const language of ['en','de']){
   await choose(language);unchanged(original,await copy(),path+'/'+language+': source copy including chrome',language);
   const state=JSON.parse(await snapshot());assert.equal(state.title,api.translate(before.title,language),path+': title');assert.equal(state.description,api.translate(before.description,language),path+': description');assert.deepEqual(state.links,before.links,path+': links');assert.deepEqual(state.inputs,before.inputs,path+': inputs');assert.ok(state.width<=width+1,path+'/'+language+': overflow');
   const walk=v=>{if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')for(const[k,item]of Object.entries(v)){if(k==='inLanguage')assert.equal(item,language==='en'?'en-GB':'de-DE');else if(item&&typeof item==='object')walk(item);}};state.schemas.forEach(walk);
  }
  await choose('hu');assert.deepEqual(await copy(),original,path+': HU restoration');const restored=JSON.parse(await snapshot());assert.deepEqual(restored.schemas,before.schemas);assert.equal(restored.title,before.title);
  if(path==='index.html'){
   for(const [language,query]of [['en','salary'],['de','Gehalt']]){
    await choose(language);const count=await evaluate(`(async()=>{const input=document.getElementById('calculatorSearch');input.value=${JSON.stringify(query)};input.dispatchEvent(new Event('input',{bubbles:true}));${frames}return document.querySelectorAll('#calculatorSearchResults .search-result').length})()`);assert.ok(count>0,'localized home search '+language);
   }
   await evaluate(`(()=>{const input=document.getElementById('calculatorSearch');input.value='';input.dispatchEvent(new Event('input',{bubbles:true}))})()`);await choose('hu');
  }
  if(!['dontesek.html','osszehasonlitas.html'].includes(path))continue;
  const kind=path==='dontesek.html'?'decision':'comparison';
  const modes=await evaluate(`[...document.querySelectorAll('[data-${kind}-mode]')].map(el=>el.dataset.${kind}Mode)`);
  assert.equal(modes.length,kind==='decision'?3:4);
  for(const mode of modes){
   await choose('hu');await evaluate(`(async()=>{document.querySelector('[data-${kind}-mode="${mode}"]').click();document.querySelector('form[data-${kind}-form="${mode}"]').requestSubmit();${frames}})()`);
   const hu=await resultCopy(),numeric=await numbers(),inputState=JSON.parse(await snapshot()).inputs;assert.ok(hu.length>10,kind+'/'+mode);
   for(const language of ['en','de']){
    await choose(language);unchanged(hu,await resultCopy(),kind+'/'+mode+'/'+language+': dynamic summary',language);assert.equal(await numbers(),numeric,'numeric results unchanged');assert.deepEqual(JSON.parse(await snapshot()).inputs,inputState,'input state unchanged');
    const share=JSON.parse(await evaluate(`(async()=>{Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{window.__kbTestShare=payload.text}});document.querySelector('[data-home-v2-share],[data-result-share]').click();${frames}return JSON.stringify({text:window.__kbTestShare,status:document.querySelector('[data-home-v2-status],[data-result-status]').textContent})})()`));
    assert.ok(share.text.includes('Kalkulátor Bázis'));assert.ok(!share.text.includes('tájékoztató'));assert.equal(share.status,api.translate('Megosztási felület megnyitva.',language));
   }
   await evaluate(`(async()=>{document.querySelector('[data-home-v2-save],[data-result-save]').click();${frames}})()`);
   const stored=await evaluate(`localStorage.getItem('kb-decision-summaries-v1')`);assert.ok(stored);await choose('en');assert.equal(await evaluate(`localStorage.getItem('kb-decision-summaries-v1')`),stored,'language switch cannot alter stored data');await choose('hu');
  }
  if(kind==='decision'){
   await evaluate(`(async()=>{document.querySelector('[data-decision-mode="home"]').click();const form=document.querySelector('[data-home-decision-v2]');form.noValidate=true;form.elements.price.value='0';form.elements.income.value='0';form.elements.years.value='50';form.requestSubmit();${frames}})()`);
   const errors=await resultCopy();assert.ok(errors.includes('Adj meg pozitív ingatlanárat.'));for(const language of ['en','de']){await choose(language);unchanged(errors,await resultCopy(),'home validation '+language,language);}
  }
  await evaluate(`localStorage.removeItem('kb-decision-summaries-v1')`);
 }
 console.log('Final pages: 4 pages, EN/DE source/chrome/metadata/schema, home search, 3 decision + 4 comparison modes, numeric/input/storage preservation, sharing and home validation at 390/1440px passed.');
}
module.exports={checkFinalPagesLocale};

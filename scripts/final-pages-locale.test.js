"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('../js/site-language-inner'),shared=require('../js/shared-ui-locale'),data=require('../js/locales/support-final-pages');
const {requiresTranslation}=require('./localization-coverage-browser-checks');
const home={window:{}};for(const lang of ['hu','en','de'])require('node:vm').runInNewContext(fs.readFileSync(require.resolve('../js/home-redesign-i18n-'+lang+'.js'),'utf8'),home);
const homeCopy=new Set(Object.entries(home.window.KB_HOME_I18N.hu).filter(([k])=>home.window.KB_HOME_I18N.en[k]&&home.window.KB_HOME_I18N.de[k]).map(([,v])=>v));
const decode=s=>s.replace(/&amp;/gu,'&').replace(/&quot;/gu,'"').replace(/&#39;/gu,"'").replace(/&nbsp;/gu,' ');
const known=s=>!requiresTranslation(s)||api.translate(s,'en')!==null||shared.translate(s,'en',data.dictionary)!==null;
test('four final pages translate source copy, accessible labels, metadata and all existing schema blocks',()=>{
 const missing=[];
 assert.equal(data.pages.length,4);
 for(const lang of ['en','de'])assert.ok(api.translate('Hirdetés',lang));
 for(const page of data.pages){
  assert.ok(api.isSupportPage('/'+page));
  const html=fs.readFileSync(require.resolve('../'+page),'utf8');
  assert.ok(html.includes('src="js/locales/support-final-pages.js'));
  const regions=[...html.matchAll(/<(main|header|footer)\b[\s\S]*?<\/\1>/gu)].map(m=>m[0].replace(/<(script|style|code|pre)\b[^>]*>[\s\S]*?<\/\1>/gu,''));
  const values=regions.flatMap(s=>[...[...s.matchAll(/>([^<>]+)</gu)].map(m=>decode(m[1]).replace(/\s+/gu,' ').trim()),...[...s.matchAll(/\s(?:aria-label|placeholder|title|alt)="([^"]+)"/gu)].map(m=>decode(m[1]))]);
  values.push(decode(html.match(/<title>(.*?)<\/title>/u)[1]));
  for(const m of html.matchAll(/<meta\b[^>]*>/gu)){
   const a=Object.fromEntries([...m[0].matchAll(/([\w:-]+)="([^"]*)"/gu)].map(a=>[a[1],a[2]]));
   if(['description','og:title','og:description','twitter:title','twitter:description'].includes(a.name||a.property))values.push(decode(a.content));
  }
  const walk=value=>{if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value)){if(['name','text','description','about','inLanguage'].includes(k)&&typeof v==='string')values.push(v);else if(v&&typeof v==='object')walk(v);}};
  for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gu))walk(JSON.parse(m[1]));
  for(const text of values)if(!known(text)&&!(page==='index.html'&&homeCopy.has(text)))missing.push(page+': '+text);
 }
 assert.deepEqual(missing,[]);
});
test('reviewed final-page templates preserve numeric readouts and reject arbitrary prose',()=>{
 for(const [hu,en,de]of data.templates){
  const args=['123 456,7','456 789'];const source=hu.replace(/\{(\d+)\}/gu,(_,i)=>args[i]);
  assert.equal(data.translate(source,'en'),en.replace(/\{(\d+)\}/gu,(_,i)=>args[i]));
  assert.equal(data.translate(source,'de'),de.replace(/\{(\d+)\}/gu,(_,i)=>args[i]));
 }
 assert.equal(data.translate('A és B a megadott fő mutató alapján gyakorlatilag azonos.','en'),'A and B are effectively equal on the main indicator entered.');
 assert.equal(data.translate('egyedi felhasználói szöveg havi változás','en'),null);
 assert.equal(data.translate('123 éves megtakarítási terv!','en'),null);
 for(const[source,pair]of Object.entries(data.dictionary)){
  assert.equal(pair.length,2);assert.ok(pair.every(s=>typeof s==='string'&&s.trim()),source);
 }
});

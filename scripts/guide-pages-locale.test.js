"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('../js/site-language-inner'),shared=require('../js/shared-ui-locale'),data=require('../js/locales/support-guides');
const {requiresTranslation}=require('./localization-coverage-browser-checks');
const decode=s=>s.replace(/&amp;/gu,'&').replace(/&quot;/gu,'"').replace(/&#39;/gu,"'").replace(/&nbsp;/gu,' ');
const known=s=>!requiresTranslation(s)||api.translate(s,'en')!==null;
test('eight guides translate source copy, accessible labels, metadata and all existing schema blocks',()=>{
 assert.equal(data.pages.length,8);
 for(const page of data.pages){
  assert.ok(api.isSupportPage('/'+page));
  const html=fs.readFileSync(require.resolve('../'+page),'utf8');
  assert.ok(html.includes('src="../../js/locales/support-guides.js'));
  const regions=[...html.matchAll(/<(main|header|footer)\b[\s\S]*?<\/\1>/gu)].map(m=>m[0].replace(/<(script|style|code|pre)\b[^>]*>[\s\S]*?<\/\1>/gu,''));
  const values=regions.flatMap(s=>[...[...s.matchAll(/>([^<>]+)</gu)].map(m=>decode(m[1]).replace(/\s+/gu,' ').trim()),...[...s.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]+)"/gu)].map(m=>decode(m[1]))]);
  values.push(decode(html.match(/<title>(.*?)<\/title>/u)[1]));
  for(const m of html.matchAll(/<meta\b[^>]*>/gu)){
   const a=Object.fromEntries([...m[0].matchAll(/([\w:-]+)="([^"]*)"/gu)].map(a=>[a[1],a[2]]));
   if(['description','og:title','og:description','twitter:title','twitter:description'].includes(a.name||a.property))values.push(decode(a.content));
  }
  const walk=value=>{if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value)){if(['name','text','description','about','inLanguage'].includes(k)&&typeof v==='string')values.push(v);else if(v&&typeof v==='object')walk(v);}};
  for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gu))walk(JSON.parse(m[1]));
  for(const text of values)assert.ok(known(text),page+': '+text);
 }
});
test('guide dictionary pairs are complete and shared chrome consumes the same reviewed data',()=>{
 for(const[source,pair]of Object.entries(data.dictionary)){
  assert.equal(pair.length,2);assert.ok(pair.every(s=>typeof s==='string'&&s.trim()),source);
  for(const language of ['en','de'])assert.ok(api.translate(source,language),source);
 }
 assert.equal(shared.translate('Mobil menü megnyitása','en',data.dictionary),'Open mobile menu');
 assert.equal(shared.translate('  Mobil menü megnyitása  ','de',data.dictionary),'  Mobiles Menü öffnen  ');
 assert.equal(shared.translate('egyedi 987 felhasználói érték','de',data.dictionary),null);
});
test('all Wise use-case results and readiness levels have both languages',()=>{
 for(const path of ['landing-pages/wise/js/wise.js','landing-pages/penzugyi-tudatossag/js/penzugyi-tudatossag.js']){
  const source=fs.readFileSync(require.resolve('../'+path),'utf8');
  const copy=[...source.matchAll(/(?:label|title|text|cta): "([^"]+)"/gu)].map(m=>m[1]);
  copy.push(...[...source.matchAll(/cta: "([^"]+)"/gu)].map(m=>m[1]+' →'));
  assert.ok(copy.length>5,path);
  for(const text of copy)for(const language of ['en','de'])assert.ok(api.translate(text,language),text);
 }
});

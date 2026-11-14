"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const api=require('../js/site-language-inner'),data=require('../js/locales/support-information');
const {requiresTranslation}=require('./localization-coverage-browser-checks');
const decode=s=>s.replace(/&amp;/gu,'&').replace(/&quot;/gu,'"').replace(/&#39;/gu,"'").replace(/&nbsp;/gu,' ');
const known=s=>!requiresTranslation(s)||api.translate(s,'en')!==null;
test('all thirteen information pages translate visible source copy, labels, metadata and existing schemas',()=>{
  for(const page of data.pages){
    assert.ok(api.isSupportPage('/'+page));
    const html=fs.readFileSync(require.resolve('../'+page),'utf8');
    assert.ok(html.includes('src="js/locales/support-information.js'),page);
    const main=html.match(/<main\b[\s\S]*?<\/main>/u)[0].replace(/<(code|pre|script|style)\b[^>]*>[\s\S]*?<\/\1>/gu,'<$1></$1>');
    const values=[...main.matchAll(/>([^<>]+)</gu)].map(m=>decode(m[1]).replace(/\s+/gu,' ').trim());
    values.push(...[...main.matchAll(/(?:aria-label|placeholder|title)="([^"]+)"/gu)].map(m=>decode(m[1])));
    values.push(decode(html.match(/<title>(.*?)<\/title>/u)[1]));
    const metaTags=[...html.matchAll(/<meta\b[^>]*>/gu)].map(m=>Object.fromEntries([...m[0].matchAll(/([\w:-]+)="([^"]*)"/gu)].map(a=>[a[1],a[2]])));
    assert.ok(metaTags.some(a=>a.name==='description'),page+': missing description');
    for(const a of metaTags)if(['description','og:title','og:description','twitter:title','twitter:description'].includes(a.name||a.property))values.push(decode(a.content));
    const walk=value=>{if(Array.isArray(value))value.forEach(walk);else if(value&&typeof value==='object')for(const[key,item]of Object.entries(value)){if(['name','text','description','about','inLanguage'].includes(key))values.push(item);else if(item&&typeof item==='object')walk(item);}};
    const schema=html.match(/id="kb-structured-data"[^>]*>([\s\S]*?)<\/script>/u);if(schema)walk(JSON.parse(schema[1]));
    for(const text of values)assert.ok(known(text),page+': '+text);
  }
});
test('all information-page pairs are complete and original identifiers and time limits are retained',()=>{
  for(const[source,pair]of Object.entries(data.dictionary)){
    assert.ok(source.trim());assert.equal(pair.length,2);assert.ok(pair.every(s=>typeof s==='string'&&s.trim()));
    for(const language of ['en','de'])assert.ok(api.translate(source,language),source);
  }
  assert.equal(api.translate('1181 Budapest, Havanna utca 73.','en'),'1181 Budapest, Havanna utca 73.');
  assert.equal(api.translate('kalkulatorbazis@gmail.com','de'),'kalkulatorbazis@gmail.com');
  for(const language of ['en','de']){
    assert.ok(api.translate(': verziózott hozzájárulási döntés, legfeljebb 180 napig',language).includes('180'));
    assert.ok(api.translate('Utolsó frissítés: 2026.10.17.',language).includes('2026'));
  }
});
test('standalone plugin information uses the existing selector without adding global advertising scripts',()=>{
  for(const page of data.pages.filter(p=>p.startsWith('plugin-'))){
    const html=fs.readFileSync(require.resolve('../'+page),'utf8');
    assert.ok(html.includes('class="header-actions"'));
    assert.ok(html.includes('src="js/site-language-inner.js'));
    assert.ok(!html.includes('src="js/global-head.js'));
  }
});

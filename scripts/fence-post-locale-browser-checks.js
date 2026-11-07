"use strict";
const assert = require("node:assert/strict");
async function checkFencePostLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000); await navigate("/kalkulatorok/kerites-oszlop-kalkulator.html");
    await evaluate(`(async()=>{const l=document.getElementById('fenceLength'),s=document.getElementById('fenceSpacing');l.value='17';s.value='2.5';l.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame)})()`);
    const before = await evaluate(`JSON.stringify(['fenceLength','fenceSpacing'].map(id=>[id,document.getElementById(id).value]))`);
    for (const [language, heading, bays, posts, spacing] of [["en","Fence Post Calculator","7 pcs","8 pcs","2.43 m"],["de","Zaunpfosten-Rechner","7 Stk.","8 Stk.","2,43 m"]]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('fenceResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href,values:['fenceLength','fenceSpacing'].map(id=>[id,document.getElementById(id).value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading); assert.ok(result.result.includes(bays) && result.result.includes(posts) && result.result.includes(spacing), result.result);
      assert.ok(result.guide.includes(language === "en" ? "maximum post spacing" : "maximalen Pfostenabstand")); assert.ok(result.faq.includes(language === "en" ? "Are gate posts included?" : "Werden Torpfosten mitgerechnet?"));
      assert.ok(result.note.includes(language === "en" ? "specific system" : "konkreten Systems")); assert.ok(result.meta.includes(language === "en" ? "straight fence section" : "geraden Zaunabschnitt"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE"); assert.equal(JSON.stringify(result.values), before); assert.ok(new URL(result.href).searchParams.get("subject").includes(language === "en" ? "Fence Post" : "Zaunpfosten")); assert.ok(result.width <= width + 1);
      await evaluate(`(()=>{const x=document.getElementById('fenceLength');x.value='0';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('fenceResult').textContent.trim()`), language === "en" ? "Fence length: the value must be greater than zero." : "Zaunlänge: Der Wert muss größer als null sein.");
      await evaluate(`(()=>{const x=document.getElementById('fenceLength');x.value='17';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu"); assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Kerítés oszlop kalkulátor"); assert.ok((await evaluate(`document.getElementById('fenceResult').innerText`)).includes("7 db"));
  }
  console.log("Fence post locale: EN/DE results, errors, guide, FAQ, metadata, inputs and HU restoration passed.");
}
module.exports = { checkFencePostLocale };

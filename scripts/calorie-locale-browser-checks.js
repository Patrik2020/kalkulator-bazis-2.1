"use strict";
const assert = require("node:assert/strict");
async function checkCalorieLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000); await navigate("/kalkulatorok/kaloria-kalkulator.html");
    await evaluate(`(async()=>{for(const [id,value] of [['weight','75'],['height','175'],['age','35']]){const x=document.getElementById(id);x.value=value;x.dispatchEvent(new Event('input',{bubbles:true}))}const a=document.getElementById('activity');a.value='1.55';a.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame)})()`);
    for (const [language, heading] of [["en","Calorie Calculator"],["de","Kalorienrechner"]]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),calories:document.getElementById('result-calories')?.textContent,goal:document.getElementById('result-goal')?.textContent,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,lifestyle:document.querySelector('.lifestyle-quality')?.innerText,priority:document.querySelector('.priority-upgrade')?.innerText,next:document.querySelector('.kb-next-step')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),values:['gender','weight','height','age','activity'].map(id=>[id,document.getElementById(id)?.value]),width:document.documentElement.scrollWidth,href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href})`));
      assert.equal(result.heading, heading); assert.ok(result.calories.includes(language === "en" ? "2,494" : "2.494"), result.calories);
      assert.ok(result.goal.includes(language === "en" ? "relative to maintenance" : "gegenüber dem Erhaltungswert"), result.goal);
      assert.ok(result.guide.includes(language === "en" ? "sustainable" : "nachhaltig")); assert.ok(result.faq.includes(language === "en" ? "exactly how much" : "genau, wie viel"));
      assert.ok(result.lifestyle.includes(language === "en" ? "laboratory result" : "Laborwert")); assert.ok(result.priority.includes(language === "en" ? "safe minimum" : "sichere Mindest")); assert.ok(result.next.includes(language === "en" ? "practical plan" : "praktischen Plan"));
      assert.ok(result.note.includes(language === "en" ? "not a diagnosis" : "keine Diagnose")); assert.ok(result.meta.includes(language === "en" ? "adults’ daily energy" : "täglichen Energiebedarf"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.deepEqual(result.values, [["gender","male"],["weight","75"],["height","175"],["age","35"],["activity","1.55"]]);
      assert.ok(new URL(result.href).searchParams.get("subject").includes(language === "en" ? "Calorie Calculator" : "Kalorienrechner")); assert.ok(result.width <= width + 1);
      await evaluate(`(async()=>{const x=document.getElementById('age');x.value='17';x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame)})()`);
      assert.equal(await evaluate(`document.getElementById('result-goal').textContent.trim()`), language === "en" ? "This page uses the Mifflin–St Jeor estimate for adults aged 18 and over." : "Auf dieser Seite wird die Mifflin–St-Jeor-Schätzung für Erwachsene ab 18 Jahren verwendet.");
      await evaluate(`(()=>{const x=document.getElementById('age');x.value='35';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu"); assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Kalória kalkulátor");
  }
  console.log("Calorie locale: EN/DE calculation, scenarios, health limits, FAQ, metadata, inputs and HU restoration passed.");
}
module.exports = { checkCalorieLocale };

"use strict";
const assert = require("node:assert/strict");

async function checkMulchLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input = (id, value) => evaluate(`(async()=>{const x=document.getElementById(${JSON.stringify(id)});x.value=${JSON.stringify(value)};x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000); await navigate("/kalkulatorok/mulcs-kalkulator.html");
    await input("mulchArea", "42"); await input("mulchDepth", "6"); await input("mulchWaste", "15"); await input("mulchBag", "60");
    const before = await evaluate(`JSON.stringify(['mulchArea','mulchDepth','mulchWaste','mulchBag'].map(id=>document.getElementById(id).value))`);
    for (const [language, heading, base, total, litres, bags] of [
      ["en", "Mulch Calculator", "2.52 m³", "2.898 m³", "2,898 litres", "49 bags"],
      ["de", "Mulchrechner", "2,52 m³", "2,898 m³", "2.898 Liter", "49 Säcke"]
    ]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('mulchResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href,values:['mulchArea','mulchDepth','mulchWaste','mulchBag'].map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(state.heading, heading); assert.ok(state.result.includes(base) && state.result.includes(total) && state.result.includes(litres) && state.result.includes(bags), state.result);
      assert.ok(state.result.includes(language === "en" ? "Required quantity:" : "Benötigte Menge:"), state.result);
      assert.ok(state.guide.includes(language === "en" ? "uneven ground" : "Bodenunebenheiten"));
      assert.ok(state.faq.includes(language === "en" ? "Is the number of bags rounded?" : "Wird die Sackanzahl gerundet?"));
      assert.ok(state.note.includes(language === "en" ? "material requirement estimate" : "Materialbedarfsschätzung"));
      assert.ok(state.meta.includes(language === "en" ? "Estimate mulch volume" : "Schätze Mulchvolumen"));
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(JSON.stringify(state.values), before); assert.ok(new URL(state.href).searchParams.get("subject").includes(language === "en" ? "Mulch Calculator" : "Mulchrechner")); assert.ok(state.width <= width + 1);
      await input("mulchWaste", "101");
      assert.equal(await evaluate(`document.getElementById('mulchResult').textContent.trim()`), language === "en" ? "The allowance must not exceed 100%." : "Der Zuschlag darf höchstens 100 % betragen.");
      await input("mulchWaste", "15");
    }
    await choose("hu"); assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Mulcs kalkulátor"); assert.ok((await evaluate(`document.getElementById('mulchResult').innerText`)).includes("2,898 m³"));
    assert.equal(await evaluate(`JSON.stringify(['mulchArea','mulchDepth','mulchWaste','mulchBag'].map(id=>document.getElementById(id).value))`), before);
  }
  console.log("Mulch locale: EN/DE results, errors, guide, FAQ, metadata, inputs and HU restoration passed.");
}

module.exports = { checkMulchLocale };

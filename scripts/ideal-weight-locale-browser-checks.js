"use strict";
const assert = require("node:assert/strict");

async function checkIdealWeightLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/idealis-testsuly-kalkulator.html");
    await evaluate(`(async()=>{const h=document.getElementById('height');h.value='177.4';h.dispatchEvent(new Event('input',{bubbles:true}));const g=document.getElementById('gender');g.value='2';g.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
    for (const [language, heading] of [["en", "Informative Weight Range Calculator"], ["de", "Orientierender Gewichtsbereichsrechner"]]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('simpleCalcResults')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.textContent,lifestyle:document.querySelector('.lifestyle-quality')?.innerText,priority:document.querySelector('.priority-upgrade')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),height:document.getElementById('height')?.value,gender:document.getElementById('gender')?.value,rangeHeight:document.getElementById('wr-height')?.value,width:document.documentElement.scrollWidth,href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href})`));
      assert.equal(result.heading, heading);
      assert.ok(result.result.includes(language === "en" ? "72.6 kg" : "72,6 kg"), result.result);
      assert.ok(result.guide.includes(language === "en" ? "body composition" : "Körperzusammensetzung"));
      assert.ok(result.faq.includes(language === "en" ? "weight-loss target" : "Abnehmziel"));
      assert.ok(result.lifestyle.includes(language === "en" ? "formula result" : "Formelergebnis"));
      assert.ok(result.priority.includes(language === "en" ? "52.8–71.1 kg" : "52,8–71,1 kg"));
      assert.ok(result.note.includes(language === "en" ? "not a diagnosis" : "keine Diagnose"));
      assert.ok(result.meta.includes(language === "en" ? "Informative weight range" : "Orientierender Gewichtsbereichsrechner"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(result.height, "177.4"); assert.equal(result.gender, "2"); assert.equal(result.rangeHeight, "169");
      assert.ok(new URL(result.href).searchParams.get("subject").includes(language === "en" ? "Weight Range Calculator" : "Gewichtsbereichsrechner"));
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(async()=>{const h=document.getElementById('height');h.value='152.3';h.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`), language === "en" ? "The Devine formula does not provide a reliable estimate below 152.4 cm." : "Die Devine-Formel liefert unter 152,4 cm keine verlässliche Schätzung.");
      await evaluate(`(async()=>{const h=document.getElementById('height');h.value='177.4';h.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame)})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Tájékoztató testsúlytartomány-kalkulátor");
  }
  console.log("Ideal weight locale: EN/DE results, limits, guidance, FAQ, metadata and HU restoration passed.");
}
module.exports = { checkIdealWeightLocale };

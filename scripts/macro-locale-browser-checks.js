"use strict";
const assert = require("node:assert/strict");
async function checkMacroLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const setInput = (id, value) => evaluate(`(async()=>{const x=document.getElementById(${JSON.stringify(id)});x.value=${JSON.stringify(value)};x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000); await navigate("/kalkulatorok/makro-kalkulator.html");
    await setInput("calories", "2000");
    const before = await evaluate(`JSON.stringify(['calories','protein','fat'].map(id=>document.getElementById(id).value))`);
    for (const [language, heading, protein, fat, carb] of [["en","Macro Calculator","Protein: 150 g","Fat: 56 g","Carbohydrate: 225 g"],["de","Makrorechner","Protein: 150 g","Fett: 56 g","Kohlenhydrate: 225 g"]]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('simpleCalcResults')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,lifestyle:document.querySelector('.lifestyle-quality')?.innerText,priority:document.querySelector('.priority-upgrade')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href,values:['calories','protein','fat'].map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading); assert.ok(result.result.includes(protein) && result.result.includes(fat) && result.result.includes(carb), result.result);
      assert.ok(result.guide.includes(language === "en" ? "mathematical split" : "mathematische Aufteilung"));
      assert.ok(result.faq.includes(language === "en" ? "Is fibre a carbohydrate?" : "Sind Ballaststoffe Kohlenhydrate?"));
      assert.ok(result.lifestyle.includes(language === "en" ? "qualified professional" : "Fachleuten"));
      assert.ok(result.priority.includes(language === "en" ? "safe minimum" : "sichere Mindest"));
      assert.ok(result.note.includes(language === "en" ? "not a diagnosis" : "keine Diagnose"));
      assert.ok(result.meta.includes(language === "en" ? "daily calorie target" : "tägliches Kalorienziel"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(JSON.stringify(result.values), before); assert.ok(new URL(result.href).searchParams.get("subject").includes(language === "en" ? "Macro Calculator" : "Makrorechner")); assert.ok(result.width <= width + 1);
      await setInput("protein", "80"); await setInput("fat", "30");
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`), language === "en" ? "Protein and fat shares together cannot exceed 100%" : "Protein- und Fettanteil dürfen zusammen 100 % nicht überschreiten");
      await setInput("protein", "30"); await setInput("fat", "25");
    }
    await choose("hu"); assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Makró kalkulátor");
    assert.ok((await evaluate(`document.getElementById('simpleCalcResults').innerText`)).includes("Fehérje: 150 g"));
    assert.equal(await evaluate(`JSON.stringify(['calories','protein','fat'].map(id=>document.getElementById(id).value))`), before);
  }
  console.log("Macro locale: EN/DE calculations, validation, guide, FAQ, safety, metadata, inputs and HU restoration passed.");
}
module.exports = { checkMacroLocale };

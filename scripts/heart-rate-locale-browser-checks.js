"use strict";
const assert = require("node:assert/strict");

async function checkHeartRateLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1100);
    await navigate("/kalkulatorok/pulzus-zona-kalkulator.html");
    for (const [language, heading] of [["en", "Heart Rate Zone Calculator"], ["de", "Herzfrequenzzonen-Rechner"]]) {
      await choose(language);
      await evaluate(`(async()=>{const age=document.getElementById('age'),rest=document.getElementById('rest');age.value='40';rest.value='60';age.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('simpleCalcResults')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.textContent,lifestyle:document.querySelector('.lifestyle-quality')?.innerText,priority:document.querySelector('.priority-upgrade')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),age:document.getElementById('age')?.value,rest:document.getElementById('rest')?.value,width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(language === "en" ? "Heart Rate Zone" : "Herzfrequenzzonen"));
      assert.ok(result.result.includes("108–131 bpm") && result.result.includes("132–161 bpm"), result.result);
      assert.ok(result.result.includes(language === "en" ? "Moderate relative intensity" : "Mittlere relative Intensität"));
      assert.ok(result.guide.includes(language === "en" ? "exercise stress test" : "Belastungsuntersuchung"));
      assert.ok(result.faq.includes(language === "en" ? "chest strap" : "Brustgurt"));
      assert.ok(result.lifestyle.includes(language === "en" ? "Health boundary" : "Gesundheitlicher Hinweis"));
      assert.ok(result.priority.includes(language === "en" ? "beta blockers" : "Betablockern"));
      assert.ok(result.note.includes(language === "en" ? "not a diagnosis" : "keine Diagnose"));
      assert.ok(result.meta.includes(language === "en" ? "relative training" : "relative Trainingspulsbereiche"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "resting heart rate" : "Ruhepuls"));
      assert.equal(result.age, "40"); assert.equal(result.rest, "60");
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(async()=>{const age=document.getElementById('age');age.value='17';age.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`), language === "en"
        ? "This heart-rate-reserve planner is intended for adults aged 18 and over."
        : "Dieser Planer nach der Herzfrequenzreserve ist für Erwachsene ab 18 Jahren vorgesehen.");
      await evaluate(`(async()=>{const age=document.getElementById('pu-age');age.value='17';age.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      const priority = await evaluate(`document.querySelector('.priority-upgrade [data-results]').textContent`);
      assert.ok(priority.includes(language === "en" ? "adult planner" : "Erwachsenen-Planer"), priority);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Pulzus zóna kalkulátor");
  }
  console.log("Heart-rate locale: EN/DE ranges, validation, safety guidance, metadata and HU restoration passed.");
}
module.exports = { checkHeartRateLocale };

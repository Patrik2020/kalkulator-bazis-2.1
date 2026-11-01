"use strict";
const assert = require("node:assert/strict");

async function checkTravelTimeLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/utazasi-ido-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<180&&!document.querySelector('main [data-acq-input="fast"]');i++)await new Promise(requestAnimationFrame);if(!document.querySelector('main [data-acq-input="fast"]'))throw Error('Travel time comparison did not initialize')})()`);
    for (const [language, heading, duration] of [["en", "Travel Time Calculator", "2 h 15 min"],
      ["de", "Fahrzeitrechner", "2 Std. 15 Min."]]) {
      await choose(language);
      await evaluate(`(()=>{for(const [id,value] of [['distance','180'],['speed','90'],['breaks','15']]){const x=document.getElementById(id);x.value=value;x.dispatchEvent(new Event('input',{bubbles:true}))}})()`);
      const result = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),title:document.title,mainResult:document.getElementById('simpleCalcResults')?.innerText,quality:document.querySelector('.auto-converter-quality')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.textContent,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),distance:document.getElementById('distance')?.value,width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(heading));
      assert.ok(result.mainResult.includes(duration), result.mainResult);
      assert.ok(result.quality.includes(language === "en" ? "Time saved" : "Zeitgewinn"));
      assert.ok(result.quality.includes(language === "en" ? "2 h 50 min" : "2 Std. 50 Min."), result.quality);
      assert.ok(result.guide.includes(language === "en" ? "average speed" : "Durchschnittsgeschwindigkeit"));
      assert.ok(result.faq.includes(language === "en" ? "traffic jams" : "Staus"));
      assert.ok(result.note.includes(language === "en" ? "unplanned delays" : "ungeplante Verzögerungen"));
      assert.ok(result.meta.includes(language === "en" ? "Estimate travel time" : "Schätze die Fahrzeit"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "round trip" : "Rückfahrt"));
      assert.equal(result.distance, "180");
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const x=document.getElementById('speed');x.value='0';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`),
        language === "en" ? "Values must be greater than zero." : "Die Werte müssen größer als null sein.");
      await evaluate(`(()=>{const x=document.getElementById('speed');x.value='90';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Utazási idő kalkulátor");
    assert.ok((await evaluate(`document.getElementById('simpleCalcResults').innerText`)).includes("2 óra 15 perc"));
  }
  console.log("Travel time locale: EN/DE duration, errors, comparison, guidance, FAQ, metadata and HU restoration passed.");
}
module.exports = { checkTravelTimeLocale };

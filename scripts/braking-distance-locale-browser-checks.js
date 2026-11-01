"use strict";
const assert = require("node:assert/strict");

async function checkBrakingDistanceLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/fektav-kalkulator.html");
    for (const [language, heading, distance] of [["en", "Braking Distance Calculator", "13.9 m"],
      ["de", "Bremswegrechner", "13,9 m"]]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('brakeResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.textContent,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(heading));
      assert.ok(result.result.includes(distance) && result.result.includes(language === "en" ? "Total stopping distance" : "Gesamter Anhalteweg"), result.result);
      assert.ok(result.guide.includes(language === "en" ? "level road" : "ebener Straße"));
      assert.ok(result.faq.includes(language === "en" ? "square of speed" : "Quadrat der Geschwindigkeit"));
      assert.ok(result.note.includes(language === "en" ? "safe following distance" : "sicheren Abstands"));
      assert.ok(result.meta.includes(language === "en" ? "reaction distance" : "Reaktionsweg"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "μ mean" : "Wert μ"));
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const x=document.getElementById('brakeSpeed');x.value='-1';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('brakeResult').textContent.trim()`),
        language === "en" ? "Speed: the value cannot be negative." : "Geschwindigkeit: Der Wert darf nicht negativ sein.");
      await evaluate(`(()=>{const x=document.getElementById('brakeSpeed');x.value='50';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Féktáv kalkulátor");
    assert.ok((await evaluate(`document.getElementById('brakeResult').innerText`)).includes("Reakcióút"));
  }
  console.log("Braking distance locale: EN/DE results, errors, guidance, FAQ, metadata and HU restoration passed.");
}
module.exports = { checkBrakingDistanceLocale };

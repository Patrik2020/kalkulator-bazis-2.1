"use strict";
const assert = require("node:assert/strict");

async function checkProteinNeedsLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/feherje-szukseglet-kalkulator.html");
    for (const [language, heading] of [["en", "Protein Needs Calculator"], ["de", "Proteinbedarfsrechner"]]) {
      await choose(language);
      await evaluate(`(async()=>{const x=document.getElementById('weight');x.value='80';x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('simpleCalcResults')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.textContent,lifestyle:document.querySelector('.lifestyle-quality')?.innerText,priority:document.querySelector('.priority-upgrade')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),weight:document.getElementById('weight')?.value,width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(language === "en" ? "Protein Needs" : "Proteinbedarfsrechner"));
      assert.ok(result.result.includes("128 g") && result.result.includes("32 g"), result.result);
      assert.ok(result.result.includes(language === "en" ? "selected factor" : "gewählten Faktor"));
      assert.ok(result.guide.includes(language === "en" ? "therapeutic diet" : "therapeutische Ernährung"));
      assert.ok(result.faq.includes(language === "en" ? "protein powder" : "Proteinpulver"));
      assert.ok(result.lifestyle.includes(language === "en" ? "Health boundary" : "Gesundheitlicher Hinweis"));
      assert.ok(result.priority.includes(language === "en" ? "kidney or liver disease" : "Nieren- oder Lebererkrankungen"));
      assert.ok(result.note.includes(language === "en" ? "not a diagnosis" : "keine Diagnose"));
      assert.ok(result.meta.includes(language === "en" ? "Estimate daily protein" : "Schätze deine tägliche Proteinzufuhr"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "weight loss" : "Abnehmen"));
      assert.equal(result.weight, "80");
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(async()=>{const x=document.getElementById('weight');x.value='0';x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`),
        language === "en" ? "Values must be greater than zero." : "Die Werte müssen größer als null sein.");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Fehérje szükséglet kalkulátor");
  }
  console.log("Protein needs locale: EN/DE results, health limits, guidance, FAQ, metadata and HU restoration passed.");
}
module.exports = { checkProteinNeedsLocale };

"use strict";
const assert = require("node:assert/strict");

async function checkKilometreCostLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/kilometerdij-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<180&&(window.KB_AUTO_CONVERTER_UPGRADE_READY!=='kilometerdij-kalkulator'||!document.querySelector('input[name="passengers"]'));i++)await new Promise(requestAnimationFrame);if(window.KB_AUTO_CONVERTER_UPGRADE_READY!=='kilometerdij-kalkulator')throw Error('Cost per kilometre calculator did not initialize')})()`);
    await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('passengers').value='2';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
    for (const [language, heading, trip, share] of [
      ["en", "Cost per Kilometre Calculator", "16,000 HUF", "8,000 HUF"],
      ["de", "Kilometerkostenrechner", "16.000 HUF", "8.000 HUF"]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.querySelector('.card-calculator .ac-result')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('main .acq-static')?.innerText,note:document.querySelector('main .ac-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),inputs:[...document.querySelectorAll('.card-calculator form.ac-grid input')].map(x=>[x.name,x.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(language === "en" ? "Cost per Kilometre" : "Kilometerkostenrechner"));
      assert.ok(result.result.includes("80 HUF/km") && result.result.includes(trip) && result.result.includes(share), `${language}: result ${result.result}`);
      assert.ok(result.guide.includes(language === "en" ? "depreciation" : "Wertverlust"));
      assert.ok(result.faq.includes(language === "en" ? "company expense claims" : "betriebliche Abrechnungen"));
      assert.ok(result.quality.includes(language === "en" ? "Marginal cost" : "Grenzkosten"));
      assert.ok(result.note.includes(language === "en" ? "official rate" : "offiziellen Satz"));
      assert.ok(result.meta.includes(language === "en" ? "full cost per kilometre" : "gesamten Autokosten pro Kilometer"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "company expense claims" : "betriebliche Abrechnungen"));
      assert.ok(result.inputs.some(([name, value]) => name === "passengers" && value === "2"));
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('km').value='';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
      assert.equal(await evaluate(`document.querySelector('.card-calculator .ac-result').textContent.trim()`), language === "en"
        ? "Check the required fields and allowed ranges." : "Prüfe die Pflichtfelder und zulässigen Wertebereiche.");
      await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('km').value='15000';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Kilométerdíj kalkulátor");
    const huResult = await evaluate(`document.querySelector('.card-calculator .ac-result').innerText`);
    assert.ok(huResult.includes("Egy főre") && huResult.includes("Ft"), huResult);
  }
  console.log("Cost per kilometre locale: EN/DE copy, full and marginal costs, calculations, errors, metadata and HU restoration passed.");
}
module.exports = { checkKilometreCostLocale };

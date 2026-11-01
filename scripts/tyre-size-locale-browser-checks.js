"use strict";
const assert = require("node:assert/strict");

async function checkTyreSizeLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/gumi-meret-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<180&&(window.KB_AUTO_CONVERTER_UPGRADE_READY!=='gumi-meret-kalkulator'||!document.querySelector('input[name="speed"]'));i++)await new Promise(requestAnimationFrame);if(window.KB_AUTO_CONVERTER_UPGRADE_READY!=='gumi-meret-kalkulator')throw Error('Tyre size calculator did not initialize')})()`);
    for (const [language, heading, diameter, difference, speed] of [
      ["en", "Tyre Size Calculator", "595.5 mm", "-1.24%", "98.8 km/h"],
      ["de", "Reifengrößenrechner", "595,5 mm", "-1,24 %", "98,8 km/h"]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.querySelector('.card-calculator .ac-result')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('main .acq-static')?.innerText,note:document.querySelector('main .ac-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),inputs:[...document.querySelectorAll('.card-calculator form.ac-grid input')].map(x=>[x.name,x.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(language === "en" ? "Tyre Size" : "Reifengrößenrechner"));
      assert.ok(result.result.includes(diameter) && result.result.includes(difference) && result.result.includes(speed), `${language}: result ${result.result}`);
      assert.ok(result.result.includes(language === "en" ? "manufacturer's approved sizes" : "Hersteller freigegebenen Größen"));
      assert.ok(result.guide.includes(language === "en" ? "wheel offset" : "Einpresstiefe"));
      assert.ok(result.faq.includes(language === "en" ? "exact speedometer error" : "genaue Tachoabweichung"));
      assert.ok(result.quality.includes(language === "en" ? "Wheel-arch clearance" : "Freiraum im Radhaus"));
      assert.ok(result.note.includes(language === "en" ? "technical compatibility" : "technische Eignung"));
      assert.ok(result.meta.includes(language === "en" ? "Compare two tyre sizes" : "Vergleiche zwei Reifengrößen"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "acceptable" : "zulässig"));
      assert.ok(result.inputs.some(([name, value]) => name === "w1" && value === "185"));
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('w1').value='';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
      assert.equal(await evaluate(`document.querySelector('.card-calculator .ac-result').textContent.trim()`), language === "en"
        ? "Check the required fields and allowed ranges." : "Prüfe die Pflichtfelder und zulässigen Wertebereiche.");
      await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('w1').value='185';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Gumiméret váltó kalkulátor");
    const huResult = await evaluate(`document.querySelector('.card-calculator .ac-result').innerText`);
    assert.ok(huResult.includes("Átmérőeltérés") && huResult.includes("gyártói engedélyezést"), huResult);
  }
  console.log("Tyre size locale: EN/DE geometry, compatibility guidance, calculations, errors, metadata and HU restoration passed.");
}
module.exports = { checkTyreSizeLocale };

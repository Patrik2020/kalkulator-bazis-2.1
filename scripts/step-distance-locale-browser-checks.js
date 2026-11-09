"use strict";
const assert = require("node:assert/strict");
async function checkStepDistanceLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000); await navigate("/kalkulatorok/lepesszam-tavolsag-kalkulator.html");
    await evaluate(`(async()=>{for(const [id,value] of [['stepCount','12000'],['stepLength','80'],['stepCadence','120']]){const x=document.getElementById(id);x.value=value;x.dispatchEvent(new Event('input',{bubbles:true}))}await new Promise(requestAnimationFrame)})()`);
    const before = await evaluate(`JSON.stringify(['stepCount','stepLength','stepCadence'].map(id=>document.getElementById(id).value))`);
    for (const [language, heading, distance, minutes, speed] of [["en","Steps to Distance Calculator","9.6 km","100 min","5.76 km/h"],["de","Schritte-in-Entfernung-Rechner","9,6 km","100 min","5,76 km/h"]]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('stepsResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href,values:['stepCount','stepLength','stepCadence'].map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading); assert.ok(result.result.includes(distance) && result.result.includes(minutes) && result.result.includes(speed), result.result);
      assert.ok(result.result.includes(language === "en" ? "Estimated distance:" : "Geschätzte Entfernung:"), result.result);
      assert.ok(result.guide.includes(language === "en" ? "average step length" : "durchschnittlichen Schrittlänge"));
      assert.ok(result.faq.includes(language === "en" ? "Can I use it for running?" : "Kann ich ihn auch zum Laufen verwenden?"));
      assert.ok(result.note.includes(language === "en" ? "not a medical measurement" : "keine medizinische Messung"));
      assert.ok(result.meta.includes(language === "en" ? "walking distance" : "Gehstrecke"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(JSON.stringify(result.values), before); assert.ok(new URL(result.href).searchParams.get("subject").includes(language === "en" ? "Steps to Distance" : "Schritte-in-Entfernung")); assert.ok(result.width <= width + 1);
      await evaluate(`(()=>{const x=document.getElementById('stepLength');x.value='0';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('stepsResult').textContent.trim()`), language === "en" ? "Step length: the value must be greater than zero." : "Schrittlänge: Der Wert muss größer als null sein.");
      await evaluate(`(()=>{const x=document.getElementById('stepLength');x.value='80';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu"); assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Lépésszám–távolság kalkulátor"); assert.ok((await evaluate(`document.getElementById('stepsResult').innerText`)).includes("9,6 km"));
    assert.equal(await evaluate(`JSON.stringify(['stepCount','stepLength','stepCadence'].map(id=>document.getElementById(id).value))`), before);
  }
  console.log("Step distance locale: EN/DE results, errors, guide, FAQ, metadata, inputs and HU restoration passed.");
}
module.exports = { checkStepDistanceLocale };

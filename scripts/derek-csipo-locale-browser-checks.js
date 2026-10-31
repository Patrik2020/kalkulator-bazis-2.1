"use strict";
const assert = require("node:assert/strict");

async function checkWaistHipLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/derek-csipo-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<100&&!document.querySelector('#simpleCalcFields #waist');i++)await new Promise(requestAnimationFrame);const w=document.getElementById('waist'),h=document.getElementById('hip');w.value='82';h.value='100';h.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    for (const [language, heading, ratio, threshold] of [
      ["en", "Waist-to-Hip Ratio Calculator", "0.82", "0.85"],
      ["de", "Taille-Hüfte-Verhältnis-Rechner", "0,82", "0,85"]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),label:document.querySelector('label[for="waist"]')?.textContent.trim(),result:document.getElementById('simpleCalcResults')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:new URL(document.querySelector('main a[href^="mailto:"]').href).searchParams,waist:document.getElementById('waist').value,hip:document.getElementById('hip').value,width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading, `${language}: heading`);
      assert.ok(result.title.includes(heading), `${language}: title`);
      assert.ok(result.label.includes(language === "en" ? "Waist" : "Taillenumfang"), `${language}: label`);
      assert.ok(result.result.includes(ratio) && result.result.includes(threshold), `${language}: WHR and threshold`);
      assert.ok(result.result.includes(language === "en" ? "Waist-to-hip ratio:" : "Taille-Hüfte-Verhältnis:"), `${language}: dynamic ratio label`);
      assert.ok(result.result.includes(language === "en" ? "Compared with the general WHO threshold:" : "Vergleich mit dem allgemeinen WHO-Schwellenwert:"), `${language}: dynamic comparison label`);
      assert.ok(result.result.includes(language === "en" ? "Indicative threshold used:" : "Verwendeter Orientierungswert:"), `${language}: dynamic threshold label`);
      assert.ok(result.guide.includes(language === "en" ? "measurement" : "Mess"), `${language}: guide`);
      assert.ok(result.faq.includes(language === "en" ? "pregnancy" : "Schwangerschaft"), `${language}: FAQ`);
      assert.ok(result.meta.includes(language === "en" ? "waist-to-hip" : "Taille-Hüfte"), `${language}: metadata`);
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-US" : "de-DE");
      assert.equal(result.waist, "82"); assert.equal(result.hip, "100");
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const w=document.getElementById('waist');w.value='0';w.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`),
        language === "en" ? "Values must be greater than zero." : "Die Werte müssen größer als null sein.");
      await evaluate(`(()=>{const w=document.getElementById('waist');w.value='82';w.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Derék-csípő arány kalkulátor");
  }
  console.log("Waist-to-hip ratio locale: EN/DE content, calculation, validation, metadata and HU restoration passed.");
}
module.exports = { checkWaistHipLocale };

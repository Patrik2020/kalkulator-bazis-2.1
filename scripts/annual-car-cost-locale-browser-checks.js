"use strict";
const assert = require("node:assert/strict");

async function checkAnnualCarCostLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/eves-auto-koltseg-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<180&&(window.KB_AUTO_CONVERTER_UPGRADE_READY!=='eves-auto-koltseg-kalkulator'||!document.querySelector('input[name="depreciation"]'));i++)await new Promise(requestAnimationFrame);if(window.KB_AUTO_CONVERTER_UPGRADE_READY!=='eves-auto-koltseg-kalkulator')throw Error('Annual car calculator did not initialize')})()`);
    await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('cons').value='7';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
    for (const [language, heading, total, label] of [
      ["en", "Annual Car Cost Calculator", "1,641,000 HUF", "Total annual economic cost"],
      ["de", "Rechner für jährliche Autokosten", "1.641.000 HUF", "Jährliche Gesamtkosten einschließlich Wertverlust"]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.querySelector('.card-calculator .ac-result')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('main .acq-static')?.innerText,note:document.querySelector('main .ac-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),inputs:[...document.querySelectorAll('.card-calculator form.ac-grid input')].map(x=>[x.name,x.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(language === "en" ? "Annual Car Cost" : "Autokostenrechner"));
      assert.ok(result.result.includes(label) && result.result.includes(total), `${language}: result ${result.result}`);
      assert.ok(result.result.includes(language === "en" ? "109.4 HUF/km" : "109,4 HUF/km"), `${language}: per-km result`);
      assert.ok(result.guide.includes(language === "en" ? "depreciation" : "Wertverlust"));
      assert.ok(result.faq.includes(language === "en" ? "whole loan payment" : "gesamte Kreditrate"));
      assert.ok(result.quality.includes(language === "en" ? "cash expenses" : "wirtschaftliche Kosten"));
      assert.ok(result.note.includes(language === "en" ? "actual monthly cash outgoings" : "tatsächlichen monatlichen Ausgaben"));
      assert.ok(result.meta.includes(language === "en" ? "annual costs" : "jährlichen Autokosten"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "monthly amounts" : "monatlichen Beträgen"));
      assert.ok(result.inputs.some(([name, value]) => name === "depreciation" && value === "350000"));
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('km').value='';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
      assert.equal(await evaluate(`document.querySelector('.card-calculator .ac-result').textContent.trim()`), language === "en"
        ? "Check the required fields and allowed ranges." : "Prüfe die Pflichtfelder und zulässigen Wertebereiche.");
      await evaluate(`(()=>{const f=document.querySelector('.card-calculator form.ac-grid');f.elements.namedItem('km').value='15000';f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Éves autóköltség kalkulátor");
    assert.ok((await evaluate(`document.querySelector('.card-calculator .ac-result').innerText`)).includes("1 641 000 Ft") ||
      (await evaluate(`document.querySelector('.card-calculator .ac-result').innerText`)).includes("1 641 000 Ft"));
  }
  console.log("Annual car cost locale: EN/DE guide, FAQ, economic cost, calculations, errors, metadata and HU restoration passed.");
}
module.exports = { checkAnnualCarCostLocale };

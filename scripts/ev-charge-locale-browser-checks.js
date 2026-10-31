"use strict";
const assert = require("node:assert/strict");

async function checkEvChargeLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/ev-toltesi-koltseg-kalkulator.html");
    for (const [language, heading, amount, label] of [
      ["en", "EV Charging Cost Calculator", "1,400 HUF", "Electricity drawn from the grid:"],
      ["de", "Ladekostenrechner für Elektroautos", "1.400 HUF", "Strombezug aus dem Netz:"]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('evResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,related:document.querySelector('.related-links')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),inputs:['evDistance','evConsumption','evPrice','evLoss'].map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(heading));
      assert.ok(result.result.includes(label) && result.result.includes(amount), `${language}: result ${result.result}`);
      assert.ok(result.guide.includes(language === "en" ? "charging loss" : "Ladeverluste"));
      assert.ok(result.faq.includes(language === "en" ? "Can I compare this" : "Kann ich das"));
      assert.ok(result.related.includes(language === "en" ? "Fuel cost" : "Kraftstoffkosten"));
      assert.ok(result.meta.includes(language === "en" ? "electricity drawn" : "Netzbezug"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "dashboard" : "Bordcomputer"));
      assert.deepEqual(result.inputs, ["100", "18", "70", "10"]);
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const n=document.getElementById('evLoss');n.value='100';n.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('evResult').textContent.trim()`), language === "en"
        ? "Charging loss must be below 100%." : "Der Ladeverlust muss unter 100 % liegen.");
      await evaluate(`(()=>{const n=document.getElementById('evLoss');n.value='10';n.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Elektromos autó töltési költség kalkulátor");
    assert.ok((await evaluate(`document.getElementById('evResult').innerText`)).includes("1400 Ft"));
  }
  console.log("EV charging locale: EN/DE guide, FAQ, results, errors, metadata and HU restoration passed.");
}
module.exports = { checkEvChargeLocale };

"use strict";
const assert = require("node:assert/strict");

async function checkOneRepMaxLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/egyszeri-max-1rm-kalkulator.html");
    for (const [language, heading, number, label] of [
      ["en", "One-Rep Max Calculator", "93.3 kg", "Epley estimate:"],
      ["de", "1RM-Rechner", "93,3 kg", "Schätzung nach Epley:"]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('rmResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,related:document.querySelector('.related-links')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),weight:document.getElementById('rmWeight').value,reps:document.getElementById('rmReps').value,width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(heading));
      assert.ok(result.result.includes(label) && result.result.includes(number), `${language}: result`);
      assert.ok(result.guide.includes(language === "en" ? "repetitions" : "Wiederholungen"));
      assert.ok(result.faq.includes(language === "en" ? "maximal attempt" : "Maximalversuch"));
      assert.ok(result.related.includes(language === "en" ? "Protein needs" : "Proteinbedarf"));
      assert.ok(result.meta.includes(language === "en" ? "one-rep max" : "Einerwiederholungsmaximum"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "accurate" : "genau"));
      assert.equal(result.weight, "80"); assert.equal(result.reps, "5");
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const n=document.getElementById('rmReps');n.value='13';n.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('rmResult').textContent.trim()`), language === "en"
        ? "Enter a whole number of repetitions from 1 to 12." : "Gib eine ganze Wiederholungszahl zwischen 1 und 12 ein.");
      await evaluate(`(()=>{const n=document.getElementById('rmReps');n.value='5';n.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "1RM kalkulátor");
    assert.ok((await evaluate(`document.getElementById('rmResult').innerText`)).includes("93,3 kg"));
  }
  console.log("One-rep max locale: EN/DE guide, FAQ, dynamic results, errors, metadata and HU restoration passed.");
}
module.exports = { checkOneRepMaxLocale };

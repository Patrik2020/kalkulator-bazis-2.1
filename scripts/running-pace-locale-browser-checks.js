"use strict";
const assert = require("node:assert/strict");

async function checkRunningPaceLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/futotempo-kalkulator.html");
    const before = await evaluate(`JSON.stringify([...document.querySelectorAll('#kalkulator input')].map(x=>[x.id,x.value]))`);
    for (const [language, heading, error] of [
      ["en", "Running Pace Calculator", "Minutes and seconds must be between 0 and 59."],
      ["de", "Lauftempo-Rechner", "Minuten und Sekunden müssen zwischen 0 und 59 liegen."]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),label:document.querySelector('label[for="runDistance"]')?.textContent.trim(),output:document.getElementById('runResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:new URL(document.querySelector('main a[href^="mailto:"]').href).searchParams.get('subject'),inputs:[...document.querySelectorAll('#kalkulator input')].map(x=>[x.id,x.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(heading));
      assert.equal(result.label, language === "en" ? "Distance (km)" : "Distanz (km)");
      assert.ok(result.output.includes(language === "en" ? "Average pace" : "Durchschnittstempo"), result.output);
      assert.ok(result.output.includes("5:00/km") && result.output.includes("12 km/h") && result.output.includes("25:00") && result.output.includes("50:00"), result.output);
      assert.ok(result.guide.includes(language === "en" ? "GPS watch" : "GPS-Uhr"));
      assert.ok(result.faq.includes(language === "en" ? "race time" : "Wettkampfzeit"));
      assert.ok(result.meta.includes(language === "en" ? "Running pace calculator" : "Lauftempo-Rechner"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.report.includes(language === "en" ? "Error report" : "Fehlermeldung"));
      assert.equal(JSON.stringify(result.inputs), before, `${language}: input preservation`);
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const x=document.getElementById('runMinutes');x.value='60';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('runResult').textContent.trim()`), error);
      await evaluate(`(()=>{const x=document.getElementById('runMinutes');x.value='50';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Futótempó kalkulátor");
    assert.equal(await evaluate(`document.getElementById('runResult').innerText.includes('Átlagtempó')`), true);
  }
  console.log("Running pace locale: EN/DE results, errors, guide, FAQ, metadata, input preservation and HU restoration passed.");
}
module.exports = { checkRunningPaceLocale };

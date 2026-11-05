"use strict";
const assert = require("node:assert/strict");

async function checkDrywallLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1100);
    await navigate("/kalkulatorok/gipszkarton-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<120&&!document.querySelector('.drywall-system[data-construction-quality]');i++)await new Promise(requestAnimationFrame);if(!document.querySelector('.drywall-system[data-construction-quality]'))throw Error('Drywall quality panel did not initialize');await new Promise(requestAnimationFrame);const x=document.getElementById('construction-systemConfirmed');x.value='yes';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    const before = await evaluate(`JSON.stringify([...document.querySelectorAll('.construction-planner input,.construction-planner select')].map(x=>[x.id,x.value]))`);
    for (const [language, heading, area, boards, error] of [
      ["en", "Drywall Calculator", "22.46 m²", "8 pcs", "Wall width: enter a value greater than zero."],
      ["de", "Trockenbau-Rechner", "22,46 m²", "8 Stk.", "Wandbreite: Gib einen Wert größer als null ein."]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),label:document.querySelector('.construction-field span')?.textContent.trim(),results:document.querySelector('.construction-results')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('.drywall-system[data-construction-quality]')?.innerText,method:document.querySelector('.construction-methodology')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:new URL(document.querySelector('main a[href^="mailto:"]').href).searchParams.get('subject'),inputs:[...document.querySelectorAll('.construction-planner input,.construction-planner select')].map(x=>[x.id,x.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading, `${language}: heading`);
      assert.ok(result.title.includes(heading), `${language}: title`);
      assert.equal(result.label, language === "en" ? "Total wall width (m)" : "Gesamte Wandbreite (m)");
      assert.ok(result.results.includes(area) && result.results.includes(boards), `${language}: ${result.results}`);
      assert.ok(result.guide.includes(language === "en" ? "suspended ceilings" : "abgehängten Decken"), `${language}: guide`);
      assert.ok(result.faq.includes(language === "en" ? "load capacity" : "Tragfähigkeit"), `${language}: FAQ`);
      assert.ok(result.quality.includes(language === "en" ? "Enhanced sound insulation" : "Erhöhter Schallschutz"), `${language}: quality panel`);
      assert.ok(result.method.includes(language === "en" ? "manufacturer's documentation" : "Herstellerdokumentation"), `${language}: methodology`);
      assert.ok(result.meta.includes(language === "en" ? "Drywall calculator" : "Trockenbau-Rechner"), `${language}: metadata`);
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.report.includes(language === "en" ? "Error report" : "Fehlermeldung"));
      assert.equal(JSON.stringify(result.inputs), before, `${language}: input preservation`);
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const x=document.getElementById('construction-wallWidth');x.value='0';x.form.requestSubmit()})()`);
      assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`), error, `${language}: validation`);
      await evaluate(`(()=>{const x=document.getElementById('construction-wallWidth');x.value='4';x.form.requestSubmit()})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Gipszkarton kalkulátor");
    assert.ok(await evaluate(`document.querySelector('.construction-results').innerText.includes('Vásárolandó lapfelület')`));
  }
  console.log("Drywall locale: EN/DE form, results, errors, guide, FAQ, quality panel, metadata, input preservation and HU restoration passed.");
}
module.exports = { checkDrywallLocale };

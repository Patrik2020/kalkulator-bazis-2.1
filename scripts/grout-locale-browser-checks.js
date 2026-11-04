"use strict";
const assert = require("node:assert/strict");

async function checkGroutLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/fuga-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<120&&!document.querySelector('.grout-zone[data-construction-quality] [data-cq="zone"]');i++)await new Promise(requestAnimationFrame);if(!document.querySelector('.grout-zone[data-construction-quality]'))throw Error('Grout quality panel did not initialize');await new Promise(requestAnimationFrame)})()`);
    const before = await evaluate(`JSON.stringify([...document.querySelectorAll('.construction-planner input,.construction-planner select')].map(x=>[x.id,x.value]))`);
    for (const [language, heading, net, purchase, packs, error] of [
      ["en", "Grout Calculator – Estimate Grout Quantity", "4.32 kg", "4.67 kg", "1 pack", "Area: enter a value greater than zero."],
      ["de", "Fugenmörtel-Rechner – Fugenmörtelmenge berechnen", "4,32 kg", "4,67 kg", "1 Packung", "Fläche: Gib einen Wert größer als null ein."]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),label:document.querySelector('.construction-field span')?.textContent.trim(),results:document.querySelector('.construction-results')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('.grout-zone[data-construction-quality]')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:new URL(document.querySelector('main a[href^="mailto:"]').href).searchParams.get('subject'),inputs:[...document.querySelectorAll('.construction-planner input,.construction-planner select')].map(x=>[x.id,x.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading, `${language}: heading`);
      assert.ok(result.title.includes(language === "en" ? "Grout Calculator" : "Fugenmörtel-Rechner"), `${language}: title`);
      assert.equal(result.label, language === "en" ? "Tiled area (m²)" : "Geflieste Fläche (m²)");
      assert.ok(result.results.includes(net) && result.results.includes(purchase) && result.results.includes(packs), `${language}: ${result.results}`);
      assert.ok(result.guide.includes(language === "en" ? "manufacturer's consumption table" : "Verbrauchstabelle"), `${language}: guide`);
      assert.ok(result.faq.includes(language === "en" ? "silicone" : "Silikon"), `${language}: FAQ`);
      assert.ok(result.quality.includes(language === "en" ? "Dry interior wall" : "Trockene Innenwand"), `${language}: quality panel`);
      assert.ok(result.meta.includes(language === "en" ? "Grout calculator" : "Fugenmörtel-Rechner"), `${language}: metadata`);
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.report.includes(language === "en" ? "Error report" : "Fehlermeldung"));
      assert.equal(JSON.stringify(result.inputs), before, `${language}: input preservation`);
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const x=document.getElementById('construction-area');x.value='0';x.form.requestSubmit()})()`);
      assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`), error, `${language}: validation`);
      await evaluate(`(()=>{const x=document.getElementById('construction-area');x.value='20';x.form.requestSubmit()})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Fugakalkulátor – fugázóanyag mennyiség kalkulátor");
  }
  console.log("Grout locale: EN/DE form, results, errors, guide, FAQ, quality panel, metadata and HU restoration passed.");
}
module.exports = { checkGroutLocale };

"use strict";
const assert = require("node:assert/strict");

async function checkPaintLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/festek-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<120&&!document.querySelector('.paint-reality-check[data-construction-quality] [data-cq="surface"]');i++)await new Promise(requestAnimationFrame);if(!document.querySelector('.paint-reality-check[data-construction-quality]'))throw Error('Paint quality panel did not initialize');const values={roomLength:'4',roomWidth:'5',roomHeight:'2.7',windowArea:'2',doorArea:'2',layers:'2',coverage:'10',paintPrice:'2500'};for(const[id,value]of Object.entries(values)){const x=document.getElementById(id);x.value=value;x.dispatchEvent(new Event('input',{bubbles:true}))}const c=document.getElementById('paintCeiling');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
    const before = JSON.parse(await evaluate(`JSON.stringify({inputs:[...document.querySelectorAll('.page-festek input')].map(x=>[x.id||x.dataset.cq,x.type==='checkbox'?x.checked:x.value]),surface:document.querySelector('.paint-reality-check[data-construction-quality] [data-cq="surface"]')?.value})`));
    for (const [language, heading] of [["en", "Paint Calculator"], ["de", "Farbrechner"]]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('.page-festek h1')?.textContent.trim(),label:document.querySelector('label[for="roomLength"]')?.textContent.trim(),wall:document.getElementById('wallArea')?.textContent.trim(),ceiling:document.getElementById('ceilingArea')?.textContent.trim(),openings:document.getElementById('openingsArea')?.textContent.trim(),total:document.getElementById('totalArea')?.textContent.trim(),paint:document.getElementById('paintNeeded')?.textContent.trim(),recommended:document.getElementById('recommendedPaint')?.textContent.trim(),cost:document.getElementById('paintCost')?.textContent.trim(),summary:document.getElementById('summaryText')?.innerText,guide:document.querySelector('.adsense-content')?.innerText,faq:document.querySelector('.faq-list')?.textContent,quality:document.querySelector('.paint-reality-check[data-construction-quality]')?.innerText,adjusted:document.querySelector('.paint-reality-check[data-construction-quality] [data-cq="adjusted"]')?.textContent.trim(),buckets:document.querySelector('.paint-reality-check[data-construction-quality] [data-cq="buckets"]')?.textContent.trim(),meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:(()=>{const u=new URL(document.querySelector('.page-festek a[href^="mailto:"][href*="subject="]').href);return [u.searchParams.get('subject'),u.searchParams.get('body')]})(),values:{inputs:[...document.querySelectorAll('.page-festek input')].map(x=>[x.id||x.dataset.cq,x.type==='checkbox'?x.checked:x.value]),surface:document.querySelector('.paint-reality-check[data-construction-quality] [data-cq="surface"]')?.value},width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(language === "en" ? "Paint Calculator" : "Farbrechner"));
      assert.equal(result.label, language === "en" ? "Room length (m)" : "Raumlänge (m)");
      assert.equal(result.wall, language === "en" ? "48.60 m²" : "48,60 m²");
      assert.equal(result.ceiling, language === "en" ? "20.00 m²" : "20,00 m²");
      assert.equal(result.openings, language === "en" ? "4.00 m²" : "4,00 m²");
      assert.equal(result.total, language === "en" ? "64.60 m²" : "64,60 m²");
      assert.equal(result.paint, language === "en" ? "12.92 litres" : "12,92 Liter");
      assert.equal(result.recommended, "15 " + (language === "en" ? "litres" : "Liter"));
      assert.equal(result.cost, language === "en" ? "37,500 HUF" : "37.500 HUF");
      assert.ok(result.summary.includes(language === "en" ? "Painting summary" : "Anstrichübersicht"), result.summary);
      assert.ok(result.guide.includes(language === "en" ? "product data sheet" : "Produktdatenblatt"));
      assert.ok(result.faq.includes(language === "en" ? "actual consumption" : "tatsächliche Verbrauch"));
      assert.ok(result.quality.includes(language === "en" ? "Coverage reality check" : "Deckkraft-Praxischeck"), `${language}: ${result.quality}`);
      assert.equal(result.adjusted, language === "en" ? "14.21 l" : "14,21 l");
      assert.equal(result.buckets, "2 × 10 l");
      assert.ok(result.meta.includes(language === "en" ? "estimate how much wall paint" : "Schätze, wie viel Wandfarbe"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "extra" : "Zuschlag"));
      assert.equal(result.report[0], language === "en" ? "Error report – Paint Calculator" : "Fehlermeldung – Farbrechner");
      assert.deepEqual(result.values, before, `${language}: input values changed`);
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(async()=>{const x=document.getElementById('windowArea');x.value='100';x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      assert.equal(await evaluate(`document.getElementById('summaryText').textContent.trim()`), language === "en" ? "The total window and door area cannot exceed the area of the four walls." : "Die Gesamtfläche von Fenstern und Türen darf nicht größer sein als die Fläche der vier Wände.");
      await evaluate(`(async()=>{const x=document.getElementById('windowArea');x.value='2';x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('.page-festek h1').textContent.trim()`), "Festék kalkulátor");
    assert.equal(await evaluate(`document.getElementById('paintCost').textContent.trim()`), "37 500 Ft");
  }
  console.log("Paint locale: EN/DE areas, quantities, cost, errors, guidance, FAQ, quality panel, metadata and HU restoration passed.");
}
module.exports = { checkPaintLocale };

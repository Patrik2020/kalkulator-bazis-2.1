"use strict";
const assert = require("node:assert/strict");

async function checkFuelPriceDifferenceLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/uzemanyagar-kulonbseg-kalkulator.html");
    for (const [language, heading, costA, costB, litres] of [
      ["en", "Fuel Price Comparison Calculator", "19,500 HUF", "20,150 HUF", "32.5 l"],
      ["de", "Kraftstoffpreisvergleich", "19.500 HUF", "20.150 HUF", "32,5 l"]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('fuelDiffResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.textContent,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),distance:document.getElementById('fuelDiffDistance')?.value,width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading);
      assert.ok(result.title.includes(heading));
      assert.ok(result.result.includes(costA) && result.result.includes(costB) && result.result.includes(litres) && result.result.includes("650 HUF"), result.result);
      assert.ok(result.guide.includes(language === "en" ? "significant detour" : "größerer Umweg"));
      assert.ok(result.faq.includes(language === "en" ? "electric car" : "Elektroautos"));
      assert.ok(result.note.includes(language === "en" ? "constant average" : "konstanten Durchschnittsverbrauchs"));
      assert.equal(await evaluate(`document.querySelector(".current-related-note")`), null);
      assert.ok(result.meta.includes(language === "en" ? "Compare two fuel prices" : "Vergleiche zwei Kraftstoffpreise"));
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.schema["@graph"].at(-1).mainEntity[0].name.includes(language === "en" ? "cheaper" : "günstiger"));
      assert.equal(result.distance, "500");
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const x=document.getElementById('fuelDiffDistance');x.value='0';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('fuelDiffResult').textContent.trim()`),
        language === "en" ? "Distance: the value must be greater than zero." : "Strecke: Der Wert muss größer als null sein.");
      await evaluate(`(()=>{const x=document.getElementById('fuelDiffDistance');x.value='500';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Üzemanyagár-különbség kalkulátor");
    assert.ok((await evaluate(`document.getElementById('fuelDiffResult').innerText`)).includes("Szükséges üzemanyag"));
  }
  console.log("Fuel price difference locale: EN/DE costs, errors, guidance, FAQ, metadata and HU restoration passed.");
}
module.exports = { checkFuelPriceDifferenceLocale };

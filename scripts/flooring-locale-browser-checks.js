"use strict";
const assert = require("node:assert/strict");

async function checkFlooringLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input = (id, value) => evaluate(`(async()=>{const x=document.getElementById(${JSON.stringify(id)});x.value=${JSON.stringify(value)};x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const submit = () => evaluate(`(async()=>{document.querySelector('.construction-planner').requestSubmit();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1100);
    await navigate("/kalkulatorok/padlo-burkolat-kalkulator.html");
    for (const [id, value] of [["construction-length", "6.2"], ["construction-width", "3.8"], ["construction-excludeArea", "1.5"], ["construction-packCoverage", "2.3"], ["construction-underlayPack", "9"], ["construction-skirtingExclude", "1.2"], ["construction-skirtingPiece", "2.4"]]) await input(id, value);
    await submit();
    const ids = ["construction-length", "construction-width", "construction-excludeArea", "construction-packCoverage", "construction-waste", "construction-underlayPack", "construction-skirtingExclude", "construction-skirtingPiece"];
    const before = await evaluate(`JSON.stringify(${JSON.stringify(ids)}.map(id=>document.getElementById(id).value))`);
    for (const [language, heading, resultNeedle, guideNeedle, faqNeedle, qualityNeedle] of [
      ["en", "Flooring Calculator", "Flooring packs", "preliminary quantity estimate", "Where can I find the coverage per pack?", "Left after rounding to full packs"],
      ["de", "Bodenbelagsrechner", "Bodenbelagspakete", "vorläufige Mengenschätzung", "Wo finde ich die Deckfläche je Paket?", "Rest nach Aufrundung auf ganze Pakete"]
    ]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),result:document.querySelector('.construction-results')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('.construction-quality')?.innerText,method:document.querySelector('.construction-methodology')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href,values:${JSON.stringify(ids)}.map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(state.heading, heading);
      assert.ok(state.result.includes(resultNeedle), state.result);
      assert.ok(state.guide.includes(guideNeedle));
      assert.ok(state.faq.includes(faqNeedle));
      assert.ok(state.quality.includes(qualityNeedle));
      assert.ok(state.method.includes(language === "en" ? "manufacturer's data sheet takes precedence" : "Herstellerdatenblatt ist maßgeblich"));
      assert.ok(state.meta.includes(language === "en" ? "Calculate flooring requirements" : "Berechne den Bodenbelagsbedarf"));
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(JSON.stringify(state.values), before);
      assert.ok(new URL(state.href).searchParams.get("subject").includes(language === "en" ? "Flooring Calculator" : "Bodenbelagsrechner"));
      assert.ok(state.width <= width + 1);
      await input("construction-excludeArea", "99");
      await submit();
      assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`), language === "en" ? "The net floor area must remain positive." : "Die Nettogrundfläche muss positiv bleiben.");
      await input("construction-excludeArea", "1.5");
      await submit();
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Padlóburkolat kalkulátor");
    assert.equal(await evaluate(`JSON.stringify(${JSON.stringify(ids)}.map(id=>document.getElementById(id).value))`), before);
  }
  console.log("Flooring locale: EN/DE results, errors, guide, FAQ, metadata, inputs and HU restoration passed.");
}

module.exports = { checkFlooringLocale };

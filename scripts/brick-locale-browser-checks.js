"use strict";
const assert = require("node:assert/strict");

async function checkBrickLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input = (id, value) => evaluate(`(async()=>{const x=document.getElementById(${JSON.stringify(id)});x.value=${JSON.stringify(value)};x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1100); await navigate("/kalkulatorok/tegla-kalkulator.html");
    for (const [id, value] of [["wallLength", "10"], ["wallHeight", "2.8"], ["windowArea", "2"], ["doorArea", "2"], ["wastePercent", "10"], ["brickPrice", "900"]]) await input(id, value);
    const ids = ["wallLength", "wallHeight", "windowArea", "doorArea", "brickType", "wastePercent", "brickPrice"];
    const before = await evaluate(`JSON.stringify(${JSON.stringify(ids)}.map(id=>document.getElementById(id).value))`);
    for (const [language, heading, resultNeedle, guideNeedle, faqNeedle, qualityNeedle] of [["en", "Brick Calculator", "Bricks required", "pieces-per-square-metre", "Does it calculate mortar too?", "Pallet and reserve planner"], ["de", "Ziegelrechner", "Benötigte Ziegel", "flächenbezogene Stückbedarf", "Berechnet er auch Mörtel?", "Paletten- und Reserveplaner"]]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),result:document.querySelector('.result-box')?.innerText,summary:document.getElementById('summaryText')?.innerText,guide:document.querySelector('.adsense-content')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('.construction-quality')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href,values:${JSON.stringify(ids)}.map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(state.heading, heading); assert.ok(state.result.toLocaleLowerCase().includes(resultNeedle.toLocaleLowerCase()), state.result); assert.ok(state.result.includes(language === "en" ? "423 pcs" : "423 Stk."), state.result); assert.ok(state.summary.includes(language === "en" ? "Brick summary" : "Ziegelübersicht")); assert.ok(state.guide.includes(guideNeedle)); assert.ok(state.faq.includes(faqNeedle)); assert.ok(state.quality.includes(qualityNeedle)); assert.ok(state.meta.includes(language === "en" ? "Brick calculator" : "Ziegelrechner")); assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE"); assert.equal(JSON.stringify(state.values), before); assert.ok(new URL(state.href).searchParams.get("subject").includes(language === "en" ? "Brick Calculator" : "Ziegelrechner")); assert.ok(state.width <= width + 1);
    }
    await choose("hu"); assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Tégla kalkulátor"); assert.equal(await evaluate(`JSON.stringify(${JSON.stringify(ids)}.map(id=>document.getElementById(id).value))`), before);
  }
  console.log("Brick locale: EN/DE content, results, metadata, inputs and HU restoration passed.");
}
module.exports = { checkBrickLocale };

"use strict";
const assert = require("node:assert/strict");

async function checkRuleOfThreeLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/harmasszabaly-kalkulator.html");
    const before = await evaluate(`JSON.stringify([...document.querySelectorAll('#ruleA,#ruleB,#ruleC')].map(x=>[x.id,x.value]))`);
    for (const [language, heading, value, factor, error] of [
      ["en", "Rule of Three Calculator", "7.5", "2.5", "A cannot be zero because it is the divisor in the formula."],
      ["de", "Dreisatz-Rechner", "7,5", "2,5", "A darf nicht null sein, da es in der Formel als Divisor verwendet wird."]
    ]) {
      await choose(language);
      await evaluate(`(()=>{for(const [id,value] of [['ruleA','4'],['ruleB','3'],['ruleC','10']]){const x=document.getElementById(id);x.value=value;x.dispatchEvent(new Event('input',{bubbles:true}))}})()`);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),label:document.querySelector('label[for="ruleA"]')?.textContent.trim(),output:document.getElementById('ruleResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:new URL(document.querySelector('main a[href^="mailto:"]').href).searchParams.get('subject'),inputs:[...document.querySelectorAll('#ruleA,#ruleB,#ruleC')].map(x=>[x.id,x.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading, `${language}: heading`);
      assert.ok(result.title.includes(heading), `${language}: title`);
      assert.equal(result.label, language === "en" ? "Value A" : "Wert A");
      assert.ok(result.output.includes(language === "en" ? "Value of X" : "Wert von X"), result.output);
      assert.ok(result.output.includes(value) && result.output.includes(factor), `${language}: ${result.output}`);
      assert.ok(result.guide.includes(language === "en" ? "inversely proportional" : "umgekehrter Proportionalität"), `${language}: guide`);
      assert.ok(result.faq.includes(language === "en" ? "decimal numbers" : "Dezimalzahlen"), `${language}: FAQ`);
      assert.ok(result.meta.includes(language === "en" ? "Rule of three calculator" : "Dreisatz-Rechner"), `${language}: metadata`);
      assert.equal(result.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(result.report.includes(language === "en" ? "Error report" : "Fehlermeldung"));
      assert.equal(JSON.stringify(result.inputs), JSON.stringify([["ruleA","4"],["ruleB","3"],["ruleC","10"]]), `${language}: input preservation`);
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const x=document.getElementById('ruleA');x.value='0';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('ruleResult').textContent.trim()`), error, `${language}: zero divisor`);
      await evaluate(`(()=>{const x=document.getElementById('ruleA');x.value='4';x.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Hármasszabály kalkulátor");
    assert.ok(await evaluate(`document.getElementById('ruleResult').innerText.includes('X értéke')`));
    assert.equal(before, JSON.stringify([["ruleA","2"],["ruleB","5"],["ruleC","8"]]));
  }
  console.log("Rule of three locale: EN/DE form, numbers, results, errors, guide, FAQ, metadata, responsive widths and HU restoration passed.");
}
module.exports = { checkRuleOfThreeLocale };

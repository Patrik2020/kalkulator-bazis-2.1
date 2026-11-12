"use strict";
const assert = require("node:assert/strict");

async function checkSkirtingLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const setInput = (id, value) => evaluate(`(async()=>{const x=document.getElementById(${JSON.stringify(id)});x.value=${JSON.stringify(value)};x.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/szegolec-kalkulator.html");
    for (const [id, value] of [["skirtPerimeter", "22.5"], ["skirtOpenings", "1.5"], ["skirtPiece", "2.4"], ["skirtWaste", "12"]]) await setInput(id, value);
    const before = await evaluate(`JSON.stringify(['skirtPerimeter','skirtOpenings','skirtPiece','skirtWaste'].map(id=>document.getElementById(id).value))`);
    for (const [language, heading, required, pieces] of [["en", "Skirting Board Calculator", "23.52 m", "10 pcs"], ["de", "Sockelleisten-Rechner", "23,52 m", "10 Stk."]]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('skirtResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,note:document.querySelector('.reliability-note')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),href:document.querySelector('.reliability-actions a[href^="mailto:"]')?.href,values:['skirtPerimeter','skirtOpenings','skirtPiece','skirtWaste'].map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(state.heading, heading);
      assert.ok(state.title.includes(language === "en" ? "Skirting Board" : "Sockelleisten"));
      assert.ok(state.result.includes(required) && state.result.includes(pieces), state.result);
      assert.ok(state.result.includes(language === "en" ? "Required including allowance:" : "Bedarf einschließlich Verschnitt:"), state.result);
      assert.ok(state.guide.includes(language === "en" ? "mitre cuts" : "Gehrungsschnitte"));
      assert.ok(state.faq.includes(language === "en" ? "Should doorways" : "Müssen Türöffnungen"));
      assert.ok(state.note.includes(language === "en" ? "purchasing estimate" : "Einkaufsschätzung"));
      assert.ok(state.meta.includes(language === "en" ? "number of skirting boards" : "Anzahl der Sockelleisten"));
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(JSON.stringify(state.values), before);
      assert.ok(new URL(state.href).searchParams.get("subject").includes(language === "en" ? "Skirting Board" : "Sockelleisten"));
      assert.ok(state.width <= width + 1, `${language}: overflow at ${width}px`);
      await setInput("skirtOpenings", "30");
      assert.equal(await evaluate(`document.getElementById('skirtResult').textContent.trim()`), language === "en" ? "The total length of the openings cannot exceed the perimeter." : "Die Gesamtlänge der Öffnungen darf nicht größer als der Umfang sein.");
      await setInput("skirtOpenings", "1.5");
      await setInput("skirtWaste", "101");
      assert.equal(await evaluate(`document.getElementById('skirtResult').textContent.trim()`), language === "en" ? "The allowance must not exceed 100%." : "Der Verschnitt darf höchstens 100 % betragen.");
      await setInput("skirtWaste", "12");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Szegőléc kalkulátor");
    assert.ok((await evaluate(`document.getElementById('skirtResult').innerText`)).includes("23,52 m"));
    assert.equal(await evaluate(`JSON.stringify(['skirtPerimeter','skirtOpenings','skirtPiece','skirtWaste'].map(id=>document.getElementById(id).value))`), before);
  }
  console.log("Skirting locale: EN/DE results, errors, guidance, FAQ, metadata, inputs and HU restoration passed.");
}
module.exports = { checkSkirtingLocale };

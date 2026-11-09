"use strict";
const assert = require("node:assert/strict");

async function checkUnitConverterLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const configure = (type, value, from, to) => evaluate(`(async()=>{const set=(id,value,event='change')=>{const x=document.getElementById(id);x.value=value;x.dispatchEvent(new Event(event,{bubbles:true}))};set('measurementType',${JSON.stringify(type)});set('inputValue',${JSON.stringify(value)},'input');set('fromUnit',${JSON.stringify(from)});set('toUnit',${JSON.stringify(to)});await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/mertekegyseg-atvalto-kalkulator.html");
    await configure("time", "90", "min", "h");
    const before = await evaluate(`JSON.stringify(['measurementType','inputValue','fromUnit','toUnit'].map(id=>document.getElementById(id).value))`);
    for (const [language, heading, resultText, guideText, faqText] of [
      ["en", "Unit Converter – Time, Length, Mass and Other Units", "90 minutes = 1.5 hours", "common base unit", "Are MB and MiB the same?"],
      ["de", "Einheitenrechner – Zeit, Länge, Masse und weitere Einheiten", "90 Minuten = 1,5 Stunden", "gemeinsame Basiseinheit", "Sind MB und MiB dasselbe?"]
    ]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),result:document.getElementById('result')?.textContent.trim(),guide:document.querySelector('.article')?.innerText,faq:document.querySelector('.faq-list')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),values:['measurementType','inputValue','fromUnit','toUnit'].map(id=>document.getElementById(id).value),width:document.documentElement.scrollWidth})`));
      assert.equal(state.heading, heading);
      assert.equal(state.result, resultText);
      assert.ok(state.guide.includes(guideText), state.guide);
      assert.ok(state.faq.includes(faqText), state.faq);
      assert.ok(state.meta.includes(language === "en" ? "11 categories" : "11 Kategorien"));
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(JSON.stringify(state.values), before);
      assert.ok(state.width <= width + 1, `${language} overflow at ${width}px: ${state.width}`);

      await configure("temperature", "-274", "c", "k");
      assert.equal(await evaluate(`document.getElementById('result').textContent.trim()`), language === "en" ? "Temperature cannot be below absolute zero." : "Die Temperatur darf nicht unter dem absoluten Nullpunkt liegen.");
      assert.ok((await evaluate(`document.getElementById('fromUnit').textContent`)).includes("Celsius"));
      await configure("time", "90", "min", "h");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Mértékegység átváltó – idő, hosszúság, tömeg és más egységek");
    assert.equal(await evaluate(`document.getElementById('result').textContent.trim()`), "90 Perc = 1,5 Óra");
    assert.equal(await evaluate(`JSON.stringify(['measurementType','inputValue','fromUnit','toUnit'].map(id=>document.getElementById(id).value))`), before);
  }
  console.log("Unit converter locale: EN/DE calculations, validation, guide, FAQ, metadata, responsive layout, inputs and HU restoration passed.");
}

module.exports = { checkUnitConverterLocale };

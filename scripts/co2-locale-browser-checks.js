"use strict";
const assert = require("node:assert/strict");

async function checkCo2CalculatorLocale({ navigate, evaluate, setViewport }) {
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/co2-kibocsatas-kalkulator");
    await evaluate(`(async()=>{for(let i=0;i<80&&!document.querySelector('.card-calculator form.ac-grid');i++)await new Promise(requestAnimationFrame);const f=document.querySelector('.card-calculator form.ac-grid');if(!f)throw Error('CO2 calculator did not initialize');for(const [n,v] of Object.entries({type:'petrol',km:'100',cons:'6.5',tailpipe:'2.31',upstream:'0.55',electricShare:'50',electricCons:'18',grid:'0.25',chargingLoss:'10'})){f.elements.namedItem(n).value=v;f.elements.namedItem(n).dispatchEvent(new Event('input',{bubbles:true}))}f.requestSubmit()})()`);
    const inputBefore = await evaluate(`JSON.stringify([...document.querySelectorAll('.card-calculator form.ac-grid input,.card-calculator form.ac-grid select')].map(x=>[x.name,x.value]))`);
    for (const [language, label] of [["en", "Powertrain"], ["de", "Antrieb"]]) {
      await evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
      const actual = JSON.parse(await evaluate(`JSON.stringify({label:document.querySelector('.card-calculator form.ac-grid label')?.textContent,result:document.querySelector('.card-calculator form.ac-grid .ac-result')?.textContent,inputs:[...document.querySelectorAll('.card-calculator form.ac-grid input,.card-calculator form.ac-grid select')].map(x=>[x.name,x.value]),title:document.title,width:document.documentElement.scrollWidth})`));
      assert.match(actual.label, new RegExp(label, "u"), `${language}: powertrain label`);
      assert.match(actual.result, /Direct use-phase emissions|Direkte Emissionen während der Nutzung/u, `${language}: translated result label`);
      assert.match(actual.result, /15,02 kg CO₂/u, `${language}: direct emissions figure`);
      const related = await evaluate(`JSON.stringify([...document.querySelectorAll('main .calculator-card h3')].map(x=>x.textContent.trim()))`);
      assert.ok(related.includes(language === "en" ? "Fuel consumption calculator" : "Kraftstoffverbrauchsrechner"), `${language}: related calculator cards`);
      assert.deepEqual(actual.inputs, JSON.parse(inputBefore), `${language}: input values changed`);
      assert.match(actual.title, /CO₂/u, `${language}: page title`);
      assert.ok(actual.width <= width + 1, `CO2 page overflow at ${width}px (${language})`);
    }
    await evaluate(`(()=>{const s=document.getElementById('kbInternalLanguage');s.value='hu';s.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  }
}
module.exports = { checkCo2CalculatorLocale };

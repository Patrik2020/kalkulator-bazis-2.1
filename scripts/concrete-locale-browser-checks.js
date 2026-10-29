"use strict";
const assert = require("node:assert/strict");

async function checkConcreteCalculatorLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    if (!select) throw new Error('Missing internal language selector');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  })()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate('/kalkulatorok/beton-kalkulator');
    await evaluate(`(async () => {
      for (const [id,value] of [['length','10'],['width','5'],['depth','20']]) {
        const input=document.getElementById(id);
        if(!input) throw new Error('Missing concrete calculator input: '+id);
        input.value=value;
        input.dispatchEvent(new Event('input',{bubbles:true}));
      }
      await new Promise(requestAnimationFrame);
    })()`);
    const before=await evaluate(`JSON.stringify([...document.querySelectorAll('.page-beton input[type=number]')].map(input=>[input.id,input.value]))`);
    for (const [language,heading,label,warning] of [
      ['en','Concrete Calculator – Volume and Material Estimate','Length (m)','This calculator estimates quantities; it is not for structural design.'],
      ['de','Betonrechner – Volumen und Materialbedarf','Länge (m)','Dieser Rechner schätzt Mengen und ersetzt keine statische Planung.']
    ]) {
      await choose(language);
      const result=JSON.parse(await evaluate(`JSON.stringify({
        heading:document.querySelector('.page-beton h1')?.textContent.trim(),
        label:document.querySelector('label[for="length"]')?.textContent.trim(),
        output:document.getElementById('result-volume')?.textContent.trim(),
        warning:document.querySelector('.page-beton .notice-box')?.textContent,
        values:[...document.querySelectorAll('.page-beton input[type=number]')].map(input=>[input.id,input.value]),
        width:document.documentElement.scrollWidth
      })`));
      assert.equal(result.heading,heading,language+': page heading');
      assert.equal(result.label,label,language+': length label');
      assert.equal(result.output,'10,00 m³',language+': calculated volume');
      assert.ok(result.warning.includes(warning),language+': structural design caveat');
      assert.deepEqual(result.values,JSON.parse(before),language+': input values changed');
      assert.ok(result.width<=width+1,'concrete calculator overflow at '+width+'px ('+language+')');
    }
    await choose('hu');
    assert.equal(await evaluate(`document.querySelector('label[for="length"]')?.textContent.trim()`),'Hossz (m)');
  }
  console.log('Concrete calculator locale: HU/EN/DE copy, live volume, input preservation and responsive widths passed at 390/1440px.');
}
module.exports = { checkConcreteCalculatorLocale };

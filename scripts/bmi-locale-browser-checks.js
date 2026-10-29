"use strict";
const assert = require("node:assert/strict");

async function checkBmiCalculatorLocale({ navigate, evaluate, setViewport }) {
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
    await navigate('/kalkulatorok/bmi-kalkulator');
    await evaluate(`(async () => {
      for (const [id,value] of [['weight','70'],['height','175']]) {
        const input=document.getElementById(id);
        if(!input) throw new Error('Missing BMI calculator input: '+id);
        input.value=value;
        input.dispatchEvent(new Event('input',{bubbles:true}));
      }
      await new Promise(requestAnimationFrame);
    })()`);
    const before=await evaluate(`JSON.stringify([...document.querySelectorAll('.page-bmi input[type=number]')].map(input=>[input.id,input.value]))`);
    for (const [language,heading,label,category,caveat] of [
      ['en','BMI Calculator','Weight (kg)','Healthy weight','not a diagnosis'],
      ['de','BMI-Rechner','Gewicht (kg)','Normalgewicht','keine diagnose']
    ]) {
      await choose(language);
      const result=JSON.parse(await evaluate(`JSON.stringify({
        heading:document.querySelector('.page-bmi h1')?.textContent.trim(),
        label:document.querySelector('label[for="weight"]')?.textContent.trim(),
        value:document.getElementById('result-bmi')?.textContent.trim(),
        category:document.getElementById('result-category')?.textContent.trim(),
        caveat:document.querySelector('.page-bmi .reliability-note')?.textContent,
        values:[...document.querySelectorAll('.page-bmi input[type=number]')].map(input=>[input.id,input.value]),
        width:document.documentElement.scrollWidth
      })`));
      assert.equal(result.heading,heading,language+': page heading');
      assert.equal(result.label,label,language+': weight label');
      assert.equal(result.value,'22.9',language+': BMI number changed');
      assert.equal(result.category,category,language+': BMI category');
      assert.ok(result.caveat.toLowerCase().includes(caveat),language+': non-diagnostic caveat');
      assert.deepEqual(result.values,JSON.parse(before),language+': input values changed');
      assert.ok(result.width<=width+1,'BMI calculator overflow at '+width+'px ('+language+')');
    }
    await choose('hu');
    assert.equal(await evaluate(`document.querySelector('label[for="weight"]')?.textContent.trim()`),'Testsúly (kg)');
  }
  console.log('BMI calculator locale: HU/EN/DE labels, live BMI/category, caveats and input preservation passed at 390/1440px.');
}
module.exports = { checkBmiCalculatorLocale };

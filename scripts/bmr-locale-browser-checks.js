"use strict";
const assert = require("node:assert/strict");

async function checkBmrCalculatorLocale({ navigate, evaluate, setViewport }) {
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
    await navigate('/kalkulatorok/bmr-kalkulator');
    await evaluate(`(async () => {
      const gender=document.getElementById('gender');
      gender.value='2';
      gender.dispatchEvent(new Event('change',{bubbles:true}));
      for (const [id,value] of [['weight','75'],['height','175'],['age','35']]) {
        const input=document.getElementById(id);
        if(!input) throw new Error('Missing BMR input: '+id);
        input.value=value;
        input.dispatchEvent(new Event('input',{bubbles:true}));
      }
      await new Promise(requestAnimationFrame);
    })()`);
    const before=await evaluate(`JSON.stringify({gender:document.getElementById('gender')?.value,values:[...document.querySelectorAll('[data-simple-calc="bmr-kalkulator"] input')].map(input=>[input.id,input.value])})`);
    for (const [language,heading,weightLabel,resultLabel,unit,faqTitle,caveat] of [
      ['en','BMR Calculator','Weight (kg)','Estimated resting energy expenditure','kcal/day','Frequently asked questions','not a diagnosis'],
      ['de','BMR-Rechner','Gewicht (kg)','Geschätzter Ruheenergieverbrauch','kcal/Tag','Häufige Fragen','keine diagnose']
    ]) {
      await choose(language);
      const result=JSON.parse(await evaluate(`JSON.stringify({
        heading:document.querySelector('.page-bmr h1')?.textContent.trim(),
        label:document.querySelector('label[for="weight"]')?.textContent.trim(),
        output:document.getElementById('simpleCalcResults')?.textContent,
        faq:[...document.querySelectorAll('.page-bmr h2')].find(h=>h.textContent.trim()==='${faqTitle}')?.textContent.trim(),
        caveat:document.querySelector('.page-bmr .reliability-note')?.textContent,
        meta:document.querySelector('meta[name="description"]')?.content,
        schema:document.querySelector('#kb-structured-data')?.textContent,
        values:[...document.querySelectorAll('[data-simple-calc="bmr-kalkulator"] input')].map(input=>[input.id,input.value]),
        gender:document.getElementById('gender')?.value,
        width:document.documentElement.scrollWidth
      })`));
      assert.equal(result.heading,heading,language+': heading');
      assert.equal(result.label,weightLabel,language+': weight label');
      assert.ok(result.output.includes(resultLabel),language+': dynamic result label');
      assert.ok(result.output.includes('1,674') || result.output.includes('1 674') || result.output.includes('1674'),language+': first calculation changed');
      assert.ok(result.output.includes(unit),language+': result unit');
      assert.equal(result.faq,faqTitle,language+': FAQ heading');
      assert.ok(result.caveat.toLowerCase().includes(caveat),language+': health caveat');
      assert.ok(!result.meta.includes('BMR kalkulátor'),language+': metadata remains Hungarian');
      assert.ok(result.schema.includes(language==='en'?'BMR Calculator':'BMR-Rechner'),language+': structured data remains Hungarian');
      assert.deepEqual({gender:result.gender,values:result.values},JSON.parse(before),language+': input values changed');
      assert.ok(result.width<=width+1,'BMR page overflow at '+width+'px ('+language+')');
    }
    await choose('hu');
    assert.equal(await evaluate(`document.querySelector('label[for="weight"]')?.textContent.trim()`),'Testsúly (kg)');
  }
  console.log('BMR locale: HU/EN/DE labels, dynamic result, metadata/schema, caveats and input preservation passed at 390/1440px.');
}
module.exports = { checkBmrCalculatorLocale };

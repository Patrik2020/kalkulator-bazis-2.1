"use strict";
const assert = require("node:assert/strict");

async function checkFuelLocales({ navigate, evaluate, setViewport }) {
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
    await navigate("/kalkulatorok/auto-fogyasztas-kalkulator");
    await evaluate(`(async () => {
      for (let i = 0; i < 60 && !document.getElementById('liters'); i += 1) await new Promise(requestAnimationFrame);
      const liters = document.getElementById('liters');
      const distance = document.getElementById('distance');
      if (!liters || !distance) throw new Error('Fuel consumption calculator did not initialize');
      liters.value = '42'; distance.value = '650';
      liters.dispatchEvent(new Event('input', { bubbles: true }));
      distance.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    const consumptionBefore = await evaluate(`JSON.stringify({
      liters: document.getElementById('liters').value,
      distance: document.getElementById('distance').value
    })`);
    for (const [language, label] of [["en", "Fuel added (L)"], ["de", "Getankte Menge (l)"]]) {
      await choose(language);
      const actual = await evaluate(`JSON.stringify({
        label: document.querySelector('label[for="liters"]')?.textContent.trim(),
        result: document.getElementById('simpleCalcResults')?.textContent,
        state: { liters: document.getElementById('liters')?.value, distance: document.getElementById('distance')?.value },
        width: document.documentElement.scrollWidth
      })`);
      const result = JSON.parse(actual);
      assert.ok(result.label.includes(label), `${language}: consumption field label`);
      assert.match(result.result, /6,46 l\/100 km/u, `${language}: calculated consumption`);
      assert.deepEqual(result.state, JSON.parse(consumptionBefore), `${language}: consumption inputs changed`);
      assert.ok(result.width <= width + 1, `fuel consumption calculator overflow at ${width}px (${language})`);
    }
    await choose("hu");
    assert.match(await evaluate('document.querySelector(\'label[for="liters"]\')?.textContent || ""'), /Tankolt mennyiség/u);

    await navigate("/kalkulatorok/uzemanyag-koltseg-kalkulator");
    await evaluate(`(async () => {
      for (let i = 0; i < 60 && !document.querySelector('.card-calculator form.ac-grid input[name="distance"]'); i += 1) await new Promise(requestAnimationFrame);
      const form = document.querySelector('.card-calculator form.ac-grid');
      if (!form) throw new Error('Fuel cost calculator did not initialize');
      for (const [name, value] of Object.entries({distance:'240', cons:'6.5', price:'640', toll:'0', people:'1', priceChange:'10'})) {
        const input = form.elements.namedItem(name);
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      form.requestSubmit();
    })()`);
    const costBefore = await evaluate(`JSON.stringify([...document.querySelectorAll('.card-calculator form.ac-grid input')].map(input => [input.name, input.value]))`);
    for (const [language, label] of [["en", "Distance (km)"], ["de", "Strecke (km)"]]) {
      await choose(language);
      const actual = await evaluate(`JSON.stringify({
        label: document.querySelector('.card-calculator form.ac-grid label')?.textContent,
        result: document.querySelector('.card-calculator form.ac-grid .ac-result')?.textContent,
        state: [...document.querySelectorAll('.card-calculator form.ac-grid input')].map(input => [input.name, input.value]),
        width: document.documentElement.scrollWidth
      })`);
      const result = JSON.parse(actual);
      assert.ok(result.label.includes(label), `${language}: trip distance label`);
      assert.match(result.result, /9[\s\u00a0\u202f]?984/u, `${language}: calculated trip cost`);
      assert.deepEqual(result.state, JSON.parse(costBefore), `${language}: trip inputs changed`);
      assert.ok(result.width <= width + 1, `fuel cost calculator overflow at ${width}px (${language})`);
    }
    await choose("hu");
    assert.match(await evaluate('document.querySelector(\'.card-calculator form.ac-grid label\')?.textContent || ""'), /Távolság/u);

    await navigate("/kalkulatorok/hatotav-kalkulator");
    await evaluate(`(async () => {
      for (let i = 0; i < 60 && !document.getElementById('simpleCalcResults'); i += 1) await new Promise(requestAnimationFrame);
      const fuel = document.getElementById('fuel');
      const consumption = document.getElementById('consumption');
      if (!fuel || !consumption) throw new Error('Driving range calculator did not initialize');
      fuel.value = '32'; consumption.value = '6.4';
      fuel.dispatchEvent(new Event('input', { bubbles: true }));
      consumption.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    const rangeBefore = await evaluate(`JSON.stringify({fuel: document.getElementById('fuel').value, consumption: document.getElementById('consumption').value})`);
    for (const [language, label] of [["en", "Fuel in tank (L)"], ["de", "Kraftstoff im Tank (l)"]]) {
      await choose(language);
      const actual = await evaluate(`JSON.stringify({
        label: document.querySelector('label[for="fuel"]')?.textContent.trim(),
        result: document.getElementById('simpleCalcResults')?.textContent,
        guidance: document.querySelector('.calculator-guide h2')?.textContent,
        state: {fuel: document.getElementById('fuel')?.value, consumption: document.getElementById('consumption')?.value},
        width: document.documentElement.scrollWidth
      })`);
      const result = JSON.parse(actual);
      assert.equal(result.label, label, `${language}: range field label`);
      assert.match(result.result, /500\s*km/u, `${language}: calculated range`);
      assert.ok(result.guidance.length > 0, `${language}: range guidance translated`);
      assert.deepEqual(result.state, JSON.parse(rangeBefore), `${language}: range inputs changed`);
      assert.ok(result.width <= width + 1, `range calculator overflow at ${width}px (${language})`);
    }
    await choose("hu");
    assert.match(await evaluate('document.querySelector(\'label[for="fuel"]\')?.textContent || ""'), /Üzemanyag a tankban/u);

    await navigate("/kalkulatorok/tankolas-kalkulator");
    await evaluate(`(async () => {
      for (let i = 0; i < 60 && !document.getElementById('simpleCalcResults'); i += 1) await new Promise(requestAnimationFrame);
      const budget = document.getElementById('budget');
      const price = document.getElementById('price');
      if (!budget || !price) throw new Error('Refuelling budget calculator did not initialize');
      budget.value = '20000'; price.value = '640';
      budget.dispatchEvent(new Event('input', { bubbles: true }));
      price.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    const budgetBefore = await evaluate(`JSON.stringify({budget: document.getElementById('budget').value, price: document.getElementById('price').value})`);
    for (const [language, label] of [["en", "Refuelling budget (HUF)"], ["de", "Tankbudget (HUF)"]]) {
      await choose(language);
      const actual = await evaluate(`JSON.stringify({
        label: document.querySelector('label[for="budget"]')?.textContent.trim(),
        result: document.getElementById('simpleCalcResults')?.textContent,
        discountLabel: document.querySelector('[data-acq-input="budget"]')?.parentElement?.textContent.trim(),
        state: {budget: document.getElementById('budget')?.value, price: document.getElementById('price')?.value},
        width: document.documentElement.scrollWidth
      })`);
      const result = JSON.parse(actual);
      assert.equal(result.label, label, `${language}: refuelling budget label`);
      assert.match(result.result, /31,25 l/u, `${language}: calculated fuel volume`);
      assert.ok(result.discountLabel && !result.discountLabel.includes("Tankolási keret"), `${language}: discount panel localized`);
      assert.deepEqual(result.state, JSON.parse(budgetBefore), `${language}: refuelling inputs changed`);
      assert.ok(result.width <= width + 1, `refuelling calculator overflow at ${width}px (${language})`);
    }
    await choose("hu");
    assert.match(await evaluate('document.querySelector(\'label[for="budget"]\')?.textContent || ""'), /Tankolási keret/u);

    await navigate("/kalkulatorok/autopalyadij-kalkulator");
    await evaluate(`(async () => {
      for (let i = 0; i < 60 && !document.getElementById('simpleCalcResults'); i += 1) await new Promise(requestAnimationFrame);
      const fee = document.getElementById('fee');
      const people = document.getElementById('people');
      if (!fee || !people) throw new Error('Toll-sharing calculator did not initialize');
      fee.value = '6620'; people.value = '4';
      fee.dispatchEvent(new Event('input', { bubbles: true }));
      people.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    const tollBefore = await evaluate(`JSON.stringify({fee: document.getElementById('fee').value, people: document.getElementById('people').value})`);
    for (const [language, label] of [["en", "Road toll (HUF)"], ["de", "Mautgebühr (HUF)"]]) {
      await choose(language);
      const actual = await evaluate(`JSON.stringify({
        label: document.querySelector('label[for="fee"]')?.textContent.trim(),
        result: document.getElementById('simpleCalcResults')?.textContent,
        guide: document.querySelector('.calculator-guide h2')?.textContent,
        breakEven: document.querySelector('.auto-converter-quality h2')?.textContent,
        state: {fee: document.getElementById('fee')?.value, people: document.getElementById('people')?.value},
        width: document.documentElement.scrollWidth
      })`);
      const result = JSON.parse(actual);
      assert.equal(result.label, label, `${language}: toll field label`);
      assert.match(result.result, /1[\s\u00a0\u202f]?655/u, `${language}: cost per person`);
      assert.ok(result.guide && result.breakEven, `${language}: toll guidance and vignette comparison localized`);
      assert.deepEqual(result.state, JSON.parse(tollBefore), `${language}: toll inputs changed`);
      assert.ok(result.width <= width + 1, `toll calculator overflow at ${width}px (${language})`);
    }
    await choose("hu");
    assert.match(await evaluate('document.querySelector(\'label[for="fee"]\')?.textContent || ""'), /Autópályadíj/u);
  }
  console.log("Fuel locales: HU/EN/DE labels, calculation results and input preservation passed at 390/1440px.");
}

async function checkDepreciationLocale({ navigate, evaluate, setViewport }) {
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
    await navigate('/kalkulatorok/auto-ertekvesztes-kalkulator');
    await evaluate(`(async () => {
      for (let i = 0; i < 180 && (window.KB_AUTO_CONVERTER_UPGRADE_READY !== 'auto-ertekvesztes-kalkulator' || !document.querySelector('.card-calculator form.ac-grid input[name="firstLow"]')); i += 1) await new Promise(requestAnimationFrame);
      if (window.KB_AUTO_CONVERTER_UPGRADE_READY !== 'auto-ertekvesztes-kalkulator') throw new Error('Depreciation calculator did not finish initializing');
    })()`);
    const before = await evaluate(`JSON.stringify([...document.querySelectorAll('.card-calculator form.ac-grid input')].map(input => [input.name, input.value]))`);
    for (const [language, label, title, guidance] of [
      ['en', 'Current value (HUF)', 'Car Depreciation Calculator', 'A percentage is not a fixed yearly loss'],
      ['de', 'Aktueller Wert (HUF)', 'Autowertverlust-Rechner', 'Ein Prozentsatz ist kein gleichbleibender Geldverlust']
    ]) {
      await choose(language);
      const actual = await evaluate(`JSON.stringify({
        label: document.querySelector('.card-calculator form.ac-grid label')?.textContent.trim(),
        title: document.querySelector('main h1')?.textContent.trim(),
        result: document.querySelector('.card-calculator form.ac-grid .ac-result')?.textContent,
        guidance: document.querySelector('.auto-converter-quality h2')?.textContent,
        state: [...document.querySelectorAll('.card-calculator form.ac-grid input')].map(input => [input.name, input.value]),
        width: document.documentElement.scrollWidth
      })`);
      const result = JSON.parse(actual);
      assert.equal(result.label, label, `${language}: current value label`);
      assert.equal(result.title, title, `${language}: page title`);
      assert.ok(result.result.includes('HUF'), `${language}: scenario values use translated currency: ${result.result}`);
      assert.ok(result.guidance.includes(guidance), `${language}: depreciation guidance translated`);
      assert.deepEqual(result.state, JSON.parse(before), `${language}: calculation inputs changed`);
      assert.ok(result.width <= width + 1, `depreciation calculator overflow at ${width}px (${language})`);
    }
    await choose('hu');
    assert.match(await evaluate("document.querySelector('.card-calculator form.ac-grid label')?.textContent || ''"), /Jelenlegi érték/u);
  }
  console.log('Depreciation locale: HU/EN/DE labels, scenario results, metadata and input preservation passed at 390/1440px.');
}

async function checkFloorLevelLocale({ navigate, evaluate, setViewport }) {
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
    await navigate('/kalkulatorok/aljzatkiegyenlito-kalkulator');
    await evaluate(`(async () => {
      for (let i = 0; i < 120 && !document.querySelector('#levelResult p strong'); i += 1) await new Promise(requestAnimationFrame);
      if (!document.querySelector('#levelResult p strong')) throw new Error('Floor level calculator did not initialize');
    })()`);
    const before = await evaluate(`JSON.stringify([...document.querySelectorAll('#kalkulator input')].map(input => [input.id, input.value]))`);
    for (const [language, label, heading, resultLabel, bagWord] of [
      ['en', 'Area (m²)', 'Floor Levelling Compound Calculator', 'Base material required:', 'bags'],
      ['de', 'Fläche (m²)', 'Bodenausgleich-Rechner', 'Grundbedarf:', 'Säcke']
    ]) {
      await choose(language);
      const actual = await evaluate(`JSON.stringify({
        label: document.querySelector('label[for="levelArea"]')?.textContent.trim(),
        heading: document.querySelector('main h1')?.textContent.trim(),
        results: document.getElementById('levelResult')?.textContent,
        body: document.querySelector('main')?.textContent,
        state: [...document.querySelectorAll('#kalkulator input')].map(input => [input.id, input.value]),
        width: document.documentElement.scrollWidth
      })`);
      const result = JSON.parse(actual);
      assert.equal(result.label, label, `${language}: area input label`);
      assert.equal(result.heading, heading, `${language}: page heading`);
      assert.ok(result.results.includes(resultLabel), `${language}: translated output labels`);
      assert.ok(result.results.includes(bagWord), `${language}: translated bag unit`);
      assert.ok(result.body.includes(language === 'en' ? 'How does it calculate the material needed?' : 'Wie berechnet der Rechner den Materialbedarf?'), `${language}: guidance translation`);
      assert.deepEqual(result.state, JSON.parse(before), `${language}: input values changed`);
      assert.ok(result.width <= width + 1, `floor level calculator overflow at ${width}px (${language})`);
    }
    await choose('hu');
    assert.match(await evaluate(`document.querySelector('label[for="levelArea"]')?.textContent || ''`), /Felület/u);
  }
  console.log('Floor level locale: HU/EN/DE labels, calculations, content and input preservation passed at 390/1440px.');
}

async function checkSleepCycleLocale({ navigate, evaluate, setViewport }) {
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
    await navigate('/kalkulatorok/alvasciklus-kalkulator');
    await evaluate(`(async () => {
      for (let i=0;i<120 && !document.querySelector('#simpleCalcResults p strong');i+=1) await new Promise(requestAnimationFrame);
      if(!document.querySelector('#simpleCalcResults p strong')) throw new Error('Sleep-cycle calculator did not initialize');
    })()`);
    const before=await evaluate(`JSON.stringify([...document.querySelectorAll('#simpleCalcFields input')].map(input=>[input.id,input.value]))`);
    for(const [language,label,heading,resultLabel,warning] of [
      ['en','Wake-up hour','Sleep Cycle Calculator','Example: 6 × 90 minutes + 15 minutes to fall asleep','not a biological rule'],
      ['de','Stunde des Aufwachens','Schlafzyklus-Rechner','Beispiel: 6 × 90 Minuten + 15 Minuten zum Einschlafen','keine biologische Regel']
    ]) {
      await choose(language);
      const actual=await evaluate(`JSON.stringify({
        label:document.querySelector('label[for="wakeHour"]')?.textContent.trim(),
        heading:document.querySelector('main h1')?.textContent.trim(),
        results:document.getElementById('simpleCalcResults')?.textContent,
        content:document.querySelector('main')?.textContent,
        state:[...document.querySelectorAll('#simpleCalcFields input')].map(input=>[input.id,input.value]),
        width:document.documentElement.scrollWidth
      })`);
      const result=JSON.parse(actual);
      assert.equal(result.label,label,`${language}: wake-up input label`);
      assert.equal(result.heading,heading,`${language}: page heading`);
      assert.ok(result.results.includes(resultLabel),`${language}: translated example output`);
      assert.ok(result.content.includes(warning),`${language}: cycle length caution`);
      assert.deepEqual(result.state,JSON.parse(before),`${language}: wake-up time changed`);
      assert.ok(result.width<=width+1,`sleep-cycle calculator overflow at ${width}px (${language})`);
    }
    await choose('hu');
    assert.match(await evaluate(`document.querySelector('label[for="wakeHour"]')?.textContent||''`),/Felkelés órája/u);
  }
  console.log('Sleep-cycle locale: HU/EN/DE labels, examples, health caveats and input preservation passed at 390/1440px.');
}

module.exports = { checkFuelLocales, checkDepreciationLocale, checkFloorLevelLocale, checkSleepCycleLocale };

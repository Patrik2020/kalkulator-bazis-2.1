"use strict";
const assert = require("node:assert/strict");

async function checkNettoBruttoLocales({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    if (!select) throw new Error('Missing internal language selector');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
  })()`);
  const read = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.replace(/\\s+/g,' ').trim() || ''`);
  const state = () => evaluate(`JSON.stringify({
    gross: document.getElementById('gross')?.value,
    net: document.getElementById('net-input')?.value,
    rate: document.getElementById('salary-tax-rate')?.value,
    under25: document.getElementById('under25')?.checked,
    married: document.getElementById('first-married')?.checked,
    dependants: document.getElementById('family-dependants')?.value,
    eligible: document.getElementById('family-eligible')?.value,
    mode: document.querySelector('input[name="calc-type"]:checked')?.value
  })`);
  const chooseMode = value => evaluate(`(() => {
    const radio = document.querySelector('input[name="calc-type"][value="${value}"]');
    radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);

  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate('/kalkulatorok/netto-brutto-kalkulator');
    await choose('hu');
    await evaluate(`(() => {
      document.getElementById('gross').value = '600 000';
      document.getElementById('net-input').value = '399 000';
      document.getElementById('salary-tax-rate').value = '9';
      document.getElementById('under25').checked = true;
      document.getElementById('first-married').checked = true;
      document.getElementById('family-dependants').value = '2';
      document.getElementById('family-eligible').value = '1';
    })()`);
    const before = await state();
    for (const [language, h1, gross, net, comparison] of [
      ['en', 'Gross to net salary calculator', 'Gross salary (HUF)', 'Net salary (HUF)', 'comparison only'],
      ['de', 'Brutto-Netto-Rechner', 'Bruttogehalt (HUF)', 'Nettogehalt (HUF)', 'nur zum Vergleich']
    ]) {
      await choose(language);
      assert.ok((await read('main h1')).includes(h1), `${language}: page title`);
      assert.ok((await read('label[for="gross"]')).includes(gross), `${language}: gross label`);
      assert.ok((await read('label[for="net-input"]')).includes(net), `${language}: net label`);
      assert.ok((await read('#salary-tax-rate option[value="9"]')).includes(comparison), `${language}: 9% explanation`);
      assert.deepEqual(JSON.parse(await state()), JSON.parse(before), `${language}: salary inputs changed`);
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), `salary calculator overflow at ${width}px (${language})`);
    }
    await chooseMode('net-to-gross');
    for (const [language, expected] of [['en', 'Gross salary:'], ['de', 'Bruttogehalt:']]) {
      await choose(language);
      assert.ok((await read('#result-title')).includes(expected), `${language}: net-to-gross result title`);
    }
    assert.deepEqual(JSON.parse(await state()), { ...JSON.parse(before), mode: 'net-to-gross' });
    await choose('hu');
    assert.match(await read('main'), /Az eredmény tájékoztató becslés/u);
  }
}

module.exports = { checkNettoBruttoLocales };
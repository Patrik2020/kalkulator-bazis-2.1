"use strict";
const assert = require("node:assert/strict");

async function checkVatPercentLocales({ navigate, evaluate, setViewport }) {
  const choose = async (lang) => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(lang)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame);
  })()`);
  const read = async (selector) => evaluate(`(() => {
    const text = node => node.nodeType === 3 ? node.textContent :
      [...node.childNodes].map(text).join('') + (/^(P|DIV|BR|LI)$/.test(node.nodeName) ? ' ' : '');
    return text(document.querySelector(${JSON.stringify(selector)})).replace(/\\s+/gu, ' ').trim();
  })()`);
  const edit = async (values) => evaluate(`(async () => {
    for (const [selector, value] of ${JSON.stringify(Object.entries(values))}) {
      const field = document.querySelector(selector);
      field.value = value;
      field.dispatchEvent(new Event(field.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    }
    await new Promise(requestAnimationFrame);
  })()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    for (const [slug, en, de] of [
      ['afa', 'Calculation formulas:', 'Berechnungsformeln:'],
      ['szazalek', 'Percentages can be misleading', 'Prozentangaben können irreführend sein']
    ]) {
      await navigate('/kalkulatorok/' + slug + '-kalkulator');
      await choose('hu');
      const original = await read('main');
      await choose('en');
      assert.ok((await read('main')).includes(en), slug + ': English explanations');
      await choose('de');
      assert.ok((await read('main')).includes(de), slug + ': German explanations');
      await choose('hu');
      assert.equal(await read('main'), original, slug + ': exact Hungarian restoration');
    }
    await navigate('/kalkulatorok/afa-kalkulator');
    await choose('en');
    const options = await evaluate("[...document.querySelectorAll('#housingVatScenario2027 option')].map(o => [o.value, o.textContent])");
    assert.deepEqual(options.map(o => o[0]), ['manual', 'housing-standard', 'housing-transition', 'housing-rust']);
    assert.equal(options[1][1], 'New residential property – 27% calculation');
    await edit({ '#amount': '10000', '#housingVatScenario2027': 'housing-transition' });
    assert.equal(await read('#result-value'), 'Net: 10 000 Ft VAT (5%): 500 Ft Gross: 10 500 Ft');
    assert.match(await read('#housingVatScenarioNote2027'), /statutory transitional conditions/);
    await choose('de');
    assert.equal(await read('#result-value'), 'Netto: 10 000 Ft MwSt. (5%): 500 Ft Brutto: 10 500 Ft');
    assert.match(await read('#housingVatScenarioNote2027'), /Übergangsbedingungen/);
    assert.equal(await evaluate("document.querySelector('#housingVatScenario2027').value"), 'housing-transition');
    await edit({ '#vat': '18' });
    assert.equal(await evaluate("document.querySelector('#housingVatScenario2027').value"), 'manual');
    assert.equal(await read('#result-value'), 'Netto: 10 000 Ft MwSt. (18%): 1800 Ft Brutto: 11 800 Ft');
    await edit({ '#amount': '11800' });
    await evaluate("document.querySelector('input[name=mode][value=brutto]').click()");
    assert.equal(await read('#result-value'), 'Brutto: 11 800 Ft MwSt. (18%): 1800 Ft Netto: 10 000 Ft');
    await edit({ '#amount': '' });
    assert.equal(await read('#result-value'), 'Bitte einen gültigen Betrag eingeben.');
    await choose('en');
    assert.equal(await read('#result-value'), 'Please enter a valid amount.');
    await navigate('/kalkulatorok/szazalek-kalkulator');
    assert.equal(await evaluate("document.querySelector('#kbInternalLanguage').value"), 'en');
    await edit({ '#a': '30000', '#b': '15', '#c': '50', '#d': '200', '#e': '120000', '#f': '129600' });
    assert.equal(await read('#result1'), '4500');
    assert.equal(await read('#result2'), '25 %');
    assert.equal(await read('#result3'), '8 %');
    await edit({ '#d': '0', '#e': '0' });
    assert.equal(await read('#result2'), 'Cannot divide by zero.');
    await choose('de');
    assert.equal(await read('#result3'), 'Der Ausgangswert darf nicht null sein.');
    assert.equal(await evaluate("document.querySelector('#a').value"), '30000');
    await choose('hu');
    assert.equal(await read('#result2'), 'Nullával nem lehet osztani.');
    assert.equal(await read('#result3'), 'A kezdőérték nem lehet nulla.');
  }
  console.log('Browser QA: VAT/percentage content, options, calculations and HU restoration passed at 390/1440px');
}
module.exports = { checkVatPercentLocales };

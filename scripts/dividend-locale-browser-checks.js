"use strict";
const assert = require("node:assert/strict");

async function checkDividendLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    if (!select) throw new Error('Missing internal language selector');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
  })()`);
  const read = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.replace(/\\s+/g,' ').trim() || ''`);
  const inputs = () => evaluate(`['incomeAmount','targetIncome','initialPortfolio','monthlyContribution','dividendYield','projectionYears'].map(id => document.getElementById(id)?.value)`);
  const mode = value => evaluate(`(() => { const input = document.querySelector('input[name="dividendMode"][value="${value}"]'); input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); })()`);

  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate('/kalkulatorok/osztalek-kalkulator');
    await choose('hu');
    const originalInputs = await inputs();
    for (const [value, english, german] of [
      ['income', 'Annual net dividends', 'Jährliche Nettodividende'],
      ['target', 'Required portfolio size', 'Erforderliche Portfoliogröße'],
      ['projection', 'Projected portfolio value', 'Voraussichtlicher Portfoliowert']
    ]) {
      await mode(value);
      for (const [language, expected] of [['en', english], ['de', german]]) {
        await choose(language);
        assert.ok((await read('#result-heading')).includes(expected), `${language}: ${value} heading`);
        assert.deepEqual(await inputs(), originalInputs, `${language}: ${value} values changed`);
        assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), `dividend calculator overflow at ${width}px (${language}/${value})`);
      }
      await choose('hu');
    }
    await mode('income');
    await choose('en');
    assert.match(await read('#result-interpretation'), /portfolio could generate/u);
    assert.match(await read('#chartLegend'), /Annual gross dividends/u);
    await mode('projection');
    await choose('en');
    assert.match(await read('#chartLegend'), /Portfolio value/u);
    await choose('de');
    assert.match(await read('#result-interpretation'), /Nach deinen Angaben/u);
    assert.match(await read('#result-interpretation'), /Nettodividende/u);
    assert.match(await read('#chartLegend'), /Portfoliowert/u);
  }
}

module.exports = { checkDividendLocale };

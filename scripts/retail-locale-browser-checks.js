"use strict";
const assert = require("node:assert/strict");

// Run through the real page scripts: dictionary tests alone cannot detect
// untranslated select options or language changes after calculation.
async function checkRetailLocales({ navigate, evaluate, setViewport }) {
  const choose = async (language) => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame);
  })()`);
  const result = async (selector) => evaluate(`(() => {
    const read = (node) => node.nodeType === 3 ? node.textContent :
      [...node.childNodes].map(read).join('') + (/^(P|DT|DD|LI|DIV|BR)$/.test(node.nodeName) ? ' ' : '');
    return read(document.querySelector(${JSON.stringify(selector)})).replace(/\\s+/g, ' ').trim();
  })()`);
  const edit = async (values, submit = false) => evaluate(`(async () => {
    for (const [selector, value] of ${JSON.stringify(Object.entries(values))}) {
      const field = document.querySelector(selector);
      field.value = value;
      field.dispatchEvent(new Event(field.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
    }
    ${submit ? "document.querySelector('#kalkulator form').requestSubmit();" : ""}
    await new Promise(requestAnimationFrame);
  })()`);

  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/");
    await evaluate("document.getElementById('langBtn').click(); document.querySelector('#langPop [data-lang=en]').click()");
    await navigate("/mindennapi");
    assert.equal(await evaluate("document.getElementById('kbInternalLanguage').value"), "en");
    await navigate("/kalkulatorok/ar-kedvezmeny-kalkulator");
    assert.equal(await evaluate("document.getElementById('kbInternalLanguage').value"), "en");
    await edit({ '[name=price]': '25000', '[name=discount1]': '20', '[name=discount2]': '10', '[name=coupon]': '1000', '[name=cap]': '0' }, true);
    assert.equal(await result("#kalkulator .everyday-result"), "Final price 17 000 Ft Total savings 8000 Ft Effective discount 32%");
    await choose("de");
    assert.equal(await result("#kalkulator .everyday-result"), "Endpreis 17 000 Ft Gesamtersparnis 8000 Ft Effektiver Rabatt 32%");
    await choose("hu");
    assert.equal(await result("#kalkulator .everyday-result"), "Végső ár 17 000 Ft Teljes megtakarítás 8000 Ft Tényleges kedvezmény 32%");
    await choose("de");
    await navigate("/kalkulatorok/ar-kedvezmeny-kalkulator");
    assert.equal(await evaluate("document.getElementById('kbInternalLanguage').value"), "de");

    await navigate("/kalkulatorok/atlag-kalkulator");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('#averageMode option')].map(e => [e.value, e.textContent])"), [
      ["simple", "Arithmetisches Mittel + Median"], ["weighted", "Gewichtetes Mittel"], ["geometric", "Geometrisches Mittel"]
    ]);
    await edit({ '#averageValues': '10; 20; 30' });
    assert.equal(await result("#averageHubResult"), "Arithmetisches Mittel: 20 Median: 20 Summe: 60 Anzahl: 3");
    await choose("en");
    await edit({ '#averageMode': 'weighted', '#weightedValuesHub': '10; 20', '#weightedWeightsHub': '1; 3' });
    assert.equal(await result("#averageHubResult"), "Weighted mean: 17,5 Sum of weights: 4 Count: 2");
    await edit({ '#weightedWeightsHub': '0; 0' });
    assert.equal(await result("#averageHubResult"), "The sum of weights must be greater than zero.");
    await choose("de");
    assert.equal(await result("#averageHubResult"), "Die Summe der Gewichte muss größer als null sein.");
    await edit({ '#averageMode': 'geometric', '#geometricValuesHub': '2; 8' });
    assert.equal(await result("#averageHubResult"), "Geometrisches Mittel: 4 Anzahl: 2");
    await choose("hu");
    assert.equal(await result("#averageHubResult"), "Mértani átlag: 4 Elemszám: 2");
    assert.equal(await evaluate("document.querySelector('#averageMode').value"), "geometric");

    await navigate("/kalkulatorok/egysegar-kalkulator");
    await choose("en");
    await edit({ '[name=name1]': 'Példa', '[name=price1]': '1000', '[name=qty1]': '500', '[name=unit1]': '1000', '[name=name2]': 'ÁFA kalkulátor', '[name=price2]': '600', '[name=qty2]': '500', '[name=unit2]': '1000', '[name=qty3]': '0', '[name=qty4]': '0', '[name=qty5]': '0' }, true);
    assert.equal(await result("#kalkulator .everyday-result"), "ÁFA kalkulátor: 1200 Ft / selected quantity – best price Példa: 2000 Ft / selected quantity");
    await choose("de");
    assert.equal(await result("#kalkulator .everyday-result"), "ÁFA kalkulátor: 1200 Ft / Vergleichsmenge – günstigster Preis Példa: 2000 Ft / Vergleichsmenge");
    await choose("hu");
    assert.equal(await result("#kalkulator .everyday-result"), "ÁFA kalkulátor: 1200 Ft / megadott egység – legjobb ár Példa: 2000 Ft / megadott egység");
    assert.equal(await evaluate("document.querySelector('[name=name1]').value"), "Példa");
    await choose("en");
    await edit({ '[name=qty1]': '0', '[name=qty2]': '0' }, true);
    assert.equal(await result("#kalkulator .everyday-result"), "Enter at least one product with a valid price and quantity.");
    assert.equal(await evaluate("document.querySelector('.kb-inner-language-notice').hidden"), false);
    assert.equal(await evaluate("document.documentElement.lang"), "hu");
    await navigate("/");
    assert.equal(await evaluate("document.getElementById('langLabel').textContent"), "EN");
    await evaluate("document.querySelector('#langPop [data-lang=hu]').click()");
  }
  console.log("Browser QA: HU/EN/DE retail navigation, options, calculations, errors and user values passed at 390/1440px");
}

module.exports = { checkRetailLocales };

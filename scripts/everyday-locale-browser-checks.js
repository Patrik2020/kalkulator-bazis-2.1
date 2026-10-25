"use strict";
const assert = require("node:assert/strict");

// Run through the real page scripts: dictionary tests alone cannot detect
// untranslated select options or language changes after calculation.
async function checkEverydayLocales({ navigate, evaluate, setViewport }) {
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
    for (const [slug, fields, selector, submit, number, label] of [
      ["arany", { "#part": "25", "#whole": "100" }, "#simpleCalcResults", false, "25", "Arány"],
      ["szazalekos-valtozas", { "#changeOld": "100", "#changeNew": "120" }, "#changeResult", false, "20", "Abszolút különbség"],
      ["borravalo", { "[name=bill]": "24000", "[name=service]": "0", "[name=tip]": "10", "[name=a]": "8000", "[name=b]": "8000", "[name=c]": "8000" }, "#kalkulator .everyday-result", true, "26 400", "Teljes fizetendő"]
    ]) {
      await navigate(`/kalkulatorok/${slug}-kalkulator`);
      await choose("hu");
      await edit(fields, submit);
      const original = await result(selector);
      assert.ok(original.includes(number), original);
      const inputs = await evaluate("[...document.querySelectorAll('main input')].map(e => e.value)");
      for (const language of ["en", "de"]) {
        await choose(language);
        const translated = await result(selector);
        assert.ok(translated.includes(number), translated);
        assert.ok(!translated.includes(label), translated);
        assert.notEqual(translated, original);
        assert.deepEqual(await evaluate("[...document.querySelectorAll('main input')].map(e => e.value)"), inputs);
        assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `${slug}: overflow at ${width}`);
      }
      await choose("hu");
      assert.equal(await result(selector), original);
      const invalid = slug === "arany" ? { "#whole": "0" } : slug === "szazalekos-valtozas" ? { "#changeOld": "0" } : { "[name=a]": "0", "[name=b]": "0", "[name=c]": "0" };
      await edit(invalid, submit);
      const error = await result(selector);
      for (const language of ["en", "de"]) {
        await choose(language);
        assert.notEqual(await result(selector), error);
      }
      await choose("hu");
      assert.equal(await result(selector), error);
    }
    for (const [slug, fields, selector, invalid, expected] of [
      ["arres", { "#marginCost": "8000", "#marginSell": "10000" }, "#marginResult", { "#marginSell": "0" }, ["Árrés összege: 2000 Ft Árrés: 20% Haszonkulcs: 25%", "Margin amount: 2000 Ft Margin: 20% Markup: 25%", "Handelsspanne: 2000 Ft Handelsspanne: 20% Aufschlag: 25%"]],
      ["haszonkulcs", { "#markupCost": "8000", "#markupRate": "25" }, "#markupResult", { "#markupRate": "-100" }, ["Eladási ár: 10 000 Ft Árrés összege: 2000 Ft Árrés: 20%", "Selling price: 10 000 Ft Margin amount: 2000 Ft Margin: 20%", "Verkaufspreis: 10 000 Ft Handelsspanne: 2000 Ft Handelsspanne: 20%"]],
      ["fedezeti-pont", { "#beFixed": "1000000", "#bePrice": "10000", "#beVariable": "6000" }, "#beResult", { "#bePrice": "5000" }, ["Egységnyi fedezet: 4000 Ft Fedezeti hányad: 40% Fedezeti mennyiség: 250 db Fedezeti árbevétel: 2 500 000 Ft", "Contribution per unit: 4000 Ft Contribution margin ratio: 40% Break-even quantity: 250 units Break-even revenue: 2 500 000 Ft", "Deckungsbeitrag je Einheit: 4000 Ft Deckungsbeitragsquote: 40% Break-even-Menge: 250 Stück Break-even-Umsatz: 2 500 000 Ft"]]
    ]) {
      await navigate(`/kalkulatorok/${slug}-kalkulator`);
      await choose("hu");
      await edit(fields);
      const original = await result(selector);
      assert.equal(original, expected[0]);
      const inputs = await evaluate("[...document.querySelectorAll('main input')].map(e => e.value)");
      for (const [language, index] of [["en", 1], ["de", 2]]) {
        await choose(language);
        assert.equal(await result(selector), expected[index]);
        assert.deepEqual(await evaluate("[...document.querySelectorAll('main input')].map(e => e.value)"), inputs);
        assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `${slug}: overflow at ${width}`);
      }
      await choose("hu");
      assert.equal(await result(selector), original);
      await edit(invalid);
      const error = await result(selector);
      assert.notEqual(error, original, `${slug}: invalid input did not produce an error`);
      for (const language of ["en", "de"]) {
        await choose(language);
        assert.notEqual(await result(selector), error, `${slug}: untranslated ${language} error`);
      }
      await choose("hu");
      assert.equal(await result(selector), error);
    }
    await navigate("/kalkulatorok/datum-hozzaadas-kivonas-kalkulator");
    await choose("hu");
    assert.match(await result("#dateResult"), /20\. szeptember 2026|20\. szeptember 2026/u);
    const dateInput = await evaluate("document.querySelector('#dateBase').value");
    for (const [language, date, weekday] of [["en", "20 September 2026", "Sunday"], ["de", "20. September 2026", "Sonntag"]]) {
      await choose(language);
      const translated = await result("#dateResult");
      assert.ok(translated.includes(date), translated);
      assert.ok(translated.includes(weekday), translated);
      assert.equal(await evaluate("document.querySelector('#dateBase').value"), dateInput);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `date add: overflow at ${width}`);
    }
    await choose("hu");

    await navigate("/kalkulatorok/eletkor-kalkulator");
    await choose("hu");
    await edit({ "[name=birth]": "2000-01-01", "[name=asOf]": "2020-01-01" }, true);
    const ageHu = await result("#kalkulator .everyday-result");
    assert.match(ageHu, /20 év 0 hónap 0 nap/);
    for (const [language, duration, label] of [["en", "20 years 0 months 0 days", "Exact age"], ["de", "20 Jahre 0 Monate 0 Tage", "Genaues Alter"]]) {
      await choose(language);
      const translated = await result("#kalkulator .everyday-result");
      assert.ok(translated.includes(duration), translated);
      assert.ok(translated.includes(label), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `age: overflow at ${width}`);
    }

    await navigate("/kalkulatorok/datum-kulonbseg-kalkulator");
    await choose("hu");
    await edit({ "[name=start]": "2026-10-01", "[name=end]": "2026-10-08", "[name=offset]": "5" }, true);
    const dateDiffHu = await result("#kalkulator .everyday-result");
    assert.match(dateDiffHu, /7 nap/);
    for (const [language, expectedLabel, expectedDate] of [["en", "Difference", "06/10/2026"], ["de", "Differenz", "06.10.2026"]]) {
      await choose(language);
      const translated = await result("#kalkulator .everyday-result");
      assert.ok(translated.includes(expectedLabel), translated);
      assert.ok(translated.includes(expectedDate), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `date difference: overflow at ${width}`);
    }
  }
  console.log("Everyday locales: ratio, percentage change, tip, margin, markup, break-even, date addition, age and date difference passed at both widths.");
}
module.exports = { checkEverydayLocales };

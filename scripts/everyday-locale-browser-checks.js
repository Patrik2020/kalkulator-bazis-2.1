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
  }
  console.log("Everyday locales: ratio, percentage change and tip calculations, errors and language restoration passed at both widths.");
}
module.exports = { checkEverydayLocales };

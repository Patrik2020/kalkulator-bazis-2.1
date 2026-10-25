"use strict";
const assert = require("node:assert/strict");

async function checkMortgageToolLocales({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
  })()`);
  const read = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.replace(/\\s+/g,' ').trim() || ''`);
  const inputs = ids => evaluate(`${JSON.stringify(ids)}.map(id => document.getElementById(id)?.value)`);

  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/lakas-hitel-onero-kalkulator");
    await choose("hu");
    await evaluate(`(() => {
      for (const [id, value] of [['price','50000000'],['percent','20']]) {
        const input = document.getElementById(id); input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()`);
    const downPaymentInputs = await inputs(["price", "percent"]);
    assert.match(await read("#result-down"), /10[\s\u00a0]?000[\s\u00a0]?000 Ft/u);
    for (const [language, title, result, loan] of [
      ["en", "Mortgage down payment calculator", "Required down payment:", "Amount to finance:"],
      ["de", "Rechner für das Eigenkapital", "Erforderliches Eigenkapital:", "Zu finanzierender Betrag:"]
    ]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      assert.ok((await read(".result-box")).includes(result));
      assert.ok((await read("#result-loan")).includes(loan));
      assert.deepEqual(await inputs(["price", "percent"]), downPaymentInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `down-payment overflow at ${width}px (${language})`);
    }

    await navigate("/kalkulatorok/hitel-elotorlesztes-kalkulator");
    await choose("hu");
    const prepayIds = ["prepayPrincipal", "prepayRate", "prepayMonths", "prepayAmount", "prepayFee"];
    await evaluate(`(() => {
      for (const [id, value] of [['prepayPrincipal','10000000'],['prepayRate','6.5'],['prepayMonths','120'],['prepayAmount','2000000'],['prepayFee','1']]) {
        const input = document.getElementById(id); input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()`);
    const prepayInputs = await inputs(prepayIds);
    for (const [language, title, labels] of [
      ["en", "Early loan repayment calculator", ["Current monthly payment", "New monthly payment", "Estimated net savings"]],
      ["de", "Rechner für Sondertilgung", ["Aktuelle Monatsrate", "Neue Monatsrate", "Geschätzte Nettoersparnis"]]
    ]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      const result = await read("#prepayResult");
      for (const label of labels) assert.ok(result.includes(label), `${language}: missing ${label}`);
      assert.deepEqual(await inputs(prepayIds), prepayInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `early repayment overflow at ${width}px (${language})`);
    }
  }
}

module.exports = { checkMortgageToolLocales };

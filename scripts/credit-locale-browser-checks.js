"use strict";
const assert = require("node:assert/strict");

async function checkCreditLocales({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
  })()`);
  const read = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.replace(/\\s+/g,' ').trim() || ''`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/hitel-torleszto-kalkulator");
    await choose("hu");
    await evaluate(`(() => { for(const [id,value] of [['amount','20000000'],['rate','8'],['years','20']]) { const e=document.getElementById(id); e.value=value; e.dispatchEvent(new Event('input',{bubbles:true})); } })()`);
    const loanValues = await evaluate("['amount','rate','years','thm'].map(id=>document.getElementById(id)?.value)");
    assert.ok((await read("#result-monthly")).includes("Ft"));
    for (const [language, title, heading] of [["en", "Loan repayment calculator", "Loan amount"], ["de", "Kreditratenrechner", "Kreditbetrag"]]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      assert.ok((await read("main label[for='amount']")).includes(heading));
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `Loan page overflow at ${width}px (${language})`);
      assert.deepEqual(await evaluate("['amount','rate','years','thm'].map(id=>document.getElementById(id)?.value)"), loanValues);
    }
    await evaluate(`(() => { const rate=document.getElementById('rate'); rate.value='101'; rate.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    for (const [language, message] of [["en", "Enter an annual rate between 0% and 100%."], ["de", "Gib einen Jahreswert zwischen 0 % und 100 % ein."]]) {
      await choose(language);
      assert.equal(await read("#result-monthly"), message);
    }

    await navigate("/kalkulatorok/hitelkepesseg-kalkulator");
    await choose("hu");
    await evaluate(`(() => { for(const [id,value] of [['income','600000'],['existing','50000'],['rate','7'],['years','20']]) { const e=document.getElementById(id); e.value=value; e.dispatchEvent(new Event('input',{bubbles:true})); } })()`);
    const capacityValues = await evaluate("['income','existing','rate','years'].map(id=>document.getElementById(id)?.value)");
    assert.ok((await read("#result-loan")).includes("Ft"));
    for (const [language, title, panel] of [["en", "Borrowing capacity calculator", "Debt service capacity and interest-rate stress test"], ["de", "Kreditrechner für die Tragbarkeit", "Tragbarkeit der Kreditrate und Zinsstresstest"]]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      assert.ok((await read(".priority-upgrade h2")).includes(panel));
      assert.deepEqual(await evaluate("['income','existing','rate','years'].map(id=>document.getElementById(id)?.value)"), capacityValues);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `Borrowing page overflow at ${width}px (${language})`);
    }
  }
}

module.exports = { checkCreditLocales };

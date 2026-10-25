"use strict";
const assert = require("node:assert/strict");

async function checkInvestmentInflationLocales({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
  })()`);
  const read = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.replace(/\\s+/g,' ').trim() || ''`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/etf-kalkulator");
    await choose("hu");
    await evaluate(`(() => { for(const [id,value] of [['target','30000000'],['initial','200000'],['monthly','50000'],['rate','6'],['years','20'],['ter','0.2'],['inflation','3'],['increase','0']]) { const e=document.getElementById(id); if(e){e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));} } })()`);
    const etfInputs = await evaluate("['target','initial','monthly','rate','years','ter','inflation','increase'].map(id=>document.getElementById(id)?.value)");
    assert.ok((await read("#result-final")).includes("Ft"));
    for (const [language, title, result, label, panel] of [["en", "ETF calculator", "Estimated final balance", "Three possible return paths", "TER is only one part of the decision"], ["de", "ETF-Rechner", "Voraussichtlicher Endbetrag", "Drei mögliche Renditeverläufe", "Die TER ist nur ein Teil der Entscheidung"]]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      assert.ok((await read("#result-heading")).includes(result));
      assert.ok((await read("#etfScenarioTitle")).includes(label));
      assert.ok((await read(".finance-quality h2")).includes(panel));
      assert.deepEqual(await evaluate("['target','initial','monthly','rate','years','ter','inflation','increase'].map(id=>document.getElementById(id)?.value)"), etfInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `ETF overflow at ${width}px (${language})`);
    }
    await evaluate(`(() => { const rate=document.getElementById('rate'); rate.value='200'; rate.dispatchEvent(new Event('input',{bubbles:true})); document.getElementById('etfForm').requestSubmit(); })()`);
    for (const [language, message] of [["en", "Annual return must be between -80% and 100%."], ["de", "Die Jahresrendite muss zwischen -80 % und 100 % liegen."]]) {
      await choose(language);
      assert.equal(await read("#rate-error"), message);
    }
    await evaluate(`(() => { const rate=document.getElementById('rate'); rate.value='6'; rate.dispatchEvent(new Event('input',{bubbles:true})); document.getElementById('etfForm').requestSubmit(); })()`);

    await navigate("/kalkulatorok/inflacio-kalkulator");
    await choose("hu");
    await evaluate(`(() => { for(const [id,value] of [['amount','1000000'],['rate','5'],['years','10']]) { const e=document.getElementById(id); e.value=value; e.dispatchEvent(new Event('input',{bubbles:true})); } })()`);
    const inflationInputs = await evaluate("['amount','rate','years'].map(id=>document.getElementById(id).value)");
    assert.match(await read("#result-loss"), /Vásárlóerő/u);
    for (const [language, title, output, tab] of [["en", "Inflation calculator", "Decrease in purchasing power", "Future estimate"], ["de", "Inflationsrechner", "Kaufkraftverlust", "Zukunftsschätzung"]]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      assert.ok((await read("#result-loss")).includes(output));
      assert.ok((await read(".priority-upgrade button[data-mode='future']")).includes(tab));
      assert.deepEqual(await evaluate("['amount','rate','years'].map(id=>document.getElementById(id).value)"), inflationInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `inflation overflow at ${width}px (${language})`);
    }
  }
}

module.exports = { checkInvestmentInflationLocales };

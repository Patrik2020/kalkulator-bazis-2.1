"use strict";
const assert = require("node:assert/strict");

async function checkWealthGrowthLocales({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
  })()`);
  const read = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.innerText.replace(/\\s+/g,' ').trim() || ''`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/kamatos-kamat-kalkulator");
    await choose("hu");
    await evaluate(`(() => { for(const [id,value] of [['initial','1000000'],['monthly','50000'],['rate','6'],['years','10']]) { const e=document.getElementById(id); e.value=value; e.dispatchEvent(new Event('input',{bubbles:true})); } })()`);
    const compoundInputs = await evaluate("['initial','monthly','rate','years'].map(id=>document.getElementById(id).value)");
    assert.match(await read("#result-profit"), /Hozam/u);
    for (const [language, title, output, panel] of [["en", "Compound interest calculator", "Return", "Compound interest with fees, taxes and inflation"], ["de", "Zinseszins-Rechner", "Rendite", "Zinseszins mit Kosten, Steuern und Inflation"]]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      assert.ok((await read("#result-profit")).includes(output));
      assert.ok((await read("main h2")).length > 0);
      assert.ok((await read(".priority-upgrade h2")).includes(panel));
      assert.deepEqual(await evaluate("['initial','monthly','rate','years'].map(id=>document.getElementById(id).value)"), compoundInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `compound interest overflow at ${width}px (${language})`);
    }

    await navigate("/kalkulatorok/milliomos-kalkulator");
    await choose("hu");
    await evaluate(`(() => { for(const [id,value] of [['initial','2000000'],['monthly','100000'],['rate','6'],['goal','20000000']]) { const e=document.getElementById(id); e.value=value; e.dispatchEvent(new Event('input',{bubbles:true})); } })()`);
    const millionaireInputs = await evaluate("['initial','monthly','rate','goal'].map(id=>document.getElementById(id).value)");
    assert.match(await read("#result-time"), /év/u);
    for (const [language, title, datePrefix, panel] of [["en", "When will I become a millionaire?", "Estimated target date", "Target planner with three return scenarios"], ["de", "Wann werde ich Millionär?", "Voraussichtliches Zieldatum", "Zielplanung mit drei Renditeszenarien"]]) {
      await choose(language);
      assert.ok((await read("main h1")).includes(title));
      assert.ok((await read("#result-date")).includes(datePrefix));
      assert.ok((await read(".priority-upgrade h2")).includes(panel));
      assert.deepEqual(await evaluate("['initial','monthly','rate','goal'].map(id=>document.getElementById(id).value)"), millionaireInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `millionaire overflow at ${width}px (${language})`);
    }
  }
}

module.exports = { checkWealthGrowthLocales };

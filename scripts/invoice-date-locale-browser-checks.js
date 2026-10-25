"use strict";
const assert = require("node:assert/strict");

async function checkInvoiceDateLocales({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
  })()`);
  const read = selector => evaluate(`document.querySelector(${JSON.stringify(selector)})?.innerText.replace(/\\s+/g,' ').trim() || ''`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/fizetesi-hatarido-kalkulator");
    await choose("hu");
    await evaluate(`(() => {
      const date=document.querySelector('#startDate'), days=document.querySelector('#days');
      date.value='2026-01-09'; days.value='1';
      document.querySelector('input[name="mode"][value="workdays"]').checked=true;
      date.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('input[name="mode"][value="workdays"]').dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    assert.equal(await read("#result-date"), "2026. 01. 10.");
    const deadlineInputs = await evaluate("[document.querySelector('#startDate').value,document.querySelector('#days').value,document.querySelector('input[name=mode]:checked').value]");
    for (const [language, date, title] of [["en", "10 January 2026", "Payment deadline calculator"], ["de", "10. Januar 2026", "Zahlungsfrist-Rechner"]]) {
      await choose(language);
      assert.equal(await read("#result-date"), date);
      assert.ok((await read("main h1")).includes(title));
      assert.deepEqual(await evaluate("[document.querySelector('#startDate').value,document.querySelector('#days').value,document.querySelector('input[name=mode]:checked').value]"), deadlineInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `payment deadline overflow at ${width}px (${language})`);
    }

    await navigate("/kalkulatorok/szamla-teljesites-kalkulator");
    await choose("hu");
    await evaluate(`(() => {
      for(const [id,value] of [['issueDate','2026-06-02'],['performanceDate','2026-06-01'],['days','30'],['periodEnd','2026-06-30'],['periodicIssueDate','2026-06-20'],['periodicDueDate','2026-08-10']]){
        const input=document.getElementById(id); input.value=value; input.dispatchEvent(new Event('input',{bubbles:true}));
      }
    })()`);
    assert.match(await read("#result-deadline"), /2026\. 07\. 01\./u);
    assert.match(await read("#result-info"), /dátuma eltér/u);
    assert.match(await read("#result-periodic-rule"), /60 napon belülre/u);
    const invoiceInputs = await evaluate("[...document.querySelectorAll('main input[type=date],main input[type=number]')].map(e=>e.value)");
    for (const [language, panelTitle, ruleText] of [["en", "Continuous-supply calculator", "within 60 days"], ["de", "Rechner für Dauerleistungen", "innerhalb von 60 Tagen"]]) {
      await choose(language);
      assert.ok((await read("#result-info")).includes(language === "en" ? "tax point and invoice issue date" : "Leistungsdatum und Rechnungsdatum"));
      assert.ok((await read("#result-periodic-rule")).includes(ruleText));
      assert.ok((await read("#periodic-settlement-calculator h2")).includes(panelTitle));
      assert.deepEqual(await evaluate("[...document.querySelectorAll('main input[type=date],main input[type=number]')].map(e=>e.value)"), invoiceInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `invoice tax point overflow at ${width}px (${language})`);
    }
    await choose("hu");
    assert.match(await read("#result-info"), /dátuma eltér/u);
  }
  console.log("Invoice date locales: EN/DE guidance, working-day result and VAT tax-point output passed at 390px and 1440px.");
}

module.exports = { checkInvoiceDateLocales };

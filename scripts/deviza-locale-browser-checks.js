"use strict";
const assert = require("node:assert/strict");

async function checkCurrencyLocale({ navigate, evaluate, setViewport }) {
  const choose = (language) => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const rates = {
    EUR: 1, HUF: 400, USD: 1.15, GBP: 0.87, CHF: 0.94, PLN: 4.25, CZK: 24.4,
    RON: 5.05, SEK: 11.1, NOK: 11.7, DKK: 7.46, JPY: 170, CAD: 1.61, AUD: 1.78, CNY: 8.3
  };
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/deviza-atvalto-kalkulator.html");
    await evaluate(`localStorage.setItem('kb-currency-rates-v2', ${JSON.stringify(JSON.stringify({ version: 1, rates, date: "2026-09-30", source: "Európai Központi Bank", savedAt: Date.now() }))})`);
    await navigate("/kalkulatorok/deviza-atvalto-kalkulator.html");
    await evaluate(`(async()=>{await window.KB_CURRENCY_CONVERTER.ready;const i=document.getElementById('inputValue');i.value='800';const from=document.getElementById('fromCurrency');from.value='EUR';from.dispatchEvent(new Event('change',{bubbles:true}));i.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    for (const [language, heading, amount, faqPart] of [
      ["en", "Currency Converter", "800 EUR = 800 EUR", "real-time exchange rate"],
      ["de", "Währungsrechner", "800 EUR = 800 EUR", "Echtzeitkurs"]
    ]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),placeholder:document.getElementById('inputValue')?.placeholder,option:document.querySelector('#fromCurrency option[value="HUF"]')?.textContent.trim(),result:document.getElementById('result')?.textContent.trim(),updated:document.getElementById('lastUpdate')?.textContent.trim(),source:document.getElementById('rateSource')?.textContent.trim(),guide:document.querySelector('.article')?.innerText,faq:document.querySelector('.faq-list')?.innerText,fee:document.querySelector('.auto-converter-quality')?.innerText,meta:document.querySelector('meta[name="description"]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),value:document.getElementById('inputValue')?.value,width:document.documentElement.scrollWidth})`));
      assert.equal(state.heading, heading, `${language}: heading`);
      assert.ok(state.title.includes(heading), `${language}: title`);
      assert.equal(state.placeholder, language === "en" ? "Enter an amount" : "Betrag eingeben");
      assert.ok(state.option.includes(language === "en" ? "Hungarian" : "Ungarischer"), `${language}: currency option`);
      assert.equal(state.result, amount, `${language}: conversion unchanged`);
      assert.ok(/\d{4}/u.test(state.updated), `${language}: rate date`);
      assert.ok(state.source.includes(language === "en" ? "European Central Bank" : "Europäische Zentralbank") ||
        state.source.includes(language === "en" ? "Kalkulátor Bázis API" : "Kalkulátor-Bázis-API"), `${language}: source`);
      assert.ok(state.guide.includes(language === "en" ? "How to read the result" : "So liest du das Ergebnis"), `${language}: guide`);
      assert.ok(state.faq.includes(faqPart), `${language}: FAQ`);
      assert.ok(state.fee.includes(language === "en" ? "Mid-market rate" : "Mittelkurs"), `${language}: fee tool`);
      assert.ok(state.meta.includes(language === "en" ? "current reference rates" : "aktuellen Referenzkursen"), `${language}: metadata`);
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(state.value, "800");
      assert.ok(state.width <= width + 1, `${language}: overflow at ${width}px`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Deviza átváltó kalkulátor");
    assert.equal(await evaluate(`document.getElementById('inputValue').value`), "800");
  }
  console.log("Currency locale: EN/DE content, result, metadata, fee tool and HU restoration passed.");
}

module.exports = { checkCurrencyLocale };

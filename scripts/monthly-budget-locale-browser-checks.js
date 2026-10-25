"use strict";
const assert = require("node:assert/strict");

async function checkMonthlyBudgetLocale({ navigate, evaluate, setViewport }) {
  const choose = (language) => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  })()`);
  const read = (selector) => evaluate(`(() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    return node ? node.innerText.replace(/\\s+/g, ' ').trim() : '';
  })()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/havi-koltsegvetes-kalkulator");
    await choose("hu");
    const values = { "#income": "850000", "#housing": "220000", "#utilities": "65000", "#food": "120000", "#transport": "35000", "#debt": "60000", "#other": "70000", "#savings": "50000" };
    await evaluate(`(async () => {
      for (const [selector, value] of ${JSON.stringify(Object.entries(values))}) {
        const input = document.querySelector(selector); input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await new Promise(requestAnimationFrame);
    })()`);
    const huResult = await read("#expenseResult");
    assert.match(huResult, /Összes kiadás megtakarítással együtt:.*620/u, huResult);
    await evaluate(`(async () => {
      for (const [selector, value] of [[".budget-reserve-lab [data-q=annual-irregular]", "600000"], [".budget-reserve-lab [data-q=reserve-months]", "3"]]) {
        const input = document.querySelector(selector); input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      document.querySelector('#bu-income').value = '900000';
      document.querySelector('#bu-income').dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(requestAnimationFrame);
    })()`);
    assert.match(await read(".budget-reserve-lab"), /50\s*000 Ft/u);
    assert.match(await read(".priority-results"), /320\s*000/u);
    const inputs = await evaluate("[...document.querySelectorAll('main input')].map(input => input.value)");
    for (const [language, total, label] of [["en", "Total expenses including savings", "Monthly remainder"], ["de", "Gesamtausgaben einschließlich Ersparnis", "Monatlicher Überschuss"]]) {
      await choose(language);
      assert.match(await read("#expenseResult"), new RegExp(total, "u"));
      assert.match(await read("#balanceResult"), /HUF/u);
      const cards = await read(".priority-results");
      assert.ok(cards.includes(label), cards);
      const reservePanel = await read(".budget-reserve-lab");
      assert.ok(reservePanel.includes(language === "en" ? "occasional expenses" : "seltene Ausgaben"));
      assert.match(reservePanel, /50\s*000 HUF/u, reservePanel);
      const nextStep = await read(".kb-next-step");
      assert.ok(nextStep.includes(language === "en" ? "Put your monthly remainder to work" : "Nutze deinen monatlichen Überschuss bewusst"), nextStep);
      const wise = await read("[data-render='calculator-wise-banner']");
      assert.ok(wise.includes(language === "en" ? "Check Wise's current fees" : "Prüfe die aktuellen Gebühren"), wise);
      const placeholders = await evaluate("[...document.querySelectorAll('main input[placeholder]')].map(input => input.placeholder)");
      assert.ok(placeholders.some(value => value.includes(language === "en" ? "e.g." : "z. B.")), placeholders.join(" | "));
      assert.deepEqual(await evaluate("[...document.querySelectorAll('main input')].map(input => input.value)"), inputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `monthly budget overflow at ${width}px (${language})`);
      const csv = await evaluate(`(async () => {
        const create = URL.createObjectURL, revoke = URL.revokeObjectURL, click = HTMLAnchorElement.prototype.click;
        let content, filename;
        URL.createObjectURL = blob => { content = blob.text(); return 'blob:budget-locale-test'; };
        URL.revokeObjectURL = () => {};
        HTMLAnchorElement.prototype.click = function () { filename = this.download; };
        document.querySelector('.priority-actions [data-download]').click();
        URL.createObjectURL = create; URL.revokeObjectURL = revoke; HTMLAnchorElement.prototype.click = click;
        return { filename, content: await content };
      })()`);
      assert.equal(csv.filename, language === "en" ? "monthly-budget-summary.csv" : "monatsbudget-zusammenfassung.csv");
      assert.ok(csv.content.includes(language === "en" ? "Category;Monthly amount" : "Kategorie;Monatsbetrag"), csv.content);
      assert.ok(csv.content.includes(language === "en" ? "Housing" : "Wohnen"), csv.content);
    }
  }
  console.log("Monthly budget locales: calculator, occasional-expense and reserve panels, and CSV export passed at 390px and 1440px.");
}

module.exports = { checkMonthlyBudgetLocale };

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
    assert.match(await result("#dateResult"), /2026\. szeptember 20\./u);
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

    await navigate("/kalkulatorok/munkaido-kalkulator");
    await choose("hu");
    await edit({ "#kalkulator [name=start]": "22:00", "#kalkulator [name=end]": "06:00", "#kalkulator [name=break]": "30", "#kalkulator [name=days]": "5", "#kalkulator [name=weeks]": "4.348" }, true);
    const hoursHu = await result("#kalkulator .everyday-result");
    assert.ok(hoursHu.includes("7 óra 30 perc"), hoursHu);
    for (const [language, duration, overnight] of [["en", "7 hours 30 minutes", "yes"], ["de", "7 Stunden 30 Minuten", "ja"]]) {
      await choose(language);
      const translated = await result("#kalkulator .everyday-result");
      assert.ok(translated.includes(duration), translated);
      assert.ok(translated.includes(overnight), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `working hours: overflow at ${width}`);
    }

    await navigate("/kalkulatorok/munkanap-kalkulator");
    await choose("hu");
    await edit({ "#workStart": "2026-10-05", "#workEnd": "2026-10-09", "#workExcluded": "2026-10-07" });
    const workdaysHu = await result("#workResult");
    assert.ok(workdaysHu.includes("4"), workdaysHu);
    for (const [language, label] of [["en", "Calculated working days:"], ["de", "Berechnete Arbeitstage:"]]) {
      await choose(language);
      const translated = await result("#workResult");
      assert.ok(translated.includes(label), translated);
      assert.ok(translated.includes("4"), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `working days: overflow at ${width}`);
    }

    await navigate("/kalkulatorok/tulora-kalkulator");
    await choose("hu");
    await edit({ "#otRate": "3000", "#otHours": "8", "#otMultiplier": "1.5" });
    const overtimeHu = await result("#otResult");
    assert.ok(overtimeHu.includes("36 000 Ft"), overtimeHu);
    for (const [language, rate] of [["en", "Overtime hourly rate:"], ["de", "Stundenlohn für Überstunden:"]]) {
      await choose(language);
      const translated = await result("#otResult");
      assert.ok(translated.includes(rate), translated);
      assert.ok(translated.includes(language === "en" ? "4500 Ft/hour" : "4500 Ft/Stunde"), translated);
      assert.ok(translated.includes("36 000 Ft"), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `overtime: overflow at ${width}`);
    }

    await navigate("/kalkulatorok/oraber-kalkulator");
    await choose("hu");
    await edit({ "[name=basis]": "gross", "[name=salary]": "600000", "[name=monthlyHours]": "174", "[name=overtimeHours]": "8", "[name=overtimeRate]": "1.5", "[name=premiumHours]": "3", "[name=premiumPercent]": "20", "[name=paidLeaveHours]": "4" }, true);
    const hourlyHu = await result("#kalkulator .everyday-result");
    assert.ok(hourlyHu.includes("Bruttó alapórabér"), hourlyHu);
    const hourlyInputs = await evaluate("[...document.querySelectorAll('#kalkulator input, #kalkulator select')].map(e => e.value)");
    for (const [language, regular, overtime] of [["en", "Gross regular hourly wage", "Overtime pay"], ["de", "Brutto-Grundstundenlohn", "Überstundenvergütung"]]) {
      await choose(language);
      const translated = await result("#kalkulator .everyday-result");
      assert.ok(translated.includes(regular), translated);
      assert.ok(translated.includes(overtime), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `hourly wage: overflow at ${width}`);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#kalkulator input, #kalkulator select')].map(e => e.value)"), hourlyInputs);
    }

    await navigate("/kalkulatorok/rezsi-megosztas-kalkulator");
    await choose("hu");
    await edit({ "[name=total]": "120000", "[name=mode]": "equal", "[name=a]": "1", "[name=b]": "1", "[name=c]": "1" }, true);
    const utilityHu = await result("#kalkulator .everyday-result");
    assert.ok(utilityHu.includes("40 000 Ft"), utilityHu);
    const utilityInputs = await evaluate("[...document.querySelectorAll('#kalkulator input, #kalkulator select')].map(e => e.value)");
    for (const [language, share] of [["en", "Person 1 share"], ["de", "Anteil Person 1"]]) {
      await choose(language);
      const translated = await result("#kalkulator .everyday-result");
      assert.ok(translated.includes(share), translated);
      assert.ok(translated.includes("40 000 Ft"), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `shared costs: overflow at ${width}`);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#kalkulator input, #kalkulator select')].map(e => e.value)"), utilityInputs);
    }

    await navigate("/kalkulatorok/recept-adag-kalkulator");
    await choose("hu");
    await edit({ "#recipeOriginal": "4", "#recipeTarget": "6", "#recipeIngredients": "Pálinka;500;ml\\nCukor;250;g" });
    const recipeHu = await result("#recipeResult");
    assert.ok(recipeHu.includes("Pálinka"), recipeHu);
    assert.ok(recipeHu.includes("750 ml"), recipeHu);
    const recipeInputs = await evaluate("[...document.querySelectorAll('#kalkulator input, #kalkulator textarea')].map(e => e.value)");
    for (const [language, factor] of [["en", "Scaling factor:"], ["de", "Umrechnungsfaktor:"]]) {
      await choose(language);
      const translated = await result("#recipeResult");
      assert.ok(translated.includes(factor), translated);
      assert.ok(translated.includes("Pálinka"), translated);
      assert.ok(translated.includes("750 ml"), translated);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `recipe: overflow at ${width}`);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#kalkulator input, #kalkulator textarea')].map(e => e.value)"), recipeInputs);
    }

    await navigate("/kalkulatorok/villanyfogyasztas-koltseg-kalkulator");
    await choose("hu");
    await edit({ "#electricPower": "1500", "#electricHours": "2", "#electricDays": "30", "#electricPrice": "70" });
    const electricityHu = await result("#electricResult");
    assert.ok(electricityHu.includes("90 kWh"), electricityHu);
    assert.ok(electricityHu.includes("6300 Ft"), electricityHu);
    const electricityInputs = await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)");
    for (const [language, label] of [["en", "Estimated cost for period:"], ["de", "Geschätzte Kosten im Zeitraum:"]]) {
      await choose(language);
      const translated = await result("#electricResult");
      assert.ok(translated.includes(label), translated);
      assert.ok(translated.includes("90 kWh"), translated);
      assert.ok(translated.includes("6300 Ft"), translated);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)"), electricityInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `electricity cost: overflow at ${width}`);
    }

    await navigate("/kalkulatorok/vizfogyasztas-koltseg-kalkulator");
    await choose("hu");
    await edit({ "#waterDaily": "300", "#waterDays": "30", "#waterPrice": "800", "#waterFixed": "1000" });
    const waterHu = await result("#waterResult");
    assert.ok(waterHu.includes("9000 liter"), waterHu);
    assert.ok(waterHu.includes("8200 Ft"), waterHu);
    const waterInputs = await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)");
    for (const [language, label, litres] of [["en", "Estimated total cost:", "9000 litres"], ["de", "Geschätzte Gesamtkosten:", "9000 Liter"]]) {
      await choose(language);
      const translated = await result("#waterResult");
      assert.ok(translated.includes(label), translated);
      assert.ok(translated.includes(litres), translated);
      assert.ok(translated.includes("8200 Ft"), translated);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)"), waterInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `water cost: overflow at ${width}`);
    }

    await navigate("/kalkulatorok/megtakaritasi-cel-kalkulator");
    await choose("hu");
    const savingsHu = await result("#goalResult");
    assert.ok(savingsHu.includes("15 hónap"), savingsHu);
    assert.ok(savingsHu.includes("2"), savingsHu);
    const savingsInputs = await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)");
    for (const [language, label, duration] of [["en", "Estimated time:", "15 months"], ["de", "Geschätzte Dauer:", "15 Monate"]]) {
      await choose(language);
      const translated = await result("#goalResult");
      assert.ok(translated.includes(label), translated);
      assert.ok(translated.includes(duration), translated);
      assert.ok(translated.includes("2"), translated);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)"), savingsInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `savings goal: overflow at ${width}`);
    }

    await navigate("/kalkulatorok/vesztartalek-kalkulator");
    await choose("hu");
    const reserveHu = await result("#reserveResult");
    assert.ok(reserveHu.includes("16 hónap"), reserveHu);
    assert.ok(reserveHu.includes("2"), reserveHu);
    const reserveInputs = await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)");
    for (const [language, label, duration] of [["en", "Estimated time to target:", "16 months"], ["de", "Geschätzte Zeit bis zum Ziel:", "16 Monate"]]) {
      await choose(language);
      const translated = await result("#reserveResult");
      assert.ok(translated.includes(label), translated);
      assert.ok(translated.includes(duration), translated);
      assert.ok(translated.includes("2"), translated);
      assert.deepEqual(await evaluate("[...document.querySelectorAll('#kalkulator input')].map(e => e.value)"), reserveInputs);
      assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), `emergency fund: overflow at ${width}`);
    }
    await choose("hu");
    await edit({ "#reserveSaving": "0" });
    assert.ok((await result("#reserveResult")).includes("A megadott havi megtakarítással nem számolható"));
    await choose("en");
    assert.ok((await result("#reserveResult")).includes("Cannot be estimated with the monthly savings entered"));
  }
  console.log("Everyday locales: ratio, percentage change, tip, margin, markup, break-even, dates, age, working-hours, working-days, overtime, hourly wage, shared costs, recipe, electricity, water, savings goal and emergency fund passed at both widths.");
}
module.exports = { checkEverydayLocales };

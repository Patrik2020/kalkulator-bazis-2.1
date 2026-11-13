"use strict";
const assert = require("node:assert/strict");

async function checkBrickLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate("(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=" + JSON.stringify(language) + ";s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()");
  const input = (id, value) => evaluate("(async()=>{const el=document.getElementById(" + JSON.stringify(id) + ");if(!el)throw Error('Missing brick input: ' + " + JSON.stringify(id) + ");el.value=" + JSON.stringify(value) + ";el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()");
  const values = () => evaluate("JSON.stringify({main:" + JSON.stringify(["wallLength","wallHeight","windowArea","doorArea","brickType","wastePercent","brickPrice","brickLength","brickHeight"]) + ".map(id=>document.getElementById(id).value),logistics:[...document.querySelectorAll('.brick-logistics[data-construction-quality] input,.brick-logistics[data-construction-quality] select')].map(el=>[el.getAttribute('data-cq'),el.value])})");
  for (const width of [390, 1440]) {
    await setViewport(width, 1100);
    await navigate("/kalkulatorok/tegla-kalkulator.html");
    await evaluate("(async()=>{for(let i=0;i<240&&(!document.getElementById('kbInternalLanguage')||!document.querySelector('.brick-logistics[data-construction-quality] [data-cq=\"pieces\"]')||!window.KB_RETENTION_CTA_LOADED||document.querySelectorAll('.card-calculator .retention-cta').length<2);i++)await new Promise(requestAnimationFrame)})()");
    assert.equal(await evaluate("window.KB_RETENTION_CTA_LOADED === true"), true, "retention CTA runtime did not load");
    for (const [id, value] of [["wallLength","5"],["wallHeight","2.7"],["windowArea","1.2"],["doorArea","1.8"],["brickType","porotherm30"],["wastePercent","5"],["brickPrice","900"],["brickLength","30"],["brickHeight","20"]]) await input(id, value);
    await evaluate("(async()=>{await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()");
    const before = await values();
    for (const [language, heading, title, area, openings, net, count, recommended, cost, pieces, palletOrder, extra, summaryNeedle, faqNeedle, errorText] of [
      ["en","Brick Calculator","Brick Calculator | Estimate Masonry and Brick Quantities","13.50 m²","3.00 m²","10.50 m²","168 bricks","177 bricks","159,300 HUF","180 bricks","3 pallets / 180 bricks","0 bricks","Based on the details you entered, the net wall area is 10.50 m²","Should windows and doors be deducted?","Enter valid custom brick dimensions to calculate."],
      ["de","Ziegelrechner","Ziegelrechner | Mauerwerk und Ziegelbedarf schätzen","13,50 m²","3,00 m²","10,50 m²","168 Ziegel","177 Ziegel","159.300 HUF","180 Ziegel","3 Paletten / 180 Ziegel","0 Ziegel","Auf Grundlage deiner Angaben beträgt die Netto-Wandfläche 10,50 m²","Müssen Fenster und Türen abgezogen werden?","Gib gültige Maße für den Ziegel in Sondergröße ein, um zu rechnen."]
    ]) {
      await input("brickType", "porotherm30");
      await choose(language);
      const state = JSON.parse(await evaluate("JSON.stringify({heading:document.querySelector('.page-tegla h1')?.textContent.trim(),title:document.title,meta:document.querySelector('meta[name=\"description\"]')?.content,wall:document.getElementById('wallAreaResult')?.textContent.trim(),openings:document.getElementById('openingAreaResult')?.textContent.trim(),net:document.getElementById('netWallAreaResult')?.textContent.trim(),count:document.getElementById('brickCountResult')?.textContent.trim(),recommended:document.getElementById('recommendedBrickCountResult')?.textContent.trim(),cost:document.getElementById('costResult')?.textContent.trim(),summary:document.getElementById('summaryText')?.innerText.replace(/\\s+/g,' ').trim(),info:document.getElementById('brickInfo')?.innerText.replace(/\\s+/g,' ').trim(),guide:document.querySelector('.adsense-content')?.innerText,faq:document.querySelector('.faq-list')?.innerText,related:document.querySelector('.related-links')?.innerText,quality:document.querySelector('.brick-logistics[data-construction-quality]')?.innerText,retention:[...document.querySelectorAll('.card-calculator .retention-cta')].map(el=>el.textContent).join(' '),pieces:document.querySelector('.brick-logistics[data-construction-quality] [data-cq=\"pieces\"]')?.textContent.trim(),pallets:document.querySelector('.brick-logistics[data-construction-quality] [data-cq=\"pallets\"]')?.textContent.trim(),extra:document.querySelector('.brick-logistics[data-construction-quality] [data-cq=\"extra\"]')?.textContent.trim(),schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:(()=>{const u=new URL(document.querySelector('.page-tegla a[href^=\"mailto:\"][href*=\"subject=\"]').href);return [u.searchParams.get('subject'),u.searchParams.get('body')]})(),values:" + JSON.stringify(["wallLength","wallHeight","windowArea","doorArea","brickType","wastePercent","brickPrice","brickLength","brickHeight"]) + ".map(id=>document.getElementById(id).value),logistics:[...document.querySelectorAll('.brick-logistics[data-construction-quality] input,.brick-logistics[data-construction-quality] select')].map(el=>[el.getAttribute('data-cq'),el.value]),width:document.documentElement.scrollWidth})"));
      assert.equal(state.heading, heading, language + ": heading");
      assert.equal(state.title, title, language + ": title");
      assert.ok(state.meta.includes(language === "en" ? "Brick calculator:" : "Ziegelrechner:"), language + ": description");
      assert.equal(state.wall, area, language + ": gross wall area");
      assert.equal(state.openings, openings, language + ": openings");
      assert.equal(state.net, net, language + ": net wall area");
      assert.equal(state.count, count, language + ": brick count");
      assert.equal(state.recommended, recommended, language + ": recommended count");
      assert.equal(state.cost, cost, language + ": estimated cost");
      assert.ok(state.summary.includes(summaryNeedle), language + ": dynamic summary");
      assert.ok(state.summary.includes(recommended), language + ": recommended amount in summary");
      assert.ok(state.summary.includes(cost), language + ": cost in summary");
      assert.ok(state.info.includes(language === "en" ? "Wall thickness: 30 cm" : "Wandstärke: 30 cm"), language + ": brick information");
      assert.ok(state.info.includes(language === "en" ? "16 bricks/m²" : "16 Ziegel/m²"), language + ": product rate");
      assert.ok(state.guide.includes(language === "en" ? "How does the calculation work?" : "Wie funktioniert die Berechnung?"), language + ": guide");
      assert.ok(state.faq.includes(faqNeedle), language + ": FAQ");
      assert.ok(state.related.includes(language === "en" ? "Concrete Calculator" : "Betonrechner"), language + ": related links");
      assert.ok(state.quality.includes(language === "en" ? "Bricks per pallet" : "Ziegel pro Palette"), language + ": logistics copy");
      assert.ok(state.retention.includes(language === "en" ? "Was this calculator useful?" : "War dieser Rechner hilfreich?"), language + ": retention CTA copy");
      assert.ok(state.retention.includes(language === "en" ? "Bookmark" : "Lesezeichen"), language + ": retention action label");
      const bookmark = JSON.parse(await evaluate("(async()=>{const c=[...document.querySelectorAll('.card-calculator .retention-cta')].at(-1);c.hidden=false;const guide=c.querySelector('[data-retention-guide=\"bookmark\"]');const button=c.querySelector('[data-retention-action=\"bookmark\"]');guide.setAttribute('hidden','');button.setAttribute('aria-expanded','false');c.querySelector('[data-retention-status]').textContent='';button.click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return JSON.stringify({guide:c.querySelector('[data-retention-bookmark-text]').textContent.trim(),status:c.querySelector('[data-retention-status]').textContent.trim()})})()"));
      assert.ok(bookmark.guide.includes(language === "en" ? "Press Ctrl + D" : "Drücke Ctrl + D"), language + ": dynamic bookmark guide");
      assert.equal(bookmark.status, language === "en" ? "Follow the instructions to save this page as a bookmark." : "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.", language + ": dynamic retention status");
      assert.equal(state.pieces, pieces, language + ": pallet planner pieces");
      assert.equal(state.pallets, palletOrder, language + ": pallet planner order");
      assert.equal(state.extra, extra, language + ": pallet planner remainder");
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE", language + ": structured-data language");
      assert.equal(state.report[0], language === "en" ? "Error report – Brick Calculator" : "Fehlermeldung – Ziegelrechner", language + ": report subject");
      assert.ok(state.report[1].includes(language === "en" ? "Briefly describe the issue" : "Beschreibe den Fehler kurz"), language + ": report template");
      assert.deepEqual(state.values, JSON.parse(before).main, language + ": main input values changed");
      assert.deepEqual(state.logistics, JSON.parse(before).logistics, language + ": pallet planner input values changed");
      assert.ok(state.width <= width + 1, language + ": horizontal overflow at " + width + "px");
      await input("brickType", "custom");
      await input("brickLength", "30");
      await input("brickHeight", "20");
      const custom = JSON.parse(await evaluate("JSON.stringify({info:document.getElementById('brickInfo').innerText.replace(/\\s+/g,' ').trim(),count:document.getElementById('brickCountResult').textContent.trim(),recommended:document.getElementById('recommendedBrickCountResult').textContent.trim(),summary:document.getElementById('summaryText').innerText.replace(/\\s+/g,' ').trim()})"));
      assert.ok(custom.info.includes(language === "en" ? "Custom-size brick" : "Ziegel in Sondergröße"), language + ": custom brick info");
      assert.equal(custom.count, language === "en" ? "175 bricks" : "175 Ziegel", language + ": custom brick count");
      assert.equal(custom.recommended, language === "en" ? "184 bricks" : "184 Ziegel", language + ": custom recommended count");
      assert.ok(custom.summary.includes(language === "en" ? "Using the selected custom-size brick" : "Mit dem ausgewählten Ziegel in Sondergröße"), language + ": custom summary");
      await input("brickLength", "0");
      assert.equal(await evaluate("document.getElementById('summaryText').textContent.trim()"), errorText, language + ": custom dimension error");
      assert.equal(await evaluate("document.getElementById('brickCountResult').textContent.trim()"), "–", language + ": invalid custom result reset");
      await input("brickLength", "30");
      const afterCustom = JSON.parse(await values());
      assert.deepEqual(afterCustom.main, JSON.parse(before).main.map((value, index) => index === 4 ? "custom" : index === 7 ? "30" : index === 8 ? "20" : value), language + ": custom input values changed");
      assert.deepEqual(afterCustom.logistics, JSON.parse(before).logistics, language + ": pallet planner values changed after custom selection");
      await choose("hu");
      assert.equal(await evaluate("document.querySelector('.page-tegla h1').textContent.trim()"), "Tégla kalkulátor", "Hungarian restoration");
      assert.ok((await evaluate("document.getElementById('brickInfo').innerText")).includes("Egyedi méretű tégla"), "Hungarian custom brick restoration");
    }
  }
  console.log("Brick calculator locale: EN/DE calculations, custom-size validation, pallet planning, metadata, report links, retention CTA, input preservation and responsive widths passed at 390/1440px.");
}

module.exports = { checkBrickLocale };

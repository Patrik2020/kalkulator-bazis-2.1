"use strict";
const assert = require("node:assert/strict");

async function checkWaterIntakeLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input = (id, value) => evaluate(`(async()=>{const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const fields = ["weight","activity","wa-weight","wa-exercise","wa-heat","wa-life"];
  const values = () => evaluate(`JSON.stringify({values:${JSON.stringify(fields)}.map(id=>document.getElementById(id).value),factors:[...document.querySelectorAll('[data-water-factor],[data-water-medical]')].map(el=>el.checked)})`);
  const medical = checked => evaluate(`(async()=>{const el=document.querySelector('[data-water-medical]');el.checked=${checked};el.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1100);
    await navigate("/kalkulatorok/vizfogyasztas-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<300&&(!document.querySelector('.lq-water[data-lifestyle-quality]')||!document.querySelector('.priority-upgrade[data-priority-upgrade]'));i++)await new Promise(requestAnimationFrame)})()`);
    for (const [id,value] of [["weight","78"],["activity","500"],["wa-weight","80"],["wa-exercise","500"],["wa-heat","200"],["wa-life","300"]]) await input(id,value);
    await evaluate(`(async()=>{for(const [index,el] of [...document.querySelectorAll('[data-water-factor]')].entries()){el.checked=index<2;el.dispatchEvent(new Event('change',{bubbles:true}));}await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
    const before = await values();
    const sourceLinks = () => evaluate(`JSON.stringify([...document.querySelectorAll('.lq-source a,.priority-source a')].map(el=>el.href))`);
    const beforeLinks = await sourceLinks();
    for (const language of ["en","de"]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),result:document.getElementById('simpleCalcResults').innerText,priority:[...document.querySelectorAll('.priority-results strong')].map(el=>el.textContent.trim()),priorityText:document.querySelector('.priority-upgrade').innerText,context:document.querySelector('[data-water-result]').textContent,guide:document.querySelector('.calculator-guide').innerText,faq:document.querySelector('.faq-list').innerText,note:document.querySelector('.reliability-note').innerText,title:document.title,description:document.querySelector('meta[name="description"]').content,og:document.querySelector('meta[property="og:description"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:document.querySelector('.reliability-actions a[href^="mailto:"]').href,width:document.documentElement.scrollWidth})`));
      const heading = language === "en" ? "Water Intake Calculator" : "Trinkmengenrechner";
      assert.equal(state.heading,heading);
      assert.ok(state.result.includes(language === "en" ? "Estimated daily fluid intake:" : "Geschätzte tägliche Flüssigkeitszufuhr:"),state.result);
      assert.ok(state.result.includes(language === "en" ? "3.23 litres" : "3,23 Liter"),state.result);
      assert.ok(state.result.includes(language === "en" ? "13 glasses" : "13 Gläser"),state.result);
      assert.deepEqual(state.priority,language === "en" ? ["3.4–3.8 litres/day","1,000 ml","14–15 glasses"] : ["3,4–3,8 Liter/Tag","1.000 ml","14–15 Gläser"]);
      assert.ok(state.context.includes(language === "en" ? "You selected 2 circumstances" : "Du hast 2 Umstände"));
      assert.ok(state.priorityText.includes(language === "en" ? "Do not use this calculator to set a personal target" : "nicht zur Festlegung eines persönlichen Zielwerts"));
      assert.ok(state.guide.includes(language === "en" ? "medically prescribed fluid restriction" : "ärztlich verordneten Flüssigkeitsbeschränkung"));
      assert.ok(state.faq.includes(language === "en" ? "Can it be used for children?" : "Kann der Rechner für Kinder verwendet werden?"));
      assert.ok(state.note.includes(language === "en" ? "not a diagnosis" : "keine Diagnose"));
      assert.ok(state.title.startsWith(heading));
      assert.ok(state.description.includes(language === "en" ? "daily fluid intake" : "tägliche Flüssigkeitszufuhr"));
      assert.ok(state.og.includes(language === "en" ? "important limitations" : "wichtigen Einschränkungen"));
      assert.equal(state.schema["@graph"][0].inLanguage,language === "en" ? "en-GB" : "de-DE");
      assert.equal(state.schema["@graph"].find(item=>item["@type"] === "SoftwareApplication").name,heading);
      assert.ok(new URL(state.report).searchParams.get("subject").includes(heading));
      assert.equal(await values(),before); assert.equal(await sourceLinks(),beforeLinks);
      assert.ok(state.width<=width+1,`Horizontal overflow at ${width}px`);
      await medical(true);
      const warning = await evaluate(`document.querySelector('[data-water-result]').textContent`);
      assert.ok(warning.includes(language === "en" ? "Do not automatically increase fluid intake" : "Erhöhe die Flüssigkeitszufuhr hier nicht automatisch"),warning);
      await medical(false);
      await input("activity","-1");
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`),language === "en" ? "Values must not be negative." : "Die Werte dürfen nicht negativ sein.");
      await input("activity","500");
      await input("weight","0");
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`),language === "en" ? "All values must be greater than zero." : "Alle Werte müssen größer als null sein.");
      await input("weight","78");
      const feedback = await evaluate(`(async()=>{for(let i=0;i<240&&(!window.KB_RETENTION_CTA_LOADED||document.querySelectorAll('.card-calculator .retention-cta').length<2);i++)await new Promise(requestAnimationFrame);const c=[...document.querySelectorAll('.card-calculator .retention-cta')].at(-1);c.hidden=false;c.querySelector('[data-retention-guide="bookmark"]').setAttribute('hidden','');c.querySelector('[data-retention-action="bookmark"]').setAttribute('aria-expanded','false');c.querySelector('[data-retention-action="bookmark"]').click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return c.querySelector('[data-retention-status]').textContent.trim()})()`);
      assert.equal(feedback,language === "en" ? "Follow the instructions to save this page as a bookmark." : "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`),"Vízfogyasztás kalkulátor");
    assert.ok((await evaluate(`document.getElementById('simpleCalcResults').innerText`)).includes("3,23 liter"));
    assert.equal(await values(),before); assert.equal(await sourceLinks(),beforeLinks);
  }
  console.log("Water intake locale: EN/DE main estimate, fluid range, context/medical cautions, errors, guide, metadata, source links, retention, input preservation and HU restoration passed at 390/1440px.");
}
module.exports = { checkWaterIntakeLocale };

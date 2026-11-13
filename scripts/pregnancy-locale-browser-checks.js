"use strict";
const assert = require("node:assert/strict");

async function checkPregnancyLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input = (id, value) => evaluate(`(async()=>{const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const ids = ["lmpDate","cycleLength","pr-mode","pr-lmp","pr-cycle","pr-transfer","pr-age"];
  const values = () => evaluate(`JSON.stringify(${JSON.stringify(ids)}.map(id=>document.getElementById(id).value))`);
  for (const width of [390,1440]) {
    await setViewport(width,1100);
    await navigate("/kalkulatorok/terhessegi-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<300&&(!document.querySelector('.lq-pregnancy[data-lifestyle-quality]')||!document.querySelector('.priority-upgrade[data-priority-upgrade]'));i++)await new Promise(requestAnimationFrame)})()`);
    for (const [id,value] of [["lmpDate","2026-08-01"],["cycleLength","29"],["pr-mode","ivf"],["pr-transfer","2026-08-20"],["pr-age","5"]]) await input(id,value);
    const before = await values();
    const links = () => evaluate(`JSON.stringify([...document.querySelectorAll('.lq-source a,.priority-source a')].map(el=>el.href))`);
    const beforeLinks = await links();
    for (const language of ["en","de"]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),result:document.getElementById('simpleCalcResults').innerText,priority:document.querySelector('.priority-upgrade').innerText,guide:document.querySelector('.calculator-guide').innerText,faq:document.querySelector('.faq-list').innerText,note:document.querySelector('.reliability-note').innerText,title:document.title,description:document.querySelector('meta[name="description"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:document.querySelector('.reliability-actions a[href^="mailto:"]').href,width:document.documentElement.scrollWidth})`));
      const heading = language === "en" ? "Pregnancy Due Date Calculator" : "Schwangerschaftsrechner";
      assert.equal(state.heading,heading);
      assert.ok(state.result.includes(language === "en" ? "Estimated due date:" : "Voraussichtlicher Geburtstermin:"),state.result);
      assert.ok(state.result.includes(language === "en" ? "9 May 2027" : "9. Mai 2027"),state.result);
      assert.ok(state.priority.includes(language === "en" ? "From the transfer of a 5-day embryo" : "Aus dem Transfer eines 5 Tage alten Embryos"),state.priority);
      assert.ok(state.priority.includes(language === "en" ? "clinical dating may supersede" : "klinische Datierung"),state.priority);
      assert.ok(state.guide.includes(language === "en" ? "not a guaranteed delivery date" : "kein garantiertes Geburtsdatum"),state.guide);
      assert.ok(state.faq.includes(language === "en" ? "irregular cycles" : "unregelmäßigen Zyklen"),state.faq);
      assert.ok(state.note.includes(language === "en" ? "not a diagnosis" : "keine Diagnose"),state.note);
      assert.ok(state.title.startsWith(heading));
      assert.ok(state.description.includes(language === "en" ? "gestational age" : "Schwangerschaftsalter"));
      assert.equal(state.schema["@graph"][0].inLanguage,language === "en" ? "en-GB" : "de-DE");
      assert.equal(state.schema["@graph"].find(item=>item["@type"] === "SoftwareApplication").name,heading);
      assert.ok(new URL(state.report).searchParams.get("subject").includes(heading));
      assert.equal(await values(),before); assert.equal(await links(),beforeLinks);
      assert.ok(state.width <= width + 1,`Horizontal overflow at ${width}px`);
      await input("cycleLength","20");
      assert.equal(await evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`),language === "en" ? "Cycle length must be between 21 and 45 days." : "Die Zykluslänge muss zwischen 21 und 45 Tagen liegen.");
      await input("cycleLength","29");
      const feedback = await evaluate(`(async()=>{for(let i=0;i<240&&(!window.KB_RETENTION_CTA_LOADED||document.querySelectorAll('.card-calculator .retention-cta').length<2);i++)await new Promise(requestAnimationFrame);const c=[...document.querySelectorAll('.card-calculator .retention-cta')].at(-1);c.hidden=false;c.querySelector('[data-retention-guide="bookmark"]').setAttribute('hidden','');c.querySelector('[data-retention-action="bookmark"]').setAttribute('aria-expanded','false');c.querySelector('[data-retention-action="bookmark"]').click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return c.querySelector('[data-retention-status]').textContent.trim()})()`);
      assert.equal(feedback,language === "en" ? "Follow the instructions to save this page as a bookmark." : "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`),"Terhességi kalkulátor");
    assert.equal(await values(),before); assert.equal(await links(),beforeLinks);
  }
  console.log("Pregnancy locale: EN/DE estimate, IVF/cycle dating, errors, guide, metadata, sources, retention, input preservation and HU restoration passed at 390/1440px.");
}
module.exports = { checkPregnancyLocale };

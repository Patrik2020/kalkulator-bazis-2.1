"use strict";
const assert = require("node:assert/strict");

async function checkCrushedStoneLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Language selector missing');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input = (id, value) => evaluate(`(async()=>{const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const values = () => evaluate(`JSON.stringify(['stoneArea','stoneDepth','stoneDensity','stoneWaste'].map(id=>document.getElementById(id).value))`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/zuzottko-kalkulator.html");
    await input("stoneArea", "42"); await input("stoneDepth", "6"); await input("stoneDensity", "1.7"); await input("stoneWaste", "15");
    const before = await values();
    for (const language of ["en", "de"]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),result:document.getElementById('stoneResult').innerText,guide:document.querySelector('.calculator-guide').innerText,faq:document.querySelector('.faq-list').innerText,note:document.querySelector('.reliability-note').innerText,title:document.title,description:document.querySelector('meta[name="description"]').content,ogTitle:document.querySelector('meta[property="og:title"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:document.querySelector('.reliability-actions a[href^="mailto:"]').href,width:document.documentElement.scrollWidth})`));
      const heading = language === "en" ? "Crushed Stone Calculator" : "Schotterrechner";
      assert.equal(state.heading, heading);
      assert.equal(state.title, heading + " | Kalkulátor Bázis");
      assert.equal(state.ogTitle, state.title);
      for (const value of language === "en" ? ["2.52 m³", "2.898 m³", "4.927 t", "Estimated mass:"] : ["2,52 m³", "2,898 m³", "4,927 t", "Geschätzte Masse:"]) assert.ok(state.result.includes(value), `${language}: ${state.result}`);
      assert.ok(state.guide.includes(language === "en" ? "supplier’s conversion factors" : "Umrechnungsfaktoren des Lieferanten"));
      assert.ok(state.faq.includes(language === "en" ? "Which bulk density should I use?" : "Welche Schüttdichte sollte ich verwenden?"));
      assert.ok(state.note.includes(language === "en" ? "Actual mass depends" : "tatsächliche Masse"));
      assert.ok(state.description.includes(language === "en" ? "bulk density" : "Schüttdichte"));
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(state.schema["@graph"].find(item=>item["@type"] === "SoftwareApplication").name, heading);
      assert.equal(state.schema["@graph"].find(item=>item["@type"] === "FAQPage").mainEntity[0].name, language === "en" ? "Which bulk density should I use?" : "Welche Schüttdichte sollte ich verwenden?");
      assert.ok(new URL(state.report).searchParams.get("subject").includes(heading));
      assert.equal(await values(), before);
      assert.ok(state.width <= width + 1, `Horizontal overflow at ${width}px`);
      await input("stoneWaste", "101");
      assert.equal(await evaluate(`document.getElementById('stoneResult').textContent.trim()`), language === "en" ? "The allowance must not exceed 100%." : "Der Zuschlag darf höchstens 100 % betragen.");
      await input("stoneWaste", "15"); await input("stoneDensity", "0");
      assert.equal(await evaluate(`document.getElementById('stoneResult').textContent.trim()`), language === "en" ? "Bulk density: the value must be greater than zero." : "Schüttdichte: Der Wert muss größer als null sein.");
      await input("stoneDensity", "1.7");
      const feedback = await evaluate(`(async()=>{for(let i=0;i<240&&!window.KB_RETENTION_CTA_LOADED;i++)await new Promise(requestAnimationFrame);const c=document.querySelector('.card-calculator .retention-cta');c.hidden=false;c.querySelector('[data-retention-action="bookmark"]').click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return c.querySelector('[data-retention-status]').textContent.trim()})()`);
      assert.equal(feedback, language === "en" ? "Follow the instructions to save this page as a bookmark." : "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Zúzottkő kalkulátor");
    assert.ok((await evaluate(`document.getElementById('stoneResult').innerText`)).includes("Becsült tömeg: 4,927 t"));
    assert.equal(await values(), before);
  }
  console.log("Crushed stone locale: EN/DE quantities, validation, guide, FAQ, metadata, retention feedback, input preservation and HU restoration passed at 390/1440px.");
}
module.exports = { checkCrushedStoneLocale };

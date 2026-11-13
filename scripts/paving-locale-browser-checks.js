"use strict";
const assert = require("node:assert/strict");

async function checkPavingLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Language selector missing');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input = (id, value) => evaluate(`(async()=>{const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const submit = () => evaluate(`(async()=>{document.querySelector('.construction-planner').requestSubmit();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const ids = ["length", "width", "excludeArea", "packCoverage", "waste", "beddingThickness", "beddingLoss", "openEdge", "edgePiece"].map(id => "construction-" + id);
  const values = () => evaluate(`JSON.stringify(${JSON.stringify(ids)}.map(id=>document.getElementById(id).value))`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1100);
    await navigate("/kalkulatorok/terkovezes-kalkulator.html");
    for (const [id, value] of [["length","6.2"],["width","3.8"],["excludeArea","1.5"],["packCoverage","2.3"],["waste","8"],["beddingThickness","5"],["beddingLoss","12"],["openEdge","1.2"],["edgePiece","0.5"]]) await input("construction-" + id, value);
    await submit();
    const before = await values();
    await evaluate(`(async()=>{for(let i=0;i<240&&!document.querySelector('.paving-slope [data-cq="length"]');i++)await new Promise(requestAnimationFrame);const p=document.querySelector('.paving-slope');for(const [key,value] of [['length','7.5'],['slope','2.4']]){const el=p.querySelector('[data-cq="'+key+'"]');el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));}await new Promise(requestAnimationFrame)})()`);
    const slopeValues = () => evaluate(`JSON.stringify([...document.querySelectorAll('.paving-slope input')].map(el=>el.value))`);
    const beforeSlope = await slopeValues();
    for (const language of ["en", "de"]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),result:[...document.querySelectorAll('.construction-results dd')].map(el=>el.textContent.trim()),labels:[...document.querySelectorAll('.construction-results dt')].map(el=>el.textContent.trim()),guide:document.querySelector('.calculator-guide').innerText,faq:document.querySelector('.faq-list').innerText,method:document.querySelector('.construction-methodology').innerText,quality:document.querySelector('.paving-slope').innerText,drop:document.querySelector('.paving-slope [data-cq="drop"]').textContent,meaning:document.querySelector('.paving-slope [data-cq="meaning"]').textContent,title:document.title,description:document.querySelector('meta[name="description"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:document.querySelector('.reliability-actions a[href^="mailto:"]').href,width:document.documentElement.scrollWidth})`));
      const heading = language === "en" ? "Paving Calculator" : "Pflaster-Rechner";
      assert.equal(state.heading, heading);
      assert.deepEqual(state.result, language === "en" ? ["22.06 m²","23.82 m²","11 pcs","1.24 m³","18.8 m","38 pcs"] : ["22,06 m²","23,82 m²","11 Stk.","1,24 m³","18,8 m","38 Stk."]);
      assert.ok(state.labels.includes(language === "en" ? "Bedding material volume" : "Volumen des Bettungsmaterials"));
      assert.ok(state.guide.includes(language === "en" ? "3 packs with 10 m² coverage" : "3 Pakete mit je 10 m² Deckfläche"));
      assert.ok(state.faq.includes(language === "en" ? "Where can I find the coverage per pallet or pack?" : "Wo finde ich die Deckfläche je Palette oder Paket?"));
      assert.ok(state.method.includes(language === "en" ? "actual number of packs" : "tatsächliche Paketanzahl"));
      assert.ok(state.quality.includes(language === "en" ? "does not produce a drainage design" : "keinen Entwässerungsplan"));
      assert.equal(state.drop, "18 cm");
      assert.equal(state.meaning, language === "en" ? "18 cm drop over 7.5 m" : "18 cm Gefälle auf 7,5 m");
      assert.ok(state.title.startsWith(heading));
      assert.ok(state.description.includes(language === "en" ? "pack quantities" : "Paketanzahl"));
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.ok(new URL(state.report).searchParams.get("subject").includes(heading));
      assert.equal(await values(), before); assert.equal(await slopeValues(), beforeSlope);
      assert.ok(state.width <= width + 1, `Horizontal overflow at ${width}px`);
      for (const [id, invalid, original, expected] of [
        ["excludeArea","100","1.5",language === "en" ? "The net area to be paved must remain positive." : "Die zu pflasternde Nettofläche muss positiv bleiben."],
        ["openEdge","100","1.2",language === "en" ? "The edge length without edging cannot exceed the full perimeter." : "Die Länge ohne Randeinfassung darf den gesamten Umfang nicht überschreiten."]
      ]) {
        await input("construction-" + id, invalid); await submit();
        assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`), expected);
        await input("construction-" + id, original); await submit();
      }
      const feedback = await evaluate(`(async()=>{for(let i=0;i<240&&(!window.KB_RETENTION_CTA_LOADED||document.querySelectorAll('.card-calculator .retention-cta').length<1);i++)await new Promise(requestAnimationFrame);const c=[...document.querySelectorAll('.card-calculator .retention-cta')].at(-1);c.hidden=false;c.querySelector('[data-retention-guide="bookmark"]').setAttribute('hidden','');c.querySelector('[data-retention-action="bookmark"]').setAttribute('aria-expanded','false');c.querySelector('[data-retention-action="bookmark"]').click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return c.querySelector('[data-retention-status]').textContent.trim()})()`);
      assert.equal(feedback, language === "en" ? "Follow the instructions to save this page as a bookmark." : "Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`), "Térkövezés kalkulátor");
    assert.equal(await values(), before); assert.equal(await slopeValues(), beforeSlope);
    assert.equal(await evaluate(`document.querySelector('.paving-slope [data-cq="meaning"]').textContent`), "7,5 m-en 18 cm esés");

  }
  console.log("Paving locale: EN/DE quantities, pack rounding, bedding, edging, slope helper, validation, guide, metadata, retention and HU restoration passed at 390/1440px.");
}
module.exports = { checkPavingLocale };

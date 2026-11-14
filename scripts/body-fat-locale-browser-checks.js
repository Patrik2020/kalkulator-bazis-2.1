"use strict";
const assert = require("node:assert/strict");

async function checkBodyFatLocale({navigate,evaluate,setViewport}) {
  const choose=language=>evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input=(id,value)=>evaluate(`(async()=>{const el=document.getElementById(${JSON.stringify(id)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const female=[["gender","1"],["waist","75"],["neck","34"],["hip","100"],["height","168"]];
  const male=[["gender","2"],["waist","90"],["neck","40"],["hip","0"],["height","180"]];
  const values=()=>evaluate(`JSON.stringify(['gender','waist','neck','hip','height'].map(id=>document.getElementById(id).value))`);
  const result=()=>evaluate(`document.getElementById('simpleCalcResults').textContent.trim()`);
  const sourceLinks=()=>evaluate(`JSON.stringify([...document.querySelectorAll('.lq-source a,.priority-source a')].map(el=>el.href))`);
  for(const width of [390,1440]) {
    await setViewport(width,1100);
    await navigate("/kalkulatorok/testzsir-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<300&&(!document.querySelector('.lq-body-fat[data-lifestyle-quality]')||!document.querySelector('.priority-upgrade[data-priority-upgrade]'));i++)await new Promise(requestAnimationFrame)})()`);
    for(const [id,value] of female) await input(id,value);
    const before=await values(),beforeLinks=await sourceLinks();
    for(const language of ["en","de"]) {
      await choose(language);
      const state=JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),result:document.getElementById('simpleCalcResults').innerText,guide:document.querySelector('.calculator-guide').innerText,faq:document.querySelector('.faq-list').innerText,lifestyle:document.querySelector('.lq-body-fat').innerText,priority:document.querySelector('.priority-upgrade').innerText,note:document.querySelector('.reliability-note').innerText,title:document.title,description:document.querySelector('meta[name="description"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:document.querySelector('.reliability-actions a[href^="mailto:"]').href,width:document.documentElement.scrollWidth,figure:(()=>{const svg=document.querySelector('.priority-health-figure svg');return {aria:svg.getAttribute('aria-label'),texts:[...svg.querySelectorAll('text')].map(el=>({text:el.textContent,right:el.getBBox().x+el.getBBox().width})),right:svg.viewBox.baseVal.width}})()})`));
      const heading=language==="en"?"Body Fat Percentage Calculator":"Körperfett-Rechner";
      assert.equal(state.heading,heading);assert.equal(state.title,heading);
      assert.ok(state.result.includes(language==="en"?"Estimated body fat:":"Geschätzter Körperfettanteil:"),state.result);
      assert.ok(state.result.includes(language==="en"?"28.1%":"28,1%"),state.result);
      assert.ok(state.guide.includes(language==="en"?"not the U.S. Navy’s current Body Composition Assessment":"nicht das aktuelle Body-Composition-Assessment"));
      assert.ok(state.faq.includes(language==="en"?"Is it suitable for children?":"Ist die Methode für Kinder geeignet?"));
      assert.ok(state.lifestyle.includes(language==="en"?"not equivalent to DEXA":"nicht mit DEXA"));
      assert.ok(state.priority.includes(language==="en"?"not intended for current Navy BCA classification":"weder der aktuellen Navy-BCA-Einstufung"));
      assert.ok(state.note.includes(language==="en"?"not a diagnosis":"keine Diagnose"));
      assert.ok(state.description.includes(language==="en"?"body fat percentage":"Körperfettanteil"));
      assert.equal(state.schema["@graph"][0].inLanguage,language==="en"?"en-GB":"de-DE");
      assert.equal(state.schema["@graph"].find(item=>item["@type"]==="SoftwareApplication").name,heading);
      assert.ok(new URL(state.report).searchParams.get('subject').includes(heading));
      assert.equal(state.figure.aria,language==="en"?"Schematic measurement sites":"Schematische Darstellung der Messstellen");
      assert.ok(state.figure.texts[0].text.startsWith(language==="en"?"Neck:":"Hals:"));
      assert.ok(state.figure.texts[1].text.startsWith(language==="en"?"Waist:":"Taille:"));
      assert.ok(state.figure.texts[2].text.startsWith(language==="en"?"Hips:":"Hüfte:"));
      for(const label of state.figure.texts) assert.ok(label.right<=state.figure.right,`Clipped diagram label: ${label.text}`);
      assert.ok(state.width<=width+1,`Horizontal overflow at ${width}px`);
      assert.equal(await values(),before);assert.equal(await sourceLinks(),beforeLinks);
      await input("hip","0");
      assert.equal(await result(),language==="en"?"All values must be greater than zero.":"Alle Werte müssen größer als null sein.");
      await input("hip","100");
      for(const [id,value] of male) await input(id,value);
      assert.ok((await result()).includes(language==="en"?"18.4%":"18,4%"));
      await input("waist","40");
      assert.equal(await result(),language==="en"?"The combined circumference must be greater than zero.":"Die kombinierte Umfangsgröße muss größer als null sein.");
      await input("waist","41");
      assert.equal(await result(),language==="en"?"The entered circumferences do not produce a plausible estimate.":"Die eingegebenen Umfänge ergeben keine plausible Schätzung.");
      for(const [id,value] of female) await input(id,value);
      assert.equal(await values(),before);
      const feedback=await evaluate(`(async()=>{for(let i=0;i<240&&(!window.KB_RETENTION_CTA_LOADED||document.querySelectorAll('.card-calculator .retention-cta').length<2);i++)await new Promise(requestAnimationFrame);const c=[...document.querySelectorAll('.card-calculator .retention-cta')].at(-1);c.hidden=false;c.querySelector('[data-retention-guide="bookmark"]').setAttribute('hidden','');c.querySelector('[data-retention-action="bookmark"]').setAttribute('aria-expanded','false');c.querySelector('[data-retention-action="bookmark"]').click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return c.querySelector('[data-retention-status]').textContent.trim()})()`);
      assert.equal(feedback,language==="en"?"Follow the instructions to save this page as a bookmark.":"Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.");
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`),"Testzsír százalék kalkulátor");
    assert.ok((await result()).includes("28,1%"));assert.equal(await values(),before);assert.equal(await sourceLinks(),beforeLinks);
  }
  console.log("Body fat locale: EN/DE female/male estimates, validation, cautions, SVG labels, metadata, source links, retention, input preservation and HU restoration passed at 390/1440px.");
}
module.exports={checkBodyFatLocale};

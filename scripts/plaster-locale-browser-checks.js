"use strict";
const assert=require("node:assert/strict");

async function checkPlasterLocale({navigate,evaluate,setViewport}) {
  const choose=language=>evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input=(key,value)=>evaluate(`(async()=>{const el=document.getElementById(${JSON.stringify("construction-"+key)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const submit=()=>evaluate(`(async()=>{document.querySelector('.construction-planner').requestSubmit();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const keys=["grossArea","doorArea","windowArea","otherArea","thickness","consumptionMode","minConsumption","maxConsumption","bagSize","waste","manufacturerConfirmed"];
  const values=()=>evaluate(`JSON.stringify(${JSON.stringify(keys)}.map(id=>document.getElementById('construction-'+id).value))`);
  const results=()=>evaluate(`JSON.stringify([...document.querySelectorAll('.construction-results dd')].map(el=>el.textContent.trim()))`);
  const pending=()=>evaluate(`document.querySelector('.construction-results').textContent`);
  const measurement=(key,value)=>evaluate(`(async()=>{const el=document.querySelector('.plaster-depth-map[data-construction-quality] [data-cq="${key}"]');el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const metric=key=>evaluate(`document.querySelector('.plaster-depth-map[data-construction-quality] [data-cq="${key}"]').textContent.trim()`);
  for(const width of [390,1440]) {
    await setViewport(width,1100);
    await navigate("/kalkulatorok/vakolat-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<300&&!document.querySelector('.plaster-depth-map[data-construction-quality]');i++)await new Promise(requestAnimationFrame)})()`);
    for(const [key,value] of [["grossArea","40"],["doorArea","2"],["windowArea","3"],["otherArea","0"],["thickness","10"],["consumptionMode","per-mm"],["minConsumption","1.2"],["maxConsumption","1.5"],["bagSize","25"],["waste","8"],["manufacturerConfirmed","no"]]) await input(key,value);
    await submit();
    const before=await values();
    for(const language of ["en","de"]) {
      await choose(language);
      assert.equal(await values(),before);
      assert.ok((await pending()).includes(language==="en"?"Manufacturer/system data must be verified.":"Hersteller-/Systemdaten müssen geprüft werden."));
      assert.equal(JSON.parse(await results()).length,0,"No order quantity before manufacturer confirmation");
      await input("manufacturerConfirmed","yes");await submit();
      const confirmed=await values();
      const state=JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),guide:document.querySelector('.calculator-guide').textContent,faq:document.querySelector('.faq-list').textContent,method:document.querySelector('.construction-methodology').textContent,title:document.title,description:document.querySelector('meta[name="description"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:document.querySelector('.reliability-actions a[href^="mailto:"]').href,width:document.documentElement.scrollWidth})`));
      const heading=language==="en"?"Plaster Calculator":"Putzrechner";
      assert.equal(state.heading,heading);assert.ok(state.title.startsWith(heading));
      assert.deepEqual(JSON.parse(await results()),language==="en"?["kg/m²/mm × layer thickness","35 m²","420–525 kg","453.6–567 kg","19–23 bags"]:["kg/m²/mm × Schichtdicke","35 m²","420–525 kg","453,6–567 kg","19–23 Säcke"]);
      assert.ok(state.guide.includes(language==="en"?"17 bags":"17 Säcke"));
      assert.ok(state.faq.includes(language==="en"?"Does it also calculate water?":"Wird auch das Wasser berechnet?"));
      assert.ok(state.method.includes(language==="en"?"layer thickness is not multiplied again":"Schichtdicke nicht nochmals multipliziert"));
      assert.ok(state.description.includes(language==="en"?"dry mortar quantities":"Trockenmörtelmenge"));
      assert.equal(state.schema["@graph"][0].inLanguage,language==="en"?"en-GB":"de-DE");
      assert.equal(state.schema["@graph"].find(item=>item["@type"]==="SoftwareApplication").name,heading);
      assert.ok(new URL(state.report).searchParams.get("subject").includes(heading));
      assert.ok(state.width<=width+1,`Horizontal overflow at ${width}px`);
      await input("consumptionMode","per-area");await input("minConsumption","2");await input("maxConsumption","3");await input("thickness","99");await submit();
      const perArea=await results();
      assert.deepEqual(JSON.parse(perArea),language==="en"?["kg/m² – direct manufacturer value","35 m²","70–105 kg","75.6–113.4 kg","4–5 bags"]:["kg/m² – direkter Herstellerwert","35 m²","70–105 kg","75,6–113,4 kg","4–5 Säcke"]);
      await input("thickness","1");await submit();
      assert.equal(await results(),perArea,"Direct kg/m² data must not be multiplied by thickness");
      await input("consumptionMode","per-mm");await input("minConsumption","1.2");await input("maxConsumption","1.5");await input("thickness","10");await submit();
      for(const [key,invalid,original,message] of [
        ["minConsumption","2","1.2",language==="en"?"The minimum consumption must not exceed the maximum.":"Der Mindestverbrauch darf den Höchstverbrauch nicht überschreiten."],
        ["doorArea","40","2",language==="en"?"The net area must remain positive.":"Die Nettofläche muss positiv bleiben."],
        ["bagSize","0","25",language==="en"?"Bag size: enter a value greater than zero.":"Sackinhalt: Gib einen Wert größer als null ein."]
      ]) {
        await input(key,invalid);await submit();
        assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`),message);
        await input(key,original);await submit();
      }
      assert.equal(await values(),confirmed);
      assert.equal(await metric("avg"),"10 mm");assert.equal(await metric("spread"),"4 mm");
      assert.equal(await metric("status"),language==="en"?"Measure at more points":"An weiteren Stellen messen");
      await measurement("d1","10");await measurement("d2","10");
      assert.equal(await metric("status"),language==="en"?"Relatively uniform sample":"Relativ gleichmäßige Stichprobe");
      await measurement("d1","0");await measurement("d2","20");
      assert.equal(await metric("spread"),"20 mm");
      assert.equal(await metric("status"),language==="en"?"Large variation – plan layer thicknesses on site":"Große Abweichung – Schichtdicken vor Ort planen");
      await measurement("d1","8");await measurement("d2","12");await measurement("d3","11");
      assert.equal(await metric("avg"),language==="en"?"10.33 mm":"10,33 mm");
      await measurement("d3","10");
      const feedback=await evaluate(`(async()=>{for(let i=0;i<240&&(!window.KB_RETENTION_CTA_LOADED||!document.querySelector('.card-calculator .retention-cta'));i++)await new Promise(requestAnimationFrame);const c=[...document.querySelectorAll('.card-calculator .retention-cta')].at(-1);c.hidden=false;c.querySelector('[data-retention-guide="bookmark"]').setAttribute('hidden','');c.querySelector('[data-retention-action="bookmark"]').setAttribute('aria-expanded','false');c.querySelector('[data-retention-action="bookmark"]').click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return c.querySelector('[data-retention-status]').textContent.trim()})()`);
      assert.equal(feedback,language==="en"?"Follow the instructions to save this page as a bookmark.":"Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.");
      await input("manufacturerConfirmed","no");await submit();
      assert.equal(await values(),before);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`),"Vakolat kalkulátor");
    assert.ok((await pending()).includes("Gyártói/rendszeradat ellenőrzése szükséges."));
    assert.equal(await metric("status"),"Érdemes több ponton mérni");
    assert.equal(await values(),before);
  }
  console.log("Plaster locale: EN/DE manufacturer guard, per-mm/per-area calculations, bag rounding, errors, thickness map, metadata, retention and HU restoration passed at 390/1440px.");
}
module.exports={checkPlasterLocale};

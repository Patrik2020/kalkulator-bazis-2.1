"use strict";
const assert=require("node:assert/strict");

async function checkRoofTileLocale({navigate,evaluate,setViewport}) {
  const choose=language=>evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const input=(key,value)=>evaluate(`(async()=>{const el=document.getElementById(${JSON.stringify("construction-"+key)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const submit=()=>evaluate(`(async()=>{document.querySelector('.construction-planner').requestSubmit();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  const keys=["roofArea","openings","tilesMin","tilesMax","waste","packSize","purchaseMode","manufacturerConfirmed"];
  const values=()=>evaluate(`JSON.stringify(${JSON.stringify(keys)}.map(id=>document.getElementById('construction-'+id).value))`);
  const results=()=>evaluate(`JSON.stringify([...document.querySelectorAll('.construction-results dd')].map(el=>el.textContent.trim()))`);
  for(const width of [390,1440]) {
    await setViewport(width,1100);
    await navigate("/kalkulatorok/tetocserep-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<300&&!document.querySelector('.roof-accessories[data-construction-quality]');i++)await new Promise(requestAnimationFrame)})()`);
    for(const [key,value] of [["roofArea","120"],["openings","3"],["tilesMin","9.2"],["tilesMax","10"],["waste","8"],["packSize","192"],["purchaseMode","pieces"],["manufacturerConfirmed","no"]]) await input(key,value);
    await submit();
    const before=await values();
    const pending=()=>evaluate(`document.querySelector('.construction-results').innerText`);
    for(const language of ["en","de"]) {
      await choose(language);
      assert.equal(await values(),before);
      assert.ok((await pending()).includes(language==="en"?"Manufacturer/system data must be verified.":"Hersteller-/Systemdaten müssen geprüft werden."));
      assert.equal(JSON.parse(await results()).length,0,"No order quantity before manufacturer confirmation");
      await input("manufacturerConfirmed","yes");await submit();
      const confirmed=await values();
      const state=JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),rows:[...document.querySelectorAll('.construction-results dd')].map(el=>el.textContent.trim()),guide:document.querySelector('.calculator-guide').innerText,faq:document.querySelector('.faq-list').innerText,method:document.querySelector('.construction-methodology').innerText,quality:document.querySelector('.roof-accessories').innerText,title:document.title,description:document.querySelector('meta[name="description"]').content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),report:document.querySelector('.reliability-actions a[href^="mailto:"]').href,width:document.documentElement.scrollWidth})`));
      const heading=language==="en"?"Roof Tile Calculator":"Dachziegelrechner";
      const pieces=language==="en"?"1,163–1,264 pcs":"1.163–1.264 Stk.";
      assert.equal(state.heading,heading);assert.ok(state.title.startsWith(heading));
      assert.deepEqual(state.rows,language==="en"?["Individual tiles","117 m²",pieces,"6.06–6.58"]:["Einzeln bestellbar","117 m²",pieces,"6,06–6,58"]);
      assert.ok(state.guide.includes(language==="en"?"1,512 tiles":"1.512 Stück"));
      assert.ok(state.faq.includes(language==="en"?"Does it include ridge tiles?":"Werden Firstziegel mitberechnet?"));
      assert.ok(state.method.includes(language==="en"?"nominal dimensions":"Nennmaßen"));
      assert.ok(state.quality.includes(language==="en"?"standard tile count":"Anzahl der Flächenziegel"));
      assert.ok(state.description.includes(language==="en"?"roof tile quantities":"Dachziegelanzahl"));
      assert.equal(state.schema["@graph"][0].inLanguage,language==="en"?"en-GB":"de-DE");
      assert.equal(state.schema["@graph"].find(item=>item["@type"]==="SoftwareApplication").name,heading);
      assert.ok(new URL(state.report).searchParams.get("subject").includes(heading));
      assert.ok(state.width<=width+1,`Horizontal overflow at ${width}px`);
      await input("purchaseMode","whole-pack");await submit();
      assert.deepEqual(JSON.parse(await results()),language==="en"?["Whole packs/pallets only","117 m²",pieces,"7–7 pcs","1,344–1,344 pcs"]:["Nur ganze Gebinde/Paletten","117 m²",pieces,"7–7 Stk.","1.344–1.344 Stk."]);
      await input("packSize","");await submit();
      assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`),language==="en"?"Whole-pack/pallet mode requires a positive whole number of tiles per pack.":"Für ganze Gebinde/Paletten muss die Stückzahl je Gebinde eine positive ganze Zahl sein.");
      await input("purchaseMode","pieces");await submit();
      assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`),"");
      assert.equal(JSON.parse(await results()).length,3,"Pack size is optional for individual tiles");
      assert.ok(JSON.parse(await results()).includes(pieces));
      await input("packSize","192");
      for(const [key,invalid,original,message] of [
        ["tilesMin","11","9.2",language==="en"?"The minimum tile requirement must not exceed the maximum.":"Der minimale Ziegelbedarf darf den maximalen nicht überschreiten."],
        ["openings","120","3",language==="en"?"The net roof area must remain positive.":"Die Nettodachfläche muss positiv bleiben."]
      ]) {
        await input(key,invalid);await submit();
        assert.equal(await evaluate(`document.querySelector('.construction-error').textContent.trim()`),message);
        await input(key,original);await submit();
      }
      assert.equal(await values(),confirmed);
      const feedback=await evaluate(`(async()=>{for(let i=0;i<240&&(!window.KB_RETENTION_CTA_LOADED||!document.querySelector('.card-calculator .retention-cta'));i++)await new Promise(requestAnimationFrame);const c=[...document.querySelectorAll('.card-calculator .retention-cta')].at(-1);c.hidden=false;c.querySelector('[data-retention-guide="bookmark"]').setAttribute('hidden','');c.querySelector('[data-retention-action="bookmark"]').setAttribute('aria-expanded','false');c.querySelector('[data-retention-action="bookmark"]').click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return c.querySelector('[data-retention-status]').textContent.trim()})()`);
      assert.equal(feedback,language==="en"?"Follow the instructions to save this page as a bookmark.":"Folge der Anleitung, um diese Seite als Lesezeichen zu speichern.");
      await input("manufacturerConfirmed","no");await submit();
      assert.equal(await values(),before);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1').textContent.trim()`),"Tetőcserép kalkulátor");
    assert.ok((await pending()).includes("Gyártói/rendszeradat ellenőrzése szükséges."));
    assert.equal(await values(),before);
  }
  console.log("Roof tile locale: EN/DE manufacturer guard, individual/whole-pack ordering, optional pack data, rounding, errors, guide, metadata, retention and HU restoration passed at 390/1440px.");
}
module.exports={checkRoofTileLocale};

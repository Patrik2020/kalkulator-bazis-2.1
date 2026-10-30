"use strict";
const assert = require("node:assert/strict");

async function checkTileCalculatorLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');if(!s)throw Error('Missing language selector');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/csempe-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<100&&!document.querySelector('.page-csempe #roomLength');i++)await new Promise(requestAnimationFrame);const values={roomLength:'4',roomWidth:'3',wallHeight:'2.5',wallTileWidth:'30',wallTileHeight:'60',floorTileWidth:'30',floorTileHeight:'30',doorWidth:'90',doorHeight:'210',doorCount:'1'};for(const[id,value]of Object.entries(values)){const el=document.getElementById(id);if(!el)throw Error('Missing tile calculator input: '+id);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))}document.getElementById('wastePercent').value='10';document.getElementById('wastePercent').dispatchEvent(new Event('change',{bubbles:true}));document.getElementById('subtractDoor').checked=true;document.getElementById('subtractDoor').dispatchEvent(new Event('change',{bubbles:true}));for(let i=0;i<120&&!document.querySelector('.tile-box-planner [data-cq="wall-result"]');i++)await new Promise(requestAnimationFrame)})()`);
    const before = JSON.parse(await evaluate(`JSON.stringify([...document.querySelectorAll('.page-csempe input[type=number],.page-csempe select')].map(el=>[el.id,el.value]))`));
    for (const [language, heading, label, wallSummary, doorError] of [
      ["en", "Wall and Floor Tile Calculator", "Room length (m)", "The net area of the four walls is 33.11 m².", "Enter valid door dimensions and a whole-number door count to deduct the area."],
      ["de", "Wand- und Bodenfliesenrechner", "Raumlänge (m)", "Die Nettofläche der vier Wände beträgt 33,11 m².", "Gib gültige Türmaße und eine ganze Anzahl von Türen ein, um die Fläche abzuziehen."]
    ]) {
      await choose(language);
      let result = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('.page-csempe h1')?.textContent.trim(),title:document.title,label:document.querySelector('label[for="roomLength"]')?.textContent.trim(),gross:document.getElementById('grossWallArea')?.textContent.trim(),door:document.getElementById('doorAreaResult')?.textContent.trim(),net:document.getElementById('netWallArea')?.textContent.trim(),wallBuy:document.getElementById('wallPurchaseArea')?.textContent.trim(),wallCount:document.getElementById('wallTileCount')?.textContent.trim(),floor:document.getElementById('floorArea')?.textContent.trim(),floorBuy:document.getElementById('floorPurchaseArea')?.textContent.trim(),floorCount:document.getElementById('floorTileCount')?.textContent.trim(),summary:document.getElementById('summaryText')?.innerText,boxWall:document.querySelector('.tile-box-planner [data-cq="wall-result"]')?.textContent.trim(),boxFloor:document.querySelector('.tile-box-planner [data-cq="floor-result"]')?.textContent.trim(),boxNote:document.querySelector('.tile-box-planner [data-cq="note"]')?.textContent.trim(),report:(()=>{const u=new URL(document.querySelector('.page-csempe a[href^="mailto:"][href*="subject="]').href);return [u.searchParams.get('subject'),u.searchParams.get('body')]})(),values:[...document.querySelectorAll('.page-csempe input[type=number],.page-csempe select')].map(el=>[el.id,el.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading, `${language}: page heading`);
      assert.equal(result.title, language === "en" ? "Tile Calculator – Four Walls, Floor and Door Deduction" : "Fliesenrechner – Vier Wände, Boden und Türabzug", `${language}: page title`);
      assert.equal(result.label, label, `${language}: room length label`);
      assert.equal(result.gross, language === "en" ? "35.00 m²" : "35,00 m²", `${language}: gross wall area`);
      assert.equal(result.door, language === "en" ? "1.89 m²" : "1,89 m²", `${language}: door area`);
      assert.equal(result.net, language === "en" ? "33.11 m²" : "33,11 m²", `${language}: net wall area`);
      assert.equal(result.wallBuy, language === "en" ? "36.42 m²" : "36,42 m²", `${language}: wall tile purchase area`);
      assert.equal(result.wallCount, language === "en" ? "203 tiles" : "203 Fliesen", `${language}: wall tile count`);
      assert.equal(result.floor, language === "en" ? "12.00 m²" : "12,00 m²", `${language}: floor area`);
      assert.equal(result.floorBuy, language === "en" ? "13.20 m²" : "13,20 m²", `${language}: floor purchase area`);
      assert.equal(result.floorCount, language === "en" ? "147 tiles" : "147 Fliesen", `${language}: floor tile count`);
      assert.ok(result.summary.includes(wallSummary), `${language}: dynamic wall summary`);
      assert.equal(result.boxWall, language === "en" ? "27 boxes" : "27 Kartons", `${language}: dynamic wall box count`);
      assert.equal(result.boxFloor, language === "en" ? "11 boxes" : "11 Kartons", `${language}: dynamic floor box count`);
      assert.ok(result.boxNote.includes(language === "en" ? "includes 1 extra box" : "enthält bereits 1 zusätzlichen Karton"), `${language}: dynamic repair note`);
      assert.equal(result.report[0], language === "en" ? "Error report – Tile Calculator" : "Fehlermeldung – Fliesenrechner", `${language}: error-report subject`);
      assert.ok(result.report[1].includes(language === "en" ? "Briefly describe the issue" : "Beschreibe den Fehler kurz"), `${language}: error-report template`);
      assert.deepEqual(result.values, before, `${language}: input values changed`);
      assert.ok(result.width <= width + 1, `tile calculator overflow at ${width}px (${language})`);
      await evaluate(`(()=>{const input=document.getElementById('doorCount');input.value='0';input.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      const error = await evaluate(`document.getElementById('validationMessage')?.textContent.trim()`);
      assert.equal(error, doorError, `${language}: door validation error`);
      await evaluate(`(()=>{const input=document.getElementById('doorCount');input.value='1';input.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('.page-csempe h1')?.textContent.trim()`), "Csempe és járólap kalkulátor", "Hungarian restoration");
  }
  console.log("Tile calculator locale: EN/DE page, live wall/floor areas, tile counts, door errors, repair-box planner, input preservation and responsive widths passed at 390/1440px.");
}
module.exports = { checkTileCalculatorLocale };

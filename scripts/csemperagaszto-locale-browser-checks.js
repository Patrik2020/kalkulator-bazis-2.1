"use strict";
const assert = require("node:assert/strict");

async function checkAdhesiveLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=${JSON.stringify(language)};s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/csemperagaszto-kalkulator.html");
    await evaluate(`(async()=>{for(let i=0;i<100&&!document.getElementById('adhesiveResult');i++)await new Promise(requestAnimationFrame)})()`);
    const initial = await evaluate(`JSON.stringify([...document.querySelectorAll('[id^="adhesive"]:is(input)')].map(el=>[el.id,el.value]))`);
    for (const [language, heading, bags, error] of [
      ["en", "Tile Adhesive Calculator", "4 bags", "Area to tile: enter a value greater than zero."],
      ["de", "Fliesenkleber-Rechner", "4 Säcke", "Zu fliesende Fläche: Gib einen Wert größer als null ein."]
    ]) {
      await choose(language);
      const result = JSON.parse(await evaluate(`JSON.stringify({title:document.title,heading:document.querySelector('main h1')?.textContent.trim(),label:document.querySelector('label[for="adhesiveConsumption"]')?.textContent.trim(),result:document.getElementById('adhesiveResult')?.innerText,guide:document.querySelector('.calculator-guide')?.innerText,faq:document.querySelector('.faq-list')?.innerText,metadata:document.querySelector('meta[name="description"]')?.content,structured:JSON.parse(document.getElementById('kb-structured-data').textContent),report:new URL(document.querySelector('main a[href^="mailto:"]').href).searchParams.get('subject'),inputs:[...document.querySelectorAll('[id^="adhesive"]:is(input)')].map(el=>[el.id,el.value]),width:document.documentElement.scrollWidth})`));
      assert.equal(result.heading, heading, `${language}: heading`);
      assert.ok(result.title.includes(heading), `${language}: title`);
      assert.ok(result.label.includes(language === "en" ? "Manufacturer" : "Hersteller"), `${language}: input label`);
      assert.ok(result.result.includes(bags), `${language}: calculated bags`);
      assert.ok(result.result.includes("80 kg") && result.result.includes("88 kg"), `${language}: calculated mass`);
      assert.ok(result.guide.includes(language === "en" ? "technical data sheet" : "technischen Datenblatt"), `${language}: guide`);
      assert.ok(result.faq.includes(language === "en" ? "both surfaces" : "beidseitige"), `${language}: FAQ`);
      assert.ok(result.metadata.includes(language === "en" ? "tile adhesive" : "Fliesenkleberbedarf"), `${language}: metadata`);
      assert.equal(result.structured["@graph"][0].inLanguage, language === "en" ? "en-US" : "de-DE", `${language}: schema language`);
      assert.ok(result.report.includes(language === "en" ? "Error report" : "Fehlermeldung"), `${language}: error email`);
      assert.equal(JSON.stringify(result.inputs), initial, `${language}: input preservation`);
      assert.ok(result.width <= width + 1, `${language}: overflow at ${width}px`);
      await evaluate(`(()=>{const el=document.getElementById('adhesiveArea');el.value='0';el.dispatchEvent(new Event('input',{bubbles:true}))})()`);
      assert.equal(await evaluate(`document.getElementById('adhesiveResult').textContent.trim()`), error, `${language}: validation`);
      await evaluate(`(()=>{const el=document.getElementById('adhesiveArea');el.value='20';el.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    }
    await choose("hu");
    assert.equal(await evaluate(`document.querySelector('main h1')?.textContent.trim()`), "Csemperagasztó kalkulátor", "HU restoration");
  }
  console.log("Tile adhesive locale: EN/DE copy, metadata, dynamic bags and error, HU reset and responsive widths passed.");
}
module.exports = { checkAdhesiveLocale };

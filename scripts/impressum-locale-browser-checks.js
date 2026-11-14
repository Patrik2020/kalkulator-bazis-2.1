"use strict";
const assert = require("node:assert/strict");

async function checkImpressumLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate(`(async()=>{const select=document.getElementById('kbInternalLanguage');if(!select)throw Error('Missing language selector');select.value=${JSON.stringify(language)};select.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/impresszum");
    const originalLinks = await evaluate(`JSON.stringify([...document.querySelectorAll('main a')].map(link=>link.getAttribute('href')))`);
    for (const language of ["en", "de"]) {
      await choose(language);
      const state = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),sections:[...document.querySelectorAll('main h2')].map(node=>node.textContent.trim()),copy:document.querySelector('main').textContent.replace(/\\s+/g,' ').trim(),title:document.title,description:document.querySelector('meta[name="description"]').content,links:[...document.querySelectorAll('main a')].map(link=>link.getAttribute('href')),width:document.documentElement.scrollWidth})`));
      assert.equal(state.heading, language === "en" ? "Legal notice" : "Impressum");
      assert.ok(state.sections.includes(language === "en" ? "Hosting provider" : "Hostinganbieter"));
      assert.ok(state.sections.includes(language === "en" ? "Contact" : "Kontakt"));
      assert.ok(state.copy.includes(language === "en" ? "Who operates or is responsible for the website?" : "Wer betreibt die Website oder ist für sie verantwortlich?"));
      assert.ok(state.copy.includes(language === "en" ? "Last updated: 13 August 2026" : "Zuletzt aktualisiert: 13. August 2026"));
      assert.ok(state.title.startsWith(language === "en" ? "Legal Notice" : "Impressum"));
      assert.ok(state.description.includes(language === "en" ? "website operator details" : "Websitebetreiber"));
      assert.equal(JSON.stringify(state.links), originalLinks, "Legal and contact links must not change with language");
      assert.ok(state.width <= width + 1, `Horizontal overflow at ${width}px`);
    }
    await choose("hu");
    const restored = JSON.parse(await evaluate(`JSON.stringify({heading:document.querySelector('main h1').textContent.trim(),updated:[...document.querySelectorAll('main p')].find(node=>node.textContent.includes('Utolsó frissítés'))?.textContent.trim(),title:document.title,links:[...document.querySelectorAll('main a')].map(link=>link.getAttribute('href'))})`));
    assert.equal(restored.heading, "Impresszum");
    assert.equal(restored.updated, "Utolsó frissítés: 2026.08.13.");
    assert.equal(restored.title, "Impresszum | Kalkulátor Bázis");
    assert.equal(JSON.stringify(restored.links), originalLinks);
  }
  console.log("Impressum locale: EN/DE legal copy, metadata, immutable links, responsive layout and HU restoration passed at 390/1440px.");
}
module.exports = { checkImpressumLocale };

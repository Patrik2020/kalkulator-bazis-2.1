"use strict";
const assert = require("node:assert/strict");

async function checkMultifunctionLocale({ navigate, evaluate, setViewport }) {
  const choose = language => evaluate("(async()=>{const s=document.getElementById('kbInternalLanguage');s.value=" + JSON.stringify(language) + ";s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()");
  const setDisplay = value => evaluate("(async()=>{const d=document.querySelector('[data-calc-display]');d.value=" + JSON.stringify(value) + ";d.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(requestAnimationFrame)})()");
  const click = selector => evaluate("(async()=>{document.querySelector(" + JSON.stringify(selector) + ").click();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)})()");
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/kalkulatorok/multifunkcios-szamologep.html");
    await setDisplay("12+3");
    const before = await evaluate("document.querySelector('[data-calc-display]').value");
    for (const [language, heading, guide, faq, quality] of [
      ["en", "Multi-function Calculator", "Step-by-step guide", "Why am I getting an error message?", "Calculator checklist"],
      ["de", "Multifunktionsrechner", "Schritt-für-Schritt-Anleitung", "Warum erhalte ich eine Fehlermeldung?", "Rechner-Prüfliste"]
    ]) {
      await setDisplay(before);
      await choose(language);
      const state = JSON.parse(await evaluate("JSON.stringify({heading:document.querySelector('main h1')?.textContent.trim(),guide:document.querySelector('.adsense-content')?.innerText,faq:document.querySelector('.faq-list')?.innerText,quality:document.querySelector('.site-quality-final')?.innerText,title:document.title,meta:document.querySelector('meta[name=description]')?.content,schema:JSON.parse(document.getElementById('kb-structured-data').textContent),display:document.querySelector('[data-calc-display]').value,mode:[...document.querySelectorAll('[data-action=mode]')].find(x=>x.classList.contains('is-active'))?.dataset.mode,width:document.documentElement.scrollWidth})"));
      assert.equal(state.heading, heading);
      assert.ok(state.guide.includes(guide), state.guide);
      assert.ok(state.faq.includes(faq), state.faq);
      assert.ok(state.quality.includes(quality), state.quality);
      assert.ok(state.title.includes(language === "en" ? "Scientific Calculator" : "Wissenschaftlicher Rechner"));
      assert.ok(state.meta.includes(language === "en" ? "Free multi-function" : "Kostenloser Multifunktions"));
      assert.equal(state.schema["@graph"][0].inLanguage, language === "en" ? "en-GB" : "de-DE");
      assert.equal(state.display, before);
      assert.equal(state.mode, "deg");
      assert.ok(state.width <= width + 1, "multifunction overflow at " + width + "px (" + language + ")");

      await click('[data-action="mode"][data-mode="rad"]');
      assert.equal(await evaluate("document.querySelector('[data-action=mode][data-mode=rad]').getAttribute('aria-pressed')"), "true");
      await setDisplay("sin(π/2)");
      await click('[data-action="equals"]');
      assert.equal(await evaluate("document.querySelector('[data-calc-display]').value"), "1");
      assert.ok((await evaluate("document.querySelector('[data-calc-history]').innerText")).includes("sin(π/2) = 1"));

      await setDisplay("1/0");
      await click('[data-action="equals"]');
      assert.equal(await evaluate("document.querySelector('[data-calc-display]').value"), language === "en" ? "Error" : "Fehler");
      assert.equal(await evaluate("document.querySelector('[data-calc-status]').textContent.trim()"), language === "en" ? "The expression could not be calculated. Check the input and parentheses." : "Der Ausdruck konnte nicht berechnet werden. Prüfe die Eingabe und die Klammern.");
      await click('button[data-value="7"]');
      assert.equal(await evaluate("document.querySelector('[data-calc-display]').value"), "7");
      await click('[data-action="mode"][data-mode="deg"]');
    }
    await choose("hu");
    assert.equal(await evaluate("document.querySelector('main h1').textContent.trim()"), "Multifunkciós számológép");
    assert.equal(await evaluate("document.querySelector('[data-action=mode][data-mode=deg]').textContent.trim()"), "Fok");
  }
  console.log("Multifunction locale: EN/DE content, calculations, errors, history, metadata, state and HU restoration passed.");
}

module.exports = { checkMultifunctionLocale };

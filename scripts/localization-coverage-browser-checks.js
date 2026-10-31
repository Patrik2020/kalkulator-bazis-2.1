/* global document, NodeFilter */
"use strict";
const assert = require("node:assert/strict");
const { detailPages } = require("./localization-manifest");
const { checkTileCalculatorLocale } = require("./csempe-locale-browser-checks");

// Deliberate language-neutral names/units only. Do not whitelist sentences or
// detect Hungarian only by accents: "Minimum" can be valid in all languages.
const neutral = new Set(["Kalkulátor Bázis", "Ft", "HUF", "A", "B", "C", "kg", "g", "l", "ml", "db", "EU"]);
function requiresTranslation(text) {
  // A converted amount with ISO currency codes is meaningful in every locale;
  // decimal and grouping separators may also be identical in HU and DE.
  if (/^[\d\s.,+−-]+ [A-Z]{3} = [\d\s.,+−-]+ [A-Z]{3}$/u.test(text)) return false;
  return /\p{L}/u.test(text) && !neutral.has(text) && !/^[\d\s.,+−–×÷/%():=²³-]+(?:Ft|HUF|kg|g|ml|l|db)?$/u.test(text);
}

function collectMainCopy() {
  const main = document.querySelector("main");
  if (!main) throw new Error("Missing main content");
  const skip = "script,style,textarea,pre,code,[translate=no],[contenteditable]";
  const values = [];
  const add = value => { const text = value.replace(/\s+/gu, " ").trim(); if (text) values.push(text); };
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    if (!walker.currentNode.parentElement.closest(skip)) add(walker.currentNode.nodeValue);
  }
  main.querySelectorAll("[aria-label],[placeholder],[title]").forEach(element => {
    if (element.closest(skip)) return;
    for (const name of ["aria-label", "placeholder", "title"]) {
      if (element.hasAttribute(name)) add(element.getAttribute(name));
    }
  });
  return [...new Set(values)].sort();
}

async function checkLocalizationCoverage({ navigate, evaluate, setViewport }) {
  await setViewport(390, 1000);
  const failures = [];
  const choose = language => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    select.value = ${JSON.stringify(language)};
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  })()`);
  for (const page of detailPages) {
    await navigate("/" + page.path.replace(/\.html$/, ""));
    if (page.key === "deviza-atvalto-kalkulator") {
      // The live-rate widget replaces its loading copy asynchronously. Compare
      // language states only after the initial fetch has settled.
      await evaluate(`(async()=>{await window.KB_CURRENCY_CONVERTER.ready;await new Promise(requestAnimationFrame)})()`);
    }
    await choose("hu");
    const original = await evaluate(`(${collectMainCopy.toString()})()`);
    assert.ok(original.length > 10, `${page.path}: empty source copy`);
    const api = require("../" + page.module);
    for (const language of ["en", "de"]) {
      await choose(language);
      const rendered = new Set(await evaluate(`(${collectMainCopy.toString()})()`));
      const missing = original.filter(text => requiresTranslation(text) && rendered.has(text) &&
        api.translate(page.key, text, language) !== text);
      if (missing.length) failures.push({ path: page.path, language, missing });
    }
    await choose("hu");
    assert.deepEqual(await evaluate(`(${collectMainCopy.toString()})()`), original, `${page.path}: HU restoration`);
  }
  assert.deepEqual(failures, [], "Untranslated main-content text or accessible attributes: " + JSON.stringify(failures));
  console.log(`Localization coverage: ${detailPages.length} detail pages, EN/DE copy and HU restoration passed.`);
  await checkTileCalculatorLocale({ navigate, evaluate, setViewport });
  await require("./csemperagaszto-locale-browser-checks").checkAdhesiveLocale({ navigate, evaluate, setViewport });
  await require("./derek-csipo-locale-browser-checks").checkWaistHipLocale({ navigate, evaluate, setViewport });
  await require("./deviza-locale-browser-checks").checkCurrencyLocale({ navigate, evaluate, setViewport });
  await require("./one-rep-max-locale-browser-checks").checkOneRepMaxLocale({ navigate, evaluate, setViewport });
  await require("./ev-charge-locale-browser-checks").checkEvChargeLocale({ navigate, evaluate, setViewport });
}
module.exports = { checkLocalizationCoverage, requiresTranslation, collectMainCopy };

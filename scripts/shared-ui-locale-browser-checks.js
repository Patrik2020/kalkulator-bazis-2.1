"use strict";
const assert = require("node:assert/strict");

async function checkSharedLocales({ navigate, evaluate, setViewport }) {
  const settle = "await new Promise(requestAnimationFrame);";
  const choose = (language) => evaluate(`(async () => {
    const select = document.getElementById('kbInternalLanguage');
    if (select) { select.value = ${JSON.stringify(language)}; select.dispatchEvent(new Event('change', {bubbles:true})); }
    else document.querySelector('#langPop [data-lang=${language}]').click();
    ${settle}
  })()`);
  const read = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent.replace(/\\s+/g, ' ').trim()`);
  for (const width of [390, 1440]) {
    await setViewport(width, 1000);
    await navigate("/");
    // Home help formerly replaced whole labels, destroying their textareas.
    assert.equal(await evaluate("document.querySelectorAll('#kbHelpPanel textarea').length"), 5);
    await evaluate("document.querySelector('#kbHelpPanel textarea').value = 'Saját szöveg / My text / Mein Text'");
    await choose("en");
    assert.equal(await read(".kb-help-links a"), "Browse all calculators");
    await choose("de");
    assert.equal(await evaluate("document.querySelector('#kbHelpPanel textarea').value"), "Saját szöveg / My text / Mein Text");
    assert.equal(await evaluate("document.querySelectorAll('#kbHelpPanel textarea').length"), 5);
    assert.equal(await read(".kb-help-links a"), "Alle Rechner öffnen");

    await navigate("/kalkulatorok/atlag-kalkulator");
    assert.equal(await read("#footer .footer-col h2"), "Rechner");
    assert.equal(await evaluate("document.querySelector('#menu').getAttribute('aria-label')"), "Hauptnavigation");
    assert.equal(await read(".kb-page-meta strong"), "Datensparsame Berechnungen");
    await evaluate(`(async () => { document.querySelector('.theme-toggle').click(); ${settle} })()`);
    assert.match(await evaluate("document.querySelector('.theme-toggle').getAttribute('aria-label')"), /^Zum (hellen|dunklen) Modus wechseln$/);
    if (width < 690) {
      await evaluate(`(async () => { document.getElementById('menuToggle').click(); ${settle} })()`);
      assert.equal(await evaluate("document.getElementById('menuToggle').getAttribute('aria-label')"), "Menü schließen");
      await evaluate("document.getElementById('menuToggle').click()");
    }

    await choose("en");
    assert.equal(await read("#footer .footer-trust-list li"), "No registration required");
    assert.equal(await evaluate("document.querySelector('.header-search').getAttribute('aria-label')"), "Find a calculator");
    assert.equal(await read(".kb-page-meta strong"), "Data-minimising calculations");
    await evaluate(`(async () => { document.querySelector('[data-cookie-settings]').click(); ${settle} })()`);
    assert.equal(await read("#cookieModalTitle"), "Cookie settings");
    assert.equal(await read("#cookieSaveSettings"), "Save settings");
    const beforeConsent = await evaluate("localStorage.getItem('kbCookieConsent')");
    await choose("de");
    assert.equal(await read("#cookieModalTitle"), "Cookie-Einstellungen");
    assert.equal(await read("#cookieNecessaryOnly"), "Nur notwendige Cookies");
    assert.equal(await evaluate("localStorage.getItem('kbCookieConsent')"), beforeConsent);
    await evaluate(`(async () => { document.getElementById('cookieNecessaryOnly').click(); ${settle} })()`);
    assert.equal(await read("#cookieConsentToast"), "Nur notwendige Funktionen bleiben aktiv.");
    assert.deepEqual(await evaluate("JSON.parse(localStorage.getItem('kbCookieConsent')).categories"), {necessary:true, analytics:false, ads:false});
    await choose("en");
    assert.equal(await read("#cookieConsentToast"), "Only essential functionality remains active.");

    await evaluate(`(async () => {
      document.querySelector('.kb-help-launcher').click();
      document.querySelector('[data-open-view=bug]').click();
      document.querySelector('[data-view=bug] textarea').value='Saját szöveg';
      ${settle}
    })()`);
    assert.equal(await read("#kbHelpTitle"), "How can we help?");
    await choose("de");
    assert.equal(await evaluate("document.querySelector('[data-view=bug] textarea').value"), "Saját szöveg");
    assert.equal(await evaluate("document.querySelector('.kb-help-close').getAttribute('aria-label')"), "Schließen");
    // Intercept the support endpoint: no test message leaves this browser.
    await evaluate(`(async () => {
      const originalFetch = window.fetch;
      window.fetch = (url, options) => String(url).startsWith('https://formspree.io/')
        ? Promise.resolve({ok:false,json:async()=>({})}) : originalFetch(url, options);
      const form = document.querySelector('[data-view=bug] form');
      form.querySelector('[name=consent]').checked=true;
      form.requestSubmit();
      ${settle}
    })()`);
    assert.match(await read('[data-view=bug] [data-form-status]'), /^Die Nachricht konnte nicht gesendet werden/);
    await choose("hu");
    assert.equal(await read("#footer .footer-trust-list li"), "Regisztráció nélkül használható");
    assert.equal(await read("#cookieModalTitle"), "Sütibeállítások");
    assert.equal(await read("#kbHelpTitle"), "Miben segíthetünk?");
    assert.equal(await evaluate("document.querySelector('[data-view=bug] textarea').value"), "Saját szöveg");
    assert.equal(await evaluate("document.documentElement.lang"), "hu");
    await evaluate("document.querySelector('.kb-help-close').click()");

    // Session switching still works if the browser rejects persistent storage.
    await evaluate("Storage.prototype.setItem = () => { throw new Error('Storage disabled for this test'); }");
    await choose("en");
    assert.equal(await read("#footer .footer-trust-list li"), "No registration required");
    assert.equal(await evaluate("window.KB_SITE_LANGUAGE.get()"), "en");
    await navigate("/");
    await choose("hu");
  }
  console.log("Browser QA: shared HU/EN/DE navigation, footer, consent, help and input preservation passed at 390/1440px");
}
module.exports = { checkSharedLocales };

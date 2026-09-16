const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const cookiePath = path.join(root, "js", "cookie.js");
const siteUiPath = path.join(root, "js", "site-ui.js");

const replaceOnce = (source, pattern, replacement, label) => {
  if (!pattern.test(source)) throw new Error(`Nem található a várt ${label} minta.`);
  return source.replace(pattern, replacement);
};

let cookie = fs.readFileSync(cookiePath, "utf8");

if (!cookie.includes("KB_ADSENSE_ELIGIBILITY_V2")) {
  const anchor = '  const adsenseClient = "ca-pub-2639795157074812";';
  const eligibility = `${anchor}

  // KB_ADSENSE_ELIGIBILITY_V2
  // Publisher ads are intentionally limited to pages with clear standalone value.
  // Privacy & Messaging / TCF remains the authority for AdSense consent in regions
  // where Google requires a certified CMP.
  const adsenseEligibleExact = new Set([
    "aktualis",
    "dontesek",
    "osszehasonlitas",
    "elethelyzetek",
    "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag",
  ]);
  const adsenseEligiblePrefixes = ["kalkulatorok/", "aktualis/", "landing-pages/elethelyzetek/"];
  const adsenseExcludedExact = new Set([
    "404", "kapcsolat", "impresszum", "adatvedelem", "cookie",
    "jogi-nyilatkozat", "felhasznalasi-feltetelek", "rolunk",
    "atlathatosag-es-minoseg", "miert-bizhatsz-bennunk", "szamitasi-modszertan",
  ]);
  const adsenseExcludedPrefixes = ["landing-pages/wise/"];
  const normalizedPublisherPath = () =>
    decodeURIComponent(window.location.pathname || "/")
      .replace(/\\\\/g, "/")
      .replace(/^\\/+|\\/+$/g, "")
      .replace(/\\.html$/i, "")
      .toLowerCase();
  const isAdSenseEligiblePath = () => {
    const current = normalizedPublisherPath();
    if (!current || adsenseExcludedExact.has(current)) return false;
    if (adsenseExcludedPrefixes.some((prefix) => current.startsWith(prefix))) return false;
    return adsenseEligibleExact.has(current) || adsenseEligiblePrefixes.some((prefix) => current.startsWith(prefix));
  };
  window.KB_ADSENSE_ELIGIBLE = isAdSenseEligiblePath();
  window.KB_ADSENSE_CAN_REQUEST = false;
  window.KB_ADSENSE_TCF_REQUIRED = true;`;
  cookie = cookie.replace(anchor, eligibility);

  cookie = cookie.replace(
    "  window.adsbygoogle.requestNonPersonalizedAds = 1;\n",
    ""
  );

  cookie = cookie.replace(
    "            Az analitikai és hirdetési célú technológiákat csak a hozzájárulásod\n            alapján kapcsoljuk be. A választásodat később bármikor módosíthatod.",
    "            Az analitikát és a partneri külső tartalmakat csak a hozzájárulásod alapján kapcsoljuk be.\n            A Google AdSense európai hozzájárulását külön, Google-minősített TCF üzenet kezeli, ahol ez szükséges."
  );
  cookie = cookie.replace("<h3>Hirdetés és marketing</h3>", "<h3>Partneri tartalom és marketing</h3>");
  cookie = cookie.replace(
    "              Ide tartozik a Google AdSense hirdetésbetöltés és a partneri\n              bannerek külső képeinek betöltése.",
    "              Ez a beállítás a partneri bannerek és más külső marketingtartalmak betöltését kezeli.\n              A Google AdSense hozzájárulását az arra jogosult régiókban a Google TCF/CMP üzenete kezeli."
  );
}

const syncPattern = /  const syncAdSense = \(\) => \{[\s\S]*?\n  \};\n\n  const persistConsent/;
const syncReplacement = `  const setAdSenseRequestReady = () => {
    if (!window.KB_ADSENSE_ELIGIBLE || window.KB_ADSENSE_CAN_REQUEST) return;
    const queue = (window.adsbygoogle = window.adsbygoogle || []);
    window.KB_ADSENSE_CAN_REQUEST = true;
    queue.pauseAdRequests = 0;
    document.dispatchEvent(new CustomEvent("kb:adsense-ready"));
  };

  let tcfListenerRegistered = false;
  let tcfPollTimer = null;
  let tcfPollCount = 0;

  const registerTcfListener = () => {
    if (tcfListenerRegistered || typeof window.__tcfapi !== "function") return false;
    tcfListenerRegistered = true;
    window.__tcfapi("addEventListener", 2, (tcData, success) => {
      if (!success || !tcData) return;
      const settled = ["tcloaded", "useractioncomplete"].includes(tcData.eventStatus);
      if (tcData.gdprApplies === false || settled) {
        setAdSenseRequestReady();
      }
    });
    return true;
  };

  const waitForCertifiedCmp = () => {
    if (!window.KB_ADSENSE_ELIGIBLE || window.KB_ADSENSE_CAN_REQUEST) return;
    if (registerTcfListener()) {
      if (tcfPollTimer) window.clearInterval(tcfPollTimer);
      tcfPollTimer = null;
      return;
    }
    if (tcfPollTimer) return;
    tcfPollTimer = window.setInterval(() => {
      tcfPollCount += 1;
      if (registerTcfListener() || tcfPollCount >= 48) {
        window.clearInterval(tcfPollTimer);
        tcfPollTimer = null;
      }
    }, 250);
  };

  const syncAdSense = () => {
    const queue = (window.adsbygoogle = window.adsbygoogle || []);
    queue.pauseAdRequests = 1;

    if (!window.KB_ADSENSE_ELIGIBLE) {
      window.KB_ADSENSE_CAN_REQUEST = false;
      return;
    }

    const existing = document.querySelector(
      'script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
    );

    if (existing) {
      waitForCertifiedCmp();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.kbConsentManaged = "adsense-cmp-bootstrap";
    script.src = \`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=\${adsenseClient}\`;
    script.addEventListener("load", waitForCertifiedCmp, { once: true });
    document.head.appendChild(script);
    waitForCertifiedCmp();
  };

  const persistConsent`;

cookie = replaceOnce(cookie, syncPattern, syncReplacement, "syncAdSense");
fs.writeFileSync(cookiePath, cookie, "utf8");

let siteUi = fs.readFileSync(siteUiPath, "utf8");
if (!siteUi.includes("KB_ADSENSE_SLOT_GUARD_V2")) {
  siteUi = siteUi.replace(
    '  const renderAdSlot = (target) => {\n    if (!target || !data.adsense) return;',
    `  const renderAdSlot = (target) => {\n    // KB_ADSENSE_SLOT_GUARD_V2\n    if (!target || !data.adsense) return;\n    if (window.KB_ADSENSE_ELIGIBLE === false) {\n      target.innerHTML = "";\n      target.dataset.adState = "excluded";\n      return;\n    }\n    if (window.KB_ADSENSE_CAN_REQUEST !== true) {\n      target.innerHTML = "";\n      target.dataset.adState = "waiting-consent";\n      return;\n    }`
  );

  siteUi = siteUi.replace(
    `    if (!hasConsent("ads")) {\n      target.innerHTML = "";\n      target.dataset.adState = "hidden";\n      return;\n    }`,
    `    if (window.KB_ADSENSE_CAN_REQUEST !== true) {\n      target.innerHTML = "";\n      target.dataset.adState = "waiting-consent";\n      return;\n    }`
  );

  siteUi = siteUi.replace(
    `  const loadAdSenseScript = (callback) => {\n    if (!hasConsent("ads")) return;`,
    `  const loadAdSenseScript = (callback) => {\n    if (window.KB_ADSENSE_ELIGIBLE === false || window.KB_ADSENSE_CAN_REQUEST !== true) return;`
  );

  siteUi = siteUi.replace(
    '    document.addEventListener("kb:consent-updated", refreshConsentControlledUi);',
    '    document.addEventListener("kb:consent-updated", refreshConsentControlledUi);\n    document.addEventListener("kb:adsense-ready", refreshConsentControlledUi);'
  );
}
fs.writeFileSync(siteUiPath, siteUi, "utf8");

console.log("Applied AdSense allowlist and certified-CMP readiness gates.");

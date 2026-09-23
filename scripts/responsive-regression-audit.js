"use strict";

const fs = require("fs");
const path = require("path");
const {
  calculatorSmokeViewports,
  fullSiteViewports,
  requiredResponsiveWidths,
} = require("./responsive-viewports");

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const issues = [];
const passed = [];
const expect = (condition, message) => (condition ? passed : issues).push(message);

const index = read("index.html");
const indexCss = read("css/pages/index.css");
const homeCss = read("css/pages/home-redesign-final-2.css");
const homeHeaderCss = read("css/pages/home-redesign-final-1.css");
const helpCss = read("css/components/help-widget.css");
const cookieCss = read("css/components/cookie.css");
const calculatorCss = read("css/pages/calculator-page-v2.css");
const cookieScript = read("js/cookie.js");
const browserQa = read("scripts/browser-qa.js");
const calculatorSmoke = read("scripts/all-calculator-browser-smoke.js");

const fullWidths = new Set(fullSiteViewports.map((viewport) => viewport.width));
expect(
  requiredResponsiveWidths.every((width) => fullWidths.has(width)),
  `A teljes böngészős mátrix tartalmazza a kötelező szélességeket: ${requiredResponsiveWidths.join(", ")}.`
);
expect(
  [320, 360, 375, 390, 430].every((width) =>
    fullSiteViewports.some((viewport) => viewport.width === width && viewport.height > viewport.width && viewport.mobile)
  ),
  "A telefonos portré mátrix 320–430 px között teljes."
);
expect(
  fullSiteViewports.some((viewport) => viewport.mobile && viewport.width > viewport.height),
  "A teljes böngészős mátrix tartalmaz fekvő telefonos nézetet."
);
expect(
  calculatorSmokeViewports.some((viewport) => viewport.width === 320) &&
    calculatorSmokeViewports.some((viewport) => viewport.mobile && viewport.width > viewport.height) &&
    calculatorSmokeViewports.some((viewport) => viewport.width === 768) &&
    calculatorSmokeViewports.some((viewport) => viewport.width === 1920),
  "Az összes kalkulátor smoke teszt kis telefont, fekvő telefont, tabletet és nagy asztali nézetet is lefed."
);
expect(
  indexCss.includes("max-height: calc(100dvh - 40px)") &&
    indexCss.includes("max-height: calc(100dvh - 24px)") &&
    indexCss.includes("overscroll-behavior: contain"),
  "A fejlesztési modal rövid és keskeny viewporton is határolt és görgethető."
);
expect(
  homeHeaderCss.includes("height:44px") &&
    homeHeaderCss.includes(".icon-btn,.menu-btn{width:44px") &&
    homeHeaderCss.includes(".season-btn{min-width:44px}"),
  "A főoldali fejléc elsődleges vezérlői legalább 44×44 px-esek."
);
expect(
    homeCss.includes("@media(max-width:680px){.kb-header.container{gap:10px") &&
    homeCss.includes(".kb-header .logo-text{display:none}") &&
    homeCss.includes('.lang-btn>span[aria-hidden="true"]{display:none}') &&
    homeCss.includes("@media(max-width:375px){.season-btn{display:none}}"),
  "A főoldali fejléc a legkisebb telefonokon bizonyítottan kompakt állapotra vált."
);
expect(
  homeCss.includes(".salary-direction-btn,.lang-pop button,.season-options button,.season-auto{min-height:44px}") &&
    helpCss.includes("min-height: 44px !important") &&
    cookieCss.includes("min-height: 44px") &&
    calculatorCss.includes(".kb-page-meta__links a") && calculatorCss.includes("min-height: 44px"),
  "A vizsgált főoldali, súgó-, süti- és kalkulátor-meta vezérlők elérik a 44 px-es érintési méretet."
);
expect(
  index.includes("kb:development-notice-dismissed") &&
    cookieScript.includes('"kb:development-notice-dismissed"') &&
    cookieScript.includes('document.getElementById("developmentNotice")'),
  "A fejlesztési modal és az első sütimodal egymás után, nem egyszerre nyílik meg."
);
expect(
  browserQa.includes('require("./responsive-viewports")') &&
    browserQa.includes("tapTargetOffenders") &&
    browserQa.includes("developmentNoticeFailures") &&
    browserQa.includes("searchFailures") &&
    browserQa.includes('Input.dispatchKeyEvent') &&
    browserQa.includes('Input.dispatchMouseEvent') &&
    browserQa.includes("development-notice-phone-landscape.png"),
  "A teljes böngészős QA központi viewportmátrixot, tap targetet, keresőnavigációt és modal-képernyőképet ellenőriz."
);
expect(
  calculatorSmoke.includes('require("./responsive-viewports")') &&
    calculatorSmoke.includes("calculatorSmokeViewports"),
  "A teljes kalkulátor smoke teszt ugyanazt a központi viewport-adatforrást használja."
);

console.log(JSON.stringify({ checks: passed.length + issues.length, passed: passed.length, issues, pass: passed }, null, 2));
if (issues.length) process.exitCode = 1;

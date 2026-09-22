const fs = require("fs");
const path = require("path");

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const issues = [];
const pass = [];

const expect = (condition, message) => {
  if (condition) pass.push(message);
  else issues.push(message);
};

const utils = read("js/utils.js");
const helpWidget = read("js/help-widget.js");
const homeIa = read("js/home-ia.js");
const homeCurrent = read("js/home-current.js");
const homeCore = read("js/home-redesign-core.js");
const homeHelp = read("js/home-redesign-help.js");
const theme = read("js/theme.js");
const accessibility = read("js/site-accessibility.js");
const staticFallbacks = read("js/static-first-fallbacks.js");
const retention = read("js/retention-cta.js");
const siteUi = read("js/site-ui.js");
const homeCss = read("css/pages/home-redesign-final-2.css");

expect(
  !helpWidget.includes("home-current.js"),
  "A help widget nem indít második főoldali bootstrapot."
);
expect(
  helpWidget.includes('document.getElementById("kbHelpLauncher")') &&
    helpWidget.includes("css/components/help-widget.css") &&
    helpWidget.includes("KB_HELP_WIDGET_LOADED"),
  "A közös help widget nem duplikálja a főoldali példányt, és saját stílusát egyszer tölti be."
);
expect(
  theme.includes('script[data-kb-home-ia]') &&
    homeIa.includes("home-current.js") &&
    homeIa.includes("KB_HOME_IA_LOADED") &&
    homeIa.includes('script[data-kb-home-current]') &&
    !staticFallbacks.includes("home-ia.js"),
  "A főoldali bootstrap egyetlen, őrzött belépési ponton maradt."
);
expect(
  homeCurrent.includes("KB_HOME_CURRENT_LOADING") && homeCurrent.includes("KB_HOME_CURRENT_READY"),
  "A főoldali inicializálás idempotens állapotjelzőket használ."
);
expect(
  !homeCurrent.includes('localStorage.removeItem("kalkulatorbazis-theme")') &&
    homeCore.includes("localStorage.setItem(themeStorageKey,next)") &&
    theme.includes('document.getElementById("themeBtn")'),
  "A főoldali témaválasztás egyetlen vezérlővel, tartós beállítással működik."
);
expect(
    homeHelp.includes("panel.inert=true") &&
    homeHelp.includes("aria-hidden") &&
    homeHelp.includes("lastFocus") &&
    homeHelp.includes("event.key!=='Tab'"),
  "A főoldali súgó dialógus fókuszcsapdát, állapotjelzést és fókusz-visszaadást használ."
);
expect(
  /if \(!isHomePage\)\s*\{\s*loadComponent\("header"[\s\S]*loadComponent\("footer"/.test(utils),
  "A legacy header/footer loader kihagyja a főoldalt."
);
expect(
  !accessibility.includes("loadExpansionDataModule") &&
    !accessibility.includes('data-calculator-expansion="01"'),
  "Az accessibility modul nem versenyez a központi expansion loaderrel."
);
expect(
  utils.includes("expansion-batch-01-data.js") && utils.includes("expansion-batch-05-data.js"),
  "Az expansion 01–05 lánc a közös loaderben maradt."
);
expect(
  staticFallbacks.includes("prepareTransientStaticEnhancements") &&
    !staticFallbacks.includes("removeTransientStaticEnhancements"),
  "A statikus retention fallback nem tűnik el a runtime init előtt."
);
expect(
  retention.includes('document.querySelectorAll("[data-retention-cta]")') &&
    retention.includes("if (canonical) return canonical"),
  "A retention runtime a materializált komponenst köti be újrafetch helyett."
);
expect(
  siteUi.includes('document.addEventListener("kb:site-data-loaded", refreshDataDrivenUi)') &&
    siteUi.includes('document.addEventListener("kb:site-data-expanded", refreshDataDrivenUi)'),
  "A kategória- és kapcsolódó UI újrarenderel a teljes adatbetöltés után."
);
expect(
  homeCss.includes("@media(max-width:1365px)") && homeCss.includes(".nav{display:none!important}"),
  "A problémás 1363 px-es szélességen a fejléc kompakt menüre vált."
);

console.log(JSON.stringify({ checks: pass.length + issues.length, passed: pass.length, issues, pass }, null, 2));
if (issues.length) process.exitCode = 1;

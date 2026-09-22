const fs = require("fs");
const path = require("path");

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const issues = [];
const passed = [];

const expect = (condition, message) => {
  if (condition) passed.push(message);
  else issues.push(message);
};

const index = read("index.html");
const header = read("fragments/home-redesign-v17-header.inc");
const footer = read("fragments/home-redesign-v17-footer.inc");
const core = read("js/home-redesign-core.js");
const css = read("css/pages/index.css");
const materializer = read("scripts/materialize-static-first.js");

expect(
  /id="developmentNotice"[^>]+aria-modal="true"[^>]+aria-labelledby="developmentNoticeTitle"[^>]+aria-describedby="developmentNoticeDescription developmentNoticeStatus"/.test(index),
  "A fejlesztési modal teljes dialog-nevezéssel és leírással rendelkezik."
);
expect(
  !/<[^>]+style="[^"]*"[^>]*>/.test(index),
  "A főoldalon nincs inline style attribútum."
);
expect(
  index.includes("element.inert=value") && index.includes("event.key!=='Tab'") && index.includes("event.key==='Escape'"),
  "A modal inert hátteret, fókuszcsapdát és Escape-kezelést használ."
);
expect(
  index.includes("previousFocus") && index.includes("previousFocus.focus()") && index.includes("close.focus({preventScroll:true})"),
  "A modal kezdeti fókuszt és fókusz-visszaadást kezel."
);
expect(
  index.includes("kb:development-notice-dismissed") &&
    read("js/cookie.js").includes('"kb:development-notice-dismissed"'),
  "A fejlesztési modal bezárása után, külön lépésben nyílhat meg az első sütimodal."
);
expect(
  header.includes('id="homePrimaryNav"') &&
    header.includes('aria-controls="homePrimaryNav"') &&
    header.includes('aria-label="Menü megnyitása"'),
  "A mobil menü gombja a navigációhoz kapcsolódik és állapotjelzővel rendelkezik."
);
expect(
  header.includes('aria-controls="langPop"') && header.includes('aria-controls="seasonPop"'),
  "A nyelv- és évszakgomb a vezérelt panelre hivatkozik."
);
expect(
  /class="lang-pop" hidden id="langPop" role="group"/.test(footer) &&
    /class="season-pop" hidden id="seasonPop" role="group"/.test(footer),
  "A bezárt popupok rejtettek a billentyűzet és a kisegítő technológiák elől."
);
expect(
  core.includes("function setPopupState") &&
    core.includes("function setMenuState") &&
    core.includes("e.key!=='Escape'") &&
    core.includes("menuBtn.focus()"),
  "A popupok és a mobil menü közös állapot- és Escape-kezelést használnak."
);
expect(
  core.includes("aria-activedescendant") &&
    core.includes("e.key==='ArrowDown'") &&
    core.includes("e.key==='ArrowUp'") &&
    core.includes("e.key==='Escape'"),
  "A főoldali kereső nyílbillentyűkkel, Enterrel és Escape-pel kezelhető."
);
expect(
  css.includes(".development-notice__close:focus-visible") && css.includes("outline: 3px solid"),
  "A modal bezárógombjának látható fókuszjelzése van."
);
expect(
  materializer.includes('const preserveAuthoredHomeShell = pagePath === "index.html"') &&
    materializer.includes("header && !preserveAuthoredHomeShell") &&
    materializer.includes("footer && !preserveAuthoredHomeShell"),
  "A statikus materializáló nem írja vissza a főoldal runtime fejléc- vagy láblécállapotát a szerzői shellbe."
);
expect(
  !/\brequired\s*=\s*(["'])\s*\1/i.test(footer),
  "A főoldali footer-fragment boolean required attribútumai kanonikusak, ezért a statikus normalizáló nem teszi instabillá a shellt."
);

console.log(JSON.stringify({ checks: passed.length + issues.length, passed: passed.length, issues, pass: passed }, null, 2));
if (issues.length) process.exitCode = 1;

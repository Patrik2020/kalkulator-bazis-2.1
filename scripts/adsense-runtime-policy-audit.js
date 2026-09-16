const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const cookie = fs.readFileSync(path.join(root, "js", "cookie.js"), "utf8");
const siteUi = fs.readFileSync(path.join(root, "js", "site-ui.js"), "utf8");
const failures = [];

const requireMatch = (source, pattern, label) => {
  if (!pattern.test(source)) failures.push(label);
};
const forbidMatch = (source, pattern, label) => {
  if (pattern.test(source)) failures.push(label);
};

requireMatch(cookie, /KB_ADSENSE_ELIGIBILITY_V2/, "hiányzik az AdSense eligibility v2 marker");
requireMatch(cookie, /window\.KB_ADSENSE_ELIGIBLE\s*=\s*isAdSenseEligiblePath\(\)/, "hiányzik a runtime eligibility flag");
requireMatch(cookie, /window\.KB_ADSENSE_CAN_REQUEST\s*=\s*false/, "az AdSense request nem fail-closed állapotból indul");
requireMatch(cookie, /window\.KB_ADSENSE_TCF_REQUIRED\s*=\s*true/, "a TCF-követelmény nincs explicit rögzítve");
requireMatch(cookie, /window\.__tcfapi\("addEventListener",\s*2/, "hiányzik a TCF v2 listener");
requireMatch(cookie, /\["tcloaded",\s*"useractioncomplete"\]/, "hiányzik a rendezett TCF eventStatus kapu");
requireMatch(cookie, /queue\.pauseAdRequests\s*=\s*1/, "az AdSense nincs alapból pause állapotban");
requireMatch(cookie, /document\.dispatchEvent\(new CustomEvent\("kb:adsense-ready"\)\)/, "hiányzik az adsense-ready esemény");

for (const required of [
  '"404"', '"kapcsolat"', '"impresszum"', '"adatvedelem"', '"cookie"',
  '"jogi-nyilatkozat"', '"felhasznalasi-feltetelek"', '"landing-pages/wise/"'
]) {
  if (!cookie.includes(required)) failures.push(`hiányzó kizárás: ${required}`);
}
for (const required of ['"kalkulatorok/"', '"aktualis/"', '"landing-pages/elethelyzetek/"']) {
  if (!cookie.includes(required)) failures.push(`hiányzó allowlist prefix: ${required}`);
}

requireMatch(siteUi, /KB_ADSENSE_SLOT_GUARD_V2/, "hiányzik a site-ui AdSense slot guard");
requireMatch(siteUi, /window\.KB_ADSENSE_CAN_REQUEST\s*!==\s*true/, "a slot render nem várja meg a TCF-ready állapotot");
requireMatch(siteUi, /document\.addEventListener\("kb:adsense-ready",\s*refreshConsentControlledUi\)/, "az UI nem frissül TCF-ready után");
forbidMatch(cookie, /Ide tartozik a Google AdSense hirdetésbetöltés/, "a saját cookie-modal még AdSense-CMP-ként írja le magát");

if (failures.length) {
  console.error("AdSense runtime policy audit FAILED:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("AdSense runtime policy audit OK.");
console.log("- publisher ads: allowlist only");
console.log("- excluded trust/legal/Wise pages: enforced in source policy");
console.log("- ad requests: fail-closed until certified TCF state settles");
console.log("- site-owned cookie consent: separated from AdSense CMP consent");

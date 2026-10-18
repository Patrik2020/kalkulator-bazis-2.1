"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { loadAdsensePolicy } = require("./adsense-policy");

const root = path.resolve(__dirname, "..");
const policy = loadAdsensePolicy(root);
const cookie = fs.readFileSync(path.join(root, "js", "cookie.js"), "utf8");
const siteUi = fs.readFileSync(path.join(root, "js", "site-ui.js"), "utf8");
const failures = [];

const requireMatch = (source, pattern, label) => {
  if (!pattern.test(source)) failures.push(label);
};
const forbidMatch = (source, pattern, label) => {
  if (pattern.test(source)) failures.push(label);
};
const requireGroup = (group, required, label) => {
  for (const pathName of required) {
    if (!group.includes(pathName)) failures.push(`${label}: ${pathName}`);
  }
};

requireMatch(cookie, /KB_ADSENSE_POLICY_V3/, "hiányzik a közös AdSense policy marker");
requireMatch(cookie, /window\.KB_GLOBAL_HEAD_CONFIG\?\.adsensePolicy/, "a runtime nem a közös AdSense policyt olvassa");
requireMatch(cookie, /window\.KB_ADSENSE_ELIGIBLE\s*=\s*isAdSenseEligiblePath\(\)/, "hiányzik a runtime eligibility flag");
requireMatch(cookie, /window\.KB_ADSENSE_CAN_REQUEST\s*=\s*false/, "az AdSense request nem fail-closed állapotból indul");
requireMatch(cookie, /window\.KB_ADSENSE_TCF_REQUIRED\s*=\s*true/, "a TCF-követelmény nincs explicit rögzítve");
requireMatch(cookie, /window\.__tcfapi\("addEventListener",\s*2/, "hiányzik a TCF v2 listener");
requireMatch(cookie, /\["tcloaded",\s*"useractioncomplete"\]/, "hiányzik a rendezett TCF eventStatus kapu");
requireMatch(cookie, /queue\.pauseAdRequests\s*=\s*1/, "az AdSense nincs alapból pause állapotban");
requireMatch(cookie, /document\.dispatchEvent\(new CustomEvent\("kb:adsense-ready"\)\)/, "hiányzik az adsense-ready esemény");
forbidMatch(cookie, /adsenseEligibleExact|adsenseExcludedExact|adsenseEligiblePrefixes|adsenseExcludedPrefixes/, "a cookie runtime saját policylistát tartalmaz");

requireGroup(policy.groups.excludedExact.categoryHubs,
  ["penzugyi", "epitoipari", "egeszseg", "mindennapi", "auto", "atvaltok"],
  "hiányzó kategóriaoldali kizárás");
requireGroup(policy.groups.excludedExact.trustAndLegal,
  ["404", "kapcsolat", "impresszum", "adatvedelem", "cookie", "jogi-nyilatkozat", "felhasznalasi-feltetelek"],
  "hiányzó bizalmi/jogi kizárás");
requireGroup(policy.groups.excludedPrefixes.partnerPages,
  ["landing-pages/wise/"], "hiányzó partneroldali kizárás");
for (const route of ["/", "/index", "/aktualis", "/kalkulatorok/bmi-kalkulator"]) {
  if (!policy.isEligible(route)) failures.push(`hiányzó engedélyezett útvonal: ${route}`);
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
console.log(`- shared page policy: ${policy.version}`);
console.log("- excluded category/trust/legal/Wise pages: enforced from one source");
console.log("- ad requests: fail-closed until certified TCF state settles");
console.log("- site-owned cookie consent: separated from AdSense CMP consent");

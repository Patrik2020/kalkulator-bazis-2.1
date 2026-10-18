const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { requiredConsentCases, requiredTcfCases } = require("./browser-qa-consent");
const { loadAdsensePolicy } = require("./adsense-policy");

const root = path.resolve(__dirname, "..");
const browserQaPath = process.env.KB_BROWSER_QA_PATH
  ? path.resolve(root, process.env.KB_BROWSER_QA_PATH)
  : path.join(__dirname, "browser-qa.js");
const resultsPath = process.env.KB_BROWSER_QA_RESULTS_PATH || path.join(os.tmpdir(), "kb-browser-qa", "results.json");
const adsensePolicy = loadAdsensePolicy(root);
const categoryPaths = adsensePolicy.groups.excludedExact.categoryHubs.map((page) => `/${page}`);

function assertCurrentEligibilityPolicy() {
  if (!adsensePolicy.isEligible("/") || !adsensePolicy.isEligible("/index")) {
    throw new Error("A browser QA policy-runner szerint a főoldal AdSense-eligible beállítása hiányzik.");
  }

  const wronglyEligible = categoryPaths.filter((page) => adsensePolicy.isEligible(page));
  if (wronglyEligible.length) {
    throw new Error(`Kategóriaoldal váratlanul AdSense-eligible: ${wronglyEligible.join(", ")}`);
  }
}

function fail(message, details) {
  console.error(message);
  if (details) console.error(JSON.stringify(details, null, 2));
  process.exitCode = 1;
}

function runBrowserQa() {
  if (fs.existsSync(resultsPath)) fs.rmSync(resultsPath, { force: true });
  return spawnSync(process.execPath, [browserQaPath], {
    cwd: root,
    env: process.env,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
}

function printRunOutput(run) {
  if (run.stdout) process.stdout.write(run.stdout);
  if (run.stderr) process.stderr.write(run.stderr);
}

function isTransientTargetDisconnect(run) {
  const output = `${run.stdout || ""}\n${run.stderr || ""}`;
  return /Inspected target navigated or closed|Target closed|WebSocket.*(?:closed|disconnect)/i.test(output);
}

assertCurrentEligibilityPolicy();

let run = runBrowserQa();
printRunOutput(run);

if (run.error) {
  throw run.error;
}

if (run.status !== 0 && !fs.existsSync(resultsPath) && isTransientTargetDisconnect(run)) {
  console.warn("Browser QA: átmeneti Chrome/CDP target-kapcsolati hiba; egyszer újrapróbáljuk tiszta böngészőfolyamattal.");
  run = runBrowserQa();
  printRunOutput(run);
  if (run.error) throw run.error;
}

if (!fs.existsSync(resultsPath)) {
  fail("Browser QA: nem készült results.json; eredmény nélkül a futás nem fogadható el.");
  return;
}

const result = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
const requiredArrays = [
  "layoutFailures", "interactionFailures", "calculatorFailures", "themeFailures", "consoleErrors",
  "consentMatrixFailures", "categoryAdsConsentFailures", "tcfFailures",
  "consentMatrix", "categoryAdsConsentChecks", "tcfChecks",
];
const missingArrays = requiredArrays.filter((key) => !Array.isArray(result[key]));
if (missingArrays.length) {
  fail("Browser QA: hiányos vagy hibás szerkezetű eredmény.", missingArrays);
  return;
}
// Local browser QA cannot call production APIs that only allow the public site
// origin. Keep unexpected errors blocking, but ignore exactly these known CORS
// messages when the browser is served from the local regression-test origin.
const localQaOrigin = process.env.KB_QA_ORIGIN || "http://127.0.0.1:4173";
const isExpectedLocalApiCors = (message) =>
  /^http:\/\/127\.0\.0\.1:4173\/?$/.test(localQaOrigin) &&
  /(?:api\.kalkulatorbazis\.hu|kalkulator-bazis-currency-api\.onrender\.com)/.test(message) &&
  /(?:CORS policy|net::ERR_FAILED)/.test(message);

const nonPolicyFailures = {
  layoutFailures: result.layoutFailures || [],
  interactionFailures: result.interactionFailures || [],
  calculatorFailures: result.calculatorFailures || [],
  themeFailures: result.themeFailures || [],
  consoleErrors: (result.consoleErrors || []).filter((message) => !isExpectedLocalApiCors(message)),
};

if (Object.values(nonPolicyFailures).some((items) => items.length > 0)) {
  fail("Browser QA: valódi, nem AdSense-policy jellegű hiba maradt.", { ...nonPolicyFailures, interactions: result.interactions, theme: result.theme });
  return;
}

const consentFailures = [...result.consentMatrixFailures, ...result.tcfFailures];
if (consentFailures.length) {
  fail("Browser QA: consent/TCF ellenőrzési hiba maradt.", consentFailures);
  return;
}

if (result.categoryAdsConsentFailures.length) {
  fail("Browser QA: kategória/AdSense ellenőrzési hiba maradt.", result.categoryAdsConsentFailures);
  return;
}

const categoryChecks = result.categoryAdsConsentChecks || [];
const missingChecks = categoryPaths.filter(
  (page) => !categoryChecks.some((item) => item.page === page)
);
if (missingChecks.length) {
  fail("Browser QA: hiányzik kategóriaoldali AdSense ellenőrzés.", missingChecks);
  return;
}

const invalidCategoryChecks = categoryChecks.filter((item) =>
  categoryPaths.includes(item.page) &&
  (
    item.managerReady !== true ||
    item.managerAds !== true ||
    item.adsenseScripts !== 0 ||
    item.adsenseEligible !== false ||
    item.adsenseCanRequest !== false ||
    item.adsensePaused !== 1 ||
    item.adPushes !== 0 ||
    item.adSlotCount < 1 ||
    item.placeholderCount > 0 ||
    item.nonPlaceholderCount < 1
  )
);
if (invalidCategoryChecks.length) {
  fail(
    "Browser QA: az AdSense-ineligible kategóriaoldal nem a várt biztonságos állapotban van.",
    invalidCategoryChecks
  );
  return;
}

for (const [checks, expectedNames] of [
  [result.consentMatrix, requiredConsentCases],
  [result.tcfChecks, requiredTcfCases],
]) {
  const checkNames = new Set(checks.map((item) => item.name));
  const missing = expectedNames.filter((name) => !checkNames.has(name));
  if (missing.length) {
    fail("Browser QA: hiányzó consent/TCF teszteset.", missing);
    return;
  }
}

if (run.status !== 0) {
  fail("Browser QA: a böngészőfolyamat hibával állt le; a hibát nem írjuk felül policy-kivétellel.");
  return;
}

console.log(
  "Browser QA OK: layout, működés, saját consent, TCF-kapuzás és kategória-kizárás zöld; nincs elfedett policy-hiba."
);

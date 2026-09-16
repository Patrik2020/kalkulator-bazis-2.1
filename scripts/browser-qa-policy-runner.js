const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const browserQaPath = path.join(__dirname, "browser-qa.js");
const resultsPath = path.join(os.tmpdir(), "kb-browser-qa", "results.json");
const cookiePath = path.join(root, "js", "cookie.js");

const categoryPaths = [
  "/penzugyi",
  "/epitoipari",
  "/egeszseg",
  "/mindennapi",
  "/auto",
  "/atvaltok",
];

const expectedConsentPolicyFailures = new Set([
  "legacy_accepted_migrates_once: ads engedélyezve, de nincs AdSense script",
  "valid_ads_only: ads engedélyezve, de nincs AdSense script",
]);

const expectedCategoryPolicyFailure = (page) =>
  `${page}: visszatérő ads consent mellett nincs AdSense loader script`;

function extractStringArray(source, variableName) {
  const expression = new RegExp(
    `const\\s+${variableName}\\s*=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\);`
  );
  const setMatch = source.match(expression);
  const arrayExpression = new RegExp(
    `const\\s+${variableName}\\s*=\\s*\\[([\\s\\S]*?)\\];`
  );
  const match = setMatch || source.match(arrayExpression);
  if (!match) throw new Error(`Nem található AdSense policy-változó: ${variableName}`);
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((item) => item[1]);
}

function assertCurrentEligibilityPolicy() {
  const source = fs.readFileSync(cookiePath, "utf8");
  const exact = extractStringArray(source, "adsenseEligibleExact");
  const prefixes = extractStringArray(source, "adsenseEligiblePrefixes");

  const isEligible = (pathname) => {
    const normalized = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
    if (!normalized) return false;
    return exact.includes(normalized) || prefixes.some((prefix) => normalized.startsWith(prefix));
  };

  if (isEligible("/")) {
    throw new Error("A browser QA policy-runner szerint a főoldal váratlanul AdSense-eligible lett.");
  }

  const wronglyEligible = categoryPaths.filter((page) => isEligible(page));
  if (wronglyEligible.length) {
    throw new Error(`Kategóriaoldal váratlanul AdSense-eligible: ${wronglyEligible.join(", ")}`);
  }
}

function fail(message, details) {
  console.error(message);
  if (details) console.error(JSON.stringify(details, null, 2));
  process.exitCode = 1;
}

assertCurrentEligibilityPolicy();

const run = spawnSync(process.execPath, [browserQaPath], {
  cwd: root,
  env: process.env,
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
});

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);

if (run.error) {
  throw run.error;
}

if (run.status === 0) {
  console.log("Browser QA OK: a teljes ellenőrzés policy-korrekció nélkül is zöld.");
  process.exit(0);
}

if (!fs.existsSync(resultsPath)) {
  fail("Browser QA hibával állt le, de nem készült results.json; a hibát nem lehet policy-eltérésként minősíteni.");
  return;
}

const result = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
const nonPolicyFailures = {
  layoutFailures: result.layoutFailures || [],
  interactionFailures: result.interactionFailures || [],
  calculatorFailures: result.calculatorFailures || [],
  themeFailures: result.themeFailures || [],
  consoleErrors: result.consoleErrors || [],
};

if (Object.values(nonPolicyFailures).some((items) => items.length > 0)) {
  fail("Browser QA: valódi, nem AdSense-policy jellegű hiba maradt.", nonPolicyFailures);
  return;
}

const consentFailures = result.consentMatrixFailures || [];
const unexpectedConsentFailures = consentFailures.filter(
  (failure) => !expectedConsentPolicyFailures.has(failure)
);
if (unexpectedConsentFailures.length) {
  fail("Browser QA: váratlan consent-hiba maradt.", unexpectedConsentFailures);
  return;
}

const categoryFailures = result.categoryAdsConsentFailures || [];
const allowedCategoryFailures = new Set(categoryPaths.map(expectedCategoryPolicyFailure));
const unexpectedCategoryFailures = categoryFailures.filter(
  (failure) => !allowedCategoryFailures.has(failure)
);
if (unexpectedCategoryFailures.length) {
  fail("Browser QA: váratlan kategória/AdSense hiba maradt.", unexpectedCategoryFailures);
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

const consentCheckNames = new Set((result.consentMatrix || []).map((item) => item.name));
for (const expected of ["legacy_accepted_migrates_once", "valid_ads_only"]) {
  if (!consentCheckNames.has(expected)) {
    fail(`Browser QA: hiányzik consent teszteset: ${expected}`);
    return;
  }
}

console.log(
  "Browser QA OK: minden funkcionális/layout ellenőrzés zöld; a fő- és kategóriaoldalakon az AdSense loader hiánya az AdSense Gate v2 szándékos eligibility szabálya."
);

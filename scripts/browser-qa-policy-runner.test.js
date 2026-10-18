const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");
const { requiredConsentCases, requiredTcfCases, tcfCheckpointFailures } = require("./browser-qa-consent");

const categoryPaths = ["/penzugyi", "/epitoipari", "/egeszseg", "/mindennapi", "/auto", "/atvaltok"];
const passingResult = () => ({
  layoutFailures: [], interactionFailures: [], calculatorFailures: [], themeFailures: [], consoleErrors: [],
  consentMatrixFailures: [], categoryAdsConsentFailures: [], tcfFailures: [],
  consentMatrix: requiredConsentCases.map((name) => ({ name })),
  tcfChecks: requiredTcfCases.map((name) => ({ name })),
  categoryAdsConsentChecks: categoryPaths.map((page) => ({
    page, managerReady: true, managerAds: true,
    adsenseScripts: 0, adsenseEligible: false, adsenseCanRequest: false, adsensePaused: 1,
    adPushes: 0, adSlotCount: 1, placeholderCount: 0, nonPlaceholderCount: 1,
  })),
});

function runFixture(t, result, status = 0) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "kb-qa-policy-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const resultsPath = path.join(dir, "results.json");
  const fixturePath = path.join(dir, "browser-fixture.js");
  fs.writeFileSync(fixturePath, `
    const fs = require('node:fs');
    const result = ${JSON.stringify(result)};
    if (result !== null) fs.writeFileSync(process.env.KB_BROWSER_QA_RESULTS_PATH, JSON.stringify(result));
    process.exitCode = ${status};
  `);
  return spawnSync(process.execPath, [path.join(__dirname, "browser-qa-policy-runner.js")], {
    encoding: "utf8",
    env: { ...process.env, KB_BROWSER_QA_PATH: fixturePath, KB_BROWSER_QA_RESULTS_PATH: resultsPath, KB_QA_ORIGIN: "http://127.0.0.1:4173" },
  });
}

test("accepts complete successful results", (t) => {
  const run = runFixture(t, passingResult());
  assert.equal(run.status, 0, run.stderr);
});

test("rejects absent results even when the browser exits successfully", (t) => {
  assert.notEqual(runFixture(t, null).status, 0);
});

test("rejects missing consent/TCF coverage", (t) => {
  const result = passingResult();
  result.tcfChecks = result.tcfChecks.filter((item) => item.name !== "failed_callback");
  assert.notEqual(runFixture(t, result).status, 0);
});

test("does not ignore formerly allowlisted consent failures", (t) => {
  const result = passingResult();
  result.consentMatrixFailures.push("valid_ads_only: ads engedélyezve, de nincs AdSense script");
  assert.notEqual(runFixture(t, result).status, 0);
});

test("rejects TCF bypass even when the browser process exits successfully", (t) => {
  const result = passingResult();
  result.tcfFailures.push("missing_cmp: AdSense kéréskapu TCF-jelzés nélkül megnyílt");
  assert.notEqual(runFixture(t, result).status, 0);
});

test("rejects requests from excluded category pages", (t) => {
  const result = passingResult();
  result.categoryAdsConsentChecks[0].adPushes = 1;
  assert.notEqual(runFixture(t, result).status, 0);
});

test("does not hide a browser failure behind empty failure arrays", (t) => {
  assert.notEqual(runFixture(t, passingResult(), 1).status, 0);
});

test("keeps only the existing localhost production-API CORS exception", (t) => {
  const result = passingResult();
  result.consoleErrors.push("https://api.kalkulatorbazis.hu/api/v1/calculators/salary/gross-to-net - CORS policy");
  assert.equal(runFixture(t, result).status, 0);
  result.consoleErrors.push("TypeError: unexpected application error");
  assert.notEqual(runFixture(t, result).status, 0);
});

test("TCF checkpoints detect premature requests independently of expected counts", () => {
  const item = { name: "injected_fault", expected: { pushes: 1 }, pushes: 1, prematureRequests: 1 };
  assert.equal(tcfCheckpointFailures(item).length, 1);
  assert.equal(tcfCheckpointFailures({ ...item, prematureRequests: 0 }).length, 0);
});

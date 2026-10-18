"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { loadAdsensePolicy } = require("./adsense-policy");

const root = path.resolve(__dirname, "..");
const policy = loadAdsensePolicy(root);

test("keeps the homepage and intended content routes eligible", () => {
  for (const route of [
    "/", "/index", "/index.html", "/AKTUALIS.html",
    "/kalkulatorok/bmi-kalkulator.html", "/aktualis/teszt-cikk",
    "/landing-pages/elethelyzetek/lakasvasarlas.html",
  ]) {
    assert.equal(policy.isEligible(route), true, route);
  }
});

test("keeps category hubs, trust pages and partner pages excluded", () => {
  const exact = Object.values(policy.groups.excludedExact).flat();
  for (const route of [...exact, "landing-pages/wise/wise", "landing-pages/wise/kapcsolat"]) {
    assert.equal(policy.isEligible(`/${route}.html`), false, route);
  }
});

test("explicit exclusions override broad calculator eligibility", () => {
  for (const route of policy.groups.excludedExact.retiredCalculators) {
    assert.equal(policy.isEligible(route), false, route);
    assert.ok(route.startsWith("kalkulatorok/"), route);
  }
});

test("uses default-deny behavior for unknown routes and malformed encoding", () => {
  for (const route of ["/ismeretlen", "/penzugyi/valami", "/%E0%A4%A"]) {
    assert.equal(policy.isEligible(route), false, route);
  }
});

test("normalizes extensions, case, query, fragment and backslashes", () => {
  assert.equal(policy.normalizePath("/KALKULATOROK\\BMI-KALKULATOR.HTML?x=1#eredmeny"), "kalkulatorok/bmi-kalkulator");
});

test("runtime and transforms consume the shared policy without embedded route lists", () => {
  const cookie = fs.readFileSync(path.join(root, "js", "cookie.js"), "utf8");
  const transform = fs.readFileSync(path.join(root, "scripts", "apply-adsense-eligibility-v2.js"), "utf8");
  assert.match(cookie, /KB_GLOBAL_HEAD_CONFIG\?\.adsensePolicy/);
  assert.doesNotMatch(cookie, /adsenseEligibleExact|adsenseExcludedExact/);
  assert.doesNotMatch(transform, /const adsenseEligibleExact|const adsenseExcludedExact/);
});

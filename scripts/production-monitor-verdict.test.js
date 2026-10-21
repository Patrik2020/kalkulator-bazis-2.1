"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { classify } = require("./production-monitor-verdict");

test("only successful reachability and successful live audit count as verified", () => {
  assert.equal(classify({ reachability: "success", blocked: "false", audit: "success" }).state, "verified");
  for (const audit of ["skipped", "cancelled", undefined, "failure"]) {
    assert.notEqual(classify({ reachability: "success", blocked: "false", audit }).state, "verified");
  }
});

test("Cloudflare 403 with skipped audit is INCONCLUSIVE, never healthy or declared outage", () => {
  const verdict = classify({ reachability: "success", blocked: "true", audit: "skipped" });
  assert.equal(verdict.state, "inconclusive");
  assert.match(verdict.detail, /NOT confirmed downtime/);
});

test("real audit failure and failed probe are FAILURES", () => {
  assert.equal(classify({ reachability: "success", blocked: "false", audit: "failure" }).state, "failed");
  assert.equal(classify({ reachability: "failure", blocked: "false", audit: "skipped" }).state, "failed");
  assert.equal(classify({ reachability: "cancelled", blocked: "", audit: "" }).state, "failed");
});

test("unexpected or missing upstream values fail closed", () => {
  for (const item of [
    { reachability: "success", blocked: "", audit: "success" },
    { reachability: "success", blocked: "true", audit: "success" },
    { reachability: "success", blocked: "false", audit: "skipped" },
    { reachability: "success", blocked: "true", audit: "failure" }
  ]) assert.equal(classify(item).state, "failed");
});

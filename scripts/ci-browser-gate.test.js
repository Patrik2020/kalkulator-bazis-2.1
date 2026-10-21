"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { verdict } = require("./ci-browser-gate");

test("full browser checks must both succeed when required", () => {
  const good = { changes: "success", runBrowser: "true", smoke: "success", deep: "success" };
  assert.equal(verdict(good), null);
  for (const status of ["failure", "cancelled", "skipped", "timed_out", "neutral", undefined]) {
    assert.ok(verdict({ ...good, smoke: status }));
    assert.ok(verdict({ ...good, deep: status }));
  }
});

test("editorial-only PRs pass only when browser jobs are deliberately skipped", () => {
  const good = { changes: "success", runBrowser: "false", smoke: "skipped", deep: "skipped" };
  assert.equal(verdict(good), null);
  assert.ok(verdict({ ...good, deep: "failure" }));
  assert.ok(verdict({ ...good, smoke: "success" }));
});

test("missing, invalid or failed detection always blocks the merge gate", () => {
  const good = { changes: "success", runBrowser: "true", smoke: "success", deep: "success" };
  for (const changes of ["failure", "skipped", "cancelled", undefined]) {
    assert.ok(verdict({ ...good, changes }));
  }
  for (const runBrowser of ["", undefined, "unknown"]) {
    assert.ok(verdict({ ...good, runBrowser }));
  }
});

test("INTENTIONAL NEGATIVE PROBE: required CI checks must block this PR", () => {
  assert.fail("EXPECTED TEST FAILURE – GitHub branch protection verification; never merge this PR");
});

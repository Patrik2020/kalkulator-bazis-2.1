"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const { syncIssue, ISSUE_TITLE } = require("./production-monitor-incident");

const base = { repo: "Example/project", runUrl: "https://github.com/Example/project/actions/runs/123" };

function stub(issues, originalBody = "") {
  const calls = [];
  function api(args) {
    calls.push(args);
    if (args[0] === "issue" && args[1] === "list") return JSON.stringify(issues);
    if (args[0] === "issue" && args[1] === "view") return originalBody;
    return "";
  }
  return { api, calls };
}

test("inconclusive creates one issue and does not confuse coverage failure with outage", () => {
  const mock = stub([]);
  assert.equal(syncIssue({ ...base, state: "inconclusive" }, mock.api), "created");
  const body = mock.calls[1][mock.calls[1].indexOf("--body") + 1];
  assert.match(body, /monitoring blind spot/);
  assert.match(body, /not proof of website downtime/);
});

test("repeated probes do not spam existing incidents", () => {
  const mock = stub([{ number: 77, title: ISSUE_TITLE }], "### Live monitoring: INCONCLUSIVE");
  assert.equal(syncIssue({ ...base, state: "inconclusive" }, mock.api), "already-open");
  assert.equal(mock.calls.length, 2);
});

test("transition from blocked to real failure updates the existing issue", () => {
  const mock = stub([{ number: 77, title: ISSUE_TITLE }], "### Live monitoring: INCONCLUSIVE");
  assert.equal(syncIssue({ ...base, state: "failed" }, mock.api), "updated");
  assert.equal(mock.calls.at(-1)[1], "edit");
});

test("close only after actual verified audit, never on inconclusive state", () => {
  const mock = stub([{ number: 77, title: ISSUE_TITLE }]);
  assert.equal(syncIssue({ ...base, state: "verified" }, mock.api), "closed");
  assert.equal(mock.calls.at(-1)[1], "close");
  const none = stub([]);
  assert.equal(syncIssue({ ...base, state: "verified" }, none.api), "nothing-to-close");
});

test("invalid status and repo are rejected", () => {
  assert.throws(() => syncIssue({ ...base, state: "unknown" }, stub([]).api), /Unrecognized/);
  assert.throws(() => syncIssue({ ...base, repo: "evil/path/other", state: "verified" }, stub([]).api), /Invalid/);
});

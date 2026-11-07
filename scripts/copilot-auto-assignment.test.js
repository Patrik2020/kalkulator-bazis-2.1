"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  validBranch, isCopilotAssigned, isTrustedHandoff,
  countAssignmentsToday, assignCopilot, DAILY_LIMIT,
} = require("./copilot-auto-assignment");
const { markerFor } = require("./ci-repair-handoff");

const repository = "Patrik2020/kalkulator-bazis-2.1";
const sha = "abcdef1234567890abcdef1234567890abcdef12";
const now = new Date("2026-11-07T12:00:00Z");

function eventFor(overrides = {}) {
  return {
    repository: { full_name: repository },
    workflow_run: {
      id: 11223344, name: "Site quality", conclusion: "failure",
      event: "pull_request", head_sha: sha,
      run_attempt: 1, pull_requests: [{ number: 351 }], ...overrides,
    },
  };
}

function prFor(overrides = {}) {
  return {
    state: "open", base: { ref: "main" },
    head: { ref: "feature/assets", sha, repo: { full_name: repository } },
    user: { type: "User" }, ...overrides,
  };
}

function issueFor(overrides = {}) {
  return {
    number: 765, state: "open", body: markerFor(351),
    user: { login: "github-actions[bot]" },
    assignees: [], created_at: "2026-11-07T10:00:00Z",
    ...overrides,
  };
}

function mockApi({ pr = prFor(), issue = issueFor(), countList = [], 
  jobs = [{
    id: 99, name: "Site quality gate", conclusion: "failure",
    steps: [{ name: "Verify committed asset fingerprints", conclusion: "failure" }],
  }], assignmentResponse = { assignees: [{ login: "copilot-swe-agent[bot]" }] },
} = {}) {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url, method: opts.method, body: opts.body, token: opts.headers.Authorization });
    let data;
    if (url.includes("/pulls/")) data = pr;
    else if (url.includes("/actions/runs/")) data = { jobs };
    else if (url.includes("/issues?state=open")) data = issue ? [issue] : [];
    else if (url.includes("/issues?state=all")) data = countList;
    else if (url.includes("/assignees") && opts.method === "POST") data = assignmentResponse;
    else throw new Error("Unexpected request " + url);
    return { ok: true, json: async () => data };
  };
  return { fetchImpl, calls };
}

function options(api, event = eventFor()) {
  return {
    event, repository, readToken: "read-token", userToken: "user-token",
    fetchImpl: api.fetchImpl, now, log: () => {},
  };
}

test("branch guard rejects malformed, unsafe, or excessively long refs", () => {
  assert.equal(validBranch("feature/assets"), true);
  assert.equal(validBranch("release-v2.1"), true);
  for (const b of ["", "a b", "../danger", "foo//bar", "foo@{0}", "foo/", "foo.lock", "x".repeat(201)]) {
    assert.equal(validBranch(b), false, b);
  }
});

test("recognizes trusted issues and the correct Copilot assignee", () => {
  assert.equal(isTrustedHandoff(issueFor(), 351), true);
  assert.equal(isTrustedHandoff(issueFor({ user: { login: "someone" } }), 351), false);
  assert.equal(isTrustedHandoff(issueFor({ state: "closed" }), 351), false);
  assert.equal(isTrustedHandoff(issueFor(), 999), false);
  assert.equal(isCopilotAssigned({ assignees: [{ login: "copilot-swe-agent[bot]" }] }), true);
  assert.equal(isCopilotAssigned({ assignees: [{ login: "other" }] }), false);
});

test("assigns only one trusted eligible repair issue and targets the original PR branch", async () => {
  const api = mockApi();
  const result = await assignCopilot(options(api));
  assert.deepEqual(result, { status: "assigned", issueNumber: 765 });
  const posts = api.calls.filter(call => call.method === "POST");
  assert.equal(posts.length, 1);
  assert.equal(posts[0].token, "Bearer user-token");
  const body = JSON.parse(posts[0].body);
  assert.deepEqual(body.assignees, ["copilot-swe-agent[bot]"]);
  assert.equal(body.agent_assignment.target_repo, repository);
  assert.equal(body.agent_assignment.base_branch, "feature/assets");
  assert.match(body.agent_assignment.custom_instructions, /Do not merge, deploy/);
});

test("skips when a CI event is no longer linked to a current PR commit", async () => {
  const api = mockApi({ pr: prFor({ head: {
    ref: "feature/assets", sha: "0123456789abcdef0123456789abcdef01234567",
    repo: { full_name: repository },
  } }) });
  const result = await assignCopilot(options(api));
  assert.deepEqual(result, { status: "skipped", reason: "pr" });
  assert.equal(api.calls.filter(call => call.method === "POST").length, 0);
});

test("skips closed, forked, bot PRs and invalid branches", async () => {
  const different = [
    prFor({ state: "closed" }),
    prFor({ head: { ref: "feature/assets", sha, repo: { full_name: "different/fork" } } }),
    prFor({ user: { type: "Bot" } }),
    prFor({ head: { ref: "bad branch", sha, repo: { full_name: repository } } }),
  ];
  for (const pr of different) {
    const api = mockApi({ pr });
    assert.deepEqual(await assignCopilot(options(api)), { status: "skipped", reason: "pr" });
  }
});

test("never assigns if the generated-asset issue is missing, already assigned, or untrusted", async () => {
  for (const issue of [null, issueFor({ assignees: [{ login: "copilot-swe-agent[bot]" }] }),
    issueFor({ assignees: [{ login: "Patrik2020" }] }),
    issueFor({ user: { login: "untrusted" } })]) {
    const api = mockApi({ issue });
    const result = await assignCopilot(options(api));
    assert.notEqual(result.status, "assigned");
    assert.equal(api.calls.filter(call => call.method === "POST").length, 0);
  }
});

test("never assigns a non-generated-assets CI failure", async () => {
  const api = mockApi({ jobs: [{
    id: 99, name: "Site quality gate", conclusion: "failure",
    steps: [{ name: "Guard localization inventory", conclusion: "failure" }],
  }] });
  assert.deepEqual(await assignCopilot(options(api)), { status: "skipped", reason: "category" });
  assert.equal(api.calls.filter(call => call.method === "POST").length, 0);
});

test("enforces a two-task daily quota before assignment", async () => {
  const issue = issueFor({ assignees: [{ login: "copilot-swe-agent[bot]" }] });
  assert.equal(DAILY_LIMIT, 2);
  const api = mockApi({ countList: [issue, issueFor({ number: 766 })] });
  assert.equal(await countAssignmentsToday(repository, "read-token", { fetchImpl: api.fetchImpl, now }), 1);
  const quotaApi = mockApi({ countList: [
    issue, issueFor({ number: 766, assignees: [{ login: "copilot-swe-agent[bot]" }] }),
  ] });
  assert.deepEqual(await assignCopilot(options(quotaApi)), { status: "skipped", reason: "daily-cap" });
  assert.equal(quotaApi.calls.filter(call => call.method === "POST").length, 0);
});

test("fails closed on missing daily cap dates rather than guessing", async () => {
  const api = mockApi({ countList: [{ ...issueFor(), created_at: undefined }] });
  await assert.rejects(countAssignmentsToday(repository, "read-token", { fetchImpl: api.fetchImpl, now }), /missing creation date/);
});

test("does not send a user token without configuration", async () => {
  const api = mockApi();
  await assert.rejects(assignCopilot({ ...options(api), userToken: "" }), /Missing KB_COPILOT_ASSIGNMENT_TOKEN/);
  assert.equal(api.calls.length, 0);
});

test("rejects assignment API responses that do not confirm Copilot", async () => {
  const api = mockApi({ assignmentResponse: { assignees: [] } });
  await assert.rejects(assignCopilot(options(api)), /did not confirm/);
});

test("skips unrelated workflow events without contacting GitHub", async () => {
  const api = mockApi();
  const result = await assignCopilot(options(api, eventFor({ conclusion: "success" })));
  assert.deepEqual(result, { status: "skipped", reason: "workflow" });
  assert.equal(api.calls.length, 0);
});

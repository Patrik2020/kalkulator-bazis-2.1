"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  candidateFromEvent, markerFor, eligibleForHandoff, issueForHandoff,
  requestJson, findExistingHandoff, processFailure,
} = require("./ci-repair-handoff");

const repository = "Patrik2020/kalkulator-bazis-2.1";
const token = "unit-test-token";

function eventFor({ conclusion = "failure", event = "pull_request", name = "Site quality", prs = [{ number: 351 }] } = {}) {
  return {
    repository: { full_name: repository },
    workflow_run: {
      id: 987654321, name, conclusion, event, run_attempt: 1,
      pull_requests: prs,
    },
  };
}

function mockApi({
  pr = { state: "open", base: { ref: "main" }, head: { repo: { full_name: repository } } },
  failures = [{
    id: 1234, name: "Site quality gate", conclusion: "failure",
    steps: [{ name: "Verify committed asset fingerprints", conclusion: "failure" }],
  }],
  existing = [], issueNumber = 654,
} = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, method: options.method, body: options.body });
    let value;
    if (url.includes("/pulls/")) value = pr;
    else if (url.includes("/actions/runs/")) value = { jobs: failures };
    else if (url.includes("/issues?")) value = existing;
    else if (url.endsWith("/issues") && options.method === "POST") value = { number: issueNumber };
    else throw new Error("Unexpected endpoint " + url);
    return { ok: true, json: async () => value };
  };
  return { fetchImpl, calls };
}

test("accepts only a failed Site quality run with exactly one PR", () => {
  assert.deepEqual(candidateFromEvent(eventFor(), repository), { runId: 987654321, prNumber: 351 });
  assert.equal(candidateFromEvent(eventFor({ conclusion: "success" }), repository), null);
  assert.equal(candidateFromEvent(eventFor({ event: "push" }), repository), null);
  assert.equal(candidateFromEvent(eventFor({ name: "Browser regression" }), repository), null);
  assert.equal(candidateFromEvent(eventFor({ prs: [] }), repository), null);
  assert.equal(candidateFromEvent(eventFor({ prs: [{ number: 1 }, { number: 2 }] }), repository), null);
});

test("rejects wrong repository and malformed PR identifiers", () => {
  assert.throws(() => candidateFromEvent({ ...eventFor(), repository: { full_name: "someone/other" } }, repository), /mismatch/);
  assert.equal(candidateFromEvent(eventFor({ prs: [{ number: "123" }] }), repository), null);
  assert.throws(() => markerFor(0), /Invalid PR/);
});

test("only generated asset failures are eligible", () => {
  assert.equal(eligibleForHandoff({ failures: [{ category: "generated-assets" }] }), true);
  assert.equal(eligibleForHandoff({ failures: [{ category: "generated-assets" }, { category: "security" }] }), false);
  assert.equal(eligibleForHandoff({ failures: [] }), false);
});

test("issue includes stable dedupe marker and safe, reviewable instructions", () => {
  const payload = issueForHandoff(repository, { prNumber: 351, runId: 987654321 }, {});
  assert.match(payload.body, /kb-ai-repair:v1:pr-351:generated-assets/);
  assert.match(payload.body, /npm run ai:prepare/);
  assert.match(payload.body, /not automatically assigned to Copilot/);
  assert.match(payload.body, /actions\/runs\/987654321/);
  assert.equal(payload.title, "CI repair: PR #351 – generated asset fingerprints");
});

test("creates one repair issue for an eligible same-repository PR", async () => {
  const api = mockApi();
  const result = await processFailure({ event: eventFor(), repository, token, fetchImpl: api.fetchImpl, log: () => {} });
  assert.deepEqual(result, { status: "created", issueNumber: 654 });
  const writes = api.calls.filter(call => call.method === "POST");
  assert.equal(writes.length, 1);
  assert.match(writes[0].body, /kb-ai-repair:v1:pr-351:generated-assets/);
});

test("reuses the matching open issue instead of creating a duplicate", async () => {
  const api = mockApi({ existing: [{ number: 777, body: markerFor(351), user: { login: "github-actions[bot]" } }] });
  const result = await processFailure({ event: eventFor(), repository, token, fetchImpl: api.fetchImpl, log: () => {} });
  assert.deepEqual(result, { status: "existing", issueNumber: 777 });
  assert.equal(api.calls.filter(call => call.method === "POST").length, 0);
});

test("does not trust a handoff marker submitted by an unrelated user", async () => {
  const api = mockApi({ existing: [{
    number: 777, body: markerFor(351), user: { login: "untrusted" },
  }] });
  const result = await processFailure({
    event: eventFor(), repository, token, fetchImpl: api.fetchImpl, log: () => {},
  });
  assert.deepEqual(result, { status: "created", issueNumber: 654 });
});

test("ignores failures outside the allowlisted category", async () => {
  const api = mockApi({ failures: [{
    id: 1234, name: "Site quality gate", conclusion: "failure",
    steps: [{ name: "Guard localization inventory", conclusion: "failure" }],
  }] });
  const result = await processFailure({ event: eventFor(), repository, token, fetchImpl: api.fetchImpl, log: () => {} });
  assert.deepEqual(result, { status: "skipped", reason: "category" });
  assert.equal(api.calls.filter(call => call.method === "POST").length, 0);
});

test("ignores closed, forked, or differently based PRs", async () => {
  for (const pr of [
    { state: "closed", base: { ref: "main" }, head: { repo: { full_name: repository } } },
    { state: "open", base: { ref: "develop" }, head: { repo: { full_name: repository } } },
    { state: "open", base: { ref: "main" }, head: { repo: { full_name: "someone/fork" } } },
    { state: "open", user: { type: "Bot" }, base: { ref: "main" }, head: { repo: { full_name: repository } } },
  ]) {
    const api = mockApi({ pr });
    const result = await processFailure({ event: eventFor(), repository, token, fetchImpl: api.fetchImpl, log: () => {} });
    assert.deepEqual(result, { status: "skipped", reason: "pr" });
    assert.equal(api.calls.filter(call => call.method === "POST").length, 0);
  }
});

test("no GitHub requests are sent for unrelated workflow runs", async () => {
  const api = mockApi();
  const result = await processFailure({ event: eventFor({ event: "push" }), repository, token, fetchImpl: api.fetchImpl, log: () => {} });
  assert.deepEqual(result, { status: "skipped", reason: "event" });
  assert.equal(api.calls.length, 0);
});

test("refuses duplicate creation if issue pagination limit is reached", async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => Array.from({ length: 100 }, (_, i) => ({ number: i, body: "unrelated" })),
  });
  await assert.rejects(findExistingHandoff(repository, 351, token, fetchImpl), /Too many open issues/);
});

test("API failures reveal no token and do not silently succeed", async () => {
  const fetchImpl = async () => ({ ok: false, status: 403 });
  await assert.rejects(
    requestJson(repository, "secret-token", "/issues", { fetchImpl }),
    error => error.message.includes("403") && !error.message.includes("secret-token")
  );
});

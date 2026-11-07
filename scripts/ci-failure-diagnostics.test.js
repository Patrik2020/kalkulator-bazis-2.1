"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  categoryFor, safeText, reportForRun, markdownFor, loadJobs,
} = require("./ci-failure-diagnostics");

const repository = "Patrik2020/kalkulator-bazis-2.1";

function failedEvent() {
  return {
    repository: { full_name: repository },
    workflow_run: {
      id: 123456,
      name: "Site quality",
      conclusion: "failure",
      run_attempt: 2,
      event: "pull_request",
      head_branch: "feature/change",
    },
  };
}

test("categorizes generated asset drift with a concrete recovery command", () => {
  const diagnosis = categoryFor("Verify committed asset fingerprints");
  assert.equal(diagnosis.category, "generated-assets");
  assert.match(diagnosis.guidance, /npm run ai:prepare/);
});

test("categorizes localization and security failures without suggesting bypasses", () => {
  assert.equal(categoryFor("Guard localization inventory").category, "localization");
  const security = categoryFor("Repository security baseline");
  assert.equal(security.category, "security");
  assert.match(security.guidance, /do not weaken/);
});

test("creates a report with a failed job, failed step and link to the real logs", () => {
  const report = reportForRun({
    repository, event: failedEvent(),
    jobs: [{
      id: 999, name: "Site quality gate", conclusion: "failure",
      steps: [
        { name: "Checkout", conclusion: "success" },
        { name: "Verify committed asset fingerprints", conclusion: "failure" },
      ],
    }],
  });
  assert.equal(report.failures.length, 1);
  assert.equal(report.failures[0].category, "generated-assets");
  assert.equal(report.failures[0].logs_url,
    "https://github.com/" + repository + "/actions/runs/123456/job/999");
  assert.match(markdownFor(report), /CI failure diagnostics/);
});

test("includes a safe fallback if no failed step metadata exists", () => {
  const report = reportForRun({
    repository, event: failedEvent(),
    jobs: [{ id: 999, name: "runner lost", conclusion: "failure", steps: [] }],
  });
  assert.equal(report.failures.length, 1);
  assert.equal(report.failures[0].step, "(no failed step identified)");
});

test("rejects cross-repository, nonfailure, and invalid run events", () => {
  const event = failedEvent();
  event.repository.full_name = "someone/else";
  assert.throws(() => reportForRun({ repository, event, jobs: [] }), /Expected a failed/);
  const cancelled = failedEvent();
  cancelled.workflow_run.conclusion = "cancelled";
  assert.throws(() => reportForRun({ repository, event: cancelled, jobs: [] }), /Expected a failed/);
  assert.throws(() => reportForRun({
    repository: "repo with spaces",
    event: failedEvent(), jobs: [],
  }), /Invalid GITHUB_REPOSITORY/);
});

test("strips multiline and HTML markers from untrusted step metadata", () => {
  assert.equal(safeText("Build <script>\nfailed | again"), "Build script failed again");
  const report = reportForRun({
    repository, event: failedEvent(),
    jobs: [{
      id: 43, name: "malicious <img>", conclusion: "failure",
      steps: [{ name: "<script> bad", conclusion: "failure" }],
    }],
  });
  assert.doesNotMatch(markdownFor(report), /<script>|<img>/);
});

test("paginates the jobs API using read-only requests", async () => {
  const requests = [];
  const first = Array.from({ length: 100 }, (_, id) => ({ id, name: "ok", conclusion: "success" }));
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    return {
      ok: true,
      json: async () => ({ jobs: requests.length === 1 ? first : [{ id: 200 }] }),
    };
  };
  const jobs = await loadJobs({ repository, runId: 123456, token: "test-token", fetchImpl });
  assert.equal(jobs.length, 101);
  assert.equal(requests.length, 2);
  assert.match(requests[1].url, /page=2/);
  assert.equal(requests[0].options.headers.Authorization, "Bearer test-token");
});

test("stops on API failure and never puts a token in error messages", async () => {
  const fetchImpl = async () => ({ ok: false, status: 403 });
  await assert.rejects(
    loadJobs({ repository, runId: 123456, token: "secret-value", fetchImpl }),
    /HTTP 403/
  );
  await assert.rejects(
    loadJobs({ repository, runId: 123456, token: "", fetchImpl }),
    /GITHUB_TOKEN is required/
  );
});

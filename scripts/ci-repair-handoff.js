#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const { loadJobs, reportForRun } = require("./ci-failure-diagnostics");

const CATEGORY = "generated-assets";
const MARKER_PREFIX = "kb-ai-repair:v1";
const MAX_ISSUE_PAGES = 8;

function candidateFromEvent(event, repository) {
  const run = event?.workflow_run;
  if (event?.repository?.full_name !== repository) {
    throw new Error("Repository identity mismatch");
  }
  if (!run || run.name !== "Site quality" ||
      run.conclusion !== "failure" || run.event !== "pull_request" ||
      !Number.isSafeInteger(run.id) || run.id <= 0) return null;
  const prs = run.pull_requests;
  if (!Array.isArray(prs) || prs.length !== 1 ||
      !Number.isSafeInteger(prs[0]?.number) || prs[0].number <= 0) return null;
  return { runId: run.id, prNumber: prs[0].number };
}

function markerFor(prNumber) {
  if (!Number.isSafeInteger(prNumber) || prNumber <= 0) {
    throw new Error("Invalid PR number");
  }
  return "<!-- " + MARKER_PREFIX + ":pr-" + prNumber + ":" + CATEGORY + " -->";
}

function eligibleForHandoff(report) {
  return Array.isArray(report?.failures) && report.failures.length > 0 &&
    report.failures.every(item => item.category === CATEGORY);
}

function issueForHandoff(repository, candidate, report) {
  const { prNumber, runId } = candidate;
  const prLink = "https://github.com/" + repository + "/pull/" + prNumber;
  const runLink = "https://github.com/" + repository + "/actions/runs/" + runId;
  return {
    title: "CI repair: PR #" + prNumber + " – generated asset fingerprints",
    body: [
      markerFor(prNumber),
      "## Automated repair candidate (not a confirmed root cause)",
      "",
      "A Site quality workflow reported a generated asset fingerprint failure.",
      "This issue was created from **job/step metadata only**, not from the raw logs.",
      "",
      "- Original PR: " + prLink,
      "- Failed workflow run: " + runLink,
      "",
      "## Suggested next action for a coding agent",
      "",
      "1. Inspect the linked PR and exact failing GitHub Actions logs.",
      "2. Read AGENTS.md and .github/copilot-instructions.md.",
      "3. Reproduce the problem on the PR branch and run `npm run ai:prepare`.",
      "4. Review the generated diff; keep only intentional changes and commit them.",
      "5. Run `npm run ai:check` plus affected tests; never disable CI checks.",
      "6. Propose a reviewed fix linked to the original PR. Do not merge or deploy.",
      "",
      "**Safety:** Verify the diagnosis before changing code. Preserve calculator logic,",
      "financial rules, translations, ads, security and SEO.",
      "",
      "**Note:** This issue is not automatically assigned to Copilot. Assignment",
      "and any extra coding-agent permissions require separate authorization.",
      "",
    ].join("\n"),
  };
}

async function requestJson(repository, token, endpoint, {
  method = "GET", body, fetchImpl = fetch,
} = {}) {
  if (!token) throw new Error("GITHUB_TOKEN is required");
  const url = "https://api.github.com/repos/" + repository + endpoint;
  const response = await fetchImpl(url, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    throw new Error("GitHub API " + method + " " +
      endpoint.split("?")[0] + " returned HTTP " + response.status);
  }
  return response.json();
}

async function findExistingHandoff(repository, prNumber, token, fetchImpl = fetch) {
  const marker = markerFor(prNumber);
  for (let page = 1; page <= MAX_ISSUE_PAGES; page++) {
    const issues = await requestJson(repository, token,
      "/issues?state=open&per_page=100&page=" + page, { fetchImpl });
    if (!Array.isArray(issues)) throw new Error("Invalid issues API response");
    const match = issues.find(issue => !issue.pull_request &&
      issue.user?.login === "github-actions[bot]" &&
      typeof issue.body === "string" && issue.body.includes(marker));
    if (match) return match;
    if (issues.length < 100) return null;
  }
  throw new Error("Too many open issues to deduplicate safely; no issue created");
}

async function processFailure({
  event, repository, token, fetchImpl = fetch, log = console.log,
}) {
  const candidate = candidateFromEvent(event, repository);
  if (!candidate) {
    log("[ai-handoff] Not an eligible failed same-repository PR workflow.");
    return { status: "skipped", reason: "event" };
  }

  const pr = await requestJson(repository, token, "/pulls/" + candidate.prNumber, { fetchImpl });
  if (pr.state !== "open" || pr.base?.ref !== "main" ||
      pr.head?.repo?.full_name !== repository || pr.user?.type === "Bot") {
    log("[ai-handoff] PR is closed, has another base, or comes from a fork.");
    return { status: "skipped", reason: "pr" };
  }

  const jobs = await loadJobs({
    repository, runId: candidate.runId, token, fetchImpl,
  });
  const report = reportForRun({ repository, event, jobs });
  if (!eligibleForHandoff(report)) {
    log("[ai-handoff] Failure is not exclusively a generated-assets case.");
    return { status: "skipped", reason: "category" };
  }

  const existing = await findExistingHandoff(repository, candidate.prNumber, token, fetchImpl);
  if (existing) {
    log("[ai-handoff] Reusing open issue #" + existing.number + ".");
    return { status: "existing", issueNumber: existing.number };
  }

  const payload = issueForHandoff(repository, candidate, report);
  const created = await requestJson(repository, token, "/issues", {
    method: "POST", body: payload, fetchImpl,
  });
  if (!Number.isSafeInteger(created.number) || created.number <= 0) {
    throw new Error("GitHub did not return a valid created issue number");
  }
  log("[ai-handoff] Created issue #" + created.number + ".");
  return { status: "created", issueNumber: created.number };
}

async function main() {
  const { GITHUB_EVENT_PATH: file, GITHUB_REPOSITORY: repository, GITHUB_TOKEN: token } = process.env;
  if (!file || !repository || !token) throw new Error("Missing GitHub Actions environment");
  if (!/^[a-z\d_.-]+\/[a-z\d_.-]+$/i.test(repository)) {
    throw new Error("Invalid repository name");
  }
  const event = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = await processFailure({ event, repository, token });
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      "AI repair handoff: " + result.status +
      (result.issueNumber ? " (Issue #" + result.issueNumber + ")" : "") + "\n");
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error("[ai-handoff] " + error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  candidateFromEvent, markerFor, eligibleForHandoff, issueForHandoff,
  requestJson, findExistingHandoff, processFailure,
};

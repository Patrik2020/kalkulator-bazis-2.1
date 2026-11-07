#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const {
  candidateFromEvent,
  markerFor,
  eligibleForHandoff,
  findExistingHandoff,
  requestJson,
} = require("./ci-repair-handoff");
const { loadJobs, reportForRun } = require("./ci-failure-diagnostics");

const COPILOT_LOGIN = "copilot-swe-agent[bot]";
const DAILY_LIMIT = 2;
const MAX_ISSUE_PAGES = 8;
const SHA_PATTERN = /^[0-9a-f]{40}$/i;
const BRANCH_PATTERN = /^(?!\/)(?!.*\.\.)(?!.*@\{)(?!.*\/\/)[a-zA-Z0-9_./-]+$/;

function validBranch(value) {
  return typeof value === "string" && value.length < 200 &&
    BRANCH_PATTERN.test(value) && !value.endsWith("/") && !value.endsWith(".lock");
}

function isCopilotAssigned(issue) {
  return Array.isArray(issue?.assignees) &&
    issue.assignees.some(assignee => assignee.login === COPILOT_LOGIN ||
      assignee.login === "copilot-swe-agent");
}

function isTrustedHandoff(issue, prNumber) {
  return issue && !issue.pull_request && issue.state === "open" &&
    issue.user?.login === "github-actions[bot]" &&
    typeof issue.body === "string" && issue.body.includes(markerFor(prNumber));
}

async function countAssignmentsToday(repository, token, { fetchImpl = fetch, now = new Date() } = {}) {
  const today = now.toISOString().slice(0, 10);
  let count = 0;
  for (let page = 1; page <= MAX_ISSUE_PAGES; page++) {
    const issues = await requestJson(
      repository, token, "/issues?state=all&sort=created&direction=desc&per_page=100&page=" + page,
      { fetchImpl }
    );
    if (!Array.isArray(issues)) throw new Error("Invalid GitHub issues API response");
    for (const issue of issues) {
      if (typeof issue.created_at !== "string") {
        throw new Error("Issue missing creation date; cannot enforce daily quota");
      }
      if (issue.created_at.slice(0, 10) < today) return count;
      if (issue.created_at.slice(0, 10) !== today) continue;
      if (!issue.pull_request && issue.user?.login === "github-actions[bot]" &&
        typeof issue.body === "string" && issue.body.includes("<!-- kb-ai-repair:v1:") &&
        isCopilotAssigned(issue)) count++;
    }
    if (issues.length < 100) return count;
  }
  throw new Error("Too many issues to enforce assignment quota safely");
}

async function assignCopilot({
  event, repository, readToken, userToken, fetchImpl = fetch,
  now = new Date(), log = console.log,
} = {}) {
  if (!/^[a-z\d_.-]+\/[a-z\d_.-]+$/i.test(repository || "")) {
    throw new Error("Invalid repository name");
  }
  const candidate = candidateFromEvent(event, repository);
  if (!candidate) return { status: "skipped", reason: "workflow" };
  if (!readToken) throw new Error("Missing GITHUB_TOKEN for read-only validation");
  if (!userToken) throw new Error("Missing KB_COPILOT_ASSIGNMENT_TOKEN; automation is not configured");

  const pr = await requestJson(repository, readToken, "/pulls/" + candidate.prNumber, { fetchImpl });
  if (pr.state !== "open" || pr.base?.ref !== "main" ||
      pr.head?.repo?.full_name !== repository || pr.user?.type === "Bot" ||
      !validBranch(pr.head?.ref) ||
      !SHA_PATTERN.test(pr.head?.sha || "") ||
      event.workflow_run.head_sha !== pr.head.sha) {
    log("[copilot-auto-assign] PR branch is unsafe, closed, changed or no longer current.");
    return { status: "skipped", reason: "pr" };
  }
  const jobs = await loadJobs({ repository, runId: candidate.runId, token: readToken, fetchImpl });
  const report = reportForRun({ repository, event, jobs });
  if (!eligibleForHandoff(report)) return { status: "skipped", reason: "category" };

  const issue = await findExistingHandoff(repository, candidate.prNumber, readToken, fetchImpl);
  if (!issue || !isTrustedHandoff(issue, candidate.prNumber)) {
    log("[copilot-auto-assign] No eligible trusted repair issue found.");
    return { status: "skipped", reason: "issue" };
  }
  if (isCopilotAssigned(issue)) return { status: "skipped", reason: "already-assigned" };
  if (Array.isArray(issue.assignees) && issue.assignees.length > 0) {
    return { status: "skipped", reason: "assigned-to-human" };
  }

  const todayCount = await countAssignmentsToday(repository, readToken, { fetchImpl, now });
  if (todayCount >= DAILY_LIMIT) {
    log("[copilot-auto-assign] Daily agent task cap reached.");
    return { status: "skipped", reason: "daily-cap" };
  }

  const body = {
    assignees: [COPILOT_LOGIN],
    agent_assignment: {
      target_repo: repository,
      base_branch: pr.head.ref,
      custom_instructions:
        "Only fix the failed generated-asset check for the existing pull request #" +
        candidate.prNumber + ". Read AGENTS.md, reproduce the exact CI failure, run " +
        "npm run ai:prepare and npm run ai:check, and create a separate reviewable " +
        "pull request targeting the existing branch " + pr.head.ref + ". " +
        "Do not merge, deploy, change financial formulas, disable tests, or widen scope.",
      custom_agent: "",
      model: "",
    },
  };

  const result = await requestJson(repository, userToken, "/issues/" + issue.number + "/assignees", {
    method: "POST", body, fetchImpl,
  });
  if (!isCopilotAssigned(result)) {
    throw new Error("Assignment API did not confirm Copilot assignee");
  }
  log("[copilot-auto-assign] Assigned issue #" + issue.number + " to Copilot cloud agent.");
  return { status: "assigned", issueNumber: issue.number };
}

async function main() {
  const {
    GITHUB_EVENT_PATH: eventFile,
    GITHUB_REPOSITORY: repository,
    GITHUB_TOKEN: readToken,
    KB_COPILOT_ASSIGNMENT_TOKEN: userToken,
  } = process.env;
  if (!eventFile || !repository || !readToken) throw new Error("Missing GitHub Actions environment");
  if (process.env.KB_COPILOT_AUTO_ASSIGN !== "true") {
    console.log("[copilot-auto-assign] Disabled by repository configuration.");
    return;
  }
  const event = JSON.parse(fs.readFileSync(eventFile, "utf8"));
  const result = await assignCopilot({ event, repository, readToken, userToken });
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      "Copilot agent assignment: " + result.status +
      (result.issueNumber ? " (Issue #" + result.issueNumber + ")" : "") + "\n");
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error("[copilot-auto-assign] " + error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  validBranch, isCopilotAssigned, isTrustedHandoff,
  countAssignmentsToday, assignCopilot, DAILY_LIMIT,
};

#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const FAILURE_STATES = new Set(["failure", "timed_out", "action_required"]);
const MAX_JOB_PAGES = 5;

function safeText(value, limit = 160) {
  return String(value ?? "")
    .replace(/[<>|]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, limit)
    .trim();
}

function categoryFor(step) {
  const name = String(step || "").toLowerCase();
  if (/fingerprint|cache.bust|asset.version|generated.asset/.test(name)) {
    return {
      category: "generated-assets",
      guidance: "Run npm run ai:prepare on the PR branch; review and commit only the necessary generated files, then rerun the checks.",
    };
  }
  if (/localiz|translat|language|locale|hu en de/.test(name)) {
    return {
      category: "localization",
      guidance: "Inspect the relevant HU/EN/DE content and locale tests; preserve the calculations and regenerate the localization inventory if necessary.",
    };
  }
  if (/security|secret|permission|vulnerab|dependency/.test(name)) {
    return {
      category: "security",
      guidance: "Review the security gate and its logs; do not weaken permissions, skip tests or expose secrets.",
    };
  }
  if (/browser|chrome|smoke|viewport|responsive|materializ|static.first/.test(name)) {
    return {
      category: "browser-or-render",
      guidance: "Reproduce the failing browser or static rendering case and verify it with the existing browser regression tests.",
    };
  }
  if (/math|tax|salary|finance|calculator|invariant|rule/.test(name)) {
    return {
      category: "calculation",
      guidance: "Inspect reference examples, formulas and relevant audit tests; require careful review of financial or legal behavior.",
    };
  }
  if (/lint|quality|html|schema|sitemap|seo/.test(name)) {
    return {
      category: "quality",
      guidance: "Run the relevant quality check, fix its underlying cause, and rerun npm run ai:check.",
    };
  }
  return {
    category: "unclassified",
    guidance: "Inspect the linked GitHub Actions job logs, reproduce the first failing step and repair the root cause on the same PR branch.",
  };
}

function reportForRun({ repository, event, jobs }) {
  if (!/^[a-z\d_.-]+\/[a-z\d_.-]+$/i.test(repository)) {
    throw new Error("Invalid GITHUB_REPOSITORY");
  }
  const run = event && event.workflow_run;
  if (!run || !Number.isSafeInteger(run.id) || run.id <= 0 ||
      event.repository?.full_name !== repository || run.conclusion !== "failure") {
    throw new Error("Expected a failed workflow_run event belonging to this repository");
  }
  const link = "https://github.com/" + repository + "/actions/runs/" + run.id;
  const failures = [];
  for (const job of jobs) {
    if (!FAILURE_STATES.has(job.conclusion)) continue;
    const failedSteps = (Array.isArray(job.steps) ? job.steps : [])
      .filter(step => FAILURE_STATES.has(step.conclusion));
    for (const step of failedSteps.length ? failedSteps : [{ name: "(no failed step identified)" }]) {
      const category = categoryFor(step.name === "(no failed step identified)" ? job.name : step.name);
      failures.push({
        job: safeText(job.name),
        step: safeText(step.name),
        category: category.category,
        guidance: category.guidance,
        logs_url: link + "/job/" + Number(job.id),
      });
    }
  }
  if (!failures.length) {
    failures.push({
      job: "No failed job found in the latest attempt",
      step: "Review the run details and any cancelled or missing jobs",
      category: "unclassified",
      guidance: "Inspect the linked workflow run. No cause can be confirmed from the available job metadata.",
      logs_url: link,
    });
  }
  return {
    schema_version: 1,
    repository,
    workflow: safeText(run.name),
    run_id: run.id,
    attempt: Number.isSafeInteger(run.run_attempt) ? run.run_attempt : 1,
    source_event: safeText(run.event),
    head_branch: safeText(run.head_branch),
    run_url: link,
    failures,
    limitations: "Classified from GitHub job/step metadata only; raw logs and PR code are never processed or executed. Manual log review is required before making a fix.",
  };
}

function markdownFor(report) {
  const lines = [
    "## CI failure diagnostics",
    "",
    "**Workflow:** " + report.workflow + " | **Attempt:** " + report.attempt,
    "**Run:** " + report.run_url,
    "",
    "### Failed jobs and steps",
    "",
  ];
  for (const failure of report.failures) {
    lines.push("- **" + failure.job + " / " + failure.step + "** (" + failure.category + ")");
    lines.push("  - Suggested next step: " + failure.guidance);
    lines.push("  - Logs: " + failure.logs_url);
  }
  lines.push("", "> " + report.limitations);
  lines.push("", "This report is read-only. It does not create a fix, push code, merge PRs or deploy.");
  return lines.join("\n") + "\n";
}

async function loadJobs({ repository, runId, token, fetchImpl = fetch }) {
  if (!token) throw new Error("GITHUB_TOKEN is required for read-only Actions access");
  const jobs = [];
  for (let page = 1; page <= MAX_JOB_PAGES; page++) {
    const url = "https://api.github.com/repos/" + repository +
      "/actions/runs/" + runId + "/jobs?filter=latest&per_page=100&page=" + page;
    const response = await fetchImpl(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer " + token,
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });
    if (!response.ok) throw new Error("GitHub Actions jobs API HTTP " + response.status);
    const data = await response.json();
    if (!Array.isArray(data.jobs)) throw new Error("GitHub API response has no jobs array");
    jobs.push(...data.jobs);
    if (data.jobs.length < 100) break;
    if (page === MAX_JOB_PAGES) throw new Error("Too many CI jobs to classify safely");
  }
  return jobs;
}

async function main() {
  const eventFile = process.env.GITHUB_EVENT_PATH;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!eventFile || !repository || !process.env.GITHUB_STEP_SUMMARY) {
    throw new Error("Expected the GitHub Actions workflow_run environment");
  }
  const event = JSON.parse(fs.readFileSync(eventFile, "utf8"));
  if (event.repository?.full_name !== repository ||
      event.workflow_run?.conclusion !== "failure" ||
      !Number.isSafeInteger(event.workflow_run?.id) || event.workflow_run.id <= 0) {
    throw new Error("Invalid or unrelated workflow_run event");
  }
  const jobs = await loadJobs({
    repository,
    runId: event.workflow_run.id,
    token: process.env.GITHUB_TOKEN,
  });
  const report = reportForRun({ repository, event, jobs });
  const directory = path.join(process.cwd(), "ci-failure-diagnostics");
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "report.json"), JSON.stringify(report, null, 2) + "\n");
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdownFor(report));
  console.log("CI failure report created for run " + report.run_id +
    " (" + report.failures.length + " failing steps).");
}

if (require.main === module) {
  main().catch(error => {
    console.error("[ci-diagnostics] " + error.message);
    process.exitCode = 1;
  });
}

module.exports = { categoryFor, safeText, reportForRun, markdownFor, loadJobs };

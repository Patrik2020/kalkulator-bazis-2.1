"use strict";

// One incident per repository, not one issue per scheduled probe.
// This action can be run on main/schedule only; no PR grants write access.
const { spawnSync } = require("node:child_process");

const ISSUE_TITLE = "[Production monitor] Live verification problem";

function command(args, env = process.env) {
  const r = spawnSync("gh", args, { encoding: "utf8", env });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`gh ${args[0]} failed: ${(r.stderr || "").slice(0,900)}`);
  return r.stdout.trim();
}

function incidentBody(state, runUrl) {
  const explanation = state === "inconclusive"
    ? "Cloudflare blocks the GitHub Actions runner (HTTP 403). The production audit was **skipped**. This is a monitoring blind spot, **not proof of website downtime**."
    : "Production probe or content verification failed. Confirm from a separate trusted network before identifying the cause or claiming website downtime.";
  return `### Live monitoring: ${state.toUpperCase()}\n\n${explanation}\n\n- Last change: ${runUrl}\n- Workflow: Production smoke\n- Automated issue: only one open issue is maintained\n\nThe incident automatically closes only after a **complete successful live production audit**.\n`;
}

function syncIssue({ state, repo, runUrl }, api = command) {
  if (!["verified", "inconclusive", "failed"].includes(state)) throw new Error("Unrecognized monitor state");
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo || "")) throw new Error("Invalid repository");
  if (!/^https:\/\/github\.com\//.test(runUrl || "")) throw new Error("Invalid run URL");
  const issues = JSON.parse(api(["issue", "list", "--repo", repo, "--state", "open", "--limit", "100", "--json", "number,title"]) || "[]");
  const existing = issues.find((item) => item.title === ISSUE_TITLE);

  if (state === "verified") {
    if (existing) {
      api(["issue", "close", String(existing.number), "--repo", repo,
        "--comment", `Full live audit verified recovery: ${runUrl}`]);
      return "closed";
    }
    return "nothing-to-close";
  }
  if (!existing) {
    api(["issue", "create", "--repo", repo, "--title", ISSUE_TITLE, "--body", incidentBody(state, runUrl)]);
    return "created";
  }
  // Do not create repetitive comments/notifications for recurring blocked runners.
  // Update the issue only if the kind of incident changed.
  const original = api(["issue", "view", String(existing.number), "--repo", repo, "--json", "body", "--jq", ".body"]);
  if (!original.includes(`Live monitoring: ${state.toUpperCase()}`)) {
    api(["issue", "edit", String(existing.number), "--repo", repo, "--body", incidentBody(state, runUrl)]);
    return "updated";
  }
  return "already-open";
}

if (require.main === module) {
  const state = process.env.KB_MONITOR_STATE;
  const repo = process.env.GITHUB_REPOSITORY;
  const runUrl = [process.env.GITHUB_SERVER_URL || "https://github.com", repo,
    "actions", "runs", process.env.GITHUB_RUN_ID].join("/");
  const result = syncIssue({ state, repo, runUrl });
  console.log(`Production monitoring issue sync: ${result}`);
}

module.exports = { ISSUE_TITLE, incidentBody, syncIssue };

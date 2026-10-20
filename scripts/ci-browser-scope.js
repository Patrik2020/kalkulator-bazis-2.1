"use strict";

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");

// Only explicit, non-runtime changes may omit the expensive browser matrix.
// Unknown paths fail safely toward RUNNING the browser suite.
function isEditorialOnly(file) {
  const path = String(file).replace(/\\/g, "/");
  return (
    /^docs\//.test(path) ||
    /^images\//.test(path) ||
    /^favicon\//.test(path) ||
    /^\.github\/(?:ISSUE_TEMPLATE|DISCUSSION_TEMPLATE)\//.test(path) ||
    /\.md$/i.test(path) ||
    /^aktualis\/[^/]+\.html$/i.test(path) ||
    /^sitemap(?:-[^/]*)?\.xml$/i.test(path) ||
    /^(?:robots\.txt|ads\.txt)$/i.test(path)
  );
}

function requiresBrowser(files) {
  // Unexpected empty diffs should not silently skip tests.
  return files.length === 0 || files.some((file) => !isEditorialOnly(file));
}

function classifyFromGit(env = process.env) {
  if (env.GITHUB_EVENT_NAME !== "pull_request") {
    return { required: true, files: [], reason: "main push or manual run" };
  }

  const base = env.KB_BASE_SHA || "";
  const head = env.KB_HEAD_SHA || "";
  if (![base, head].every((sha) => /^[0-9a-f]{40}$/i.test(sha))) {
    throw new Error("Missing/invalid pull request base or head SHA; refusing to skip browser QA.");
  }

  const diff = execFileSync("git", ["diff", "--name-only", "--no-renames", base, head, "--"], {
    encoding: "utf8",
  });
  const files = diff.split(/\r?\n/).filter(Boolean);
  return { required: requiresBrowser(files), files, reason: "PR file classification" };
}

if (require.main === module) {
  const result = classifyFromGit();
  if (!process.env.GITHUB_OUTPUT) throw new Error("GITHUB_OUTPUT is required.");
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `run_browser=${result.required}\n`);
  console.log(`Browser matrix ${result.required ? "required" : "editorial-only; skipped"}: ${result.files.length} changed files`);
  for (const file of result.files) console.log(`  ${file}`);
}

module.exports = { isEditorialOnly, requiresBrowser, classifyFromGit };

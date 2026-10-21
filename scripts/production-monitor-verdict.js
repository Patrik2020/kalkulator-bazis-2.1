"use strict";

const fs = require("node:fs");

function classify({ reachability, blocked, audit }) {
  if (reachability !== "success") {
    return { state: "failed", detail: `Reachability failed or did not run (${reachability || "missing"}). No live-site success can be claimed.` };
  }
  if (blocked === "true" && audit === "skipped") {
    return { state: "inconclusive", detail: "Cloudflare blocked the GitHub runner; production content was not checked. This is a monitoring coverage problem, NOT confirmed downtime." };
  }
  if (blocked === "false" && audit === "success") {
    return { state: "verified", detail: "The live production audit completed successfully, including release fingerprint and content checks." };
  }
  if (blocked === "false" && audit === "failure") {
    return { state: "failed", detail: "Production content audit failed. Investigate the audit log and compare from another network before declaring customer downtime." };
  }
  return { state: "failed", detail: `Inconsistent production job state (reachability=${reachability}, blocked=${blocked}, audit=${audit}). Verification did not complete.` };
}

function report({ state, detail }, env = process.env) {
  if (env.GITHUB_OUTPUT) fs.appendFileSync(env.GITHUB_OUTPUT, `state=${state}\n`);
  console.log(`PRODUCTION_MONITOR_STATE=${state}: ${detail}`);
  if (state !== "verified") console.log(`::warning title=Production monitoring ${state}::${detail}`);
  if (env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(env.GITHUB_STEP_SUMMARY,
      `### Production monitoring: ${state.toUpperCase()}\n\n${detail}\n\n` +
      (state === "verified" ? "The live audit passed.\n" :
        "Do not interpret this as a successful live test. Review the monitoring incident.\n"));
  }
}

if (require.main === module) {
  report(classify({
    reachability: process.env.KB_REACHABILITY_RESULT,
    blocked: process.env.KB_CLOUDFLARE_BLOCKED,
    audit: process.env.KB_PRODUCTION_RESULT
  }));
}

module.exports = { classify, report };

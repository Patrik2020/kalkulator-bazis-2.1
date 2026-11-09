#!/usr/bin/env node
"use strict";

const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const STATUS_ARGS = ["status", "--porcelain=v1", "--untracked-files=all"];

function runCommand(program, args, options = {}) {
  const executable = program === "npm" && process.platform === "win32" ? "npm.cmd" : program;
  const result = spawnSync(executable, args, {
    cwd: options.cwd || ROOT,
    encoding: "utf8",
    stdio: options.stdio || "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${program} ${args.join(" ")} failed (exit ${result.status ?? result.signal ?? "unknown"})`);
  }
  return typeof result.stdout === "string" ? result.stdout.trim() : "";
}

function assertClean(execute, stage) {
  const changes = execute("git", STATUS_ARGS, { stdio: "pipe" });
  if (!changes) return;
  throw new Error(
    `[ai:check] ${stage}: the working tree has uncommitted changes:\n${changes}\n` +
    "Inspect the diff. Run 'npm run ai:prepare' if generated assets need updating, " +
    "then review and commit only intended files before rerunning 'npm run ai:check'."
  );
}

function preflight({ mode = "check", execute = runCommand, log = console.log } = {}) {
  if (mode !== "prepare" && mode !== "check") {
    throw new Error(`Unsupported AI preflight mode: ${mode}`);
  }
  if (mode === "check") assertClean(execute, "before build");

  log("[ai] Running the canonical static build...");
  execute("npm", ["run", "static:build"]);
  execute("git", ["diff", "--check"]);

  if (mode === "prepare") {
    const changes = execute("git", STATUS_ARGS, { stdio: "pipe" });
    if (changes) log(`[ai:prepare] Review generated changes before committing:\n${changes}`);
    else log("[ai:prepare] No outstanding generated changes.");
    log("[ai:prepare] When the intended changes are committed, run 'npm run ai:check'.");
    return;
  }

  assertClean(execute, "after build");
  log("[ai] Running the repository's full quality suite...");
  execute("npm", ["run", "quality"]);
  log("[ai] Testing the canonical build pipeline...");
  execute("npm", ["run", "test:build-pipeline"]);
  execute("git", ["diff", "--check"]);
  assertClean(execute, "after checks");
  log("[ai:check] Passed locally. PR GitHub Actions checks are still required before merge.");
}

if (require.main === module) {
  try {
    preflight({ mode: process.argv.includes("--prepare") ? "prepare" : "check" });
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = { preflight, runCommand, assertClean, STATUS_ARGS };

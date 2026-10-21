"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function git(root, args) {
  const r = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${r.stderr.trim()}`);
  return r.stdout.trim();
}

function parentCount(root, commit) {
  const data = git(root, ["rev-list", "--parents", "-n", "1", commit]).split(/\s+/);
  return data.length - 1;
}

function verifyRollbackTarget(root, target) {
  if (!/^[0-9a-f]{40}$/.test(target || "")) throw new Error("Full target SHA required");
  const head = git(root, ["rev-parse", "HEAD"]);
  // For the tested rollout, only revert the latest source revision.
  // An older bad commit requires separate conflict review and fresh PR.
  if (target !== head) throw new Error("Rollback rehearsal only supports the current HEAD; never guess an older release");
  if (git(root, ["status", "--porcelain"])) throw new Error("Checkout must be clean");
  const parents = parentCount(root, target);
  if (!parents) throw new Error("Root commit cannot be reverted safely");
  return { head, parents };
}

function dryRunRollback({ root, target }) {
  const { head, parents } = verifyRollbackTarget(root, target);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "kb-rollback-drill-"));
  const worktree = path.join(temp, "checkout");
  let attached = false;
  let result;
  let rehearsalError = null;
  let cleanupError = null;
  try {
    git(root, ["worktree", "add", "--detach", worktree, head]);
    attached = true;
    const command = ["revert", "--no-commit", "--no-edit"];
    if (parents > 1) command.push("-m", "1");
    command.push(target);
    git(worktree, command);
    git(worktree, ["diff", "--cached", "--check"]);
    const affected = git(worktree, ["diff", "--cached", "--name-only", "--"]).split(/\r?\n/).filter(Boolean);
    if (!affected.length) throw new Error("Rehearsed rollback produced no tracked changes");
    result = { sourceSha: head, revertedSha: target, affected, usedMainline: parents > 1 };
  } catch (error) {
    rehearsalError = error;
  } finally {
    if (attached) {
      try {
        git(root, ["worktree", "remove", "--force", worktree]);
      } catch (error) {
        cleanupError = error;
      }
    }
    try {
      fs.rmSync(temp, { recursive: true, force: true });
    } catch (error) {
      cleanupError = cleanupError || error;
    }
  }
  if (cleanupError) {
    throw new Error(`Rollback rehearsal cleanup failed: ${cleanupError.message}${rehearsalError ? `; original error: ${rehearsalError.message}` : ""}`);
  }
  if (rehearsalError) throw rehearsalError;
  return result;
}

if (require.main === module) {
  const targetIndex = process.argv.indexOf("--target");
  const target = targetIndex < 0 ? "" : process.argv[targetIndex + 1];
  const result = dryRunRollback({ root: path.resolve(__dirname, ".."), target });
  console.log(`Safe isolated rollback rehearsal passed for ${result.revertedSha}; ${result.affected.length} files would change. Main was NOT modified.`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `### Isolated rollback drill\n\nReverted commit in temporary worktree: \`${result.revertedSha}\`\n\nAffected files: ${result.affected.length}\n\nThis is NOT a production rollback. Use a reviewed revert PR.\n`);
  }
}

module.exports = { git, parentCount, verifyRollbackTarget, dryRunRollback };

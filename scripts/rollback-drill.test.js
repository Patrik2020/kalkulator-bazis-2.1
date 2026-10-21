"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { git, verifyRollbackTarget, dryRunRollback } = require("./rollback-drill");

function repo(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-rollback-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, ["init", "-q"]);
  git(root, ["config", "user.name", "Release QA"]);
  git(root, ["config", "user.email", "release-qa@example.invalid"]);
  fs.writeFileSync(path.join(root, "site.txt"), "working version\n");
  git(root, ["add", "site.txt"]);
  git(root, ["commit", "-qm", "known good"]);
  const first = git(root, ["rev-parse", "HEAD"]);
  fs.writeFileSync(path.join(root, "site.txt"), "bad version\n");
  git(root, ["add", "site.txt"]);
  git(root, ["commit", "-qm", "bad deployment candidate"]);
  return { root, first, head: git(root, ["rev-parse", "HEAD"]) };
}

test("isolated rollback rehearsal reverts latest candidate without changing the original", (t) => {
  const r = repo(t);
  const result = dryRunRollback({ root: r.root, target: r.head });
  assert.deepEqual(result.affected, ["site.txt"]);
  assert.equal(result.usedMainline, false);
  assert.equal(git(r.root, ["rev-parse", "HEAD"]), r.head);
  assert.equal(fs.readFileSync(path.join(r.root, "site.txt"), "utf8"), "bad version\n");
  assert.equal(git(r.root, ["status", "--porcelain"]), "");
  assert.equal(git(r.root, ["worktree", "list", "--porcelain"]).match(/worktree /g)?.length, 1);
});

test("unknown, stale or dirty rollback targets are rejected", (t) => {
  const r = repo(t);
  assert.throws(() => verifyRollbackTarget(r.root, "deadbeef"), /Full target SHA/);
  assert.throws(() => verifyRollbackTarget(r.root, r.first), /current HEAD/);
  fs.writeFileSync(path.join(r.root, "untracked.txt"), "dirty");
  assert.throws(() => verifyRollbackTarget(r.root, r.head), /clean/);
});

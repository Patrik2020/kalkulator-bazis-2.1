"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { preflight } = require("./ai-preflight");

function harness(statuses = [], failingCommand = null) {
  const calls = [];
  const messages = [];
  let read = 0;
  function execute(program, args) {
    const label = `${program} ${args.join(" ")}`;
    calls.push(label);
    if (failingCommand === label) throw new Error(`${label} failed`);
    if (label === "git status --porcelain=v1 --untracked-files=all") {
      return statuses[read++] || "";
    }
    return "";
  }
  return { execute, calls, messages, log: (message) => messages.push(message) };
}

test("check runs build, quality and build contract on a clean tree", () => {
  const h = harness();
  preflight({ execute: h.execute, log: h.log });
  assert.deepEqual(h.calls, [
    "git status --porcelain=v1 --untracked-files=all",
    "npm run static:build",
    "git diff --check",
    "git status --porcelain=v1 --untracked-files=all",
    "npm run quality",
    "npm run test:build-pipeline",
    "git diff --check",
    "git status --porcelain=v1 --untracked-files=all",
  ]);
});

test("check stops before any build if there are local changes", () => {
  const h = harness([" M index.html"]);
  assert.throws(() => preflight({ execute: h.execute, log: h.log }), /before build/);
  assert.equal(h.calls.length, 1);
});

test("check detects generated drift and does not run expensive quality checks", () => {
  const h = harness(["", " M index.html"]);
  assert.throws(() => preflight({ execute: h.execute, log: h.log }), /after build/);
  assert.equal(h.calls.includes("npm run quality"), false);
});

test("prepare builds on a dirty working tree but does not stage or commit changes", () => {
  const h = harness([" M index.html"]);
  preflight({ mode: "prepare", execute: h.execute, log: h.log });
  assert.deepEqual(h.calls, [
    "npm run static:build",
    "git diff --check",
    "git status --porcelain=v1 --untracked-files=all",
  ]);
  assert.match(h.messages.join("\n"), /Review generated changes/);
});

test("check propagates a quality failure without reporting success", () => {
  const h = harness([], "npm run quality");
  assert.throws(() => preflight({ execute: h.execute, log: h.log }), /quality failed/);
  assert.equal(h.calls.includes("npm run test:build-pipeline"), false);
});

test("check catches modifications introduced during quality checks", () => {
  const h = harness(["", "", " M css/style.css"]);
  assert.throws(() => preflight({ execute: h.execute, log: h.log }), /after checks/);
});

test("rejects unknown preflight modes", () => {
  const h = harness();
  assert.throws(() => preflight({ mode: "bypass", execute: h.execute, log: h.log }), /Unsupported/);
  assert.equal(h.calls.length, 0);
});

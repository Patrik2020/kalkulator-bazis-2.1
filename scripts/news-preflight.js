#!/usr/bin/env node
"use strict";
// News changes are built and checked before a PR is submitted.
// --check verifies that the committed generated files are already up to date.
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
const check = process.argv.includes("--check");
if (!check) run("npm", ["run", "static:build"]);
run("npm", ["run", "quality"]);
if (check) {
  run("npm", ["run", "static:verify"]);
} else {
  console.log("\nNews preflight passed. Review and commit ALL generated changes together.");
}

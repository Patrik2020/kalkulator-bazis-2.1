#!/usr/bin/env node
"use strict";
// Run from repository root before committing a news update.
// The canonical build already handles homepage fragments, asset fingerprints and sitemap.
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
run("npm", ["run", "static:build"]);
run("npm", ["run", "quality"]);
console.log("\nNews preflight passed. Review and commit ALL generated changes together.");

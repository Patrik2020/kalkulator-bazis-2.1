#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const sourceDirectories = ["js", "scripts", "worker/src"];

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

const files = sourceDirectories
  .flatMap((directory) => walk(path.join(root, directory)))
  .filter((file) => file.endsWith(".js"))
  .sort();

const failures = [];

files.forEach((file) => {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const isModule = relative.startsWith("worker/src/");
  const result = isModule
    ? spawnSync(process.execPath, ["--input-type=module", "--check"], {
        cwd: root,
        encoding: "utf8",
        input: fs.readFileSync(file, "utf8"),
      })
    : spawnSync(process.execPath, ["--check", file], {
        cwd: root,
        encoding: "utf8",
      });

  if (result.status !== 0) {
    failures.push({ file: relative, error: (result.stderr || result.stdout).trim() });
  }
});

if (failures.length) {
  failures.forEach(({ file, error }) => console.error(`\n${file}\n${error}`));
  process.exit(1);
}

console.log(`JavaScript syntax: ${files.length}/${files.length} files passed`);

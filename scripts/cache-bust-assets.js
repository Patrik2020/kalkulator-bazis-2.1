#!/usr/bin/env node
"use strict";
const path = require("node:path");
const { createAssetVersions } = require("./asset-versions");
const versions = createAssetVersions(path.resolve(__dirname, ".."));
if (process.argv.includes("--check")) {
  const result = versions.audit();
  if (result.failures.length) throw new Error(result.failures.join("\n"));
  console.log(`Asset versions OK: ${result.references} local references match their content.`);
} else {
  const result = versions.refresh();
  console.log(`Cache busting kész: ${result.files} forrás ellenőrizve, ${result.changed} fájl frissítve, service worker: ${result.version}.`);
}

"use strict";
const path = require("node:path");
const { createAssetVersions } = require("./asset-versions");
const result = createAssetVersions(path.resolve(__dirname, "..")).audit();
if (result.failures.length) {
  console.error("Asset version audit hibák:");
  result.failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Asset version audit OK: ${result.references} HTML/JS/CSS hivatkozás tényleges content-hash egyezéssel, service worker fingerprint rendben.`);

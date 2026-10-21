"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const REQUIRED_RELEASE_FILES = Object.freeze([
  "index.html", "sw.js", "CNAME", "robots.txt", "ads.txt", "sitemap.xml",
  "js/cookie.js", "js/publisher-ads.js", "js/global-head-config.js",
  "js/site-ui.js", "kalkulatorok/netto-brutto-kalkulator.html"
]);

function serviceWorkerVersion(source) {
  const match = String(source).match(/\bconst\s+KB_SW_VERSION\s*=\s*["'](build-[a-f0-9]{12})["']\s*;/);
  if (!match) throw new Error("Missing/malformed KB_SW_VERSION release marker");
  return match[1];
}

function assertSameRelease({ expected, actual }) {
  if (typeof expected !== "string" || !/^build-[a-f0-9]{12}$/.test(expected)) {
    throw new Error("Invalid expected release marker");
  }
  if (serviceWorkerVersion(actual) !== expected) {
    throw new Error(`Deployed service worker version differs from checked-out release: expected ${expected}, got ${serviceWorkerVersion(actual)}`);
  }
  return true;
}

function releaseManifest({ root, sha }) {
  if (!/^[a-f0-9]{40}$/.test(sha || "")) throw new Error("Release commit must be a full 40-character git SHA");
  const files = {};
  for (const relative of REQUIRED_RELEASE_FILES) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      throw new Error(`Missing release file: ${relative}`);
    }
    files[relative] = crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
  }
  return {
    schema: 1,
    sourceSha: sha,
    swVersion: serviceWorkerVersion(fs.readFileSync(path.join(root, "sw.js"), "utf8")),
    files
  };
}

module.exports = { REQUIRED_RELEASE_FILES, serviceWorkerVersion, assertSameRelease, releaseManifest };

if (require.main === module) {
  const output = process.env.KB_RELEASE_MANIFEST_PATH;
  const sha = process.env.GITHUB_SHA;
  if (!output) throw new Error("KB_RELEASE_MANIFEST_PATH is required");
  const manifest = releaseManifest({ root: path.resolve(__dirname, ".."), sha });
  fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Release candidate: ${manifest.sourceSha} / ${manifest.swVersion} / ${Object.keys(manifest.files).length} protected files`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `### Release candidate (not live verification)\n\nCommit: \`${manifest.sourceSha}\`\n\nSW version: \`${manifest.swVersion}\`\n\nThis artifact is a source fingerprint, not proof of external reachability.\n`);
  }
}

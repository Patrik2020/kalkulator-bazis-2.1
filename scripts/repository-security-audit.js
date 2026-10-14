#!/usr/bin/env node
"use strict";

// Fail on accidentally versioned sensitive files, recognizable credentials,
// and write-capable PR workflows. This intentionally does not mutate anything.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const files = execFileSync("git", ["ls-files", "-z"], { cwd: root })
  .toString("utf8").split("\0").filter(Boolean);
const errors = [];
const sensitivePath = /(^|\/)(?:\.env(?:\..*)?|\.dev\.vars(?:\..*)?|id_(?:rsa|ed25519)|(?:secrets?|credentials?)(?:[._-][^/]*)?|[^/]+\.(?:pem|p12|pfx|key))$/i;
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /\bghp_[A-Za-z0-9]{36}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{50,}\b/,
  /\bsk-proj-[A-Za-z0-9_-]{24,}\b/
];

for (const filename of files) {
  const normalized = filename.replace(/\\/g, "/");
  if (sensitivePath.test(normalized) && !/\.env\.example$/i.test(normalized)) {
    errors.push(`Tracked sensitive filename: ${normalized}`);
  }

  if (!/\.(?:js|ts|jsx|tsx|html|json|ya?ml|md|txt|env)$/i.test(normalized)) continue;
  const file = path.resolve(root, normalized);
  if (!file.startsWith(root + path.sep) || !fs.statSync(file).isFile()) continue;
  if (fs.statSync(file).size > 2 * 1024 * 1024) continue;
  const content = fs.readFileSync(file, "utf8");

  if (patterns.some((pattern) => pattern.test(content))) {
    // Never print suspected secret values in logs.
    errors.push(`Possible credential in tracked file: ${normalized}`);
  }
  if (normalized.startsWith(".github/workflows/")) {
    if (/^\s{2}pull_request\s*:/m.test(content) && !/^permissions:\s*\n\s{2}contents:\s*read\s*$/m.test(content)) {
      errors.push(`Missing read-only workflow permissions in ${normalized}`);
    }
    for (const action of content.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)/gm)) {
      const source = action[1];
      if (!/^[^/]+\/[^@]+@[0-9a-f]{40}$/.test(source) && !source.startsWith("./")) {
        errors.push(`Unpinned external GitHub Action in ${normalized}: ${source.split("@")[0]}`);
      }
    }
    if (/^\s{0,2}pull_request_target\s*:/m.test(content)) {
      errors.push(`Unsafe pull_request_target workflow: ${normalized}`);
    }
    if (/^\s{2}contents:\s*write\s*$/m.test(content) &&
        /^\s{2}pull_request\s*:/m.test(content)) {
      errors.push(`Write-capable pull_request workflow: ${normalized}`);
    }
  }
}

const headers = fs.readFileSync(path.join(root, "_headers"), "utf8");
for (const header of ["Strict-Transport-Security:", "Content-Security-Policy:",
  "X-Content-Type-Options:", "Referrer-Policy:", "Permissions-Policy:"]) {
  if (!headers.includes(header)) errors.push(`Missing security header: ${header}`);
}

if (errors.length) {
  console.error("Repository security baseline failed:");
  errors.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`Repository security baseline OK: ${files.length} tracked files examined.`);

#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const defaultRoot = path.resolve(__dirname, "..");

const pipeline = Object.freeze([
  Object.freeze({
    id: "source",
    label: "Forrás- és tartalmi transzformációk",
    steps: Object.freeze([
      "apply-global-head-config.js",
      "quarantine-legacy-category-generator.js",
      "apply-category-taxonomy.js",
      "apply-seo-overrides.js",
      "apply-speed-intent-handoff.js",
      "apply-beton-intent-upgrade.js",
      "apply-periodic-settlement-upgrade.js",
      "apply-finance-deep-upgrades.js",
      "apply-health-model-upgrades.js",
      "apply-auto-model-upgrades.js",
      "apply-auto-financial-edge-upgrades.js",
      "apply-auto-content-consistency.js",
      "apply-construction-model-upgrades.js",
      "apply-construction-manufacturer-guards.js",
      "apply-plaster-consumption-mode.js",
      "apply-roof-purchase-mode.js",
      "apply-insulation-package-guidance.js",
      "apply-drywall-system-guidance.js",
      "apply-construction-confirmation-ux.js",
      "apply-adsense-template-fingerprint-v2.js",
      "apply-adsense-domain-method-copy-v2.js",
      "apply-construction-manufacturer-first-v2.js",
      "apply-adsense-ymyl-trust-v2.js",
      "apply-adsense-source-notes-v2.js",
      "apply-adsense-current-moat-v2.js",
      "apply-adsense-phase2-consolidation.js",
      "apply-adsense-phase2-batch2.js",
      "apply-average-hub-quality-blocks.js",
      "apply-average-hub-runtime-guard.js",
      "apply-adsense-eligibility-v2.js",
      "apply-adsense-audit-policy-v2.js",
    ]),
  }),
  Object.freeze({
    id: "render",
    label: "Egyszeri böngészős materializálás",
    steps: Object.freeze(["materialize-static-first.js"]),
  }),
  Object.freeze({
    id: "finalize",
    label: "Végső normalizálás és indexelési kimenet",
    steps: Object.freeze([
      "normalize-static-html.js",
      "normalize-a11y-html.js",
      "normalize-retention-static.js",
      "sync-home-fragments.js",
      "cache-bust-assets.js",
      "generate-sitemap.js",
    ]),
  }),
]);

function executeStep(step, { root = defaultRoot } = {}) {
  const result = spawnSync(process.execPath, [path.join(root, "scripts", step)], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${step} hibakóddal állt le: ${result.status ?? result.signal ?? "ismeretlen"}`);
  }
}

function runPipeline({ root = defaultRoot, runStep = executeStep } = {}) {
  const started = Date.now();
  for (const phase of pipeline) {
    console.log(`\n[static:build] ${phase.label}`);
    phase.steps.forEach((step, index) => {
      console.log(`[static:build] ${phase.id} ${index + 1}/${phase.steps.length}: ${step}`);
      runStep(step, { root, phase: phase.id });
    });
  }
  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\n[static:build] Egyetlen kanonikus buildkör kész (${seconds} s).`);
}

function git(root, args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "buffer" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} hibakóddal állt le: ${result.status}`);
  }
  return result.stdout;
}

function workingTreeFingerprint(root = defaultRoot) {
  const hash = crypto.createHash("sha256");
  hash.update(git(root, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]));
  hash.update(git(root, ["diff", "--binary", "--no-ext-diff", "HEAD", "--", "."]));
  hash.update(git(root, ["diff", "--binary", "--no-ext-diff", "--cached", "HEAD", "--", "."]));

  const untracked = git(root, ["ls-files", "--others", "--exclude-standard", "-z"])
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .sort();
  for (const relative of untracked) {
    const absolute = path.join(root, relative);
    hash.update(relative);
    hash.update(fs.lstatSync(absolute).isSymbolicLink() ? fs.readlinkSync(absolute) : fs.readFileSync(absolute));
  }
  return hash.digest("hex");
}

function verifyIdempotence({
  root = defaultRoot,
  capture = workingTreeFingerprint,
  run = runPipeline,
} = {}) {
  const before = capture(root);
  run({ root });
  const after = capture(root);
  if (before !== after) {
    throw new Error(
      "A kanonikus build második futása további eltérést hozott létre. " +
      "A generátor nem idempotens; a git diff megmutatja a fennmaradó driftet."
    );
  }
  console.log("[static:verify] Idempotencia rendben: a második futás nem módosította a kimenetet.");
}

if (require.main === module) {
  try {
    if (process.argv.includes("--verify-idempotence")) verifyIdempotence();
    else runPipeline();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  executeStep,
  pipeline,
  runPipeline,
  verifyIdempotence,
  workingTreeFingerprint,
};

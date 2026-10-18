"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadAdsensePolicy(root = path.resolve(__dirname, "..")) {
  const configPath = path.join(root, "js", "global-head-config.js");
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(configPath, "utf8"), sandbox, { filename: configPath });
  const policy = sandbox.window.KB_GLOBAL_HEAD_CONFIG?.adsensePolicy;
  if (!policy || typeof policy !== "object" || typeof policy.isEligible !== "function") {
    throw new Error("A KB_GLOBAL_HEAD_CONFIG.adsensePolicy hiányzik vagy hibás.");
  }

  const requiredExactGroups = ["categoryHubs", "trustAndLegal", "retiredCalculators"];
  const requiredPrefixGroups = ["partnerPages"];
  const lists = [policy.groups?.eligibleExact, policy.groups?.eligiblePrefixes];
  for (const group of requiredExactGroups) lists.push(policy.groups?.excludedExact?.[group]);
  for (const group of requiredPrefixGroups) lists.push(policy.groups?.excludedPrefixes?.[group]);
  if (lists.some((list) => !Array.isArray(list))) {
    throw new Error("Az AdSense policy kötelező útvonalcsoportjai hiányosak.");
  }

  const allEntries = lists.flatMap((list) => [...list]);
  if (allEntries.some((entry) => typeof entry !== "string")) {
    throw new Error("Az AdSense policy minden útvonalának szövegnek kell lennie.");
  }
  if (lists.some((list) => new Set(list).size !== list.length)) {
    throw new Error("Az AdSense policy egyik útvonalcsoportja duplikált elemet tartalmaz.");
  }

  const exactEntries = [
    ...policy.groups.eligibleExact,
    ...Object.values(policy.groups.excludedExact).flat(),
  ];
  for (const entry of exactEntries) {
    if (entry !== policy.normalizePath(entry)) {
      throw new Error(`Az AdSense policy nem normalizált pontos útvonala: ${entry}`);
    }
  }
  const prefixEntries = [
    ...policy.groups.eligiblePrefixes,
    ...Object.values(policy.groups.excludedPrefixes).flat(),
  ];
  if (prefixEntries.some((prefix) => !prefix || !prefix.endsWith("/") || prefix.startsWith("/"))) {
    throw new Error("Az AdSense policy prefixeinek relatív, perjellel záródó útvonalaknak kell lenniük.");
  }

  const excluded = new Set(Object.values(policy.groups.excludedExact).flat());
  const conflicts = policy.groups.eligibleExact.filter((entry) => excluded.has(entry));
  if (conflicts.length) {
    throw new Error(`Az AdSense policy egyszerre engedélyez és tilt útvonalat: ${conflicts.join(", ")}`);
  }
  return policy;
}

module.exports = { loadAdsensePolicy };

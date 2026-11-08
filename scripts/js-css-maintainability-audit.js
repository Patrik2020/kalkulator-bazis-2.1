#!/usr/bin/env node
"use strict";

// Read-only heuristics. Matches are review leads, not proof of dead code or broken CSS.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const ROOT = path.resolve(__dirname, "..");

const countMatches = (source, pattern) => [...source.matchAll(pattern)].length;
const lineOf = (text, offset) => text.slice(0, offset).split("\n").length;
const unique = (items) => [...new Set(items)];

function trackedFiles(root = ROOT) {
  return execFileSync("git", ["ls-files", "-z"], { cwd: root })
    .toString("utf8").split("\0").filter(Boolean);
}

function localAsset(ref, fromFile) {
  if (!ref || /^(?:https?:|data:|blob:|\/\/|#)/i.test(ref)) return null;
  if (ref.includes("{") || ref.includes("}")) return null;
  const clean = ref.split(/[?#]/)[0].trim();
  if (!clean) return null;
  const relative = clean.startsWith("/")
    ? clean.replace(/^\/+/, "")
    : path.posix.join(path.posix.dirname(fromFile), clean);
  return path.posix.normalize(relative);
}

function cssReview(file, content, tracked) {
  const missing = [];
  const assetUrls = [];
  for (const match of content.matchAll(/url\(\s*(["']?)([^)'"]+)\1\s*\)/g)) {
    const actual = localAsset(match[2], file);
    if (!actual) continue;
    assetUrls.push(actual);
    if (!tracked.has(actual)) {
      missing.push({ source: file, line: lineOf(content, match.index), target: actual });
    }
  }
  const selectors = new Map();
  const rules = content.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of rules.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1].trim().replace(/\s+/g, " ");
    if (!selector || selector.startsWith("@")) continue;
    selectors.set(selector, (selectors.get(selector) || 0) + 1);
  }
  const repeatedSelectors = [...selectors].filter(([, count]) => count > 1)
    .sort((left, right) => right[1] - left[1]);
  return {
    path: file,
    bytes: Buffer.byteLength(content),
    important: countMatches(content, /!important\b/gi),
    repeatedSelectorCandidates: repeatedSelectors.length,
    repeatedSelectorExamples: repeatedSelectors.slice(0, 8)
      .map(([selector, count]) => ({ selector, count })),
    localAssetRefs: assetUrls.length,
    missingLocalAssetRefs: missing,
  };
}

function activeHomeSelectorHints(indexHtml, indexCss) {
  const inHtml = new Set();
  for (const match of indexHtml.matchAll(/\bclass\s*=\s*(["'])(.*?)\1/gi)) {
    for (const name of match[2].split(/\s+/).filter(Boolean)) inHtml.add(name);
  }
  const fromCss = unique([...indexCss.matchAll(/\.([a-zA-Z_][\w-]*)/g)]
    .map((match) => match[1]));
  const notInStaticDom = fromCss.filter((name) => !inHtml.has(name));
  return {
    cssClassTokens: fromCss.length,
    matchedStaticHtml: fromCss.length - notInStaticDom.length,
    notInStaticHtml: notInStaticDom.length,
    sampleUnmatched: notInStaticDom.slice(0, 30),
    warning: "Unmatched in STATIC HTML, not proven unused: JavaScript may add classes.",
  };
}

function featureOverlap(config) {
  const features = [];
  const pattern = /slugFeature\(\s*"([^"]+)"\s*,\s*\[([\s\S]*?)\]\s*,\s*\[([^\]]*)\]\s*,\s*\[([^\]]*)\]\s*\)/g;
  for (const match of config.matchAll(pattern)) {
    features.push({
      id: match[1],
      pages: [...match[2].matchAll(/"([^"]+)"/g)].map((item) => item[1]),
    });
  }
  const pages = new Map();
  for (const feature of features) for (const page of feature.pages) {
    if (!pages.has(page)) pages.set(page, []);
    pages.get(page).push(feature.id);
  }
  const multiple = [...pages.entries()].filter(([, names]) => names.length > 1);
  return {
    featureFamilies: features.length,
    distinctConfiguredSlugs: pages.size,
    slugsWithMultipleFeatureFamilies: multiple.length,
    examples: multiple.slice(0, 24).map(([slug, families]) => ({ slug, families })),
    warning: "Multiple feature families are not necessarily duplicate UI or event handlers.",
  };
}

function audit(root = ROOT, filePaths = trackedFiles(root)) {
  const listed = new Set(filePaths);
  const css = [], js = [];
  for (const filename of filePaths) {
    if (filename.startsWith("css/") && filename.endsWith(".css")) {
      css.push(cssReview(filename, fs.readFileSync(path.join(root, filename), "utf8"), listed));
    }
    if (filename.startsWith("js/") && filename.endsWith(".js")) {
      const content = fs.readFileSync(path.join(root, filename), "utf8");
      js.push({
        path: filename,
        bytes: Buffer.byteLength(content),
        listenerSites: countMatches(content, /\.addEventListener\s*\(/g),
        domWriteSites: countMatches(content, /\.appendChild\s*\(|\.innerHTML\s*=|\.replaceChildren\s*\(|\.insertAdjacentHTML\s*\(/g),
      });
    }
  }
  const sum = (items, key) => items.reduce((acc, item) => acc + item[key], 0);
  const missing = css.flatMap((item) => item.missingLocalAssetRefs);
  const indexPath = path.join(root, "index.html");
  const indexCssPath = path.join(root, "css/pages/index.css");
  const configPath = path.join(root, "js/global-head-config.js");
  return {
    source: "git-tracked sources; read-only static analysis",
    cssFiles: css.length,
    jsBrowserFiles: js.length,
    cssImportantOccurrences: sum(css, "important"),
    cssRepeatSelectorCandidates: sum(css, "repeatedSelectorCandidates"),
    cssLocalAssetRefs: sum(css, "localAssetRefs"),
    cssMissingAssetRefs: missing,
    topImportantFiles: [...css].sort((a, b) => b.important - a.important).slice(0, 14)
      .map((item) => ({ path: item.path, count: item.important, repeated: item.repeatedSelectorCandidates })),
    topRepeatedSelectorFiles: [...css].sort((a, b) => b.repeatedSelectorCandidates - a.repeatedSelectorCandidates).slice(0, 10)
      .map((item) => ({ path: item.path, repeated: item.repeatedSelectorCandidates, examples: item.repeatedSelectorExamples.slice(0, 3) })),
    jsListenerSites: sum(js, "listenerSites"),
    jsDomWriteSites: sum(js, "domWriteSites"),
    topEventModules: [...js].sort((a, b) => b.listenerSites - a.listenerSites).slice(0, 15),
    homeSelectorHints: fs.existsSync(indexPath) && fs.existsSync(indexCssPath)
      ? activeHomeSelectorHints(fs.readFileSync(indexPath, "utf8"), fs.readFileSync(indexCssPath, "utf8")) : null,
    pageFeatureOverlap: fs.existsSync(configPath)
      ? featureOverlap(fs.readFileSync(configPath, "utf8")) : null,
    caveat: "No deletions. CSS/media contexts, JavaScript-generated DOM, fallback mode and CSS cascade require browser-level confirmation.",
  };
}

function main() {
  const report = audit();
  if (process.argv.includes("--json")) return console.log(JSON.stringify(report, null, 2));
  console.log("JS/CSS maintainability review (read-only)");
  console.log("Browser JS files: " + report.jsBrowserFiles + ", CSS files: " + report.cssFiles);
  console.log("CSS !important: " + report.cssImportantOccurrences +
    ", repeated-selector leads: " + report.cssRepeatSelectorCandidates);
  console.log("CSS local asset refs: " + report.cssLocalAssetRefs +
    ", missing-asset leads: " + report.cssMissingAssetRefs.length);
  report.cssMissingAssetRefs.slice(0, 22).forEach((item) =>
    console.log("  missing? " + item.source + ":" + item.line + " -> " + item.target));
  console.log("Top !important: " + JSON.stringify(report.topImportantFiles.slice(0, 8)));
  console.log("Top selector repeats: " + JSON.stringify(report.topRepeatedSelectorFiles.slice(0, 4)));
  console.log("JS listener sites: " + report.jsListenerSites + ", DOM write sites: " + report.jsDomWriteSites);
  console.log("Top JS event modules: " + JSON.stringify(report.topEventModules.slice(0, 8)));
  console.log("Home CSS static match: " + JSON.stringify(report.homeSelectorHints));
  console.log("Configured feature overlap: " + JSON.stringify(report.pageFeatureOverlap));
  console.log(report.caveat);
}

if (require.main === module) main();
module.exports = { localAsset, cssReview, activeHomeSelectorHints, featureOverlap, audit };

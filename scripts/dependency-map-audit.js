#!/usr/bin/env node
"use strict";

// Conservative, read-only inventory. No "unused" verdicts from static matches.
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");

function tracked(directory = root) {
  return execFileSync("git", ["ls-files", "-z"], { cwd: directory })
    .toString("utf8").split("\0").filter(Boolean).sort();
}

function resolveLocal(source, raw, files, mode = "relative") {
  if (!raw || /^(?:data:|mailto:|tel:|javascript:|blob:|#|\/\/)/i.test(raw)) return null;
  if (raw.includes("$") || raw.includes("{") || raw.includes("}")) return { dynamic: true };
  let value = raw.replace(/&amp;/g, "&").split(/[?#]/)[0];
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    if (!/^https?:\/\/(?:www\.)?kalkulatorbazis\.hu(?:\/|$)/i.test(value)) return null;
    value = value.replace(/^https?:\/\/(?:www\.)?kalkulatorbazis\.hu/i, "/");
  }
  if (/^[a-z][\w+.-]*:/i.test(value)) return null;
  const base = mode === "root" || value.startsWith("/") ? "" : path.posix.dirname(source);
  const target = path.posix.normalize(path.posix.join(base, value.replace(/^\/+/, "")));
  if (target === "." || target === "./" || target === "") {
    return { target: "index.html", exists: files.has("index.html") };
  }
  if (target.startsWith("../")) return { target, exists: false };
  const withoutSlash = target.replace(/\/+$/, "");
  const options = [target, withoutSlash + ".html", withoutSlash + "/index.html"];
  const actual = options.find((candidate) => files.has(candidate));
  return { target: actual || target, exists: Boolean(actual) };
}

function attributes(tag) {
  const found = {};
  for (const match of tag.matchAll(/\b([a-z][\w:-]*)\s*=\s*(["'])(.*?)\2/gi)) {
    found[match[1].toLowerCase()] = match[3];
  }
  return found;
}

function dependencyMap(directory = root, paths = tracked(directory)) {
  const files = new Set(paths);
  const edges = [];
  const dynamicFiles = new Set();
  const unreadable = [];
  const add = (source, kind, raw, mode = "relative") => {
    const ref = resolveLocal(source, raw, files, mode);
    if (!ref) return;
    if (ref.dynamic) { dynamicFiles.add(source); return; }
    edges.push({ source, kind, target: ref.target, exists: ref.exists });
  };

  for (const source of paths) {
    const ext = path.posix.extname(source);
    if (![".html", ".inc", ".css", ".js", ".mjs", ".yml", ".json", ".webmanifest"].includes(ext) ||
        source === "package-lock.json") continue;
    let content;
    try { content = fs.readFileSync(path.join(directory, source), "utf8"); }
    catch (_) { unreadable.push(source); continue; }

    if (ext === ".html" || ext === ".inc") {
      for (const match of content.matchAll(/<(script|link|img|source|a|iframe|video)\b[^>]*>/gi)) {
        const tag = match[1].toLowerCase();
        const attr = attributes(match[0]);
        const raw = tag === "a" || tag === "link" ? attr.href : attr.src;
        const kind = tag === "script" ? "html-script" :
          tag === "link" && /stylesheet/i.test(attr.rel || "") ? "html-style" :
            tag === "a" ? "html-link" : "html-asset";
        if (raw) add(source, kind, raw);
        if (attr.srcset) for (const value of attr.srcset.split(",")) {
          add(source, "html-srcset", value.trim().split(/\s+/)[0]);
        }
      }
    }

    if (ext === ".css") {
      for (const match of content.matchAll(/@import\s+(?:url\(\s*)?(["']?)([^"')\s;]+)\1/gi)) {
        add(source, "css-import", match[2]);
      }
      for (const match of content.matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi)) {
        add(source, "css-url", match[2].trim());
      }
    }

    if (ext === ".js" || ext === ".mjs") {
      for (const match of content.matchAll(/\b(?:require|importScripts|import)\s*\(\s*(["'])([^"']+)\1\s*\)/g)) {
        if (match[2].startsWith(".")) {
          const suffix = path.posix.extname(match[2]) ? "" : ".js";
          add(source, "js-import", match[2] + suffix);
        }
      }
      for (const match of content.matchAll(/\b(?:from|import)\s+(["'])(\.{1,2}\/[^"']+)\1/g)) {
        add(source, "js-import", match[2] + (path.posix.extname(match[2]) ? "" : ".js"));
      }
      // Hints: these literals may be dynamically assembled; do not infer use/non-use.
      for (const match of content.matchAll(/(["'])(\/?(?:js|css|scripts|components|images|assets|favicon|fragments|kalkulatorok|aktualis|landing-pages|worker|data)\/[^"'\s]+)\1/g)) {
        add(source, "js-path-hint", match[2], "root");
      }
      if (source === "scripts/static-build-pipeline.js") {
        for (const match of content.matchAll(/(["'])([\w-]+\.js)\1/g)) {
          add(source, "build-stage", "scripts/" + match[2], "root");
        }
      }
      if (content.includes("createElement(\"script\")") || content.includes("createElement('script')") ||
          content.includes("import(") || content.includes("require(")) dynamicFiles.add(source);
    }

    if (source === "package.json" || ext === ".yml") {
      for (const match of content.matchAll(/\b(?:scripts\/[\w./-]+\.(?:js|mjs))/g)) {
        add(source, "config-path", match[0], "root");
      }
    }

    if (source === "sw.js") {
      for (const match of content.matchAll(/(["'])(\.\/[^"']+)\1/g)) {
        add(source, "sw-precache-hint", match[2]);
      }
    }

    if (source.endsWith(".webmanifest")) {
      try {
        for (const icon of JSON.parse(content).icons || []) {
          if (icon.src) add(source, "manifest-icon", icon.src);
        }
      } catch (_) { unreadable.push(source + " (invalid JSON)"); }
    }
  }

  const countsByKind = {};
  const referenced = new Set();
  for (const e of edges) {
    countsByKind[e.kind] = (countsByKind[e.kind] || 0) + 1;
    if (e.exists) referenced.add(e.target);
  }
  const unresolved = edges.filter((e) => !e.exists);
  const strong = unresolved.filter((e) => ["html-script", "html-style", "css-import", "manifest-icon"].includes(e.kind));
  const candidateFiles = paths.filter((p) => /^(js|css)\//.test(p) && !referenced.has(p));
  const byDirectory = {};
  for (const p of paths) {
    const part = p.split("/")[0];
    byDirectory[part] = (byDirectory[part] || 0) + 1;
  }
  return {
    tracked: paths.length,
    byDirectory,
    edges: edges.length,
    edgesByKind: countsByKind,
    resolvedTargets: referenced.size,
    unresolvedStrong: strong,
    unresolvedOtherCount: unresolved.length - strong.length,
    unresolvedOtherSample: unresolved.filter((e) => !strong.includes(e)).slice(0,25),
    unreferencedCandidateCount: candidateFiles.length,
    unreferencedCandidateSample: candidateFiles.slice(0,25),
    dynamicHintFileCount: dynamicFiles.size,
    unreadable,
    limitation: "Heuristic only: dynamic scripts, generators, Cloudflare routes and usage by tests may not be proven. No deletion verdict.",
  };
}

function main() {
  const result = dependencyMap();
  if (process.argv.includes("--json")) return console.log(JSON.stringify(result, null, 2));
  console.log("Read-only dependency inventory");
  console.log("Files=" + result.tracked + " edges=" + result.edges + " targets=" + result.resolvedTargets);
  console.log("Reference kinds: " + JSON.stringify(result.edgesByKind));
  console.log("Strong unresolved candidates=" + result.unresolvedStrong.length);
  result.unresolvedStrong.slice(0,25).forEach((x) => console.log("  " + x.kind + " " + x.source + " -> " + x.target));
  console.log("Other unresolved candidates=" + result.unresolvedOtherCount);
  result.unresolvedOtherSample.slice(0,15).forEach((x) =>
    console.log("  candidate: " + x.kind + " " + x.source + " -> " + x.target));
  console.log("Zero-inbound JS/CSS candidates, NOT deletable=" + result.unreferencedCandidateCount);
  result.unreferencedCandidateSample.forEach((x) => console.log("  investigate-only: " + x));
  console.log("Dynamic hints=" + result.dynamicHintFileCount);
  console.log(result.limitation);
}

if (require.main === module) main();
module.exports = { tracked, resolveLocal, attributes, dependencyMap };

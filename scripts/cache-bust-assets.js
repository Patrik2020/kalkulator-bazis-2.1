#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const HASH_LENGTH = 12;
const MAX_DYNAMIC_PASSES = 8;
const SKIP_DIRS = new Set([".git", "node_modules"]);
const SERVICE_WORKER_FILE = path.join(ROOT, "sw.js");

const hashCache = new Map();

function walk(directory, predicate, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolute, predicate, files);
    } else if (predicate(absolute)) {
      files.push(absolute);
    }
  }
  return files;
}

function fileHash(filePath) {
  const stat = fs.statSync(filePath);
  const cached = hashCache.get(filePath);
  if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
    return cached.hash;
  }
  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex")
    .slice(0, HASH_LENGTH);
  hashCache.set(filePath, { mtimeMs: stat.mtimeMs, size: stat.size, hash });
  return hash;
}

function invalidateHash(filePath) {
  hashCache.delete(filePath);
}

function isExternalUrl(value) {
  return /^(?:[a-z]+:|\/\/|#)/i.test(value);
}

function parseAssetUrl(rawValue) {
  const hashIndex = rawValue.indexOf("#");
  const fragment = hashIndex >= 0 ? rawValue.slice(hashIndex) : "";
  const withoutFragment = hashIndex >= 0 ? rawValue.slice(0, hashIndex) : rawValue;
  const queryIndex = withoutFragment.indexOf("?");
  const pathname = queryIndex >= 0 ? withoutFragment.slice(0, queryIndex) : withoutFragment;
  const query = queryIndex >= 0 ? withoutFragment.slice(queryIndex + 1) : "";
  return { pathname, query, fragment };
}

function resolveHtmlAsset(htmlFile, rawValue) {
  if (!rawValue || isExternalUrl(rawValue)) return null;
  const { pathname } = parseAssetUrl(rawValue);
  if (!/\.(?:css|js)$/i.test(pathname)) return null;

  const cleanPath = decodeURIComponent(pathname);
  const absolute = cleanPath.startsWith("/")
    ? path.join(ROOT, cleanPath.replace(/^\/+/, ""))
    : path.resolve(path.dirname(htmlFile), cleanPath);

  if (!absolute.startsWith(ROOT + path.sep) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    return null;
  }
  return absolute;
}

function normalizeRuntimePathname(pathname) {
  return pathname
    .replace(/^\$\{projectRoot\}\//, "")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");
}

function resolveRuntimeAsset(rawValue) {
  if (!rawValue || isExternalUrl(rawValue)) return null;
  const { pathname } = parseAssetUrl(rawValue);
  const normalized = normalizeRuntimePathname(pathname);
  if (!/^(?:css|js)\//i.test(normalized)) return null;
  if (!/\.(?:css|js)$/i.test(normalized)) return null;

  const absolute = path.join(ROOT, normalized);
  if (!absolute.startsWith(ROOT + path.sep) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    return null;
  }
  return absolute;
}

function withVersion(rawValue, assetFile) {
  const { pathname, query, fragment } = parseAssetUrl(rawValue);
  const params = new URLSearchParams(query);
  params.set("v", fileHash(assetFile));
  const serialized = params.toString();
  return `${pathname}${serialized ? `?${serialized}` : ""}${fragment}`;
}

function rewriteRuntimeAssetStrings() {
  const jsFiles = walk(path.join(ROOT, "js"), (file) => file.endsWith(".js"));
  const literalPattern = /(["'`])((?:(?:\$\{projectRoot\}\/)|(?:\.\/))?(?:css|js)\/[A-Za-z0-9_./-]+\.(?:css|js)(?:\?[^"'`\s\\]*)?(?:#[^"'`\s\\]*)?)\1/g;

  for (let pass = 1; pass <= MAX_DYNAMIC_PASSES; pass += 1) {
    let changedThisPass = 0;

    for (const jsFile of jsFiles) {
      const before = fs.readFileSync(jsFile, "utf8");
      const after = before.replace(literalPattern, (full, quote, rawValue) => {
        const assetFile = resolveRuntimeAsset(rawValue);
        if (!assetFile || assetFile === jsFile) return full;
        const nextValue = withVersion(rawValue, assetFile);
        return `${quote}${nextValue}${quote}`;
      });

      if (after !== before) {
        fs.writeFileSync(jsFile, after);
        invalidateHash(jsFile);
        changedThisPass += 1;
      }
    }

    if (changedThisPass === 0) return;
  }

  throw new Error(
    `A dinamikus asset-verziózás ${MAX_DYNAMIC_PASSES} kör után sem stabilizálódott. Ellenőrizd, nincs-e körkörös JS/CSS asset-hivatkozás.`
  );
}

function rewriteTagAsset(tag, attributeName, htmlFile) {
  const attributePattern = new RegExp(`\\b${attributeName}=(['"])(.*?)\\1`, "i");
  const match = tag.match(attributePattern);
  if (!match) return tag;

  const rawValue = match[2];
  const assetFile = resolveHtmlAsset(htmlFile, rawValue);
  if (!assetFile) return tag;

  const nextValue = withVersion(rawValue, assetFile);
  if (nextValue === rawValue) return tag;
  return tag.replace(attributePattern, `${attributeName}=${match[1]}${nextValue}${match[1]}`);
}

function rewriteHtmlFile(htmlFile) {
  const before = fs.readFileSync(htmlFile, "utf8");
  let after = before.replace(/<script\b[^>]*\bsrc=(?:["'][^"']*["'])[^>]*>/gi, (tag) =>
    rewriteTagAsset(tag, "src", htmlFile)
  );

  after = after.replace(/<link\b[^>]*>/gi, (tag) => {
    const relMatch = tag.match(/\brel=(['"])(.*?)\1/i);
    const asMatch = tag.match(/\bas=(['"])(.*?)\1/i);
    const rel = (relMatch?.[2] || "").toLowerCase().split(/\s+/);
    const asValue = (asMatch?.[2] || "").toLowerCase();
    const versionsCodeAsset =
      rel.includes("stylesheet") || rel.includes("modulepreload") || (rel.includes("preload") && ["style", "script"].includes(asValue));
    return versionsCodeAsset ? rewriteTagAsset(tag, "href", htmlFile) : tag;
  });

  if (after !== before) {
    fs.writeFileSync(htmlFile, after);
    return true;
  }
  return false;
}

function deploymentFingerprint() {
  const files = walk(
    ROOT,
    (file) =>
      file !== SERVICE_WORKER_FILE &&
      /\.(?:html|css|js|webmanifest)$/i.test(file)
  ).sort();

  const hash = crypto.createHash("sha256");
  for (const file of files) {
    hash.update(path.relative(ROOT, file).replace(/\\/g, "/"));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex").slice(0, HASH_LENGTH);
}

function rewriteServiceWorkerVersion() {
  if (!fs.existsSync(SERVICE_WORKER_FILE)) return null;

  const before = fs.readFileSync(SERVICE_WORKER_FILE, "utf8");
  const version = `build-${deploymentFingerprint()}`;
  const pattern = /const KB_SW_VERSION = "[^"]+";/;
  if (!pattern.test(before)) {
    throw new Error("A sw.js KB_SW_VERSION konstansa nem található.");
  }

  const after = before.replace(pattern, `const KB_SW_VERSION = "${version}";`);
  if (after !== before) {
    fs.writeFileSync(SERVICE_WORKER_FILE, after);
    invalidateHash(SERVICE_WORKER_FILE);
  }
  return version;
}

function main() {
  rewriteRuntimeAssetStrings();

  const htmlFiles = walk(ROOT, (file) => file.endsWith(".html"));
  let changedHtml = 0;
  for (const htmlFile of htmlFiles) {
    if (rewriteHtmlFile(htmlFile)) changedHtml += 1;
  }

  const swVersion = rewriteServiceWorkerVersion();
  console.log(
    `Cache busting kész: ${htmlFiles.length} HTML ellenőrizve, ${changedHtml} HTML frissítve, service worker: ${swVersion || "n/a"}.`
  );
}

main();

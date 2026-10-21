"use strict";

const fs = require("node:fs");
const path = require("node:path");

const SKIP_DIRS = new Set([".git", "node_modules"]);
const SITE_ORIGIN = "https://kb-source-audit.invalid";

function htmlFilesUnder(root) {
  const result = [];
  const walk = (folder) => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const absolute = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else if (entry.isFile() && /\.html?$/i.test(entry.name)) result.push(absolute);
    }
  };
  walk(root);
  return result.sort();
}

function attribute(tag, name) {
  // Anchoring the attribute to whitespace avoids mistaking data-src for src.
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return match ? (match[1] ?? match[2] ?? match[3]) : null;
}

function linkedExecutableAssets(html, page) {
  const source = html.replace(/<!--[\s\S]*?-->/g, "");
  const assets = [];
  const pageUrl = new URL("/" + page.replace(/\\/g, "/"), SITE_ORIGIN);
  for (const match of source.matchAll(/<(script|link)\b[^>]*>/gi)) {
    const tag = match[0];
    const isScript = match[1].toLowerCase() === "script";
    if (!isScript) {
      // A preload and its applied stylesheet intentionally reference the same
      // file; only applied stylesheets count as duplicate browser loads.
      const rel = (attribute(tag, "rel") || "").toLowerCase().split(/\s+/);
      if (!rel.includes("stylesheet")) continue;
    }
    const raw = attribute(tag, isScript ? "src" : "href");
    if (!raw) continue;
    let parsed;
    try { parsed = new URL(raw.replace(/&amp;/gi, "&"), pageUrl); }
    catch { continue; } // Other HTML/URL validators own malformed URL syntax.
    if (parsed.origin !== SITE_ORIGIN) continue;
    if (!/\.(?:js|css)$/i.test(parsed.pathname)) continue;
    const kind = isScript ? "script" : "stylesheet";
    const normalizedPath = decodeURIComponent(parsed.pathname);
    assets.push({ kind, file: normalizedPath });
  }
  return assets;
}

function auditSourceHygiene(root, pages = htmlFilesUnder(root)) {
  const failures = [];
  let inspected = 0;
  for (const absolute of pages) {
    const relative = path.relative(root, absolute).replace(/\\/g, "/");
    const html = fs.readFileSync(absolute, "utf8");
    const seen = new Set();
    for (const asset of linkedExecutableAssets(html, relative)) {
      const signature = `${asset.kind}:${asset.file}`;
      if (seen.has(signature)) {
        failures.push(`${relative}: duplikált helyi ${asset.kind} betöltés: ${asset.file} (eltérő ?v= sem indokol második betöltést)`);
      }
      seen.add(signature);
    }
    inspected += 1;
  }
  return { inspected, failures };
}

if (require.main === module) {
  const result = auditSourceHygiene(path.resolve(__dirname, ".."));
  if (result.failures.length) {
    console.error("Clean-source HTML asset regression:");
    for (const failure of result.failures) console.error("- " + failure);
    process.exitCode = 1;
  } else {
    console.log(`Clean-source HTML asset regression OK: ${result.inspected} HTML fájl, nincs duplikált helyi JS/CSS betöltés.`);
  }
}

module.exports = { htmlFilesUnder, attribute, linkedExecutableAssets, auditSourceHygiene };

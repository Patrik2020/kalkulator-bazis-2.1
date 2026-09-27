const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const skipDirs = new Set([".git", "node_modules"]);
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
}

walk(root);

const bootstrapPattern = /^(\s*)<script\b([^>]*\bsrc=(['"])([^'"]*?)js\/global-head\.js(?:\?[^'"]*)?\3[^>]*)>\s*<\/script>/gim;
const configBeforeBootstrapPattern = /<script\b[^>]*\bsrc=(['"])[^'"]*js\/global-head-config\.js(?:\?[^'"]*)?\1[^>]*>\s*<\/script>\s*$/i;
const failures = [];
let changedFiles = 0;
let bootstrapPages = 0;

for (const htmlFile of htmlFiles) {
  const source = fs.readFileSync(htmlFile, "utf8");
  let touched = false;
  const transformed = source.replace(bootstrapPattern, (bootstrap, indent, attributes, quote, prefix, offset, fullSource) => {
    bootstrapPages += 1;
    const before = fullSource.slice(0, offset);
    const previousChunk = before.slice(Math.max(0, before.length - 300));
    if (configBeforeBootstrapPattern.test(previousChunk)) return bootstrap;

    touched = true;
    return `${indent}<script src=${quote}${prefix}js/global-head-config.js${quote}></script>\n${bootstrap}`;
  });

  if (!touched) continue;
  const relative = path.relative(root, htmlFile).replace(/\\/g, "/");
  if (checkOnly) failures.push(`${relative}: hiányzik a global-head-config.js a bootstrap előtt.`);
  else {
    fs.writeFileSync(htmlFile, transformed);
    changedFiles += 1;
  }
}

if (bootstrapPages === 0) {
  console.error("Egyetlen global-head.js bootstrapot használó HTML oldal sem található.");
  process.exit(1);
}

if (checkOnly && failures.length) {
  console.error("Global head config materializálási eltérések:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Global head config materializálás OK: ${bootstrapPages} bootstrap előtti config-pár ellenőrizve.`
    : `Global head config materializálás: ${changedFiles} HTML fájl frissítve, ${bootstrapPages} bootstrap oldal ellenőrizve.`
);

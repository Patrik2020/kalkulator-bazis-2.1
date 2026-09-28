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

const bootstrapLinePattern = /^(\s*)<script\b([^>]*\bsrc=(['"])([^'"]*?)js\/global-head\.js(?:\?[^'"]*)?\3[^>]*)>\s*<\/script>\s*$/i;
const configLinePattern = /^(\s*)<script\b[^>]*\bsrc=(['"])([^'"]*?)js\/global-head-config\.js(?:\?[^'"]*)?\2[^>]*>\s*<\/script>\s*$/i;
const fallbackLinePattern = /^\s*<script\b[^>]*\bsrc=(['"])[^'"]*?js\/static-first-fallbacks\.js(?:\?[^'"]*)?\1[^>]*>\s*<\/script>\s*$/i;
const failures = [];
let changedFiles = 0;
let bootstrapPages = 0;

function inspectConfigPlacement(lines, bootstrapIndex, prefix) {
  const configIndexes = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (configLinePattern.test(lines[index])) configIndexes.push(index);
  }

  if (configIndexes.length !== 1) {
    return `global-head-config.js előfordulások száma: ${configIndexes.length}, elvárt: 1.`;
  }

  const configIndex = configIndexes[0];
  const configMatch = lines[configIndex].match(configLinePattern);
  if (!configMatch || configMatch[3] !== prefix) {
    return "a global-head-config.js relatív útvonala nem egyezik a global-head.js útvonalával.";
  }

  if (configIndex >= bootstrapIndex) {
    return "a global-head-config.js nem a global-head.js előtt található.";
  }

  let fallbackCount = 0;
  for (let index = configIndex + 1; index < bootstrapIndex; index += 1) {
    if (!lines[index].trim()) continue;
    if (fallbackLinePattern.test(lines[index])) {
      fallbackCount += 1;
      continue;
    }
    return "a config és a bootstrap között nem várt elem található.";
  }

  if (fallbackCount > 1) {
    return "több static-first-fallbacks.js található a config és a bootstrap között.";
  }

  return null;
}

for (const htmlFile of htmlFiles) {
  const source = fs.readFileSync(htmlFile, "utf8");
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const hadTrailingNewline = source.endsWith(newline);
  let lines = source.split(/\r?\n/);
  if (hadTrailingNewline && lines.at(-1) === "") lines.pop();

  const bootstrapIndexes = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (bootstrapLinePattern.test(lines[index])) bootstrapIndexes.push(index);
  }
  if (bootstrapIndexes.length === 0) continue;

  const relative = path.relative(root, htmlFile).replace(/\\/g, "/");
  bootstrapPages += 1;

  if (bootstrapIndexes.length !== 1) {
    failures.push(`${relative}: global-head.js előfordulások száma: ${bootstrapIndexes.length}, elvárt: 1.`);
    continue;
  }

  const initialBootstrapMatch = lines[bootstrapIndexes[0]].match(bootstrapLinePattern);
  const [, indent, , quote, prefix] = initialBootstrapMatch;

  if (checkOnly) {
    const placementFailure = inspectConfigPlacement(lines, bootstrapIndexes[0], prefix);
    if (placementFailure) failures.push(`${relative}: ${placementFailure}`);
    continue;
  }

  lines = lines.filter((line) => !configLinePattern.test(line));

  const bootstrapIndex = lines.findIndex((line) => bootstrapLinePattern.test(line));
  if (bootstrapIndex < 0) {
    failures.push(`${relative}: a global-head.js eltűnt a normalizálás közben.`);
    continue;
  }

  let insertionIndex = bootstrapIndex;
  let scanIndex = bootstrapIndex - 1;
  while (scanIndex >= 0 && !lines[scanIndex].trim()) scanIndex -= 1;
  if (scanIndex >= 0 && fallbackLinePattern.test(lines[scanIndex])) {
    insertionIndex = scanIndex;
  }

  const configLine = `${indent}<script src=${quote}${prefix}js/global-head-config.js${quote}></script>`;
  lines.splice(insertionIndex, 0, configLine);

  const transformed = `${lines.join(newline)}${hadTrailingNewline ? newline : ""}`;
  if (transformed !== source) {
    fs.writeFileSync(htmlFile, transformed);
    changedFiles += 1;
  }
}

if (bootstrapPages === 0) {
  console.error("Egyetlen global-head.js bootstrapot használó HTML oldal sem található.");
  process.exit(1);
}

if (failures.length) {
  console.error("Global head config materializálási eltérések:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Global head config materializálás OK: ${bootstrapPages} oldal ellenőrizve.`
    : `Global head config materializálás: ${changedFiles} HTML fájl frissítve, ${bootstrapPages} bootstrap oldal ellenőrizve.`
);

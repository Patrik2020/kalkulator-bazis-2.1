const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const globalHeadPath = path.join(root, "js", "global-head.js");
const source = fs.readFileSync(globalHeadPath, "utf8");

const failures = [];
const versionedPathNames = [
  ...source.matchAll(/const\s+([A-Za-z0-9_$]+Path)\s*=\s*`[^`]*\?v=[^`]+`;/g),
].map((match) => match[1]);

for (const name of versionedPathNames) {
  const duplicateSuffixPattern = new RegExp(`\\$\\{${name}\\}\\?v=`, "g");
  const matches = [...source.matchAll(duplicateSuffixPattern)];
  if (matches.length) {
    failures.push(`${name}: a már verziózott asset útvonalhoz újabb ?v= paraméter kerül (${matches.length} helyen).`);
  }
}

for (const match of source.matchAll(/\?v=[^\s"'`]+\?v=/g)) {
  failures.push(`Dupla verzióparaméter egy literál URL-ben: ${match[0]}`);
}

if (failures.length) {
  console.error("Asset version audit hibák:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Asset version audit OK: ${versionedPathNames.length} verziózott asset útvonal, nincs dupla ?v= paraméter.`);

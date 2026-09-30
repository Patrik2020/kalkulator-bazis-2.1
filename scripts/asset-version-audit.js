const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceFiles = [
  path.join(root, "js", "global-head-config.js"),
  path.join(root, "js", "global-head.js"),
];

const failures = [];
const assetUrls = [];

for (const sourceFile of sourceFiles) {
  const source = fs.readFileSync(sourceFile, "utf8");
  const relative = path.relative(root, sourceFile).replace(/\\/g, "/");

  for (const match of source.matchAll(/["'`]((?:css|js)\/[A-Za-z0-9_./-]+\.(?:css|js)(?:\?[^"'`\s\\]*)?)["'`]/g)) {
    assetUrls.push({ source: relative, url: match[1] });
  }

  for (const match of source.matchAll(/\?v=[^\s"'`]+\?v=/g)) {
    failures.push(`${relative}: dupla verzióparaméter egy literál URL-ben: ${match[0]}`);
  }
}

const uniqueUrls = [...new Map(assetUrls.map((entry) => [entry.url, entry])).values()];

for (const { source, url } of uniqueUrls) {
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) {
    failures.push(`${source}: verzió nélküli runtime asset: ${url}`);
    continue;
  }

  const params = new URLSearchParams(url.slice(queryIndex + 1));
  const versions = params.getAll("v");
  if (versions.length !== 1) {
    failures.push(`${source}: pontosan egy v paraméter kell: ${url}`);
    continue;
  }
  if (!/^[0-9a-f]{12}$/i.test(versions[0])) {
    failures.push(`${source}: a v paraméter nem 12 karakteres content-hash: ${url}`);
  }
}

if (uniqueUrls.length === 0) {
  failures.push("Nem található ellenőrizhető JS/CSS asset a global-head registryben.");
}

if (failures.length) {
  console.error("Asset version audit hibák:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Asset version audit OK: ${uniqueUrls.length} registry asset, mindegyiken pontosan egy content-hash verzió.`);

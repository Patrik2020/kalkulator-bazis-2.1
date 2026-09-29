const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "js", "global-head-config.js");
const bootstrapPath = path.join(root, "js", "global-head.js");
const fallbackPath = path.join(root, "js", "home-plugin-fallback.js");
const failures = [];

for (const requiredFile of [configPath, bootstrapPath, fallbackPath]) {
  if (!fs.existsSync(requiredFile)) failures.push(`Hiányzó global-head modul: ${path.relative(root, requiredFile)}`);
}

if (failures.length === 0) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(configPath, "utf8"), sandbox, { filename: configPath });
  const config = sandbox.window.KB_GLOBAL_HEAD_CONFIG;

  if (!config || typeof config !== "object") {
    failures.push("A global-head-config.js nem publikál KB_GLOBAL_HEAD_CONFIG objektumot.");
  } else {
    if (!config.base || !config.home || !config.calculatorPage || !Array.isArray(config.features)) {
      failures.push("A KB_GLOBAL_HEAD_CONFIG kötelező base/home/calculatorPage/features szerkezete hiányos.");
    }

    const featureIds = new Set();
    for (const feature of config.features || []) {
      if (!feature.id || featureIds.has(feature.id)) failures.push(`Hiányzó vagy duplikált feature id: ${feature.id || "(üres)"}`);
      featureIds.add(feature.id);
      if (!["slug", "file"].includes(feature.match)) failures.push(`${feature.id}: ismeretlen match mód: ${feature.match}`);
      if (!Array.isArray(feature.pages) || feature.pages.length === 0) failures.push(`${feature.id}: üres pages lista.`);
      if (Array.isArray(feature.pages) && new Set(feature.pages).size !== feature.pages.length) {
        failures.push(`${feature.id}: duplikált page slug/fájlnév.`);
      }
    }

    const assets = [];
    const visit = (value) => {
      if (typeof value === "string" && /^(?:css|js)\/.+\.(?:css|js)(?:\?|$)/i.test(value)) {
        assets.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(visit);
      } else if (value && typeof value === "object") {
        Object.values(value).forEach(visit);
      }
    };
    visit(config);

    for (const asset of new Set(assets)) {
      const pathname = asset.split(/[?#]/, 1)[0];
      const absolute = path.join(root, pathname);
      if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
        failures.push(`A registry nem létező assetre mutat: ${asset}`);
      }
    }
  }
}

const skipDirs = new Set([".git", "node_modules"]);
const htmlFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name.endsWith(".html")) htmlFiles.push(absolute);
  }
};
walk(root);

const configLinePattern = /^\s*<script\b[^>]*\bsrc=(['"])([^'"]*?)js\/global-head-config\.js(?:\?[^'"]*)?\1[^>]*>\s*<\/script>\s*$/i;
const bootstrapLinePattern = /^\s*<script\b[^>]*\bsrc=(['"])([^'"]*?)js\/global-head\.js(?:\?[^'"]*)?\1[^>]*>\s*<\/script>\s*$/i;
const fallbackLinePattern = /^\s*<script\b[^>]*\bsrc=(['"])[^'"]*?js\/static-first-fallbacks\.js(?:\?[^'"]*)?\1[^>]*>\s*<\/script>\s*$/i;
let bootstrapPages = 0;

for (const htmlFile of htmlFiles) {
  const source = fs.readFileSync(htmlFile, "utf8");
  const lines = source.split(/\r?\n/);
  const relative = path.relative(root, htmlFile).replace(/\\/g, "/");
  const configEntries = [];
  const bootstrapEntries = [];

  lines.forEach((line, index) => {
    const configMatch = line.match(configLinePattern);
    if (configMatch) configEntries.push({ index, prefix: configMatch[2] });
    const bootstrapMatch = line.match(bootstrapLinePattern);
    if (bootstrapMatch) bootstrapEntries.push({ index, prefix: bootstrapMatch[2] });
  });

  if (bootstrapEntries.length === 0) {
    if (configEntries.length) failures.push(`${relative}: global-head-config.js van, de global-head.js nincs.`);
    continue;
  }

  bootstrapPages += 1;
  if (bootstrapEntries.length !== 1) {
    failures.push(`${relative}: global-head.js előfordulások száma: ${bootstrapEntries.length}, elvárt: 1.`);
    continue;
  }
  if (configEntries.length !== 1) {
    failures.push(`${relative}: global-head-config.js előfordulások száma: ${configEntries.length}, elvárt: 1.`);
    continue;
  }

  const configEntry = configEntries[0];
  const bootstrapEntry = bootstrapEntries[0];
  if (configEntry.prefix !== bootstrapEntry.prefix) {
    failures.push(`${relative}: a config és bootstrap relatív útvonala eltér.`);
    continue;
  }
  if (configEntry.index >= bootstrapEntry.index) {
    failures.push(`${relative}: a global-head-config.js nem a global-head.js előtt van.`);
    continue;
  }

  let fallbackCount = 0;
  for (let index = configEntry.index + 1; index < bootstrapEntry.index; index += 1) {
    if (!lines[index].trim()) continue;
    if (fallbackLinePattern.test(lines[index])) {
      fallbackCount += 1;
      continue;
    }
    failures.push(`${relative}: a config és bootstrap között nem várt elem található.`);
    break;
  }
  if (fallbackCount > 1) failures.push(`${relative}: több static-first-fallbacks.js van a config és bootstrap között.`);
}

if (bootstrapPages === 0) failures.push("Egyetlen HTML oldal sem tölti a global-head.js bootstrapot.");

if (failures.length) {
  console.error("Global head contract audit hibák:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Global head contract audit OK: ${bootstrapPages} HTML oldal config → opcionális static-first fallback → bootstrap sorrenddel, registry assetek léteznek.`);

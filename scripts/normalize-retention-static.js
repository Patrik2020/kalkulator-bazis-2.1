const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function normalizeInstallButton(html) {
  return html.replace(
    /<button\b(?=[^>]*\bdata-retention-action=["']install["'])[^>]*>/gi,
    (openTag) => {
      let normalized = openTag
        .replace(/\s+data-install-mode(?:\s*=\s*(["']).*?\1)?/gi, "")
        .replace(/\s+data-install-method(?:\s*=\s*(["']).*?\1)?/gi, "");

      if (!/\bhidden\b/i.test(normalized)) {
        normalized = normalized.replace(/>$/, " hidden>");
      }

      return normalized;
    }
  );
}

walk(root);

let changed = 0;
const pending = [];

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const normalized = normalizeInstallButton(source);
  if (source === normalized) continue;
  changed += 1;
  pending.push(path.relative(root, file));
  if (!checkOnly) fs.writeFileSync(file, normalized, "utf8");
}

if (checkOnly && changed) {
  console.error(`Retention static normalizálás szükséges: ${changed} fájl.`);
  pending.slice(0, 20).forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Retention static normalizálás rendben: ${htmlFiles.length} HTML.`
    : `Retention static normalizálás: ${changed}/${htmlFiles.length} HTML fájl módosult.`
);

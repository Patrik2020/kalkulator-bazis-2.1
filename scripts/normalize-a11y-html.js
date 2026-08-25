const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const ignored = new Set(["node_modules", ".git"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const skipLinkRe = /<a\b(?=[^>]*\bclass\s*=\s*(["'])[^"']*\bkb-skip-link\b[^"']*\1)[^>]*>[\s\S]*?<\/a>/gi;

function normalize(source) {
  let seen = false;
  let removed = 0;
  const html = source.replace(skipLinkRe, (tag) => {
    if (!seen) {
      seen = true;
      return tag;
    }
    removed += 1;
    return "";
  });
  return { html, removed };
}

let changedFiles = 0;
let removedLinks = 0;
for (const file of walk(root)) {
  const source = fs.readFileSync(file, "utf8");
  const first = normalize(source);
  const second = normalize(first.html);
  if (second.html !== first.html || second.removed !== 0) {
    throw new Error(`Nem idempotens a11y-normalizálás: ${path.relative(root, file)}`);
  }
  if (first.removed > 0) {
    changedFiles += 1;
    removedLinks += first.removed;
    if (!checkOnly) fs.writeFileSync(file, first.html, "utf8");
  }
}

console.log(
  checkOnly
    ? `A11y HTML audit OK: ${changedFiles} fájlban ${removedLinks} eltávolítható duplikált skip-link; transzformáció idempotens.`
    : `A11y HTML normalizálás: ${changedFiles} fájl, ${removedLinks} duplikált skip-link eltávolítva.`
);

module.exports = { normalize };

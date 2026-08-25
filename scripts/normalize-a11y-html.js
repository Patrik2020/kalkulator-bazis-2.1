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
  const matches = Array.from(source.matchAll(skipLinkRe));
  if (matches.length <= 1) return { html: source, removed: 0 };

  let html = source;
  let removed = 0;

  // Remove duplicates from the end so original match offsets remain valid.
  // When a duplicate is the only content on its line, remove the whole line
  // instead of leaving a blank line that a later static build would normalize.
  for (let i = matches.length - 1; i >= 1; i -= 1) {
    const match = matches[i];
    let start = match.index;
    let end = start + match[0].length;

    const lineStart = html.lastIndexOf("\n", start - 1) + 1;
    const nextNewline = html.indexOf("\n", end);
    const lineEnd = nextNewline === -1 ? html.length : nextNewline + 1;
    const before = html.slice(lineStart, start);
    const after = html.slice(end, lineEnd);

    if (/^[ \t]*$/.test(before) && /^[ \t]*(?:\r?\n)?$/.test(after)) {
      start = lineStart;
      end = lineEnd;
    }

    html = html.slice(0, start) + html.slice(end);
    removed += 1;
  }

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

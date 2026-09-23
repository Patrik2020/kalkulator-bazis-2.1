const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const htmlFiles = [];
const canonicalRetention = fs
  .readFileSync(path.join(root, "components", "retention-cta.html"), "utf8")
  .trim();
const retentionPattern = /<section\b(?=[^>]*\bclass\s*=\s*["'][^"']*\bretention-cta\b[^"']*["'])[^>]*>[\s\S]*?<\/section>/gi;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function isCalculatorPage(relativePath) {
  return (
    relativePath.startsWith(`kalkulatorok${path.sep}`) &&
    relativePath !== path.join("kalkulatorok", "multifunkcios-szamologep.html")
  );
}

function hasRetentionBlock(html) {
  return /<section\b(?=[^>]*\bclass\s*=\s*["'][^"']*\bretention-cta\b[^"']*["'])[^>]*>/i.test(html);
}

function findCalculatorSectionClose(html) {
  const opening = /<section\b(?=[^>]*\bclass\s*=\s*["'][^"']*\bcard-calculator\b[^"']*["'])[^>]*>/i.exec(html);
  if (!opening) return -1;

  const sectionTag = /<\/?section\b[^>]*>/gi;
  sectionTag.lastIndex = opening.index;
  let depth = 0;
  let match;

  while ((match = sectionTag.exec(html))) {
    if (/^<\/section/i.test(match[0])) {
      depth -= 1;
      if (depth === 0) return match.index;
    } else {
      depth += 1;
    }
  }

  return -1;
}

function injectRetentionBlock(html) {
  const closeIndex = findCalculatorSectionClose(html);
  if (closeIndex >= 0) {
    return `${html.slice(0, closeIndex)}\n${canonicalRetention}\n${html.slice(closeIndex)}`;
  }

  const mainClose = html.search(/<\/main>/i);
  if (mainClose >= 0) {
    return `${html.slice(0, mainClose)}\n${canonicalRetention}\n${html.slice(mainClose)}`;
  }

  return html;
}

function placeRetentionAfterCalculator(html) {
  // Remove both the existing block and the whitespace immediately surrounding it.
  // The renderer may serialize that whitespace differently between passes, so the
  // replacement below deliberately reconstructs one canonical separator.
  const withoutRetention = html.replace(retentionPattern, "");
  const closeIndex = findCalculatorSectionClose(withoutRetention);
  if (closeIndex < 0) return withoutRetention;

  const closingTag = /^<\/section\s*>/i.exec(withoutRetention.slice(closeIndex));
  if (!closingTag) return withoutRetention;

  const insertAt = closeIndex + closingTag[0].length;
  const before = withoutRetention.slice(0, insertAt).replace(/[ \t]+$/g, "");
  const after = withoutRetention.slice(insertAt).replace(/^\s*/u, "");
  return `${before}\n${canonicalRetention}\n${after}`;
}

function normalizeRetentionBlock(html, relativePath) {
  let normalized = html.replace(retentionPattern, canonicalRetention);

  // This legacy calculator has a renderer that materializes its calculator shell.
  // Keeping the retention CTA inside that shell makes consecutive static builds
  // alternate between two DOM serializations. Keep it as a stable sibling instead.
  if (relativePath === path.join("kalkulatorok", "rezsi-megosztas-kalkulator.html")) {
    normalized = placeRetentionAfterCalculator(normalized);
  } else if (isCalculatorPage(relativePath) && !hasRetentionBlock(normalized)) {
    normalized = injectRetentionBlock(normalized);
  }

  return normalized;
}

function normalizeHomeQualityFinal(html, relativePath) {
  if (relativePath !== "index.html") return html;
  if (html.includes("KB_STATIC:quality-final:START") && html.includes("KB_STATIC:quality-final:END")) return html;

  const start = "<!-- KB_STATIC:quality-final:START -->";
  const end = "<!-- KB_STATIC:quality-final:END -->";
  const trustSection = /<section\b(?=[^>]*\bid\s*=\s*["']trust["'])[^>]*>[\s\S]*?<\/section>/i;

  if (trustSection.test(html)) {
    return html.replace(trustSection, (section) => `${start}\n${section}\n${end}`);
  }

  const mainClose = html.search(/<\/main>/i);
  if (mainClose >= 0) {
    return `${html.slice(0, mainClose)}${start}\n${end}\n${html.slice(mainClose)}`;
  }

  return `${html}\n${start}\n${end}\n`;
}

walk(root);

let changed = 0;
const pending = [];

for (const file of htmlFiles) {
  const relativePath = path.relative(root, file);
  const source = fs.readFileSync(file, "utf8");
  let normalized = normalizeRetentionBlock(source, relativePath);
  normalized = normalizeHomeQualityFinal(normalized, relativePath);
  if (source === normalized) continue;
  changed += 1;
  pending.push(relativePath);
  if (!checkOnly) fs.writeFileSync(file, normalized, "utf8");
}

if (checkOnly && changed) {
  console.error(`Retention/static quality normalizálás szükséges: ${changed} fájl.`);
  pending.slice(0, 20).forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log(
  checkOnly
    ? `Retention/static quality normalizálás rendben: ${htmlFiles.length} HTML.`
    : `Retention/static quality normalizálás: ${changed}/${htmlFiles.length} HTML fájl módosult.`
);
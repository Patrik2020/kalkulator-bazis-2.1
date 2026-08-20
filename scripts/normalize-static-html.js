const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const booleanAttributes = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
];

const ariaLabelSafeTags = new Set([
  "a",
  "aside",
  "button",
  "dialog",
  "footer",
  "form",
  "header",
  "iframe",
  "input",
  "main",
  "nav",
  "section",
  "select",
  "textarea",
]);

function sourcePages() {
  const xml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const pages = [];
  const seen = new Set();

  for (const match of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)) {
    const url = new URL(match[1].trim());
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
    if (relative.endsWith("/")) relative += "index.html";
    if (!relative.endsWith(".html")) continue;
    if (!fs.existsSync(path.join(root, relative)) || seen.has(relative)) continue;
    seen.add(relative);
    pages.push(relative);
  }

  if (fs.existsSync(path.join(root, "404.html")) && !seen.has("404.html")) pages.push("404.html");
  return pages;
}

function removeAttribute(attributes, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return attributes.replace(new RegExp(`\\s+${escaped}(?:\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+))?`, "gi"), "");
}

function normalizeOpeningTag(full, tag, attributes) {
  if (tag.startsWith("!")) return full;

  const lowerTag = tag.toLowerCase();
  let attrs = attributes;

  for (const attribute of booleanAttributes) {
    const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    attrs = attrs.replace(new RegExp(`\\s+${escaped}\\s*=\\s*(["'])\\s*\\1`, "gi"), ` ${attribute}`);
    attrs = attrs.replace(new RegExp(`\\s+${escaped}\\s*=\\s*(["'])${escaped}\\1`, "gi"), ` ${attribute}`);
  }

  // Browser serialization can persist runtime-only visual styles. The source site
  // deliberately forbids inline CSS, and these values are not required for content.
  attrs = removeAttribute(attrs, "style");

  // Keep aria-label on interactive controls and landmark-capable elements. On generic
  // visual/text elements the browser-rendered runtime label is dropped so the source
  // remains valid; visible text is still present for users and crawlers.
  if (!ariaLabelSafeTags.has(lowerTag)) attrs = removeAttribute(attrs, "aria-label");

  if (lowerTag === "input" && !/\btype\s*=/i.test(attrs)) {
    attrs = ` type="text"${attrs}`;
  }

  return `<${tag}${attrs}>`;
}

function normalize(html) {
  return html.replace(/<([a-z][a-z0-9:-]*)(\s[^<>]*?)?>/gi, (full, tag, attributes = "") =>
    normalizeOpeningTag(full, tag, attributes)
  );
}

let changed = 0;
const pages = sourcePages();

for (const page of pages) {
  const file = path.join(root, page);
  const original = fs.readFileSync(file, "utf8");
  const updated = normalize(original);
  if (updated === original) continue;
  fs.writeFileSync(file, updated, "utf8");
  changed += 1;
}

console.log(`Static HTML normalizálás kész: ${changed}/${pages.length} oldal változott.`);

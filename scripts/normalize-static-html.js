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

const ariaLabelInvalidTags = [
  "span",
  "div",
  "p",
  "strong",
  "small",
  "li",
  "ul",
  "ol",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "td",
  "th",
  "article",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "canvas",
  "svg",
  "path",
];

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

function normalizeBooleanAttributes(html) {
  let output = html;

  for (const attribute of booleanAttributes) {
    const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    output = output.replace(
      new RegExp(`\\s${escaped}\\s*=\\s*(["'])\\s*\\1`, "gi"),
      ` ${attribute}`
    );
    output = output.replace(
      new RegExp(`\\s${escaped}\\s*=\\s*(["'])${escaped}\\1`, "gi"),
      ` ${attribute}`
    );
  }

  return output;
}

function stripInlineStyles(html) {
  return html
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
    .replace(/\sstyle\s*=\s*'[^']*'/gi, "");
}

function addExplicitInputTypes(html) {
  return html.replace(/<input\b(?![^>]*\btype\s*=)([^>]*)>/gi, '<input type="text"$1>');
}

function stripInvalidAriaLabels(html) {
  let output = html;

  for (const tag of ariaLabelInvalidTags) {
    const openingTag = new RegExp(`<${tag}\\b([^>]*)>`, "gi");
    output = output.replace(openingTag, (full, attributes) => {
      const cleaned = attributes
        .replace(/\saria-label\s*=\s*"[^"]*"/gi, "")
        .replace(/\saria-label\s*=\s*'[^']*'/gi, "");
      return `<${tag}${cleaned}>`;
    });
  }

  return output;
}

function normalize(html) {
  let output = html;
  output = normalizeBooleanAttributes(output);
  output = stripInlineStyles(output);
  output = stripInvalidAriaLabels(output);
  output = addExplicitInputTypes(output);
  return output;
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

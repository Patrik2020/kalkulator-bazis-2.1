const fs = require("fs");
const path = require("path");
const { publicPathToSourceFile, toExtensionlessHref } = require("./url-paths");

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
    const relative = publicPathToSourceFile(url.pathname);
    if (!fs.existsSync(path.join(root, relative)) || seen.has(relative)) continue;
    seen.add(relative);
    pages.push(relative);
  }

  if (fs.existsSync(path.join(root, "404.html")) && !seen.has("404.html")) pages.push("404.html");
  return pages;
}

function allHtmlFiles(directory = root) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "docs", "node_modules"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...allHtmlFiles(absolute));
    else if (entry.name.endsWith(".html")) files.push(path.relative(root, absolute).replace(/\\/g, "/"));
  }

  return files.sort();
}

function normalizePublicUrls(html) {
  let output = html.replace(
    /https?:\/\/(?:www\.)?kalkulatorbazis\.hu\/[^"'<>\\\s]*\.html/gi,
    (url) => toExtensionlessHref(url)
  );

  output = output.replace(/\b(href|action)\s*=\s*(["'])(.*?)\2/gi, (full, name, quote, value) => {
    const normalized = toExtensionlessHref(value);
    return `${name}=${quote}${normalized}${quote}`;
  });

  output = output.replace(
    /(<meta\b(?=[^>]*\bhttp-equiv\s*=\s*(["'])refresh\2)[^>]*\bcontent\s*=\s*)(["'])(.*?)\3/gi,
    (full, prefix, _httpQuote, contentQuote, content) => {
      const normalized = content.replace(/(\burl\s*=\s*)([^;\s]+)/i, (match, label, value) => {
        return `${label}${toExtensionlessHref(value)}`;
      });
      return `${prefix}${contentQuote}${normalized}${contentQuote}`;
    }
  );

  return output;
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
      // Generic elements with an explicit ARIA role may be named. In
      // particular, the retention action group needs its accessible label.
      if (/\srole\s*=\s*(["'])[^"']+\1/i.test(attributes)) return full;

      const cleaned = attributes
        .replace(/\saria-label\s*=\s*"[^"]*"/gi, "")
        .replace(/\saria-label\s*=\s*'[^']*'/gi, "");
      return `<${tag}${cleaned}>`;
    });
  }

  return output;
}

function removeDuplicateReliabilityFallback(html) {
  const start = "<!-- KB_STATIC:reliability:START -->";
  const end = "<!-- KB_STATIC:reliability:END -->";
  const startIndex = html.indexOf(start);
  if (startIndex === -1) return html;

  const endIndex = html.indexOf(end, startIndex);
  if (endIndex === -1) return html;

  const afterEnd = endIndex + end.length;
  const withoutFallback = html.slice(0, startIndex) + html.slice(afterEnd);
  const remainingNotes = withoutFallback.match(/class=["'][^"']*\breliability-note\b/gi) || [];

  return remainingNotes.length ? withoutFallback : html;
}

function removeLegacyFaqStructuredData(html) {
  if (!/<script\b[^>]*\bid=["']kb-structured-data["'][^>]*>/i.test(html)) return html;

  return html.replace(/\s*<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attributes, body) => {
    const isJsonLd = /\btype\s*=\s*(["'])application\/ld\+json\1/i.test(attributes);
    const isCanonical = /\bid\s*=\s*(["'])kb-structured-data\1/i.test(attributes);
    const containsFaq = /["']@type["']\s*:\s*["']FAQPage["']/i.test(body);
    return isJsonLd && !isCanonical && containsFaq ? "\n" : full;
  });
}

function normalize(html) {
  let output = html;
  output = removeDuplicateReliabilityFallback(output);
  output = removeLegacyFaqStructuredData(output);
  output = normalizeBooleanAttributes(output);
  output = stripInlineStyles(output);
  output = stripInvalidAriaLabels(output);
  output = addExplicitInputTypes(output);
  return output;
}

let changed = 0;
const indexablePages = new Set(sourcePages());
const pages = allHtmlFiles();

for (const page of pages) {
  const file = path.join(root, page);
  const original = fs.readFileSync(file, "utf8");
  let updated = normalizePublicUrls(original);
  if (indexablePages.has(page)) updated = normalize(updated);
  if (updated === original) continue;
  fs.writeFileSync(file, updated, "utf8");
  changed += 1;
}

console.log(`Static HTML és publikus URL normalizálás kész: ${changed}/${pages.length} HTML fájl változott.`);

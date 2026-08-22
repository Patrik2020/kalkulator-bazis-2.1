const fs = require("fs");
const path = require("path");
const {
  SITE_ORIGIN,
  publicPathToSourceFile,
  publicUrlForSource,
  toExtensionlessHref,
} = require("./url-paths");

const root = path.resolve(__dirname, "..");
const failures = [];

function htmlFiles(directory = root) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "docs", "node_modules"].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(absolute));
    else if (entry.name.endsWith(".html")) {
      files.push(path.relative(root, absolute).replace(/\\/g, "/"));
    }
  }

  return files;
}

function runtimeJavascriptFiles(directory = path.join(root, "js")) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...runtimeJavascriptFiles(absolute));
    else if (entry.name.endsWith(".js")) {
      files.push(path.relative(root, absolute).replace(/\\/g, "/"));
    }
  }

  return files;
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/\b([a-z][a-z0-9:-]*)\s*=\s*(["'])([\s\S]*?)\2/gi)) {
    result[match[1].toLowerCase()] = match[3];
  }
  return result;
}

function findTag(html, tagName, predicate) {
  for (const match of html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))) {
    const attrs = attributes(match[0]);
    if (predicate(attrs)) return attrs;
  }
  return null;
}

const sitemapXml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1]);
const uniqueUrls = new Set(sitemapUrls);

if (!sitemapUrls.length) failures.push("A sitemap nem tartalmaz URL-t.");
if (uniqueUrls.size !== sitemapUrls.length) failures.push("A sitemap duplikált URL-t tartalmaz.");

for (const publicUrl of sitemapUrls) {
  let url;
  try {
    url = new URL(publicUrl);
  } catch {
    failures.push(`Érvénytelen sitemap URL: ${publicUrl}`);
    continue;
  }

  if (url.origin !== SITE_ORIGIN) failures.push(`Hibás sitemap origin: ${publicUrl}`);
  if (url.search || url.hash) failures.push(`A sitemap URL queryt vagy fragmentet tartalmaz: ${publicUrl}`);
  if (/\.html$/i.test(url.pathname)) failures.push(`Nem extensionless sitemap URL: ${publicUrl}`);

  const sourceFile = publicPathToSourceFile(url);
  const absoluteSource = path.join(root, sourceFile);
  if (!fs.existsSync(absoluteSource)) {
    failures.push(`A sitemap URL mögött nincs forrásfájl: ${publicUrl} -> ${sourceFile}`);
    continue;
  }

  const html = fs.readFileSync(absoluteSource, "utf8");
  const canonical = findTag(
    html,
    "link",
    (attrs) => (attrs.rel || "").toLowerCase().split(/\s+/).includes("canonical")
  );
  const expectedCanonical = publicUrlForSource(sourceFile);

  if (!canonical?.href) failures.push(`${sourceFile}: hiányzó canonical URL.`);
  else if (canonical.href !== expectedCanonical) {
    failures.push(`${sourceFile}: canonical ${canonical.href}, elvárt ${expectedCanonical}.`);
  }

  const openGraphUrl = findTag(
    html,
    "meta",
    (attrs) => (attrs.property || "").toLowerCase() === "og:url"
  );
  if (openGraphUrl?.content && openGraphUrl.content !== expectedCanonical) {
    failures.push(`${sourceFile}: og:url ${openGraphUrl.content}, elvárt ${expectedCanonical}.`);
  }
}

for (const sourceFile of htmlFiles()) {
  const html = fs.readFileSync(path.join(root, sourceFile), "utf8");

  for (const match of html.matchAll(/https?:\/\/(?:www\.)?kalkulatorbazis\.hu\/[^\s"'<>]*\.html(?=[?#\s"'<>]|$)/gi)) {
    failures.push(`${sourceFile}: belső abszolút .html URL: ${match[0]}`);
  }

  for (const match of html.matchAll(/\b(?:href|action)\s*=\s*(["'])([\s\S]*?)\1/gi)) {
    const value = match[2];
    const normalized = toExtensionlessHref(value);
    if (normalized !== value) failures.push(`${sourceFile}: nem extensionless belső hivatkozás: ${value}`);
  }

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if ((attrs["http-equiv"] || "").toLowerCase() !== "refresh" || !attrs.content) continue;
    const target = attrs.content.match(/\burl\s*=\s*(.+)$/i)?.[1]?.trim().replace(/^["']|["']$/g, "");
    if (target && toExtensionlessHref(target) !== target) {
      failures.push(`${sourceFile}: nem extensionless meta refresh cél: ${target}`);
    }
  }
}

for (const sourceFile of runtimeJavascriptFiles()) {
  const javascript = fs.readFileSync(path.join(root, sourceFile), "utf8");

  for (const match of javascript.matchAll(/https?:\/\/(?:www\.)?kalkulatorbazis\.hu\/[^\s"'<>]*\.html(?=[?#\s"'<>]|$)/gi)) {
    failures.push(`${sourceFile}: belső abszolút .html runtime URL: ${match[0]}`);
  }

  for (const match of javascript.matchAll(/\b(?:href|action)\s*=\s*(["'])([^"']*?)\1/gi)) {
    const value = match[2];
    const normalized = toExtensionlessHref(value);
    if (normalized !== value) failures.push(`${sourceFile}: nem extensionless runtime hivatkozás: ${value}`);
  }
}

if (failures.length) {
  console.error(`Extensionless URL-audit sikertelen (${failures.length} hiba):`);
  failures.slice(0, 100).forEach((failure) => console.error(`- ${failure}`));
  if (failures.length > 100) console.error(`- … és további ${failures.length - 100} hiba`);
  process.exitCode = 1;
} else {
  console.log(
    `Extensionless URL-audit OK: ${sitemapUrls.length} sitemap URL, ${htmlFiles().length} HTML- és ${runtimeJavascriptFiles().length} runtime JS-forrás.`
  );
}

const fs = require("fs");
const path = require("path");
const { spawn, execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const retentionTemplate = fs
  .readFileSync(path.join(root, "components", "retention-cta.html"), "utf8")
  .trim();
const port = Number(process.env.KB_STATIC_PORT || 4173);
const origin = `http://127.0.0.1:${port}`;
const dryRun = process.argv.includes("--check");
const verbose = process.argv.includes("--verbose");

const BLOCK_START = (key) => `<!-- KB_STATIC:${key}:START -->`;
const BLOCK_END = (key) => `<!-- KB_STATIC:${key}:END -->`;

function log(...args) {
  if (verbose) console.log(...args);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      execFileSync(candidate, ["--version"], { stdio: "ignore" });
      return candidate;
    } catch (error) {
      // Try the next known Chrome/Chromium binary.
    }
  }

  throw new Error(
    "Nem található Chrome/Chromium. Állítsd be a CHROME_BIN környezeti változót, vagy futtasd GitHub Actions ubuntu-latest környezetben."
  );
}

function sitemapPages() {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const pages = [];
  const seen = new Set();

  for (const match of sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)) {
    const url = new URL(match[1].trim());
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (!relative) relative = "index.html";
    if (relative.endsWith("/")) relative += "index.html";
    if (!relative.endsWith(".html")) continue;

    const filePath = path.join(root, relative);
    if (!fs.existsSync(filePath) || seen.has(relative)) continue;
    seen.add(relative);
    pages.push(relative);
  }

  if (fs.existsSync(path.join(root, "404.html")) && !seen.has("404.html")) {
    pages.push("404.html");
  }

  return pages;
}

function readAttribute(openTag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = openTag.match(new RegExp(`\\b${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? match[2] : null;
}

function hasClass(openTag, token) {
  const value = readAttribute(openTag, "class");
  return value ? value.split(/\s+/).includes(token) : false;
}

function findElement(html, matcher) {
  const openRe = /<([a-z][a-z0-9:-]*)\b[^>]*>/gi;
  let match;

  while ((match = openRe.exec(html))) {
    const tag = match[1].toLowerCase();
    const openTag = match[0];
    const id = readAttribute(openTag, "id");
    const attrValue = matcher.attr ? readAttribute(openTag, matcher.attr) : null;

    if (matcher.tag && tag !== matcher.tag.toLowerCase()) continue;
    if (matcher.id && id !== matcher.id) continue;
    if (matcher.className && !hasClass(openTag, matcher.className)) continue;
    if (matcher.attr && attrValue === null) continue;
    if (matcher.attr && matcher.value !== undefined && attrValue !== matcher.value) continue;

    const start = match.index;
    const openEnd = openRe.lastIndex;

    if (/\/>\s*$/.test(openTag) || ["meta", "link", "img", "input", "br", "hr", "source"].includes(tag)) {
      return { start, end: openEnd, html: html.slice(start, openEnd), tag, openTag };
    }

    const tokenRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    tokenRe.lastIndex = start;
    let depth = 0;
    let token;

    while ((token = tokenRe.exec(html))) {
      const text = token[0];
      const closing = /^<\//.test(text);
      const selfClosing = /\/>\s*$/.test(text);
      if (closing) depth -= 1;
      else if (!selfClosing) depth += 1;

      if (depth === 0) {
        return {
          start,
          end: tokenRe.lastIndex,
          html: html.slice(start, tokenRe.lastIndex),
          tag,
          openTag,
        };
      }
    }
  }

  return null;
}

function replaceElement(source, matcher, replacement) {
  const found = findElement(source, matcher);
  if (!found) return source;
  return source.slice(0, found.start) + replacement + source.slice(found.end);
}

function removeStaticBlock(source, key) {
  const start = BLOCK_START(key);
  const end = BLOCK_END(key);
  const startIndex = source.indexOf(start);
  if (startIndex === -1) return source;
  const endIndex = source.indexOf(end, startIndex);
  if (endIndex === -1) return source;
  return source.slice(0, startIndex) + source.slice(endIndex + end.length);
}

function upsertStaticBlock(source, key, fragment, placement = "main-end") {
  source = removeStaticBlock(source, key);
  if (!fragment) return source;

  const block = `\n${BLOCK_START(key)}\n${fragment.trim()}\n${BLOCK_END(key)}\n`;

  if (placement === "head-end") {
    return source.replace(/<\/head>/i, `${block}</head>`);
  }

  if (placement === "body-start") {
    return source.replace(/<body([^>]*)>/i, (full) => `${full}${block}`);
  }

  return source.replace(/<\/main>/i, `${block}</main>`);
}

function addAttributeToOpeningTag(fragment, name, value) {
  return fragment.replace(/^<([a-z][a-z0-9:-]*)\b/i, `<$1 ${name}="${value}"`);
}

function removeAttributeFromOpeningTag(fragment, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return fragment.replace(new RegExp(`\\s+${escaped}\\s*=\\s*(["']).*?\\1`, "i"), "");
}

function qualityFallback(fragment, type, originalAttribute) {
  if (!fragment) return null;
  let result = removeAttributeFromOpeningTag(fragment, originalAttribute);
  result = addAttributeToOpeningTag(result, "data-static-quality-fallback", type);
  result = addAttributeToOpeningTag(result, "data-static-quality-version", "2026-08");
  return result;
}

function runtimeFallback(fragment, type) {
  if (!fragment) return null;
  let result = addAttributeToOpeningTag(fragment, "data-static-runtime-fallback", type);
  // A heading enhancer can add generated ids before Chrome dumps the DOM. The
  // timing of that enhancer is not deterministic in headless mode, so those
  // runtime-only ids must not become part of the materialized source.
  result = result.replace(/<h([1-6])\b([^>]*)>/gi, (full, level, attributes) => {
    const stableAttributes = attributes.replace(
      /\s+id\s*=\s*(["'])[^"']*\1/gi,
      ""
    );
    return `<h${level}${stableAttributes}>`;
  });
  return result;
}

function canonicalizeRetentionCta(fragment) {
  if (!fragment) return fragment;
  const retention = findElement(fragment, { attr: "data-retention-cta" });
  if (!retention) return fragment;

  // retention-cta.js adapts the install action to transient browser/PWA state.
  // Keep that behavior dynamic, but always materialize the canonical hidden
  // component so repeated static builds produce the same source HTML.
  return (
    fragment.slice(0, retention.start) +
    retentionTemplate +
    fragment.slice(retention.end)
  );
}

function ensureMainId(source) {
  return source.replace(/<main(?![^>]*\bid=)([^>]*)>/i, '<main id="main-content"$1>');
}

function ensureFallbackScript(source, pagePath) {
  source = source.replace(/\s*<script\b[^>]*src=["'][^"']*static-first-fallbacks\.js[^"']*["'][^>]*><\/script>/gi, "");

  const directory = path.posix.dirname(pagePath);
  const depth = directory === "." ? 0 : directory.split("/").filter(Boolean).length;
  const prefix = depth ? "../".repeat(depth) : "";
  const script = `<script src="${prefix}js/static-first-fallbacks.js"></script>`;
  const globalHead = /<script\b[^>]*src=["'][^"']*js\/global-head\.js[^"']*["'][^>]*><\/script>/i;

  if (globalHead.test(source)) {
    return source.replace(globalHead, `${script}\n$&`);
  }

  return source.replace(/<\/head>/i, `  ${script}\n</head>`);
}

function replaceStructuredData(source, rendered) {
  const structured = findElement(rendered, { tag: "script", id: "kb-structured-data" });
  if (!structured) return removeStaticBlock(source, "structured-data");

  const existing = findElement(source, { tag: "script", id: "kb-structured-data" });
  if (existing) {
    return source.slice(0, existing.start) + structured.html + source.slice(existing.end);
  }

  return upsertStaticBlock(source, "structured-data", structured.html, "head-end");
}

function mergeRenderedPage(pagePath, originalSource, rendered) {
  let source = originalSource;

  const header = findElement(rendered, { id: "header" });
  if (header) source = replaceElement(source, { id: "header" }, header.html);

  const footer = findElement(rendered, { id: "footer" });
  if (footer) source = replaceElement(source, { id: "footer" }, footer.html);

  const card = findElement(rendered, { className: "card-calculator" });
  if (card && findElement(source, { className: "card-calculator" })) {
    source = replaceElement(
      source,
      { className: "card-calculator" },
      canonicalizeRetentionCta(card.html)
    );
  }

  const skipLink = findElement(rendered, { className: "kb-skip-link" });
  source = upsertStaticBlock(source, "skip-link", skipLink?.html || null, "body-start");

  const reliability = findElement(rendered, { className: "reliability-note" });
  const sourceWithoutStaticReliability = removeStaticBlock(source, "reliability");
  const authoredReliability = findElement(sourceWithoutStaticReliability, {
    className: "reliability-note",
  });
  source = authoredReliability
    ? sourceWithoutStaticReliability
    : upsertStaticBlock(sourceWithoutStaticReliability, "reliability", reliability?.html || null);

  const related = findElement(rendered, { attr: "data-render", value: "related-calculators" });
  const relatedHtml = related && /related-section/.test(related.html) ? related.html : null;
  source = upsertStaticBlock(source, "related-calculators", relatedHtml);

  const siteFinal = findElement(rendered, { attr: "data-quality-final", value: "2026-08" });
  source = upsertStaticBlock(source, "quality-final", siteFinal?.html || null);

  const finance = findElement(rendered, { attr: "data-finance-quality", value: "2026-08" });
  source = upsertStaticBlock(
    source,
    "quality-finance",
    qualityFallback(finance?.html || null, "finance", "data-finance-quality")
  );

  const construction = findElement(rendered, { attr: "data-construction-quality", value: "2026-08" });
  source = upsertStaticBlock(
    source,
    "quality-construction",
    qualityFallback(construction?.html || null, "construction", "data-construction-quality")
  );

  const lifestyle = findElement(rendered, { attr: "data-lifestyle-quality", value: "2026-08" });
  source = upsertStaticBlock(
    source,
    "quality-lifestyle",
    qualityFallback(lifestyle?.html || null, "lifestyle", "data-lifestyle-quality")
  );

  const auto = findElement(rendered, { attr: "data-auto-converter-quality", value: "2026-08" });
  source = upsertStaticBlock(
    source,
    "quality-auto",
    qualityFallback(auto?.html || null, "auto", "data-auto-converter-quality")
  );

  const priority = findElement(rendered, { attr: "data-priority-upgrade" });
  source = upsertStaticBlock(
    source,
    "priority-upgrade",
    qualityFallback(priority?.html || null, "priority", "data-priority-upgrade")
  );

  const constructionMethod = findElement(rendered, { className: "construction-methodology" });
  source = upsertStaticBlock(
    source,
    "construction-methodology",
    runtimeFallback(constructionMethod?.html || null, "construction-methodology")
  );

  const everydayMethod = findElement(rendered, { className: "everyday-method" });
  source = upsertStaticBlock(
    source,
    "everyday-method",
    runtimeFallback(everydayMethod?.html || null, "everyday-method")
  );

  const autoNote = findElement(rendered, { className: "ac-note" });
  source = upsertStaticBlock(
    source,
    "auto-converter-note",
    runtimeFallback(autoNote?.html || null, "auto-converter-note")
  );

  source = replaceStructuredData(source, rendered);
  source = ensureMainId(source);
  source = ensureFallbackScript(source, pagePath);

  return source
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/[ \t]+\n/g, "\n");
}

function chromeDump(chrome, pagePath) {
  const url = `${origin}/${pagePath.split("/").map(encodeURIComponent).join("/")}?__kb_static_export=1`;
  const profile = path.join(process.env.RUNNER_TEMP || process.env.TMPDIR || "/tmp", `kb-static-chrome-${process.pid}`);

  const args = [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-sync",
    "--metrics-recording-only",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${profile}`,
    "--virtual-time-budget=3200",
    "--dump-dom",
    url,
  ];

  try {
    return execFileSync(chrome, args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr).slice(-3000) : "";
    throw new Error(`Chrome render hiba (${pagePath}): ${stderr || error.message}`);
  }
}

async function waitForServer() {
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${origin}/index.html`, { cache: "no-store" });
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`A helyi statikus szerver nem indult el: ${lastError?.message || "ismeretlen hiba"}`);
}

async function main() {
  const chrome = findChrome();
  const pages = sitemapPages();
  const server = spawn(process.execPath, [path.join(root, "scripts/local-static-server.js")], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });

  let changed = 0;
  const failures = [];

  try {
    await waitForServer();
    console.log(`Static-first materializálás: ${pages.length} HTML oldal, Chrome: ${chrome}`);

    for (const [index, pagePath] of pages.entries()) {
      try {
        const absolute = path.join(root, pagePath);
        const original = fs.readFileSync(absolute, "utf8");
        const rendered = chromeDump(chrome, pagePath);
        const merged = mergeRenderedPage(pagePath, original, rendered);

        if (merged !== original) {
          changed += 1;
          if (!dryRun) fs.writeFileSync(absolute, merged, "utf8");
        }

        if (verbose || (index + 1) % 10 === 0 || index === pages.length - 1) {
          console.log(`[${index + 1}/${pages.length}] ${pagePath}${merged !== original ? " – frissítve" : ""}`);
        }
      } catch (error) {
        failures.push(`${pagePath}: ${error.message}`);
        console.error(`HIBA ${pagePath}: ${error.message}`);
      }
    }
  } finally {
    server.kill("SIGTERM");
  }

  if (failures.length) {
    throw new Error(`A statikus materializálás ${failures.length} oldalon hibázott:\n${failures.join("\n")}`);
  }

  console.log(`${dryRun ? "Ellenőrzés" : "Materializálás"} kész. Változó oldalak: ${changed}/${pages.length}.`);
  if (dryRun && changed > 0) process.exitCode = 2;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

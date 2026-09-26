const fs = require("fs");
const path = require("path");
const {
  SITE_ORIGIN,
  publicPathToSourceFile,
} = require("./url-paths");

const root = path.resolve(__dirname, "..");
const sitemapPath = path.join(root, "sitemap.xml");
const redirectsPath = path.join(root, "_redirects");
const defaultOutputPath = path.join(root, "cloudflare-bulk-redirects.csv");

function parseArgs(argv) {
  const args = { output: defaultOutputPath, stdout: false };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--stdout") args.stdout = true;
    else if (value === "--output") {
      const next = argv[index + 1];
      if (!next) throw new Error("A --output kapcsoló után fájlnevet kell megadni.");
      args.output = path.resolve(process.cwd(), next);
      index += 1;
    } else {
      throw new Error(`Ismeretlen kapcsoló: ${value}`);
    }
  }

  return args;
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean);
}

function parsePermanentRedirects(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts.length >= 3 && parts[2] === "301")
    .map(([from, to]) => ({ from, to }));
}

function csvValue(value) {
  const text = String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function sourceKeyFromPath(pathname) {
  const origin = new URL(SITE_ORIGIN);
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  // Scheme intentionally omitted: Cloudflare then matches both http and https.
  return `${origin.host}${normalizedPath}`;
}

function absoluteTarget(value) {
  return new URL(value, SITE_ORIGIN).href;
}

function addRedirect(entries, sourceUrl, targetUrl, reason) {
  const source = String(sourceUrl).trim();
  const target = String(targetUrl).trim();

  if (!source || !target) throw new Error(`Üres redirect mező (${reason}).`);
  if (/[?#]/.test(source)) throw new Error(`A Cloudflare source URL nem tartalmazhat queryt vagy fragmentet: ${source}`);

  const previous = entries.get(source);
  if (previous && previous.target !== target) {
    throw new Error(
      `Ütköző redirect forrás: ${source}\n- ${previous.target} (${previous.reason})\n- ${target} (${reason})`
    );
  }

  entries.set(source, { source, target, reason });
}

function buildRedirects() {
  const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
  const redirectSource = fs.readFileSync(redirectsPath, "utf8");
  const sitemapUrls = parseSitemapUrls(sitemapXml);
  const retiredRedirects = parsePermanentRedirects(redirectSource);
  const entries = new Map();

  if (!sitemapUrls.length) throw new Error("A sitemap.xml nem tartalmaz URL-t.");

  // Current canonical pages: redirect their historical physical .html path directly
  // to the extensionless canonical URL.
  for (const canonicalValue of sitemapUrls) {
    const canonical = new URL(canonicalValue);
    if (canonical.origin !== SITE_ORIGIN) {
      throw new Error(`Nem várt sitemap origin: ${canonicalValue}`);
    }
    if (canonical.search || canonical.hash) {
      throw new Error(`A sitemap URL queryt vagy fragmentet tartalmaz: ${canonicalValue}`);
    }
    if (/\.html$/i.test(canonical.pathname)) {
      throw new Error(`A sitemap nem extensionless URL-t tartalmaz: ${canonicalValue}`);
    }

    const sourceFile = publicPathToSourceFile(canonical);
    if (!/\.html$/i.test(sourceFile)) continue;

    const legacyPath = `/${sourceFile.replace(/\\/g, "/")}`;
    addRedirect(entries, sourceKeyFromPath(legacyPath), canonical.href, "sitemap canonical");
  }

  // Retired/merged pages from the repository's explicit redirect map.
  // These are added after the generic legacy mapping so an accidental conflict is detected.
  for (const rule of retiredRedirects) {
    const fromUrl = /^https?:\/\//i.test(rule.from)
      ? new URL(rule.from)
      : new URL(rule.from, SITE_ORIGIN);

    if (fromUrl.origin !== SITE_ORIGIN) {
      throw new Error(`Nem várt redirect source origin: ${rule.from}`);
    }
    if (fromUrl.search || fromUrl.hash) {
      throw new Error(`Redirect source queryt vagy fragmentet tartalmaz: ${rule.from}`);
    }

    addRedirect(
      entries,
      sourceKeyFromPath(fromUrl.pathname),
      absoluteTarget(rule.to),
      "_redirects permanent rule"
    );
  }

  return [...entries.values()].sort((a, b) => a.source.localeCompare(b.source, "hu"));
}

function toCsv(entries) {
  // Cloudflare Bulk Redirect CSV format, intentionally without a header row:
  // SOURCE_URL,TARGET_URL,STATUS_CODE,PRESERVE_QUERY_STRING,
  // INCLUDE_SUBDOMAINS,SUBPATH_MATCHING,PRESERVE_PATH_SUFFIX
  return `${entries
    .map(({ source, target }) =>
      [source, target, 301, "TRUE", "FALSE", "FALSE", "FALSE"].map(csvValue).join(",")
    )
    .join("\n")}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const entries = buildRedirects();
  const csv = toCsv(entries);

  if (args.stdout) process.stdout.write(csv);
  else {
    fs.writeFileSync(args.output, csv, "utf8");
    console.log(`Cloudflare Bulk Redirect CSV elkészült: ${path.relative(root, args.output)} (${entries.length} szabály)`);
  }
}

try {
  main();
} catch (error) {
  console.error(error?.stack || error?.message || error);
  process.exitCode = 1;
}

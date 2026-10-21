const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { publicUrlForSource } = require("./url-paths");
const { sitePageRoutes } = require("./site-page-inventory");
const { stableGeneratedAt } = require("./sitemap-date-state");

const root = path.resolve(__dirname, "..");
const stateDirectory = path.join(root, "data");
const statePath = path.join(stateDirectory, "sitemap-content-state.json");
const urls = sitePageRoutes(root);
const currentDate = new Date().toISOString().slice(0, 10);

const loadState = () => {
  if (!fs.existsSync(statePath)) return { version: 1, pages: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return parsed && parsed.version === 1 && parsed.pages ? parsed : { version: 1, pages: {} };
  } catch {
    return { version: 1, pages: {} };
  }
};

const stripVolatileUi = (html) =>
  html
    .replace(/<section\b[^>]*class=["'][^"']*retention-cta[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, " ")
    .replace(/<section\b[^>]*class=["'][^"']*ad-section[^"']*["'][^>]*>[\s\S]*?<\/section>/gi, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[^>]*-->/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const meaningfulContent = (pageFile) => {
  const absolute = path.join(root, pageFile);
  if (!fs.existsSync(absolute)) return "";
  const html = fs.readFileSync(absolute, "utf8");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
  return stripVolatileUi(main);
};

const contentHash = (pageFile) =>
  crypto.createHash("sha256").update(meaningfulContent(pageFile)).digest("hex");

const semanticDate = (pageFile) => {
  const absolute = path.join(root, pageFile);
  if (!fs.existsSync(absolute)) return null;
  const html = fs.readFileSync(absolute, "utf8");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
  const candidates = [];

  for (const match of html.matchAll(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/g)) candidates.push(match[1]);
  for (const match of main.matchAll(/<time\b[^>]*datetime=["'](\d{4}-\d{2}-\d{2})["']/gi)) candidates.push(match[1]);

  const valid = candidates.filter((value) => value <= currentDate).sort();
  return valid.at(-1) || null;
};

const gitPageDate = (pageFile) => {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs", "--", pageFile], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || currentDate;
  } catch {
    return currentDate;
  }
};

const state = loadState();
const nextState = { version: 1, generatedAt: state.generatedAt || currentDate, pages: {} };

const getLastModified = (url) => {
  const pageFile = url || "index.html";
  const hash = contentHash(pageFile);
  const previous = state.pages[url];
  let lastmod;

  if (previous && previous.hash === hash && /^\d{4}-\d{2}-\d{2}$/.test(previous.lastmod || "")) {
    lastmod = previous.lastmod;
  } else if (previous) {
    lastmod = currentDate;
  } else {
    // First state build: prefer an explicit visible review/article date. This avoids
    // inheriting a fake site-wide freshness date from shared CSS/header/build commits.
    lastmod = semanticDate(pageFile) || gitPageDate(pageFile);
  }

  nextState.pages[url] = { hash, lastmod };
  return lastmod;
};

const body = urls
  .map((url) => `    <url>\n        <loc>${publicUrlForSource(url)}</loc>\n        <lastmod>${getLastModified(url)}</lastmod>\n    </url>`)
  .join("\n\n");

// A scheduled rebuild must not change generatedAt just because the day changed.
// Only a changed URL inventory or changed meaningful page content updates it.
const previousPages = state.pages || {};
const pagesChanged = Object.keys(previousPages).length !== Object.keys(nextState.pages).length ||
  Object.entries(nextState.pages).some(([url, entry]) =>
    previousPages[url]?.hash !== entry.hash || previousPages[url]?.lastmod !== entry.lastmod);
nextState.generatedAt = stableGeneratedAt({ previous: state.generatedAt, contentChanged: pagesChanged, today: currentDate });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${body}\n\n</urlset>\n`;

fs.mkdirSync(stateDirectory, { recursive: true });
fs.writeFileSync(statePath, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated content-aware sitemap with ${urls.length} URLs.`);

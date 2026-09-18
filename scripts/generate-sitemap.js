const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { publicUrlForSource } = require("./url-paths");
const expansionCalculators = [
  ...require("../js/expansion-batch-01-data.js"),
  ...require("../js/expansion-batch-02-data.js"),
  ...require("../js/expansion-batch-03-data.js"),
  ...require("../js/expansion-batch-04-data.js"),
  ...require("../js/expansion-batch-05-data.js"),
];

const root = path.resolve(__dirname, "..");
const stateDirectory = path.join(root, "data");
const statePath = path.join(stateDirectory, "sitemap-content-state.json");
const dataCode = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const context = { window: {} };

vm.createContext(context);
vm.runInContext(dataCode, context);

const { categories, calculators } = context.window.KB_DATA;

const phase2RetiredCalculators = new Set([
  "kalkulatorok/hosszusag-atvalto-kalkulator.html",
  "kalkulatorok/terulet-atvalto-kalkulator.html",
  "kalkulatorok/terfogat-atvalto-kalkulator.html",
  "kalkulatorok/tomeg-atvalto-kalkulator.html",
  "kalkulatorok/homerseklet-atvalto-kalkulator.html",
  "kalkulatorok/ido-atvalto-kalkulator.html",
  "kalkulatorok/sebesseg-atvalto-kalkulator.html",
  "kalkulatorok/adatmeret-atvalto-kalkulator.html",
  "kalkulatorok/energia-atvalto-kalkulator.html",
  "kalkulatorok/nyomas-atvalto-kalkulator.html",
  "kalkulatorok/teljesitmeny-atvalto-kalkulator.html"
]);

// Keep sitemap URL ordering independent from the visual/category navigation order.
// Reordering cards on the site should not create a meaningless sitemap diff.
const stableCategoryOrder = ["penzugyi", "mindennapi", "egeszseg", "auto", "epitoipari", "atvaltok"];
const categoryById = new Map(categories.map((category) => [category.id, category]));
const orderedCategoryUrls = [
  ...stableCategoryOrder.map((id) => categoryById.get(id)?.url).filter(Boolean),
  ...categories
    .filter((category) => !stableCategoryOrder.includes(category.id))
    .map((category) => category.url)
    .sort((a, b) => a.localeCompare(b, "hu")),
];

const currentDirectory = path.join(root, "aktualis");
const currentPages = fs.existsSync(currentDirectory)
  ? fs.readdirSync(currentDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
      .map((entry) => `aktualis/${entry.name}`)
      .sort((a, b) => a.localeCompare(b, "hu"))
  : [];

const staticPages = [
  "",
  ...orderedCategoryUrls,
  "kalkulatorok.html",
  "kalkulatorok/multifunkcios-szamologep.html",
  "dontesek.html",
  "osszehasonlitas.html",
  "rolunk.html",
  "szamitasi-modszertan.html",
  "kapcsolat.html",
  "adatvedelem.html",
  "cookie.html",
  "felhasznalasi-feltetelek.html",
  "jogi-nyilatkozat.html",
  "atlathatosag-es-minoseg.html",
  "miert-bizhatsz-bennunk.html",
  "impresszum.html",
  "elethelyzetek.html",
  "aktualis.html",
  ...currentPages,
  "landing-pages/elethelyzetek/lakasvasarlas.html",
  "landing-pages/elethelyzetek/autofenntartas.html",
  "landing-pages/elethelyzetek/fizetes-munkaber.html",
  "landing-pages/elethelyzetek/befektetes-kezdoknek.html",
  "landing-pages/elethelyzetek/felujitas-tervezese.html",
  "landing-pages/elethelyzetek/csaladi-koltsegvetes.html",
  "landing-pages/wise/wise.html",
  "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
];

const calculatorPages = [...calculators, ...expansionCalculators].map((calculator) => calculator.url).filter((url) => !phase2RetiredCalculators.has(url));
const urls = [...new Set([...staticPages, ...calculatorPages])];
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
const nextState = { version: 1, generatedAt: currentDate, pages: {} };

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

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${body}\n\n</urlset>\n`;

fs.mkdirSync(stateDirectory, { recursive: true });
fs.writeFileSync(statePath, `${JSON.stringify(nextState, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated content-aware sitemap with ${urls.length} URLs.`);

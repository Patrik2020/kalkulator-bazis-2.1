const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://kalkulatorbazis.hu";
const dataCode = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const context = { window: {} };

vm.createContext(context);
vm.runInContext(dataCode, context);

const { categories, calculators } = context.window.KB_DATA;

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

const staticPages = [
  "",
  ...orderedCategoryUrls,
  "kalkulatorok.html",
  "kalkulatorok/multifunkcios-szamologep.html",
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
  "landing-pages/elethelyzetek/lakasvasarlas.html",
  "landing-pages/elethelyzetek/autofenntartas.html",
  "landing-pages/elethelyzetek/fizetes-munkaber.html",
  "landing-pages/elethelyzetek/befektetes-kezdoknek.html",
  "landing-pages/elethelyzetek/felujitas-tervezese.html",
  "landing-pages/elethelyzetek/csaladi-koltsegvetes.html",
  "landing-pages/wise/wise.html",
  "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
];

const calculatorPages = calculators.map((calculator) => calculator.url);

// Only shared files whose changes materially alter visible page content belong here.
// Technical loaders (for example global-head.js / analytics / AdSense) must not
// make every URL look freshly updated in the sitemap.
const sharedPageFiles = [
  "components/header.html",
  "components/footer.html",
  "js/utils.js",
  "js/site-ui.js",
  "css/style.css",
  "css/theme.css",
  "css/layout/header.css",
  "css/layout/footer.css",
];

const currentDate = new Date().toISOString().slice(0, 10);

const getLastModified = (url) => {
  const pageFile = url || "index.html";
  const paths = [pageFile, ...sharedPageFiles];

  try {
    const dirty = execFileSync("git", ["status", "--porcelain", "--", ...paths], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (dirty) return currentDate;

    const commitDate = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...paths], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return commitDate || currentDate;
  } catch {
    return currentDate;
  }
};

const urls = [...new Set([...staticPages, ...calculatorPages])];

const body = urls
  .map((url) => `    <url>\n        <loc>${siteUrl}/${url}</loc>\n        <lastmod>${getLastModified(url)}</lastmod>\n    </url>`)
  .join("\n\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${body}\n\n</urlset>\n`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated sitemap with ${urls.length} URLs.`);

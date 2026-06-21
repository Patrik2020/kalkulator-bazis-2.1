const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://kalkulatorbazis.hu";
const dataCode = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const context = { window: {} };

vm.createContext(context);
vm.runInContext(dataCode, context);

const { categories, calculators } = context.window.KB_DATA;

const staticPages = [
  { url: "", priority: "1.0" },
  ...categories.map((category) => ({ url: category.url, priority: "0.9" })),
  { url: "kalkulatorok.html", priority: "0.9" },
  { url: "adatvedelem.html", priority: "0.5" },
  { url: "cookie.html", priority: "0.5" },
  { url: "felhasznalasi-feltetelek.html", priority: "0.5" },
  { url: "landing-pages/wise/wise.html", priority: "0.8" },
  { url: "landing-pages/wise/adatkezelesi-tajekoztato.html", priority: "0.3" },
  { url: "landing-pages/wise/cookie-tajekoztato.html", priority: "0.3" },
  { url: "landing-pages/wise/jogi-nyilatkozat.html", priority: "0.3" },
  { url: "landing-pages/wise/kapcsolat.html", priority: "0.3" },
  { url: "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html", priority: "0.8" },
];

const calculatorPages = calculators.map((calculator) => ({
  url: calculator.url,
  priority: calculator.popular ? "0.9" : "0.8",
}));

const urls = [...staticPages, ...calculatorPages];

const body = urls
  .map(({ url, priority }) => `    <url>
        <loc>${siteUrl}/${url}</loc>
        <priority>${priority}</priority>
    </url>`)
  .join("\n\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${body}

</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated sitemap with ${urls.length} URLs.`);

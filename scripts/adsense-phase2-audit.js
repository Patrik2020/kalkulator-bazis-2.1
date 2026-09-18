const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const slugs = [
  "hosszusag-atvalto-kalkulator",
  "terulet-atvalto-kalkulator",
  "terfogat-atvalto-kalkulator",
  "tomeg-atvalto-kalkulator",
  "homerseklet-atvalto-kalkulator",
  "ido-atvalto-kalkulator",
  "sebesseg-atvalto-kalkulator",
  "adatmeret-atvalto-kalkulator",
  "energia-atvalto-kalkulator",
  "nyomas-atvalto-kalkulator",
  "teljesitmeny-atvalto-kalkulator"
];
const hubFile = "kalkulatorok/mertekegyseg-atvalto-kalkulator.html";
const hubCanonical = "https://kalkulatorbazis.hu/kalkulatorok/mertekegyseg-atvalto-kalkulator";
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const failures = [];

if (!fs.existsSync(path.join(root, hubFile))) failures.push("hiányzik az új mértékegység-átváltó központ");
if (!fs.existsSync(path.join(root, "js/atvaltok/mertekegyseg-kozpont.js"))) failures.push("hiányzik az új átváltó motor");

const siteData = read("js/site-data.js");
if (!siteData.includes('url: "kalkulatorok/mertekegyseg-atvalto-kalkulator.html"')) failures.push("az új központ nincs a site-data katalógusban");

for (const slug of slugs) {
  const rel = `kalkulatorok/${slug}.html`;
  const html = read(rel);
  if (!/<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) &&
      !/<meta[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html)) {
    failures.push(`${rel}: hiányzik a noindex`);
  }
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1]
    || "";
  if (canonical !== hubCanonical) failures.push(`${rel}: hibás canonical -> ${canonical || "nincs"}`);
  if (!html.includes("KB_PHASE2:converter-retired:START")) failures.push(`${rel}: hiányzik a kivezetési jelzés`);

  const marker = `url: "kalkulatorok/${slug}.html"`;
  const idx = siteData.indexOf(marker);
  if (idx < 0) failures.push(`${rel}: hiányzik a site-data rekord`);
  else {
    const start = siteData.lastIndexOf("\n    {", idx);
    const end = siteData.indexOf("\n    },", idx);
    const block = siteData.slice(start, end);
    if (!/hidden:\s*true/.test(block)) failures.push(`${rel}: nincs hidden=true`);
  }
}

const sitemap = read("sitemap.xml");
if (!sitemap.includes("/kalkulatorok/mertekegyseg-atvalto-kalkulator")) failures.push("az új központ hiányzik a sitemapből");
for (const slug of slugs) {
  if (sitemap.includes(`/kalkulatorok/${slug}`)) failures.push(`${slug}: még szerepel a sitemapben`);
}

const category = read("atvaltok.html");
const catalog = read("kalkulatorok.html");
if (!category.includes("mertekegyseg-atvalto-kalkulator")) failures.push("az Átváltók kategória nem hivatkozik az új központra");
if (!catalog.includes("mertekegyseg-atvalto-kalkulator")) failures.push("az összes kalkulátor katalógus nem hivatkozik az új központra");
for (const slug of slugs) {
  if (category.includes(`href="./kalkulatorok/${slug}`) || category.includes(`href="kalkulatorok/${slug}`)) failures.push(`atvaltok.html: kivezetett kártya maradt: ${slug}`);
}

const cookie = read("js/cookie.js");
for (const slug of slugs) {
  if (!cookie.includes(`"kalkulatorok/${slug}"`)) failures.push(`cookie policy: hiányzó kizárás ${slug}`);
}

if (failures.length) {
  console.error("AdSense Phase 2 consolidation audit FAILED:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("AdSense Phase 2 consolidation audit OK.");
console.log(`- kivezetett önálló konverterek: ${slugs.length}`);
console.log("- új központ: indexelhető, sitemapben és katalógusban");
console.log("- régi konverterek: noindex + canonical + AdSense-kizárás");

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://kalkulatorbazis.hu";

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  if ([".git", "node_modules"].includes(entry.name)) return [];
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

const relative = (file) => path.relative(root, file).replace(/\\/g, "/");
const htmlFiles = walk(root).filter((file) => {
  const name = relative(file);
  return name.endsWith(".html") && !name.startsWith("components/") && !name.startsWith("docs/");
});

const decode = (value = "") => value
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#(?:39|x27);/gi, "'")
  .replace(/&ndash;|&#8211;/gi, "–")
  .replace(/&mdash;|&#8212;/gi, "—");

const stripHtml = (value = "") => decode(value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " "))
  .replace(/\s+/g, " ")
  .trim();

const first = (value, pattern) => value.match(pattern)?.[1]?.trim() || "";
const count = (value, pattern) => [...value.matchAll(pattern)].length;
const canonicalFor = (name) => name === "index.html" ? `${siteUrl}/` : `${siteUrl}/${name}`;

const sitemapXml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim()));

const qualitySources = [
  "js/finance-quality-upgrades.js",
  "js/construction-quality-upgrades.js",
  "js/health-everyday-quality-upgrades.js",
  "js/auto-converter-quality-upgrades.js",
  "js/site-quality-final.js",
].map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const hardErrors = [];
const warnings = [];
const records = [];

for (const file of htmlFiles) {
  const name = relative(file);
  const html = fs.readFileSync(file, "utf8");
  const head = first(html, /<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const body = first(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const text = stripHtml(body);
  const title = stripHtml(first(head, /<title\b[^>]*>([\s\S]*?)<\/title>/i));
  const description = first(head, /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i);
  const canonical = first(head, /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']*)["'])[^>]*>/i);
  const robots = first(head, /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i);
  const noindex = /\bnoindex\b/i.test(robots);
  const redirect = /<meta\b(?=[^>]*http-equiv=["']refresh["'])/i.test(head);
  const is404 = name === "404.html";
  const indexable = !noindex && !redirect && !is404;
  const h1Count = count(body, /<h1\b[^>]*>/gi);
  const internalLinks = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((href) => href && !/^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(href));
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  if (!title) hardErrors.push(`${name}: hiányzó <title>.`);
  if (indexable && !description) hardErrors.push(`${name}: indexelhető oldalon hiányzó meta description.`);
  if (indexable && canonical !== canonicalFor(name)) hardErrors.push(`${name}: hibás vagy hiányzó canonical (${canonical || "nincs"}).`);
  if (indexable && h1Count !== 1) hardErrors.push(`${name}: indexelhető oldalon ${h1Count} darab H1 van.`);
  if (indexable && !sitemapUrls.has(canonicalFor(name))) hardErrors.push(`${name}: indexelhető, de nincs a sitemapben.`);
  if (html.includes("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639795157074812")) {
    hardErrors.push(`${name}: közvetlen AdSense script-betöltés található a HTML-ben.`);
  }
  if (indexable && internalLinks.length < 2) warnings.push(`${name}: kevés statikus belső link (${internalLinks.length}).`);
  if (indexable && words < 120) warnings.push(`${name}: kevés statikusan olvasható saját szöveg (${words} szó); ellenőrizd, hogy a funkcionális érték önmagában elég-e.`);

  records.push({ name, title, description, indexable, text, words });
}

const indexable = records.filter((record) => record.indexable);
const duplicateFieldCheck = (field, label) => {
  const seen = new Map();
  for (const record of indexable) {
    const value = record[field]?.trim().toLocaleLowerCase("hu-HU");
    if (!value) continue;
    if (seen.has(value)) hardErrors.push(`${record.name}: a ${label} megegyezik ezzel: ${seen.get(value)}.`);
    else seen.set(value, record.name);
  }
};
duplicateFieldCheck("title", "title");
duplicateFieldCheck("description", "meta description");

const normalizeWords = (text) => text
  .toLocaleLowerCase("hu-HU")
  .replace(/[^a-záéíóöőúüű0-9\s-]/gi, " ")
  .split(/\s+/)
  .filter((word) => word.length > 2);

const shingles = (text, size = 5) => {
  const words = normalizeWords(text);
  const result = new Set();
  for (let i = 0; i <= words.length - size; i += 1) result.add(words.slice(i, i + size).join(" "));
  return result;
};

const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
};

const duplicateCandidates = indexable
  .filter((record) => record.words >= 120)
  .map((record) => ({ ...record, shingles: shingles(record.text) }));

for (let i = 0; i < duplicateCandidates.length; i += 1) {
  for (let j = i + 1; j < duplicateCandidates.length; j += 1) {
    const a = duplicateCandidates[i];
    const b = duplicateCandidates[j];
    const similarity = jaccard(a.shingles, b.shingles);
    if (similarity >= 0.93) hardErrors.push(`${a.name} ↔ ${b.name}: nagyon magas tartalmi hasonlóság (${(similarity * 100).toFixed(1)}%).`);
    else if (similarity >= 0.80) warnings.push(`${a.name} ↔ ${b.name}: magas tartalmi hasonlóság (${(similarity * 100).toFixed(1)}%).`);
  }
}

const calculatorRecords = indexable.filter((record) => record.name.startsWith("kalkulatorok/") && record.name.endsWith(".html"));
for (const record of calculatorRecords) {
  const slug = path.basename(record.name, ".html");
  if (!qualitySources.includes(`"${slug}"`) && !qualitySources.includes(`\`${record.name}\``) && !qualitySources.includes(`"${record.name}"`)) {
    hardErrors.push(`${record.name}: nincs megtalálható oldal-specifikus Quality 3.0 modulban.`);
  }
}

const categoryRoutes = ["penzugyi.html", "epitoipari.html", "egeszseg.html", "mindennapi.html", "auto.html", "atvaltok.html"];
for (const route of categoryRoutes) {
  const slug = path.basename(route, ".html");
  if (!qualitySources.includes(`"${slug}"`)) hardErrors.push(`${route}: nincs dedikált kategóriaszintű Quality 3.0 lefedettség.`);
}

const finalRoutes = [
  "index.html",
  "kalkulatorok.html",
  "elethelyzetek.html",
  "rolunk.html",
  "kapcsolat.html",
  "miert-bizhatsz-bennunk.html",
  "atlathatosag-es-minoseg.html",
  "szamitasi-modszertan.html",
  "adatvedelem.html",
  "cookie.html",
  "felhasznalasi-feltetelek.html",
  "jogi-nyilatkozat.html",
  "impresszum.html",
  "kalkulatorok/multifunkcios-szamologep.html",
  "landing-pages/elethelyzetek/lakasvasarlas.html",
  "landing-pages/elethelyzetek/autofenntartas.html",
  "landing-pages/elethelyzetek/fizetes-munkaber.html",
  "landing-pages/elethelyzetek/befektetes-kezdoknek.html",
  "landing-pages/elethelyzetek/felujitas-tervezese.html",
  "landing-pages/elethelyzetek/csaladi-koltsegvetes.html",
  "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
  "landing-pages/wise/wise.html",
];
const finalQualityCode = fs.readFileSync(path.join(root, "js", "site-quality-final.js"), "utf8");
for (const route of finalRoutes) {
  if (!finalQualityCode.includes(`"${route}"`)) hardErrors.push(`${route}: hiányzik a végső oldal-specifikus minőségi modulból.`);
}

const redirectIndexingMistakes = records.filter((record) => /landing-pages\/wise\/(?:adatkezelesi-tajekoztato|kapcsolat|jogi-nyilatkozat)\.html/.test(record.name) && record.indexable);
for (const record of redirectIndexingMistakes) hardErrors.push(`${record.name}: Wise segéd/redirect oldal indexelhető maradt.`);

console.log("\nKalkulátor Bázis – Quality 3.0 audit");
console.log("====================================");
console.log(`HTML oldalak: ${records.length}`);
console.log(`Indexelhető oldalak: ${indexable.length}`);
console.log(`Kalkulátoroldalak: ${calculatorRecords.length}`);
console.log(`Sitemap URL-ek: ${sitemapUrls.size}`);
console.log(`Figyelmeztetések: ${warnings.length}`);
console.log(`Blokkoló hibák: ${hardErrors.length}`);

if (warnings.length) {
  console.log("\nFigyelmeztetések (nem blokkolók):");
  warnings.slice(0, 40).forEach((warning) => console.log(`- ${warning}`));
  if (warnings.length > 40) console.log(`- … és még ${warnings.length - 40} figyelmeztetés.`);
}

if (hardErrors.length) {
  console.error("\nBlokkoló hibák:");
  hardErrors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("\nOK – nincs blokkoló Quality 3.0 hiba. A pontszám nem Google-kritérium; az audit technikai, egyediségi és lefedettségi regressziókat fog meg.");

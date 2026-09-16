const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const args = new Set(process.argv.slice(2));
const shouldWriteReport = args.has("--report");
const shouldGate = args.has("--gate");
const reportPath = path.join(root, "docs", "adsense-quality-v2-report.md");

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));
const relative = (file) => path.relative(root, file).replace(/\\/g, "/");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "docs", "components"].includes(entry.name)) return [];
      return walk(absolute);
    }
    return [absolute];
  });

const decode = (value = "") =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&hellip;|&#8230;/gi, "…");

const stripHtml = (value = "") =>
  decode(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

const first = (value, pattern) => value.match(pattern)?.[1]?.trim() || "";
const normalize = (value = "") =>
  stripHtml(value)
    .toLocaleLowerCase("hu-HU")
    .replace(/[“”„"'’]/g, "")
    .replace(/\b\d+(?:[.,]\d+)?\b/g, "#")
    .replace(/[^\p{L}\p{N}#%+–—\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const htmlFiles = walk(root).filter((file) => relative(file).endsWith(".html"));

let calculatorMeta = [];
try {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read("js/site-data.js"), context);
  calculatorMeta = context.window.KB_DATA?.calculators || [];
} catch (error) {
  console.warn(`WARN: site-data.js nem olvasható: ${error.message}`);
}
const calculatorByPath = new Map(calculatorMeta.map((item) => [item.url, item]));

const informationalExact = new Set([
  "adatvedelem.html",
  "cookie.html",
  "felhasznalasi-feltetelek.html",
  "jogi-nyilatkozat.html",
  "impresszum.html",
  "kapcsolat.html",
  "rolunk.html",
  "atlathatosag-es-minoseg.html",
  "miert-bizhatsz-bennunk.html",
  "szamitasi-modszertan.html",
  "404.html",
]);

const adEligibleExact = new Set([
  "aktualis.html",
  "dontesek.html",
  "osszehasonlitas.html",
  "elethelyzetek.html",
  "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
]);
const adEligiblePrefixes = ["kalkulatorok/", "aktualis/", "landing-pages/elethelyzetek/"];
const adExcludedPrefixes = ["landing-pages/wise/"];

const isRedirect = (html) => /<meta\b(?=[^>]*http-equiv=["']refresh["'])/i.test(html);
const isAdEligible = (name, html) => {
  if (informationalExact.has(name) || isRedirect(html)) return false;
  if (adExcludedPrefixes.some((prefix) => name.startsWith(prefix))) return false;
  return adEligibleExact.has(name) || adEligiblePrefixes.some((prefix) => name.startsWith(prefix));
};

const classify = (name, html) => {
  if (name === "404.html") return "hibaoldal";
  if (isRedirect(html)) return "átirányító";
  if (name.startsWith("kalkulatorok/")) return "kalkulátor";
  if (name.startsWith("aktualis/")) return "aktuális cikk";
  if (name.startsWith("landing-pages/elethelyzetek/")) return "élethelyzet";
  if (name.startsWith("landing-pages/wise/")) return "partneroldal";
  if (name.startsWith("landing-pages/")) return "landing";
  if (informationalExact.has(name)) return "bizalmi/tájékoztató";
  return "tartalmi/hub";
};

const extractBlocks = (mainHtml) => {
  const blocks = [];
  for (const match of mainHtml.matchAll(/<(p|h2|h3|li|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = stripHtml(match[2]);
    const normalized = normalize(text);
    const words = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
    if (words.length >= 10 && text.length >= 70) blocks.push({ text, normalized, words: words.length });
  }
  return blocks;
};

const tokenSet = (text) => new Set(normalize(text).split(/\s+/).filter((token) => token.length >= 3));
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
};

const genericPatterns = [
  ["Mit tud többet ez a változat?", /mit tud többet ez a változat/i],
  ["Tájékoztató tervezési segédlet", /tájékoztató (?:jellegű )?tervezési segédlet/i],
  ["Ez a kalkulátor segít", /ez a kalkulátor segít/i],
  ["Gyors és egyszerű", /gyors és egyszerű/i],
  ["Használd ingyen", /használd ingyen/i],
];

const records = htmlFiles.map((file) => {
  const name = relative(file);
  const html = fs.readFileSync(file, "utf8");
  const head = first(html, /<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const main = first(html, /<main\b[^>]*>([\s\S]*?)<\/main>/i) || first(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const text = stripHtml(main);
  const title = stripHtml(first(head, /<title\b[^>]*>([\s\S]*?)<\/title>/i));
  const description = first(head, /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i);
  const canonical = first(head, /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']*)["'])[^>]*>/i);
  const robots = first(head, /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i);
  const type = classify(name, html);
  const meta = calculatorByPath.get(name);
  const ymyl = meta
    ? ["penzugyi", "egeszseg"].includes(meta.category)
    : /(?:penzugy|befektet|hitel|bér|egészség|kalória|bmi|terhesség)/i.test(`${name} ${title}`);
  const externalSources = [...main.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((href) => !/wise\.prf\.hn|kalkulatorbazis\.hu/i.test(href));
  const sponsoredLinks = [...html.matchAll(/<a\b[^>]*rel=["'][^"']*\bsponsored\b[^"']*["'][^>]*>/gi)].length;
  const directAdSense = /<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(html);
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const blocks = extractBlocks(main);
  const genericHits = genericPatterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  const who = /Kovács Patrik|Szerkesztette|Készítette|Fejlesztette|Üzemeltető/i.test(text);
  const how = /módszertan|hogyan számol|képlet|számítás menete|kerekítés|forrás|teszt|ellenőrz/i.test(text);
  const why = /mikor hasznos|mire használ|mire jó|célja|nem helyettesít|korlát|mire figyelj/i.test(text);
  const sourceSignal = externalSources.length > 0 || /NAV|MNB|KSH|WHO|NJT|jogszabály|hivatalos forrás|forrás:/i.test(text);
  const isNoindex = /\bnoindex\b/i.test(robots);

  return {
    name,
    type,
    title,
    description,
    canonical,
    html,
    main,
    text,
    wordCount,
    blocks,
    tokens: tokenSet(text),
    genericHits,
    ymyl,
    who,
    how,
    why,
    sourceSignal,
    externalSources,
    sponsoredLinks,
    directAdSense,
    isNoindex,
    redirect: isRedirect(html),
    adEligible: isAdEligible(name, html),
  };
});

const titleMap = new Map();
const descriptionMap = new Map();
const blockMap = new Map();
for (const record of records) {
  if (record.title) {
    const key = normalize(record.title);
    if (!titleMap.has(key)) titleMap.set(key, []);
    titleMap.get(key).push(record.name);
  }
  if (record.description) {
    const key = normalize(record.description);
    if (!descriptionMap.has(key)) descriptionMap.set(key, []);
    descriptionMap.get(key).push(record.name);
  }
  if (record.type === "kalkulátor") {
    for (const block of record.blocks) {
      if (!blockMap.has(block.normalized)) blockMap.set(block.normalized, { text: block.text, pages: new Set() });
      blockMap.get(block.normalized).pages.add(record.name);
    }
  }
}

const duplicateTitles = [...titleMap.entries()].filter(([, pages]) => pages.length > 1);
const duplicateDescriptions = [...descriptionMap.entries()].filter(([, pages]) => pages.length > 1);
const repeatedBlocks = [...blockMap.values()]
  .map((entry) => ({ text: entry.text, pages: [...entry.pages] }))
  .filter((entry) => entry.pages.length >= 4)
  .sort((a, b) => b.pages.length - a.pages.length || b.text.length - a.text.length);

const repeatedBlockIndex = new Map(repeatedBlocks.map((entry) => [normalize(entry.text), entry.pages.length]));
for (const record of records.filter((item) => item.type === "kalkulátor")) {
  const duplicatedChars = record.blocks
    .filter((block) => (repeatedBlockIndex.get(block.normalized) || 0) >= 4)
    .reduce((sum, block) => sum + block.text.length, 0);
  record.boilerplateRatio = record.text.length ? duplicatedChars / record.text.length : 0;
}

const calculatorRecords = records.filter((record) => record.type === "kalkulátor" && record.wordCount >= 80);
const similarPairs = [];
for (let i = 0; i < calculatorRecords.length; i += 1) {
  for (let j = i + 1; j < calculatorRecords.length; j += 1) {
    const score = jaccard(calculatorRecords[i].tokens, calculatorRecords[j].tokens);
    if (score >= 0.52) similarPairs.push({ a: calculatorRecords[i].name, b: calculatorRecords[j].name, score });
  }
}
similarPairs.sort((a, b) => b.score - a.score);

const ymylFailures = records.filter(
  (record) => record.ymyl && record.type === "kalkulátor" && (!record.who || !record.how || !record.why || !record.sourceSignal)
);
const genericPages = records.filter((record) => record.genericHits.length > 0);
const highBoilerplatePages = calculatorRecords.filter((record) => (record.boilerplateRatio || 0) >= 0.18);
const dangerousSimilarityPairs = similarPairs.filter((pair) => pair.score >= 0.68);
const directAdSensePages = records.filter((record) => record.directAdSense);
const redirectIndexingProblems = records.filter((record) => record.redirect && !record.isNoindex);
const excludedButPromotional = records.filter(
  (record) => !record.adEligible && record.sponsoredLinks > 0 && !record.name.startsWith("landing-pages/wise/")
);

let sitemapStats = null;
if (exists("sitemap.xml")) {
  const sitemap = read("sitemap.xml");
  const dates = [...sitemap.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)].map((match) => match[1]);
  const counts = new Map();
  for (const date of dates) counts.set(date, (counts.get(date) || 0) + 1);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  sitemapStats = {
    total: dates.length,
    topDate: sorted[0]?.[0] || null,
    topCount: sorted[0]?.[1] || 0,
    topShare: dates.length ? (sorted[0]?.[1] || 0) / dates.length : 0,
  };
}

const critical = [];
if (duplicateTitles.length) critical.push(`${duplicateTitles.length} duplikált title-csoport`);
if (duplicateDescriptions.length) critical.push(`${duplicateDescriptions.length} duplikált meta description-csoport`);
if (genericPages.length) critical.push(`${genericPages.length} generikus/sablonos szövegjeleket tartalmazó oldal`);
if (highBoilerplatePages.length) critical.push(`${highBoilerplatePages.length} magas boilerplate-arányú kalkulátor`);
if (dangerousSimilarityPairs.length) critical.push(`${dangerousSimilarityPairs.length} veszélyesen hasonló kalkulátorpár`);
if (ymylFailures.length) critical.push(`${ymylFailures.length} hiányos Who/How/Why/forrás YMYL-oldal`);
if (directAdSensePages.length) critical.push(`${directAdSensePages.length} közvetlen AdSense-scriptet betöltő HTML-oldal`);
if (redirectIndexingProblems.length) critical.push(`${redirectIndexingProblems.length} indexelhető átirányító oldal`);

const warnings = [];
if (sitemapStats && sitemapStats.total >= 20 && sitemapStats.topShare >= 0.8) {
  warnings.push(
    `A sitemap URL-ek ${(sitemapStats.topShare * 100).toFixed(0)}%-a ugyanazt a lastmod dátumot kapta (${sitemapStats.topDate}).`
  );
}
if (!/google-certified|tcf|__tcfapi/i.test(exists("js/cookie.js") ? read("js/cookie.js") : "")) {
  warnings.push(
    "A jelenlegi saját consent kódban nem látszik Google-certified / IAB TCF CMP integráció; ezt külön CMP-körben kezeljük."
  );
}
if (excludedButPromotional.length) warnings.push(`${excludedButPromotional.length} nem hirdetésre szánt oldalon van sponsored link.`);

const pct = (value) => `${(value * 100).toFixed(1)}%`;
const mdList = (items, render, empty = "- nincs") =>
  items.length ? items.map((item) => `- ${render(item)}`).join("\n") : empty;

const report =
  `# AdSense Quality v2 audit\n\n` +
  `Generálta: \`scripts/adsense-quality-v2-audit.js\`\n\n` +
  `## Összkép\n\n` +
  `- HTML-oldalak: **${records.length}**\n` +
  `- Kalkulátoroldalak: **${calculatorRecords.length}**\n` +
  `- Hirdetésre engedélyezett oldalak a kezdeti allowlist szerint: **${records.filter((record) => record.adEligible).length}**\n` +
  `- Kritikus jelzések: **${critical.length}**\n` +
  `- Figyelmeztetések: **${warnings.length}**\n\n` +
  `> A v2 audit szándékosan **nem használ minimális szószámot minőségi kapuként**. A hangsúly az egyediségen, a hozzáadott értéken, a forrásokon, a Who/How/Why jeleken és a site-wide sablonujjlenyomat csökkentésén van.\n\n` +
  `## Kritikus jelzések\n\n${mdList(critical, (item) => item)}\n\n` +
  `## Figyelmeztetések\n\n${mdList(warnings, (item) => item)}\n\n` +
  `## Ismétlődő tartalmi blokkok (>=4 kalkulátor)\n\n${mdList(
    repeatedBlocks.slice(0, 40),
    (item) => `**${item.pages.length} oldal:** ${item.text.slice(0, 220)}${item.text.length > 220 ? "…" : ""}`
  )}\n\n` +
  `## Magas boilerplate-arányú kalkulátorok (>=18%)\n\n${mdList(
    highBoilerplatePages.sort((a, b) => b.boilerplateRatio - a.boilerplateRatio),
    (item) => `\`${item.name}\` — ${pct(item.boilerplateRatio)}`
  )}\n\n` +
  `## Hasonló kalkulátorpárok (Jaccard >=0.52)\n\n${mdList(
    similarPairs.slice(0, 60),
    (item) => `\`${item.a}\` ↔ \`${item.b}\` — **${pct(item.score)}**`
  )}\n\n` +
  `## Generikus/sablonos fordulatok\n\n${mdList(
    genericPages,
    (item) => `\`${item.name}\` — ${item.genericHits.join(", ")}`
  )}\n\n` +
  `## YMYL Who / How / Why / forrás hiányok\n\n${mdList(
    ymylFailures,
    (item) =>
      `\`${item.name}\` — Who:${item.who ? "✓" : "✗"} How:${item.how ? "✓" : "✗"} Why:${item.why ? "✓" : "✗"} Forrás:${
        item.sourceSignal ? "✓" : "✗"
      }`
  )}\n\n` +
  `## Kezdeti AdSense allowlist\n\n${mdList(
    records.filter((record) => record.adEligible).map((record) => record.name).sort(),
    (item) => `\`${item}\``
  )}\n\n` +
  `## Kifejezetten kizárt / nem monetizálandó oldalak\n\n${mdList(
    records.filter((record) => !record.adEligible).map((record) => record.name).sort(),
    (item) => `\`${item}\``
  )}\n`;

if (shouldWriteReport) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report, "utf8");
  console.log(`AdSense Quality v2 riport: ${path.relative(root, reportPath)}`);
}

console.log(`AdSense Quality v2: ${records.length} oldal, ${calculatorRecords.length} kalkulátor.`);
console.log(`Kritikus jelzések: ${critical.length}; figyelmeztetések: ${warnings.length}.`);
for (const item of critical) console.log(`CRITICAL: ${item}`);
for (const item of warnings) console.log(`WARN: ${item}`);

if (shouldGate && critical.length > 0) process.exitCode = 1;

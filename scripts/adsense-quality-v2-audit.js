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

const isRedirect = (html) => /<meta\b(?=[^>]*http-equiv=["']refresh["'])/i.test(html);
const isAdEligible = (name, html) => {
  if (informationalExact.has(name) || phase2RetiredCalculators.has(name) || isRedirect(html)) return false;
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

const benignSharedPatterns = [
  /tedd el a kalkulátor bázist.*legközelebb/i,
  /nyisd meg a böngésződ menüjét.*könyvjelző/i,
  /a beírt értékek a böngésződben kerülnek feldolgozásra/i,
  /az oldal tájékoztató kalkulátor.*nem helyettesíti/i,
  /ez (?:a|az) .* kalkulátor.*nem helyettesíti/i,
  /fontos döntés előtt.*hivatalos.*forrás/i,
  /az eredmények tájékoztató becslések/i,
  // KB_ADSENSE_AUDIT_POLICY_V2 – standard trust/safety copy is not page-unique editorial content.
  /az oldal tájékoztató kalkulátor.*egyedi döntéshez szakember/i,
  /a kalkulátor tájékoztató segédlet.*egyedi egészségügyi vagy jogi döntést/i,
  /a referenciaértékek segítenek fejben ellenőrizni.*kerekítése/i,
  /gyártói\/rendszeradat ellenőrzése szükséges/i,
  /a számítás kiindulópont.*nem személyre szabott étrend/i,
  /vesebetegség.*fehérjecél.*általános kalkulátorból/i,
  /evészavar.*szakember bevonása indokolt/i,
  /a túl nagy kalóriadeficit.*regeneráció/i,
  /a mezők tájékoztató tervezésre valók.*hivatalos.*adat/i,
];
const isBenignSharedBlock = (text) => benignSharedPatterns.some((pattern) => pattern.test(text));

const extractBlocks = (mainHtml) => {
  // The following sections are intentionally standardized trust/safety UI.
  // They remain visible to users and are still checked by the YMYL/runtime gates,
  // but they must not inflate page-content boilerplate ratios.
  const editorialHtml = mainHtml
    .replace(/<!-- KB_ADSENSE:ymyl-trust:START -->[\s\S]*?<!-- KB_ADSENSE:ymyl-trust:END -->/g, " ")
    .replace(/<!-- KB_STATIC:reliability:START -->[\s\S]*?<!-- KB_STATIC:reliability:END -->/g, " ");
  const blocks = [];
  for (const match of editorialHtml.matchAll(/<(p|h2|h3|li|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = stripHtml(match[2]);
    const normalized = normalize(text);
    const words = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
    if (words.length >= 10 && text.length >= 70) {
      blocks.push({ text, normalized, words: words.length, benign: isBenignSharedBlock(text) });
    }
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
  const blocks = extractBlocks(main);
  const contentBlocks = blocks.filter((block) => !block.benign);
  const contentText = contentBlocks.map((block) => block.text).join(" ") || text;
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const genericHits = genericPatterns.filter(([, pattern]) => pattern.test(contentText)).map(([label]) => label);
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
    html,
    text,
    contentText,
    wordCount,
    blocks,
    contentBlocks,
    tokens: tokenSet(contentText),
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
const benignBlockMap = new Map();
for (const record of records) {
  if (record.isNoindex || record.redirect) continue;
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
      const target = block.benign ? benignBlockMap : blockMap;
      if (!target.has(block.normalized)) target.set(block.normalized, { text: block.text, pages: new Set() });
      target.get(block.normalized).pages.add(record.name);
    }
  }
}

const duplicateTitles = [...titleMap.entries()].filter(([, pages]) => pages.length > 1);
const duplicateDescriptions = [...descriptionMap.entries()].filter(([, pages]) => pages.length > 1);
const repeatedBlocks = [...blockMap.values()]
  .map((entry) => ({ text: entry.text, pages: [...entry.pages] }))
  .filter((entry) => entry.pages.length >= 4)
  .sort((a, b) => b.pages.length - a.pages.length || b.text.length - a.text.length);
const benignRepeatedBlocks = [...benignBlockMap.values()]
  .map((entry) => ({ text: entry.text, pages: [...entry.pages] }))
  .filter((entry) => entry.pages.length >= 4)
  .sort((a, b) => b.pages.length - a.pages.length);

const repeatedBlockIndex = new Map(repeatedBlocks.map((entry) => [normalize(entry.text), entry.pages.length]));
for (const record of records.filter((item) => item.type === "kalkulátor" && !item.isNoindex && !item.redirect)) {
  const duplicatedChars = record.contentBlocks
    .filter((block) => (repeatedBlockIndex.get(block.normalized) || 0) >= 4)
    .reduce((sum, block) => sum + block.text.length, 0);
  const ownContentChars = record.contentBlocks.reduce((sum, block) => sum + block.text.length, 0);
  record.boilerplateRatio = ownContentChars ? duplicatedChars / ownContentChars : 0;
}

const calculatorRecords = records.filter((record) => record.type === "kalkulátor" && !record.isNoindex && !record.redirect && record.wordCount >= 80);
const similarPairs = [];
for (let i = 0; i < calculatorRecords.length; i += 1) {
  for (let j = i + 1; j < calculatorRecords.length; j += 1) {
    const score = jaccard(calculatorRecords[i].tokens, calculatorRecords[j].tokens);
    if (score >= 0.52) similarPairs.push({ a: calculatorRecords[i].name, b: calculatorRecords[j].name, score });
  }
}
similarPairs.sort((a, b) => b.score - a.score);

const ymylFailures = records.filter(
  (record) => record.ymyl && record.type === "kalkulátor" && !record.isNoindex && !record.redirect && (!record.who || !record.how || !record.why || !record.sourceSignal)
);
const genericPages = records.filter((record) => !record.isNoindex && !record.redirect && record.genericHits.length > 0);
const highBoilerplatePages = calculatorRecords.filter((record) => (record.boilerplateRatio || 0) >= 0.18);
const dangerousSimilarityPairs = similarPairs.filter((pair) => pair.score >= 0.68);
const directAdSensePages = records.filter((record) => record.directAdSense);
const redirectIndexingProblems = records.filter((record) => record.redirect && !record.isNoindex);

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

const cookieCode = exists("js/cookie.js") ? read("js/cookie.js") : "";
const hasCertifiedCmpSignal = /__tcfapi|IAB TCF|fundingchoices|privacy-messaging/i.test(cookieCode);

const critical = [];
if (duplicateTitles.length) critical.push(`${duplicateTitles.length} duplikált title-csoport`);
if (duplicateDescriptions.length) critical.push(`${duplicateDescriptions.length} duplikált meta description-csoport`);
if (genericPages.length) critical.push(`${genericPages.length} generikus/sablonos szövegjeleket tartalmazó oldal`);
if (highBoilerplatePages.length) critical.push(`${highBoilerplatePages.length} magas tartalmi boilerplate-arányú kalkulátor`);
if (dangerousSimilarityPairs.length) critical.push(`${dangerousSimilarityPairs.length} veszélyesen hasonló kalkulátorpár`);
if (ymylFailures.length) critical.push(`${ymylFailures.length} hiányos Who/How/Why/forrás YMYL-kalkulátor`);
if (directAdSensePages.length) critical.push(`${directAdSensePages.length} közvetlen AdSense-scriptet tartalmazó oldal`);
if (redirectIndexingProblems.length) critical.push(`${redirectIndexingProblems.length} indexelhető redirect oldal`);

const warnings = [];
if (sitemapStats?.topShare >= 0.6 && sitemapStats.total >= 20) {
  warnings.push(`A sitemap URL-ek ${(sitemapStats.topShare * 100).toFixed(1)}%-a ugyanazt a lastmod dátumot kapta (${sitemapStats.topDate}).`);
}
if (!hasCertifiedCmpSignal) warnings.push("A saját consent-kódban nem látszik Google által minősített / IAB TCF CMP-integráció.");

const lines = [];
lines.push("# AdSense Quality v2 riport");
lines.push("");
lines.push(`- HTML oldalak: **${records.length}**`);
lines.push(`- Kalkulátoroldalak: **${calculatorRecords.length}**`);
lines.push(`- Kezdeti AdSense-eligible oldalak: **${records.filter((record) => record.adEligible).length}**`);
lines.push(`- Kritikus kategóriák: **${critical.length}**`);
lines.push(`- Figyelmeztetések: **${warnings.length}**`);
lines.push("");

lines.push("## Kritikus összegzés");
lines.push("");
if (!critical.length) lines.push("- Nincs kritikus eltérés.");
else critical.forEach((item) => lines.push(`- ${item}`));
lines.push("");

lines.push("## Generikus / sablonos oldalak");
lines.push("");
if (!genericPages.length) lines.push("- Nincs találat.");
else genericPages.forEach((record) => lines.push(`- \`${record.name}\`: ${record.genericHits.join(", ")}`));
lines.push("");

lines.push("## Magas tartalmi boilerplate-arány");
lines.push("");
if (!highBoilerplatePages.length) lines.push("- Nincs 18% feletti találat a hasznos közös UI/bizalmi blokkok kizárása után.");
else highBoilerplatePages
  .sort((a, b) => b.boilerplateRatio - a.boilerplateRatio)
  .forEach((record) => lines.push(`- \`${record.name}\`: ${(record.boilerplateRatio * 100).toFixed(1)}%`));
lines.push("");

lines.push("## Ismétlődő tartalmi blokkok (nem whitelistelt)");
lines.push("");
if (!repeatedBlocks.length) lines.push("- Nincs 4+ kalkulátoron azonos hosszú tartalmi blokk.");
else repeatedBlocks.slice(0, 25).forEach((entry) => {
  lines.push(`- **${entry.pages.length} oldal** – ${entry.text.slice(0, 240)}${entry.text.length > 240 ? "…" : ""}`);
});
lines.push("");

lines.push("## Whitelistelt közös UI / bizalmi blokkok");
lines.push("");
if (!benignRepeatedBlocks.length) lines.push("- Nincs 4+ oldalon közös whitelistelt blokk.");
else benignRepeatedBlocks.slice(0, 15).forEach((entry) => {
  lines.push(`- **${entry.pages.length} oldal** – ${entry.text.slice(0, 180)}${entry.text.length > 180 ? "…" : ""}`);
});
lines.push("");

lines.push("## YMYL Who / How / Why / forrás hiányok");
lines.push("");
if (!ymylFailures.length) lines.push("- Minden vizsgált YMYL-kalkulátor teljesíti a minimumot.");
else ymylFailures.forEach((record) => {
  const missing = [];
  if (!record.who) missing.push("Who");
  if (!record.how) missing.push("How");
  if (!record.why) missing.push("Why");
  if (!record.sourceSignal) missing.push("forrás");
  lines.push(`- \`${record.name}\`: ${missing.join(", ")}`);
});
lines.push("");

lines.push("## Hasonló kalkulátorpárok");
lines.push("");
if (!similarPairs.length) lines.push("- Nincs 0,52 feletti Jaccard-hasonlóság a whitelistelt közös szövegek leválasztása után.");
else similarPairs.slice(0, 25).forEach((pair) => lines.push(`- ${(pair.score * 100).toFixed(1)}% – \`${pair.a}\` ↔ \`${pair.b}\``));
lines.push("");

lines.push("## AdSense elhelyezési alap");
lines.push("");
lines.push("Kezdetben csak a kalkulátorok, az Aktuális tartalmi cikkek, az élethelyzet-oldalak és néhány valódi tartalmi hub kerülhet az allowlistre.");
lines.push("A 404, kapcsolat, impresszum, adatvédelem, cookie, jogi/felhasználási, redirect és Wise partneroldalak kizártak.");
lines.push("");

lines.push("## Sitemap és consent");
lines.push("");
if (sitemapStats) lines.push(`- Domináns lastmod: **${sitemapStats.topDate}**, ${sitemapStats.topCount}/${sitemapStats.total} URL (${(sitemapStats.topShare * 100).toFixed(1)}%).`);
lines.push(`- Google/IAB CMP-kódjel: **${hasCertifiedCmpSignal ? "található" : "nem található"}**.`);
lines.push("");

lines.push("## Figyelmeztetések");
lines.push("");
if (!warnings.length) lines.push("- Nincs figyelmeztetés.");
else warnings.forEach((item) => lines.push(`- ${item}`));
lines.push("");
lines.push("_A riport nem használ minimális szószámot minőségi kapuként. A fókusz az egyediségen, a valódi funkción, a forrásolhatóságon, a bizalmi jeleken és a monetizálható felület tisztaságán van._");

const report = `${lines.join("\n")}\n`;
if (shouldWriteReport) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report, "utf8");
}
process.stdout.write(report);

if (shouldGate && critical.length) {
  console.error(`AdSense Quality v2 gate failed: ${critical.join("; ")}`);
  process.exit(1);
}

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sitemapPath = path.join(root, "sitemap.xml");
const statePath = path.join(root, "data", "sitemap-content-state.json");
const failures = [];

if (!fs.existsSync(sitemapPath)) failures.push("hiányzik a sitemap.xml");
if (!fs.existsSync(statePath)) failures.push("hiányzik a data/sitemap-content-state.json");

if (!failures.length) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  const rows = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>\s*<\/url>/g)]
    .map((match) => ({ loc: match[1], lastmod: match[2] }));

  if (!rows.length) failures.push("a sitemap nem tartalmaz értelmezhető URL/lastmod párokat");
  if (!state || state.version !== 1 || !state.pages) failures.push("érvénytelen sitemap content-state formátum");

  const stateEntries = Object.values(state.pages || {});
  if (rows.length !== stateEntries.length) {
    failures.push(`URL/state elemszám eltérés: sitemap=${rows.length}, state=${stateEntries.length}`);
  }

  for (const entry of stateEntries) {
    if (!/^[a-f0-9]{64}$/.test(entry.hash || "")) failures.push("érvénytelen SHA-256 content hash a state-ben");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod || "")) failures.push("érvénytelen lastmod a state-ben");
  }

  const counts = new Map();
  rows.forEach(({ lastmod }) => counts.set(lastmod, (counts.get(lastmod) || 0) + 1));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [topDate, topCount] = sorted[0] || [null, 0];
  const topShare = rows.length ? topCount / rows.length : 0;

  console.log(`Sitemap URLs: ${rows.length}`);
  console.log(`Distinct lastmod dates: ${counts.size}`);
  console.log(`Dominant lastmod: ${topDate || "n/a"} (${(topShare * 100).toFixed(1)}%)`);

  // The content-aware state is the hard gate. A dominant historical date is only
  // informational because many pages can legitimately have been reviewed together.
  if (counts.size < 2 && rows.length >= 20) {
    failures.push("a tartalomérzékeny lastmod ellenére minden URL ugyanazt a dátumot kapta");
  }
}

if (failures.length) {
  console.error("Sitemap lastmod v2 audit FAILED:");
  [...new Set(failures)].forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Sitemap lastmod v2 audit OK.");

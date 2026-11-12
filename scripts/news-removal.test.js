"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { sitePageRoutes } = require("./site-page-inventory");
const { loadAdsensePolicy } = require("./adsense-policy");
const { pipeline } = require("./static-build-pipeline");
const root = path.resolve(__dirname, "..");
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if ([".git", "node_modules"].includes(entry.name)) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
test("news pages, links, assets and generated inventory are retired together", () => {
  for (const file of ["aktualis", "aktualis.html", "sitemap-aktualis.xml", "css/pages/aktualis.css", "css/components/news-status.css", "scripts/apply-adsense-current-moat-v2.js"]) {
    assert.equal(fs.existsSync(path.join(root, file)), false, file);
  }
  for (const file of walk(root).filter(file => /\.(html|inc)$/.test(file))) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(source, /href=["'][^"']*aktualis|href=["']#news|id=["']news["']|kb-news-aside|news-status\.css/, path.relative(root, file));
  }
  assert.ok(sitePageRoutes(root).every(route => !route.startsWith("aktualis")));
  for (const name of ["sitemap.xml", "robots.txt", "data/sitemap-content-state.json"]) {
    assert.doesNotMatch(fs.readFileSync(path.join(root, name), "utf8"), /aktualis/, name);
  }
  assert.ok(pipeline.every(phase => !phase.steps.includes("apply-adsense-current-moat-v2.js")));
  assert.doesNotMatch(fs.readFileSync(path.join(root, "js/home-redesign-core.js"), "utf8"), /refreshNews|renderNewsLanguage|fetch\('aktualis'/);
  const policy = loadAdsensePolicy(root);
  for (const route of ["/aktualis", "/aktualis.html", "/aktualis/retired-article"]) assert.equal(policy.isEligible(route), false);
  for (const route of ["/", "/kalkulatorok/netto-brutto-kalkulator"]) assert.equal(policy.isEligible(route), true);
});

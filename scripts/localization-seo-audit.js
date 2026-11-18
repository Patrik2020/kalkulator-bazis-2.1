"use strict";
// Read-only closeout inventory. Dictionary coverage is not a linguistic review
// and cannot prove that a browser actually applies a translation.
const fs = require("node:fs");
const path = require("node:path");
const { detailPages, supportPages } = require("./localization-manifest");
const support = require("../js/site-language-inner");
const shared = require("../js/shared-ui-locale");
const root = path.resolve(__dirname, "..");
const decode = value => value.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"')
  .replace(/&#39;|&apos;/gu, "'").replace(/&nbsp;/gu, " ").replace(/&#(\d+);/gu, (_, n) => String.fromCodePoint(Number(n)));

function audit() {
  return [...detailPages, ...supportPages.map(file => ({ path: file }))].map(page => {
    const html = fs.readFileSync(path.join(root, page.path), "utf8");
    const api = page.module ? require(path.join(root, page.module)) : support;
    const translate = (text, language) => (page.module ? api.translate(page.key, text, language) : api.translate(text, language)) ?? shared.translate(text, language);
    const metadata = [{ field: "title", source: decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] || "") }];
    for (const tag of html.matchAll(/<meta\b[^>]*>/giu)) {
      const attrs = Object.fromEntries([...tag[0].matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gu)].map(m => [m[1].toLowerCase(), decode(m[3])]));
      const field = attrs.name || attrs.property;
      if (["description", "og:title", "og:description", "twitter:title", "twitter:description"].includes(field)) metadata.push({ field, source: attrs.content || "" });
    }
    const missing = [];
    for (const item of metadata) for (const language of ["en", "de"]) {
      const value = translate(item.source, language);
      if (!item.source || value === null || value === undefined || !String(value).trim()) missing.push({ field: item.field, language, source: item.source });
    }
    const schemaCopy = [];
    function walk(value, location) {
      if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${location}[${i}]`));
      else if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) {
        if (["name", "headline", "description", "text"].includes(key) && typeof item === "string" && item !== "Kalkulátor Bázis" && /[áéíóöőúüű]/iu.test(item)) {
          for (const language of ["en", "de"]) if (translate(item, language) == null) schemaCopy.push({ field: `${location}.${key}`, language, source: item });
        }
        if (item && typeof item === "object") walk(item, `${location}.${key}`);
      }
    }
    for (const [i, match] of [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu)].entries()) {
      try { walk(JSON.parse(match[1]), `schema[${i}]`); } catch { missing.push({ field: `schema[${i}]`, language: "all", source: "Invalid JSON" }); }
    }
    return { path: page.path, metadataFields: metadata.length, missingMetadata: missing, missingSchemaCopy: schemaCopy,
      alternateLanguageUrls: [...html.matchAll(/<link\b[^>]*hreflang=["']([^"']+)["'][^>]*>/giu)].map(m => m[1]) };
  });
}
if (require.main === module) {
  const pages = audit();
  const result = { pages: pages.length, metadataGaps: pages.reduce((n, p) => n + p.missingMetadata.length, 0),
    schemaCopyGaps: pages.reduce((n, p) => n + p.missingSchemaCopy.length, 0),
    pagesWithAlternateUrls: pages.filter(p => p.alternateLanguageUrls.length).length, results: pages };
  if (process.argv.includes("--write")) {
    fs.writeFileSync(path.join(root, "docs/localization-seo-audit-findings.json"), JSON.stringify(result, null, 2) + "\n");
    console.log(`Saved read-only findings: ${pages.length} pages; ${result.metadataGaps} metadata and ${result.schemaCopyGaps} schema dictionary gaps.`);
  } else console.log(JSON.stringify(result, null, 2));
}
module.exports = { audit };

"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const api = require("../js/legal/impressum-locale");
const { requiresTranslation } = require("./localization-coverage-browser-checks");
const page = "impresszum";
const html = fs.readFileSync(require.resolve("../impresszum.html"), "utf8");
const main = html.match(/<main\b[\s\S]*?<\/main>/u)[0];
const decode = text => text.replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&#39;/gu, "'");

test("impressum main copy and metadata have reviewed English and German translations", () => {
  const values = [...main.matchAll(/>([^<>]+)</gu)].map(match => decode(match[1]).replace(/\s+/gu, " ").trim());
  for (const pattern of [/<title>([^<]+)<\/title>/u, /<meta name="description" content="([^"]+)"/u,
    /<meta property="og:title" content="([^"]+)"/u, /<meta property="og:description" content="([^"]+)"/u,
    /<meta name="twitter:title" content="([^"]+)"/u, /<meta name="twitter:description" content="([^"]+)"/u]) {
    values.push(decode(html.match(pattern)[1]));
  }
  for (const source of new Set(values.filter(Boolean))) {
    if (!requiresTranslation(source)) continue;
    for (const language of ["en", "de"]) assert.notEqual(api.translate(page, source, language), null, `${language}: ${source}`);
  }
});

test("legal wording is natural while operator data and links remain unchanged", () => {
  assert.equal(api.translate(page, "Impresszum", "en"), "Legal notice");
  assert.equal(api.translate(page, "Szolgáltató / üzemeltető adatai", "de"), "Angaben zum Diensteanbieter / Betreiber");
  assert.equal(api.translate(page, "Kovács Patrik", "en"), "Kovács Patrik");
  assert.equal(api.translate(page, "1181 Budapest, Havanna utca 73.", "de"), "1181 Budapest, Havanna utca 73.");
  assert.equal(api.translate(page, "Legal notice", "hu"), "Impresszum");
  const hrefs = [...main.matchAll(/href="([^"]+)"/gu)].map(match => match[1]);
  assert.deepEqual(hrefs, ["mailto:kalkulatorbazis@gmail.com", "https://kalkulatorbazis.hu/", "felhasznalasi-feltetelek", "jogi-nyilatkozat", "https://dash.cloudflare.com/?to=/:account/support", "https://www.cloudflare.com/", "mailto:kalkulatorbazis@gmail.com"]);
});

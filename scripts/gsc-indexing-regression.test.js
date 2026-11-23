const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { test } = require("node:test");
const { publicPathToSourceFile } = require("./url-paths");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const sitemap = new Set([...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));

test("legacy redirect export has unique sources, no chains and indexable canonical targets", () => {
  const csv = execFileSync(process.execPath, ["scripts/generate-cloudflare-bulk-redirects.js", "--stdout"], { cwd: root, encoding: "utf8" });
  const rows = csv.trim().split("\n").map((line) => line.split(","));
  const sources = new Set(rows.map(([source]) => source));
  assert.equal(sources.size, rows.length);
  for (const [source, target, status] of rows) {
    assert.equal(status, "301", source);
    const url = new URL(target);
    assert.ok(!sources.has(url.host + url.pathname), `Redirect chain from ${source}`);
    assert.ok(sitemap.has(url.origin + url.pathname), `Target outside sitemap: ${target}`);
    const html = read(publicPathToSourceFile(url.pathname));
    assert.ok(html.includes(`href="${url.origin + url.pathname}"`), `Missing canonical: ${target}`);
    assert.doesNotMatch(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i);
  }
});

test("GSC discovery candidates have contextual category links and sitemap entries", () => {
  const candidates = {
    "auto.html": ["kalkulatorok/fektav-kalkulator", "landing-pages/elethelyzetek/autofenntartas"],
    "penzugyi.html": ["dontesek", "landing-pages/elethelyzetek/lakasvasarlas"],
    "epitoipari.html": ["landing-pages/elethelyzetek/felujitas-tervezese"],
    "mindennapi.html": ["kalkulatorok/recept-adag-kalkulator"],
  };
  const dictionary = require("../js/locales/support-categories").dictionary;
  for (const [category, targets] of Object.entries(candidates)) {
    const html = read(category);
    const start = html.indexOf("<h2>Kapcsolódó témák</h2>");
    const section = html.slice(start, html.indexOf("<h2>", start + 4));
    for (const target of targets) {
      const link = [...section.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].find((match) => match[1] === target);
      assert.ok(link, `${category} missing contextual link to ${target}`);
      assert.equal(dictionary[link[2]]?.length, 2, `Missing EN/DE link label: ${link[2]}`);
      assert.ok(sitemap.has(`https://kalkulatorbazis.hu/${target}`));
      assert.ok(fs.existsSync(path.join(root, publicPathToSourceFile(target))));
    }
  }
});

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://kalkulatorbazis.hu";
const descriptions = {
  "adatvedelem.html":
    "A Kalkulátor Bázis adatkezelési tájékoztatója a kezelt adatokról, sütikről, külső szolgáltatókról és látogatói jogokról.",
  "cookie.html":
    "Tájékoztató a Kalkulátor Bázis működéséhez, méréséhez és hirdetéseihez kapcsolódó sütikről és választási lehetőségekről.",
  "felhasznalasi-feltetelek.html":
    "A Kalkulátor Bázis használati feltételei, a kalkulált eredmények korlátai, a felelősségi szabályok és a tartalom felhasználása."
};

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });

const relative = (file) => path.relative(root, file).replace(/\\/g, "/");
const files = walk(root).filter((file) => {
  const name = relative(file);
  return name.endsWith(".html") && !name.startsWith("components/") && !name.startsWith("docs/");
});

const text = (value) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
const attribute = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const first = (html, pattern) => html.match(pattern)?.[1]?.trim() || "";

const stats = { scanned: files.length, descriptions: [], canonicals: [], openGraph: [] };

files.forEach((file) => {
  const name = relative(file);
  let html = fs.readFileSync(file, "utf8");
  const title = text(first(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i));
  const h1 = text(first(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
  let description = first(
    html,
    /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i
  );

  if (!description) {
    description = descriptions[name] || `${h1 || title} – tájékoztató és használati információk a Kalkulátor Bázis oldalán.`;
    html = html.replace(
      /(<meta\b[^>]*\bname=["']viewport["'][^>]*>)/i,
      `$1\n  <meta name="description" content="${attribute(description)}" />`
    );
    stats.descriptions.push(name);
  }

  const canonicalUrl = name === "index.html" ? `${siteUrl}/` : `${siteUrl}/${name}`;
  if (!/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i.test(html)) {
    html = html.replace(
      /(<meta\b[^>]*\bname=["']description["'][^>]*>)/i,
      `$1\n  <link rel="canonical" href="${canonicalUrl}" />`
    );
    stats.canonicals.push(name);
  }

  const ogTags = [];
  if (!/<meta\b(?=[^>]*\bproperty=["']og:type["'])[^>]*>/i.test(html)) {
    ogTags.push('<meta property="og:type" content="website" />');
  }
  if (!/<meta\b(?=[^>]*\bproperty=["']og:site_name["'])[^>]*>/i.test(html)) {
    ogTags.push('<meta property="og:site_name" content="Kalkulátor Bázis" />');
  }
  if (!/<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i.test(html)) {
    ogTags.push(`<meta property="og:title" content="${attribute(title || h1)}" />`);
  }
  if (!/<meta\b(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i.test(html)) {
    ogTags.push(`<meta property="og:description" content="${attribute(description)}" />`);
  }
  if (!/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i.test(html)) {
    ogTags.push(`<meta property="og:url" content="${canonicalUrl}" />`);
  }
  if (!/<meta\b(?=[^>]*\bproperty=["']og:image["'])[^>]*>/i.test(html)) {
    ogTags.push(`<meta property="og:image" content="${siteUrl}/images/kalkulator-bazis-og.jpg" />`);
  }

  if (ogTags.length) {
    html = html.replace(/\s*<\/head>/i, `\n  ${ogTags.join("\n  ")}\n</head>`);
    stats.openGraph.push(name);
  }

  if (!/global-head\.js/i.test(html)) {
    const prefix = name.startsWith("landing-pages/") ? "../../" : name.startsWith("kalkulatorok/") ? "../" : "";
    html = html.replace(/\s*<\/head>/i, `\n  <script src="${prefix}js/global-head.js"></script>\n</head>`);
  }

  fs.writeFileSync(file, html, "utf8");
});

console.log(JSON.stringify(stats, null, 2));

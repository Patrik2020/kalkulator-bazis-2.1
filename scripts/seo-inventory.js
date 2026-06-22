const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://kalkulatorbazis.hu";
const docsDir = path.join(root, "docs");

const dataCode = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataCode, context);
const { categories, calculators } = context.window.KB_DATA;

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return [absolute];
  });

const relative = (file) => path.relative(root, file).replace(/\\/g, "/");
const htmlFiles = walk(root).filter((file) => {
  const name = relative(file);
  return name.endsWith(".html") && !name.startsWith("components/") && !name.startsWith("docs/");
});

const decode = (value) =>
  value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/&mdash;|&#8212;/gi, "—")
    .replace(/&nbsp;/gi, " ");

const strip = (value = "") =>
  decode(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const first = (value, pattern) => value.match(pattern)?.[1]?.trim() || "";
const normalize = (value) =>
  strip(value)
    .toLocaleLowerCase("hu-HU")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const canonicalFor = (name) => (name === "index.html" ? `${siteUrl}/` : `${siteUrl}/${name}`);

const records = htmlFiles.map((file) => {
  const name = relative(file);
  const html = fs.readFileSync(file, "utf8");
  const robots = first(
    html,
    /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i
  );
  const canonical = first(
    html,
    /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']*)["'])[^>]*>/i
  );
  const description = first(
    html,
    /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i
  );
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)].map(
    (match) => match[1]
  );

  return {
    file,
    name,
    html,
    title: strip(first(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)),
    description: strip(description),
    h1: strip(first(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)),
    lang: first(html, /<html\b[^>]*\blang=["']([^"']+)["']/i),
    robots,
    canonical,
    indexable: !/\bnoindex\b/i.test(robots),
    hrefs,
  };
});

const byName = new Map(records.map((record) => [record.name, record]));
const resolveLocal = (source, href) => {
  if (!href || /^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(href)) return null;
  const clean = href.split(/[?#]/)[0];
  if (!clean) return null;
  const absolute = clean.startsWith("/")
    ? path.join(root, clean.replace(/^\/+/, ""))
    : path.resolve(path.dirname(source.file), clean);
  if (path.extname(absolute) && path.extname(absolute) !== ".html") return null;
  const candidate = fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()
    ? path.join(absolute, "index.html")
    : absolute;
  return relative(candidate);
};

const componentLinks = ["components/header.html", "components/footer.html"].flatMap((name) => {
  const file = path.join(root, name);
  const html = fs.readFileSync(file, "utf8");
  return [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)].map((match) =>
    match[1].replace(/^\.\.\//, "")
  );
});

const inbound = new Map(records.map((record) => [record.name, new Set()]));
records.forEach((source) => {
  source.hrefs.forEach((href) => {
    const target = resolveLocal(source, href);
    if (inbound.has(target) && target !== source.name) inbound.get(target).add(source.name);
  });
});

componentLinks.forEach((href) => {
  const target = href.replace(/^\/+/, "");
  if (!inbound.has(target)) return;
  records.forEach((record) => inbound.get(target).add(`${record.name} (közös navigáció)`));
});

// A kategória- és keresőlisták kliensoldalon a site-data tartalmából épülnek fel.
calculators.forEach((calculator) => {
  const category = categories.find((item) => item.id === calculator.category);
  if (category && inbound.has(calculator.url)) inbound.get(calculator.url).add(category.url);
  if (inbound.has(calculator.url)) inbound.get(calculator.url).add("kalkulatorok.html");
  if (calculator.popular && inbound.has(calculator.url)) inbound.get(calculator.url).add("index.html");
  (calculator.related || []).forEach((relatedUrl) => {
    if (inbound.has(relatedUrl)) inbound.get(relatedUrl).add(calculator.url);
  });
});

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
const sitemapNames = new Set(
  sitemapUrls.map((url) => {
    const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
    return pathname || "index.html";
  })
);

const typeOf = (name) => {
  if (name === "index.html") return "Főoldal";
  if (name === "404.html") return "Hibaoldal";
  if (calculators.some((calculator) => calculator.url === name)) return "Kalkulátor";
  if (categories.some((category) => category.url === name)) return "Kategória";
  if (name.startsWith("landing-pages/") && /(?:adat|cookie|jogi|kapcsolat)/.test(name)) return "Landing jogi/tájékoztató";
  if (name.startsWith("landing-pages/")) return "Landing";
  if (["adatvedelem.html", "cookie.html", "felhasznalasi-feltetelek.html"].includes(name)) return "Jogi/tájékoztató";
  return "Gyűjtőoldal";
};

const primaryOverrides = {
  "kalkulatorok/auto-kalkulator.html": "autós út- és hatótáv kalkulátor",
  "kalkulatorok/auto-fogyasztas-kalkulator.html": "autó fogyasztás kalkulátor",
  "kalkulatorok/uzemanyag-koltseg-kalkulator.html": "üzemanyagköltség kalkulátor",
  "kalkulatorok/hitel-torleszto-kalkulator.html": "hitel törlesztő kalkulátor",
  "kalkulatorok/hitelkepesseg-kalkulator.html": "hitelképesség kalkulátor",
  "kalkulatorok/szamla-teljesites-kalkulator.html": "számla teljesítési dátum kalkulátor",
  "kalkulatorok/fizetesi-hatarido-kalkulator.html": "fizetési határidő kalkulátor",
  "kalkulatorok/deviza-atvalto-kalkulator.html": "deviza átváltó",
};

const primaryKeyword = (calculator) =>
  primaryOverrides[calculator.url] || calculator.title.toLocaleLowerCase("hu-HU");
const intentFor = (category) => ({
  penzugyi: "Pénzügyi számítás és döntés-előkészítés",
  epitoipari: "Anyagszükséglet és kivitelezési becslés",
  egeszseg: "Egészségi vagy életmódbeli tájékozódás",
  mindennapi: "Gyors hétköznapi számítás",
  auto: "Autózási költség, út vagy járműadat becslése",
  atvaltok: "Mértékegység-átváltás",
}[category] || "Kalkuláció");

const calculatorRows = calculators.map((calculator) => {
  const category = categories.find((item) => item.id === calculator.category);
  const related = (calculator.related || [])
    .map((url) => calculators.find((item) => item.url === url)?.title || url)
    .join("; ");
  const sources = [...(inbound.get(calculator.url) || [])].join("; ");
  return {
    url: calculator.url,
    primary: primaryKeyword(calculator),
    secondary: calculator.keywords,
    intent: intentFor(calculator.category),
    task: calculator.description,
    category: category?.url || "",
    related,
    inbound: sources,
  };
});

const quoteCsv = (value) => `"${String(value || "").replace(/"/g, '""')}"`;
const csv = [
  ["URL", "Elsődleges kulcsszó", "Másodlagos kifejezések", "Keresési szándék", "Oldal feladata", "Kategória", "Kapcsolódó kalkulátorok", "Belső linkforrások"],
  ...calculatorRows.map((row) => Object.values(row)),
]
  .map((row) => row.map(quoteCsv).join(","))
  .join("\n");

const titleGroups = new Map();
const descriptionGroups = new Map();
records.forEach((record) => {
  const titleKey = normalize(record.title);
  const descKey = normalize(record.description);
  if (titleKey) titleGroups.set(titleKey, [...(titleGroups.get(titleKey) || []), record.name]);
  if (descKey) descriptionGroups.set(descKey, [...(descriptionGroups.get(descKey) || []), record.name]);
});
const duplicateTitles = [...titleGroups.values()].filter((group) => group.length > 1);
const duplicateDescriptions = [...descriptionGroups.values()].filter((group) => group.length > 1);

const indexableNotInSitemap = records.filter((record) => record.indexable && !sitemapNames.has(record.name));
const sitemapMissingFile = [...sitemapNames].filter((name) => !byName.has(name));
const noInbound = records.filter(
  (record) => record.indexable && record.name !== "index.html" && (inbound.get(record.name)?.size || 0) === 0
);
const canonicalProblems = records.filter(
  (record) => record.indexable && record.canonical !== canonicalFor(record.name)
);
const primaryGroups = new Map();
calculatorRows.forEach((row) => {
  const key = normalize(row.primary);
  primaryGroups.set(key, [...(primaryGroups.get(key) || []), row.url]);
});
const duplicatePrimary = [...primaryGroups.entries()].filter(([, urls]) => urls.length > 1);

const report = [
  "# Kalkulátor Bázis – teljes SEO-oldalleltár",
  "",
  `Készült: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "## Összesítés",
  "",
  `- Nyilvános HTML-oldalak: **${records.length}**`,
  `- Indexelhető oldalak: **${records.filter((record) => record.indexable).length}**`,
  `- Kalkulátoroldalak: **${calculators.length}**`,
  `- Kategóriaoldalak: **${categories.length}**`,
  `- Sitemap URL-ek: **${sitemapUrls.length}**`,
  `- Indexelhető, sitemapből hiányzó oldalak: **${indexableNotInSitemap.length}**`,
  `- Sitemapben szereplő, hiányzó fájlok: **${sitemapMissingFile.length}**`,
  `- Statikusan árva oldalak: **${noInbound.length}**`,
  `- Hibás vagy eltérő canonical elemek: **${canonicalProblems.length}**`,
  `- Duplikált title-csoportok: **${duplicateTitles.length}**`,
  `- Duplikált meta description-csoportok: **${duplicateDescriptions.length}**`,
  `- Ütköző elsődleges kalkulátorkulcsszavak: **${duplicatePrimary.length}**`,
  "",
  "## Indexelési döntések",
  "",
  "- Indexelendő: főoldal, hat kategóriaoldal, összes kalkulátor, kalkulátor-gyűjtőoldal, tartalmi landing oldalak és a publikus jogi/tájékoztató oldalak.",
  "- Nem indexelendő: `404.html`; a hibaoldal szándékosan kimarad a sitemapből és `noindex` jelölést kap.",
  "- A fejlesztési fájlok, komponensrészletek, dokumentációk és audit-scriptek nem publikus HTML-oldalak, ezért nem kerülnek a sitemapbe.",
  "",
  "## Oldalak",
  "",
  "| Fájl | Típus | Index | Sitemap | Bejövő linkforrások | Canonical |",
  "|---|---|---:|---:|---:|---|",
  ...records
    .sort((a, b) => a.name.localeCompare(b.name, "hu"))
    .map((record) => `| \`${record.name}\` | ${typeOf(record.name)} | ${record.indexable ? "igen" : "nem"} | ${sitemapNames.has(record.name) ? "igen" : "nem"} | ${inbound.get(record.name)?.size || 0} | ${record.canonical || "hiányzik"} |`),
  "",
  "## Eltérések és kockázatok",
  "",
  indexableNotInSitemap.length
    ? `- Sitemapből hiányzó indexelhető oldalak: ${indexableNotInSitemap.map((record) => `\`${record.name}\``).join(", ")}`
    : "- Nincs sitemapből hiányzó indexelhető oldal.",
  sitemapMissingFile.length
    ? `- Nem létező sitemap-célok: ${sitemapMissingFile.map((name) => `\`${name}\``).join(", ")}`
    : "- Nincs nem létező sitemap-cél.",
  noInbound.length
    ? `- Árva oldalak: ${noInbound.map((record) => `\`${record.name}\``).join(", ")}`
    : "- Nincs statikusan árva indexelhető oldal.",
  canonicalProblems.length
    ? `- Canonical-eltérések: ${canonicalProblems.map((record) => `\`${record.name}\``).join(", ")}`
    : "- Minden indexelhető oldal canonical eleme a saját publikus HTTPS URL-jére mutat.",
  duplicateTitles.length
    ? `- Duplikált title: ${duplicateTitles.map((group) => group.map((name) => `\`${name}\``).join(" + ")).join("; ")}`
    : "- Nincs duplikált title.",
  duplicateDescriptions.length
    ? `- Duplikált meta description: ${duplicateDescriptions.map((group) => group.map((name) => `\`${name}\``).join(" + ")).join("; ")}`
    : "- Nincs duplikált meta description.",
  duplicatePrimary.length
    ? `- Ütköző elsődleges kulcsszavak: ${duplicatePrimary.map(([keyword, urls]) => `${keyword}: ${urls.join(", ")}`).join("; ")}`
    : "- A 72 kalkulátor mindegyike külön elsődleges keresési kifejezést céloz.",
  "",
  "## Kannibalizációs döntések",
  "",
  "- A kategóriaoldalak gyűjtőszándékot céloznak (például egészségügyi vagy pénzügyi kalkulátorok), a kalkulátoroldalak konkrét eszközszándékot.",
  "- A BMI, százalék, nettó–bruttó, üzemanyagköltség és autófogyasztás kifejezések elsődleges céloldala a konkrét kalkulátor, nem a kategóriaoldal.",
  "- Az általános autós gyűjtőoldalt és az összetett autós kalkulátort külön keresési céllal kell tartani: az előbbi kategória, az utóbbi út-, fogyasztás- és hatótáv-eszköz.",
  "- A számlateljesítés oldal URL-je, fő témája és keresési célja változatlan marad; csak pontosító, kockázatmentes metajavítás végezhető rajta.",
  "",
  "A részletes 72 soros kulcsszótérkép: `docs/kulcsszoterkep.csv`.",
  "",
];

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, "kulcsszoterkep.csv"), `${csv}\n`, "utf8");
fs.writeFileSync(path.join(docsDir, "seo-oldalleltar.md"), `${report.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      html: records.length,
      indexable: records.filter((record) => record.indexable).length,
      calculators: calculators.length,
      sitemap: sitemapUrls.length,
      indexableNotInSitemap: indexableNotInSitemap.length,
      sitemapMissingFile: sitemapMissingFile.length,
      noInbound: noInbound.length,
      canonicalProblems: canonicalProblems.length,
      duplicateTitles: duplicateTitles.length,
      duplicateDescriptions: duplicateDescriptions.length,
      duplicatePrimary: duplicatePrimary.length,
    },
    null,
    2
  )
);

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "docs", "adsense-quality-audit.md");
const siteUrl = "https://kalkulatorbazis.hu";
const adsenseSrc =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639795157074812";

const dataCode = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const siteUiCode = fs.readFileSync(path.join(root, "js", "site-ui.js"), "utf8");
const priorityUpgradeCode = fs.readFileSync(path.join(root, "js", "priority-upgrades.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(dataCode, context);
const { categories, calculators } = context.window.KB_DATA;
const priorityUpgradePages = new Set(
  [...priorityUpgradeCode.matchAll(/"([^"]+\.html)"\s*:/g)].map((match) => match[1])
);

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });

const relative = (file) => path.relative(root, file).replace(/\\/g, "/");
const htmlFiles = walk(root).filter((file) => {
  const name = relative(file);
  return name.endsWith(".html") && !name.startsWith("components/") && !name.startsWith("docs/");
});

const decode = (value) =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/&mdash;|&#8212;/gi, "—");

const stripHtml = (value = "") =>
  decode(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

const first = (value, pattern) => value.match(pattern)?.[1]?.trim() || "";
const count = (value, pattern) => [...value.matchAll(pattern)].length;
const canonicalFor = (name) => (name === "index.html" ? `${siteUrl}/` : `${siteUrl}/${name}`);

const classify = (name) => {
  if (name === "404.html") return "hibaoldal";
  if (calculators.some((calculator) => calculator.url === name)) return "kalkulátor";
  if (categories.some((category) => category.url === name)) return "kategória";
  if (name.startsWith("landing-pages/")) return "landing";
  if (
    [
      "adatvedelem.html",
      "cookie.html",
      "felhasznalasi-feltetelek.html",
      "jogi-nyilatkozat.html",
      "kapcsolat.html",
    ].includes(name)
  ) {
    return "tájékoztató";
  }
  return "tartalmi oldal";
};

const thresholds = {
  kalkulátor: 500,
  kategória: 700,
  landing: 700,
  "tartalmi oldal": 450,
  tájékoztató: 250,
  hibaoldal: 80,
};

const addCheck = (checks, label, passed, points, recommendation) => {
  checks.push({ label, passed, points: passed ? points : 0, max: points, recommendation });
};

const scoreRecord = (file) => {
  const name = relative(file);
  const html = fs.readFileSync(file, "utf8");
  const head = first(html, /<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const body = first(html, /<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const text = stripHtml(body);
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const pageType = classify(name);
  const checks = [];
  const title = stripHtml(first(head, /<title\b[^>]*>([\s\S]*?)<\/title>/i));
  const description = first(
    head,
    /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i
  );
  const canonical = first(
    head,
    /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']*)["'])[^>]*>/i
  );
  const isNoindex = /\bnoindex\b/i.test(
    first(head, /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']([^"']*)["'])[^>]*>/i)
  );
  const isRedirect = /<meta\b(?=[^>]*http-equiv=["']refresh["'])/i.test(head);
  const jsonLdCount = count(head, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi);
  const hasSiteUi = /(?:js\/site-ui\.js|js\/utils\.js)/i.test(html);
  const hasDynamicStructuredData =
    hasSiteUi &&
    /setStructuredData/.test(siteUiCode) &&
    (pageType === "kalkulátor" || pageType === "kategória" || name === "index.html");
  const hasDynamicCalculatorTrust =
    pageType === "kalkulátor" && hasSiteUi && /reliability-meta/.test(siteUiCode);
  const basename = name.split("/").pop();
  const hasDynamicPriorityUpgrade =
    pageType === "kalkulátor" && hasSiteUi && priorityUpgradePages.has(basename);
  const h1Count = count(body, /<h1\b[^>]*>/gi);
  const internalLinks = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((href) => href && !/^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(href));
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const missingAlts = imageTags.filter((tag) => !/\balt\s*=/i.test(tag)).length;
  const missingDimensions = imageTags.filter(
    (tag) => !/\bwidth\s*=/i.test(tag) || !/\bheight\s*=/i.test(tag)
  ).length;
  const sponsoredLinks = count(html, /\brel=["'][^"']*\bsponsored\b[^"']*["']/gi);
  const genericPatterns = [
    /Ez a kalkulátor segít/i,
    /Egyszerűen kiszámolhat/i,
    /Használd ingyen/i,
    /Gyors és egyszerű/i,
  ];

  const methodSignals = /módszertan|hogyan számol|hogyan működik|képlet|számítás menete|kerekítés|korlát/i.test(text);
  const sourceSignals =
    /forrás|NAV|MNB|KSH|WHO|NIH|Mayo|ISO|IEC|EPA|ACEA|Knauf|Rigips|Baumit|Leier|Wienerberger/i.test(text);
  const authorSignals = /Készítette|Kovács Patrik|Üzemeltető|fejlesztő/i.test(text);
  const reviewedSignals = /Utolsó|frissítés|ellenőrzés|<time\b/i.test(html);
  const faqSignals = /faq-list|FAQPage|<details\b/i.test(html);
  const exampleSignals = /példaszámítás|példa|például/i.test(text);
  const relatedSignals = /Kapcsolódó|category-grid|calculator-card/i.test(html);
  const errorSignals = /gyakori hiba|hibák|mire figyelj/i.test(text);
  const reportSignals = /hibabejelentés|kalkulatorbazis@gmail\.com/i.test(text);
  const trustSignals = /adatvédelem|felhasználási feltételek|jogi nyilatkozat|átláthatóság/i.test(text);
  const effectiveAuthorSignals = authorSignals || hasDynamicCalculatorTrust;
  const effectiveReviewedSignals = reviewedSignals || hasDynamicCalculatorTrust;
  const effectiveReportSignals = reportSignals || hasDynamicCalculatorTrust;
  const effectiveTrustSignals = trustSignals || hasDynamicCalculatorTrust;
  const effectiveWordCount = wordCount + (hasDynamicPriorityUpgrade ? 220 : 0);
  const effectiveMethodSignals = methodSignals || hasDynamicPriorityUpgrade;
  const effectiveSourceSignals = sourceSignals || hasDynamicPriorityUpgrade;
  const effectiveErrorSignals = errorSignals || hasDynamicPriorityUpgrade;

  addCheck(checks, "Egyedi title és meta description", Boolean(title && description), 10, "Adj egyedi címet és leírást.");
  addCheck(
    checks,
    "Canonical URL rendben",
    isRedirect || canonical === canonicalFor(name),
    8,
    `Állítsd a canonicalt erre: ${canonicalFor(name)}.`
  );
  addCheck(checks, "Pontosan egy H1", h1Count === 1 || pageType === "hibaoldal", 7, "Maradjon egyetlen H1.");
  addCheck(checks, "Strukturált adat jelen van", jsonLdCount > 0 || hasDynamicStructuredData || pageType === "hibaoldal", 7, "Adj WebPage, CollectionPage, FAQPage vagy Breadcrumb JSON-LD blokkot.");
  addCheck(checks, "Indexelési döntés tiszta", pageType === "hibaoldal" ? isNoindex : !isNoindex, 6, "Csak a 404 legyen noindex.");

  addCheck(
    checks,
    "Értékalapú tartalmi mélység",
    effectiveWordCount >= thresholds[pageType],
    10,
    `A jelenlegi szószám kb. ${effectiveWordCount}; a ${pageType} oldalaknál legalább ${thresholds[pageType]} szónyi saját érték ajánlott.`
  );
  addCheck(
    checks,
    "Módszertan vagy működési magyarázat",
    pageType !== "kalkulátor" || effectiveMethodSignals,
    9,
    "Kalkulátoroldalon jelenjen meg képlet, kerekítés, feltételezés vagy korlát."
  );
  addCheck(
    checks,
    "Forrás vagy ellenőrizhető hivatkozási alap",
    !["kalkulátor", "kategória", "landing"].includes(pageType) || effectiveSourceSignals,
    8,
    "Adj témaspecifikus elsődleges vagy megbízható forrást."
  );
  addCheck(
    checks,
    "Példa vagy gyakorlati értelmezés",
    pageType !== "kalkulátor" || exampleSignals,
    6,
    "Adj legalább egy valós példát vagy eredményértelmezést."
  );
  addCheck(
    checks,
    "GYIK vagy kérdés-válasz tartalom",
    !["kalkulátor", "kategória", "landing"].includes(pageType) || faqSignals,
    6,
    "Adj oldalspecifikus GYIK-et."
  );
  addCheck(
    checks,
    "Gyakori hibák vagy korlátok",
    pageType !== "kalkulátor" || effectiveErrorSignals || /korlát/i.test(text),
    5,
    "Mutasd be, hol tévedhet félre a felhasználó."
  );

  addCheck(checks, "Szerzői vagy üzemeltetői jelzés", effectiveAuthorSignals, 7, "Legyen szerző, üzemeltető vagy projektfelelős jelzés.");
  addCheck(checks, "Valós frissítési/ellenőrzési jel", effectiveReviewedSignals, 6, "Adj látható, valós frissítési vagy ellenőrzési dátumot.");
  addCheck(checks, "Kapcsolat és hibabejelentés", effectiveReportSignals, 6, "Legyen elérhető hibabejelentési útvonal.");
  addCheck(checks, "Bizalmi/jogi oldalak elérhetők", effectiveTrustSignals, 5, "Linkeld az adatvédelmi, jogi és átláthatósági oldalakat.");

  addCheck(
    checks,
    "Kapcsolódó belső útvonalak",
    internalLinks.length >= (pageType === "kalkulátor" ? 5 : 3) && (pageType !== "kalkulátor" || relatedSignals),
    6,
    "Adj releváns kapcsolódó kalkulátorokat és kategórialinkeket."
  );
  addCheck(checks, "Nincs közvetlen AdSense head-betöltés", !html.includes(adsenseSrc), 5, "Az AdSense csak hozzájárulás után töltődjön.");
  addCheck(
    checks,
    "Affiliate arány nem domináns",
    sponsoredLinks === 0 || wordCount >= sponsoredLinks * 180,
    4,
    "A partnerlink ne uralja a saját tartalmat."
  );
  addCheck(
    checks,
    "Képek alt és méret attribútumai",
    missingAlts === 0 && missingDimensions === 0,
    4,
    "Adj alt, width és height attribútumot minden tartalmi képhez."
  );
  addCheck(
    checks,
    "Nincs sablonos AI/SEO fordulat",
    genericPatterns.every((pattern) => !pattern.test(text)),
    3,
    "Írd át az ismétlődő, általános kalkulátorszövegeket."
  );

  const maxScore = checks.reduce((sum, check) => sum + check.max, 0);
  const score = Math.round((checks.reduce((sum, check) => sum + check.points, 0) / maxScore) * 100);

  return {
    name,
    type: pageType,
    wordCount: effectiveWordCount,
    score,
    failed: checks.filter((check) => !check.passed),
  };
};

const records = htmlFiles.map(scoreRecord).sort((a, b) => a.name.localeCompare(b.name, "hu"));
const average = Math.round(records.reduce((sum, record) => sum + record.score, 0) / records.length);
const weak = records.filter((record) => record.score < 80);
const excellent = records.filter((record) => record.score >= 90);

const lines = [
  "# Kalkulátor Bázis – AdSense és EEAT minőségi audit",
  "",
  `Készült: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "## Módszer",
  "",
  "- Ez statikus, értékalapú audit: nem garantál AdSense-elfogadást és nem helyettesíti a böngészős, mobilos, PageSpeed vagy Search Console ellenőrzést.",
  "- A közös `site-ui.js` által renderelt kalkulátoroldali hitelességi blokkot és dinamikus strukturált adatot külön figyelembe veszi, mert ezek a betöltött oldalon ténylegesen megjelennek.",
  "- A `priority-upgrades.js` által betöltött szakmai kalkulátorbővítéseket is figyelembe veszi forrás-, módszertani és korlátjelként, mert ezek nem opcionális hirdetési elemek, hanem a felhasználónak megjelenő tartalmi modulok.",
  "- A pontszám a dokumentált minőségi jeleket méri: metaadatok, canonical, H1, strukturált adat, saját tartalmi mélység, módszertan, forrás, GYIK, szerzői/bizalmi jel, belső linkek, hirdetési és affiliate arány.",
  "- A szószám csak egy jel. Rövid, de pontos tájékoztató oldal nem kap ugyanazt az elvárást, mint egy kalkulátor vagy kategóriaoldal.",
  "",
  "## Összesítés",
  "",
  `- Vizsgált HTML-oldalak: **${records.length}**`,
  `- Webhely átlagpontszám: **${average}/100**`,
  `- 90+ pontos oldalak: **${excellent.length}**`,
  `- 80 pont alatti oldalak: **${weak.length}**`,
  "",
  "## Oldalpontszámok",
  "",
  "| Fájl | Típus | Szó | Pontszám | Fő hiányok |",
  "|---|---|---:|---:|---|",
  ...records.map((record) => {
    const issues = record.failed
      .slice(0, 4)
      .map((issue) => issue.label)
      .join("; ");
    return `| \`${record.name}\` | ${record.type} | ${record.wordCount} | ${record.score} | ${issues || "nincs kritikus statikus hiány"} |`;
  }),
  "",
  "## 80 pont alatti oldalak részletei",
  "",
];

if (!weak.length) {
  lines.push("- Nincs 80 pont alatti oldal a statikus audit szerint.", "");
} else {
  weak.forEach((record) => {
    lines.push(`### \`${record.name}\` – ${record.score}/100`);
    record.failed.slice(0, 10).forEach((issue) => {
      lines.push(`- **${issue.label}:** ${issue.recommendation}`);
    });
    lines.push("");
  });
}

if (process.argv.includes("--write")) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`AdSense quality audit written: ${relative(reportPath)}`);
} else {
  console.log(lines.join("\n"));
}

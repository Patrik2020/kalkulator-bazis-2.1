const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { categories, groupByCalculator } = require("./category-taxonomy-config");
const expansionCalculators = [
  ...require("../js/expansion-batch-01-data.js"),
  ...require("../js/expansion-batch-02-data.js"),
  ...require("../js/expansion-batch-03-data.js"),
  ...require("../js/expansion-batch-04-data.js"),
  ...require("../js/expansion-batch-05-data.js"),
];

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "js", "site-data.js");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function readAttribute(openTag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = openTag.match(new RegExp(`\\b${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? match[2] : null;
}

function hasClass(openTag, token) {
  const value = readAttribute(openTag, "class");
  return value ? value.split(/\s+/).includes(token) : false;
}

function findElement(html, matcher) {
  const openRe = /<([a-z][a-z0-9:-]*)\b[^>]*>/gi;
  let match;

  while ((match = openRe.exec(html))) {
    const tag = match[1].toLowerCase();
    const openTag = match[0];
    const id = readAttribute(openTag, "id");
    const attrValue = matcher.attr ? readAttribute(openTag, matcher.attr) : null;

    if (matcher.tag && tag !== matcher.tag.toLowerCase()) continue;
    if (matcher.id && id !== matcher.id) continue;
    if (matcher.className && !hasClass(openTag, matcher.className)) continue;
    if (matcher.attr && attrValue === null) continue;
    if (matcher.attr && matcher.value !== undefined && attrValue !== matcher.value) continue;

    const start = match.index;
    const openEnd = openRe.lastIndex;
    if (["meta", "link", "img", "input", "br", "hr", "source"].includes(tag)) {
      return { start, end: openEnd, html: html.slice(start, openEnd) };
    }

    const tokenRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    tokenRe.lastIndex = start;
    let depth = 0;
    let token;

    while ((token = tokenRe.exec(html))) {
      const text = token[0];
      if (/^<\//.test(text)) depth -= 1;
      else if (!/\/>\s*$/.test(text)) depth += 1;

      if (depth === 0) {
        return { start, end: tokenRe.lastIndex, html: html.slice(start, tokenRe.lastIndex) };
      }
    }
  }

  return null;
}

function replaceElement(source, matcher, replacement) {
  const found = findElement(source, matcher);
  if (!found) return source;
  return source.slice(0, found.start) + replacement + source.slice(found.end);
}

function categoriesSource() {
  const lines = JSON.stringify(categories, null, 2)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n")
    .trimStart();
  return `const categories = ${lines};`;
}

function updateSiteData() {
  let source = fs.readFileSync(dataPath, "utf8");
  const categoryPattern = /const categories = \[[\s\S]*?\n  \];\n\n  const calculators = \[/;

  if (!categoryPattern.test(source)) {
    throw new Error("A site-data.js kategória blokkja nem található.");
  }

  source = source.replace(
    categoryPattern,
    `${categoriesSource()}\n\n  const calculators = [`
  );

  for (const [url, group] of Object.entries(groupByCalculator)) {
    const needle = `url: "${url}"`;
    const urlIndex = source.indexOf(needle);
    if (urlIndex === -1) throw new Error(`Hiányzó kalkulátor a site-data.js-ben: ${url}`);

    const start = source.lastIndexOf("\n    {", urlIndex);
    const close = source.indexOf("\n    },", urlIndex);
    if (start === -1 || close === -1) throw new Error(`Nem olvasható kalkulátor objektum: ${url}`);

    const end = close + "\n    },".length;
    let block = source.slice(start, end);
    const groupLine = `      group: "${group}",`;

    if (/\n\s+group:\s*"[^"]+",/.test(block)) {
      block = block.replace(/\n\s+group:\s*"[^"]+",/, `\n${groupLine}`);
    } else if (/\n\s+category:\s*"[^"]+",/.test(block)) {
      block = block.replace(/(\n\s+category:\s*"[^"]+",)/, `$1\n${groupLine}`);
    } else {
      throw new Error(`Hiányzó category mező: ${url}`);
    }

    source = source.slice(0, start) + block + source.slice(end);
  }

  fs.writeFileSync(dataPath, source, "utf8");
  return source;
}

function loadData(source) {
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: "site-data.js" });
  return sandbox.window.KB_DATA;
}

function mergeExpansionData(data) {
  const known = new Set(data.calculators.map((calculator) => calculator.url));
  for (const calculator of expansionCalculators) {
    if (!known.has(calculator.url)) {
      data.calculators.push({ ...calculator });
      known.add(calculator.url);
    }
  }
  return data;
}

function updateMeta(html, category) {
  const replacements = [
    [/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(category.metaTitle)}</title>`],
    [/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapeHtml(category.metaDescription)}" />`],
    [/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:title" content="${escapeHtml(category.metaTitle)}" />`],
    [/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:description" content="${escapeHtml(category.metaDescription)}" />`],
    [/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:title" content="${escapeHtml(category.metaTitle)}" />`],
    [/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:description" content="${escapeHtml(category.metaDescription)}" />`],
  ];

  for (const [pattern, replacement] of replacements) html = html.replace(pattern, replacement);
  return html;
}

function ensureTaxonomyStylesheet(html) {
  if (/category-taxonomy\.css/i.test(html)) return html;
  return html.replace(
    /<\/head>/i,
    `  <link rel="stylesheet" href="css/components/category-taxonomy.css?v=20260821-1" />\n</head>`
  );
}

function categoryCard(calculator, category) {
  return `        <a class="card card-link calculator-card ${escapeHtml(category.cardClass)}" href="${escapeHtml(calculator.url)}">\n          <h3>${escapeHtml(calculator.title)}</h3>\n          <p>${escapeHtml(calculator.description)}</p>\n        </a>`;
}

function renderCalculatorCatalog(data) {
  const catalogOrder = ["penzugyi", "epitoipari", "egeszseg", "mindennapi", "auto", "atvaltok"];

  const sections = catalogOrder.map((categoryId) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) throw new Error(`Ismeretlen katalóguskategória: ${categoryId}`);

    const calculators = data.calculators.filter((calculator) => calculator.category === categoryId);
    return `    <section class="section-block" aria-labelledby="catalog-${escapeHtml(categoryId)}">\n      <h2 class="section-heading" id="catalog-${escapeHtml(categoryId)}">${escapeHtml(category.title)}</h2>\n      <div class="category-grid">\n${calculators.map((calculator) => categoryCard(calculator, category)).join("\n\n")}\n      </div>\n    </section>`;
  });

  return `<div data-render="calculator-catalog">\n${sections.join("\n\n")}\n  </div>`;
}

function renderGroupedCalculators(category, calculators) {
  const blocks = category.groups.map((group) => {
    const items = calculators.filter(
      (calculator) => calculator.category === category.id && calculator.group === group.id
    );

    if (!items.length) return "";

    return `  <section class="kb-category-group" aria-labelledby="group-${escapeHtml(category.id)}-${escapeHtml(group.id)}">\n    <div class="kb-category-group__header">\n      <div>\n        <h2 id="group-${escapeHtml(category.id)}-${escapeHtml(group.id)}">${escapeHtml(group.title)}</h2>\n        <p>${escapeHtml(group.description)}</p>\n      </div>\n      <span class="kb-category-group__count">${items.length} kalkulátor</span>\n    </div>\n    <div class="category-grid">\n${items.map((calculator) => categoryCard(calculator, category)).join("\n\n")}\n    </div>\n  </section>`;
  }).filter(Boolean);

  return `<div class="kb-category-groups" data-render="category-calculators">\n${blocks.join("\n\n")}\n</div>`;
}

function updateCategoryPage(category, data) {
  const filePath = path.join(root, category.url);
  if (!fs.existsSync(filePath)) throw new Error(`Hiányzó kategóriaoldal: ${category.url}`);

  let html = fs.readFileSync(filePath, "utf8");
  html = updateMeta(html, category);
  html = ensureTaxonomyStylesheet(html);

  const intro = `<section class="page-hero" data-render="category-intro">\n      <h1>${escapeHtml(category.title)}</h1>\n      <p>${escapeHtml(category.description)}</p>\n    </section>`;
  html = replaceElement(html, { attr: "data-render", value: "category-intro" }, intro);

  const breadcrumb = `<nav class="breadcrumb" aria-label="Morzsamenü">\n      <ol><li><a href="index.html">Főoldal</a></li><li><span aria-current="page">${escapeHtml(category.shortTitle)}</span></li></ol>\n    </nav>`;
  html = replaceElement(html, { className: "breadcrumb" }, breadcrumb);

  html = replaceElement(
    html,
    { attr: "data-render", value: "category-calculators" },
    renderGroupedCalculators(category, data.calculators)
  );

  fs.writeFileSync(filePath, html, "utf8");
}

function updateHomePage(data) {
  const filePath = path.join(root, "index.html");
  let html = fs.readFileSync(filePath, "utf8");

  const cards = categories.map((category) => `          <a href="${escapeHtml(category.url)}" class="card card-link ${escapeHtml(category.cardClass)}">\n            <h3>${escapeHtml(category.title)}</h3>\n            <p>${escapeHtml(category.description)}</p>\n          </a>`).join("\n\n");
  const grid = `<div class="category-grid home-category-grid" data-render="home-categories">\n${cards}\n        </div>`;
  html = replaceElement(html, { attr: "data-render", value: "home-categories" }, grid);

  html = html.replace(
    /<p class="home-hero-lead">[\s\S]*?<\/p>/i,
    `<p class="home-hero-lead">Több mint ${Math.floor(data.calculators.length / 10) * 10} magyar nyelvű kalkulátor mindennapi, pénzügyi, otthoni, autós, egészség- és mértékegység-számításokhoz, érthető magyarázatokkal.</p>`
  );

  fs.writeFileSync(filePath, html, "utf8");
}

function updateCatalogPage(data) {
  const filePath = path.join(root, "kalkulatorok.html");
  let html = fs.readFileSync(filePath, "utf8");
  const catalog = findElement(html, { attr: "data-render", value: "calculator-catalog" });
  if (!catalog) throw new Error("A kalkulatorok.html statikus katalógushelyőrzője nem található.");

  html = replaceElement(
    html,
    { attr: "data-render", value: "calculator-catalog" },
    renderCalculatorCatalog(data)
  );
  fs.writeFileSync(filePath, html, "utf8");
}

const updatedSource = updateSiteData();
const data = mergeExpansionData(loadData(updatedSource));

for (const category of categories) updateCategoryPage(category, data);
updateHomePage(data);
updateCatalogPage(data);

console.log(`Kategória-taxonomia alkalmazva: ${categories.length} fő kategória, ${data.calculators.length} katalogizált kalkulátor.`);

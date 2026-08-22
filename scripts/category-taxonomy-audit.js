const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { categories, groupByCalculator } = require("./category-taxonomy-config");
const { publicPathToSourceFile } = require("./url-paths");
const expansionCalculators = [
  ...require("../js/expansion-batch-01-data.js"),
  ...require("../js/expansion-batch-02-data.js"),
  ...require("../js/expansion-batch-03-data.js"),
  ...require("../js/expansion-batch-04-data.js"),
  ...require("../js/expansion-batch-05-data.js"),
];

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "site-data.js" });
const data = sandbox.window.KB_DATA;
const errors = [];

function readAttribute(openTag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return openTag.match(new RegExp(`\\b${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] || null;
}

function calculatorCardUrls(file) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const urls = [];

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const className = readAttribute(match[0], "class") || "";
    if (!className.split(/\s+/).includes("calculator-card")) continue;
    const href = readAttribute(match[0], "href");
    if (!href) continue;
    const normalized = publicPathToSourceFile(new URL(href, "https://kalkulatorbazis.hu/").pathname);
    if (normalized.startsWith("kalkulatorok/") && normalized.endsWith(".html")) urls.push(normalized);
  }

  return urls;
}

function checkExactListing(file, expectedUrls, label) {
  const listed = calculatorCardUrls(file);
  const counts = new Map();
  listed.forEach((url) => counts.set(url, (counts.get(url) || 0) + 1));
  const actual = new Set(listed);

  const missing = [...expectedUrls].filter((url) => !actual.has(url));
  const extra = [...actual].filter((url) => !expectedUrls.has(url));
  const duplicates = [...counts].filter(([, count]) => count !== 1).map(([url, count]) => `${url} (${count}×)`);

  if (missing.length) errors.push(`${label}: hiányzó kalkulátorkártyák: ${missing.join(", ")}`);
  if (extra.length) errors.push(`${label}: nem katalogizált kalkulátorkártyák: ${extra.join(", ")}`);
  if (duplicates.length) errors.push(`${label}: duplikált kalkulátorkártyák: ${duplicates.join(", ")}`);
  if (listed.length !== expectedUrls.size) {
    errors.push(`${label}: ${listed.length} kártya található, az elvárt darabszám ${expectedUrls.size}.`);
  }
}

if (!data || !Array.isArray(data.calculators)) {
  errors.push("A site-data.js nem adott vissza kalkulátorlistát.");
}

const calculators = [...(data?.calculators || []), ...expansionCalculators];
const categoryIds = new Set();
const validGroups = new Map();
for (const category of categories) {
  if (categoryIds.has(category.id)) errors.push(`Duplikált kategóriaazonosító: ${category.id}`);
  categoryIds.add(category.id);

  const groupIds = new Set();
  for (const group of category.groups || []) {
    if (groupIds.has(group.id)) errors.push(`Duplikált csoport: ${category.id}/${group.id}`);
    groupIds.add(group.id);
  }
  validGroups.set(category.id, groupIds);

  if (!fs.existsSync(path.join(root, category.url))) {
    errors.push(`Hiányzó kategóriaoldal: ${category.url}`);
  }
}

const urls = new Set();
for (const calculator of calculators) {
  if (urls.has(calculator.url)) errors.push(`Duplikált kalkulátor URL: ${calculator.url}`);
  urls.add(calculator.url);

  if (!fs.existsSync(path.join(root, calculator.url))) {
    errors.push(`Hiányzó kalkulátor HTML: ${calculator.url}`);
  }

  const group = groupByCalculator[calculator.url] || calculator.group;
  if (!group) {
    errors.push(`Nincs taxonómiai csoport: ${calculator.url}`);
    continue;
  }

  if (!categoryIds.has(calculator.category)) {
    errors.push(`Ismeretlen fő kategória (${calculator.category}): ${calculator.url}`);
    continue;
  }

  if (!validGroups.get(calculator.category)?.has(group)) {
    errors.push(`Érvénytelen csoport (${calculator.category}/${group}): ${calculator.url}`);
  }

  if (calculator.group && calculator.group !== group) {
    errors.push(`Eltérő materializált csoport (${calculator.group} != ${group}): ${calculator.url}`);
  }
}

for (const url of Object.keys(groupByCalculator)) {
  if (!urls.has(url)) errors.push(`A taxonómia nem létező kalkulátorra hivatkozik: ${url}`);
}

checkExactListing("kalkulatorok.html", urls, "Összes kalkulátor oldal");
for (const category of categories) {
  const expected = new Set(calculators
    .filter((calculator) => calculator.category === category.id)
    .map((calculator) => calculator.url));
  checkExactListing(category.url, expected, `${category.shortTitle} kategóriaoldal`);
}

if (errors.length) {
  console.error("Kategória-taxonomia audit hibák:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const groupCount = categories.reduce((sum, category) => sum + category.groups.length, 0);
console.log(`Kategória-taxonomia audit OK: ${categories.length} fő kategória, ${groupCount} témacsoport, ${calculators.length} katalogizált kalkulátor, minden URL ellenőrizve.`);

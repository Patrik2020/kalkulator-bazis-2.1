const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { categories, groupByCalculator } = require("./category-taxonomy-config");
const expansionCalculators = require("../js/expansion-batch-01-data.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: "site-data.js" });
const data = sandbox.window.KB_DATA;
const errors = [];

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

if (errors.length) {
  console.error("Kategória-taxonomia audit hibák:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const groupCount = categories.reduce((sum, category) => sum + category.groups.length, 0);
console.log(`Kategória-taxonomia audit OK: ${categories.length} fő kategória, ${groupCount} témacsoport, ${calculators.length} katalogizált kalkulátor, minden URL ellenőrizve.`);

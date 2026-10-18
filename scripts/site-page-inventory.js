"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const defaultRoot = path.resolve(__dirname, "..");
const stableCategoryOrder = [
  "penzugyi",
  "mindennapi",
  "egeszseg",
  "auto",
  "epitoipari",
  "atvaltok",
];

const fixedRoutes = [
  "",
  "kalkulatorok.html",
  "kalkulatorok/multifunkcios-szamologep.html",
  "dontesek.html",
  "osszehasonlitas.html",
  "rolunk.html",
  "szamitasi-modszertan.html",
  "kapcsolat.html",
  "adatvedelem.html",
  "cookie.html",
  "felhasznalasi-feltetelek.html",
  "jogi-nyilatkozat.html",
  "atlathatosag-es-minoseg.html",
  "miert-bizhatsz-bennunk.html",
  "impresszum.html",
  "elethelyzetek.html",
  "aktualis.html",
  "landing-pages/elethelyzetek/lakasvasarlas.html",
  "landing-pages/elethelyzetek/autofenntartas.html",
  "landing-pages/elethelyzetek/fizetes-munkaber.html",
  "landing-pages/elethelyzetek/befektetes-kezdoknek.html",
  "landing-pages/elethelyzetek/felujitas-tervezese.html",
  "landing-pages/elethelyzetek/csaladi-koltsegvetes.html",
  "landing-pages/wise/wise.html",
  "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
];

function loadSiteData(root) {
  const source = fs.readFileSync(path.join(root, "js", "site-data.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "site-data.js" });
  return context.window.KB_DATA;
}

function loadExpansionCalculators(root) {
  const calculators = [];
  for (let batch = 1; batch <= 5; batch += 1) {
    const file = path.join(root, "js", `expansion-batch-0${batch}-data.js`);
    delete require.cache[require.resolve(file)];
    calculators.push(...require(file));
  }
  return calculators;
}

function currentArticleRoutes(root) {
  const directory = path.join(root, "aktualis");
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => `aktualis/${entry.name}`)
    .sort((left, right) => left.localeCompare(right, "hu"));
}

function sitePageRoutes(root = defaultRoot) {
  const { categories, calculators } = loadSiteData(root);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const categoryRoutes = [
    ...stableCategoryOrder.map((id) => categoryById.get(id)?.url).filter(Boolean),
    ...categories
      .filter((category) => !stableCategoryOrder.includes(category.id))
      .map((category) => category.url)
      .sort((left, right) => left.localeCompare(right, "hu")),
  ];
  const calculatorRoutes = [...calculators, ...loadExpansionCalculators(root)]
    .filter((calculator) => calculator.hidden !== true)
    .map((calculator) => calculator.url);

  return [
    ...new Set([
      fixedRoutes[0],
      ...categoryRoutes,
      ...fixedRoutes.slice(1, 17),
      ...currentArticleRoutes(root),
      ...fixedRoutes.slice(17),
      ...calculatorRoutes,
    ]),
  ];
}

function materializationPages(root = defaultRoot) {
  const pages = sitePageRoutes(root)
    .map((route) => route || "index.html")
    .filter((route) => fs.existsSync(path.join(root, route)));
  const notFound = "404.html";
  if (fs.existsSync(path.join(root, notFound)) && !pages.includes(notFound)) pages.push(notFound);
  return pages;
}

module.exports = { materializationPages, sitePageRoutes };

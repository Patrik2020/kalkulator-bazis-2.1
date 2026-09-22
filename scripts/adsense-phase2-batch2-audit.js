const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const hub = "kalkulatorok/atlag-kalkulator.html";
const hubCanonical = "https://kalkulatorbazis.hu/kalkulatorok/atlag-kalkulator";
const retired = [
  "kalkulatorok/sulyozott-atlag-kalkulator.html",
  "kalkulatorok/mertani-atlag-kalkulator.html",
];
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const hubHtml = read(hub);
if (!hubHtml.includes('data-average-hub="true"')) failures.push("az Átlag kalkulátor központ jelölése hiányzik");
if (!hubHtml.includes('value="simple"') || !hubHtml.includes('value="weighted"') || !hubHtml.includes('value="geometric"')) {
  failures.push("az Átlag kalkulátor nem tartalmazza mindhárom számítási módot");
}
if (!hubHtml.includes("../js/atlag-kozpont.js")) failures.push("az Átlag kalkulátor saját számolómotorja nincs bekötve");
if (!hubHtml.includes("Számtani átlag") || !hubHtml.includes("Súlyozott átlag") || !hubHtml.includes("Mértani átlag")) {
  failures.push("az Átlag kalkulátor tartalmi magyarázata nem fedi le mindhárom átlagtípust");
}

const dataSource = read("js/site-data.js");
const sandbox = { window: {} };
vm.runInNewContext(dataSource, sandbox, { filename: "site-data.js" });
const calculators = [...sandbox.window.KB_DATA.calculators];
for (let batch = 1; batch <= 5; batch += 1) calculators.push(...require(`../js/expansion-batch-0${batch}-data.js`));
const byUrl = new Map(calculators.map((calculator) => [calculator.url, calculator]));

if (byUrl.get(hub)?.hidden === true) failures.push("az Átlag kalkulátor központ nem lehet hidden");
for (const page of retired) {
  if (byUrl.get(page)?.hidden !== true) failures.push(`${page}: nincs hidden=true a registryben`);
  const html = read(page);
  if (!/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) && !/content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html)) {
    failures.push(`${page}: hiányzik a noindex`);
  }
  const canonical = html.match(/<link\b(?=[^>]*rel=["']canonical["'])(?=[^>]*href=["']([^"']+)["'])[^>]*>/i)?.[1] || "";
  if (canonical !== hubCanonical) failures.push(`${page}: hibás canonical (${canonical || "nincs"})`);
  if (!html.includes("KB_PHASE2:retired:START")) failures.push(`${page}: hiányzik a kivezetési marker`);
}

const sitemap = read("sitemap.xml");
if (!sitemap.includes("/kalkulatorok/atlag-kalkulator")) failures.push("az Átlag kalkulátor hiányzik a sitemapből");
for (const page of retired) {
  const route = `/${page.replace(/\.html$/, "")}`;
  if (sitemap.includes(route)) failures.push(`${page}: a kivezetett oldal még szerepel a sitemapben`);
}

const redirects = read("_redirects");
for (const page of retired) {
  const route = `/${page.replace(/\.html$/, "")}`;
  if (!redirects.includes(`${route} /kalkulatorok/atlag-kalkulator 301`)) failures.push(`${page}: hiányzik az extensionless 301`);
  if (!redirects.includes(`/${page} /kalkulatorok/atlag-kalkulator 301`)) failures.push(`${page}: hiányzik a .html 301`);
}

const cookie = read("js/cookie.js");
for (const page of retired) {
  const slug = page.replace(/\.html$/, "");
  if (!cookie.includes(`"${slug}"`)) failures.push(`${page}: hiányzik az AdSense runtime kizárás`);
}

const publicCount = calculators.filter((calculator) => calculator.hidden !== true).length;
const retiredCount = calculators.filter((calculator) => calculator.hidden === true).length;
if (publicCount !== 89 || retiredCount !== 13) {
  failures.push(`életciklus darabszám eltérés: ${publicCount} nyilvános + ${retiredCount} kivezetett`);
}

if (failures.length) {
  console.error("AdSense Phase 2 Batch 2 audit FAILED:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("AdSense Phase 2 Batch 2 audit OK.");
console.log("- 3 átlagoldal → 1 Átlag kalkulátor központ");
console.log("- 2 régi URL: 301 + noindex/canonical fallback + AdSense-kizárás");
console.log("- registry: 89 nyilvános + 13 kivezetett kalkulátor");

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const calculatorDirectory = path.join(root, "kalkulatorok");
const utilsPath = path.join(root, "js", "utils.js");
const retentionScriptPath = path.join(root, "js", "retention-cta.js");
const componentPath = path.join(root, "components", "retention-cta.html");
const cssPath = path.join(root, "css", "components", "retention-cta.css");

const read = (filePath) => fs.readFileSync(filePath, "utf8");
const files = fs
  .readdirSync(calculatorDirectory)
  .filter((file) => file.endsWith(".html"))
  .sort();
const utils = read(utilsPath);
const issues = [];

if (!fs.existsSync(retentionScriptPath)) issues.push("Hiányzik: js/retention-cta.js");
if (!fs.existsSync(componentPath)) issues.push("Hiányzik: components/retention-cta.html");
if (!fs.existsSync(cssPath)) issues.push("Hiányzik: css/components/retention-cta.css");
if (!utils.includes("js/retention-cta.js")) {
  issues.push("A utils.js nem tölti be a retention CTA scriptet.");
}

const pages = files.map((file) => {
  const filePath = path.join(calculatorDirectory, file);
  const html = read(filePath);
  const ctaCount = (html.match(/data-retention-cta/g) || []).length;
  const hasUtils = /<script[^>]+src=["']\.\.\/js\/utils\.js["']/i.test(html);
  const calculatorCards = (html.match(/class=["'][^"']*\bcard-calculator\b/g) || []).length;
  const resultBlocks = (html.match(/class=["'][^"']*\bresult-box\b/g) || []).length;
  const hasResultId = /id=["'](?:simpleCalcResults|result[^"']*)["']/i.test(html);

  if (!hasUtils) issues.push(`${file}: hiányzik a közös utils.js betöltés.`);
  if (!calculatorCards) issues.push(`${file}: nincs .card-calculator konténer.`);
  if (!resultBlocks && !hasResultId) issues.push(`${file}: nincs felismerhető eredménykonténer.`);
  if (ctaCount > 0) issues.push(`${file}: statikus retention CTA duplikáció kockázat (${ctaCount}).`);

  return {
    file,
    hasUtils,
    calculatorCards,
    resultBlocks,
    hasResultId,
    staticRetentionCta: ctaCount,
  };
});

const result = {
  calculators: pages.length,
  issues,
  pages,
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exitCode = 1;

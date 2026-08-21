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
  const hasStaticFallbackCleanup = /static-first-fallbacks\.js/i.test(html);
  const hasUtils = /<script[^>]+src=["']\.\.\/js\/utils\.js["']/i.test(html);
  const calculatorCards = (html.match(/class=["'][^"']*\bcard-calculator\b/g) || []).length;
  const resultBlocks = (
    html.match(
      /class=["'][^"']*\b(?:result-box|summary-box|everyday-result|ac-result|construction-results|priority-results)\b/g
    ) || []
  ).length;
  const hasResultId = /id=["'](?:simpleCalcResults|result[^"']*)["']/i.test(html);
  const hasScientificCalculator = /\bdata-calculator\b/i.test(html) && /\bdata-calc-display\b/i.test(html);

  if (!hasUtils) issues.push(`${file}: hiányzik a közös utils.js betöltés.`);
  if (!calculatorCards && !hasScientificCalculator) issues.push(`${file}: nincs .card-calculator konténer.`);
  if (!resultBlocks && !hasResultId && !hasScientificCalculator) issues.push(`${file}: nincs felismerhető eredménykonténer.`);

  // The static-first exporter can capture one hidden retention component in the
  // rendered calculator card. static-first-fallbacks.js removes that transient
  // copy before retention-cta.js binds the live runtime component. More than one
  // copy, or a copy without the cleanup script, is still a regression.
  if (ctaCount > 1 || (ctaCount === 1 && !hasStaticFallbackCleanup)) {
    issues.push(`${file}: statikus retention CTA duplikáció kockázat (${ctaCount}).`);
  }

  return {
    file,
    hasUtils,
    calculatorCards,
    resultBlocks,
    hasResultId,
    hasScientificCalculator,
    staticRetentionCta: ctaCount,
    hasStaticFallbackCleanup,
  };
});

const result = {
  calculators: pages.length,
  issues,
  pages,
};

const output = process.argv.includes("--summary")
  ? { calculators: result.calculators, issues: result.issues }
  : result;

console.log(JSON.stringify(output, null, 2));
if (issues.length) process.exitCode = 1;

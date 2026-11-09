const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const canonicalPath = path.join(root, "css", "pages", "home-redesign-v17.css");
const railPath = path.join(root, "css", "pages", "home-multiplex-rails.css");
const indexPath = path.join(root, "index.html");

const legacyFiles = [
  "home-redesign-v17-01.css",
  "home-redesign-v17-02.css",
  "home-redesign-v17-03.css",
  "home-redesign-final-1.css",
  "home-redesign-final-2.css",
  "home-redesign-assets.css",
  "home-redesign-responsive.css",
  "home-redesign-mobile-fix.css",
  "home-redesign-hero-crop.css",
  "home-redesign-controls.css",
];

const requiredSections = [
  "Foundation",
  "Sections and widgets",
  "Themes and seasonal states",
  "Desktop refinements",
  "Small-screen refinements",
  "Visual assets",
  "Responsive layout",
  "Mobile hardening",
  "Hero crop",
  "Interactive controls",
];

const failures = [];
const canonical = fs.readFileSync(canonicalPath, "utf8");
const rails = fs.readFileSync(railPath, "utf8");
const index = fs.readFileSync(indexPath, "utf8");

if (!canonical.includes("KB_HOME_CSS_CONSOLIDATED_V1")) {
  failures.push("A főoldali CSS-ből hiányzik a konszolidált forrásjelölő.");
}
if (/@import\s/i.test(canonical)) {
  failures.push("A főoldali kanonikus CSS újabb importláncot tartalmaz.");
}

for (const section of requiredSections) {
  if (!canonical.includes(`/* === ${section} === */`)) {
    failures.push(`Hiányzó főoldali CSS-szakasz: ${section}`);
  }
}

for (const file of legacyFiles) {
  const legacyPath = path.join(root, "css", "pages", file);
  if (fs.existsSync(legacyPath)) failures.push(`Régi főoldali javítófájl maradt: ${file}`);
  if (index.includes(file)) failures.push(`Az index.html régi főoldali CSS-re hivatkozik: ${file}`);
}

const canonicalLinks = index.match(/css\/pages\/home-redesign-v17\.css\?v=[a-f0-9]{12}/g) || [];
if (canonicalLinks.length !== 1) {
  failures.push(`A főoldali kanonikus CSS-hivatkozások száma ${canonicalLinks.length}, elvárt: 1.`);
}

const railLinks = index.match(/css\/pages\/home-multiplex-rails\.css\?v=[a-f0-9]{12}/g) || [];
if (railLinks.length !== 1) {
  failures.push(`A Multiplex rail CSS-hivatkozások száma ${railLinks.length}, elvárt: 1.`);
}
const protectedHeroCount = (index.match(/<header\s+class="hero"\s+id="homeHero">/g) || []).length;
if (protectedHeroCount !== 1) {
  failures.push(`A strukturálisan védett főoldali hero jelölők száma ${protectedHeroCount}, elvárt: 1.`);
}
if (!/@media\s*\(min-width:\s*1760px\)/.test(rails)) {
  failures.push("A főoldali hirdetési rail 1760 px-es védelme hiányzik.");
}

const criticalContracts = [
  [".home-redesign-v17 #header", "a V17 fejléc izolációja"],
  [".home-redesign-v17 .hero-copy h1", "a főcím komponensszabálya"],
  [".home-redesign-v17 :is(.lang-pop,.season-pop)", "a választómenük komponensszabálya"],
  [".home-redesign-v17 .salary-direction-btn.active", "a bérkártya aktív állapota"],
  ["body.home-redesign-v17 .kb-help-panel[data-open=\"true\"]", "a segítségpanel nyitott állapota"],
];
for (const [needle, label] of criticalContracts) {
  if (!canonical.includes(needle)) failures.push(`Hiányzik ${label}.`);
}

// The current homepage uses two atlases, not the missing per-season or
// per-category images. Guard against reintroducing obsolete CSS overlays.
const legacyImageRef = /\/images\/redesign\/(?:season-(?:spring|summer|autumn|winter)|category-(?:finance|home|auto|health|everyday|convert))\.avif\b/g;
if (legacyImageRef.test(canonical)) {
  failures.push("A főoldali CSS ismét hiányzó egyedi szezon- vagy kategóriaképre hivatkozik.");
}
if (/--(?:hero-photo|card-image)\s*:/.test(canonical)) {
  failures.push("A régi --hero-photo/--card-image felülíró változók maradtak a kanonikus CSS-ben.");
}
for (const [asset, className] of [
  ["season-atlas.avif", ".home-redesign-v17 .hero"],
  ["category-atlas.avif", ".home-redesign-v17 .category-tile::before"],
]) {
  if (!fs.existsSync(path.join(root, "images", "redesign", asset))) {
    failures.push("Hiányzik az aktív főoldali képatlasz: " + asset);
  }
  if (!canonical.includes(className) || !canonical.includes("/images/redesign/" + asset + "?")) {
    failures.push("Hiányzó aktív főoldali képatlasz-hivatkozás: " + asset);
  }
}
for (const season of ["spring", "summer", "autumn", "winter"]) {
  if (!canonical.includes("html[data-season='" + season + "']{")) {
    failures.push("Hiányzó évszakos atlaszpozíció: " + season);
  }
}
for (const category of ["finance", "home", "auto", "health", "everyday", "convert"]) {
  if (!canonical.includes(".home-redesign-v17 .category-" + category + "{--category-atlas-position:")) {
    failures.push("Hiányzó kategóriakép-atlaszpozíció: " + category);
  }
}
if (!canonical.includes("--season-action:") || !canonical.includes("--hero-accent:")) {
  failures.push("A CSS-tisztítás eltávolította a megtartandó évszakos színtokeneket.");
}

const importantCount = (canonical.match(/!important/g) || []).length;
if (importantCount > 358) {
  failures.push(`Nőtt a főoldali !important használat: ${importantCount} (maximum 358).`);
}

if (failures.length) {
  console.error("Homepage CSS contract audit failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Homepage CSS contract audit OK.");
console.log(`- legacy repair stylesheets: 0/${legacyFiles.length}`);
console.log("- canonical homepage stylesheets: 1");
console.log(`- documented !important exceptions: ${importantCount}`);
console.log("- Multiplex rail breakpoint: >=1760px");

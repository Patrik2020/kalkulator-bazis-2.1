const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const financePages = new Set([
  "penzugyi.html",
  "kalkulatorok/netto-brutto-kalkulator.html",
  "kalkulatorok/hitel-torleszto-kalkulator.html",
  "kalkulatorok/hitelkepesseg-kalkulator.html",
  "kalkulatorok/lakas-hitel-onero-kalkulator.html",
  "kalkulatorok/osztalek-kalkulator.html",
  "kalkulatorok/etf-kalkulator.html",
  "kalkulatorok/milliomos-kalkulator.html",
  "kalkulatorok/inflacio-kalkulator.html",
  "kalkulatorok/kamatos-kamat-kalkulator.html",
  "kalkulatorok/havi-koltsegvetes-kalkulator.html",
  "kalkulatorok/fizetesi-hatarido-kalkulator.html",
  "kalkulatorok/szamla-teljesites-kalkulator.html",
]);

const constructionPages = new Set([
  "epitoipari.html",
  "kalkulatorok/beton-kalkulator.html",
  "kalkulatorok/csempe-kalkulator.html",
  "kalkulatorok/festek-kalkulator.html",
  "kalkulatorok/tegla-kalkulator.html",
  "kalkulatorok/gipszkarton-kalkulator.html",
  "kalkulatorok/tapeta-kalkulator.html",
  "kalkulatorok/vakolat-kalkulator.html",
  "kalkulatorok/hoszigeteles-kalkulator.html",
  "kalkulatorok/terkovezes-kalkulator.html",
  "kalkulatorok/tetocserep-kalkulator.html",
  "kalkulatorok/fuga-kalkulator.html",
  "kalkulatorok/padlo-burkolat-kalkulator.html",
]);

const lifestylePages = new Set([
  "egeszseg.html", "mindennapi.html",
  "kalkulatorok/bmi-kalkulator.html", "kalkulatorok/kaloria-kalkulator.html",
  "kalkulatorok/vizfogyasztas-kalkulator.html", "kalkulatorok/pulzus-zona-kalkulator.html",
  "kalkulatorok/terhessegi-kalkulator.html", "kalkulatorok/idealis-testsuly-kalkulator.html",
  "kalkulatorok/testzsir-kalkulator.html", "kalkulatorok/makro-kalkulator.html",
  "kalkulatorok/alvasciklus-kalkulator.html", "kalkulatorok/bmr-kalkulator.html",
  "kalkulatorok/derek-csipo-kalkulator.html", "kalkulatorok/feherje-szukseglet-kalkulator.html",
  "kalkulatorok/szazalek-kalkulator.html", "kalkulatorok/afa-kalkulator.html",
  "kalkulatorok/ar-kedvezmeny-kalkulator.html", "kalkulatorok/borravalo-kalkulator.html",
  "kalkulatorok/munkaido-kalkulator.html", "kalkulatorok/eletkor-kalkulator.html",
  "kalkulatorok/datum-kulonbseg-kalkulator.html", "kalkulatorok/atlag-kalkulator.html",
  "kalkulatorok/egysegar-kalkulator.html", "kalkulatorok/rezsi-megosztas-kalkulator.html",
  "kalkulatorok/oraber-kalkulator.html", "kalkulatorok/arany-kalkulator.html",
]);

const autoPages = new Set([
  "auto.html", "atvaltok.html",
  "kalkulatorok/auto-kalkulator.html", "kalkulatorok/uzemanyag-koltseg-kalkulator.html",
  "kalkulatorok/auto-fogyasztas-kalkulator.html", "kalkulatorok/hatotav-kalkulator.html",
  "kalkulatorok/eves-auto-koltseg-kalkulator.html", "kalkulatorok/auto-ertekvesztes-kalkulator.html",
  "kalkulatorok/kilometerdij-kalkulator.html", "kalkulatorok/co2-kibocsatas-kalkulator.html",
  "kalkulatorok/tankolas-kalkulator.html", "kalkulatorok/gumi-meret-kalkulator.html",
  "kalkulatorok/autopalyadij-kalkulator.html", "kalkulatorok/utazasi-ido-kalkulator.html",
  "kalkulatorok/homerseklet-atvalto-kalkulator.html", "kalkulatorok/hosszusag-atvalto-kalkulator.html",
  "kalkulatorok/tomeg-atvalto-kalkulator.html", "kalkulatorok/terulet-atvalto-kalkulator.html",
  "kalkulatorok/terfogat-atvalto-kalkulator.html", "kalkulatorok/ido-atvalto-kalkulator.html",
  "kalkulatorok/sebesseg-atvalto-kalkulator.html", "kalkulatorok/adatmeret-atvalto-kalkulator.html",
  "kalkulatorok/deviza-atvalto-kalkulator.html", "kalkulatorok/energia-atvalto-kalkulator.html",
  "kalkulatorok/nyomas-atvalto-kalkulator.html", "kalkulatorok/teljesitmeny-atvalto-kalkulator.html",
]);

const finalPages = new Set([
  "index.html", "kalkulatorok.html", "elethelyzetek.html", "rolunk.html", "kapcsolat.html",
  "miert-bizhatsz-bennunk.html", "atlathatosag-es-minoseg.html", "szamitasi-modszertan.html",
  "adatvedelem.html", "cookie.html", "felhasznalasi-feltetelek.html", "jogi-nyilatkozat.html",
  "impresszum.html", "kalkulatorok/multifunkcios-szamologep.html",
  "landing-pages/elethelyzetek/lakasvasarlas.html", "landing-pages/elethelyzetek/autofenntartas.html",
  "landing-pages/elethelyzetek/fizetes-munkaber.html", "landing-pages/elethelyzetek/befektetes-kezdoknek.html",
  "landing-pages/elethelyzetek/felujitas-tervezese.html", "landing-pages/elethelyzetek/csaladi-koltsegvetes.html",
  "landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html", "landing-pages/wise/wise.html",
]);

const priorityPages = new Set([
  "kalkulatorok/hitelkepesseg-kalkulator.html", "kalkulatorok/lakas-hitel-onero-kalkulator.html",
  "kalkulatorok/hitel-torleszto-kalkulator.html", "kalkulatorok/milliomos-kalkulator.html",
  "kalkulatorok/inflacio-kalkulator.html", "kalkulatorok/kamatos-kamat-kalkulator.html",
  "kalkulatorok/havi-koltsegvetes-kalkulator.html", "kalkulatorok/fizetesi-hatarido-kalkulator.html",
  "kalkulatorok/szamla-teljesites-kalkulator.html", "kalkulatorok/afa-kalkulator.html",
  "kalkulatorok/terhessegi-kalkulator.html", "kalkulatorok/pulzus-zona-kalkulator.html",
  "kalkulatorok/vizfogyasztas-kalkulator.html", "kalkulatorok/testzsir-kalkulator.html",
  "kalkulatorok/derek-csipo-kalkulator.html", "kalkulatorok/alvasciklus-kalkulator.html",
  "kalkulatorok/idealis-testsuly-kalkulator.html", "kalkulatorok/bmi-kalkulator.html",
  "kalkulatorok/kaloria-kalkulator.html", "kalkulatorok/bmr-kalkulator.html",
  "kalkulatorok/makro-kalkulator.html", "kalkulatorok/feherje-szukseglet-kalkulator.html",
]);

const constructionRuntimePages = new Set([
  "kalkulatorok/gipszkarton-kalkulator.html", "kalkulatorok/tapeta-kalkulator.html",
  "kalkulatorok/vakolat-kalkulator.html", "kalkulatorok/hoszigeteles-kalkulator.html",
  "kalkulatorok/terkovezes-kalkulator.html", "kalkulatorok/tetocserep-kalkulator.html",
  "kalkulatorok/fuga-kalkulator.html", "kalkulatorok/padlo-burkolat-kalkulator.html",
]);

const everydayRuntimePages = new Set([
  "kalkulatorok/atlag-kalkulator.html", "kalkulatorok/munkaido-kalkulator.html",
  "kalkulatorok/oraber-kalkulator.html", "kalkulatorok/egysegar-kalkulator.html",
  "kalkulatorok/rezsi-megosztas-kalkulator.html", "kalkulatorok/ar-kedvezmeny-kalkulator.html",
  "kalkulatorok/borravalo-kalkulator.html", "kalkulatorok/eletkor-kalkulator.html",
  "kalkulatorok/datum-kulonbseg-kalkulator.html",
]);

const autoRuntimePages = new Set([
  "kalkulatorok/eves-auto-koltseg-kalkulator.html", "kalkulatorok/auto-ertekvesztes-kalkulator.html",
  "kalkulatorok/kilometerdij-kalkulator.html", "kalkulatorok/co2-kibocsatas-kalkulator.html",
  "kalkulatorok/gumi-meret-kalkulator.html", "kalkulatorok/uzemanyag-koltseg-kalkulator.html",
  "kalkulatorok/adatmeret-atvalto-kalkulator.html", "kalkulatorok/energia-atvalto-kalkulator.html",
  "kalkulatorok/teljesitmeny-atvalto-kalkulator.html", "kalkulatorok/hosszusag-atvalto-kalkulator.html",
  "kalkulatorok/tomeg-atvalto-kalkulator.html", "kalkulatorok/terulet-atvalto-kalkulator.html",
  "kalkulatorok/terfogat-atvalto-kalkulator.html", "kalkulatorok/ido-atvalto-kalkulator.html",
  "kalkulatorok/sebesseg-atvalto-kalkulator.html",
]);

function sitemapPages() {
  const xml = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const pages = [];
  for (const match of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)) {
    const url = new URL(match[1].trim());
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
    if (relative.endsWith("/")) relative += "index.html";
    if (relative.endsWith(".html") && fs.existsSync(path.join(root, relative))) pages.push(relative);
  }
  return [...new Set(pages)];
}

function hasNonEmptyElement(html, id) {
  const re = new RegExp(`<([a-z][a-z0-9:-]*)\\b[^>]*\\bid=["']${id}["'][^>]*>([\\s\\S]*?)<\\/\\1>`, "i");
  const match = html.match(re);
  return match ? match[2].replace(/<!--([\s\S]*?)-->/g, "").trim().length > 0 : null;
}

function requireMarker(html, marker, page, errors) {
  if (!html.includes(marker)) errors.push(`${page}: hiányzik: ${marker}`);
}

const errors = [];
const pages = sitemapPages();

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");

  if (!/static-first-fallbacks\.js/i.test(html)) {
    errors.push(`${page}: a static-first fallback script nincs a forrásban`);
  }

  const headerState = hasNonEmptyElement(html, "header");
  if (headerState === false) errors.push(`${page}: #header továbbra is üres JS-helyőrző`);

  const footerState = hasNonEmptyElement(html, "footer");
  if (footerState === false) errors.push(`${page}: #footer továbbra is üres JS-helyőrző`);

  if (page.startsWith("kalkulatorok/") && page !== "kalkulatorok/multifunkcios-szamologep.html") {
    if (!/class=["'][^"']*\bcard-calculator\b/i.test(html)) {
      errors.push(`${page}: nincs statikus kalkulátorkártya`);
    }

    if (/id=["']simpleCalcFields["']/i.test(html)) {
      const fieldsState = hasNonEmptyElement(html, "simpleCalcFields");
      if (fieldsState === false) errors.push(`${page}: a kalkulátor mezői továbbra is csak JavaScriptből jönnek`);
    }

    const installButton = html.match(
      /<button\b(?=[^>]*\bdata-retention-action=["']install["'])[^>]*>/i
    )?.[0];
    if (!installButton || !/\bhidden\b/i.test(installButton) || /\bdata-install-mode\b/i.test(installButton)) {
      errors.push(`${page}: a statikus telepítési CTA nem kanonikus, rejtett állapotú`);
    }
  }

  if (page === "kalkulatorok/deviza-atvalto-kalkulator.html") {
    if (!/<span\s+id=["']lastUpdate["']>A böngészőben frissül<\/span>/i.test(html)) {
      errors.push(`${page}: élő árfolyamdátum került a statikus forrásba`);
    }
    if (!/<span\s+id=["']rateSource["']>Frankfurter \/ Európai Központi Bank<\/span>/i.test(html)) {
      errors.push(`${page}: élő árfolyamforrás került a statikus forrásba`);
    }
  }

  if (page.startsWith("kalkulatorok/")) {
    const reliabilityNotes = html.match(/class=["'][^"']*\breliability-note\b/gi) || [];
    if (reliabilityNotes.length !== 1) {
      errors.push(`${page}: pontosan 1 megbízhatósági megjegyzés kell, jelenleg ${reliabilityNotes.length}`);
    }
  }

  if (financePages.has(page)) requireMarker(html, "KB_STATIC:quality-finance:START", page, errors);
  if (constructionPages.has(page)) requireMarker(html, "KB_STATIC:quality-construction:START", page, errors);
  if (lifestylePages.has(page)) requireMarker(html, "KB_STATIC:quality-lifestyle:START", page, errors);
  if (autoPages.has(page)) requireMarker(html, "KB_STATIC:quality-auto:START", page, errors);
  if (finalPages.has(page)) requireMarker(html, "KB_STATIC:quality-final:START", page, errors);
  if (priorityPages.has(page)) requireMarker(html, "KB_STATIC:priority-upgrade:START", page, errors);
  if (constructionRuntimePages.has(page)) requireMarker(html, "KB_STATIC:construction-methodology:START", page, errors);
  if (everydayRuntimePages.has(page)) requireMarker(html, "KB_STATIC:everyday-method:START", page, errors);
  if (autoRuntimePages.has(page)) requireMarker(html, "KB_STATIC:auto-converter-note:START", page, errors);

  const starts = [...html.matchAll(/<!-- KB_STATIC:([^:]+):START -->/g)].map((match) => match[1]);
  const ends = [...html.matchAll(/<!-- KB_STATIC:([^:]+):END -->/g)].map((match) => match[1]);
  if (starts.length !== ends.length || starts.some((key, index) => key !== ends[index])) {
    errors.push(`${page}: hibás vagy kiegyensúlyozatlan KB_STATIC markerpár`);
  }
}

if (errors.length) {
  console.error(`Static-first audit: ${errors.length} hiba`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Static-first audit OK: ${pages.length} indexelhető HTML oldal forrása crawler-látható.`);

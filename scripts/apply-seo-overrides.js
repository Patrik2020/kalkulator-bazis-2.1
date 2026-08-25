const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");

const overrides = {
  "kalkulatorok/fizetesi-hatarido-kalkulator.html": {
    title: "Határidő számítás és fizetési határidő kalkulátor 2026",
    description:
      "Határidő számítás naptári vagy munkanapokkal. Fizetési határidő kalkulátor 2026-os munkarenddel, számlákhoz és szerződéses határidők tervezéséhez.",
    h1: "Határidő számítás és fizetési határidő kalkulátor",
    heroLead:
      "Számold ki naptári vagy munkanapokkal, mikor jár le a megadott határidő.",
  },
  "kalkulatorok/szamla-teljesites-kalkulator.html": {
    title: "Teljesítési dátum kalkulátor | Számla és folyamatos teljesítés",
    description:
      "Teljesítési dátum kalkulátor számlákhoz: lásd át a teljesítés, a fizetési határidő és a folyamatos vagy időszakos teljesítés fontos áfaszabályait.",
    h1: "Számla teljesítési dátum kalkulátor",
    heroLead:
      "Tekintsd át a számla teljesítési dátumát, a fizetési határidőt és a különleges teljesítési szabályok korlátait.",
  },
  "kalkulatorok/beton-kalkulator.html": {
    title: "Beton kalkulátor – köbméter (m³) és anyagszükséglet számítás",
    description:
      "Beton kalkulátor m³-ben: add meg a méreteket, és számold ki a szükséges beton köbméterét alaphoz, födémhez vagy járdához, ráhagyással.",
    h1: "Beton kalkulátor – köbméter és anyagszükséglet számítás",
    heroLead:
      "Számold ki gyorsan, hány köbméter beton szükséges a megadott méretekhez.",
  },
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function setAttribute(tag, name, value) {
  const escaped = escapeAttribute(value);
  const attribute = new RegExp(`\\b${escapeRegExp(name)}\\s*=\\s*(["']).*?\\1`, "i");
  if (attribute.test(tag)) {
    return tag.replace(attribute, `${name}="${escaped}"`);
  }
  return tag.replace(/\s*\/?>(\s*)$/, ` ${name}="${escaped}">$1`);
}

function replaceMeta(html, selectorName, selectorValue, content) {
  const selector = escapeRegExp(selectorValue);
  const re = new RegExp(
    `<meta\\b(?=[^>]*\\b${escapeRegExp(selectorName)}\\s*=\\s*(["'])${selector}\\1)[^>]*>`,
    "i"
  );
  if (!re.test(html)) {
    throw new Error(`Hiányzó meta: ${selectorName}=${selectorValue}`);
  }
  return html.replace(re, (tag) => setAttribute(tag, "content", content));
}

function replaceTitle(html, title) {
  if (!/<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)) throw new Error("Hiányzó <title>.");
  return html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`);
}

function replaceHero(html, h1, lead) {
  const heroRe = /<section\b([^>]*\bclass\s*=\s*(["'])[^"']*\bhero\b[^"']*\2[^>]*)>([\s\S]*?)<\/section>/i;
  const match = html.match(heroRe);
  if (!match) throw new Error("Hiányzó .hero szakasz.");
  let hero = match[0];
  if (!/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(hero)) throw new Error("Hiányzó hero H1.");
  hero = hero.replace(/(<h1\b[^>]*>)[\s\S]*?(<\/h1>)/i, `$1${escapeText(h1)}$2`);
  if (!/<p\b[^>]*>[\s\S]*?<\/p>/i.test(hero)) throw new Error("Hiányzó hero lead.");
  hero = hero.replace(/(<p\b[^>]*>)[\s\S]*?(<\/p>)/i, `$1${escapeText(lead)}$2`);
  return html.replace(heroRe, hero);
}

function replaceStructuredData(html, config) {
  const re = /(<script\b[^>]*\bid\s*=\s*(["'])kb-structured-data\2[^>]*>)([\s\S]*?)(<\/script>)/i;
  const match = html.match(re);
  if (!match) throw new Error("Hiányzó kb-structured-data.");

  let data;
  try {
    data = JSON.parse(match[3].trim());
  } catch (error) {
    throw new Error(`Érvénytelen kb-structured-data JSON: ${error.message}`);
  }

  const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
  const page = graph.find((node) => node?.["@type"] === "WebPage");
  if (!page) throw new Error("Hiányzó WebPage schema node.");
  page.name = config.title;
  page.description = config.description;

  return html.replace(re, `${match[1]}${JSON.stringify(data)}${match[4]}`);
}

function applyOverride(source, config) {
  let html = source;
  html = replaceTitle(html, config.title);
  html = replaceMeta(html, "name", "description", config.description);
  html = replaceMeta(html, "property", "og:title", config.title);
  html = replaceMeta(html, "property", "og:description", config.description);
  html = replaceMeta(html, "name", "twitter:title", config.title);
  html = replaceMeta(html, "name", "twitter:description", config.description);
  html = replaceHero(html, config.h1, config.heroLead);
  html = replaceStructuredData(html, config);
  return html;
}

let changed = 0;
for (const [relativePath, config] of Object.entries(overrides)) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Hiányzó SEO céloldal: ${relativePath}`);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = applyOverride(source, config);

  if (checkOnly) {
    if (expected !== source) throw new Error(`SEO override nincs materializálva: ${relativePath}`);
  } else if (expected !== source) {
    fs.writeFileSync(filePath, expected);
    changed += 1;
  }
}

console.log(
  checkOnly
    ? `SEO override audit OK: ${Object.keys(overrides).length} céloldal.`
    : `SEO override materializálva: ${changed}/${Object.keys(overrides).length} módosult oldal.`
);

module.exports = { overrides };

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
  "kalkulatorok/terulet-atvalto-kalkulator.html": {
    title: "Terület átváltó – hektár, m², ár és km² kalkulátor",
    description:
      "Terület átváltó hektár, m², ár, km², ft² és más egységek között. Válts gyorsan négyzetmétert hektárra, hektárt m²-re és további területeket.",
    h1: "Terület átváltó – hektár, m², ár és km² kalkulátor",
    heroLead:
      "Válts gyorsan négyzetméter, hektár, ár, négyzetkilométer és más területmértékek között.",
  },
  "kalkulatorok/gumi-meret-kalkulator.html": {
    title: "Gumiméret váltó kalkulátor – váltóméret és kerékátmérő",
    description:
      "Gumiméret váltó kalkulátor két abroncsméret összehasonlításához. Nézd meg a kerékátmérőt, oldalfalat, százalékos eltérést és becsült sebességhatást.",
    h1: "Gumiméret váltó kalkulátor",
    heroLead:
      "Hasonlíts össze két gumiméretet, és ellenőrizd a kerékátmérő és a sebesség becsült eltérését.",
  },
  "kalkulatorok/auto-fogyasztas-kalkulator.html": {
    title: "Átlagfogyasztás kalkulátor – autó fogyasztás l/100 km",
    description:
      "Átlagfogyasztás kalkulátor autóhoz: add meg a tankolt litert és a megtett kilométert, és számold ki a valós fogyasztást liter/100 km értékben.",
    h1: "Átlagfogyasztás és autó fogyasztás kalkulátor",
    heroLead:
      "Számold ki a valós átlagfogyasztást tankolt üzemanyag és megtett kilométer alapján.",
  },
  "kalkulatorok/auto-kalkulator.html": {
    title: "Utazási költség kalkulátor – fogyasztás és hatótáv",
    description:
      "Utazási költség kalkulátor autóhoz: számold ki az üzemanyagköltséget távolság, fogyasztás és literár alapján, valamint a fogyasztást és becsült hatótávot.",
    h1: "Utazási költség, fogyasztás és hatótáv kalkulátor",
    heroLead:
      "Számold ki egy út üzemanyagköltségét, az autó fogyasztását és a becsült hatótávot egy helyen.",
  },
  "kalkulatorok/fuga-kalkulator.html": {
    title: "Fugakalkulátor – fugázóanyag mennyiség és szükséglet",
    description:
      "Fugakalkulátor csempe és járólap burkoláshoz: számold ki a szükséges fugázóanyag mennyiségét lapméret, fugaszélesség, mélység, felület és ráhagyás alapján.",
    h1: "Fugakalkulátor – fugázóanyag mennyiség kalkulátor",
    heroLead:
      "Becsüld meg, mennyi fugázóanyag kell a megadott burkolathoz, lapmérethez és fugaszélességhez.",
  },
};

const internalLinkBoosts = {
  "kalkulatorok/szazalek-kalkulator.html": [
    { href: "szazalekos-valtozas-kalkulator", label: "Százalékos változás kalkulátor" },
  ],
  "kalkulatorok/hitel-torleszto-kalkulator.html": [
    { href: "hitel-elotorlesztes-kalkulator", label: "Hitel előtörlesztés kalkulátor" },
  ],
  "kalkulatorok/fizetesi-hatarido-kalkulator.html": [
    { href: "munkanap-kalkulator", label: "Munkanap kalkulátor" },
  ],
  "kalkulatorok/auto-kalkulator.html": [
    { href: "ev-toltesi-koltseg-kalkulator", label: "EV töltési költség kalkulátor" },
  ],
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

function replaceMeta(html, selectorName, selectorValue, content, { required = true } = {}) {
  const selector = escapeRegExp(selectorValue);
  const re = new RegExp(
    `<meta\\b(?=[^>]*\\b${escapeRegExp(selectorName)}\\s*=\\s*(["'])${selector}\\1)[^>]*>`,
    "i"
  );
  if (!re.test(html)) {
    if (required) throw new Error(`Hiányzó meta: ${selectorName}=${selectorValue}`);
    return html;
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

function appendRelatedLinks(html, links) {
  const re = /(<div\b[^>]*\bclass\s*=\s*(["'])[^"']*\brelated-links\b[^"']*\2[^>]*>)([\s\S]*?)(<\/div>)/i;
  const match = html.match(re);
  if (!match) throw new Error("Hiányzó .related-links szakasz.");

  let body = match[3];
  for (const { href, label } of links) {
    const hrefRe = new RegExp(`href\\s*=\\s*(["'])${escapeRegExp(href)}\\1`, "i");
    if (hrefRe.test(body)) continue;
    body += `\n      <a href="${escapeAttribute(href)}">${escapeText(label)}</a>`;
  }

  return html.replace(re, () => `${match[1]}${body}${match[4]}`);
}

function applyOverride(source, config) {
  let html = source;
  html = replaceTitle(html, config.title);
  html = replaceMeta(html, "name", "description", config.description);
  html = replaceMeta(html, "property", "og:title", config.title, { required: false });
  html = replaceMeta(html, "property", "og:description", config.description, { required: false });
  html = replaceMeta(html, "name", "twitter:title", config.title, { required: false });
  html = replaceMeta(html, "name", "twitter:description", config.description, { required: false });
  html = replaceHero(html, config.h1, config.heroLead);
  html = replaceStructuredData(html, config);
  return html;
}

let changedOverrides = 0;
for (const [relativePath, config] of Object.entries(overrides)) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Hiányzó SEO céloldal: ${relativePath}`);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = applyOverride(source, config);

  if (checkOnly) {
    const secondPass = applyOverride(expected, config);
    if (secondPass !== expected) throw new Error(`Nem idempotens SEO override: ${relativePath}`);
  } else if (expected !== source) {
    fs.writeFileSync(filePath, expected);
    changedOverrides += 1;
  }
}

let changedLinkSources = 0;
for (const [relativePath, links] of Object.entries(internalLinkBoosts)) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) throw new Error(`Hiányzó belső linkforrás: ${relativePath}`);
  const source = fs.readFileSync(filePath, "utf8");
  const expected = appendRelatedLinks(source, links);

  if (checkOnly) {
    const secondPass = appendRelatedLinks(expected, links);
    if (secondPass !== expected) throw new Error(`Nem idempotens belső linkfrissítés: ${relativePath}`);
  } else if (expected !== source) {
    fs.writeFileSync(filePath, expected);
    changedLinkSources += 1;
  }
}

console.log(
  checkOnly
    ? `SEO audit OK: ${Object.keys(overrides).length} CTR-céloldal + ${Object.keys(internalLinkBoosts).length} belső linkforrás, idempotens materializálás.`
    : `SEO materializálva: ${changedOverrides}/${Object.keys(overrides).length} CTR-oldal és ${changedLinkSources}/${Object.keys(internalLinkBoosts).length} belső linkforrás módosult.`
);

module.exports = { overrides, internalLinkBoosts };

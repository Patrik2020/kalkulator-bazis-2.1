const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const calculatorDir = path.join(root, "kalkulatorok");

function readAttribute(openTag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = openTag.match(new RegExp(`\\b${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? match[2] : null;
}

function findElement(html, className) {
  const openingTags = /<([a-z][a-z0-9:-]*)\b[^>]*>/gi;
  let match;

  while ((match = openingTags.exec(html))) {
    const tag = match[1].toLowerCase();
    const classes = (readAttribute(match[0], "class") || "").split(/\s+/);
    if (!classes.includes(className)) continue;

    const tokens = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    tokens.lastIndex = match.index;
    let depth = 0;
    let token;

    while ((token = tokens.exec(html))) {
      if (/^<\//.test(token[0])) depth -= 1;
      else if (!/\/>\s*$/.test(token[0])) depth += 1;
      if (depth === 0) return html.slice(match.index, tokens.lastIndex);
    }
  }

  return null;
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function normalizeText(value) {
  return decodeEntities(String(value || "").replace(/<[^>]*>/g, " "))
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("hu-HU");
}

function structuredNodes(value, nodes = []) {
  if (!value || typeof value !== "object") return nodes;
  if (value["@type"]) nodes.push(value);
  Object.values(value).forEach((item) => {
    if (Array.isArray(item)) item.forEach((entry) => structuredNodes(entry, nodes));
    else structuredNodes(item, nodes);
  });
  return nodes;
}

function hasType(node, type) {
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  return types.includes(type);
}

const errors = [];
const pages = fs
  .readdirSync(calculatorDir)
  .filter((file) => file.endsWith(".html"))
  .sort();

for (const page of pages) {
  const relative = `kalkulatorok/${page}`;
  const html = fs.readFileSync(path.join(calculatorDir, page), "utf8");
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)].find((match) =>
    (readAttribute(match[0], "rel") || "").split(/\s+/).includes("canonical")
  );
  const canonical = canonicalTag ? readAttribute(canonicalTag[0], "href") : null;
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter((match) =>
    /\btype\s*=\s*(["'])application\/ld\+json\1/i.test(match[1])
  );
  const canonicalScripts = scripts.filter((match) => /\bid\s*=\s*(["'])kb-structured-data\1/i.test(match[1]));

  if (!canonical) errors.push(`${relative}: hiányzó canonical URL`);
  if (canonicalScripts.length !== 1) {
    errors.push(`${relative}: pontosan 1 #kb-structured-data blokk kell, jelenleg ${canonicalScripts.length}`);
  }

  const nodes = [];
  for (const script of scripts) {
    try {
      structuredNodes(JSON.parse(script[2]), nodes);
    } catch (error) {
      errors.push(`${relative}: hibás JSON-LD (${error.message})`);
    }
  }

  const webPages = nodes.filter((node) => hasType(node, "WebPage"));
  const applications = nodes.filter((node) => hasType(node, "SoftwareApplication"));
  const breadcrumbs = nodes.filter((node) => hasType(node, "BreadcrumbList"));
  const faqPages = nodes.filter((node) => hasType(node, "FAQPage"));

  if (webPages.length !== 1) errors.push(`${relative}: pontosan 1 WebPage séma kell, jelenleg ${webPages.length}`);
  if (applications.length !== 1) {
    errors.push(`${relative}: pontosan 1 SoftwareApplication séma kell, jelenleg ${applications.length}`);
  }
  if (breadcrumbs.length !== 1) {
    errors.push(`${relative}: pontosan 1 BreadcrumbList séma kell, jelenleg ${breadcrumbs.length}`);
  }
  if (faqPages.length > 1) errors.push(`${relative}: duplikált FAQPage séma (${faqPages.length})`);

  if (canonical) {
    if (webPages[0]?.url !== canonical) errors.push(`${relative}: a WebPage URL nem egyezik a canonical URL-lel`);
    if (applications[0]?.url !== canonical) {
      errors.push(`${relative}: a SoftwareApplication URL nem egyezik a canonical URL-lel`);
    }
    const breadcrumbItems = breadcrumbs[0]?.itemListElement;
    const lastBreadcrumb = Array.isArray(breadcrumbItems) ? breadcrumbItems.at(-1) : null;
    if (lastBreadcrumb?.item !== canonical) {
      errors.push(`${relative}: a breadcrumb utolsó URL-je nem egyezik a canonical URL-lel`);
    }
  }

  const faqList = findElement(html, "faq-list");
  const visibleQuestions = faqList
    ? [...faqList.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map((match) => normalizeText(match[1]))
    : [];
  const schemaQuestions = Array.isArray(faqPages[0]?.mainEntity)
    ? faqPages[0].mainEntity.map((question) => normalizeText(question?.name))
    : [];

  if (visibleQuestions.length && faqPages.length !== 1) {
    errors.push(`${relative}: látható GYIK mellől hiányzik az egyetlen FAQPage séma`);
  }
  if (visibleQuestions.length !== schemaQuestions.length) {
    errors.push(
      `${relative}: a látható és strukturált GYIK kérdésszám eltér (${visibleQuestions.length}/${schemaQuestions.length})`
    );
  } else {
    const visibleSet = new Set(visibleQuestions);
    schemaQuestions.forEach((question) => {
      if (!visibleSet.has(question)) errors.push(`${relative}: a strukturált GYIK kérdés nem látható: ${question}`);
    });
  }
}

if (errors.length) {
  console.error(`Strukturáltadat-audit: ${errors.length} hiba`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Strukturáltadat-audit OK: ${pages.length} kalkulátoroldal, egyedi sémák és egyező GYIK.`);

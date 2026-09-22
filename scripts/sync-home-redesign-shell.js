const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const checkOnly = process.argv.includes("--check");

const markers = {
  header: ["<!-- KB_HOME_SHELL:header:START -->", "<!-- KB_HOME_SHELL:header:END -->"],
  main: ["<!-- KB_HOME_SHELL:main:START -->", "<!-- KB_HOME_SHELL:main:END -->"],
  footer: ["<!-- KB_HOME_SHELL:footer:START -->", "<!-- KB_HOME_SHELL:footer:END -->"],
};

function readAttribute(openTag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return openTag.match(new RegExp(`\\b${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] || null;
}

function hasClass(openTag, className) {
  return (readAttribute(openTag, "class") || "").split(/\s+/).includes(className);
}

function findElement(html, matcher) {
  const openPattern = /<([a-z][a-z0-9:-]*)\b[^>]*>/gi;
  let match;

  while ((match = openPattern.exec(html))) {
    const tag = match[1].toLowerCase();
    const openTag = match[0];
    if (matcher.tag && tag !== matcher.tag) continue;
    if (matcher.id && readAttribute(openTag, "id") !== matcher.id) continue;
    if (matcher.className && !hasClass(openTag, matcher.className)) continue;

    const tokenPattern = new RegExp(`<\\/?${tag}\\b[^>]*>`, "gi");
    tokenPattern.lastIndex = match.index;
    let depth = 0;
    let token;

    while ((token = tokenPattern.exec(html))) {
      if (/^<\//.test(token[0])) depth -= 1;
      else if (!/\/>\s*$/.test(token[0])) depth += 1;
      if (depth === 0) return { start: match.index, end: tokenPattern.lastIndex };
    }
  }

  return null;
}

function markedBlock(key, content) {
  const [start, end] = markers[key];
  return `${start}\n${content.trim()}\n${end}`;
}

function preservedStaticBlock(source, key) {
  const startMarker = `<!-- KB_STATIC:${key}:START -->`;
  const endMarker = `<!-- KB_STATIC:${key}:END -->`;
  const start = source.indexOf(startMarker);
  const end = start === -1 ? -1 : source.indexOf(endMarker, start);

  if (start === -1 || end === -1) return `${startMarker}\n${endMarker}`;
  return source.slice(start, end + endMarker.length);
}

function replaceShellPart(source, key, matcher, content) {
  const [startMarker, endMarker] = markers[key];
  const start = source.indexOf(startMarker);
  const end = start === -1 ? -1 : source.indexOf(endMarker, start);
  const replacement = markedBlock(key, content);

  if (start !== -1 && end !== -1) {
    return source.slice(0, start) + replacement + source.slice(end + endMarker.length);
  }

  const element = findElement(source, matcher);
  if (!element) throw new Error(`A főoldali ${key} blokk nem található.`);
  return source.slice(0, element.start) + replacement + source.slice(element.end);
}

function addBodyState(source) {
  return source.replace(/<body\b([^>]*)>/i, (tag, attributes) => {
    let next = attributes;
    const classMatch = next.match(/\bclass\s*=\s*(["'])(.*?)\1/i);
    const classes = new Set((classMatch?.[2] || "").split(/\s+/).filter(Boolean));
    classes.add("home-page");
    classes.add("home-redesign-v17");

    if (classMatch) {
      next = next.replace(classMatch[0], `class=${classMatch[1]}${[...classes].join(" ")}${classMatch[1]}`);
    } else {
      next += ` class="${[...classes].join(" ")}"`;
    }

    if (/\bdata-home-redesign-static\s*=/i.test(next)) {
      next = next.replace(/\bdata-home-redesign-static\s*=\s*(["']).*?\1/i, 'data-home-redesign-static="17"');
    } else {
      next += ' data-home-redesign-static="17"';
    }

    return `<body${next}>`;
  });
}

function ensureStylesheet(source) {
  if (/data-home-redesign-v17/i.test(source)) return source;
  const stylesheet = '  <link rel="stylesheet" href="css/pages/home-redesign-v17.css" data-home-redesign-v17 />\n';
  return source.replace(/<script\b[^>]*src=["'][^"']*static-first-fallbacks\.js[^"']*["'][^>]*>/i, `${stylesheet}$&`);
}

function normalizeAssetVersions(source) {
  return source.replace(/\b(src|href)=(['"])(.*?)\2/gi, (attribute, name, quote, value) => {
    if (!/\.(?:css|js)(?:[?#]|$)/i.test(value)) return attribute;
    const normalized = value.replace(/([?&])v=[^&#'"\s]*/i, "$1v=__CONTENT_HASH__");
    return `${name}=${quote}${normalized}${quote}`;
  });
}

function normalizedMain(fragment, qualityBlock) {
  let main = fragment.trim()
    .replace(/^<main\s+id=["']top["']>/i, '<main id="main-content">')
    .replace(/<section\s+class=["']hero["']>/i, '<section class="hero" id="top">');

  if (!main.includes("KB_STATIC:quality-final:START")) {
    main = main.replace(
      /<\/main>\s*$/i,
      `\n${qualityBlock}\n</main>`
    );
  }
  return main;
}

function build(source) {
  const header = fs.readFileSync(path.join(root, "fragments", "home-redesign-v17-header.inc"), "utf8");
  const qualityBlock = preservedStaticBlock(source, "quality-final");
  const main = normalizedMain(
    fs.readFileSync(path.join(root, "fragments", "home-redesign-v17-main.inc"), "utf8"),
    qualityBlock
  );
  const footer = fs.readFileSync(path.join(root, "fragments", "home-redesign-v17-footer.inc"), "utf8");

  let next = addBodyState(source);
  next = ensureStylesheet(next);
  next = replaceShellPart(next, "header", { id: "header" }, header);
  next = replaceShellPart(next, "main", { tag: "main" }, main);
  next = replaceShellPart(next, "footer", { id: "footer" }, footer);
  return next.replace(/\n{4,}/g, "\n\n\n");
}

const source = fs.readFileSync(indexPath, "utf8");
const next = build(source);
const equivalentIgnoringAssetVersions =
  normalizeAssetVersions(source) === normalizeAssetVersions(next);

if (source === next || (checkOnly && equivalentIgnoringAssetVersions)) {
  console.log("A statikus főoldali redesign shell naprakész.");
} else if (checkOnly) {
  console.error("A statikus főoldali redesign shell eltér a fragmentektől. Futtasd: npm run home:shell:apply");
  process.exitCode = 1;
} else {
  fs.writeFileSync(indexPath, next, "utf8");
  console.log("A statikus főoldali redesign shell frissítve.");
}

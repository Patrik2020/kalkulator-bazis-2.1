"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { parse } = require("acorn");

const HASH_LENGTH = 12;
const SKIP_DIRS = new Set([".git", "node_modules", "scripts", "worker", "tests"]);
const codeExtension = /\.(?:css|js)$/i;

function createAssetVersions(root) {
  root = path.resolve(root);
  const hashCache = new Map();
  const relative = (file) => path.relative(root, file).replace(/\\/g, "/");
  const hash = (file) => {
    if (!hashCache.has(file)) hashCache.set(file, crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, HASH_LENGTH));
    return hashCache.get(file);
  };
  const walk = (dir = root) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP_DIRS.has(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : entry.isFile() ? [file] : [];
  });
  const parseUrl = (value) => {
    const fragmentIndex = value.indexOf("#");
    const fragment = fragmentIndex >= 0 ? value.slice(fragmentIndex) : "";
    const withoutFragment = fragmentIndex >= 0 ? value.slice(0, fragmentIndex) : value;
    const queryIndex = withoutFragment.indexOf("?");
    return { pathname: queryIndex >= 0 ? withoutFragment.slice(0, queryIndex) : withoutFragment, query: queryIndex >= 0 ? withoutFragment.slice(queryIndex + 1) : "", fragment };
  };
  const resolve = (sourceFile, value, kind) => {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(value)) return null;
    let { pathname } = parseUrl(value);
    if (!codeExtension.test(pathname)) return null;
    if (kind === "js") {
      // Runtime URLs resolve against the document, not the JS file.
      pathname = pathname.replace(/^\$\{(?:projectRoot|root|base)\}\//, "").replace(/^(?:\.\.?\/)+/, "").replace(/^\/+/, "");
      if (!/^(?:css|js)\//.test(pathname)) return null;
    }
    const decoded = decodeURIComponent(pathname);
    const file = kind === "js" || decoded.startsWith("/") ? path.resolve(root, decoded.replace(/^\/+/, "")) : path.resolve(path.dirname(sourceFile), decoded);
    if (!file.startsWith(root + path.sep)) throw new Error(`${relative(sourceFile)}: asset outside project: ${value}`);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`${relative(sourceFile)}: missing asset: ${value}`);
    // Scripts inspecting their own URL cannot hash that same literal: the root
    // marker in global-head.js and pwa.js's currentScript fallback are examples.
    if (kind === "js" && file === sourceFile) return null;
    return file;
  };
  const maskComments = (source, pattern) => source.replace(pattern, (comment) => comment.replace(/[^\n\r]/g, " "));

  function references(file, source = fs.readFileSync(file, "utf8")) {
    const refs = [];
    const add = (url, start, kind) => {
      const decoded = kind === "html" ? url.replace(/&amp;/gi, "&") : url;
      const target = resolve(file, decoded, kind);
      if (target) refs.push({ url: decoded, raw: url, start, end: start + url.length, target, kind });
    };
    if (/\.(?:html|inc)$/i.test(file)) {
      const masked = maskComments(source, /<!--[\s\S]*?-->/g);
      for (const match of masked.matchAll(/<(script|link)\b[^>]*>/gi)) {
        const tag = match[0];
        const attrs = Object.fromEntries([...tag.matchAll(/\b([\w-]+)\s*=\s*(["'])(.*?)\2/g)].map((a) => [a[1].toLowerCase(), a[3]]));
        const isScript = match[1].toLowerCase() === "script";
        const rel = (attrs.rel || "").toLowerCase().split(/\s+/);
        if (!isScript && !rel.includes("stylesheet") && !rel.includes("modulepreload") && !(rel.includes("preload") && ["style", "script"].includes(attrs.as))) continue;
        const attr = tag.match(new RegExp(`\\b${isScript ? "src" : "href"}\\s*=\\s*(["'])(.*?)\\1`, "i"));
        if (attr) add(attr[2], match.index + attr.index + attr[0].indexOf(attr[1]) + 1, "html");
      }
    } else if (file.endsWith(".css")) {
      const masked = maskComments(source, /\/\*[\s\S]*?\*\//g);
      const pattern = /@import\s+(?:url\(\s*(?:(["'])([^"']+)\1|([^\s)]+))\s*\)|(["'])([^"']+)\4)/gi;
      for (const match of masked.matchAll(pattern)) {
        const url = match[2] || match[3] || match[5];
        add(url, match.index + match[0].indexOf(url), "css");
      }
    } else if (file.endsWith(".js")) {
      const ast = parse(source, { ecmaVersion: "latest", sourceType: "script" });
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        let value;
        if (node.type === "Literal" && typeof node.value === "string") value = node.value;
        if (node.type === "TemplateLiteral" && node.expressions.every((e) => e.type === "Identifier" && ["projectRoot", "root", "base"].includes(e.name))) value = node.quasis.map((q, i) => q.value.raw + (node.expressions[i] ? `\${${node.expressions[i].name}}` : "")).join("");
        if (value && /^(?:(?:\$\{(?:projectRoot|root|base)\}\/)|(?:\.\.?\/)|\/)*(?:css|js)\/[A-Za-z0-9_./-]+\.(?:css|js)(?:[?#][^\s]*)?$/.test(value)) {
          // Whole URL literals only: selectors/comments containing a filename
          // are deliberately not rewritten.
          const raw = source.slice(node.start + 1, node.end - 1);
          if (raw === value) add(raw, node.start + 1, "js");
        }
        for (const [key, child] of Object.entries(node)) {
          if (key === "start" || key === "end") continue;
          if (Array.isArray(child)) child.forEach(visit);
          else if (child && typeof child === "object") visit(child);
        }
      };
      visit(ast);
    }
    return refs.sort((a, b) => a.start - b.start);
  }

  const withVersion = (ref) => {
    const { pathname, query, fragment } = parseUrl(ref.url);
    const params = new URLSearchParams(query);
    params.set("v", hash(ref.target));
    const value = `${pathname}?${params.toString()}${fragment}`;
    return ref.kind === "html" ? value.replace(/&/g, "&amp;") : value;
  };
  const write = (file, source) => {
    if (fs.readFileSync(file, "utf8") === source) return false;
    fs.writeFileSync(file, source); hashCache.delete(file); return true;
  };
  const fingerprint = (files) => {
    const digest = crypto.createHash("sha256");
    for (const file of files.filter((f) => relative(f) !== "sw.js" && /\.(?:html|css|js|webmanifest)$/i.test(f)).sort()) {
      digest.update(relative(file)); digest.update("\0"); digest.update(fs.readFileSync(file)); digest.update("\0");
    }
    return `build-${digest.digest("hex").slice(0, HASH_LENGTH)}`;
  };

  function refresh() {
    hashCache.clear();
    const files = walk();
    const serviceWorker = path.join(root, "sw.js");
    if (fs.existsSync(serviceWorker) && !/const KB_SW_VERSION = "[^"]+";/.test(fs.readFileSync(serviceWorker, "utf8"))) throw new Error("Missing KB_SW_VERSION in sw.js");
    const sources = files.filter((f) => /\.(?:html|inc|css|js)$/i.test(f) && relative(f) !== "sw.js");
    // Validate dependencies before writing, then update children before parents.
    const graph = new Map(sources.map((file) => [file, references(file)]));
    const ordered = [], visited = new Set(), visiting = new Set();
    const visit = (file) => {
      if (visited.has(file)) return;
      if (visiting.has(file)) throw new Error(`Circular asset dependency: ${relative(file)}`);
      visiting.add(file);
      for (const ref of graph.get(file) || []) visit(ref.target);
      visiting.delete(file); visited.add(file); ordered.push(file);
    };
    sources.forEach(visit);
    let changed = 0;
    for (const file of ordered) {
      const source = fs.readFileSync(file, "utf8");
      let next = source;
      for (const ref of [...(graph.get(file) || [])].reverse()) next = next.slice(0, ref.start) + withVersion(ref) + next.slice(ref.end);
      if (write(file, next)) changed += 1;
    }
    const version = fingerprint(files);
    if (fs.existsSync(serviceWorker)) {
      const source = fs.readFileSync(serviceWorker, "utf8");
      if (!/const KB_SW_VERSION = "[^"]+";/.test(source)) throw new Error("Missing KB_SW_VERSION in sw.js");
      if (write(serviceWorker, source.replace(/const KB_SW_VERSION = "[^"]+";/, `const KB_SW_VERSION = "${version}";`))) changed += 1;
    }
    return { files: sources.length, changed, version };
  }

  function audit() {
    hashCache.clear();
    const files = walk(), failures = [];
    let count = 0;
    for (const file of files.filter((f) => /\.(?:html|inc|css|js)$/i.test(f) && relative(f) !== "sw.js")) {
      for (const ref of references(file)) {
        count += 1;
        const versions = new URLSearchParams(parseUrl(ref.url).query).getAll("v");
        if (versions.length !== 1 || versions[0] !== hash(ref.target)) failures.push(`${relative(file)}: ${ref.url} — expected v=${hash(ref.target)}`);
      }
    }
    const serviceWorker = path.join(root, "sw.js");
    if (fs.existsSync(serviceWorker) && !fs.readFileSync(serviceWorker, "utf8").includes(`const KB_SW_VERSION = "${fingerprint(files)}";`)) failures.push("sw.js: deployment fingerprint does not match the published sources");
    if (!count) failures.push("No local CSS/JS asset references found");
    return { references: count, failures };
  }

  return { refresh, audit };
}

module.exports = { createAssetVersions };

#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const acorn = require("acorn");

// Classic scripts share a global lexical environment, including let/const.
function declaredGlobals(source) {
  const ast = acorn.parse(source, { ecmaVersion: "latest", sourceType: "script" });
  const names = new Set();
  function pattern(node) {
    if (!node) return;
    if (node.type === "Identifier") names.add(node.name);
    else if (node.type === "ObjectPattern") node.properties.forEach((item) => pattern(item.value || item.argument));
    else if (node.type === "ArrayPattern") node.elements.forEach(pattern);
    else if (node.type === "RestElement") pattern(node.argument);
    else if (node.type === "AssignmentPattern") pattern(node.left);
  }
  function visit(node, topLevel = false) {
    if (!node || typeof node.type !== "string") return;
    if (/Function/.test(node.type) || node.type === "ArrowFunctionExpression") {
      if (topLevel && node.type === "FunctionDeclaration") pattern(node.id);
      return;
    }
    if (node.type === "ClassDeclaration" || node.type === "ClassExpression") {
      if (topLevel && node.type === "ClassDeclaration") pattern(node.id);
      return;
    }
    if (node.type === "VariableDeclaration" && (topLevel || node.kind === "var")) {
      node.declarations.forEach((item) => pattern(item.id));
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach((child) => visit(child));
      else if (value && typeof value === "object") visit(value);
    }
  }
  ast.body.forEach((node) => visit(node, true));
  return names;
}

function pageScripts(page, html, config) {
  const sources = new Map();
  const origin = "https://scope-audit.invalid";
  const addFile = (value, base) => {
    const url = new URL(value, `${origin}/${base}`);
    if (url.origin === origin) sources.set(decodeURIComponent(url.pathname.slice(1)), null);
  };
  let inlineIndex = 0;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const attributes = match[1];
    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1] || "text/javascript";
    // Modules have their own scope; JSON-LD and import maps are not scripts.
    if (!/^(?:text|application)\/(?:java|ecma)script$/i.test(type)) continue;
    const src = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src) addFile(src, page);
    else if (match[2].trim()) sources.set(`${page}#inline-${++inlineIndex}`, match[2]);
  }
  [...config.base.scripts, ...config.calculatorPage.scripts].forEach((file) => addFile(file, ""));
  const file = path.posix.basename(page);
  const slug = file.replace(/\.html?$/i, "").toLowerCase();
  for (const feature of config.features) {
    if (feature.pages.includes(feature.match === "file" ? file : slug)) {
      feature.scripts.forEach((script) => addFile(script, ""));
    }
  }
  return sources;
}

function auditRepository(root, read = (file) => fs.readFileSync(path.join(root, file), "utf8")) {
  const sandbox = { window: {} };
  vm.runInNewContext(read("js/global-head-config.js"), sandbox, { filename: "global-head-config.js", timeout: 1000 });
  const config = sandbox.window.KB_GLOBAL_HEAD_CONFIG;
  const cache = new Map();
  const failures = [];
  const pages = fs.readdirSync(path.join(root, "kalkulatorok")).filter((file) => file.endsWith(".html"));
  for (const file of pages) {
    const page = `kalkulatorok/${file}`;
    const owners = new Map();
    for (const [script, inline] of pageScripts(page, read(page), config)) {
      if (!cache.has(script)) cache.set(script, declaredGlobals(inline === null ? read(script) : inline));
      for (const name of cache.get(script)) {
        const previous = owners.get(name);
        if (previous) failures.push(`${page}: ${name}: ${previous} + ${script}`);
        else owners.set(name, script);
      }
    }
  }
  return { pages: pages.length, scripts: cache.size, failures };
}

if (require.main === module) {
  const result = auditRepository(path.resolve(__dirname, ".."));
  if (result.failures.length) throw new Error(result.failures.join("\n"));
  console.log(`Calculator scopes OK: ${result.pages} HTML pages, ${result.scripts} script sources, no duplicate global declarations.`);
}

module.exports = { declaredGlobals, pageScripts, auditRepository };

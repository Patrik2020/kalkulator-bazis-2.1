#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const phrase = "Gyártói adatlap az elsődleges.";
const constructionSlugs = [
  "gipszkarton-kalkulator",
  "tapeta-kalkulator",
  "vakolat-kalkulator",
  "hoszigeteles-kalkulator",
  "terkovezes-kalkulator",
  "tetocserep-kalkulator",
  "fuga-kalkulator",
  "padlo-burkolat-kalkulator",
];

function patchRuntimeSource() {
  const file = path.join(root, "js", "construction-upgrades.js");
  let source = fs.readFileSync(file, "utf8");
  if (source.includes(phrase)) return 0;

  const needle = '<div class="notice-box"><strong>Ellenőrzési alap:</strong> ${method.source}</div>';
  if (!source.includes(needle)) {
    throw new Error("A construction runtime ellenőrzési blokk nem található.");
  }

  source = source.replace(
    needle,
    `<div class="notice-box"><strong>${phrase}</strong> <strong>Ellenőrzési alap:</strong> \${method.source}</div>`
  );
  fs.writeFileSync(file, source, "utf8");
  return 1;
}

function patchMaterializedPages() {
  let changed = 0;
  for (const slug of constructionSlugs) {
    const file = path.join(root, "kalkulatorok", `${slug}.html`);
    if (!fs.existsSync(file)) throw new Error(`Hiányzó építőipari oldal: ${slug}`);
    let html = fs.readFileSync(file, "utf8");

    const marker = /<!-- KB_STATIC:construction-methodology:START -->([\s\S]*?)<!-- KB_STATIC:construction-methodology:END -->/;
    const match = html.match(marker);
    if (!match) throw new Error(`Hiányzó construction-methodology marker: ${slug}`);
    if (match[1].includes(phrase)) continue;

    const patchedBlock = match[1].replace(
      '<strong>Ellenőrzési alap:</strong>',
      `<strong>${phrase}</strong> <strong>Ellenőrzési alap:</strong>`
    );
    if (patchedBlock === match[1]) throw new Error(`Hiányzó ellenőrzési alap blokk: ${slug}`);

    html = html.replace(match[1], patchedBlock);
    fs.writeFileSync(file, html, "utf8");
    changed += 1;
  }
  return changed;
}

const runtimeChanged = patchRuntimeSource();
const pageChanges = patchMaterializedPages();
console.log(`Manufacturer-first safety rule: runtime ${runtimeChanged ? "updated" : "already current"}, pages ${pageChanges}/8 updated.`);

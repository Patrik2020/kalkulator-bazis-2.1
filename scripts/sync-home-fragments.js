#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

// index.html is the canonical, materialized homepage. Legacy recovery fragments
// are derived from it, including its advertising placements and shared dialogs.
function homeFragments(source) {
  const header = source.indexOf('<div class="kb-header-wrap">');
  const main = source.indexOf("<main", header);
  const mainEnd = source.indexOf("</main>", main) + "</main>".length;
  const footer = source.indexOf("<footer>", mainEnd);
  const scripts = source.indexOf('<script src="js/site-data.js', footer);
  if (header < 0 || main <= header || mainEnd <= main || footer < mainEnd || scripts <= footer) {
    throw new Error("A főoldali fragmentumok forráshatárai nem találhatók.");
  }
  return {
    "header": source.slice(header, main).trim() + "\n",
    "main": source.slice(main, mainEnd).trim() + "\n",
    "footer": source.slice(footer, scripts).trim() + "\n",
  };
}

if (require.main === module) {
  const fragments = homeFragments(fs.readFileSync(path.join(root, "index.html"), "utf8"));
  for (const [name, content] of Object.entries(fragments)) {
    const target = path.join(root, "fragments", `home-redesign-v17-${name}.inc`);
    if (process.argv.includes("--check")) {
      if (fs.readFileSync(target, "utf8") !== content) throw new Error(`Elavult főoldali fragmentum: ${name}`);
    } else if (fs.readFileSync(target, "utf8") !== content) fs.writeFileSync(target, content);
  }
  console.log("Homepage recovery fragments match the canonical index.html.");
}
module.exports = { homeFragments };

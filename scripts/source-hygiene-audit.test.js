"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { linkedExecutableAssets, auditSourceHygiene, attribute } = require("./source-hygiene-audit");

function fixture(t, pages) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-source-clean-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [file, html] of Object.entries(pages)) {
    const absolute = path.join(root, file);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, html);
  }
  return root;
}

test("same local script with different version query is a duplicate", (t) => {
  const root = fixture(t, {
    "index.html": '<script defer src="js/cookie.js?v=123"></script><script src="/js/cookie.js?v=456"></script>'
  });
  assert.match(auditSourceHygiene(root).failures.join("\n"), /duplikált helyi script.*cookie\.js/);
});

test("nested pages resolve relative stylesheets and catch duplicate injections", (t) => {
  const root = fixture(t, {
    "kalkulatorok/sample.html": '<link rel="stylesheet" href="../css/main.css?v=1">\n<link href="/css/main.css?v=2" rel="stylesheet">'
  });
  assert.match(auditSourceHygiene(root).failures.join("\n"), /duplikált helyi stylesheet.*main\.css/);
});

test("legitimate preload, external scripts, inline scripts and HTML comments do not collide", (t) => {
  const root = fixture(t, {
    "index.html": [
      '<!-- <script src="js/site.js"></script> -->',
      '<link rel="preload" as="style" href="css/site.css?v=1">',
      '<link href="css/site.css?v=1" rel="stylesheet">',
      '<script src="js/site.js?v=1"></script>',
      '<script>window.inlined = true;</script>',
      '<script src="https://cdn.example.test/js/site.js"></script>',
      '<script data-src="js/site.js"></script>'
    ].join("\n")
  });
  assert.deepEqual(auditSourceHygiene(root).failures, []);
});

test("different local scripts or stylesheets and valid nested pages are accepted", (t) => {
  const root = fixture(t, {
    "index.html": '<script src="js/first.js"></script><script src="js/second.js"></script>',
    "kalkulatorok/test.html": '<script src="../js/first.js"></script><link rel="stylesheet" href="../css/site.css">'
  });
  assert.deepEqual(auditSourceHygiene(root).failures, []);
});

test("attribute extraction does not mistake data-src for src", () => {
  assert.equal(attribute('<script data-src="js/x.js">', "src"), null);
  assert.equal(attribute('<script data-src="js/x.js" src="js/y.js">', "src"), "js/y.js");
  assert.deepEqual(linkedExecutableAssets('<script data-src="js/x.js"></script>', "index.html"), []);
});

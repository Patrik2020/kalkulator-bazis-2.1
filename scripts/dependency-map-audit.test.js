"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { resolveLocal, attributes, dependencyMap } = require("./dependency-map-audit");

test("relative, root and extensionless URLs resolve; external URLs are ignored", () => {
  const names = new Set(["index.html", "aktualis.html", "css/style.css", "kalkulatorok/example.html"]);
  assert.equal(resolveLocal("kalkulatorok/example.html", "../css/style.css?v=12", names).target, "css/style.css");
  assert.equal(resolveLocal("index.html", "/aktualis", names).target, "aktualis.html");
  assert.equal(resolveLocal("index.html", "/", names).target, "index.html");
  assert.equal(resolveLocal("404.html", "./", names).target, "index.html");
  assert.equal(resolveLocal("index.html", "/aktualis/", names).target, "aktualis.html");
  assert.equal(resolveLocal("index.html", "https://example.com/test", names), null);
  assert.equal(resolveLocal("index.html", "js/" + "$" + "{module}.js", names).dynamic, true);
});

test("HTML attribute scanner recognizes quoted values", () => {
  assert.deepEqual(attributes('<link rel="stylesheet" href="../css/style.css?v=123">'), {
    rel: "stylesheet",
    href: "../css/style.css?v=123",
  });
});

test("missing runtime asset is candidate, never a deletion verdict", (t) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kb-deps-"));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const content = {
    "index.html": '<script src="./js/main.js"></script><link rel="stylesheet" href="/css/site.css"><a href="/aktualis">News</a><script src="./js/gone.js"></script>',
    "aktualis.html": "<h1>News</h1>",
    "js/main.js": 'const asset = "js/extra.js";',
    "js/extra.js": "console.log('extra');",
    "js/orphan.js": "console.log('not proven unused');",
    "css/site.css": '@import "./fragments.css"; body { background: url("../assets/bg.svg"); }',
    "css/fragments.css": "html { color: black; }",
    "assets/bg.svg": "<svg></svg>",
  };
  for (const [file, data] of Object.entries(content)) {
    fs.mkdirSync(path.dirname(path.join(tmp, file)), { recursive: true });
    fs.writeFileSync(path.join(tmp, file), data);
  }
  const result = dependencyMap(tmp, Object.keys(content));
  assert.equal(result.tracked, Object.keys(content).length);
  assert.ok(result.edgesByKind["html-script"] >= 2);
  assert.ok(result.unresolvedStrong.some((r) => r.target === "js/gone.js"));
  assert.ok(result.unreferencedCandidateSample.includes("js/orphan.js"));
  assert.match(result.limitation, /No deletion verdict/);
});

test("target lookup retains source identity and resolves homepage fragments at the host page", (t) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kb-deps-target-"));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const content = {
    "index.html": '<script src="js/main.js?v=abc"></script>',
    "fragments/home-redesign-v17-main.inc": '<script src="js/main.js"></script><a href="kalkulatorok/example">Example</a>',
    "fragments/other.inc": '<script src="../js/main.js"></script>',
    "js/main.js": "console.log('main');",
    "js/loader.js": 'const modulePath = "js/main.js";',
    "kalkulatorok/example.html": "<h1>Example</h1>",
  };
  for (const [file, data] of Object.entries(content)) {
    fs.mkdirSync(path.dirname(path.join(tmp, file)), { recursive: true });
    fs.writeFileSync(path.join(tmp, file), data);
  }
  const paths = Object.keys(content);
  const result = dependencyMap(tmp, paths, "js/main.js");
  assert.equal(result.target, "js/main.js");
  assert.equal(result.unresolvedStrong.length, 0);
  assert.equal(result.unresolvedOtherCount, 0);
  assert.deepEqual(result.targetReferences.map(({ source, kind }) => [source, kind]), [
    ["index.html", "html-script"],
    ["fragments/home-redesign-v17-main.inc", "html-script"],
    ["fragments/other.inc", "html-script"],
    ["js/loader.js", "js-path-hint"],
  ]);
  assert.match(result.targetLimitation, /not a complete runtime usage proof/);
  assert.equal(dependencyMap(tmp, paths, "js/loader.js").targetReferences.length, 0);
  assert.equal("targetReferences" in dependencyMap(tmp, paths), false);
  assert.throws(() => dependencyMap(tmp, paths, "js/missing.js"), /tracked repository-relative path/);
  const page = dependencyMap(tmp, paths, "kalkulatorok/example.html");
  assert.equal(page.targetReferences[0].source, "fragments/home-redesign-v17-main.inc");
  assert.equal(page.targetReferences[0].kind, "html-link");
});

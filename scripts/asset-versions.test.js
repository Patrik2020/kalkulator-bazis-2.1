const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { test } = require("node:test");
const { createAssetVersions } = require("./asset-versions");

function fixture(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-asset-versions-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (name, text) => {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text);
  };
  Object.entries(files).forEach(([name, text]) => write(name, text));
  return { root, write, read: (name) => fs.readFileSync(path.join(root, name), "utf8"), versions: createAssetVersions(root) };
}
const hash = (text) => crypto.createHash("sha256").update(text).digest("hex").slice(0, 12);

test("propagates a leaf CSS edit through imports, JS registry, HTML and SW in one pass", (t) => {
  const f = fixture(t, {
    "css/leaf.css": "body { color: red; }",
    "css/style.css": "@import url('./leaf.css?v=old') screen;",
    "js/config.js": "const styles = ['css/style.css?v=old'];",
    "index.html": '<script src="js/config.js?v=old"></script><link href="css/style.css?v=old" rel="stylesheet">',
    "sw.js": 'const KB_SW_VERSION = "old";',
  });
  f.versions.refresh();
  assert.deepEqual(f.versions.audit().failures, []);
  assert.equal(f.versions.refresh().changed, 0);
  const before = f.read("index.html"), swBefore = f.read("sw.js");
  f.write("css/leaf.css", "body { color: blue; }");
  assert.ok(f.versions.audit().failures.length > 0);
  f.versions.refresh();
  assert.notEqual(f.read("index.html"), before);
  assert.notEqual(f.read("sw.js"), swBefore);
  assert.deepEqual(f.versions.audit().failures, []);
  assert.equal(f.versions.refresh().changed, 0);
});

test("covers quoted/unquoted imports, HTML fragments, preload and escaped query parameters", (t) => {
  const f = fixture(t, {
    "css/leaf.css": "a {}",
    "css/style.css": '@import "./leaf.css" layer(base);\n@import url(./leaf.css?mode=a&v=old#paint) screen;',
    "fragments/header.inc": '<link rel="preload" as="style" href="../css/style.css?mode=a&amp;v=old#paint">',
  });
  f.versions.refresh();
  assert.ok(f.read("fragments/header.inc").includes('mode=a&amp;v='));
  assert.ok(f.read("fragments/header.inc").includes('#paint'));
  assert.ok(f.read("css/style.css").includes('layer(base)'));
  assert.deepEqual(f.versions.audit().failures, []);
});

test("does not rewrite external SDKs, comments, DOM selectors or a script's own root marker", (t) => {
  const original = [
    'const marker = "/js/app.js";',
    'const selector = \'script[src$="js/app.js"]\';',
    '// "js/missing.js"',
    'const external = "https://example.com/sdk.js?v=vendor";',
  ].join('\n');
  const f = fixture(t, { "js/app.js": original, "index.html": '<script src="js/app.js"></script><!-- <script src="missing.js"></script> -->' });
  f.versions.refresh();
  assert.equal(f.read("js/app.js"), original);
  assert.deepEqual(f.versions.audit().failures, []);
});

test("versions root template literals and document-relative runtime asset URLs", (t) => {
  const f = fixture(t, {
    "js/leaf.js": "const leaf = true;",
    "js/app.js": 'const a = `${base}/js/leaf.js?v=old`; const b = "../js/leaf.js";',
    "index.html": '<script src="js/app.js"></script>',
  });
  f.versions.refresh();
  assert.ok(f.read("js/app.js").includes('${base}/js/leaf.js?v=' + hash(f.read("js/leaf.js"))));
  assert.deepEqual(f.versions.audit().failures, []);
});

test("rejects a dependency cycle before changing any public source", (t) => {
  const f = fixture(t, { "css/a.css": '@import "./b.css";', "css/b.css": '@import "./a.css";' });
  assert.throws(() => f.versions.refresh(), /Circular asset dependency/);
  assert.equal(f.read("css/a.css"), '@import "./b.css";');
});

test("rejects missing assets and a path outside the project before writing", (t) => {
  const f = fixture(t, { "index.html": '<script src="js/missing.js"></script>' });
  assert.throws(() => f.versions.refresh(), /missing asset/);
  f.write("index.html", '<script src="../outside.js"></script>');
  assert.throws(() => f.versions.refresh(), /outside project/);
});

test("audit rejects well-shaped but stale hashes and duplicate version parameters", (t) => {
  const f = fixture(t, { "js/leaf.js": "const leaf = 1;", "index.html": '<script src="js/leaf.js?v=123456789abc&v=other"></script>' });
  assert.ok(f.versions.audit().failures.length > 0);
  f.versions.refresh();
  assert.deepEqual(f.versions.audit().failures, []);
  assert.equal((f.read("index.html").match(/v=/g) || []).length, 1);
  f.write("index.html", '<script src="js/leaf.js?v=123456789abc"></script>');
  assert.ok(f.versions.audit().failures.length > 0);
});

test("build/test-only edits do not invalidate the public deployment fingerprint", (t) => {
  const f = fixture(t, { "js/app.js": "const app = 1;", "index.html": '<script src="js/app.js"></script>', "sw.js": 'const KB_SW_VERSION = "old";' });
  f.versions.refresh();
  const version = f.read("sw.js");
  f.write("scripts/example.test.js", "const testOnly = 1;");
  assert.equal(f.versions.refresh().changed, 0);
  assert.equal(f.read("sw.js"), version);
});

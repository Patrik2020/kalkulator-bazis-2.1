"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { REQUIRED_RELEASE_FILES, serviceWorkerVersion, assertSameRelease, releaseManifest } = require("./release-identity");

test("service worker marker identifies an exact deployed source version", () => {
  const oldSource = 'const KB_SW_VERSION = "build-0123456789ab";';
  assert.equal(serviceWorkerVersion(oldSource), "build-0123456789ab");
  assert.equal(assertSameRelease({ expected: "build-0123456789ab", actual: oldSource }), true);
  assert.throws(() => assertSameRelease({ expected: "build-aaaaaaaaaaaa", actual: oldSource }), /differs/);
  assert.throws(() => serviceWorkerVersion("const KB_SW_VERSION = 'invalid';"), /Missing\/malformed/);
  assert.throws(() => assertSameRelease({ expected: "", actual: oldSource }), /Invalid expected/);
});

test("release manifest fingerprints exactly the required files and commit", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "kb-release-fixture-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const file of REQUIRED_RELEASE_FILES) {
    const dest = path.join(root, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, file === "sw.js"
      ? 'const KB_SW_VERSION = "build-0123456789ab";'
      : file + " content");
  }
  const sha = "a".repeat(40);
  const manifest = releaseManifest({ root, sha });
  assert.equal(manifest.sourceSha, sha);
  assert.equal(manifest.swVersion, "build-0123456789ab");
  assert.equal(Object.keys(manifest.files).length, REQUIRED_RELEASE_FILES.length);
  assert.match(manifest.files["index.html"], /^[0-9a-f]{64}$/);
  assert.throws(() => releaseManifest({ root, sha: "short" }), /40-character/);
  fs.rmSync(path.join(root, "CNAME"));
  assert.throws(() => releaseManifest({ root, sha }), /Missing release file: CNAME/);
});

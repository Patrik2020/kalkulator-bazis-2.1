"use strict";

// End-to-end restoration against an ephemeral HTTP staging site.
// Copies actual production-source assets; never writes to GitHub main or Pages.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { git } = require("./rollback-drill");
const { releaseManifest, REQUIRED_RELEASE_FILES, assertSameRelease } = require("./release-identity");

const sourceRoot = path.resolve(__dirname, "..");
const digest = (data) => crypto.createHash("sha256").update(data).digest("hex");
const localPaths = new Set(REQUIRED_RELEASE_FILES);

function publish(source, publicRoot) {
  for (const name of REQUIRED_RELEASE_FILES) {
    const file = path.join(publicRoot, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.copyFileSync(path.join(source, name), file);
  }
}

function stagingServer(publicRoot) {
  return http.createServer((request, response) => {
    if (request.method !== "GET") {
      response.writeHead(405);
      response.end();
      return;
    }
    let name;
    try {
      name = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname).replace(/^\/+/, "") || "index.html";
    } catch {
      response.writeHead(400);
      response.end();
      return;
    }
    if (!localPaths.has(name)) {
      response.writeHead(404);
      response.end();
      return;
    }
    fs.readFile(path.join(publicRoot, name), (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end();
        return;
      }
      response.writeHead(200, {
        "content-type": name.endsWith(".html") ? "text/html; charset=utf-8" :
          name.endsWith(".js") ? "text/javascript; charset=utf-8" : "text/plain; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(data);
    });
  });
}

async function auditPublishedRelease(baseUrl, goodManifest) {
  for (const [name, expected] of Object.entries(goodManifest.files)) {
    const route = name === "index.html" ? "/" : "/" + name;
    const response = await fetch(new URL(route, baseUrl));
    assert.equal(response.status, 200, "Missing staging resource: " + route);
    const content = Buffer.from(await response.arrayBuffer());
    assert.equal(digest(content), expected, "Staging fingerprint mismatch: " + name);
    if (name === "sw.js") {
      assertSameRelease({ expected: goodManifest.swVersion, actual: content.toString("utf8") });
    }
  }
  return Object.keys(goodManifest.files).length;
}

test("staging: publish good, detect broken, revert via branch, republish restored", async (t) => {
  const originalHead = git(sourceRoot, ["rev-parse", "HEAD"]);
  const originalState = git(sourceRoot, ["status", "--porcelain"]);

  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "kb-stage-rollback-e2e-"));
  const repo = path.join(sandbox, "isolated-git");
  const publicRoot = path.join(sandbox, "staging-public");
  fs.mkdirSync(repo, { recursive: true });
  fs.mkdirSync(publicRoot, { recursive: true });

  for (const name of REQUIRED_RELEASE_FILES) {
    const dest = path.join(repo, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(sourceRoot, name), dest);
  }

  git(repo, ["init", "-q", "--initial-branch=main"]);
  git(repo, ["config", "user.name", "Staging rollback test"]);
  git(repo, ["config", "user.email", "staging-qa@example.invalid"]);
  git(repo, ["add", "."]);
  git(repo, ["commit", "-qm", "Known-good staging release"]);
  const goodSha = git(repo, ["rev-parse", "HEAD"]);
  const knownGood = releaseManifest({ root: repo, sha: goodSha });

  const server = stagingServer(publicRoot);
  t.after(async () => {
    if (server.listening) {
      await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
    }
    fs.rmSync(sandbox, { recursive: true, force: true });
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const stageUrl = new URL("http://127.0.0.1:" + server.address().port + "/");

  // 1. Publish and probe a known-good version, over real HTTP.
  publish(repo, publicRoot);
  assert.equal(await auditPublishedRelease(stageUrl, knownGood), REQUIRED_RELEASE_FILES.length);

  // 2. Publish an intentionally corrupt version and prove the probe catches it.
  fs.writeFileSync(path.join(repo, "index.html"),
    "<!doctype html><html><body>SIMULATED BROKEN STAGING RELEASE</body></html>\n");
  const worker = fs.readFileSync(path.join(repo, "sw.js"), "utf8");
  fs.writeFileSync(path.join(repo, "sw.js"),
    worker.replace(/(const KB_SW_VERSION = ")[^"]+(";)/, "$1build-000000000000$2"));
  git(repo, ["add", "index.html", "sw.js"]);
  git(repo, ["commit", "-qm", "Intentionally broken staging release"]);
  const badSha = git(repo, ["rev-parse", "HEAD"]);
  assert.notEqual(badSha, goodSha);
  publish(repo, publicRoot);
  await assert.rejects(() => auditPublishedRelease(stageUrl, knownGood), /Staging fingerprint mismatch/);

  // 3. Prepare a real git revert commit on a new branch (a rollback PR analogue).
  git(repo, ["switch", "-q", "-c", "revert/staging-failure"]);
  git(repo, ["revert", "--no-edit", badSha]);
  const revertSha = git(repo, ["rev-parse", "HEAD"]);
  assert.notEqual(revertSha, badSha);
  assert.notEqual(revertSha, goodSha);
  assert.equal(git(repo, ["status", "--porcelain"]), "");
  const restored = releaseManifest({ root: repo, sha: revertSha });
  assert.deepEqual(restored.files, knownGood.files);
  assert.equal(restored.swVersion, knownGood.swVersion);

  // A reverted source is not enough: live staging stays broken until publication.
  await assert.rejects(() => auditPublishedRelease(stageUrl, knownGood), /Staging fingerprint mismatch/);

  // 4. Simulate approved fast-forward merge into the fixture's OWN main and redeploy.
  git(repo, ["switch", "-q", "main"]);
  assert.equal(git(repo, ["rev-parse", "HEAD"]), badSha);
  git(repo, ["merge", "--ff-only", "revert/staging-failure"]);
  assert.equal(git(repo, ["rev-parse", "HEAD"]), revertSha);
  publish(repo, publicRoot);
  assert.equal(await auditPublishedRelease(stageUrl, knownGood), REQUIRED_RELEASE_FILES.length);

  assert.equal(git(sourceRoot, ["rev-parse", "HEAD"]), originalHead);
  assert.equal(git(sourceRoot, ["status", "--porcelain"]), originalState);
  assert.equal(git(repo, ["status", "--porcelain"]), "");
  console.log("STAGING_ROLLBACK_E2E_PASS good=" + goodSha +
    " bad=" + badSha + " revert=" + revertSha +
    " files=" + REQUIRED_RELEASE_FILES.length + " http=127.0.0.1");
});

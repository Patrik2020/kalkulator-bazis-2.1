"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { pageChecks } = require("./production-smoke-audit");

const root = path.resolve(__dirname, "..");
const sourceByPublicPath = {
  "/": "index.html",
  "/kalkulatorok/atlag-kalkulator": "kalkulatorok/atlag-kalkulator.html",
  "/kalkulatorok/mertekegyseg-atvalto-kalkulator": "kalkulatorok/mertekegyseg-atvalto-kalkulator.html",
  "/kalkulatorok/netto-brutto-kalkulator": "kalkulatorok/netto-brutto-kalkulator.html",
  "/aktualis": "aktualis.html",
};

test("every required live marker is present in the canonical committed HTML", () => {
  assert.deepEqual(
    new Set(pageChecks.map((check) => check.path)),
    new Set(Object.keys(sourceByPublicPath)),
    "The monitoring page list must not silently shrink or add an untested route"
  );

  for (const check of pageChecks) {
    const sourcePath = sourceByPublicPath[check.path];
    assert.ok(sourcePath, `No canonical source mapped for ${check.path}`);
    const html = fs.readFileSync(path.join(root, sourcePath), "utf8");
    assert.ok(Array.isArray(check.markers) && check.markers.length > 0,
      `No required markers configured for ${check.path}`);
    for (const marker of check.markers) {
      assert.ok(html.includes(marker),
        `${check.path}: production marker is stale or absent from source: ${marker}`);
    }
    for (const forbidden of check.forbidden || []) {
      assert.doesNotMatch(html, forbidden,
        `${check.path}: known stale content pattern returned to committed source`);
    }
  }
});

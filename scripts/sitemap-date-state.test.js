"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { spawnSync } = require("node:child_process");
const { stableGeneratedAt, ISO_DAY } = require("./sitemap-date-state");

test("two days apart: unchanged content does NOT produce a new sitemap freshness date", () => {
  const first = stableGeneratedAt({ previous: "2026-10-19", contentChanged: false, today: "2026-10-21" });
  const next = stableGeneratedAt({ previous: first, contentChanged: false, today: "2026-10-22" });
  assert.equal(first, "2026-10-19");
  assert.equal(next, first);
  assert.equal(stableGeneratedAt({ previous: first, contentChanged: true, today: "2026-10-21" }), "2026-10-21");
});

test("bad dates are rejected or replaced without silently accepting garbage", () => {
  assert.equal(ISO_DAY.test("2026-10-21"), true);
  assert.equal(ISO_DAY.test("x2026-10-21"), false);
  assert.equal(ISO_DAY.test("2026-10-21x"), false);
  assert.equal(stableGeneratedAt({ previous: "unparseable", contentChanged: false, today: "2026-10-21" }), "2026-10-21");
  assert.throws(() => stableGeneratedAt({ previous: "2026-10-19", contentChanged: false, today: "10/21/2026" }), /Invalid build/);
});

test("UTC day key is stable across Budapest and America/Los_Angeles process timezones", () => {
  const instant = "2026-10-21T23:30:00.000Z";
  const dates = ["Europe/Budapest", "America/Los_Angeles", "UTC"].map((tz) => {
    const result = spawnSync(process.execPath, ["-e", "console.log(new Date(process.argv[1]).toISOString().slice(0,10))", instant], {
      encoding: "utf8", env: { ...process.env, TZ: tz }
    });
    assert.equal(result.status, 0);
    return result.stdout.trim();
  });
  assert.deepEqual(dates, ["2026-10-21", "2026-10-21", "2026-10-21"]);
});

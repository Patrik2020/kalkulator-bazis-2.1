"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const api = require("../js/shared-ui-locale");

test("shared component text and accessible labels have reviewed EN/DE translations", () => {
  const unchanged = new Set(["Kalkulátor Bázis", "Facebook", "f", "⌄", "☾", "☰", "kalkulatorbazis@gmail.com", "© 2026 Kalkulátor Bázis"]);
  for (const file of ["header.html", "footer.html"]) {
    const html = fs.readFileSync(path.join(__dirname, "../components", file), "utf8");
    const strings = [...html.matchAll(/>([^<>]+)</g), ...html.matchAll(/(?:aria-label|title|placeholder)="([^"]+)"/g)]
      .map((match) => match[1].replaceAll("&amp;", "&").replace(/\s+/g, " ").trim())
      .filter((text) => text && !unchanged.has(text));
    for (const text of strings) {
      assert.ok(api.translate(text, "en"), file + ": " + text);
      assert.ok(api.translate(text, "de"), file + ": " + text);
    }
  }
});

test("formatting whitespace is normalized while values and unknown text remain untouched", () => {
  assert.equal(api.translate("\n  Mindet elfogadom \n", "en"), "\n  Accept all \n");
  assert.equal(api.translate("A Google Analytics segítségével anonim látogatottsági képet kapunk\n arról, mely oldalak és kalkulátorok hasznosak.", "de"), api.dictionary["A Google Analytics segítségével anonim látogatottsági képet kapunk arról, mely oldalak és kalkulátorok hasznosak."][1]);
  for (const text of ["654 321 Ft", "custom input", "ismeretlen szöveg"]) assert.equal(api.translate(text, "en"), null);
  assert.equal(api.translate("Mindet elfogadom", "hu"), null);
  assert.equal(api.translate("Mindet elfogadom", "fr"), null);
});

test("all shared translations are complete reviewed pairs", () => {
  for (const [source, pair] of Object.entries(api.dictionary)) {
    assert.equal(pair.length, 2, source);
    assert.ok(pair.every((text) => typeof text === "string" && text.trim()), source);
    assert.equal(api.translate(source, "en"), pair[0]);
    assert.equal(api.translate(source, "de"), pair[1]);
  }
});

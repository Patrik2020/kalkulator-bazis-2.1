"use strict";
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/penzugyi/credit-locale");

test("browser metadata and schema switch EN/DE and restore the original HU source", () => {
  const title = { tagName: "TITLE", textContent: "Hitelképesség kalkulátor | Jövedelmi teherbírás" };
  const source = JSON.stringify({ name: title.textContent, inLanguage: "hu-HU", url: "https://kalkulatorbazis.hu/unchanged" });
  const schema = { tagName: "SCRIPT", textContent: source };
  const listeners = {};
  const main = { classList: { contains: () => false }, querySelectorAll: () => [] };
  const document = { readyState: "complete", querySelector: () => main, querySelectorAll: () => [title, schema], createTreeWalker: () => ({ nextNode: () => false }), addEventListener: (name, fn) => { listeners[name] = fn; } };
  vm.runInNewContext(fs.readFileSync(require.resolve("../js/penzugyi/credit-locale"), "utf8"), { window: { document, location: { search: "" } }, URLSearchParams, NodeFilter: { SHOW_TEXT: 4 }, MutationObserver: class { observe() {} disconnect() {} } });
  for (const language of ["en", "de"]) {
    listeners["kb:language-changed"]({ detail: { language } });
    assert.equal(title.textContent, api.translate("hitelkepesseg-kalkulator", "Hitelképesség kalkulátor | Jövedelmi teherbírás", language));
    assert.equal(JSON.parse(schema.textContent).inLanguage, language);
    assert.equal(JSON.parse(schema.textContent).url, "https://kalkulatorbazis.hu/unchanged");
  }
  listeners["kb:language-changed"]({ detail: { language: "hu" } });
  assert.equal(schema.textContent, source);
  assert.equal(title.textContent, "Hitelképesség kalkulátor | Jövedelmi teherbírás");
});

test("loan repayment wording, APR handling and values are localized", () => {
  const page = "hitel-torleszto-kalkulator";
  assert.equal(api.translate(page, "Hitel törlesztő kalkulátor", "en"), "Loan repayment calculator");
  assert.equal(api.translate(page, "Hitel törlesztő kalkulátor | Havi részlet és teljes visszafizetés", "en"), "Loan Repayment Calculator | Monthly Payment and Total Repayment");
  assert.equal(api.translate(page, "Hitel törlesztő kalkulátor havi részlet, teljes visszafizetés és kamatteher becsléséhez. Hasonlíts össze hitelösszeget, kamatot, THM-et és futamidőt.", "de"), "Kreditratenrechner zur Schätzung von Monatsrate, Gesamtrückzahlung und Zinskosten. Vergleiche Kreditbetrag, Zinssatz, effektiven Jahreszins und Laufzeit.");
  assert.equal(api.translate(page, "THM (%)", "de"), "Effektiver Jahreszins (%)");
  assert.equal(api.translate(page, "pl. 5 000 000", "en"), "e.g. 5 000 000");
  assert.equal(api.translate(page, "A havi törlesztő: 149 115 Ft", "en"), "Monthly payment: 149 115 HUF");
  assert.equal(api.translate(page, "A. ajánlat", "de"), "Angebot A");
});

test("borrowing capacity guidance and dynamic terms are localized", () => {
  const page = "hitelkepesseg-kalkulator";
  assert.equal(api.translate(page, "JTM-alapú hitelteherbírás és kamatstressz", "en"), "Debt service capacity and interest-rate stress test");
  assert.equal(api.translate(page, "5–10 év", "de"), "5–10 Jahre");
  assert.match(api.translate(page, "A bank által elfogadható, igazolt nettó jövedelem.", "en"), /Verified net income/u);
  assert.equal(api.translate(page, "not a source phrase", "en"), null);
});

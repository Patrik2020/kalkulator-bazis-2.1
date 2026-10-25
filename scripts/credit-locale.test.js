"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/penzugyi/credit-locale");

test("loan repayment wording, APR handling and values are localized", () => {
  const page = "hitel-torleszto-kalkulator";
  assert.equal(api.translate(page, "Hitel törlesztő kalkulátor", "en"), "Loan repayment calculator");
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

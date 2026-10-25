"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const api = require("../js/penzugyi/mortgage-tools-locale");

test("mortgage down-payment guidance and calculator copy is translated", () => {
  const page = "lakas-hitel-onero-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "Lakáshitel önerő kalkulátor", "en"), "Mortgage down payment calculator");
  assert.equal(api.translate(page, "Banki forgalmi érték", "de"), "Von der Bank ermittelter Marktwert");
  assert.match(api.translate(page, "A HFM a bank által hitelbírálatkor megállapított forgalmi értékhez kötődik. Ha ez alacsonyabb a vételárnál, a szükséges saját pénz magasabb lehet, mint egy egyszerű 10% vagy 20%-os számítás.", "en"), /LTV limit is based/u);
  assert.equal(api.translate(page, "Finanszírozandó összeg: 32 000 000 Ft", "en"), "Amount to finance: 32 000 000 HUF");
  assert.equal(api.translate(page, "32 000 000 Ft hitel", "de"), "32 000 000 HUF Kredit");
  assert.equal(api.translate(page, "Az önerő aránya legfeljebb 100% lehet.", "de"), "Der Eigenkapitalanteil darf höchstens 100 % betragen.");
});

test("early repayment results, validation and terminology are translated", () => {
  const page = "hitel-elotorlesztes-kalkulator";
  assert.ok(api.pages.includes(page));
  assert.equal(api.translate(page, "Hitel előtörlesztés kalkulátor", "en"), "Early loan repayment calculator");
  assert.equal(api.translate(page, "Fennálló tőketartozás (Ft)", "en"), "Outstanding principal (HUF)");
  assert.equal(api.translate(page, "Becsült nettó megtakarítás: 705 151 Ft", "en"), "Estimated net savings: 705 151 HUF");
  assert.equal(api.translate(page, "A futamidő egész hónap legyen.", "de"), "Die Laufzeit muss in ganzen Monaten angegeben werden.");
  assert.equal(api.translate(page, "Az előtörlesztés nem lehet nagyobb a fennálló tőkénél.", "en"), "The early repayment cannot exceed the outstanding principal.");
  assert.equal(api.translate(page, "2026. augusztus 21.", "en"), "August 21, 2026");
  assert.equal(api.translate(page, "not a source phrase", "en"), null);
});

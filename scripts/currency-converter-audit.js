#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "js", "atvaltok", "deviza.js");
const source = fs.readFileSync(sourcePath, "utf8");
const cacheKey = "kb-currency-rates-v2";
const currencies = [
  "HUF", "EUR", "USD", "GBP", "CHF", "PLN", "CZK", "RON",
  "SEK", "NOK", "DKK", "JPY", "CAD", "AUD", "CNY",
];

class FakeElement {
  constructor({ value = "", options = [] } = {}) {
    this.value = value;
    this.options = options.map((optionValue) => ({ value: optionValue }));
    this.textContent = "";
    this.hidden = false;
    this.disabled = false;
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  dispatch(type) {
    (this.listeners.get(type) || []).forEach((listener) => listener({ type, target: this }));
  }
}

const makeRates = (huf = 400) => Object.fromEntries(
  currencies
    .filter((code) => code !== "EUR")
    .map((code, index) => [code, code === "HUF" ? huf : index + 1.25])
);

const makeRateRows = (rates, date = "2026-09-30") => Object.entries(rates).map(([quote, rate]) => ({
  date,
  base: "EUR",
  quote,
  rate,
}));

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
});

const textResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => JSON.parse(body),
  text: async () => body,
});

const createHarness = async ({ fetchImplementation, initialStorage = {} }) => {
  const elements = {
    inputValue: new FakeElement(),
    fromCurrency: new FakeElement({ value: "HUF", options: currencies }),
    toCurrency: new FakeElement({ value: "EUR", options: currencies }),
    result: new FakeElement(),
    lastUpdate: new FakeElement(),
    rateSource: new FakeElement(),
    retryRates: new FakeElement(),
  };
  const storage = new Map(Object.entries(initialStorage));
  const warnings = [];

  const sandbox = {
    AbortController,
    clearTimeout,
    console: { warn: (...items) => warnings.push(items.join(" ")) },
    document: { getElementById: (id) => elements[id] || null },
    fetch: fetchImplementation,
    Intl,
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    navigator: { onLine: true },
    setTimeout,
    window: {},
  };

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: sourcePath });
  await sandbox.window.KB_CURRENCY_CONVERTER.ready;

  return { elements, storage, warnings, converter: sandbox.window.KB_CURRENCY_CONVERTER };
};

const setAmount = (elements, amount) => {
  elements.inputValue.value = String(amount);
  elements.inputValue.dispatch("input");
};

const ecbCsv = (rates, date = "2026-07-02") => [
  "CURRENCY,TIME_PERIOD,OBS_VALUE",
  ...Object.entries(rates).map(([code, rate]) => `${code},${date},${rate}`),
].join("\n");

async function main() {
  let calls = [];
  const apiRates = makeRates(400);
  const primary = await createHarness({
    fetchImplementation: async (url) => {
      calls.push(url);
      return jsonResponse({
        data: makeRateRows(apiRates),
        meta: { source: "Frankfurter v2", provider: "blended" },
      });
    },
  });
  setAmount(primary.elements, 400);
  assert.equal(primary.elements.result.textContent, "400 HUF = 1 EUR");
  assert.match(calls[0], /kalkulator-bazis-currency-api\.onrender\.com\/api\/v1\/rates/);
  assert.equal(primary.elements.rateSource.textContent, "Kalkulátor Bázis API · Frankfurter");
  assert.equal(primary.elements.retryRates.hidden, true);
  assert.ok(primary.storage.has(cacheKey), "A sikeres választ helyben menteni kell.");

  calls = [];
  const frankfurterRates = makeRates(401);
  const frankfurterFallback = await createHarness({
    fetchImplementation: async (url) => {
      calls.push(url);
      if (url.includes("kalkulator-bazis-currency-api.onrender.com")) return jsonResponse({}, 503);
      if (url.includes("api.frankfurter.dev/v2/rates")) {
        return jsonResponse(makeRateRows(frankfurterRates, "2026-07-01"));
      }
      throw new Error("A harmadik forrást már nem szabad lekérni.");
    },
  });
  setAmount(frankfurterFallback.elements, 401);
  assert.equal(frankfurterFallback.elements.result.textContent, "401 HUF = 1 EUR");
  assert.equal(frankfurterFallback.elements.rateSource.textContent, "Frankfurter");
  assert.equal(calls.length, 2);

  calls = [];
  const ecbRates = makeRates(402);
  const ecbFallback = await createHarness({
    fetchImplementation: async (url) => {
      calls.push(url);
      if (url.includes("data-api.ecb.europa.eu")) return textResponse(ecbCsv(ecbRates));
      return jsonResponse({}, 503);
    },
  });
  setAmount(ecbFallback.elements, 402);
  assert.equal(ecbFallback.elements.result.textContent, "402 HUF = 1 EUR");
  assert.equal(ecbFallback.elements.rateSource.textContent, "Európai Központi Bank");
  assert.equal(calls.length, 3);

  const cachedRates = makeRates(403);
  const cachedFallback = await createHarness({
    fetchImplementation: async () => {
      throw new TypeError("Hálózati hiba");
    },
    initialStorage: {
      [cacheKey]: JSON.stringify({
        version: 1,
        rates: { EUR: 1, ...cachedRates },
        date: "2026-07-04",
        source: "Kalkulátor Bázis API · Frankfurter",
        savedAt: Date.now(),
      }),
    },
  });
  setAmount(cachedFallback.elements, 403);
  assert.equal(cachedFallback.elements.result.textContent, "403 HUF = 1 EUR");
  assert.match(cachedFallback.elements.rateSource.textContent, /mentett adat/);
  assert.equal(cachedFallback.elements.retryRates.hidden, false);
  assert.equal(cachedFallback.elements.retryRates.disabled, false);

  const unavailable = await createHarness({
    fetchImplementation: async () => {
      throw new TypeError("Hálózati hiba");
    },
  });
  assert.match(unavailable.elements.result.textContent, /Nem sikerült betölteni/);
  assert.equal(unavailable.elements.retryRates.hidden, false);

  console.log("Currency converter tests: 5/5 passed");
}

main().catch((error) => {
  console.error(`Currency converter test failed: ${error.stack || error.message}`);
  process.exit(1);
});

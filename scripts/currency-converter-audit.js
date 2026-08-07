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
  const v2Rates = makeRates(400);
  const primary = await createHarness({
    fetchImplementation: async (url) => {
      calls.push(url);
      return jsonResponse(Object.entries(v2Rates).map(([quote, rate]) => ({
        date: "2026-07-01",
        base: "EUR",
        quote,
        rate,
      })));
    },
  });
  setAmount(primary.elements, 400);
  assert.equal(primary.elements.result.textContent, "400 HUF = 1 EUR");
  assert.match(calls[0], /api\.frankfurter\.dev\/v2\/rates/);
  assert.equal(primary.elements.rateSource.textContent, "Frankfurter");
  assert.equal(primary.elements.retryRates.hidden, true);
  assert.ok(primary.storage.has(cacheKey), "A sikeres választ helyben menteni kell.");

  calls = [];
  const ecbRates = makeRates(401);
  const ecbFallback = await createHarness({
    fetchImplementation: async (url) => {
      calls.push(url);
      if (url.includes("/v2/rates")) return jsonResponse({}, 503);
      if (url.includes("data-api.ecb.europa.eu")) return textResponse(ecbCsv(ecbRates));
      throw new Error("A harmadik forrást már nem szabad lekérni.");
    },
  });
  setAmount(ecbFallback.elements, 401);
  assert.equal(ecbFallback.elements.result.textContent, "401 HUF = 1 EUR");
  assert.equal(ecbFallback.elements.rateSource.textContent, "Európai Központi Bank");
  assert.equal(calls.length, 2);

  calls = [];
  const v1Rates = makeRates(402);
  const v1Fallback = await createHarness({
    fetchImplementation: async (url) => {
      calls.push(url);
      if (url.includes("/v1/latest")) {
        return jsonResponse({ base: "EUR", date: "2026-07-03", rates: v1Rates });
      }
      return jsonResponse({}, 503);
    },
  });
  setAmount(v1Fallback.elements, 402);
  assert.equal(v1Fallback.elements.result.textContent, "402 HUF = 1 EUR");
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
        source: "Európai Központi Bank",
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

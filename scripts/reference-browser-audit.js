const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { browserReferencePages } = require("./reference-test-manifest");
const { publicPathToSourceFile, sourceFileToPublicPath } = require("./url-paths");

const root = path.resolve(__dirname, "..");
const chromeCandidates = [
  process.env.CHROME_PATH,
  process.env.CHROME_BIN,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));

if (!chrome) {
  throw new Error("Nem található Chrome/Chromium a kötelező böngészős referencia-audithoz.");
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const pathname = decodeURIComponent(url.pathname);
  const requested = path.extname(pathname) ? pathname : `/${publicPathToSourceFile(pathname)}`;
  const file = path.resolve(root, requested.replace(/^\/+/, ""));

  if (!file.startsWith(`${root}${path.sep}`) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": contentTypes[path.extname(file).toLowerCase()] || "application/octet-stream",
  });
  response.end(fs.readFileSync(file));
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function createClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const listeners = new Map();
  let id = 0;

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const task = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) task.reject(new Error(message.error.message));
      else task.resolve(message.result);
      return;
    }
    (listeners.get(message.method) || []).forEach((listener) => listener(message.params));
  });

  return {
    on(method, listener) {
      if (!listeners.has(method)) listeners.set(method, []);
      listeners.get(method).push(listener);
    },
    send(method, params = {}) {
      id += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

// String.raw preserves the backslashes in the regular expressions that are
// evaluated inside the browser. A normal template literal would turn `\d`
// and `\s` into plain `d`/`s` characters before CDP receives the source.
const helpers = String.raw`
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const waitFor = async (predicate, timeout = 3000, interval = 25) => {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (predicate()) return true;
      await delay(interval);
    }
    return Boolean(predicate());
  };
  const element = (selector) => document.querySelector(selector);
  const set = (id, value) => {
    const target = document.getElementById(id);
    if (!target) throw new Error('Hiányzó mező: ' + id);
    target.value = String(value);
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return target;
  };
  const checked = (id, value) => {
    const target = document.getElementById(id);
    if (!target) throw new Error('Hiányzó kapcsoló: ' + id);
    target.checked = Boolean(value);
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return target;
  };
  const choose = (selector) => {
    const target = document.querySelector(selector);
    if (!target) throw new Error('Hiányzó választó: ' + selector);
    target.checked = true;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    return target;
  };
  const clean = (value) => String(value ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const text = (selector) => clean(element(selector)?.textContent || '');
  const numberFromText = (value) => {
    const match = clean(value).match(/-?\d[\d .]*(?:,\d+)?/);
    if (!match) return NaN;
    const compact = match[0].replace(/\s/g, '');
    return Number(compact.includes(',') ? compact.replace(/\./g, '').replace(',', '.') : compact);
  };
  const number = (selector) => numberFromText(text(selector));
  const afterEquals = (selector) => numberFromText(text(selector).split('=').at(-1));
  const row = (label) => {
    const term = [...document.querySelectorAll('.ac-result dt')].find((item) => clean(item.textContent) === label);
    return clean(term?.nextElementSibling?.textContent || '');
  };
  const noInvalidNumber = () => !/NaN|Infinity/.test(document.querySelector('.card-calculator')?.innerText || '');
`;

const test = (page, name, body) => ({ page, name, expression: `(async () => {${helpers}${body}})()` });

const cases = [
  test("kalkulatorok/adatmeret-atvalto-kalkulator.html", "Adatméret átváltó", `
    const ready = await waitFor(() => window.KB_AUTO_CONVERTER_UPGRADE_READY === 'adatmeret-atvalto-kalkulator');
    set('value', 1); set('unit', 'GiB'); document.querySelector('.ac-submit').click(); await delay(40);
    const actual = numberFromText(row('Byte'));
    const valid = ready && actual === 1073741824;
    set('value', 0); document.querySelector('.ac-submit').click();
    const boundary = numberFromText(row('Byte')) === 0;
    set('value', ''); document.querySelector('.ac-submit').click();
    const invalid = !document.getElementById('value').checkValidity() && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/afa-kalkulator.html", "ÁFA", `
    choose('input[name="mode"][value="netto"]'); set('amount', 10000); set('vat', 27);
    const actual = number('#result-value strong');
    const valid = actual === 12700;
    set('vat', 0); const boundary = number('#result-value strong') === 10000;
    set('amount', 0); const invalid = /érvényes összeget/.test(text('#result-value')) && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/auto-kalkulator.html", "Autós kalkulátor", `
    set('distance', 650); set('fuelUsed', 42);
    const actual = number('#result-consumption');
    const valid = Math.abs(actual - 6.46) < 0.001;
    set('tankSize', 50); set('consumption-range', 5);
    const boundary = number('#result-range') === 1000;
    set('distance', 0); const invalid = text('#result-consumption') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/beton-kalkulator.html", "Beton", `
    set('length', 10); set('width', 5); set('depth', 20);
    const actual = number('#result-volume'); const valid = actual === 10;
    set('depth', 0); const boundary = text('#result-volume') === '–';
    set('length', ''); const invalid = text('#result-volume') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/bmi-kalkulator.html", "BMI", `
    set('weight', 75); set('height', 175);
    const actual = number('#result-bmi');
    const valid = actual === 24.5 && /normál/i.test(text('#result-category'));
    set('weight', 0); const boundary = text('#result-bmi') === '–';
    set('height', ''); const invalid = text('#result-bmi') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/csempe-kalkulator.html", "Csempe", `
    checked('calculateWalls', false); checked('calculateFloor', true);
    set('roomLength', 5); set('roomWidth', 4); set('wastePercent', 10);
    set('floorTileWidth', 50); set('floorTileHeight', 50);
    const actual = number('#floorTileCount'); const valid = actual === 88;
    set('wastePercent', 5); const boundary = number('#floorTileCount') === 84;
    set('roomLength', 0); const invalid = text('#floorTileCount') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/etf-kalkulator.html", "ETF", `
    set('initial', 0); set('monthly', 50000); set('rate', 6); set('years', 20);
    set('ter', 0); set('inflation', 0); set('increase', 0); await delay(280);
    const actual = number('#result-final'); const valid = Math.abs(actual - 22671932) <= 5;
    const boundary = number('#result-invested') === 12000000;
    set('monthly', -100); set('rate', 999); set('years', 0); await delay(180);
    const invalid = document.querySelectorAll('.field-error:not(:empty)').length > 0 && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/festek-kalkulator.html", "Festék", `
    set('roomLength', 5); set('roomWidth', 4); set('roomHeight', 2.5);
    set('windowArea', 0); set('doorArea', 0); set('layers', 2); set('coverage', 10); set('paintPrice', 4000);
    checked('paintCeiling', false);
    const actual = number('#paintCost'); const valid = actual === 39600;
    set('paintPrice', 0); const boundary = /nincs megadva/i.test(text('#paintCost'));
    set('roomLength', 0); const invalid = text('#totalArea') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/fizetesi-hatarido-kalkulator.html", "Fizetési határidő", `
    choose('input[name="mode"][value="workdays"]'); set('startDate', '2025-12-31'); set('days', 1);
    const actual = text('#result-date'); const valid = /2026\. 01\. 05\./.test(actual);
    choose('input[name="mode"][value="calendar"]'); set('days', 0);
    const boundary = /2025\. 12\. 31\./.test(text('#result-date'));
    set('days', -1); const invalid = text('#result-date') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/havi-koltsegvetes-kalkulator.html", "Havi költségvetés", `
    set('income', 500000); set('housing', 150000); set('utilities', 50000); set('food', 80000);
    set('transport', 30000); set('debt', 20000); set('other', 20000); set('savings', 100000);
    const actual = number('#balanceResult');
    const valid = actual === 50000 && number('#savingsRateResult') === 20;
    set('savings', 0); const boundary = number('#balanceResult') === 150000;
    set('income', 0); const invalid = text('#balanceResult') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/hitel-torleszto-kalkulator.html", "Hiteltörlesztő", `
    checked('use-thm', false); set('amount', 1200000); set('rate', 0); set('years', 1);
    const actual = number('#result-monthly'); const valid = actual === 100000;
    const boundary = number('#result-interest') === 0;
    set('amount', 0); const invalid = text('#result-monthly') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/hitelkepesseg-kalkulator.html", "Hitelképesség", `
    set('income', 500000); set('existing', 0); set('rate', 0); set('years', 1);
    const actual = number('#result-loan');
    const valid = actual === 2400000 && number('#result-monthly') === 200000;
    set('existing', 200000); const boundary = number('#result-monthly') === 0;
    set('income', 0); const invalid = text('#result-monthly') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/homerseklet-atvalto-kalkulator.html", "Hőmérséklet átváltó", `
    set('cfInput', 0); const actual = afterEquals('#cfResult'); const valid = actual === 32;
    set('cfInput', -273.15); const boundary = Math.abs(afterEquals('#cfResult') + 459.67) < 0.001;
    set('cfInput', -274); const invalid = /abszolút nulla/.test(text('#cfResult')) && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/hosszusag-atvalto-kalkulator.html", "Hosszúság átváltó", `
    set('fromUnit', 'km'); set('toUnit', 'm'); set('inputValue', 1);
    const actual = afterEquals('#result'); const valid = actual === 1000;
    set('inputValue', 0); const boundary = afterEquals('#result') === 0;
    set('inputValue', ''); const invalid = text('#result') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/ido-atvalto-kalkulator.html", "Idő átváltó", `
    set('fromUnit', 'day'); set('toUnit', 'hour'); set('inputValue', 1);
    const actual = afterEquals('#result'); const valid = actual === 24;
    set('inputValue', 0); const boundary = afterEquals('#result') === 0;
    set('inputValue', ''); const invalid = text('#result') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/inflacio-kalkulator.html", "Infláció", `
    set('amount', 100000); set('rate', 10); set('years', 1);
    const actual = number('#result-final'); const valid = actual === 90909;
    set('years', 0); const boundary = number('#result-final') === 100000;
    set('rate', -100); const invalid = text('#result-final') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/kaloria-kalkulator.html", "Kalória", `
    set('gender', 'male'); set('weight', 80); set('height', 180); set('age', 40); set('activity', 1.2);
    const actual = number('#result-calories'); const valid = actual === 2076;
    set('age', 1); const boundary = number('#result-calories') === 2310;
    set('age', 0); const invalid = text('#result-calories') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/kamatos-kamat-kalkulator.html", "Kamatos kamat", `
    set('initial', 100000); set('monthly', 0); set('rate', 12); set('years', 1);
    const actual = number('#result-final'); const valid = actual === 112000;
    set('rate', 0); const boundary = number('#result-final') === 100000;
    set('initial', 0); set('monthly', 0); const invalid = text('#result-final') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/lakas-hitel-onero-kalkulator.html", "Lakáshitel önerő", `
    set('price', 50000000); set('percent', 20);
    const actual = number('#result-down'); const valid = actual === 10000000;
    set('percent', 0); const boundary = number('#result-down') === 0 && number('#result-loan') === 50000000;
    set('percent', 101); const invalid = text('#result-down') === '–' && /legfeljebb 100/.test(text('#result-loan'));
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/milliomos-kalkulator.html", "Milliomos", `
    set('initial', 0); set('monthly', 100000); set('rate', 0); set('goal', 1000000);
    const actual = text('#result-time'); const valid = actual === '0 év 10 hónap';
    set('initial', 1000000); const boundary = /cél már teljesült/i.test(text('#result-time'));
    set('initial', 0); set('monthly', 0); set('rate', 0);
    const invalid = /nem érhető el/i.test(text('#result-time')) && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/netto-brutto-kalkulator.html", "Nettó–bruttó API-kliens", `
    choose('input[name="calc-type"][value="gross-to-net"]'); set('gross', 500000); await delay(720);
    const actual = number('#result-net');
    const valid = actual === 332500 && window.__salaryRequests?.at(-1)?.body?.gross === 500000;
    checked('under25', true); await delay(720);
    const boundary = number('#result-net') === 407500;
    set('family-dependants', 0); set('family-eligible', 1); await delay(360);
    const invalid = /nem lehet nagyobb/.test(text('#result-diff')) && /API-hiba/.test(text('#result-net'));
    return { valid, boundary, invalid, actual, requestCount: window.__salaryRequests?.length || 0 };
  `),
  test("kalkulatorok/osztalek-kalkulator.html", "Osztalék", `
    choose('input[name="dividendMode"][value="income"]'); choose('input[name="taxMode"][value="simple"]');
    set('incomeAmount', 3000000); set('dividendYield', 4); set('simpleDeduction', 15); set('fixedCost', 0); set('payoutFrequency', 4);
    await delay(980); const actual = number('#result-primary'); const valid = actual === 102000;
    const boundary = [...document.querySelectorAll('.dividend-result-card')].some((card) => /havi nettó átlag/i.test(card.textContent) && numberFromText(card.textContent) === 8500);
    set('dividendYield', -1); await delay(380);
    const invalid = /0% és 100% között/.test(text('#dividendYield-error')) && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/sebesseg-atvalto-kalkulator.html", "Sebesség átváltó", `
    set('fromUnit', 'kmh'); set('toUnit', 'ms'); set('inputValue', 100);
    const actual = afterEquals('#result'); const valid = Math.abs(actual - 27.7777777778) < 1e-9;
    set('inputValue', 0); const boundary = afterEquals('#result') === 0;
    set('inputValue', ''); const invalid = text('#result') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/szamla-teljesites-kalkulator.html", "Számla teljesítés", `
    set('issueDate', '2026-06-01'); set('performanceDate', '2026-06-01'); set('days', 30);
    const actual = text('#result-deadline'); const valid = /2026\. 07\. 01\./.test(actual);
    set('days', 0); const boundary = /2026\. 06\. 01\./.test(text('#result-deadline'));
    set('days', -1); const invalid = text('#result-deadline') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/szazalek-kalkulator.html", "Százalék", `
    set('a', 200); set('b', 10); const actual = number('#result1'); const valid = actual === 20;
    set('b', 0); const boundary = number('#result1') === 0;
    set('a', ''); const invalid = text('#result1') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/tegla-kalkulator.html", "Tégla", `
    set('brickType', 'porotherm10'); set('wallLength', 10); set('wallHeight', 2.5);
    set('windowArea', 0); set('doorArea', 0); set('wastePercent', 0); set('brickPrice', 0);
    const actual = number('#recommendedBrickCountResult'); const valid = actual === 200;
    set('windowArea', 25); const boundary = number('#recommendedBrickCountResult') === 0;
    set('wallLength', 0); const invalid = text('#recommendedBrickCountResult') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/terfogat-atvalto-kalkulator.html", "Térfogat átváltó", `
    set('fromUnit', 'm3'); set('toUnit', 'l'); set('inputValue', 1);
    const actual = afterEquals('#result'); const valid = actual === 1000;
    set('inputValue', 0); const boundary = afterEquals('#result') === 0;
    set('inputValue', ''); const invalid = text('#result') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/terulet-atvalto-kalkulator.html", "Terület átváltó", `
    set('fromUnit', 'ha'); set('toUnit', 'm2'); set('inputValue', 1);
    const actual = afterEquals('#result'); const valid = actual === 10000;
    set('inputValue', 0); const boundary = afterEquals('#result') === 0;
    set('inputValue', ''); const invalid = text('#result') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
  test("kalkulatorok/tomeg-atvalto-kalkulator.html", "Tömeg átváltó", `
    set('fromUnit', 'kg'); set('toUnit', 'g'); set('inputValue', 1);
    const actual = afterEquals('#result'); const valid = actual === 1000;
    set('inputValue', 0); const boundary = afterEquals('#result') === 0;
    set('inputValue', ''); const invalid = text('#result') === '–' && noInvalidNumber();
    return { valid, boundary, invalid, actual };
  `),
];

async function main() {
  const casePages = cases.map((item) => item.page).sort();
  const manifestPages = [...browserReferencePages].sort();
  if (JSON.stringify(casePages) !== JSON.stringify(manifestPages)) {
    throw new Error("A böngészős referenciaesetek és a tesztmanifest URL-halmaza eltér.");
  }

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const cdpPort = 10000 + Math.floor(Math.random() * 20000);
  const profile = path.join(os.tmpdir(), `kb-reference-browser-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const browser = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-gpu",
      "--no-first-run",
      ...(typeof process.getuid === "function" && process.getuid() === 0 ? ["--no-sandbox"] : []),
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true }
  );

  let client;
  try {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
        if (response.ok) break;
      } catch (error) {
        // A böngésző még indul.
      }
      if (attempt === 99) throw new Error("A headless böngésző nem indult el időben.");
      await sleep(100);
    }

    const targetResponse = await fetch(
      `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${origin}/`)}`,
      { method: "PUT" }
    );
    const target = await targetResponse.json();
    client = await createClient(target.webSocketDebuggerUrl);

    const consoleErrors = [];
    let currentPage = "/";
    client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
      consoleErrors.push(`${currentPage}: ${exceptionDetails.exception?.description || exceptionDetails.text}`);
    });
    client.on("Runtime.consoleAPICalled", ({ type, args }) => {
      if (type !== "error") return;
      const message = args.map((item) => item.value || item.description || "").join(" ");
      if (!/google|doubleclick|adsbygoogle/i.test(message)) consoleErrors.push(`${currentPage}: console.error: ${message}`);
    });

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Network.setBlockedURLs", {
      urls: [
        "*doubleclick.net/*",
        "*google-analytics.com/*",
        "*googlesyndication.com/*",
        "*googletagmanager.com/*",
        "*pagead2.googlesyndication.com/*",
      ],
    });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      screenWidth: 390,
      screenHeight: 844,
    });
    await client.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `(() => {
        const nativeFetch = window.fetch.bind(window);
        window.__salaryRequests = [];
        window.fetch = async (input, init = {}) => {
          const url = typeof input === 'string' ? input : input?.url || '';
          if (!url.startsWith('https://api.kalkulatorbazis.hu/api/v1/calculators/salary/')) {
            return nativeFetch(input, init);
          }
          const body = JSON.parse(init.body || '{}');
          window.__salaryRequests.push({ url, body });
          const gross = body.gross || Math.round((body.desiredNet || 0) / (body.under25 ? 0.815 : 0.665));
          const szja = body.under25 ? 0 : gross * 0.15;
          const tb = gross * 0.185;
          const data = {
            gross,
            net: gross - szja - tb,
            taxes: { szja, tb },
            benefits: {
              family: { used: 0, unusedTaxEffect: 0 },
              firstMarriedSaving: 0,
              under25Saving: body.under25 ? gross * 0.15 : 0
            },
            employer: { totalCost: gross * 1.13 },
            warnings: [],
            ruleset: 'browser-contract-fixture'
          };
          return new Response(JSON.stringify({ data }), {
            status: 200,
            headers: { 'content-type': 'application/json' }
          });
        };
      })();`,
    });

    const evaluate = async (expression) => {
      const response = await client.send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (response.exceptionDetails) {
        throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
      }
      return response.result.value;
    };

    const results = [];
    for (const item of cases) {
      currentPage = sourceFileToPublicPath(item.page);
      await client.send("Page.navigate", { url: `${origin}${currentPage}` });
      await sleep(item.page.includes("osztalek") || item.page.includes("etf-") ? 800 : 450);
      try {
        const result = await evaluate(item.expression);
        results.push({ page: item.page, name: item.name, ...result });
      } catch (error) {
        results.push({ page: item.page, name: item.name, error: error.message });
      }
    }

    const failures = results.filter(
      (result) => result.error || result.valid !== true || result.boundary !== true || result.invalid !== true
    );
    if (consoleErrors.length || failures.length) {
      console.error(JSON.stringify({ failures, consoleErrors: [...new Set(consoleErrors)] }, null, 2));
      process.exitCode = 1;
      return;
    }

    console.log(
      `Böngészős referencia-audit OK: ${results.length}/29 kalkulátor, helyes eredmény + határérték + hibás bevitel.`
    );
  } finally {
    client?.close();
    browser.kill();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

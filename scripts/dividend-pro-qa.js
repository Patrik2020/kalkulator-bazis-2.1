const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const randomPortOffset = Math.floor(Math.random() * 1000);
const port = Number(process.env.KB_DIVIDEND_QA_PORT || 5667 + randomPortOffset);
const cdpPort = Number(process.env.KB_DIVIDEND_QA_CDP_PORT || 9667 + randomPortOffset);
const origin = `http://127.0.0.1:${port}`;
let phase = "new";

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const chrome = chromeCandidates.find((candidate) => candidate && fs.existsSync(candidate));
if (!chrome) throw new Error("Nem talalhato Chrome/Chromium/Edge a dividend PRO QA futtatasahoz.");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const oldHtml = `<!doctype html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Osztalek kalkulator regi</title>
  <link rel="stylesheet" href="../css/pages/osztalek.css">
  <script src="../js/pwa.js" defer></script>
</head>
<body>
  <main class="container page-osztalek">
    <h1>Osztalek kalkulator</h1>
    <section class="card card-calculator">
      <input id="amount" value="3000000">
      <input id="yield" value="4">
      <input id="tax" value="15">
      <div class="result-box">
        <p id="result-gross">-</p>
        <p id="result-net"></p>
        <p id="result-monthly"></p>
      </div>
    </section>
  </main>
  <script src="../js/penzugyi/osztalek.js" defer></script>
</body>
</html>`;

const oldDividendJs = `(() => {
  window.__OLD_DIVIDEND_JS_LOADED = true;
  const fmt = (num) => new Intl.NumberFormat("hu-HU").format(Math.round(num)) + " Ft";
  const num = (id) => parseFloat((document.getElementById(id)?.value || "0").replace(/\\s/g, "").replace(",", ".")) || 0;
  const calc = () => {
    const gross = num("amount") * num("yield") / 100;
    const net = gross * (1 - num("tax") / 100);
    document.getElementById("result-gross").textContent = fmt(gross);
    document.getElementById("result-net").textContent = fmt(net);
    document.getElementById("result-monthly").textContent = "Regi osztalek JS";
  };
  ["amount", "yield", "tax"].forEach((id) => document.getElementById(id)?.addEventListener("input", calc));
  calc();
})();`;

const oldPwaJs = `navigator.serviceWorker?.register("/sw.js").then((registration) => registration.update?.());`;

const oldSw = `const CACHE = "kalkulatorbazis-static-old-dividend-cache-first";
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
};
const networkFirst = async (request) => {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
};
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  if (/\\.(?:css|js)$/i.test(url.pathname)) event.respondWith(cacheFirst(event.request));
});`;

const send = (response, body, type = "text/plain; charset=utf-8") => {
  response.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  response.end(body);
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url, origin);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  if (phase === "old") {
    if (pathname === "/kalkulatorok/osztalek-kalkulator.html") return send(response, oldHtml, contentTypes[".html"]);
    if (pathname === "/js/penzugyi/osztalek.js") return send(response, oldDividendJs, contentTypes[".js"]);
    if (pathname === "/css/pages/osztalek.css") return send(response, ".result-box{font-weight:700}", contentTypes[".css"]);
    if (pathname === "/js/pwa.js") return send(response, oldPwaJs, contentTypes[".js"]);
    if (pathname === "/sw.js") return send(response, oldSw, contentTypes[".js"]);
  }

  const safePath = path.normalize(path.join(root, pathname.replace(/^\/+/, "")));
  if (!safePath.startsWith(root) || !fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
    if (pathname === "/favicon.ico") return send(response, "", "image/x-icon");
    if (pathname === "/favicon/site.webmanifest") return send(response, "{}", contentTypes[".webmanifest"]);
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  send(response, fs.readFileSync(safePath), contentTypes[path.extname(safePath).toLowerCase()] || "application/octet-stream");
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const createClient = async (webSocketUrl) => {
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
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
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
};

const numeric = (value) => Number((value || "").replace(/[^\d-]/g, ""));
const approx = (actual, expected, tolerance) => Math.abs(actual - expected) <= tolerance;
const consentRecord = (analytics) =>
  JSON.stringify({
    version: "2026-06-26.v2",
    categories: { necessary: true, analytics: Boolean(analytics), ads: false },
    decidedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  });

const launchBrowser = async () => {
  const profile = path.join(os.tmpdir(), `kb-dividend-pro-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const browser = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-background-networking",
      "--disable-default-apps",
      "--no-first-run",
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true }
  );

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
      if (response.ok) break;
    } catch (error) {
      // Browser is still starting.
    }
    await sleep(100);
  }

  const targetResponse = await fetch(
    `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${origin}/kalkulatorok/osztalek-kalkulator.html`)}`,
    { method: "PUT" }
  );
  const target = await targetResponse.json();
  const client = await createClient(target.webSocketDebuggerUrl);
  return { browser, client };
};

const runFunctionalQa = async () => {
  phase = "new";
  const { browser, client } = await launchBrowser();
  const failures = [];
  const consoleMessages = [];

  client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    consoleMessages.push(exceptionDetails.exception?.description || exceptionDetails.text || "Ismeretlen kivetel");
  });
  client.on("Log.entryAdded", ({ entry }) => {
    if (["error", "warning"].includes(entry.level) && !/google|doubleclick|adsbygoogle|favicon/i.test(entry.text || entry.url || "")) {
      consoleMessages.push(`${entry.level}: ${entry.text}`);
    }
  });

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable");
  await client.send("Network.enable");
  await client.send("Network.setBlockedURLs", {
    urls: [
      "*googletagmanager.com/*",
      "*googlesyndication.com/*",
      "*doubleclick.net/*",
      "*google-analytics.com/*",
      "*wise-creative.prf.hn/*",
    ],
  });

  const evaluate = async (expression) => {
    const result = await client.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const navigate = async (urlPath = "/kalkulatorok/osztalek-kalkulator.html") => {
    await client.send("Page.navigate", { url: `${origin}${urlPath}` });
    await sleep(900);
  };
  const setViewport = async (width, height = 900) => {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
      screenWidth: width,
      screenHeight: height,
    });
  };
  const action = (body) => evaluate(`(() => { ${body} })()`);
  const setValue = (id, value) =>
    action(`const el=document.getElementById(${JSON.stringify(id)}); el.value=${JSON.stringify(value)}; el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));`);
  const chooseRadio = (name, value) =>
    action(`const el=document.querySelector('input[name="${name}"][value="${value}"]'); el.checked=true; el.dispatchEvent(new Event('change',{bubbles:true}));`);
  const setCheckbox = (id, checked) =>
    action(`const el=document.getElementById(${JSON.stringify(id)}); el.checked=${checked ? "true" : "false"}; el.dispatchEvent(new Event('change',{bubbles:true}));`);

  const readState = () =>
    evaluate(`(() => {
      const cardMap = {};
      document.querySelectorAll('.dividend-result-card').forEach((card) => {
        cardMap[card.querySelector('span')?.textContent.trim() || ''] = card.querySelector('strong')?.textContent.trim() || '';
      });
      const polylines = [...document.querySelectorAll('#dividendChart polyline')].map((line) => ({
        className: line.getAttribute('class') || '',
        points: line.getAttribute('points') || '',
        count: (line.getAttribute('points') || '').trim().split(/\\s+/).filter(Boolean).length,
        finite: !/NaN|Infinity/.test(line.getAttribute('points') || ''),
        strokeWidth: getComputedStyle(line).strokeWidth,
      }));
      const bars = [...document.querySelectorAll('#dividendChart rect.dividend-chart-bar')].map((bar) => ({
        className: bar.getAttribute('class') || '',
        width: Number(bar.getAttribute('width')),
        height: Number(bar.getAttribute('height')),
      }));
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent.trim() || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        description: document.querySelector('meta[name="description"]')?.content || '',
        cssHref: document.querySelector('link[href*="css/pages/osztalek.css"]')?.getAttribute('href') || '',
        scriptSrc: document.querySelector('script[src*="js/penzugyi/osztalek.js"]')?.getAttribute('src') || '',
        structuredFaq: JSON.parse(document.getElementById('kb-structured-data')?.textContent || '{}')?.['@graph']?.find((item)=>item['@type']==='FAQPage')?.mainEntity?.length || 0,
        faqCount: document.querySelectorAll('.faq-list > details').length,
        heading: document.getElementById('result-heading')?.textContent.trim() || '',
        primary: document.getElementById('result-primary')?.textContent.trim() || '',
        interpretation: document.getElementById('result-interpretation')?.textContent.trim() || '',
        cards: cardMap,
        warning: document.getElementById('result-warning')?.textContent.trim() || '',
        scenarios: document.querySelectorAll('.dividend-scenario').length,
        polylines,
        bars,
        yearlyRows: document.querySelectorAll('#yearlyTableBody tr').length,
        hasNaN: /NaN|Infinity/.test(document.body.textContent),
        ctaVisible: !!document.querySelector('[data-retention-cta]:not([hidden])'),
        ctaCount: document.querySelectorAll('[data-retention-cta]').length,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    })()`);

  await setViewport(1024);
  await navigate();
  await evaluate(`localStorage.setItem('kbCookieConsent', ${JSON.stringify(consentRecord(true))}); localStorage.removeItem('cookieConsent');`);
  await navigate();
  await sleep(700);

  let state = await readState();
  if (state.h1 !== "Osztalék kalkulátor") failures.push("H1 nem maradt valtozatlan.");
  if (!state.canonical.endsWith("/kalkulatorok/osztalek-kalkulator.html")) failures.push("Canonical hiba.");
  if (!state.cssHref.includes("?v=20260628-1")) failures.push("Osztalek CSS nem verziozott.");
  if (!state.scriptSrc.includes("?v=20260628-1")) failures.push("Osztalek JS nem verziozott.");
  if (state.faqCount < 9) failures.push("Kevesebb mint 9 GYIK van az oldalon.");

  await chooseRadio("dividendMode", "income");
  await chooseRadio("taxMode", "simple");
  await setValue("incomeAmount", "3000000");
  await setValue("dividendYield", "4");
  await setValue("simpleDeduction", "15");
  await setValue("fixedCost", "0");
  await setValue("payoutFrequency", "4");
  await sleep(950);
  const exampleA = await readState();
  if (numeric(exampleA.primary) !== 102000) failures.push(`A kontroll eves netto hibas: ${exampleA.primary}`);
  if (numeric(exampleA.cards["Éves bruttó osztalék"]) !== 120000) failures.push("A kontroll brutto hibas.");
  if (numeric(exampleA.cards["Teljes éves levonás"]) !== 18000) failures.push("A kontroll levonas hibas.");
  if (numeric(exampleA.cards["Havi nettó átlag"]) !== 8500) failures.push("A kontroll havi netto hibas.");
  if (numeric(exampleA.cards["Egy kifizetés nettó összege"]) !== 25500) failures.push("A kontroll negyedeves kifizetes hibas.");
  if (!/3,4/.test(exampleA.cards["Tényleges nettó osztalékhozam"] || "")) failures.push("A kontroll netto osztalekhozam hibas.");
  if (exampleA.bars.length < 3 || exampleA.bars.some((bar) => !Number.isFinite(bar.height) || bar.height < 0)) failures.push("Income chart bar hiba.");

  await chooseRadio("dividendMode", "target");
  await chooseRadio("targetPeriod", "monthly");
  await chooseRadio("targetBasis", "net");
  await chooseRadio("taxMode", "simple");
  await setValue("targetIncome", "100000");
  await setValue("dividendYield", "5");
  await setValue("simpleDeduction", "15");
  await setValue("fixedCost", "0");
  await sleep(950);
  const exampleB = await readState();
  if (numeric(exampleB.primary) !== 28235295) failures.push(`B kontroll szukseges toke hibas: ${exampleB.primary}`);
  if (numeric(exampleB.cards["Éves nettó osztalék"]) < 1200000) failures.push("B kontroll ujraszamolt netto cel alatt maradt.");

  await setValue("fixedCost", "50000");
  await sleep(950);
  const exampleC = await readState();
  if (numeric(exampleC.primary) !== 29411765) failures.push(`C kontroll fix koltseges toke hibas: ${exampleC.primary}`);

  await chooseRadio("dividendMode", "income");
  await chooseRadio("taxMode", "detailed");
  await setValue("incomeAmount", "3000000");
  await setValue("dividendYield", "4");
  await setValue("withholdingTax", "10");
  await setValue("extraTax", "5");
  await setValue("variableCost", "2");
  await setValue("fixedCost", "0");
  await sleep(950);
  const detailed = await readState();
  if (numeric(detailed.primary) !== 99600) failures.push(`Reszletes levonasi mod hiba: ${detailed.primary}`);

  await chooseRadio("dividendMode", "projection");
  await chooseRadio("taxMode", "simple");
  await chooseRadio("reinvestDividends", "yes");
  await setCheckbox("stressEnabled", false);
  await setValue("initialPortfolio", "3000000");
  await setValue("monthlyContribution", "50000");
  await setValue("dividendYield", "4");
  await setValue("dividendGrowth", "4");
  await setValue("priceGrowth", "5");
  await setValue("projectionYears", "20");
  await setValue("simpleDeduction", "15");
  await setValue("inflation", "0");
  await setValue("contributionIncrease", "0");
  await setValue("fixedCost", "0");
  await setValue("payoutFrequency", "4");
  await chooseRadio("chartMode", "portfolio");
  await sleep(1050);
  const exampleD = await readState();
  if (!approx(numeric(exampleD.primary), 43444808, 2)) failures.push(`D kontroll portfolio hiba: ${exampleD.primary}`);
  if (numeric(exampleD.cards["Teljes saját befizetés"]) !== 15000000) failures.push("D kontroll sajat befizetes hiba.");
  if (!approx(numeric(exampleD.cards["Összes nettó osztalék"]), 10692980, 2)) failures.push("D kontroll osszes netto osztalek hiba.");
  if (!approx(numeric(exampleD.cards["Utolsó év becsült éves nettó osztaléka"]), 1172909, 2)) failures.push("D kontroll utolso eves netto hiba.");
  if (exampleD.yearlyRows !== 20) failures.push("D kontroll eves tabla sor hiba.");
  if (exampleD.polylines.length < 3 || exampleD.polylines.some((line) => line.count < 20 || !line.finite || line.strokeWidth === "0px")) failures.push("D kontroll portfolio chart hiba.");
  if (!exampleD.ctaVisible || exampleD.ctaCount !== 1) failures.push("Retention CTA nem jelent meg vagy duplikalodott ervenyes szamitas utan.");

  await chooseRadio("chartMode", "dividend");
  await sleep(250);
  const dividendChart = await readState();
  if (dividendChart.polylines.length < 3 || dividendChart.polylines.some((line) => line.count < 20 || !line.finite)) failures.push("Dividend chart valtas hiba.");

  await chooseRadio("reinvestDividends", "no");
  await sleep(950);
  const exampleE = await readState();
  if (!approx(numeric(exampleE.primary), 28250117, 2)) failures.push(`E kontroll portfolio hiba: ${exampleE.primary}`);
  if (!approx(numeric(exampleE.cards["Kivett osztalék"]), 8029403, 2)) failures.push("E kontroll kivett osztalek hiba.");
  if (!approx(numeric(exampleE.cards["Utolsó év becsült éves nettó osztaléka"]), 762688, 2)) failures.push("E kontroll utolso eves netto hiba.");

  await chooseRadio("reinvestDividends", "yes");
  await setCheckbox("stressEnabled", true);
  await setValue("stressCut", "30");
  await setValue("stressYear", "5");
  await sleep(950);
  const stress = await readState();
  if (!stress.warning && numeric(stress.cards["Utolsó év becsült éves nettó osztaléka"]) >= numeric(exampleD.cards["Utolsó év becsült éves nettó osztaléka"])) {
    failures.push("Stresszteszt nem csokkentette az osztalekpalyat.");
  }

  await chooseRadio("dividendMode", "target");
  await setValue("dividendYield", "0");
  await sleep(300);
  const invalid = await readState();
  if (!/nem számítható|magasabb osztalékhozamot/i.test(invalid.interpretation || invalid.warning || "")) {
    const invalidText = await evaluate(`document.getElementById('result-interpretation')?.textContent || ''`);
    if (!/nem számítható|magasabb osztalékhozamot/i.test(invalidText)) failures.push("0%-os celhozam validacio hiba.");
  }
  if (invalid.hasNaN) failures.push("NaN vagy Infinity jelent meg validacios allapotban.");

  await evaluate(`window.__dividendEvents = []; window.gtag = (...args) => window.__dividendEvents.push(args);`);
  await chooseRadio("dividendMode", "income");
  await setValue("dividendYield", "4");
  await setValue("incomeAmount", "3000000");
  await setValue("incomeAmount", "3100000");
  await setValue("incomeAmount", "3200000");
  await sleep(1100);
  const analytics = await evaluate(`window.__dividendEvents || []`);
  const eventNames = analytics.filter((event) => event[0] === "event").map((event) => event[1]);
  const incomeEvents = eventNames.filter((name) => name === "dividend_income_calculate").length;
  if (incomeEvents > 1) failures.push(`Tul zajos dividend_income_calculate meres: ${incomeEvents}`);
  const analyticsText = JSON.stringify(analytics);
  ["3000000", "3100000", "3200000", "102000"].forEach((forbidden) => {
    if (analyticsText.includes(forbidden)) failures.push(`Pontos penzugyi ertek kerult analyticsbe: ${forbidden}`);
  });

  await evaluate(`localStorage.setItem('kbCookieConsent', ${JSON.stringify(consentRecord(false))}); window.__deniedEvents=[]; window.gtag=(...args)=>window.__deniedEvents.push(args);`);
  await navigate();
  await chooseRadio("dividendMode", "income");
  await setValue("incomeAmount", "3000000");
  await sleep(1100);
  const deniedEvents = await evaluate(`window.__deniedEvents || []`);
  if (deniedEvents.some((event) => event[0] === "event" && /^dividend_/.test(event[1]))) failures.push("Analytics consent nelkul dividend esemeny ment.");

  const responsive = [];
  for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
    await setViewport(width, width < 768 ? 844 : 900);
    await navigate();
    await chooseRadio("dividendMode", "projection");
    await setValue("initialPortfolio", "3000000");
    await setValue("monthlyContribution", "50000");
    await sleep(300);
    responsive.push({ width, ...(await readState()) });
  }
  responsive.forEach((item) => {
    if (item.overflow) failures.push(`Responsive overflow ${item.width}px`);
  });

  client.close();
  browser.kill();
  return {
    summary: { failures: failures.length, consoleMessages: consoleMessages.length },
    exampleA,
    exampleB,
    exampleC,
    exampleD,
    exampleE,
    stress,
    analyticsEvents: analytics,
    responsive: responsive.map((item) => ({ width: item.width, overflow: item.overflow, polylines: item.polylines.length })),
    failures,
    consoleMessages: [...new Set(consoleMessages)],
  };
};

const runUpgradeQa = async () => {
  phase = "old";
  const { browser, client } = await launchBrowser();
  const failures = [];
  const consoleMessages = [];

  client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    consoleMessages.push(exceptionDetails.exception?.description || exceptionDetails.text || "Ismeretlen kivetel");
  });
  client.on("Log.entryAdded", ({ entry }) => {
    if (["error", "warning"].includes(entry.level)) consoleMessages.push(`${entry.level}: ${entry.text}`);
  });

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable");

  const evaluate = async (expression) => {
    const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const navigate = async () => {
    await client.send("Page.navigate", { url: `${origin}/kalkulatorok/osztalek-kalkulator.html` });
    await sleep(900);
  };

  await navigate();
  await evaluate(`navigator.serviceWorker.ready`);
  await sleep(500);
  const oldState = await evaluate(`(async () => ({
    oldLoaded: !!window.__OLD_DIVIDEND_JS_LOADED,
    oldResult: document.getElementById("result-net")?.textContent.trim() || "",
    controller: !!navigator.serviceWorker.controller,
    cacheKeys: await caches.keys()
  }))()`);

  if (!oldState.oldLoaded) failures.push("A regi osztalek JS nem toltodott be.");
  if (!oldState.controller) failures.push("A regi service worker nem kontrollalta az oldalt.");
  if (!oldState.cacheKeys.includes("kalkulatorbazis-static-old-dividend-cache-first")) failures.push("A regi cache nem jott letre.");

  phase = "new";
  await navigate();
  await sleep(2600);

  const newState = await evaluate(`(async () => {
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = value;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const radio = (name, value) => {
      const el = document.querySelector('input[name="' + name + '"][value="' + value + '"]');
      if (!el) return;
      el.checked = true;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    radio("dividendMode", "income");
    radio("taxMode", "simple");
    set("incomeAmount", "3000000");
    set("dividendYield", "4");
    set("simpleDeduction", "15");
    set("fixedCost", "0");
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      oldLoaded: !!window.__OLD_DIVIDEND_JS_LOADED,
      proLoaded: !!window.KB_DIVIDEND_PRO_LOADED,
      primary: document.getElementById("result-primary")?.textContent.trim() || "",
      cssHref: document.querySelector('link[href*="css/pages/osztalek.css"]')?.href || "",
      scriptSrc: document.querySelector('script[src*="js/penzugyi/osztalek.js"]')?.src || "",
      bars: document.querySelectorAll("#dividendChart rect.dividend-chart-bar").length,
      cacheKeys: await caches.keys(),
      controllerScript: navigator.serviceWorker.controller?.scriptURL || "",
      reloadGuard: sessionStorage.getItem("kb-sw-controller-reload-2026-06-28-dividend-pro-v1")
    };
  })()`);

  if (newState.oldLoaded) failures.push("Az uj HTML mellett regi osztalek JS is futott.");
  if (!newState.proLoaded) failures.push("Az osztalek PRO JS nem futott frissites utan.");
  if (!newState.cssHref.includes("?v=20260628-1")) failures.push("Az uj HTML nem verziozott osztalek CSS-t hivatkozik.");
  if (!newState.scriptSrc.includes("?v=20260628-1")) failures.push("Az uj HTML nem verziozott osztalek JS-t hivatkozik.");
  if (numeric(newState.primary) !== 102000) failures.push(`Upgrade utani A kontroll hibas: ${newState.primary}`);
  if (newState.bars < 3) failures.push("Upgrade utan az income grafikon nem rajzolodott ki.");
  if (!newState.cacheKeys.includes("kalkulatorbazis-static-2026-06-28-dividend-pro-v1")) failures.push("Az uj dividend SW cache-verzio nem aktiv.");
  if (newState.cacheKeys.includes("kalkulatorbazis-static-old-dividend-cache-first")) failures.push("A regi dividend cache nem torlodott.");

  client.close();
  browser.kill();
  return {
    summary: { failures: failures.length, consoleMessages: consoleMessages.length },
    oldState,
    newState,
    failures,
    consoleMessages: [...new Set(consoleMessages)],
  };
};

const run = async () => {
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  try {
    const functional = await runFunctionalQa();
    const upgrade = await runUpgradeQa();
    const result = {
      summary: {
        failures: functional.summary.failures + upgrade.summary.failures,
        consoleMessages: functional.summary.consoleMessages + upgrade.summary.consoleMessages,
      },
      functional,
      upgrade,
    };
    server.close();
    return result;
  } catch (error) {
    server.close();
    throw error;
  }
};

run()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (result.summary.failures || result.summary.consoleMessages) process.exitCode = 1;
  })
  .catch((error) => {
    server.close();
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });

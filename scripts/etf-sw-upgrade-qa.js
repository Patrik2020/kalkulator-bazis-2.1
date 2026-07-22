const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const randomPortOffset = Math.floor(Math.random() * 1000);
const port = Number(process.env.KB_ETF_SW_QA_PORT || 5567 + randomPortOffset);
const cdpPort = Number(process.env.KB_ETF_SW_QA_CDP_PORT || 9555 + randomPortOffset);
const origin = `http://127.0.0.1:${port}`;
let phase = "old";

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
if (!chrome) throw new Error("Nem található Chrome/Chromium/Edge az ETF SW upgrade QA futtatásához.");

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
  <title>ETF kalkulátor régi</title>
  <link rel="stylesheet" href="../css/pages/etf.css">
  <script src="../js/pwa.js" defer></script>
</head>
<body>
  <main class="container page-etf">
    <h1>ETF kalkulátor</h1>
    <section class="card card-calculator">
      <input id="initial" value="0">
      <input id="monthly" value="50000">
      <input id="rate" value="6">
      <input id="years" value="20">
      <div class="result-box">
        <p id="result-final">–</p>
        <p id="result-profit"></p>
      </div>
    </section>
  </main>
  <script src="../js/penzugyi/etf.js" defer></script>
</body>
</html>`;

const oldEtfJs = `(() => {
  window.__OLD_ETF_JS_LOADED = true;
  const fmt = (num) => new Intl.NumberFormat("hu-HU").format(Math.round(num)) + " Ft";
  const num = (id) => parseFloat((document.getElementById(id)?.value || "0").replace(/\\s/g, "").replace(",", ".")) || 0;
  const calc = () => {
    const initial = num("initial");
    const monthly = num("monthly");
    const monthlyRate = num("rate") / 100 / 12;
    const months = num("years") * 12;
    let total = initial;
    for (let i = 0; i < months; i += 1) total = total * (1 + monthlyRate) + monthly;
    document.getElementById("result-final").textContent = fmt(total);
    document.getElementById("result-profit").textContent = "Régi ETF JS";
  };
  ["initial", "monthly", "rate", "years"].forEach((id) => document.getElementById(id)?.addEventListener("input", calc));
  calc();
})();`;

const oldPwaJs = `navigator.serviceWorker?.register("/sw.js").then((registration) => registration.update?.());`;

const oldSw = `const CACHE = "kalkulatorbazis-static-old-etf-cache-first";
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
  if (/\\.(?:css|js)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
  }
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
  if (pathname === "/") pathname = "/";

  if (phase === "old") {
    if (pathname === "/kalkulatorok/etf-kalkulator.html") return send(response, oldHtml, contentTypes[".html"]);
    if (pathname === "/js/penzugyi/etf.js") return send(response, oldEtfJs, contentTypes[".js"]);
    if (pathname === "/css/pages/etf.css") return send(response, ".result-box{font-weight:700}", contentTypes[".css"]);
    if (pathname === "/js/pwa.js") return send(response, oldPwaJs, contentTypes[".js"]);
    if (pathname === "/sw.js") return send(response, oldSw, contentTypes[".js"]);
  }

  const safePath = path.normalize(path.join(root, pathname.replace(/^\/+/, "")));
  if (!safePath.startsWith(root) || !fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
    if (pathname === "/favicon.ico") {
      return send(response, "", "image/x-icon");
    }
    if (pathname === "/favicon/site.webmanifest") {
      return send(response, "{}", contentTypes[".webmanifest"]);
    }

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

const run = async () => {
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

  const profile = path.join(os.tmpdir(), `kb-etf-sw-upgrade-${Date.now()}`);
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

  const cleanup = () => {
    browser.kill();
    server.close();
  };

  try {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
        if (response.ok) break;
      } catch (error) {
        // Chrome indul.
      }
      await sleep(100);
    }

    const targetResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${origin}/kalkulatorok/etf-kalkulator.html`)}`, {
      method: "PUT",
    });
    const target = await targetResponse.json();
    const client = await createClient(target.webSocketDebuggerUrl);
    const failures = [];
    const consoleMessages = [];

    client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
      consoleMessages.push(exceptionDetails.exception?.description || exceptionDetails.text || "Ismeretlen kivétel");
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
      const loaded = new Promise((resolve) => {
        const timer = setTimeout(resolve, 8000);
        client.on("Page.loadEventFired", () => {
          clearTimeout(timer);
          resolve();
        });
      });
      await client.send("Page.navigate", { url: `${origin}/kalkulatorok/etf-kalkulator.html` });
      await loaded;
      await sleep(700);
    };

    await navigate();
    await evaluate(`navigator.serviceWorker.ready`);
    const oldHasController = await evaluate(`!!navigator.serviceWorker.controller`);
    if (!oldHasController) {
      await navigate();
    }
    await sleep(500);
    const oldState = await evaluate(`(async () => ({
      oldLoaded: !!window.__OLD_ETF_JS_LOADED,
      oldResult: document.getElementById("result-final")?.textContent.trim() || "",
      controller: !!navigator.serviceWorker.controller,
      cacheKeys: await caches.keys()
    }))()`);

    if (!oldState.oldLoaded) failures.push("A régi ETF JS nem töltődött be a reprodukciós fázisban.");
    if (!oldState.controller) failures.push("A régi service worker nem kontrollálta az oldalt.");
    if (!oldState.cacheKeys.includes("kalkulatorbazis-static-old-etf-cache-first")) failures.push("A régi cache nem jött létre.");

    phase = "new";
    await navigate();
    await sleep(2600);

    const newState = await evaluate(`(async () => {
      const set = (id, value) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      const numeric = (value) => Number((value || "").replace(/[^\\d-]/g, ""));
      const chartState = () => {
        const lines = [...document.querySelectorAll("#etfChart polyline")].map((line) => line.getAttribute("points") || "");
        return {
          lineCount: lines.length,
          pointsOk: lines.length >= 3 && lines.every((points) => points.trim().split(/\\s+/).length >= 20 && !/NaN|Infinity/.test(points))
        };
      };
      const lastPortfolioValue = () => {
        const rows = [...document.querySelectorAll("#yearlyTableBody tr")];
        const last = rows.at(-1);
        return numeric(last?.querySelectorAll("td")[4]?.textContent || "");
      };

      set("initial", "0");
      set("monthly", "50000");
      set("rate", "6");
      set("years", "20");
      set("ter", "0,20");
      set("inflation", "3");
      set("increase", "0");
      await new Promise((resolve) => setTimeout(resolve, 250));
      const futureChart = chartState();
      const futureState = {
        finalText: document.getElementById("result-final")?.textContent.trim() || "",
        investedText: document.getElementById("result-invested")?.textContent.trim() || "",
        realText: document.getElementById("result-real")?.textContent.trim() || "",
        costText: document.getElementById("result-cost")?.textContent.trim() || "",
        rows: document.querySelectorAll("#yearlyTableBody tr").length,
        chartLines: futureChart.lineCount,
        chartPointsOk: futureChart.pointsOk
      };

      const goalMode = document.querySelector('input[name="etfMode"][value="goal"]');
      goalMode.checked = true;
      goalMode.dispatchEvent(new Event("change", { bubbles: true }));
      set("target", "10000000");
      set("initial", "0");
      set("rate", "6");
      set("years", "20");
      set("ter", "0,20");
      set("inflation", "3");
      set("increase", "0");
      await new Promise((resolve) => setTimeout(resolve, 250));
      const goalChart = chartState();
      const goalMonthlyText = document.getElementById("result-final")?.textContent.trim() || "";
      const goalState = {
        heading: document.getElementById("result-heading")?.textContent.trim() || "",
        monthlyText: goalMonthlyText,
        monthly: numeric(goalMonthlyText),
        finalPortfolio: lastPortfolioValue(),
        rows: document.querySelectorAll("#yearlyTableBody tr").length,
        chartLines: goalChart.lineCount,
        chartPointsOk: goalChart.pointsOk
      };

      const resources = performance.getEntriesByType("resource").map((entry) => entry.name);
      return {
        oldLoaded: !!window.__OLD_ETF_JS_LOADED,
        proLoaded: !!window.KB_ETF_PRO_LOADED,
        ...futureState,
        goalState,
        etfCssHref: document.querySelector('link[href*="css/pages/etf.css"]')?.href || "",
        etfScriptSrc: document.querySelector('script[src*="js/penzugyi/etf.js"]')?.src || "",
        resourceVersions: resources.filter((resource) => /etf\\.(?:css|js)/.test(resource)),
        cacheKeys: await caches.keys(),
        controllerScript: navigator.serviceWorker.controller?.scriptURL || "",
        reloadGuard: sessionStorage.getItem("kb-sw-controller-reload-2026-06-28-dividend-pro-v1")
      };
    })()`);

    const numeric = (value) => Number((value || "").replace(/[^\d-]/g, ""));
    if (newState.oldLoaded) failures.push("Az új HTML mellett régi ETF JS is futott.");
    if (!newState.proLoaded) failures.push("Az ETF PRO JS nem futott a frissítés után.");
    if (!newState.etfCssHref.includes("?v=20260627-2")) failures.push("A frissített HTML nem verziózott ETF CSS-t hivatkozik.");
    if (!newState.etfScriptSrc.includes("?v=20260627-2")) failures.push("A frissített HTML nem verziózott ETF JS-t hivatkozik.");
    if (numeric(newState.finalText) !== 22562400) failures.push(`Hibás B kontroll végösszeg frissítés után: ${newState.finalText}`);
    if (numeric(newState.investedText) !== 12000000) failures.push(`Hibás B kontroll befizetés frissítés után: ${newState.investedText}`);
    if (numeric(newState.realText) !== 12492254) failures.push(`Hibás B kontroll realérték frissítés után: ${newState.realText}`);
    if (numeric(newState.costText) !== 539645) failures.push(`Hibás B kontroll TER-hatás frissítés után: ${newState.costText}`);
    if (newState.rows < 20) failures.push("Az éves táblázat nem frissült 20 sorra.");
    if (!newState.chartPointsOk) failures.push("A grafikon frissítés után üres vagy hibás pontokat tartalmaz.");
    if (!newState.cacheKeys.includes("kalkulatorbazis-static-2026-06-28-dividend-pro-v1")) failures.push("Az új service worker cache-verzió nem aktiválódott.");
    if (newState.cacheKeys.some((key) => key === "kalkulatorbazis-static-old-etf-cache-first")) failures.push("A régi cache nem törlődött az új SW aktiválása után.");

    if (!/havi befektet/i.test(newState.goalState.heading)) failures.push("A celosszeg mod nem valtott at havi befektetes eredmenyre.");
    if (!Number.isInteger(newState.goalState.monthly) || newState.goalState.monthly <= 0) failures.push(`A celosszeg havi befektetese nem pozitiv egesz forint: ${newState.goalState.monthlyText}`);
    if (newState.goalState.finalPortfolio < 10000000) failures.push(`A celosszeg mod nem eri el a 10 M Ft celt: ${newState.goalState.finalPortfolio}`);
    if (newState.goalState.rows < 20) failures.push("A celosszeg mod eves tablazata nem frissult 20 sorra.");
    if (!newState.goalState.chartPointsOk) failures.push("A celosszeg mod grafikonja ures vagy hibas pontokat tartalmaz.");

    const result = {
      summary: {
        failures: failures.length,
        consoleMessages: consoleMessages.length,
      },
      oldState,
      newState,
      failures,
      consoleMessages: [...new Set(consoleMessages)],
    };

    client.close();
    cleanup();
    return result;
  } catch (error) {
    cleanup();
    throw error;
  }
};

run()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (result.failures.length || result.consoleMessages.length) process.exitCode = 1;
  })
  .catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });

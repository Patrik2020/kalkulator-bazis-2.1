const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { suites } = require("./reference-test-manifest");
const { publicPathToSourceFile } = require("./url-paths");

const root = path.resolve(__dirname, "..");
const pages = [...new Set(Object.values(suites).flat())].sort();
const viewports = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 1, mobile: true },
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
];

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
if (!chrome) throw new Error("Nem található Chrome/Chromium a teljes kalkulátor smoke-audithoz.");

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Runtime.evaluate hiba");
  }
  return result.result?.value;
}

async function waitForReady(client, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await evaluate(client, "document.readyState")) === "complete") return;
    } catch (error) {
      // Navigáció közben a context rövid ideig megszűnhet.
    }
    await sleep(50);
  }
  throw new Error("Az oldal nem töltődött be időben.");
}

async function main() {
  if (pages.length < 100) {
    throw new Error(`A teljes böngészős smoke-audit csak ${pages.length} egyedi kalkulátoroldalt lát; legalább 100 szükséges.`);
  }

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const cdpPort = 10000 + Math.floor(Math.random() * 20000);
  const profile = path.join(os.tmpdir(), `kb-all-calculator-smoke-${Date.now()}-${Math.random().toString(16).slice(2)}`);
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
  const failures = [];
  const consoleErrors = [];
  let currentPage = "/";

  try {
    const deadline = Date.now() + 30000;
    let version;
    while (Date.now() < deadline) {
      try {
        const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
        if (response.ok) {
          version = await response.json();
          break;
        }
      } catch (error) {
        // A böngésző még indul.
      }
      await sleep(150);
    }
    if (!version) throw new Error("A headless böngésző 30 másodperc alatt sem indult el.");

    const targetResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${origin}/`)}`, {
      method: "PUT",
    });
    const target = await targetResponse.json();
    client = await createClient(target.webSocketDebuggerUrl);

    client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
      const message = exceptionDetails.exception?.description || exceptionDetails.text || "ismeretlen runtime hiba";
      consoleErrors.push(`${currentPage}: ${message}`);
    });
    client.on("Runtime.consoleAPICalled", ({ type, args }) => {
      if (type !== "error") return;
      const message = args.map((item) => item.value || item.description || "").join(" ");
      if (!/google|doubleclick|adsbygoogle|analytics|clarity/i.test(message)) {
        consoleErrors.push(`${currentPage}: console.error: ${message}`);
      }
    });

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Network.setBlockedURLs", {
      urls: [
        "*doubleclick.net/*",
        "*googlesyndication.com/*",
        "*google-analytics.com/*",
        "*googletagmanager.com/*",
        "*clarity.ms/*",
        "*formspree.io/*",
        "*api.frankfurter.app/*",
        "*api.kalkulatorbazis.hu/*",
      ],
    });

    for (const viewport of viewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.deviceScaleFactor,
        mobile: viewport.mobile,
      });

      for (const page of pages) {
        currentPage = `${page} [${viewport.name}]`;
        const url = `${origin}/${page}`;
        const errorsBefore = consoleErrors.length;

        try {
          await client.send("Page.navigate", { url });
          await waitForReady(client);
          await sleep(30);

          const audit = await evaluate(
            client,
            `(() => {
              const main = document.querySelector('main');
              const h1s = [...document.querySelectorAll('h1')];
              const shell = document.querySelector('.card-calculator, #kalkulator');
              const controls = [...document.querySelectorAll('main input, main select, main textarea, main button')]
                .filter((el) => !el.hidden && getComputedStyle(el).display !== 'none');
              const ids = [...document.querySelectorAll('[id]')].map((el) => el.id).filter(Boolean);
              const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
              const overflow = Math.max(
                document.documentElement.scrollWidth - document.documentElement.clientWidth,
                document.body.scrollWidth - document.body.clientWidth
              );
              const shellStyle = shell ? getComputedStyle(shell) : null;
              const shellVisible = Boolean(shell && shellStyle.display !== 'none' && shellStyle.visibility !== 'hidden' && shell.getBoundingClientRect().height > 0);
              const badVisibleText = shell ? /(?:NaN|Infinity|undefined|null)/.test(shell.innerText) : false;
              return {
                title: document.title.trim(),
                main: Boolean(main),
                h1Count: h1s.length,
                h1: h1s[0]?.textContent?.trim() || '',
                shellVisible,
                controlCount: controls.length,
                duplicateIds,
                overflow,
                badVisibleText,
              };
            })()`
          );

          const pageFailures = [];
          if (!audit.main) pageFailures.push("hiányzó <main>");
          if (audit.h1Count !== 1 || !audit.h1) pageFailures.push(`H1 darabszám: ${audit.h1Count}`);
          if (!audit.title) pageFailures.push("üres <title>");
          if (!audit.shellVisible) pageFailures.push("a kalkulátor blokk nem látható");
          if (audit.controlCount === 0) pageFailures.push("nincs látható vezérlő");
          if (audit.duplicateIds.length) pageFailures.push(`duplikált id: ${audit.duplicateIds.join(", ")}`);
          if (audit.overflow > 2) pageFailures.push(`vízszintes overflow: ${audit.overflow}px`);
          if (audit.badVisibleText) pageFailures.push("NaN/Infinity/undefined/null látható a kalkulátorban");
          if (consoleErrors.length > errorsBefore) pageFailures.push("runtime/console hiba");

          if (pageFailures.length) failures.push(`${currentPage}: ${pageFailures.join("; ")}`);
        } catch (error) {
          failures.push(`${currentPage}: ${error.message}`);
        }
      }
    }
  } finally {
    if (client) client.close();
    browser.kill();
    server.close();
    fs.rmSync(profile, { recursive: true, force: true });
  }

  if (consoleErrors.length) {
    const uniqueErrors = [...new Set(consoleErrors)];
    failures.push(...uniqueErrors.map((error) => `Konzol: ${error}`));
  }

  if (failures.length) {
    console.error(`Teljes kalkulátor browser smoke FAILED (${failures.length} hiba):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Teljes kalkulátor browser smoke OK: ${pages.length} oldal × ${viewports.length} viewport = ${pages.length * viewports.length} render.`);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
});

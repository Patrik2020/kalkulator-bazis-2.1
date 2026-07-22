const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

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

const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) {
  throw new Error("Nem található Chrome/Chromium/Edge az ETF PRO QA futtatásához.");
}

const port = 9444;
const origin = "http://127.0.0.1:5500";
const profile = path.join(os.tmpdir(), `kb-etf-pro-qa-${Date.now()}`);
const processHandle = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-default-apps",
    "--no-first-run",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true }
);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const waitForDebugger = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch (error) {
      // Chrome indul.
    }
    await sleep(100);
  }
  throw new Error("A headless böngésző nem indult el időben.");
};

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

const consentRecord = (analytics, ads = false) =>
  JSON.stringify({
    version: "2026-06-26.v2",
    categories: { necessary: true, analytics, ads },
    decidedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  });

const run = async () => {
  await waitForDebugger();
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${origin}/`)}`, {
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
    if (["error", "warning"].includes(entry.level) && !/google|doubleclick|adsbygoogle/i.test(entry.url || entry.text)) {
      consoleMessages.push(`${entry.level}: ${entry.url || "(nincs URL)"} - ${entry.text}`);
    }
  });

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Log.enable");
  await client.send("Network.enable");
  await client.send("Network.setBlockedURLs", {
    urls: [
      "*pagead2.googlesyndication.com/*",
      "*googlesyndication.com/*",
      "*doubleclick.net/*",
      "*google-analytics.com/*",
      "*googletagmanager.com/*",
    ],
  });

  const evaluate = async (expression) => {
    const result = await client.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  };

  const navigate = async (pagePath) => {
    const loaded = new Promise((resolve) => {
      const done = () => {
        client.on("Page.loadEventFired", () => {});
        resolve();
      };
      client.on("Page.loadEventFired", done);
      setTimeout(resolve, 8000);
    });
    await client.send("Page.navigate", { url: `${origin}${pagePath}` });
    await loaded;
    await sleep(500);
  };

  const setViewport = async (width, height, mobile = width < 768) => {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      mobile,
      deviceScaleFactor: 1,
      screenWidth: width,
      screenHeight: height,
    });
  };

  const resetConsent = async (analytics) => {
    await navigate("/");
    await evaluate(`localStorage.removeItem('cookieConsent'); localStorage.setItem('kbCookieConsent', ${JSON.stringify(consentRecord(analytics))});`);
  };

  const setInputs = async (pairs) =>
    evaluate(`(() => {
      ${pairs
        .map(
          ([id, value]) => `
            {
              const el = document.getElementById(${JSON.stringify(id)});
              if (el) {
                el.disabled = false;
                el.value = ${JSON.stringify(value)};
                el.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          `
        )
        .join("")}
    })()`);

  const readEtfState = async () =>
    evaluate(`(() => {
      const chart = document.getElementById('etfChart');
      const chartRect = chart?.getBoundingClientRect() || { width: 0, height: 0 };
      const chartLines = [...document.querySelectorAll('#etfChart polyline')].map((line) => {
        const points = line.getAttribute('points') || '';
        const coords = points.trim().split(/\\s+/).filter(Boolean).flatMap((pair) => pair.split(',').map(Number));
        const style = getComputedStyle(line);
        return {
          className: line.getAttribute('class') || '',
          points,
          pointPairs: points.trim() ? points.trim().split(/\\s+/).length : 0,
          finite: coords.length > 0 && coords.every(Number.isFinite),
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
        };
      });
      const rows = [...document.querySelectorAll('#yearlyTableBody tr')];
      const lastRowCells = rows.at(-1) ? [...rows.at(-1).children].map((cell) => cell.textContent.trim()) : [];
      return {
        finalText: document.getElementById('result-final')?.textContent.trim() || '',
        investedText: document.getElementById('result-invested')?.textContent.trim() || '',
        profitText: document.getElementById('result-profit')?.textContent.trim() || '',
        realText: document.getElementById('result-real')?.textContent.trim() || '',
        costText: document.getElementById('result-cost')?.textContent.trim() || '',
        interpretation: document.getElementById('result-interpretation')?.textContent.trim() || '',
        scenarios: document.querySelectorAll('.etf-scenario').length,
        scenarioValues: [...document.querySelectorAll('.etf-scenario strong')].map((item) => item.textContent.trim()),
        chartPoints: document.querySelectorAll('[data-chart-point]').length,
        chartRect: { width: Math.round(chartRect.width), height: Math.round(chartRect.height) },
        chartLines,
        yearlyRows: rows.length,
        lastPortfolioText: lastRowCells[4] || '',
        ctaVisible: !!document.querySelector('[data-retention-cta]:not([hidden])'),
        hasNaN: /NaN|Infinity/.test(document.querySelector('.card-calculator')?.innerText || ''),
        fieldErrors: [...document.querySelectorAll('.field-error')].map((item) => item.textContent.trim()).filter(Boolean),
      };
    })()`);

  const assertChartHealthy = (name, state, expectedRows) => {
    if (state.chartLines.length < 3) failures.push(`${name}: nincs legalább három grafikonvonal.`);
    state.chartLines.forEach((line) => {
      if (!line.points) failures.push(`${name}: üres points attribútum (${line.className}).`);
      if (line.pointPairs < expectedRows) failures.push(`${name}: kevés grafikonpont (${line.className}: ${line.pointPairs}).`);
      if (!line.finite) failures.push(`${name}: nem véges grafikonkoordináta (${line.className}).`);
      if (line.stroke === "none" || line.strokeWidth === "0px") failures.push(`${name}: nem látható grafikonvonal (${line.className}).`);
    });
    if (state.chartRect.width <= 0 || state.chartRect.height <= 0) failures.push(`${name}: a grafikon konténere 0 méretű.`);
  };

  const numericText = (value) => Number((value || "").replace(/[^\d-]/g, ""));
  const assertNear = (name, actual, expected, tolerance = 5) => {
    if (Math.abs(actual - expected) > tolerance) {
      failures.push(`${name}: ${actual} != ${expected} (+/-${tolerance})`);
    }
  };

  await setViewport(1280, 900, false);
  await resetConsent(false);
  await navigate("/kalkulatorok/etf-kalkulator.html");

  const seo = await evaluate(`(() => ({
    h1: document.querySelector('h1')?.textContent.trim(),
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    etfCssHref: document.querySelector('link[href*="css/pages/etf.css"]')?.getAttribute('href') || '',
    etfScriptSrc: document.querySelector('script[src*="js/penzugyi/etf.js"]')?.getAttribute('src') || '',
    faqCount: document.querySelectorAll('.faq-list > details').length,
    related: [...document.querySelectorAll('.etf-related-links a')].map((link) => link.getAttribute('href')),
    structured: JSON.parse(document.getElementById('kb-structured-data')?.textContent || '{}'),
  }))()`);
  if (seo.h1 !== "ETF kalkulátor") failures.push("A H1 nem maradt ETF kalkulátor.");
  if (seo.canonical !== "https://kalkulatorbazis.hu/kalkulatorok/etf-kalkulator.html") failures.push("A canonical URL megváltozott.");
  if (!seo.etfCssHref.includes("?v=20260627-2")) failures.push("Az ETF CSS nem verziózott URL-lel töltődik.");
  if (!seo.etfScriptSrc.includes("?v=20260627-2")) failures.push("Az ETF JS nem verziózott URL-lel töltődik.");
  if (seo.faqCount < 5) failures.push("Nincs legalább 5 ETF GYIK.");
  ["kamatos-kamat-kalkulator.html", "inflacio-kalkulator.html", "osztalek-kalkulator.html", "milliomos-kalkulator.html", "../penzugyi.html"].forEach((href) => {
    if (!seo.related.includes(href)) failures.push(`Hiányzó belső link: ${href}`);
  });

  await setInputs([
    ["initial", "0"],
    ["monthly", "50000"],
    ["rate", "6"],
    ["years", "20"],
    ["ter", "0"],
    ["inflation", "0"],
    ["increase", "0"],
  ]);
  await sleep(250);
  const example1 = await readEtfState();
  assertNear("1. kontrollpélda végösszeg", numericText(example1.finalText), 23102045);
  assertNear("1. kontrollpélda befizetés", numericText(example1.investedText), 12000000);
  assertNear("1. kontrollpélda nyereség", numericText(example1.profitText), 11102045);
  if (example1.scenarios !== 3) failures.push("A három hozamforgatókönyv nem jelent meg.");
  if (example1.chartPoints < 20) failures.push("A grafikon nem tartalmaz elég éves adatpontot.");
  if (example1.yearlyRows < 20) failures.push("Az éves táblázat nem tartalmaz 20 sort.");
  assertChartHealthy("A kontrollpélda grafikon", example1, 20);
  if (example1.hasNaN) failures.push("NaN vagy Infinity jelent meg az 1. kontrollpéldában.");
  if (!example1.ctaVisible) failures.push("A megtartási CTA nem jelent meg érvényes ETF számítás után.");

  await setInputs([
    ["initial", "0"],
    ["monthly", "50000"],
    ["rate", "6"],
    ["years", "20"],
    ["ter", "0,20"],
    ["inflation", "3"],
    ["increase", "0"],
  ]);
  await sleep(250);
  const exampleB = await readEtfState();
  assertNear("B kontrollpélda végösszeg", numericText(exampleB.finalText), 22562400, 25);
  assertNear("B kontrollpélda befizetés", numericText(exampleB.investedText), 12000000, 5);
  assertNear("B kontrollpélda nyereség", numericText(exampleB.profitText), 10562400, 25);
  assertNear("B kontrollpélda mai vásárlóérték", numericText(exampleB.realText), 12492254, 25);
  assertNear("B kontrollpélda TER költséghatás", numericText(exampleB.costText), 539645, 25);
  if (exampleB.chartPoints < 20 || exampleB.yearlyRows < 20) failures.push("B kontrollpélda nem adott 20 éves grafikont/táblázatot.");
  assertChartHealthy("B kontrollpélda grafikon", exampleB, 20);

  await setInputs([
    ["initial", "200000"],
    ["monthly", "15000"],
    ["rate", "7"],
    ["years", "5"],
    ["ter", "0"],
    ["inflation", "0"],
    ["increase", "0"],
  ]);
  await sleep(180);
  const example2 = await readEtfState();
  assertNear("2. kontrollpélda végösszeg", numericText(example2.finalText), 1357419);

  await evaluate(`document.querySelector('input[name="etfMode"][value="goal"]').click()`);
  await sleep(120);
  await setInputs([
    ["target", "10000000"],
    ["initial", "0"],
    ["rate", "6"],
    ["years", "20"],
    ["ter", "0"],
    ["inflation", "3"],
    ["increase", "0"],
  ]);
  await sleep(220);
  const goal = await readEtfState();
  if (numericText(goal.finalText) <= 0) failures.push("A célösszeg mód nem számolt pozitív havi befektetést.");
  if (numericText(goal.lastPortfolioText) < 10000000) failures.push("A felfelé kerekített havi befektetés nem éri el a nominális célt.");
  if (!/nominális cél|célösszeget|célidőpontban/i.test(goal.interpretation)) failures.push("A célösszeg értelmezése hiányzik.");

  await evaluate(`document.querySelector('input[name="targetType"][value="real"]').click()`);
  await sleep(180);
  const realGoal = await readEtfState();
  if (numericText(realGoal.finalText) <= numericText(goal.finalText)) {
    failures.push("Mai vásárlóértékű cél esetén nem nőtt a szükséges havi befektetés.");
  }

  await setInputs([
    ["target", "500000"],
    ["initial", "1000000"],
    ["rate", "6"],
    ["years", "10"],
    ["ter", "0"],
    ["inflation", "0"],
    ["increase", "0"],
  ]);
  await sleep(180);
  const reached = await readEtfState();
  if (numericText(reached.finalText) !== 0) failures.push("Ha a kezdőtőke eléri a célt, a havi befektetés nem 0 Ft.");

  await evaluate(`document.querySelector('input[name="etfMode"][value="future"]').click()`);
  await sleep(100);
  await setInputs([
    ["initial", "0"],
    ["monthly", "-100"],
    ["rate", "999"],
    ["years", "0"],
    ["ter", "0"],
  ]);
  await sleep(160);
  const invalid = await readEtfState();
  if (!invalid.fieldErrors.length) failures.push("Hibás ETF bevitelnél nem jelent meg mezőszintű hiba.");
  if (invalid.hasNaN) failures.push("Hibás bevitelnél NaN vagy Infinity jelent meg.");

  await resetConsent(true);
  await navigate("/kalkulatorok/etf-kalkulator.html");
  await evaluate(`window.__kbEvents = []; window.gtag = (...args) => window.__kbEvents.push(args);`);
  await setInputs([
    ["initial", "0"],
    ["monthly", "50000"],
    ["rate", "6"],
    ["years", "20"],
    ["ter", "0"],
    ["inflation", "0"],
    ["increase", "0"],
  ]);
  await sleep(1050);
  await evaluate(`document.getElementById('etfAdvanced').open = true; document.getElementById('etfAdvanced').dispatchEvent(new Event('toggle'));`);
  await evaluate(`document.getElementById('etfYearlyDetails').open = true; document.getElementById('etfYearlyDetails').dispatchEvent(new Event('toggle'));`);
  await evaluate(`document.querySelector('[data-chart-point="0"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));`);
  await evaluate(`document.querySelector('input[name="etfMode"][value="goal"]').click()`);
  await sleep(180);
  await setInputs([["target", "10000000"]]);
  await sleep(1050);
  await evaluate(`window.dispatchEvent(new Event('appinstalled'));`);
  await sleep(120);
  const analytics = await evaluate(`window.__kbEvents || []`);
  const eventNames = analytics.filter((item) => item[0] === "event").map((item) => item[1]);
  ["etf_calculate", "etf_advanced_settings_open", "etf_yearly_table_open", "etf_chart_interaction", "etf_mode_change", "etf_goal_calculate", "pwa_install_success"].forEach((eventName) => {
    if (!eventNames.includes(eventName)) failures.push(`Hiányzó analytics esemény consenttel: ${eventName}`);
  });
  const forbiddenEventPayload = JSON.stringify(analytics).match(/50000|10000000|23102045|1357419/);
  if (forbiddenEventPayload) failures.push("Pontos pénzügyi érték került analytics payloadba.");
  const calculateEventCount = eventNames.filter((name) => name === "etf_calculate").length;
  const goalCalculateEventCount = eventNames.filter((name) => name === "etf_goal_calculate").length;
  if (calculateEventCount > 2) failures.push(`Túl zajos etf_calculate mérés: ${calculateEventCount} esemény.`);
  if (goalCalculateEventCount > 1) failures.push(`Túl zajos etf_goal_calculate mérés: ${goalCalculateEventCount} esemény.`);

  await resetConsent(false);
  await navigate("/kalkulatorok/etf-kalkulator.html");
  await evaluate(`window.__kbEvents = []; window.gtag = (...args) => window.__kbEvents.push(args);`);
  await setInputs([["monthly", "60000"]]);
  await sleep(180);
  const deniedEvents = await evaluate(`(window.__kbEvents || []).filter((item) => item[0] === 'event').map((item) => item[1])`);
  if (deniedEvents.some((name) => /^etf_|^pwa_/.test(name))) {
    failures.push("Analytics consent nélkül ETF/PWA esemény ment ki.");
  }

  const responsive = [];
  for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
    await setViewport(width, width < 700 ? 820 : 900, width < 768);
    await navigate("/kalkulatorok/etf-kalkulator.html");
    await setInputs([["monthly", "50000"]]);
    await sleep(140);
    await client.send("Emulation.setEmulatedMedia", {
      media: "screen",
      features: [{ name: "prefers-color-scheme", value: width % 2 ? "light" : "dark" }],
    });
    const layout = await evaluate(`(() => {
      document.querySelector('[data-chart-point="0"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const root = document.documentElement;
      const labels = [...document.querySelectorAll('.card-calculator input:not([type="radio"])')].every((input) => !!document.querySelector('label[for="' + input.id + '"]'));
      return {
        width: root.clientWidth,
        scrollWidth: root.scrollWidth,
        labels,
        chart: !!document.querySelector('[data-chart-point]'),
        tooltip: !document.getElementById('etfChartTooltip')?.hidden,
      };
    })()`);
    responsive.push({ viewport: width, ...layout });
    if (layout.scrollWidth > layout.width) failures.push(`Vízszintes overflow ETF oldalon ${width}px szélességnél.`);
    if (!layout.labels) failures.push(`Hiányzó label ${width}px szélességnél.`);
    if (!layout.chart) failures.push(`Hiányzó grafikon ${width}px szélességnél.`);
  }

  const result = {
    summary: {
      failures: failures.length,
      consoleMessages: consoleMessages.length,
      events: [...new Set(eventNames)],
      responsiveChecks: responsive.length,
    },
    seo,
    example1,
    exampleB,
    example2,
    goal,
    realGoal,
    reached,
    invalid,
    analyticsEvents: analytics,
    deniedEvents,
    responsive,
    failures,
    consoleMessages: [...new Set(consoleMessages)],
  };

  client.close();
  return result;
};

run()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    processHandle.kill();
    if (result.failures.length || result.consoleMessages.length) process.exitCode = 1;
  })
  .catch((error) => {
    processHandle.kill();
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const chromeCandidates = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
];
const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) throw new Error("Nem található Chrome vagy Edge a böngészős QA futtatásához.");

const port = 9333;
const origin = "http://127.0.0.1:5500";
const profile = path.join(os.tmpdir(), `kb-chrome-qa-${Date.now()}`);
const screenshotDirectory = path.join(os.tmpdir(), "kb-browser-qa");
fs.mkdirSync(screenshotDirectory, { recursive: true });

const processHandle = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--disable-background-networking",
    "--disable-default-apps",
    "--no-first-run",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank"
  ],
  { stdio: "ignore", windowsHide: true }
);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const waitForDebugger = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch (error) {
      // Chrome még indul.
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
    once(method, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Esemény időtúllépés: ${method}`)), timeout);
        const listener = (params) => {
          clearTimeout(timer);
          listeners.set(method, (listeners.get(method) || []).filter((item) => item !== listener));
          resolve(params);
        };
        this.on(method, listener);
      });
    },
    send(method, params = {}) {
      id += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close() {
      socket.close();
    }
  };
};

const run = async () => {
  await waitForDebugger();
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${origin}/index.html`)}`, {
    method: "PUT"
  });
  const target = await targetResponse.json();
  const client = await createClient(target.webSocketDebuggerUrl);
  const consoleErrors = [];

  client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    consoleErrors.push(exceptionDetails.exception?.description || exceptionDetails.text || "Ismeretlen JavaScript-kivétel");
  });
  client.on("Log.entryAdded", ({ entry }) => {
    if (["error", "warning"].includes(entry.level) && !/google|doubleclick|adsbygoogle/i.test(entry.url || entry.text)) {
      consoleErrors.push(`${entry.level}: ${entry.url || "(nincs URL)"} - ${entry.text}`);
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
      "*googletagmanager.com/*"
    ]
  });

  const evaluate = async (expression) => {
    const result = await client.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  };

  const setViewport = async (width, height) => {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
      screenWidth: width,
      screenHeight: height
    });
  };

  const navigate = async (pagePath) => {
    const loaded = client.once("Page.loadEventFired", 12000).catch(() => null);
    await client.send("Page.navigate", { url: `${origin}${pagePath}` });
    await loaded;
    await sleep(350);
  };

  const layoutExpression = `(() => {
    const root = document.documentElement;
    const width = root.clientWidth;
    const offenders = [...document.body.querySelectorAll('*')].filter((element) => {
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 1 && (rect.right > width + 1 || rect.left < -1);
    }).slice(0, 8).map((element) => ({
      tag: element.tagName.toLowerCase(),
      id: element.id,
      className: typeof element.className === 'string' ? element.className : '',
      left: Math.round(element.getBoundingClientRect().left),
      right: Math.round(element.getBoundingClientRect().right),
      width: Math.round(element.getBoundingClientRect().width)
    }));
    return {
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      clientWidth: width,
      scrollWidth: root.scrollWidth,
      offenders
    };
  })()`;

  const pages = [
    "/index.html",
    "/penzugyi.html",
    "/epitoipari.html",
    "/egeszseg.html",
    "/mindennapi.html",
    "/auto.html",
    "/atvaltok.html",
    "/kalkulatorok.html",
    "/landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
    "/landing-pages/wise/wise.html"
  ];
  const viewports = [
    [320, 720],
    [375, 812],
    [390, 844],
    [768, 900],
    [1024, 900],
    [1440, 1000]
  ];
  const layouts = [];

  for (const [width, height] of viewports) {
    await setViewport(width, height);
    for (const pagePath of pages) {
      await navigate(pagePath);
      const layout = await evaluate(layoutExpression);
      layouts.push({ page: pagePath, width, ...layout });

      if (pagePath === "/index.html") {
        const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
        fs.writeFileSync(path.join(screenshotDirectory, `index-${width}.png`), Buffer.from(screenshot.data, "base64"));
      }

      if (
        width === 390 &&
        [
          "/penzugyi.html",
          "/landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
          "/landing-pages/wise/wise.html"
        ].includes(pagePath)
      ) {
        const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
        const name = pagePath.includes("penzugyi-tudatossag")
          ? "penzugyi-tudatossag-390.png"
          : pagePath.includes("wise")
            ? "wise-390.png"
            : "penzugyi-kategoria-390.png";
        fs.writeFileSync(path.join(screenshotDirectory, name), Buffer.from(screenshot.data, "base64"));
      }
    }
  }

  await setViewport(390, 844);
  await navigate("/index.html");
  const search = await evaluate(`(async () => {
    const input = document.getElementById('calculatorSearch');
    const run = async (query) => {
      input.value = query;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 30));
      return [...document.querySelectorAll('.search-result strong')].map((item) => item.textContent.trim());
    };
    const accentless = await run('epitoanyag');
    const ranked = await run('etf');
    const empty = await run('nincsilyenkereses123');
    const emptyText = document.querySelector('.search-empty')?.textContent.trim() || '';
    input.value = 'netto';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    const active = input.getAttribute('aria-activedescendant');
    let enterTarget = '';
    document.getElementById('calculatorSearchResults').addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      event.preventDefault();
      enterTarget = link.getAttribute('href');
    }, { once: true, capture: true });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 10));
    return { accentless, ranked, empty, emptyText, active, enterTarget, expanded: input.getAttribute('aria-expanded') };
  })()`);

  const interactions = await evaluate(`(async () => {
    const menuButton = document.getElementById('menuToggle');
    menuButton?.click();
    const menuOpened = menuButton?.getAttribute('aria-expanded');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const menuClosed = menuButton?.getAttribute('aria-expanded');
    const details = [...document.querySelectorAll('.faq-list details')];
    details[0]?.querySelector('summary')?.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    details[1]?.querySelector('summary')?.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    const openFaqCount = details.filter((item) => item.open).length;
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieVisibleBefore = cookieBanner ? getComputedStyle(cookieBanner).display !== 'none' : false;
    document.getElementById('decline-cookies')?.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    const cookieStored = localStorage.getItem('cookieConsent');
    const cookieVisibleAfter = cookieBanner ? getComputedStyle(cookieBanner).display !== 'none' : false;
    return { menuOpened, menuClosed, openFaqCount, cookieVisibleBefore, cookieStored, cookieVisibleAfter };
  })()`);

  const landingInteractions = [];
  for (const pagePath of [
    "/landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
    "/landing-pages/wise/wise.html"
  ]) {
    await navigate(pagePath);
    landingInteractions.push({
      page: pagePath,
      ...(await evaluate(`(async () => {
        const buttons = [...document.querySelectorAll('.faq-question')];
        buttons[0]?.click();
        await new Promise((resolve) => setTimeout(resolve, 10));
        buttons[1]?.click();
        await new Promise((resolve) => setTimeout(resolve, 10));
        const expandedFaqCount = buttons.filter((button) => button.getAttribute('aria-expanded') === 'true').length;
        const menu = document.querySelector('.menu-toggle');
        menu?.click();
        const menuOpened = menu?.getAttribute('aria-expanded');
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        const menuClosed = menu?.getAttribute('aria-expanded');
        return { expandedFaqCount, menuOpened, menuClosed };
      })()`))
    });
  }

  const calculatorTests = [
    ["/kalkulatorok/netto-brutto-kalkulator.html", `(() => { const e=document.getElementById('gross'); e.value='500000'; e.dispatchEvent(new Event('input',{bubbles:true})); return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/beton-kalkulator.html", `(() => { [['length','10'],['width','5'],['depth','20']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));}); return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/bmi-kalkulator.html", `(() => { [['weight','75'],['height','175']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));}); return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/szazalek-kalkulator.html", `(() => { const a=document.getElementById('a');const b=document.getElementById('b');a.value='200';b.value='10';b.dispatchEvent(new Event('input',{bubbles:true}));return document.getElementById('result1')?.innerText; })()`],
    ["/kalkulatorok/auto-kalkulator.html", `(() => { [['distance','650'],['fuelUsed','42']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));});return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/hosszusag-atvalto-kalkulator.html", `(() => { const e=document.getElementById('inputValue');e.value='100';e.dispatchEvent(new Event('input',{bubbles:true}));return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/kamatos-kamat-kalkulator.html", `(() => { [['initial','100000'],['monthly','20000'],['rate','7'],['years','10']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));});return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/milliomos-kalkulator.html", `(() => { [['initial','100000'],['monthly','50000'],['rate','7'],['goal','1000000']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));});return document.querySelector('.result-box')?.innerText; })()`]
  ];
  const calculators = [];
  for (const [pagePath, expression] of calculatorTests) {
    await navigate(pagePath);
    calculators.push({ page: pagePath, result: await evaluate(expression) });
  }

  const result = {
    summary: {
      layoutChecks: layouts.length,
      overflowFailures: layouts.filter((item) => item.scrollWidth > item.clientWidth || item.offenders.length).length,
      consoleErrors: consoleErrors.length
    },
    layoutFailures: layouts.filter((item) => item.scrollWidth > item.clientWidth || item.offenders.length),
    search,
    interactions,
    landingInteractions,
    calculators,
    consoleErrors: [...new Set(consoleErrors)],
    screenshots: screenshotDirectory
  };

  client.close();
  return result;
};

run()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    processHandle.kill();
  })
  .catch((error) => {
    processHandle.kill();
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });

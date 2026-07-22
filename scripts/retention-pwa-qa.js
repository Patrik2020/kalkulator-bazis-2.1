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
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) {
  throw new Error("Nem található Chrome/Chromium. CHROME_PATH változóval megadható.");
}

const chromeExtraArgs = (process.env.CHROME_EXTRA_ARGS || "")
  .split(/\s+/)
  .map((arg) => arg.trim())
  .filter(Boolean);
const port = 9666;
const origin = "http://127.0.0.1:5500";
const profile = path.join(os.tmpdir(), `kb-retention-pwa-${Date.now()}`);
const processHandle = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-default-apps",
    "--disable-background-networking",
    "--no-first-run",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    ...chromeExtraArgs,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true }
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForDebugger = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch (error) {
      // Browser is still starting.
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

const consentRecord = (categories) =>
  JSON.stringify({
    version: "2026-06-26.v2",
    categories: {
      necessary: true,
      analytics: Boolean(categories.analytics),
      ads: Boolean(categories.ads),
    },
    decidedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  });

const calculatorSamples = [
  {
    page: "/kalkulatorok/netto-brutto-kalkulator.html",
    kind: "pénzügyi",
    action:
      "[['gross','500000']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/hitel-torleszto-kalkulator.html",
    kind: "hitel",
    action:
      "[['amount','5000000'],['rate','8'],['years','20']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/hitelkepesseg-kalkulator.html",
    kind: "hitelképesség",
    action:
      "[['income','450000'],['existing','50000'],['rate','8'],['years','20']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/bmi-kalkulator.html",
    kind: "egészség",
    action:
      "[['weight','75'],['height','175']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/kaloria-kalkulator.html",
    kind: "egészség hosszabb",
    action:
      "[['weight','75'],['height','175'],['age','30']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/auto-kalkulator.html",
    kind: "autó",
    action:
      "[['distance','650'],['fuelUsed','42']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/beton-kalkulator.html",
    kind: "építőipari",
    action:
      "[['length','10'],['width','5'],['depth','20']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/festek-kalkulator.html",
    kind: "építőipari hosszabb",
    action:
      "[['roomLength','5'],['roomWidth','4'],['roomHeight','2.8'],['layers','2'],['coverage','10']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/csempe-kalkulator.html",
    kind: "építőipari",
    action:
      "[['width','3'],['height','2.5'],['tileWidth','30'],['tileHeight','30']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/hosszusag-atvalto-kalkulator.html",
    kind: "átváltó",
    action:
      "const e=document.getElementById('inputValue');e.value='100';e.dispatchEvent(new Event('input',{bubbles:true}))",
  },
  {
    page: "/kalkulatorok/deviza-atvalto-kalkulator.html",
    kind: "külső API",
    action:
      "const e=document.getElementById('inputValue');e.value='123';e.dispatchEvent(new Event('input',{bubbles:true}))",
    extraWait: 900,
  },
  {
    page: "/kalkulatorok/kamatos-kamat-kalkulator.html",
    kind: "pénzügyi wise",
    action:
      "[['initial','100000'],['monthly','20000'],['rate','7'],['years','10']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/etf-kalkulator.html",
    kind: "pénzügyi wise",
    action:
      "[['initial','500000'],['monthly','30000'],['rate','6'],['years','12']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/uzemanyag-koltseg-kalkulator.html",
    kind: "autós egyszerű",
    action:
      "[['distance','420'],['consumption','6.5'],['price','620']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));})",
  },
  {
    page: "/kalkulatorok/szamla-teljesites-kalkulator.html",
    kind: "mindennapi dátum",
    action:
      "document.getElementById('issueDate').value='2026-06-01';document.getElementById('performanceDate').value='2026-06-01';const e=document.getElementById('days');e.value='30';e.dispatchEvent(new Event('input',{bubbles:true}))",
  },
];

const run = async () => {
  await waitForDebugger();
  const targetResponse = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${origin}/`)}`,
    { method: "PUT" }
  );
  const target = await targetResponse.json();
  const client = await createClient(target.webSocketDebuggerUrl);
  const logs = [];

  client.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
    logs.push(exceptionDetails.exception?.description || exceptionDetails.text);
  });
  client.on("Runtime.consoleAPICalled", ({ type, args }) => {
    if (["error", "warning"].includes(type)) {
      logs.push(args.map((arg) => arg.value || arg.description || "").join(" "));
    }
  });
  client.on("Log.entryAdded", ({ entry }) => {
    if (["error", "warning"].includes(entry.level) && !/google|doubleclick|adsbygoogle/i.test(entry.text || entry.url || "")) {
      logs.push(entry.text || entry.url || entry.level);
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
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  };
  const runAction = (action) => evaluate(`(() => { ${action}; })()`);

  const setViewport = async (width, height = 900, mobile = width < 768) => {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: width,
      screenHeight: height,
    });
  };

  const navigate = async (pagePath) => {
    await client.send("Page.navigate", { url: `${origin}${pagePath}` });
    await sleep(850);
  };

  const setConsent = async (analytics = false, ads = false) => {
    await evaluate(
      `localStorage.setItem('kbCookieConsent', ${JSON.stringify(
        consentRecord({ analytics, ads })
      )}); localStorage.removeItem('cookieConsent');`
    );
  };

  const getCtaState = () =>
    evaluate(`(() => {
      const cta = document.querySelector('[data-retention-cta]');
      const root = document.documentElement;
      return {
        exists: !!cta,
        hidden: cta ? cta.hasAttribute('hidden') : null,
        slogan: cta?.querySelector('h2')?.textContent.trim() || '',
        buttonCount: cta ? [...cta.querySelectorAll('button')].filter((button) => !button.hidden && getComputedStyle(button).display !== 'none').length : 0,
        inCalculator: !!cta?.closest('.card-calculator'),
        ctaCount: document.querySelectorAll('[data-retention-cta]').length,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        activeInside: !!cta?.contains(document.activeElement)
      };
    })()`);

  const manifestResponse = await fetch(`${origin}/manifest.webmanifest`);
  const manifest = await manifestResponse.json();
  const iconChecks = await Promise.all(
    manifest.icons.map(async (icon) => {
      const response = await fetch(new URL(icon.src, `${origin}/manifest.webmanifest`));
      return { src: icon.src, status: response.status };
    })
  );

  await setViewport(390, 844);
  await navigate("/");
  await evaluate(`localStorage.clear(); caches.keys().then((keys)=>Promise.all(keys.map((key)=>caches.delete(key))))`);
  await sleep(300);

  const calculatorResults = [];
  for (const sample of calculatorSamples) {
    await setViewport(390, 844);
    await navigate(sample.page);
    await setConsent(false, false);
    await navigate(sample.page);
    const before = await getCtaState();
    await runAction(sample.action);
    await sleep(sample.extraWait || 700);
    const after = await getCtaState();
    await runAction(sample.action);
    await sleep(250);
    const afterRecalc = await getCtaState();
    calculatorResults.push({
      page: sample.page,
      kind: sample.kind,
      before,
      after,
      afterRecalc,
    });
  }

  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await setConsent(false, false);
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await evaluate(`const e=document.getElementById('gross'); e.value=''; e.dispatchEvent(new Event('input',{bubbles:true}))`);
  await sleep(400);
  const invalidInput = await getCtaState();

  const bookmarkChecks = [];
  const bookmarkPlatforms = [
    {
      name: "windows",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      platform: "Win32",
      expected: "Ctrl + D",
    },
    {
      name: "macos",
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15",
      platform: "MacIntel",
      expected: "⌘ + D",
    },
    {
      name: "iphone",
      ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1",
      platform: "iPhone",
      expected: "Kedvencekhez",
    },
    {
      name: "android",
      ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36",
      platform: "Linux armv8l",
      expected: "Könyvjelző hozzáadása",
    },
  ];

  for (const platform of bookmarkPlatforms) {
    await client.send("Emulation.setUserAgentOverride", {
      userAgent: platform.ua,
      platform: platform.platform,
    });
    await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
    await setConsent(true, false);
    await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
    await runAction(calculatorSamples[0].action);
    await sleep(500);
    await evaluate(`window.__kbEvents=[]; window.gtag=(...args)=>window.__kbEvents.push(args); document.querySelector('[data-retention-action="bookmark"]').click()`);
    await sleep(100);
    bookmarkChecks.push({
      platform: platform.name,
      ...(await evaluate(`(() => {
        const button = document.querySelector('[data-retention-action="bookmark"]');
        const text = document.querySelector('[data-retention-bookmark-text]')?.textContent || '';
        return {
          expanded: button?.getAttribute('aria-expanded'),
          text,
          expectedFound: text.includes(${JSON.stringify(platform.expected)}),
          events: window.__kbEvents || []
        };
      })()`)),
    });
  }

  await client.send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
    platform: "Win32",
  });

  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await setConsent(true, false);
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await runAction(calculatorSamples[0].action);
  await sleep(500);
  const installUnsupported = await evaluate(`(() => {
    const button = document.querySelector('[data-retention-action="install"]');
    return {
      hidden: !button || button.hidden || getComputedStyle(button).display === 'none',
      canInstall: !!window.KB_PWA?.canInstall?.()
    };
  })()`);
  const installPromptBefore = await evaluate(`(() => {
    try {
      Object.defineProperty(navigator, 'userActivation', {
        value: { isActive: true },
        configurable: true
      });
    } catch (error) {}
    const event = new Event('beforeinstallprompt');
    event.prompt = () => { window.__promptCalled = true; };
    event.userChoice = Promise.resolve({ outcome: 'dismissed', platform: 'web' });
    event.preventDefault = () => {};
    window.dispatchEvent(event);
    window.__kbEvents = [];
    window.gtag = (...args) => window.__kbEvents.push(args);
    const button = document.querySelector('[data-retention-action="install"]');
    button?.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = button?.getBoundingClientRect();
    return {
      beforeHidden: !button || button.hidden || getComputedStyle(button).display === 'none',
      x: rect ? rect.left + rect.width / 2 : 0,
      y: rect ? rect.top + rect.height / 2 : 0
    };
  })()`);
  if (!installPromptBefore.beforeHidden) {
    await client.send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: installPromptBefore.x,
      y: installPromptBefore.y,
      button: "left",
      clickCount: 1,
    });
    await client.send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: installPromptBefore.x,
      y: installPromptBefore.y,
      button: "left",
      clickCount: 1,
    });
  }
  await sleep(140);
  const installPrompt = await evaluate(`(() => ({
    beforeHidden: ${JSON.stringify(installPromptBefore.beforeHidden)},
    promptCalled: !!window.__promptCalled,
    status: document.querySelector('[data-retention-status]')?.textContent || '',
    events: window.__kbEvents || []
  }))()`);

  await client.send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1",
    platform: "iPhone",
  });
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await setConsent(false, false);
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await runAction(calculatorSamples[0].action);
  await sleep(500);
  const iosInstall = await evaluate(`(() => {
    const button = document.querySelector('[data-retention-action="install"]');
    button?.click();
    return {
      visible: !!button && !button.hidden && getComputedStyle(button).display !== 'none',
      label: button?.textContent.trim() || '',
      expanded: button?.getAttribute('aria-expanded') || '',
      guide: document.querySelector('[data-retention-install-text]')?.textContent || ''
    };
  })()`);

  await client.send("Emulation.setUserAgentOverride", {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
    platform: "Win32",
  });
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await setConsent(true, false);
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await runAction(calculatorSamples[0].action);
  await sleep(500);
  const shareClipboard = await evaluate(`(async () => {
    window.__kbEvents = [];
    window.gtag = (...args) => window.__kbEvents.push(args);
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (value) => { window.__copied = value; } }, configurable: true });
    document.querySelector('[data-retention-action="share"]').click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    return {
      copied: window.__copied || '',
      status: document.querySelector('[data-retention-status]')?.textContent || '',
      events: window.__kbEvents
    };
  })()`);
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await setConsent(false, false);
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await runAction(calculatorSamples[0].action);
  await sleep(500);
  const shareNoConsent = await evaluate(`(async () => {
    window.__kbEvents = [];
    window.gtag = (...args) => window.__kbEvents.push(args);
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (value) => { window.__copied = value; } }, configurable: true });
    document.querySelector('[data-retention-action="share"]').click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    return { copied: window.__copied || '', events: window.__kbEvents };
  })()`);
  const shareManual = await evaluate(`(async () => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('blocked'); } }, configurable: true });
    document.querySelector('[data-retention-action="share"]').click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const input = document.querySelector('[data-retention-share-url]');
    return { visible: !input.closest('[hidden]'), value: input.value };
  })()`);

  await navigate("/");
  await sleep(1200);
  const pwaRuntime = await evaluate(`(async () => {
    const registration = await navigator.serviceWorker?.ready?.catch(() => null);
    const keys = await caches.keys();
    const requests = [];
    for (const key of keys) {
      const cache = await caches.open(key);
      const cached = await cache.keys();
      requests.push(...cached.map((request) => request.url));
    }
    return {
      manifestHref: document.querySelector('link[rel="manifest"]')?.href || '',
      pwaState: window.KB_PWA?.getState?.() || null,
      swScope: registration?.scope || '',
      cacheKeys: keys,
      forbiddenCached: requests.filter((url) => /googletagmanager|googlesyndication|doubleclick|wise-|frankfurter\\.dev/i.test(url))
    };
  })()`);

  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
  });
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await sleep(700);
  await navigate("/kalkulatorok/deviza-atvalto-kalkulator.html");
  await sleep(1200);
  await client.send("Network.emulateNetworkConditions", {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  });
  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  await sleep(1000);
  await runAction(calculatorSamples[0].action);
  await sleep(300);
  const offlineLocalCalculator = await evaluate(`(() => ({
    title: document.querySelector('h1')?.textContent.trim() || '',
    result: document.getElementById('result-net')?.textContent || '',
    hasCta: !!document.querySelector('[data-retention-cta]')
  }))()`);
  await navigate("/kalkulatorok/deviza-atvalto-kalkulator.html");
  await sleep(1500);
  const offlineExternalCalculator = await evaluate(`(() => ({
    title: document.querySelector('h1')?.textContent.trim() || '',
    result: document.getElementById('result')?.textContent || '',
    lastUpdate: document.getElementById('lastUpdate')?.textContent || ''
  }))()`);
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
  });

  const responsiveChecks = [];
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
    await setViewport(width, width < 768 ? 844 : 900);
    await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
    await setConsent(false, false);
    await evaluate(`localStorage.setItem('kalkulatorbazis-theme','dark')`);
    await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
    await runAction(calculatorSamples[0].action);
    await sleep(500);
    await evaluate(`document.querySelector('[data-retention-action="bookmark"]').click()`);
    responsiveChecks.push(await evaluate(`(() => {
      const root = document.documentElement;
      return {
        width: root.clientWidth,
        overflow: root.scrollWidth > root.clientWidth,
        ctaVisible: !document.querySelector('[data-retention-cta]')?.hidden,
        buttons: [...document.querySelectorAll('.retention-cta-button')].filter((button) => !button.hidden && getComputedStyle(button).display !== 'none').length,
        guideOpen: !document.querySelector('[data-retention-guide="bookmark"]')?.hidden,
        theme: document.documentElement.dataset.theme
      };
    })()`));
  }

  const failures = [];
  calculatorResults.forEach((item) => {
    if (!item.before.exists || item.before.hidden !== true) failures.push(`${item.page}: CTA nincs rejtve induláskor`);
    if (item.after.hidden !== false) failures.push(`${item.page}: CTA nem jelent meg érvényes eredmény után`);
    if (item.after.ctaCount !== 1 || item.afterRecalc.ctaCount !== 1) failures.push(`${item.page}: CTA duplikáció`);
    if (item.after.activeInside) failures.push(`${item.page}: CTA fókuszt lopott`);
    if (item.after.scrollWidth > item.after.clientWidth) failures.push(`${item.page}: CTA overflow`);
  });
  if (invalidInput.hidden === false) failures.push("Hibás/üres inputnál megjelent a CTA");
  bookmarkChecks.forEach((item) => {
    if (item.expanded !== "true" || !item.expectedFound) failures.push(`Könyvjelző útmutató hiba: ${item.platform}`);
  });
  if (!installUnsupported.canInstall && !installUnsupported.hidden) failures.push("Telepítési gomb prompt nélkül látható desktopon");
  if (installPrompt.beforeHidden || !installPrompt.promptCalled) failures.push("beforeinstallprompt telepítési gomb/prompt hiba");
  if (!iosInstall.visible || !/Főképernyőhöz/.test(iosInstall.label + iosInstall.guide)) failures.push("iOS főképernyős útmutató hiba");
  if (!shareClipboard.copied.startsWith("https://kalkulatorbazis.hu/")) failures.push("Clipboard fallback nem publikus URL-t másolt");
  if (shareClipboard.events.length !== 1) failures.push("Share clipboard analytics esemény hiba consenttel");
  if (shareNoConsent.events.length !== 0) failures.push("Share analytics consent nélkül elküldődött");
  if (!shareManual.visible || !shareManual.value.startsWith("https://kalkulatorbazis.hu/")) failures.push("Manual share fallback hiba");
  if (manifest.lang !== "hu-HU" || manifest.display !== "standalone") failures.push("Manifest kötelező mező hiba");
  iconChecks.forEach((icon) => {
    if (icon.status !== 200) failures.push(`Manifest ikon nem elérhető: ${icon.src}`);
  });
  if (!pwaRuntime.swScope) failures.push("Service worker nem regisztrált");
  if (pwaRuntime.forbiddenCached.length) failures.push("Tiltott külső kérés cache-ben: " + pwaRuntime.forbiddenCached.join(", "));
  if (!/Nettó/i.test(offlineLocalCalculator.title) || !/\d/.test(offlineLocalCalculator.result)) {
    failures.push("Offline helyi kalkulátor nem működött meglátogatás után");
  }
  if (!/internetkapcsolat|nem sikerült|nincs friss adat/i.test(`${offlineExternalCalculator.result} ${offlineExternalCalculator.lastUpdate}`)) {
    failures.push("Offline külső API kalkulátor nem adott érthető frissadat-hibát");
  }
  responsiveChecks.forEach((item) => {
    if (item.overflow || !item.ctaVisible || !item.guideOpen) failures.push(`Responsive CTA hiba ${item.width}px`);
  });
  logs
    .filter((line) => !/Manifest: property|ERR_INTERNET_DISCONNECTED/i.test(line))
    .forEach((line) => failures.push(`Konzolhiba/figyelmeztetés: ${line}`));

  client.close();
  return {
    summary: {
      calculatorSamples: calculatorResults.length,
      failures: failures.length,
      consoleMessages: logs.length,
    },
    manifest: {
      status: manifestResponse.status,
      contentType: manifestResponse.headers.get("content-type") || "",
      name: manifest.name,
      lang: manifest.lang,
      display: manifest.display,
      iconChecks,
    },
    calculatorResults,
    invalidInput,
    bookmarkChecks,
    installUnsupported,
    installPrompt,
    iosInstall,
    shareClipboard,
    shareNoConsent,
    shareManual,
    pwaRuntime,
    offlineLocalCalculator,
    offlineExternalCalculator,
    responsiveChecks,
    failures,
    logs,
  };
};

run()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
    processHandle.kill();
    if (result.failures.length) process.exitCode = 1;
  })
  .catch((error) => {
    processHandle.kill();
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });

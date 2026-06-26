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
  "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium",
  "/usr/bin/microsoft-edge"
].filter(Boolean);
const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) {
  throw new Error(
    [
      "Nem található Chrome/Chromium/Edge a böngészős QA futtatásához.",
      "Állítsd be a CHROME_PATH környezeti változót, vagy telepíts egy támogatott böngészőt.",
      `Ellenőrzött útvonalak: ${chromeCandidates.join(", ")}`
    ].join("\n")
  );
}

const port = 9333;
const origin = "http://127.0.0.1:5500";
const profile = path.join(os.tmpdir(), `kb-chrome-qa-${Date.now()}`);
const screenshotDirectory = path.join(os.tmpdir(), "kb-browser-qa");
fs.mkdirSync(screenshotDirectory, { recursive: true });
const chromeExtraArgs = (process.env.CHROME_EXTRA_ARGS || "")
  .split(/\s+/)
  .map((arg) => arg.trim())
  .filter(Boolean);

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
    ...chromeExtraArgs,
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
    "/atlathatosag-es-minoseg.html",
    "/adatvedelem.html",
    "/landing-pages/penzugyi-tudatossag/penzugyi-tudatossag.html",
    "/landing-pages/wise/wise.html",
    "/landing-pages/wise/kapcsolat.html"
  ];
  const viewports = [
    [320, 720],
    [360, 780],
    [375, 812],
    [390, 844],
    [430, 932],
    [768, 900],
    [860, 900],
    [880, 900],
    [900, 900],
    [920, 900],
    [940, 900],
    [960, 900],
    [980, 900],
    [1024, 900],
    [1440, 1000]
  ];
  const layouts = [];
  const consentRecord = (categories, overrides = {}) => {
    const decidedAt = overrides.decidedAt || new Date().toISOString();
    const expiresAt =
      overrides.expiresAt ||
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();

    return JSON.stringify({
      version: overrides.version || "2026-06-26.v2",
      categories: { necessary: true, analytics: !!categories.analytics, ads: !!categories.ads },
      decidedAt,
      expiresAt
    });
  };

  const collectConsentState = async () =>
    evaluate(`(() => {
      const safeParse = (value) => {
        try { return JSON.parse(value || 'null'); } catch (error) { return null; }
      };
      const banner = document.getElementById('cookie-banner');
      const manager = window.KB_CONSENT_MANAGER;
      const scripts = [...document.scripts].map((script) => script.src).filter(Boolean);
      return {
        modalVisible: !!banner && getComputedStyle(banner).display !== 'none',
        managerReady: !!manager?.isReady,
        managerAnalytics: !!manager?.hasConsent?.('analytics'),
        managerAds: !!manager?.hasConsent?.('ads'),
        storedRecord: safeParse(localStorage.getItem('kbCookieConsent')),
        rawRecord: localStorage.getItem('kbCookieConsent'),
        legacyRecord: localStorage.getItem('cookieConsent'),
        googleTagManagerScripts: scripts.filter((src) => src.includes('googletagmanager.com/gtag/js')).length,
        adsenseScripts: scripts.filter((src) => src.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')).length,
        wiseCreativeImages: [...document.images].filter((image) => image.src.includes('wise-creative.prf.hn')).length,
        latestConsentCommand: (window.dataLayer || []).filter((item) => item && item[0] === 'consent').slice(-1)[0] || null
      };
    })()`);

  const consentCases = [
    {
      name: "no_record",
      setup: "",
      expected: { modalVisible: true, analytics: false, ads: false, legacyRemoved: true }
    },
    {
      name: "invalid_json",
      setup: "localStorage.setItem('kbCookieConsent', '{hibas-json');",
      expected: { modalVisible: true, analytics: false, ads: false, storedRecord: false }
    },
    {
      name: "expired_record",
      setup: `localStorage.setItem('kbCookieConsent', ${JSON.stringify(
        consentRecord(
          { analytics: true, ads: true },
          {
            decidedAt: "2026-01-01T00:00:00.000Z",
            expiresAt: "2026-01-02T00:00:00.000Z"
          }
        )
      )});`,
      expected: { modalVisible: true, analytics: false, ads: false, storedRecord: false }
    },
    {
      name: "old_version_record",
      setup: `localStorage.setItem('kbCookieConsent', ${JSON.stringify(
        consentRecord({ analytics: true, ads: true }, { version: "2026-06-25.v1" })
      )});`,
      expected: { modalVisible: true, analytics: false, ads: false, storedRecord: false }
    },
    {
      name: "malformed_categories",
      setup: `localStorage.setItem('kbCookieConsent', JSON.stringify({
        version: '2026-06-26.v2',
        categories: { necessary: true, analytics: 'yes', ads: true },
        decidedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
      }));`,
      expected: { modalVisible: true, analytics: false, ads: false, storedRecord: false }
    },
    {
      name: "legacy_accepted_migrates_once",
      setup: "localStorage.setItem('cookieConsent', 'accepted');",
      expected: { modalVisible: false, analytics: true, ads: true, legacyRemoved: true, storedRecord: true }
    },
    {
      name: "legacy_declined_migrates_once",
      setup: "localStorage.setItem('cookieConsent', 'declined');",
      expected: { modalVisible: false, analytics: false, ads: false, legacyRemoved: true, storedRecord: true }
    },
    {
      name: "valid_analytics_only",
      setup: `localStorage.setItem('kbCookieConsent', ${JSON.stringify(
        consentRecord({ analytics: true, ads: false })
      )});`,
      expected: { modalVisible: false, analytics: true, ads: false, storedRecord: true }
    },
    {
      name: "valid_ads_only",
      setup: `localStorage.setItem('kbCookieConsent', ${JSON.stringify(
        consentRecord({ analytics: false, ads: true })
      )});`,
      expected: { modalVisible: false, analytics: false, ads: true, storedRecord: true }
    },
    {
      name: "valid_denied",
      setup: `localStorage.setItem('kbCookieConsent', ${JSON.stringify(
        consentRecord({ analytics: false, ads: false })
      )});`,
      expected: { modalVisible: false, analytics: false, ads: false, storedRecord: true }
    }
  ];

  const consentMatrix = [];
  for (const testCase of consentCases) {
    await setViewport(390, 844);
    await navigate("/index.html");
    await evaluate(`localStorage.removeItem('kbCookieConsent'); localStorage.removeItem('cookieConsent'); ${testCase.setup}`);
    await navigate("/index.html");
    await sleep(250);
    const state = await collectConsentState();
    consentMatrix.push({ name: testCase.name, expected: testCase.expected, ...state });
  }

  const consentMatrixFailures = consentMatrix.flatMap((item) => {
    const failures = [];

    if (item.expected.modalVisible !== undefined && item.modalVisible !== item.expected.modalVisible) {
      failures.push(`${item.name}: modalVisible ${item.modalVisible} != ${item.expected.modalVisible}`);
    }

    if (item.managerReady !== true) {
      failures.push(`${item.name}: consent manager nem állt készen`);
    }

    if (item.managerAnalytics !== item.expected.analytics) {
      failures.push(`${item.name}: analytics consent ${item.managerAnalytics} != ${item.expected.analytics}`);
    }

    if (item.managerAds !== item.expected.ads) {
      failures.push(`${item.name}: ads consent ${item.managerAds} != ${item.expected.ads}`);
    }

    if (item.expected.analytics === false && item.googleTagManagerScripts > 0) {
      failures.push(`${item.name}: analytics script tiltott állapotban betöltött`);
    }

    if (item.expected.ads === false && (item.adsenseScripts > 0 || item.wiseCreativeImages > 0)) {
      failures.push(`${item.name}: marketing/ads tartalom tiltott állapotban betöltött`);
    }

    if (item.expected.analytics === true && item.googleTagManagerScripts === 0) {
      failures.push(`${item.name}: analytics engedélyezve, de nincs gtag script`);
    }

    if (item.expected.ads === true && item.adsenseScripts === 0) {
      failures.push(`${item.name}: ads engedélyezve, de nincs AdSense script`);
    }

    if (item.expected.legacyRemoved && item.legacyRecord !== null) {
      failures.push(`${item.name}: legacy cookieConsent kulcs megmaradt`);
    }

    if (item.expected.storedRecord === false && item.rawRecord !== null) {
      failures.push(`${item.name}: érvénytelen rekord nem lett eltávolítva`);
    }

    if (item.expected.storedRecord === true && !item.storedRecord) {
      failures.push(`${item.name}: nincs mentett valid rekord`);
    }

    return failures;
  });

  const categoryAdsConsentPages = [
    "/penzugyi.html",
    "/epitoipari.html",
    "/egeszseg.html",
    "/mindennapi.html",
    "/auto.html",
    "/atvaltok.html"
  ];
  const categoryAdsConsentChecks = [];

  for (const pagePath of categoryAdsConsentPages) {
    await setViewport(390, 844);
    await navigate("/index.html");
    await evaluate(
      `localStorage.removeItem('cookieConsent'); localStorage.setItem('kbCookieConsent', ${JSON.stringify(
        consentRecord({ analytics: false, ads: true })
      )});`
    );
    await navigate(pagePath);
    await sleep(850);
    categoryAdsConsentChecks.push({
      page: pagePath,
      ...(await evaluate(`(() => {
        const manager = window.KB_CONSENT_MANAGER;
        const adTargets = [...document.querySelectorAll("[data-render='ad-slot']")];
        const adStates = adTargets.map((target) => target.dataset.adState || "");
        return {
          managerReady: !!manager?.isReady,
          managerAds: !!manager?.hasConsent?.("ads"),
          adsenseScripts: [...document.scripts].filter((script) => script.src.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")).length,
          adSlotCount: adTargets.length,
          placeholderCount: adTargets.filter((target) => target.dataset.adState === "placeholder").length,
          nonPlaceholderCount: adTargets.filter((target) => target.dataset.adState && target.dataset.adState !== "placeholder").length,
          adStates
        };
      })()`))
    });
  }

  const categoryAdsConsentFailures = categoryAdsConsentChecks.flatMap((item) => {
    const failures = [];

    if (!item.managerReady) failures.push(`${item.page}: consent manager nem állt készen`);
    if (!item.managerAds) failures.push(`${item.page}: ads hozzájárulás nem látszik validnak`);
    if (item.adSlotCount < 1) failures.push(`${item.page}: nincs ellenőrizhető AdSense slot`);
    if (item.adsenseScripts < 1) failures.push(`${item.page}: visszatérő ads consent mellett nincs AdSense loader script`);
    if (item.placeholderCount > 0) failures.push(`${item.page}: az AdSense slot placeholder állapotban maradt`);
    if (item.nonPlaceholderCount < 1) failures.push(`${item.page}: az AdSense slot nem váltott aktív/pending állapotra`);

    return failures;
  });

  await setViewport(390, 844);
  await evaluate(`localStorage.removeItem('kbCookieConsent'); localStorage.removeItem('cookieConsent');`);
  await navigate("/index.html");
  const cookieScenarios = await evaluate(`(async () => {
    const visible = () => {
      const modal = document.getElementById('cookie-banner');
      return !!modal && getComputedStyle(modal).display !== 'none';
    };
    const readRecord = () => JSON.parse(localStorage.getItem('kbCookieConsent') || 'null');
    const googleScriptCount = () => document.querySelectorAll('script[src*="googletagmanager.com"], script[src*="pagead2.googlesyndication.com"]').length;
    const modal = document.getElementById('cookie-banner');
    const dialog = modal?.querySelector('[role="dialog"]');
    const firstVisible = visible();
    const role = dialog?.getAttribute('role') || '';
    const ariaModal = dialog?.getAttribute('aria-modal') || '';
    const focusInside = dialog?.contains(document.activeElement) || false;
    const preConsentGoogleScripts = googleScriptCount();

    (document.activeElement || document).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));
    const escapeKeepsFirstModal = visible();

    document.getElementById('cookieOpenSettings')?.click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const settingsVisible = document.getElementById('cookieSettingsPanel')?.classList.contains('is-active') || false;
    const defaultAnalytics = document.getElementById('cookieAnalytics')?.checked || false;
    const defaultAds = document.getElementById('cookieAds')?.checked || false;
    document.getElementById('cookieAnalytics').checked = true;
    document.getElementById('cookieSaveSettings')?.click();
    await new Promise((resolve) => setTimeout(resolve, 60));
    const analyticsOnly = readRecord();
    const afterAnalyticsVisible = visible();
    const afterAnalyticsGoogleScripts = googleScriptCount();

    document.querySelector('[data-cookie-settings]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const reopenedSettings = document.getElementById('cookieSettingsPanel')?.classList.contains('is-active') || false;
    const focusAfterReopen = document.activeElement?.id || '';
    document.getElementById('cookieRevokeAll')?.click();
    await new Promise((resolve) => setTimeout(resolve, 40));
    const revoked = readRecord();

    document.querySelector('[data-cookie-settings]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    document.getElementById('cookieAcceptAll')?.click();
    await new Promise((resolve) => setTimeout(resolve, 120));
    const acceptedAll = readRecord();
    const afterAcceptGoogleScripts = googleScriptCount();
    const dataLayerConsent = (window.dataLayer || []).filter((item) => item && item[0] === 'consent').slice(-1)[0] || null;

    return {
      firstVisible,
      role,
      ariaModal,
      focusInside,
      preConsentGoogleScripts,
      escapeKeepsFirstModal,
      settingsVisible,
      defaultAnalytics,
      defaultAds,
      analyticsOnly,
      afterAnalyticsVisible,
      afterAnalyticsGoogleScripts,
      reopenedSettings,
      focusAfterReopen,
      revoked,
      acceptedAll,
      afterAcceptGoogleScripts,
      dataLayerConsent
    };
  })()`);

  await evaluate(`localStorage.setItem('kbCookieConsent', ${JSON.stringify(consentRecord({ analytics: false, ads: false }))}); localStorage.setItem('cookieConsent', 'declined');`);

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
    (document.activeElement || document).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const menuClosed = menuButton?.getAttribute('aria-expanded');
    const details = [...document.querySelectorAll('.faq-list details')];
    details[0]?.querySelector('summary')?.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    details[1]?.querySelector('summary')?.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    const openFaqCount = details.filter((item) => item.open).length;
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieHiddenInitially = cookieBanner ? getComputedStyle(cookieBanner).display === 'none' : false;
    document.querySelector('[data-cookie-settings]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const cookieVisibleAfterOpen = cookieBanner ? getComputedStyle(cookieBanner).display !== 'none' : false;
    const settingsVisible = document.getElementById('cookieSettingsPanel')?.classList.contains('is-active') || false;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    const cookieHiddenAfterEscape = cookieBanner ? getComputedStyle(cookieBanner).display === 'none' : false;
    const cookieStored = JSON.parse(localStorage.getItem('kbCookieConsent') || 'null');
    return { menuOpened, menuClosed, openFaqCount, cookieHiddenInitially, cookieVisibleAfterOpen, settingsVisible, cookieHiddenAfterEscape, cookieStored };
  })()`);

  await navigate("/index.html");
  await evaluate(`localStorage.setItem('kalkulatorbazis-theme', 'light')`);
  await navigate("/index.html");
  const theme = await evaluate(`(async () => {
    const button = document.querySelector('.theme-toggle');
    const initial = document.documentElement.dataset.theme;
    button?.focus();
    const focusVisible = document.activeElement === button;
    button?.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const selected = document.documentElement.dataset.theme;
    const stored = localStorage.getItem('kalkulatorbazis-theme');
    const themeColor = document.querySelector('meta[name="theme-color"]')?.content || '';
    const label = button?.getAttribute('aria-label') || '';
    return { initial, focusVisible, selected, stored, themeColor, label };
  })()`);
  await navigate("/index.html");
  theme.persistedAfterNavigation = await evaluate(`document.documentElement.dataset.theme`);
  theme.toggleCount = await evaluate(`document.querySelectorAll('.theme-toggle').length`);
  theme.trustedSite = await evaluate(`(() => {
    const nodes = [...document.querySelectorAll('[class*="trustedsite" i], [id*="trustedsite" i], iframe[src*="trustedsite" i], script[src*="trustedsite" i]')];
    return { present: nodes.length > 0, count: nodes.length };
  })()`);
  const darkScreenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  fs.writeFileSync(path.join(screenshotDirectory, "index-dark-390.png"), Buffer.from(darkScreenshot.data, "base64"));

  await navigate("/kalkulatorok/netto-brutto-kalkulator.html");
  theme.calculatorReliability = await evaluate(`(() => {
    const note = document.querySelector('.reliability-note');
    const report = note?.querySelector('a[href^="mailto:kalkulatorbazis@gmail.com"]');
    const transparency = note?.querySelector('a[href*="atlathatosag-es-minoseg.html"]');
    note?.scrollIntoView({ block: 'center' });
    return {
      present: !!note,
      reportSubject: report?.href.includes('Hibabejelent%C3%A9s') || false,
      transparencyLink: !!transparency,
      theme: document.documentElement.dataset.theme
    };
  })()`);
  await sleep(100);
  const reliabilityScreenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  fs.writeFileSync(path.join(screenshotDirectory, "megbizhatosag-dark-390.png"), Buffer.from(reliabilityScreenshot.data, "base64"));

  await navigate("/atlathatosag-es-minoseg.html");
  theme.transparency = await evaluate(`(() => ({
    h1: document.querySelectorAll('h1').length,
    theme: document.documentElement.dataset.theme,
    footerLink: !![...document.querySelectorAll('#footer a, footer a, .legal-footer a')].find((link) => link.getAttribute('href')?.includes('atlathatosag-es-minoseg.html')),
    mailto: !!document.querySelector('a[href^="mailto:kalkulatorbazis@gmail.com"]'),
    breadcrumb: !!document.querySelector('.breadcrumb'),
    toggleCount: document.querySelectorAll('.theme-toggle').length
  }))()`);
  const transparencyScreenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  fs.writeFileSync(path.join(screenshotDirectory, "atlathatosag-dark-390.png"), Buffer.from(transparencyScreenshot.data, "base64"));

  await client.send("Emulation.setEmulatedMedia", { media: "print", features: [] });
  await sleep(100);
  theme.print = await evaluate(`(() => ({
    mediaMatches: matchMedia('print').matches,
    bodyBackground: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    toggleDisplay: getComputedStyle(document.querySelector('.theme-toggle')).display
  }))()`);
  await client.send("Emulation.setEmulatedMedia", { media: "screen", features: [] });

  await evaluate(`localStorage.removeItem('kalkulatorbazis-theme')`);
  await client.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-color-scheme", value: "dark" }]
  });
  await navigate("/index.html");
  theme.systemDark = await evaluate(`document.documentElement.dataset.theme`);
  await client.send("Emulation.setEmulatedMedia", { media: "screen", features: [] });
  await evaluate(`localStorage.setItem('kalkulatorbazis-theme', 'light')`);

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
    ["/kalkulatorok/milliomos-kalkulator.html", `(() => { [['initial','100000'],['monthly','50000'],['rate','7'],['goal','1000000']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));});return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/etf-kalkulator.html", `(() => { [['initial','500000'],['monthly','30000'],['rate','6'],['years','12']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));});return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/uzemanyag-koltseg-kalkulator.html", `(() => { [['distance','420'],['consumption','6.5'],['price','620']].forEach(([id,value])=>{const e=document.getElementById(id);e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));});return document.getElementById('simpleCalcResults')?.innerText; })()`],
    ["/kalkulatorok/szamla-teljesites-kalkulator.html", `(() => { const issue=document.getElementById('issueDate');const performance=document.getElementById('performanceDate');const days=document.getElementById('days');issue.value='2026-06-01';performance.value='2026-06-01';days.value='30';days.dispatchEvent(new Event('input',{bubbles:true}));return document.querySelector('.result-box')?.innerText; })()`],
    ["/kalkulatorok/deviza-atvalto-kalkulator.html", `(() => ({ result: document.getElementById('result')?.innerText || '', updated: document.getElementById('lastUpdate')?.innerText || '' }))()`]
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
      consoleErrors: consoleErrors.length,
      consentMatrixFailures: consentMatrixFailures.length,
      categoryAdsConsentFailures: categoryAdsConsentFailures.length
    },
    layoutFailures: layouts.filter((item) => item.scrollWidth > item.clientWidth || item.offenders.length),
    consentMatrix,
    consentMatrixFailures,
    categoryAdsConsentChecks,
    categoryAdsConsentFailures,
    cookieScenarios,
    search,
    interactions,
    theme,
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

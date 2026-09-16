const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const chromeCandidates = [
  process.env.KB_CHROME_PATH,
  process.env.CHROME_PATH,
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) throw new Error("Nem található Chrome/Chromium a döntési switcher browser audithoz.");

const origin = process.env.KB_QA_ORIGIN || "http://127.0.0.1:4173";
const port = 9334;
const profile = path.join(os.tmpdir(), `kb-decision-switcher-${Date.now()}`);
const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--disable-background-networking",
    "--no-first-run",
    ...(typeof process.getuid === "function" && process.getuid() === 0 ? ["--no-sandbox"] : []),
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDebugger() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error("A headless böngésző nem indult el időben.");
}

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
      const item = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
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
      return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(null), timeout);
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
    },
  };
}

async function main() {
  await waitForDebugger();
  const targetResponse = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${origin}/dontesek`)}`,
    { method: "PUT" }
  );
  const target = await targetResponse.json();
  const client = await createClient(target.webSocketDebuggerUrl);

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
    const loaded = client.once("Page.loadEventFired", 12000);
    await client.send("Page.navigate", { url: `${origin}${pagePath}` });
    await loaded;
    await sleep(250);
  };

  const setViewport = async (width, height) => {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
      screenWidth: width,
      screenHeight: height,
    });
  };

  const readState = async (buttonAttr, formAttr) =>
    evaluate(`(() => ({
      buttons: [...document.querySelectorAll('[${buttonAttr}]')].map((button) => ({
        value: button.getAttribute('${buttonAttr}'),
        pressed: button.getAttribute('aria-pressed'),
        active: button.classList.contains('is-active')
      })),
      forms: [...document.querySelectorAll('form[${formAttr}]')].map((form) => ({
        value: form.getAttribute('${formAttr}'),
        hidden: form.hidden,
        display: getComputedStyle(form).display
      }))
    }))()`);

  const assertMode = async ({ buttonAttr, formAttr, value, label }) => {
    const state = await readState(buttonAttr, formAttr);
    const expectedButton = state.buttons.find((item) => item.value === value);
    const visibleForms = state.forms.filter((item) => item.display !== "none");
    const expectedForm = state.forms.find((item) => item.value === value);

    if (!expectedButton?.active || expectedButton?.pressed !== "true") {
      throw new Error(`${label}: a(z) ${value} gomb nem lett aktív. Állapot: ${JSON.stringify(state)}`);
    }
    if (!expectedForm || expectedForm.hidden || expectedForm.display === "none") {
      throw new Error(`${label}: a(z) ${value} űrlap nem látható. Állapot: ${JSON.stringify(state)}`);
    }
    if (visibleForms.length !== 1 || visibleForms[0].value !== value) {
      throw new Error(`${label}: nem pontosan egy űrlap látható. Állapot: ${JSON.stringify(state)}`);
    }
  };

  const clickMode = async (attribute, value) => {
    const clicked = await evaluate(`(() => {
      const button = document.querySelector('[${attribute}="${value}"]');
      if (!button) return false;
      button.click();
      return true;
    })()`);
    if (!clicked) throw new Error(`Nem található kapcsológomb: ${attribute}=${value}`);
    await sleep(50);
  };

  await client.send("Page.enable");
  await client.send("Runtime.enable");

  for (const [width, height] of [[1280, 900], [390, 844]]) {
    await setViewport(width, height);
    await navigate("/dontesek");

    await assertMode({
      buttonAttr: "data-decision-mode",
      formAttr: "data-decision-form",
      value: "home",
      label: `Döntések ${width}px kezdeti állapot`,
    });

    for (const mode of ["car", "savings", "home"]) {
      await clickMode("data-decision-mode", mode);
      await assertMode({
        buttonAttr: "data-decision-mode",
        formAttr: "data-decision-form",
        value: mode,
        label: `Döntések ${width}px / ${mode}`,
      });
    }

    await navigate("/osszehasonlitas");
    const comparisonModes = await evaluate(`[...document.querySelectorAll('[data-comparison-mode]')].map((button) => button.dataset.comparisonMode)`);
    if (!comparisonModes.length) throw new Error("Nem találhatók összehasonlítási mód kapcsolók.");

    for (const mode of comparisonModes) {
      await clickMode("data-comparison-mode", mode);
      await assertMode({
        buttonAttr: "data-comparison-mode",
        formAttr: "data-comparison-form",
        value: mode,
        label: `Összehasonlítás ${width}px / ${mode}`,
      });
    }
  }

  client.close();
  console.log("Decision switcher browser audit OK: desktop + mobil, döntések + összehasonlítás.");
}

main()
  .catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    browser.kill("SIGTERM");
  });

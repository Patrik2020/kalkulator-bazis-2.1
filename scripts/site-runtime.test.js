"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

class Element {
  constructor() {
    this.dataset = {}; this.attributes = new Map(); this.listeners = new Map();
    this.selectors = new Map(); this.classes = new Set(); this.style = {};
    this.classList = {
      contains: (name) => this.classes.has(name),
      add: (...names) => names.forEach((name) => this.classes.add(name)),
      remove: (...names) => names.forEach((name) => this.classes.delete(name)),
      toggle: (name, force) => { const on = force ?? !this.classes.has(name); if (on) this.classes.add(name); else this.classes.delete(name); return on; },
    };
  }
  addEventListener(type, callback, options = {}) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push({ callback, once: options.once });
  }
  removeEventListener(type, callback) { this.listeners.set(type, (this.listeners.get(type) || []).filter((item) => item.callback !== callback)); }
  dispatchEvent(event) {
    for (const item of [...(this.listeners.get(event.type) || [])]) {
      if (item.once) this.removeEventListener(event.type, item.callback);
      item.callback(event);
    }
  }
  querySelector(selector) { return this.selectors.get(selector) || null; }
  querySelectorAll() { return []; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); if (["src", "href", "rel"].includes(name)) this[name] = String(value); }
  getAttribute(name) { return this.attributes.get(name) || this[name] || null; }
  replaceChildren(fragment) { this.replacements = (this.replacements || 0) + 1; this.firstElementChild = fragment.childNodes[0]; }
  remove() { this.removed = true; }
  contains() { return false; }
}

function browser(search = "") {
  const elements = new Map(), scripts = [], links = [], events = [], storage = new Map();
  const document = new Element(), body = new Element(), html = new Element();
  const media = new Element(), windowEvents = new Element(); media.matches = false;
  document.body = body; document.documentElement = html; document.readyState = "loading";
  document.getElementById = (id) => elements.get(id) || null;
  document.querySelectorAll = (selector) => selector === "script[src]" ? scripts.filter((s) => !s.removed) : selector === "link[href]" ? links : [];
  document.createElement = (tag) => { const element = new Element(); element.tagName = tag.toUpperCase(); return element; };
  document.createDocumentFragment = () => ({ childNodes: [], appendChild(node) { this.childNodes.push(node); } });
  const append = (node) => { if (node.src) scripts.push(node); if (node.tagName === "LINK") links.push(node); };
  body.appendChild = append; document.head = { appendChild: append };
  const dispatch = document.dispatchEvent.bind(document);
  document.dispatchEvent = (event) => { events.push(event); dispatch(event); };
  let observers = 0;
  const context = {
    document, URL, URLSearchParams, console: { error() {} },
    location: { href: `https://example.test/penzugyi.html${search}`, pathname: "/penzugyi.html", search, origin: "https://example.test" },
    matchMedia: () => media,
    addEventListener: (...args) => windowEvents.addEventListener(...args),
    localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    HTMLAnchorElement: class {}, Node: { ELEMENT_NODE: 1 },
    MutationObserver: class { observe() { observers += 1; } },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    DOMParser: class { parseFromString() { return { body: { childNodes: [new Element()] }, querySelectorAll() { return []; } }; } },
    fetch: async () => { throw new Error("Unexpected fetch"); },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read("js/utils.js"), context);
  return { context, runtime: context.KB_SITE_RUNTIME, elements, scripts, links, document, body, html, events, storage, media, windowEvents, observers: () => observers };
}

const response = (ok = true) => ({ ok, headers: { get: () => "text/html" }, text: async () => "<div>Canonical component</div>" });
const flush = () => new Promise((resolve) => setImmediate(resolve));

test("parallel script requests, including different versions, execute once and notify every caller", async () => {
  const b = browser(); let callbacks = 0;
  const first = b.runtime.loadScript("/js/example.js?v=one", () => callbacks++);
  const second = b.runtime.loadScript("/js/example.js?v=two", () => callbacks++);
  assert.equal(b.scripts.length, 1);
  b.scripts[0].dispatchEvent({ type: "load" });
  assert.equal(await first, await second);
  await b.runtime.loadScript("/js/example.js", () => callbacks++);
  assert.equal(callbacks, 3); assert.equal(b.scripts.length, 1);
});

test("a script that already executed before the loader does not wait for another load event", async () => {
  const b = browser(); b.context.KB_CONSENT_MANAGER = { isReady: true };
  const existing = new Element(); existing.src = "https://example.test/js/cookie.js"; b.scripts.push(existing);
  await b.runtime.loadScript("/js/cookie.js?v=new");
  assert.equal(existing.listeners.size, 0); assert.equal(b.scripts.length, 1);
});

test("failed scripts reject, are removed, and can be retried", async () => {
  const b = browser(); const first = b.runtime.loadScript("/js/retry.js");
  b.scripts[0].dispatchEvent({ type: "error" });
  await assert.rejects(first, /Nem sikerült/); assert.ok(b.scripts[0].removed);
  const second = b.runtime.loadScript("/js/retry.js");
  assert.equal(b.scripts.length, 2); b.scripts[1].dispatchEvent({ type: "load" }); await second;
});

test("a failed existing script is removed so a later request can retry it", async () => {
  const b = browser();
  const existing = new Element(); existing.src = "https://example.test/js/retry.js"; b.scripts.push(existing);
  const first = b.runtime.loadScript("/js/retry.js");
  existing.dispatchEvent({ type: "error" });
  await assert.rejects(first, /Nem sikerült/); assert.ok(existing.removed);
  const second = b.runtime.loadScript("/js/retry.js");
  assert.equal(b.scripts.length, 2); b.scripts[1].dispatchEvent({ type: "load" }); await second;
});

test("external scripts and unapproved component paths never load", async () => {
  const b = browser();
  await assert.rejects(b.runtime.loadScript("https://other.test/code.js"), /Nem engedélyezett/);
  await assert.rejects(b.runtime.loadComponent("header", "/unapproved.html"), /Nem engedélyezett/);
  assert.equal(b.scripts.length, 0);
});

test("a complete static header retains its DOM and binds its menu once", async () => {
  const b = browser(); const header = new Element(), menu = new Element(), toggle = new Element();
  header.firstElementChild = new Element();
  header.selectors.set("header.header-shell", header.firstElementChild);
  header.selectors.set("#menu", menu); header.selectors.set("#menuToggle", toggle);
  b.elements.set("header", header); b.elements.set("menu", menu); b.elements.set("menuToggle", toggle);
  const original = header.firstElementChild;
  await Promise.all([b.runtime.loadComponent("header", "/components/header.html"), b.runtime.loadComponent("header", "/components/header.html")]);
  b.context.initMobileMenu(); b.context.initMobileMenu();
  assert.equal(header.firstElementChild, original); assert.equal(header.replacements, undefined);
  assert.equal(toggle.listeners.get("click").length, 1);
  assert.equal(b.events.filter((event) => event.type === "kb:component-loaded").length, 1);
});

test("concurrent empty component requests share one fetch and one insertion", async () => {
  const b = browser(); const footer = new Element(); b.elements.set("footer", footer);
  let calls = 0; b.context.fetch = async () => { calls++; return response(); };
  const first = b.runtime.loadComponent("footer", "/components/footer.html");
  const second = b.runtime.loadComponent("footer", "/components/footer.html");
  assert.equal(first, second); await Promise.all([first, second]);
  assert.equal(calls, 1); assert.equal(footer.replacements, 1);
});

test("export refreshes the canonical template and failures keep the old DOM available for retry", async () => {
  const b = browser("?__kb_static_export=1"); const footer = new Element(), original = new Element();
  footer.firstElementChild = original; footer.selectors.set(".footer-container.kb-footer", original); b.elements.set("footer", footer);
  b.context.fetch = async () => response(false);
  await assert.rejects(b.runtime.loadComponent("footer", "/components/footer.html"), /Hiba/);
  assert.equal(footer.firstElementChild, original);
  b.context.fetch = async () => response(); await b.runtime.loadComponent("footer", "/components/footer.html");
  assert.notEqual(footer.firstElementChild, original); assert.equal(footer.replacements, 1);
});

test("a late component response cannot overwrite a replacement root", async () => {
  const b = browser(), old = new Element(), replacement = new Element(); b.elements.set("footer", old);
  let finish; b.context.fetch = () => new Promise((resolve) => { finish = resolve; });
  const pending = b.runtime.loadComponent("footer", "/components/footer.html"); await flush();
  b.elements.set("footer", replacement); finish(response());
  assert.equal(await pending, replacement); assert.equal(old.replacements, undefined);
});

function materializedHome(b) {
  b.body.classList.add("home-page", "home-redesign-v17");
  b.document.selectors.set(".kb-header-wrap > #header.kb-header", new Element());
  b.document.selectors.set("main .hero", new Element());
}

test("the materialized homepage owns its header and blocks every legacy reconstruction entry", async () => {
  const b = browser(); materializedHome(b); const header = new Element(); b.elements.set("header", header);
  b.storage.set("kalkulatorbazis-theme", "dark");
  assert.equal(await b.runtime.loadComponent("header", "/components/header.html"), header);
  await b.runtime.loadHomeRedesign();
  vm.runInContext(read("js/home-ia.js"), b.context); vm.runInContext(read("js/home-current.js"), b.context);
  assert.equal(b.scripts.length, 0); assert.equal(b.storage.get("kalkulatorbazis-theme"), "dark");
});

test("both legacy fallback callers share a single homepage assembly request", async () => {
  const b = browser(); b.body.classList.add("home-page");
  const one = b.runtime.loadHomeRedesign(), two = b.runtime.loadHomeRedesign();
  assert.equal(b.scripts.length, 1); b.scripts[0].dispatchEvent({ type: "load" }); await Promise.all([one, two]);
});

test("initialization is once per component instance, rather than once per page forever", () => {
  const b = browser(), old = new Element(), replacement = new Element();
  assert.equal(b.runtime.claimInitialization(old, "menu"), true);
  assert.equal(b.runtime.claimInitialization(old, "menu"), false);
  assert.equal(b.runtime.claimInitialization(replacement, "menu"), true);
  assert.equal(b.runtime.claimInitialization(old, "other-feature"), true);
});

test("the shared site graph and mutation observer initialize once", async () => {
  const b = browser(); b.context.KB_CONSENT_MANAGER = { isReady: true }; b.context.KB_DATA = {};
  for (const batch of ["01", "02", "03", "04", "05"]) b.context[`KB_EXPANSION_BATCH_${batch}`] = [];
  b.context.KB_SITE_UI_LOADED = true;
  const one = b.runtime.initialize(), two = b.runtime.initialize(); assert.equal(one, two);
  await Promise.all([one, two]); assert.equal(b.observers(), 1);
  assert.equal(b.events.filter((event) => event.type === "kb:site-data-loaded").length, 1);
  assert.equal(b.scripts.length, 0);
});

test("the common theme API persists explicit choices and handles automatic changes once", () => {
  const b = browser(); vm.runInContext(read("js/theme.js"), b.context); vm.runInContext(read("js/theme.js"), b.context);
  b.context.KB_THEME.set("dark", true); assert.equal(b.context.KB_THEME.get(), "dark");
  assert.equal(b.storage.get("kalkulatorbazis-theme"), "dark");
  b.media.dispatchEvent({ type: "change", matches: false }); assert.equal(b.html.dataset.theme, "dark");
  b.storage.delete("kalkulatorbazis-theme"); b.media.dispatchEvent({ type: "change", matches: false });
  assert.equal(b.html.dataset.theme, "light"); assert.equal(b.media.listeners.get("change").length, 1);
});

test("a failed site graph can recover without adding another mutation observer", async () => {
  const b = browser(); b.context.KB_CONSENT_MANAGER = { isReady: true }; b.context.KB_DATA = {};
  for (const batch of ["01", "02", "03", "04", "05"]) b.context[`KB_EXPANSION_BATCH_${batch}`] = [];
  const pending = b.runtime.initialize(); await flush();
  assert.equal(b.scripts.length, 1); b.scripts[0].dispatchEvent({ type: "error" }); await assert.rejects(pending);
  b.context.KB_SITE_UI_LOADED = true; await b.runtime.initialize(); assert.equal(b.observers(), 1);
});

test("a previously loaded homepage module can bind a new component without executing its script again", async () => {
  const b = browser(); let component = new Element(), calls = 0;
  b.runtime.registerHomeInitializer("home-redesign-salary.js", () => { if (b.runtime.claimInitialization(component, "salary")) calls++; });
  b.runtime.initializeHome(); assert.equal(calls, 1);
  component = new Element(); await b.runtime.loadScript("/js/home-redesign-salary.js"); b.runtime.initializeHome();
  assert.equal(calls, 2); assert.equal(b.scripts.length, 0);
});

test("the head registry deduplicates both base assets and repeated feature startup", () => {
  const b = browser(); const existing = new Element(); existing.src = "https://example.test/js/theme.js?v=older"; b.scripts.push(existing);
  vm.runInContext(read("js/global-head-config.js"), b.context); vm.runInContext(read("js/global-head.js"), b.context);
  vm.runInContext("loadParsedDomFeatures()", b.context); const count = b.scripts.length;
  vm.runInContext("loadParsedDomFeatures()", b.context); assert.equal(b.scripts.length, count);
  const paths = b.scripts.map((script) => new URL(script.src, b.context.location.href).pathname);
  assert.equal(new Set(paths).size, paths.length);
});

test("homepage recovery fragments derive their advertising and dialogs from the canonical page", () => {
  const { homeFragments } = require("./sync-home-fragments");
  const fragments = homeFragments(read("index.html"));
  assert.match(fragments.main, /home-ad-band/); assert.match(fragments.main, /facebook/i);
  assert.match(fragments.footer, /id="kbHelpPanel"/); assert.match(fragments.header, /id="themeBtn"/);
  assert.throws(() => homeFragments("<main>broken"));
});

test("repeated real homepage controller initialization preserves the shared loader and binds once", () => {
  const b = browser(); b.body.classList.add("home-page", "home-redesign-v17"); b.elements.set("header", new Element());
  const loader = b.context.loadComponent;
  vm.runInContext(read("js/home-redesign-core.js"), b.context);
  const count = (target) => [...target.listeners.values()].reduce((total, list) => total + list.length, 0);
  const documentCount = count(b.document), windowCount = count(b.windowEvents);
  b.runtime.initializeHome(); vm.runInContext(read("js/home-redesign-core.js"), b.context); b.runtime.initializeHome();
  assert.equal(b.context.loadComponent, loader);
  assert.equal(count(b.document), documentCount); assert.equal(count(b.windowEvents), windowCount);
});

test("homepage ad rails initialize once, require consent, and ignore detached instances", () => {
  const b = browser();
  const rail = () => {
    const element = new Element(); element.isConnected = true;
    element.appendChild = (node) => { if (node.className === "adsbygoogle") element.selectors.set("ins.adsbygoogle", node); };
    element.append = (...nodes) => nodes.forEach((node) => element.appendChild(node));
    return element;
  };
  let rails = [rail(), rail()];
  const query = b.document.querySelectorAll;
  b.document.querySelectorAll = (selector) => selector === "[data-home-multiplex-rail]" ? rails : query(selector);
  vm.runInContext(read("js/home-multiplex-rails.js"), b.context);
  b.media.matches = true; b.document.dispatchEvent({ type: "kb:adsense-ready" });
  assert.equal(b.context.adsbygoogle, undefined);
  b.context.KB_ADSENSE_ELIGIBLE = true; b.context.KB_ADSENSE_CAN_REQUEST = true;
  b.document.dispatchEvent({ type: "kb:adsense-ready" }); assert.equal(b.context.adsbygoogle.length, 2);
  b.runtime.initializeHome(); vm.runInContext(read("js/home-multiplex-rails.js"), b.context);
  b.document.dispatchEvent({ type: "kb:adsense-ready" }); assert.equal(b.context.adsbygoogle.length, 2);
  assert.equal(b.document.listeners.get("kb:adsense-ready").length, 1);
  rails.forEach((element) => { element.isConnected = false; }); rails = [rail(), rail()];
  b.runtime.initializeHome(); b.document.dispatchEvent({ type: "kb:adsense-ready" });
  assert.equal(b.context.adsbygoogle.length, 4);
});

test("nested article routes load shared assets from the project root", async () => {
  const b = browser(); b.context.KB_PROJECT_ROOT = "";
  b.context.location.pathname = "/aktualis/hir"; b.context.location.href = "https://example.test/aktualis/hir";
  b.context.KB_DATA = {}; b.context.KB_SITE_UI_LOADED = true;
  for (const batch of ["01", "02", "03", "04", "05"]) b.context[`KB_EXPANSION_BATCH_${batch}`] = [];
  const pending = b.runtime.initialize(); await flush();
  assert.equal(new URL(b.scripts[0].src).pathname, "/js/cookie.js");
  b.context.KB_CONSENT_MANAGER = { isReady: true }; b.scripts[0].dispatchEvent({ type: "load" }); await pending;
});

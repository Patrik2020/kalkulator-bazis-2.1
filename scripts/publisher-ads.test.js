"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "../js/publisher-ads.js"), "utf8");

function fixture({ eligible = true, ready = false, sections = 9, maxSlots = 3, throws = false } = {}) {
  const listeners = new Map(), nodes = [], observers = [];
  let requests = 0, width = 360;
  const element = (tagName = "ASIDE") => ({
    tagName, dataset: {}, style: {}, hidden: false, isConnected: true,
    children: [], textContent: "Useful explanatory content. ".repeat(20),
    matches: () => false, querySelector: () => null,
    setAttribute() {}, getAttribute(name) { return this[name]; },
    appendChild(node) { this.children.push(node); },
    after(node) { nodes.push(node); },
    getBoundingClientRect: () => ({ width }),
  });
  const children = Array.from({ length: sections }, () => element("SECTION"));
  // A calculator is not an insertion candidate, even if it has plenty of text.
  const calculator = element("SECTION"); calculator.querySelector = () => ({});
  children.unshift(calculator);
  const addEventListener = (name, fn) => {
    if (!listeners.has(name)) listeners.set(name, []);
    listeners.get(name).push(fn);
  };
  const context = {
    location: { pathname: "/kalkulatorok/netto-brutto-kalkulator" },
    KB_GLOBAL_HEAD_CONFIG: { adsensePolicy: { placementMode: "manual", maxSlots, isEligible: () => eligible } },
    KB_ADSENSE_ELIGIBLE: eligible, KB_ADSENSE_CAN_REQUEST: ready,
    adsbygoogle: { push() { requests++; if (throws) throw new Error("No fill"); } },
    document: {
      readyState: "complete", querySelector: () => ({ children }),
      createElement: (tag) => element(tag.toUpperCase()), addEventListener,
    },
    addEventListener,
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe() {} disconnect() { this.disconnected = true; }
    },
  };
  context.window = context;
  vm.createContext(context);
  const run = () => vm.runInContext(source, context);
  const emit = (name) => (listeners.get(name) || []).forEach((fn) => fn());
  run();
  return { context, nodes, observers, calculator, run, emit, requests: () => requests, width: (value) => { width = value; } };
}

test("no requests before CMP readiness; repeated events and script loads never exceed three", () => {
  const f = fixture();
  assert.equal(f.nodes.length, 3); assert.equal(f.requests(), 0);
  assert.ok(f.nodes.every((node) => node.hidden));
  f.context.KB_ADSENSE_CAN_REQUEST = true; f.emit("kb:adsense-ready");
  for (let i = 0; i < 10; i++) { f.emit("resize"); f.emit("kb:adsense-ready"); f.run(); }
  assert.equal(f.requests(), 3); assert.equal(f.nodes.length, 3);
  assert.equal(f.calculator.children.length, 0);
});

test("excluded pages request nothing; short pages use fewer slots; limit is hard capped", () => {
  const excluded = fixture({ eligible: false, ready: true });
  assert.equal(excluded.requests(), 0); assert.equal(excluded.nodes.length, 0);
  assert.equal(fixture({ ready: true, sections: 1 }).requests(), 1);
  assert.equal(fixture({ ready: true, sections: 0 }).requests(), 0);
  assert.equal(fixture({ ready: true, maxSlots: 8 }).requests(), 3);
});

test("failed and unfilled units are never replaced or requested again", () => {
  const failed = fixture({ ready: true, throws: true });
  failed.emit("resize"); failed.emit("kb:adsense-ready");
  assert.equal(failed.requests(), 3); assert.ok(failed.nodes.every((node) => node.hidden));
  const f = fixture({ ready: true });
  f.nodes[0].children[1]["data-ad-status"] = "unfilled";
  f.observers[0].callback(); f.emit("resize");
  assert.equal(f.nodes[0].hidden, true); assert.equal(f.requests(), 3);
});

test("hidden/narrow layouts wait for measurable width without consuming extra requests", () => {
  const f = fixture(); f.width(0); f.context.KB_ADSENSE_CAN_REQUEST = true;
  f.emit("kb:adsense-ready"); assert.equal(f.requests(), 0);
  f.width(360); f.emit("resize"); assert.equal(f.requests(), 3);
  f.emit("resize"); assert.equal(f.requests(), 3);
});

"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../js/cookie.js"), "utf8");
const start = source.indexOf("  const setAdSenseRequestReady =");
const end = source.indexOf("  const syncAdSense =", start);
assert.ok(start >= 0 && end > start);

function fixture() {
  const timers = new Map();
  let nextId = 0, events = 0, registrations = 0, consentCallback;
  const window = {
    KB_ADSENSE_ELIGIBLE: true, KB_ADSENSE_CAN_REQUEST: false,
    adsbygoogle: { pauseAdRequests: 1 },
    setInterval(callback) { timers.set(++nextId, callback); return nextId; },
    clearInterval(id) { timers.delete(id); },
  };
  const context = vm.createContext({
    window, document: { dispatchEvent() { events++; } }, CustomEvent: class {},
  });
  vm.runInContext(source.slice(start, end), context);
  const wait = () => vm.runInContext("waitForCertifiedCmp()", context);
  wait();
  return {
    window, timers, wait,
    tick(count) { for (let i = 0; i < count; i++) for (const fn of [...timers.values()]) fn(); },
    loadCmp() { window.__tcfapi = (command, version, callback) => {
      assert.equal(command, "addEventListener"); assert.equal(version, 2);
      registrations++; consentCallback = callback;
    }; },
    consent(data, success = true) { consentCallback(data, success); },
    counts() { return { events, registrations }; },
  };
}

test("CMP arriving after 12 seconds or minutes still registers without authorizing early", () => {
  for (const ticks of [49, 80, 2400]) {
    const f = fixture(); f.tick(ticks);
    assert.equal(f.window.KB_ADSENSE_CAN_REQUEST, false);
    assert.equal(f.window.adsbygoogle.pauseAdRequests, 1);
    assert.equal(f.timers.size, 1);
    f.loadCmp(); f.tick(1);
    assert.equal(f.timers.size, 0);
    assert.equal(f.window.KB_ADSENSE_CAN_REQUEST, false);
    f.consent({ gdprApplies: true, eventStatus: "cmpuishown" });
    assert.equal(f.window.KB_ADSENSE_CAN_REQUEST, false);
    f.consent({ gdprApplies: true, eventStatus: "useractioncomplete" });
    assert.equal(f.window.KB_ADSENSE_CAN_REQUEST, true);
    assert.equal(f.window.adsbygoogle.pauseAdRequests, 0);
    f.wait(); f.consent({ gdprApplies: true, eventStatus: "tcloaded" });
    assert.deepEqual(f.counts(), { events: 1, registrations: 1 });
  }
});

test("missing CMP keeps requests paused and repeated starts share one timer", () => {
  const f = fixture();
  for (let i = 0; i < 100; i++) { f.wait(); f.tick(100); }
  assert.equal(f.timers.size, 1);
  assert.equal(f.window.KB_ADSENSE_CAN_REQUEST, false);
  assert.equal(f.window.adsbygoogle.pauseAdRequests, 1);
  assert.deepEqual(f.counts(), { events: 0, registrations: 0 });
});

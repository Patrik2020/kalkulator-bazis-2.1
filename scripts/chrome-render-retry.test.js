"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { withTransientChromeRetry } = require("./chrome-render-retry");

test("retries one transient Chrome timeout and returns the successful DOM", () => {
  let calls = 0;
  const warnings = [];
  const result = withTransientChromeRetry(() => {
    calls += 1;
    if (calls === 1) {
      const error = new Error("Chrome timeout");
      error.transientChromeTimeout = true;
      throw error;
    }
    return "<html>ok</html>";
  }, { attempts: 2, isTransient: (error) => error.transientChromeTimeout === true, warn: (message) => warnings.push(message) });
  assert.equal(result, "<html>ok</html>");
  assert.equal(calls, 2);
  assert.equal(warnings.length, 1);
});

test("does not retry deterministic content failures", () => {
  let calls = 0;
  assert.throws(() => withTransientChromeRetry(() => {
    calls += 1;
    throw new Error("Invalid HTML");
  }, { attempts: 2, isTransient: (error) => error.transientChromeTimeout === true }), /Invalid HTML/);
  assert.equal(calls, 1);
});

test("still fails after the bounded retry budget", () => {
  let calls = 0;
  assert.throws(() => withTransientChromeRetry(() => {
    calls += 1;
    const error = new Error("Chrome timeout");
    error.transientChromeTimeout = true;
    throw error;
  }, { attempts: 2, isTransient: (error) => error.transientChromeTimeout === true }), /Chrome timeout/);
  assert.equal(calls, 2);
});

test("rejects unbounded retry configuration", () => {
  assert.throws(() => withTransientChromeRetry(() => "ok", { attempts: 100 }), /Invalid Chrome retry count/);
});

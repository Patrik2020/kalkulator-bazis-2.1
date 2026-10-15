"use strict";

// Retry only transient browser failures. Deterministic content and build errors
// must still fail CI rather than be hidden behind retries.
function withTransientChromeRetry(run, options = {}) {
  const attempts = options.attempts ?? 2;
  const isTransient = options.isTransient ?? (() => false);
  const warn = options.warn ?? (() => {});
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 3) {
    throw new Error("Invalid Chrome retry count");
  }

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return run(attempt);
    } catch (error) {
      if (attempt === attempts || !isTransient(error)) throw error;
      warn(`Transient Chrome failure (attempt ${attempt}/${attempts}); retrying once with a clean browser profile: ${error.message}`);
    }
  }
  throw new Error("Unreachable Chrome retry state");
}

module.exports = { withTransientChromeRetry };

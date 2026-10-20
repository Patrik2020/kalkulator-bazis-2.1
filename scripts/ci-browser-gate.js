"use strict";

function verdict({ changes, runBrowser, smoke, deep }) {
  if (changes !== "success") {
    return `Change detection did not succeed: ${changes}`;
  }
  if (runBrowser === "true") {
    if (smoke !== "success" || deep !== "success") {
      return `Browser tests required, but smoke=${smoke}, deep-ui-qa=${deep}`;
    }
    return null;
  }
  if (runBrowser === "false") {
    if (smoke !== "skipped" || deep !== "skipped") {
      return `Editorial-only PR should skip both browser jobs, got smoke=${smoke}, deep-ui-qa=${deep}`;
    }
    return null;
  }
  return `Missing or invalid browser scope: ${runBrowser}`;
}

if (require.main === module) {
  const state = {
    changes: process.env.KB_CHANGES_RESULT,
    runBrowser: process.env.KB_RUN_BROWSER,
    smoke: process.env.KB_SMOKE_RESULT,
    deep: process.env.KB_DEEP_RESULT,
  };
  const error = verdict(state);
  if (error) {
    console.error(`::error title=Browser regression gate::${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Browser regression gate PASSED (run_browser=${state.runBrowser})`);
  }
}

module.exports = { verdict };

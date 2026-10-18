// Browser-only probe: the QA runner blocks Google's network endpoints, so these
// observations exercise our request gate without creating live ad impressions.
const adsenseProbeSource = `(() => {
  const state = { readyEvents: 0, requests: [], callbacks: [] };
  const queue = [];
  queue.push = function (...items) {
    state.requests.push(...items.map(() => ({
      eligible: window.KB_ADSENSE_ELIGIBLE === true,
      ready: window.KB_ADSENSE_CAN_REQUEST === true,
      paused: queue.pauseAdRequests
    })));
    return Array.prototype.push.apply(this, items);
  };
  window.adsbygoogle = queue;
  document.addEventListener('kb:adsense-ready', () => { state.readyEvents += 1; });
  window.__kbAdsQaProbe = {
    state,
    installTcf() {
      window.__tcfapi = (command, version, callback) => {
        if (command === 'addEventListener' && version === 2) state.callbacks.push(callback);
      };
    },
    emit(data, success = true) {
      state.callbacks.forEach((callback) => callback(data, success));
    }
  };
})();`;

const requiredConsentCases = [
  "no_record", "invalid_json", "expired_record", "old_version_record",
  "malformed_categories", "legacy_accepted_migrates_once",
  "legacy_declined_migrates_once", "valid_analytics_only", "valid_ads_only", "valid_denied",
];

const requiredTcfCases = [
  "missing_cmp", "cmp_ui_shown", "failed_callback", "pending_status",
  "settled_after_delay", "repeated_settled_event", "repeated_ready_notification", "site_consent_revoked",
  "user_action_complete", "outside_gdpr", "mobile_no_rails", "excluded_page",
];

function tcfCheckpointFailures(item) {
  const failures = [];
  for (const [key, expected] of Object.entries(item.expected)) {
    if (item[key] !== expected) failures.push(`${item.name}: ${key} ${item[key]} != ${expected}`);
  }
  if (item.prematureRequests !== 0) {
    failures.push(`${item.name}: hirdetéskérés eligibility/TCF-ready nélkül vagy pause állapotban`);
  }
  return failures;
}

module.exports = { adsenseProbeSource, requiredConsentCases, requiredTcfCases, tcfCheckpointFailures };

(() => {
  "use strict";

  const API_BASE = "https://kalkulator-bazis-api-dev.onrender.com";
  const TIMEOUT_MS = 3500;
  const DEBOUNCE_MS = 650;
  const MATCH_TOLERANCE_FT = 1;

  let timer = null;
  let sequence = 0;
  let activeController = null;

  function familyPayload(children) {
    const count = Math.max(0, Math.floor(Number(children) || 0));
    if (count === 0) return undefined;
    return {
      dependants: count,
      eligibleDependants: count,
      disabledEligibleDependants: 0,
      claimPercent: 100,
    };
  }

  function buildPayload(direction, amount, options) {
    const base = {
      under25: Boolean(options?.under25),
      firstMarried: Boolean(options?.firstMarried),
      motherBenefit: "none",
      personalAllowance: false,
    };

    const family = familyPayload(options?.children);
    if (family) base.family = family;

    if (direction === "gross-to-net") return { gross: Math.round(amount), ...base };
    return { desiredNet: Math.round(amount), ...base };
  }

  function endpoint(direction) {
    return `${API_BASE}/api/v1/calculators/salary/${direction}`;
  }

  function emit(detail) {
    window.dispatchEvent(new CustomEvent("kb:salary-shadow", { detail }));

    try {
      if (window.localStorage?.getItem("kbSalaryShadowDebug") === "1") {
        console.debug("[salary-shadow]", detail);
      }
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }

  async function compare(job, jobSequence) {
    activeController?.abort();
    const controller = new AbortController();
    activeController = controller;
    const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    const started = performance.now();

    try {
      const response = await fetch(endpoint(job.direction), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildPayload(job.direction, job.amount, job.options)),
        signal: controller.signal,
        credentials: "omit",
        cache: "no-store",
      });

      if (jobSequence !== sequence) return;

      const elapsedMs = Math.round(performance.now() - started);
      if (!response.ok) {
        emit({ status: "http_error", direction: job.direction, httpStatus: response.status, elapsedMs });
        return;
      }

      const payload = await response.json();
      const apiValue = job.direction === "gross-to-net" ? payload?.data?.net : payload?.data?.gross;
      const localValue = job.direction === "gross-to-net" ? job.localResult?.net : job.localResult?.gross;

      if (!Number.isFinite(apiValue) || !Number.isFinite(localValue)) {
        emit({ status: "invalid_response", direction: job.direction, elapsedMs });
        return;
      }

      const differenceFt = Math.round(apiValue) - Math.round(localValue);
      emit({
        status: Math.abs(differenceFt) <= MATCH_TOLERANCE_FT ? "match" : "mismatch",
        direction: job.direction,
        differenceFt,
        elapsedMs,
      });
    } catch (error) {
      if (jobSequence !== sequence) return;
      emit({
        status: error?.name === "AbortError" ? "timeout" : "network_error",
        direction: job.direction,
        elapsedMs: Math.round(performance.now() - started),
      });
    } finally {
      window.clearTimeout(timeout);
      if (activeController === controller) activeController = null;
    }
  }

  function schedule(job) {
    sequence += 1;
    const jobSequence = sequence;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => compare(job, jobSequence), DEBOUNCE_MS);
  }

  function cancel() {
    sequence += 1;
    window.clearTimeout(timer);
    activeController?.abort();
    activeController = null;
  }

  window.KBSalaryShadow = Object.freeze({ schedule, cancel });
})();

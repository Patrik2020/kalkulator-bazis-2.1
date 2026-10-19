(function () {
  if (window.KB_PUBLISHER_ADS_LOADED) return;
  window.KB_PUBLISHER_ADS_LOADED = true;
  const policy = window.KB_GLOBAL_HEAD_CONFIG?.adsensePolicy;
  if (policy?.placementMode !== "manual" || !policy.isEligible(window.location.pathname)) return;

  // Auto ads and Auto optimize must be OFF in the AdSense site settings.
  // Never hide/remove Google-inserted ads to simulate a limit. Request only the
  // three publisher-owned slots, once per document, after the existing CMP gate.
  const limit = Math.min(3, Math.max(0, Number(policy.maxSlots) || 0));
  const slots = [];
  let initialized = false;

  const requestAds = () => {
    if (window.KB_ADSENSE_ELIGIBLE !== true || window.KB_ADSENSE_CAN_REQUEST !== true) return;
    for (const slot of slots) {
      if (!slot.isConnected || slot.dataset.requested === "true") continue;
      slot.hidden = false;
      if (slot.getBoundingClientRect().width < 100) { slot.hidden = true; continue; }
      // Reserve before calling Google: repeated consent/resize events cannot
      // retry an empty, failed or already submitted slot.
      slot.dataset.requested = "true";
      const ad = document.createElement("ins");
      ad.className = "adsbygoogle";
      ad.style.display = "block";
      ad.dataset.adClient = "ca-pub-2639795157074812";
      ad.dataset.adSlot = "2032035454";
      ad.dataset.adFormat = "auto";
      ad.dataset.fullWidthResponsive = "true";
      slot.appendChild(ad);
      const observer = new MutationObserver(() => {
        const state = ad.getAttribute("data-ad-status");
        if (state === "unfilled") slot.hidden = true;
        if (state === "unfilled" || state === "filled") observer.disconnect();
      });
      observer.observe(ad, { attributes: true, attributeFilter: ["data-ad-status"] });
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        observer.disconnect();
        slot.hidden = true;
      }
    }
  };

  const initialize = () => {
    if (initialized) return;
    const main = document.querySelector("main");
    if (!main || !limit) return;
    initialized = true;
    // Sibling boundaries only: never insert into a calculator, result, form,
    // hero, table, card, or paragraph. Short pages may have fewer than 3 slots.
    const candidates = [...main.children].filter((element) =>
      ["SECTION", "ARTICLE", "DIV"].includes(element.tagName)
      && !element.hidden
      && !element.matches(".ad-section, [data-render], .hero, #homeHero, [data-home-multiplex-rail]")
      && !element.querySelector("input, select, textarea, output, [role='status']")
      && element.textContent.trim().length >= 180
    );
    const positions = [...new Set(Array.from({ length: limit }, (_, index) =>
      Math.floor((index + 1) * candidates.length / limit) - 1
    ))].filter((index) => index >= 0);
    for (const index of positions) {
      const anchor = candidates[index];
      const slot = document.createElement("aside");
      slot.className = "kb-publisher-ad";
      slot.setAttribute("aria-label", "Hirdetés");
      slot.dataset.kbPublisherSlot = String(slots.length + 1);
      slot.hidden = true;
      const label = document.createElement("span");
      label.className = "kb-publisher-ad__label";
      label.textContent = "Hirdetés";
      slot.appendChild(label);
      anchor.after(slot);
      slots.push(slot);
    }
    requestAds();
  };
  document.addEventListener("kb:adsense-ready", () => {
    if (document.readyState !== "loading") initialize();
    requestAds();
  });
  window.addEventListener("resize", requestAds);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();

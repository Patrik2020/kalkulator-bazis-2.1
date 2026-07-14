(function () {
  if (window.KB_GOOGLE_ADS_TAG_LOADED) return;
  window.KB_GOOGLE_ADS_TAG_LOADED = true;

  const googleTagLoaderId = "G-4JBY0GDC4C";
  const googleAdsId = "AW-18204925339";
  let adsDestinationConfigured = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  const hasAdsConsent = () =>
    Boolean(window.KB_CONSENT_MANAGER?.hasConsent?.("ads"));

  const findGoogleTagScript = () =>
    [...document.scripts].find((script) => {
      if (!script.src) return false;

      try {
        const url = new URL(script.src, window.location.href);
        return (
          url.origin === "https://www.googletagmanager.com" &&
          url.pathname === "/gtag/js"
        );
      } catch (error) {
        return false;
      }
    });

  const configureAdsDestination = () => {
    if (adsDestinationConfigured || !hasAdsConsent()) return;

    window.gtag("config", googleAdsId);
    adsDestinationConfigured = true;
  };

  const ensureGoogleAdsTag = () => {
    if (!hasAdsConsent() || adsDestinationConfigured) return;

    if (!findGoogleTagScript()) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagLoaderId}`;
      document.head.appendChild(script);
      window.gtag("js", new Date());
    }

    configureAdsDestination();
  };

  document.addEventListener("kb:consent-ready", ensureGoogleAdsTag);
  document.addEventListener("kb:consent-updated", ensureGoogleAdsTag);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureGoogleAdsTag, { once: true });
  } else {
    ensureGoogleAdsTag();
  }
})();

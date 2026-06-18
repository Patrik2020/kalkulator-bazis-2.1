(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const consent = localStorage.getItem("cookieConsent");

  // 🔥 ha már döntött → ne jelenjen meg
  if (consent === "accepted") {
    updateConsent("granted");
    banner.style.display = "none";
    loadAnalytics();
    return;
  }

  if (consent === "declined") {
    updateConsent("denied");
    banner.style.display = "none";
    return;
  }

  // ❗ csak akkor jelenjen meg, ha nincs döntés
  banner.style.display = "flex";

  const acceptBtn = document.getElementById("accept-cookies");
  const declineBtn = document.getElementById("decline-cookies");

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      updateConsent("granted");
      banner.style.display = "none";
      loadAnalytics();
      document.dispatchEvent(new CustomEvent("kb:consent-updated"));
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      updateConsent("denied");
      banner.style.display = "none";
      document.dispatchEvent(new CustomEvent("kb:consent-updated"));
    });
  }
})();

/* Analytics */

function updateConsent(value) {
  if (typeof window.gtag !== "function") return;

  window.gtag("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

function loadAnalytics() {
  if (window.analyticsLoaded) return;
  window.analyticsLoaded = true;

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-4JBY0GDC4C";
  script.async = true;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", "G-4JBY0GDC4C");
}

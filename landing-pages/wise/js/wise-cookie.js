const cookieBanner = document.getElementById("cookieBanner");

const acceptCookies = document.getElementById("acceptCookies");

const rejectCookies = document.getElementById("rejectCookies");

/* ========================= */
/* ANALYTICS */
/* ========================= */

function loadAnalytics() {
  if (window.analyticsLoaded) return;

  window.analyticsLoaded = true;

  const script = document.createElement("script");

  script.src = "https://www.googletagmanager.com/gtag/js?id=G-4JBY0GDC4C";

  script.async = true;

  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag("js", new Date());

  gtag("config", "G-4JBY0GDC4C");
}

/* ========================= */
/* COOKIE CHECK */
/* ========================= */

const consent = localStorage.getItem("cookieConsent");

if (consent === "accepted") {
  cookieBanner.style.display = "none";

  loadAnalytics();
} else if (consent === "rejected") {
  cookieBanner.style.display = "none";
} else {
  cookieBanner.style.display = "block";
}

/* ========================= */
/* ACCEPT */
/* ========================= */

acceptCookies.addEventListener("click", () => {
  localStorage.setItem("cookieConsent", "accepted");

  cookieBanner.style.display = "none";

  loadAnalytics();
});

/* ========================= */
/* REJECT */
/* ========================= */

rejectCookies.addEventListener("click", () => {
  localStorage.setItem("cookieConsent", "rejected");

  cookieBanner.style.display = "none";
});

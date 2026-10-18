(function () {
  const initialize = () => {
  const rails = [...document.querySelectorAll("[data-home-multiplex-rail]")];
  if (rails.length !== 2) return;
  if (window.KB_SITE_RUNTIME?.claimInitialization(rails[0], "home-multiplex-rails") === false) return;

  const wideViewport = window.matchMedia("(min-width: 1760px)");
  const renderRails = () => {
    if (!wideViewport.matches || window.KB_ADSENSE_ELIGIBLE !== true || window.KB_ADSENSE_CAN_REQUEST !== true) return;

    for (const rail of rails) {
      if (!rail.isConnected) continue;
      if (rail.querySelector("ins.adsbygoogle")) continue;

      const label = document.createElement("span");
      label.className = "home-ad-rail__label";
      label.textContent = "Hirdetés";

      const ad = document.createElement("ins");
      ad.className = "adsbygoogle";
      ad.style.display = "block";
      ad.dataset.adFormat = "autorelaxed";
      ad.dataset.adClient = "ca-pub-2639795157074812";
      ad.dataset.adSlot = "3407239379";

      rail.append(label, ad);
      rail.hidden = false;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  };

  document.addEventListener("kb:adsense-ready", renderRails);
  wideViewport.addEventListener("change", renderRails);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderRails, { once: true });
  } else {
    renderRails();
  }
  };
  if (window.KB_SITE_RUNTIME) window.KB_SITE_RUNTIME.registerHomeInitializer("home-multiplex-rails.js", initialize);
  else initialize();
})();

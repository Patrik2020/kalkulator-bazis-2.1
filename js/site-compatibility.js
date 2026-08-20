(() => {
  "use strict";

  const DISMISS_KEY = "kb-site-compatibility-dismissed-at";
  const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000;
  const NOTICE_ID = "kb-site-compatibility-notice";
  const PROBE_ID = "kb-site-compatibility-probe";

  const isRecentlyDismissed = () => {
    try {
      const value = Number(localStorage.getItem(DISMISS_KEY));
      return Number.isFinite(value) && Date.now() - value < DISMISS_FOR_MS;
    } catch (error) {
      return false;
    }
  };

  const rememberDismissal = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch (error) {
      // The notice can still be dismissed for the current page when storage is unavailable.
    }
  };

  const renderNotice = () => {
    if (document.getElementById(NOTICE_ID) || isRecentlyDismissed()) return;

    const notice = document.createElement("aside");
    notice.id = NOTICE_ID;
    notice.className = "kb-compat-notice";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    notice.innerHTML = `
      <span class="kb-compat-notice__icon" aria-hidden="true">!</span>
      <div class="kb-compat-notice__content">
        <strong>Reklámblokkoló vagy tartalomszűrő lehet aktív</strong>
        <p>Egyes blokkolók a Kalkulátor Bázis működéséhez szükséges szkripteket is tévesen blokkolhatják. Ha egy kalkulátor nem számol, az oldal nem reagál, vagy betöltés közben megakad, engedélyezd ideiglenesen a <strong>kalkulatorbazis.hu</strong> oldalt a blokkolóban, majd frissítsd az oldalt. Ha minden megfelelően működik, nincs teendőd.</p>
      </div>
      <button class="kb-compat-notice__close" type="button" aria-label="Figyelmeztetés bezárása">Értem</button>
    `;

    notice.querySelector(".kb-compat-notice__close")?.addEventListener("click", () => {
      rememberDismissal();
      notice.remove();
    });

    const main = document.querySelector("main");
    if (main) main.before(notice);
    else document.body.prepend(notice);
  };

  const detectContentBlocker = () => new Promise((resolve) => {
    const probe = document.createElement("div");
    probe.id = PROBE_ID;
    probe.className = "kb-compat-probe adsbox ad-banner ad-placement ad-unit text-ad banner-ad";
    probe.setAttribute("aria-hidden", "true");
    probe.tabIndex = -1;
    document.body.appendChild(probe);

    window.setTimeout(() => {
      let blocked = !probe.isConnected;

      if (probe.isConnected) {
        const style = window.getComputedStyle(probe);
        blocked =
          probe.offsetWidth === 0 ||
          probe.offsetHeight === 0 ||
          style.display === "none" ||
          style.visibility === "hidden";
        probe.remove();
      }

      resolve(blocked);
    }, 350);
  });

  const init = async () => {
    if (isRecentlyDismissed()) return;

    try {
      if (await detectContentBlocker()) renderNotice();
    } catch (error) {
      // Compatibility detection must never interfere with calculator functionality.
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
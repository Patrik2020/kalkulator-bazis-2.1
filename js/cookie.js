(function () {
  if (window.KB_COOKIE_MANAGER_LOADED) return;
  window.KB_COOKIE_MANAGER_LOADED = true;

  const storageKey = "kbCookieConsent";
  const legacyStorageKey = "cookieConsent";
  const consentVersion = "2026-06-26.v2";
  const maxAgeDays = 180;
  const analyticsId = "G-4JBY0GDC4C";
  const maxClockSkewMs = 5 * 60 * 1000;
  const maxRecordAgeMs = (maxAgeDays + 2) * 24 * 60 * 60 * 1000;
  const allowedCategoryKeys = ["necessary", "analytics", "ads"];

  const defaultCategories = {
    necessary: true,
    analytics: false,
    ads: false,
  };

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch (error) {
        return false;
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        // localStorage may be blocked.
      }
    },
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  const normalizeCategories = (categories) => ({
    necessary: true,
    analytics: Boolean(categories && categories.analytics),
    ads: Boolean(categories && categories.ads),
  });

  const cloneRecord = (record) =>
    record
      ? {
          version: record.version,
          categories: { ...record.categories },
          decidedAt: record.decidedAt,
          expiresAt: record.expiresAt,
        }
      : null;

  const isPlainObject = (value) =>
    value !== null &&
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype;

  const parseDate = (value) => {
    if (typeof value !== "string" || !value.trim()) return NaN;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : NaN;
  };

  const expiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + maxAgeDays);
    return date.toISOString();
  };

  const makeRecord = (categories) => ({
    version: consentVersion,
    categories: normalizeCategories(categories),
    decidedAt: new Date().toISOString(),
    expiresAt: expiryDate(),
  });

  const isRecordValid = (record) => {
    if (!isPlainObject(record) || record.version !== consentVersion) {
      return false;
    }

    if (!isPlainObject(record.categories)) return false;

    const categoryKeys = Object.keys(record.categories);
    if (!categoryKeys.every((key) => allowedCategoryKeys.includes(key))) {
      return false;
    }

    if (record.categories.necessary !== true) return false;
    if (typeof record.categories.analytics !== "boolean") return false;
    if (typeof record.categories.ads !== "boolean") return false;

    const decidedAt = parseDate(record.decidedAt);
    const expiresAt = parseDate(record.expiresAt);
    const now = Date.now();

    if (!Number.isFinite(decidedAt) || !Number.isFinite(expiresAt)) return false;
    if (decidedAt > now + maxClockSkewMs) return false;
    if (expiresAt <= now) return false;
    if (expiresAt <= decidedAt) return false;
    if (expiresAt - decidedAt > maxRecordAgeMs) return false;

    return true;
  };

  const parseStoredConsent = (stored) => {
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      return isRecordValid(parsed) ? parsed : null;
    } catch (error) {
      return null;
    }
  };

  const readStoredConsent = () => {
    const stored = safeStorage.get(storageKey);
    const parsed = parseStoredConsent(stored);

    if (parsed) {
      safeStorage.remove(legacyStorageKey);
      return parsed;
    }
    if (stored) safeStorage.remove(storageKey);

    return null;
  };

  const migrateLegacyConsent = () => {
    const legacy = safeStorage.get(legacyStorageKey);
    let migratedRecord = null;

    if (legacy === "accepted") {
      migratedRecord = makeRecord({ analytics: true, ads: true });
    } else if (legacy === "declined" || legacy === "rejected") {
      migratedRecord = makeRecord({ analytics: false, ads: false });
    }

    if (!migratedRecord) {
      if (legacy !== null) safeStorage.remove(legacyStorageKey);
      return null;
    }

    const saved = safeStorage.set(storageKey, JSON.stringify(migratedRecord));
    safeStorage.remove(legacyStorageKey);

    return saved && isRecordValid(migratedRecord) ? migratedRecord : null;
  };

  let currentConsent = readStoredConsent() || migrateLegacyConsent();
  let lastFocusedElement = null;
  let openedFromSavedChoice = false;
  let toastTimer = null;

  const hasConsent = (category) => {
    if (category === "necessary") return true;
    if (!allowedCategoryKeys.includes(category)) return false;
    return isRecordValid(currentConsent) && Boolean(currentConsent.categories[category]);
  };

  const getConsentSnapshot = () =>
    isRecordValid(currentConsent) ? cloneRecord(currentConsent) : null;

  const dispatchConsentEvent = (eventName = "kb:consent-updated") => {
    document.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          consent: getConsentSnapshot(),
          categories: getConsentSnapshot()?.categories || { ...defaultCategories },
        },
      })
    );
  };

  const updateGoogleConsent = (categories) => {
    const normalized = normalizeCategories(categories);

    window.gtag("consent", "update", {
      analytics_storage: normalized.analytics ? "granted" : "denied",
      ad_storage: normalized.ads ? "granted" : "denied",
      ad_user_data: normalized.ads ? "granted" : "denied",
      ad_personalization: normalized.ads ? "granted" : "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
  };

  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='600' viewBox='0 0 300 600'%3E%3Crect width='300' height='600' fill='%23e8f0ef'/%3E%3Ctext x='150' y='286' text-anchor='middle' font-family='Arial,sans-serif' font-size='18' font-weight='700' fill='%2307111f'%3EWise partner banner%3C/text%3E%3Ctext x='150' y='318' text-anchor='middle' font-family='Arial,sans-serif' font-size='13' fill='%23607084'%3EMarketing hozzajarulas utan tolt be%3C/text%3E%3C/svg%3E";

  const updateConsentControlledAssets = (categories) => {
    const normalized = normalizeCategories(categories);

    document.querySelectorAll("[data-cookie-src]").forEach((element) => {
      const category = element.dataset.cookieCategory || "ads";
      const allowed = category === "analytics" ? normalized.analytics : normalized.ads;
      const targetSrc = element.dataset.cookieSrc;

      if (!targetSrc) return;

      if (allowed) {
        if (element.getAttribute("src") !== targetSrc) {
          element.setAttribute("src", targetSrc);
        }
      } else if (element.tagName === "IMG") {
        element.setAttribute("src", element.dataset.placeholderSrc || placeholderImage);
      }
    });
  };

  const loadAnalytics = () => {
    if (!hasConsent("analytics") || window.analyticsLoaded) return;

    window.analyticsLoaded = true;

    const existing = document.querySelector(
      `script[src="https://www.googletagmanager.com/gtag/js?id=${analyticsId}"]`
    );

    const configure = () => {
      window.gtag("js", new Date());
      window.gtag("config", analyticsId, { anonymize_ip: true });
    };

    if (existing) {
      configure();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    script.async = true;
    script.addEventListener("load", configure, { once: true });
    document.head.appendChild(script);
  };

  const persistConsent = (categories) => {
    const nextConsent = makeRecord(categories);
    const saved = safeStorage.set(storageKey, JSON.stringify(nextConsent));

    currentConsent = nextConsent;
    safeStorage.remove(legacyStorageKey);
    updateGoogleConsent(currentConsent.categories);
    updateConsentControlledAssets(currentConsent.categories);
    loadAnalytics();
    dispatchConsentEvent();
    return saved;
  };

  const getBasePath = () => {
    const script = document.currentScript || document.querySelector('script[src$="js/cookie.js"]');
    const src = script?.getAttribute("src") || "";
    const match = src.match(/^(.*)js\/cookie\.js(?:\?.*)?$/);
    if (match) return match[1];

    return window.location.pathname.includes("/kalkulatorok/") ? "../" : "";
  };

  const basePath = getBasePath();

  const getFocusableElements = (container) =>
    [
      ...container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ),
    ].filter((element) => element.offsetParent !== null || element === document.activeElement);

  const setStatus = (message) => {
    const status = document.getElementById("cookieConsentStatus");
    if (!status || !message) return;

    status.textContent = message;
    status.classList.add("is-visible");
  };

  const showConsentToast = (message) => {
    if (!message) return;

    let toast = document.getElementById("cookieConsentToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cookieConsentToast";
      toast.className = "cookie-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  };

  const syncToggles = () => {
    const categories = getConsentSnapshot()?.categories || defaultCategories;
    const analyticsToggle = document.getElementById("cookieAnalytics");
    const adsToggle = document.getElementById("cookieAds");

    if (analyticsToggle) analyticsToggle.checked = Boolean(categories.analytics);
    if (adsToggle) adsToggle.checked = Boolean(categories.ads);
  };

  const showSettingsPanel = () => {
    const panel = document.getElementById("cookieSettingsPanel");
    const settingsButton = document.getElementById("cookieOpenSettings");

    if (!panel) return;

    panel.classList.add("is-active");
    settingsButton?.setAttribute("aria-expanded", "true");
    syncToggles();

    const firstToggle = panel.querySelector("input:not([disabled])");
    firstToggle?.focus();
  };

  const hideSettingsPanel = () => {
    const panel = document.getElementById("cookieSettingsPanel");
    const settingsButton = document.getElementById("cookieOpenSettings");

    panel?.classList.remove("is-active");
    settingsButton?.setAttribute("aria-expanded", "false");
  };

  const createModal = () => {
    let overlay = document.getElementById("cookie-banner");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "cookie-banner";
      document.body.appendChild(overlay);
    }

    overlay.className = "cookie-banner";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div
        class="cookie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookieModalTitle"
        aria-describedby="cookieModalDescription"
        tabindex="-1"
      >
        <div class="cookie-modal-header">
          <h2 class="cookie-modal-title" id="cookieModalTitle">Sütibeállítások</h2>
          <p class="cookie-modal-description" id="cookieModalDescription">
            A Kalkulátor Bázis a weboldal megfelelő működéséhez szükséges helyi tárolást használ.
            Az analitikai és hirdetési célú technológiákat csak a hozzájárulásod
            alapján kapcsoljuk be. A választásodat később bármikor módosíthatod.
          </p>
        </div>

        <div class="cookie-modal-body">
          <p>
            Részletes információt a
            <a href="${basePath}cookie.html">Sütikezelési tájékoztatóban</a>
            találsz.
          </p>
          <p class="cookie-status" id="cookieConsentStatus" role="status" aria-live="polite"></p>
        </div>

        <div class="cookie-modal-actions" aria-label="Gyors sütiválasztás">
          <div class="cookie-action-row">
            <button class="cookie-button cookie-button-primary" id="cookieAcceptAll" type="button">Mindet elfogadom</button>
            <button class="cookie-button cookie-button-necessary" id="cookieNecessaryOnly" type="button">Csak szükséges sütik</button>
          </div>
          <button
            class="cookie-button cookie-button-text"
            id="cookieOpenSettings"
            type="button"
            aria-expanded="false"
            aria-controls="cookieSettingsPanel"
          >
            Beállítások
          </button>
        </div>

        <div class="cookie-settings-panel" id="cookieSettingsPanel">
          <article class="cookie-category">
            <div class="cookie-category-header">
              <h3>Szükséges működés</h3>
              <span class="cookie-required-badge">Mindig aktív</span>
            </div>
            <p>
              Ezek biztosítják az alapvető működést, például a hozzájárulási
              döntés és a téma beállításának megjegyzését a böngésződben.
            </p>
          </article>

          <article class="cookie-category">
            <div class="cookie-category-header">
              <h3>Analitika</h3>
              <label class="cookie-switch" for="cookieAnalytics">
                <input id="cookieAnalytics" type="checkbox" />
                <span class="cookie-switch-label">Engedélyezés</span>
              </label>
            </div>
            <p>
              A Google Analytics segítségével anonim látogatottsági képet kapunk
              arról, mely oldalak és kalkulátorok hasznosak.
            </p>
          </article>

          <article class="cookie-category">
            <div class="cookie-category-header">
              <h3>Hirdetés és marketing</h3>
              <label class="cookie-switch" for="cookieAds">
                <input id="cookieAds" type="checkbox" />
                <span class="cookie-switch-label">Engedélyezés</span>
              </label>
            </div>
            <p>
              Ide tartozik a Google AdSense hirdetésbetöltés és a partneri
              bannerek külső képeinek betöltése.
            </p>
          </article>

          <div class="cookie-action-row">
            <button class="cookie-button cookie-button-primary" id="cookieSaveSettings" type="button">Beállítások mentése</button>
            <button class="cookie-button cookie-button-secondary" id="cookieRevokeAll" type="button">Opcionális elemek elutasítása</button>
          </div>
        </div>
      </div>
    `;

    bindModalEvents(overlay);
    return overlay;
  };

  const closeModal = (restoreFocus = true) => {
    const overlay = document.getElementById("cookie-banner");
    if (!overlay) return;

    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    hideSettingsPanel();
    document.body.classList.remove("cookie-modal-open");

    if (restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  const openModal = ({ settings = false, fromSavedChoice = false } = {}) => {
    const overlay = document.getElementById("cookie-banner") || createModal();
    const modal = overlay.querySelector(".cookie-modal");

    openedFromSavedChoice = fromSavedChoice;
    lastFocusedElement = document.activeElement;
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("cookie-modal-open");
    syncToggles();

    if (settings) {
      showSettingsPanel();
    } else {
      hideSettingsPanel();
    }

    requestAnimationFrame(() => {
      const preferredFocus = settings
        ? document.getElementById("cookieAnalytics") || document.getElementById("cookieSaveSettings")
        : getFocusableElements(modal)[0];
      (preferredFocus || modal).focus();
    });
  };

  const handleDecision = (categories, message) => {
    const saved = persistConsent(categories);
    const feedback = saved
      ? message
      : "A böngésző nem engedte a választás tartós mentését, de ezen az oldalon a döntésed szerint működünk.";

    setStatus(feedback);
    showConsentToast(feedback);
    window.setTimeout(() => closeModal(), 160);
  };

  function bindModalEvents(overlay) {
    if (overlay.dataset.bound === "true") return;
    overlay.dataset.bound = "true";

    overlay.addEventListener("click", (event) => {
      if (event.target !== overlay) return;
      if (getConsentSnapshot() || openedFromSavedChoice) closeModal();
    });

    overlay.querySelector("#cookieAcceptAll")?.addEventListener("click", () => {
      handleDecision(
        { analytics: true, ads: true },
        "Minden opcionális kategória engedélyezve."
      );
    });

    overlay.querySelector("#cookieNecessaryOnly")?.addEventListener("click", () => {
      handleDecision(
        { analytics: false, ads: false },
        "Csak a szükséges működés marad aktív."
      );
    });

    overlay.querySelector("#cookieOpenSettings")?.addEventListener("click", () => {
      const panel = document.getElementById("cookieSettingsPanel");
      if (panel?.classList.contains("is-active")) {
        hideSettingsPanel();
      } else {
        showSettingsPanel();
      }
    });

    overlay.querySelector("#cookieSaveSettings")?.addEventListener("click", () => {
      const analytics = Boolean(document.getElementById("cookieAnalytics")?.checked);
      const ads = Boolean(document.getElementById("cookieAds")?.checked);
      handleDecision({ analytics, ads }, "A sütibeállítások mentve.");
    });

    overlay.querySelector("#cookieRevokeAll")?.addEventListener("click", () => {
      handleDecision(
        { analytics: false, ads: false },
        "Az opcionális elemek elutasítva."
      );
    });

    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (getConsentSnapshot() || openedFromSavedChoice) closeModal();
        return;
      }

      if (event.key !== "Tab") return;

      const modal = overlay.querySelector(".cookie-modal");
      const focusable = getFocusableElements(modal);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  window.KB_CONSENT_MANAGER = {
    isReady: true,
    openSettings() {
      openModal({ settings: true, fromSavedChoice: Boolean(getConsentSnapshot()) });
    },
    getConsent() {
      return getConsentSnapshot();
    },
    hasConsent,
    validateRecord(record) {
      return isRecordValid(record);
    },
    version: consentVersion,
    maxAgeDays,
  };

  const init = () => {
    createModal();

    if (getConsentSnapshot()) {
      updateGoogleConsent(currentConsent.categories);
      updateConsentControlledAssets(currentConsent.categories);
      loadAnalytics();
      closeModal(false);
    } else {
      updateGoogleConsent(defaultCategories);
      updateConsentControlledAssets(defaultCategories);
      openModal();
    }

    dispatchConsentEvent("kb:consent-ready");

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-cookie-settings]");
      if (!trigger) return;

      event.preventDefault();
      openModal({ settings: true, fromSavedChoice: Boolean(getConsentSnapshot()) });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      const overlay = document.getElementById("cookie-banner");
      if (!overlay?.classList.contains("is-visible")) return;

      event.preventDefault();
      if (getConsentSnapshot() || openedFromSavedChoice) closeModal();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

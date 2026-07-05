(function () {
  if (window.KB_PWA_LOADED) return;
  window.KB_PWA_LOADED = true;

  const rawProjectRoot = window.KB_PROJECT_ROOT || "";
  const projectRoot = /^\/(?:[a-z0-9._-]+(?:\/[a-z0-9._-]+)*)?$/i.test(rawProjectRoot)
    ? rawProjectRoot.replace(/\/+$/, "")
    : "";
  const serviceWorkerUrl = new URL(`${projectRoot}/sw.js`, window.location.origin);
  const expectedScopeUrl = new URL(`${projectRoot || ""}/`, window.location.origin);
  const reloadStorageKey = "kb-sw-controller-reload-2026-07-05-security-v2";
  let deferredPrompt = null;
  let installed = false;

  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const canUseServiceWorker =
    "serviceWorker" in navigator &&
    serviceWorkerUrl.origin === window.location.origin &&
    expectedScopeUrl.origin === window.location.origin &&
    (window.location.protocol === "https:" || isLocalhost);

  const safeSessionStorage = {
    get(key) {
      try {
        return window.sessionStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.sessionStorage.setItem(key, value);
        return true;
      } catch (error) {
        return false;
      }
    },
  };

  const isStandalone = () =>
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    installed;

  const dispatch = (name, detail = {}) => {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  };

  const trackInstallSuccess = () => {
    if (typeof window.KB_TRACK_EVENT !== "function") return;

    window.KB_TRACK_EVENT("pwa_install_success", {
      page_path: window.location.pathname,
      display_mode: "standalone",
    });
  };

  const getState = () => ({
    canInstall: Boolean(deferredPrompt && !isStandalone()),
    installed: isStandalone(),
    serviceWorkerSupported: "serviceWorker" in navigator,
    serviceWorkerAllowed: canUseServiceWorker,
  });

  const registerServiceWorker = () => {
    if (!canUseServiceWorker) return;

    const hadController = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController) return;
      if (safeSessionStorage.get(reloadStorageKey) === "done") return;

      safeSessionStorage.set(reloadStorageKey, "done");
      window.location.reload();
    });

    navigator.serviceWorker
      .register(serviceWorkerUrl.href, {
        scope: expectedScopeUrl.pathname,
        updateViaCache: "none",
      })
      .then((registration) => {
        let registeredScope;

        try {
          registeredScope = new URL(registration.scope);
        } catch (error) {
          registration.unregister().catch(() => {});
          dispatch("kb:pwa-sw-error", { reason: "invalid-scope" });
          return;
        }

        if (
          registeredScope.origin !== window.location.origin ||
          registeredScope.pathname !== expectedScopeUrl.pathname
        ) {
          registration.unregister().catch(() => {});
          dispatch("kb:pwa-sw-error", { reason: "unexpected-scope" });
          return;
        }

        dispatch("kb:pwa-sw-ready", { scope: registration.scope });
        registration.update().catch(() => {});
      })
      .catch(() => {
        dispatch("kb:pwa-sw-error", { reason: "registration-failed" });
      });
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    if (isStandalone()) return;

    event.preventDefault();
    deferredPrompt = event;
    dispatch("kb:pwa-install-available", getState());
  });

  window.addEventListener("appinstalled", () => {
    installed = true;
    deferredPrompt = null;
    trackInstallSuccess();
    dispatch("kb:pwa-installed", getState());
  });

  window.KB_PWA = {
    canInstall() {
      return Boolean(deferredPrompt && !isStandalone());
    },
    getState,
    async promptInstall() {
      if (!deferredPrompt || isStandalone()) {
        return { outcome: "unavailable" };
      }

      if (navigator.userActivation && !navigator.userActivation.isActive) {
        return { outcome: "unavailable" };
      }

      const promptEvent = deferredPrompt;
      deferredPrompt = null;

      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        dispatch("kb:pwa-install-finished", choice || { outcome: "unknown" });
        return choice || { outcome: "unknown" };
      } catch (error) {
        dispatch("kb:pwa-install-finished", { outcome: "error" });
        return { outcome: "error" };
      }
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerServiceWorker, { once: true });
  } else {
    registerServiceWorker();
  }
})();
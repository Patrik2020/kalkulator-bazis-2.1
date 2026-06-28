(function () {
  if (window.KB_PWA_LOADED) return;
  window.KB_PWA_LOADED = true;

  const projectRoot = window.KB_PROJECT_ROOT || "";
  const serviceWorkerPath = `${projectRoot}/sw.js`;
  const reloadStorageKey = "kb-sw-controller-reload-2026-06-28-dividend-pro-v1";
  let deferredPrompt = null;
  let installed = false;

  const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const canUseServiceWorker =
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" || isLocalhost);

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
      if (sessionStorage.getItem(reloadStorageKey) === "done") return;

      sessionStorage.setItem(reloadStorageKey, "done");
      window.location.reload();
    });

    navigator.serviceWorker
      .register(serviceWorkerPath, { updateViaCache: "none" })
      .then((registration) => {
        dispatch("kb:pwa-sw-ready", { scope: registration.scope });
        registration.update().catch(() => {});
      })
      .catch(() => {
        dispatch("kb:pwa-sw-error");
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
    document.addEventListener("DOMContentLoaded", registerServiceWorker);
  } else {
    registerServiceWorker();
  }
})();

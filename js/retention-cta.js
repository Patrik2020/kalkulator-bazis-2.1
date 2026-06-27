(function () {
  if (window.KB_RETENTION_CTA_LOADED) return;
  window.KB_RETENTION_CTA_LOADED = true;

  const componentPath = "components/retention-cta.html";
  const publicOrigin = "https://kalkulatorbazis.hu";
  const invalidResultPattern =
    /(^[\s–—-]*$|add meg|adj meg|töltsd|toltsd|hiba|hibás|hibas|érvénytelen|ervenytelen|hiány|hiany|nem sikerült|nem sikerult|betöltés|betoltes|betöltése|betoltese|árfolyamok betöltése|arfolyamok betoltese)/i;

  const state = {
    cta: null,
    revealed: false,
    animated: false,
    interactedCards: new WeakSet(),
    deferredInstallCheckTimer: null,
  };

  const getBasePath = () =>
    window.location.pathname.includes("/kalkulatorok/") ? "../" : "";

  const getCalculatorFromData = () => {
    const path = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
    return window.KB_DATA?.calculators?.find((calculator) =>
      path.endsWith(`/${calculator.url}`) || path.endsWith(calculator.url)
    );
  };

  const getCategoryFromData = (calculator) =>
    calculator
      ? window.KB_DATA?.categories?.find((category) => category.id === calculator.category)
      : null;

  const normalizeText = (value) =>
    (value || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const isStandalone = () =>
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const getDeviceType = () => {
    const width = window.innerWidth || document.documentElement.clientWidth;
    if (width < 768) return "mobile";
    if (width < 1100) return "tablet";
    return "desktop";
  };

  const getDisplayMode = () => (isStandalone() ? "standalone" : "browser");

  const hasAnalyticsConsent = () =>
    Boolean(window.KB_CONSENT_MANAGER?.isReady && window.KB_CONSENT_MANAGER.hasConsent?.("analytics"));

  const track = (eventName, actionMethod) => {
    if (!hasAnalyticsConsent() || typeof window.gtag !== "function") return;

    const calculator = getCalculatorFromData();
    const category = getCategoryFromData(calculator);

    window.gtag("event", eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      calculator_name: calculator?.title || document.querySelector("h1")?.textContent.trim() || "",
      calculator_category: category?.id || calculator?.category || "",
      action_method: actionMethod,
      display_mode: getDisplayMode(),
      device_type: getDeviceType(),
    });
  };

  const getPublicUrl = () => {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;

    if (canonical && /^https:\/\/kalkulatorbazis\.hu\//i.test(canonical)) {
      return canonical;
    }

    const path = `${window.location.pathname}${window.location.search}`.replace(
      /^\/(?:kalkulator-bazis(?:-[^/]+)?\/)?/i,
      "/"
    );

    return `${publicOrigin}${path}`;
  };

  const setStatus = (message) => {
    const status = state.cta?.querySelector("[data-retention-status]");
    if (status) status.textContent = message || "";
  };

  const closeGuide = (name) => {
    const guide = state.cta?.querySelector(`[data-retention-guide="${name}"]`);
    const button = state.cta?.querySelector(`[aria-controls="${guide?.id}"]`);

    guide?.setAttribute("hidden", "");
    button?.setAttribute("aria-expanded", "false");
  };

  const toggleGuide = (button, guide, message) => {
    if (!button || !guide) return;

    const shouldOpen = guide.hasAttribute("hidden");
    state.cta
      ?.querySelectorAll("[data-retention-guide]")
      .forEach((item) => item.setAttribute("hidden", ""));
    state.cta
      ?.querySelectorAll("[aria-expanded]")
      .forEach((item) => item.setAttribute("aria-expanded", "false"));

    if (shouldOpen) {
      guide.removeAttribute("hidden");
      button.setAttribute("aria-expanded", "true");
      setStatus(message || "");
    } else {
      setStatus("");
    }
  };

  const getPlatformInfo = () => {
    const ua = window.navigator.userAgent || "";
    const platform = window.navigator.platform || "";
    const maxTouchPoints = window.navigator.maxTouchPoints || 0;
    const isAppleMobile =
      /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
    const isMac = /Mac/.test(platform) && !isAppleMobile;
    const isAndroid = /Android/i.test(ua);
    const isMobile = isAppleMobile || isAndroid || /Mobi|Mobile/i.test(ua);
    const isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);

    return { isAppleMobile, isMac, isAndroid, isMobile, isSafari };
  };

  const getBookmarkGuide = () => {
    const platform = getPlatformInfo();

    if (platform.isAppleMobile) {
      return {
        method: "ios_favorites_guide",
        text: "Nyisd meg a Megosztás menüt, majd válaszd a Hozzáadás a Kedvencekhez lehetőséget.",
      };
    }

    if (platform.isMac) {
      return {
        method: "keyboard_macos",
        text: "Nyomd meg a ⌘ + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.",
      };
    }

    if (platform.isAndroid || platform.isMobile) {
      return {
        method: "mobile_browser_guide",
        text: "Nyisd meg a böngésző menüjét, majd válaszd a Könyvjelző hozzáadása vagy a csillag ikont.",
      };
    }

    if (/Win|Linux|X11/i.test(window.navigator.platform || "")) {
      return {
        method: "keyboard_windows",
        text: "Nyomd meg a Ctrl + D billentyűkombinációt, majd mentsd el az oldalt a könyvjelzőid közé.",
      };
    }

    return {
      method: "generic_guide",
      text: "Nyisd meg a böngésződ menüjét, és keresd a Könyvjelző, Kedvencek vagy Mentés lehetőséget.",
    };
  };

  const getInstallGuide = () => {
    const platform = getPlatformInfo();

    if (!platform.isAppleMobile || isStandalone()) return null;

    return {
      method: "ios_home_screen_guide",
      label: "Hozzáadás a Főképernyőhöz",
      text: platform.isSafari
        ? "Nyisd meg a Safari Megosztás menüjét, válaszd a Hozzáadás a Főképernyőhöz lehetőséget, majd koppints a Hozzáadás gombra."
        : "A Főképernyőhöz adás iPhone-on és iPaden Safariból végezhető el a legegyértelműbben. Nyisd meg ott az oldalt, majd használd a Megosztás menüt.",
    };
  };

  const updateInstallAction = () => {
    if (!state.cta) return;

    const button = state.cta.querySelector('[data-retention-action="install"]');
    const label = state.cta.querySelector("[data-retention-install-label]");
    const guideText = state.cta.querySelector("[data-retention-install-text]");
    const installGuide = getInstallGuide();
    const pwaState = window.KB_PWA?.getState?.();
    const canInstall = Boolean(window.KB_PWA?.canInstall?.());

    if (!button || !label) return;

    if (pwaState?.installed || isStandalone()) {
      button.setAttribute("hidden", "");
      closeGuide("install");
      return;
    }

    if (installGuide) {
      label.textContent = installGuide.label;
      button.removeAttribute("hidden");
      button.dataset.installMode = "guide";
      button.dataset.installMethod = installGuide.method;
      if (guideText) guideText.textContent = installGuide.text;
      return;
    }

    if (canInstall) {
      label.textContent = "Telepítem";
      button.removeAttribute("hidden");
      button.dataset.installMode = "prompt";
      if (guideText) guideText.textContent = "";
      return;
    }

    button.setAttribute("hidden", "");
    closeGuide("install");
  };

  const handleBookmark = () => {
    const button = state.cta.querySelector('[data-retention-action="bookmark"]');
    const guide = state.cta.querySelector('[data-retention-guide="bookmark"]');
    const text = state.cta.querySelector("[data-retention-bookmark-text]");
    const bookmarkGuide = getBookmarkGuide();

    if (text) text.textContent = bookmarkGuide.text;
    toggleGuide(button, guide, "Kövesd az útmutatót a könyvjelző mentéséhez.");
    track("bookmark_cta_click", bookmarkGuide.method);
  };

  const handleInstall = async () => {
    const button = state.cta.querySelector('[data-retention-action="install"]');
    const guide = state.cta.querySelector('[data-retention-guide="install"]');

    if (button?.dataset.installMode === "prompt" && window.KB_PWA?.canInstall?.()) {
      track("pwa_install_click", "beforeinstallprompt");
      setStatus("Telepítési lehetőség megnyitása...");

      const result = await window.KB_PWA.promptInstall();
      if (result?.outcome === "accepted") {
        setStatus("A telepítés elindult.");
      } else if (result?.outcome === "dismissed") {
        setStatus("A telepítést most nem indítottad el.");
      } else {
        setStatus("A telepítési lehetőség jelenleg nem érhető el.");
      }

      updateInstallAction();
      return;
    }

    const method = button?.dataset.installMethod || "ios_home_screen_guide";
    toggleGuide(button, guide, "Kövesd az útmutatót a főképernyős hozzáadáshoz.");
    track("pwa_install_click", method);
  };

  const showManualShare = (url) => {
    const guide = state.cta.querySelector('[data-retention-guide="manual-share"]');
    const input = state.cta.querySelector("[data-retention-share-url]");

    if (!guide || !input) return;

    input.value = url;
    guide.removeAttribute("hidden");
    setStatus("Másold ki ezt a hivatkozást, és küldd tovább.");
    input.focus({ preventScroll: true });
    input.select();
  };

  const handleShare = async () => {
    const url = getPublicUrl();
    const title = document.querySelector("h1")?.textContent.trim() || document.title;
    const shareData = {
      title,
      text: "Ezt a kalkulátort a Kalkulátor Bázison találtam.",
      url,
    };
    let tracked = false;

    closeGuide("bookmark");
    closeGuide("install");

    if (navigator.share) {
      track("share_cta_click", "web_share");
      tracked = true;
      try {
        await navigator.share(shareData);
        setStatus("Megosztási felület megnyitva.");
      } catch (error) {
        if (error?.name === "AbortError") {
          setStatus("A megosztást megszakítottad.");
          return;
        }

        setStatus("A natív megosztás nem sikerült, megpróbáljuk a linket másolni.");
      }
    }

    if (navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        setStatus("A linket a vágólapra másoltuk.");
        if (!tracked) track("share_cta_click", "clipboard");
        return;
      } catch (error) {
        // Fall through to the manual copy field.
      }
    }

    showManualShare(url);
    if (!tracked) track("share_cta_click", "manual_copy");
  };

  const bindActions = () => {
    state.cta.querySelector('[data-retention-action="bookmark"]')?.addEventListener("click", handleBookmark);
    state.cta.querySelector('[data-retention-action="install"]')?.addEventListener("click", () => {
      handleInstall().catch(() => setStatus("A telepítési művelet nem sikerült."));
    });
    state.cta.querySelector('[data-retention-action="share"]')?.addEventListener("click", () => {
      handleShare().catch(() => {
        showManualShare(getPublicUrl());
      });
    });

    window.addEventListener("kb:pwa-install-available", updateInstallAction);
    window.addEventListener("kb:pwa-installed", updateInstallAction);
    window.addEventListener("appinstalled", updateInstallAction);
  };

  const getResultCandidates = (card) =>
    [
      ...card.querySelectorAll(
        ".result-box, .summary-box, #simpleCalcResults, [id^='result'], [id*='Result']"
      ),
    ].filter((element, index, items) => items.indexOf(element) === index);

  const isMeaningfulResult = (card) => {
    const resultText = getResultCandidates(card)
      .map((element) => element.textContent.trim())
      .filter(Boolean)
      .join(" ");
    const normalized = normalizeText(resultText);

    return /\d/.test(resultText) && !invalidResultPattern.test(normalized);
  };

  const reveal = (card) => {
    if (!state.cta || state.revealed || !card || !isMeaningfulResult(card)) return;

    card.appendChild(state.cta);
    state.cta.removeAttribute("hidden");
    state.revealed = true;

    if (!state.animated) {
      state.cta.classList.add("is-revealed");
      state.animated = true;
    }
  };

  const scheduleCheck = (card) => {
    if (!card || state.revealed) return;

    window.setTimeout(() => reveal(card), 40);
    window.setTimeout(() => reveal(card), 180);
  };

  const markInteraction = (event) => {
    const card = event.target.closest?.(".card-calculator");
    if (!card) return;

    state.interactedCards.add(card);
    scheduleCheck(card);
  };

  const bindCalculationDetection = () => {
    const cards = [...document.querySelectorAll(".card-calculator")];

    cards.forEach((card) => {
      card.addEventListener("input", markInteraction, true);
      card.addEventListener("change", markInteraction, true);
      card.addEventListener("click", (event) => {
        if (event.target.closest("button, input, select, label")) markInteraction(event);
      }, true);
    });

    const observer = new MutationObserver((mutations) => {
      if (state.revealed) return;

      mutations.forEach((mutation) => {
        const target = mutation.target.nodeType === Node.ELEMENT_NODE
          ? mutation.target
          : mutation.target.parentElement;
        const card = target?.closest?.(".card-calculator");

        if (card && state.interactedCards.has(card)) {
          scheduleCheck(card);
        }
      });
    });

    cards.forEach((card) => {
      getResultCandidates(card).forEach((target) =>
        observer.observe(target, {
          childList: true,
          characterData: true,
          subtree: true,
        })
      );
    });

    document.addEventListener("kb:calculation-complete", (event) => {
      if (state.revealed || event.detail?.valid === false) return;

      const source = event.detail?.source || event.target;
      const card = source?.closest?.(".card-calculator") || document.querySelector(".card-calculator");
      if (card) {
        state.interactedCards.add(card);
        scheduleCheck(card);
      }
    });
  };

  const loadComponent = async () => {
    const response = await fetch(`${getBasePath()}${componentPath}`, { credentials: "same-origin" });
    if (!response.ok) throw new Error("A megtartó CTA komponens nem tölthető be.");

    const wrapper = document.createElement("div");
    wrapper.innerHTML = await response.text();
    return wrapper.firstElementChild;
  };

  const init = async () => {
    if (!window.location.pathname.includes("/kalkulatorok/")) return;
    const firstCalculatorCard = document.querySelector(".card-calculator");
    if (!firstCalculatorCard) return;

    try {
      state.cta = await loadComponent();
      firstCalculatorCard.appendChild(state.cta);
      bindActions();
      updateInstallAction();
      bindCalculationDetection();
    } catch (error) {
      // The calculator must remain usable even if this enhancement cannot load.
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

(function () {
  if (window.KB_SITE_UI_LOADED) return;
  window.KB_SITE_UI_LOADED = true;

  const data = window.KB_DATA || { categories: [], calculators: [] };

  const normalizeText = (text) =>
    text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const escapeHtml = (value) =>
    (value ?? "")
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const escapeAttribute = escapeHtml;

  const safeClassName = (value) =>
    (value ?? "")
      .toString()
      .split(/\s+/)
      .filter((token) => /^[a-z0-9_-]+$/i.test(token))
      .join(" ");

  const safeInternalPath = (value) => {
    const path = (value ?? "").toString().trim().replace(/^\/+/, "");

    if (
      !path ||
      path.includes("..") ||
      /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(path)
    ) {
      return "#";
    }

    return path;
  };

  const buildInternalHref = (basePath, value) => {
    const path = safeInternalPath(value);
    return path === "#" ? "#" : `${basePath}${path}`;
  };

  const safeExternalUrl = (value, allowedHosts) => {
    try {
      const url = new URL((value ?? "").toString());
      return allowedHosts.includes(url.hostname) ? url.href : "#";
    } catch (error) {
      return "#";
    }
  };

  const getBasePath = () =>
    window.location.pathname.includes("/kalkulatorok/") ? "../" : "";

  const getCategory = (id) =>
    data.categories.find((category) => category.id === id);

  const categorySearchAliases = {
    penzugyi: "penz ber fizetes adozas megtakaritas befektetes hitel bank",
    epitoipari: "epitoanyag epitkezes felujitas anyagszukseglet burkolas falazas",
    egeszseg: "eletmod taplalkozas edzes testsuly szervezet",
    mindennapi: "hetkoznapi vasarlas munka datum szamla haztartas",
    auto: "jarmu utazas tankolas benzin dizel fenntartas",
    atvaltok: "mertekegyseg valtas konverter fizika technika",
  };

  const getCalculatorSearchText = (calculator) => {
    const category = getCategory(calculator.category);

    return normalizeText(
      [
        calculator.title,
        calculator.description,
        calculator.keywords,
        category ? category.title : "",
        category ? category.shortTitle : "",
        categorySearchAliases[calculator.category] || "",
      ].join(" ")
    );
  };

  const trackEvent = (eventName, params = {}) => {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  };

  window.KB_TRACK_EVENT = trackEvent;

  const calculatorCard = (calculator, basePath, headingLevel = 3) => {
    const category = getCategory(calculator.category);
    const cardClass = category ? safeClassName(category.cardClass) : "";
    const headingTag = headingLevel === 2 ? "h2" : "h3";

    return `
      <a class="card card-link calculator-card ${cardClass}" href="${escapeAttribute(buildInternalHref(basePath, calculator.url))}">
        <${headingTag}>${escapeHtml(calculator.title)}</${headingTag}>
        <p>${escapeHtml(calculator.description)}</p>
      </a>
    `;
  };

  const categoryCard = (category, basePath) => `
    <a href="${escapeAttribute(buildInternalHref(basePath, category.url))}" class="card card-link ${safeClassName(category.cardClass)}">
      <h3>${escapeHtml(category.title)}</h3>
      <p>${escapeHtml(category.description)}</p>
    </a>
  `;

  const renderAdSlot = (target) => {
    if (!target || !data.adsense) return;
    const adClient = /^ca-pub-\d+$/.test(data.adsense.client || "")
      ? data.adsense.client
      : "";
    const adSlot = /^\d+$/.test(data.adsense.slot || "") ? data.adsense.slot : "";

    if (!adClient || !adSlot) return;

    if (localStorage.getItem("cookieConsent") !== "accepted") {
      if (target.dataset.adState !== "placeholder") {
        target.innerHTML = '<div class="ad-placeholder">Reklámhely</div>';
        target.dataset.adState = "placeholder";
      }

      return;
    }

    if (target.dataset.adState === "pushed") return;

    let adElement = target.querySelector("ins.adsbygoogle");

    if (!adElement) {
      target.innerHTML = `
        <ins
          class="adsbygoogle"
          style="display: block"
          data-ad-client="${escapeAttribute(adClient)}"
          data-ad-slot="${escapeAttribute(adSlot)}"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      `;
      adElement = target.querySelector("ins.adsbygoogle");
    }

    if (!adElement) return;

    if (adElement.getAttribute("data-adsbygoogle-status") === "done") {
      target.dataset.adState = "pushed";
      return;
    }

    target.dataset.adState = "pending";

    loadAdSenseScript(() => {
      if (target.dataset.adState === "pushed") return;

      if (adElement.getAttribute("data-adsbygoogle-status") === "done") {
        target.dataset.adState = "pushed";
        return;
      }

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        target.dataset.adState = "pushed";
      } catch (error) {
        if (
          error &&
          error.message &&
          error.message.includes("All 'ins' elements in the DOM")
        ) {
          target.dataset.adState = "pushed";
          return;
        }

        target.dataset.adState = "error";
      }
    });
  };

  const loadAdSenseScript = (callback) => {
    const adClient = /^ca-pub-\d+$/.test(data.adsense?.client || "")
      ? data.adsense.client
      : "";
    if (!adClient) return;

    const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adClient)}`;
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      if (callback) {
        if (window.adsbygoogle) {
          callback();
        } else {
          existing.addEventListener("load", callback, { once: true });
        }
      }
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.crossOrigin = "anonymous";

    if (callback) {
      script.addEventListener("load", callback, { once: true });
    }

    document.head.appendChild(script);
  };

  const renderWiseBanner = (target) => {
    if (!target || !data.wise) return;
    const wiseUrl = safeExternalUrl(data.wise.url, ["wise.prf.hn"]);
    const wiseImage = safeExternalUrl(data.wise.image, ["wise-creative.prf.hn"]);

    if (wiseUrl === "#" || wiseImage === "#") return;

    target.innerHTML = `
      <a class="wise-banner" href="${escapeAttribute(wiseUrl)}" rel="sponsored noopener noreferrer" target="_blank">
        <span>
          <strong>Nemzetközi pénzügyekhez Wise</strong>
          <small>Deviza, utalás és külföldi pénzkezelés egyszerűbben.</small>
        </span>
        <span class="wise-banner-media">
          <img src="${escapeAttribute(wiseImage)}" alt="Wise partner ajánlat" loading="lazy" />
        </span>
      </a>
    `;
  };

  const renderGlobalSearch = () => {
    const input = document.getElementById("calculatorSearch");
    const results = document.getElementById("calculatorSearchResults");

    if (!input || !results) return;

    const basePath = getBasePath();
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", results.id);
    input.setAttribute("aria-expanded", "false");
    results.setAttribute("role", "listbox");
    let activeIndex = -1;
    let visibleMatches = [];

    const closeResults = () => {
      results.innerHTML = "";
      results.classList.remove("is-visible");
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      activeIndex = -1;
      visibleMatches = [];
    };

    const scoreCalculator = (calculator, query, queryTokens) => {
      const title = normalizeText(calculator.title);
      const description = normalizeText(calculator.description);
      const keywords = normalizeText(calculator.keywords || "");
      const searchText = getCalculatorSearchText(calculator);

      if (!queryTokens.every((token) => searchText.includes(token))) return 0;

      let score = 20;
      if (title === query) score += 120;
      else if (title.startsWith(query)) score += 90;
      else if (title.includes(query)) score += 65;
      if (keywords.includes(query)) score += 35;
      if (description.includes(query)) score += 20;
      if (calculator.popular) score += 4;
      return score;
    };

    const setActiveResult = (index) => {
      const links = [...results.querySelectorAll(".search-result")];
      if (!links.length) return;

      activeIndex = Math.max(0, Math.min(index, links.length - 1));
      links.forEach((link, linkIndex) => {
        const isActive = linkIndex === activeIndex;
        link.classList.toggle("is-active", isActive);
        link.setAttribute("aria-selected", String(isActive));
      });
      input.setAttribute("aria-activedescendant", links[activeIndex].id);
      links[activeIndex].scrollIntoView({ block: "nearest" });
    };

    const renderResults = () => {
      const query = normalizeText(input.value.trim());

      if (!query) {
        closeResults();
        return;
      }

      const queryTokens = query.split(/\s+/).filter((token) => token.length >= 2);
      if (!queryTokens.length) {
        results.innerHTML = '<p class="search-empty" role="status">Írj be legalább két karaktert.</p>';
        results.classList.add("is-visible");
        input.setAttribute("aria-expanded", "true");
        return;
      }

      visibleMatches = data.calculators
        .map((calculator) => ({
          calculator,
          score: scoreCalculator(calculator, query, queryTokens),
        }))
        .filter((item) => item.score > 0)
        .sort(
          (a, b) =>
            b.score - a.score ||
            a.calculator.title.localeCompare(b.calculator.title, "hu")
        )
        .slice(0, 10)
        .map((item) => item.calculator);

      if (query.length >= 2 && input.dataset.lastTrackedQuery !== query) {
        input.dataset.lastTrackedQuery = query;
        trackEvent("calculator_search", {
          search_term: input.value.trim(),
          results: visibleMatches.length,
          context: document.querySelector(".not-found-page") ? "404" : "site",
        });
      }

      results.classList.add("is-visible");
      input.setAttribute("aria-expanded", "true");
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");

      if (!visibleMatches.length) {
        results.innerHTML =
          '<p class="search-empty" role="status">Nincs találat. Próbálj másik kifejezést vagy válassz kategóriát.</p>';
        return;
      }

      results.innerHTML = visibleMatches
        .map((calculator, index) => {
          const category = getCategory(calculator.category);

          return `
            <a class="search-result" id="calculatorSearchResult${index}" role="option" aria-selected="false" href="${escapeAttribute(buildInternalHref(basePath, calculator.url))}">
              <span>
                <strong>${escapeHtml(calculator.title)}</strong>
                <small>${escapeHtml(calculator.description)}</small>
              </span>
              <em>${escapeHtml(category ? category.shortTitle : "Kalkulátor")}</em>
            </a>
          `;
        })
        .join("");
    };

    input.addEventListener("input", renderResults);
    input.addEventListener("keydown", (event) => {
      const links = [...results.querySelectorAll(".search-result")];

      if (event.key === "ArrowDown" && links.length) {
        event.preventDefault();
        setActiveResult(activeIndex + 1);
      } else if (event.key === "ArrowUp" && links.length) {
        event.preventDefault();
        setActiveResult(activeIndex <= 0 ? links.length - 1 : activeIndex - 1);
      } else if (event.key === "Enter" && links.length) {
        event.preventDefault();
        links[activeIndex >= 0 ? activeIndex : 0].click();
      } else if (event.key === "Escape") {
        closeResults();
      }
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".search-box")) closeResults();
    });
  };

  const bindSingleAccordions = () => {
    document.querySelectorAll(".faq-list").forEach((group) => {
      const details = [...group.querySelectorAll(":scope > details")];

      details.forEach((item) => {
        item.addEventListener("toggle", () => {
          if (!item.open) return;
          details.forEach((other) => {
            if (other !== item) other.open = false;
          });
        });
      });
    });
  };

  const renderHomePage = () => {
    const categoryGrid = document.querySelector("[data-render='home-categories']");
    const popularGrid = document.querySelector("[data-render='popular-calculators']");
    const basePath = getBasePath();

    if (categoryGrid) {
      categoryGrid.innerHTML = data.categories
        .map((category) => categoryCard(category, basePath))
        .join("");
    }

    if (popularGrid) {
      popularGrid.innerHTML = data.calculators
        .filter((calculator) => calculator.popular)
        .map((calculator) => calculatorCard(calculator, basePath))
        .join("");
    }
  };

  const renderCategoryPage = () => {
    const page = document.querySelector("[data-category-page]");

    if (!page) return;

    const categoryId = page.dataset.categoryPage;
    const category = getCategory(categoryId);
    const grid = document.querySelector("[data-render='category-calculators']");
    const intro = document.querySelector("[data-render='category-intro']");
    const seo = document.querySelector("[data-render='category-seo']");
    const basePath = getBasePath();

    if (!category) return;

    document.title = `${category.title} | Kalkulátor Bázis`;

    const description = document.querySelector("meta[name='description']");
    if (description) {
      description.setAttribute("content", category.description);
    }

    if (intro) {
      intro.innerHTML = `
        <h1>${escapeHtml(category.title)}</h1>
        <p>${escapeHtml(category.description)}</p>
      `;
    }

    if (grid) {
      grid.innerHTML = data.calculators
        .filter((calculator) => calculator.category === categoryId)
        .map((calculator) => calculatorCard(calculator, basePath, 2))
        .join("");
    }

    if (seo && !seo.querySelector(".faq-list")) {
      seo.innerHTML = `
        <h2>${escapeHtml(category.title)} egy helyen</h2>
        <p>${escapeHtml(category.seo)}</p>
        <p>A kalkulátorok mobilon is gyorsan használhatók, a számításokhoz csak a legfontosabb adatokat kell megadnod.</p>
      `;
    }
  };

  const renderRelatedCalculators = () => {
    const currentPath = window.location.pathname.replace(/\\/g, "/");
    const current = data.calculators.find((calculator) =>
      currentPath.endsWith(calculator.url)
    );

    if (!current) return;

    let target = document.querySelector("[data-render='related-calculators']");
    const main = document.querySelector("main");

    if (main?.querySelector(".related-links")) return;

    if (!target && main) {
      target = document.createElement("div");
      target.dataset.render = "related-calculators";
      main.appendChild(target);
    }

    const basePath = getBasePath();
    const currentTokens = normalizeText(
      `${current.title} ${current.description} ${current.keywords || ""}`
    )
      .split(/\s+/)
      .filter((token) => token.length > 3);
    const related = data.calculators
      .filter((calculator) => calculator.url !== current.url)
      .map((calculator) => {
        const candidateTokens = normalizeText(
          `${calculator.title} ${calculator.description} ${calculator.keywords || ""}`
        ).split(/\s+/);
        const shared = currentTokens.filter((token) =>
          candidateTokens.includes(token)
        ).length;
        const categoryBoost = calculator.category === current.category ? 8 : 0;

        return {
          calculator,
          score: categoryBoost + shared,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.calculator);

    if (!related.length) return;

    target.innerHTML = `
      <section class="related-section">
        <h2>Kapcsolódó kalkulátorok</h2>
        <div class="category-grid">
          ${related.map((calculator) => calculatorCard(calculator, basePath)).join("")}
        </div>
      </section>
    `;
  };

  const renderCalculatorPageExtras = () => {
    const currentPath = window.location.pathname.replace(/\\/g, "/");
    const current = data.calculators.find((calculator) =>
      currentPath.endsWith(calculator.url)
    );
    const main = document.querySelector("main");

    if (!current || !main) return;

    if (!document.querySelector("[data-render='calculator-ad-slot']")) {
      const adSection = document.createElement("section");
      adSection.className = "ad-section";
      adSection.dataset.render = "calculator-ad-slot";
      main.appendChild(adSection);
      renderAdSlot(adSection);
    }

    if (
      ["penzugyi", "atvaltok"].includes(current.category) &&
      !document.querySelector("[data-render='calculator-wise-banner']")
    ) {
      const wiseSection = document.createElement("section");
      wiseSection.dataset.render = "calculator-wise-banner";
      main.appendChild(wiseSection);
      renderWiseBanner(wiseSection);
    }
  };

  const bindTrackingEvents = () => {
    document.addEventListener("click", (event) => {
      const calculatorLink = event.target.closest(".calculator-card");
      const categoryLink = event.target.closest("[data-render='home-categories'] a, nav a");
      const wiseLink = event.target.closest(".wise-banner, .wise-btn");

      if (calculatorLink) {
        trackEvent("calculator_click", {
          link_url: calculatorLink.getAttribute("href"),
          link_text: calculatorLink.textContent.trim().slice(0, 80),
        });
      }

      if (categoryLink) {
        trackEvent("category_click", {
          link_url: categoryLink.getAttribute("href"),
          link_text: categoryLink.textContent.trim().slice(0, 80),
        });
      }

      if (wiseLink) {
        trackEvent("wise_click", {
          link_url: wiseLink.getAttribute("href"),
        });
      }
    });

    const calculator = document.querySelector(".card-calculator");

    if (calculator) {
      calculator.addEventListener(
        "input",
        () => {
          trackEvent("calculator_start", {
            path: window.location.pathname,
          });
        },
        { once: true }
      );
    }
  };

  const setStructuredData = (payload) => {
    const existing = document.getElementById("kb-structured-data");
    const script = existing || document.createElement("script");

    script.id = "kb-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(payload);

    if (!existing) {
      document.head.appendChild(script);
    }
  };

  const renderStructuredData = () => {
    const origin = window.location.origin || "https://kalkulatorbazis.hu";
    const path = window.location.pathname.replace(/\\/g, "/");
    const currentCalculator = data.calculators.find((calculator) =>
      path.endsWith(calculator.url)
    );
    const categoryPage = document.querySelector("[data-category-page]");

    if (currentCalculator) {
      const category = getCategory(currentCalculator.category);

      setStructuredData({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: currentCalculator.title,
        applicationCategory: "CalculatorApplication",
        operatingSystem: "Web",
        url: `${origin}/${currentCalculator.url}`,
        description: currentCalculator.description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "HUF",
        },
        isPartOf: {
          "@type": "WebSite",
          name: "Kalkulátor Bázis",
          url: `${origin}/`,
        },
        about: category ? category.title : "Online kalkulátor",
      });
      return;
    }

    if (categoryPage) {
      const category = getCategory(categoryPage.dataset.categoryPage);

      if (!category) return;

      setStructuredData({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: category.title,
        description: category.description,
        itemListElement: data.calculators
          .filter((calculator) => calculator.category === category.id)
          .map((calculator, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${origin}/${calculator.url}`,
            name: calculator.title,
          })),
      });
      return;
    }

    if (document.getElementById("calculatorSearch")) {
      setStructuredData({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Kalkulátor Bázis",
        url: `${origin}/`,
        potentialAction: {
          "@type": "SearchAction",
          target: `${origin}/?kereses={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      });
    }
  };

  const init = () => {
    renderGlobalSearch();
    renderHomePage();
    renderCategoryPage();
    renderRelatedCalculators();
    renderCalculatorPageExtras();
    renderWiseBanner(document.querySelector("[data-render='wise-banner']"));
    document
      .querySelectorAll("[data-render='ad-slot']")
      .forEach((target) => renderAdSlot(target));
    renderStructuredData();
    bindTrackingEvents();
    bindSingleAccordions();

    document.addEventListener("kb:consent-updated", () => {
      document
        .querySelectorAll("[data-render='ad-slot'], [data-render='calculator-ad-slot']")
        .forEach((target) => renderAdSlot(target));
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

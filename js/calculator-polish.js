(() => {
  "use strict";

  const main = document.querySelector("main");
  if (!main || !document.documentElement.classList.contains("kb-calculator-document")) return;

  const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const slugify = (value) => normalizeText(value)
    .toLocaleLowerCase("hu-HU")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54) || "szakasz";

  const uniqueId = (base) => {
    let id = base;
    let index = 2;
    while (document.getElementById(id)) {
      id = `${base}-${index}`;
      index += 1;
    }
    return id;
  };

  const calculatorCard = () => main.querySelector(".card-calculator");

  const enhanceTrustMeta = () => {
    const meta = main.querySelector(":scope > .kb-page-meta");
    if (!meta || meta.dataset.polished === "true") return;

    const items = meta.querySelectorAll(":scope > span:not(.kb-page-meta__links)");
    if (items[0]) {
      items[0].innerHTML = "<strong>Adatminimalizált számítás</strong><small>A legtöbb kalkulátor helyben fut; API esetén csak a számításhoz szükséges mezők továbbítódnak</small>";
    }
    if (items[2]) {
      items[2].innerHTML = "<strong>Folyamatos ellenőrzés</strong><small>Automatikus minőségtesztek, forrásellenőrzés és hibajelzés</small>";
    }
    meta.dataset.polished = "true";
  };

  const candidateHeadings = () => {
    const seen = new Set();
    return [...main.querySelectorAll("h2")].filter((heading) => {
      if (heading.closest(".card-calculator, .kb-next-step, .kb-page-nav")) return false;
      if (heading.closest(".site-quality-final, [data-finance-quality], [data-construction-quality], [data-health-everyday-quality], [data-auto-converter-quality]")) return false;
      const text = normalizeText(heading.textContent);
      if (!text || seen.has(text.toLocaleLowerCase("hu-HU"))) return false;
      seen.add(text.toLocaleLowerCase("hu-HU"));
      return true;
    });
  };

  const buildPageNav = () => {
    if (main.querySelector(":scope > .kb-page-nav")) return;

    const card = calculatorCard();
    if (!card) return;
    if (!card.id) card.id = uniqueId("kalkulator");

    const headings = candidateHeadings();
    main.classList.toggle("kb-long-calculator-page", headings.length >= 5);

    const selected = headings.slice(0, 5);
    if (selected.length < 2) return;

    selected.forEach((heading) => {
      if (!heading.id) heading.id = uniqueId(slugify(heading.textContent));
    });

    const nav = document.createElement("nav");
    nav.className = "kb-page-nav";
    nav.setAttribute("aria-label", "Ugrás az oldal részeihez");
    nav.innerHTML = `
      <span class="kb-page-nav__label">Az oldalon</span>
      <div class="kb-page-nav__links">
        <a class="kb-page-nav__primary" href="#${card.id}">Kalkulátor</a>
        ${selected.map((heading) => `<a href="#${heading.id}">${normalizeText(heading.textContent)}</a>`).join("")}
      </div>`;

    const meta = main.querySelector(":scope > .kb-page-meta");
    if (meta) meta.after(nav);
    else card.before(nav);

    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a[href^='#']");
      if (!link || typeof window.KB_TRACK_EVENT !== "function") return;
      window.KB_TRACK_EVENT("calculator_section_nav_click", {
        calculator: window.location.pathname.split("/").pop()?.replace(/\.html?$/i, "") || "unknown",
        target: link.getAttribute("href"),
      });
    });
  };

  const buildReturnButton = () => {
    if (document.querySelector(".kb-return-calculator")) return;
    const card = calculatorCard();
    if (!card) return;
    if (!card.id) card.id = uniqueId("kalkulator");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "kb-return-calculator";
    button.setAttribute("aria-label", "Vissza a kalkulátorhoz");
    button.innerHTML = "<span aria-hidden=\"true\">↑</span><strong>Vissza a kalkulátorhoz</strong>";
    document.body.appendChild(button);

    let ticking = false;
    const update = () => {
      ticking = false;
      const cardRect = card.getBoundingClientRect();
      const footer = document.querySelector("footer, #footer");
      const footerNear = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
      const visible = cardRect.bottom < 72 && !footerNear;
      button.classList.toggle("is-visible", visible);
      button.tabIndex = visible ? 0 : -1;
      button.setAttribute("aria-hidden", visible ? "false" : "true");
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    update();

    button.addEventListener("click", () => {
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      window.setTimeout(() => {
        const target = card.querySelector("input:not([type='hidden']), select, textarea, button");
        target?.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 420);

      if (typeof window.KB_TRACK_EVENT === "function") {
        window.KB_TRACK_EVENT("calculator_return_click", {
          calculator: window.location.pathname.split("/").pop()?.replace(/\.html?$/i, "") || "unknown",
        });
      }
    });
  };

  const init = () => {
    enhanceTrustMeta();
    buildPageNav();
    buildReturnButton();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      window.setTimeout(() => {
        enhanceTrustMeta();
        buildPageNav();
      }, 250);
    }, { once: true });
  } else {
    init();
    window.setTimeout(() => {
      enhanceTrustMeta();
      buildPageNav();
    }, 250);
  }
})();

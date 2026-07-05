(() => {
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("active"));
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  const setMenuState = (isOpen) => {
    if (!toggle || !nav) return;

    nav.classList.toggle("active", isOpen);
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setMenuState(!nav.classList.contains("active"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
    });
  }

  const faqButtons = document.querySelectorAll(".faq-question");
  const faqItems = [];

  faqButtons.forEach((button, index) => {
    const answer = button.nextElementSibling;
    const indicator = button.querySelector("span");

    if (!answer) return;

    const answerId = `wise-faq-answer-${index + 1}`;
    answer.id = answerId;
    answer.setAttribute("role", "region");
    button.setAttribute("aria-controls", answerId);

    const setExpanded = (isExpanded) => {
      button.setAttribute("aria-expanded", String(isExpanded));
      answer.style.maxHeight = isExpanded ? `${answer.scrollHeight}px` : "";

      if (indicator) {
        indicator.textContent = isExpanded ? "-" : "+";
      }
    };

    faqItems.push({ button, setExpanded });

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      faqItems.forEach((item) => {
        if (item.button !== button) item.setExpanded(false);
      });
      setExpanded(!isExpanded);
    });

    window.addEventListener("resize", () => {
      if (button.getAttribute("aria-expanded") === "true") {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  const selectorData = {
    transfer: {
      label: "Külföldi utalás",
      title: "Nemzetközi pénzküldésnél az összköltséget nézd.",
      text: "Hasonlítsd össze az árfolyamot, az utalási díjat és a címzetthez ténylegesen megérkező összeget.",
      cta: "Wise utalási feltételek",
    },
    travel: {
      label: "Utazás",
      title: "Külföldi költésnél a kártyadíj és a limitek is számítanak.",
      text: "Ellenőrizd a kártyás fizetés, készpénzfelvétel és devizaváltás aktuális feltételeit.",
      cta: "Wise utazási feltételek",
    },
    income: {
      label: "Külföldi pénzfogadás",
      title: "Külföldi bevételnél a pénzfogadás módja is fontos.",
      text: "Nézd meg, milyen pénznemben kapsz számlaadatot, és mennyibe kerül később átváltani vagy továbbutalni.",
      cta: "Wise pénzfogadási lehetőségek",
    },
    currencies: {
      label: "Több pénznem kezelése",
      title: "Több devizánál az átlátható elkülönítés lehet a fő előny.",
      text: "Ellenőrizd, mely pénznemek támogatottak, milyen díjjal válthatsz, és milyen limitek vonatkoznak rád.",
      cta: "Wise devizás lehetőségek",
    },
  };

  const useCases = document.getElementById("use-cases");
  const affiliateLink = document.querySelector('a[href*="wise.prf.hn"]');

  if (useCases && affiliateLink && !document.querySelector(".wise-use-selector")) {
    const section = document.createElement("section");
    section.className = "wise-use-selector";
    section.setAttribute("aria-labelledby", "wiseUseSelectorTitle");
    section.innerHTML = `
      <div class="wise-use-selector__inner">
        <div class="wise-use-selector__head">
          <span class="section-kicker">Gyors irányválasztó</span>
          <h2 id="wiseUseSelectorTitle">Mire használnád a Wise-t?</h2>
          <p>Válaszd ki a helyzetedet, és megmutatjuk, mit érdemes ellenőrizned.</p>
        </div>
        <div class="wise-use-selector__options" role="group" aria-label="Wise használati cél kiválasztása">
          ${Object.entries(selectorData)
            .map(
              ([key, item], index) => `<button class="wise-use-option${index === 0 ? " is-active" : ""}" type="button" data-wise-use="${key}" aria-pressed="${index === 0 ? "true" : "false"}">${item.label}</button>`
            )
            .join("")}
        </div>
        <div class="wise-use-selector__result" aria-live="polite">
          <div>
            <h3 data-wise-result-title></h3>
            <p data-wise-result-text></p>
          </div>
          <a data-wise-result-link href="${affiliateLink.href}" target="_blank" rel="noopener noreferrer sponsored nofollow"></a>
        </div>
      </div>
    `;

    useCases.parentNode.insertBefore(section, useCases);

    const buttons = [...section.querySelectorAll("[data-wise-use]")];
    const title = section.querySelector("[data-wise-result-title]");
    const text = section.querySelector("[data-wise-result-text]");
    const link = section.querySelector("[data-wise-result-link]");

    const select = (key, shouldTrack = true) => {
      const item = selectorData[key] || selectorData.transfer;

      buttons.forEach((button) => {
        const active = button.dataset.wiseUse === key;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      title.textContent = item.title;
      text.textContent = item.text;
      link.textContent = `${item.cta} →`;
      link.dataset.wiseUse = key;

      if (shouldTrack && typeof window.KB_TRACK_EVENT === "function") {
        window.KB_TRACK_EVENT("wise_use_case_select", {
          use_case: key,
          page_path: window.location.pathname,
        });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => select(button.dataset.wiseUse));
    });

    link.addEventListener("click", () => {
      if (typeof window.KB_TRACK_EVENT === "function") {
        window.KB_TRACK_EVENT("wise_partner_click", {
          use_case: link.dataset.wiseUse || "transfer",
          promo_location: "use_selector",
          page_path: window.location.pathname,
        });
      }
    });

    select("transfer", false);
  }

  document.querySelectorAll('a[href*="wise.prf.hn"]').forEach((link) => {
    if (link.hasAttribute("data-wise-tracked")) return;
    link.setAttribute("data-wise-tracked", "true");
    link.addEventListener("click", () => {
      if (typeof window.KB_TRACK_EVENT === "function") {
        window.KB_TRACK_EVENT("wise_partner_click", {
          promo_location: link.closest(".hero") ? "hero" : link.closest(".cta-section") ? "final_cta" : "landing",
          page_path: window.location.pathname,
        });
      }
    });
  });
})();
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

  const affiliateUrl =
    "https://wise.prf.hn/click/camref:1100l5Km25/creativeref:1101l107482";

  const selectorData = {
    transfer: {
      label: "Külföldi utalás",
      title: "Nemzetközi pénzküldés előtt az összköltséget nézd.",
      text: "Hasonlítsd össze az átváltási árfolyamot, az utalási díjat és azt az összeget, amelyet a címzett ténylegesen megkap.",
      cta: "Wise utalási feltételek",
    },
    travel: {
      label: "Utazás",
      title: "Külföldi költésnél az árfolyam mellett a kártyadíj is számít.",
      text: "Nézd meg külön a kártyás fizetés, a készpénzfelvétel, a hétvégi váltás és az esetleges limitek feltételeit.",
      cta: "Wise utazási feltételek",
    },
    income: {
      label: "Külföldi pénzfogadás",
      title: "Külföldi bevételnél a pénzfogadás módja is fontos.",
      text: "Ellenőrizd, milyen pénznemben kapsz számlaadatot, milyen díjjal érkezik a pénz, és mennyibe kerül később forintra váltani.",
      cta: "Wise pénzfogadási lehetőségek",
    },
    currencies: {
      label: "Több pénznem kezelése",
      title: "Több devizánál az átlátható elkülönítés lehet a fő előny.",
      text: "A döntés előtt nézd meg, mely pénznemek támogatottak, milyen díjjal válthatsz közöttük, és milyen limitek vonatkoznak rád.",
      cta: "Wise devizás lehetőségek",
    },
  };

  const track = (eventName, params = {}) => {
    if (typeof window.KB_TRACK_EVENT === "function") {
      window.KB_TRACK_EVENT(eventName, params);
      return;
    }

    const manager = window.KB_CONSENT_MANAGER;
    if (manager?.hasConsent?.("analytics") && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  };

  const createUseSelector = () => {
    const useCases = document.getElementById("use-cases");
    if (!useCases || document.querySelector(".wise-use-selector")) return;

    const section = document.createElement("section");
    section.className = "wise-use-selector";
    section.setAttribute("aria-labelledby", "wiseUseSelectorTitle");
    section.innerHTML = `
      <div class="wise-use-selector__inner">
        <div class="wise-use-selector__head">
          <span class="section-kicker">Gyors irányválasztó</span>
          <h2 id="wiseUseSelectorTitle">Mire használnád a Wise-t?</h2>
          <p>Válaszd ki a helyzetedet, és megmutatjuk, mit érdemes ellenőrizned a hivatalos oldalon.</p>
        </div>
        <div class="wise-use-selector__options" role="group" aria-label="Wise használati cél kiválasztása">
          ${Object.entries(selectorData)
            .map(
              ([key, item], index) => `
                <button class="wise-use-option${index === 0 ? " is-active" : ""}" type="button" data-wise-use="${key}" aria-pressed="${index === 0 ? "true" : "false"}">
                  ${item.label}
                </button>
              `
            )
            .join("")}
        </div>
        <div class="wise-use-selector__result" aria-live="polite">
          <div>
            <h3 data-wise-result-title></h3>
            <p data-wise-result-text></p>
          </div>
          <a data-wise-result-link href="${affiliateUrl}" target="_blank" rel="noopener noreferrer sponsored nofollow"></a>
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

      if (shouldTrack) {
        track("wise_use_case_select", {
          use_case: key,
          page_path: window.location.pathname,
        });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => select(button.dataset.wiseUse));
    });

    link.addEventListener("click", () => {
      track("wise_partner_click", {
        use_case: link.dataset.wiseUse || "transfer",
        location: "use_selector",
        page_path: window.location.pathname,
      });
    });

    select("transfer", false);
  };

  createUseSelector();

  document.querySelectorAll('a[href*="wise.prf.hn"]').forEach((link) => {
    link.addEventListener("click", () => {
      track("wise_partner_click", {
        location:
          link.closest(".hero")?.id ||
          link.closest(".cta-section")?.className ||
          link.closest(".site-header")?.className ||
          "landing",
        page_path: window.location.pathname,
      });
    });
  });
})();
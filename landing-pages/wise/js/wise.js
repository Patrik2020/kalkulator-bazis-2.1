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

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      setExpanded(!isExpanded);
    });

    window.addEventListener("resize", () => {
      if (button.getAttribute("aria-expanded") === "true") {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
})();

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

  const checklist = document.getElementById("readinessChecklist");
  const score = document.getElementById("readinessScore");
  const title = document.getElementById("readinessTitle");
  const text = document.getElementById("readinessText");
  const progress = document.getElementById("progressBar");

  const readinessLevels = [
    {
      min: 0,
      title: "Először térképezz.",
      text: "Kezdd a bevételek, kiadások és adósságok áttekintésével.",
    },
    {
      min: 4,
      title: "Jó úton jársz.",
      text: "Már vannak alapok, de a tartalék, cél vagy kockázati kép még erősíthető.",
    },
    {
      min: 7,
      title: "Érdemes mélyebben tanulni.",
      text: "Közel vagy ahhoz, hogy konkrétabb számításokkal és termékismerettel továbbmenj.",
    },
    {
      min: 9,
      title: "Erős alapozás.",
      text: "A fő kérdésekre már van válaszod. Innen a részletek, költségek és kockázatok ellenőrzése jön.",
    },
  ];

  const updateReadiness = () => {
    if (!checklist || !score || !title || !text || !progress) return;

    const inputs = Array.from(checklist.querySelectorAll("input[type='checkbox']"));
    const checked = inputs.filter((input) => input.checked).length;
    const total = inputs.length;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    let level = readinessLevels[0];

    readinessLevels.forEach((item) => {
      if (checked >= item.min) {
        level = item;
      }
    });

    score.textContent = `${checked}/${total}`;
    title.textContent = level.title;
    text.textContent = level.text;
    progress.style.width = `${percent}%`;
  };

  if (checklist) {
    checklist.addEventListener("change", updateReadiness);
    updateReadiness();
  }

  const faqButtons = document.querySelectorAll(".faq-question");
  const faqItems = [];

  faqButtons.forEach((button, index) => {
    const answer = button.nextElementSibling;
    const indicator = button.querySelector("span");

    if (!answer) return;

    const answerId = `penzugyi-tudatossag-faq-${index + 1}`;
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
})();

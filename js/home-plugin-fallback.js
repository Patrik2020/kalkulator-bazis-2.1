(() => {
  const ensureChatgptPluginAnnouncement = () => {
    if (document.getElementById("chatgptPluginTitle")) return;

    const homeSections = document.querySelector(".home-sections");
    if (!homeSections) return;

    const projectRoot = window.KB_PROJECT_ROOT || "";
    const section = document.createElement("section");
    section.className = "learning-highlight";
    section.setAttribute("aria-labelledby", "chatgptPluginTitle");

    const mark = document.createElement("div");
    mark.className = "learning-mark";
    mark.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    const label = document.createElement("span");
    label.className = "section-label";
    label.textContent = "Újdonság · ChatGPT";

    const title = document.createElement("h2");
    title.id = "chatgptPluginTitle";
    title.textContent = "A Kalkulátor Bázis már ChatGPT-bővítményként is elérhető";

    const description = document.createElement("p");
    description.textContent = "A 2026-os nettó–bruttó számításokat a saját Kalkulátor Bázis Salary API végzi, így a számítások közvetlenül ChatGPT-ből is használhatók.";

    content.append(label, title, description);

    const link = document.createElement("a");
    link.className = "highlight-link";
    link.href = `${projectRoot}/kalkulatorok/netto-brutto-kalkulator`;
    link.textContent = "Nettó–bruttó kalkulátor";

    section.append(mark, content, link);
    homeSections.prepend(section);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureChatgptPluginAnnouncement, { once: true });
  } else {
    ensureChatgptPluginAnnouncement();
  }
})();

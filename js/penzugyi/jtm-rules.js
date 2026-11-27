(() => {
  "use strict";

  // Existing 2026 JTM model shared by the two credit-capacity panels.
  // This does not change the main calculator's separate 40% planning ratio.
  const INCOME_THRESHOLD = 800_000;

  function ratioFor(income, type) {
    const highIncome = income >= INCOME_THRESHOLD;
    if (type === "green") return 0.60;
    if (type === "lt5") return highIncome ? 0.30 : 0.25;
    if (type === "5to10") return highIncome ? 0.40 : 0.35;
    return highIncome ? 0.60 : 0.50;
  }

  const rules = Object.freeze({ ratioFor });
  if (typeof module !== "undefined" && module.exports) module.exports = rules;
  if (typeof window !== "undefined") window.KB_JTM_RULES = rules;
})();

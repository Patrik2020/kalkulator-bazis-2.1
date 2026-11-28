(() => {
  "use strict";

  // Monthly rates and integer month counts are supplied by the caller.
  // Input validation and UI-specific term rounding remain with each calculator.
  function annuityPayment(principal, monthlyRate, months) {
    if (monthlyRate === 0) return principal / months;
    return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  }

  function monthlyRateFromAnnual(annualRate, useThm = false) {
    return useThm
      ? Math.pow(1 + annualRate / 100, 1 / 12) - 1
      : annualRate / 100 / 12;
  }

  function principalFromPayment(monthlyPayment, monthlyRate, months) {
    if (monthlyRate === 0) return monthlyPayment * months;
    return monthlyPayment * (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
  }

  const model = Object.freeze({ annuityPayment, monthlyRateFromAnnual, principalFromPayment });
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  if (typeof window !== "undefined") window.KB_LOAN_MATH = model;
})();

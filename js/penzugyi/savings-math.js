(() => {
  "use strict";

  // Annual effective yield and end-of-month deposits. Callers own validation,
  // term rounding, stopping conditions, fees and the presentation of results.
  function effectiveMonthlyRate(annualPercent) {
    return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
  }

  function advanceMonth(balance, monthlyRate, contribution) {
    return balance * (1 + monthlyRate) + contribution;
  }

  function compoundBalance(initial, monthlyRate, contribution, months) {
    let balance = initial;
    for (let month = 0; month < months; month += 1) {
      balance = advanceMonth(balance, monthlyRate, contribution);
    }
    return balance;
  }

  const model = Object.freeze({ effectiveMonthlyRate, advanceMonth, compoundBalance });
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  if (typeof window !== "undefined") window.KB_SAVINGS_MATH = model;
})();

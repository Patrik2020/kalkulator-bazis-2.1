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

  function futureValue({ initial = 0, monthly = 0, annual = 0, years = 0, annualIncrease = 0, annualFee = 0 }) {
    const months = Math.max(0, Math.round(years * 12));
    const monthlyRate = effectiveMonthlyRate(annual - annualFee);
    let balance = initial;
    let contribution = monthly;
    const rows = [];
    let invested = initial;
    for (let month = 1; month <= months; month += 1) {
      balance = advanceMonth(balance, monthlyRate, contribution);
      invested += contribution;
      if (month % 12 === 0) {
        rows.push({ year: month / 12, balance, invested });
        contribution *= 1 + annualIncrease / 100;
      }
    }
    return { balance, invested, rows };
  }

  const model = Object.freeze({ effectiveMonthlyRate, advanceMonth, compoundBalance, futureValue });
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  if (typeof window !== "undefined") window.KB_SAVINGS_MATH = model;
})();

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

  // Both callers supply a validated positive valuation and price. The purchase
  // limit is deliberately explicit: a planning target is not the HFM ceiling.
  function collateralFinancing(price, valuation, financingRatio, purchaseLimit) {
    const collateralCap = valuation * financingRatio;
    const loan = Math.max(0, Math.min(collateralCap, purchaseLimit));
    return { collateralCap, loan, cash: Math.max(0, price - loan) };
  }

  function amortization(principal, annualRate, years, prepaymentMonth = 0, prepaymentAmount = 0) {
    const months = Math.max(1, Math.round(years * 12));
    const rate = monthlyRateFromAnnual(annualRate);
    const monthly = Number.isFinite(principal) && principal > 0 ? annuityPayment(principal, rate, months) : 0;
    let balance = principal;
    let interestTotal = 0;
    const annual = [];
    let yearPrincipal = 0;
    let yearInterest = 0;
    let actualMonths = 0;
    for (let month = 1; month <= months && balance > 0.5; month += 1) {
      const interest = balance * rate;
      let principalPart = Math.min(balance, monthly - interest);
      if (principalPart < 0) principalPart = 0;
      balance -= principalPart;
      yearPrincipal += principalPart;
      yearInterest += interest;
      interestTotal += interest;
      actualMonths = month;
      if (month === prepaymentMonth && prepaymentAmount > 0) {
        const extra = Math.min(balance, prepaymentAmount);
        balance -= extra;
        yearPrincipal += extra;
      }
      if (month % 12 === 0 || balance <= 0.5) {
        annual.push({ year: Math.ceil(month / 12), principal: yearPrincipal, interest: yearInterest, balance: Math.max(0, balance) });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }
    return { monthly, interestTotal, total: principal + interestTotal, annual, months: actualMonths };
  }

  const model = Object.freeze({ annuityPayment, monthlyRateFromAnnual, principalFromPayment, collateralFinancing, amortization });
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  if (typeof window !== "undefined") window.KB_LOAN_MATH = model;
})();

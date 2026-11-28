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

  function compareLoanOffer({ amount, rate, years, fees, stress, preMonth, preAmount }) {
    const base = amortization(amount, rate, years);
    const prepaid = amortization(amount, rate, years, preMonth, preAmount);
    const months = Math.max(1, Math.round(years * 12));
    const stressMonthly = Number.isFinite(amount) && amount > 0
      ? annuityPayment(amount, monthlyRateFromAnnual(stress), months)
      : 0;

    return {
      monthly: base.monthly,
      interestTotal: base.interestTotal,
      totalWithFees: base.total + fees,
      prepaidInterest: prepaid.interestTotal,
      stressMonthly,
      annual: base.annual,
    };
  }

  // JTM ratios are supplied by the rules module. This is a planning model,
  // not a bank's underwriting decision; the caller validates form inputs.
  function creditCapacity({ income, existing, card, overdraft, rate, stress, years, buffer, custom, legal }) {
    const assumedLimits = (card + overdraft) * 0.05;
    const obligations = existing + assumedLimits;
    const cautious = Math.max(0.10, legal - buffer / 100);
    const customRatio = Math.min(legal, Math.max(0.05, custom / 100));
    const legalPayment = Math.max(0, income * legal - obligations);
    const cautiousPayment = Math.max(0, income * cautious - obligations);
    const customPayment = Math.max(0, income * customRatio - obligations);
    const months = Math.max(1, Math.round(years * 12));
    const loanAtRate = (annualRate) => Number.isFinite(cautiousPayment) && cautiousPayment > 0
      ? principalFromPayment(cautiousPayment, monthlyRateFromAnnual(annualRate), months)
      : 0;
    return {
      assumedLimits, legalPayment, cautiousPayment, customPayment,
      baseLoan: loanAtRate(rate), stressLoan: loanAtRate(stress),
    };
  }

  const model = Object.freeze({ annuityPayment, monthlyRateFromAnnual, principalFromPayment, collateralFinancing, amortization, compareLoanOffer, creditCapacity });
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  if (typeof window !== "undefined") window.KB_LOAN_MATH = model;
})();

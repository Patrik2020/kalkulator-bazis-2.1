function parseLocalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function formatDate(date) {
  return date.toLocaleDateString("hu-HU");
}

function addCalendarDays(date, count) {
  const output = new Date(date);
  output.setDate(output.getDate() + count);
  return output;
}

function calculatePeriodicPerformance(periodEnd, invoiceDate, paymentDueDate) {
  if (![periodEnd, invoiceDate, paymentDueDate].every((date) => date instanceof Date && !Number.isNaN(date.getTime()))) {
    return null;
  }

  const endTime = periodEnd.getTime();
  const invoiceTime = invoiceDate.getTime();
  const dueTime = paymentDueDate.getTime();

  // Áfa tv. 58. § (1a) a): ha a számlakibocsátás és az esedékesség is
  // megelőzi az időszak végét, a teljesítés a számla kibocsátásának napja.
  if (invoiceTime < endTime && dueTime < endTime) {
    return {
      date: new Date(invoiceDate),
      rule: "invoice-before-period-end",
      explanation: "A számla kibocsátása és a fizetési esedékesség is megelőzi az időszak végét, ezért a teljesítés a számla kibocsátásának napja.",
    };
  }

  // Áfa tv. 58. § (1a) b): ha az esedékesség az időszak vége utánra esik,
  // a teljesítés az esedékesség, de legfeljebb az időszak végét követő 60. nap.
  if (dueTime > endTime) {
    const cap = addCalendarDays(periodEnd, 60);
    if (dueTime > cap.getTime()) {
      return {
        date: cap,
        rule: "sixty-day-cap",
        explanation: "A fizetési esedékesség az időszak végét több mint 60 nappal követi, ezért a teljesítés az időszak végét követő 60. nap.",
      };
    }
    return {
      date: new Date(paymentDueDate),
      rule: "payment-due-after-period-end",
      explanation: "A fizetési esedékesség az időszak vége utánra, de 60 napon belülre esik, ezért a teljesítés a fizetési esedékesség napja.",
    };
  }

  // Áfa tv. 58. § (1) főszabály.
  return {
    date: new Date(periodEnd),
    rule: "period-end",
    explanation: "A különös korábbi számlázási vagy későbbi esedékességi szabály nem alkalmazandó, ezért a teljesítés az elszámolási időszak utolsó napja.",
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { parseLocalDate, addCalendarDays, calculatePeriodicPerformance };
}

if (typeof document !== "undefined") {
  const issueDate = document.getElementById("issueDate");
  const performanceDate = document.getElementById("performanceDate");
  const days = document.getElementById("days");
  const result = document.getElementById("result-deadline");
  const info = document.getElementById("result-info");

  function calc() {
    const issue = parseLocalDate(issueDate?.value);
    const performance = parseLocalDate(performanceDate?.value);
    const count = Number.parseInt(days?.value, 10);
    if (!performance || !Number.isInteger(count) || count < 0) {
      if (result) result.textContent = "–";
      if (info) info.textContent = "";
      return;
    }
    const deadline = addCalendarDays(performance, count);
    if (result) result.textContent = formatDate(deadline);
    if (info) {
      info.textContent = issue && issue.getTime() !== performance.getTime()
        ? "A teljesítés és a kiállítás dátuma eltér."
        : "";
    }
  }

  [issueDate, performanceDate, days].forEach((input) => input?.addEventListener("input", calc));
  calc();

  const periodEnd = document.getElementById("periodEnd");
  const periodicIssueDate = document.getElementById("periodicIssueDate");
  const periodicDueDate = document.getElementById("periodicDueDate");
  const periodicResult = document.getElementById("result-periodic-performance");
  const periodicRule = document.getElementById("result-periodic-rule");

  function calcPeriodic() {
    if (!periodicResult || !periodicRule) return;
    const end = parseLocalDate(periodEnd?.value);
    const invoice = parseLocalDate(periodicIssueDate?.value);
    const due = parseLocalDate(periodicDueDate?.value);
    const calculated = calculatePeriodicPerformance(end, invoice, due);

    if (!calculated) {
      periodicResult.textContent = "–";
      periodicRule.textContent = "";
      return;
    }

    periodicResult.textContent = formatDate(calculated.date);
    periodicRule.textContent = calculated.explanation;
  }

  [periodEnd, periodicIssueDate, periodicDueDate].forEach((input) => input?.addEventListener("input", calcPeriodic));
  calcPeriodic();
}

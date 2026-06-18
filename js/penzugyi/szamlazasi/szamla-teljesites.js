const issueDate = document.getElementById("issueDate");
const performanceDate = document.getElementById("performanceDate");
const days = document.getElementById("days");

const result = document.getElementById("result-deadline");
const info = document.getElementById("result-info");

function formatDate(date) {
  return date.toLocaleDateString("hu-HU");
}

function calc() {
  const issue = issueDate.value;
  const perf = performanceDate.value;
  const d = parseInt(days.value);

  if (!perf || !d) {
    result.textContent = "–";
    info.textContent = "";
    return;
  }

  let baseDate = new Date(perf);

  const deadline = new Date(baseDate);
  deadline.setDate(deadline.getDate() + d);

  result.textContent = formatDate(deadline);

  if (issue && perf !== issue) {
    info.textContent = "Teljesítés és kiállítás dátuma eltér.";
  } else {
    info.textContent = "";
  }
}

// auto
[issueDate, performanceDate, days].forEach(i => {
  i?.addEventListener("input", calc);
});

calc();
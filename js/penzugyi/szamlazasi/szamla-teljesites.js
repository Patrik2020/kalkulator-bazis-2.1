const issueDate = document.getElementById("issueDate");
const performanceDate = document.getElementById("performanceDate");
const days = document.getElementById("days");
const result = document.getElementById("result-deadline");
const info = document.getElementById("result-info");

function parseLocalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
function formatDate(date) { return date.toLocaleDateString("hu-HU"); }

function calc() {
  const issue = parseLocalDate(issueDate.value);
  const performance = parseLocalDate(performanceDate.value);
  const count = Number.parseInt(days.value, 10);
  if (!performance || !Number.isInteger(count) || count < 0) {
    result.textContent = "–";
    info.textContent = "";
    return;
  }
  const deadline = new Date(performance);
  deadline.setDate(deadline.getDate() + count);
  result.textContent = formatDate(deadline);
  info.textContent = issue && issue.getTime() !== performance.getTime()
    ? "A teljesítés és a kiállítás dátuma eltér."
    : "";
}

[issueDate, performanceDate, days].forEach((input) => input?.addEventListener("input", calc));
calc();

const startDate = document.getElementById("startDate");
const days = document.getElementById("days");
const result = document.getElementById("result-date");

function parseLocalDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
function formatDate(date) { return date.toLocaleDateString("hu-HU"); }
function isWeekend(date) { return date.getDay() === 0 || date.getDay() === 6; }
function addWorkdays(date, count) {
  const output = new Date(date);
  let added = 0;
  while (added < count) {
    output.setDate(output.getDate() + 1);
    if (!isWeekend(output)) added += 1;
  }
  return output;
}

function calcDeadline() {
  const date = parseLocalDate(startDate.value);
  const count = Number.parseInt(days.value, 10);
  if (!date || !Number.isInteger(count) || count < 0) {
    result.textContent = "–";
    return;
  }
  const mode = document.querySelector("input[name='mode']:checked")?.value || "calendar";
  const deadline = mode === "calendar" ? new Date(date) : addWorkdays(date, count);
  if (mode === "calendar") deadline.setDate(deadline.getDate() + count);
  result.textContent = formatDate(deadline);
}

[startDate, days].forEach((input) => input?.addEventListener("input", calcDeadline));
document.querySelectorAll("input[name='mode']").forEach((radio) => radio.addEventListener("change", calcDeadline));
calcDeadline();

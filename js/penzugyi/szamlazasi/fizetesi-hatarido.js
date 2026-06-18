const startDate = document.getElementById("startDate");
const days = document.getElementById("days");
const result = document.getElementById("result-date");

function formatDate(date) {
  return date.toLocaleDateString("hu-HU");
}

function isWeekend(date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

function addWorkdays(date, days) {
  let result = new Date(date);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) {
      added++;
    }
  }

  return result;
}

function calcDeadline() {
  const dateVal = startDate.value;
  const d = parseInt(days.value);

  if (!dateVal || !d) {
    result.textContent = "–";
    return;
  }

  const mode = document.querySelector("input[name='mode']:checked").value;
  let date = new Date(dateVal);

  if (mode === "calendar") {
    date.setDate(date.getDate() + d);
  } else {
    date = addWorkdays(date, d);
  }

  result.textContent = formatDate(date);
}

// auto
[startDate, days].forEach(i => {
  i?.addEventListener("input", calcDeadline);
});

document.querySelectorAll("input[name='mode']").forEach(r => {
  r.addEventListener("change", calcDeadline);
});

calcDeadline();
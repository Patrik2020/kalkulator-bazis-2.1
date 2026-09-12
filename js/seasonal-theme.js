(() => {
  "use strict";

  if (window.KB_SEASONAL_THEME_LOADED) return;
  window.KB_SEASONAL_THEME_LOADED = true;

  const root = document.documentElement;
  const VALID_SEASONS = new Set(["spring", "summer", "autumn", "winter"]);
  const VALID_EVENTS = new Set(["halloween", "christmas", "newyear", "easter"]);
  const DAY_MS = 86_400_000;

  const budapestDateParts = (date = new Date()) => {
    try {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Budapest",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);
      const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
      return {
        year: Number(map.year),
        month: Number(map.month),
        day: Number(map.day),
      };
    } catch (error) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }
  };

  const seasonForMonth = (month) => {
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
  };

  // Meeus/Jones/Butcher algorithm – Gregorian Easter Sunday.
  const easterSunday = (year) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return { year, month, day };
  };

  const utcDay = ({ year, month, day }) => Date.UTC(year, month - 1, day);
  const dayDelta = (from, to) => Math.round((utcDay(from) - utcDay(to)) / DAY_MS);

  const automaticEvent = (parts) => {
    const { year, month, day } = parts;

    // New Year atmosphere spans the last days of December and the first week of January.
    if ((month === 12 && day >= 27) || (month === 1 && day <= 6)) return "newyear";

    // Advent + Christmas period. Kept restrained and brand-led, not decorative overload.
    if (month === 12 && day >= 1 && day <= 26) return "christmas";

    // Halloween has a deliberately short window so autumn remains the default identity.
    if ((month === 10 && day >= 20) || (month === 11 && day <= 2)) return "halloween";

    const easter = easterSunday(year);
    const delta = dayDelta(parts, easter);
    if (delta >= -7 && delta <= 1) return "easter";

    return null;
  };

  const query = new URLSearchParams(window.location.search);
  const seasonOverride = query.get("kbSeason");
  const eventOverride = query.get("kbEvent");
  const today = budapestDateParts();

  const season = VALID_SEASONS.has(seasonOverride)
    ? seasonOverride
    : seasonForMonth(today.month);

  let event;
  if (eventOverride === "none") {
    event = null;
  } else if (VALID_EVENTS.has(eventOverride)) {
    event = eventOverride;
  } else {
    event = automaticEvent(today);
  }

  root.dataset.season = season;
  if (event) root.dataset.event = event;
  else delete root.dataset.event;
  root.classList.add("kb-seasonal-ready");

  const state = Object.freeze({
    season,
    event,
    date: `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`,
    timezone: "Europe/Budapest",
    overridden: VALID_SEASONS.has(seasonOverride) || eventOverride === "none" || VALID_EVENTS.has(eventOverride),
  });

  window.KB_SEASONAL_THEME = state;
  document.dispatchEvent(new CustomEvent("kb:seasonal-theme", { detail: state }));
})();

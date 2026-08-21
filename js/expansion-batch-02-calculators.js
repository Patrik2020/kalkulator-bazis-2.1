(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || typeof document === "undefined") return;
  root.KB_EXPANSION_BATCH_02_CALCULATORS = api;

  const number = (id) => { const el = document.getElementById(id); return el ? Number.parseFloat(String(el.value).replace(/\s/g, "").replace(",", ".")) : NaN; };
  const render = (target, rows) => { target.innerHTML = rows.map(([label, value]) => '<p><strong>' + label + ':</strong> ' + value + '</p>').join(''); };
  const hu = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value);
  const bindings = {
    "mertani-atlag-kalkulator": { ids: ["geoValues"], result: "geoResult", calculate() { const values = api.parsePositiveList(document.getElementById("geoValues")?.value || ""); const r = api.mertaniAtlag(values); return [["Mértani átlag", hu(r.mean, 6)], ["Elemszám", String(r.count)]]; } },
    "datum-hozzaadas-kivonas-kalkulator": { ids: ["dateBase", "dateDays", "dateOperation"], result: "dateResult", calculate() { const r = api.datumMuvelet(document.getElementById("dateBase")?.value || "", number("dateDays"), document.getElementById("dateOperation")?.value || "add"); return [["Eredmény dátuma", api.formatDateHu(r.iso)], ["A hét napja", api.weekdayHu(r.iso)]]; } },
    "aljzatkiegyenlito-kalkulator": { ids: ["levelArea", "levelThickness", "levelConsumption", "levelWaste", "levelBag"], result: "levelResult", calculate() { const r = api.aljzatkiegyenlito(number("levelArea"), number("levelThickness"), number("levelConsumption"), number("levelWaste"), number("levelBag")); return [["Alap anyagigény", hu(r.baseKg, 1) + " kg"], ["Ráhagyással", hu(r.totalKg, 1) + " kg"], ["Szükséges zsák", r.bags + " db"]]; } },
    "fektav-kalkulator": { ids: ["brakeSpeed", "brakeReaction", "brakeMu"], result: "brakeResult", calculate() { const r = api.fektav(number("brakeSpeed"), number("brakeReaction"), number("brakeMu")); return [["Reakcióút", hu(r.reactionDistance, 1) + " m"], ["Elméleti fékút", hu(r.brakingDistance, 1) + " m"], ["Teljes megállási távolság", hu(r.totalDistance, 1) + " m"]]; } },
    "egyszeri-max-1rm-kalkulator": { ids: ["rmWeight", "rmReps"], result: "rmResult", calculate() { const r = api.egyRm(number("rmWeight"), number("rmReps")); return [["Epley becslés", hu(r.epley, 1) + " kg"], ["Brzycki becslés", hu(r.brzycki, 1) + " kg"], ["Átlagos becslés", hu(r.average, 1) + " kg"], ["80% terhelés", hu(r.eightyPercent, 1) + " kg"]]; } }
  };
  const init = () => {
    const page = document.querySelector("[data-batch02-calc]"); if (!page) return;
    const binding = bindings[page.dataset.batch02Calc]; if (!binding) return;
    const target = document.getElementById(binding.result); if (!target) return;
    let tracked = false;
    const run = () => { try { render(target, binding.calculate()); } catch (error) { target.textContent = error instanceof Error ? error.message : "Adj meg érvényes adatokat."; } };
    binding.ids.forEach((id) => { const input = document.getElementById(id); if (!input) return; const changed = () => { if (!tracked && typeof root.KB_TRACK_EVENT === "function") { tracked = true; root.KB_TRACK_EVENT("calculator_start", { calculator: page.dataset.batch02Calc }); } run(); }; input.addEventListener("input", changed); input.addEventListener("change", changed); });
    run();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})(typeof window !== "undefined" ? window : null, function () {
  const finite = (value, label) => { if (!Number.isFinite(value)) throw new Error(label + ": adj meg érvényes számot."); return value; };
  const positive = (value, label) => { finite(value, label); if (value <= 0) throw new Error(label + ": az érték legyen nagyobb nullánál."); return value; };
  const nonNegative = (value, label) => { finite(value, label); if (value < 0) throw new Error(label + ": az érték nem lehet negatív."); return value; };
  const parsePositiveList = (raw) => { const normalized = String(raw || "").trim().replace(/(\d),(\d)/g, "$1.$2"); const values = normalized.split(/[;\s]+/).filter(Boolean).map(Number); if (!values.length || values.some((v) => !Number.isFinite(v) || v <= 0)) throw new Error("Csak pozitív, érvényes számokat adj meg."); return values; };
  const mertaniAtlag = (values) => { if (!Array.isArray(values) || !values.length) throw new Error("Adj meg legalább egy pozitív számot."); values.forEach((v) => positive(v, "Érték")); return { mean: Math.exp(values.reduce((sum, value) => sum + Math.log(value), 0) / values.length), count: values.length }; };
  const parseIsoDate = (iso) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error("Adj meg érvényes dátumot."); const [y,m,d] = iso.split("-").map(Number); const date = new Date(Date.UTC(y, m - 1, d)); if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) throw new Error("Adj meg érvényes dátumot."); return date; };
  const datumMuvelet = (iso, days, operation) => { const date = parseIsoDate(iso); nonNegative(days, "Napok száma"); if (!Number.isInteger(days)) throw new Error("A napok száma egész szám legyen."); const direction = operation === "subtract" ? -1 : 1; date.setUTCDate(date.getUTCDate() + direction * days); return { iso: date.toISOString().slice(0,10) }; };
  const formatDateHu = (iso) => { const d = parseIsoDate(iso); return new Intl.DateTimeFormat("hu-HU", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" }).format(d); };
  const weekdayHu = (iso) => { const d = parseIsoDate(iso); return new Intl.DateTimeFormat("hu-HU", { timeZone: "UTC", weekday: "long" }).format(d); };
  const aljzatkiegyenlito = (area, thickness, consumption, waste, bag) => { positive(area, "Felület"); positive(thickness, "Rétegvastagság"); positive(consumption, "Fajlagos fogyás"); nonNegative(waste, "Ráhagyás"); positive(bag, "Zsák tömege"); if (waste > 100) throw new Error("A ráhagyás legfeljebb 100% legyen."); const baseKg = area * thickness * consumption; const totalKg = baseKg * (1 + waste / 100); return { baseKg, totalKg, bags: Math.ceil(totalKg / bag) }; };
  const fektav = (speedKmh, reactionSeconds, mu) => { nonNegative(speedKmh, "Sebesség"); nonNegative(reactionSeconds, "Reakcióidő"); positive(mu, "Tapadási tényező"); if (mu > 1.5) throw new Error("A tapadási tényező legfeljebb 1,5 legyen."); const v = speedKmh / 3.6; const reactionDistance = v * reactionSeconds; const brakingDistance = speedKmh === 0 ? 0 : (v * v) / (2 * mu * 9.80665); return { reactionDistance, brakingDistance, totalDistance: reactionDistance + brakingDistance }; };
  const egyRm = (weight, reps) => { positive(weight, "Súly"); positive(reps, "Ismétlésszám"); if (!Number.isInteger(reps) || reps < 1 || reps > 12) throw new Error("Az ismétlésszám 1 és 12 közötti egész szám legyen."); const epley = weight * (1 + reps / 30); const brzycki = weight * 36 / (37 - reps); const average = (epley + brzycki) / 2; return { epley, brzycki, average, eightyPercent: average * 0.8 }; };
  return { parsePositiveList, mertaniAtlag, datumMuvelet, formatDateHu, weekdayHu, aljzatkiegyenlito, fektav, egyRm };
});

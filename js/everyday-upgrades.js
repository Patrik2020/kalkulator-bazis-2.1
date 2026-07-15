(() => {
  "use strict";

  const slug = window.location.pathname.split("/").pop()?.replace(/\.html$/, "") || "";
  const supported = new Set([
    "atlag-kalkulator", "munkaido-kalkulator", "oraber-kalkulator",
    "egysegar-kalkulator", "rezsi-megosztas-kalkulator", "ar-kedvezmeny-kalkulator",
    "borravalo-kalkulator", "eletkor-kalkulator", "datum-kulonbseg-kalkulator",
  ]);
  if (!supported.has(slug)) return;

  const card = document.querySelector(".card-calculator");
  if (!card) return;

  const n = (value, fallback = 0) => {
    const parsed = Number(String(value ?? "").trim().replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const money = (value) => `${new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(value)} Ft`;
  const fmt = (value, digits = 2) => new Intl.NumberFormat("hu-HU", { maximumFractionDigits: digits }).format(value);
  const daysBetween = (a, b) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
  const parseDate = (value) => {
    const date = new Date(`${value}T12:00:00`);
    if (!value || Number.isNaN(date.getTime())) throw new Error("Adj meg érvényes dátumot.");
    return date;
  };
  const parseTime = (value) => {
    if (!/^\d{2}:\d{2}$/.test(value || "")) throw new Error("Adj meg érvényes időpontot.");
    const [h, m] = value.split(":").map(Number);
    if (h > 23 || m > 59) throw new Error("Adj meg érvényes időpontot.");
    return h * 60 + m;
  };
  const huHolidays = (year) => new Set([
    `${year}-01-01`, `${year}-03-15`, `${year}-05-01`, `${year}-08-20`,
    `${year}-10-23`, `${year}-11-01`, `${year}-12-25`, `${year}-12-26`,
  ]);
  const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const isWorkday = (date) => ![0, 6].includes(date.getDay()) && !huHolidays(date.getFullYear()).has(iso(date));

  const field = (spec) => {
    const label = document.createElement("label");
    label.className = "everyday-field";
    label.innerHTML = `<span>${spec.label}</span>`;
    let input;
    if (spec.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = spec.rows || 6;
    } else if (spec.options) {
      input = document.createElement("select");
      spec.options.forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value; option.textContent = text;
        if (String(value) === String(spec.value)) option.selected = true;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = spec.type || "number";
      if (spec.step) input.step = spec.step;
      if (spec.min !== undefined) input.min = spec.min;
    }
    input.name = spec.id;
    input.value = spec.value ?? "";
    label.appendChild(input);
    if (spec.help) label.insertAdjacentHTML("beforeend", `<small>${spec.help}</small>`);
    return label;
  };

  const configs = {
    "atlag-kalkulator": {
      title: "Átlag-, medián- és súlyozottátlag-kalkulátor",
      intro: "Szóközzel, vesszővel, pontosvesszővel, sortöréssel vagy CSV-ből beillesztett számsorral is működik.",
      fields: [
        { id: "mode", label: "Számítási mód", value: "simple", options: [["simple", "Egyszerű számlista"], ["weighted", "Súlyozott átlag: érték;súly soronként"]] },
        { id: "values", label: "Számok vagy CSV-adatok", type: "textarea", value: "12; 18; 21; 9; 15", help: "A hibás és üres cellákat a kalkulátor jelzi, de a használható számokat feldolgozza." },
      ],
      compute(v) {
        const invalid = [];
        if (v.mode === "weighted") {
          const rows = v.values.split(/\r?\n/).filter((row) => row.trim());
          const pairs = rows.map((row, index) => {
            const cells = row.split(/[;,\t]/).map((x) => x.trim());
            const value = n(cells[0], NaN), weight = n(cells[1], NaN);
            if (!Number.isFinite(value) || !Number.isFinite(weight) || weight <= 0) { invalid.push(index + 1); return null; }
            return [value, weight];
          }).filter(Boolean);
          if (!pairs.length) throw new Error("Nem található használható érték–súly pár.");
          const totalWeight = pairs.reduce((s, [, w]) => s + w, 0);
          const average = pairs.reduce((s, [x, w]) => s + x * w, 0) / totalWeight;
          return [["Súlyozott átlag", fmt(average, 4)], ["Használt sorok", `${pairs.length} db`], ["Súlyok összege", fmt(totalWeight, 4)], ["Kihagyott hibás sorok", invalid.length ? invalid.join(", ") : "nincs"]];
        }
        const tokens = v.values.split(/[;,\s\t]+/).filter(Boolean);
        const values = tokens.map((token) => n(token, NaN)).filter((value, index) => { if (!Number.isFinite(value)) invalid.push(tokens[index]); return Number.isFinite(value); });
        if (!values.length) throw new Error("Nem található használható szám.");
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        return [["Átlag", fmt(values.reduce((a, b) => a + b, 0) / values.length, 4)], ["Medián", fmt(median, 4)], ["Minimum", fmt(sorted[0], 4)], ["Maximum", fmt(sorted.at(-1), 4)], ["Használt értékek", `${values.length} db`], ["Kihagyott hibás értékek", invalid.length ? invalid.join(", ") : "nincs"]];
      },
    },
    "munkaido-kalkulator": {
      title: "Műszak- és munkaidő-kalkulátor",
      intro: "Kezel éjfélen átnyúló műszakot, szünetet, heti ismétlődést és havi becslést.",
      fields: [
        { id: "start", label: "Műszakkezdés", type: "time", value: "06:00" }, { id: "end", label: "Műszak vége", type: "time", value: "14:00" },
        { id: "break", label: "Levonandó szünet (perc)", value: 30, min: 0 }, { id: "days", label: "Munkanap hetente", value: 5, min: 1 },
        { id: "weeks", label: "Havi szorzó", value: 4.348, min: 1, step: "0.001" },
      ],
      compute(v) {
        let duration = parseTime(v.end) - parseTime(v.start); if (duration <= 0) duration += 1440;
        duration -= n(v.break); if (duration <= 0) throw new Error("A szünet nem lehet hosszabb a műszaknál.");
        const daily = duration / 60, weekly = daily * n(v.days), monthly = weekly * n(v.weeks);
        return [["Nettó műszakidő", `${Math.floor(duration / 60)} óra ${duration % 60} perc`], ["Éjfélen átnyúló műszak", parseTime(v.end) <= parseTime(v.start) ? "igen" : "nem"], ["Heti munkaidő", `${fmt(weekly, 2)} óra`], ["Havi becslés", `${fmt(monthly, 1)} óra`]];
      },
    },
    "oraber-kalkulator": {
      title: "Órabér-, túlóra- és pótlékkalkulátor",
      intro: "Nettó vagy bruttó havi bérből becsül alapórabért, túlórát, pótlékot és fizetett távolléti időt.",
      fields: [
        { id: "basis", label: "Megadott bér típusa", value: "gross", options: [["gross", "Bruttó"], ["net", "Nettó"]] },
        { id: "salary", label: "Havi alapbér (Ft)", value: 500000, min: 0 }, { id: "monthlyHours", label: "Havi alapórák", value: 174, min: 1 },
        { id: "overtimeHours", label: "Túlóra (óra)", value: 0, min: 0 }, { id: "overtimeRate", label: "Túlóra szorzó", value: 1.5, min: 1, step: "0.1" },
        { id: "premiumHours", label: "Pótlékos órák", value: 0, min: 0 }, { id: "premiumPercent", label: "Pótlék (%)", value: 20, min: 0 },
        { id: "paidLeaveHours", label: "Fizetett szabadság/távollét (óra)", value: 0, min: 0 },
      ],
      compute(v) {
        const base = n(v.salary), hourly = base / n(v.monthlyHours), overtime = hourly * n(v.overtimeHours) * n(v.overtimeRate), premium = hourly * n(v.premiumHours) * n(v.premiumPercent) / 100, leave = hourly * n(v.paidLeaveHours);
        return [[`${v.basis === "gross" ? "Bruttó" : "Nettó"} alapórabér`, money(hourly)], ["Túlóra díja", money(overtime)], ["Pótlék", money(premium)], ["Fizetett távollét értéke", money(leave)], ["Becsült teljes összeg", money(base + overtime + premium)]];
      },
    },
    "egysegar-kalkulator": {
      title: "Egységár-összehasonlító 5 termékhez",
      intro: "Különböző kiszereléseket közös egységre vetít, majd rangsorolja az ajánlatokat.",
      custom: "products",
    },
    "rezsi-megosztas-kalkulator": {
      title: "Rezsi- és közösköltség-megosztó",
      intro: "Egyenlő, naparányos, szobaméret- vagy fogyasztásarányos elszámolás három személyre.",
      fields: [{ id: "total", label: "Megosztandó összeg (Ft)", value: 90000, min: 0 }, { id: "mode", label: "Megosztás módja", value: "equal", options: [["equal", "Egyenlő"], ["days", "Bent töltött napok"], ["area", "Szobaméret"], ["usage", "Mért fogyasztás"]] }, { id: "a", label: "1. személy súlya/adata", value: 1, min: 0 }, { id: "b", label: "2. személy súlya/adata", value: 1, min: 0 }, { id: "c", label: "3. személy súlya/adata", value: 1, min: 0 }],
      compute(v) { const weights = v.mode === "equal" ? [1, 1, 1] : [n(v.a), n(v.b), n(v.c)]; const sum = weights.reduce((a, b) => a + b, 0); if (sum <= 0) throw new Error("A megosztási súlyok összege legyen pozitív."); return weights.map((weight, index) => [`${index + 1}. személy része`, money(n(v.total) * weight / sum)]).concat([["Ellenőrző összeg", money(n(v.total))]]); },
    },
    "ar-kedvezmeny-kalkulator": {
      title: "Többlépcsős kedvezmény- és kuponkalkulátor",
      intro: "Egymás utáni százalékos kedvezményt, fix kupont és maximális kedvezményi korlátot kezel.",
      fields: [{ id: "price", label: "Eredeti ár (Ft)", value: 25000, min: 0 }, { id: "discount1", label: "Első kedvezmény (%)", value: 20, min: 0 }, { id: "discount2", label: "Második kedvezmény (%)", value: 10, min: 0 }, { id: "coupon", label: "Fix kupon (Ft)", value: 1000, min: 0 }, { id: "cap", label: "Maximum összes kedvezmény (Ft, 0 = nincs)", value: 0, min: 0 }],
      compute(v) { const price = n(v.price); let final = price * (1 - n(v.discount1) / 100) * (1 - n(v.discount2) / 100) - n(v.coupon); final = Math.max(0, final); let saving = price - final; if (n(v.cap) > 0 && saving > n(v.cap)) { saving = n(v.cap); final = price - saving; } return [["Végső ár", money(final)], ["Teljes megtakarítás", money(saving)], ["Tényleges kedvezmény", `${fmt(price ? saving / price * 100 : 0, 2)}%`]]; },
    },
    "borravalo-kalkulator": {
      title: "Borravaló-, szervizdíj- és számlamegosztó",
      intro: "A szervizdíjat külön kezeli, és három személy eltérő fogyasztását is arányosan osztja.",
      fields: [{ id: "bill", label: "Ételek/italok összege (Ft)", value: 30000, min: 0 }, { id: "service", label: "Szervizdíj (%)", value: 12, min: 0 }, { id: "tip", label: "További borravaló (%)", value: 5, min: 0 }, { id: "a", label: "1. személy fogyasztása (Ft)", value: 12000, min: 0 }, { id: "b", label: "2. személy fogyasztása (Ft)", value: 10000, min: 0 }, { id: "c", label: "3. személy fogyasztása (Ft)", value: 8000, min: 0 }],
      compute(v) { const bill = n(v.bill), service = bill * n(v.service) / 100, tip = (bill + service) * n(v.tip) / 100, total = bill + service + tip, shares = [n(v.a), n(v.b), n(v.c)], sum = shares.reduce((a, b) => a + b, 0); if (sum <= 0) throw new Error("Adj meg legalább egy fogyasztási összeget."); return [["Szervizdíj", money(service)], ["További borravaló", money(tip)], ["Fizetendő összesen", money(total)], ...shares.map((x, i) => [`${i + 1}. személy fizet`, money(total * x / sum)])]; },
    },
    "eletkor-kalkulator": {
      title: "Pontos életkor és következő születésnap",
      intro: "Évek, hónapok, napok mellett teljes napot, hetet, hónapot és a következő születésnapig hátralévő időt is mutat.",
      fields: [{ id: "birth", label: "Születési dátum", type: "date", value: "2000-01-01" }, { id: "asOf", label: "Számítás dátuma", type: "date", value: new Date().toISOString().slice(0, 10) }],
      compute(v) { const birth = parseDate(v.birth), today = parseDate(v.asOf); if (birth > today) throw new Error("A születési dátum nem lehet későbbi."); let years = today.getFullYear() - birth.getFullYear(); let anniversary = new Date(today.getFullYear(), birth.getMonth(), birth.getDate(), 12); if (anniversary > today) years--; let cursor = new Date(birth); cursor.setFullYear(birth.getFullYear() + years); let months = 0; while (months < 11) { const next = new Date(cursor); next.setMonth(next.getMonth() + 1); if (next > today) break; cursor = next; months++; } const days = daysBetween(cursor, today); let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate(), 12); if (nextBirthday <= today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1); const totalDays = daysBetween(birth, today); return [["Pontos életkor", `${years} év ${months} hónap ${days} nap`], ["Eltelt teljes nap", `${totalDays} nap`], ["Eltelt teljes hét", `${Math.floor(totalDays / 7)} hét`], ["Közelítő teljes hónap", `${Math.floor(totalDays / 30.436875)} hónap`], ["Következő születésnap", nextBirthday.toLocaleDateString("hu-HU")], ["Hátralévő napok", `${daysBetween(today, nextBirthday)} nap`]]; },
    },
    "datum-kulonbseg-kalkulator": {
      title: "Dátumkülönbség-, munkanap- és dátumművelet-kalkulátor",
      intro: "Két dátum között számol naptári napot, hétvégét és munkanapot, illetve napokat ad hozzá vagy von ki.",
      fields: [{ id: "start", label: "Kezdő dátum", type: "date", value: new Date().toISOString().slice(0, 10) }, { id: "end", label: "Záró dátum", type: "date", value: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) }, { id: "offset", label: "Hozzáadandó/levonandó nap", value: 30, step: "1" }, { id: "offsetMode", label: "Dátumművelet típusa", value: "calendar", options: [["calendar", "Naptári nap"], ["workday", "Munkanap"]] }],
      compute(v) { let a = parseDate(v.start), b = parseDate(v.end); if (a > b) [a, b] = [b, a]; let work = 0, weekend = 0, holidays = 0; const cursor = new Date(a); while (cursor <= b) { if ([0, 6].includes(cursor.getDay())) weekend++; else if (huHolidays(cursor.getFullYear()).has(iso(cursor))) holidays++; else work++; cursor.setDate(cursor.getDate() + 1); } const result = new Date(parseDate(v.start)), offset = Math.trunc(n(v.offset)); if (v.offsetMode === "calendar") result.setDate(result.getDate() + offset); else { let remaining = Math.abs(offset), direction = offset >= 0 ? 1 : -1; while (remaining) { result.setDate(result.getDate() + direction); if (isWorkday(result)) remaining--; } } return [["Különbség", `${daysBetween(a, b)} nap`], ["Intervallumba eső munkanap", `${work} nap`], ["Hétvégi nap", `${weekend} nap`], ["Fix ünnepnap hétköznapon", `${holidays} nap`], ["Dátumművelet eredménye", result.toLocaleDateString("hu-HU")]]; },
    },
  };

  const config = configs[slug];
  card.innerHTML = `<div class="everyday-heading"><h2>${config.title}</h2><p>${config.intro}</p></div>`;

  if (config.custom === "products") {
    const form = document.createElement("form"); form.className = "everyday-grid";
    for (let i = 1; i <= 5; i++) {
      const group = document.createElement("fieldset"); group.className = "product-group";
      group.innerHTML = `<legend>${i}. termék</legend>`;
      [[`name${i}`, "Megnevezés", "text", `Termék ${i}`], [`price${i}`, "Ár (Ft)", "number", i * 1000], [`qty${i}`, "Mennyiség", "number", i * 500], [`unit${i}`, "Egységre vetítés", "number", 1000]].forEach(([id, label, type, value]) => group.appendChild(field({ id, label, type, value })));
      form.appendChild(group);
    }
    const button = document.createElement("button"); button.type = "submit"; button.className = "everyday-submit"; button.textContent = "Összehasonlítás";
    const result = document.createElement("div"); result.className = "everyday-result"; form.append(button); card.append(form, result);
    form.addEventListener("submit", (event) => { event.preventDefault(); const products = []; for (let i = 1; i <= 5; i++) { const price = n(form.elements[`price${i}`].value), qty = n(form.elements[`qty${i}`].value), unit = n(form.elements[`unit${i}`].value); if (price >= 0 && qty > 0 && unit > 0) products.push({ name: form.elements[`name${i}`].value || `${i}. termék`, unitPrice: price / qty * unit }); } products.sort((a, b) => a.unitPrice - b.unitPrice); result.innerHTML = products.length ? `<ol>${products.map((p, i) => `<li><strong>${p.name}</strong>: ${money(p.unitPrice)} / megadott egység ${i === 0 ? "– legjobb ár" : ""}</li>`).join("")}</ol>` : "Adj meg legalább egy használható terméket."; });
  } else {
    const form = document.createElement("form"); form.className = "everyday-grid";
    config.fields.forEach((spec) => form.appendChild(field(spec)));
    const button = document.createElement("button"); button.type = "submit"; button.className = "everyday-submit"; button.textContent = "Számítás";
    const result = document.createElement("div"); result.className = "everyday-result"; form.appendChild(button); card.append(form, result);
    form.addEventListener("submit", (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(form).entries()); try { const rows = config.compute(values); result.innerHTML = `<dl>${rows.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}</dl>`; } catch (error) { result.innerHTML = `<p class="everyday-error">${error.message}</p>`; } });
  }

  const article = document.createElement("section"); article.className = "article everyday-method";
  article.innerHTML = `<h2>Mit tud többet ez a változat?</h2><p>A kalkulátor az egyszerű egylépéses számítás helyett több gyakori élethelyzetet kezel, részletes eredményeket ad, és a hibás vagy hiányos beviteleket külön jelzi. Az eredmény tájékoztató tervezési segédlet.</p><h3>Adatkezelés</h3><p>A beírt értékek a böngésződben kerülnek feldolgozásra; a kalkulátor nem menti el őket saját szerverre.</p><p class="last-reviewed">Utolsó módszertani ellenőrzés: <time datetime="2026-07-15">2026. július 15.</time></p>`;
  card.insertAdjacentElement("afterend", article);
})();

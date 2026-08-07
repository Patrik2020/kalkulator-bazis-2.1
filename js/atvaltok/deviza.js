(() => {
    "use strict";

    const inputValue = document.getElementById("inputValue");
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    const result = document.getElementById("result");
    const lastUpdate = document.getElementById("lastUpdate");
    const rateSource = document.getElementById("rateSource");
    const retryButton = document.getElementById("retryRates");

    if (!inputValue || !fromCurrency || !toCurrency || !result || !lastUpdate) {
        return;
    }

    const supportedCurrencies = [...new Set(
        [...fromCurrency.options, ...toCurrency.options]
            .map((option) => option.value)
            .filter(Boolean)
    )];
    const quoteCurrencies = supportedCurrencies.filter((code) => code !== "EUR");
    const cacheKey = "kb-currency-rates-v2";
    const cacheMaxAge = 7 * 24 * 60 * 60 * 1000;
    const requestTimeout = 6500;

    const sources = [
        {
            name: "Frankfurter",
            url: `https://api.frankfurter.dev/v2/rates?base=EUR&quotes=${quoteCurrencies.join(",")}`,
            parse: async (response) => parseFrankfurterV2(await response.json()),
        },
        {
            name: "Európai Központi Bank",
            url: `https://data-api.ecb.europa.eu/service/data/EXR/D.${quoteCurrencies.join("+")}.EUR.SP00.A?lastNObservations=1&format=csvdata`,
            parse: async (response) => parseEcbCsv(await response.text()),
        },
        {
            name: "Frankfurter",
            url: `https://api.frankfurter.dev/v1/latest?base=EUR&symbols=${quoteCurrencies.join(",")}`,
            parse: async (response) => parseFrankfurterV1(await response.json()),
        },
    ];

    let rates = {};
    let activeSnapshot = null;
    let pendingLoad = null;

    const normalizeSnapshot = ({ nextRates, date, source, savedAt = Date.now() }) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ""))) {
            throw new Error("Hiányzó vagy hibás árfolyamdátum.");
        }

        const normalizedRates = { EUR: 1 };
        quoteCurrencies.forEach((code) => {
            const rate = Number(nextRates?.[code]);
            if (!Number.isFinite(rate) || rate <= 0) {
                throw new Error(`Hiányzó vagy hibás ${code} árfolyam.`);
            }
            normalizedRates[code] = rate;
        });

        return {
            version: 1,
            rates: normalizedRates,
            date,
            source: String(source || "Külső árfolyam-szolgáltató"),
            savedAt: Number(savedAt) || Date.now(),
        };
    };

    function parseFrankfurterV2(data) {
        if (!Array.isArray(data)) {
            throw new Error("A Frankfurter v2 válasza nem lista.");
        }

        const nextRates = {};
        const dates = [];
        data.forEach((row) => {
            if (row?.base !== "EUR" || !quoteCurrencies.includes(row.quote)) return;
            nextRates[row.quote] = row.rate;
            if (/^\d{4}-\d{2}-\d{2}$/.test(String(row.date || ""))) dates.push(row.date);
        });

        return normalizeSnapshot({
            nextRates,
            date: dates.sort()[0],
            source: "Frankfurter",
        });
    }

    function parseFrankfurterV1(data) {
        if (!data || data.base !== "EUR" || !data.rates) {
            throw new Error("A Frankfurter v1 válasza hiányos.");
        }

        return normalizeSnapshot({
            nextRates: data.rates,
            date: data.date,
            source: "Frankfurter",
        });
    }

    const parseCsvRow = (line) => {
        const cells = [];
        let cell = "";
        let quoted = false;

        for (let index = 0; index < line.length; index += 1) {
            const character = line[index];
            if (character === '"') {
                if (quoted && line[index + 1] === '"') {
                    cell += '"';
                    index += 1;
                } else {
                    quoted = !quoted;
                }
            } else if (character === "," && !quoted) {
                cells.push(cell);
                cell = "";
            } else {
                cell += character;
            }
        }

        cells.push(cell);
        return cells;
    };

    function parseEcbCsv(csv) {
        const lines = String(csv || "").trim().split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) throw new Error("Az EKB válasza üres.");

        const header = parseCsvRow(lines[0]);
        const currencyIndex = header.indexOf("CURRENCY");
        const dateIndex = header.indexOf("TIME_PERIOD");
        const valueIndex = header.indexOf("OBS_VALUE");
        if ([currencyIndex, dateIndex, valueIndex].some((index) => index < 0)) {
            throw new Error("Az EKB válaszának oszlopai hiányoznak.");
        }

        const nextRates = {};
        const dates = [];
        lines.slice(1).forEach((line) => {
            const cells = parseCsvRow(line);
            const code = cells[currencyIndex];
            if (!quoteCurrencies.includes(code)) return;
            nextRates[code] = cells[valueIndex];
            if (/^\d{4}-\d{2}-\d{2}$/.test(String(cells[dateIndex] || ""))) {
                dates.push(cells[dateIndex]);
            }
        });

        return normalizeSnapshot({
            nextRates,
            date: dates.sort()[0],
            source: "Európai Központi Bank",
        });
    }

    const readCachedSnapshot = () => {
        try {
            const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
            if (!cached || cached.version !== 1) return null;
            if (!Number.isFinite(cached.savedAt) || Date.now() - cached.savedAt > cacheMaxAge) {
                return null;
            }

            return normalizeSnapshot({
                nextRates: cached.rates,
                date: cached.date,
                source: cached.source,
                savedAt: cached.savedAt,
            });
        } catch (error) {
            return null;
        }
    };

    const saveSnapshot = (snapshot) => {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(snapshot));
        } catch (error) {
            // A kalkulátor privát vagy korlátozott tárhely mellett is működik.
        }
    };

    const formatDate = (date) => {
        const parsedDate = new Date(`${date}T12:00:00Z`);
        if (Number.isNaN(parsedDate.getTime())) return date;
        return new Intl.DateTimeFormat("hu-HU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Europe/Budapest",
        }).format(parsedDate);
    };

    const updateMetadata = (snapshot, { cached = false, refreshFailed = false } = {}) => {
        lastUpdate.textContent = formatDate(snapshot.date);
        if (rateSource) {
            const suffix = cached
                ? refreshFailed ? " (mentett adat, a frissítés most nem sikerült)" : " (mentett adat)"
                : "";
            rateSource.textContent = `${snapshot.source}${suffix}`;
        }
    };

    const applySnapshot = (snapshot, state = {}) => {
        rates = snapshot.rates;
        activeSnapshot = snapshot;
        updateMetadata(snapshot, state);
        convertCurrency();
    };

    async function fetchSnapshot(source) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), requestTimeout);

        try {
            const response = await fetch(source.url, {
                cache: "no-store",
                mode: "cors",
                headers: { Accept: "application/json, text/csv;q=0.9" },
                signal: controller.signal,
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await source.parse(response);
        } finally {
            clearTimeout(timeout);
        }
    }

    function convertCurrency() {
        const value = Number.parseFloat(inputValue.value);

        if (!Number.isFinite(value)) {
            result.textContent = "–";
            return;
        }

        const from = fromCurrency.value;
        const to = toCurrency.value;
        if (!rates[from] || !rates[to]) return;

        const valueInEuro = value / rates[from];
        const convertedValue = valueInEuro * rates[to];

        result.textContent =
            `${value.toLocaleString("hu-HU", { maximumFractionDigits: 2 })} ${from} = ` +
            `${convertedValue.toLocaleString("hu-HU", { maximumFractionDigits: 2 })} ${to}`;
    }

    const setRetryState = ({ visible, loading = false }) => {
        if (!retryButton) return;
        retryButton.hidden = !visible;
        retryButton.disabled = loading;
        retryButton.textContent = loading ? "Újratöltés…" : "Árfolyamok újratöltése";
    };

    const loadRates = () => {
        if (pendingLoad) return pendingLoad;

        pendingLoad = (async () => {
            if (!activeSnapshot) {
                result.textContent = "Árfolyamok betöltése...";
                lastUpdate.textContent = "Betöltés...";
                if (rateSource) rateSource.textContent = "Betöltés...";
            }
            setRetryState({ visible: Boolean(activeSnapshot), loading: true });

            for (const source of sources) {
                try {
                    const snapshot = await fetchSnapshot(source);
                    applySnapshot(snapshot);
                    saveSnapshot(snapshot);
                    setRetryState({ visible: false });
                    return true;
                } catch (error) {
                    console.warn(
                        `[Devizaváltó] ${source.name} lekérés sikertelen:`,
                        error?.message || String(error)
                    );
                }
            }

            if (activeSnapshot) {
                applySnapshot(activeSnapshot, { cached: true, refreshFailed: true });
            } else {
                result.textContent = navigator.onLine
                    ? "Nem sikerült betölteni az árfolyamokat. Próbáld meg újra."
                    : "Az árfolyamok betöltéséhez internetkapcsolat szükséges.";
                lastUpdate.textContent = "Nincs elérhető adat";
                if (rateSource) rateSource.textContent = "Nem elérhető";
            }

            setRetryState({ visible: true });
            return false;
        })().finally(() => {
            pendingLoad = null;
            if (retryButton && !retryButton.hidden) retryButton.disabled = false;
        });

        return pendingLoad;
    };

    inputValue.addEventListener("input", convertCurrency);
    fromCurrency.addEventListener("change", convertCurrency);
    toCurrency.addEventListener("change", convertCurrency);
    retryButton?.addEventListener("click", loadRates);

    if (!inputValue.value) inputValue.value = 100;

    const cachedSnapshot = readCachedSnapshot();
    if (cachedSnapshot) applySnapshot(cachedSnapshot, { cached: true });

    const ready = loadRates();
    window.KB_CURRENCY_CONVERTER = Object.freeze({
        reload: loadRates,
        ready,
    });
})();

'use strict';
(function () {
  const core = window.KB_EXPANSION_CALCULATORS;
  const main = document.querySelector('[data-expansion-calc]');
  if (!core || !main) return;
  const slug = main.dataset.expansionCalc;
  const form = main.querySelector('[data-expansion-form]');
  const output = main.querySelector('[data-expansion-results]');
  if (!form || !output) return;

  const n = (name) => {
    const raw = String(new FormData(form).get(name) ?? '').trim().replace(/\s+/g, '').replace(',', '.');
    const value = Number(raw);
    if (!Number.isFinite(value)) throw new Error('Minden szükséges mezőben adj meg érvényes számot.');
    return value;
  };
  const hu = (value, digits = 2) => new Intl.NumberFormat('hu-HU', { maximumFractionDigits: digits }).format(value);
  const money = (value) => new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(value) + ' Ft';
  const timeText = (seconds) => {
    const total = Math.max(0, Math.round(seconds));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return (h ? h + ':' : '') + String(m).padStart(h ? 2 : 1, '0') + ':' + String(s).padStart(2, '0');
  };
  const paceText = (secondsPerKm) => { const total = Math.round(secondsPerKm); return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0') + ' perc/km'; };
  const parsePositiveList = () => {
    const raw = String(new FormData(form).get('values') ?? '').trim();
    if (!raw) throw new Error('Adj meg legalább egy pozitív számot.');
    const normalized = raw.replace(/(\d),(\d)/g, '$1.$2');
    const values = normalized.split(/[;\s]+/).filter(Boolean).map(Number);
    if (!values.length || values.some((value) => !Number.isFinite(value) || value <= 0)) throw new Error('Csak pozitív, érvényes számokat adj meg.');
    return values;
  };

  const calculators = {
    'harmasszabaly-kalkulator': () => {
      const data = new FormData(form);
      const result = core.ruleOfThree({ mode: data.get('mode'), a: n('a'), b: n('b'), c: n('c') });
      return [['Ismeretlen X', hu(result.x, 6)], ['Típus', result.mode === 'inverse' ? 'Fordított arányosság' : 'Egyenes arányosság']];
    },
    'mertani-atlag-kalkulator': () => {
      const result = core.geometricMean(parsePositiveList());
      return [['Mértani átlag', hu(result.mean, 8)], ['Elemszám', String(result.count)]];
    },
    'csemperagaszto-kalkulator': () => {
      const result = core.tileAdhesive({ area: n('area'), consumption: n('consumption'), waste: n('waste'), bag: n('bag') });
      return [['Alap anyagigény', hu(result.net, 1) + ' kg'], ['Ráhagyással', hu(result.total, 1) + ' kg'], ['Szükséges zsák', result.bags + ' db']];
    },
    'elektromos-auto-toltesi-koltseg-kalkulator': () => {
      const result = core.evCharge({ battery: n('battery'), start: n('startSoc'), target: n('targetSoc'), loss: n('loss'), price: n('price'), power: n('power') });
      return [['Akkuba kerülő energia', hu(result.batteryEnergy, 2) + ' kWh'], ['Hálózatból felvett energia', hu(result.gridEnergy, 2) + ' kWh'], ['Becsült töltési költség', money(result.cost)], ['Ideális töltési idő', hu(result.hours, 2) + ' óra']];
    },
    'futotempo-kalkulator': () => {
      const data = new FormData(form);
      const mode = data.get('mode');
      const input = { mode, distance: n('distance'), hours: 0, minutes: 0, seconds: 0, paceMinutes: 0, paceSeconds: 0 };
      if (mode === 'finish') { input.paceMinutes = n('paceMinutes'); input.paceSeconds = n('paceSeconds'); }
      else { input.hours = n('hours'); input.minutes = n('minutes'); input.seconds = n('seconds'); }
      const result = core.runningPace(input);
      return mode === 'finish'
        ? [['Becsült célidő', timeText(result.totalSeconds)], ['Tempó', paceText(result.paceSecondsPerKm)], ['Átlagsebesség', hu(result.speedKmh, 2) + ' km/h']]
        : [['Átlagtempó', paceText(result.paceSecondsPerKm)], ['Átlagsebesség', hu(result.speedKmh, 2) + ' km/h'], ['Teljes idő', timeText(result.totalSeconds)]];
    },
  };

  const render = (rows) => { output.innerHTML = '<dl>' + rows.map(([label, value]) => '<div class="expansion-result-row"><dt>' + label + '</dt><dd>' + value + '</dd></div>').join('') + '</dl>'; };
  const run = () => { try { render(calculators[slug]()); } catch (error) { output.textContent = error.message || 'A számítás nem végezhető el a megadott adatokkal.'; } };
  const togglePaceMode = () => {
    if (slug !== 'futotempo-kalkulator') return;
    const finish = form.elements.mode.value === 'finish';
    form.querySelectorAll('[data-time-field]').forEach((el) => { el.hidden = finish; });
    form.querySelectorAll('[data-pace-field]').forEach((el) => { el.hidden = !finish; });
  };
  form.addEventListener('submit', (event) => { event.preventDefault(); run(); });
  form.addEventListener('change', togglePaceMode);
  togglePaceMode();
})();

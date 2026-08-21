'use strict';
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KB_EXPANSION_CALCULATORS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const positive = (value, label) => { if (!Number.isFinite(value) || !(value > 0)) throw new Error(label + ' legyen nagyobb nullánál.'); return value; };
  const nonNegative = (value, label) => { if (!Number.isFinite(value) || value < 0) throw new Error(label + ' nem lehet negatív.'); return value; };

  function ruleOfThree({ mode, a, b, c }) {
    positive(a, 'Az A érték'); positive(c, 'A C érték');
    if (!Number.isFinite(b)) throw new Error('A B érték legyen érvényes szám.');
    return { x: mode === 'inverse' ? (a * b) / c : (b * c) / a, mode: mode === 'inverse' ? 'inverse' : 'direct' };
  }

  function geometricMean(values) {
    if (!Array.isArray(values) || !values.length) throw new Error('Adj meg legalább egy pozitív számot.');
    values.forEach((value) => positive(value, 'Minden érték'));
    return { mean: Math.exp(values.reduce((sum, value) => sum + Math.log(value), 0) / values.length), count: values.length };
  }

  function tileAdhesive({ area, consumption, waste, bag }) {
    positive(area, 'A felület'); positive(consumption, 'A fajlagos fogyás'); nonNegative(waste, 'A ráhagyás'); positive(bag, 'A zsák tömege');
    const net = area * consumption;
    const total = net * (1 + waste / 100);
    return { net, total, bags: Math.ceil(total / bag) };
  }

  function evCharge({ battery, start, target, loss, price, power }) {
    positive(battery, 'Az akkukapacitás'); nonNegative(start, 'A kezdő töltöttség'); positive(target, 'A cél töltöttség'); nonNegative(loss, 'A veszteség'); nonNegative(price, 'Az energiaár'); positive(power, 'A töltési teljesítmény');
    if (start > 100 || target > 100) throw new Error('A töltöttségi szint 0 és 100% között legyen.');
    if (target <= start) throw new Error('A cél töltöttség legyen nagyobb a kezdő töltöttségnél.');
    if (loss >= 100) throw new Error('A töltési veszteség legyen 100% alatt.');
    const batteryEnergy = battery * (target - start) / 100;
    const gridEnergy = batteryEnergy / (1 - loss / 100);
    return { batteryEnergy, gridEnergy, cost: gridEnergy * price, hours: gridEnergy / power };
  }

  function runningPace(input) {
    positive(input.distance, 'A távolság');
    if (input.mode === 'finish') {
      nonNegative(input.paceMinutes, 'A tempó perc része'); nonNegative(input.paceSeconds, 'A tempó másodperc része');
      if (input.paceSeconds >= 60) throw new Error('A tempó másodperc része 0 és 59 között legyen.');
      const paceSecondsPerKm = input.paceMinutes * 60 + input.paceSeconds;
      positive(paceSecondsPerKm, 'A tempó');
      return { paceSecondsPerKm, totalSeconds: paceSecondsPerKm * input.distance, speedKmh: 3600 / paceSecondsPerKm };
    }
    nonNegative(input.hours, 'Az óra'); nonNegative(input.minutes, 'A perc'); nonNegative(input.seconds, 'A másodperc');
    if (input.seconds >= 60) throw new Error('A másodperc 0 és 59 között legyen.');
    const totalSeconds = input.hours * 3600 + input.minutes * 60 + input.seconds;
    positive(totalSeconds, 'A teljes idő');
    const paceSecondsPerKm = totalSeconds / input.distance;
    return { paceSecondsPerKm, totalSeconds, speedKmh: input.distance / (totalSeconds / 3600) };
  }

  return { ruleOfThree, geometricMean, tileAdhesive, evCharge, runningPace };
});

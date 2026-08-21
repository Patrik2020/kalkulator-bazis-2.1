const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const core = require('../js/expansion-calculators-core.js');
const expected = [
  "harmasszabaly-kalkulator",
  "mertani-atlag-kalkulator",
  "csemperagaszto-kalkulator",
  "elektromos-auto-toltesi-koltseg-kalkulator",
  "futotempo-kalkulator"
];
const runtime = fs.readFileSync(path.join(root, 'js/expansion-calculators.js'), 'utf8');
const data = fs.readFileSync(path.join(root, 'js/site-data.js'), 'utf8');
const taxonomy = fs.readFileSync(path.join(root, 'scripts/category-taxonomy-config.js'), 'utf8');
const quality = fs.readFileSync(path.join(root, 'js/expansion-quality.js'), 'utf8');
const errors = [];
const near = (actual, expectedValue, epsilon = 1e-9) => Math.abs(actual - expectedValue) <= epsilon;
for (const slug of expected) {
  const htmlPath = path.join(root, 'kalkulatorok', slug + '.html');
  if (!fs.existsSync(htmlPath)) { errors.push(slug + ': hiányzó HTML'); continue; }
  const html = fs.readFileSync(htmlPath, 'utf8');
  if (!html.includes('data-expansion-calc="' + slug + '"')) errors.push(slug + ': hiányzó kalkulátor azonosító');
  if (!html.includes('class="card card-calculator')) errors.push(slug + ': hiányzó kalkulátorkártya');
  if (!html.includes('<link rel="canonical" href="https://kalkulatorbazis.hu/kalkulatorok/' + slug + '.html">')) errors.push(slug + ': hibás canonical');
  if (!runtime.includes("'" + slug + "'")) errors.push(slug + ': hiányzó runtime logika');
  if (!data.includes('kalkulatorok/' + slug + '.html')) errors.push(slug + ': hiányzik site-data.js-ből');
  if (!taxonomy.includes('kalkulatorok/' + slug + '.html')) errors.push(slug + ': hiányzik a taxonómiából');
  if (!quality.includes('"' + slug + '"')) errors.push(slug + ': hiányzik a quality registryből');
}
const direct = core.ruleOfThree({ mode: 'direct', a: 4, b: 10, c: 6 });
if (!near(direct.x, 15)) errors.push('hármasszabály: 4:10 = 6:x referencia hibás');
const inverse = core.ruleOfThree({ mode: 'inverse', a: 4, b: 6, c: 8 });
if (!near(inverse.x, 3)) errors.push('hármasszabály: fordított referencia hibás');
const geometric = core.geometricMean([1, 4]);
if (!near(geometric.mean, 2)) errors.push('mértani átlag: [1,4] referencia hibás');
const adhesive = core.tileAdhesive({ area: 24, consumption: 4, waste: 10, bag: 25 });
if (!near(adhesive.total, 105.6) || adhesive.bags !== 5) errors.push('csemperagasztó: referencia hibás');
const ev = core.evCharge({ battery: 64, start: 20, target: 80, loss: 10, price: 70, power: 11 });
if (!near(ev.batteryEnergy, 38.4) || !near(ev.gridEnergy, 42.666666666666664) || !near(ev.cost, 2986.6666666666665)) errors.push('EV töltés: referencia hibás');
const pace = core.runningPace({ mode: 'pace', distance: 5, hours: 0, minutes: 30, seconds: 0, paceMinutes: 0, paceSeconds: 0 });
if (!near(pace.paceSecondsPerKm, 360) || !near(pace.speedKmh, 10)) errors.push('futótempó: 5 km / 30 perc referencia hibás');
const finish = core.runningPace({ mode: 'finish', distance: 10, hours: 0, minutes: 0, seconds: 0, paceMinutes: 6, paceSeconds: 0 });
if (!near(finish.totalSeconds, 3600)) errors.push('futótempó: 10 km @ 6:00 célidő referencia hibás');
if (errors.length) { console.error('Expansion kalkulátor audit hibák:'); errors.forEach((e) => console.error('- ' + e)); process.exit(1); }
console.log('Expansion kalkulátor audit OK: ' + expected.length + ' új kalkulátor + referencia számítások ellenőrizve.');

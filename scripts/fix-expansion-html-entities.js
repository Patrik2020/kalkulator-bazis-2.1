const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = [
  'csemperagaszto-kalkulator',
  'elektromos-auto-toltesi-koltseg-kalkulator',
  'futotempo-kalkulator',
];

const replacements = [
  ['Otthon & felújítás kalkulátorok', 'Otthon &amp; felújítás kalkulátorok'],
  ['Autó & közlekedés kalkulátorok', 'Autó &amp; közlekedés kalkulátorok'],
  ['Egészség & sport kalkulátorok', 'Egészség &amp; sport kalkulátorok'],
];

for (const slug of pages) {
  const file = path.join(root, 'kalkulatorok', `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) html = html.replaceAll(from, to);
  fs.writeFileSync(file, html, 'utf8');
}

console.log('Expansion HTML entity normalization applied.');

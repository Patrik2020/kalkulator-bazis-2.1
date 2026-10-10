#!/usr/bin/env node
// Read-only production smoke check. Never changes production or calculator state.
const BASE = 'https://kalkulatorbazis.hu';
const PATHS = [
  '/',
  '/kalkulatorok/netto-brutto-kalkulator',
  '/kalkulatorok/fizetesi-hatarido-kalkulator',
  '/kalkulatorok/etf-kalkulator',
  '/kalkulatorok/beton-kalkulator',
  '/kalkulatorok/tegla-kalkulator',
  '/kalkulatorok/auto-fogyasztas-kalkulator',
  '/kalkulatorok/szamla-teljesites-kalkulator'
];
let failures = 0;
for (const path of PATHS) {
  const url = new URL(path, BASE);
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: { 'User-Agent': 'KB-production-smoke/1.0' },
      redirect: 'follow'
    });
    const body = await response.text();
    const html = /<html[\s>]/i.test(body) && /<body[\s>]/i.test(body);
    const ok = response.ok && html && body.length > 500;
    console.log(`${ok ? 'PASS' : 'FAIL'} ${url.pathname} HTTP ${response.status} (${body.length} bytes)`);
    if (!ok) failures++;
  } catch (error) {
    failures++;
    console.error(`FAIL ${url.pathname}: ${error.message}`);
  }
}
if (failures) {
  console.error(`Production smoke failed: ${failures}/${PATHS.length} pages. Do not deploy until investigated.`);
  process.exitCode = 1;
} else {
  console.log(`Production smoke passed: ${PATHS.length} pages reachable.`);
}

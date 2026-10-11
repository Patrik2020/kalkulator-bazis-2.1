# Éles rendelkezésre állás – ellenőrzési és hibakezelési útmutató

A `scripts/production-smoke.mjs` kizárólag olvasási célú ellenőrzés: nyolc nyilvános URL HTTP-státuszát, HTML-tartalomtípusát, alap HTML-válaszát és a végső válasz domainjét vizsgálja. A teszt nem módosítja a kalkulátorokat, az éles oldalt vagy a telepítést.

## Kézi futtatás

A repó gyökeréből, Node.js 24-gyel:

```sh
node scripts/production-smoke.mjs
```

A sikeres futás nyolc `PASS` sort, majd `Production smoke passed: 8 pages reachable.` összegzést ad, és 0 kilépési kóddal végződik. A `FAIL` sor vagy nem nulla kilépési kód hibát jelent. A GitHub `Site quality` CI sikeressége **önmagában nem igazolja**, hogy ez a külön éles teszt is lefutott.

## Hibakeresés és teendők

1. Jegyezd fel a futtatás idejét, a teljes kimenetet, az érintett útvonalat és a HTTP-státuszt. Ne másolj naplóba személyes adatokat vagy titkokat.
2. Ellenőrizd az érintett URL-t böngészőből és egy másik hálózatról is. Egy egyszeri hálózati hiba vagy átmeneti CDN-probléma téves riasztás lehet.
3. Ha a hiba megismételhető, ellenőrizd a GitHub Pages/deploy állapotát és a legutóbbi main-változtatásokat. Hibás válasz, átirányítás vagy hiányzó oldal esetén az új telepítést függeszd fel a kivizsgálásig.
4. Ha az oldal valóban nem elérhető, dokumentáld az érintett útvonalakat, majd a szokásos, felülvizsgált GitHub PR-folyamatban javíts vagy állíts vissza. Ne végezz ellenőrizetlen közvetlen main-módosítást.
5. Javítás után ismételd meg a smoke tesztet és az érintett kalkulátor számítási/böngészős ellenőrzését; csak igazolt siker után tekintsd lezártnak az incidenst.

## Korlátok

A teszt nem bizonyítja a számítások pontosságát, a JavaScript helyes működését vagy a felhasználói interakciókat. Ezeket a meglévő matematikai, referencia- és böngészős teszteknek kell biztosítaniuk. A rendszeres automatikus futtatás külön GitHub Actions workflow-t igényel; ez jelenleg nincs beállítva. A teszt eredményét csak tényleges, naplózott futtatás alapján szabad sikeresnek nevezni.

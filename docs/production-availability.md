# Éles rendelkezésre állás – kézi ellenőrzés

A `scripts/production-smoke.mjs` kizárólag olvasási célú ellenőrzés: nyolc nyilvános URL HTTP státuszát és alap HTML-válaszát vizsgálja.

Futtatás: `node scripts/production-smoke.mjs` (Node.js 24).

A teszt **nem módosítja** a kalkulátorokat, az éles oldalt vagy a telepítést. Nem bizonyítja a számítások pontosságát, a JavaScript helyes működését vagy a felhasználói interakciókat. Ezeket a meglévő matematikai, referencia- és böngészős teszteknek kell biztosítaniuk.

Hálózati hiba téves riasztást is okozhat. A rendszeres automatikus futtatást külön GitHub Actions workflow-val lehet bekötni; ez ebben a PR-ben még nincs megvalósítva. A visszaállítási eljárás és a deploy-védelem is külön feladat.

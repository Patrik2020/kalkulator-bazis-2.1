# Kliensoldali biztonsági audit – 2026. július

## Ellenőrzött területek

- PWA és service worker regisztráció
- service worker gyorsítótár-kezelés
- külső erőforrások megkerülése
- offline válaszok
- komponens- és scriptbetöltés
- dinamikus HTML használata
- kereső és belső adatok HTML-escape kezelése
- AdSense és Wise integrációk
- webmanifest hatókör

## Elvégzett javítások

- a service worker URL-je és scope-ja csak az aktuális originhez tartozhat
- váratlan vagy hibás scope esetén a regisztráció törlődik
- sessionStorage használata hibakezelést kapott
- a service worker kizárólag same-origin GET kéréseket kezel
- csak sikeres, `basic` típusú, nem `private` és nem `no-store` válasz kerülhet cache-be
- HTML navigációnál a tartalomtípus is ellenőrzésre kerül
- az offline válasz `no-store`, `nosniff`, szigorú referrer és saját CSP fejléceket kapott
- a cache verzió frissült, így a régi gyorsítótár automatikusan lecserélődik

## Hirdetéskompatibilitás

A service worker továbbra sem kezeli és nem gyorsítótárazza a külső Google Analytics, AdSense, DoubleClick, Wise vagy deviza-API kéréseket. Ezeket a böngésző közvetlenül tölti be, ezért a javítás nem avatkozik bele a hirdetések kiszolgálásába.

## Megállapítás

A projekt statikus felépítése miatt nincs szerveroldali session, adatbázis vagy felhasználói bejelentkezés. A második kör legfontosabb kockázata a kliensoldali gyorsítótár és a PWA scope volt; ezek most szigorúbb ellenőrzést kaptak.

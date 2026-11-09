# Kalkulátor Bázis – gyors és biztonságos hírpublikálás: elfogadási feltételek

**Cél:** a tulajdonos által jóváhagyott cikket indokolatlan, akár napokig tartó kézi várakozás nélkül lehessen publikálni. A korábban említett „10 perc” nem merev SLA; a tényleges előállítási, CI-, deployment- és ellenőrzési időt mérjük. Nincs olyan ígéret, hogy minden cikk azonos határidőre megjelenik.

## Meglévő, kötelező ellenőrzési út

A webrepo már rendelkezik a következő kanonikus parancsokkal. **Nem hozunk létre még egy, gyengébb news-preflight szkriptet.**

1. `npm run ai:prepare` – a teljes statikus buildből származó fájlok előállítása; az összes változás felülvizsgálata, csak a szándékos módosítások commitolása.
2. `npm run ai:check` – tiszta munkafa ellenőrzése a build előtt és után, `npm run quality`, `npm run test:build-pipeline` és git diff-ellenőrzések. Hibánál megáll, nem „ment át” jelzést ad.
3. A PR kötelező GitHub Actions kapui (Site quality, biztonság, szükség esetén böngészős regresszió és statikus materializáció) nem kerülhetők meg.
4. Merge, deployment után **élő URL és aktuális hírlista tényleges ellenőrzése** szükséges. A sikeres CI nem egyenlő a nyilvános megjelenéssel.

## Jövőbeli jóváhagyás → publikálás automatizmus elvárt szerződése

1. A cikk vázlata a publikálttól elkülönítve, egyedi azonosítóval és stabil előnézettel legyen elérhető jóváhagyásra.
2. A jóváhagyás egy konkrét verzióra vonatkozzon; tartalmi módosítás után ismételt jóváhagyás kell.
3. A jóváhagyott verzió csak egyszer kerülhet sorba (`idempotency key`); újrapróbálkozás ne hozzon létre duplikált cikket.
4. Az eredeti forrás és a generátor együtt frissítse a cikket, a főoldali hírblokkot, az `aktualis.html` listát, a sitemapet, a fragmenteket, az asset-hash-eket, a service-worker verziót és a sitemap tartalomállapotát.
5. Hiba esetén a rendszer jelentsen pontos blokkolót; tranziens hibára korlátozott újrapróbálkozás lehetséges, CI-kapu lazítása nélkül.
6. Naplózandó: jóváhagyás ideje, commit/queue, CI-idő, merge, deployment, a publikus URL és a rovat éles ellenőrzési időpontja.
7. A felhasználónak csak tényleges éles verifikáció után szabad „publikálva” üzenetet küldeni.

## Élesítési elfogadási teszt (még NEM végrehajtva)

- Egy jóváhagyott próbacikk végigmegy az összes fenti állomáson, mérhető időkkel.
- Dupla jóváhagyás nem hoz létre duplikátumot.
- Hibás CI nem jelent sikeres publikációt.
- A jóváhagyást követő újabb módosítás nem cserélhet tartalmat észrevétlenül.
- A publikus cikkoldal és a hírlista egyaránt a várt verziót mutatja.
- A visszajelzés az akadályokat és a tényleges időket jelzi; több próbafutás eredménye alapján határozható meg reális célérték.

**Jelenlegi állapot:** ez egy elfogadási és fejlesztési szerződés, nem már működő automatikus jóváhagyás-publikálás szolgáltatás. A kézi/asszisztált PR-folyamatban a meglévő `ai:prepare` és `ai:check` használható; a teljes automatizmus későbbi külön tervezési és tesztelési feladat.

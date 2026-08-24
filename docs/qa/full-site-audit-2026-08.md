# Kalkulátor Bázis – teljes funkcionális és szakmai audit

Állapot: folyamatban  
Audit kezdete: 2026-08-24  
Kiindulási ág: `main` (`9ba6581bb219d14d67b021b1a982a9611ab7f165`)  
Audit ág: `audit/full-site-qa-2026-08`

## Cél

A teljes Kalkulátor Bázis ellenőrzése matematikai, szakmai, funkcionális, vizuális, reszponzív, akadálymentességi, integrációs és regressziós szempontból. A cél nem pusztán az, hogy minden kalkulátor „adjon valamilyen eredményt”, hanem hogy az eredmény a dokumentált modell szerint helyes, életszerű és a fontos korlátokkal együtt értelmezhető legyen.

## Lefedettségi alap

A repó jelenlegi referencia-lefedettségi auditja pontosan 100 katalogizált kalkulátort vár és mind a 100-at kötelező referenciasuite-hoz rendeli. A teljes audit erre a meglévő rendszerre épül rá, nem helyettesíti azt.

## Audit-rétegek

1. Matematikai képlet és kerekítés.
2. Szakmai/jogszabályi referencia és aktualitás.
3. Normál, határértékes, hibás és extrém bemenetek.
4. Mobil/desktop, világos/sötét mód, overflow és dinamikus eredményfelületek.
5. Billentyűzet, fókusz, aria-live és alapvető akadálymentesség.
6. API-, hálózati-, timeout- és hibaválasz-kezelés.
7. URL-ek, canonical, sitemap, schema, cookie/consent és külső függőségek.
8. Regresszióvédelem: a bizonyított szabályok kerüljenek automatizált quality gate-be.

## Első ellenőrzött kritikus pontok

### PASS – 2026 munkaszüneti/pihenőnapok és áthelyezett munkanapok

A `js/penzugyi/szamlazasi/fizetesi-hatarido.js` 2026-os készlete egyezik a 10/2025. (IV. 30.) NGM rendelettel:

- 2026-01-02 pihenőnap / 2026-01-10 munkanap
- 2026-08-21 pihenőnap / 2026-08-08 munkanap
- 2026-12-24 pihenőnap / 2026-12-12 munkanap

Forrás: https://magyarkozlony.hu/ – 10/2025. (IV. 30.) NGM rendelet.

### PASS – nettó–bruttó publikus 2026 paraméterek

A publikus kalkulátoroldal 15% SZJA-, 18,5% TB-járulék- és 13% munkáltatói szocho-kulcsot jelez, valamint a 25 év alattiak kedvezményének 715 765 Ft-os havi adóalap-korlátját dokumentálja.

Források:

- https://nav.gov.hu/ado/szja/25-ev-alatti-fiatalok-kedvezmenye
- https://nav.gov.hu/ugyfeliranytu/adokulcsok_jarulekmertekek

### PASS – API-s bérmodell első forrásellenőrzése

A kapcsolódó `Patrik2020/kalkulator-bazis-api-dev` repó jelenlegi 2026-os konstansai az első ellenőrzési körben egyeznek a NAV adataival:

- 25 év alatti havi adóalap-korlát: 715 765 Ft
- személyi kedvezmény havi adómegtakarítása: 16 140 Ft
- családi kedvezmény adóalapja kedvezményezett eltartottanként: 133 340 / 266 660 / 440 000 Ft az eltartottak számától függően
- 2026-tól a 30 év alatti anyák kedvezménye értékbeli korlát nélkül kezelhető a modell által támogatott hagyományos munkabérre

Forrás: NAV 73. számú, 2026-os SZJA adóalap-kedvezmények információs füzet és NAV kedvezményoldalak.

### PASS – hitelképesség kalkulátor kommunikációja

A kalkulátor kódja fix 40%-os tervezési arányt használ, az oldal pedig egyértelműen közli, hogy ez nem azonos a hatályos JTM-plafonnal vagy banki hitelbírálattal. Így a 40% jelenleg tervezési modellként, nem jogszabályi limitként jelenik meg.

Aktuális JTM referencia: https://www.mnb.hu/penzugyi-stabilitas/makroprudencialis-politika/makroprudencialis-eszkoztar/adossagfek-szabalyok-hfm-jtm

### PASS – lakáshitel önerő/HFM kommunikáció első ellenőrzése

Az oldal külön jelzi a főszabály szerinti legfeljebb 80%-os HFM-et, valamint az elsőlakás-vásárlói és zöld hitelcél/fedezet esetén használható legfeljebb 90%-os forgatókönyvet, és külön figyelmeztet a banki forgalmi érték szerepére.

Forrás: MNB adósságfék-szabályok.

## Új regresszióvédelem

Létrejött: `scripts/critical-2026-rules-audit.js`

Új npm script: `test:rules:2026`

A teszt bekerült a kötelező `quality` láncba. Feladata, hogy a már hivatalosan ellenőrzött, magas kockázatú 2026-os szabálypontok véletlen módosulását a CI azonnal megfogja.

## Következő prioritások

- pénzügyi kalkulátorok teljes képlet- és forrásellenőrzése;
- nettó–bruttó API edge-case és fordított számítási mátrix bővítése;
- mind a 100 kalkulátor többpontos referencia- és határérték-mátrixa;
- minden kalkulátor böngészős interakciója 320/390/768/1440 px nézeteken;
- dinamikus eredmények dark/light kontrasztja és overflow;
- API/network failure állapotok;
- egészség/sport kalkulátorok képleteinek szakmai referenciaellenőrzése;
- építőipari kalkulátorok mértékegység-, kerekítés- és ráhagyáslogikája;
- átváltók egzakt konverziós mátrixa.

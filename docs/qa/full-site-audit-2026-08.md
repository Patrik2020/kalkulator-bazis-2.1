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

## Search Console és SEO audit – 2026-08-25

### Kiemelt CTR/rangsorolási lehetőségek

A közvetlen Search Console-lekérdezések alapján a legnagyobb, adatokkal igazolt rések:

- `határidő számítás`: 5 077 megjelenés, 1 kattintás, 7,14 átlagpozíció;
- `beton kalkulátor`: 1 082 megjelenés, 19 kattintás, 8,99 átlagpozíció;
- `határidő kalkulátor`: 700 megjelenés, 2 kattintás, 5,62 átlagpozíció;
- `folyamatos teljesítés kalkulátor`: 666 megjelenés, 4 kattintás, 6,12 átlagpozíció;
- `teljesítési dátum kalkulátor`: 380 megjelenés, 1 kattintás, 4,70 átlagpozíció;
- `gumiméret váltó`: 255 megjelenés, 1 kattintás, 9,59 átlagpozíció;
- `fogyasztás kalkulátor`: 162 megjelenés, 0 kattintás, 8,94 átlagpozíció.

Az ETF és tégla fő lekérdezései ezzel szemben nagyon jó CTR/pozíció értékeket mutatnak, ezért azoknál nincs indok tömeges title/meta módosításra.

### Adatvezérelt SEO override-réteg

A `scripts/apply-seo-overrides.js` buildlépésben idempotens, központilag ellenőrzött SEO-override rendszer működik. Jelenlegi CTR-céloldalak:

- fizetési határidő;
- számla teljesítés;
- beton;
- terület átváltó;
- gumiméret váltó;
- autófogyasztás;
- autós út-/utazási költség;
- fuga.

A rendszer együtt tartja a title/meta/H1/hero/WebPage structured-data elemeket, és az opcionális OG/Twitter meta eltéréseket régi oldalakon tolerálja.

### Extensionless migráció – két külön minta

1. **Migrációs késés:** a régi `.html` URL még indexben van, az új extensionless URL még csak felfedezett vagy ismeretlen. Példa: kamatos kamat és gipszkarton. A régi `.html` URL-ek jelenleg a live crawlerben a megfelelő extensionless oldalra jutnak, amely 200-as és self-canonical.
2. **Valóban új, még nem indexelt kalkulátor:** a `.html` változat sem volt indexben, az extensionless URL pedig `Discovered - currently not indexed` vagy `URL is unknown to Google`. Példák: százalékos változás, EV-töltési költség, hitel-előtörlesztés.

A két esetet külön kell kezelni; a migrációs késést nem szabad felesleges tartalmi átírással „javítani”.

### Indexelési tracker

A GSC Wizard Indexing Trackerben 20 kiemelt, még nem indexelt új kalkulátor követése indult el. Az első 10 URL azonnali ellenőrzést is kapott; mindegyik `not_indexed`, részben `Discovered - currently not indexed`, részben `URL is unknown to Google` állapotú.

### PASS – új oldalak alap indexelhetősége

15 reprezentatív új/nem indexelt oldal live on-page crawlja alapján 14 oldal technikailag indexelhető:

- HTTP 200;
- nincs `noindex`;
- self-canonical;
- pontosan 1 H1;
- van structured data;
- megfelelő viewport/lang;
- több tucat belső kimenő link.

Két alacsony súlyú meta-description hosszfigyelmeztetés volt (tetőcserép 161 karakter, EV-töltési költség 174 karakter), de ezek önmagukban nem magyarázzák az indexelési hiányt.

### WARNING – Tapéta kalkulátor 403 / korábbi redirect error

A `tapeta-kalkulator` jelenleg külön vizsgálandó eltérés:

- a Google URL Inspection a régi `.html` URL korábbi crawl-ján `Redirect error` állapotot tárol;
- az extensionless URL felfedezett, de nincs indexben;
- a GSCWizard live on-page bot mind a jelenlegi extensionless, mind a `.html` URL-re HTTP 403-at kapott;
- ugyanakkor a nyilvános kategóriaoldal rendesen linkeli a Tapéta kalkulátort.

Ez nem általános robots/noindex probléma, hanem külön infrastruktúra/UA/path szintű vizsgálati tétel.

A tetőcserép régi `.html` URL-jén szintén szerepel korábbi Google `Redirect error`, de a jelenlegi live crawl már megfelelően az extensionless 200-as self-canonical oldalra jut, ezért ott a hiba valószínűleg történelmi/migrációs állapot.

### Kontextuális belső linkek az indexelési erősítéshez

A buildbe négy természetes, témailag indokolt belső link került:

- Százalék kalkulátor → Százalékos változás kalkulátor;
- Hitel törlesztő → Hitel előtörlesztés kalkulátor;
- Fizetési határidő → Munkanap kalkulátor;
- Autós út-/fogyasztáskalkulátor → EV töltési költség kalkulátor.

A cél nem linkfarm létrehozása, hanem erős, releváns útvonal biztosítása már indexelt/használt oldalakról az új specializált kalkulátorokhoz.

## Új regresszióvédelem

Létrejött: `scripts/critical-2026-rules-audit.js`

Új npm script: `test:rules:2026`

A teszt bekerült a kötelező `quality` láncba. Feladata, hogy a már hivatalosan ellenőrzött, magas kockázatú 2026-os szabálypontok véletlen módosulását a CI azonnal megfogja.

A böngészős referenciasuite CI-lépése egyszeri újrapróbálást kapott: ha a headless Chrome a GitHub runner átmeneti lassulása miatt nem indul el, a teszt 3 másodperc után még egyszer lefut. A valódi, ismétlődő teszthiba továbbra is pirosra állítja a jobot.

## Következő prioritások

- Tapéta kalkulátor 403/redirect eltérés okának izolálása;
- nem indexelt új kalkulátorok trackerének követése és a tényleges indexelési változás mérése;
- pénzügyi kalkulátorok teljes képlet- és forrásellenőrzése;
- nettó–bruttó API edge-case és fordított számítási mátrix bővítése;
- mind a 100 kalkulátor többpontos referencia- és határérték-mátrixa;
- minden kalkulátor böngészős interakciója 320/390/768/1440 px nézeteken;
- dinamikus eredmények dark/light kontrasztja és overflow;
- API/network failure állapotok;
- egészség/sport kalkulátorok képleteinek szakmai referenciaellenőrzése;
- építőipari kalkulátorok mértékegység-, kerekítés- és ráhagyáslogikája;
- átváltók egzakt konverziós mátrixa.

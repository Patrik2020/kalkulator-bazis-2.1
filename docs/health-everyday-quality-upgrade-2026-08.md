# Egészség + mindennapi kategória – egyedi minőségi fejlesztés

Dátum: 2026-08-15
Branch: `adsense-quality-health-everyday-2026-08`

## Cél

Az egészség és mindennapi kategória minden kalkulátora kapjon saját, a konkrét felhasználói döntéshez illeszkedő hozzáadott értéket. A fejlesztés nem szószámot és nem egységes SEO-sablont optimalizál, hanem oldalanként más értelmezési, ellenőrzési vagy interaktív modult ad.

## Egészség kategória

| Oldal | Egyedi fejlesztés |
|---|---|
| `egeszseg.html` | Négy nézőpontos döntési térkép: testméret, energia, edzés/regeneráció, külön élethelyzet. |
| `bmi-kalkulator.html` | BMI mint szűrőmutató: testösszetétel-korlát, gyermek/felnőtt különbség, kiegészítő mérőszámok. |
| `kaloria-kalkulator.html` | Kalóriabecslés bizonytalansági térképe: BMR, aktivitási szorzó, valós visszajelzés. |
| `vizfogyasztas-kalkulator.html` | Interaktív kontextusellenőrző hőségre, aktivitásra, betegségre és speciális élethelyzetre. |
| `pulzus-zona-kalkulator.html` | Pulzuszóna mellé beszédteszt és terhelésérzet; képlet kontra egyéni terhelhetőség. |
| `terhessegi-kalkulator.html` | Dátumozási forráshierarchia: LMP → korai ultrahang → ART/IVF. |
| `idealis-testsuly-kalkulator.html` | „Ideális testsúly” mint történeti becslés, nem automatikus célsúly. |
| `testzsir-kalkulator.html` | Mérőszalagos becslés reprodukálhatósági protokollja és trendértelmezés. |
| `makro-kalkulator.html` | Makrótervezési sorrend: energia → fehérje/zsír → szénhidrát → visszamérés. |
| `alvasciklus-kalkulator.html` | 90 perces ciklus mítoszvédő: mennyiség, minőség és rendszeresség elsőbbsége. |
| `bmr-kalkulator.html` | BMR → napi energia létra, BMR/RMR/TDEE fogalmak szétválasztása. |
| `derek-csipo-kalkulator.html` | Derék–csípő mérési protokoll és ismételhetőség. |
| `feherje-szukseglet-kalkulator.html` | Fehérjeigény kontextuskapu: testsúly, cél, teljes energia, egészségügyi korlát. |

## Mindennapi kategória

| Oldal | Egyedi fejlesztés |
|---|---|
| `mindennapi.html` | Döntési térkép ár/vásárlás, megosztás, munka/idő és matematikai alap szerint. |
| `szazalek-kalkulator.html` | Három eltérő százalékkérdés és százalékpont-kontra-százalék értelmezés. |
| `afa-kalkulator.html` | Nettó→bruttó és bruttó→nettó iránykülönbség, adójogi határ. |
| `ar-kedvezmeny-kalkulator.html` | Interaktív kétlépcsős kedvezményhalmozás és effektív kedvezmény. |
| `borravalo-kalkulator.html` | Szervizdíj, plusz borravaló, megosztási szabály és kerekítés sorrendje. |
| `munkaido-kalkulator.html` | Interaktív jelenléti idő kontra fizetett idő, éjfélen átnyúló műszakkal. |
| `eletkor-kalkulator.html` | Hétköznapi, pontos és jogi életkor-fogalom különválasztása. |
| `datum-kulonbseg-kalkulator.html` | Interaktív inkluzív/exkluzív határnap-számítás. |
| `atlag-kalkulator.html` | Interaktív átlag–medián–terjedelem összehasonlítás szélső értékekhez. |
| `egysegar-kalkulator.html` | Használható mennyiségre vetített egységár veszteségi aránnyal. |
| `rezsi-megosztas-kalkulator.html` | Interaktív lakónap-alapú költségmegosztás. |
| `oraber-kalkulator.html` | Fizetett órabér kontra teljes időráfordításra vetített effektív órabér. |
| `arany-kalkulator.html` | Interaktív rész–rész arány skálázása új teljes mennyiségre. |

## Egészségügyi forrásalap és biztonság

A kiegészítő egészségügyi modulok nem diagnosztikai vagy terápiás állításokra épülnek. Elsődleges/hatósági szakmai forrásként WHO, CDC, NIH/NIDDK, ACOG és National Academies anyagokra mutatnak. A modulok külön jelzik, mikor nem szabad egy általános kalkulátorból egészségügyi döntést hozni.

Kiemelt források:

- WHO: obesity/BMI és antropometria.
- CDC: felnőtt BMI, fizikai aktivitás és alvás.
- NIH/NIDDK: Body Weight Planner.
- ACOG: terhességi kor és várható szülési időpont meghatározása.
- National Academies: total water és makrotápanyag DRI háttér.

## People-first elv

A két kategória 24 kalkulátora nem ugyanazt a „mi ez / képlet / példa / GYIK” blokkot kapja. Minden modul egy másik tipikus félreértést, mérési bizonytalanságot, döntési lépést vagy összehasonlítási hibát kezel.

## Technikai megoldás

- `js/health-everyday-quality-upgrades.js`: 24 kalkulátor + 2 kategóriaoldal oldalanként külön moduljai.
- `css/pages/health-everyday-quality-upgrades.css`: közös vizuális alap a különböző szerkezetű modulokhoz.
- `js/global-head.js`: csak az egészség/mindennapi kategóriaoldalakon és az érintett kalkulátorokon tölti be az új csomagot.
- A meglévő `priority-upgrades.js` és `everyday-upgrades.js` funkciókat nem írja felül; az új réteg értelmezési és döntési pluszt ad.

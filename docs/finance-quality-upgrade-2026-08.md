# Pénzügyi kategória – egyedi minőségi fejlesztés

Dátum: 2026-08-14
Branch: `adsense-quality-finance-2026-08`

## Cél

A pénzügyi kategória minden kalkulátora kapjon saját, a konkrét döntési helyzethez illeszkedő hozzáadott értéket. A fejlesztés nem szószámot és nem egységes SEO-sablont optimalizál, hanem oldalanként más módszertani, értelmezési vagy interaktív modult ad.

## Oldalankénti egyedi érték

| Oldal | Egyedi fejlesztés |
|---|---|
| `penzugyi.html` | Döntési útvonal: jövedelem → hitelteher → célösszeg → befektetés → számlázás. |
| `netto-brutto-kalkulator.html` | Bérdöntési ellenőrző: jogosultság, bérösszetevők, nettóból bruttó értelmezés, 2026-os 25 év alatti korlát. |
| `hitel-torleszto-kalkulator.html` | +2 százalékpontos kamat-stresszteszt és teljes futamidős többletteher. |
| `hitelkepesseg-kalkulator.html` | 2026-os MNB JTM összehasonlító a saját 40%-os tervezési keret mellett. |
| `lakas-hitel-onero-kalkulator.html` | HFM-alapú önerő valóságteszt külön banki forgalmi értékkel és 80/90%-os forgatókönyvekkel. |
| `osztalek-kalkulator.html` | Cashflow-ellenőrző: kifizetési gyakoriság, hozamcsapda, forrásadó és teljes hozam szétválasztása. |
| `etf-kalkulator.html` | ETF-kiválasztási ellenőrző: index/kitettség, felhalmozó–kifizető működés, TER-en túli költségek, piaci kockázat. |
| `milliomos-kalkulator.html` | 25/50/75/100%-os célmérföldkövek becsült elérési ideje. |
| `inflacio-kalkulator.html` | Kétirányú inflációs értelmezés: jövőbeni vásárlóerő és azonos vásárlóerőhöz szükséges jövőbeni összeg. |
| `kamatos-kamat-kalkulator.html` | Saját befizetés és becsült hozam szétbontása; egyértelmű különbség az ETF-kalkulátorhoz képest. |
| `havi-koltsegvetes-kalkulator.html` | Ritka éves kiadások havi céltartaléka és alapvető kiadásokból számolt vésztartalék-cél. |
| `fizetesi-hatarido-kalkulator.html` | 2026-os áthelyezett munkanap/pihenőnap magyarázó modul. |
| `szamla-teljesites-kalkulator.html` | Ügylettípus-triázs: egyszeri, időszakos, előleg, részteljesítés, külföldi ügylet. |

## Forrásalap

A jogszabály- vagy szabályozásérzékeny modulok elsődleges forrásra mutatnak:

- NAV: 25 év alatti fiatalok kedvezménye – 2026-ban havi maximum 715 765 Ft adóalap-kedvezmény.
- MNB: Adósságfék-szabályok (HFM, JTM) – 2026-tól 800 000 Ft JTM jövedelmi küszöb; konstrukciótól függő limitek; HUF jelzáloghitel főszabály szerinti 80%-os HFM, elsőlakás-vásárló/zöld esetben 90% lehet.
- Nemzeti Jogszabálytár: 10/2025. (IV. 30.) NGM rendelet – 2026. évi munkarend-áthelyezések.
- Nemzeti Jogszabálytár: 2007. évi CXXVII. törvény – teljesítési időpont, időszakos elszámolás, előleg és részteljesítés.
- KSH: fogyasztói árak módszertana.

## AdSense / people-first elv

A modulok célja, hogy a kalkulátor eredménye után a felhasználó valódi következő lépést, ellenőrzési szempontot vagy döntési keretet kapjon. Nem ugyanaz a „mi ez / képlet / példa / GYIK” blokk ismétlődik minden oldalon.

## Technikai megoldás

- `js/finance-quality-upgrades.js`: oldalanként kézzel kurált, eltérő tartalmi és interaktív modulok.
- `css/pages/finance-quality-upgrades.css`: közös vizuális alap, de a modulok szerkezete eltérő.
- `js/global-head.js`: csak a pénzügyi kategóriaoldalon és a 12 pénzügyi kalkulátoron tölti be a modult.

A meglévő kalkulátorlogikákat nem írja felül. A kiegészítő számítások külön jelölten tervezési/értelmezési segédletek.

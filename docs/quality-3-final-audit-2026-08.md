# Kalkulátor Bázis – Quality 3.0 végső domain audit

Dátum: 2026-08-15

## Cél

A teljes webhelyet úgy továbbfejleszteni, hogy az oldalak ne egy közös SEO-sablon variációi legyenek, hanem témánként és felhasználói kérdésenként önálló értéket adjanak. A minőségi mérce nem egy mesterséges szószám, hanem a számítás pontossága, az értelmezhetőség, a forráskezelés, a korlátok, a használhatóság és az oldal saját döntési szerepe.

A Google nem ír elő általános minimum szószámot a kalkulátoroldalakhoz. A korábbi belső auditban használt szószámküszöbök ezért csak technikai heurisztikák voltak, nem AdSense-szabályok. A Quality 3.0 audit nem ilyen minimumra épül.

## Az öt fejlesztési kör

1. **Pénzügyi:** kategória + 12 kalkulátor, külön döntési és értelmezési modulokkal.
2. **Építőipari:** kategória + 12 kalkulátor, külön beszerzési, kivitelezési és kompatibilitási nézőponttal.
3. **Egészség + mindennapi:** 2 kategória + 24 kalkulátor, egészségügyi biztonsági keretekkel és hétköznapi döntési hibák kezelésével.
4. **Autó + átváltók:** 2 kategória + 24 kalkulátor, teljes költség-, bizonytalanság-, mértékegység- és fogalmi értelmezéssel.
5. **Domain-szintű befejezés:** főoldal, teljes kalkulátorlista, élethelyzetek, trust/jogi oldalak, landings és a multifunkciós számológép.

## Az utolsó kör oldalankénti saját értéke

| Oldal | Egyedi Quality 3.0 szerep |
|---|---|
| `index.html` | Kérdés → bemenet → eredmény → döntés használati útvonal. |
| `kalkulatorok.html` | Kalkulátorválasztás a keresett válasz típusa szerint. |
| `elethelyzetek.html` | Több kalkulátorból felépülő döntési láncok. |
| `lakasvasarlas.html` | Önerő és teljes induló készpénzigény szétválasztása. |
| `autofenntartas.html` | Használati, időszakos, értékvesztési és váratlan autóköltségek. |
| `fizetes-munkaber.html` | Bruttó → nettó → fizetett idő → teljes idő → háztartási érték. |
| `befektetes-kezdoknek.html` | Időtáv, befizetés, hozam, költség, infláció és adó feltételezés-létra. |
| `felujitas-tervezese.html` | Nettó mennyiség, veszteség, csomagolás és javítótartalék külön kezelése. |
| `csaladi-koltsegvetes.html` | Havi, változó, ritka és váratlan kiadások időritmusa. |
| `rolunk.html` | A projekt vállalásainak és nem-vállalásainak egyértelmű határa. |
| `kapcsolat.html` | Reprodukálható hibabejelentéshez szükséges információk. |
| `miert-bizhatsz-bennunk.html` | Forrás → implementáció → teszt → korlát → frissítés ellenőrzési lánc. |
| `atlathatosag-es-minoseg.html` | Oldaltípusonként eltérő minőségbiztosítási szempontok. |
| `szamitasi-modszertan.html` | Képlet-, bemenet-, adat-, magyarázat- és tesztfrissítés különválasztása. |
| `adatvedelem.html` | Adatvédelmi olvasási térkép a jogi szöveg felülírása nélkül. |
| `cookie.html` | Sütik cél szerinti értelmezése, a tényleges tájékoztató elsődlegességével. |
| `felhasznalasi-feltetelek.html` | Gyors becslés, hivatalos igazolás, tanács és végleges döntés határa. |
| `jogi-nyilatkozat.html` | Kockázat alapján növekvő ellenőrzési igény. |
| `impresszum.html` | Üzemeltetői azonosíthatóság és kapcsolódó jogi útvonalak. |
| `penzugyi-tudatossag.html` | Likviditás → teher → cél → befektetés → visszamérés pénzügyi sorrend. |
| `wise.html` | Középárfolyam helyett tényleges terhelés, díj, megérkező összeg és idő összevetése; partneri átláthatósággal. |
| `multifunkcios-szamologep.html` | Műveleti sorrend, százalék, kerekítés és fordított ellenőrzés. |

## Sitemap audit

A végső ellenőrzés során kiderült, hogy több valóban indexelhető, tartalmi oldal nem szerepelt a sitemapben:

- `elethelyzetek.html`
- a 6 élethelyzet landing oldal
- `impresszum.html`

A sitemap-generátor és a publikált `sitemap.xml` is frissült, hogy ezek az oldalak ugyanúgy a kereső számára deklarált URL-készlet részei legyenek, mint a kalkulátorok és kategóriaoldalak.

## Quality 3.0 automatikus audit

Az új `scripts/quality-3-audit.js` a CI részeként fut. A blokkoló ellenőrzések közé tartozik:

- indexelhető oldalon title, meta description, canonical és pontosan egy H1;
- indexelhető URL jelenléte a sitemapben;
- duplikált title és meta description felismerése;
- nagyon magas, 5 szavas shingle-alapú tartalmi hasonlóság blokkolása;
- minden kalkulátor dedikált Quality 3.0 modulban való lefedettsége;
- minden fő kategória dedikált minőségi lefedettsége;
- az utolsó kör 22 oldalának külön végső modulja;
- Wise segéd/redirect oldalak indexelési hibájának kizárása;
- közvetlen, hozzájárulást megkerülő AdSense-script betöltés tiltása.

Az alacsony statikus szószám, kevés belső link vagy 80% feletti tartalmi hasonlóság figyelmeztetés lehet, de önmagában nem jelent Google-szabálysértést és nem kap mesterséges „minimum 500 szó” követelményt.

## Tartalmi elv

A közös vizuális komponensek megengedettek és kívánatosak; az egyediség nem azt jelenti, hogy minden oldalnak teljesen más dizájn kell. Az egyediség a felhasználói értékben jelenik meg: más döntési kérdés, más korlát, más gyakori hiba, más módszertani vagy interaktív második lépés.

A dinamikusan betöltött minőségi modulok a meglévő kalkulátorokat és statikus tartalmat egészítik ki, nem helyettesítik a számítási logikát.

## Fontos korlát

A Quality 3.0 audit belső minőségbiztosítási rendszer. A sikeres audit és a zöld CI nem jelent Google- vagy AdSense-jóváhagyási garanciát. A cél az, hogy technikailag, tartalmilag és felhasználói érték szempontjából sokkal nehezebb legyen a webhelyet sablonos vagy alacsony hozzáadott értékű kalkulátorgyűjteményként értelmezni.

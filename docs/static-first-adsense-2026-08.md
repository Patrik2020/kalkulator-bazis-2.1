# Kalkulátor Bázis – static-first tartalmi architektúra

Dátum: 2026-08-20

## Cél

A Kalkulátor Bázis indexelhető oldalain a felhasználói értéket hordozó tartalom ne függjön attól, hogy egy crawler vagy böngésző lefuttatja-e a JavaScriptet. A HTML-forrás önmagában is tartalmazza a lényegi navigációt, kalkulátor-kezelőfelületet, módszertani és Quality 3.0 tartalmakat, korlátokat, kapcsolódó oldalak hivatkozásait és strukturált adatokat.

A JavaScript továbbra is szükséges az interakcióhoz, élő számításhoz, API-hívásokhoz, eseménykezeléshez, hozzájárulás-kezeléshez és más valóban dinamikus funkciókhoz.

## Mi kerül statikus HTML-be?

A materializáló folyamat kizárólag előre engedélyezett DOM-részeket ír vissza a forrásoldalakba:

- közös fejléc és lábléc, ha az oldal ezeket komponensként tölti be;
- a kalkulátorkártya böngészőben létrejövő alapmezői és űrlapjai;
- kapcsolódó kalkulátorok;
- hitelességi és számítási korlát blokk;
- skip link és fő tartalom azonosító;
- Quality 3.0 pénzügyi, építőipari, egészség/mindennapi, autó/átváltó blokkok;
- a domain-szintű végső Quality 3.0 modul;
- a régebbi, tartalmi értéket is hordozó interaktív upgrade modulok statikus fallbackje;
- JSON-LD strukturált adatok.

## Mi marad dinamikus?

Nem materializálunk olyan állapotot, amely felhasználói döntéstől, külső adattól vagy futásidejű környezettől függ:

- cookie- és hozzájárulási állapot;
- AdSense hirdetés és hirdetéskitöltési állapot;
- analitikai események;
- Wise banner hozzájárulástól függő képe;
- API-válaszok és élő árfolyamok;
- felhasználó által beírt kalkulátoreredmények;
- görgetési és mobilmenü-állapot;
- eseménykezelők.

## Progresszív továbbfejlesztés

Az interaktív Quality/upgrade moduloknál a HTML-forrásban egy statikus fallback található. Ennek jelölése eltér az eredeti modul jelölésétől, ezért JavaScript futásakor az eredeti interaktív modul továbbra is létrejön. A `js/static-first-fallbacks.js` ekkor eltávolítja a statikus másolatot.

Ennek következménye:

1. JavaScript nélkül a tartalom olvasható és indexelhető.
2. JavaScripttel az interaktív változat működik, duplikált tartalom nélkül.
3. Ha egy dinamikus modul hibázik, a statikus tartalom fallbackként megmarad.

A tisztán tartalmi `site-quality-final.js` modul másképp működik: annak materializált szekciója megtartja az eredeti `data-quality-final` jelölést, így a futásidejű modul felismeri, hogy a tartalom már a dokumentumban van, és nem hoz létre második példányt.

## Materializálás

Parancs:

```bash
npm run static:materialize
```

A `scripts/materialize-static-first.js`:

1. beolvassa a sitemap indexelhető HTML oldalait;
2. elindítja a projekt saját helyi statikus szerverét;
3. headless Chrome-ban kirendereli az oldalakat;
4. csak az engedélyezett tartalmi részeket emeli ki;
5. ezeket idempotens `KB_STATIC` blokkjelölésekkel visszaírja az eredeti HTML-be;
6. nem menti vissza a teljes böngésző-DOM-ot.

A teljes DOM visszaírásának kerülése szándékos: így cookie-, reklám-, analitikai vagy más ideiglenes futásidejű állapot nem szivárog bele a publikált forrásba.

## Regresszióvédelem

Parancs:

```bash
npm run static:check
```

A static-first audit többek között ellenőrzi, hogy:

- a komponensként használt fejléc/lábléc ne maradjon üres helyőrző;
- a kalkulátor alapfelülete a HTML-forrásban is jelen legyen;
- a Quality 3.0 céloldalak valóban kapjanak statikus tartalmat;
- a régebbi upgrade modulok tartalmi részei kapjanak fallbacket;
- a statikus blokkjelölések párosak legyenek;
- minden indexelhető oldal betöltse a fallback-kezelőt.

## CI folyamat

A `.github/workflows/materialize-static-first.yml` a megfelelő brancheken:

1. futtatja a materializálást;
2. lefuttatja a static-first auditot;
3. lefuttatja a teljes meglévő `npm run quality` ellenőrzést;
4. ellenőrzi a sitemapet és a whitespace hibákat;
5. ha a generált forrás változott, a GitHub Actions bot külön build commitban visszaírja.

Ez biztosítja, hogy a későbbi fejlesztéseknél se kelljen kézzel másolni a JavaScriptből generált tartalmat több tucat HTML fájlba.

## Fontos korlát

A static-first architektúra nem AdSense-jóváhagyási garancia. A célja az, hogy a webhely saját tartalmi értéke és szerkezete a nyers HTML-forrásból is közvetlenül látható legyen, és ne egy kliensoldali JavaScript-réteg sikeres lefutásától függjön.

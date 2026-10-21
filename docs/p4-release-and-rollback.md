# P4 – Biztonságos közzététel és visszaállítás

## Hol tart a közzététel?

A Kalkulátor Bázis a `main` ágról GitHub Pages automatikus
`pages build and deployment` folyamatán keresztül kerül közzétételre.
A jelenlegi, szükséges PR-kapuk: `Site quality gate`,
`Dependency and repository security`, `Browser regression gate`.

Minden új `main` commitra a `Release source evidence` workflow elkészíti a
`release-source-manifest.json` artefaktumot, amely tartalmazza:
- a teljes 40 karakteres forrás-commit SHA-t;
- a `sw.js` publikációs verzióazonosítóját;
- a kritikus HTML, JS, CNAME, sitemap, ads.txt és robots.txt fájlok SHA-256 lenyomatait.

**Fontos:** az artefaktum *forrásbizonyíték*, nem bizonyítja, hogy
a Cloudflare mögötti éles oldalon már ez a verzió fut. A `pages build and
deployment` sikerét és az élő audit eredményét **külön ellenőrizni kell**.
`Production smoke` esetén a `Production audit: skipped` (Cloudflare 403)
állapot **nem sikeres éles ellenőrzés**, még ha a workflow összesítése zöld is.
Az éles audit `sw.js` buildazonosítót is hasonlít a forrásverzióhoz, amikor a
Cloudflare átengedi a futtatót.

## Normál élesítés

1. Készítsünk PR-t és várjuk meg mindhárom kötelező, zöld CI-kaput.
2. Merge után jegyezzük fel a `main` commit SHA-t és a `Release source evidence`
   által kiadott manifestet.
3. Ellenőrizzük, hogy az **azonos SHA-hoz tartozó** GitHub Pages telepítési
   folyamat sikeres.
4. Ellenőrizzük a `Production smoke` két jobját: ha a `Production audit`
   kihagyott, az éles webhely egyenlőre **nem bizonyított**. Ne címkézzük
   így a változatot „utolsó bizonyítottan jó élő kiadásnak”.
5. Ha rendelkezésre áll megbízható külső böngésző, a főoldal, kalkulátorok,
   adatvédelem/hozzájárulás, hirdetéskizárás és legfontosabb API-függések
   ellenőrzése szükséges.

## Biztonságos visszaállítás egy hibás élesítés után

**Nem írjuk át erővel a main-t, nem töröljük az előzményeket, és nem
engedjük megkerülni a kötelező GitHub teszteket.**

1. Azonosítsuk a **hibás commitot** és az utolsó ténylegesen ellenőrzött jó
   forrásváltozatot a `main` előzményeiben és a release manifestekben.
2. Ha a legutóbbi HEAD a hibás commit, hozzunk létre a friss
   `main`-ről egy `revert/...` ágat:

   ```bash
   git fetch origin main
   git switch -c revert/hibas-kiadas origin/main
   git revert --no-edit <HIBAS_COMMIT_SHA>
   ```

   Merge commitnál a mainline szülőt külön kell megállapítani;
   több visszavonandó vagy ütköző commit esetén manuális kódáttekintés kell.

3. Nyissunk PR-t. Várjuk meg **mindhárom kötelező státuszellenőrzést**.
   Számítási vagy szabályozási regressziónál külön referenciaellenőrzés is kell.
4. Merge után ellenőrizzük az **új revert commit** GitHub Pages buildjét,
   a megjelent `sw.js` verziót és a böngészős/éles teszteket. A visszaállítás
   új commitot és új telepítést eredményez; nem pillanatnyi és nem garancia
   a kliensoldali cache-ek azonnali érvénytelenítésére.

## Visszaállítási próba

A `scripts/rollback-drill.js --target <HEAD_SHA>` **csak a legfrissebb HEAD**
visszavonását próbálja ki egy eldobható Git-worktree-ben. Nem módosítja
a `main` ágat és nem telepít semmit. A release workflow minden push után
lefuttatja. Ha konfliktusos vagy üres lenne a visszavonás, jelezzen hibát.

## Megjegyzés

Cloudflare 403 esetén külső éles ellenőrzéshez külön megbízható monitorozási
pont vagy Cloudflare hozzáférési beállítás lehet szükséges. Nem változtatunk
automatikusan Cloudflare-biztonsági szabályokon a teszt kedvéért.

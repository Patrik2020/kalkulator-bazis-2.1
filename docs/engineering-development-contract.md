# Kalkulátor Bázis 2.1 – kötelező fenntarthatósági fejlesztési szerződés

**Cél:** minden változtatás illeszkedjen a meglévő rendszerhez, őrizze meg az üzleti és felhasználói viselkedést, és ne hagyjon hátra bizonyítatlanul szükséges kompatibilitási rétegeket.

Ez a dokumentum az [AGENTS.md](../AGENTS.md) és a meglévő build-, teszt-, biztonsági és lokalizációs előírások kiegészítése, nem helyettesítése.

## 1. Módosítás előtt: kötelező felderítés

- A tényleges, friss `main` állapotból induljunk, ellenőrizzük a kapcsolódó nyitott PR-eket és a helyes kanonikus szerkesztési helyet (kézi forrás vagy materializált kimenet).
- Azonosítsuk a funkció jelenlegi gazdáját, a kapcsolódó JS/CSS/HTML-modulokat, API-kat, függőségeket, generátorokat, service-worker és cache-kapcsolatokat, illetve a már meglévő teszteket.
- Előre írjuk le: mi a kívánt változás, minek kell változatlannak maradnia, milyen bizonyíték és milyen teszt fogja igazolni az eredményt.

## 2. Kódolási és takarítási szabályok

1. **Integráció a meglévő forráshoz.** Először a meglévő implementációt módosítsuk. Külön `*-fix`, `*-v2`, `*-upgrade`, `*-override` fájl csak megindokolt, dokumentált modulhatár esetén.
2. **Nincs eltakaró javítás.** Nem szabad régi JS-logikát, eseménykezelőt vagy CSS-szabályt pusztán sorrendi felülírással használaton kívül helyezni, ha az eredeti biztonságosan rendezhető.
3. **Csere esetén takarítás kötelező vizsgálat.** Ha új implementáció váltja a régit, listázzuk a kivezetett fájlokat, szelektorokat, teszteket, importokat és buildlépéseket; bizonyítottan feleslegessé vált részeket távolítsunk el ugyanabban vagy külön, egymásra épülő PR-ben.
4. **Törlés csak bizonyítékkal.** Statikus és dinamikus betöltések, runtime `import`, DOM injektálás, test fixture, generator, CI, manifest, PWA, API, SEO és visszafelé kompatibilis linkek áttekintése után.
5. **Egyértelmű tulajdonos.** Egy számításnak, felületnek, állapotkezelésnek és stílusfelelősségnek legyen kijelölt kanonikus gazdája. A párhuzamos kód indokát rögzítsük.
6. **Nincs spekulatív refaktor.** Az audit nem felhatalmazás tömeges újraírásra. Kis diff, célzott funkció és kisebb kockázat előnyt élvez.
7. **Generált fájlok szerződése.** A build `source -> render -> finalize` lánca és `index.html` / `fragments` kapcsolata sértetlen. Azonosítsuk a forrást; manuális módosítást generált kimenetben csak a projekt megengedett folyamatával. `static:verify` szükséges a buildet érintő PR-eknél.
   - **Build-eredet és transzformáció-életciklus:** minden szerkesztett HTML/JS/CSS fájlnál vizsgáljuk, írja-e az `apply-*`, a materializáló vagy a normalizáló. Véglegesen beolvadt változtatáshoz ne adjunk újabb `apply-*` javító réteget; a szükségtelenné vált transzformáció kivezetése legyen megtervezett, önálló tesztelt feladat. A materializált DOM-ra ható runtime JS-változásnál ellenőrizzük, hogy valóban lefut-e a teljes `static:build` és `static:verify` CI, ne elégedjünk meg a sima Site quality zöld jelzésével.
8. **Nem romolhat a publikus szerződés.** Számítási eredmények, kedvezmények, jogszabály-korszakok, API-sémák, URL-ek, canonical/SEO, HU/EN/DE szemantika, billentyűzet és akadálymentesség, cookie/AdSense-hozzájárulás, legfeljebb 3 tervezett ad placement/oldal, mobil megjelenés változása csak explicit, dokumentált kéréssel.
9. **Hibajavítás: gyökérok.** Nem kapcsolunk ki vagy enyhítünk tesztet, lintet, biztonsági kaput. Ugyanazon PR-ben, első hiba alapján legfeljebb három célzott javítókör; ha elakad, pontos blokkoló.
10. **Tesztelés tényalapon.** Csak valóban lefuttatott tesztet jelentsünk sikeresnek. Célzott unit/integration/math/regresszió és szükség szerint teljes quality, mobil/desktop browser, a11y, SEO, statikus build/idempotencia, PR CI, éles smoke.
11. **Ne legyen összevont, kaotikus PR.** A fordítás, hírpublikálás, hirdetés, API, vizuális újratervezés és takarítás külön szálon maradjon.
12. **Átlátható átadás.** A PR tartalmazza: cél és elfogadási feltétel; milyen régi kódot integráltunk vagy távolítottunk el; tényleges tesztfutások és eredmények; kockázatok; visszaállítás; CI és production **külön** státusza.
13. **Élesítés korlátja.** Merge, publikálás vagy deployment csak a felhasználó jóváhagyásával, a meglévő `AGENTS.md` szerint.
14. **Ismeretlen nem egyenlő feleslegessel.** A nem bizonyíthatóan elavult elem megmarad, és audit tételként dokumentáljuk.

## 3. Kötelező PR-ellenőrzőlista

- [ ] Az eredeti implementációt, minden felhasználását és a generáló/betöltési láncot megvizsgáltam.
- [ ] Leírtam, milyen viselkedés marad változatlan, és mi módosul tudatosan.
- [ ] Nem hoztam létre indokolatlan felülíró CSS/JS réteget; ha igen, a modulhatár indokolt.
- [ ] Megvizsgáltam a régi kód eltávolíthatóságát; a döntés dokumentált.
- [ ] Kisebb diff, szükséges regressziós tesztek, kritikus invariánsok; tényleges futás vagy kifejezett hiány.
- [ ] A build/generálás és idempotencia szerződés nem sérült; a megfelelő ellenőrzést futtattam vagy jelöltem.
- [ ] HU/EN/DE, mobil, a11y, SEO, API, cookie/hirdetés, PWA érintettséget rögzítettem.
- [ ] Nem módosítottam más aktív PR funkcionalitását, nem gyengítettem kapukat.
- [ ] Feltüntettem: helyi tesztek, GitHub CI, merge és éles ellenőrzés **külön státusz**.

## 4. Kivétel

A szabály csak dokumentált, szűk, időben korlátozott kivétellel térhető el (például átmeneti kompatibilitási megoldás), amely megnevezi a régi útvonal kivezetésének feltételeit és regressziós fedezetét. Nem lehet „majd később letakarítjuk” típusú indok nélküli rétegzés.

Kapcsolódó első felmérés: [architecture-maintainability-audit-2026-11-08.md](architecture-maintainability-audit-2026-11-08.md).

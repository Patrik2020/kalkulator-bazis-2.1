# HU/EN/DE záróaudit – 2026-11-16

**Állapot: nyitott, nem teljesített.** Vizsgált főág: `67f42682eb9f20aa2184ccc5bce2624eb322bfb1` (#406). Az audit kezdetekor nem volt nyitott PR. A 89/89 kalkulátor és 32/32 egyéb oldal részletes tartalomnyilvántartása változatlan; ez nem a teljes többnyelvű SEO vagy minden fordítás minőségének igazolása.

## Megismételhető forrásvizsgálat

`node scripts/localization-seo-audit.js --write`

A teljes, oldalankénti bizonyíték: [localization-seo-audit-findings.json](localization-seo-audit-findings.json). A vizsgálat mind a 121 aktív, részletesen nyilvántartott oldal HTML-forrását és tényleges fordítófüggvényeit olvassa. A közös UI-szótárat is figyelembe veszi. Nem módosít weboldalt, számítást, bemenetet, canonicalt, hirdetést vagy nyelvi útvonalat.

| Vizsgálat | Eredmény |
| --- | --- |
| Title, description, meglévő OG/Twitter cím és leírás EN/DE szótárlefedettsége | 42 érintett oldal, 390 mező–nyelv hiány |
| Ékezetes magyar name/headline/description/text JSON-LD mezők fordítása, márkanév kivételével | 50 érintett oldal, 190 mező–nyelv hiányjelölt |
| HTML-ben szereplő hreflang hivatkozás | 0/121 oldalon |

A darabszámok nem egyedi mondatok számai: ugyanaz a szöveg több metahelyen és két célnyelven is szerepelhet. A szótári hiány nem önmagában böngészős bizonyíték: a tényleges runtime módosítást külön kell ellenőrizni. A JSON-LD vizsgálat ékezetes magyar szövegre szűrt hiányjelölt-lista, ezért nem teljes nyelvfelismerés. A már meglévő mezőket vizsgálja, nem ír elő minden oldalon Twitter mezőt. Nincs automatikus sikeres/bukott kilépőkód a tartalmi hiányokra; ez leltár, nem kötelező kapu.

Példák: a lakáshitel-önerő oldal „Lakáshitel önerő kalkulátor | Ingatlanvásárlás tervezése” címéhez és leírásához, a bruttó–nettó oldal jelenlegi 2026-os metaadataihoz nincs megfelelő bejegyzés az érintett oldali és közös fordítókban. A BMI strukturált alkalmazásleírásához is hiányzik pár.

## Runtime és SEO megállapítások

- A `js/site-language-inner.js` kifejezetten `html lang=hu` értéket és `partial: true` állapotot tart fenn EN/DE választáskor is. Ez korábbi részleges lokalizációs védelem; a teljes oldal és a megmaradó HU részek nyelvi annotációját böngészőben kell felmérni a módosítás előtt.
- Több régebbi kalkulátormodul, például `js/egeszseg/bmi-locale.js`, címeket/leírásokat kezel, de a JSON-LD-t nem fordítja; újabb modulok és a támogató oldalak már kezelik. Egy közös, bizonyított gazdához kell rendezni a felelősséget, kerülve új felülíró réteg létrehozását.
- Jelenleg ugyanazon magyar canonical URL alatt, kliensoldali preferenciával váltható a felület. A hreflang hiánya önmagában nem hiba nem létező külön EN/DE URL-ekhez. A projekt nem tekinthető külön indexelhető háromnyelvű SEO-kiadásnak. Ehhez tényleges, stabil nyelvi URL-ek, szerveroldalról/statikus HTML-ként elérhető lokalizált tartalom, önálló canonicalok, kölcsönös hreflang és sitemap-terv szükséges; ezek kialakítása külön végrehajtandó munkacsomag.
- A német felhasználói megszólításban konkrét eltérés: `js/locales/support-information.js` feltétel-elfogadási mondata „akzeptieren Sie”, miközben a projekt tegezést ír elő. A többi „Sie” előfordulás sokszor tárgyra utaló névmás, ezért tömeges cseréje hibás lenne.

## Futtatások és akadály

- `npm ci --ignore-scripts`: sikeres (90 csomag). Ez nem teljes build.
- `node --test scripts/*-locale.test.js scripts/localization-foundation.test.js scripts/site-language-inner.test.js`: 206/206 sikeres, 0 kihagyott.
- `npm run quality`: sikeres (kilépőkód 0), beleértve a számítási/modellellenőrzéseket, HTML/JS lintet, URL-, schema-, canonical/sitemap- és Quality 3.0 kapukat. Ezek nem bizonyítják a teljes EN/DE nyelvi vagy keresőindexelési megfelelést.
- `node scripts/localization-inventory.js --check`, `npx eslint scripts/localization-seo-audit.js`, `git diff --check`: sikeres.
- `npm run test:browser:ui`: sikertelen, `A headless böngésző nem indult el 20 másodpercen belül.` Nem készült `results.json`. A futás nem számíthat sikeres funkcionális/nyelvi/éles böngészős auditnak.
- A korábbi #406 sikeres CI és production smoke eredménye nem helyettesíti e záróaudit új, teljes tartalmi és SEO-vizsgálatát.

## Lezárási feltételek, folytatási sorrend

1. A meta-/sémahiányokat természetes EN/DE szöveggel pótolni az eredeti gazdamodulokban; minden érintett oldalt és a dinamikus fejgenerálást ellenőrizni.
2. Működő böngészőkörnyezetben a 121 oldalon megvizsgálni a megjelenő metaadatokat, sémákat, dokumentumnyelvet, teljes mondatokat, bezárt GYIK-et, hozzáférhető feliratokat és HU-visszaállítást; 390/1440 px és nyelvenként rögzített bizonyíték.
3. A meglévő összes célzott eredmény-/hiba-/számítási tesztet és teljes böngészős regressziót futtatni; megőrzött felhasználói bemenetek és számértékek.
4. Az összes egyedi szótári EN/DE párt oldalanként nyelvileg végigolvasni, a tagolt mondatokat böngészőben is. Az automatizált egyezés ezt nem igazolja.
5. Külön indexelhető EN/DE SEO-kiadás megvalósítása és ellenőrzése; csak valós nyelvi URL-ekhez hreflangot hozzáadni.
6. Javítások után kötelező quality/build/idempotencia és PR CI; merge után Pages, élő elérhetőség és tényleges production tartalomaudit. A teljes záróaudit csak e bizonyítékokkal kész.

Ez az audit-PR nem tartalmaz runtime-javítást és nem készre jelentés. A korábbi, teljes auditot késznek nevező jelentését ez a nyitott hiánylista helyesbíti.

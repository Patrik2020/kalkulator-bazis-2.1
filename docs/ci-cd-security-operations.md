# Biztonságos CI/CD és összeolvasztási eljárás

## Alapelv

Az éles oldal forrása kizárólag a védett `main` ág. Minden változás külön
PR-on keresztül érkezzen, a PR tesztjei **csak olvassanak**, és ne toljanak
vissza új commitokat. A statikus generálás ellenőrző módja eltérés esetén
hibát és letölthető patch-et ad: csak átnézett generált fájl kerülhet a PR-ba.

## Generált állományok

A `Materialize static-first HTML` most csak ellenőriz, nem commitol és
nem pushol. Ha `Stale generated output` hibát ad, a fejlesztő a
`static-first-drift` artifactot ellenőrizheti, vagy helyben futtathatja
a workflow transzformációit, és **csak a szándékolt diffet** commitolhatja.
A sitemap `generatedAt` mezője csak tartalmi változáskor módosul.
A service-worker és az asset cache-verziója content hash alapján változik.
A generálási műveletek ne fussanak automatikusan éles `main` ágra pusholva.

## Kötelező GitHub ruleset – tulajdonosi teendő

A `Protect main` ruleset jelenleg nem követel meg zöld CI-t, és az
elfogadott PR-review-k száma nulla. A GitHub
`Settings → Rules → Rulesets → Protect main` felületén javasolt:

- Required status checks: `Site quality / validate`,
  `Repository security baseline / Dependency and repository security`.
  A pontos neveket a legfrissebb sikeres Actions-futásokból kell kiválasztani.
- Require branches to be up to date before merging, vagy merge queue,
  ha az adott GitHub-terv támogatja.
- Require pull request; block force pushes and deletions (utóbbi kettő már él).
- Legalább egy független review, ha valóban van második jogosult fejlesztő;
  egyszemélyes repóban ez második személy nélkül blokkolna minden merge-et.
- Kötelező státuszt **ne** állíts be olyan workflow-ra, amely `paths`
  szűrés miatt jogosan kihagyhatja a futást.
- A `CODEOWNERS` önmagában nem kikényszerített review.

A jelenlegi GitHub-connector ehhez a rulesethez olvasási hozzáférést ad;
a fenti adminisztratív változtatást nem tudja automatikusan élesíteni.

## Bevezetés és üzemeltetés

1. PR: statikus output, site quality, függőség- és repository security,
   böngészős tesztek; a piros vagy függő állapot nem kész eredmény.
2. Squash merge csak ellenőrzött SHA-val, a main változásaira figyelve.
3. Cloudflare Pages: kész és sikeres telepítés külön ellenőrizendő.
4. Éles weboldal: a Production reachability és a Production audit
   **két külön bizonyíték**. Ha Cloudflare 403 miatt az audit kimarad,
   az eredmény nem sikeres élő audit, hanem **nem ellenőrizhető**.
5. Hiba esetén: legutóbbi sikeres Cloudflare Pages deploy visszaállítása
   az érintett platformon, majd célzott javító PR. A repo merge nem jelent
   garantált rendelkezésre állást vagy automatikus rollbacket.

## Fokozatos biztonsági szigorítás

- A jelenlegi CSP alapvédelmet ad, de még nem tiltja teljes körűen a
  külső vagy inline scripteket. Ennek szigorítása a GA4, AdSense, Wise,
  cookie-hozzájárulás és számológépek tesztelése után, stagingben történjen.
- GitHub Actions hivatkozásokat ellenőrzött commit SHA-hoz érdemes rögzíteni.
- Dependabot npm + GitHub Actions frissítések hetente; a security-baseline
  magas/kritikus npm audit problémánál piros státuszt ad.
- Cloudflare hozzáférésekre MFA/passkey, legszűkebb tokenjog, elkülönített
  telepítési token és incidensnapló ajánlott.
- Titkokat GitHub Secrets vagy Cloudflare Secrets tároljon, ne a repó.

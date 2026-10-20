# GitHub PR CI kapuk – main ág

A CI legfeljebb annyit tud megakadályozni, amennyit a GitHub Ruleset kötelező
ellenőrzésként előír. A workflow-k frissítése önmagában **nem** aktivál GitHub
adminisztratív branch protection szabályokat.

## Mindig létező státuszok

A `Protect main` szabályban a következő GitHub Actions checkeket kell
kötelezővé tenni:

- `Site quality gate` – teljes statikus forrás-, matematika-, HTML-, SEO- és
  build-integritás ellenőrzés;
- `Dependency and repository security` – npm dependency és repó-biztonság;
- `Browser regression gate` – minden PR-nél megjelenik, és ellenőrzi az
  automatizált böngészős tesztek szükségességét és eredményét.

**A `smoke` és `deep-ui-qa` feladatokat ne adjuk külön kötelező státuszként
a Rulesethez:** dokumentációs/cikkes PR-nél szándékosan kihagyhatók,
viszont a fenti aggregáló gate ekkor is lefut.

## Beállítás

Repository Settings → Rules → Rulesets → Protect main → Edit →
Add rule → Require status checks to pass. A három fenti checket GitHub Actions
forrással kell kiválasztani. A jelenlegi pull request-kötelezettséget,
non-fast-forward és törlés elleni védelmet meg kell tartani.

A GitHub admin-jogosultság és a megfelelő GitHub-terv/Ruleset támogatás
szükséges lehet. Éles szabályt csak a sikeresen lefutott, PR-ből létrehozott
checkek nevei alapján válasszunk.

## Browser regression gate

A workflow minden PR-nél indul: a `changes` job a base és head közötti
Git-diffből számítja ki a szükséges mély böngészős teszteket. Csak kifejezetten
engedélyezett, statikus szerkesztőségi, képi, dokumentációs és sitemap
változásoknál hagyja ki a Chrome-mátrixot.

Ismeretlen útvonal, üres diff, script, közös JS, CSS, kalkulátor, root HTML,
buildkonfiguráció, workflow-változás: böngészős ellenőrzés szükséges.

A `Browser regression gate` sosem hagyható ki: ha változásosztályozás
hibázik, vagy az előírt `smoke` / `deep-ui-qa` bármelyike hibás, megszakadt
vagy kihagyott, a gate elbukik. Dokumentációs PR-nél csak akkor zöld,
ha a két drágább job tényleg szándékosan kihagyott.

A szabály változtatásakor:
1. Fusson át egy UI kódot érintő teszt-PR, mindkét browser-jobs kötelező.
2. Fusson át egy szerkesztőségi/dokumentációs teszt-PR; a `Browser regression gate`
   zöld, miközben a browser-jobs skipped.
3. A `scripts/ci-browser-gate.test.js` unit tesztben ellenőrizzük, hogy
   kihagyott/hibás kötelező job esetén a gate piros.
4. Aktiválás után próbáljuk ki, hogy a Ruleset valóban blokkolja-e egy
   nem sikeres kötelező ellenőrzésű PR merge-ét.

## Korlát

A `browser-quality.yml` workflow nem helyettesíti a GitHubon kikényszerített
Rulesetet. Ha az adminisztráció nem módosul, egy piros check a felületen
látszik, de a PR ettől még összeolvasztható maradhat.

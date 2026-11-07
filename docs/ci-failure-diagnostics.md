# Automatikus CI-hibadiagnosztika – Kalkulátor Bázis 2.1

## Mi történik egy sikertelen ellenőrzés után?

A `.github/workflows/ci-failure-diagnostics.yml` a következő GitHub Actions-folyamatok **sikertelen, befejezett** futása után indul:

- Site quality
- Browser regression
- Repository security baseline
- Materialize static-first HTML
- URL consolidation

Az ellenőrző csak a **megbízható `main` ágat** tölti le. A sikertelen futás job- és steplistáját a GitHub API-ból **olvasási jogosultsággal** kéri le; nem futtat PR-ból származó kódot, és nem tölt le/értelmez nyers, esetleg titkokat tartalmazó naplókat.

A `CI failure diagnostics` futásban két kimenet jelenik meg:

1. Olvasható **Job summary** a hibás job/step nevekkel, hivatkozással az eredeti naplóhoz és konzervatív hibaelhárítási javaslattal.
2. **`ci-failure-report-<run-id>-<attempt>`** nevű JSON artifact (14 napig): strukturált, kizárólag metaadatokat tartalmazó jelentés egy későbbi AI-fejlesztő számára.

Például a `Verify committed asset fingerprints` lépés hibájánál a jelentés a generált assetek eltérését jelzi, és a következőt javasolja:

```sh
npm run ai:prepare
git status --short
git diff
# Csak a felülvizsgált, szükséges változtatásokat commitold.
npm run ai:check
```

A GitHub Actions folyamatai ezután továbbra is kötelezőek.

## Hova kell kattintani?

GitHub → **Actions** → **CI failure diagnostics** → a megfelelő futás → **Summary** vagy **Artifacts**.

A diagnosztika önmagában nem indít javítást. Egy fejlesztő (vagy később egy külön, korlátozott jogosultságú AI-agent) a riport és a tényleges GitHub napló alapján javíthatja a konkrét PR-t.

## Korlátok és biztonság

- Ez **nem önálló AI-autofix**. Nem ír PR-kommentet, nem pushol, nem merge-el, nem telepít.
- A hibaosztályozás a sikertelen job és step **nevére** épül. Nem állítjuk, hogy a konkrét gyökérokot azonosítja, és nem elemzi a teljes naplót.
- A `workflow_run` típusú esemény kiemelt jogosultsági kockázat lehet; a workflow ezért **csak `actions: read` és `contents: read` jogosultságot** kér, nem használ külön titkokat, és nem futtat nem megbízható PR-kódot.
- A riportok akkor készülnek automatikusan, amikor ez a workflow már a **`main` ágon** van. Pusztán a PR elkészítése nem indítja el a `workflow_run` figyelőt.
- Ha a GitHub API nem elérhető, a riportkészítő **hibával leáll**; nem állítja, hogy sikeres diagnózis született.
- Teljes körű autonóm javítás csak egy későbbi, külön tervezett lépésben jöhet szóba, egyértelmű jogosultsági és jóváhagyási korlátokkal.

## Tesztelés

```sh
npm run test:ci-diagnostics
```

A classifier tesztjei a meglévő `npm run test:build-pipeline` parancs részeként a `Site quality` workflow-ban is futnak. A GitHub API-ra küldött valódi lekérdezés és a `workflow_run` eseményhez tartozó működés az első éles, sikertelen futáson ellenőrizhető.

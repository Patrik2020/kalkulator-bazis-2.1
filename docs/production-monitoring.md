# Éles weboldal-monitorozás – Cloudflare és GitHub Pages

## Három egyértelmű állapot

A `Production smoke` workflow a `Production verified status` záró jobban
**nem** tekinti sikeresnek a kihagyott éles tesztet.

- **VERIFIED:** a főoldal elérhető *és* a `Production audit` teljesen sikeres:
  release `sw.js` verzió, fontos oldalak, sitemap, robots.txt, ads.txt és
  az ellenőrzött átirányítások egyeznek.
- **INCONCLUSIVE:** a Cloudflare HTTP 403-mal blokkolta a GitHub-runnert és
  a tényleges audit kimaradt. Ez **nem bizonyított leállás**: a monitor
  nem tudott bizonyítani. A workflow ilyenkor **piros** a hiányos lefedettség
  miatt, nem azért, mert biztosan elérhetetlen a weboldal.
- **FAILED:** a kapcsolódás, az audit vagy a monitor állapotgépe hibás.
  Ez **vizsgálandó üzemzavar**, önmagában nem minden esetben bizonyított
  felhasználói oldali leállás.

A workflow naponta ütemezve, `main` push után és kézzel is fut.
A végső job a régi „Cloudflare 403 + skipped audit + zöld workflow”
félrevezető eredményt megszünteti.

## GitHub-incidensek és értesítés

Nem sikeres vagy nem bizonyított ellenőrzés esetén a workflow **egy darab**
nyitott, `[Production monitor] Live verification problem` című GitHub
Issue-t nyit vagy frissít. Azonos típusú hiba ismétlődésekor **nem**
halmoz új issue-kat/kommenteket. A teljes, sikeres éles audit után automatikusan
lezárja az issue-t.

A GitHub Issues önmagában nem garantál azonnali push/e-mail értesítést:
ellenőrizni kell a GitHub-értesítési beállításokat, vagy az issue mellé
független üzemidő-figyelőt kell csatlakoztatni. A GitHub Actions futási
összefoglalója kiírja a tényleges állapotot. A monitoring workflow-nak
`issues: write` jogosultság kell, de PR-es workflow-hoz nincs megadva
írási jogosultság.

## Cloudflare-kompatibilis útvonal – opcionális

Az oldal biztonsági szabályait **nem** gyengítjük automatikusan. Két
biztonságosabb lehetőség van:

1. **Független külső monitor** (pl. UptimeRobot / Better Stack): szolgáltatói
   ellenőrzés több külön hálózatból, HTTP 200, főoldali tartalomjelző,
   nettó–bruttó kalkulátor útvonala, és saját riasztás. Fontos, hogy
   ténylegesen átjusson a Cloudflare védelmén; a kezelőfelületen tesztelni
   kell a hozzáférést. A harmadik fél szolgáltatása és értesítési csatornája
   külön beállítást igényel.
2. **Titkos monitorfejléc** a GitHub-runnertől: hozz létre egy hosszú,
   véletlenszerű tokenértéket a saját gépeden, add hozzá az adattár
   Actions secretjeihez `KB_MONITOR_TOKEN` néven. A workflow
   `X-KB-Monitor-Token` fejlécként küldi minden probe-on.
   Cloudflare `Security → Security rules → Custom rules` alatt *csak
   akkor*, ha az adott védelem támogatja, használható célzott `Skip`
   szabály a `kalkulatorbazis.hu` hostra, kizárólag a titkos fejléc
   pontos egyezése esetén. Példa kifejezés:

   ```text
   (http.host eq "kalkulatorbazis.hu" and
    any(http.request.headers["x-kb-monitor-token"][*] eq "<YOUR_RANDOM_TOKEN>"))
   ```

   Csak a ténylegesen hibázó, szükséges biztonsági funkciót hagyd ki a
   monitor számára, és engedélyezd a szabály naplózását. Ne add meg a tokent
   kódban, issue-ban vagy chatben; a WAF szabályban és GitHub secretben azonos
   érték szerepeljen. A **Cloudflare Free Bot Fight Mode nem kerülhető meg
   Skip szabállyal**, ezért ilyen blokkolásnál a WAF-kivétel **nem megoldás**,
   akkor inkább külső ellenőrző szolgáltatás szükséges.

   Hivatalos Cloudflare dokumentáció:
   - https://developers.cloudflare.com/waf/custom-rules/skip/
   - https://developers.cloudflare.com/waf/custom-rules/use-cases/require-specific-headers/
   - https://developers.cloudflare.com/bots/get-started/bot-fight-mode/

**Ne állítsd le a Cloudflare biztonsági védelmeit általánosan csak azért,
hogy az egyik monitor zöld legyen.**

## Ellenőrzés és korlátok

1. A tesztek: `node --test scripts/production-monitor-verdict.test.js scripts/production-monitor-incident.test.js`.
2. A repo kötelező `Site quality gate` teszteli a három állapotot, valamint
   a GitHub issue létrehozás / ismétlés / lezárás logikát.
3. Az éles workflow `Production verified status` jobján nézd a tényleges
   `VERIFIED / INCONCLUSIVE / FAILED` eredményt.
4. *Külső* monitorból próbáld ki a valódi elérést és a riasztási csatornát.
   A GitHub Pages sikeres telepítése nem bizonyítja a Cloudflare-proxyn
   átmenő valós hozzáférést.

A tényleges automatizált külső monitor csak külső szolgáltatói
hozzáférés és sikeres probe után tekinthető késznek.

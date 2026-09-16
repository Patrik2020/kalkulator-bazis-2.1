# AdSense CMP / TCF aktiválási checklist

Ez a dokumentum a Kalkulátor Bázis AdSense Gate v2 ötödik körének account-oldali lépését rögzíti.

## Állapot – 2026. szeptember 16.

Az AdSense-fiókban az account-oldali konfiguráció **elkészült**:

- a `kalkulatorbazis.hu` webhelyhez tartozó **European regulations / Európai szabályozások** üzenet már létezett és **Közzétéve** állapotú volt;
- a közzétételi kapcsoló aktív;
- az **Üzenetlefedettség maximalizálása / Maximize message coverage** engedélyezve van;
- a **beleegyezési mód hirdetési célokra** engedélyezve lett;
- az **analitikai Consent Mode** is engedélyezve lett;
- a beállításokat a fiókban elmentettük.

Ezek az account-oldali pontok a továbbiakban késznek tekinthetők. Az éles webhelyen végzett TCF-runtime ellenőrzés külön merge/élesítési ellenőrzés marad, mert azt csak az új kód tényleges kiszolgálása mellett lehet hitelesen igazolni.

## Miért kell külön Google CMP?

A Kalkulátor Bázis saját sütikezelője továbbra is használható a saját analitikához és a partneri külső tartalmakhoz, de **nem tekintjük Google AdSense CMP-nek**.

A Google jelenlegi publisher-követelménye szerint az EEA, Egyesült Királyság és Svájc felhasználói számára személyre szabott AdSense-hirdetések kiszolgálásakor Google által minősített, IAB TCF-integrált CMP szükséges.

Hivatalos Google-források:

- https://support.google.com/adsense/answer/13554116
- https://support.google.com/adsense/answer/10961068
- https://support.google.com/adsense/answer/10960768
- https://support.google.com/adsense/answer/16053245
- https://support.google.com/adsense/answer/10959060

## Account-oldali beállítás az AdSense-ben

A következő lépések 2026. szeptember 16-án ellenőrizve/elvégezve:

1. ✅ Az AdSense-fiók és a `kalkulatorbazis.hu` webhely összerendelése rendben.
2. ✅ **Privacy & messaging / Adatvédelem és üzenetek** megnyitva.
3. ✅ A webhelyhez tartozó **European regulations / Európai szabályozások** üzenet létezik.
4. ✅ Az üzenet **Közzétéve** állapotú és aktív.
5. ✅ **Maximize message coverage / Üzenetlefedettség maximalizálása** aktív.
6. ✅ **Consent Mode hirdetési célokra** aktív.
7. ✅ **Consent Mode analitikai célokra** aktív.
8. ✅ A módosítások mentve.

A hirdetési partnerlista, jogos érdek, RTB-hozzájárulás-ellenőrzés, 2. speciális funkció és saját célok beállításait nem módosítottuk szükségtelenül.

## A repóban alkalmazott fail-closed logika

Az `apply-adsense-eligibility-v2.js` átalakítás után:

- AdSense csak explicit allowlistelt, érdemi tartalmi oldalakon indulhat.
- A 404, kapcsolat, impresszum, adatvédelem, cookie, jogi/felhasználási és egyéb bizalmi oldalak ki vannak zárva.
- A teljes `landing-pages/wise/` partnerterület kezdetben ki van zárva az AdSense-ből.
- Az AdSense-tag az allowlistelt oldalon betöltődhet azért, hogy a Google Privacy & messaging / TCF infrastruktúrája inicializálódhasson.
- Az ad request alapból szünetel.
- A kérés csak akkor engedhető tovább, amikor a TCF API kész állapotot jelez (`tcloaded` vagy `useractioncomplete`), illetve ha a TCF szerint a GDPR nem alkalmazandó.
- Ha a TCF API nem jelenik meg, a kód **nem oldja fel automatikusan** a hirdetési kéréseket.

Ez szándékosan fail-closed működés: hibás vagy hiányzó CMP-konfiguráció esetén inkább ne legyen AdSense-bevétel, mint bizonytalan consent-állapotú hirdetéskérés.

## Élesítés utáni kézi ellenőrzés

EEA/Hungary teszt:

- első látogatáskor megjelenik a Google European regulations üzenete;
- `window.__tcfapi` elérhető;
- döntés előtt `window.KB_ADSENSE_CAN_REQUEST === false`;
- a Google-üzenet rendezése után az állapot `true` lehet, és a Google a TC string szerint kezeli a hirdetési módot;
- kizárt oldalon `window.KB_ADSENSE_ELIGIBLE === false` marad;
- `/landing-pages/wise/wise` oldalon AdSense nem indul;
- a Wise külső kreatívja továbbra is a saját partneri marketing-hozzájáruláshoz kötött;
- a saját „Sütibeállítások” gomb nem állítja magát Google CMP-nek.

## Merge-kapu

A PR merge-érettségéhez:

1. ✅ a Google European regulations üzenet publikálva van a megfelelő AdSense-fiókban;
2. ✅ az account-oldali Maximize message coverage és advertising/analytics Consent Mode beállítás elkészült;
3. ⏳ az AdSense v2 minőségi gate-nek és a teljes site quality/regressziónak zöldnek kell lennie;
4. ⏳ az élesítés után külön runtime ellenőrzés igazolja a Google TCF API tényleges működését.

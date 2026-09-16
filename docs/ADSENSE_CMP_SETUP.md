# AdSense CMP / TCF aktiválási checklist

Ez a dokumentum a Kalkulátor Bázis AdSense Gate v2 ötödik körének account-oldali lépését rögzíti.

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

1. Jelentkezz be abba az AdSense-fiókba, amelyhez a `ca-pub-2639795157074812` publisher ID tartozik.
2. Nyisd meg a **Privacy & messaging / Adatvédelem és üzenetek** részt.
3. Az **European regulations / Európai szabályozások** kártyán hozz létre üzenetet a `kalkulatorbazis.hu` számára.
4. A Google saját CMP-je megfelelő választás; Google szerint ez minősített CMP és IAB TCF-et használ.
5. A felhasználói választásoknál a háromgombos megoldás a legtisztább: **Hozzájárulok / Nem járulok hozzá / Beállítások kezelése**.
6. A célok alapértelmezett állapota ne legyen előre engedélyezve.
7. Engedélyezhető a Google CMP **Consent Mode** integrációja az advertising és – ha ezt akarjuk – az analytics célokra is.
8. Publikáld az üzenetet a Kalkulátor Bázis domainre.
9. Ellenőrizd, hogy a webhelyen megjelenik a Google által biztosított hozzájárulás-visszavonási lehetőség. A lábléc saját „Sütibeállítások” gombja ettől külön, a saját beállításainkat kezeli.
10. Opcionálisan mérlegelhető a Google 2026 szeptemberében bevezetett **Maximize message coverage** beállítása, amely hiányzó TC string esetén fallback üzenetet tud biztosítani.

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

## Élesítés előtti kézi ellenőrzés

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

A PR addig marad draft, amíg:

1. a Google European regulations üzenet nincs publikálva a megfelelő AdSense-fiókban;
2. az EEA teszt nem igazolja a TCF API működését;
3. az AdSense runtime policy audit és a teljes site quality nem zöld.

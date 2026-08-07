# Élesítési ellenőrzőlista

Az alábbi pontok külső szolgáltatói beállítást vagy üzemeltetői döntést igényelnek, ezért pusztán a GitHub-repó módosításával nem zárhatók le.

## Kötelező az élesítés előtt

- [ ] **Google AdSense CMP:** állíts be Google által tanúsított, IAB TCF-et támogató CMP-t az EGT-ből, az Egyesült Királyságból és Svájcból érkező hirdetési forgalomhoz. A saját sütipanel továbbra is kezelheti a webhely egyéb beállításait, de önmagában nem helyettesíti az AdSense által elvárt tanúsított CMP-t. Ellenőrzés: [Google AdSense CMP-követelmények](https://support.google.com/adsense/answer/13554116).
- [ ] **Éles biztonsági fejlécek:** alkalmazd a Cloudflare Response Header Transform szabályokat a [`cloudflare-security-headers.md`](cloudflare-security-headers.md) szerint. A GitHub Pages önmagában nem alkalmazza a repó `_headers` fájlját.
- [ ] **Adatkezelői adatok:** egészítsd ki az adatvédelmi és jogi oldalakat a tényleges postai elérhetőséggel, illetve az alkalmazandó vállalkozói vagy nyilvántartási adatokkal. A végleges szöveget adatvédelmi szakemberrel érdemes ellenőriztetni.
- [ ] **Beküldések megőrzése:** állíts be működő folyamatot, amely a Formspree-ben és a fogadó postafiókban lévő segítségkéréseket legfeljebb 12 hónap után törli, kivéve a dokumentált jogi megőrzési eseteket. A Formspree saját szabályait is ellenőrizd: [Formspree Privacy Policy](https://formspree.io/legal/privacy-policy/).

## Választható Worker-átállás

- [ ] Hozd létre a Resend-fiókot és hitelesítsd a feladói domaint.
- [ ] Állítsd be a Worker `RESEND_API_KEY` titkát, majd telepítsd a `worker/` könyvtárból.
- [ ] Állíts be Cloudflare oldali sebességkorlátot a Worker `/report` végpontjára, és figyeld a visszaélési kísérleteket.
- [ ] A `js/global-head.js` elején add meg a `window.KB_HELP_API_URL` értékét a Worker `/report` végpontjára.
- [ ] Worker-átálláskor frissítsd az adatvédelmi tájékoztató Formspree-hivatkozásait Resendre és Cloudflare-re.

## Kiadás utáni ellenőrzés

- [ ] Futtasd: `npm ci && npm run quality && npm run sitemap`.
- [ ] Ellenőrizd az AdSense Policy Centre-ben, hogy nincs hiányzó vagy nem tanúsított CMP/TCF jelzés.
- [ ] Ellenőrizd a böngésző Network paneljén, hogy Google- és hirdetési kérések nem indulnak a megfelelő hozzájárulás előtt.
- [ ] Teszteld a segítségkérést valós címmel, majd töröld a tesztbeküldést.
- [ ] Ellenőrizd a Cloudflare-en keresztül kapott éles válaszfejléceket.

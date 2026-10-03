# Wise partnerlinkek és mérés

## Megvalósított terv

1. A global-head base registry minden oldalon betölti a közös `js/wise-partner.js` modult.
2. A modul a meglévő EUR kampány jóváhagyott kreatívlinkjeit megtartja, és elhelyezésenként `pubref` címkét ad hozzá.
3. Egy delegált kattintáskezelő egyetlen `wise_partner_click` eseményt küld. A banner és a Wise bemutató korábbi kattintáskezelői megszűntek; a régi `wise_click` esemény helyett ezt kell használni.
4. Az esemény csak a cookie manager aktuális analytics hozzájárulásával mehet a GA4-be. Nincs visszamenőleges eseménysor vagy személyes látogatóazonosító.
5. A Wise bemutató irányválasztója az aktuális használati célt a partnerlinkben és az eseményben is rögzíti. A statikus HTML partnerlinkek JS nélkül is kapnak oldalanként sorszámozott címkét.

## Címkék

Példák: `kb_deviza-atvalto-kalkulator_calculator-after-result`, `kb_wise_hero`, `kb_wise_use_selector_travel`.
Az esemény mezői: `pubref`, `page_path`, `promo_location`, `promo_variant`, `use_case`.
A Partnerize oldalon Pubref szerinti bontásban hasonlítható össze a kattintás és a jogosult konverzió. A GA4 eseményszám consent-függő, ezért nem kell egyeznie a Partnerize kattintásszámával. A régi és új eseményneveket nem szabad összeadni egyedi kattintásszámként.

## Következő lépések

- A módosítás élesítése után ellenőrizni kell egy tényleges, nem tesztből generált kattintás címkéjét a Partnerize riportban. A jogosult tranzakció és jutalék végponttól végpontig csak valódi forgalomból igazolható.
- A meglévő használati célok külön Wise-céloldalra irányítása előtt a Partnerize deeplink-generátorában ellenőrzött, engedélyezett céloldal szükséges. Ez a változtatás a meglévő jóváhagyott kreatívok célpontját megtartja.
- Az első értékelést az elhelyezésenként összegyűlt forgalom alapján kell elvégezni; néhány kattintásból nem lehet megbízható konverziós következtetést levonni.
- Az EUR kampányban a regisztráció 0 CPA. A 10/50 EUR tételek csak az adott, új felhasználóhoz kapcsolódó jogosult műveletekre vonatkoznak; ezeket nem szabad általános regisztrációs jutalékként kommunikálni.

## Ellenőrzés

JS szintaxisellenőrzés és külön jsdom QA: hozzájárulás nélkül nincs esemény; visszavonás azonnal érvényes; beágyazott elem és irányválasztó kattintása egyszer mérődik; dinamikus kalkulátorbanner címkézett; újrafuttatott betöltő nem dupláz; az eredeti kreatívazonosító megmarad.
Partnerize konverziót vagy jutalékkifizetést a QA nem szimulál.

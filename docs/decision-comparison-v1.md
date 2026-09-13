# Döntési mód és A/B összehasonlítás v1

## Döntési mód
- Lakásvásárlási gyorskép: hiteligény, annuitásos becsült törlesztő, saját forrás aránya, jövedelemhez viszonyított terhelés.
- Autós gyorskép: éves üzemanyag, fix költség, értékvesztés, havi és kilométerenkénti költség.
- Megtakarítási gyorskép: jövőérték, saját befizetés, becsült hozamrész és inflációval korrigált érték.

## Összehasonlítás
- Hitel A/B.
- Autó A/B.
- Állásajánlat A/B nettó és effektív órabér alapján.
- Megtakarítás A/B.

## Mentés és megosztás
A számítási összefoglaló legfeljebb 10 elemmel a böngésző localStorage tárhelyén menthető. Nincs szerveroldali adattovábbítás. A megosztás Web Share API-t, ennek hiányában vágólapot használ.

## Aktuális → döntés
A támogatott Aktuális cikkeken a `current-impact.js` kontextusos „Mit jelent ez neked?” blokkot ad a cikkhez, közvetlen kalkulátor- és döntési hivatkozásokkal.

## Fontos korlátok
A gyors döntési mód tájékoztató tervezési becslés. Nem banki hitelbírálat, nem hozamígéret, nem adó- vagy jogszabályi megfelelőségi vizsgálat.

# Üzemeltetési és hozzáférési biztonsági ellenőrzőlista

## GitHub

- Kapcsold be a kétlépcsős azonosítást a GitHub-fiókon.
- A `main` ágon állíts be branch protection szabályt:
  - pull request legyen kötelező;
  - közvetlen push tiltása;
  - force push tiltása;
  - branch törlésének tiltása;
  - beszélgetések feloldása merge előtt;
  - CODEOWNERS-jóváhagyás kérése, amikor elérhető.
- Actions általános jogosultsága legyen `Read repository contents permission`.
- A workflow-k csak a szükséges minimális `permissions` értékeket kapják.
- A nem használt GitHub Appokat, deploy kulcsokat és személyes tokeneket töröld.
- Secret scanning és push protection legyen bekapcsolva, ha a csomag és repó támogatja.
- Dependabot security updates legyen bekapcsolva.

## Cloudflare

- Kapcsold be a kétlépcsős azonosítást.
- Használj külön, minimális jogosultságú API tokent; ne Global API Key-t.
- A token csak a szükséges account/zone és Pages/Workers erőforrásokra legyen érvényes.
- Töröld a félbehagyott vagy nem használt Worker-integrációt és deploy tokent.
- Ellenőrizd, hogy a domainhez csak a valóban használt projekt van kötve.
- SSL/TLS mód legyen `Full (strict)`, amikor a forrás támogatja.
- Kapcsold be az `Always Use HTTPS` beállítást.
- A DNS-rekordoknál ne maradjon régi, ismeretlen vagy teszt CNAME/A rekord.
- A `_headers` fájl életbe lépése után ellenőrizd a válaszfejléceket.

## Domain és regisztrátor

- Kapcsold be a kétlépcsős azonosítást a regisztrátornál.
- Domain transfer lock legyen aktív.
- Az adminisztratív e-mail-cím legyen működő és védett.
- Az automatikus megújítás legyen bekapcsolva.
- A helyreállító kódok biztonságos, offline helyen legyenek elmentve.
- DNSSEC bekapcsolása javasolt, ha a regisztrátor és a DNS-szolgáltató támogatja.

## Hozzáférések és titkok

- Minden szolgáltatáshoz külön, egyedi jelszó tartozzon.
- Jelszókezelő használata javasolt.
- API-kulcsot, tokent, `.env` fájlt vagy hitelesítő adatot soha ne commitolj.
- Ha titok mégis bekerült a Git-történetbe, nem elég törölni a fájlból: a kulcsot azonnal vissza kell vonni és újra kell generálni.
- Negyedévente nézd át az aktív sessionöket, alkalmazás-hozzáféréseket és tokeneket.

## Kiadás utáni gyors ellenőrzés

1. Főoldal, kategóriaoldal és legalább három kalkulátor megnyílik.
2. Mobilmenü, sütibeállítások és sötét mód működik.
3. AdSense csak megfelelő hozzájárulás után tölt be.
4. GA4 esemény csak analitikai hozzájárulás után fut.
5. Wise partnerlink megfelelően nyílik meg.
6. Service worker frissül, nincs végtelen újratöltés.
7. A böngésző konzoljában nincs új biztonsági vagy betöltési hiba.
8. A `.well-known/security.txt` elérhető.

## Rendszeres ütemezés

- Havonta: függőségek, sikertelen workflow-k, ismeretlen DNS-rekordok.
- Negyedévente: aktív tokenek, GitHub Appok, Cloudflare jogosultságok, domain-fiók.
- Évente: teljes biztonsági audit és helyreállítási adatok ellenőrzése.

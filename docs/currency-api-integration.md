# Deviza API integráció

A Kalkulátor Bázis devizaváltója 2026-09-30-tól elsődlegesen a saját publikus Currency API-t használja.

## Elsődleges forrás

- API: `https://kalkulator-bazis-currency-api.onrender.com`
- Tömeges árfolyamlekérés: `/api/v1/rates?base=EUR&quotes=HUF,USD,GBP`
- A frontend 3 másodperces timeoutot használ az elsődleges API-hoz, hogy a Render free cold start ne tartsa fel a kalkulátort.

## Tartalék források

1. Frankfurter v2
2. ECB Data API

A meglévő localStorage cache és offline/failure viselkedés megmarad, így az árfolyamváltó egy upstream szolgáltatás átmeneti hibája esetén is használható marad.

## Deploy

A weboldal `main` ága a publikus webhely forrása. A Currency API külön Render web service-ként fut és a saját repójának `main` ágából deployol.

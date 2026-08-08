# WEB-AUTH-001 – Registrace a aktivace zákaznického přístupu

## Metadata

| Položka | Hodnota |
|---|---|
| Stav | Návrh k odbornému a bezpečnostnímu schválení |
| Vlastník procesu | GASTRORADWAN – správce zákaznických přístupů |
| Business Source of Truth | GASTRORADWAN Core / řízená dokumentace |
| Technical Source of Truth | Tento repozitář a navazující EZApp dokumentace |
| Nadřazený požadavek | [Web Issue #3](https://github.com/gastroradwan/github.io/issues/3) |
| Blokátor zpřístupnění dat | [EZApp #196](https://github.com/gastroradwan/EZApp/issues/196) |
| Produkční nasazení | Není tímto dokumentem povoleno |

## 1. Účel

Web `www.gastroradwan.eu` bude veřejným vstupním bodem pro založení uživatelského účtu a žádosti o zákaznický přístup. Registrace nesmí vytvářet paralelní evidenci zákazníků, zapisovat přímo do tabulky `firmy` ani automaticky zpřístupnit existující data.

Uživatel, osoba, subjekt a oprávnění jsou oddělené objekty. Ověření e-mailu potvrzuje vlastnictví e-mailové adresy, nikoli oprávnění zastupovat subjekt.

## 2. Rozsah

### Součást návrhu

- registrace nového účtu,
- aktivace přístupu stávajícího zákazníka,
- identifikace typu subjektu, deklarovaného vztahu a role osoby,
- e-mailové ověření, obnova hesla a stav žádosti,
- ruční schválení nebo bezpečný jednorázový aktivační mechanismus,
- auditní stopa, ochrana proti zneužití a retenční pravidla,
- rozhraní mezi veřejným webem a schváleným backendem.

### Mimo rozsah

- přímé změny produkčního Supabase,
- migrace `firmy` na `party`,
- administrace účtů uvnitř EZApp,
- automatické schválení podle IČO, názvu nebo domény e-mailu,
- zpřístupnění zákaznických dat před dokončením a negativním otestováním EZApp #196.

## 3. Vstupní cesty

### A. Registrovat nový účet

Určeno novému zájemci nebo osobě bez aktivačních údajů. Výsledkem je ověřený účet a registrační žádost ve stavu čekajícím na posouzení. Nevzniká automaticky `party`.

### B. Aktivovat přístup stávajícího zákazníka

Určeno osobě, která žádá o propojení s existujícím zákazníkem. Žadatel může uvést IČO, interní zákaznický identifikátor nebo jednorázový kód. Veřejná odpověď nesmí prozradit, zda subjekt v evidenci existuje.

## 4. Formulářová pole a validace

### 4.1 Účet a osoba

| Pole | Povinnost | Validace a pravidlo |
|---|---:|---|
| Jméno | ano | 2–100 znaků, bez číslic jako jediného obsahu |
| Příjmení | ano | 2–100 znaků |
| E-mail | ano | syntaktická kontrola, normalizace malých písmen, ověření odkazem |
| Telefon | ano | mezinárodní formát, normalizace; není autentizačním důkazem |
| Heslo | ano | zpracuje výhradně schválený Auth proces; neukládat do aplikačních tabulek ani logů |
| Souhlas s podmínkami | ano | verze textu, čas a zdroj souhlasu |
| Seznámení s ochranou osobních údajů | ano | verze informačního textu a čas potvrzení |
| Marketingový souhlas | ne | samostatný, nepředvolený a odvolatelný |

### 4.2 Subjekt

| Pole | Povinnost | Validace a pravidlo |
|---|---:|---|
| Typ subjektu | ano | společnost / OSVČ / SVJ či družstvo / veřejná organizace / fyzická osoba |
| Název nebo jméno subjektu | ano | 2–200 znaků |
| IČO | podmíněně | povinné, pokud bylo přiděleno; 8 číslic a kontrola formátu |
| Země registrace | podmíněně | povinná mimo český rejstřík |
| Deklarovaný vztah | ano | nový zájemce / stávající zákazník / partner či dodavatel |
| Role osoby | ano | vlastník/jednatel / zaměstnanec / správce / objednatel / technický pracovník / jiná pověřená osoba |
| Upřesnění jiné role | podmíněně | povinné při volbě „jiná pověřená osoba“ |
| Důvod přístupu | ano pro aktivaci | 10–1000 znaků |

### 4.3 Aktivační údaje

| Pole | Povinnost | Pravidlo |
|---|---:|---|
| Zákaznický identifikátor | ne | nesmí být veřejně ověřitelný samostatným vyhledáváním |
| Jednorázový aktivační kód | ne | omezená platnost, jedno použití, hashované uložení, omezení pokusů |
| Požadovaný rozsah | ano | provozovna / zakázka / zařízení / dokumenty; pouze žádost, nikoli automatické oprávnění |

## 5. Stavový model

```text
draft
  -> email_pending
  -> pending_review
  -> more_information_required -> pending_review
  -> approved -> linked_to_party -> active
  -> rejected
  -> expired
  -> cancelled
```

- `draft`: rozpracovaná žádost, bez zákaznických oprávnění.
- `email_pending`: čeká na ověření e-mailu.
- `pending_review`: připravena k posouzení správcem.
- `more_information_required`: správce vyžádal doplnění.
- `approved`: žádost schválena, ale vazba a rozsah ještě nemusí být aktivní.
- `linked_to_party`: existuje schválená vazba na cílový `party_id`.
- `active`: oprávnění je aktivní a prošlo kontrolou bezpečnostních podmínek.
- `rejected`, `expired`, `cancelled`: koncové stavy bez přístupu.

Přechody prováděné správcem musí obsahovat identitu správce, čas, důvod a změnovou stopu.

## 6. Koncepční datový model

| Objekt | Účel | Zásadní pravidlo |
|---|---|---|
| Auth user | autentizace | spravuje Supabase Auth |
| Person profile | kontaktní profil osoby | není zákaznickým subjektem |
| Registration request | údaje a stav žádosti | veřejný uživatel vidí pouze vlastní žádost |
| Party | autoritativní subjekt | nevzniká automaticky z veřejného formuláře |
| User–party membership | vazba osoby k subjektu | vzniká až po ověření a schválení |
| Access grant | rozsah a role | nejmenší nutné oprávnění, časová platnost |
| Audit event | dohledatelnost | append-only log schválených událostí |

Do dokončení cílového modelu `party_id` může specifikace sloužit pouze jako kontrakt. Nesmí se nahradit přímým zápisem do `firmy`.

## 7. Rozhraní web → backend

Veřejný web smí komunikovat jen se schváleným backendovým rozhraním. Klient nesmí používat servisní klíč ani provádět přímé privilegované dotazy.

Minimální logické operace:

| Operace | Autentizace | Výsledek |
|---|---|---|
| Vytvořit účet | veřejná s ochranou proti botům | Auth účet bez zákaznických dat |
| Ověřit e-mail | jednorázový token | potvrzený e-mail |
| Vytvořit žádost | přihlášený uživatel | vlastní žádost |
| Načíst stav žádosti | vlastník žádosti | obecný stav bez interních poznámek |
| Doplnit žádost | vlastník ve schváleném stavu | auditovaná změna |
| Zrušit žádost | vlastník | stav `cancelled` |
| Posoudit žádost | oprávněný správce | auditovaný přechod stavu |
| Aktivovat vazbu | oprávněný správce / bezpečný kód | explicitní membership a access grant |

Všechny veřejné odpovědi při hledání shody musí být neutrální. Systém nesmí potvrdit existenci firmy, účtu, IČO ani konkrétního zákaznického vztahu.

## 8. Oprávnění

- Nepřihlášený uživatel může zahájit Auth proces, nikoli číst žádosti nebo zákaznická data.
- Přihlášený žadatel může číst a měnit pouze svou žádost a jen v povolených stavech.
- Správce registrací může posuzovat žádosti, ale nemá automaticky plný přístup ke všem odborným dokumentům.
- Přidělení `party_id` a rozsahu přístupu jsou dvě samostatná rozhodnutí.
- Přístup k provozovnám, zakázkám, zařízením a dokumentům musí být odvozen z explicitních grantů a chráněn RLS.
- Zamítnutý, zrušený nebo expirovaný požadavek nesmí ponechat aktivní oprávnění.

## 9. Bezpečnost

- rate limiting podle účtu, IP a rizikových signálů,
- ochrana proti botům bez nadměrného sledování uživatele,
- krátká platnost ověřovacích a aktivačních tokenů,
- jednorázovost tokenů a hashované uložení,
- jednotné veřejné chybové odpovědi proti enumeraci,
- oddělení interního důvodu rozhodnutí od sdělení žadateli,
- žádné tajné klíče v repozitáři, prohlížeči ani klientských logách,
- audit změn rolí a přístupů,
- bezpečné odvolání relací po odebrání oprávnění,
- negativní testy RLS před aktivací portálu.

## 10. Auditní události

Minimálně se zaznamenají:

- vytvoření a odeslání žádosti,
- odeslání a úspěch/neúspěch e-mailového ověření bez uložení tokenu,
- změna stavu,
- vyžádání a doplnění údajů,
- pokus o použití aktivačního kódu a jeho výsledek bez zveřejnění kódu,
- přiřazení nebo odebrání `party_id`,
- vytvoření, změna a zrušení access grantu,
- správce a důvod schválení či zamítnutí,
- bezpečnostní blokace a rate-limit událost.

Auditní záznam nesmí ukládat hesla, tokeny ani nadbytečný obsah osobních údajů.

## 11. Ochrana osobních údajů a retence

Před implementací musí být schváleny účely zpracování, právní tituly, informační texty, doby uchování a proces uplatnění práv subjektu údajů.

Výchozí návrh:

- neověřená registrace: automatické odstranění po krátké definované lhůtě,
- zamítnutá nebo nedokončená žádost: omezená retenční lhůta podle schváleného účelu,
- aktivní účet: uchování po dobu trvání vztahu a nezbytné navazující lhůty,
- audit bezpečnostních rozhodnutí: samostatná zdůvodněná retenční lhůta,
- marketingový souhlas: samostatná evidence, která není podmínkou registrace.

Konkrétní lhůty musí před produkcí schválit odpovědná osoba; nesmějí být doplněny odhadem vývojáře.

## 12. Uživatelské obrazovky

1. Rozcestník: „Registrovat nový účet“ / „Aktivovat přístup stávajícího zákazníka“.
2. Údaje osoby a účtu.
3. Typ subjektu, deklarovaný vztah a role.
4. Identifikace subjektu a případný aktivační údaj.
5. Rekapitulace a souhlasy.
6. Výzva k ověření e-mailu.
7. Stav žádosti s neutrálními sděleními.
8. Bezpečné doplnění údajů.
9. Výsledek posouzení a případná aktivace.

Formulář musí být přístupný z klávesnice, mít srozumitelné popisky, chybové souhrny a nespoléhat jen na barvu.

## 13. Chybové stavy

- e-mail již může být použit: zobrazit bezpečný postup přihlášení/obnovy bez potvrzení existence účtu,
- neplatný či expirovaný token: nabídnout nové zaslání s omezením frekvence,
- možná shoda subjektu: veřejně pouze sdělit, že žádost bude posouzena,
- více shod: předat správci bez zveřejnění kandidátů,
- vyčerpaný počet pokusů aktivačního kódu: dočasná blokace a audit,
- nedostupný backend: žádost nepotvrdit jako uloženou, nabídnout bezpečné opakování,
- schválení bez oprávnění: nepovolit přechod do `active`.

## 14. Testovací scénáře

### Funkční

- obě registrační cesty,
- e-mailové ověření a obnova hesla,
- doplnění žádosti,
- schválení, zamítnutí, zrušení a expirace,
- přiřazení více rolí s různým rozsahem,
- odebrání oprávnění.

### Negativní bezpečnostní

- uživatel A nesmí číst ani měnit žádost uživatele B,
- účet ve stavu `pending` nesmí číst žádná zákaznická data,
- znalost IČO nebo e-mailu nesmí prozradit existenci zákazníka,
- shoda názvu, IČO nebo domény nesmí sama vytvořit vazbu,
- opakované a expirované tokeny musí být odmítnuty,
- klientský požadavek nesmí nastavit `approved`, `party_id` ani přístupový grant,
- odebraný grant musí okamžitě přestat fungovat,
- `anon` ani běžný `authenticated` uživatel nesmí obejít RLS,
- logy nesmějí obsahovat hesla, tokeny ani servisní klíče.

## 15. Rollout a rollback

### Rollout

1. schválení specifikace,
2. dokončení modelu `party_id` a RLS #196,
3. podřízená implementační Issues,
4. implementace ve vývojovém prostředí,
5. automatické a ruční bezpečnostní testy,
6. Preview deployment,
7. pilot s interními testovacími účty,
8. samostatné GO/NO-GO rozhodnutí,
9. produkční nasazení dohledatelné ke commitu.

### Rollback

- okamžitě vypnout veřejné vytvoření žádostí feature flagem,
- ponechat přihlášení vypnuté pro zákaznická data, pokud nelze garantovat RLS,
- odvolat nově vydané granty a relace,
- zachovat auditní stopu incidentu,
- neprovádět destruktivní mazání dat bez schváleného postupu obnovy.

## 16. Blokátory a rozhodovací brány

### Návrh lze schválit, pokud

- je sladěn s GDS-001 a cílovým `party_id`,
- vlastníci procesu a dat potvrdí odpovědnosti,
- bezpečnostní a GDPR části mají určeného schvalovatele.

### Implementaci lze zahájit, pokud

- jsou vytvořena podřízená Issues,
- existuje schválený backendový a datový kontrakt,
- změny databáze jsou navrženy jako verzované migrace.

### Produkci lze aktivovat pouze pokud

- EZApp #196 je dokončeno a negativně otestováno,
- RLS pro všechny dostupné zákaznické objekty prokazatelně izoluje data,
- existuje schválený proces administrace žádostí,
- je ověřen backup/restore a rollback,
- proběhlo samostatné GO rozhodnutí.

## 17. Akceptační kritéria specifikace

- [x] dvě vstupní cesty jsou oddělené,
- [x] typ subjektu, vztah a role osoby jsou definovány,
- [x] pole a validace jsou popsány,
- [x] registrace nezapisuje do `firmy` ani automaticky nevytváří `party`,
- [x] stavový model odděluje e-mailové ověření, schválení a aktivní přístup,
- [x] je popsána ochrana proti enumeraci,
- [x] oprávnění a auditní události jsou specifikovány,
- [x] jsou definovány negativní bezpečnostní testy,
- [x] rollout je blokován do dokončení #196,
- [ ] vlastník procesu dokument schválil,
- [ ] bezpečnostní návrh byl schválen,
- [ ] GDPR texty a konkrétní retenční lhůty byly schváleny,
- [ ] vznikla podřízená implementační Issues.

## 18. Návaznosti

- [Web #3 – WEB-AUTH-001](https://github.com/gastroradwan/github.io/issues/3)
- [EZApp #38 – bezpečnostní model a RLS portálu](https://github.com/gastroradwan/EZApp/issues/38)
- [EZApp #41 – administrace a schvalování účtů](https://github.com/gastroradwan/EZApp/issues/41)
- [EZApp #194 – inventura závislostí na firmy](https://github.com/gastroradwan/EZApp/issues/194)
- [EZApp #195 – cílový party model](https://github.com/gastroradwan/EZApp/issues/195)
- [EZApp #196 – RLS a náprava neomezených politik](https://github.com/gastroradwan/EZApp/issues/196)
- [EZApp #197 – Customer 360 a zákaznické přístupy](https://github.com/gastroradwan/EZApp/issues/197)

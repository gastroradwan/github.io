# SPEC_GASTRORADWAN_PUBLIC_WEB

**Systém:** GASTRORADWAN – Web – gastroradwan.eu  
**Repozitář:** `gastroradwan/github.io`  
**Nadřazený dokument:** `GDS-001_GASTRORADWAN_ENTERPRISE_BLUEPRINT.md`  
**Nadřazené Issue:** `gastroradwan/gastroradwan-core#13 – INT-001`  
**Řídicí Issue:** `gastroradwan/github.io#4 – WEB-001`  
**Stav:** Návrh ke schválení

## 1. Účel

Veřejný web `www.gastroradwan.eu` je oficiální veřejná prezentace společnosti GASTRORADWAN s.r.o. a vstupní bod pro poptávky odborných služeb.

Web slouží k:

- prezentaci společnosti a odborné způsobilosti,
- prezentaci odborných služeb,
- vysvětlení systému správy elektro bezpečnosti,
- získávání strukturovaných poptávek,
- představení EZApp,
- přesměrování oprávněných uživatelů do EZApp,
- poskytování veřejných odborných a kontaktních informací.

Web není provozní ERP, CRM ani zákaznická databáze.

## 2. Závazné principy

Řešení se řídí GDS-001 a principy:

- Digital First,
- Single Source of Truth,
- No Duplication,
- Process First,
- Security and Integration by Design,
- auditovatelnost a verzování.

Žádná funkce webu nesmí vytvářet paralelní evidenci zákazníků, provozoven, zařízení, zakázek, dokumentů nebo uživatelů.

## 3. Hranice systému a zdroje pravdy

### Web vlastní

- veřejný obsah,
- katalog služeb,
- veřejné kontaktní údaje,
- SEO metadata,
- veřejné analytické události,
- technickou konfiguraci webu.

### Web nevlastní

- zákazníky a kontaktní osoby,
- provozovny, objekty a zařízení,
- revize, harmonogramy, závady a zakázky,
- zákaznické dokumenty,
- uživatelské účty, role a oprávnění,
- ceny, zásoby, faktury a účetní doklady.

### Autoritativní systémy

- **EZApp:** Customer 360, provozní vztahy, zařízení, revize, harmonogramy, dokumenty, příchozí poptávky a zákaznické účty.
- **Premier:** produkty, ceny, zásoby, faktury a účetní doklady.
- **GitHub:** zdrojový kód, technická dokumentace a historie změn.
- **SharePoint:** schválená strategická a procesní dokumentace.
- **GASTRORADWAN Core:** architektonická a systémová rozhodnutí.

## 4. Cílové skupiny

- výrobní a průmyslové společnosti,
- vlastníci a provozovatelé budov,
- správci nemovitostí,
- techničtí a facility manažeři,
- osoby odpovědné za elektrická zařízení,
- zaměstnavatelé zajišťující odbornou způsobilost,
- společnosti připravující se na OIP, TIČR, audit nebo kontrolu pojišťovny,
- stávající zákazníci přecházející do EZApp.

## 5. Cílová informační architektura

Hlavní navigace:

1. Úvod
2. Služby
3. Pro firmy a průmysl
4. Správa elektro bezpečnosti
5. EZApp
6. O společnosti
7. Poptávka
8. Přihlášení
9. Kontakt

Navigace, patička, katalog služeb a sitemap musí být cílově spravovány z jednoho zdroje.

## 6. Katalog odborných služeb

### Správa a odborné zastřešení

- Správa elektro bezpečnosti
- Garant elektro
- Harmonogramy revizí, kontrol a školení
- Příprava na OIP, TIČR, audity a kontroly pojišťoven
- Kontrola úplnosti elektro dokumentace
- Pasportizace elektrických zařízení

### Revize a kontroly

- Revize elektrických instalací a rozváděčů
- Revize elektrických strojů a technologických zařízení
- Revize zařízení ochrany před bleskem a LPS
- Kontroly elektrických spotřebičů
- Revize zařízení v prostředí s nebezpečím výbuchu
- Revize zařízení NN, VN a VVN v rozsahu oprávnění společnosti

### Dokumentace a odborná posouzení

- Řád prohlídek, údržby a revizí elektrických zařízení dle § 7 NV č. 190/2022 Sb.
- Výpočet rizika ztrát způsobených úderem blesku dle ČSN EN 62305-2 ed. 2
- Návrh a dokumentace LPS
- Dokumentace skutečného provedení
- Protokoly o určení vnějších vlivů
- Kontrola a doplnění provozní dokumentace
- Odborné posouzení stávajícího stavu elektro bezpečnosti

### Školení

- Školení podle NV č. 194/2022 Sb.
- Evidence školení a termínů
- Odborné firemní vzdělávání

## 7. Standard stránky služby

Každá služba musí obsahovat:

1. jednoznačný název,
2. cílového zákazníka,
3. problém, který služba řeší,
4. rozsah služby,
5. požadované vstupní podklady,
6. postup realizace,
7. předávané výstupy,
8. odpovědnosti stran,
9. omezení služby,
10. související služby,
11. návaznost na EZApp,
12. výzvu k poptávce,
13. odborně a právně ověřené formulace.

Web nesmí slibovat výsledek závislý na stavu zařízení, součinnosti zákazníka nebo rozhodnutí kontrolního orgánu.

## 8. Poptávkový proces

Cílový tok:

`www formulář → veřejný serverový endpoint EZApp → inbound request → auditní událost → ruční kontrola → přiřazení nebo převod do Customer 360`

Pravidla:

- žádný přímý zápis do Customer 360,
- žádný tajný klíč v HTML nebo klientském JavaScriptu,
- žádné automatické vytvoření zákazníka,
- žádné automatické slučování subjektů,
- idempotence a rate limiting,
- auditní stopa,
- obecná veřejná odpověď bez prozrazení existence zákazníka,
- bez příloh ve fázi 1.

Minimální povinná pole:

- kontaktní osoba,
- e-mail,
- telefon,
- typ služby,
- popis požadavku,
- potvrzení seznámení se zpracováním osobních údajů.

Volitelně:

- firma, IČO, DIČ,
- místo zakázky,
- požadovaný termín a důvod,
- preferovaný kontakt,
- zdrojová stránka.

## 9. EZApp a přihlášení

Veřejný web nesmí implementovat vlastní autentizaci. Po spuštění zákaznických rolí bude položka „Přihlášení“ směřovat na schválenou adresu EZApp, předpokládaně `https://ez.gastroradwan.eu/login`.

EZApp je jediným vlastníkem registrace, autentizace, obnovy hesla, relací, přiřazení uživatele k organizaci, rolí, RLS a přístupu k dokumentům.

## 10. Ochrana osobních údajů a cookies

Před spuštěním formuláře musí být publikovány a schváleny informace o:

- účelu a právním titulu zpracování,
- rozsahu získávaných údajů,
- době uchování,
- příjemcích a zpracovatelích,
- uplatnění práv subjektu údajů,
- kontaktních údajích správce.

Souhlas pro marketing nesmí být spojen s vyřízením poptávky.

Analytika musí umožnit odmítnutí, pozdější změnu rozhodnutí a odvolání souhlasu. Analytické události nesmí obsahovat osobní ani zákaznická provozní data.

## 11. SEO, strukturovaná data a přístupnost

Každá veřejná stránka musí mít:

- jedinečný `<title>` a meta description,
- canonical URL,
- jeden hlavní nadpis `<h1>`,
- logickou strukturu nadpisů,
- správný jazyk dokumentu,
- interní odkazy,
- Open Graph metadata u významných stránek.

Sitemap musí být generována z jednoho katalogu veřejných stránek. `lastmod` musí odpovídat skutečné změně nebo být vynechán.

Po ověření údajů lze použít `Organization`, `Service`, `BreadcrumbList` a případně `FAQPage` pouze pro skutečně viditelný obsah.

Web musí podporovat ovládání klávesnicí, viditelný focus, dostatečný kontrast, textové alternativy obrázků, správné labely formulářů, srozumitelné chyby a responzivní zobrazení.

## 12. Bezpečnost

Zakázáno je zejména:

- ukládání tajných klíčů v repozitáři,
- přímý anonymní zápis do interních databází,
- zveřejnění interních identifikátorů,
- zveřejnění zákaznických dokumentů nebo neveřejných referencí,
- přímý zásah do databáze Premieru,
- obcházení integrační vrstvy EZApp.

Veřejný repozitář smí obsahovat pouze informace určené ke zveřejnění.

## 13. Git workflow a CI

Každá významná změna musí projít:

1. schváleným návrhem,
2. GitHub Issue,
3. pracovní větví,
4. Pull Requestem,
5. automatickými kontrolami,
6. odbornou a obsahovou kontrolou,
7. Preview kontrolou,
8. schválením,
9. merge,
10. produkční kontrolou a dokumentací změny.

Přímé významné změny do `main` jsou zakázány.

CI se musí spouštět při každém Pull Requestu a kontrolovat minimálně:

- interní odkazy a assets,
- HTML syntaxi,
- title, meta description a canonical URL,
- duplicity title,
- sitemap,
- základní přístupnost,
- zakázané klíče a tajné údaje.

CI nesmí automaticky přepisovat produkční obsah ani vytvářet opravné commity do `main`.

## 14. Deployment

Současný stav:

- GitHub Pages,
- zdroj `main` a cesta `/`,
- doména `www.gastroradwan.eu`,
- vynucené HTTPS.

Do rozhodnutí o migraci bude GitHub Pages zachován, ale změny musí probíhat přes Pull Request a kontrolovaný merge.

Samostatně bude posouzen Vercel kvůli Preview deploymentům, dohledatelnosti ke commitu, rollbacku a případným serverovým funkcím. Migrace vyžaduje rozhodnutí GASTRORADWAN Core, DNS plán, SEO plán a rollback plán.

## 15. Obsahové řízení a reference

Vlastník odborného obsahu odpovídá za odbornou správnost, aktuálnost právních odkazů, rozsah oprávnění a nezavádějící tvrzení.

Bez oprávnění nesmí být zveřejněny názvy zákazníků, interní provozní údaje, fotografie provozu, technologie zákazníka, revizní zprávy, naměřené hodnoty ani závady.

## 16. Implementační fáze

- **WEB-001:** specifikace a governance
- **WEB-002:** bezpečný Git workflow a CI
- **WEB-003:** cílová informační architektura a odstranění překryvů
- **WEB-004:** nové odborné služby
- **WEB-005:** ochrana osobních údajů, cookies a analytika
- **WEB-006:** integrace poptávek s EZApp
- **WEB-007:** rozhodnutí GitHub Pages versus Vercel a migrační plán

Závislosti WEB-006:

- `gastroradwan/EZApp#81 – WEB-INT-001A`
- `gastroradwan/github.io#2 – WEB-INT-001C`

## 17. Akceptační kritéria

- web má jasně vymezené hranice,
- každý datový objekt má jednoho vlastníka,
- web nevytváří duplicitní zákazníky,
- poptávky procházejí schváleným endpointem EZApp,
- změny probíhají přes Issue a Pull Request,
- produkční větev není automaticky přepisována,
- existují automatické kontroly,
- služby mají jednotnou strukturu,
- právní a cookie informace jsou zveřejněny,
- přihlášení směřuje do EZApp,
- deployment je dohledatelný a má rollback postup.

## 18. Omezení do schválení

Do schválení této specifikace nejsou povoleny významné obsahové, architektonické ani integrační změny produkčního webu.

Povoleny jsou pouze urgentní opravy nedostupnosti, bezpečnostní chyby, nefunkčního odkazu, nesprávného kontaktního údaje nebo závažně nesprávné odborné či právní informace. Každá urgentní oprava musí být zdokumentována.

# WEB-003 – Informační architektura veřejného webu

**Issue:** #10  
**Stav:** návrh k odbornému a obsahovému schválení  
**Produkční dopad:** žádný – tento dokument nemění veřejné HTML.

## 1. Cíl

Cílem je dát každé veřejné stránce jednoznačnou roli, odstranit obsahové překryvy a zachovat odborně a SEO hodnotný obsah. Implementace následuje až po schválení tohoto návrhu.

## 2. Cílová hlavní navigace

1. Úvod
2. Služby
3. Pro firmy a průmysl
4. Správa elektro bezpečnosti
5. EZApp
6. O společnosti
7. Poptávka
8. Přihlášení
9. Kontakt

## 3. Inventura současných URL

| Současná URL | Rozhodnutí | Cílová role / poznámka |
|---|---|---|
| / | PŘEPRACOVAT | Homepage; stručný vstup do služeb, systémové správy, EZApp a poptávky. |
| /sluzby.html | PONECHAT + PŘEPRACOVAT | Jediný hlavní katalog odborných služeb. |
| /sprava-elektro-bezpecnosti.html | PONECHAT + PŘEPRACOVAT | Samostatná systémová služba dlouhodobé správy. |
| /garant-elektro.html | PONECHAT + PŘEPRACOVAT | Samostatná služba odborného garanta. |
| /pro-firmy.html | PŘEPRACOVAT | Hlavní landing page „Pro firmy a průmysl“; převzít relevantní obecný obsah z povinností firmy. |
| /pro-prumysl.html | PONECHAT + PŘEPRACOVAT | Specializovaný průmyslový landing page; zachovat specifika NN/VN/VVN/Ex/technologie. |
| /revize-elektrickych-zarizeni.html | PONECHAT + PŘEPRACOVAT | Samostatná služba revizí elektrických zařízení. |
| /revize-hromosvodu.html | PONECHAT + PŘEPRACOVAT | Samostatná služba LPS/uzemnění; WEB-004 doplní nové LPS služby. |
| /revize-stroju-technologii.html | PONECHAT + PŘEPRACOVAT | Samostatná služba strojů a technologií. |
| /dokumentace-pro-firmy.html | PONECHAT + PŘEPRACOVAT | Samostatná skupina dokumentace a odborných posouzení. |
| /povinnosti-firmy-elektro.html | SLOUČIT / PŘESMĚROVAT | Výrazný překryv s /pro-firmy.html a správou elektro bezpečnosti. Obsah nejprve migrovat, poté redirect na /pro-firmy.html. |
| /kontroly-oip-ticr-audity.html | PONECHAT + PŘEPRACOVAT | Samostatná služba dokladové připravenosti na kontroly/audity. |
| /harmonogramy-revizi.html | PONECHAT + PŘEPRACOVAT | Samostatná služba řízení termínovaných povinností. |
| /skoleni-nv-194-2022.html | PONECHAT + PŘEPRACOVAT | Samostatná služba školení. |
| /ezapp.html | PŘEPRACOVAT PRIORITNĚ | Opravit stav: interní EZApp je provozovaný; zákaznický přístup/registrace zatím nejsou produkčně zpřístupněny. |
| /prihlaseni.html | PONECHAT + PŘEPRACOVAT | Do aktivace zákaznického přístupu pouze stavová/informační stránka; autentizace patří EZApp. |
| /o-spolecnosti.html | PONECHAT + PŘEPRACOVAT | Hlavní firemní profil, historie, hodnoty, odbornost. |
| /proc-gastroradwan.html | SLOUČIT / PŘESMĚROVAT | Silný překryv s homepage a /o-spolecnosti.html; unikátní důvody převést do O společnosti, poté redirect. |
| /opravneni.html | PONECHAT + OVĚŘIT | Ověřit aktuálnost veřejných údajů a rozsahů před další publikací. |
| /pripadove-oblasti-reference.html | PONECHAT + PŘEPRACOVAT | Reference/oblasti zkušeností bez citlivých údajů zákazníků. |
| /pusobnost-reference.html | PONECHAT + PŘEPRACOVAT | Geografická působnost; odlišná role od případových oblastí. |
| /spoluprace.html | PONECHAT + PŘEPRACOVAT | Nábor/partnerská síť odborníků; oddělit od zákaznického katalogu služeb. |
| /poptavka.html | PONECHAT + PŘEPRACOVAT | Do WEB-006 současný bezpečný kontaktní režim; cílově strukturovaná poptávka přes EZApp endpoint. |
| /kontakt.html | PONECHAT + PŘEPRACOVAT | Autoritativní veřejná kontaktní stránka. |

## 4. Hlavní obsahové překryvy

### Pro firmy × Povinnosti firmy
Obě stránky vysvětlují revize, dokumentaci, školení, harmonogramy, evidenci a kontroly. Cílově bude /pro-firmy.html hlavní obecný landing page a unikátní obsah z /povinnosti-firmy-elektro.html se do něj řízeně převede.

### O společnosti × Proč GASTRORADWAN × homepage
„Proč GASTRORADWAN“ opakuje systémový přístup, průmyslovou praxi, oprávnění, harmonogramy, dokumentaci a EZApp. Unikátní důvěryhodnostní obsah patří do /o-spolecnosti.html; homepage má pouze stručný výběr.

### Pro firmy × Pro průmysl
Neslučovat bez dalšího. /pro-firmy.html je obecný vstup pro organizace, správce a provozovatele. /pro-prumysl.html má samostatný odborný a SEO záměr pro výrobní/technologické provozy, NN/VN/VVN a Ex.

### Reference
/pripadove-oblasti-reference.html popisuje typy odborných zkušeností; /pusobnost-reference.html geografickou působnost. Zatím zachovat obě role, ale odstranit duplicitní obecné texty.

## 5. EZApp – povinná korekce sdělení

Veřejný web musí důsledně rozlišovat:
- **EZApp interní aplikace:** již provozovaná;
- **zákaznický portál / veřejná registrace:** zatím není produkčně zpřístupněna;
- autentizace, role, RLS a zákaznická data jsou výhradně odpovědností EZApp;
- produkční zákaznický přístup je NO-GO do splnění bezpečnostních gate dle řídicí specifikace.

## 6. Redirect plán – návrh

Po obsahové migraci a schválení:
- `/povinnosti-firmy-elektro.html` → `/pro-firmy.html`;
- `/proc-gastroradwan.html` → `/o-spolecnosti.html`.

Redirecty nesmí být nasazeny před kontrolou interních odkazů, sitemap, canonical URL a zachování hodnotného obsahu.

## 7. Další krok

Před produkční implementací:
1. odborně schválit tuto inventuru;
2. v WEB-004 doplnit cílový katalog nových odborných služeb;
3. připravit implementační PR po logických skupinách;
4. u každého sloučení nejprve přenést unikátní obsah a až potom zavést redirect;
5. po každém merge ověřit CI, GitHub Pages, odkazy, sitemap a canonical URL.
